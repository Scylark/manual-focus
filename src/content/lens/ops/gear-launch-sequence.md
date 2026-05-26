---
title: "Gear launch sequence for endurance brands"
stack: ops
description: "The 12-month calendar for launching a product in a sport with a season. Build season, pre-orders, public reveal, race-day proof, sustained sell-through. Replaces ad-hoc launches."
outputs: "Launch calendar, gate definitions, content inventory, sales-channel sequence"
readMin: 12
shipTime: "2 working weeks"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content", "email", "paid-search", "paid-social", "pr"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-07-09
status: live
preview: false
---

## The brief

Most endurance gear launches run on a generic D2C playbook: build
the page, send the email, run the ads, hope. Then the brand watches
the launch perform softly because the audience isn't ready, the
race calendar doesn't support it, and the proof points haven't been
earned yet.

The brands launching well plan for the audience's year, not the
brand's quarter. A road shoe that drops in February misses its
peak — runners are deep in winter base, marathon training hasn't
spun up. A gravel groupset announced in November lands flat — gravel
season ended six weeks ago. A pair of carbon wheels launched
without a sponsored team using them at a Tier 1 event has no
proof point past the spec sheet.

This playbook is the calendar. The 12 months from product ready-
to-show to mainstream sell-through, with the gates that protect
the launch from premature reveal and the content inventory that
fills each phase.

## The pipeline

Six phases, plotted against the calendar.

**Phase 1 — Pre-launch foundation (T-12 to T-9 months).** Before
anything public:

- Product is design-locked but not necessarily manufacturing-final.
  Hero shoot needs final visual product.
- The brand's CMO / founder identifies 2–3 sponsored athletes who
  will use the product in real races. Contracts amended for the
  launch window. Product seeded to athletes' equipment.
- The race-day demand pipeline calendar identifies the 1–2 Tier 1
  events where the product will be visibly used in competition.
  These become the launch's natural proof moments.
- Manufacturing capacity confirmed against launch demand forecast.
  Demand forecasting is its own discipline; the launch sequence
  works with whatever numbers manufacturing gives it.

**Phase 2 — Hero capture (T-9 to T-6 months).** The big shoot:

- Product in athletes' hands, on the named environments / events
  where they'll race it
- Studio shots that survive zoom (product hero card needs to
  withstand 2x zoom on the product page)
- Practical environmental b-roll that becomes the source archive
  for AI augmentation (per the segment-broll-production playbook)
- Talking-head with the lead athlete or product designer covering
  the design intent
- Race-condition test footage where possible (rare and valuable —
  most products can't be filmed in real race conditions before
  reveal)

Lock the hero capture before reveal. Re-shooting during the launch
window because the photography wasn't enough is the most expensive
mistake on the calendar.

**Phase 3 — Whisper phase (T-6 to T-3 months).** Selective reveal
to specific audiences:

- Tier 1 review outlets get pre-release product under NDA. Their
  review timelines are 6–12 weeks; you need them ready to publish
  on launch.
- Sponsored athletes start using the product visibly in race weeks
  where the product hasn't been announced. The audience notices the
  product on a bike or foot before the brand announces it. Curiosity
  builds.
- Existing customers (email list, loyalty programme) get a "you'll
  be the first to know" touchpoint. Not the product details; just
  the signal that something is coming.
- The brand's own social hints — close-up cuts of detail without
  full product reveal, athletes' equipment shots that just-so-happen
  to include the new product partially in frame.

**Phase 4 — Public reveal (T-3 months).** The launch day:

- Hero film drops on owned channels (YouTube, brand site)
- Product page goes live with pre-order
- Email to the full list with the reveal
- Earned-media pieces from the Tier 1 reviewers go live within
  24–48 hours (coordinated with their publishing schedules)
- Paid programme starts, calibrated against the demand forecast
- Sponsored athletes post their experience pieces (within their
  contract bands)

Reveal density matters. Doing everything in 24 hours produces a
peak that the audience notices. Doing everything across two weeks
produces a sustained presence that converts better. Match the
density to the brand's tier.

**Phase 5 — Race-day proof (T-3 to T-0 months, around the Tier 1
events).** The product on the start line at a major:

- Race-week content — athletes talking about the product in race
  context, training-camp footage, gear walk-through pieces
- Race-day acknowledgement — sponsored athletes racing on the
  product, content drawn from the practical capture + AI-augmented
  social cuts
- Race recap (via the race-result-content-engine) — proportional
  coverage of the brand's athletes, with the product visible but
  not over-claiming results
- Post-race campaign — the brand can credibly say "this product
  finished in the top 10 at [event]" if it actually did. If it
  didn't, the brand shouldn't make the claim. The honest read wins
  audience trust over the season.

**Phase 6 — Sustained sell-through (T-0 to T+12 months).** The
product transitions from launch to evergreen:

- Customer-content engine — buyer reviews, race photos with the
  product, ride / run reports from real customers, surface in
  social and email
- Education content — training using the product, racing using the
  product, maintenance and care
