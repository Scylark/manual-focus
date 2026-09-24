# Demand stack retest on Claude Opus 5.5 (24 Sept 2026)

A retest of all 11 playbooks in `src/content/lens/demand/` against the
current model, **Claude Opus 5.5** (`claude-opus-5-5`). The run was done in
Claude Code, and I ran every copy-paste prompt block at least once.
No playbook or skill file was edited. The exact edits are listed below
for James to apply.

## How to read this

- **What was actually run:** each prompt, executed by Opus 5.5 on the
  Cascadia Endurance worked-example inputs (a fictional brand). Where a
  playbook needed data, I built a **clearly-labelled synthetic dataset**
  and did the maths in python3 (numpy 2.4, scipy 1.17). Scripts and
  outputs are in the session scratchpad and were not committed.
- **Real public material:** 20 live inov-8 Trustpilot reviews (CEP
  Stream B), plus live checks on vendor, pricing and event facts. The
  sources are cited under each playbook.
- **Prompt-level only.** Most of these playbooks have outcome gates
  (holdout lift, ROAS after 6 weeks, retention at 90 days, partner NPS).
  These can't be tested without a live connector and real customer data,
  so they're marked **NOT TESTABLE**, not PASS. No ESP, ad platform or
  GA4 account was connected.
- **One model only.** This run tested Claude Opus 5.5. GPT and Gemini
  were not tested, so the `gpt-5` entries in frontmatter are unverified
  by this run.
- **Weak evidence where I marked both sides.** In two places (query
  mapping accuracy and voice eval) I produced the output and also scored
  it. I wrote the human key before producing the mapping, but treat
  those scores as a smoke test, not a calibration.

## Summary

| Playbook | Verdict | Gates passed / tested (of total) | Key note |
|---|---|---|---|
| attribution-teardown | PASS-WITH-NOTES | 2 / 3 (of 3) | The worked-example CVs don't reproduce: Paid social is 0.31, not 0.62, so it's "noisy", not "contested". Phase 5 never receives noisy channels. "10% lift" has no stated denominator. |
| channel-mix-simulator | PASS-WITH-NOTES | 3 / 3 (of 5) | Step 2.1 cites "the Python snippet", but the page contains none. GSC has no conversions. There are two different SEO floors. |
| paid-search-bidding-agent | **FAIL** as tested, PASS-WITH-NOTES after fixes and re-run | 2 / 3 (of 5) | The margin-% formula can't produce the worked example's shell-up/tee-down moves. The sign of `delta_pct` against tROAS is ambiguous. Learning phase says ±5% in one place and "halve" (±7.5%) in another. There's no AI Max section. |
| category-entry-points | PASS-WITH-NOTES | 2 / 3 (of 5) | 5 of 6 worked-example composites are miscalculated, and the rank order changes. Reddit blocks automated fetches (403). |
| lifecycle-journey-builder | PASS-WITH-NOTES | 3 / 3 (of 5) | Self-reported voice metrics drift from the actual counts. An LLM can't "compute" semantic similarity. "Import directly" into the ESP is overclaimed. |
| ambassador-programme | PASS-WITH-NOTES | 1 / 2 (of 5) | The composite weights sum to 90%. Worked tiers contradict the rule (Marcus 6.6 = Tier B, not Decline). Strava scraping breaches Strava's terms. EU AI Act Art. 50 is now live. |
| direct-to-coach | PASS-WITH-NOTES | 1 / 1 (of 5) | The TrainingPeaks URL returns 404. Coach rosters aren't public, so cohort attribution won't work as written. The CFO signs off below the playbook's own 2% floor. |
| event-sponsorship-playbook | PASS-WITH-NOTES | 3 / 3 (of 5) | UTMB's title partner is HOKA, not Salomon. Hardrock (activation 4) fails the "<4" walk-away rule it cites. Piece counts are inconsistent (22/21/24). |
| race-day-demand-pipeline | PASS-WITH-NOTES | 2 / 3 (of 5) | The worked shoot-to-live gap is 5.4 weeks, which fails the playbook's own 6-week gate. There's no Trail World Champs in Oct 2026 (next is Oct 2027, Cape Town). Strava clubs and Garmin Connect IQ are not ad targeting signals. |
| retail-partner-programme | PASS-WITH-NOTES | 2 / 2 (of 5) | Annual review outcomes cover 21 of 84 accounts. The training gate (quarterly) contradicts the Tier B expectation (twice a year). Vend is now Lightspeed. |
| subscription-membership | PASS-WITH-NOTES | 1 / 1 (of 5) | "£15 headroom" should be £10.80. RCC is £70, not £150. On's Cyclon subscription ended June 2026. The UK DMCC subscription regime is coming. |

**Across all 11 playbooks:**

1. Every playbook lists `claude-4.5-opus` / `claude-4.5-sonnet` in `models:`.
   `LENS_MODELS` in `src/content.config.ts` has no Opus 5.5 entry, so add
   `'claude-opus-5.5'` to the enum before updating any frontmatter.
2. Every worked example that shows computed numbers had at least one
   arithmetic error, and none of them had been computed in code. On Opus
   5.5 the prompts behave well when the maths goes to a script. Recommended
   house rule: **any prompt that asks for CV, correlation, composite,
   similarity or power must say "compute in code, not in your head"**.
3. Every JSON-returning prompt returned valid JSON first time on Opus 5.5.
   None needed a retry for format.

---

## 1. attribution-teardown

**Inputs:** synthetic Cascadia master sheet, 6 channels × 12 weeks × 3
sources (GA4 DDA, GA4 LC, platform), with Display spend pulsed in
W03–05 and W09–10, a PR spike in W06, and weekly branded-search clicks.
**Prompts run:** Option B template, Phase 2 CV, Phase 3 correlation,
Phase 4 hypotheses, Phase 5 bets, Exercises 2–3.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1: ≥3 sources | PASS | Paid social, Paid search and Display carry 3 sources. Organic, email and direct carry 2, and the prompt correctly still computes CV on 2. Note that this contradicts "two is binary and gives no signal". |
| Eval 2: 4- vs 12-week stability | PASS | Tags were identical in both windows (Display contested at 0.93/0.90, Paid social noisy at 0.31/0.28). |
| Eval 3: test-design power | FAIL | Holding runtime fixed, "10% lift" needs 10 weeks (feasible) if the 10% is of total conversions, but 207 weeks if it's 10% of paid-social conversions. The prompt doesn't say which, so the feasibility verdict is arbitrary. |

