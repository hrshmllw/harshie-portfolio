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
  canHover: boolean;
};

type UseCanvasLoopOptions = {
  canvasRef: Ref<HTMLCanvasElement | null>;
  draw: (context: CanvasDrawContext) => void;
  /** Max device pixel ratio. Defaults to 2. */
  maxDpr?: number;
  /** Called on a short press that is not over interactive UI. */
  onTap?: (point: { x: number; y: number }) => void;
};

const INTERACTIVE_SELECTOR = "a, button, input, textarea, select, [role='button']";
const TAP_MAX_MOVE_PX = 6;

export function useCanvasLoop(options: UseCanvasLoopOptions) {
  const { canvasRef, draw, maxDpr = 2, onTap } = options;
  const { shouldAnimate } = useMotionPreference();

  const width = ref(0);
  const height = ref(0);
  const isVisible = ref(true);
  const isDocumentVisible = ref(true);
  const canHover = ref(false);

  let rafId = 0;
  let startTime = 0;
  let ctx: CanvasRenderingContext2D | null = null;
  let observer: IntersectionObserver | null = null;
  let hoverMedia: MediaQueryList | null = null;

  const pointer = reactive<CanvasPointer>({
    x: 0,
    y: 0,
    isInside: false,
  });

  let clientX = 0;
  let clientY = 0;
  let hasPointer = false;
  let tapStart: { x: number; y: number; pointerId: number } | null = null;

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

  const syncPointerFromClient = () => {
    const canvas = canvasRef.value;
    if (!canvas || !hasPointer) {
      pointer.isInside = false;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    pointer.x = x;
    pointer.y = y;
    pointer.isInside =
      x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
  };

  const paint = (timestamp = 0) => {
    if (!ctx || width.value === 0 || height.value === 0) return;

    syncPointerFromClient();

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
      canHover: canHover.value,
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

  const localPoint = (event: PointerEvent) => {
    const canvas = canvasRef.value;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    clientX = event.clientX;
    clientY = event.clientY;
    hasPointer = true;
  };

  const onPointerLeavePage = () => {
    hasPointer = false;
    pointer.isInside = false;
    tapStart = null;
  };

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest(INTERACTIVE_SELECTOR));
  };

  const hasTextSelection = () => {
    const selection = window.getSelection();
    return Boolean(selection && selection.toString().length > 0);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!onTap) return;
    if (event.button !== 0) return;
    if (isInteractiveTarget(event.target)) {
      tapStart = null;
      return;
    }
    const point = localPoint(event);
    if (!point) return;
    tapStart = { x: point.x, y: point.y, pointerId: event.pointerId };
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!onTap || !tapStart) return;
    if (event.pointerId !== tapStart.pointerId) return;

    const point = localPoint(event);
    const start = tapStart;
    tapStart = null;
    if (!point) return;

    const dx = point.x - start.x;
    const dy = point.y - start.y;
    if (Math.hypot(dx, dy) > TAP_MAX_MOVE_PX) return;
    if (isInteractiveTarget(event.target)) return;
    if (hasTextSelection()) return;

    onTap(point);
  };

  const onVisibilityChange = () => {
    isDocumentVisible.value = document.visibilityState === "visible";
    if (isDocumentVisible.value) startLoop();
    else stopLoop();
  };

  const onHoverMediaChange = () => {
    canHover.value = hoverMedia?.matches ?? false;
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

  // Client components can mount before the <canvas> ref exists.
  // Watch with flush:post so setup runs once the element is in the DOM.
  watch(
    canvasRef,
    (canvas, _prev, onCleanup) => {
      if (!canvas) return;

      resize();
      paint(performance.now());

      const host = canvas.parentElement ?? canvas;
      const pointerMoveOpts: AddEventListenerOptions = { passive: true };

      window.addEventListener("pointermove", onPointerMove, pointerMoveOpts);
      document.documentElement.addEventListener(
        "pointerleave",
        onPointerLeavePage,
      );
      window.addEventListener("blur", onPointerLeavePage);
      host.addEventListener("pointerdown", onPointerDown);
      host.addEventListener("pointerup", onPointerUp);
      document.addEventListener("visibilitychange", onVisibilityChange);

      hoverMedia = window.matchMedia("(hover: hover)");
      canHover.value = hoverMedia.matches;
      hoverMedia.addEventListener("change", onHoverMediaChange);

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

      onCleanup(() => {
        stopLoop();
        observer?.disconnect();
        observer = null;
        hoverMedia?.removeEventListener("change", onHoverMediaChange);
        hoverMedia = null;
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("pointermove", onPointerMove, pointerMoveOpts);
        document.documentElement.removeEventListener(
          "pointerleave",
          onPointerLeavePage,
        );
        window.removeEventListener("blur", onPointerLeavePage);
        host.removeEventListener("pointerdown", onPointerDown);
        host.removeEventListener("pointerup", onPointerUp);
        hasPointer = false;
        tapStart = null;
      });
    },
    { flush: "post", immediate: true },
  );

  onUnmounted(() => {
    stopLoop();
  });

  return {
    width,
    height,
    pointer,
    canHover,
    resize,
  };
}
