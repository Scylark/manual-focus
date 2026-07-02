---
title: "End-of-season inventory and clearance"
stack: ops
description: "Manage the end-of-season inventory cycle for seasonal endurance gear. Forecast accuracy, clearance timing, channel sequencing, brand-protective discounting."
outputs: "Inventory disposition sheet, clearance calendar, channel rules, discount governance"
readMin: 16
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["paid-search", "paid-social", "email", "lifecycle"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-09-03
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **SKU-level forecast** with P25, P50 and P75 quantile ranges per SKU, signed off by the operations lead before the production order goes in.
2. An **inventory disposition spreadsheet** that scores every SKU at mid-season against sell-through health and routes it to the right clearance phase.
3. A **sequenced clearance calendar** running soft launch, member-first, email-list, public and final phases across the eight weeks before season end.
4. A **channel sequencing rule sheet** governing which discounts run where, in what order, with member, email-list, retail-partner and outlet tiers.
5. A **discount governance check** that runs against every proposed promotion before it deploys, enforcing depth limits and brand-surface rules.

## Who this is for

A growth, scale or enterprise endurance brand selling seasonal gear (winter shells, summer race kit, spring shoes) with an ecommerce backend (Shopify, NetSuite, BigCommerce), retail partners and a clearance pressure that recurs every season. If your range is non-seasonal (year-round consumables, one-size-fits-all accessories), the discipline matters less. If you sell only direct-to-consumer with no retail, simplify the channel sequencing but keep the discipline.

## Before you start

- [ ] Ecommerce backend access with SKU-level sell-through data exportable (Shopify Admin, NetSuite, BigCommerce, equivalent)
- [ ] Two years of prior-season sell-through by SKU, by week
- [ ] Pre-order data for the current season if available
- [ ] Retail-partner sell-out reports if you sell wholesale (typically via Joor, Brandwise or partner-supplied spreadsheets)
- [ ] Email list size and segment data (Klaviyo, Customer.io, equivalent)
- [ ] Membership programme data if you have one (Trail Club, loyalty programme, equivalent)
- [ ] Outlet partner contacts and their typical lead time for excess inventory
- [ ] Operations lead and finance lead both available for the forecast sign-off
- [ ] Macro signals: weather forecasts for the season, race calendar density, competitor early-discounting indicators

If two years of prior-season sell-through is not available, use one year and flag the forecast as "first-cycle, expect 30% wider intervals." Forecasting on one season is rough but better than nothing.

## The pipeline

Five phases. One working week to install the cycle, then it runs every season.

### Phase 1, forecast accuracy

Most brands over-order because forecasting is a guess wrapped in optimism. Improve by combining signals.

**Step 1.1, export prior-year sell-through.**

In Shopify Admin, go to *Analytics* then *Reports* then *Sales by product*. Set the date range to last year's same season. Export to CSV. The CSV becomes the historical baseline.

In NetSuite, the equivalent report is *Sales Order Item Summary* with a filter on the season's SKUs and date range.

Pivot the export by SKU and by week. You should now have a table with one row per SKU and 12 to 16 columns for the weeks of the season.

**Step 1.2, gather the macro signals.**

In a Notion page called *Season forecast inputs*, capture:

- Channel mix shift since last year (DTC share up or down, retail order pattern)
- Weather forecast for the season (Met Office long-range or equivalent)
- Race calendar density (count of Tier 1 events in the season window from the race-day-demand-pipeline calendar)
- Audience segment growth (email list growth, Trail Club membership growth, organic social follower growth)
- Competitive signals (any competitor visibly discounting early in the prior season, signalling over-order)

**Step 1.3, run the forecast prompt.**

```text
SYSTEM: You build a SKU-level demand forecast with P25, P50 and
P75 quantile ranges. You combine historical sell-through with
macro signals. You return JSON only. You are conservative on
upside, willing to flag downside.

USER:
Historical sell-through (last season):
{PASTE_SELL_THROUGH_CSV}

Macro inputs:
- Channel mix shift: {DESCRIPTION}
- Weather forecast: {DESCRIPTION}
- Race calendar density: {COUNT_OF_TIER_1_EVENTS}
- Audience growth: {EMAIL_LIST_GROWTH_PCT}, {MEMBERSHIP_GROWTH_PCT}
- Competitive early-discount signal: {YES | NO | UNCERTAIN}

For each SKU return:
{
  "sku": "<verbatim>",
  "product_name": "<verbatim>",
  "category": "<outerwear | footwear | apparel | accessories | base_layer>",
  "p25_units": <int>,
  "p50_units": <int>,
  "p75_units": <int>,
  "confidence": "<high | medium | low>",
  "key_driver": "<which signal moved the forecast most>",
  "recommended_production_quantity": <int>
}

Rules:
- recommended_production_quantity defaults to P50 unless
  confidence is low (then P25) or the SKU has a strong upside
  signal (then between P50 and P75).
- Confidence is low when historical data is sparse or signals
  contradict.
- Round to nearest 10 units for orders under 500, nearest 50
  for larger.
```

**Step 1.4, the production-order sign-off.**

The forecast goes to ops and finance. Production orders take the recommended_production_quantity. Over-ordering above the recommendation requires a written justification from whoever is asking. The justification lives in the *Season forecast inputs* Notion page so next year's review knows what assumption drove the decision.

You should now have a SKU-level forecast and a signed-off production order.

### Phase 2, mid-season early warning

Six to eight weeks before season end, the disposition spreadsheet gets built.

**Step 2.1, export current sell-through.**

Same export as Step 1.1, set to the current season. Pivot by SKU.

**Step 2.2, compute the health flag per SKU.**

In the disposition spreadsheet, add a column called *Health_status*. The formula compares the current sell-through against the forecast.

- Above P50 forecast: `healthy` (standard end-of-season handling)
- Between P25 and P50 forecast: `at risk` (monitor, possible soft-launch intervention)
- Below P25 forecast: `below_p25` (early intervention needed)
- Far below P25 (less than 50% of P25): `critical_below_p25` (significant clearance required)

**Step 2.3, the disposition prompt.**

For each SKU at risk or below, run the prompt to propose a disposition plan.

```text
SYSTEM: You propose a clearance disposition plan for a SKU
based on its sell-through health, brand position, margin and
channel availability. You return JSON only.

USER:
SKU: {SKU}
Product name: {PRODUCT_NAME}
Category: {CATEGORY}
Units on hand: {UNITS_ON_HAND}
Units sold to date: {UNITS_SOLD_TO_DATE}
Sell-through percent: {SELL_THROUGH_PCT}
Forecast P25/P50/P75: {P25}/{P50}/{P75}
Health status: {HEALTH_STATUS}
Margin per unit full price: {MARGIN_FULL}
Weeks remaining in season: {WEEKS_REMAINING}
Channels available: {MEMBER_PROGRAMME | EMAIL_LIST | RETAIL_PARTNERS | OUTLET}

Return:
{
  "disposition_phase": "<hold | soft_launch | member_first | email_clearance | public_clearance | final_clearance>",
  "discount_pct": <int, 0 to 50>,
  "channel_sequence": ["<channel>"],
  "bundle_plan": "<bundle description or 'none'>",
  "rationale": "<one sentence>",
  "do_not_run_on_brand_surface": <true | false>
}

Rules:
- "hold" if health is healthy or above; the SKU does not need
  clearance.
- discount_pct ceiling 35 for mid-clearance, 50 only for
  final_clearance or outlet, never above 50 on brand surface.
- channel_sequence runs in the order specified.
- do_not_run_on_brand_surface true when the SKU is heritage or
  flagship.
- Bundle plans use value-add over price-down where possible.
```

**Step 2.4, finalise the disposition sheet.**

The output populates the disposition spreadsheet's *Disposition_phase*, *Discount_pct*, *Channel_sequence* and *Bundle_plan* columns. The ops lead reviews and locks the disposition.

You should now have a SKU-by-SKU plan eight weeks before season end.

### Phase 3, sequenced clearance calendar

The calendar that runs the disposition plan.

**Step 3.1, lock the five-phase calendar.**

In a Notion calendar or your project tool, lock the five phases. Each phase has a window and a channel set.

| Phase | Window | Channels |
|---|---|---|
| Soft launch | 8 weeks pre-season-end | Retail partners with excess inventory access |
| Member-first | 6 weeks pre-end | Membership programme exclusive |
| Email-list clearance | 4 weeks pre-end | Opt-in email list |
| Public clearance | 2 weeks pre-end | Public website, paid programme |
| Final clearance | Post-season | Outlet partners, brand outlet channel |

**Step 3.2, build the phase-trigger automation.**

In Klaviyo (or your email tool), build segments for *Members* and *Email-list active 90d*. Set up flows for each clearance phase that fire on the calendar date. Each flow has its own subject line, hero image and CTA per phase.

In Shopify, build collections for *Soft launch*, *Member clearance*, *Email clearance*, *Public clearance* and *Outlet*. Tag each clearance SKU into the right collection per the disposition sheet.

**Step 3.3, the no-public-first rule.**

The sequencing is the discipline. Public clearance never starts before the prior phases have run. This avoids training the audience to wait for the public sale.

You should now have a calendar that locks the sequence and the technical setup that enforces it.

### Phase 4, channel sequencing rules

Hard rules for what runs on which channel.

**Step 4.1, the channel rule sheet.**

In a Notion page called *Clearance channel rules*, write the rules verbatim. The team quotes these when someone proposes a discount.

```text
Channel rules, end-of-season clearance

Rule 1, retail partners first.
Tier A and B retail partners get first access to clearance
pricing on excess inventory the brand is offering. Partners
appreciate getting first crack, and it protects the channel
relationship.

Rule 2, brand DTC site runs the clearance section.
The brand site has a /clearance path that surfaces the SKUs in
public-clearance phase. The clearance is a sub-experience,
not the brand surface.

Rule 3, outlet partners last.
Outlet partners take the final 10 to 15 percent of remaining
inventory in the post-season window.

Rule 4, never make the brand surface the clearance entry.
The homepage stays full-price. Clearance is discoverable from
the footer and from email, not from the hero block. The brand
surface is for full-price product.

Rule 5, paid social and search ads in public-clearance phase
only.
Paid programme starts at 2 weeks pre-end, not before. The
audience training cost of earlier paid is too high.
```

**Step 4.2, the channel sequencing prompt.**

For SKUs where the channel sequence is unclear (a heritage SKU with edge-case sell-through, a flagship that dipped below P50), run the prompt.

```text
SYSTEM: You propose a channel sequence for a clearance SKU
that respects brand-surface protection and audience-training
costs. You return JSON only.

USER:
SKU: {SKU}
Disposition: {DISPOSITION_PHASE}
Health: {HEALTH_STATUS}
Brand position: {HERITAGE | FLAGSHIP | STANDARD | NEW}
Channels available: {LIST}

Return:
{
  "ordered_channels": ["<channel>"],
  "skip_channels": ["<channel>", "<reason>"],
  "brand_surface_visible": <true | false>,
  "rationale": "<one sentence>"
}

Rules:
- Heritage and flagship SKUs never go to public clearance.
  Hold them or use outlet.
- ordered_channels follows the five-phase calendar order.
- brand_surface_visible true only for SKUs in public_clearance
  phase, never for flagship.
```

You should now have a channel rule sheet and a prompt for the edge cases.

### Phase 5, discount governance

The governance check that runs against every proposed promotion.

**Step 5.1, the governance rules.**

Hard rules, no exceptions without written sign-off.

```text
Discount governance rules

Rule 1, no flagship-product discounts outside controlled
clearance windows. The brand's hero products stay full-price
all season.

Rule 2, max discount depth 35 percent in mid-clearance, 50+
percent only in final or outlet. Anything above 50 percent on
brand-surface channels signals desperation.

Rule 3, bundle or value-add over price-down where possible.
Free shipping, free fit consultation, spare laces in the box,
preserves price perception while moving units.

Rule 4, audience-segmented eligibility. Members, email-list
and retail partners get different access tiers. Identical
pricing across all audiences erodes the membership and
email-list value proposition.

Rule 5, no "spring sale" calendar creep. The clearance cycle
runs once per season, not as a recurring "spring sale, summer
sale" pattern. The audience must not learn that the brand
discounts on a calendar they can wait for.
```

**Step 5.2, the governance prompt.**

Run before every proposed promotion.

```text
SYSTEM: You evaluate a proposed discount or promotion against
the brand's discount governance rules. You return a go or stop
verdict with the reasoning.

USER:
Proposed promotion:
- SKUs: {LIST_OF_SKUS}
- Discount percent: {PCT}
- Channels: {LIST_OF_CHANNELS}
- Audience: {SEGMENT}
- Window: {DATES}
- Bundled or value-add element: {DESCRIPTION_OR_NONE}

Governance rules:
{PASTE_RULES_FROM_STEP_5.1}

Return JSON:
{
  "verdict": "<go | stop>",
  "rule_check": {
    "no_flagship_discount": <pass | fail>,
    "depth_within_limit": <pass | fail>,
    "bundle_preferred": <pass | flag | n/a>,
    "audience_segmented": <pass | fail>,
    "no_calendar_creep": <pass | fail>
  },
  "stop_reason": "<one sentence or null>",
  "remediation": "<concrete change to make the promotion compliant>"
}

Rules:
- Verdict stop if any rule_check is fail.
- Bundle_preferred is flag (not fail) when no bundle is
  proposed and the SKU could plausibly bundle.
- Remediation is concrete.
```

**Step 5.3, the override path.**

When a promotion needs to break a rule (rare, but the situation arises), the override requires a written justification in the *Discount overrides* Notion page signed by the founder or CFO. The override gets logged, audited annually and the pattern reviewed.

You should now have a governance check that runs against every promotion before it ships.

## Worked example, end-to-end

Cascadia Endurance, scale-stage. Winter season runs October to February. Ops lead and finance both bought into the discipline.

**Phase 1.** Last-season sell-through CSV exported from Shopify, 47 SKUs across outerwear, base layers, accessories and apparel. Weather forecast (Met Office long-range) calls for a mild winter. Race calendar has three Tier 1 winter events. Email list up 28% year-on-year. Trail Club membership up 15%. Forecast prompt produces P25/P50/P75 ranges per SKU. Ops takes P50 for the production order. Finance signs off.

**Phase 2.** Six weeks before season end, sell-through health computed (rows in the CSV template at the end of this playbook).

- CAS-WS-CHR-L (Charcoal Winter Shell, large): 99% sell-through, replenishment ordered
- CAS-WS-RED-M (Red Winter Shell, medium): 75% sell-through, below P25, soft launch
- CAS-WT-GRN-M (Green Winter Tights, medium): 16% sell-through, critical, member-first with steepest discount
- VAH-WG-GRY-L (Vahla Winter Gloves, large): 44% sell-through, below P25, member-first then outlet

**Phase 3.** Calendar locked. Member-first phase fires six weeks pre-end, with the winter tights and Vahla gloves in scope. Email-list clearance fires four weeks pre-end. Public clearance fires two weeks pre-end with only the Red Winter Shell M and the base layers in scope. The Cascadia Trail Runner (spring footwear) holds at full price across all phases because spring is its peak window.

**Phase 4.** Channel rules quoted in the Tuesday pre-ship review when a junior operator proposes a homepage takeover sale. The rule sheet blocks it. The team runs the public clearance from a clearance collection accessible from the footer and from email, not from the homepage hero.

**Phase 5.** The proposed Vahla winter gloves promotion runs through the governance prompt at 30% off plus bundle-with-beanie. Verdict go. The Cascadia Winter Tights promotion at 35% off member-then-outlet runs through the prompt. Verdict go. A proposed 45% off Cascadia Winter Shell promotion runs through the prompt. Verdict stop, depth above limit on brand surface. Remediation: drop to 30% with a bundle-with-base-layer add-on. Promotion ships compliant.

**The disposition sheet after Phase 2 (extract):**

| SKU | Health | Disposition | Discount | Channel |
|---|---|---|---|---|
| CAS-WS-RED-M | below_p25 | soft_launch | 15% | retail_partners |
| CAS-WS-CHR-L | sold_through | replenish | 0% | full_price |
| CAS-BL-BLK-S | below_p25 | member_first | 25% | member_only_then_email |
| VAH-WG-GRY-L | below_p25 | member_first | 30% | member_then_outlet |
| CAS-WT-GRN-M | critical_below_p25 | member_first | 35% | member_then_outlet |

End-of-season sell-through across the range lands at 82%. Margin erosion lower than the prior winter. First-time-buyer share at full price holds.

## Try it yourself

Three exercises. Each takes 30 to 60 minutes.

### Exercise 1, build a P25/P50/P75 forecast for one SKU

Pick your highest-volume seasonal SKU. Pull last season's sell-through. Apply your judgement on this season's macro signals. Write the three quantile estimates and the recommended production quantity. Most teams discover their gut number lands closer to P75 than P50, which is the over-ordering pattern this whole pipeline tries to fix.

### Exercise 2, run the disposition prompt on five SKUs

Pull five SKUs from a current season. Compute their health status. Run the Step 2.3 prompt on each. Compare the model's disposition plan to what your team did last season. Where they differ is where the discipline was missing.

### Exercise 3, run the governance prompt on a proposed promotion

Take any promotion currently in your pipeline (or one your team ran last season). Paste it into the Step 5.2 prompt. Read the verdict. Where the verdict is "stop", the promotion was about to ship outside governance and the prompt just saved a chunk of margin.

## The eval gates

**Eval 1, sell-through ratio.** End-of-season sell-through across the full range. Target sits at 80% or higher. Below that, the season's forecasting needs review.

**Eval 2, margin erosion.** Average realised margin across the season. Climbing erosion year on year signals the brand is discounting itself toward a discount brand.

**Eval 3, audience training.** Track first-time-buyer behaviour post-clearance. If new customers' first purchases concentrate on clearance SKUs at clearance pricing, the brand is acquiring discount-conditioned customers.

**Eval 4, channel coverage.** Did clearance flow through the sequenced channels in order, or did the team jump straight to public clearance under pressure? Audit annually.

## The failure modes

**Over-ordering at P75.** Most common forecast failure. Holding the production order at the P25 to P50 range produces marginally fewer units in stock-out years and dramatically less clearance pressure.

**Public-channel-first clearance.** "Email blast, 40% off everything" teaches the audience that the brand discounts and trains them to wait next season.

**Discount-cycle creep.** Brand starts running spring sale, summer sale, autumn sale, winter sale because each year's clearance got broader. The audience now expects four sales a year minimum.

**No mid-season warning.** Forecast fails silently. The brand only notices at week-of-season-end. Mid-season check at six to eight weeks pre-end is the institutional habit.

**Outlet that competes with the brand surface.** Outlet too visible in the brand's primary marketing, and the audience clicks through to the outlet for the discount instead of buying full price.

## The pattern in practice

Illustrative scenarios that show common shapes end-of-season management takes. Specifics are illustrative and patterns repeat.

**Premium cycling brand, scale-stage, the broadcast-clearance break.** A brand running season-end clearances at 35 to 40% off the entire range, heavily promoted. Audience has learnt to wait. Installing the sequenced calendar with public clearance moved to a few weeks pre-end and kept narrower typically lifts first-time-buyer share at full price within two seasons. Margin erosion reverses.

**Trail running brand, growth-stage, the forecast recalibration.** A brand over-ordering at P80 because production is offshore with long lead times. Recalibrating to P50 with a faster re-order line for the strongest SKUs typically lifts end-of-season sell-through substantially in one cycle.

**Multi-sport brand, the discipline-break failure.** A common failure mode is the sequence executes well in spring but breaks discipline in winter under pressure to hit revenue targets, running a brand-surface 40% off campaign. Sell-through hits short-term but next-season's full-price purchase rate drops.

## Templates

The disposition spreadsheet as a CSV. One row per SKU. Drop into Google Sheets.

[Download end-of-season-inventory-disposition-template.csv](/lens/templates/end-of-season-inventory-disposition-template.csv)

The CSV ships with 13 sample Cascadia winter-season SKUs across categories. Wipe them, keep the headers, fill in your own.

**If your category structure or channel mix differs, ask Claude to build a custom version.**

```text
SYSTEM: You generate an end-of-season inventory disposition CSV
tailored to a specific brand's category structure and channel
mix. The CSV captures every SKU with its forecast, health and
disposition.

USER:
My product categories: {LIST_CATEGORIES}
My seasonal structure: {SPRING_SUMMER_AUTUMN_WINTER | ROLLING | OTHER}
My channels available: {LIST_CHANNELS}
Extra fields I need: {LIST_EXTRA_FIELDS}

Generate a CSV with one row per SKU and columns for:
- SKU, Product_Name, Category, Season
- Units_On_Hand, Units_Sold_To_Date, Sell_Through_Pct
- Forecast_P25, Forecast_P50, Forecast_P75, Variance_To_P50
- Margin_Per_Unit_Full, Health_Status
- Disposition_Phase, Discount_Pct, Channel_Sequence
- Member_Eligible, Email_List_Eligible, Public_Eligible, Outlet_Eligible
- Bundle_Plan, Notes
- (any extras I specified)

Pre-fill three example rows for an endurance brand. Return
the CSV directly.
```

## Hand-off

End-of-season inventory connects to:
- **gear-launch-sequence**, where next-season launches start while this-season clearance is running, and the sequencing matters
- **retail-partner-programme**, where Tier A and B partners get first clearance access
- **subscription-membership**, where members get member-first clearance
- **lifecycle-journey-builder**, where email-list clearance touchpoints route through lifecycle
- **brief-to-ship-pipeline**, where every clearance promotion runs through the brief intake and governance prompt
