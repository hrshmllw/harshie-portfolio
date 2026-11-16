<script setup lang="ts">
/** Stacking cards: each project pins and stacks over the last, led by its screenshot. */
const { showAll, displayed, hasMore, total, featuredCount, slug, toggleAll } = await useProjects();

const list = ref<{ $el: HTMLElement } | null>(null);

const status = (project: { confidential?: boolean; liveUrl?: string; githubUrl?: string }) =>
  project.confidential ? "Client work · NDA" : project.liveUrl ? "Live" : project.githubUrl ? "Repository" : "Archived";
</script>

<template>
  <section id="work" class="border-t border-border" aria-labelledby="work-title">
    <div class="container-x section-pad">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl">
          <p class="eyebrow eyebrow-marker">Work</p>
          <h2 id="work-title" class="section-title mt-4">Selected work</h2>
        </div>
        <p class="max-w-sm text-sm text-muted">
          Client engagements and personal builds. Work under NDA is shown
          pixelated and without public&nbsp;links.
        </p>
      </div>

      <TransitionGroup ref="list" tag="ol" name="card" class="project-list mt-14">
        <li
          v-for="(project, index) in displayed"
          :key="project.id"
          class="stack-card sticky mb-8 border border-border last:mb-0"
          :class="index % 2 === 0 ? 'bg-surface' : 'bg-bg'"
          :style="{
            top: `calc(5.5rem + ${Math.min(index, 5)}rem)`,
            '--stagger': `${Math.max(index - featuredCount, 0) * 70}ms`,
          }"
        >
          <div class="flex items-center justify-between gap-4 border-b border-border px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted md:px-8">
            <span>
              <span class="text-accent-bright">{{ String(index + 1).padStart(2, "0") }}</span>
              / {{ String(displayed.length).padStart(2, "0") }}
            </span>
            <span :class="project.confidential ? 'text-accent-bright' : ''">{{ status(project) }}</span>
            <span class="hidden sm:inline">{{ project.year }}</span>
          </div>

          <div class="grid gap-6 p-5 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:gap-10 md:p-8">
            <component
              :is="project.liveUrl && !project.confidential ? 'a' : 'div'"
              :href="project.liveUrl && !project.confidential ? project.liveUrl : undefined"
              :target="project.liveUrl && !project.confidential ? '_blank' : undefined"
              :rel="project.liveUrl && !project.confidential ? 'noopener noreferrer' : undefined"
              :tabindex="project.liveUrl && !project.confidential ? -1 : undefined"
              class="shot group relative block overflow-hidden border border-border"
            >
              <UiProjectCover
                :seed="slug(project.path)"
                :image="project.image"
                :alt="project.image && !project.confidential ? `${project.title} homepage` : ''"
                :redacted="project.confidential"
                class="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </component>

            <div class="flex flex-col">
              <h3 class="font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-4xl">
                {{ project.title }}
              </h3>
              <p class="mt-4 leading-relaxed text-muted">{{ project.description }}</p>

              <ul class="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                <li
                  v-for="tag in project.tags"
                  :key="tag"
                  class="border border-border px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted"
                >
                  {{ tag }}
                </li>
              </ul>

              <div
                v-if="!project.confidential && (project.liveUrl || project.githubUrl)"
                class="mt-auto flex flex-wrap gap-3 pt-8"
              >
                <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noopener noreferrer" class="btn-primary text-xs">
                  Visit site <Icon name="lucide:arrow-up-right" class="ml-1.5 h-4 w-4" aria-hidden="true" />
                </a>
                <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noopener noreferrer" class="btn-ghost text-xs">
                  Repository
                </a>
              </div>
            </div>
          </div>
        </li>
      </TransitionGroup>

      <button
        v-if="hasMore"
        type="button"
        class="btn-ghost mt-10"
        :aria-expanded="showAll"
        @click="toggleAll(list?.$el)"
      >
        {{ showAll ? "Show featured only" : `Show all ${total} projects` }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.stack-card {
  box-shadow: 0 -24px 48px -24px rgba(0, 0, 0, 0.5);
}

/* Revealing more cards must not drag the page to keep the button in place. */
.project-list {
  overflow-anchor: none;
}

.card-enter-active {
  transition:
    opacity 600ms ease var(--stagger),
    transform 700ms cubic-bezier(0.22, 1, 0.36, 1) var(--stagger);
}

.card-enter-from {
  opacity: 0;
  transform: translateY(48px);
}

.card-leave-active {
  transition: opacity 250ms ease;
}

.card-leave-to {
  opacity: 0;
}
</style>
