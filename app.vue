<template>
  <div
    class="page_wrapper bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-sky-950"
  >
    <Header></Header>
    <NuxtPage id="__page" class="page h-full pt-16"></NuxtPage>
    <div class="page_wrapper_bg" :style="bgStyle"></div>
    <ClientOnly>
      <FloatBtn />
      <LazyLoginPopup></LazyLoginPopup>
      <ImgEditor />
      <Toast />
      <Alert />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import '@pqina/pintura/pintura.css';
import Header from "components/header/Index.vue";
import Toast from "components/Toast.vue";
import Alert from "components/Alert.vue";
import bgImg from "assets/img/_bg.png";
import ImgEditor from 'components/ImgEditor.vue';
import { eventEmit } from "utils/emitter";

import {
  ON_SYSTEM_THEME_CHANGE,
  ON_SCROLL_REACH_ASIDE,
  AIM,
SHOW_BACK_TOP_BTN,
} from "constant/index";

const bgStyle = {
  backgroundImage: `url(${bgImg})`,
};

let showBackTopIcon = false;

if (process.client) {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const newColorScheme = e.matches ? "dark" : "light";
      console.log("match media change", newColorScheme);
      eventEmit(ON_SYSTEM_THEME_CHANGE, newColorScheme);
    });

  window.addEventListener("scroll", (event: any) => {
    const { scrollTop, scrollHeight, clientHeight } =
      event?.target?.scrollingElement || {};
    const state = scrollTop > 0;
    if (!state) {
      eventEmit(ON_SCROLL_REACH_ASIDE, AIM[1]);
      // 这里有个敏感问题，如果页面太矮容易先触发底部再触发顶部，这样正好卡在了1s的时间锁， TODO
    } else if (scrollHeight - 10 < scrollTop + clientHeight) {
      eventEmit(ON_SCROLL_REACH_ASIDE, AIM[0]);
    }

    if (state === showBackTopIcon) {
      return;
    }
    eventEmit(SHOW_BACK_TOP_BTN, state)
    showBackTopIcon = state;
  });
}
</script>

<style>
.page_wrapper {
  /* height: 100vh; */
  min-width: 640px;
}
.page {
  /* height: 100vh; */
  min-width: 640px;
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
