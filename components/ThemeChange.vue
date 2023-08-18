<script setup lang="ts">
const colorMode = useColorMode();
const show = ref(false);
setTimeout(() => {
  show.value = true;
});

const onClick = () => {
  const values = ["system", "light", "dark"];
  const index = values.indexOf(colorMode.preference);
  const next = (index + 1) % values.length;

  colorMode.preference = values[next];
};
</script>

<template>
  <div class="theme_change_wrapper flex-c">
    <button
      v-if="show"
      class="theme_change flex p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      aria-label="Color Mode"
      @click="onClick"
    >
      <nuxt-icon name="moon" v-if="colorMode.preference === 'dark'"></nuxt-icon>
      <nuxt-icon
        name="sun"
        v-else-if="colorMode.preference === 'light'"
      ></nuxt-icon>
      <nuxt-icon v-else name="desktop"></nuxt-icon>
    </button>
  </div>
</template>

<style>
.theme_change_wrapper {
  min-width: 2.25rem;
  min-height: 2.25rem;
  margin-right: 0.3rem;
  padding-top: 2px;
}

.theme_change {
  min-width: 1.25rem;
  min-height: 1.25rem;
}

.theme_change .nuxt-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: 0;

}
</style>
