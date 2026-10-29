<template>
  <!-- Pixel "ej" on a 6x6 grid of 8-unit cells; size it in multiples of 6px (e.g. 24px) to keep pixels sharp. -->
  <svg
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    shape-rendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="currentColor"
      d="M0 8h24v8H0zM0 16h8v8H0zM16 16h8v8h-8zM0 24h24v8H0zM0 32h8v8H0zM0 40h24v8H0zM40 16h8v24h-8zM32 40h16v8H32z"
    />
    <path class="logo-cursor" fill="#C4454A" d="M40 0h8v8h-8z" />
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .logo-cursor {
    animation: logo-blink 1.1s steps(1, end) infinite;
  }
}

@keyframes logo-blink {
  50% {
    opacity: 0;
  }
}
</style>
