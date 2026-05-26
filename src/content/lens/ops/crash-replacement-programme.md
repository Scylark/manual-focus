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

Endurance gear wears out and gets crashed. The brands that handle
the wear-and-crash moments well earn a customer for life. The brands
that don't lose customers to the competitor offering a better
warranty.

This playbook is the programme design. Tier rules that distinguish
who gets what kind of replacement, claim handling that's fast
without being abuseable, evidence requirements that catch fraud
without insulting honest customers, and the framing language that
makes the programme feel like brand permission rather than
transactional warranty.

Not every product needs a replacement programme. Most strong
endurance brands have one for at least one product category —
helmets after crashes, frames after warranty cracks, shoes after
unusually fast wear — because the moments are emotionally loaded
and the brand's response defines the relationship.

## The pipeline

Five phases.

**Phase 1 — Programme scoping.** Identify which products warrant
a programme, and what kind:

- **Crash replacement** — helmets, frames, performance wheels, hard
  shells, certain shoes. The product was destroyed in normal use.
- **Wear-out replacement** — wetsuits cracked after 200 swims,
  shoes that wore through faster than expected, base layers that
  pilled prematurely. The product didn't meet expected life.
- **Defect / warranty** — manufacturing failures, separating from
  general crash/wear.

Programmes need clarity on which category they cover. A "we
replace anything" programme is unsustainable; a "we honour
specific scenarios" programme is brand-building.

**Phase 2 — Tier rules.** Three tier-levels typical:

- **Tier 1 — Discounted replacement.** Customer pays 50–70% of
  retail for a replacement, faster than purchasing new, with the
  damaged product shipped back. Standard for crash-replacement of
  high-value items (frames, helmets).
- **Tier 2 — Subsidised replacement.** Customer pays 30–50%. Used
  for warranty-edge cases where the product failed earlier than
  expected but technically within standard wear.
- **Tier 3 — Free replacement.** Customer pays nothing. Reserved
  for clear product defects, repeat-customer goodwill, ambassador-
  programme issues.

The tier the customer gets is determined by:
- Time since purchase
- Evidence of crash / wear (photos, registration data, race-day
  context)
- Customer's purchase history with the brand (the loyalty signal
  is real — a 5-year customer with 8 prior purchases gets handled
  differently than a first-time customer with an edge-case claim)

**Phase 3 — Claim flow.** Designed for speed and dignity:

- **Submission** — simple form (or email). Photos required, but
  the form makes it clear what photos help (the crash damage, the
  bike / shoe / helmet, the customer's race number from the day
  if relevant).
- **Eligibility check** — automated triage by AI against the tier
  rules + the brand's claim history. Most claims auto-classify
  to a tier within minutes.
- **Edge case escalation** — claims that don't fit cleanly into a
  tier get human review within 48 hours. Don't leave customers
  waiting two weeks.
- **Decision communication** — clear, empathetic, fast. "We can
  replace at the Tier 2 discount because [reason]" beats a
  bureaucratic acceptance.
- **Fulfilment** — replacement ships within standard order
  timeframes, not slower because it's a claim.

The whole cycle should hit 5 working days from submission to
shipped replacement for clean cases; 10 working days for edge
cases.

**Phase 4 — Evidence handling and fraud detection.** Without
safeguards, replacement programmes get abused. With heavy-handed
safeguards, honest customers feel insulted.

The right balance:

- **Photo requirements** that are minimal but specific (the damage,
  the product, the registration code or serial number)
- **Race / event verification** for crashes claimed in races —
  link to a public race result if available
- **Frequency caps** — a single customer claiming more than 2–3
  replacements in a 12-month window gets human review
- **Pattern detection** — multiple claims from one shipping
  address, repeated claims on the same product variant, claims
  shortly after public sales — surface for review
- **No accusation language** — customers flagged for review get a
  "we're checking some details" message, not a "we suspect you
  of fraud" message. The honest customers get to clarify; the
  fraudsters self-deselect.

**Phase 5 — Programme communications.** The framing matters as
much as the policy.

What works:

- **"Crashes happen. Wear out happens. Here's what we'll do."**
  Plain language, on the product page and in post-purchase
  lifecycle email.
- **"You bought this in 2024. If you crash it within X years,
  here's the programme."** Specificity earns trust.
