# Manual Focus Website Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Manual Focus agency website — a static Astro 5 site with markdown-driven blog and FAQ, AEO-optimised, deployed to Vercel.

**Architecture:** Astro 5 static site with Content Layer API (glob loader + Zod schemas) for blog and FAQ content. Vanilla CSS with custom properties for design tokens. Minimal client JS for hamburger menu and FAQ accordion only. Formspree for enquiry form submission.

**Tech Stack:** Astro 5, CSS custom properties, Inter variable font, JSON-LD structured data, Formspree, Plausible Analytics, Vercel

**Spec:** `docs/superpowers/specs/2026-03-12-manual-focus-website-design.md`

---

## Chunk 1: Project Scaffolding & Design System

### Task 1: Initialise Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`

- [ ] **Step 1: Create Astro project**

Run from `C:\Users\james\Desktop\Manual-Focus`:
```bash
npm create astro@latest . -- --template minimal --no-git --no-install
```

- [ ] **Step 2: Install dependencies**

```bash
npm install astro @astrojs/sitemap @astrojs/rss
```

- [ ] **Step 3: Configure Astro**

Update `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://manual-focus.co.uk',
  integrations: [sitemap()],
});
```

- [ ] **Step 4: Verify project builds**

```bash
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git init
git add package.json package-lock.json astro.config.mjs tsconfig.json src/
git commit -m "chore: initialise Astro 5 project with sitemap integration"
```

---

### Task 2: Add Static Assets (Font, Favicon, Logo, Manifest)

**Files:**
- Create: `public/fonts/inter-variable.woff2`
- Create: `public/favicon.svg`
- Create: `public/favicon.ico`
- Create: `public/apple-touch-icon.png`
- Create: `public/site.webmanifest`
- Move: `Manual Focus Logo.svg` → `public/images/manual-focus-logo.svg`

- [ ] **Step 1: Download Inter variable font**

Download Inter variable woff2 from Google Fonts or the Inter GitHub releases. Place at `public/fonts/inter-variable.woff2`.

- [ ] **Step 2: Move and rename logo**

```bash
mkdir -p public/images
cp "Manual Focus Logo.svg" public/images/manual-focus-logo.svg
```

- [ ] **Step 3: Create SVG favicon**

Create `public/favicon.svg` — extract the two overlapping circles from the logo SVG as a standalone favicon mark. Use the off-black `#1D1D1B` colour.

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 138">
  <circle cx="45" cy="45" r="42" fill="none" stroke="#1D1D1B" stroke-width="5.86" stroke-miterlimit="10"/>
  <circle cx="45" cy="93" r="42" fill="none" stroke="#1D1D1B" stroke-width="5.86" stroke-miterlimit="10"/>
</svg>
```

- [ ] **Step 4: Generate fallback favicon.ico and apple-touch-icon.png**

Use a tool (e.g. realfavicongenerator.net or manual export) to create:
- `public/favicon.ico` (32x32) from the circles mark
- `public/apple-touch-icon.png` (180x180) — circles mark on `#F5F0EB` background

- [ ] **Step 5: Create web manifest**

Create `public/site.webmanifest`:
```json
{
  "name": "Manual Focus",
  "short_name": "Manual Focus",
  "icons": [
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ],
  "theme_color": "#F5F0EB",
  "background_color": "#F5F0EB",
  "display": "standalone"
}
```

- [ ] **Step 6: Create placeholder OG image**

Create `public/images/og-default.png` (1200x630) — Manual Focus logo centred on bone background. This can be refined later.

- [ ] **Step 7: Verify build**

```bash
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add public/
git commit -m "chore: add static assets — font, favicons, logo, manifest, OG image"
```

---

### Task 3: Design Tokens & Global Styles

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create global.css with design tokens and base styles**

Create `src/styles/global.css`:
```css
/* ============================================
   Manual Focus — Design Tokens & Base Styles
   ============================================ */

/* --- Tokens --- */
:root {
  /* Colours */
  --color-bg: #F5F0EB;
  --color-text: #1D1D1B;
  --color-text-secondary: #6B6560;
  --color-cta-start: #FF2D78;
  --color-cta-end: #00E5FF;
  --color-cta-gradient: linear-gradient(135deg, var(--color-cta-start), var(--color-cta-end));

  /* Typography */
  --font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-size-body: 1.125rem;
  --font-size-sm: 0.875rem;
  --font-size-lg: 1.5rem;
  --font-size-xl: 2.5rem;
  --font-size-2xl: 4rem;
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --line-height-body: 1.7;
  --line-height-heading: 1.1;

  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  --space-xl: 6rem;
  --space-2xl: 10rem;

  /* Layout */
  --max-width: 1200px;
  --max-width-prose: 720px;

  /* Breakpoints (for reference — used in media queries) */
  /* sm: 640px, md: 768px, lg: 1024px, xl: 1280px */
}

/* --- Reset --- */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* --- Font face --- */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}

/* --- Base --- */
html {
  font-size: 100%;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-body);
  color: var(--color-text);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* --- Typography --- */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
  letter-spacing: -0.02em;
}

h1 { font-size: var(--font-size-2xl); }
h2 { font-size: var(--font-size-xl); }
h3 { font-size: var(--font-size-lg); }

p + p { margin-top: var(--space-sm); }

a {
  color: var(--color-text);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
}

/* --- Utilities --- */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: var(--space-md);
}

.prose {
  max-width: var(--max-width-prose);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* --- Section spacing --- */
.section {
  padding-block: var(--space-xl);
}

@media (max-width: 639px) {
  h1 { font-size: var(--font-size-xl); }
  h2 { font-size: var(--font-size-lg); }
  .section { padding-block: var(--space-lg); }
}

/* --- CTA Button --- */
.btn-cta {
  display: inline-block;
  padding: 0.875rem 2rem;
  background: var(--color-cta-gradient);
  color: #fff;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body);
  text-decoration: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-cta:hover,
.btn-cta:focus-visible {
  opacity: 0.9;
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add design tokens and global styles"
```

---

### Task 4: Base Layout & Skip-to-Content

**Files:**
- Create: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro` (replace default content)

- [ ] **Step 1: Create Base layout**

Create `src/layouts/Base.astro`:
```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
}

const { title, description, ogImage = '/images/og-default.png' } = Astro.props;
const canonicalUrl = new URL(Astro.url.pathname, Astro.site);
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | Manual Focus</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Favicons -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`${title} | Manual Focus`} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(ogImage, Astro.site)} />
  <meta property="og:url" content={canonicalUrl} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${title} | Manual Focus`} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={new URL(ogImage, Astro.site)} />

  <!-- RSS autodiscovery -->
  <link rel="alternate" type="application/rss+xml" title="Manual Focus Blog" href="/rss.xml" />

  <!-- Plausible Analytics (uncomment when account is set up) -->
  <!-- <script defer data-domain="manual-focus.co.uk" src="https://plausible.io/js/script.js"></script> -->
</head>
<body>
  <a href="#main-content" class="sr-only">Skip to content</a>

  <!-- Nav will be added in Task 5 -->

  <main id="main-content">
    <slot />
  </main>

  <!-- Footer will be added in Task 6 -->
</body>
</html>
```

- [ ] **Step 2: Update index.astro to use Base layout**

