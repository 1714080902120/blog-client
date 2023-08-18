<template>
  <div class="float_wrapper fixed right-0 bottom-1/3 lg:right-20">
    <div
      title="返回顶部"
      class="float_btn cursor-pointer transition transform ease-in-out duration-300 hover:scale-125 flex-c dark:hover:bg-yellow-200/20 hover:bg-sky-500/10 p-4 rounded-full"
    >
      <nuxt-icon name="backtop" @click.native="handleBackTop"></nuxt-icon>
    </div>
    <div class="jump_to" title="跳转到某一页">
      
    </div>
  </div>
</template>

<script setup lang="ts">
function handleBackTop() {
  if (process.client) {
    window.scrollTo(0, 0);
  }
}
</script>

<style>
.float_btn svg {
  width: 3rem;
  height: 3rem;
}
.dark .float_btn .nuxt-icon.nuxt-icon--fill * {
  fill: rgba(252, 232, 53, 0.8) !important;
}
.light .float_btn .nuxt-icon.nuxt-icon--fill * {
  fill: #0ea5e9 !important;
}
</style>
