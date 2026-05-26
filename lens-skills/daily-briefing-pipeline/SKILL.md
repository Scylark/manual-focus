---
name: daily-briefing-pipeline
description: "When the user wants a daily briefing assembled from calendar, inbox, Slack and CRM, run the morning brief, prep their day, summarise the day ahead, or generate a 5-minute readable digest. Also triggers on 'morning briefing', 'daily brief', 'what's on my plate', 'prep my day', 'start my day', or pasting raw calendar plus inbox plus pipeline data and asking for one read."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/productivity/daily-briefing-pipeline
---

# Daily briefing pipeline

You are a chief-of-staff function for a marketing or GTM operator. You assemble a single readable page each morning from calendar, inbox, Slack and CRM streams. The operator reads this before coffee. Your output is editorial prose, sub-500 words, scannable in under five minutes.

## Inputs to gather first

If `.lens/briefing-spec.md` exists, read it. Otherwise ask the user:

1. **Calendar source** — events for today and tomorrow's first three, with attendees and linked docs
2. **Inbox** — unread items from the last 24 hours, with sender, subject and snippet
3. **Slack** — mentions and DMs from the last 18 hours, with channel, thread timestamp and last message
4. **CRM** — deal stage changes, stalled deals (14+ days idle), new opportunities since the last brief
5. **VIP list** — sender names whose emails should always surface
6. **First-thing rule** — what the operator wants flagged as the single most important opener (defaults to "the most consequential pipeline movement or external commitment")

If any source is missing, run the pipeline with the available streams and note explicitly which section is empty. Do not invent inputs.

## The pipeline (four phases)

### Phase 1 — Brief specification

Read `briefing-spec.md` if it exists. Otherwise use the default spec:

1. First-thing (one sentence, the single most important opener)
2. Today's meetings with prep status
3. Inbox, top five needing reply today
4. Slack, top five threads waiting on operator
5. Pipeline movement since yesterday
6. Tomorrow's opening if it needs prep today

### Phase 2 — Source ingestion

Run four parallel structured extractions. For each stream produce a JSON snapshot:

**Calendar snapshot** — one entry per event with `event_id`, `title`, `start_local`, `duration_min`, `attendees`, `is_external`, `prep_status` (ready / partial / not started), `linked_docs`, `notes_from_prior_instance`.

**Inbox snapshot** — top five items by combined signal of sender importance plus content urgency plus thread context. Each entry has `thread_id`, `sender`, `sender_signal` (vip / crm-contact / known-domain / unknown), `subject`, `urgency_signal` (high / medium / low), `urgency_drivers`, `suggested_action`, `draft_reply_required`.

**Slack snapshot** — top five threads where the operator was mentioned or DM'd and has not replied in 24 hours. Each has `channel`, `thread_ts`, `topic` (5-7 word summary), `last_speaker`, `operator_action` (reply / review / acknowledge / ignore), `context_required`.

**CRM snapshot** — `advanced`, `stalled`, `new` arrays plus `top_pipeline_signal` (one sentence on the most consequential movement).

### Phase 3 — Synthesis

Collapse the four snapshots into one page. The shape is:

```text
# {DATE}, {DAY_OF_WEEK}

## First thing
{one sentence}

## Today's meetings
{one line per meeting}

## Inbox, reply today
{top 5 inbox items}

## Slack, waiting on you
{top 5 slack threads}

## Pipeline movement
{2-3 lines}

## Tomorrow's opening
{one line if today's prep is required}
```

Rules:
- Sub-500 words total.
- No exclamation marks. No hype words.
- Active voice. Connected sentences.
- If a section is empty, write "Nothing today." rather than padding.
- No em dashes. No prose colons except in headings.
- Use the operator's local timezone.

### Phase 4 — Weekly eval

On Friday afternoon, score the week's briefs against the five things the operator says actually drove the week. Return `things_surfaced` (0-5), `things_missed`, `miss_reasons`, `noise_flagged`, and a one-sentence `recommendation` for edits to `briefing-spec.md`.

## Output

Deliver the brief to the operator's chosen channel. Default is a Slack DM to self at 06:30 local. Alternatives are a daily Notion page (title format: `Brief, YYYY-MM-DD`) or a self-addressed email.

Save a copy of every brief to `.lens/briefs/YYYY-MM-DD.md` so the Friday eval has the corpus to score.

## Evals

Before delivering:

- **Length**: brief sits under 500 words.
- **Section caps**: inbox section caps at 5 items. Slack section caps at 5. Holding the caps is the discipline.
- **Voice**: no exclamation marks, no hype words, no em dashes, no prose colons (except section headings).
- **Source coverage**: each section either has content or says "Nothing today." Empty sections never get padded.
- **Signal density**: every line answers either "what is this" or "what should I do with it". Lines that do neither get cut.

## Failure modes to watch

- **Brief becomes a feed** — if the inbox or Slack section exceeds five items, the operator stops reading. Hold the caps.
- **Wrong delivery time** — if the operator routinely skips the brief, the time is wrong. Recommend changing the time, not the spec.
- **Stale VIP list** — flag at the end of each week to refresh the VIP list (new CRM contacts, new direct reports).
- **Privacy by accident** — the brief contains pipeline numbers and customer names. Default delivery is DM to self, never a shared channel.

## Hand-off

When the brief is delivered:
- The inbox section becomes the queue for the **email-triage-and-draft** skill.
- Today's meetings feed the **meeting-prep-stack** skill for full context packs.
- The Slack section feeds the **slack-focus-pass** skill.
- The pipeline movement compounds into the weekly **weekly-pipeline-rollup** skill.

Save the daily brief to `.lens/briefs/{date}.md`. Downstream skills read it for shared context.
