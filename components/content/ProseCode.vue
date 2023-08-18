<template>
  <div class="code_container">
    <Transition name="fade">
      <div
        class="code_wrapper_loading p-2.5 border rounded-lg backdrop-blur boder-indigo-500 bg-gradient-to-r from-cyan-300/15 to-cyan-100/30 dark:border-sky-900 dark:bg-black/10"
        v-if="!html"
      >
        <Loading />
      </div>
      <div class="code_wrapper_ready" v-else>
        <div
          class="code_wrapper p-2.5 border rounded-lg backdrop-blur boder-indigo-500 bg-gradient-to-r from-cyan-300/15 to-cyan-100/30 dark:border-sky-900 dark:bg-black/10"
          v-html="html"
        ></div>
        <CodeCopyButton class="copy_btn" :content="copyContent"></CodeCopyButton>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Loading from "../Loading.vue";

import CodeCopyButton from "../CodeCopyBtn.vue";
import darkMode from "assets/theme/code-dark.js";
import lightMode from "assets/theme/code-light.js";

import { Highlighter, Lang, getHighlighter } from "shiki-es";
import { eventOn } from "utils/emitter";
import { ON_SYSTEM_THEME_CHANGE } from "@/constant/index";
import type { ThemeMode } from '@/types/theme'

const props = withDefaults(
  defineProps<{
    code?: string;
    language?: string | null;
    filename?: string | null;
    highlights?: number[] | undefined;
  }>(),
  { code: "", language: null, filename: null }
);

const highlighter: Ref<Highlighter | null> = ref(null);
const html = ref("");
const colorMode = useColorMode();
const theme: Ref<any> = ref(null);

const copyContent = `\`\`\`${props.language || 'text'}
${props.code}
\`\`\``

// 监听一波浏览器自身的主题变化
eventOn(ON_SYSTEM_THEME_CHANGE, async (mode: string) => {
  const t = { dark: darkMode, light: lightMode }[mode];

  if (t == theme.value) return;

  theme.value = t;

  await genHtml(theme.value);
});

// 监听下用户手动主题切换
watch(
  () => colorMode.preference,
  async (newVal) => await onModeChange(newVal as ThemeMode)
);
await onModeChange(colorMode.preference as ThemeMode);

async function onModeChange(mode: ThemeMode) {

  const t = {
    dark: () => darkMode,
    light: () => lightMode,
    system: () => {
      if (process.client) {
        return window?.matchMedia("(prefers-color-scheme: dark)")?.matches
          ? darkMode
          : lightMode;
      }
      return darkMode;
    },
  }[mode]();

  if (t == theme.value) {
    return;
  }
  theme.value = t;
  await genHtml(theme.value);
}

async function genHtml(theme: any) {
  setTimeout(async () => {
    const lang = (props?.language || "bash") as Lang;
    try {
      highlighter.value = await getHighlighter({
        theme,
        langs: [lang],
      });
    } catch (error) {
      highlighter.value = await getHighlighter({
        theme,
        langs: ["bash" as Lang],
      });
    } finally {
      nextTick(() => {
        html.value = (highlighter.value as Highlighter).codeToHtml(
          props?.code,
          {
            lang,
            // includeExplanation: false,
          }
        );
      });
    }
  }, 0);
}
</script>

<style>
.code_container {
  position: relative;
}

.copy_btn {
  opacity: 0;
  transition: all 0.5s ease;
  position: absolute;
  bottom: 0;
  right: 0;
}

.code_container:hover .copy_btn {
  opacity: 1;
}

.code_wrapper {
  border-radius: var(--radii-md);
  border-style: solid;
  border-width: 1px;
  font-size: var(--prose-code-block-fontSize);

  position: relative;
  width: 100%;
}

.code_container .shiki {
  overflow: hidden;
  overflow-x: auto;
  background-color: transparent !important;
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  position: absolute;
  opacity: 0;
  filter: blur(4px);
}
.code_wrapper_loading {
  width: 100%;
  display: flex;
}
</style>
