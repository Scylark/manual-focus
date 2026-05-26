---
title: "Endurance brand voice, the language of suffer, craft and quietness"
stack: brand
description: "Layer category-specific lexicon, credibility checks and inauthenticity tells onto a base voice profile, so the brand reads like someone who has actually done the work."
outputs: "Endurance lexicon, credibility-scored voice profile, channel-mapped prompt library"
readMin: 22
shipTime: "2 working days"
brandStage: ["growth", "scale", "enterprise"]
channels: ["content", "brand", "organic-social", "email"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-06-04
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts on top of the base voice profile.

1. An **endurance lexicon**, the verbatim terrain, time-of-day, distance, discomfort and quietness phrases the brand actually uses, frequency-tagged.
2. A **category-credibility score** out of ten with evidence, telling you honestly whether the brand reads like someone who has done the work.
3. An **inauthenticity-tells regex set**, the hyperbolic closers, generic motivational phrases and misused technical terms the brand should never publish.
4. A **channel-mapped prompt library**, drafting templates for blog opener, social caption, athlete-letter intro and product-page hero, each constrained against the credibility checks.

## Who this is for

A growth or scale-stage endurance brand (cycling, running, swimming, triathlon, mountaineering, gravel, trail, ultra) with at least twelve months of content, an audience that reads competitor brands and can sense outside-looking-in voice within a paragraph, and a team that has already run the base brand-voice-extraction playbook or will run it alongside this one.

If the brand sells endurance kit but has no real practitioners involved in writing or product, this playbook will produce a passable veneer rather than a real voice. The audience eventually meets the people. Fix the credibility before you scale the voice.

## Before you start

- [ ] A completed base voice profile from the brand-voice-extraction playbook
- [ ] 12 to 18 pieces of the brand's proudest endurance writing in `voice-corpus/`
- [ ] 8 to 12 pieces of canonical category writing in `category-context/`, race reports from credible publications, training journals from respected athletes, kit essays from credible publishers
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode
- [ ] A scratch document for the lexicon outputs

If the brand sells across more than one discipline (cycling and running, say), build separate corpora per sport. Cycling vocabulary has poor overlap with running vocabulary. A multi-sport brand needs sub-profiles, not a merged profile.

## The pipeline

Five phases. Phases 1 to 3 mirror the base extraction. Phases 4 and 5 are endurance-specific.

### Phase 1, corpus and canon assembly

The brand corpus tells the model who the brand is. The category corpus tells the model what credible category writing sounds like. Both are required.

**Step 1.1, brand corpus.**

If you have already run the base voice-extraction playbook, you have this. The `voice-corpus/` folder, 12 to 18 plain-text files, two thousand to twenty thousand words total.

**Step 1.2, category context corpus.**

Pull 8 to 12 pieces from publishers the brand's audience reads. For trail running, that might be iRunFar race reports, Sidetracked long-form essays, Trail Runner Magazine training pieces. For cycling, Rouleur features, Escape Collective opinion, race reports from CyclingTips archive. Save these to a separate folder, `category-context/`, named the same way.

Two notes. Do not pull from the brand's direct competitors, you want category-shaping writing rather than competitive copy. Do not pull more than two pieces from any single publication, you want canon, not voice imitation.

**Step 1.3, label the discipline.**

At the top of each file in both folders, add a single line, `DISCIPLINE, [trail-running | road-cycling | gravel | open-water-swim | etc]`. The Phase 4 prompt uses this to keep lexicon analysis discipline-specific.

**You should now have** two folders, `voice-corpus/` with brand pieces and `category-context/` with canon pieces, each labelled by discipline.

### Phase 2, structural pattern extraction

Run the base extraction prompt from the brand-voice-extraction playbook. You should already have the output. If you do not, run it now.

**You should now have** a structural voice profile JSON with sentence length, paragraph length, punctuation rules, person, tense, formality, openings and a never-does list.

### Phase 3, voice profile draft

Take the Phase 2 output and the Phase 3 rubric from the base playbook. Both feed into the endurance extension.

**You should now have** a structural profile and a twelve-check rubric, both saved.

### Phase 4, endurance lexicon extraction

This is the work the base playbook does not do. The lexicon is the language of practice, the words the brand uses about terrain, time, distance, discomfort and quietness.

**Step 4.1, assemble the JSON for both corpora.**

Same shape as before, `[{"title": "...", "discipline": "...", "body": "..."}, ...]`. Two files, `brand-corpus.json` and `category-corpus.json`.

**Step 4.2, run the lexicon prompt.**

```text
SYSTEM: You analyse endurance-sport brand writing for category-
specific language patterns. You distinguish credible endurance voice
(writing by people who have done the work) from generic sports-
lifestyle voice (writing about people doing the work). You return
verbatim phrases from the corpus. You do not invent.

USER:
Brand corpus: {BRAND_CORPUS_JSON}
Category context corpus: {CATEGORY_CORPUS_JSON}
Discipline: {DISCIPLINE}

Extract for the brand:

{
  "terrain_and_conditions": [
    {"phrase": "<verbatim>", "frequency": "<common|occasional|rare>"}
  ],
  "time_of_day_patterns": [
    {"phrase": "<verbatim>", "frequency": "<common|occasional|rare>"}
  ],
  "distance_duration_framing": [
    {"phrase": "<verbatim>", "frequency": "<common|occasional|rare>"}
  ],
  "discomfort_vocabulary": [
    {
      "phrase": "<verbatim>",
      "frequency": "<common|occasional|rare>",
      "tone": "<honest | euphemistic | absent>"
    }
  ],
  "quietness_signals": [
    {"phrase": "<verbatim>", "context": "<one sentence>"}
  ],
  "category_credibility_score": <0-10>,
  "category_credibility_evidence": [
    "<observable patterns that support the score, verbatim>"
  ]
}

Calibration:
- Compare brand corpus phrases against category corpus phrases.
- "Common" means in 30%+ of brand pieces.
- "Honest" tone uses the discomfort vocabulary directly. "Euphemistic"
  softens or motivational-isms over it. "Absent" means the brand does
  not reference discomfort at all.
- Credibility score, 10 means indistinguishable from canon, 5 means
  competent but generic, 0 means clearly outside-looking-in.

Rules:
- Verbatim only. No paraphrasing.
- Leave fields empty where the corpus genuinely lacks them.
- Credibility evidence must point to observable patterns, not general
  impressions.
```

**Expect output like:**

```json
{
  "terrain_and_conditions": [
    {"phrase": "a steady gravel climb", "frequency": "common"},
    {"phrase": "the broken switchbacks above the treeline", "frequency": "occasional"},
    {"phrase": "wet limestone", "frequency": "occasional"}
  ],
  "time_of_day_patterns": [
    {"phrase": "the long Sunday", "frequency": "common"},
    {"phrase": "first light", "frequency": "common"},
    {"phrase": "the lunchtime hour", "frequency": "occasional"}
  ],
  "distance_duration_framing": [
    {"phrase": "the back half", "frequency": "common"},
    {"phrase": "hour four", "frequency": "common"},
    {"phrase": "the second loop", "frequency": "occasional"}
  ],
  "discomfort_vocabulary": [
    {"phrase": "honest effort", "frequency": "common", "tone": "honest"},
    {"phrase": "the legs negotiate", "frequency": "occasional", "tone": "honest"},
    {"phrase": "the bonk", "frequency": "rare", "tone": "honest"}
  ],
  "quietness_signals": [
    {"phrase": "the miles no-one sees", "context": "Closing line of a newsletter on base training in February."}
  ],
  "category_credibility_score": 8,
  "category_credibility_evidence": [
    "Discomfort vocabulary used in honest register without motivational softening",
    "Time-of-day patterns ('first light', 'the long Sunday') match category canon",
    "Distance framing uses race-day reference points ('hour four', 'the back half') rather than recreational ones"
  ]
}
```

**You should now have** a lexicon JSON and a credibility score with evidence. Save it alongside the structural profile.

### Phase 5, inauthenticity-tells regex set

The credibility score tells you how the brand reads. The regex set is the guard rail that stops new drafts drifting back toward sports-lifestyle generic.

**Step 5.1, run the tells extraction prompt.**

```text
SYSTEM: You build an inauthenticity-tells regex set for an endurance
brand. These are the patterns the brand's audience associates with
outside-looking-in writing. You return regex patterns, not adjectives.

USER:
Brand lexicon: {PHASE_4_LEXICON_JSON}
Brand structural profile: {BASE_VOICE_PROFILE_JSON}
Discipline: {DISCIPLINE}

Return JSON shaped like:

{
  "hard_block_patterns": [
    {
      "pattern": "<regex>",
      "rationale": "<why this fails for this audience>",
      "suggested_replacement_from_brand_lexicon": "<verbatim phrase from Phase 4>"
    }
  ],
  "soft_flag_patterns": [
    {
      "pattern": "<regex>",
      "rationale": "<why this is borderline>"
    }
  ],
  "mis_used_technical_terms": [
    {
      "term": "<term>",
      "common_misuse": "<example of incorrect usage>",
      "correct_usage": "<example of correct usage>"
    }
  ]
}

Rules:
- 8 to 12 hard_block patterns.
- 4 to 8 soft_flag patterns.
- 3 to 5 mis_used technical terms with verbatim corrections.
- Replacement suggestions must come from Phase 4 lexicon. Do not
  invent.
```

**Expect output like:**

| Pattern | Rationale | Replacement |
|---|---|---|
| `\bunleash\b` | Hyperbolic, generic sports-lifestyle | "find" or "earn" |
| `\bcrush\b` | Wrong register, performative | "ride", "run", "work through" |
| `\byou.?ve got this\b` | Generic motivational closer | "the work compounds" |
| `\bjourney\b` | Cliché, audience-flagged | "season", "block", "build" |
| `\bgame.?changer\b` | Sports-lifestyle cliché | concrete claim with the kit name |
| `\bnext.?level\b` | Generic | name the level |
| `\bbeast mode\b` | Performative | name the effort, "honest effort", "hour four" |

Plus a few mis-used technical terms, things like "marathon" used about a 5k, "intense" used about an aerobic ride, "PR" used for any time improvement when the audience uses it for parkruns specifically.

**Step 5.2, wire into the rubric.**

Add three checks to the base rubric.

| Check | Type | Rule |
|---|---|---|
| Endurance credibility floor | Pattern | Lexicon match in at least 2 of 5 lexicon categories per piece |
| Inauthenticity-tells block | Regex | Zero matches against hard_block_patterns |
| Quietness presence (monthly) | Pattern | At least 20% of pieces in a calendar month contain a quietness signal |

**You should now have** an extended rubric of fifteen checks, a regex set saved as JSON, and a list of verbatim replacements ready to drop into the drafting prompt library.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand. The base voice profile already exists from the brand-voice-extraction worked example.

**Phase 1 output.** Brand corpus, fourteen pieces, 38,000 words. Category corpus, ten pieces, 42,000 words, drawn from iRunFar, Sidetracked, and Trail Runner archive. Discipline labelled trail-running.

**Phase 4 output, abbreviated:**

```json
{
  "terrain_and_conditions": [
    {"phrase": "the Cumbrian rain", "frequency": "common"},
    {"phrase": "loose granite under the heel", "frequency": "occasional"},
    {"phrase": "the line under the bracken", "frequency": "occasional"}
  ],
  "time_of_day_patterns": [
    {"phrase": "first light", "frequency": "common"},
    {"phrase": "the long Sunday", "frequency": "common"}
  ],
  "discomfort_vocabulary": [
    {"phrase": "the honest miles", "frequency": "common", "tone": "honest"},
    {"phrase": "the legs argue", "frequency": "occasional", "tone": "honest"}
  ],
  "quietness_signals": [
    {"phrase": "the miles no-one sees", "context": "February base-training newsletter."},
    {"phrase": "the unwitnessed PR", "context": "Closing line of an athlete profile."}
  ],
  "category_credibility_score": 8,
  "category_credibility_evidence": [
    "Terrain references are geographically specific (Cumbria, granite, bracken)",
    "Discomfort vocabulary stays in honest register, no motivational softening",
    "Quietness signals present in 4 of 14 pieces"
  ]
}
```

**Phase 5 output.** Hard-block regex includes `unleash`, `crush`, `you.?ve got this`, `journey`, `game.?changer`, `next.?level`, `beast mode`, `epic`. Mis-used terms include "marathon" used about a half, "ultra" used about anything under 30 km, "tempo" used about a recovery jog.

A draft scored against the extended rubric. Newsletter opener for the launch of the Vahla Range, 14/15 checks pass. The one failing check is the quietness presence at the monthly level, the newsletter is a product piece and does not carry a quietness signal. That is acceptable for the piece, the rubric is calendar-level for that check rather than per-piece.

> First light in the Lakes is rarely kind. The wind comes off Helvellyn before the sky has decided what it wants to do, and the line under the bracken is wet long after the path looks dry. The Vahla shell is built for that hour. Forty grams heavier than the lightweight category, because the lightweight category does not survive the second loop. The membrane breathes when you do, holds when the rain turns sideways, and packs into a back pocket for the descent. We made it for the honest miles, hour four onwards, when the season's work starts to show.

Email open rate on the launch sequence held above the prior quarter's baseline. The piece reads to a trail runner like trail running. That is the work.

## Try it yourself

Three exercises, each takes 20 to 30 minutes.

### Exercise 1, score one of your existing pieces

Pick a recent product launch or athlete profile from your blog. Paste it into Claude with this prompt:

> "Score this piece against the endurance credibility rubric. Look for lexicon match in terrain, time, distance, discomfort and quietness. Surface any inauthenticity tells. Return JSON with a score from 0 to 10 and a list of specific phrases that support or undermine the score."

If the piece scores 7 or higher, your voice is doing the work. Below 5, you have category-credibility debt the prompts cannot patch.

### Exercise 2, find your discomfort tone

Run the Phase 4 prompt focused only on discomfort vocabulary. Read the output. Is your tone honest, euphemistic or absent? A brand whose customers are recreational runners doing 10ks should probably sit in the honest-but-mild register. A brand whose customers are ultras and FKT athletes should probably sit further along the spectrum. Pick the register that matches your actual audience and bake the choice into the prompt library.

### Exercise 3, regenerate a generic draft

Take a piece a junior writer or agency drafted for you that came back generic. Paste it into Claude with this prompt:

> "Here is a draft. Here is our endurance lexicon [paste Phase 4 output]. Here is our inauthenticity-tells set [paste Phase 5 output]. Rewrite the draft to score 8 or higher against the credibility rubric. Use verbatim phrases from the lexicon where they fit. Block every regex pattern. Do not invent new claims."

Run the output back through the credibility check. The rewrite should reach 8 or better if the source piece had reasonable structure to begin with.

## The eval gates

**Eval E1, credibility floor.** New drafts score against the four-check credibility rubric, terrain accuracy, duration plausibility, discomfort tone match, gear-reference accuracy. Drafts below 3 of 4 do not ship.

**Eval E2, hyperbole regex.** Hard-block patterns return zero matches. Hyperbolic closers, generic motivational phrases and mis-used technical terms get blocked at draft-review. The replacement suggestion from Phase 5 is offered inline.

**Eval E3, quietness presence.** Across any calendar month of content, at least 20% of published pieces contain a quietness signal. Endurance brands that only celebrate the win read shallow, because the audience knows the long Sunday alone matters as much as the podium.

**Eval E4, discipline-vocabulary match.** A piece tagged as a running piece does not use cycling vocabulary, and vice versa. The discipline label in the corpus drives the check. Multi-discipline drafts get flagged for explicit reviewer attention.

## The failure modes

**The category-context corpus dilutes the brand voice.** If the brand has a strong voice, the category corpus anchors credibility but should not flatten distinctiveness. If brand outputs start sounding like generic race-report writing, the category corpus is over-weighted, reduce its share in the extraction pass.

**Founders who do not ride, run or swim.** The pipeline can produce copy that passes the rubric. The audience eventually meets the brand's people, products and decisions. A founder who cannot credibly talk about base training for ten minutes will be exposed at the first podcast appearance. Recommend the founder do the work rather than just write about it.

**Borrowed credibility from a single founder.** "Founded by a 2:30 marathoner" is a real claim. "We understand marathoners" said by the marketing team who do not run is borrowed credibility. The voice profile should separate founder voice from institutional voice, see the founder-and-institutional-voice playbook for the discipline.

**The wrong sport's vocabulary.** Cycling, running and swimming have poor lexical overlap. A multi-discipline brand needs sub-profiles. The discipline label in the corpus enforces this if you respect it.

**Performative struggle.** Brands sometimes over-correct toward "suffer" language to seem authentic. A brand whose customers are recreational athletes doing 5ks should not write like it produces copy for Ironman finishers. Match the register to the audience's actual practice.

## The pattern in practice

Illustrative scenarios that show common shapes endurance voice work takes. Specifics are illustrative, patterns repeat.

**Premium cycling brand, Series C, the founder-voice find.** A brand writing in generic sports-lifestyle voice for years. Extraction often surfaces the founder's actual long-form writing (often buried in a personal blog) as the strongest brand-voice candidate. Re-pointing the content engine at that voice typically lifts email open rates materially within a quarter. Subscribers tend to report in survey that the brand "finally sounds like cycling, not like marketing."

**Endurance nutrition, growth-stage, the founder-and-team split.** A brand whose founders actually train but whose marketing team does not. Extraction builds two profiles, founder voice for thought-leadership and high-credibility launches, brand voice for product descriptions and utility content. The split ends the perpetual revision cycle between founders and marketing team, because both write in their own register and the brand reads coherent across surfaces.

**Multi-sport apparel brand, the retired-V1 lesson.** An early version of this playbook produced a single voice profile across cycling, running and training audiences. Cycling pieces read fine, running pieces sounded slightly off to runners, training pieces actively turned off the gym audience. The current version requires sub-profiles per discipline, because voice is sport-specific in this category rather than brand-generic.

## Hand-off

The endurance lexicon and credibility scoring extend the standard voice rubric. The artefacts feed:
- **brand-voice-extraction**, this playbook layers on top of the base structural profile.
- **founder-and-institutional-voice**, runs lexicon extraction twice, once per voice.
- **message-house-generator**, pillar drafting uses the lexicon as a constraint.
- **tagline-system**, taglines filter against the inauthenticity-tells regex set.
