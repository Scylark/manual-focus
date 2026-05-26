---
title: "Brand voice extraction and prompt library"
stack: brand
description: "Extract a falsifiable voice profile from your best writing. Build a prompt library and a scoring rubric so new drafts read like the brand, not like AI."
outputs: "Voice profile, evaluation rubric and reusable prompt library"
readMin: 22
shipTime: "2 working days"
brandStage: ["growth", "scale", "enterprise"]
channels: ["content", "brand", "organic-social", "email"]
models: ["claude-4.5-sonnet", "gpt-5", "claude-4.5-opus"]
publishedAt: 2026-04-22
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts:

1. A **voice profile** built from observable patterns in your actual best writing, with cadence rules, lexical choices and syntactic tells rather than adjectives.
2. A **deterministic scoring rubric** that grades any draft against the profile across twelve checks, returns a score out of twelve, and names the failing checks so the next draft can fix them.
3. A **prompt library** of four templates covering blog opener, social caption, email subject and sales follow-up, each pre-loaded with the patterns the rubric will check for.
4. A **drift watch** routine, a quarterly re-run that diffs the new profile against the old one so you catch voice slippage before customers do.

## Who this is for

A growth or scale-stage brand with at least twelve months of published content, a content lead who can nominate the brand's proudest pieces, and a team frustrated that "write in our voice" keeps producing generic drafts. If you have fewer than ten pieces of writing worth modelling, do the writing first and come back.

## Before you start

Get these on a single screen before you begin.

- [ ] Access to the brand's CMS, blog, newsletter archive and social archive
- [ ] A folder or Notion page to dump the corpus into
- [ ] Claude (Opus 4.5 or Sonnet 4.5) or GPT-5 with structured-output mode enabled
- [ ] A text editor that can word-count and find-replace
- [ ] Optional but useful, a Python environment if you want to automate the scoring rubric

If you cannot name the brand's three best writers off the top of your head, start by asking the team. The corpus quality determines the profile quality.

## The pipeline

Four phases. About a day and a half if you have the corpus ready, two days if you are still chasing it down.

### Phase 1, corpus curation

The corpus sets the high-water mark. Pieces that are merely fine dilute the profile.

**Step 1.1, nominate the proudest writing.**

Open your CMS or content archive. Ask the content lead, the founder and one other senior reader to each nominate five to seven pieces they would proudly show a new hire. You want overlap between nominators, because pieces that two nominators picked are signal. Pieces only one person picked get a second read before they make the cut.

**Step 1.2, build the corpus folder.**

Create a folder called `voice-corpus/`. Inside it, drop one plain-text file per piece, named `01-title-slug.txt` through `15-title-slug.txt`. Strip headers, footers, image captions and pull-quotes. Keep only the prose the writer wrote. Aim for ten to fifteen pieces, two thousand to twenty thousand words total.

**Step 1.3, audit author distribution.**

For each piece, note the author at the top of the file in a single line, `AUTHOR, [name]`. If one writer accounts for more than forty percent of the corpus word count, the profile will be their voice, not the brand's. Either label this honestly ("this is the founder voice profile") or pull in pieces from at least two other writers until no single author dominates.

**You should now have** a clean `voice-corpus/` folder, ten to fifteen plain-text files, and an honest read on who is in the corpus.

### Phase 2, structural pattern extraction

Now run the extraction prompt. This pulls thirty-plus observable patterns from the corpus. Counts, ratios, openings, devices, what the brand never does.

**Step 2.1, convert the corpus to JSON.**

In your text editor or with a short script, assemble the corpus into a JSON list shaped like `[{"title": "...", "body": "..."}, ...]`. If you do not want to script it, paste each piece into a JSON block manually. Tedious for fifteen pieces, but a one-off.

**Step 2.2, run the extraction prompt.**

Paste the corpus JSON into the prompt below and run it. Use Opus 4.5 or GPT-5 in structured-output mode. Sonnet drifts on the larger corpora.