**Evidence (python, synthetic):**
```
Worked-example check  Paid social [4180,2890,1940] CVpop 0.31 CVsample 0.37  (playbook: 0.62)
                      Display     [380,110,18]     CVpop 0.91 CVsample 1.11  (playbook: 0.84)
                      Paid search [2840,2610,3120] CVpop 0.07                (playbook: 0.21, listed as contested)
Phase 2 (12w)  Paid social cv 0.31 noisy | Display cv 0.93 contested | others stable
Phase 3        Display r(lag0,1,2) = 0.13, 0.95, 0.26 -> strong, lag 1 (W06 PR spike noted as confound)
               Meta brand r = 0.02, 0.14, -0.24 -> none
Power          noise 8%/wk: 10% of paid-social conv -> 207 wks NOT feasible; 10% of total -> 10 wks feasible
```

**What behaved differently from the playbook:**
- With realistic 3-source numbers, the biggest overclaiming channel (Meta,
  platform ≈ 2× last-click) came out **noisy**, not contested. Phase 5 is
  only given contested and stable channels, so Meta never reaches the
  recommendation step. That's exactly the channel the playbook is written
  for. Opus 5.5 flagged the gap itself and asked for the noisy list.
- `most_plausible_source` is spelled "none [em dash] needs test" in the schema and
  "none, needs test" in the rules. The model picked one; the playbook
  should pick one.

**Stale references:**
- GA4 renamed "conversions" to **key events** (2024).
- Attribution settings now live under **Admin > Data display > Attribution
  settings**, not Reports > Advertising.
- Meta removed 7-day and 28-day *view* windows on 12 Jan 2026. The default
  of 7d-click + 1d-view is still correct, but add a note that historic
  comparisons across that date will drop.
- Add Meta's *incremental attribution* setting as an optional 4th source.

**Recommended edits:**
- Phase 2 SYSTEM: "You compute the coefficient of variation (CV)" → "You compute, in code and not in your head, the coefficient of variation (CV) using population standard deviation".
- Phase 2 rule: add "Also flag any channel where Platform ÷ GA4_DDA > 1.4 as `platform_overclaim` regardless of CV."
- Phase 5 USER: "Stable channels (for context, no action needed):" → "Noisy channels (candidates for cut_or_test):\n{PASTE_NOISY_CHANNELS_FROM_PHASE_2}\n\nStable channels (for context, no action needed):"
- Phase 5 rule: "A test needing more than 12 weeks to detect a 10% lift" → "A test needing more than 12 weeks to detect a 10% lift in the tested channel's own incremental conversions (state the baseline weekly conversions and weekly noise you assumed)"
- Phase 4 schema: change the em-dash spelling to "none, needs test" so it matches the rules and house style.
- Worked example Phase 2 JSON: replace the CVs with Paid social 0.31 (noisy), Display 0.91 (contested), Paid search 0.07 (stable), and change the narrative to "Paid social is noisy but platform reads 2.2× last-click, so it goes to Phase 5 via the overclaim flag".
- Step 1.1: "Go to **Advertising** then **Attribution settings**" → "Go to **Admin** then **Data display** then **Attribution settings**"; "Conversions (data-driven)" → "Key events (data-driven)".
- Frontmatter `models`: add `claude-opus-5.5` once the enum allows it.

## 2. channel-mix-simulator

**Inputs:** synthetic 52-week spend/output for 6 channels generated from
known Hill curves with 8% noise, one Black Friday outlier, lumpy Events
spend, and near-flat Display spend. **Run:** Step 1.3 template prompt,
scipy `curve_fit` Hill fits, outlier rule (2.5 SD), 44/8 backtest, 20
scenarios, ±25% sensitivity, Phase 5 CFO rationale prompt.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1: R² > 0.6 | PASS (gate works) | 5 of 6 channels passed. Display R² 0.42 was flagged, as the playbook predicts. |
| Eval 2: backtest MAPE < 25% | PASS | MAPE 4.8–10.0% on all 6. Display's MAPE was 4.8% despite R² 0.42: flat spend kills R² without hurting prediction, so the two gates can disagree. |
| Eval 3: ±25% sensitivity | PASS | No single parameter swung the recommended scenario by more than 20%. |
| Eval 4: 60% floor | NOT TESTABLE as written | This isn't a check on output. It's a constraint, and the optimiser obeyed it. |
| Eval 5: CFO read | NOT TESTABLE | Needs a CFO. |

**Evidence:**
```
Meta             M=564 k=10547 n=2.17 R2=0.83 PASS outliers=[26,47] current=19984 (plateau)
Search non-brand M=712 k=14813 n=1.01 R2=0.81 PASS current=5069 (headroom)
Display          R2=0.42 FLAG   | backtest MAPE 4.8% PASS
SEO              k hit bound (1e6) -> effectively linear = "headroom unknown" (as playbook predicts)
Opt max output (greedy from zero, no floors)  out 521 (-215 vs current)  <- trap
Opt with floors (greedy from floors)          out 794 (+58/wk), Meta 19,984 -> 15,268, Search 5,069 -> 10,145
CFO para 1: "Move £4,700 a week from Meta and £840 from Display into non-brand search (£5,080).
Projected +58 conversions a week, about +750 over 90 days (band +750 to +770 on the multiplier range)..."
```

**What behaved differently from the playbook:**
- Step 2.1 says "The Python snippet uses scipy.optimize.curve_fit". **The
  page has no snippet.** Opus 5.5 wrote a working one, but a reader of
  the page can't.
- The fitted Hill `n` was above 1 for most channels (S-curves). A naive
  greedy optimiser that starts from zero got stuck and did **worse than
  the current allocation**. The optimiser has to start from floors or
  from the current allocation.
