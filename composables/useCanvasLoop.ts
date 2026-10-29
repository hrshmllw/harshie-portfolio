import type { Ref } from "vue";

export type CanvasPointer = {
  x: number;
  y: number;
  isInside: boolean;
};

export type CanvasDrawContext = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  time: number;
  pointer: CanvasPointer;
  reducedMotion: boolean;
};

type UseCanvasLoopOptions = {
  canvasRef: Ref<HTMLCanvasElement | null>;
  draw: (context: CanvasDrawContext) => void;
  /** Max device pixel ratio. Defaults to 2. */
  maxDpr?: number;
};

export function useCanvasLoop(options: UseCanvasLoopOptions) {
  const { canvasRef, draw, maxDpr = 2 } = options;
  const { shouldAnimate } = useMotionPreference();

  const width = ref(0);
  const height = ref(0);
  const isVisible = ref(true);
  const isDocumentVisible = ref(true);

  let rafId = 0;
  let startTime = 0;
  let ctx: CanvasRenderingContext2D | null = null;
  let observer: IntersectionObserver | null = null;

  const pointer = reactive<CanvasPointer>({
    x: 0,
    y: 0,
    isInside: false,
  });

  const resize = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const parent = canvas.parentElement ?? canvas;
    const rect = parent.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.floor(rect.width));
    const nextHeight = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    width.value = nextWidth;
    height.value = nextHeight;

    canvas.width = Math.floor(nextWidth * dpr);
    canvas.height = Math.floor(nextHeight * dpr);
    canvas.style.width = `${nextWidth}px`;
    canvas.style.height = `${nextHeight}px`;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const paint = (timestamp = 0) => {
    if (!ctx || width.value === 0 || height.value === 0) return;

    if (!startTime) startTime = timestamp;
    const time = (timestamp - startTime) / 1000;
    const dpr = Math.min(
      (import.meta.client && window.devicePixelRatio) || 1,
      maxDpr,
    );

    draw({
      ctx,
      width: width.value,
      height: height.value,
      dpr,
      time,
      pointer: { ...pointer },
      reducedMotion: !shouldAnimate.value,
    });
  };

  const loop = (timestamp: number) => {
    if (
      shouldAnimate.value &&
      isVisible.value &&
      isDocumentVisible.value
    ) {
      paint(timestamp);
      rafId = requestAnimationFrame(loop);
    }
  };

  const startLoop = () => {
    cancelAnimationFrame(rafId);
    if (!shouldAnimate.value) {
      paint(performance.now());
      return;
    }
    if (isVisible.value && isDocumentVisible.value) {
      rafId = requestAnimationFrame(loop);
    }
  };

  const stopLoop = () => {
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  const onPointerMove = (event: PointerEvent) => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.isInside = true;
  };

  const onPointerLeave = () => {
    pointer.isInside = false;
  };

  const onVisibilityChange = () => {
    isDocumentVisible.value = document.visibilityState === "visible";
    if (isDocumentVisible.value) startLoop();
    else stopLoop();
  };

  useResizeObserver(
    computed(() => canvasRef.value?.parentElement ?? null),
    () => {
      resize();
      if (!shouldAnimate.value) paint(performance.now());
    },
  );

  watch(shouldAnimate, () => {
    startTime = 0;
    startLoop();
  });

  onMounted(() => {
    resize();
    paint(performance.now());

    const canvas = canvasRef.value;
    if (!canvas) return;

    // Track pointer on the parent so pointer-events-none on the canvas still works
    const host = canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    observer = new IntersectionObserver(
      (entries) => {
        isVisible.value = entries.some((entry) => entry.isIntersecting);
        if (isVisible.value) startLoop();
        else stopLoop();
      },
      { threshold: 0.05 },
    );
    observer.observe(host);

    startLoop();
  });

  onUnmounted(() => {
    stopLoop();
    observer?.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);

    const canvas = canvasRef.value;
    const host = canvas?.parentElement ?? canvas;
    host?.removeEventListener("pointermove", onPointerMove);
    host?.removeEventListener("pointerleave", onPointerLeave);
  });

  return {
    width,
    height,
    pointer,
    resize,
  };
}
