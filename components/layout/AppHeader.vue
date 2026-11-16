<script setup lang="ts">
const { site } = useAppConfig();
const nuxtApp = useNuxtApp();
const { activeSection, scrollToSection } = useActiveSection();
const { setNavItemPointer, setNavItemFocus, resetNavItemHovered } =
  useNavItemHover();

const isMenuOpen = ref(false);
const { y: scrollY } = useWindowScroll();
const isScrolled = computed(() => scrollY.value > 8);
const isElevated = computed(() => isScrolled.value || isMenuOpen.value);
const menuRef = ref<HTMLElement | null>(null);
const menuButtonRef = ref<HTMLButtonElement | null>(null);
const tracerRef = ref<{
  start: (itemEl: HTMLElement, clientX: number, clientY: number) => void;
  startAbsorb: (
    targetEl: Element,
    clientX: number,
    clientY: number,
  ) => void;
  stop: () => void;
} | null>(null);
const isLogoAbsorbed = ref(false);
const isLogoFocused = ref(false);
const isLogoGlowing = computed(
  () => isLogoAbsorbed.value || isLogoFocused.value,
);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleNavClick = (href: string) => {
  closeMenu();
  scrollToSection(href);
};

const isActive = (href: string) => {
  const id = href.replace("#", "");
  if (href === "#") return activeSection.value === "introduction";
  return activeSection.value === id;
};

const onNavPointerEnter = (event: PointerEvent) => {
  setNavItemPointer(true);
  const target = event.currentTarget;
  if (target instanceof HTMLElement) {
    tracerRef.value?.start(target, event.clientX, event.clientY);
  }
};

const onNavPointerLeave = () => {
  setNavItemPointer(false);
  tracerRef.value?.stop();
};

const onLogoPointerEnter = (event: PointerEvent) => {
  setNavItemPointer(true);
  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) return;
  const cursor = target.querySelector(".logo-cursor");
  if (cursor instanceof Element) {
    tracerRef.value?.startAbsorb(cursor, event.clientX, event.clientY);
  }
};

const onLogoPointerLeave = () => {
  setNavItemPointer(false);
  tracerRef.value?.stop();
};

const onLogoFocusIn = (event: FocusEvent) => {
  const target = event.target;
  requestAnimationFrame(() => {
    if (target instanceof Element && target.matches(":focus-visible")) {
      isLogoFocused.value = true;
    }
  });
};

const onLogoFocusOut = () => {
  isLogoFocused.value = false;
};

const onNavFocusIn = (event: FocusEvent) => {
  const target = event.target;
  requestAnimationFrame(() => {
    if (target instanceof Element && target.matches(":focus-visible")) {
      setNavItemFocus(true);
    }
  });
};

const onNavFocusOut = (event: FocusEvent) => {
  const next = event.relatedTarget;
  if (
    next instanceof Element &&
    next.closest(".nav-link, .nav-cta")
  ) {
    return;
  }
  setNavItemFocus(false);
};

const onAbsorbChange = (absorbed: boolean) => {
  isLogoAbsorbed.value = absorbed;
};

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const trapFocus = (event: KeyboardEvent) => {
  if (!isMenuOpen.value || !menuRef.value) return;
  if (event.key !== "Tab") return;

  const focusable = Array.from(
    menuRef.value.querySelectorAll<HTMLElement>(focusableSelector),
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isMenuOpen.value) {
    closeMenu();
    menuButtonRef.value?.focus();
    return;
  }
  trapFocus(event);
};

