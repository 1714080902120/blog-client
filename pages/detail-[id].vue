<template>
  <div class="article_detail_wrapper min-h-screen">
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="description" />
      <Script src="https://cdn.jsdelivr.net/npm/shiki-es@latest/dist/assets/" async defer></Script>
    </Head>

    <div class="content max-w-7xl pb-24 px-10">
      <div class="head_pic m-auto w-full">
        <nuxt-picture
          v-if="head_pic"
          provider="cloudinary"
          format="avif,webp"
          :src="head_pic"
          width="400"
          fit="cover"
        ></nuxt-picture>
      </div>

      <div class="msg flex-btw-c text-xl py-10">
        <div class="left flex cursor-pointer">
          <div class="author_logo" @click="handleWatchUser">
            <nuxt-img
              v-if="author_pic"
              :src="author_pic"
              provider="cloudinary"
              format="avif,webp"
              :alt="author_name"
            >
            </nuxt-img>
            <nuxt-img
              v-else
              class="w-16 h-16 rounded-full"
              :src="Author_Pic"
              :alt="author_name"
              format="avif,webp"
            />
          </div>
          <div class="name_desc my-2">
            <div
              class="txt mx-2 font-semibold text-2xl"
              @click="handleWatchUser"
            >
              {{ author_name }}
            </div>
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
  head_pic,
  author_pic,
} = article?.detail || {};


function handleWatchUser() {
  // TODO 待跳转到用户的个人信息， 中间需要判断这人的token
  if (process.client) {
    window.open(`user-${author_id}`);
  }
}
</script>


<style scoped>
.content {
  overflow: hidden;
  overflow-y: visible;
  margin: auto;
}
.content::-webkit-scrollbar {
  display: none;
}
</style>
