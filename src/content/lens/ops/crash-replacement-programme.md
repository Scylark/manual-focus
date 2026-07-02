---
title: "Crash-replacement and wear-out programme"
stack: ops
description: "Build a crash-replacement or wear-out programme that earns customer loyalty instead of draining margin. Tier rules, claim handling, evidence requirements, fraud safeguards."
outputs: "Programme rules, claim flow, case log template, communications kit"
readMin: 17
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "lifecycle"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-09-10
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **programme scope document** naming which product categories the programme covers and which it does not, with the tier rules written down where customers can read them.
2. A **claim-intake form** (Typeform, Tally or a Shopify form embed) that captures photos, order ID and event context in one submission.
3. A **case-log spreadsheet** that tracks every claim from submission through shipping with auditable tier-decision reasoning.
4. A **claim-handling playbook** with copy-paste reply templates for approve, decline and human-review responses, in the brand's voice.
5. A **fraud-pattern dashboard** flagging repeat addresses, frequency anomalies and post-sale claim spikes.

## Who this is for

A growth, scale or enterprise endurance brand selling products that can be crashed, worn out or fail outside obvious manufacturing defects. Helmets, frames, performance wheels, hard shells, technical apparel, racing shoes, packs. The brand has Shopify, NetSuite or a comparable ecommerce backend with order history exposed, and at least one full-time customer service operator. If you sell consumables or low-ticket items, a generic 30-day return policy beats this whole system.

## Before you start

- [ ] Ecommerce backend access (Shopify Admin, NetSuite, BigCommerce, equivalent) with order history searchable by customer email
- [ ] A customer service inbox the team actually monitors (Help Scout, Zendesk, Front, Intercom)
- [ ] Authority from the founder or CFO to commit a programme budget (subsidised replacement costs sit on the P&L)
- [ ] Product catalogue access so SKUs can be matched to replacements
- [ ] The brand voice profile (output of brand-voice-extraction)
- [ ] Three to five months of past claim correspondence in the inbox, so the system seeds with real cases
- [ ] An ecommerce or operations lead who can sign off on the tier definitions
- [ ] Privacy review on the case log (it holds customer PII)

If the founder is not yet bought into a programme budget, run the pattern-in-practice section past them first. The repeat-purchase upside is what unlocks the budget conversation.

## The pipeline

Five phases. One working week to install. Programme then runs forever.

### Phase 1, programme scoping

Decide what the programme covers before you tell customers anything.

**Step 1.1, map your product catalogue against three programme types.**

In a Notion page or a Google Sheet, list every product category you sell. For each, mark which programme type applies.

- **Crash replacement** covers products destroyed in normal use. Helmets, frames, race vests, hard shells, certain shoes.
- **Wear-out replacement** covers products that did not meet expected life. Shoes that wore through prematurely, wetsuits cracked early, base layers that pilled.
- **Defect or warranty** covers manufacturing failures. Separate this from the first two so the team uses different language.

A category can be in one programme or two, not all three. A helmet is crash-replacement only. A trail shoe is wear-out and defect. A pack is defect only.

Programmes need clarity. "We replace anything" is unsustainable. "We honour these specific scenarios on these specific products" is brand-building.

**Step 1.2, write the tier rules.**

For each programme type, three tier levels. The customer's tier is determined by time since purchase, evidence quality and lifetime customer history.

- **Tier 1, discounted replacement.** Customer pays 50 to 70% of retail for a replacement. Used for clean crash-replacement cases on high-value items within the brand's stated crash window (typically three years for helmets and frames, two years for outerwear).
- **Tier 2, subsidised replacement.** Customer pays 30 to 50%. Used for warranty-edge cases or wear-out claims where the product failed earlier than expected but technically within standard wear.
- **Tier 3, free replacement.** Customer pays nothing. Reserved for clear product defects, ambassador-programme issues and repeat-customer goodwill (five plus prior orders, claim within window, clean evidence).

**Step 1.3, publish the rules on the product pages.**

The programme has to be findable. Add a small *Crash and wear* section to each product page describing the programme that covers it, with a link to the full rules. Customer-service responses link to the same page. Do not bury this in T&Cs.