watch(isMenuOpen, (open) => {
  if (!import.meta.client) return;
  document.body.style.overflow = open ? "hidden" : "";
  // Lenis scrolls programmatically, so it needs pausing for the menu lock
  const lenis = nuxtApp.$lenis.current;
  if (open) lenis?.stop();
  else lenis?.start();
});

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  if (!import.meta.client) return;
  document.body.style.overflow = "";
  nuxtApp.$lenis.current?.start();
  document.removeEventListener("keydown", onKeydown);
  resetNavItemHovered();
});
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300"
    :class="[
      isElevated
        ? 'border-border/60 backdrop-blur-md'
        : 'border-transparent bg-transparent',
      isMenuOpen ? 'bg-bg/95' : isScrolled && 'bg-bg/70',
    ]"
  >
    <LayoutNavTracer ref="tracerRef" @absorb-change="onAbsorbChange" />
    <div
      class="container-x relative z-10 flex h-16 items-center justify-between gap-4"
    >
      <button
        type="button"
        class="tap-target text-fg"
        data-intro="nav"
        :aria-label="`${site.fullName}, back to top`"
        @click="handleNavClick('#introduction')"
        @pointerenter="onLogoPointerEnter"
        @pointerleave="onLogoPointerLeave"
        @focusin="onLogoFocusIn"
        @focusout="onLogoFocusOut"
      >
        <LayoutAppLogo class="block h-6 w-6" :glowing="isLogoGlowing" />
      </button>

      <nav class="hidden items-center gap-8 lg:flex" aria-label="Primary">
        <button
          v-for="item in site.nav"
          :key="item.href"
          type="button"
          class="nav-link"
          data-intro="nav"
          :class="{ 'is-active': isActive(item.href) }"
          :aria-current="isActive(item.href) ? 'true' : undefined"
          @click="handleNavClick(item.href)"
          @pointerenter="onNavPointerEnter"
          @pointerleave="onNavPointerLeave"
          @focusin="onNavFocusIn"
          @focusout="onNavFocusOut"
        >
          <span class="nav-link-inner">
            {{ item.label }}
            <svg
              class="nav-link-frame"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect pathLength="100" x="0.5" y="0.5" width="99" height="99" />
            </svg>
          </span>
          <span class="nav-link-marker" aria-hidden="true" />
        </button>
        <span class="h-4 w-px bg-border" data-intro="nav" aria-hidden="true" />
        <button
          type="button"
          class="nav-cta group"
          data-intro="nav"
          @click="handleNavClick('#contact')"
          @pointerenter="onNavPointerEnter"
          @pointerleave="onNavPointerLeave"
          @focusin="onNavFocusIn"
          @focusout="onNavFocusOut"
        >
          <span class="nav-link-inner">
            get in touch
            <Icon name="lucide:arrow-up-right" class="nav-cta-icon" />
            <svg
              class="nav-link-frame"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect pathLength="100" x="0.5" y="0.5" width="99" height="99" />
            </svg>
          </span>
        </button>
      </nav>

      <button
        ref="menuButtonRef"
        type="button"
        class="tap-target inline-flex h-9 w-9 items-center justify-center border border-border lg:hidden"
        data-intro="nav"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-nav"
        aria-label="Toggle menu"
        @click="toggleMenu"
      >
        <Icon
          :name="isMenuOpen ? 'lucide:x' : 'lucide:menu'"
          class="h-5 w-5"
        />
      </button>
    </div>

    <div
      v-if="isMenuOpen"
      id="mobile-nav"
      ref="menuRef"
      class="border-t border-border/60 px-6 py-6 lg:hidden"
    >
      <nav class="flex flex-col items-stretch" aria-label="Mobile">
        <button
          v-for="item in site.nav"
          :key="item.href"
          type="button"
          class="nav-link min-h-11 w-full items-center py-2 text-lg"
          :class="{ 'is-active': isActive(item.href) }"
          :aria-current="isActive(item.href) ? 'true' : undefined"
          @click="handleNavClick(item.href)"
        >
          <span class="relative">
            {{ item.label }}
            <span class="nav-link-marker" aria-hidden="true" />
          </span>
        </button>
        <button
          type="button"
          class="nav-cta group mt-3 min-h-11 w-full py-2 text-lg"
          @click="handleNavClick('#contact')"
        >
          get in touch
          <Icon name="lucide:arrow-up-right" class="nav-cta-icon" />
        </button>
      </nav>
    </div>
  </header>

  <!-- Outside <header>: its backdrop-filter would make a fixed child size to the header. -->
  <Transition name="menu-backdrop">
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 z-40 bg-black/60 lg:hidden"
      aria-hidden="true"
      @click="closeMenu"
    />
  </Transition>
</template>

<style scoped>
.menu-backdrop-enter-active,
.menu-backdrop-leave-active {
  transition: opacity 250ms ease;
}

.menu-backdrop-enter-from,
.menu-backdrop-leave-to {
  opacity: 0;
}
</style>