```text
SYSTEM: You are a stylometrician analysing a brand's writing. Your
job is to surface measurable, observable patterns. Not adjectives,
not feelings. Every pattern you report must be one a human editor
could verify by counting or reading.

USER:
Corpus, JSON list of {title, body}:
{CORPUS_JSON}

Analyse and return JSON in this exact shape:

{
  "sentence": {
    "mean_words": <number>,
    "variance": <"high" | "medium" | "low">,
    "longest_typical": <number>,
    "shortest_typical": <number>
  },
  "paragraph": {
    "mean_sentences": <number>,
    "typical_range": [<number>, <number>]
  },
  "punctuation": {
    "contractions": <"common" | "occasional" | "absent">,
    "em_dashes": <"common" | "occasional" | "absent">,
    "semicolons": <"common" | "occasional" | "absent">,
    "exclamation_marks": <"common" | "occasional" | "absent">,
    "questions": <"common" | "occasional" | "absent">
  },
  "voice": {
    "person": <"first" | "second" | "third" | "mixed-which">,
    "tense": <"present" | "past" | "mixed-which">,
    "formality": <"formal" | "neutral" | "informal">,
    "jargon_level": <"none" | "domain-light" | "domain-heavy">
  },
  "openings": {
    "typical_opener_pattern": "<plain English description with 3 examples>",
    "openers_avoided": ["<patterns this brand does not use>"]
  },
  "rhetorical_devices": [
    {"device": "<name>", "frequency": "<common|occasional>", "example": "<verbatim>"}
  ],
  "transition_words": {
    "used": ["..."],
    "avoided": ["..."]
  },
  "what_this_brand_never_does": [
    "<observable patterns absent from the whole corpus>"
  ]
}

Rules:
- Counts must be plausible for the corpus size. Spot-check before
  outputting.
- "Avoided" lists are inferred only when the pattern is absent across
  the WHOLE corpus.
- Every example must be verbatim from the corpus, copy-paste accurate.
```

**Expect output like:**

```json
{
  "sentence": {
    "mean_words": 14.2,
    "variance": "medium",
    "longest_typical": 26,
    "shortest_typical": 5
  },
  "paragraph": {
    "mean_sentences": 2.7,
    "typical_range": [2, 4]
  },
  "punctuation": {
    "contractions": "common",
    "em_dashes": "absent",
    "semicolons": "absent",
    "exclamation_marks": "absent",
    "questions": "occasional"
  },
  "voice": {
    "person": "second",
    "tense": "present",
    "formality": "neutral",
    "jargon_level": "domain-light"
  },
  "openings": {
    "typical_opener_pattern": "Short declarative under 7 words, then a longer qualifying sentence. Examples, 'The long ride teaches you patience. Then it teaches you the difference between patience and resignation.'",
    "openers_avoided": ["rhetorical questions", "stat hooks", "celebrity quotes"]
  },
  "what_this_brand_never_does": [
    "uses exclamation marks",
    "opens with a stat",
    "uses the word 'unleash'",
    "uses em dashes",
    "addresses the reader in the third person"
  ]
}
```

The `what_this_brand_never_does` field is the most underrated. Voice is defined as much by absence as by presence. Brands with the most distinctive voices usually have the longest never-does lists.

**You should now have** a JSON voice profile you can paste into a Notion page, a Google Doc or a markdown file in your content repo.

### Phase 3, eval rubric synthesis

The profile is descriptive. The rubric is what turns it into a gate.

**Step 3.1, generate the rubric from the profile.**

Run the prompt below with the Phase 2 output as input.

