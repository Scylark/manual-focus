---
title: "Paid-search bidding agent with margin-aware optimisation"
stack: demand
description: "Install a bidding layer that adjusts paid-search targets by contribution margin rather than revenue. Recovers profitable keywords platform-side smart bidding abandons."
outputs: "Margin map, query-to-product mapping, bidding agent, weekly review cadence"
readMin: 22
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["paid-search", "analytics"]
models: ["claude-4.5-sonnet", "gpt-5"]
publishedAt: 2026-05-22
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts:

1. A **margin map** for every SKU, product family or category, with contribution margin in pounds rather than a "premium" or "standard" tag, sourced from finance.
2. A **query-to-product mapping** for every active search query in the account, validated by a marketing operator, with a confidence score per mapping.
3. A **bidding agent** running daily, computing margin-adjusted ROAS per ad group, submitting bounded bid recommendations through the Google Ads or Microsoft Advertising API.
4. A **guardrail set** that holds the agent within safe limits (±15% daily change, brand-keyword floors, unknown-query ceilings, learning-phase respect).
5. A **weekly review cadence** with a structured human pass on the changes the agent made and the changes it wanted to make but was blocked from.

## Who this is for

A growth or scale-stage brand running £30k or more a month on paid search with at least three product families at meaningfully different contribution margins, an analyst who can pull margin data from finance, and a paid-search lead with API access to Google Ads or Microsoft Advertising. If the brand has uniform margins across its range, the platform's revenue-based bidding is already close to optimal and this playbook is overkill.

## Before you start

- [ ] Contribution margin data per SKU, product family or category from finance, in pounds, updated at least quarterly
- [ ] Google Ads account at admin level (Owner or Standard with bid changes permission)
- [ ] Microsoft Advertising account at admin level if you run Bing
- [ ] Google Ads API access via the developer token process, or a paid-search platform with API write access (Search Ads 360, Optmyzr, Marin)
- [ ] GA4 with conversions configured per product and revenue passed through
- [ ] A query report covering the last 90 days, exported from Google Ads as CSV
- [ ] Claude Opus 4.5, GPT-5 or Claude Sonnet 4.5 with structured-output mode
- [ ] A staging account or a 5% spend slice to test the agent against before scaling

Without margin data the agent has nothing to optimise against. Get the finance partner aligned before you scope the rest.

## The pipeline

Five phases. End-to-end in a working week for setup, then ongoing operation with weekly review.

### Phase 1, margin map

The single most important upstream input. The agent only works with quantitative margin data.

**Step 1.1, build the margin sheet with finance.**

In a shared Sheets or Excel file, build the columns SKU or product family, list price (excl VAT), unit cost of goods, fulfilment cost, payment-processing cost, contribution margin in pounds, contribution margin percent.

For services or subscriptions, model first-year contribution margin per subscriber and use that.

**Step 1.2, validate the data.**

Sample five SKUs. For each, verify the unit cost against the most recent purchase order or supplier invoice. Verify the fulfilment cost against the latest 3PL invoice. Re-run the maths. If any sample is more than 10% off the sheet, the margin data needs to be rebuilt before the agent ships.

**Step 1.3, set the refresh cadence.**

Margins drift as costs change. Set a quarterly refresh, calendar-blocked. Costs typically move on raw materials, on freight or on payment-processor rate changes. The drift is enough to invalidate the agent's bids within a year if unrefreshed.

You should now have a margin sheet you and finance both trust.

### Phase 2, query-to-product mapping

The harder data work. Every active search query maps to the product or category it intends. Mis-mapped queries lead to wrong bids.

**Step 2.1, export the query report.**

1. In Google Ads, open the account. In the left sidebar click **Insights & reports**, then **Search terms**.
2. Set the date range to the last 90 days.
3. Click the download icon (top right) and choose CSV. Take queries with at least 50 impressions in the period.

**Step 2.2, cluster and propose mappings.**

