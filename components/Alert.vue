<template>
  <Modal title="警告" @ok="onOk" @cancel="onCancel" v-if="show">
    <div class="content text-lg">{{ content }}</div>
  </Modal>
</template>

<script setup lang="ts">
import { ON_ALERT_SHOW } from 'constant';
import Modal from './modal/Modal.vue';
import { eventOn } from 'utils/emitter'

let callback: null | Function = null;
let content = '';

const show = ref(false);

eventOn(ON_ALERT_SHOW, (opt: { msg: string; cb: Function | null }) => {
  const { msg = '', cb = null } = opt || {};
  content = msg;
  callback = cb;
  show.value = true
})


function onOk() {
  callback && callback()
  show.value = false;
}
function onCancel() {
  show.value = false;
}


</script>

<style scoped>

</style>
