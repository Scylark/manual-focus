---
title: "Lifecycle journey builder with eval-gated touchpoints"
stack: demand
description: "Map a multi-segment lifecycle journey, draft every touchpoint with voice gating, route by behaviour signal, ship in a working week. Replaces three weeks of agency work."
outputs: "End-to-end journey graph, drafted touchpoints, voice eval rubric, ESP routing spec"
readMin: 22
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["email", "lifecycle", "paid-social"]
models: ["claude-4.5-sonnet", "gpt-5", "claude-4.5-opus"]
publishedAt: 2026-04-29
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts:

1. A **journey graph** per behavioural segment with trigger entry, touchpoint sequence, exit conditions, win and loss states, expressed as JSON the engineering team can import and the marketing team can read.
2. A **library of drafted touchpoints** (typically 40 to 120 per journey set) each with subject, preview, body, CTA copy and CTA URL token, all having passed the voice-eval rubric.
3. A **within-journey repetition report** with pairwise semantic similarity scores so the team can see where the journey is repeating itself.
4. A **conditional routing spec** in plain English and as a JSON spec the engineering team can import directly into Braze, Klaviyo, Customer.io or HubSpot.
5. A **holdout-cohort instrumentation plan** so the team can measure the journey's actual lift against a no-contact control at 30, 60 and 90 days.

## Who this is for

A growth or scale-stage brand with at least one ESP or journey tool already in production, a voice profile (from the brand-voice-extraction playbook or equivalent) with observable patterns rather than just adjectives, and a segment taxonomy that is behavioural rather than demographic. If the brand cannot define "engaged user" beyond "they read the emails," the strategy work is what is missing and the journey builder cannot fix that.

## Before you start

- [ ] A voice profile with sentence-length, contraction, opener and punctuation patterns documented (not just "warm, knowledgeable")
- [ ] A segment taxonomy with explicit definitions (e.g. "purchased in the last 90 days then opened fewer than 2 emails in the last 30")
- [ ] A behaviour-signal map identifying which events the ESP captures (purchase, browse, abandon, open, click, race entry, training-platform sync)
- [ ] Access to your ESP at admin level (Klaviyo Owner, Braze admin, HubSpot Marketing Hub admin, Customer.io Workspace admin)
- [ ] A test segment of 200 to 1,000 users you can launch into without exposing the brand to a bad first journey
- [ ] Claude Opus 4.5, GPT-5 or Claude Sonnet 4.5 with structured-output mode
- [ ] Two hours of engineering time to import the JSON routing spec into the ESP

If the voice profile, the segment taxonomy or the signal map is missing, build the missing one before this playbook runs. The drafts will not survive without all three.

## The pipeline

Five phases. End-to-end in a working week if the inputs are sharp. Phase 2 (journey graph) takes a day, Phase 3 (drafting) takes two, Phase 4 (gating) a half, Phase 5 (routing) the rest.

### Phase 1, inputs validation

Refuse to start without the three inputs.

**Step 1.1, paste the inputs into the validator prompt.**

```text
SYSTEM: You validate the inputs for a lifecycle journey-builder
pipeline. You reject inputs that are too vague to produce shippable
drafts. You return a pass, conditional or fail verdict with specific
gaps.

USER:
Voice profile: {PASTE_VOICE_PROFILE}
Segment taxonomy: {PASTE_SEGMENTS_WITH_DEFINITIONS}
Behaviour-signal map: {PASTE_SIGNAL_MAP}

Return JSON:

{
  "verdict": "<pass | conditional | fail>",
  "checks": [
    {"id": "V1", "name": "voice profile has observable patterns", "result": "<pass | fail>"},
    {"id": "V2", "name": "segments are behavioural, not demographic", "result": "<pass | fail>"},
    {"id": "V3", "name": "signal map identifies trigger events", "result": "<pass | fail>"},
    {"id": "V4", "name": "exit and win conditions defined", "result": "<pass | fail>"}
  ],
  "missing_inputs": ["<specific gap>"]
}

Rules:
- "conditional" if 3 of 4 checks pass.
- "fail" if 2 or fewer pass. Do not produce drafts from a fail.
- Voice profile must include sentence-length, contraction and
  opener patterns to count as having observable patterns.
- Segments must include behavioural conditions to count.
```

You should now have a verdict. If conditional or fail, the gaps are your edit guide before continuing.

### Phase 2, journey graph generation

Generate the structural shape of each segment's journey before any drafting happens. Strategy disagreements get resolved here, cheaply, before 80 drafts are written.

**Step 2.1, run the graph prompt per segment.**

