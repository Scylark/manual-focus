---
title: "Attribution tear-down using GA4 and incrementality signals"
stack: demand
description: "Untangle channel attribution using GA4, incrementality and a contradiction-surfacing pass. Find overclaiming channels and the ones quietly working."
outputs: "Channel value summary, attribution gaps report, recommended changes"
readMin: 10
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["analytics", "paid-search", "paid-social", "seo"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-06-02
status: live
preview: false
---

## The brief

Attribution is a lie everyone agrees to. GA4 says one thing. Meta's pixel says another. Google says a third. Sales attribution says a fourth. The brand picks the one that's most flattering and tells the CFO that story. Six months later, nobody knows which channels are actually working.

This playbook does the honest version. It cross-references multiple attribution surfaces (GA4 data-driven, last-click, MTA, brand survey lift, geo-incrementality if available) and surfaces the channels where the systems disagree most. Disagreement is the signal — channels that everyone agrees on are probably real; channels with massive variance across systems are usually being over- or under-credited.

This is not a media-mix-model and doesn't pretend to be. It's a structured cross-reference that finds the gaps in your current understanding.

## The pipeline

Five phases.

**Phase 1 — Attribution sources collection.** Pull conversion-attribution data from at least three sources: GA4 (data-driven attribution + last-click), the platform pixel for each major paid channel, and either MMM output (if available) or recent incrementality test results. Normalise into a single conversion-by-channel-by-week table.

**Phase 2 — Cross-source consistency check.** For each channel, compute the coefficient of variation across sources. Channels where all sources agree (CV <0.2) are stable. Channels where CV >0.5 are contested — the attribution story is unreliable.

**Phase 3 — Brand-impact decomposition.** Pull branded search query volume by week. Correlate against upper-funnel spend (display, paid social brand campaigns, PR coverage). The lift in branded search after brand spend is a cleaner read on brand impact than the channel platforms themselves report.

**Phase 4 — Contradiction surfacing.** For each contested channel (CV >0.5), the model generates a hypothesis-list: which source is most plausible and why. Hypothesis types: platform self-credit bias, view-through over-credit, last-click under-credit, multi-device gaps. The output is a ranked list, not a single answer.

**Phase 5 — Recommendation.** Three concrete bets: which channel is most likely under-credited (invest more), which is most likely over-credited (cut or test), which needs a controlled incrementality test to resolve. Each comes with the proposed test design.

## The eval gates

**Eval 1 — Cross-source completeness.** The pipeline needs at least three sources to produce meaningful output. Two sources is binary and uninformative. Don't run until you can pull three.

**Eval 2 — Time-window stability.** Cross-source disagreements should be stable across 4-week and 12-week windows. If a channel is contested in the 4-week window but agreed-on in the 12-week window, the disagreement is short-term noise (creative change, seasonality). Use the longer window for recommendations.

**Eval 3 — Test design soundness.** Every recommended incrementality test gets a basic statistical-power check. Minimum detectable lift, required sample size, runtime. A test that needs 40 weeks to detect a 5% lift isn't a useful test. Either accept a larger detectable threshold or accept that the channel can't be cleanly resolved.

## The failure modes

**Platform self-credit goes uncorrected.** Every platform credits itself generously. The pipeline can flag this, but if the brand acts on Meta's reported conversions as ground truth, the recommendations will be wrong. Always weight platform-reported numbers below GA4's data-driven attribution.

**Brand-search correlation isn't causation.** Branded search rises for many reasons (PR, organic word-of-mouth, seasonal). Don't credit upper-funnel paid solely on branded-search lift unless you can rule out the alternatives. The pipeline notes correlation, not causation.

**Incrementality tests get cancelled.** When the geo-holdout test starts costing revenue, finance asks to stop. The temptation is to call the partial data the answer. Resist — partial tests over-attribute to the channel because the holdout hasn't bottomed out yet. Either run to completion or don't run at all.

**The team treats the output as a verdict.** The pipeline produces a list of probable misattributions. It's a starting point for tests, not a final answer. Treating it as the verdict is exactly the failure the pipeline is meant to fix.

## The pattern in practice

Illustrative scenarios — common shapes attribution tear-downs take. Specifics are illustrative; the patterns repeat.

**D2C, scale-stage — the over-credited channel.** A brand crediting paid social with around 45% of acquisitions. Cross-reference finds GA4 data-driven attribution at ~28%, the platform pixel at ~52%, an incrementality test at ~19% — wide variance, so the channel is contested. A bounded test cut typically holds revenue within a few percentage points while releasing budget for an under-credited channel (often SEO content) that pays back within two quarters.

**B2B SaaS, growth-stage — the under-credited brand effect.** A brand about to kill Display because GA4 last-click reports near-zero. The tear-down surfaces a measurable branded-search lift on weeks when Display runs heavily. Keeping Display, making it cheaper and more targeted, holds the branded-search lift. Display moves from "kill" to "small but earning" because the right metric for it was upstream, not last-click.
