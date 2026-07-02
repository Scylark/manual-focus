---
title: "Eval-gated drafting pipeline"
stack: content
description: "A drafting pipeline that scores its own output against four objective gates before a human sees it. Triples editorial throughput without dropping the standard."
outputs: "Drafting pipeline, scoring rubric, queue routing"
readMin: 15
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["content", "seo", "email"]
models: ["claude-4.5-sonnet", "claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-19
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **structured brief template** the team uses for every piece, refusing to start drafting on a topic and a deadline alone.
2. A **drafting prompt** tuned to the brand's voice, with the structural floors built in so the structural gate has less work to do.
3. **Four scoring gates** running in parallel on every draft, voice match, fact grounded, originality, structural. Each returns a deterministic pass-fail with rationale.
4. A **repair-cycle workflow** that takes failing drafts back to the model with the specific gates named, capped at three cycles before the brief itself is suspect.
5. A **pipeline ledger** logging gate scores, repair counts, editor review time and post-publish performance per piece, so the calibration can be tuned monthly.

## Who this is for

A growth or scale-stage brand publishing two-to-ten pieces a week with an editor who currently spends two hours per piece bringing drafts to ship-ready. If you are shipping one piece a week, the pipeline still works but the throughput gains are smaller than the setup cost. If you have no voice profile and no brief discipline, fix those first.

## Before you start

- [ ] A voice profile from the brand-voice-extraction playbook, with the 12-check rubric formalised
- [ ] A brief template the team can populate (target query, intent, must-include facts with sources, differentiation hook, voice profile reference, length target)
- [ ] CMS access (Webflow, Shopify, WordPress) so drafts route into the publishing flow
- [ ] An embeddings API (OpenAI, Voyage, or Cohere) for the originality check
- [ ] Claude Opus 4.5 or GPT-5 for the heavy lifting, Sonnet 4.5 for the scoring gates
- [ ] A project tool (Notion, Linear, Asana) to host the briefs and the repair-cycle history
- [ ] An editor with the authority to reject the pipeline output and trigger repair

If the brief template does not exist yet, the brand-voice-extraction and seo-cluster-generator playbooks both ship templates the brief can borrow from.

## The pipeline

Six stages. End-to-end in a working week to install. Each piece then runs through the pipeline in 20-to-40 minutes including repair cycles.

### Stage 1, brief intake

The pipeline refuses to start without a structured brief.

**Step 1.1, populate the brief template.**

Every brief carries these fields.

- Target query (the search query or the editorial slug)
- Intent (informational, commercial, transactional, navigational)
- Buyer stage (problem-aware, solution-aware, product-aware, evaluating, decided)
- Must-include facts with sources (a JSON array, each entry has the fact and the source URL or document reference)
- POV anchor (which brand pillar this piece advances, per the message-house-generator)
- Differentiation hook (the credible reason this piece outperforms the SERP)
- Target length (word count target plus a tolerance band)
- Voice profile reference (the slug of the voice profile to use)
- Banned phrases (the brand's no-fly list)
- Internal links out (the sibling pages this piece must link to)

**Step 1.2, run the brief validator.**

```text
SYSTEM: You validate a content brief before it enters the drafting
pipeline. You reject briefs missing any required field. You flag
briefs where the differentiation hook reads as table stakes.

USER:
Brief: {BRIEF_JSON}
Voice profile available: {TRUE_OR_FALSE}
Cluster context (sibling pages and their hooks): {CLUSTER_JSON}

Return JSON:

{
  "verdict": "<pass | fail>",
  "missing_fields": ["<field>"],
  "weak_fields": [
    {"field": "<field>", "rationale": "<one sentence>"}
  ]
}

Rules:
- "fail" if any required field is missing.
- "weak_fields" flags differentiation hooks that already appear in
  sibling pages or are generic ("we have data", "we have experts").
- "pass" requires all fields populated and differentiation hook
  specific enough to be defensible.
```

If the verdict is `fail`, fix the brief before drafting. If the verdict carries weak-field flags, sharpen those fields. Briefs that pass go into Stage 2.

**You should now have** a validated brief ready for drafting.

### Stage 2, first-pass draft

Model writes the draft against the brief and voice profile.

**Step 2.1, run the drafting prompt.**

```text
SYSTEM: You draft long-form content for a specific brand against a
structured brief and a voice profile. You follow the brief exactly.
You ground every factual claim in the supplied sources. You write in
the brand's voice. You do not exceed or undershoot the length target.

USER:
Brief: {BRIEF_JSON}
Voice profile: {VOICE_PROFILE_FULL}
Cluster context (sibling pages, internal links): {CLUSTER_JSON}
Banned phrases: {BANNED_PHRASES}

Draft the piece. Return JSON:

{
  "headline": "<piece headline>",
  "lede": "<one sentence opener>",
  "body_markdown": "<the full body in markdown>",
  "word_count": <int>,
  "internal_links_out": ["<page slug>", "..."],
  "claims_list": [
    {"claim": "<verbatim from draft>", "source_in_brief": "<source ID or null>"}
  ]
}

Rules:
- Word count within the brief's tolerance band.
- Every claim either traces to a brief source or is flagged in
  claims_list with source_in_brief: null.
- Internal links match the brief's required links.
- No banned phrases.
- Voice profile honoured. No exclamation marks, no em dashes, no
  semicolons in prose. Active voice. Editorial tone.
```

**Step 2.2, the draft does not reach a human yet.**

The draft sits in the pipeline. Stage 3 scores it before any editor opens it.

You should now have a first-pass draft and a structured claims list.

### Stage 3, eval gates run in parallel

Four gates run on the draft.

**Gate 1, voice match.** The 12-check voice rubric from brand-voice-extraction. Score 10 of 12 or higher to pass. Deterministic script, around 30 ms per draft.

**Gate 2, fact grounded.** Every factual claim traces to a brief source or is explicitly flagged as needing human verification.

```text
SYSTEM: You verify claims in a draft against the approved sources
in the brief. For each factual claim, you cite the source that
supports it. If no source supports it, you flag.

USER:
Brief sources: {SOURCES_JSON}
Draft claims list: {CLAIMS_LIST_JSON}

Return JSON array, one element per claim:

[
  {
    "claim": "<verbatim>",
    "source_id": "<source ID or null>",
    "supported": <true | false>,
    "needs_human_verify": <true | false>
  }
]

Pass criterion: 95% or more of claims have a source_id or are
explicitly flagged needs_human_verify: true. No silent assertions.
```

**Gate 3, originality.** Embedding similarity check against the top 20 pages currently ranking for the target query. Compute cosine similarity between the draft and each ranking page. Pass if the maximum similarity is below 0.75. Above 0.75 means the draft is restating, not contributing.

**Gate 4, structural.** Deterministic checks. At least one H2 every 250 words. At least one original example or piece of data per 400 words. No paragraph exceeds 75 words. Intro paragraph contains the primary keyword within the first 100 words. Around 10 ms per draft.

You should now have four gate scores per draft.

### Stage 4, repair or promote

**Step 4.1, if all four pass, the draft promotes.**

The draft moves to Stage 5 with a scoring report attached. The editor sees the report when they open the draft.

**Step 4.2, if any gate fails, run the repair prompt.**

```text
SYSTEM: You repair a failing draft by addressing the specific gates
that failed. You preserve passing gate signals while fixing the
failing ones.

USER:
Original brief: {BRIEF_JSON}
Original draft: {DRAFT_MARKDOWN}
Voice profile: {VOICE_PROFILE_FULL}

Failing gates and their findings:
{FAILING_GATES_JSON}

Repair the draft. Address every failing finding. Do not regress on
passing gates.

Return JSON in the same shape as the Stage 2 draft.

Rules:
- Address every finding in the failing gates JSON.
- Do not change paragraphs that passed all gates unless the fix
  requires it.
- If the failing finding requires a fact not in the brief, flag
  claims_list with source_in_brief: null so Stage 3 catches it again.
```

**Step 4.3, cycle limit.**

Maximum three repair cycles. If the draft cannot pass after three, the brief itself is suspect and routes to strategy for review.

You should now have either a passing draft or a brief flagged for strategy review.

### Stage 5, human review

The editor opens the draft with the scoring report attached.

**Step 5.1, the editor reviews against the report.**

The report tells the editor what the gates checked and what passed. The editor's job is the things the gates cannot measure, judgement calls, narrative arc, the paragraph that is smart but too clever. The 12 voice checks are already done. The structural checks are already done. The fact grounding is already done.

**Step 5.2, the editor enforces the 15-minute floor.**

Even with a passing draft, the editor reviews for 15 minutes minimum. The floor prevents skip-and-publish. Editors who finish in 8 minutes are not reading the draft. Editors who spend 45 minutes are re-editing what the gates already settled.

**Step 5.3, the editor approves or repairs.**

Approved drafts publish. Drafts the editor rejects route back to Stage 4 with the editor's notes as a manual failing gate.

You should now have an approved draft ready to publish.

### Stage 6, ship and instrument

**Step 6.1, publish.**

The CMS picks up the markdown. The email platform queues any send referencing this piece. The social scheduler queues the channel cuts.

**Step 6.2, log to the pipeline ledger.**

Every piece logs.

- Brief reference, draft ID, publish date
- Gate scores at each cycle
- Repair count
- Editor's actual review time
- 7-day engagement (page views, time on page, social shares)
- 30-day engagement and ranking position if SEO

**Step 6.3, run the monthly calibration review.**

Once a month, sample 30 drafts that passed all four gates. The editor independently scores each from 1 to 5. If the mean drops below 4.0, a gate has drifted (most often the voice rubric). Recalibrate against fresh examples.

Also track the repair-cycle median. Climbing medians mean the briefs are weakening or the prompt has drifted. Re-run the prompt against the prior month's strongest briefs to diagnose.

You should now have the pipeline running and a monthly calibration cadence.

## Worked example, end-to-end

Cascadia Endurance installed the pipeline ahead of the Vahla Range autumn launch because the content programme needed to triple from three pieces a week to nine and the editor was at capacity.

**Stage 1 output.** Brief for the piece "How to choose trail running shoes" passed the validator. Hook is the decision tree from coach Marcus Hale anchored against Cascadia's wear panel data (n=80 over 18 months). Length target 1,800 words. Voice profile Cascadia v2.4. Banned phrases include "epic", "incredible", "unstoppable" and "level up."

**Stage 2 output.** First-pass draft came in at 1,840 words. Headline "A trail-running shoe decision tree from the Cascadia wear panel." 22 factual claims, 19 with sources in the brief, three flagged as needs-human-verify (those were a stat on UK trail-runner injury rates that did not appear in the brief, and two referenced studies).

**Stage 3 output.** Gate scores. Voice rubric 11 of 12 (pass). Fact grounded 19 of 22 with sources plus three explicitly flagged (pass). Originality maximum similarity 0.61 against the top 20 ranking pages (pass). Structural pass on all four sub-checks. All four gates green.

**Stage 4 output.** Promoted directly to review, no repair cycle needed.

**Stage 5 output.** Editor Maya reviewed for 21 minutes. She tightened two paragraphs where the prose drifted into a slightly academic register, sharpened the H2s, and re-routed two internal links to better-fitting sibling spokes. Approved.

**Stage 6 output.** Published Thursday morning. The piece ranked at position 14 within two weeks, position 8 within six weeks, position 3 within three months. Time on page averaged 4 minutes 12 seconds, well above the Cascadia content baseline of 2 minutes 18.

A sample of the W04 piece's opening, after the editor's polish.

> **A trail-running shoe decision tree from the Cascadia wear panel.**
>
> Most trail-shoe buying advice runs on the reviewer's own gait and the brand sending the review pair. Useful, sometimes. Not what most runners need.
>
> Cascadia spent 18 months tracking 80 UK runners through a single pair each, recorded every run, every blister, every sole-failure event, and what we have is a decision tree that does the work no individual review can do. It starts with your audience tier, then routes through terrain, then through wet weather tolerance, then through how many miles the shoe is asked to carry across the year.

A month after install, Cascadia's editor was running at 22 minutes average review time per piece against the prior baseline of 2 hours 10. Output rose from three pieces a week to nine without quality dropping in the monthly calibration review. The editor moved from drafting work to brief work and to coaching the brand voice across the contracted writers.

## Try it yourself

Three exercises, each takes 20 to 45 minutes.

### Exercise 1, validate a brief you have already written

Take a content brief you have already used. Run the Stage 1 validator prompt on it. Read the verdict. If the verdict is fail or carries weak-field flags, the pipeline would have refused to draft. Edit the brief to address every gap. The exercise teaches you what a publishable brief looks like.

### Exercise 2, run the four gates on a published piece

Take a piece you have already published. Run all four gates on it. The voice gate is your rubric, the fact-grounded gate needs the original brief sources, the originality gate needs the top 20 SERP at the time of publish (or now, if you do not have the snapshot), the structural gate is deterministic. Read the report. Pieces that passed publish should pass the gates. If they do not, the gates need calibration or the piece was over-edited by the editor.

### Exercise 3, run the repair cycle on a failing draft

Take a draft that did not ship (a piece killed at review or a piece you abandoned). Run the gates. Pick the failing gate that bothers you most. Run the repair prompt with that gate named. Read the repair. If the repair fixes the named gate without regressing others, the prompt is calibrated. If the repair drifts in voice or substance, the prompt needs sharpening.

## The eval gates

**Eval 1, voice rubric.** Score 10 of 12 or higher to pass. Sample passing drafts monthly and have the editor independently score. Mean below 4.0 of 5 means the rubric has drifted.

**Eval 2, fact grounded.** 95% or more of factual claims trace to a brief source or are explicitly flagged. Zero silent assertions. Audit weekly.

**Eval 3, originality.** Maximum cosine similarity against the top 20 ranking pages below 0.75. Above means the draft restates rather than contributes. Track over time, rising similarity scores mean the SERP has consolidated and the brand needs sharper hooks.

**Eval 4, structural.** Deterministic. H2 every 250 words, original example or data per 400 words, no paragraph over 75 words, primary keyword in the first 100 words. Hard gate.

**Eval 5, pipeline-level calibration drift.** Monthly sample of 30 passing drafts, editor scores 1 to 5, mean stays above 4.0.

**Eval 6, repair-cycle distribution.** Track median repair cycles per piece. Rising medians mean briefs are weakening or the prompt is drifting under model-provider updates.

## The failure modes

**Briefs are not briefs.** Teams try to start with a topic and a deadline. The pipeline refuses by design. Without must-include facts, the differentiation hook and the voice reference, the gates have nothing to score against. The brief is the work, the drafting is the easy bit.

**Editor over-edits.** Even with a passing draft, editors mark up to justify their value. Combat with the 15-minute review floor and the diff-against-pipeline-output check. Edits that do not improve gate scores are visible. The pattern is feedback, not shame.

**Gate 3 over-fails.** If your target SERP is dominated by very similar pages, your draft has nowhere to be unique without going off-topic. The signal is that the cluster strategy is wrong (see seo-cluster-generator) rather than the drafting.

**Gate 2 false positives.** Some grounding checks fail on phrasing ambiguity. "Research shows X" gets flagged when the brief contains the research but the draft did not attribute. Fix in the drafter prompt, every claim must carry the attribution ("the brand's 2026 wear panel showed X"). Cleaner writing and passes the gate.

**Model provider updates break the gates.** When a provider ships a new default model version, voice rubric pass rate can swing. Pin model versions in the drafter call and only update after re-running the eval suite against the previous month's drafts. Teams using "claude-4.5" without pinning a sub-version eat the drift.

**Gate 4 turns into a rule book.** Once teams see the structural gate, they over-correct. Every page becomes "intro, then four H2s, then a conclusion." Treat gate thresholds as floors rather than patterns. The drafter prompt emphasises structure serves the argument, not the gate.

## The pattern in practice

Illustrative scenarios that show common shapes eval-gated drafting takes. Specifics are illustrative, patterns repeat.

**Publishing, scale-stage, the editor-time reclaim.** An editorial team shipping a handful of long-form pieces a month and spending double-digit hours per piece on editing. With the pipeline, drafts hit passing gates in two-to-three cycles and editor time per piece drops by roughly two-thirds. Same standard, verified by blind reader panel. Output capacity roughly doubles without headcount increase.

**B2B SaaS, growth-stage, the writer-burnout fix.** A brand burning out a single in-house writer with first-draft work. The pipeline replaces most of the drafting workload. The writer owns the briefs and the final polish, the work that needs their judgement rather than soul-crushing first-draft work. Output rises and the writer stays.

**Marketplace, the editor-overrides failure.** A common failure mode is when the pipeline ships, gates calibrate, output is strong, and a new editor joins who does not trust the gates and re-edits everything to personal taste. Throughput drops to pre-pipeline levels. The gates only work if the team agrees to trust them when they pass. Train the editor on what each gate measures so they understand what is already checked.

## Hand-off

The drafting pipeline feeds:
- **seo-cluster-generator**, the cluster briefs feed the drafting pipeline page by page
- **training-content-engine**, training pieces route through the standard pipeline plus the three coaching gates
- **race-result-content-engine**, race recaps route through a shortened pipeline because the brief is the result feed
- **social-content-factory**, channel-native cuts repurpose the long-form output
- **lifecycle-journey-builder**, email touchpoints draw from published pieces
