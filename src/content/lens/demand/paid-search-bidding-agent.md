---
title: "Paid-search bidding agent with margin-aware optimisation"
stack: demand
description: "An automated bidding agent that adjusts paid-search bids using your margin data, not the platform's CPA target. Recovers profitable keywords platform-side smart bidding abandons."
outputs: "Bidding agent, margin-aware bid logic, recovery playbook"
readMin: 11
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["paid-search", "analytics"]
models: ["claude-4.5-sonnet", "gpt-5"]
publishedAt: 2026-05-22
status: live
preview: false
---

## The brief

Google and Microsoft's automated bidding strategies optimise against the inputs you give them. The inputs are typically a target CPA or ROAS based on revenue. They don't know your margin. They don't know that a £40 sale of Product A has 8x the contribution of a £40 sale of Product B. The platforms bid identically against both, and your bids drift toward whatever the platform's model believes is "efficient" by revenue alone.

This playbook installs a layer above platform bidding that adjusts bids using your actual margin data. Profitable-but-undiscovered keywords get bid up. Revenue-rich-but-margin-poor keywords get throttled. The agent runs daily, applies bounded adjustments, and respects the platform's learning phase.

## The pipeline

Five phases.

**Phase 1, margin map.** For each product, SKU or category, log the contribution margin. Real numbers rather than "premium" or "standard" tags. The agent only works with quantitative margin data.

**Phase 2, query-to-product mapping.** For each search query in the account, map to the product or category it intends. This is the harder data work. The model assists by clustering queries and proposing mappings, but a marketing operator validates. Mis-mapped queries lead to wrong bids.

**Phase 3, margin-aware bid calculation.** Daily, for each ad group, compute recent conversion volume, average margin per conversion (from Phase 1+2), and effective margin-adjusted ROAS. Compare against the target. Adjust bid recommendations bounded ±15% per cycle.

**Phase 4, platform interface.** The agent submits bid recommendations via the Google Ads or Microsoft Advertising API as bid adjustments at the ad group or keyword level. It does not override automated bidding strategies. It sets the targets the strategies optimise against.

**Phase 5, guardrails and review.** The agent has hard limits, no daily change >15%, no bid below the floor for brand-protection keywords, no bid above the ceiling for unknown query patterns. Weekly human review on the changes the agent made and the changes it wanted to make but was blocked from.

## The eval gates

**Eval 1, margin-weighted ROAS lift.** The agent should improve margin-weighted ROAS within 4-6 weeks of installation. Below baseline at 6 weeks, the agent is mis-calibrated or the margin data is wrong.

**Eval 2, revenue-only ROAS protection.** Margin optimisation must not collapse revenue ROAS by more than 5%. If it does, the agent is over-throttling high-volume keywords. Tune the bounds.

**Eval 3, query-mapping accuracy.** Sample 50 recent queries. The agent's product mapping should match a human's classification 90%+. Lower, and the bids are being adjusted against wrong margins.

## The failure modes

**Bad margin data poisons the whole system.** If the brand's margin map is wrong or stale, every adjustment compounds the error. Audit the margin data quarterly. Margins drift as costs change.

**Platform learning phase resets.** Big bid changes trigger the platform to re-enter learning, which can lose two weeks of optimisation. The ±15% daily cap exists to keep changes inside the platform's tolerance.

**Brand-keyword cannibalisation.** Margin-aware bidding sometimes wants to under-bid brand keywords because the margin doesn't justify the bid. Hold the line, because brand-keyword underbidding lets competitors bid against you. Hard floor on brand-keyword bids, set in the rules.

**Long-tail query starvation.** Bid adjustments based on recent volume can throttle low-volume but high-quality queries. The agent uses 30-day windows for low-volume groups (5+ conversions) and 90-day windows for very-low-volume groups (1-4 conversions) to keep the long tail responsive but stable.

## The pattern in practice

Illustrative scenarios that show common shapes margin-aware bidding takes. Specifics are illustrative and the patterns repeat.

**D2C, growth-stage, the margin gap.** A brand with multiple product categories at meaningfully different margins. Platform bidding treats them as equal-revenue. Installing and tuning the agent over 4–8 weeks typically lifts margin-weighted ROAS materially while accepting a small revenue-ROAS dip. Net contribution from paid-search rises despite slightly lower revenue, the right trade for most brands with margin spread.

**B2B SaaS, scale-stage, the self-bidding rationalisation.** A brand bidding against itself across multiple product lines. The agent rationalises bids based on which queries actually convert to which products. Cost per qualified opportunity drops without hitting volume, because the bids the brand was placing against itself were noise rather than signal.
