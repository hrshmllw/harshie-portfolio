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
      { name: "JetBrains Mono", provider: "google", weights: [400, 500] },
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
      // Runs in <head>, before first paint:
      // - `js`: reveal effects scope their hidden "before" state to it, so
      //   content stays visible without JS.
      // - `motion`: entry animations' initial states (skipped for reduced motion).
      // - `is-loading`: shows the preloader and locks scroll until it finishes.
      //   Scroll restoration is manual so a reload starts at the top, where the
      //   entry sequence plays.
      // Fail-safe: if the app never boots, drop both after 10s so nothing
      // stays hidden.
      script: [
        {
          innerHTML: [
            "(function(r){r.classList.add('js','is-loading');",
            "if('scrollRestoration' in history)history.scrollRestoration='manual';",
            "if(!window.matchMedia||!matchMedia('(prefers-reduced-motion: reduce)').matches)r.classList.add('motion');",
            "setTimeout(function(){if(!window.__introDone)r.classList.remove('motion','is-loading')},10000)",
            "})(document.documentElement)",
          ].join(""),
          tagPosition: "head",
        },
      ],
    },
  },
});
