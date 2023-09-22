<template>
  <div
    class="publish_draft_wrapper absolute
     top-20 left-5 px-4 py-3
    border rounded dark:border-violet-700/10
    lg:fixed z-20 2xl:left-36 backdrop-blur-2xl
    bg-gradient-to-br dark:from-indigo-900/10 dark:to-violet-900/40 from-rose-100/50 to-fuchsia-300/40
    "
  >
    <Btn
      class="base_btn border-r-0 rounded-tr-none rounded-br-none"
      :class="{ is_active: userMsg.isPub }"
      text="已发布"
      @click="onShowList(true)"
    ></Btn>
    <Btn
      class="base_btn border-l-0 rounded-tl-none rounded-bl-none"
      :class="{ is_active: !userMsg.isPub }"
      text="草稿箱"
      @click="onShowList(false)"
    ></Btn>
  </div>
  <div
    class="side_bar absolute top-20 right-10 px-4 py-3 border rounded dark:border-violet-700/10 lg:hidden z-20"
  >
    <div
      class="bg rounded absolute top-0 left-0 w-full h-full z-0 backdrop-blur-2xl bg-gradient-to-br dark:from-indigo-900/10 dark:to-violet-900/40 from-rose-100/50 to-fuchsia-300/40"
    ></div>

    <ul class="profile_side_bar outline-none z-10 flex items-center justify-around">
      <li
        v-for="(btn, index) in btnList"
        :key="index"
        class="flex-c mr-3 last:mr-0"
      >
        <Btn class="base_btn" :text="btn.text" @click="btn.event"></Btn>
      </li>
    </ul>
  </div>

  <div
    class="side_bar fixed top-1/3 left-10 px-4 py-3 border rounded dark:border-violet-700/10 hidden lg:flex z-20 2xl:left-44"
  >
    <div
      class="bg rounded absolute top-0 left-0 w-full h-full z-0 backdrop-blur-2xl bg-gradient-to-br dark:from-indigo-900/10 dark:to-violet-900/40 from-rose-100/50 to-fuchsia-300/40"
    ></div>

    <ul class="profile_side_bar outline-none z-10">
      <li
        v-for="(btn, index) in btnList"
        :key="index"
        class="flex-c my-3 last:mb-0"
      >
        <Btn class="base_btn" :text="btn.text" @click="btn.event"></Btn>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Btn from "../modal/Btn.vue";
import { LOGOUT } from "constant/fetchUrl";
import { getUserArticles, setArticle } from "@/request/index";
import { SHOW_TOAST } from "constant";
import { eventEmit } from "utils/emitter";
import { useUserMsg } from "store/user";

const userMsg = useUserMsg();

async function onShowList(state: boolean) {
  if (process.client) {
    window.scroll({ top: 0 })
  }

  // 做一下提前加载
  if (!state && userMsg.draft.list.length <= 0 && !userMsg.draft.isEnd) {
    await getUserArticles(false);
  } else {
    userMsg.updateIsPubState(state);
  }
}

const btnList = [
  {
    text: `添加文章`,
    event: handleAddArticle,
  },
  {
    text: `个人信息`,
    event: () => {},
  },
  {
    text: `退出登录`,
    event: handleLogout,
  },
];

async function handleAddArticle() {
  try {
    const { success, data } = await setArticle({});
    if (success) {
      window.open(`/profile/article-edit?id=${data?.Success?.id}`);
    }
  } catch (error) {
    eventEmit(SHOW_TOAST, "服务器貌似出了点问题。。。");
  }
}

async function handleLogout() {
  await $fetch(LOGOUT, { method: "POST" });

  window.open("/", "_self");
}
</script>

<style scoped>
.bg {
  box-shadow: var(--card_box_shadow);
}

.publish_draft_wrapper .base_btn {
  box-shadow: none;
}

.dark .is_active {
  background-image: linear-gradient(
    rgb(12 74 110 / 0.3),
    rgba(192, 38, 211, 0.5)
  );
  transition: all .3s ease;

  /* box-shadow: 10px 10px 100px 10px rgba(192, 38, 211, 0.4); */
  background-position: center;
  background-size: 350% 250%;
}
.light .is_active {
  transition: all .3s ease;

  background-image: linear-gradient(
    rgb(99 102 241 / 0.5),
    rgb(168 85 247 / 0.5),
    rgb(236 72 153 / 0.5)
  );
  /* box-shadow: 10px 10px 100px 10px rgb(236 72 153 / 0.2); */
  background-position: right bottom;
  background-size: 350% 250%;
}
</style>
