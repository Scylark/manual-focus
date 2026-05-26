---
name: eval-gated-drafting
description: "When the user wants to draft marketing content that passes objective quality gates before a human editor sees it, install an eval-gated content pipeline, score AI drafts against rubrics, or stop the endless cycle of AI drafts that need heavy editing. Also triggers on 'draft this blog post', 'write the landing page copy', 'we need this content but it has to be good', or 'edit this against our voice rubric'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/content/eval-gated-drafting
---

# Eval-gated drafting

You draft content that scores itself against four objective gates before a human sees it. Drafts that pass go to a 15-minute polish review. Drafts that fail go back to you with the failing gates named. The unlock is faster editing, not faster drafting.

## Inputs to gather first

1. **Structured brief** — refuse to draft without all of:
   - Target query (the search query the piece serves)
   - Intent + stage
   - Must-include facts with sources
   - Brand POV on the topic
   - Differentiation hook
   - Target length
2. **Voice profile** — `.lens/voice-profile.json` (run brand-voice-extraction if missing)
3. **Source list** for the fact-grounding gate — every claim in the draft must trace to a source here or be flagged as a model assertion needing human verification
4. **Top 20 ranking pages** for the target query (for originality gate)

## The pipeline (six stages)

### Stage 1 — Brief intake

Validate the brief. Refuse drafts that miss any required field. Send a sharpened-brief template if the user resists.

### Stage 2 — First-pass draft

Single pass with the structured brief and voice profile loaded. The draft is not yet seen by anyone.

### Stage 3 — Eval gate, four scores

Run all four in parallel.

**Gate 1 — Voice match.** The 12-check voice rubric from `.lens/voice-profile.json`. Pass = ≥10/12.

**Gate 2 — Fact grounded.** Every factual claim traces to a source or is explicitly flagged for human verify.

```text
SYSTEM: You verify claims in a draft against a list of approved sources.
For each factual claim, you cite the source from the provided list. If
no source supports the claim, you flag it.

Factual claim = anything asserting numbers, dates, names, quotes, causal
relationships, or product capabilities. Opinion and stylistic phrasing
are not claims.

USER:
Approved sources: {SOURCES_JSON}
Draft: """{DRAFT}"""

Return JSON array:
[
  {
    "claim": "<verbatim>",
    "source_id": "<id|null>",
    "supported": <true|false>,
    "needs_human_verify": <true|false>
  }
]

Pass: ≥95% of claims have source_id OR are flagged for human verify.
```

**Gate 3 — Originality.** Embedding similarity vs the top 20 SERP pages for the target query. Any pair >0.75 fails — too close.

**Gate 4 — Structural.** Deterministic checks:
- ≥1 H2 every 250 words
- ≥1 piece of original data or example per 400 words
- No paragraph >75 words
- Intro paragraph contains primary keyword in first 100 words

### Stage 4 — Repair or promote

All four pass → promote to human review. Any fail → repair prompt with failures named, regenerate, re-score. Max 3 repair cycles; if still failing, the brief is the suspect — bounce to strategy review.

### Stage 5 — Human review

Send to editor with the gate report attached. Editor focuses on judgement calls — narrative arc, the one paragraph that's smart but maybe too clever — not on the things gates already checked.

### Stage 6 — Ship and instrument

Log: gate scores, repair cycle count, editor's actual edit time, post-publication performance.

## Output

Per draft:

1. **Final draft** — content ready for human review
2. **Gate report** — JSON showing pass/fail per gate, scores, what changed across repair cycles
3. **Editor focus list** — the 2–3 things gates can't measure that the editor should look at

Save the final draft to the project's content path. Save the gate report alongside as `<filename>.report.json`.

## Evals

Pipeline-level (run monthly):

- **Gate calibration drift** — sample 30 drafts that passed all gates; editor independently rates 1–5. Mean editor rating <4.0 means gates have drifted.
- **Repair-cycle distribution** — track median cycles per brief. Climbing trend means briefs are weakening or prompts are drifting.

## Failure modes to watch

- **Briefs aren't briefs** — refuse to draft topics with deadlines but no must-include facts, no differentiation hook, no voice reference. The brief is the work.
- **Editor over-edits** — even with a passing draft, editors sometimes mark up for the sake of it. Set a 15-minute minimum review rule; diff edits against pipeline output; flag edits that don't improve gate scores.
- **Gate 3 over-fails** — if the target SERP is dominated by very similar pages, originality has nowhere to go without going off-topic. Signal that the cluster strategy is wrong, not the drafting.
- **Gate 2 false positives** — phrasing ambiguity can flag valid claims. Fix in the drafter prompt: every claim phrased with attribution carrier ("the brand's 2024 survey of 1,200 marketers showed X").
- **Model provider updates break gates** — pin model versions in drafter and judge calls; re-run eval suite on update.
- **Gate 4 becomes a rule book** — teams over-correct. Gates are floors, not patterns. Drafter prompt still emphasises structure serves argument.
- **Brand lead bypasses the rubric** — if overrides exceed 10% in either direction, rubric isn't aligned with their judgement. Retrain or have the conversation about which gates are deciding.

## Hand-off

Drafts pass to:
- Editor review (human) for the judgement calls
- **social-content-factory** for cross-channel adaptation of the final draft
- The brand's CI / content repo for shipping
