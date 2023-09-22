<template>
  <div class="w-full flex justify-end my-1 mx-2">
    <button
      :title="props.title"
      class="tips flex w-auto text-sm font-medium cursor-pointer outline-none"
      @click="emit('click')"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String
})
const emit = defineEmits(["click"]);
</script>

<style scoped></style>
