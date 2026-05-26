---
name: call-follow-up-loop
description: "When the user has a meeting transcript and wants a CRM update, follow-up email, action-item tasks, or all three. Triggers on 'process this call', 'turn this transcript into', 'follow up on the meeting', 'CRM update from the call', 'send the follow-up', 'create tasks from the meeting', or pasting a Granola/Fireflies/Otter/Zoom transcript."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/productivity/call-follow-up-loop
---

# Call follow-up loop

You convert a meeting transcript into four downstream artefacts: a structured summary, a CRM update payload, a follow-up email draft in the operator's voice, and tasks in Linear, Asana or the operator's project tool. The whole pipeline runs in under 90 minutes from call end to email landing.

## Inputs to gather first

1. **Transcript** — Granola, Fireflies, Otter, Zoom transcript, or paste
2. **Meeting metadata** — title, date, duration, attendees (internal and external)
3. **Meeting prep pack** if it exists (read from `.lens/prep/{date}-{slug}.md`)
4. **CRM record before the meeting** for the company and primary contact
5. **CRM stage taxonomy** — the operator's pipeline stages, in order
6. **Brand voice profile** for the email draft
7. **Voice reference corpus** — operator's last 5 follow-up emails
8. **Project tool taxonomy** — labels, projects, teams
9. **Operator signature**

If transcript or attendee list is missing, do not proceed. Ask the user to provide.

## The pipeline (five phases)

### Phase 1 — Transcript ingestion

Return JSON with `summary` (80-150 words), `decisions` (each with `decision`, `decided_by`, `transcript_quote`), `action_items` (each with `owner`, `action`, `due`, `context`, `transcript_quote`), `unresolved_questions`, `tone_shift_signals`, `topics_planned_but_not_discussed`, `topics_unplanned_but_raised`.

Rules:
- Every decision and action item has a `transcript_quote`. No attribution without quote.
- `decided_by` is "jointly" only when transcript shows mutual agreement.
- `topics_planned_but_not_discussed` and `topics_unplanned_but_raised` are populated only when a prep pack was provided.

Pause for the operator's 60-second review before writing to downstream systems.

### Phase 2 — CRM update payload

Return JSON with `company`, `primary_contact`, `deal_id`, `stage_update` (previous / new / rationale), `amount_update`, `close_date_update`, `call_notes` (150-250 words, 4-6 bullets), `next_step` (action / owner / due).

Rules:
- `stage_update` only changes if a Phase 1 decision explicitly moved it. Otherwise "no change".
- `amount_update` only changes if a number was named.
- `close_date_update` only changes if a timeline was named.
- `next_step` is the operator's next step, not the prospect's.

Write via CRM connector. Slack-DM the operator a confirmation with link.

### Phase 3 — Follow-up email draft

Return JSON with `to`, `cc`, `subject`, `body` (100-220 words, plain text, signature appended), `estimated_send_time` (within 90 min of meeting end), `tone_check`, `operator_action_required` (send-as-is / review-and-send / rewrite-needed).

Rules:
- No em dashes. No exclamation marks unless voice profile allows.
- "Thanks for the time today" at the open is allowed. More than that is over-effusive, cut.
- Confirms decisions, names action items with owners, proposes next step.
- Next-step proposal is concrete (date, time, calendar link), not vague.

Land in the operator's drafts folder. Operator reviews and sends.

### Phase 4 — Task creation

Return JSON array, one entry per action item, with `title` (6-12 words, verb-implicit), `description` (40-80 words including transcript quote), `owner_email`, `due_date`, `labels`, `project`, `priority`, `linked_meeting`, `linked_transcript`.

Rules:
- `description` includes the verbatim transcript quote.
- `priority` defaults to "medium" unless deadline is within 48 hours.

Write via project tool connector. Slack-DM the operator a count and links.

### Phase 5 — Close loop

Combine all four outputs into a single meeting record at `.lens/meetings/{date}-{slug}.md`. This is what **personal-knowledge-base** reads when the operator asks "what did we agree with X last quarter?"

## Output

Five things, in order:
1. Structured summary JSON (Phase 1)
2. CRM update written and confirmation DM'd (Phase 2)
3. Email draft created in inbox (Phase 3)
4. Tasks created in project tool (Phase 4)
5. Meeting record saved to `.lens/meetings/{date}-{slug}.md` (Phase 5)

## Evals

Before delivering:

- **Decision capture** — every decision in the transcript surfaces in Phase 1.
- **Action item ownership** — every action item has a named owner. No "the team" or "someone".
- **Email send latency** — total pipeline runtime under 30 minutes so the operator has time to review and send within 90 minutes of call end.
- **CRM stage discipline** — "no change" is the default unless an explicit decision moved the deal.
- **Quote requirement** — every decision and action item has a verbatim transcript quote. No quote, no entry.

## Failure modes to watch

- **Fabricated action items** — long calls with "we should" language produce action items no one committed to. Hold the transcript-quote rule.
- **Over-advanced CRM stage** — bias toward visible progress. Default to "no change".
- **Email reads as recap** — the email should be the operator's commitment, not a summary back to the attendee.
- **Orphan tasks** — tasks without transcript context get ignored. Always include the quote.
- **Privacy leak in cc** — filter the cc list before send. Accidental cc to a board member is the high-stakes failure.

## Hand-off

- The next **meeting-prep-stack** pack reads from the meeting record.
- Threads needing follow-up become **inbox-to-task-pipeline** tasks.
- **personal-knowledge-base** indexes the meeting record.
- **weekly-pipeline-rollup** reads CRM updates directly.

Save the meeting record to `.lens/meetings/{date}-{slug}.md`.
