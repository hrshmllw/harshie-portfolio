<script setup lang="ts">
/**
 * Tech chips on a single line. Chips that don't fit are folded into a "+N"
 * chip; screen readers still get every tag via the sr-only text inside it.
 */
const props = defineProps<{ tags: string[] }>();

const GAP = 8; // matches gap-2
const list = ref<HTMLElement | null>(null);
const probe = ref<HTMLElement | null>(null);
const count = ref(props.tags.length);

const hiddenTags = computed(() => props.tags.slice(count.value));

const measure = () => {
  if (!list.value || !probe.value) return;
  const available = list.value.clientWidth;
  const chips = Array.from(probe.value.children) as HTMLElement[];
  const plusWidth = chips.pop()?.offsetWidth ?? 0;
  const widths = chips.map((chip) => chip.offsetWidth);

  const total = widths.reduce((sum, w) => sum + w, 0) + GAP * (widths.length - 1);
  if (total <= available) {
    count.value = widths.length;
    return;
  }

  let used = plusWidth;
  let fit = 0;
  for (const w of widths) {
    if (used + GAP + w > available) break;
    used += GAP + w;
    fit++;
  }
  count.value = Math.max(fit, 1);
};

useResizeObserver(list, measure);
onMounted(() => document.fonts?.ready.then(measure));
</script>

<template>
  <!-- overflow-hidden also clips the measuring row so it can't widen the page -->
  <div class="relative min-w-0 overflow-hidden">
    <ul ref="list" class="flex gap-2" aria-label="Technologies">
      <li v-for="(tag, i) in tags" v-show="i < count" :key="tag" class="tag-chip">
        {{ tag }}
      </li>
      <li v-if="hiddenTags.length" class="tag-chip" :title="hiddenTags.join(', ')">
        <span aria-hidden="true">+{{ hiddenTags.length }}</span>
        <span class="sr-only">{{ hiddenTags.join(", ") }}</span>
      </li>
    </ul>
    <!-- Off-screen copy used only to measure each chip's natural width. -->
    <ul
      ref="probe"
      class="pointer-events-none invisible absolute left-0 top-0 flex gap-2"
      aria-hidden="true"
    >
      <li v-for="tag in tags" :key="tag" class="tag-chip">{{ tag }}</li>
      <li class="tag-chip">+{{ tags.length }}</li>
    </ul>
  </div>
</template>

<style scoped>
.tag-chip {
  @apply shrink-0 whitespace-nowrap border border-border px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted;
}
</style>
