<script setup lang="ts">
type Pt = { x: number; y: number };

type TracerState =
  | "idle"
  | "collapsing"
  | "traveling"
  | "tracing"
  | "framed"
  | "unwinding"
  | "returning"
  | "blooming"
  | "hopping";

const COLLAPSE_MS = 320;
const TRAVEL_MS = 160;
const TRACE_MS = 420;
const UNWIND_MS = 220;
const RETURN_MS = 160;
const BLOOM_MS = 320;
const HOP_FADE_MS = 120;
const HOP_MOVE_MS = 180;
const STOP_DEBOUNCE_MS = 70;
const CROSSFADE_START = 0.85;

const rootRef = ref<HTMLElement | null>(null);
const pathRef = ref<SVGPathElement | null>(null);

const { morph, glowAvailable, setMorph, setCorePos } = useGlowMorph();

const pathD = ref("");
const dashArray = ref(0);
const dashOffset = ref(0);
const pathOpacity = ref(0);
const dotX = ref(0);
const dotY = ref(0);
const dotScale = ref(0);
const dotOpacity = ref(0);

let state: TracerState = "idle";
let rafId = 0;
let stopTimer = 0;
let runId = 0;

let liveClient: Pt = { x: 0, y: 0 };
let pathLength = 0;
let framedStart: Pt = { x: 0, y: 0 };
let currentItem: HTMLElement | null = null;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const cancelRaf = () => {
  cancelAnimationFrame(rafId);
  rafId = 0;
};

const clearStopTimer = () => {
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = 0;
  }
};

const hideDot = () => {
  dotScale.value = 0;
  dotOpacity.value = 0;
};

const clearPath = () => {
  pathD.value = "";
  pathOpacity.value = 0;
  dashArray.value = 0;
  dashOffset.value = 0;
  pathLength = 0;
};

const getHeader = () => {
  const overlay = rootRef.value;
  if (!overlay) return null;
  return (
    (overlay.closest("header") as HTMLElement | null) ??
    (overlay.parentElement as HTMLElement | null)
  );
};

const toHeaderLocal = (clientX: number, clientY: number): Pt | null => {
  const header = getHeader();
  if (!header) return null;
  const rect = header.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};

const measureItem = (itemEl: HTMLElement) => {
  const header = getHeader();
  if (!header) return null;
  const headerRect = header.getBoundingClientRect();
  const inner =
    (itemEl.querySelector(".nav-link-inner") as HTMLElement | null) ?? itemEl;
  const ir = inner.getBoundingClientRect();
  return {
    l: ir.left - headerRect.left,
    t: ir.top - headerRect.top,
    r: ir.right - headerRect.left,
    b: ir.bottom - headerRect.top,
  };
};

const nearestOnPerimeter = (
  px: number,
  py: number,
  l: number,
  t: number,
  r: number,
  b: number,
): Pt => {
  const edges: [Pt, Pt][] = [
    [
      { x: l, y: t },
      { x: r, y: t },
    ],
    [
      { x: r, y: t },
      { x: r, y: b },
    ],
    [
      { x: r, y: b },
      { x: l, y: b },
    ],
    [
      { x: l, y: b },
      { x: l, y: t },
    ],
  ];

  let best: Pt = edges[0][0];
  let bestDist = Infinity;

  for (const [a, c] of edges) {
    const dx = c.x - a.x;
    const dy = c.y - a.y;
    const len2 = dx * dx + dy * dy;
    let u = len2 === 0 ? 0 : ((px - a.x) * dx + (py - a.y) * dy) / len2;
    u = Math.max(0, Math.min(1, u));
    const qx = a.x + u * dx;
    const qy = a.y + u * dy;
    const d = Math.hypot(px - qx, py - qy);
    if (d < bestDist) {
      bestDist = d;
      best = { x: qx, y: qy };
    }
  }

  return best;
};

const edgeIndexForPoint = (
  p: Pt,
  l: number,
  t: number,
  r: number,
  b: number,
) => {
  const eps = 0.75;
  if (Math.abs(p.y - t) <= eps) return 0;
  if (Math.abs(p.x - r) <= eps) return 1;
  if (Math.abs(p.y - b) <= eps) return 2;
  return 3;
};

const buildClockwisePath = (
  l: number,
  t: number,
  r: number,
  b: number,
  start: Pt,
) => {
  const corners: Pt[] = [
    { x: l, y: t },
    { x: r, y: t },
    { x: r, y: b },
    { x: l, y: b },
  ];
  const edge = edgeIndexForPoint(start, l, t, r, b);
  const nextCorner = (edge + 1) % 4;
  const pts: Pt[] = [start];
  for (let i = 0; i < 4; i++) {
    pts.push(corners[(nextCorner + i) % 4]);
  }
  pts.push(start);

  return (
    pts
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
      )
      .join(" ") + " Z"
  );
};

