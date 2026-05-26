---
name: category-entry-points
description: "When the user wants to research category entry points (CEPs), find buying-trigger moments, run an Ehrenberg-Bass style CEP study, identify mental availability cues, or map which moments the brand owns vs which competitors own. Also triggers on 'why don't people think of us', 'we need to be remembered at the right moment', 'find the buying triggers', or 'map our category entry points'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/demand/category-entry-points
---

# Category entry points (CEP) research

You run a working-team version of an Ehrenberg-Bass CEP study. Three days of structured discovery, four parallel streams, converging into a ranked CEP list with brand coverage scores.

A CEP is a buying moment, not a person. "Mums" is not a CEP. "Sunday-night meal-prep panic" is. If the user keeps proposing audience segments, retrain them with examples before proceeding.

## Inputs to gather first

1. **Brand** name and category
2. **Three named competitors**
3. **Search query data** — GSC export (90 days), top 500 queries; Ahrefs / SimilarWeb data for competitor query patterns
4. **Review-platform URL** plus the brand's most-active forum or subreddit
5. **8–12 short interviews** with recent buyers (within 90 days) — semi-structured CEP question set: "When was the last time you needed something like this? What were you doing? Who were you with? What was the trigger?"
6. **Brand context** — from `.lens/positioning-brief.md` if it exists

If interviews aren't available, the pipeline still runs on the three other streams, but flag the result as lower-confidence — interviews carry the most signal.

## The pipeline (four parallel streams + convergence)

### Stream A — Search query mining

Pull the brand's top 500 organic queries (filter for the target locale, language, min volume 50 monthly). Strip brand-name queries (those are recall after the fact, not CEPs).

Cluster remaining queries by intent. Clusters containing context-noun-phrases ("for marathon training", "for a small office", "when remote-working") are CEP candidates.

Repeat with competitor query data — these are CEPs the brand may not currently cover.

### Stream B — Review and forum mining

For the review corpus + the most-upvoted threads in 3–5 category-relevant forums, run the trigger-moment extraction:

```text
SYSTEM: You are a category researcher mining buyer triggers. You extract
ONLY moments the buyer themselves describes. You do not infer triggers.
You return verbatim phrases wherever possible.

USER:
Source type: {review|forum|interview}
Text:
"""
{TEXT}
"""

Return JSON array, one element per distinct trigger:

[
  {
    "verbatim": "<exact phrase or sentence describing the trigger>",
    "context_signals": {
      "when": "<time, season, life stage, situation>",
      "who_with": "<alone, with partner, with team, etc>",
      "what_they_were_doing": "<activity preceding the trigger>",
      "emotional_state": "<frustration|excitement|obligation|curiosity|other-explicit>"
    },
    "category_relevance": <0-10>,
    "uniqueness": <0-10>  // specific vs generic
  }
]

Rules:
- Verbatim only for `verbatim`. Paraphrase only in context_signals.
- `null` for unaddressed fields. Do not invent.
- If no trigger described, return [].
```

### Stream C — Interview synthesis

Run the same extraction prompt on interview transcripts. Consistency across streams is the point.

### Stream D — Competitive coverage

For each CEP candidate, sample each competitor's content, ads and social. Score 0–5 per competitor per CEP on signal of coverage.

### Convergence — Ranked CEP list

Cross-reference. A CEP surfacing in 3 of 4 streams is a strong candidate. Score on:

- **Market size** (how often the trigger fires) — 0–10
- **Brand fit** (how naturally the brand can claim it) — 0–10
- **Competitive headroom** (is anyone owning it) — 0–10
- **Proof-point readiness** (does the brand already have the assets to claim it) — 0–10

Rank by composite score.

Cluster the verbatim triggers using semantic similarity. **Do not full-automate the cluster labelling** — a 90-minute human pass on the clusters produces a meaningfully better CEP list than any fully-automated version we've tested.

## Output

CEP map document:

1. **Top 10 ranked CEPs** with one-sentence definitions and composite scores
2. **Coverage map** — for each CEP, brand's current coverage vs competitors'
3. **Priority CEPs** — top 3–5 where brand has fit + headroom + proof, ready to build against
4. **Content backlog** — for each priority CEP, what assets need to exist (page, ad, social, lifecycle touchpoint) for the brand to credibly claim it

Save to `.lens/cep-map.md`.

## Evals

Self-check before delivery:

- **Trigger fidelity** — verify 30 verbatim quotes are in the source corpus (≥95% accurate)
- **Cross-stream convergence** — ≥60% of final candidates surface in at least 2 streams
- **Brand-fit calibration** — top 10 ranked CEPs rated by brand team; correlation with pipeline score >0.7

## Failure modes to watch

- **Generic triggers swallow the list** — "when I needed something" is technically a trigger and is useless. Set a uniqueness floor (>3/10) and category-relevance floor (>5/10) when filtering.
- **Brand confuses CEPs with audience segments** — push back hard. CEPs are moments, not people.
- **Search data biases to existing customers** — GSC tells you what found this brand; not what found competitors who you don't know are competing. Always include competitor query data.
- **Reddit / forum mining over-indexes power users** — balance with longer-tail threads, especially "first time" or "advice" titles.
- **Eight interviews aren't enough for broad categories** — if the category is wide (B2B multi-stakeholder), expect 16–20 interviews.

## Hand-off

Priority CEPs feed:
- **seo-cluster-generator** — for content cluster planning against the CEPs
- **lifecycle-journey-builder** — for trigger-based journey entry conditions
- **earned-media-pitch** — for story angles that connect brand to CEPs
- **message-house** — for new pillars built around CEPs the brand isn't yet claiming
