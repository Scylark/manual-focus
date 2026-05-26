---
title: "Race-result content engine, timing data to editorial recap"
stack: content
description: "Turn live timing data, lap splits and race officials' results into editorial-quality recap content within 90 minutes of race finish. Fact-checked, voice-gated, ready to ship."
outputs: "Recap drafter pipeline, fact-check harness, channel-mapped publishing schedule"
readMin: 11
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["content", "email", "organic-social"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-07-02
status: live
preview: false
---

## The brief

A race finishes Sunday afternoon. The audience wants the story by Sunday evening. Most endurance brands ship a generic congratulations post Monday, then a longer recap Tuesday or Wednesday, by which time the audience has already read three other versions on Velo, RunBlogger, Triathlete or their preferred outlet. The brand looks late and adds nothing.

This pipeline cuts that. The moment the race result is final, the pipeline pulls the timing data, the official results, the significant-margin events of the race, and produces a recap drafted in the brand's voice that ships to email and social within 60 to 90 minutes of race finish. Fact-checked, voice-gated, ready.

It doesn't try to be the New York Times. It tries to be the brand's authentic take on the race, fast enough that the audience reads it during the post-race wind-down.

## The pipeline

Five phases.

**Phase 1, data sources.** Before the race, identify and connect:

- **Official timing feed.** Race organiser's results page or live timing API where available (USA Track and Field, AIMS for road running, UCI for cycling, World Triathlon for tri)
- **Race-day social.** Official race accounts, key journalists covering the race, audience sentiment via tracked hashtags
- **Athlete data, if branded.** Sponsored athletes' Strava, Garmin Connect, race-specific stats from team or federation feeds
- **Weather and conditions.** Local meteorological data for the race window

Test the feeds 24 hours before the race. Brands routinely discover the timing feed format changed two weeks before a major race and find out 90 minutes after the finish.

**Phase 2, race watch and event detection.** During the race, the pipeline monitors the timing feed every 30 to 60 seconds. Significant events get logged automatically.

- **Margin events.** A gap opens, closes, or splits
- **Pace events.** An athlete sets a personal best, a course record falls, a pace pack shatters
- **Brand events.** Sponsored athletes' position changes (in or out of contention, mechanical incident, drop)
- **Drama beats.** Late surge, crash or fall, lead change in the closing kilometres

The events go to a structured event log the recap drafter will read.

**Phase 3, result finalisation.** When the official results post, the pipeline pulls the final standings. It cross-references against the event log to verify which dramatic moments actually happened (the late surge that didn't quite take the win gets recorded as a near-miss, the breakaway that survived gets recorded as the headline).

**Phase 4, recap drafting.** The drafter prompt loads:

- Brand voice profile (from `.lens/voice-profile.json`)
- Endurance-specific voice extension (from the endurance-brand-voice playbook if applicable)
- Final results and event log
- The brand's POV on this race (set in advance, "we cover this race every year and our angle has historically been the tactical story, not the bare results")
- Brand-relevant athletes flagged

```text
SYSTEM: You write race recaps for an endurance brand. You write like
someone who watched the race, not someone who read the results
afterwards. You name the tactical inflection points. You distinguish
the dominant narrative from the side stories worth a line. You do not
hyperbolise.

USER:
Race: {RACE_NAME}, {DATE}
Course / discipline: {COURSE_DESCRIPTION}
Conditions: {WEATHER_CONDITIONS}
Result: {OFFICIAL_RESULT}
Event log: {EVENT_LOG_JSON}
Brand-relevant athletes: {BRAND_ATHLETES_AND_RESULTS}
Brand POV on this race: {POV_NOTE}

Draft:
1. Headline (≤ 65 chars) — names the dominant story.
2. Lede (1 sentence, ≤ 30 words) — the result + the inflection.
3. Body (350–500 words):
   - Para 1: what happened up to the decisive moment
   - Para 2: the decisive moment itself, with the timing data
   - Para 3: the side stories worth knowing (one brand-relevant
     athlete maximum)
   - Para 4: what it means for the season ahead

Rules:
- Only cite numbers that appear in the result or event log.
- Brand-relevant athlete coverage proportional to their actual race
  performance, not their sponsorship status. A 47th-place finish
  doesn't carry the recap.
- No hyperbole. Endurance audiences distrust it.
- One specific tactical observation. The audience knows the
  difference between a real race recap and a sponsorship-driven one.

Return JSON:
{
  "headline": "<...>",
  "lede": "<...>",
  "body_paragraphs": ["<p1>", "<p2>", "<p3>", "<p4>"],
  "social_cut_60_chars": "<≤ 60 char social hook>",
  "email_subject_50_chars": "<≤ 50 char email subject>",
  "fact_claims": [
    {"claim": "<verbatim>", "source": "<result|event_log|both>"}
  ]
}
```

**Phase 5, fact-check and publish.** Every claim in the draft is cross-referenced against the result or event log. Claims without a source citation are flagged and either grounded or removed.

Once the draft passes the fact-check, it's pushed to the publishing queue covering email send, social posts (channel-native via the social-content-factory pipeline), website update, and news feed.

The whole pipeline from official result to publish target is 30 to 60 minutes for a routine race, up to 90 minutes for a major where the narrative warrants a longer recap.

## The capability boundary

This is the workflow where text-generation reliability shines and where image or video generation should not be touched. See the [capabilities reference](/lens/capabilities) for context.

**Works:**

- Drafting the recap from structured results and event log
- Voice-gating against the brand's profile
- Fact-grounded eval that catches invented numbers, dates, or podium positions
- Generating channel-native social variants (LinkedIn, X, Instagram, TikTok script) from the recap

**Doesn't work:**

- Auto-generating "race-day imagery" of named athletes. Use practical race-day photography or rights-cleared event imagery, never AI.
- Inferring athletes' emotional state ("she was devastated", "he knew he had it"). The model doesn't know. Stick to what the data and the post-race interviews say.
- "Predicting" outcomes after the result. The recap is the recap. Predictions about the next race belong in a separate piece.

## The eval harness

**Eval R1, time-to-publish.** Median 60 minutes from final result to publish on routine races. Above 90 minutes means a step in the pipeline is bottlenecking and needs investigation (usually the event-log to draft handoff).

**Eval R2, fact accuracy.** Every published recap goes through a post-publish audit within 24 hours. Sample 5 factual claims and verify against official sources. Acceptance is 100%. A single wrong result or wrong margin gets noticed and shared by the audience.

**Eval R3, voice rubric pass.** Recap drafts score ≥10/12 on the voice rubric before publish. Failed drafts regenerate with the failing checks named.

**Eval R4, branded-athlete proportionality.** Audit recaps over a quarter. Branded athletes should not be over-represented relative to their actual race performance. If 80% of recaps lead with a branded athlete who finished outside the top 20, the audience notices and the brand loses credibility.

## The failure modes

**Pipeline runs ahead of the official result.** Provisional results sometimes change (disqualifications, time penalties). Always wait for the official final result before drafting. Late by 10 minutes is fine. Wrong is not.

**Timing feed breaks during the race.** Have a fallback. A human watching the race takes shift-notes that feed the pipeline if the automated feed drops. The recap is the priority output and the automation is the means.

**Drafted hyperbole slips through.** The endurance audience is particularly allergic to it. Hard regex check against a banned-phrase list ("epic", "incredible", "unstoppable", "redefined", "made history" unless it actually made history in a verifiable record-keeping sense). Block the draft if any are present.

**Athlete-bias drift.** Brand wants every recap to lead with their sponsored athlete. Over a quarter, this becomes obvious and the audience tunes out. The proportionality eval is the discipline.

**Cross-platform inconsistency.** Email subject says one headline, the social post says another, the website recap says a third. Pipeline output should generate the channel cuts from the same source, not in parallel.

**Wrong sport vocabulary.** Cycling vocabulary in a running recap, swimming terms in a cycling recap. The voice profile should be sport-aware. If the brand covers multiple sports, route through the right sub-profile.

## The pattern in practice

Illustrative scenarios that show common shapes race-recap automation takes. Specifics are illustrative and the patterns repeat.

**Premium cycling brand, scale-stage, the time-to-publish compress.** A brand publishing recaps 18 to 24 hours post-race. The pipeline typically takes average time-to-publish under an hour across a year of Tier 1 events. Email open rates on race-day sends lift materially because the recap catches the audience in the post-race window instead of the next morning.

**Marathon brand, growth-stage, the voice unlock.** A brand writing recaps that read like press releases. Pipeline plus endurance voice profile produces recaps that subscribers report as "the first recaps that sound like an actual fan wrote them." Open rates and share rates lift substantially. The voice was always the issue, the recap structure was fine.

**Triathlon brand, the sponsor-bias failure.** A common pattern in early versions is over-indexing on sponsored-athlete coverage even when those athletes finished outside the top 20. This is why the current pipeline includes the proportionality eval. Coverage should match actual race performance rather than sponsorship status. Brands have to accept that the recap is about the race, not the brand's roster. The shift feels counter-intuitive to sponsor-relations teams but recovers audience trust within a quarter.

## Hand-off

The recap engine feeds:
- **lifecycle-journey-builder** so race-day email touchpoints draw from the recap as content
- **social-content-factory** for channel-native cuts of the recap
- **earned-media-pitch** if the recap surfaces a genuine story angle that can be repurposed as a pitch to journalists
