<script setup lang="ts">
/** About · C — Dot-matrix portrait: the large-cut "ej" assembles from scattered pixels; principles as an accordion. */
const { site } = useAppConfig();

const { data: about } = await useAsyncData("about", () =>
  queryCollection("about").first(),
);

</script>

<template>
  <section class="border-t border-border" aria-labelledby="about-c-title">
    <div class="container-x section-pad">
      <div class="grid items-start gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <LabEjMatrix class="relative mx-auto w-full max-w-[26rem] lg:mx-0" />

        <div>
          <p class="eyebrow eyebrow-marker">About</p>
          <h2 id="about-c-title" class="display mt-6">
            Purpose &amp;&nbsp;Performance
          </h2>
          <div v-if="about" class="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-muted">
            <ContentRenderer :value="about" />
          </div>

          <div class="mt-12 border-t border-border">
            <details
              v-for="(principle, index) in site.principles"
              :key="principle.title"
              name="principles"
              class="group border-b border-border"
              :open="index === 0"
            >
              <summary
                class="flex cursor-pointer list-none items-center gap-6 py-5 [&::-webkit-details-marker]:hidden"
              >
                <span class="font-mono text-xs text-accent-bright">0{{ index + 1 }}</span>
                <span class="flex-1 font-display text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
                  {{ principle.title }}
                </span>
                <span class="relative h-3 w-3" aria-hidden="true">
                  <span class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-fg" />
                  <span class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-fg transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p class="max-w-md pb-6 pl-10 text-muted">
                {{ principle.description }}
              </p>
            </details>
          </div>

          <a :href="site.resumePath" download class="btn-ghost mt-10">Download resume</a>
        </div>
      </div>
    </div>
  </section>
</template>

