<script setup lang="ts">
/** Contact · D — Big CTA, form visible: headline + copy-email across the top, details and form below. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();
const { copied, copy } = useCopyEmail();
const localTime = useLocalClock();
</script>

<template>
  <section class="bg-accent" aria-labelledby="contact-d-title">
    <div class="container-x section-pad">
      <p class="eyebrow eyebrow-marker text-fg/75 before:bg-fg">Contact</p>

      <h2
        id="contact-d-title"
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 24 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 600 }"
        class="hero-display mt-8"
      >
        Let's&nbsp;talk<span class="hero-cursor !bg-fg" aria-hidden="true" />
      </h2>

      <div class="mt-12 border-y border-fg/20">
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

      <div class="mt-14 grid gap-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <div>
          <p class="max-w-sm text-lg text-fg/80">
            Have a project in mind, a role to discuss, or a question about my
            work? Send a message and I'll get back to&nbsp;you.
          </p>

          <dl class="mt-10 border-t border-fg/20 text-sm">
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
                <a :href="social.url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:underline">
                  <Icon :name="social.icon" class="h-4 w-4" aria-hidden="true" />
                  {{ social.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") }}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <p class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg/60">Or send a message</p>
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