```text
SYSTEM: You generate a lifecycle journey graph for a behavioural
segment. The graph specifies trigger entry, touchpoint sequence, exit
conditions and win or loss states. You return the graph as JSON the
engineering team can import.

USER:
Segment name: {SEGMENT_NAME}
Segment definition: {SEGMENT_DEFINITION}
Available behaviour signals: {SIGNAL_LIST}
Channels available: {CHANNELS_LIST}
Job to be done in this journey: {JOB}  # onboard | nurture | convert | re-engage | win-back | upgrade | retain

Return JSON:

{
  "segment": "<name>",
  "trigger_entry": "<signal that adds users to this journey>",
  "exit_conditions": ["<signals that remove users>"],
  "touchpoints": [
    {
      "id": "T01",
      "channel": "<email | sms | push | in-app>",
      "delay_after_previous": "<duration, e.g. 24h, 3d>",
      "job": "<short description>",
      "routing_condition": "<the signal or state that triggers this touchpoint>",
      "next_touchpoint_if_engaged": "<id or null>",
      "next_touchpoint_if_no_engagement": "<id or null>"
    }
  ],
  "win_state": "<the action that ends the journey successfully>",
  "loss_state": "<the action that ends the journey unsuccessfully>",
  "max_journey_duration": "<duration cap>"
}

Rules:
- 6 to 14 touchpoints per journey.
- Every touchpoint has a clear job.
- Exit conditions named explicitly. No silent journeys.
- Routing condition for every touchpoint after T01.
- max_journey_duration caps even the longest path.
```

**Step 2.2, review the graphs with the lifecycle lead.**

A 60-minute call to walk through each segment's graph. The lifecycle lead edits the graphs live where touchpoints are missing or out of order. Approval gates the drafting in Phase 3.

You should now have approved graphs per segment that the team agrees represent the right journey shape.

### Phase 3, touchpoint drafting

For each touchpoint in the approved graphs, draft the content.

**Step 3.1, run the drafting prompt per touchpoint.**

```text
SYSTEM: You draft lifecycle marketing copy for a specific brand whose
voice profile is loaded below. You write in this voice, not adjacent
to it. You do not over-perform, no jokes that would not survive a
hangover, no rhetorical flourishes that are not in the profile. The
reader is busy and slightly sceptical. Earn the click, do not beg
for it.

VOICE PROFILE:
{VOICE_PROFILE_JSON}

WHAT THIS BRAND NEVER DOES:
{NEVER_DOES_LIST}

USER:
Segment: {SEGMENT_NAME}
Segment definition: {SEGMENT_DEFINITION}
Recent behaviour signal: {SIGNAL_DESCRIPTION}
Touchpoint position: {N} of {TOTAL} in this journey
Touchpoint job: {JOB}
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
- Honour the voice profile literally, sentence lengths, punctuation
  counts, opener patterns.
- Reference the touchpoint job, not the segment label. Buyers do
  not feel "Loyal Tier 2." They feel having-not-clicked-for-three-
  weeks.
- The CTA leads to one specific action. If you cannot name the
  action in 4 words, the touchpoint is not ready.
```

**Step 3.2, run the prompt across all touchpoints in batch.**

Most teams batch the drafts through Claude or GPT-5 with parallel calls. Save each draft to a structured JSON file or to a Notion database row.

You should now have a draft per touchpoint, ready for the voice gate.

### Phase 4, voice and quality gating

Every draft runs through the voice-eval rubric before it ships.

**Step 4.1, run the voice eval.**

```text
SYSTEM: You evaluate a drafted lifecycle touchpoint against a voice
profile. You return pass, fail or borderline, with the failing checks
named explicitly.

USER:
Voice profile: {VOICE_PROFILE_JSON}
Banned words list: {BANNED_WORDS}
Draft to evaluate: {PASTE_DRAFT_JSON}

Return JSON:

{
  "verdict": "<pass | borderline | fail>",
  "checks": [
    {"name": "sentence_length_within_band", "result": "<pass | fail>", "actual": <number>},
    {"name": "contraction_rate_within_band", "result": "<pass | fail>"},
    {"name": "no_banned_words", "result": "<pass | fail>"},
    {"name": "opener_matches_profile", "result": "<pass | fail>"},
    {"name": "no_em_dashes_or_exclamations_unless_permitted", "result": "<pass | fail>"},
    {"name": "cta_is_one_specific_action", "result": "<pass | fail>"}
  ],
  "rewrite_suggestion": "<one sentence on what to change if borderline>"
}

Rules:
- "fail" if any single check fails.
- "borderline" if all checks pass but the prose reads off-voice.
  Note the issue in rewrite_suggestion.
- "pass" only when everything is clean.
```

**Step 4.2, regenerate the failures.**

