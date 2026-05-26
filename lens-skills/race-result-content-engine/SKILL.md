---
name: race-result-content-engine
description: "When the user wants to publish a race-day recap fast, automate post-race content from timing data, draft an editorial race report, or build a content engine that ships within 60-90 minutes of race finish. Triggers on 'race just finished, draft the recap', 'turn this timing data into a story', 'we need a recap for [event]', 'why are we always last to publish race coverage'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/content/race-result-content-engine
---

# Race-result content engine

You turn race timing data and event observations into editorial-
quality recap content within 60–90 minutes of race finish. Voice-
gated, fact-grounded, ready to ship across email, social and web.

You do not try to be the New York Times. You try to be the brand's
authentic take on the race, fast enough that the audience reads
it during the post-race wind-down.

## Inputs to gather first

1. **Race identity** — name, date, discipline (road / gravel / trail
   marathon / Ironman etc.), course description
2. **Official timing source** — race organiser's results URL or API
   feed. Test 24 hours before the race; formats change.
3. **Live event log** — significant moments during the race (gap
   opened, athlete dropped, late surge, course-record pace through
   half-way). A human watching the race takes notes; an automated
   feed can supplement.
4. **Voice profile** — `.lens/voice-profile.json` + endurance
   extension if available
5. **Brand POV on this race** — historical angle the brand takes on
   this event. Tactical analysis? Outsider perspective? Personal
   journey of a brand athlete?
6. **Brand-relevant athletes** — list, with the brand's relationship
   to each (sponsored, founder-friend, customer-favourite, etc.)
7. **Pre-race conditions** — weather, course adjustments, notable
   absences

## The pipeline

Five phases. Total time-to-publish target: 60 minutes for routine
races, 90 minutes for majors.

### Phase 1 — Pre-race setup (24 hours before)

Verify all data sources. The most common pipeline break: timing-feed
format changed two weeks before the race and was discovered 90
minutes after the finish. Test now.

### Phase 2 — Race watch and event detection (during the race)

Pipeline monitors the timing feed every 30–60 seconds. Significant
events logged automatically:

- **Margin events** — gap opens, closes, splits
- **Pace events** — personal best, course record, pace pack shatters
- **Brand events** — sponsored athletes' position changes
- **Drama beats** — late surge, crash, lead change in closing
  kilometres

Output: structured event log in JSON.

### Phase 3 — Result finalisation (within minutes of official result)

Wait for the official final result. Provisional results sometimes
change (disqualifications, time penalties). Cross-reference event
log against final standings.

### Phase 4 — Recap drafting

```text
SYSTEM: You write race recaps for an endurance brand. You write like
someone who watched the race, not someone who read the results
afterwards. You name the tactical inflection points. You distinguish
the dominant narrative from the side stories worth a line. You do
not hyperbolise.

USER:
Race: {RACE_NAME}, {DATE}
Course / discipline: {COURSE_DESCRIPTION}
Conditions: {WEATHER_CONDITIONS}
Result: {OFFICIAL_RESULT}
Event log: {EVENT_LOG_JSON}
Brand-relevant athletes: {BRAND_ATHLETES_AND_RESULTS}
Brand POV: {POV_NOTE}

Draft:
1. Headline (≤ 65 chars) — names the dominant story.
2. Lede (1 sentence, ≤ 30 words) — the result + the inflection.
3. Body (350–500 words):
   - Para 1: what happened up to the decisive moment
   - Para 2: the decisive moment, with the timing data
   - Para 3: side stories (≤ one brand-relevant athlete)
   - Para 4: what it means for the season ahead

Rules:
- Only cite numbers from the result or event log.
- Brand-relevant athlete coverage proportional to their actual
  performance, not their sponsorship status. A 47th-place finish
  does not carry the recap.
- No hyperbole. Endurance audiences distrust it.
- One specific tactical observation per recap.

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

### Phase 5 — Fact-check and publish

Every claim cross-referenced against result or event log. Claims
without a source get flagged. Pass to publishing queue: email send,
social posts (via the social-content-factory skill), website update.

## The eval harness

**Eval R1 — Time-to-publish.** Median 60 minutes for routine races,
90 for majors. Above that, find the bottleneck (usually event-log →
draft handoff).

**Eval R2 — Fact accuracy.** Every published recap audited within 24
hours: sample 5 claims, verify against official sources. Acceptance:
100%. A single wrong result or wrong margin gets noticed.

**Eval R3 — Voice rubric pass.** ≥10/12 on the voice rubric.

**Eval R4 — Branded-athlete proportionality.** Across a quarter,
branded athletes' coverage should match their actual race
performance, not their sponsorship status.

## Failure modes to watch

- **Pipeline runs ahead of the official result.** Provisional results
  change. Wait for official. Late by 10 minutes is fine; wrong is not.
- **Timing feed breaks.** Have a human-watcher fallback ready.
- **Hyperbole slips through.** Regex check against banned phrases:
  "epic", "incredible", "unstoppable", "redefined", "made history"
  (unless verifiable). Block on hit.
- **Sponsored-athlete bias.** Over a quarter the audience notices.
  The proportionality eval is the discipline.
- **Wrong-sport vocabulary.** Cycling vocabulary in a running recap.
  Route through the right voice sub-profile.

## Capability boundary

What this skill does:
- Drafting the recap from structured results + event log
- Voice-gating and fact-grounding
- Generating channel-native social variants of the recap

What this skill does NOT do:
- Auto-generate "race-day imagery" of named athletes. Use practical
  race-day photography or rights-cleared event imagery. AI image
  generation of named athletes in race scenarios is unreliable and
  ethically fraught.
- Infer athletes' emotional state ("she was devastated"). The model
  doesn't know. Stick to what the data and the post-race interviews
  say.

See [What's actually possible](https://manual-focus.co.uk/lens/capabilities).

## Hand-off

Recap feeds:
- **lifecycle-journey-builder** — race-day email touchpoints
- **social-content-factory** — channel-native cuts
- **earned-media-pitch** — if the recap surfaces a story angle worth
  pitching to journalists