You should now have a programme scope document, tier rules and a product page section live.

### Phase 2, claim-intake form

The form is the gate.

**Step 2.1, build the intake form.**

In Typeform or Tally, build a form with these fields, in this order:

- Order ID (required, lookup on submit)
- Your email (required, must match the order)
- Product (dropdown, populated from your SKU list)
- What happened (radio: crashed, wore out faster than expected, defect, other)
- Photos (file upload, required, minimum two)
- Was this during a race or event (radio: yes/no, conditional on the answer for further fields)
- If race, race name and result URL (text, optional but encouraged)
- Anything else you want us to know (free text, max 400 chars)

Embed the form on a page called `/crash-and-wear` on the brand site. Link to it from the product pages.

**Step 2.2, write the photo-requirement language.**

The form's photo upload field needs a helper text. Generic "upload photos" produces unusable submissions. Specific helper text gets the photos you can act on.

```text
We need clear, well-lit photos showing:

1. The damage close-up (one shot of the broken or worn area)
2. The full product in frame (so we can confirm the model)
3. The serial number or care label if visible (helps us verify
   manufacture date)
4. Your race number from the day if the crash was at an event

Minimum two photos. The clearer the photos, the faster we can
respond.
```

You should now have a form that captures everything the team needs to triage in under five minutes.

### Phase 3, claim flow

The flow from submission to shipped replacement.

**Step 3.1, the auto-acknowledgement.**

When the form submits, a Zapier or Make automation fires. The customer gets an email within sixty seconds:

```text
Subject: We've got your claim, {ORDER_ID}

Hi {FIRST_NAME},

Thanks for submitting. We've logged your claim as {CASE_ID}.

What happens next:
1. Our team reviews submissions every working day.
2. Most cases get a decision within 48 hours.
3. Complex cases go to a senior reviewer and we'll write back
   within five working days with the decision and next steps.

You don't need to send anything else right now. If we need
more photos or context, we'll reach out directly.

Thanks,
The {BRAND_NAME} team
```

The Zap also creates a row in the case log (the CSV at the end of this playbook) and posts a message in the team's Slack channel.

**Step 3.2, the triage prompt.**

The customer service operator pastes the case into Claude for a first-pass tier recommendation.

```text
SYSTEM: You triage a crash-replacement or wear-out claim against
the brand's tier rules. You return a recommended tier with the
reasoning, or flag for human review. You never accuse a customer
of fraud, even when patterns suggest it. You flag for human
review with neutral language.

USER:
Brand tier rules:
{PASTE_PROGRAMME_RULES}

Case:
- Order ID: {ORDER_ID}
- Product: {PRODUCT_NAME}
- Purchase date: {PURCHASE_DATE}
- Months since purchase: {MONTHS_SINCE}
- Damage type: {DAMAGE_TYPE}
- Photos description (operator summary): {PHOTOS_SUMMARY}
- Race or event: {RACE_OR_NONE}
- Customer lifetime orders: {LIFETIME_ORDERS}
- Customer lifetime spend GBP: {LIFETIME_SPEND}

Return JSON:
{
  "recommended_tier": "<Tier 1 | Tier 2 | Tier 3 | human_review | decline>",
  "tier_reason": "<one sentence>",
  "customer_pays_gbp": <int>,
  "replacement_sku_suggestion": "<sku or 'best match needed'>",
  "communication_tone": "<warm | neutral | apologetic>",
  "flag_for_pattern_check": <true | false>,
  "draft_reply": "<200 to 350 word email body in the brand voice>"
}

Rules:
- Tier 1 default for crash claims within the stated crash window
  with clear photo evidence.
- Tier 2 default for wear-out claims and edge-case crash claims
  outside the standard window.
- Tier 3 only for defects, ambassadors or repeat customers with
  5+ orders.
- human_review when evidence is ambiguous or the claim falls
  outside policy.
- decline only when the policy is clearly not met, and even then
  the draft_reply explains the path forward without
  accusation.
- flag_for_pattern_check true if address repeats in case log or
  customer has claimed 3+ times in 12 months.
```

**Step 3.3, the operator decision.**

