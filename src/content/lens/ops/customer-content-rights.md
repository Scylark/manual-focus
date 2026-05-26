---
title: "Customer content rights pipeline"
stack: ops
description: "Get permission to use customer race photos and gear reviews in marketing — at scale, without burning the relationship. Consent, attribution, AI augmentation policy."
outputs: "Consent collection flow, content tagging system, attribution policy, AI augmentation policy"
readMin: 9
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content", "organic-social", "lifecycle"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-07-30
status: live
preview: false
---

## The brief

Endurance brands underuse their best content source: their customers.
Race photos shared on social, gear reviews left on the product page,
training stories sent to customer service. The audience-generated
material is more credible than anything the brand can produce, and
most brands either ignore it or use it without permission and quietly
hope nobody notices.

This playbook is the discipline. A consent-collection flow that earns
permission cleanly, an attribution policy that protects both sides,
a content tagging system so the brand can find the right asset for
the right campaign, and an AI augmentation policy that covers the
permissions to extend captured content into variants.

It is not the same as ambassador-programme work. Ambassadors are
sponsored. Customers are paying. The relationship dynamics, legal
position and content expectations are different. This pipeline
treats customer content as a gift to be earned, not a feed to be
mined.

## The pipeline

Five phases.

**Phase 1 — Consent collection.** Every customer-content moment
needs explicit consent in writing or recorded video. Standard moments:

- **Post-race photos shared via brand hashtag or @-mention** — DM
  with a short consent message and a one-click acceptance link
