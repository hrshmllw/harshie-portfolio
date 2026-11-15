<script setup lang="ts">
/** Expertise · C — Ticker rows: one slow, draggable ticker per category; icons take their brand colour on hover. */
const { site } = useAppConfig();

// Brand colours, adjusted where the official one disappears on the dark background.
const BRAND: Record<string, string> = {
  "simple-icons:html5": "#E34F26",
  "simple-icons:css": "#8E5CD9",
  "simple-icons:javascript": "#F7DF1E",
  "simple-icons:typescript": "#3178C6",
  "simple-icons:sass": "#CC6699",
  "simple-icons:tailwindcss": "#06B6D4",
  "simple-icons:react": "#61DAFB",
  "simple-icons:nextdotjs": "#F4F1EC",
  "simple-icons:vuedotjs": "#4FC08D",
  "simple-icons:nuxt": "#00DC82",
  "simple-icons:wordpress": "#3E8EC6",
  "simple-icons:php": "#777BB4",
  "simple-icons:woocommerce": "#A46497",
  "simple-icons:shopify": "#7AB55C",
  "simple-icons:greensock": "#88CE02",
  "simple-icons:jquery": "#2A8FD6",
  "simple-icons:axios": "#7B4DF0",
  "simple-icons:webpack": "#8DD6F9",
  "simple-icons:npm": "#CB3837",
  "simple-icons:git": "#F05032",
  "simple-icons:figma": "#F24E1E",
  "simple-icons:eslint": "#7C6BE0",
  "simple-icons:prettier": "#F7B93E",
  "simple-icons:jest": "#C21325",
  "simple-icons:mocha": "#A47B5C",
};

const rows = computed(() =>
  site.technologies.map((group) => ({
    category: group.category,
    items: group.items.map((item) => ({
      ...item,
      brand: BRAND[item.icon] ?? "#C4454A",
    })),
  })),
);
</script>

<template>
  <section class="border-t border-border" aria-labelledby="expertise-c-title">
    <div class="container-x section-pad pb-0 md:pb-0">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl">
          <p class="eyebrow eyebrow-marker">Expertise</p>
          <h2 id="expertise-c-title" class="section-title mt-4">
            Technologies &amp;&nbsp;Tools
          </h2>
        </div>
        <p class="hidden font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted md:block">
          Drag to scroll
        </p>
      </div>
    </div>

    <div class="mt-14 border-t border-border pb-20 md:pb-28">
      <LabTickerRow
        v-for="(row, index) in rows"
        :key="row.category"
        :category="row.category"
        :items="row.items"
        :reverse="index % 2 === 1"
      />
    </div>
  </section>
</template>
