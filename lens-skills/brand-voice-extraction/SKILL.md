---
name: brand-voice-extraction
description: "When the user wants to extract a brand voice from existing writing, build a voice profile, document how the brand sounds, audit voice consistency, or set up voice guardrails. Also triggers on 'extract our voice', 'we need a voice guide', 'why does our content sound generic', 'codify how we write', or pasting a corpus of brand writing with 'what's the pattern'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/brand/brand-voice-extraction
---

# Brand voice extraction

You produce a voice profile that's specific enough to be falsifiable — observable patterns, not adjectives. The profile pairs with a reusable prompt library so future writing can be drafted in-voice and scored against the same rules.

"Warm, confident, knowledgeable" is not a voice profile. A voice profile is "second-person, present tense, mean sentence length 14 words ±5, contractions on, no em dashes, opens with a noun not the article."

## Inputs to gather first

1. **10–15 pieces of writing** the brand is proud of — its high-water mark, not its full output. Strip everything else.
2. The **author distribution** — if 12 of 15 are by one person, the profile is that person's voice, not the brand's. Flag and ask: declare that person the canonical voice, or require a more diverse corpus.
3. **Channels** the voice will be deployed against — blog, email, social, landing pages. The profile may need to split into sub-voices if channels have meaningful differences.

If `.lens/positioning-brief.md` exists, read it for context on the brand's overall positioning. Voice should be consistent with position.

## The pipeline (four phases)

### Phase 1 — Corpus curation

Confirm the 10–15 pieces are loaded. Reject thin corpora (<8 pieces) — the patterns won't stabilise.

### Phase 2 — Pattern extraction

For the full corpus, run this extraction prompt:

```text
SYSTEM: You are a stylometrician analysing a brand's writing. You surface
measurable, observable patterns — not adjectives, not feelings. Every
pattern must be one a human editor could verify by counting or reading.

USER:
Corpus (JSON list of {title, body}): {CORPUS}

Return JSON in this exact shape:

{
  "sentence": {
    "mean_words": <number>,
    "variance": "<high|medium|low>",
    "longest_typical": <number>,
    "shortest_typical": <number>
  },
  "paragraph": {
    "mean_sentences": <number>,
    "typical_range": [<number>, <number>]
  },
  "punctuation": {
    "contractions": "<common|occasional|absent>",
    "em_dashes": "<common|occasional|absent>",
    "semicolons": "<common|occasional|absent>",
    "exclamation_marks": "<common|occasional|absent>",
    "questions": "<common|occasional|absent>"
  },
  "voice": {
    "person": "<first|second|third|mixed-which>",
    "tense": "<present|past|mixed-which>",
    "formality": "<formal|neutral|informal>",
    "jargon_level": "<none|domain-light|domain-heavy>"
  },
  "openings": {
    "typical_opener_pattern": "<plain English with 3 examples from corpus>",
    "openers_avoided": ["..."]
  },
  "rhetorical_devices": [
    {"device": "<name>", "frequency": "<common|occasional>", "example": "<verbatim>"}
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
- Counts must be plausible for corpus size given.
- "Avoided" lists are inferred only when the pattern is absent across
  the WHOLE corpus.
- Every example verbatim, copy-paste accurate.
```

### Phase 3 — Voice profile synthesis

Aggregate into the final profile. The `what_this_brand_never_does` list is the most underrated section — a voice is as much defined by what's missing as what's present.

### Phase 4 — Prompt library build

For each of the team's recurring output types (blog opener, social caption, email subject, sales follow-up, landing-page H1), build a drafting prompt template that constrains against the profile. Each template:

- Loads the voice profile as system context
- Includes the never-does list explicitly
- Names the channel constraints (length, format)
- Includes the per-template eval rubric (see below)

## The voice rubric

Output a 12-check rubric for scoring future drafts. Each check is pass/fail or numeric:

| Check | Threshold |
|---|---|
| Mean sentence length within ±20% of profile | Within range |
| Sentence variance matches profile | Match |
| Paragraph length within profile range | Match |
| Contractions present per profile rule | Match |
| Em dashes count at or below profile | Match |
| Semicolons count at or below profile | Match |
| Person matches profile | Match |
| Tense matches profile | Match |
| Opener follows profile pattern | Match |
| No words from "avoided" list | Match |
| At least one rhetorical device from profile | Present |
| Reading-level within profile bracket | Within range |

Drafts scoring 10+/12 ship. 8–9/12 go back to the model with failing checks named. <8/12 regenerate from scratch.

Ship the rubric as a runnable script (Python or the project's runtime). The script takes ~30ms per draft, fast enough to gate a CI step.

## Output

Three artefacts:

1. **Voice profile** — the JSON from Phase 3 plus a Markdown summary
2. **Prompt library** — `prompts/` directory with one file per recurring output type
3. **Voice rubric** — `voice-rubric.py` runnable scorer + `voice-rubric.json` configuration

Save the voice profile to `.lens/voice-profile.json`. Downstream skills (eval-gated-drafting, social-content-factory, lifecycle-journey-builder) read this file.

## Evals

Self-check before delivery:

- **Profile is observable**, not adjective-based — no "warm" or "confident" anywhere in the JSON
- **Counts are plausible** — spot-check sentence length against the corpus manually
- **Avoided list is non-empty** — strong voices have things they never do
- **At least one rhetorical device captured with a verbatim example**

## Failure modes to watch

- **Corpus dominated by one author** — profile becomes that person, not the brand. Flag and decide.
- **Model collapses to vibes** — if the JSON contains "warm" or "confident," regenerate with stricter system prompt. Claude tends to honour structured-output discipline; smaller models often need few-shot examples.
- **Two-voice brand** — some brands have distinct blog-voice and product-voice. Build two profiles, route through the right one per channel.
- **Voice drift after 6 months** — re-run the extraction quarterly. Diff against previous profile. If the diff is significant, the brand has drifted and you decide whether to formalise or pull back.