Replace `src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Home" description="Manual Focus — bringing focus to the noise of digital transformation.">
  <section class="section">
    <div class="container">
      <h1>Manual Focus</h1>
      <p>Site under construction.</p>
    </div>
  </section>
</Base>
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```
Check: Page loads with correct title, font, bone background, off-black text, skip-to-content link works.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro src/pages/index.astro
git commit -m "feat: add Base layout with meta tags, OG, favicons, and skip-to-content"
```

---

### Task 5: Navigation Component

**Files:**
- Create: `src/components/Nav.astro`
- Modify: `src/layouts/Base.astro` (import and add Nav)

- [ ] **Step 1: Create Nav component**

Create `src/components/Nav.astro`:
```astro
---
const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
];
const currentPath = Astro.url.pathname;
---
<header class="nav-header">
  <nav class="nav container" aria-label="Main navigation">
    <a href="/" class="nav-logo" aria-label="Manual Focus — Home">
      <img src="/images/manual-focus-logo.svg" alt="Manual Focus" width="180" height="57" />
    </a>

    <button
      class="nav-toggle"
      aria-expanded="false"
      aria-controls="nav-menu"
      aria-label="Toggle menu"
    >
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
    </button>

    <div class="nav-menu" id="nav-menu">
      <ul class="nav-links">
        {navLinks.map(link => (
          <li>
            <a
              href={link.href}
              class:list={['nav-link', { 'is-active': currentPath.startsWith(link.href) }]}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <a href="/enquire" class="btn-cta nav-cta">Enquire</a>
    </div>
  </nav>
</header>

<style>
  .nav-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: var(--color-bg);
    border-bottom: 1px solid rgba(29, 29, 27, 0.08);
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4.5rem;
  }

  .nav-logo img {
    height: 2rem;
    width: auto;
  }

  .nav-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .nav-toggle-bar {
    display: block;
    width: 24px;
    height: 2px;
    background-color: var(--color-text);
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .nav-menu {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: var(--space-md);
  }

  .nav-link {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text);
    transition: color 0.2s ease;
  }

  .nav-link:hover,
  .nav-link.is-active {
    color: var(--color-text-secondary);
  }

  .nav-cta {
    font-size: var(--font-size-sm);
    padding: 0.625rem 1.5rem;
  }

  @media (max-width: 1023px) {
    .nav-toggle {
      display: flex;
    }

    .nav-menu {
      display: none;
      position: absolute;
      top: 4.5rem;
      left: 0;
      right: 0;
      flex-direction: column;
      background-color: var(--color-bg);
      padding: var(--space-md);
      border-bottom: 1px solid rgba(29, 29, 27, 0.08);
    }

    .nav-menu.is-open {
      display: flex;
    }

    .nav-links {
      flex-direction: column;
      align-items: center;
    }
  }
</style>

<script>
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    const focusableSelector = 'a[href], button:not([disabled])';

    function trapFocus(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !menu.classList.contains('is-open')) return;
      const focusable = [toggle, ...menu.querySelectorAll(focusableSelector)] as HTMLElement[];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    // Focus trap when menu is open
    document.addEventListener('keydown', trapFocus);
  }
</script>
```

- [ ] **Step 2: Add Nav to Base layout**

In `src/layouts/Base.astro`, add import and usage:
```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
// ... rest of frontmatter
---
```
Replace `<!-- Nav will be added in Task 5 -->` with:
```astro
<Nav />
```
Add spacing for fixed nav — add to `<style>` in Base.astro or global.css:
```css
body { padding-top: 4.5rem; }
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```
Check: Fixed nav at top. Logo left, links right. CTA button with gradient. Hamburger appears below 1024px. Menu toggles. Escape closes menu. ARIA attributes update.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/layouts/Base.astro
git commit -m "feat: add responsive navigation with hamburger menu and ARIA support"
```

---

### Task 6: Footer Component

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/Base.astro` (import and add Footer)

- [ ] **Step 1: Create Footer component**

Create `src/components/Footer.astro`:
```astro
---
const year = new Date().getFullYear();
---
<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <img src="/images/manual-focus-logo.svg" alt="Manual Focus" width="140" height="44" />
      <p class="footer-tagline">Bringing focus to the noise.</p>
    </div>

    <nav class="footer-nav" aria-label="Footer navigation">
      <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/enquire">Enquire</a></li>
      </ul>
    </nav>

    <div class="footer-social">
      <a href="https://www.linkedin.com/company/manual-focus" target="_blank" rel="noopener noreferrer" aria-label="Manual Focus on LinkedIn">LinkedIn</a>
    </div>

    <div class="footer-legal">
      <p>&copy; {year} Manual Focus. All rights reserved.</p>
      <a href="/privacy">Privacy Policy</a>
    </div>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid rgba(29, 29, 27, 0.08);
    padding-block: var(--space-lg);
    margin-top: var(--space-xl);
  }

  .footer-inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .footer-tagline {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-top: var(--space-xs);
  }

  .footer-nav ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .footer-nav a {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .footer-nav a:hover {
    color: var(--color-text);
  }

  .footer-social a {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .footer-legal {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .footer-legal a {
    color: var(--color-text-secondary);
  }

  @media (min-width: 1024px) {
    .footer-inner {
      grid-template-columns: 2fr 1fr 1fr 2fr;
      align-items: start;
    }
  }
</style>
```

- [ ] **Step 2: Add Footer to Base layout**

In `src/layouts/Base.astro`, import Footer and replace `<!-- Footer will be added in Task 6 -->`:
```astro
import Footer from '../components/Footer.astro';
```
Place `<Footer />` after closing `</main>`.

- [ ] **Step 3: Run dev server and verify**

Check: Footer renders at bottom. Logo, tagline, nav links, social link, copyright, privacy link. Responsive grid on desktop, stacked on mobile.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/layouts/Base.astro
git commit -m "feat: add footer with nav, social links, and legal info"
```

---

### Task 7: Logo Animation Component

**Files:**
- Create: `src/components/LogoAnimation.astro`

- [ ] **Step 1: Create LogoAnimation component**

Create `src/components/LogoAnimation.astro`:
```astro
---
interface Props {
  animate?: boolean;
}
const { animate = false } = Astro.props;
---
<div class:list={['logo-animation', { 'logo-animation--animate': animate }]} aria-hidden="true">
  <svg viewBox="0 0 90 138" xmlns="http://www.w3.org/2000/svg" class="logo-circles">
    <circle class="circle-top" cx="45" cy="45" r="42" fill="none" stroke="#1D1D1B" stroke-width="5.86" stroke-miterlimit="10"/>
    <circle class="circle-bottom" cx="45" cy="93" r="42" fill="none" stroke="#1D1D1B" stroke-width="5.86" stroke-miterlimit="10"/>
  </svg>
</div>

<style>
  .logo-animation {
    width: 80px;
    height: auto;
  }

  .logo-circles {
    width: 100%;
    height: auto;
  }

  /* Animated state — circles start apart, converge */
  .logo-animation--animate .circle-top {
    animation: drift-top 2s ease-out forwards;
  }

  .logo-animation--animate .circle-bottom {
    animation: drift-bottom 2s ease-out forwards;
  }

  @keyframes drift-top {
    0% { transform: translateY(-20px); opacity: 0; }
    30% { opacity: 1; }
    100% { transform: translateY(0); opacity: 1; }
  }

  @keyframes drift-bottom {
    0% { transform: translateY(20px); opacity: 0; }
    30% { opacity: 1; }
    100% { transform: translateY(0); opacity: 1; }
  }
</style>
```

- [ ] **Step 2: Run dev server and test**

Temporarily import into `index.astro` to verify:
```astro
import LogoAnimation from '../components/LogoAnimation.astro';
```
Add `<LogoAnimation animate />` to the page. Check: circles start apart, drift together smoothly over 2 seconds. Without `animate` prop, they appear in final position.

- [ ] **Step 3: Commit**

```bash
git add src/components/LogoAnimation.astro
git commit -m "feat: add logo animation component with CSS drift-and-converge effect"
```

---

## Chunk 2: Content Collections & SEO Infrastructure

### Task 8: Content Collections Config

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/placeholder.md`
- Create: `src/content/faq/placeholder.md`

- [ ] **Step 1: Create content config with Zod schemas**

Create `src/content.config.ts`:
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ALLOWED_TAGS = [
  'ai',
  'marketing-strategy',
  'fractional-cmo',
  'digital-transformation',
  'brand',
  'go-to-market',
  'web3',
  'fintech',
  'endurance-sports',
  'leadership',
  'productivity',
] as const;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.enum(ALLOWED_TAGS)).min(1),
    description: z.string().max(160),
    image: z.string().optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number(),
  }),
});
// Note: FAQ answers live in the markdown body, not in frontmatter.
// Use entry.body to access the raw markdown answer text.

export const collections = { blog, faq };
```

- [ ] **Step 2: Create placeholder blog post**

Create `src/content/blog/placeholder.md`:
```markdown
---
title: "Why Most Marketing Advice Is Noise"
date: 2026-03-12
tags: ["marketing-strategy"]
description: "The marketing industry has a signal-to-noise problem. Here's how to cut through it."
---

Placeholder content. Replace with real article.
```

- [ ] **Step 3: Create placeholder FAQ entry**

Create `src/content/faq/placeholder.md`:
```markdown
---
question: "Who does Manual Focus work with?"
order: 1
---

Manual Focus works primarily with founders and CEOs of startups and scaleups who need senior marketing leadership without the overhead of a full-time hire. We also work with established businesses navigating digital transformation.
```

- [ ] **Step 4: Verify build with content collections**

```bash
npm run build
```
Expected: Build succeeds, content collections are recognised.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: add content collections config with Zod schemas for blog and FAQ"
```

---

### Task 9: SEO Head Component (JSON-LD)

**Files:**
- Create: `src/components/SEOHead.astro`

- [ ] **Step 1: Create SEOHead component**

Create `src/components/SEOHead.astro`:
```astro
---
interface Props {
  type: 'website' | 'article' | 'faq' | 'profile';
  title: string;
  description: string;
  publishDate?: Date;
  tags?: string[];
  faqItems?: { question: string; answer: string }[];
}

const { type, title, description, publishDate, tags, faqItems } = Astro.props;
const siteUrl = Astro.site?.toString().replace(/\/$/, '') || 'https://manual-focus.co.uk';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Manual Focus',
  url: siteUrl,
  logo: `${siteUrl}/images/manual-focus-logo.svg`,
  description: 'Marketing agency specialising in Fractional CMO and Strategic Consulting for startups and scaleups.',
  sameAs: [
    'https://www.linkedin.com/company/manual-focus',
    // Add Companies House URL when registered
  ],
  founder: {
    '@type': 'Person',
    name: 'James Vickers',
    jobTitle: 'Founder',
    sameAs: [
      'https://www.linkedin.com/in/jamesvickers',
      // Add other profiles: Twitter/X, Companies House director page, etc.
    ],
  },
};

const profileSchema = type === 'profile' ? {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: 'James Vickers',
    jobTitle: 'Founder, Manual Focus',
    description: 'Senior marketing leader with 10+ years of experience across cycling, fintech, Web3, and AI.',
    sameAs: [
      'https://www.linkedin.com/in/jamesvickers',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Manual Focus',
      url: siteUrl,
    },
  },
} : null;

const articleSchema = type === 'article' && publishDate ? {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
  description,
  datePublished: publishDate.toISOString(),
  author: {
    '@type': 'Person',
    name: 'James Vickers',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Manual Focus',
    logo: { '@type': 'ImageObject', url: `${siteUrl}/images/manual-focus-logo.svg` },
  },
  keywords: tags?.join(', '),
} : null;

const faqSchema = type === 'faq' && faqItems ? {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
} : null;
---

<script type="application/ld+json" set:html={JSON.stringify(organizationSchema)} />
{profileSchema && <script type="application/ld+json" set:html={JSON.stringify(profileSchema)} />}
{articleSchema && <script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />}
{faqSchema && <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />}
```

- [ ] **Step 2: Add SEOHead to Base layout**

In `src/layouts/Base.astro`, import and add inside `<head>`:
```astro
import SEOHead from '../components/SEOHead.astro';
```
Add before closing `</head>`:
```astro
<slot name="seo" />
```
This allows pages to inject their SEOHead with the appropriate type.

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/SEOHead.astro src/layouts/Base.astro
git commit -m "feat: add SEOHead component with Organization, BlogPosting, and FAQPage JSON-LD"
```

---

### Task 10: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Create RSS feed endpoint**

Create `src/pages/rss.xml.ts`:
```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: 'Manual Focus — Blog',
    description: 'Perspectives on marketing, AI, and digital transformation from Manual Focus.',
    site: context.site!.toString(),
    items: sortedPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
  });
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds. `dist/rss.xml` is generated.

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat: add RSS feed for blog posts"
```

---

## Chunk 3: Homepage

### Task 11: Homepage — Hero Section

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build hero section**

Replace the content of `src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import LogoAnimation from '../components/LogoAnimation.astro';
import SEOHead from '../components/SEOHead.astro';
---
<Base title="Home" description="Manual Focus — bringing focus to the noise of digital transformation. Fractional CMO and Strategic Consulting for founders and CEOs.">
  <SEOHead slot="seo" type="website" title="Home" description="Manual Focus — bringing focus to the noise of digital transformation." />

  <!-- Hero -->
  <section class="hero section">
    <div class="container hero-inner">
      <LogoAnimation animate />
      <h1 class="hero-headline">Most marketing advice is noise.<br />We bring focus.</h1>
      <p class="hero-sub">Fractional CMO and Strategic Consulting for founders who refuse to waste time on what doesn't work.</p>
      <a href="/enquire" class="btn-cta">Enquire</a>
    </div>
  </section>
</Base>

<style>
  .hero {
    padding-block: var(--space-2xl) var(--space-xl);
    text-align: center;
  }

  .hero-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
  }

  .hero-headline {
    max-width: 900px;
    text-transform: uppercase;
  }

  .hero-sub {
    max-width: 600px;
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
  }
</style>
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```
Check: Logo animation plays, bold headline, subline, gradient CTA button. Generous whitespace. Responsive text scaling.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add homepage hero section with logo animation and CTA"
```

---

### Task 12a: Homepage — Problem Diagnosis & Services Sections

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add problem diagnosis and services sections**

After the hero section in `src/pages/index.astro`, add:

```astro
  <!-- Problem Diagnosis -->
  <section class="section">
    <div class="container">
      <h2 class="section-headline">You don't have a marketing problem.<br />You have a focus problem.</h2>
      <p class="section-body">Every week there's a new tool, a new trend, a new "must-do" strategy. Your inbox is full of advice from people who've never built what you're building. The noise is deafening — and it's costing you time, money, and momentum.</p>
    </div>
  </section>

  <!-- What We Do -->
  <section class="section section-alt">
    <div class="container">
      <h2 class="section-headline">What we do</h2>
      <div class="services-grid">
        <div class="service-card">
          <h3>Fractional CMO</h3>
          <p>Embedded marketing leadership for your business. Not advice from the sidelines — hands on the wheel, accountable for outcomes. Strategy, team building, and execution oversight without the full-time overhead.</p>
        </div>
        <div class="service-card">
          <h3>Strategic Consulting</h3>
          <p>Focused engagements that solve specific problems. Brand positioning, go-to-market strategy, marketing audits. We diagnose, we recommend, we move on. No retainer padding.</p>
        </div>
      </div>
      <p class="section-note">We don't do execution for hire. We don't produce decks that gather dust. We lead, or we advise. That's it.</p>
      <a href="/services" class="btn-cta" style="margin-top: var(--space-md);">Learn more</a>
    </div>
  </section>
```

- [ ] **Step 2: Add styles for these sections**

Add to `<style>` in `index.astro`:
```css
  .section-headline {
    text-transform: uppercase;
    max-width: 800px;
  }

  .section-body {
    max-width: 700px;
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    margin-top: var(--space-sm);
  }

  .section-note {
    color: var(--color-text-secondary);
    font-style: italic;
    margin-top: var(--space-md);
  }

  .section-alt {
    background-color: rgba(29, 29, 27, 0.02);
  }

  .services-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);
    margin-top: var(--space-md);
  }

  .service-card {
    padding: var(--space-md);
    border: 1px solid rgba(29, 29, 27, 0.08);
    border-radius: 4px;
  }

  .service-card h3 {
    text-transform: uppercase;
    margin-bottom: var(--space-xs);
  }

  .service-card p {
    color: var(--color-text-secondary);
  }

  @media (min-width: 640px) {
    .services-grid { grid-template-columns: 1fr 1fr; }
  }