```text
SYSTEM: You convert a voice profile into a deterministic scoring
rubric. Each check is pass/fail or numeric with a threshold. The
rubric will be executed by a script, not a model, so the checks must
be unambiguous.

USER:
Voice profile:
{PHASE_2_PROFILE_JSON}

Return JSON shaped like:

{
  "checks": [
    {
      "id": "C1",
      "name": "<short label>",
      "type": "<numeric | pattern | regex>",
      "rule": "<exact rule, e.g. 'mean sentence length within 11.4 to 17.0 words'>",
      "weight": 1
    }
  ],
  "ship_threshold": 10,
  "regenerate_below": 8
}

Rules:
- Exactly 12 checks.
- Numeric ranges derived from the profile, allowing ±20% on means.
- Regex checks return the offending substrings, not just pass/fail.
- Every check must be executable with grep, wc and basic Python.
```

**Expect output like:**

| Check | Type | Rule |
|---|---|---|
| Mean sentence length | Numeric | Within 11.4 to 17.0 words |
| Sentence variance | Pattern | Standard deviation between 4 and 10 |
| Paragraph length | Numeric | Mean sentences per paragraph 2 to 4 |
| Contractions present | Pattern | At least 1 contraction per 100 words |
| Em-dash count | Numeric | Zero em dashes |
| Semicolon count | Numeric | Zero semicolons |
| Exclamation count | Numeric | Zero exclamation marks |
| Person | Pattern | Second-person dominant, "you" outnumbers "we" |
| Opener pattern | Pattern | First sentence under 8 words |
| Banned-word check | Regex | No matches for unleash, crush, ignite, supercharge |
| Rhetorical device | Pattern | At least one parallel-structure sentence |
| Reading level | Numeric | Flesch-Kincaid grade 7 to 10 |

**Step 3.2, write the scoring script.**

Around forty lines of Python. Takes a draft, runs the twelve checks, returns a score and a list of the failing checks. Drafts scoring ten or higher ship. Drafts scoring eight or nine go back to the model with the failing checks named explicitly. Drafts below eight regenerate from scratch rather than edit.

**You should now have** a rubric JSON and a scoring script you can wire into a pre-publish CI step or run locally.

### Phase 4, prompt library build

The prompts are the everyday output of the work. One template per recurring content type, each pre-loaded with the profile.

**Step 4.1, pick the four to six output types you ship most.**

For most endurance brands that is blog opener, social caption, email subject line, sales follow-up, newsletter intro, athlete-quote intro. Pick the four highest-volume.

**Step 4.2, generate the templates.**

For each output type, run a single prompt that produces the template.

```text
SYSTEM: You build a content-drafting template for a brand based on
their voice profile and the eval rubric. The template must constrain
the model toward the profile while leaving the writer's input slots
clear.

USER:
Voice profile: {PHASE_2_PROFILE_JSON}
Eval rubric: {PHASE_3_RUBRIC_JSON}
Output type: {OUTPUT_TYPE_e.g."blog opener, 80 to 120 words"}

Return a prompt shaped like:

SYSTEM: <brand voice constraints from profile, in plain English>

USER:
Brief: {BRIEF}
Subject: {SUBJECT}
Key takeaway: {TAKEAWAY}

Return: <expected output format>

Rules: <2 to 4 hard rules from the rubric>

Rules for you:
- The output must be copy-pasteable.
- Banned words must be in a Rules block, verbatim.
- Voice constraints stated as observable patterns, not adjectives.
- Include one negative example showing what the brand does NOT do.
```

**Expect output like:**

```text
SYSTEM: You write blog openers for Cascadia Endurance. The brand
opens with a short declarative under 8 words, then a longer second
sentence that qualifies or contradicts it. Second person dominant.
No em dashes, no semicolons, no exclamation marks. Contractions
welcome. Reading level grade 7 to 10.

USER:
Brief: {BRIEF}
Subject of the piece: {SUBJECT}
Key takeaway: {TAKEAWAY}

Return: a single opener of 80 to 120 words.

Rules:
- First sentence under 8 words.
- No em dashes, no semicolons.
- No words from the banned list: unleash, crush, ignite, supercharge,
  game-changer, journey.
- One contraction minimum.

Negative example, do NOT write like this:
"Are you ready to unleash your trail-running potential? In this
comprehensive guide, we'll explore everything you need to know."
```

