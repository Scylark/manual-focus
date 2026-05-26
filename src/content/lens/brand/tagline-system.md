---
title: "Tagline system, generate, eval, A/B"
stack: brand
description: "Generate 200 tagline candidates, filter to 15 by rule, A/B test to pick a winner against a real metric. The whole sprint runs in three working days."
outputs: "Tagline shortlist, A/B test design, alternative slot fills, retirement rules"
readMin: 20
shipTime: "3 working days"
brandStage: ["launch", "growth", "scale"]
channels: ["brand"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-06-23
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **shortlist of eight to fifteen tagline candidates**, each with rationale, the strategy that produced it and the trademark first-pass result.
2. An **A/B test design**, channel, metric, sample size, runtime, minimum detectable lift, decision rule, plus a downgraded "show ten customers, watch the reaction" version when proper testing is not available.
3. An **alternative-slot fills sheet**, the second-best line per channel use case (sub-headline, ad campaign theme, email signature), so the runners-up earn their keep.
4. A **retirement rule**, the trigger conditions for replacing the tagline (engagement drop, position drift, layout starvation), so the brand catches a dying tagline before the audience does.

## Who this is for

A launch or growth-stage brand picking a tagline for the first time, or a scale-stage brand whose existing tagline has outlived its usefulness. The brand has a sharp positioning brief (one-sentence position, three to five proof points), a voice profile from the brand-voice-extraction playbook, and someone empowered to make a single decision after the A/B test rather than retroactively re-debating. If the brand has no positioning yet, run the positioning-audit-pipeline first. A tagline cannot save a vague position.

## Before you start

- [ ] A completed positioning brief (one-sentence position, proof points, audience, what-not-this)
- [ ] A voice profile from the brand-voice-extraction playbook
- [ ] A message house if you have one, the pillar claims constrain tagline jobs
- [ ] Trademark first-pass access (USPTO TESS, EUIPO, your local office)
- [ ] A channel where you can A/B test, paid social is the most common, paid search is faster but lower-signal
- [ ] An empowered single decision-maker (founder, head of brand, fractional CMO) who will commit to the test winner
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode

If you cannot run a real A/B test, the playbook downgrades gracefully to a "show ten customer-facing people, watch the reaction" pattern. The downgrade is acknowledged as weaker signal but better than committee voting.

## The pipeline

Four phases. Three working days end-to-end. Day one is generation and filtering, day two is the shortlist review and test set-up, day three plus the test runtime is the A/B.

### Phase 1, strategy intake

A single decision before generation. What does the tagline need to do?

**Step 1.1, pick the primary job.**

A tagline can anchor positioning, signal category, reduce friction, claim a virtue, evoke a feeling. Pick one primary job, optionally one secondary. Taglines that try to do four jobs end up doing none.

| Job | What it sounds like | When to pick it |
|---|---|---|
| Anchor positioning | "Kit that survives the season." | Position is the brand's main differentiator |
| Signal category | "For the long Sunday." | Brand is in a niche the audience does not immediately recognise |
| Reduce friction | "No-fuss returns, always." | Brand has a known buying objection that blocks conversion |
| Claim a virtue | "Made by people who ride." | Trust is the gap to close |
| Evoke a feeling | "The honest miles." | Brand competes on emotional resonance over feature comparison |

**Step 1.2, fill the strategy brief.**

| Field | Your input |
|---|---|
| Primary job | (pick one from above) |
| Secondary job (optional) | (pick one or leave blank) |
| Positioning sentence | (paste from positioning brief) |
| Voice profile summary | (paste 2 to 3 sentences from voice-extraction) |
| Banned words | (paste from voice extraction's "never does" list) |
| Length range | (e.g. 3 to 7 words for a hero tagline, 5 to 9 for a sub-headline) |
| Channels it must work on | (e.g. homepage, paid social, email subject prefix) |
| Three competitors' current taglines | (verbatim, for distinctiveness check) |

**You should now have** a one-page strategy brief saved as `tagline-brief.md`.

### Phase 2, generation

Six strategies in parallel. Each produces 30 to 40 candidates. Around 200 total.

**Step 2.1, run the six strategies.**

The six strategies are declarative claim, command, double-meaning, contradiction-frame, verb-phrase, single-noun. Run each in parallel chats or batched calls. Below is the declarative-claim prompt as the example.

```text
SYSTEM: You generate tagline candidates in the declarative-claim
strategy. A declarative-claim tagline asserts something the brand is
or does. It sits comfortably under a brand mark on a homepage hero.
You produce candidates that match the brand's voice profile and
advance the primary job named in the brief.

USER:
Brief: {TAGLINE_BRIEF}
Voice profile (short): {VOICE_PROFILE_SHORT}
Banned words: {BANNED_WORDS_LIST}
Length range: {LENGTH_RANGE}
Competitor taglines (DO NOT echo): {COMPETITOR_TAGLINES}

Produce 35 declarative-claim tagline candidates. For each, return:

{
  "tagline": "<verbatim>",
  "word_count": <number>,
  "primary_job_advanced": "<which job from the brief this advances>",
  "rationale": "<one sentence>",
  "echoes_competitor": <true | false>,
  "uses_banned_word": <true | false>
}

Rules:
- 35 candidates exactly.
- Stay inside the length range.
- No banned words.
- No echoes of competitor taglines.
- Match the voice profile (no em dashes, no exclamation marks, no
  semicolons in the tagline itself).
- "rationale" must reference the brief, not be a generic praise note.
- Number each candidate ("Candidate 1 of 35, ...").
```

**Step 2.2, the other five strategies.**

Command, taglines that direct the reader to do something ("Run the long Sunday"). Double-meaning, taglines with a deliberate second reading ("The miles that count"). Contradiction-frame, taglines that name a tension and resolve it ("Heavier. On purpose."). Verb-phrase, action-led taglines that frame the brand's behaviour ("Built to outlast the season"). Single-noun, taglines that lean on one noun and let the brand mark do the rest ("Mile four.").

Save all six outputs into a CSV, `taglines-raw.csv`, with columns Tagline, Strategy, Word_count, Job_advanced, Rationale.

**You should now have** roughly 200 candidates in a single CSV.

### Phase 3, filtering

Six filters applied sequentially. Most candidates die here.

**Step 3.1, trademark first-pass.**

Same approach as the naming-sprint playbook. Hit USPTO, EUIPO, your local office for exact matches in the relevant Nice classes (typically 25, 35 for an endurance apparel brand). Blocks for exact same-class matches. Flags for near matches.

Roughly 10 to 30% of candidates get blocked here. Taglines are smaller phrases, so exact-match registration rates are lower than for brand names, but it still happens.

**Step 3.2, run the multi-filter prompt.**

```text
SYSTEM: You score tagline candidates against five filters,
memorability and phonetic ease, category distinctiveness, fit to the
positioning brief, voice profile match, and length-and-cadence
suitability for the named channels. You return a JSON score per
filter plus a verdict.

USER:
Candidates (trademark-cleared CSV):
{TAGLINES_CLEARED_CSV}
Positioning sentence: {POSITIONING}
Voice profile: {VOICE_PROFILE_SHORT}
Channels: {CHANNELS}
Competitor taglines: {COMPETITOR_TAGLINES}

For each candidate, return JSON shaped like:

{
  "tagline": "<verbatim>",
  "memorability": <0-10>,
  "phonetic_ease": <0-10>,
  "category_distinctiveness": <0-10>,
  "positioning_fit": <0-10>,
  "voice_match": <0-10>,
  "channel_suitability": {
    "homepage_hero": <0-10>,
    "paid_social": <0-10>,
    "email_subject": <0-10>
  },
  "composite": <0-10>,
  "verdict": "<shortlist | reserve | drop>"
}

Composite weights: 25% positioning_fit, 20% category_distinctiveness,
20% voice_match, 15% memorability, 10% phonetic_ease,
10% channel_suitability_mean.

Verdict rules:
- "shortlist" if composite >= 7 AND no filter scores under 4.
- "reserve" if composite >= 6 AND no filter scores under 3.
- "drop" otherwise.
```

**Step 3.3, hand-review the shortlist.**

The pipeline should return roughly 12 to 20 candidates in `shortlist` and another 15 to 25 in `reserve`. The named decision-maker reads the shortlist, cuts to 8 to 15 finalists by gut on top of the rubric scoring. The cut here is allowed to be subjective, the team picks which finalists feel like the brand. The A/B test then picks the winner.

**You should now have** 8 to 15 finalists ready for the A/B test design.

### Phase 4, A/B test design

A real test against a real metric beats committee voting every time.

**Step 4.1, run the test-design prompt.**

```text
SYSTEM: You design an A/B test for a tagline shortlist. You select
the right channel, the right metric, the right runtime and the right
decision rule. You produce a downgraded "show 10 customers" version
when proper testing is not feasible.

USER:
Shortlist: {SHORTLIST_OF_8_TO_15}
Available test channels: {AVAILABLE_CHANNELS}
Monthly traffic on the test channel: {TRAFFIC_VOLUME}
Current conversion rate: {CURRENT_CONV_RATE}
Budget for the test: {TEST_BUDGET}

Return JSON shaped like:

{
  "feasibility": "<full_ab | downgraded_qual>",
  "test_design": {
    "channel": "<name>",
    "primary_metric": "<CTR | landing_page_bounce | email_open
      | branded_search_lift>",
    "secondary_metric": "<name>",
    "sample_size_per_variant": <int>,
    "runtime_days": <int>,
    "minimum_detectable_lift": "<percentage>",
    "decision_rule": "<one sentence>",
    "kill_criteria": "<conditions to stop the test early>"
  },
  "downgraded_design": {
    "method": "show 10 customer-facing people",
    "questions": ["<3 questions to ask each reader>"],
    "decision_rule": "<one sentence>"
  }
}

Rules:
- Minimum detectable lift caps at 20%. Taglines rarely move metrics
  more.
- Sample size derived from statistical power calculation at 80%
  power, 5% significance, given the current conv rate.
- If sample size requires more than 8 weeks runtime, return
  downgraded_qual as the primary feasibility.
- "kill_criteria" must include a stop condition.
```

**Step 4.2, run the test.**

Build the ad variants or landing page variants for each shortlisted tagline. Run for the prescribed runtime. Do not peek before the test reaches statistical power. The temptation is real, the cost of peeking is a false-positive winner.

**Step 4.3, the qualitative fallback.**

If the test is downgraded, do the qualitative properly. Pick ten customer-facing people, not ten internal stakeholders. Show each the top eight taglines (names of the brand revealed). Ask three questions, "what does this tagline make you think the brand is for," "would you trust this brand if you saw this tagline," "which of these eight is most memorable after you look away for thirty seconds." Aggregate the answers. The decision is based on convergence across the ten, not on internal opinion.

**Step 4.4, write the retirement rule.**

A tagline that wins today does not win forever. Write the retirement triggers into the document the winning tagline ships in.

```text
RETIREMENT TRIGGERS FOR {WINNING_TAGLINE}

The tagline gets reviewed for retirement if any of these trigger:
- Engagement on the channel it was tested on drops by >20% versus
  the test-period baseline, sustained over 8 weeks.
- The brand's positioning audit (run annually) shows the tagline no
  longer advances the defensible position.
- Brand surfaces (ad creative, sales decks, social posts) have been
  quietly dropping the tagline from layouts for 60+ days.
- A new competitor adopts a confusingly similar tagline.

If any trigger fires, the tagline pipeline re-runs against the
current positioning brief.
```

**You should now have** a winning tagline, a documented test result, a runner-up assigned to the alternative-slot sheet, and a retirement rule pinned alongside.

## Worked example, end-to-end

Cascadia Endurance. The brand has been running "Built to outlast" for three years. The positioning audit (worked example in the positioning-audit-pipeline playbook) sharpened the position to "trail-running kit that survives the season for recreational and mid-pack racers." The tagline needs to advance the sharpened position.

**Phase 1 output.** Primary job, anchor the new positioning. Secondary job, signal the recreational-and-mid-pack audience without naming them explicitly. Length range 3 to 7 words. Channels, homepage, paid social, email subject prefix.

**Phase 2 output.** 206 candidates across six strategies. Sample:

| Tagline | Strategy | Word count |
|---|---|---|
| Built for the second loop. | declarative-claim | 5 |
| Kit that survives the season. | declarative-claim | 5 |
| The honest miles. | single-noun | 3 |
| Heavier. On purpose. | contradiction-frame | 3 |
| For the long Sunday. | verb-phrase | 4 |
| Outlast the launch shoot. | command | 4 |
| Run the back half. | command | 4 |
| Mile four onwards. | single-noun | 3 |

**Phase 3 output.** Trademark first-pass blocks 11 candidates with exact same-class matches. The multi-filter prompt returns 18 in shortlist, 22 in reserve. The marketing lead cuts the shortlist to 10 finalists by gut. Two finalists feel adjacent to competitor taglines and get dropped before the test.

**Phase 4 output.** Test design is feasible at full A/B. Channel is paid social on Meta. Primary metric is CTR on cold-audience prospecting. Sample size 8,500 per variant. Runtime 14 days. Minimum detectable lift 15%.

The test runs with eight variants, each replacing the homepage hero copy in the destination landing page and the ad headline. Day fourteen, results in.

| Variant | CTR | Conv rate (landing) | Composite |
|---|---|---|---|
| Built for the second loop. | 2.41% | 4.1% | top |
| Kit that survives the season. | 2.28% | 4.0% | 2nd |
| Heavier. On purpose. | 2.18% | 3.7% | 3rd |
| The honest miles. | 1.94% | 4.3% | mixed |
| For the long Sunday. | 1.87% | 3.9% | 4th |
| Outlast the launch shoot. | 1.71% | 3.5% | dropped |
| Mile four onwards. | 1.55% | 3.4% | dropped |
| Run the back half. | 1.49% | 3.6% | dropped |

The winner is "Built for the second loop." The runner-up "Kit that survives the season" goes to the alternative-slot sheet as the sub-headline.

Retirement rule pinned. The CTR baseline (2.41% on cold prospecting) is the watch number, sustained drop below 1.90% over 8 weeks triggers a review.

The brand ships the new tagline within two weeks of the test closing. The homepage hero gets updated, the email subject prefix changes, the brand LinkedIn header copy changes. Six months in, the tagline holds CTR within the test-period range and shows up consistently in customer survey unaided-recall scores. The retirement triggers do not fire in the first review window.

## Try it yourself

Three exercises, each takes 20 to 40 minutes.

### Exercise 1, run Phase 2 declarative strategy

Use your positioning sentence and voice profile to run the declarative-claim prompt for 35 candidates. Read the output. Are any of them ones you would not have produced manually? If yes, the strategy is doing real work. If every candidate reads like something you would have written in a brainstorm, the brief is too narrow, broaden the connotation set.

### Exercise 2, run the multi-filter on your existing tagline

Take your current tagline. Run it through the Phase 3 filter prompt as a single-candidate input. What composite score does it get? If it scores below 6, the tagline is underperforming on the rubric. That does not mean replace immediately, but it should be on the watch list.

### Exercise 3, design a downgraded qualitative test

If you cannot run a paid A/B, write the downgraded test for your top three taglines. Pick the ten people you would show (not internal). Write the three questions. Send the test pack to a colleague. The exercise of writing the qual test surfaces whether your taglines are differentiated enough to be discussable, two taglines that produce the same answers in qual are functionally the same tagline.

## The eval gates

**Eval 1, generation diversity.** Six strategies, 200 candidates. If 80% of shortlist survivors come from one strategy, the brief is biasing toward a single shape, broaden the intake.

**Eval 2, trademark headroom.** Every shortlist candidate gets a first-pass trademark check. Same rules as the naming-sprint playbook. First-pass only, no substitute for an attorney for the final pick.

**Eval 3, positioning fidelity.** Each shortlist candidate is scored on whether it advances the positioning brief. A tagline that sounds great but does not move the brand's strategic ground is a poster, not a tagline.

**Eval 4, A/B test integrity.** No peeking before the test reaches statistical power. No retroactive variant addition. The decision rule is set before the test runs and is honoured when it runs. Hybrid voting after the data comes in is the failure mode this eval blocks.

## The failure modes

**The "safe" candidate wins by default.** Committee voting reliably picks the lowest-friction option, which is usually the least distinctive. Either commit to an A/B test, or pre-commit that one named decision-maker picks and then defends the choice. Hybrid voting is worst-case.

**Taglines outlive their relevance.** A tagline that fit when the brand was niche may not fit at scale. The retirement rule is the discipline. Quarterly check, is the tagline still pulling weight, are brand surfaces quietly dropping it from layouts. If yes, plan the replacement.

**Two-job taglines.** "Faster, smarter, kinder marketing" is a list rather than a tagline. Limit the brief to one primary job. If you cannot pick which job matters most, the positioning is not ready and the tagline pipeline will just expose that.

**Found in translation, lost in another.** A tagline that works in the brand's primary market may have no resonance (or bad resonance) in a secondary market. If multi-market launch is planned, run the pipeline in each language with native-speaker filtering. Do not translate, recompose.

**The peeking failure.** Teams running their own A/B tests sometimes check results at day three or four, see one variant ahead, and call the test. The early variant is rarely the final winner once the sample reaches power. Set the kill criteria before the test starts and honour them.

## The pattern in practice

Illustrative scenarios that show common shapes a tagline sprint takes. Specifics are illustrative, patterns repeat.

**Wellness brand, growth-stage, the audit-to-tagline flip.** A brand running an existing tagline for years that does not match what its customers thank it for. A positioning audit surfaces the gap. The tagline sprint produces a shortlist anchored in customer language. Three finalists A/B-test on paid social. The winner, typically the one closest to verbatim customer language, lifts CTR materially and holds the lift over the following season.

**B2B SaaS, scale-stage, the genericness check.** A brand about to ship a "Marketing, Reimagined"-shaped tagline as a rebrand cornerstone. The sprint flags it as generic, several other SaaS brands have used similar phrasing in recent years. The shortlist surfaces something with the same root insight but a structure no other brand is using. The differentiation is what makes the tagline durable.

**Endurance apparel, scale-stage, the retirement-rule rescue.** A brand running a tagline that has been quietly disappearing from new ad creative for six months without anyone formally retiring it. The retirement rule catches it during the annual review, the pipeline re-runs against the current positioning brief, the new tagline lands. Brand surfaces stop looking inconsistent because the tagline now matches what the layouts actually want to say.

## Hand-off

The tagline winner feeds:
- **brand surfaces**, homepage hero, ad creative, email signatures, partnership decks
- **message-house-generator**, the tagline is the narrative-sentence's public-facing distillation, the message house should reflect alignment
- **paid-search-bidding-agent**, brand-search ad headlines test the tagline against generic alternatives
- **annual brand review**, the retirement rule triggers a re-run when the data calls for it
