---
title: "Quarterly OKR synthesis, team reports to CEO and board summary"
stack: productivity
description: "Status reports from five team leads compressed into a CEO-ready quarterly summary and a board narrative. Two hours instead of two days."
outputs: "Synthesis spec, status report ingestion prompt, scoring rubric, narrative draft, board pack section"
readMin: 23
shipTime: "1 working day"
brandStage: ["scale", "enterprise"]
channels: ["docs", "crm", "tasks"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-09-07
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **synthesis spec** that names the audience (CEO, board, all-hands) and the four shapes the synthesis takes.
2. A **status report ingestion prompt** that reads team-lead reports and produces a normalised view of OKR progress, blockers and risks.
3. A **scoring rubric** that grades every objective on a 0 to 1 scale with a consistent definition, so the CEO is not comparing one team's "green" to another team's "amber".
4. A **narrative draft** in two shapes, a CEO-ready summary and a board pack section, each in the right voice for the audience.

## Who this is for

A marketing or GTM leader, chief of staff, or operating partner running a quarterly synthesis across multiple team leads. You currently spend a full day or two reading status reports, normalising scoring, writing the CEO summary and reformatting for the board. Your organisation has at least three named teams running OKRs with status reports.

If you have one team or no OKR cadence, this is overkill. If you have ten or more teams, the pipeline scales but you may need to layer a function-level synthesis pass before the org-level synthesis.

## Before you start

- [ ] OKR documents from each team lead for the quarter (Notion, Google Docs, Asana goals, Linear cycles, or whatever the org uses)
- [ ] Each team's mid-quarter and end-of-quarter status reports (free-form is fine, the ingestion prompt normalises)
- [ ] The brand voice profile for the CEO summary
- [ ] The board voice profile (typically more formal than the CEO summary)
- [ ] Last quarter's synthesis if it exists, for continuity
- [ ] A target delivery date for the board pack and the all-hands
- [ ] 4 hours blocked for the pipeline run

If team leads do not produce status reports, the synthesis cannot run. Recommend the team-status-report ritual as the first step.

## The pipeline

Four phases. Phase 1 sets the spec once. Phases 2 through 4 run each quarter.

### Phase 1, synthesis spec

The spec names the synthesis outputs.

**Step 1.1, the four shapes.**

| Shape | Audience | Length | Tone |
|---|---|---|---|
| CEO summary | CEO and exec team | 600-1000 words | Direct, named risks, named asks |
| Board pack section | Board members | 400-700 words | Formal, year-on-year framing, named ask if any |
| All-hands narrative | All employees | 500-800 words | Celebratory but honest, named team wins, named lessons |
| Function-leads digest | Function heads | 800-1500 words | Cross-functional dependencies and handovers, blockers, asks |

The spec lives in `okr-synthesis-spec.md` and tracks which of these four the operator owns producing.

**Step 1.2, the OKR taxonomy.**

A consistent taxonomy across teams is the load-bearing piece. The synthesis breaks if one team scores "achieved" at 70 percent and another at 100 percent.

The default rubric:

| Score | Definition |
|---|---|
| 1.0 | Hit or exceeded the original key result. Numbers ratify. |
| 0.7-0.9 | Substantially achieved. Either hit a downscoped version or hit close enough that the spirit of the objective landed. |
| 0.5-0.6 | Real progress but not the outcome. Useful learning, not a win. |
| 0.3-0.4 | Limited progress. The bet did not work in this quarter. |
| 0.0-0.2 | No movement. The objective was wrong, deprioritised, or impossible. |

Force every team to use this rubric. The synthesis is honest because the scoring is honest.

### Phase 2, status report ingestion

The team reports become normalised JSON.

**Step 2.1, the ingestion prompt, run once per team.**

```text
SYSTEM: You read a team lead's quarterly status report and
normalise it into a structured view of OKR progress, blockers,
risks and asks. You apply the standard scoring rubric. You
do not over-claim, where the report uses "we made progress",
you score conservatively, where the report uses specific
numbers, you anchor to those.

USER:
Team name:
{TEAM_NAME}

Team lead:
{LEAD_NAME}

Scoring rubric (binding):
{PASTE_RUBRIC}

Team OKRs for the quarter:
{PASTE_OKRS}

Team status report (free-form):
{PASTE_REPORT}

Optional, last quarter's synthesis entry for this team:
{PASTE_LAST_QUARTER}

Return JSON:
{
  "team": "<verbatim>",
  "lead": "<verbatim>",
  "objectives": [
    {
      "objective": "<verbatim>",
      "key_results": [
        {
          "key_result": "<verbatim>",
          "target": "<the original target>",
          "actual": "<what landed>",
          "score": <0.0-1.0>,
          "score_rationale": "<one sentence anchoring score to evidence>"
        }
      ],
      "objective_score": <0.0-1.0, weighted average of key results>,
      "narrative": "<one paragraph, 60-100 words, what happened on this objective>"
    }
  ],
  "blockers": ["<one line per blocker that affected the quarter>"],
  "risks_into_next_quarter": ["<one line per risk>"],
  "asks": ["<one line per ask to the org or to the CEO>"],
  "wins_to_celebrate": ["<one line per concrete win>"],
  "lessons": ["<one line per concrete lesson worth sharing across the org>"],
  "team_average_score": <0.0-1.0, average across all objective_scores>
}

Rules:
- Score conservatively when the report is vague.
- Anchor every score to a target / actual pair.
- A team_average_score above 0.85 with multiple "we made progress"
  phrases triggers a flag, score honesty is suspect.
- Lessons must be concrete (named) not abstract ("communicate
  better" is not a lesson, "Slack threads need a 24h SLA from
  product to design" is).
- Return JSON only.
```

**Step 2.2, the score audit.**

Before synthesis, the operator audits the scores. The check is on consistency, not on each team's verdict.

```text
SYSTEM: You audit a set of team scores for consistency against
the shared rubric. You flag teams that are scoring loosely (high
scores with vague evidence) and teams scoring strictly (low
scores with strong evidence). You do not change scores, you
recommend conversations.

USER:
Scoring rubric:
{PASTE_RUBRIC}

All team JSONs from Phase 2.1:
{PASTE_ALL_TEAM_JSONS}

Return JSON:
{
  "loose_scorers": [
    {"team": "<name>", "evidence": "<one sentence>", "recommended_conversation": "<one sentence>"}
  ],
  "strict_scorers": [
    {"team": "<name>", "evidence": "<one sentence>", "recommended_conversation": "<one sentence>"}
  ],
  "overall_consistency_score": <0.0-1.0>,
  "consistency_recommendation": "<one sentence on whether the synthesis can proceed or needs a rubric conversation first>"
}

Rules:
- Loose: scores 0.8+ on objectives whose key result actuals are
  vague or unnamed.
- Strict: scores under 0.5 on objectives whose key result actuals
  show clear progress to a downscoped version.
- consistency_score under 0.6 means the synthesis should pause
  for a rubric reset with the team leads.
```

### Phase 3, cross-team synthesis

The team JSONs collapse into one view of the quarter.

**Step 3.1, the cross-team synthesis prompt.**

```text
SYSTEM: You synthesise quarterly OKR results across multiple
teams into a single view of the organisation's quarter. You
surface what worked across teams, what missed, what blocked
multiple teams, and what the cross-cutting risks are.

USER:
All team JSONs:
{PASTE_ALL_TEAMS}

Last quarter's synthesis (for continuity):
{PASTE_LAST_QUARTER}

Return JSON:
{
  "org_average_score": <0.0-1.0>,
  "objectives_hit": <int>,
  "objectives_missed": <int>,
  "objectives_in_progress": <int>,
  "top_3_wins": [
    {"team": "<name>", "win": "<one sentence>", "evidence": "<numbers or named outcome>"}
  ],
  "top_3_misses": [
    {"team": "<name>", "miss": "<one sentence>", "lesson": "<what to do differently>"}
  ],
  "cross_cutting_blockers": [
    {"blocker": "<one sentence>", "teams_affected": ["<list>"], "recommended_action": "<one sentence>"}
  ],
  "risks_into_next_quarter": [
    {"risk": "<one sentence>", "owner": "<team or role>", "mitigation": "<one sentence>"}
  ],
  "asks_consolidated": [
    {"ask": "<one sentence>", "from_team": "<name>", "to": "<CEO | another team | external>"}
  ],
  "theme_of_the_quarter": "<one sentence naming the dominant narrative across teams>"
}

Rules:
- top_3 lists are capped at 3.
- A win or miss must have evidence (numbers, named outcome) to
  qualify.
- theme_of_the_quarter is the single sentence the CEO or board
  reads first.
- Return JSON only.
```

### Phase 4, narrative drafts

The synthesis JSON becomes the four shapes.

**Step 4.1, the CEO summary prompt.**

```text
SYSTEM: You write the CEO quarterly summary from the cross-team
synthesis JSON. You write direct, name the risks, name the asks.
The CEO reads this once and acts.

USER:
Cross-team synthesis JSON:
{PASTE_SYNTHESIS}

CEO voice register (formal but direct):
{PASTE_VOICE}

Length target: 600-1000 words.

Return Markdown:

# Q{Q} synthesis, CEO summary

## Theme
{ONE PARAGRAPH ON THE THEME, NAMED EXPLICITLY}

## Where the quarter landed
{ONE PARAGRAPH, NUMBERS, OBJECTIVES HIT / MISSED / IN PROGRESS}

## Top wins
{LIST OF 3, EACH WITH A NAMED TEAM AND EVIDENCE}

## Top misses
{LIST OF 3, EACH WITH A NAMED TEAM AND LESSON}

## Cross-cutting blockers
{LIST OF UP TO 3, EACH WITH TEAMS AFFECTED AND RECOMMENDED ACTION}

## Risks into next quarter
{LIST OF UP TO 3, EACH WITH OWNER AND MITIGATION}

## What I am asking you to do
{NUMBERED LIST OF ASKS TO THE CEO, EACH CONCRETE}

Rules:
- Length within 10 percent of target.
- No padding. No exclamation marks. No hype words.
- Active voice.
- The "what I am asking you to do" section is concrete or "no
  ask this quarter".
- No em dashes.
```

**Step 4.2, the board pack section prompt.**

```text
SYSTEM: You write the board pack section from the cross-team
synthesis JSON. You frame against year-on-year and against the
quarter target. The board reads this in 3 minutes and brings 1-2
questions to the meeting.

USER:
Cross-team synthesis JSON:
{PASTE_SYNTHESIS}

Quarter target context (commit, achieved, gap):
{PASTE_TARGETS}

Year-on-year context (same quarter last year):
{PASTE_YOY}

Board voice register (formal, concise):
{PASTE_BOARD_VOICE}

Length target: 400-700 words.

Return Markdown:

# Q{Q} board summary

## Quarter against plan
{ONE PARAGRAPH ON COMMIT VS ACHIEVED, NUMBERS NAMED}

## Year-on-year
{ONE PARAGRAPH COMPARING TO Q{Q-1} LAST YEAR}

## What worked
{2-3 BULLETS, NAMED TEAMS AND EVIDENCE}

## What did not
{1-2 BULLETS, NAMED TEAMS AND LESSON}

## Risks into Q{Q+1}
{1-3 BULLETS, NAMED OWNERS}

## Board ask
{ONE SENTENCE OR 'NONE THIS QUARTER'}

Rules:
- Length within 10 percent of target.
- Formal register.
- Numbers in every claim.
- The board ask is one thing. Two means split the ask.
```

**Step 4.3, the all-hands narrative prompt.**

```text
SYSTEM: You write the all-hands narrative from the cross-team
synthesis JSON. You celebrate the wins honestly, name the misses
without blame, and frame what is coming next at a level the whole
company can engage with.

USER:
Cross-team synthesis JSON:
{PASTE_SYNTHESIS}

Brand voice profile (internal employee tone, looser than the
external brand voice):
{PASTE_INTERNAL_VOICE}

Length target: 500-800 words.

Return Markdown:

# Q{Q} all-hands narrative

## The theme
{ONE PARAGRAPH ON THE THEME}

## What we shipped
{ONE PARAGRAPH NAMING THE TOP 3 WINS WITH NAMED TEAMS AND PEOPLE}

## What we learned
{ONE PARAGRAPH NAMING THE TOP 3 MISSES AND WHAT WE WILL DO
DIFFERENTLY}

## What is next
{ONE PARAGRAPH ON Q{Q+1} AT THE LEVEL THE WHOLE COMPANY CAN ENGAGE
WITH}

## Thanks
{ONE PARAGRAPH NAMING PEOPLE AND TEAMS BY NAME}

Rules:
- Internal voice register (looser than brand voice).
- People named by name in wins and thanks.
- No name-shaming in misses (team named, individuals not).
- No em dashes. No hype words past honest celebration.
```

**Step 4.4, the function-leads digest.**

A separate version for function heads that surfaces cross-functional dependencies, hand-overs and asks between teams. Same source JSON, longer length, more granular. Less commonly used, ship it when the org has 5+ functions and cross-functional friction is real.

## Worked example, end-to-end

Cascadia Endurance Q3. Beth Lyons runs the synthesis. Five teams reporting: brand and content (Beth), demand and channels (Saoirse), product and design (Marcus + product contractor), customer and CX (Eve, customer ops), wholesale and partnerships (Joel, sales coordinator turned junior wholesale lead).

**Phase 2.1 output, team JSONs (excerpt for demand and channels).**

```json
{
  "team": "Demand and channels",
  "lead": "Saoirse Burns",
  "objectives": [
    {
      "objective": "Hit £380k closed-won wholesale and partnership revenue.",
      "key_results": [
        {
          "key_result": "£380k closed-won by Q3 end.",
          "target": "£380k",
          "actual": "£412k",
          "score": 1.0,
          "score_rationale": "Closed-won landed at £412k, exceeding target."
        }
      ],
      "objective_score": 1.0,
      "narrative": "The pipeline rollup discipline plus the Aros AW27 deal landing in week 11 carried the quarter past target. The Trail Club Manchester partnership opened as new pipeline that will land in Q4."
    },
    {
      "objective": "Lift paid social ROAS to 3.2.",
      "key_results": [
        {
          "key_result": "Average ROAS across paid social to 3.2.",
          "target": "3.2",
          "actual": "3.1",
          "score": 0.85,
          "score_rationale": "Landed at 3.1 against 3.2 target. Channel-mix simulator drove the lift but the autumn flight under-converted."
        }
      ],
      "objective_score": 0.85,
      "narrative": "The lift came from the spring shoe push. The autumn flight ran cooler than expected, partly attribution shift, partly weather."
    }
  ],
  "blockers": ["Foundry retainer renewal stalled 27 days, slowed creative output mid-quarter."],
  "risks_into_next_quarter": ["Vahla Storm Shell launch concentration risk, single-product reliance."],
  "asks": ["CEO call to Aros wholesale to lock the AW27 deal commercial."],
  "wins_to_celebrate": ["Aros AW27 deal at £48k, the biggest single wholesale deal of the year."],
  "lessons": ["The channel-mix simulator works at scale, run it twice per quarter instead of once."],
  "team_average_score": 0.93
}
```

**Phase 3 output, cross-team synthesis (excerpt).**

```json
{
  "org_average_score": 0.81,
  "objectives_hit": 8,
  "objectives_missed": 2,
  "objectives_in_progress": 3,
  "top_3_wins": [
    {"team": "Demand and channels", "win": "Wholesale revenue exceeded target by 8 percent.", "evidence": "£412k against £380k target."},
    {"team": "Brand and content", "win": "UTMB recap reel beat saves target by 47 percent.", "evidence": "8,800 saves against 6,000 target."},
    {"team": "Customer and CX", "win": "Claim-handler CSAT lifted from 3.8 to 4.5.", "evidence": "Quarterly CSAT survey."}
  ],
  "top_3_misses": [
    {"team": "Product and design", "miss": "Storm Shell launch slipped from 8 September to 22 September.", "lesson": "Lock asset list at brief stage, not at agency review stage."},
    {"team": "Demand and channels", "miss": "Paid social ROAS landed at 3.1 against 3.2.", "lesson": "Run the channel-mix simulator twice per quarter."}
  ],
  "cross_cutting_blockers": [
    {"blocker": "Foundry retainer renewal stall slowed creative output across two teams.", "teams_affected": ["Brand and content", "Demand and channels"], "recommended_action": "Lock the renewal scope by end of Q3 week 1."}
  ],
  "risks_into_next_quarter": [
    {"risk": "Vahla Storm Shell launch concentration risk.", "owner": "Marcus Hale", "mitigation": "Two-track launch with a smaller secondary product in week 4."}
  ],
  "asks_consolidated": [
    {"ask": "CEO call to Aros to lock the AW27 commercial.", "from_team": "Demand and channels", "to": "CEO"}
  ],
  "theme_of_the_quarter": "The pipeline disciplines (rollup, channel-mix, content recap) are doing the heavy lifting, the product roadmap concentration is the open risk."
}
```

**Phase 4.1 output, the CEO summary.**

```text
# Q3 synthesis, CEO summary

## Theme
The pipeline disciplines are doing the heavy lifting. Wholesale revenue
exceeded target by 8 percent, the content recap engine cleared its
metric by 47 percent, customer CSAT lifted materially. The open risk
is product roadmap concentration. The Storm Shell launch slipped two
weeks and now anchors Q4 by itself.

## Where the quarter landed
Org average score landed at 0.81 across 13 objectives. 8 hit, 2 missed,
3 in progress (these are the Q4 carry-overs). The two misses were the
Storm Shell launch slip and paid social ROAS landing one tenth shy of
the 3.2 target.

## Top wins
1. Demand and channels exceeded wholesale target. £412k closed-won
   against £380k. The Aros AW27 deal at £48k carried the last two
   weeks.
2. Brand and content cleared UTMB recap saves target by 47 percent.
   8,800 saves against 6,000 target.
3. Customer and CX lifted claim-handler CSAT from 3.8 to 4.5.

## Top misses
1. Product and design slipped the Storm Shell launch from 8 to 22
   September. Lesson, lock the asset list at brief stage, not at
   agency review.
2. Demand and channels landed paid social ROAS at 3.1 against 3.2.
   Lesson, run the channel-mix simulator twice per quarter.

## Cross-cutting blockers
1. Foundry retainer renewal stalled 27 days, slowed creative output
   across brand and demand. Action, lock renewal scope week 1 of Q4.

## Risks into next quarter
1. Vahla Storm Shell launch concentration. Owner, Marcus. Mitigation,
   a two-track launch with a smaller secondary product in week 4.

## What I am asking you to do
1. Call Aros directly to lock the AW27 commercial before next Tuesday.
2. Sign off the Foundry retainer scope week 1 of Q4.
```

Marcus reads it Friday afternoon. Calls Aros Tuesday morning, the AW27 deal closes. Foundry scope locked the following Wednesday. The board pack section ships into the October board pack with a single line edit from the chair.

## Try it yourself

Three exercises, each under 60 minutes.

### Exercise 1, score one team's report against the rubric

Take a team's quarterly status report. Score each objective by hand against the 0 to 1 rubric. Then run the ingestion prompt on the same report. Compare. Where the prompt scores higher than you, the rubric needs a tighter "loose" threshold. Where lower, the prompt is over-conservative.

### Exercise 2, run the consistency audit on three teams

Take three teams' JSONs. Run the consistency audit. Read the loose-scorers and strict-scorers lists. The exercise is whether you would have spotted the inconsistencies by hand. If yes, the audit is working. If you spot something the audit missed, tighten the prompt.

### Exercise 3, write the CEO summary using the pipeline

Take last quarter's data and run the full pipeline through to the CEO summary. Compare to the summary you actually shipped (or would have written). Where the pipeline is sharper, that is your time saving. Where it misses context, the prompt needs tuning.

## The eval gates

**Eval 1, scoring consistency.** The audit prompt's `overall_consistency_score` is at 0.7 or above before synthesis runs. Below 0.6 means the rubric conversation has to happen before the synthesis ships.

**Eval 2, narrative honesty.** Sample the CEO summary. Every claim has a number or a named outcome. Claims like "the team performed well" are pipeline failures. Below 90 percent numbered claims, the synthesis is padding.

**Eval 3, ask quality.** The "what I am asking you to do" section has concrete asks (date, action, named recipient). "Have eyes on this" is not an ask. "Call Aros Tuesday" is.

**Eval 4, time to ship.** From all status reports in hand to CEO summary delivered, under 4 hours. If it is taking longer, the bottleneck is usually the ingestion (reports are unstructured, normalisation is slow) or the rubric (teams scoring loosely, audit pausing).

## The failure modes

**Loose scoring inflates the org score.** A 0.92 org average with 60 percent qualitative narrative is the classic AI-marketing failure. The audit prompt catches this. The discipline is acting on its output.

**The CEO summary becomes a status report.** A summary that lists every team's work in equal weight reads as a report, not a synthesis. Hold the top-3 lists hard. The CEO needs the 3 most consequential wins and the 3 most consequential misses, not all 11.

**The board ask drifts.** "There are several things the board could consider" is not an ask. One ask, named. Two means split across quarters.

**Internal voice leaks into the board pack.** The all-hands narrative uses internal voice, the board pack uses board voice. If they read the same, the board pack is too informal. Hold the voice profiles separately.

**Names get scrubbed.** Privacy worry leads to "the team did X" instead of "Joel led X". Names are the credit and the accountability. Hold them.

## The pattern in practice

**Scale-stage B2C, the trust unlock.** A founder used to spend the first three weeks of every new quarter trying to figure out what actually happened in the last one. The pipeline cuts that to an afternoon read. Decision velocity into the next quarter rises measurably.

**Enterprise marketing function, the board-pack discipline.** A CMO presenting to a board with three consumer-side investors and two operator investors. The board pack section, framed against year-on-year and quarter-on-quarter, ends up moving the conversation from "what did marketing do?" to "what should marketing do next?". The synthesis is doing the framing work.

**Scale-stage SaaS, the consistency unlock.** Three teams (sales, marketing, customer success) that have historically scored OKRs differently. The shared rubric plus the audit pass produces the first quarter where the three teams' scores are honestly comparable. The cross-team blockers get named because the rubric is consistent enough to see them.

## Hand-off

Once the synthesis is shipping quarterly, the work feeds:
- **quarterly-planning-ritual**, where the synthesis feeds Day 1 data extraction directly
- **weekly-pipeline-rollup**, where the 13 weeks of rollups feed the synthesis automatically
- **personal-knowledge-base**, where every synthesis archives the year's institutional memory
- **document-drafting-partner**, where the next board pack section is drafted in the right voice from the same source
