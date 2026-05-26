---
name: naming-sprint
description: "When the user wants to name a brand, name a product, name a feature, run a naming exercise, generate a shortlist of names, check name distinctiveness, or test names for trademark risk. Also triggers on 'we need a name', 'help me name our product', 'shortlist some names', 'what should we call this', or 'is X a good brand name'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/brand/naming-sprint
---

# Naming sprint

You compress what's usually a 6-week naming engagement into a working day. Generate broadly via six strategies, filter by rule, hand a defensible shortlist of 8–15 candidates with rationale and trademark first-pass.

You do not pick the final name. A human picks. You make the picking easy.

## Inputs to gather first

Structured intake — refuse to start without all ten:

1. **Category** the name will operate in
2. **Audience** — specific behavioural segment, not demographic
3. **Three named competitors** (the obvious ones the audience would name)
4. **Connotations the name should evoke**
5. **Connotations the name must avoid**
6. **Target languages** for operation
7. **Tone** (read from `.lens/voice-profile.json` if it exists, or ask)
8. **Use type** — brand name, product, feature, programme
9. **Domain matters?** — yes / no (affects Phase 6 work)
10. **Trademark classes** to check (the Nice classification numbers — most teams know which ones their product sits in; if not, infer from category)

## The pipeline (six passes)

### Pass 1 — Strategy intake

Confirm the ten inputs. Restate the brief back to the user so they can correct misreads.

### Pass 2 — Generation

Run six strategies in parallel, each producing 30–50 candidates:

1. **Invented compound** — fragments / morphemes from related semantic fields, fused
2. **Modified real word** — alter a familiar word by spelling, suffix or compound
3. **Archaic revival** — old word, new use
4. **Two-syllable abstract** — non-meaningful sound-rich combinations
5. **Metaphor-anchored** — a concrete noun standing for the abstract value
6. **Competitor-contrarian** — names structurally opposite the competitor norm

Use this template for the strongest strategy, invented compound:

```text
SYSTEM: You generate brand name candidates by invented-compound
construction. You combine roots, morphemes or fragments from related
semantic fields. You do not produce real words. You do not produce names
that exist as registered brands. You produce names that feel inevitable
once read — they sound like they have always been a word.

USER:
Category: {CATEGORY}
Audience: {AUDIENCE}
Desired connotations: {YES}
Must avoid: {NO}
Target languages: {LANGUAGES}
Existing brands in category (do NOT echo): {COMPETITORS}

Produce 50 invented-compound candidates. For each, return:

{
  "name": "<the name>",
  "roots": ["<root 1>", "<root 2>"],
  "phonetic": "<IPA approximation>",
  "syllables": <number>,
  "stress_pattern": "<TRO-chee|I-AM-bic|dactyl|spondee|etc>",
  "connotation_drivers": ["<which root drives which connotation>"]
}

Rules:
- 50 candidates exactly.
- No real English words.
- No echo of competitor names.
- Average 2–3 syllables unless tone calls for otherwise.
- Stress on first syllable preferred unless tone calls for otherwise.
```

### Pass 3 — Phonetic and linguistic screening

For each candidate, score:

- **Pronounceability** in English (1–5)
- **Pronounceability** in each target language (1–5)
- **Embedded profanity / offensive meanings** in 12 reference languages (Spanish, French, German, Italian, Portuguese, Mandarin, Japanese, Korean, Arabic, Hebrew, Hindi, Russian)
- **Awkward consonant clusters** (sssh, fch, etc.)
- **Embedded competitor names** (substring of a competitor — kill)

About 60% of candidates die here.

### Pass 4 — Distinctiveness scoring

For each survivor, compare to competitor and category embeddings. Score 0–10 on category distance. Anything below 4 is too close — drop unless the team is intentionally claiming closeness.

### Pass 5 — Trademark first-pass

Query USPTO TESS, EUIPO and IPO for exact and near matches in the supplied trademark classes. Mark each candidate:

- **Clear** — no exact or near match in the class
- **Flagged** — near match in same class, needs attorney review
- **Dead** — exact match in same class

Be explicit that this is a first-pass and not a substitute for a trademark attorney. Common-law marks and confusingly-similar marks are not detectable here.

### Pass 6 — Shortlist synthesis

Composite score: 40% strategy fit, 25% distinctiveness, 20% phonetic ease, 15% trademark headroom. Take the top 12, write rationale paragraphs for the top 8.

If domain matters, run a Pass 7 against the top 8: check `.com`, `.io`, `.co.uk`, plus the brand-relevant TLDs. Note which are available, which are squat-listed, which are owned.

## Output

Two artefacts:

1. **Shortlist document** — top 8 names, each with rationale, strategy that produced it, phonetic, distinctiveness score, trademark status, domain status (if relevant)
2. **CSV for legal** — full top 12 in tabular form with trademark class checks, ready to hand to a trademark attorney

Save to `.lens/naming-shortlist.md` and `.lens/naming-trademark.csv`.

## Evals

Before delivery:

- **Generation diversity** — vocabulary diversity score (unique 3-grams / total 3-grams) >0.75 across the 300 candidates
- **Phonetic accuracy** — sample 20 IPA transcriptions; verify against a phonetic library
- **Trademark recall** — salt the candidate list with 5 known-registered names; Pass 5 should catch all 5

## Failure modes to watch

- **Model under-produces** — some models stop at 30 candidates even when asked for 50. Check count; regenerate with explicit numbering ("Candidate 1 of 50:") if short.
- **Trademark first-pass gives false comfort** — explicitly label this as first-pass only in the deliverable.
- **Cultural sanity needs natives** — the 12-language reference catches the bombs. Subtle connotations need a native-speaker review on the final 8.
- **Team falls in love with candidate 47** — run a blind rationale review session (read rationale first, name reveal second) to surface the discount between blind ranking and revealed ranking. The disconnect is the conversation.
- **Forgot the domain** — if the brand will be searched online, check Pass 7 even if it wasn't requested.

## Hand-off

The top 8 shortlist is the input for the brand-voice-extraction (if naming a brand from scratch) or message-house (if naming a product line within an existing brand) skills.
