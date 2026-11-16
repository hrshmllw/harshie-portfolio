<script setup lang="ts">
/**
 * A tech icon that's muted at rest and shows the real logo when its parent
 * `.tick-item` is hovered: the full-colour mark (`logo`) fades in over the
 * single-colour one, or, with no full-colour mark, the icon takes `brand`.
 */
defineProps<{ icon: string; logo?: string; brand?: string }>();
</script>

<template>
  <span class="tech-mark relative inline-block h-[0.7em] w-[0.7em] shrink-0" :class="{ 'has-logo': logo }" :style="{ '--brand': brand }">
    <Icon :name="icon" mode="svg" class="tech-mono absolute inset-0 h-full w-full" />
    <Icon v-if="logo" :name="logo" mode="svg" class="tech-logo absolute inset-0 h-full w-full" />
  </span>
</template>

<style>
/* Unscoped: the hover comes from the parent `.tick-item` (TickerRow). */
.tech-mono {
  color: #a7a7a7;
  transition:
    color 200ms ease,
    opacity 200ms ease;
}

.tech-logo {
  opacity: 0;
  transition: opacity 200ms ease;
}

.tick-item:hover .tech-mono {
  color: var(--brand, #a7a7a7);
}

.tick-item:hover .tech-mark.has-logo .tech-mono {
  opacity: 0;
}

.tick-item:hover .tech-logo {
  opacity: 1;
}
</style>
