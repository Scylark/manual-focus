---
title: "Gear launch sequence for endurance brands"
stack: ops
description: "The 12-month calendar for launching a product in a sport with a season. Build phase, pre-orders, public reveal, race-day proof, sustained sell-through."
outputs: "Launch calendar, gate definitions, content inventory, sales-channel sequence"
readMin: 24
shipTime: "2 working weeks"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content", "email", "paid-search", "paid-social", "pr"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-07-09
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **12-month launch calendar** with every phase, every dependency and every owner mapped, sitting in your project tool as a parent project with sub-projects per phase.
2. A **gate definitions sheet** that lists what has to be true before each phase can start, with explicit pre-reveal hard gates.
3. A **content inventory** matching every shipping touchpoint (hero film, product page, press release, launch email, ad creative, race-week content, race recap, lifecycle journey) to the pipeline that produces it.
4. A **sales-channel sequence** running pre-order, reveal, race-day proof and sustained sell-through across the calendar with channel-specific tactics.
5. A **launch readiness check** that runs against the calendar weekly, flagging slips before they cascade.

## Who this is for

A growth, scale or enterprise endurance brand launching a new product (shoes, frames, helmets, technical apparel, wearables) where the audience has a seasonal calendar. The brand has sponsored athletes or can secure them, retail partner relationships and a marketing function with capacity for a 12-month parallel project. If you are launching a product with no athlete proof point and no retail channel, this calendar is overkill. Run a lean DTC launch instead.

## Before you start

