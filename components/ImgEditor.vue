<template>
  <div class="__img_editor relative flex-c" v-show="show">
    <div class="close_btn rounded-full p-5 flex-c absolute -top-16 bg-slate-800/10 cursor-pointer">
      <nuxt-icon name="close" @click="cancelEdit"></nuxt-icon>
    </div>
    <div class="mask fixed bg-black/10 w-screen h-screen" @click="cancelEdit"></div>
  </div>
</template>

<script setup lang="ts">
import { HIDE_IMAGE_EDITOR, ON_CANCEL_IMAGE_EDITOR, SHOW_IMAGE_EDITOR } from 'constant';
import { eventOn } from 'utils/emitter'
import { resetPintura } from 'utils/upload'

const show = ref(false);


eventOn(SHOW_IMAGE_EDITOR, () => (show.value = true));
eventOn(HIDE_IMAGE_EDITOR, cancelEdit)


function cancelEdit () {

  resetPintura()
  show.value = false;
  eventEmit(ON_CANCEL_IMAGE_EDITOR)
}


</script>




<style scoped>
.close_btn {
  z-index: 1;
}
.close_btn:hover {
  transition: all .3s ease;
  transform: scale(1.2);
}
</style>
