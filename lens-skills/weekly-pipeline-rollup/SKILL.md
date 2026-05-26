---
name: weekly-pipeline-rollup
description: "When the user wants a weekly pipeline rollup, CRM data into a stakeholder-ready report, a Friday status for the founder or CEO, a board-pack pipeline section, or a sales pacing summary. Triggers on 'weekly rollup', 'pipeline status', 'CRM summary', 'pipeline report for [audience]', 'where are we pacing', 'this week's pipeline', or pasting a CRM deal export."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/productivity/weekly-pipeline-rollup
---

# Weekly pipeline rollup

You turn a CRM deal export into a stakeholder-ready weekly pipeline report. The rollup answers four questions: where the quarter is pacing, what moved this week, what is at risk, what is new, plus the one ask for the stakeholder. The same data ships in three shapes: Slack thread, email, Notion page.

## Inputs to gather first

If `.lens/rollup-spec.md` exists, read it. Otherwise prompt for:

1. **Audience** — founder / CEO / board / sales-leader. Each has a different length and focus.
2. **CRM export** — open deals plus closed-won and closed-lost from the last 7 days, with `deal_id`, `company_name`, `primary_contact`, `owner`, `amount`, `currency`, `stage`, `stage_changed_at`, `created_at`, `close_date`, `last_activity_at`, `last_activity_type`, `lost_reason`
3. **Last rollup timestamp** — for diffing stage changes
4. **Quarter targets** — commit, best case, current pacing
5. **Stage taxonomy** — the CRM's pipeline stages in order
6. **Delivery channel** — Slack thread, email, Notion page

If no targets are provided, run the rollup without the gap-to-target framing. Note explicitly that targets are missing.

## The pipeline (five phases)

### Phase 1 — Rollup spec

Audience-to-length mapping:
- Founder: 200-400 words, focused on trajectory, one big movement, one big risk.
- CEO: 400-600 words, quarter pacing plus top 5 deals.
- Board: 300-500 words, quarter pacing plus year-on-year plus the one ask.
- Sales leader: 600-900 words, stage-by-stage, rep-by-rep, deals at risk.

Every rollup answers four questions: quarter pacing, what moved, what is at risk, what is new.

### Phase 2 — CRM extraction

Return JSON with:

- `summary_metrics` — open_pipeline_value, open_deals_count, deals_advanced_this_week, deals_stalled, deals_closed_won_this_week, deals_closed_lost_this_week, weekly_net_movement
- `pacing` — quarter_target, closed_won_quarter_to_date, pacing_percentage, gap_to_target, weeks_remaining_in_quarter
- `advanced_deals` — deal / from_stage / to_stage / amount / owner
- `stalled_deals` — deal / days_idle / amount / owner / next_step_needed (days_idle >= 14, not closed)
- `new_deals` — deal / amount / owner / source
- `closed_won` — deal / amount / owner
- `closed_lost` — deal / amount / lost_reason / owner
- `top_5_at_risk` — combines stalled at high-value stages, slipping close dates, owners idle 21+ days

### Phase 3 — Narrative synthesis

Return Markdown:

```text
# Pipeline rollup, week of {DATE}

## Quarter pacing
{paragraph, numbers named}

## What moved this week
{1-3 biggest advances by value, owners named}

## What is at risk
{top 3 at-risk deals, risk signal, next step}

## What is new
{1-3 most consequential new opportunities}

## The one ask
{single sentence, concrete, answerable}
```

Rules:
- Length within 10 percent of target.
- Every claim names a number, name or stage.
- No padding. No exclamation marks. No hype words. Active voice.
- "Nothing material this week" instead of padding when a section is empty.

### Phase 4 — Stakeholder format pack

Return JSON with `slack` (header_message under 1500 chars plus threaded_replies), `email` (subject with pacing pct plus body), `notion` (page_title, page_body_markdown, tags including pacing band, callout_summary).

Rules:
- Slack header has a single emoji indicator based on weekly_net_movement.
- Email subject is searchable, includes pacing pct.
- Notion tags include "on-pace", "behind", or "ahead".

### Phase 5 — Delivery

Deliver to the chosen channel. Archive every rollup to `.lens/rollups/{date}.md` with the underlying JSON next to it.

## Output

Three deliverables:
1. The rollup Markdown
2. The format pack JSON
3. The archive file at `.lens/rollups/{date}.md`

## Evals

Before delivering:

- **Numerical accuracy** — every number in the rollup matches the CRM source.
- **Length adherence** — within 10 percent of the audience's target.
- **Ask quality** — concrete, answerable. "Have eyes on this" is not an ask. "Marcus, call Aros before Tuesday" is.
- **Section discipline** — empty sections say "Nothing material this week" rather than padding.
- **No AI tells** — no em dashes, no prose colons, no hype words, no exclamation marks.

## Failure modes to watch

- **Padding to feel substantial** — flag and recommend the "nothing material" line.
- **Numbers do not reconcile** — extract from a single export only. Never combine two source files.
- **At-risk wishlist** — hold the top-3 cap.
- **Ask drift** — if "the one ask" becomes multiple, split across weeks.
- **Stakeholder fatigue** — recommend a quarterly format refresh to keep the read sharp.

## Hand-off

- 13 weekly rollups feed **quarterly-okr-synthesis**.
- The archive becomes searchable through **personal-knowledge-base**.
- Stalled-deal flags drive prep for **call-follow-up-loop**.
- Pipeline movement reads into **daily-briefing-pipeline**.

Save to `.lens/rollups/{date}.md`.
