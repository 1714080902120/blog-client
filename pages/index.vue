<template>
  <div class="wrapper">
    <div
      class="test"
      v-for="(item, index) in articlesStore.articles"
      :key="item.id"
      @click="handleLoadMd(index)"
    >
      <div class="title">{{ item.title }}</div>
      <div class="desc">{{ item.description }}</div>
      <div class="author_name">{{ item.author_name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from "types";
import { useArticles } from "store/state";

const articlesStore = useArticles();



const getArticles = async () => {
  if (articlesStore.isEnd) {
    console.log('is load all')
    return;
  }
  const { data = [] } = await useFetch("/get_article", {
    method: "get",
    params: {
      all: true,
      id: -1,
      limit: articlesStore.limit,
      page_no: articlesStore.pageNo,
    },
  });
  if (data?.value?.length > 0) {

    articlesStore.updatePageNo();
    articlesStore.updateArticles(data.value);
  } else {
    articlesStore.setLoadEnd(true)
  }

};
await getArticles();









async function handleLoadMd(index: number) {
  const router = useRouter();
  router.push({
    name: "detail",
    query: {
      index,
    },
  });
}
</script>
