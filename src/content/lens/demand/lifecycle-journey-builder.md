---
title: "Lifecycle journey builder with eval-gated touchpoints"
stack: demand
description: "Map a multi-segment lifecycle journey, generate every touchpoint with brand-voice gating, route by behaviour signal. Replaces three weeks of agency work."
outputs: "End-to-end journey, drafted touchpoints, evaluation rubric, routing logic"
readMin: 13
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["email", "lifecycle", "paid-social"]
models: ["claude-4.5-sonnet", "gpt-5", "claude-4.5-opus"]
publishedAt: 2026-04-29
status: live
preview: false
---

## The brief

Lifecycle marketing is where good intent dies. Every team has the same problem: a "journey map" sitting in a Miro board with 80 touchpoints sketched, three of which actually exist. The agency engagement to build the other 77 quotes at £60-£90k and 8 weeks, and at the end you get drafts that have to be voice-edited anyway because the agency briefer never had access to the brand's full corpus.

This playbook builds the full journey in a working week. The pipeline ingests the brand's voice profile, the segment definitions, and the behaviour signal taxonomy. It outputs every touchpoint as a first-draft that passes the brand voice eval, routes by behaviour signal, and includes the evaluation rubric so the in-house team can keep building without breaking the system later.

The agency-quality version of this work still has a role — for the strategic shape of the journey, the segmentation logic, the win-condition definitions. But the production-line draft writing is the part AI does better and faster than a contracted copywriter who doesn't know the brand.

## The pipeline

Five phases.

**Phase 1 — Inputs and gates.** Confirm three inputs exist before the pipeline runs: a voice profile (from the brand-voice-extraction playbook or equivalent), a segment taxonomy with explicit definitions (not just "VIPs"), and a behaviour-signal map (what events trigger what routes). If any is missing, the pipeline pauses and prompts to build it — there's no draft that survives without these.

**Phase 2 — Journey map generation.** For each segment, generate the full journey: trigger entry, touchpoint sequence, exit conditions, win/loss states. The model outputs a structured journey tree — JSON, not narrative — that can be reviewed before any drafting starts. This is the cheap, fast pass. Strategy disagreements get resolved here, not after 80 drafts are written.

**Phase 3 — Touchpoint drafting.** For each touchpoint in the approved tree, draft the content. The draft prompt loads the voice profile, the segment context, the touchpoint's job (re-engage / nurture / convert / win-back), the upstream and downstream touchpoints (so it doesn't repeat content), and a length constraint per channel. Outputs draft + alternative-line options.

**Phase 4 — Voice and quality gating.** Every draft runs through the voice-eval rubric (the same one from the brand-voice playbook). Drafts that score below the threshold get regenerated. Drafts above the threshold proceed to the team review.

**Phase 5 — Routing and instrumentation.** Generate the conditional routing logic for the ESP / journey tool (Braze, Klaviyo, Customer.io, HubSpot, whichever). The pipeline outputs the conditions in plain English and as a JSON spec the engineering team can import.

## The prompts

The drafting prompt is the workhorse. This is the version that consistently passes the voice-eval gate.

```text
SYSTEM: You draft lifecycle marketing copy for a specific brand whose
voice profile is loaded below. You write in this voice — not adjacent to
it. You do not over-perform — no jokes that wouldn't survive a hangover,
no rhetorical flourishes that aren't in the profile. The reader is busy
and slightly sceptical. Earn the click; don't beg for it.

VOICE PROFILE:
{VOICE_PROFILE_JSON}

WHAT THIS BRAND NEVER DOES:
{NEVER_DOES_LIST}

USER:
Segment: {SEGMENT_NAME}
Segment definition: {SEGMENT_DEFINITION}
Recent behaviour signal: {SIGNAL_DESCRIPTION}
Touchpoint position: {N} of {TOTAL} in this journey
Touchpoint job: {JOB}  // re-engage | nurture | convert | win-back | upgrade
Previous touchpoint subject: {PREV_SUBJECT_OR_NONE}
Channel: {email | sms | push | in-app}
Constraints:
  - Subject line max 50 chars (email) or 80 chars (push)
  - Body max {WORDS} words
  - One CTA only
  - No exclamation marks unless profile permits

Return JSON:
{
  "subject_line": "<primary>",
  "subject_line_alts": ["<alt 1>", "<alt 2>"],
  "preview_text": "<if email>",
  "body": "<the body in voice>",
  "cta": "<the CTA copy>",
  "cta_url_token": "<placeholder like {{PRODUCT_URL}} or {{ACCOUNT_URL}}>",
  "voice_self_check": {
    "sentence_length_mean": <number>,
    "contractions_used": <number>,
    "em_dashes_used": 0,
    "matches_profile": <true | false>
  }
}

Rules:
- Honour the voice profile literally — sentence lengths, punctuation
  counts, opener patterns.
- Reference the touchpoint job, not the segment label. Buyers don't
  feel "Loyal Tier 2." They feel having-not-clicked-for-three-weeks.
- The CTA leads to one specific action. If you can't name the
  action in 4 words, the touchpoint isn't ready.
```