**You should now have** four to six saved prompts, each pinned in your prompt library tool of choice. Notion, Promptlayer, a markdown file in the content repo. Whatever the team will actually open.

## Worked example, end-to-end

Cascadia Endurance, a UK trail-running apparel brand, scale-stage, three writers contributing to the blog and newsletter.

**Phase 1 output.** Fourteen pieces in the corpus, 38,000 words total. Three writers, none over thirty-five percent of word count. The corpus folder ships as `voice-corpus/01-the-long-sunday.txt` through `voice-corpus/14-kit-that-survives.txt`.

**Phase 2 output.** Cascadia's voice profile, abbreviated:

```json
{
  "sentence": { "mean_words": 13.8, "variance": "medium", "longest_typical": 28, "shortest_typical": 5 },
  "paragraph": { "mean_sentences": 2.6, "typical_range": [2, 4] },
  "punctuation": { "contractions": "common", "em_dashes": "absent", "semicolons": "absent", "exclamation_marks": "absent", "questions": "occasional" },
  "voice": { "person": "second", "tense": "present", "formality": "neutral", "jargon_level": "domain-light" },
  "openings": {
    "typical_opener_pattern": "Short declarative under 7 words, then a longer sentence that qualifies. 'The long Sunday is the test. Everything else is rehearsal.'",
    "openers_avoided": ["rhetorical questions", "stats", "celebrity quotes"]
  },
  "what_this_brand_never_does": [
    "uses 'unleash', 'crush', 'ignite'",
    "uses exclamation marks",
    "addresses athletes in the third person",
    "uses 'journey' as a metaphor for training",
    "opens with a question"
  ]
}
```

**Phase 3 output.** Twelve-check rubric. Ship threshold ten of twelve. The banned-words regex covers seven words. The opener-pattern check enforces a first sentence under eight words.

**Phase 4 output.** Four templates shipped, blog opener, Instagram caption, newsletter subject line, post-purchase email opener. Each saved in Notion under `Voice/Templates/`. The blog-opener template gets used twenty-plus times in its first quarter, the team estimates it cuts opener-draft time from twelve minutes to two.

A sample blog opener drafted against the rubric, scored 11 of 12:

> The long Sunday is the test. Everything else is rehearsal, and when the first three hours feel easy, that's the warning. The honest miles start at hour four, when the road tilts up and your legs are already negotiating. Most kit lets you down by then. The seams chafe, the pack shifts, the shoes give back what they took. The kit that survives the long Sunday is the kit you build the rest of your season around. That's what we make. The pieces that survive.

The piece that scored 12, an athlete-letter for the Vahla Range launch, ran on the homepage for six weeks. Email opens on the launch sequence held above the prior quarter's baseline by a measurable margin.

## Try it yourself

Three exercises, each takes 20 to 30 minutes.

### Exercise 1, run extraction on three pieces

Pick your three favourite pieces of recent writing. Paste them into the Phase 2 prompt and run. Read the output. Does the profile match what you would have written about the voice by hand? If it disagrees with you on something specific, like saying you use semicolons when you do not, the corpus was too thin or the model drifted. Re-run with five pieces.

### Exercise 2, score a draft you already shipped

Take a piece you shipped last month. Run it through the rubric (by hand if you have not built the script yet). What score does it get? Anything below ten means the piece you shipped was off-voice. That is fine, it tells you which checks are too strict for real-world writing and which ones you should tighten the next draft against.

### Exercise 3, regenerate a generic draft

Take a draft that came back generic from a different prompt. Paste it into Claude with this prompt:

> "Here is a draft that scored 6 of 12 against our voice rubric. The failing checks are [list]. Here is our voice profile [paste]. Rewrite the draft to pass at least 10 of 12 checks. Do not add new claims. Do not invent facts."

