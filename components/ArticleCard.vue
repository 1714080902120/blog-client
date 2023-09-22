<template>
  <div
    class="article break-inside-avoid max-w-3xl p-4 mt-5 first:mt-0 cursor-pointer rounded-lg backdrop-blur boder-indigo-500 bg-gradient-to-r from-cyan-300/15 to-cyan-100/30 dark:border-sky-900 dark:bg-black/10 transition duration-200 ease-in-out transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
    @click="handleLoadMd"
  >
    <header
      class="title line text-xl font-semibold mb-3 tracking-wider dark:text-blue-300/70"
    >
      {{ item.title }}
    </header>
    <main class="flex flex-col self-start">
      <div class="center_wrapper flex max-w-full flex-col">
        <section class="flex max-w-full">
          <div class="img_wrapper mr-3">
            <nuxt-img
              v-if="item.head_pic"
              provider="cloudinary"
              format="avif,webp"
              class="nuxt_img flex"
              :src="item.head_pic"
              :width="72"
              :height="72"
              fit="cover"
              :error-src="defaultHeadPic"
            />
            <nuxt-img
              class="nuxt_img flex"
              v-else
              :width="72"
              :height="72"
              format="avif,webp"
              fit="cover"
              :src="defaultHeadPic"
            />
          </div>
          <div class="author_desc_wrapper flex flex-col">
            <p v-if="item.author_name"
              class="line author_name text-lg mb-2 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis dark:text-blue-200/50"
            >
              <span class="font-bold">作者：</span>{{ item.author_name }}
            </p>
            <p
              class="line modify_time mb-2 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis dark:text-blue-200/50"
            >
              <span class="font-bold">发布时间：</span>{{ item.modify_time }}
            </p>
          </div>
        </section>
        <section>
          <p
            class="line desc leading-7 tracking-wider font-medium mt-3 dark:text-blue-200/50"
          >
            <span class="font-bold">简介：</span>{{ item.description }}
          </p>
        </section>
      </div>
    </main>
    <footer v-if="$slots.btns">
      <slot name="btns"></slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Article, UserArticle } from "types";

import defaultHeadPic from "@/assets/img/base_logo.jpg";

const props = defineProps<{
  item: Article | UserArticle 
}>();

const item = props.item;

function handleLoadMd() {
  if (process.client) {
    window.open(`/detail-${item.id}`);
  }
}

</script>

<style scoped>
.title,
.desc {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-inline-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.desc {
  -webkit-line-clamp: 3;
}

.article {
  margin-left: auto;
  margin-right: auto;
  width: 688px;
}

/* .img_wrapper {
  width: 35%;
} */
.dark .article:hover {
  background-image: var(--gradient_hover_bg);

  box-shadow: 10px 10px 100px 10px rgba(192, 38, 211, 0.4);
  background-position: left top;
  background-size: 350% 200%;
  animation: var(--gradient_hover_animate);
}

.light .article:hover {
  background-image: var(--gradient_hover_bg);
  box-shadow: 10px 10px 100px 10px rgba(255, 205, 224, 0.5);
  background-position: left top;
  background-size: 350% 200%;
  animation: var(--gradient_hover_animate);
}
</style>
