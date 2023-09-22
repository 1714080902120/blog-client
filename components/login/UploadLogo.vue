<template>
  <div class="upload_logo_wrapper rounded-full w-64">
    <div
      class="upload_logo rounded-full border w-14 h-14 cursor-pointer flex-c relative dark:border-indigo-400/30 border-rose-300/50"
      :class="{ had_logo: logo }"
    >
      <input
        class="opacity-0 rounded-full w-14 h-14 absolute top-0 left-0 z-20 cursor-pointer"
        type="file"
        title="设置头像"
        id="registry_pic"
        autocomplete="file"
        placeholder="上传图片作为头像"
        :disabled="isUploading"
        accept="images/*"
        @change="onUploadLogo"
      />
      <nuxt-icon
        class="upload_img absolute"
        name="upload"
        v-if="!logo"
      ></nuxt-icon>

      <div class="img_wrapper flex-c" v-if="logo">
        <nuxt-img
          v-if="logo"
          provider="cloudinary"
          format="avif,webp"
          class="rounded-full w-14 h-14"
          :src="logo"
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
import { ON_CANCEL_IMAGE_EDITOR, PER_MB, SHOW_TOAST, UPLOAD_SINGLE_FILE_SIZE, UPLOAD_USER_IMG } from "constant";
import { imgEdit, uploadFile } from "utils/upload";
import { ref } from "vue";
import type { Ref } from "vue";
import { eventEmit, eventOn } from "utils/emitter";

// 这里也需要监听下，不然锁开不了, 有点蛋疼，待优化
eventOn(ON_CANCEL_IMAGE_EDITOR, () => {
  isUploading.value = false;
})

const emit = defineEmits(["upload"]);

const isUploading = ref(false);

const logo: Ref<null | string> = ref(null);

async function onUploadLogo(event: Event) {
  // @ts-ignore
  const file: File = event?.target?.files[0];

  if (!file) return;

  if (file.size > UPLOAD_SINGLE_FILE_SIZE) {
    eventEmit(SHOW_TOAST, `头像上传不得大于${UPLOAD_SINGLE_FILE_SIZE / PER_MB}M`);
    return;
  }

  isUploading.value = true;

  try {

    const editedFile = await imgEdit(file);

    const res = await uploadFile({
      file: editedFile,
      fileName: `${file.lastModified}.${file.size}.${encodeURIComponent(file.name) || "_.jpg"}`,
      fileSymbol: `${file.lastModified}_${file.size}`,
      type: UPLOAD_USER_IMG,
      fileType: editedFile.type,
    });

    if (res?.success) {
      logo.value = res?.data?.url as string;
    }

    eventEmit(SHOW_TOAST, res?.msg || '上传失败，请稍后再试');
    emit("upload", res?.data?.name as string);
  } catch (error) {
    console.log("upload image fail", error);
  } finally {
    isUploading.value = false;
  }
}
</script>

<style>
.upload_logo .nuxt-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  transition: all 0.3s ease-in-out;
}

.had_logo.upload_logo .edit_img svg {
  opacity: 0;
}

.had_logo.upload_logo:hover .edit_img svg {
  opacity: 1;
}

.upload_logo:hover .nuxt-icon svg {
  transform: scale(1.1, 1.1);
}
</style>

<style scoped></style>
