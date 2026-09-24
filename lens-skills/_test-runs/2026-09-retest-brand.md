# Brand stack retest, Claude Opus 5.5, 24 September 2026

A retest of the seven brand playbooks in `src/content/lens/brand/` against
Claude Opus 5.5 (`claude-opus-5-5`). Each playbook's copy-paste prompts were
run in order on real public material, and the output was scored against the
playbook's own eval gates.

## How this was run, and what it can't tell you

- **Model.** Every prompt was run by Opus 5.5 inside a single Claude Code
  session. There was no separate API call per prompt, no temperature control
  and no provider structured-output mode. JSON came back because the prompt
  asked for it. Nothing was tested on GPT or Gemini.
- **Real input.** The main test brand is **SOAR Running** (London, running
  apparel). Sources were its homepage, About, Risk Free Trial, Repairs, a
  product page and 14 journal and story pieces, 7,890 words in total. The
  founder corpus was two published Q&As with Tim Soar (The Morning Shakeout
  and Believe in the Run) plus his ProtoLab quote on soarrunning.com. The
  competitor set was Tracksmith, SATISFY and Bandit, taken from their homepage
  and About copy. Category canon was two iRunFar pieces from September 2026.
  Customer voice was SOAR's Trustpilot page, which has 3 reviews and an
  unclaimed profile. inov8.com (403) and SOAR's Okendo reviews (loaded by
  JavaScript) could not be fetched.
- **Worked-example input.** The naming sprint used the playbook's own
  Cascadia ultra sub-brand brief.
- **Counting was done by script, not by the model.** Sentence stats, rubric
  scoring, verbatim checks, regex runs, character limits, trigram diversity
  and A/B power calculations were all done in Python. The scripts are in the
  session scratchpad and are not committed.
- **Scope.** The retest was proportionate. Every prompt ran at least once,
  but large-volume steps were cut down: 50 names, not 300; 35 taglines, not
  200. Nothing was trademark-searched, A/B-tested or shown to human readers,
  so any gate that needs those is marked NOT TESTABLE.

## Summary

| Playbook | Verdict | Gates passed / tested | Key note |
|---|---|---|---|
| brand-voice-extraction | PASS-WITH-NOTES | 2 / 3 | Profile stays countable, with no adjectives. Model-estimated counts drift (paragraph length 27% high), and only 7 of 14 corpus pieces clear the rubric even after softening to ±25%. |
| endurance-brand-voice | PASS-WITH-NOTES | 3 / 3 | 26 of 26 lexicon phrases verbatim. Regex caught three real tells on SOAR's live product page. The per-piece lexicon floor can't be passed as written, and gate E1 refers to a rubric the pipeline never builds. |
| founder-and-institutional-voice | PASS-WITH-NOTES | 1 / 1 | Prompts run cleanly. The diagnosis list has no value for a split institutional voice. Three of four gates need people or archives. |
| message-house-generator | PASS-WITH-NOTES | 2 / 4 | Refused to invent proof twice. Hard-coded "no em dashes" overrides the brand's own voice profile. The 12-check prose rubric can't score a 35-character H1: 1 of 10 lines passes. |
| naming-sprint | PASS-WITH-NOTES | 1 / 1 | Exactly 50 candidates, all numbered. Character-trigram diversity 0.78. The gate's metric shrinks as the list grows. USPTO TESS is retired. The worked example breaks its own block rules. |
| positioning-audit-pipeline | PASS-WITH-NOTES | 2 / 2 | Six contradictions surfaced, every one sourced. Public-surface audits have no revenue mix, and the playbook gives no path for that. The B2C review corpus can be close to empty (3 reviews). |
| tagline-system | PASS-WITH-NOTES (must-fix) | 1 / 1 | Prompts and composite arithmetic check out. The worked A/B example is statistically invalid: 8,500 impressions per variant can't detect a 15% lift, and the "winner" beats the runner-up at p≈0.58. |

No playbook FAILS at prompt level. Every prompt produced usable output on
Opus 5.5 without being rewritten.

Across all seven, Opus 5.5 was more conservative than the failure modes
predict:

- It didn't collapse to adjectives.
- It didn't under-produce candidate lists.
- Where a proof point or lexicon replacement didn't exist, it flagged the gap
  ("NONE IN LEXICON", "PROOF GAP", `invented_DO_NOT_USE`) rather than filling
  it.

The weak point is different: numbers. The model's in-head counts and
estimates are roughly right but not reliable enough to set rubric thresholds.
Every playbook that asks the model to count should hand counting to a script.

