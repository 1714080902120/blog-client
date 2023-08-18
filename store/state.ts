import { defineStore } from "pinia";
import { ArticleDetail } from "types";
import { reactive, ref } from "vue";
import type { UnwrapNestedRefs } from "vue";
import { Article } from "@/types/index";

export const useArticles = defineStore("articles", () => {
  const articles: UnwrapNestedRefs<Article[][]> = reactive([]);
  const pageNo = ref(-1);
  const limit = ref(10);

  const isEnd = ref(false);

  const isFromSearch = ref(false);

  const condition = ref('');

  function updateArticles(index: number, list: Article[]) {
    articles[index] = list;
  }

  function updatePageNo(page_no: any) {
    pageNo.value = parseInt(page_no);
  }

  function getArticle(index = 0) {
    return articles[index];
  }

  function setLoadEnd(state: boolean) {
    isEnd.value = state;
  }

  function setIsFromSearch(state: boolean) {
    isFromSearch.value = state;
  }

  function setCondition (value: string) {
    condition.value = value
  }

  return {
    limit,
    isEnd,
    pageNo,
    articles,
    condition,
    isFromSearch,
    setLoadEnd,
    getArticle,
    setCondition,
    updatePageNo,
    updateArticles,
    setIsFromSearch,
  };
});

export const useArticleDetail = defineStore("article_detail", () => {
  const detail = reactive({
    id: "",
    title: "",
    description: "",
    modify_time: -1,
    content: "",

    author_id: "",
    author_name: "",
    author_desc: "",
  });

  function setData(data: ArticleDetail) {
    for (const key in data) {
      const element = data[key];
      /* @ts-ignore */
      detail[key] = element;
    }
  }

  return {
    detail,
    setData,
  };
});

export const useUserMsg = defineStore("user_msg", () => {
  const msg = reactive({
    name: "-",
    description: "这个人很懒，什么都没留下~",
    phone: "-",
    email: "-",
  });

  return {
    msg,
  };
});
