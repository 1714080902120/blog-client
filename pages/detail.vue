<template>
  <div class="wrapper">
    <div class="title">{{ title }}</div>
    <div class="desc">{{ description }}</div>
    <div class="modify_time">{{ modify_time }}</div>
    <div class="author">
      <span class="author_name">{{ author_name }}</span>
      <span class="author_desc">{{ author_desc }}</span>
    </div>

    <div class="content">
      <ContentRenderer :value="result" v-if="result">
        <div>
          <ContentRendererMarkdown :value="result"></ContentRendererMarkdown>
        </div>
      </ContentRenderer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseMarkdown } from "utils/parseMarkdown";
import { useArticles } from "store/state";
import { toRef } from "vue";
const route = useRoute();

const articlesStore = useArticles();

const getRenderData = async () => {
  const { index = 0 } = route?.query;
  const {
    author_id,
    author_desc,
    author_name,
    id: article_id,
    description,
    modify_time,
    title,
  } = articlesStore.getArticle(index);

  const result = ref(null);
  const loadMarkdown = async () => {
    const { data } = await useFetch("/get_md", {
      params: {
        author_id,
        article_id,
      },
    });
    result.value = await parseMarkdown(data.value);
    console.log(13, result);
  };
  await loadMarkdown();

  return {
    author_id,
    author_desc,
    author_name,
    id: article_id,
    description,
    modify_time,
    title,
    result,
  };
};

const {
  author_id,
  author_desc,
  author_name,
  id: article_id,
  description,
  modify_time,
  title,
  result,
} = await getRenderData();
</script>
