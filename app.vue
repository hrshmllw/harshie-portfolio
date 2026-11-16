<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { site } = useAppConfig();
const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/+$/, "");

const title = `${site.name} | Portfolio`;
const shareTitle = `${site.fullName} | ${site.role}`;
// Rendered from scripts/og-image.html; see the comment there to regenerate.
const image = {
  url: `${siteUrl}/og-image.png`,
  width: 1200,
  height: 630,
  alt: `${site.fullName}, ${site.role}: Bringing your designs to life`,
};

// Server-rendered, so link-preview crawlers (Slack, Facebook, LinkedIn,
// iMessage, X…) read these without running JS.
useSeoMeta({
  title,
  description: site.tagline,
  ogType: "website",
  ogSiteName: site.name,
  ogLocale: "en_US",
  ogUrl: `${siteUrl}/`,
  ogTitle: shareTitle,
  ogDescription: site.tagline,
  ogImage: image.url,
  ogImageSecureUrl: image.url,
  ogImageType: "image/png",
  ogImageWidth: image.width,
  ogImageHeight: image.height,
  ogImageAlt: image.alt,
  twitterCard: "summary_large_image",
  twitterTitle: shareTitle,
  twitterDescription: site.tagline,
  twitterImage: image.url,
  twitterImageAlt: image.alt,
});

useHead({
  link: [{ rel: "canonical", href: `${siteUrl}/` }],
});
</script>
