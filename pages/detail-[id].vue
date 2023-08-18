<template>
  <div class="article_detail_wrapper min-h-screen">
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="description" />
    </Head>

    <div class="content max-w-7xl pb-24 px-10">
      <div class="msg flex-btw-c text-xl py-10">
        <div class="left flex cursor-pointer">
          <div class="author_logo">
            <img
              class="w-16 h-16 rounded-full"
              :src="Author_Pic"
              :alt="author_name"
            />
          </div>
          <div class="name_desc my-2">
            <div class="txt mx-2 font-semibold text-2xl">{{ author_name }}</div>
            <div
              class="desc mx-2 text-base max-w-xs text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {{ author_desc }}
            </div>
          </div>
        </div>
        <div class="modify_time">发布时间：{{ modify_time }}</div>
      </div>
      <ContentRendererMarkdown
        :value="content"
        v-if="content"
      ></ContentRendererMarkdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArticleDetail } from "store/state";
import Author_Pic from "assets/img/base_author_pic.jpg";

const article = useArticleDetail();

const {
  author_id,
  author_desc,
  author_name,

  id: article_id,
  description,
  modify_time,
  title,
  content,
} = article?.detail || {};
</script>

<style scoped>
.content {
  overflow: hidden;
  overflow-y: visible;
  margin: auto;
}
</style>
