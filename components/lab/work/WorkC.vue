<script setup lang="ts">
/** Work · C — File tree: a `ls` of ~/work in mono; each file expands into its frontmatter. */
const { showAll, displayed, hasMore, total, slug } = await useProjects();

const open = ref<string | null>(null);

const status = (project: { confidential?: boolean; liveUrl?: string; githubUrl?: string }) =>
  project.confidential ? "nda" : project.liveUrl ? "live" : project.githubUrl ? "repo" : "—";
</script>

<template>
  <section class="border-t border-border" aria-labelledby="work-c-title">
    <div class="container-x section-pad">
      <div class="max-w-2xl">
        <p class="eyebrow eyebrow-marker">Work</p>
        <h2 id="work-c-title" class="section-title mt-4">Selected work</h2>
      </div>

      <div class="mt-14 border border-border font-mono text-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 text-xs text-muted md:px-6">
          <p>
            <span class="text-accent-bright">ej</span>@portfolio
            <span class="text-fg">~/work</span>
            $ ls {{ showAll ? "--all" : "--featured" }}<span class="hero-cursor" aria-hidden="true" />
          </p>
          <p>{{ displayed.length }} of {{ total }} files</p>
        </div>

        <div class="hidden grid-cols-[minmax(0,1fr)_5rem_5rem_2rem] gap-4 border-b border-border px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-muted md:grid md:px-6">
          <span>name</span><span>year</span><span>status</span><span />
        </div>

        <ul>
          <li
            v-for="(project, index) in displayed"
            :key="project.id"
            class="border-b border-border last:border-b-0"
          >
            <button
              type="button"
              class="tree-row grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 text-left md:grid-cols-[minmax(0,1fr)_5rem_5rem_2rem] md:px-6"
              :aria-expanded="open === project.id"
              :aria-controls="`work-c-${slug(project.path)}`"
              @click="open = open === project.id ? null : project.id"
            >
              <span class="truncate">
                <span class="text-border" aria-hidden="true">{{ index === displayed.length - 1 ? "└─" : "├─" }}</span>
                <span class="tree-name ml-2 text-fg">{{ slug(project.path) }}</span><span class="text-muted">.md</span>
              </span>
              <span class="hidden text-muted md:block">{{ project.year ?? "—" }}</span>
              <span
                class="text-xs uppercase tracking-[0.14em]"
                :class="status(project) === 'nda' ? 'text-accent-bright' : 'text-muted'"
              >{{ status(project) }}</span>
              <span class="hidden text-right text-muted md:block" aria-hidden="true">{{ open === project.id ? "−" : "+" }}</span>
            </button>

            <div
              :id="`work-c-${slug(project.path)}`"
              class="tree-detail grid"
              :class="{ 'is-open': open === project.id }"
              :inert="open !== project.id || undefined"
            >
              <div class="min-h-0 overflow-hidden">
                <div class="grid gap-6 border-t border-dashed border-border bg-[#26292c] px-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:px-6 md:pl-12">
                  <pre class="overflow-x-auto text-xs leading-relaxed text-muted"><span class="text-border">---</span>
<span class="text-accent-bright">title</span>: <span class="text-fg">{{ project.title }}</span>
<span class="text-accent-bright">year</span>: {{ project.year ?? "—" }}
<span class="text-accent-bright">stack</span>: [{{ project.tags.join(", ") }}]
<span class="text-accent-bright">status</span>: {{ status(project) }}
<span class="text-border">---</span></pre>
                  <div class="font-sans">
                    <h3 class="font-display text-xl font-semibold tracking-tight">{{ project.title }}</h3>
                    <p class="mt-2 leading-relaxed text-muted">{{ project.description }}</p>
                    <p v-if="project.confidential" class="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent-bright">
                      Client work under NDA — no public links
                    </p>
                    <div v-else class="mt-4 flex flex-wrap gap-3">
                      <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noopener noreferrer" class="btn-ghost text-xs">Live site</a>
                      <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noopener noreferrer" class="btn-ghost text-xs">Repository</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <button
          v-if="hasMore"
          type="button"
          class="w-full border-t border-border px-4 py-3 text-left text-xs text-muted transition-colors hover:bg-surface hover:text-fg md:px-6"
          @click="showAll = !showAll"
        >
          $ ls {{ showAll ? "--featured" : "--all" }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tree-row {
  transition: background-color 150ms ease;
}

.tree-row:hover {
  background-color: #32363a;
}

.tree-row:hover .tree-name,
.tree-row[aria-expanded="true"] .tree-name {
  color: #c4454a;
}

.tree-detail {
  grid-template-rows: 0fr;
  transition: grid-template-rows 350ms cubic-bezier(0.22, 1, 0.36, 1);
}

.tree-detail.is-open {
  grid-template-rows: 1fr;
}
</style>
