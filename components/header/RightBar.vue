<template>
  <transition name="fade">
    <div
      v-if="user.isLogin"
      @click="handleJumpToProfile"
      class="logo cursor-pointer rounded-full transition ease-in-out duration-300 border-2 border-transparent hover:border-fuchsia-100/30 dark:hover-sky-100/30"
    >
      <nuxt-img
        class="w-10 h-10 rounded-full"
        provider="cloudinary"
        format="avif,webp"
        :src="logo"
      />
    </div>
    <div v-else>
      <Btn
        class="login_btn mr-2"
        @click="eventEmit(ON_POPUP, IS_LOGIN)"
        :text="'登录'"
      />
      <Btn
        class="register_btn"
        @click="eventEmit(ON_POPUP, IS_REGISTRY)"
        :text="'注册'"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import Btn from "components/modal/Btn.vue";
import baseLogo from "assets/img/base_logo.jpg";
import { useUserMsg } from "@/store/user";
import { eventEmit } from "utils/emitter";
import { IS_LOGIN, IS_REGISTRY, ON_POPUP } from "constant/index";

const user = useUserMsg();

const logo = computed(() => user.msg.pic || baseLogo); 

function handleJumpToProfile() {
  window.open(`/profile`);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transform: scale(1);
  opacity: 1;
  transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
}

.fade-enter-from,
.fade-leave-to {
  position: absolute;
  opacity: 0;
  filter: blur(4px);
  transform: scale(0);
}
</style>
