---
title: "Ambassador programme, athletes, rights, content cadence"
stack: demand
description: "Run an athlete ambassador programme that earns audience credibility. Selection rubric, contract with AI augmentation rights, monthly cadence, quarterly review."
outputs: "Athlete selection rubric, contract template with AI clauses, content cadence, performance scorecard"
readMin: 22
shipTime: "2 working weeks"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content", "organic-social", "pr"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-06-18
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts:

1. A **scored selection roster** of 30 to 80 candidate athletes against a six-dimension rubric, with composite scores, tier recommendations and the audience-scrape evidence behind each score.
2. A **contract template** with the standard ambassador clauses plus the 2025-onwards AI augmentation, likeness, disclosure and sunset language built in.
3. An **onboarding shoot plan** scoped for the first sixty days after signing, with the asset list, the location and weather windows, and the archive structure the AI augmentation pipeline will draw from.
4. A **monthly content cadence** mapped per athlete with one major piece per quarter, one mid-piece per month and two lightweight pieces per month, plus the briefs that produce them.
5. A **quarterly performance scorecard** instrumented across audience growth, engagement delta, pipeline-qualified action and athlete sentiment, with a documented renewal decision for each athlete at term end.

## Who this is for

A growth or scale-stage endurance brand running, or about to run, an athlete-ambassador programme of three or more signings, with a marketing lead who can run a contract negotiation and a content lead who can deliver against a shoot plan. If the brand has never signed an athlete and does not yet have a positioning document, this playbook is premature. Run the message-house-generator first.

## Before you start

- [ ] A list of 30 to 80 candidate athletes with public profiles you can scrape (Strava, Instagram, race-result archives, federation rosters)
- [ ] Public race-result data from the relevant federation or platform (UTMB Index, Power of 10 for UK athletics, Triathlon Australia, USA Cycling)
- [ ] An Instagram and Strava follower count for each candidate, plus a sample of their last 20 posts copied into a shared doc
- [ ] A draft contract from your sports-marketing solicitor that you can layer AI clauses onto, or budget for one
- [ ] A signed-off shoot budget plus a content lead who has run a multi-day shoot before
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode and a CSV-paste workflow
- [ ] (Optional but useful) past partnership outcomes from at least three previous athlete signings, used to backtest the rubric

If the list of candidates is missing or vague, stop and build it. The rubric does not invent athletes. It scores the ones you already have on the page.

## The pipeline

Six phases. Roughly a working week for selection and contracting, then a second week for the shoot plan and the cadence build.

### Phase 1, selection rubric and scoring

Six dimensions, scored 0 to 10 except where binary. The model does the audience scrape and the content-credibility pass. Humans hold the final qualitative dimensions.

**Step 1.1, download the scorecard template.**

Grab [ambassador-selection-scorecard.csv](/lens/templates/ambassador-selection-scorecard.csv). It has columns for every dimension, plus example rows showing what good and bad scores look like. Open in Sheets or Excel.

**Step 1.2, run the audience-scrape prompt for each candidate.**

```text
SYSTEM: You analyse the public social and race-result data of a
candidate athlete and score their audience-alignment and content-
credibility against a brand's target segments. You return JSON only
and do not invent data points the inputs do not contain.

USER:
Brand target segments: {LIST_BRAND_AUDIENCE_SEGMENTS}
Candidate athlete: {ATHLETE_NAME}
Sport and discipline: {DISCIPLINE}
Public race results (last 24 months): {PASTE_RESULTS_DATA}
Last 20 social posts (copied verbatim): {PASTE_POSTS}
Follower count Instagram: {FOLLOWERS_IG}
Follower count Strava: {FOLLOWERS_STRAVA}

For this athlete return:

{
  "result_credibility": <0-10, anchored to results at the level the brand audience cares about>,
  "audience_alignment": <0-10, overlap between athlete audience and brand segments>,
  "audience_overlap_pct_estimate": <integer percent, estimate with confidence band>,
  "content_credibility": <0-10, based on whether posts read like someone who's done the work>,
  "personal_alignment_signals": ["<public stances on doping, environment, gender parity, etc.>"],
  "schedule_realism_estimate": <0-10, accounting for race calendar density>,
  "evidence": {
    "audience_alignment": "<one-sentence pointer to a specific post or result>",
    "content_credibility": "<one-sentence pointer>"
  }
}

Rules:
- Score 0 to 10. Round to one decimal place.
- "evidence" must point at a specific post or result, not a generalisation.
- Return audience_overlap_pct_estimate as a single integer.
- If a field cannot be scored from the inputs, return null and note in evidence.
```