Drafts that fail the voice eval get regenerated with the failing checks named in the prompt. Drafts that border on pass go to human review.

**Step 4.3, run the repetition check.**

```text
SYSTEM: You compute pairwise semantic similarity across all
touchpoints in a lifecycle journey. You flag pairs above 0.85
similarity. Identical content across touchpoints is the failure mode.

USER:
Journey touchpoints (in order): {PASTE_ALL_DRAFTS_JSON}

Return JSON:

{
  "pairwise_similarity": [
    {"touchpoint_a": "T01", "touchpoint_b": "T05", "similarity": 0.42}
  ],
  "flagged_pairs": [
    {"touchpoint_a": "T03", "touchpoint_b": "T07", "similarity": 0.88, "regenerate": "T07"}
  ],
  "cta_uniqueness_count": <int>,
  "cta_uniqueness_verdict": "<pass | fail>"
}

Rules:
- Flag pairs at 0.85 or above.
- The later touchpoint in a flagged pair is regenerated by default.
- A 12-touchpoint journey should have at least 8 unique CTAs.
```

You should now have a gated draft library and a repetition report.

### Phase 5, routing and instrumentation

Translate the approved graphs into an ESP-importable spec.

**Step 5.1, generate the routing spec.**

```text
SYSTEM: You generate ESP-importable routing logic from a lifecycle
journey graph. You return the routing both in plain English (for the
team) and as a JSON spec the engineering team can import into the ESP.

USER:
Journey graph: {APPROVED_GRAPH_JSON}
Target ESP: {KLAVIYO | BRAZE | CUSTOMER_IO | HUBSPOT}

Return JSON:

{
  "plain_english_routing": "<one paragraph per touchpoint describing the routing>",
  "esp_spec": {
    "trigger": {...},
    "branches": [{...}],
    "exits": [{...}],
    "frequency_cap": {"period_days": 7, "max_touches": <int>}
  }
}

Rules:
- Recommend a 7-day frequency cap as the default safety.
- Routing logic must match the approved graph exactly.
- Use the ESP's native field names where known (Klaviyo properties,
  Braze custom attributes, HubSpot contact properties).
```

**Step 5.2, hand the spec to engineering.**

Two hours of engineering time imports the spec into the ESP, configures the test segment, and sets up the holdout cohort.

**Step 5.3, define the holdout cohort.**

A 10% random holdout of the segment is excluded from the journey. The team compares conversion at 30, 60 and 90 days against the treated 90%. If the holdout converts within 10% of the treated, the journey is not doing the work and the strategy needs revisiting.

You should now have the journey live in the ESP with a holdout cohort instrumented for measurement.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand, scale-stage, rebuilding its post-purchase journey for the Vahla Range.

**Phase 1 output.** Inputs validated. Voice profile is from the brand-voice-extraction playbook (passes V1). Segments are behavioural, defined as "first-purchase Vahla in the last 30 days," "second-purchase Vahla in the last 90 days," "Vahla buyer who has trained on the kit and posted to Strava," "Vahla buyer who has not synced Strava in 60 days" (passes V2). Signals are Stripe purchase event, Strava sync via the brand's integration, Klaviyo email open and click events (passes V3). Win states defined (passes V4). Verdict pass.

**Phase 2 output.** Four segment graphs generated. The first-purchase graph has 11 touchpoints across 90 days, branching on whether the buyer synced Strava in the first 14 days. The lifecycle lead edits two touchpoints during the review call, moving the "first second-loop training run" prompt from day 21 to day 14 because Cascadia's customer research shows the audience trains a second loop sooner than the model assumed.

**Phase 3 output.** 44 touchpoints drafted across the four segments. The drafting prompt produces variations the lifecycle lead can pick from rather than a single take. Sample subject line for the day-14 second-loop touchpoint, "About the second loop." Preview text, "Three things the Vahla audience told us they noticed in week two."

**Phase 4 output.** Voice eval pass rate at 87% on first run. Six drafts fail (mostly sentence-length drift) and regenerate. The repetition check flags two pairs above 0.85, both rewrites of the same milestone prompt at different stages. T09 regenerates with explicit "do not echo T03" instruction and lands at 0.51 similarity on the second pass.

**Phase 5 output.** Routing spec generated for Klaviyo. The engineering team imports the spec in 90 minutes. The first-purchase journey goes live on a 1,200-user test segment. Holdout cohort of 120 users is excluded. At 60 days, the treated cohort shows a 14% lift in second-purchase rate against the holdout. The journey ships to the full segment.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, validate one segment definition

