/**
 * Shared state for the first-load sequence:
 *   preloader (assets) → hero grid draws in → nav + hero copy → scroll reveals.
 *
 * Client-only module state (not `useState`): the server must not hand the
 * client a "grid fully drawn" value.
 *
 * - `preloaded`: the preloader has finished and is leaving; the entry
 *   timeline starts on this.
 * - `gridDraw`: 0→1 progress of the hero grid drawing itself in, read by the
 *   canvas each frame. 1 when motion is reduced (no `motion` class).
 */
const motionOn = () =>
  import.meta.client && document.documentElement.classList.contains("motion");

const preloaded = ref(false);
const gridDraw = ref(motionOn() ? 0 : 1);

declare global {
  interface Window {
    /** Set once the app has booted; the <head> fail-safe checks it. */
    __introDone?: boolean;
  }
}

export function useSiteIntro() {
  /** Resolves once the preloader has finished. */
  const whenPreloaded = () =>
    new Promise<void>((resolve) => {
      if (preloaded.value) return resolve();
      const stop = watch(preloaded, (done) => {
        if (!done) return;
        stop();
        resolve();
      });
    });

  return { preloaded, gridDraw, whenPreloaded, motionOn };
}
