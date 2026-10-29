<script setup lang="ts">
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();
const { scrollToSection } = useActiveSection();
</script>

<template>
  <section
    id="introduction"
    class="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
  >
    <CanvasHeroGrid class="absolute inset-0" />
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/25 to-bg/90"
      aria-hidden="true"
    />

    <div class="container-x relative z-10 pt-24 pb-16">
      <p
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 12 } : false"
        :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500 }"
        class="eyebrow"
      >
        {{ site.role }}
      </p>

      <h1
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 24 } : false"
        :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 600, delay: 80 }"
        class="display mt-5 max-w-4xl"
      >
        Bringing your designs to life.
      </h1>

      <ul
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
        :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500, delay: 160 }"
        class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted"
        aria-label="Expertise areas"
      >
        <li
          v-for="(tag, index) in site.expertiseTags"
          :key="tag"
          class="flex items-center gap-4"
        >
          <span
            v-if="index > 0"
            class="hidden h-3 w-px bg-border sm:block"
            aria-hidden="true"
          />
          <span>{{ tag }}</span>
        </li>
      </ul>

      <p
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
        :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500, delay: 220 }"
        class="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
      >
        {{ site.tagline }}
      </p>

      <div
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
        :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500, delay: 300 }"
        class="mt-10 flex flex-wrap items-center gap-3"
      >
        <button
          type="button"
          class="btn-primary"
          @click="scrollToSection('#work')"
        >
          Explore my work
        </button>
        <button
          type="button"
          class="btn-ghost"
          @click="scrollToSection('#contact')"
        >
          Get in touch
        </button>
      </div>
    </div>

    <button
      type="button"
      class="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-fg"
      aria-label="Scroll to about"
      @click="scrollToSection('#about')"
    >
      <span class="text-[10px] uppercase tracking-[0.22em]">Scroll</span>
      <span
        class="block h-8 w-px origin-top bg-border motion-safe:animate-pulse"
        aria-hidden="true"
      />
    </button>
  </section>
</template>