- The Events floor ("60% of 12-month average") is above recent spend for
  lumpy channels, so even the current allocation "violates" it.
- The SEO floor is 60% of the trailing average in Step 5.1 and Eval 4, but
  "at the current spend" in the worked example. The optimiser pulled SEO
  down to exactly 60%.
- The cross-channel multipliers mix units: "8–15% of paid social spend
  bleeds into branded search demand" converts spend into demand. Before
  it could be applied, the model had to ask what the unit was
  (conversions per £1k?).
- The ±10/20% anchored scenarios don't say where the money comes from. My
  first pass produced a negative SEO allocation (NaN) until I made it
  budget-neutral.

**Stale references:** "GSC … conversions (if you have GSC conversions
linked from GA4)". GSC has no conversions metric. GA4 "conversions"
should be "key events". Front matter still says `preview: true`.

**Recommended edits:**
- Step 2.1: after "…the fit refines from there." add the ~15-line snippet: `hill()`, `curve_fit(hill, spend, conv, p0=[conv.max()*1.5, median(spend), 1.5], bounds=([0,1,0.3],[1e5,1e6,5]))` and an R² line.
- Step 4.2: add "Optimise with a constrained solver (scipy `minimize`, SLSQP) starting from the current allocation, not a greedy allocator from zero. Hill curves with n > 1 trap greedy search."
- Step 1.2 item 3: "Export CSV for clicks and conversions (if you have GSC conversions linked from GA4)" → "Export CSV for clicks. Take SEO conversions from GA4 (Organic Search, key events)."
- Step 3.1 bullet 1: "8 to 15% of paid social spend bleeds into branded search demand" → "each £1k of paid social adds 8 to 15% of its own attributed conversions again as branded-search conversions".
- Worked example: "respects an SEO floor at the current spend" → "respects the SEO floor (60% of trailing average) and chooses not to cut SEO at all".
- Eval 4: add "For lumpy channels (events, sponsorship) apply the floor to the quarterly total, not weekly spend."

## 3. paid-search-bidding-agent: FAIL as first tested, PASS-WITH-NOTES after the applied fixes (see Applied)

**Inputs:** the playbook's margin map (Vahla £52/£180, tee £8/£30, shorts
£22/£60); 5 synthetic ad groups over a 30-day trailing window; 50
synthetic queries. **Prompts run:** Phase 2 mapping, Phase 3 daily bid
(×5 groups), Phase 5 weekly review.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1: mROAS lift in 4–6 weeks | NOT TESTABLE | Needs a live account. |
| Eval 2: revenue ROAS drop ≤ 5% | NOT TESTABLE | Needs a live account. |
| Eval 3: mapping ≥ 90% | PASS (weak) | 45/50 agreed with the pre-written key. All 5 disagreements were under 0.7, so all went to human review. 15/50 were routed to review. |
| Eval 4: brand floor held | PASS | The brand group was never recommended below its floor. |
| Eval 5: learning phase ≤ ±5% | FAIL (spec conflict) | The prompt and Eval 5 say ±5%. Step 4.1 says "halves its allowed delta", which is ±7.5%. |

**Evidence (python):**
```
margin %: Vahla 28.9 | tee 26.7 | shorts 36.7
group               rev ROAS  mROAS   raw delta   capped
Vahla shell review    2.25     0.65    -23.5%     -15.0%
Cascadia tees         2.19     0.58    -31.2%     -15.0%
Race shorts           2.33     0.86     +0.7%      +0.7%   (learning ACTIVE, <5%)
Equivalent revenue tROAS for target mROAS 0.85: shell 2.94, tee 3.18, shorts 2.32
```

**Why this fails as written:**
1. Step 3.1 uses **margin percent** × conversion value. Shells (28.9%) and
   tees (26.7%) are almost the same per £ of revenue, so the formula
   can't produce the worked example's "shell +12%, tees −9% because £52
   margin". That reasoning uses £ per unit, which ROAS never sees.
2. `delta_pct` sits next to `recommended_target_roas`. Raising tROAS
   *lowers* bids, but the worked example talks about "bid up 12%". I had
   to choose a sign convention myself. An agent writing to the API with
   the wrong one bids backwards.
3. The prompt has no rule for competitor-brand queries. I mapped
   "inov8 jacket" and "salomon slab shorts" to products.

**Current-context gaps:**
- **AI Max.** From 1–30 Sept 2026 Google auto-migrates Search campaigns
  that use automatically created assets or campaign-level broad match
  into AI Max. Keyword-based campaigns without those settings are not
  auto-converted. In migrated campaigns, query matching goes beyond the
  keyword list, which changes Phase 2 (map by search term *and* landing
  page) and weakens the "unknown-query ceiling".
- The standard way to do this now is value-based bidding on margin: send
  margin-adjusted conversion values (conversion value rules, or
  offline/server-side value upload) and let tROAS bid on profit. The
  playbook should present this as Option A and keep the agent as Option B.
- **ChatGPT ads** have been live in the UK since 6 June 2026 (CPM, with
  CPC bidding added) through the self-serve Ads Manager beta. They're
  worth a line under hand-off as an emerging query channel. It's not in
  scope for the bidding agent.

**Recommended edits:**
- Step 3.1: "Margin-adjusted revenue = sum over conversions of (conversion value times contribution margin percent for the mapped product)." → keep, and add: "Because this is per £ of revenue, products with similar margin % get similar bids however different their £ margin per unit. If per-unit margin matters to you, optimise to margin £ per conversion instead."
- Phase 3 prompt schema: `"delta_pct": <number, -15 to +15>` → `"target_roas_delta_pct": <number, -15 to +15, positive = higher tROAS = lower bids>`.
- Step 4.1: "the agent halves its allowed delta until learning completes" → "the agent caps its delta at ±5% until learning completes".
- Phase 2 rules: add "- Queries naming a competitor brand go to unmappable_queries with reason 'competitor term', never to a product."
- Worked example Phase 3: rewrite as "the agent lifts the race-shorts group (36.7% margin) and trims tees (26.7%), while shells (28.9%) barely move".
- New Step 1.4 "If your campaigns moved to AI Max in September 2026": use the search terms and landing pages report for Phase 2, and treat final-URL expansion as a mapping risk.
- Step 3.3: add "Option A (preferred where available): upload margin as the conversion value and let platform tROAS optimise it. The daily agent then only enforces guardrails."

