<template>
  <div class="float_wrapper flex flex-col">
    <div class="feed_back cursor-pointer rounded-full fixed right-5 xl:right-12 bottom-36 bg-rose-100/50 dark:bg-blue-950/30 flex-c h-16 w-16" @click="onShowFeedbackPopup">
      <nuxt-icon name="feedback"></nuxt-icon>
    </div>

    <div
      v-if="showBackTopBtn"
      title="返回顶部"
      class="float_btn bottom-12 fixed right-2 xl:right-10 cursor-pointer transition transform ease-in-out duration-300 hover:scale-125 flex-c dark:hover:bg-yellow-200/20 hover:bg-sky-500/10 p-4 rounded-full"
    >
      <nuxt-icon name="backtop" @click.native="handleBackTop"></nuxt-icon>
    </div>

    <Modal
      title="反馈"
      @cancel="onCancelFeedback"
      :footer="false"
      v-if="showFeedbackPopup"
    >
      <Feedback @ok="onFeedbackSuccess" :show-back-home="false" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Feedback from "./Feedback.vue";
import { SHOW_BACK_TOP_BTN } from "constant";
import { eventOn, eventEmit } from "utils/emitter";

const showFeedbackPopup = ref(false);

const showBackTopBtn = ref(false);

eventOn(SHOW_BACK_TOP_BTN, (state: boolean) => {
  showBackTopBtn.value = state;
});

function handleBackTop() {
  if (process.client) {
    window.scrollTo(0, 0);
  }
}

function onShowFeedbackPopup() {
  showFeedbackPopup.value = true;
}

function onFeedbackSuccess() {
  showFeedbackPopup.value = false;
}

function onCancelFeedback() {
  showFeedbackPopup.value = false;
}
</script>

<style>
.float_btn svg {
  width: 3rem;
  height: 3rem;
}

.feed_back svg {
  width: 2rem;
  height: 2rem;
}

.float_btn, .feed_back {
  transition: all .3s ease;
}

.feed_back:hover {
  transform: scale(1.2);
}
.dark .feed_back .nuxt-icon.nuxt-icon--fill *,
.dark .float_btn .nuxt-icon.nuxt-icon--fill * {
  fill: rgba(252, 232, 53, 0.8) !important;
}
.light .feed_back .nuxt-icon.nuxt-icon--fill *,
.light .float_btn .nuxt-icon.nuxt-icon--fill * {
  fill: #0ea5e9 !important;
}
</style>