### Edits that apply to all seven

- **Model frontmatter.** `models:` still lists `claude-4.5-opus` and
  `claude-4.5-sonnet`. Adding Opus 5.5 needs the enum changed first, because
  `LENS_MODELS` in `src/content.config.ts` validates the field. Add
  `'claude-5.5-opus'` to follow the existing naming pattern, then change
  `models: ["claude-4.5-opus", "gpt-5"]` → `models: ["claude-5.5-opus", "claude-4.5-opus", "gpt-5"]`.
  Only list GPT-5 if it has actually been retested.
- **USPTO TESS was retired in November 2023** and replaced by USPTO Trademark
  Search. It appears in:
  - `naming-sprint.md` lines 34, 229 and 367
  - `tagline-system.md` line 34
  - `lens-skills/naming-sprint/SKILL.md` line 101

---

## 1. brand-voice-extraction

**Input.** 14 SOAR pieces, 7,890 words: 3 commerce pages, 5 house essays, 1
guest feature, 2 bylined features and 3 athlete first-person race reports. All
four prompts were run: Phase 2 extraction, Phase 3 rubric, Phase 4 template,
and one draft from the template. The 12 rubric checks were then built as a
40-line Python scorer.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, corpus distribution | PASS | The largest author is the guest feature at 22.7% of words. No author is over 40%. |
| Eval 2, profile falsifiability | PASS | No adjectives in the JSON. Every field can be checked by counting. |
| Eval 3, rubric calibration | FAIL | Only 6 of 14 corpus pieces scored 10 or more at ±20%, and 7 of 14 at ±25%. Most of the remaining failures are pattern checks (C9 scene-first opener, C11 fragment), not numeric ones. |
| Eval 4, drift watch | NOT TESTABLE | Needs two quarters of output. |

**Compared with what the playbook predicts.** The playbook expects model
counts to be "plausible". They were close but not accurate enough to set
thresholds on:

| Field | Model estimate | Script count | Error |
|---|---|---|---|
| Mean words per sentence | 17.5 | 15.7 | +11% |
| Mean sentences per paragraph | 3.2 | 2.5 | +27% |
| "Longest typical" sentence | 38 | 28 (90th percentile) | +36% |

The paragraph error went straight into rubric check C3. The draft opener
scored 10 of 12 and would ship. It also invented a fact: it put "mile
twenty-two on the Embankment", but the London Marathon reaches the Embankment
around mile 24–25. The Phase 4 template has no "don't add facts" rule.

A structural gap: SOAR works as a publisher, with athletes and guest writers
producing most of the journal. The Eval 1 gate passes, but the profile ends up
describing an editor's selection rather than a single voice.

```text
C1 mean sentence 14.0–21.0 | C3 paragraph 2.6–3.8 sentences | C9 first sentence has time/place token
about            7/12  fails C1 C3 C9 C11 C12
beneath-the-rift 11/12 (±25%)
rust-never-sleeps 7/12 fails C3 C6 C9 C11 C12
sdw100 (athlete) 11/12 fails C3
draft opener     10/12 fails C1 C3  -> ships
> "Mile twenty-two on the Embankment, and the form starts to go before the
>  lungs do. The stride shortens. The hips drop."
```

**Recommended edits**

1. Step 2.2, after "Mid-tier models drift on the larger corpora.", add:
   "Then compute sentence mean, paragraph mean and punctuation rates with a
   short script or `wc` and replace the model's numbers. In our September
   2026 retest the model's paragraph-length estimate was 27% high, and the
   rubric inherited the error."
