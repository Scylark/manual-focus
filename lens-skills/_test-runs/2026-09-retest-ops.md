# Ops stack retest: Claude Opus 5.5, 24 September 2026

A retest of all nine playbooks in `src/content/lens/ops/` against the
current model, Claude Opus 5.5 (`claude-opus-5-5`). House style follows
`positioning-audit-manual-focus.md`: what we ran, what came back, what
broke and what to change.

## How this was run, and what it can't tell you

- **Executor.** Every prompt was run in-session by Claude Opus 5.5 (the
  model writing this file), one prompt at a time, in playbook order. The
  outputs were saved as JSON or text and then checked with `python3`
  scripts against the playbook's own rules: schema, counts, thresholds,
  verdict logic and CSV arithmetic.
- **Inputs.** Wherever a playbook ships sample data (the template CSVs,
  the worked examples), we used it. Where it doesn't, we built inputs
  and labelled them **SYNTHETIC**: a 300-word brand guidelines excerpt, a
  22-piece guardrails calibration corpus, a 30-headline eval corpus, an
  18-brief quarterly ledger, three consent threads, four fraud-signal
  patterns, a four-SKU sell-through history and a generic JD.
- **Second judges.** For the inter-rater gate in evaluation-frameworks,
  the same judge prompt went to two Claude subagents (Sonnet and Haiku)
  that could see only the headline text. That is the only multi-model
  test in this run. **We did not test GPT or Gemini**, even though
  `gpt-5` sits in every playbook's `models` list.
- **Not tested.** Nothing touched a live connector: no Slack, GitHub
  Actions runner, Shopify, Klaviyo, Instagram, ATS or LLM API call from a
  script. Operational gates that need a real quarter, season or hiring
  cohort are marked NOT TESTABLE. Several PASS results are
  **prompt-level only**, which means the prompt did what the gate needs
  on test inputs. That is not proof the gate holds in production.
- **Verdict rule.** FAIL means following the playbook as written
  produces a broken result. Errors in a worked example or sample CSV
  count as notes (PASS-WITH-NOTES), even when the example fails its own
  gate.
- **Paired skills.** None of the nine ops playbooks has a paired skill
  in `lens-skills/`. Scratch inputs, outputs and scripts are outside the
  repo and not committed.

## Summary

| Playbook | Verdict | Eval gates passed / tested | Key note |
|---|---|---|---|
| brand-guardrails-as-code | **FAIL** | 2 / 3 | The copy-paste CI job silently passes every PR, because a shallow checkout makes `git diff origin/main...HEAD` fail inside `$(…)`. The Vahla regex also false-blocks 17% of exemplary copy. |
| brief-to-ship-pipeline | PASS-WITH-NOTES | 1 / 3 (two on sample data) | The routing list names a pipeline that doesn't exist (`seo-keyword-research`). The sample CSV breaks the playbook's own no-Thursday rule. |
| crash-replacement-programme | PASS-WITH-NOTES | 1 / 1 | The triage prompt agreed with 5 of 8 logged decisions, and all 3 disagreements are errors in the log. Needs a UK statutory-rights (CRA 2015 / DMCC 2024) caution. |
| customer-content-rights | PASS-WITH-NOTES | 2 / 2 (prompt-level) | The worked example runs AI variants of an asset whose consent says no AI and no paid use. The AI policy has no labelling rule (EU AI Act Art. 50 applies from 2 Aug 2026; ASA June 2026). |
| end-of-season-inventory | PASS-WITH-NOTES | 0 / 0 (all season-outcome) | 6 of 13 `Health_Status` labels in the template contradict Step 2.2. The governance prompt lacks the inputs it needs to check flagship status and calendar creep. |
| evaluation-frameworks | PASS-WITH-NOTES | 3 / 3 (stability not tested) | The pseudocode raises `AttributeError` (`crit.weight`). "Correlation" is undefined: the same run scores 0.87 as agreement but 0.76 as phi. Pinned model IDs are stale. |
| gear-launch-sequence | PASS-WITH-NOTES | 2 / 3 | The worked example has race-day proof (31 Aug) before the reveal (1 Sep), against the phase T-labels. There are no LLM prompts, only templates. |
| hiring-shape-for-ai-native-teams | PASS-WITH-NOTES | 0 / 0 (needs a 6-month cohort) | Critical signals are never defined, but the synthesis prompt depends on them. The JD rewrite's "same word count or shorter" rule broke on the first pass. Needs an AI-in-hiring caution. |
| quarterly-planning-ritual | PASS-WITH-NOTES | 1 / 3 | The worked example fails its own displacement gate and falsifiability gate. Its Day 1 hit rates need at least 48 briefs, but the story says 18. |

### Cross-cutting findings

1. **`models` frontmatter is stale in all nine files.** None of them lists
   `claude-5.5-opus`. That value is in the `LENS_MODELS` enum in
   `src/content.config.ts` only as an uncommitted working-tree change
   (from the parallel brand/demand retests, not this run). Commit it
   along with these edits, or the build will reject the frontmatter. Suggested edit per file:
   add `"claude-5.5-opus"` as the first entry. Keep `gpt-5` only if someone
   has actually tested it. This run did not.
2. **Inline model IDs are fictional or out of date.** `model: claude-4.5-sonnet`
   (guardrails YAML), `claude-4.5-sonnet-2025-10-15` and `gpt-5-2025-11-01`
   (evaluation-frameworks), and `claude-4.5-sonnet` in `Judge_Model` in the
   evaluation matrix CSV. The first is not a valid API model ID format, and
   we could not verify the dated snapshots. Pin the provider's exact
   published ID instead, for example `claude-opus-5-5`.
3. **The Cascadia cast changes roles between playbooks.** Beth Lyons is
   head of brand (guardrails), function lead (brief-to-ship) and the lead
   sponsored athlete (gear-launch, and the guardrails `athletes:` list).
   Saoirse Burns is the channel operator in five playbooks and the
   sponsored ambassador in three. Marcus Hale is founder and athlete.
   Readers who move between playbooks will notice. Either make the cast
   consistent or add a one-line note that founders and staff race for
   the brand.
4. **Some event dates fall before the events.** Sample rows date UTMB
   Mont-Blanc 2026 content to March and April 2026 (crash CSV CR-2026-0001;
   consent CSV CC-2026-0001), but UTMB runs in late August. Lavaredo Ultra
   2026 content is dated April (CC-2026-0003), and Lavaredo runs in late
   June. Change the event year to 2025.
5. **Regulation.** EU AI Act Art. 50 (deep-fake disclosure by deployers
   from 2 Aug 2026; provider marking grace period to 2 Dec 2026) and the
   ASA's June 2026 guidance (disclose AI use where leaving it out would
   mislead) bite on customer-content-rights (AI-edited customer photos)
   and gear-launch-sequence (AI-augmented athlete cuts). Neither playbook
   mentions labelling. The UK's dropped TDM opt-out (March 2026) affects
   none of the ops playbooks, so no edit is needed.

---

## 1. brand-guardrails-as-code: FAIL