- **Customer stories** — with consent, share examples of the brand
  honouring claims. Builds permission for new customers to feel
  safe with the brand.

What doesn't work:

- **Buried in T&Cs** — programme exists but nobody knows. Defeats
  the purpose.
- **Performative generosity** — "lifetime replacement guarantee"
  that small print restricts heavily. Customers find out the
  small print and trust drops.
- **Inconsistent application** — same scenario gets different
  outcomes depending on which customer-service rep handles it.

## The capability boundary

What AI helps with:

- **Claim triage** — auto-classify most claims to the right tier
  in minutes
- **Evidence analysis** — verifying photos against requirements,
  comparing damage patterns
- **Fraud-pattern detection** — surfacing the patterns named in
  Phase 4
- **Communications drafting** — empathetic, fast claim responses
  in the brand's voice
- **Lifecycle integration** — including programme info in post-
  purchase touchpoints

What AI doesn't help with:

- **Edge-case judgement.** A 6-year-old helmet claim with
  ambiguous evidence is a human call. Don't auto-deny.
- **The accusation calls.** When a claim looks fraudulent,
  humans make the contact, not AI. The relationship matters
  even at decline.

## The eval harness

**Eval R1 — Cycle time.** Median submission-to-shipped time. Target
≤5 days for clean cases, ≤10 for edge cases.

**Eval R2 — Claim-rate sanity.** Claim rate as percentage of units
sold per category. A spike signals either a product issue (real
problem — investigate) or programme abuse (review the safeguards).

**Eval R3 — Net-promoter delta.** Customers who claimed vs
comparable customers who didn't. The well-handled claim moment
should net-promote — meaning claim customers' NPS is at or above
non-claim customers'. If it's lower, the programme is hurting
not helping.

**Eval R4 — Loyalty conversion.** Of customers who claimed and
received replacement, what percentage purchase again within 12
months? Target >70%. The programme is a loyalty investment; this
is the measure.

## The failure modes

**No programme at all.** Customer crashes the helmet, posts on
social, gets a generic warranty-denied response, churns. Most
endurance brands lose a customer here every week.

**Programme exists but undiscoverable.** Buried at the bottom of
the T&Cs page. Customer finds out from a different brand's
marketing. Surfaces matter.

**Inconsistent application.** Front-line customer service applies
the rules differently. Train the team and put the tier triage in
software, not memory.

**Too generous on the broad side, too tight on the edge.** Brand
says "lifetime warranty" then declines a claim on a 2-year-old
helmet. The "lifetime" promise produced expectation; the decline
generates outsized resentment. Be specific upfront.

**No customer-history input.** Treating a 5-year customer with 8
prior purchases the same as a first-time-claimer is a missed
loyalty signal. Customer history should influence the tier
decision visibly.

## The receipts

**Premium cycling brand, scale-stage.** Brand had a quiet warranty
process. We rebuilt as a public crash-replacement programme with
Tier 1 (50% replacement on crashed helmets within 3 years of
purchase) and Tier 2 (25% for older or edge cases). Programme
adoption surfaced in customer surveys as the second-strongest
brand-loyalty driver. Repeat-purchase rate of customers who
claimed: 82%, vs 51% for non-claim customers.

**Running brand, growth-stage.** Brand introduced a wear-out
programme for premium racing shoes (replacement at 30% off if the
midsole compresses prematurely under defined conditions). Claim
rate sat at 0.4% of units sold — fraudulently inflated only briefly
when posted on a coupon-deal site, brand handled the spike with
extra evidence requirements and the claim rate normalised.
Customer-facing NPS up 7 points overall.

**Multi-sport brand, partial-failure engagement.** Brand launched
a programme with vague rules ("we'll replace gear at our discretion
for major mishaps"). Customer-service decisions varied; some
customers got free replacement, some got told to buy new. Front-
line confusion eroded trust faster than no programme would have.
We rebuilt with specific tier rules. Resolution: clear policy
beats generous discretion.

## Hand-off

The replacement programme connects to:
- **lifecycle-journey-builder** — post-purchase touchpoints mention
  the programme so customers know it exists
- **customer-content-rights** — claim stories (with consent) become
  brand-permission content
- **brand-guardrails-as-code** — claim-response copy runs through
  the brand-voice gates
- **retail-partner-programme** — partner shops handle claims on
  behalf of customers in some tiers; equip them with the rules
