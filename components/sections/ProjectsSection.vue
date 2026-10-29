<script setup lang="ts">
const { shouldAnimate } = useMotionPreference();
const showAll = ref(false);

const { data: projects } = await useAsyncData("projects", () =>
  queryCollection("projects").order("order", "ASC").all(),
);

const featuredProjects = computed(() =>
  (projects.value ?? []).filter((project) => project.featured),
);

const displayedProjects = computed(() =>
  showAll.value ? (projects.value ?? []) : featuredProjects.value,
);

const hasMoreProjects = computed(
  () => (projects.value?.length ?? 0) > featuredProjects.value.length,
);

const formatIndex = (index: number) =>
  String(index + 1).padStart(2, "0");
</script>

<template>
  <section id="work" class="border-t border-border">
    <div class="container-x section-pad">
      <div
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500 }"
        class="max-w-2xl"
      >
        <p class="eyebrow">Work</p>
        <h2 class="section-title mt-4">Selected work</h2>
        <p class="mt-4 text-muted">
          Featured projects across client engagements and personal builds.
          Confidential client work is listed without public links.
        </p>
      </div>

      <div class="mt-14 border-t border-border">
        <article
          v-for="(project, index) in displayedProjects"
          :key="project.id"
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 450, delay: index * 50 }"
          class="grid gap-4 border-b border-border py-8 md:grid-cols-[4rem_1fr_auto] md:gap-8 md:py-10"
        >
          <p
            class="font-display text-sm tabular-nums text-muted"
            aria-hidden="true"
          >
            {{ formatIndex(index) }}
          </p>

          <div class="min-w-0">
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 class="font-display text-xl font-semibold tracking-tight md:text-2xl">
                {{ project.title }}
              </h3>
              <p
                v-if="project.year"
                class="text-xs uppercase tracking-[0.18em] text-muted"
              >
                {{ project.year }}
              </p>
            </div>

            <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              {{ project.description }}
            </p>

            <ul class="mt-4 flex flex-wrap gap-x-3 gap-y-2" aria-label="Technologies">
              <li
                v-for="tag in project.tags"
                :key="tag"
                class="text-xs text-muted"
              >
                <span class="text-border" aria-hidden="true">/</span>
                {{ tag }}
              </li>
            </ul>

            <p
              v-if="project.confidential"
              class="mt-4 text-xs uppercase tracking-[0.16em] text-accent-bright/80"
            >
              Client work under NDA — no public links
            </p>

            <div
              v-else-if="project.liveUrl || project.githubUrl"
              class="mt-5 flex flex-wrap gap-3"
            >
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-ghost text-xs"
              >
                Live site
              </a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-ghost text-xs"
              >
                Repository
              </a>
            </div>
          </div>
        </article>
      </div>

      <button
        v-if="hasMoreProjects"
        type="button"
        class="btn-ghost mt-10"
        @click="showAll = !showAll"
      >
        {{ showAll ? "Show featured only" : "Show all projects" }}
      </button>
    </div>
  </section>
</template>
