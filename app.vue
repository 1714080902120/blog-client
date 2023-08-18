<template>
  <div
    class="page_wrapper bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-sky-950"
  >
    <Header></Header>
    <NuxtPage id="__page" class="page h-full pt-16"></NuxtPage>
    <div class="page_wrapper_bg" :style="bgStyle"></div>
    <FloatBtn v-show="showBackTopIcon" />
  </div>
</template>

<script setup lang="ts">
import bgImg from "assets/img/_bg.png";
import { eventEmit } from "utils/emitter";
import {
  ON_SYSTEM_THEME_CHANGE,
  ON_SCROLL_REACH_ASIDE,
  AIM,
} from "@/constant/index";

const bgStyle = {
  backgroundImage: `url(${bgImg})`,
};

const showBackTopIcon = ref(false);

if (process.client) {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const newColorScheme = e.matches ? "dark" : "light";
      console.log("match media change");
      eventEmit(ON_SYSTEM_THEME_CHANGE, newColorScheme);
    });

  window.addEventListener("scroll", (event: any) => {
    const { scrollTop, scrollHeight, clientHeight } =
      event?.target?.scrollingElement || {};
    const state = scrollTop > 0;
    if (!state) {
      eventEmit(ON_SCROLL_REACH_ASIDE, AIM[1]);
    } else if (scrollHeight - 10 < scrollTop + clientHeight) {
      eventEmit(ON_SCROLL_REACH_ASIDE, AIM[0]);
    }

    if (state === showBackTopIcon.value) {
      return;
    }
    showBackTopIcon.value = state;
  });
}
</script>

<style>
.page_wrapper {
  /* height: 100vh; */
}
.page {
  /* height: 100vh; */
}
.page_wrapper_bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-size: cover;
  background-repeat: repeat;
  background-position: top;
  z-index: -1;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
}

.page-enter-from,
.page-leave-to {
  position: absolute;
  opacity: 0;
  filter: blur(4px);
  transform: translateX(100%);
}
</style>