The operator reads the model's recommendation, checks it against the case log for pattern signals, and either approves the draft reply or escalates to human review. Most cases (around 80%) auto-classify cleanly and the operator approves the draft within five minutes.

Edge cases route to a senior reviewer who replies within five working days.

**Step 3.4, the fulfilment.**

For approved cases, the operator creates a Shopify draft order for the replacement SKU. The customer pays the tier amount through a standard Stripe link. The replacement ships through the same channel as a regular order, not slower because it is a claim. Cycle target: five working days from submission to shipped replacement for clean cases.

You should now have a claim flow that runs end-to-end in under a week per case.

### Phase 4, fraud safeguards and pattern detection

The system needs safeguards without insulting honest customers.

**Step 4.1, the pattern-check query.**

Once a week, the operator runs a pattern-check on the case log. Pull these queries from the spreadsheet:

- Customers with three or more claims in the last twelve months
- Shipping addresses with two or more claims from different customer names
- Claims submitted within thirty days of a public sale or coupon-code event
- Products with sudden claim-rate spikes (above three times the baseline)

The first three surface possible fraud. The fourth surfaces a real product problem the brand should know about.

**Step 4.2, the pattern-check prompt.**

For the spreadsheet-derived flags, paste into Claude.

```text
SYSTEM: You review fraud-signal patterns in a crash-replacement
case log. You distinguish honest customers from likely abusers,
and you suggest the next step. You never make accusatory
recommendations. You suggest evidence gathering, not denial.

USER:
Pattern data:
{PASTE_FLAGGED_CASES}

For each flagged customer or pattern, return:
{
  "pattern_id": "<id>",
  "concern_level": "<low | medium | high>",
  "evidence_summary": "<one sentence>",
  "recommended_next_step": "<continue normal processing |
    request additional evidence | escalate to senior reviewer |
    invite customer to call>",
  "communication_draft": "<neutral, evidence-gathering email
    draft, no accusation>"
}

Rules:
- "high" requires multiple converging signals, not just one.
- Recommended next step never includes "decline outright".
  Even high-concern cases get a chance to clarify.
```

**Step 4.3, the communication discipline.**

When a flagged case is communicated with, the language is neutral and evidence-gathering. Standard template:

```text
Subject: A few extra details on your claim, {CASE_ID}

Hi {FIRST_NAME},

Thanks for the claim. Before we finalise, we'd love a couple
more details:

1. {SPECIFIC_QUESTION_1}
2. {SPECIFIC_QUESTION_2}

This is a routine step on some claims and we appreciate you
taking the extra moment to clarify. Reply to this email and
we'll pick it up.

Thanks,
The {BRAND_NAME} team
```

Honest customers get to clarify. Fraudsters self-deselect.

### Phase 5, programme communications

The framing matters as much as the policy.

**Step 5.1, the on-product-page block.**

Each product page covered by the programme gets a 60-to-90 word block.

```text
Crashes happen. Gear wears out. Here's what we do.

If you crash this {PRODUCT_TYPE} within {N} years of buying it,
we'll get you a replacement at {TIER_1_PRICE} of retail. Photos
of the damage and your order ID is all we need. Most claims
ship within five working days.

If it wears out faster than it should, we'll subsidise the
replacement at {TIER_2_PRICE} of retail. Same process.

Full rules at {LINK}.
```

**Step 5.2, the post-purchase email.**

Three weeks after a covered product ships, a lifecycle email goes out. Subject "About the {PRODUCT}, if anything ever goes wrong." Body explains the programme exists, links to the rules, and ends with "Hopefully you never need this, and good to know it's here."

**Step 5.3, the customer-story consent path.**

When a claim is handled well and the customer is happy, the operator asks (with explicit consent) if the brand can share their story. Through the customer-content-rights playbook, the consented story becomes brand-permission content. The handled-well claim moment converts into the strongest social proof the brand can produce.

You should now have a programme that is discoverable, fair, fast and brand-building.

## Worked example, end-to-end

Cascadia Endurance, scale-stage. Beth Lyons (brand and lifecycle lead) and a customer service operator named Anya. The programme covers crash-replacement on outerwear and packs, wear-out on shoes.

