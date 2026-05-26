---
title: "Social-content factory with channel-native generation"
stack: content
description: "A production line for organic social that respects native form on each channel. Generates the week's content from a single brief, gates per channel."
outputs: "Weekly social content set, channel-native variants, scheduling spec"
readMin: 21
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["organic-social", "content", "video"]
models: ["claude-4.5-sonnet", "gpt-5"]
publishedAt: 2026-06-09
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **weekly story brief template** with the core insight, the broader argument, the proof, the spokesperson and the active channel mix on one page.
2. **Channel-native drafts** for every active channel (LinkedIn, Instagram, X, TikTok, YouTube Shorts where applicable) generated from a single brief.
3. A **per-channel gating layer** that hard-blocks any draft that fails the channel's deterministic rules (hook length, hashtag count, line break shape, character limits).
4. A **scheduling spec** with publish slot per channel based on the brand's audience timezone activity, ready to push into Buffer, Hootsuite or the platform-native scheduler.
5. A **performance ledger** logging 7-day and 30-day engagement per post per channel, feeding the quarterly tune-up that keeps the channel prompts current.

## Who this is for

A growth or scale-stage brand running organic on three or more social channels with a social manager who can hold the weekly brief and is willing to enforce channel-native form over cross-posting. If the brand only runs one channel, the playbook still works but the throughput unlock is smaller. If the brand has no clear voice profile, the channel-native drafts will read as four different brands.

## Before you start

- [ ] LinkedIn company page admin plus access to founder or spokesperson personal pages where relevant
- [ ] Instagram, X, TikTok, YouTube Shorts accounts active on the channels in scope
- [ ] Voice profile from the brand-voice-extraction playbook, plus sub-profiles for named spokespeople
- [ ] Scheduler (Buffer, Hootsuite, Later, Sprout Social) connected to all channels
- [ ] Asset library tagged via the segment-broll-production pipeline (or a working DAM equivalent)
- [ ] Claude Sonnet 4.5 for high-volume drafting, Claude Opus 4.5 or GPT-5 for the higher-stakes hero posts
- [ ] A brief template the team populates each Monday
- [ ] Banned phrase list per channel and brand-wide

If the asset library is empty, the image-brief output from the pipeline becomes a real cost rather than a tag-and-route operation. Solve the library first.

## The pipeline

Four phases. Build the channel prompts in a working week, then run the pipeline weekly in 90 minutes.

### Phase 1, story brief intake

One brief per week. The brief is the source of every channel draft.

**Step 1.1, populate the brief template.**

- Core insight (one sentence, the thing the audience should walk away with)
- Broader argument (three-to-five sentences, the case the insight rests on)
- Proof (data, customer story, expert quote, source URLs)
- Spokesperson (if any, plus their sub-voice-profile slug)
- Active channels for the week
- Image or video asset references from the DAM
- Banned phrases (brand-wide plus any channel-specific)
- Publish window (which day, time bands per channel)

**Step 1.2, validate the brief.**

The brief either has these fields or it does not. The validator is deterministic, not a model call. Missing fields block the pipeline.

You should now have a populated weekly brief.

### Phase 2, channel-native drafting

For each active channel, the model drafts to that channel's native form.

**Step 2.1, run the LinkedIn drafting prompt.**

LinkedIn is the channel where polish matters most.

```text
SYSTEM: You write LinkedIn posts for a specific brand. You write like
someone who has done the work, not someone selling. The opening line
is everything, it is the only line a reader sees before they decide
to expand. After expansion, you keep them with concrete specifics,
not generalities.

LinkedIn-specific rules:
- Line 1 under 75 characters. State the insight. Do not tease.
- Line break between line 1 and line 2 (gives the truncation breath).
- Body paragraphs of 1 to 2 lines, separated by line breaks.
- One specific number or named example in the first paragraph after
  the hook.
- Closing line is a single thought, not a question. Posts ending on
  a question feel beg-y.
- No more than 3 hashtags, all in the bottom block.
- No "Hot take:" or "Unpopular opinion:" or other X-inherited
  conventions.
- No exclamation marks. No em dashes. No semicolons in prose.

USER:
Brand context: {BRAND_CONTEXT}
The week's story: {STORY_BRIEF}
The proof point to anchor: {PROOF_POINT}
The spokesperson (whose voice this is in): {SPOKESPERSON}
Voice profile: {VOICE_PROFILE_SHORT}
Length: 100 to 200 words.

Draft. Return JSON:

{
  "post_body": "<the post>",
  "hashtags": ["<tag>", "..."],
  "image_brief": "<one sentence for the asset team>",
  "checks": {
    "line_1_length": <int>,
    "line_1_states_insight": <true | false>,
    "specific_number_in_para_1": <true | false>,
    "ends_on_statement_not_question": <true | false>,
    "word_count": <int>
  }
}
```

