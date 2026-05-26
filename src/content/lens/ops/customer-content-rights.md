---
title: "Customer content rights pipeline"
stack: ops
description: "Get permission to use customer race photos and gear reviews in marketing at scale, without burning the relationship. Consent, attribution, AI augmentation policy."
outputs: "Consent collection flow, content tagging system, consent log, AI augmentation policy"
readMin: 22
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content", "organic-social", "lifecycle"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-07-30
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **consent-collection flow** that runs in four channels (Instagram DMs after a brand-hashtag tag, post-purchase email after a review, customer-service follow-up after a strong story, event release forms at activations).
2. A **content tagging system** in your DAM (Frame.io, Dropbox, Google Drive, Air, or a Notion gallery) so every consented asset is filterable by customer, scope, product and quality.
3. A **consent log CSV** that captures the explicit scope per asset including channels, time window, paid use and AI augmentation permission.
4. An **AI augmentation policy** that defines what environmental edits are allowed within consent and what is never allowed.
5. A **quarterly audit ritual** verifying every published use was within its consent scope, with a retraction path when it was not.

## Who this is for

A growth, scale or enterprise endurance brand whose customers are already producing strong content (race photos, gear reviews, training stories) that the brand wants to use in marketing. The brand has at least one person who can run consent DMs and one who manages the DAM. If the audience is not yet producing content, run ambassador-programme first and seed the production.

## Before you start

- [ ] Instagram or TikTok business account access (DM permissions, hashtag monitoring)
- [ ] Customer service inbox access (Help Scout, Zendesk, Front, Intercom)
- [ ] A DAM or organised drive (Frame.io, Dropbox, Google Drive, Air, Notion gallery, anything searchable)
- [ ] Post-purchase email tool (Klaviyo, Customer.io, Sendgrid, equivalent) with the ability to add a consent CTA
- [ ] Event activation calendar so release forms ship with each event booth
- [ ] Brand voice profile (output of brand-voice-extraction) so DMs do not read like form letters
- [ ] Legal review of the consent text against UK GDPR or your local equivalent
- [ ] A frequency-cap policy decided upfront (typically once per customer per quarter)

If your legal team has not approved the consent text, do not ship the DMs. The cost of one badly worded DM is higher than the cost of a one-week legal turnaround.

## The pipeline

Five phases. One working week to install, then it runs continuously.

### Phase 1, consent collection

Four channels, each with its own ask.

**Step 1.1, the Instagram DM flow for brand-hashtag posts.**

In Instagram, monitor your brand hashtag and @-mentions. When a customer posts a strong piece of content tagging the brand, the operator (or a Zapier automation) sends a DM within 48 hours.

