<script setup lang="ts">
const { site } = useAppConfig();
const { activeSection, scrollToSection } = useActiveSection();

const isMenuOpen = ref(false);

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

watch(isMenuOpen, (open) => {
  if (!import.meta.client) return;
  document.body.style.overflow = open ? "hidden" : "";
});

onUnmounted(() => {
  if (!import.meta.client) return;
  document.body.style.overflow = "";
});
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-bg/80 backdrop-blur-md"
  >
    <div
      class="mx-auto flex h-16 max-w-content items-center justify-between px-6 md:px-8"
    >
      <button
        type="button"
        class="text-sm font-semibold tracking-tight transition-opacity hover:opacity-70"
        @click="handleNavClick('#')"
      >
        {{ site.name }}
      </button>

      <nav class="hidden items-center gap-8 md:flex" aria-label="Primary">
        <button
          v-for="item in site.nav"
          :key="item.href"
          type="button"
          class="text-sm transition-colors"
          :class="
            isActive(item.href)
              ? 'text-fg'
              : 'text-muted hover:text-fg'
          "
          @click="handleNavClick(item.href)"
        >
          {{ item.label }}
        </button>
        <LayoutColorModeToggle />
      </nav>

      <div class="flex items-center gap-2 md:hidden">
        <LayoutColorModeToggle />
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
          aria-label="Toggle menu"
          @click="toggleMenu"
        >
          <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div
      v-if="isMenuOpen"
      class="border-t border-border bg-bg px-6 py-4 md:hidden"
    >
      <nav class="flex flex-col gap-4" aria-label="Mobile">
        <button
          v-for="item in site.nav"
          :key="item.href"
          type="button"
          class="text-left text-base"
          :class="
            isActive(item.href)
              ? 'text-fg'
              : 'text-muted hover:text-fg'
          "
          @click="handleNavClick(item.href)"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>
  </header>
</template>