**Step 1.3, score the qualitative dimensions by hand.**

The model produces draft scores on audience, content and schedule. Visual rights cleanliness and personal alignment land on humans. Visual rights is a yes or no. Personal alignment needs the brand to read the athlete's public record and decide whether the brand wants to be associated.

**Step 1.4, compute the composite.**

Composite is the weighted sum, result credibility 20%, audience alignment 25%, content credibility 20%, personal alignment 15%, schedule realism 10%, visual rights cleanliness as a binary gate. Composite scores above 7.5 with a pass on visual rights become Tier A candidates. 6.0 to 7.5 are Tier B. Below 6.0 fall off.

**Expect output like:**

| Athlete | Result | Audience | Content | Personal | Schedule | Visual rights | Composite | Tier |
|---|---|---|---|---|---|---|---|---|
| Beth Lyons | 8 | 9 | 8 | 9 | 7 | pass | 8.1 | A |
| Marcus Hale | 9 | 4 | 6 | 8 | 8 | pass | 6.6 | Decline |
| Saoirse Burns | 5 | 9 | 9 | 9 | 9 | pass | 8.2 | A |

You should now have a ranked roster with composites, tier recommendations and the evidence that produced them.

### Phase 2, contract template with AI clauses

The standard ambassador contract handles exclusivity, payment, deliverables and termination. The 2025-onwards layer is what most templates miss.

**Step 2.1, draft the AI-augmentation clauses with this prompt.**

```text
SYSTEM: You draft contract clauses for an athlete ambassador contract,
covering AI augmentation rights, likeness boundaries, disclosure
obligations and a sunset on synthetic-content rights. You write in
plain English suitable for solicitor review. You do not write
boilerplate, only the AI-specific clauses.

USER:
Brand: {BRAND_NAME}
Athlete: {ATHLETE_NAME}
Sport and discipline: {DISCIPLINE}
Contract term: {TERM_LENGTH_MONTHS}
Brand's plan for AI augmentation: {DESCRIBE_PLAN}
Athlete's public stance on synthetic content (if known): {NOTE_OR_NONE}

Return a JSON object:

{
  "ai_augmentation_rights": "<clause text>",
  "likeness_boundaries": "<clause text>",
  "disclosure_obligation": "<clause text>",
  "sunset_clause": "<clause text>",
  "review_and_consent_flow": "<clause text>",
  "termination_triggers_synthetic_misuse": "<clause text>"
}

Rules:
- Each clause is plain English, suitable for solicitor edit.
- The augmentation clause must distinguish "augmenting reality"
  (time-of-day, weather, environmental) from "fabricating a moment"
  (the athlete in scenarios they did not participate in).
- Sunset clause defaults to 18 months after contract end unless
  the inputs override.
- Voice cloning and face-or-body substitution require explicit
  separate written consent. No exceptions baked in.
- Disclosure clause references a "reasonable viewer" test.
```

**Step 2.2, integrate with the standard contract.**

The model's six clauses bolt into the standard contract under a new "Synthetic content and AI augmentation" section. Send the assembled draft to the sports-marketing solicitor for review. Most solicitors will edit the language for jurisdiction but accept the structure.

**Step 2.3, refuse to sign without the clauses.**

The eval gate that matters. A contract without the AI section is not signed. Build this into the team's contract checklist.

You should now have a contract template ready for negotiation and a no-AI-section-no-signing rule documented.

### Phase 3, onboarding shoot plan

The first sixty days after signing produce the archive that supplies content for the next twelve months. Plan for two to three shoot days across locations relevant to the athlete's sport.

**Step 3.1, scope the asset list with this prompt.**

