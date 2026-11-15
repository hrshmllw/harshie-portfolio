<script setup lang="ts">
/** Work · B — Cover grid: hairline 2-col grid of generated dot-matrix covers; NDA work gets a redaction stamp. */
const { shouldAnimate } = useMotionPreference();
const { showAll, displayed, hasMore, slug } = await useProjects();
</script>

<template>
  <section class="border-t border-border" aria-labelledby="work-b-title">
    <div class="container-x section-pad">
      <div class="max-w-2xl">
        <p class="eyebrow eyebrow-marker">Work</p>
        <h2 id="work-b-title" class="section-title mt-4">Selected work</h2>
        <p class="mt-4 text-muted">
          Featured projects across client engagements and personal builds.
          Confidential client work is listed without public&nbsp;links.
        </p>
      </div>

      <div class="mt-14 grid gap-px border border-border bg-border md:grid-cols-2">
        <article
          v-for="(project, index) in displayed"
          :key="project.id"
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 450, delay: (index % 2) * 90 }"
          class="card group flex flex-col bg-bg p-5 md:p-8"
        >
          <div class="mb-5 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
            <span class="text-accent-soft group-hover:text-accent-bright">{{ String(index + 1).padStart(2, "0") }}</span>
            <span>{{ project.year }}</span>
          </div>

          <LabProjectCover
            :seed="slug(project.path)"
            :redacted="project.confidential"
            class="card-cover aspect-[16/10] w-full"
          />

          <h3 class="mt-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {{ project.title }}
          </h3>
          <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-muted md:text-base">
            {{ project.description }}
          </p>

          <div class="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
            <ul class="flex flex-wrap gap-2" aria-label="Technologies">
              <li
                v-for="tag in project.tags"
                :key="tag"
                class="border border-border px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted"
              >
                {{ tag }}
              </li>
            </ul>
            <div v-if="!project.confidential" class="flex gap-4 text-sm">
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-fg hover:text-accent-bright"
              >
                Live <Icon name="lucide:arrow-up-right" class="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-fg hover:text-accent-bright"
              >
                Code <Icon name="lucide:arrow-up-right" class="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      </div>

      <button
        v-if="hasMore"
        type="button"
        class="btn-ghost mt-10"
        @click="showAll = !showAll"
      >
        {{ showAll ? "Show featured only" : "Show all projects" }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.card {
  transition: background-color 250ms ease;
}

.card:hover {
  background-color: #2e3235;
}

.card-cover {
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.card:hover .card-cover {
  transform: translateY(-4px);
}
</style>
