<script setup lang="ts">
const { site } = useAppConfig();
</script>

<template>
  <footer class="relative flex min-h-[70svh] flex-col border-t border-border md:min-h-[100svh]">
    <div
      class="container-x flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-16"
    >
      <div class="space-y-2">
        <p class="font-display text-sm font-semibold tracking-tight">
          {{ site.name }}
        </p>
        <p class="text-sm text-muted">
          &copy; 2026 {{ site.shortName }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-5">
        <a
          v-for="social in site.socials"
          :key="social.url"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          :aria-label="social.label"
        >
          <Icon :name="social.icon" class="h-4 w-4" />
          <span>{{ social.label }}</span>
        </a>
        <a
          :href="`mailto:${site.email}`"
          class="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          aria-label="Email"
        >
          <Icon name="lucide:mail" class="h-4 w-4" />
          <span>Email</span>
        </a>
      </div>
    </div>

    <div class="relative min-h-[50svh] flex-1 overflow-hidden md:min-h-0">
      <p
        class="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none text-center font-display text-[18vw] font-semibold leading-none tracking-tight text-fg/[0.04] md:text-[14vw]"
        aria-hidden="true"
      >
        MACAWILI
      </p>
      <CanvasFooterWave class="absolute inset-0 z-10" />
    </div>
  </footer>
</template>
