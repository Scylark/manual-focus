---
title: "Evaluation frameworks for marketing AI outputs"
stack: ops
description: "How to score AI-generated marketing work objectively. Rubrics, deterministic checks, model-as-judge patterns, and the discipline to know when each is appropriate."
outputs: "Eval rubric library, scoring scripts, calibration ritual"
readMin: 11
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["analytics", "content", "brand"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-04-28
status: live
preview: false
---

## The brief

The single most-asked question in AI-leveraged marketing teams: "Is this output good?" Without an answer, the team either ships every draft (and the brand suffers), or hand-reviews every draft (and the time saving evaporates). The only stable path is objective evaluation — rubrics that score the output independent of who's looking at it.

This playbook installs an eval discipline. It's not one rubric; it's a library of rubrics, one per output type the team produces (headline, body copy, ad creative, email, social post, deck slide). Each rubric is calibrated against a corpus of known-good and known-bad examples. Each rubric tells you whether to use a deterministic check, an LLM-as-judge, or both. The result: the team can score its own output the way the brand lead would, in under a second per piece.

## The pipeline

Five phases to install per output type.

**Phase 1 — Corpus collection.** Gather 30 examples of the output type. 15 known-good (the brand lead would ship them), 15 known-bad (revisions or rejections). Tag each with the reason — what made it good or bad in the brand lead's actual judgement.

**Phase 2 — Rubric draft.** From the tagging, extract the criteria that the brand lead is actually applying. Most teams discover the lead is using 5-8 criteria, not the 30 in the brand guide. The rubric is built from what gets used, not what's documented.

**Phase 3 — Check-type selection.** For each criterion, decide: deterministic (regex / count / length / structural), LLM judgement (with a prompt and a model pinned), or hybrid (deterministic first, LLM only if deterministic passes). Default to deterministic where possible — they're fast, free, repeatable.

**Phase 4 — Calibration.** Run the draft rubric against the 30-example corpus. Check correlation with the brand lead's tags. Target: >0.8 correlation with the lead's known-good / known-bad split. Below that, the rubric is missing criteria or applying them wrong — adjust.

**Phase 5 — Production install.** Wire the rubric into the team's drafting pipeline (or the brand-guardrails system from that playbook). Pass = promote. Borderline = flag for human. Fail = regenerate with the failing criteria named.

## The four rubric types

**Type A — Deterministic structural.** Counts, lengths, regex. Examples: headline ≤65 chars, no exclamation marks, primary keyword in first 100 words, paragraph max 75 words. Fast, free, no LLM. Pass/fail per criterion, sum to a score.

**Type B — Deterministic stylometric.** Pattern matching against the voice profile. Sentence length distribution, contraction count, transition word usage, opener pattern. From the brand-voice playbook. ~30ms per piece.

**Type C — LLM-as-judge, scored.** A model evaluates against named criteria and returns a score. Used for: tone match where deterministic isn't enough, claim plausibility, narrative coherence, audience-fit. Always pin the judge model. Always recalibrate the judge quarterly.

**Type D — LLM-as-judge, structured comparison.** A model compares the output against a known-good example and reports differences. Used for: ranking competing drafts, A/B selection, "is this as good as our best?"

Most output types use a mix. A blog post evaluation is: structural (Type A), voice (Type B), originality vs SERP (Type C), claim plausibility (Type C). The rubric file specifies which checks apply, in what order, and what the gates are.

## The LLM-as-judge prompt pattern

The pattern that holds up. Don't ask the judge model "is this good?" — that produces drift. Ask specific questions with the criteria explicit.

```text
SYSTEM: You evaluate marketing copy against a specific criterion. You
return a score from 1 to 5 and a one-sentence justification. You do not
evaluate against criteria not given to you. You do not editorialise.

If the criterion is ambiguous in the context, return score 3 and flag
the ambiguity.

USER:
Output type: {OUTPUT_TYPE}
Criterion: {CRITERION_NAME}
Criterion definition:
{CRITERION_DEFINITION}

Anchor examples:
- Score 5: {EXAMPLE_5}
- Score 3: {EXAMPLE_3}
- Score 1: {EXAMPLE_1}

The piece to evaluate:
"""
{OUTPUT_TEXT}
"""

Return JSON:
{
  "criterion": "{CRITERION_NAME}",
  "score": <1|2|3|4|5>,
  "justification": "<one sentence>",
  "ambiguity_flag": <true | false>
}

Rules:
- Score is integer 1-5. No half-scores.
- Justification is one sentence under 25 words.
- If the criterion doesn't apply to this output type, return null
  with the ambiguity flag set.
```

The anchor examples in the prompt are the discipline. Without anchors, the judge model drifts week-to-week. With anchors, it stays consistent across model versions.

## The eval harness for evals

Yes, you evaluate the evals.

**Eval-of-eval 1 — Stability.** Run the rubric against the same 30-piece calibration corpus monthly. The pass/fail outcomes should be stable (≥90% identical to the previous run). If they aren't, either the judge model has drifted (re-pin or recalibrate) or the rubric criteria are too soft.

**Eval-of-eval 2 — Inter-rater agreement.** For LLM-judged criteria, run two judge models in parallel for 20 pieces. They should agree on the score within ±1 point for 80%+ of pieces. If they disagree more, the criterion definition is ambiguous — sharpen it.

**Eval-of-eval 3 — Human-baseline correlation.** Quarterly, the brand lead independently scores 20 pieces. Correlation with the rubric output should stay >0.7. Below that, the rubric has drifted from the lead's actual judgement and needs recalibration.

## The failure modes

**Judge model drift.** Every model provider update can change the judge's behaviour. Even pinned versions sometimes drift behind the scenes. The monthly stability eval catches this. Don't skip it.

**Criteria proliferation.** Teams want to add a new criterion every time they're surprised by an output. Resist. Add criteria only after a quarterly review with a documented case. A 15-criterion rubric is unreviewable. Keep most rubrics to 5-8.

**Anchor examples decay.** If your anchor examples are 2 years old, they reflect a previous era of the brand. Quarterly, replace the anchors with fresh examples from the current best work.

**Ambiguity flags get ignored.** When the judge flags ambiguity, that's a signal the criterion or the example isn't ready for judgement. Flagged outputs should go to human review, not get pushed through with a default score.

**The rubric becomes the work.** Some teams optimise for the rubric instead of the outcome. If headlines pass the rubric but stop performing in production, the rubric has drifted from the goal. Tie the rubric calibration back to actual performance every quarter — pieces that scored well should be outperforming pieces that scored poorly.

**Brand lead bypasses the rubric.** If the lead overrides the rubric in either direction (rejecting passes, accepting fails) more than 10% of the time, the rubric isn't aligned with their judgement. Either retrain it against the recent overrides, or have a conversation about which criteria are actually the deciding ones.

## The pattern in practice

Illustrative scenarios — common shapes evaluation frameworks take. Specifics are illustrative; the patterns repeat.

**Publishing, scale-stage — the gut-to-rubric standardisation.** An editorial team using "the editor's gut" as the standard. Inconsistent across staff. Building rubrics for the most-produced output types typically lifts inter-editor consistency on accept/reject from the 60s into the high 80s in percentage points. Editor time frees up for the judgement calls the rubric can't make.

**B2B SaaS, growth-stage — the upstream catch.** A content team shipping AI-drafted content that the brand lead keeps rejecting. Building a rubric calibrated to the lead's actual rejections typically catches the majority of pieces the lead would have rejected — before the lead has to see them. Lead's time on review drops dramatically.

**Marketplace — the rubric-as-ceiling failure.** A common failure mode: the rubric ships and the team treats it as gospel. After a quarter, output is technically passing but flat and risk-averse — the rubric has pushed the team toward safe work that hits every criterion and surprises no one. The fix is an "originality" criterion that explicitly requires at least one element the team hasn't tried before. The lesson: rubrics enforce floors. They shouldn't be ceilings.
