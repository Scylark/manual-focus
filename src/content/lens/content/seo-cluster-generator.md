---
title: "SEO cluster generator, pillar, spoke, intent map"
stack: content
description: "Build a defensible topic cluster from one seed keyword. Intent-mapped, GEO-aware, with the eval criteria for surviving the next algorithm update built in from day one."
outputs: "Pillar page brief, 20-30 spoke briefs, internal link map, intent matrix"
readMin: 18
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["seo", "content"]
models: ["claude-4.5-opus", "gpt-5", "gemini-2.5-pro"]
publishedAt: 2026-05-08
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **populated cluster-map CSV** with one row per page, every page tagged for intent, buyer stage, search volume, differentiation hook and build status.
2. A **pillar-page brief** of 800 to 1,200 words covering the anchor query, the SERP shape, the brand's hook, the section outline and the internal links the pillar must carry.
3. **Twenty to thirty spoke briefs**, each with target query, intent, length target, must-include facts with sources, voice profile reference and the two-to-four spokes it links to.
4. An **internal-link graph** showing the pillar at the top and every spoke connected by two-to-four sibling links so no page sits orphaned.
5. An **intent matrix** that maps each page to the buyer stage and query type it serves, so the content team can prioritise commercial-intent spokes against informational ones.

## Who this is for

A growth or scale-stage brand whose SEO programme is mature enough to think in clusters, with an SEO lead who can pull keyword data from ahrefs or semrush and an editor who can hand briefs to drafters. If you are still ranking for less than ten queries total, run a topical-authority audit before clustering. If your content team is a single founder, the spoke count drops to ten and you still get value.

## Before you start

- [ ] ahrefs, semrush or Google Search Console access for the brand's domain
- [ ] A seed keyword with at least 500 monthly searches in the brand's target locale
- [ ] CMS access (Webflow, Shopify, WordPress) so you can see the brand's existing content and check overlap
- [ ] A voice profile, extracted via the brand-voice-extraction playbook
- [ ] A list of three to five named competitors who already rank for the seed
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode
- [ ] A spreadsheet for the cluster map, Google Sheets or Excel

If you are missing the voice profile, the briefs will still ship but the drafters downstream will work harder. If you cannot pull search volume, the prioritisation collapses to gut feel.

## The pipeline

Six phases. End-to-end in a working day if the seed and the tooling are ready.

### Phase 1, seed expansion

Pull the universe of related queries and trim to what the brand can plausibly serve.

**Step 1.1, export the keyword universe.**

In ahrefs, open Site Explorer and paste the seed. Open **Matching terms** in the left sidebar. Set the country to the brand's target locale. Set a volume floor of 50 monthly searches. Export the top 500 queries as CSV.

In semrush, open Keyword Magic Tool and paste the seed. Set the database to the brand's locale. Apply a volume filter at 50 monthly minimum. Export the top 500.

In Search Console, open **Performance**. Set date range to the last 16 months. Filter queries containing the seed root. Export the impressions and clicks data as CSV. This gives you the queries the brand already shows up for, which sometimes surfaces spokes the keyword tools miss.

**Step 1.2, deduplicate and merge.**

Merge the three exports into one CSV. Strip duplicates, near-duplicates (same query with a trailing word that does not change intent) and queries below the volume floor. You should be at 200 to 400 candidates.

**You should now have** a single deduplicated CSV with one row per candidate query, columns for query, monthly volume, source (ahrefs, semrush, GSC).

### Phase 2, intent classification

Classify every surviving query by intent and buyer stage.

**Step 2.1, run the intent classification prompt.**

```text
SYSTEM: You classify search queries by intent and buyer stage. You
use the four canonical intents (informational, commercial,
transactional, navigational) and the five buyer stages
(problem-aware, solution-aware, product-aware, evaluating, decided).
You return one intent and one stage per query plus a confidence
rating. You do not invent middle-ground categories.

When in doubt:
- "best X" without a brand qualifier, commercial / evaluating
- "X vs Y", commercial / evaluating
- "how to X", informational / problem-aware or solution-aware
- "X near me", transactional / decided
- "[brand] X", navigational / decided
- "what is X", informational / problem-aware

USER:
Brand context: {BRAND_NAME}, category {CATEGORY}, audience {AUDIENCE}.

Queries (JSON array of strings):
{QUERIES_JSON}

Return JSON array, one element per query, in the same order:

[
  {
    "query": "<verbatim>",
    "intent": "<informational | commercial | transactional | navigational>",
    "stage": "<problem-aware | solution-aware | product-aware | evaluating | decided>",
    "confidence": "<high | medium | low>",
    "fits_brand_audience": <true | false>
  }
]

Rules:
- One intent, one stage. Do not pick two.
- "fits_brand_audience" should err on the side of false if uncertain.
- Confidence "low" is acceptable, better than wrong-with-confidence.
```

