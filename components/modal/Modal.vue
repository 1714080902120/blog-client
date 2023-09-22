<template>
  <transition name="fade">
    <div
      class="modal_wrapper fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded"
    >
      <div
        class="modal relative py-6 px-10 border rounded dark:border-purple-500/20 border-fuchsia-200/10"
      >
        <div
          class="bg flex backdrop-blur-2xl absolute top-0 left-0 w-full h-full bg-gradient-to-br dark:from-indigo-900/10 dark:to-violet-900/40 from-rose-100/50 to-fuchsia-300/40 rounded"
        ></div>
        <header class="header flex-btw-c cursor-pointer">
          <h1 class="title text-3xl" :title="props.title">
            {{ props.title }}
          </h1>
          <div
            class="close transform hover:scale-125 transition-all duration-300 ease-in-out"
            @click="onBtnClick('cancel')"
          >
            <nuxt-icon name="close"></nuxt-icon>
          </div>
        </header>
        <main class="body my-4">
          <slot></slot>
        </main>
        <template v-if="props.footer">
          <div
            class="my-6 w-full dark:bg-cyan-200/10 h-px border-none bg-cyan-950/10"
          ></div>
          <footer class="footer flex-c">
            <Btn
              :text="'确认'"
              class="modal_btn mr-5"
              @click="onBtnClick('ok')"
            />
            <Btn
              :text="'取消'"
              class="modal_btn"
              @click="onBtnClick('cancel')"
            />
          </footer>
        </template>
      </div>
    </div>
  </transition>
  <div
    class="mask fixed w-screen h-screen top-0 left-0 z-50 dark:bg-black/30 bg-black/10"
    @click="onBtnClick('cancel')"
  ></div>
</template>

<script setup lang="ts">
import Btn from "./Btn.vue";

const props = defineProps({
  title: String,
  footer: { type: Boolean, default: true },
});

const emit = defineEmits(["ok", "cancel"]);

function onBtnClick(name: "ok" | "cancel") {
  emit(name);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: all 0.1s cubic-bezier(0.77, 0, 0.175, 1);
}

.fade-leave-active {
  transition: all 0.1s cubic-bezier(0.77, 0, 0.175, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  filter: blur(4px);
  background: transparent;
}

.dark .modal {
  box-shadow: 10px 10px 100px 10px rgba(192, 38, 211, 0.4);
}

.light .modal {
  box-shadow: 10px 10px 100px 10px rgba(255, 143, 190, 0.4);
}

.modal_wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
}
.bg {
  z-index: -1;
}
</style>
