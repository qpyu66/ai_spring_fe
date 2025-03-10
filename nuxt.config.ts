// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
    },
  },
  plugins: [{ src: "~/plugins/vue-flatpickr.js", mode: "client" }],
  modules: [
    "@pinia/nuxt",
    "@nuxt/devtools",
  ],

  pinia: {
    autoImports: ["storeToRefs"],
  },
})
