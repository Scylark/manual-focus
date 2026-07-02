---
title: "Daily briefing pipeline, calendar, inbox, Slack and CRM in one read"
stack: productivity
description: "Stitch calendar, inbox, Slack and CRM into a 5-minute morning brief. The version of your day a chief-of-staff would write if you had one."
outputs: "Daily briefing template, agent orchestration script, sample brief with worked example, weekly self-eval"
readMin: 14
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["inbox", "calendar", "crm", "meetings", "tasks"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-08-15
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **daily briefing template** that pulls calendar, inbox, Slack and CRM into a single readable page. One screen, scannable in under five minutes.
2. An **agent orchestration script** that runs every weekday at a fixed time (06:30 by default), assembles the brief and drops it into the channel of your choice.
3. A **sample brief** for a fictional endurance brand operator, so you know what good looks like before you wire your own data in.
4. A **weekly self-eval** sheet that scores last week's briefs against what actually mattered, so the pipeline stays useful instead of becoming noise.

## Who this is for

A growth, scale or enterprise marketing operator or GTM lead who runs across at least three of calendar, inbox, Slack and CRM in a typical morning. You have admin access to the tools or someone on IT who can wire the integrations. You start your day before 08:00 and lose the first thirty minutes to context switching.

If you work in a single tool all day (a designer in Figma, a developer in their editor) this playbook is overkill. If you run customer or pipeline work across surfaces, it pays back in the first week.

## Before you start

Get these on a single screen before you wire anything together.

- [ ] Calendar access through a connector (Google Calendar, Outlook, or the Cowork calendar MCP)
- [ ] Inbox access (Gmail or Outlook) with a working API token or OAuth scope
- [ ] Slack workspace token with `channels:read`, `groups:read` and `users:read`
- [ ] CRM access (HubSpot, Salesforce, Close, Attio) with read scope on deals and contacts
- [ ] A target delivery channel for the brief (Slack DM to self, daily Notion page, or email)
- [ ] A scheduler. Cowork's `schedule` skill works, as does a simple cron on a server you own
- [ ] 90 minutes blocked on your calendar for the setup pass, then the system runs itself

If your CRM is not in the list above, the prompts still work, you just need to point them at whatever export your CRM produces. CSV is fine.

## The pipeline

Four phases. Phase 1 takes the bulk of the setup time. Phases 2 through 4 are reusable and run every weekday once wired.

### Phase 1, brief specification

You first decide what you want to read at 06:30. Be honest about the answer, the trap is over-specifying and getting a brief no one reads.

**Step 1.1, write the brief spec.**

The default spec has five sections.

1. Today's meetings with prep status (one line each)
2. Inbox items that need a reply today (top five by signal)
3. Slack threads where you were tagged or mentioned and have not replied (top five)
4. Pipeline movement since yesterday (deals advanced, stalled, new)
5. The one thing the operator should do first, named explicitly

Save the spec as `briefing-spec.md` in your working directory. The orchestration prompt reads it directly.

**Step 1.2, pick your delivery channel.**

The channel of delivery matters more than the content. The three patterns that work in practice are a Slack DM to self that lands at 06:30, a Notion page that gets created daily with the date in the title, or an email to yourself with the brief as the body. Pick one. Mixing channels splits attention and the system stops being a single read.

**Step 1.3, set the time.**

Fixed time, not "first thing when I open my laptop". A scheduled 06:30 brief that lands when your phone is on the nightstand becomes part of the morning routine. A brief that lands "when you open Slack" gets read alongside the noise it was meant to filter.

### Phase 2, source ingestion

The orchestration script pulls four streams in parallel. Each stream produces a structured snapshot the synthesis pass reads.

**Step 2.1, calendar stream.**

Pull today's events plus tomorrow's first three. For each event capture title, time, attendees, attached docs and notes from the last meeting if the event is recurring.

```text
SYSTEM: You produce a structured calendar snapshot for the day's
briefing. You include every confirmed meeting between 07:00 and
22:00 local time, plus the first three of tomorrow's events.

USER:
Calendar events (paste from connector or JSON dump):
{PASTE_CALENDAR_EVENTS}

For each event return:
{
  "event_id": "<verbatim id>",
  "title": "<verbatim title>",
  "start_local": "<HH:MM>",
  "duration_min": <int>,
  "attendees": ["<name or email>"],
  "is_external": <true | false>,
  "prep_status": "<ready | partial | not started>",
  "linked_docs": ["<doc title or url>"],
  "recurring_series_id": "<id or null>",
  "notes_from_prior_instance": "<one sentence or null>"
}

Rules:
- prep_status is "ready" if there are linked docs OR notes from prior
  instance. "partial" if one but not both. "not started" if neither.
- Skip events marked as out-of-office, focus blocks, or tentative.
- Times in operator's local zone.
- Return JSON only.
```

**Step 2.2, inbox stream.**

Pull unread items from the last 24 hours. Filter by signal, not volume.

```text
SYSTEM: You classify inbox items for the day's briefing. You return
the top five items that need a reply today, ranked by combined
signal of sender importance, content urgency and prior thread
context.

USER:
Inbox items (sender, subject, snippet, timestamp, thread_id):
{PASTE_INBOX_ITEMS}

VIP sender list:
{PASTE_VIPS}

CRM contact list:
{PASTE_CRM_CONTACTS}

For each of the top five, return:
{
  "thread_id": "<verbatim>",
  "sender": "<name>",
  "sender_signal": "<vip | crm-contact | known-domain | unknown>",
  "subject": "<verbatim>",
  "urgency_signal": "<high | medium | low>",
  "urgency_drivers": ["<phrases that produced the signal>"],
  "suggested_action": "<reply | forward | schedule | archive>",
  "draft_reply_required": <true | false>
}

Rules:
- High urgency = today-deadline language, customer escalation,
  exec ask, or sender flagged VIP.
- Medium = response expected within 48h.
- Low = informational, no reply needed.
- Exclude newsletters, automated alerts and marketing blasts.
- Return the top 5 by combined signal, JSON only.
```

**Step 2.3, Slack stream.**

Pull mentions and DMs from the last 18 hours.

```text
SYSTEM: You surface Slack threads the operator needs to read or
reply to today. You skip threads where the operator has already
posted in the last 24 hours.

USER:
Mentions and DMs (channel, thread_ts, last_message_snippet, last_message_user, last_message_time):
{PASTE_SLACK_ITEMS}

Operator's Slack user id:
{OPERATOR_USER_ID}

For each of the top five threads, return:
{
  "channel": "<verbatim channel name>",
  "thread_ts": "<timestamp id>",
  "topic": "<5-7 word summary>",
  "last_speaker": "<name>",
  "operator_action": "<reply | review | acknowledge | ignore>",
  "context_required": "<one sentence on what the operator needs to know to respond>"
}

Rules:
- Skip if operator has posted in the thread in the last 24h.
- Skip channel announcements unless the operator was @-mentioned.
- Rank by combined signal of channel importance and direct mention.
- Return JSON only.
```

**Step 2.4, CRM stream.**

Pull deal stage changes from the last 24 hours.

```text
SYSTEM: You summarise CRM movement since yesterday's briefing. You
return advanced deals, stalled deals (no activity 14+ days), and
new opportunities since the last sync.

USER:
CRM export, deals with last_activity_at, stage, amount, contact, owner:
{PASTE_CRM_DEALS}

Last briefing timestamp:
{LAST_BRIEFING_TS}

Return JSON:
{
  "advanced": [{"deal": "<name>", "from_stage": "<x>", "to_stage": "<y>", "amount": "<currency>"}],
  "stalled": [{"deal": "<name>", "days_idle": <int>, "next_step_required": "<one sentence>"}],
  "new": [{"deal": "<name>", "owner": "<who>", "source": "<where>"}],
  "top_pipeline_signal": "<one sentence on the single most important movement>"
}

Rules:
- "advanced" only for deals where stage changed forward.
- "stalled" only if days_idle >= 14 and stage is not closed.
- "new" only for deals created since last_briefing_ts.
- top_pipeline_signal is the most consequential change, even if it
  is in stalled or new rather than advanced.
- Return JSON only.
```

### Phase 3, synthesis pass

The four streams collapse into one readable page.

**Step 3.1, run the synthesis prompt.**

```text
SYSTEM: You write the operator's daily briefing. The brief is one
readable page, sub-500 words, scannable in under five minutes. You
write in editorial prose, no marketing tone, no exclamation marks,
no hype. The operator reads this before coffee.

USER:
Calendar snapshot:
{PASTE_CALENDAR_JSON}

Inbox snapshot:
{PASTE_INBOX_JSON}

Slack snapshot:
{PASTE_SLACK_JSON}

CRM snapshot:
{PASTE_CRM_JSON}

Operator preference, "first thing" framing:
{PASTE_FIRST_THING_RULE}

Produce the brief in this shape:

# {DATE}, {DAY_OF_WEEK}

## First thing
{ONE SENTENCE, THE SINGLE MOST IMPORTANT THING THE OPERATOR SHOULD
DO FIRST}

## Today's meetings
{ONE LINE PER MEETING, TIME + TITLE + PREP STATUS + ONE LINE OF
CONTEXT IF THE EVENT IS NOT SELF-EVIDENT}

## Inbox, reply today
{TOP 5 INBOX ITEMS, SENDER + SUBJECT + ONE LINE OF WHY}

## Slack, waiting on you
{TOP 5 SLACK THREADS, CHANNEL + TOPIC + ONE LINE ACTION}

## Pipeline movement
{2-3 LINES, ADVANCED + STALLED + NEW, FOCUSED ON THE TOP SIGNAL}

## Tomorrow's opening
{ONE LINE ON THE FIRST EVENT TOMORROW MORNING IF IT NEEDS PREP TODAY}

Rules:
- Sub-500 words.
- No exclamation marks.
- No hype words (great, excellent, amazing).
- Active voice.
- Connected sentences.
- If a section is empty, write "Nothing today." rather than padding.
```

**Step 3.2, ship to the delivery channel.**

The orchestration script posts the brief to your chosen channel at the scheduled time. The Slack DM pattern is the most reliable, because Slack's mobile notification is consistent and the brief is searchable in your own DM history.

### Phase 4, weekly eval

Friday afternoon, score the week's briefs.

**Step 4.1, the eval prompt.**

```text
SYSTEM: You score a week of daily briefs against what actually
mattered, from the operator's perspective. The operator names the
five things that actually drove their week. You score how many of
those five appeared in that day's brief.

USER:
Briefs for the week (Mon-Fri):
{PASTE_WEEKS_BRIEFS}

The five things the operator says actually drove the week:
{LIST_FIVE_THINGS}

Return JSON:
{
  "things_surfaced": <int, 0 to 5>,
  "things_missed": ["<list>"],
  "miss_reasons": ["<one sentence per miss>"],
  "noise_flagged": ["<items the brief surfaced that turned out to be irrelevant>"],
  "recommendation": "<one sentence on what to change in the spec>"
}

Rules:
- A miss counts even if the thing surfaced on the wrong day.
- Noise is information the brief promoted that the operator did
  not act on.
- The recommendation is for the briefing-spec.md file, concrete.
```

**Step 4.2, edit the spec.**

Apply the recommendation to `briefing-spec.md`. Run the next week with the updated spec.

## Worked example, end-to-end

Cascadia Endurance, scale-stage UK trail-running apparel brand. Saoirse Burns, marketing lead, runs across calendar (Google), inbox (Gmail), Slack, and HubSpot. She wired the pipeline on a Sunday afternoon. Monday morning at 06:32 the brief lands in her Slack DM.

The brief reads, in part:

```text
# 2026-09-08, Monday

## First thing
Confirm the Vahla Storm Shell launch creative with the agency.
Marcus needs sign-off by Wednesday and the asset list is one
revision behind.

## Today's meetings
- 09:30 Cascadia weekly strategy (recurring). Prep ready, agenda
  has Vahla launch as the third item.
- 11:00 Beth Lyons 1:1 (recurring). Prep partial, last week's
  notes link in the event.
- 14:00 Storm Shell creative review with Foundry agency. Prep not
  started, asset list landed Friday at 18:42.
- 16:30 New contact, James Whitaker, Trail Club regional lead.
  External. Background note attached in CRM.

## Inbox, reply today
- Marcus Hale, Vahla launch budget question. He has a finance
  meeting at 11:00, needs the number before then.
- UTMB press desk, accreditation deadline Thursday. Form attached.
- Wholesale rep, Aros Outdoors, asking about Spring 2027 pre-book
  dates. Standard reply template, low urgency.
- Foundry agency, Storm Shell asset list, awaiting your sign-off.
- Trail Club, James Whitaker, intro thread for tomorrow's 16:30
  meeting.

## Slack, waiting on you
- #marketing-launches, Beth tagged you Friday on the Vahla press
  list. Approve or amend.
- #cascadia-creative, Foundry shared the third cut of the launch
  film, asking for notes by Tuesday.
- DM, Marcus, asking for the Q3 race-recap reach numbers.
- #sales-pipeline, Saoirse, wholesale rep asking which deck to
  send.
- #internal-ops, ticket 4172, IT asking which laptop to provision
  for the new contractor.

## Pipeline movement
Vahla Range pre-launch interest list crossed 4,200 signups over
the weekend, up from 3,650 on Friday. Two wholesale deals advanced
into negotiation. The Foundry retainer renewal stalled at 27 days
idle, Beth has the next step.

## Tomorrow's opening
07:30 flight to Chamonix for UTMB pre-event. Boarding pass
attached in the calendar event.
```

The brief takes Saoirse three minutes to read. She replies to Marcus's budget question from her phone before she gets out of bed, confirms the Trail Club intro thread, and walks into the 09:30 strategy meeting having already moved three items off the queue.

By Friday the system has surfaced 19 of the 23 things she would have wanted to know across the week. The two miss reasons end up as edits to the spec: Slack's `#cascadia-wholesale` channel was missing from the included-channels list, and the spec's "inbox VIPs" list did not include Cascadia's PR agency.

## Try it yourself

Three exercises, each under 30 minutes.

### Exercise 1, write your brief spec

Open a blank file. Write the five things you want the brief to surface, in plain language, before looking at the template. Compare to the default spec. Where you diverge is your local context, that is the spec you actually want.

### Exercise 2, run Phase 2 manually for one day

Pick a single day. Pull your calendar, inbox, Slack and CRM by hand or export. Run the four prompts in sequence. Read the JSON snapshots. The exercise is whether the snapshots feel like the right shape of input for the synthesis pass.

### Exercise 3, run the synthesis pass on real data

Take the four snapshots from Exercise 2. Paste them into the Phase 3 prompt. Read the brief. Send it to yourself at 06:30 the next morning by scheduling the message. Read it then. The test is whether the brief feels useful at the time you would actually consume it, not at the time you wrote it.

## The eval gates

**Eval 1, time-to-read.** The brief reads in under five minutes. If you cannot get through the brief in five minutes the spec is over-loaded. Cut a section.

**Eval 2, surfacing accuracy.** Friday's eval pass should show at least 18 of 25 things-that-mattered surfaced across the week. Below 15 the source filters are wrong.

**Eval 3, noise ratio.** Items flagged but not acted on should sit under 30 percent of total surfaced items. Above 30 percent the brief is becoming a feed rather than a brief.

**Eval 4, day-of-week consistency.** The brief reads the same on Monday as on Thursday. If Thursday's brief feels noisier or thinner than Monday's, the streams are time-windowed wrong (probably the inbox 24-hour window is missing late-week build-up).

## The failure modes

**The brief becomes a feed.** When every Slack mention, every meeting, every email ends up in the brief, the operator stops reading. The discipline is the five-item caps on inbox and Slack. Hold them.

**The orchestration runs but no one reads.** A brief that lands at the wrong time goes unread. If you find yourself skipping the brief three days running, change the delivery channel or change the time, not the spec.

**VIP and CRM lists go stale.** New CRM contacts and new direct reports do not get into the VIP list automatically. Add a weekly check (Sunday afternoon, two minutes) to refresh the VIP list. Without it the inbox stream slowly stops surfacing the right people.

**Calendar prep status lies.** "Ready" because a doc is attached does not mean the doc is read. Use the prep status as a flag for which meetings to look at, not as an absolution from prep.

**Privacy by accident.** The brief contains pipeline numbers, customer names and salary signals. The delivery channel should be a DM to self or an end-to-end encrypted channel, never a shared channel.

## The pattern in practice

**Marketing lead at a scale-stage D2C, the morning anchor.** A marketing lead running across four tools through the day. The brief becomes the morning anchor, ten minutes from open-Slack to first decision instead of ninety. The compounding value is the cross-stream synthesis. Slack threads about a campaign get connected to the inbox emails about its budget, surfaced together rather than discovered separately.

**Founder-led GTM at growth stage, the second-brain pattern.** A founder doing GTM, sales and marketing in parallel. The brief becomes the chief-of-staff function the company does not have. Pipeline movement gets read alongside personal calendar, so deal-stage changes get reactions in the same morning instead of three days later.

**Enterprise marketing director, the audit defence.** A director with 14 direct reports. The brief becomes the daily record of which decisions were available to make and which were taken. Slack quoting from the brief becomes a habit. The audit defence is incidental but real.

## Hand-off

Once you have the brief landing daily, the work feeds:
- **email-triage-and-draft**, where the inbox section becomes the queue
- **meeting-prep-stack**, where today's meetings get full context packs assembled
- **slack-focus-pass**, where the Slack section becomes the trigger for deeper threading
- **weekly-pipeline-rollup**, where CRM movement compounds into the weekly stakeholder update