```text
SYSTEM: You scope a multi-day shoot plan for an athlete ambassador
onboarding. The plan must produce the archive an AI-augmentation
pipeline will draw from for twelve months. You list every asset by
type, the environment it needs, and the shoot day it falls on.

USER:
Athlete: {ATHLETE_NAME}
Discipline: {DISCIPLINE}
Brand product range to feature: {PRODUCT_LIST}
Available shoot days: {NUMBER_OF_DAYS}
Available locations and seasonal windows: {LOCATIONS_AND_WINDOWS}
Brand's planned content output over 12 months: {LIST_PLANNED_PIECES}

Return JSON:

{
  "shoot_days": [
    {
      "day": <number>,
      "location": "<location>",
      "weather_window": "<conditions needed>",
      "assets": [
        {
          "type": "<product-in-hand | training | environment | talking-head | candid>",
          "count": <number>,
          "description": "<one sentence>",
          "augmentation_potential": "<high | medium | low>"
        }
      ]
    }
  ],
  "archive_structure": "<how to organise the captured footage so the augmentation pipeline can find it>"
}

Rules:
- Three categories of asset minimum, training footage, product-in-hand
  stills, environment b-roll.
- Augmentation potential is high when the asset can yield multiple
  variants (time-of-day swap, weather variant, environment swap).
- Total assets per shoot day must be deliverable in 8 working hours.
```

**Step 3.2, brief the photographer and videographer.**

Send the shoot plan to the production crew with two weeks of lead time. Lock the locations and the weather window. Build in a weather-contingency day if the location demands specific conditions.

**Step 3.3, ship the archive.**

Captured footage lands in the archive structure from the prompt. Tag each asset by type, location, weather, athlete and product. This tagging is what makes the augmentation pipeline (see segment-broll-production) work fast a year later.

You should now have a populated archive ready to feed twelve months of content.

### Phase 4, monthly content cadence

The cadence has to be sustainable for the athlete, valuable for the audience and tractable for the marketing team.

**Step 4.1, run the cadence prompt.**

```text
SYSTEM: You generate a twelve-month content cadence for an athlete
ambassador. The cadence respects the athlete's race calendar,
distributes content across one major piece per quarter, one mid-piece
per month and two lightweight pieces per month, and includes zero
forced posts.

USER:
Athlete: {ATHLETE_NAME}
Race calendar (next 12 months): {LIST_RACES_WITH_DATES}
Available shoot footage from onboarding: {ARCHIVE_SUMMARY}
Athlete's posting cadence on their own channels: {CADENCE_NOTE}
Brand's anchor events: {LIST_ANCHOR_EVENTS}

Return JSON:

{
  "quarterly_majors": [
    {"quarter": "Q1", "piece": "<format>", "anchor_event": "<event>", "shoot_dependent": <true | false>}
  ],
  "monthly_mids": [
    {"month": "Jan", "piece": "<format>", "angle": "<one sentence>"}
  ],
  "lightweight_pieces": [
    {"month": "Jan", "pieces": [{"week": <1-4>, "format": "<format>", "trigger": "<what cues this>"}]}
  ],
  "zero_force_months": ["<months where output should be light because the athlete is racing or recovering>"]
}

Rules:
- Quarterly majors anchor to a real event or a real season moment.
- Monthly mids are not condensed majors, they have their own format.
- Lightweight pieces are triggered (race result, training milestone,
  weather window) rather than scheduled.
- Zero-force months exist. Identify at least one per year.
```

**Step 4.2, share with the athlete for adjustment.**

The athlete sees the cadence before it is locked. Adjustments commonly involve protecting a race or a recovery window. Make the adjustments and re-share.

You should now have a cadence that the athlete has signed off on and that the marketing team can build briefs against.

### Phase 5, performance instrumentation

Quarterly, per athlete, four numbers.

**Step 5.1, instrument the four metrics.**

The numbers are audience growth attributable to the athlete partnership, engagement delta on brand-tagged content against the athlete's non-branded posts, pipeline-qualified actions tied to athlete content, and athlete sentiment in interviews where the brand is not paying for the message.

In Instagram Insights, pull the engagement rate per branded post and per non-branded post over the quarter. In Google Analytics 4, build a custom audience for users who landed via an athlete-tagged UTM and track conversion. In Klaviyo or your ESP, segment signups that came from athlete-attributed pages. For sentiment, monitor athlete press, podcast appearances and unprompted social mentions.

**Step 5.2, run the quarterly scorecard prompt.**

