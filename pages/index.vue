<script setup lang="ts">
const { site } = useAppConfig();

useSeoMeta({
  title: `${site.name} | Portfolio`,
  description: site.tagline,
  ogTitle: `${site.fullName} | ${site.role}`,
  ogDescription: site.tagline,
  ogType: "website",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <div>
    <SectionsHeroSection />
    <SectionsAboutSection />
    <SectionsExpertiseSection />
    <SectionsExperienceSection />
    <SectionsProjectsSection />
    <SectionsContactSection />
  </div>
</template>
