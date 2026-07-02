---
title: "Hiring shape for AI-native marketing teams"
stack: ops
description: "The role taxonomy, the interview signal, the trial-task pack. How to staff a marketing function whose leverage comes from AI without becoming a team of prompt engineers."
outputs: "Role descriptions, interview rubric, trial-task pack, hiring scorecard"
readMin: 18
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-05
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **role taxonomy** with four named roles, the leverage each holds, and the composition for a function of your size.
2. **Job descriptions** for each role, written in observable capability language rather than tool-familiarity language, ready to post on your careers page or in Greenhouse.
3. An **interview rubric** with the signals each role's interview is testing for, the questions that surface those signals and the anchor answers that score 1, 3 and 5.
4. A **trial-task pack** per role, scoped to four to six paid hours of candidate time, with the scoring rubric and what excellent looks like.
5. A **hiring scorecard** in Greenhouse, Ashby or Lever that maps every interview stage to the four signals per role, with weighted scoring.

## Who this is for

A growth, scale or enterprise endurance brand hiring into a marketing function where AI tooling already runs day-to-day work. The brand has at least one open headcount or expects to in the next six months. If you are hiring your first marketing person, run brand-voice-extraction first so you know what the role is producing.

## Before you start

- [ ] Open headcount or planned headcount with budget approved
- [ ] Function head who can sign off on the role taxonomy (most teams discover the taxonomy reshapes the open headcount)
- [ ] Greenhouse, Ashby, Lever or your applicant tracking system (ATS) of choice with admin access
- [ ] Comp benchmarks for your market (Pave, Levels.fyi, or the Marketing Mavens UK salary report if you are in Britain)
- [ ] Your function's current org chart in a Notion page or a Google Doc
- [ ] One month of your function's brief log (from brief-to-ship-pipeline) so the work is concrete in interviews
- [ ] The brand's Lens library access for candidates (or a comparable playbook library)
- [ ] An hour blocked on the calendar with the function head to walk the taxonomy

If the function head will not commit to restructuring an open role to match the taxonomy, the playbook still helps with interviewing, but the leverage is in the role redesign.

## The pipeline

Five phases. One working week to redesign roles and rebuild interviews. The hiring itself runs on its own clock.

### Phase 1, role taxonomy

The four roles. Each holds different leverage.

**Step 1.1, walk the four roles.**

In a Notion page called *Marketing role taxonomy*, write the four roles with their definitions, their leverage and the work each one does.

```text
Role A, strategy operator.
Sets the brand position, defines the briefs, owns the success
metrics. The job is to be right about what to do, and to keep
the team from drifting into busywork. 40% of comp budget on a
senior team.

Role B, pipeline curator.
Owns the playbook library. Maintains rubrics, calibrates
evals, retires pipelines that aren't earning their place,
builds new ones from observed wins. The role most teams don't
have and most need.

Role C, output editor.
The senior writer, designer or video producer. Reviews work
that the pipelines produce. Owns brand voice and craft. Half
the time of a pre-AI editor, with the other half now upstream
in pipeline curation.

Role D, channel operator.
Ships, schedules, instruments, reports. The function's hands.
Knows the platforms, the trackers, the schedulers. Roughly
the same as the pre-AI version of the role.
```

What has been compressed is junior drafters. A pre-AI team of 8 was typically 4 drafters, 2 editors, 1 strategist and 1 channel operator. The AI-native version is 1 strategy operator, 1 pipeline curator, 2 editors and 1 channel operator. Same output, different shape.

**Step 1.2, map your current team against the taxonomy.**

Take your org chart. For each person, write which role they are closest to. Most teams discover one of three things: a junior-heavy team where the leverage roles are missing, an editor-heavy team where the pipeline curation is unstaffed, or a senior-heavy team where the channel operator role is being done by the strategy operator and nobody is shipping cleanly.

The gap is the next hire.

**Step 1.3, map your open headcount.**

For each open role, ask which of the four it should be. Often the open role was scoped before the taxonomy and the title does not fit. Rewrite the role.

You should now have a taxonomy, a current-team map and a clear sense of which role you are hiring.

### Phase 2, job description

The JD is written in observable capabilities, not tool familiarity.

**Step 2.1, the JD template.**

Paste this into Notion or your ATS:

```text
{ROLE_TITLE}, {BRAND_NAME}

The leverage.
{ONE_PARAGRAPH ON THE WORK THIS ROLE DOES AND THE OUTCOME IT
OWNS}

What you will do, week to week.
- {OBSERVABLE_ACTIVITY_1}
- {OBSERVABLE_ACTIVITY_2}
- {OBSERVABLE_ACTIVITY_3}
- {OBSERVABLE_ACTIVITY_4}
- {OBSERVABLE_ACTIVITY_5}

What you bring.
- {OBSERVABLE_CAPABILITY_1}
- {OBSERVABLE_CAPABILITY_2}
- {OBSERVABLE_CAPABILITY_3}
- {OBSERVABLE_CAPABILITY_4}

What you don't need.
- A list of AI tools you have used. We use what works and that
  changes every six months.
- {ANOTHER_THING_PEOPLE_OVER-INDEX_ON}

The shape of the function.
{ONE_PARAGRAPH ON THE TEAM, THE OTHER ROLES, AND WHO THIS
ROLE PARTNERS WITH}

Comp range, {GBP_RANGE_OR_USD_RANGE}, plus equity for senior
roles. Process is {N} conversations, a paid trial task, and a
decision within {N} working days.
```

**Step 2.2, the capability-language prompt.**

If your draft JD reads like a generic LinkedIn post (lots of "passionate", "results-oriented", "team player"), run it through the prompt:

```text
SYSTEM: You rewrite a marketing job description in observable
capability language. You strip generic personality adjectives.
You replace tool-familiarity requirements with capability
requirements. You return the rewritten JD.

USER:
Role: {ROLE_NAME}
Role type per taxonomy: {STRATEGY_OPERATOR | PIPELINE_CURATOR | OUTPUT_EDITOR | CHANNEL_OPERATOR}
Original JD:
{PASTE_ORIGINAL_JD}

Rewrite the JD with:
- "What you will do" as five concrete weekly activities
- "What you bring" as four observable capabilities (things a
  candidate has done before, not things they "are")
- "What you don't need" naming the two things readers
  over-index on
- No generic personality adjectives (passionate, driven,
  team-player, results-oriented)
- Tool requirements replaced with capability requirements
- Same word count or shorter

Return the JD as plain markdown.
```

You should now have a JD that a strong candidate reads and recognises themselves in, and a weak candidate self-deselects from.

### Phase 3, interview signals and rubric

For each role, the interview is structured around what the role actually does.

**Step 3.1, the four signals per role.**

In a Notion page called *Interview signals*, write the four signals for each role. The signals below are the proven ones.

**Strategy operator signals.**
1. Can articulate a metric-anchored hypothesis from a vague problem.
2. Reads a marketing brief and finds the missing-required-field gaps.
3. Names the failure modes of their own past work without prompting.
4. Distinguishes interesting from important.

