<script setup lang="ts">
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

const { data: about } = await useAsyncData("about", () =>
  queryCollection("about").first(),
);
</script>

<template>
  <section id="about" class="border-t border-border">
    <div class="container-x section-pad">
      <div
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500 }"
        class="max-w-3xl"
      >
        <p class="eyebrow">About</p>
        <h2 class="section-title mt-4">
          Frontend Development: Purpose &amp; Performance
        </h2>

        <div
          v-if="about"
          class="mt-6 space-y-4 text-base leading-relaxed text-muted md:text-lg"
        >
          <ContentRenderer :value="about" />
        </div>

        <a :href="site.resumePath" download class="btn-ghost mt-8">
          Download resume
        </a>
      </div>

      <div class="mt-16 grid gap-0 border-t border-border md:grid-cols-3">
        <article
          v-for="(principle, index) in site.principles"
          :key="principle.title"
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 450, delay: index * 80 }"
          class="border-border py-8 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
        >
          <p class="eyebrow">0{{ index + 1 }}</p>
          <h3 class="mt-3 font-display text-xl font-semibold tracking-tight">
            {{ principle.title }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-muted">
            {{ principle.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
