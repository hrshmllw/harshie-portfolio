<script setup lang="ts">
/** Scrollytelling: a sticky panel swaps the big period + role as each entry scrolls past. */
const { site } = useAppConfig();

const period = (start: string, end: string | null) => {
  const from = start.slice(0, 4);
  const to = end ? end.slice(0, 4) : "Now";
  return from === to ? from : `${from}–${to}`;
};

const active = ref(0);
const entries = ref<HTMLElement[]>([]);

onMounted(() => {
  const observer = new IntersectionObserver(
    (records) => {
      records.forEach((record) => {
        if (record.isIntersecting) {
          active.value = Number((record.target as HTMLElement).dataset.index);
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );
  entries.value.forEach((el) => observer.observe(el));
  onBeforeUnmount(() => observer.disconnect());
});

const current = computed(() => site.experience[active.value]);
</script>

<template>
  <section id="experience" class="rule-top" aria-labelledby="experience-title">
    <div class="container-x section-pad">
      <p data-reveal-item class="eyebrow eyebrow-marker">Experience</p>
      <h2 id="experience-title" data-reveal-heading class="section-title mt-4">Professional Experience</h2>

      <div class="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <!-- Sticky readout on the right (desktop only; mobile reads the list).
             Right, so it doesn't echo About's sticky matrix on the left. -->
        <div class="hidden lg:order-2 lg:block">
          <div data-reveal-item class="sticky top-28 border border-border p-10">
            <div aria-hidden="true" class="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              <span>{{ String(active + 1).padStart(2, "0") }} / {{ String(site.experience.length).padStart(2, "0") }}</span>
              <span class="flex gap-1.5">
                <span
                  v-for="(_, i) in site.experience"
                  :key="i"
                  class="h-1.5 w-6 transition-colors duration-300"
                  :class="i === active ? 'bg-accent-bright' : 'bg-border'"
                />
              </span>
            </div>

            <Transition name="swap" mode="out-in">
              <div :key="active" class="mt-16">
                <p aria-hidden="true" class="font-display text-[clamp(4rem,8vw,8rem)] font-bold leading-[0.85] tracking-[-0.04em] tabular-nums">
                  {{ period(current.start, current.end) }}<span v-if="current.end === null" class="hero-cursor" />
                </p>
                <p aria-hidden="true" class="mt-8 font-display text-3xl font-semibold tracking-tight">{{ current.role }}</p>
                <a
                  :href="current.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="company-link group mt-3 inline-flex items-center gap-2 text-lg text-muted transition-colors hover:text-fg focus-visible:text-fg"
                >
                  <span class="company-name">{{ current.company }}</span>
                  <Icon
                    name="lucide:arrow-up-right"
                    class="h-5 w-5 text-accent-bright transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                  <span class="sr-only">(opens in a new tab)</span>
                </a>
                <p aria-hidden="true" class="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted/70">
                  {{ current.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") }}
                </p>
              </div>
            </Transition>
          </div>
        </div>

        <ol>
          <li
            v-for="(entry, index) in site.experience"
            :key="`${entry.company}-${entry.start}`"
            ref="entries"
            :data-index="index"
            class="rule-top py-10 transition-opacity duration-500 lg:flex lg:min-h-[60vh] lg:flex-col lg:justify-center lg:py-0"
            :class="index === active ? 'lg:opacity-100' : 'lg:opacity-30'"
          >
            <p data-reveal-item class="font-mono text-[0.7rem] uppercase tracking-[0.18em]" :class="entry.end === null ? 'text-accent-bright' : 'text-muted'">
              <time :datetime="entry.start">{{ entry.dateLabel }}</time>
            </p>
            <h3 data-reveal-item class="mt-4 font-display text-2xl font-semibold tracking-tight md:text-3xl">{{ entry.role }}</h3>
            <!-- Desktop shows the company link on the sticky card; mobile has no card. -->
            <p data-reveal-item class="mt-1">
              <span class="hidden text-muted lg:inline">{{ entry.company }}</span>
              <a
                :href="entry.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg focus-visible:text-fg lg:hidden"
              >
                {{ entry.company }}
                <Icon
                  name="lucide:arrow-up-right"
                  class="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
                <span class="sr-only">(opens in a new tab)</span>
              </a>
            </p>
            <p data-reveal-text class="mt-6 max-w-lg leading-relaxed text-fg/85">{{ entry.summary }}</p>
            <ul data-reveal-item class="mt-5 max-w-lg space-y-2.5 text-sm leading-relaxed text-muted">
              <li v-for="item in entry.highlights" :key="item" class="flex gap-3">
                <span class="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-accent-bright" aria-hidden="true" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.company-name {
  background: linear-gradient(currentColor, currentColor) left bottom / 0 1px no-repeat;
  transition: background-size 400ms cubic-bezier(0.22, 1, 0.36, 1);
}

.company-link:hover .company-name,
.company-link:focus-visible .company-name {
  background-size: 100% 1px;
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 300ms ease,
    transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

.swap-leave-to {
  opacity: 0;
  transform: translateY(-24px);
}
</style>
