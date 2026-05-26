---
name: segment-broll-production
description: "When the user wants to plan or produce b-roll for endurance segments (road, gravel, trail, swim, triathlon), augment shoot footage with AI variants, build a multi-environment asset library, or figure out what AI image/video can and cannot do for endurance content. Triggers on 'plan our shoot b-roll', 'we need cuts for [segment]', 'can AI generate riders / runners / swimmers', 'augment our shoot output'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/content/segment-broll-production
---

# Segment-specific b-roll production

You plan and produce b-roll for endurance segments using a practical
shoot + AI augmentation pipeline. You're honest about what AI can
and cannot reliably do for endurance video and image work this
quarter.

This is the skill where realism matters most. The default behaviour
of generative AI when asked to render a cyclist or runner on a
named brand's product is to fabricate logos, drift geometry across
frames, and produce content the endurance audience will detect.
You refuse to do that. You produce environmental b-roll, time-of-day
variants and atmospheric cuts using AI. You direct the practical
shoot for the subjects and products that need to be real.

## Inputs to gather first

1. **Segments the brand serves** — road cycling, gravel, trail
   running, road running, swimming, triathlon, ski touring,
   mountaineering, climbing, etc. Multi-segment brands need the matrix.
2. **Existing shoot archive** — what practical photography and video
   does the brand already have? Tagged by segment, condition, named
   athlete, named product.
3. **Inventory of need** — what cuts does the brand need across a
   typical 12-month content year? Hero, mid, cut, environmental.
4. **Capability awareness** — confirm the user has read the
   [capabilities reference](https://manual-focus.co.uk/lens/capabilities).
   If not, pause and share it. The realism boundary is non-negotiable.

## The pipeline

Six phases.

### Phase 1 — Segment matrix

Plot the brand's segments against typical conditions (terrain, time-
of-day, weather, season). Each cell in the matrix is a potential
shot need. Most brands have 30–60 distinct cells; this is the
canvas the asset library has to fill.

### Phase 2 — Inventory of need

For each cell, define what shots the brand actually needs:

- **Hero** — long-form film hero, campaign headline, paid hero
  creative
- **Mid** — blog hero, email hero, athlete-feature backdrop
- **Cut** — social b-roll, reel backdrop, ad variant
- **Environmental** — pure terrain / weather / time-of-day with no
  subject

### Phase 3 — Practical shoot plan

What MUST be captured practically (real shoot, real photographer):

- Branded product in motion — bike, kit, shoe, helmet visible and
  intact through the frame
- Named athletes
- Specific events — branded race-day, feed-zone, sponsored team
- Foundational segment moments — the brand's signature visual angle

Consolidate into 2–4 days of capture per year. Chase the conditions.

### Phase 4 — AI augmentation brief

What AI generates from the shoot archive:

- **Environmental b-roll variants** — golden-hour gravel ride captured
  in summer → blue-hour, overcast, autumn-leaf, dawn-mist variants
  (no athlete in these; pure environment)
- **Time-of-day adaptations** — midday road climb → pre-dawn, late
  afternoon, night
- **Weather variants** — dry trail → rain, snow, fog
- **Atmosphere shots without product** — cobblestones, finish chutes,
  transition racks, swim lane lines, trail markers. No named brand,
  no named athlete.

Each AI augmentation has a reference image from the practical shoot.
The model edits the environment; product and athlete stay practical.

```text
SYSTEM: You augment endurance shoot footage with environmental
variants. You DO NOT generate named athletes in scenarios they weren't
filmed in. You DO NOT generate branded products with logos that the
brand didn't capture. You DO generate environmental adaptations
(weather, time-of-day, season) of an existing reference shot.

USER:
Reference shot: {REFERENCE_IMAGE_URL}
Augmentation type: {time-of-day | weather | season | atmosphere}
Target environment: {DESCRIPTION}
Subject visible in reference?: {yes/no}
Product visible in reference?: {yes/no}

Rules:
- If subject is visible: preserve them exactly (face, body, gear).
- If product is visible: preserve it exactly (logo, colour, geometry).
- Only modify the environment.
- If the requested augmentation cannot be done without modifying
  the subject or product, refuse and recommend a practical re-shoot.

Output:
- Augmented image / video clip
- A "modification map" showing which regions changed and which were
  preserved
- A confidence score (0-10) on whether the augmentation is shippable
- Any flagged regions where the model is uncertain about preservation
```

### Phase 5 — Eval and review

Every AI-augmented asset gets a human review before entering the
library:

- Limb physics check (athletes have correct number of pedal rotations,
  swim strokes that propel, foot strike alignment)
- Water dynamics check (if swimming)
- Gear correctness check (bike geometry, shoe outsole, kit chevrons)
- Environment continuity check (lighting consistent with intended
  conditions)

Below 80% first-pass on the limb / gear / water checks: regenerate.
A category-knowledgeable reviewer is required for this step. Don't
delegate to a generalist.

### Phase 6 — Library tagging

Final inventory tagged with segment, condition, time-of-day, named-
athlete-or-not, product-visible-or-not, practical-or-AI-augmented.
Downstream skills (social-content-factory, lifecycle-journey-builder,
earned-media-pitch) filter the library by these tags.

## Capability boundary

This is the most realism-sensitive skill in the Lens. Read the
[capabilities reference](https://manual-focus.co.uk/lens/capabilities)
before running.

**Reliably works:**

- Environmental b-roll of generic endurance scenes (no named athlete,
  no specific product)
- Time-of-day and weather variants of an existing practical shot
- Short clips (4–10 seconds) for social cuts and reel backdrops
- Image-to-image augmentation where product and athlete stay practical
  and only the environment changes

**Does NOT work reliably:**

- Generating named athletes in scenarios they weren't filmed in
- Generating the brand's actual products with logos / colourways /
  geometry intact across motion
- Generating long-form video (>15 seconds) of consistent named subjects
- Generating audio of named athletes

If the user requests any of the unreliable categories, refuse and
recommend the practical alternative.

## The eval harness

**Eval B1 — Inventory coverage.** At any point, ≥30 segment-condition
cells covered in the library. Empty cells flagged for next shoot or
augmentation cycle.

**Eval B2 — Plausibility per AI asset.** Human review with category
knowledge. <80% pass rate = augmentation prompt or model needs
revision.

**Eval B3 — Audience response.** Quarterly: engagement on AI-augmented
assets vs practical-only. If AI assets perform >20% lower, audience
is detecting the AI; pull back.

**Eval B4 — Asset-to-touchpoint mapping.** Downstream skills find
the right asset >85% of the time without needing new capture.

## Failure modes to watch

- **Replacing the shoot.** Brand cuts shoot budget expecting AI to
  fill the gap. Content goes generic-feeling within weeks. Refuse
  this path; reduce the inventory instead.
- **Over-augmenting individual assets.** Cap variants per source shot
  at 3–4. Variety, not count.
- **Disclosure debt.** Cleaner path: disclose AI where the audience
  would reasonably believe it was practical. The honesty itself
  becomes part of the brand's positioning.
- **Limb / gear physics errors slip through.** Don't outsource the
  plausibility check to a generalist.
- **Wrong-segment asset under deadline.** Audience notices when a
  gravel asset is used for a road campaign. Tag specifically; don't
  cross-borrow.
- **Athlete likeness drift.** Face-consistency check on any frame
  with athletes visible.

## Hand-off

Tagged asset library feeds:
- **social-content-factory** — channel-native cuts pulled by segment
- **lifecycle-journey-builder** — touchpoint imagery
- **race-day-demand-pipeline** — campaign assets per event
- **gear-launch-sequence** — hero shoot output + augmentation
