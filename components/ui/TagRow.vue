<script setup lang="ts">
/**
 * Tech chips on a single line that scrolls sideways when they don't fit:
 * native swipe on touch, drag with the mouse, arrow keys when focused.
 * Edge fades hint that more chips are hidden.
 */
defineProps<{ tags: string[] }>();

const list = ref<HTMLElement | null>(null);
const canLeft = ref(false);
const canRight = ref(false);
const overflows = computed(() => canLeft.value || canRight.value);

const update = () => {
  const el = list.value;
  if (!el) return;
  canLeft.value = el.scrollLeft > 1;
  canRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
};

useResizeObserver(list, update);
onMounted(() => document.fonts?.ready.then(update));

// Mouse drag (touch and pen already scroll natively).
let dragging = false;
let moved = false;
let startX = 0;
let startScroll = 0;

const onPointerDown = (event: PointerEvent) => {
  if (event.pointerType !== "mouse" || event.button !== 0 || !list.value || !overflows.value) return;
  dragging = true;
  moved = false;
  startX = event.clientX;
  startScroll = list.value.scrollLeft;
  list.value.setPointerCapture(event.pointerId);
};

const onPointerMove = (event: PointerEvent) => {
  if (!dragging || !list.value) return;
  const dx = event.clientX - startX;
  if (Math.abs(dx) > 3) moved = true;
  list.value.scrollLeft = startScroll - dx;
};

const onPointerUp = (event: PointerEvent) => {
  if (!dragging) return;
  dragging = false;
  list.value?.releasePointerCapture?.(event.pointerId);
};

// A drag shouldn't count as a click on whatever is underneath.
const onClickCapture = (event: MouseEvent) => {
  if (moved) {
    event.preventDefault();
    event.stopPropagation();
    moved = false;
  }
};
</script>

<template>
  <ul
    ref="list"
    class="tag-row flex gap-2 overflow-x-auto"
    :class="{ 'can-left': canLeft, 'can-right': canRight, 'cursor-grab active:cursor-grabbing': overflows }"
    :tabindex="overflows ? 0 : undefined"
    aria-label="Technologies"
    @scroll.passive="update"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @click.capture="onClickCapture"
  >
    <li
      v-for="tag in tags"
      :key="tag"
      class="shrink-0 select-none whitespace-nowrap border border-border px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted"
    >
      {{ tag }}
    </li>
  </ul>
</template>

<style scoped>
.tag-row {
  scrollbar-width: none;
  overscroll-behavior-x: contain;
  --fade-l: #000;
  --fade-r: #000;
  -webkit-mask-image: linear-gradient(90deg, var(--fade-l), #000 2rem, #000 calc(100% - 2rem), var(--fade-r));
  mask-image: linear-gradient(90deg, var(--fade-l), #000 2rem, #000 calc(100% - 2rem), var(--fade-r));
}

.tag-row::-webkit-scrollbar {
  display: none;
}

.tag-row.can-left {
  --fade-l: transparent;
}

.tag-row.can-right {
  --fade-r: transparent;
}

.tag-row:focus-visible {
  outline: 1px solid theme("colors.accent.bright");
  outline-offset: 2px;
}
</style>