```

- [ ] **Step 3: Run dev server and verify**

Check: Problem and services sections render. Services grid is responsive (stacked on mobile, side by side on tablet+).

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add homepage problem diagnosis and services sections"
```

---

### Task 12b: Homepage — Logo Bar & Credibility

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add logo bar and credibility sections**

After the services section in `index.astro`, add:

```astro
  <!-- Brands We've Worked With -->
  <section class="section">
    <div class="container">
      <h2 class="section-headline">Brands we've worked with</h2>
      <div class="logo-bar">
        <!-- Place brand logo SVGs/PNGs in public/images/brand-logos/ -->
        <!-- Use greyscale or off-black versions for visual consistency -->
        <img src="/images/brand-logos/classified-cycling.svg" alt="Classified Cycling" class="brand-logo" width="140" height="40" loading="lazy" />
        <img src="/images/brand-logos/wahoo.svg" alt="Wahoo" class="brand-logo" width="140" height="40" loading="lazy" />
        <img src="/images/brand-logos/wattbike.svg" alt="Wattbike" class="brand-logo" width="140" height="40" loading="lazy" />
        <img src="/images/brand-logos/ribble-cycles.svg" alt="Ribble Cycles" class="brand-logo" width="140" height="40" loading="lazy" />
        <img src="/images/brand-logos/rgt.svg" alt="RGT" class="brand-logo" width="140" height="40" loading="lazy" />
        <img src="/images/brand-logos/motif-ai.svg" alt="motif AI" class="brand-logo" width="140" height="40" loading="lazy" />
        <img src="/images/brand-logos/muuvr.svg" alt="Muuvr" class="brand-logo" width="140" height="40" loading="lazy" />
        <img src="/images/brand-logos/planet-x.svg" alt="Planet X" class="brand-logo" width="140" height="40" loading="lazy" />
        <img src="/images/brand-logos/pelotan.svg" alt="Pelotan" class="brand-logo" width="140" height="40" loading="lazy" />
      </div>
    </div>
  </section>

  <!-- Operator Credibility -->
  <section class="section section-alt">
    <div class="container">
      <h2 class="section-headline">Built by an operator,<br />not a consultant.</h2>
      <p class="section-body">James Vickers has spent over a decade in the trenches — co-founding a virtual cycling platform acquired by Wahoo Fitness, growing registered users from 19k to 350k, turning an NPS score from -65 to +45, and securing 160+ media placements for a single product launch. He's been CMO, Head of Marketing, and Fractional CMO across cycling, fintech, Web3, and AI. He doesn't theorise. He builds.</p>
      <a href="/about" class="btn-cta" style="margin-top: var(--space-md);">Read the full story</a>
    </div>
  </section>
```

