<template>
  <div
    class="relative user_article_list max-w-7xl pb-24 px-10 mt-24 min-h-screen flex flex-col items-center mx-auto"
  >
    <Transition name="slide">
      <main
        v-if="userMsg.isPub"
        class="content relative rounded-lg px-8 py-9 pt-4 max-w-3xl flex flex-col mx-auto"
      >
        <div
          class="bg rounded-lg absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-r dark:from-sky-900/10 dark:via-indigo-900/10 dark:to-violet-900/10 from-rose-100/10 to-fuchsia-300/10"
        ></div>
        <ArticleCard
          v-for="item in publishInstance.list"
          :item="item"
          :key="item.id"
        >
          <template v-slot:btns>
            <div class="btn_wrapper flex justify-end" @click.stop="() => {}">
              <Btn
                class="base_btn mr-3"
                text="编辑"
                @click="onEdit(item.id)"
              ></Btn>
              <Btn
                class="base_btn"
                text="删除"
                @click="onDelete(item.id)"
              ></Btn>
            </div>
          </template>
        </ArticleCard>
        <div
          v-if="publishInstance.list.length <= 0"
          class="empty_tips w-full flex-c z-10 flex-col"
        >
          <nuxt-img :src="loading" width="300"></nuxt-img>
          <div class="text_wrapper flex-c">
            您暂时没有文章，快点去创建一个吧~
            <Btn
              class="base_btn ml-3"
              text="添加文章"
              @click="handleAddArticle"
            ></Btn>
          </div>
        </div>
        <footer
          v-if="publishInstance.list.length > 0 && publishInstance.isEnd"
          class="list_bottom flex-c mt-5 font-bold z-10"
        >
          <nuxt-img :src="loading" width="100" class="mr-3"></nuxt-img
          >已经到底啦~
        </footer>
      </main>
      <main
        v-else
        class="content relative rounded-lg px-8 py-9 pt-4 max-w-3xl flex flex-col mx-auto"
      >
        <div
          class="bg rounded-lg absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-r dark:from-sky-900/10 dark:via-indigo-900/10 dark:to-violet-900/10 from-rose-100/10 to-fuchsia-300/10"
        ></div>
        <ArticleCard
          v-for="item in draftInstance.list"
          :item="item"
          :key="item.id"
        >
          <template v-slot:btns>
            <div class="btn_wrapper flex justify-end" @click.stop="() => {}">
              <Btn
                class="base_btn mr-3"
                text="编辑"
                @click="onEdit(item.id)"
              ></Btn>
              <Btn
                class="base_btn"
                text="删除"
                @click="onDelete(item.id)"
              ></Btn>
            </div>
          </template>
        </ArticleCard>
        <div
          v-if="draftInstance.list.length <= 0"
          class="empty_tips w-full flex-c z-10 flex-col"
        >
          <nuxt-img :src="loading" width="300"></nuxt-img>
          <div class="text_wrapper flex-c">
            您没有草稿~
            <Btn
              class="base_btn ml-3"
              text="添加文章"
              @click="handleAddArticle"
            ></Btn>
          </div>
        </div>
        <footer
          v-if="draftInstance.list.length > 0 && draftInstance.isEnd"
          class="list_bottom flex-c mt-5 font-bold z-10"
        >
          <nuxt-img :src="loading" width="100" class="mr-3"></nuxt-img
          >已经到底啦~
        </footer>
      </main>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import loading from "@/assets/img/loading.gif";

import Btn from "components/modal/Btn.vue";

import ArticleCard from "components/ArticleCard.vue";
import { eventEmit, eventOn } from "utils/emitter";
import { useUserMsg } from "store/user";
import {
  ON_SCROLL_REACH_ASIDE,
  AIM,
  ON_ALERT_SHOW,
  SHOW_TOAST,
PROFILE_ARTICLE_EDIT,
} from "constant";
import { delArticle, getUserArticles, setArticle } from "@/request";
import { debounce } from "utils/index";

const userMsg = useUserMsg();

const publishInstance = userMsg.getTargetArticlesList(true);
const draftInstance = userMsg.getTargetArticlesList(false);

const currInstance = computed(() =>
  userMsg.isPub ? publishInstance : draftInstance
);

let lock = false;

eventOn(
  ON_SCROLL_REACH_ASIDE,
  debounce(async (target: string) => {
    if (lock) return;
    if (currInstance.value.isEnd) return;
    if (target === AIM[0]) {
      try {
        await getUserArticles(userMsg.isPub);
      } catch (error) {
        console.error("get user articles fail", error);
      } finally {
        setTimeout(() => (lock = false), 300);
      }
    }
  }, 300)
);

function onEdit(id: string) {
  window.open(`/profile/${PROFILE_ARTICLE_EDIT}?id=${id}`)
}

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

async function onDelete(id: string) {
  eventEmit(ON_ALERT_SHOW, {
    msg: "确定要删除该文章吗？",
    cb: () => delArt(id),
  });
}

async function delArt(id: string) {
  try {
    const res = await delArticle(id);
    userMsg.delArticle(id);
    eventEmit(SHOW_TOAST, "删除成功！");
  } catch (error) {
    eventEmit(SHOW_TOAST, "删除失败！");
    console.log("something went wrong when delete article", error);
  }
}
</script>

<style scoped>
.content {
  min-width: 640px;
}

.slide-enter-active,
.slide-leave-active {
  position: absolute;
  /* backdrop-filter: blur(2px); */
  transition: all 0.4s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  
}

/* .slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
} */
</style>
