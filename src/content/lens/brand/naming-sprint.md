---
title: "Naming sprint — multi-pass with linguistic filtering"
stack: brand
description: "Generate a category-aware shortlist of brand or product names with phonetic checks, cultural sanity sweeps and a trademark-risk first-pass. Cut from 400 candidates to 8 in one day."
outputs: "Ranked shortlist of 8 names with rationale, risks and trademark first-pass"
readMin: 10
shipTime: "1 working day"
brandStage: ["pre-launch", "launch", "growth"]
channels: ["brand", "product-marketing"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-03
status: live
preview: false
---

## The brief

A naming exercise can swallow a quarter. Brainstorm sessions produce 80 names, half of them already trademarked. Three rounds of voting later, the team picks the safest, the founder veto'd one, and you ship with the runner-up. This playbook compresses the same exercise into a working day with a stronger shortlist because the pipeline does the work humans skip: phonetic checks across the brand's target languages, cultural sanity in three regions, a trademark-risk first-pass, and a category-distinctiveness score.

You still need a human to pick. The pipeline gets you to eight defensible candidates in a day instead of fifty fragile ones in a quarter.

## The pipeline

Six passes, run end-to-end.

**Pass 1 — Strategy intake.** Ten-question structured brief covering category, audience, the three named competitors, the desired connotations, the must-not connotations, and the brand's voice profile (from the voice-extraction playbook if it exists). All structured fields, no free-text essays.

**Pass 2 — Generation.** Run six generation strategies in parallel, each producing 50 candidates. Strategies: invented compound, modified real word, archaic revival, two-syllable abstract, metaphor-anchored, and competitor-contrarian. Generation is cheap, so over-produce — 300+ candidates total.

**Pass 3 — Phonetic and linguistic screening.** Score each name on pronounceability in English, the brand's secondary target languages, and the team's home language. Flag any with awkward consonant clusters, embedded profanity, embedded brand names, or known-offensive meanings in 12 reference languages. About 60% of candidates die here.

**Pass 4 — Distinctiveness scoring.** For each survivor, generate the semantic embedding and compare distance against the embeddings of the three named competitors plus the top ten brands in the broader category. Score 0–10 on category distance. Anything below 4 is too close.

**Pass 5 — Trademark first-pass.** Hit USPTO TESS, EUIPO and IPO via API for exact and near matches in the relevant trademark classes. This is a first-pass — it does not replace a trademark attorney. Names with exact matches in the same class die. Names with same-class similars get flagged for legal review.

**Pass 6 — Shortlist synthesis.** Rank the survivors on a composite score (40% strategy fit, 25% distinctiveness, 20% phonetic ease, 15% trademark headroom). Take the top 12 and write rationale paragraphs for the top 8. The pipeline outputs a deck-ready document and a single CSV for legal.

## The prompts

The generation prompts run in parallel. Here's the **invented compound** strategy, which produces the highest hit rate in our engagements.

```text
SYSTEM: You generate brand name candidates by invented-compound
construction. You combine roots, morphemes or fragments from related
semantic fields. You do not produce real words. You do not produce names
that exist as registered brands. You produce names that feel inevitable
once read — they sound like they have always been a word.

USER:
Category: {CATEGORY}
Audience: {AUDIENCE}
Desired connotations: {CONNOTATIONS_YES}
Must avoid: {CONNOTATIONS_NO}
Target languages: {LANGUAGES}
Tone: {VOICE_PROFILE_SHORT}

Existing brands in category (do NOT echo): {COMPETITORS}

Produce 50 invented-compound name candidates. For each, return:

{
  "name": "<the name>",
  "roots": ["<root 1>", "<root 2>"],  // the morphemes you combined
  "phonetic": "<IPA approximation>",
  "syllables": <number>,
  "stress_pattern": "<TRO-chee | I-AM-bic | dactyl | spondee | etc>",
  "connotation_drivers": ["<which root drives which connotation>"]
}

Rules:
- 50 candidates exactly.
- No real English words.
- No names already registered as a brand in {COMPETITORS} list.
- Average syllable count 2-3 unless audience tone calls for shorter.
- Stress on first syllable preferred unless audience tone calls for
  otherwise.
```

The phonetic screening prompt and the distinctiveness embedding-compare query are shipped in the full playbook download.

## The eval harness

The pipeline is gated against four failure modes.

**Eval 1 — Generation diversity.** Run the six strategies and check that the 300 candidates produce a vocabulary diversity score (unique 3-grams / total 3-grams) above 0.75. Below that, the model is repeating itself — bump temperature, switch model, or rotate seed.

**Eval 2 — Phonetic accuracy.** Random sample 20 candidates and verify the IPA against a phonetician's transcription. We maintain a reference set of 200 names with known IPA. Accuracy target 90%+. Below 85% means the model is hallucinating phonetics — fall back to a dedicated phonetic library.

**Eval 3 — Trademark recall.** Salt the candidate list with 5 names we know to be registered. Pass 5 should catch all 5. Catching 4/5 is acceptable; 3/5 means the API integration is dropping classes — check the class mapping in the request.

**Eval 4 — Strategy fit.** Have the brand's lead reviewer rate the top 12 on strategy fit (1-5). At least 8 of 12 should score 4 or above. If only 4-5 do, the strategy intake captured the wrong inputs — re-run with sharper connotation lists.

## The failure modes

**The model under-produces.** Some models stop at 30 candidates even when asked for 50, especially on long-running batches. Watch the count. If short, regenerate with explicit numbering ("Candidate 1 of 50:", "Candidate 2 of 50:", etc.).

**The trademark first-pass gives false comfort.** Hitting USPTO TESS for exact matches catches the obvious problems. It doesn't catch (a) common-law marks, (b) confusingly-similar marks (the trademark attorney's domain), or (c) brands that exist outside trademark systems. The pipeline output explicitly labels this as a first-pass. Anyone shipping a name without a trademark attorney is shipping legal risk.

