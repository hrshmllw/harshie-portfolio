<script setup lang="ts">
/**
 * One drifting, draggable ticker row.
 * - Drifts slowly (DRIFT px/s), direction flips with `reverse`; pauses on hover.
 * - Drag with mouse/pen/touch (horizontal only; vertical swipes still scroll
 *   the page), with momentum on release. ←/→ nudge it when the row is focused.
 * - Reduced motion: no drift, one static wrapped list.
 */
type TickerItem = { name: string; icon: string; logo?: string; brand?: string };

const props = withDefaults(
  defineProps<{ category: string; items: TickerItem[]; reverse?: boolean }>(),
  { reverse: false },
);

const DRIFT = 30;
const MAX_VELOCITY = 2400;

const { shouldAnimate } = useMotionPreference();

const viewport = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const firstSet = ref<HTMLElement | null>(null);
const isDragging = ref(false);

let x = 0;
let setWidth = 0;
let velocity = 0;
let hovering = false;
let lastX = 0;
let lastT = 0;
let prev = 0;
let frame = 0;

const direction = computed(() => (props.reverse ? 1 : -1));

const wrap = () => {
  if (!setWidth) return;
  x = (((x % setWidth) - setWidth) % setWidth);
};

const render = () => {
  if (track.value) track.value.style.transform = `translate3d(${x}px, 0, 0)`;
};

const tick = (t: number) => {
  const dt = prev ? Math.min((t - prev) / 1000, 0.05) : 0;
  prev = t;

  if (!isDragging.value) {
    const drift = hovering ? 0 : DRIFT * direction.value;
    x += (drift + velocity) * dt;
    velocity *= Math.pow(0.05, dt);
    if (Math.abs(velocity) < 2) velocity = 0;
  }

  wrap();
  render();
  frame = requestAnimationFrame(tick);
};

const start = () => {
  if (frame) return;
  prev = 0;
  frame = requestAnimationFrame(tick);
};

const stop = () => {
  if (!frame) return;
  cancelAnimationFrame(frame);
  frame = 0;
};

const measure = () => {
  setWidth = firstSet.value?.offsetWidth ?? 0;
};

useResizeObserver(firstSet, measure);

// Only animate while the row is on screen.
const visible = useElementVisibility(viewport);

watch(
  [visible, shouldAnimate],
  ([isVisible, animate]) => {
    if (import.meta.client && isVisible && animate) start();
    else stop();
  },
  { immediate: true },
);

onBeforeUnmount(stop);

const onPointerDown = (event: PointerEvent) => {
  if (event.button !== 0 || !viewport.value) return;
  isDragging.value = true;
  velocity = 0;
  lastX = event.clientX;
  lastT = performance.now();
  viewport.value.setPointerCapture(event.pointerId);
};

const onPointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return;
  const now = performance.now();
  const dx = event.clientX - lastX;
  const dt = Math.max((now - lastT) / 1000, 1 / 240);
  x += dx;
  velocity = 0.8 * (dx / dt) + 0.2 * velocity;
  lastX = event.clientX;
  lastT = now;
};

const onPointerUp = (event: PointerEvent) => {
  if (!isDragging.value) return;
  isDragging.value = false;
  // A pause before letting go means no fling.
  if (performance.now() - lastT > 80) velocity = 0;
  velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));
  viewport.value?.releasePointerCapture?.(event.pointerId);
};

const onKey = (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") velocity = 700;
  else if (event.key === "ArrowRight") velocity = -700;
  else return;
  event.preventDefault();
};
</script>

<template>
  <div
    class="ticker-row rule-bottom grid md:grid-cols-[14rem_minmax(0,1fr)]"
    data-reveal-item
    tabindex="0"
    :aria-label="`${category}: ${items.map((item) => item.name).join(', ')}`"
    @keydown="onKey"
  >
    <h3
      class="flex items-center border-border px-6 pt-5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted md:border-r md:px-10 md:py-0 lg:pl-20"
    >
      {{ category }}
    </h3>

    <div
      v-if="shouldAnimate"
      ref="viewport"
      class="ticker-mask overflow-hidden py-5 md:py-7"
      :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @pointerenter="hovering = $event.pointerType === 'mouse'"
      @pointerleave="hovering = false"
    >
      <div ref="track" class="flex w-max select-none will-change-transform" aria-hidden="true">
        <ul
          v-for="copy in 2"
          :key="copy"
          :ref="(el) => { if (copy === 1) firstSet = el as HTMLElement }"
          class="flex shrink-0 items-center"
        >
          <li
            v-for="item in items"
            :key="item.name"
            class="tick-item flex items-center gap-4 pr-10 font-display text-3xl font-semibold tracking-tight text-fg md:gap-5 md:pr-14 md:text-5xl"
          >
            <UiTechMark :icon="item.icon" :logo="item.logo" :brand="item.brand" />
            <span class="whitespace-nowrap">{{ item.name }}</span>
            <span class="ml-6 h-2 w-2 shrink-0 bg-accent-bright md:ml-9" />
          </li>
        </ul>
      </div>
    </div>

    <ul v-else class="flex flex-wrap items-center gap-x-10 gap-y-4 px-6 py-5 md:px-8 md:py-7" aria-hidden="true">
      <li
        v-for="item in items"
        :key="item.name"
        class="tick-item flex items-center gap-4 font-display text-3xl font-semibold tracking-tight text-fg md:text-5xl"
      >
        <UiTechMark :icon="item.icon" :logo="item.logo" :brand="item.brand" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ticker-mask {
  touch-action: pan-y;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}

.ticker-row:focus-visible {
  outline-offset: -2px;
}

/* Fallback if JS hasn't hydrated yet under reduced motion: no drift is ever applied. */
@media (prefers-reduced-motion: reduce) {
  .ticker-mask {
    -webkit-mask-image: none;
    mask-image: none;
  }
}
</style>
