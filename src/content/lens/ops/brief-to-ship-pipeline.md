---
title: "Brief-to-ship marketing pipeline"
stack: ops
description: "A single operating system for the marketing function. Brief intake, eval-gated production, scheduled ship, post-mortem feedback. Replaces ten tools and three weekly meetings."
outputs: "Pipeline spec, brief templates, gate definitions, shipping ritual"
readMin: 12
shipTime: "2 working weeks"
brandStage: ["growth", "scale", "enterprise"]
channels: ["analytics", "content", "brand"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-04-15
status: live
preview: false
---

## The brief

Most marketing teams ship through a fog. A "brief" is whatever the requester pasted into Slack. Production is whoever has capacity. Approvals are forwarded over email. Performance is reported on a deck no one reads. Each individual piece of work might be fine; the system around it is not.

This playbook is the operating system. Briefs intake through a single structured template. Production runs through standardised pipelines (the ones in this library are all candidates). Output gates are explicit. Shipping happens on a cadence, not when someone gets to it. Post-mortems flow back into the brief template so next quarter's briefs are smarter than last quarter's. It's not a tool — it's a discipline. The tools just enforce it.

## The pipeline

Six modules.

**Module 1 — The brief.** A structured intake form (Notion / Airtable / Linear / Coda, choose your runtime). Required fields: outcome statement (one sentence, not a deliverable), audience (specific segment, not "users"), success metric (with a number), context the team needs, hard constraints (legal, brand, technical), the deadline (with an explicit cost-of-late). Optional fields: spokesperson, must-include facts, ban list, voice profile reference. A brief that's missing required fields gets returned to the requester with the gaps flagged — not started.

**Module 2 — Triage.** Once a week, the marketing lead triages incoming briefs. Each brief gets routed to a pipeline (one of the playbooks in this library), an estimate (working-days), and a slot in the production schedule. Triage takes 45 minutes a week and replaces the seven hallway conversations it used to take.

**Module 3 — Production.** The work happens. Whichever pipeline owns the brief, the pipeline's own eval gates apply. No work ships that hasn't passed the gates for its category. This is non-negotiable; it's what stops the function from regressing.

**Module 4 — Pre-ship review.** A standing 30-minute Tuesday meeting. Anything ready to ship gets a 5-minute review against the brief's success metric: does this deliver the outcome? If yes, ship. If no, single round of revisions and back to ship next week.

**Module 5 — Ship.** Wednesday is ship day. Everything that passed Tuesday goes live. Concentration of shipping reduces context-switching, gives the team a predictable rhythm, and lets the metrics team prep instrumentation in advance.

**Module 6 — Post-mortem and feedback.** Two weeks after a ship, the metric reported in the brief gets logged. Quarterly, the team reviews the brief-to-outcome correlation. Briefs whose stated metric didn't move get retired as a brief category. Briefs whose stated metric moved get cloned as templates.

## The brief template

The template that actually works after multiple revisions. Copy it.

```yaml
brief:
  title: "<noun phrase, not 'Project'>"
  outcome_statement: |
    "We expect that doing <thing> will cause <outcome> because <why we
    believe this>. We'll know we're right if <metric> moves by <amount>
    within <window>."
  audience:
    primary_segment: "<specific behavioural segment, not demographic>"
    segment_size_estimate: <number or range>
    state_before: "<what they currently believe, feel or do>"
    state_after: "<what we want them to believe, feel or do>"
  success_metric:
    metric_name: "<the specific metric>"
    current_baseline: <number>
    target: <number>
    window: "<14 days | 30 days | quarter>"
    instrumentation_owner: "<who logs this>"
  context_for_team:
    - "<the 3-7 things they need to know that aren't obvious>"
  hard_constraints:
    legal: ["<flag specific risks>"]
    brand: ["<voice rules, banned phrases>"]
    technical: ["<channel limits, format limits>"]
  must_include:
    - "<facts, claims, proof points, with source>"
  ban_list:
    - "<phrases, claims, comparisons to avoid>"
  deadline:
    target_ship: "<date>"
    cost_of_late: "<what missing this date actually costs in plain
                    English — not 'urgent'>"
  pipeline_route: "<which library playbook owns this brief>"
```

The "outcome_statement" field is the one that does the most work. Briefs that can't articulate the causal hypothesis don't get accepted. This sounds bureaucratic; it's not. It's the single discipline that stops the function from running busywork.

## The eval harness

The pipeline gates at the function level, not just per-pipeline.

**Eval 1 — Brief acceptance rate.** Track what percentage of incoming briefs pass intake on the first submission. Quarterly target: 60%+ after the first month. Below 40% means the template is too strict; above 80% means the template is letting fuzzy briefs through.

**Eval 2 — Slip rate.** Track the percentage of briefs that miss their stated ship date. Target: under 15%. Higher than that means triage is over-loading the team or briefs are being undersized.

**Eval 3 — Outcome correlation.** Quarterly, for completed briefs with metrics that have landed, what fraction moved the stated metric? Target: 50%+. (You should be wrong half the time. If you're right 90% of the time, you're not betting enough; you're shipping safe work.)

**Eval 4 — Cycle time per brief category.** Track median cycle time from brief-accept to ship by pipeline category. Cycle times should be stable or shortening. Any category whose cycle time is climbing is the category to investigate.

## The failure modes

**Brief template gets watered down.** Senior stakeholders find the template restrictive and start raising "exceptional" briefs that skip fields. The function regresses to chaos in a quarter. Hold the line. The template's strictness is its value. If a stakeholder won't fill it in, the work isn't ready to start.

**Ship day becomes optional.** "Wednesday ship" works because everyone knows it's coming. The first time work slips to Thursday because someone wasn't ready, the discipline cracks. Stick to Wednesday even if the only thing shipping is a single tweet. The cadence is the asset.

**Post-mortems become rituals.** Without follow-through, the post-mortem is theatre. Either it's binding (retired brief categories actually stop being briefed) or it's noise. Make the quarterly review attended by the function head and the metrics owner, not delegated.

**Triage becomes a queue manager.** The triage role isn't admin. It's strategic — the person who decides which brief routes to which pipeline, who pushes back on under-defined briefs, who detects when the pipeline mix is wrong. Don't assign it to the most junior person. Don't delegate it to a tool.

**Pipelines proliferate.** Marketing teams love to add a new pipeline for every new tactic. Resist. The library is curated — only pipelines that earn their place via repeated successful application stay. Most teams need 8-12 pipelines, not 40.

## The receipts

**B2B SaaS, scale-stage.** Marketing function was 11 people, shipping ~30 pieces of work a month, with brief-to-ship cycle times ranging from 3 days to 9 weeks. We installed the pipeline. After two quarters: 42 pieces a month, median cycle time 11 working days, brief acceptance rate at 67%, outcome correlation at 54% (i.e. just over half of bets paid off — exactly the target).

**D2C, growth-stage.** Marketing function was 4 people, doing everything by Slack. Brief intake was the contentious part — the founder felt the template added bureaucracy. Six weeks in, the founder retracted, after the template surfaced that two of his "urgent" briefs had no clear audience definition. The pipeline became the way the founder briefed too. Function output up 60% without headcount.

**Fintech, retired engagement.** We installed the pipeline. Two quarters later, the marketing head left and her successor wanted to ship faster by skipping the template. Within a quarter the team was back in Slack-driven chaos. We don't claim the pipeline survives a hostile leadership change. It needs a sponsor inside the team who values the discipline.
