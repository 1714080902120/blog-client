import { TOKEN_KEY } from "~/constant";
import { genUrl, getTokenFromCookie, transformIntoFormData } from "../utils";
import { RtData, SetArticleData } from "~/types";
import { decrypt } from "../crypto";

// 这里进入审核阶段,需要拓展新字段表示状态
export default defineEventHandler(async (event) => {
  const {
    id = "",
    title = "",
    description = "",
    headPic = "",
    author_id = ''
  } = await readBody(event);

  const url = genUrl("/user/set_article");
  const md_link = `/md/${decrypt(author_id)}/${id}.md`;
  const bodyData: SetArticleData = {
    id,
    is_publish: false,
    title,
    description: description,
    head_pic: headPic,
    md_link,
  };

  const formData = transformIntoFormData(bodyData);

  const res: RtData<{ Success: { id: string; modify_time: number } } | null> =
    await $fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        ...formData.getHeaders(),
        [TOKEN_KEY]: getTokenFromCookie(event),
      },
    });
  console.log(res);
  return res;
});
