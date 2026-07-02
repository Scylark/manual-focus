---
title: "Message house generator from positioning brief"
stack: brand
description: "Turn a positioning brief into a four-tier message house in one day. Narrative, pillars, proof points, channel-mapped lines, plus a rebuttal sheet for the 12 hardest pushbacks."
outputs: "Message house, channel-mapped lines, rebuttal sheet, refresh checklist"
readMin: 16
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content", "product-marketing"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-15
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **message house**, the four-tier document with one narrative sentence at the top, three to five pillars beneath, three to five proof points per pillar, and channel-mapped lines per pillar.
2. A **channel-mapped lines sheet**, twelve to twenty short copy artefacts (landing-page H1, email subject, social caption, sales talking points) per pillar, ready to drop into briefs.
3. A **rebuttal sheet**, the eight to twelve hardest pushback questions a sceptic will ask, each with a one-paragraph response grounded in the proof points.
4. A **quarterly refresh checklist**, the rule for what to refresh (channel lines) and what to leave alone (narrative, pillars), so the message house stays a living document.

## Who this is for

A growth or scale-stage brand with a positioning brief that is one sentence sharp, three to five proof points defensible, and an audience definition that is more specific than "marketers" or "athletes." If your positioning brief is still vague, run the positioning-audit-pipeline first. The message house cannot sharpen what the positioning has not.

## Before you start

- [ ] A completed positioning brief, see positioning-audit-pipeline or your equivalent
- [ ] A list of three to five proof points with sources (data, customer story, partnership, technical claim)
- [ ] An audience definition with specifics (sport, level, life-stage, buying context)
- [ ] A "what-not-this" list, the categories the brand is explicitly not in
- [ ] A voice profile from the brand-voice-extraction playbook (used in Phase 4 to constrain the channel lines)
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode

If you do not have all six, the message house will collapse to vibes. Either go get them, or accept that the output is a draft for review rather than a shippable artefact.

## The pipeline

Four phases. One working day end-to-end if the inputs are sharp.

### Phase 1, inputs validation

Refuse to start with a vague brief. Vague briefs produce vague message houses, and the brand pays for them at every drafting moment forever after.

**Step 1.1, paste the brief into the validator prompt.**

```text
SYSTEM: You validate a positioning brief before it enters the message
house pipeline. You reject briefs that are too vague to constrain
drafting. You return a pass/fail verdict and specific gaps.

USER:
Positioning brief: {POSITIONING_BRIEF}
Proof points: {PROOF_POINTS_LIST}
Audience: {AUDIENCE_DEFINITION}
What-not-this: {WHAT_THE_BRAND_IS_NOT}

Return JSON shaped like:

{
  "verdict": "<pass | conditional | fail>",
  "checks": [
    {
      "id": "C1",
      "name": "positioning sentence specificity",
      "result": "<pass | fail>",
      "rationale": "<one sentence>"
    }
  ],
  "missing_inputs": ["<specific things to add before re-running>"]
}

Validation checks:
- Positioning sentence under 25 words, names the audience, names the
  benefit, names the category or the contrast.
- 3+ proof points, each traceable to a source.
- Audience definition includes at least 3 specifiers (sport,
  level, life-stage, or buying context).
- What-not-this names at least 2 specific categories the brand is not.

Rules:
- "conditional" verdict if 3 of 4 checks pass.
- "fail" verdict if 2 or fewer pass. Do not produce a message house
  from a fail.
```

**Expect output like:**

```json
{
  "verdict": "pass",
  "checks": [
    {"id": "C1", "name": "positioning sentence", "result": "pass", "rationale": "Names trail runners, names season-survival benefit, contrasts lightweight category."},
    {"id": "C2", "name": "proof points traceable", "result": "pass", "rationale": "Four proof points, all with named sources."},
    {"id": "C3", "name": "audience specificity", "result": "pass", "rationale": "Sport (trail), level (recreational to mid-pack racer), life-stage (working adult with limited training hours)."},
    {"id": "C4", "name": "what-not-this", "result": "pass", "rationale": "Excludes road-running apparel and elite-only kit."}
  ],
  "missing_inputs": []
}
```

