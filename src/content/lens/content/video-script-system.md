---
title: "Video script system — brief to shootable script"
stack: content
description: "Convert a marketing brief into a shootable script with beats, B-roll suggestions, captions and a thumbnail brief. Saves a producer's week."
outputs: "Scripted shoot doc, B-roll list, caption draft, thumbnail brief"
readMin: 9
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["video", "content", "organic-social"]
models: ["claude-4.5-sonnet", "gpt-5"]
publishedAt: 2026-06-16
status: live
preview: false
---

## The brief

Most marketing video gets shot from a one-page outline and improvised on the day. The result is variable — when the talent is good, the video works; when they're tired, the video drags. Professional studios solve this with full scripts and beat-sheets. In-house teams rarely have the time.

This playbook produces the script professional studios produce, in a day. The pipeline takes a brief and outputs: a beat-by-beat shoot script with timing, B-roll cut suggestions, on-screen text recommendations, a draft caption for the post, and a thumbnail brief for the design team.

## The pipeline

Five phases.

**Phase 1 — Brief intake.** Required: video purpose (educate / convince / launch / entertain), length (30s / 60s / 3min / 8min — formats differ meaningfully), platform mix, the single key takeaway, the spokesperson, the proof or example.

**Phase 2 — Beat sheet.** The model generates a structured beat sheet appropriate to the length. A 60-second video has 4-6 beats. An 8-minute video has 12-18 beats. Each beat has: time mark, on-screen action, dialogue (with timing), B-roll opportunity, on-screen text.

**Phase 3 — Hook strength check.** The first 3 seconds determine retention. The model generates 3 hook options scored on specificity, contradiction, and pattern-break. Producer picks one before the rest of the script writes.

**Phase 4 — Full script.** Each beat expanded with dialogue, action notes, and timing. The script is in production format (talent's lines clearly marked, B-roll in brackets, on-screen text in caps). Designed to be shootable as-is.

**Phase 5 — Asset briefs.** Companion outputs: 3-5 thumbnail concepts for design, a caption draft for the post, a shortlist of B-roll the producer should source ahead of the shoot.

## The eval gates

**Eval 1 — Length adherence.** Spoken-word count maps to time at ~150 words / minute. If the script's word count implies a runtime more than 15% over target, it's too long. Trim. (Most first-draft scripts run long.)

**Eval 2 — Hook quality.** All three hook options run through a "would you swipe past this in feed?" assessment. At least one option should score "no swipe — would continue watching." If all three feel skippable, regenerate with more specific examples in the brief.

**Eval 3 — Talent-able.** The dialogue should be speakable by a human in front of a camera. Sentences over 30 words are flagged — most talent stumbles on long sentences in single-take production. Break them up.

## The failure modes

**Scripts that read well don't shoot well.** Written sentences sometimes have rhythms that don't survive being said aloud. The pipeline includes a "say it out loud" check — if the model can't easily speak a sentence in one breath, the talent can't either.

**Talent goes off-script.** Some talent improvises. If the talent is good, this is fine; if they're not, you've lost the script's discipline. Build a "freeze words" list — phrases the talent must hit verbatim — and accept improvisation in between.

**B-roll asks for impossible footage.** "Cut to wide shot of customer using product in natural light" is fine if you've shot a customer using the product. If you haven't, you'll either reshoot or replace with stock that doesn't match. The B-roll suggestions should match assets the brand already has or can credibly capture in the shoot.

**On-screen text fights with dialogue.** Captions that compete with what's being said split the viewer's attention. The pipeline aligns on-screen text with key takeaways, not with running dialogue. Static keywords, not running subtitles.

## The receipts

**B2B SaaS, scale-stage.** Brand was shooting one explainer video a month, taking a full week of producer time per video, retention rates around 30% at 30 seconds. Pipeline cut script-prep from 3 days to 1. Retention at 30 seconds up to 52% after the hook-quality gate started enforcing.

**D2C, growth-stage.** Brand wanted to ship 4 product videos a month, only had a small in-house team. Pipeline plus a 1-day shoot day per week produced 4-5 videos per week. The unlock was the shootable-script discipline — the team stopped improvising on the day and started executing a tight plan.
