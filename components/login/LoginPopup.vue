<template>
  <Modal :title="title" @ok="handleOk" @cancel="handleCancel" v-if="show">
    <Transition name="fade">
      <form
        @keydown.enter="onEnterSubmit"
        @submit.prevent="onSubmit"
        v-if="popupState === IS_LOGIN"
      >
        <LoginInput
          label="账号"
          id="login_key"
          type="text"
          autocomplete="text"
          placeholder="请输入手机号或者邮箱"
          v-model="formData.name"
        />
        <LoginInput
          label="密码"
          id="login_pwd"
          type="password"
          autocomplete="password"
          placeholder="请输入密码"
          v-model="formData.pwd"
        />
        <LoginTip
          @click="handleSwitchType(IS_FORGET_PWD)"
          :title="'点击切换到修改密码'"
        >
          忘记密码？
        </LoginTip>
      </form>
      <form
        @keydown.enter="onEnterSubmit"
        @submit.prevent="onSubmit"
        v-else-if="popupState === IS_REGISTRY"
      >
        <LoginInput
          label="设置头像"
          id="registry_pic"
          type="file"
          autocomplete="file"
          :is-needed="false"
          placeholder="上传图片作为头像"
        >
          <template v-slot:customInput>
            <UploadLogo @upload="onUploadPic" />
          </template>
        </LoginInput>
        <LoginInput
          label="用户名"
          id="registry_key"
          type="text"
          autocomplete="text"
          placeholder="请输入昵称"
          v-model="formData.name"
        />
        <LoginInput
          label="简介"
          id="registry_desc"
          type="text"
          :is-needed="false"
          autocomplete="text"
          placeholder="请输入简介"
          v-model="formData.desc"
        />
        <LoginInput
          label="密码"
          id="registry_pwd"
          type="password"
          autocomplete="password"
          placeholder="请输入密码"
          v-model="formData.pwd"
        />
        <LoginInput
          label="确认密码"
          id="registry_sec_pwd"
          type="password"
          autocomplete="password"
          placeholder="请再次输入密码"
          v-model="formData.secPwd"
        />
        <LoginInput
          label="邮箱"
          id="registry_email"
          type="email"
          autocomplete="email"
          placeholder="请输入邮箱"
          v-model="formData.email"
        >
          <template v-slot:input-tips class="tips">
            <div class="py-1 text-xs dark:text-gray-50/70 text-gray-800/50">
              收集邮箱仅为了作为您的登录账号、修改密码的方式以及方便游客联系文章作者
            </div>
          </template>
        </LoginInput>
        <LoginTip @click="handleSwitchType(IS_LOGIN)" :title="'点击切换到登录'"
          >已有账号？</LoginTip
        >
      </form>
      <form
        @keydown.enter="onEnterSubmit"
        @submit.prevent="onSubmit"
        v-else-if="popupState === IS_FORGET_PWD"
      >
        <LoginInput
          label="邮箱"
          id="forget_pwd_email"
          type="email"
          autocomplete="email"
          placeholder="请输入邮箱"
          v-model="formData.email"
        />
        <LoginInput
          label="新密码"
          id="forget_pwd_new"
          type="password"
          autocomplete="password"
          placeholder="请输入密码"
          v-model="formData.pwd"
        />
        <LoginInput
          label="确认新密码"
          id="forget_pwd_new_sec"
          type="password"
          autocomplete="password"
          placeholder="请再次输入密码"
          v-model="formData.secPwd"
        />
        <LoginTip @click="handleSwitchType(IS_LOGIN)" :title="'点击切换到登录'">
          又记得了？
        </LoginTip>
        <LoginTip
          @click="handleSwitchType(IS_REGISTRY)"
          :title="'点击切换到注册'"
        >
          还是说没注册？
        </LoginTip>
      </form>
    </Transition>
    <div
      v-if="validateTips !== ''"
      class="error_tips dark:text-rose-500/80 text-rose-700/80 flex-c text-sm font-semibold"
    >
      {{ validateTips }}
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "../modal/Modal.vue";
import LoginInput from "./LoginInput.vue";
import LoginTip from "./LoginTip.vue";
import UploadLogo from "./UploadLogo.vue";
import {
  ON_POPUP,
  IS_LOGIN,
  IS_REGISTRY,
  IS_FORGET_PWD,
  POPUP_TITLE,
  SHOW_TOAST,
} from "constant/index";
import { eventEmit, eventOn } from "utils/emitter";

import type { PopupState } from "@/types/index";

import { okFnType } from "./onOk";

import { useUserMsg } from "store/user";

const popupState: Ref<PopupState> = ref(IS_LOGIN);

const title = ref(POPUP_TITLE[IS_LOGIN]);

const show = ref(false);

eventOn(ON_POPUP, (state: PopupState) => {
  handleSwitchType(state);
  show.value = true
});

function onEnterSubmit(e: Event) {
  e.preventDefault();
  handleOk();
}

function onSubmit(e: Event) {
  e.preventDefault();
}

function onUploadPic(name: string) {
  formData.pic = name;
}

const formData = reactive({
  name: "",
  desc: "",
  pwd: "",
  secPwd: "",
  email: "",
  pic: "",
  // phone: "", // 这个字段直接废弃算了，手机号这个没必要收集
});

const validateTips = ref("");

async function handleOk() {
  try {
    const { success, msg, data } = await okFnType[
      popupState.value as PopupState
    ](formData);

    if (success) {
      if (popupState.value !== IS_FORGET_PWD) {
        const userMsg = useUserMsg();
        userMsg.setUserMsg(data?.Success);
        show.value = false
      }
      eventEmit(SHOW_TOAST, msg);
    } else {
      console.log(msg);
      validateTips.value = `${msg}`;
    }
  } catch (error) {
    console.error("something went wrong when login/registry/resetPwd", error);
    validateTips.value = `内部错误`;
  }
}

function handleSwitchType(type: PopupState) {
  validateTips.value = "";
  popupState.value = type;
  title.value = POPUP_TITLE[type] as string;
}
function handleCancel() {
  show.value = false;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
}

.fade-enter-from,
.fade-leave-to {
  position: absolute;
  opacity: 0;
  filter: blur(4px);
  transform: translateX(20%);
}
</style>
