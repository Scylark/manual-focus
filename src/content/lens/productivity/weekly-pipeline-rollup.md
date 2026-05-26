---
title: "Weekly pipeline rollup, CRM data to stakeholder-ready status"
stack: productivity
description: "HubSpot, Close or Salesforce data to a stakeholder-ready weekly rollup. No spreadsheet wrangling. Twenty minutes from export to delivered."
outputs: "Rollup spec, CRM extraction prompt, narrative synthesis prompt, stakeholder format pack, CSV template"
readMin: 22
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["crm", "docs", "inbox"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-09-03
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **rollup spec** that names the audience, the cadence and the four metrics that matter for the week.
2. A **CRM extraction prompt** that pulls deal movement, stage changes, stalled deals, new opportunities and closed-won from your CRM into a normalised JSON.
3. A **narrative synthesis prompt** that converts the JSON into the report the stakeholder reads.
4. A **stakeholder format pack** in three shapes (Slack thread, email, Notion page) so the same data lands right in each channel.
5. A **downloadable CSV template** for the underlying deal log, which any CRM can export into.

## Who this is for

A marketing or GTM operator running weekly pipeline updates to founders, CEOs, boards or sales leadership. You currently spend 60 to 120 minutes a week pulling CRM data, fighting spreadsheets and writing the report. You have HubSpot, Close, Salesforce, Pipedrive, Attio or a similar CRM with weekly stage-change data.

If your pipeline is under 20 deals, the rollup is overkill. If it is over 500 deals, you need a BI layer (Looker, Mode, Hex) and the pipeline is a starting point not a finished system.

## Before you start

- [ ] CRM read access with deals, stages, owners, amounts, close dates, last_activity_at
- [ ] A defined fiscal week (Monday to Sunday by default, or whatever your org runs)
- [ ] The stakeholder audience named: who reads the rollup, what they care about
- [ ] Delivery channel chosen: Slack thread, email, Notion page, board document section
- [ ] Last quarter's targets (commit, best case, gap-to-target) for context
- [ ] 60 minutes blocked for setup

If you do not have explicit targets, the rollup still works, you just lose the "gap to target" framing. Add targets when you can.

## The pipeline

Five phases. Phase 1 is once. Phases 2 through 5 run every Friday afternoon or Monday morning.

### Phase 1, rollup spec

The spec answers four questions.

**Step 1.1, who reads it.**

Name the audience. Founder. CEO. Board. Sales leader. Each audience cares about different things.

| Audience | Cares about | Length |
|---|---|---|
| Founder | Trajectory, the one big movement, the one big risk | 200-400 words |
| CEO | Quarter pacing, channel performance, deal-by-deal for top 5 | 400-600 words |
| Board | Quarter pacing, year-on-year, retention, the one ask | 300-500 words |
| Sales leader | Stage-by-stage funnel, rep-by-rep, deals at risk | 600-900 words |

**Step 1.2, the four weekly metrics.**

Every rollup answers four questions.

1. Where is the quarter pacing against target?
2. What moved this week?
3. What is at risk?
4. What is new?

These are the constraints the synthesis prompt reads. Save as `rollup-spec.md`.

### Phase 2, CRM extraction

The extraction normalises the CRM export.

**Step 2.1, export from the CRM.**

The export should include, for every open deal:

- `deal_id`
- `company_name`
- `primary_contact`
- `owner`
- `amount`
- `currency`
- `stage`
- `stage_changed_at`
- `created_at`
- `close_date`
- `last_activity_at`
- `last_activity_type`
- `lost_reason` (if closed-lost)

Plus closed-won deals from the last 7 days. Save the export as `crm-export-{date}.csv`.

**Step 2.2, the extraction prompt.**

```text
SYSTEM: You normalise a CRM export into the structured shape the
weekly rollup needs. You compute stage changes since the last
rollup, stalled deals, new opportunities and closed-won. You
return JSON only.

USER:
CRM export (CSV format):
{PASTE_EXPORT}

Last rollup timestamp:
{LAST_ROLLUP_TIMESTAMP}

Quarter targets (commit, best case, current pacing):
{PASTE_TARGETS}

Stage taxonomy:
{PASTE_STAGES}

Return JSON:
{
  "summary_metrics": {
    "open_pipeline_value": <number>,
    "currency": "<code>",
    "open_deals_count": <int>,
    "deals_advanced_this_week": <int>,
    "deals_stalled": <int>,
    "deals_closed_won_this_week": <int>,
    "deals_closed_lost_this_week": <int>,
    "weekly_net_movement": <number, signed>
  },
  "pacing": {
    "quarter_target": <number>,
    "closed_won_quarter_to_date": <number>,
    "pacing_percentage": <float>,
    "gap_to_target": <number, signed>,
    "weeks_remaining_in_quarter": <int>
  },
  "advanced_deals": [
    {"deal": "<name>", "from_stage": "<x>", "to_stage": "<y>", "amount": <number>, "owner": "<name>"}
  ],
  "stalled_deals": [
    {"deal": "<name>", "days_idle": <int>, "amount": <number>, "owner": "<name>", "next_step_needed": "<one sentence>"}
  ],
  "new_deals": [
    {"deal": "<name>", "amount": <number>, "owner": "<name>", "source": "<where>"}
  ],
  "closed_won": [
    {"deal": "<name>", "amount": <number>, "owner": "<name>"}
  ],
  "closed_lost": [
    {"deal": "<name>", "amount": <number>, "lost_reason": "<reason>", "owner": "<name>"}
  ],
  "top_5_at_risk": [
    {"deal": "<name>", "stage": "<x>", "amount": <number>, "risk_signal": "<one sentence>"}
  ]
}

Rules:
- "stalled" is days_idle >= 14 AND stage is not closed.
- "advanced" only if stage_changed_at > last_rollup_timestamp.
- "new" only if created_at > last_rollup_timestamp.
- "top_5_at_risk" combines deals stalled at high-value stages,
  deals slipping close dates, and deals whose owners have not
  logged activity in 21+ days.
- Return JSON only.
```

### Phase 3, narrative synthesis

The structured JSON becomes the rollup prose.

**Step 3.1, the synthesis prompt.**

```text
SYSTEM: You write a weekly pipeline rollup for a named audience.
The rollup answers four questions: where the quarter is pacing,
what moved this week, what is at risk, what is new. You write
in plain English, no marketing tone, no sales-speak, no acronyms
the audience does not already use.

USER:
Audience:
{FOUNDER | CEO | BOARD | SALES_LEADER}

Length target (words):
{LENGTH}

Last week's rollup (for continuity):
{PASTE_LAST_ROLLUP}

This week's structured data:
{PASTE_EXTRACTION_JSON}

Return the rollup as Markdown:

# Pipeline rollup, week of {DATE}

## Quarter pacing
{ONE PARAGRAPH ON TARGET, ACTUAL, PERCENTAGE, GAP, WEEKS REMAINING.
NUMBERS NAMED EXPLICITLY.}

## What moved this week
{ONE PARAGRAPH NAMING THE 1-3 BIGGEST ADVANCES BY VALUE, WHO OWNS
EACH, WHERE THEY ARE NOW.}

## What is at risk
{ONE PARAGRAPH ON THE TOP 3 AT-RISK DEALS, NAMED, WITH THE RISK
SIGNAL AND THE NEXT STEP REQUIRED.}

## What is new
{ONE PARAGRAPH NAMING NEW OPPORTUNITIES BY VALUE AND SOURCE.
DO NOT LIST EVERY NEW DEAL, NAME THE 1-3 MOST CONSEQUENTIAL.}

## The one ask
{ONE SENTENCE NAMING THE ASK FOR THE STAKEHOLDER THIS WEEK.
COULD BE "NONE THIS WEEK" IF NO ASK.}

Rules:
- Length within 10 percent of the target.
- Every claim names a number, a name or a stage.
- No padding ("As we approach the end of the quarter...").
- No exclamation marks.
- No hype words (incredible, fantastic, exceptional).
- Active voice.
- If a section has nothing to report, write "Nothing material this
  week" rather than padding.
```

### Phase 4, stakeholder format pack

The same rollup ships in three shapes.

**Step 4.1, the Slack thread shape.**

A 1500-character header message naming the headline (quarter pacing plus weekly net movement), with a thread containing the four sections. Each section is a separate threaded reply so the stakeholder can react to or expand each individually.

**Step 4.2, the email shape.**

Subject line: `{Brand} pipeline, week of {date}, {pacing}% of target`. Body is the full Markdown rendered. The CRM extraction JSON attached as `crm-data-{date}.json` for the analysts who want the raw.

**Step 4.3, the Notion page shape.**

A Notion page in the `Pipeline rollups` database with the four sections as toggle blocks. The structured JSON embedded as a callout block at the top for filterable data. Tagged with the week-ending date.

The format pack prompt produces all three from the same source.

```text
SYSTEM: You convert a weekly pipeline rollup into three delivery
shapes: a Slack thread, an email, and a Notion page. The content
stays the same, the structure adapts to the channel.

USER:
Rollup Markdown:
{PASTE_ROLLUP}

Structured JSON:
{PASTE_EXTRACTION_JSON}

Brand name:
{BRAND}

Delivery date:
{DATE}

Return JSON:
{
  "slack": {
    "header_message": "<under 1500 chars, includes pacing pct and weekly net>",
    "threaded_replies": [
      {"section": "Quarter pacing", "text": "<verbatim from rollup>"},
      {"section": "What moved", "text": "<verbatim>"},
      {"section": "What is at risk", "text": "<verbatim>"},
      {"section": "What is new", "text": "<verbatim>"},
      {"section": "The one ask", "text": "<verbatim>"}
    ]
  },
  "email": {
    "subject": "<formatted subject>",
    "body": "<full Markdown rendered to plain text>"
  },
  "notion": {
    "page_title": "<formatted title>",
    "page_body_markdown": "<full Markdown with toggle markers>",
    "tags": ["<week-ending date>", "<pacing percentage band>"],
    "callout_summary": "<one-paragraph block for the top of the page>"
  }
}

Rules:
- Slack header includes a single emoji indicator (📈, 📊, or 📉)
  based on weekly_net_movement.
- Email subject is searchable, includes percent of target.
- Notion tags include a pacing band ("on-pace", "behind", "ahead").
```

### Phase 5, the delivery

The packs land in the chosen channel.

**Step 5.1, the time and day.**

Friday afternoon at 16:00 for week-in-review framing. Monday morning at 08:00 for week-ahead framing. Pick one and hold it.

**Step 5.2, the archive.**

Every rollup gets archived to `.lens/rollups/{date}.md` with the underlying JSON next to it. The personal-knowledge-base playbook indexes the archive so historical rollups are searchable.

## Worked example, end-to-end

Saoirse Burns runs the weekly pipeline rollup for Cascadia Endurance's wholesale and partnerships pipeline. Audience: Marcus Hale (founder) and Tanya Okafor (CFO). Length target: 350 words. Delivery: email Friday 16:30.

**Phase 2 output, extraction.**

```json
{
  "summary_metrics": {
    "open_pipeline_value": 482000,
    "currency": "GBP",
    "open_deals_count": 24,
    "deals_advanced_this_week": 3,
    "deals_stalled": 5,
    "deals_closed_won_this_week": 2,
    "deals_closed_lost_this_week": 1,
    "weekly_net_movement": 71000
  },
  "pacing": {
    "quarter_target": 380000,
    "closed_won_quarter_to_date": 268000,
    "pacing_percentage": 70.5,
    "gap_to_target": -112000,
    "weeks_remaining_in_quarter": 4
  },
  "advanced_deals": [
    {"deal": "Aros Outdoors AW27 pre-book", "from_stage": "Discovery", "to_stage": "Negotiation", "amount": 48000, "owner": "Beth Lyons"},
    {"deal": "Trail Club Manchester partnership", "from_stage": "Cold", "to_stage": "Discovery", "amount": 25000, "owner": "Saoirse Burns"}
  ],
  "stalled_deals": [
    {"deal": "Foundry retainer renewal", "days_idle": 27, "amount": 36000, "owner": "Beth Lyons", "next_step_needed": "Beth to ping Tom Vetter with the renewal scope."},
    {"deal": "BMC sponsorship 2027", "days_idle": 21, "amount": 18000, "owner": "Saoirse Burns", "next_step_needed": "Awaiting BMC committee minutes from 4 September."}
  ],
  "top_5_at_risk": [
    {"deal": "Lavaredo activation kit deal", "stage": "Proposal", "amount": 22000, "risk_signal": "Close date slipped twice, owner reports buyer is shopping competitors."}
  ]
}
```

**Phase 3 output, the rollup.**

```text
# Pipeline rollup, week of 12 September

## Quarter pacing
Closed-won at £268k against the £380k quarter target, 71 percent
of target with four weeks remaining. The gap is £112k, which is
covered by the open pipeline at £482k if we close the typical
40 percent of open deals in the quarter. Pacing is on track to
hit target, slightly behind the best-case scenario.

## What moved this week
Aros Outdoors AW27 pre-book advanced from Discovery to Negotiation
on the £48k deal, Beth is running the commercial. Trail Club
Manchester moved from Cold to Discovery on a £25k partnership,
Saoirse owns. Two closed-won this week, total £71k, both wholesale
re-orders from existing accounts.

## What is at risk
Lavaredo activation kit deal at £22k is at proposal stage and has
slipped close date twice. Owner reports the buyer is shopping
competitors. Beth taking a call Monday. Foundry retainer renewal
sits at 27 days idle on a £36k deal, Beth has the next step to
ping Tom Vetter with the renewal scope. BMC sponsorship 2027 at
21 days idle pending their 4 September committee minutes.

## What is new
Trail Club Manchester (£25k) opened as a new partnership
opportunity. One smaller wholesale lead opened from the UTMB
press list, £8k, Beth to qualify next week.

## The one ask
Marcus, would you call Aros Outdoors directly on the AW27 deal
before the Tuesday call? Beth thinks a founder-level signal lands
the £48k cleanly.
```

Saoirse sends the email at 16:32. Marcus reads it on his phone at 16:45 and replies with a thumbs-up plus a calendar invite to Aros for Monday 10:00. The pipeline does what it was meant to, an ask that gets actioned in 15 minutes.

By Q4 review, the rollup discipline has produced 13 weekly archives. The pattern of which weeks pacing rises or falls becomes a sharper signal than month-end accounting.

## Try it yourself

Three exercises, each under 45 minutes.

### Exercise 1, fill the spec template

Open the rollup-spec.md template. Fill in the audience, the length, the four weekly metrics. The exercise is calibrating against your stakeholder. If you cannot name what each metric answers, the spec is not specific enough.

### Exercise 2, run the extraction prompt on a CSV

Export the last 90 days of deal data from your CRM as CSV. Run the extraction prompt. Read the JSON output. The exercise is whether the structured shape matches what you would summarise by hand.

### Exercise 3, write last week's rollup using the pipeline

Pick last week. Run the full pipeline. Compare the output to what you actually wrote (or would have written). Where the pipeline beats your draft, you have your time-saving. Where it misses your context, the synthesis prompt needs a tuning pass.

## The eval gates

**Eval 1, numerical accuracy.** Sample 5 rollups. Every number in the rollup matches the CRM source. One discrepancy is acceptable. Two means the extraction prompt is sloppy on currency, dates or rounding.

**Eval 2, narrative clarity.** A stakeholder reads the rollup in under 4 minutes and can answer three questions: "Where are we pacing?", "What is at risk?", "What is the ask?" If they cannot answer one, the synthesis prompt is under-doing the section.

**Eval 3, ask quality.** The "one ask" section is concrete and answerable. "Have eyes on this" is not an ask. "Marcus, would you call Aros directly before Tuesday?" is.

**Eval 4, time to ship.** From CRM export to delivered rollup under 25 minutes. If it takes longer, the bottleneck is usually the extraction (CRM export schema is wrong) or the format pack (over-customising each delivery shape).

## The failure modes

**The rollup pads to feel substantial.** A 600-word rollup with two real things going on reads as filler. The "Nothing material this week" line is the discipline. Use it when true.

**The numbers do not reconcile.** Open pipeline at £482k in the header and £478k in the section. The extraction prompt has a rounding bug or two source files were used. Always extract from a single export.

**The "at risk" section becomes a wishlist.** If every stalled deal counts as at-risk, the section loses signal. Hold the top-3 cap.

**The ask drifts.** "The one ask" becomes "a few things to consider". Two things means split the ask across two weeks, do not bury both.

**Stakeholder fatigue.** A weekly rollup that lands every Friday for six months without changing format gets skimmed instead of read. Refresh the format every quarter (move metrics around, change a section name) to keep the read sharp.

## The pattern in practice

**Founder-led brand at growth stage, the CEO trust unlock.** A founder who used to ask "where are we?" every Wednesday now reads the rollup Friday and the question disappears. The compounding value is that the founder stops pulling on the data and the operator stops pulling on the founder's attention.

**B2B SaaS at scale, the board pack input.** A sales leader at a Series B startup. The weekly rollup becomes a section of the monthly board pack with minimal reformatting. The board reads the same data the operator writes, with the same shape.

**Agency at scale, the multi-client pattern.** An account director running rollups across six clients. The same pipeline runs six times, the format pack producing the right shape for each client. The director's Friday afternoon goes from 4 hours of report-writing to 90 minutes including review.

## Templates

The weekly pipeline rollup template as a CSV. One row per deal in the underlying log, plus a summary section at the top.

[Download weekly-pipeline-rollup-template.csv](/lens/templates/weekly-pipeline-rollup-template.csv)

The CSV ships with a sample Cascadia Q3 rollup. Wipe the data, keep the columns, paste your CRM export into the deal-log rows.

## Hand-off

Once the rollup is shipping weekly, the work feeds:
- **quarterly-okr-synthesis**, where 13 weekly rollups feed the quarterly summary
- **personal-knowledge-base**, where the archive becomes searchable
- **call-follow-up-loop**, where weekly stalled-deal flags drive the next call's prep
- **daily-briefing-pipeline**, where pipeline movement reads the latest rollup rather than raw CRM
