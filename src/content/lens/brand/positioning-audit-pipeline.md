---
title: "Positioning audit pipeline"
stack: brand
description: "Run a brand's public surface through a six-pass audit and ship a sharpened positioning brief in a working day. Said-versus-shown gaps, contradictions, defensible ground."
outputs: "Positioning audit deck, sharpened brief, contradictions ranked by severity"
readMin: 22
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-04-12
status: live
preview: true
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **said-versus-shown report**, what the brand's website claims it is on one side, what its outputs (social, ads, blog, press) actually say on the other, with the gaps named.
2. A **contradictions list** ranked by severity (cosmetic, message, position, category), each anchored to the pass and source artefact that surfaced it.
3. A **sharpened positioning brief** for the next ninety days, a one-sentence position, three to five proof points, an audience definition and a what-not-this.
4. A **defensible-versus-aspirational map**, showing which parts of the current positioning the brand already earns and which parts are aspirational but not yet earned.

## Who this is for

A fractional CMO who has just stepped in, a board member running a marketing review, a founder who has finally accepted that the 2021 deck is no longer carrying the work, or a brand strategist running an inherited account. The brand has at least twelve months of public output, three named competitors, and either a review platform (B2C) or testimonials and case studies (B2B). If the brand has no public surface yet, this playbook does not apply, run the message-house-generator or naming-sprint instead.

## Before you start

- [ ] Brand's website, especially homepage, About, three top product or service pages
- [ ] Ninety days of social output across the primary two channels
- [ ] The last six paid creatives (image plus copy)
- [ ] The last three press releases or PR pieces
- [ ] The last ten long-form blog posts
- [ ] Customer voice data, either three reviews per star tier from a review platform (B2C) or 6 to 10 customer testimonials, case study quotes, or LinkedIn recommendations (B2B)
- [ ] Three named competitors, picked as the ones the brand's target customer would name first
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode
- [ ] A scratch folder for the source materials

If any of the inputs are missing, the audit will be partial. The contradictions you cannot see are the ones that bite.

## The pipeline

Six passes. End-to-end in a working day if the materials are gathered, longer if you are still pulling them.

### Pass 1, surface extraction

Read the brand's claims as written. Store as structured JSON.

**Step 1.1, scrape the public surface.**

Pull the homepage, the About page, and the top three product or service pages. The top-three rule is by traffic if you have analytics access, by linked-from-homepage if you do not. Save the HTML or paste the readable text into `surface/homepage.txt`, `surface/about.txt`, `surface/page-1.txt` and so on.

**Step 1.2, run the surface extraction prompt.**

```text
SYSTEM: You extract a brand's stated positioning from its public
website surface. You record what the brand claims, not what you
infer. Verbatim phrases only. You do not editorialise.

USER:
Brand pages (JSON list of {url, body}):
{SURFACE_JSON}

For each page, return JSON shaped like:

{
  "page_url": "<url>",
  "positioning_statements": ["<verbatim>"],
  "value_propositions": ["<verbatim>"],
  "explicit_claims": ["<verbatim>"],
  "proof_points_cited": [
    {"claim": "<verbatim>", "source_cited": "<verbatim or empty>"}
  ],
  "audience_descriptions": ["<verbatim phrases describing who the
    site says the brand is for>"],
  "tone_signals": ["<verbatim phrases that signal voice or tone>"]
}

Rules:
- Verbatim phrases only. Do not paraphrase.
- "proof_points_cited" must include the source as the brand cites it.
  Empty source string if uncited.
- Empty arrays where the page lacks the field.
```

**Expect output like:**

```json
{
  "page_url": "/about",
  "positioning_statements": ["Trail-running kit that survives the season."],
  "value_propositions": ["Engineered for the second loop.", "Two-year guarantee on every shell."],
  "explicit_claims": ["Forty-eight months of wear-test data.", "Athletes wear the kit they help us design."],
  "proof_points_cited": [
    {"claim": "Forty-eight months of wear-test data", "source_cited": ""},
    {"claim": "Two-year guarantee", "source_cited": "returns policy"}
  ],
  "audience_descriptions": ["recreational and mid-pack racers", "people who run the long Sunday"],
  "tone_signals": ["honest miles", "the back half", "first light"]
}
```

