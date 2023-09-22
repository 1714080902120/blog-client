import { genPic, genUrl, getImageUrlFromMdImg } from "../utils";
import { decrypt } from "../crypto";

import { getFileData } from "../cos";
import { UPLOAD_ARTICLE_IMG, UPLOAD_MD } from "~/constant";

import { protectMdCodeBlockFromSanitize } from "~/utils";

export default defineEventHandler(async (event) => {
  try {
    const {
      article_id = "",
      author_id = "",
      needDecrypt = true,
    } = getQuery(event);
    const u_id = needDecrypt ? decrypt(author_id as string) : author_id;
    const remoteFileName = `${u_id}/${article_id}.md`;

    const buf = await getFileData({
      type: UPLOAD_MD,
      filename: remoteFileName,
    });

    let content = "";

    // 开发阶段做一层兼容 TODO：待移除
    if (buf.length <= 0) {
      const localeUrl = genUrl("/md");

      const md = await $fetch(localeUrl, {
        method: "get",
        params: {
          file_path: remoteFileName,
        },
      });
      content = md as string;
    } else {
      content = buf.toString();
    }

    content = protectMdCodeBlockFromSanitize(content);

    content = await replaceAllUrl(content);

    return content.replaceAll("\r", "");
  } catch (error) {
    console.error("someting went wrong when get markdown content", error);
    return "";
  }
});

async function replaceAllUrl(content: string): Promise<string> {
  return new Promise((resolve) => {
    const matches = getImageUrlFromMdImg(content);
    let l = 0;

    if (matches.length <= 0) {
      resolve(content);
      return;
    }

    matches.forEach((item) => {
      const { originUrl, filename } = item || {};
      if (filename && originUrl) {
        genPic(UPLOAD_ARTICLE_IMG, filename)
          .then((res) => {
            content = content.replaceAll(originUrl, res);
          })
          .catch((err) => {
            console.error("something went wrong when load image from COS", err);
          })
          .finally(() => {
            l++;
            if (l === matches.length - 1) {
              resolve(content);
            }
          });
      } else {
        l++;
        if (l === matches.length - 1) {
          resolve(content);
        }
      }
    });
  });
}
