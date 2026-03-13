# Manual Focus Agency Website — Design Spec

## Overview

Agency website for Manual Focus (manual-focus.co.uk), a marketing agency that brings focus to the noise and complexity of digital transformation. Founded by James Vickers, the agency offers Fractional CMO and Strategic Consulting services primarily to founders and CEOs of startups/scaleups, with established businesses as a secondary audience.

## Brand Identity

### Ethos
Bringing focus to the noise. In a world where today's news is tomorrow's out-of-date topic, Manual Focus cuts through complexity with deliberate, intentional clarity.

### Logo
SVG mark: "MANUAL" (top) / "FOCUS" (bottom) in clean uppercase letterforms, with two overlapping stroked circles to the left. The circles represent the lack of focus in technology — the intersection (old world vs new world) is where Manual Focus operates.

### Logo Animation
Drift and converge — circles start separated, slowly drift together until they reach their overlap position. Pure CSS animation (keyframes on transform), no JS dependency. Plays once per homepage visit (CSS `animation-fill-mode: forwards` with no repeat). On inner pages the logo appears in its final converged state with no animation.

### Tone of Voice
Provocative and opinionated, but warm and approachable. Challenges conventional thinking without being cold or alienating. Founder-to-founder language — direct, assumes intelligence, no jargon padding. Defines what Manual Focus is NOT as much as what it is. Inspired by Initial Commit's anti-consultant positioning: operator credibility through specifics, not vague claims.

### Colour Palette
- **Background:** Bone/off-white (`#F5F0EB`)
- **Primary text:** Off-black (`#1D1D1B` — matching logo)
- **Secondary text:** Warm grey (`#6B6560`)
- **CTA gradient start:** Neon magenta (`#FF2D78`)
- **CTA gradient end:** Neon cyan (`#00E5FF`)
- **CTA gradient direction:** `linear-gradient(135deg, #FF2D78, #00E5FF)`

### Typography
- **Font family:** Inter (Helvetica-equivalent, open source, variable weight), loaded locally
- **Headings:** Bold weight, large scale, uppercase for key statements
- **Body:** Regular weight, generous line-height
- **Pull quotes / statements:** Extra-large, bold — the provocative voice moments

### Spacing
- Generous whitespace between all sections
- Large padding, minimal visual clutter
- Content centred with max-width container (~1200px)

### Responsive Strategy
- **Breakpoints:** Mobile-first. `640px` (sm), `768px` (md), `1024px` (lg), `1280px` (xl)
- **Mobile (< 640px):** Single column. Hamburger nav. Logo bar stacks to 2-column grid. Hero text scales down. Sections stack vertically with reduced padding.
- **Tablet (640–1024px):** Two-column grid where appropriate (services, blog cards). Nav remains hamburger until `lg`.
- **Desktop (1024px+):** Full horizontal nav. Max-width 1200px container. Multi-column layouts for services, blog grid.

## Site Architecture

### Pages
1. **Home** — primary landing page and conversion funnel
2. **About** — James's story, Manual Focus philosophy, career credibility
3. **Services** — single page with two sections (Fractional CMO + Strategic Consulting)
4. **Blog** — AEO-optimised articles (markdown-driven)
5. **FAQ** — structured Q&A (markdown-driven, schema markup for AEO)
6. **Enquire** — selective intake form
7. **404** — on-brand error page with a bold statement and link back to home

### Navigation
Fixed top nav: logo left, links right, "Enquire" as neon gradient CTA button. Hamburger menu below `1024px`. Hamburger button and mobile menu include appropriate ARIA attributes (`aria-expanded`, `aria-controls`, `aria-label`).

### Footer
Contact info, social links, legal (privacy/terms), copyright.

## Homepage Structure

Sections in order:

1. **Hero** — Full-width, bold single provocative statement (e.g. "Most marketing advice is noise. We bring focus."). Subline positions what Manual Focus does. Neon gradient "Enquire" CTA. Logo animation plays here on load.

2. **Problem diagnosis** — Short, punchy section naming the pain founders feel: overwhelmed by tools, trends, AI hype, conflicting advice. Founder-to-founder language.

