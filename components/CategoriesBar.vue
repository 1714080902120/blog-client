<template>
  <div class="aside_wrapper hidden xl:flex fixed flex-col min-w-fit">
    <div
      class="aside
        border rounded dark:border-sky-950/10 dark:border-r-0
        w-80 min-w-fit 2xl:w-96
        px-6 py-3 backdrop-blur bg-gradient-to-r from-cyan-300/15 to-cyan-100/30 dark:bg-black/10
      "
    >
      <h1 class="font-bold text-xl mb-3">分类</h1>
      <div class="btn_wrapper columns-1">
        <Btn
          class="base_btn break-inside-avoid mb-3 mr-2"
          v-for="category in categories"
          :key="category.id"
          :text="category.name"
          :title="category.description"
          @click="handleSearch(item.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Btn from "./modal/Btn.vue";
import { useAside } from "store/aside";

const categories = useAside().categories;

function handleSearch(id: string) {
  // TODO
}
</script>

<style scoped>
.aside_wrapper {
  top: 5rem;
  left: 70%;
}

.base_btn {
  display: inline-block;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