- [ ] **Step 2: Add logo bar and credibility styles**

Add to `<style>` in `index.astro`:
```css
  .logo-bar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
    margin-top: var(--space-md);
    align-items: center;
    justify-items: center;
  }

  .brand-logo {
    height: 2.5rem;
    width: auto;
    max-width: 140px;
    object-fit: contain;
    filter: grayscale(100%);
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .brand-logo:hover {
    opacity: 1;
  }

  @media (min-width: 640px) {
    .logo-bar { grid-template-columns: repeat(3, 1fr); }
  }

  @media (min-width: 1024px) {
    .logo-bar { grid-template-columns: repeat(5, 1fr); }
  }
```

Note: Brand logo files need to be sourced and placed in `public/images/brand-logos/`. Use placeholder SVGs during development if logos aren't available yet. The build won't break if images are missing — they'll show as broken images.

- [ ] **Step 3: Run dev server and verify**

Check: Logo bar responsive (2 cols mobile, 3 cols tablet, 5 cols desktop). Credibility section readable. CTA links to /about.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add homepage logo bar and operator credibility sections"
```

---

### Task 12c: Homepage — Blog Previews & CTA Close

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/BlogCard.astro`

- [ ] **Step 1: Create BlogCard component**

Create `src/components/BlogCard.astro`:
```astro
---
interface Props {
  title: string;
  description: string;
  date: Date;
  slug: string;
}
const { title, description, date, slug } = Astro.props;
const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
---
<article class="blog-card">
  <time datetime={date.toISOString()}>{formattedDate}</time>
  <h3><a href={`/blog/${slug}/`}>{title}</a></h3>
  <p>{description}</p>
</article>

<style>
  .blog-card {
    padding: var(--space-md);
    border: 1px solid rgba(29, 29, 27, 0.08);
    border-radius: 4px;
  }

  .blog-card time {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .blog-card h3 {
    margin-top: var(--space-xs);
    font-size: var(--font-size-body);
  }

  .blog-card h3 a {
    text-decoration: none;
  }

  .blog-card h3 a:hover {
    text-decoration: underline;
  }

  .blog-card p {
    margin-top: var(--space-xs);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }
</style>
```

Note on `post.id`: With Astro 5's `glob()` loader, `post.id` resolves to the file stem (e.g. `placeholder`, not `placeholder.md`). This is what we use for URL slugs throughout: `/blog/${post.id}/`. The `[...slug].astro` route uses `params: { slug: post.id }` — these must match.

- [ ] **Step 2: Add blog previews and CTA close sections**

Add to the frontmatter of `index.astro`:
```astro
import { getCollection } from 'astro:content';
import BlogCard from '../components/BlogCard.astro';

const posts = (await getCollection('blog'))
  .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
  .slice(0, 3);
```

After the credibility section, add:
```astro
  <!-- Perspective (Blog Previews) -->
  <section class="section">
    <div class="container">
      <h2 class="section-headline">Perspective</h2>
      <div class="blog-grid">
        {posts.map(post => (
          <BlogCard
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            slug={post.id}
          />
        ))}
      </div>
    </div>
  </section>

  <!-- CTA Close -->
  <section class="section cta-close">
    <div class="container">
      <h2 class="section-headline">Ready to cut through the noise?</h2>
      <p class="section-body">This isn't a contact form. It's the start of a conversation.</p>
      <a href="/enquire" class="btn-cta">Enquire</a>
    </div>
  </section>
```

