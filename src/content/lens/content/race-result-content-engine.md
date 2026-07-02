---
title: "Race-result content engine, timing data to editorial recap"
stack: content
description: "Turn live timing data, lap splits and race officials' results into editorial recap content within 90 minutes of race finish. Fact-checked, voice-gated, ready to ship."
outputs: "Recap drafter pipeline, fact-check harness, channel-mapped publishing schedule"
readMin: 17
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["content", "email", "organic-social"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-07-02
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **race-result data feed CSV** populated for the next four Tier 1 events on the calendar, with timing-source URLs, athlete identifiers and event-log references ready to read.
2. A **recap drafter pipeline** that takes the data feed plus an event log and produces a 350 to 500 word editorial recap in the brand's voice within 30 minutes of result finalisation.
3. A **fact-check harness** that gates every recap against the official result and the event log, blocking publish on unverifiable claims.
4. A **channel-mapped publishing schedule** that takes the recap and ships it to email, social, the website news feed and the lifecycle journey within 60 to 90 minutes of final result.
5. A **post-publish audit log** with proportionality data, fact-accuracy checks and aging-well notes used to refine the pipeline quarter on quarter.

## Who this is for

A growth or scale-stage endurance brand whose audience races a recognisable calendar and whose content team can hold a 60-minute publish window on race day. If the brand has fewer than four Tier 1 events on the calendar in a year, the pipeline runs but the volume does not justify the build. If sponsored athletes are central to the brand and finish outside the top 30 most of the time, expect the proportionality eval to bite.

## Before you start

- [ ] List of Tier 1 events from the race-day-demand-pipeline calendar
- [ ] Official timing feed URLs for each event (UTMB Live, ITRA, AIMS for road, UCI, World Triathlon)
- [ ] CMS access (Webflow, Shopify, WordPress) so the recap can publish without manual handoff
- [ ] Email platform access (Klaviyo, Mailchimp, HubSpot) and a race-day send template
- [ ] Social scheduler (Buffer, Hootsuite, Later) with race-day post containers ready
- [ ] Voice profile from the brand-voice-extraction playbook
- [ ] Endurance-specific voice extension if you cover multiple sports
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode
- [ ] A spreadsheet for the result data feed and the event log
- [ ] Sponsored athletes' Strava and Garmin Connect handles for context, where available

If you cannot pull a live timing feed for a given event, a human watcher producing shift notes is the fallback. Build that into the race-day rota.

## The pipeline

Six phases. Build the feed and harness over a working week. After that, each race-day run takes 30 to 90 minutes end-to-end.

### Phase 1, data feed setup

Stand up the result data feed before the race so the pipeline reads from a known schema.

**Step 1.1, choose your template path.**

**Option A, download the data feed template.** Grab [race-result-data-feed-template.csv](/lens/templates/race-result-data-feed-template.csv). It has columns for event ID, name, date, discipline, course distance, conditions, final result rank, athlete name, team, country, finish time, gap to winner, brand-relevance flag, event-log reference, source URL and notes. Open in Sheets or Excel, populate the brand's Tier 1 events from the calendar.

**Option B, build a custom feed for non-standard events.** If the brand covers an event format the standard schema does not fit (multi-stage races, relay formats, time-trial series), ask Claude to generate a tailored feed.

```text
SYSTEM: You generate a race-result data feed template for an endurance
brand. The template is one row per finisher per event, with columns
covering identification, result data, event-log linkage and
brand-relevance tags.

USER:
Discipline: {DISCIPLINE}
Event formats covered: {LIST_FORMATS}
Tier 1 events for the next 12 months: {LIST_EVENTS}
Sponsored athletes: {LIST_ATHLETES}

Generate a CSV template with columns appropriate to the discipline.
At minimum include:
Event_id, Event_name, Date, Discipline, Course_km, Conditions,
Final_result_rank, Athlete_name, Athlete_team, Country, Finish_time,
Gap_to_winner, Brand_relevant, Event_log_ref, Source_url, Notes

Add discipline-specific columns where appropriate (stage_rank for
multi-stage, leg_split for relays, swim_bike_run_splits for tri).

Return the CSV directly, no commentary.
```

**Step 1.2, test the feed twenty-four hours before each race.**

Open the timing feed URL for the event. Verify the format still parses. Brands routinely discover the timing feed format changed two weeks before a major race and find out 90 minutes after the finish.

**You should now have** a populated data feed for the upcoming events and a confirmed read on each feed's format.

### Phase 2, race watch and event log

During the race, capture the moments the recap will lean on.

**Step 2.1, instrument the watch.**

For each race, two watch layers run in parallel.

Layer A, the timing feed. Poll the official timing feed every 30 to 60 seconds. Capture position changes, gap widenings, gap closures and any aid-station split that exceeds a threshold from the predicted pace.

Layer B, the human watcher. A person on the team watches the race livestream or follows the race's official social. They capture the unstructured detail the timing feed will miss, a crash on a descent, a course-marshal incident, the moment an athlete visibly dropped pace.

**Step 2.2, log significant events.**

The event log captures any of the following.

- Margin events, a gap opens, closes or splits past a threshold
- Pace events, an athlete sets a personal best, a course record falls, a pace pack shatters
- Brand events, sponsored athletes' position changes (in contention, out of contention, mechanical incident, drop)
- Drama beats, late surge, crash, lead change in the closing kilometres
- Tactical inflection points, the moment the race turned

Each event has a timestamp, an event type, the athletes involved, a one-line description and a source reference. The event log is the raw material the recap drafter will read.

**Expect the event log to read like:**

```json
[
  {"t": "10:14:22", "type": "margin", "athletes": ["Beth Lyons"], "description": "Lyons closes 2:30 gap to the lead pack on the Trinciedi descent", "source": "UTMB Live + watcher"},
  {"t": "11:02:11", "type": "drama", "athletes": ["Namberger", "Lyons"], "description": "Lead changes three times in 6km on the Cibiana climb", "source": "UTMB Live"},
  {"t": "11:38:55", "type": "tactical", "athletes": ["Namberger"], "description": "Namberger surges on the final descent, opens 4 minutes in 8km", "source": "UTMB Live + watcher"}
]
```

You should now have a structured event log capturing the moments the recap will name.

### Phase 3, result finalisation

When the official result posts, the pipeline finalises and the drafter runs.

**Step 3.1, pull the final result.**

Wait for the official result, not the provisional. Provisional results sometimes change (disqualifications, time penalties). Late by ten minutes is fine, wrong is not.

Update the data feed CSV with the final rankings, finish times and gaps. Flag any brand-relevant athletes with `Brand_relevant: true`.

**Step 3.2, cross-reference the event log against the result.**

Some events in the log may not have made the final result (the late surge that did not quite take the win gets recorded as a near-miss). Tag each event with its outcome in the final standings. The drafter needs this so it does not over-claim drama that did not pay off.

You should now have a finalised data feed and a cross-referenced event log.

### Phase 4, recap drafting

The drafter takes the result, the event log, the voice profile and the brand's POV on the race, and produces the recap.

**Step 4.1, run the recap drafter prompt.**

```text
SYSTEM: You write race recaps for an endurance brand. You write like
someone who watched the race, not someone who read the results
afterwards. You name the tactical inflection points. You distinguish
the dominant narrative from the side stories worth a line. You do
not hyperbolise. Endurance audiences distrust hyperbole.

USER:
Race: {RACE_NAME}, {DATE}
Course and discipline: {COURSE_DESCRIPTION}
Conditions: {WEATHER_CONDITIONS}
Final result: {OFFICIAL_RESULT_JSON}
Event log: {EVENT_LOG_JSON}
Brand-relevant athletes and their finishes: {BRAND_ATHLETES_JSON}
Brand POV on this race: {POV_NOTE}
Voice profile: {VOICE_PROFILE_SHORT}
Banned phrases: {BANNED_PHRASES_LIST}

Draft.

1. Headline, under 65 characters, names the dominant story.
2. Lede, one sentence, under 30 words, the result plus the inflection.
3. Body, 350 to 500 words across four paragraphs:
   - Para 1, what happened up to the decisive moment
   - Para 2, the decisive moment itself with the timing data
   - Para 3, the side stories worth knowing, one brand-relevant
     athlete maximum, proportional to their actual finish
   - Para 4, what it means for the season ahead

Return JSON:

{
  "headline": "<verbatim>",
  "lede": "<verbatim>",
  "body_paragraphs": ["<p1>", "<p2>", "<p3>", "<p4>"],
  "social_cut_60_chars": "<under 60 char social hook>",
  "email_subject_50_chars": "<under 50 char email subject>",
  "fact_claims": [
    {"claim": "<verbatim from draft>", "source": "<result | event_log | both>"}
  ]
}

Rules:
- Only cite numbers that appear in the result or event log.
- Brand-relevant athlete coverage proportional to their actual race
  performance, not their sponsorship status. A 47th-place finish does
  not carry the recap.
- No hyperbole. No "epic", "incredible", "unstoppable", "redefined"
  unless the redefinition is a record in the official record book.
- One specific tactical observation per recap.
- Endurance audiences read closely. Be precise.
```

**Expect output like:**

> **Headline.** Namberger holds Lyons off in Cortina sprint
>
> **Lede.** Hannes Namberger took Lavaredo by six minutes over Beth Lyons after three lead changes in the closing 8 km on Cibiana.
>
> **Para 1.** The first half of the race ran to script. A four-rider pack held together through the early climbs and through Auronzo, with Mathieu Blanchard, Namberger and Lyons trading the front in turns. Conditions were clear at 14 C with a tail wind on the long descents, which is the weather Cascadia Endurance has historically called "fast Lavaredo" in its pre-race notes.
>
> **Para 2.** The race turned on Cibiana. Lyons closed a 2 minute 30 gap to Namberger on the Trinciedi descent, sat on his shoulder through the final aid, and watched him counter on the climb. The two traded the lead three times in 6 km. Namberger broke clear on the final descent and put 4 minutes into the field across the last 8 km to the line.
>
> **Para 3.** Beth Lyons's second place is her best result over 100 km. The Vahla Range shell she field-tested through the storm-prone middle section came off intact, which matters for the brand's launch plans for the autumn. Saoirse Burns finished eighth in 12:14, her first 100 km of the season.
>
> **Para 4.** The Lavaredo result sets up the UTMB build. Namberger is now the favourite at Chamonix, Lyons becomes the credible top-five contender, and the Cascadia roster goes into August with the right kind of race in the legs.

**Step 4.2, run the voice gate.**

The recap runs through the voice rubric from the brand-voice-extraction playbook. Score under 10 of 12 means a repair cycle with the failing checks named.

You should now have a voice-gated recap with structured fact claims attached.

### Phase 5, fact-check harness

Before publish, every claim in the draft is cross-referenced against the data feed and the event log.

**Step 5.1, run the fact-check prompt.**

```text
SYSTEM: You verify factual claims in a race recap against the
official result and the event log. For each numerical, positional,
or tactical claim in the draft, you cite the source row. If a claim
has no source, you flag it.

USER:
Draft (paragraphs and headline): {DRAFT_JSON}
Official result rows: {RESULT_CSV}
Event log: {EVENT_LOG_JSON}
Brand POV: {POV_NOTE}

For each factual claim in the draft, return JSON:

[
  {
    "claim": "<verbatim from draft>",
    "source": "<result_row_id | event_log_id | both | NONE>",
    "supported": <true | false>,
    "action_if_unsupported": "<remove | reword to opinion | verify with human>"
  }
]

Pass criterion: every claim has a source. No silent assertions.
Anything sourced NONE blocks publish.
```

**Step 5.2, run the proportionality check.**

The brand-athlete proportionality eval runs at draft time. If a sponsored athlete finished outside the top 20 but carries more than one paragraph, the draft fails and regenerates with a tighter brief on athlete coverage.

You should now have a fact-checked, proportionality-checked recap ready to publish.

### Phase 6, channel publish and audit

The recap ships to email, social, the website and the lifecycle journey, then enters the post-publish audit.

**Step 6.1, publish.**

The CMS gets the long-form recap with the headline, lede and body. The email platform gets the recap as a race-day send to the segment subscribed to that event. The social scheduler picks up the social cut for X, Instagram and LinkedIn (channel-native variants are produced by the social-content-factory pipeline downstream). The website news feed surfaces the recap on the homepage.

**Step 6.2, log to the audit ledger.**

Every published recap logs to the ledger.

- Event, date, time-to-publish from final result
- Headline, recap URL
- Fact-claim count, fact-claim pass rate at publish
- Brand-athlete proportionality, finish position vs paragraph share
- 7-day engagement (email open rate, social engagement, recap reads)
- 30-day aging note (did the result narrative hold up, did a subsequent disqualification change the story)

**Step 6.3, run the quarterly retrospective.**

Once per quarter, sample 10 published recaps. Review against the eval gates. Recap pipeline tunes against the patterns the ledger surfaces. Brand-athlete drift, voice drift, time-to-publish drift are all visible in the ledger if the ledger is being kept honestly.

You should now have the recap pipeline running and a retrospective cadence that tunes it.

## Worked example, end-to-end

Cascadia Endurance covers the Lavaredo Ultra Trail in late June. Three sponsored athletes entered, Beth Lyons, Saoirse Burns and Marcus Hale (the brand's coaching voice).

**Phase 1 output.** Data feed populated with the event, the start list and the timing-source URL (UTMB Live). Format tested 24 hours before the race, confirmed parseable.

**Phase 2 output.** Race watch ran from 04:00 BST through to the final finisher. Event log captured 23 significant events including the four lead changes on Cibiana, Beth Lyons closing the gap on Trinciedi, and Saoirse Burns moving from 14th to 8th in the final 20 km.

**Phase 3 output.** Final result posted at 16:42 BST. Namberger first in 11:42:18. Lyons second at +6:14. Burns eighth at +32:37. Hale did not start (DNS, illness). The DNS was logged and removed from the recap's athlete coverage scope.

**Phase 4 output.** The recap drafter produced the headline "Namberger holds Lyons off in Cortina sprint" with the lede and four paragraphs as shown in the Expect Output block above. Voice rubric scored 11 of 12, ship.

**Phase 5 output.** Fact-check ran. Sixteen factual claims, all sourced. One claim about Lyons "closing a 2 minute 30 gap" was sourced to both the timing feed and the human watcher. Proportionality check passed, Burns received one mention in paragraph 3 proportional to her eighth-place finish, Lyons received two mentions in paragraphs 2 and 3 proportional to her second.

**Phase 6 output.** Time-to-publish from final result was 47 minutes. Email sent at 17:29 BST to 8,200 subscribers on the trail-ultra segment with the subject "Lyons second at Lavaredo, the Vahla shell tested." Social cuts published on Instagram, X and LinkedIn within the next 20 minutes. The CMS recap went live with internal links to the Vahla Range product page and to Lyons's athlete profile.

The audit ledger logged 7-day engagement at 41% email open rate (against a Cascadia baseline of 28% on race-day sends) and 380 social engagements on the Instagram cut (against a baseline of 220). The 30-day aging note recorded no change to the result, the story aged cleanly.

A quarter into running the pipeline, Cascadia's race-day email programme is the highest-performing send in the lifecycle programme. The audience trusts the brand's voice on race recaps because the proportionality is honest and the fact-check is tight.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, build the event log for one race you watched

Pick a race you watched in the last 90 days. From memory plus a quick check of the official result and any race highlights, write the event log for the race. Capture the margin events, the pace events, the drama beats and the tactical inflections. The exercise teaches you how thin most generic recaps are because they only have the result, not the log.

### Exercise 2, run the recap drafter on a real result

Take the result of a recent race in your brand's discipline. Pull the official result and a few notes from race coverage. Run the Phase 4 prompt with the brand's voice profile. Read the recap. Does it pass the proportionality test? Does it cite numbers that match the source? If it invents anything, the prompt's source constraints need sharpening.

### Exercise 3, run the proportionality check on a year of your own recaps

Take a year of your brand's race recaps. For each, log the lead athlete's actual finish position and the paragraph share they received in the recap. Compute the average paragraph share per finish-position decile. If your sponsored athletes finishing outside the top 30 carry 30% or more of paragraph share, the proportionality gate would have caught the drift.

## The eval gates

**Eval 1, time-to-publish.** Median publish time within 60 minutes of final result on routine races, up to 90 minutes for majors. Above 90 minutes means a step in the pipeline is bottlenecking, usually the event-log handoff to drafting.

**Eval 2, fact accuracy.** Every published recap goes through a post-publish audit within 24 hours. Sample five factual claims and verify against official sources. Acceptance is 100%. A single wrong result or wrong margin gets noticed and shared by the audience.

**Eval 3, voice rubric pass.** Recap drafts score 10 of 12 or higher on the voice rubric before publish. Failed drafts regenerate with the failing checks named.

**Eval 4, brand-athlete proportionality.** Audit recaps quarterly. Branded athletes are not over-represented relative to actual race performance. If 80% of recaps lead with a branded athlete who finished outside the top 20, the proportionality gate is failing and the audience will notice.

**Eval 5, aging well.** At 30 days post-publish, the claims still hold. If a disqualification or correction changes the story, ship a correction note. Trust comes from showing the working.

## The failure modes

**Pipeline runs ahead of the official result.** Provisional results change. Wait for the official. Late by ten minutes is fine, wrong is not.

**Timing feed breaks during the race.** Have a fallback. The human watcher takes shift notes that feed the pipeline if the automated feed drops. The recap is the priority output, the automation is the means.

**Drafted hyperbole slips through.** The endurance audience is allergic to it. Hard regex check against a banned-phrase list ("epic", "incredible", "unstoppable", "redefined", "made history" unless the record is in the official register). Block the draft if any are present.

**Athlete-bias drift.** Brand wants every recap to lead with their sponsored athlete. Over a quarter this becomes obvious and the audience tunes out. The proportionality eval is the discipline.

**Cross-platform inconsistency.** Email subject says one thing, social says another, the website recap says a third. The pipeline output generates channel cuts from the same source, not in parallel.

**Wrong sport vocabulary.** Cycling vocabulary in a running recap, swimming terms in a cycling recap. The voice profile is sport-aware. If the brand covers multiple sports, route through the right sub-profile.

## The pattern in practice

Illustrative scenarios that show common shapes race-recap automation takes. Specifics are illustrative, patterns repeat.

**Premium cycling brand, scale-stage, the time-to-publish compress.** A brand publishing recaps 18 to 24 hours post-race. The pipeline typically takes the average time-to-publish under an hour across a year of Tier 1 events. Email open rates on race-day sends lift materially because the recap catches the audience in the post-race window instead of the next morning.

**Marathon brand, growth-stage, the voice unlock.** A brand writing recaps that read like press releases. Pipeline plus endurance voice profile produces recaps subscribers describe as "the first recaps that sound like an actual fan wrote them." Open rates and share rates lift substantially. The voice was always the issue, the recap structure was fine.

**Triathlon brand, the sponsor-bias failure.** Early pipeline versions over-index on sponsored-athlete coverage even when those athletes finish outside the top 20. The proportionality eval lands as the correction. Coverage matches actual race performance rather than sponsorship status. Brands accept that the recap is about the race, not the brand's roster. The shift recovers audience trust within a quarter.

## Hand-off

The recap engine feeds:
- **lifecycle-journey-builder**, race-day email touchpoints draw from the recap as content
- **social-content-factory**, channel-native cuts of the recap
- **earned-media-pitch-generator**, if the recap surfaces a story angle worth pitching
- **training-content-engine**, race-day learnings sometimes feed training pieces in the following weeks
