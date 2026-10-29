<script setup lang="ts">
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();
const { scrollToSection } = useActiveSection();
</script>

<template>
  <section
    id="introduction"
    class="section-container flex min-h-screen flex-col justify-center pt-24"
  >
    <p class="section-eyebrow">Portfolio</p>
    <h1
      v-motion
      :initial="shouldAnimate ? { opacity: 0, y: 24 } : false"
      :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
      :transition="{ duration: 500 }"
      class="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl"
    >
      {{ site.fullName }}
    </h1>
    <p
      v-motion
      :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
      :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
      :transition="{ duration: 500, delay: 100 }"
      class="mt-4 text-lg text-muted md:text-xl"
    >
      {{ site.role }}
    </p>
    <p
      v-motion
      :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
      :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
      :transition="{ duration: 500, delay: 200 }"
      class="mt-6 max-w-2xl text-base leading-relaxed text-muted"
    >
      {{ site.tagline }}
    </p>

    <div
      v-motion
      :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
      :enter="shouldAnimate ? { opacity: 1, y: 0 } : false"
      :transition="{ duration: 500, delay: 300 }"
      class="mt-8 flex flex-wrap items-center gap-3"
    >
      <button type="button" class="btn-primary" @click="scrollToSection('#projects')">
        View work
      </button>
      <button type="button" class="btn-ghost" @click="scrollToSection('#contact')">
        Get in touch
      </button>
    </div>

    <div
      v-motion
      :initial="shouldAnimate ? { opacity: 0 } : false"
      :enter="shouldAnimate ? { opacity: 1 } : false"
      :transition="{ duration: 500, delay: 400 }"
      class="mt-10 flex items-center gap-4"
    >
      <a
        v-for="social in site.socials"
        :key="social.url"
        :href="social.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-fg hover:text-fg"
        :aria-label="social.label"
      >
        <Icon :name="social.icon" class="h-5 w-5" />
      </a>
    </div>
  </section>
</template>
