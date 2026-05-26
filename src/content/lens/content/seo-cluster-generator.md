---
title: "SEO cluster generator, pillar, spoke, intent map"
stack: content
description: "Build a defensible topic cluster from one seed keyword. Intent-mapped, GEO-aware, with the eval criteria for surviving the next algorithm update built in from day one."
outputs: "Pillar page brief, 20-30 spoke briefs, internal link map, intent matrix"
readMin: 12
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["seo", "content"]
models: ["claude-4.5-opus", "gpt-5", "gemini-2.5-pro"]
publishedAt: 2026-05-08
status: live
preview: false
---

## The brief

A topic cluster done right is a moat. A topic cluster done wrong is 30 thin pages that compete with each other and get culled in the next Helpful Content Update. The difference is the strategy work that happens before any drafting starts. Which intent slots does this cluster claim, which queries already serve them well, where is the differentiation, and how do the pages link to each other so the authority compounds.

This playbook generates the strategy work in a working day from one seed keyword. The output is a pillar-page brief, 20 to 30 spoke briefs, an internal-link graph, and an intent-matrix that maps each page to the buyer stage and the query type it serves.

It does not draft the pages. That's the eval-gated drafting playbook. This is the planning artefact that sits upstream of every page in the cluster.

## The pipeline

Six phases.

**Phase 1, seed expansion.** Take the seed keyword. Pull 200+ related queries from Ahrefs, Semrush, or Search Console (whichever the brand uses). Filter for the brand's target locale, language, and a minimum search volume floor (typically 50 monthly searches for spokes, 500+ for pillar candidates).

**Phase 2, intent classification.** Classify each surviving query into the four canonical intents (informational, commercial, transactional, navigational) and into the buyer journey stage (problem-aware, solution-aware, product-aware, evaluating, decided). The model is competent at this if given examples. A 30-example reference set ships with the prompt.

