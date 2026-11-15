<script setup lang="ts">
/** Contact · C — Status board: live local time and details on the left, a flat form on the right. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

const TIME_ZONE = "Asia/Manila";

const time = ref({ hh: "--", mm: "--", ss: "--" });
const offset = ref("");

const update = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "--";
  time.value = { hh: get("hour"), mm: get("minute"), ss: get("second") };
};

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  update();
  timer = setInterval(update, 1000);
  const local = -new Date().getTimezoneOffset() / 60;
  const diff = 8 - local;
  offset.value =
    diff === 0 ? "Same time zone as you" : `${Math.abs(diff)} h ${diff > 0 ? "ahead of" : "behind"} you`;
});

onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <section class="border-t border-border" aria-labelledby="contact-c-title">
    <div class="container-x section-pad">
      <p class="eyebrow eyebrow-marker">Contact</p>
      <h2 id="contact-c-title" class="display mt-6">Interested? Get in&nbsp;touch.</h2>

      <div class="mt-14 grid border border-border lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 500 }"
          class="border-b border-border bg-surface lg:border-b-0 lg:border-r"
        >
          <div class="border-b border-border p-6 md:p-8">
            <p class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              Local time &middot; {{ site.location.split(",")[0] }}
            </p>
            <p class="mt-3 font-display text-[clamp(3rem,7vw,5.5rem)] font-bold leading-none tabular-nums tracking-[-0.03em]">
              {{ time.hh }}<span class="clock-colon text-accent-bright">:</span>{{ time.mm }}<span class="ml-2 align-top text-[0.35em] text-muted">{{ time.ss }}</span>
            </p>
            <p class="mt-3 min-h-[1.25rem] font-mono text-xs text-muted">{{ offset }}</p>
          </div>

          <dl class="text-sm">
            <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4 md:px-8">
              <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">Status</dt>
              <dd class="flex items-center gap-2">
                <span class="status-pixel h-2 w-2 bg-accent-bright" aria-hidden="true" />
                Open to conversations
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4 md:px-8">
              <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">Replies</dt>
              <dd>Within two working days</dd>
            </div>
            <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4 md:px-8">
              <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">Email</dt>
              <dd class="min-w-0 truncate">
                <a :href="`mailto:${site.email}`" class="hover:text-accent-bright">{{ site.email }}</a>
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 px-6 py-4 md:px-8">
              <dt class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">Elsewhere</dt>
              <dd class="flex gap-4">
                <a
                  v-for="social in site.socials"
                  :key="social.url"
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 hover:text-accent-bright"
                >
                  <Icon :name="social.icon" class="h-4 w-4" aria-hidden="true" />
                  {{ social.label }}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div class="p-6 md:p-10">
          <p class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">New message</p>
          <LabContactForm />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .clock-colon {
    animation: colon-blink 1s steps(1, end) infinite;
  }

  .status-pixel {
    animation: status-pulse 1.6s ease-in-out infinite;
  }
}

@keyframes colon-blink {
  50% {
    opacity: 0.2;
  }
}

@keyframes status-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(196, 69, 74, 0.6);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(196, 69, 74, 0);
  }
}
</style>
