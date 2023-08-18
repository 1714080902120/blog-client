<template>
  <button
    ref="copyButtonRef"
    @click="copy"
  >
    <span class="sr-only">Copy to clipboard</span>
    <span class="icon-wrapper w-7 h-7">
      <Transition name="fade">
        <nuxt-icon
          name="LucideCopyCheck"
          class="copied icon"
          filled
          v-if="state === 'copied'"
        />
        <nuxt-icon v-else name="LucideCopy" filled class="icon" />
      </Transition>
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useClipboard, onClickOutside } from "@vueuse/core";
const props = defineProps({
  content: {
    type: String,
    default: "",
  },
});
const state = ref("init");

const copyButtonRef = ref<HTMLElement>();

const { copy: copyToClipboard } = useClipboard();
onClickOutside(copyButtonRef, () => {
  if (state.value === "copied") {
    state.value = "init";
  }
});

async function copy () {
  try {
    await copyToClipboard(props.content);
    state.value = "copied";
  } catch (error) {
      console.warn("Couldn't copy to clipboard!", error);
  }
}

</script>

<style scoped>
button {
  padding: 4px;
  margin-bottom: 3px;
  margin-right: 3px;
  border-radius: 3px;
  transition: all 200ms;
  transform: scale(0.75);
  opacity: 0;
}

button:focus {
  opacity: 1;
  outline: none;
  /* box-shadow: 0 0 0 2px #d4d4d8; */
}

.icon-wrapper {
  display: block;
  position: relative;
}

.icon {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  transform: translate(-50%, -50%) scale(1.5);
}
.fade-enter-active,
.fade-leave-active {
  transition: all .3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
