---
title: "Email triage and draft, 100+ unread to clean inbox in 20 minutes"
stack: productivity
description: "Process a hundred unread emails to a clean inbox in twenty minutes with brand-voice-loaded drafts. The pipeline does the sorting, you do the sign-off."
outputs: "Triage matrix, classification prompt, voice-loaded draft prompt, daily 20-minute routine, eval rubric"
readMin: 21
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["inbox", "crm", "tasks"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-08-18
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **triage matrix** that classifies any inbound email into one of seven actions in under two seconds. The matrix is the spec the model uses, you tune it once and reuse it forever.
2. A **classification prompt** that runs across an unread queue of any size and labels each item with action, urgency and required reply length.
3. A **voice-loaded draft prompt** that produces a reply in your brand voice, sign-off-ready in one revision pass.
4. A **20-minute daily routine** with the click-paths through Gmail or Outlook to run the pipeline at speed, plus the eval rubric to keep it honest.

## Who this is for

A marketing operator, founder or GTM lead receiving 80 to 200 inbound emails a day across customer, internal and external senders. You write in a recognisable voice (yours or your brand's) and the cost of an off-voice reply is real. You have a brand voice profile to load (see the brand-voice-extraction playbook).

If your inbox is under 40 a day, manual triage is faster than the pipeline. If it is over 300, you need delegation and a real EA, not a triage system.

## Before you start

- [ ] Gmail or Outlook with a working API token or OAuth scope
- [ ] A brand voice profile (output of brand-voice-extraction). 2 to 3 paragraphs is enough
- [ ] A CRM contact list (export or live API) so the system can recognise customers from cold senders
- [ ] A short VIP list, 10 to 30 people whose emails always surface
- [ ] An archive of your last 100 sent emails as a voice reference corpus
- [ ] A label or folder structure in your inbox (the pipeline creates labels if missing)

If you do not have a brand voice profile yet, run brand-voice-extraction first. Drafting without a loaded voice produces generic prose that you will rewrite by hand, which kills the time saving.

## The pipeline

Four phases. Phase 1 sets up the matrix once. Phases 2 through 4 are the daily 20-minute routine.

### Phase 1, triage matrix

The matrix is the rulebook. Tune it once, then the classification prompt reads it on every run.

**Step 1.1, the seven actions.**

Every inbound email gets one of these labels.

| Action | When it applies |
|---|---|
| Reply now | Direct ask from VIP, customer escalation, today-deadline language, exec request |
| Reply today | Response expected within 24 hours, customer or partner asking for substantive answer |
| Reply this week | Substantive but not urgent, requires context to respond well |
| Delegate | Could be handled by a named team member, sender does not require you personally |
| Schedule | Requires a 30+ minute slot for a real response, not a 5-minute reply |
| Archive | Acknowledged or informational, no reply required |
| Block or unsubscribe | Newsletter, marketing blast, automated alert with no signal |

Write the matrix to `triage-matrix.md` in your working directory.

**Step 1.2, the VIP list.**

The list has names, not just email addresses. Aliases get mapped (`marcus.hale@cascadia-endurance.com` and `marcus@cascadia.uk` are the same person). Keep the list under 30. Above 30 the "VIP" label loses meaning.

**Step 1.3, the delegation map.**

For each "delegate" action, name the recipient. The map looks like this.

| Sender type | Delegate to |
|---|---|
| Wholesale rep, standard pre-book question | Sales coordinator, with template |
| Press desk, accreditation or photo request | PR lead |
| Internal ops, IT or facilities | Ops manager |
| Inbound recruiter | Auto-decline template |
| Vendor cold pitch | Mark as read, no reply |

Save as `delegation-map.md`. The classification prompt reads it directly.

### Phase 2, classification pass

Daily, takes under two minutes once wired.

**Step 2.1, the classification prompt.**

```text
SYSTEM: You classify inbound emails using the operator's triage
matrix and VIP list. Every email gets one of seven actions. You
do not draft replies in this pass, you only label.

USER:
Triage matrix:
{PASTE_TRIAGE_MATRIX}

VIP list:
{PASTE_VIP_LIST}

Delegation map:
{PASTE_DELEGATION_MAP}

Inbox items (sender, subject, snippet, timestamp, thread_id):
{PASTE_UNREAD_QUEUE}

CRM contact emails (for "known customer" detection):
{PASTE_CRM_CONTACTS}

For each item return JSON:
{
  "thread_id": "<verbatim>",
  "sender": "<name or email>",
  "sender_category": "<vip | known-customer | known-vendor | cold-inbound | newsletter | automated>",
  "action": "<reply-now | reply-today | reply-week | delegate | schedule | archive | block>",
  "delegate_to": "<name or null>",
  "urgency_drivers": ["<phrases from the email that drove urgency>"],
  "estimated_reply_minutes": <int>,
  "reply_length_target": "<one-line | short-paragraph | full>"
}

Rules:
- "reply-now" only for VIP + urgency, or customer escalation.
- "block" only for newsletters and automated alerts with no signal.
- "delegate" requires a named recipient from the delegation map. If
  no named recipient fits, default to "reply-today".
- urgency_drivers is a verbatim list of phrases. No interpretation.
- estimated_reply_minutes capped at 30. Anything above goes to
  "schedule".
- Return JSON only.
```

**Step 2.2, apply the labels.**

The output JSON drives label assignment in Gmail or Outlook.

For Gmail, the script applies labels through the API. For Outlook, the same through Microsoft Graph. If you are running manually, copy the action column into Gmail's bulk-label dialog.

**Step 2.3, archive the archives and block the blocks.**

The "archive" and "block" actions execute automatically. The operator never sees these. This is the volume reduction that makes the rest of the pipeline workable.

**You should now have** the inbox reduced by roughly half, with the remaining items labelled by action.

### Phase 3, voice-loaded drafts

For every "reply-now" and "reply-today" item, the system drafts a reply in the operator's voice.

**Step 3.1, the draft prompt.**

```text
SYSTEM: You draft an email reply in the operator's brand voice.
You are not writing on behalf of the brand to a customer, you are
writing as the operator. The voice is theirs, the signature is
theirs. You produce a draft the operator can send with one
revision pass or no revision at all.

USER:
Operator brand voice profile:
{PASTE_VOICE_PROFILE}

Voice reference corpus (5 to 10 of the operator's recent sent emails):
{PASTE_SENT_REFERENCE}

Email thread to reply to (full thread, oldest first):
{PASTE_THREAD}

Classification metadata for this item:
{PASTE_CLASSIFICATION_JSON}

Operator's signature block:
{PASTE_SIGNATURE}

Return JSON:
{
  "draft_subject": "<verbatim of the reply subject, usually 'Re: original'>",
  "draft_body": "<the reply, plain text, includes signature at the end>",
  "tone_check": {
    "matches_voice": <true | false>,
    "drift_notes": ["<one-sentence flags where the draft drifts from voice>"]
  },
  "confidence": "<high | medium | low>",
  "operator_action_required": "<send-as-is | review-and-send | rewrite-needed>"
}

Rules:
- reply_length_target from classification metadata is binding.
  one-line means under 25 words.
  short-paragraph means 50 to 100 words.
  full means 100 to 250 words.
- No em dashes. No exclamation marks unless the operator's voice
  profile explicitly allows them.
- No hype words.
- The draft uses contractions if the voice profile does.
- The reply addresses the most recent ask in the thread, not the
  whole thread history. Do not summarise back to the sender unless
  asked.
- Confidence "low" triggers "rewrite-needed". Don't ship low-
  confidence drafts.
- The signature block is appended verbatim.
```

**Step 3.2, the review pass.**

The operator opens each draft. The signal is whether the draft is "send-as-is" or "review-and-send".

For "send-as-is" the operator clicks send, total time per email roughly 8 seconds.

For "review-and-send" the operator edits in place, total time per email 30 to 90 seconds.

For "rewrite-needed" the operator either writes the reply manually or re-prompts the draft model with a sharper specification.

### Phase 4, the 20-minute routine

The daily routine has a fixed shape.

**Step 4.1, the 20-minute timer.**

Set a 20-minute timer. Open inbox. Run the classification pass on the unread queue. Apply labels. Archive and block execute automatically.

**Step 4.2, the draft sweep.**

Sort the inbox by the action labels. Start with "reply-now". Open each draft, send or edit-and-send. Move to "reply-today". Same pattern.

**Step 4.3, the schedule sweep.**

For "schedule" items, the operator adds a calendar block within 48 hours for the longer reply. The block goes in the calendar with the thread_id in the description, so the reply has its context when the slot arrives.

**Step 4.4, the timer expires.**

When the 20-minute timer expires, stop. Whatever is left is "reply-week" or already-handled. The hard time-box is the discipline. Pursuing inbox zero past 20 minutes is the failure mode.

## Worked example, end-to-end

Saoirse Burns at Cascadia Endurance. Monday morning, 143 unread emails from the weekend. She opens the pipeline at 08:00.

**Classification pass output (summarised).** 143 emails classified in 90 seconds. Breakdown:

- Reply-now: 7 (Marcus's budget question, three customer escalations, two press deadlines, one wholesale rep with a confirmed PO)
- Reply-today: 19 (substantive responses, mixed external and internal)
- Reply-week: 23 (longer threads with no time pressure)
- Delegate: 11 (six wholesale standard questions to the sales coordinator, three IT tickets to ops, one PR request to the PR lead, one recruiter auto-decline)
- Schedule: 4 (longer strategic conversations needing real time)
- Archive: 51 (cc-only, FYI, acknowledged threads)
- Block: 28 (newsletters and automated alerts)

The 51 archive and 28 block items execute automatically. Saoirse never sees them. The inbox is now 64 items deep instead of 143.

**Draft pass output (a sample).** The "reply-now" Marcus budget question gets this draft.

```text
Subject: Re: Vahla launch budget question

Marcus,

The Storm Shell launch sits at £62k against the £75k brief. The
two underspends are the photography day at -£4k (we used in-house
on the second shoot) and the influencer seeding at -£9k (the
ambassador programme picked up two of the seeding slots without
charge).

Headroom is £13k. I would put £8k into a second paid social
flight in the launch window and hold £5k as contingency for the
UTMB activation if the press list lands above target.

I can be on the 11:00 if you want to walk through the line items.

Saoirse
```

Confidence high, tone-check passes, no drift flagged. Saoirse reads it in 6 seconds and clicks send.

**The 19 reply-today drafts.** Roughly 14 ship as-is. Three need a 20-second edit (mostly tightening the close). Two get rewritten by hand because the thread context is more nuanced than the model picked up.

**The 11 delegations.** The system either auto-forwards with a template ("Aros, Joel handles wholesale schedules, copying him here") or applies a delegate label and Joel picks them up from his queue.

The 20-minute timer expires at 08:20. The inbox is at 23 items, all "reply-week" or "schedule". Saoirse closes the inbox and opens her calendar.

By Friday, the system has shipped 287 replies across the week, of which 198 went as-is and 71 were edited in under 30 seconds. The 18 that got hand-rewritten are the corpus for next week's voice-profile tuning.

## Try it yourself

Three exercises, each under 30 minutes.

### Exercise 1, draft the triage matrix from your own behaviour

Open your inbox. For the last ten emails you actually answered, write down the action you took ("replied within an hour", "delegated to Joel", "archived after one read"). The pattern is your matrix. Compare to the default matrix above. Where you diverge is the local rule.

### Exercise 2, run the classification pass on a 20-email sample

Take 20 unread emails. Paste them into the classification prompt. Read the labels. Where the model and your gut disagree, the disagreement is the tuning. Either the matrix is wrong (rewrite the matrix) or your gut is wrong (the model caught a signal you missed). Both happen.

### Exercise 3, run the draft pass on three reply-now items

Pick three real "reply-now" items. Run the draft prompt with your voice profile loaded. Read the drafts. For each, mark send-as-is, edit-and-send, or rewrite-needed. The first time through, expect roughly half rewrite-needed. After three iterations of voice-profile tuning, the rewrite rate should drop under 15 percent.

## The eval gates

**Eval 1, classification accuracy.** Sample 30 classified emails. The action assigned matches what the operator would have chosen for at least 27 of 30. Below 25 the matrix needs tuning.

**Eval 2, draft sendability.** At least 65 percent of drafts go send-as-is. Between 50 and 65 percent, the voice profile needs more reference material. Below 50 percent the pipeline is producing rewrite work, not saving it.

**Eval 3, time-box discipline.** The 20-minute timer is hard. If the routine consistently runs 30 minutes, the classification matrix is over-triaging "reply-now" or "reply-today". Move more items into "reply-week".

**Eval 4, archive recall.** Sample 10 items the system archived. Did any of them actually need a reply? Zero is the target. One is acceptable. Two or more means the archive criteria are too loose.

## The failure modes

**The voice profile is too thin.** A two-line voice profile produces generic drafts. The fix is the voice reference corpus, 5 to 10 of the operator's recent sent emails appended to every draft prompt. That alone usually moves drafts from generic to recognisable.

**Delegation map goes stale.** New team members and shifted responsibilities mean the delegation map needs a monthly review. A delegation map that names someone who no longer owns the function produces awkward forwards.

**VIP list drift.** New direct reports, new founders, new board members. The VIP list needs a weekly two-minute pass. Without it the "reply-now" label slowly misses the people it should surface.

**Send-as-is becomes send-without-reading.** When draft quality is high, the operator stops reading. Two months in, a draft that mis-quotes a number gets sent without correction. Hold the rule that "reply-now" drafts get a one-second read before the click.

**The pipeline replaces judgment.** Some emails do not belong in the routine. A customer cancelling, a personal note from a family member, a sensitive HR thread. The pipeline labels these as needing reply, the operator's job is to recognise the ones that need a real human response and step out of the routine for them.

## The pattern in practice

**Founder-led brand at growth stage, the time recovery.** A founder receiving 180 emails a day. The pipeline cuts inbox time from 90 minutes a day to 20. The compounding value is the consistency of voice. Every reply reads like the founder, every reply ships within 24 hours.

**Marketing director at scale, the delegation unlock.** A director with 14 direct reports. Many of the inbound emails should never have been the director's. The delegation map makes the redirect automatic. The team's average response time to wholesale partners drops because the wholesale standard questions never wait in the director's inbox.

**B2B GTM lead, the customer escalation pattern.** A GTM lead's inbox is full of partner check-ins, internal status pings and a small number of customer escalations. The matrix surfaces the escalations and routes the partner pings to reply-week. The escalation response time drops from hours to minutes. The check-ins ship within the day.

## Hand-off

Once the daily routine is running, the work feeds:
- **daily-briefing-pipeline**, where the inbox section reads the classified queue rather than the raw unread
- **inbox-to-task-pipeline**, where "schedule" items get a Linear or Asana task with the thread context attached
- **call-follow-up-loop**, where post-meeting reply drafts run through the same voice-loaded draft prompt
- **document-drafting-partner**, where longer replies escalated to "schedule" become drafts in Docs with the brand voice loaded
