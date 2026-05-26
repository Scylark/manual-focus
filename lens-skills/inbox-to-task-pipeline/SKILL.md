---
name: inbox-to-task-pipeline
description: "When the user wants emails turned into tasks in Linear, Asana or Notion, work captured automatically from inbound mail, action items extracted from email threads, or 'this should be a task' detection. Triggers on 'turn this email into a task', 'create a Linear task from this', 'extract action items from my inbox', 'this needs to be in Asana', 'capture work from email', or pasting an email thread and asking what to do."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/productivity/inbox-to-task-pipeline
---

# Inbox to task pipeline

You scan inbound email threads, detect which contain work that should become a task, extract the task payload, infer owner and due date, and create the task in the operator's project tool with the source email linked back as context.

## Inputs to gather first

1. **Inbox queue** — unread or recently-read emails with sender, subject, snippet, full body if available, thread_id
2. **Detection rules** at `.lens/task-detection-rules.md` if defined, otherwise use defaults
3. **Project tool taxonomy** — labels, projects, teams, priority levels for Linear / Asana / Notion / ClickUp / Monday
4. **Operator network** — direct reports, collaborators, manager (for owner inference)
5. **CRM contact list** — for "is this from a customer" detection
6. **Auto-confirm rules** if any — senders or task types where the operator wants automatic task creation without review

If detection rules are missing, use the defaults below. If project taxonomy is missing, ask the user for labels and projects.

## The pipeline (four phases)

### Phase 1 — Detection rules

Work signals (any one triggers a task):
- Sender asks the operator (or a delegate) to do something specific
- Sender confirms something the operator agreed to do
- Sender shares a deadline the operator is responsible for
- Sender raises a problem the operator needs to investigate or escalate
- Thread closes with an action item without naming an owner

Non-work signals (any one prevents a task):
- Pure FYI or status update with no ask
- Acknowledgement or thank-you (action already happened)
- Newsletter or marketing blast
- Scheduling confirmation (calendar event is the task)
- Tool notification (the tool tracks the work)

Ambiguous default: task with low confidence. Operator can dismiss in 2 seconds.

### Phase 2 — Detection pass

For each thread, return JSON with `thread_id`, `sender`, `subject`, `contains_work`, `confidence` (high / medium / low), `work_signal` (verbatim from rules), `extracted_action`, `suggested_owner_signal` (self / direct-report-name / collaborator-name / external / unknown), `deadline_signal` (verbatim from email or null).

Rules:
- `contains_work` true requires a matching work signal.
- "low" confidence default for ambiguous cases.
- `deadline_signal` verbatim from email, not inferred.

### Phase 3 — Task extraction

For each `contains_work: true` thread, return JSON with `title` (6-12 words, verb-led), `description` (50-120 words including verbatim quote), `owner_email`, `due_date`, `due_date_source` (verbatim phrase / sender_deadline / inferred_from_typical_cadence), `labels`, `project`, `priority` (urgent / high / medium / low), `linked_email_thread`, `linked_email_subject`, `context_quote`.

Due date inference:
- Sender named deadline → use it.
- Reply work → default 24-48 hours.
- Review or input → default 1 week.
- Longer piece → default 2 weeks.

Priority inference:
- Urgent if deadline within 24h, or exec, or customer escalation.
- High if deadline within 48h.
- Medium default.
- Low if speculative or "when you have time" language.

### Phase 4 — Write and link

Create tasks in the project tool via API. For each task, include the verbatim email quote in the description and link back to the email thread.

Label or move the source email (`→ Tracked` label in Gmail, similar in Outlook). Optionally, on task completion, send a "this is done" reply to the original sender if the operator has set that rule.

Operator review queue: proposed task payloads land in the project tool's inbox or a Notion review view. Operator confirms, edits or dismisses in 5-10 seconds each. High-confidence detections from known senders can auto-confirm if the operator opts in.

## Output

For each detected thread, the task payload JSON and the operator's review state. After confirmation, the task is created and the source email is labelled.

Save the detection and extraction logs to `.lens/tasks/{date}.json` for the weekly eval.

## Evals

Before delivering:

- **Detection precision** — `contains_work` verdict matches the operator's call in 90 percent of sampled threads.
- **Detection recall** — sample emails the operator manually made into tasks. The detection should have flagged at least 90 percent.
- **Owner inference** — suggested owner matches operator's choice in 85 percent.
- **Due-date sensibility** — due date within 48 hours of the operator's choice in 85 percent.
- **Verbatim quote** — every task description has the source email quote.
- **Email-side action** — source email is labelled or moved after task creation.

## Failure modes to watch

- **Task volume explodes** — flag if more than 8 tasks per day from a 100-email inbox. Tighten detection rules.
- **Mis-assigned owners** — flag if the operator edits owner on more than 20 percent. Recommend network input refresh.
- **Wild due dates** — "when you have time" becomes "due in 5 days". Hold the speculative-work → low-priority + longer due rule.
- **Thin descriptions** — task description without the verbatim quote forces the owner to re-read the email. Hold the quote requirement.
- **Email-task drift** — task done but email still active. Hold the email-side label rule.

## Hand-off

- **email-triage-and-draft** runs alongside. Triage handles "reply or not", this handles "task or not".
- **call-follow-up-loop** uses the same task-creation logic for meeting action items.
- **slack-focus-pass** routes Slack work to the same pipeline.
- Completed tasks archive with their source email into **personal-knowledge-base**.

Save logs to `.lens/tasks/{date}.json`.
