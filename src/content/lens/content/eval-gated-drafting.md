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

Most AI drafting workflows fail in the same way: the team writes a prompt, gets back something readable but generic, edits it down to brand-quality manually, and then doesn't measure whether the edits would have been needed if the prompt had been better. The result: the team still spends the same time on content, just on different tasks. No net gain.

This playbook fixes that. The pipeline runs every draft through four objective scoring gates — voice match, fact-grounded, originality, structural — before it ever reaches a human editor. Drafts that pass all four go to a 15-minute polish review. Drafts that fail go back to the model with the failing gates named, regenerated, scored again. The human editor only sees content that's already at quality.

The unlock isn't faster drafting. It's faster *editing*. A team that was editing for 2 hours per piece is editing for 20 minutes per piece, and the editing is sharper because they're not chasing fundamental voice or fact issues — those are already fixed.

## The pipeline

Six stages.

**Stage 1 — Brief intake.** Every draft starts from a structured brief, not a prompt. The brief includes target query, intent, stage, must-include facts (with sources), the brand's POV, the differentiation hook, target length, voice profile reference. The pipeline rejects briefs that miss any field.

**Stage 2 — First-pass draft.** Model writes the draft against the brief and the voice profile. No tricks here — single pass with a strong, structured prompt. The draft is not seen by anyone yet.

**Stage 3 — Eval gate, four scores.** The draft runs through the four scorers in parallel.

**Stage 4 — Repair or promote.** If all four scores pass, draft promotes to human review. If any fail, the failure modes are written into a repair prompt and the model regenerates. Max 3 repair cycles; if it can't pass after 3, the brief itself is suspect and gets bounced to strategy for review.

**Stage 5 — Human review.** Editor opens the draft with the scoring report attached. The report tells them what the gates checked and what passed. The review focuses on the things the gates can't measure: judgement calls, narrative arc, the one paragraph that's smart but maybe too clever.

**Stage 6 — Ship and instrument.** Drafted, edited, shipped. The pipeline logs the gate scores, the repair cycle count, the editor's actual edit time, and the post-publication performance. Every monthly review cycle, we look at what's drifting — gate calibration, prompt drift, voice drift — and tune.

## The four gates

**Gate 1 — Voice match.** The voice rubric from the brand-voice-extraction playbook. 12 checks, draft scores ≥10/12 to pass. Deterministic script, ~30ms per draft.

**Gate 2 — Fact grounded.** Every claim the draft makes must trace to a source in the brief or be flagged as a model assertion needing human verification. The grounding checker is a separate model call with the prompt:

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

**Gate 3 — Originality.** Embedding similarity check against the top 20 pages currently ranking for the target query. If the draft scores above 0.75 cosine similarity to any of them, it's too close — the draft is restating, not contributing. Repair prompt asks the drafter to introduce the differentiation hook from the brief.

**Gate 4 — Structural.** A simple set of structural checks: at least one H2 every 250 words, at least one piece of original data or example per 400 words, no paragraph over 75 words, intro paragraph contains the primary keyword in the first 100 words. Deterministic, ~10ms per draft.

## The eval harness

The pipeline gates are the eval harness, mostly. Two additional checks at the pipeline level.

**Pipeline check 1 — Gate calibration drift.** Monthly, sample 30 drafts that passed all four gates and have the editor independently rate them on a 1-5 scale. If the mean editor rating drops below 4.0, one of the gates has drifted (most often the voice rubric). Recalibrate against fresh examples.

**Pipeline check 2 — Repair-cycle distribution.** Track the distribution of how many repair cycles each brief required. If the median is climbing (say, from 0 to 1 to 1.5 over months), the briefs are getting weaker or the prompt is being implicitly weakened by drift in the model provider's behaviour. Re-run the prompt against the previous month's strongest briefs to see if the issue is brief quality or pipeline quality.

## The failure modes

**Briefs aren't briefs.** Teams often try to start the pipeline with a topic and a deadline. The pipeline refuses by design — without the must-include facts, the differentiation hook, and the voice reference, the gates can't score against anything meaningful. Train the team that the brief is the work; the drafting is the easy bit.

**Editor over-edits.** Even with a passing draft, editors sometimes feel the need to mark it up to justify their value. This is human. Combat with a "minimum 15-minute review" rule and a feedback loop: the editor's actual edits get diffed against the pipeline output, and edits that don't improve the gate scores are visible. Doesn't shame the editor — but does focus them.

**Gate 3 over-fails.** If your target SERP is dominated by very similar pages, your draft's originality score has nowhere to be unique without going off-topic. This is a signal the cluster strategy is wrong (see the SEO cluster playbook), not that the drafting is bad.

**Gate 2 false positives.** Some grounding checks fail on phrasing ambiguity — "research shows X" gets flagged when the brief contains the research but the draft didn't attribute. Fix in the drafter prompt: every claim must be phrased with the attribution carrier ("the brand's 2024 survey of 1,200 marketers showed X"). Cleaner writing AND passes the gate.

**Model provider updates break the gates.** When a provider ships a new default model version, the voice rubric pass rate can swing. We pin model versions in the drafter call and only update after re-running the eval suite against the previous month's drafts. This adds discipline; teams that just use "claude-4.5" without pinning a sub-version eat the drift.

**Gate 4 turns into a rule book.** Once teams see the structural gate, they over-correct. Every page becomes "intro, then 4 H2s, then a conclusion." Avoid by treating the gate thresholds as floors, not patterns. The drafter prompt should still emphasise that the structure serves the argument, not the gate.

## The receipts

**Publishing, scale-stage.** Editorial team was shipping 8 long-form pieces a month and spending 14 hours per piece on editing. Pipeline took drafts to passing-gates in 2-3 cycles, editor time dropped to 4 hours per piece. Same standard, judged by an independent reader panel on a blind comparison. Team is now shipping 18 pieces a month with no headcount increase.

**B2B SaaS, growth-stage.** Brand was burning out a single in-house writer. Pipeline replaced 70% of the drafting workload. The writer now owns the briefs and the final 30 minutes of polish per piece. Output went from 4 pieces a month to 9, retention of the writer improved markedly. The pipeline didn't replace the writer — it replaced the soul-crushing first-draft work.

**Marketplace, partial-success engagement.** Pipeline shipped, gates calibrated, output strong. Two quarters in, the brand brought in a new editor who didn't trust the gates and re-edited everything to their personal taste, dropping the throughput back to pre-pipeline levels. The pipeline still ran; the human stopped honouring it. Lesson: the gates only work if the team agrees to trust them when they pass. Train the editor on what each gate actually measures so they understand what's already been checked.