**Phase 1.** Beth maps the catalogue. Vahla Range Storm Shell, Vahla Carbon Pack, Cascadia Race Vest are in crash-replacement. Cascadia Trail Shoe v3 is in wear-out. T-shirts and accessories are not in the programme.

**Phase 2.** Tally form lives at `cascadia-endurance.com/crash-and-wear`. The form question copy is reviewed against the brand voice gates and ships clean.

**Phase 3.** The first month after launch produces eight cases (rows in the CSV template at the end of this playbook).

- CR-2026-0001, Beth Allen, Storm Shell crashed at UTMB Mont-Blanc. Returning customer with four prior orders. Within 3-year crash window. Tier 1, customer pays £130. Approved in 6 hours. Shipped in 5 days.
- CR-2026-0002, Mark Riley, Trail Shoe wore out at 7 months with photos showing midsole compression. First-time customer. Tier 2, customer pays £42. Approved in 5 hours. Shipped in 5 days.
- CR-2026-0003, Jordan Pierce, similar wear-out claim, photos unclear. Routed to human review. Operator asks for re-photos with the neutral language template.
- CR-2026-0004, Saoirse Burns (sponsored athlete), Carbon Pack defect at Lavaredo training camp. Tier 3, customer pays £0. Replacement next-day shipped.
- CR-2026-0008, Yusuf Kahn, bib shorts wear-out at 23 months. Edge-case wear claim. Tier 2, customer pays £34. Approved in 12 hours.

**Phase 4.** Week-four pattern check surfaces no fraud signals. The case log is small but already useful for spotting that Trail Shoe v3 wear-out claims are clustered around the 6-to-9-month mark, which Beth flags to product.

**Phase 5.** CR-2026-0007, Lila Okafor, Storm Shell crash at Ultra Trail Cape Town with five prior orders and excellent photos. Anya asks for permission to share. Lila says yes. Through the customer-content-rights playbook, the story becomes a permission-led social post that out-engages the brand's hero campaign by 3x.

**The case log after month one (extract):**

| Case ID | Product | Months since purchase | Tier | Pays | Cycle days |
|---|---|---|---|---|---|
| CR-2026-0001 | Storm Shell | 17 | Tier 1 | £130 | 5 |
| CR-2026-0002 | Trail Shoe v3 | 7 | Tier 2 | £42 | 5 |
| CR-2026-0004 | Carbon Pack | 4 | Tier 3 | £0 | 1 |
| CR-2026-0005 | Race Vest | 26 | Tier 2 | £90 | 5 |
| CR-2026-0007 | Storm Shell | 30 | Tier 1 | £90 | 5 |

Cycle-time average four days. Claim-rate as percentage of units sold sits under 1.5%. Customer-content output from consented stories starts compounding by month three.

## Try it yourself

Three exercises. Each takes 30 to 60 minutes.

### Exercise 1, write the tier rules for one product category

Pick your highest-value product category. Draft the tier rules. What does Tier 1 look like (price, eligibility window, evidence)? Tier 2? Tier 3? Run them past your founder. Most teams discover that writing the rules surfaces three or four edge cases they had not thought through.

### Exercise 2, write the on-product-page block

Take the 60-to-90 word template from Step 5.1. Fill it in for one of your products. Read it out loud. Does it sound like your brand or like a warranty policy? If it sounds like a warranty policy, the brand voice has not been applied.

### Exercise 3, run the triage prompt on three real cases

Pull three past claims from your customer-service inbox. Anonymise the customer names. Run each through the Step 3.2 triage prompt. Compare the model's recommendation to what the team actually decided. Where they disagree is where the policy and the team's gut differ. Pick the one to write down.

## The eval gates

**Eval 1, cycle time.** Median submission-to-shipped time. Target five working days for clean cases, ten working days for edge cases. Above that and the customer experience erodes.

**Eval 2, claim-rate sanity.** Claim rate as percentage of units sold per category. A spike signals either a product issue (real problem, investigate) or programme abuse (review the safeguards).

**Eval 3, net-promoter delta.** Customers who claimed compared with comparable customers who did not. The well-handled claim moment should net-promote, meaning claim customers' NPS sits at or above non-claim customers. If lower, the programme is hurting rather than helping.