const preparePath = (itemEl: HTMLElement, fromLocal: Pt) => {
  const box = measureItem(itemEl);
  if (!box) return null;
  const startPt = nearestOnPerimeter(
    fromLocal.x,
    fromLocal.y,
    box.l,
    box.t,
    box.r,
    box.b,
  );
  const d = buildClockwisePath(box.l, box.t, box.r, box.b, startPt);
  pathD.value = d;
  pathOpacity.value = 1;
  return startPt;
};

const syncPathLength = () => {
  const pathEl = pathRef.value;
  if (!pathEl) return 0;
  const length = pathEl.getTotalLength();
  pathLength = length;
  dashArray.value = length;
  return length;
};

const setDotAt = (p: Pt, scale = 1, opacity = 1) => {
  dotX.value = p.x;
  dotY.value = p.y;
  dotScale.value = scale;
  dotOpacity.value = opacity;
};

const updateCoreFromLive = () => {
  setCorePos(liveClient.x, liveClient.y);
};

/** DOM-dot opacity during morph crossfade near the handoff. */
const dotFromMorph = (m: number) => {
  if (m < CROSSFADE_START) return 0;
  return clamp01((m - CROSSFADE_START) / (1 - CROSSFADE_START));
};

const onPointerMove = (event: PointerEvent) => {
  liveClient = { x: event.clientX, y: event.clientY };
  if (
    state === "collapsing" ||
    state === "blooming" ||
    state === "returning"
  ) {
    updateCoreFromLive();
  }
};

const runReducedStart = (itemEl: HTMLElement, local: Pt) => {
  const startPt = preparePath(itemEl, local);
  if (!startPt) return;
  nextTick(() => {
    syncPathLength();
    dashOffset.value = 0;
    hideDot();
    setMorph(1);
    updateCoreFromLive();
    state = "framed";
    framedStart = startPt;
    currentItem = itemEl;
  });
};

const runReducedStop = () => {
  clearPath();
  hideDot();
  setMorph(0);
  state = "idle";
  currentItem = null;
};

