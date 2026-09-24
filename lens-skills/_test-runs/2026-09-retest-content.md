# Content stack retest, Claude Opus 5.5, 24 September 2026

> Note, 24 Sept 2026: training-content-engine was retired from The Lens after this retest. Its section is kept for the record.

A retest of the nine content playbooks in `src/content/lens/content/`
(and their paired skills in `lens-skills/`) against Claude Opus 5.5
(`claude-opus-5-5`). Each playbook's copy-paste prompts were run in order
on a realistic input, and the output was scored gate by gate against the
playbook's own evals, quality checks and failure modes.

## How this was run, and what it can't tell you

- **Model.** Every prompt was run by Opus 5.5 inside Claude Code sessions,
  one per playbook. There was no separate API call per prompt, no
  temperature control and no provider structured-output mode. Where a gate
  needs a grader, the grader was a fresh Opus 5.5 subagent that could not
  see what had been planted, which is the same model family grading itself,
  not an independent grader. Nothing was tested on GPT or Gemini.
- **Real input where the playbook needs it.** Live OpenAI and DeepMind
  feeds (17 to 23 Sept 2026) for the news pipeline. Real journalist
  articles from August and September 2026 for the pitch generator (no
  contact details collected, nothing sent). The 2026 UCI Road Worlds elite
  men's time trial (Montréal, 20 Sept 2026) from four press sources for the
  race-result engine. A real WebSearch SERP proxy for "trail running shoes"
  queries (US-located, not a Google UK export). Real sports-science papers
  (Seiler 2010, Stöggl and Sperlich 2014, Foster 2001, Vernillo 2017) for
  citation checks. HeyGen's changelog and help centre for API status.
- **Synthetic input, labelled.** The playbooks' own Cascadia Endurance
  worked examples (fictional brand and athletes), voice profiles, rubrics,
  keyword volumes (no Ahrefs, Semrush or GSC access), seeded defect drafts
  and journalist replies.
- **Counting by script.** Word counts, character limits, similarity scores,
  banned-phrase scans and rubric checks were done in Python, not by the
  model. The scripts are in the session scratchpad and are not committed.
- **Not testable here.** Image and video renders, HeyGen submission,
  embeddings-based gates, anything needing published posts, engagement data,
  a DAM, a live timing feed, 30 to 90 days of elapsed time, or a human
  reviewer (coach, editor, reading aloud). These are marked NOT TESTABLE.
  Every run was prompt-level: nothing was wired to a scheduler, CMS or API.

## Summary

| Playbook | Verdict | Gates passed / tested | Key note |
|---|---|---|---|
| ai-studio-news-pipeline | PASS-WITH-NOTES | 14 / 15 (7 not testable) | Triage and drafting work on real Sept 2026 releases. Two of three Phase 1 feed URLs were broken, the worked example broke its own 75-character line-1 rule, and the skill spelt the triage labels differently. |
| earned-media-pitch-generator | PASS-WITH-NOTES | 7 / 9 (1 not testable) | Validator and reference-accuracy gate hold, and Opus flagged a beat mismatch unprompted. The playbook's own sample pitch was 131 words against a 130 cap, the 30-day recency rule was never enforced, and the spray-check metric was unnamed. |
| eval-gated-drafting | FAIL as written (fixed, see Applied) | 5 / 7 (3 not testable) | Gate 2 passed a draft containing a fabricated "68%" statistic and a misquoted figure. The voice, structural, brief and repair steps all worked. |
| race-result-content-engine | PASS-WITH-NOTES | 8 / 8 (5 not testable) | Fact-check caught 4 of 5 planted errors, but it checks the draft against the feed, not the feed against reality: real sources swapped 6th and 7th. The worked example and public CSV gave invented 2026 results to real athletes. |
| segment-broll-production | PASS-WITH-NOTES | 13 / 15 (5 not testable) | Planning prompts are solid. Applied strictly, the rules refuse the worked example's own S012 rain variant, Phase 3 has no archive input, and the tool line needed updating for the Sora API shutdown. |
| seo-cluster-generator | PASS-WITH-NOTES | 6 / 6 (2 not testable) | All four prompts run cleanly and Opus refused to pad a thin cluster. The playbook called itself "GEO-aware" with no AI-search step, and its only hook test was the Google top 10. |
| social-content-factory | PASS-WITH-NOTES | 9 / 12 (4 not testable) | Every channel prompt met its rules first time. The similarity gate named no metric, the worked example failed its own LinkedIn gate, the skill added CTAs the playbook bans, and the hashtag rule predated Instagram's 5-tag cap. |
| training-content-engine | PASS-WITH-NOTES | 9 / 10 (4 not testable) | The credibility gate only checked that a source was on the approved list, so it passed two misrepresented citations (Seiler, Stöggl). The Eval 2 manual source check caught them. |
| video-script-system | PASS-WITH-NOTES | 11 / 11 (3 not testable) | All six playbook prompts pass their gates. The paired HeyGen skill calls v1/v2 endpoints that HeyGen supports only through 31 Oct 2026, and its pricing notes and word-count targets were stale or contradictory. |

**Cross-cutting.** All nine playbooks listed only 4.5-era model ids in
`models:`. That field is validated against `LENS_MODELS` in
`src/content.config.ts`, which now includes `claude-5.5-opus`, so the
frontmatter could be updated without a schema change. GPT and Gemini
entries were kept but not retested. None of the nine playbooks routed work
to Sora, Veo or Midjourney. Only segment-broll-production named a video
tool path that could touch Sora (via Higgsfield).