If the verdict is `conditional`, fill the gaps and re-run. If `fail`, stop and revisit positioning.

**You should now have** a validated brief and a green light to enter Phase 2.

### Phase 2, narrative and pillar drafting

The narrative is the one sentence the brand wants in the head of every reader. The pillars are the three to five arguments that make the narrative true.

**Step 2.1, run the pillar prompt.**

The model returns three alternative pillar structures. The team picks one in a thirty-minute review.

```text
SYSTEM: You generate brand-pillar candidates from a positioning
brief. Pillars are claim-shaped arguments the brand is making, not
organisational categories. No "Product", "People", "Process" as
pillars. Each pillar must be defensible against a sceptic. You
return three alternative pillar structures so the team can pick one.

USER:
Positioning brief: {POSITIONING_BRIEF}
Audience: {AUDIENCE_DEFINITION}
What-not-this: {WHAT_THE_BRAND_IS_NOT}
Proof points the brand can cite: {PROOF_POINTS_LIST}
Voice profile (short summary): {VOICE_PROFILE_SHORT}

Return JSON shaped like:

{
  "narrative_sentence": "<one sentence subsuming the positioning>",
  "structures": [
    {
      "name": "<short label, e.g. 'capability-led'>",
      "pillars": [
        {
          "claim": "<one-sentence claim, falsifiable>",
          "anchored_to": ["<which proof point this pillar leans on>"]
        }
      ]
    }
  ]
}

Rules:
- 3 alternative structures.
- 3 to 5 pillars per structure.
- Pillars must be claims, not nouns. "The work compounds because we
  own the full pipeline" is a pillar. "Pipeline" is not.
- Every pillar anchored to at least one supplied proof point.
- No marketing hyperbole. Sceptic-readable.
- Match the voice profile, no exclamation marks, no banned words.
```

**Expect output like:**

```json
{
  "narrative_sentence": "Trail-running kit that survives the season, season after season.",
  "structures": [
    {
      "name": "durability-led",
      "pillars": [
        {"claim": "The kit is engineered for the second loop, not the launch shoot.", "anchored_to": ["48-month wear-test data", "two-year guarantee"]},
        {"claim": "Recreational and mid-pack runners get materials the elite category usually keeps.", "anchored_to": ["membrane spec comparison", "athlete partnership pattern"]},
        {"claim": "Repair is cheaper than replacement, and the brand pays for it.", "anchored_to": ["lifetime repair programme uptake"]}
      ]
    },
    {
      "name": "season-led",
      "pillars": [...]
    },
    {
      "name": "community-led",
      "pillars": [...]
    }
  ]
}
```

**Step 2.2, the pick session.**

A thirty-minute call with the marketing lead, the head of product and ideally the founder. Read the three structures. Pick one. Edit the pillar claims live where the wording is off. Do not vote, the founder or marketing lead makes the call.

**You should now have** a chosen narrative sentence and three to five pillar claims, all written down.

### Phase 3, proof point expansion

The proof points listed in the brief are the seed set. Each pillar gets three to five proof points across data, customer story, partnership and technical claim.

**Step 3.1, run the proof-point expansion prompt.**

```text
SYSTEM: You expand each pillar into 3 to 5 proof points across four
types, data, customer story, partnership, technical claim. Every
proof point must trace to a source the brand can cite. You do not
invent statistics.

USER:
Pillars (from Phase 2): {PILLARS_JSON}
Source proof points (from brief): {PROOF_POINTS_LIST}
Additional assets the brand can cite: {OTHER_ASSETS}

Return JSON shaped like:

{
  "pillars": [
    {
      "claim": "<the pillar claim verbatim>",
      "proof_points": [
        {
          "type": "<data | customer_story | partnership | technical>",
          "summary": "<one-sentence summary>",
          "source": "<where the proof comes from>",
          "verification_status": "<verified | pending | invented_DO_NOT_USE>"
        }
      ]
    }
  ]
}

Rules:
- 3 to 5 proof points per pillar.
- Aim for at least 1 of each type per pillar, but allow 0 if the
  brand has none.
- "verification_status" defaults to "pending" if the source is not
  in the inputs.
- Never mark a proof point as "verified" if the source was not
  supplied. No invented stats. If you cannot anchor a proof, mark
  it "invented_DO_NOT_USE" and the team will discard it.
```

