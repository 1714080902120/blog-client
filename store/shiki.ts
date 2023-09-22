import { defineStore } from 'pinia';
import type { Highlighter } from 'shiki-es';


// 由于这玩意儿携带了function，所以没办法序列化，没办法从server side 传递到 client side, 导致得重新加载。
// 不过用户手动切换主题的时候也可以使用这里的cache，不需要手动创建

export const useShikiCache = defineStore('use_shiki_cache', () => {
  const cache: { dark: Map<string, Highlighter>, light: Map<string, Highlighter> } = {
    dark: new Map(),
    light: new Map(),
  }

  function setCache (mode: 'dark' | 'light', hightlighter: Highlighter, lang: string) {
    const hightlighters = cache[mode];

    if (hightlighters.get(lang)) return;

    hightlighters.set(lang, hightlighter)
  }

  function getCache (mode: 'dark' | 'light', lang: string) {
    const hightlighters = cache[mode];
    return hightlighters.get(lang);
  }

  return {
    setCache,
    getCache
  }
})
