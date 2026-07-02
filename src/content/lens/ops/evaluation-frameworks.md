---
title: "Evaluation frameworks for marketing AI outputs"
stack: ops
description: "How to score AI-generated marketing work objectively. Rubrics, deterministic checks, model-as-judge patterns, calibration ritual."
outputs: "Eval matrix, scoring scripts, anchor examples, calibration corpus"
readMin: 16
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["analytics", "content", "brand"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-04-28
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. An **evaluation matrix** (one CSV per output type, or one combined CSV across types) listing every criterion, check type, anchor examples and pass thresholds.
2. A **scoring script** that runs the matrix against any piece of content and returns structured pass, borderline and fail outputs in under a second per piece.
3. A **calibration corpus** of 30 examples per output type (15 known-good, 15 known-bad) with the brand lead's tagging rationale.
4. A **quarterly calibration ritual** that re-runs the corpus, checks for judge-model drift and updates anchor examples.
5. A **judge-model pinning policy** documenting which model version judges which criterion and when to re-pin.

## Who this is for

A growth, scale or enterprise marketing function producing AI-drafted output where the brand lead currently reviews every draft. The function ships at least ten pieces a week across two or more output types (headlines, body copy, ads, emails, social posts). If your team produces three pieces a week, the brand lead can read them all and you do not need this discipline yet. If your team ships fifty a week and the brand lead is reviewing one in five, you have a problem that this playbook solves.

## Before you start

- [ ] List of output types your team produces (headlines, body copy, email subjects, ad copy, social posts, deck text)
- [ ] 30 examples per output type, split 15 known-good and 15 known-bad, tagged with reason
- [ ] Brand lead available for 90 minutes per output type to confirm the criteria
- [ ] Anthropic or OpenAI API key for the LLM-judgement criteria
- [ ] Python or Node locally for the scoring script
- [ ] A pinned model version for each LLM-judgement criterion (claude-4.5-sonnet-2025-10-15 or equivalent)
- [ ] The brand voice profile (output of brand-voice-extraction)
- [ ] The brand guardrails ruleset (output of brand-guardrails-as-code) so the eval matrix can reuse the deterministic checks

If you do not have 15 known-bad examples, ask the brand lead to walk back through Slack rejections and pull the last 15. Memory is unreliable, screenshots are not.

## The pipeline

Five phases. One working week per output type, can run in parallel across types.

### Phase 1, corpus collection

The corpus is the calibration ground truth.

**Step 1.1, gather the 15 known-good.**

Ask the brand lead for 15 pieces of the output type the brand lead would ship without changes. The pieces should span the last twelve months, not all from the same campaign.

Save the corpus in a Notion database called *Eval corpus* or a Google Sheet. One row per piece. Columns: Output type, Source (where shipped), Date, Text content, Tag (good or bad), Reason (the brand lead's one-sentence rationale).

**Step 1.2, gather the 15 known-bad.**

Same database, second tab. 15 pieces the brand lead either rejected, revised heavily or noted as misses post-ship. Same columns plus the rejection rationale.

**Step 1.3, the tagging interview.**

For each piece, the brand lead writes the rationale in their own words. The interview takes 90 minutes per output type. The rationale is the input to Phase 2.

You should now have a 30-piece corpus with brand-lead rationale on each.

### Phase 2, rubric draft

Extract the criteria from the rationale.

**Step 2.1, the criteria-extraction prompt.**

```text
SYSTEM: You extract evaluation criteria from a brand lead's
rationale on accepted and rejected pieces of marketing content.
You return the 5 to 8 criteria the lead is actually applying,
each with a definition.

USER:
Output type: {OUTPUT_TYPE}
30-piece corpus with brand-lead tagging:
{PASTE_CORPUS}

For each criterion the lead is using, return:
{
  "criterion_id": "<short id>",
  "criterion_name": "<plain English name>",
  "definition": "<one sentence definition>",
  "appears_in_good_examples": "<one sentence summary>",
  "appears_in_bad_examples_as_violation": "<one sentence summary>",
  "proposed_check_type": "<deterministic_count | deterministic_regex | llm_judgement | structural>",
  "proposed_weight": <1 | 2 | 3>
}

Rules:
- Return between 5 and 8 criteria. More is unreviewable.
- Skip criteria that appear in fewer than 3 of the 30 examples.
  Those are personal preference, not pattern.
- Weight 3 is reserved for criteria that show up as the
  primary rejection reason in at least 5 bad examples.
- Prefer deterministic check types where possible.
```

**Expect output like:**

```json
[
  {
    "criterion_id": "H1",
    "criterion_name": "length",
    "definition": "Headline 65 characters or fewer.",
    "appears_in_good_examples": "12 of 15 are at 62 chars or fewer.",
    "appears_in_bad_examples_as_violation": "9 of 15 are over 70 chars.",
    "proposed_check_type": "deterministic_count",
    "proposed_weight": 1
  },
  {
    "criterion_id": "H4",
    "criterion_name": "specificity",
    "definition": "Names a specific person, product, event or place.",
    "appears_in_good_examples": "All 15 good examples name something specific.",
    "appears_in_bad_examples_as_violation": "11 of 15 bad examples are generic.",
    "proposed_check_type": "llm_judgement",
    "proposed_weight": 2
  }
]
```

**Step 2.2, walk the criteria with the brand lead.**

For each surfaced criterion, the brand lead confirms or modifies. Most teams discover the lead is using 5 to 8 criteria, not the 30 in the brand guide. The rubric is built from what is actually used.

You should now have a confirmed 5 to 8 criteria per output type.

### Phase 3, check-type selection and anchors

For each criterion, decide deterministic or LLM-judgement, and write the anchor examples.

**Step 3.1, the default cascade.**

For each criterion:

1. If the criterion can be checked by counting or regex, use deterministic.
2. If it requires reading the content for meaning, use LLM-judgement.
3. If it can be partially checked deterministically first then LLM-judged on the survivors, use hybrid (faster and cheaper).

The four rubric types:

- **Type A, deterministic structural.** Counts, lengths, regex. Pass/fail per criterion.
- **Type B, deterministic stylometric.** Pattern matching against the voice profile. Sentence length distribution, contraction count, transition word usage, opener pattern.
- **Type C, LLM-as-judge, scored.** A model evaluates against named criteria and returns a 1-to-5 score.
- **Type D, LLM-as-judge, structured comparison.** A model compares the output against a known-good example and reports differences.

Most output types use a mix.

**Step 3.2, write the anchor examples for each LLM-judged criterion.**

The anchor examples are the discipline that prevents judge-model drift. For each LLM-judged criterion, the brand lead writes:

- Score 5 example, what an excellent piece looks like for this criterion
- Score 3 example, what a borderline piece looks like
- Score 1 example, what a failing piece looks like

The anchors live in the evaluation matrix CSV alongside the criterion.

**Step 3.3, the LLM-judge prompt template.**

The pattern that holds up. Avoid asking the judge "is this good?" Ask the specific criterion with explicit anchors.

```text
SYSTEM: You evaluate marketing copy against a specific
criterion. You return a score from 1 to 5 and a one-sentence
justification. You do not evaluate against criteria not given
to you. You do not editorialise.

If the criterion is ambiguous in the context, return score 3
and flag the ambiguity.

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
  "score": <1 | 2 | 3 | 4 | 5>,
  "justification": "<one sentence under 25 words>",
  "ambiguity_flag": <true | false>
}

Rules:
- Score is integer 1 to 5. No half scores.
- Justification is one sentence under 25 words.
- If the criterion does not apply to this output type, return
  null with the ambiguity flag true.
```

You should now have a matrix with check type, anchors and pass thresholds per criterion.

### Phase 4, calibration

Run the rubric against the corpus and measure correlation.

**Step 4.1, the scoring script.**

The script reads the eval matrix CSV and runs each criterion against the input. Pseudocode:

```python
def score(content, output_type, matrix):
    criteria = matrix[matrix.Output_Type == output_type]
    results = []
    for _, crit in criteria.iterrows():
        if crit.Check_Type.startswith("deterministic"):
            r = check_deterministic(content, crit)
        else:
            r = check_llm(content, crit)
        results.append(r)
    return {
        "output_type": output_type,
        "criteria_scores": results,
        "weighted_total": sum(r.score * crit.weight for r, crit
                              in zip(results, criteria.itertuples())),
        "verdict": derive_verdict(results)
    }
```

The `derive_verdict` function maps weighted total to *pass*, *borderline* or *fail*.

**Step 4.2, run the rubric against the 30-piece corpus.**

Pipe each corpus piece through the script. Compare the rubric's verdict against the brand lead's tag.

| Correlation | Read |
|---|---|
| 0.85+ | Rubric reflects the lead's judgement. Ship. |
| 0.70 to 0.85 | Acceptable but examine the disagreements. |
| Below 0.70 | Rubric is missing criteria or applying them wrong. Iterate. |

**Step 4.3, iterate on misses.**

For each piece where the rubric and the lead disagreed, run the diagnostic prompt.

```text
SYSTEM: You diagnose why an evaluation rubric disagreed with
the brand lead's tag on a specific piece of content. You
return the most likely cause.

USER:
Output text:
{PIECE_TEXT}

Rubric verdict: {RUBRIC_VERDICT}
Rubric per-criterion scores: {SCORES}

Brand lead's tag: {LEAD_TAG}
Brand lead's rationale: {LEAD_RATIONALE}

Return JSON:
{
  "disagreement_type": "<rubric_too_strict | rubric_too_lenient | missing_criterion | criterion_definition_drift>",
  "specific_criterion": "<criterion id or null>",
  "remediation": "<one-sentence concrete change to the rubric>"
}
```

The diagnostic output drives the next rubric revision. Repeat until correlation clears 0.85.

You should now have a calibrated rubric per output type.

### Phase 5, production install and the calibration ritual

The rubric ships. The ritual keeps it honest.

**Step 5.1, wire the rubric into the pipeline.**

For each output type, the team's drafting pipeline calls the scoring script before promoting to pre-ship review. Pass means promote. Borderline means flag for human. Fail means regenerate with the failing criteria named.

If your team uses the brand-guardrails-as-code linter from that playbook, the eval rubric integrates as one more check alongside the guardrails. The pre-commit hook or CI integration is the same.

**Step 5.2, the quarterly calibration ritual.**

Once a quarter, the brand lead spends 90 minutes per output type:

- Re-run the 30-piece corpus through the rubric. Check the verdict-vs-tag correlation.
- Score 20 new pieces independently and compare to the rubric's verdicts.
- Update anchor examples with three fresh pieces from the last quarter.
- Re-pin the judge models if the provider has released new versions.

The ritual lives in a Notion page called *Eval calibration log*. Each quarter's entry includes correlation numbers, anchor changes and any criteria added or retired.

**Step 5.3, the judge-model pinning policy.**

In the eval matrix CSV, every LLM-judgement criterion has a `Judge_Model` column. Pin to specific versions (claude-4.5-sonnet-2025-10-15, gpt-5-2025-11-01). Updates happen at the quarterly calibration only, not silently.

You should now have rubrics running in production with a quarterly ritual that catches drift.

## Worked example, end-to-end

Cascadia Endurance, scale-stage. Beth Lyons (brand and content lead) holds the eval discipline. Marcus Hale (founder) wants to ship faster. Saoirse Burns (channel operator) builds the scoring scripts.

**Phase 1.** Beth and Marcus pull 30 pieces across three output types in week one: headlines, body copy and email subjects. The good 15 are pieces Beth shipped without changes. The bad 15 are pieces Beth rejected. Beth writes the rationale on each. Three of the rejections turn out to be about an emoji policy Beth had not documented.

**Phase 2.** The extraction prompt produces six criteria per output type. Beth confirms five and adds one (specificity) the model under-weighted on headlines. The final matrix has 13 criteria across the three output types.

**Phase 3.** Most criteria deterministic. Three are LLM-judgement (specificity, claim-source, voice-match). Beth writes the score-5, score-3, score-1 anchors for each. The anchors get saved to the CSV.

**Phase 4.** Saoirse builds the scoring script in three days. First-run correlation against the corpus is 0.74 on headlines, 0.81 on body copy, 0.69 on email subjects. The diagnostic prompt surfaces two issues: headline rubric was too strict on length (going to 60 chars where Beth's good examples ran to 65), and the email subject criterion for specificity was too loose. After two revisions, correlations land at 0.88, 0.87 and 0.86 respectively.

**Phase 5.** Rubric goes live behind the brief-to-ship pipeline. The first month catches 23 of 28 pieces Beth would have rejected, before Beth has to read them. Beth's draft-review time drops from six hours a week to under two.

**The eval matrix after install (extract from the CSV template):**

| Output type | Criterion | Check type | Weight | Pass threshold |
|---|---|---|---|---|
| headline | length | deterministic_count | 1 | length <= 65 |
| headline | no_buzzwords | deterministic_regex | 1 | zero hits |
| headline | specificity | llm_judgement | 2 | score >= 4 |
| body_copy | paragraph_length | deterministic_count | 1 | max_para_words <= 75 |
| body_copy | claim_source | llm_judgement | 3 | score >= 4 |
| body_copy | voice_match | llm_judgement | 2 | score >= 4 |
| email_subject | length | deterministic_count | 1 | length <= 50 |
| email_subject | no_emojis | deterministic_regex | 1 | zero emojis |
| email_subject | specificity | llm_judgement | 2 | score >= 4 |

Q3 calibration shows correlation holding at 0.87 across types. One criterion (the buzzword check) gets a new entry added ("seamless" was missing from the original list). No model re-pin required.

## Try it yourself

Three exercises. Each takes 30 to 60 minutes.

### Exercise 1, run the criteria-extraction prompt on your last 20 rejections

Pull the last 20 pieces your brand lead rejected. Tag each with the lead's rationale. Run the Phase 2.1 prompt. Compare the output to your documented brand guidelines. How many of the surfaced criteria are not in the guidelines? That gap is the value of corpus-driven rubric extraction.

### Exercise 2, write anchor examples for one criterion

Pick one LLM-judgement criterion the brand cares about (specificity, voice-match, claim-support). Write the score-5, score-3 and score-1 anchors. Show the anchors to a colleague without the criterion name and ask them to guess what is being measured. If they cannot, the anchors are not specific enough.

### Exercise 3, run the LLM-judge prompt against five pieces

Take the LLM-judge prompt from Step 3.3. Fill in your criterion and anchors. Pipe five recent pieces through it. Read the scores and justifications. Where the model's score surprises you, either the anchor is wrong or the model is reading something you missed. Both findings are useful.

## The eval gates

**Eval-of-eval 1, stability.** Run the rubric against the same 30-piece calibration corpus monthly. The pass/fail outcomes should be stable (90% or more identical to the previous run). If they are not, either the judge model has drifted or the rubric criteria are too soft.

**Eval-of-eval 2, inter-rater agreement.** For LLM-judged criteria, run two judge models in parallel for 20 pieces. They should agree on the score within plus or minus one point for 80% or more of pieces. If they disagree more, the criterion definition is ambiguous.

**Eval-of-eval 3, human-baseline correlation.** Quarterly, the brand lead independently scores 20 pieces. Correlation with the rubric output should stay above 0.7. Below that, the rubric has drifted from the lead's judgement and needs recalibration.

**Eval-of-eval 4, scoring script speed.** End-to-end time under one second per piece for deterministic-only output types, under three seconds for output types with LLM-judgement. If the rubric is slow, the team will work around it.

## The failure modes

**Judge model drift.** Every model provider update can change the judge's behaviour. Even pinned versions sometimes drift behind the scenes. The monthly stability eval catches this. Do not skip it.

**Criteria proliferation.** Teams want to add a new criterion every time they are surprised by an output. Resist. Add criteria only after a quarterly review with a documented case. A 15-criterion rubric is unreviewable.

**Anchor examples decay.** If anchor examples are two years old, they reflect a previous era of the brand. Quarterly, replace anchors with fresh examples from the current best work.

**Ambiguity flags get ignored.** When the judge flags ambiguity, that is a signal the criterion or the example is not ready for judgement. Flagged outputs go to human review, not pushed through with a default score.

**The rubric becomes the work.** Some teams optimise for the rubric rather than the outcome. If headlines pass the rubric but stop performing in production, the rubric has drifted from the goal. Tie rubric calibration back to actual performance every quarter.

**Brand lead bypasses the rubric.** If the lead overrides the rubric in either direction more than 10% of the time, the rubric is not aligned with their judgement. Either retrain it against the recent overrides or have a conversation about which criteria are actually deciding.

## The pattern in practice

Illustrative scenarios that show common shapes evaluation frameworks take. Specifics are illustrative and patterns repeat.

**Publishing, scale-stage, the gut-to-rubric standardisation.** An editorial team using the editor's gut as the standard. Inconsistent across staff. Building rubrics for the most-produced output types typically lifts inter-editor consistency on accept/reject from the 60s into the high 80s in percentage points. Editor time frees up for the judgement calls the rubric cannot make.

**B2B SaaS, growth-stage, the upstream catch.** A content team shipping AI-drafted content that the brand lead keeps rejecting. Building a rubric calibrated to the lead's actual rejections typically catches the majority of pieces the lead would have rejected, before the lead has to see them. Lead's time on review drops dramatically.

**Marketplace, the rubric-as-ceiling failure.** A common failure mode is the rubric ships and the team treats it as gospel. After a quarter, output is technically passing but flat and risk-averse, because the rubric has pushed the team toward safe work that hits every criterion and surprises no one. The fix is an originality criterion that explicitly requires at least one element the team has not tried before. Rubrics enforce floors. They should not be ceilings.

## Templates

The evaluation matrix CSV. One row per criterion per output type. Drop into Google Sheets.

[Download evaluation-matrix-template.csv](/lens/templates/evaluation-matrix-template.csv)

The CSV ships with 13 sample Cascadia criteria across headlines, body copy, email subjects and Meta ad copy. Wipe them, keep the headers, fill in your own.

**If your output types differ or your check infrastructure is different, ask Claude to build a custom version.**

```text
SYSTEM: You generate an evaluation matrix CSV tailored to a
specific brand's output types and check infrastructure.

USER:
My output types: {LIST_TYPES}
My check infrastructure: {DETERMINISTIC_ONLY | LLM_AVAILABLE | BOTH}
My judge model preferences: {LIST_MODELS}
Extra fields I need: {LIST_FIELDS}

Generate a CSV with one row per criterion per output type and
columns for:
- Output_Type, Criterion_ID, Criterion_Name, Criterion_Definition
- Check_Type, Pass_Threshold, Border_Threshold, Fail_Threshold
- Judge_Model, Anchor_Example_5, Anchor_Example_3, Anchor_Example_1
- Weight, Notes
- (any extras I specified)

For each output type, propose 5 to 8 criteria. Pre-fill anchor
examples for the LLM-judgement criteria with realistic content
for an endurance brand. Return the CSV directly.
```

## Hand-off

The evaluation matrix feeds:
- **brief-to-ship-pipeline**, where pre-ship review requires the matrix verdict before promotion
- **brand-guardrails-as-code**, where the deterministic rules in the matrix overlap with the guardrails ruleset
- **brand-voice-extraction**, where the stylometric checks pull from the voice profile
- **content production pipelines** (race-result-content-engine, segment-broll-production, social-content-factory), where the matrix is the final gate before human review
