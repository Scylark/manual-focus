---
title: "Gear launch sequence for endurance brands"
stack: ops
description: "The 12-month calendar for launching a product in a sport with a season. Build season, pre-orders, public reveal, race-day proof, sustained sell-through."
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

Most endurance gear launches run on a generic D2C playbook. Build the page, send the email, run the ads, hope. Then the brand watches the launch perform softly because the audience isn't ready, the race calendar doesn't support it, and the proof points haven't been earned yet.

The brands launching well plan for the audience's year, rather than the brand's quarter. A road shoe that drops in February misses its peak, because runners are deep in winter base and marathon training hasn't spun up. A gravel groupset announced in November lands flat, because gravel season ended six weeks ago. A pair of carbon wheels launched without a sponsored team using them at a Tier 1 event has no proof point past the spec sheet.

This playbook is the calendar. The 12 months from product ready-to-show to mainstream sell-through, with the gates that protect the launch from premature reveal and the content inventory that fills each phase.

## The pipeline

Six phases, plotted against the calendar.

**Phase 1, pre-launch foundation (T-12 to T-9 months).** Before anything public:

- Product is design-locked but not necessarily manufacturing-final. Hero shoot needs final visual product.
- The brand's CMO or founder identifies 2–3 sponsored athletes who will use the product in real races. Contracts amended for the launch window. Product seeded to athletes' equipment.
- The race-day demand pipeline calendar identifies the 1–2 Tier 1 events where the product will be visibly used in competition. These become the launch's natural proof moments.
- Manufacturing capacity confirmed against launch demand forecast. Demand forecasting is its own discipline, and the launch sequence works with whatever numbers manufacturing gives it.

**Phase 2, hero capture (T-9 to T-6 months).** The big shoot:

