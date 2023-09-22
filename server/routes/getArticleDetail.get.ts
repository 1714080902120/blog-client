import { GetArticleDetail } from "../../types";
import { genPic, genUrl } from "../utils";
import { encrypt } from "../crypto";
import { timestamp2Date } from "@/utils/index";
import { UPLOAD_ARTICLE_IMG, UPLOAD_USER_IMG } from "~/constant";

export default defineEventHandler(async (event) => {
  const { id = '', needEncrypt = true } = getQuery(event);
  const url = genUrl("/article_detail");
  const res: GetArticleDetail = await $fetch(url, {
    method: "get",
    params: {
      id,
    },
  });

  if (res?.success) {
    const data = res?.data?.Success;

    data?.author_pic && (data.author_pic = await genPic(UPLOAD_USER_IMG, data.author_pic));
    data?.head_pic && (data.head_pic = await genPic(UPLOAD_ARTICLE_IMG, data.head_pic))
    data?.modify_time && (data.modify_time = timestamp2Date(data?.modify_time));
    data?.author_id && (data.author_id = needEncrypt ? encrypt(data.author_id) : data.author_id);
  }

  return res;
});
