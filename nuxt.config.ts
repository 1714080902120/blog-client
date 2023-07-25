import { RuntimeConfig } from "nuxt/schema";
import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config

const { API_BASE, SECRET_KEY } = process.env;

export default defineNuxtConfig({
  modules: [
    '@nuxt/content'
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    app: {
      apiBase: API_BASE,
      secretKey: SECRET_KEY,
    },
  },
  alias: {
    "@": '/',
    "~": '/',
    "theme": fileURLToPath(new URL('./assets/theme', import.meta.url)),
    "utils": fileURLToPath(new URL('./utils', import.meta.url)), 
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
});