**Expect output like:**

| Pillar | Proof type | Summary | Source | Status |
|---|---|---|---|---|
| Engineered for the second loop | Data | 48-month wear test, shells retain weatherproof rating after 18 months of weekly use | Internal QA lab | verified |
| Engineered for the second loop | Customer story | A reviewer in her third season on the Vahla shell | Trustpilot review #4821 | verified |
| Engineered for the second loop | Technical | Membrane spec versus lightweight-category average | Spec sheet, manufacturer data | verified |
| Recreational get elite-grade kit | Partnership | Vahla membrane shared with UTMB-finisher sponsorship line | Athlete contracts | verified |

**Step 3.2, retire the unverified.**

Any proof point with status `pending` gets handed to the team for source verification, or pulled from the message house. Any marked `invented_DO_NOT_USE` gets deleted. Never ship a proof point that does not trace to a source.

**You should now have** every pillar populated with three to five verified proof points.

### Phase 4, channel-mapped lines and rebuttals

The message house is operational only when it produces copy. Phase 4 generates the channel lines and the rebuttals.

**Step 4.1, run the channel-lines prompt.**

```text
SYSTEM: You generate channel-specific copy lines from a pillar and
its proof points. Each line expresses the same pillar but adapts to
channel constraints, length, register and CTA convention. You stay
inside the brand's voice profile and never use banned words.

USER:
Pillar: {PILLAR_CLAIM}
Proof points: {PROOF_POINTS_FOR_PILLAR}
Voice profile (short): {VOICE_PROFILE_SHORT}
Banned words: {BANNED_WORDS_LIST}

Return JSON shaped like:

{
  "pillar": "<claim verbatim>",
  "lines": [
    {"channel": "landing_page_H1", "max_chars": 60, "line": "<copy>"},
    {"channel": "landing_page_subhead", "max_chars": 140, "line": "<copy>"},
    {"channel": "email_subject", "max_chars": 60, "line": "<copy>"},
    {"channel": "email_preview", "max_chars": 90, "line": "<copy>"},
    {"channel": "instagram_caption", "max_chars": 220, "line": "<copy>"},
    {"channel": "x_post", "max_chars": 280, "line": "<copy>"},
    {"channel": "linkedin_hook", "max_chars": 180, "line": "<copy>"},
    {"channel": "sales_talking_point_1", "max_chars": 120, "line": "<copy>"},
    {"channel": "sales_talking_point_2", "max_chars": 120, "line": "<copy>"},
    {"channel": "sales_talking_point_3", "max_chars": 120, "line": "<copy>"}
  ]
}

Rules:
- Every line respects the character limit.
- No banned words.
- No exclamation marks, no em dashes, no semicolons.
- Each line carries the pillar's claim in some form.
- Sales talking points are three distinct angles, not three rewordings.
```

Run the prompt once per pillar. You will end up with ten lines per pillar, thirty to fifty lines for a three-to-five-pillar message house.

**Step 4.2, run the rebuttals prompt.**

```text
SYSTEM: You write rebuttal responses for the hardest pushback
questions a sceptic will ask about the brand's positioning. The
rebuttals must use the brand's actual proof points, not generic
defences.

USER:
Narrative sentence: {NARRATIVE}
Pillars: {PILLARS_JSON}
Proof points: {ALL_PROOF_POINTS}
Audience: {AUDIENCE_DEFINITION}
What-not-this: {WHAT_NOT_THIS}

Return JSON shaped like:

{
  "rebuttals": [
    {
      "pushback": "<the sceptic's question, verbatim as a sceptic would say it>",
      "response": "<one-paragraph rebuttal, anchored to proof points>",
      "proof_points_cited": ["<which proofs the response leans on>"],
      "fallback_if_pushed": "<what to concede if the sceptic doesn't accept the rebuttal>"
    }
  ]
}

Rules:
- 8 to 12 rebuttals.
- Cover price objections, quality scepticism, audience mismatch,
  category contrast, and credibility-of-claims pushbacks.
- Every rebuttal cites at least 1 verified proof point.
- "fallback_if_pushed" is an honest concession, not a deflection.
- Do not invent proof points.
```