**Eval 4, loyalty conversion.** Of customers who claimed and received a replacement, what percentage purchase again within twelve months? Target above 70%. The programme is a loyalty investment and this is the measure.

## The failure modes

**No programme at all.** Customer crashes the helmet, posts on social, gets a generic warranty-denied response, churns. Most endurance brands lose a customer here every week.

**Programme exists but undiscoverable.** Buried at the bottom of the T&Cs page. Customer finds out from a different brand's marketing. Surfaces matter.

**Inconsistent application.** Front-line customer service applies the rules differently. Train the team and put the tier triage in software, not memory.

**Too generous on the broad side, too tight on the edge.** Brand says "lifetime warranty" then declines a claim on a 2-year-old helmet. The lifetime promise produced expectation, and the decline generates outsized resentment. Be specific upfront.

**No customer-history input.** Treating a 5-year customer with eight prior purchases the same as a first-time-claimer is a missed loyalty signal. Customer history should influence the tier decision visibly.

## The pattern in practice

Illustrative scenarios that show common shapes a replacement programme takes. Specifics are illustrative and patterns repeat.

**Premium cycling brand, scale-stage, the public-programme rebuild.** A brand with a quiet warranty process. Rebuilding as a public crash-replacement programme with explicit tier rules (50% replacement on crashed helmets within three years of purchase, 25% for older or edge cases) typically surfaces in customer surveys as one of the strongest brand-loyalty drivers. Repeat-purchase rate of customers who claim runs substantially above non-claim customers because the moment is loyalty-defining.

**Running brand, growth-stage, the wear-out programme.** A brand introducing a wear-out programme for premium racing shoes. Claim rate typically sits below 1% of units sold under healthy operation. Coupon-site exposure spikes the rate briefly and tightening evidence requirements normalises it. Customer-facing NPS lifts overall because the programme's existence matters even to customers who never claim.

**Multi-sport brand, the vague-rules failure.** A common failure mode is launching with vague rules ("we'll replace gear at our discretion for major mishaps"). Customer-service decisions vary. Front-line confusion erodes trust faster than no programme would have. The fix is specific tier rules. Clear policy beats generous discretion.

## Templates

The case-log spreadsheet as a CSV. One row per claim. Drop into Google Sheets or Excel, freeze the header row, add a filter.

[Download crash-replacement-case-log-template.csv](/lens/templates/crash-replacement-case-log-template.csv)

The CSV ships with eight sample Cascadia cases covering each tier and edge case. Wipe them, keep the headers, fill in your own.

**If your programme covers different product categories or your tiers differ, ask Claude to build a custom version.**

```text
SYSTEM: You generate a crash-replacement case-log CSV tailored
to a specific brand's programme. The CSV captures every claim
from submission through fulfilment with audit trail for the
tier decision.

USER:
My product categories in the programme: {LIST_CATEGORIES}
My tier definitions: {PASTE_TIER_RULES}
My customer service tool: {HELP_SCOUT | ZENDESK | FRONT | INTERCOM}
Extra fields I need: {LIST_EXTRA_FIELDS}

Generate a CSV with one row per case and columns for:
- Case_ID, Submitted_Date, Customer_Name, Customer_Email, Order_ID
- Product, Product_Category, Purchase_Date, Months_Since_Purchase
- Damage_Type, Photos_Attached, Race_Or_Event
- Customer_Tier, Lifetime_Orders, Lifetime_Spend_GBP
- Claim_Type, Claim_Subtotal_GBP, Proposed_Tier, Tier_Reason
- Decision, Decision_Date, Replacement_SKU, Customer_Pays_GBP
- Shipped_Date, Days_To_Resolve, Customer_Followup, Notes
- (any extras I specified)

Pre-fill three example rows for an endurance brand. Return the
CSV directly.
```

## Hand-off

The replacement programme connects to:
- **lifecycle-journey-builder**, where post-purchase touchpoints mention the programme so customers know it exists
- **customer-content-rights**, where claim stories (with consent) become brand-permission content
- **brand-guardrails-as-code**, where claim-response copy runs through the brand voice gates
- **retail-partner-programme**, where partner shops handle claims on behalf of customers in some tiers, equipped with the rules
