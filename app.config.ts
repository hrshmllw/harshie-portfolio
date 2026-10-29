export default defineAppConfig({
  site: {
    name: "EJMacawili",
    fullName: "Edcel Jeremy Macawili",
    role: "Frontend Developer",
    tagline:
      "Building responsive, interactive web experiences with performance and polish.",
    email: "edceljmacawili@gmail.com",
    location: "Calamba, Laguna, Philippines",
    resumePath: "/Edcel Jeremy Macawili - Resume 2025.pdf",
    experienceStartYear: 2023,
    socials: [
      {
        label: "GitHub",
        url: "https://github.com/hrshmllw",
        icon: "mdi:github",
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/edceljmacawili/",
        icon: "mdi:linkedin",
      },
    ],
    nav: [
      { label: "About", href: "#about" },
      { label: "Skills", href: "#skills" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
    ],
    skills: [
      {
        category: "Frameworks",
        items: ["Vue.js", "Nuxt", "React", "Next.js"],
      },
      {
        category: "Styling",
        items: ["HTML", "CSS", "SCSS", "Tailwind CSS"],
      },
      {
        category: "Languages",
        items: ["JavaScript", "TypeScript"],
      },
      {
        category: "Platforms & CMS",
        items: ["WordPress", "Shopify", "WooCommerce"],
      },
      {
        category: "Tools",
        items: ["GSAP", "Figma", "Git", "Axios", "ESLint", "Prettier"],
      },
    ],
  },
});
