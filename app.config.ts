export default defineAppConfig({
  site: {
    name: "EJMacawili",
    fullName: "Edcel Jeremy Macawili",
    shortName: "Edcel Macawili",
    role: "Frontend Developer",
    tagline:
      "I build responsive, accessible, and performant web experiences through thoughtful implementation and purposeful engineering.",
    email: "edceljmacawili@gmail.com",
    location: "Calamba, Laguna, Philippines",
    resumePath: "/Edcel Jeremy Macawili - Resume 2025.pdf",
    experienceStartYear: 2023,
    socials: [
      {
        label: "GitHub",
        url: "https://github.com/hrshmllw",
        icon: "simple-icons:github",
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/edceljmacawili/",
        icon: "simple-icons:linkedin",
      },
    ],
    nav: [
      { label: "About", href: "#about" },
      { label: "Expertise", href: "#expertise" },
      { label: "Experience", href: "#experience" },
      { label: "Work", href: "#work" },
      { label: "Contact", href: "#contact" },
    ],
    expertiseTags: [
      "UI Implementation",
      "Accessibility",
      "Web Performance",
    ],
    principles: [
      {
        title: "Precision",
        description:
          "Pixel-faithful implementation that respects design intent across breakpoints.",
      },
      {
        title: "Usability",
        description:
          "Accessible, keyboard-friendly interfaces that stay clear under real use.",
      },
      {
        title: "Performance",
        description:
          "Lean delivery with purposeful motion and measurable load discipline.",
      },
    ],
    technologies: [
      {
        category: "Frontend",
        items: [
          { name: "HTML", icon: "simple-icons:html5" },
          { name: "CSS", icon: "simple-icons:css" },
          { name: "JavaScript", icon: "simple-icons:javascript" },
          { name: "TypeScript", icon: "simple-icons:typescript" },
          { name: "SCSS", icon: "simple-icons:sass" },
          { name: "Tailwind CSS", icon: "simple-icons:tailwindcss" },
          { name: "React", icon: "simple-icons:react" },
          { name: "Next.js", icon: "simple-icons:nextdotjs" },
          { name: "Vue", icon: "simple-icons:vuedotjs" },
          { name: "Nuxt", icon: "simple-icons:nuxt" },
        ],
      },
      {
        category: "CMS & Backend",
        items: [
          { name: "WordPress", icon: "simple-icons:wordpress" },
          { name: "PHP", icon: "simple-icons:php" },
          { name: "ACF", icon: "lucide:blocks" }, // verify: Advanced Custom Fields
          { name: "WooCommerce", icon: "simple-icons:woocommerce" },
          { name: "Shopify", icon: "simple-icons:shopify" },
          { name: "REST APIs", icon: "lucide:network" },
        ],
      },
      {
        category: "Libraries & Tooling",
        items: [
          { name: "GSAP", icon: "simple-icons:greensock" },
          { name: "jQuery", icon: "simple-icons:jquery" },
          { name: "Axios", icon: "simple-icons:axios" },
          { name: "Webpack", icon: "simple-icons:webpack" },
          { name: "NPM", icon: "simple-icons:npm" },
          { name: "Git", icon: "simple-icons:git" },
          { name: "Figma", icon: "simple-icons:figma" },
          { name: "ESLint", icon: "simple-icons:eslint" },
          { name: "Prettier", icon: "simple-icons:prettier" },
        ],
      },
      {
        category: "Testing & QA",
        items: [
          { name: "Jest", icon: "simple-icons:jest" }, // verify
          { name: "Mocha", icon: "simple-icons:mocha" }, // verify
          { name: "Browser testing", icon: "lucide:monitor-check" },
          { name: "Debugging", icon: "lucide:bug" },
          { name: "Performance audits", icon: "lucide:gauge" },
        ],
      },
    ],
    experience: [
      {
        role: "Frontend Web Developer",
        company: "DottyStyle Creative Inc.",
        url: "https://dottystylecreative.com/",
        start: "2024-03",
        end: null,
        dateLabel: "March 2024–Present",
        summary:
          "Building and maintaining client websites for an Australian creative agency, from Figma handoff to launch and ongoing support.",
        highlights: [
          "Custom WordPress themes with ACF-driven page builders, plus WooCommerce stores and their email templates.",
          "Headless and static builds with Nuxt, Vite and Webpack, with GSAP and Lottie motion.",
          "Third-party integrations such as HubSpot, booking flows and product feeds.",
          "QA across browsers and devices, site migrations, and maintenance of live sites.",
        ],
      },
      {
        role: "Junior Web Developer",
        company: "Straight Login Inc.",
        url: "https://slogin.io/",
        start: "2023-08",
        end: "2024-03",
        dateLabel: "August 2023–March 2024",
        summary:
          "Frontend development for client web apps and marketing sites, working with designers and backend developers through delivery.",
        highlights: [
          "Next.js and Tailwind CSS builds, including English/Japanese sites with next-intl.",
          "A Web3 app with wallet connection (wagmi, RainbowKit) on top of a third-party API.",
          "Headless WordPress content, booking embeds and responsive, accessible UI.",
        ],
      },
      {
        role: "Frontend Development & QA Intern",
        company: "Pixel8 Web Solutions & Consultancy Inc.",
        url: "https://pixel8websolutions.com/",
        start: "2023-03",
        end: "2023-05",
        dateLabel: "March–May 2023",
        summary:
          "Internship on the frontend and QA teams, building interface screens and testing them before release.",
        highlights: [
          "Interface implementation in Vue.js and Quasar from design mockups.",
          "Manual QA: writing test cases, reproducing issues and filing bug reports.",
        ],
      },
    ],
  },
});
