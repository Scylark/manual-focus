---
title: "Brand voice extraction and prompt library"
stack: brand
description: "Take a brand's existing best writing, extract a defensible voice profile and ship a prompt library that drafts new content in voice without sounding like AI."
outputs: "Voice profile, evaluation rubric and reusable prompt library"
readMin: 13
shipTime: "2 working days"
brandStage: ["growth", "scale", "enterprise"]
channels: ["content", "brand", "organic-social", "email"]
models: ["claude-4.5-sonnet", "gpt-5", "claude-4.5-opus"]
publishedAt: 2026-04-22
status: live
preview: false
---

## The brief

"Write in our voice" is the single most-failed instruction in marketing AI. Every team has tried pasting their brand guidelines into a system prompt and watching the output come back generic, then blamed the model. The model isn't the issue. The brand guidelines are the issue — they describe the voice in adjectives ("confident, warm, knowledgeable") that any model can satisfy in a hundred different ways.

This playbook produces three artefacts that fix that. **A voice profile** built from observable patterns in the brand's actual best writing — not adjectives, but cadence rules, lexical choices, syntactic tells. **An evaluation rubric** that scores any draft against the profile. **A prompt library** of templates for the team's recurring outputs (blog opener, social caption, email subject, sales follow-up), each pre-loaded with the patterns the rubric will check for.

The result is content that reads like the brand wrote it because it's built against the same rules the brand's best writer actually follows, often without realising.

## The pipeline

The pipeline has four phases.

**Phase 1 — Corpus curation.** Get the brand to nominate 10 to 15 pieces of writing they're proud of. Not their full output — their proudest. These set the high-water mark. Strip everything else.

**Phase 2 — Pattern extraction.** Run the corpus through a structured-extraction prompt that pulls thirty-plus observable patterns: average sentence length, sentence length variance, paragraph length, contraction frequency, comma-to-full-stop ratio, opening-word patterns, transition words used, transition words avoided, lexical formality, jargon density, person (first/second/third), tense distribution, rhetorical devices present.

**Phase 3 — Voice profile synthesis.** Aggregate the patterns into a voice profile that's specific enough to be falsifiable. Not "warm" — but "second-person, present tense, average sentence 14 words ±5, paragraphs of 2 or 3 sentences, contractions on, semicolons absent, em dashes absent, opening with the noun rarely with the article."

**Phase 4 — Prompt library build.** For each of the team's recurring output types, build a prompt template that constrains the model against the profile. The prompts read like recipe cards: input slots labelled, output rules explicit, evaluation criteria attached.

## The prompts

The core extraction prompt is the one that earns the profile. We've shipped many versions; this is the one that holds up.

```text
SYSTEM: You are a stylometrician analysing a brand's writing. Your job is
to surface measurable, observable patterns — not adjectives, not feelings.
Every pattern you report must be one a human editor could verify by
counting or reading.

USER:
Corpus (15 pieces, JSON list of {title, body}):
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
    {"device": "<name>", "frequency": "<common|occasional>", "example": "<verbatim from corpus>"}
  ],
  "transition_words": {
    "used": ["..."],
    "avoided": ["..."]
  },
  "what_this_brand_never_does": [
    "<observable patterns absent from the entire corpus>"
  ]
}

Rules:
- Counts must be plausible for the corpus size given. Spot-check before
  outputting.
- "Avoided" lists are inferred only when the pattern is absent across the
  WHOLE corpus.
- Every example must be verbatim from the corpus, copy-paste accurate.
```

The "what this brand never does" field is the most underrated. A voice is defined as much by what's missing as by what's present. The brands with the most distinctive voices are usually the ones with the longest "never does" lists.

## The eval harness

We score every draft against the profile using a deterministic rubric. Not a model-judges-model setup — those drift. A scoring script that counts the patterns.

The rubric has 12 checks, each pass/fail or numeric:

| Check | Type | Threshold |
|---|---|---|
| Mean sentence length within ±20% | Numeric | Within range |
| Sentence variance matches profile | Pattern | Match |
| Paragraph length within profile | Numeric | Within range |
| Contractions present per profile rule | Pattern | Match |
| Em dashes match profile (count) | Numeric | At or below |
| Semicolons match profile (count) | Numeric | At or below |
| Person matches profile | Pattern | Match |
| Tense matches profile | Pattern | Match |
| Opener follows profile pattern | Pattern | Match |
| No words from the "avoided" list | Pattern | Match |
| At least one rhetorical device from profile | Pattern | Present |
| Reading-level within profile bracket | Numeric | Within range |

A draft scoring 10+ ships. Scoring 8-9 goes back to the model with the failing checks named explicitly ("rewrite. Your draft has 3 em dashes; the brand uses 0. Mean sentence length 23; target is 14 ±5.") Scoring below 8 is regenerated from scratch, not edited.

This eval is run by a script (Python or your runtime of choice), not a human. We ship the script and the rubric JSON as part of the playbook download. The script takes about 30ms per draft. You can wire it into a CI step on the content repo and it will block a merge.

## The failure modes

**The corpus contains a single dominant author.** If 12 of the 15 pieces are by one person, the profile is that person's voice, not the brand's. Solve by either (a) declaring that author as the canonical voice and being intentional about it, or (b) requiring at least 3 distinct authors in the corpus, with no author over 40% of total word count.

**The model collapses the profile to vibes.** Some models will return adjectives even when prompted for counts. Watch for "warm" or "confident" appearing anywhere in the JSON; they shouldn't. If they do, regenerate with a different model. Claude tends to honour the structured-output discipline here; GPT-5 needs the rules tighter; smaller models often need few-shot examples.

**The rubric is too strict.** A 12-of-12 hit rate is unreachable in practice. Most brand voices have a sentence-length variance that the strictest numeric check will fail. Set the ship threshold at 10 and use the gap analysis (which 2 failed?) as the edit guide.

**The brand voice is actually two voices.** Some brands write differently on the blog than they do in the product. That's not a problem; it's a real-world pattern. Build two profiles (blog-voice, product-voice) and route through the right one per channel. The prompt library should know which voice owns each output type.

**Voice drift after 6 months.** The model providers update. The team's best writer leaves. Re-run the corpus extraction quarterly on the latest 90 days of "proud" output and diff the profile against the previous version. If the diff is significant, the voice is drifting in production — flag and decide whether to formalise the new state or pull it back.

## The receipts

**SaaS, Series B, 90-person team.** Brand had a 22-page voice guide. Content output sounded like everyone else in the category. Voice extraction pipeline found that the "warm" voice the guide described was actually three voices — the founder's, the head of content's, and the agency-written baseline. We built profiles for the first two, retired the agency baseline. Content team now writes in either founder or content-head voice, deliberately picked per piece. Blog readership engagement up 38% over two quarters.

**D2C apparel, growth-stage.** The brand had been told its voice was "irreverent." The extraction pipeline showed the corpus actually ran neutral-to-formal, with no contractions and very few rhetorical devices. The "irreverent" framing was aspiration, not reality. Honest profile shipped instead. The team stopped trying to write irreverently — output is now more consistent and the social engagement actually rose, because the voice matched the rest of the marketing surface.

**Endurance-sports brand, scale-stage.** The brand had a strong voice but couldn't articulate it. The pipeline surfaced that the brand opens nearly every long-form piece with a single short sentence under 7 words, then a longer second sentence that contradicts or qualifies it. We bottled that as a rule. Every blog opener now goes through a short-prompt template that enforces it. Bounce rate on long-form down 14%.