**You should now have** a `surface-extraction.json` file with every public claim the brand makes.

### Pass 2, output sampling

The website is the curated face. The output is what the brand actually publishes day-to-day. The gap between them is where the audit starts to find signal.

**Step 2.1, gather the outputs.**

Save the social posts (90 days), six paid creatives, three press releases, ten blog posts into `outputs/` subfolders. Plain text for everything, no images, no formatting markup.

**Step 2.2, run the implicit-assumption prompt on each piece.**

```text
SYSTEM: You read a single piece of brand output (social post, ad
copy, blog opening, press release) and surface what it ASSUMES the
audience already believes about the brand. The implicit assumptions
are often where the brand's real positioning lives.

USER:
Output piece:
"""
{OUTPUT_TEXT}
"""

Channel: {CHANNEL}
Type: {TYPE}

Return JSON shaped like:

{
  "implicit_audience_beliefs": ["<beliefs this piece assumes the
    audience already holds about the brand>"],
  "implicit_brand_self_view": ["<what this piece assumes about who
    the brand is>"],
  "explicit_claims": ["<verbatim claims made in the piece>"]
}

Rules:
- Implicit beliefs are inferred from the piece's framing, what it
  doesn't bother to explain, what it takes for granted.
- Verbatim claims only in the third field.
- 1 to 4 entries per array.
```

Run this across every piece. Save into `outputs-assumptions.json`. The aggregation across 90 days of social plus 10 blog posts plus 6 ads gives you the brand's real implicit positioning, the one operating across actual outputs rather than the homepage.

**Step 2.3, aggregate the assumptions.**

```text
SYSTEM: You aggregate the implicit assumptions from 30+ brand
outputs and surface the most common implied beliefs. You return the
top 5 to 8 implied positions sorted by frequency.

USER:
All implicit assumptions across outputs:
{OUTPUTS_ASSUMPTIONS_JSON}

Return JSON shaped like:

{
  "top_implied_positions": [
    {
      "implied_position": "<one-sentence summary>",
      "frequency_pieces": <int>,
      "verbatim_evidence": ["<3 examples>"]
    }
  ],
  "outlier_positions": [
    "<implied positions that appear once or twice but contradict
      the top-implied set>"
  ]
}

Rules:
- 5 to 8 top implied positions.
- "outlier_positions" surfaces internal contradictions for Pass 5.
```

**You should now have** the brand's implicit positioning as shown by 90 days of actual outputs, plus a list of outliers that will become contradictions in Pass 5.

### Pass 3, customer voice extraction

The customers say a third thing. The audit's central artefact is the gap between what the brand says, what its outputs show, and what the customers actually thank the brand for.

**Step 3.1, gather the customer voice.**

For a B2C brand with a review platform, pull three reviews from each star tier (1 to 5). Fifteen reviews total. For a B2B brand or agency, pull 6 to 10 customer testimonials, case study quotes and LinkedIn recommendations. Label each as brand-curated (the brand picked the testimonial) or customer-led (the customer wrote without prompting), because brand-curated sources are lower signal.

**Step 3.2, run the customer-voice prompt.**

```text
SYSTEM: You read customer reviews and extract ONLY what the customer
themselves wrote. When the customer thanks the brand for something,
you record the exact thing. You do not infer feelings beyond what
the star rating provides.

USER:
Review (1 of N):
"""
{REVIEW_TEXT}
"""
Star rating: {STARS}
Source type: {BRAND_CURATED_OR_CUSTOMER_LED}

Return JSON shaped like:

{
  "thanked_for": ["<verbatim phrases describing what the customer
    said they got value from>"],
  "expected_but_did_not_get": ["<verbatim only, empty if not stated>"],
  "describes_brand_as": ["<verbatim noun phrases the customer used
    to describe the brand>"],
  "implied_audience_self_id": "<noun phrase describing the kind of
    person the reviewer presents themselves as, ONLY if explicit>"
}

Rules:
- Verbatim phrases only.
- Do not paraphrase.
- Leave fields empty if not stated.
```

