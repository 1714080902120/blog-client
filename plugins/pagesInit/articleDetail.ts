import { GET_ARTICLE_DETAIL, GET_MD } from "constant/fetchUrl";
import { route, ArticleDetail } from "types";

export function initDetail(path: string): route {
  return {
    isMatched: path.includes("detail-"),
    fn: async (nuxtApp: any) => {
      const art_id = path.split("detail-")[1];
      const res = await $fetch(GET_ARTICLE_DETAIL, {
        method: "get",
        params: {
          id: art_id,
        },
      });

      if (res?.success) {
        const article = res?.data?.Success as ArticleDetail;
        const {
          id,
          author_id,
          author_desc,
          author_name,
          description,
          modify_time,
          title,
          head_pic,
          author_pic,
        } = article;

        const loadMarkdown = async () => {
          const data: string = await $fetch(GET_MD, {
            params: {
              author_id,
              article_id: id,
            },
          });

          return await parseMarkdown(data);
        };
        const content = await loadMarkdown();
        const { useArticleDetail } = await import("store/state");
        const detail = useArticleDetail();
        detail.setData({
          id,
          author_id,
          author_desc,
          author_name,
          description,
          modify_time,
          title,
          head_pic,
          author_pic,
          content,
        });
      }
    },
  };
}
