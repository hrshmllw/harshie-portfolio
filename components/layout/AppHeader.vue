<script setup lang="ts">
const { site } = useAppConfig();
const { activeSection, scrollToSection } = useActiveSection();

const isMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const menuButtonRef = ref<HTMLButtonElement | null>(null);

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
});

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  if (!import.meta.client) return;
  document.body.style.overflow = "";
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-bg/85 backdrop-blur-md"
  >
    <div
      class="container-x flex h-16 items-center justify-between gap-4"
    >
      <button
        type="button"
        class="font-display text-sm font-semibold tracking-tight transition-opacity hover:opacity-70"
        @click="handleNavClick('#introduction')"
      >
        {{ site.name }}
      </button>

      <nav class="hidden items-center gap-7 lg:flex" aria-label="Primary">
        <button
          v-for="item in site.nav"
          :key="item.href"
          type="button"
          class="text-sm transition-colors"
          :class="
            isActive(item.href) ? 'text-fg' : 'text-muted hover:text-fg'
          "
          :aria-current="isActive(item.href) ? 'true' : undefined"
          @click="handleNavClick(item.href)"
        >
          {{ item.label }}
        </button>
        <button
          type="button"
          class="btn-primary"
          @click="handleNavClick('#contact')"
        >
          Get in touch
        </button>
      </nav>

      <button
        ref="menuButtonRef"
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center border border-border lg:hidden"
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
      class="border-t border-border bg-bg px-6 py-5 lg:hidden"
    >
      <nav class="flex flex-col gap-4" aria-label="Mobile">
        <button
          v-for="item in site.nav"
          :key="item.href"
          type="button"
          class="text-left text-base"
          :class="isActive(item.href) ? 'text-fg' : 'text-muted'"
          :aria-current="isActive(item.href) ? 'true' : undefined"
          @click="handleNavClick(item.href)"
        >
          {{ item.label }}
        </button>
        <button
          type="button"
          class="btn-primary mt-2 w-full"
          @click="handleNavClick('#contact')"
        >
          Get in touch
        </button>
      </nav>
    </div>
  </header>
</template>
