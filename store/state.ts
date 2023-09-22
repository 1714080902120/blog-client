import { defineStore } from "pinia";
import { ArticleDetail } from "types";
import { reactive, ref } from "vue";
import type { UnwrapNestedRefs } from "vue";
import { Article } from "@/types/index";

export const useGlobalState = defineStore('global_state', () => {
  const notAuth = ref(false);

  function setIsNotAuth (state: boolean) {
    notAuth.value = state;
  }

  return {
    notAuth,
    setIsNotAuth
  }
})

export const useArticles = defineStore("articles", () => {
  const articles: UnwrapNestedRefs<Article[][]> = reactive([]);
  const pageNo = ref(-1);
  const limit = ref(10);

  const isFromSearch = ref(false);

  const condition = ref("");

  function updateArticles(index: number, list: Article[]) {
    articles[index] = list;
  }

  function updatePageNo(page_no: any) {
    pageNo.value = parseInt(page_no);
  }

  function getArticle(index = 0) {
    return articles[index];
  }

  function setIsFromSearch(state: boolean) {
    isFromSearch.value = state;
  }

  function setCondition(value: string) {
    condition.value = value;
  }

  return {
    limit,
    pageNo,
    articles,
    condition,
    isFromSearch,
    getArticle,
    setCondition,
    updatePageNo,
    updateArticles,
    setIsFromSearch,
  };
});

export const useArticleDetail = defineStore("article_detail", () => {
  const detail: ArticleDetail = reactive({
    id: "",
    title: "",
    description: "",
    modify_time: -1,
    content: "",
    head_pic: '',

    author_id: "",
    author_name: "",
    author_desc: "",
    author_pic: '',
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

// 用于存储tips
export const useTips = defineStore('user_tips', () => {
  let tip = ref('');

  function setTip(msg: string) {
    tip.value = msg;
  }

  return {
    tip,
    setTip
  }

})



