---
title: "Channel-mix simulator with reach-curve fitting"
stack: demand
description: "Given a budget, a target customer cost and the last twelve months of channel data, simulate twenty allocation scenarios with diminishing-return curves fitted to each channel."
outputs: "Allocation deck with 3 recommended scenarios and the maths behind them"
readMin: 14
shipTime: "2 working days"
brandStage: ["growth", "scale", "enterprise"]
channels: ["paid-search", "paid-social", "seo", "analytics"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-04-05
status: live
preview: true
---

## The brief

Every quarter the CFO asks the same question. If we move £100k from paid social into SEO content, what happens? The honest answer requires modelling the diminishing-return curves on each channel, factoring in saturation, the lag on organic, and the variance band on the answer.

The dishonest answer, "depends on what you do with it", is what most marketing teams give, and it is why marketing keeps losing budget arguments to operations and product.

This playbook is the modelling work, done properly, in two days. It fits diminishing-return curves to each of your active channels using the last 12 months of weekly data, then simulates 20 allocation scenarios with confidence intervals on each. You walk into the budget meeting with three defensible options and the maths behind them, rather than a vibe.

This is a lighter, faster, channel-mix-simulator built for the weekly-budget conversation rather than the annual one. MMM is bigger work that needs 18+ months of data and a lot of econometric care.

## The pipeline

Five phases.

**Phase 1, data shape.** Pull weekly spend, weekly conversions and weekly cost-per-action for each active paid channel from the last 12 months. For organic channels (SEO, owned), use weekly clicks/sessions and conversions. Normalise into a long-format table, `channel, week, spend, output, cost`. The model needs structured input rather than screenshots.

**Phase 2, curve fitting.** For each channel, fit a Hill function (saturation curve) to the spend-output pairs. Three parameters per channel covering half-saturation point, max output, current operating point. The Hill function is a good fit for most performance channels because it captures the diminishing-return behaviour humans intuit but rarely quantify.

**Phase 3, cross-channel adjustment.** Apply assumed cross-channel multipliers (brand drives search, paid social warms email, etc). These are bounded assumptions rather than derived. The pipeline asks you to set them explicitly with high/low estimates and uses both bounds in the scenarios. A default starter set drawn from MMM literature ships with the playbook.

**Phase 4, scenario simulation.** Run 20 allocations across the curves. Five are anchored to the current allocation (±10%, ±20% on the two biggest channels). Ten are stress-tests (pulled to a single channel, equal split, founder's gut split). Five are pipeline-suggested optimal allocations under different objective functions (max output, min CAC, max output with floor on each channel).

**Phase 5, recommendation synthesis.** Pull three scenarios into the deck. The "best mathematical" allocation, the "best with strategic floors" allocation (e.g. don't pull SEO below £X because the lag bites a year out), and the "current ±15%" reality-check. Each ships with the projected output, the confidence band, and the assumptions stack that produced it.

## The prompts

The model isn't doing the maths. Python is. The model is doing two narrow jobs, parsing the data spec into the right shape, and writing the recommendation rationale once the numbers settle.

The rationale prompt is the one worth shipping in plain form.

```text
SYSTEM: You are a marketing analytics lead briefing a CFO on a budget
allocation. You explain the model's recommendation in plain language. You
cite the actual numbers. You do not hedge. You name the assumption you
are most uncertain about and what would change if it's wrong.

USER:
Scenario name: {SCENARIO_NAME}
Recommended allocation:
{ALLOCATION_TABLE_JSON}

Projected output (90 days):
{PROJECTION_JSON}

Confidence band (10th–90th percentile):
{BANDS_JSON}

Top three assumptions driving this allocation:
{ASSUMPTIONS_LIST}

Most fragile assumption (sensitivity > X%):
{FRAGILE_ASSUMPTION}

Current allocation, for contrast:
{CURRENT_ALLOCATION_JSON}

Write a 4-paragraph briefing:

1. The recommendation, in one sentence. "Move £X from {from} to {to}."
   Then the projected delta in conversions and the confidence range.

2. Why this allocation. Cite the curve fits — which channels are
   saturated, which have headroom, which lag.

3. The biggest assumption this depends on. Name it. Quantify how
   sensitive the output is to that assumption being wrong.

4. The check-back metric. Which week-1 or week-2 leading indicator
   tells you whether the allocation is working before the quarter
   closes.

Rules:
- Use £ amounts, not percentages alone.
- Cite the actual curve parameters where relevant.
- No "depending on" hedging. State the answer, then the conditions.
- No more than 4 paragraphs.
```

The curve-fitting math is straightforward (`scipy.optimize.curve_fit` against a Hill function) and shipped as a Python notebook in the playbook download.

## The eval harness

The pipeline is gated against four failure modes.

**Eval 1, curve fit quality.** For each channel, the fitted Hill function's R² against the historical data must exceed 0.6. Below that, the channel doesn't have a clean diminishing-return shape, either there's not enough data, the channel was disrupted (creative change, audience swap), or the channel just doesn't behave that way. The pipeline flags these channels and excludes them from the scenario set (or uses a flat-rate linear assumption with explicit warning).

**Eval 2, back-test.** Take the last 8 weeks of actual data, hide it from the model, and ask the model to predict it from the prior 44 weeks. Mean Absolute Percentage Error (MAPE) against the actuals should be under 25%. Higher than that and the predictions aren't trustworthy, usually because the brand made a big creative or strategy shift in the period.

**Eval 3, assumption sensitivity.** For each of the three recommended scenarios, vary each assumption by ±25% and re-run. If any single assumption swings the projected output by more than 20%, that assumption is fragile and gets flagged in the rationale.

**Eval 4, recommendation realism.** The pipeline-suggested optimal allocation often wants to zero out small channels. A floor is forced, so no channel can be cut below 60% of its 12-month average in a single quarter without explicit override. This saves the simulator from suggesting "kill SEO" allocations that ignore the multi-quarter lag.

## The failure modes

**Saturation isn't real on every channel.** Some channels (especially long-tail SEO, organic content) don't saturate in the data you have because you've never spent enough to find the ceiling. The Hill fit will still produce a curve, but it is extrapolating beyond what the data supports. The pipeline labels these "headroom unknown" and the recommendation language treats them as upside rather than a target.

**Cross-channel multipliers are guesses.** The default multipliers shipped are from MMM literature. They're better than nothing and worse than your own MMM. If you have a recent MMM, override the defaults with your actual lifts. If you don't, run two scenarios, one with the defaults at high estimate, one at low, and present both as the band.

**Lag isn't priced in for SEO.** Cutting SEO budget shows up in conversions 6 to 12 months later. A 90-day projection won't see the damage. The pipeline applies a strategic floor on SEO by default (60% of trailing average) and flags the recommendation explicitly when SEO is touched. This is a guardrail rather than a model, because the model can't see that far forward.

**The brand has a tiny number of channels.** Three-channel brands don't have enough degrees of freedom to make the curves interesting. The pipeline still runs, but the scenarios collapse to "spend more here / spend less there" with no real surprise. Pre-launch and early-growth brands sometimes get more value from the curve-fitting diagnostic ("you're saturating Meta") than from the allocation recommendation.

**Outliers from Black Friday and similar.** A single high-week skews the fit. The pipeline detects weeks that are >2.5 standard deviations from the trailing mean and prompts you to either flag them as planned (so they're modelled separately) or include them with a smoothing weight. Default is to flag them and exclude from curve-fitting, then add back as ad-hoc events in the scenario.

## The pattern in practice

Illustrative scenarios that show common shapes the simulator surfaces. Specifics are illustrative and the patterns repeat.

**D2C apparel, growth-stage, the saturation catch.** A brand about to triple Meta spend on the back of a strong quarter. The simulator shows Meta is already 80% of the way up its saturation curve. The recommendation is to take a meaningful slice of the planned increase and put it into a partner-PR push that has only ever run at a small spend (where the curve still has room). The split usually outperforms the original plan because the partner channel has a curve to climb for the following quarters.

**B2B SaaS, scale-stage, the SEO floor.** A CFO wants to cut SEO spend in half because "we can't see what it's doing." The simulator shows the brand is in the steep part of the SEO curve and the lag on cuts lands roughly nine months out, sometimes coinciding with a planned product launch. The honest recommendation is a modest increase and reallocate within SEO from low-intent informational pages to high-intent commercial ones. The launch then lands into a strong organic quarter rather than a quietly-decaying one.

**Fintech, the email-asset failure.** An early simulator version without the strategic floor on email lifecycle recommends cutting email spend by 60%. If acted on, the database decays enough that re-warming takes a year. This is why the current version applies a strategic floor on any channel with an audience-asset (email list, SEO authority, brand recall), because the model is good at the maths but blind to the asset-decay lag.
