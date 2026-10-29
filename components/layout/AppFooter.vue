<script setup lang="ts">
const { site } = useAppConfig();
const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-border">
    <div
      class="section-container flex flex-col items-start justify-between gap-3 py-8 md:flex-row md:items-center"
    >
      <p class="text-sm text-muted">
        &copy; {{ year }} {{ site.fullName }}
      </p>
      <div class="flex items-center gap-4">
        <a
          v-for="social in site.socials"
          :key="social.url"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted transition-colors hover:text-fg"
          :aria-label="social.label"
        >
          <Icon :name="social.icon" class="h-4 w-4" />
        </a>
      </div>
    </div>
  </footer>
</template>
