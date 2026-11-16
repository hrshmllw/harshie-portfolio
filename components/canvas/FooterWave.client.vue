<script setup lang="ts">
/**
 * Footer wave: an XMB-style ribbon (PS3 menu) of thin strands that splits at
 * the cursor. Right of the split the strands flow as one clean wave; left of
 * it they break up into drifting pixels, more scattered the further left.
 * Moving the cursor left gathers more of it into the wave, right scatters it.
 * Without a pointer the split drifts slowly around the middle.
 *
 * Click: nearby pixels burst outward and drift back, and a short sine ripple
 * runs along the strands from the click in both directions, then dies out.
 */
import type { CanvasDrawContext } from "~/composables/useCanvasLoop";

const canvasRef = ref<HTMLCanvasElement | null>(null);

const NEUTRAL = "244, 241, 236";
const ACCENT = "196, 69, 74";
/** Strands (index) drawn in the accent colour. */
const ACCENT_STRANDS = new Set([3, 11]);
/** Alpha levels the segments/pixels are bucketed into, so each draws in few calls. */
const BUCKETS = 10;

// Deterministic per-particle randomness (stable between frames).
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

let split = -1; // smoothed split position (px)
let lastTime = 0;

/** Recent clicks; each fades out within ~1.6s. */
type Burst = { x: number; y: number; t0: number };
let bursts: Burst[] = [];
const BURST_LIFE = 1.6;
const onTap = (point: { x: number; y: number }) => {
  bursts = [...bursts.slice(-2), { x: point.x, y: point.y, t0: lastTime }];
};

/** Ripple: a short sine packet travelling out from the click along the strands. */
const RIPPLE_SPEED = 520; // px/s
const RIPPLE_WAVELENGTH = 64; // px
const RIPPLE_PACKET = 90; // px, half-width of the packet
const ripple = (x: number, y: number, lag: number) => {
  let off = 0;
  for (const b of bursts) {
    const age = lastTime - b.t0 - lag;
    if (age <= 0 || age > BURST_LIFE) continue;
    const front = age * RIPPLE_SPEED;
    const d = Math.abs(x - b.x);
    const packet = Math.exp(-((d - front) ** 2) / (2 * RIPPLE_PACKET * RIPPLE_PACKET));
    const near = Math.exp(-((y - b.y) ** 2) / (2 * 120 * 120));
    const fade = Math.exp(-age * 2.2);
    off += 12 * packet * near * fade * Math.sin(((d - front) / RIPPLE_WAVELENGTH) * Math.PI * 2);
  }
  return off;
};

