---
title: "Category Entry Point research and prioritisation"
stack: demand
description: "Surface and rank the buying triggers that drive recall in your category, then map your brand's coverage. Ehrenberg-Bass framework in three days, four discovery streams."
outputs: "Ranked CEP list, brand coverage map, prioritised content backlog, refresh cadence"
readMin: 22
shipTime: "3 working days"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content", "seo"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-05-12
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts:

1. A **ranked Category Entry Point list** of 15 to 30 candidate triggers scored on market size, brand fit, competitive headroom and proof-point readiness, sourced from search, reviews, forum threads and a small set of interviews.
2. A **brand coverage map** showing where the brand already has assets against each CEP, where competitors are owning the moment, and where there is open ground.
3. A **prioritised content backlog** of the top six CEPs translated into briefs the content team can execute against, each with the trigger language verbatim, the audience moment, and the proof points the brand can lean on.
4. A **quarterly refresh cadence** that re-runs the search and review streams against the same prompts so the CEP list stays current rather than becoming a one-time report.

## Who this is for

A growth or scale-stage brand that already knows its category and audience, with a marketing lead willing to do eight to twelve customer interviews in a week, and a content team that can act on a ranked backlog. If the brand cannot articulate its category in a sentence or has fewer than 100 reviews and no organic search data, this playbook will produce a thin output. Run the message-house-generator and build the review corpus first.

## Before you start

- [ ] Google Search Console access at Owner or Full level on the brand's property, last 90 days of data available
- [ ] SimilarWeb, Ahrefs or Semrush access with competitor query data for at least three named competitors
- [ ] The brand's full review corpus from Trustpilot, Google Reviews or the brand's own review platform, exported as CSV
- [ ] List of three to five category-relevant subreddits and forums, plus an account that can read full thread histories
- [ ] Eight to twelve recent buyers (purchased in the last 90 days) willing to take a 30-minute call
- [ ] A semi-structured interview script, the brand's positioning brief, and the named competitors list
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode
- [ ] A spreadsheet or Notion database to hold the converged CEP list

Eight interviews is the minimum that gives signal beyond the search and review streams. Below that the qualitative voice gets thin.

## The pipeline

Five phases. Four parallel discovery streams run on day one and two. Convergence and scoring on day three.

### Phase 1, search query mining (Stream A)

The brand's organic queries reveal where buyers are already finding the brand. Competitor queries reveal the demand the brand is not yet capturing.

**Step 1.1, export GSC queries.**

1. Open Google Search Console. Pick the brand's property.
2. In the left sidebar click **Performance**, then **Search results**.
3. Set the date range to **Last 90 days** (top right).
4. Below the chart, set the dimension to **Queries**.
5. Click the export icon (top right of the table) and choose **Download CSV**. Take the top 500 queries by clicks.
6. Strip every query containing the brand name. CEPs are trigger moments, not brand recall.

**Step 1.2, pull competitor queries.**

In Ahrefs go to **Site Explorer**, paste the competitor domain, then **Organic keywords**. Export the top 200 by traffic. Repeat for each of three named competitors.

In SimilarWeb, the equivalent path is **Website Analysis**, then **Marketing channels**, then **Organic search**.

**Step 1.3, cluster the queries by intent.**

```text
SYSTEM: You cluster search queries by buyer intent. You separate
brand-recall queries from category-research queries and you flag the
clusters that contain context-noun-phrases ("for marathon training",
"when remote-working", "as a beginner"). The context-noun-phrase
clusters are Category Entry Point candidates.

USER:
Source: {brand_gsc | competitor_ahrefs}
Queries CSV:
{PASTE_QUERIES}

Return JSON:

{
  "clusters": [
    {
      "cluster_label": "<short label>",
      "intent_type": "<brand_recall | category_research | comparison | context_trigger>",
      "context_noun_phrase": "<verbatim if present, null otherwise>",
      "sample_queries": ["<top 3 verbatim queries>"],
      "query_count": <integer>,
      "cep_candidate": <true | false>
    }
  ]
}

Rules:
- "cep_candidate" is true only if intent_type is "context_trigger" or
  if the cluster contains a context_noun_phrase.
- Verbatim sample queries only. Do not paraphrase.
- Return between 15 and 30 clusters.
```

