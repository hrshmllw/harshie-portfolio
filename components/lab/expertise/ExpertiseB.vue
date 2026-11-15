<script setup lang="ts">
/** Expertise · B — Pixel bento: a hairline tile grid; tiles flood maroon on hover and drop the red j-dot. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

const code = (category: string) =>
  category
    .split(/[\s&]+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
</script>

<template>
  <section class="border-t border-border" aria-labelledby="expertise-b-title">
    <div class="container-x section-pad">
      <div class="max-w-2xl">
        <p class="eyebrow eyebrow-marker">Expertise</p>
        <h2 id="expertise-b-title" class="section-title mt-4">
          Technologies &amp;&nbsp;Tools
        </h2>
        <p class="mt-4 text-muted">
          A structured set of languages, frameworks, and tooling I use to ship
          polished frontends.
        </p>
      </div>

      <div class="mt-14 space-y-10">
        <div
          v-for="(group, g) in site.technologies"
          :key="group.category"
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 450, delay: g * 60 }"
        >
          <h3 class="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            <span>{{ group.category }}</span>
            <span>{{ String(group.items.length).padStart(2, "0") }}</span>
          </h3>

          <ul class="mt-3 grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <li
              v-for="(item, i) in group.items"
              :key="item.name"
              class="tile group relative flex aspect-[4/3] flex-col justify-between border-b border-r border-border p-4 md:p-5"
            >
              <div class="flex items-start justify-between">
                <Icon
                  :name="item.icon"
                  class="h-7 w-7 text-muted transition-colors duration-200 group-hover:text-fg"
                  aria-hidden="true"
                />
                <span class="font-mono text-[0.6rem] text-border transition-colors group-hover:text-fg/60">
                  {{ code(group.category) }}/{{ String(i + 1).padStart(2, "0") }}
                </span>
              </div>
              <span class="text-sm font-medium text-fg md:text-base">{{ item.name }}</span>
              <span class="tile-dot absolute right-0 top-0 h-2 w-2 bg-accent-bright" aria-hidden="true" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tile {
  background-color: transparent;
  transition: background-color 220ms ease;
}

.tile:hover {
  background-color: #3c0007;
}

.tile-dot {
  transform: scale(0);
  transform-origin: top right;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.tile:hover .tile-dot {
  transform: scale(1);
}
</style>
