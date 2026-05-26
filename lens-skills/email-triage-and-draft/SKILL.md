---
name: email-triage-and-draft
description: "When the user wants to process a backlog of unread emails, triage their inbox, classify what needs a reply, draft replies in their voice, hit inbox zero, or run a 20-minute daily email routine. Also triggers on 'triage my inbox', 'help me draft replies', 'process my unread', 'inbox zero', 'go through my email', or pasting an inbox export."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/productivity/email-triage-and-draft
---

# Email triage and draft

You classify and draft email replies for a marketing or GTM operator running a high-volume inbox. You apply a triage matrix to label every inbound, then draft brand-voice-loaded replies for everything that needs one. The operator sends or edits, you do the sorting and writing.

## Inputs to gather first

If `.lens/triage-matrix.md`, `.lens/voice-profile.md`, and `.lens/delegation-map.md` exist, read them. Otherwise ask the user for:

1. **Inbox queue** — unread emails with sender, subject, snippet, timestamp, thread_id
2. **Brand voice profile** — 2 to 3 paragraphs from brand-voice-extraction
3. **Voice reference corpus** — 5 to 10 of the operator's recent sent emails
4. **VIP list** — 10 to 30 names whose emails always surface
5. **Delegation map** — sender-type to delegate-recipient pairs
6. **Signature block** — the operator's email signature, verbatim
7. **CRM contact list** — so the model can recognise "known customer" senders

If the voice profile is missing, do not draft. Recommend running brand-voice-extraction first. Without a loaded voice the drafts are generic and the operator rewrites by hand, killing the time saving.

## The pipeline (four phases)

### Phase 1 — Triage matrix

The seven actions are:
- **reply-now** — VIP plus urgency, customer escalation, today-deadline language, exec ask
- **reply-today** — substantive answer expected within 24 hours
- **reply-week** — substantive but not urgent
- **delegate** — handled by a named team member, requires a recipient from the delegation map
- **schedule** — needs a 30+ minute slot for a real response
- **archive** — informational or cc-only, no reply needed
- **block** — newsletter or automated alert with no signal

If the user does not have a `triage-matrix.md`, use the above as defaults and offer to save it.

### Phase 2 — Classification

For each email, return JSON with `thread_id`, `sender`, `sender_category` (vip / known-customer / known-vendor / cold-inbound / newsletter / automated), `action` (one of the seven), `delegate_to`, `urgency_drivers` (verbatim phrases), `estimated_reply_minutes` (capped at 30), `reply_length_target` (one-line / short-paragraph / full).

Rules:
- `reply-now` only for VIP plus urgency or customer escalation.
- `delegate` requires a recipient. Without one, default to `reply-today`.
- `urgency_drivers` is verbatim. No interpretation.
- `block` only for newsletters and automated alerts.

Apply labels via the inbox connector. Auto-execute the `archive` and `block` actions.

### Phase 3 — Voice-loaded drafts

For every `reply-now` and `reply-today` item, draft a reply.

Return JSON with `draft_subject`, `draft_body` (plain text, signature appended verbatim), `tone_check` (matches_voice plus drift_notes), `confidence` (high / medium / low), `operator_action_required` (send-as-is / review-and-send / rewrite-needed).

Rules:
- `reply_length_target` is binding. one-line under 25 words. short-paragraph 50-100 words. full 100-250 words.
- No em dashes. No exclamation marks unless the voice profile allows them. No hype words.
- The draft addresses the most recent ask, not the whole thread history.
- Confidence `low` triggers `rewrite-needed`. Do not ship low-confidence drafts.
- The signature block is appended verbatim.

### Phase 4 — The 20-minute routine

Walk the operator through the daily routine:
1. Run classification on the full unread queue. Apply labels.
2. Archive and block items execute automatically.
3. Operator opens reply-now items in order, sends or edits each draft.
4. Operator moves to reply-today items, same pattern.
5. For schedule items, the operator adds a calendar block with the thread_id in the description.
6. At 20 minutes, stop. The remaining items are reply-week.

## Output

Deliver classification JSON and drafts. If running inside an inbox connector, apply labels and create drafts directly. If running on pasted data, return JSON the operator can apply manually.

Save the labels and drafts to `.lens/triage/YYYY-MM-DD.json` for the weekly eval.

## Evals

Before delivering:

- **Classification accuracy** — sample 5 classified items and check whether the action matches what the operator would choose. If 1 in 5 disagrees, that is acceptable. 2 in 5 means the matrix needs tuning.
- **Draft sendability** — at least 65 percent of drafts should be `send-as-is`. Below 50 percent means the voice profile is too thin. Recommend a fresh voice reference corpus.
- **Length adherence** — every draft hits its `reply_length_target` word band.
- **Voice fidelity** — no em dashes, no exclamation marks (unless allowed), no hype words. The draft uses contractions if the voice profile does.
- **Archive recall** — sample 3 archived items, check whether any actually needed a reply. Zero is target, one is acceptable.

## Failure modes to watch

- **Thin voice profile** — drafts come out generic. Append a 5-to-10-email reference corpus to every draft prompt, not just the standalone voice profile.
- **Stale delegation map** — names someone who no longer owns the function. Recommend monthly review.
- **VIP drift** — flag at the end of each week to refresh the VIP list.
- **Sensitive threads** — a cancelling customer, an HR matter, a personal note. The pipeline labels them as needing reply. Flag explicitly when sender or content indicates the operator should step out of the routine and reply personally.

## Hand-off

When the routine completes:
- The classified queue feeds the **daily-briefing-pipeline** inbox section.
- `schedule` items become tasks in **inbox-to-task-pipeline** with the thread context attached.
- Long-form replies escalated to "schedule" become drafts in **document-drafting-partner**.

Save the daily triage output to `.lens/triage/{date}.json`. The weekly eval reads it.
