<script setup lang="ts">
/**
 * /lab — compare layout variants for each section below the hero.
 * Choose per section with the floating switcher; the choice is kept in the
 * query string (e.g. /lab?about=b&work=a) so a combination can be shared.
 *
 * Each section is wrapped in a stable element carrying the section id, so the
 * nav's IntersectionObserver keeps tracking it while variants swap.
 * (With "Now" selected the original component's own id is duplicated inside
 * the wrapper; harmless here.) When a variant is promoted to
 * components/sections, put the id back on its <section>.
 */
import type { Component } from "vue";
import AboutSection from "~/components/sections/AboutSection.vue";
import ExpertiseSection from "~/components/sections/ExpertiseSection.vue";
import ExperienceSection from "~/components/sections/ExperienceSection.vue";
import ProjectsSection from "~/components/sections/ProjectsSection.vue";
import ContactSection from "~/components/sections/ContactSection.vue";
import AboutA from "~/components/lab/about/AboutA.vue";
import AboutB from "~/components/lab/about/AboutB.vue";
import AboutC from "~/components/lab/about/AboutC.vue";
import AboutD from "~/components/lab/about/AboutD.vue";
import ExpertiseA from "~/components/lab/expertise/ExpertiseA.vue";
import ExpertiseB from "~/components/lab/expertise/ExpertiseB.vue";
import ExpertiseC from "~/components/lab/expertise/ExpertiseC.vue";
import ExperienceA from "~/components/lab/experience/ExperienceA.vue";
import ExperienceB from "~/components/lab/experience/ExperienceB.vue";
import ExperienceC from "~/components/lab/experience/ExperienceC.vue";
import ExperienceD from "~/components/lab/experience/ExperienceD.vue";
import ExperienceE from "~/components/lab/experience/ExperienceE.vue";
import ExperienceF from "~/components/lab/experience/ExperienceF.vue";
import WorkA from "~/components/lab/work/WorkA.vue";
import WorkB from "~/components/lab/work/WorkB.vue";
import WorkC from "~/components/lab/work/WorkC.vue";
import WorkD from "~/components/lab/work/WorkD.vue";
import ContactA from "~/components/lab/contact/ContactA.vue";
import ContactB from "~/components/lab/contact/ContactB.vue";
import ContactC from "~/components/lab/contact/ContactC.vue";
import ContactD from "~/components/lab/contact/ContactD.vue";
import ContactE from "~/components/lab/contact/ContactE.vue";

const { site } = useAppConfig();

useSeoMeta({
  title: `Layout lab | ${site.name}`,
  robots: "noindex, nofollow",
});

// Hidden "before" states of reveal effects are scoped to :root.js so the
// content stays visible without JS. Runs in <head>, before first paint.
useHead({
  script: [
    {
      innerHTML: "document.documentElement.classList.add('js')",
      tagPosition: "head",
    },
  ],
});

type Variant = { name: string; component: Component };

const SECTIONS: { key: string; label: string; variants: Record<string, Variant> }[] = [
  {
    key: "about",
    label: "About",
    variants: {
      current: { name: "Current", component: AboutSection },
      a: { name: "Manifesto", component: AboutA },
      b: { name: "Spec sheet", component: AboutB },
      c: { name: "Dot-matrix", component: AboutC },
      d: { name: "Portrait spec", component: AboutD },
    },
  },
  {
    key: "expertise",
    label: "Expertise",
    variants: {
      current: { name: "Current", component: ExpertiseSection },
      a: { name: "Glossary", component: ExpertiseA },
      b: { name: "Pixel bento", component: ExpertiseB },
      c: { name: "Ticker rows", component: ExpertiseC },
    },
  },
  {
    key: "experience",
    label: "Experience",
    variants: {
      current: { name: "Current", component: ExperienceSection },
      a: { name: "Ledger", component: ExperienceA },
      b: { name: "Gantt ruler", component: ExperienceB },
      c: { name: "Stacking cards", component: ExperienceC },
      d: { name: "Scrollytelling", component: ExperienceD },
      e: { name: "Commit log", component: ExperienceE },
      f: { name: "Pixel calendar", component: ExperienceF },
    },
  },
  {
    key: "work",
    label: "Work",
    variants: {
      current: { name: "Current", component: ProjectsSection },
      a: { name: "Hover index", component: WorkA },
      b: { name: "Cover grid", component: WorkB },
      c: { name: "File tree", component: WorkC },
      d: { name: "Stacking cards", component: WorkD },
    },
  },
  {
    key: "contact",
    label: "Contact",
    variants: {
      current: { name: "Current", component: ContactSection },
      a: { name: "Big CTA", component: ContactA },
      b: { name: "Mad-libs", component: ContactB },
      c: { name: "Status board", component: ContactC },
      d: { name: "Big CTA + form", component: ContactD },
      e: { name: "Split CTA + form", component: ContactE },
    },
  },
];

// What /lab shows with no query: the current picks from review.
const DEFAULTS: Record<string, string> = {
  about: "d",
  expertise: "c",
  experience: "d",
  work: "d",
  contact: "d",
};

const route = useRoute();

const selected = computed(() =>
  Object.fromEntries(
    SECTIONS.map((section) => {
      const value = route.query[section.key];
      return [
        section.key,
        typeof value === "string" && value in section.variants ? value : DEFAULTS[section.key] ?? "current",
      ];
    }),
  ),
);

const switcherSections = SECTIONS.map((section) => ({
  key: section.key,
  label: section.label,
  names: Object.fromEntries(
    Object.entries(section.variants).map(([key, variant]) => [key, variant.name]),
  ),
}));
</script>

<template>
  <div>
    <SectionsHeroSection />

    <div v-for="section in SECTIONS" :id="section.key" :key="section.key">
      <component :is="section.variants[selected[section.key]].component" />
    </div>

    <LabVariantSwitcher :sections="switcherSections" :selected="selected" :defaults="DEFAULTS" />
  </div>
</template>
