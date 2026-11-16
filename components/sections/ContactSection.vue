<script setup lang="ts">
/** Big CTA, form visible: headline + copy-email across the top, details and form below. */
const { site } = useAppConfig();
const { copied, copy } = useCopyEmail();
const localTime = useLocalClock();

// The row label and icon already name the network, so show just the handle.
const handle = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? url;
</script>

<template>
  <section id="contact" class="bg-accent" aria-labelledby="contact-title">
    <div class="container-x section-pad">
      <p data-reveal-item class="eyebrow eyebrow-marker text-fg/75 before:bg-fg">Contact</p>

      <h2
        id="contact-title"
        data-reveal-heading
        class="hero-display mt-8"
      >
        Let's&nbsp;talk<span class="hero-cursor !bg-fg" aria-hidden="true" />
      </h2>

      <div data-reveal-item class="mt-12 border-y border-fg/20">
        <button
          type="button"
          class="email-line group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
          @click="copy"
        >
          <span class="relative min-w-0 font-display text-[clamp(1.1rem,4.4vw,4.25rem)] font-semibold tracking-[-0.02em] [overflow-wrap:anywhere]">
            {{ site.email }}
            <span class="email-underline absolute -bottom-1 left-0 h-[3px] w-full bg-fg" aria-hidden="true" />
          </span>
          <span class="flex shrink-0 items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg/75">
            <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="h-4 w-4" aria-hidden="true" />
            <span class="hidden sm:inline">{{ copied ? "Copied" : "Copy" }}</span>
          </span>
        </button>
      </div>
      <p class="sr-only" aria-live="polite">{{ copied ? "Email address copied to clipboard" : "" }}</p>

      <!-- Floating confirmation; visual only (the live region above announces it). -->
      <Teleport to="body">
        <Transition name="toast">
          <div
            v-if="copied"
            class="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[60] flex justify-center px-4"
            aria-hidden="true"
          >
            <p class="flex items-center gap-2 border border-fg/20 bg-bg px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-fg shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]">
              <Icon name="lucide:check" class="h-4 w-4 text-accent-light" />
              Copied
            </p>
          </div>
        </Transition>
      </Teleport>

      <div class="mt-14 grid gap-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <div>
          <p data-reveal-text class="max-w-sm text-lg text-fg/80">
            Have a project in mind, a role to discuss, or a question about my
            work? Send a message and I'll get back to&nbsp;you.
          </p>

          <dl data-reveal-item class="mt-10 border-t border-fg/20 text-sm">
            <div class="flex items-center justify-between gap-4 border-b border-fg/20 py-4">
              <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg/60">Based in</dt>
              <dd>{{ site.location.split(",").slice(0, 2).join(",") }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4 border-b border-fg/20 py-4">
              <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg/60">Local time</dt>
              <dd class="tabular-nums">{{ localTime }} <span class="text-fg/60">GMT+8</span></dd>
            </div>
            <div v-for="social in site.socials" :key="social.url" class="flex items-center justify-between gap-4 border-b border-fg/20 py-4">
              <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg/60">{{ social.label }}</dt>
              <dd>
                <a :href="social.url" target="_blank" rel="noopener noreferrer" class="tap-target inline-flex items-center gap-1.5 hover:underline">
                  <Icon :name="social.icon" class="h-4 w-4" aria-hidden="true" />
                  {{ handle(social.url) }}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div data-reveal-item>
          <p class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg/60">Or send a message</p>
          <UiContactForm class="form-on-maroon" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.email-underline {
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 250ms ease,
    transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-from,
  .toast-leave-to {
    transform: none;
  }
}

.email-line:hover .email-underline,
.email-line:focus-visible .email-underline {
  transform: scaleX(1);
  transform-origin: left;
}
</style>
