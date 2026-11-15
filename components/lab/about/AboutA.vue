<script setup lang="ts">
/** About · A — Manifesto: oversized copy that lights up word by word as it scrolls past. */
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();

const { data: about } = await useAsyncData("about", () =>
  queryCollection("about").first(),
);

const paragraphs = computed(() =>
  contentParagraphs(about.value?.body).map((text) => text.split(/\s+/)),
);
</script>

<template>
  <section class="border-t border-border" aria-labelledby="about-a-title">
    <div class="container-x section-pad">
      <div class="flex flex-wrap items-baseline justify-between gap-4">
        <p class="eyebrow eyebrow-marker">About</p>
        <h2 id="about-a-title" class="eyebrow">
          Frontend Development: Purpose &amp;&nbsp;Performance
        </h2>
      </div>

      <div class="mt-12 space-y-10 md:mt-20">
        <p
          v-for="(words, p) in paragraphs"
          :key="p"
          class="manifesto font-display font-semibold tracking-[-0.02em]"
          :class="
            p === 0
              ? 'text-[clamp(1.75rem,4.6vw,4.5rem)] leading-[1.04]'
              : 'max-w-5xl text-[clamp(1.25rem,2.6vw,2.5rem)] leading-[1.15]'
          "
        >
          <template v-for="(word, w) in words" :key="w">
            <span class="mf-word">{{ word }}</span>{{ " " }}
          </template>
          <span
            v-if="p === paragraphs.length - 1"
            class="hero-cursor"
            aria-hidden="true"
          />
        </p>
      </div>

      <div class="mt-20 grid border-t border-border md:mt-28 md:grid-cols-3">
        <article
          v-for="(principle, index) in site.principles"
          :key="principle.title"
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 16 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 450, delay: index * 90 }"
          class="border-b border-border py-8 md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0"
        >
          <p class="font-mono text-xs text-accent-bright">({{ String(index + 1).padStart(2, "0") }})</p>
          <h3 class="mt-6 font-display text-3xl font-semibold uppercase tracking-tight md:text-4xl">
            {{ principle.title }}
          </h3>
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {{ principle.description }}
          </p>
        </article>
      </div>

      <a
        :href="site.resumePath"
        download
        class="group mt-14 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-fg"
      >
        <span class="h-1.5 w-1.5 bg-accent-bright" aria-hidden="true" />
        Download resume
        <Icon
          name="lucide:download"
          class="h-4 w-4 transition-transform group-hover:translate-y-0.5"
          aria-hidden="true"
        />
      </a>
    </div>
  </section>
</template>

<style scoped>
.mf-word {
  color: #f4f1ec;
}

.manifesto + .manifesto .mf-word {
  color: #a7a7a7;
}

/* Scroll-linked brightening where supported; static, fully legible elsewhere. */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .mf-word {
      animation: mf-lit linear both;
      animation-timeline: view();
      animation-range: entry 80% cover 42%;
    }

    .manifesto + .manifesto .mf-word {
      animation-name: mf-lit-muted;
    }
  }
}

@keyframes mf-lit {
  from {
    color: #45494c;
  }
  to {
    color: #f4f1ec;
  }
}

@keyframes mf-lit-muted {
  from {
    color: #3a3e41;
  }
  to {
    color: #a7a7a7;
  }
}
</style>
