<template>
  <div class="app_header flex-btw-c p-2 px-5">
    <div
      class="header_bg opacity-100 backdrop-opacity-95 blur-sm drop-shadow-md bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-sky-950"
    ></div>
    <div class="header_left flex-c">
      <nuxt-icon
        name="home"
        class="home_svg flex-c cursor-pointer transition hover:scale-125 linear rounded-full"
        @click.native="handleBackHome"
      ></nuxt-icon>
    </div>
    <HeaderCenter />
    <div class="header_right flex-c">
      <ThemeChange />
      <HeaderRight />
    </div>
  </div>
</template>

<script setup lang="ts">

import HeaderRight from './RightBar.vue';
import HeaderCenter from './CenterBar.vue'

function handleBackHome() {
  const route = useRoute();
  if (route.path.includes("page-")) {
    const router = useRouter();
    router.replace({ path: "/page-0" });
  } else {
    window.open("/");
  }
}
</script>

<style scoped>
.header_bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.app_header {
  position: fixed;
  z-index: 12;
  top: 0;
  width: 100%;
  min-width: 640px;
}
</style>

<style>
.home_svg.nuxt-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}
.search_wrapper .search_icon {
  padding-top: 0.1rem;
}

</style>
