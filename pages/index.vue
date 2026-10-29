<script setup lang="ts">
const { site } = useAppConfig();

useSeoMeta({
  title: `${site.name} | Portfolio`,
  description: site.tagline,
});
</script>

<template>
  <div>
    <SectionsHeroSection />
    <SectionsAboutSection />
    <SectionsSkillsSection />
    <SectionsProjectsSection />
    <SectionsContactSection />
  </div>
</template>
