<script setup lang="ts">
/** Floating panel on /lab: pick a layout per section; the choice lives in the query string. */
export type LabSection = {
  key: string;
  label: string;
  names: Record<string, string>;
};

const props = defineProps<{
  sections: LabSection[];
  selected: Record<string, string>;
  defaults: Record<string, string>;
}>();

const route = useRoute();
const router = useRouter();
const isOpen = ref(true);

const choose = (key: string, variant: string) => {
  const query = { ...route.query };
  if (variant === (props.defaults[key] ?? "current")) delete query[key];
  else query[key] = variant;
  router.replace({ query });
};

const shuffle = () => {
  const query: Record<string, string> = {};
  props.sections.forEach((section) => {
    const options = Object.keys(section.names).filter((name) => name !== "current");
    query[section.key] = options[Math.floor(Math.random() * options.length)];
  });
  router.replace({ query });
};

const resetAll = () => router.replace({ query: {} });

const jump = (key: string) =>
  document.getElementById(key)?.scrollIntoView({ block: "start" });
</script>

<template>
  <aside
    class="fixed bottom-4 left-4 z-50 max-w-[calc(100vw-2rem)] border border-border bg-bg/95 font-mono text-[0.7rem] text-muted shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur"
    aria-label="Layout variants"
  >
    <button
      type="button"
      class="flex w-full items-center justify-between gap-6 px-3 py-2.5 uppercase tracking-[0.18em] text-fg"
      :aria-expanded="isOpen"
      aria-controls="lab-switcher-panel"
      @click="isOpen = !isOpen"
    >
      <span class="flex items-center gap-2">
        <span class="h-1.5 w-1.5 bg-accent-bright" aria-hidden="true" />
        Layout lab
      </span>
      <Icon :name="isOpen ? 'lucide:minus' : 'lucide:plus'" class="h-3.5 w-3.5" aria-hidden="true" />
    </button>

    <div v-show="isOpen" id="lab-switcher-panel" class="border-t border-border">
      <table class="w-full">
        <tbody>
          <tr v-for="section in sections" :key="section.key" class="border-b border-border/60">
            <th scope="row" class="px-3 py-2 text-left font-normal">
              <button type="button" class="uppercase tracking-[0.14em] hover:text-fg" @click="jump(section.key)">
                {{ section.label }}
              </button>
            </th>
            <td class="px-2 py-1.5">
              <div class="flex flex-wrap gap-1" role="group" :aria-label="`${section.label} layout`">
                <button
                  v-for="(name, variant) in section.names"
                  :key="variant"
                  type="button"
                  class="min-w-[1.75rem] border px-1.5 py-1 uppercase transition-colors"
                  :class="
                    selected[section.key] === variant
                      ? 'border-accent-bright bg-accent text-fg'
                      : 'border-border hover:border-muted hover:text-fg'
                  "
                  :aria-pressed="selected[section.key] === variant"
                  :title="name"
                  @click="choose(section.key, String(variant))"
                >
                  {{ variant === "current" ? "Now" : variant }}
                </button>
              </div>
            </td>
            <td class="hidden truncate py-2 pr-3 text-fg/80 sm:table-cell sm:max-w-[9rem]">
              {{ section.names[selected[section.key]] }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between gap-3 px-3 py-2 uppercase tracking-[0.14em]">
        <button type="button" class="hover:text-fg" @click="shuffle">Shuffle</button>
        <button type="button" class="hover:text-fg" @click="resetAll">Picks</button>
      </div>
    </div>
  </aside>
</template>