You should now have a clustered query map flagging CEP candidates from search.

### Phase 2, review and forum mining (Stream B)

Buyers describe their triggering moments in reviews and on forums in language they would never use in an interview.

**Step 2.1, prepare the corpus.**

Export the brand's reviews to CSV. Scrape the most-upvoted threads from the three to five subreddits and forums in your inputs list. Reddit's old.reddit.com interface gives a cleaner copy-paste. Aim for 100 to 300 reviews and 30 to 60 forum threads.

**Step 2.2, run the trigger-moment extraction prompt.**

This is the load-bearing prompt of the playbook. Same prompt runs against reviews, forum threads and interview transcripts in Phase 3, so the outputs converge cleanly.

```text
SYSTEM: You are a category researcher mining buyer triggers. You
extract only moments the buyer themselves describes. You do not infer
triggers. You return verbatim phrases wherever possible. If a buyer
describes multiple distinct triggers in one piece of text, you return
them separately.

USER:
Source type: {review | forum | interview}
Text:
"""
{PASTE_TEXT}
"""

Return a JSON array. Each element represents one distinct trigger
moment:

[
  {
    "verbatim": "<the exact phrase or sentence describing the trigger>",
    "context_signals": {
      "when": "<time, season, life stage, situation>",
      "who_with": "<alone, with partner, with team, etc>",
      "what_they_were_doing": "<the activity preceding the trigger>",
      "emotional_state": "<frustration | excitement | obligation | curiosity | other-explicit>"
    },
    "category_relevance": <0-10>,
    "uniqueness": <0-10>
  }
]

Rules:
- Verbatim only for verbatim field. Paraphrase only in context_signals.
- null for fields the source does not address. Do not invent.
- If the source describes no trigger, return [].
- Do not deduplicate across calls, convergence handles that.
- Uniqueness 0 means generic, 10 means highly specific.
```

**Step 2.3, batch the corpus through the prompt.**

Run the prompt in chunks of around 5,000 tokens of source text at a time. Collect every extraction into one CSV with columns verbatim, source, when, who_with, what_doing, emotion, category_relevance, uniqueness.

You should now have a CSV of trigger moments from reviews and forums, typically 150 to 400 rows.

### Phase 3, interview synthesis (Stream C)

Eight to twelve calls cut closer to the brand's actual buyers than the open forum corpus.

**Step 3.1, run the interviews.**

The standard CEP question set is "When was the last time you needed something like this? What were you doing? Who were you with? What was the trigger?" Follow up on emotion. Avoid leading questions about the brand. Record and transcribe (Otter, Granola, Fathom).

**Step 3.2, run the same extraction prompt against transcripts.**

Use the same prompt as Phase 2 with source type "interview". Run it against the transcript of each call separately so the model attributes triggers per-buyer.

You should now have a CSV of trigger moments from interviews, typically 30 to 80 rows.

### Phase 4, competitive coverage (Stream D)

For each CEP candidate so far, where is the competitor speaking to it?

**Step 4.1, sample competitor content.**

For each named competitor, pull the most recent 20 pieces of content from their blog, the most recent 20 social posts, and the headlines from their last 10 paid ads (via Meta Ad Library, set country to UK and search the brand).

**Step 4.2, score competitor coverage per CEP.**

