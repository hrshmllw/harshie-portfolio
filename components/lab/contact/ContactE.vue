<script setup lang="ts">
/** Contact · E — Big CTA, split: sticky stacked "Let's talk" + email on the left, the form on a plate on the right. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();
const { copied, copy } = useCopyEmail();
</script>

<template>
  <section class="bg-accent" aria-labelledby="contact-e-title">
    <div class="container-x section-pad">
      <div class="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div class="lg:sticky lg:top-28 lg:self-start">
          <p class="eyebrow eyebrow-marker text-fg/75 before:bg-fg">Contact</p>

          <h2
            id="contact-e-title"
            v-motion
            :initial="shouldAnimate ? { opacity: 0, y: 24 } : false"
            :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
            :transition="{ duration: 600 }"
            class="mt-8 font-display text-[clamp(3.5rem,11vw,10rem)] font-bold uppercase leading-[0.86] tracking-[-0.03em]"
          >
            <span class="block">Let's</span>
            <span class="block">talk<span class="hero-cursor !bg-fg" aria-hidden="true" /></span>
          </h2>

          <p class="mt-8 max-w-md text-lg text-fg/80">
            Have a project in mind, a role to discuss, or a question about my
            work? I'll get back to&nbsp;you.
          </p>

          <button
            type="button"
            class="email-line group mt-10 flex max-w-full items-center gap-4 text-left"
            @click="copy"
          >
            <span class="relative min-w-0 font-display text-[clamp(1.1rem,2.6vw,2rem)] font-semibold tracking-tight [overflow-wrap:anywhere]">
              {{ site.email }}
              <span class="email-underline absolute -bottom-1 left-0 h-[2px] w-full bg-fg" aria-hidden="true" />
            </span>
            <span class="flex shrink-0 items-center gap-2 border border-fg/30 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fg/80 group-hover:border-fg">
              <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="h-3.5 w-3.5" aria-hidden="true" />
              {{ copied ? "Copied" : "Copy" }}
            </span>
          </button>
          <p class="sr-only" aria-live="polite">{{ copied ? "Email address copied to clipboard" : "" }}</p>

          <div class="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-fg/75">
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
        </div>

        <div
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 500, delay: 120 }"
          class="self-start border border-fg/15 bg-black/20 p-6 md:p-10"
        >
          <div class="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg/60">
            <span>New message</span>
            <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 bg-fg" aria-hidden="true" />To: EJ</span>
          </div>
          <LabContactForm class="form-on-maroon" />
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

.email-line:hover .email-underline,
.email-line:focus-visible .email-underline {
  transform: scaleX(1);
  transform-origin: left;
}
</style>