**Expect output like:**

> **Pushback.** "Forty grams heavier than the lightweight category, that's a deal-breaker for me."
>
> **Response.** The forty-gram delta is the membrane that survives hour four. The lightweight category averages three season-launch lifecycles before delaminating at the seams, which is data the brand has from forty-eight months of wear testing. Most trail runners run more than three season launches in a career, so the lifetime weight-per-mile-of-trustworthy-use is actually lower than the lightweight category.
>
> **Proof points cited.** 48-month wear-test data, membrane spec comparison.
>
> **Fallback if pushed.** "For race-day kit pieces under five hours, the lightweight category does the job. The Vahla is for the long Sunday and the back half of multi-day races, where forty grams of trustworthy is the trade-off worth making."

**You should now have** the complete message house, channel lines per pillar, and a rebuttal sheet that sales, founder and brand can all use.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand.

**Phase 1 output.** Positioning brief validated. Pass on all four checks. Inputs go in.

**Phase 2 output.** Narrative sentence: "Trail-running kit that survives the season, season after season."

Three pillar structures returned. The team picks the durability-led structure, four pillars.

1. The kit is engineered for the second loop, not the launch shoot.
2. Recreational and mid-pack runners get materials the elite category usually keeps.
3. Repair is cheaper than replacement, and the brand pays for it.
4. The brand's writers actually run the routes the kit is built for.

**Phase 3 output.** Four pillars, sixteen proof points total. Two `pending` proof points get sent to the product team for verification, both come back verified within forty-eight hours.

**Phase 4 output.** Forty channel-mapped lines across four pillars. Ten rebuttals.

A sample of the channel lines for pillar 1, "engineered for the second loop":

| Channel | Line |
|---|---|
| landing_page_H1 | Kit that survives the second loop. |
| landing_page_subhead | Forty grams heavier than the lightweight category, because the lightweight category does not survive hour four. |
| email_subject | About the forty grams |
| email_preview | And why the lightweight category quietly gives up at hour four. |
| instagram_caption | The lightweight category is brilliant for the photo shoot. Less brilliant at the back half. Vahla is forty grams heavier, and the membrane is what survives. |
| linkedin_hook | The lightweight trail category is failing at hour four. Here is the forty-gram trade-off we made instead. |
| sales_talking_point_1 | Membrane spec exceeds the lightweight-category average across four core resistances. |
| sales_talking_point_2 | 48 months of wear-test data, shells retain weatherproof rating after 18 months of weekly use. |
| sales_talking_point_3 | Two-year guarantee, lifetime repair programme covers wear-and-tear failures. |

The rebuttal sheet ships with ten responses, covering price, weight, the "elite-only kit" misperception, the "isn't all trail apparel similar" pushback, the "your range is too small" pushback, the "I have brand loyalty" pushback, and four others.

A quarter after the message house ships, the brand reports the founder no longer rewrites every brief because the team can pull pillar-anchored copy directly. Sales has stopped freelancing on its own value props because the rebuttal sheet covers the questions they were getting. The marketing newsletter ships in half the time because the channel lines are the starting point.

## Try it yourself

Three exercises, each takes 20 to 30 minutes.

### Exercise 1, validate your own brief

Paste your current positioning brief, proof points and audience definition into the Phase 1 validator prompt. Read the verdict. If `conditional` or `fail`, the brief needs work before the message house pipeline runs. The validator's gap list is your edit guide.

### Exercise 2, generate three pillar structures

If your brief passes, run the Phase 2 prompt. Read the three structures. Pick the one that feels most like the brand could defend it against a sceptic, not the one that sounds most ambitious. Edit the pillar claims live until they read as falsifiable claims rather than category labels.