Run the output back through the rubric. If it scores ten plus, the rubric works. If it still fails, the rubric needs softening or the source draft has structural issues the rewrite cannot fix.

## The eval gates

**Eval 1, corpus distribution.** No single author over forty percent of word count. If the brand wants a single-author profile (founder voice), name it that and skip this check.

**Eval 2, profile falsifiability.** Every claim in the profile must be checkable by a script or a careful reader. "Warm" or "confident" appearing anywhere in the JSON means the model drifted, regenerate.

**Eval 3, rubric calibration.** Run the rubric against five pieces from the corpus. They should score ten of twelve or higher. If corpus pieces fail the rubric the rubric is too strict, soften the numeric ranges to ±25% and re-score.

**Eval 4, drift watch.** Re-run extraction quarterly on the latest 90 days of "proud" output. Diff against the previous profile. If a numeric drifts by more than fifteen percent or a never-does enters or leaves the list, flag it and decide whether to formalise the new state or pull production back to the previous one.

## The failure modes

**The corpus contains a single dominant author.** If twelve of the fifteen pieces are by one person, the profile is that person's voice. Either declare them as the canonical voice (and rename it "founder voice profile" or similar) or require at least three distinct authors with no author over forty percent of word count.

**The model collapses the profile to vibes.** Some models return adjectives even when prompted for counts. Watch for "warm" or "confident" appearing anywhere in the JSON. They should not be there. Regenerate with a different model. Claude Opus tends to honour the structured-output discipline, GPT-5 needs the rules tighter, smaller models often need few-shot examples.

**The rubric is too strict.** A twelve-of-twelve hit rate is unreachable in practice. Most brand voices have a sentence-length variance that the strictest numeric check will fail. Set ship threshold at ten and use the gap analysis as the edit guide.

**The brand voice is actually two voices.** Some brands write differently on the blog than they do in the product. That is a real pattern, not a bug. Build two profiles, blog-voice and product-voice, route through the right one per channel. The prompt library should know which voice owns each output type.

**Voice drift after six months.** Model providers update, the team's best writer leaves, the founder stops writing. Re-run quarterly. If the diff is significant, voice is drifting in production. Decide whether to formalise the new state or pull it back.

## The pattern in practice

Illustrative scenarios that show common shapes this pipeline surfaces. Specifics are illustrative, patterns repeat.

**SaaS, Series B, the multi-voice corpus.** A brand with a long-form voice guide whose content output still sounds like everyone else in the category. Extraction typically surfaces that the "warm" voice the guide describes is actually three voices, the founder's, the head of content's, and the agency-written baseline. The honest move is to keep the first two as named profiles and retire the agency baseline. Blog engagement tends to improve measurably because every piece picks a real voice rather than splitting the difference.

**D2C apparel, growth-stage, the aspiration gap.** A brand told for years that its voice is "irreverent." Extraction often shows the corpus runs neutral-to-formal, with no contractions and very few rhetorical devices. The "irreverent" framing is aspiration rather than reality. The honest profile ships instead, the team stops trying to write irreverently, output gets more consistent, social engagement rises because the voice matches the rest of the marketing surface.

**Endurance brand, scale-stage, the buried pattern.** A brand with a strong voice that cannot articulate it. Extraction often surfaces that the brand opens nearly every long-form piece with a single short sentence under seven words, then a longer second sentence that qualifies or contradicts. The team bottles that as a rule, every opener routes through the short-prompt template that enforces it, bounce rate on long-form drops because the most distinctive thing about the voice is now applied consistently.

## Hand-off

The voice profile feeds every drafting pipeline downstream.
- **endurance-brand-voice**, layers the category-specific lexicon and inauthenticity checks on top of this baseline.
- **founder-and-institutional-voice**, runs this extraction twice, once per voice.
- **message-house-generator**, uses the voice profile to constrain pillar and channel-line drafting.
- **tagline-system**, uses the rubric to filter tagline candidates for voice fit.
