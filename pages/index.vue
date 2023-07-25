<template>
      <div class="test" v-for="item in data" :key="item.id" @click="handleLoadMd(item)">
        <div class="title">{{ item.title }}</div>
        <div class="desc">{{ item.description }}</div>
        <div class="author_name">{{ item.author_name }}</div>
      </div>
</template>

<script setup lang="ts">

import type { Article } from "types";

const { data } = await useFetch("/get_article", {
  method: "get",
  params: {
    all: true,
    id: -1,
    limit: 20,
    page_no: 0,
  },
});

async function handleLoadMd (item: Article) {
    const router = useRouter();
    router.push({
        name: 'detail',
        query: {
            ...item
        }
    })
}
</script>