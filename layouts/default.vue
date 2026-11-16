<script setup lang="ts">
useEntryAnimations();
</script>

<template>
  <div class="min-h-screen bg-bg text-fg">
    <LayoutSitePreloader />
    <LayoutAppHeader />
    <main>
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>