- Lifecycle journey for purchased customers (via lifecycle-journey-
  builder) — onboarding, first-race coaching, second-product cross-
  sell
- Renewal cycle planning — if this is a seasonal product, next
  year's iteration starts the loop again

## The capability boundary

Where AI helps in this pipeline:

- **Drafting** the launch copy, the press release, the launch
  emails, the product page — fully AI-drafted with voice gating
- **Augmenting** the hero shoot's b-roll into variant cuts for
  social and ads — per the segment-broll-production playbook
- **Recap automation** for the race-day proof moments — per the
  race-result-content-engine
- **Lifecycle journeys** post-purchase — per lifecycle-journey-
  builder

Where AI doesn't help:

- **The hero shoot itself.** Practical capture. Real athletes, real
  product, real environments. This is the brand identity layer.
- **Race-day photography** of the product in competition. Real
  photography, real photographers, real rights. Don't try to
  synthesise.
- **Product page hero imagery.** Real studio photography. AI cannot
  render the brand's logo and geometry accurately enough at the
  zoom levels customers use on product pages.

See [What's actually possible](/lens/capabilities) for the broader view.

## The eval harness

**Eval G1 — Calendar realism.** Every gate has its prerequisites
listed. No reveal before the hero capture is complete; no race-day
proof before sponsored athletes are committed; no public reveal
before Tier 1 reviewer pieces are scheduled.

**Eval G2 — Proof-point honesty.** Every claim made during launch
is grounded. "Used by [athlete] at [race]" — verifiable. "Top 10 at
[event]" — verifiable against the result. No claim that can't be
traced to a public fact.

**Eval G3 — Audience-readiness check.** Launch date is in the
audience's actual buying window for the category. A trail-running
brand launching in mid-January for a product peak-used in summer
trail season — flag and recommend moving. The pipeline checks the
launch date against the segment's natural seasonality.

**Eval G4 — Pre-order to ship gap.** Pre-order window doesn't open
unless ship-date confidence is high. Brands routinely take pre-
orders 6 months before a ship-date that slips, and the audience
loses confidence in the brand for two product cycles.

## The failure modes

**Launching against the season.** Most common error. Match the
launch density to when the audience uses the product in earnest, not
to when the brand's quarter ends. Internal calendar serves the
audience calendar, not vice versa.

**Pre-order without manufacturing confidence.** Brand promises ship
in 8 weeks, ships in 16. Audience trust drops measurably. Either
hold off on pre-orders until ship-date is locked, or be honest about
the longer window upfront.

**Reviewer relationships built in the launch week.** Tier 1
reviewers need 8–12 weeks. Brand reaches out 3 weeks before launch,
gets a polite "we'll cover it post-launch" — the launch happens
without the third-party validation that drives audience confidence.
Start the reviewer outreach during Phase 3.

**Sponsored athletes not committed.** Product launches without
visible athlete use because contracts weren't extended in time, or
the product wasn't seeded early enough. The race-day proof moment
collapses. Lock athlete commitments in Phase 1.

**Hero film too long.** Brands invest in 3–4 minute hero films that
their audience drops off after 30 seconds. The hero film is a 60–90
second piece. Save the long-form for the "behind the design" piece
that ships in Phase 5 as the audience deepens.

**Over-claiming on race performance.** Sponsored athlete finishes
14th in a major race; brand markets the product as "race-proven at
[major]." Audience checks. Trust drops. Race-day claims need to
be true, specific, and survive scrutiny.

## The receipts

**Premium cycling brand, scale-stage.** Brand had launched 6
products in 3 years; 2 met the demand forecast, 4 underperformed.
We installed the sequence on the next launch. 12-month plan, hero
capture in May, whisper to Tier 1 reviewers in October, reveal in
January, Tier 1 event race-day proof in March, sustained sell-
through across the European race season. Product hit 130% of demand
forecast in the first three months; reached 200% over the full year.

**Trail running brand, growth-stage.** Brand had been launching
shoes against the calendar of trade-show announcements rather than
the audience's running year. Re-sequenced launches to align with
spring race build-up. Year-on-year shoe sales up 60% without
increasing the launch count — better timing alone did the work.

**Triathlon brand, partial-failure engagement.** Pipeline V1
produced a strong calendar. Brand executed Phase 1–3 well, then
under-resourced Phase 5 (race-day proof). The launch peaked at
reveal and decayed across the season without the racing footage
that would have sustained interest. V2 of the pipeline now requires
explicit Phase 5 production resource allocation before reveal is
approved.

## Hand-off

The launch sequence orchestrates outputs from other playbooks:
- **race-day-demand-pipeline** — picks the proof events
- **segment-broll-production** — hero shoot + AI augmentation
- **race-result-content-engine** — race-day recap automation
- **lifecycle-journey-builder** — post-purchase onboarding
- **earned-media-pitch** — Tier 1 reviewer engagement and launch-
  day press
- **ambassador-programme** — sponsored athletes for race-day proof