```text
SYSTEM: You map paid-search queries to a brand's product taxonomy.
You cluster queries by intent and propose a product or category for
each query. You return a confidence score per mapping. You do not
invent products the inputs do not contain.

USER:
Brand product taxonomy: {LIST_PRODUCTS_OR_CATEGORIES_WITH_DESCRIPTIONS}
Search queries with impression and conversion counts:
{PASTE_QUERIES_CSV}

Return JSON:

{
  "mappings": [
    {
      "query": "<verbatim>",
      "proposed_product_or_category": "<from taxonomy>",
      "confidence": <0.0-1.0>,
      "rationale": "<one sentence>",
      "alternative_match": "<second-best match or null>"
    }
  ],
  "unmappable_queries": [
    {"query": "<verbatim>", "reason": "<why no clean match>"}
  ]
}

Rules:
- Confidence below 0.7 routes to human review.
- "alternative_match" is null when the second-best match is much
  weaker than the first.
- "unmappable_queries" must be reviewed by the operator before the
  agent acts on them.
- Use verbatim query text. Do not paraphrase.
```

**Step 2.3, validate by hand.**

The operator reviews the low-confidence mappings (below 0.7) and the unmappable queries. Each gets a final mapping or an "exclude from agent" tag. This step is a half-day of focused work for an account of 500 to 2,000 active queries.

You should now have a query-to-product map the agent can act on.

### Phase 3, margin-aware bid calculation

The agent runs daily. For each ad group, it computes the margin-adjusted ROAS and adjusts the target.

**Step 3.1, define the formula.**

For each ad group:

- Margin-adjusted revenue = sum over conversions of (conversion value times contribution margin percent for the mapped product).
- Margin-adjusted ROAS = margin-adjusted revenue divided by ad group spend.
- Target margin-adjusted ROAS = the brand's blended target.
- Bid adjustment = bounded function of the gap between actual and target, capped at ±15% per cycle.

**Step 3.2, run the daily bid prompt.**

```text
SYSTEM: You generate daily bid adjustment recommendations for each
ad group based on margin-adjusted ROAS. You apply bounded
adjustments (±15% per cycle), respect platform learning phases, and
honour brand-keyword floors and unknown-query ceilings.

USER:
Ad group: {AD_GROUP_NAME}
Account-level target margin-adjusted ROAS: {TARGET}
Trailing 30-day metrics (or 90-day for low-volume groups):
  Spend: {GBP}
  Conversions: {COUNT}
  Conversion value: {GBP}
  Margin-adjusted revenue: {GBP}
  Margin-adjusted ROAS: {DECIMAL}
Current bid or target ROAS: {VALUE}
Group classification: {BRAND | NON_BRAND_HIGH_INTENT | NON_BRAND_LONG_TAIL | UNKNOWN_QUERY_PATTERN}

Recent learning phase status: {ACTIVE | STABLE}

Return JSON:

{
  "ad_group": "<name>",
  "current_target_roas": <decimal>,
  "recommended_target_roas": <decimal>,
  "delta_pct": <number, -15 to +15>,
  "rationale": "<one sentence>",
  "guardrail_triggered": "<none | brand_floor | unknown_query_ceiling | learning_phase>",
  "expected_volume_impact": "<one sentence>"
}

Rules:
- Delta capped at ±15% per cycle.
- If learning phase is active, max delta is ±5%.
- Brand keywords have a hard bid floor. Never recommend below the
  floor.
- Unknown query patterns have a hard bid ceiling. Never recommend
  above.
- Use 30-day window for groups with 5+ recent conversions, 90-day
  for groups with 1-4.
```

**Step 3.3, submit through the API.**

The recommendations submit through the Google Ads API at the ad group target ROAS level (or keyword bid for manual-bid accounts). Microsoft Advertising's API works the same way.

For brands without API access, the recommendations export to a CSV that the paid-search lead uploads through Google Ads Editor.

You should now have a daily bid loop running with margin context.

### Phase 4, guardrails and learning-phase respect

The agent has hard limits the brand sets and never overrides.

**Step 4.1, configure the guardrails.**

The standard set:

- **No daily change above 15%.** Bigger swings reset the platform's learning. The 15% bound keeps changes inside the platform's tolerance.
- **Brand-keyword floor.** Never bid below £X on brand keywords. Brand under-bidding lets competitors bid against the brand's name.
- **Unknown-query ceiling.** Never bid above £Y on queries the agent has classified as unknown pattern. New queries get a probationary bid until they have 30 days of data.
- **Learning-phase respect.** If a campaign has entered learning (after a creative change, audience swap or budget shift), the agent halves its allowed delta until learning completes.
- **Weekly human override.** The paid-search lead reviews the week's changes and the changes the agent wanted to make but was blocked from. The lead can override either direction.