- [ ] **Step 3: Add blog grid and CTA close styles**

Add to `<style>` in `index.astro`:
```css
  .blog-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);
    margin-top: var(--space-md);
  }

  .cta-close {
    text-align: center;
    padding-block: var(--space-2xl);
  }

  @media (min-width: 640px) {
    .blog-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (min-width: 1024px) {
    .blog-grid { grid-template-columns: repeat(3, 1fr); }
  }
```

- [ ] **Step 4: Run dev server and verify**

Check: Blog preview cards render with placeholder post. CTA close section centred. All responsive.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/components/BlogCard.astro
git commit -m "feat: add homepage blog previews and CTA close section"
```

---

## Chunk 4: Inner Pages

### Task 13: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create About page**

Create `src/pages/about.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import SEOHead from '../components/SEOHead.astro';
---
<Base title="About" description="The story behind Manual Focus — bringing clarity to marketing in an age of noise.">
  <SEOHead slot="seo" type="profile" title="About" description="The story behind Manual Focus." />

  <section class="section">
    <div class="container prose">
      <h1>Two circles. One intersection.<br />That's where we work.</h1>
      <p class="lead">The Manual Focus logo is two circles drifting into alignment. They represent the tension between old-world marketing and new-world technology — the overwhelming noise of digital transformation. The intersection is where clarity lives. That's where we operate.</p>
    </div>
  </section>

  <section class="section">
    <div class="container prose">
      <h2>The operator behind the focus</h2>
      <p>James Vickers has spent over a decade at the intersection of marketing and emerging technology. From co-founding a virtual cycling platform that grew to 350,000 users and was acquired by Wahoo Fitness, to leading marketing for a $200M privacy-focused stablecoin, to advising AI-powered wealth managers — he's consistently been early to where marketing meets disruption.</p>
      <p>He's not a consultant who theorises from the sidelines. He's an operator who's built teams, launched products, turned around brands, and driven measurable growth across cycling, endurance sports, fintech, Web3, and AI.</p>

      <h2>The numbers</h2>
      <ul class="stats-list">
        <li><strong>19k → 350k</strong> registered users at RGT Cycling</li>
        <li><strong>NPS: -65 → +45</strong> brand turnaround</li>
        <li><strong>160+</strong> media placements for a single product launch</li>
        <li><strong>Brand recall: 0 → 95</strong> (prompted)</li>
        <li><strong>20% → 45%</strong> conversion rate improvement</li>
        <li><strong>2.2M+</strong> sessions driven to platform</li>
      </ul>

      <h2>Why Manual Focus exists</h2>
      <p>The marketing industry has a signal-to-noise problem. Every week there's a new tool, a new framework, a new "game-changer." Most of it is distraction. Manual Focus exists to cut through that — to give founders and CEOs the senior marketing leadership they need, without the noise, without the theatre, and without the overhead of a full-time hire.</p>
      <p>We bring focus. That's it.</p>

      <a href="/enquire" class="btn-cta" style="margin-top: var(--space-lg);">Start a conversation</a>
    </div>
  </section>
</Base>

<style>
  .lead {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
  }

  .stats-list {
    list-style: none;
    display: grid;
    gap: var(--space-sm);
    margin-top: var(--space-sm);
  }

  .stats-list li {
    font-size: var(--font-size-lg);
    padding: var(--space-sm) 0;
    border-bottom: 1px solid rgba(29, 29, 27, 0.08);
  }

  .stats-list strong {
    display: block;
    font-size: var(--font-size-xl);
  }
</style>
```

- [ ] **Step 2: Verify in dev server**

Navigate to `/about`. Check: headings, narrative, stats, CTA. Responsive. Prose max-width.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add About page with brand story, credibility stats, and CTA"
```

---

### Task 14: Services Page

**Files:**
- Create: `src/pages/services.astro`

- [ ] **Step 1: Create Services page**

Create `src/pages/services.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import SEOHead from '../components/SEOHead.astro';
---
<Base title="Services" description="Fractional CMO and Strategic Consulting — senior marketing leadership for founders and CEOs.">
  <SEOHead slot="seo" type="website" title="Services" description="Fractional CMO and Strategic Consulting for founders and CEOs." />

  <section class="section">
    <div class="container">
      <h1>Two ways to work with us</h1>
      <p class="lead">Leadership or advice. Embedded or focused. Either way, you get senior marketing expertise that moves the needle — not a deck that gathers dust.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="service-detail">
        <h2>Fractional CMO</h2>
        <p class="service-for">For founders and CEOs who need a marketing leader but aren't ready for (or don't need) a full-time hire.</p>
        <p>You get an experienced CMO embedded in your business. Not observing from a distance — hands on the wheel. I lead your marketing strategy, build or restructure your team, manage agencies, own your go-to-market, and report directly to you.</p>
        <h3>What this includes</h3>
        <ul>
          <li>Marketing strategy development and execution oversight</li>
          <li>Brand positioning and messaging</li>
          <li>Go-to-market planning and delivery</li>
          <li>Team building, hiring, and performance management</li>
          <li>Agency selection and management</li>
          <li>Board and investor reporting</li>
        </ul>
        <h3>What this is not</h3>
        <p>This is not a consulting engagement. I don't deliver a strategy document and walk away. I lead. I'm accountable. If it's not working, it's on me to fix it.</p>
        <a href="/enquire" class="btn-cta" style="margin-top: var(--space-md);">Enquire about Fractional CMO</a>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="service-detail">
        <h2>Strategic Consulting</h2>
        <p class="service-for">For businesses that need expert input on a specific challenge — without a long-term commitment.</p>
        <p>Focused engagements with a clear scope and timeline. I diagnose the problem, deliver actionable recommendations, and move on. No padding, no retainer creep.</p>
        <h3>What this includes</h3>
        <ul>
          <li>Marketing audits and diagnostic reviews</li>
          <li>Brand positioning and messaging strategy</li>
          <li>Go-to-market strategy for new products or markets</li>
          <li>Market analysis and competitive intelligence</li>
          <li>Organisational design for marketing functions</li>
        </ul>
        <h3>What this is not</h3>
        <p>This is not execution for hire. I don't write your blog posts, run your ads, or manage your social channels. I give you the strategy and the clarity to do it right — or to hire the right people who will.</p>
        <a href="/enquire" class="btn-cta" style="margin-top: var(--space-md);">Enquire about Strategic Consulting</a>
      </div>
    </div>
  </section>
</Base>

<style>
  .lead {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    max-width: var(--max-width-prose);
  }

  .service-detail {
    max-width: var(--max-width-prose);
  }

  .service-for {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    font-style: italic;
    margin-top: var(--space-sm);
  }

  .service-detail h3 {
    margin-top: var(--space-md);
    text-transform: uppercase;
    font-size: var(--font-size-body);
  }

  .service-detail ul {
    margin-top: var(--space-xs);
    padding-left: var(--space-md);
    color: var(--color-text-secondary);
  }

  .service-detail ul li {
    margin-top: var(--space-xs);
  }

  .service-detail > p {
    margin-top: var(--space-sm);
  }

  .section-alt {
    background-color: rgba(29, 29, 27, 0.02);
  }
</style>
```

