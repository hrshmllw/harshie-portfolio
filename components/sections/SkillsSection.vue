<script setup lang="ts">
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();
</script>

<template>
  <section id="skills" class="section-container border-t border-border">
    <div
      v-motion
      :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
      :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
      :transition="{ duration: 500 }"
    >
      <p class="section-eyebrow">Skills</p>
      <h2 class="section-title">Tools I reach for most often.</h2>
      <p class="mt-4 max-w-2xl text-muted">
        A focused set of frameworks, styling tools, and platforms I use to ship
        polished frontends.
      </p>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="(group, index) in site.skills"
        :key="group.category"
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 450, delay: index * 75 }"
        class="rounded-xl border border-border bg-surface p-6"
      >
        <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {{ group.category }}
        </h3>
        <ul class="mt-4 flex flex-wrap gap-2">
          <li
            v-for="item in group.items"
            :key="item"
            class="rounded-full border border-border px-3 py-1 text-sm"
          >
            {{ item }}
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
