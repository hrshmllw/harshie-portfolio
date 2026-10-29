<script setup lang="ts">
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();
</script>

<template>
  <section id="experience" class="border-t border-border">
    <div class="container-x section-pad">
      <div
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500 }"
        class="max-w-2xl"
      >
        <p class="eyebrow eyebrow-marker">Experience</p>
        <h2 class="section-title mt-4">Professional Experience</h2>
        <p class="mt-4 text-muted">
          Roles focused on frontend implementation, delivery, and quality across
          client and product work.
        </p>
      </div>

      <ol class="relative mt-14 space-y-0 border-l border-border pl-8 md:pl-10">
        <li
          v-for="(entry, index) in site.experience"
          :key="`${entry.company}-${entry.start}`"
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 450, delay: index * 80 }"
          class="relative pb-12 last:pb-0"
        >
          <span
            class="absolute -left-[2.55rem] top-1.5 flex h-3 w-3 items-center justify-center md:-left-[2.95rem]"
            aria-hidden="true"
          >
            <span
              class="block h-3 w-3 rounded-full border border-accent-soft"
              :class="entry.end === null ? 'bg-accent-bright' : 'bg-bg'"
            />
          </span>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <div>
              <h3 class="font-display text-xl font-semibold tracking-tight">
                {{ entry.role }}
              </h3>
              <p class="mt-1 text-sm text-muted">{{ entry.company }}</p>
            </div>
            <time
              class="shrink-0 text-xs uppercase tracking-[0.18em]"
              :class="entry.end === null ? 'text-accent-bright' : 'text-muted'"
              :datetime="entry.start"
            >
              {{ entry.dateLabel }}
            </time>
          </div>

          <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            {{ entry.summary }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>
