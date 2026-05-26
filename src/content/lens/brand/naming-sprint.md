---
title: "Naming sprint, multi-pass with linguistic filtering"
stack: brand
description: "Compress a quarter's naming exercise into a working day. 400 candidates, phonetic and trademark filters, eight defensible finalists with rationale."
outputs: "Shortlist of 8 names with rationale, risks, trademark first-pass, forced-choice review pack"
readMin: 24
shipTime: "1 working day"
brandStage: ["pre-launch", "launch", "growth"]
channels: ["brand", "product-marketing"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-03
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **ranked shortlist of eight names**, each with a one-paragraph rationale, the roots it was built from, IPA pronunciation, syllable count and the strategy that produced it.
2. A **trademark first-pass report**, USPTO, EUIPO and IPO query results across the relevant Nice classes, with exact matches blocked and near-matches flagged for attorney review.
3. A **forced-choice review pack**, eight candidates with rationale-only first (names masked), then revealed, designed to surface the gap between rational and emotional preference in the founder team.
4. A **risks summary**, the cultural, phonetic and competitive risk per name, written as a one-line caveat the team can quote in legal review.

## Who this is for

A pre-launch or growth-stage brand naming a new company, sub-brand, product line or capsule range. The founder or naming lead can convene a short forced-choice review session with three to five stakeholders. The brand has at least named its category, audience and three direct competitors. If those three inputs are still vague, run the positioning-audit-pipeline first, naming a category-confused brand is naming into a fog.

## Before you start

- [ ] A one-page brief covering category, audience, three named competitors, desired connotations, must-avoid connotations
- [ ] A short voice profile (from brand-voice-extraction), used to constrain tone of candidates
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode
- [ ] A trademark API or manual search access to USPTO TESS, EUIPO eSearch+, and your local trademark office (UK IPO for endurance brands operating in Britain)
- [ ] An hour blocked in three calendars for the forced-choice review session
- [ ] Optional, a phonetic library (the `epitran` Python library does the job) for IPA verification

You do not need a trademark attorney for the first-pass. You absolutely need one before final pick. Build that into the schedule.

## The pipeline

Six passes. End-to-end in a single working day if the inputs are ready.

### Pass 1, strategy intake

A ten-question structured brief. No essay fields, everything as picklists or short text.

**Step 1.1, fill the brief.**

Use this template, paste into a Notion page or a Google Doc.

| Field | Your input |
|---|---|
| Category | (e.g. trail-running apparel, sub-brand for ultra-distance kit) |
| Audience | (e.g. recreational ultra runners doing one 50k+ a year) |
| Three direct competitors | (e.g. Salomon S/LAB, La Sportiva, Inov-8) |
| Desired connotations (3 to 5) | (e.g. craft, endurance, quietness, terrain) |
| Must-avoid connotations | (e.g. elite-only, performative, novelty) |
| Target languages | (e.g. English, French, German) |
| Pronounceability priority | (high if global launch, medium if UK-only) |
| Voice profile summary | (paste 2 to 3 sentences from voice-extraction) |
| What the name must do | (anchor a sub-brand, name a product line, replace existing) |
| Domain pressure | (low if you can use a path or subdomain, high if you need .com) |

**Step 1.2, save the brief.**

Save as `naming-brief.md` or similar. Phase 2 prompts read directly from it.

**You should now have** a single structured page with every input the generation prompts need.

### Pass 2, parallel generation

Six strategies running in parallel. Each produces 50 candidates, you get to roughly 300. Generation is cheap, over-produce.

**Step 2.1, run the six strategies.**

The six strategies are invented compound, modified real word, archaic revival, two-syllable abstract, metaphor-anchored, competitor-contrarian. Run them in parallel chats or batched calls. Below is the invented-compound prompt as the example. The other five follow the same shape with different instructions.

```text
SYSTEM: You generate brand name candidates by invented-compound
construction. You combine roots, morphemes or fragments from related
semantic fields. You do not produce real words. You do not produce
names that exist as registered brands. You produce names that feel
inevitable once read. They sound like they have always been a word.

USER:
Category: {CATEGORY}
Audience: {AUDIENCE}
Desired connotations: {CONNOTATIONS_YES}
Must avoid: {CONNOTATIONS_NO}
Target languages: {LANGUAGES}
Voice tone: {VOICE_PROFILE_SHORT}
Existing brands in category (do NOT echo): {COMPETITORS}

Produce 50 invented-compound name candidates. For each, return:

{
  "name": "<the name>",
  "roots": ["<root 1>", "<root 2>"],
  "phonetic": "<IPA approximation>",
  "syllables": <number>,
  "stress_pattern": "<TRO-chee | I-AM-bic | dactyl | spondee>",
  "connotation_drivers": ["<which root drives which connotation>"]
}

Rules:
- 50 candidates exactly.
- No real English words.
- No names already registered as a brand in {COMPETITORS} list.
- Average syllable count 2 to 3 unless audience tone calls for
  shorter.
- Stress on first syllable preferred unless audience tone calls for
  otherwise.
- Number every candidate ("Candidate 1 of 50, ...").
```

**Step 2.2, the other five strategies.**

Modified real word, take an existing English or category word and modify a letter or syllable. Archaic revival, surface words that were common in the brand's category two hundred years ago. Two-syllable abstract, two-syllable invented names with strong stress patterns. Metaphor-anchored, names that lean on a single metaphor (terrain, weather, craft, time-of-day). Competitor-contrarian, names that deliberately occupy phonetic and semantic space the named competitors do not.

Save all six outputs into a single CSV, `candidates-raw.csv`, with columns Name, Strategy, Roots, IPA, Syllables, Stress, Connotation_drivers.

**You should now have** roughly 300 candidates in a single CSV.

### Pass 3, phonetic and linguistic screening

About sixty percent of candidates die here.

**Step 3.1, run the screening prompt.**

```text
SYSTEM: You screen brand name candidates for pronounceability and
linguistic safety across the target languages. You flag candidates
with awkward consonant clusters, embedded profanity, embedded brand
names or known-offensive meanings in 12 reference languages
(English, French, German, Spanish, Italian, Portuguese, Mandarin,
Japanese, Korean, Arabic, Hindi, Russian).

USER:
Candidates CSV:
{CANDIDATES_RAW_CSV}

For each candidate, return JSON shaped like:

{
  "name": "<verbatim>",
  "pronounceability": {
    "en": <0-10>,
    "secondary_languages": {"fr": <0-10>, "de": <0-10>}
  },
  "consonant_cluster_risk": "<low | medium | high>",
  "embedded_profanity_or_slur_flag": <true | false>,
  "embedded_brand_name_flag": <true | false>,
  "offensive_meaning_languages": ["<lang codes where this name has a
    known offensive or negative meaning>"],
  "verdict": "<pass | flag | block>"
}

Rules:
- "block" any candidate with profanity/slur, embedded brand, or
  offensive meaning in 1+ reference language.
- "flag" any candidate scoring under 6 pronounceability in English,
  or under 5 in a secondary target language.
- "pass" the rest.
- Be conservative on offensive meaning, flag if uncertain.
```

**Step 3.2, prune the CSV.**

Filter `candidates-raw.csv` to remove every `block` verdict. Keep `flag` candidates with a column for the flag reason. You should now be at 120 to 150 surviving candidates in `candidates-screened.csv`.

**You should now have** a screened CSV with roughly 60% of the original list eliminated and the rest annotated.

### Pass 4, distinctiveness scoring

The surviving candidates need to land in clear category space, not adjacent to competitor name shapes.

**Step 4.1, run the distinctiveness prompt.**

This pass works best with a model that exposes embeddings (GPT-5 or Claude Opus with the embeddings API). If you do not have embedding access, the prompt below approximates the calculation through semantic comparison instead.

```text
SYSTEM: You score brand name candidates on category distinctiveness.
For each candidate, you compare it semantically and phonetically
against the named competitors and the top brands in the broader
category. You return a 0-10 score where 10 is maximally distinctive
and 0 is indistinguishable.

USER:
Candidates: {SCREENED_CANDIDATES_CSV}
Named competitors: {COMPETITORS}
Top 10 broader-category brands: {BROADER_CATEGORY_BRANDS}

For each candidate, return JSON shaped like:

{
  "name": "<verbatim>",
  "semantic_distance_score": <0-10>,
  "phonetic_distance_score": <0-10>,
  "composite_distinctiveness": <0-10>,
  "nearest_competitor": "<name>",
  "nearest_competitor_reason": "<one-sentence why they cluster>",
  "verdict": "<distinct | near | too-close>"
}

Rules:
- Composite is the average of semantic and phonetic.
- "too-close" if composite under 4.
- "near" if composite 4 to 6, requires team review.
- "distinct" if composite 6+.
```

**Step 4.2, prune the CSV again.**

Drop every `too-close` candidate. Keep `near` candidates with the team-review flag. You should now be at 60 to 80 surviving candidates.

**You should now have** a distinctiveness-scored CSV with the closest-to-competitor candidates removed.

### Pass 5, trademark first-pass

Hit USPTO, EUIPO and IPO. Exact matches die, near-matches flag for attorney review.

**Step 5.1, identify the relevant Nice classes.**

For trail-running apparel, that is typically classes 25 (clothing), 18 (bags), 28 (sporting goods), 35 (retail services). Pick the classes the brand will actually file in.

**Step 5.2, run the trademark search.**

If you have API access, batch the surviving candidates through USPTO TESS, EUIPO eSearch+ and your local office. If you do not have API access, the manual route is to query each name in each office's web interface. Faster to script, but workable manually for 60 to 80 candidates.

The pattern is to search each name plus a fuzzy variant (one letter different) in each relevant class. Record exact and near matches.

**Step 5.3, score and prune.**

| Status | Action |
|---|---|
| Exact match in same class, any jurisdiction | Block, remove from list |
| Near match (one letter off) in same class | Flag, escalate to attorney |
| Exact match in different class | Note, attorney will assess |
| No match in any class | Pass |

You should now be at 20 to 40 surviving candidates.

**You should now have** a trademark-screened CSV. This is a first-pass and does not replace a trademark attorney. Names with same-class exact matches die. Names with same-class near-matches stay on the list with a flag that explicitly says "attorney review required before launch."

### Pass 6, shortlist synthesis and rationale

The final pass ranks the survivors and writes the rationale for the top eight.

**Step 6.1, score the survivors on the composite.**

The composite score is 40% strategy fit, 25% distinctiveness, 20% phonetic ease, 15% trademark headroom. Each component is 0 to 10. The composite is the weighted sum.

| Component | Weight | Source |
|---|---|---|
| Strategy fit | 40% | A 1 to 10 rating from the team on whether the name advances the brief. Optionally run a model-assisted pre-rating, see Step 6.2. |
| Distinctiveness | 25% | The Pass 4 composite distinctiveness score. |
| Phonetic ease | 20% | The Pass 3 pronounceability score, primary language. |
| Trademark headroom | 15% | 10 for no match in any class, 6 for cross-class match, 3 for same-class near-match (flagged), 0 for any exact same-class match. |

**Step 6.2, run the rationale prompt for the top 12.**

```text
SYSTEM: You write a one-paragraph rationale for each shortlisted
brand name, covering what the name does, why it advances the brief,
and the single biggest risk to flag for review. You write in the
brand's voice, no marketing hyperbole.

USER:
Shortlist (top 12, ranked): {TOP_12_CANDIDATES_JSON}
Brief: {NAMING_BRIEF}
Voice profile: {VOICE_PROFILE_SHORT}

For each name, return JSON shaped like:

{
  "name": "<verbatim>",
  "rationale": "<one paragraph, 60 to 90 words, what it does and why
    it advances the brief>",
  "biggest_risk": "<one sentence, the single biggest risk for
    legal/strategy review>",
  "alternative_use": "<one sentence, the other thing this name could
    work as if it doesn't fit the primary brief>"
}

Rules:
- 60 to 90 words per rationale.
- No marketing hyperbole.
- Sceptic-readable. The rationale should be defensible against a
  founder who hates the name.
- "biggest_risk" must be a real risk, not a softened risk.
```

**Step 6.3, prepare the forced-choice review pack.**

Build a one-page review document.

- Page 1, the rationales numbered 1 through 8, names masked
- Page 2, the rationales with names revealed
- Page 3, the top 8 with the trademark flags and biggest risks

This is what the team reads in the forced-choice session. The masked-first format prevents stakeholders from bonding emotionally with a name before they have read the rationale.

**You should now have** an eight-name shortlist with rationales, risks and a forced-choice review pack.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand. Naming a new sub-brand for ultra-distance kit, the brand wants to sit alongside Cascadia rather than under it.

**Pass 1 output.** Brief filled. Category, ultra-distance running kit. Audience, recreational ultra runners doing one 50k+ a year. Connotations yes, craft, endurance, quietness, terrain. Connotations no, elite-only, performative, novelty. Languages, English (primary), French, German.

**Pass 2 output.** 297 candidates across six strategies. The CSV ships as `candidates-raw.csv`. A sample of the invented-compound output:

| Name | Strategy | Roots | IPA | Syllables |
|---|---|---|---|---|
| Vahla | invented-compound | "vah" (calmness) + "la" (terrain suffix) | /ˈvɑː.lə/ | 2 |
| Stetcher | invented-compound | "stet" (steady) + "cher" (carry) | /ˈstɛ.tʃər/ | 2 |
| Lumora | invented-compound | "lumen" + "mora" (delay) | /luˈmoː.rə/ | 3 |
| Korrik | modified-real-word | "rock" modified | /ˈkɒ.rɪk/ | 2 |

**Pass 3 output.** Phonetic screening blocks 41 candidates, flags 32, passes 224. The blocks include `Brakke` (consonant cluster awkward in English), `Senka` (offensive in Russian), `Niche` (real English word, missed by Pass 2's filter).

**Pass 4 output.** Distinctiveness scoring drops 78 too-close candidates (mostly competitor-adjacent shapes). 146 candidates survive.

**Pass 5 output.** Trademark search across USPTO, EUIPO and UK IPO. 96 candidates blocked by exact same-class matches in clothing or sporting goods. 31 flagged for attorney review. 19 candidates pass cleanly.

**Pass 6 output.** Composite scoring ranks the 19. Top 12 get rationales. Top 8 enter the forced-choice review pack.

A sample of the rationale-only first page (page 1 of the review pack):

> **Candidate A.** A two-syllable name with trochaic stress, built from a calmness root and a terrain suffix. Sits cleanly outside the competitor set on both phonetic and semantic measures. Advances the brief's "quietness" connotation without leaning on suffer-language. Reads as a thing rather than a verb. Biggest risk, the calmness reading may feel too soft for the ultra-distance audience.
>
> **Candidate B.** A modified real word, two syllables, hard consonant stress. Visually distinctive in a category that runs vowel-heavy. Advances the "craft" and "terrain" connotations. Biggest risk, near-match on a registered brand in class 28 (sporting goods), attorney review required.

After the forced-choice review, the founder and marketing lead pick Vahla (Candidate A) over the runner-up. The trademark attorney clears it. The Vahla Range ships at the next launch and becomes the worked-example sub-brand referenced through the rest of the brand stack.

## Try it yourself

Three exercises, each takes 20 to 40 minutes.

### Exercise 1, run Pass 2 on a single strategy

Pick the invented-compound prompt. Fill in your brief. Run it. Read the 50 candidates. Are any of them ones you would not have produced manually? If yes, the strategy is doing real work. If every candidate reads like something you would have generated in a brainstorm, the brief is too narrow, broaden the connotations.

### Exercise 2, run Pass 3 manually on 20 candidates

Take 20 candidates from any source (yours or a previous sprint). Run the Pass 3 prompt. Read the output. Pick a name flagged for offensive meaning in a secondary language and verify with a native speaker if you can reach one. If the speaker confirms, the screening is working. If not, the model is over-flagging, soften the conservative-flagging rule.

### Exercise 3, build a forced-choice deck for 4 names

Pick four names from any naming exercise you have already run. Write a 60-to-90-word rationale for each, names masked. Send the four rationales to a colleague before revealing the names. Ask them to rank the rationales. Reveal the names. Ask them to rank again. The gap between the two rankings is what the forced-choice review is designed to surface.

## The eval gates

**Eval 1, generation diversity.** Six strategies, 300 candidates. Vocabulary diversity score (unique 3-grams over total 3-grams) above 0.75. Below that, the model is repeating itself, bump temperature, switch model, rotate seed.

**Eval 2, phonetic accuracy.** Sample 20 candidates and verify the IPA against a reference (the `epitran` library does the job, or a phonetician on retainer). Accuracy target 90%. Below 85% means the model is hallucinating phonetics, fall back to a dedicated phonetic library.

**Eval 3, trademark recall.** Salt the candidate list with five names known to be registered. Pass 5 should catch all five. Catching four of five is acceptable. Three of five means the API integration is dropping classes, check the class mapping in the request.

**Eval 4, strategy fit.** Have the brand's lead reviewer rate the top 12 on strategy fit (1 to 5). At least eight of twelve should score four or above. If only four or five do, the strategy intake captured the wrong inputs, re-run Pass 1 with sharper connotation lists.

## The failure modes

**The model under-produces.** Some models stop at 30 candidates even when asked for 50, especially on long-running batches. Watch the count. If short, regenerate with explicit numbering ("Candidate 1 of 50, ...").

**The trademark first-pass gives false comfort.** Hitting USPTO TESS for exact matches catches the obvious problems. It does not catch (a) common-law marks, (b) confusingly-similar marks (the attorney's domain), or (c) brands that exist outside trademark systems. The output explicitly labels this as first-pass. Anyone shipping a name without a trademark attorney is shipping legal risk.

**Cultural sanity needs native speakers.** The 12-language reference check catches the well-known bombs. It does not catch subtle connotations. If the brand will operate in a market, get a native speaker on the candidate before final pick. The pipeline flags candidates with high cultural-risk scores so legal and strategy know where to spend the budget.

**The team falls in love with candidate 47.** Once a stakeholder bonds with a name, the rationale gets retrofitted. The forced-choice review with masked rationale first is the discipline. Eight candidates, blind rationale, pick top three, then reveal and re-rank. The disconnect between blind and revealed rankings is the conversation.

**You forgot the domain.** The pipeline does not check domain availability by default because the data is noisy (some are listed but unsold, some sit on registrar squat lists). For engagements where domain matters at launch, run a separate Pass 7 with a domain-availability API.

## The pattern in practice

Illustrative scenarios that show common shapes the sprint takes. Specifics are illustrative, patterns repeat.

**Climate-tech B2B, naming a new product line.** A six-week sprint with an external naming agency at around £45k is the traditional path. The sprint compresses to a working day. A typical winning name comes from the modified-real-word strategy, survives all four eval gates, scores around 8 on distinctiveness, and ships within a quarter of the sprint completing. The compounding value is the trademark first-pass running in parallel rather than after.

**D2C wellness brand, full rebrand.** Twelve founders, half of them with strong opinions. The sprint produces the top 8 in a day. The blind rationale review in a ninety-minute session usually picks close to unanimously. Without the sprint, four rounds of opinion-led elimination would have run. With it, pre-screening removes the names that would have triggered the debates.

**Fintech, scrapped, the cautionary pattern.** A brand insists on a name flagged as a near-match against a registered mark in the same class. Trademark attorney later agrees the risk is material. The brand proceeds anyway and receives a cease-and-desist within months. The lesson is about respecting Pass 5. Trademark headroom belongs as a hard gate rather than a flag.

## Hand-off

The shortlist feeds:
- **trademark attorney**, for full clearance on the final pick
- **tagline-system**, the chosen name plus the brief inform tagline generation
- **brand-voice-extraction**, the chosen name becomes the seed for early voice work if the brand is new
- **message-house-generator**, the name's connotation drivers become inputs to the narrative sentence
