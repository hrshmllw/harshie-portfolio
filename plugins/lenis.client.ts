import Lenis from "lenis";

/**
 * Smooth scrolling on top of the native window scroll.
 *
 * Lenis eases the real `window.scrollY`, so the fixed header, the
 * IntersectionObserver section tracking and the hero grid parallax keep
 * working unchanged. Disabled entirely for `prefers-reduced-motion`.
 */
export default defineNuxtPlugin(() => {
  const holder: { current: Lenis | null } = { current: null };
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");

  const start = () => {
    if (holder.current) return;
    holder.current = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
  };

  const stop = () => {
    holder.current?.destroy();
    holder.current = null;
  };

  const sync = () => {
    if (media.matches) stop();
    else start();
  };

  sync();
  media.addEventListener("change", sync);

  return { provide: { lenis: holder } };
});