**Step 2.2, drop the off-audience queries.**

Filter the output to `fits_brand_audience: true`. The brand serves the audience the audience serves, not the broader market. Expect to drop 20 to 40% of the candidates here.

**You should now have** a classified CSV with intent, stage and confidence per query, off-audience queries removed.

### Phase 3, cluster shape

Pick the pillar and group the spokes.

**Step 3.1, run the cluster shape prompt.**

```text
SYSTEM: You build a topic cluster from a classified query list. You
identify one pillar candidate, a set of spoke topics, and orphan
queries that do not fit. Each spoke topic groups two-to-eight queries
with shared intent and theme.

USER:
Brand context: {BRAND_NAME}, {CATEGORY}
Classified queries: {CLASSIFIED_QUERIES_JSON}

Return JSON:

{
  "pillar_candidate": {
    "topic": "<short topic phrase>",
    "anchor_query": "<the head query>",
    "supporting_queries": ["<query>", "..."],
    "estimated_volume": <int>
  },
  "spoke_topics": [
    {
      "topic": "<short topic phrase>",
      "target_query": "<head query for this spoke>",
      "supporting_queries": ["<long-tail queries grouped here>"],
      "intent": "<from classification>",
      "stage": "<from classification>",
      "estimated_volume": <int>
    }
  ],
  "orphans": [
    {"query": "<query>", "reason": "<why it does not fit>"}
  ]
}

Rules:
- One pillar candidate. The pillar subsumes the spokes in scope.
- 18 to 30 spoke topics. If fewer, the cluster is too thin to ship.
- Each spoke groups two-to-eight queries with shared intent.
- Orphans are queries that belong in a different cluster, not in
  this one. They are signals, not failures.
```

**Step 3.2, sanity check the shape.**

The pillar should be the broadest commercial or informational query the brand can credibly own. If the pillar candidate is narrower than two of its spokes, the cluster is upside down, swap them. If the cluster has fewer than 18 spokes, the seed is too narrow, broaden it.

**You should now have** a pillar, 18 to 30 spokes and an orphans list.

### Phase 4, SERP analysis and differentiation

What is ranking, and how does the brand do better.

**Step 4.1, pull the SERP for the pillar and the top eight spokes.**

For each of the nine queries (pillar plus top eight spokes by volume), open ahrefs or semrush. Run **SERP analysis** on the query. Note the format (article, guide, tool, video, listicle), median length, who is ranking (publishers, brand sites, aggregators) and what evidence the top results lean on (data, expert quote, original research, customer story).

Capture this in a SERP analysis sheet, nine rows, one per query.

**Step 4.2, run the differentiation hook prompt.**

```text
SYSTEM: You surface differentiation hooks for each page in a cluster.
A hook is a credible reason this brand can outperform what is
currently ranking. Hooks are first-party data the brand has, customer
stories the brand can tell, expert access the brand controls, tools
the brand can ship, or POV the brand can defend.

USER:
Brand: {BRAND_NAME}
Brand assets available: {LIST_OF_ASSETS}
Cluster: {PILLAR_AND_SPOKES_JSON}
SERP analysis: {SERP_ANALYSIS_SHEET}

For each page (pillar plus spokes), return JSON:

[
  {
    "page": "<topic>",
    "target_query": "<query>",
    "hooks": [
      {
        "type": "<first_party_data | customer_story | expert_access | tool | pov>",
        "summary": "<one sentence>",
        "credible_for_serp": <true | false>
      }
    ],
    "verdict": "<ship | weak_hook | competitive_uncertain>"
  }
]

Rules:
- 2 to 3 hooks per page minimum.
- "credible_for_serp" is false if the hook is already present in 3+
  of the top 10 ranking results. That is table stakes, not a hook.
- "verdict" defaults to "weak_hook" if all hooks read as table stakes.
- "verdict" defaults to "competitive_uncertain" if the SERP is
  dominated by major publishers and the brand has no first-party
  signal.
```

**Step 4.3, kill the weak-hook spokes.**