```text
SYSTEM: You score competitor coverage of Category Entry Points. For
each CEP candidate, you sample the competitor's content and rate
their coverage 0 to 5 (0 means no coverage, 5 means the CEP is a
core narrative thread). You cite the asset that drove the score.

USER:
CEP candidates (clustered triggers): {CEP_CANDIDATES_JSON}
Competitor: {COMPETITOR_NAME}
Competitor content sample: {PASTE_BLOG_HEADLINES_AND_SOCIAL_POSTS}

Return JSON:

[
  {
    "cep": "<verbatim trigger or cluster label>",
    "coverage_score": <0-5>,
    "evidence": "<the specific asset that drove the score>",
    "coverage_notes": "<one sentence on how they frame it>"
  }
]

Rules:
- Score 0 if no evidence of coverage in the sample.
- Evidence must be a real asset from the sample, not generic.
- "coverage_notes" reads like a tactical observation, not marketing.
```

You should now have a competitor coverage matrix per CEP per named competitor.

### Phase 5, convergence and scoring

The four streams meet here. A CEP that surfaces in three of four streams is a strong candidate. One that appears in only one stream is noise.

**Step 5.1, semantic clustering and human pass.**

```text
SYSTEM: You converge trigger moments from four parallel streams into
a single ranked Category Entry Point list. You cluster semantically
similar triggers, count how many streams produced each cluster, and
return the top 30 candidates with their evidence.

USER:
Stream A (search clusters): {STREAM_A_JSON}
Stream B (review and forum triggers): {STREAM_B_CSV}
Stream C (interview triggers): {STREAM_C_CSV}
Stream D (competitor coverage): {STREAM_D_JSON}

Return JSON:

{
  "cep_candidates": [
    {
      "cep_label": "<short canonical label>",
      "verbatim_examples": ["<2-3 buyer-language phrases>"],
      "streams_present_in": ["A | B | C | D"],
      "context_when": "<convergence of the when signals>",
      "context_emotion": "<dominant emotional state>",
      "competitor_coverage": {"competitor_1": <0-5>, "competitor_2": <0-5>},
      "market_size_signal": "<query volume or thread count indicator>",
      "uniqueness_mean": <0-10>,
      "rank": <integer>
    }
  ]
}

Rules:
- 15 to 30 candidates.
- Drop candidates with uniqueness mean below 3.
- Drop candidates with category_relevance mean below 5.
- "cep_label" is buyer language, not brand language. "Sunday-night
  meal-prep panic" not "weeknight planning solutions".
```

Now run a 90-minute human pass. The model's cluster labels will be too tidy. Open the JSON in a spreadsheet and rewrite the labels in the buyer's actual voice. This step matters more than any automated refinement.

**Step 5.2, score each CEP on the four dimensions.**

```text
SYSTEM: You score each Category Entry Point on four dimensions,
market size, brand fit, competitive headroom and proof-point
readiness. You return scores 0 to 10 and a single sentence of
evidence per dimension.

USER:
CEP: {CEP_LABEL}
Brand positioning brief: {POSITIONING_BRIEF}
Brand proof points: {PROOF_POINTS}
Competitor coverage: {COVERAGE_SCORES}
Market size signal: {MARKET_SIZE_SIGNAL}

Return JSON:

{
  "cep": "<label>",
  "market_size": <0-10>,
  "brand_fit": <0-10>,
  "competitive_headroom": <0-10>,
  "proof_point_readiness": <0-10>,
  "composite": <weighted average, 0-10>,
  "evidence": {
    "market_size": "<one sentence>",
    "brand_fit": "<one sentence>",
    "competitive_headroom": "<one sentence>",
    "proof_point_readiness": "<one sentence>"
  }
}

Rules:
- Composite is 30% market_size + 25% brand_fit + 25% competitive_headroom
  + 20% proof_point_readiness.
- Score 0 to 10. Round to one decimal place.
- Evidence must be specific, not generic.
```

**Step 5.3, build the content backlog.**

Take the top six CEPs by composite. For each, draft a content brief covering the verbatim trigger language, the audience moment, the proof points the brand will lean on, and the channel mix. Hand off to the content team.

