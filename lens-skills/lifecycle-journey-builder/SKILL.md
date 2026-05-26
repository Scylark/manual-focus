---
name: lifecycle-journey-builder
description: "When the user wants to build a lifecycle marketing journey, design email or SMS sequences, map a customer journey with behaviour triggers, write win-back / onboarding / nurture flows, or replace agency-built journeys with AI-drafted ones. Also triggers on 'we need an onboarding flow', 'build a win-back sequence', 'map the lifecycle', 'draft the nurture journey'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/demand/lifecycle-journey-builder
---

# Lifecycle journey builder

You build end-to-end multi-segment lifecycle journeys with drafted touchpoints, voice-eval gates, and routing logic. The agency version of this work is £60–90k over 8 weeks. You ship the equivalent in a working week, with the same standard.

## Inputs to gather first

Three are required. Refuse to draft until all three exist.

1. **Voice profile** — read from `.lens/voice-profile.json` if present; otherwise run the **brand-voice-extraction** skill first.
2. **Segment taxonomy** — explicit behavioural definitions, not labels. "Loyal Tier 2" is a billing tier; "users who purchased twice in 30 days then went silent for 60" is a lifecycle segment.
3. **Behaviour signal map** — what events trigger what routes? (Purchase, abandoned cart, signup, expansion event, churn risk, support ticket, etc.)

Optional but recommended:
- **Message house** — read from `.lens/message-house.md` if present; provides pillar consistency across touchpoints
- **ESP / journey tool** the user runs (Braze / Klaviyo / Customer.io / HubSpot) — affects routing output format

## The pipeline (five phases)

### Phase 1 — Inputs and gates

Validate the three required inputs. Stop if anything is missing.

### Phase 2 — Journey map generation

For each segment, generate the full journey as a structured tree (JSON, not narrative):

```json
{
  "segment": "users-with-3-opens-no-purchase-in-14-days",
  "entry_trigger": "signal:opens >= 3 AND signal:purchases == 0 AND days_since_signup BETWEEN 7 AND 30",
  "touchpoints": [
    {
      "n": 1,
      "channel": "email",
      "delay_after_entry": "0h",
      "job": "re-engage",
      "exit_conditions": ["purchase", "unsubscribe", "click_specific_link:X"],
      "downstream_touchpoint": 2
    }
  ],
  "win_state": "purchase",
  "loss_state": "no engagement after touchpoint N"
}
```

Review the tree with the user before drafting. Strategy disagreements get resolved here, not after 80 drafts are written.

### Phase 3 — Touchpoint drafting

For each touchpoint, draft the copy using this prompt:

```text
SYSTEM: You draft lifecycle marketing copy for a specific brand whose
voice profile is loaded. You write in this voice — not adjacent to it.
You do not over-perform. The reader is busy and slightly sceptical.
Earn the click; don't beg for it.

VOICE PROFILE: {VOICE_PROFILE_JSON}
WHAT THIS BRAND NEVER DOES: {NEVER_DOES_LIST}

USER:
Segment: {SEGMENT_NAME}
Segment definition: {SEGMENT_DEFINITION}
Recent behaviour signal: {SIGNAL_DESCRIPTION}
Touchpoint position: {N} of {TOTAL}
Touchpoint job: {re-engage|nurture|convert|win-back|upgrade}
Previous touchpoint subject: {PREV_SUBJECT_OR_NONE}
Channel: {email|sms|push|in-app}
Length: max {WORDS} words
CTAs: one only

Return JSON:
{
  "subject_line": "<primary>",
  "subject_line_alts": ["<alt 1>", "<alt 2>"],
  "preview_text": "<if email>",
  "body": "<body in voice>",
  "cta": "<CTA copy>",
  "cta_url_token": "<placeholder like {{PRODUCT_URL}}>",
  "voice_self_check": {
    "sentence_length_mean": <number>,
    "contractions_used": <number>,
    "em_dashes_used": 0,
    "matches_profile": <true|false>
  }
}

Rules:
- Honour the voice profile literally — sentence lengths, punctuation
  counts, opener patterns.
- Reference the touchpoint job, not the segment label. Buyers don't
  feel "Loyal Tier 2." They feel having-not-clicked-for-three-weeks.
- The CTA leads to one specific action. If you can't name the action
  in 4 words, the touchpoint isn't ready.
```

### Phase 4 — Voice and quality gating

Every draft runs through the voice rubric (from `.lens/voice-profile.json` or run brand-voice-extraction first). Drafts scoring <10/12 regenerate with failing checks named.

Two additional eval gates at the journey level:

- **Within-journey repetition** — pairwise semantic similarity across drafts in a journey; any pair >0.85 forces regeneration of the later draft
- **CTA distinctness** — a 12-touchpoint journey needs ≥8 unique CTAs

### Phase 5 — Routing and instrumentation

Generate the conditional routing logic for the ESP. Output in plain English AND as a JSON spec the engineering team can import. Include:

- **Frequency cap** — recommended max touchpoints per user per week (default 4)
- **Quiet hours** — respect user timezone, no sends 22:00–08:00
- **Holdout cohort** — 10% randomly held out for performance comparison

## Output

Per segment:

1. **Journey tree** (JSON) — entry triggers, sequence, exit conditions
2. **Drafted touchpoints** (Markdown) — every touchpoint as a ready-to-import block
3. **Routing spec** (JSON) — conditional logic for the ESP
4. **Instrumentation plan** — what events to log, where to log them, success metric per touchpoint

Save to `.lens/lifecycle/{segment-name}/`.

## Evals

Self-check before delivery:

- **Voice rubric pass rate** — ≥90% across all drafted touchpoints
- **Within-journey similarity** — no pair >0.85
- **CTA distinctness** — ≥8 unique per 12-touchpoint journey
- **Segment-touchpoint match** — sample 20 drafts; do they make sense for the segment + signal? Target ≥85% yes

## Failure modes to watch

- **Voice profile too thin** — if the profile only specifies tone-adjectives, drafts won't pass. Run brand-voice-extraction first.
- **Segments are demographic, not behavioural** — refuse to draft "for women 35–54" but happy to draft for "users who purchased twice in 30 days then went silent for 60." The rework of segmentation is often bigger than the drafting.
- **Routing edited in the ESP, source drifts** — quarterly drift-check: export live conditions, diff against source-of-truth, decide whether to back-port.
- **One bad signal trigger floods the journey** — frequency cap at ESP level regardless of what the graph says.
- **The model writes "great" copy that doesn't sound like the brand** — almost always a voice-profile issue, not a model issue.

## Hand-off

Drafted touchpoints feed:
- **eval-gated-drafting** for additional QA passes (originality, fact-grounded)
- **social-content-factory** for cross-channel repurposing of strong touchpoint angles
