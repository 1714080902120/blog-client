<template>
  <div class="index_wrapper h-full min-h-screen pb-24 px-10 max-w-7xl">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useArticles } from "store/state";
import { eventOn } from "@/utils/emitter";
import { ON_SCROLL_REACH_ASIDE, AIM } from "@/constant";
import middleware from "@/middleware/index";

import { reqFnForIndex } from "@/request/index";

definePageMeta({
  keepalive: true,
  scrollToTop: true,
  middleware,
});

const articlesStore = useArticles();

const lock = ref(false);

const getArticles = async (index: number) => {
  const isFromSearch = !!articlesStore.condition;
  const reqFn = reqFnForIndex(isFromSearch);
  console.log(reqFn)
  const data =
    (await reqFn({
      condition: articlesStore.condition,
      page_no: index,
      limit: articlesStore.limit,
    })) || [];
  if (data?.length > 0) {
    articlesStore.updatePageNo(index);
    articlesStore.updateArticles(index, data);
    return true;
  }
  return false;
};

eventOn(ON_SCROLL_REACH_ASIDE, async (target: string) => {
  if (articlesStore.isEnd) return;
  if (lock.value) return;
  const pageNo = articlesStore.pageNo;
  if (target === AIM[1] && pageNo <= 0) {
    lock.value = false;
  }

  lock.value = true;
  const canJump: boolean = await loadData(target, pageNo);

  nextTick(() => {
    if (canJump) {
      const router = useRouter();
      router.push({
        path: `/page-${articlesStore.pageNo}${articlesStore.isFromSearch ? `?condition=${articlesStore.condition}` : ''}`,
      });
    }
  });

  setTimeout(() => {
    lock.value = false;
  }, 300);
});

async function loadData(aim: string, pageNo: number): Promise<boolean> {
  // 如果有缓存，就不做请求
  let index = aim === AIM[0] ? pageNo + 1 : pageNo - 1;
  index = index < 0 ? 0 : index;
  if (articlesStore.articles[index]?.length > 0) {
    articlesStore.updatePageNo(index);
    return true;
  } else {
    return await getArticles(index);
  }
}
</script>

<style scoped>
.index_wrapper {
  margin: auto;
}
.article {
  margin-left: auto;
  margin-right: auto;
}
.dark .article:hover {
  background-image: linear-gradient(
    to bottom right,
    rgba(30, 27, 75, 0.9) 60%,
    rgba(97, 0, 102, 0.7)
  );

  box-shadow: 10px 10px 100px 10px rgba(192, 38, 211, 0.4);
  background-position: left top;
  background-size: 350% 200%;
  animation: move 0.7s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
}

.light .article:hover {
  background-image: linear-gradient(
    to bottom right,
    rgba(255, 245, 231, 0.1) 60%,
    rgba(255, 205, 224, 0.7)
  );

  box-shadow: 10px 10px 100px 10px rgba(255, 205, 224, 0.5);
  background-position: left top;
  background-size: 350% 200%;
  animation: move 0.7s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
}

@keyframes move {
  from {
    background-position: left top;
  }
  to {
    background-position: right bottom;
  }
}
</style>
