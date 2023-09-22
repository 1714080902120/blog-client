<template>
  <button @click="emit('click')"
  class="
    transition-all ease-in-out duration-700
    outline-none border rounded px-3 py-1 font-medium
    border-fuchsia-200/10 dark:border-sky-600/10
    backdrop-blur bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20
    dark:from-cyan-900/50 dark:to-violet-900/50

  ">
    {{ props.text }}
  </button>
</template>

<script setup lang="ts">

const props = defineProps({
  text: String
})

const emit = defineEmits(['click']);

</script>

<style scoped></style>
