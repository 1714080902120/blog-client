import { parseMarkdown } from "utils/parseMarkdown";
import { wrapDivForCode } from "utils";
import { reqFnForIndex } from "@/request/index";

const routes = [initIndex, initDetail];

const matchIndexReg = /\/page-(\d+)(?:\?condition=(.+))?/;

type route = { isMatched: boolean; fn: (nuxtApp: any) => void };

async function matchRoute(path: string, nuxtApp: any) {
  for (let i = 0; i < routes.length; i++) {
    const { isMatched, fn } = routes[i](path);
    if (isMatched) {
      return await fn(nuxtApp);
    }
  }
}

function initIndex(path: string): route {
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
          console.log(123123, path, index, isFromSearch, condition, reqFn, data)
        if (data?.length > 0) {
          articlesStore.updatePageNo(index);
          articlesStore.updateArticles(index, data);
        } else {
          articlesStore.setLoadEnd(true);
        }
      };

      await getArticles();
    },
  };
}

function initDetail(path: string): route {
  return {
    isMatched: path.includes("detail-"),
    fn: async (nuxtApp: any) => {
      const art_id = path.split("detail-")[1];
      const article =
        ((await $fetch("/get_article", {
          method: "get",
          params: {
            all: false,
            id: art_id,
            limit: 1,
            page_no: 0,
          },
        })) || [])[0] || {};

      const {
        id,
        author_id,
        author_desc,
        author_name,
        description,
        modify_time,
        title,
      } = article;

      const loadMarkdown = async () => {
        const data: string = await $fetch("/get_md", {
          params: {
            author_id,
            article_id: id,
          },
        });
        return await parseMarkdown(data.replaceAll("\r", ""));
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
        content: wrapDivForCode(content),
      });
    },
  };
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", async () => {
    const { ssrContext, payload } = nuxtApp;
    // determine that it is server
    if (ssrContext) {
      // only for index.vue
      const path = payload.path || "/";
      await matchRoute(path, nuxtApp);
    }
  });
});
