<script setup lang="ts">
/** About · D — Portrait spec: the dot-matrix "ej" as the visual, the spec sheet beside it. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

const { data: about } = await useAsyncData("about", () =>
  queryCollection("about").first(),
);

const years = new Date().getFullYear() - site.experienceStartYear;

const rows = [
  { label: "Role", value: site.role },
  { label: "Based in", value: site.location },
  { label: "Experience", value: `${years}+ years`, note: `since ${site.experienceStartYear}` },
  { label: "Focus", value: site.expertiseTags.join(" / ") },
  { label: "Principles", value: site.principles.map((principle) => principle.title).join(", ") },
  { label: "Daily stack", value: "Vue, Nuxt, React, WordPress, Tailwind" },
];
</script>

<template>
  <section class="border-t border-border" aria-labelledby="about-d-title">
    <div class="container-x section-pad">
      <div class="grid items-start gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div class="mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:sticky lg:top-28 lg:mx-0 lg:max-w-none">
          <LabEjMatrix />
        </div>

        <div>
          <p class="eyebrow eyebrow-marker">About</p>
          <h2 id="about-d-title" class="display mt-6">
            Purpose &amp;&nbsp;Performance
          </h2>
          <div v-if="about" class="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-muted">
            <ContentRenderer :value="about" />
          </div>

          <div
            v-motion
            :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
            :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
            :transition="{ duration: 500 }"
            class="mt-12 border border-border"
          >
            <div
              class="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted"
            >
              <span>Spec sheet</span>
              <span>EJ/01 &middot; Rev {{ new Date().getFullYear() }}</span>
            </div>

            <dl>
              <div
                v-for="row in rows"
                :key="row.label"
                class="spec-row grid gap-y-1 border-b border-border px-5 py-5 sm:grid-cols-[9rem_1fr]"
              >
                <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent-bright sm:pt-1.5">
                  {{ row.label }}
                </dt>
                <dd class="font-display text-lg font-medium text-fg md:text-xl">
                  {{ row.value }}
                  <span v-if="row.note" class="ml-2 font-mono text-xs text-muted">{{ row.note }}</span>
                </dd>
              </div>

              <div class="spec-row grid gap-y-1 border-b border-border px-5 py-5 sm:grid-cols-[9rem_1fr]">
                <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent-bright sm:pt-1.5">
                  Status
                </dt>
                <dd class="flex items-center gap-3 font-display text-lg font-medium md:text-xl">
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
