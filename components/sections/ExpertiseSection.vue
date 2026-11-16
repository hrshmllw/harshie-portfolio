<script setup lang="ts">
/** Ticker rows: one slow, draggable ticker per category; icons show their full-colour logo on hover. */
const { site } = useAppConfig();

// Full-colour logos shown on hover, from the gilbarbara/logos set (Devicon for
// jQuery, whose `logos` version is a wordmark). Axios has no full-colour mark,
// so its single-colour icon takes the official purple instead.
const LOGO: Record<string, string> = {
  "simple-icons:html5": "logos:html-5",
  "simple-icons:css": "logos:css-3",
  "simple-icons:javascript": "logos:javascript",
  "simple-icons:typescript": "logos:typescript-icon",
  "simple-icons:sass": "logos:sass",
  "simple-icons:tailwindcss": "logos:tailwindcss-icon",
  "simple-icons:react": "logos:react",
  "simple-icons:nextdotjs": "logos:nextjs-icon",
  "simple-icons:vuedotjs": "logos:vue",
  "simple-icons:nuxt": "logos:nuxt-icon",
  "simple-icons:wordpress": "logos:wordpress-icon",
  "simple-icons:php": "logos:php",
  "simple-icons:woocommerce": "logos:woocommerce-icon",
  "simple-icons:shopify": "logos:shopify",
  "simple-icons:greensock": "logos:greensock-icon",
  "simple-icons:jquery": "devicon:jquery",
  "simple-icons:webpack": "logos:webpack",
  "simple-icons:npm": "logos:npm-icon",
  "simple-icons:git": "logos:git-icon",
  "simple-icons:figma": "logos:figma",
  "simple-icons:eslint": "logos:eslint",
  "simple-icons:prettier": "logos:prettier",
  "simple-icons:jest": "logos:jest",
  "simple-icons:mocha": "logos:mocha",
};
const BRAND: Record<string, string> = { "simple-icons:axios": "#5A29E4" };

const rows = computed(() =>
  site.technologies.map((group) => ({
    category: group.category,
    items: group.items.map((item) => ({
      ...item,
      logo: LOGO[item.icon],
      brand: BRAND[item.icon] ?? "#C4454A",
    })),
  })),
);
</script>

<template>
  <section id="expertise" class="rule-top" aria-labelledby="expertise-title">
    <div class="container-x section-pad pb-0 md:pb-0">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl">
          <p data-reveal-item class="eyebrow eyebrow-marker">Expertise</p>
          <h2 id="expertise-title" data-reveal-heading class="section-title mt-4">
            Technologies &amp;&nbsp;Tools
          </h2>
        </div>
        <p data-reveal-item class="hidden font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted md:block">
          Drag to scroll
        </p>
      </div>
    </div>

    <div class="rule-top mt-14 pb-20 md:pb-28">
      <UiTickerRow
        v-for="(row, index) in rows"
        :key="row.category"
        :category="row.category"
        :items="row.items"
        :reverse="index % 2 === 1"
      />
    </div>
  </section>
</template>
