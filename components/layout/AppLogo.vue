<script setup lang="ts">
withDefaults(
  defineProps<{
    glowing?: boolean;
  }>(),
  { glowing: false },
);

const gradientId = useId();
</script>

<template>
  <!-- Pixel "ej" on a 6x6 grid of 8-unit cells; size it in multiples of 6px (e.g. 24px) to keep pixels sharp. -->
  <svg
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    shape-rendering="crispEdges"
    overflow="visible"
    aria-hidden="true"
    focusable="false"
    :class="{ 'is-glowing': glowing }"
  >
    <defs>
      <radialGradient :id="gradientId" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#C4454A" stop-opacity="0.95" />
        <stop offset="42%" stop-color="#C4454A" stop-opacity="0.45" />
        <stop offset="100%" stop-color="#C4454A" stop-opacity="0" />
      </radialGradient>
    </defs>
    <!-- Soft plate behind the full mark; expands from the j-dot on hover. -->
    <circle
      class="logo-halo"
      cx="24"
      cy="24"
      r="34"
      :fill="`url(#${gradientId})`"
      shape-rendering="geometricPrecision"
    />
    <path
      fill="currentColor"
      d="M0 8h24v8H0zM0 16h8v8H0zM16 16h8v8h-8zM0 24h24v8H0zM0 32h8v8H0zM0 40h24v8H0zM40 16h8v24h-8zM32 40h16v8H32z"
    />
    <path class="logo-cursor" d="M40 0h8v8h-8z" />
  </svg>
</template>

<style scoped>
.logo-halo {
  opacity: 0;
  /* Grow from the j-dot (top-right of the mark) into a full-logo plate. */
  transform-box: fill-box;
  transform-origin: 79% 21%;
  transform: scale(0.16);
  transition:
    opacity 320ms ease,
    transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.logo-cursor {
  fill: #c4454a;
  transition: fill 320ms ease;
}

.is-glowing .logo-halo {
  opacity: 0.72;
  transform: scale(1);
  /* Opacity-only pulse so transform stays free for expand/collapse into the j-dot. */
  animation: logo-halo-breathe 1.7s ease-in-out 420ms infinite;
}

.is-glowing .logo-cursor {
  fill: currentColor;
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  .logo-cursor {
    animation: logo-blink 1.1s steps(1, end) infinite;
  }

  .is-glowing .logo-cursor {
    animation: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-halo {
    transition: opacity 200ms ease;
    transform: none;
  }

  .is-glowing .logo-halo {
    animation: none;
    opacity: 0.55;
    transform: none;
  }
}

@keyframes logo-blink {
  50% {
    opacity: 0;
  }
}

@keyframes logo-halo-breathe {
  0%,
  100% {
    opacity: 0.48;
  }
  50% {
    opacity: 0.88;
  }
}
</style>