const animateCollapseThenTravelTrace = (
  itemEl: HTMLElement,
  id: number,
) => {
  const useGlow = glowAvailable.value;
  state = "collapsing";
  updateCoreFromLive();

  const morphStart = morph.value;
  const collapseDuration = Math.max(40, COLLAPSE_MS * (1 - morphStart));
  const t0 = performance.now();

  // Seed path early so length is ready after collapse; keep dash hidden.
  const local = toHeaderLocal(liveClient.x, liveClient.y);
  if (!local) return;
  const startPt = preparePath(itemEl, local);
  if (!startPt) return;
  framedStart = startPt;
  currentItem = itemEl;
  dashOffset.value = 1e6;
  pathOpacity.value = 0;

  let travelFrom: Pt | null = null;
  let travelTarget = startPt;
  let collapseDoneAt = 0;

  nextTick(() => {
    if (id !== runId) return;
    const length = syncPathLength();
    dashOffset.value = length;
    pathOpacity.value = 0;

    const tick = (now: number) => {
      if (id !== runId) return;
      const elapsed = now - t0;

      if (elapsed < collapseDuration) {
        state = "collapsing";
        const u = easeInOutCubic(elapsed / collapseDuration);
        const m = lerp(morphStart, 1, u);
        setMorph(m);
        updateCoreFromLive();

        const localNow = toHeaderLocal(liveClient.x, liveClient.y);
        if (localNow) {
          if (useGlow) {
            // Crossfade in near morph 0.85
            const o = dotFromMorph(m);
            setDotAt(localNow, o, o);
          } else {
            setDotAt(localNow, u, u);
          }
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Collapse done — capture travel endpoints once, rebuild path from live cursor
      if (!travelFrom) {
        collapseDoneAt = now;
        setMorph(1);
        const localNow =
          toHeaderLocal(liveClient.x, liveClient.y) ?? {
            x: dotX.value,
            y: dotY.value,
          };
        travelFrom = { ...localNow };
        const rebuilt = preparePath(itemEl, localNow);
        if (rebuilt) travelTarget = rebuilt;
        framedStart = travelTarget;
        nextTick(() => {
          if (id !== runId) return;
          syncPathLength();
          dashOffset.value = pathLength;
          pathOpacity.value = 1;
        });
        pathOpacity.value = 1;
        dashOffset.value = length;
        setDotAt(travelFrom, 1, 1);
      }

      const travelElapsed = now - collapseDoneAt;
      if (travelElapsed < TRAVEL_MS) {
        state = "traveling";
        const u = easeOutCubic(travelElapsed / TRAVEL_MS);
        const from = travelFrom ?? travelTarget;
        setDotAt(
          {
            x: lerp(from.x, travelTarget.x, u),
            y: lerp(from.y, travelTarget.y, u),
          },
          1,
          1,
        );
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Trace
      const traceElapsed = travelElapsed - TRAVEL_MS;
      const len = pathLength || length;
      if (traceElapsed < TRACE_MS) {
        state = "tracing";
        const pathEl = pathRef.value;
        const u = easeOutCubic(clamp01(traceElapsed / TRACE_MS));
        const dist = len * u;
        dashOffset.value = len - dist;
        if (pathEl) {
          const pt = pathEl.getPointAtLength(Math.min(dist, len));
          setDotAt(pt, 1, 1);
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Framed — keep dot parked at start for unwind
      dashOffset.value = 0;
      setDotAt(travelTarget, 1, 1);
      framedStart = travelTarget;
      state = "framed";
      rafId = 0;
    };

    rafId = requestAnimationFrame(tick);
  });
};

const animateHop = (itemEl: HTMLElement, id: number) => {
  state = "hopping";
  const fromDot = { x: dotX.value, y: dotY.value };
  const t0 = performance.now();

  const local = toHeaderLocal(liveClient.x, liveClient.y) ?? fromDot;
  const nextStart = preparePath(itemEl, local);
  if (!nextStart) return;
  currentItem = itemEl;

  nextTick(() => {
    if (id !== runId) return;
    const length = syncPathLength();
    dashOffset.value = length;
    // Keep old visual: we already replaced pathD — fade new path in after move.
    // For hop: fade old path out first while keeping previous visual.
    // Since pathD was replaced, fade the new path from 0 while moving the dot.
    pathOpacity.value = 0;

    const tick = (now: number) => {
      if (id !== runId) return;
      const elapsed = now - t0;

      if (elapsed < HOP_FADE_MS) {
        // Brief beat while the previous path fades; path already swapped.
        pathOpacity.value = 0;
        setDotAt(fromDot, 1, 1);
        rafId = requestAnimationFrame(tick);
        return;
      }

      const moveElapsed = elapsed - HOP_FADE_MS;
      if (moveElapsed < HOP_MOVE_MS) {
        const u = easeOutCubic(moveElapsed / HOP_MOVE_MS);
        setDotAt(
          {
            x: lerp(fromDot.x, nextStart.x, u),
            y: lerp(fromDot.y, nextStart.y, u),
          },
          1,
          1,
        );
        pathOpacity.value = 0;
        dashOffset.value = length;
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Trace new frame
      pathOpacity.value = 1;
      const traceElapsed = moveElapsed - HOP_MOVE_MS;
      if (traceElapsed < TRACE_MS) {
        state = "tracing";
        const pathEl = pathRef.value;
        const u = easeOutCubic(clamp01(traceElapsed / TRACE_MS));
        const dist = length * u;
        dashOffset.value = length - dist;
        if (pathEl) {
          const pt = pathEl.getPointAtLength(Math.min(dist, length));
          setDotAt(pt, 1, 1);
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      dashOffset.value = 0;
      setDotAt(nextStart, 1, 1);
      framedStart = nextStart;
      state = "framed";
      rafId = 0;
    };

    rafId = requestAnimationFrame(tick);
  });
};

const animateLeave = (id: number) => {
  const useGlow = glowAvailable.value || morph.value > 0.01;
  const length = pathLength || dashArray.value;
  const pathEl = pathRef.value;
  const t0 = performance.now();

  // Start unwind from current dash progress
  const startOffset = dashOffset.value;
  const drawn = length > 0 ? length - startOffset : 0;

  const tick = (now: number) => {
    if (id !== runId) return;
    const elapsed = now - t0;

    // Unwind
    if (elapsed < UNWIND_MS && length > 0 && pathOpacity.value > 0) {
      state = "unwinding";
      const u = easeInOutCubic(elapsed / UNWIND_MS);
      const remaining = drawn * (1 - u);
      dashOffset.value = length - remaining;
      if (pathEl && drawn > 0) {
        const pt = pathEl.getPointAtLength(Math.min(remaining, length));
        setDotAt(pt, 1, 1);
      } else {
        setDotAt(framedStart, 1, 1);
      }
      pathOpacity.value = 1 - u * 0.15;
      rafId = requestAnimationFrame(tick);
      return;
    }

    // Ensure unwound
    if (pathOpacity.value > 0) {
      dashOffset.value = length;
      pathOpacity.value = 0;
    }
    clearPath();

    const afterUnwind = Math.max(0, elapsed - UNWIND_MS);

    // Return to live cursor
    if (afterUnwind < RETURN_MS) {
      state = "returning";
      const u = easeOutCubic(afterUnwind / RETURN_MS);
      const target = toHeaderLocal(liveClient.x, liveClient.y);
      updateCoreFromLive();
      if (target) {
        const from = framedStart;
        // Re-target: blend from framedStart toward live cursor each frame
        // by easing from the frozen start toward current live position.
        setDotAt(
          {
            x: lerp(from.x, target.x, u),
            y: lerp(from.y, target.y, u),
          },
          1,
          1,
        );
      }
      rafId = requestAnimationFrame(tick);
      return;
    }

    // Bloom
    const afterReturn = afterUnwind - RETURN_MS;
    if (afterReturn < BLOOM_MS) {
      state = "blooming";
      const u = easeInOutCubic(afterReturn / BLOOM_MS);
      const m = lerp(1, 0, u);
      setMorph(m);
      updateCoreFromLive();

      const localNow = toHeaderLocal(liveClient.x, liveClient.y);
      if (localNow) {
        if (useGlow) {
          const o = dotFromMorph(m);
          setDotAt(localNow, o, o);
        } else {
          const o = 1 - u;
          setDotAt(localNow, o, o);
        }
      }
      rafId = requestAnimationFrame(tick);
      return;
    }

    setMorph(0);
    hideDot();
    clearPath();
    state = "idle";
    currentItem = null;
    rafId = 0;
  };

  // If there was nothing to unwind (already empty), skip straight to return/bloom
  if (length <= 0 || pathOpacity.value <= 0) {
    // Jump timeline past unwind by adjusting — call tick with synthetic offset
    // Simpler: just start return from current dot position
    framedStart = { x: dotX.value, y: dotY.value };
  }

  rafId = requestAnimationFrame(tick);
};

const start = (itemEl: HTMLElement, clientX: number, clientY: number) => {
  liveClient = { x: clientX, y: clientY };
  clearStopTimer();

  if (prefersReducedMotion()) {
    cancelRaf();
    runId += 1;
    runReducedStart(itemEl, toHeaderLocal(clientX, clientY) ?? { x: 0, y: 0 });
    return;
  }

  const hopStates: TracerState[] = [
    "framed",
    "tracing",
    "unwinding",
    "traveling",
    "hopping",
  ];
  const shouldHop = hopStates.includes(state) && currentItem !== itemEl;

  cancelRaf();
  const id = ++runId;

  if (shouldHop) {
    animateHop(itemEl, id);
    return;
  }

  // From idle / collapsing / blooming / returning / same-item restart
  animateCollapseThenTravelTrace(itemEl, id);
};

const stop = () => {
  clearStopTimer();

  if (prefersReducedMotion()) {
    cancelRaf();
    runId += 1;
    runReducedStop();
    return;
  }

  // Debounce so a quick hop to an adjacent item can cancel the leave.
  stopTimer = window.setTimeout(() => {
    stopTimer = 0;
    cancelRaf();
    const id = ++runId;
    animateLeave(id);
  }, STOP_DEBOUNCE_MS);
};

onMounted(() => {
  window.addEventListener("pointermove", onPointerMove, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("pointermove", onPointerMove);
  clearStopTimer();
  cancelRaf();
  runId += 1;
  setMorph(0);
});

defineExpose({ start, stop });
</script>

<template>
  <div
    ref="rootRef"
    class="pointer-events-none absolute inset-0 overflow-visible"
    aria-hidden="true"
  >
    <svg class="absolute inset-0 h-full w-full overflow-visible">
      <path
        ref="pathRef"
        :d="pathD"
        fill="none"
        stroke="currentColor"
        class="text-accent-bright"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        :stroke-dasharray="dashArray || undefined"
        :stroke-dashoffset="dashOffset"
        :opacity="pathOpacity"
      />
    </svg>
    <span
      class="nav-tracer-dot"
      :style="{
        transform: `translate(${dotX}px, ${dotY}px) translate(-50%, -50%) scale(${dotScale})`,
        opacity: dotOpacity,
      }"
    />
  </div>
</template>
