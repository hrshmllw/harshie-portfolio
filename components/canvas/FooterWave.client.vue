<script setup lang="ts">
import type { CanvasDrawContext } from "~/composables/useCanvasLoop";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isMobile = ref(false);

onMounted(() => {
  isMobile.value = window.matchMedia("(max-width: 768px)").matches;
});

type Ribbon = {
  amp: number;
  freq: number;
  speed: number;
  phase: number;
  yBase: number;
  color: string;
  width: number;
};

const ribbons: Ribbon[] = [
  {
    amp: 42,
    freq: 0.0042,
    speed: 0.55,
    phase: 0.2,
    yBase: 0.4,
    color: "rgba(139, 42, 50, 0.75)",
    width: 1.8,
  },
  {
    amp: 30,
    freq: 0.0055,
    speed: 0.72,
    phase: 1.4,
    yBase: 0.48,
    color: "rgba(196, 69, 74, 0.45)",
    width: 1.4,
  },
  {
    amp: 24,
    freq: 0.0068,
    speed: 0.4,
    phase: 2.6,
    yBase: 0.56,
    color: "rgba(167, 167, 167, 0.5)",
    width: 1.2,
  },
  {
    amp: 20,
    freq: 0.0075,
    speed: 0.9,
    phase: 3.8,
    yBase: 0.46,
    color: "rgba(244, 241, 236, 0.35)",
    width: 1.1,
  },
  {
    amp: 36,
    freq: 0.0036,
    speed: 0.35,
    phase: 4.9,
    yBase: 0.62,
    color: "rgba(60, 0, 7, 0.7)",
    width: 1.6,
  },
];

const particles = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 97) % 1000,
  y: ((i * 53) % 100) / 100,
  speed: 0.15 + (i % 5) * 0.05,
  size: 1 + (i % 3) * 0.4,
  alpha: 0.15 + (i % 4) * 0.05,
}));

const draw = ({
  ctx,
  width,
  height,
  time,
  pointer,
  reducedMotion,
}: CanvasDrawContext) => {
  ctx.clearRect(0, 0, width, height);

  // Soft vertical wash so the wave sits in atmosphere
  const wash = ctx.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0, "rgba(42, 46, 49, 0)");
  wash.addColorStop(0.35, "rgba(42, 46, 49, 0.2)");
  wash.addColorStop(1, "rgba(20, 12, 14, 0.55)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  const activeRibbons = isMobile.value ? ribbons.slice(0, 3) : ribbons;
  const step = isMobile.value ? 8 : 5;
  const t = reducedMotion ? 0 : time;

  let bumpX = -1;
  let bumpStrength = 0;
  if (pointer.isInside && !reducedMotion) {
    bumpX = pointer.x;
    bumpStrength = 18;
  }

  ctx.globalCompositeOperation = "lighter";

  for (const ribbon of activeRibbons) {
    ctx.beginPath();
    ctx.lineWidth = ribbon.width;
    ctx.strokeStyle = ribbon.color;

    for (let x = 0; x <= width; x += step) {
      const baseY = height * ribbon.yBase;
      let y =
        baseY +
        Math.sin(x * ribbon.freq + t * ribbon.speed + ribbon.phase) *
          ribbon.amp +
        Math.sin(x * ribbon.freq * 2.3 + t * ribbon.speed * 0.7) *
          (ribbon.amp * 0.28);

      if (bumpX >= 0) {
        const dx = x - bumpX;
        const falloff = Math.exp((-dx * dx) / (2 * 90 * 90));
        y -= falloff * bumpStrength;
      }

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Sparse highlight particles drifting along the wave band
  const particleCount = isMobile.value
    ? Math.floor(particles.length / 2)
    : particles.length;

  for (let i = 0; i < particleCount; i++) {
    const p = particles[i];
    const x =
      ((p.x + (reducedMotion ? 0 : t * p.speed * 40)) % (width + 40)) - 20;
    const waveY =
      height * (0.45 + p.y * 0.25) +
      Math.sin(x * 0.005 + t * 0.6 + i) * 16;
    ctx.beginPath();
    ctx.fillStyle = `rgba(244, 241, 236, ${p.alpha})`;
    ctx.arc(x, waveY, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
};

useCanvasLoop({ canvasRef, draw });
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none absolute inset-0 h-full w-full"
    aria-hidden="true"
  />
</template>
