<script setup lang="ts">
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();
</script>

<template>
  <section
    id="introduction"
    class="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
  >
    <CanvasHeroGrid class="absolute inset-0" />
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/20 to-bg/90"
      aria-hidden="true"
    />

    <div class="container-x relative z-10 pt-24 pb-16">
      <div>
        <p
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 12 } : false"
          :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 500 }"
          class="eyebrow eyebrow-marker"
        >
          {{ site.role }}
        </p>

        <h1
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 24 } : false"
          :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 600, delay: 80 }"
          class="hero-display mt-6"
        >
          <span class="block">Bringing</span>
          <span class="block">Your designs</span>
          <span class="block"
            >to life<span class="hero-cursor" aria-hidden="true"
          /></span>
        </h1>

        <ul
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 500, delay: 160 }"
          class="hero-tags mt-8"
          aria-label="Expertise areas"
        >
          <li
            v-for="(tag, index) in site.expertiseTags"
            :key="tag"
            class="flex items-center gap-3"
          >
            <span
              v-if="index > 0"
              class="select-none text-accent-soft"
              aria-hidden="true"
            >
              |
            </span>
            <span>{{ tag }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
