<script setup lang="ts">
/** Experience · A — Ledger: big period numerals per row; hover/focus floods the row and opens the summary. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

const period = (start: string, end: string | null) => {
  const from = start.slice(0, 4);
  const to = end ? end.slice(0, 4) : "Now";
  return from === to ? from : `${from}–${to}`;
};
</script>

<template>
  <section class="border-t border-border" aria-labelledby="experience-a-title">
    <div class="container-x section-pad">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="eyebrow eyebrow-marker">Experience</p>
          <h2 id="experience-a-title" class="section-title mt-4">
            Professional Experience
          </h2>
        </div>
        <p class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
          {{ site.experience.length }} roles &middot; since {{ site.experienceStartYear }}
        </p>
      </div>

      <ol class="mt-14 border-t border-border">
        <li
          v-for="(entry, index) in site.experience"
          :key="`${entry.company}-${entry.start}`"
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 450, delay: index * 80 }"
          class="ledger-row group relative border-b border-border"
          tabindex="0"
        >
          <span class="ledger-fill absolute inset-0 bg-accent" aria-hidden="true" />

          <div class="relative grid gap-4 py-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)_auto] md:items-center md:gap-10 md:py-10">
            <p
              class="font-display text-5xl font-bold tabular-nums leading-none tracking-[-0.03em] md:text-7xl"
              :class="entry.end === null ? 'text-fg' : 'text-muted/70 group-hover:text-fg group-focus-visible:text-fg'"
            >
              <time :datetime="entry.start">{{ period(entry.start, entry.end) }}</time><span
                v-if="entry.end === null"
                class="hero-cursor"
                aria-hidden="true"
              />
            </p>

            <div>
              <h3 class="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {{ entry.role }}
              </h3>
              <p class="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-muted group-hover:text-fg/75">
                {{ entry.company }} &middot; {{ entry.dateLabel }}
              </p>

              <div class="ledger-detail grid">
                <p class="min-h-0 overflow-hidden">
                  <span class="block max-w-xl pt-4 text-sm leading-relaxed text-fg/80 md:text-base">
                    {{ entry.summary }}
                  </span>
                </p>
              </div>
            </div>

            <Icon
              name="lucide:arrow-up-right"
              class="hidden h-8 w-8 text-accent-bright transition-transform duration-300 group-hover:rotate-45 group-hover:text-fg md:block"
              aria-hidden="true"
            />
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.ledger-row:focus-visible {
  outline-offset: -2px;
}

.ledger-fill {
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
}

.ledger-row:hover .ledger-fill,
.ledger-row:focus-visible .ledger-fill {
  transform: scaleY(1);
}

/* Always open on touch / small screens; collapse to hover/focus on desktop. */
.ledger-detail {
  grid-template-rows: 1fr;
}

@media (min-width: 768px) and (hover: hover) {
  .ledger-detail {
    grid-template-rows: 0fr;
    transition: grid-template-rows 450ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .ledger-row:hover .ledger-detail,
  .ledger-row:focus-visible .ledger-detail,
  .ledger-row:focus-within .ledger-detail {
    grid-template-rows: 1fr;
  }
}
</style>
