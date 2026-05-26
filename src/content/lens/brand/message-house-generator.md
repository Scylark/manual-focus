---
title: "Message house generator from positioning brief"
stack: brand
description: "Convert a sharpened positioning into a four-tier message house of narrative, pillars, proof points and channel-mapped lines in a single working session."
outputs: "Message house, channel-mapped messaging lines, FAQ rebuttals"
readMin: 9
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content", "product-marketing"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-15
status: live
preview: false
---

## The brief

A positioning brief is a starting point. What the team actually needs to ship work is a message house, with the narrative at the top, the 3-4 pillars beneath, the proof points beneath those and the lines per channel that turn the proof into copy. Without it every piece of content reinvents the messaging wheel and the brand says slightly different things on social, in ads, on the website and in sales conversations.

This playbook converts a positioning brief (from the positioning-audit playbook or equivalent) into a complete message house in a working day. It also produces a rebuttal sheet for the 8-12 most common pushback questions, plus channel-specific lines for paid, social, email subjects, landing-page H1s and sales talking points.

## The pipeline

Four phases.

**Phase 1, inputs validation.** Confirm the positioning brief is complete, with a one-sentence position, 3-5 proof points, an audience definition and a what-not-this. A vague brief produces a vague message house, so the work refuses to start until the inputs are sharp.

**Phase 2, narrative drafting.** A single-sentence brand narrative that subsumes the positioning, plus three to five pillar candidates, each anchored to one or two proof points from the brief. The model proposes 2-3 alternative pillar structures and the team picks one.

**Phase 3, proof point expansion.** For each pillar, surface 3-5 proof points across data, customer story, partnership and technical claim. Each gets a one-sentence summary and a source tag.

**Phase 4, channel-mapped lines.** For each pillar, generate channel-specific lines including a 12-word landing-page H1, a 60-character email subject, a 280-character social post and a 3-bullet sales talking-point set. The lines all express the same pillar but adapt to channel constraints.

## The prompts

The pillar-generation prompt in phase 2 does the heaviest lifting. Pillars are claim-shaped, falsifiable, not category labels.

```text
SYSTEM: You generate brand-pillar candidates from a positioning
brief. Pillars are claim-shaped arguments the brand is making, not
organisational categories (no "Product", "People", "Process"). Each
pillar must be defensible against a skeptic. You return three
alternative pillar structures so the team can pick one.

USER:
Positioning brief: {POSITIONING_BRIEF}
Audience: {AUDIENCE_DEFINITION}
What-not-this: {WHAT_THE_BRAND_IS_NOT}
Proof points the brand can cite: {PROOF_POINTS_LIST}

Return JSON:
{
  "narrative_sentence": "<one sentence subsuming the positioning>",
  "structures": [
    {
      "name": "<short label, e.g. 'capability-led'>",
      "pillars": [
        {
          "claim": "<one-sentence claim, falsifiable>",
          "anchored_to": ["<which proof point this pillar leans on>"]
        }
      ]
    }
  ]
}

Rules:
- 3-5 pillars per structure.
- Pillars must be claims, not nouns. "The work compounds because
  we own the full pipeline" is a pillar. "Pipeline" is not.
- Every pillar anchored to at least one supplied proof point.
- 3 alternative structures so the team has real choice.
- No marketing hyperbole. Skeptic-readable.
```

## The eval gates

**Eval 1, pillar distinctiveness.** Pillars should be mutually distinct. Compute pairwise semantic similarity, and if two pillars score above 0.7 they are saying the same thing twice, so merge or sharpen.

**Eval 2, proof-point traceability.** Every proof point must trace to a source. No invented stats, no unverifiable claims. If the brief did not include a source the proof point is flagged for verification before it ships.

**Eval 3, channel-line tone consistency.** Run channel-specific lines through the voice-eval rubric. All lines should score above the voice-pass threshold. Lines that pass on the website but fail in social copy mean the brand has two voices and the team has not acknowledged it.

## The failure modes

**Pillars become categories, not messages.** A common slip is "Product", "People" or "Process" as pillars. These are organisational categories, not pillar arguments. Pillars should be claim-shaped, so "the work compounds because we own the full pipeline" reads as a pillar where "process" does not.

**Proof points get reused without permission.** Customer story proof points need active customer permission. The brand-friendly version of a customer quote is not the same as the customer's authorised version, so always re-confirm with the customer before publishing.

**Channel lines drift over time.** A line that worked at launch may have been overused six months in. The message house is a living document, so quarterly refresh the channel lines while keeping the narrative and pillars stable. The pattern is stability at the top, freshness at the channel.

## The pattern in practice

Illustrative scenarios that show common shapes a message house takes when run cleanly. Specifics are illustrative and the patterns repeat.

**B2B SaaS, scale-stage, the unification.** A brand with three different elevator pitches depending on whom you asked. The message house unifies the narrative in a single session, and the compounding effect typically lands a quarter or two later when sales pipeline conversion improves because the brand is finally being described consistently across all touchpoints.

**D2C, growth-stage, the drafting unlock.** A brand with strong positioning but no message house, so every piece of content re-derives what to say from scratch. The pipeline builds the house in a day, and drafting speed for new content multiplies in the following quarter because the pillars and proof points become reusable infrastructure rather than invented per-piece.
