---
name: seo-cluster-generator
description: "When the user wants to build an SEO topic cluster, plan a pillar and spokes, generate a content cluster around a seed keyword, map search intent, or build a defensible SEO content strategy. Also triggers on 'build us an SEO cluster', 'pillar page plan', 'topic cluster around X', 'we need a content strategy', or 'what should we rank for'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/content/seo-cluster-generator
---

# SEO cluster generator

You build a defensible topic cluster from one seed keyword in a working day. Pillar page brief + 20–30 spoke briefs + internal link map + intent matrix. You do not draft the pages (that's the eval-gated-drafting skill). You produce the planning artefact every page in the cluster references.

## Inputs to gather first

1. **Seed keyword** the cluster should be built around
2. **Target locale and language** (e.g. en-GB, en-US)
3. **Search Console data** for the brand (last 90 days) — or Ahrefs / Semrush data if GSC isn't connected
4. **Three named competitors** for SERP analysis
5. **Brand differentiation** — what original data, customer stories, expert access, or tools does the brand have that competitors don't? Read `.lens/positioning-brief.md` and `.lens/message-house.md` if present.
6. **Min volume threshold** — default 50 monthly searches for spokes, 500+ for pillar candidates

## The pipeline (six phases)

### Phase 1 — Seed expansion

Pull 200+ related queries from the supplied data. Filter:
- Target locale + language
- Min volume threshold
- Strip brand-name queries

### Phase 2 — Intent classification

Classify each query into the four canonical intents (informational, commercial, transactional, navigational) and the five buyer stages (problem-aware, solution-aware, product-aware, evaluating, decided).

```text
SYSTEM: You classify search queries by intent and buyer stage. Four
canonical intents, five buyer stages. One intent + one stage per query.
You also return confidence (high / medium / low). You do not invent
middle-ground categories.

Heuristics:
- "best X" without brand qualifier → commercial / evaluating
- "X vs Y" → commercial / evaluating
- "how to X" → informational / problem-aware or solution-aware
- "X near me" → transactional / decided
- "[brand] X" → navigational / decided
- "what is X" → informational / problem-aware

USER:
Brand context: {BRAND_NAME}, category {CATEGORY}, audience {AUDIENCE}.
Queries: {QUERIES_JSON}

Return JSON array (same order as input):
[
  {
    "query": "...",
    "intent": "<informational|commercial|transactional|navigational>",
    "stage": "<problem-aware|solution-aware|product-aware|evaluating|decided>",
    "confidence": "<high|medium|low>",
    "fits_brand_audience": <true|false>
  }
]

Rules:
- One intent, one stage. Do not pick two.
- "fits_brand_audience": err on the side of false if uncertain.
- "low" confidence acceptable. Better than wrong-with-confidence.
```

### Phase 3 — Cluster shape

Group queries by topic. Identify:

- **Pillar candidate** — highest volume + informational/commercial intent that subsumes the spokes
- **Spokes** — one page per topic, multiple queries per page
- **Orphans** — queries that don't fit; signal for other clusters, not failures

### Phase 4 — SERP analysis

For the pillar candidate and the top 5 spokes by volume, pull top 10 SERP results. Extract:

- Format (article / guide / tool / video)
- Length range
- Who's ranking (publishers / brands / aggregators)
- Evidence types dominating (data, expert quote, original research, examples)

The cluster has to look credible alongside what's ranking.

### Phase 5 — Differentiation hooks

For each page in the cluster, surface 2–3 hooks where this brand can plausibly beat the existing SERP. Sources:

- Original data the brand has (customer survey, product analytics, transaction data)
- Customer stories the brand can tell
- Expert access the brand controls
- Tools or interactives the brand can ship

If a spoke has no defensible hook, flag as "competitive — uncertain win" and deprioritise.

### Phase 6 — Internal link graph + briefs

Generate:

- **Link graph** — pillar links to all spokes; each spoke links contextually to 2–4 sibling spokes; no orphans
- **Pillar brief** — 3,000–5,000 words target, sections, must-include queries, differentiation hooks, evidence requirements
- **Spoke briefs** — 800–1,500 words each, structured the same

## Output

Single document:

1. **Cluster map** — pillar + spokes diagram with internal links
2. **Intent matrix** — every page mapped to intent + stage
3. **Pillar brief** — full
4. **Spoke briefs** — all 20–30
5. **Build order** — recommended sequence (high-volume + clear differentiation first)

Save to `.lens/seo-clusters/{seed-keyword}/`.

## Evals

Self-check before delivery:

- **Intent classification accuracy** — hand-classify 50 queries from the brand's data; pipeline accuracy ≥85%
- **Cluster coherence** — pairwise embedding similarity within each spoke ≥0.6
- **SERP differentiation reality** — for top 5 spokes, manually check that proposed hooks aren't already table-stakes in the current top 10
- **Link graph density** — no spoke has fewer than 2 incoming links

## Failure modes to watch

- **Seed too narrow** — fewer than 12 spokes is a thin cluster. Honest read: either the seed needs broadening or the cluster isn't defensible.
- **SERP analysis sees yesterday's SERP** — differentiation hooks should be sturdy enough to survive minor SERP movement.
- **Model invents search volumes** — always feed actual data. If volume is missing, pause and request — never let the model estimate.
- **Cluster cannibalisation** — sibling spokes with overlapping primary queries dilute each other. Flag for merge if 70%+ overlap in intent + audience.
- **Helpful Content Update vulnerability** — spokes that can't articulate a hook beyond synthesis shouldn't ship.
- **Pillar-spoke length mismatch** — pillars 3–5x longer than spokes. If your pillar is 1,200 words and spokes are 1,000, it's not a pillar.

## Hand-off

Spoke briefs feed:
- **eval-gated-drafting** — drafts each spoke with eval gates against the brief
- **social-content-factory** — repurposes anchor spokes into channel-native posts
- **earned-media-pitch** — surfaces pillar stories worth pitching to journalists
