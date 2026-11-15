<script setup lang="ts">
/** Work · A — Hover index: big titles; a cursor-following preview shows each project's dot-matrix cover. */
const { shouldAnimate } = useMotionPreference();
const { showAll, displayed, hasMore, slug } = await useProjects();

const open = ref<string | null>(null);
const hovered = ref<number | null>(null);
const hoveredProject = computed(() =>
  hovered.value === null ? null : displayed.value[hovered.value],
);

// Preview follows the pointer with a little lag (fine pointers only).
const preview = ref<HTMLElement | null>(null);
const target = { x: 0, y: 0 };
const pos = { x: 0, y: 0 };
let frame = 0;

const tick = () => {
  pos.x += (target.x - pos.x) * 0.18;
  pos.y += (target.y - pos.y) * 0.18;
  if (preview.value) {
    preview.value.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
  }
  frame = requestAnimationFrame(tick);
};

const onMove = (event: PointerEvent) => {
  if (event.pointerType !== "mouse") return;
  target.x = event.clientX + 24;
  target.y = event.clientY - 90;
  if (!frame) {
    pos.x = target.x;
    pos.y = target.y;
    frame = requestAnimationFrame(tick);
  }
};

const onLeave = () => {
  hovered.value = null;
  cancelAnimationFrame(frame);
  frame = 0;
};

onBeforeUnmount(() => cancelAnimationFrame(frame));

const toggle = (id: string) => {
  open.value = open.value === id ? null : id;
};
</script>

<template>
  <section class="border-t border-border" aria-labelledby="work-a-title">
    <div class="container-x section-pad">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl">
          <p class="eyebrow eyebrow-marker">Work</p>
          <h2 id="work-a-title" class="section-title mt-4">Selected work</h2>
        </div>
        <p class="max-w-sm text-sm text-muted">
          Client engagements and personal builds. Confidential client work is
          listed without public&nbsp;links.
        </p>
      </div>

      <ol
        class="index-list mt-14 border-t border-border"
        @pointermove="onMove"
        @pointerleave="onLeave"
      >
        <li
          v-for="(project, index) in displayed"
          :key="project.id"
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 450, delay: index * 40 }"
          class="border-b border-border"
          @pointerenter="hovered = index"
        >
          <h3 class="index-row" :class="{ 'is-dim': hovered !== null && hovered !== index }">
            <button
              type="button"
              class="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-4 py-6 text-left md:grid-cols-[4rem_minmax(0,1fr)_auto] md:py-8"
              :aria-expanded="open === project.id"
              :aria-controls="`work-a-${slug(project.path)}`"
              @click="toggle(project.id)"
            >
              <span class="font-mono text-xs tabular-nums text-accent-soft group-hover:text-accent-bright">
                {{ String(index + 1).padStart(2, "0") }}
              </span>
              <span class="font-display text-[clamp(1.6rem,4.2vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-2">
                {{ project.title }}
              </span>
              <span class="flex items-center gap-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                <span v-if="project.confidential" class="hidden text-accent-bright sm:inline">NDA</span>
                <span>{{ project.year }}</span>
                <Icon
                  name="lucide:plus"
                  class="h-4 w-4 transition-transform duration-300"
                  :class="{ 'rotate-45': open === project.id }"
                  aria-hidden="true"
                />
              </span>
            </button>
          </h3>

          <div
            :id="`work-a-${slug(project.path)}`"
            class="index-detail grid"
            :class="{ 'is-open': open === project.id }"
            :inert="open !== project.id || undefined"
          >
            <div class="min-h-0 overflow-hidden">
              <div class="grid gap-6 pb-8 md:grid-cols-[4rem_minmax(0,1fr)_16rem] md:gap-4">
                <span class="hidden md:block" />
                <div>
                  <p class="max-w-2xl leading-relaxed text-muted">{{ project.description }}</p>
                  <ul class="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted" aria-label="Technologies">
                    <li v-for="tag in project.tags" :key="tag">
                      <span class="text-accent-soft" aria-hidden="true">/</span> {{ tag }}
                    </li>
                  </ul>
                  <p v-if="project.confidential" class="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent-bright">
                    Client work under NDA — no public links
                  </p>
                  <div v-else class="mt-5 flex flex-wrap gap-3">
                    <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noopener noreferrer" class="btn-ghost text-xs">Live site</a>
                    <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noopener noreferrer" class="btn-ghost text-xs">Repository</a>
                  </div>
                </div>
                <LabProjectCover
                  :seed="slug(project.path)"
                  :image="project.image"
                  :redacted="project.confidential"
                  class="aspect-[16/10] w-full md:hidden"
                />
              </div>
            </div>
          </div>
        </li>
      </ol>

      <button
        v-if="hasMore"
        type="button"
        class="btn-ghost mt-10"
        @click="showAll = !showAll"
      >
        {{ showAll ? "Show featured only" : "Show all projects" }}
      </button>
    </div>

    <ClientOnly>
      <Teleport to="body">
        <div
          ref="preview"
          class="work-preview pointer-events-none fixed left-0 top-0 z-40 hidden w-72 border border-border bg-bg md:block"
          :class="{ 'is-visible': hoveredProject }"
          aria-hidden="true"
        >
          <template v-if="hoveredProject">
            <LabProjectCover
              :seed="slug(hoveredProject.path)"
              :image="hoveredProject.image"
              :redacted="hoveredProject.confidential"
              active
              class="aspect-[16/10] w-full"
            />
            <p class="flex justify-between border-t border-border px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
              <span class="truncate">{{ hoveredProject.tags.join(" / ") }}</span>
              <span>{{ hoveredProject.year }}</span>
            </p>
          </template>
        </div>
      </Teleport>
    </ClientOnly>
  </section>
</template>

<style scoped>
.index-row {
  transition: opacity 300ms ease;
}

.index-row.is-dim {
  opacity: 0.35;
}

.index-detail {
  grid-template-rows: 0fr;
  transition: grid-template-rows 450ms cubic-bezier(0.22, 1, 0.36, 1);
}

.index-detail.is-open {
  grid-template-rows: 1fr;
}

.work-preview {
  opacity: 0;
  scale: 0.92;
  transition:
    opacity 200ms ease,
    scale 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.work-preview.is-visible {
  opacity: 1;
  scale: 1;
}

@media (hover: none) {
  .work-preview {
    display: none;
  }
}
</style>
