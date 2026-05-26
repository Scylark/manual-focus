---
title: "Call follow-up loop, transcript to CRM update, email draft and tasks"
stack: productivity
description: "Granola or Fireflies transcript into a CRM update, voice-loaded follow-up email and Linear or Asana tasks. Closes the loop opened by meeting prep."
outputs: "Transcript ingestion prompt, CRM update payload, follow-up email draft, task creation prompt, eval rubric"
readMin: 21
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["meetings", "crm", "inbox", "tasks"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-08-25
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **transcript ingestion prompt** that reads a Granola or Fireflies transcript and produces a structured meeting summary, action items and decisions.
2. A **CRM update payload** that drops cleanly into HubSpot, Salesforce, Close or Attio. Stage advances, notes, next-step fields.
3. A **follow-up email draft** in the operator's voice, ready to send within 90 minutes of the call ending.
4. A **task creation prompt** that pushes action items into Linear, Asana or Notion with the right owner, due date and meeting context attached.

## Who this is for

A marketing or GTM operator running five or more external calls a week where decisions, next steps and CRM updates need to land somewhere. You use Granola, Fireflies, Otter, Zoom transcripts or any auto-recorded source. You have a CRM, a project tool and an inbox.

If your calls are all internal stand-ups, the pipeline is overkill. If your follow-ups currently land hours or days after the call (or never), the pipeline pays back in the first week.

## Before you start

- [ ] Transcript source connected (Granola, Fireflies, Otter, Zoom transcripts, or paste-into-Claude)
- [ ] CRM with write access (HubSpot, Salesforce, Close, Attio)
- [ ] Inbox connector with draft-creation rights
- [ ] Project tool with task creation API (Linear, Asana, Notion, ClickUp, Monday)
- [ ] Brand voice profile loaded (from brand-voice-extraction)
- [ ] The meeting prep pack from the meeting-prep-stack playbook, if one exists for this call
- [ ] 90 minutes blocked for setup

If the meeting prep pack exists, the follow-up loop runs sharper because it can compare what was discussed against what was planned. If it does not exist, the pipeline still works, you just lose the "agenda vs reality" diff.

## The pipeline

Five phases. Triggered automatically when a transcript lands, or manually within 30 minutes of the call ending.

### Phase 1, transcript ingestion

The raw transcript becomes a structured summary.

**Step 1.1, the ingestion prompt.**

```text
SYSTEM: You read a meeting transcript and produce a structured
summary, action items, decisions, and unresolved questions. You
preserve attribution (who said what) for action items and
decisions. You do not invent statements that are not in the
transcript.

USER:
Meeting metadata:
{TITLE, DATE, ATTENDEES, DURATION}

Meeting prep pack (if available):
{PASTE_PREP_PACK_OR_NULL}

Transcript:
{PASTE_TRANSCRIPT}

Return JSON:
{
  "summary": "<one paragraph, 80-150 words, what the meeting was about and where it landed>",
  "decisions": [
    {
      "decision": "<one sentence>",
      "decided_by": "<name or 'jointly'>",
      "transcript_quote": "<verbatim quote that anchors the decision>"
    }
  ],
  "action_items": [
    {
      "owner": "<name>",
      "action": "<verb-led sentence>",
      "due": "<YYYY-MM-DD or relative ('end of week')>",
      "context": "<one sentence on why this matters>",
      "transcript_quote": "<verbatim quote that anchors the action>"
    }
  ],
  "unresolved_questions": [
    "<question raised but not answered>"
  ],
  "tone_shift_signals": ["<moments where the relationship temperature changed>"],
  "topics_planned_but_not_discussed": ["<from prep pack agenda but absent from transcript>"],
  "topics_unplanned_but_raised": ["<discussed but not in prep pack agenda>"]
}

Rules:
- Every decision and action item has a transcript_quote. No
  attribution without quote.
- "decided_by" is "jointly" only when the transcript actually
  shows mutual agreement.
- topics_planned_but_not_discussed and topics_unplanned_but_raised
  are empty arrays if no prep pack was provided.
- Return JSON only.
```

**Step 1.2, the operator review.**

The structured summary gets a 60-second review from the operator. The operator can amend the action items, decisions, or owners before the pipeline writes to downstream systems. This step is the human-in-the-loop checkpoint.

### Phase 2, CRM update payload

The summary becomes a CRM-shaped payload.

**Step 2.1, the CRM update prompt.**

```text
SYSTEM: You produce a CRM update from a meeting summary. The
update advances or holds the deal stage based on what was
decided. You write the call notes in a form the operator's
team can scan in 30 seconds.

USER:
Meeting summary (from Phase 1):
{PASTE_PHASE_1_JSON}

CRM record before this meeting:
{PASTE_CRM_RECORD}

CRM stage taxonomy (the operator's pipeline stages):
{PASTE_STAGE_TAXONOMY}

Return JSON:
{
  "company": "<name>",
  "primary_contact": "<name>",
  "deal_id": "<existing or 'new'>",
  "stage_update": {
    "previous_stage": "<verbatim>",
    "new_stage": "<verbatim or 'no change'>",
    "rationale": "<one sentence>"
  },
  "amount_update": {
    "previous_amount": "<currency>",
    "new_amount": "<currency or 'no change'>",
    "rationale": "<one sentence>"
  },
  "close_date_update": {
    "previous_close_date": "<YYYY-MM-DD>",
    "new_close_date": "<YYYY-MM-DD or 'no change'>",
    "rationale": "<one sentence>"
  },
  "call_notes": "<150-250 words, scannable, 4-6 bullets>",
  "next_step": {
    "action": "<verb-led sentence>",
    "owner": "<name>",
    "due": "<YYYY-MM-DD>"
  }
}

Rules:
- stage_update only changes if a decision in Phase 1 explicitly
  moved it. Otherwise "no change".
- amount_update only changes if a number was named in the meeting.
- close_date_update only changes if a timeline was named.
- next_step is the operator's next step, not the prospect's.
- call_notes uses bullets for scannability.
- Return JSON only.
```

**Step 2.2, the write.**

The CRM connector writes the payload. For HubSpot, that is the Deal record plus the Notes attached. For Salesforce, the Opportunity record plus the Activity log. For Close, the Lead record plus the Call activity.

The operator gets a Slack DM confirmation when the write completes, with a link back to the record.

### Phase 3, follow-up email draft

The summary becomes a draft email.

**Step 3.1, the email draft prompt.**

```text
SYSTEM: You draft the follow-up email from the operator to the
external attendees of the call. The draft confirms what was
decided, names the action items with owners and due dates, and
proposes the next conversation. You write in the operator's
voice, you do not write on behalf of "the team".

USER:
Operator brand voice profile:
{PASTE_VOICE_PROFILE}

Voice reference corpus (last 5 follow-up emails the operator
has sent):
{PASTE_REFERENCE_CORPUS}

Meeting summary (Phase 1):
{PASTE_PHASE_1_JSON}

External attendees on the call:
{PASTE_EXTERNAL_ATTENDEES}

Operator signature:
{PASTE_SIGNATURE}

Return JSON:
{
  "to": ["<email>"],
  "cc": ["<email or empty>"],
  "subject": "<verbatim>",
  "body": "<the email, plain text, signature appended>",
  "estimated_send_time": "<HH:MM, within 90 minutes of meeting end>",
  "tone_check": {
    "matches_voice": <true | false>,
    "drift_notes": ["<one-sentence flags>"]
  },
  "operator_action_required": "<send-as-is | review-and-send | rewrite-needed>"
}

Rules:
- 100 to 220 words for the body.
- No em dashes. No exclamation marks unless the voice profile
  allows. No hype words.
- The email confirms decisions, names action items with owners,
  proposes next step.
- "Thanks for the time today" is allowed at the open. Anything
  more grateful than that is over-effusive, cut it.
- The next-step proposal is concrete (date, time, calendar
  link), not vague.
```

**Step 3.2, the send.**

The draft lands in the operator's drafts folder, prefilled with the to / cc / subject / body. The operator opens it, reads, and clicks send. Total time from meeting end to email landing in the attendees' inbox: under 90 minutes.

### Phase 4, task creation

The action items from Phase 1 become tasks in Linear, Asana, Notion or whatever the operator's team uses.

**Step 4.1, the task prompt.**

```text
SYSTEM: You convert meeting action items into project-tool tasks.
For each action item, you produce the task title, description,
owner, due date, labels, and links back to the meeting context.

USER:
Action items (from Phase 1):
{PASTE_PHASE_1_ACTION_ITEMS}

Project tool taxonomy (labels, projects, teams):
{PASTE_PROJECT_TOOL_TAXONOMY}

Meeting context (title, date, transcript link if available):
{PASTE_MEETING_CONTEXT}

Return JSON (array, one entry per action item):
[
  {
    "title": "<noun-led, 6-12 words>",
    "description": "<one paragraph, 40-80 words, context plus quote>",
    "owner_email": "<email of the owner>",
    "due_date": "<YYYY-MM-DD>",
    "labels": ["<from taxonomy>"],
    "project": "<from taxonomy or null>",
    "priority": "<urgent | high | medium | low>",
    "linked_meeting": "<title and date>",
    "linked_transcript": "<url or null>"
  }
]

Rules:
- title is concrete and verb-implicit.
- description includes the verbatim transcript quote so the
  owner can read what was actually said.
- priority defaults to "medium" unless the action item has a
  deadline within 48 hours.
- Return JSON only.
```

**Step 4.2, the write.**

The project tool connector creates the tasks. The owner gets the standard notification from their tool. The operator gets a Slack DM with a count of tasks created and links to each.

### Phase 5, the close loop

The Phase 1 summary, the CRM update, the email and the task list all reference the same meeting. The pipeline writes a single "meeting record" to `.lens/meetings/{date}-{slug}.md` that combines all four outputs.

This record is what the personal-knowledge-base playbook reads when the operator asks "what did we agree with Trail Club last quarter?" three months later.

## Worked example, end-to-end

Saoirse Burns finishes her 16:30 call with James Whitaker from Trail Club. The call ran 47 minutes. Granola captured the transcript.

**Phase 1 output (excerpt).**

```json
{
  "summary": "Saoirse and James walked through Trail Club's 2027 regional events calendar. Manchester has 18 events scheduled, four of which James positioned as 'flagship'. James named three brands on his shortlist and confirmed Cascadia is one. The conversation moved from cross-promotion (the current model) to a paid partnership with kit, signage and athlete involvement. Saoirse committed to a follow-up with a partnership scope and a commercial proposal by 22 September. The decision on commercial appetite shifts from Beth to Saoirse for 2027.",
  "decisions": [
    {
      "decision": "Cascadia partnership ownership moves from Beth Lyons to Saoirse Burns for 2027.",
      "decided_by": "Saoirse",
      "transcript_quote": "I'll own this for 2027, Beth stays in the loop but I'll be the primary."
    }
  ],
  "action_items": [
    {
      "owner": "Saoirse Burns",
      "action": "Send partnership scope and commercial proposal to James.",
      "due": "2026-09-22",
      "context": "Trail Club needs to lock partners by mid-October.",
      "transcript_quote": "I'll have the scope and the commercial across to you by the 22nd."
    },
    {
      "owner": "James Whitaker",
      "action": "Share the four flagship events brief with Saoirse.",
      "due": "2026-09-12",
      "context": "Needed before Saoirse can size the commercial.",
      "transcript_quote": "I'll get you the flagship briefs end of next week."
    }
  ]
}
```

**Phase 2 output, CRM update.**

```json
{
  "company": "Trail Club",
  "primary_contact": "James Whitaker",
  "deal_id": "new",
  "stage_update": {
    "previous_stage": "no open deal",
    "new_stage": "Discovery",
    "rationale": "Trail Club moved from cross-promotion to paid partnership conversation. Opening as a Discovery-stage deal."
  },
  "amount_update": {
    "previous_amount": null,
    "new_amount": "TBD, scope landing 22 Sep",
    "rationale": "Amount not named yet, awaiting partnership scope."
  },
  "close_date_update": {
    "previous_close_date": null,
    "new_close_date": "2026-10-15",
    "rationale": "James named mid-October as the partner lock deadline."
  },
  "next_step": {
    "action": "Send partnership scope and commercial proposal.",
    "owner": "Saoirse Burns",
    "due": "2026-09-22"
  }
}
```

**Phase 3 output, follow-up email.**

```text
To: james.whitaker@trail.club
Cc: beth@cascadia-endurance.com
Subject: Trail Club partnership, next step

James,

Thanks for the call. Quick recap of what we landed on.

I'll have the partnership scope and the commercial proposal across
to you by the 22nd. The scope covers kit, signage and athlete
involvement across the four flagship events you flagged. The
commercial will give you three options so you can pick the shape
that fits Trail Club's 2027 plan.

You're sharing the flagship event briefs end of next week. That
gives me what I need to size the commercial properly.

I'm owning this from the Cascadia side for 2027. Beth stays in
the loop but I'm the primary now, so happy to be the direct
contact going forward.

Looking forward to building this properly.

Saoirse
```

Tone-check passes. Saoirse reads in 12 seconds, clicks send. Email lands in James's inbox at 17:38, 21 minutes after the call ended.

**Phase 4 output, tasks.** Two tasks created in Linear: one for Saoirse (partnership scope, due 22 Sep), one watching for James's brief (Saoirse as owner, due 12 Sep, marked as "awaiting input"). Beth gets cc'd on both as a watcher.

**Phase 5 output.** A single meeting record lands at `.lens/meetings/2026-09-08-trail-club-james-whitaker.md` with all four outputs combined. Three months later, when Saoirse asks "what did we agree with Trail Club in September?", the answer comes back in two seconds.

## Try it yourself

Three exercises, each under 30 minutes.

### Exercise 1, ingest a real transcript

Pick a real meeting transcript from the last week (Granola, Fireflies, paste from Zoom). Run the Phase 1 prompt. Read the action items and decisions. Compare to what you remember. The gap is the value, decisions and action items the model surfaced that you would have lost.

### Exercise 2, write a CRM update by hand, then run the pipeline

For a recent call, write the CRM update you would have written by hand. Then run Phase 2 with the transcript. Compare. Where the pipeline is more thorough is where it pays back. Where it is missing context, the prompt needs tuning.

### Exercise 3, the 90-minute test

Pick a call you have tomorrow. Set a 90-minute timer the moment the call ends. Run the full pipeline. The email should be in the attendee's inbox before the timer expires. If it is not, the bottleneck is the bit you should automate next.

## The eval gates

**Eval 1, decision capture.** Sample 10 transcripts. Every decision named in the transcript appears in the Phase 1 output. Below 90 percent capture, the ingestion prompt is missing structure cues. Tighten the "decided_by requires evidence" rule.

**Eval 2, action item ownership.** Every action item has a named owner. Owners labelled "the team" or "someone" are pipeline failures. Below 95 percent named ownership, retrain the prompt with explicit owner-naming examples.

**Eval 3, email send latency.** From call end to email sent should sit under 90 minutes for 80 percent of calls. Above 90 minutes the pipeline is not running automatically enough.

**Eval 4, CRM stage accuracy.** Sample 20 stage updates. The advance or hold matches what the operator would have done in 18 of 20. Below 15 of 20, the stage taxonomy was wrong (probably ambiguous stages), tighten the taxonomy.

## The failure modes

**Action items get fabricated.** A long call with a lot of "we should" language can produce action items that no one actually committed to. The transcript_quote requirement is the guardrail. Without a quote, the action item does not ship.

**CRM updates over-advance.** A discovery call rarely moves a deal to proposal. The model is biased toward visible progress. The "no change" default if nothing explicit moved the deal is the discipline.

**Email reads as a recap, not a follow-up.** The draft summarises back to the attendee what they already know. The correction is the "no padding the open" rule plus the named next step. The follow-up is the operator's commitment, not the call's summary.

**Tasks pile up without context.** A task created without the transcript_quote and the linked meeting becomes orphan work. Always include the quote in the description and the linked meeting in the task metadata.

**Privacy leak in cc.** The follow-up cc list defaults to internal stakeholders mentioned in the call. Make sure the cc list is filtered to the right people before send. An accidental cc to a board member of an internal-only note is the high-stakes failure.

## The pattern in practice

**Founder-led sales at growth stage, the deal velocity unlock.** A founder running 12 discovery calls a week. The pipeline gets the follow-up email out within 30 minutes of every call. Deal velocity rises measurably because next-step momentum is high. The operator does no manual CRM updating, the system does it.

**Marketing director with partner-facing calls, the institutional memory.** A director running partner check-ins. Three months in, the meeting record file becomes searchable institutional memory. "What did we agree with Aros Outdoors in June?" gets answered in two seconds, not from the operator's memory plus a Gmail search.

**B2B account exec at scale, the team handoff.** An account exec passing deals to customer success after close. The full meeting record (transcripts, decisions, action items) hands off cleanly. The customer success team walks in knowing what was promised, the deal does not regress because the handoff was incomplete.

## Hand-off

Once the loop is running, the work feeds:
- **meeting-prep-stack**, where the next pack reads from the meeting record automatically
- **inbox-to-task-pipeline**, where threads that need follow-up after the meeting become tasks
- **personal-knowledge-base**, where every meeting record becomes part of the searchable corpus
- **weekly-pipeline-rollup**, where the CRM updates feed the stakeholder report automatically