2. Eval 3. Old: "soften the numeric ranges to ±25% and re-score." New:
   "soften the numeric ranges to ±25% and re-score. If pieces still fail on
   pattern checks (opener shape, rhetorical device), those checks were fitted
   to a few examples. Drop them, or make them corpus-level ('in at least half
   of pieces')."
3. Phase 4 template, under "Rules for you:", add: "- The template must tell
   the drafting model not to add facts, places, numbers or product claims
   that are not in the brief."
4. Failure modes, add: "**The brand is a publisher.** If athletes and guest
   writers produce most of the journal, the profile describes an editor's
   taste, not a writer's voice. Build the house profile from brand-written
   pieces only, and treat guest pieces as category context."

---

## 2. endurance-brand-voice

**Input.** Discipline was trail-running, using five SOAR trail pieces (WURL
FKT, SDW100, Country Boy, Beneath the Rift, Rust Never Sleeps) plus two
iRunFar pieces as category canon. The Phase 2 and 3 outputs were reused from
playbook 1. Phase 4 lexicon and Phase 5 tells both ran, and the regex set was
run over the full corpus plus the live Marathon Speed Shorts product page.

| Gate | Result | Evidence |
|---|---|---|
| E1, credibility floor | PASS (caveat) | The playbook-1 draft was scored by hand on the four named checks and got 3 of 4, so it ships. The terrain check correctly failed on the Embankment error, but the gate still lets a factual error through. |
| E2, hyperbole regex | PASS | Three hard-block hits on SOAR's live product page: "unleashing your true potential" and "Revolutionary muscle support". One false positive on an athlete's verbatim quote ("I crushed the Bullion Divide"). |
| E3, quietness presence | NOT TESTABLE | Needs a publishing calendar. As a proxy, 3 of 5 trail pieces carry a quietness signal. |
| E4, discipline-vocabulary match | PASS | The only cross-discipline hit was "cycling" in why-we-wear-it, used as a cultural comparison. Flagged for review, as the gate intends. |

**Compared with what the playbook predicts.**

- All 26 extracted phrases and evidence quotes appear verbatim in the corpus
  (checked by script).
- Every phrase tagged `rare`. The 30%-of-pieces threshold only works for
  brands with house catchphrases.
- The Step 5.2 check "lexicon match in at least 2 of 5 categories per piece"
  matched 0 of 5 on a new draft. New writing almost never reuses a verbatim
  phrase, so the check can't be passed as written.
- The "replacements must come from Phase 4 lexicon" rule couldn't be met for
  6 of 10 hard blocks. The model returned "NONE IN LEXICON" rather than
  inventing one. The playbook's own example table breaks this rule
  ("find", "earn", "season" and "block" are not lexicon phrases).
- Gate E1 names a "four-check credibility rubric" (terrain, duration,
  discomfort tone, gear) that no phase of the pipeline builds. Step 5.2 builds
  three different checks.

```text
"category_credibility_score": 7,
"category_credibility_evidence": [
 "Athlete-authored reports carry race-craft canon uses: 'don't overcook the downhills', '90-100g of carbs per hour, for 7–8 hours'",
 "Brand-authored trail essays sit in a literary register ('a descent into the depths of the land', 'What began as a mapped journey') that canon race reporting does not use",
 "Credibility is concentrated in 2 of 5 trail pieces, both written by sponsored athletes, not the brand" ]
hard | product-page | unleashing    | ...recover faster—unleashing your true potential...
hard | product-page | Revolutionary | ...every second counts. Revolutionary muscle support...
hard | beneath-the-rift | journey    | ...What began as a mapped journey became a descent...
hard | wurl-fkt (athlete quote) | crushed | ...I crushed the Bullion Divide...   <- false positive
```

**Recommended edits**

1. Step 5.1 rules. Old: "- Replacement suggestions must come from Phase 4
   lexicon. Do not invent." New: "- Replacement suggestions come from the
   Phase 4 lexicon where one fits. Where none fits, return 'none in lexicon,
   rewrite the sentence'. Do not invent." Then change the example table's
   Replacement column to real lexicon phrases or "rewrite".
2. Step 5.2 table. Old: "Lexicon match in at least 2 of 5 lexicon categories
   per piece". New: "References at least 2 of the 5 lexicon categories per
   piece (a terrain, time, distance, discomfort or quietness reference, not
   necessarily a verbatim lexicon phrase)".
3. Phase 4 calibration. Old: "- 'Common' means in 30%+ of brand pieces."
   New: "- 'Common' means the pattern appears in 30%+ of brand pieces. Judge
   the pattern (names a time of day), not the exact phrase."
4. Eval E1. Old: "Drafts below 3 of 4 do not ship." New: "Drafts below 3 of
   4 do not ship. Any factual error in a terrain, distance or gear reference
   blocks the draft whatever the score." Also either define the four checks
   in Step 5.2 or point E1 at the Step 5.2 checks.
5. Eval E2, add: "Verbatim athlete or customer quotes are flagged for the
   editor, not blocked."
6. Line 55, "race reports from CyclingTips archive". CyclingTips closed in
   2023 and its archive moved into Outside's Velo; much of its team founded
   Escape Collective. Suggested replacement: "race reports from Velo (which
   now holds the CyclingTips archive)". Low priority, because the sentence
   already reads as an archive reference.

---

## 3. founder-and-institutional-voice

