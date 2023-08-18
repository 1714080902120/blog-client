import { fileURLToPath } from "url";
import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config

const { API_BASE, SECRET_KEY } = process.env;

export default defineNuxtConfig({
  extends: ['@nuxt-themes/docus', "@nuxt-themes/typography"],
  modules: ["@nuxt/content", "@pinia/nuxt", '@nuxtjs/tailwindcss', '@nuxtjs/color-mode', 'nuxt-icons'],
  css: [
    'css/index.css'
  ],
  colorMode: {
    classSuffix: '',
  },
  content: {
    documentDriven: false,
  },
  devtools: { enabled: true },
  runtimeConfig: {
    app: {
      apiBase: API_BASE,
      secretKey: SECRET_KEY,
    },
  },
  alias: {
    "@": fileURLToPath(new URL("./", import.meta.url)),
    "~": fileURLToPath(new URL("./", import.meta.url)),
    theme: fileURLToPath(new URL("./assets/theme", import.meta.url)),
    utils: fileURLToPath(new URL("./utils", import.meta.url)),
    types: fileURLToPath(new URL("./types", import.meta.url)),
    store: fileURLToPath(new URL("./store", import.meta.url)),
    css: fileURLToPath(new URL("./assets/css", import.meta.url)),
    assets: fileURLToPath(new URL("./assets", import.meta.url)),
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
            "Vue, Nuxt, Rust program language, Tokio, web frontend, web client, Docker",
        },
        {
          name: "description",
          content:
            "坏蛋Dan的个人博客，里面包含了Vue, Nuxt, Rust program language, Docker, web frontend, web client等，主要是前端和Rust相关的",
        },
        {
          charset: "utf-8",
        },
      ],
    },
  },
});
