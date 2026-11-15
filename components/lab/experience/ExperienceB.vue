<script setup lang="ts">
/** Experience · B — Gantt ruler: a month ruler from the first role to today, one bar per role. */
const { site } = useAppConfig();

const monthIndex = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + (month - 1);
};

const now = new Date();
const nowIndex = now.getFullYear() * 12 + now.getMonth() + 1;

const startIndex = Math.min(
  ...site.experience.map((entry) => monthIndex(entry.start)),
);
const span = nowIndex - startIndex;

const pct = (index: number) => ((index - startIndex) / span) * 100;

const bars = computed(() =>
  [...site.experience]
    .sort((a, b) => monthIndex(a.start) - monthIndex(b.start))
    .map((entry) => {
      const from = monthIndex(entry.start);
      const to = entry.end ? monthIndex(entry.end) : nowIndex;
      const months = Math.max(to - from, 1);
      return {
        ...entry,
        left: pct(from),
        width: Math.max(pct(to) - pct(from), 1.2),
        months,
        current: entry.end === null,
      };
    }),
);

const years = computed(() => {
  const out: { year: number; left: number }[] = [];
  const first = Math.floor(startIndex / 12) + 1;
  for (let y = first; y * 12 < nowIndex; y++) {
    out.push({ year: y, left: pct(y * 12) });
  }
  return out;
});

const ticks = computed(() =>
  Array.from({ length: span + 1 }, (_, i) => ({
    left: (i / span) * 100,
    major: (startIndex + i) % 12 === 0,
  })),
);

const duration = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr`, m && `${m} mo`].filter(Boolean).join(" ") || "1 mo";
};

const hovered = ref<number | null>(null);

const chart = ref<HTMLElement | null>(null);
const isIn = useRevealOnce(chart, 0.3);
</script>

<template>
  <section class="border-t border-border" aria-labelledby="experience-b-title">
    <div class="container-x section-pad">
      <div class="max-w-2xl">
        <p class="eyebrow eyebrow-marker">Experience</p>
        <h2 id="experience-b-title" class="section-title mt-4">
          Professional Experience
        </h2>
      </div>

      <div ref="chart" class="gantt mt-16" :class="{ 'is-in': isIn }" aria-hidden="true">
        <!-- Ruler -->
        <div class="relative h-10 border-b border-border">
          <span
            v-for="(tick, i) in ticks"
            :key="i"
            class="absolute bottom-0 w-px"
            :class="tick.major ? 'h-4 bg-muted' : 'h-1.5 bg-border'"
            :style="{ left: `${tick.left}%` }"
          />
          <span
            v-for="year in years"
            :key="year.year"
            class="absolute top-0 -translate-x-1/2 font-mono text-[0.65rem] text-muted"
            :style="{ left: `${year.left}%` }"
          >{{ year.year }}</span>
          <span class="absolute right-0 top-0 font-mono text-[0.65rem] text-accent-bright">Now</span>
        </div>

        <!-- Bars -->
        <div class="relative space-y-6 py-8">
          <div
            v-for="year in years"
            :key="`grid-${year.year}`"
            class="pointer-events-none absolute inset-y-0 w-px bg-border/50"
            :style="{ left: `${year.left}%` }"
          />
          <div
            v-for="(bar, i) in bars"
            :key="bar.start"
            class="relative h-3"
            @mouseenter="hovered = i"
            @mouseleave="hovered = null"
          >
            <span
              class="gantt-bar absolute inset-y-0 origin-left"
              :class="[
                bar.current ? 'bg-accent-bright' : 'bg-accent-soft',
                hovered === i ? 'brightness-125' : '',
              ]"
              :style="{ left: `${bar.left}%`, width: `${bar.width}%`, transitionDelay: `${i * 140}ms` }"
            />
          </div>
        </div>
      </div>

      <ol class="grid border-t border-border md:grid-cols-3">
        <li
          v-for="(bar, i) in bars"
          :key="bar.start"
          class="border-b border-border py-8 transition-colors md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
          :class="hovered === i ? 'bg-surface' : ''"
          @mouseenter="hovered = i"
          @mouseleave="hovered = null"
        >
          <p class="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em]" :class="bar.current ? 'text-accent-bright' : 'text-muted'">
            <span class="h-1.5 w-1.5" :class="bar.current ? 'bg-accent-bright' : 'bg-accent-soft'" aria-hidden="true" />
            <time :datetime="bar.start">{{ bar.dateLabel }}</time>
            <span class="text-border">/</span>
            {{ duration(bar.months) }}
          </p>
          <h3 class="mt-4 font-display text-xl font-semibold tracking-tight md:text-2xl">
            {{ bar.role }}
          </h3>
          <p class="mt-1 text-sm text-muted">{{ bar.company }}</p>
          <p class="mt-4 text-sm leading-relaxed text-muted">{{ bar.summary }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.gantt-bar {
  transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1), filter 200ms ease;
}

@media (prefers-reduced-motion: no-preference) {
  :root.js .gantt:not(.is-in) .gantt-bar {
    transform: scaleX(0);
  }
}
</style>
