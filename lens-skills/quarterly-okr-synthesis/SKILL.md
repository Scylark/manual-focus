---
name: quarterly-okr-synthesis
description: "When the user wants to synthesise quarterly OKRs across teams, write a CEO summary, draft a board pack section, an all-hands quarterly narrative, or normalise team status reports into one view. Triggers on 'quarterly synthesis', 'CEO summary', 'board pack section', 'all-hands narrative', 'wrap up the quarter', 'OKR rollup', or pasting multiple team status reports."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/productivity/quarterly-okr-synthesis
---

# Quarterly OKR synthesis

You read team status reports, normalise them against a shared rubric, surface the cross-team narrative, and produce the four downstream shapes: CEO summary, board pack section, all-hands narrative, function-leads digest.

## Inputs to gather first

1. **Team OKRs** — each team's quarterly OKR document
2. **Team status reports** — free-form is fine, the ingestion prompt normalises
3. **Scoring rubric** — the 0-1 rubric defined below
4. **Brand voice profile** — for the CEO summary
5. **Board voice profile** — typically more formal than CEO voice
6. **Internal voice profile** — for the all-hands, looser than external brand voice
7. **Quarter targets** — commit, achieved, gap
8. **Year-on-year context** — same quarter last year, for the board section
9. **Last quarter's synthesis** if it exists, for continuity

If team leads have not produced status reports, do not synthesise. Recommend the team-status-report ritual as the prerequisite.

## The pipeline (four phases)

### Phase 1 — Synthesis spec

Four shapes:
- **CEO summary** — 600-1000 words, direct, named risks, named asks
- **Board pack section** — 400-700 words, formal, year-on-year framing
- **All-hands narrative** — 500-800 words, celebratory but honest, names people
- **Function-leads digest** — 800-1500 words, cross-functional dependencies

Default scoring rubric:
- **1.0** — hit or exceeded original KR. Numbers ratify.
- **0.7-0.9** — substantially achieved. Hit downscoped version or close enough.
- **0.5-0.6** — real progress but not the outcome. Useful learning.
- **0.3-0.4** — limited progress. The bet did not work.
- **0.0-0.2** — no movement. Wrong objective, deprioritised, or impossible.

### Phase 2 — Ingestion

For each team, return JSON with `team`, `lead`, `objectives` (each with `objective`, `key_results` with target / actual / score / score_rationale, `objective_score`, `narrative`), `blockers`, `risks_into_next_quarter`, `asks`, `wins_to_celebrate`, `lessons`, `team_average_score`.

Rules:
- Score conservatively when the report is vague.
- Anchor every score to a target / actual pair.
- Flag if `team_average_score` > 0.85 with vague phrases. Score honesty suspect.
- Lessons must be concrete, not abstract.

Then run a consistency audit. Return `loose_scorers`, `strict_scorers`, `overall_consistency_score`, `consistency_recommendation`. If `overall_consistency_score` is under 0.6, pause synthesis and recommend a rubric conversation with team leads.

### Phase 3 — Cross-team synthesis

Return JSON with `org_average_score`, `objectives_hit`, `objectives_missed`, `objectives_in_progress`, `top_3_wins`, `top_3_misses`, `cross_cutting_blockers`, `risks_into_next_quarter`, `asks_consolidated`, `theme_of_the_quarter`.

Rules:
- `top_3` lists are capped at 3.
- Every win or miss has evidence (numbers, named outcome) to qualify.
- `theme_of_the_quarter` is the single sentence the CEO reads first.

### Phase 4 — Narrative drafts

Generate the four shapes. Each follows the structure laid out in the playbook with the appropriate voice profile.

CEO summary structure: theme, where the quarter landed, top wins, top misses, cross-cutting blockers, risks into next quarter, what I am asking you to do.

Board pack structure: quarter against plan, year-on-year, what worked, what did not, risks, board ask.

All-hands structure: the theme, what we shipped, what we learned, what is next, thanks.

Function-leads digest structure: cross-functional dependencies, handovers, blockers, asks.

Rules for all four:
- No em dashes. No prose colons or semicolons. No hype words. No exclamation marks.
- Length within 10 percent of target.
- Active voice.
- Names in wins and thanks. No individual names in misses (team only).
- Asks are concrete, named, with deadlines.
- "Nothing this quarter" instead of padding when a section is empty.

## Output

Four Markdown documents, one per shape. Save to `.lens/synthesis/Q{Q}-{shape}.md`.

## Evals

Before delivering:

- **Scoring consistency** — `overall_consistency_score` at 0.7 or above.
- **Narrative honesty** — every claim names a number or a named outcome. No "performed well".
- **Ask quality** — concrete, answerable, with a date.
- **Voice fidelity** per shape — CEO direct, board formal, all-hands looser.
- **Length adherence** — within 10 percent per shape.

## Failure modes to watch

- **Loose scoring inflation** — act on the audit's `loose_scorers` output.
- **CEO summary becomes a report** — hold the top-3 caps. Three biggest, not all.
- **Board ask drift** — one ask. Two means split across quarters.
- **Voice leakage** — all-hands voice in the board pack is too informal. Hold profiles separate.
- **Names scrubbed** — names give credit and accountability. Hold them in wins and thanks. Withhold individual names in misses.

## Hand-off

- Synthesis feeds **quarterly-planning-ritual** Day 1.
- Weekly **weekly-pipeline-rollup** archives feed the synthesis automatically.
- Synthesis archives become **personal-knowledge-base** entries.
- Drafts route through **document-drafting-partner** for revisions.

Save the four shapes to `.lens/synthesis/Q{Q}-{shape}.md`.