- [ ] **Step 2: Verify in dev server**

Navigate to `/services`. Check: Two sections, clear structure, CTAs, responsive.

- [ ] **Step 3: Commit**

```bash
git add src/pages/services.astro
git commit -m "feat: add Services page with Fractional CMO and Strategic Consulting sections"
```

---

### Task 15: Blog Archive & Post Pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`
- Create: `src/pages/blog/tag/[tag].astro`
- Create: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Create BlogPost layout**

Create `src/layouts/BlogPost.astro`:
```astro
---
import Base from './Base.astro';
import SEOHead from '../components/SEOHead.astro';

interface Props {
  title: string;
  description: string;
  date: Date;
  tags: string[];
  image?: string;
}

const { title, description, date, tags, image } = Astro.props;
const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
---
<Base title={title} description={description} ogImage={image}>
  <SEOHead slot="seo" type="article" title={title} description={description} publishDate={date} tags={tags} />

  <article class="section">
    <div class="container prose">
      <header class="post-header">
        <time datetime={date.toISOString()}>{formattedDate}</time>
        <h1>{title}</h1>
        <div class="post-tags">
          {tags.map(tag => (
            <a href={`/blog/tag/${tag}/`} class="tag">{tag.replace(/-/g, ' ')}</a>
          ))}
        </div>
      </header>

      <div class="post-content">
        <slot />
      </div>

      <footer class="post-footer">
        <a href="/blog">Back to all posts</a>
      </footer>
    </div>
  </article>
</Base>

<style>
  .post-header {
    margin-bottom: var(--space-lg);
  }

  .post-header time {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .post-header h1 {
    margin-top: var(--space-xs);
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-sm);
  }

  .tag {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
    padding: 0.25rem 0.75rem;
    border: 1px solid rgba(29, 29, 27, 0.15);
    border-radius: 2px;
    text-transform: capitalize;
  }

  .tag:hover {
    color: var(--color-text);
    border-color: var(--color-text);
  }

  .post-content {
    font-size: var(--font-size-body);
    line-height: var(--line-height-body);
  }

  .post-content :global(h2) {
    margin-top: var(--space-lg);
    margin-bottom: var(--space-sm);
  }

  .post-content :global(h3) {
    margin-top: var(--space-md);
    margin-bottom: var(--space-xs);
  }

  .post-content :global(p) {
    margin-bottom: var(--space-sm);
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    margin-bottom: var(--space-sm);
    padding-left: var(--space-md);
  }

  .post-footer {
    margin-top: var(--space-xl);
    padding-top: var(--space-md);
    border-top: 1px solid rgba(29, 29, 27, 0.08);
  }
</style>
```

- [ ] **Step 2: Create blog post dynamic route**

Create `src/pages/blog/[...slug].astro`:
```astro
---
import { getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<BlogPost
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  tags={post.data.tags}
  image={post.data.image}
>
  <Content />
</BlogPost>
```

- [ ] **Step 3: Create blog archive page**

Create `src/pages/blog/index.astro`:
```astro
---
import Base from '../../layouts/Base.astro';
import SEOHead from '../../components/SEOHead.astro';
import BlogCard from '../../components/BlogCard.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog'))
  .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

const allTags = [...new Set(posts.flatMap(p => p.data.tags))].sort();
---
<Base title="Blog" description="Perspectives on marketing, AI, and digital transformation from Manual Focus.">
  <SEOHead slot="seo" type="website" title="Blog" description="Perspectives on marketing, AI, and digital transformation." />

  <section class="section">
    <div class="container">
      <h1>Perspective</h1>
      <p class="lead">Opinions, insights, and the occasional provocation.</p>

      <!-- Tag filtering uses static navigation (separate pages per tag), not client-side JS filtering -->
      <nav class="tag-filter" aria-label="Filter by tag">
        <a href="/blog" class="tag tag-current">All</a>
        {allTags.map(tag => (
          <a href={`/blog/tag/${tag}/`} class="tag">{tag.replace(/-/g, ' ')}</a>
        ))}
      </nav>

      <div class="blog-grid">
        {posts.map(post => (
          <BlogCard
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            slug={post.id}
          />
        ))}
      </div>
    </div>
  </section>
</Base>

<style>
  .lead {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }

  .tag-filter {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-bottom: var(--space-lg);
  }

  .tag {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
    padding: 0.25rem 0.75rem;
    border: 1px solid rgba(29, 29, 27, 0.15);
    border-radius: 2px;
    text-transform: capitalize;
  }

  .tag:hover,
  .tag-current {
    color: var(--color-text);
    border-color: var(--color-text);
  }

  .blog-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  @media (min-width: 640px) {
    .blog-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (min-width: 1024px) {
    .blog-grid { grid-template-columns: repeat(3, 1fr); }
  }
</style>
```

- [ ] **Step 4: Create tag archive page**

Create `src/pages/blog/tag/[tag].astro`:
```astro
---
import Base from '../../../layouts/Base.astro';
import SEOHead from '../../../components/SEOHead.astro';
import BlogCard from '../../../components/BlogCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const allTags = [...new Set(posts.flatMap(p => p.data.tags))];

  return allTags.map(tag => ({
    params: { tag },
    props: {
      tag,
      posts: posts
        .filter(p => p.data.tags.includes(tag))
        .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()),
    },
  }));
}

const { tag, posts } = Astro.props;
const displayTag = tag.replace(/-/g, ' ');
---
<Base title={`${displayTag} — Blog`} description={`Posts tagged "${displayTag}" on the Manual Focus blog.`}>
  <SEOHead slot="seo" type="website" title={`${displayTag} — Blog`} description={`Posts tagged "${displayTag}" on the Manual Focus blog.`} />
  <section class="section">
    <div class="container">
      <h1 style="text-transform: capitalize;">{displayTag}</h1>
      <p><a href="/blog">← All posts</a></p>

      <div class="blog-grid">
        {posts.map((post: any) => (
          <BlogCard
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            slug={post.id}
          />
        ))}
      </div>
    </div>
  </section>
</Base>

<style>
  .blog-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);
    margin-top: var(--space-md);
  }

  @media (min-width: 640px) {
    .blog-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (min-width: 1024px) {
    .blog-grid { grid-template-columns: repeat(3, 1fr); }
  }
</style>
```

- [ ] **Step 5: Verify build and navigation**

```bash
npm run build
```
Check: Blog archive, individual post, tag page all build. Navigate between them in dev server.

- [ ] **Step 6: Commit**

```bash
git add src/pages/blog/ src/layouts/BlogPost.astro
git commit -m "feat: add blog archive, individual post, and tag archive pages"
```

---

### Task 16: FAQ Page

**Files:**
- Create: `src/components/FaqAccordion.astro`
- Create: `src/pages/faq/index.astro`

- [ ] **Step 1: Create FaqAccordion component**