**Step 4.2, log every blocked recommendation.**

Every time a guardrail blocks the agent, the log captures the recommendation, the guardrail triggered and the operator override (if any). This log is the input to the weekly review.

You should now have a guardrail set documented and a log capturing every block.

### Phase 5, weekly review cadence

A structured human pass every week.

**Step 5.1, run the weekly review prompt.**

```text
SYSTEM: You generate a weekly review for a paid-search bidding
agent. You summarise the bid changes made, the changes blocked by
guardrails, the margin-adjusted ROAS movement and the single concern
the human operator should hold next week.

USER:
Week ending: {DATE}
Bid changes submitted: {COUNT}
Bid changes blocked by guardrails: {COUNT} (by guardrail type)
Margin-adjusted ROAS trend (last 4 weeks): {NUMBERS}
Revenue-only ROAS trend (last 4 weeks): {NUMBERS}
New unmappable queries this week: {COUNT}

Return JSON:

{
  "headline_summary": "<one sentence>",
  "changes_summary": "<one paragraph>",
  "blocked_changes_summary": "<one paragraph>",
  "trend_read": "<one paragraph>",
  "single_concern_for_next_week": "<one sentence>",
  "operator_action_required": "<list of specific actions>"
}

Rules:
- "headline_summary" reads as a sentence the paid-search lead would
  Slack to the marketing director.
- "single_concern" must be specific (e.g. "non-brand long-tail is
  showing platform-credit drift" not "monitor performance").
- "operator_action_required" is concrete, not exploratory.
```

**Step 5.2, the lead acts on the review.**

The paid-search lead reads the review, signs off on the agent's actions and either accepts or overrides any flagged concerns. Most weeks this is a 20-minute pass.

You should now have a sustainable weekly cadence keeping the agent honest.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand, scale-stage, running £42k a month on Google Ads across brand and non-brand campaigns.

**Phase 1 output.** Margin sheet built with finance. Vahla shells contribute £52 per unit at a £180 list price (29% margin). Standard Cascadia tees contribute £8 per unit at a £30 list price (27% margin). Cascadia race-day shorts contribute £22 per unit at a £60 list price (37% margin). The race-day shorts have the highest margin per pound of spend, the Vahla shells are the highest absolute margin per unit.

**Phase 2 output.** 1,840 active queries mapped. 1,422 land at confidence 0.7 or higher. 318 route to operator review and resolve in a half-day session. 100 are tagged as "exclude from agent" because the intent is ambiguous (mostly broad queries like "trail running gear" that could land at any product).

**Phase 3 output.** Bid loop running daily. The agent moves the non-brand long-tail bid for "Vahla shell review" up 12% because the conversions are mapping to the £52-margin product, while the platform was bidding it lower based on revenue alone. The same loop moves the bid for the higher-revenue but lower-margin "Cascadia tees" group down 9%.

**Phase 4 output.** Guardrails active. The agent attempts to lower the brand-keyword bid for "Cascadia Endurance" by 14% on day 6 because the margin maths suggested the brand-keyword spend was unnecessary. The brand-keyword floor blocks the change. The weekly review confirms the block was correct, brand-keyword underbidding would have let Inov-8 bid against Cascadia's brand searches.

**Phase 5 output.** Weekly review at week 6. Margin-adjusted ROAS up 18% against baseline, revenue-only ROAS down 3%. The marketing director signs off on the trade. The single concern flagged is that two new query patterns ("Vahla membrane spec," "Vahla weight comparison") emerged this week and need mapping before the agent can act on them.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, build a 10-SKU margin map by hand

Pick 10 of your SKUs. Pull list price, unit cost, fulfilment cost and payment processing for each. Compute contribution margin in pounds. Compare against the "premium / mid / standard" tagging your team uses today. If the rank order differs, the tagging is misleading and the agent's first action will be different from what the team has been doing manually.

### Exercise 2, map 50 queries through the Phase 2 prompt

