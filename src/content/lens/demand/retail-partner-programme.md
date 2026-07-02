---
title: "Retail partner programme, bike shops, run stores, multisport retailers"
stack: demand
description: "Run a retail partner programme that sells through specialist shops. Tier menu, sell-in kit, training cadence, sell-through measurement, honest annual review."
outputs: "Partner tier menu, sell-in kit, training programme, sell-through scorecard, annual review framework"
readMin: 15
shipTime: "2 working weeks"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content", "lifecycle"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-08-13
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts:

1. A **partner tier definition** with three tiers (concept, range, stocking), the support each receives, the expectations the brand holds and the thresholds that move a partner up or down.
2. A **sell-in kit** of six structured pieces (one-page positioning, range overview, margin and terms, best-sellers data, display kit and first-90-days plan), written for shop owners who read in seconds rather than minutes.
3. A **training cadence** mapped per tier with onboarding, new-product launch sessions, seasonal refreshers and an on-demand library, plus the engagement tracking that makes the cadence accountable.
4. A **sell-through scorecard** per partner per quarter, with the five tracked metrics (sell-through ratio, range coverage, customer-review mentions, training engagement, marketing co-investment) and a shared format the partner can respond to.
5. An **annual review framework** that holds the demote conversation when the data supports it and renews tiers honestly rather than out of relationship inertia.

## Who this is for

A growth or scale-stage endurance brand selling through 20 or more retail partners, with a sales lead who can negotiate partner tiers and a brand lead who can run partner training. If the brand sells exclusively DTC or has fewer than 10 retail accounts, the discipline is overkill, revisit when the count crosses the threshold.

## Before you start

