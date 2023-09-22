<template>
  <div class="index_wrapper h-full min-h-screen pb-24 px-10 max-w-7xl">
    <!-- TODO: 等待接入分类 xl:pl-0 -->

    <div class="artcles columns-1 w-5/6 m-auto h-full min-h-screen pt-4">
      <!-- TODO：等待接入分类 xl:m-0 -->

      <ArticleCard
        v-for="item in article"
        :key="item.id"
        :item="item"
      ></ArticleCard>
    </div>
    <div
      class="footer flex-c -mt-40"
      v-if="article && article.length < articlesStore.limit"
    >
      <nuxt-img :src="loading" width="100" class="mr-3"></nuxt-img>已经到底啦~
    </div>
  </div>
</template>

<script setup lang="ts">
import loading from "@/assets/img/loading.gif";

import ArticleCard from "components/ArticleCard.vue";

import type { Article } from "types";
import { useArticles } from "store/state";

definePageMeta({
  keepalive: true,
  pageTransition: {
    name: "slide-right",
    mode: "out-in",
  },
  middleware(to, from) {
    (to.meta.pageTransition as any).name =
      +to.params.index > +from.params.index ? "slide-right" : "slide-left";
  },
});

const route = useRoute();
const index = (route?.params?.index || 0) as number;
const articlesStore = useArticles();
const article: Article[] = articlesStore.articles[index];
</script>

<style scoped>
.index_wrapper {
  margin: auto;
}

.slide-left-enter-active,
.slide-right-enter-active {
  filter: blur(4px);
  transition: all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.slide-left-leave-active,
.slide-right-leave-active {
  filter: blur(4px);
  transition: all 0.1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translate3d(-10vh, 0, 0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translate3d(10vh, 0, 0);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translate3d(10vh, 0, 0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translate3d(-10vh, 0, 0);
}
</style>
