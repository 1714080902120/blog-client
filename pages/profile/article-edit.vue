<template>
  <div class="article_edit h-full w-screen px-20 pb-16 pt-4">
    <Head>
      <Title>Serene syllables - 编辑文章</Title>
    </Head>
    <form @keydown.enter="noop" @submit.prevent="noop">
      <div class="item_wrapper mb-4">
        <label for="form_article_title">标题：</label>
        <input
          type="text"
          id="form_article_title"
          maxlength="30"
          class="input_item w-80 px-3 py-2 outline-none decoration-transparent dark:bg-violet-950/10 bg-rose-50/10 rounded border-b dark:border-b-white/30 border-b-black/20"
          v-model="form.title"
          placeholder="文章标题"
        />
      </div>
      <div class="item_wrapper mb-4 flex">
        <label for="form_article_description" class="pt-2">简介：</label>
        <textarea
          type="textarea"
          id="form_article_description"
          cols="60"
          rows="6"
          maxlength="250"
          class="input_item outline-none decoration-transparent px-3 py-2 dark:bg-violet-950/10 bg-rose-50/10 rounded border-b dark:border-b-white/20 border-b-black/20"
          v-model="form.description"
          placeholder="文章简介"
        />
      </div>
      <div class="tips opacity-50 mb-4">
        *文章标题和简介都不会被编入到文章里面，仅在文章列表中展示
      </div>

      <div class="item_wrapper mb-4 flex">
        <label for="form_article_description">上传图片：</label>
        <UploadArticleHeadPic @upload="onHeadPicUpload" />
      </div>
    </form>
    <Transition name="fade">
      <div class="md_editor_wrapper" v-show="show">
        <MdEditor
          ref="mdEditor"
          class="md_editor w-screen backdrop-blur"
          :theme="theme"
          v-model="form.mdContent"
          placeholder="输入内容..."
          :max-length="MD_CONTENT_MAX_LENGTH"
          :auto-detect-code="true"
          :show-toolbar-name="true"
          :toolbars="ARTICLE_EDITOR_TOOLBARS"
          :preview="false"
          :sanitize="sanitize"
          @save="onSave"
          @onDrop="onDrop"
          @onUploadImg="onImgUpload"
          @onError="onError"
        ></MdEditor>
        <div class="tips opacity-50 mt-3">
          *支持拖拽上传文件，仅支持<span class="font-bold">图片</span> 和<span
            class="font-bold"
            >markdown</span
          >文件, <span class="font-bold">markdown</span>文件会自动解析<br />
          *极少数code语法不支持（参考vscode的支持），若不支持，则默认会变成<span
            class="font-bold"
            >bash</span
          ><br />
          *预览功能仅起到查看markdown语法是否正常生效的作用，<span
            class="font-bold"
            >非最终文章展示效果</span
          >
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import UploadArticleHeadPic from "components/profile/UploadArticleHeadPic.vue";

import "md-editor-v3/lib/style.css";
import { MdEditor } from "md-editor-v3";
import {
  MD_CONTENT_MAX_LENGTH,
  SHOW_TOAST,
  ARTICLE_EDITOR_TOOLBARS,
  UPLOAD_ARTICLE_IMG,
} from "constant";
import { eventEmit } from "utils/emitter";

import DOMPurify from "isomorphic-dompurify";

import { useUserMsg } from "store/user";
import { protectMdCodeBlockFromSanitize } from "utils";
import { isImages } from "utils/upload";
import { setArticle } from "@/request";

const sanitize = (html: string) => DOMPurify.sanitize(html);
const show = ref(false);

const mdEditor = ref(null);

const colorMode = useColorMode();

setTimeout(() => {
  show.value = true;
});
const theme = computed(() => {
  return process.client
    ? colorMode.value === "system"
      ? window?.matchMedia("(prefers-color-scheme: dark)")?.matches
        ? "dark"
        : "light"
      : colorMode.value
    : "dark";
});

const userMsg = useUserMsg();

const form = reactive({
  title: userMsg.editFormData.title,
  description: userMsg.editFormData.description,
  mdContent: userMsg.editFormData.mdContent,
  headPic: userMsg.editFormData.headPic,
});

function onHeadPicUpload(name: string) {
  form.headPic = name;
}

async function onImgUpload(
  files: Array<File>,
  callback: (urls: string[]) => void | string | Promise<string>
) {
  Promise.all(
    files.map((file: File) => {
      return new Promise((resolve, reject) => {
        const fileName = `${file.lastModified}.${file.size}.${
          file.name || "_.jpg"
        }`;
        const fileSymbol = `${file.lastModified}_${file.size}`;
        uploadFile({
          file,
          fileName,
          fileSymbol,
          type: UPLOAD_ARTICLE_IMG,
          fileType: file.type,
        })
          .then((res) => {
            console.log(res);
            if (res.success) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((error) => reject(error));
      });
    })
  )
    .then(async (res) => {
      const tips = await callback(res.map((item: any) => item?.data?.url));

      eventEmit(SHOW_TOAST, tips || "资源上传成功~");
    })
    .catch((error) => {
      console.log("something went wrong when upload sources", error);
      eventEmit(SHOW_TOAST, "资源上传失败！请确认网络是否正常或者稍后再试");
    });
}

async function onDrop(event: DragEvent) {
  const files = event.dataTransfer?.files || [];
  await onImgUpload(
    Array.from(files).filter((file) => isImages(file)),
    (imgList: string[] = []) => {
      (mdEditor.value as any).insert((selectedText: string) => {
        return {
          targetValue: imgList.reduce(
            (prev, current, index) =>
              `${prev}\n![${files[index].name}](${current})`,
            "\n"
          ),
          select: false,
          deviationStart: 0,
          deviationEnd: 0,
        };
      });
    }
  );
}

function transformStrIntoFile(str: string): File {
  let blob = new Blob([str], { type: "text/markdown" });
  let file = new File([blob], userMsg.editFormData.id, {
    type: "text/markdown",
  });
  console.log(file);
  return file;
}

async function onSave(v: string) {
  try {
    const sanitizedText = protectMdCodeBlockFromSanitize(v);

    const file = transformStrIntoFile(sanitizedText);

    await onImgUpload([file], async (_urls: string[]) => {
      const formData = userMsg.editFormData;
      const res = await setArticle({
        id: formData.id,
        isPublish: false, // 这里必须都为false,需要进入审核阶段
        title: formData.title,
        description: formData.description,
        headPic: formData.headPic,
        author_id: userMsg.msg.id,
      });

      if (res.success) {
        return `保存成功~`;
      } else {
        return `保存失败! 请稍后再试`;
      }
    });
  } catch (error) {
    console.error("something went wrong when save article", error);
  }
}

function onError(err: {
  name: "Cropper" | "fullscreen" | "prettier" | "overlength";
  message: string;
}) {
  const { name, message } = err || {};
  if (name === "overlength") {
    eventEmit(SHOW_TOAST, "已经达到内容上限啦！");
  } else {
    eventEmit(SHOW_TOAST, "资源加载有问题！请稍后手动刷新");
  }
  console.error(message);
}

function noop(e: Event) {
  e.preventDefault();
}
</script>

<style></style>

<style scoped>
.article_edit {
  min-width: 640px;
}

.md_editor_wrapper {
  min-height: 100vh;
}

.md_editor {
  height: 100vh;
}

.input_item {
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  filter: blur(4px);
}

.fade-enter-from {
  transform: translateX(-100px);
}
</style>
