<template>
  <Transition name="slide">
    <div
      class="toast px-5 py-2 relative flex flex-col rounded bg-gradient-to-br dark:from-orange-300/70 dark:via-amber-400/70 dark:to-yellow-400/80 from-rose-200/20 via-rose-300/40 to-pink-400/50 backdrop-blur"
      v-if="show"
    >
      <h2 class="text-xl font-bold">提示</h2>
      <p class="content text-sm break-all">{{ content }}</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { eventOn } from "utils/emitter";
import { SHOW_TOAST, HIDE_TOAST } from "constant/index";

const show = ref(false);

const content = ref("");

let timer: null | string | number | NodeJS.Timeout = null;

function onShow() {
  return new Promise((resolve) => {
    if (show.value === true) {
      show.value = false;
      timer = setTimeout(() => resolve(""), 400);
    } else {
      resolve("");
    }
  });
}

eventOn(SHOW_TOAST, async (text: string, duration: number = 3000) => {

  if (timer) {
    clearTimeout(timer);
  }
  await onShow();
  show.value = true;
  content.value = text;
  timer = setTimeout(() => {
    show.value = false;
    content.value = "";
  }, duration);
});
eventOn(HIDE_TOAST, () => {
  show.value = false;
  content.value = "";
});
</script>

<style scoped>
.toast {
  position: fixed;
  display: flex;
  z-index: 999;
  top: 30%;
  left: 1%;
  transform: translate(40px, -50%);
  max-width: 320px;
  min-width: 160px;
}
.bg {
  z-index: -1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from {
  transform: translate(-10px, -50%);
}

.slide-leave-to {
  transform: translate(40px, -200%);
}
</style>
