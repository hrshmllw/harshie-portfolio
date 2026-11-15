<script setup lang="ts">
/** Experience · C — Stacking cards: each role pins and stacks over the last as you scroll. */
const { site } = useAppConfig();
</script>

<template>
  <section class="border-t border-border" aria-labelledby="experience-c-title">
    <div class="container-x section-pad">
      <div class="max-w-2xl">
        <p class="eyebrow eyebrow-marker">Experience</p>
        <h2 id="experience-c-title" class="section-title mt-4">
          Professional Experience
        </h2>
        <p class="mt-4 text-muted">
          Roles focused on frontend implementation, delivery, and quality
          across client and product work.
        </p>
      </div>

      <ol class="mt-14">
        <li
          v-for="(entry, index) in site.experience"
          :key="`${entry.company}-${entry.start}`"
          class="stack-card sticky mb-6 border border-border last:mb-0"
          :class="index % 2 === 0 ? 'bg-surface' : 'bg-bg'"
          :style="{ top: `calc(6rem + ${index * 1.75}rem)` }"
        >
          <div class="flex items-center justify-between border-b border-border px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted md:px-10">
            <time :datetime="entry.start">{{ entry.dateLabel }}</time>
            <span v-if="entry.end === null" class="flex items-center gap-2 text-accent-bright">
              <span class="h-1.5 w-1.5 bg-accent-bright" aria-hidden="true" />
              Current
            </span>
            <span v-else>{{ String(index + 1).padStart(2, "0") }} / {{ String(site.experience.length).padStart(2, "0") }}</span>
          </div>

          <div class="grid gap-8 px-6 py-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14 md:px-10 md:py-14">
            <p
              class="outline-num font-display text-[clamp(5rem,13vw,11rem)] font-bold leading-[0.8] tracking-[-0.04em]"
              aria-hidden="true"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </p>
            <div class="self-end">
              <h3 class="font-display text-3xl font-semibold tracking-tight md:text-5xl">
                {{ entry.role }}
              </h3>
              <p class="mt-2 text-muted md:text-lg">{{ entry.company }}</p>
              <p class="mt-6 max-w-xl leading-relaxed text-muted">{{ entry.summary }}</p>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.outline-num {
  color: transparent;
  -webkit-text-stroke: 1px #6a6e71;
}

.stack-card:first-child .outline-num {
  -webkit-text-stroke-color: #c4454a;
}

.stack-card {
  box-shadow: 0 -24px 48px -24px rgba(0, 0, 0, 0.45);
}
</style>