**Cultural sanity needs native speakers.** The 12-language reference check catches the well-known bombs (the Chevy Nova story is a myth but the principle is real). It does not catch subtle connotations in any language. If the brand will operate in a market, get a native speaker on the candidate before final pick. The pipeline flags candidates with high cultural-risk scores so legal/strategy know which ones to spend the budget on.

**The team falls in love with candidate 47.** Naming is psychologically fraught. Once a stakeholder bonds with a name, the rationale gets retrofitted. Build a forced-choice review session: 8 candidates, blind rationale (read the rationale before the name), pick top 3. Then reveal names and re-rank. The disconnect between blind and revealed rankings is the conversation.

**You forgot the domain.** The pipeline doesn't check domain availability by default because it's noisy data (some are listed but unsold, some sit on registrar squat lists). We add a separate Pass 7 for engagements where domain matters at launch.

## The pattern in practice

Illustrative scenarios — common shapes the sprint takes. Specifics are illustrative; the patterns repeat.

**Climate-tech B2B, naming a new product line.** Six-week sprint with an external naming agency at £45k is the traditional path. The sprint compresses to a working day. A typical winning name comes from the modified-real-word strategy, survives all four eval gates, scores around 8 on distinctiveness, and ships within a quarter of the sprint completing. The compounding value is the trademark first-pass running in parallel rather than after.

**D2C wellness brand, full rebrand.** Twelve founders, half of them with strong opinions. The sprint produces the top 8 in a day, blind rationale review in a 90-minute session usually picks unanimously. The honest read: without the sprint, four rounds of opinion-led elimination would have run. With it, pre-screening removes the names that would have triggered the debates.

**Fintech, scrapped — the cautionary pattern.** A brand insists on a name flagged as a near-match against a registered mark in the same class. Trademark attorney later agrees the risk is material. The brand proceeds anyway and receives a cease-and-desist within months. The lesson isn't about the sprint — it's about respecting Pass 5. Trademark headroom belongs as a hard gate, not a flag.