- Product in athletes' hands, on the named environments and events where they'll race it
- Studio shots that survive zoom (product hero card needs to withstand 2x zoom on the product page)
- Practical environmental b-roll that becomes the source archive for AI augmentation (per the segment-broll-production playbook)
- Talking-head with the lead athlete or product designer covering the design intent
- Race-condition test footage where possible (rare and valuable, because most products can't be filmed in real race conditions before reveal)

Lock the hero capture before reveal. Re-shooting during the launch window because the photography wasn't enough is the most expensive mistake on the calendar.

**Phase 3, whisper phase (T-6 to T-3 months).** Selective reveal to specific audiences:

- Tier 1 review outlets get pre-release product under NDA. Their review timelines run 6–12 weeks, so you need them ready to publish on launch.
- Sponsored athletes start using the product visibly in race weeks where the product hasn't been announced. The audience notices the product on a bike or foot before the brand announces it. Curiosity builds.
- Existing customers (email list, loyalty programme) get a "you'll be the first to know" touchpoint. Not the product details, just the signal that something is coming.
- The brand's own social hints with close-up cuts of detail without full product reveal, athletes' equipment shots that just-so-happen to include the new product partially in frame.

**Phase 4, public reveal (T-3 months).** The launch day:

- Hero film drops on owned channels (YouTube, brand site)
- Product page goes live with pre-order
- Email to the full list with the reveal
- Earned-media pieces from the Tier 1 reviewers go live within 24–48 hours (coordinated with their publishing schedules)
- Paid programme starts, calibrated against the demand forecast
- Sponsored athletes post their experience pieces (within their contract bands)

Reveal density matters. Doing everything in 24 hours produces a peak that the audience notices. Doing everything across two weeks produces a sustained presence that converts better. Match the density to the brand's tier.

**Phase 5, race-day proof (T-3 to T-0 months, around the Tier 1 events).** The product on the start line at a major:

- Race-week content, with athletes talking about the product in race context, training-camp footage, gear walk-through pieces
- Race-day acknowledgement, with sponsored athletes racing on the product, content drawn from the practical capture plus AI-augmented social cuts
- Race recap (via the race-result-content-engine) with proportional coverage of the brand's athletes, where the product is visible but doesn't over-claim results
- Post-race campaign. The brand can credibly say "this product finished in the top 10 at [event]" if it actually did. If it didn't, the brand shouldn't make the claim. The honest read wins audience trust over the season.

**Phase 6, sustained sell-through (T-0 to T+12 months).** The product transitions from launch to evergreen:

- Customer-content engine, with buyer reviews, race photos with the product, ride and run reports from real customers, surfaced in social and email
- Education content, with training using the product, racing using the product, maintenance and care
- Lifecycle journey for purchased customers (via lifecycle-journey-builder), covering onboarding, first-race coaching, second-product cross-sell
- Renewal cycle planning. If this is a seasonal product, next year's iteration starts the loop again

## The capability boundary

Where AI helps in this pipeline:

- **Drafting** the launch copy, the press release, the launch emails, the product page, fully AI-drafted with voice gating
- **Augmenting** the hero shoot's b-roll into variant cuts for social and ads, per the segment-broll-production playbook
- **Recap automation** for the race-day proof moments, per the race-result-content-engine
- **Lifecycle journeys** post-purchase, per lifecycle-journey-builder

Where AI doesn't help:

- **The hero shoot itself.** Practical capture. Real athletes, real product, real environments. This is the brand identity layer.
- **Race-day photography** of the product in competition. Real photography, real photographers, real rights. Don't try to synthesise.
- **Product page hero imagery.** Real studio photography. AI cannot render the brand's logo and geometry accurately enough at the zoom levels customers use on product pages.

See [What's actually possible](/lens/capabilities) for the broader view.

## The eval harness

**Eval G1, calendar realism.** Every gate has its prerequisites listed. No reveal before the hero capture is complete, no race-day proof before sponsored athletes are committed, no public reveal before Tier 1 reviewer pieces are scheduled.

**Eval G2, proof-point honesty.** Every claim made during launch is grounded. "Used by [athlete] at [race]" verifiable. "Top 10 at [event]" verifiable against the result. No claim that can't be traced to a public fact.

**Eval G3, audience-readiness check.** Launch date is in the audience's actual buying window for the category. A trail-running brand launching in mid-January for a product peak-used in summer trail season gets a flag and a recommendation to move. The pipeline checks the launch date against the segment's natural seasonality.

**Eval G4, pre-order to ship gap.** Pre-order window doesn't open unless ship-date confidence is high. Brands routinely take pre-orders 6 months before a ship-date that slips, and the audience loses confidence in the brand for two product cycles.

## The failure modes

**Launching against the season.** Most common error. Match the launch density to when the audience uses the product in earnest, rather than to when the brand's quarter ends. Internal calendar serves the audience calendar, rather than the other way around.

**Pre-order without manufacturing confidence.** Brand promises ship in 8 weeks, ships in 16. Audience trust drops measurably. Either hold off on pre-orders until ship-date is locked, or be honest about the longer window upfront.

**Reviewer relationships built in the launch week.** Tier 1 reviewers need 8–12 weeks. Brand reaches out 3 weeks before launch, gets a polite "we'll cover it post-launch", and the launch happens without the third-party validation that drives audience confidence. Start the reviewer outreach during Phase 3.

**Sponsored athletes not committed.** Product launches without visible athlete use because contracts weren't extended in time, or the product wasn't seeded early enough. The race-day proof moment collapses. Lock athlete commitments in Phase 1.

**Hero film too long.** Brands invest in 3–4 minute hero films that their audience drops off after 30 seconds. The hero film is a 60–90 second piece. Save the long-form for the "behind the design" piece that ships in Phase 5 as the audience deepens.

**Over-claiming on race performance.** Sponsored athlete finishes 14th in a major race, and the brand markets the product as "race-proven at [major]." Audience checks. Trust drops. Race-day claims need to be true, specific, and survive scrutiny.

## The pattern in practice

Illustrative scenarios that show common shapes a gear launch sequence takes. Specifics are illustrative and the patterns repeat.

**Premium cycling brand, scale-stage, the full-sequence launch.** A brand with a track record where half their launches miss demand forecast. Installing the sequence on the next launch (a 12-month plan, hero capture in late spring, whisper to Tier 1 reviewers in autumn, reveal in early new year, Tier 1 event race-day proof in the first race window, sustained sell-through across the European race season) typically lands the product above demand forecast in the first quarter and well above forecast over the full year.

**Trail running brand, growth-stage, the audience-calendar shift.** A brand launching shoes against the calendar of trade-show announcements rather than the audience's running year. Re-sequencing launches to align with spring race build-up typically lifts year-on-year shoe sales materially without increasing the launch count. Better timing alone does the work.

**Triathlon brand, the Phase-5 under-resourcing failure.** A common failure mode is the sequence runs cleanly through Phases 1 to 3, then Phase 5 (race-day proof) gets under-resourced. The launch peaks at reveal and decays across the season without the racing footage that would have sustained interest. This is why the current pipeline requires explicit Phase 5 production resource allocation before reveal is approved.

## Hand-off

The launch sequence orchestrates outputs from other playbooks:
- **race-day-demand-pipeline**, which picks the proof events
- **segment-broll-production**, hero shoot plus AI augmentation
- **race-result-content-engine**, race-day recap automation
- **lifecycle-journey-builder**, post-purchase onboarding
- **earned-media-pitch**, Tier 1 reviewer engagement and launch-day press
- **ambassador-programme**, sponsored athletes for race-day proof