**Prompts run:** the Step 1.2 rule-extraction prompt and the Step 3.2
claim-audit prompt. **Code run:** the playbook's `guardrails.yaml`,
extracted verbatim, through a real `lint.py` built to the Phase 3 shape.
We also simulated the CI shell step locally.

**Inputs:** SYNTHETIC Cascadia guidelines (12 sections, about 300 words)
and a SYNTHETIC calibration corpus of 12 exemplary pieces and 10 historic
violations, scaled down from 50/30.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, false-positive rate < 5% | **FAIL** | 2/12 exemplary pieces blocked (17%), both by `vahla_range_naming`. The regex `(?i)\bvahla\b(?!\s+Range)` blocks every later "Vahla", which the guideline explicitly allows. With the structural fix below: 0/12. |
| Eval 2, catch rate ≥ 80% | PASS (edge) | Deterministic rules alone: 6/10 (60%). Adding the claim-audit LLM rule: 8/10 (80%). Exclamation marks and "eco-friendly" were missed because the example YAML has no rule for them. The extraction prompt did surface both. |
| Eval 3, speed < 2s / < 5s | PASS (deterministic only) | 7.6 ms for a 2,556-word piece; 0.9 ms for the whole 22-piece corpus. The LLM path was not timed because no API call was made. |
| Eval 4, override rate < 10% | NOT TESTABLE | Needs production use. |

**Prompt-level checks**

- The extraction prompt returned 23 rules, inside the 15–30 range.
- Schema valid: 12 regex, 5 structural, 3 count, 3 llm_judgement; 10 block, 13 warn.
- Subjective and manifesto lines ("craft-led but never precious", "tone matches the audience") were correctly skipped.
- One quote was not verbatim. `no_vague_green_claims` trimmed "(e.g. …)" and added a full stop.

**Evidence (linter run over the corpus, playbook YAML as written):**

```text
== GOOD (should not block)
1 BLOCK [('vahla_range_naming', 'Vahla')]      # "...Later, Lyons said the Vahla hood..."
10 BLOCK [('vahla_range_naming', 'Vahla')]     # "...pair it with the Vahla Carbon Pack."
== BAD (should catch)
3 unsourced performance claim -> MISSED (deterministic; caught by claim_audit)
7 race over-claim (she finished 14th) -> MISSED (deterministic; caught by claim_audit)
8 exclamation marks -> MISSED    9 vague green claim -> MISSED
false-block rate 2/12 = 17%; catch rate (deterministic only) 6/10 = 60%
--- CI step simulated with a depth-1 checkout (actions/checkout default) ---
fatal: ambiguous argument 'origin/main...HEAD': unknown revision
bash -e: for file in $(git diff ...) -> "step finished OK, exit 0"
```

**Where behaviour differed from the playbook**

- **CI gate is a silent no-op.** `actions/checkout@v4` defaults to
  `fetch-depth: 1`, so `origin/main` doesn't exist in a PR job. The
  failing `git diff` sits inside `for file in $(…)`, which `bash -e` does
  not trap. The loop runs zero times and the job passes. The playbook also
  says warns "show as PR comments", but the workflow has no step that
  posts comments.
- **Claim-audit prompt blocks true race results.** It blocked "Beth Lyons
  finished 27th overall at UTMB 2026" because the only accepted hedge is
  "brand testing or customer testimony". It also blocked the opinion "That
  is the kit's hardest month". Both were exemplary pieces.