You should now have a ranked CEP list, scored on four dimensions, with a backlog ready for execution.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand, scale-stage, building its content engine for the next year.

**Stream A output.** 312 GSC queries clustered into 21 groups. The "for ultra-distance training" cluster contains 47 queries and is flagged as CEP candidate. The "second-loop kit" cluster (queries about gear that lasts beyond a launch shoot) contains 18 queries. Competitor data from Inov-8, Salomon and La Sportiva adds another 14 candidate clusters, including a "winter trail kit for working week training" cluster that Cascadia has near-zero coverage on.

**Stream B output.** 187 reviews and 41 Reddit threads from r/trailrunning, r/ultrarunning and the UK Fell Runners Forum. 264 trigger moments extracted. The strongest verbatim is "I needed kit I could trust on the second loop because the first one always feels easy." The "second loop" language surfaces 14 times across the corpus.

**Stream C output.** 9 interviews with recent Vahla Range buyers. 38 trigger moments. The "second loop" language surfaces again in 4 of 9 interviews unprompted. A new candidate emerges, "the wet Wednesday training run when the launch shoot kit gives up," which is even more specific than the search data suggested.

**Stream D output.** Competitor coverage scoring across Inov-8, Salomon and La Sportiva. The "second loop" CEP has coverage 1, 0 and 0. The "wet Wednesday" CEP has coverage 0, 0 and 0. Both are open ground.

**Phase 5 output.** Convergence produces 23 candidates. The top six after scoring are:

1. The second loop. Market 8, fit 9, headroom 9, readiness 9. Composite 8.75.
2. Wet Wednesday training. Market 6, fit 9, headroom 10, readiness 8. Composite 8.05.
3. First ultra event prep. Market 9, fit 7, headroom 5, readiness 7. Composite 7.10.
4. Winter base training kit. Market 7, fit 8, headroom 7, readiness 6. Composite 6.95.
5. Coach-recommended kit moment. Market 5, fit 9, headroom 8, readiness 7. Composite 6.95.
6. Race-week taper kit selection. Market 6, fit 7, headroom 8, readiness 6. Composite 6.65.

The "second loop" CEP feeds into the Vahla Range narrative for the next quarter. The "wet Wednesday" CEP becomes a four-piece content series in November and February. Cascadia walks away from "first ultra event prep" because competitor coverage is already saturated and the brand fit is weaker.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, extract triggers from 20 reviews

Pick 20 of your most recent reviews. Run the Phase 2 extraction prompt across them. Read the JSON. Count how many distinct triggers surfaced and how many were genuinely specific (uniqueness above 5). If the count is below 8, the reviews are too generic and the brand needs to ask better post-purchase questions before this pipeline produces useful output.

### Exercise 2, score one CEP candidate

Pick one trigger that appears in both your reviews and your search data. Paste it into the Phase 5 scoring prompt with your positioning brief and proof points. Read the composite score. Now do the same scoring by hand. If your composite is within 1.0 of the model's, the rubric is calibrated. If not, the proof-point list in your inputs is probably missing assets you assumed everyone knew about.

### Exercise 3, draft a content brief from a top CEP

Take the highest-scoring CEP from your ranked list. Ask Claude:

> "Here is a top-scoring CEP, [paste]. Here is the brand's positioning, proof points and voice profile, [paste]. Draft a three-piece content brief covering a long-form blog, an email touchpoint and a social series. Use the buyer's verbatim language in at least one headline."

If the headlines do not use the buyer's language, the brief is reverting to brand voice when it should be using buyer voice. Edit and re-run.

## The eval gates

**Eval 1, trigger fidelity.** Sample 30 extracted triggers from any stream and verify the verbatim quote is in the source. Target 95%. Below 90% means the model is paraphrasing or hallucinating. Regenerate with a stricter system prompt or smaller chunk sizes.