**Input.** Founder corpus of about 2,360 words: Tim Soar's answers from two
Q&As plus his ProtoLab quote. These are spoken and edited, not written.
Institutional corpus: SOAR's brand-written pieces, 2,075 words. The pipeline
was run as follows:

- Step 1.3: base stats computed by script, for both corpora
- Step 1.4: the diff prompt
- Step 3.2: the institutional POV prompt
- Step 4.1: the contract template, filled with placeholders

| Gate | Result | Evidence |
|---|---|---|
| V1, voice-distinctness | NOT TESTABLE | Needs 20 pieces classified blind to byline. |
| V2, founder-attribution accuracy | NOT TESTABLE | Needs the founder's email and messaging archive. |
| V3, audience clarity | NOT TESTABLE | Needs 5 human readers. |
| V4, resilience to founder absence | PASS | Founder-owned surfaces at SOAR are the Designer's Notes films, ProtoLab notes and press interviews. Everything else already runs institutionally, so there is low over-dependence. |

**Compared with what the playbook predicts.**

- Every founder and institutional quote exists in the sources.
- One evidence quote didn't support its own pattern: "You don't outrun
  Shanghai." was cited for em-dash use but contains no em dash.
- The diagnosis enum didn't fit SOAR. The institutional voice has two
  registers, literary editorial and hype product copy. Neither is a faded
  founder copy, and three shared patterns rule out `generic_marketing`. The
  model fell back on `undefined` and explained why.
- The POV prompt returned 4 claims, each tied to a founder quote and a brand
  action. Examples: the 31-day Risk Free Trial, SOAR X Repair at £20, the
  custom club vest programme.
- It also listed founder-only topics, such as his Nike Breaking2 critique and
  his predictions about cycling-style tight fit.

```text
founder       sent_mean 13.8  I/my/me 2.41 per 100w  you 0.64  em 0.68
institutional sent_mean 14.7  I/my/me 0.24 per 100w  you 1.25  em 0.87
"institutional_voice_diagnosis": "undefined",
"diagnosis_evidence": [
 "Institutional corpus contains two registers: literary editorial ('Stone underfoot. Cold at the margins.') and hype product copy ('unleashing your true potential')",
 "Neither register is a weaker copy of the founder, so faded_copy does not apply; 3 shared patterns rule out generic_marketing" ]
POV 2: "Kit is judged by running in it." founder: "It was obvious to me that whoever
made that stuff didn't run in it." action: 31-day Risk Free Trial.
```

**Recommended edits**

1. Diff prompt schema. Old: `"<credible_peer | faded_copy | generic_marketing | undefined>"`.
   New: `"<credible_peer | faded_copy | generic_marketing | split | undefined>"`.
   Add this rule: "- Diagnose 'split' when the institutional corpus holds two
   or more registers that differ from each other more than from the founder.
   Re-run the diff once per register."
2. Step 1.1. Old: "Skip anything ghost-written, even if it carries the
   founder's name." New: "Skip anything ghost-written, even if it carries the
   founder's name. Interviews count only when the answers are clearly the
   founder's words. Label them as spoken, because they run shorter and more
   blunt than the founder's written prose."
3. Diff prompt rules, add: "- Where evidence illustrates a punctuation or
   length pattern, the quoted evidence must contain that pattern." Also add
   a line before the prompt: "Paste in script-computed sentence and pronoun
   rates rather than asking the model to estimate them."

---

## 4. message-house-generator

**Input.** SOAR's sharpened brief from playbook 6. The run went through:

- the Phase 1 validator
- the Phase 2 pillars, as three structures
- the Phase 3 proof expansion
- the Phase 4 channel lines for pillar 1
- 8 rebuttals

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, pillar distinctiveness | PASS | Rated by hand. The closest pair (engineering and repair) is about 0.4. No embeddings API was used. |
| Eval 2, proof-point traceability | PASS | Every proof point traces to a page. A durability-rate stat the brand never published was marked `invented_DO_NOT_USE`, not invented. |
| Eval 3, channel-line voice consistency | FAIL | Only 1 of 10 channel lines reached the ship threshold on the playbook-1 rubric. Length, variance and paragraph checks can't apply to a 35-character H1. |
| Eval 4, rebuttal coverage | FAIL | The first pass covered price and category but no fit objection. The gate caught it, which is the gate working. |

**Compared with what the playbook predicts.**

