<template>
  <div class="error_page h-screen w-screen flex-c flex-col">
    <nuxt-img :src="dog" width="300" class="mb-3"></nuxt-img>
    <template v-if="false && props.error.statusCode === 404">
      该页面不存在~
      <Btn
        class="base_btn text-center mt-3"
        text="返回首页"
        @click="handleBackHome"
      ></Btn>
    </template>
    <template v-else>
      <h2 class="mb-3">
        页面发生了错误,这个错误可能是系统内部错误,可以联系开发者反馈该问题
      </h2>
      <p class="mb-3 font-bold text-lg">错误信息:{{ props.error.message }}</p>

      <Feedback />
    </template>
  </div>
  <ClientOnly>
    <Toast />
  </ClientOnly>
</template>

<script setup lang="ts">
import dog from "@/assets/img/dog.gif";
import Toast from "components/Toast.vue";
import Btn from "components/modal/Btn.vue";
import Feedback from "components/Feedback.vue";
const props = defineProps<{ error: { statusCode: number; message: string } }>();

console.error(props.error);

function handleBackHome() {
  window.open("/", "_self");
}
</script>

<style></style>

<style scoped></style>