Run this across every review or testimonial. Save into `customer-voice.json`.

**Step 3.3, aggregate the customer voice.**

```text
SYSTEM: You aggregate customer-voice extractions across N reviews
and surface the most common things customers thank the brand for,
the most common ways customers describe the brand, and the most
common gaps between expectation and delivery.

USER:
All customer voice extractions:
{CUSTOMER_VOICE_JSON}

Return JSON shaped like:

{
  "top_thanked_for": [
    {"theme": "<one-phrase summary>", "frequency": <int>, "evidence": ["<3 verbatim>"]}
  ],
  "top_describes_brand_as": [
    {"phrase": "<theme>", "frequency": <int>, "evidence": ["<3 verbatim>"]}
  ],
  "expectation_gaps": [
    {"theme": "<one-phrase>", "frequency": <int>}
  ],
  "audience_self_id_themes": [
    {"theme": "<one-phrase>", "frequency": <int>}
  ]
}

Rules:
- Themes must come from clusters in the verbatim data, not invented.
- Frequency is the count of reviews mentioning the theme.
- Brand-curated sources get half-weight in frequency counts.
```

**You should now have** an aggregated read on what customers thank the brand for, how they describe it, and where expectations diverge.

### Pass 4, competitive contrast

Compare the brand's positioning against three named competitors. The aim is to find the ground the brand actually owns versus ground it claims but does not own.

**Step 4.1, scrape the competitors.**

For each named competitor, pull the same four artefacts you pulled for the brand. Homepage, About, two top product or service pages, six paid creatives if visible. Save into `competitors/[name]/` subfolders.

**Step 4.2, run the competitor extraction.**

Same prompt as Pass 1. Get one `surface-extraction.json` per competitor.

**Step 4.3, run the contrast prompt.**

```text
SYSTEM: You compare a brand's positioning against three named
competitors and surface where they overlap, where they actively
contradict, and where the brand claims something a competitor claims
more credibly.

USER:
Brand positioning: {BRAND_SURFACE_EXTRACTION}
Competitor 1: {COMPETITOR_1_EXTRACTION}
Competitor 2: {COMPETITOR_2_EXTRACTION}
Competitor 3: {COMPETITOR_3_EXTRACTION}

Return JSON shaped like:

{
  "overlap_ground": [
    {
      "claim": "<verbatim brand claim>",
      "competitors_claiming_similar": ["<names>"],
      "ownership_verdict": "<brand_owns | shared | competitor_owns>",
      "ownership_evidence": "<one sentence>"
    }
  ],
  "contested_ground": [
    {
      "claim": "<verbatim brand claim>",
      "contradicted_by_competitor": "<name>",
      "competitor_evidence": "<verbatim from competitor>"
    }
  ],
  "uncontested_brand_ground": [
    {"claim": "<verbatim brand claim>", "why_unique": "<one sentence>"}
  ]
}

Rules:
- Verbatim claims and evidence only.
- "ownership_verdict" of "brand_owns" requires the brand to have
  stronger or more specific evidence than competitors.
- Uncontested ground is the brand's defensible position.
```

**Step 4.4, the revenue-mix sub-pass.**

Add one check that catches the common audit failure of comparing stated audience to public materials while missing revenue mix. If you can access revenue mix data (from finance or the founder), feed it into a follow-up prompt asking the model to surface contradictions between marketed audience and actual buyers. If you cannot access revenue, ask the founder for a one-sentence summary of where the money comes from and feed that in.

**You should now have** a contrast report naming the brand's defensible ground, the contested ground, and the ground the brand claims but a competitor owns.

### Pass 5, contradiction surfacing

Three contradictions are interesting. Ten contradictions is the report. The model has the patience to read every page, the human reviewer skims by page five.

**Step 5.1, run the contradiction prompt.**