**Step 2.2, run the Instagram drafting prompt.**

```text
SYSTEM: You write Instagram captions for a specific brand. Instagram
reads visual-first, the image carries the moment and the caption
supports. Captions are short, the first sentence sits above the
"more" fold so the reader sees it without expanding.

Instagram-specific rules:
- First sentence under 125 characters. Anchored to the image.
- Body paragraphs of 1 to 3 sentences, line breaks between them.
- Maximum 5 hashtags. Half in the caption bottom block, half in
  the first comment.
- One specific number or named example.
- No "comment below if you agree" or other engagement-bait closes.

USER:
Brand context: {BRAND_CONTEXT}
The week's story: {STORY_BRIEF}
Image or video asset: {ASSET_REF}
Voice profile: {VOICE_PROFILE_SHORT}
Length: 80 to 200 words.

Draft. Return JSON:

{
  "caption": "<the caption>",
  "hashtags": ["<tag>", "..."],
  "first_comment_hashtags": ["<tag>", "..."],
  "image_brief": "<asset team reference>",
  "checks": {
    "first_sentence_length": <int>,
    "specific_number_present": <true | false>,
    "word_count": <int>
  }
}
```

**Step 2.3, run the X (formerly Twitter) thread prompt.**

```text
SYSTEM: You write X threads that compress an argument across 5 to 9
tweets. Each tweet is a unit, the thread is the argument. The first
tweet is the hook, the last tweet is the payoff, the middle tweets
do the work.

X-specific rules:
- Tweet 1 under 240 characters (leaves room for the thread emoji).
- Tweet 1 states the claim, does not tease.
- Each tweet under 280 characters.
- No "Thread (1/n)" preamble.
- One specific number in the first three tweets.
- Last tweet is the payoff, not a question or a CTA to follow.

USER:
Brand context: {BRAND_CONTEXT}
The week's story: {STORY_BRIEF}
Voice profile: {VOICE_PROFILE_SHORT}
Target thread length: 5 to 9 tweets.

Draft. Return JSON:

{
  "thread": [
    {"tweet_number": 1, "text": "<verbatim>", "chars": <int>},
    {"tweet_number": 2, "text": "<verbatim>", "chars": <int>}
  ],
  "checks": {
    "thread_length": <int>,
    "tweet_1_under_240": <true | false>,
    "specific_number_in_first_three": <true | false>
  }
}
```

**Step 2.4, run the TikTok script prompt.**

```text
SYSTEM: You write TikTok scripts under 90 seconds spoken. You assume
sound is off for the first three seconds, so the visual hook plus
on-screen text carries the open. The script reads like spoken
delivery, not written prose.

TikTok-specific rules:
- First 3 seconds carry an on-screen text hook plus a visual change.
- Spoken script under 90 seconds (around 220 to 240 words).
- One specific number or named example.
- On-screen text in caps, key phrases only, not running subtitles.
- Last 3 seconds carry the payoff, not a "follow for more" CTA.

USER:
Brand context: {BRAND_CONTEXT}
The week's story: {STORY_BRIEF}
Spokesperson (if any): {SPOKESPERSON}
B-roll available: {BROLL_SHOTS}

Draft. Return JSON:

{
  "script": [
    {"timecode": "00:00 to 00:03", "on_screen_text": "<caps>", "spoken_line": "<line>", "visual_direction": "<direction>"}
  ],
  "image_or_video_brief": "<one sentence>",
  "checks": {
    "spoken_word_count": <int>,
    "estimated_runtime_seconds": <int>,
    "hook_visual_within_3_seconds": <true | false>
  }
}
```

**Step 2.5, run the YouTube Shorts hook prompt if Shorts is in scope.**

YouTube Shorts shares TikTok's spoken-script shape but the audience leans slightly older and the algorithm rewards completion. Use the TikTok prompt with a 60-second cap and a hook that prioritises curiosity over pattern-break.

You should now have one draft per active channel, all sourced from the same brief.

### Phase 3, channel-specific gating

Each draft runs through its channel rubric.

**Step 3.1, the deterministic gates run.**

For each channel.

- LinkedIn, line 1 under 75 chars, line break after line 1, 1 to 2 line body paragraphs, no exclamation marks, no em dashes, max 3 hashtags
- Instagram, first sentence under 125 chars, max 5 hashtags total, no engagement-bait close
- X, tweet 1 under 240 chars, every tweet under 280 chars, no "Thread (1/n)"
- TikTok, spoken word count maps to under 90 seconds at 150 to 160 wpm, on-screen text in caps, hook visual within 3 seconds

Drafts that fail any deterministic gate regenerate.

**Step 3.2, run the cross-channel similarity check.**