Take your existing "lapsed" or "VIP" segment. Run the Phase 1 validator with just that segment. Read the verdict. If V2 fails (segment not behavioural), rewrite the definition with explicit conditions and re-run. The exercise teaches you the shape of a draftable segment.

### Exercise 2, draft three touchpoints for one segment

Pick a small segment and a clear job (e.g. "first-purchase post-buy onboarding"). Draft three touchpoints through the Phase 3 prompt. Run each through the Phase 4 voice eval. Note which checks fail most. Sentence-length drift and CTA vagueness are the two most common failure modes.

### Exercise 3, build a routing spec for one branch

Take one branch of one journey (e.g. the engaged path through your post-purchase journey). Run the Phase 5 prompt. Read the plain English routing. If the routing reads cleanly to a non-technical reader, the spec is ready for engineering. If the routing has ambiguous "should" or "could" language, sharpen the graph before handing over.

## The eval gates

**Eval 1, voice rubric pass rate.** Every drafted touchpoint runs through the voice-eval rubric. Pass rate target 90%. Below 80% means the voice profile and the drafting prompt are misaligned, usually the profile has rules the drafting prompt does not reference.

**Eval 2, within-journey repetition check.** Pairwise semantic similarity above 0.85 is regeneration territory. Target zero flagged pairs in the final library.

**Eval 3, CTA distinctness.** Across a journey, count unique CTAs. A 12-touchpoint journey with 3 unique CTAs is a journey with four of the same email. Target at least 8 unique CTAs per 12-touchpoint journey.

**Eval 4, segment-touchpoint match.** Sample 20 drafts and human-rate whether the draft makes sense for the segment plus signal combination. Target 85% yes. Below that, the segment definitions need sharpening.

**Eval 5, holdout cohort.** Once the journey ships, hold out 10% randomly. Compare conversion at 30, 60 and 90 days. If the holdout converts within 10% of the treated group, the journey is not doing the work. That is a strategy problem the pipeline cannot fix.

## The failure modes

**Voice profile too thin.** A profile that only specifies tone adjectives ("warm, knowledgeable") will not pass the voice eval at any meaningful rate. The pipeline needs observable patterns. Run the extraction playbook first.

**Segments are demographic, not behavioural.** "Premium subscribers" is a billing tier. The drafter handles behavioural segments ("users who purchased twice in 30 days then went silent for 60") far better than demographic ones because the touchpoint job is naturally clearer. If your segmentation is demographic, the work to redo segmentation often dwarfs the work to draft the journey.

**Routing logic gets edited in the ESP and the pipeline does not know.** Lifecycle teams routinely tweak journey conditions in the ESP after launch. The pipeline does not see those tweaks unless you re-import. Build a quarterly drift check, export the live conditions, diff against the source-of-truth spec, decide whether to back-port.

**The model writes "great" copy that does not sound like the brand.** The single most common complaint. Almost always the voice profile is set up wrong. The model is not to blame, the profile is.

**One bad signal trigger floods the journey.** A poorly defined behaviour signal can flood a segment with 12 emails in a week. Always run a 7-day frequency cap at the ESP level regardless of what the journey graph says. The pipeline outputs a recommended cap, honour it.

## The pattern in practice

Illustrative scenarios that show common shapes journey-builder work takes. Specifics are illustrative and the patterns repeat.

**B2B SaaS, scale-stage, the behaviour-routing unlock.** A brand with a handful of generic lifecycle journeys written years ago. Rebuilding around behaviour-routed paths (onboarding, expansion, retention, win-back, product-specific) typically lifts trial-to-paid conversion within the first quarter. The unlock is finally having paths that respond to what the user has actually done, rather than better copy.

**D2C, growth-stage, the post-purchase rebuild.** A brand with a post-purchase journey of a handful of emails at fixed intervals. Rebuilding as 14 touchpoints across email plus SMS, routed by product category, purchase amount and behaviour signals, typically lifts repeat-purchase at 90 days substantially. Cadence per channel matters, and sequence on top of behaviour matters more.

**Marketplace, the underdefined-segment failure.** A common failure is drafting a winback journey for "lapsed users" without a tight definition. The label means five different things to five different teams. Whichever meaning the draft assumes, when the team launches to all five, performance ends up indistinguishable from no-touch. This is why the current pipeline refuses to draft until segment definitions pass an objective-statement test.

## Hand-off

The journey set feeds:
- **attribution-teardown**, email's contribution shows up cleanly once journeys are routed by behaviour
- **race-day-demand-pipeline**, event-anchored touchpoints sit inside the journey graph at the right week
- **subscription-membership**, member onboarding and renewal flows reuse the drafting and gating
- **direct-to-coach**, coach-acknowledging touchpoints land in the post-purchase journey when the customer came through a coach
