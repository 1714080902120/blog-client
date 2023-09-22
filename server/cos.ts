import COS from "cos-nodejs-sdk-v5";
import { UPLOAD_SINGLE_FILE_SIZE } from "~/constant";

export type UploadOption = {
  filePath?: string;
  fileName: string;
  type: 0 | 1 | 2;
  file?: File | Buffer | Blob;
};

export type GetFileOpt = {
  filename: string;
  type: 0 | 1 | 2;
};

const { COS_BUCKET, COS_REGION, COS_SECRET_ID, COS_SECRET_KEY } = process.env;

const cos = new COS({
  SecretId: COS_SECRET_ID,
  SecretKey: COS_SECRET_KEY,
});

function genFileName(type: 0 | 1 | 2, fileName: string): string {
  return `${["md", "article_img", "user_pic"][type]}/${fileName}`;
}


export function getFileData(opt: GetFileOpt): Promise<Buffer> {
  const { type, filename } = opt;
  const key = genFileName(type, filename);
  return new Promise((resolve, reject) => {
    checkFileExist(key)
      .then((res) => {
        /* url为对象访问 url */
        cos.getObject(
          {
            Bucket: COS_BUCKET as string, // 填入您自己的存储桶，必须字段
            Region: COS_REGION as string, // 存储桶所在地域，例如 ap-beijing，必须字段
            Key: key, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），支持中文，必须字段
          },
          function (err, data) {
            if (err) {
              reject(err);
              return console.error(err);
            }
            resolve(data.Body);
          }
        );
      })
      .catch(_ => resolve(Buffer.from('')));
  });
}






export function checkFileExist(Key: string) {
  return new Promise((resolve, reject) => {
    cos.headObject(
      {
        Bucket: COS_BUCKET as string, // 填入您自己的存储桶，必须字段
        Region: COS_REGION as string, // 存储桶所在地域，例如 ap-beijing，必须字段
        Key, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），支持中文，必须字段
      },
      function (err, data) {
        if (data) {
          return resolve(true);
        } else {
          reject(false);
        }
      }
    );
  });
}

export function getFile(opt: GetFileOpt): Promise<string> {
  const { type, filename } = opt;
  const key = genFileName(type, filename);
  return new Promise((resolve, reject) => {
    checkFileExist(key)
      .then((res) => {
        /* url为对象访问 url */
        cos.getObjectUrl(
          {
            Bucket: COS_BUCKET as string, // 填入您自己的存储桶，必须字段
            Region: COS_REGION as string, // 存储桶所在地域，例如 ap-beijing，必须字段
            Key: key, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），支持中文，必须字段
            Sign: true, // 获取带签名的对象 URL
            Expires: 24 * 60 * 60 * 1000
          },
          function (err, data) {
            if (err) {
              reject(err);
              return console.error(err);
            }
            resolve(data.Url);
          }
        );
      })
      .catch((error) => {
        console.error('something went wrong when get file', error);
        resolve("")
      });
  });
}

export function uploadLargeFile(
  option: UploadOption,
  callback?: (err: any, data: any, option: UploadOption) => void
) {
  let { filePath, fileName, type } = option;
  const key = genFileName(type, fileName);

  return new Promise((resolve, reject) => {
    cos.uploadFile(
      {
        Bucket: COS_BUCKET as string,
        Region: COS_REGION as string,
        Key: key,
        FilePath: filePath as string,
        SliceSize: UPLOAD_SINGLE_FILE_SIZE,
        // onTaskReady: function (taskId) {
        //   /* 非必须 */
        //   console.log(taskId);
        // },
        // onProgress: function (progressData) {
        //   /* 非必须 */
        //   console.log(JSON.stringify(progressData));
        // },
        onFileFinish: async (err: any, data: any, options: any) => {
          if (err) {
            console.error(
              "upload fail",
              err,
              data,
              options,
              filePath,
              fileName,
              type
            );
            reject(err);
          } else {
            try {
              const res = await getFile({ type, filename: fileName });
              resolve({
                name: fileName,
                url: res,
              });
            } catch (error) {
              reject(err);
            }
          }
        },
        // 支持自定义headers 非必须
        // Headers: {
        //   "x-cos-meta-test": 123,
        // },
      },
      (err: any, data: any) => {
        callback && callback(err, data, option);
      }
    );
  });
}

export function uploadSingleFile(option: UploadOption) {
  let { fileName, file, type } = option;
  const key = genFileName(type, fileName);
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: COS_BUCKET as string,
        Region: COS_REGION as string,
        Key: key /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
        Body: file as Buffer /* 必须 */,
      },
      async function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        try {
          const res = await getFile({ type, filename: fileName });
          resolve({
            name: fileName,
            url: res,
          });
        } catch (error) {
          reject(err);
        }
      }
    );
  });
}
