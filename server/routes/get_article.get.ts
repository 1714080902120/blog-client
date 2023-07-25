import { GetArticleData } from "../../types";
import { genUrl } from "../utils";
import { encrypt } from "../crypto";

export default defineEventHandler(async event => {
  const { node } = event;
  const url = genUrl(node.req.url as string);
  const res: GetArticleData = await $fetch(url)
  
  return (res?.data?.list || []).map(item => {
    const { id, author_id } = item;
    return {
      ...item,
      author_id: encrypt(author_id), // 对用户`id`做下保护
    }
  });
})
