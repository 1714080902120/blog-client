<template>
  <div :style="sv">
    <NuxtPage></NuxtPage>
  </div>
</template>

<script setup>
import { changeTheme } from 'theme/index';
const sv = reactive(changeTheme());

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(4px);
}
</style>