```text
SYSTEM: You surface contradictions across the brand's own positioning
materials. You compare what the brand says (Pass 1), what its
outputs show (Pass 2), what customers thank it for (Pass 3), and
where competitors contradict (Pass 4). You rank contradictions by
severity, cosmetic, message, position, category.

USER:
Pass 1 (stated): {SURFACE_EXTRACTION_JSON}
Pass 2 (shown): {OUTPUTS_ASSUMPTIONS_JSON}
Pass 3 (customer voice): {CUSTOMER_VOICE_AGGREGATE_JSON}
Pass 4 (competitor contrast): {COMPETITOR_CONTRAST_JSON}
Revenue mix summary: {REVENUE_MIX_SUMMARY}

Return JSON shaped like:

{
  "contradictions": [
    {
      "type": "<said_vs_shown | said_vs_customer | said_vs_revenue
        | said_vs_competitor | shown_vs_customer>",
      "severity": "<cosmetic | message | position | category>",
      "brand_claim": "<verbatim>",
      "contradicting_evidence": "<verbatim>",
      "source_pass": "<1 | 2 | 3 | 4>",
      "interpretation": "<one sentence>"
    }
  ]
}

Severity rubric:
- "cosmetic", phrasing inconsistency, no strategic implication
- "message", wording contradicts but underlying claim could be aligned
- "position", the brand says it occupies a position the evidence
  does not support
- "category", the brand claims to be in a category it does not
  actually serve

Rules:
- At least 5 contradictions, up to 15.
- Rank within severity (positions before messages before cosmetics).
- Every contradiction must be sourced to a verbatim claim and
  verbatim evidence.
```

**You should now have** a ranked contradictions list, with positions and categories at the top, messages and cosmetics at the bottom.

### Pass 6, sharpened brief

The synthesis. Four sections.

**Step 6.1, run the brief prompt.**

```text
SYSTEM: You synthesise a positioning audit into a sharpened brief.
Four sections. Said-versus-shown, contradictions, the position that
is actually defensible, the position that is aspirational but not
yet earned.

USER:
All pass outputs (1 through 5): {ALL_PASS_JSON}

Return JSON shaped like:

{
  "said_vs_shown": {
    "brand_says_it_is": "<one paragraph synthesised from Pass 1>",
    "outputs_show_it_is": "<one paragraph from Pass 2>",
    "customers_say_it_is": "<one paragraph from Pass 3>"
  },
  "contradictions_ranked": {
    "category_level": [...],
    "position_level": [...],
    "message_level": [...],
    "cosmetic_level": [...]
  },
  "defensible_position": {
    "position_sentence": "<one sentence the brand can defend with
      Pass 3 customer evidence and Pass 4 competitive evidence>",
    "proof_points": ["<3 to 5 proofs, each traceable to a pass>"],
    "audience_definition": "<one paragraph>",
    "what_not_this": ["<2 to 4 categories the brand is not in>"]
  },
  "aspirational_not_yet_earned": {
    "claims": ["<positioning claims the brand makes but does not
      yet have evidence for>"],
    "what_would_earn_them": ["<one sentence per claim, what the
      brand would have to do or prove>"]
  }
}

Rules:
- Every claim in defensible_position must trace to a specific pass.
- aspirational_not_yet_earned is honest. Do not soften.
- defensible_position sentence is under 25 words and names category
  or contrast.
```

**Step 6.2, the deck and the one-pager.**

Convert the brief output into two artefacts. A deck (eight to twelve slides covering each section) and a one-pager that any founder can read in five minutes. Both ship as markdown that can be rendered or pasted into a deck tool.

**You should now have** a sharpened brief, ranked contradictions, defensible position, aspirational claims, and the two output formats.

## Worked example, end-to-end

Cascadia Endurance. The brand has been running for four years, the original positioning deck was written in 2021, and the new fractional CMO has asked for an audit.

**Pass 1 output.** Twelve pages scraped. The brand says it is "trail-running kit that survives the season." Value propositions include the two-year guarantee, the forty-eight months of wear-test data, the athlete-co-design programme. Audience descriptions cluster on "recreational and mid-pack racers." Tone signals are endurance-honest, "the back half," "first light," "honest miles."

