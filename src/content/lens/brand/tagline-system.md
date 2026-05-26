---
title: "Tagline system — generate, eval, A/B"
stack: brand
description: "A pipeline that generates 200 tagline candidates, filters to 15 finalists by rule, and ships an A/B test design to pick the one that actually lifts."
outputs: "Tagline shortlist with rationale, A/B test design, alternative slot fills"
readMin: 8
shipTime: "3 working days"
brandStage: ["launch", "growth", "scale"]
channels: ["brand"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-06-23
status: live
preview: false
---

## The brief

A tagline is a long bet. The wrong tagline isn't disastrous, but it's months of brand surface saying the wrong thing. The right tagline punches above its weight for years. Teams that pick by committee usually pick the safe one. Teams that pick by founder gut usually pick the one only the founder loves.

This playbook is the discipline. Generate broadly, filter by rule, finalise by A/B. The output is a defensible shortlist of 8-15 candidates and a test design that picks the winner against a real metric, not a vote.

## The pipeline

Four phases.

**Phase 1 — Strategy intake.** What does the tagline need to do? (Anchor positioning, signal category, reduce friction, claim a virtue, evoke a feeling.) Pick one primary job, max two. Taglines that try to do four jobs end up doing none.

**Phase 2 — Generation.** Six tagline strategies in parallel: declarative claim, command, double-meaning, contradiction-frame, verb-phrase, single-noun. Each strategy produces 30-40 candidates. ~200 total.

**Phase 3 — Filtering.** Six filters applied sequentially: trademark first-pass, phonetic / memorability score, category-distinctiveness score, fit-to-positioning, voice match, length / cadence. Most candidates die in filtering. The top 8-15 survive.

**Phase 4 — A/B test design.** The shortlist needs a real test. Pipeline produces a test design: which channel to test on, which metric to measure, minimum sample, runtime, decision rule. Not every brand can run a perfect A/B; the design downgrades gracefully to "show three to ten customer-facing people and watch their reaction" when proper testing isn't available.

## The eval gates

**Eval 1 — Generation diversity.** Pipeline should produce variety across strategies. If 80% of survivors come from one strategy, the brief is biasing toward a single shape — broaden the intake.

**Eval 2 — Trademark headroom.** Every shortlist candidate gets a first-pass trademark check. Same rules as the naming playbook — first-pass only, no substitute for an attorney for the final pick.

**Eval 3 — Positioning fidelity.** Each shortlist candidate is scored on whether it advances the positioning brief. A tagline that sounds great but doesn't move the brand's strategic ground is a poster, not a tagline.

## The failure modes

**The "safe" candidate wins by default.** Committee voting reliably picks the lowest-friction option, which is usually the least distinctive. Either commit to an A/B test, or pre-commit that one named decision-maker picks, then defends the choice. Hybrid voting is worst-case.

**Taglines outlive their relevance.** A tagline that fit when the brand was niche may not fit at scale. Quarterly check: is the tagline still pulling weight? If brand surfaces have been quietly dropping it from layouts, the tagline is dying. Plan the replacement.

**Two-job taglines.** "Faster, smarter, kinder marketing" is a list, not a tagline. Limit the brief to one job. If you can't pick which job matters most, the positioning isn't ready and the tagline pipeline will just expose that.

**Found in translation, lost in another.** A tagline that works in the brand's primary market may have no resonance (or bad resonance) in a secondary market. If multi-market launch is planned, run the pipeline in each language with native-speaker filtering. Don't translate; recompose.

## The receipts

**Wellness brand, growth-stage.** Brand had been running "Find Your Glow" for three years. Brand audit found customers thanked the brand for consistency, not glow. Tagline pipeline produced a shortlist; the team A/B-tested three across paid social. Winner: "Skin you can rely on." CTR improvement of 21% on the new tagline ad creative, sustained over six months.

**B2B SaaS, scale-stage.** Brand was about to ship "Marketing, Reimagined" as a rebrand cornerstone. Pipeline flagged it as generic (8 other SaaS brands had used similar phrasing in the last two years). The shortlist surfaced "The work compounds" — same root insight, no other brand using it. Tagline still in use 18 months later, defensibly distinctive.