- [ ] Product is design-locked, even if not manufacturing-final
- [ ] Manufacturing capacity confirmed against demand forecast (the end-of-season-inventory playbook's forecast prompt is the input)
- [ ] Two or three sponsored athletes with contracts that cover the launch window
- [ ] Race calendar with one or two Tier 1 events identified as proof moments (from race-day-demand-pipeline)
- [ ] Tier 1 review outlets on a contact list with relationship status
- [ ] Hero shoot budget approved, including studio, location, athlete fees, photographer day rate
- [ ] Project tool (Notion, Linear, Asana) with the team's standard parent-and-sub-project structure
- [ ] Brand voice profile (output of brand-voice-extraction)
- [ ] Launch budget approved, broken into phase-by-phase line items

If sponsored athletes are not committed, do not start. Phase 1 cannot complete without them and the rest of the calendar slips.

## The pipeline

Six phases across 12 months. Two working weeks to plan the calendar, then it runs on the calendar.

### Phase 1, pre-launch foundation, T-12 to T-9 months

Before anything public.

**Step 1.1, set up the launch project structure.**

In Notion, create a parent project called *{PRODUCT_NAME} launch*. Inside, six sub-projects, one per phase. Each sub-project has its own task list, owners and gate criteria.

In Linear, create a project called the same and use sub-issues for each phase. The structure is the same across tools.

**Step 1.2, lock the athlete commitments.**

The CMO or founder identifies two or three sponsored athletes who will use the product in real races. Contracts amended to cover the launch window. Product seeded to athletes' equipment.

For Cascadia Endurance, this is Beth Lyons, Marcus Hale and Saoirse Burns. Each athlete signs a launch-window addendum to their contract covering use, content rights, race events and embargo dates. Saoirse, the most recently signed, gets the longest run-up because her relationship with the brand is the youngest.

**Step 1.3, identify the proof events.**

From the race-day-demand-pipeline calendar, pick one or two Tier 1 events where the product will be visibly used in competition. These become the launch's natural proof moments.

Common Tier 1 events for trail-running brands include UTMB Mont-Blanc, Lavaredo, Western States, the Grand Raid, Diagonale des Fous, the UK Trail Championships at Snowdon.

Document the proof events in the *Launch calendar* page with the event date, the athletes who will race, and the expected coverage.

**Step 1.4, run the foundation gate check.**

Before exiting Phase 1, all of the following must be true. The check lives as a checklist in the *Launch calendar* page.

- [ ] Product design-locked, with hero-eligible photography possible
- [ ] Athlete contracts amended for launch window
- [ ] Athletes have product in hand for training
- [ ] Tier 1 proof events identified and athletes committed to race them
- [ ] Manufacturing capacity confirmed against forecast
- [ ] Hero shoot budget approved

If any item is open, Phase 2 does not start.

You should now have a locked foundation with named athletes, named events and a manufacturing line confirmed.

### Phase 2, hero capture, T-9 to T-6 months

The big shoot.

**Step 2.1, plan the hero shoot.**

The hero shoot covers four content types:

- **Product hero stills.** Studio shots that survive zoom (the product page hero needs to withstand 2x zoom on a mobile screen).
- **Practical environmental b-roll.** Athletes using the product in named environments and events where they will race. This becomes the source archive for AI augmentation per the segment-broll-production playbook.
- **Talking-head footage.** The lead athlete or the product designer covering the design intent. Three-to-five minute interview cuts.
- **Race-condition test footage.** Where possible (rare and valuable, because most products cannot be filmed in real race conditions before reveal).

**Step 2.2, run the shoot.**

A two-to-four day production. Studio day, location days (one per environment, typically two or three environments), interview day. Photographer day rate plus video crew. Athletes paid through the launch-window addendum.

Lock the hero capture before reveal. Re-shooting during the launch window because the photography was not enough is the most expensive mistake on the calendar.

**Step 2.3, asset organisation.**

Every asset captured gets ingested into the brand's DAM with the segment-broll-production tagging schema. The tagging makes Phase 5 (race-day proof) and Phase 6 (sustained sell-through) ten times faster.

**Step 2.4, the hero film edit.**

A 60-to-90 second piece. Not three or four minutes. Audiences drop off after 30 seconds and the launch needs a piece that holds them.

Edit happens at T-7 months so the film is locked at T-6. The long-form behind-the-design piece (3 to 5 minutes) edits in parallel and ships in Phase 5 when the audience has deepened into the product.

You should now have hero stills, environmental b-roll, interview footage and a locked 60-to-90 second hero film.

### Phase 3, whisper phase, T-6 to T-3 months

Selective reveal to specific audiences.

**Step 3.1, Tier 1 reviewer outreach.**

Tier 1 review outlets (the running and cycling press your audience actually reads, around five to ten outlets globally) get pre-release product under NDA. Their review timelines run six to twelve weeks, so they need product by T-5 months to publish on launch.

The outreach pitch is short and specific. Paste this into your outreach tool (Pitchbox, Buzzstream, or just Gmail).

```text
Subject: New {PRODUCT_CATEGORY} from {BRAND_NAME}, embargo
{LAUNCH_DATE}

Hi {REVIEWER_NAME},

We're launching a new {PRODUCT_CATEGORY} on {LAUNCH_DATE}. Three
quick things:

1. The product is {ONE_SENTENCE_HOOK_THAT_SAYS_WHAT_IS_NEW}.
2. {ATHLETE_NAME} is racing it at {TIER_1_EVENT}, which is
   {WHEN_RELATIVE_TO_LAUNCH}.
3. We'd love to send you a review unit under embargo, with the
   review live on or after {LAUNCH_DATE}.

Reply yes and I'll get the unit and the deeper spec sheet to
you by {DATE}.

Thanks,
{SENDER_NAME}
```

**Step 3.2, athletes' visible use.**

Sponsored athletes start using the product visibly in race weeks where the product has not been announced. The audience notices the product on a bike or foot before the brand announces it. Curiosity builds.

Document the planned visible-use events in the *Launch calendar*. Each event is a soft signal to the audience that something is coming.

**Step 3.3, customer pre-signal.**

Existing customers (email list, Trail Club membership) get a "you'll be the first to know" touchpoint at T-4 months. Not the product details, just the signal that something is coming.

The email template:

```text
Subject: A heads-up

Hi {FIRST_NAME},

A short note. We've been working on something we think you'll
like, launching {VAGUE_WINDOW, e.g. 'this spring'}. You will be
the first to know when we have something to share.

That's it for now.

Thanks,
{BRAND_NAME}
```

The vagueness is the point. The signal is what matters.

**Step 3.4, social hints.**

The brand's own organic social hints with close-up cuts of detail, athlete equipment shots that just-so-happen to include the new product partially in frame. Two posts a week through Phase 3.

You should now have Tier 1 reviewers under NDA with product in hand, athletes visibly using the product in racing, and a customer base primed.

### Phase 4, public reveal, T-3 months

The launch day.

**Step 4.1, the reveal-day plan.**

The launch day timeline (UK time, adjust for your audience):

- 06:00, hero film drops on YouTube and brand site
- 07:00, product page goes live with pre-order
- 07:30, email to the full list with the reveal
- 08:00, Tier 1 reviewer embargoes lift (their pieces go live)
- 09:00, paid programme starts, calibrated against the demand forecast
- Across the day, sponsored athletes post their experience pieces (within their contract bands)

Reveal density matters. Doing everything in 24 hours produces a peak that the audience notices. Doing everything across two weeks produces a sustained presence that converts better. Match the density to the brand's tier.

**Step 4.2, the press release.**

The press release runs through the brand voice gates (brand-guardrails-as-code) and the evaluation framework (evaluation-frameworks) before send. Standard structure: one-paragraph hook, three-paragraph product body, one-paragraph athlete quote, one-paragraph designer quote, boilerplate.

**Step 4.3, the launch email.**

The launch email is the most-read piece of the day. The structure that works:

- Subject line, the athlete plus the product plus the moment
- Hero image, the locked product hero from Phase 2
- First paragraph, what the product is and who it is for
- Second paragraph, why now (the season, the event, the athletes)
- CTA, single button to the product page

The email runs through the evaluation matrix for email subject and body before send.

You should now have a reveal day with hero film, product page, email, reviewer coverage, paid programme and athlete content all firing on the same window.

### Phase 5, race-day proof, T-3 to T-0 months

The product on the start line at a major.

**Step 5.1, race-week content.**

Athletes talking about the product in race context, training-camp footage, gear walk-through pieces. Three pieces per athlete across the race week.

**Step 5.2, race-day acknowledgement.**

Sponsored athletes racing on the product. Content drawn from practical capture plus AI-augmented social cuts per the segment-broll-production playbook. The hero shoot's b-roll archive is the source.

**Step 5.3, race recap.**

Through the race-result-content-engine, race-day recap content goes live within 24 hours. Proportional coverage of the brand's athletes. The product is visible but does not over-claim results.

**Step 5.4, the race-claim discipline.**

The brand can credibly say "{PRODUCT} finished in the top 10 at {EVENT}" if it actually did. If it did not, the brand does not make the claim.

The honest read wins audience trust over the season. The over-claim is caught by audience members who can check.

You should now have race-week, race-day and race-recap content that converts the proof event into sustained audience attention.

### Phase 6, sustained sell-through, T-0 to T+12 months

The product transitions from launch to evergreen.

**Step 6.1, customer-content engine.**

Through the customer-content-rights playbook, buyer reviews, race photos with the product, ride and run reports from real customers, surfaced in social and email. Two consented pieces per week through the year following launch.

**Step 6.2, education content.**

Training using the product, racing using the product, maintenance and care. The content lives on the brand blog and ships to the email list on a fortnightly cadence.

**Step 6.3, lifecycle journey.**

Through the lifecycle-journey-builder, post-purchase customers get onboarding, first-race coaching and cross-sell to companion products.

**Step 6.4, renewal planning.**

If this is a seasonal product, next year's iteration starts the loop again at T+9 months. Phase 1 of the next cycle overlaps with Phase 6 of this cycle.

You should now have a 12-month engine that converts launch energy into sustained sell-through and seeds the next launch.

## Worked example, end-to-end

Cascadia Endurance, scale-stage. Launching the Vahla Range Storm Shell, a flagship outerwear product. Launch window planned for September (ahead of UTMB and the autumn race calendar).

**Phase 1.** September minus 12 months (October 2025), the product is design-locked. Marcus signs the contract addenda with Beth Lyons (lead athlete for Vahla), Saoirse Burns and Marcus Hale (founder, who is also one of the brand's racing athletes). Tier 1 events identified: UTMB Mont-Blanc 2026 (September) and Lavaredo Ultra Trail (June, before launch, as soft signal). Manufacturing capacity for 8,400 units confirmed.

**Phase 2.** January to March 2026, hero shoot. Studio day in Manchester, location days in the Cairngorms and Snowdonia. Beth's talking head about the design intent runs three minutes long, edits to a 90-second hero film. The b-roll archive captures 300 usable clips for downstream cuts.

**Phase 3.** April to June 2026, whisper phase. Tier 1 reviewers (Trail Running Magazine, iRunFar, The Pill Magazine, four others) get product under NDA in April. Saoirse races Lavaredo in the Storm Shell in June. The product is visible in race photos that get picked up by trail-running outlets. Customer email pre-signal goes out in June with a 41% open rate (above the 28% baseline).

**Phase 4.** September 1, 2026, reveal day. Hero film at 06:00, product page at 07:00, email at 07:30, reviewer embargoes lift at 08:00, paid programme starts at 09:00. The reveal day produces 4,200 pre-orders against an internal target of 3,500.

**Phase 5.** UTMB week, last week of August 2026 to first week of September. Race-week content (athlete walk-through, training-camp footage from Chamonix). Race-day acknowledgement on August 31. Race recap with Beth finishing 27th overall and Saoirse finishing 14th in the women's field. The Storm Shell is visible in race photos and the brand says "raced at UTMB by Saoirse Burns, top-15 women's finish" rather than over-claiming.

**Phase 6.** September 2026 onward. Customer-content engine activates. Storm Shell becomes the strongest review-generator the brand has shipped, with 280 consented customer reviews in the first quarter. Lifecycle journey for Storm Shell purchasers cross-sells to the Vahla Carbon Pack (released in Phase 6 of an earlier launch cycle). Renewal cycle for Storm Shell v2 starts in May 2027.

**The launch calendar (compressed):**

| Phase | Window | Key deliverable | Owner |
|---|---|---|---|
| 1, Foundation | Oct 2025 to Jan 2026 | Athlete commitments, proof events | Marcus |
| 2, Hero capture | Jan to Mar 2026 | Hero film, b-roll archive | Beth |
| 3, Whisper | Apr to Jun 2026 | Reviewer NDAs, customer pre-signal | Beth |
| 4, Reveal | Sep 1, 2026 | Launch day | All |
| 5, Race-day proof | Aug 31 to Sep 7, 2026 | UTMB coverage | Saoirse |
| 6, Sustained | Sep 2026 to Sep 2027 | Customer content, lifecycle | Beth |

Quarterly review shows the launch landing 28% above demand forecast for the first quarter and 12% above forecast over the first year.

## Try it yourself

Three exercises. Each takes 30 to 60 minutes.

### Exercise 1, build a 12-month calendar for a real product

Pick a product you are launching or thinking about launching. In a Notion or Linear page, sketch the six phases against your calendar. What is T-12? What is T-0? Which Tier 1 events fall in your race-day proof window? Where are the holes?

### Exercise 2, write the reviewer outreach pitch

Take the Step 3.1 template. Fill it in for your product. Read it from a reviewer's perspective. Is the hook in sentence one specific enough? Would you reply yes if you were the reviewer? Iterate until the answer is yes.

### Exercise 3, run the launch-readiness check on a current launch

Pull your current launch (if you have one in flight). Compare it to the Phase 1 gate criteria. Which items are open? Where are you behind? The exercise either confirms you are on track or surfaces the gap before the cascade.

## The eval gates

**Eval 1, calendar realism.** Every gate has its prerequisites listed. No reveal before hero capture is complete. No race-day proof before sponsored athletes are committed. No public reveal before Tier 1 reviewer pieces are scheduled.

**Eval 2, proof-point honesty.** Every claim made during launch is grounded. Used by {athlete} at {race} verifiable. Top 10 at {event} verifiable against the result. No claim that cannot be traced to a public fact.

**Eval 3, audience-readiness check.** Launch date is in the audience's actual buying window for the category. A trail-running brand launching in mid-January for a product peak-used in summer trail season gets a flag and a recommendation to move.

**Eval 4, pre-order to ship gap.** Pre-order window does not open unless ship-date confidence is high. Brands routinely take pre-orders six months before a ship-date that slips, and the audience loses confidence for two product cycles.

## The failure modes

**Launching against the season.** Most common error. Match launch density to when the audience uses the product in earnest. Internal calendar serves the audience calendar.

**Pre-order without manufacturing confidence.** Brand promises ship in 8 weeks, ships in 16. Audience trust drops measurably. Either hold off on pre-orders until ship-date is locked, or be honest about the longer window upfront.

**Reviewer relationships built in the launch week.** Tier 1 reviewers need 8 to 12 weeks. Brand reaches out 3 weeks before launch, gets a polite "we'll cover it post-launch", and the launch happens without third-party validation.

**Sponsored athletes not committed.** Product launches without visible athlete use because contracts were not extended in time, or product was not seeded early enough. The race-day proof moment collapses.

**Hero film too long.** Brands invest in three-to-four-minute hero films that audiences drop off after 30 seconds. The hero film is 60 to 90 seconds. Save the long-form for the behind-the-design piece that ships in Phase 5.

**Over-claiming on race performance.** Sponsored athlete finishes 14th in a major race, and the brand markets the product as race-proven at {major}. Audience checks. Trust drops. Race-day claims need to be true, specific and survive scrutiny.

## The pattern in practice

Illustrative scenarios that show common shapes a gear launch sequence takes. Specifics are illustrative and patterns repeat.

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
- **end-of-season-inventory**, where the demand forecast originates and the launch-cycle clearance is sequenced
- **brief-to-ship-pipeline**, where every shipping touchpoint runs as its own brief inside the launch parent project