- The validator worked as designed. The first brief came back `conditional`
  because C1 named no benefit. After a rewrite ("Race kit that still works at
  mile twenty, fabric-first and run-tested, for club and competitive amateur
  runners.") it passed.
- All 10 channel lines fit their character limits.
- The channel-lines prompt hard-codes "No exclamation marks, no em dashes, no
  semicolons". That is Cascadia's voice, not a general rule, and SOAR uses em
  dashes at 0.84 per 100 words.
- Two rebuttals ("world's best" and slow refunds) had no verified proof. The
  model wrote "PROOF GAP" rather than stretch another proof to fit.
- "Verified" is overloaded: a brand's own website claim got marked as
  verified.
- One sales talking point dropped a qualifier: Archive Sale items are
  excluded from the Risk Free Trial.

```text
landing_page_H1        35/60   Run in it for 31 days. Then decide.
email_subject          38/60   Kit shouldn't be judged standing still
instagram_caption     193/220  You can't judge race kit in a changing room. So don't. Run
                               your long run in it, race a parkrun in it...
sales_talking_point_3  84/120  If it wears out, SOAR X Repair fixes it for a £20 flat fee,
                               return postage included.
6. [credibility] "'World's best running apparel' - says who?"
   R: [NO VERIFIED PROOF FOR THE SUPERLATIVE] Point to the trial and athlete results instead.
   Fallback: Concede it is an aspiration, not a measured claim.
```

**Recommended edits**

1. Step 4.1 rules. Old: "- No exclamation marks, no em dashes, no
   semicolons." New: "- Follow the punctuation rules in the voice profile."
2. Step 3.1 schema. Old: `"<verified | pending | invented_DO_NOT_USE>"`.
   New: `"<verified | source_supplied | pending | invented_DO_NOT_USE>"`.
   Add this rule: "- 'verified' only when checked against a primary source.
   A claim copied from the brand's own site is 'source_supplied'."
3. Step 4.2 rules, add: "- If no verified proof answers a pushback, say so
   and mark it PROOF GAP. Do not stretch another proof to fit."
4. Step 4.1 rules, add: "- Sales talking points keep the qualifiers
   (exclusions, caps, windows) the source proof carries."
5. Eval 3. Old: "Run every channel line through the voice-eval rubric from
   the brand-voice-extraction playbook. All lines score above the ship
   threshold." New: "Run every channel line through the lexical checks of the
   voice rubric (banned words, punctuation, contractions). Sentence-length,
   variance and paragraph checks do not apply to lines under 280 characters."
6. Skill drift: `lens-skills/message-house/SKILL.md` says 3–4 pillars, while
   the playbook says 3 to 5. Align them.

---

## 5. naming-sprint

**Input.** The playbook's own Cascadia brief: ultra-distance sub-brand,
connotations craft, endurance, quietness and terrain; competitors Salomon
S/LAB, La Sportiva and Inov-8. The run went through:

- Pass 2 invented-compound, in full at 50 candidates
- the other five strategies at 10 each
- Pass 3 screening on 20 candidates, with 5 known registered brands salted in
- Pass 4 on a subset
- Pass 6 rationales for the top 3

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, generation diversity | PASS (caveat) | Character-trigram diversity was 0.78 for the 50 invented compounds. It fell to 0.71 across 100 names, because the ratio shrinks as the list grows. |
| Eval 2, phonetic accuracy | NOT TESTABLE | epitran is not installed, and its English mode needs Flite's `lex_lookup`. IPA was not checked independently. |
| Eval 3, trademark recall | NOT TESTABLE | No trademark API. As a proxy, the Pass 3 `embedded_brand_name_flag` caught 5 of 5 salted brands (Norda, Ciele, Montane, Kiprun, Scarpa) from model knowledge alone. That does not replace the real gate. |
| Eval 4, strategy fit | NOT TESTABLE | Needs the brand's lead reviewer. |

**Compared with what the playbook predicts.**

- The "model under-produces" failure mode didn't occur. The list had exactly
  50 numbered candidates.
- The model caught three real words during generation (Mistral, Farrow,
  Skarn) and replaced them.
- Pass 3 still found real words that got through: Kelder is Dutch for cellar,
  Ulvan is a chemistry term, and Durrow is an Irish place name.
- All three rationales came in inside 60 to 90 words (73, 74 and 77).
- The worked example breaks its own screening rules:
  - `Brakke` is blocked for a consonant cluster, but the rules make that a
    flag, not a block.
  - We could not confirm that `Senka`, a common Russian diminutive name, has
    an offensive reading.

```text
Candidate 2 of 50: Fellwyn  roots fell + wyn (OE joy)  /ˈfɛl.wɪn/  2 syll  trochee
Candidate 3 of 50: Tarnlow  roots tarn + hlaw (OE mound) /ˈtɑːn.ləʊ/ 2 syll trochee
char-trigram diversity (invented-compound only): 0.78 ; all strategies n=100: 0.71
Fellwyn rationale (74 words): "Fell is the northern English word for open upland, and
wyn is Old English for joy... French speakers will likely soften the w..."
biggest_risk: "Fell is a UK-specific term, so American and French ultra runners may
read it as the verb 'fell' or as nothing at all."
```

**Recommended edits**

1. TESS, three places. Old: "USPTO TESS". New: "USPTO Trademark Search
   (tmsearch.uspto.gov)". In the failure-modes line, "Hitting USPTO TESS for
   exact matches" becomes "Hitting USPTO Trademark Search for exact matches".
2. Eval 1. Old: "Vocabulary diversity score (unique 3-grams over total
   3-grams) above 0.75." New: "Character-trigram diversity (unique over
   total) above 0.75, computed per 50-name batch. The ratio falls as the list
   grows, so don't compute it over all 300."
