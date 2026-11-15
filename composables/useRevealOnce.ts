import type { MaybeElementRef } from "@vueuse/core";

/**
 * Flips to true the first time the element scrolls into view, then stops
 * observing. Pair with CSS whose hidden state is scoped to `:root.js` so the
 * content stays visible without JS and under reduced motion.
 */
export function useRevealOnce(target: MaybeElementRef, threshold = 0.25) {
  const isIn = ref(false);

  const { stop } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry?.isIntersecting) {
        isIn.value = true;
        stop();
      }
    },
    { threshold },
  );

  return isIn;
}
