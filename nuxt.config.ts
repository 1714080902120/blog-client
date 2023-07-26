import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config

const { API_BASE, SECRET_KEY } = process.env;

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],
  content: {
    documentDriven: false,
    highlight: {
      // Theme used in all color schemes.
      // theme: 'github-light'
      // OR
      theme: {
        // Default theme (same as single string)
        default: 'github-light',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
        sepia: 'monokai'
      }
    }
  },
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
    "types": fileURLToPath(new URL('./types', import.meta.url)), 
    "store": fileURLToPath(new URL('./store', import.meta.url)), 
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
});
