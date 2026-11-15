<script setup lang="ts">
/** Experience · E — Commit log: each role as a commit on a `git log --graph` rail. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

// Short, stable pseudo-hash from the company name, for flavour.
const hash = (value: string) => {
  let h = 5381;
  for (let i = 0; i < value.length; i++) h = (h * 33) ^ value.charCodeAt(i);
  return (h >>> 0).toString(16).padStart(7, "0").slice(0, 7);
};

const branch = (company: string) =>
  company
    .toLowerCase()
    .replace(/\b(inc|llc|ltd)\b\.?/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
</script>

<template>
  <section class="border-t border-border" aria-labelledby="experience-e-title">
    <div class="container-x section-pad">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="eyebrow eyebrow-marker">Experience</p>
          <h2 id="experience-e-title" class="section-title mt-4">Professional Experience</h2>
        </div>
        <p class="font-mono text-xs text-muted">
          $ git log --graph --career<span class="hero-cursor" aria-hidden="true" />
        </p>
      </div>

      <ol class="relative mt-14 font-mono">
        <span class="absolute bottom-3 left-[5px] top-3 w-px bg-border" aria-hidden="true" />

        <li
          v-for="(entry, index) in site.experience"
          :key="`${entry.company}-${entry.start}`"
          v-motion
          :initial="shouldAnimate ? { opacity: 0, x: -12 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, x: 0 } : false"
          :transition="{ duration: 450, delay: index * 100 }"
          class="commit group relative pb-14 pl-10 last:pb-0 md:pl-14"
        >
          <span
            class="absolute left-0 top-1.5 h-[11px] w-[11px] border"
            :class="entry.end === null ? 'commit-head border-accent-bright bg-accent-bright' : 'border-muted bg-bg group-hover:bg-muted'"
            aria-hidden="true"
          />

          <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span class="text-accent-bright">{{ hash(entry.company) }}</span>
            <span v-if="entry.end === null" class="text-fg">
              (<span class="text-accent-bright">HEAD</span> → <span class="text-[#7fb88a]">current</span>)
            </span>
            <span v-else class="text-muted">({{ branch(entry.company) }})</span>
          </p>

          <h3 class="mt-3 font-display text-2xl font-semibold tracking-tight md:text-4xl">
            {{ entry.role }}
          </h3>

          <dl class="mt-3 grid grid-cols-[5.5rem_1fr] gap-y-1 text-xs text-muted">
            <dt>Author:</dt>
            <dd class="text-fg/80">{{ site.shortName }} @ {{ entry.company }}</dd>
            <dt>Date:</dt>
            <dd class="text-fg/80"><time :datetime="entry.start">{{ entry.dateLabel }}</time></dd>
          </dl>

          <p class="mt-4 max-w-2xl border-l border-border pl-4 font-sans leading-relaxed text-muted">
            {{ entry.summary }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .commit-head {
    animation: head-pulse 1.6s ease-in-out infinite;
  }
}

@keyframes head-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(196, 69, 74, 0.6);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(196, 69, 74, 0);
  }
}
</style>