## 4. category-entry-points (plus skill)

**Inputs:** 20 **real** inov-8 Trustpilot reviews (fetched 24 Sept 2026);
a synthetic 60-query Cascadia GSC set; synthetic competitor content
samples, because inov8.com returned 403 and the Meta Ad Library needs a
logged-in browser. **Prompts run:** Stream A clustering, Stream B
extraction on the real reviews, Stream C (same prompt, one synthetic
transcript), Stream D coverage, convergence, 4-dimension scoring,
Exercise 3 brief.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1: trigger fidelity ≥ 95% | PASS | 3/3 extracted verbatims are exact substrings of the source (checked in python). |
| Eval 2: ≥ 60% cross-stream | NOT TESTABLE meaningfully | The streams were synthetic, so convergence is by construction. |
| Eval 3: fit correlation > 0.7 | NOT TESTABLE | Needs a brand team. |
| Eval 4: coverage sanity | NOT TESTABLE | Needs a brand team. |
| Worked-example composite (Step 5.2 rule) | FAIL | 5/6 composites are wrong under the playbook's own 30/25/25/20 weights. |

**Evidence:**
```
Stream B on 20 real inov-8 reviews -> 3 triggers (most reviews are service/delivery praise)
  "Have always struggled to find trainers to fit as I have long, narrow feet for a woman and
   many suppliers push me into men's"  relevance 7, uniqueness 8, frustration
  "will use on a race this coming weekend"  relevance 8, uniqueness 6
  "pointed me in the right direction for a gift"  uniqueness 2 -> dropped at convergence (<3)
Composite check: Second loop 8.75->8.70 | Wet Wed 8.05->8.15 | Winter 6.95->7.05 |
                 Coach-recommended 6.95->7.15 (now ranks 3rd, above First ultra 7.10) | Taper 6.65->6.75
```

**What behaved as predicted:** 20 reviews gave 3 triggers, below the
Exercise 1 threshold of 8. That's exactly the "reviews too generic, ask
better post-purchase questions" outcome the playbook predicts. The
extraction prompt returned `[]` on reviews with no trigger instead of
inventing one.

**What behaved differently:**
- Reddit returned 403 to automated fetches (both old. and www.). Manual
  copy-paste in a browser still works, but an agent run can't mine Reddit
  unauthenticated.
- Stream A's "Return between 15 and 30 clusters" forced over-splitting on
  a 60-query set.
- The scoring rule says "Round to one decimal place", but the worked
  example uses two decimals.

**Recommended edits:**
- Worked example Phase 5 list: 8.75 → 8.70; 8.05 → 8.15; 6.95 → 7.05 (winter); 6.95 → 7.15 (coach, move to rank 3); 6.65 → 6.75. Also round to one decimal (8.7, 8.2, 7.2, 7.1, 7.1, 6.8), or change the rule to two decimals.
- Step 5.2 SYSTEM: add "Compute the composite arithmetically from the four scores. Do not estimate it."
- Stream A rules: "Return between 15 and 30 clusters." → "Return 15 to 30 clusters, or one cluster per 20 queries if the input has fewer than 300 queries."
- Step 2.1: "Reddit's old.reddit.com interface gives a cleaner copy-paste." → "Copy threads manually from a logged-in browser. Reddit blocks unauthenticated automated fetches, and its data terms restrict scraping."
- Skill `SKILL.md`: remove the `// specific vs generic` comment inside the JSON block (invalid JSON if pasted literally). Add the composite weights (30/25/25/20), which the skill omits.

## 5. lifecycle-journey-builder (plus skill)

**Inputs:** a synthetic Cascadia voice profile (mean sentence 9–14 words,
≥1 contraction per 40 words, concrete-observation opener, no `!` or em
dash) and the playbook's four segments. **Prompts run:** validator, graph
(first-purchase segment), drafting ×3, voice eval ×3, repetition check,
Klaviyo routing spec.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1: voice pass ≥ 90% | PASS (weak) | 3/3 passed the 6-check eval. Sentence means were 9.4, 9.8 and 11.0 (computed). |
| Eval 2: no pair > 0.85 | PASS | TF-IDF cosine was 0.22–0.30 (stand-in; no embedding model available). The model's own estimates were 0.30–0.40. |
| Eval 3: CTA distinctness | PASS | 3/3 unique CTAs. |
| Eval 4: segment match | NOT TESTABLE | Needs human raters. |
| Eval 5: holdout | NOT TESTABLE | Needs a live ESP. |

**Evidence:**
```
Validator: verdict pass (V1-V4 pass) on the worked-example inputs
T01 "Your Vahla shell, first week"  actual mean sentence 9.4 (self-report 11) contractions 2 (self 2)
T02 "About the second loop"         actual 9.8 (self 10) contractions 3 (self 2)
T03 "Wet Wednesday, week three"     actual 11.0 (self 12) contractions 3 (self 1)
Routing spec: frequency_cap {"period_days": 7, "max_touches": 3}
```

**What behaved differently:**
- `voice_self_check` numbers were **wrong in 4 of 6 fields**: sentence
  length was overstated by 0.2–1.6 words and contractions were
  undercounted. The self-check can't serve as a gate. The voice eval
  should recount from the text in code.
- The repetition prompt asks the model to "compute pairwise semantic
  similarity". It can only estimate. Also, the 0.85 threshold only means
  something for a named embedding model: same-brand, same-topic emails
  often sit at 0.8+ cosine on modern embedding models. Calibrate the
  threshold before using it.
- "JSON spec the engineering team can import directly into Braze,
  Klaviyo, Customer.io or HubSpot" is overclaimed. Klaviyo's Create Flow
  API is still beta (a `.pre` revision, "not for production"). Braze
  Canvases can't be created from a JSON import. Treat the spec as a build
  sheet.
