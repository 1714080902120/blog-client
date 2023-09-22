<template>
  <div class="header_center w-4/12 m-auto flex-c">
    <div
      class="search_wrapper relative flex-c border dark:border-sky-900/80 border-rose-500/10 rounded-full min-w-fit w-full p-1 px-4 pr-20"
    >
      <nuxt-icon
        name="search"
        class="search_icon pr-1 cursor-pointer"
        @click="handleSearch"
      ></nuxt-icon>
      <input
        class="search_input h-8 bg-transparent outline-none flex-1"
        ref="searchInput"
        @keyup.enter="handleSearch"
        type="text"
      />
      <button
        class="search_btn outline-none absolute top-1/2 right-0 transform -translate-y-1/2 border dark:border-sky-900/80 border-rose-500/10 rounded-full whitespace-nowrap cursor-pointer px-5 py-2 backdrop-blur bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-cyan-900/50 dark:to-violet-900/50"
        @click="handleSearch"
      >
        搜索
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchInput: Ref<HTMLInputElement | null> = ref(null);

function handleSearch() {
  const input = searchInput.value as HTMLInputElement;
  if (!input?.value) return;
  window.open(`/page-0?condition=${encodeURIComponent(input.value)}`);
}
</script>

<style scoped>
</style>
