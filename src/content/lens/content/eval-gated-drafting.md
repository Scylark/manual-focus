---
title: "Eval-gated drafting pipeline"
stack: content
description: "A drafting pipeline that scores its own output against four objective gates before a human sees it. Triples the team's editorial throughput without dropping the standard."
outputs: "Drafting pipeline + scoring rubric + queue routing"
readMin: 11
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["content", "seo", "email"]
models: ["claude-4.5-sonnet", "claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-19
status: live
preview: false
---

## The brief

Most AI drafting workflows fail in the same way. The team writes a prompt, gets back something readable but generic, edits it down to brand-quality manually, and then doesn't measure whether the edits would have been needed if the prompt had been better. The result is that the team still spends the same time on content, just on different tasks. No net gain.

This playbook fixes that. The pipeline runs every draft through four objective scoring gates (voice match, fact-grounded, originality, structural) before it ever reaches a human editor. Drafts that pass all four go to a 15-minute polish review. Drafts that fail go back to the model with the failing gates named, regenerated, and scored again. The human editor only sees content that's already at quality.

The unlock is faster *editing*, not faster drafting. A team that was editing for 2 hours per piece is editing for 20 minutes per piece, and the editing is sharper because they're working on judgement calls rather than fundamental voice or fact issues. Those are already fixed.

## The pipeline

Six stages.

**Stage 1, brief intake.** Every draft starts from a structured brief, not a prompt. The brief includes target query, intent, stage, must-include facts (with sources), the brand's POV, the differentiation hook, target length, and voice profile reference. The pipeline rejects briefs that miss any field.

**Stage 2, first-pass draft.** Model writes the draft against the brief and the voice profile. No tricks here, a single pass with a strong, structured prompt. The draft is not seen by anyone yet.

**Stage 3, eval gate, four scores.** The draft runs through the four scorers in parallel.

**Stage 4, repair or promote.** If all four scores pass, the draft promotes to human review. If any fail, the failure modes are written into a repair prompt and the model regenerates. Maximum 3 repair cycles, and if it can't pass after 3, the brief itself is suspect and gets bounced to strategy for review.

**Stage 5, human review.** The editor opens the draft with the scoring report attached. The report tells them what the gates checked and what passed. The review focuses on the things the gates can't measure, including judgement calls, narrative arc, and the one paragraph that's smart but maybe too clever.

**Stage 6, ship and instrument.** Drafted, edited, shipped. The pipeline logs the gate scores, the repair cycle count, the editor's actual edit time, and the post-publication performance. Every monthly review cycle, the team looks at what's drifting (gate calibration, prompt drift, voice drift) and tunes.

## The four gates

**Gate 1, voice match.** The voice rubric from the brand-voice-extraction playbook. 12 checks, draft scores ≥10/12 to pass. Deterministic script, around 30ms per draft.

**Gate 2, fact grounded.** Every claim the draft makes must trace to a source in the brief or be flagged as a model assertion needing human verification. The grounding checker is a separate model call with the prompt below.

```text
SYSTEM: You verify claims in a draft against a list of approved sources.
For each factual claim in the draft, you cite the source from the
provided list that supports it. If no source supports the claim, you
flag it.

A factual claim is anything that asserts numbers, dates, names,
quotes, causal relationships, or product capabilities. Opinion,
exhortation and stylistic phrasing are not claims.

USER:
Approved sources (the only sources you may cite):
{SOURCES_JSON}

Draft:
"""
{DRAFT}
"""

Return JSON array, one element per factual claim:

[
  {
    "claim": "<verbatim from draft>",
    "source_id": "<id from sources OR null>",
    "supported": <true | false>,
    "needs_human_verify": <true | false>
  }
]

Pass criterion: ≥95% of claims have a source_id OR are explicitly
flagged as needing human verification. No silent assertions.
```

A draft fails this gate if any factual claim is unsourced and not explicitly flagged. The repair prompt sends the failures back to the drafter to either ground them or remove them.

**Gate 3, originality.** Embedding similarity check against the top 20 pages currently ranking for the target query. If the draft scores above 0.75 cosine similarity to any of them, it's too close. The draft is restating, not contributing. Repair prompt asks the drafter to introduce the differentiation hook from the brief.

**Gate 4, structural.** A simple set of structural checks. At least one H2 every 250 words, at least one piece of original data or example per 400 words, no paragraph over 75 words, intro paragraph contains the primary keyword in the first 100 words. Deterministic, around 10ms per draft.

## The eval harness

The pipeline gates are the eval harness, mostly. Two additional checks at the pipeline level.

**Pipeline check 1, gate calibration drift.** Monthly, sample 30 drafts that passed all four gates and have the editor independently rate them on a 1 to 5 scale. If the mean editor rating drops below 4.0, one of the gates has drifted (most often the voice rubric). Recalibrate against fresh examples.

**Pipeline check 2, repair-cycle distribution.** Track the distribution of how many repair cycles each brief required. If the median is climbing (say, from 0 to 1 to 1.5 over months), the briefs are getting weaker or the prompt is being implicitly weakened by drift in the model provider's behaviour. Re-run the prompt against the previous month's strongest briefs to see if the issue is brief quality or pipeline quality.

## The failure modes

**Briefs aren't briefs.** Teams often try to start the pipeline with a topic and a deadline. The pipeline refuses by design. Without the must-include facts, the differentiation hook, and the voice reference, the gates can't score against anything meaningful. Train the team that the brief is the work and the drafting is the easy bit.

**Editor over-edits.** Even with a passing draft, editors sometimes feel the need to mark it up to justify their value. This is human. Combat with a "minimum 15-minute review" rule and a feedback loop where the editor's actual edits get diffed against the pipeline output, and edits that don't improve the gate scores are visible. Doesn't shame the editor, but does focus them.

**Gate 3 over-fails.** If your target SERP is dominated by very similar pages, your draft's originality score has nowhere to be unique without going off-topic. This is a signal the cluster strategy is wrong (see the SEO cluster playbook) rather than that the drafting is bad.

**Gate 2 false positives.** Some grounding checks fail on phrasing ambiguity. "Research shows X" gets flagged when the brief contains the research but the draft didn't attribute. Fix in the drafter prompt so every claim must be phrased with the attribution carrier ("the brand's 2024 survey of 1,200 marketers showed X"). Cleaner writing and passes the gate.

**Model provider updates break the gates.** When a provider ships a new default model version, the voice rubric pass rate can swing. Pin model versions in the drafter call and only update after re-running the eval suite against the previous month's drafts. This adds discipline. Teams that just use "claude-4.5" without pinning a sub-version eat the drift.

**Gate 4 turns into a rule book.** Once teams see the structural gate, they over-correct. Every page becomes "intro, then 4 H2s, then a conclusion." Avoid by treating the gate thresholds as floors rather than patterns. The drafter prompt should still emphasise that the structure serves the argument, not the gate.

## The pattern in practice

Illustrative scenarios that show common shapes eval-gated drafting takes. Specifics are illustrative and the patterns repeat.

**Publishing, scale-stage, the editor-time reclaim.** An editorial team shipping a handful of long-form pieces a month and spending double-digit hours per piece on editing. With the pipeline, drafts hit passing-gates in 2 to 3 cycles and editor time per piece drops by roughly two-thirds. Same standard (blind reader-panel verification). Output capacity roughly doubles without headcount increase.

**B2B SaaS, growth-stage, the writer-burnout fix.** A brand burning out a single in-house writer with first-draft work. The pipeline replaces most of the drafting workload. The writer now owns the briefs and the final polish per piece, the work that needs their judgement rather than the soul-crushing first-draft work. Output rises and the writer stays.

**Marketplace, the editor-overrides failure.** A common failure mode is when the pipeline ships, gates calibrate, output is strong, and a new editor joins who doesn't trust the gates and re-edits everything to personal taste. Throughput drops back to pre-pipeline levels. The pipeline still runs and the human stopped honouring it. The gates only work if the team agrees to trust them when they pass. Train the editor on what each gate measures so they understand what's already been checked.
