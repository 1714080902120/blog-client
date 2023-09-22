<template>
  <div class="feed">
    <form @submit.prevent="preventEvent" @keydown.enter="preventEvent">
      <div class="error_detail_post flex mb-3">
        <label for="form_email" class="pt-2 whitespace-nowrap">您的邮箱：</label>
        <input
          type="email"
          id="form_email"
          maxlength="100"
          class="input_item outline-none decoration-transparent px-3 py-2 dark:bg-violet-950/10 bg-rose-50/10 rounded border-b dark:border-b-white/20 border-b-black/20"
          v-model="form.email"
          @keydown.enter="() => {}"
          placeholder="请输入您的邮箱"
        />
      </div>
      <div class="error_detail_post flex">
        <label for="form_description" class="pt-2 whitespace-nowrap">问题描述：</label>
        <textarea
          type="textarea"
          id="form_description"
          cols="100"
          rows="10"
          maxlength="1000"
          class="input_item outline-none decoration-transparent px-3 py-2 dark:bg-violet-950/10 bg-rose-50/10 rounded border-b dark:border-b-white/20 border-b-black/20"
          v-model="form.description"
          placeholder="请输入问题描述"
        />
      </div>
      <p class="tips mt-3 ml-20">
        *内容格式尽量按照如下格式,这样方便开发者进行排查:<br />
        - 标题<br />
        &nbsp;&nbsp;xxx<br />
        - 环境<br />
        &nbsp;&nbsp;xxxx<br />
        - 触发流程<br />
        &nbsp;&nbsp;xxxxx<br />
        - 其它<br />
      </p>
      <div class="btn_wrapper flex-c">
        <Btn
          class="base_btn text-center mr-4"
          text="提交问题"
          @click="handleSendEamil"
        ></Btn>
        <Btn v-if="props.showBackHome"
          class="base_btn text-center"
          text="返回首页"
          @click="handleBackHome"
        ></Btn>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { SHOW_TOAST } from 'constant';
import { postErrorMsg } from '@/request';
import Btn from "components/modal/Btn.vue";

const emits = defineEmits(['ok'])

const props = defineProps({
  showBackHome: {
    type: Boolean,
    default: true
  }
})

const form = reactive({
  email: "",
  description: "",
});



async function handleSendEamil() {
  try {
    const { email, description } = form;

    const validateRes = validate(formatValidateData({ email, description }));

    if (validateRes) {
      eventEmit(SHOW_TOAST, validateRes);
      return;
    }
    const res = await postErrorMsg({
      email: form.email,
      msg: form.description,
    });
    if (res?.success) {
      eventEmit(
        SHOW_TOAST,
        res?.msg ||
          "发送问题成功,后续请留意邮箱,开发者处理完错误会回复您的问题~"
      );
      emits('ok')
    } else {
      throw new Error(res?.msg || "发送问题失败");
    }
  } catch (error) {
    console.error(error);
    eventEmit(SHOW_TOAST, "发送问题失败,请稍后再试!");
  }
}

function preventEvent(event: Event) {
  event.preventDefault();
}

function handleBackHome() {
  window.open("/", "_self");
}
</script>

<style scoped></style>
