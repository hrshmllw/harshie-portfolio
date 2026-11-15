import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    about: defineCollection({
      type: "page",
      source: "about.md",
    }),
    projects: defineCollection({
      type: "page",
      source: "projects/**/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        liveUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        confidential: z.boolean().optional(),
        featured: z.boolean().optional(),
        order: z.number(),
        year: z.number().optional(),
        image: z.string().optional(),
      }),
    }),
  },
});
