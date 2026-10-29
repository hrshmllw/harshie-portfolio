// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@vueuse/motion/nuxt",
    "@vueuse/nuxt",
  ],

  tailwindcss: {
    cssPath: "~/assets/css/main.css",
  },

  fonts: {
    families: [
      { name: "Archivo", provider: "google", weights: [400, 500, 600, 700] },
      { name: "Inter", provider: "google", weights: [400, 500, 600] },
    ],
  },

  runtimeConfig: {
    public: {
      web3formsAccessKey: "",
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
      bodyAttrs: {
        class: "bg-bg text-fg",
      },
    },
  },
});
