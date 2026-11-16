<script setup lang="ts">
/**
 * First-load preloader: the pixel "ej" builds itself on its 6×6 grid while
 * the fonts and the selected projects' covers load. Shown only while <html> has
 * `is-loading` (set by the <head> script), so it's on screen from first paint
 * and never appears without JS.
 *
 * Grid + pixel build are CSS animations, so they run before hydration. JS
 * tracks real progress, then plays the exit and hands over to the entry
 * animations (`useSiteIntro().preloaded`).
 */
import { gsap } from "gsap";

const MIN_MS = 1500; // let the logo finish building
const MAX_MS = 6000; // never hold the page longer than this

// Lit cells of the "ej" in stroke order: the e top to bottom, then the j.
const LIT: [number, number][] = [
  [0, 1], [1, 1], [2, 1], [2, 2], [2, 3], [1, 3], [0, 3], [0, 2],
  [0, 4], [0, 5], [1, 5], [2, 5],
  [5, 2], [5, 3], [5, 4], [5, 5], [4, 5],
];
const CURSOR: [number, number] = [5, 0];
const GRID = [0, 8, 16, 24, 32, 40, 48];

const { preloaded } = useSiteIntro();
const { featured } = await useProjects();
const nuxtApp = useNuxtApp();

const root = ref<HTMLElement | null>(null);
const shown = ref(0);
const percent = computed(() => String(Math.round(shown.value)).padStart(3, "0"));

onMounted(async () => {
  const html = document.documentElement;
  if (!html.classList.contains("is-loading")) {
    preloaded.value = true;
    return;
  }

  const motion = html.classList.contains("motion");
  const lenis = nuxtApp.$lenis?.current;
  lenis?.stop();
  window.scrollTo(0, 0);

  // Real progress: fonts + each cover image.
  const images = featured.value.map((p) => p.image).filter(Boolean) as string[];
  const tasks: Promise<unknown>[] = [
    document.fonts?.ready ?? Promise.resolve(),
    ...images.map((src) => preloadCover(src)),
  ];
  let done = 0;
  const counter = { v: 0 };
  const advance = () => {
    done++;
    gsap.to(counter, {
      v: (done / tasks.length) * 100,
      duration: 0.5,
      ease: "power1.out",
      overwrite: true,
      onUpdate: () => (shown.value = counter.v),
    });
  };
  tasks.forEach((task) => task.then(advance, advance));

  const started = performance.now();
  await Promise.race([
    Promise.all([Promise.allSettled(tasks), new Promise((r) => setTimeout(r, MIN_MS))]),
    new Promise((r) => setTimeout(r, MAX_MS)),
  ]);

  // Land on 100 before leaving.
  await gsap.to(counter, {
    v: 100,
    duration: Math.max(0.2, Math.min(0.5, (performance.now() - started) / 4000)),
    ease: "power1.out",
    overwrite: true,
    onUpdate: () => (shown.value = counter.v),
  });

  const finish = () => {
    html.classList.remove("is-loading");
    lenis?.start();
    // Honour a #section link now that the page can scroll.
    const hash = window.location.hash;
    const target = hash.length > 1 ? document.querySelector(hash) : null;
    if (target) (lenis ? lenis.scrollTo(target as HTMLElement, { immediate: true, offset: -64 }) : target.scrollIntoView());
  };

  const el = root.value;
  if (!el || !motion) {
    preloaded.value = true;
    if (el) await gsap.to(el, { autoAlpha: 0, duration: 0.3 });
    finish();
    return;
  }

  // Exit: the whole mark (grid + "ej") swells slightly, then shrinks away,
  // and the panel fades. The hero grid starts drawing as the panel fades.
  // Hand the mark from its CSS build animation to GSAP.
  el.classList.add("is-leaving");
  const mark = el.querySelector(".pl-mark");

  const tl = gsap.timeline({ onComplete: finish });
  tl.to(el.querySelectorAll(".pl-meta"), { autoAlpha: 0, y: 8, duration: 0.3, ease: "power2.in" }, 0)
    .to(mark, { scale: 1.12, duration: 0.28, ease: "power2.out" }, 0)
    .to(mark, { scale: 0, autoAlpha: 0, duration: 0.42, ease: "power3.in" }, 0.28)
    .add(() => {
      preloaded.value = true;
    }, 0.6)
    .to(el, { autoAlpha: 0, duration: 0.35, ease: "power1.out" }, 0.62);
});
</script>

<template>
  <div
    ref="root"
    class="site-preloader fixed inset-0 z-[200] place-items-center bg-bg"
    role="status"
    aria-label="Loading"
  >
    <div class="flex flex-col items-center">
      <svg
        viewBox="-1 -1 50 50"
        class="pl-mark h-32 w-32 overflow-visible md:h-40 md:w-40"
        shape-rendering="crispEdges"
        aria-hidden="true"
      >
        <g class="pl-grid">
          <line
            v-for="(x, i) in GRID"
            :key="`v${x}`"
            :x1="x"
            :y1="0"
            :x2="x"
            :y2="48"
            pathLength="1"
            :style="{ '--i': i }"
          />
          <line
            v-for="(y, i) in GRID"
            :key="`h${y}`"
            :x1="0"
            :y1="y"
            :x2="48"
            :y2="y"
            pathLength="1"
            :style="{ '--i': i }"
          />
        </g>
        <rect
          v-for="([c, r], i) in LIT"
          :key="`${c},${r}`"
          class="pl-px"
          :x="c * 8 + 1"
          :y="r * 8 + 1"
          width="6"
          height="6"
          :style="{ '--i': i }"
        />
        <rect
          class="pl-px pl-cursor"
          :x="CURSOR[0] * 8 + 1"
          :y="CURSOR[1] * 8 + 1"
          width="6"
          height="6"
          :style="{ '--i': LIT.length + 1 }"
        />
      </svg>

      <div class="pl-meta mt-10 flex w-40 items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted md:w-48">
        <span>Loading</span>
        <span class="tabular-nums text-fg">{{ percent }}</span>
      </div>
      <div class="pl-meta mt-3 h-px w-40 bg-border md:w-48">
        <div class="h-full origin-left bg-accent-bright" :style="{ transform: `scaleX(${shown / 100})` }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pl-grid line {
  stroke: #45494c;
  /* In viewBox units (≈1px at this size); a non-scaling stroke would measure
     the dash in screen pixels and break the draw-in into fragments. */
  stroke-width: 0.4;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}

.pl-px {
  fill: #f4f1ec;
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

.pl-cursor {
  fill: #c4454a;
}

@media (prefers-reduced-motion: no-preference) {
  .pl-grid line {
    animation: pl-draw 600ms cubic-bezier(0.65, 0, 0.35, 1) both;
    animation-delay: calc(var(--i) * 45ms);
  }

  .pl-px {
    animation: pl-pop 360ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: calc(450ms + var(--i) * 45ms);
  }

  .pl-cursor {
    animation:
      pl-pop 360ms cubic-bezier(0.34, 1.56, 0.64, 1) both calc(450ms + var(--i) * 45ms),
      pl-blink 1.1s steps(1, end) calc(1.4s + var(--i) * 45ms) infinite;
  }
}

.is-leaving .pl-px,
.is-leaving .pl-grid line {
  animation: none;
}

@keyframes pl-draw {
  from {
    stroke-dashoffset: 1;
  }
}

@keyframes pl-pop {
  from {
    opacity: 0;
    transform: scale(0);
  }
}

@keyframes pl-blink {
  50% {
    opacity: 0;
  }
}
</style>
