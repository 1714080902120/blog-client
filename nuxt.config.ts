import { fileURLToPath } from "url";
import { defineNuxtConfig } from "nuxt/config";


// https://nuxt.com/docs/api/configuration/nuxt-config

const { PROD } = process.env;

export default defineNuxtConfig({
  extends: ['@nuxt-themes/docus', "@nuxt-themes/typography"],
  modules: ["@nuxt/content", "@pinia/nuxt", '@nuxtjs/tailwindcss', '@nuxtjs/color-mode', 'nuxt-icons', '@nuxt/image'],
  css: [
    'css/index.css'
  ],
  colorMode: {
    classSuffix: '',
  },
  content: {
    documentDriven: false,
  },
  image: {
    domains: [],
  },
  sourcemap: {
    server: !PROD,
    client: !PROD
  },
  devtools: { enabled: !PROD },
  alias: {
    "@": fileURLToPath(new URL("./", import.meta.url)),
    "~": fileURLToPath(new URL("./", import.meta.url)),
    theme: fileURLToPath(new URL("./assets/theme", import.meta.url)),
    utils: fileURLToPath(new URL("./utils", import.meta.url)),
    types: fileURLToPath(new URL("./types", import.meta.url)),
    store: fileURLToPath(new URL("./store", import.meta.url)),
    css: fileURLToPath(new URL("./assets/css", import.meta.url)),
    assets: fileURLToPath(new URL("./assets", import.meta.url)),
    components: fileURLToPath(new URL("./components", import.meta.url)),
    constant: fileURLToPath(new URL("./constant", import.meta.url)),
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    keepalive: false,
    head: {
      title: "Serene syllables",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "keyword",
          content:
            "blog platform, Vue, Nuxt, Rust program language, Tokio, web frontend, web client, Docker",
        },
        {
          name: "description",
          content:
            "一个简洁的博客平台，里面包含了一些技术文章",
        },
        {
          charset: "utf-8",
        },
      ],
    },
  },
  tailwindcss: {
    viewer: false,
  }
});