The full prompt library (with templates for win-back, upgrade-prompt, abandoned-cart, post-purchase-onboard, and seven others) ships with the playbook download.

## The eval harness

The pipeline is gated against five failure modes.

**Eval 1 — Voice rubric pass rate.** Every drafted touchpoint runs through the voice-eval rubric from the brand-voice playbook. Pass rate target: 90%+. Below 80% means the voice profile and the drafting prompt are misaligned — usually the profile has rules the drafting prompt doesn't reference.

**Eval 2 — Within-journey repetition check.** Compute pairwise semantic similarity across all drafts within a single journey. Any pair scoring above 0.85 similarity is too close — the drafter has repeated itself. Regenerate the later touchpoint with an explicit "do not echo touchpoint N" constraint.

**Eval 3 — CTA distinctness.** Across a journey, count unique CTAs. A 12-touchpoint journey with 3 unique CTAs is a journey with 4x the same email. Target: at least 8 unique CTAs per 12-touchpoint journey.

**Eval 4 — Segment-touchpoint match.** Sample 20 drafts and human-rate whether the draft makes sense for the segment + signal combination. Target: 85%+ "yes" rate. Below that, the segment definitions need sharpening — the model can't write for "engaged users" but it can write for "users who opened 3+ emails in the last 14 days but haven't purchased."

**Eval 5 — Holdout cohort.** Once the journey ships, randomly hold out 10% of the segment as a "no contact" control. Compare conversion at 30 / 60 / 90 days. If the holdout converts within 10% of the treated group, the journey isn't actually doing the work, and the pipeline has nothing to do with it — that's a strategy problem.

## The failure modes

**Voice profile too thin.** A profile that only specifies tone-adjectives ("warm, knowledgeable") won't pass the voice eval at any meaningful rate. The drafting pipeline needs the observable patterns from the brand-voice playbook (sentence length, punctuation counts, opener patterns, never-does list). If the profile isn't that detailed, run the extraction playbook first.

**Segments are demographic, not behavioural.** "Premium subscribers" is a billing tier, not a lifecycle segment. The drafter handles behavioural segments ("users who purchased twice in 30 days then went silent for 60") much better than demographic ones ("women 35-54") because the touchpoint job is naturally clearer. If your segmentation is demographic, the work to redo segmentation often dwarfs the work to draft the journey.

**Routing logic gets edited in the ESP and the pipeline doesn't know.** Lifecycle teams routinely tweak the journey conditions in the ESP after launch. The pipeline doesn't see those tweaks unless you re-import. Build a quarterly drift-check ritual: export the live conditions, diff against the original spec, decide whether to back-port to the source-of-truth.

**The model writes "great" copy that doesn't sound like the brand.** This is the single most common complaint and it's almost always a sign the voice profile is set up wrong (see failure #1). The model isn't to blame. The profile is.

**One bad signal trigger floods the journey.** A poorly-defined behaviour signal can flood a segment with 12 emails in a week. Always run a 7-day frequency cap at the ESP level, regardless of what the journey graph says. The pipeline outputs a recommended cap; honour it.

## The receipts

**B2B SaaS, scale-stage.** Brand had 4 active lifecycle journeys, all generic, written by a contractor in 2023. Pipeline rebuilt 8 journeys across the lifecycle (onboarding, expansion, retention, win-back, plus four product-specific). Build took 6 days. Trial-to-paid conversion up 11% within the first quarter. The unlock wasn't better copy — it was finally having behaviour-routed paths that didn't exist before.

**D2C, growth-stage.** Brand had a post-purchase journey of 5 emails, all sent at fixed intervals. Pipeline rebuilt it as 14 touchpoints across email + SMS, routed by product category, purchase amount and behaviour signals. Repeat-purchase rate at 90 days up 23%.

**Marketplace, retired engagement.** Pipeline V1 was used to draft a winback journey for an audience the brand had under-defined. The segment "lapsed users" turned out to mean five different things to five different teams. We drafted to one of those meanings; the team launched to all five. Performance was indistinguishable from no-touch. V2 of the pipeline now refuses to draft until segment definitions pass an objective-statement test. Lesson: the pipeline can't fix unclear strategy. It can only make unclear strategy ship faster.
