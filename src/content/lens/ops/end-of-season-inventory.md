---
title: "End-of-season inventory and clearance"
stack: ops
description: "Manage the end-of-season inventory cycle for seasonal endurance gear. Forecast accuracy, clearance timing, channel sequencing, brand-protective discounting."
outputs: "Inventory forecast, clearance calendar, channel rules, discount governance"
readMin: 10
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["paid-search", "paid-social", "email", "lifecycle"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-09-03
status: live
preview: false
---

## The brief

Endurance gear is seasonal. Winter kit doesn't sell in March; spring
shoes don't sell in November. Brands that aren't disciplined about
the end-of-season cycle end up with two recurring problems: dead
inventory tying up capital, or aggressive late-season discounting
that trains the audience to wait for sales.

This playbook is the operational discipline. Forecast accuracy
that reduces over-order, clearance calendar that times discounts
to the audience's actual buying windows, channel sequencing that
protects full-price channels from being undercut by clearance, and
discount governance that stops the brand discounting itself into a
discount brand.

## The pipeline

Five phases.

**Phase 1 — Forecast accuracy.** Most brands over-order
because forecasting is a guess wrapped in optimism. Improve by
combining:

- **Prior-year sell-through** by SKU, by week, by channel
- **Pre-order data** for the current season where available
- **Channel-mix shifts** — if the brand grew DTC share 30%, the
  retailer order pattern changes
- **Macro signals** — weather forecasts for the season, race
  calendar density, audience segment growth
- **Competitive signals** — has a competitor over-ordered (often
  visible six weeks ahead via their early discounting)?

The forecast outputs a quantile range (P25 / P50 / P75) per SKU,
not a single number. Production orders take the P25–P50 range
unless the SKU has unusual upside; over-ordering at the P75 is
the discipline failure that creates clearance pressure.

**Phase 2 — Mid-season early-warning.** Six to eight weeks before
season end, run a sell-through health check by SKU:

- SKUs tracking at or above P50 forecast: standard end-of-season
  handling
- SKUs tracking below P25: early intervention required
  (intensification of marketing for the SKU, retail-partner support,
  or early staged clearance)
- SKUs with critical stock-out risk: replenishment decision if
  manufacturing window allows

Mid-season early-warning prevents the late-season "everything must
go" panic that defines the brands without this discipline.

**Phase 3 — Clearance calendar.** Sequenced phases:

- **Soft launch (8 weeks pre-season end)** — discounts on the
  SKUs already tracking below P25. Quiet, channel-specific, not
  brand-wide promoted.
- **Member-first (6 weeks pre-end)** — if the brand has a
  subscription / membership, members get clearance access first.
  Earns goodwill, doesn't broadcast to the broader audience.
- **Email-list clearance (4 weeks pre-end)** — opt-in email list
  gets the broader clearance offer. Audience self-selects in.
- **Public clearance (2 weeks pre-end)** — broader paid programme
  + organic social. This is what most brands do as their entire
  clearance — but by this point the brand has already worked
  through the most urgent SKUs.
- **Final clearance (post-season)** — deep discounting on remaining
  inventory. Routed through outlet partners or the brand's own
  outlet channel, not through the main brand surface.

The sequence avoids two failures: training the broader audience to
wait for sales (because public clearance happens later and is
narrower), and dumping inventory at devastating margins (because
intervention starts earlier).

**Phase 4 — Channel sequencing rules.** What discounts run on which
channels in which order:

- **Retail partners (Tier A and B)** — first access to clearance
  pricing on excess inventory the brand is offering. Partners
  appreciate getting first crack; protects the channel relationship.
- **Brand DTC site** — clearance section, time-bracketed.
- **Outlet partners** — last 10–15% of remaining inventory.
- **NEVER** — primary brand surface as the entry to clearance
  (homepage takeover sale). The brand surface is for full-price
  product; clearance is a sub-experience.

**Phase 5 — Discount governance.** Hard rules:

- **No flagship-product discounts** outside controlled clearance
  windows. The brand's hero products stay full-price all season.
- **Max discount depth** — typically 30–40% in mid-clearance, 50%+
  only in final/outlet. Anything over 50% on brand-surface
  channels signals desperation.
- **Bundle / value-add over price-down** where possible — "free
  shipping," "free fit consultation," "spare laces in the box"
  preserves price perception while moving units.
- **Audience-segmented eligibility** — members / email-list /
  retail partners get different access tiers. Don't run identical
  pricing across all audiences.

Every discount runs through the governance check before deploying.
Marketing teams resist this; the price-erosion damage is the
reason it exists.

## The capability boundary

What AI helps with:

- **Forecasting** — production-with-guardrails; the model combines
  historical and macro signals, humans approve the production order
- **Mid-season early-warning detection** — automated flagging based
  on sell-through curves
- **Discount-impact analysis** — predicting price-elasticity per SKU
  / channel
- **Clearance communication drafting** — the channel-specific
  emails and ads
- **Bundle-design** — surfacing combinations that move units
  without breaking price

What AI doesn't help with:

- **The production order decision.** Human judgement, with the
  forecast as input.
- **The discount-governance enforcement.** That's an org discipline
  — the model can flag violations, humans hold the line.

## The eval harness

**Eval E1 — Sell-through ratio.** End-of-season sell-through across
the full range. Target 80%+. Below that, the season's forecasting
needs review.

**Eval E2 — Margin erosion.** Average realised margin across the
season. Climbing erosion year-on-year signals the brand is
discounting itself toward a discount brand.

**Eval E3 — Audience training.** Track first-time-buyer behaviour
post-clearance. If new customers' first purchases concentrate on
clearance SKUs at clearance pricing, the brand is acquiring
discount-conditioned customers — bad for LTV.

**Eval E4 — Channel coverage.** Has clearance flowed through the
sequenced channels in order, or did the team jump straight to
public clearance under pressure? Audit annually.

## The failure modes

**Over-ordering at P75.** Most common forecast failure. Holding the
production order at the P25–P50 range produces marginally fewer
units in stock-out years and dramatically less clearance pressure.

**Public-channel-first clearance.** "Email blast: 40% off
everything!" — teaches the audience that the brand discounts;
trains them to wait next season. The sequence is the discipline.

**Discount-cycle creep.** Brand starts running "spring sale," "summer
sale," "autumn sale," "winter sale" because each year's clearance
got broader. The audience now expects four sales a year minimum.
Reset the cycle — even at short-term revenue cost.

**No mid-season warning.** Forecast fails silently. The brand only
notices at week-of-season-end. Mid-season check at 6–8 weeks pre-
end is the institutional habit.

**Outlet that competes with the brand surface.** Outlet too
visible in the brand's primary marketing; audience clicks through
to the outlet for the discount instead of buying full price.
Outlet should be discoverable but not promoted.

## The receipts

**Premium cycling brand, scale-stage.** Brand had been running
season-end clearances 35–40% off entire range. Audience had learnt
to wait. We installed the sequenced calendar; the public clearance
moved to 4 weeks pre-end and stayed narrower. First-time-buyer
share at full-price climbed 22% within two seasons. Margin erosion
reversed; net contribution per unit up 17%.

**Trail running brand, growth-stage.** Brand was over-ordering at
P80 because production was offshore with long lead times. We re-
calibrated to P50 with a faster re-order line for the strongest
SKUs. End-of-season sell-through up from 62% to 79% in one cycle.
Less clearance pressure, less brand-margin damage.

**Multi-sport brand, partial-failure engagement.** Pipeline ran;
the brand's marketing team executed the sequence in spring but
broke discipline in winter under pressure to hit revenue targets,
running a brand-surface 40% off campaign. Sell-through hit
short-term but next-season's full-price purchase rate dropped.
Lesson: the discipline has to be defended quarterly. One break
costs more than the break recovers.

## Hand-off

End-of-season inventory connects to:
- **gear-launch-sequence** — next-season launches start while this-
  season's clearance is running; the sequencing matters
- **retail-partner-programme** — Tier A and B partners get first
  clearance access
- **subscription-membership** — members get member-first clearance
- **lifecycle-journey-builder** — email-list clearance touchpoints
  routed through lifecycle
