import { defineStore } from "pinia";
import { Categoires } from "types";

export const useAside = defineStore("use_aside", () => {
  function genTempCategories() {
    const tags = [
      "bash",
      "docker",
      "typescript",
      "ts",
      "js",
      "vue",
      "react",
      "go",
      "rust",
      "nginx",
      "javascript",
      "人工智能",
      "nuxt3",
      "原神，启动",
      "黑暗之魂3",
      "装甲核心6",
      "你说的对，但是aaaaaaaaaaaaaaaaaaa",
      "html",
      "css",
      "vim",
      "sevlte",
      "vanillaJs",
    ];
    setCategories(
      tags.map((item) => ({ id: genRandomStr(), name: item, description: "" }))
    );
  }

  const categories: Categoires[] = reactive([]);

  function setCategories(list: Categoires[]) {
    categories.push(...list);
  }

  genTempCategories();

  return {
    categories,
    setCategories,
  };
});
