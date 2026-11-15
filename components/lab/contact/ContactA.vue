<script setup lang="ts">
/** Contact · A — Big CTA: hero-scale "Let's talk", a giant click-to-copy email, the form behind a disclosure. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(site.email);
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 2200);
  } catch {
    window.location.href = `mailto:${site.email}`;
  }
};

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <section class="bg-accent" aria-labelledby="contact-a-title">
    <div class="container-x section-pad">
      <p class="eyebrow eyebrow-marker text-fg/75 before:bg-fg">Contact</p>

      <h2
        id="contact-a-title"
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 24 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 600 }"
        class="hero-display mt-8"
      >
        Let's&nbsp;talk<span class="hero-cursor !bg-fg" aria-hidden="true" />
      </h2>

      <p class="mt-8 max-w-lg text-lg text-fg/75">
        Have a project in mind, a role to discuss, or a question about my work?
        Click to copy my email, or use the form.
      </p>

      <div class="mt-12 border-y border-fg/20">
        <button
          type="button"
          class="email-line group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
          @click="copyEmail"
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

      <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-fg/75">
        <a :href="`mailto:${site.email}`" class="inline-flex items-center gap-2 hover:text-fg">
          <Icon name="lucide:mail" class="h-4 w-4" aria-hidden="true" /> Open mail app
        </a>
        <a
          v-for="social in site.socials"
          :key="social.url"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 hover:text-fg"
        >
          <Icon :name="social.icon" class="h-4 w-4" aria-hidden="true" /> {{ social.label }}
        </a>
        <span class="inline-flex items-center gap-2">
          <Icon name="lucide:map-pin" class="h-4 w-4" aria-hidden="true" /> {{ site.location }}
        </span>
      </div>

      <details class="group mt-14 max-w-3xl border-t border-fg/20">
        <summary class="flex cursor-pointer list-none items-center justify-between py-5 font-mono text-xs uppercase tracking-[0.2em] [&::-webkit-details-marker]:hidden">
          Prefer a form?
          <Icon name="lucide:plus" class="h-4 w-4 transition-transform group-open:rotate-45" aria-hidden="true" />
        </summary>
        <LabContactForm class="contact-on-maroon pb-6" />
      </details>
    </div>
  </section>
</template>

<style scoped>
.email-underline {
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.email-line:hover .email-underline,
.email-line:focus-visible .email-underline {
  transform: scaleX(1);
  transform-origin: left;
}

.contact-on-maroon :deep(.lab-input) {
  border-color: rgba(244, 241, 236, 0.3);
}

.contact-on-maroon :deep(.lab-input:focus) {
  border-color: #f4f1ec;
}

.contact-on-maroon :deep(.lab-label) {
  color: rgba(244, 241, 236, 0.7);
}

.contact-on-maroon :deep(.lab-error)::before {
  background-color: #f4f1ec;
}
</style>
