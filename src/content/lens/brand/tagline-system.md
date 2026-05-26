---
title: "Tagline system, generate, eval, A/B"
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

A tagline is a long bet. The wrong tagline isn't disastrous, but it puts months of brand surface saying the wrong thing. The right tagline punches above its weight for years. Teams that pick by committee usually pick the safe one. Teams that pick by founder gut usually pick the one only the founder loves.

This playbook is the discipline. Generate broadly, filter by rule, finalise by A/B. The output is a defensible shortlist of 8 to 15 candidates and a test design that picks the winner against a real metric rather than a vote.

## The pipeline

Four phases.

**Phase 1, strategy intake.** What does the tagline need to do? Anchor positioning, signal category, reduce friction, claim a virtue, evoke a feeling. Pick one primary job, max two. Taglines that try to do four jobs end up doing none.

**Phase 2, generation.** Six tagline strategies in parallel. Declarative claim, command, double-meaning, contradiction-frame, verb-phrase, single-noun. Each strategy produces 30 to 40 candidates. Around 200 total.

**Phase 3, filtering.** Six filters applied sequentially. Trademark first-pass, phonetic and memorability score, category-distinctiveness score, fit-to-positioning, voice match, length and cadence. Most candidates die in filtering. The top 8 to 15 survive.

**Phase 4, A/B test design.** The shortlist needs a real test. The pipeline produces a test design. Which channel to test on, which metric to measure, minimum sample, runtime, decision rule. Not every brand can run a perfect A/B. The design downgrades gracefully to "show three to ten customer-facing people and watch their reaction" when proper testing isn't available.

## The eval gates

**Eval 1, generation diversity.** Pipeline should produce variety across strategies. If 80% of survivors come from one strategy, the brief is biasing toward a single shape, so broaden the intake.

**Eval 2, trademark headroom.** Every shortlist candidate gets a first-pass trademark check. Same rules as the naming playbook. First-pass only, no substitute for an attorney for the final pick.

**Eval 3, positioning fidelity.** Each shortlist candidate is scored on whether it advances the positioning brief. A tagline that sounds great but doesn't move the brand's strategic ground is a poster rather than a tagline.

## The failure modes

**The "safe" candidate wins by default.** Committee voting reliably picks the lowest-friction option, which is usually the least distinctive. Either commit to an A/B test, or pre-commit that one named decision-maker picks and then defends the choice. Hybrid voting is worst-case.

**Taglines outlive their relevance.** A tagline that fit when the brand was niche may not fit at scale. Quarterly check. Is the tagline still pulling weight? If brand surfaces have been quietly dropping it from layouts, the tagline is dying. Plan the replacement.

**Two-job taglines.** "Faster, smarter, kinder marketing" is a list rather than a tagline. Limit the brief to one job. If you can't pick which job matters most, the positioning isn't ready and the tagline pipeline will just expose that.

**Found in translation, lost in another.** A tagline that works in the brand's primary market may have no resonance (or bad resonance) in a secondary market. If multi-market launch is planned, run the pipeline in each language with native-speaker filtering. Don't translate, recompose.

## The pattern in practice

Illustrative scenarios that show common shapes a tagline sprint takes. Specifics are illustrative and the patterns repeat.

**Wellness brand, growth-stage, the audit-to-tagline flip.** A brand running an existing tagline for years that doesn't match what its customers thank it for. A positioning audit surfaces the gap. The tagline sprint produces a shortlist anchored in what customers actually say. Three finalists A/B-test on paid social. The winner, typically the one closest to the verbatim customer language, lifts CTR materially and holds the lift over the following season.

**B2B SaaS, scale-stage, the genericness check.** A brand about to ship a "Marketing, Reimagined"-shaped tagline as a rebrand cornerstone. The sprint flags it as generic, since several other SaaS brands have used similar phrasing in recent years. The shortlist surfaces something with the same root insight but a structure no other brand is using. The differentiation is what makes the tagline durable.