```text
SYSTEM: You generate an athlete partnership scorecard from quarterly
performance data. You compare against the previous quarter and against
the partnership's baseline at signing. You produce a renewal lean.

USER:
Athlete: {ATHLETE_NAME}
Quarterly data:
  Audience growth attributable: {NUMBER}
  Engagement delta (branded / non-branded ratio): {DECIMAL}
  Pipeline-qualified actions: {NUMBER}
  Sentiment notes: {PASTE_NOTES}

Baseline at signing:
  Expected audience contribution: {NUMBER}
  Expected pipeline contribution: {NUMBER}

Previous quarter's scorecard: {PASTE_OR_NONE}

Return JSON:

{
  "performance_against_baseline": "<above | at | below>",
  "trend_vs_previous_quarter": "<improving | flat | declining>",
  "renewal_lean": "<expand | renew flat | taper | end>",
  "single_concern": "<one sentence, the thing to watch>",
  "single_strength": "<one sentence, the thing working>"
}

Rules:
- "renewal_lean" is provisional. The full renewal decision happens at
  contract end with the human-led review.
- Note when sentiment contradicts the numbers. A strong-engagement
  athlete with declining sentiment is a flag.
```

You should now have a quarterly scorecard per athlete that compounds into the renewal review.

### Phase 6, renewal review

At contract end, the structured conversation against the rubric and the four quarterly scorecards. Document the decision in writing.

The decision categories are renew with expanded scope, renew flat, taper to a lower tier or end gracefully. The choice ships into the next signing's rubric so the brand learns over time.

## Worked example, end-to-end

Cascadia Endurance, a UK trail-running apparel brand, scale-stage, building out its ambassador roster ahead of the Vahla Range sub-brand launch in spring.

**Phase 1 output.** 64 candidates scraped from UTMB Index, Strava and the UK ultra scene. 12 candidates score above 7.5, including Beth Lyons (top-30 at UTMB 2024, audience-alignment 9 because her followers are recreational ultra runners rather than fast-time elite) and Saoirse Burns, an independent trail coach with 8.4k followers who scores 9 on content credibility because her posts read like a coach's notebook rather than a brand feed. Marcus Hale, a sub-2:30 marathoner with 180k followers, scores 6.6 and falls below the threshold because his audience is fast-time elite and the brand's audience is mid-pack trail.

**Phase 2 output.** Contract template ships with six AI clauses bolted in. The augmentation clause is the load-bearing one. Cascadia retains rights to time-of-day, weather and environmental augmentation of captured footage. Voice cloning is prohibited. Face or body substitution into other contexts requires separate written consent. Sunset is 18 months after contract end. The brand's solicitor edits the language for UK jurisdiction and approves the structure.

**Phase 3 output.** Onboarding shoot for Beth Lyons across three days, two in the Lake District during the September weather window, one product-in-hand studio day in Manchester. 47 assets captured covering training b-roll, product stills, environment scenes and a talking-head sit-down about her UTMB race. The archive is tagged and ready.

**Phase 4 output.** Beth's cadence has four quarterly majors, twelve monthly mids and twenty-four lightweight pieces. Q3's major is the UTMB build-up film. Q4's major is the season retrospective. Two zero-force months are agreed, July (UTMB taper) and December (recovery and family).

**Phase 5 output.** Q1 scorecard, audience growth attributable to Beth is 4,200 new newsletter subscribers, engagement delta is 1.4x (branded posts outperform non-branded), pipeline-qualified actions land at 312 (signups from Beth-tagged content). Sentiment notes include a Trail Runner Mag interview where Beth describes Cascadia as "a brand that lets me show up as the runner I actually am." The single concern is that engagement softened in February when no major piece shipped. Renewal lean is expand.

**Phase 6.** Contract term ends in Q4. Cascadia expands Beth into a multi-year deal with one additional shoot a year and a co-development credit on a Vahla product. The other eleven Tier A signings each get a documented renewal call. Two are tapered. One ends gracefully. Eight are renewed.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, score five candidates yourself

Pick five candidates from your own list. Paste the audience-scrape prompt with your inputs into Claude. Read the JSON output. Now score the same five candidates by hand. Compare. If the model's scores correlate with yours at above 0.7, the rubric is calibrated. If not, the brand's audience-segment definitions need sharpening before you scale.

### Exercise 2, draft AI clauses for one signing

Take your most recent or your next signing. Paste the Phase 2 prompt with the contract specifics. Read the six clauses. Send to your solicitor with the question "are these enforceable in our jurisdiction and is anything missing?" If the solicitor rewrites more than half the language, the brand's plan for augmentation needs to be clearer in the inputs.