**Pipeline curator signals.**
1. Can read a playbook and identify what would break for their last team.
2. Knows the difference between rubric-as-judge and model-as-judge.
3. Has seen at least one prompt fail and can describe why specifically.
4. Calibrates own confidence (says "I don't know" when they don't).

**Output editor signals.**
1. Can describe the brand's voice in observable patterns, not adjectives.
2. Diffs two drafts and explains what changed in voice terms.
3. Can write the voice rubric from a small corpus.
4. Pushes back on briefs that lack a hook.

**Channel operator signals.**
1. Knows the limits of the platforms they operate.
2. Has built a tracker or dashboard a non-technical reader would use.
3. Can describe a holdout or incrementality test they have run.
4. Articulates what they do not measure and why.

**Step 3.2, the anchored question bank.**

For each signal, write a question and three anchor answers (score 1, 3, 5). Example for the strategy operator signal 1:

```text
Question: "We're losing share to a competitor whose product is
worse but whose marketing is better. What do you do?"

Score 5 anchor: Candidate restates as a metric question first
("what does 'losing share' mean exactly, by how much, since
when, in which segment?"), then names two or three falsifiable
hypotheses with the tests that would distinguish them. Doesn't
jump to tactics.

Score 3 anchor: Candidate offers a tactic ("we should run a
brand campaign") but can articulate why, with a plausible
metric. Light on diagnostics first.

Score 1 anchor: Candidate launches into tactics ("we need
better social, more content, an influencer programme") with
no diagnostic, no metric, no hypothesis structure.
```

Write three to five questions per signal. The interview pulls from the bank.

**Step 3.3, the scorecard.**

In Greenhouse or Ashby, create a custom scorecard for each role. Each interview stage maps to one or two signals. The interviewer scores 1 to 5 against the signal with one sentence of justification. The scorecard surfaces signal-by-signal performance across the loop, rather than a vague overall score.

You should now have an interview loop where each stage tests something specific and the scores are anchored.

### Phase 4, the trial-task pack

Four to six hours of paid candidate time that mirrors the role's actual day.

**Step 4.1, the trial-task structure per role.**

**Strategy operator trial.**

Send the candidate a real (anonymised) brief from your function with the required fields removed. The candidate has four hours to:

1. Complete the brief by filling in the gaps as they would have asked the requester
2. Propose the success metric with baseline and target
3. Identify the pipeline route from the Lens library
4. Write a 200-word rationale for the route and the metric

Scored on whether they identify the missing fields, whether their metric is concrete, whether their outcome statement is causal and whether their pipeline route holds up under questioning in the follow-up call.

**Pipeline curator trial.**

Send the candidate a working but suboptimal playbook (a draft Lens-style pipeline with three planted failure modes). The candidate has six hours to:

1. Identify the failure modes
2. Propose the eval rubric the pipeline is missing
3. Recommend two pipeline changes
4. Write a 200-word rationale for the highest-impact change

Scored on diagnosis quality, not on rewriting the whole pipeline. The follow-up call is the candidate walking through their reasoning.

**Output editor trial.**

Send the candidate a passing-the-gates draft from your function's pipeline (e.g. a race recap from race-result-content-engine, or a launch email). The candidate has four hours to:

1. Edit the draft against the brand voice rubric (which they receive)
2. Write a 100-word note explaining the highest-impact edit
3. Identify one criterion the rubric is missing

Scored on whether the edits move the rubric scores up, not on whether the candidate "improved" the draft per personal taste.

**Channel operator trial.**

Send the candidate a campaign brief (e.g. a Vahla Range launch) that needs instrumentation, scheduling and a one-week reporting view. The candidate has four hours to:

1. Write the instrumentation spec (UTMs, conversion events, attribution settings)
2. Build a one-week reporting view in Google Sheets or Looker that a non-technical reader could use
3. Note the one thing they would not be able to measure cleanly and why

Scored on whether the instrumentation actually answers the brief's metric question and whether the reporting view is readable.

**Step 4.2, the trial-task brief template.**

Send the candidate a single page covering scope, time budget, deliverables, payment and the follow-up format.

```text
{ROLE_TITLE} trial task, {BRAND_NAME}

Scope.
{ONE_PARAGRAPH ON THE TASK AND WHY IT MIRRORS THE ROLE}

Time budget.
{4 to 6} hours. We will pay for {N} hours at {GBP_RATE} per
hour regardless of how long it takes. Don't go past the time
budget. We're looking at how you scope, not how much you
produce.

Deliverables.
1. {DELIVERABLE_1}
2. {DELIVERABLE_2}
3. {DELIVERABLE_3}

Format.
Submit by {DATE}. We will schedule a 45-minute follow-up the
following week where you walk us through your reasoning. The
follow-up matters as much as the artefact.

Materials attached.
- {THE_BRIEF_OR_DRAFT_OR_PIPELINE}
- {ANY_REFERENCE_MATERIAL}

Pay.
{INVOICE_INSTRUCTIONS}

Questions during the task.
Email {CONTACT}. We'll respond within one working day.
```

**Step 4.3, the scoring rubric per task.**

For each trial task, write the scoring rubric in advance with three score bands. Example for the strategy operator trial:

```text
Score 5: All required fields identified. Metric is specific
with baseline and target. Pipeline route is the right one and
the rationale stands up to questioning. Outcome statement is
causal.

Score 3: Most required fields identified. Metric is named but
baseline or target is missing. Pipeline route is plausible.
Rationale is light.

Score 1: Required fields missed. Metric is generic. Pipeline
route is wrong or absent. Rationale is hand-wave.
```

The interviewer scores against the rubric, not against personal preference.

You should now have a trial-task pack the function can run on every hire without rebuilding.

### Phase 5, the hire decision

The scorecard converges. The decision is made.

**Step 5.1, the post-loop synthesis.**

After every interview, the panel meets for thirty minutes. The scorecard is reviewed signal by signal, not stage by stage. A candidate with two 5s on the critical signals and two 3s on secondary signals is a hire. A candidate with all 4s across the board is often a pass (the average is the average, not strength).

**Step 5.2, the synthesis prompt for ambiguous cases.**

For cases where the panel disagrees, run the prompt.

```text
SYSTEM: You synthesise a marketing hiring loop's scorecard
into a decision recommendation. You weight the critical
signals over the secondary ones. You name the risk and the
upside of the hire.

USER:
Role: {ROLE_TITLE}
Role type: {STRATEGY_OPERATOR | PIPELINE_CURATOR | OUTPUT_EDITOR | CHANNEL_OPERATOR}
Scorecard:
{PASTE_SCORECARD_WITH_PER_SIGNAL_SCORES_AND_JUSTIFICATIONS}

Trial task score: {TRIAL_SCORE_OUT_OF_5}
Trial task scoring rubric note: {RUBRIC_OBSERVATION}

Return JSON:
{
  "recommendation": "<hire | hire_with_concerns | pass>",
  "critical_signal_summary": "<one sentence on the strongest critical-signal performance>",
  "biggest_risk": "<one sentence on the biggest risk of hiring>",
  "biggest_upside": "<one sentence on the biggest upside>",
  "starting_level": "<senior | mid | junior>",
  "first_30_days_focus": "<one sentence on what to set up for them>"
}

Rules:
- recommendation hire_with_concerns when critical signals are
  strong but secondary signals raise specific risks.
- biggest_risk is concrete, not generic ("communication") -
  reference scorecard evidence.
```

You should now have a hire decision that is anchored in the signals, not in vibe.

## Worked example, end-to-end

Cascadia Endurance, scale-stage. Marketing function of five (Marcus founder, Beth brand and content lead, Saoirse channel operator, two contractors on production). Open headcount for a content marketer.

**Phase 1.** Beth runs the role taxonomy mapping. The current team has the strategy operator (Marcus, partly), the output editor (Beth), the channel operator (Saoirse) and two production contractors. The pipeline curator role is unstaffed. Beth is doing it on top of editing, badly.

**Phase 2.** The open content-marketer role gets rewritten as *Pipeline curator, Cascadia Endurance*. JD runs through the rewrite prompt. The "passionate trail running enthusiast" language gets stripped. The "experience with Notion AI" requirement gets dropped. The capability requirements name what the candidate has done.

**Phase 3.** Interview signals lock for pipeline curator. Question bank gets written with anchored answers. The Greenhouse scorecard is built.

**Phase 4.** Trial-task pack ships. The pipeline curator task uses a draft Lens-style pipeline with three planted issues (a missing eval, a brittle prompt, a calibration gap). Candidates have six hours and £400 to deliver.

**Phase 5.** Three candidates run through the loop. Candidate A scores 5-3-4-4 on the signals and 4 on the trial. Candidate B scores 4-5-4-3 on the signals and 5 on the trial. Candidate C scores 4-4-4-4 on the signals and 3 on the trial. The synthesis prompt recommends hire on Candidate B (strongest on the critical signal of distinguishing rubric-as-judge from model-as-judge, strongest on the trial task), pass on C (average across the board, no critical-signal strength), hire_with_concerns on A (strong strategic signal but trial showed gap on calibration).

Cascadia hires Candidate B. Within two quarters, Beth's editing time drops from 60% of her week to 35%. Pipeline curation work that had been sitting on Beth's plate now happens systematically. Function output rises 35% in volume without quality regression.

**The hiring scorecard for Candidate B (extract):**

| Stage | Signal tested | Score | Justification |
|---|---|---|---|
| Phone screen | Pipeline curator S1 | 4 | Read attribution-teardown and identified two breakage points |
| Hiring manager interview | Pipeline curator S2 | 5 | Cleanly distinguished judge from rubric, gave example |
| Trial task | All four signals | 5 | Identified all three planted issues, named the missing eval |
| Final panel | Pipeline curator S3 + S4 | 4 | Honest on confidence calibration; specific failure example |

## Try it yourself

Three exercises. Each takes 30 to 60 minutes.

### Exercise 1, map your team against the taxonomy

Take your current org chart. For each person, mark which of the four roles they are closest to. Where are the gaps? Where is one role doing the work of two? The exercise surfaces the next hire shape.

### Exercise 2, rewrite one JD in capability language

Pick one of your existing JDs (or one from a public job board). Run it through the Step 2.2 rewrite prompt. Compare the before and after. How many generic personality adjectives got stripped? How many tool requirements got replaced with capabilities? The gap is the value of the rewrite.

### Exercise 3, write the score-5 anchor for one signal

Pick the role you are hiring next. Pick one signal. Write the score-5 anchor answer in 50 to 100 words. Read it. Could the question reasonably get this answer in a 45-minute interview? If not, the question is wrong, or the bar is set in the wrong place.

## The eval gates

**Eval 1, scorecard discrimination.** Across a quarter of hires, the scorecard scores correlate with on-the-job performance at 6 months. If scorecards do not correlate, either the signals are wrong or the interviewers are not anchoring.

**Eval 2, trial-task fairness.** Time-budget compliance from candidates above 80%. If candidates routinely go over the time budget, the task is over-scoped.

**Eval 3, offer-to-accept rate.** Quarterly. Above 70% means the JD, comp and process are working. Below 50% means candidates are getting better offers elsewhere or the loop is causing self-deselection.

**Eval 4, 6-month tenure success.** Track hires at 6 months on stay/leave and on outcome correlation (briefs they own whose metric moved). Tenure above 80% and outcome correlation above 50% means the loop is selecting well.

## The failure modes

**Hiring for tool familiarity.** Tool names change every six months. "Has used Notion AI" is not a signal. "Has built an eval rubric that worked" is. Filter the JD for tool-name requirements and replace with capability requirements.

**Trial tasks that are not representative.** A 20-hour take-home is exploitative and selects for unemployed candidates. A 30-minute live exercise is too short to surface real competence. The 4-to-6 hour structured trial, paid, scoped, mirrors the work.

**Mistaking output volume for output quality.** AI-native teams produce more output per head. Promoting on volume produces the wrong incentive. Measure on outcome correlation, not output rate.

**Senior roles end up doing junior work.** Without a pipeline curator role, the strategy operator ends up calibrating evals between strategy work. Without an output editor, the strategy operator ends up reviewing drafts. The taxonomy exists to keep each role doing its leveraged work.

**Over-rotating to AI literacy.** Some hiring managers screen so aggressively for AI competence that they miss strong marketing operators who have not yet had to use it. AI literacy is teachable in 6 to 12 weeks for a strong operator. Marketing judgement is not teachable in 6 to 12 months. Hire for the harder thing.

## The pattern in practice

Illustrative scenarios that show common shapes the hiring-shape reset takes. Specifics are illustrative and patterns repeat.

**B2B SaaS, scale-stage, the taxonomy rebuild.** A marketing function of around nine generalist content marketers. After installing the role taxonomy and running new hires through the trial packs over two quarters, the function typically restructures to five or six people in the four-role shape and ships substantially more output that hits its briefs. Same budget, much higher leverage.

**D2C, growth-stage, the missing-role finding.** A brand about to hire its fifth content marketer. Mapping the workload against the taxonomy surfaces that the function is missing a pipeline curator entirely. The brand hires the curator instead. Throughput multiplies within two quarters without the extra heads originally budgeted.

**Agency, the volume-bias failure.** A common failure mode is the agency hires on output volume (drafts shipped per week). After a year, the function's drafts are technically prolific but the brand lead is reverting more pieces than ever. The promotion ladder selected for volume over judgement. The fix is rebuilding promotions around outcome correlation, not piece count.

## Hand-off

The hiring shape connects to:
- **brief-to-ship-pipeline**, where each role's work is defined by the briefs the function ships
- **quarterly-planning-ritual**, where the role taxonomy gets revisited each quarter against actual capacity needs
- **brand-voice-extraction**, where the output editor's brand-voice work originates
- **evaluation-frameworks**, where the pipeline curator's calibration work lives
- **brand-guardrails-as-code**, where the pipeline curator maintains the ruleset
