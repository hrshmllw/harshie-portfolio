<script setup lang="ts">
/**
 * The large-cut "ej" (6×6, 7-unit pixels with a 1-unit gap; see logo.md) as a
 * dot matrix. Lit pixels fly in from scattered offsets the first time it
 * scrolls into view; empty cells paint maroon on hover.
 */
withDefaults(defineProps<{ caption?: boolean }>(), { caption: true });

// Lit cells of the 6×6 "ej" grid; "col,row".
const LIT = new Set([
  "0,1", "1,1", "2,1",
  "0,2", "2,2", "5,2",
  "0,3", "1,3", "2,3", "5,3",
  "0,4", "5,4",
  "0,5", "1,5", "2,5", "4,5", "5,5",
]);

// Deterministic scatter so server and client render the same offsets.
const cells = Array.from({ length: 36 }, (_, i) => {
  const col = i % 6;
  const row = Math.floor(i / 6);
  const n = Math.sin(i * 12.9898) * 43758.5453;
  const r = n - Math.floor(n);
  const m = Math.sin(i * 78.233) * 12543.123;
  const s = m - Math.floor(m);
  return {
    key: `${col},${row}`,
    x: col * 8,
    y: row * 8,
    lit: LIT.has(`${col},${row}`),
    cursor: col === 5 && row === 0,
    dx: `${Math.round((r - 0.5) * 120)}px`,
    dy: `${Math.round((s - 0.5) * 120)}px`,
    delay: `${Math.round(r * 380)}ms`,
  };
});

const root = ref<HTMLElement | null>(null);
const settled = useRevealOnce(root, 0.35);
</script>

<template>
  <div ref="root" class="dm" :class="{ 'is-settled': settled }">
    <svg
      viewBox="-1 -1 50 50"
      class="block w-full"
      shape-rendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        v-for="cell in cells"
        :key="cell.key"
        :x="cell.x"
        :y="cell.y"
        width="7"
        height="7"
        class="dm-px"
        :class="cell.cursor ? 'is-cursor' : cell.lit ? 'is-lit' : 'is-off'"
        :style="{ '--dx': cell.dx, '--dy': cell.dy, '--d': cell.delay }"
      />
    </svg>
    <p
      v-if="caption"
      class="mt-6 flex justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted"
    >
      <span>ej &middot; 6&times;6</span>
      <span>Hover the empty cells</span>
    </p>
  </div>
</template>

<style scoped>
.dm-px {
  transform-box: fill-box;
  transition:
    transform 1000ms cubic-bezier(0.22, 1, 0.36, 1) var(--d),
    opacity 600ms ease var(--d),
    fill 250ms ease;
}

.dm-px.is-off {
  fill: #32363a;
}

.dm-px.is-off:hover {
  fill: #8b2a32;
  transition-delay: 0ms;
}

.dm-px.is-lit {
  fill: #f4f1ec;
}

.dm-px.is-cursor {
  fill: #c4454a;
}

@media (prefers-reduced-motion: no-preference) {
  :root.js .dm:not(.is-settled) .dm-px.is-lit,
  :root.js .dm:not(.is-settled) .dm-px.is-cursor {
    transform: translate(var(--dx), var(--dy));
    opacity: 0;
  }

  .dm.is-settled .dm-px.is-cursor {
    animation: dm-blink 1.1s steps(1, end) 1.4s infinite;
  }
}

@keyframes dm-blink {
  50% {
    opacity: 0;
  }
}
</style>
