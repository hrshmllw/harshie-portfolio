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
  <section id="experience" class="border-t border-border" aria-labelledby="experience-title">
    <div class="container-x section-pad">
      <p class="eyebrow eyebrow-marker">Experience</p>
      <h2 id="experience-title" class="section-title mt-4">Professional Experience</h2>

      <div class="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <!-- Sticky readout on the right (desktop only; mobile reads the list).
             Right, so it doesn't echo About's sticky matrix on the left. -->
        <div class="hidden lg:order-2 lg:block">
          <div class="sticky top-28 border border-border p-10" aria-hidden="true">
            <div class="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
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
                <p class="font-display text-[clamp(4rem,8vw,8rem)] font-bold leading-[0.85] tracking-[-0.04em] tabular-nums">
                  {{ period(current.start, current.end) }}<span v-if="current.end === null" class="hero-cursor" />
                </p>
                <p class="mt-8 font-display text-3xl font-semibold tracking-tight">{{ current.role }}</p>
                <p class="mt-2 text-muted">{{ current.company }}</p>
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
            class="border-t border-border py-10 transition-opacity duration-500 lg:flex lg:min-h-[60vh] lg:flex-col lg:justify-center lg:py-0"
            :class="index === active ? 'lg:opacity-100' : 'lg:opacity-30'"
          >
            <p class="font-mono text-[0.7rem] uppercase tracking-[0.18em]" :class="entry.end === null ? 'text-accent-bright' : 'text-muted'">
              <time :datetime="entry.start">{{ entry.dateLabel }}</time>
            </p>
            <h3 class="mt-4 font-display text-2xl font-semibold tracking-tight md:text-3xl">{{ entry.role }}</h3>
            <p class="mt-1 text-muted">{{ entry.company }}</p>
            <p class="mt-6 max-w-md leading-relaxed text-muted">{{ entry.summary }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
