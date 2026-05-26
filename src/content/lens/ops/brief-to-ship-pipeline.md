---
title: "Brief-to-ship marketing pipeline"
stack: ops
description: "A single operating system for the marketing function. Brief intake, eval-gated production, scheduled ship day, post-mortem feedback. Replaces ten tools and three meetings."
outputs: "Brief template, triage rules, ship-day ritual, outcome ledger"
readMin: 22
shipTime: "2 working weeks"
brandStage: ["growth", "scale", "enterprise"]
channels: ["analytics", "content", "brand"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-04-15
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **structured brief intake** in your project tool (Notion, Linear, Asana or Coda) that returns under-defined briefs to the requester before any work starts.
2. A **weekly triage ritual** of 45 minutes that routes every accepted brief to a pipeline in the Lens library, with an estimate and a slot in the production queue.
3. A **Wednesday ship-day rhythm** that lands every week's work in one window, makes instrumentation predictable and gives the team a deadline that doesn't slip.
4. A **brief-to-outcome ledger** that logs whether each brief's stated metric actually moved, feeding quarterly retirement decisions and the next round of bets.

## Who this is for

A marketing function with two or more people, shipping at least four pieces of work a month, where briefs currently arrive in Slack threads and ship dates are aspirational. If you are a single founder doing marketing in spare hours, the overhead of this system outweighs the discipline it produces. If you are a function of six plus shipping forty pieces a month, the system pays for itself in the first quarter.

## Before you start

- [ ] A project tool the team already uses (Notion, Linear, Asana, Coda or Airtable). Pick whichever has the lowest friction
- [ ] Admin access on that tool so you can create databases, forms and templates
- [ ] A standing 30-minute weekly slot in the team calendar for triage
- [ ] A standing 30-minute slot on Tuesdays for pre-ship review
- [ ] A standing 90-minute slot on Wednesdays for shipping
- [ ] The Lens playbook library bookmarked, so triage can route to specific pipelines
- [ ] A function lead with the authority to return briefs that fail intake (this is the make-or-break input)
- [ ] One month of historical briefs from Slack, email or wherever they currently live, so the system seeds with real data

If your function lead will not return under-defined briefs, stop. The whole pipeline collapses without that single discipline. Have the conversation first.

## The pipeline

Six modules. Two working weeks to install if the team is bought in.

### Phase 1, brief intake setup

The intake form is the gate. Everything downstream depends on it being honoured.

**Step 1.1, build the intake form in your project tool.**

In Notion, create a new database called *Briefs*. Add a template page with the fields below. Lock the template so requesters cannot remove fields. In Linear, create a new project called *Marketing briefs* and use issue templates. In Asana, build a custom form attached to a *Briefs* project. The pattern is the same across tools.

Required fields on every brief:

- Title (one noun phrase, not "Project X")
- Outcome statement (the sentence below, filled in)
- Audience segment (a behavioural description, not a demographic)
- Success metric (named metric, baseline, target, window)
- Context the team needs (three to seven bullets)
- Hard constraints (legal, brand, technical)
- Deadline (date plus a one-line cost-of-late description)
- Pipeline route (filled by triage, not the requester)

Optional fields:

- Spokesperson or athlete
- Must-include facts with sources
- Ban list (phrases, claims, comparisons)
- Voice profile reference

**Step 1.2, write the outcome-statement guide in the form itself.**

The single field that separates real briefs from busywork is the outcome statement. Paste this exact text into the field's help description:

```text
Fill in this sentence:

"We expect that doing {THING} will cause {OUTCOME} because
{WHY_WE_BELIEVE_THIS}. We will know we are right if {METRIC}
moves by {AMOUNT} within {WINDOW}."

A brief that cannot complete this sentence is not ready to start.
Return it to the requester.
```

Make this field required. The form should not submit without it.

**Step 1.3, write the rejection template.**

When a brief arrives with required fields blank or fuzzy, the function lead returns it. The rejection is short and specific. Paste this template into a Notion comment or Linear macro:

```text
Thanks for the brief. Before we can triage it, we need:

- {GAP_1}, currently {WHAT_THE_BRIEF_SAYS_NOW}, needed
  {WHAT_THE_BRIEF_NEEDS_TO_SAY}.
- {GAP_2}, ...

The outcome statement is the most important. If you cannot
complete the sentence in the help text, the brief is not ready
to start. Happy to talk it through if useful.

Re-submit when the gaps are closed.
```

You should now have a brief database that accepts complete briefs and returns under-defined ones with named gaps.

### Phase 2, triage

A 45-minute weekly slot. The function lead routes accepted briefs to pipelines and slots in production capacity.

**Step 2.1, build the triage view.**

In the *Briefs* database, create a filtered view called *Triage queue*. Filter to status = *Submitted* and sort by deadline ascending. Add columns for Pipeline route, Estimate (working days), Owner, Slot week. The view is the agenda for Monday triage.

**Step 2.2, run the triage prompt for ambiguous routes.**

Most briefs route cleanly to a Lens pipeline (a launch routes to gear-launch-sequence, a recap routes to race-result-content-engine). When the route is unclear, paste the brief into Claude.

```text
SYSTEM: You route a marketing brief to the most appropriate
pipeline in the Manual Focus Lens library. You are given the
brief and the pipeline list. You return the route with a
one-sentence reason, and you flag if no pipeline fits cleanly.

USER:
Brief:
{PASTE_FULL_BRIEF}

Available pipelines:
- brand-voice-extraction
- positioning-audit-pipeline
- naming-sprint
- message-house-generator
- gear-launch-sequence
- race-day-demand-pipeline
- race-result-content-engine
- segment-broll-production
- ambassador-programme
- lifecycle-journey-builder
- crash-replacement-programme
- attribution-teardown
- channel-mix-simulator
- paid-search-bidding-agent
- seo-keyword-research
- (full list pasted from library index)

Return JSON:
{
  "primary_route": "<pipeline name>",
  "reason": "<one sentence, under 25 words>",
  "alternative_route": "<pipeline name or null>",
  "no_clean_fit": <true | false>,
  "estimate_working_days": <int>
}

Rules:
- If no_clean_fit is true, propose what a new pipeline would
  need to cover.
- Estimate is the median working days for this pipeline at
  this scope.
- Do not invent pipelines that are not in the list.
```

**Expect output like:**

```json
{
  "primary_route": "race-result-content-engine",
  "reason": "Brief requests UTMB recap content with athlete attribution and 48-hour turnaround.",
  "alternative_route": "segment-broll-production",
  "no_clean_fit": false,
  "estimate_working_days": 3
}
```

**Step 2.3, slot the brief.**

The function has a fixed shipping cadence (Wednesdays). For each accepted brief, count back the estimate, assign an owner, and write the slot week into the brief record. Capacity for the function is roughly *(team size) x (4 days per week)* minus standing commitments. If next week's slot is full, the brief lands the week after.

You should now have a queue with every accepted brief routed, estimated, owned and slotted.

### Phase 3, production

Each brief now follows the eval gates of whichever pipeline owns it. That is the entire point of routing. The brief-to-ship system does not invent its own production rules. It enforces that whichever pipeline owns the work is followed end-to-end.

**Step 3.1, status field with three states.**

In the brief record, set Status to one of *In production*, *Pre-ship review*, *Shipped*. The owner moves the brief through these states. The Lens pipeline's own eval gates determine whether the brief is ready to move to *Pre-ship review*.

**Step 3.2, no-shortcut rule.**

If a pipeline has four eval gates, all four pass before the brief enters *Pre-ship review*. This is the discipline that stops the function regressing. The function lead audits a random brief per week to verify the gates were actually run, not skipped.

### Phase 4, pre-ship review

A 30-minute standing Tuesday slot. Every brief in *Pre-ship review* gets five minutes.

**Step 4.1, the review question.**

For each piece, one question, asked out loud. "Does this deliver the outcome stated in the brief?" The brief's outcome statement is read first. The work is shown second. The room answers yes, no or one round of revisions.

**Step 4.2, the revision rule.**

If revisions are needed, the brief returns to production with named changes. It re-enters pre-ship review next Tuesday. A brief that needs more than one round of revisions usually means the brief itself was wrong, in which case the function lead returns it to the requester with the brief reopened.

You should now have a weekly cohort of work that has passed both pipeline gates and outcome review.

### Phase 5, ship day

Wednesday. Ninety minutes. Everything that passed Tuesday goes live.

**Step 5.1, the ship checklist.**

For each shipping brief, the owner completes the checklist before the window closes:

- [ ] Final asset uploaded to the channel (CMS, ad platform, schedule tool)
- [ ] UTMs or tracking parameters set per the brief's success metric
- [ ] Instrumentation owner confirmed (this is who logs the result two weeks later)
- [ ] Status moved to *Shipped*
- [ ] Brief record updated with the actual ship date
- [ ] Slack notification in the team channel (the team's signal that the work is live)

**Step 5.2, the no-Thursday rule.**

If a brief cannot ship on Wednesday, it does not ship that week. It goes back into the queue for next week. The cadence is the asset. Sliding to Thursday once breaks the rhythm for the next quarter.

### Phase 6, post-mortem and feedback

Two weeks after shipping, the metric gets logged. Quarterly, the ledger gets reviewed.

**Step 6.1, the two-week metric log.**

The instrumentation owner adds the actual metric result to the brief record. Three fields: actual result, date logged, one-line note on what surprised them. Most teams under-log because the work is already done. The function lead enforces this with a Friday reminder.

**Step 6.2, the quarterly outcome review.**

Once per quarter, run the review prompt over the ledger.

```text
SYSTEM: You analyse a quarter of marketing briefs against their
stated metrics. You identify which brief categories consistently
hit their targets, which consistently miss, and which need more
data before a verdict.

USER:
Brief ledger for the quarter:
{PASTE_BRIEF_LEDGER_AS_CSV}

For each pipeline route, return JSON:
{
  "pipeline_route": "<name>",
  "briefs_completed": <int>,
  "briefs_hit_target": <int>,
  "hit_rate": <float, 0 to 1>,
  "median_cycle_time_days": <int>,
  "verdict": "<keep | retire | needs-more-data>",
  "rationale": "<one sentence>"
}

Rules:
- "retire" requires at least 4 completed briefs and a hit rate
  under 0.3.
- "keep" requires at least 4 completed briefs and a hit rate
  over 0.5.
- "needs-more-data" otherwise.
- Briefs without a logged metric do not count toward hit rate.
```

The review produces the input to next quarter's planning. Pipelines marked *retire* feed into the retire list. The quarterly-planning-ritual playbook picks it up from there.

## Worked example, end-to-end

Cascadia Endurance, scale-stage. Marketing function of six. Marcus Hale (founder, occasional brief sender). Beth Lyons (function lead, runs triage). Saoirse Burns (channel operator). Three contractors on production. Pre-install, briefs arrived in Slack and shipped when ready. Post-install, the table below.

**Phase 1.** Beth builds the *Briefs* database in Notion. The first week, four of seven submitted briefs get returned for missing outcome statements. Marcus submits a "UTMB recap" brief with no metric. Beth returns it. Marcus pushes back. Beth holds the line. Marcus re-submits with "Instagram saves on the recap reel, baseline 1,200, target 3,000, 7 days." That brief becomes B-002 in the ledger.

**Phase 2.** Beth runs the Monday triage. Seven briefs accepted that week. Five route cleanly. Two go through the routing prompt. The output routes B-005 (athlete coffee-table content) to segment-broll-production with a 9-day estimate.

**Phase 3.** Production runs through the pipelines. B-002 ships through race-result-content-engine and passes all four eval gates by Tuesday.

**Phase 4.** Tuesday pre-ship review. B-002 shown. The outcome statement is read. The reel is played. Beth asks "does this beat the 1,200-save baseline?" The room agrees the cuts and athlete attribution should clear it. Ships.

**Phase 5.** Wednesday. B-002 goes live with UTMs on the link in bio. Saoirse posts in #marketing-shipped.

**Phase 6.** Two weeks later Saoirse logs 4,400 saves against a 3,000 target. The brief gets marked hit. Quarterly review finds race-result-content-engine hitting target on 6 of 7 briefs, hit rate 0.86, verdict *keep, double the slot allocation next quarter*.

**The ledger sample, end of Q2:**

| Brief | Route | Target | Result | Verdict |
|---|---|---|---|---|
| B-002, UTMB recap | race-result-content-engine | 3,000 saves | 4,400 | hit |
| B-003, Trail Club retention | lifecycle-journey-builder | 75% renewal | 73% | miss |
| B-004, spring shoe paid push | channel-mix-simulator | 3.0 ROAS | 3.2 | hit |
| B-005, athlete content | segment-broll-production | 300k reach | 410k | hit |
| B-007, crash comms refresh | crash-replacement-programme | 4.4 CSAT | 4.5 | hit |

Five completed briefs, four hits, hit rate 0.80. The quarterly planning ritual takes the ledger as input.

## Try it yourself

Three exercises. The first three are an install, in order.

### Exercise 1, write your outcome-statement sentence

Pick a piece of work currently in your queue. Fill in the sentence:

> "We expect that doing {THING} will cause {OUTCOME} because {WHY}. We will know we are right if {METRIC} moves by {AMOUNT} within {WINDOW}."

If you cannot complete it cleanly, the brief is not ready to start. Either get the missing inputs from the requester or shelve the work.

### Exercise 2, return a real brief

Pick a brief currently in your team's queue that is missing fields. Use the rejection template from Step 1.3 to return it. Watch what happens. Most teams have not done this in a year. The requester pushes back. Hold the line. The pattern compounds across the quarter.

### Exercise 3, run the triage prompt on five recent briefs

Pull the last five accepted briefs. Paste each into the Step 2.2 prompt. Compare the model's routing to what the team actually did. Where the model picks a different route, the model is usually right (it has read the full Lens library and the team probably has not). Where the model says *no clean fit*, the brief is either ahead of the library or fuzzy.

## The eval gates

**Eval 1, brief acceptance rate.** Track what percentage of incoming briefs pass intake on first submission. The quarterly target is 60% or higher after the first month. Below 40% means the template is too strict or the team is not coaching requesters. Above 80% means the template is letting fuzzy briefs through.

**Eval 2, slip rate.** Track the percentage of briefs that miss their stated ship date. Target sits under 15%. Higher than that means triage is over-loading the team or estimates are too tight.

**Eval 3, outcome correlation.** Quarterly, for completed briefs with metrics that have landed, what fraction moved the stated metric? Target sits at 50% or higher. Being right ninety percent of the time means you are shipping safe work.

**Eval 4, cycle time per pipeline route.** Median cycle time from brief-accept to ship, by route. Cycle times should be stable or shortening. Any route whose cycle time climbs quarter on quarter is the one to investigate.

## The failure modes

**Brief template gets watered down.** Senior stakeholders find the template restrictive and start raising exceptional briefs that skip fields. The function regresses to chaos within a quarter. Hold the line. The template's strictness is its value.

**Ship day becomes optional.** Wednesday ship works because everyone knows it is coming. The first time work slips to Thursday because someone was not ready, the discipline cracks. Stick to Wednesday even if the only thing shipping is a single tweet.

**Post-mortems become rituals.** Without follow-through, the post-mortem is theatre. Either the retire decisions are binding (retired pipelines actually stop being briefed) or the system is noise. Make the quarterly review attended by the function head and the metrics owner.

**Triage becomes a queue manager.** The triage role is strategic. The person decides which brief routes to which pipeline, pushes back on under-defined briefs, and detects when the pipeline mix is wrong. Do not assign it to the most junior person. Do not delegate it to a tool.

**Pipelines proliferate.** Marketing teams love to add a new pipeline for every new tactic. Resist. The library is curated. Most teams need eight to twelve pipelines, rather than forty.

## The pattern in practice

Illustrative scenarios that show common shapes the brief-to-ship pipeline takes. Specifics are illustrative and patterns repeat.

**B2B SaaS, scale-stage, the throughput unlock.** A marketing function of around ten people, shipping roughly thirty pieces a month, with brief-to-ship cycle times ranging from a few days to a couple of months. Installing the pipeline typically lifts output by a third or more within two quarters, with median cycle time around two working weeks and brief acceptance rates settling around two-thirds on first submission. Outcome correlation lands near the target.

**D2C, growth-stage, the founder buy-in moment.** A small marketing function doing everything by Slack. Brief intake is the contentious part because the founder feels the template adds bureaucracy. Then the template surfaces that one of the founder's urgent briefs has no clear audience. The template becomes the founder's drafting habit too. Function output rises substantially without new headcount.

**Fintech, the leadership-change failure.** A common failure mode is the pipeline installs cleanly but two quarters later the marketing head leaves and a successor wants to ship faster by skipping the template. Within a quarter the team is back in Slack-driven chaos. The pipeline needs a sponsor inside the team who values the discipline.

## Templates

The brief-to-ship tracker as a CSV. Drop into Google Sheets or Excel. One row per brief.

[Download brief-to-ship-tracker-template.csv](/lens/templates/brief-to-ship-tracker-template.csv)

The CSV ships with eight sample Cascadia briefs across the most common pipeline routes. Wipe them, keep the column headers, fill in your own.

**If your schema differs (a different project tool, different status states, extra fields for finance approval) ask Claude to build a custom version.**

```text
SYSTEM: You generate a brief-to-ship tracker CSV tailored to a
specific marketing function's workflow. The CSV captures every
brief from intake through outcome logging.

USER:
My project tool: {NOTION | LINEAR | ASANA | COD A | AIRTABLE}
My status states: {LIST_THE_STATUSES}
Extra fields I need: {LIST_EXTRA_FIELDS}
My pipeline routes: {LIST_THE_LENS_PIPELINES_YOU_USE}

Generate a CSV with one row per brief and columns for:
- Brief_ID, Title, Pipeline_Route, Status
- Brief_Submitted, Brief_Accepted, Triage_Date
- Ship_Target, Actual_Ship
- Outcome_Metric, Baseline, Target, Window, Actual_Result
- Result_Logged_Date, Owner, Requester, Notes
- (any extras I specified)

Pre-fill three example rows with realistic content for an
endurance brand. Return the CSV directly.
```

## Hand-off

The brief-to-ship pipeline feeds:
- **quarterly-planning-ritual**, where the ledger becomes the input to the next quarter's bets and retires
- **evaluation-frameworks**, where each pipeline's eval gates are honoured before pre-ship review
- **hiring-shape-for-ai-native-teams**, where the function shape is sized against the brief throughput
- **brand-guardrails-as-code**, where the brand voice gates run as part of the pipeline's own evals
