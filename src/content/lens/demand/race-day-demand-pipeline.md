---
title: "Race-day demand pipeline — campaigns timed to the calendar"
stack: demand
description: "Build a year-long campaign calendar timed to the spring classics, marathon majors, gran fondos and Ironman season. Pre-event, event-day and post-event content lines ready by month."
outputs: "Annual race-day calendar, campaign briefs, creative inventory plan"
readMin: 13
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["paid-search", "paid-social", "email", "organic-social", "content"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-06-11
status: live
preview: false
---

## The brief

Endurance sport runs on a calendar. The spring classics fall on the
same weekends every year. London, Tokyo, Boston, Berlin, Chicago and
New York anchor the marathon majors. Gran fondos cluster in May and
September. Ironman 70.3 starts in March and finishes in November. The
audience plans their year around these moments — and the brands that
plan with them earn the demand.

Most endurance brands run campaigns reactively. A race weekend lands,
the social team posts a generic congratulations, the email goes out
two days late, the paid creative is the same one that ran in March.
The brands compounding past them have a campaign calendar built
twelve months ahead, with creative inventories planned per event,
and a paid programme that doesn't get assembled the week of the race.

This playbook builds that calendar. It maps the brand's audience
events to a calendar, scopes the campaign per event (pre-event,
event-day, post-event), produces the creative inventory plan, and
schedules production with realistic lead times.

## The pipeline

Six phases.

**Phase 1 — Event taxonomy.** Build the brand's calendar of relevant
events. Three tiers:

- **Tier 1 — Anchor events.** The 6–10 events the brand's audience
  cares about most. Worth a real campaign each. Examples for a
  cycling brand: Paris-Roubaix, Strade Bianche, Giro, Tour, Vuelta,
  L'Étape Du Tour, Haute Route. For a marathon brand: the six
  majors plus 2–3 regional finals.
- **Tier 2 — Visibility events.** 15–25 events where the brand
  participates lightly (paid creative variant, email touch, social
  acknowledgement). Examples: regional gran fondos, regional
  marathons, race weekends the brand sponsors at a small scale.
- **Tier 3 — Audience moments.** Non-event triggers that still cluster
  the audience: training-season start, taper periods, off-season
  building, base-training months. These get lighter touch but they
  matter for non-racers in the audience.

Pull the dates programmatically (most event series publish multi-year
calendars). Lock the calendar twelve months out where possible.

**Phase 2 — Per-event campaign scoping.** For each Tier 1 event,
generate a campaign brief:

- **Hook** — what's the event-specific angle? (Cobblestones for
  Roubaix, the long Sunday for L'Étape, the wall at mile 21 for
  marathon, the cold open-water swim for early Ironman.)
- **Audience segments** — who in the brand's audience is racing,
  who's watching, who's training for next year's
- **Pre-event creative** — what carries the brand into the audience's
  attention 6–4 weeks out
- **Event-day creative** — what runs on the weekend itself, and
  whether the brand has athletes or sponsored riders to point at
- **Post-event creative** — the recap angle, the lesson-learned
  thread, the "what we learned" piece

The brief uses the standard brief-to-ship template plus three
endurance-specific fields: event date, lead-time required for
creative production, and dependency on real footage (more on this
in the capability section).

**Phase 3 — Creative inventory plan.** For each campaign, list every
asset needed:

- Long-form blog or page (1–2 per Tier 1 event)
- Email touchpoints (3–5 per campaign across pre, day, post)
- Social posts (8–15 per campaign across channels)
- Paid creative variants (3–6 per campaign)
- Video assets (1–3 short clips per campaign, plus optional long-form
  film if the event warrants)

The inventory plan distinguishes between assets that need real
footage (athlete riding, named product in motion, branded race-day
imagery) and assets that can use generated visuals (environmental
b-roll, mood imagery, archive footage edits). See capability section.

**Phase 4 — Production lead time.** For each asset, compute lead time
back from the event date. Photography and video lead times: 6–12
weeks for a proper shoot, 8–10 weeks for licensing existing
sponsored-rider footage, 2–3 weeks for AI-augmented social cuts and
environmental b-roll. The pipeline outputs production-start dates
working backwards from each event.

**Phase 5 — Paid programme integration.** For each campaign, generate
the paid programme brief: spend allocation, bid floors, audience
targets, creative rotation schedule. Endurance audiences have specific
targeting tells — Strava cohorts, Garmin Connect IQ usage, race-entry
data partners — that the brief should call out where the channel
supports it.

**Phase 6 — Calendar lock and instrumentation.** The full annual
calendar gets one document. Each campaign carries its own brief
artefact and creative inventory plan. The function-level brief-to-ship
pipeline manages execution, but the race calendar is the source of
truth for which campaign starts when.

## The capability boundary

This is where realism matters most.

**What works for race-day creative:**

