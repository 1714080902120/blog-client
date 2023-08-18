import { SearchArticlesData } from "../../types";
import { genUrl } from "../utils";
import { encrypt } from "../crypto";
import { timestamp2Date } from '@/utils/index'

export default defineEventHandler(async event => {
  const { node } = event;
  const url = genUrl(node.req.url as string);
  const res: SearchArticlesData = await $fetch(url)
  return (res?.data?.Success?.list || []).map(item => {
    const { id, author_id, modify_time } = item;
    return {
      ...item,
      modify_time: timestamp2Date(modify_time),
      author_id: encrypt(author_id), // 对作者`id`做下保护
    }
  });
})
