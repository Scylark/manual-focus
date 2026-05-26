---
title: "Training-content engine for endurance brands"
stack: content
description: "Build a year-round educational content series from a brand's coaching POV. Training, periodisation, recovery and mental work formatted for endurance audiences."
outputs: "Editorial calendar, drafting pipeline, expert-review gate"
readMin: 22
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["content", "email", "organic-social"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-07-16
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **coaching POV document** of 1,500 to 2,500 words covering what the brand believes about training, recovery and the audience tier it serves.
2. A **populated training-content calendar CSV** for the next 24 to 52 weeks with one row per piece, columns for pillar, topic, format, length, audience tier, practical application, POV anchor, citations and reviewer.
3. **Forty to seventy spoke briefs** each tagged to a pillar and routed through the eval-gated drafting pipeline with three coaching-specific gates layered on top.
4. An **expert-review workflow** where a credible coach reviews every draft before publish, with the review notes feeding back into the drafting prompt as training data.
5. A **distribution and re-use map** showing how each long-form piece becomes mid-form, short-form, audio and reference assets across the brand's channels.

## Who this is for

A growth or scale-stage endurance brand that wants the audience to return for practical training help, not just product news. The brand has access to one credible coaching voice (sponsored athlete, advisor, founder if they coach, partner practice) willing to review every draft before publish. If the brand has no credible voice, the playbook says so honestly, sign a coach first.

## Before you start

- [ ] A credible coaching voice on the team or under contract, with a written agreement on review time
- [ ] The brand's audience segmentation, with at least three tiers (beginner, mid-pack racer, ultra or elite where relevant)
- [ ] Voice profile from the brand-voice-extraction playbook
- [ ] Endurance-specific voice extension if multiple disciplines are covered
- [ ] CMS access (Webflow, Shopify, WordPress)
- [ ] Email platform (Klaviyo, HubSpot, Mailchimp) with at least one segmented audience
- [ ] Reference library of credible coaching sources (Seiler, Stoeggl, Mujika, Lydiard, Friel as the standard floor)
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode
- [ ] A spreadsheet for the editorial calendar

If you skip the coaching voice agreement, the playbook produces generic training content the audience will not return to.

## The pipeline

Six phases. Build the POV and the calendar over a working week. After that, each piece runs through the drafting and review workflow in two-to-three days.

### Phase 1, coaching POV extraction

The brand articulates its perspective so the editorial spine exists before any piece drafts.

**Step 1.1, run the POV extraction session.**

Block 90 minutes with the brand's coaching voice. The session works as a structured interview, not a free chat. The interviewer asks the questions, the coach answers in their own words, the recording transcribes for the prompt.

The questions cover.

- What do you believe about base building that most coaches get wrong
- Polarised, pyramidal, threshold or other, where do you sit and why
- Strength work for endurance athletes, what is the minimum effective dose
- Periodisation, block-based or year-round consistency
- Recovery, what do you push back on hardest with athletes you coach
- The audience tier you most commonly underserve, and why
- The training principle most overrated in the popular running press

**Step 1.2, run the POV synthesis prompt.**

```text
SYSTEM: You synthesise an endurance brand's coaching POV from an
interview transcript. You write in the coach's voice, in plain
language, and you do not soften the POV to make it palatable.
Distinctiveness is the point.

USER:
Brand: {BRAND_NAME}
Coaching voice: {COACH_NAME_AND_BACKGROUND}
Audience tiers: {LIST_TIERS}
Interview transcript: {TRANSCRIPT}

Write a 1,500 to 2,500 word POV document covering:

1. The brand's training philosophy in one paragraph
2. Base building, the brand's specific position
3. Building blocks (intervals, tempo, threshold, hill work), the
   brand's specific position
4. Recovery and adaptation, the brand's specific position
5. Mental work, the brand's specific position
6. The audience tier the brand serves best, and why
7. What the brand will not write about, and why

Rules:
- Plain language. The coach's voice, not a textbook.
- Cite the established work (Seiler, Stoeggl, Mujika, Lydiard, Friel,
  Maffetone) where the coach references it.
- No hedging. The POV is sharper than the average coaching content.
- No marketing voice. This document is for the editorial team's spine.
```

**Step 1.3, the coach signs off on the POV.**

The coach reads the synthesis, edits where the wording is off, and signs off. The signed POV becomes the editorial spine for every piece in the calendar.

**You should now have** a signed POV document the drafting pipeline reads from.

### Phase 2, topic taxonomy

From the POV, generate the topic tree the calendar will sit on.

**Step 2.1, run the topic taxonomy prompt.**

```text
SYSTEM: You generate a year's worth of training-content topics for an
endurance brand based on its POV and audience. The topics span six
pillars and cover the practical work the audience does across a year.

USER:
POV document: {POV_DOC}
Audience tiers: {LIST_TIERS}
Disciplines covered: {LIST_DISCIPLINES}
Brand's coaching voice: {COACH_NAME}
Calendar length: {WEEKS}

Generate a topic tree with these pillars:

- Foundations (base building, easy work, aerobic discipline)
- Building blocks (intervals, tempo, threshold, hill work)
- Recovery and adaptation (sleep, fuelling, off-season, easy-day
  discipline, recovery weeks)
- Mental work (pacing, race-day execution, suffering, focus)
- Practical (gear choices, data reading, plateau diagnosis)
- Seasonal (winter, spring breakthrough, peak, taper, off-season)

For each pillar, return JSON:

{
  "pillars": [
    {
      "name": "<pillar>",
      "target_piece_count": <int>,
      "topics": [
        {
          "title": "<draft title>",
          "format": "<long-form | mid-form | short-form>",
          "audience_tier": "<tier or all>",
          "POV_anchor": "<which POV claim this piece advances>",
          "citations_required": ["<source>"],
          "practical_application": "<the prescription per tier>"
        }
      ]
    }
  ]
}

Rules:
- Total piece count 40 to 70 across a year, 24 across half a year.
- Each topic anchored to a specific POV claim. Topics not anchored
  to the POV get cut.
- Practical_application is the concrete "try this" line, not the
  topic restated.
```

**Step 2.2, the coach reviews the taxonomy.**

A 30-minute review. The coach reads the topics, kills the ones that drift from the POV, sharpens the ones that are vague, suggests the ones the brand alone can ship.

You should now have a topic tree the coach has shaped.

### Phase 3, editorial calendar

The topics land on dated rows in the calendar.

**Step 3.1, choose your template path.**

**Option A, download the training calendar template.** Grab [training-content-calendar-template.csv](/lens/templates/training-content-calendar-template.csv). It has columns for week, publish date, pillar, topic, format, length, audience tier, practical application, POV anchor, citations required, reviewer, distribution channels and status. The first 24 weeks come pre-populated with a sample sequence so the calendar reads as a real artefact.

**Option B, build a custom calendar for a different cadence.** If the brand publishes more than once a week or covers multiple disciplines requiring separate streams, ask Claude to build the tailored template.

```text
SYSTEM: You generate a training-content editorial calendar template
for an endurance brand based on cadence, disciplines and reviewer
capacity.

USER:
Brand: {BRAND_NAME}
Publishing cadence per week: {INT}
Disciplines covered: {LIST_DISCIPLINES}
Audience tiers: {LIST_TIERS}
Calendar length in weeks: {INT}
Reviewer capacity per week: {HOURS}

Generate a CSV calendar template with:
Week, Publish_date, Pillar, Topic, Format, Length_words,
Audience_tier, Practical_application, POV_anchor, Citations_required,
Reviewer, Distribution_channels, Status, Notes

Pre-fill the Week column. Leave the rest empty.

Return the CSV directly.
```

**Step 3.2, populate the calendar.**

Drop the topics from Phase 2 onto dated rows. Sequence considerations.

- Foundations pieces front-load Q1 and pop up again at the start of each block
- Seasonal pieces align with the audience's calendar (taper pieces in the month before majors, off-season pieces in November and December)
- Building blocks distribute across the year, no more than two consecutive weeks on the same pillar
- Practical pieces drop into the breaks between heavier pieces

**You should now have** a populated calendar showing the next 24 to 52 weeks of training content.

### Phase 4, drafting pipeline

Every piece runs through eval-gated drafting with three coaching-specific extensions.

**Step 4.1, run the standard drafting brief.**

The brief template loads from the cluster generator if the piece overlaps with the SEO programme. Otherwise the brief loads from the editorial calendar row, with target query, intent, must-include facts with sources, POV anchor, voice profile reference and length target.

**Step 4.2, layer in the coaching-specific gates.**

The three coaching gates run after the standard drafting gates.

```text
SYSTEM: You gate training-content drafts against the brand's coaching
POV, practical application discipline and citation credibility.

USER:
Draft: {DRAFT_TEXT}
POV document: {POV_DOC}
Practical-application requirement: every piece includes at least
one concrete "if you are [audience tier], try this" prescription.
Approved citation sources: {APPROVED_SOURCES_LIST}

Return JSON:

{
  "coaching_truth_gate": {
    "verdict": "<pass | fail>",
    "rationale": "<one sentence>",
    "contradictions_to_POV": ["<verbatim phrase from draft>"]
  },
  "practical_application_gate": {
    "verdict": "<pass | fail>",
    "prescriptions_found": [
      {"audience_tier": "<tier>", "prescription": "<verbatim>"}
    ]
  },
  "credibility_reference_gate": {
    "verdict": "<pass | fail>",
    "claims": [
      {
        "claim": "<verbatim>",
        "citation": "<approved source | NONE>",
        "supported": <true | false>
      }
    ]
  }
}

Rules:
- coaching_truth_gate fails if the draft contradicts the POV without
  explicit acknowledgement, or restates the POV without adding signal.
- practical_application_gate fails if no prescription exists for the
  audience tier the piece targets.
- credibility_reference_gate fails if any training-physiology claim
  has no citation or cites a source not in the approved list.
```

**Step 4.3, repair the failing drafts.**

A failed gate triggers a repair cycle with the failing checks named in the next prompt. Maximum three repair cycles. If the piece cannot pass after three, the brief itself is suspect and gets bounced to strategy.

You should now have drafts that pass the standard gates plus the three coaching gates.

### Phase 5, expert review

The coach reviews every draft before publish.

**Step 5.1, route the draft to the reviewer.**

The CMS or project tool routes the draft to the reviewer with a 48-hour SLA. The reviewer reads, marks up, and approves or returns.

**Step 5.2, capture the review notes.**

Every reviewer edit gets captured in a review log. The pattern of edits across pieces becomes training data for the drafting prompt. The next month's drafts are sharper because the prompt has incorporated the reviewer's defaults.

**Step 5.3, publish.**

Approved drafts publish on the calendar date. The CMS picks up the long-form, the email platform picks up the mid-form, the social scheduler picks up the short-form cuts.

You should now have a reviewed, published piece with the review notes captured.

### Phase 6, distribution and re-use

Each long-form piece produces multiple channel cuts.

**Step 6.1, run the repurposing prompt.**

```text
SYSTEM: You repurpose a long-form training piece into channel-native
cuts. You keep the practical-application prescription in every cut.
You do not flatten the piece to its headline.

USER:
Long-form piece: {PIECE_TEXT}
Audience tier: {TIER}
Voice profile: {VOICE_PROFILE_SHORT}
Channels active: {LIST_CHANNELS}

Return JSON:

{
  "long_form_blog": "<published as-is, the source>",
  "email_mid_form": {
    "subject": "<under 50 chars>",
    "preview": "<under 90 chars>",
    "body": "<400 to 600 words, the core prescription plus one tactical example>"
  },
  "linkedin_post": {
    "hook": "<line 1, under 75 chars, states the insight>",
    "body": "<100 to 180 words, the prescription plus one specific number>"
  },
  "instagram_carousel": [
    {"slide": 1, "text": "<hook>"},
    {"slide": 2, "text": "<the prescription>"},
    {"slide": 3, "text": "<the why>"},
    {"slide": 4, "text": "<the citation>"},
    {"slide": 5, "text": "<the next step CTA>"}
  ],
  "twitter_thread": [
    {"tweet": 1, "text": "<hook>"},
    {"tweet": 2, "text": "<problem>"},
    {"tweet": 3, "text": "<prescription>"},
    {"tweet": 4, "text": "<example>"},
    {"tweet": 5, "text": "<citation and link out>"}
  ],
  "podcast_audio_brief": {
    "runtime_minutes": <int>,
    "structure": ["<intro>", "<problem>", "<prescription>", "<example>", "<close>"]
  }
}

Rules:
- Every cut carries the prescription in some form.
- No cut compresses the piece to just the headline.
- The citation appears in at least three of the cuts so the
  credibility carries across channels.
```

**Step 6.2, ship the cuts.**

Each cut routes to its scheduler. The blog goes to the CMS. The email cut goes to the email platform's send queue. The social cuts go to Buffer or the platform-native scheduler. The audio cut goes to the podcast feed if the brand runs one.

You should now have the piece live across the brand's full channel mix with the prescription carried in every cut.

## Worked example, end-to-end

Cascadia Endurance built the training-content engine with Marcus Hale as the credible coaching voice. Hale is a former pro-elite ultra runner who now coaches the Cascadia Trail Club membership and writes for the brand under contract.

**Phase 1 output.** POV extraction session ran in March. Marcus's POV emerged as polarised base with a heavy bias toward the eighty-twenty week, low strength volume but high specificity (three lifts only), perceived effort over watts or heart-rate dogma, and a deep skepticism of the "epic suffering" voice that dominates trail content. The synthesis ran 2,100 words. Marcus signed off after editing two paragraphs where the wording was too academic.

**Phase 2 output.** Topic tree produced 58 pieces across six pillars. Marcus killed eight that drifted from the POV (most of them gear pieces dressed as training pieces, which belong in the gear stream not the training stream) and added three (a piece on hill repeats anchored to Beth Lyons's Lavaredo prep, a piece on suffering as skill not virtue, and a piece on choosing trail shoes that overlapped with the SEO cluster on trail-running shoes).

**Phase 3 output.** Calendar populated for 24 weeks. Sample of the first eight weeks visible below.

| Week | Pillar | Topic | Format | Audience tier | POV anchor |
|---|---|---|---|---|---|
| W01 | Foundations | The case for the eighty-twenty week | long-form | all | polarised base is the spine |
| W02 | Foundations | How easy easy actually feels | long-form | beginner mid-pack | perceived effort over watts |
| W03 | Mental | Why January motivation is the wrong fuel | mid-form | all | intrinsic over extrinsic |
| W04 | Building blocks | Threshold intervals without a lactate test | long-form | mid-pack racer | field test over lab |
| W05 | Recovery | Sleep is the cheapest performance gain | mid-form | all | sleep before supplements |
| W06 | Foundations | Long ride two ways trail and road | long-form | mid-pack racer | context shapes pace |
| W07 | Practical | Reading Garmin data without obsessing | mid-form | all | signal over noise |
| W08 | Mental | Suffering as skill not virtue | long-form | mid-pack racer ultra | sufferance is trainable |

**Phase 4 output.** Drafting ran on the W01 piece. First draft passed the voice rubric at 11 of 12, passed the fact-grounded gate, failed the practical-application gate because the prescription was generic ("aim for 80% easy effort") without per-tier specifics. Repair cycle added per-tier prescriptions: beginners cap heart rate at 75% max, mid-pack racers use Marcus's nasal-breathing test, ultra runners use the conversational sentence test. Pass.

**Phase 5 output.** Marcus reviewed the W01 draft and edited two passages where the language was over-prescriptive ("must" became "the rule of thumb is", "always" became "in most weeks"). Review notes captured, fed back into the drafting prompt as a constraint to avoid over-prescriptive language. Publish.

**Phase 6 output.** W01 piece shipped at 2,200 words on the blog. The email cut at 550 words went to the 11,400 subscribers on the training-content segment with subject "The case for the eighty-twenty week" and recorded a 38% open rate (Cascadia baseline 22% on training-content sends). The LinkedIn cut from Marcus's account picked up 4,200 impressions and 180 engaged reactions. The Instagram carousel ran on the brand's account and the founder's account. The Twitter thread did less well, predictable given the brand's underdeveloped Twitter presence.

Six months in, training content is the highest-engagement content stream on the brand. Email open rates on training sends average 34% against a 22% baseline. The Trail Club membership has doubled, with new sign-ups citing the training content as the reason in onboarding surveys. The brand's category positioning has shifted from "trail apparel" toward "trail brand that helps you train smarter," which is what the POV intended.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, extract a POV from a single coach interview

Find a 20-minute interview with a credible coach in your discipline (a podcast episode, a Strava interview, a Trail Runner profile). Transcribe the relevant section. Run the Phase 1 synthesis prompt on the transcript. Read the POV. Is it specific enough to constrain drafting? If it reads as generic "train smart, recover hard" content, the interview was not deep enough, find a longer or more pointed source.

### Exercise 2, draft one piece against a POV

Take a POV document (yours, or one you have written for this exercise). Take one topic from the taxonomy. Run the drafting prompt with the POV plus the topic. Read the draft. Does it advance the POV or just restate it? Does it include a per-tier prescription? If not, the gates have not landed, run the Phase 4 gates and watch which fail.

### Exercise 3, repurpose a long-form piece you have already published

Take one long-form training piece you have already shipped. Run the Phase 6 repurposing prompt. Read the cuts. Compare to whatever cuts you actually shipped. The gaps show where the brand has been losing the prescription in the channel cuts, which is the most common failure mode of training-content repurposing.

## The eval gates

**Eval 1, POV consistency.** Sample 20 published pieces quarterly. Reviewer scores each against the POV from 1 to 5. Mean score holds above 4.0. Lower means the pipeline is drifting from the brand's voice, retrain the prompt against fresh examples.

**Eval 2, citation accuracy.** Random-sample five published pieces and verify every citation against the actual source. Acceptance is 100%. A single fabricated study gets noticed by the audience that reads training content closely.

**Eval 3, practical-application rate.** Every piece passes the practical-application gate before publish. Audit monthly. Drift below 100% means the gate is being skipped or the prompt is degrading.

**Eval 4, audience response.** Quarterly engagement on training content versus gear or athlete content. Training content out-engages gear content within six months. If it does not, the POV is not distinctive or the practical-application gate is too soft.

**Eval 5, coach-edit volume.** Track the average number of reviewer edits per piece over time. Volume should trend down as the drafting prompt incorporates the coach's defaults. If volume stays flat or rises, the prompt is not learning from the review log.

## The failure modes

**No POV.** Brand wants training content without articulating what it believes. The pipeline produces generic Runner's-World-style work any brand could have written. Refuse to start until the POV exists.

**Expert review without authority.** The reviewer needs the credibility to push back on draft language. If the brand uses a junior coach who defers to whatever the model drafted, the gate is not a gate.

**Citation laundering.** Brand wants to look researched without the patience. The pipeline drafts, citations get added by search, citations turn out to misrepresent the original studies. Always read the cited source before publishing the citation.

**Repurposing kills the substance.** A 2,000-word piece compressed to a 280-character tweet loses the practical-application detail that made the long form useful. Repurposing keeps one applicable detail per channel, not just the headline.

**Self-cannibalisation.** Brand publishes 50 pieces a year that overlap heavily (three pieces on easy running) and undersell the breadth. The topic taxonomy is the discipline. Cover the breadth before doubling up.

## The pattern in practice

Illustrative scenarios that show common shapes a training-content engine takes. Specifics are illustrative, patterns repeat.

**Cycling brand, scale-stage, the credible-coach unlock.** A brand publishing a couple of training pieces a month, ad-hoc. Installing the engine with a sponsored cycling coach as the credible voice lifts output to several pieces a month with expert review on every one. Email open rates on training content run a multiple of open rates on gear content. Newsletter sub-to-customer conversion from training-content readers runs well above the brand average.

**Trail running brand, growth-stage, the founder-as-coach.** A brand whose founder is a practicing ultra runner. Extracting his POV in a single working session, generating the topic tree, and drafting against a founder-as-reviewer cadence typically makes training content the single largest organic traffic source within a year, overtaking gear content.

**Triathlon brand, the no-credible-voice failure.** A brand wanting training content without a credible coaching voice on the team or under contract. Drafting against a generic POV produces engagement indistinguishable from the brand's gear content. The honest fix is signing a coach first. The lesson is that the credible voice is non-negotiable.

## Hand-off

The training-content engine feeds:
- **eval-gated-drafting**, per-piece drafting runs through the standard pipeline plus the three coaching gates
- **social-content-factory**, channel-native repurposing of the long-form pieces
- **lifecycle-journey-builder**, sequenced training-content email series
- **seo-cluster-generator**, training topics that overlap with commercial SEO clusters get cross-routed