Take 50 of your highest-impression queries. Run the Phase 2 prompt. Read the proposed mappings. Pick five low-confidence mappings and resolve them by hand. The exercise calibrates how much operator time the full mapping will take and surfaces taxonomy gaps.

### Exercise 3, design one guardrail for your account

Pick one risk specific to your account (e.g. "we cannot afford to lose volume on the Vahla shell ad group during Q3 launch"). Write a guardrail that blocks the agent from changing that ad group's bid above ±5% during a date window. Add to the configuration. The exercise teaches you how to harden the agent against the specific risks your brand carries.

## The eval gates

**Eval 1, margin-weighted ROAS lift.** The agent should improve margin-weighted ROAS within 4 to 6 weeks of installation. Below baseline at 6 weeks means the agent is mis-calibrated or the margin data is wrong.

**Eval 2, revenue-only ROAS protection.** Margin optimisation must not collapse revenue ROAS by more than 5%. If it does, the agent is over-throttling high-volume keywords. Tune the bounds.

**Eval 3, query-mapping accuracy.** Sample 50 recent queries. The agent's product mapping should match a human's classification at 90% or above. Lower means the bids are being adjusted against wrong margins.

**Eval 4, brand-keyword floor enforcement.** Verify the brand-keyword floor has held every week. A floor that has been silently breached is a critical failure.

**Eval 5, learning-phase respect.** When a campaign enters platform learning, the agent's delta should drop to ±5%. Verify in the weekly log. Big bid changes during learning lose two weeks of optimisation.

## The failure modes

**Bad margin data poisons the whole system.** If the brand's margin map is wrong or stale, every adjustment compounds the error. Audit the margin data quarterly. Margins drift as costs change.

**Platform learning phase resets.** Big bid changes trigger the platform to re-enter learning, which can lose two weeks of optimisation. The ±15% daily cap exists to keep changes inside the platform's tolerance.

**Brand-keyword cannibalisation.** Margin-aware bidding sometimes wants to under-bid brand keywords because the margin does not justify the bid. Hold the line. Brand-keyword underbidding lets competitors bid against the brand. Hard floor on brand-keyword bids, set in the rules.

**Long-tail query starvation.** Bid adjustments based on recent volume can throttle low-volume but high-quality queries. The agent uses 30-day windows for low-volume groups (5+ conversions) and 90-day windows for very-low-volume groups (1 to 4 conversions) to keep the long tail responsive but stable.

**Unmapped queries get acted on.** A new query pattern emerges, the agent maps it weakly and bids against the wrong margin. The unknown-query ceiling exists for this. Queries below the confidence threshold are bid at the ceiling until they have 30 days of mapping evidence.

## The pattern in practice

Illustrative scenarios that show common shapes margin-aware bidding takes. Specifics are illustrative and the patterns repeat.

**D2C, growth-stage, the margin gap.** A brand with multiple product categories at meaningfully different margins. Platform bidding treats them as equal-revenue. Installing and tuning the agent over 4 to 8 weeks typically lifts margin-weighted ROAS materially while accepting a small revenue-ROAS dip. Net contribution from paid search rises despite slightly lower revenue, the right trade for most brands with margin spread.

**B2B SaaS, scale-stage, the self-bidding rationalisation.** A brand bidding against itself across multiple product lines. The agent rationalises bids based on which queries actually convert to which products. Cost per qualified opportunity drops without hitting volume, because the bids the brand was placing against itself were noise rather than signal.

**Endurance apparel, the margin-shift catch.** A brand running the agent for two quarters, then a supplier price increase shifts the Vahla shell margin from 29% to 22% without anyone updating the margin sheet. The agent keeps bidding the shell as if it were 29% margin until the quarterly audit. Three weeks of over-bidding costs the brand more than the audit time would have. The lesson is that the quarterly refresh of margin data is the discipline that protects the agent's correctness.

## Hand-off

The bidding agent feeds:
- **attribution-teardown**, paid-search's margin contribution shows up cleanly once bids are margin-aware
- **channel-mix-simulator**, the agent's bid floors and ceilings respect the simulator's allocation recommendations
- **category-entry-points**, query clusters become keyword groups with the right margin context
- **race-day-demand-pipeline**, event-window bid lifts get costed at the right margin