### Exercise 3, build a rebuttal for your hardest pushback

Take the single question you most frequently fail to answer in sales conversations. Paste it into Claude with your pillars and proof points, and ask:

> "Here is a sceptic's question we struggle with: [paste]. Here are our pillars and proof points: [paste]. Draft a one-paragraph rebuttal that uses our proof points. Include a fallback if the sceptic does not accept the rebuttal."

If the rebuttal reads weak, the proof points are not yet strong enough. The rebuttal sheet is a diagnostic for proof-point durability.

## The eval gates

**Eval 1, pillar distinctiveness.** Pillars should be mutually distinct. Compute pairwise semantic similarity, or have the team rate it by hand. If two pillars score above 0.7 similarity, they are saying the same thing twice, merge or sharpen.

**Eval 2, proof-point traceability.** Every proof point traces to a source. Any proof point flagged `pending` for more than two weeks is either verified or retired. Anything marked `invented_DO_NOT_USE` is deleted on sight.

**Eval 3, channel-line voice consistency.** Run every channel line through the voice-eval rubric from the brand-voice-extraction playbook. All lines score above the ship threshold. Lines that pass on the website but fail on social mean the brand has two voices and the team has not acknowledged it, see the founder-and-institutional-voice playbook.

**Eval 4, rebuttal coverage.** The rebuttal sheet covers at least one pushback per pillar plus the three most common audience-level objections (price, fit, category). If a sales call surfaces a pushback the sheet does not cover, add it within a week.

## The failure modes

**Pillars become categories, not messages.** "Product", "People", "Process" as pillars is the common slip. These are organisational categories, not pillar arguments. Pillars should be claim-shaped, "the work compounds because we own the full pipeline" reads as a pillar, "process" does not.

**Proof points get reused without permission.** Customer story proof points need active customer permission. The brand-friendly version of a customer quote is not the same as the customer's authorised version, re-confirm with the customer before publishing.

**Channel lines drift over time.** A line that worked at launch may have been overused six months in. The message house is a living document, quarterly refresh the channel lines while keeping the narrative and pillars stable. Stability at the top, freshness at the channel.

**Sales freelances around the house.** Sales runs into objections the rebuttal sheet does not cover, then invents value props on the fly that contradict the message house. Fix by having a single Slack channel where sales surfaces uncovered objections weekly, and the marketing function ships an updated rebuttal within a week.

**The founder ships a new tagline that contradicts the house.** Founders do this. The message house should have founder sign-off, and the tagline-system playbook should be run downstream of the house, not upstream of it.

## The pattern in practice

Illustrative scenarios that show common shapes a message house takes when run cleanly. Specifics are illustrative, patterns repeat.

**B2B SaaS, scale-stage, the unification.** A brand with three different elevator pitches depending on whom you asked. The message house unifies the narrative in a single session, and the compounding effect typically lands a quarter or two later when sales-pipeline conversion improves because the brand is finally being described consistently across all touchpoints.

**D2C, growth-stage, the drafting unlock.** A brand with strong positioning but no message house, so every piece of content re-derives what to say from scratch. The pipeline builds the house in a day, drafting speed for new content multiplies in the following quarter because the pillars and proof points become reusable infrastructure rather than invented per-piece.

**Endurance apparel, scale-stage, the sales-objection rescue.** A brand whose sales calls keep stalling on the same three weight-versus-durability objections. The rebuttal sheet documents responses anchored to wear-test data and the lifetime repair programme. Within a quarter, sales reports the objections still come up at the same rate but call-to-close conversion lifts because the team is no longer freelancing the answers.

## Hand-off

The message house feeds:
- **tagline-system**, taglines test against the narrative sentence and pillar claims, not in isolation
- **content briefs**, every brief lists the pillar the piece will advance and the proof points it will lean on
- **paid creative**, the channel lines from Phase 4 become the source for hook variants
- **sales enablement**, the rebuttal sheet ships into the sales playbook directly
