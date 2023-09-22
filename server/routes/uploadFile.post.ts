import { uploadSingleFile, uploadLargeFile } from "../cos";
import { getHeaders } from "h3";

import { parseFile } from "../parseFile";
import { genRandomStr } from "~/utils";
import { tmpdir } from "os";
import {
  ReadStream,
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  unlinkSync,
} from "fs";
import { join } from "path";
import { pipeline } from "stream/promises";
import {
  UPLOAD_FILE_MAX_SIZE,
  UPLOAD_SINGLE_FILE_SIZE,
  PER_MB,
  CHUNK_NUM,
} from "~/constant";
import { isSupportUploadFile } from "~/utils/upload";

const FINAL_FILE = "__final_file";

const SIGNLE_CHUNK_MAX_SIZE = UPLOAD_FILE_MAX_SIZE / CHUNK_NUM;

export default defineEventHandler(async (event) => {
  const {
    _single,
    _type,
    _chunkindex,
    _chunksnumber,
    _filename = "",
    _uploadsymbol,
    _filetype,
  } = getHeaders(event);

  const { buf, suffix } = await parseFile(event);

  const isSingle = !!_single;

  if (
    (buf && isSingle && buf?.length > UPLOAD_SINGLE_FILE_SIZE) ||
    (buf && !isSingle && buf?.length > SIGNLE_CHUNK_MAX_SIZE)
  ) {
    return {
      success: false,
      rt: "Fail",
      data: null,
      msg: `文件上传不得超过${
        isSingle ? UPLOAD_SINGLE_FILE_SIZE : UPLOAD_FILE_MAX_SIZE / PER_MB
      }M`,
    };
  }

  if (!isSupportUploadFile({ type: _filetype } as File)) {
    return {
      success: false,
      rt: "Fail",
      data: null,
      msg: `当前文件类型仅支持图片和markdown！`,
    };
  }

  if (isSingle) {
    return await isSingleFile({
      type: _type as any,
      buf: buf as Buffer,
      suffix,
    });
  } else {
    const chunkIndex = parseInt(_chunkindex as string);
    const chunkLength = parseInt(_chunksnumber as string);

    return await isSliceFile({
      chunkIndex,
      chunkLength,
      buf: buf as Buffer,
      uploadSymbol: _uploadsymbol as string,
      type: _type as any,
      fileType: _filetype as string,
    });
  }
});

async function writeStreamIntoFile(
  dirpath: string,
  index: number,
  buf: Buffer
) {
  return new Promise((resolve, reject) => {
    const filepath = join(dirpath, `_${index}`);

    if (existsSync(filepath) && statSync(filepath).size >= buf.length) {
      resolve(null);
      return;
    }

    const stream = createWriteStream(filepath);
    stream.setMaxListeners(20);

    stream.on("error", (error) => {
      console.error(
        "someting went wrong when write slice stream into file",
        error
      );
      reject(error);
      unlinkSync(filepath);
      stream.close();
      stream.removeAllListeners();
    });

    stream.on("finish", () => {
      resolve(null);
      stream.close();
      stream.removeAllListeners();
    });
    stream.write(buf);
    stream.end();
    stream.close();
  });
}

async function mergeFiles(dirpath: string, files: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const finalFilePath = join(dirpath, `${FINAL_FILE}`);
    const writeStream = createWriteStream(finalFilePath);
    writeStream.setMaxListeners(20);
    try {
      let state = true;

      writeStream.on("finish", async () => {
        if (state) {
          resolve(finalFilePath);
        } else {
          await unlinkSync(finalFilePath);
          reject("write stream error when merge into final file");
        }
        writeStream.close();
        writeStream.removeAllListeners();
      });

      writeStream.on("error", (err) => {
        console.log(`write stream error when merge into final file`, err);
        writeStream.close();
        writeStream.removeAllListeners();

        throw new Error("write stream error when merge into final file");
      });

      async function toMerge() {
        for (const filename of files) {
          if (!state) break;
          const readStream = createReadStream(
            join(dirpath, filename)
          ) as ReadStream;
          await pipeline(readStream, writeStream, {
            end: filename === files[files.length - 1],
          });
          readStream.on("error", async (err) => {
            console.log(`readStream error when merge files`, err);
            state = false;
            await unlinkSync(finalFilePath);
            readStream.removeAllListeners();
            reject(err);
          });
          readStream.on("end", () => {
            readStream.removeAllListeners();
          });
        }
      }

      toMerge();
    } catch (error) {
      writeStream.end();
      writeStream.removeAllListeners();
      unlinkSync(finalFilePath);
      reject(error);
      console.error("something went wrong when merge files", error);
    }
  });
}

async function isSingleFile(opt: {
  type: 0 | 1 | 2;
  suffix: string;
  buf: Buffer;
}) {
  const { type, buf, suffix } = opt;
  try {
    const fileName = `${genRandomStr()}.${suffix}`;
    const data = await uploadSingleFile({
      file: buf,
      fileName,
      type,
    });

    return {
      success: true,
      data,
      rt: "UploadSuccess",
      msg: "图片上传成功",
    };
  } catch (error) {
    console.error("something went wrong when upload single file", error);
    return {
      success: false,
      data: null,
      rt: "Fail",
      msg: `上传失败，请重新上传`,
    };
  }
}

async function isSliceFile(opt: {
  chunkIndex: number;
  chunkLength: number;
  uploadSymbol: string;
  buf: Buffer;
  type: 0 | 1 | 2;
  fileType: string;
}) {
  const { chunkIndex, chunkLength, fileType, type, uploadSymbol, buf } = opt;
  const dirpath = join(tmpdir(), `_${uploadSymbol}`);

  if (!existsSync(dirpath)) {
    try {
      const mkdirRes = mkdirSync(dirpath, { recursive: true });
      console.log(`Temporary directory created at ${dirpath}`, mkdirRes);
    } catch (err) {
      console.error(err);
      return {
        success: false,
        rt: "createTempDirFail",
        data: null,
        msg: "内部错误，请稍后再尝试上传或者联系开发者！",
      };
    }
  }
  // write file into piece

  try {
    await writeStreamIntoFile(dirpath, chunkIndex, buf as Buffer);
  } catch (error) {
    return {
      success: false,
      rt: "writeFileFail",
      data: chunkIndex,
      msg: "切片写入失败",
    };
  }

  const files = readdirSync(dirpath);

  if (chunkLength == files.length) {
    // 合并切片
    try {
      const finalFilePath = await mergeFiles(dirpath, files);
      const suffix = fileType?.split("/")[1];
      const fileName = `${genRandomStr()}.${suffix}`;

      const res = await uploadLargeFile({
        type,
        filePath: finalFilePath,
        fileName,
      });
      await unlinkSync(finalFilePath);
      await rmSync(dirpath, { recursive: true, force: true });
      console.log(`the upload result is`, res);
      return {
        success: true,
        data: res,
        rt: "uploadFileSuccess",
        msg: "上传图片成功",
        isFinal: true, // 用于在一堆promise中找到这货
      };
    } catch (error) {
      console.log("something went wrong when upload all slide", error);
      return {
        success: false,
        rt: "mergeFinalFileFail",
        data: null,
        msg: "上传失败，请重新上传",
      };
    }
  }
  return {
    success: true,
    data: chunkIndex,
    rt: "UploadSliceSuccess",
    msg: "切片上传成功",
  };
}