- The skill and the playbook disagree. The frequency cap is "default 4" in
  the skill vs unspecified in the playbook. The rubric is "<10/12" in the
  skill vs 6 checks in the playbook. Quiet hours appear only in the skill.

**Recommended edits:**
- Phase 4.1 SYSTEM: add "Recount sentence lengths, contractions, em dashes and exclamation marks from the draft text. Ignore the draft's voice_self_check."
- Phase 4.3 SYSTEM: "You compute pairwise semantic similarity" → "Pairwise similarity is computed by an embeddings script (name the model). You receive the scores and decide which touchpoint to regenerate."
- Output 4: "a JSON spec the engineering team can import directly into Braze, Klaviyo, Customer.io or HubSpot" → "a JSON build spec the engineering team uses to configure the flow in Braze, Klaviyo, Customer.io or HubSpot (Klaviyo's flow-creation API is beta; the others are built in the UI)".
- Phase 5 schema: `"max_touches": <int>` → `"max_touches": <int, default 4>`, and add quiet hours 22:00–08:00 to match the skill. Alternatively, change the skill to match the playbook.
- Worked example: "Voice eval pass rate at 87%" → "86%" (38/44).

## 6. ambassador-programme

**Inputs:** the playbook's three example athletes; synthetic race results
and posts; the Cascadia AI plan. **Prompts run:** audience scrape ×3, AI
clauses, shoot plan, cadence, quarterly scorecard.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1: rubric backtest | NOT TESTABLE | Needs 5 past partnerships. |
| Eval 2: AI clause coverage | PASS | All 6 clauses returned. Augmentation vs fabrication is distinguished, voice cloning needs separate consent, and the sunset is 18 months. |
| Eval 3–5 | NOT TESTABLE | Monthly and quarterly live data. |
| Step 1.4 composite / tiers | FAIL | The weights sum to 90%, and the worked tiers don't follow the rule. |

**Evidence:**
```
Weights 20/25/20/15/10 = 90%
Beth    raw 7.50 (Tier B by rule) | /0.9 = 8.33 | table says 8.1 Tier A
Marcus  raw 6.00 (Tier B)         | /0.9 = 6.67 | table says 6.6 "Decline" (rule: 6.0-7.5 = Tier B)
Saoirse raw 7.30 (Tier B)         | /0.9 = 8.11 | table says 8.2 Tier A
Clause excerpt: "Cascadia may alter time of day, weather and surroundings in footage the Athlete
took part in. Cascadia may not depict the Athlete in any activity, place or event they did not take part in..."
```

**Current-context gaps:**
- **EU AI Act Art. 50(4)** deepfake disclosure applies to deployers from
  **2 August 2026**, with no grace period. The Omnibus relief covers only
  the 50(2) marking duty. The disclosure clause should cite it for any
  content shown to EU audiences.
- **Strava's API agreement** (Nov 2024, tightened again June 2026) bars
  using Strava data in AI models, and scraping is against its terms.
  "Public profiles you can scrape (Strava…)" should go.
- "2025-onwards" dates the copy.

**Recommended edits:**
- Step 1.4: "Composite is the weighted sum, result credibility 20%, audience alignment 25%, content credibility 20%, personal alignment 15%, schedule realism 10%" → "…schedule realism 10%, divided by 0.9 (visual rights carries no weight; it's a gate). Any candidate with audience alignment below 5 is declined whatever the composite."
- Expect-output table: Beth 8.1 → 8.3; Saoirse 8.2 → 8.1; Marcus 6.6 → 6.7 (Decline, via the audience-alignment rule). Update `ambassador-selection-scorecard.csv` to match.
- Before-you-start bullet 1: "public profiles you can scrape (Strava, Instagram…)" → "public profiles you can review manually or that the athlete shares with you (Instagram, race-result archives, federation rosters). Don't scrape Strava: its terms prohibit it and bar Strava data in AI models."
- Phase 2 rules: add "- Disclosure clause names EU AI Act Article 50(4) for any synthetic or manipulated likeness shown to EU audiences (applies from 2 Aug 2026), plus ASA/CAP rules for UK ads."
- "2025-onwards" (×2) → "current".

## 7. direct-to-coach

**Inputs:** a synthetic 20-coach roster; 5 sample requests (3 legitimate,
2 abusive), per Exercise 2. **Prompts run:** template, tiering ×5, abuse
triage ×5, coach-register fit guide, Tier A renewal.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1: Tier A coverage | PASS (synthetic) | Tiering followed the rules. One discipline with zero Tier A was flagged. |
| Eval 2–5 | NOT TESTABLE | Need live fulfilment, checkout survey and CAC data. |

Abuse triage: 5/5 matched the intended label. Both abusive requests were
correctly held or blocked.

**What behaved differently:**
- The worked example blocks a request because "the coach has no public
  coaching presence". That input isn't in the prompt, so the model can't
  produce that verdict.
- Cohort attribution relies on a coach's "public TrainingPeaks roster".
  TrainingPeaks rosters are private, so this layer can't be built as
  written.
- The direct-attribution layer maps athlete email to coach. The athlete's
  data comes from a third party (the coach), which needs a lawful basis
  and a privacy notice to the athlete (UK GDPR).
- Internal inconsistencies:
  - The Tier A menu says "2 to 5 athlete samples per quarter"; the worked
    example and CSV say 12–16.
  - The budget floor is 2%, but the CFO signs at 1.8%.
  - Month-one direct conversion is 63% (24/38) against the playbook's
    own "around a third".

**Stale references:** `trainingpeaks.com/coach-search` returns 404; the
live directory is `trainingpeaks.com/find-a-coach/`. The Final Surge link
redirects to `/trainingplans`. "UK Athletics CoachHub" couldn't be
verified.