- **Oxford-comma regex fires on introductory clauses** ("In the
  Cairngorms, Beth and Saoirse ran" → violation) and misses multi-word
  list items ("Wind, heavy rain and snow" → no hit).
- **British-spelling patterns miss inflections** (`colors`, `organized`,
  `organizing`).
- **Slack (unverified).** We could not test Workflow Builder here. Our
  understanding is that it does not register custom slash commands such
  as `/brandcheck`, and outbound HTTP needs a custom step or connector.
  Check this against Slack's current docs before republishing.

**Recommended edits**

1. YAML `vahla_range_naming`:
   old:
   ```yaml
       type: regex
       severity: block
       description: "Sub-brand is 'Vahla Range', not 'Vahla' alone or 'the Vahla range'."
       pattern: "(?i)\\bvahla\\b(?!\\s+Range)"
   ```
   new:
   ```yaml
       type: structural
       severity: block
       description: "First mention of the sub-brand is 'Vahla Range'; later mentions may be 'Vahla'."
       check: "first_mention_is"
       term: "Vahla"
       required_first_form: "Vahla Range"
   ```
2. CI workflow. Replace `      - uses: actions/checkout@v4` with:
   ```yaml
         - uses: actions/checkout@v4
           with:
             fetch-depth: 0
   ```
   Then replace `          for file in $(git diff --name-only origin/main...HEAD); do` with:
   ```bash
             set -euo pipefail
             changed=$(git diff --name-only "origin/${{ github.base_ref }}...HEAD")
             for file in $changed; do
   ```
3. "Warn-severity findings show as PR comments but do not block." →
   "Warn-severity findings print in the job log but do not block. To post them as PR comments, add a step that calls `gh pr comment`."
4. `    model: claude-4.5-sonnet` → `    model: claude-opus-5-5  # pin the exact model ID you calibrated against`
5. British spelling: `"(?i)\\bcolor\\b"` → `"(?i)\\bcolors?\\b"`, `"(?i)\\borganize\\b"` → `"(?i)\\borganiz(e|es|ed|ing)\\b"`.
6. Oxford comma: add a YAML comment under the pattern:
   `    # Heuristic: misses multi-word items and fires on "In the Cairngorms, Beth and…". Keep at warn.`
7. Claim-audit rules: after the "hedged" bullet, add:
   `- A race result that names the event, year and position (e.g. "27th overall at UTMB 2026") counts as sourced. Verify it against the published results separately.`
   `- Opinion clearly framed as the brand's view is not a performance claim.`
8. Slack step (after checking Slack's docs): "Trigger on the shortcut `/brandcheck`. Add a *Send a webhook* step…" →
   "Start the workflow from a shortcut. Workflow Builder doesn't register custom slash commands; build a small Slack app if you want a literal `/brandcheck`. Add a step that sends the message text to your linter endpoint (a custom step or HTTP connector, depending on your plan)…"
9. Frontmatter: `models: ["claude-4.5-sonnet", "gpt-5"]` → `models: ["claude-5.5-opus", "claude-4.5-sonnet", "gpt-5"]`

With edits 1–3 applied, this moves to PASS-WITH-NOTES.

---

## 2. brief-to-ship-pipeline: PASS-WITH-NOTES

**Prompts run:**

- The rejection template, on B-006.
- The Step 2.2 routing prompt, on three briefs, with the real 46-item library list.
- The Step 6.2 quarterly review prompt, on a SYNTHETIC 18-brief ledger built to match the worked example's 6-of-7 recap figure.
- The custom tracker CSV prompt (Linear, plus two extra fields).

Python checked the sample CSV against the playbook's own rules.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, acceptance rate 40–80% | FAIL (sample data) | The template CSV accepts 7/8 (88%), above the playbook's "letting fuzzy briefs through" ceiling. It's sample data, but it models the wrong thing. |
| Eval 2, slip rate < 15% | FAIL (sample data) | 1 of 2 shipped briefs slipped. B-002's target was Wed 22 Apr and it shipped Thu 23 Apr, which breaks the Step 5.2 no-Thursday rule. |
| Eval 3, outcome correlation ≥ 50% | PASS (prompt-level) | On the synthetic ledger, the review prompt's hit rates and verdicts matched a Python reference on 5/5 routes (race-result 6/7 = 0.86, keep). |
| Eval 4, cycle time stable or falling | NOT TESTABLE | Needs two or more real quarters. |

**Evidence**

```text
Routing (real library list):
B-005 -> segment-broll-production (alt social-content-factory), 8 days
B-006 -> seo-cluster-generator; reason notes brief lacks outcome/audience/deadline
B-009 coach podcast -> direct-to-coach, no_clean_fit: true, "new pipeline would need:
        audio series production, recording kit, show notes, referral tracking"
prompt list names not in library: ['seo-keyword-research']
Quarterly review vs rules:
lifecycle-journey-builder n 4 hits 2 hr 0.5 | rule verdict needs-more-data | model MATCH
channel-mix-simulator n 4 median 10.5 -> model returned 10 (schema forces int)
B-006 CSV row: 'Organic sessions' sits in the Baseline column, not Outcome_Metric
```

**Where behaviour differed from the playbook**

- **Phantom pipeline.** The routing list includes `seo-keyword-research`,
  which isn't in the library (the real one is `seo-cluster-generator`).
  Given the prompt's own list, the model routes to the phantom, which is
  what the sample CSV (B-006) shows.
- **Missing verdict band.** The quarterly review has no verdict for 4+
  briefs with a 0.3–0.5 hit rate, so a well-evidenced 0.5 route comes back
  as "needs-more-data". quarterly-planning-ritual already has an
  `iterate` verdict for this band.
- **Overstated claim.** Exercise 3 says the model "has read the full Lens
  library". It has only seen the names pasted into the prompt.
- **Ledger mismatch.** The worked-example ledger table has results for
  B-003/004/005/007; the CSV has them in production with no results.

**Recommended edits**

1. Routing prompt: `- seo-keyword-research` → `- seo-cluster-generator`. Same change in the CSV: B-006 `seo-keyword-research` → `seo-cluster-generator`.
2. `My project tool: {NOTION | LINEAR | ASANA | COD A | AIRTABLE}` → `{NOTION | LINEAR | ASANA | CODA | AIRTABLE}`
3. Quarterly review:
   - `"verdict": "<keep | retire | needs-more-data>",` → `"verdict": "<keep | iterate | retire | needs-more-data>",`
   - Add the rule `- "iterate" requires at least 4 completed briefs and a hit rate from 0.3 to 0.5.`
   - `- "needs-more-data" otherwise.` → `- "needs-more-data" for fewer than 4 completed briefs.`
   - `"median_cycle_time_days": <int>,` → `"median_cycle_time_days": <number, one decimal>,`
4. "Where the model picks a different route, the model is usually right (it has read the full Lens library and the team probably has not)." →
   "Where the model picks a different route, read its reason against the playbook. It only sees the pipeline names you paste, not the playbooks themselves."
5. CSV:
   - B-002 `2026-04-22,2026-04-23` → `2026-04-22,2026-04-22`
   - B-006 `,,,,,,Organic sessions,,,,,,Marcus Hale,` → `,,,,,Organic sessions,,,,,,,Marcus Hale,`, which moves the value into `Outcome_Metric`
   - Lower first-pass acceptance by returning one more sample brief, so the template models the 40–80% band.
6. Frontmatter: `models: ["claude-4.5-opus", "gpt-5"]` → `models: ["claude-5.5-opus", "claude-4.5-opus", "gpt-5"]`

---

## 3. crash-replacement-programme: PASS-WITH-NOTES

**Prompts run:**

- The Step 3.2 triage prompt, on all 8 template cases, with the Step 1.2 tier rules and the worked-example scope.
- One full `draft_reply`, for CR-2026-0002.
- The Step 4.2 pattern-check prompt, on 4 SYNTHETIC flagged patterns.
- The Step 5.1 product-page block, filled in.

Python checked tier price bands, months-since-purchase and cycle days.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, cycle time ≤ 5 days clean | PASS (sample data) | Median `Days_To_Resolve` across the resolved sample cases is 5 days. |
| Eval 2, claim-rate sanity | NOT TESTABLE | Needs units-sold data. |
| Eval 3, NPS delta | NOT TESTABLE | Needs survey data. |
| Eval 4, loyalty conversion > 70% | NOT TESTABLE | Needs 12 months of order history. |

**Prompt-level checks**

- **Triage prompt.** The model agreed with the log on 5/8 cases. The 3
  disagreements are all errors in the log, not in the model (see the
  evidence below).
- **Draft reply.** 250 words, inside the 200–350 range. No accusatory
  terms.
- **Pattern check.** "High" was given only to the pattern with three
  converging signals, and no recommendation was a decline (4/4 against
  the prompt's rules).
- **Product-page block.** 72 words, inside the 60–90 range.

**Evidence**

```text
CR-2026-0006 footwear 2mo  CSV: decline            | model: human_review   DIFFER
   (prompt: decline only when policy clearly not met; road wear is not an exclusion)
CR-2026-0007 outerwear 30mo CSV: Tier 1, pays 35%  -> OUT OF Tier 1 band (50-70%) | model: Tier 2
   (outerwear crash window is 2 years; 30 months is outside it)
CR-2026-0008 apparel 23mo  CSV: Tier 2, reason "Within standard chamois life decline politely"
   | model: human_review (bib shorts not in the stated programme scope)
header has address column: False   <- Step 4.1 "shared address" query cannot run
P2 shared address, 3 signals -> high, "request additional evidence" (no decline)
P3 Trail Shoe v3 spike 3.0x -> medium, escalate to product (flagged as product issue, not fraud)
```

**Where behaviour differed from the playbook**

- **Wrong window in the log.** CR-2026-0001's reason cites a "3yr crash
  window" for outerwear, but Step 1.2 gives outerwear two years.
- **Tier 3 reclassified.** Lila Okafor has 5+ orders but falls outside
  the window, so the model put her in Tier 2, not Tier 3.
- **Missing address column.** The case log has no address field, so the
  "2+ claims per address" fraud query in Step 4.1 cannot run.
- **Wrong payment path.** A Shopify draft order is paid through Shopify's
  checkout or invoice link, not "a standard Stripe link".
- **Stale reference not caught.** Tier 2 charges 30–50% for wear-out
  "where the product failed earlier than expected". In the UK, early
  failure can be a durability fault under the Consumer Rights Act 2015,
  and presenting statutory rights as a brand perk is a banned practice
  under the DMCC Act 2024. The playbook doesn't mention either.

**Recommended edits**

1. After the Step 1.2 tier list, add:
   "Check the tiers against statutory rights before you publish. In the UK, a product that is faulty or wears out unreasonably early may be covered by the Consumer Rights Act 2015 at no cost to the customer, and presenting legal rights as a perk of your programme is a banned practice under the DMCC Act 2024. Keep genuine defects and premature failure on the statutory route, and position the paid tiers as going beyond it (crashes and accidents). Get a legal read on the wear-out tier."
2. Case log CSV:
   - CR-2026-0001 `Within 3yr crash window plus repeat customer` → `Within 2yr outerwear crash window plus repeat customer`
   - CR-2026-0001 `UTMB Mont-Blanc 2026` → `UTMB Mont-Blanc 2025`
   - CR-2026-0006 `decline,Excessive wear pattern suggests off use` → `human_review,Wear at 2 months is unusual; road use is not an exclusion`
   - CR-2026-0007 `Tier 1,Repeat customer 5+ orders strong evidence` → `Tier 2,Outside 24mo outerwear window; repeat customer, top of Tier 2 band`
   - CR-2026-0008 `Within standard chamois life decline politely` → `Edge-case wear at 23 months; goodwill Tier 2`
   - Add a `Shipping_Postcode` column after `Order_ID`.
3. Worked-example table: `| CR-2026-0007 | Storm Shell | 30 | Tier 1 | £90 | 5 |` → `| CR-2026-0007 | Storm Shell | 30 | Tier 2 | £90 | 5 |`
4. "The programme covers crash-replacement on outerwear and packs, wear-out on shoes." → "…wear-out on shoes and bib shorts." This brings CR-2026-0008 into scope.
5. "The customer pays the tier amount through a standard Stripe link." → "The customer pays the tier amount through the draft order's invoice link."
6. Step 5.1 template: "Photos of the damage and your order ID is all we need." → "…are all we need."
7. Frontmatter: add `"claude-5.5-opus"`.

---

## 4. customer-content-rights: PASS-WITH-NOTES

**Prompts run:**

- The Step 2.2 auto-tagging prompt, on 3 SYNTHETIC consent threads: a clear yes, a vague "wherever you like, not my surname", and an AI yes with a time limit.
- The Step 4.2 publish-time gate, on 4 planned uses of template assets, including the worked example's own near-miss and its Phase 3 AI campaign.

Python rebuilt each gate verdict from the consent log.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, consent rate 30–60% | NOT TESTABLE | Needs live DMs. |
| Eval 2, tagging accuracy ≥ 95% | PASS (prompt-level, n=3) | 3/3 threads were tagged conservatively: paid use and AI stayed false unless explicit, and "wherever you like" was not expanded into channels. Ambiguity flags caught the surname conflict and the "this year" expiry. |
| Eval 3, use-within-scope trends to zero | PASS (prompt-level, n=4) | The gate matched the Python reference 4/4, including the 60-day expiry stop (CC-2026-0005 is 50 days from expiry on 2027-03-01). |
| Eval 4, customer content out-engages 2–4x | NOT TESTABLE | Needs channel data. |

**Evidence**

```text
G1 CC-2026-0002 paid Meta             ref stop | model stop MATCH  (worked-example near-miss)
G2 CC-2026-0001 AI variant, paid ads  ref stop | model stop MATCH
   {'channel': False, 'paid': False, 'aug': False}  <- worked example says this campaign ran
G3 CC-2026-0005 IG 2027-03-01         ref stop | model stop MATCH  days_to_expiry 50
G4 CC-2026-0003 paid, environmental   ref go   | model go   MATCH
T2 ambiguity_flags: "'wherever you like' is not channel-specific; logged only the channels
   named in our ask" / "'don't use my surname' conflicts with first_name_last_initial;
   first name only is not an enum value"
```

**Where behaviour differed from the playbook**

- **The worked example contradicts its own data.** Phase 3 says the Storm
  Shell campaign used AI variants of CC-2026-0001 "with Beth's explicit
  grant", but the log records no AI and no paid use for that asset. The
  playbook's own gate stops it.
- **Attribution labels don't match.** The prompt enum (`@handle`,
  `first_name_last_initial`, `full_name`) doesn't match the CSV values
  (`@handle_first_name`, `full_name_handle`, `no_attribution_granted`),
  and it has no "first name only" option.
- **The gate schema forces a remediation on a go verdict.** The model
  had to pick "use as-is, no augmentation" for an approved augmented use.
- **No disclosure rule.** The AI policy allows weather, terrain and
  lighting edits to real customers' photos with no labelling. EU AI Act
  Art. 50(4) requires deployers to disclose manipulated images of real
  people and places that could pass as authentic, from 2 Aug 2026. The
  ASA's June 2026 guidance asks advertisers to disclose AI use where
  leaving it out would mislead. Editing a storm in behind a waterproof
  shell is that case.
- **Unverified.** Meta's messaging API generally only allows businesses
  to reply to users who messaged first. If so, the "Zapier automation"
  cold DM in Step 1.1 isn't possible, and DMs should go by hand.

**Recommended edits**

1. Phase 3 worked example: "The Vahla Storm Shell hero campaign uses two augmented variants of CC-2026-0001 (with Beth's explicit grant) for terrain-variant social ads." →
   "The Vahla Storm Shell hero campaign uses two augmented variants of CC-2026-0003, whose ambassador grant covers paid use and AI, for terrain-variant social ads. CC-2026-0001 stays as shot, because Beth Allen granted Instagram and email only."
2. Add to the policy block after Rule 4:
   ```text
   Rule 5, label the edit. Every augmented variant carries a
   visible "AI-edited background" label and keeps its
   provenance data (C2PA or the platform's AI label). Never
   change weather or terrain in a way that implies the product
   performed in conditions it was not shown in.
   ```
   Then add below the block: "EU AI Act Article 50 requires this disclosure for EU audiences from 2 August 2026, and the ASA's June 2026 guidance expects it in UK ads wherever leaving it out would mislead."
3. Auto-tagging prompt: `"attribution_format": "<@handle | first_name_last_initial | full_name>",` →
   `"attribution_format": "<@handle | @handle_first_name | first_name_only | first_name_last_initial | full_name | full_name_handle | none>",`
4. Publish gate: `"remediation": "<refresh consent | downgrade to organic | change attribution | use as-is, no augmentation>"` →
   `"remediation": "<none | refresh consent | downgrade to organic | change attribution | use as-is, no augmentation>"`
   Add the rule `- remediation is "none" when verdict is go.`
5. Step 1.1 DM, before "Either way, congrats…", add: "You can change your mind any time: reply 'remove' and we'll take it down."
6. Step 1.1: "the operator (or a Zapier automation) sends a DM within 48 hours" → "the operator sends a DM by hand within 48 hours (platform messaging APIs generally don't allow automated first-contact DMs)". Verify against Meta's current docs first.
7. Consent CSV: CC-2026-0001 `UTMB Mont-Blanc 2026` → `UTMB Mont-Blanc 2025`; CC-2026-0003 `Lavaredo Ultra 2026` → `Lavaredo Ultra 2025`. Check the date of CC-2026-0006 (Ultra Trail Cape Town) too.
8. Frontmatter: add `"claude-5.5-opus"`.

---

## 5. end-of-season-inventory: PASS-WITH-NOTES

**Prompts run:**

- The Step 1.3 forecast prompt, on a SYNTHETIC four-SKU history plus macro signals.
- The Step 2.3 disposition prompt, on the five worked-example SKUs.
- The Step 5.2 governance prompt, on the three worked-example promotions plus a SYNTHETIC flagship "autumn sale" trap.

Python recomputed `Sell_Through_Pct`, `Variance_To_P50` and `Health_Status` for all 13 CSV rows.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, sell-through ≥ 80% | NOT TESTABLE | Needs a season. |
| Eval 2, margin erosion | NOT TESTABLE | Needs a season. |
| Eval 3, audience training | NOT TESTABLE | Needs a season. |
| Eval 4, channel coverage | NOT TESTABLE | Needs a season. The sample's channel sequences do follow the five-phase order. |

**Prompt-level checks**

- **Forecast.** 4/4 SKUs met the quantity rule: low confidence gets P25,
  otherwise the quantity sits between P50 and P75. Rounding was correct.
- **Disposition.** Every discount sat within the 35% mid-clearance
  ceiling, and the phases matched the CSV on 5/5.
- **Governance.** 4/4 verdicts were consistent with the "stop if any
  fail" rule. The worked example's 45% shell promotion came back as
  stop.

**Evidence**

```text
CAS-WS-RED-L   sold 512 P25 460 P50 520 health CSV=healthy rule=at_risk
CAS-BL-BLK-M   sold 420 P25 400 P50 480 health CSV=below_p25 rule=at_risk
CAS-BL-BLK-L   sold 398 P25 360 P50 420 health CSV=healthy rule=at_risk
CAS-TR-BLU-10  sold 482 P25 440 P50 510 health CSV=healthy rule=at_risk
CAS-WT-GRN-M   sold 80  P25 140 P50 200 health CSV=critical_below_p25 rule=below_p25
CAS-WT-GRN-L   sold 110 P25 160 P50 220 health CSV=critical_below_p25 rule=below_p25
health mismatches: 6 of 13
Governance D (Storm Shell 20%, email, October 'autumn sale') -> stop:
  no_flagship_discount fail, no_calendar_creep fail
  (both judged from the bet description; the prompt has no input for either)
```

**Where behaviour differed from the playbook**

- **Health labels.** Step 2.2 compares units sold to date with the
  full-season forecast six weeks before season end, so most SKUs look
  behind by construction. The CSV labels follow neither the rule nor a
  pro-rated reading.
- **Governance inputs.** The prompt asks for `no_flagship_discount` and
  `no_calendar_creep` but supplies neither the SKU's brand position nor
  the promotions already run.
- **Missing phase.** The disposition enum has no `replenish`, although
  the CSV uses it.
- **Broken JSON shape.** In the channel prompt, `skip_channels` puts a
  channel and a reason in one flat list.
- **The worked example contradicts its CSV.** It says public clearance
  covered "the Red Winter Shell M and the base layers", but the CSV marks
  only CAS-BL-BLK-M as `Public_Eligible`.
- **No reference-price rule.** "X% off" claims need a genuine prior
  price (CMA guidance on unfair commercial practices under the DMCC Act
  2024), and the governance rules don't say so.

**Recommended edits**

1. Step 2.2: "The formula compares the current sell-through against the forecast." →
   "The formula compares units sold to date against the forecast pro-rated to today (each quantile × the share of the season's expected sales already elapsed). Comparing with the full-season forecast six weeks out flags almost everything."
2. Step 2.2 labels:
   - `at risk` → `at_risk`
   - Add: "- Under 5% of units left: `sold_through` (replenish if lead time allows)"
   - Then recompute the six CSV rows listed above.
3. Governance prompt: under `- Bundled or value-add element:` add
   `- Brand position: {HERITAGE | FLAGSHIP | STANDARD | NEW}` and
   `- Promotions already run this season: {LIST_OR_NONE}`
4. Governance rules: add
   "Rule 6, honest reference prices. Any 'was' price must be one the SKU genuinely sold at for a meaningful period (CMA guidance on unfair commercial practices)."
5. Disposition enum: `"<hold | soft_launch | member_first | email_clearance | public_clearance | final_clearance>"` → add `| replenish`.
6. Channel prompt: `"skip_channels": ["<channel>", "<reason>"],` → `"skip_channels": [{"channel": "<channel>", "reason": "<reason>"}],`
7. Worked example: "with only the Red Winter Shell M and the base layers in scope" → "with only the Base Layer Black M in scope, the one SKU the disposition sheet marks public-eligible".
8. Frontmatter: add `"claude-5.5-opus"`.

---

## 6. evaluation-frameworks: PASS-WITH-NOTES

**Prompts run:**

- The Step 2.1 criteria-extraction prompt, on a SYNTHETIC 30-headline corpus with brand-lead rationale.
- The Step 3.3 judge prompt, on all 30 headlines for `specificity`, using the anchors from the template CSV. It ran three times: Opus 5.5 in-session, then a Sonnet subagent and a Haiku subagent, each seeing only the headline text.

**Code run:** a scorer built to the template CSV, using H1 length, H2
buzzwords and H4 judge scores. We also ran the Step 4.1 pseudocode
against the CSV's real column names.

| Gate | Result | Evidence |
|---|---|---|
| Eval-of-eval 1, stability ≥ 90% | NOT TESTABLE | Needs month-on-month runs. As a proxy, the pass/fail verdicts were identical across all three judges (30/30). |
| Eval-of-eval 2, inter-rater ±1 on ≥ 80% | PASS | Opus vs Sonnet 29/30 (97%). Opus vs Haiku and Sonnet vs Haiku 30/30. All three judges are Claude models; no GPT was tested. |
| Eval-of-eval 3, human-baseline correlation > 0.7 | PASS | Rubric vs lead tags: agreement 0.87, phi 0.76. It clears 0.7 on either measure. It clears the Phase 4 ship bar of 0.85 only on agreement. |
| Eval-of-eval 4, speed < 1s deterministic | PASS | 0.002 ms per piece. The LLM path was not timed via the API. |

**Evidence**

```text
Opus 5.5 judge: agreement 0.87  phi 0.76  borderline 3
  disagreements g09 "How to wash your shell without killing the DWR" (spec 3)
                g11 "Rust slate and moss: the autumn colours" (spec 2)
                g14 "Our crash cover on packs and shells explained" (spec 3)
Sonnet: agreement 0.87 phi 0.76 borderline 0 | Haiku: identical
opus vs sonnet within +/-1 29/30 = 97%; pass/fail(>=4) same 30/30
pseudocode: crit.weight -> AttributeError: 'Row' object has no attribute 'weight'
criteria in CSV: 14 (playbook says 13) | identical anchors: E2 "Beth on UTMB" (5 and 3)
extraction: kept H4 "verifiable_claims" citing "3 bad headlines"; corpus has 2
```

**Where behaviour differed from the playbook**

- **All four misses were good pieces judged too strictly.** Useful
  how-to and policy headlines ("how to wash your shell") score low on
  "names a person, product, event or place". This is a
  `missing_criterion` case, and the diagnostic prompt would catch it.
- **"Correlation" is undefined.** It swings the ship decision: the same
  run is 0.87 on agreement and 0.76 on phi.
- **The judge prompt contradicts itself.** It requires "integer 1 to 5"
  and also "return null" when a criterion doesn't apply.
- **The extraction prompt's evidence counts were estimated, not
  counted.** One criterion was kept on 2 of 30 examples, against the
  prompt's own 3-of-30 floor.
- **The pseudocode fails on the template.** It uses `crit.weight`, but
  the column is `Weight`. It also mixes pass/fail results with 1–5 scores
  in the weighted total.
- **Template errors.** Two of the three E2 anchors are identical. The B4
  Oxford-comma anchors lost their commas in the CSV ("wind rain and
  snow"), so they can't demonstrate the rule. The judge models are stale.

**Recommended edits**

1. Checklist: `(claude-4.5-sonnet-2025-10-15 or equivalent)` → `(the provider's exact dated model ID, e.g. claude-opus-5-5, recorded per criterion)`.
   Step 5.3: `Pin to specific versions (claude-4.5-sonnet-2025-10-15, gpt-5-2025-11-01).` → `Pin to the exact model IDs your provider publishes (for example claude-opus-5-5), never a family alias.`
2. Pseudocode: `sum(r.score * crit.weight for r, crit` → `sum(r.score * crit.Weight for r, crit`.
   Add the comment `# deterministic checks return 5 (pass), 3 (borderline), 1 (fail) so they weigh like judge scores`.
3. Judge prompt:
   - `"score": <1 | 2 | 3 | 4 | 5>,` → `"score": <1 | 2 | 3 | 4 | 5 | null>,`
   - `- Score is integer 1 to 5. No half scores.` → `- Score is integer 1 to 5, or null only when the criterion does not apply. No half scores.`
4. Step 4.2, after the correlation table, add:
   "Measure correlation as agreement: the share of corpus pieces where the rubric's pass/not-pass matches the lead's good/bad tag. Phi or Cohen's kappa read lower on the same data (0.76 against 0.87 in our September 2026 retest), so pick one measure and keep it."
5. Extraction prompt rules: add `- For each criterion, list the ids of the examples it appears in. Count them; do not estimate.`
6. Template CSV:
   - "ships with 13 sample Cascadia criteria" → "ships with 14 sample Cascadia criteria"
   - E2 `Anchor_Example_3` `Beth on UTMB` → `n/a`
   - B4 anchors: quote them with commas intact, e.g. `"wind, rain, and snow"` / `"wind, rain and snow"`
   - `Judge_Model` `claude-4.5-sonnet` → your pinned ID
7. Frontmatter: add `"claude-5.5-opus"`.

---

## 7. gear-launch-sequence: PASS-WITH-NOTES

**What was run.** This playbook has no LLM prompts. We filled the
Step 3.1 reviewer pitch and the Step 3.3 pre-signal email for the Storm
Shell, then checked the worked-example calendar with Python against the
phase T-labels and Eval 1.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, calendar realism | **FAIL** (worked example) | Race-day proof (UTMB, 31 Aug 2026) comes one day before the reveal (1 Sep), and July and August are unassigned between whisper and reveal. Correction made while applying: the phase T-labels themselves are consistent if T-0 is the end of the proof window. Only the worked example breaks them. |
| Eval 2, proof-point honesty | PASS | "Top-15 women's finish" for a 14th place is true and checkable. The filled pitch uses only traceable specs. |
| Eval 3, audience readiness | PASS | A September outerwear launch sits in the autumn buying window. |
| Eval 4, pre-order to ship gap | NOT TESTABLE | The worked example opens pre-orders at the reveal but never states a ship date. |

**Evidence**

```text
4 Reveal           2026-09-01 | playbook label T-3
5 Race-day proof   2026-08-31 -> 2026-09-07 | playbook label T-3..T-0
6 Sustained        2026-09-01 -> 2027-09-30 | playbook label T-0..T+12
Race-day proof is 1 day BEFORE reveal
Phase 5 labelled as 3 months; worked example Phase 5 lasts 7 days
Pre-signal: playbook says T-4; worked example sends June = 3 months before reveal
Pitch (filled): 105 words, subject 54 chars:
"Subject: New shell from Cascadia Endurance, embargo 1 September ...
 1. The Vahla Range Storm Shell is a 310g, 20,000mm shell ..."
```

**Stale or unverified references**

- The hand-off names `earned-media-pitch`, but the file is `earned-media-pitch-generator`.
- We could not verify "the UK Trail Championships at Snowdon" as a fixed event.
- Phase 5.2 uses AI-augmented social cuts of real athletes with no labelling step (EU AI Act Art. 50; ASA June 2026).
- Athlete launch posts need ad labelling under the CAP Code, which Step 4.1's "within their contract bands" doesn't say.

**Recommended edits**

1. Phase headings:
   - `### Phase 3, whisper phase, T-6 to T-3 months` → `T-6 to T-1 months`
   - `### Phase 4, public reveal, T-3 months` → `### Phase 4, public reveal, T-0`
   - `### Phase 5, race-day proof, T-3 to T-0 months` → `T-0 to T+3 months`
   - `### Phase 6, sustained sell-through, T-0 to T+12 months` → `T+3 to T+12 months`
2. Worked example:
   - "Launch window planned for September (ahead of UTMB and the autumn race calendar)." → "Launch window planned for mid-August, a fortnight ahead of UTMB and the autumn race calendar."
   - "**Phase 4.** September 1, 2026, reveal day." → "**Phase 4.** 17 August 2026, reveal day."
   - Table `| 4, Reveal | Sep 1, 2026 |` → `| 4, Reveal | Aug 17, 2026 |`
   - Check the UTMB 2026 race date and correct "August 31" if needed.
   - Add the pre-order ship date to Phase 4, which Eval 4 needs.
3. Step 5.2: "Content drawn from practical capture plus AI-augmented social cuts per the segment-broll-production playbook." → append "Label AI-augmented cuts as AI-edited wherever they could pass as real footage (EU AI Act Article 50 from 2 August 2026; ASA guidance)."
4. Step 4.1: "sponsored athletes post their experience pieces (within their contract bands)" → "…(within their contract bands, labelled as ads)".
5. Hand-off: `**earned-media-pitch**` → `**earned-media-pitch-generator**`.
6. Frontmatter: add `"claude-5.5-opus"`.

---

## 8. hiring-shape-for-ai-native-teams: PASS-WITH-NOTES

**Prompts run:**

- The Step 2.2 capability-language rewrite, on a SYNTHETIC 124-word generic JD, in two passes.
- The Step 5.2 synthesis prompt, on the worked example's three candidates (signal scores plus trial scores).

Python checked word counts, banned adjectives, tool names, section counts and the recommendations against the playbook's own outcome.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, scorecard discrimination | NOT TESTABLE | Needs 6-month performance data. |
| Eval 2, trial time compliance | NOT TESTABLE | Needs real candidates. |
| Eval 3, offer-to-accept | NOT TESTABLE | Needs real candidates. |
| Eval 4, 6-month tenure | NOT TESTABLE | Needs real candidates. |

**Prompt-level checks**

- **Rewrite prompt.** Adjectives, tool names and section counts were all
  clean: 5 activities, 4 capabilities, 2 don't-needs. It failed "same
  word count or shorter" on the first pass (216 words against 124). A
  forced second pass hit 110 words, but only by stripping the observable
  detail the prompt exists to add.
- **Synthesis prompt.** It reproduced the playbook's outcome on 3/3
  candidates (A hire_with_concerns, B hire, C pass). That needed an
  assumption about which signals are critical, because the playbook
  never says.

**Evidence**

```text
orig words 124 rewrite words 216 | adjectives left: [] | tool names left: []
activities 5 capabilities 4 dont-need 2
short rewrite words 110   (e.g. "- A rubric you wrote that a team used.")
A (5-3-4-4, trial 4) hire_with_concerns matches playbook
B (4-5-4-3, trial 5) hire matches playbook
C (4-4-4-4, trial 3) pass matches playbook
Step 5.1 "two 5s on the critical signals": A has 1, B has 1, C has 0 -> rule would reject B
B scorecard extract shows "S3 + S4: 4" but the narrative gives S4 = 3
```

**Where behaviour differed from the playbook**

- **Critical signals are never named.** Step 5.1 and the synthesis
  prompt both depend on them. Step 5.1's own rule ("two 5s on the
  critical signals") would reject the candidate the worked example hires.
- **Unverified salary source.** We could not verify the "Marketing
  Mavens UK salary report". Levels.fyi mostly covers tech roles.
- **No guidance on AI in hiring decisions.** The synthesis prompt makes
  a hire/pass recommendation. That needs a human-decision guardrail
  (UK GDPR Art. 22). For EU candidates, AI used to evaluate candidates is
  a high-risk use under EU AI Act Annex III. Check the current
  application date before automating any of it.

**Recommended edits**

1. End of Step 3.1, add: "Before the loop starts, mark two signals per role as critical (for the pipeline curator, signals 2 and 3). Step 5.1 and the synthesis prompt both depend on this."
2. Step 5.1: "A candidate with two 5s on the critical signals and two 3s on secondary signals is a hire." → "A candidate with two 5s across the critical signals and the trial task, and no score below 3, is a hire."
3. Step 2.2 prompt: `- Same word count or shorter` → `- No longer than 350 words`
4. After the Step 5.2 prompt, add: "Use this as decision support only. A person makes the decision, and never paste CVs, protected characteristics or other personal details into it. Candidates shouldn't face a solely automated decision (UK GDPR Article 22). For candidates in the EU, AI used to evaluate candidates is a high-risk use under the EU AI Act (Annex III), so check the current obligations first."
5. "or the Marketing Mavens UK salary report if you are in Britain" → "or a current UK marketing salary survey from a recruiter you trust". Or link the report, if it exists.
6. Scorecard extract: `| Final panel | Pipeline curator S3 + S4 | 4 |` → split into `S3 | 4` and `S4 | 3`.
7. Frontmatter: add `"claude-5.5-opus"`.

---

## 9. quarterly-planning-ritual: PASS-WITH-NOTES

**Prompts run:**

- The Day 1 rollup rules, on the workbook's own `1_data` rows and on the SYNTHETIC 18-brief ledger from section 2.
- The Day 2 candidate-bet prompt, on "three regional Trail Club meets".
- The Day 3 retire diagnostic.
- The Day 4 falsifiability check, on the worked example's full metric story.

Python checked the displaced alternatives and the minimum brief counts behind the quoted hit rates.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1, displacement clarity | **FAIL** (worked example and CSV) | BET-6 names BET-C4 (voice extraction v2) as displaced, but that's committed as BET-7. BET-7 names BET-C8 (attribution), which is committed as BET-6. |
| Eval 2, 2–3 retires | PASS | 3 retires named. |
| Eval 3, metric-story falsifiability | **FAIL** (worked example) | The prompt flagged 3 of 10 claims as unfalsifiable. The example says "Falsifiability check passes". |
| Eval 4, five-day time-box | NOT TESTABLE | Needs a live quarter. |

**Evidence**

```text
Day-1 data rows: 5 -> every route n<4 -> rules give needs-more-data for all
claimed 0.86 needs >= 7 briefs; 0.15 needs >= 13; 0.10 needs >= 10 ...
minimum briefs to support the Day 1 claims: 48 | metric story says 18 across 5 routes
BET-6 Attribution teardown rerun displaces BET-C4 Brand voice extraction v2 <-- ALSO COMMITTED
BET-7 Brand voice extraction v2  displaces BET-C8 Attribution teardown rerun <-- ALSO COMMITTED
not falsifiable: "Lifecycle pipeline is working but on a different mechanism..."
                 "...moved engagement and conversion 2 to 4x harder..."
                 "The next quarter doubles down on audience-calendar bets."
first-pass rewrite of the 2-4x claim INVENTED "3 of 28 (0.11)"; replaced with {placeholders}
candidate bet: workbook route 'brand-experiences' not in library -> nearest event-sponsorship-playbook, flagged
```

**Where behaviour differed from the playbook**

- **Invented numbers in rewrites.** On its first pass, the falsifiability
  prompt (Opus 5.5, this run) made up plausible numbers to make a claim
  falsifiable. The prompt needs a no-invention rule.
- **Routes not in the library.** The workbook CSV routes bets to
  `seo-keyword-research` and `brand-experiences`, and neither exists.
- **Too few candidates.** Only 12 candidates were generated, against the
  playbook's 15–20 target.

**Recommended edits**

1. Day 1 worked example: replace "Five completed briefs with metrics logged (rows in the CSV template at the end). The per-pipeline rollup shows … direct-mail at 0.10 (retire)." with:
   "Eighteen completed briefs, seventeen with metrics logged (the CSV template shows five). The rollup shows race-result-content-engine at 6 of 7 (0.86, continue), channel-mix-simulator at 3 of 4 (0.75, continue), lifecycle-journey-builder at 2 of 4 (0.50, iterate) and crash-replacement-programme at 2 of 2 (needs-more-data). Three practices that ran outside the brief system (trail-marathon partnership packs, weekly LinkedIn long-form, monthly print) had no logged wins all quarter."
2. Day 3 list:
   - "6. Attribution teardown rerun (necessity before autumn budget, displaces voice extraction v2)" → "…displaces ambassador signing"
   - "7. Brand voice extraction v2 (18-month refresh, displaces attribution overlap, slotted with overlap to bet 6)" → "…displaces Trail Club events"
   - Same change in the CSV: BET-6 `BET-C4 voice extraction v2` → `BET-C6 ambassador signing`; BET-7 `BET-C8 attribution overlap` → `BET-C10 Trail Club events`. The CSV note already says "Could not fit BET-C6 or BET-C10".
3. "Falsifiability check passes. Marcus reviews and signs off." →
   "The falsifiability check flags three claims: the lifecycle 'different mechanism' line, the '2 to 4x harder' line and 'doubles down'. Beth rewrites the first two with a metric and magnitude and marks the third as a plan, not a claim. Marcus reviews and signs off."
4. Falsifiability prompt rules: add `- Rewrites use only numbers in the draft or the ledger. Where a number is missing, write {PLACEHOLDER}; never estimate one.`
5. Workbook CSV: `seo-keyword-research` → `seo-cluster-generator`; `brand-experiences` → `event-sponsorship-playbook` (or mark "no library pipeline").
6. Frontmatter: add `"claude-5.5-opus"`.

---

## Applied, 24 September 2026

We applied the recommended edits to all nine ops playbooks and six
template CSVs. Each playbook's frontmatter now reads
`models: ["claude-5.5-opus", <previous entries>]` with
`updatedAt: 2026-09-24`. We did not edit `src/content.config.ts`: the
coordinator is committing the `claude-5.5-opus` enum value separately.
`npm run build` passes, with 116 pages built.

Each edit was applied through a script that refuses to act unless the
old text matches exactly once. After editing, we reran the checks from
the retest:

- Every edited CSV parses, with the same field count on every row.
- The crash tier price bands now hold on 6/6 priced cases.
- The inventory health labels now match the (amended) Step 2.2 rule on
  13/13 rows.
- The quarterly displacement gate now passes 7/7, with 7 distinct
  displaced alternatives drawn from 15 candidates.
- The gear-launch calendar now puts the reveal (17 Aug) at T-3 and
  before UTMB week (24 to 30 Aug 2026, checked on the UTMB site), with
  reviewer units going out ten weeks before the reveal.

### brand-guardrails-as-code: CI re-run, now PASS-WITH-NOTES

We rebuilt the workflow's `run:` block and the `guardrails.yaml`
straight from the edited playbook and ran them against a local test
repo. There were two PR branches: a clean one, which contains a later
bare "Vahla" that the old rule would have blocked, and a violating one
with a lower-case brand name and a bare first "Vahla". The LLM rule was
stubbed, and no API call was made.

```text
== clean-pr / full checkout (fetch-depth: 0) -> exit 0
== bad-pr   / full checkout (fetch-depth: 0) -> exit 1
   ::error::Brand guardrails blocked in content/bad.md
   rule_id: brand_name_capitalization, vahla_range_naming
== clean-pr / shallow checkout -> exit 128  fatal: ambiguous argument 'origin/main...HEAD'
== bad-pr   / shallow checkout -> exit 128  (fails loudly now; before the fix it exited 0)
```

The job now fails a violating PR and passes a clean one. A missing base
ref now fails the job instead of passing it silently. On that basis we
tagged the playbook with `updatedAt`.

**Slack step.** We checked Slack's Workflow Builder guide
(slack.com/help/articles/360035692513). It lists schedule, link and
event triggers such as emoji reactions and channel joins, and mentions
connector steps for third-party actions. It does not describe
slash-command triggers or a built-in outbound HTTP step. The playbook now
says to start from a link or shortcut trigger, build a small Slack app
if you want a literal `/brandcheck`, and use a custom step or connector
to call the linter. It makes no stronger claim than that.

### Changed from the recommendations while applying

- **gear-launch-sequence.** We did not relabel the phase headings. On a
  closer read, the labels are consistent (reveal at T-3, proof window
  T-3 to T-0, sustain from T-0); only the worked example broke them. We
  kept the headings and rebuilt the worked example around T-0 = the end
  of the proof window (mid-November 2026):
  - foundation November 2025 to February 2026
  - hero shoot February to May
  - whisper May to mid-August, with reviewers under NDA in early June
  - pre-signal in July
  - reveal 17 August, with a 7 September ship date locked before pre-orders
  - proof window August to November, anchored on UTMB week
  - renewal in August 2027

  This also keeps the launch in Q3, where brief-to-ship (B-008) and
  quarterly-planning already place it. Quarterly-planning's "launch in
  September" and the CSV's "Phase 4 reveal in September" both now read
  August.
- **quarterly-planning-ritual.**
  - The recommended BET-6/BET-7 displacement swap would have reused
    alternatives already displaced by BET-1 and BET-2. The 12-candidate
    list had only 5 uncommitted candidates, so a unique alternative for
    all seven bets was impossible. We added three candidates, each
    routed to a real library pipeline, bringing the list to 15 (the
    playbook's own minimum): BET-C13 retail partner kit clinics, BET-C14
    coach referral pilot and BET-C15 membership tier test. BET-6 now
    displaces C13 and BET-7 displaces C14.
  - We rewrote the metric story's three unfalsifiable lines using only
    numbers already in the ledger or CSV. This corrected the hit rate
    from "80 percent" to "76 percent (13 of 17)" to match the new Day 1
    figures.
  - The three retires are now described as "practices outside the brief
    system" with no logged win, not pipelines with quoted hit rates.
  - `brand-experiences` became `no-library-pipeline` rather than a
    forced fit.
- **end-of-season-inventory.** The health rule now compares against the
  forecast pro-rated to today, and states that the template's Forecast
  columns hold the forecast to date. We added a `sold_through` band at
  under 2% of units on hand. A 5% cut-off would have mislabelled
  CAS-TR-BLU-10, which has 18 of 500 units left.
- **brief-to-ship-pipeline.** To bring first-pass acceptance into the
  40 to 80% band, B-008 is now a returned brief, which puts acceptance at
  6/8 (75%). Two data bugs were not in the original findings, and we
  fixed them: B-002's Notes contained an unquoted comma, which shifted
  the row, and so did CR-2026-0003's Tier_Reason in the crash CSV.
  RETIRE-1's rationale in the quarterly CSV had the same problem.
- **crash-replacement-programme.** We added a `Shipping_Postcode` column
  with sample postcodes. The Step 4.1 query and the CSV-generator prompt
  now name it. CR-2026-0006 now appears in the worked example as a
  human-review case, so the narrative matches the log.
- **hiring-shape-for-ai-native-teams.** We rewrote the Step 5.1 rule as
  "two 5s across the critical signals and the trial task, and no score
  below 3". That reproduces the worked example's A/B/C outcomes. We
  replaced "The signals below are the proven ones" with "the ones to
  start from", because we can't back the claim. We removed the "Marketing
  Mavens" reference and did not substitute a named survey.
- **evaluation-frameworks.**
  - The B4 fail anchor is now two comma-less lists
    ("wind, rain and snow; flasks, poles and a shell"), to match the
    `two_plus_violations` threshold.
  - The E2 fail anchor carries an actual emoji.
  - All seven `Judge_Model` values now read `claude-opus-5-5`.

### Not applied

- **Cross-cutting cast consistency** (Beth, Saoirse and Marcus in
  different roles across playbooks). This touches playbooks in other
  stacks and is an editorial call. It's left for James.
- **CC-2026-0006 (Ultra Trail Cape Town) date.** We could not verify the
  event date this session, so the row is unchanged.
- **Brief-to-ship ledger-table vs CSV mismatch** (B-003/004/005/007 have
  results in the table but not the CSV). The table is illustrative of end
  of quarter and the CSV of mid-quarter. It's left as is and noted here.
- **"Top-15 women's finish" and "27th overall".** These are fictional
  worked-example results and were left as written.
- **Meta messaging-API claim.** This was not verified. The playbook now
  says generically to check your platform's messaging rules before
  automating first-contact DMs, and it no longer suggests Zapier for
  them.
