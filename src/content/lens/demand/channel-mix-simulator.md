---
title: "Channel-mix simulator with reach-curve fitting"
stack: demand
description: "Fit diminishing-return curves to each channel from twelve months of weekly data, simulate twenty allocations, walk into the budget meeting with three defensible options."
outputs: "Curve-fit per channel, 20-scenario simulation, three recommended allocations with rationale"
readMin: 22
shipTime: "2 working days"
brandStage: ["growth", "scale", "enterprise"]
channels: ["paid-search", "paid-social", "seo", "analytics"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-04-05
status: live
preview: true
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts:

1. A **long-format channel data sheet** with twelve months of weekly spend, output and cost per action for every active channel, normalised and ready for curve fitting.
2. A **set of fitted Hill curves**, one per channel, with three parameters each (half-saturation point, max output, current operating point) and the R-squared score that tells you whether the fit is trustworthy.
3. A **twenty-scenario allocation simulation** covering current allocation, plus or minus bands, stress-test allocations and pipeline-optimal allocations under three objective functions.
4. **Three recommended allocations**, the best mathematical, the best with strategic floors, and the current plus or minus 15 reality check, each with a 90-day projection, a confidence band and the most fragile assumption.
5. A **CFO briefing** of four paragraphs per recommendation, written in plain language, with the actual numbers and the assumption that would change the answer if it is wrong.

## Who this is for

A growth or scale-stage brand running three or more paid channels plus at least one organic owned channel, with an analyst on the team who can pull weekly performance data from each platform and a CFO who will read a four-paragraph briefing. If the brand has fewer than three channels or under nine months of weekly data, the simulator runs but the scenarios collapse to "spend more here, less there" with no surprise.

## Before you start

- [ ] Twelve months of weekly spend per channel from Google Ads, Meta Ads Manager and any other active paid platform (CSV exports)
- [ ] Twelve months of weekly conversions per channel from GA4, the platform pixel or your CRM, whichever is the brand's reporting standard
- [ ] Weekly clicks and conversions from GSC for SEO as the spend proxy
- [ ] Weekly sessions and conversions from your email platform (Klaviyo, HubSpot, Iterable) tied to UTM-tagged sends
- [ ] Margin and contribution data per channel if you want margin-weighted output (optional, but useful)
- [ ] Python with scipy installed, or Google Sheets with the SOLVER add-on, for the curve fitting
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode for the recommendation rationale
- [ ] One hour of the CFO's time, booked, before the simulator runs

If three or more channels are missing data for the full twelve months, fit on what you have and explicitly flag the channels with sparse data as "extrapolation territory" in the output.

## The pipeline

Five phases. End-to-end in two working days if the data is clean.

### Phase 1, data shape

The model and the curve-fit code both need structured input. The shape is one row per channel per week.

**Step 1.1, download the allocation template.**

Grab [channel-mix-allocation.csv](/lens/templates/channel-mix-allocation.csv). It has columns for channel, week, spend, conversions, cost per conversion, a saturation estimate field and notes. Eight standard channels are pre-filled. Open in Sheets or Excel.

**Step 1.2, export and paste the channel data.**

The exports you need:

1. **Google Ads.** Reports, then Predefined reports, then Time, then Weekly. Choose campaign group, spend and conversions. Set the date range to the last 53 weeks. Export CSV.
2. **Meta Ads Manager.** Set the date range to the last 53 weeks. Reports, then Export table data, with breakdown by week. Pick spend and conversion events.
3. **GSC.** Performance, then Search results, dimension Date with weekly grouping. Export CSV for clicks and conversions (if you have GSC conversions linked from GA4).
4. **Klaviyo or HubSpot.** Find the campaign performance report by audience segment, with weekly aggregation. Export.
5. **GA4.** Reports, then Acquisition, then User acquisition, with primary dimension Default channel group, secondary dimension Week of year, and conversions as the metric.

Paste each channel's weekly data into the right rows of the template. The shape stays one row per channel per week.

**Step 1.3, build a custom template if your channel mix differs.**

If your channels do not match the standard eight, ask Claude to generate a custom template.

```text
SYSTEM: You generate a channel-mix simulator data template for a
specific brand based on their actual channel mix. The template is
long-format, one row per channel per week, for 52 weeks.

USER:
My active paid channels: {LIST_PAID_CHANNELS}
My organic owned channels: {LIST_ORGANIC_CHANNELS}
My partnered channels (affiliate, retail, events): {LIST_PARTNERED_CHANNELS}

Generate a CSV template with columns:
Channel, Week, Spend_GBP, Conversions, Cost_per_conversion,
Saturation_estimate_0_to_1, Notes

Pre-fill the Channel column with my channels and the Week column
with W01 through W52. Leave the metric columns empty.

For channels with no direct spend (SEO, email), set Spend_GBP to the
team time plus ops cost proxy in notes.

Return the CSV directly, no commentary.
```

You should now have a populated long-format CSV ready for curve fitting.

### Phase 2, curve fitting

Hill functions are the standard fit for diminishing-return curves in performance channels. Three parameters per channel.

**Step 2.1, run the curve-fit code.**

The Python snippet uses scipy.optimize.curve_fit. The Hill function shape is `output = max_output * (spend^n) / (k^n + spend^n)`, where k is the half-saturation point and n is the steepness. Defaults for n start at 1.5 and the fit refines from there.

In Sheets, the same fit runs with SOLVER. Set up the curve as a formula in a column, set the objective as minimise the sum-of-squared-residuals against your conversions column, let it solve for max_output, k and n.

**Step 2.2, read the R-squared per channel.**

A clean fit lands at R-squared above 0.6. Below that, the channel does not have a clean diminishing-return shape and gets flagged. Common reasons are insufficient data, a creative or audience swap in the period, or the channel genuinely behaving linearly.

**Step 2.3, identify the current operating point.**

For each channel, where is the current weekly spend on the curve? Channels near the saturation knee have lots of headroom to come down without much output loss. Channels well into the saturation plateau are bleeding budget. Channels well below the half-saturation point have headroom to invest.

You should now have a fitted curve per channel and a clear read on which channels are saturated, which have headroom and which the model cannot fit cleanly.

### Phase 3, cross-channel adjustment

Channels do not operate independently. Paid social drives branded search. Display feeds email signups. The cross-channel multipliers are bounded guesses.

**Step 3.1, set the multipliers.**

Default starter multipliers from MMM literature:

- Paid social to branded search lift, 8 to 15% of paid social spend bleeds into branded search demand at lag 1 to 2 weeks
- Display to direct, 5 to 10% of display spend creates direct traffic at lag 1 week
- Paid social to email signup, 3 to 7% of paid social impressions yield email signups within 30 days
- SEO to brand recall, lagged effect at 6 to 12 months, untracked at the weekly level

**Step 3.2, override with the brand's own data if available.**

If the brand has run an MMM in the last 18 months, override the defaults with the brand's actual lifts. If not, run the simulator twice, once with the multipliers at the high end and once at the low end, and present both as the band.

You should now have a cross-channel adjustment table ready to layer onto the scenarios.

### Phase 4, scenario simulation

Twenty allocations. Five anchored to current, ten stress tests, five pipeline-suggested optimal.

**Step 4.1, define the scenario set.**

The standard twenty:

| Scenario set | Count | Description |
|---|---|---|
| Anchored to current | 5 | Current, plus or minus 10% and 20% on the two biggest channels |
| Stress tests | 10 | All-in on each channel one at a time, equal split, founder's gut split, kill smallest channel, double largest |
| Pipeline-optimal | 5 | Max output, min CAC, max output with floors, max margin (if margin data), max output capped at current total spend |

**Step 4.2, simulate each allocation.**

For each scenario, apply the budget split to each channel's curve, compute the projected output, then apply the cross-channel multipliers. Repeat with both ends of the multiplier band to produce a confidence range.

**Step 4.3, flag the fragile scenarios.**

Sensitivity check, vary each assumption by plus or minus 25% and re-run. If a single assumption swings the projected output by more than 20%, that assumption is fragile and the scenario carries the flag in the recommendation.

You should now have twenty scenarios each with projected output, confidence band and assumption sensitivity.

### Phase 5, recommendation synthesis

Three scenarios into the deck. The CFO reads four paragraphs and signs off.

**Step 5.1, pick the three.**

The three are usually best mathematical, best with strategic floors, and current plus or minus 15 reality check. Strategic floors are the no-go zones, do not pull SEO below 60% of the trailing average because the lag bites a year out, do not pull email below the current spend because the database decays.

**Step 5.2, run the rationale prompt.**

```text
SYSTEM: You are a marketing analytics lead briefing a CFO on a budget
allocation. You explain the model's recommendation in plain language.
You cite the actual numbers. You do not hedge. You name the assumption
you are most uncertain about and what would change if it is wrong.

USER:
Scenario name: {SCENARIO_NAME}
Recommended allocation:
{ALLOCATION_TABLE_JSON}

Projected output (90 days):
{PROJECTION_JSON}

Confidence band (10th to 90th percentile):
{BANDS_JSON}

Top three assumptions driving this allocation:
{ASSUMPTIONS_LIST}

Most fragile assumption (sensitivity above 20%):
{FRAGILE_ASSUMPTION}

Current allocation, for contrast:
{CURRENT_ALLOCATION_JSON}

Write a four-paragraph briefing:

1. The recommendation, in one sentence. "Move £X from {from} to
   {to}." Then the projected delta in conversions and the
   confidence range.

2. Why this allocation. Cite the curve fits. Which channels are
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
- No more than four paragraphs.
```

You should now have three CFO-ready briefings, each anchored to its scenario.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand, scale-stage, spending around £80k a month across Meta, Google Ads, a small Display retargeting line, and an SEO content investment of around £15k a month in writer and editor time.

**Phase 1 output.** Long-format CSV populated across 52 weeks. Eight channels covering Paid social Meta, Paid search Google brand, Paid search Google non-brand, Display retargeting, SEO, Email lifecycle, Affiliate, Sponsored events.

**Phase 2 output.** Curve fits per channel, with R-squared in parentheses:

- Paid social Meta (0.78). Half-saturation at £14k weekly, max output 720 conv per week, current operating point at £18k weekly. Well into saturation plateau.
- Paid search Google non-brand (0.71). Half-saturation £6k, max output 410, current £5.5k. Just below the knee, headroom available.
- Display retargeting (0.42). Insufficient data. Flagged, treated as linear with explicit warning.
- SEO (0.81). Long-tail curve, current operating point well below the knee. Headroom substantial, lag 9 months.
- Email lifecycle (0.69). Curve is the budget-output of new-list growth investment, not send volume. Current near the knee.
- Sponsored events (0.55). Flagged, fit weak, treated as scenario input only.

**Phase 3 output.** Default multipliers applied. Cascadia has no MMM, so both ends of the multiplier band run.

**Phase 4 output.** Twenty scenarios simulated. The "best mathematical" scenario pulls £8k weekly from Paid social Meta and adds £4k to Paid search non-brand and £4k to SEO. Projected delta is plus 65 conversions per week at the central estimate, with a 90 percentile band of plus 30 to plus 110. The "best with strategic floors" scenario respects an SEO floor at the current spend and shifts £6k weekly from Paid social to Paid search non-brand. Projected delta plus 40, band plus 15 to plus 70. The "current plus or minus 15" scenario lifts Meta by 15% and tests whether the brand can find more headroom there before reallocating, projected delta plus 10, band minus 20 to plus 40.

**Phase 5 output.** Three CFO briefings. Sample of the best mathematical briefing's first paragraph:

> Move £8,000 weekly from Paid social Meta into Paid search non-brand (£4k) and SEO content (£4k). Projected 90-day conversion delta is plus 845 conversions on a central estimate, with a 10th to 90th percentile band of plus 390 to plus 1,430. Meta has been operating £4k past its half-saturation point for 22 weeks, so the next pound of Meta spend is generating roughly 38% of the conversions it generated nine months ago.

Cascadia takes the best-with-floors scenario to the budget meeting. The CFO signs off. Six weeks later the leading indicator (SEO impressions on commercial-intent queries) is up 24%, ahead of schedule. The full payback lands at the end of the quarter.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, fit one channel's curve

Take your weekly spend and conversions for one paid channel over the last 52 weeks. Paste into Sheets, plot as a scatter, fit a Hill curve with SOLVER. Read the R-squared. If above 0.6, your channel has a clean diminishing-return shape and the simulator will produce useful scenarios. If below 0.6, look at the period covering for creative changes, audience swaps or seasonal effects that broke the fit.

### Exercise 2, run the rationale prompt for one scenario

Take any one scenario from your simulation. Paste it into the Phase 5 rationale prompt with your real numbers. Read the four paragraphs. Now redraft the rationale in your own voice. The model's draft is a defensible starting point, your edit makes it readable by your specific CFO.

### Exercise 3, stress-test your most fragile assumption

For your top scenario, identify the assumption that swings the output most. Vary it by plus or minus 50% and re-run the projection. If the recommended allocation flips at plus or minus 50% sensitivity, the scenario is not robust. Either resolve the assumption (often through a small incrementality test) or downgrade the scenario to "directional" in the briefing.

## The eval gates

**Eval 1, curve fit quality.** For each channel, the fitted Hill function's R-squared against the historical data must exceed 0.6. Below that, the channel does not have a clean diminishing-return shape, often because of insufficient data, a disruption in the period or genuinely linear behaviour. The pipeline flags these channels and excludes them from the scenario set, or treats them as flat-rate linear with explicit warning.

**Eval 2, backtest.** Hide the last 8 weeks of actual data from the model, fit on the prior 44 weeks, predict the 8. Mean Absolute Percentage Error against the actuals should be under 25%. Higher means the predictions are not trustworthy, usually because the brand made a big creative or strategy shift in the period.

**Eval 3, assumption sensitivity.** For each of the three recommended scenarios, vary each assumption by plus or minus 25% and re-run. If any single assumption swings the projected output by more than 20%, that assumption is fragile and gets flagged in the rationale.

**Eval 4, recommendation realism.** The pipeline-suggested optimal allocation often wants to zero out small channels. A floor forces this, no channel can be cut below 60% of its 12-month average in a single quarter without explicit override. This saves the simulator from suggesting "kill SEO" allocations that ignore the multi-quarter lag.

**Eval 5, CFO read.** The CFO actually reads the briefing. If the briefing is four paragraphs and the CFO is asking questions answered in paragraph two, the briefing structure is right. If the CFO is asking questions the briefing did not anticipate, add those to the rationale prompt for next quarter.

## The failure modes

**Saturation is not real on every channel.** Some channels, especially long-tail SEO and organic content, do not saturate in the data you have because you have never spent enough to find the ceiling. The Hill fit will still produce a curve but is extrapolating beyond what the data supports. The pipeline labels these "headroom unknown" and the recommendation language treats them as upside rather than a target.

**Cross-channel multipliers are guesses.** The defaults shipped are from MMM literature. They are better than nothing and worse than your own MMM. If you have a recent MMM, override the defaults. If you do not, run two scenarios, one with the defaults at high estimate, one at low, and present both as the band.

**Lag is not priced in for SEO.** Cutting SEO budget shows up in conversions 6 to 12 months later. A 90-day projection cannot see the damage. The pipeline applies a strategic floor on SEO by default (60% of trailing average) and flags the recommendation explicitly when SEO is touched.

**The brand has too few channels.** Three-channel brands do not have enough degrees of freedom to make the curves interesting. The pipeline still runs but the scenarios collapse to "spend more here, less there" with no surprise. Pre-launch and early-growth brands sometimes get more value from the curve-fitting diagnostic than from the allocation recommendation.

**Outliers from Black Friday and similar.** A single high-week skews the fit. The pipeline detects weeks more than 2.5 standard deviations from the trailing mean and prompts you to flag them as planned events (so they are modelled separately) or include them with a smoothing weight. Default is to flag and exclude from curve-fitting, then add back as ad-hoc events in the scenario.

## The pattern in practice

Illustrative scenarios that show common shapes the simulator surfaces. Specifics are illustrative and the patterns repeat.

**D2C apparel, growth-stage, the saturation catch.** A brand about to triple Meta spend on the back of a strong quarter. The simulator shows Meta is already 80% of the way up its saturation curve. The recommendation is to take a meaningful slice of the planned increase and put it into a partner-PR push that has only ever run at small spend (where the curve still has room). The split usually outperforms the original plan because the partner channel has a curve to climb for the following quarters.

**B2B SaaS, scale-stage, the SEO floor.** A CFO wants to cut SEO spend in half because "we cannot see what it is doing." The simulator shows the brand is in the steep part of the SEO curve and the lag on cuts lands roughly nine months out, sometimes coinciding with a planned product launch. The honest recommendation is a modest increase and reallocate within SEO from low-intent informational pages to high-intent commercial ones. The launch then lands into a strong organic quarter rather than a quietly decaying one.

**Fintech, the email-asset failure.** An early simulator version without the strategic floor on email lifecycle recommends cutting email spend by 60%. If acted on, the database decays enough that re-warming takes a year. This is why the current version applies a strategic floor on any channel with an audience-asset (email list, SEO authority, brand recall). The model is good at the maths and blind to the asset-decay lag.

## Hand-off

The simulator feeds:
- **attribution-teardown**, the curve fits inform which channels need an incrementality test
- **paid-search-bidding-agent**, the bid floors and ceilings respect the channel-mix recommendation
- **lifecycle-journey-builder**, the email-channel investment level shapes the journey complexity the team can support
- **race-day-demand-pipeline**, the event-channel spend allocation drives sponsorship tier decisions
