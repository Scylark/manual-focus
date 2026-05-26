---
name: message-house
description: "When the user wants to build a message house, convert positioning into a narrative architecture, create messaging pillars, draft proof points, or generate channel-mapped messaging lines. Also triggers on 'we need a message house', 'turn this positioning into messaging', 'build the pillars', 'what's our narrative', or 'we keep saying different things across channels'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/brand/message-house-generator
---

# Message house

You convert a positioning brief into a four-tier message house: narrative at the top, 3–4 pillars beneath, proof points beneath those, channel-specific lines at the floor. Each pillar is claim-shaped, not organisational. Each proof point traces to a source.

## Inputs to gather first

1. **Positioning brief** — read from `.lens/positioning-brief.md` if it exists, or ask for the equivalent. Must include the one-sentence position, 3–5 proof points, audience definition, what-not-this. Refuse to start if the positioning is vague.
2. **Channels** to map messaging against — paid ads, social, email, landing pages, sales pitch
3. **Voice profile** — read from `.lens/voice-profile.json` if it exists, or ask. Channel lines need to pass the voice rubric.

## The pipeline (four phases)

### Phase 1 — Inputs validation

Confirm the positioning brief is sharp. Test:
- Can you state the brand's position in one sentence?
- Are the proof points concrete (data, customer story, partnership, technical claim)?
- Is the audience defined as a behavioural segment, not just a demographic?
- Does the brief name what the brand is explicitly NOT?

If any test fails, send the brief back. Vague positioning produces a vague message house.

### Phase 2 — Narrative drafting

Generate the **one-sentence brand narrative** that subsumes the positioning. Then propose 2–3 alternative **pillar structures**, each with 3–5 candidate pillars. Pillars must be claim-shaped:

- Bad pillar: "Product" (category, not claim)
- Good pillar: "The work compounds because we own the full pipeline" (claim, falsifiable, defensible)

Present the alternatives. User picks one structure.

### Phase 3 — Proof point expansion

For each pillar, surface 3–5 proof points. Each gets:
- One-sentence summary
- Source tag (data / customer / partnership / technical / market)
- Reusability flag (one-time use vs evergreen)

Customer story proof points require active customer permission to publish. Flag any that need re-confirmation.

### Phase 4 — Channel-mapped lines

For each pillar, generate channel-specific lines:

| Channel | Constraint | Form |
|---|---|---|
| Landing-page H1 | 12 words max | Outcome-anchored |
| Email subject | 60 chars max | Specific not generic |
| Social post (LinkedIn) | 200 words | Hook on line 1 |
| Social post (X) | 280 chars | Argument-compressed |
| Paid ad headline | 30 chars | Benefit-led |
| Sales talking point | 3 bullets | Pillar + proof + ask |

All lines run through the voice rubric. Lines that fail go back for regeneration.

## Output

Single document with these sections:

1. **The narrative** — one sentence, the top of the house
2. **The pillars** — 3–4 named, each with one-sentence definition
3. **The proof** — proof points per pillar, with sources
4. **The lines** — channel-mapped messaging per pillar
5. **The rebuttal sheet** — 8–12 pushback questions buyers / press / internal stakeholders are likely to ask, with answers in pillar language

Save to `.lens/message-house.md`. Downstream skills (lifecycle-journey-builder, social-content-factory, earned-media-pitch, eval-gated-drafting) read this for messaging consistency.

## Evals

Self-check before delivery:

- **Pillar distinctiveness** — pairwise semantic similarity between pillars <0.7. If two pillars are saying the same thing, merge or sharpen.
- **Proof traceability** — every proof point has a source tag. Unsourced claims don't ship.
- **Channel-line voice match** — every line scores ≥10/12 on the voice rubric. If a line passes on the website but fails in social, flag — the brand may have two voices.

## Failure modes to watch

- **Pillars become categories** — "Product / People / Process" is organisational, not claim-shaped. Pillars must be arguments the brand is making.
- **Proof points get reused without permission** — customer quotes require active permission. The brand-friendly version is not the authorised version.
- **Channel lines drift over time** — message house is a living document. Quarterly refresh of channel lines; narrative and pillars stay stable.
- **Trying to be too many things** — a four-pillar house is the ceiling. Five+ pillars means the positioning isn't focused. Push back to the positioning brief.

## Hand-off

When done, the message house is the source of truth for all subsequent content. Downstream skills will reference it:
- **lifecycle-journey-builder** uses the channel lines for touchpoint copy
- **earned-media-pitch** uses the narrative and pillars for journalist framing
- **eval-gated-drafting** uses the pillars to score whether a piece advances the position
