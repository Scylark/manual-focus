---
title: "Quarterly planning ritual for AI-leveraged marketing"
stack: ops
description: "A repeatable 5-day ritual that converts last quarter's learning into next quarter's bets. Built for marketing functions that ship faster than the calendar."
outputs: "Quarterly plan, 7 bets, 3 retires, metric story for the board"
readMin: 17
shipTime: "5 working days"
brandStage: ["growth", "scale", "enterprise"]
channels: ["analytics", "brand"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-30
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **data extract** of the prior quarter's brief log with outcome-against-metric for every completed brief, summarised by pipeline route.
2. A **15-to-20 item bet shortlist** with rationale, displaced alternative and falsifiable claim per candidate.
3. A **locked 7-bet plan** with owners, slot weeks and pipeline routes, ready to enter the brief-to-ship pipeline.
4. A **3-retire list** with public rationale, so the team knows what is no longer being briefed.
5. A **one-page metric story** for the board and the all-hands, written in language non-marketers can engage with.

## Who this is for

A growth, scale or enterprise marketing function of four or more, running the brief-to-ship pipeline (or an equivalent system) with a quarterly cadence. The function has a head who owns the plan and an executive sponsor who will read the metric story. If you are a one-person marketing operation, the discipline is overkill. If you run quarterly planning as a one-hour Friday Slack chat, this is the discipline that will replace it.

## Before you start

- [ ] The brief ledger from brief-to-ship-pipeline covering the last quarter (or your equivalent project tracker export)
- [ ] The metric outcome for each completed brief logged in the ledger
- [ ] The Lens library or your playbook list, so bets route to pipelines
- [ ] Five working days blocked on the function head's calendar
- [ ] The function team available for a 90-minute slot on Day 3 (forced trade-off session)
- [ ] An executive sponsor available for 60 minutes on Day 4 (metric story review)
- [ ] The prior quarter's plan, so retire decisions have context
- [ ] Notion or your project tool ready to host the quarterly-planning workbook

If the prior-quarter outcome metrics are not logged, stop. Run the brief-to-ship-pipeline outcome-logging step first. Planning without data is the off-site that produces a deck no one reads.

## The pipeline

Five days. Each day has a deliverable. Day 5 you come back Monday with next quarter already in motion.

### Day 1, data and learning extraction

Pull last quarter's brief log. Compute what worked and what did not.

**Step 1.1, export the brief ledger.**

From the brief-to-ship pipeline's *Briefs* database, export the completed briefs from the prior quarter. Each brief has its outcome metric logged (or marked as pending).

Save the export as the *Data* tab in the quarterly-planning workbook.

**Step 1.2, run the per-pipeline rollup prompt.**

```text
SYSTEM: You analyse a quarter of completed marketing briefs
against their stated outcome metrics. You group by pipeline
route and surface what is working, what is not, and what
needs more data. You return JSON only.

USER:
Brief ledger for the quarter:
{PASTE_BRIEF_LEDGER_AS_CSV}

For each pipeline route, return:
{
  "pipeline_route": "<name>",
  "briefs_completed": <int>,
  "briefs_with_metric_logged": <int>,
  "briefs_hit_target": <int>,
  "hit_rate": <float, 0 to 1>,
  "median_cycle_time_days": <int>,
  "best_brief": "<brief title and one-sentence why>",
  "worst_brief": "<brief title and one-sentence why>",
  "verdict": "<continue | iterate | retire | needs-more-data>",
  "rationale": "<one sentence>"
}

Rules:
- "retire" requires at least 4 completed briefs and a hit rate
  under 0.3.
- "continue" requires at least 4 completed briefs and a hit
  rate above 0.5.
- "iterate" for hit rates between 0.3 and 0.5 with enough
  data.
- "needs-more-data" for under 4 briefs.
- Briefs without a logged metric do not count toward hit rate.
```

**Step 1.3, build the Day 1 summary.**

In the workbook *1_data* section, list every pipeline route with its verdict and one-line rationale. The Day 1 output is a single readable page the function head can show the team on Day 3.

You should now have a fact-based read of what worked and what did not.

### Day 2, bet shortlist

Generate 15 to 20 candidate bets for next quarter.

**Step 2.1, the four bet sources.**

Sources for the shortlist:

1. **Continuations** of what worked (continue verdicts from Day 1)
2. **New applications** of pipelines that proved themselves but have not been applied to all the segments or moments they could
3. **Retires** of pipelines that did not work (these become entries in the retire list, not new bets)
4. **Strategic bets** from the leadership team (founder, CFO, CEO), captured before Day 2

**Step 2.2, the candidate-bet prompt.**

For each source, run the prompt to expand the bet idea.

```text
SYSTEM: You expand a candidate bet for the next quarter's
marketing plan. You add specificity, an estimated cycle time,
a falsifiable claim, and a recommended pipeline route.

USER:
Candidate bet:
{ONE_SENTENCE_BET_IDEA}

Context, Day 1 rollup:
{PASTE_RELEVANT_PIPELINE_ROLLUP}

Available pipelines:
{PASTE_PIPELINE_LIST}

Return JSON:
{
  "bet_title": "<noun phrase, 5 to 10 words>",
  "pipeline_route": "<from the list>",
  "estimate_working_days": <int>,
  "falsifiable_claim": "<sentence that could be wrong>",
  "key_input_required": "<what has to be true to start>",
  "owner_role": "<strategy_operator | pipeline_curator | output_editor | channel_operator>",
  "rationale": "<one sentence>"
}

Rules:
- falsifiable_claim must include a metric and a magnitude.
  "Will move {metric} by {amount}" or similar.
- estimate_working_days reflects the pipeline's typical
  cycle time from the library.
- bet_title is concrete, not abstract.
```

**Step 2.3, capture in the workbook.**

In the *2_bets_candidates* section, log every expanded candidate. Aim for 15 to 20. More than 20 means the team is over-generating. Fewer than 12 means the last quarter was thin on learning.

You should now have a shortlist with each bet expanded enough to argue about.

### Day 3, forced trade-off

The hardest day. 90-minute session with the function team.

**Step 3.1, rank the candidates against capacity.**

A function with six people can run around seven substantial bets a quarter at most. Capacity is the binding constraint.

In the forced-trade-off session, the function head runs the room through each candidate. For each bet:

- Read the bet title and falsifiable claim out loud
- The room scores 1 to 5 on strength of claim and 1 to 5 on alignment with the function's strategy
- The bets get ranked by composite score

**Step 3.2, the seven-bet hard cap.**

Top seven by composite score become the locked bets. Everything else is named as displaced.

The displaced alternative for each chosen bet is named. This is the discipline. "We chose A over B" is what you must be able to say. If the team cannot name what each chosen bet displaced, they do not really know what trade-off was made.

**Step 3.3, the workbook lock.**

In the *3_bets_committed* section, log the seven bets with owner, slot week, displaced alternative, falsifiable claim and pipeline route. The committed bets are now ready to enter the brief-to-ship pipeline as draft briefs on Day 5.

**Step 3.4, the retire-3 discipline.**

In parallel, name three things to retire. The retires come from the Day 1 rollup (verdict = retire) and from things the team knows are mediocre even if they have not been formally measured.

For each retire, the workbook captures:

- What is being retired
- Why (one sentence, evidence-based)
- Who originally built it (for the public-thanks moment)
- What energy gets freed up

In the *4_retires* section, log the three retires. If the team cannot find three, run the diagnostic prompt:

```text
SYSTEM: You diagnose where retires are hiding in a marketing
function's pipeline portfolio. You surface pipelines or
practices that are not earning their place but the team has
not retired.

USER:
Pipeline rollup from Day 1:
{PASTE_DAY_1_ROLLUP}

Team's named retires so far:
{PASTE_RETIRES_LIST}

Return JSON:
[
  {
    "candidate_retire": "<pipeline or practice>",
    "evidence": "<one sentence pointing at the data>",
    "psychological_block_to_retiring": "<one sentence, e.g. 'lead built it', 'founder loves it', 'sunk cost'>",
    "recommendation": "<retire | keep with reduced investment | keep>"
  }
]
```

The diagnostic surfaces the retires the team is avoiding.

You should now have seven committed bets and three named retires.

### Day 4, metric story drafting

The function head writes the metric story.

**Step 4.1, the audience.**

The metric story is for non-marketers. The CFO, the COO, the product team, the all-hands audience. The story is not for other marketers. If it reads like internal marketing speak, rewrite.

**Step 4.2, the structure.**

One page. The shape:

```text
What we shipped this quarter.
{ONE_PARAGRAPH ON THE PORTFOLIO OF WORK, IN PLAIN ENGLISH}

What worked.
{TWO_OR_THREE_BULLETS NAMING SPECIFIC WINS WITH NUMBERS}

What did not work.
{ONE_OR_TWO_BULLETS NAMING SPECIFIC MISSES WITHOUT BLAME}

What we learned.
{ONE_PARAGRAPH ON THE INSIGHT THAT WILL SHAPE NEXT QUARTER}

What we are doing next.
{ONE_PARAGRAPH ON THE SEVEN BETS, AT THE LEVEL THE AUDIENCE
CAN ENGAGE WITH}

What we are no longer doing.
{ONE_PARAGRAPH ON THE THREE RETIRES, WITH PUBLIC THANKS TO
THE TEAM}
```

**Step 4.3, the falsifiability check.**

The metric story must make claims that could be wrong. "Marketing drove growth" is not falsifiable. "Paid social contribution rose because the channel-mix simulator recommended a 22% increase, which produced a 19% lift in conversions" is.

Run the falsifiability check prompt:

```text
SYSTEM: You audit a marketing metric story for falsifiable
claims. Falsifiable means the claim names a specific metric,
a specific magnitude and a specific causal hypothesis that
could be wrong on the data.

USER:
Metric story draft:
{PASTE_DRAFT}

For each claim, return:
{
  "claim": "<verbatim>",
  "is_falsifiable": <true | false>,
  "what_would_falsify_it": "<one sentence, or null if not falsifiable>",
  "rewrite_for_falsifiability": "<rewritten claim, or null if already falsifiable>"
}

Rules:
- "Marketing performed well" is not falsifiable.
- "Email click rate rose from 4.2 to 8.1 percent" is.
- Claims with no metric are not falsifiable by definition.
```

The story rewrites until every claim is falsifiable or marked as opinion explicitly.

**Step 4.4, the executive sponsor review.**

The executive sponsor reads the draft for 60 minutes. Feedback addressed. Final version locked.

You should now have a one-page metric story ready for the board pack and the next all-hands.

### Day 5, lock and brief

The seven bets translate into seven draft briefs.

**Step 5.1, the draft briefs.**

Each committed bet becomes a first-draft brief in the brief-to-ship pipeline. The brief uses the outcome statement template ("we expect that doing X will cause Y because Z, we will know we are right if metric M moves by N in window W") with the falsifiable claim from Day 3 as the seed.

**Step 5.2, the retire documentation.**

Each retire gets a one-paragraph note in the *Pipelines retired* Notion page. The note names what is being retired, why, who built it, and the next time the team will revisit the decision (typically next quarter's review).

**Step 5.3, the metric story sends.**

The function head sends the metric story to the board pack contact and to the all-hands organiser. The story is dated, versioned and saved to the *Metric stories* Notion archive.

**Step 5.4, the kick-off.**

Monday morning, the team comes back to a queue with seven draft briefs already in *Submitted* status. Triage on Monday runs them through to *Accepted* and slots them into the production calendar.

You should now have the next quarter already in motion.

## Worked example, end-to-end

Cascadia Endurance, scale-stage. Q3 planning. Marcus (founder), Beth (brand and content lead, runs the function), Saoirse (channel operator), two production contractors, the new pipeline curator (Candidate B from the hiring-shape playbook, hired in late Q1) at 90 days in.

**Day 1.** Beth exports the Q2 brief ledger. Five completed briefs with metrics logged (rows in the CSV template at the end). The per-pipeline rollup shows race-result-content-engine at hit rate 0.86 (continue), channel-mix-simulator at 0.75 (continue), lifecycle-journey-builder at 0.50 (iterate), crash-replacement-programme at 0.80 (continue), trail-marathon-partnership at 0.20 (retire), linkedin-thought-leadership at 0.15 (retire), direct-mail at 0.10 (retire).

**Day 2.** Beth and the pipeline curator generate 12 candidate bets across continuations (recap engine on UTMB and Lavaredo, channel-mix on autumn budget, crash programme story library), new applications (Vahla launch lifecycle, ambassador 2027), one strategic bet from Marcus (Trail Club regional events), and three carry-overs the curator wants to revisit (attribution rerun, voice extraction v2, seasonal SEO cluster). Each bet runs through the expansion prompt.

**Day 3.** 90-minute forced trade-off. Top seven by composite score:

1. UTMB+Lavaredo recap series (continuation, displaces Trail Club events)
2. Vahla launch hero film cycle (anchor bet, displaces ambassador signing)
3. Channel-mix simulator on autumn budget (continuation, displaces SEO cluster)
4. Lifecycle journey for Storm Shell (new app, displaces race-day-demand refresh)
5. Crash programme story library (continuation, displaces paid search agent v2)
6. Attribution teardown rerun (necessity before autumn budget, displaces voice extraction v2)
7. Brand voice extraction v2 (18-month refresh, displaces attribution overlap, slotted with overlap to bet 6)

Three retires named: trail-marathon-partnership, weekly LinkedIn long-form, monthly print mailer.

**Day 4.** Beth drafts the metric story.

```text
What we shipped this quarter.
Cascadia's marketing function shipped 18 pieces of work across
five pipeline routes in Q2. Hit rate against stated metrics
landed at 80 percent on completed briefs with metrics logged.

What worked.
- Race recap engine on UTMB produced a recap reel that
  outperformed its 3,000-saves target by 47 percent.
- Channel-mix simulator on the spring shoe push lifted paid
  ROAS from 2.1 to 3.2 against a 3.0 target.
- Crash-replacement programme refresh lifted claim-handler
  CSAT from 3.8 to 4.5 against a 4.4 target.

What did not work.
- Trail Club retention nudge moved renewal rate to 73 percent
  against a 75 percent target. Lifecycle pipeline is working
  but on a different mechanism than we tested.
- Three pipelines (trail-marathon-partnership, weekly LinkedIn,
  monthly print) failed to hit any target across the quarter.

What we learned.
The pipelines that produce content around events the audience
already cares about (UTMB, Lavaredo, race recaps, crash stories)
moved engagement and conversion 2 to 4x harder than the
pipelines that produced content on our calendar rather than
the audience's calendar. The next quarter doubles down on
audience-calendar bets.

What we are doing next.
Seven bets for Q3. Anchor is the Vahla Range Storm Shell launch
in September, which routes through gear-launch-sequence with
race-day proof at UTMB. Three continuations of Q2 winners
(recap engine, channel-mix simulator, crash story library).
Two new applications (lifecycle for Storm Shell, attribution
rerun before autumn budgets lock). One brand voice refresh
(18-month due).

What we are no longer doing.
We are retiring trail-marathon-partnership, weekly LinkedIn
long-form and monthly print mailer. Each of these had a real
investment behind them. Thanks to the team who shipped them.
The energy moves to the seven bets above.
```

Falsifiability check passes. Marcus reviews and signs off.

**Day 5.** Seven briefs land in the *Submitted* queue. Retire documentation lands in Notion. The metric story goes to the next board pack (delivered the following Tuesday) and to the all-hands on the same day.

The board reads the metric story. The CFO asks one follow-up question about the Vahla launch budget. The conversation goes differently because the function wrote the story.

## Try it yourself

Three exercises. Each takes 30 to 90 minutes.

### Exercise 1, run the Day 1 rollup on your last quarter

Pull your brief ledger from the last quarter (or your equivalent). Run the Step 1.2 rollup prompt. Read the verdicts. Where the model marks "retire" and your gut said "keep", investigate. The disagreement is the value.

### Exercise 2, write the falsifiable claim for one bet

Pick a bet you are considering for next quarter. Write the falsifiable claim ("will move {metric} by {amount} in {window}"). Show it to a sceptical colleague. Can they imagine the bet being wrong? If not, the claim is not falsifiable yet.

### Exercise 3, name three retires

Without checking your data, name three pipelines or practices you suspect are not earning their place. Now check the data. Were you right? The gap between gut and data is where the retire discipline lives.

## The eval gates

**Eval 1, bet displacement clarity.** For each of the seven chosen bets, the displaced alternative is named. If the team cannot say "we chose A over B", they do not really know what trade-off was made.

**Eval 2, retire honesty.** At least two retires per quarter, ideally three. Functions that never retire a pipeline are accumulating cruft.

**Eval 3, metric-story falsifiability.** Every claim in the metric story names a metric, a magnitude and a hypothesis. The falsifiability check prompt scores every claim.

**Eval 4, ritual time-box.** Five days. Not six, not eight. If the ritual is running long, the function is over-planning and under-shipping.

## The failure modes

**Bet count creeps.** Every quarter the team finds reasons to commit to 9, 10, 11 bets instead of 7. Capacity does not change, and quality of execution drops. Hold 7 as a hard limit.

**Retires get postponed.** Teams know which pipelines are mediocre but resist retiring because someone built them. Make retiring a public, celebrated act, where the function lead publicly thanks the team. Removes the shame.

**Metric story becomes marketing of marketing.** The metric story is useful to non-marketers. If it is full of acronyms, channel names and platform-specific metrics, rewrite. The story is for the CFO and the COO, not for other marketers.

**Planning ritual gets compressed.** "Let's just do days 1 to 3, we can skip 4 and 5." This usually means no metric story gets written and the briefs do not actually start. Hold the five days.

**The ritual replaces the work.** Some functions over-plan and under-ship. If a team is spending two weeks on quarterly planning, the planning has become the product. Cut it.

## The pattern in practice

Illustrative scenarios that show common shapes the quarterly planning ritual takes. Specifics are illustrative and patterns repeat.

**B2B SaaS, scale-stage, the data-led discipline.** A function doing planning as a three-day off-site, light on data, heavy on argument. Installing the five-day ritual with the data-extraction front-loaded typically lifts the function's bet-success rate (briefs whose target metric moved) materially over two quarters. Partly because the trade-off discipline keeps the team focused, partly because the retires clear capacity.

**D2C, growth-stage, the metric-story unlock.** A function planning by reaction, whatever is urgent that week. The ritual gives the function a quarterly shape for the first time. The metric story drafted in Day 4 goes to the board in the next meeting and changes how non-marketing leadership talks about the function's work. The brand had been under-crediting marketing because nobody was writing the story.

**Agency, the bet-count creep failure.** A common failure mode is the function commits to nine bets instead of seven because the founder pushed two extras in. The team executes seven well and two poorly, the two poor ones being the founder's. The lesson is that the seven-bet cap is the discipline. Founder bets compete on merit, not on seniority.

## Templates

The quarterly-planning workbook as a CSV. Five sections (data, candidates, committed, retires, metric story), one row per item. Drop into Google Sheets or copy into a Notion database.

[Download quarterly-planning-workbook-template.csv](/lens/templates/quarterly-planning-workbook-template.csv)

The CSV ships with a sample Cascadia Q3 walk-through across all five sections. Wipe them, keep the headers, fill in your own.

**If your planning cadence or workbook structure differs, ask Claude to build a custom version.**

```text
SYSTEM: You generate a quarterly-planning workbook CSV
tailored to a specific marketing function's cadence and
workbook structure.

USER:
My planning cadence: {QUARTERLY | TRIMESTER | OTHER}
My bet count target: {7 | 5 | 9 | OTHER}
My retire count target: {3 | 2 | OTHER}
Extra fields I need: {LIST_EXTRA_FIELDS}

Generate a CSV with five sections (data, bet candidates, bet
committed, retires, metric story) and columns for:
- Section, Item_ID, Title, Pipeline_Route, Type
- Quarter, Status, Prior_Quarter_Metric_Hit, Owner
- Estimate_Working_Days, Slot_Week, Displaced_Alternative
- Rationale, Falsifiable_Claim, Notes
- (any extras I specified)

Pre-fill a sample quarter for an endurance brand. Return
the CSV directly.
```

## Hand-off

The quarterly planning ritual feeds:
- **brief-to-ship-pipeline**, where the seven committed bets enter as draft briefs on Day 5
- **hiring-shape-for-ai-native-teams**, where the bet count against capacity surfaces the next hire
- **evaluation-frameworks**, where the per-pipeline hit rate informs which rubrics need recalibration
- **brand-guardrails-as-code**, where retire decisions on content pipelines feed retire decisions on associated rules
- **gear-launch-sequence**, where any launch bets carry into the 12-month launch calendar as their own parent project