/** Outward push for a pixel near a click: snaps out fast, eases back. */
const burstPush = (x: number, y: number) => {
  let px = 0;
  let py = 0;
  for (const b of bursts) {
    const age = lastTime - b.t0;
    if (age < 0 || age > BURST_LIFE) continue;
    const dx = x - b.x;
    const dy = y - b.y;
    const dist = Math.hypot(dx, dy) || 1;
    const falloff = Math.exp(-(dist * dist) / (2 * 120 * 120));
    const envelope = (1 - Math.exp(-age * 14)) * Math.exp(-age * 2.4);
    const force = 70 * falloff * envelope;
    px += (dx / dist) * force;
    py += (dy / dist) * force;
  }
  return { px, py };
};

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const draw = ({ ctx, width, height, time, pointer, reducedMotion }: CanvasDrawContext) => {
  ctx.clearRect(0, 0, width, height);

  // Soft vertical wash so the wave sits in atmosphere.
  const wash = ctx.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0, "rgba(42, 46, 49, 0)");
  wash.addColorStop(0.35, "rgba(42, 46, 49, 0.2)");
  wash.addColorStop(1, "rgba(20, 12, 14, 0.55)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  const mobile = width < 768;
  const t = reducedMotion ? 0 : time;
  const dt = Math.min(0.05, Math.max(0, time - lastTime));
  lastTime = time;
  bursts = bursts.filter((b) => time - b.t0 <= BURST_LIFE);

  // Split: follows the pointer, else drifts around the middle.
  const idle = width * (0.48 + Math.sin(t * 0.18) * 0.16);
  const target = pointer.isInside && !reducedMotion ? pointer.x : idle;
  if (split < 0 || reducedMotion) split = target;
  else split += (target - split) * Math.min(1, dt * 4);
  /** Width of the zone over which strands go from wave to fully scattered. */
  const ramp = width * (mobile ? 0.4 : 0.26);

  const strands = mobile ? 10 : 16;
  const step = mobile ? 14 : 9;
  const cols = Math.ceil(width / step) + 2;
  const base = height * 0.56;
  const amp = height * 0.13;
  const thickness = height * (mobile ? 0.16 : 0.2);

  // Bucketed paths: [colour][alpha bucket]
  const lines = [NEUTRAL, ACCENT].map(() => Array.from({ length: BUCKETS }, () => new Path2D()));
  const pixels = [NEUTRAL, ACCENT].map(() => Array.from({ length: BUCKETS }, () => [] as number[]));

  for (let s = 0; s < strands; s++) {
    const v = s / (strands - 1) - 0.5; // -0.5..0.5 across the ribbon
    const colour = ACCENT_STRANDS.has(s) && !(mobile && s > 9) ? 1 : 0;
    let prevX = 0;
    let prevY = 0;
    let prevA = 0;

    for (let c = 0; c < cols; c++) {
      const x = (c - 1) * step;
      // Ribbon surface: a travelling wave whose width breathes, so the strands
      // fan out and bunch together as it "twists".
      const spread = Math.cos(x * 0.0021 - t * 0.35 + 0.8) * 0.85 + 0.25 * Math.sin(x * 0.0057 + t * 0.2);
      const yWave =
        base +
        Math.sin(x * 0.0034 + t * 0.42 + v * 0.9) * amp +
        Math.sin(x * 0.0078 - t * 0.27 + v * 1.7) * amp * 0.28 +
        v * thickness * spread;
      const y = bursts.length && !reducedMotion ? yWave + ripple(x, yWave, Math.abs(v) * 0.08) : yWave;

      // 0 = in the wave, 1 = fully scattered.
      // The transition zone is centred on the split, so the merge sits under the cursor.
      const scatter = smoothstep(-0.5, 0.5, (split - x) / ramp);
      const seed = s * 1013 + c * 7.31;

      if (scatter < 0.999) {
        const a = (1 - scatter) * (1 - scatter);
        if (c > 0) {
          const bucket = Math.min(BUCKETS - 1, Math.floor(((a + prevA) / 2) * BUCKETS));
          if (bucket > 0) {
            const path = lines[colour][bucket];
            path.moveTo(prevX, prevY);
            path.lineTo(x, y);
          }
        }
        prevA = a;
      } else {
        prevA = 0;
      }
      prevX = x;
      prevY = y;

      // Pixels: a sparse subset rides the strand, then flies loose as it scatters.
      if (scatter > 0.02 && rand(seed) < (mobile ? 0.55 : 0.42)) {
        const drift = t * (0.3 + rand(seed + 1) * 0.5);
        const dx = (rand(seed + 2) - 0.5) * 140 * scatter + Math.sin(drift + seed) * 14 * scatter;
        const dy =
          (rand(seed + 3) - 0.5) * height * 0.62 * scatter +
          Math.cos(drift * 1.3 + seed) * 18 * scatter;
        const a = Math.min(1, scatter * 1.4) * (0.35 + rand(seed + 4) * 0.65);
        const size = 2 + Math.round(rand(seed + 5) * 2 + scatter * 1.5);
        const pc = colour || (rand(seed + 6) < 0.06 ? 1 : 0);
        const bucket = Math.min(BUCKETS - 1, Math.floor(a * BUCKETS));
        let fx = x + dx;
        let fy = y + dy;
        if (bursts.length && !reducedMotion) {
          const { px, py } = burstPush(fx, fy);
          fx += px;
          fy += py;
        }
        if (bucket > 0) pixels[pc][bucket].push(Math.round(fx), Math.round(fy), size);
      }
    }
  }

  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = 1;
  [NEUTRAL, ACCENT].forEach((rgb, colour) => {
    const strength = colour ? 0.75 : 0.26;
    for (let b = 1; b < BUCKETS; b++) {
      ctx.strokeStyle = `rgba(${rgb}, ${((b + 0.5) / BUCKETS) * strength})`;
      ctx.stroke(lines[colour][b]);
    }
  });
  ctx.globalCompositeOperation = "source-over";

  [NEUTRAL, ACCENT].forEach((rgb, colour) => {
    const strength = colour ? 0.9 : 0.5;
    for (let b = 1; b < BUCKETS; b++) {
      const list = pixels[colour][b];
      if (!list.length) continue;
      ctx.fillStyle = `rgba(${rgb}, ${((b + 0.5) / BUCKETS) * strength})`;
      for (let i = 0; i < list.length; i += 3) {
        ctx.fillRect(list[i], list[i + 1], list[i + 2], list[i + 2]);
      }
    }
  });
};

useCanvasLoop({ canvasRef, draw, onTap });
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none absolute inset-0 h-full w-full"
    aria-hidden="true"
  />
</template>
