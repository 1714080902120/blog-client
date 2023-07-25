<template>
    <div class="title">{{ title }}</div>
    <div class="desc">{{ description }}</div>
    <div class="modify_time">{{ modify_time }}</div>
    <div class="author">
        <span class="author_name">{{ author_name }}</span>
        <span class="author_desc">{{ author_desc }}</span>
    </div>

    <div class="content">
        <ContentRendererMarkdown :value="result" v-if="result" />
    </div>
</template>

<script setup lang="ts">
import { parseMarkdown } from "utils/parseMarkdown";

const route = useRoute();
const {
    author_id,
    author_desc,
    author_name,
    id: article_id,
    description,
    modify_time,
    title,
} = toRefs(route?.query);

const result = ref(null);
const loadMarkdown = async () => {
    const { data } = await useFetch("/get_md", {
        params: {
            author_id,
            article_id,
        },
    });
    result.value = await parseMarkdown(data.value);
    console.log(1112222, result)
};
loadMarkdown();
</script>
