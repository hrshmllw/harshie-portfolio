<script setup lang="ts">
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

const { data: about } = await useAsyncData("about", () =>
  queryCollection("about").first(),
);

const experienceYears = computed(
  () => new Date().getFullYear() - site.experienceStartYear,
);
</script>

<template>
  <section id="about" class="section-container border-t border-border">
    <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500 }"
      >
        <p class="section-eyebrow">About</p>
        <h2 class="section-title">Building interfaces that feel intentional.</h2>

        <div
          v-if="about"
          class="prose prose-neutral mt-6 max-w-none text-base leading-relaxed text-muted dark:prose-invert"
        >
          <ContentRenderer :value="about" />
        </div>

        <dl class="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <dt class="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Location
            </dt>
            <dd class="mt-1 text-sm">{{ site.location }}</dd>
          </div>
          <div>
            <dt class="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Experience
            </dt>
            <dd class="mt-1 text-sm">{{ experienceYears }}+ years</dd>
          </div>
        </dl>

        <a
          :href="site.resumePath"
          download
          class="btn-primary mt-8"
        >
          Download resume
        </a>
      </div>

      <div
        v-motion
        :initial="shouldAnimate ? { opacity: 0, scale: 0.98 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, scale: 1 } : false"
        :transition="{ duration: 500, delay: 100 }"
        class="relative"
      >
        <NuxtImg
          src="~/assets/img/gradpic.png"
          alt="Edcel Jeremy Macawili"
          width="640"
          height="800"
          class="aspect-[4/5] w-full rounded-xl border border-border object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>