3. **What we do** — Two clear offerings: Fractional CMO / Strategic Consulting. Short, specific, no fluff. Defines what Manual Focus is NOT (no execution shop, no deliverable theatre).

4. **Brands we've worked with** — Logo bar featuring: Classified Cycling, Wahoo, Wattbike, Ribble Cycles, RGT, motif AI, Muuvr, Planet X, Pelotan. Single row on desktop, 2-column grid on mobile. All logos as SVG or optimised PNG with descriptive `alt` text.

5. **Operator credibility** — Brief intro to James. Not a bio dump — a provocative paragraph with real numbers that earns the click through to the full About page.

6. **Perspective** — 2-3 latest blog post previews. Positions Manual Focus as opinionated and forward-thinking.

7. **CTA close** — Final bold statement + enquiry CTA. Low friction, warm tone.

## Inner Pages

### About
- Opens with brand philosophy — bringing focus to the noise, the two-circles story
- James's narrative: endurance sports to fintech to Web3 to AI — always early to what matters
- Key credibility numbers: 350k users grown, 160+ media placements, NPS -65 to +45, brand recall 0 to 95, conversions 20% to 45%
- Closes with CTA

### Services
Single page (`/services`) with two sections:
- **Fractional CMO** — embedded leadership, not advice from the sidelines. Who it's for, what it includes, what it's NOT.
- **Strategic Consulting** — audits, GTM strategy, brand positioning. Focused engagements, not retainer padding.
- No pricing displayed — enquiry only
- Each section closes with CTA

### Blog
- Markdown-driven via Astro content collections
- Each post frontmatter: `title`, `date`, `tags`, `description`, `image` (optional, for OG/social sharing)
- AEO-optimised: question-as-heading pattern, concise 40-60 word answers after each question heading
- Archive page (`/blog`) with tag filtering
- Tag archive pages at `/blog/tag/[tag]`
- Tags from a controlled list defined in the content schema (not freeform)
- Clean reading experience: generous type size, max-width prose column (~720px)
- Default OG image used when no post-specific `image` is provided

### FAQ
- Markdown-driven, collapsible Q&A accordion with keyboard navigation (`Enter`/`Space` to toggle, arrow keys between items) and ARIA attributes (`role="region"`, `aria-expanded`, `aria-controls`)
- Each `.md` file represents one Q&A pair (frontmatter: `question`, `answer`, `order`)
- FAQPage schema markup for AEO/rich snippets
- Covers: who Manual Focus works with, how engagements work, what to expect

### Enquire
- Selective intake form fields:
  - Name (required)
  - Company (required)
  - Email (required, validated)
  - Brief description of challenge (required, textarea)
  - How they found Manual Focus (optional, dropdown)
- Copy framing: "This isn't a contact form. It's the start of a conversation."
- No calendar embed — James qualifies first, then books
- On success: inline confirmation message ("Thanks. We'll be in touch within 48 hours.")
- On error: inline error message with guidance to retry or email directly
- Form submission via Formspree (or similar, no backend)

### 404
- Bold statement in brand voice (e.g. "You've lost focus. Let's get you back.")
- Link to homepage
- Consistent layout with Nav and Footer

## Technical Architecture

### Stack
- **Astro 5** (5.17+, stable) — static site generation, island architecture
- **Content Layer API** — `glob()` loader with Zod schemas for validation. Config at `src/content.config.ts` (Astro 5 convention).
- **CSS** — vanilla CSS with custom properties for design tokens
- **Inter** — variable font, loaded locally
- **Minimal JS** — hamburger menu and FAQ accordion only. Logo animation is pure CSS.

