---
title: "Subscription and membership programme for endurance brands"
stack: demand
description: "Design a subscription or membership tier that earns recurring revenue without diluting the brand. Tier shape, benefit design, cancellation expectations, attribution modelling."
outputs: "Customer-value hypothesis, tier menu, benefit-design sheet, cancellation flow, attribution framework"
readMin: 22
shipTime: "2 working weeks"
brandStage: ["growth", "scale", "enterprise"]
channels: ["lifecycle", "email", "content"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-08-20
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts:

1. A **customer-value hypothesis** naming the two or three things the brand can continuously deliver that justify a recurring price, sourced from existing customer research rather than internal brainstorm.
2. A **tier menu** with the recommended shape (free plus pro, tier-laddered, or club-anchored), pricing per tier with the reasoning behind the price and the unit economics per benefit.
3. A **benefit-design sheet** scoring each candidate benefit on specificity, cadence, capacity ceiling, cost-to-deliver and member-sentiment indicator, with a clear ship-or-cut call per benefit.
4. A **cancellation and pause flow** that respects the audience's intelligence, offers pause as a real alternative to cancellation, and writes the renewal communication that earns the next year.
5. An **attribution framework** measuring LTV delta, repeat-purchase rate, NPS delta, referral attribution and cost-to-deliver per member per month, with the quarterly review that holds the programme accountable.

## Who this is for

A growth or scale-stage brand with at least 12 months of customer purchase data, a clear sense of which products or services its audience values continuously rather than transactionally, and a marketing lead willing to design the programme around audience benefit rather than around revenue per member. If the brand is reaching for subscription as a way to lock in a struggling business, the playbook will surface that and recommend not launching.

## Before you start

- [ ] 12 months of customer-cohort data with purchase frequency, repeat rate and LTV per cohort from the brand's ecommerce platform (Shopify, Magento, your CRM)
- [ ] Customer research surfacing the benefits the audience would value continuously (from CEP research, post-purchase surveys, or the message-house-generator's proof points)
- [ ] Comparable subscription pricing in the brand's space, gathered from public pricing pages of three to five comparable subscriptions (Strava Premium, Rapha Cycling Club, On Wear-as-a-Service, The Pro's Closet membership)
- [ ] Unit-economic data per candidate benefit, cost-to-deliver per member per month modelled in advance of launch
- [ ] An ESP and a billing platform capable of subscription management (Stripe Subscriptions, Recurly, Klaviyo with subscription product set up)
- [ ] A capacity plan for any capacity-bounded benefits (group rides, in-person events, mechanic priority)
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode

If the customer research is thin, run a few interviews before this playbook. A subscription designed without buyer voice produces tier menus that nobody buys.

## The pipeline

Five phases. The hypothesis, tier menu and benefit design land in the first week. The cancellation flow and attribution framework finish in the second.

### Phase 1, customer-value hypothesis

Before designing tiers, articulate what continuously valuable thing the brand can deliver.

**Step 1.1, mine the existing customer research.**

The CEP research, message-house proof points and post-purchase surveys hold the answer. Pull the recurring themes. The six common benefit families:

- **Content.** Training plans, race-week guides, coaching access.
- **Service.** Bike fittings, gear servicing, mechanic priority, warranty extensions.
- **Access.** Pre-launch product access, sponsored event access, exclusive group rides or runs.
- **Community.** Moderated club channels, member-only events, athlete connection.
- **Wear-and-replace.** Gear refresh cadence, trade-up programmes.
- **Education.** Live coaching sessions, technique workshops, recovery guidance.

**Step 1.2, run the hypothesis prompt.**

```text
SYSTEM: You generate a customer-value hypothesis for an endurance
brand considering a subscription or membership programme. You name
the two or three things the brand can continuously deliver, anchored
to existing customer research. You explicitly reject benefits that
sound continuous but operationally are not.

USER:
Brand: {BRAND_NAME}
Category: {CATEGORY}
Audience: {AUDIENCE_DEFINITION}
Customer research summary: {PASTE_CEP_AND_SURVEY_OUTPUTS}
Brand assets the brand can credibly continuously deliver: {LIST}
Comparable subscriptions in the space: {LIST_WITH_PRICING}

Return JSON:

{
  "anchor_benefit_families": ["<2 to 3 from the six families>"],
  "anchor_benefits_specifically": [
    {
      "benefit_name": "<specific, not vague>",
      "why_it_is_continuous": "<one sentence>",
      "audience_evidence": "<the research quote or finding>",
      "comparable_price_signal": "<from comparable subs>"
    }
  ],
  "explicitly_rejected_benefits": [
    {"benefit": "<name>", "why_rejected": "<one sentence>"}
  ]
}

Rules:
- "anchor_benefits_specifically" must read as a thing the member
  could describe to a friend in one sentence.
- "explicitly_rejected_benefits" includes "10% off forever" and any
  benefit that competes with the brand's primary product launches.
- Comparable price signals anchor the later pricing decision.
```

You should now have a hypothesis named, sourced and signed off by the marketing lead.

### Phase 2, tier shape

Three common shapes. Pick the one that fits the brand's category and hypothesis.

| Shape | When it fits | Typical pricing |
|---|---|---|
| Free plus Pro | Content-led or community-led brands, most members on free with limited features, small paying tier with premium access | Pro at £6 to £15 per month or £60 to £150 per year |
| Tier-laddered | Service-anchored brands with multiple service depths | Bronze at £4 to £8 per month, Silver £10 to £20, Gold £25 to £50 |
| Club-anchored | Premium endurance brands selling identity alongside benefits, single tier at premium price | £120 to £400 per year |

**Step 2.1, run the tier shape prompt.**

```text
SYSTEM: You recommend a subscription or membership tier shape for an
endurance brand based on their customer-value hypothesis and
category. You return one recommended shape and the reasoning, plus
the pricing range and the unit-economic assumptions.

USER:
Brand: {BRAND_NAME}
Customer-value hypothesis: {PASTE_PHASE_1}
Category: {CATEGORY}
Audience size and engagement (active customer count and email open rate): {NUMBERS}
Brand premium-versus-mainstream positioning: {PREMIUM | MID | MAINSTREAM}
Comparable subscription pricing: {LIST}

Return JSON:

{
  "recommended_shape": "<free_plus_pro | tier_laddered | club_anchored>",
  "rationale": "<two sentences>",
  "tier_definitions": [
    {
      "tier_name": "<name>",
      "annual_price_gbp": <int>,
      "or_monthly_price_gbp": <int>,
      "expected_share_of_members": "<percent or range>"
    }
  ],
  "unit_economic_assumption": "<one sentence on the cost-to-deliver
    versus expected ARPU>"
}

Rules:
- Pricing must reference the comparable subscriptions list.
- Underpricing devalues the brand. Overpricing caps addressable
  market. Anchor inside the comparable range.
- "expected_share_of_members" is realistic, not aspirational.
```

You should now have a recommended shape and pricing, with the reasoning behind it.

### Phase 3, benefit design

For each benefit listed in the hypothesis, the design discipline.

**Step 3.1, score each benefit.**

```text
SYSTEM: You score each candidate benefit on five dimensions,
specificity, cadence, capacity ceiling, cost-to-deliver per member
per month, and member sentiment indicator. You return a ship-or-cut
call per benefit.

USER:
Benefit: {BENEFIT_NAME}
Description: {DESCRIPTION}
Proposed cadence: {DAILY | WEEKLY | MONTHLY | QUARTERLY | ANNUAL}
Capacity ceiling (max members before quality breaks): {NUMBER}
Cost-to-deliver per member per month estimate: {GBP}
Member sentiment indicator (what the member tells a friend): {QUOTE_OR_DRAFT}

Return JSON:

{
  "benefit": "<name>",
  "specificity_score": <0-10>,
  "cadence_density_score": <0-10>,
  "capacity_ceiling_score": <0-10>,
  "cost_to_deliver_assessment": "<viable | marginal | unsustainable>",
  "member_sentiment_quality": "<strong | acceptable | weak>",
  "composite": <0-10>,
  "ship_or_cut": "<ship | cut | redesign>",
  "rationale": "<one sentence>"
}

Rules:
- Specificity scores higher when the benefit can be described in
  one concrete sentence.
- Cadence density scores higher when the benefit fires often enough
  to feel continuous.
- Capacity ceiling scores lower when the benefit breaks above a
  ceiling lower than expected member count.
- "cut" when composite below 5 or cost_to_deliver_assessment is
  "unsustainable".
- "redesign" when composite 5 to 7 with one clearly fixable flaw.
```

**Step 3.2, cut the weak benefits before launch.**

Benefits that score "cut" do not ship even if they sound cool internally. The temptation to launch with seven benefits to maximise value is the most common failure mode. Three benefits valued often beats seven valued rarely.

You should now have a launch-ready benefit set, three to five items, each ship-rated.

### Phase 4, cancellation and renewal

The honest measure of the programme is the cancellation rate. Two design choices matter.

**Step 4.1, set the cancellation policy.**

The default for endurance audiences is easy cancellation. The audience is value-led, not lock-in-led. Friction-based retention erodes brand permission. The brands that build cancellation moats lose more in audience trust than they gain in short-term retention.

**Step 4.2, design the pause flow.**

Many cancellations are seasonal (off-season, injury, travel). A 1 to 3 month pause keeps the relationship alive and converts better than a cancellation.

```text
SYSTEM: You design the cancellation flow for an endurance brand's
membership programme. The flow respects the audience's intelligence,
offers pause as a real alternative, and never adds friction that the
member did not ask for. You return the flow as a sequence of screens
or steps.

USER:
Brand: {BRAND_NAME}
Membership programme: {SUMMARY}
Typical reasons for cancellation: {LIST_FROM_RESEARCH}
Pause durations available: {1_3_6_MONTHS}

Return JSON:

{
  "flow_steps": [
    {
      "step": "<screen name or step>",
      "what_the_member_sees": "<the copy>",
      "options": ["<the choices>"],
      "default_action": "<what happens if no choice is made>"
    }
  ],
  "pause_offer": {
    "when_shown": "<which step>",
    "copy": "<the pause offer language>",
    "default_pause_duration": "<weeks or months>"
  },
  "post_cancellation_communication": {
    "immediate": "<the confirmation, no marketing>",
    "follow_up_90_days": "<one optional re-engagement touch>"
  }
}

Rules:
- No more than 3 steps to cancel.
- Pause is offered once, clearly, not repeatedly.
- No retention discount offers unless the brand has decided
  promotional discounts are acceptable. Most brands decide they
  are not.
- Post-cancellation communication does not chase. One touch at 90
  days only.
```

**Step 4.3, write the annual renewal communication.**

The renewal note is content. "Here is what you got this year, here is what is coming next." If the brand's "here is what you got" list is weak, the renewal is weak and renewal rate will reflect that.

You should now have a cancellation flow, a pause offer and a renewal communication that earns the next year.

### Phase 5, attribution and review

The unit-economics question is whether each member-year delivers more value than the benefits cost to deliver.

**Step 5.1, instrument the five metrics.**

- **LTV after membership-month 12 against comparable non-members.** Cohort comparison, members against non-members with similar pre-membership purchase patterns.
- **Repeat-purchase rate of members on brand product.** Members typically buy more of the brand's primary product, the rate tells you by how much.
- **Net Promoter delta of members against non-members.** Run the NPS question to both cohorts annually.
- **Word-of-mouth referrals attributable to the programme.** Tracked via referral codes or post-signup attribution survey.
- **Cost-to-deliver per member per month.** Modelled at launch, audited quarterly.

**Step 5.2, run the quarterly review prompt.**

```text
SYSTEM: You produce a quarterly review of a membership programme's
unit economics and member health. You compare against the
hypothesis at launch and against the prior quarter. You return a
honest read on whether the programme is working.

USER:
Quarter: {QUARTER_AND_YEAR}
Active members: {COUNT}
90-day retention rate: {DECIMAL}
LTV delta members vs non-members: {MULTIPLIER}
Repeat-purchase rate delta: {PCT}
NPS members vs non-members: {DELTA}
Referrals attributable to programme: {COUNT}
Cost-to-deliver per member per month actuals: {GBP}
Original hypothesis at launch: {PASTE}

Return JSON:

{
  "headline_read": "<one sentence>",
  "vs_launch_hypothesis": "<above | at | below>",
  "vs_previous_quarter": "<improving | flat | declining>",
  "single_concern": "<one sentence>",
  "single_strength": "<one sentence>",
  "recommended_action": "<the next thing to do>"
}

Rules:
- "headline_read" is the sentence the marketing director would
  Slack to the founder.
- "recommended_action" is concrete (e.g. "cut Benefit 3 in Q3" or
  "increase capacity on Benefit 1 by 40%"), not exploratory.
- A programme breaking even on direct revenue but adding materially
  to LTV, repeat-purchase and referrals is a winner. Read it that
  way.
```

You should now have a quarterly review cadence holding the programme honest.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand, scale-stage, designing the Cascadia Trail Club as a club-anchored membership tied to the Vahla Range.

**Phase 1 output.** Customer-value hypothesis. Anchor benefit families are access, content and community. Specifically, early access to Vahla launches, a monthly long-form training piece authored by sponsored trail coaches, and four group runs per year in the Lake District, Snowdonia, the South Downs and the Peak District. The brand explicitly rejects "10% off forever" and rejects a fitting service because Cascadia is not set up to deliver it operationally.

**Phase 2 output.** Recommended shape is club-anchored at £180 per year. The reasoning, Cascadia's audience is value-led and premium, the comparable Rapha Cycling Club sits at £150 in the UK, and the brand's positioning supports the price step. Expected share of members starts low (3% to 5% of email list in year one). Unit-economic assumption, cost-to-deliver per member per month at £4.20 (group ride logistics, content production, early-access ops), giving £15 per month margin headroom at the £180 annual price.

**Phase 3 output.** Benefit design scored. Early access scores 9 specificity, 8 cadence, 10 capacity, viable cost, strong sentiment, ship. Monthly training piece scores 8 specificity, 8 cadence, 10 capacity, viable cost, strong sentiment, ship. Group runs score 9 specificity, 4 cadence (only four per year), 6 capacity (60-member ceiling per ride), viable cost, strong sentiment, ship. Two other candidate benefits (a quarterly print zine and a member-only Discord) score below 6 on composite and get cut. The Discord gets noted as a potential year-two addition once the team has bandwidth.

**Phase 4 output.** Cancellation flow designed. Three steps, "tell us why," "consider a pause for the off-season," "confirm cancellation." The pause is offered at three months by default. No retention discount. Post-cancellation, a confirmation email and one optional 90-day re-engagement touch. The annual renewal note ships a 30-day preview of what is coming in the next year.

**Phase 5 output.** Programme launches with 412 members in the first 90 days. Quarterly review at end of Q1, 90-day retention at 91% (target was 80%, well above). LTV delta members against non-members at 1.8x at 12 months (target was 1.5x). NPS delta plus 22. Referrals attributable to programme at 38. Cost-to-deliver actuals at £4.05 per member per month, within the £4.20 budget. Headline read is "Working as designed, capacity on group runs will bind in Q2." Recommended action, increase group ride capacity by adding a fifth event in the Yorkshire Dales before Q2 demand hits the ceiling.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, run the hypothesis prompt for your brand

Pull your most recent customer research summary, your audience definition and three comparable subscriptions in your space. Run the Phase 1 prompt. Read the anchor benefits. If the benefits look generic, the customer research summary is too thin to anchor a programme and the work is upstream.

### Exercise 2, score three benefits against the rubric

Pick three benefits the brand has casually discussed. Run the Phase 3 prompt for each. Read the ship-or-cut calls. Often one of the three scores "cut" and the team learns something it would not have without the discipline.

### Exercise 3, design your cancellation flow

Run the Phase 4 prompt with your own programme assumptions. Read the flow. Walk through it as if you were a member off-season. If the flow at any step makes you feel resentful or trapped, redesign before launch. The endurance audience talks.

## The eval gates

**Eval 1, 90-day retention.** Members still active 90 days after signup. Target 80% or above for an annual programme, 60% or above for monthly. Below target, the benefit design or the onboarding is failing.

**Eval 2, benefit utilisation.** What percentage of members actively use each named benefit. Benefits below 20% utilisation are either too niche or too poorly surfaced. Investigate and refresh.

**Eval 3, LTV delta.** Cohort LTV of members against comparable non-members. Members should LTV out at above 1.5x non-members within 12 months. Below 1.2x and the programme is not earning its keep.

**Eval 4, cancellation sentiment.** Sample cancelled-member feedback. If cancellations cite the same two or three reasons (e.g. "I never used the benefits"), that is a benefit-design problem the team can fix.

**Eval 5, NPS delta.** Members should NPS materially higher than non-members. A programme that breaks even on revenue but lifts NPS materially is still a winning programme. A programme that drives revenue but with NPS at parity is a hollow subscription.

## The failure modes

**Subscription as discount programme.** "Pay £8 a month, get 10% off forever." Margin disappears, the audience treats it as a loyalty discount card, retention drops as soon as the customer's purchase cadence slows. Subscriptions need continuous value rather than promotional discount.

**Benefits that compete with the brand's product launches.** If membership gives 30% off new launches, you have trained the audience to wait until launch plus 30 days. The membership should not undermine the brand's primary commerce.

**Capacity-uncapped benefits.** "Member group rides" listed without a per-event cap. Membership grows, rides become unmanageable, the benefit decays. Define the capacity ceiling at launch.

**Vanity tier proliferation.** Brand has six membership tiers because "some people will pay more." Most do not. Three tiers is the ceiling, and pricing inside the tiers is the lever for paying-more appetite.

**Cancellation moats.** Phone-only cancellation, multi-step web flows. Short-term retention up, long-term audience trust down. The endurance audience talks. Do not.

## The pattern in practice

Illustrative scenarios that show common shapes membership programmes take. Specifics are illustrative and the patterns repeat.

**Premium cycling brand, scale-stage, the well-anchored club.** A brand launches an annual club membership with three anchored benefits (early product access, monthly group rides hosted by athletes, regional event invitations). At 12 to 18 months there are thousands of members, strong 90-day retention, members LTV-ing at roughly 2x non-members and materially higher NPS than non-members. A well-designed programme typically funds itself within a few months.

**Endurance nutrition brand, growth-stage, the wrong-cadence failure.** A brand designs a quarterly product-refresh subscription. Looks strong on launch. The reality is most customers prefer to buy on demand at their own race-week cadence. Subscribers cancel within months. The honest pivot is a single annual "refresh" event with priority access for past customers, the same recurring value without the subscription friction.

**Multisport brand, the too-many-benefits failure.** A brand launches a membership with seven benefits "to maximise value." Members sign up, use two or three, do not see why they are paying for the rest. Six-month retention sits well below target. Cutting to three benefits and relaunching typically rescues retention within a quarter. Fewer benefits valued more often beats many benefits valued rarely.

## Hand-off

The membership programme feeds:
- **lifecycle-journey-builder**, onboarding, milestone, renewal flows
- **event-sponsorship-playbook**, event access becomes a membership benefit
- **race-day-demand-pipeline**, member-only race-week experiences
- **ambassador-programme**, athlete-hosted group runs anchor the access benefit
- **direct-to-coach**, coach-led monthly content is the natural source for the content benefit