## AI studio news pipeline to LinkedIn content (`ai-studio-news-pipeline.md`)
**Verdict:** PASS-WITH-NOTES  
**Gates:** 14 passed / 15 tested (7 not testable)  
**Key note:** The triage and drafting prompts work well on Opus 5.5 against real September 2026 releases, but two of the three Phase 1 feed URLs no longer work as written, the `models:` frontmatter is stale, and the worked example breaks the playbook's own 75-character line-1 rule.  
**Paired skill:** `lens-skills/ai-studio-news-watch/SKILL.md`  
**Inputs used:**
- Real: OpenAI news RSS, pulled live on 24 Sept 2026 (https://openai.com/news/rss.xml). This returned 22 items from 17 to 23 Sept, including "Introducing GPT-6 Sol and Luna" and "Better prompt caching for GPT-6" (22 Sept).
- Real: Google DeepMind blog RSS, pulled live (https://deepmind.google/blog/rss.xml). Items included Gemini 3.8 text-to-speech and Private AI Compute (23 Sept).
- Real: GPT-6 Sol model page (https://developers.openai.com/api/docs/models/gpt-6-sol), with pricing, context and the surcharge above 272K tokens.
- Real: Unite.AI coverage of the Sol/Luna launch, used for the GPT-5.6 Sol prices and Luna's positioning (https://www.unite.ai/openai-introduces-gpt-6-sol-and-luna-with-50-lower-api-prices/).
- Real: ElevenLabs changelog, 23 Sept (https://elevenlabs.io/docs/changelog/2026/9/23). It covers the Sora API ending on 24 Sept 2026 and Seedance 1.5 Pro retiring on 11 Nov.
- Real: Claude Opus 5.5 launch coverage (https://techcrunch.com/2026/09/22/anthropic-releases-opus-5-5-with-lower-prices-and-fable-level-performance/, https://www.macrumors.com/2026/09/22/anthropic-claude-opus-5-5/).
- Real, secondary source: xAI Grok 4.7 on 21 Sept, from a release tracker (https://www.digitalapplied.com/blog/ai-model-releases-september-2026-tracker).
- Real: ElevenLabs models page for the `eleven_v3` check (https://elevenlabs.io/docs/overview/models).
- Failed fetch: the OpenAI Sora discontinuation help article returned HTTP 403, so the Sora date comes from the ElevenLabs changelog and search results instead.
- Synthetic, clearly labelled: the Manual Focus voice profile, POV note and audience note. Audience: senior marketing leads at UK endurance and sport brands. Category: endurance and sports marketing. POV: AI is leverage for senior operators, and discipline beats speed.

**Test depth:** Prompt-level only. I hand-built a 13-row ledger from live feeds and ran the Phase 2 triage prompt and the Phase 3 drafting prompt on Opus 5.5. I then ran the Step 3.2 claim check against the fetched pages and prepared the Phase 4 audio text and API body. Nothing was actually wired up: no feed reader, no scheduled polling, no ElevenLabs or Higgsfield render, no LinkedIn scheduling and no engagement data. GPT and Gemini were not tested.

### Gate results
| Gate | Result | Evidence |
|---|---|---|
| Phase 1 checkpoint: the feeds surface releases into the ledger | FAIL | Of the three URLs as written, only one works. `openai.com/news` returns 403 to non-browser clients, and the working feed is `/news/rss.xml`, which is RSS rather than Atom. `anthropic.com/rss.xml` returns 404 and the news page has no RSS link. `deepmind.google/discover` redirects (301) to `/about`. The working DeepMind feed is `deepmind.google/blog/rss.xml`. |
| Triage: valid JSON, one of four labels plus a rationale for each row | PASS | All 13 rows came back as valid JSON: 3 headline, 4 worth_a_beat, 1 industry_signal, 5 noise. |
| Triage: "Default to noise if uncertain" | PASS | OpenAI customer stories (Harvey, Higgsfield, invideo), Academy posts and policy remarks all went to noise. None were upgraded. |
| Triage: needs_human_review flagged correctly | PASS | Three rows were flagged where the brand has no prior posts: Gemini 3.8 TTS, Seedance deprecation and ChatGPT Ads regional expansion. |
| Step 2.2: shortlist of 3 to 5 | PASS | Three headline items (GPT-6 Sol/Luna, Opus 5.5, Sora API shutdown) plus a four-item digest. |
| Draft rule: line 1 under 75 characters, plain English, no tease | PASS | Line 1 is 55 characters: "OpenAI's new GPT-6 Sol costs half what GPT-5.6 Sol did." |
| Draft rule: a specific number in the first paragraph | PASS | $2/$10 against $4/$20 per million tokens, and a 1,050,000-token context window. |
| Phase 5.1 audience-specific check | PASS | The endurance-specific paragraph covers a race-weekend results pipeline, athlete stories, regional press notes and seasonal product descriptions. |
| Phase 5.1 honest-limitation check | PASS | Names the 2x input / 1.5x output surcharge above 272K tokens, and says "We have not run Sol on client work yet". |
| Draft rule: close is not a question, and no over-claiming | PASS | Closes on "Cheaper tokens only help if the eval gates stay in place." The untested status is stated. |
| Draft rule: under 200 words, no !, em dash or ; | PASS | 162 words. A script check found zero exclamation marks, em dashes and semicolons. |
| Step 3.2 claim check: every claim has a source link | PASS | Six claims, each mapped to a URL. One unsourced phrase ("mid-tier") was caught and removed before the final draft. |
| Eval 2: claim accuracy at 100% | PASS | Every figure was checked against the pages I actually fetched (the model page, Unite.AI and OpenAI RSS). The fact-check also changed the take: OpenAI positions Luna, not Sol, for high-volume jobs, so the paragraph was corrected. |
| Failure mode: cheerleading drift | PASS | The draft names a cost trap and states it is untested. There is no hype language. |
| Failure mode: synthetic voice without disclosure | PASS (prompt level) | The audio script ends with the line "This post was read by a synthetic voice." The `eleven_v3` request body was built with valid settings (stability 0.5, similarity 0.75, under the 5,000-character v3 limit). |
| Phase 5.1 voice rubric at 10 of 12 or higher | NOT TESTABLE | There is no Manual Focus rubric JSON in the repo. The 12-check rubric only exists as a method in `brand-voice-extraction.md`. |
| Eval 1: time-to-post under 48 hours | NOT TESTABLE | Nothing was published. The draft was ready about 48 hours after the 22 Sept release. The Sora item comes due today (24 Sept). |
| Eval 3: POV distinctiveness (quarterly, 10 posts) | NOT TESTABLE | Needs a quarter of published posts. |
| Eval 4: engagement health | NOT TESTABLE | No LinkedIn data. |
| Eval 5: aging well at 90 days | NOT TESTABLE | Needs time to pass. |
| Failure mode: studio-news monoculture (30 to 40% cap) | NOT TESTABLE | Needs a posting calendar. |
| Phase 4 audio and video render | NOT TESTABLE | No ElevenLabs or Higgsfield key. Only the script and request payload were produced. |

### Evidence excerpt
```
[triage, 4 of 13 rows]
{"release_id":"L1","classification":"headline","rationale":"New GPT-6 variants at half the prior per-token price.","marketer_implication":"Automated content pipelines on OpenAI cost roughly half what they did last week.","needs_human_review":false}
{"release_id":"L4","classification":"headline","rationale":"Deprecation of a widely used video model, effective 24 Sept.","marketer_implication":"Any Sora-based video template or Flow stops generating today and needs a replacement model.","needs_human_review":false}
{"release_id":"L6","classification":"worth_a_beat","rationale":"New Gemini 3.8 TTS model, a possible alternative for audio demos.","marketer_implication":"A second route for narrated post versions besides ElevenLabs.","needs_human_review":true}
{"release_id":"L9","classification":"noise","rationale":"Customer case study (Harvey on GPT-6 Astra), not a release.","marketer_implication":"None.","needs_human_review":false}

[draft, post_body excerpt]
OpenAI's new GPT-6 Sol costs half what GPT-5.6 Sol did.
GPT-6 Sol, released 22 September, is priced at $2 per million input tokens and $10 per million output, against $4 and $20 for GPT-5.6 Sol. ...
The caveat sits in the pricing page. Requests over 272K tokens pay double on input and 1.5x on output, so the headline window is not the cheap window. ... We have not run Sol on client work yet, so this is a read of the documentation, not a verdict on output quality.
Cheaper tokens only help if the eval gates stay in place.
[claim_check] 6 claims -> developers.openai.com/api/docs/models/gpt-6-sol (x4), unite.ai (x1), openai.com/news/rss.xml (x1)
```

### Behaved differently / stale references
- **Claim check changed the take, not just the wording.** In the first draft, the "what this means" paragraph put bulk product-description rewrites on Sol. The source shows OpenAI positions Luna for "focused, high-volume tasks", so I rewrote the paragraph. The playbook frames the claim check as removing unsourced claims. In practice it can also flip the marketer implication, and the playbook should say to re-read the implication paragraph after the check.
- **The triage prompt carries no source-quality field.** Two ledger rows (Opus 5.5 and Grok 4.7) arrived only via press or a tracker, not a studio feed. Triage labelled them headline and worth_a_beat without flagging that they had no primary source. Step 3.2 catches this later, but a `primary_source` field at triage would catch it earlier.
- **Drafting on the running model.** I deliberately drafted on GPT-6 Sol rather than Opus 5.5, because the test model is Opus 5.5 and a "tested by us" claim would be circular. Worth noting for anyone repeating this retest.
- **The worked example fails the playbook's own rules.** The line 193 example opens with a 131-character line 1 against a 75-character rule. Line 203 says "Three claims" while the post makes at least four: 1M context, 38%, flat pricing, and "maintaining grounding". The last of these also implies hands-on testing, which the post never states.
- **Stale:** the frontmatter `models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]`. Current models are Claude Opus 5.5 (22 Sept 2026) and GPT-6 Astra/Sol/Luna (Sept 2026). The field is enum-locked in `src/content.config.ts` (`LENS_MODELS`, line ~66), so fixing it needs a schema change first. That change affects all 46 Lens playbooks, which all use 4.5-era ids.
- **Stale:** the Phase 1 feed URLs (see the gate table). Anthropic has no official RSS feed, so the "(RSS)" label is wrong.
- **Still current, checked:** `eleven_v3` is still ElevenLabs' flagship TTS model id, and stability 0.5 / similarity 0.75 is a valid request. Higgsfield is active (it appears in OpenAI's own 21 Sept customer story). Runway, Midjourney and Black Forest Labs are only named as sources, which is fine. The playbook never routes video demos to Sora, so the 24 Sept Sora API shutdown breaks nothing here. The shutdown is itself a headline item for this week's run. Gemini Omni (the ElevenLabs changelog names Gemini Omni 1.1 Flash as a Sora replacement) could be added as a video-demo option, but this is optional.
- **LinkedIn native audio:** Step 4.1 already hedges with "if the platform supports it". I did not verify LinkedIn support. The sound-on video fallback is the realistic path.
- **Playbook and skill inconsistencies:**
  1. The label spelling differs: `worth_a_beat` / `industry_signal` in the playbook versus `worth-a-beat` / `industry-signal` in the skill. Any shared ledger parser will break on this.
  2. The triage schemas differ. The playbook is batch JSON with `needs_human_review`. The skill works per item with `marketing_relevance`, `category_relevance` and `post_priority` scores, and has no human-review flag.
  3. The skill's drafting rules drop the playbook's "No exclamation marks. No em dashes. No semicolons in prose." The skill's own audio pseudocode then uses an em dash and hardcodes "Manual Focus".
  4. The skill has a Brevity gate and requires `limitation_named`. The playbook's Phase 5.1 has neither.
  5. The skill's `claim_check` allows `"tested-by-us"` as a source. The playbook requires a URL from the sources.
  6. The skill says human review can taper to spot-checks after 30 posts. The playbook requires a daily human confirm with no taper.
  7. The default watchlists differ. The skill adds Meta AI, Mistral, Pika and Suno. The playbook adds Hugging Face.

### Recommended edits
1. `src/content/lens/content/ai-studio-news-pipeline.md` line 10: "models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]" → "models: ["claude-5.5-opus", "gpt-6"]". This first needs `'claude-5.5-opus'` and `'gpt-6'` added to `LENS_MODELS` in `src/content.config.ts` line ~66, otherwise the build fails schema validation.
2. `src/content/lens/content/ai-studio-news-pipeline.md` line 55: "- OpenAI, https://openai.com/news (Atom)" → "- OpenAI, https://openai.com/news/rss.xml (RSS)"
3. `src/content/lens/content/ai-studio-news-pipeline.md` line 56: "- Anthropic, https://www.anthropic.com/news (RSS)" → "- Anthropic, https://www.anthropic.com/news (no official feed, scrape the page or use a serverless job)"
4. `src/content/lens/content/ai-studio-news-pipeline.md` line 57: "- Google DeepMind, https://deepmind.google/discover (manual scrape or a serverless job)" → "- Google DeepMind, https://deepmind.google/blog/rss.xml (RSS)"
5. `src/content/lens/content/ai-studio-news-pipeline.md` line 193: "> Anthropic shipped Claude Opus 4.7 today with a 1M context window and a 38% reduction in hallucination on the long-context eval set." → "> Claude Opus 4.7 is out with a 1M context window.\n>\n> Anthropic reports a 38% reduction in hallucination on its long-context eval set."
6. `src/content/lens/content/ai-studio-news-pipeline.md` line 203: "> **Claim check.** Three claims, all referenced to the Anthropic release notes." → "> **Claim check.** Four claims, all referenced to the Anthropic release notes."
7. `src/content/lens/content/ai-studio-news-pipeline.md` line 259: "- Honest-limitation check, the post names at least one caveat" → "- Honest-limitation check, the post names at least one caveat\n- Brevity check, 200 words or fewer" (aligns with the skill's Brevity gate)
8. `src/content/lens/content/ai-studio-news-pipeline.md` line 187: "Claims with no source either get sourced (the team adds the link) or get removed." → "Claims with no source either get sourced (the team adds the link) or get removed. Then re-read the marketer paragraph, because a corrected fact can change the implication."
9. `lens-skills/ai-studio-news-watch/SKILL.md` line 79: `"label": "<headline|worth-a-beat|industry-signal|noise>",` → `"label": "<headline|worth_a_beat|industry_signal|noise>",` (matches the playbook's label spelling, plus the matching hyphenated words on lines 57 to 67)
10. `lens-skills/ai-studio-news-watch/SKILL.md` line 116: "- Do not over-claim. If you haven't tested, say so." → "- Do not over-claim. If you haven't tested, say so.\n- No exclamation marks. No em dashes. No semicolons in prose."
11. `lens-skills/ai-studio-news-watch/SKILL.md` lines 147 to 148: `audio_text = strip_hashtags(post_body) + " — Manual Focus, synthetic` / `voice for accessibility"` → `audio_text = strip_hashtags(post_body) + ". Read by {BRAND}'s synthetic` / `voice for accessibility."`

## Earned-media pitch generator with journalist matching (`earned-media-pitch-generator.md`)
**Verdict:** PASS-WITH-NOTES  
**Gates:** 7 passed / 9 tested (1 not testable)  
**Key note:** All seven prompts run unchanged on Opus 5.5 and the core gates hold, but the playbook's own sample pitch breaks its 130-word gate (131), the 30-day recency "quality gate" is never enforced in the matching prompt, and the spray-check metric is unspecified.  
**Paired skill:** `lens-skills/earned-media-pitch/SKILL.md`  
**Inputs used:**
- Synthetic (labelled): the playbook's own Cascadia Endurance story brief (412-runner survey, 64% chose a regional race, Marcus Hale spokesperson), plus an embargo date of 7 Oct 2026 I added. Cascadia is a fictional brand.
- Synthetic (labelled): a deliberately weak brief ("Cascadia launches a new colourway of its trail shoe"), used to test the Phase 1 gate.
- Real: Jessy Carveth, Marathon Handbook, "American Running Is Booming at the Top and the Bottom. The Mid-Size Race Is Stuck in Between.", 1 Aug 2026. https://marathonhandbook.com/running-boom-mid-size-races/ (byline, date and central-argument quote confirmed in two separate WebFetch passes. Direct curl returned a 403 bot wall, so I did not work around it.)
- Real, used to cross-check Carveth's figures: RunSignup, "2026 Midyear Race Trends Update", 22 Jun 2026. https://info.runsignup.com/2026/06/22/2026-midyear-race-trends-update/ (5.9% overall, under 500: 6.6%, 501–1,000: 4.0%, 1,001–5,000: 5.3%, 5,001+: 8.2%)
- Real: Evie Nichols, Live for the Outdoors, "Who will win the 2026 UTMB? Here are some of the top contenders", 27 Aug 2026. https://www.livefortheoutdoors.com/trail-running/news/who-will-win-the-2026-utmb/
- Real: Justin Mock, iRunFar, "This Week In Running: September 21, 2026". https://www.irunfar.com/this-week-in-running-september-21-2026
- Real (negative test): JoinTheRun, "Trail & Ultra Running in 2026", no byline, 6 Jan 2026. https://jointherun.uk/trail-ultra-running-in-2026/
- Synthetic (labelled): new-information input for day 4 (Scottish cut: 71% regional), alternative angle for day 11 (women 41% of entrants, 72% regional against 58% of men, which reconciles to the 64% overall), and five journalist replies for the classifier.
- No contact details were collected and nothing was sent. Drafting only.

**Test depth:** Prompt-level only. I ran every prompt once on Opus 5.5 (validator twice, classifier on five replies), acting as the model inside this session rather than through the API with structured-output mode. Journalist sourcing was a manual Google-News-style web search of 4 candidates, not a 60–200 Muck Rack universe. Evals 2–4 used a deterministic Python script. Eval 1 checked 2 references, not the 20 the playbook asks for. No sends, no opens, no ledger. GPT and Gemini were not tested.

### Gate results
| Gate | Result | Evidence |
|---|---|---|
| Phase 1 story-quality validator | PASS | The Cascadia brief returned `pass` (4/4, with `missing_inputs` asking for a definition of "regional race"). The colourway brief returned `fail` on C1 and C3, so drafting stopped. |
| Eval 1, reference accuracy (100%) | PASS | 2/2 references correct after review. My first Nichols draft added an intensifier the source does not support ("more open than it had been in years"). The check caught it and I changed it to "left wide open". The gate works, but raw output is not safe to send without it. |
| Eval 2, banned phrases (zero hits) | PASS | Script scan of 2 pitches, the control and 2 follow-ups: 0 hits. |
| Eval 3, word count (body under 130, subject under 60) | PASS | Carveth 125 words / 40-char subject. Nichols 110 / 52. Day-4 follow-up 63 words (limit 70), day-11 77 (limit 80). |
| Eval 3 applied to the playbook's own "Expect output like" pitch | FAIL | The sample body counts 131 words by whitespace, so the playbook's own example breaks its hard gate. |
| Eval 4, spray check (pairwise under 0.85) | PASS | Carveth and Nichols pitches: 0.70 bag-of-words cosine. A cosmetic control (only the opener swapped) scored 0.88 cosine, which the gate catches, but only 0.79 on difflib, which it misses. The result depends on the metric, and the playbook does not name one. |
| Eval 5, decline-detection precision | PASS | 5 synthetic replies. "Not for me right now, but keep me posted" was classed `decline` / suppress (conservative, as the rule wants). "Not my beat, try our features desk" became `decline` / suppress, so the referral is lost because there is no referral class. The OOO, question and accept replies all routed correctly. The monthly audit was not testable. |
| 30-day in-beat recency gate (failure modes, line ~445) | FAIL | The matching prompt only lowers `recency_score` and has no verdict rule. Carveth's last in-beat piece was 54 days old (recency 4/10), yet she still scored composite 7.1 and got `pitch`. The composite formula is unspecified, so the verdict is the model's judgement. |
| Follow-up rules (new info only, no "bump", last touch promises nothing further) | PASS | Day 4 adds only the Scottish cut. Day 11 is a genuinely different angle (who marquee races are built for) and says "my last note on it". |
| Embargo abuse (same story offered as embargo to 10+) | NOT TESTABLE | No prompt or step counts embargo offers across the list, so nothing enforces this rule. There were only 2 drafts. |

### Evidence excerpt
```
Step 3.2 (trimmed):
{"name":"Jessy Carveth","outlet":"Marathon Handbook","beat_fit_score":6,"angle_fit_score":9,
 "recency_score":4,"tone_fit_score":8,"composite_fit_score":7.1,"verdict":"pitch", ...}
{"name":"Evie Nichols","outlet":"Live for the Outdoors","beat_fit_score":8,"angle_fit_score":3,
 "recency_score":9,"tone_fit_score":6,"composite_fit_score":5.4,"verdict":"hold", ...}
{"name":"(no byline)","outlet":"JoinTheRun","composite_fit_score":2.0,"verdict":"skip", ...}

Step 4.1, subject: UK ultras: the small end of your barbell
Your 1 August piece argued that the mid-size regional race is too big to run on goodwill
and too small to sell on its name, with RunSignup's first-half numbers showing the boom as
a barbell. We see the small end of that barbell in UK and European ultras.
Cascadia Endurance surveyed 412 new ultra entrants across 2025 and 2026. 64% picked a
regional race, not a marquee event, for their first 50k or longer. [...] yours under
embargo until 7 October, with 30 minutes with our head coach, Marcus Hale [...]
checks: opens_with_specific_reference=true, word_count=125, banned_phrases_present=false
```

### Behaved differently / stale references
- **Opus 5.5 was stricter than the playbook predicts in two places.** Unprompted, it flagged a geography and format mismatch (Carveth covers US road races, while the story is about UK and EU ultras) and worded the pitch so it does not claim her data covers ultras. It also asked for a definition of "regional race" at Phase 1. Neither schema has a field for these caveats, so they only survive as prose.
- **The playbook's worst failure mode still happens, in a milder form.** The model did not invent an article, but it did embellish a real one. Keep Eval 1 as a hard human gate.
- **The composite score is undefined.** An unweighted mean would give Justin Mock (a results round-up, angle fit 3) 7.0 and a `pitch`. I weighted angle more heavily, so he scored 5.6 and `hold`. The verdict can't be reproduced across runs or models.
- **The Phase 1 rules leave a gap.** "Fail if C1 or C3 fails" and "conditional if 3 of 4 pass" leave the case where C1 and C3 pass but both C2 and C4 fail without a verdict.
- **The playbook and the skill disagree:**
  - Scoring scale: the skill scores beat and angle fit 0–5, the playbook 0–10.
  - Recency: the skill's "Recency" line merges two different rules ("written about the brand or category in the last 14 days") and never mentions the 30-day in-beat rule.
  - List size: the skill says top 20–40, the playbook 15–40.
  - Weak stories: the skill says "push back once... if they insist, document the risk" (line 26) but "push back hard. Better to refuse the engagement" (line 142). The playbook says refuse to draft.
  - Missing from the skill: the Phase 1 validator, the adjacent-beat prompt, the day-4 and day-11 prompts, the reply-classifier prompt and Eval 5.
- **Stale:** frontmatter `models: ["claude-4.5-opus", "gpt-5"]`. `LENS_MODELS` in `src/content.config.ts` (lines 66–77) has no current Claude ID, so the schema needs updating before the frontmatter can change. This affects the whole site: the same stale list appears in about 46 playbooks. The body text ("A frontier model (Claude Opus, GPT or Gemini Pro tier)") does not date. The playbook makes no Sora, Veo, Midjourney, image-model or GEO claims. Every hand-off target exists. I did not re-verify whether Muck Rack, Cision, Mailshake and Lemlist are still current.

### Recommended edits
1. `src/content.config.ts` line ~69: "  'claude-4.5-opus'," → "  'claude-4.5-opus',\n  'claude-opus-5-5',". This is a prerequisite for edit 2 and applies site-wide.
2. `src/content/lens/content/earned-media-pitch-generator.md` line 10: "models: [\"claude-4.5-opus\", \"gpt-5\"]" → "models: [\"claude-opus-5-5\", \"gpt-5\"]". GPT was not retested, so keep or drop `gpt-5` on your own evidence.
3. `earned-media-pitch-generator.md` line 278: "not in the marquee races. That is the gap our data fills." → "not in the marquee races." This brings the sample body to 124 words.
4. `earned-media-pitch-generator.md` line 90: "- \"conditional\" if 3 of 4 pass. Fix the gap and re-run." → "- \"conditional\" if C1 and C3 pass but C2 or C4 fails. Fix the gap and re-run."
5. `earned-media-pitch-generator.md` line 176: "\"composite_fit_score\": <0-10>," → "\"composite_fit_score\": <0-10, (beat + 2 x angle + recency + tone) / 5>,"
6. `earned-media-pitch-generator.md` line 192: "  beats older than 30 days." → "  beats older than 30 days. If the last in-beat article is over 30\n  days old, verdict cannot be \"pitch\"."
7. `earned-media-pitch-generator.md` line 291: "Across all drafted pitches, compute pairwise textual similarity." → "Across all drafted pitches, compute pairwise cosine similarity (TF-IDF or embeddings, not a character diff, which under-scores cosmetic personalisation)."
8. `earned-media-pitch-generator.md` line 203: "Above 40 the personalisation quality drops." → "Above 40 the personalisation quality drops. If the embargo flag is set and the list exceeds 10, drop the embargo framing or cut the list (see Embargo abuse)."
9. `lens-skills/earned-media-pitch/SKILL.md` line 44: "how directly relevant (0–5)" → "how directly relevant (0–10)". Line 45: "this story offers (0–5)" → "this story offers (0–10)".
10. `SKILL.md` line 46: "- **Recency** — have they written about the brand or category in the last 14 days? If yes, deprioritise unless this is a follow-up" → "- **Recency** — last in-beat article within 30 days, or hold not pitch. If they covered the brand in the last 14 days, hold unless this is a follow-up".
11. `SKILL.md` line 26: "Push back once if the user is pitching a thin story; if they insist, document the risk in the deliverable." → "If the story fails, stop and say why; do not draft personalised pitches until the brief is fixed and passes."
12. `SKILL.md` line 121: "top 20–40 matches with scores" → "top 15–40 matches with scores (15–25 focused, 30–40 high-volume)".
13. `SKILL.md` after line 136 add: "- **Decline-detection precision** — any reply that could be a decline suppresses the sequence; audit monthly".

## Eval-gated drafting pipeline (`eval-gated-drafting.md`)
**Verdict:** PASS-WITH-NOTES  
**Gates:** 5 passed / 7 tested (3 not testable)  
**Key note:** The voice, structural, brief and repair steps work on Opus 5.5, but Gate 2 (fact grounding) passed a draft with a made-up statistic in it, so it has to be fixed before the "objective gates" promise holds.  
**Paired skill:** `lens-skills/eval-gated-drafting/SKILL.md`  
**Inputs used:**
- Synthetic: the Cascadia Endurance "How to choose trail running shoes" brief, modelled on the playbook's own worked example, with six invented sources: wear-panel stats S1a to S1d, coach notes S2 and the Vahla spec sheet S3. The target is 650 words ±10% (585 to 715) and the brief has three internal links and the playbook's banned-phrase list.
- Synthetic: a deliberately broken brief. It has no facts, pillar, buyer stage, banned phrases or links, and its generic hook ("We have expert insight and real data") nearly repeats a sibling page's hook.
- Synthetic: a 12-check voice rubric that copies the example table in `brand-voice-extraction.md` (sentence-length range, no em dashes, semicolons or exclamation marks, "you" used more than "we", Flesch-Kincaid grade 7 to 10 and so on).
- Synthetic seeded draft: a clean Stage 2 draft with seven planted defects. They are the banned word "epic", one em dash, one exclamation mark, a silent unsupported claim ("Research shows 68% of UK trail runners…") left out of the drafter's claims_list, a misquoted source figure (60% where S1c says 40%) still tagged S1c, a 90-word paragraph, and the primary keyword taken out of the intro.
- No real-world sources were used. Gate 3 needs a live top-20 SERP and an embeddings API. Neither was available, and I did not try to fake them.

**Test depth:** Prompt-level only, all on Opus 5.5. I ran the drafting prompt and wrote the seeded defects myself. The brief validator, both versions of the Gate 2 prompt and the repair prompt each ran in a fresh Opus 5.5 subagent that could not see the clean draft or know what had been seeded. That is the same model grading its own family, not a separate grader model. Gates 1 and 4 ran as a real deterministic Python script (`scratchpad/retest/egd/gates.py`). There was one repair cycle. No GPT or Gemini testing.

### Gate results
| Gate | Result | Evidence |
|---|---|---|
| Stage 1 brief validator | PASS | The good brief passed with no weak fields. The broken brief failed with 6 missing fields, and its hook was flagged as generic and a near-copy of the `/trail/best-trail-shoes-2026` hook. One false positive: `editorial_slug` was listed as missing, although line 54 treats it as "or" with the target query. |
| Stage 2 drafting rules (length, links, banned phrases, punctuation) | PASS | The clean draft is 597 body words, inside the 585 to 715 band. It has all 3 internal links, 0 banned phrases, 0 em dashes, 0 semicolons and 0 exclamation marks. |
| Eval 1 voice rubric (at least 10 of 12) | PASS | Clean draft 11/12. Seeded draft 8/12, catching all three planted voice defects (C5 em dash, C7 exclamation mark, C10 "epic"). Repaired draft 12/12. C11 (parallel structure) could only be scripted as a rough proxy. |
| Eval 2 fact grounded, playbook version (grades the claims_list) | FAIL | The planted 68% statistic was not in the drafter's claims_list, so the grader never saw it. The misquoted 60% was marked `supported:false` but still counted toward the pass rate. Verdict 8/8, pass. The fabricated claim got through. |
| Eval 2 fact grounded, skill version (grades the full draft) | FAIL | Both planted claims were caught (68% as `null`, 60% as `supported:false`). The verdict was still 20/20 "pass", because the criterion counts flagged claims as passing. It surfaces problems but never fails the draft. |
| Eval 3 originality (max cosine below 0.75 vs top 20) | NOT TESTABLE | No embeddings API and no SERP snapshot in this environment. |
| Eval 4 structural | PASS | Clean draft passed every sub-check. Seeded draft failed "no paragraph over 75 words" (90 words) and "keyword in the first 100 words" (missing). The "original example or data per 400 words" check is not deterministic, so I could only test it with a digit-count proxy. |
| Stage 4 repair prompt (fix failures, no regressions) | PASS | One cycle cleared all 8 findings: the 68% claim was removed, 60% went back to 40%, and the em dash, "!", "epic", long paragraph and missing keyword were all fixed. Gates 1 and 4 then scored 12/12 and pass. The repair rewrote 14 of 20 paragraphs, mostly because C12 reading level is a whole-document check. |
| Eval 5 monthly calibration drift | NOT TESTABLE | Needs 30 passing drafts and scores from an editor. |
| Eval 6 repair-cycle distribution | NOT TESTABLE | Needs pipeline history. The three-cycle cap was never triggered. |

### Evidence excerpt
```
GATE1 seeded: "score": "8/12", "pass": false
  C5 zero em dashes FAIL 1 | C7 zero exclamations FAIL 1 | C10 no banned phrases FAIL ["epic"]
GATE4 seeded FAIL: no_para_over_75 max 90 ("Hale's third question is annual mileage...") | kw_first_100 false
Gate 2 (playbook prompt, claims_list input), blind grader:
  {"claim": "...logged 60% fewer slip incidents...", "source_id": "S1c", "supported": false, "needs_human_verify": true}
  PASS_RATE: 8/8   <- the "Research shows 68%..." claim never reached the grader
Gate 2 (skill prompt, full draft input), blind grader:
  {"claim": "Research shows 68% of UK trail runners buy a shoe too soft for their terrain.", "source_id": null, "supported": false, "needs_human_verify": true}
  PASS_RATE: 20/20 <- caught, but the criterion still passes it
Brief validator, bad brief: "verdict": "fail", missing_fields: [editorial_slug, buyer_stage, must_include_facts,
  pov_anchor, banned_phrases, internal_links_out]; weak: differentiation_hook ("nearly repeats the
  /trail/best-trail-shoes-2026 sibling hook")
Repaired draft: GATE1 "score": "12/12" | GATE4 pass | 68% claim removed | "40% fewer slip incidents" restored
```

### Behaved differently / stale references
- **Gate 2 does not actually gate.** The playbook's Gate 2 prompt only sees the drafter's own `claims_list`, so a claim the drafter leaves off the list is never checked. That defeats the "No silent assertions" promise in the same prompt. The skill's version reads the full draft and does catch it. Both use a pass criterion ("has a source_id OR is flagged") that a misquoted figure or an invented statistic still meets. The worked example shows the same gap: "19 of 22 with sources plus three explicitly flagged (pass)", and Stage 5 never says the editor resolved those three.
- **Playbook and skill Gate 2 prompts differ.** The playbook takes a claims list with no definition of a claim. The skill takes the full draft and defines a claim as numbers, dates, names, quotes, causal links and product capabilities. The skill's version is the better one.
- **Word count needs a script.** The drafting prompt asks the model to report `word_count`. The repair step reported 655, while `wc` counted 662 including headings and 612 excluding them. Counting by script avoids arguments at the edge of the tolerance band.
- **Document-wide voice checks cause wide rewrites.** The repair rule "Do not change paragraphs that passed all gates" can't really hold when a failing check covers the whole document (here the reading-level check C12). 14 of 20 paragraphs changed. That's expected but worth saying, so editors aren't surprised by the size of the diff.
- **"Deterministic" is slightly overstated.** "At least one original example or piece of data per 400 words" (line 180) needs judgement. Only three of Gate 4's four sub-checks can be scripted.
- **Stale frontmatter.** Line 10 is `models: ["claude-4.5-sonnet", "claude-4.5-opus", "gpt-5"]`. These values are constrained by the `LENS_MODELS` enum in `src/content.config.ts`, which has no current Claude entry. Changing the frontmatter on its own would break the build, so the enum has to be updated first. That is a site-wide fix: 47 playbooks share these values.
- **Stale example.** Line 333's "Teams using "claude-4.5" without pinning a sub-version" is a dated example of the advice. The advice itself still holds.
- **Gate 3 and GEO.** Gate 3 only measures originality against Google's top 20. Overlap between AI answer-engine citations and Google's top 10 is now below 20%, so passing Gate 3 says little about visibility in AI answers. This is not an error, but it's a gap worth one line.
- **Skill and playbook inconsistencies:**
  - The Gate 3 boundary differs. The playbook passes only below 0.75. The skill's "Any pair >0.75 fails" passes exactly 0.75.
  - The skill's brief has 6 fields. The playbook's has 10: the skill leaves out banned phrases, internal links and the voice-profile reference.
  - The attribution example differs: "2024 survey of 1,200 marketers" in the skill, "2026 wear panel" in the playbook.
  - The skill has no brief-validator, drafting or repair prompt text.
  - The skill adds a "Brand lead bypasses the rubric" failure mode that the playbook doesn't have.
- **No other stale references.** None of the context items (Sora, Veo/Gemini Omni, Midjourney, image models, HeyGen) appear in this playbook. The embeddings providers (OpenAI, Voyage, Cohere) and the model-tier wording on line 36 are still accurate. All hand-off slugs exist.

### Recommended edits
1. `src/content/lens/content/eval-gated-drafting.md` line ~161: "Draft claims list: {CLAIMS_LIST_JSON}" → "Draft: \"\"\"{DRAFT_MARKDOWN}\"\"\"\nDrafter's claims list (cross-check only, not the scope): {CLAIMS_LIST_JSON}\n\nA factual claim is anything asserting numbers, dates, names, quotes, causal relationships or product capabilities. Extract claims from the draft itself, not only from the list."
2. Same file, lines ~174-175: "Pass criterion: 95% or more of claims have a source_id or are\nexplicitly flagged needs_human_verify: true. No silent assertions." → "Pass criterion: every claim has a source_id with supported: true,\nor is flagged needs_human_verify: true. Fail on any claim that\ncarries a source_id but supported: false (misquote), and on any\nnumeric claim with no source. No silent assertions."
3. Same file, line ~313: "95% or more of factual claims trace to a brief source or are explicitly flagged. Zero silent assertions." → "Every factual claim traces to a brief source it matches, or is explicitly flagged for the editor. Zero misquotes, zero silent assertions."
4. Same file, line ~230: "The fact grounding is already done." → "The fact grounding is already done, except the claims flagged needs_human_verify, which the editor must confirm or cut before approving."
5. Same file, line ~180: "Deterministic checks." → "Mostly deterministic checks (the original-example check needs a quick model or editor call)."
6. Same file, line ~123: "\"word_count\": <int>," → "\"word_count\": <int, recomputed by script before Stage 3>,"
7. Same file, line ~333: "Teams using \"claude-4.5\" without pinning a sub-version eat the drift." → "Teams calling a floating model alias instead of a pinned model ID eat the drift."
8. Same file, line 10: `models: ["claude-4.5-sonnet", "claude-4.5-opus", "gpt-5"]` → a current pinned Claude ID (e.g. Opus 5.5), but only after `LENS_MODELS` in `src/content.config.ts` gains that value. That's a site-wide change. The `gpt-5` entry was not tested here and should be checked separately.
9. Same file, line ~178: after "Above 0.75 means the draft is restating, not contributing." add "This measures originality against Google only. AI answer engines cite a largely different set of pages, so don't treat a pass here as a GEO signal."
10. `lens-skills/eval-gated-drafting/SKILL.md` line ~67: "Pass: ≥95% of claims have source_id OR are flagged for human verify." → "Pass: every claim is supported by its source_id or flagged for human verify. Any claim with a source_id but supported: false fails the gate."
11. Same skill, line ~70: "Any pair >0.75 fails — too close." → "Maximum similarity must be below 0.75. At 0.75 or above the draft fails as too close."
12. Same skill, line ~112: "the brand's 2024 survey of 1,200 marketers showed X" → "the brand's 2026 wear panel showed X" (to match the playbook).

## Race-result content engine, timing data to editorial recap (`race-result-content-engine.md`)
**Verdict:** PASS-WITH-NOTES  
**Gates:** 8 passed / 8 tested (5 not testable)  
**Key note:** The prompts run cleanly on Opus 5.5, but the fact-check only compares the draft against the feed. The live run found a real disagreement between sources over 6th and 7th that the gate would never see, and the worked example breaks the playbook's own rules.  
**Paired skill:** `lens-skills/race-result-content-engine/SKILL.md`  
**Inputs used:**
- REAL: 2026 UCI Road World Championships, elite men's individual time trial, Montréal, 20 Sept 2026, 39.2 km. Top 10, times, gaps, time-check narrative and quotes checked across four sources:
  - Cyclingnews race report (full text pulled with curl; WebFetch only returned a truncated shell): https://www.cyclingnews.com/pro-cycling/record-breaking-remco-evenepoel-makes-it-four-in-a-row-with-blistering-time-trial-performance-in-montreal/
  - Cycling Weekly race report and top-10 table (curl; WebFetch hit the paywall shell): https://www.cyclingweekly.com/road-world-championships/remco-evenepoel-crushes-world-championships-elite-mens-time-trial-in-montreal-to-win-his-fourth-consecutive-title
  - FloBikes top 10 with hundredths: https://www.flobikes.com/articles/16198961-who-won-the-men-elite-itt-at-the-2026-uci-road-worlds
  - Wikipedia podium and schedule: https://en.wikipedia.org/wiki/2026_UCI_Road_World_Championships
  - Not retrieved: the official UCI result. cyclingflash.com returned 403 and olympics.com timed out, so the "official result" condition was not met. I used press sources instead.
- SYNTHETIC: "Fettle Aero", a fictional UK time-trial clothing brand. The brand-relevance flag was set on British riders as an audience-interest marker, not a sponsorship. No real athlete was presented as sponsored.
- SYNTHETIC: a short voice profile (plain, numerate, British English, no superlatives) and the playbook's banned-phrase list.

**Test depth:** I ran every copy-paste prompt myself on Opus 5.5 against the real result: the Option B feed generator, the Phase 4 drafter, the Phase 5.1 fact-check and the Step 5.2 proportionality rule. Everything was prompt-level. Nothing was published, there was no live timing feed, and the event log came from press reports, which is the playbook's "human watcher" fallback. The voice gate could not be run because it needs a rubric built from a real brand corpus. The playbook has no image or video render steps.

### Gate results
| Gate | Result | Evidence |
|---|---|---|
| Eval 1, time-to-publish 60/90 min | NOT TESTABLE | No live race, CMS or ESP. The race finished four days before the test. |
| Eval 2, fact accuracy (5-claim audit, 100%) | PASS | I sampled five claims from the v2 draft: 57.31s to Ganna, Seixas 19 and 1:13.04, Söderqvist crash with under 3 km left, 48s at the 29 km check, and level with Cancellara and Martin on four. All five matched Cyclingnews and Cycling Weekly. I checked against press sources, not the UCI. |
| Eval 3, voice rubric ≥10/12 | NOT TESTABLE | The rubric has to come from a brand corpus (brand-voice-extraction), and the synthetic brand has none. I did not invent a score. |
| Eval 4, proportionality (quarterly) | NOT TESTABLE | This needs a quarter of published recaps. The single-recap version is covered at Step 5.2 below. |
| Eval 5, aging well at 30 days | NOT TESTABLE | 30 days have not passed. Note that a source conflict on 6th and 7th is already open (see below). |
| Step 5.1 fact-check, NONE blocks publish | PASS | On v1 it flagged "the gap grew fastest early, then held" as unsupported: the splits were 9, then +25, then 48, then 57, so the gap kept growing. It also blocked 4 of 5 errors I planted in a second draft. The fifth plant was the 6th/7th swap, which a feed built from FloBikes would have passed. |
| Step 5.2 draft-time proportionality | PASS | v2: the brand-relevant rider (10th) gets one sentence in para 3. v1 failed the prompt's "one brand-relevant athlete maximum" rule by naming Thornley and Hayter together. |
| Banned-phrase regex | PASS | Zero hits on v2. It correctly blocked a planted "made history", which needed a human override because the four-in-a-row record is real. |
| Drafter format limits | PASS (after 1 repair) | Headline 54 chars, lede 28 words, social 48 chars, email 45 chars. The body was 326 words on the first pass, under the 350 floor, and 356 words after the repair. |
| Only cite numbers from result or event log | PASS | Every number traces to a feed row or event-log entry. Derived gaps such as "13 seconds" and "half a second" come from row arithmetic, which the rule neither allows nor bans outright. |
| Cross-platform consistency | PASS | The social cut and email subject came out of the same JSON as the recap and state the same facts. |
| Wrong sport vocabulary | PASS | The draft used time-check, hot seat and negative-split vocabulary throughout. No running or tri terms slipped in. |
| Wait for official result | NOT TESTABLE | The official UCI results page could not be retrieved, and the three press sources disagree on 6th and 7th. |

### Evidence excerpt
```
Feed conflict found while building the data feed (same times, names swapped):
  FloBikes:       6. Stefan Küng (Mexico) 46:31.96   7. Isaac del Toro (Switzerland) 46:37.57
  Cycling Weekly: 6. Isaac del Toro, Mexico, +1:38   7. Stefan Küng, Switzerland, +1:44
  Search-engine summary also said Evenepoel beat "his nearest rivals by more than a minute" (source: 57.31s).
v2 headline: Evenepoel takes a fourth straight TT title in Montréal
v2 lede: Remco Evenepoel won the Montréal time trial by 57 seconds from Filippo Ganna, fastest at
  every time check after putting nine seconds into Jakob Söderqvist by the first.
v2 para 2 (extract): He was nine seconds faster than Söderqvist at the first check, 25 seconds further up
  by the second and 48 seconds clear at 29 km ... finished in 45:50.44, 15 seconds inside Seixas
Fact-check, v1 claim: "the gap grew fastest early, then held" -> source NONE, supported false,
  action "reword to opinion" (splits 9s / +25s / 48s / 57s show it kept growing)
Fact-check, planted errors: "more than a minute" BLOCK (row: +0:57.31); "course record" BLOCK (NONE);
  "crashed on the final climb" BLOCK (log: corner, <3 km); "52.4 km/h" BLOCK (NONE, though true in CW);
  "Küng sixth" PASSED against a FloBikes-built feed -> gate cannot see feed-level errors
```

### Behaved differently / stale references
- The fact-check only compares the draft with the feed; it never checks the feed against reality. Real sources swapped 6th and 7th: FloBikes has the names transposed, though its country column still reads Mexico for 6th. A feed filled from that page would have passed a wrong result, and the playbook's only catch is the post-publish Eval 2 audit. The playbook assumes an accessible official feed. In this run the official UCI page was unreachable and aggregators were the practical source.
- Where the event log is built from press reports, the drafter's persona line ("write like someone who watched the race") pushes the copy towards eyewitness framing. It also produced one interpretive claim that the splits did not support. The fact-check caught it, which is the gate working as designed.
- The first draft came in at 326 words, below the 350 floor, and needed one regeneration. The playbook has no explicit length gate, so this is caught only if someone checks.
- The "one brand-relevant athlete maximum" rule in para 3 is ambiguous when relevance means national or audience interest rather than sponsorship. The playbook's own worked example also breaks it: para 3 names both Lyons and Burns.
- Derived numbers (gaps and average speed) sit in a grey zone. 52.4 km/h is published by Cycling Weekly, but the rule blocks it unless it is logged.
- The fact-check output schema asks for `result_row_id`, but neither the template CSV nor the Option B column list has a row ID column.
- Worked-example inconsistencies:
  - The headline says "Cortina sprint", but the text describes a descent breakaway and a 6:14 margin.
  - The event log, lede and para 2 say "three lead changes", but the Phase 2 output (line ~290) says "four lead changes on Cibiana".
  - "storm-prone middle section ... came off intact" contradicts "Conditions were clear at 14 C" and has no event-log source.
  - "her best result over 100 km" also has no source.
  - Despite those unsourced claims, Phase 5 reports "Sixteen factual claims, all sourced".
- Real athletes appear with invented 2026 results in a worked example that carries no "illustrative" label: Hannes Namberger and Mathieu Blanchard, with Blanchard listed as 3rd in 11:53:09 in the template CSV. The same invented results sit in the public template `public/lens/templates/race-result-data-feed-template.csv`, dated 2026-06-25 and sourced to utmb.world/results. That presents fabricated results for real, named people.
- The proportionality thresholds disagree within the playbook: "top 30" at line ~28 and in Exercise 3 at line ~318, "top 20" at Step 5.2 and Eval 4.
- Stale: the frontmatter reads `models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]` and should list the current Opus 5.5. The same pattern appears in about 45 playbooks, so it wants one site-wide decision. GPT and Sonnet entries were not tested. The body's "Claude Opus, GPT or Gemini Pro tier" is generic and fine.
- None of the current-context flags apply: there are no Sora, Veo, Midjourney, image-model, HeyGen or GEO references. The skill's ban on AI imagery of named athletes is still sound.
- Playbook and skill disagree:
  - The skill has five phases and four evals, with no Eval 5 (aging well), no audit ledger and no quarterly retro.
  - The skill's drafter prompt drops the `Voice profile` and `Banned phrases` inputs, even though its Inputs list asks for the voice profile.
  - The skill has no fact-check prompt text and no proportionality threshold.
  - The skill omits the cross-platform-inconsistency failure mode.
  - The skill's hand-offs omit training-content-engine.

### Recommended edits
1. `src/content/lens/content/race-result-content-engine.md` line ~131: "Wait for the official result, not the provisional." → "Wait for the official result, not the provisional. Populate the feed from the official results page. If you must use press or aggregator results, every row you will cite needs two independent sources that agree, with both URLs logged. The fact-check gate checks the draft against the feed, not the feed against reality."
2. Same file line ~75: "Gap_to_winner, Brand_relevant, Event_log_ref, Source_url, Notes" → "Gap_to_winner, Brand_relevant, Event_log_ref, Source_url, Source_url_2, Row_id, Notes"
3. Same file line ~78: "multi-stage, leg_split for relays, swim_bike_run_splits for tri)." → "multi-stage, leg_split for relays, swim_bike_run_splits for tri, time_check_splits for time trials)."
4. Same file lines ~148-150 (wrapped): "You write like someone who watched the race, not someone who read the results afterwards." → "You write with the detail of someone who watched the race, drawn only from the event log. Never claim to have watched it yourself." Apply the same change to `lens-skills/race-result-content-engine/SKILL.md` lines ~72-74.
5. Same file line ~190: "- Only cite numbers that appear in the result or event log." → "- Only cite numbers that appear in the result or event log, or that you derive arithmetically from them (gaps, speeds). List each derived number in fact_claims with its calculation."
6. Same file lines ~172-173 (wrapped): "one brand-relevant athlete maximum, proportional to their actual finish" → "at most one brand-relevant athlete covered in depth, any others one line each, all proportional to their actual finish"
7. Same file line ~202 and line ~294: "Namberger holds Lyons off in Cortina sprint" → "Namberger breaks Lyons on the final descent"
8. Same file line ~290: "four lead changes on Cibiana" → "three lead changes on Cibiana"
9. Same file line ~210: delete "The Vahla Range shell she field-tested through the storm-prone middle section came off intact, which matters for the brand's launch plans for the autumn." It is unsourced and contradicts "clear at 14 C". Alternatively, add a matching event-log entry and a conditions change.
10. Same file line ~286: "Cascadia Endurance covers the Lavaredo Ultra Trail in late June." → "Illustrative example. Cascadia Endurance and its athletes are fictional and the results below are invented, not real race results. Cascadia Endurance covers the Lavaredo Ultra Trail in late June." Better still, replace Namberger and Blanchard with fictional names here, at lines ~117-119 and ~202-212, and in `public/lens/templates/race-result-data-feed-template.csv`.
11. Same file line ~28: "finish outside the top 30 most of the time" → "finish outside the top 20 most of the time". Line ~318: "finishing outside the top 30 carry 30% or more" → "finishing outside the top 20 carry 30% or more"
12. Same file line 10: `models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]` → `models: ["claude-5.5-opus", "gpt-5", "claude-4.5-sonnet"]`. This should be a site-wide decision, and the GPT and Sonnet entries were not retested.
13. `lens-skills/race-result-content-engine/SKILL.md` line ~85: after "Brand POV: {POV_NOTE}" add "Voice profile: {VOICE_PROFILE_SHORT}" and "Banned phrases: {BANNED_PHRASES_LIST}". Also add an "Eval R5 — Aging well" line after R4 (line ~137) to match the playbook's Eval 5.

## Segment-specific b-roll, AI-augmented production for endurance (`segment-broll-production.md`)
**Verdict:** PASS-WITH-NOTES  
**Gates:** 13 passed / 15 tested (5 not testable)  
**Key note:** The planning prompts run cleanly on Opus 5.5, but applying the capability rules strictly means the worked example's own S012 (a rain variant of a shot showing a named athlete in branded kit) gets refused. Phase 3 has no archive input, and the tool list needs updating now that the Sora API has shut down.  
**Paired skill:** `lens-skills/segment-broll-production/SKILL.md`  
**Inputs used:**
- Synthetic, taken from the playbook's own worked example: Cascadia Endurance, Vahla Range (shell, vest, shoe). Trail running primary (single-track, technical descent, ridge line, forest, alpine) and road running secondary (urban morning, suburban evening). Athletes Beth Lyons, Saoirse Burns and Marcus Hale. Campaigns: Vahla autumn launch, UTMB, the wet-weather product page, a winter teaser and an autumn road-running email series.
- Synthetic, planted to test the not_applicable path: one "coastal road" shot outside the brand's segments. This copies the stray shot described in the worked example.
- Synthetic assumption, because the Phase 3 prompt has no archive field: the 2025 archive holds location plates only.
- Real sources, used only to check tool status: https://runway.com/changelog, https://releasebot.io/updates/runwayai, https://higgsfield.ai/blog/5-Best-AI-Video-Models-2026-Tested-Compared, https://blog.mean.ceo/higgsfield-news-september-2026/. The repo's own `src/pages/lens/capabilities.astro` was the source for Sora, Gemini Omni and the EU AI Act.

**Test depth:** Prompt-level only. I ran every text prompt myself on Opus 5.5: 2.2 inventory (36 shots), 3.1 tagging (36 rows), 5.1 Option B CSV template, 5.2 augmentation on two shots, the skill's Phase 4 augmentation prompt, and one call sheet for Exercise 3. I rendered no images or video and tested no GPT, Gemini, Runway or Higgsfield model. Evals 1 to 4 need a live library and audience data.

### Gate results
| Gate | Result | Evidence |
|---|---|---|
| 2.2 rule: 30 to 60 shots for 2 to 3 segments | PASS | 36 shots across 2 segments |
| 2.2 rule: mid and cut outnumber hero 4 to 1 | PASS | 23 mid or cut against 5 hero (4.6 to 1) |
| 2.2 rule: environmental shots cover high-yield conditions | PASS | 8 environmental plates (fog dawn, rain, snow blue hour, night, wet urban) |
| 3.1 rule: named athlete, product-visible and hero shots tagged real_footage_required | PASS | Scripted check found 0 violations; 27 real, 6 augmentation, 2 generic, 1 n/a |
| 3.1 rule: every ai_augmentation shot references a real_footage source | PASS | 6 of 6 sources are real_footage shots (S001, S010, S015 x2, S020, S028) |
| 3.1: out-of-segment shot caught | PASS | S036 coastal road tagged not_applicable |
| 3.1: archive_gap_flag | FAIL | The prompt supplies no archive input, so the flag had to be assumed. It is also unclear whether the flag applies to an augmentation shot whose source has not yet been shot |
| 5.1 Option B: CSV with the 16 minimum columns plus brand columns | PASS | 16 core columns plus 14 more: talent release, AI consent, licence start and expiry, LUT, provenance, disclosure label, reviewer |
| 5.2 rule: augmentation prompt never names the athlete or product | PASS | Both S025 and S012 prompts are free of names |
| 5.2 rule: negative prompt excludes named athletes, branded products, logos and face drift | FAIL | Fine for S025 (no subject). For S012 the source shows the Vahla shell with its logo, so obeying the rule literally tells the model to strip the logo. I had to reword it |
| 5.2 rule: human review checklist included | PASS | Present verbatim. On a no-subject plate, limb and face items are irrelevant |
| Eval 5 capability-tag compliance (checked on the plan) | PASS | Every named-athlete and product-visible row traces to real footage |
| Failure mode: cap of 3 to 4 variants per source | PASS | Maximum is 2 per source (S015) |
| Skill Phase 4: refuse when the augmentation would change subject or product | PASS | S012 rain-on-runner refused; re-shoot on the Snowdonia wet-weather day recommended |
| Phase 4 call sheet: contingency set, no double booking | PASS | Chamonix Day 1 call sheet with a 22 to 24 Jul contingency; flagged a clash between golden hour and blue hour 2 km apart |
| Eval 1 inventory coverage of 30 or more cells | NOT TESTABLE | Needs a captured library. As a proxy, the planned inventory spans only 23 distinct cells, because the 2.2 prompt counts shots, not cells |
| Eval 2 plausibility of 80% or more, plus the Step 5.3 reviewer pass | NOT TESTABLE | No renders |
| Eval 3 audience response | NOT TESTABLE | Needs quarterly engagement data |
| Eval 4 fulfilment of 85% or more | NOT TESTABLE | Needs downstream DAM queries |
| Render step: augmented clip, modification map, confidence score (skill Phase 4) | NOT TESTABLE | No image or video model; Claude cannot produce these outputs |

### Evidence excerpt
```
{"shot_id":"S005","capability_tag":"ai_augmentation","rationale":"Pure environment; fog-dawn variant of the S001 single-track location with subject absent.","augmentation_source_shot_id":"S001"}
{"shot_id":"S013","capability_tag":"real_footage_required","rationale":"Subject present but unbranded; in doubt, real (augmenting S010 would require removing a named athlete and product, which changes the subject)."}
{"shot_id":"S036","capability_tag":"not_applicable","rationale":"Coastal road is not a sub-segment the brand serves."}
S025 augmentation_prompt: "Using the reference frame as the fixed base plate, keep the exact camera
 position, lens perspective, ridge silhouette and trail line. Transform the scene to deep blue hour ...
 fresh powder 10-20 cm ... Remove the runner entirely; the trail is empty and untracked."
S025 negative_prompt: "people, runners, figures, silhouettes, faces, hands, ... brand logos, text,
 signage, product, ... extra peaks or changed ridge shape, summer vegetation ..."
Skill Phase 4 on S012 (S001 -> rain): REFUSED - recommend practical capture.
 Reason: rain on a visible subject cannot be added by editing the environment alone. Wet fabric
 drape and sheen on the Vahla shell, rain on skin and hair, and splash at foot strike all modify
 the subject and the product.
 Practical alternative: add S012 to the Snowdonia 28-29 July call sheet (wet-weather cells).
```

### Behaved differently / stale references
- **The worked example contradicts its own rules.** Line 329 ships S012 as a "Rain overcast variant" of S001. S001 is Beth Lyons in the Vahla shell (per `public/lens/templates/broll-shot-list-template.csv`). Under the Phase 3 rules (line 139, "Shows a named athlete the brand sponsors" requires real footage) and the skill's Phase 4 refusal rule, that variant gets refused. Line 335 also says "the augmentations stay on environmental b-roll". Opus 5.5 applied the rules strictly and refused.
- **Augmentation share is about half what the playbook predicts.** Strict tagging gave 6 of 36 (17%). The worked example has 16 of 48 (33%), and the text claims "around 30%". The gap comes from the S012 issue: once subject-visible variants are ruled out, augmentation is limited to environment plates.
- **The Phase 3 prompt cannot compute `archive_gap_flag`.** The USER block has no archive or existing-assets input.
- **The 2.2 schema only fits running.** `subject_visible` is "runner-wide | runner-mid | runner-feet", which breaks for the cycling and swim segments the playbook targets. The CSV template's values ("golden-hour", "runner-mid-frame", "hero-cut", "overcast" as time of day) also don't match the prompt enums ("golden", "runner-mid", "hero").
- **The 2.2 prompt sizes by shots, but Eval 1 is measured in cells.** A compliant 36-shot plan covered only 23 cells, below the Eval 1 threshold of 30.
- **The 5.2 checklist is fixed.** Limb physics and face consistency get forced onto no-subject plates. That is harmless, but it inflates review.
- **Tools.** Higgsfield and Runway are both current: Runway Gen-4.5 plus September 2026 API updates, and Higgsfield as a multi-model aggregator. Higgsfield has listed Sora 2 among its models, and Sora's API shuts down today (24 Sept 2026), so any Higgsfield workflow on Sora needs a different model. The playbook names no alternatives (Gemini Omni, Kling) and no still-image editor (Nano Banana 2, GPT Image 2), even though blog-header stills are among the outputs. `src/pages/lens/capabilities.astro` already recommends keeping the provider swappable; the playbook doesn't.
- **Frontmatter.** `models: ["claude-4.5-opus", "gpt-5"]` is stale. This is library-wide: 46 playbooks use the same values, and `LENS_MODELS` in `src/content.config.ts` has no Opus 5.5 entry, so fixing it needs a schema change first.
- **Disclosure.** The "Disclosure debt" failure mode treats disclosure as a trust choice. Since 2 August 2026, EU AI Act Article 50 makes marking AI-generated or manipulated content a legal obligation for EU sales (as `capabilities.astro` already says).
- **Playbook and skill inconsistencies:**
  - Cell counts: the skill says "30–60 distinct cells"; the playbook says "60-to-200".
  - Evals: the skill has no Eval 5 (capability-tag compliance).
  - Skill Phase 4 prompt: it asks the text model to output "Augmented image / video clip" plus a modification map. A text model can't produce these.
  - Skill self-contradiction: environmental variants have "no athlete in these", yet the skill's own prompt covers "If subject is visible: preserve them exactly".
  - Hand-off lists differ. The skill names gear-launch-sequence and "earned-media-pitch"; the actual file is `earned-media-pitch-generator.md`. The playbook names ambassador-programme and video-script-system.
  - Prompt coverage: the skill has none of the playbook's JSON prompts (inventory, tagging, template).

### Recommended edits
1. `src/content/lens/content/segment-broll-production.md` line 36: "- [ ] Higgsfield or Runway account for AI augmentation, plus a model that supports image-to-image and image-to-video augmentation" → "- [ ] An AI video account (Runway, Kling or Gemini Omni, or Higgsfield as a multi-model front end) plus an image editor for stills (Nano Banana 2 or GPT Image 2). Sora's API shut down on 24 September 2026, so keep the provider a swappable step"
2. Same file line 266: "\"augmentation_prompt\": \"<the prompt to feed Higgsfield or Runway>\"," → "\"augmentation_prompt\": \"<the prompt to feed your chosen image or video model>\","
3. Same file line 110: "\"subject_visible\": \"<runner-wide | runner-mid | runner-feet | no-subject>\"," → "\"subject_visible\": \"<athlete-wide | athlete-mid | athlete-detail | no-subject>\","
4. Same file line 165: "Brand's sponsored athletes: {ATHLETES}" → "Brand's sponsored athletes: {ATHLETES}\nExisting archive (shots already captured): {ARCHIVE_LIST}"
5. Same file line 329: "| S012 | S001, Chamonix single-track dry golden hour | Rain overcast variant | Social cut for the wet-weather product page |" → "| S012 | S001, Chamonix single-track dry golden hour | Rain overcast environment plate, no subject | Backdrop for the wet-weather product page |"
6. Same file lines 280-281: "- Negative prompt explicitly excludes generation of named athletes,\n  branded products, logos and faces that drift from the source." → "- Negative prompt explicitly excludes new people, invented or altered\n  logos and products, and faces that drift from the source. Anything\n  already in the source stays untouched.\n- If the variant cannot be made without changing the subject or\n  product, return a re-shoot recommendation instead of a prompt."
7. Same file line 371: "Honesty becomes part of the brand's positioning." → "Honesty becomes part of the brand's positioning. If you sell into the EU, the AI Act's Article 50 obligations (in force since 2 August 2026) make marking AI-generated or manipulated content a legal requirement, not just a trust choice."
8. Same file line 10: `models: ["claude-4.5-opus", "gpt-5"]`. Update once `LENS_MODELS` in `src/content.config.ts` gains current model IDs. This is a library-wide fix, not specific to this playbook.
9. `lens-skills/segment-broll-production/SKILL.md` line 46: "shot need. Most brands have 30–60 distinct cells; this is the" → "shot need. The full matrix runs 60–200 cells; prioritise the 30–100 that map to live campaigns. This is the"
10. Same skill line 111: "- Augmented image / video clip" → "- The augmentation prompt and negative prompt to run in your image or video model (the render happens there)"
11. Same skill line 139: "earned-media-pitch) filter the library by these tags." → "earned-media-pitch-generator) filter the library by these tags."
12. Same skill, after line 182 ("the right asset >85% of the time without needing new capture."), add: "**Eval B5 — Capability-tag compliance.** Audit a sample of shipped assets. Every named-athlete or product-visible asset traces to a real-footage source. Zero exceptions."
13. Optional, not a playbook or skill file: `public/lens/templates/broll-shot-list-template.csv` rows use "golden-hour", "runner-mid-frame" and "hero-cut". Align them with the prompt enums ("golden", "athlete-mid", "hero").

## SEO cluster generator, pillar, spoke, intent map (`seo-cluster-generator.md`)
**Verdict:** PASS-WITH-NOTES  
**Gates:** 6 passed / 6 tested (2 not testable)  
**Key note:** All four prompts run cleanly on Opus 5.5. But the playbook calls itself "GEO-aware" and has no AI-search step anywhere: its only differentiation test is the Google top 10, and AI-cited sources now overlap with that top 10 less than 20% of the time.  
**Paired skill:** `lens-skills/seo-cluster-generator/SKILL.md`  
**Inputs used:**
- Brand context: the playbook's own worked example (Cascadia Endurance / Vahla Range, UK trail-running, seed "trail running shoes"). Synthetic, fictional brand.
- Query list: 30 queries I wrote around the seed. They follow the worked example and the real result titles below. Synthetic: no Ahrefs, Semrush or GSC export (those connectors are unauthenticated).
- Search volumes: synthetic. The worked example's figures (4,400, 1,900, 1,200, 880, 720, 90) were reused, and the other queries got placeholder figures. They are not real data.
- SERP proxy: real WebSearch results, pulled 24 Sept 2026, for "best trail running shoes UK 2026", "trail running shoes for ultras" and "how to choose trail running shoes". WebSearch is US-located and is not a true Google UK SERP export. Sources included https://runrepeat.com/uk/guides/best-trail-running-shoes, https://www.irunfar.com/best-trail-running-shoes, https://www.livefortheoutdoors.com/trail-running/shoes/best-trail-running-shoes-uk/, https://outdoorsmagic.com/article/best-mens-trail-running-shoes/, https://www.thegreatoutdoorsmag.com/gear-guides/best-trail-running-shoes/, https://www.trekitt.co.uk/blog/best-trail-running-shoes-for-uk-terrain-2026/, https://www.220triathlon.com/gear/run/run-shoes/best-trail-running-shoes, https://trailandkale.com/best-trail-running-shoes-right-now/, https://www.trailrunnermag.com/gear/shoes/best-trail-running-super-shoes/, https://www.outdoorgearlab.com/topics/shoes-and-boots/best-trail-running-shoes, https://www.rei.com/learn/expert-advice/trail-running-shoes.html and https://www.runnersneed.com/expert-advice/gear-guides/how-to-choose-the-best-trail-running-shoes.html.
- Page-level evidence checks: real WebFetch of RunRepeat (lab plus wear testing, around 4,500 words, updated 13 Sept 2026) and Trekitt (retailer, around 2,000 words, no test data).
- GEO context: the site's own post `src/content/blog/the-citation-moved-off-the-page.md`, which cites the 5W/Brandlight finding that the overlap fell below 20% by April 2026.

**Test depth:** I ran every copy-paste prompt once on Opus 5.5 in this agent session: Phase 2 classification (30 queries), Phase 3 cluster shape, Phase 4 hooks (pillar plus 2 spokes against the real SERP proxy) and the Option B template. I also ran the Phase 5 link graph and a short pillar and spoke brief by hand from the rules. This was a prompt-level test only. There was no structured-output API mode, no embedding model, no human gold set, no real keyword volumes, no GPT or Gemini runs, and nothing was published or ranked.

### Gate results
| Gate | Result | Evidence |
|---|---|---|
| Eval 1, intent accuracy >=85% vs 50-query hand gold set | NOT TESTABLE | No independent human gold set; grading my own labels would be circular. Proxy check: my labels matched the worked example's intent on 4 of 6 rows and intent plus stage on 3 of 6. Both intent misses came from the prompt's own heuristics (see below). |
| Eval 2, spoke coherence (embedding similarity >0.6) | NOT TESTABLE | No embedding model run. Qualitatively, the 9 spokes each grouped 1 to 4 queries on a single sub-topic. |
| Eval 3, hook not present in 3+ of top 10 | PASS | Against the real SERP proxy, 7 of 9 pillar results advertise "tested" or wear-testing, so the model marked generic wear-test data `credible_for_serp: false`. It kept the 18-month longitudinal panel (durability over time, which no result has) and the n=412 survey as `true`. |
| Eval 4, link graph density (>=2 incoming per spoke, pillar links to all) | PASS | Graph built for pillar plus 9 spokes. The pillar links to all 9, and every spoke has 3 to 4 incoming links (pillar plus 2 or 3 siblings). No orphans. |
| Eval 5, pillar 3-5x spoke length | PASS | Pillar target 4,500 words; spoke targets 900 to 1,400, a ratio of 3.2x to 5.0x. |
| Failure mode, model invents volumes | PASS (with prompt flaw) | Opus summed only the supplied synthetic figures and labelled them synthetic. But the Phase 3 schema asks for `"estimated_volume": <int>`, which invites the estimating that the failure-mode section forbids. |
| Failure mode, seed too narrow | PASS | With a 30-query sample, Opus returned 9 spokes and flagged the cluster as below threshold rather than padding it to 18. |
| Failure mode, cannibalisation | PASS | "waterproof trail running shoes" and "gore-tex trail running shoes worth it" were merged into one wet-conditions spoke, and competitor-comparison queries were sent to orphans. |

### Evidence excerpt
```
{"query":"trail vs road running shoes","intent":"commercial","stage":"evaluating","confidence":"medium","fits_brand_audience":true}
{"query":"salomon speedcross 6 review","intent":"commercial","stage":"evaluating","confidence":"medium","fits_brand_audience":false}
  -> heuristic '"[brand] X" = navigational' overridden: competitor review query, not navigation
{"query":"best trail running shoes usa","intent":"commercial","stage":"evaluating","confidence":"high","fits_brand_audience":false}
Cluster shape: pillar "best trail running shoes" (4,400, synthetic); 9 spokes; 7 orphans
  WARNING: 9 spokes < 12 floor. Input is a 30-query sample; do not ship, expand the seed export.
  orphans: "hiking boots vs trail runners" (future hiking cluster), "trail running shoes near me",
           "trail running shoes sale" (transactional -> category page, not a spoke)
Hooks, pillar: wear_test_data "tested in the field" credible_for_serp=false (7/9 results claim testing)
               first_party_data "18-month, 80-runner UK durability panel" credible_for_serp=true
               first_party_data "Trail Club onboarding survey n=412" credible_for_serp=true -> ship
Hooks, ultras spoke: first_party_data "Vahla shell fit log, 28 Lavaredo finishers" credible_for_serp=true
  but relevance=low: shell is apparel data on a footwear query -> verdict weak_hook
```

### Behaved differently / stale references
- **GEO claim is unsupported.** The frontmatter description says "GEO-aware", but the body has no step for AI Overviews, AI Mode, ChatGPT search or Perplexity. Hook credibility (Step 4.2, Eval 3, Exercise 2) is tested only against "the top 10 ranking results". With AI-cited sources overlapping the Google top 10 less than 20% of the time, a clear top-10 hook says little about whether AI answers will cite the page. This test did not observe any AI answer citations; they need a manual check.
- **Ultras hook fails in the worked example.** The hook for "trail running shoes for ultras" (line ~322) is "28 finishers wearing the Vahla shell". A shell is a jacket, and the brand's shoes have not launched yet. Opus ran the hook prompt honestly and marked this hook `weak_hook`, but the worked example ranks the spoke P0.
- **Heuristics contradict the worked example.** The "X vs Y = commercial / evaluating" rule labels "trail vs road running shoes" commercial, while the example table says informational / solution-aware. The "[brand] X = navigational" rule mislabels competitor-review queries. Opus overrode the second rule unprompted and followed the first.
- **Spoke floor is inconsistent.** The Phase 3 prompt and Step 3.2 say fewer than 18 spokes is too thin, the failure mode says 12, and Step 4.3 expects 15 to 25 after the kill. Opus flagged the cluster as thin instead of padding it, which is good behaviour, but the rules need one agreed number.
- **Stale terms:**
  - "Helpful Content Update": Google folded the helpful content system into core ranking in March 2024, so there is no separate "next Helpful Content Update".
  - Ahrefs "Matching terms" sits in Keywords Explorer, not Site Explorer.
- **Stale model names.** Frontmatter `models: ["claude-4.5-opus", "gpt-5", "gemini-2.5-pro"]` is stale for Claude. The playbook was retested on Opus 5.5; GPT and Gemini were not retested here. The same `claude-4.5-*` slugs appear in about 45 other Lens files, which is a site-wide issue.
- **Worked example SERP is out of date.** The example names Runner's World, Trail Running Magazine, Believe in the Run, SportsShoes and Pro Direct. The real (US-located) results today are RunRepeat, iRunFar, Live for the Outdoors, Outdoors Magic, TGO, 220 Triathlon and Trekitt. This is fine as illustration, but the example's "wear-test data in three of the top ten" understates the real SERP, where 7 of 9 results claim testing. The conclusion (not a hook on its own) still holds.
- **Playbook and skill inconsistencies:**
  - SERP scope: the skill covers pillar plus top 5 spokes, the playbook pillar plus top 8.
  - GSC window: the skill says "last 90 days", the playbook 16 months.
  - Competitors: the skill asks for "three", the playbook "three to five".
  - Spoke count: the skill outputs "all 20–30" spoke briefs, while the playbook's post-kill target is 15 to 25 (the worked example ends at 19).
  - Prompts: the skill carries only the Phase 2 prompt. It has no cluster-shape, hook or template prompt.
  - Phase numbering differs between the two.
  - The skill has no GEO step either.
  - Hand-off lists differ: the skill has social-content-factory, the playbook has training-content-engine.
  - The skill repeats the same two heuristic problems (lines ~43 and ~46).
- **Template.** The linked template `/lens/templates/seo-cluster-map-template.csv` exists and its columns match Step 5.2. The Option B prompt returned bare CSV as instructed and added Market, Language, Hreflang_group and AI_citation_target columns.

### Recommended edits
1. `src/content/lens/content/seo-cluster-generator.md` line ~10: `models: ["claude-4.5-opus", "gpt-5", "gemini-2.5-pro"]` → `models: ["claude-5.5-opus", "gpt-5", "gemini-2.5-pro"]` (GPT and Gemini entries not retested; the owner should confirm or remove them).
2. `src/content/lens/content/seo-cluster-generator.md` line ~52: "In ahrefs, open Site Explorer and paste the seed." → "In ahrefs, open Keywords Explorer and paste the seed."
3. `src/content/lens/content/seo-cluster-generator.md` line ~80: `- "X vs Y", commercial / evaluating` → `- "[product] vs [product]", commercial / evaluating; "[category] vs [category]" (e.g. trail vs road), informational / solution-aware`
4. `src/content/lens/content/seo-cluster-generator.md` line ~83: `- "[brand] X", navigational / decided` → `- "[own brand] X", navigational / decided; "[competitor brand] X review", commercial / evaluating`
5. `src/content/lens/content/seo-cluster-generator.md` lines ~139 and ~148: `"estimated_volume": <int>` → `"summed_volume_from_input": <int, sum of supplied volumes only, never estimated>`
6. `src/content/lens/content/seo-cluster-generator.md` line ~158: "- 18 to 30 spoke topics. If fewer, the cluster is too thin to ship." → "- 18 to 30 spoke topics. If fewer than 12, flag the cluster as thin and say so; do not pad with near-duplicate spokes."
7. `src/content/lens/content/seo-cluster-generator.md` line ~178: "Capture this in a SERP analysis sheet, nine rows, one per query." → "Capture this in a SERP analysis sheet, nine rows, one per query. Then run the same nine queries in Google AI Mode, ChatGPT search and Perplexity and log the sources each answer cites. AI-cited sources now overlap with the Google top 10 less than 20% of the time, so a page can rank and still not be quoted. Record both columns."
8. `src/content/lens/content/seo-cluster-generator.md` lines ~214-215: "of the top 10 ranking results. That is table stakes, not a hook." → "of the top 10 ranking results or in the sources cited by the AI answers logged in Step 4.1. That is table stakes, not a hook."
9. `src/content/lens/content/seo-cluster-generator.md` line ~322: "28 finishers wearing the Vahla shell over 120 km" → "28 finishers logging fit and blister notes in the pre-production Vahla Range shoe over 120 km"
10. `src/content/lens/content/seo-cluster-generator.md` line ~385: "Pages rank initially, then drop in the next Helpful Content Update." → "Pages rank initially, then drop in the next core update."
11. `lens-skills/seo-cluster-generator/SKILL.md` line ~80: "For the pillar candidate and the top 5 spokes by volume, pull top 10 SERP results." → "For the pillar candidate and the top 8 spokes by volume, pull top 10 SERP results, and log the sources cited in Google AI Mode, ChatGPT search and Perplexity answers for the same queries."
12. `lens-skills/seo-cluster-generator/SKILL.md` line ~115: "4. **Spoke briefs** — all 20–30" → "4. **Spoke briefs** — all surviving spokes (typically 15–25 after the hook kill)"
13. `lens-skills/seo-cluster-generator/SKILL.md` lines ~43 and ~46: apply the same heuristic changes as edits 3 and 4.

## Social-content factory with channel-native generation (`social-content-factory.md`)
**Verdict:** PASS-WITH-NOTES  
**Gates:** 9 passed / 12 tested (4 not testable)  
**Key note:** All five channel prompts run cleanly on Opus 5.5 and pass their own deterministic rules. The similarity gate can't be run as written because it names no metric. The worked example fails the playbook's own LinkedIn gate. The skill contradicts the playbook on CTAs.  
**Paired skill:** `lens-skills/social-content-factory/SKILL.md`  
**Inputs used:**
- Synthetic: the playbook's own worked-example brief (Cascadia Endurance, Week 24, spokesperson Marcus Hale, assets S009/S007, "vertical metres are the dose"). I filled it out to all eight Step 1.1 fields, adding a short voice profile, a banned-phrase list and publish windows. The brand, the people and the Beth Lyons data (8,400 m of climb, 320 km, 28 days) are fictional and come from the playbook.
- Real: Vernillo et al. 2017, "Biomechanics and Physiology of Uphill and Downhill Running", *Sports Medicine*, https://link.springer.com/article/10.1007/s40279-016-0605-y (also https://pubmed.ncbi.nlm.nih.gov/27501719/). Used as the proof point. I checked the claims in the drafts against the abstract.
- Real, for platform-rule currency: Instagram's 5-hashtag hard cap (Dec 2025), https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/ and https://later.com/blog/ultimate-guide-to-using-instagram-hashtags/. LinkedIn "see more" truncation (about 140 characters on mobile, about 210 on desktop) and hashtag handling, https://app.unilink.us/blog/linkedin-character-limits-2026 and https://connectsafely.ai/articles/linkedin-hashtags.

**Test depth:** Prompt-level only, run on Claude Opus 5.5. I wrote the LinkedIn, Instagram, X, TikTok and YouTube Shorts drafts to each prompt's JSON contract, then scored them with a Python script covering the brief validator, the channel rules, two similarity metrics and a proxy 12-check voice rubric. I tested no GPT or Gemini model and posted nothing. Scheduler push, image and video renders, engagement and DAM fulfilment were not tested.

### Gate results
| Gate | Result | Evidence |
|---|---|---|
| Step 1.2 brief validator (deterministic) | PASS | All 8 fields present, and the proof field carries a source URL. The script reported an empty `missing` list. |
| Eval 1: LinkedIn rules | PASS | Line 1 is 63 characters (under 75), with a blank line after it. Paragraphs are at most 2 sentences. No `!`, em dash or `;`. 3 hashtags. Ends on a statement. 134 words. A number appears in paragraph 1. |
| Eval 1: Instagram rules | PASS | First sentence is 96 characters (under 125). 5 hashtags in total (2 in the caption, 3 in the first comment). 89 words. No engagement-bait close. Numbers present. |
| Eval 1: X rules | PASS | 7 tweets. Tweet 1 is 112 characters (136 before regeneration). Longest tweet is 153 characters. No "1/n". A number appears in tweets 1 to 3. The last tweet is not a question or CTA. |
| Eval 1: TikTok rules | PASS | 118 spoken words, which is 44 to 47 s at 150 to 160 wpm. On-screen text is all caps. The 00:00 to 00:03 hook carries on-screen text plus a hard cut. No "follow for more". |
| Eval 1: YouTube Shorts (Step 2.5, 60 s cap) | PASS | 75 spoken words (28 to 30 s), with a curiosity hook: "Fit runners walk every climb at Lavaredo. Here's why." |
| In-prompt `checks` self-report accuracy | FAIL | Character counts matched the script. Self-reported word counts were overstated: LinkedIn by 3, Instagram by 1, TikTok by 10 (128 vs 118), Shorts by 8. This confirms the playbook is right to use deterministic gates rather than trusting `checks`. |
| Eval 2: textual similarity below 0.4 | FAIL | The result depends on the metric, and the playbook names none. Word 3-gram Jaccard: every pair at 0.15 or below (pass). TF-IDF cosine: LinkedIn–X was 0.65 on v1 and fell to 0.30 after regenerating X, but LinkedIn–Instagram (0.53), LinkedIn–TikTok (0.58), Instagram–TikTok (0.45) and TikTok–Shorts (0.61) stay above 0.4. |
| Step 3.2 topical similarity 0.6 to 0.8 | NOT TESTABLE | No embedding model in the test. A lexical proxy can't separate topical from textual overlap. |
| Eval 3: voice match (8 of 12 or better) | PASS | No Cascadia rubric exists, so I built a proxy 12-check deterministic rubric from the synthetic voice profile. All five drafts scored 12/12. Low confidence: I wrote the rubric after drafting. |
| Eval 4: 30-day engagement against baseline | NOT TESTABLE | Needs live posting and 30 days of analytics. |
| Eval 5: asset fulfilment above 85% | NOT TESTABLE | Needs a tagged DAM. |
| Image/video brief generation | PASS | Each channel returned a one-sentence brief tied to S007/S009. TikTok flagged one missing shot ("Marcus running up and out of frame"). |
| Image/video renders | NOT TESTABLE | I can't render images or video. The playbook names no image or video generator. |
| Worked example against its own gates | FAIL | The LinkedIn line 1 in the worked example is 86 characters, over the 75 limit. Its first body paragraph is 3 sentences, against a 1 to 2 line rule. Yet it says "All four drafts passed the deterministic gates". |

### Evidence excerpt
```
LINKEDIN line1 len 63 | blank after l1: True | max sentences/para 2 | ! False | em dash False | ; False | hashtags 3 | words 134 (self 131)
INSTAGRAM first sentence len 96 | hashtags total 5 | words 89 (self 88) | bait: False
X lengths [112, 117, 119, 153, 118, 121, 94] | t1<240 True | all<280 True | num in first3 True
TIKTOK spoken words 118 (self 128) | runtime @150-160wpm 44-47s | caps True | hook 0-3s True
YOUTUBE_SHORTS spoken words 75 (self 83) | runtime 28-30s | cap 60
SIMILARITY pair | tfidf-cosine | word-3gram Jaccard
linkedin-x (v1)  | 0.65 | 0.13   -> after X regenerated: 0.30 | 0.00
linkedin-tiktok  | 0.58 | 0.10
tiktok-youtube_shorts | 0.61 | 0.15
WORKED EXAMPLE LinkedIn line 1 length: 86

LinkedIn draft, line 1-3:
"For the next four weeks, count vertical metres, not kilometres.

Beth Lyons climbed 8,400 metres in the 28 days before Lavaredo. She ran only 320 kilometres to do it."
X tweet 4: "Why? Gradient changes mechanics. Vernillo et al. (2017, Sports Medicine) found quicker cadence, more internal work, and a mid/forefoot landing on climbs."
```

### Behaved differently / stale references
- **What matched the playbook's prediction.** Opus 5.5 kept to every channel's JSON contract and rules first time. The hook-first, statement-close shape came through cleanly on every channel.
- **The similarity gate can't be run as written.** Step 3.2 and Eval 2 don't say how "textual similarity" is measured. The first draft set failed under TF-IDF cosine, driven by a closing line shared across channels ("a road week in trail shoes", borrowed from the worked example). Regenerating X fixed that pair. Four pairs still sit above 0.4 on cosine because they share topic words. On 3-gram Jaccard, everything passes. A team gets a different answer depending on the tool they pick.
- **Step 2.5 works against Eval 2.** It says to reuse the TikTok prompt for Shorts, so TikTok–Shorts is the most similar pair on either metric (0.61 cosine, 0.15 Jaccard).
- **The TikTok word range breaks its own gate.** "around 220 to 240 words" contradicts "under 90 seconds at 150 to 160 wpm" in Step 3.1: 240 words runs 90 to 96 s. Separately, the prompt's `estimated_runtime_seconds` is timecode-based (62 s in the run) while the gate is wpm-based (44 to 47 s). That mismatch is harmless but confusing.
- **Nothing checks faithfulness to the proof.** An early LinkedIn line I drafted overstated Vernillo 2017, claiming effects on late-race muscle failure that the review does not make. I caught it by hand. None of the gates checks that claims stay within the proof, so it would have shipped.
- **The self-reported `checks` are unreliable for word counts** (off by up to 10). The playbook already runs deterministic gates. It should say outright that `checks` is advisory only.
- **Some platform guidance is out of date.** Instagram has hard-capped posts at 5 hashtags since December 2025, and sources disagree on whether first-comment tags count towards the cap. The prompt's "Half in the caption bottom block, half in the first comment" split, and the failure mode's "Modern algorithms penalise this", both predate the cap. The LinkedIn 75-character line 1 is conservative against current truncation (about 140 characters on mobile) but still sound.
- **Frontmatter `models: ["claude-4.5-sonnet", "gpt-5"]` is stale.** It is also schema-locked: `LENS_MODELS` in `src/content.config.ts` has no Claude 5.x value, so the enum has to change before this frontmatter can.
- **I did not retest gpt-5.** Line 37 ("Claude Sonnet, GPT mini or Gemini Flash tier") names tiers generically and is fine.
- **No stale image or video tools.** The playbook names no generator (no Sora, Veo, Midjourney and so on), so the Sora shutdown and the Veo-to-Gemini Omni change don't affect it. Buffer, Hootsuite, Later and Sprout Social are named as schedulers; I did not verify each one's current feature set.
- **The worked example contradicts itself.** It claims all gates passed, but its LinkedIn line 1 is 86 characters and its first body paragraph is 3 sentences. The Instagram caption credits "Photo by Cascadia at Snowdonia, July 2026" in a playbook with `publishedAt: 2026-06-09`, briefed in Week 24 (mid-June).
- **The playbook contradicts itself on thresholds and cadence.** Exercise 3 says "above 0.7" means cross-posting, while Eval 2 says 0.4. Artefact 5 promises a "quarterly tune-up", Step 4.4 says "monthly retro", and the hashtag failure mode says "quarterly".
- **Where the skill and playbook disagree:**
  - **CTAs.** The skill's TikTok format ends "+ CTA" with `"cta": "<single ask>"`, and its X final tweet is "a single ask". The playbook bans a CTA or question on both channels.
  - **LinkedIn prompt.** The skill drops "No exclamation marks. No em dashes. No semicolons in prose." and the `{VOICE_PROFILE_SHORT}` input, and its own prompt text uses em dashes.
  - **Tweet 1 rationale.** Skill: "room for retweet attribution". Playbook: "thread emoji". Neither is a real X constraint.
  - **Instagram hashtags.** Skill: all in the first comment, and it adds `alt_text`. Playbook: split half and half.
  - **Evals and hand-offs.** The skill lists Evals 1 to 3 only, and its hand-offs name earned-media-pitch, lifecycle-journey-builder and eval-gated-drafting where the playbook names four different ones. All referenced playbooks and skills exist in the repo.

### Recommended edits
1. `src/content/lens/content/social-content-factory.md` line ~10: `models: ["claude-4.5-sonnet", "gpt-5"]` → `models: ["claude-opus-5.5", "gpt-5"]`. First add `'claude-opus-5.5'` to `LENS_MODELS` in `src/content.config.ts` or the build fails. gpt-5 was not retested.
2. Same file line ~205: "- Spoken script under 90 seconds (around 220 to 240 words)." → "- Spoken script under 90 seconds (no more than 220 words)."
3. Same file line ~254: "Compute pairwise textual similarity across the week's outputs." → "Compute pairwise textual similarity across the week's outputs as word 3-gram Jaccard overlap (embedding or TF-IDF cosine also scores shared topic words, so use it only for the topical range)."
4. Same file line ~370: "If pairs score above 0.7, you have been cross-posting with cosmetic changes." → "If pairs score above 0.4, you have been cross-posting with cosmetic changes."
5. Same file line ~94: "- No exclamation marks. No em dashes. No semicolons in prose." → "- No exclamation marks. No em dashes. No semicolons in prose.\n- Only claim what the proof point supports. Do not extend a study's findings." Mirror the new rule in the Instagram, X and TikTok rule lists.
6. Same file lines ~131–132: "- Maximum 5 hashtags. Half in the caption bottom block, half in\n  the first comment." → "- Maximum 5 hashtags in total across caption and first comment\n  (Instagram's hard cap since December 2025)."
7. Same file line ~392: "Modern algorithms penalise this." → "Instagram has hard-capped posts at five hashtags since December 2025, and LinkedIn treats hashtag stuffing as a spam signal."
8. Same file line ~314: "> Vertical metres are the dose for the next four weeks of the build, not the kilometres." → "> Count vertical metres, not kilometres, for the next four weeks." (63 characters). On line ~316, break the paragraph after "off 320 kilometres of running." so it is at most 2 sentences.
9. Same file line ~332: "Photo by Cascadia at Snowdonia, July 2026." → "Photo by Cascadia at Snowdonia, May 2026."
10. Same file line ~24: "feeding the quarterly tune-up" → "feeding the monthly retro" (matches Step 4.4).
11. Same file line ~167: "- Tweet 1 under 240 characters (leaves room for the thread emoji)." → "- Tweet 1 under 240 characters (leaves room for quote-post commentary)."
12. `lens-skills/social-content-factory/SKILL.md` line ~75: "Format: hook + setup + proof + payoff + CTA." → "Format: hook + setup + proof + payoff. No follow CTA." Also delete line ~86 `"cta": "<single ask>",`.
13. Same file line ~99: "Final tweet: a one-line synthesis + a single ask (no calls to follow)." → "Final tweet: a one-line synthesis. Not a question, not a CTA."
14. Same file line ~46: after `- No "Hot take:" "Unpopular opinion:" — inheritance from X / Twitter.` add `- No exclamation marks. No em dashes. No semicolons in prose.` Add `Voice profile: {VOICE_PROFILE_SHORT}` to its USER block.

## Training-content engine for endurance brands (`training-content-engine.md`)
**Verdict:** PASS-WITH-NOTES  
**Gates:** 9 passed / 10 tested (4 not testable)  
**Key note:** All five prompts run cleanly on Opus 5.5, but the credibility gate only checks whether a source is on the approved list, not whether the draft represents it correctly. It passed two misrepresented citations that Eval 2's manual source check then caught.  
**Paired skill:** none. No dedicated skill in `lens-skills/`. The only mention of `training-content` is the catalogue line in `lens-skills/setup-the-lens/SKILL.md` (line 279). Phase 4 hands off to `lens-skills/eval-gated-drafting/SKILL.md`. That skill was read for context but its four standard gates were not run.  
**Inputs used:**
- Real (fictional case): the playbook's own worked example. Cascadia Endurance with coach Marcus Hale, the POV summary on line 361, the audience tiers beginner / mid-pack racer / ultra, and calendar row W01 "The case for the eighty-twenty week".
- Real (repo file): row W01 of `public/lens/templates/training-content-calendar-template.csv`, including its citation cue "Seiler 2010 plus Stoeggl 2014".
- Synthetic: a 420-word interview transcript for Marcus Hale that I wrote from the line-361 POV bullets (polarised base, three lifts only, perceived effort over watts or heart-rate dogma, sceptical of "epic suffering"). The playbook has no transcript.
- Synthetic: an approved-sources list of Seiler, Stöggl, Mujika, Lydiard, Friel, Maffetone and Foster (the playbook's floor plus Foster, who is cited in the CSV).
- Real sources checked on the web:
  - Seiler 2010, IJSPP 5(3):276-291. Publisher page https://journals.humankinetics.com/view/journals/ijspp/5/3/article-p276.xml returned 403 to fetch. Abstract content taken from search results, which also point to https://www.researchgate.net/publication/46403553 (also 403).
  - Stöggl and Sperlich 2014, Frontiers in Physiology 5:33. Full text fetched from https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2014.00033/full. The PubMed page https://pubmed.ncbi.nlm.nih.gov/24550842/ gave only a cookie wall.
  - Foster et al. 2001, JSCR 15(1):109-115. Confirmed via https://pubmed.ncbi.nlm.nih.gov/11708692/ and https://journals.lww.com/nsca-jscr/abstract/2001/02000/a_new_approach_to_monitoring_exercise_training.19.aspx (search results only).

**Test depth:** Every copy-paste prompt was run once, in order, by Opus 5.5 in this session. The same model drafted and gated its own work, so the gate verdicts are self-graded. Outputs were shortened on purpose: a POV document of about 750 words, a 450-word draft, and a 24-topic taxonomy for a 24-week calendar. This was a prompt-level test only. Nothing went to a CMS, email platform or scheduler, and no audience data exists. Citation checks used real web lookups. Human coach review (Phases 1.3, 2.2 and 5) cannot be tested here. Nothing was tested on GPT or Gemini.

### Gate results
| Gate | Result | Evidence |
|---|---|---|
| Step 1.2 POV synthesis output contract (7 sections, coach voice, no marketing voice) | PASS | All 7 sections present, in first person, no promotional language. The 1,500 to 2,500 word target was not tested because the output was shortened on purpose to about 750 words. |
| Step 2.1 taxonomy rules (24 for a half year, every topic tied to a POV claim, practical_application is a concrete "try this") | PASS | Exactly 24 topics, each with a `POV_anchor`. Every `practical_application` is a session or test, for example "one 45-min run nose-breathing only; if you can't, slow down". |
| Step 3.1 Option B calendar template (14 columns, only Week pre-filled) | PASS | Valid CSV with a header row and 24 rows (2 a week over 12 weeks, W01,W01,W02...). All other cells empty. The `Reviewer capacity` input was accepted but nothing in the prompt uses it. |
| Step 4.2 coaching_truth_gate | PASS | No contradictions of the POV. The draft goes beyond the POV by adding the "grey-zone creep" diagnosis. |
| Step 4.2 practical_application_gate | PASS | 3 prescriptions found, one per tier (beginner talk test, mid-pack nasal-breathing check, ultra conversational-sentence test). |
| Step 4.2 credibility_reference_gate | PASS (after 1 repair) | First run failed correctly on an uncited claim, "beginners cap heart rate at 75% of max". The repair reframed it as the coach's rule of thumb, with no physiology claim. The gate passed both Seiler and Stöggl because they are on the approved list, even though the draft misstated both (see Eval 2). |
| Step 4.3 repair limit (3 cycles max) | PASS | Passed after 1 repair cycle. |
| Step 6.1 repurposing rules (prescription in every cut, citation in at least 3 cuts, character limits) | PASS | The prescription appears in all 6 cuts. The citation appears in the email, carousel slide 4, X post 5 and the podcast brief. Subject line is 35 characters (under 50) and the hook is 61 (under 75). |
| Phase 5 expert review (48-hour SLA, review log) | NOT TESTABLE | Needs a human coach. |
| Eval 1 POV consistency (20 pieces, reviewer scores 1 to 5) | NOT TESTABLE | Needs published pieces and a human reviewer. |
| Eval 2 citation accuracy (100%) | FAIL | The draft that passed the gate misstated 2 of 3 sources. Seiler 2010 describes about 80% of *sessions* at low intensity in elite athletes, and the draft said "training time". Stöggl 2014's polarised group was roughly 68/6/26 in well-trained athletes over 9 weeks, and the draft presented it as proof of 80/20. Foster 2001 was accurate. After the manual fix, 3/3 are accurate. |
| Eval 3 practical-application rate (100%) | PASS | 1 of 1 drafts passed the gate before publish (n=1, so this is only a proxy for the monthly audit). |
| Eval 4 audience response | NOT TESTABLE | No engagement data. |
| Eval 5 coach-edit volume trend | NOT TESTABLE | Needs a review log built up over time. |

### Evidence excerpt
```
DRAFT v1 (W01, from calendar cue "Seiler 2010 plus Stoeggl 2014"):
  "Seiler's 2010 review found elite endurance athletes spend about 80% of
   their training time at low intensity, and Stöggl and Sperlich (2014)
   showed an 80/20 split beats threshold training."
GATE v1 credibility_reference_gate: {"verdict":"fail","claims":[
  {"claim":"...80% of their training time at low intensity","citation":"Seiler","supported":true},
  {"claim":"...an 80/20 split beats threshold training","citation":"Stoeggl","supported":true},
  {"claim":"beginners cap heart rate at 75% of max","citation":"NONE","supported":false}]}
REPAIR 1 -> gate pass. WEB CHECK (Eval 2):
  Seiler 2010: ~80% of *sessions* low intensity, elite athletes -> "time" wrong
  Stöggl 2014 (frontiersin.org full text): POL ~68% low / 6% threshold /
    26% high, 48 well-trained athletes, 9 weeks; VO2peak +11.7% -> not "80/20"
FINAL: "In Stöggl and Sperlich's nine-week study, well-trained athletes on a
  polarised plan (about two-thirds easy, a quarter hard, almost nothing in
  between) improved VO2peak by 11.7%, more than the threshold group."
```

### Behaved differently / stale references
- **The credibility gate is weaker than the playbook suggests.** Line 266 only fails a claim that has no citation or cites a source off the approved list. With `{APPROVED_SOURCES_LIST}` given as author names only, the gate cannot judge `"supported"`, so it defaults to true. This is exactly the "citation laundering" failure the playbook describes on line 420. The manual check in Eval 2 caught it, but the automated gate did not.
- **The CSV template sets up the misquote.** Row W01's cue "Seiler 2010 plus Stoeggl 2014" for an "eighty-twenty" piece invites the drafter to present Stöggl as 80/20 evidence. Stöggl's polarised group was not 80/20.
- **"No hedging" (line 95) conflicts with the worked example.** In Phase 5 the coach softened "must" and "always". On Opus 5.5 the POV and the draft both came out in absolute terms ("always keep easy days easy"), so the prompt produces the over-prescription the coach later has to remove.
- **Taxonomy prompt:** "For each pillar, return JSON" conflicts with a schema that is a single object. The model returned one object, which is the sensible reading. The self-cannibalisation failure mode (line 424) is not written into the prompt, and 2 of my 24 topics shared the same anchor and tier. The "Practical (gear choices, ...)" pillar invites the gear pieces that Marcus killed in the worked example (line 363).
- **Repurposing prompt:** `"long_form_blog": "<published as-is, the source>"` makes the model echo the whole piece back, which wastes output. `twitter_thread` is stale naming for X. The worked example's "Twitter thread" (line 382) is dated history and can stay.
- **Stale frontmatter:** `models: ["claude-4.5-opus", "gpt-5"]` (line 10). A simple swap will not work, because `models` is validated against the `LENS_MODELS` enum in `src/content.config.ts` (lines 66-77), and that enum has no current model. All 46 Lens playbooks use only 4.5-era values, so this needs fixing across the library. GPT-5 was not tested here. It stays in the list only on the other playbooks' precedent.
- No references to Sora, Veo, Midjourney, image models or GEO. HeyGen is not mentioned. Line 39's generic "Claude Opus, GPT or Gemini Pro tier" is still accurate.
- Minor: the CSV template's publish dates start 2026-01-06, which is now in the past. It still works as a sample.

### Recommended edits
1. `src/content.config.ts` line ~69: "  'claude-4.5-opus'," → "  'claude-4.5-opus',\n  'claude-opus-5.5'," (required before any playbook can list it).
2. `src/content/lens/content/training-content-engine.md` line 10: `models: ["claude-4.5-opus", "gpt-5"]` → `models: ["claude-opus-5.5", "gpt-5"]`. Also add `updatedAt: 2026-09-24` after line 11.
3. `src/content/lens/content/training-content-engine.md` line 95: "- No hedging. The POV is sharper than the average coaching content." → "- No hedging on positions. The POV is sharper than the average coaching content. State prescriptions as rules of thumb (\"in most weeks\"), not absolutes (\"always\", \"must\")."
4. `src/content/lens/content/training-content-engine.md` line 233: "Approved citation sources: {APPROVED_SOURCES_LIST}" → "Approved citation sources, each with its abstract or key finding: {APPROVED_SOURCES_WITH_FINDINGS}"
5. `src/content/lens/content/training-content-engine.md` lines 266-267: "  has no citation or cites a source not in the approved list." → "  has no citation, cites a source not in the approved list, or\n  overstates what the source found (population, intensity split,\n  effect size). If the source's finding is not supplied, set\n  supported: false so a human checks it."
6. `src/content/lens/content/training-content-engine.md` line 159: "  topic restated." → "  topic restated.\n- No two topics share the same POV_anchor and audience_tier. Cover\n  the breadth before doubling up."
7. `src/content/lens/content/training-content-engine.md` line 314: `"long_form_blog": "<published as-is, the source>",` → `"long_form_blog_url": "<URL of the published source piece>",`
8. `src/content/lens/content/training-content-engine.md` line 331: `"twitter_thread": [` → `"x_thread": [`
9. Optional, `public/lens/templates/training-content-calendar-template.csv` line 2: "Seiler 2010 plus Stoeggl 2014" → "Seiler 2010 (80% of sessions easy); Stoeggl 2014 (polarised ~68/6/26 beat threshold)"

## Video script system, brief to shootable script (`video-script-system.md`)
**Verdict:** PASS-WITH-NOTES  
**Gates:** 11 passed / 11 tested (3 not testable)  
**Key note:** The playbook's six prompts run cleanly on Opus 5.5. The paired HeyGen skill works today, but it calls `/v2/video/generate`, which HeyGen retires on 31 Oct 2026. Its pricing section is also out of date, and its sentence-length and pace rules contradict the playbook.  
**Paired skill:** `lens-skills/video-script-to-heygen/` (SKILL.md, make-cards.py, post-process.sh). The pairing is loose: the skill is a generic "render a playbook as an avatar video" utility, and the playbook never mentions it or HeyGen.  
**Inputs used:**
- Real (playbook's own worked example): the Cascadia Endurance Vahla shell brief from the "Worked example" section. 60 seconds, convince, Marcus Hale as spokesperson, 48-month wear panel plus Beth Lyons at Lavaredo, shot IDs S001/S003/S004/S005/S007/S015.
- Synthetic: shot descriptions for those six IDs (the playbook names the IDs but gives no inventory CSV), a short voice profile, and banned phrases ("game-changer", "best in class").
- Synthetic: a deliberately thin brief ("educate, 30s, 'our shells are great for trail running', no spokesperson, 'customers love them'") to check that the validator rejects it.
- Real: the playbook file itself as `--playbook video-script-system` input to the skill's Phase 2 script prompt.
- Real (web check of HeyGen API status): https://developers.heygen.com/changelog and https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained

**Test depth:** Prompt-level only. I ran every playbook prompt (validator, beat sheet, hooks, script expansion, thumbnails, b-roll shortlist) as Opus 5.5 and checked word counts, runtimes and sentence lengths with a local Python script. I also ran the skill's script prompt, its validation rules and its LinkedIn template. make-cards.py was run offline (PIL only) into the scratchpad. Not run: the HeyGen API calls (render, poll, download, captions), post-process.sh (it needs a HeyGen `video.mp4`), the social-content-factory caption prompt, and any GPT or Gemini runs.

### Gate results
| Gate | Result | Evidence |
|---|---|---|
| Step 1.2 brief validator (fail if C1 or C4 fails) | PASS | Worked-example brief returned `pass` on C1 to C4. The thin brief returned `fail`, with C1, C3 and C4 failing and missing_inputs listing the takeaway, spokesperson and proof. |
| Step 2.2 timecodes within 10% of target | PASS | 5 beats running 00:00 to 00:58 against a 60s target. |
| Eval 1, length adherence (no more than 15% over) | PASS | Script has 128 spoken words, which is 51.2s at 150 wpm and 48.0s at 160 wpm. Not over target. It runs about 15% short, and the gate does not check for that. |
| Eval 2, hook quality (at least one `no_swipe`) | PASS | Hook A (spec 6, contra 9, pattern-break 5) was self-assessed `no_swipe`. B was `uncertain` and C `likely_swipe`. Caveat: the same model generates and grades the hooks. |
| Eval 3, talent-able dialogue (longest sentence under 30 words) | PASS | Longest sentence is 20 words (script-counted). The per-beat word counts are 13/29/35/36/15. |
| Eval 4, b-roll feasibility | PASS | 9 b-roll references: 7 map to inventory IDs, and 2 are flagged `capture_required` (a Marcus ridge close-up and a membrane macro). |
| Step 5.1 thumbnail rules (a face, overlay under 4 words) | PASS | Concept A uses Marcus's face with "40G = MEMBRANE". B's overlay is "12 HOURS. 3 STORMS." and C's is "VAHLA SHELL". |
| Eval 5, retention vs hook score | NOT TESTABLE | Needs post-publish retention data. |
| Step 4.2 say-it-out-loud check | NOT TESTABLE | Needs a human reading aloud. Sentence-length proxy is covered by Eval 3. |
| Skill: word count within 10% of 135 | PASS (after 1 regen) | First draft was 161 words and failed (the band is 121 to 148). The regenerated draft was 148 words and passed. See the note on the conflicting target below. |
| Skill: five movements present | PASS | Opening ("if you have ever stood on a shoot day..."), setup, reveal ("That is why we wrote..."), offer, close. |
| Skill: CTA matches URL pattern | PASS | "You'll find it at manual-focus.co.uk/lens". |
| Skill: hard bans (em dash, colons, semicolons, !, banned words, staccato, bare-number openers) | PASS | Automated scan found 0 hits, and no three consecutive sentences are under 8 words. |
| Skill: HeyGen render, poll, download, captions | NOT TESTABLE | External paid API. Not called. |

### Evidence excerpt
```
[Phase 4, beat 2, playbook prompt]  00:07-00:20
talent_line: "We put the Vahla shell through a forty-eight month wear panel with eighty runners. The shell that survives the season weighs forty grams more than the lightweight category average."
b_roll: "[S001 Beth single-track golden hour, S003 Beth ridge blue hour, cut on 'average']"
on_screen_text: "48 MONTHS OF WEAR DATA"   transition_note: "hard cut"
freeze_words: ["forty grams", "the membrane", "Vahla shell, October"]   improvise_zones: [4]
checks: {spoken_word_count: 128, estimated_runtime_seconds: 51, longest_sentence_words: 20, banned_phrases_present: false}

[Phase 3 hooks]  A composite 7.0 no_swipe | B composite 6.2 uncertain | C composite 1.0 likely_swipe

[Skill Phase 2, regenerated, 148 words, 68s at 130 wpm, sentence lengths 33/39/43/21/12]
"Hello, and if you have ever stood on a shoot day with a producer rewriting lines on the back of a
call sheet, you already know where most marketing video loses its week. ... You'll find it at
manual-focus.co.uk/lens, and it takes an afternoon to run."

[make-cards.py, offline]  Wrote title.png 1080x1920, outro.png 1080x1920, urlbar.png 1080x110, badge.png 752x97
```

### Behaved differently / stale references
- **HeyGen v1/v2 API retirement (stale, time-critical).** HeyGen's changelog says v1 and v2 endpoints are "fully operational through October 31, 2026" and then sunset. The replacement is `POST /v3/videos`, with status at `GET /v3/videos/{video_id}`, and captions are now always generated. The skill hard-codes `v2/video/generate`, `v1/video_status.get` and `v1/video/captions` (SKILL.md lines ~174, ~194, ~223), so Phase 3 to 5 will break five weeks from today. I did not verify the v3 payload shape, so the fix should be written against HeyGen's v3 docs rather than guessed. I also could not confirm that `v1/video/captions` ever existed as written.
- **HeyGen pricing section is stale.** SKILL.md lines ~271 to 277 say Free and Starter plans lack API access and that Creator gets 15 min a month. HeyGen's help centre now describes the API as a standalone pay-as-you-go purchase in USD that needs no web plan ("you can purchase API credits without having Creator, Pro, or Business plans"). The "46 videos exceeds Creator" credit maths no longer applies.
- **Playbook and skill contradict each other on spoken style.** The playbook's Eval 3 requires the longest sentence to be under 30 words and assumes 150 to 160 wpm. The skill asks for "long sentences that breathe" at about 130 wpm. The skill's compliant output had 3 of 5 sentences over 30 words (the longest was 43), so it would fail the playbook's own Eval 3. That may be deliberate (TTS avatar vs human talent), but neither file says so.
- **The skill's word-count targets conflict with each other.** Line 29 says "~135 words". The prompt (line ~80) says "140 to 160". The validator (line 125) says "within 10% of the target (135...)", which is 121 to 148, so only 140 to 148 words satisfies both. My first draft (161) was inside neither band. At the stated 130 wpm, 60 to 90s is actually 130 to 195 words.
- **The skill says "Five phases" but defines Phases 1 to 6** (line 33).
- **The playbook's worked example contradicts itself.** Beat 2's VO says "We tested 80 runners across 18 months", but the on-screen text and the brief both say 48 months (lines 148, 354, 364). As the model, I reconciled this to 48 months when generating.
- **The hook "composite" score is undefined in the playbook.** I had to invent a weighting: 0.4/0.4/0.2, following the failure-mode note that specificity and contradiction come first. Other runs or models will weight it differently, which weakens Eval 5's correlation logging.
- **Eval 1 only catches overruns.** My 128-word script ran 51s against a 60s target and 58s of timecodes, and no gate flags it.
- **make-cards.py overflows long titles.** The title is fixed at 220pt Impact with no fit-to-width. "Video scripts" (13 characters) was clipped at both edges of the 1080px card (checked visually). Fonts are hard-coded macOS paths, so the script `sys.exit`s on Linux. The badge default "46 playbooks · 26 skills · free" is hard-coded in make-cards.py (line 189), post-process.sh (line 41) and the SKILL prompt (line ~75). All three are accurate today (46 playbook files, 26 skill folders) but will drift.
- **Emojis in skill output.** SKILL.md line 253 (📁), make-cards.py line 205 (✅) and post-process.sh line 140 (✅) conflict with the house no-emoji style.
- **The `models:` frontmatter is stale.** Line 10 is `["claude-4.5-sonnet", "gpt-5"]`. It cannot simply be edited, because `LENS_MODELS` in `src/content.config.ts` (lines 66 to 77) has no Opus 5.5 entry, so the enum has to change first.
- **No Sora, Veo, Midjourney, Runway, Kling, Synthesia or ElevenLabs references** appear in the playbook or the skill, so none of those deprecations apply. Descript and Rev (line 37) were not re-verified on the web in this run.
- **Hand-off targets all exist.** segment-broll-production, social-content-factory, race-day-demand-pipeline, ai-studio-news-pipeline and brand-voice-extraction are all present in `src/content/lens/`.

### Recommended edits
1. `src/content.config.ts` line ~76: `'deepseek-v3',` → `'deepseek-v3',\n  'claude-opus-5.5',` (needed before any frontmatter change).
2. `src/content/lens/content/video-script-system.md` line 10: `models: ["claude-4.5-sonnet", "gpt-5"]` → `models: ["claude-opus-5.5", "claude-4.5-sonnet", "gpt-5"]`
3. `src/content/lens/content/video-script-system.md` line 148: `"We tested 80 runners across 18 months.` → `"We tested 80 runners across 48 months.`
4. `src/content/lens/content/video-script-system.md` line 364: `We tested 80 runners across 18 months. [pause]` → `We tested 80 runners across 48 months. [pause]`
5. `src/content/lens/content/video-script-system.md` line 185: `"composite": <0-10>` → `"composite": <0-10, weighted 0.4 specificity, 0.4 contradiction, 0.2 pattern_break>`
6. `src/content/lens/content/video-script-system.md` line 400: `Scripts more than 15% over target fail and trim.` → `Scripts more than 15% over target fail and trim. Scripts more than 15% under target get flagged so the producer can tighten timecodes or add a beat.`
7. `lens-skills/video-script-to-heygen/SKILL.md` lines ~136 to 228: `https://api.heygen.com/v2/video/generate`, `https://api.heygen.com/v1/video_status.get?video_id=$VIDEO_ID` and `https://api.heygen.com/v1/video/captions?video_id=$VIDEO_ID` → rewrite Phase 3 to 5 against `POST https://api.heygen.com/v3/videos` and `GET https://api.heygen.com/v3/videos/{video_id}`, using HeyGen's v3 docs for the payload. This must land before 31 Oct 2026.
8. `lens-skills/video-script-to-heygen/SKILL.md` line 271: `- Free / Starter plans do not include API access. Confirm they are on Creator or above.` → `- API access is a separate pay-as-you-go wallet billed in USD by avatar engine and output length. No HeyGen web plan is required.` Then delete lines 272, 273 and 275, and rewrite line 277's credit maths in USD.
9. `lens-skills/video-script-to-heygen/SKILL.md` line 29: `(60-90s, ~135 words, default)` → `(60-90s, 140 to 160 words, default)`
10. `lens-skills/video-script-to-heygen/SKILL.md` line 125: `- Word count within 10% of the target (135 for short, 700 for long)` → `- Word count inside the prompt's target range (140 to 160 for short, 700 to 800 for long)`
11. `lens-skills/video-script-to-heygen/SKILL.md` line 33: `Five phases. Run them in order.` → `Six phases. Run them in order.`
12. `lens-skills/video-script-to-heygen/SKILL.md` line 47: `Spoken scripts are not written scripts. Different rules apply.` → `Spoken scripts are not written scripts. Different rules apply. This skill writes for a TTS avatar at about 130 wpm with long breathing sentences, which deliberately departs from the video-script-system playbook's under-30-word rule for human talent.`
13. `lens-skills/video-script-to-heygen/make-cards.py` line 68: `title_fnt = font(DISPLAY_FONT, 220)` → shrink to fit: `size = 220` then `while size > 80 and measure(ImageDraw.Draw(img), title.upper(), font(DISPLAY_FONT, size))[0] > W - 120: size -= 10` then `title_fnt = font(DISPLAY_FONT, size)`.
14. Optional: `SKILL.md` line 253 `📁  videos/<slug>/` → `videos/<slug>/`; `make-cards.py` line 205 and `post-process.sh` line 140, drop `✅ `.


## Applied, 24 September 2026

The recommended edits above were applied to the nine playbooks, the eight
paired skills and three templates in the same session. The `npm run build`
run afterwards passed, with 116 pages built.

**Across all nine playbooks.** `models` is now
`["claude-5.5-opus", <previous entries in their previous order>]`, and
`updatedAt: 2026-09-24` was added. `claude-5.5-opus` was already in
`LENS_MODELS`, so `src/content.config.ts` was not touched. That supersedes
the per-playbook edits above that proposed schema changes or other id
spellings (`claude-opus-5-5`, `claude-opus-5.5`, `gpt-6`). The GPT, Gemini
and Sonnet entries were kept but not retested. Every changed SKILL.md went
from 0.1.0 to 0.2.0.

### Priority fixes, re-tested

- **eval-gated-drafting, Gate 2.** The prompt now reads the full draft, with
  the drafter's claims list used only as a cross-check. It defines a
  factual claim. The gate fails on any claim that has a source_id but is
  `supported: false`, and on any numeric claim with no source. Flagged
  claims must be confirmed or cut by the editor before approval. The worked
  example was reworked to match: Stage 3 now fails the unsourced
  injury-rate figure, and the editor resolves the flags in Stage 5. The
  skill mirrors all of this. **Re-run:** the new prompt went to a fresh
  Opus 5.5 grader that was not told what had been planted. The seeded draft
  now **fails**: the "68%" claim came back `source_id: null`,
  `numeric: true`, and the "60%" claim came back as a misquote of S1c
  (40%). The clean draft **passes** with no false fail. One run each, so
  this is not a variance test. The grader is the same model family.
- **race-result-content-engine, real athletes.** Namberger, Blanchard,
  Jornet and Evans are replaced with fictional names and fictional teams
  in the playbook and in `public/lens/templates/race-result-data-feed-template.csv`.
  The worked example now opens with an "Illustrative example... fictional"
  line. CSV source URLs are `example.com` placeholders, and the new
  `Source_url_2` and `Row_id` columns are present on every row (18 fields,
  validated). The feed-sourcing rule now requires the official results
  page, or two agreeing sources.
- **training-content-engine, credibility gate.** Approved sources are now
  supplied with their key finding. The gate fails claims that overstate or
  misstate a finding (population, sessions vs time, intensity split, effect).
  It returns `supported: false` with `source_finding: "NOT SUPPLIED"` when
  no finding is given. **Re-run:** fresh grader, same two v1 misquotes.
  Seiler ("training time") and Stöggl ("80/20") both now **fail**, where
  both had passed before. A source with no finding went down the
  human-check path as designed. The W01 CSV citation cue now states both
  findings accurately.

### Other edits applied

- **ai-studio-news-pipeline:** feed URLs are now OpenAI `news/rss.xml` and
  DeepMind `blog/rss.xml`, and the Anthropic entry says it has no official
  RSS. The worked example's line 1 is 48 characters. The claim count was
  corrected. A brevity check was added. Step 3.2 now says to re-read the
  implication after the fact check. In the skill: underscore labels,
  punctuation bans, no hardcoded brand in the audio line, no
  "tested-by-us" source, and a feed list that matches the playbook.
- **earned-media-pitch-generator:** the sample pitch is now 124 words. The
  composite formula is defined. The 30-day recency rule now blocks
  "pitch". The spray check names cosine similarity. There is an
  embargo-list cap, and the worked example's 26-pitch embargo was fixed to
  match it. The Phase 1 "conditional" gap is closed. The skill now matches
  on scales, recency, list size and the refusal rule, and adds a
  decline-precision eval.
- **segment-broll-production:** the tool line is now Runway, Kling or
  Gemini Omni (Higgsfield as a front end), plus Nano Banana 2 or GPT Image
  2, and notes the Sora API shutdown (Kling and Gemini Omni were verified
  current this session). The subject enum is now sport-neutral. An archive
  input was added. S012 is now a no-subject environment plate. The
  negative-prompt rule now returns a re-shoot when the subject would
  change. An EU AI Act Article 50 line was added, checked against the
  Commission FAQ and worded as the deployer labelling duty. CSV enums are
  aligned. The skill gets its cell count, output wording, hand-off slug and
  Eval B5 fixed.
- **seo-cluster-generator:** a Step 4.1 AI-answer citation log (AI Mode,
  ChatGPT search, Perplexity), attributed to the 5W/Brandlight finding
  that overlap fell below 20% by April 2026. The hook test now also checks
  AI-cited sources. The intent heuristics are split. `estimated_volume` is
  now `summed_volume_from_input`. One spoke floor (12) is used throughout.
  The step now says Keywords Explorer. "Helpful Content Update" is now
  "core update" (both checked). The ultras hook now rests on shoe data.
  The skill is aligned on top 8, 16 months, three to five competitors and
  15 to 25 briefs.
- **social-content-factory:** similarity is measured as word 3-gram
  Jaccard. The TikTok script is capped at 220 words. The Exercise 3
  threshold is now 0.4. A proof-faithfulness rule was added on every
  channel. Hashtags are capped at 5 in total (Instagram's cap since
  December 2025). The worked example's LinkedIn line 1 is 63 characters and
  now passes. The cadence and tweet-1 rationale were fixed. `checks` is
  marked advisory. The skill's CTAs were removed and its hashtag and
  punctuation rules aligned.
- **training-content-engine:** POV prescriptions are now rules of thumb,
  not absolutes. Taxonomy anchors can't be duplicated.
  `long_form_blog_url` and `x_thread` were renamed.
- **video-script-system and video-script-to-heygen:** "18 months" is now
  "48 months". The hook composite weighting is defined. Under-length
  scripts are flagged. The skill's Phases 3 to 5 and its avatar and voice
  lookups were rewritten for the HeyGen v3 API (`POST /v3/videos`,
  `GET /v3/videos/{video_id}`, `/v3/avatars/looks`, `/v3/voices`). The
  retirement date (v1 and v2 supported through 31 Oct 2026) and the
  payload fields were checked on developers.heygen.com (changelog,
  endpoint-version-comparison, create-video, get-video). Pricing was
  rewritten from HeyGen's help centre (pay-as-you-go USD, no web plan
  required). The word-count targets and phase count were reconciled, and a
  note explains the TTS departure from the playbook's under-30-word rule.
  `make-cards.py` now fits titles to width, re-tested offline: "The Lens"
  is unchanged at 220pt. Emojis were removed from the skill and both
  scripts. The HeyGen calls themselves were **not** executed.

### Not applied, and why

- **Schema changes to `src/content.config.ts`** (reports 01, 02, 03, 08,
  09): not needed, and out of scope.
- **`gpt-6` in frontmatter:** not tested, and not in the enum.
- **LinkedIn "spam signal" clause** (social edit 7): not verified this
  session.
- **Structural skill and playbook gaps** were left for a later pass: the
  prompts missing from skills, differing phase numbering and hand-off
  lists, the b-roll skill's "modification map" output and its subject
  contradiction, the ai-studio triage schema, the 30-post review taper and
  the watchlists.
- **Worked-example SERP names** in seo-cluster-generator were left, since
  they are illustrative.
- **The training worked example's "75% max HR" beginner rule** was left
  as it is. It is uncited, and fixing it needs a coaching decision.
- **Pre-existing em dashes** were left: SKILL.md bullet-label separators,
  and one line in the eval-gated-drafting skill.
- **Hard-coded "46 playbooks, 26 skills" badge and macOS font paths** in
  the HeyGen scripts were left.
- **`src/pages/lens/capabilities.astro`** shows as modified in the working
  tree. It was not changed by this retest.
