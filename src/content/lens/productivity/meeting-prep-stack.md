---
title: "Meeting prep stack, auto-generated context pack per meeting"
stack: productivity
description: "A context pack per meeting from LinkedIn, past notes, CRM history and recent emails. Walk in informed, ten minutes of work instead of forty."
outputs: "Context pack template, attendee enrichment prompt, history aggregation prompt, agenda draft, eval rubric"
readMin: 22
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["meetings", "calendar", "crm", "inbox"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-08-21
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **context pack template** that lands in your calendar event as a Google Doc, Notion page or email body 30 minutes before the meeting starts. One page, scannable in three minutes.
2. An **attendee enrichment prompt** that pulls LinkedIn, recent press, mutual connections and prior interactions for every external attendee.
3. A **history aggregation prompt** that surfaces the last three exchanges (email, Slack, CRM activity, prior meeting notes) with each attendee.
4. An **agenda draft** the operator can edit in 90 seconds and circulate before the meeting starts.

## Who this is for

A marketing or GTM operator running five or more external meetings a week. You walk in to most of them under-prepared and wish you had ten more minutes. You have a CRM, a calendar, an inbox and a notes tool (Granola, Fireflies, Notion, Obsidian, or a Google Docs folder of meeting notes).

If your meetings are all internal recurring stand-ups, the pipeline is overkill. If you run mixed external and internal at five or more a week, it is the single highest-leverage productivity playbook in the stack.

## Before you start

- [ ] Calendar connector (Google Calendar or Outlook) with read access to today and tomorrow
- [ ] CRM read access (HubSpot, Salesforce, Close, Attio)
- [ ] LinkedIn access (the official MCP, a research-tool MCP, or manual paste)
- [ ] Inbox connector with read access to threads with the attendees in the last 90 days
- [ ] Notes tool with API or export (Granola, Fireflies, Notion, Obsidian)
- [ ] A target delivery channel for the context pack (calendar event description, a daily Notion page, or email)
- [ ] 30 minutes blocked for the setup pass

If you do not have a notes tool wired in, the pipeline still works, you just lose the "prior meeting notes" section. The other three sections (attendee bio, CRM history, recent emails) carry the load.

## The pipeline

Five phases. The setup is one-time. The daily run executes automatically at 30 minutes before each meeting, or can be triggered on demand.

### Phase 1, context pack specification

The pack is one page. It has six sections, all in service of three minutes of reading.

1. **Meeting metadata.** Title, time, attendees, location or link, prior instance if recurring.
2. **Who you are meeting.** One paragraph per external attendee. Role, background, recent press or LinkedIn post, mutual context.
3. **What you have talked about.** The last three exchanges with each attendee or company, summarised in one line each.
4. **CRM context.** Deal stage, last activity, open opportunities, related deals.
5. **The likely agenda.** Three to five items the meeting is probably about, based on the calendar invite, the last exchange and the CRM stage.
6. **The one thing you need to walk in knowing.** A single sentence with the most important context for the meeting.

Write the spec to `meeting-prep-spec.md`. The orchestration prompt reads it directly.

### Phase 2, attendee enrichment

For each external attendee, the system pulls a structured bio.

**Step 2.1, the enrichment prompt.**

```text
SYSTEM: You produce a one-paragraph attendee brief for a meeting
context pack. You use the attendee's LinkedIn profile, recent
press mentions, and any mutual connections or context the operator
has. You do not invent biographical details. Where a fact is
inferred rather than verified, you flag it.

USER:
Attendee name: {ATTENDEE_NAME}
Attendee email: {ATTENDEE_EMAIL}
Attendee company: {ATTENDEE_COMPANY}

LinkedIn profile (paste or MCP output):
{PASTE_LINKEDIN}

Recent press mentions (last 6 months):
{PASTE_PRESS_RESULTS}

Mutual connections (from LinkedIn or CRM):
{PASTE_MUTUALS}

Operator's prior interactions with this attendee (if any):
{PASTE_PRIOR_INTERACTIONS}

Return JSON:
{
  "name": "<verbatim>",
  "current_role": "<title and company>",
  "tenure_at_current": "<approximate, e.g. '3 years'>",
  "background_summary": "<one paragraph, 50-80 words, what they have done>",
  "recent_signals": [
    {"source": "<linkedin-post | press | podcast | conference>",
     "date": "<approximate>",
     "summary": "<one line>"}
  ],
  "mutual_connections": ["<names>"],
  "prior_interactions_summary": "<one sentence or 'first meeting'>",
  "confidence": "<high | medium | low>",
  "uncertain_facts": ["<facts the model is unsure about>"]
}

Rules:
- No invented biography. If LinkedIn does not say where they
  studied, do not guess.
- recent_signals capped at 3 items.
- background_summary is 50-80 words, neutral tone.
- confidence "low" if LinkedIn profile is missing or thin.
- Return JSON only.
```

**Step 2.2, the internal attendee rule.**

Internal attendees do not get the full enrichment. They get one line, name and role, pulled from the company directory. The pack is for context the operator does not already have, not for repeating what they do.

### Phase 3, history aggregation

The pipeline pulls the operator's prior exchanges with each attendee or company.

**Step 3.1, the aggregation prompt.**

```text
SYSTEM: You summarise the operator's prior exchanges with a
meeting attendee or their company. You read across inbox, Slack,
CRM activity, and prior meeting notes. You produce a short
chronological view of the last three substantive interactions.

USER:
Meeting attendee or company:
{ATTENDEE_OR_COMPANY}

Inbox threads in the last 90 days (sender, subject, date, snippet):
{PASTE_INBOX_THREADS}

Slack messages or threads in the last 90 days:
{PASTE_SLACK_HISTORY}

CRM activity log in the last 180 days:
{PASTE_CRM_ACTIVITY}

Prior meeting notes with this attendee (Granola, Fireflies, Notion):
{PASTE_PRIOR_NOTES}

Return JSON:
{
  "interactions": [
    {
      "date": "<YYYY-MM-DD>",
      "channel": "<email | slack | meeting | crm-note>",
      "summary": "<one sentence, what was said or decided>",
      "outstanding_followup": "<one sentence or null>"
    }
  ],
  "open_threads": ["<one line per unresolved item>"],
  "last_substantive_decision": "<one sentence, what was decided last>",
  "relationship_temperature": "<warm | neutral | cool | tense>"
}

Rules:
- interactions capped at 3, most recent first.
- "substantive" means not just acknowledgments, scheduling, or cc
  threads.
- relationship_temperature reads from tone of recent exchanges,
  not from inference about commercial state.
- Return JSON only.
```

### Phase 4, CRM and agenda synthesis

The pipeline pulls CRM context and drafts the likely agenda.

**Step 4.1, the CRM context prompt.**

```text
SYSTEM: You extract the CRM context for a meeting attendee or
their company. You return deal stage, last activity, open
opportunities, and related deals.

USER:
Attendee or company:
{ATTENDEE_OR_COMPANY}

CRM record (paste from HubSpot, Salesforce or equivalent):
{PASTE_CRM_RECORD}

Return JSON:
{
  "company": "<name>",
  "primary_deal_stage": "<stage name or 'no open deal'>",
  "primary_deal_amount": "<currency or null>",
  "primary_deal_close_date": "<YYYY-MM-DD or null>",
  "last_activity_date": "<YYYY-MM-DD>",
  "last_activity_summary": "<one sentence>",
  "open_opportunities_count": <int>,
  "related_deals": [{"deal_name": "<name>", "stage": "<stage>", "amount": "<currency>"}],
  "owner": "<who at the operator's company owns the relationship>"
}

Rules:
- "no open deal" if CRM has no active opportunity.
- related_deals capped at 3.
- Return JSON only.
```

**Step 4.2, the agenda draft prompt.**

```text
SYSTEM: You draft the likely meeting agenda from the calendar
invite, the prior exchange history and the CRM stage. You
produce three to five items. The agenda is a hypothesis, not a
commitment, the operator confirms or rewrites before circulating.

USER:
Calendar invite (title, description, attendees):
{PASTE_INVITE}

Prior interaction history (from Phase 3):
{PASTE_HISTORY_JSON}

CRM context (from Phase 4 step 1):
{PASTE_CRM_JSON}

Return JSON:
{
  "agenda": [
    {
      "item": "<noun phrase, 5-10 words>",
      "rationale": "<one sentence, why this is on the agenda>",
      "estimated_minutes": <int>,
      "decision_or_discussion": "<decision | discussion>"
    }
  ],
  "the_one_thing": "<one sentence, the most important piece of context the operator needs walking in>",
  "open_question_to_raise": "<one sentence or null>"
}

Rules:
- 3 to 5 agenda items.
- Sum of estimated_minutes equals meeting duration minus 10
  minutes (buffer).
- the_one_thing is sharp, not "be prepared". It is a specific
  fact, decision, or risk.
```

### Phase 5, pack assembly and delivery

The five outputs (attendee enrichment, history, CRM context, agenda, the_one_thing) get assembled into a single page.

**Step 5.1, the assembly template.**

```text
# {MEETING_TITLE}
{DATE}, {TIME_RANGE}, {LOCATION_OR_LINK}

## The one thing
{THE_ONE_THING}

## Who you are meeting
{FOR EACH EXTERNAL ATTENDEE, NAME, ROLE, ONE-PARAGRAPH SUMMARY,
RECENT SIGNAL IF ANY, MUTUAL CONNECTIONS IF ANY}

## What you have talked about
{LAST 3 INTERACTIONS, ONE LINE EACH}
{OPEN THREADS IF ANY}

## CRM context
{COMPANY, PRIMARY DEAL STAGE, AMOUNT, OWNER, LAST ACTIVITY,
RELATED DEALS IF ANY}

## Likely agenda
1. {ITEM 1} - {ESTIMATED_MINUTES} min
2. {ITEM 2} - {ESTIMATED_MINUTES} min
...

## Open question to raise
{QUESTION OR 'none flagged'}
```

**Step 5.2, the delivery.**

The pack lands as the description of the calendar event 30 minutes before start. Alternatively as a Google Doc linked in the event, or as a Notion page, or as an email body in the operator's inbox at the same time.

For back-to-back meetings, the operator gets the pack three meetings ahead in a single morning email at 06:30 (which pairs with the daily-briefing-pipeline).

## Worked example, end-to-end

Saoirse Burns has a 16:30 meeting with James Whitaker, Trail Club regional lead. First meeting. Saoirse has 25 minutes to read the pack before the meeting starts.

**Pack output.**

```text
# Trail Club intro, James Whitaker
2026-09-08, 16:30-17:15, Zoom link in invite

## The one thing
James is rolling out the Trail Club Manchester regional events
for 2027 and is sourcing kit partners now. Cascadia is on his
shortlist of three. The decision lands in October.

## Who you are meeting
James Whitaker, Regional Lead at Trail Club. Joined Trail Club
18 months ago after five years running events at the British
Mountaineering Council. Background in event production at scale,
not retail. Trail Club's Manchester arm grew from 800 to 4,400
members under his watch. Posted last week on LinkedIn about the
2027 events calendar, calling out three brands he wants to "build
properly with" rather than badge-swap. Mutual connection through
Beth Lyons (Beth worked with James at BMC in 2018-2019).

## What you have talked about
- 2026-08-29, email. James reached out cold, asked for a 30-min
  intro. Beth Lyons cc'd as the warm intro reference.
- 2026-09-01, email. You confirmed the meeting time, James
  attached the 2027 events calendar.
- 2026-09-05, Slack DM. Beth pinged you a note that James is
  "the real deal" and worth taking seriously.

## CRM context
Trail Club has no open deal in HubSpot. Beth Lyons is the
relationship owner. Trail Club has been a low-touch partner
since 2024, mostly cross-promotion on Instagram. Annual spend
on Cascadia kit by Trail Club members is roughly £180k based
on UTM-tagged purchases.

## Likely agenda
1. 2027 events calendar walk-through, 10 min, discussion
2. What "kit partner" means in James's framing, 10 min, discussion
3. Cascadia's commercial appetite for regional events, 10 min, decision
4. Next-step ownership and timeline, 5 min, decision

## Open question to raise
Whether the partnership runs through Beth (existing relationship)
or shifts to your direct ownership for 2027 given the commercial
shape.
```

Saoirse reads the pack in 3 minutes. She walks into the Zoom at 16:30 having moved her opening question from "tell me about Trail Club" (which would have wasted ten minutes) to "James, walk me through the 2027 calendar and where you see Cascadia fitting". The meeting moves twice as fast as it would have.

Beth gets a Slack note from Saoirse before the meeting starts: "I have James 16:30, you're cc'd on the readout afterwards, my read is the partnership shifts to my ownership for 2027, hold for the readout before reacting."

## Try it yourself

Three exercises, each under 30 minutes.

### Exercise 1, run the enrichment prompt on a real attendee

Pick a real external attendee from a meeting in the next week. Paste their LinkedIn URL into the enrichment prompt (or run the LinkedIn MCP if you have one). Read the output. Compare to what you would have known walking in cold. The gap is the value.

### Exercise 2, run the history aggregation on a known thread

Pick a customer or partner you have talked to recently. Paste the last 90 days of inbox threads, Slack messages and CRM activity. Run the aggregation prompt. Read the output. Does it match your memory? Where it does not, the model has either caught a detail you forgot (good) or invented one (flag and check).

### Exercise 3, build the pack for tomorrow's first external meeting

Pick tomorrow's first external meeting. Run all five phases. Read the assembled pack. The test is whether you would walk into the meeting feeling sharper than you would otherwise. If the answer is yes, schedule the pipeline to run automatically before every external meeting.

## The eval gates

**Eval 1, the one thing accuracy.** Sample 10 packs. The "one thing" sentence should match what the operator's gut would have said walking in, after a coffee, in 8 of 10. Below 6 the synthesis prompt is wrong, recheck the inputs.

**Eval 2, factual accuracy on attendee bios.** Sample 20 attendee bios. Verify each against the source LinkedIn or press item. The accuracy target is 95 percent. Below 90 percent the enrichment prompt is hallucinating, tighten the "no invented biography" rule.

**Eval 3, history coverage.** The history aggregation should capture every substantive prior interaction in the last 90 days. Sample five attendees, manually list interactions, compare. Missing more than 20 percent means a data source is wired wrong.

**Eval 4, pack readability.** The pack should read in under 4 minutes. If it is taking longer, it is too long. Cut sections to their tightest, no padding.

## The failure modes

**The model invents a biography.** When LinkedIn is thin or missing, the model fills in plausible-sounding facts. The "no invented biography" rule and the `uncertain_facts` array make this visible. The operator's discipline is to read flagged facts skeptically.

**The pack ignores power dynamics.** A pack that says "James has done 47 events with Trail Club" misses the question of whether James can sign the deal or has to escalate. Build the question of decision authority into the agenda prompt.

**Internal attendees get over-enriched.** A pack with a one-paragraph bio for the operator's own CFO is noise. Internal attendees should be one line, role only.

**Old interactions feel current.** The history aggregation pulls 90 days. An interaction from week 11 is old enough that the relationship may have shifted. The pack should date every interaction so the operator can see what is recent.

**Privacy by accident.** The pack contains attendee names, deal stages, and sometimes salary or compensation signals. Default delivery is the operator's own calendar event description, never a shared invite description.

## The pattern in practice

**Sales-led founder at growth stage, the cold-meeting unlock.** A founder walking into 12 external meetings a week, half cold. The pack means every meeting starts at the substance, not at "tell me about your company". The compounding value is that customers and partners feel known after the first meeting, not after the third.

**Marketing director at scale, the back-to-back protection.** A director with five meetings in a row. The morning email at 06:30 hands her the packs for all five in one read. She walks into each meeting having already done the framing, even if the gap between meetings is two minutes.

**B2B GTM lead, the deal-progression evidence.** A GTM lead with a pipeline of 40 active deals. The pack surfaces "open threads" the operator may have forgotten. Twice a month, an open thread becomes the question that moves the deal to next stage. The pack is doing CRM hygiene by accident.

## Hand-off

Once the pack is landing on every external meeting, the work feeds:
- **call-follow-up-loop**, where the post-meeting summary completes the loop opened by the pack
- **daily-briefing-pipeline**, where "today's meetings" links to each pack rather than a bare title
- **personal-knowledge-base**, where every pack accumulates into a searchable history of who you have met and what you have talked about
- **inbox-to-task-pipeline**, where the agenda's "open threads" become tasks if they need follow-up after the meeting