**Recommended edits:**
- Step 1.1: "trainingpeaks.com/coach-search" → "trainingpeaks.com/find-a-coach/"; confirm or remove the Final Surge path and "CoachHub".
- Phase 3 prompt USER: add "Coach public presence (profile URL or NONE): {PROFILE_URL}". Add the rule "- 'block' if public presence is NONE."
- Step 5.1 cohort bullet: "(from their public TrainingPeaks roster)" → "(athletes the coach has named to you through sample requests or clinics, with their consent)".
- Step 5.1 direct bullet: add "Tell the athlete at sample request that their details came from their coach, and record the lawful basis."
- Phase 2 table, Tier A: "2 to 5 athlete samples per quarter" → "up to 12 athlete samples per quarter". Alternatively, change the worked example and CSV to 5.
- Worked example Phase 2: "1.8% of marketing budget" → "2.0%".

## 8. event-sponsorship-playbook

**Inputs:** the playbook's six events and scores, and the Lavaredo fee and
budget. **Prompts run:** scoring ×6, activation budget, content rights,
content-yield mapping, scorecard.

| Gate | Result | Evidence |
|---|---|---|
| Eval 2: activation ≥ 30% | PASS | Lavaredo: £28k / (£45k + £28k) = 38.4%. |
| Eval 3: content yield ≥ 50% | PASS | The mapping prompt listed one honest gap (the athlete sit-down), with a workaround. |
| Eval 5: AI clause coverage | PASS | The clause distinguished augmenting from fabricating. The data clause asked for anonymised demographics only. |
| Eval 1, 4 | NOT TESTABLE | Multi-deal history needed. |

The activation budget prompt summed exactly to £28,000 and gave content
production 28%.

**What behaved differently:**
- With the rule as written ("walk_away if … activation_feasibility below
  4"), Hardrock (activation 4) came back as **major_partner**, not walk
  away.
- The model declined to recommend "category_exclusive" for Lavaredo at a
  £45k fee, because that sits below the menu's own £50k floor. It
  returned major_partner and flagged the pricing.

**Stale / factual:** UTMB's naming partner is **HOKA** ("HOKA UTMB
Mont-Blanc", deal through 2028), not Salomon. Piece counts are
inconsistent: 22 planned, 21 after the gap, then "24 shipped, 21 planned".

**Recommended edits:**
- Phase 1 rule: "below 4" → "at or below 4" (keeps the Hardrock example valid).
- Worked example UTMB: "ceiling 4 (Salomon owns headline)" → "ceiling 4 (HOKA holds the naming partnership through 2028)".
- Worked example Lavaredo: "£45k Tier B sponsorship fee" → "£55k category-exclusive fee". Alternatively, lower the table's floor to £40k.
- Phase 6 output: "(24 pieces shipped, 21 planned)" → "(24 pieces shipped against 22 planned)".
- Label consistency: use the tier names (headline / category exclusive / major partner / activation only) throughout, or add "(Tier A/B/C/D)" to the Phase 2 table headers.

## 9. race-day-demand-pipeline

**Inputs:** the playbook's Cascadia calendar and UTMB brief inputs.
**Prompts run:** calendar template, UTMB brief, inventory tagging,
UTMB paid programme.

| Gate | Result | Evidence |
|---|---|---|
| Eval 2: lead time ≥ 6 weeks (shoots) | FAIL (worked example) | Shoot ends 10 Jul and creative goes live 17 Aug: 5.4 weeks. The backup window (24 Jul) gives 3.4 weeks. |
| Eval 3: capability honesty | PASS | "AI video of Beth on the Courmayeur climb" was tagged `real_footage_required` and put on the archive-gap list. |
| Paid split rule (40–55 / 15–25 / 30–40) | PASS | UTMB £22k / £8k / £15k = 48.9 / 17.8 / 33.3%. |
| Eval 1, 4, 5 | NOT TESTABLE | Calendar-year process. |

The UTMB brief hook came back as "The decision at Courmayeur", matching
the worked example. The tagging prompt returned 9 real / 11 augmentation
/ 2 generic from the worked inventory.

**Stale / current context:**
- The **World Mountain & Trail Running Championships** are biennial
  (2025 Canfranc; next is 6–10 Oct 2027, Cape Town). There is no October
  2026 edition.
- "Strava clubs" and "Garmin Connect IQ usage" are not ad targeting
  signals on Meta or Google. The model had to mark them "not available"
  every time.
- Meta audience targeting is now mostly Advantage+ audience suggestions,
  and Meta is pushing end-to-end AI ad creation. "Bid floors" aren't a
  Meta concept (Meta uses cost or bid caps).
- Search event bids for any AI Max-migrated campaign have less
  keyword-level control.
- ChatGPT ads (UK, from June 2026) are a candidate channel for pre-event
  gear-research queries.

**Recommended edits:**
- Worked example Phase 1: "Trail World Championships (October)" → "a regional Tier 1 anchor (the World Mountain & Trail Running Championships are next held in October 2027)".
- Worked example Phase 4: "Backup window 22 to 24 July" → "Backup window 1 to 3 July". Also move the primary shoot to "24 to 26 June", or start the pre-event creative on 21 August with a 6-week lead from 10 July.
- Phase 5 USER "Endurance-audience targeting tells": replace the three lines with "First-party audiences available (race-entry partner lists, email segments, Strava Club members who opted in): {LIST}\nPlatform audience mode (e.g. Meta Advantage+ audience on/off): {MODE}".
- Phase 5 schema: `"bid_floors": {"<channel>": <int>}` → `"bid_controls": {"<channel>": "<search brand floor | Meta cost cap | none>"}`.
- Phase 5 SYSTEM: add "If Search campaigns run under AI Max, say which controls still apply (brand inclusions/exclusions, URL exclusions)."

## 10. retail-partner-programme

**Prompts run:** tier assignment ×5 (synthetic partners), sell-in kit
(margin-and-terms and first-90-days pieces), training session, quarterly
scorecard ×2, annual review ×1.

| Gate | Result | Evidence |
|---|---|---|
| Eval 1: sell-through ≥ 70% | PASS (synthetic) | The scorecard marked 0.64 as "below" and 0.78 as "above". |
| Eval 3: tier honesty | PASS | The annual review produced "demote to C" with a data-led opener: "Your sell-through was 52% against a 70% line for three of four quarters…". |
| Eval 2, 4, 5 | NOT TESTABLE | Need live attendance, coverage and NPS data. |

The training prompt returned 5 selling moves and a 5-question quiz as
required. The sell-in pieces stayed under one page with no adjectives
from the banned register.

**What behaved differently:**
- Eval 2 wants 80% of Tier A/B attending a session **every quarter**,
  but the Tier B expectation is "two training sessions a year". The model
  flagged a Tier B partner as failing Eval 2 while meeting its tier
  expectation.
- The annual review worked example accounts for 21 of 84 accounts
  (4 + 8 + 6 + 3).
- The "end" rule in the annual review has no numeric floor. Opus 5.5
  handled it sensibly.

**Stale:** Vend is now **Lightspeed Retail (X-Series)**.

**Recommended edits:**
- Eval 2: "attend at least one training session per quarter" → "meet their tier's training expectation (every session for Tier A, two a year for Tier B)".
- Worked example Phase 5: "8 maintained" → "71 maintained" (84 − 4 promoted − 6 demoted − 3 ended = 71; or state that the figures cover only a flagged subset).
- "Lightspeed, Shopify POS or Vend" (×2) → "Lightspeed Retail, Shopify POS".

## 11. subscription-membership

**Prompts run:** hypothesis, tier shape, benefit scoring ×5, cancellation
flow, quarterly review, all on the Cascadia Trail Club inputs.

| Gate | Result | Evidence |
|---|---|---|
| Eval 4: cancellation sentiment | PASS (prompt-level) | The flow was 3 steps with pause offered once, no retention discount, and a single 90-day touch. |
| Eval 1, 2, 3, 5 | NOT TESTABLE | Need a live membership. |

**What behaved differently:**
- The benefit-scoring prompt asks for `composite` but gives no formula.
  Opus 5.5 used an unweighted mean of the three numeric scores and said
  so. Another run could weight them differently, which makes the cut
  threshold (composite < 5) unstable.
- The worked example says "£15 per month margin headroom". £180 a year is
  £15 a month of **revenue**; after £4.20 cost the headroom is **£10.80**.
- The comparables are stale, which breaks the playbook's own "anchor
  inside the comparable range" rule:
  - **Rapha Cycling Club is £70/yr** on rapha.cc, not £150. That puts
    £180 outside the comparable range.
  - **On's Cyclon subscription** was discontinued (direct purchase from
    June 2026).
  - Strava Premium is now "Strava subscription" at £54.99/yr in the UK.
