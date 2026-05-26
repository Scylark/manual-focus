---
name: social-content-factory
description: "When the user wants to produce channel-native social content, generate week-of-content from a single story brief, stop cross-posting blog excerpts, or draft LinkedIn / TikTok / Twitter / Instagram posts that work on each platform. Also triggers on 'social content for the week', 'channel-native LinkedIn post', 'we keep cross-posting and it doesn't work', or 'turn this story into social'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/content/social-content-factory
---

# Social content factory

You turn one weekly story brief into channel-native content for the four social channels the brand runs. Each output respects its platform — LinkedIn opens with the hook on line one, TikTok scripts assume sound-off, Twitter compresses the argument, Instagram leans on a single strong image. No cross-posting.

## Inputs to gather first

1. **Story brief** for the week — core insight (one sentence), broader argument (3–5 sentences), proof point, spokesperson if any, channel mix
2. **Voice profile** — `.lens/voice-profile.json` (run brand-voice-extraction if missing)
3. **Message house** — `.lens/message-house.md` if present, for pillar consistency
4. **Active channels** — which of LinkedIn / TikTok / Twitter-X / Instagram / YouTube Shorts the brand runs
5. **Spokesperson voice profiles** — sub-profiles for named people if the brand uses them; otherwise the main voice

## The pipeline (four phases)

### Phase 1 — Story brief intake

Validate. Confirm the brief has a single insight (not a list), a real proof point (not a vibe), and a named spokesperson if posts are attributed.

### Phase 2 — Channel-native drafting

For each active channel, run the channel-specific prompt.

**LinkedIn** (the version that holds the bar):

```text
SYSTEM: You write LinkedIn posts for a specific brand. You write like
someone who's done the work, not like someone selling. The opening line
is everything — the only line a reader sees before deciding to expand.
After expansion, you keep them with concrete specifics, not generalities.

LinkedIn-specific rules:
- Line 1 ≤ 75 chars. State the insight, do NOT tease.
- Line break between line 1 and line 2.
- Body paragraphs of 1–2 lines, separated by line breaks.
- One specific number or named example in the first paragraph after the hook.
- Closing line is a single thought, not a question.
- ≤ 3 hashtags, bottom block.
- No "Hot take:" "Unpopular opinion:" — inheritance from X / Twitter.

USER:
Brand: {BRAND_CONTEXT}
Story: {STORY_BRIEF}
Proof: {PROOF_POINT}
Spokesperson (whose voice): {SPOKESPERSON}
Length: 100–200 words.

Draft. Return JSON:
{
  "post_body": "<post>",
  "hashtags": ["...", "..."],
  "image_brief": "<one-sentence description for asset team>",
  "checks": {
    "line_1_length": <number>,
    "line_1_states_insight": <true|false>,
    "specific_number_in_para_1": <true|false>,
    "ends_on_statement_not_question": <true|false>,
    "word_count": <number>
  }
}
```

**TikTok script** — assume sound-off as default. Script must work as text on screen first, voice second:

```text
USER:
Length: 30–90 seconds spoken (~75–225 words).
Format: hook + setup + proof + payoff + CTA.
Hook: first 3 seconds. Specific, not teased.
Caption track: large, readable, key beats only.
B-roll: name 2–3 cuts that pair with the script.

Return JSON:
{
  "hook_seconds_0_3": "<spoken + on-screen text>",
  "setup": "<sentences in spoken form>",
  "proof": "<sentences>",
  "payoff": "<sentences>",
  "cta": "<single ask>",
  "broll_cuts": ["...", "...", "..."],
  "caption_track": ["<keywords by beat>"],
  "total_estimated_seconds": <number>
}
```

**Twitter / X thread**:

```text
USER:
Length: 5–9 tweets. Tweet 1 ≤ 240 chars (room for retweet attribution).
Tweet 1: the entire argument in one tweet. The rest is evidence.
Final tweet: a one-line synthesis + a single ask (no calls to follow).

Return JSON:
{
  "tweets": [
    {"n": 1, "body": "<≤ 240 chars>", "char_count": <number>},
    ...
  ],
  "checks": {
    "tweet_1_states_full_argument": <true|false>,
    "all_under_280": <true|false>
  }
}
```

**Instagram** — caption-led, image-anchored:

```text
USER:
Caption ≤ 200 words. First line ≤ 125 chars (before "more" cut).
One specific image brief; do not produce carousels by default.

Return JSON:
{
  "first_line": "<≤ 125 chars, hook>",
  "caption_body": "<rest>",
  "hashtags_first_comment": ["...", "..."],  // up to 5
  "image_brief": "<single image description>",
  "alt_text": "<for accessibility>"
}
```

### Phase 3 — Channel-specific gating

Run each channel's deterministic rules. Hard block on hook length, line breaks, hashtag count, char counts.

Across the week's outputs, run **cross-channel-but-not-cross-posted** check: pairwise textual similarity across different channels should be <0.4 (topical similarity will naturally be 0.6–0.8). High textual similarity means cross-post-with-cosmetic-changes — regenerate.

Voice rubric still applies, with a lower threshold than long-form (some channel-native form fights voice rules).

### Phase 4 — Scheduling output

Outputs structured for the team's scheduler. Each post tagged with the channel-native check report.

## Output

Per week, per channel:

1. **Draft post** (or script, in TikTok / Shorts case)
2. **Image / B-roll brief** for the asset team
3. **Channel check report** — the deterministic checks that passed
4. **Recommended send window** — based on the channel's typical audience activity

Save to `.lens/social/{week-of}/{channel}.json`.

## Evals

- **Channel-rule pass rate** — 100% on the deterministic rules. Hard block.
- **Cross-channel-but-not-cross-posted** — textual similarity <0.4 across channels for the same story
- **Voice match** — channel posts still score ≥8/12 on voice rubric (lower than long-form floor because of platform constraints)

## Failure modes to watch

- **Team falls back to cross-posting under deadline pressure** — empty is better than bad. A missed channel for a week is fine. A cross-posted excerpt trains the algorithm to deprioritise the brand.
- **Channel best practices change** — platform algorithms shift. Refresh channel prompts every 6–12 months.
- **Spokesperson voice drift** — named-person posts need a sub-profile. Generic brand voice on a named-person post breaks trust.
- **Hashtag spam** — modern algorithms penalise. Cap at platform tolerance.

## Hand-off

Strong social posts often surface in:
- **earned-media-pitch** — a high-performing social take is often the seed for a journalist pitch
- **lifecycle-journey-builder** — winning angles get repurposed into email
- **eval-gated-drafting** — anchor LinkedIn posts get expanded to long-form
