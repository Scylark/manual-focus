---
title: "Inbox to task pipeline, emails that need work become tasks automatically"
stack: productivity
description: "Inbound emails that contain work get parsed into Linear, Asana or Notion tasks with the context attached. Nothing falls through the gap between inbox and project tool."
outputs: "Detection prompt, task extraction prompt, owner-and-due-date logic, project-tool write integration, eval rubric"
readMin: 21
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["inbox", "tasks", "crm"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-09-14
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **detection prompt** that scans email threads and identifies which ones contain work that should become a task, versus replies, FYIs and acknowledgements that should not.
2. A **task extraction prompt** that converts the detected emails into structured task payloads with title, description, owner, due date and labels.
3. **Owner-and-due-date logic** that infers who should own each task and when it should be due, based on the email content, the sender and the operator's project taxonomy.
4. A **project-tool write integration** that creates the tasks in Linear, Asana, Notion, ClickUp or Monday with the email thread linked back as context.

## Who this is for

A marketing or GTM operator who currently does the inbox-to-task move manually and loses 10 to 20 minutes a day to it (or worse, loses tasks entirely because the move never happens). You have a project tool the team uses, an inbox with reasonable volume (40 to 200 emails a day) and the standing complaint that "things fall through the gap between email and Linear".

If your inbox is mostly replies and FYI threads, the pipeline is overkill. If you find yourself thinking "I need to put that in Linear" five times a day, you need this.

## Before you start

- [ ] Gmail or Outlook with read access via API or OAuth scope
- [ ] Project tool with task-creation API: Linear, Asana, Notion, ClickUp, Monday, or another
- [ ] Project taxonomy: labels, projects, teams, priority levels
- [ ] CRM contact list for "is this from a customer" detection
- [ ] Voice profile if you want the task descriptions to read in your tone (optional)
- [ ] Operator's typical workload signals: who reports to you, who you report to, your direct collaborators
- [ ] 60 minutes blocked for setup

The pipeline assumes the email-triage-and-draft pipeline runs alongside or before this one. The two work together. Triage decides "reply or not". This decides "becomes a task or not".

## The pipeline

Four phases. Phase 1 sets the detection rules. Phases 2 through 4 are the daily run.

### Phase 1, detection rules

Not every email becomes a task. The detection rules separate work-containing emails from the rest.

**Step 1.1, the work signals.**

An email contains work if any of these are true.

- The sender asks the operator (or someone the operator can route to) to do something specific
- The sender confirms something the operator agreed to do
- The sender shares a deadline the operator is responsible for
- The sender raises a problem the operator needs to investigate or escalate
- The thread closes with an action item without naming an owner

**Step 1.2, the non-work signals.**

An email does not become a task if it matches any of these.

- Pure FYI or status update with no ask
- Acknowledgement or thank-you (the action already happened)
- Newsletter or marketing blast
- Scheduling confirmation (the calendar event is the task)
- Notification from a tool (the tool itself is tracking the work)

**Step 1.3, the ambiguous-signal rule.**

When an email could be a task or could be acknowledgement, the default is task with a low confidence score. The operator can dismiss low-confidence tasks in 2 seconds. Lost tasks cost more than dismissed tasks.

Save as `task-detection-rules.md`.

### Phase 2, the detection pass

Runs alongside the email triage pass, or independently if triage is not wired.

**Step 2.1, the detection prompt.**

```text
SYSTEM: You scan inbound email threads and identify which ones
contain work the operator should track as a task. You apply
the detection rules. You return one entry per thread, with the
detection verdict and a confidence score.

USER:
Detection rules:
{PASTE_DETECTION_RULES}

Inbox items (sender, subject, snippet, full body if available,
thread_id, timestamp):
{PASTE_INBOX_ITEMS}

CRM contact list:
{PASTE_CRM_CONTACTS}

Operator's reports and collaborators:
{PASTE_OPERATOR_NETWORK}

For each thread return JSON:
{
  "thread_id": "<verbatim>",
  "sender": "<name>",
  "subject": "<verbatim>",
  "contains_work": <true | false>,
  "confidence": "<high | medium | low>",
  "work_signal": "<which rule triggered, verbatim from the rules>",
  "extracted_action": "<one-sentence summary of what needs to happen>",
  "suggested_owner_signal": "<self | direct-report-name | collaborator-name | external | unknown>",
  "deadline_signal": "<verbatim phrase indicating deadline, or null>"
}

Rules:
- contains_work true requires a matching work signal.
- "low" confidence is the default for ambiguous cases.
- suggested_owner_signal: "self" if the operator is the addressee
  and no obvious delegate. "direct-report-name" if the work fits
  someone's named responsibility.
- deadline_signal is verbatim from the email, not inferred.
- Return JSON only.
```

### Phase 3, task extraction

For each `contains_work: true` thread, the system extracts the task payload.

**Step 3.1, the extraction prompt.**

```text
SYSTEM: You convert a detected work-containing email thread into
a structured task payload for the operator's project tool. You
produce title, description, owner, due date, labels, priority
and links back to the source.

USER:
Project tool taxonomy:
{PASTE_TAXONOMY}

Operator network (reports, collaborators, manager):
{PASTE_NETWORK}

Email thread (full chronology):
{PASTE_THREAD}

Detection metadata for this thread:
{PASTE_DETECTION_JSON}

Return JSON:
{
  "title": "<verb-led, 6-12 words>",
  "description": "<one paragraph, 50-120 words, what the task is plus the verbatim ask from the email>",
  "owner_email": "<email of the owner>",
  "due_date": "<YYYY-MM-DD>",
  "due_date_source": "<verbatim email phrase | sender_deadline | inferred_from_typical_cadence>",
  "labels": ["<from taxonomy>"],
  "project": "<from taxonomy or null>",
  "priority": "<urgent | high | medium | low>",
  "linked_email_thread": "<thread_id>",
  "linked_email_subject": "<verbatim>",
  "context_quote": "<verbatim quote from the email that anchors the task>"
}

Rules:
- title is verb-led ("Review Foundry retainer scope", "Reply to
  Aros on AW27 commercial").
- description includes the verbatim quote from the email so the
  owner has the original ask in front of them.
- due_date inference rules:
  - If sender named a deadline ("by Friday", "end of week"), use it.
  - If the work is a reply, default to 24-48 hours.
  - If the work is a review or input, default to one week.
  - If the work is a longer piece, default to two weeks.
- priority inference:
  - urgent if deadline within 24h or sender is exec or customer escalation.
  - high if deadline within 48h.
  - medium default.
  - low if speculative or "when you have time" language.
- owner_email defaults to operator if no obvious delegate.
- Return JSON only.
```

**Step 3.2, the operator review.**

The proposed task payloads land in a review queue. The operator opens the queue (in the project tool's "Inbox" or a dedicated Notion view), reviews each in 5 to 10 seconds, and either confirms, edits the owner or due date, or dismisses.

For high-confidence detections from known senders, the operator can opt to auto-confirm. The system creates the tasks immediately without review.

### Phase 4, write and link

The confirmed tasks get created in the project tool with full context.

**Step 4.1, the write.**

Each task lands in the project tool with:

- Title
- Description (including the verbatim email quote)
- Owner
- Due date
- Labels and project from taxonomy
- Priority
- A link back to the email thread

For Linear, the email thread link goes in the task description and the issue title is the task title. For Asana, the same. For Notion, the task page has the email thread as a related entity. For ClickUp and Monday, the same pattern.

**Step 4.2, the email-side action.**

The system labels the source email in Gmail or Outlook with a `→ Tracked` label or moves it to an `Awaiting task completion` folder. The operator can archive or follow up depending on whether the thread needs a reply on top of the task.

**Step 4.3, the close loop.**

When the task is marked done in the project tool, the system optionally pings the email sender with a "this is done" reply if the operator has set that rule for the sender's task type. Most operators run this off by default and on for specific senders (customers, exec asks).

## Worked example, end-to-end

Saoirse Burns has 73 unread emails on Wednesday morning. The email-triage-and-draft pipeline runs first and labels 19 as `reply-now` or `reply-today`. The inbox-to-task pipeline runs alongside.

**Phase 2 output (excerpt), detection.**

```json
[
  {
    "thread_id": "t-4172",
    "sender": "Tom Vetter (Foundry)",
    "subject": "Storm Shell asset list, sign-off needed",
    "contains_work": true,
    "confidence": "high",
    "work_signal": "Sender asks the operator to do something specific.",
    "extracted_action": "Sign off the Storm Shell asset list for 22 Sep launch.",
    "suggested_owner_signal": "self",
    "deadline_signal": "by Tuesday"
  },
  {
    "thread_id": "t-4173",
    "sender": "Marcus Hale",
    "subject": "Re: Vahla launch budget question",
    "contains_work": true,
    "confidence": "high",
    "work_signal": "Sender shares a deadline the operator is responsible for.",
    "extracted_action": "Send Vahla budget breakdown before Marcus's 11:00 finance meeting.",
    "suggested_owner_signal": "self",
    "deadline_signal": "before 11:00"
  },
  {
    "thread_id": "t-4174",
    "sender": "Aros Outdoors wholesale",
    "subject": "Spring 2027 pre-book dates",
    "contains_work": true,
    "confidence": "high",
    "work_signal": "Sender asks the operator (or delegate) to do something specific.",
    "extracted_action": "Send Spring 2027 pre-book schedule.",
    "suggested_owner_signal": "direct-report-name: Joel Pemberton",
    "deadline_signal": null
  },
  {
    "thread_id": "t-4175",
    "sender": "Trail Club newsletter",
    "subject": "Weekly Trail Club roundup",
    "contains_work": false,
    "confidence": "high",
    "work_signal": "Newsletter or marketing blast"
  },
  {
    "thread_id": "t-4176",
    "sender": "James Whitaker",
    "subject": "Re: 2027 partnership scope",
    "contains_work": true,
    "confidence": "medium",
    "work_signal": "Sender confirms something the operator agreed to do.",
    "extracted_action": "Send partnership scope and commercial proposal to James.",
    "suggested_owner_signal": "self",
    "deadline_signal": "by the 22nd"
  }
]
```

**Phase 3 output (one task example).**

```json
{
  "title": "Sign off Storm Shell asset list for 22 Sep launch",
  "description": "Tom Vetter at Foundry agency needs sign-off on the Storm Shell launch asset list by Tuesday so the third cut of the launch film can lock. Specifically, he writes: 'I need your sign-off on the asset list by Tuesday end of day so we can lock the third cut and ship to wholesale partners on the Wednesday'. The asset list is in the linked email thread.",
  "owner_email": "saoirse@cascadia-endurance.com",
  "due_date": "2026-09-16",
  "due_date_source": "by Tuesday",
  "labels": ["Vahla Storm Shell", "launch", "agency-handoff"],
  "project": "Vahla Storm Shell launch",
  "priority": "high",
  "linked_email_thread": "t-4172",
  "linked_email_subject": "Storm Shell asset list, sign-off needed",
  "context_quote": "I need your sign-off on the asset list by Tuesday end of day so we can lock the third cut and ship to wholesale partners on the Wednesday."
}
```

**Phase 4 output.** Five tasks created in Linear (Saoirse's project tool of choice):

1. Sign off Storm Shell asset list (Saoirse, due 16 Sep, high priority)
2. Send Vahla budget breakdown to Marcus (Saoirse, due today 10:45, urgent)
3. Send Spring 2027 pre-book schedule to Aros (Joel, due 19 Sep, medium)
4. Send partnership scope and commercial to James (Saoirse, due 22 Sep, medium)
5. Reply to UTMB on press accreditation (Saoirse, due 18 Sep, high)

Saoirse spends 90 seconds reviewing the five tasks. She confirms four as-is, edits the owner on task 3 (Joel was the right call but the project label was wrong, she fixes it). The fifth (Marcus's budget) she leaves at urgent because she does need to reply before 11:00.

By 09:00 the five tasks are in Linear, each linked back to the source email, each with the verbatim quote in the description. The corresponding emails are labelled `→ Tracked` and archived from the active inbox.

By Friday afternoon all five are marked done. The pipeline pings James (operator opted to send a "done" reply for customer-side tasks) and saves the four completion timestamps to the meeting record archive.

## Try it yourself

Three exercises, each under 30 minutes.

### Exercise 1, write the detection rules from your own inbox

Open the last 20 emails you replied to. For each, mark whether it should have become a task. Count the matches. Compare against the default rules. Where you diverge is your local context. Save as `task-detection-rules.md`.

### Exercise 2, run the detection prompt on a 20-email sample

Paste 20 unread or recently-read emails into the detection prompt. Read the output. Where the prompt says "contains work" and your gut says "no", the detection rule is too loose. Where it says "no" and your gut says "yes", the rule is too tight.

### Exercise 3, run the extraction prompt on three detected threads

Pick three threads the detection flagged. Run the extraction prompt. Read the task payloads. Are the titles, descriptions and due dates the ones you would have written by hand? If yes, the extraction is calibrated. If you find yourself rewriting titles, tighten the title rule.

## The eval gates

**Eval 1, detection precision.** Sample 30 detection outputs. The "contains work" verdict matches the operator's call in 27 of 30. Below 25 the rules need tuning.

**Eval 2, detection recall.** Sample 20 emails the operator manually turned into tasks during the same week. The detection pass should have flagged at least 18 of them. Below 15 the detection prompt is missing work signals.

**Eval 3, owner inference accuracy.** Sample 20 extracted tasks. The suggested owner is the operator's actual choice in 17 of 20. Below 15, the operator-network input was thin, add more direct-report and collaborator detail.

**Eval 4, due-date sensibility.** Sample 20 extracted tasks. The due date is within 48 hours of what the operator would have set in 17 of 20. Below 15 the due-date inference rules are wrong (probably too aggressive on "no deadline named, default to one week").

## The failure modes

**Task volume explodes.** A pipeline that creates 15 tasks a day from a 100-email inbox is producing noise, not tasks. Tighten the detection rules. Most operators land at 3 to 6 tasks a day from inbox sources.

**Owners get mis-assigned.** A task that lands with the wrong owner gets ignored. The operator's network input (reports, collaborators, manager) needs maintenance. Add the network refresh to the weekly hygiene routine.

**Due dates get inferred wildly.** "When you have time" becomes "due in 5 days" by default, then the task piles up. The "low" priority plus a longer default due date for speculative work is the discipline.

**The task description is too thin.** A task that says "Reply to Aros" without the verbatim quote forces the owner to re-read the email. Hold the verbatim-quote requirement.

**Email and task drift apart.** The task is done, the email thread is still active. Without the `→ Tracked` label or folder move, the operator double-counts. Hold the email-side action.

## The pattern in practice

**Founder-led brand at growth stage, the gap closure.** A founder who used to lose 3 to 5 things a week in the gap between inbox and Linear. The pipeline closes the gap. Customer escalations, vendor asks, exec follow-ups all land in Linear within minutes of the email. Nothing gets lost.

**Marketing director at scale, the delegation visibility.** A director with 14 reports. The pipeline routes inbound work to the right report automatically based on the network input. The director sees, in the project tool, what they have delegated and what is owed back. Delegation goes from "I think I sent that to Joel" to "Joel has it, due Thursday".

**B2B GTM lead at enterprise, the SLA discipline.** A GTM lead with customer-side SLAs. The pipeline creates tasks for every customer escalation within minutes. SLA compliance lifts from 84 percent to 97 percent because nothing waits 8 hours in an inbox to be triaged.

## Hand-off

Once the pipeline is running, the work feeds:
- **email-triage-and-draft**, where the two pipelines run alongside, triage on the reply side and tasking on the work side
- **call-follow-up-loop**, where the call's action items use the same task-creation logic
- **slack-focus-pass**, where Slack threads with named work also become tasks
- **personal-knowledge-base**, where tasks completed get archived with their source email thread as part of the corpus
