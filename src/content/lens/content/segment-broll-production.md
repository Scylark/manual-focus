---
title: "Segment-specific b-roll, AI-augmented production for endurance"
stack: content
description: "Plan and produce b-roll across road, gravel, trail, swim and triathlon. What is worth shooting, what AI can augment, what AI cannot touch."
outputs: "B-roll production plan, AI augmentation brief, capability boundary memo"
readMin: 23
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["video", "organic-social", "content"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-06-25
status: live
preview: true
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **populated shot-list inventory CSV** with one row per shot, columns covering segment, sub-segment, condition, time-of-day, subject and product visibility, named athlete, capability tag, asset type, aspect ratios, source shoot, file reference and current status.
2. A **shoot plan** for the next two-to-four practical shoot days, with locations, dates, contingency windows, athletes and product on the call sheet.
3. An **AI augmentation brief** for the post-shoot pipeline, listing every augmented variant required, the source asset it leans on, and the capability tag that justifies the augmentation.
4. A **capability boundary memo** the brand can hand to vendors and freelancers, naming what AI is allowed to generate and what is real-shoot only.
5. A **tagged asset library** in the brand's DAM (Digital Asset Management) where every asset is queryable by segment, condition, time-of-day, subject, product, named athlete and practical-versus-AI provenance.

## Who this is for

A growth or scale-stage endurance brand whose audience can pattern-match cycling, running, swimming or trail footage within seconds. The brand has at least one sponsored athlete with content rights, a production crew (photographer plus videographer) or budget to contract one, and a DAM that can hold tagged assets. Brands without sponsored athletes can still run the playbook, the shoot plan becomes lighter and the named-athlete shots drop from the list.

## Before you start

- [ ] List of endurance segments the brand serves (road cycling, gravel, trail running, road running, swim, triathlon, multi-discipline)
- [ ] Sponsored athletes with content rights agreements that explicitly cover AI augmentation (see ambassador-programme for the contract template)
- [ ] Production crew with capacity for two-to-four shoot days a year, or budget to contract one
- [ ] DAM access (Frame.io, Bynder, Brandfolder, Air, or a shared drive with consistent tagging)
- [ ] Higgsfield or Runway account for AI augmentation, plus a model that supports image-to-image and image-to-video augmentation
- [ ] Reference image library from prior shoots, organised by segment and condition
- [ ] Voice profile and brand-visual-system reference so the augmented assets stay on brand
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode
- [ ] Knowledgeable reviewer who can spot limb physics or gear correctness errors in AI augmentations

If the brand has no sponsored-athlete rights or no production capacity, the playbook reduces to a shoot plan only, with no AI augmentation layer. That is honest and still valuable.

## The pipeline

Six phases. Build the inventory and shoot plan over a working week. The shoot itself takes two-to-four days. AI augmentation runs across the following two-to-three weeks.

### Phase 1, segment scoping

Define which endurance segments the brand serves and what each segment looks visually.

**Step 1.1, list the brand's active segments.**

Most brands span two-to-three. Cascadia is trail-running primary plus road-running secondary. A premium cycling brand is road plus gravel. A triathlon brand is all three plus transition specifics. The matrix is the planning artefact.

For each segment, name the sub-segments the brand visualises.

- **Road cycling.** Open road, climb, descent, group ride, solo, coastal, alpine, lowland
- **Gravel cycling.** Fire road, forest trail, exposed open country, river crossing, mixed-surface
- **Trail running.** Single track, technical descent, ridge line, forest, alpine, desert, urban edge
- **Road running.** Urban morning, suburban evening, track, treadmill
- **Swimming.** Pool, open water sea, open water lake, masters group, solo lap
- **Triathlon.** Transition, swim exit, bike-run transition, finish chute

**Step 1.2, list the conditions matrix per segment.**

For each sub-segment, the conditions that matter. Time of day (dawn, golden hour, midday, blue hour, night). Weather (clear, rain, fog, snow, wind). Surface state (dry, wet, technical). Season (winter, spring, summer, autumn).

The full matrix is 60-to-200 segment-condition cells depending on how many segments the brand serves. Most brands attempt 8-to-10 and run dry. The planned brands have 60.

**You should now have** a segment-sub-segment-condition matrix the inventory will fill in.

### Phase 2, inventory of need

For each cell in the matrix, what shots the brand actually needs across a 12-month content year.

**Step 2.1, define the asset types.**

- **Hero shots.** Long-form film hero, campaign headline, paid hero creative
- **Mid shots.** Blog hero, email hero, athlete-feature backdrop
- **Cut shots.** Social b-roll, reel or short backdrop, ad creative variant, transition
- **Environmental.** Pure terrain, weather, time-of-day without subject

**Step 2.2, run the inventory planning prompt.**

```text
SYSTEM: You plan a b-roll inventory for an endurance brand based on
its active segments, conditions matrix and 12-month content calendar.
The inventory lists one row per shot with capability tags and source
shoot references.

USER:
Brand: {BRAND_NAME}
Segments and sub-segments: {SEGMENT_MATRIX}
Conditions matrix: {CONDITIONS}
Content calendar's top campaigns: {LIST_CAMPAIGNS}
Sponsored athletes: {LIST_ATHLETES}
Brand products in scope: {LIST_PRODUCTS}

For each segment-condition cell that maps to a campaign or recurring
content stream, return JSON:

[
  {
    "shot_id": "<S001 sequential>",
    "segment": "<segment>",
    "sub_segment": "<sub-segment>",
    "condition": "<condition>",
    "time_of_day": "<dawn | golden | midday | blue | night>",
    "subject_visible": "<runner-wide | runner-mid | runner-feet | no-subject>",
    "product_visible": "<product-name or no-product>",
    "athlete_named": "<name or none>",
    "asset_type": "<hero | mid | cut | environmental>",
    "intended_use": ["<campaign or content stream>"]
  }
]

Rules:
- 30 to 60 shots total for a brand serving 2 to 3 segments.
- Mid and cut shots outnumber hero shots 4 to 1.
- Environmental shots cover the high-yield conditions even when no
  subject is captured.
```

**You should now have** a structured inventory of need.

### Phase 3, capability tagging

For each shot, tag whether real footage is required, AI augmentation is suitable or generic AI works.

**Step 3.1, run the capability tagging prompt.**

```text
SYSTEM: You tag each shot in a b-roll inventory by whether it needs
real footage, can use AI augmentation, can use generic AI, or is not
applicable. You apply the capability boundary strictly.

Real footage is required when the shot:
- Shows a named athlete the brand sponsors
- Shows the brand's actual product with logos, colourways or geometry
  visible
- Carries the brand's name in a recap pretending to be live
- Forms the hero moment for a campaign

AI augmentation is suitable when the shot:
- Adapts a real captured asset (time-of-day, weather, environment)
- Extends a captured asset into multiple social cuts or aspect ratios
- Generates environmental b-roll for atmosphere derived from a real
  reference

Generic AI is suitable when the shot:
- Is editorial illustration for an article header
- Is a category image without named athletes or products
- Shows generic close-ups (cobblestones, finish chutes, swim lane
  lines, trail markers) with no brand mark

Not applicable when the shot:
- Sits outside the brand's active segments
- Cannot be ethically produced (named athlete in a scene they did
  not race)

USER:
Inventory: {INVENTORY_JSON}
Brand's product list: {PRODUCTS}
Brand's sponsored athletes: {ATHLETES}

For each shot, return JSON:

[
  {
    "shot_id": "<verbatim>",
    "capability_tag": "<real_footage_required | ai_augmentation | generic_ai | not_applicable>",
    "rationale": "<one sentence>",
    "source_shoot_required": "<true | false>",
    "augmentation_source_shot_id": "<S00X or null>",
    "archive_gap_flag": "<true | false>"
  }
]

Rules:
- When in doubt, mark "real_footage_required".
- "augmentation_source_shot_id" must reference a real_footage shot
  for any "ai_augmentation" tag. AI augmentation never runs without
  a captured source.
- "archive_gap_flag" is true if no source asset exists yet and the
  shoot brief depends on capturing it.
```

You should now have an inventory tagged for capability with archive gaps flagged.

### Phase 4, shoot plan

What the shoot must capture, when and where.

**Step 4.1, group shots by shoot day.**

Cluster shots by location, season, athlete and product. A Chamonix shoot in July covers all the alpine trail shots that include Beth Lyons in her summer kit. A Snowdonia shoot in late July covers the wet-weather and ridge-line shots with Marcus Hale and the brand's autumn-launch kit.

**Step 4.2, build the call sheet.**

For each shoot day, the call sheet covers location, date, contingency window (in case of weather), athletes, products, crew (photographer, videographer, athlete handler, kit assistant), shot list (filtered to shots assigned to this day) and the must-capture archive-gap list.

**Step 4.3, schedule the lead time.**

Shoots book 8-to-12 weeks ahead. Contingency windows sit 1-to-2 weeks after the primary date. The shoot dates feed back into the race-day-demand-pipeline production calendar.

You should now have a shoot plan with no double bookings and a contingency for each day.

### Phase 5, AI augmentation pipeline

Post-shoot, the augmentation pipeline runs.

**Step 5.1, choose your template path.**

**Option A, download the shot-list inventory template.** Grab [broll-shot-list-template.csv](/lens/templates/broll-shot-list-template.csv). It has columns for shot ID, segment, sub-segment, condition, time-of-day, subject visible, product visible, athlete named, capability tag, asset type, aspect ratios, source shoot, source file, status, used-in and notes. Open in Sheets or Excel, populate from the inventory work in phases 1-3.

**Option B, build a custom inventory schema if the brand needs more.** If the brand needs columns the standard template does not have (license expiry dates, talent release tracking, colour-grade reference), ask Claude.

```text
SYSTEM: You generate a b-roll shot-list inventory template for an
endurance brand. The template is one row per shot with columns for
the brand's specific tracking needs.

USER:
Brand: {BRAND_NAME}
Segments: {LIST_SEGMENTS}
Talent rights tracking required: {TRUE_OR_FALSE}
License expiry tracking required: {TRUE_OR_FALSE}
Colour-grade reference tracking required: {TRUE_OR_FALSE}
DAM platform: {PLATFORM}

Generate a CSV template with at minimum:
Shot_id, Segment, Sub_segment, Condition, Time_of_day,
Subject_visible, Product_visible, Athlete_named, Capability_tag,
Asset_type, Aspect_ratios, Source_shoot, Source_file, Status,
Used_in, Notes

Add brand-specific columns where the inputs suggest them.

Return the CSV directly.
```

**Step 5.2, augment per shot.**

For each shot tagged `ai_augmentation`, the pipeline runs the augmentation against the source asset.

```text
SYSTEM: You generate AI augmentation prompts for a tagged b-roll shot.
The augmentation preserves the source asset's subject and product
while changing time-of-day, weather, season or environment. You do
not invent named athletes, brand products with logos, or scenes that
the source did not contain.

USER:
Source shot: {SOURCE_SHOT_ID}
Source description: {SOURCE_DESCRIPTION}
Target variation: {TARGET_TIME_OR_WEATHER}
Aspect ratios needed: {LIST_ASPECTS}
Visual reference (brand style): {STYLE_NOTES}

Return JSON:

{
  "shot_id": "<new ID>",
  "source_shot_id": "<verbatim>",
  "augmentation_prompt": "<the prompt to feed Higgsfield or Runway>",
  "negative_prompt": "<what the model must not generate>",
  "aspect_ratios_to_produce": ["<list>"],
  "human_review_checklist": [
    "limb physics correct",
    "gear correctness (foot strike, pedal rotation, swim stroke)",
    "face consistency vs source",
    "environment continuity",
    "no extra fingers or limbs"
  ]
}

Rules:
- Augmentation prompt never names the athlete or the product.
- Negative prompt explicitly excludes generation of named athletes,
  branded products, logos and faces that drift from the source.
- The human review checklist is mandatory before the augmented asset
  enters the library.
```

**Step 5.3, run the reviewer pass.**

Every augmented asset goes through a human review against the checklist. Limb physics, gear correctness, face consistency, environment continuity. A knowledgeable reviewer (someone who actually runs, rides or swims) catches what a generalist will miss.

You should now have augmented assets that pass the review checklist and are ready for the library.

### Phase 6, asset library and instrumentation

The DAM picks up every asset, tagged consistently.

**Step 6.1, tag every asset in the DAM.**

Every asset, practical or augmented, lands in the DAM with these tags. Segment, sub-segment, condition, time-of-day, subject visible, product visible, athlete named, capability tag, source shoot, used-in.

**Step 6.2, instrument the asset-to-touchpoint mapping.**

The social-content-factory and lifecycle-journey-builder pipelines query the DAM by tag to find assets for a touchpoint. The fulfilment rate (how often a query returns a suitable asset) is the success metric for the inventory. Below 85% fulfilment means the inventory has gaps the next shoot must close.

**Step 6.3, run the quarterly inventory audit.**

Once per quarter, sample 30 segment-condition cells. Check which have at least one asset captured in the last 12 months. Cells with no recent capture get prioritised for the next shoot.

You should now have a tagged library queryable by the brand's downstream pipelines, with a clear view on the gaps.

## Worked example, end-to-end

Cascadia Endurance runs the playbook for the Vahla Range autumn launch. The brand serves trail running primary and road running secondary, with the Vahla Range covering ultra-distance trail kit (shell, vest, shoe).

**Phase 1 output.** Trail running primary, road running secondary. Trail sub-segments are single-track, technical descent, ridge line, forest, alpine. Road sub-segments are urban morning, suburban evening. Conditions matrix is 32 cells in trail plus 8 in road, total 40 cells.

**Phase 2 output.** Inventory of need produced 48 shots. 22 are hero or mid, 18 are cut, 8 are environmental. Three athletes feature on the named-athlete shots, Beth Lyons (lead athlete for the launch), Saoirse Burns and Marcus Hale.

**Phase 3 output.** Capability tagging produced 28 `real_footage_required`, 16 `ai_augmentation`, 3 `generic_ai`, 1 `not_applicable` (a coastal road shot outside the brand's segment that crept in during the inventory phase). The 16 augmentation shots all have a source-shot ID referencing one of the 28 real-footage shots. Archive-gap flag is true on 19 of the 28 real-footage shots, those are the shoot brief.

**Phase 4 output.** Two shoot days planned. Chamonix 8 to 10 July with Beth Lyons covers 18 of the 19 archive gaps. Snowdonia 28 to 29 July with Saoirse Burns and Marcus Hale covers the remaining gaps plus the wet-weather and ridge-line shots that Chamonix in July cannot reliably provide. Contingency windows are 22 to 24 July for Chamonix and 11 to 12 August for Snowdonia.

**Phase 5 output.** Practical shoots ran on schedule with one weather contingency triggered (Snowdonia day 2 moved to the contingency window). The shot list saw 17 of 19 archive gaps captured on the primary days, two on the contingency. AI augmentation produced 16 variants across the next two weeks. Sample of the augmented set.

| Shot ID | Source | Augmentation | Use |
|---|---|---|---|
| S004 | S003, Chamonix ridge line dry blue hour | Fog dawn variant | Social cut for the UTMB launch teaser |
| S006 | S010, Chamonix forest midday | Atmospheric backdrop | Blog header for "Why we shoot Chamonix" |
| S008 | S007, Snowdonia exposed alpine wind | Snow blue hour | Winter campaign teaser scheduled for November |
| S012 | S001, Chamonix single-track dry golden hour | Rain overcast variant | Social cut for the wet-weather product page |

Reviewer pass caught two augmented assets with limb physics errors (a runner with mismatched gait, a pack strap that disappeared mid-frame). Both were regenerated with sharper source-fidelity constraints in the prompt.

**Phase 6 output.** Library populated. The social-content-factory pipeline queried the library 184 times during the UTMB campaign and fulfilled 169 (92%). The lifecycle-journey-builder picked up the Vahla shell hero shot for the launch email and the rain variant for the wet-weather story. The quarterly audit at the end of the season flagged three uncovered cells in winter conditions, which fed the next shoot brief.

A year into the engine, Cascadia has a tagged library of more than 200 assets across the two segments. The augmentation share has held at around 30% of the inventory, with practical capture carrying every named-athlete and every product-visible shot. The audience has not flagged any AI-detectable content because the augmentations stay on environmental b-roll, never on hero moments.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, build the conditions matrix for your brand

Take your two-to-three active segments. List the sub-segments. List the conditions per sub-segment. Compute the cell count. If the count is below 30, the brand is underserving the audience's actual visual world. If it is above 100, the brand is over-scoping, prioritise the cells that map to current campaigns.

### Exercise 2, run the capability tagging on a sample inventory

Take a 10-shot sample inventory (yours, or a fictional one). Run the Phase 3 prompt. Read the tags. If more than half come back `real_footage_required`, the shoot is the binding constraint. If most come back `ai_augmentation`, the brand is leaning on AI for work AI should not do, retighten the capability boundary.

### Exercise 3, draft the call sheet for one shoot day

Pick one shoot day. Use the call sheet template (location, date, contingency, athletes, products, crew, shot list, archive gaps). Walk through what must happen between sunrise and sunset to cover the shot list. If the shot list cannot be captured in a single day with the crew you have, either split the shoot or trim the inventory.

## The eval gates

**Eval 1, inventory coverage.** At any point, at least 30 segment-condition cells have one or more assets captured in the last 12 months. Cells with no recent capture get prioritised for the next shoot.

**Eval 2, plausibility check per AI augmentation.** Every augmented asset passes the human review checklist (limb physics, gear correctness, face consistency, environment continuity). Below 80% pass on first review means the augmentation prompt or model needs revision.

**Eval 3, audience response.** Quarterly check on engagement on AI-augmented assets versus practical-only assets at the social-post level. If augmented assets perform 20% or more below practical, the audience is noticing in a way that is costing engagement. Pull back the AI cut share.

**Eval 4, asset-to-touchpoint fulfilment.** When social-content-factory or lifecycle-journey-builder requests an asset, the library fulfils 85% or more of requests without new capture. Below 85% means the inventory has gaps the next shoot must close.

**Eval 5, capability-tag compliance.** Audit a sample of shipped assets. Every named-athlete or product-visible asset traces to a real-footage source. Zero exceptions.

## The failure modes

**Trying to replace the shoot.** Brand cuts the shoot budget and expects AI to fill the gap entirely. The result is generic content the audience pattern-matches to AI within weeks. The shoot is the brand identity layer, cut it and the brand flattens.

**Over-augmenting individual assets.** A single shot turned into 14 augmented variants. Audience sees the same composition four times in a month. Variety is the goal, not augmentation count. Cap variants per source shot at 3-to-4.

**Disclosure debt.** Brand ships AI-augmented work without acknowledging it. Audience finds out through forensic frame analysis or pattern matching. Trust drops. Cleaner path is to disclose where the audience would reasonably believe practical capture. Honesty becomes part of the brand's positioning.

**Limb or gear physics errors slip through.** Generated cyclist with 3.5 pedals per crank rotation, runner with mismatched gait, swimmer with a stroke that does not propel. The eval gate catches these only if a knowledgeable reviewer is on the team. Do not outsource the plausibility check to a generalist.

**Right-time wrong-segment asset.** Brand pulls a gravel asset for a road campaign because nothing in the road bucket fits. Audience notices the wrong segment cues (different tyre profile, different rider position). Tag the inventory specifically and do not cross-borrow between segments under deadline.

**Athlete likeness drift.** Augmentation accidentally produces a frame where the athlete's face has subtly changed. Even small drift is jarring. Eval pass includes face-consistency check on any frame where athletes are visible.

## The pattern in practice

Illustrative scenarios that show common shapes shoot-plus-augmentation takes. Specifics are illustrative, patterns repeat.

**Premium cycling brand, scale-stage, the archive multiplier.** A brand with several hero shoots in the bank but running out of fresh cuts between shoots. Installing the augmentation pipeline against the existing archive typically triples the usable output inventory over a year with the same shoot budget. Audience engagement on social holds steady because augmented cuts get used for environmental b-roll, not hero moments. AI fills the environment, practical fills the subject.

**Trail running brand, growth-stage, the stock replacement.** A brand using stock trail-running footage. Replacing stock with practical shoot plus AI augmentation across named environments (alpine, coastal, desert, forest) gives the brand a visually distinctive social presence within a year, in a category where most competitors still use stock. Audience-perception lift is usually the unlock more than the cost saving.

**Multisport brand, the named-athlete failure.** A common failure mode is a brand pushing for AI generation of named athletes in scenes that were not captured. The pipeline refuses, the brand contracts another provider that agrees. The output is technically impressive and audience-detectable within a quarter. Brand pulls the assets, loses the budget, and re-commits to practical-only for named-athlete content. The capability boundary is non-negotiable.

## Hand-off

The asset library feeds:
- **social-content-factory**, channel-native cuts using tagged assets
- **lifecycle-journey-builder**, touchpoint imagery from segment inventory
- **race-day-demand-pipeline**, campaign assets pulled per event
- **ambassador-programme**, athlete shoot output augmented through this pipeline
- **video-script-system**, b-roll suggestions for scripts pull directly from the inventory
