<script setup lang="ts">
import type { CanvasDrawContext } from "~/composables/useCanvasLoop";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isTouch = ref(false);

onMounted(() => {
  isTouch.value =
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0;
});

const draw = ({
  ctx,
  width,
  height,
  time,
  pointer,
  reducedMotion,
}: CanvasDrawContext) => {
  ctx.clearRect(0, 0, width, height);

  const cell = width < 640 ? 48 : width < 1024 ? 40 : 36;
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const radius = Math.min(width, height) * 0.28;
  const allowPointer = !isTouch.value && pointer.isInside && !reducedMotion;

  const displace = (x: number, y: number) => {
    if (!allowPointer) return { x, y };

    const dx = x - pointer.x;
    const dy = y - pointer.y;
    const dist = Math.hypot(dx, dy);
    if (dist > radius || dist === 0) return { x, y };

    const falloff = 1 - dist / radius;
    const strength = falloff * falloff * 14;
    const angle = Math.atan2(dy, dx);
    // Soft radial push with a slight orbital twist
    const twist = Math.sin(time * 1.2 + dist * 0.02) * 0.35;

    return {
      x: x + Math.cos(angle + twist) * strength,
      y: y + Math.sin(angle + twist) * strength,
    };
  };

  const points: { x: number; y: number }[][] = [];
  for (let row = 0; row <= rows; row++) {
    const line: { x: number; y: number }[] = [];
    for (let col = 0; col <= cols; col++) {
      line.push(displace(col * cell, row * cell));
    }
    points.push(line);
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(167, 167, 167, 0.22)";

  for (let row = 0; row <= rows; row++) {
    ctx.beginPath();
    for (let col = 0; col <= cols; col++) {
      const point = points[row][col];
      if (col === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }

  for (let col = 0; col <= cols; col++) {
    ctx.beginPath();
    for (let row = 0; row <= rows; row++) {
      const point = points[row][col];
      if (row === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }

  if (allowPointer) {
    const glow = ctx.createRadialGradient(
      pointer.x,
      pointer.y,
      0,
      pointer.x,
      pointer.y,
      radius,
    );
    glow.addColorStop(0, "rgba(196, 69, 74, 0.08)");
    glow.addColorStop(1, "rgba(196, 69, 74, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }
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
