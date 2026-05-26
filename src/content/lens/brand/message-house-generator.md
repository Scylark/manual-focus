---
title: "Message house generator from positioning brief"
stack: brand
description: "Convert a sharpened positioning into a four-tier message house — narrative, pillars, proof points, and channel-mapped lines — in a single working session."
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

A positioning brief is a starting point. What the team actually needs to ship work is a message house — the narrative at the top, the 3-4 pillars beneath, the proof points beneath those, the lines per channel that turn the proof into copy. Without it, every piece of content reinvents the messaging wheel, and the brand says slightly different things on social, in ads, on the website and in sales conversations.

This playbook converts a positioning brief (from the positioning-audit playbook or equivalent) into a complete message house in a working day. Includes a rebuttal sheet for the 8-12 most common pushback questions, plus channel-specific lines for paid, social, email subjects, landing-page H1s, and sales-pitch bullets.

## The pipeline

Four phases.

**Phase 1 — Inputs validation.** Confirm the positioning brief is complete: one-sentence position, 3-5 proof points, audience definition, what-not-this. Brief that's vague produces a vague message house — refuse to start until inputs are sharp.

**Phase 2 — Narrative drafting.** Single-sentence brand narrative that subsumes the positioning. Three to five pillar candidates, each anchored to one or two proof points from the brief. The model proposes 2-3 alternative pillar structures; the team picks one.

**Phase 3 — Proof point expansion.** For each pillar, surface 3-5 proof points (data, customer story, partnership, technical claim). Each gets a one-sentence summary and a source tag.

**Phase 4 — Channel-mapped lines.** For each pillar, generate channel-specific lines: a 12-word landing-page H1, a 60-character email subject, a 280-character social post, a 3-bullet sales talking-point set. The lines all express the same pillar but adapt to channel constraints.

## The eval gates

**Eval 1 — Pillar distinctiveness.** Pillars should be mutually distinct. Compute pairwise semantic similarity. If two pillars score >0.7 similarity, they're saying the same thing twice. Merge or sharpen.

**Eval 2 — Proof-point traceability.** Every proof point must trace to a source. No invented stats, no unverifiable claims. If the brief didn't include a source, the proof point is flagged for verification before it ships.

**Eval 3 — Channel-line tone consistency.** Run channel-specific lines through the voice-eval rubric. All lines should score above the voice-pass threshold. Lines that pass on the website but fail in social copy mean the brand has two voices and the team hasn't acknowledged it.

## The failure modes

**Pillars become categories, not messages.** Common slip: "Product," "People," "Process" as pillars. These are organisational categories, not pillar arguments. Pillars should be claim-shaped — "the work compounds because we own the full pipeline," not "process."

**Proof points get reused without permission.** Customer story proof points require active customer permission. The brand-friendly version of a customer quote is not the same as the customer's authorised version. Always re-confirm with the customer before publishing.

**Channel lines drift over time.** A line that worked at launch may have been overused six months in. The message house is a living document — quarterly refresh the channel lines while keeping the narrative and pillars stable. Stability at the top, freshness at the channel.

## The receipts

**B2B SaaS, scale-stage.** Brand had three different elevator pitches depending on whom you asked. Message house unified the narrative in a single session. Six months later, sales pipeline conversion improved 14% — partly because the brand was finally being described consistently across all touchpoints.

**D2C, growth-stage.** Brand had a strong positioning but no message house, so every piece of content had to re-derive what to say. Pipeline built the house in a day. The team's drafting speed for new content increased 3x in the following quarter, because the pillars and proof points were now reusable infrastructure, not invented per-piece.
