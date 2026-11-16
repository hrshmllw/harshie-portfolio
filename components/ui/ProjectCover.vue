<script setup lang="ts">
/**
 * Deterministic dot-matrix cover for a project, seeded by its slug.
 * Mirrored like an identicon so every project gets a distinct, symmetric mark
 * without needing (NDA-protected) screenshots.
 */
const props = withDefaults(
  defineProps<{
    seed: string;
    image?: string;
    alt?: string;
    redacted?: boolean;
    active?: boolean;
  }>(),
  { redacted: false, active: false },
);

const sources = computed(() => (props.image ? coverSources(props.image) : null));

const COLS = 16;
const ROWS = 10;
const CELL = 10;

const hash = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const cells = computed(() => {
  const random = rng(hash(props.seed));
  const density = 0.28 + random() * 0.22;
  const half = COLS / 2;
  const out: { x: number; y: number; tone: "on" | "dim" | "off" }[] = [];

  for (let r = 0; r < ROWS; r++) {
    const row: ("on" | "dim" | "off")[] = [];
    for (let c = 0; c < half; c++) {
      const n = random();
      row.push(n < density ? "on" : n < density + 0.18 ? "dim" : "off");
    }
    [...row, ...row.slice().reverse()].forEach((tone, c) =>
      out.push({ x: c * CELL, y: r * CELL, tone }),
    );
  }
  return out;
});

const cursor = computed(() => {
  const random = rng(hash(`${props.seed}:cursor`));
  return {
    x: Math.floor(random() * COLS) * CELL,
    y: Math.floor(random() * ROWS) * CELL,
  };
});
</script>

<template>
  <div class="cover relative overflow-hidden bg-[#25292c]" :class="{ 'is-active': active }">
    <img
      v-if="sources"
      :src="sources.src"
      :srcset="sources.srcset"
      :sizes="sources.sizes"
      :alt="alt ?? ''"
      :width="sources.width"
      :height="sources.height"
      decoding="async"
      class="block h-full w-full object-cover object-top"
      :class="{ 'is-pixelated': sources.pixelated }"
    />
    <svg
      v-else
      :viewBox="`-5 -5 ${COLS * CELL + 10} ${ROWS * CELL + 10}`"
      class="block h-full w-full"
      shape-rendering="crispEdges"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        v-for="(cell, i) in cells"
        :key="i"
        :x="cell.x"
        :y="cell.y"
        width="9"
        height="9"
        class="cover-px"
        :class="`is-${cell.tone}`"
      />
      <rect :x="cursor.x" :y="cursor.y" width="9" height="9" class="cover-cursor" />
    </svg>

    <!-- One stamp across the whole cover; sized off the cover's width. -->
    <div
      v-if="redacted"
      class="nda-stamp-wrap absolute inset-0 grid place-items-center"
      :class="{ 'bg-bg/30': image }"
      aria-hidden="true"
    >
      <span class="nda-stamp">Under NDA</span>
    </div>
  </div>
</template>

<style scoped>
.is-pixelated {
  image-rendering: pixelated;
}

.nda-stamp-wrap {
  container-type: inline-size;
}

.nda-stamp {
  transform: rotate(-8deg);
  border: max(2px, 0.6cqw) solid #c4454a;
  padding: 1.2cqw 3.5cqw;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 9cqw;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #c4454a;
  background: rgb(42 46 49 / 0.55);
  box-shadow: inset 0 0 0 max(1px, 0.25cqw) rgb(42 46 49 / 0.55);
}
.cover-px {
  transition:
    fill 400ms ease,
    opacity 400ms ease;
}

.cover-px.is-on {
  fill: #f4f1ec;
  opacity: 0.82;
}

.cover-px.is-dim {
  fill: #45494c;
}

.cover-px.is-off {
  fill: #32363a;
}

.cover-cursor {
  fill: #c4454a;
}

.cover.is-active .cover-px.is-on {
  fill: #c4454a;
  opacity: 0.9;
}

.cover.is-active .cover-px.is-dim {
  fill: #8b2a32;
}

.cover.is-active .cover-cursor {
  fill: #f4f1ec;
}

@media (prefers-reduced-motion: no-preference) {
  .cover-cursor {
    animation: cover-blink 1.1s steps(1, end) infinite;
  }
}

@keyframes cover-blink {
  50% {
    opacity: 0;
  }
}
</style>
