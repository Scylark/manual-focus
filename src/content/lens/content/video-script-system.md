---
title: "Video script system, brief to shootable script"
stack: content
description: "Convert a marketing brief into a shootable script with beats, b-roll suggestions, captions and a thumbnail brief. Saves a producer a week of prep."
outputs: "Scripted shoot doc, b-roll list, caption draft, thumbnail brief"
readMin: 16
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["video", "content", "organic-social"]
models: ["claude-4.5-sonnet", "gpt-5"]
publishedAt: 2026-06-16
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **structured video brief** covering purpose, length, platform mix, key takeaway, spokesperson and proof, validated before any script drafts.
2. A **beat sheet** for the video, four to six beats for a 60-second piece, twelve to eighteen for an eight-minute piece, each with timecode, action, dialogue and b-roll opportunity.
3. A **shootable script** in production format with talent lines marked, b-roll in brackets, on-screen text in caps, ready to hand to a director or to shoot self-directed.
4. A **companion asset pack** with three-to-five thumbnail concepts, a caption draft for the post, and a b-roll shortlist filtered against the segment-broll-production inventory.
5. A **hook scorecard** rating three hook options on specificity, contradiction and pattern-break, with the producer's pick logged so the post-shoot retro can correlate hook strength to retention.

## Who this is for

A growth or scale-stage brand shooting marketing video on a regular cadence (weekly product video, monthly explainer, quarterly hero film) with a producer who currently spends days writing scripts or improvising on the day. If the brand has no production capacity at all, the script becomes hypothetical, the playbook still teaches the discipline. If the brand only shoots once a year, the throughput gain does not justify the setup.

## Before you start