### Project Structure
```
src/
  content.config.ts          # collection definitions, glob() loader, Zod schemas
  content/
    blog/
      *.md                   # frontmatter: title, date, tags, description, image?
    faq/
      *.md                   # frontmatter: question, answer, order
  pages/
    index.astro
    about.astro
    services.astro
    blog/
      index.astro            # archive with tag filtering
      [...slug].astro        # individual post
      tag/
        [tag].astro          # tag archive page
    faq/
      index.astro
    enquire.astro
    404.astro
  components/
    Nav.astro
    Footer.astro
    LogoAnimation.astro
    EnquiryForm.astro
    BlogCard.astro
    FaqAccordion.astro
    SEOHead.astro            # reusable OG/meta/JSON-LD component
  layouts/
    Base.astro               # shared head, nav, footer
    BlogPost.astro
  styles/
    global.css               # design tokens, resets, base styles
public/
  fonts/
    inter-variable.woff2     # locally hosted font
  images/
    manual-focus-logo.svg
    og-default.png           # default social sharing image (1200x630)
    brand-logos/             # client logos for the logo bar (SVG preferred)
  favicon.svg                # SVG favicon (matches logo mark)
  favicon.ico                # fallback ICO
  apple-touch-icon.png       # 180x180
  site.webmanifest           # PWA manifest with brand colours
```

### AEO Implementation
- **JSON-LD structured data** on every page: Organization, FAQPage, BlogPosting, ProfilePage
- **`sameAs` entity linking** — Manual Focus and James connected to LinkedIn, Companies House, etc.
- **Question-as-heading pattern** in FAQ and blog content
- **Zod schema validation** — missing/invalid frontmatter fails the build

### SEO / Performance
- `@astrojs/sitemap` for auto-generated sitemap
- `@astrojs/rss` for RSS feed (blog posts only)
- Open Graph + Twitter card meta on every page via `SEOHead.astro` component
- Default OG image (`og-default.png`) with per-post override via `image` frontmatter field
- Semantic HTML throughout
- Clean, human-friendly permalinks
- Island architecture = near-zero client JS = strong Core Web Vitals
- Images: Astro `<Image>` component for automatic WebP/AVIF optimisation and lazy loading. Brand logos served as SVG where possible.

### Accessibility
- WCAG 2.1 AA compliance target
- All images have descriptive `alt` text
- Hamburger menu: `aria-expanded`, `aria-controls`, `aria-label`, focus trap when open
- FAQ accordion: keyboard navigable (`Enter`/`Space` toggle, arrow keys), `aria-expanded`, `aria-controls`
- Sufficient colour contrast ratios (off-black on bone exceeds AA; neon gradient CTA text will be white or off-black depending on contrast check)
- Skip-to-content link
- Semantic heading hierarchy (single `h1` per page)

### Analytics
- **Plausible Analytics** (privacy-respecting, no cookies, GDPR-compliant without consent banner)
- Lightweight script tag, no impact on Core Web Vitals
- Track: page views, referrers, UTM parameters, enquiry form submissions as custom goals

### Privacy & Compliance
- Privacy policy page linked from footer
- Plausible is cookieless — no consent banner required
- Formspree processes form data — privacy policy to disclose this
- No third-party tracking cookies

### Hosting & Deployment
- **Vercel** — push-to-deploy from git
- **Domain:** manual-focus.co.uk pointed via DNS
- **Form handling:** Formspree or equivalent (no backend)

## Content Management
- Blog and FAQ content managed as markdown files
- Edit `.md` file, push to git, site rebuilds automatically
- Zod schemas enforce frontmatter consistency at build time
- Blog tags from a controlled list in the schema — adding a new tag requires updating the schema

## Design References
- **Method Security** (method.security) — take: bold statements, generous whitespace, progressive disclosure layout, section-based storytelling. Leave: dark palette, video hero.
- **VoidZero** (voidzero.dev) — take: clear hierarchy, trust logo bar, conversion-oriented flow. Leave: dark palette, developer audience tone.
- **Initial Commit** (initialcommit.co) — take: problem-first content, anti-consultant positioning, founder-to-founder language, operator credibility through specifics, low-friction CTA. Leave: pricing structure display.

## Key Principles
- Whitespace and boldness above all
- Every statement earns its place — no filler
- Define what we're NOT as powerfully as what we are
- Real numbers, real brands, not vague claims
- Low friction enquiry — selective but not intimidating