- Environmental b-roll using AI image/video for generic terrain
  (cobblestone close-ups, dawn-light road shots, finish-line crowd
  scenes from generic events) — usable for social cuts and email
  hero images
- Editorial blog posts about the event's history, route, climate,
  predicted conditions — AI drafts, human edits
- Race-result recaps from official timing data — see the
  race-result-content-engine playbook
- Email campaigns timed to the event window — fully AI-drafted with
  voice gating

**What doesn't work:**

- AI-generated video of *named athletes* the brand sponsors, riding
  or running *the brand's actual products* — logos warp, geometry
  fails, athletes' faces drift across frames. The shoot is still real
  work
- AI-generated branded race-day imagery purporting to be a specific
  rider on a specific course
- AI-generated commentary that pretends to be a named athlete's voice

**The workaround:** the shoot is planned for a Tier 1 event a season
ahead, generates an archive that the brand draws from for years. AI
generates the supplementary cuts, the time-of-day variants, the
environmental b-roll, the social-cut adaptations. Budget the shoot;
budget AI to multiply its output.

See [What's actually possible](/lens/capabilities) for the broader
capability map.

## The eval harness

Pipeline-level gates.

**Eval 1 — Calendar coverage.** Every Tier 1 event has a complete
brief by Q4 of the year prior. Tier 2 events have a brief by 60 days
prior. Tier 3 audience moments have at minimum an email touchpoint
planned.

**Eval 2 — Lead time honesty.** No campaign's photography or video
lead time is shorter than 6 weeks for shoots, 2 weeks for AI-augmented
work. Cramming destroys quality, especially on the kind of named-
athlete shoots that can't be redone.

**Eval 3 — Capability honesty.** Every asset in the inventory tagged
"AI generated" goes through a feasibility check against the
capabilities document. If a brief calls for "AI-generated video of
our sponsored rider on the climb," it gets bounced back — that's a
shoot, not an AI deliverable.

**Eval 4 — Post-event retrospective.** Within 14 days of each Tier 1
event, the brand logs what worked, what didn't, what the engagement
delta vs prior year was, what the budget consumed. Next year's
calendar inherits the learnings.

## The failure modes

**Treating every event the same.** A Tier 3 audience moment doesn't
need a hero film. The brand burns budget treating a regional gran
fondo like a major. The taxonomy is the discipline — three tiers,
each with a different shape of effort.

**Lead times collapse under pressure.** Marketing leadership commits
to a Tier 1 campaign 4 weeks out. The shoot doesn't happen. The
campaign uses AI-generated assets that misrepresent the product.
Audience notices. Audience doesn't forget. Hold the lead time.

**Ignoring the calendar's audience signal.** When you build the
calendar from event dates, you've built it from when *races* happen.
But the audience cares about *training* moments too — the start of
base training, the spring breakthrough block, the taper. Tier 3 is
where you serve those non-event moments.

**Athlete sponsorship without content rights.** Brands sign athletes
without explicit content-rights agreements that cover AI augmentation.
A year later, the brand wants to extend a shoot's footage with AI
variants and the athlete contract doesn't cover it. Build AI-augmentation
language into the sponsorship contract from day one.

**Recap fatigue.** Brands post the same race-day congratulations
template every event. Audience numbness sets in quickly. The recap
should change with each event — sometimes a results focus, sometimes
a "what surprised us" angle, sometimes a forward-look to the next
race.

## The receipts

**Premium cycling brand, scale-stage.** Brand had been operating
without a calendar — campaigns assembled in the 2–3 weeks before each
event. We built a 14-month rolling calendar with Tier 1 events
locked, shoots scheduled, AI augmentation planned. Year-over-year
campaign performance up 47%, mostly from better creative quality (it
no longer arrived rushed) and better paid programme prep (audience
targeting and bids set 30 days out instead of day-of).

**Running brand, growth-stage.** Brand was over-investing in the
six majors and under-serving the regional half-marathon and 10k
calendar where their actual audience raced. Recalibrated to 4 majors
+ 12 regional races + dedicated taper-week content. Email engagement
in the regional segments up 3x. The audience felt seen for the first
time outside marathon weekend.

**Triathlon brand, partial-failure engagement.** Calendar was built;
the brand committed to AI-generated rider footage to fill creative
gaps where the shoot fell through. The output looked like AI even
to non-cyclists. The audience noticed and called it out publicly.
Brand pulled the work and re-shot under deadline pressure. Lesson
incorporated: the capability boundary is non-negotiable. If the shoot
can't happen, the campaign reduces, the AI doesn't try to substitute
for the unshippable artefact.

## Hand-off

The race-day calendar feeds:
- **brief-to-ship-pipeline** for execution of individual campaigns
- **lifecycle-journey-builder** for email touchpoints per event
- **social-content-factory** for channel-native event posts
- **race-result-content-engine** for post-event recap automation
- **earned-media-pitch** for event-week journalist outreach
