---
title: "Social-content factory with channel-native generation"
stack: content
description: "A production line for organic social that respects channel native form, rather than cross-posting the blog. Generates the week's content from a single brief, gates per channel."
outputs: "Weekly social content set, channel-native variants, scheduling spec"
readMin: 10
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["organic-social", "content", "video"]
models: ["claude-4.5-sonnet", "gpt-5"]
publishedAt: 2026-06-09
status: live
preview: false
---

## The brief

Most brands' organic social is cross-posted blog excerpts. They underperform because LinkedIn is not Twitter is not Instagram is not TikTok. Native form on each platform is different, including opening hook, length, pacing, format, and the social contract with the reader.

This playbook turns one weekly story brief into channel-native content for the four social channels the brand actually runs. Each output respects its platform. LinkedIn opens with the hook on line one, TikTok scripts assume sound-off, Twitter or X compresses the argument, Instagram leans on a single strong image. The pipeline drafts, the per-channel rubrics gate, and the output ships into the scheduler.

## The pipeline

Four phases.

**Phase 1, story brief intake.** One brief per week. Required fields are the core insight (one sentence), the broader argument (3 to 5 sentences), the proof (data, customer story, expert quote), the spokesperson (if any), and the channel mix for the week.

**Phase 2, channel-native drafting.** For each active channel, the model drafts to the channel's native form using a channel-specific prompt. Same story, four different shapes. The prompts encode the platform's actual best practices, not the brand's general voice rules.

**Phase 3, channel-specific gating.** Each draft runs through a channel-specific rubric (LinkedIn hook on line 1, no tags-as-titles, TikTok script under 90 seconds spoken, Twitter under thread of 7 tweets, Instagram caption ≤200 words with image brief).

**Phase 4, scheduling output.** Outputs are structured for the team's scheduler (Buffer, Hootsuite, native scheduling). Each post is tagged with the channel-native check report so the social manager knows what was checked.

## The channel prompts

The LinkedIn prompt is the one that holds the bar highest because LinkedIn is where polish matters most.

```text
SYSTEM: You write LinkedIn posts for a specific brand. You write like
someone who's done the work, not like someone selling. The opening line
is everything — it's the only line a reader sees before they decide
to expand. After expansion, you keep them with concrete specifics, not
generalities.

LinkedIn-specific rules:
- Line 1 ≤ 75 chars. State the insight, do NOT tease.
- Line break between line 1 and line 2 (gives the truncation breath).
- Body paragraphs of 1-2 lines, separated by line breaks.
- One specific number or named example in the first paragraph after
  the hook.
- Closing line is a single thought, not a question. Posts that end on
  a question feel beg-y.
- No more than 3 hashtags, all in the bottom block.
- No "Hot take:" "Unpopular opinion:" or any inheritance from
  X / Twitter convention.

USER:
The brand: {BRAND_CONTEXT}
The week's story:
{STORY_BRIEF}
The proof point to anchor:
{PROOF_POINT}
The spokesperson (whose voice this is in): {SPOKESPERSON}
Length: 100-200 words.

Draft. Return JSON:
{
  "post_body": "<the post>",
  "hashtags": ["...", "..."],
  "image_brief": "<one-sentence description for the asset team>",
  "checks": {
    "line_1_length": <number>,
    "line_1_states_insight": <true | false>,
    "specific_number_in_para_1": <true | false>,
    "ends_on_statement_not_question": <true | false>,
    "word_count": <number>
  }
}
```

Full prompt library for TikTok scripts, Twitter / X threads, Instagram captions, and YouTube Shorts hooks ships with the playbook download.

## The eval gates

**Eval 1, channel-rule pass rate.** Each channel's deterministic rules (hook length, line breaks, hashtag count, and so on) must pass. Hard block.

**Eval 2, cross-channel-but-not-cross-posted.** Compute pairwise similarity across the week's outputs on different channels. The same story should produce variants with high topical similarity (0.6 to 0.8) but low textual similarity (below 0.4). If textual similarity is high, the pipeline has cross-posted with cosmetic changes, so regenerate the failing channel.

**Eval 3, voice match.** Channel-native posts still need to match the brand voice profile. Voice rubric applies. Lower pass threshold than long-form (some channel-native form fights with voice rules) but voice must still register.

## The failure modes

**The team falls back to cross-posting.** When the pipeline misfires once, teams default to cross-posting "to stay on schedule." Resist. A missed channel for a week is fine. A cross-posted LinkedIn excerpt sits dead and trains the algorithm to deprioritise the brand. Empty is better than bad.

**Channel best practices change.** Platform algorithms shift. The channel prompts encode current best practices and need refreshing every 6 to 12 months. Treat the prompts as living documents, not stone tablets.

**Spokesperson voice drift.** Posts attributed to a named person should sound like that person. Build a sub-profile for each named spokesperson and route through it. Generic "the brand says" voice on a named-person post breaks the trust.

**Hashtag spam.** Some old-school playbooks recommend 10+ hashtags per Instagram post. Modern algorithms penalise this. The pipeline caps hashtags at the platform's tolerance and validates against current best practice quarterly.

## The pattern in practice

Illustrative scenarios that show common shapes channel-native social work takes. Specifics are illustrative and the patterns repeat.

**D2C apparel, growth-stage, the cross-post fix.** A brand cross-posting one blog excerpt across four channels weekly. Switching to channel-native variants for a quarter typically lifts engagement substantially on every channel, multiples on LinkedIn and Instagram, often much larger lifts on TikTok (from a low base). The cross-posted excerpts had been training the algorithms to deprioritise the brand for months. The channel-native rebuild reverses that.

**B2B SaaS, scale-stage, the second-channel addition.** A brand active on LinkedIn only. Expanding to LinkedIn plus Twitter or X with channel-native form typically generates more pipeline-qualified inquiries from Twitter or X in a quarter than a year-plus of LinkedIn-only posting produced. The channel is different but the audience overlap is real. Most senior marketing audiences live on both, just in different registers.