The DM template (paste into the operator's Slack channel as a snippet):

```text
Hey {FIRST_NAME}, this is {OPERATOR_NAME} from Cascadia
Endurance. Saw your post from {EVENT_OR_CONTEXT}, it's a
brilliant shot.

We'd love to share it on our Instagram and in our weekly email
newsletter, with credit to {@HANDLE}. The use would run for the
next 24 months, and we wouldn't put it in paid ads without
checking back with you.

Reply with 'yes share' if that works. Reply 'yes plus AI variants'
if you're also okay with us using the photo as a base for our
environmental b-roll work (no changes to you, just the
background). Reply 'no thanks' and we'll keep it as is.

Either way, congrats on the {EVENT}.
```

The DM names channels specifically, names the window, separates the AI question, and gives a graceful no path.

**Step 1.2, the post-purchase email flow for product reviews.**

In your post-purchase email tool, add a step 14 days after delivery. Subject "How's your {PRODUCT} treating you?" Body asks for a review on the product page. The review submission form has an opt-in checkbox at submission:

```text
[ ] Cascadia Endurance may share this review on marketing
channels (Instagram, email, our product page, our blog), with
attribution to {FIRST_NAME LAST_INITIAL} or your social handle
if you've provided one. The use runs for 24 months from
submission. Tick to grant. Leave unticked to keep your review
on the product page only.
```

Reviews submitted with the box ticked are logged into the consent log with scope. Reviews without are still useful (they sit on the product page) but the brand cannot reuse them.

**Step 1.3, the customer-service follow-up flow.**

When a customer-service email contains a strong story (a brilliant race report, a great crash-replacement story), the operator flags it. Within a week, a follow-up email goes out from the same operator (not a generic marketing address).

The template:

```text
Subject: A quick ask about your {EVENT} story

Hi {FIRST_NAME},

Thanks again for sharing your story about {SPECIFIC_DETAIL}. It
really stuck with the team.

We'd love your permission to share parts of it on our marketing
channels. Specifically:

- An Instagram post with a 2-3 sentence quote and credit to
  {@HANDLE} or {FIRST_NAME LAST_INITIAL}, whichever you prefer
- A possible feature in our weekly newsletter
- Maybe a longer-form blog post if you're up for a 20-minute
  conversation

The use would run for 24 months. We wouldn't put it in paid ads
without checking back. AI variants aren't planned for this kind
of content.

Reply yes, no or "tell me more" and we'll go from there.

Thanks,
{OPERATOR_NAME}
```

**Step 1.4, the event activation release form.**

At every brand activation (Trail Club events, race expos, Lavaredo training camps), a physical or QR-linked release form sits at the booth. The form covers photo and video capture at the event with scope, channels, window and AI policy. Customers tick to grant.

You should now have four consent channels live with templates calibrated to the brand voice.

### Phase 2, tagging and storage

Every consented asset gets tagged on intake.

**Step 2.1, the tagging schema.**

In your DAM, create the following metadata fields on every asset folder:

- Customer handle and name
- Customer email
- Asset type (race_photo, gear_review, training_story, video, testimonial)
- Subject event (UTMB Mont-Blanc 2026, Trail Club Wales 2026, etc.)
- Subject product (Vahla Storm Shell, Cascadia Trail Shoe v3, etc.)
- Quality grade (hero, mid, social_cut)
- Channels granted (a list)
- Paid use granted (yes / no / n/a)
- AI augmentation granted (yes / no / n/a)
- Consent granted date
- Consent expires date
- Attribution format (@handle, first_name_last_initial, full_name)
- Use count (how many times shipped)

In Frame.io or Air, these are custom metadata fields. In Google Drive, they live in a parallel spreadsheet. In Notion, they are database properties.

The schema mirrors the segment-broll-production library so downstream pipelines can filter both archives.

**Step 2.2, the auto-tagging prompt.**

For inbound assets where the operator captured the consent in DMs or email, paste the conversation into Claude to extract the structured tags.

```text
SYSTEM: You extract structured consent metadata from a customer
consent conversation. You are conservative. When the conversation
is ambiguous about a permission, you default to "not granted".
You return JSON only.

USER:
Consent conversation:
{PASTE_DM_OR_EMAIL_THREAD}

Asset summary (operator note):
{ASSET_DESCRIPTION}

Return JSON:
{
  "customer_handle": "<verbatim>",
  "customer_name": "<as stated>",
  "asset_type": "<race_photo | gear_review | training_story | video | testimonial>",
  "subject_event": "<event name or 'general training' or null>",
  "subject_product": "<product name or null>",
  "channels_granted": ["<channel>"],
  "paid_use_granted": <true | false>,
  "ai_augmentation_granted": <true | false>,
  "consent_window_months": <int>,
  "attribution_format": "<@handle | first_name_last_initial | full_name>",
  "ambiguity_flags": ["<anything the operator should double-check>"]
}

Rules:
- channels_granted only includes what was explicitly named.
  "Marketing" is not a channel.
- paid_use_granted defaults to false unless explicit.
- ai_augmentation_granted defaults to false unless explicit.
- consent_window_months defaults to 24 unless explicit.
- ambiguity_flags is the safety net. List anything the customer
  said that could be read two ways.
```

**Step 2.3, the asset upload routine.**

After auto-tagging, the operator does a 30-second eyeball check on the metadata, fixes any ambiguity_flags, and saves the asset to the DAM with the tags attached. A copy of the consent thread (DM screenshot, email PDF) lives next to the asset for audit.

You should now have a tagged, searchable consent library that grows as the consent flows run.

### Phase 3, AI augmentation policy

The bright lines.

**Step 3.1, the four-rule policy.**

Write this into the brand operations Notion as a page called *AI Augmentation Policy, Customer Content*.

```text
AI Augmentation Policy, Customer Content

Rule 1, consent is the gate. AI augmentation is only allowed
on assets where the customer explicitly granted "AI variants"
in their consent. No retrofitting.

Rule 2, environment only. Allowed edits: backgrounds, weather,
time-of-day, lighting, terrain colour. Never allowed: face
edits, body edits, product edits, race-bib number edits,
gender-swap, age-swap, ethnicity-swap.

Rule 3, attribution survives augmentation. The customer's
handle or name stays on every augmented variant. The variant
is not a new piece of content with new attribution.

Rule 4, the original consent scope still applies. If the
customer granted Instagram only, the augmented variant runs
on Instagram only.
```

**Step 3.2, the no-AI default for older consents.**

For assets whose original consent predates explicit AI augmentation language (anything before the AI question was added to the DM template), default to "no AI". Do not retrofit permission that was not asked for.

The consent log marks these with `ai_augmentation_granted = n/a` and the asset is used as-is or not at all.

**Step 3.3, the consent refresh path for AI.**

If the brand wants to augment an asset whose original consent did not cover AI, the operator sends a refresh DM:

```text
Hey {FIRST_NAME}, quick follow-up on the {EVENT} shot from
{ORIGINAL_DATE}. We'd love to extend the original permission to
include some environmental b-roll variants (background, weather,
no changes to you or the product). Reply 'yes AI' to grant, or
'no thanks' and we'll keep the original consent as-is.
```

You should now have an AI policy that the team can quote and a refresh path for older assets.

### Phase 4, attribution and use

Every published use credits the customer per the consent scope.

**Step 4.1, the attribution standards.**

| Channel | Standard attribution |
|---|---|
| Instagram organic | Tag the customer's handle in the post and on the photo |
| Email or newsletter | First name, last initial, or full attribution if the customer requested it |
| Long-form blog or site | Full attribution plus a one-sentence bio if supplied |
| Paid creative | Attribution where the platform allows; only on assets with paid_use_granted = true |
| Product page reviews | First name, last initial, by default |

**Step 4.2, the publish-time prompt.**

Before publishing, the channel operator runs a check.

```text
SYSTEM: You verify a customer asset is within its consent scope
for a planned publication. You return go or stop, with the
reasoning.

USER:
Asset metadata:
{PASTE_ASSET_METADATA_FROM_CONSENT_LOG}

Planned use:
- Channel: {CHANNEL}
- Format: {ORGANIC | PAID}
- Augmentation: {NONE | ENVIRONMENTAL | OTHER}
- Attribution shown: {FORMAT}
- Date of planned publish: {DATE}

Return JSON:
{
  "verdict": "<go | stop>",
  "scope_match": {
    "channel": <true | false>,
    "paid_format": <true | false>,
    "augmentation_match": <true | false>,
    "attribution_format_match": <true | false>,
    "within_window": <true | false>
  },
  "reason_if_stop": "<one sentence>",
  "remediation": "<refresh consent | downgrade to organic | change attribution | use as-is, no augmentation>"
}

Rules:
- "stop" if any scope_match field is false.
- "stop" if consent is within 60 days of expiry (flag for refresh).
- Remediation is concrete, not abstract.
```

You should now have a publish-time gate that catches scope violations before they happen.

### Phase 5, audit and refresh

The discipline that keeps the system honest.

**Step 5.1, the quarterly audit.**

Once per quarter, the operator samples 20 published uses across the four consent channels. For each, verify the use was within the recorded consent scope. Any out-of-scope use gets retracted and the customer notified with an apology and a corrected use.

Log the audit findings in the *Consent audit log* Notion page. Each entry: asset ID, planned use, actual use, in or out of scope, remediation.

**Step 5.2, the 60-day expiry refresh.**

The consent log's `consent_expires` field drives a Zapier automation. Sixty days before expiry, the operator gets a Slack notification listing every customer with consent about to expire. The operator decides: renew (send a refresh DM), let lapse (asset moves to archive), or revoke immediately if the customer asked.

**Step 5.3, the refresh DM template.**

```text
Hey {FIRST_NAME}, the consent you gave us for {ASSET_DESCRIPTION}
back in {ORIGINAL_DATE} comes up to its 24-month mark in
{DAYS_REMAINING} days.

We'd love to extend for another two years if that still works.
Reply 'yes extend' to renew, 'edit scope' if you'd like to
change what we can use it for, or 'revoke' and we'll take it
down across our channels.

No reply means it comes down at expiry, no questions asked.
```

You should now have a quarterly audit ritual and an expiry refresh path that compounds the library year over year.

## Worked example, end-to-end

Cascadia Endurance, scale-stage. Beth Lyons (brand and content lead) runs the consent operations. Saoirse Burns (channel operator) ships from the library.

**Phase 1.** Four consent channels live by end of week one. Instagram DM monitoring set up against #cascadiaendurance and brand @-mentions. Post-purchase email opt-in checkbox shipped in Klaviyo. Customer-service flagging convention agreed with the CX team. Trail Club events get release forms shipped to the booth ahead of the next activation.

**Phase 2.** Tagging schema lives in Frame.io as custom metadata. First-month intake is eight assets (rows in the CSV template at the end of this playbook).

- CC-2026-0001, Beth Allen, UTMB Storm Shell race photo. Hero-grade. Granted Instagram and email, no paid, no AI. Used three times in the first month.
- CC-2026-0003, Saoirse Burns (ambassador), Lavaredo Carbon Pack content. Full grant including paid and AI. Twelve uses across the first month.
- CC-2026-0006, Lila Okafor, Storm Shell crash story from the crash-replacement programme. Granted Instagram, email, site and blog. The consented story becomes the strongest social proof of the quarter, out-engaging the brand's hero campaign 3x.
- CC-2026-0008, Jordan Pierce, brand-hashtag post. DM sent, no reply after 14 days. Asset stays in the library tagged "do not use" and never ships.

**Phase 3.** AI augmentation policy posted in operations Notion. The Vahla Storm Shell hero campaign uses two augmented variants of CC-2026-0001 (with Beth's explicit grant) for terrain-variant social ads.

**Phase 4.** Publish-time prompt catches a near-miss. Saoirse plans to use CC-2026-0002 (Mark Tyler's gear review) in a paid Meta ad. The prompt stops the ship: `paid_use_granted` is false. Saoirse swaps to CC-2026-0003 (Saoirse's own ambassador content with paid grant) and the campaign ships clean.

**Phase 5.** Q3 audit samples twenty uses. All twenty within scope. The audit log gets the first clean quarter, which Beth uses as proof in the next legal review.

**The consent log after month one (extract):**

| Asset ID | Customer | Scope | AI granted | Uses |
|---|---|---|---|---|
| CC-2026-0001 | Beth Allen | Instagram, email, 24 months | No | 3 |
| CC-2026-0003 | Saoirse Burns | All channels owned and paid | Yes | 12 |
| CC-2026-0005 | Tom Vaughn | Instagram only, 12 months | No | 1 |
| CC-2026-0006 | Lila Okafor | Instagram, email, site, blog | No | 5 |
| CC-2026-0008 | Jordan Pierce | No response, do not use | n/a | 0 |

Customer-content posts out-engage brand-content posts by roughly 3x on Instagram saves and 2.2x on email click-through, within consent scope on every ship.

## Try it yourself

Three exercises. Each takes 30 to 60 minutes.

### Exercise 1, draft your DM template

Take the Step 1.1 template. Customise it for your brand voice. Read it out loud. Does it sound like a brand DM-ing a real human or like a contract being served? If it sounds like a contract, the brand voice has not been applied. Iterate.

### Exercise 2, run the auto-tagging prompt on three past consents

Pull three past consent conversations (DMs, emails, threads). Paste each into the Step 2.2 prompt. Read the output. Check the ambiguity_flags. Most past consents have ambiguity the team did not notice at capture time. The flags are the gap.

### Exercise 3, run the publish-time gate on a planned use

Pick one upcoming customer-content publish. Paste the asset metadata and the planned use into the Step 4.2 prompt. Read the verdict. If the verdict is "stop", the publish was about to ship out of scope and you just saved the brand a retraction.

## The eval gates

**Eval 1, consent rate.** Track DM-to-consent conversion across the consent-ask channels. Below 30% means the ask is too pushy or too vague. Above 60% means the brand has earned the trust to ask well.

**Eval 2, tagging accuracy.** Random sample twenty tagged assets per quarter and verify the tags against the source. Mis-tags lead to mis-use. Acceptance is 95% or above.

**Eval 3, use-within-scope.** Quarterly audit every published customer-content piece against the original consent scope. Out-of-scope uses get retracted, and the count should trend toward zero.

**Eval 4, audience response.** Engagement on customer-content posts compared with brand-produced posts. Customer content typically out-engages brand content 2 to 4x in endurance categories. If yours does not, either the customer content is not strong enough or the attribution is weak.

## The failure modes

**Hashtag harvesting without consent.** A brand uses customer photos shared via the brand hashtag without asking. The audience notices when it happens to one of their friends, and the brand's social presence silently becomes "the one that takes our content". Always ask.

**Consent scope creep.** A customer agreed to Instagram three years ago and the brand now wants to use the image in a paid Meta campaign. The consent does not cover it, so either ask again or do not use.

**Stock-photo effect on customer content.** The brand publishes the customer photo without attribution and with cropping that removes context. The audience reads it as stock. Attribution is what makes customer content work.

**Retroactive AI augmentation.** The brand wants to augment a 2024 customer photo with AI variants in 2026, but the original consent predates AI augmentation. The default behaviour is not to. Refresh or use as-is.

**Asking too often.** The brand DMs every customer who shares a photo and asks for consent. The audience tires of it. Cap at once per customer per quarter.

## The pattern in practice

Illustrative scenarios that show common shapes consent-led customer content takes. Specifics are illustrative and patterns repeat.

**Premium cycling brand, scale-stage, the consent-rate find.** A brand with no consent collection, using customer photos informally. Installing the pipeline typically lands a consent DM conversion rate around half, much higher than teams expect. Within a year the library reaches hundreds of assets with explicit scope on each, and customer-content features typically out-perform brand-content features on email open rates because the attribution is real.

**Trail running brand, growth-stage, the post-purchase consent flow.** A brand using only brand-produced content. Launching with a consent flow on post-purchase email typically builds a sizeable library of customer race photos within six months, and customer-content posts become the strongest organic-social drivers.

**Multi-sport apparel brand, the resisted-consent failure.** A common failure mode is when the brand resists the consent discipline ("everyone uses customer content, why are we adding friction?"). Months later, a customer publicly calls out the brand for using their image without permission. Apology, asset retracted, brand reputation takes a hit on social. Some disciplines are not optional, and consent is one.

## Templates

The consent log CSV. One row per consented asset. Drop into Google Sheets or your DAM's metadata layer.

[Download customer-content-consent-log-template.csv](/lens/templates/customer-content-consent-log-template.csv)

The CSV ships with eight sample Cascadia assets across the four consent channels. Wipe them, keep the headers, fill in your own.

**If your DAM or workflow differs, ask Claude to build a custom version.**

```text
SYSTEM: You generate a customer-content consent-log CSV
tailored to a specific brand's DAM, consent channels and
attribution conventions. The log captures every consented
asset with its scope.

USER:
My DAM: {FRAME_IO | DROPBOX | DRIVE | AIR | NOTION | OTHER}
My consent channels: {LIST_THE_CONSENT_CHANNELS}
My attribution standards: {LIST_BY_CHANNEL}
Extra fields I need: {LIST_EXTRA_FIELDS}

Generate a CSV with one row per asset and columns for:
- Asset_ID, Captured_Date, Customer_Handle, Customer_Name, Customer_Email
- Source, Asset_Type, Subject_Event, Subject_Product, Quality_Grade
- Channels_Granted, Paid_Use_Granted, AI_Augmentation_Granted
- Consent_Granted_Date, Consent_Expires, Attribution_Format
- Asset_URL, Used_On_Channels, Use_Count, Last_Used, Refresh_Notes
- (any extras I specified)

Pre-fill three example rows for an endurance brand. Return the
CSV directly.
```

## Hand-off

The customer-content library feeds:
- **social-content-factory**, with channel-native cuts from customer assets
- **segment-broll-production**, where customer assets get tagged into the same library as brand-shot assets
- **lifecycle-journey-builder**, with customer testimony in lifecycle touchpoints
- **ambassador-programme**, where strong customer-content creators are often the right next ambassador signing
- **crash-replacement-programme**, where consented claim stories become brand-permission social proof