Compute pairwise textual similarity across the week's outputs. The story should produce variants with high topical similarity (0.6 to 0.8) and low textual similarity (below 0.4). High textual similarity means the pipeline cross-posted with cosmetic changes. Regenerate the failing channel.

**Step 3.3, run the voice gate.**

Channel-native posts still match the brand voice profile. The voice rubric applies with a lower pass threshold than long-form (some channel-native form fights with voice rules) but voice still registers.

You should now have gated, channel-native drafts ready to schedule.

### Phase 4, scheduling and ledger

Outputs route to the scheduler with publish slots and metadata.

**Step 4.1, set the publish slots.**

Defaults.

- LinkedIn, 07:30 to 08:30 local time on weekdays for B2B audiences
- Instagram, 17:00 to 19:00 local time for D2C audiences
- X, 09:00 to 11:00 and 14:00 to 16:00 local time
- TikTok, 18:00 to 22:00 local time
- YouTube Shorts, evenings or weekends

Override defaults with the brand's own analytics. Buffer and Sprout surface the per-channel best slot per audience.

**Step 4.2, push to the scheduler.**

For each draft, the scheduler receives.

- Channel and account
- Post body, hashtags, image or video asset reference
- Publish slot
- Channel-native check report (so the social manager knows what was checked)
- Brief reference (so the ledger ties posts back to the source brief)

**Step 4.3, log to the ledger.**

Every published post logs.

- Channel, brief reference, post URL
- Publish slot
- 7-day engagement (impressions, reactions, comments, shares)
- 30-day engagement
- Audience growth attributable to the post if measurable

**Step 4.4, run the monthly retro.**

Sample 20 posts across channels. Which channel-native rubrics are still tracking the platform's actual best practice? Which need updating? Channel prompts refresh every six-to-twelve months because platform algorithms shift.

You should now have the pipeline running and the retro cadence tuning it.

## Worked example, end-to-end

Cascadia Endurance runs the factory across LinkedIn, Instagram, X and TikTok. The brand's social manager Maya Adeyemi populates the weekly brief on Mondays. The pipeline runs Monday afternoon and posts schedule across the week.

**Phase 1 output.** Week 24 brief. Core insight, "Vertical metres are the dose, not the kilometres, for the next four weeks of the build." Broader argument three sentences anchored to Marcus Hale's training POV. Proof, the Vernillo 2017 paper on uphill running plus Beth Lyons's Lavaredo build data. Spokesperson Marcus Hale. Active channels LinkedIn, Instagram, X, TikTok. B-roll asset S009 (Saoirse on the Lavaredo fire road) plus S007 (Marcus on Snowdonia exposed alpine).

**Phase 2 output.** Four drafts produced.

