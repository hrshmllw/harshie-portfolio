export function useMotionPreference() {
  const prefersReducedMotion = usePreferredReducedMotion();

  const shouldAnimate = computed(
    () => prefersReducedMotion.value !== "reduce",
  );

  return { shouldAnimate, prefersReducedMotion };
}