- [ ] Current partner list with each account's sell-in data for the last 12 months (units shipped, revenue, returns) from your accounts receivable or wholesale platform (NuOrder, Joor, Brandwise, or your ERP)
- [ ] Sell-through data per partner where available (shops on Lightspeed, Shopify POS or Vend often share this; ask)
- [ ] Margin terms documented per tier, agreed with finance
- [ ] A partner-facing portal capable of hosting documents and recorded training (Notion, SharePoint, the brand's own platform)
- [ ] A sales lead and a brand lead committed to running the training cadence
- [ ] Marketing co-fund budget sized against the partner programme (typically 2 to 5% of partner revenue)
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode

The annual review is the most important part of the programme. If the team is not willing to demote underperforming partners, the rest of the playbook will not change much.

## The pipeline

Six phases. Tier definition and sell-in kit take a working week. Training cadence and measurement land in the second week. Reviews run quarterly thereafter.

### Phase 1, partner tier definition

Three tiers, each with explicit support and expectations.

The standard menu:

| Tier | Support from brand | Expectation on partner | Typical count |
|---|---|---|---|
| A, concept partner | Best margins, exclusive products, on-site training, marketing co-fund, dedicated account manager | Carries full range, dedicates shop space, hosts events, attends every training session | 10 to 30 globally for a growth-stage brand |
| B, range partner | Standard margins, sell-in kit, virtual training, shared account inbox | Carries core range, attends two training sessions a year, represents brand fairly | The bulk of accounts |
| C, stocking partner | Standard product access, basic materials, newsletter | Carries select SKUs, no dedicated commitment | The long tail |

**Step 1.1, assign each partner to a tier.**

```text
SYSTEM: You assign each partner to a tier based on annual sell-
through, brand representation quality, training engagement and
geographic importance. You return tier assignment with the
single rationale that drove the call.

USER:
Partner: {PARTNER_NAME}
Country: {COUNTRY}
Annual revenue with the brand: {GBP}
Sell-through ratio (last 12 months): {DECIMAL}
Range coverage (number of SKUs stocked): {COUNT_AGAINST_RANGE_SIZE}
Training engagement (sessions attended last 12 months): {COUNT}
Customer reviews mentioning this partner: {COUNT}
Marketing co-fund participation: {YES_OR_NO}
Geographic importance: {HIGH | MEDIUM | LOW}

Return JSON:

{
  "partner": "<name>",
  "tier_assignment": "<A | B | C>",
  "rationale": "<single sentence>",
  "concern": "<the thing to watch in the next quarter or null>"
}

Rules:
- Tier A only with above-target sell-through and active engagement.
- Tier C is for partners with sub-threshold sell-through and low
  engagement, regardless of geographic importance.
- Geographic importance can pull a borderline partner up one tier
  if the brand has no other coverage in the region.
```

You should now have a tier assignment per partner with the call documented.

### Phase 2, sell-in kit

The materials a shop owner reads to decide whether to stock the brand. Six pieces.

**Step 2.1, draft each piece.**

```text
SYSTEM: You draft a partner sell-in kit piece for an endurance brand.
The reader is a shop owner with thirty other brands pitching. Brevity
and substance win. You write tight, technical where useful, with
specific numbers rather than adjectives.

USER:
Brand: {BRAND}
Piece type: {ONE_PAGE_POSITIONING | RANGE_OVERVIEW | MARGIN_AND_TERMS | BEST_SELLERS | DISPLAY_KIT_BRIEF | FIRST_90_DAYS}
Brand positioning: {SUMMARY}
Product range: {LIST_OR_LINK}
Margin structure: {DETAILS}
Best-seller data from comparable shops: {PASTE}
Audience the shop should recommend the brand to: {DESCRIBE}

Constraints:
  - One page maximum
  - No marketing language
  - Specific numbers and facts

Return JSON:

{
  "piece_type": "<type>",
  "draft": "<the body>",
  "the_thing_a_brand_deck_would_say_that_this_does_not": "<editorial choice note>",
  "expected_shop_owner_pushback": "<one sentence on the likely objection>"
}

Rules:
- One page each. If it does not fit, the piece is overwritten.
- "expected_shop_owner_pushback" is honest. Use the rebuttals from
  the message-house-generator if available.
```

**Step 2.2, assemble the kit.**

The six drafts become one PDF or one shared partner-portal page. The first-90-days plan is the one most brands skip and most shop owners value most, what the brand will do in the first quarter of the partnership to drive sell-through.

You should now have a six-piece sell-in kit the sales team can take into every prospect conversation.

### Phase 3, training cadence

Shop staff are the brand's mouth in the store. Untrained staff become the cheapest competitor's salesperson by default.

**Step 3.1, set the cadence.**

| Touchpoint | Audience | Format | Frequency |
|---|---|---|---|
| Onboarding | New partner | 90-min product-knowledge session, in-person where feasible, recorded for later hires | Within 30 days of signing |
| New-product launch | Tier A and B | 30-min deck plus product walk-through | Every major launch |
| Seasonal refresher | Tier A and B | 45-min session covering range, audience, fitting tips, common questions | Start of each season |
| On-demand library | All tiers | Notion or SharePoint with every recorded session, spec sheet, fitting guide, warranty FAQ | Always available |

**Step 3.2, draft the training content.**

```text
SYSTEM: You draft a partner training session for an endurance brand.
The audience is shop staff who have 45 minutes and want practical
selling tactics, not product hype. You combine product knowledge
with selling moves ("when a customer says X, here is the response
that converts").

USER:
Session type: {ONBOARDING | LAUNCH | SEASONAL_REFRESHER}
Products covered: {LIST_OR_DETAIL}
Audience the shop should recommend these to: {DESCRIBE}
Common customer questions: {LIST}
Brand's positioning and proof points: {SUMMARY}

Return JSON:

{
  "session_outline": [
    {
      "block_minutes": <int>,
      "topic": "<title>",
      "objective": "<what the staff should be able to do after>"
    }
  ],
  "selling_moves": [
    {
      "customer_says": "<verbatim>",
      "staff_response": "<the response that converts>"
    }
  ],
  "post_session_quiz": [
    {"question": "<text>", "correct_answer": "<text>"}
  ]
}

Rules:
- 5 selling moves minimum per session.
- Quiz has 5 questions, used to verify the session was actually
  watched on demand.
- No marketing language.
```

**Step 3.3, track engagement.**

Training engagement tracks at the partner level. A Tier B partner that has not attended a session in two seasons becomes a Tier C candidate at the annual review.

You should now have a training cadence with content briefs and engagement tracking.

### Phase 4, sell-through measurement

What the brand actually tracks per partner per quarter.

**Step 4.1, instrument the five metrics.**

- **Sell-through ratio.** Units sold from shop floor divided by units shipped to shop. Healthy is 70% or above within the season. Most shops on Lightspeed, Shopify POS or Vend can share this when asked.
- **Range coverage.** Which SKUs the partner actually carries and sells. Partners stocking only the discount lines are not representing the brand.
- **Customer reviews mentioning the partner.** Proxy for whether the partner is selling the brand well or just transactionally. Search Trustpilot and Google Reviews for the partner's name in the brand's reviews.
- **Training engagement.** Staff hours invested in brand training.
- **Marketing co-investment.** Does the partner co-fund local campaigns? Yes or no plus the amount.

**Step 4.2, build the scorecard.**

```text
SYSTEM: You produce a quarterly sell-through scorecard for a retail
partner. You compare actuals against tier thresholds and against the
prior quarter. You generate a renewal lean (used at annual review)
and a concrete next-quarter focus.

USER:
Partner: {PARTNER_NAME}
Tier: {TIER}
This quarter:
  Sell-through ratio: {DECIMAL}
  Range coverage: {COUNT}
  Customer reviews mentioning partner: {COUNT}
  Training hours: {HOURS}
  Marketing co-invest: {GBP_OR_NONE}
Last quarter (same metrics): {PASTE}
Tier thresholds: {SUMMARY}

Return JSON:

{
  "partner": "<name>",
  "metric_status": {
    "sell_through": "<above_threshold | at | below>",
    "range_coverage": "<above | at | below>",
    "customer_mentions": "<above | at | below>",
    "training": "<above | at | below>",
    "co_invest": "<above | at | below>"
  },
  "trend_vs_last_quarter": "<improving | flat | declining>",
  "renewal_lean": "<promote | maintain | demote | end>",
  "single_concern": "<one sentence>",
  "next_quarter_focus": "<the specific action this quarter>"
}

Rules:
- "renewal_lean" is provisional. The annual review holds the call.
- "end" requires below-threshold on sell-through and below-threshold
  on at least two other metrics for two consecutive quarters.
```

**Step 4.3, share with the partner.**

The scorecard is shared, not held. The partner sees it before the tier-move conversation. Most reactions are constructive when the data is honest and the format is shared.

You should now have a quarterly scorecard per partner that informs the annual review.

### Phase 5, annual review and tier adjustment

Once a year, every partner reviewed against the year's scorecards.

**Step 5.1, run the annual review prompt.**

```text
SYSTEM: You generate an annual review recommendation for a retail
partner based on four quarterly scorecards and qualitative notes
from the account manager.

USER:
Partner: {PARTNER_NAME}
Tier: {CURRENT_TIER}
Quarterly scorecards (last 4): {PASTE_ALL_FOUR}
Account manager qualitative notes: {PASTE_NOTES}
Geographic importance: {HIGH | MEDIUM | LOW}

Return JSON:

{
  "partner": "<name>",
  "annual_summary": "<two sentences>",
  "tier_decision": "<promote to A | maintain at A | promote to B | maintain at B | demote to C | end>",
  "rationale": "<two sentences>",
  "conversation_script_open": "<the opening line for the annual review call>",
  "data_to_lead_with": "<the single data point that anchors the call>"
}

Rules:
- "end" requires both quantitative and qualitative evidence over
  the year.
- "tier_decision" overrides the renewal lean from quarterly scores
  when account manager qualitative notes carry weight.
- "conversation_script_open" is respectful and data-led.
```

**Step 5.2, hold the demote conversations.**

The conversation is structured around the data, not around the relationship. Most partners accept a demote when the scorecard is clear. The few that do not are partners whose departure was already overdue.

You should now have a documented tier decision per partner and the script for the conversation.

### Phase 6, brand-owned account in partner regions

Even with strong partners, the brand maintains some direct presence in each key region. A DTC online experience for that geography and occasional brand events in the city. This is brand visibility that drives traffic to partners rather than competition with them.

Partners initially resist this. The brands that explain it well, direct equals top-of-funnel, partner equals consideration plus close, find that partners come to appreciate the brand-level demand it generates over time.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand, scale-stage, with 84 retail accounts across UK and Europe ahead of the Vahla Range launch.

**Phase 1 output.** Tier assignment across 84 accounts. 18 Tier A, 44 Tier B, 22 Tier C. The biggest surprise is two accounts that had been called "Tier A" internally for years scoring as Tier B on the new rubric because their sell-through ratios were below 70% for the year. Two accounts in Berlin and Lyon get geographic-importance pull-ups despite middling sell-through because Cascadia has no other coverage in those cities.

**Phase 2 output.** Six-piece sell-in kit drafted. The one-page positioning lands the line "Trail kit that survives the second loop, season after season." The margin and terms page is one page of plain numbers with no hidden steps. The first-90-days plan commits Cascadia to a co-funded shop event, a fitting clinic for staff and a local-market paid push within the first quarter.

**Phase 3 output.** Training cadence live. Onboarding session at 90 minutes runs in-person for the 18 Tier A accounts. The recorded version sits in the Cascadia partner Notion. The launch session for the Vahla shorts runs in March, 90% of Tier A and 72% of Tier B accounts attend.

**Phase 4 output.** Quarterly scorecards generated for all 62 Tier A and B accounts. 8 partners flag for concern. The format is shared with each partner ahead of the conversation. One partner asks for the scorecard format to be added to their internal review, which Cascadia agrees to.

**Phase 5 output.** Annual review. 4 partners promoted (3 from B to A, 1 from C to B). 8 maintained. 6 demoted (5 from B to C, 1 from A to B). 3 ended. The end conversations are difficult but each lands cleanly with the data leading. Total wholesale revenue holds within 4% of prior year. Cost-to-serve drops 18% as the Tier C support tier scales back. Average sell-through across the remaining Tier A and B base lifts to 78% from 71%.

**Phase 6.** Cascadia opens a small brand-owned pop-up in Manchester during October trail-running festival season. The pop-up drives 1,400 walk-ins and Cascadia routes online buyers in the region to the nearest partner. The two largest Manchester partners report stronger Q4 sales than the prior year and credit the brand-level pop-up.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, score five partners on the rubric

Pick five of your existing partners. Run the Phase 1 prompt for each. Read the tier assignments. If any assignment surprises you, the surprise is the conversation to hold. Partners called Tier A by habit but scoring as Tier B is the most common revelation.

### Exercise 2, draft the first-90-days plan for one Tier A prospect

Pick a Tier A prospect you are courting. Draft the first-90-days plan through the Phase 2 prompt. Send to the prospect alongside the rest of the sell-in kit. The first-90-days commitment converts more Tier A prospects than any other piece of the kit.

### Exercise 3, write the conversation script for one demote

Identify a partner you should demote but have been avoiding the conversation with. Run the Phase 5 prompt with that partner's data. Read the conversation script open. The script lets you hold the conversation as a structured one, not a personal one. The partner often responds better than the team expects.

## The eval gates

**Eval 1, sell-through health.** 70% or above within-season sell-through ratio across Tier A and B partners. Below that, the channel is leaking inventory that becomes off-season clearance pressure.

**Eval 2, training engagement.** 80% or above of Tier A and B partners attend at least one training session per quarter. Below that, the brand is being sold by uninformed staff.

**Eval 3, tier honesty.** Tier moves at annual review follow the data rather than the relationship comfort. If no partners moved tiers in a year, the review was not a real review.

**Eval 4, coverage breadth.** Geographic coverage in priority markets. Gaps flagged for partner recruitment.

**Eval 5, partner satisfaction.** Annual partner survey, NPS or equivalent. A programme that demotes honestly should still earn neutral-to-positive partner sentiment because the discipline is shared.

## The failure modes

**Treating all partners as the same.** The tier menu exists for a reason. A bike shop in Bristol with 800 keen customers is not the same as a sport chain stocking 40 brands.

**Sell-in kit as a deck.** Shops do not have time for a 60-slide brand deck. The sell-in kit is one-page positioning plus the data the shop owner needs to make a stocking decision.

**Training that gets ignored.** Boring product-spec walkthroughs have zero attendance. Training that combines product knowledge with selling tactics ("when a customer says X, here is the response that converts") gets engagement.

**Sell-through measured only by revenue.** Revenue without sell-through ratio masks dumping. A partner that bought £200k of inventory but only sold £80k of it is a problem disguised as a strong account.

**Avoiding the demote conversation.** Partners that have slid do not self-correct without the conversation. Have it. The relationship survives if the conversation is data-led and respectful.

## The pattern in practice

Illustrative scenarios that show common shapes retail partner programmes take. Specifics are illustrative and the patterns repeat.

**Premium cycling brand, scale-stage, the tier reckoning.** A brand with 200 or more stocking partners and no way to tell which are performing. Installing the tier-and-scorecard system and running one honest annual review typically splits the base into a small top tier, a larger middle, a long tail of low-performance partners and a meaningful number of relationships to end. Total revenue usually holds, cost-to-serve drops materially and sell-through ratio across the remaining base improves within two seasons.

**Trail running brand, growth-stage, the training cadence finding.** A brand treating all running stores identically. The training cadence reveals that a substantial fraction of partners have never had a staff member attend a session. Restructuring around the tier definitions and investing heavily in a small group of Tier A partners typically lifts comparable sales in those shops materially year-on-year.

**Multi-sport brand, the skipped-review failure.** A common pattern is the brand executes phases 1 to 4 cleanly but skips Phase 5 because nobody wants to make the demote calls. Partners drift to Tier C quality with Tier A cost-to-serve and the programme decays. The framework only works if the discipline of the annual review is held.

## Hand-off

The partner programme feeds:
- **race-day-demand-pipeline**, partners host race-day activations
- **event-sponsorship-playbook**, events held at major partner cities
- **gear-launch-sequence**, partners are the natural launch distribution layer
- **direct-to-coach**, coaches drive customers to partners, messaging aligns
- **brand-guardrails-as-code**, partner-facing materials run through the same brand-voice gates
