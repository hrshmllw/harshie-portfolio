<script setup lang="ts">
/** Expertise · A — Glossary: every tool set inline in display type; category tabs dim the rest. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

const active = ref<string | null>(null);

const items = computed(() =>
  site.technologies.flatMap((group) =>
    group.items.map((item) => ({ ...item, category: group.category })),
  ),
);

const tabs = computed(() => [
  { label: "All", value: null, count: items.value.length },
  ...site.technologies.map((group) => ({
    label: group.category,
    value: group.category,
    count: group.items.length,
  })),
]);
</script>

<template>
  <section class="border-t border-border" aria-labelledby="expertise-a-title">
    <div class="container-x section-pad">
      <div class="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div class="max-w-xl">
          <p class="eyebrow eyebrow-marker">Expertise</p>
          <h2 id="expertise-a-title" class="section-title mt-4">
            Technologies &amp;&nbsp;Tools
          </h2>
        </div>

        <div class="flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label="Filter by category">
          <button
            v-for="tab in tabs"
            :key="tab.label"
            type="button"
            class="nav-link"
            :class="{ 'is-active': active === tab.value }"
            :aria-pressed="active === tab.value"
            @click="active = tab.value"
          >
            <span class="nav-link-inner">
              {{ tab.label }}
              <sup class="font-mono text-[0.6rem] text-accent-bright">{{ tab.count }}</sup>
            </span>
          </button>
        </div>
      </div>

      <ul
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500 }"
        class="mt-14 border-t border-border pt-10 font-display text-[clamp(1.75rem,4.4vw,4rem)] font-semibold leading-[1.12] tracking-[-0.02em]"
        aria-label="Technologies"
      >
        <li
          v-for="(item, index) in items"
          :key="item.name"
          class="inline"
        >
          <span
            class="glossary-term group relative cursor-default transition-colors duration-300"
            :class="active === null || active === item.category ? 'text-fg' : 'text-border'"
          >
            {{ item.name }}
            <Icon
              :name="item.icon"
              class="absolute -top-1 left-full ml-1 h-[0.32em] w-[0.32em] text-accent-bright opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
            <span class="sr-only">({{ item.category }})</span>
          </span>
          <span
            v-if="index < items.length - 1"
            class="mx-[0.3em] font-normal text-accent-soft"
            aria-hidden="true"
          >/</span>
        </li>
      </ul>

      <p class="mt-10 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
        {{ items.length }} entries &middot; {{ site.technologies.length }} categories
      </p>
    </div>
  </section>
</template>

<style scoped>
.glossary-term:hover {
  color: #c4454a;
}
</style>
