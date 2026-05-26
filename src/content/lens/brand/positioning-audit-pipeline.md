---
title: "Positioning audit pipeline"
stack: brand
description: "Run an existing brand's site, materials and ads through a six-pass audit pipeline. Output a positioning sharpened brief with the gaps, the contradictions and the lift."
outputs: "Positioning audit deck and sharpened brief"
readMin: 11
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-04-12
status: live
preview: true
---

## The brief

You inherit a brand. Maybe you've just stepped in as fractional CMO, maybe a board has asked you to review the marketing function, maybe a founder has finally accepted that the deck written in 2021 isn't carrying the work. The first thing you need is an honest read on where the positioning actually sits today, not where the team thinks it sits.

The traditional version of this is a week of interviews plus a desk-research sprint. The AI-leveraged version produces a tighter version of the same artefact in a working day, because the pipeline reads more of the brand's output than a human reviewer ever would and finds the contradictions a human would gloss over.

This playbook takes a brand's public surface (website, three months of social, recent ads, press releases, three customer reviews from each star tier) and outputs a four-section audit: **what the brand says it is**, **what its outputs say it is**, **the gap between those two**, and **the sharpened positioning brief** for the next ninety days.

## The pipeline

The pipeline has six passes. Each pass narrows the analysis from the brand's own claims down to a defensible point of view.

**Pass 1 — Surface extraction.** Crawl the brand's homepage, About, Product/Services pages, and the top three landing pages by traffic. Extract: positioning statements, value propositions, claims, proof points, audience descriptions, tone signals. Store as structured JSON, not narrative.

**Pass 2 — Output sampling.** Pull the last ninety days of social posts, the last six paid creatives, the last three press releases, the last ten blog posts. Feed each through a "what does this assume the audience already believes" prompt. Aggregate the implicit assumptions.

**Pass 3 — Customer voice extraction.** Take three reviews from each star tier (1 to 5) on the brand's primary review platform. Run a "what does the customer actually thank the brand for" pass alongside a "what does the customer say the brand is for" pass. The two answers rarely match.

**Pass 4 — Competitive contrast.** Pull the same four artefacts from three named competitors. Run a contrast pass: where do the claims overlap, where do they actively contradict, where does this brand claim something a competitor claims more credibly.

**Pass 5 — Contradiction surfacing.** Cross-reference everything. Three contradictions are interesting, ten contradictions is the report. The model is good at finding these because it has the patience to read every page; a human reviewer skims by page five.

**Pass 6 — Sharpened brief.** Synthesise into the four-section output: said-vs-shown, contradictions ranked by severity, the position that's actually defensible, the position that's aspirational but not yet earned. Hand back as a deck-ready Markdown doc plus a one-pager.

## The prompts

The pass that does the heaviest lifting is **Pass 3 — Customer voice extraction**. Two prompts, run in pairs across the review corpus.

```text
SYSTEM: You are a brand strategist reading customer reviews. You extract
ONLY what the customer themselves wrote, not what you infer. When the
customer thanks the brand for something, you record the exact thing they
thanked them for. You do not editorialise.

USER:
Review (1 of N):
"""
{REVIEW_TEXT}
"""

Star rating: {STARS}

Return a JSON object:
{
  "thanked_for": ["..."],         // verbatim phrases describing what
                                  // the customer said they got value from
  "expected_but_did_not_get": [], // verbatim only — leave empty if not stated
  "describes_brand_as": ["..."],  // verbatim noun phrases the customer
                                  // used to describe the brand (NOT the
                                  // product)
  "implied_audience_self_id": null // a noun phrase describing the kind
                                  // of person the reviewer presents
                                  // themselves as, IF AND ONLY IF
                                  // explicitly stated
}

Rules:
- Verbatim phrases only. Do not paraphrase.
- If the customer does not state something, leave the field empty.
- Do not infer sentiment beyond what the star rating provides.
```

The companion prompt asks the same model to surface **what the brand thinks its positioning is** from the website surface, in identical JSON shape. The mismatch between the two — "what the brand says it is" vs "what the customers say it is" — is the central artefact of the audit.

Pass 5's contradiction surfacing prompt is shipped in the full playbook download, including the rubric for ranking contradictions by severity (cosmetic, message, position, category).

## The eval harness

The pipeline is gated against three failure modes.

**Eval 1 — Verbatim fidelity.** Sample 20 review outputs. For each, manually verify that every phrase in `thanked_for` actually appears in the source review. Acceptance threshold: 95% verbatim accuracy. Anything below 90% means the model is paraphrasing — switch to a model with stronger instruction-following or tighten the system prompt.

**Eval 2 — Coverage.** For each of the six passes, sample 5 inputs and check that the output covers all sections in the schema. Empty arrays are fine when the source genuinely lacks the field. Empty arrays in 30%+ of cases mean the prompt is too restrictive — soften "verbatim only" to "verbatim where possible, summarised in [brackets] otherwise."

**Eval 3 — Disagreement detection.** The audit's value is in surfacing contradictions. Run the final synthesis pass against three brands with known positioning weaknesses (we maintain a small reference set). The pipeline should surface at least 70% of the known contradictions. Below 50% means Pass 5 is over-smoothing — make the contradiction prompt more adversarial.

## The failure modes

**The model invents proof points.** Some models (we won't name them, the rankings change quarterly) will pad the synthesis with claims like "the brand emphasises sustainability across its output" when the underlying corpus says nothing of the sort. Fix: every claim in the final brief is tagged with the pass that produced it and the source artefacts. If you can't trace a claim back to a source, it doesn't ship.

**The competitor set is too soft.** If you pick competitors who aren't credible, every contradiction looks favourable. Pick the competitor the brand's target customer would name first when asked "who else did you consider?" — not the one the brand wishes it competed with.

**Customer voice doesn't match the buying decision.** Review data biases toward post-purchase feelings, not buying triggers. If the brand's positioning needs to clarify why someone *chose* it, supplement Pass 3 with a small purchase-trigger interview set (8 to 12 short calls). The pipeline still does the heavy synthesis.

**The brand has no competitors with public output.** Common in B2B and early-stage. Substitute press coverage of the category, third-party analyst takes, or job descriptions from the same company stage. The pipeline handles JSON input from any source.

## The receipts

Three engagements where we ran this pipeline. Brand names redacted under standard NDA, the patterns are the point.

**Endurance-sports brand, Series B.** Brand believed it was positioned on "performance for the dedicated athlete." Pipeline found that customers thanked the brand 4-to-1 for fit and durability, almost never for performance metrics. Competitive contrast showed the performance angle was the most contested ground in the category. Sharpened position: "endurance kit that survives the kit-bag, season after season." Six months later, that line is the homepage hero.

**Fintech, pre-Series A.** Brand positioned around "AI-powered" everything. Pipeline pulled apart the website's three implicit audience definitions (developers, finance teams, ops leads) and showed they contradicted each other on every page. Customer reviews thanked the brand for reliability of integrations, not AI features. Brief recommended a category re-position from "AI" to "integrations infrastructure." Now a $40M ARR business with that positioning.

**Sports tech, Series C, retired entry.** This pipeline version (V2) failed to detect a contradiction between the brand's stated audience (consumers) and its actual book of business (pro teams). We added Pass 4's "revenue mix vs marketing mix" sub-pass off the back of this engagement. V3 catches the issue.