**Pass 2 output.** Ninety days of social, six ads, ten blog posts. The top implied positions across outputs are, in order of frequency, "kit for the second loop" (24 pieces), "the brand's writers actually run" (18 pieces), "two-year guarantee is non-negotiable" (11 pieces), "athletes co-design the range" (9 pieces), "premium price, fair price" (6 pieces). One outlier surfaces, three pieces imply a road-running positioning that contradicts the trail-only stated focus.

**Pass 3 output.** Customer voice across thirty reviews and twelve testimonials. The top thanked-for themes are durability (mentioned in 31 of 42 sources), fit (18 of 42), customer service on repairs (14 of 42), athlete content quality (9 of 42). Almost nobody thanks the brand for "performance metrics" or "race-day advantage." Audience self-ID themes are "weekend warrior," "recreational ultra," "mid-pack racer with a job."

**Pass 4 output.** The brand's "durability for the second loop" ground is uncontested versus Salomon S/LAB and Inov-8. The "athlete-co-design" ground is contested by Salomon's much larger sponsor roster. The "premium price, fair price" ground is undermined by a competitor offering similar warranties at lower prices.

**Pass 5 output.** Eight contradictions surfaced. The most severe:

1. **Position level.** The brand's About page implies it serves the "dedicated athlete," but customer voice and revenue mix both show 78% of revenue from recreational and mid-pack runners. Said-versus-customer.
2. **Position level.** The brand has three social pieces implying a road-running positioning, but the trail-only focus is otherwise explicit. Internal contradiction (shown-versus-shown).
3. **Position level.** The brand claims "athletes co-design" but only 9 of 42 reviews thank it for athlete content, suggesting the co-design claim is more important to the brand than to the customer. Said-versus-customer.
4. **Message level.** The brand says "engineered for the second loop" on the homepage, but no product page explains what that means or which loop. Brand-internal.
5. **Message level.** The two-year guarantee is mentioned across all surfaces but never quantified against industry norms. The brand's audience does not know the guarantee is unusual.

**Pass 6 output.**

Defensible position: "Trail-running kit that survives the season for recreational and mid-pack racers who run the long Sunday."

Proof points, four, all traceable.

- 48 months of wear-test data (Pass 1, verified internal source)
- Customer voice clusters on durability (Pass 3, 31 of 42 sources)
- Two-year guarantee versus industry-standard 90-day (Pass 1 plus competitive contrast)
- 78% of revenue from recreational and mid-pack (Pass 4 revenue-mix sub-pass)

Audience definition: "Recreational ultra runners and mid-pack racers, working adults with limited training hours, who run the long Sunday and value kit that survives multiple seasons over kit that wins a launch shoot."

What-not-this: road-running kit, elite-only racing apparel, sub-£100 entry pieces.

Aspirational claims not yet earned: "athletes co-design the range" (the brand needs to either prove the co-design programme is materially shaping product decisions or retire the claim), "performance kit for the dedicated athlete" (the customer voice does not support a performance positioning, retire the claim).

The fractional CMO ships the brief to the founder in a Friday session. The founder agrees to retire the "dedicated athlete" framing and tighten "co-design" into a specific named programme. Pages get updated within a month, the next quarter's content plan is built on the sharpened brief.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, run Pass 1 on your own website

Pull your homepage and About page as plain text. Run the surface-extraction prompt. Read the JSON. Did it surface positioning statements you would not have called positioning statements? Did it miss any claims you think are central? The gap between the output and your mental model is the audit's first finding.

### Exercise 2, run Pass 3 on 10 reviews

Pull ten reviews from your platform of choice. Run the customer-voice prompt on each. Aggregate the `thanked_for` themes by hand. Are the top three themes what your homepage emphasises? If yes, your positioning is aligned. If not, you have a said-versus-customer contradiction that the full audit will surface in Pass 5.

### Exercise 3, find your single biggest contradiction

Take any one surface (homepage About copy), one piece of customer voice (a top review), and one competitor homepage. Paste all three into Claude and ask:

> "Find the single biggest contradiction across these three sources. Rank it by severity (cosmetic, message, position, category). Cite verbatim evidence."

If the answer is at position or category level, you have a real positioning problem worth running the full audit for.