Spokes flagged `weak_hook` or `competitive_uncertain` get deprioritised. Some get merged into stronger sibling spokes. Some get killed outright.

**You should now have** a per-page hook list and a sharper spoke set, typically 15 to 25 spokes after the kill.

### Phase 5, internal link graph and brief output

Wire the cluster together and write the briefs.

**Step 5.1, build the internal link graph.**

Rules of thumb. The pillar links to every spoke. Every spoke links back to the pillar. Sibling spokes link to two-to-four nearest neighbours by intent and stage (a problem-aware informational spoke links to two solution-aware informational siblings, plus the pillar). No spoke is orphaned.

The cluster-map CSV has columns for `Internal_links_in` and `Internal_links_out`. Populate them as integers, and keep a separate sheet listing the actual link pairs.

**Step 5.2, choose your template path.**

**Option A, download the cluster map template.** Grab [seo-cluster-map-template.csv](/lens/templates/seo-cluster-map-template.csv). It has columns for cluster, page type, target query, volume, intent, stage, confidence, fits-audience, differentiation hook, link counts, word target, priority, status, brief owner and notes. Open in Sheets or Excel, paste your work from phases 1 through 4 into the right rows, save.

**Option B, build a custom map for a non-standard structure.** If the brand needs columns the standard template does not have (geo-targeted variants, multilingual versions, video-first pages), ask Claude to build the template.

```text
SYSTEM: You generate an SEO cluster map template for a brand based
on their content programme structure. The template is one row per
page, with columns appropriate to the brand's specifics.

USER:
Brand: {BRAND_NAME}
Markets: {LIST_MARKETS}
Languages: {LIST_LANGUAGES}
Page types in scope (pillar, spoke, glossary, comparison, etc.):
  {LIST_PAGE_TYPES}
Tracking dimensions the team uses: {LIST_DIMENSIONS}

Generate a CSV template with at minimum:
Cluster, Page_type, Target_query, Search_volume, Intent, Buyer_stage,
Confidence, Fits_audience, Differentiation_hook, Internal_links_in,
Internal_links_out, Word_count_target, Priority, Status, Brief_owner,
Notes

Add brand-specific columns where the inputs suggest them.

Return the CSV directly, no commentary.
```

**Step 5.3, write the briefs.**

The pillar brief runs 800 to 1,200 words and covers anchor query, secondary queries, SERP shape, brand's hook, full section outline with H2 and H3 labels, must-include facts with sources, internal links out, voice profile reference, and word count target (3,000 to 5,000 for the pillar).

Each spoke brief runs 300 to 500 words and covers target query, supporting queries, intent and stage, the brand's hook, must-include facts with sources, the two-to-four sibling spokes it links to, the pillar it links back to, voice profile reference, and word count target (800 to 1,500 per spoke).

The brief template lives in your CMS or your project tool (Notion, Linear, Asana). The cluster map CSV references each brief by URL or page ID.

**You should now have** the cluster map populated and the briefs ready to hand to drafters.

### Phase 6, hand to drafting

The cluster map and briefs feed the eval-gated-drafting pipeline. The drafting pipeline is upstream-blocked on this artefact, so the better Phase 5 is, the cleaner Phase 6 runs.

**Step 6.1, prioritise the build order.**

Build the pillar first. Then build the four-to-six spokes with the strongest hooks and the highest commercial intent. Then build the supporting informational spokes that feed the commercial pages with internal links. The weakest spokes ship last, after the cluster has accumulated some authority.

**Step 6.2, set the publication cadence.**

A cluster of 25 pages does not ship in a week. Plan for two-to-three pages a week over two-to-three months, with the pillar live within the first two weeks so subsequent spokes have something to link up to.

You should now have a build queue with the pillar dated, the first wave of spokes dated, and the longer tail scheduled out.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand, scale-stage. The Vahla Range sub-brand needs an SEO cluster around trail-running footwear because the brand is launching trail shoes in autumn and the head of growth wants the SERP populated by then.

**Phase 1 output.** Seed query, "trail running shoes." Pulled 432 candidate queries from ahrefs, 380 from semrush, 210 from GSC where Cascadia already shows up for related terms. Merged and deduped to 287 candidates with volume above 50 monthly.

**Phase 2 output.** Intent classification ran on the 287. 64 queries dropped as off-audience (mostly US-focused queries Cascadia does not serve, plus generic running queries that do not specifically map to trail). 223 surviving queries entered Phase 3.