Create `src/components/FaqAccordion.astro`:
```astro
---
interface Props {
  items: { question: string; answer: string; id: string }[];
}
const { items } = Astro.props;
---
<div class="faq-accordion" role="list">
  {items.map((item, i) => (
    <div class="faq-item" role="listitem">
      <h3>
        <button
          class="faq-trigger"
          aria-expanded="false"
          aria-controls={`faq-panel-${item.id}`}
          id={`faq-trigger-${item.id}`}
        >
          <span>{item.question}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
      </h3>
      <div
        class="faq-panel"
        id={`faq-panel-${item.id}`}
        role="region"
        aria-labelledby={`faq-trigger-${item.id}`}
        hidden
      >
        <p>{item.answer}</p>
      </div>
    </div>
  ))}
</div>

<style>
  .faq-accordion {
    max-width: var(--max-width-prose);
  }

  .faq-item {
    border-bottom: 1px solid rgba(29, 29, 27, 0.08);
  }

  .faq-trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--space-md) 0;
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-family);
    font-size: var(--font-size-body);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    text-align: left;
    gap: var(--space-sm);
  }

  .faq-trigger:hover {
    color: var(--color-text-secondary);
  }

  .faq-icon {
    font-size: var(--font-size-lg);
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .faq-trigger[aria-expanded="true"] .faq-icon {
    transform: rotate(45deg);
  }

  .faq-panel {
    padding-bottom: var(--space-md);
  }

  .faq-panel p {
    color: var(--color-text-secondary);
    line-height: var(--line-height-body);
  }
</style>

<script>
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId!);

      trigger.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });

    trigger.addEventListener('keydown', (e) => {
      const items = Array.from(triggers);
      const index = items.indexOf(trigger);
      let target: Element | null = null;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        target = items[(index + 1) % items.length];
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        target = items[(index - 1 + items.length) % items.length];
      } else if (e.key === 'Home') {
        e.preventDefault();
        target = items[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        target = items[items.length - 1];
      }

      if (target) (target as HTMLElement).focus();
    });
  });
</script>
```

- [ ] **Step 2: Create FAQ page**

Create `src/pages/faq/index.astro`:
```astro
---
import Base from '../../layouts/Base.astro';
import SEOHead from '../../components/SEOHead.astro';
import FaqAccordion from '../../components/FaqAccordion.astro';
import { getCollection } from 'astro:content';

const faqEntries = (await getCollection('faq'))
  .sort((a, b) => a.data.order - b.data.order);

// FAQ answers are in the markdown body. entry.body gives the raw markdown string.
const faqItems = faqEntries.map((entry) => ({
  question: entry.data.question,
  answer: entry.body ?? '',
  id: entry.id,
}));

const faqSchemaItems = faqItems.map(item => ({
  question: item.question,
  answer: item.answer,
}));
---
<Base title="FAQ" description="Frequently asked questions about working with Manual Focus.">
  <SEOHead slot="seo" type="faq" title="FAQ" description="Frequently asked questions about Manual Focus." faqItems={faqSchemaItems} />

  <section class="section">
    <div class="container">
      <h1>Frequently asked questions</h1>
      <p class="lead">Straight answers. No jargon.</p>
      <FaqAccordion items={faqItems} />
    </div>
  </section>

  <section class="section" style="text-align: center;">
    <div class="container">
      <h2>Still have questions?</h2>
      <a href="/enquire" class="btn-cta" style="margin-top: var(--space-sm);">Get in touch</a>
    </div>
  </section>
</Base>

<style>
  .lead {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-lg);
  }
</style>
```

Note: `entry.body` returns the raw markdown body as a string. Since FAQ answers are short single-paragraph answers without complex formatting, rendering them inside `<p>` tags works fine. If answers later need markdown formatting (bold, links, etc.), refactor to use `render()` and inject HTML via `set:html`.

- [ ] **Step 3: Verify in dev server**

Navigate to `/faq`. Check: Accordion opens/closes, keyboard navigation works (arrow keys, Home, End), ARIA attributes update, FAQ schema in page source.

- [ ] **Step 4: Commit**

```bash
git add src/components/FaqAccordion.astro src/pages/faq/
git commit -m "feat: add FAQ page with accessible accordion and FAQPage schema"
```

---

### Task 17: Enquire Page

**Files:**
- Create: `src/components/EnquiryForm.astro`
- Create: `src/pages/enquire.astro`

- [ ] **Step 1: Create EnquiryForm component**

Create `src/components/EnquiryForm.astro`:
```astro
<form
  class="enquiry-form"
  action="https://formspree.io/f/YOUR_FORM_ID"
  method="POST"
>
  <div class="form-field">
    <label for="name">Name <span aria-hidden="true">*</span></label>
    <input type="text" id="name" name="name" required autocomplete="name" />
  </div>

  <div class="form-field">
    <label for="company">Company <span aria-hidden="true">*</span></label>
    <input type="text" id="company" name="company" required autocomplete="organization" />
  </div>

  <div class="form-field">
    <label for="email">Email <span aria-hidden="true">*</span></label>
    <input type="email" id="email" name="email" required autocomplete="email" />
  </div>

  <div class="form-field">
    <label for="challenge">What's the challenge? <span aria-hidden="true">*</span></label>
    <textarea id="challenge" name="challenge" rows="5" required></textarea>
  </div>

  <div class="form-field">
    <label for="source">How did you find us?</label>
    <select id="source" name="source">
      <option value="">Select one (optional)</option>
      <option value="linkedin">LinkedIn</option>
      <option value="referral">Referral</option>
      <option value="search">Search engine</option>
      <option value="social">Social media</option>
      <option value="event">Event or conference</option>
      <option value="other">Other</option>
    </select>
  </div>

  <button type="submit" class="btn-cta">Send enquiry</button>

  <div class="form-message form-success" hidden>
    Thanks. We'll be in touch within 48 hours.
  </div>

  <div class="form-message form-error" hidden>
    Something went wrong. Please try again or email us directly.
  </div>
</form>

<style>
  .enquiry-form {
    max-width: var(--max-width-prose);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .form-field label {
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .form-field input,
  .form-field textarea,
  .form-field select {
    font-family: var(--font-family);
    font-size: var(--font-size-body);
    padding: 0.75rem;
    border: 1px solid rgba(29, 29, 27, 0.2);
    border-radius: 4px;
    background-color: transparent;
    color: var(--color-text);
  }

  .form-field input:focus,
  .form-field textarea:focus,
  .form-field select:focus {
    outline: 2px solid var(--color-text);
    outline-offset: 2px;
  }

  .form-field textarea {
    resize: vertical;
  }

  .form-message {
    padding: var(--space-sm);
    border-radius: 4px;
    font-weight: var(--font-weight-bold);
  }

  .form-success {
    color: #0a6e3a;
    background-color: #e6f9ee;
  }

  .form-error {
    color: #9e2a2b;
    background-color: #fde8e8;
  }
</style>

<script>
  const form = document.querySelector('.enquiry-form') as HTMLFormElement;
  const successMsg = form?.querySelector('.form-success') as HTMLElement;
  const errorMsg = form?.querySelector('.form-error') as HTMLElement;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    successMsg.hidden = true;
    errorMsg.hidden = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        successMsg.hidden = false;
        // Track form submission as Plausible custom goal
        if (typeof window.plausible === 'function') {
          window.plausible('Enquiry Submitted');
        }
      } else {
        errorMsg.hidden = false;
      }
    } catch {
      errorMsg.hidden = false;
    }
  });
</script>
```

- [ ] **Step 2: Create Enquire page**

Create `src/pages/enquire.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import SEOHead from '../components/SEOHead.astro';
import EnquiryForm from '../components/EnquiryForm.astro';
---
<Base title="Enquire" description="Start a conversation with Manual Focus about your marketing challenges.">
  <SEOHead slot="seo" type="website" title="Enquire" description="Start a conversation with Manual Focus." />

  <section class="section">
    <div class="container">
      <h1>Let's talk</h1>
      <p class="lead">This isn't a contact form. It's the start of a conversation.<br />Tell us where you are, and we'll tell you honestly if we can help.</p>
      <EnquiryForm />
    </div>
  </section>
</Base>

<style>
  .lead {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-lg);
    max-width: var(--max-width-prose);
  }
</style>
```