LinkedIn (Marcus's account):

> Vertical metres are the dose for the next four weeks of the build, not the kilometres.
>
> Beth Lyons logged 8,400 metres of vertical in the 28 days before Lavaredo, off 320 kilometres of running. That ratio of climb to flat distance is the gradient stress that matters for an ultra build. The trail audience over-indexes on kilometres because Strava reports them in the first line.
>
> The week's structure for a mid-pack racer in the build phase is two climbing sessions of 600 to 900 metres each, one with sustained gradient over a single climb, one with shorter repeats. The easy days stay easy on flat terrain.
>
> A flat 80k week with no climbing is not an ultra build. It is a road-running week wearing the wrong shoes.
>
> #trailrunning #training #ultrarunning

Instagram caption (paired with S007 image):

> The hills are the dose. Marcus on Snowdonia's exposed alpine ridge, working two 700-metre repeats into the back end of a Sunday long run.
>
> The next four weeks of the build want vertical metres more than they want kilometres. Beth Lyons logged 8,400 metres of climb in the 28 days before Lavaredo and the dose was the gradient stress, not the distance.
>
> Two climbing sessions a week. One sustained, one repeats. Everything else stays flat and easy.
>
> Photo by Cascadia at Snowdonia, July 2026.

X thread (7 tweets):

> Tweet 1, "Vertical metres are the dose for an ultra build. Kilometres are the side effect."
>
> Tweet 2, "Beth Lyons in the 28 days before Lavaredo: 8,400 metres of vertical off 320 kilometres of running. Ratio of climb to distance is what matters."
>
> ... (full thread runs in the ledger)

TikTok script (62 seconds):

> 00:00 to 00:03, on-screen text "VERTICAL = DOSE." Visual, Saoirse cresting the fire road.
> 00:03 to 00:12, Marcus speaking. "Most trail runners count kilometres. They should count vertical metres."
> ... (full script runs in the ledger)

**Phase 3 output.** All four drafts passed the deterministic gates. Cross-channel similarity check returned a maximum pairwise textual similarity of 0.34, well below 0.4. Voice gate passed all four with the Instagram caption scoring slightly lower because the image carries part of the voice.

**Phase 4 output.** Schedule. LinkedIn Tuesday 07:45 BST. Instagram Tuesday 18:30 BST. X thread Wednesday 09:30 BST. TikTok Thursday 19:00 BST.

7-day metrics. LinkedIn 8,400 impressions, 230 reactions. Instagram 12,200 reach, 980 likes, 47 comments. X thread 18,000 impressions on tweet 1, completion to tweet 7 around 12%. TikTok 41,000 views, 2.8% engagement.

A quarter into running the factory, Cascadia's social engagement across all four channels has lifted meaningfully against the prior cross-posting baseline. LinkedIn engagement is up the most because the channel-native discipline replaced what had been blog-excerpt cross-posts. TikTok, from a low base, has multiplied because the brand finally has a script discipline rather than improvising on the day.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, populate the brief for next week

Take next week's story you are planning to post. Fill the brief template fully. If you cannot populate the proof field with a source URL or document reference, the brief is not ready. Find the proof before drafting.

### Exercise 2, draft one channel from a real brief

Pick LinkedIn or Instagram. Run the channel prompt with your real brief and voice profile. Compare to what you would have posted manually. The exercise teaches you where the channel-native rubric is sharper than your manual default and where you would push back on the prompt.

### Exercise 3, run the cross-channel similarity check on your last week's posts

Take last week's posts across channels. Compute pairwise similarity (ChatGPT or Claude can do this for short text). If pairs score above 0.7, you have been cross-posting with cosmetic changes. The check is the diagnostic.

## The eval gates

**Eval 1, channel-rule pass rate.** Each channel's deterministic rules (hook length, line breaks, hashtag count) pass. Hard block.

**Eval 2, cross-channel-but-not-cross-posted.** Pairwise textual similarity across the week's outputs stays below 0.4. Higher means the pipeline cross-posted with cosmetic changes.

**Eval 3, voice match.** Channel-native posts match the brand voice profile within the lower channel-native threshold (typically 8 of 12 versus the 10 of 12 for long-form). Voice must still register.

**Eval 4, engagement health.** 30-day engagement per channel sits at or above the brand's baseline. Sustained drift below baseline on one channel means the channel-native rubric is out of date.

**Eval 5, image and video asset fulfilment.** Image briefs route to the DAM via the segment-broll-production tags. Fulfilment rate above 85%. Below that, the inventory has gaps the next shoot must close.

## The failure modes

**Team falls back to cross-posting.** When the pipeline misfires once, teams default to cross-posting "to stay on schedule." Resist. A missed channel for a week is fine. A cross-posted LinkedIn excerpt sits dead and trains the algorithm to deprioritise the brand. Empty is better than bad.

**Channel best practices change.** Platform algorithms shift. Channel prompts encode current best practices and refresh every six-to-twelve months. Treat the prompts as living documents.

**Spokesperson voice drift.** Posts attributed to a named person sound like that person. Build a sub-profile per named spokesperson and route through it. Generic "the brand says" voice on a named-person post breaks the trust.

**Hashtag spam.** Old-school playbooks recommend 10+ hashtags per Instagram post. Modern algorithms penalise this. The pipeline caps at the platform's tolerance and validates against current best practice quarterly.

**Asset library cannot keep up.** The pipeline asks for assets the DAM does not have. The downstream cost is either skipping the post or shipping with a wrong asset. Fix at the segment-broll-production level, not by lowering the channel rubric.

## The pattern in practice

Illustrative scenarios that show common shapes channel-native social work takes. Specifics are illustrative, patterns repeat.

**D2C apparel, growth-stage, the cross-post fix.** A brand cross-posting one blog excerpt across four channels weekly. Switching to channel-native variants for a quarter typically lifts engagement substantially on every channel, multiples on LinkedIn and Instagram, often much larger lifts on TikTok from a low base. The cross-posted excerpts had been training the algorithms to deprioritise the brand for months. The channel-native rebuild reverses that.

**B2B SaaS, scale-stage, the second-channel addition.** A brand active on LinkedIn only. Expanding to LinkedIn plus X with channel-native form typically generates more pipeline-qualified inquiries from X in a quarter than a year-plus of LinkedIn-only posting produced. The channel is different but the audience overlap is real. Most senior marketing audiences live on both, in different registers.

**Endurance brand, the script-discipline lift.** A brand improvising TikToks on the day. Installing the script prompt cuts time-on-shoot in half and lifts retention sharply because the first three seconds finally get the deliberate attention they deserve.

## Hand-off

The factory feeds:
- **ai-studio-news-pipeline**, news posts route through the LinkedIn prompt with the news-specific overrides
- **race-result-content-engine**, race recaps route through the social factory for channel cuts
- **training-content-engine**, long-form training pieces produce channel-native cuts through the factory
- **video-script-system**, TikTok scripts route through the script system for the shoot-ready format