**Phase 3, cluster shape.** Group the queries by topic. Identify the pillar candidate (highest volume plus informational or commercial intent that subsumes the spokes). Identify spokes (one page per topic, multiple queries per page). Identify orphans (queries that don't fit the cluster, which are signals for other clusters rather than failures).

**Phase 4, SERP analysis.** For each pillar candidate and the top 5 spokes by volume, pull the top 10 SERP results. Run a content-pattern extraction covering format (article, guide, tool, video), length, structure, who's ranking (publishers, brands, aggregators), and what types of evidence dominate (data, expert quote, original research, examples). The cluster has to look credible alongside what's ranking.

**Phase 5, differentiation hooks.** For each page in the cluster, surface 2 to 3 hooks where this brand can plausibly do better than the existing SERP. Original data the brand has, customer stories the brand can tell, expert access the brand controls, tools or interactives the brand can ship. If a spoke has no hook, it's flagged as "competitive, uncertain win" and deprioritised in the build order.

**Phase 6, internal link graph and brief output.** Generate the internal link recommendations (pillar links to all spokes, spokes link contextually to 2 to 4 sibling spokes, no spoke is orphaned). Output a pillar brief plus N spoke briefs plus the link graph plus the intent matrix as a single document the content team can hand off.

## The prompts

The intent classification prompt is the one where small models often go wrong. This is the version that holds up.

```text
SYSTEM: You classify search queries by intent and buyer stage. You use
the four canonical intents (informational, commercial, transactional,
navigational) and the five buyer stages (problem-aware, solution-aware,
product-aware, evaluating, decided). You return one intent and one
stage per query. You also return your confidence (high, medium, low).
You do not invent middle-ground categories.

When in doubt:
- "best X" without a brand qualifier → commercial / evaluating
- "X vs Y" → commercial / evaluating
- "how to X" → informational / problem-aware or solution-aware
- "X near me" → transactional / decided
- "[brand] X" → navigational / decided
- "what is X" → informational / problem-aware

USER:
Brand context: {BRAND_NAME}, category {CATEGORY}, audience {AUDIENCE}.

Queries (JSON array of strings):
{QUERIES_JSON}

Return JSON array, one element per query, in the same order:

[
  {
    "query": "...",
    "intent": "<informational | commercial | transactional | navigational>",
    "stage": "<problem-aware | solution-aware | product-aware | evaluating | decided>",
    "confidence": "<high | medium | low>",
    "fits_brand_audience": <true | false>  // is this a query our
                                          // audience actually asks?
                                          // a long-tail B2C query
                                          // does NOT fit a B2B brand
  }
]

Rules:
- One intent, one stage. Do not pick two.
- "fits_brand_audience": err on the side of false if uncertain. The
  cluster is sharper when off-audience queries are excluded.
- Confidence "low" is acceptable. Better than wrong-with-confidence.
```

The cluster-shape prompt that takes the classified queries and groups them, plus the differentiation-hooks prompt that surfaces the per-page wins, are shipped in the full playbook.

## The eval harness

The pipeline is gated against four failure modes.

**Eval 1, intent classification accuracy.** Hand-classify 50 queries from the brand's actual data. Pipeline accuracy should hit 85%+ vs the human gold-set. Below that, the model isn't fitting the brand's specific query patterns, usually because the audience definition is too broad.

**Eval 2, cluster coherence.** For each spoke, the queries grouped into it should share theme with high semantic similarity. Compute mean pairwise embedding similarity within each spoke. Above 0.6 is coherent. Below 0.4 means the cluster has multiple sub-topics squashed together, so split the spoke.

**Eval 3, SERP differentiation reality-check.** For the top 5 spokes, manually review the proposed differentiation hooks against the actual top 10 results. If the hook is "original data" and three of the top 10 already include original data, the hook isn't a hook. It's table stakes. Flag and require a stronger hook before drafting.

**Eval 4, link graph density.** No spoke should have fewer than 2 incoming links from other spokes or the pillar. The pillar should link to every spoke. Orphan spokes don't accumulate authority and rarely rank.

## The failure modes

**The seed keyword is too narrow.** Some seeds don't have a defensible cluster. They have 4 queries and a pillar candidate is overreaching. The pipeline flags clusters with fewer than 12 distinct spokes as "thin cluster, reconsider." Sometimes a thin cluster is honest. Sometimes the seed needs to be broader.

**SERP analysis sees yesterday's SERP.** Search results move. By the time the cluster is published, the SERP may have shifted. The differentiation hooks should be sturdy enough to survive minor SERP movement. "We have original benchmark data the others don't" survives. "We have a slightly newer article" doesn't.

**The model invents search volumes.** Some models will fill in plausible-looking search volumes if the data isn't supplied. Always feed the actual data and never let the model estimate volume. If volume data is missing, the pipeline should pause and request it, not generate around it.

**Cluster cannibalisation.** If two spokes both serve the same intent with different long-tail queries, they will compete in the SERP and dilute each other's authority. The clustering step should detect this. Sibling spokes with overlapping primary queries are flagged for merge. If two spokes are 70%+ overlap in intent and audience, they should be one page with section anchors, not two pages.

**Helpful Content Update vulnerability.** Pages built primarily from generated content with no original data, expert input, or first-person reporting are at material risk in the next algo cycle. The differentiation-hooks phase exists precisely to gate against this. If a spoke can't articulate what makes it worth indexing beyond what's already in the SERP, it doesn't ship.

**Pillar-spoke length mismatch.** Pillars work when they're meaningfully more comprehensive than the spokes, typically 3 to 5x longer. If your pillar plan is 1,200 words and your spokes are 1,000, the pillar isn't a pillar. It's another spoke. Pillar plans default to 3,000 to 5,000 words. Spokes default to 800 to 1,500.

## The pattern in practice

Illustrative scenarios that show common shapes a cluster build takes. Specifics are illustrative and the patterns repeat.

**B2B SaaS, growth-stage, the cluster-around-a-strong-seed.** A brand publishing a handful of posts a month with no cluster strategy. Running the pipeline on a strong seed (e.g. "marketing operations") produces a pillar plus 20+ spokes. Rebuilding the content backlog around the cluster typically lands the pillar in the top results for its seed within two quarters and a meaningful share of spokes in their top results. Organic traffic to the topic multiplies several-fold.

**D2C, scale-stage, the niche claim.** A brand trying to claim a niche category. The pipeline runs on a moderate-volume seed and surfaces a coherent cluster. Differentiation hooks come from the brand's own customer-survey data, something competitors don't have. The cluster ships in a couple of months and drives a substantial fraction of new-customer organic acquisition within two quarters. Original data per page is the unlock.

**Publishing, the Helpful-Content-Update failure.** A common failure mode is when a brand executes a strong cluster with a heavy LLM-drafting workflow that doesn't include original data or expert review. Pages rank initially, then drop in the next Helpful Content Update. This is why the current pipeline hard-flags any spoke whose hook depends on synthesis alone with no first-party input.