### Exercise 3, build a zero-force month for one athlete

Pick one athlete and one month in the next twelve. Define a deliberate light month where no contracted posts ship. Brief the athlete that the month is intentionally light. Track engagement the following month. The audience response to a zero-force window followed by a substantive piece typically beats the average month, and the data lets you make the case to leadership.

## The eval gates

**Eval 1, rubric backtest.** Score five previous partnerships (three that worked, two that did not) through the rubric. The composite should correlate with the actual outcome at above 0.7. Below 0.6 and the rubric weights need adjustment, often the audience-alignment weight is too low for the brand's category.

**Eval 2, contract clause coverage.** Every signed contract carries the AI section. No exceptions. Build the check into the contract checklist. Contracts without the section are blocked from signing.

**Eval 3, cadence sustainability.** Monthly, per athlete, the count of pieces actually shipped against the cadence target. If actuals run 50% below the target for two consecutive months, renegotiate the cadence rather than enforce it.

**Eval 4, audience response.** Quarterly engagement on athlete-branded content against the athlete's organic content. Below 50% consistently means the audience is not responding to the partnership. Surface in the renewal review.

**Eval 5, sentiment guardrail.** Sentiment notes from unpaid press, podcast and unprompted social. A partnership where the numbers improve but sentiment deteriorates is a partnership the brand is paying for and the audience is starting to read as manufactured. End or renegotiate.

## The failure modes

**Signing for audience size, not audience fit.** A 500k-follower athlete whose audience does not overlap with the brand's segments produces dramatically less than a 50k-follower athlete who is exactly aligned. The rubric weights audience alignment at 25% and content credibility at 20% for exactly this reason.

**Athletes signed without content-rights clarity.** Brand wants to re-cut footage 18 months later, the contract does not allow it. Resolve in the contract rather than in the production review.

**Performative partnership.** The athlete posts the contracted four posts a month, the posts look like ads, the audience tunes out. Reduce cadence, increase substance per piece. Two excellent pieces a month beats four mediocre ones every time.

**Athlete behaviour catches the brand off-guard.** A public falling-out, a positive doping test, a controversial public stance. The contract carries an exit clause and the brand rehearses using it before it is needed.

**Co-marketing without coordination.** The athlete is sponsored by three brands all running parallel campaigns. The audience sees a Christmas tree of logos. Either negotiate exclusivity bands at signing or accept the shared-spotlight reality and brief accordingly.

**Race-day congratulations template.** Same template every race. The audience pattern-matches the template as automated within two events. Replace with one specific observation per race, what changed in the athlete's performance, what the race meant in their season, what conditions they overcame.

## The pattern in practice

Illustrative scenarios that show common shapes ambassador programmes take. Specifics are illustrative and the patterns repeat.

**Premium cycling brand, scale-stage, the taper unlock.** A brand with eight ambassadors, substantial annual spend, no articulable return. Rebuilding the roster around the selection rubric typically tapers to a smaller named group with substantially higher fit. Total spend drops. Engagement on athlete content multiplies because the four remaining are real audience matches and the noise of the other four was suppressing the signal.

**Running brand, growth-stage, the wrong-tier audience.** A brand signing fast-time elite athletes whose audiences are primarily other fast-time athletes, while the brand's actual customer is an intermediate runner who cannot relate to 2:25 marathoners. Refocusing signings toward 2:50 to 3:30 marathoners with strong intermediate-runner audiences and relatable personal narratives typically lifts newsletter conversion from athlete-introduced content multiple times over. Audience fit beats raw performance in ambassador economics.

**Triathlon brand, the contract-clause-that-was-not.** A common historical failure is signing athletes who score well on the rubric but with contracts that do not include AI augmentation language. Eighteen months in, the brand wants to extend a hero shoot with AI variants for the next season and finds the contracts do not cover it. One athlete declines, the other grants permission for an unbudgeted fee. This is why AI augmentation rights are now table-stakes contract language with every contract carrying the clause from day one.

## Hand-off

The ambassador programme feeds:
- **race-day-demand-pipeline**, shoot scheduling around anchor events
- **segment-broll-production**, AI augmentation of shoot output across the year
- **earned-media-pitch**, press around signings and major results
- **social-content-factory**, channel-native athlete content
- **direct-to-coach**, Tier A coach-ambassadors who sit in both programmes