- UK context: the **DMCC Act subscription-contracts regime** (reminder
  notices, easy exit, cooling-off) has been delayed more than once. Law
  firms currently say 2027 (reports differ between January and spring),
  so check before publishing. The cancellation flow should be designed to
  it now.

**Recommended edits:**
- Phase 3 rules: add "- Composite = mean of specificity, cadence_density and capacity_ceiling scores, then −2 if cost is marginal or sentiment is weak (floor 0)."
- Worked example Phase 2: "giving £15 per month margin headroom" → "giving £10.80 per member per month of headroom (£15 revenue less £4.20 cost)".
- Worked example Phase 2: "the comparable Rapha Cycling Club sits at £150 in the UK" → "Rapha Cycling Club sits at £70 a year and Strava at £54.99; Cascadia prices above the range because the group runs are a capacity-limited physical benefit, and says so".
- Before-you-start comparables: "(Strava Premium, Rapha Cycling Club, On Wear-as-a-Service, The Pro's Closet membership)" → "(Strava subscription, Rapha Cycling Club, Zwift, a local club's annual fee)". Verify The Pro's Closet before re-adding it.
- Step 4.1: add "UK: design to the DMCC Act subscription-contract rules (reminder notices, easy exit in one step, cooling-off). Commencement is expected in 2027, so check the date."

## Sources checked (24 Sept 2026)

