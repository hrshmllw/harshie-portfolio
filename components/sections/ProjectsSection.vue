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
</script>

<template>
  <section id="projects" class="section-container border-t border-border">
    <div
      v-motion
      :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
      :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
      :transition="{ duration: 500 }"
    >
      <p class="section-eyebrow">Projects</p>
      <h2 class="section-title">Selected work.</h2>
      <p class="mt-4 max-w-2xl text-muted">
        Featured projects across client work and personal builds. Some details
        are anonymized under confidentiality agreements.
      </p>
    </div>

    <div class="mt-12 grid gap-6">
      <article
        v-for="(project, index) in displayedProjects"
        :key="project.id"
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 450, delay: index * 60 }"
        class="rounded-xl border border-border bg-surface p-6 md:p-8"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="max-w-3xl">
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-semibold tracking-tight">
                {{ project.title }}
              </h3>
              <span
                v-if="project.confidential"
                class="font-mono text-xs text-accent"
                title="Confidential project"
              >
                *
              </span>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-muted md:text-base">
              {{ project.description }}
            </p>
          </div>
          <p
            v-if="project.year"
            class="font-mono text-xs uppercase tracking-[0.2em] text-muted"
          >
            {{ project.year }}
          </p>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="rounded-full border border-border px-3 py-1 text-xs text-muted"
          >
            {{ tag }}
          </span>
        </div>

        <div
          v-if="!project.confidential && (project.liveUrl || project.githubUrl)"
          class="mt-6 flex flex-wrap gap-3"
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
      </article>
    </div>

    <button
      v-if="hasMoreProjects"
      type="button"
      class="btn-ghost mt-8"
      @click="showAll = !showAll"
    >
      {{ showAll ? "Show featured only" : "Show all projects" }}
    </button>
  </section>
</template>
