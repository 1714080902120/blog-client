import { reqFnForIndex } from "@/request";
import { route } from "types";

const matchIndexReg = /\/page-(\d+)(?:\?condition=(.+))?/;

export function initIndex(path: string): route {
  return {
    isMatched: path.includes("/page-"),
    fn: async () => {
      path = decodeURIComponent(path);
      const matches = path.match(matchIndexReg) as RegExpExecArray;

      const index = parseInt(matches[1]) || 0;
      const condition = matches[2];
      const isFromSearch = !!condition;

      const { useArticles } = await import("store/state");
      const articlesStore = useArticles();

      articlesStore.setIsFromSearch(isFromSearch);

      if (isFromSearch) {
        articlesStore.setCondition(condition);
      }

      const getArticles = async () => {
        const reqFn = reqFnForIndex(isFromSearch);

        const data =
          (await reqFn({
            condition,
            page_no: index,
            limit: articlesStore.limit,
          })) || [];
        if (data?.length > 0) {
          articlesStore.updatePageNo(index);
          articlesStore.updateArticles(index, data);
        }
      };

      await getArticles();
    },
  };
}