**Phase 3 output.** Pillar candidate, "best trail running shoes" at 4,400 monthly volume in the UK. Twenty-eight spoke topics identified. Eleven orphans flagged for a future hiking-footwear cluster.

**Phase 4 output.** SERP analysis ran on the pillar plus top eight spokes. The SERP is dominated by major publishers (Runner's World, Trail Running Magazine, Believe in the Run) plus two retailers (SportsShoes, Pro Direct). Original wear-test data and expert coach POV are present in three of the top ten on the pillar, so neither is a hook on its own. Cascadia's hook is a first-party 18-month wear panel across 80 UK runners plus the Trail Club onboarding survey (n=412) that no competitor has. Eight spokes flagged `weak_hook` and dropped or merged into siblings. Final spoke count, 19.

**Phase 5 output.** Cluster map CSV populated with the pillar plus 19 spokes. Sample rows visible below.

| Cluster | Page type | Target query | Volume | Intent | Stage | Hook | Priority |
|---|---|---|---|---|---|---|---|
| trail-running-shoes | pillar | best trail running shoes | 4,400 | commercial | evaluating | wear panel n=80 plus coach POV | P0 |
| trail-running-shoes | spoke | trail running shoes for ultras | 720 | commercial | evaluating | Vahla Range fit log from Lavaredo entrants | P0 |
| trail-running-shoes | spoke | trail vs road running shoes | 1,200 | informational | solution-aware | visual breakdown by audience tier | P0 |
| trail-running-shoes | spoke | how to choose trail running shoes | 1,900 | informational | solution-aware | decision tree from coach Marcus Hale | P0 |
| trail-running-shoes | spoke | trail running shoes for beginners | 880 | informational | problem-aware | Trail Club onboarding survey n=412 | P1 |
| trail-running-shoes | spoke | UTMB shoe choice 2026 | 90 | commercial | product-aware | Beth Lyons race recap angle | P1 |

The pillar brief identifies a 4,500-word target with a section per audience tier (recreational, mid-pack racer, ultra entrant), a section on the wear panel methodology, a section on selecting for terrain, and a comparison block for the top five shoes Cascadia stocks plus three competitors.

A sample of the spoke brief for "trail running shoes for ultras."

> **Target query.** trail running shoes for ultras
> **Supporting queries.** best ultra running shoes, UTMB shoe choice, 100k trail shoes
> **Intent.** commercial / evaluating
> **Hook.** Vahla Range fit log from Lavaredo entrants, 28 finishers wearing the Vahla shell over 120 km. Plus Beth Lyons's published race notes from her 2025 UTMB finish.
> **Length.** 1,400 words
> **Internal links out.** pillar (best trail running shoes), "how to choose trail running shoes", "UTMB shoe choice 2026"
> **Must-include facts.** Vahla Range fit panel data (source, internal QA log), Beth Lyons UTMB notes (source, athlete blog), Lavaredo finisher survey (source, Cascadia Trail Club).

**Phase 6 output.** Build queue. Pillar live week 1. Spokes "how to choose trail running shoes" and "trail vs road running shoes" live week 2 because they feed the pillar with internal links and pre-launch traffic. Commercial spokes ("trail running shoes for ultras", "UTMB shoe choice 2026") live weeks 3 and 4 ahead of the launch. The long tail builds out across weeks 5 to 12.

A quarter after the cluster ships, the pillar ranks at position 6 in the UK SERP for "best trail running shoes" and is climbing. Three commercial spokes rank in the top 10. The "how to choose" spoke ranks at position 3 and drives the highest assisted-conversion volume in the cluster, more than the pillar itself, because it catches the audience earlier and the internal link to the pillar carries the conversion.

## Try it yourself

Three exercises, each takes 30 to 60 minutes once you have your seed.

### Exercise 1, classify 50 queries by hand

Take 50 queries from your seed expansion. Classify by intent and stage by hand, no model. Then run the same 50 through the Phase 2 prompt. Compare. The disagreements are where your audience definition is fuzzy or where the model is fitting a generic pattern. Sharpen the brand context block before running the full set.

### Exercise 2, find one hook per page

Pick three spokes from your cluster. For each, ask Claude in a follow-up.

> "Here is the spoke topic, the SERP analysis, and the brand's available assets. Surface one credible differentiation hook that none of the top 10 ranking results already use. Be honest if you cannot find one."

If the model returns "no credible hook found" for two of three spokes, the cluster is in a category the brand cannot currently win. That is useful information, refocus the seed or invest in first-party research before drafting.

### Exercise 3, write one spoke brief by hand

Pick the spoke with the strongest hook. Write the brief by hand, no model. Include target query, supporting queries, intent, hook, must-include facts with sources, internal links out, word count. Then ask Claude to critique the brief against the cluster strategy. The critique surfaces gaps you cannot see because you wrote it.

## The eval gates

**Eval 1, intent classification accuracy.** Hand-classify 50 queries from your data. Pipeline accuracy hits 85% or higher against the gold set. Below that, the audience definition is too broad, sharpen the brand context block.

**Eval 2, cluster coherence.** For each spoke, compute mean pairwise embedding similarity across its grouped queries. Above 0.6 is coherent. Below 0.4 means the spoke is multiple sub-topics squashed together, split it.

**Eval 3, hook credibility.** For each P0 and P1 page, the hook must not appear in three or more of the top ten ranking results. If it does, it is table stakes and the page needs a real hook before drafting.

**Eval 4, link graph density.** No spoke has fewer than two incoming links from siblings or the pillar. The pillar links to every spoke. Orphan spokes do not accumulate authority and rarely rank.

**Eval 5, pillar-to-spoke length ratio.** Pillar is 3 to 5 times the spoke length. If your pillar plan is 1,200 words and your spokes are 1,000, the pillar is another spoke. Default the pillar to 3,000 to 5,000 words and spokes to 800 to 1,500.

## The failure modes

**Seed is too narrow.** Some seeds do not have a defensible cluster. They have four queries and the pillar is reaching. The pipeline flags clusters with fewer than 12 distinct spokes. Sometimes a thin cluster is honest. Sometimes the seed needs to be broader.

**SERP analysis sees yesterday's SERP.** Search results move. By the time the cluster ships, the SERP may have shifted. Differentiation hooks should be sturdy enough to survive minor SERP movement. First-party data survives, "we have a slightly newer article" does not.

**The model invents search volumes.** Some models fill in plausible-looking volumes if the data is missing. Always feed actual data and never let the model estimate. If volume data is missing, pause and request it rather than generate around it.

**Cluster cannibalisation.** Two spokes serving the same intent with different long-tail queries will compete in the SERP and dilute each other. The clustering step should detect this. Sibling spokes with 70% or more intent overlap get merged into one page with section anchors.

**Helpful Content Update vulnerability.** Pages built primarily from generated content with no first-party data, expert input or original reporting are at material risk in the next algo cycle. The differentiation-hooks phase exists to gate against this. If a spoke cannot articulate why it deserves to be indexed beyond what is already in the SERP, it does not ship.

**Pillar-spoke length mismatch.** Pillars work when they are meaningfully more comprehensive than spokes. Plan the pillar at 3,000 to 5,000 words and spokes at 800 to 1,500. If those numbers are flipped, the pillar is misnamed.

## The pattern in practice

Illustrative scenarios that show common shapes a cluster build takes. Specifics are illustrative and the patterns repeat.

**B2B SaaS, growth-stage, the cluster-around-a-strong-seed.** A brand publishing a handful of posts a month with no cluster strategy. Running the pipeline on a strong seed produces a pillar plus 20 or more spokes. Rebuilding the content backlog around the cluster typically lands the pillar in the top results for its seed within two quarters and a meaningful share of spokes in their top results. Organic traffic to the topic multiplies several-fold.

**D2C, scale-stage, the niche claim.** A brand trying to claim a niche category. The pipeline runs on a moderate-volume seed and surfaces a coherent cluster. Differentiation hooks come from the brand's own customer-survey data, something competitors do not have. The cluster ships in a couple of months and drives a substantial fraction of new-customer organic acquisition within two quarters. Original data per page is the unlock.

**Publishing, the Helpful-Content-Update failure.** A common failure mode is a brand executing a strong cluster with a heavy LLM-drafting workflow that does not include original data or expert review. Pages rank initially, then drop in the next Helpful Content Update. This is why the pipeline hard-flags any spoke whose hook depends on synthesis alone with no first-party input.

## Hand-off

The cluster artefacts feed:
- **eval-gated-drafting**, the briefs feed the drafting pipeline page by page
- **training-content-engine** if the cluster overlaps with the brand's training content programme
- **seo-cluster-generator** itself, re-run quarterly on the orphans list to find the next cluster
- **earned-media-pitch-generator**, original-data hooks often become pitchable story angles
