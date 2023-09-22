import {
  CHUNK_NUM,
  PER_MB,
  UPLOAD_FILE_MAX_SIZE,
  UPLOAD_SINGLE_FILE_SIZE,
  SHOW_IMAGE_EDITOR,
  HIDE_IMAGE_EDITOR,
} from "constant";
import { PinturaEditor, appendDefaultEditor } from "@pqina/pintura/pintura.js";
import { toUploadFile } from "@/request/index";
import { UploadOptions, RtData } from "types";

import { eventEmit } from 'utils/emitter'

let imgEditor: null | HTMLElement = null;
let pintura: null | PinturaEditor = null;

export async function uploadFile(
  opts: UploadOptions
): Promise<RtData<null | { name: string; url: string }>> {
  const { file } = opts;

  if (!isSupportUploadFile(file)) {
    return {
      success: false,
      rt: 'UnsupportType',
      data: null,
      msg: '文件上传类型当前仅支持图片和markdown！'
    }
  }

  if (file.size > UPLOAD_FILE_MAX_SIZE) {
    return {
      success: false,
      rt: "Fail",
      data: null,
      msg: `文件不得大于${UPLOAD_FILE_MAX_SIZE / PER_MB}M`,
    };
  }
  if (file.size >= UPLOAD_SINGLE_FILE_SIZE) {
    return await uploadChunks(opts);
  } else {
    return await uploadSingleFile(opts);
  }
}

async function uploadSingleFile(opts: UploadOptions) {
  const { file, type, fileName } = opts;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await toUploadFile(formData, {
      _type: type,
      _single: true,
      _filename: fileName,
      _filetype: file.type
    });
    return res;
  } catch (error) {
    console.error("something went wrong when upload file", error);
  }
}

async function uploadChunks(opts: UploadOptions) {
  const { file, type, fileName, fileSymbol, fileType } = opts;
  const chunkSize =
    file.size > 25 * PER_MB ? Math.floor(file.size / CHUNK_NUM) : 2 * PER_MB;
  const chunksNumber = Math.ceil(file.size / chunkSize);

  const params: Array<{
    formData: FormData;
    headers: {
      _type: 0 | 1 | 2;
      _chunkindex: number;
      _chunksnumber: number;
      _filename: string;
      _uploadsymbol: string; // 用于断点续存标识符, 文件的lastModified和size如果不曾改动过，那么这两个值就不会变化
      _filetype: string;
    };
  }> = [];

  for (let i = 0; i < chunksNumber; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);

    params.push({
      formData,
      headers: {
        _type: type,
        _chunkindex: i,
        _chunksnumber: chunksNumber,
        _filename: fileName as string,
        _uploadsymbol: fileSymbol as string, // 用于断点续存标识符
        _filetype: fileType as string,
      },
    });
  }

  // 如果promise.all失败了，这里重新执行3次。如果最终还是失败。直接返回给前端，让用户重新上传。
  const recursion_limit = 2;
  let rec_num = 0;
  async function doUpload(list: Array<Record<string, any>>) {
    try {
      const promises: Array<[number, Promise<Record<string, any>>]> = [];
      for (const item of list) {
        promises.push([item.headers._chunkindex, toUploadFile(item.formData, item.headers)]);
      }
      const res: any[] = await PromiseAllForFileUpload(promises);

      const failList = [];

      for (let i = 0; i < res.length; i++) {
        const item = res[i] || {};

        // 如果有，则返回，没有则继续递归
        if (item.rt === `createTempDirFail` || item?.isFinal) {

          return item;
        } else if (!item.success) {

          failList.push(item.data)
        }
      }

      if (rec_num <= recursion_limit) {
        console.log(88, res);
        rec_num += 1;
        return doUpload(failList.map(index => params[index]));
      } else {
        return {
          success: false,
          data: null,
          rt: "UploadFail",
          msg: "上传文件失败，请重试！！",
        };
      }

    } catch (error) {
      console.log("slice upload fail", error);

      if (rec_num <= recursion_limit) {
        rec_num += 1;
        return doUpload(params);
      }
    }
  }

  return doUpload(params);
}


export function PromiseAllForFileUpload(promises: Array<[number, Promise<any>]> = []): Promise<any> {
  return new Promise((resolve, reject) => {
    const arr: any[] = [];
    const length = promises.length;

    promises.forEach(item => {
      const [index, promise] = item;
      promise
        .then((res) => {
          arr.push(res);
        })
        .catch((err) => {
          console.error('someting went wrong when upload slice', err);
          arr.push({
            success: false,
            data: index,
            rt: 'writeFileFail',
            msg: '写入切片失败'
          })
        }).finally(() => {
          if (arr.length === length) {
            resolve(arr);
          }
        });
    });
  });
}




export function imgEdit(file: File, ratio: number = 1): Promise<File> {
  return new Promise((resolve, reject) => {
    if (imgEditor === null) {
      imgEditor = document.querySelector(".__img_editor");
    }
    try {

      eventEmit(SHOW_IMAGE_EDITOR);
      pintura = appendDefaultEditor(imgEditor as HTMLElement, {
        // The source image to load
        src: file,

        // This will set a square crop aspect ratio
        imageCropAspectRatio: ratio,
        cropSelectPresetOptions: [
          [undefined, "Custom"],
          [1, "Square"],
          [16 / 9, "16:9"],
          [4 / 3, "4:3"],
        ],
      });

      pintura.on("process", (imageState: any) => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(imageState.dest);
        const file = dataTransfer.files[0];

        (pintura as PinturaEditor).close();
        (pintura as PinturaEditor).destroy();
        pintura = null;
        eventEmit(HIDE_IMAGE_EDITOR)
        resolve(file);
      });
    } catch (error) {
      console.error("someting went wrong when edit image", error);
      reject(error);
    }
  });
}

export function resetPintura () {
  if (pintura) {
    pintura.abortLoadImage();
    pintura.abortProcessImage();
    pintura.close();
    pintura.destroy();
    pintura = null;
  }
}



export function isImages (file: File) {
  return file.type.indexOf('image') !== -1;
}

export function isMd (file: File) {
  return file.type === 'text/markdown';
}

export function isSupportUploadFile (file: File) {
  return isImages(file) || isMd(file);
}
