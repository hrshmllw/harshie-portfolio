<script setup lang="ts">
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();
</script>

<template>
  <section id="expertise" class="border-t border-border">
    <div class="container-x section-pad">
      <div
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500 }"
        class="max-w-2xl"
      >
        <p class="eyebrow">Expertise</p>
        <h2 class="section-title mt-4">Technologies &amp; Tools</h2>
        <p class="mt-4 text-muted">
          A structured set of languages, frameworks, and tooling I use to ship
          polished frontends.
        </p>
      </div>

      <div class="mt-14 grid gap-12 lg:grid-cols-2">
        <div
          v-for="(group, groupIndex) in site.technologies"
          :key="group.category"
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 450, delay: groupIndex * 70 }"
        >
          <div class="flex items-center gap-4">
            <h3 class="eyebrow shrink-0">{{ group.category }}</h3>
            <span class="rule" aria-hidden="true" />
          </div>

          <ul class="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
            <li
              v-for="item in group.items"
              :key="item.name"
              class="group flex items-center gap-3 text-sm text-fg transition-colors"
            >
              <Icon
                :name="item.icon"
                class="h-6 w-6 shrink-0 text-muted transition-colors group-hover:text-accent-bright"
                aria-hidden="true"
              />
              <span
                class="border-b border-transparent transition-colors group-hover:border-muted"
              >
                {{ item.name }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
