/** Projects for the Work section: featured by default, everything on toggle. */
export async function useProjects() {
  const showAll = ref(false);
  const nuxtApp = useNuxtApp();

  const { data: projects } = await useAsyncData("projects", () =>
    queryCollection("projects").order("order", "ASC").all(),
  );

  const featured = computed(() =>
    (projects.value ?? []).filter((project) => project.featured),
  );

  // Featured first, so expanding only ever appends below what's on screen.
  const displayed = computed(() =>
    showAll.value
      ? [
          ...featured.value,
          ...(projects.value ?? []).filter((project) => !project.featured),
        ]
      : featured.value,
  );

  const hasMore = computed(
    () => (projects.value?.length ?? 0) > featured.value.length,
  );

  const total = computed(() => projects.value?.length ?? 0);
  const featuredCount = computed(() => featured.value.length);

  const slug = (path: string) => path.split("/").filter(Boolean).pop() ?? path;

  /** Scroll so `el` sits just under the fixed header; resolves when done. */
  const scrollToTop = (el: HTMLElement) =>
    new Promise<void>((resolve) => {
      const offset = -96;
      const lenis = nuxtApp.$lenis?.current;
      if (el.getBoundingClientRect().top + offset >= 0) return resolve();
      if (lenis) {
        lenis.scrollTo(el, { offset, duration: 0.9, onComplete: () => resolve() });
      } else {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
        resolve();
      }
    });

  /**
   * Expand: just reveal (the list opts out of scroll anchoring, so nothing moves).
   * Collapse: scroll back to the top of `anchor` first, then drop the extra
   * projects, so the page doesn't fall away under the reader into the footer.
   */
  const toggleAll = async (anchor?: HTMLElement | null) => {
    if (!showAll.value) {
      showAll.value = true;
      return;
    }
    if (anchor) await scrollToTop(anchor);
    showAll.value = false;
  };

  return { showAll, displayed, hasMore, total, featuredCount, slug, toggleAll };
}