- **Product reviews on the brand's own product page** — opt-in
  checkbox at submission ("Manual Focus may share this review on
  marketing channels with attribution to [your handle / first
  name]")
- **Customer service emails containing strong stories** — explicit
  follow-up email asking permission, with the proposed use described
- **Event activations** — physical release form at the brand booth
  for any photo / video capture, alongside the activation playbook

The consent message is short, specific, and names the channels.
"We'd like to share your race photo on our LinkedIn, Instagram and
email newsletter, with credit to [@handle]" not "we'd like to use
your content for marketing."

**Phase 2 — Tagging and storage.** Every consented asset gets
tagged on intake:

- Customer handle / name / contact (for attribution)
- Consent scope (which channels, time period, AI augmentation
  permitted yes/no)
- Asset type (race photo, gear review, training story, video)
- Subject matter (which event, which product, which segment)
- Quality grade (hero-ready, mid-quality, social-cut quality)

The tagging schema mirrors the segment-broll-production library
so downstream skills can filter both archives.

**Phase 3 — AI augmentation policy.** Consent is the gate. If the
customer ticked "yes, including AI variants" — brand may augment
the asset under standard environmental-augmentation rules (no face
changes, no body changes, no product changes; environment changes
only).

If the customer ticked "no AI" — brand uses the asset as-is or
not at all.

Default position when the consent form predates AI augmentation
explicitly: treat as "no AI." Don't retrofit permission that wasn't
asked for.

**Phase 4 — Attribution and use.** Every published use credits the
customer per the consent scope. Standard format:

- Social: tag the customer's handle
- Email / newsletter: first name + last initial, or full attribution
  if the customer requested
- Long-form content: full attribution + a one-sentence bio if the
  customer supplied one
- Paid creative: attribution where the platform allows; consent
  form should specifically cover paid use

**Phase 5 — Audit and refresh.** Quarterly: sample 20 published
customer-content uses and verify the consent scope was honoured.
Any use beyond the scope gets retracted and the customer notified.

Consent expires per the scope (typical: 18–24 months from
collection). Refresh asks customers 60 days before expiry whether
to renew, edit or revoke.

## The capability boundary

Where AI helps:

- **Drafting consent messages** — short, friendly, channel-specific
- **Tagging and categorising** — automated against the schema, with
  human spot-check on quality grading
- **Asset search** — pulling the right customer asset for a brief
- **Augmentation within consent scope** — environmental variants
  where the customer ticked "yes"

Where AI doesn't help:

- **Inferring consent.** Permission must be explicit. The model can
  draft the asking; the customer does the granting.
- **Fabricating customer testimony.** Don't let the model "write in
  the customer's voice" beyond what they said. If you need a quote
  the customer didn't give, ask the customer for it.
- **Synthesising customer likeness.** Even with consent, generating
  new "customer content" of scenes they didn't share crosses an
  ethical line. The bright line in the ambassador programme applies
  here too.

## The eval harness

**Eval C1 — Consent rate.** Track DM-to-consent conversion across
the consent-ask channels. Below 30% means the ask is too pushy or
too vague. Above 60% means the brand has earned the trust to ask
well.

**Eval C2 — Tagging accuracy.** Random sample 20 tagged assets per
quarter; verify the tags against the source. Mis-tags lead to
mis-use. Acceptance: 95%+ accuracy.

**Eval C3 — Use-within-scope.** Quarterly audit: every published
customer-content piece checked against the original consent scope.
Out-of-scope uses get retracted. Track the count; should trend
toward zero.

**Eval C4 — Audience response.** Engagement on customer-content
posts vs brand-produced posts. Customer content typically out-
engages brand content 2–4x in endurance categories. If yours
doesn't, either the customer content isn't strong enough or the
attribution is weak (e.g. uncredited photos read as stock).

## The failure modes

**Hash-tag harvesting without consent.** Brand uses customer photos
shared via the brand hashtag without asking. Audience notices when
it happens to one of their friends. The brand's social presence
silently becomes "the one that takes our content." Always ask.

**Consent scope creep.** Customer agreed to "Instagram" three years
ago; brand now wants to use the image in a paid Meta campaign. The
consent doesn't cover it. Either ask again or don't use.

**Stock-photo-effect on customer content.** Brand publishes the
customer photo without attribution, with cropping that removes
context. The audience reads it as stock. Attribution is what makes
customer content work — strip it and you've made the brand's own
content, badly.

**Retroactive AI augmentation.** Brand wants to augment a 2024
customer photo with AI variants in 2026; the original consent
predates AI augmentation. Default behaviour: don't. Refresh
consent or use as-is.

**Asking too often.** Brand DMs every customer who shares a photo,
asks for consent. Audience tires of it. Set a frequency cap on
customer-content asks (e.g. once per customer per quarter).

## The pattern in practice

Illustrative scenarios — common shapes consent-led customer content takes. Specifics are illustrative; the patterns repeat.

**Premium cycling brand, scale-stage — the consent-rate find.** A
brand with no consent collection, using customer photos
informally. Installing the pipeline typically lands a consent DM
conversion rate around half — much higher than teams expect.
Within a year the library reaches hundreds of assets with explicit
scope on each. Customer-content features typically out-perform
brand-content features on email open rates because the attribution
is real.

**Trail running brand, growth-stage — the post-purchase consent
flow.** A brand using only brand-produced content. Launching with
a consent flow on post-purchase email typically builds a sizeable
library of customer race photos within six months. Customer-
content posts become the strongest organic-social drivers,
substantially out-performing brand content.

**Multi-sport apparel brand — the resisted-consent failure.** A
common failure mode: the brand resists the consent discipline
("everyone uses customer content, why are we adding friction?").
Months later, a customer publicly calls out the brand for using
their image without permission. Apology, asset retracted, brand
reputation takes a hit on social. Some disciplines aren't
optional, and consent is one.

## Hand-off

The customer-content library feeds:
- **social-content-factory** — channel-native cuts from customer
  assets
- **segment-broll-production** — customer assets tagged into the
  same library as brand-shot assets
- **lifecycle-journey-builder** — customer testimony in lifecycle
  touchpoints
- **ambassador-programme** — strong customer-content creators are
  often the right next ambassador signing
