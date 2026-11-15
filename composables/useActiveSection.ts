const SECTION_IDS = [
  "introduction",
  "about",
  "expertise",
  "experience",
  "work",
  "contact",
] as const;

let observerInitialized = false;

export function useActiveSection() {
  const nuxtApp = useNuxtApp();
  const activeSection = useState<string>(
    "active-section",
    () => SECTION_IDS[0],
  );

  const observeSections = () => {
    if (!import.meta.client || observerInitialized) return;

    observerInitialized = true;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          activeSection.value = visible[0].target.id;
        }
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    onUnmounted(() => {
      observer.disconnect();
      observerInitialized = false;
    });
  };

  onMounted(() => {
    observeSections();
  });

  const scrollToSection = (href: string) => {
    if (!import.meta.client) return;

    const id = href.replace("#", "");
    const element = document.getElementById(id);

    const lenis = nuxtApp.$lenis.current;

    if (element) {
      if (lenis) lenis.scrollTo(element, { offset: 0 });
      else element.scrollIntoView({ behavior: "smooth", block: "start" });
      activeSection.value = id;
      return;
    }

    if (href === "#" || href === "") {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      activeSection.value = SECTION_IDS[0];
    }
  };

  return {
    activeSection,
    scrollToSection,
    sectionIds: SECTION_IDS,
  };
}
