import { GetArticleData } from "../../types";
import { genPic, genUrl } from "../utils";
import { encrypt } from "../crypto";
import { timestamp2Date } from '@/utils/index'
import { UPLOAD_ARTICLE_IMG } from "~/constant";

export default defineEventHandler(async event => {
  const { all, limit, id, page_no, } = getQuery(event)
  const url = genUrl("/get_article");
  const res: GetArticleData = await $fetch(url, {
    method: 'get',
    params: {
      all, limit, id, page_no,
    }
  })

  if (res.success) {
    const data = res.data;
    for (let i = 0; i < data.list.length; i++) {
      const item = data.list[i];
      const { id, author_id, modify_time } = item;
      let head_pic = item.head_pic;
      if (head_pic) {
        try {
          head_pic = await genPic(UPLOAD_ARTICLE_IMG, head_pic);
        } catch (error) {
          head_pic = ''
          console.error('something went wrong when load image from COS', error)
        }
      }
      data.list[i] = {
        ...item,
        head_pic,
        modify_time: timestamp2Date(modify_time),
        author_id: encrypt(author_id), // 对作者`id`做下保护
      }
    }
    return data.list;
  }
  return [];
})
