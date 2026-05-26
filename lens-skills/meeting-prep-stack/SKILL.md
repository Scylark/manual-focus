---
name: meeting-prep-stack
description: "When the user wants a meeting prep pack, context for an upcoming meeting, attendee research, a briefing on who they are meeting with, prep for a call with a prospect or partner, or auto-generated meeting context. Triggers on 'prep me for my meeting with [name]', 'I have a call with [company] tomorrow', 'context pack', 'background on [attendee]', or pasting a calendar invite and asking for prep."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/productivity/meeting-prep-stack
---

# Meeting prep stack

You produce a one-page context pack for a marketing or GTM operator's external meeting. The pack lands 30 minutes before the meeting starts. The operator reads it in three minutes and walks in informed.

## Inputs to gather first

1. **Meeting** — calendar invite (title, time, attendees, description, link or location)
2. **External attendees** — name, email, company. The pipeline enriches each
3. **Operator's CRM access** — for deal stage, related deals, last activity
4. **Inbox history** — last 90 days of threads with the attendees or company
5. **Notes tool** — Granola, Fireflies, Notion or Obsidian export with any prior meeting notes
6. **LinkedIn source** — official LinkedIn MCP, research-tool MCP, or manual paste
7. **Operator's relationship owner** — who at their company owns the attendee or company relationship

If a source is missing, run the pipeline with what is available and explicitly mark the corresponding section as "not available". Do not invent.

## The pipeline (five phases)

### Phase 1 — Pack spec

The pack has six sections:
1. Meeting metadata
2. Who you are meeting (one paragraph per external attendee)
3. What you have talked about (last 3 substantive interactions)
4. CRM context (deal stage, last activity, related deals)
5. Likely agenda (3-5 items)
6. The one thing (single most important context sentence)

### Phase 2 — Attendee enrichment

For each external attendee, return JSON with `name`, `current_role`, `tenure_at_current`, `background_summary` (50-80 words), `recent_signals` (capped at 3, with source / date / summary), `mutual_connections`, `prior_interactions_summary`, `confidence`, `uncertain_facts`.

Rules:
- No invented biography. If LinkedIn does not say it, do not guess.
- `recent_signals` capped at 3.
- `background_summary` neutral tone, 50-80 words.
- Internal attendees get one line, name and role only. No enrichment.

### Phase 3 — History aggregation

For each external attendee or company, return JSON with `interactions` (capped at 3, most recent first, with date / channel / summary / outstanding_followup), `open_threads`, `last_substantive_decision`, `relationship_temperature` (warm / neutral / cool / tense).

Rules:
- "Substantive" excludes scheduling, acknowledgments and cc threads.
- `relationship_temperature` reads from tone, not commercial state.

### Phase 4 — CRM + agenda

Pull CRM record: `company`, `primary_deal_stage`, `primary_deal_amount`, `primary_deal_close_date`, `last_activity_date`, `last_activity_summary`, `open_opportunities_count`, `related_deals` (capped at 3), `owner`.

Draft agenda: 3-5 `agenda` items each with `item` (5-10 word noun phrase), `rationale`, `estimated_minutes`, `decision_or_discussion`. Plus `the_one_thing` (single sentence, sharp specific fact / decision / risk) and `open_question_to_raise`.

Rules:
- Sum of `estimated_minutes` equals meeting duration minus 10 minutes (buffer).
- `the_one_thing` is sharp. Not "be prepared". A specific fact, decision, or risk.

### Phase 5 — Pack assembly

Assemble into the template:

```text
# {MEETING_TITLE}
{DATE}, {TIME_RANGE}, {LOCATION_OR_LINK}

## The one thing
{THE_ONE_THING}

## Who you are meeting
{EXTERNAL ATTENDEE PARAGRAPHS}

## What you have talked about
{LAST 3 INTERACTIONS}
{OPEN THREADS}

## CRM context
{CRM SUMMARY}

## Likely agenda
{NUMBERED ITEMS WITH ESTIMATED MINUTES}

## Open question to raise
{QUESTION OR 'none flagged'}
```

## Output

Deliver as:
- Calendar event description, 30 minutes before start (default)
- Linked Google Doc or Notion page in the event
- Email to the operator at the same time
- Morning email at 06:30 if the operator has back-to-back meetings

Save to `.lens/prep/{date}-{meeting-slug}.md`. Downstream skills read it.

## Evals

Before delivering:

- **Length** — pack reads in under 4 minutes. Cut padding.
- **The-one-thing sharpness** — single sentence, names a specific fact, decision, or risk. Not generic.
- **Bio fidelity** — every claim in `background_summary` traces to a source. Flag uncertain facts explicitly.
- **History coverage** — every substantive interaction in the last 90 days surfaces. Sample-check the source.
- **Internal-attendee restraint** — internal attendees are one line only. No full bios.

## Failure modes to watch

- **Invented biography** — when LinkedIn is thin, the model fills in plausible-sounding facts. Hold the "no invented biography" rule. Use the `uncertain_facts` array to flag.
- **Power dynamics missed** — flag in `open_question_to_raise` whether the attendee can sign the deal or has to escalate.
- **Old interactions feel current** — every interaction is dated. Operator sees what is recent.
- **Privacy by accident** — the pack contains deal stages and sometimes compensation signals. Default delivery is the operator's own event description, never a shared invite description.

## Hand-off

- The pack feeds **call-follow-up-loop** for the post-meeting summary.
- **daily-briefing-pipeline** links to each pack from its "today's meetings" section.
- **personal-knowledge-base** accumulates packs into a searchable interaction history.
- Open threads from agenda become tasks in **inbox-to-task-pipeline** if they need follow-up.

Save the prep pack to `.lens/prep/{date}-{slug}.md`.