## The eval gates

**Eval 1, verbatim fidelity.** Sample 20 review outputs from Pass 3. Manually verify that every phrase in `thanked_for` actually appears in the source review. Acceptance threshold 95% verbatim accuracy. Below 90% means the model is paraphrasing, switch to a model with stronger instruction-following or tighten the system prompt.

**Eval 2, coverage.** For each pass, sample five inputs and check the output covers all schema sections. Empty arrays are fine when the source genuinely lacks the field. Empty arrays in 30%+ of cases mean the prompt is too restrictive, soften "verbatim only" to "verbatim where possible, summarised in [brackets] otherwise."

**Eval 3, disagreement detection.** The audit's value is in surfacing contradictions. Run the final synthesis pass against three brands with known positioning weaknesses (build a small reference set). The pipeline should surface at least 70% of the known contradictions. Below 50% means Pass 5 is over-smoothing, make the contradiction prompt more adversarial.

**Eval 4, traceability.** Every claim in the sharpened brief must trace to a specific pass and a verbatim source. If a claim cannot be traced, it does not ship in the brief. This is the discipline that stops the model from padding with invented proofs.

## The failure modes

**The model invents proof points.** Some models pad the synthesis with claims like "the brand emphasises sustainability across its output" when the underlying corpus says nothing of the sort. Fix by tagging every claim in the final brief with the pass that produced it and the source artefacts. If you cannot trace a claim back to a source, it does not ship.

**The competitor set is too soft.** Pick competitors who are not credible and every contradiction looks favourable. Pick the competitor the brand's target customer would name first when asked "who else did you consider?" rather than the one the brand wishes it competed with.

**Customer voice does not match the buying decision.** Review data biases toward post-purchase feelings rather than buying triggers. If the brand's positioning needs to clarify why someone chose it, supplement Pass 3 with a small purchase-trigger interview set (8 to 12 short calls). The pipeline still does the heavy synthesis.

**The brand has no competitors with public output.** Common in B2B and early-stage. Substitute press coverage of the category, third-party analyst takes, or job descriptions from the same company stage. The pipeline handles JSON input from any source.

**The revenue-mix sub-pass gets skipped.** A failure mode common in audits run by external reviewers without finance access. Without revenue mix the pipeline can miss the contradiction between marketed audience (consumers) and book of business (B2B contracts). Insist on at least a one-sentence revenue-mix summary from the founder before running Pass 4.

## The pattern in practice

Illustrative scenarios that show what the audit typically surfaces. Specifics are illustrative, patterns repeat.

**Endurance-sports brand, Series B, the common one.** The brand believes it is positioned on "performance for the dedicated athlete." The audit often surfaces that customers thank the brand four-to-one for fit and durability and almost never for performance metrics. Competitive contrast tends to show the performance angle is the most contested ground in the category. The sharpened position lands as something like "endurance kit that survives the kit-bag, season after season." A line like that typically ends up on the homepage within a season of acting on the audit.

**Fintech, pre-Series A, the category re-frame.** A brand positioned around "AI-powered" everything. The audit often pulls apart the implicit audience definitions on the website (developers, finance teams, ops leads) and shows they contradict each other on every page. Customer reviews thank the brand for reliability of integrations rather than AI features. The brief typically recommends a category re-position from "AI" to "integrations infrastructure," moving the brand into a category it already credibly serves rather than the one it claims to.

**Sports tech, Series C, the missed contradiction.** A failure mode pattern. Pipelines that compare stated audience to public materials but ignore revenue mix can miss the contradiction between marketed audience (consumers) and book of business (pro teams). Pass 4 includes the revenue-mix sub-pass to catch this, because the failure mode is real and the gap can be enormous.

## Hand-off

The sharpened brief feeds:
- **message-house-generator**, the brief is the input to the message house, with the validator prompt confirming the inputs are sharp
- **tagline-system**, the defensible position sentence anchors tagline generation
- **brand-voice-extraction**, the customer voice from Pass 3 informs voice corpus selection
- **naming-sprint**, if the audit recommends a sub-brand or rename, the brief becomes the naming inputs
