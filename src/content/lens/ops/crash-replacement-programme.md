---
title: "Crash-replacement and wear-out programme"
stack: ops
description: "Build a crash-replacement or wear-out programme that earns customer loyalty instead of draining margin. Tier rules, claim handling, evidence requirements."
outputs: "Programme rules, claim flow, evidence framework, communications kit"
readMin: 9
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "lifecycle"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-09-10
status: live
preview: false
---

## The brief

Endurance gear wears out and gets crashed. The brands that handle the wear-and-crash moments well earn a customer for life. The brands that don't lose customers to the competitor offering a better warranty.

This playbook is the programme design. Tier rules that distinguish who gets what kind of replacement, claim handling that's fast without being abuseable, evidence requirements that catch fraud without insulting honest customers, and the framing language that makes the programme feel like brand permission rather than transactional warranty.

Not every product needs a replacement programme. Most strong endurance brands have one for at least one product category, like helmets after crashes, frames after warranty cracks, shoes after unusually fast wear, because the moments are emotionally loaded and the brand's response defines the relationship.

## The pipeline

Five phases.

**Phase 1, programme scoping.** Identify which products warrant a programme, and what kind:

- **Crash replacement** covers helmets, frames, performance wheels, hard shells, certain shoes. The product was destroyed in normal use.
- **Wear-out replacement** covers wetsuits cracked after 200 swims, shoes that wore through faster than expected, base layers that pilled prematurely. The product didn't meet expected life.
- **Defect or warranty** covers manufacturing failures, separating from general crash and wear.

Programmes need clarity on which category they cover. A "we replace anything" programme is unsustainable, while a "we honour specific scenarios" programme is brand-building.

**Phase 2, tier rules.** Three tier-levels typical:

- **Tier 1, discounted replacement.** Customer pays 50–70% of retail for a replacement, faster than purchasing new, with the damaged product shipped back. Standard for crash-replacement of high-value items (frames, helmets).
- **Tier 2, subsidised replacement.** Customer pays 30–50%. Used for warranty-edge cases where the product failed earlier than expected but technically within standard wear.
- **Tier 3, free replacement.** Customer pays nothing. Reserved for clear product defects, repeat-customer goodwill, ambassador-programme issues.

The tier the customer gets is determined by:
- Time since purchase
- Evidence of crash or wear (photos, registration data, race-day context)
- Customer's purchase history with the brand (the loyalty signal is real, and a 5-year customer with 8 prior purchases gets handled differently than a first-time customer with an edge-case claim)

**Phase 3, claim flow.** Designed for speed and dignity:

