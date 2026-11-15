<script setup lang="ts">
type Pt = { x: number; y: number };

type TracerState =
  | "idle"
  | "collapsing"
  | "traveling"
  | "tracing"
  | "framed"
  | "absorbed"
  | "emerging"
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
/** Overlaps logo halo expand so the traveling core melts into the mark glow. */
const MERGE_MS = 280;
const EMERGE_MS = 80;
const STOP_DEBOUNCE_MS = 70;
const CROSSFADE_START = 0.85;
const HOP_MS_MIN = 180;
const HOP_MS_MAX = 380;

const emit = defineEmits<{
  "absorb-change": [absorbed: boolean];
}>();

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
/** Recent pointer samples so absorb/bloom can start from the approach path, not the already-hovered target. */
const pointerTrail: { t: number; x: number; y: number }[] = [];
const TRAIL_MS = 180;
const APPROACH_MIN_DIST = 40;
let pathLength = 0;
let framedStart: Pt = { x: 0, y: 0 };
let absorbTarget: Pt = { x: 0, y: 0 };
let currentItem: HTMLElement | null = null;
let absorbEl: Element | null = null;
let absorbHost: Element | null = null;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const hopDuration = (from: Pt, to: Pt) => {
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  return clamp(dist / 2.5, HOP_MS_MIN, HOP_MS_MAX);
};

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