3. Worked example, Pass 3. Old: "The blocks include `Brakke` (consonant
   cluster awkward in English), `Senka` (offensive in Russian), `Niche` (real
   English word, missed by Pass 2's filter)." New: "The blocks include
   `Niche` (real English word, missed by Pass 2's filter) and candidates
   embedding registered brand names. `Brakke` is flagged for an awkward
   English consonant cluster."
4. Eval 2. Old: "(the `epitran` library does the job, or a phonetician on
   retainer)". New: "(the `epitran` library, whose English mode needs Flite's
   `lex_lookup` installed, or a phonetician on retainer)".

---

## 6. positioning-audit-pipeline

**Input.** SOAR as the brand, with Tracksmith, SATISFY and Bandit as
competitors. The run went through:

- Pass 1 extraction on the homepage, About, Risk Free Trial, Repairs and one
  product page
- Pass 2 on 14 outputs, in one batched call with an ID per piece
- Pass 3 on 3 Trustpilot reviews, run as a degraded pass
- Passes 4, 5 and 6

Revenue mix was unavailable.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, verbatim fidelity | NOT TESTABLE | Only 3 reviews exist, against the 20-sample threshold. The reviews also came through a summarising fetch tool, so fidelity to the page can't be proven. |
| Eval 2, coverage | PASS | All schema sections were populated. Empty arrays appeared only where the source had nothing, for example `describes_brand_as` on two service complaints. |
| Eval 3, disagreement detection | NOT TESTABLE | Needs a reference set of three brands with known weaknesses. |
| Eval 4, traceability | PASS | Every proof point and the position sentence trace to a pass and a verbatim source. The superlative "world's best" went to aspirational-not-earned. |

**Compared with what the playbook predicts.**

- Pass 5 returned 6 contradictions, each with a verbatim claim and verbatim
  counter-evidence. That meets the minimum of 5.
- The strongest was a position-level contradiction: "SOAR designs for
  committed runners" against the brand's own "SOAR Essentials for the Active
  Lifestyle" and a Rainmac pitched "for daily wear".
- A second came from competitor contrast: Tracksmith owns the more specific
  version of the audience claim ("the Running Class – the non-professional yet
  competitive runners").
- Pass 3 was nearly empty. B2C doesn't guarantee a review corpus, and the
  playbook's degraded path only covers B2B.
- Revenue mix: the playbook says "Insist on at least a one-sentence summary".
  For an outside audit that is impossible, and no fallback is given.
- One call per piece (Step 2.2) wasn't needed. One batched call with an ID per
  piece kept the per-piece output.

```text
{"type":"said_vs_shown","severity":"position",
 "brand_claim":"SOAR designs for committed runners.",
 "contradicting_evidence":"SOAR Essentials for the Active Lifestyle",
 "source_pass":"2","interpretation":"The journal markets lifestyle wear the About page disclaims."}
{"type":"said_vs_customer","severity":"message",
 "brand_claim":"Order with confidence. Every purchase is covered by our Risk Free Trial.",
 "contradicting_evidence":"I'm still waiting for the reimbursement of the products I returned within return window!",
 "source_pass":"3","interpretation":"Single review; trial promise is only as strong as refund speed."}
{"type":"said_vs_shown","severity":"cosmetic","brand_claim":"return it within 31 days of delivery",
 "contradicting_evidence":"running for up to 1 month","interpretation":"31 days, 1 month and 28 days appear on three pages."}
defensible_position: "Race kit that still works at mile twenty, fabric-first and run-tested,
for club and competitive amateur runners."
```

**Recommended edits**

1. Failure mode "The revenue-mix sub-pass gets skipped". Old: "Insist on at
   least a one-sentence revenue-mix summary from the founder before running
   Pass 4." New: "Insist on at least a one-sentence revenue-mix summary from
   the founder before running Pass 4. If you are auditing from the public
   surface only, run Pass 5 with revenue mix set to UNKNOWN, and label every
   audience-level contradiction 'unconfirmed'."
2. Step 3.1, add: "If a B2C brand has fewer than ten public reviews, treat
   Pass 3 as degraded. Supplement it with the B2B sources above, and say so in
   the brief."
3. Step 2.2. Old: "Run this across every piece." New: "Run this across every
   piece. A current long-context model can take all pieces in one call if
   each carries an ID. Keep the output per piece."
4. Eval 1, add: "Copy reviews from the source page itself, not from a
   summarising fetch or browsing tool."

---

## 7. tagline-system

**Input.** SOAR's sharpened position. Primary job: claim a virtue (trust).
Length 3–7 words. Competitor lines were SATISFY's "Running apparel developed
to unlock the High." and Tracksmith's "Amateur Spirit". The run went through:

- the Phase 2 declarative prompt, 35 candidates
- the Phase 3 multi-filter on 10 candidates
- the Phase 4 test design, with a realistic Meta scenario (400k cold
  impressions a month, 2.1% CTR)

The power calculations were done in code.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, generation diversity | NOT TESTABLE | Only 1 of 6 strategies was run at full volume. |
| Eval 2, trademark headroom | NOT TESTABLE | No trademark search. |
| Eval 3, positioning fidelity | PASS | Each finalist was scored on positioning fit. Composite arithmetic checked by script was within 0.15 of the model's figures, and all 10 verdicts matched the rules. |
| Eval 4, A/B test integrity | NOT TESTABLE live | The designed test pre-sets its decision rule and kill criteria. The worked example itself breaks the gate, as set out below. |

**Compared with what the playbook predicts.**

- The list had exactly 35 candidates, with no banned words.
- 2 of 35 broke the word range ("Kit that earns its place on race day." is 8
  words). Self-reported `word_count` is not a safe check.
- The worked example's A/B numbers don't hold up, checked in code at 80%
  power and 5% significance:
  - A 15% relative lift at about 2% CTR needs about **34,900 impressions per
    variant**, or about 55,500 with a Bonferroni correction across 8
    variants. The example uses 8,500.
  - At 8,500 each, the "winner" at 2.41% against the runner-up at 2.28% is
    z = 0.56, **p ≈ 0.58**. Against 2.18% it is p ≈ 0.32.
  - The published result is therefore the early-peek false positive the
    playbook warns about. Only the gaps to the bottom variants (1.49%) are
    significant.
- The model's own test design came out as 8 variants at 31,900 impressions
  each (20% MDE, corrected), which runs 19 days. It recommended cutting to 3
  variants, which runs 5 days.

```text
Kit that still works at mile twenty.     claimed 7.9 computed 7.83 shortlist
We test it. Then you do.                 claimed 7.8 computed 7.83 shortlist
Built for PBs, not photos.               claimed 7.1 computed 7.08 shortlist
Built by runners who race.               claimed 5.9 computed 5.87 drop (distinctiveness 3)
worked example check: 2.41% vs 2.28% at n=8500: z=0.56 p=0.575
required n/variant, p=2.1%, +15% rel, 80% power: 34,905 (Bonferroni x7: 55,469)
```

**Recommended edits (item 1 is must-fix)**

1. Worked example, Phase 4 output. Old: "Sample size 8,500 per variant.
   Runtime 14 days. Minimum detectable lift 15%." New: "Sample size 32,000
   impressions per variant (minimum detectable lift 20%, corrected for seven
   comparisons). Runtime 19 days."
   Then, after the results table, replace "The winner is 'Built for the second
   loop.'" with: "'Built for the second loop' and 'Kit that survives the
   season' finished within noise of each other. Per the decision rule set
   before the test, the named decision-maker took the higher-CTR line, and the
   runner-up went to the sub-headline slot." The table's CTRs can stay, but
   drop the implication that 2.41% against 2.28% is a result.
2. Step 4.1 rules, add: "- Do the power calculation in code or a calculator
   and show the inputs." and "- With more than two variants, correct for
   multiple comparisons (for example Bonferroni) or cut to three variants."
3. Step 2.1 rules. Old: "- Match the voice profile (no em dashes, no
   exclamation marks, no semicolons in the tagline itself)." New: "- Match the
   voice profile, including its punctuation rules."
4. Step 2.2, add: "Check word counts and banned words with a script. Don't
   trust the model's `word_count` and `uses_banned_word` fields."
5. TESS, line 34, as in the cross-playbook edit above.

---

## Applied, 24 September 2026

The recommended edits above were applied to the seven playbooks and five paired
skills. All seven playbooks now pass as edited. Each one has
`models: ["claude-5.5-opus", ...existing entries]` and `updatedAt: 2026-09-24`.
`npm run build` passes: 116 pages, with the schema validating `claude-5.5-opus`.

Before any dated or external fact went into the text, it was checked again
this session:

- USPTO retired TESS on 30 November 2023 and replaced it with Trademark Search
  at tmsearch.uspto.gov.
- CyclingTips was folded into Outside's Velo in 2023.
- epitran's English mode needs Flite's `lex_lookup`.
- The London Marathon reaches the Embankment around miles 24–25.

**Changed**

- `src/content/lens/brand/brand-voice-extraction.md`:
  - count the numeric fields by script
  - Eval 3 pattern-check fallback
  - "no new facts" rule in the template prompt and the worked template
  - new "brand is a publisher" failure mode
- `src/content/lens/brand/endurance-brand-voice.md`:
  - lexicon-replacement rule, and the example table made consistent with it
  - category-level credibility floor
  - pattern-level "common"
  - E1 factual-error block
  - E2 exemption for athlete quotes
  - CyclingTips reference updated to Velo
- `src/content/lens/brand/founder-and-institutional-voice.md`:
  - `split` diagnosis, with a matching exercise note
  - interviews allowed in the founder corpus, labelled as spoken
  - counted pronoun and length rates
  - evidence must show the pattern it is cited for
- `src/content/lens/brand/message-house-generator.md`:
  - punctuation now defers to the voice profile
  - `source_supplied` status
  - PROOF GAP rule
  - qualifiers kept in sales lines
  - Eval 3 limited to lexical checks for short lines
- `src/content/lens/brand/naming-sprint.md`:
  - TESS replaced with USPTO Trademark Search in three places
  - epitran/Flite note
  - per-batch trigram diversity
  - worked-example blocks corrected: Brakke flagged, Senka claim removed
- `src/content/lens/brand/positioning-audit-pipeline.md`:
  - batched Pass 2
  - degraded path for B2C brands with fewer than ten reviews
  - reviews copied from the source page
  - UNKNOWN revenue-mix path
- `src/content/lens/brand/tagline-system.md`, **must-fix applied**. The worked
  example now uses:
  - 32,000 impressions per variant, runtime 19 days
  - a decision rule fixed before launch
  - the top two reported as a statistical tie, settled by the named
    decision-maker

  The other edits:
  - power calculation done in code
  - multiple-comparison rule
  - punctuation deferred to the voice profile
  - script-checked word counts
  - TESS replaced

  Checked in code: at 32,000 per variant, 2.41% against 2.28% gives z = 1.09
  (a tie). The top two against the bottom three give z ≥ 5.2.
- `lens-skills/brand-voice-extraction/SKILL.md` (v0.2.0),
  `lens-skills/endurance-brand-voice/SKILL.md` (v0.2.0),
  `lens-skills/message-house/SKILL.md` (v0.2.0),
  `lens-skills/naming-sprint/SKILL.md` (v0.2.0) and
  `lens-skills/positioning-audit/SKILL.md` (v0.3.0): the same changes in each
  skill's own format.

**Not applied**

- **The message-house skill's 3–4 pillar ceiling was kept.** The skill argues
  that "five+ pillars means the positioning isn't focused". That is a
  deliberate stance, not drift, so aligning it with the playbook's 3–5 range is
  James's call.
- **No CSV changes.** None of the files in `public/lens/templates/` belong to
  the brand stack.
- **No `founder-and-institutional-voice` or `tagline-system` skill exists** in
  `lens-skills/`, so those two playbooks only got the markdown edits.
- **Gates still marked NOT TESTABLE above stay untested.** The edits fix what
  the prompt-level run exposed; they don't stand in for trademark, A/B or
  human-reader testing.
