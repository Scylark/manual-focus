---
title: "Race-day demand pipeline, campaigns timed to the calendar"
stack: demand
description: "Build a twelve-month campaign calendar timed to spring classics, marathon majors, gran fondos and trail-ultra majors. Pre-event, event-day and post-event lines ready by month."
outputs: "Annual calendar, per-event campaign briefs, creative inventory plan, production lead-time schedule"
readMin: 24
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["paid-search", "paid-social", "email", "organic-social", "content"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-06-11
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts:

1. An **annual event calendar** with every Tier 1 anchor event, every Tier 2 visibility event and every Tier 3 audience moment plotted across the next twelve months, dated, scored and owned.
2. A **per-event campaign brief** for each Tier 1 event covering hook, audience segments, pre-event creative, event-day creative and post-event creative, with the brief-to-ship template extended for the endurance specifics.
3. A **creative inventory plan** per campaign listing every asset (long-form, email, social, paid creative, video) and tagging which assets need real footage versus which can use AI augmentation.
4. A **production lead-time schedule** working backwards from each event with shoot dates, edit deadlines and AI-augmentation windows, locked twelve months out for Tier 1.
5. A **paid programme integration** per campaign with spend allocation, bid floors, audience targets and creative rotation schedule for each event window.

## Who this is for

A growth or scale-stage endurance brand whose audience plans their year around a recognisable set of events, with a marketing lead who can hold a twelve-month calendar in their head and a content lead who can run a multi-day shoot. If the brand operates in a category without a defining race calendar (functional fitness, climbing, certain combat sports), the playbook adapts but the lead-time discipline is the import.

## Before you start

- [ ] List of the events the brand's audience races (covering at least Tier 1 and Tier 2), with dates for the next 12 months, sourced from official organiser calendars (UTMB World Series, Abbott World Marathon Majors, Ironman, World Triathlon, UCI)
- [ ] Audience segmentation showing which segments race which events
- [ ] A production crew (photographer plus videographer) with capacity to shoot three to five events per year, or budget to contract one
- [ ] Sponsored athletes with content rights that allow event-window capture and AI augmentation (see ambassador-programme for the contract template)
- [ ] An archive structure for captured footage with tagging by athlete, event, weather and product
- [ ] Paid-media budget split across the calendar with the brand's share of voice goals per event window
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode
- [ ] A project tool (Notion, Asana, Linear) to host the briefs and the production schedule

The calendar is the source of truth. If you cannot block 12 months of audience events, start with 6 and build out.

## The pipeline

Six phases. Building the calendar and writing the Tier 1 briefs takes a working week. The production scheduling and paid programme integration follow over the next two weeks.

### Phase 1, event taxonomy

Build the calendar at three tiers.

**Step 1.1, download the calendar template.**

Grab [race-day-calendar.csv](/lens/templates/race-day-calendar.csv). Open in Sheets or Excel. The columns cover event name, date, discipline, tier, audience segments, hook angle, pre-event start, event day, post-event end, asset inventory count, shoot required, AI augmentation scope, paid spend, brief owner and status.

**Step 1.2, populate the three tiers.**

- **Tier 1, anchor events.** The 6 to 10 events the brand's audience cares about most. Worth a real campaign each. For a trail-running brand, the anchors are usually UTMB, Lavaredo Ultra Trail, Western States, Hardrock, plus 2 to 3 regional anchors. For a marathon brand, the six Abbott majors plus 2 to 3 regional finals. For a cycling brand, the spring classics, the three Grand Tours, plus L'Étape and Haute Route.
- **Tier 2, visibility events.** 15 to 25 events where the brand participates lightly (paid creative variant, email touch, social acknowledgement). Regional gran fondos, regional marathons, mid-tier ultras.
- **Tier 3, audience moments.** Non-event triggers that still cluster the audience. Training-season start, taper periods, off-season building, base-training months. Lighter touch but important for non-racers.

**Step 1.3, build a custom calendar template if your sport differs.**

```text
SYSTEM: You generate a race-day calendar template for an endurance
brand based on their sport, geography and audience. The template
covers 12 months and includes the standard tier columns plus any
sport-specific fields.

USER:
Sport and discipline: {DISCIPLINE}
Target geographies: {LIST_COUNTRIES}
Audience segments: {LIST_SEGMENTS}
Sponsored athletes' race calendars: {LIST_OR_NONE}

Generate a CSV template with:
Event_name, Date, Discipline, Tier, Audience_segments, Hook_angle,
Pre_event_start, Event_day, Post_event_end, Asset_inventory_count,
Shoot_required, AI_augmentation_scope, Paid_spend_GBP, Brief_owner,
Status

Pre-fill the event list with the anchor events relevant to the brand
and tier-1-suggest the regional events.

Return CSV directly, no commentary.
```

You should now have the year mapped across three tiers, with at least the dates and tiers populated.

### Phase 2, per-event campaign scoping

For each Tier 1 event, a full campaign brief. Tier 2 and Tier 3 get lighter briefs.

**Step 2.1, run the campaign brief prompt.**

```text
SYSTEM: You scope a campaign brief for a brand's Tier 1 anchor event.
The brief covers hook, audience segments, pre-event creative window,
event-day creative and post-event content sprint. You write in plain
language suitable for the marketing team to brief the creative team.

USER:
Event: {EVENT_NAME}
Date: {DATE}
Brand: {BRAND}
Brand audience segments: {LIST_SEGMENTS}
Sponsored athletes participating: {LIST_OR_NONE}
Available archive footage from this event historically: {SUMMARY_OR_NONE}
Brand's product range relevant to this event: {LIST_SKUS}
Twelve-month brand narrative: {SUMMARY}

Return JSON:

{
  "event": "<name>",
  "hook": "<one-sentence event-specific angle, in buyer language>",
  "audience_segments_targeted": ["<segment names>"],
  "pre_event_creative": {
    "window_start_weeks_before": <int>,
    "window_end_weeks_before": <int>,
    "primary_pieces": ["<piece types>"],
    "messaging_anchor": "<what carries the brand into attention>"
  },
  "event_day_creative": {
    "channels": ["<channels active on the day>"],
    "athlete_acknowledgement_plan": "<one sentence or null>",
    "live_reactive_capacity": "<what the brand can ship within 4 hours of an athlete result>"
  },
  "post_event_creative": {
    "window_end_weeks_after": <int>,
    "recap_angle": "<the angle, not a generic recap>",
    "long_tail_pieces": ["<piece types>"]
  },
  "endurance_specifics": {
    "lead_time_required_weeks": <int>,
    "real_footage_dependency": "<list>",
    "ai_augmentation_scope": "<list>"
  }
}

Rules:
- "hook" is in buyer language. Cobblestones for Roubaix. The long
  Sunday for L'Étape. The wall at mile 21 for marathon. The
  decision at Courmayeur for UTMB.
- "athlete_acknowledgement_plan" is specific, not "we will
  congratulate the athlete."
- "lead_time_required_weeks" reflects the shoot-dependent pieces
  in the inventory.
```

**Step 2.2, walk the briefs with the leadership team.**

A 60-minute call to walk the Tier 1 briefs with the marketing lead, the content lead and the head of brand. Edits land here. Approval moves the briefs into production scheduling.

You should now have Tier 1 briefs the team has signed off on.

### Phase 3, creative inventory plan

For each campaign, every asset listed and tagged.

**Step 3.1, build the inventory per campaign.**

The standard inventory for a Tier 1 campaign:

- Long-form blog or page (1 to 2 per event)
- Email touchpoints (3 to 5 per campaign across pre, day, post)
- Social posts (8 to 15 per campaign across channels)
- Paid creative variants (3 to 6 per campaign)
- Video assets (1 to 3 short clips per campaign, plus optional long-form film if the event warrants)

**Step 3.2, tag each asset by capability.**

```text
SYSTEM: You tag each asset in a campaign creative inventory by
whether it needs real footage, can use AI augmentation, or can use
generic AI assets. You apply the capability boundary strictly.

USER:
Campaign: {EVENT_NAME}
Inventory list: {PASTE_INVENTORY}

Real footage is needed when the asset:
- Shows a named athlete the brand sponsors
- Shows the brand's actual product on a specific course or in a
  specific named environment
- Carries the brand's name in a recap pretending to be live

AI augmentation is suitable when the asset:
- Adapts a real captured asset (time-of-day, weather, environment)
- Extends a captured asset into multiple social cuts
- Generates environmental b-roll for atmosphere

Generic AI is suitable when the asset:
- Is editorial illustration for an article
- Is a category image without named athletes or products

Return JSON:

{
  "tagged_inventory": [
    {
      "asset": "<description>",
      "capability_tag": "<real_footage_required | ai_augmentation | generic_ai>",
      "rationale": "<one sentence>",
      "feasible_with_current_archive": <true | false>
    }
  ],
  "shoot_required": <true | false>,
  "archive_gaps": ["<missing footage that the shoot must capture>"]
}

Rules:
- Apply the capability boundary strictly. When in doubt, mark
  "real_footage_required."
- Identify archive gaps explicitly. The shoot brief depends on
  them.
```

You should now have a tagged inventory per campaign and an archive-gap list per event.

### Phase 4, production lead time

Work backwards from each event date.

**Step 4.1, set the standard lead times.**

| Asset type | Lead time |
|---|---|
| Photography or video shoot (athlete plus product) | 6 to 12 weeks before publish date |
| Licensing existing sponsored-rider footage | 8 to 10 weeks |
| AI-augmented social cuts and environmental b-roll | 2 to 3 weeks |
| Long-form blog or editorial | 3 to 4 weeks |
| Email touchpoints (in voice, in journey) | 2 weeks |
| Paid creative variants | 2 to 3 weeks |

**Step 4.2, plot the production calendar.**

Take each Tier 1 event and work backwards. The shoot date for a Tier 1 event in August is May or June. The shoot for an October event is July or August. Avoid double-booking the production crew.

**Step 4.3, build the contingency.**

Weather and athlete-injury contingency for each shoot. Identify a backup window and a backup athlete or product if the primary plan falls through.

You should now have a production calendar with no double bookings and a contingency plan.

### Phase 5, paid programme integration

For each campaign, the paid programme brief.

**Step 5.1, scope the paid spend per event.**

```text
SYSTEM: You scope the paid programme for a Tier 1 anchor event
campaign. You return a spend allocation, bid floors, audience
targets and a creative rotation schedule across the pre, day and
post windows.

USER:
Event: {EVENT_NAME}
Tier: {TIER}
Campaign brief: {PASTE_BRIEF}
Annual paid budget available for event campaigns: {GBP}
Brand's percent of voice goal during the event window: {PCT}
Channels active: {LIST}

Endurance-audience targeting tells:
  Strava clubs: {AVAILABLE_OR_NOT}
  Garmin Connect IQ usage: {AVAILABLE_OR_NOT}
  Race-entry data partners: {AVAILABLE_OR_NOT}

Return JSON:

{
  "event": "<name>",
  "total_spend_gbp": <int>,
  "pre_event_window": {
    "spend_gbp": <int>,
    "primary_channels": ["<channels>"],
    "bid_floors": {"<channel>": <int>},
    "audience_targets": ["<targeting descriptions>"],
    "creative_rotation": "<how creative rotates within the window>"
  },
  "event_day_window": {
    "spend_gbp": <int>,
    "primary_channels": ["<channels>"],
    "reactive_capacity": "<plan for athlete-result-triggered creative>"
  },
  "post_event_window": {
    "spend_gbp": <int>,
    "primary_channels": ["<channels>"],
    "audience_targets": ["<retargeting and lookalike specifics>"]
  }
}

Rules:
- Bid floors reference the paid-search-bidding-agent's brand-
  keyword floors where relevant.
- Audience targets name specific signals, not "people interested
  in trail running."
- Pre-event spend is typically 40 to 55% of total, event-day 15 to
  25%, post-event 30 to 40%.
```

You should now have a paid programme brief per Tier 1 campaign.

### Phase 6, calendar lock and instrumentation

The full annual calendar gets one source-of-truth document. Each campaign carries its own brief artefact and creative inventory plan.

**Step 6.1, lock the calendar.**

The marketing lead signs off on the full calendar at the start of the year. Q4 of the prior year is the latest the brand can leave this. Anchor events earlier in Q1 of the calendar year need to be locked by November.

**Step 6.2, instrument the post-event retrospective.**

Within 14 days of each Tier 1 event, the brand logs what worked, what did not, what the engagement delta against prior year was, what the budget consumed. Next year's calendar inherits the learnings.

You should now have a locked twelve-month calendar with retrospective instrumentation.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand, scale-stage, with the Vahla Range sub-brand launching for the summer ultra season.

**Phase 1 output.** Calendar populated. Tier 1 events for the year, UTMB (28 August), Lavaredo Ultra Trail (25 June), Western States (28 June), Hardrock (10 July), Trail World Championships (October), plus the brand's own Snowdonia trail event in September. Tier 2 has 18 regional ultras across UK and Europe. Tier 3 has eight audience moments, including the base training season start in November and the spring taper window in March.

**Phase 2 output.** Six Tier 1 briefs written. The UTMB brief lands the hook as "The decision at Courmayeur," anchored to the moment ultra runners make the call to drop or push on. The lead time is 12 weeks because the brief depends on shoot footage Cascadia is capturing in July with sponsored athlete Beth Lyons. The post-event window runs 14 days for the recap, then 8 weeks of long-tail drip.

**Phase 3 output.** UTMB inventory at 22 assets. 9 require real footage (the Beth Lyons shoot covers 7, the remaining 2 are archive footage Cascadia already has). 11 can use AI augmentation (time-of-day variants of the Courmayeur shoot, social cuts in different aspect ratios). 2 are generic AI (editorial illustration for the long-form blog header). The archive-gap list flags one missing asset, a low-light shot of the Vahla shell on a runner's pack at dusk, which gets added to the Beth Lyons shoot brief.

**Phase 4 output.** Production calendar plotted. Beth Lyons shoot dated 8 to 10 July at Chamonix. Backup window 22 to 24 July if weather fails. The Snowdonia event shoot is 28 to 29 July with the contingency of switching to indoor product stills if the weather is unworkable. Lavaredo content uses licensed sponsored-rider footage from the event organiser, secured 10 weeks ahead.

**Phase 5 output.** Paid programme briefs. UTMB total spend £45k. Pre-event window £22k across paid social Meta and paid search with the Vahla-launch creative running 17 to 27 August. Event day window £8k for reactive creative triggered by Beth Lyons's split times. Post-event window £15k for retargeting and lookalike against the engaged audience.

**Phase 6.** Calendar locked in November of the prior year. The marketing lead signs off. The retrospective instrumentation lands as a recurring 14-day-post task in Asana for each Tier 1 event.

After UTMB, the retrospective shows the Courmayeur hook was the highest-performing piece of creative the brand has shipped, the post-event film's first-week views beat the prior year's UTMB film 2.4x, and the launch of the Vahla shorts during the post-event window outperformed the launch of the shells (because the shorts had been seeded with coaches and the shells had not).

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, build a 6-event Tier 1 calendar for your brand

Pick your six anchor events for the next 12 months. Plot the dates. Note the audience segments per event. The exercise teaches you whether the brand actually has six anchor events, or fewer (which is a real finding), or many more (which probably means Tier 2 has crept into Tier 1).

### Exercise 2, write the campaign brief for one Tier 1 event

Pick your highest-priority Tier 1 event. Run the Phase 2 prompt with your real inputs. Read the hook. The hook should pass the "can a buyer say this back to me" test. If the hook is "celebrate the spirit of the race," the brief is not ready, regenerate with sharper audience inputs.

### Exercise 3, tag the inventory for one campaign

Take one campaign's inventory. Run the Phase 3 prompt. Read the capability tags. Count the assets tagged "real_footage_required." If the count exceeds what the production crew can deliver in the lead time, either reduce the inventory or move the shoot earlier. The exercise prevents the most common failure mode, committing to assets the brand cannot ship.

## The eval gates

**Eval 1, calendar coverage.** Every Tier 1 event has a complete brief by Q4 of the prior year. Tier 2 events have a brief by 60 days prior. Tier 3 audience moments have at minimum an email touchpoint planned.

**Eval 2, lead-time honesty.** No campaign's photography or video lead time is shorter than 6 weeks for shoots or 2 weeks for AI-augmented work. Cramming destroys quality, especially on named-athlete shoots that cannot be redone.

**Eval 3, capability honesty.** Every asset tagged "AI generated" passes the capability check. If a brief calls for "AI-generated video of our sponsored rider on the climb," it gets bounced back. That is a shoot, not an AI deliverable.

**Eval 4, post-event retrospective.** Within 14 days of each Tier 1 event, the brand logs the retrospective. Missing or skipped retrospectives compound into the next year's calendar being weaker than this year's.

**Eval 5, calendar drift.** Quarterly check on whether Tier 2 events have crept into Tier 1 effort levels without crossing the tier threshold. Drift here is the silent budget killer.

## The failure modes

**Treating every event the same.** A Tier 3 audience moment does not need a hero film. The brand burns budget treating a regional gran fondo like a major. The taxonomy is the discipline, three tiers each with a different shape of effort.

**Lead times collapse under pressure.** Marketing leadership commits to a Tier 1 campaign 4 weeks out. The shoot does not happen. The campaign uses AI-generated assets that misrepresent the product. The audience notices. The audience does not forget. Hold the lead time.

**Ignoring the calendar's audience signal.** When you build the calendar from event dates, you have built it from when races happen. The audience also cares about training moments such as the start of base training, the spring breakthrough block, the taper. Tier 3 is where you serve those non-event moments.

**Athlete sponsorship without content rights.** The brand signs athletes without explicit content-rights agreements that cover AI augmentation. A year later, the brand wants to extend a shoot's footage with AI variants and the contract does not cover it. Build AI augmentation language into the sponsorship contract from day one (see ambassador-programme).

**Recap fatigue.** Brands post the same race-day congratulations template every event. Audience numbness sets in quickly. The recap changes with each event, sometimes a results focus, sometimes a "what surprised us" angle, sometimes a forward look to the next race.

## The pattern in practice

Illustrative scenarios that show common shapes the race-day calendar takes. Specifics are illustrative and the patterns repeat.

**Premium cycling brand, scale-stage, the calendar reclaim.** A brand operating without a calendar, with campaigns assembled in the two or three weeks before each event. Building a 14-month rolling calendar with Tier 1 events locked, shoots scheduled and AI augmentation planned typically lifts year-over-year campaign performance materially. Most of the lift comes from better creative quality (no longer arriving rushed) and better paid programme prep (audience targeting and bids set 30 days out instead of day-of).

**Running brand, growth-stage, the regional rebalance.** A brand over-investing in the six majors and under-serving the regional half-marathon and 10k calendar where its actual audience races. Recalibrating to a handful of majors plus a deeper bench of regional races plus dedicated taper-week content typically lifts engagement in the regional segments substantially. The audience feels seen for the first time outside marathon weekend.

**Triathlon brand, the capability-boundary failure.** A calendar is built and the brand commits to AI-generated rider footage to fill creative gaps where the shoot falls through. The output looks like AI even to non-cyclists. The audience notices and calls it out publicly. This is why the capability boundary is non-negotiable. If the shoot cannot happen, the campaign reduces and AI does not try to substitute for the unshippable artefact.

## Hand-off

The race-day calendar feeds:
- **brief-to-ship-pipeline**, execution of individual campaigns
- **lifecycle-journey-builder**, email touchpoints per event
- **social-content-factory**, channel-native event posts
- **race-result-content-engine**, post-event recap automation
- **event-sponsorship-playbook**, sponsorship tier decisions align with calendar tiers
- **ambassador-programme**, athlete shoot dates feed the production calendar