const setAbsorbed = (value: boolean) => {
  emit("absorb-change", value);
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

const toClient = (local: Pt): Pt | null => {
  const header = getHeader();
  if (!header) return null;
  const rect = header.getBoundingClientRect();
  return {
    x: local.x + rect.left,
    y: local.y + rect.top,
  };
};

const pushTrail = (x: number, y: number) => {
  const now = performance.now();
  pointerTrail.push({ t: now, x, y });
  while (
    pointerTrail.length > 1 &&
    now - pointerTrail[0].t > TRAIL_MS
  ) {
    pointerTrail.shift();
  }
};

/** Prefer a recent point along the approach path, not the hover target itself. */
const resolveApproachClient = (enterX: number, enterY: number): Pt => {
  for (const p of pointerTrail) {
    if (Math.hypot(p.x - enterX, p.y - enterY) >= APPROACH_MIN_DIST) {
      return { x: p.x, y: p.y };
    }
  }
  if (pointerTrail.length > 0) {
    return { x: pointerTrail[0].x, y: pointerTrail[0].y };
  }
  return { x: enterX, y: enterY };
};

/**
 * The logo pixel node can be replaced while hovering (AppLogo re-keys it to
 * restart the blink), so resolve it live from the host button instead of
 * trusting a stored reference.
 */
const resolveAbsorbEl = (): Element | null => {
  if (absorbEl && absorbEl.isConnected) return absorbEl;
  const fresh = absorbHost?.querySelector(".logo-cursor") ?? null;
  if (fresh) absorbEl = fresh;
  return fresh;
};

const elementCenterLocal = (el: Element | null): Pt | null => {
  if (!el || !el.isConnected) return null;
  const header = getHeader();
  if (!header) return null;
  const headerRect = header.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  // A detached or hidden node reports an empty rect at (0, 0) — never use it.
  if (r.width === 0 && r.height === 0) return null;
  return {
    x: r.left + r.width / 2 - headerRect.left,
    y: r.top + r.height / 2 - headerRect.top,
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

const dotFromMorph = (m: number) => {
  if (m < CROSSFADE_START) return 0;
  return clamp01((m - CROSSFADE_START) / (1 - CROSSFADE_START));
};

const onPointerMove = (event: PointerEvent) => {
  liveClient = { x: event.clientX, y: event.clientY };
  pushTrail(event.clientX, event.clientY);
  if (state === "blooming") {
    updateCoreFromLive();
  }
};

const runReducedStart = (itemEl: HTMLElement, local: Pt) => {
  setAbsorbed(false);
  absorbEl = null;
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

const runReducedAbsorb = (targetEl: Element) => {
  clearPath();
  hideDot();
  setMorph(1);
  updateCoreFromLive();
  absorbEl = targetEl;
  const center = elementCenterLocal(targetEl);
  if (center) absorbTarget = center;
  currentItem = null;
  state = "absorbed";
  setAbsorbed(true);
};

const runReducedStop = () => {
  setAbsorbed(false);
  clearPath();
  hideDot();
  setMorph(0);
  state = "idle";
  currentItem = null;
  absorbEl = null;
};

const animateCollapsePhase = (
  id: number,
  onDone: (fromLocal: Pt) => void,
  /** When set, collapse stays pinned here instead of chasing the live cursor. */
  frozenClient?: Pt,
) => {
  const useGlow = glowAvailable.value;
  state = "collapsing";

  const originClient = frozenClient
    ? { ...frozenClient }
    : { ...liveClient };
  setCorePos(originClient.x, originClient.y);

  const morphStart = morph.value;
  const collapseDuration = Math.max(40, COLLAPSE_MS * (1 - morphStart));
  const t0 = performance.now();

  const tick = (now: number) => {
    if (id !== runId) return;
    const elapsed = now - t0;

    const clientNow = frozenClient
      ? originClient
      : { ...liveClient };
    if (!frozenClient) {
      setCorePos(clientNow.x, clientNow.y);
    } else {
      setCorePos(originClient.x, originClient.y);
    }

    if (elapsed < collapseDuration) {
      const u = easeInOutCubic(elapsed / collapseDuration);
      const m = lerp(morphStart, 1, u);
      setMorph(m);

      const localNow =
        toHeaderLocal(clientNow.x, clientNow.y) ?? {
          x: dotX.value,
          y: dotY.value,
        };
      if (useGlow) {
        const o = dotFromMorph(m);
        setDotAt(localNow, o, o);
      } else {
        setDotAt(localNow, u, u);
      }
      rafId = requestAnimationFrame(tick);
      return;
    }

    setMorph(1);
    const localNow =
      toHeaderLocal(clientNow.x, clientNow.y) ?? {
        x: dotX.value,
        y: dotY.value,
      };
    setDotAt(localNow, 1, 1);
    onDone(localNow);
  };

  rafId = requestAnimationFrame(tick);
};

const animateCollapseThenTravelTrace = (
  itemEl: HTMLElement,
  id: number,
) => {
  currentItem = itemEl;
  absorbEl = null;
  setAbsorbed(false);

  // Seed path early so length is ready after collapse; keep dash hidden.
  const local = toHeaderLocal(liveClient.x, liveClient.y);
  if (!local) return;
  const startPt = preparePath(itemEl, local);
  if (!startPt) return;
  framedStart = startPt;
  dashOffset.value = 1e6;
  pathOpacity.value = 0;

  nextTick(() => {
    if (id !== runId) return;
    const length = syncPathLength();
    dashOffset.value = length;
    pathOpacity.value = 0;

    animateCollapsePhase(id, (fromLocal) => {
      if (id !== runId) return;

      let travelTarget = startPt;
      const rebuilt = preparePath(itemEl, fromLocal);
      if (rebuilt) travelTarget = rebuilt;
      framedStart = travelTarget;
      pathOpacity.value = 1;
      nextTick(() => {
        if (id !== runId) return;
        syncPathLength();
        dashOffset.value = pathLength;
      });

      const travelFrom = { ...fromLocal };
      const tTravel = performance.now();

      const tick = (now: number) => {
        if (id !== runId) return;
        const travelElapsed = now - tTravel;
        const len = pathLength || length;

        if (travelElapsed < TRAVEL_MS) {
          state = "traveling";
          const u = easeOutCubic(travelElapsed / TRAVEL_MS);
          setDotAt(
            {
              x: lerp(travelFrom.x, travelTarget.x, u),
              y: lerp(travelFrom.y, travelTarget.y, u),
            },
            1,
            1,
          );
          rafId = requestAnimationFrame(tick);
          return;
        }

        const traceElapsed = travelElapsed - TRAVEL_MS;
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

        dashOffset.value = 0;
        setDotAt(travelTarget, 1, 1);
        framedStart = travelTarget;
        state = "framed";
        rafId = 0;
      };

      rafId = requestAnimationFrame(tick);
    });
  });
};

const animateCollapseThenAbsorb = (
  targetEl: Element,
  id: number,
  approachClient: Pt,
) => {
  currentItem = null;
  absorbEl = targetEl;
  clearPath();

  // Pin collapse to the approach point so the glow shrinks from where the
  // cursor came from (usually the hero), then travels into the logo pixel.
  animateCollapsePhase(
    id,
    (fromLocal) => {
      if (id !== runId) return;

      const target = elementCenterLocal(targetEl) ?? fromLocal;
      absorbTarget = target;
      const travelFrom = { ...fromLocal };
      const moveMs = Math.max(
        TRAVEL_MS,
        hopDuration(travelFrom, target),
      );
      const tTravel = performance.now();
      let mergeStarted = false;

      const tick = (now: number) => {
        if (id !== runId) return;
        const elapsed = now - tTravel;

        if (elapsed < moveMs) {
          state = "traveling";
          const u = easeOutCubic(elapsed / moveMs);
          const pos = {
            x: lerp(travelFrom.x, target.x, u),
            y: lerp(travelFrom.y, target.y, u),
          };
          // Keep canvas core on the traveling dot so the handoff stays continuous
          const client = toClient(pos);
          if (client) setCorePos(client.x, client.y);

          const mergeStart = Math.max(0, moveMs - MERGE_MS);
          let opacity = 1;
          let scale = 1;
          if (elapsed >= mergeStart) {
            // Logo glow expands from the j-dot while the tracer core dissolves into it.
            if (!mergeStarted) {
              mergeStarted = true;
              setAbsorbed(true);
            }
            const mu = clamp01((elapsed - mergeStart) / MERGE_MS);
            opacity = 1 - mu;
            scale = 1 - mu * 0.55;
          }
          setDotAt(pos, scale, opacity);
          rafId = requestAnimationFrame(tick);
          return;
        }

        hideDot();
        const endClient = toClient(target);
        if (endClient) setCorePos(endClient.x, endClient.y);
        framedStart = { ...target };
        absorbTarget = target;
        state = "absorbed";
        if (!mergeStarted) setAbsorbed(true);
        rafId = 0;
      };

      rafId = requestAnimationFrame(tick);
    },
    approachClient,
  );
};

const animateHopToFrame = (itemEl: HTMLElement, id: number) => {
  const wasAbsorbed = state === "absorbed" || state === "emerging";
  const startFrom = wasAbsorbed
    ? { ...absorbTarget }
    : { x: dotX.value, y: dotY.value };

  state = "hopping";
  setAbsorbed(false);

  if (wasAbsorbed) {
    setDotAt(absorbTarget, 0, 0);
  }

  const local = toHeaderLocal(liveClient.x, liveClient.y) ?? startFrom;
  const nextStart = preparePath(itemEl, local);
  if (!nextStart) return;
  currentItem = itemEl;
  absorbEl = null;

  const moveMs = hopDuration(startFrom, nextStart);
  const t0 = performance.now();

  nextTick(() => {
    if (id !== runId) return;
    const length = syncPathLength();
    dashOffset.value = length;
    pathOpacity.value = 0;

    const tick = (now: number) => {
      if (id !== runId) return;
      const elapsed = now - t0;

      // Brief emerge if coming from absorbed
      const emergeMs = wasAbsorbed ? EMERGE_MS : 0;
      if (elapsed < emergeMs) {
        const u = easeOutCubic(elapsed / emergeMs);
        setDotAt(absorbTarget, u, u);
        rafId = requestAnimationFrame(tick);
        return;
      }

      const afterEmerge = elapsed - emergeMs;
      if (afterEmerge < HOP_FADE_MS) {
        pathOpacity.value = 0;
        setDotAt(startFrom, 1, 1);
        rafId = requestAnimationFrame(tick);
        return;
      }

      const moveElapsed = afterEmerge - HOP_FADE_MS;
      if (moveElapsed < moveMs) {
        const u = easeOutCubic(moveElapsed / moveMs);
        setDotAt(
          {
            x: lerp(startFrom.x, nextStart.x, u),
            y: lerp(startFrom.y, nextStart.y, u),
          },
          1,
          1,
        );
        pathOpacity.value = 0;
        dashOffset.value = length;
        rafId = requestAnimationFrame(tick);
        return;
      }

      pathOpacity.value = 1;
      const traceElapsed = moveElapsed - moveMs;
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

const animateHopToAbsorb = (targetEl: Element, id: number) => {
  state = "hopping";
  currentItem = null;
  absorbEl = targetEl;

  const fromDot = { x: dotX.value, y: dotY.value };
  const target = elementCenterLocal(targetEl) ?? fromDot;
  absorbTarget = target;
  const moveMs = hopDuration(fromDot, target);
  const t0 = performance.now();
  let mergeStarted = false;

  // Fade path out while hopping
  pathOpacity.value = Math.min(pathOpacity.value, 1);

  const tick = (now: number) => {
    if (id !== runId) return;
    const elapsed = now - t0;

    if (elapsed < HOP_FADE_MS) {
      const u = elapsed / HOP_FADE_MS;
      pathOpacity.value = Math.max(0, pathOpacity.value) * (1 - u);
      setDotAt(fromDot, 1, 1);
      rafId = requestAnimationFrame(tick);
      return;
    }

    clearPath();
    const moveElapsed = elapsed - HOP_FADE_MS;
    if (moveElapsed < moveMs) {
      const u = easeOutCubic(moveElapsed / moveMs);
      const mergeStart = Math.max(0, moveMs - MERGE_MS);
      let opacity = 1;
      let scale = 1;
      if (moveElapsed >= mergeStart) {
        if (!mergeStarted) {
          mergeStarted = true;
          setAbsorbed(true);
        }
        const mu = clamp01((moveElapsed - mergeStart) / MERGE_MS);
        opacity = 1 - mu;
        scale = 1 - mu * 0.55;
      }
      setDotAt(
        {
          x: lerp(fromDot.x, target.x, u),
          y: lerp(fromDot.y, target.y, u),
        },
        scale,
        opacity,
      );
      rafId = requestAnimationFrame(tick);
      return;
    }

    hideDot();
    framedStart = { ...target };
    absorbTarget = target;
    state = "absorbed";
    if (!mergeStarted) setAbsorbed(true);
    rafId = 0;
  };

  rafId = requestAnimationFrame(tick);
};

const animateLeaveFromFrame = (id: number) => {
  const useGlow = glowAvailable.value || morph.value > 0.01;
  const length = pathLength || dashArray.value;
  const pathEl = pathRef.value;
  const t0 = performance.now();

  const startOffset = dashOffset.value;
  const drawn = length > 0 ? length - startOffset : 0;

  if (length <= 0 || pathOpacity.value <= 0) {
    framedStart = { x: dotX.value, y: dotY.value };
  }

  const tick = (now: number) => {
    if (id !== runId) return;
    const elapsed = now - t0;

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

    if (pathOpacity.value > 0) {
      dashOffset.value = length;
      pathOpacity.value = 0;
    }
    clearPath();

    const afterUnwind = Math.max(0, elapsed - UNWIND_MS);
    runReturnAndBloom(id, afterUnwind, useGlow, now - afterUnwind);
  };

  rafId = requestAnimationFrame(tick);
};

const runReturnAndBloom = (
  id: number,
  initialElapsed: number,
  useGlow: boolean,
  t0: number,
) => {
  // Aim at where the pointer is when the return starts, then keep re-targeting
  // so the exit path reads as "back toward the cursor" rather than a sideways drift.
  const tick = (now: number) => {
    if (id !== runId) return;
    const elapsed = now - t0 + initialElapsed;

    if (elapsed < RETURN_MS) {
      state = "returning";
      const u = easeOutCubic(elapsed / RETURN_MS);
      const target = toHeaderLocal(liveClient.x, liveClient.y);
      if (target) {
        const from = framedStart;
        const pos = {
          x: lerp(from.x, target.x, u),
          y: lerp(from.y, target.y, u),
        };
        setDotAt(pos, 1, 1);
        // Core rides the traveling dot so bloom starts from that path, not the logo.
        const client = toClient(pos);
        if (client) setCorePos(client.x, client.y);
      }
      rafId = requestAnimationFrame(tick);
      return;
    }

    const afterReturn = elapsed - RETURN_MS;
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
    absorbEl = null;
    rafId = 0;
  };

  rafId = requestAnimationFrame(tick);
};

const animateLeaveFromAbsorbed = (id: number) => {
  const useGlow = glowAvailable.value || morph.value > 0.01;
  setAbsorbed(false);
  state = "emerging";

  // Refresh absorb target from live element if possible
  const liveCenter = elementCenterLocal(resolveAbsorbEl());
  if (liveCenter) absorbTarget = liveCenter;

  const emergeFrom = { ...absorbTarget };
  framedStart = { ...emergeFrom };
  const emergeClient = toClient(emergeFrom);
  if (emergeClient) setCorePos(emergeClient.x, emergeClient.y);
  const t0 = performance.now();

  const tick = (now: number) => {
    if (id !== runId) return;
    const elapsed = now - t0;

    if (elapsed < EMERGE_MS) {
      const u = easeOutCubic(elapsed / EMERGE_MS);
      setDotAt(emergeFrom, u, u);
      if (emergeClient) setCorePos(emergeClient.x, emergeClient.y);
      rafId = requestAnimationFrame(tick);
      return;
    }

    setDotAt(emergeFrom, 1, 1);
    absorbEl = null;
    // Continue with return + bloom (no unwind)
    runReturnAndBloom(id, 0, useGlow, performance.now());
  };

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

  const fromAbsorbed = state === "absorbed" || state === "emerging";
  const hopStates: TracerState[] = [
    "framed",
    "tracing",
    "unwinding",
    "traveling",
    "hopping",
  ];
  const shouldHop =
    fromAbsorbed || (hopStates.includes(state) && currentItem !== itemEl);

  cancelRaf();
  const id = ++runId;

  if (shouldHop) {
    animateHopToFrame(itemEl, id);
    return;
  }

  animateCollapseThenTravelTrace(itemEl, id);
};

const startAbsorb = (
  targetEl: Element,
  clientX: number,
  clientY: number,
) => {
  liveClient = { x: clientX, y: clientY };
  pushTrail(clientX, clientY);
  clearStopTimer();

  if (prefersReducedMotion()) {
    cancelRaf();
    runId += 1;
    runReducedAbsorb(targetEl);
    return;
  }

  absorbHost = targetEl.closest("button") ?? targetEl.parentElement;

  // Already absorbed into the logo cursor — stay
  if (state === "absorbed" && absorbEl && absorbEl.isConnected) {
    return;
  }

  const fromFrame: TracerState[] = [
    "framed",
    "tracing",
    "unwinding",
    "traveling",
    "hopping",
  ];
  const shouldHop = fromFrame.includes(state);

  cancelRaf();
  const id = ++runId;

  if (shouldHop) {
    animateHopToAbsorb(targetEl, id);
    return;
  }

  const approach = resolveApproachClient(clientX, clientY);
  animateCollapseThenAbsorb(targetEl, id, approach);
};

const stop = () => {
  clearStopTimer();

  if (prefersReducedMotion()) {
    cancelRaf();
    runId += 1;
    runReducedStop();
    return;
  }

  stopTimer = window.setTimeout(() => {
    stopTimer = 0;
    cancelRaf();
    const id = ++runId;

    if (state === "absorbed" || state === "emerging") {
      animateLeaveFromAbsorbed(id);
      return;
    }

    animateLeaveFromFrame(id);
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
  setAbsorbed(false);
});

defineExpose({ start, startAbsorb, stop });
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