**Eval 2, cross-stream convergence rate.** At least 60% of final candidates should surface in two or more streams. Lower than that and the streams are not talking, usually because Stream A's query clusters and Stream B's trigger language do not share vocabulary. Re-cluster Stream A with the trigger language as the seed.

**Eval 3, brand-fit calibration.** For the top 10 CEPs, the brand team rates fit independently. The pipeline's fit score should correlate above 0.7 with the human rating. Lower means the model does not have enough brand context. Feed the positioning brief and the proof-point list in, then re-score.

**Eval 4, coverage map sanity.** Brand coverage scores should align with what the brand team intuitively believes. Surprises here are interesting, either insight (the team did not realise they do not cover a CEP) or error (the model missed evidence the team has). Triage individually.

**Eval 5, refresh discipline.** The CEP list is re-run quarterly. If a CEP that scored 8 last quarter scores 4 this quarter, either the world changed (a competitor moved) or the inputs changed. Either case is a conversation, not a re-run in silence.

## The failure modes

**Generic triggers swallow the list.** "When I needed something" is technically a trigger. It is also useless. Set the uniqueness floor at 3 and the category-relevance floor at 5, or the CEP list ends up reading like horoscope language.

**The brand confuses CEPs with audience segments.** A CEP is a buying moment, not a person. "Mums" is not a CEP. "Sunday-night meal-prep panic" is. If the team keeps proposing audience segments, run a quick training pass with examples. Most teams have not worked with the model in this mode and slip back to demographic thinking.

**Search data biases to the existing brand customer.** GSC tells you the queries that found this brand. It does not tell you the queries that found competitors you do not know are competing. Always run Stream A with competitor data alongside the brand's own, or the analysis under-represents CEPs the brand has no current coverage on, which is exactly the CEPs you want to find.

**Reddit and forum mining over-indexes power users.** The most-upvoted threads are by definition the ones engaged with by category-curious people, not category-mainstream buyers. Balance with the longer tail of less-engaged threads, especially the ones with "advice" or "first time" in the title, which capture more representative trigger moments.

**Eight interviews are not enough for a broad category.** If the brand's category has fewer than 15 likely CEPs, eight interviews give reasonable coverage. If the category is broader (multi-stakeholder B2B, multiple disciplines in endurance), aim for 16 to 20 interviews. The pipeline scales but does not shortcut discovery time on more complex categories.

## The pattern in practice

Illustrative scenarios that show common shapes CEP research takes. Specifics are illustrative and the patterns repeat.

**Premium endurance-sports brand, Series C, the first-time-event finding.** A brand buying brand-awareness ads in cycling press for years. The research surfaces that most top CEPs relate to first-time-event prep (first century ride, first ultramarathon, first triathlon), where the brand has near-zero content coverage. Reprioritising the content engine toward those moments typically multiplies direct traffic from CEP-aligned queries within a couple of quarters.

**Fintech, B2B mid-market, the trigger over the noun.** The research surfaces that the strongest CEP is the specific moment of "quarter-end and the finance team is doing the close manually" rather than "automation" (the brand's existing framing). Repositioning around the quarter-end trigger across content, ads and lifecycle typically lifts pipeline coverage materially in the segment within a quarter.

**Wellness brand, growth-stage, the capacity gap.** Research produces a strong CEP list but the brand only has capacity to execute on the top two of nine ranked. The top two drive a real lift in qualified traffic and CEPs three through nine sit unexecuted. The pipeline does the analysis, capacity does the work. An unrealistic execution plan against a strong CEP list still leaves most of the value on the table.

## Hand-off

The CEP list feeds:
- **message-house-generator**, the trigger language becomes proof-point and channel-line input
- **race-day-demand-pipeline**, event-anchored CEPs become campaign hooks
- **lifecycle-journey-builder**, behavioural CEPs become signal triggers
- **paid-search-bidding-agent**, query clusters become keyword groups with margin context