- **Submission.** Simple form (or email). Photos required, with the form making it clear what photos help (the crash damage, the bike or shoe or helmet, the customer's race number from the day if relevant).
- **Eligibility check.** Automated triage by AI against the tier rules and the brand's claim history. Most claims auto-classify to a tier within minutes.
- **Edge case escalation.** Claims that don't fit cleanly into a tier get human review within 48 hours. Don't leave customers waiting two weeks.
- **Decision communication.** Clear, empathetic, fast. "We can replace at the Tier 2 discount because [reason]" beats a bureaucratic acceptance.
- **Fulfilment.** Replacement ships within standard order timeframes, rather than slower because it's a claim.

The whole cycle should hit 5 working days from submission to shipped replacement for clean cases, and 10 working days for edge cases.

**Phase 4, evidence handling and fraud detection.** Without safeguards, replacement programmes get abused. With heavy-handed safeguards, honest customers feel insulted.

The right balance:

- **Photo requirements** that are minimal but specific (the damage, the product, the registration code or serial number)
- **Race or event verification** for crashes claimed in races, with a link to a public race result if available
- **Frequency caps**, so a single customer claiming more than 2–3 replacements in a 12-month window gets human review
- **Pattern detection** for multiple claims from one shipping address, repeated claims on the same product variant, claims shortly after public sales, which surface for review
- **No accusation language.** Customers flagged for review get a "we're checking some details" message, rather than a "we suspect you of fraud" message. The honest customers get to clarify, and the fraudsters self-deselect.

**Phase 5, programme communications.** The framing matters as much as the policy.

What works:

- **"Crashes happen. Wear out happens. Here's what we'll do."** Plain language, on the product page and in post-purchase lifecycle email.
- **"You bought this in 2024. If you crash it within X years, here's the programme."** Specificity earns trust.
- **Customer stories.** With consent, share examples of the brand honouring claims. Builds permission for new customers to feel safe with the brand.

What doesn't work:

- **Buried in T&Cs.** Programme exists but nobody knows. Defeats the purpose.
- **Performative generosity.** A "lifetime replacement guarantee" that small print restricts heavily. Customers find out the small print and trust drops.
- **Inconsistent application.** Same scenario gets different outcomes depending on which customer-service rep handles it.

## The capability boundary

What AI helps with:

- **Claim triage**, auto-classifying most claims to the right tier in minutes
- **Evidence analysis**, verifying photos against requirements, comparing damage patterns
- **Fraud-pattern detection**, surfacing the patterns named in Phase 4
- **Communications drafting**, empathetic, fast claim responses in the brand's voice
- **Lifecycle integration**, including programme info in post-purchase touchpoints

What AI doesn't help with:

- **Edge-case judgement.** A 6-year-old helmet claim with ambiguous evidence is a human call. Don't auto-deny.
- **The accusation calls.** When a claim looks fraudulent, humans make the contact, rather than AI. The relationship matters even at decline.

## The eval harness

**Eval R1, cycle time.** Median submission-to-shipped time. Target sits at 5 days or fewer for clean cases, and 10 days or fewer for edge cases.

**Eval R2, claim-rate sanity.** Claim rate as percentage of units sold per category. A spike signals either a product issue (real problem, investigate) or programme abuse (review the safeguards).

**Eval R3, net-promoter delta.** Customers who claimed against comparable customers who didn't. The well-handled claim moment should net-promote, meaning claim customers' NPS sits at or above non-claim customers'. If it's lower, the programme is hurting rather than helping.

**Eval R4, loyalty conversion.** Of customers who claimed and received replacement, what percentage purchase again within 12 months? Target sits above 70%. The programme is a loyalty investment, and this is the measure.

## The failure modes

**No programme at all.** Customer crashes the helmet, posts on social, gets a generic warranty-denied response, churns. Most endurance brands lose a customer here every week.

**Programme exists but undiscoverable.** Buried at the bottom of the T&Cs page. Customer finds out from a different brand's marketing. Surfaces matter.

**Inconsistent application.** Front-line customer service applies the rules differently. Train the team and put the tier triage in software, rather than memory.

**Too generous on the broad side, too tight on the edge.** Brand says "lifetime warranty" then declines a claim on a 2-year-old helmet. The "lifetime" promise produced expectation, and the decline generates outsized resentment. Be specific upfront.

**No customer-history input.** Treating a 5-year customer with 8 prior purchases the same as a first-time-claimer is a missed loyalty signal. Customer history should influence the tier decision visibly.

## The pattern in practice

Illustrative scenarios that show common shapes a replacement programme takes. Specifics are illustrative and the patterns repeat.

**Premium cycling brand, scale-stage, the public-programme rebuild.** A brand with a quiet warranty process. Rebuilding as a public crash-replacement programme with explicit tier rules (e.g. 50% replacement on crashed helmets within three years of purchase, 25% for older or edge cases) typically surfaces in customer surveys as one of the strongest brand-loyalty drivers. Repeat-purchase rate of customers who claim runs substantially above non-claim customers, because the moment is loyalty-defining.

**Running brand, growth-stage, the wear-out programme.** A brand introducing a wear-out programme for premium racing shoes (replacement at a discount if the midsole compresses prematurely under defined conditions). Claim rate typically sits well below 1% of units sold under healthy operation. Coupon-site exposure spikes the rate briefly, and tightening evidence requirements normalises it. Customer-facing NPS lifts overall, because the programme's existence matters even to customers who never claim.

**Multi-sport brand, the vague-rules failure.** A common failure mode is launching with vague rules ("we'll replace gear at our discretion for major mishaps"). Customer-service decisions vary, with some customers getting free replacement and some told to buy new. Front-line confusion erodes trust faster than no programme would have. The fix is specific tier rules. Clear policy beats generous discretion.

## Hand-off

The replacement programme connects to:
- **lifecycle-journey-builder**, where post-purchase touchpoints mention the programme so customers know it exists
- **customer-content-rights**, where claim stories (with consent) become brand-permission content
- **brand-guardrails-as-code**, where claim-response copy runs through the brand-voice gates
- **retail-partner-programme**, where partner shops handle claims on behalf of customers in some tiers, equipped with the rules