- [ ] A producer or director who can hold the script through the shoot
- [ ] Talent who will read the script (founder, sponsored athlete, internal spokesperson) and tolerate the script discipline
- [ ] B-roll inventory from the segment-broll-production playbook, or at minimum a tagged shot list of what the brand has
- [ ] Voice profile from the brand-voice-extraction playbook, plus a spokesperson sub-profile if the talent is a named person
- [ ] CMS access (Webflow, Shopify, YouTube) for the post-publish caption and metadata
- [ ] Captioning tool (Descript, Rev, the platform's auto-captions) for the published video
- [ ] Claude Sonnet 4.5 for the high-volume drafting, Opus 4.5 or GPT-5 for the higher-stakes hero scripts
- [ ] A teleprompter or cue cards on the shoot day

If the talent will not read a script, the playbook produces a beat sheet that talent improvises around, which is a different shape with looser timing.

## The pipeline

Five phases. End-to-end in a working day for a 60-second script, longer for an 8-minute explainer. The shoot itself remains a separate calendar entry.

### Phase 1, brief intake

The script pipeline refuses to draft on a thin brief.

**Step 1.1, populate the video brief.**

- Purpose (educate, convince, launch, entertain)
- Length (30 seconds, 60 seconds, 3 minutes, 8 minutes, 12+ minutes, formats differ meaningfully)
- Platform mix (YouTube primary, TikTok primary, LinkedIn-friendly, paid creative)
- Single key takeaway (one sentence, the thing the viewer walks away with)
- Spokesperson (name, why they are credible)
- Proof or example (data, customer story, demonstrable claim)
- B-roll budget (what shots the brand has or can capture before the shoot)
- Talent constraint (will talent read a script verbatim or improvise around a beat sheet)
- Brand voice profile reference
- Banned phrases

**Step 1.2, run the brief validator.**

```text
SYSTEM: You validate a video brief before the script pipeline drafts.
You reject briefs missing required fields. You flag briefs where the
single key takeaway is too vague to anchor a script.

USER:
Video brief: {BRIEF_JSON}

Return JSON:

{
  "verdict": "<pass | conditional | fail>",
  "checks": [
    {"id": "C1", "name": "single key takeaway is specific", "result": "<pass | fail>", "rationale": "<one sentence>"},
    {"id": "C2", "name": "purpose matches length", "result": "<pass | fail>", "rationale": "<one sentence>"},
    {"id": "C3", "name": "spokesperson named and credible", "result": "<pass | fail>", "rationale": "<one sentence>"},
    {"id": "C4", "name": "proof or example is concrete", "result": "<pass | fail>", "rationale": "<one sentence>"}
  ],
  "missing_inputs": ["<what needs adding>"]
}

Rules:
- "fail" if C1 or C4 fails. Vague takeaways and abstract proofs do
  not produce shootable scripts.
- "purpose matches length" fails on combinations like
  "entertain in 30 seconds" without a clear hook or
  "explain in 30 seconds" when the subject needs 3 minutes.
```

You should now have a validated video brief.

### Phase 2, beat sheet

The beat sheet is the spine the script writes against.

**Step 2.1, set the beat count.**

A 60-second video has 4-to-6 beats. A 3-minute video has 8-to-10. An 8-minute video has 12-to-18. A 30-second piece has 3 beats. Beats are roughly 10-to-30 seconds each.

**Step 2.2, run the beat sheet prompt.**

```text
SYSTEM: You generate a beat sheet for a marketing video. Each beat
has a timecode range, an on-screen action, the dialogue or VO line
(with rough timing), a b-roll opportunity, and on-screen text. The
sheet is the spine the script writes against.

USER:
Brief: {BRIEF_JSON}
Beat count target: {COUNT}
Available b-roll: {BROLL_SHOTS_FROM_INVENTORY}
Voice profile: {VOICE_PROFILE_SHORT}

For each beat, return JSON:

[
  {
    "beat_number": <int>,
    "timecode": "<MM:SS to MM:SS>",
    "on_screen_action": "<description>",
    "dialogue_or_VO": "<line>",
    "b_roll_opportunity": "<description, reference shot ID if available>",
    "on_screen_text": "<caps if present, else null>",
    "purpose": "<hook | setup | payoff | proof | transition | close>"
  }
]

Rules:
- First beat is the hook. First 3 seconds carry visual change plus
  on-screen text.
- Each beat earns its place. No filler beats.
- B-roll references the inventory where possible. New b-roll asks
  get flagged so the producer can plan capture.
- Total timecodes match the target length within 10%.
```

**Expect output like (60-second product video):**

| Beat | Timecode | On-screen action | VO | B-roll | On-screen text |
|---|---|---|---|---|---|
| 1 | 00:00-00:08 | Marcus on a Snowdonia ridge, wind audible | "Most trail buyers count the grams. The wrong metric." | S007 | GRAMS ARE NOT THE METRIC |
| 2 | 00:08-00:20 | Marcus continues | "We tested 80 runners across 18 months. The shell that survives the season weighs forty grams more than the lightweight category average." | S001, S003 | 48 MONTHS OF WEAR DATA |
| 3 | 00:20-00:35 | Beth Lyons at Lavaredo, mid-storm | "Beth ran Lavaredo in this shell. Twelve hours, three weather systems, intact at the finish." | S015, S004 | LAVAREDO 2026, INTACT |
| 4 | 00:35-00:48 | Marcus, talking head | "The forty grams is the membrane. The lightweight category does not have it. That is the trade-off." | S007 | FORTY GRAMS = MEMBRANE |
| 5 | 00:48-00:58 | Vahla shell static, ambient | "Vahla shell, autumn launch. Trail Club gets first access." | S005 | VAHLA SHELL, OCTOBER |

You should now have a beat sheet the script will expand.

### Phase 3, hook strength check

The first three seconds carry everything. The pipeline generates three hook options and the producer picks.

**Step 3.1, run the hook generation prompt.**

```text
SYSTEM: You generate three hook options for the opening 3 seconds of
a marketing video. Each hook combines a visual change, on-screen text
and a spoken line. You score each on specificity, contradiction and
pattern-break.

USER:
Brief: {BRIEF_JSON}
Beat 1 from the beat sheet: {BEAT_1_JSON}
Platform: {PLATFORM}
Voice profile: {VOICE_PROFILE_SHORT}

Return JSON:

{
  "hooks": [
    {
      "hook_id": "A",
      "visual": "<description>",
      "on_screen_text": "<caps>",
      "spoken_line": "<line if any, else null>",
      "scores": {
        "specificity": <0-10>,
        "contradiction": <0-10>,
        "pattern_break": <0-10>,
        "composite": <0-10>
      },
      "swipe_assessment": "<no_swipe | likely_swipe | uncertain>"
    },
    {"hook_id": "B", ...},
    {"hook_id": "C", ...}
  ]
}

Rules:
- "specificity" rewards naming a specific number, named person, or
  concrete claim.
- "contradiction" rewards stating something that contradicts a
  common assumption.
- "pattern_break" rewards visual or structural pattern interruption.
- At least one of the three hooks scores "no_swipe" on the swipe
  assessment. If none do, regenerate with sharper inputs.
```

**Step 3.2, the producer picks the hook.**

The producer reads the three options. Picks one. The pick logs in the brief so the post-shoot retro can correlate hook score to actual retention.

You should now have a chosen hook for beat 1.

### Phase 4, full script

The beat sheet expands into the full script.

**Step 4.1, run the script expansion prompt.**

```text
SYSTEM: You expand a beat sheet into a full marketing video script.
The script is in production format with talent lines marked, b-roll
in brackets, on-screen text in caps. The dialogue is speakable in a
single take. Sentences over 30 words get broken up because talent
stumbles on them.

USER:
Brief: {BRIEF_JSON}
Beat sheet: {BEAT_SHEET_JSON}
Chosen hook (beat 1): {HOOK_JSON}
Voice profile: {VOICE_PROFILE_SHORT}
Spokesperson sub-profile: {SPOKESPERSON_VOICE}
Banned phrases: {BANNED_PHRASES}
Talent constraint: {WILL_READ_VERBATIM_OR_NOT}

Return JSON:

{
  "script": [
    {
      "beat": <int>,
      "timecode": "<MM:SS to MM:SS>",
      "talent_line": "<line, with sentences under 30 words>",
      "b_roll": "<bracketed direction, references shot IDs>",
      "on_screen_text": "<caps>",
      "transition_note": "<cut, dissolve, hard cut, etc.>"
    }
  ],
  "freeze_words": ["<phrases the talent must hit verbatim>"],
  "improvise_zones": ["<beat numbers where talent can improvise>"],
  "checks": {
    "spoken_word_count": <int>,
    "estimated_runtime_seconds": <int>,
    "longest_sentence_words": <int>,
    "banned_phrases_present": <true | false>
  }
}

Rules:
- Spoken word count maps to runtime at 150 to 160 wpm.
- Longest sentence under 30 words. Break up anything longer.
- Freeze words are the brand-essential phrases the script depends on.
- Improvise zones allow talent latitude on the beats where wording
  matters less than emotion.
- B-roll references the inventory by shot ID where possible.
```

**Step 4.2, the say-it-out-loud check.**

The producer reads the script aloud. Sentences that do not survive being said get rewritten. The check catches written rhythms that fail in single-take production.

**Step 4.3, the length-adherence check.**

Spoken-word count maps to time at 150 to 160 wpm. If the script's word count implies a runtime more than 15% over target, trim. Most first-draft scripts run long.

You should now have a shootable script.

### Phase 5, asset briefs

Companion outputs are produced from the script.

**Step 5.1, generate the thumbnail concepts.**

```text
SYSTEM: You generate three thumbnail concepts for a marketing video.
Thumbnails communicate the hook in one image. Faces, contrast and
text legible at 320 pixels wide are the levers.

USER:
Brief: {BRIEF_JSON}
Chosen hook: {HOOK_JSON}
Platform: {PLATFORM}
Available stills from inventory: {STILLS}

Return JSON:

{
  "concepts": [
    {
      "concept_id": "A",
      "image_brief": "<one-sentence description>",
      "text_overlay": "<short, legible at thumbnail size>",
      "uses_face": <true | false>,
      "platform_fit": "<YouTube | TikTok | Instagram | LinkedIn>"
    }
  ]
}

Rules:
- At least one concept uses a face (highest CTR on YouTube).
- Text overlay is under 4 words.
- Contrast is high for legibility at thumbnail size.
```

**Step 5.2, draft the caption.**

For YouTube, the caption is the description. For TikTok and Instagram, it is the in-feed caption. Run the channel prompt from social-content-factory with the video script as input.

**Step 5.3, generate the b-roll shortlist.**

```text
SYSTEM: You compile the b-roll shortlist for a video script. You
filter the segment-broll-production inventory against the script's
b-roll references. You flag any references that the inventory does
not cover.

USER:
Script: {SCRIPT_JSON}
B-roll inventory: {INVENTORY_CSV}

Return JSON:

{
  "shortlist": [
    {
      "shot_id_in_inventory": "<S00X or null>",
      "script_reference": "<beat number>",
      "available": <true | false>,
      "alternative_if_unavailable": "<another shot ID or null>",
      "capture_required": <true | false>
    }
  ]
}

Rules:
- Available shots route to the producer as-is.
- Unavailable shots get an alternative if one exists, otherwise
  flag capture_required: true.
- Producer reviews capture-required flags before the shoot booking.
```

You should now have the full asset pack ready for the shoot.

## Worked example, end-to-end

Cascadia Endurance ran the system for the Vahla shell launch video, a 60-second piece shot on Snowdonia with Marcus Hale presenting and Beth Lyons featured in cut-aways.

**Phase 1 output.** Brief validated. Purpose convince. Length 60 seconds. Platform mix, YouTube primary plus Instagram Reels and LinkedIn secondary. Key takeaway, "The Vahla shell is forty grams heavier than the lightweight category and the forty grams is the membrane that survives." Spokesperson Marcus Hale (head coach). Proof, 48-month wear panel data plus Beth Lyons's Lavaredo storm-section finish.

**Phase 2 output.** Beat sheet shown in Phase 2's Expect Output block, five beats over 58 seconds.

**Phase 3 output.** Hook generation returned three options. Option A scored highest on specificity (a stated number) and contradiction (counter to the lightweight-category default). Option B scored highest on pattern-break (a visual cut to Beth Lyons at Lavaredo before any product appears). Option C was a generic landscape opener that scored low. The producer picked Option A. Marcus on Snowdonia ridge, on-screen text "GRAMS ARE NOT THE METRIC," spoken line "Most trail buyers count the grams. The wrong metric."

**Phase 4 output.** Full script expanded across five beats. Sample for beat 2.

> **Beat 2, 00:08 to 00:20.**
>
> Talent (Marcus): We tested 80 runners across 18 months. [pause] The shell that survives the season weighs forty grams more than the lightweight category average.
>
> [B-roll: S001 Beth single-track golden hour, S003 Beth ridge line blue hour. Cut between the two on the word "average."]
>
> On-screen text: 48 MONTHS OF WEAR DATA
>
> Transition: hard cut to beat 3.

Freeze words for the whole script, "forty grams," "the membrane," "Vahla shell, October." Talent improvise zones on beat 4 where Marcus talks about the trade-off.

Spoken word count, 142 words. Estimated runtime 56 seconds at 150 wpm. Longest sentence 24 words. Pass.

**Phase 5 output.** Three thumbnail concepts produced. Concept A used a still of Marcus on the ridge with "FORTY GRAMS = MEMBRANE" overlay, high contrast, face visible. Concept B was Beth at Lavaredo, more atmospheric. Concept C was the Vahla shell on a static rock, no face. The producer picked A for YouTube and B for Instagram Reels.

Caption drafted via the social-content-factory LinkedIn prompt for the LinkedIn cut. B-roll shortlist returned 11 shots needed across the script, 9 available in the inventory, 2 flagged capture-required (a specific close-up of Marcus on the ridge plus a wider Beth shot at Lavaredo's storm section). Both got added to the Snowdonia shoot brief and the next Lavaredo footage license request.

Shoot ran in a single day at Snowdonia. The script discipline meant Marcus delivered six clean takes per beat with the freeze words intact. The video published on YouTube three weeks later and held 73% retention at 30 seconds against a brand baseline of 41%. The hook-score logging tied the high retention to Option A's specificity-plus-contradiction combination.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, validate a brief you wrote for a past video

Take a video brief you used in the last six months. Run the Phase 1 validator. If the verdict is fail or conditional, you now know why the script you shot was harder to write than it should have been.

### Exercise 2, generate three hooks for a 60-second piece you are planning

Take a video on your near-term plan. Run the Phase 3 hook prompt with your brief and your beat 1. Read the three options. If the model returns three weak hooks, the brief inputs are not specific enough, the key takeaway is too vague. Sharpen the input.

### Exercise 3, say one beat out loud

Pick one beat from a script you have written. Read the talent line aloud in a single take. If you stumble, the sentence is too long or the rhythm is wrong. Rewrite. The exercise teaches you which written rhythms fail in production.

## The eval gates

**Eval 1, length adherence.** Spoken-word count maps to runtime at 150 to 160 wpm. Scripts more than 15% over target fail and trim.

**Eval 2, hook quality.** At least one of three hook options scores "no swipe" on the swipe assessment. If none do, regenerate with sharper inputs in the brief.

**Eval 3, talent-able dialogue.** Longest sentence under 30 words. Talent stumbles on long sentences in single-take production. Break them up.

**Eval 4, b-roll feasibility.** B-roll references trace to the inventory or to a capture plan. Unfilled references get flagged before the shoot books, not on the shoot day.

**Eval 5, retention vs hook score.** Post-shoot, log actual retention against the chosen hook's score. Over time, the correlation tunes the hook-scoring rubric to the brand's audience.

## The failure modes

**Scripts read well, do not shoot well.** Written sentences have rhythms that do not survive being said. The say-it-out-loud check is the discipline. If the producer cannot speak a sentence in one breath, the talent cannot either.

**Talent goes off-script.** Some talent improvises. If the talent is good, fine. If not, the script discipline gets lost. The freeze-words list and improvise-zones map handle this. Freeze words are mandatory, improvise zones are permitted.

**B-roll asks for impossible footage.** "Cut to wide shot of customer using product in natural light" is fine if the brand has shot a customer. If not, the producer either reshoots or replaces with stock that does not match. The b-roll shortlist references the inventory and flags capture-required gaps before the shoot.

**On-screen text fights with dialogue.** Captions competing with the spoken line split viewer attention. The pipeline aligns on-screen text with key takeaways, not running dialogue. Static keywords in caps, not running subtitles. Auto-captions live in a separate layer for accessibility.

**Hooks get over-engineered.** Pattern-break for its own sake. The hook scoring rewards specificity and contradiction first because those carry the audience past the swipe, pattern-break supports rather than substitutes.

## The pattern in practice

Illustrative scenarios that show common shapes the video-script system takes. Specifics are illustrative, patterns repeat.

**B2B SaaS, scale-stage, the retention lift.** A brand shooting an explainer video a month, taking a full week of producer time per video, with retention around 30% at 30 seconds. The pipeline cuts script prep from days to a working session. Retention at 30 seconds improves materially once the hook-quality gate enforces, because the first three seconds finally get the deliberate attention they deserve.

**D2C, growth-stage, the small-team throughput.** A brand wanting to ship product videos at higher cadence with only a small in-house team. The pipeline plus a regular shoot day per week produces multiples of the previous output. The unlock is the shootable-script discipline. The team stops improvising on the day and starts executing a tight plan.

**Endurance brand, the hero-film discipline.** A brand shooting a 12-minute hero film for the season. Beat sheet plus full script plus pre-approved hook saved roughly two weeks of pre-production. Retention on the long-form held above the platform median, which long-form trail content rarely does.

## Hand-off

The script system feeds:
- **segment-broll-production**, b-roll asks route into the shoot plan and the AI augmentation pipeline
- **social-content-factory**, channel-native captions and short-form cuts run through the factory prompts
- **race-day-demand-pipeline**, hero films for Tier 1 events plan against the production calendar
- **ai-studio-news-pipeline**, audio explainers for the top news posts use a shortened version of the script pipeline