- [ ] **Step 3: Verify in dev server**

Navigate to `/enquire`. Check: All fields render, required validation works, labels linked to inputs, focus states visible, form layout responsive.

Note: Form submission won't work until Formspree is configured. Replace `YOUR_FORM_ID` with the real ID when ready.

- [ ] **Step 4: Commit**

```bash
git add src/components/EnquiryForm.astro src/pages/enquire.astro
git commit -m "feat: add Enquire page with accessible form and Formspree integration"
```

---

### Task 18: 404 Page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create 404 page**

Create `src/pages/404.astro`:
```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Page Not Found" description="The page you're looking for doesn't exist.">
  <section class="section not-found">
    <div class="container">
      <h1>You've lost focus.<br />Let's get you back.</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" class="btn-cta" style="margin-top: var(--space-md);">Back to home</a>
    </div>
  </section>
</Base>

<style>
  .not-found {
    text-align: center;
    padding-block: var(--space-2xl);
  }

  .not-found p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    margin-top: var(--space-sm);
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: `dist/404.html` is generated.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add on-brand 404 page"
```

---

### Task 18b: Privacy Policy Page

**Files:**
- Create: `src/pages/privacy.astro`

- [ ] **Step 1: Create Privacy Policy page**

Create `src/pages/privacy.astro`:
```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Privacy Policy" description="Manual Focus privacy policy — how we handle your data.">
  <section class="section">
    <div class="container prose">
      <h1>Privacy Policy</h1>
      <p><em>Last updated: March 2026</em></p>

      <h2>Who we are</h2>
      <p>Manual Focus is a marketing consultancy operated by James Vickers. Our website address is https://manual-focus.co.uk.</p>

      <h2>Analytics</h2>
      <p>We use Plausible Analytics, a privacy-respecting analytics tool that does not use cookies, does not collect personal data, and is fully compliant with GDPR, CCPA, and PECR. No consent banner is required. All data is aggregated and cannot be used to identify individual visitors.</p>

      <h2>Contact form</h2>
      <p>When you submit an enquiry through our contact form, your name, email address, company name, and message are sent to Formspree, a third-party form processing service. This data is used solely to respond to your enquiry. We do not share this data with any other parties.</p>
      <p>Formspree's privacy policy: https://formspree.io/legal/privacy-policy</p>

      <h2>Cookies</h2>
      <p>This website does not set any cookies.</p>

      <h2>Your rights</h2>
      <p>You have the right to request access to, correction of, or deletion of any personal data we hold about you. Contact us at hello@manual-focus.co.uk.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
    </div>
  </section>
</Base>
```

Note: This is a baseline privacy policy. James should review with a legal professional before launch to ensure full compliance.

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: `dist/privacy/index.html` is generated.

- [ ] **Step 3: Commit**

```bash
git add src/pages/privacy.astro
git commit -m "feat: add privacy policy page"
```

---

## Chunk 5: Final Integration & Launch Prep

### Task 19: Add More FAQ Content

**Files:**
- Modify: `src/content/faq/placeholder.md` (rename)
- Create: additional FAQ `.md` files

- [ ] **Step 1: Create FAQ content files**

Rename `src/content/faq/placeholder.md` to `src/content/faq/who-does-manual-focus-work-with.md` (keep content).

Create `src/content/faq/what-is-a-fractional-cmo.md`:
```markdown
---
question: "What is a Fractional CMO?"
order: 2
---

A Fractional CMO is a senior marketing leader who works with your business on a part-time or contract basis. You get the strategic leadership, team management, and accountability of a full-time CMO — without the full-time salary. It's ideal for startups and scaleups that need experience at the top but aren't ready for a permanent hire.
```

Create `src/content/faq/how-is-manual-focus-different-from-an-agency.md`:
```markdown
---
question: "How is Manual Focus different from a traditional agency?"
order: 3
---

We don't execute campaigns for you. We lead your marketing function or advise on specific strategic challenges. Traditional agencies deliver tactics — we deliver leadership and clarity. We work alongside your team, not as an outsourced function.
```

Create `src/content/faq/what-does-an-engagement-look-like.md`:
```markdown
---
question: "What does an engagement look like?"
order: 4
---

Every engagement starts with a conversation to understand your challenge. From there, we scope the work — whether that's an ongoing Fractional CMO role or a focused consulting engagement with a clear deliverable and timeline. No long-term lock-ins, no retainer padding.
```

Create `src/content/faq/what-industries-do-you-work-in.md`:
```markdown
---
question: "What industries do you work in?"
order: 5
---

Manual Focus has deep experience in cycling and endurance sports, fintech, Web3, and AI. But our expertise is in marketing leadership and strategy — the principles transfer across industries. If you have a complex product and a growth challenge, we can likely help.
```

- [ ] **Step 2: Verify FAQ page renders all entries**

```bash
npm run dev
```
Navigate to `/faq`. Check: 5 items render in order, all open/close correctly.

- [ ] **Step 3: Commit**

```bash
git add src/content/faq/
git commit -m "feat: add FAQ content — 5 entries covering services, approach, and industries"
```

---

### Task 20: Plausible Analytics Setup

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Uncomment Plausible script**

In `src/layouts/Base.astro`, uncomment the Plausible script tag:
```html
<script defer data-domain="manual-focus.co.uk" src="https://plausible.io/js/script.js"></script>
```

Note: This requires a Plausible account. If not yet set up, leave commented and set up before launch.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: enable Plausible analytics script"
```

---

### Task 21: Full Build Verification & Lighthouse Audit

**Files:** None (verification only)

- [ ] **Step 1: Run production build**

```bash
npm run build
```
Expected: Build succeeds with no errors or warnings.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

- [ ] **Step 3: Manual verification checklist**

Check each page:
- [ ] Home — all 7 sections render, logo animation plays, responsive at all breakpoints
- [ ] About — narrative, stats, CTA
- [ ] Services — both sections, CTAs
- [ ] Blog — archive page, individual post, tag page
- [ ] FAQ — accordion works, keyboard nav, schema in source
- [ ] Enquire — form fields, validation, responsive
- [ ] 404 — renders correctly
- [ ] Nav — fixed, responsive, hamburger works, ARIA correct
- [ ] Footer — all links work
- [ ] All JSON-LD schema is valid (check via browser source or schema validator)

- [ ] **Step 4: Run Lighthouse audit**

Open Chrome DevTools → Lighthouse. Run for Performance, Accessibility, Best Practices, SEO on the homepage. Target: 90+ on all four categories.

- [ ] **Step 5: Fix any issues found**

Address any Lighthouse findings (contrast, missing alt text, performance, etc.).

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final build verification and fixes"
```

---

### Task 22: Deploy to Vercel

**Files:** None (deployment)

- [ ] **Step 1: Initialise git remote**

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**

```bash
npx vercel
```
Follow prompts. Framework should auto-detect as Astro.

- [ ] **Step 3: Configure custom domain**

In Vercel dashboard, add `manual-focus.co.uk` as a custom domain. Update DNS records at your registrar to point to Vercel.

- [ ] **Step 4: Verify live site**

Visit `https://manual-focus.co.uk` and repeat the manual verification checklist from Task 21.

- [ ] **Step 5: Commit any Vercel config**

```bash
git add vercel.json .vercel/
git commit -m "chore: add Vercel deployment config"
```