- AI Max migration: [Search Engine Land](https://searchengineland.com/google-sets-ai-max-migration-timeline-for-search-campaigns-485006), [Gruenberg Digital](https://www.gruenberg-digital.de/en/ki-blog/google-ads-ai-max-automatic-upgrade-september-2026.html)
- Meta view-window removal: [PPC Land](https://ppc.land/meta-restricts-attribution-windows-and-data-retention-in-ads-insights-api/), [Supermetrics docs](https://docs.supermetrics.com/docs/facebook-ads-new-historical-limitations-attribution-window-and-metric-removals-january-12-2026)
- ChatGPT ads UK: [Search Engine Land](https://searchengineland.com/openai-opens-chatgpt-ads-manager-beta-to-uk-advertisers-480679)
- HOKA UTMB title partner: [UTMB](https://utmb.world/news/Hoka-title-partner-announcement)
- 2027 World Mountain & Trail Champs: [World Athletics](https://worldathletics.org/hosting/news/2027-world-mountain-trail-running-championships-cape-town)
- Strava API terms: [Strava press](https://press.strava.com/articles/updates-to-stravas-api-agreement)
- EU AI Act Art. 50: [European Commission FAQ](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)
- DMCC subscriptions: [Taylor Wessing](https://www.taylorwessing.com/en/insights-and-events/insights/2026/04/subscription-contracts), [TLT](https://www.tlt.com/insights-and-events/insight/dmcc-act-subscription-contracts-regime-brought-forward-by-the-pm-what-do-businesses-need-to-know)
- Rapha RCC price: rapha.cc product page (£70.00)
- On Cyclon: [T3](https://www.t3.com/active/running/on-cyclon-initiative-update-0326)
- Klaviyo Flows API (beta): [Klaviyo developers](https://developers.klaviyo.com/en/reference/create_flow)
- TrainingPeaks directory: [trainingpeaks.com/find-a-coach](https://www.trainingpeaks.com/find-a-coach/)
- Reviews used for CEP Stream B: [inov-8 on Trustpilot](https://uk.trustpilot.com/review/www.inov-8.com)

## Applied (24 Sept 2026)

The coordinator added `claude-5.5-opus` to `LENS_MODELS`. The
recommended edits above were then applied, with the exceptions listed
at the end of this section. All 11 playbooks now carry
`models: ["claude-5.5-opus", ...existing]` and `updatedAt: 2026-09-24`.
`npm run build` passed (116 pages, schema valid).

**Live-source checks made before applying:**
- AI Max scope: from 1 September 2026, Search campaigns using
  automatically created assets or campaign-level broad match are
  upgraded; others are not. The search terms report gains AI Max as a
  match type and a source column; brand inclusions and exclusions carry
  over. Sources: [Gruenberg Digital](https://www.gruenberg-digital.de/en/ki-blog/google-ads-ai-max-automatic-upgrade-september-2026.html), [TechWyse](https://www.techwyse.com/news/platform-updates/google-search-campaigns-ai-max-auto-upgrade) (brand inclusions and exclusions carry over, per search-result summary).
- Google Ads report path: Goals, then Attribution, then the Model
  comparison tab ([Google Ads Help](https://support.google.com/google-ads/answer/1722023?hl=en)).
- GA4: conversions renamed key events; property attribution model set in Admin.
- UK Athletics: there is no "CoachHub". The public tool is Find a Coach
  at find-a-coach.myathletics.uk (filters by county, club, event group,
  discipline and licence). British Triathlon has a Coach Finder.
  TrainingPeaks' directory is /find-a-coach. Final Surge's old coach
  lookup redirects to its training-plan marketplace, which lists the coach
  behind each plan.
- DMCC subscription rules: brought forward to January 2027 by the PM's
  announcement on 10 August 2026. They require reminder notices, a 14-day
  cooling-off period (initial and after renewals) and a clearly
  labelled online cancel route ([TLT, 11 Aug 2026](https://www.tlt.com/insights-and-events/insight/dmcc-act-subscription-contracts-regime-brought-forward-by-the-pm-what-do-businesses-need-to-know)).
- Vend is now Lightspeed Retail (X-Series) ([Lightspeed](https://www.lightspeedhq.com/vend/)).

**paid-search-bidding-agent re-run (synthetic data, after fixes).**

The spec after the fixes:
- A revenue target is set per product: margin-adjusted target 0.85
  divided by that product's margin %.
- `target_roas_delta_pct` is positive when the target ROAS goes up,
  which lowers bids.
- Learning phase is capped at ±5% everywhere.
- Queries naming a competitor go to unmappable.

```
Vahla shell review   ideal tROAS 2.94  raw +17.7% -> +15.0%  [cap_15]
Cascadia tees        ideal tROAS 3.19  raw +27.5% -> +15.0%  [cap_15]
Race shorts          ideal tROAS 2.32  raw  -7.3% ->  -5.0%  [learning_phase]
Brand                brand floor held (tROAS never above the brand ceiling of 6.0)
Query mapping        47/50 agree with pre-written key (was 45/50); all 3 misses < 0.7, so reviewed
```

| Gate | Re-run result |
|---|---|
| Eval 1, 2 | NOT TESTABLE (live account) |
| Eval 3: mapping ≥ 90% | PASS (weak, same author for key and mapping): 94% |
| Eval 4: brand floor | PASS |
| Eval 5: learning ±5% | PASS. The spec conflict is removed and the prompt and Step 4.1 now agree |

The worked example was rewritten to what the formula actually produces:
- Shorts: bids rise, held to 5% during learning.
- Tees: target ROAS rises 15%.
- Shells: move with tees, because their margin % is similar.

Verdict after the fixes: **PASS-WITH-NOTES**, so `claude-5.5-opus` was
added to its frontmatter.

**Files changed:**
- The 11 playbooks in `src/content/lens/demand/`.
- `lens-skills/category-entry-points/SKILL.md` (v0.1.1): removed the
  JSON comment, added the composite weights.
- `lens-skills/lifecycle-journey-builder/SKILL.md` (v0.1.1): six named
  rubric checks, recounting, embeddings-based similarity, build spec
  wording.
- `public/lens/templates/ambassador-selection-scorecard.csv`: new
  composites and the decline reason. The comma-containing fields are
  now quoted; they previously split into extra columns.
- `public/lens/templates/coach-tier-roster.csv`: quoted fields, and
  Saoirse's seeded count changed from 9 to 22 to match the worked
  example.

**Applied differently from the recommendation, and why:**
- Attribution `most_plausible_source`: standardised on "none, needs
  test" (commas) rather than the em-dash form, to match house style.
- Race-day shoot moved to 17 to 19 June (backup 1 to 3 July), not
  24 to 26 June. Beth races Lavaredo on 25 June in the event playbook.
  Tier 1 briefs changed from six to five after dropping the World
  Championships.
- Event sponsorship Lavaredo: the fee was raised to £55k, and the
  renewal was changed from "upgrade to Tier A category-exclusive" to
  "renew flat, multi-year". Headline is barred by the playbook's own
  ceiling score of 7.
- Subscription group runs: under the new composite formula they score
  6.3, which is "redesign". The worked example now says so, instead of
  "ship", and ties it to the fifth event added at the Q1 review. The
  "cut" example threshold changed from below 6 to below 5, to match the rule.
- Coach Tier A menu: set to "typically 12 to 16" samples per quarter to
  match the worked example and CSV, rather than a flat 12.

**Not applied:**
- Race-day: no statement about Meta Advantage+ or Meta bid-control
  names. I didn't verify these in this session, so the prompt now asks
  generically for "platform automated-audience settings" and
  "platform bid or cost cap".
- Ambassador: no ASA/CAP reference; not verified this session. The EU
  AI Act Art. 50(4) line was verified and is in.
- Subscription: Zwift and The Pro's Closet were not added as
  comparables, because their prices weren't verified.
- Paid search: no ChatGPT ads hand-off line. It was verified, but it's
  outside the bidding agent's scope. The line went into race-day's paid
  programme prompt instead.
- Direct-to-coach: the month-one direct conversion (63%) was left as it
  is. It's plausible for a first cohort, and changing it would be
  invention.
- Channel mix: `preview: true` was left as it is. That's a publishing
  choice, not an error.
- Existing em dashes inside the two SKILL.md files were left, because
  the skills use them as their list-item separator throughout. None of
  the new text adds one to the playbooks. Two edited skill lines keep
  their original em-dash separator.
