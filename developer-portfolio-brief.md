# Developer Portfolio Brief

## Project Overview

Create a single-page personal portfolio for a frontend developer. The visual direction is inspired by Kiplo Creative Solutions' editorial structure, bold typography, clear section hierarchy, and intentional spacing, but the portfolio should have its own identity.

The portfolio should communicate frontend expertise, professional experience, and approach to building high-quality web experiences without depending on confidential client projects. Some professional work is covered by an NDA, so only use approved public work, personal projects, or descriptions that do not disclose protected information.

## Goals

- Present a clear professional identity as a **Frontend Developer**.
- Position the developer around translating designs into responsive, accessible, performant web experiences.
- Showcase technologies and professional experience without relying on NDA-protected screenshots or code.
- Create a distinctive, polished experience through subtle interactive visuals.
- Make it easy for recruiters and potential clients to get in touch.

## Visual Direction

- Editorial, typography-led layout inspired by creative digital studios.
- Strong headline hierarchy, generous whitespace, fine divider lines, and structured grids.
- Use the existing palette: maroon, gray, black, and white.
- Avoid generic portfolio templates, excessive rounded cards, arbitrary skill percentages, and unnecessary decoration.
- Use subtle motion and interactions that support the content rather than compete with it.
- Ensure the site remains accessible, responsive, and performant.

## Site Structure

### 1. Navigation

- Developer wordmark/logo.
- Anchor links: About, Expertise, Experience, Contact.
- Primary CTA: **Get in touch** or **Start a project**.
- Compact sticky navigation with smooth anchor scrolling.
- Keep the navigation uncluttered.

### 2. Hero

**Eyebrow:** Frontend Developer

**Headline:** Bringing your designs to life.

**Expertise tags:**

- UI Implementation
- Accessibility
- Web Performance

**Supporting copy:**

> I build responsive, accessible, and performant web experiences through thoughtful implementation and purposeful engineering.

**Elements:**

- Primary CTA: Explore my work.
- Secondary CTA: Get in touch.
- Scroll cue.
- Interactive background featuring a fine square grid that bends or ripples subtly around pointer movement.
- Keep text readable and visually dominant over the effect.

### 3. About

**Heading:** Frontend Development: Purpose & Performance

**Copy:**

> As a frontend developer, I turn thoughtful designs into engaging, accessible, and responsive web experiences.
>
> I combine an eye for detail with clean, maintainable code to build interfaces that look great, work seamlessly, and perform across devices.

Optionally pair the copy with three principles:

- Precision
- Usability
- Performance

### 4. Technologies & Tools

Use a structured grid grouped by category. Display technologies as recognizable names and/or icons, with subtle hover states. Do not use arbitrary skill-level percentages.

Suggested categories and technologies, to be verified before publishing:

- **Frontend:** HTML, CSS, JavaScript, SCSS, React, Vue, Nuxt, Next.js
- **CMS & Backend:** WordPress, PHP, ACF, WooCommerce, REST APIs
- **Libraries & Tooling:** GSAP, jQuery, Webpack, NPM, Git
- **Testing & QA:** Jest, Mocha, browser testing, debugging, performance audits

Only list technologies actually used. Where appropriate, distinguish professional experience from personal projects or training.

### 5. Professional Experience

Present work history as a vertical timeline. Each entry should include role, company, dates, and a concise summary of responsibilities or achievements.

Initial timeline:

- **Frontend Web Developer | DottyStyle Creative Inc. | March 2024–Present**
  - WordPress development, frontend implementation, integrations, maintenance, and QA across client projects.
- **Junior Web Developer | Straight Login | August 2023–March 2024**
  - Professional web development and project delivery.
- **Frontend Development & QA Intern | Pixel8 | March–May 2023**
  - Vue.js, Quasar, interface implementation, and quality assurance.

Dates and descriptions should be checked for accuracy before publishing.

Include a **Selected Contributions** subsection only where details are safe to disclose. Do not publish confidential client names, private dashboards, source code, unreleased features, internal URLs, proprietary architecture, or unapproved metrics. Anonymization alone does not guarantee NDA compliance.

### 6. Optional Project Highlights

Projects are optional and should be included only if the developer owns the work or has permission to publish it.

Possible content:

- Personal projects.
- Open-source contributions.
- Self-initiated technical demonstrations.
- Approved public client work.
- Anonymized technical case studies, only where permitted.

For each item, explain the problem, approach, technical decisions, and outcome without inventing metrics or disclosing confidential information. If there are not enough approved projects, prioritize experience and technical capabilities instead of adding filler.

### 7. Contact

**Heading:** Interested? Get in touch.

Include:

- Short invitation to make contact.
- Name, email, subject, and message fields.
- Accessible labels and clear validation/error messages.
- A working form integration, such as an email/API service.
- Alternative direct email link.

The form must be functional, not just visual.

### 8. Footer & Interactive Wave

Create a distinctive footer with two parts:

**Top strip**

- LinkedIn, GitHub, Facebook, and other relevant social links.
- Email link if desired.
- `© 2026 Edcel Macawili`.
- Aim for roughly 150–200px on desktop, adapting responsively.

**Canvas region**

- Fill the remaining available footer height, with the overall footer aiming for at least `100svh` where appropriate.
- Use a custom animated wave inspired by the flowing, atmospheric wave visuals associated with classic PlayStation interfaces, but create an original visual treatment.
- Place an oversized, low-contrast developer wordmark behind the wave.
- Use the maroon, gray, black, and white palette with restrained accent highlights.
- Add subtle pointer-driven distortion or interaction.
- Keep animation smooth and lightweight.

## Interaction & Technical Guidance

- **Hero grid:** Canvas 2D or a lightweight CSS grid with pointer-driven distortion.
- **Footer wave:** Canvas 2D with particles, lines, or a mesh using `requestAnimationFrame`.
- **Scrolling:** Native anchor links and smooth scrolling, respecting reduced-motion preferences.
- **Technology grid:** CSS Grid with consistent icon sizing and subtle hover states.
- **Experience timeline:** Semantic HTML with CSS-driven markers and connectors.
- **Contact form:** Accessible validation and a real email/API integration.
- **Responsive behavior:** Reduce animation density and disable or simplify expensive effects on smaller devices.
- Prefer Canvas 2D over WebGL unless complex fluid simulation or shader-based effects are specifically required.
- Respect `prefers-reduced-motion`; provide a static or reduced-motion alternative.
- Maintain readable contrast, keyboard accessibility, semantic HTML, and sensible focus states.
- Ensure canvas visuals are decorative and do not interfere with content or input.

## Content & NDA Constraints

- Do not publish confidential screenshots, client source code, private URLs, internal dashboards, unreleased features, proprietary architecture, or confidential business data.
- Use only work that is owned by the developer, publicly approved, or explicitly authorized for portfolio use.
- Professional experience can still be described at a general level without naming protected clients or exposing protected details.
- Do not fabricate project outcomes, performance figures, or credentials.

## Success Criteria

- Visitors immediately understand the developer's role and value proposition.
- The visual style feels intentional, distinctive, and consistent from hero to footer.
- Technologies and experience are easy to scan.
- NDA restrictions are respected.
- Interactive effects feel polished without harming usability, accessibility, or performance.
- The contact form works, and contact links are easy to find.
- The page works well on desktop, tablet, and mobile.

Dev notes:
Heading font to use Archivo, body font to use Inter.
Primary accent: #3C0007
Main background: #2A2E31
Primary text: #F4F1EC
Secondary text: #A7A7A7
Borders: #45494C
