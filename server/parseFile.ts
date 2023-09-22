import { readFiles } from "h3-formidable";
import type { H3Event } from "h3";

export function parseFile(event: H3Event): Promise<{ buf: Buffer | null, suffix: string; }> {
  return new Promise((resolve, reject) => {
    const res = readFiles(event, {
      getForm: (form) => {
        form.onPart = async function (part: any) {
          let buffer: null | Buffer = null;

          if (!part.originalFilename) {
            // let formidable handle all non-file parts
            const res = await form._handlePart(part);
            resolve(res)
            return;
          }

          // handle the raw part events yourself
          part.on("data", function (data: Buffer) {
            // write data to destination

            if (buffer === null) {
              buffer = data;
            } else {
              buffer = Buffer.concat([buffer as Buffer, data]);
            }
          });

          part.on("end", async function () {

            const { mimetype } = part;
            const suffix = mimetype.split("/")[1] || "png";
            // 简单的接口直接通过buffer的方式上传
            resolve({
              buf: buffer,
              suffix,
            });
          });

          part.on("error", function (err: any) {
            // handle error
            reject(err)
            console.error("something went wrong when parse file", err);
          });
        };
      },
    });
  });
}
