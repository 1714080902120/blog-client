<template>
  <div class="index_wrapper h-full min-h-screen pb-24 px-10 max-w-7xl">
    <div
      class="artcles columns-1 md:columns-1 lg:columns-2 grid-flow-dense gap-10 h-full min-h-screen pt-4"
    >
      <div
        class="article break-inside-avoid max-w-5xl min-w-fit p-4 mt-5 first:mt-0 cursor-pointer border rounded-lg backdrop-blur boder-indigo-500 bg-gradient-to-r from-cyan-300/15 to-cyan-100/30 dark:border-sky-900 dark:bg-black/10 transition duration-200 ease-in-out transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
        v-for="item in article"
        :key="item.id"
        @click="handleLoadMd(item.id)"
      >
        <h3 class="title line text-2xl font-semibold mb-3 tracking-wider">
          {{ item.title }}
        </h3>
        <p class="line author_name text-lg font-medium mb-2 tracking-wider">
          作者：{{ item.author_name }}
        </p>
        <p class="line modify_time mb-2 tracking-wider font-medium">
          发布时间：{{ item.modify_time }}
        </p>
        <p class="line desc leading-7 tracking-wider font-medium">
          简介：{{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from "types";
import { useArticles } from "store/state";

definePageMeta({
  keepalive: true,
  pageTransition: {
    name: "slide-bottom",
    mode: "out-in",
  },
  middleware(to, from) {
    (to.meta.pageTransition as any).name =
      +to.params.index > +from.params.index ? "slide-bottom" : "slide-top";
  },
});

const route = useRoute();
const index = (route?.params?.index || 0) as number;
const articlesStore = useArticles();
const article: Article[] = articlesStore.articles[index];

async function handleLoadMd(id: string) {
  // 这里不用路由，开一个新标签页比较合适
  window.open(`/detail-${id}`);
}
</script>

<style scoped>
.index_wrapper {
  margin: auto;
}

.title, .desc {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.desc {
  -webkit-line-clamp: 5;
}


.slide-top-enter-active,
.slide-bottom-enter-active {
  filter: blur(4px);
  transition: all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.slide-top-leave-active,
.slide-bottom-leave-active {
  filter: blur(4px);
  transition: all 0.1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.slide-top-enter-from {
  opacity: 0;
  transform: translate3d(0, -10vh, 0);
}
.slide-top-leave-to {
  opacity: 0;
  /* transform: translate3d(0, 100vh, 0); */
}
.slide-bottom-enter-from {
  opacity: 0;
  /* transform: translate3d(0, 10vh, 0); */
}
.slide-bottom-leave-to {
  opacity: 0;
  /* transform: translate3d(0, -100vh, 0); */
}

.article {
  margin-left: auto;
  margin-right: auto;
}
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
