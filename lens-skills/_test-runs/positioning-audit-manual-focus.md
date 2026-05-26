# positioning-audit — test run against Manual Focus

A real end-to-end run of the `positioning-audit` skill against
Manual Focus's own surface. Used to validate the pipeline against
a brand we know well + to surface gaps in the skill before they
land on a client engagement.

## Inputs

- Brand URL: `https://manual-focus.co.uk`
- Pages crawled: `/`, `/services`, `/about`, `/lens` (when live)
- Competitors named (hypothetical realistic set): generic
  fractional-CMO agencies, generalist AI-marketing agencies,
  endurance-specific content shops
- Review platform: **none** — Manual Focus has no Trustpilot, G2,
  Capterra. This is a B2B service.

**Gap surfaced #1**: The skill assumes a review corpus exists.
For B2B services it usually doesn't. The skill needs an explicit
alternate path — testimonials, LinkedIn recommendations, case
study quotes, or a 6–10 short customer interview set.

## Pass 1 — Surface extraction

Worked. Output structured-JSON across positioning statements,
value propositions, claims, proof points, audience descriptions,
tone signals. Verbatim phrases throughout.

Sample positioning claims pulled cleanly:
- "Marketing agency for ambitious brands"
- "Senior operators with AI as the leverage"
- "Operators first. Marketers always."

Sample claims pulled with attribution to source:
- "More marketing output, in a fraction of the time" (homepage)
- "50+ years of senior marketing experience across the collective"
  (homepage)

## Pass 2 — Output sampling

Brand has substantial blog output and a recent LinkedIn cadence
(via the news pipeline). Implicit assumptions extracted:

- Audience already believes AI is the leverage point, not "is AI
  worth using"
- Audience prefers operator-led work over agency theatre
- Audience treats "AI agency" as a noisy category needing
  disambiguation
- Audience is comfortable with technical depth (eval rubrics,
  pipelines, model pinning)

## Pass 3 — Customer voice extraction

**Gap surfaced #2 (critical)**: No review corpus exists. Pipeline
paused on the original prompt. We need an alternate path that:

1. Looks for testimonial / case-study quotes on the brand's site
2. Looks for LinkedIn recommendations as a source if the brand
   has them publicly
3. Falls back to recommending a 6–10 customer call mini-sprint
4. Records explicitly when this pass is run on degraded inputs
   so the final audit calls out the lower confidence

When the test run reached this pass, it was clear the skill needs
this alternate path. Fixing in SKILL.md update.

## Pass 4 — Competitive contrast

Worked when fed a hypothetical realistic competitor set:

- vs generic fractional-CMO agencies: Manual Focus claims AI
  leverage explicitly while most peers claim "we use AI" generically
  without describing the pipeline
- vs generalist AI-marketing agencies: Manual Focus claims sport-
  specific depth (endurance/sports brands) where most AI marketing
  shops are sector-agnostic
- vs endurance-specific content shops: Manual Focus claims senior
  strategic leadership while most endurance shops are
  content-/creative-led

The contrast pass clean. The differentiation surfaced is real,
defensible.

## Pass 5 — Contradiction surfacing

Three contradictions worth naming:

**Cosmetic level** — homepage "Three ways to engage. One product"
vs services page that lists 4 named offerings (the 3 services + 1
product). The number "three" is a brand-marketing simplification;
the services page is more granular. Resolution: keep the
simplification on the homepage, ensure services-page numbering is
consistent (which it is). Minor.

**Message level** — homepage emphasises speed-leverage ("ship at
machine speed", "fraction of the time") while The Lens emphasises
discipline (eval gates, fact-checking, refusing to over-claim).
Both true, but the brand surface optimises for one or the other
depending on the visitor's entry point. Resolution: thread the
discipline language onto the homepage. The audit would recommend
this as a specific edit.

**Position level** — endurance-sports specialism vs general AI
marketing. The brand is positioned both ways on different pages.
The audit would recommend collapsing to one — given the receipt
strength (RGT Cycling, Wahoo, Wattbike, Ribble, Pelotan), the
endurance focus is the stronger position. Some pages should be
sharper about this.

## Pass 6 — Sharpened brief

Output:

1. **What the brand says it is** — operator-led marketing agency
   using AI as the leverage for ambitious brands
2. **What its outputs say it is** — endurance-and-sports-specific
   marketing agency with a senior operator team, an opinionated AI
   methodology, and a productised library (The Lens)
3. **The gap** — the endurance specialism is under-claimed on
   the homepage relative to where the actual receipts land
4. **The sharpened position** — "Endurance marketing with senior
   AI craft. The operators in the room when the brand needs
   marketing that compounds."

## Findings to roll back into the skill

### Critical: B2B services path for Pass 3

The skill needs an alternate path when no review corpus exists.
Updating SKILL.md to add a "B2B service substitution" section in
Phase 3 with three concrete fallbacks:

1. Testimonial / case-study extraction from the brand's own site
2. LinkedIn recommendations scraping (with consent / public-only)
3. Recommended customer-call mini-sprint (8–10 calls)

The skill will record which path was taken in the final audit so
confidence levels are transparent.

### Useful: Contradiction severity calibration

The skill caught the three contradictions but the severity labels
(cosmetic / message / position) were the right granularity. No
change needed; this worked as designed.

### Useful: Source-traceability discipline held up

Every claim in the sharpened brief traced cleanly back to the pass
that produced it. The "no untraced claims in the final brief"
discipline survived the run. Good signal.

### Minor: The "competitor set" input is doing a lot of work

For Manual Focus, the competitor set was hypothetical (I made the
realistic competitor set up). For a real engagement, the brand
needs to supply these and the skill needs to push back if they
look soft. The prompt does this; tightening the language to make
it more confrontational on this point.

## Status

Skill V0.1.0 + this finding → V0.2.0 with the B2B services path,
shipped in the next commit.
