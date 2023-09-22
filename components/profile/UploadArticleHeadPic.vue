<template>
  <div class="upload_article_head_pic_wrapper rounded-lg">
    <div
      class="upload_article_head_pic rounded-lg border cursor-pointer flex-c relative dark:border-indigo-400/30 border-rose-300/50"
      :class="{ had_logo: logo }"
    >
      <input
        class="head_pic_input opacity-0 rounded-lg absolute top-0 left-0 z-20 cursor-pointer"
        type="file"
        title="设置文章头图"
        id="article_pic"
        autocomplete="file"
        placeholder="上传图片"
        :disabled="isUploading"
        accept="images/*"
        @change="onUploadHeadPic"
      />
      <nuxt-icon
        class="upload_img absolute"
        name="upload"
        v-if="!logo"
      ></nuxt-icon>

      <div class="img_wrapper flex-c" v-if="logo">
        <nuxt-img
          v-if="logo"
          :quality="1"
          provider="cloudinary"
          format="avif,webp"
          class="rounded-lg"
          :src="logo"
          width="320"
          height="180"
          fit="outside"
        />
        <nuxt-icon
          class="edit_img absolute cursor-pointer"
          name="imgEdit"
        ></nuxt-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ON_CANCEL_IMAGE_EDITOR,
  PER_MB,
  SHOW_TOAST,
  UPLOAD_SINGLE_FILE_SIZE,
  UPLOAD_USER_IMG,
} from "constant";
import { imgEdit, uploadFile } from "utils/upload";
import { ref } from "vue";
import type { Ref } from "vue";
import { eventEmit, eventOn } from "utils/emitter";

const isUploading = ref(false);

// 这里也需要监听下，不然锁开不了
eventOn(ON_CANCEL_IMAGE_EDITOR, () => {
  isUploading.value = false;
});

const emit = defineEmits(["upload"]);

const logo: Ref<null | string> = ref(null);

async function onUploadHeadPic(event: Event) {
  // @ts-ignore
  const file: File = event?.target?.files[0];

  if (!file) return;

  if (file.size > 4 * UPLOAD_SINGLE_FILE_SIZE) {
    eventEmit(
      SHOW_TOAST,
      `头像上传不得大于${(4 * UPLOAD_SINGLE_FILE_SIZE) / PER_MB}M`
    );
    return;
  }

  isUploading.value = true;

  try {
    const editedFile = await imgEdit(file, 16 / 9);
    console.log(23333, editedFile);
    const res = await uploadFile({
      file: editedFile,
      fileName: `${file.lastModified}.${file.size}.${
        encodeURIComponent(file.name) || "_.jpg"
      }`,
      fileSymbol: `${file.lastModified}_${file.size}`,
      type: UPLOAD_USER_IMG,
      fileType: editedFile.type,
    });

    if (res.success) {
      logo.value = res?.data?.url as string;
    }

    eventEmit(SHOW_TOAST, res.msg);
    emit("upload", res?.data?.name as string);
  } catch (error) {
    console.log("upload image fail", error);
  } finally {
    isUploading.value = false;
  }
}
</script>

<style>
.upload_article_head_pic .nuxt-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  transition: all 0.3s ease-in-out;
}

.upload_article_head_pic_wrapper .upload_article_head_pic,
.upload_article_head_pic_wrapper .head_pic_input,
.upload_article_head_pic_wrapper .img_wrapper {
  width: 320px;
  height: 180px;
  overflow: hidden;
}

.had_logo.upload_article_head_pic .edit_img svg {
  opacity: 0;
}

.had_logo.upload_article_head_pic:hover .edit_img svg {
  opacity: 1;
}

.upload_article_head_pic:hover .nuxt-icon svg {
  transform: scale(1.1, 1.1);
}
</style>

<style scoped></style>
