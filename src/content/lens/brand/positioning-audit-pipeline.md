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

You inherit a brand. Maybe you've just stepped in as fractional CMO, maybe a board has asked you to review the marketing function, maybe a founder has finally accepted that the deck written in 2021 isn't carrying the work. The first thing you need is an honest read on where the positioning actually sits today, rather than where the team thinks it sits.

The traditional version of this is a week of interviews plus a desk-research sprint. The AI-leveraged version produces a tighter version of the same artefact in a working day, because the pipeline reads more of the brand's output than a human reviewer ever would and finds the contradictions a human would gloss over.

This playbook takes a brand's public surface (website, three months of social, recent ads, press releases, three customer reviews from each star tier) and outputs a four-section audit. **What the brand says it is**, **what its outputs say it is**, **the gap between those two**, and **the sharpened positioning brief** for the next ninety days.

## The pipeline

The pipeline has six passes. Each pass narrows the analysis from the brand's own claims down to a defensible point of view.

**Pass 1, surface extraction.** Crawl the brand's homepage, About, Product/Services pages, and the top three landing pages by traffic. Extract positioning statements, value propositions, claims, proof points, audience descriptions, tone signals. Store as structured JSON rather than narrative.

**Pass 2, output sampling.** Pull the last ninety days of social posts, the last six paid creatives, the last three press releases, the last ten blog posts. Feed each through a "what does this assume the audience already believes" prompt. Aggregate the implicit assumptions.

**Pass 3, customer voice extraction.** For a B2C brand with a review platform, take three reviews from each star tier (1 to 5). Run a "what does the customer actually thank the brand for" pass alongside a "what does the customer say the brand is for" pass. The two answers rarely match.

For a B2B service or agency without a review corpus, pull from testimonials on the brand's site, case-study quotes, LinkedIn recommendations, and ideally an 8 to 10 customer call mini-sprint commissioned for this audit. Brand-curated sources (the testimonials the brand selected for its own site) get flagged as lower-signal than customer-led ones.

**Pass 4, competitive contrast.** Pull the same four artefacts from three named competitors. Run a contrast pass. Where do the claims overlap, where do they actively contradict, where does this brand claim something a competitor claims more credibly.

**Pass 5, contradiction surfacing.** Cross-reference everything. Three contradictions are interesting, ten contradictions is the report. The model is good at finding these because it has the patience to read every page. A human reviewer skims by page five.

**Pass 6, sharpened brief.** Synthesise into the four-section output. Said-vs-shown, contradictions ranked by severity, the position that's actually defensible, and the position that's aspirational but not yet earned. Hand back as a deck-ready Markdown doc plus a one-pager.

## The prompts

The pass that does the heaviest lifting is **Pass 3, customer voice extraction**. Two prompts, run in pairs across the review corpus.

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

The companion prompt asks the same model to surface what the brand thinks its positioning is from the website surface, in identical JSON shape. The mismatch between "what the brand says it is" and "what the customers say it is" is the central artefact of the audit.

Pass 5's contradiction surfacing prompt is shipped in the full playbook download, including the rubric for ranking contradictions by severity (cosmetic, message, position, category).

## The eval harness

The pipeline is gated against three failure modes.

**Eval 1, verbatim fidelity.** Sample 20 review outputs. For each, manually verify that every phrase in `thanked_for` actually appears in the source review. Acceptance threshold is 95% verbatim accuracy. Anything below 90% means the model is paraphrasing, so switch to a model with stronger instruction-following or tighten the system prompt.

**Eval 2, coverage.** For each of the six passes, sample 5 inputs and check that the output covers all sections in the schema. Empty arrays are fine when the source genuinely lacks the field. Empty arrays in 30%+ of cases mean the prompt is too restrictive, so soften "verbatim only" to "verbatim where possible, summarised in [brackets] otherwise."

**Eval 3, disagreement detection.** The audit's value is in surfacing contradictions. Run the final synthesis pass against three brands with known positioning weaknesses (a small reference set holds these). The pipeline should surface at least 70% of the known contradictions. Below 50% means Pass 5 is over-smoothing, so make the contradiction prompt more adversarial.

## The failure modes

**The model invents proof points.** Some models will pad the synthesis with claims like "the brand emphasises sustainability across its output" when the underlying corpus says nothing of the sort. Fix this by tagging every claim in the final brief with the pass that produced it and the source artefacts. If you can't trace a claim back to a source, it doesn't ship.

**The competitor set is too soft.** If you pick competitors who aren't credible, every contradiction looks favourable. Pick the competitor the brand's target customer would name first when asked "who else did you consider?" rather than the one the brand wishes it competed with.

**Customer voice doesn't match the buying decision.** Review data biases toward post-purchase feelings rather than buying triggers. If the brand's positioning needs to clarify why someone *chose* it, supplement Pass 3 with a small purchase-trigger interview set (8 to 12 short calls). The pipeline still does the heavy synthesis.

**The brand has no competitors with public output.** Common in B2B and early-stage. Substitute press coverage of the category, third-party analyst takes, or job descriptions from the same company stage. The pipeline handles JSON input from any source.

## The pattern in practice

Illustrative scenarios that show what the audit typically surfaces when run against brands at these stages. Specifics are illustrative and the patterns repeat.

**Endurance-sports brand, Series B, the common one.** The brand believes it is positioned on "performance for the dedicated athlete." The audit often surfaces that customers thank the brand four-to-one for fit and durability and almost never for performance metrics. Competitive contrast tends to show the performance angle is the most contested ground in the category. The sharpened position lands as something like "endurance kit that survives the kit-bag, season after season." A line like that typically ends up on the homepage within a season of acting on the audit.

**Fintech, pre-Series A, the category re-frame.** A brand positioned around "AI-powered" everything. The audit often pulls apart the implicit audience definitions on the website (developers, finance teams, ops leads) and shows they contradict each other on every page. Customer reviews thank the brand for reliability of integrations rather than AI features. The brief typically recommends a category re-position from "AI" to "integrations infrastructure," moving the brand into a category it already credibly serves rather than the one it claims to.

**Sports tech, Series C, the missed contradiction.** A failure mode pattern. Pipelines that compare stated audience to public materials but ignore revenue mix can miss the contradiction between marketed audience (consumers) and book of business (pro teams). Pass 4 includes a "revenue mix vs marketing mix" sub-pass to catch this, built into the pipeline because the failure mode is real.
