<script setup lang="ts">
/** About · B — Spec sheet: sticky statement left, a product-style data sheet right. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

const { data: about } = await useAsyncData("about", () =>
  queryCollection("about").first(),
);

const years = new Date().getFullYear() - site.experienceStartYear;

const rows = computed(() => [
  { label: "Role", value: site.role },
  { label: "Based in", value: site.location },
  {
    label: "Experience",
    value: `${years}+ years`,
    note: `since ${site.experienceStartYear}`,
  },
  { label: "Focus", value: site.expertiseTags.join(" / ") },
  {
    label: "Principles",
    value: site.principles.map((principle) => principle.title).join(", "),
  },
  {
    label: "Daily stack",
    value: "Vue, Nuxt, React, WordPress, Tailwind",
  },
]);
</script>

<template>
  <section class="border-t border-border" aria-labelledby="about-b-title">
    <div class="container-x section-pad">
      <div class="grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div class="lg:sticky lg:top-28 lg:self-start">
          <p class="eyebrow eyebrow-marker">About</p>
          <h2 id="about-b-title" class="display mt-6">
            Purpose &amp; Performance
          </h2>
          <div
            v-if="about"
            class="mt-6 max-w-md space-y-4 leading-relaxed text-muted"
          >
            <ContentRenderer :value="about" />
          </div>
        </div>

        <div
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 500 }"
          class="border border-border"
        >
          <div
            class="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted"
          >
            <span>Spec sheet</span>
            <span>EJ/01 &middot; Rev {{ new Date().getFullYear() }}</span>
          </div>

          <dl>
            <div
              v-for="(row, index) in rows"
              :key="row.label"
              class="spec-row grid grid-cols-[2.5rem_1fr] gap-y-1 border-b border-border px-5 py-5 sm:grid-cols-[2.5rem_9rem_1fr]"
            >
              <span class="font-mono text-[0.7rem] text-border" aria-hidden="true">
                {{ String(index + 1).padStart(2, "0") }}
              </span>
              <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted sm:pt-1.5">
                {{ row.label }}
              </dt>
              <dd class="col-start-2 font-display text-lg font-medium text-fg sm:col-start-3 md:text-xl">
                {{ row.value }}
                <span v-if="row.note" class="ml-2 font-mono text-xs text-muted">{{ row.note }}</span>
              </dd>
            </div>

            <div class="spec-row grid grid-cols-[2.5rem_1fr] gap-y-1 border-b border-border px-5 py-5 sm:grid-cols-[2.5rem_9rem_1fr]">
              <span class="font-mono text-[0.7rem] text-border" aria-hidden="true">07</span>
              <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted sm:pt-1.5">
                Status
              </dt>
              <dd class="col-start-2 flex items-center gap-3 font-display text-lg font-medium sm:col-start-3 md:text-xl">
                <span class="status-pixel h-2 w-2 bg-accent-bright" aria-hidden="true" />
                Open to conversations
              </dd>
            </div>
          </dl>

          <a
            :href="site.resumePath"
            download
            class="group flex items-center justify-between px-5 py-5 font-mono text-xs uppercase tracking-[0.2em] text-fg transition-colors hover:bg-accent"
          >
            <span>Download full resume (PDF)</span>
            <Icon
              name="lucide:download"
              class="h-4 w-4 text-accent-bright transition-transform group-hover:translate-y-0.5 group-hover:text-fg"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.spec-row {
  transition: background-color 200ms ease;
}

.spec-row:hover {
  background-color: #32363a;
}

@media (prefers-reduced-motion: no-preference) {
  .status-pixel {
    animation: status-pulse 1.6s ease-in-out infinite;
  }
}

@keyframes status-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(196, 69, 74, 0.6);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(196, 69, 74, 0);
  }
}
</style>
