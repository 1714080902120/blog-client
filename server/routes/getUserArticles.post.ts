import {
  GetUserArticle,
  GetUserArticleSuccess,
  DefaultArticleData,
  UserArticle,
} from "../../types";
import { genUrl, getTokenFromCookie, transformIntoFormData } from "../utils";
import { timestamp2Date } from "@/utils/index";

import { TOKEN_KEY } from "../../constant";

export default defineEventHandler(async (event) => {
  const { all, limit, id, pageNo, token, isPublish } = await readBody(event);
  const url = genUrl("/user/article");

  const formData = transformIntoFormData({
    all,
    limit,
    id,
    page_no: pageNo,
    is_publish: isPublish
  })


  const res: GetUserArticle = await $fetch(url, {
    method: "post",
    body: formData,
    headers: {
      ...formData.getHeaders(),
      [TOKEN_KEY]: token || getTokenFromCookie(event),
    },
  });


  const data = (res?.data as GetUserArticleSuccess).Success;

  return (data || []).map((item: UserArticle) => {
    return {
      ...item,
      modify_time: timestamp2Date(item.modify_time),
    };
  });
});
