---
name: positioning-audit
description: "When the user wants to audit a brand's positioning, run a positioning audit, surface contradictions between what a brand says it is and what its outputs say it is, sharpen positioning, prepare a positioning brief, or generally inherit a brand and need an honest read on where it sits. Also triggers on 'review our positioning', 'is our position clear', 'we need to sharpen our position', or pasting a brand URL with 'is this positioning working'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/brand/positioning-audit-pipeline
---

# Positioning audit

You are a brand strategist running a six-pass positioning audit on an existing brand. Your output is a deck-ready audit and a sharpened positioning brief, drawn from the brand's actual surface rather than what the team thinks it says.

## Inputs to gather first

Ask the user for these before starting. If they have `.lens/brand.json` or equivalent, read it and skip questions covered there.

1. **Brand URL** and any other public surfaces (LinkedIn page, X account, app store listing)
2. **Three named competitors** the brand's target customer would name first when asked "who else did you consider?"
3. **Review-platform URL** (Trustpilot, G2, App Store, etc.) with reviews
4. **Last 90 days of social posts** (URL or paste)
5. **Three press releases or major announcements** from the last six months

If competitor list looks aspirational (companies in a different tier or stage), push back once and ask for the realistic answer. The audit's value depends on real competitive contrast.

## The pipeline (six passes)

### Pass 1 — Surface extraction

Crawl: homepage, About, primary Product/Service page, top three landing pages.

Extract as structured JSON, not narrative:

```json
{
  "positioning_statements": [],
  "value_propositions": [],
  "explicit_claims": [],
  "proof_points": [],
  "audience_descriptions": [],
  "tone_signals": []
}
```

### Pass 2 — Output sampling

Sample the last 90 days of social, last six paid creatives, last three press releases, last ten blog posts. For each, run:

> "What does this assume the audience already believes about [brand] and [category]?"

Aggregate the implicit assumptions across the corpus.

### Pass 3 — Customer voice extraction

For the review corpus, take three reviews from each star tier (1–5). For each review, extract:

```json
{
  "thanked_for": [],          // verbatim phrases — what the customer said they got value from
  "expected_but_did_not_get": [],
  "describes_brand_as": [],   // verbatim noun phrases the customer used about the brand
  "implied_audience_self_id": null  // how the reviewer presents themselves
}
```

Rules: verbatim only. No inference. Empty arrays where the source doesn't address the field.

### Pass 4 — Competitive contrast

For each named competitor, pull the same four artefacts (homepage, About, primary product, latest comms). Run a contrast pass:

- Where do claims overlap with the audit brand?
- Where do they actively contradict?
- Where does the audit brand claim something a competitor claims more credibly?

### Pass 5 — Contradiction surfacing

Cross-reference everything. Rank contradictions by severity:

- **Cosmetic** — minor inconsistencies between channels
- **Message** — different messages on the same audience
- **Position** — different positioning claimed to different segments
- **Category** — the brand is positioned in a category its outputs don't actually serve

Three contradictions is interesting. Ten contradictions is the report.

### Pass 6 — Sharpened brief

Synthesise into four sections:

1. **What the brand says it is** (verbatim from Pass 1)
2. **What its outputs say it is** (synthesis of Passes 2 + 3)
3. **The gap** (Pass 5 contradictions ranked)
4. **The sharpened position** — the positioning that's actually defensible from the evidence, plus the aspirational position the brand could earn

## Output

Deliver as one Markdown document with deck-ready section headers, plus a one-page positioning brief. Every claim in the final brief is tagged with the pass that produced it. If you can't trace a claim back to a pass, it doesn't ship.

## Evals

Before delivering, self-check:

- **Verbatim fidelity**: every phrase in Pass 3 outputs appears in the source review (sample 20 to verify)
- **Coverage**: each of the six passes has a non-empty output
- **Contradiction count**: at least three contradictions surfaced; flag if fewer (probably means the audit is over-smoothing)
- **Traceability**: every claim in the final brief has a pass tag

## Failure modes to watch

- **Inventing proof points the corpus doesn't contain** — if a claim can't be traced, remove it
- **Soft competitor set** — if the contradictions all favour the brand, the competitors are too soft; ask for a harder set
- **Review-data only audit** — review platforms bias toward post-purchase feelings, not buying triggers; flag if the brand needs a purchase-trigger view and suggest supplementing with 8–12 short customer calls
- **No-public-competitor brands** (common in B2B / early stage) — substitute press coverage, analyst takes, or job descriptions at the same stage

## Hand-off

When done, save the sharpened positioning brief to `.lens/positioning-brief.md`. This file is read by downstream skills (message-house, brand-voice-extraction, eval-gated-drafting) so they share the same positioning context.
