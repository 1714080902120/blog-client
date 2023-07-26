import { defineStore } from "pinia";
import { reactive, ref } from "vue";


export const useArticles = defineStore("articles", () => {
  const articles = reactive([]);
  const pageNo = ref(0);
  const limit = ref(20);

  const isEnd = ref(false);

  function updateArticles(list = []) {
    articles.push(...list);
  }

  function updatePageNo() {
    pageNo.value += 1;
  }

  function getArticle(index = 0) {
    return articles[index];
  }

  function setLoadEnd (state: boolean) {
    isEnd.value = state;
  }

  return {
    limit,
    isEnd,
    pageNo,
    articles,
    setLoadEnd,
    updatePageNo,
    updateArticles,
    getArticle,
  };
});
