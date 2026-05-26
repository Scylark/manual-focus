---
title: "Direct-to-coach distribution, the underused endurance channel"
stack: demand
description: "Build a programme that sells through coaches, training plans and clubs. Tier menu, sample distribution, attribution, and the language coaches respond to."
outputs: "Coach roster scored to tiers, sample-distribution model, attribution framework, coach-channel content kit"
readMin: 22
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "lifecycle", "content"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-08-27
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts:

1. A **coach roster** of 200 to 2,000 named coaches across your target disciplines and geographies, scored on roster size, audience overlap, training-platform presence and recent engagement, with tier recommendations.
2. A **three-tier menu** defining what Tier A partner coaches, Tier B network coaches and Tier C database coaches each receive from the brand and what the brand expects in return.
3. A **sample-distribution model** with annual allowances per tier, a per-athlete request flow that screens out abuse, and a budget that the channel can be held accountable against.
4. An **attribution framework** combining direct sample-fulfilment tracking, checkout survey attribution and cohort attribution, plus a quarterly read on what the framework cannot see.
5. A **coach-channel content kit** of fit guides, training research summaries, early-access bulletins and clinic invitations, written in the register coaches respond to rather than the consumer register.

## Who this is for

A growth or scale-stage endurance brand whose product is recommended at the coach-to-athlete moment (running shoes, bikes, nutrition, gear), with a marketing lead who can hire or repurpose a coach-channel manager and a CFO who will fund the sample programme as a real budget line. If the brand sells exclusively to elite age-group athletes or has no product the coach would actually recommend, this playbook is not the right channel.

## Before you start

- [ ] List of three to five target disciplines and three to five geographies the brand wants to penetrate
- [ ] Access to TrainingPeaks coach directory (free read access), Final Surge coach lookup, the British Triathlon coach register, UK Athletics CoachHub, USA Track and Field coach search, or your discipline's equivalent
- [ ] A CRM with coach segmentation capacity (HubSpot, Salesforce, Pipedrive) and an email tool with custom audience support (Klaviyo, Mailchimp)
- [ ] Sample fulfilment infrastructure with the ability to ship to named athletes at no charge to the coach
- [ ] An optional but valuable Strava integration if the brand wants to track athlete training patterns
- [ ] A coach-channel budget of at least 2% of total marketing spend, sized against the LTV uplift you expect
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode

The sample budget is the programme. Without it, the rest is theatre. Get the budget signed off before you scope the tiers.

## The pipeline

Six phases. End-to-end in a working week for the discovery and design, then ongoing operation.

### Phase 1, coach landscape map

The first move is the database. Most brands underestimate how many named coaches are worth tracking.

**Step 1.1, pull the coach directories.**

In TrainingPeaks, the coach directory is at trainingpeaks.com/coach-search. Filter by sport and location. The free read returns up to 100 results per query, scroll through. In Final Surge, the equivalent is finalsurge.com/Coach.cshtml. For UK Athletics coaches, the register sits at uka.org.uk and lists qualified coaches by region. For British Triathlon, similar at britishtriathlon.org. USA Triathlon and USA Track and Field publish similar national lists.

Copy each coach's name, discipline, platform, country, and any publicly listed roster size or athlete count into the coach-tier-roster template.

**Step 1.2, download the roster template.**

Grab [coach-tier-roster.csv](/lens/templates/coach-tier-roster.csv). Open in Sheets or Excel. The columns cover name, discipline, platform, country, roster size, tier, sample allowance, athletes seeded year-to-date, verified purchases attributed, last contact date, renewal decision and notes.

**Step 1.3, build a custom roster template if your discipline differs.**

```text
SYSTEM: You generate a coach-roster database template for a brand's
direct-to-coach programme based on their target disciplines and
geographies. The template captures the columns the brand needs to
score and tier coaches.

USER:
Target disciplines: {LIST_DISCIPLINES}
Target geographies: {LIST_COUNTRIES}
Coach-classification categories the brand cares about:
  {INDIVIDUAL | COLLECTIVE | CLUB | PLATFORM | FEDERATION | INFLUENCER}

Generate a CSV template with the standard scoring columns plus any
discipline-specific columns the brand should track.

Return CSV directly, no commentary.
```

**Step 1.4, score and tier each coach.**

```text
SYSTEM: You score and tier coaches in a brand's direct-to-coach
roster. You return a tier recommendation (A, B or C) anchored to four
inputs, roster size, audience overlap with the brand, training-
platform presence and recent engagement signals.

USER:
Coach: {COACH_NAME}
Discipline: {DISCIPLINE}
Platform: {PLATFORM}
Roster size (public): {ROSTER_SIZE}
Audience overlap evidence: {NOTE_OVERLAP_OR_NONE}
Recent engagement with the brand: {NOTE_ENGAGEMENT_OR_NONE}

Return JSON:

{
  "coach": "<name>",
  "tier_recommendation": "<A | B | C>",
  "rationale": "<one sentence>",
  "first_action": "<the next concrete action with this coach>"
}

Rules:
- Tier A only for coaches with proven audience overlap or strong
  brand engagement signals.
- Tier B for known coaches in target disciplines with no recent
  engagement evidence.
- Tier C is the entry tier, default for newly-added coaches.
- "first_action" is concrete (e.g. "send Q3 fit guide", "invite to
  Lake District clinic"), not generic.
```

You should now have a tiered database with first actions per coach.

### Phase 2, tier menu

What each tier receives from the brand and what the brand expects back.

The standard menu:

| Tier | Coach receives | Coach gives |
|---|---|---|
| A (partner) | Full personal kit annually, 2 to 5 athlete samples per quarter on request, on-site training, fitting clinics, athlete-feedback channel | Active recommendation when fit, honest product feedback, attendance at quarterly partner calls |
| B (network) | Annual product info, periodic outreach, sample programme access on application (1 personal kit, 3 athlete samples per quarter) | Receipt of brand newsletter, optional engagement |
| C (database) | Brand newsletter, opt-in product announcements | Implicit, on the list as future Tier B candidate |

The Tier A coach gets a named relationship manager. Tier B gets a shared inbox. Tier C gets the newsletter.

### Phase 3, sample distribution programme

The hardest balance, generous enough that coaches feel respected, structured enough that the channel is not a free-product giveaway.

**Step 3.1, build the request form.**

The form fields, at minimum:

- Coach name (pre-filled from CRM)
- Athlete name
- Product needed (SKU or description)
- Why this fit (one sentence)
- Athlete's training platform link (Strava, TrainingPeaks)
- Race or goal context

Build the form in Typeform, HubSpot or your CRM. Route submissions to the coach-channel manager for triage. Default approval within 24 hours during business days.

**Step 3.2, set the abuse-detection rule.**

```text
SYSTEM: You triage coach sample requests for abuse patterns. You
flag requests that fit known abuse shapes. You return a triage
verdict and a reason.

USER:
Coach: {COACH_NAME}
Coach tier: {TIER}
Athletes seeded YTD: {COUNT}
Annual allowance: {ALLOWANCE}
Verified purchases attributed to this coach YTD: {PURCHASES}
Current request: {ATHLETE_NAME}, {PRODUCT}, {WHY_FIT}

Return JSON:

{
  "verdict": "<approve | hold for review | block>",
  "reason": "<one sentence>",
  "follow_up_action": "<the next step for the coach-channel manager>"
}

Rules:
- "approve" if within allowance, coach is in good standing, and
  request reads as athlete-specific.
- "hold for review" if pace of requests is high relative to
  verified attribution.
- "block" if coach is over annual allowance or request lacks
  athlete-specific reasoning.
- Reason must be specific.
```

You should now have a sample programme with a request flow, an abuse rule and a budget the channel can defend.

### Phase 4, educational content for coaches

What coaches actually want is not ads. They want product knowledge, training research, early-access to launches, and small-group community moments.

**Step 4.1, set the content lines.**

Four quarterly lines:

- **Product knowledge.** Fit guides, comparison docs against competitors, technical detail their athletes will ask about. One piece per major product launch plus a quarterly refresh.
- **Training research.** What the brand has invested in around athlete recovery, training load or technique. One piece per quarter, drawn from real R and D rather than repackaged consumer content.
- **Early-access.** Two weeks before public launch, Tier A and B coaches get a launch brief covering what is changing, why, what athletes will ask about and how to answer.
- **Coach community moments.** Quarterly product clinics, athlete-recovery roundtables, fitting workshops. In person for Tier A, virtual for Tier B.

**Step 4.2, write in the coach register.**

```text
SYSTEM: You draft content for the brand's coach channel. Coaches read
in a different register than consumers. They want technical detail,
fitting nuance, recovery science, and respect for their expertise.
You write tight, technical, no marketing language, no exclamation
marks, no hype. The coach is a professional.

USER:
Content type: {fit_guide | training_research | launch_brief | clinic_invitation}
Product or topic: {DETAILS}
Audience: {coach_tier}
Constraints:
  - Word count {WORDS}
  - No marketing language
  - One CTA, action-shaped

Return JSON:

{
  "headline": "<60 chars max>",
  "subhead": "<140 chars max>",
  "body": "<the body, in the coach register>",
  "cta": "<the action>",
  "the_thing_a_consumer_version_would_say_that_this_one_does_not": "<one sentence noting the editorial choice>"
}

Rules:
- No "you'll love this" register.
- Specific numbers and named technical terms where relevant.
- The CTA is a concrete action, not "learn more".
```

You should now have a quarterly coach content calendar and the draft prompt to populate it.

### Phase 5, attribution framework

Coaches do not carry discount codes and their recommendations do not tag. Three attribution layers cover most of the channel.

**Step 5.1, instrument the three layers.**

- **Direct attribution.** For sample-fulfilment requests, the brand knows which coach requested which athlete. When that athlete subsequently purchases, the brand can credit the coach. Set up a custom field in the CRM mapping athlete email to requesting coach.
- **Survey attribution.** At checkout, an optional "who recommended us?" question with a coach-name autocomplete. Most customers will skip, but the ones who answer surface coaches who are quietly driving demand the direct attribution misses.
- **Cohort attribution.** Track concentration of a coach's known athletes (from their public TrainingPeaks roster) purchasing the same SKU in a window. The concentration above baseline is a signal the coach is recommending.

**Step 5.2, accept the limit.**

None of this is complete. The coach channel is justified by incremental LTV, qualitative feedback and brand reputation in coaching circles, not just last-click attribution. The honest read in the quarterly review names this and reports the qualitative signal alongside the numbers.

You should now have an attribution framework that names what it sees and what it does not.

### Phase 6, annual review

Tier A coaches get a structured annual conversation, what worked, what did not, was the sample programme appropriate, would they recommend the brand to other coaches.

**Step 6.1, run the renewal prompt for Tier A.**

```text
SYSTEM: You generate a renewal recommendation for a Tier A partner
coach based on the year's attribution data, sample programme usage
and qualitative engagement signals.

USER:
Coach: {COACH_NAME}
Year-to-date athletes seeded: {COUNT}
Verified purchases attributed: {COUNT}
Pace of attribution vs Tier A baseline: {RATIO}
Engagement signals (clinic attendance, partner-call attendance,
feedback notes): {NOTES}
Qualitative read from relationship manager: {NOTES}

Return JSON:

{
  "renewal_lean": "<renew with expand | renew flat | taper to B | end>",
  "rationale": "<two sentences>",
  "single_concern": "<one sentence>",
  "single_strength": "<one sentence>"
}

Rules:
- "renewal_lean" is provisional. The human relationship manager
  holds the final call.
- "end" requires both quantitative and qualitative evidence.
```

You should now have a defensible renewal recommendation per Tier A coach to take into the annual conversation.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand, scale-stage, building a coach channel for the Vahla Range launch.

**Phase 1 output.** 312 named coaches across UK and Ireland in trail running, ultra and adjacent disciplines. Pulled from TrainingPeaks (174), British Triathlon's trail-aligned coach register (38), independent coach websites (62) and Final Surge (38). Initial tier split, 22 Tier A candidates, 110 Tier B, 180 Tier C.

**Phase 2 output.** Tier menu drafted and shared with the team. The Tier A allowance is 3 personal kits per year plus 12 athlete samples per quarter. Cascadia's CFO signs off at 1.8% of marketing budget for the sample line.

**Phase 3 output.** Sample request form built in HubSpot. The abuse-detection rule runs on every submission. In month one, two requests are held for review and one is blocked (the "coach" has no public coaching presence).

**Phase 4 output.** Quarterly coach content lined up. Q3 fit guide for the Vahla shell, including the membrane spec comparison against Salomon S/LAB and Inov-8. Training research piece on multi-day recovery for ultra coaches. Launch brief for the Vahla shorts going to Tier A two weeks ahead. In-person clinic in the Lake District in October for 18 Tier A coaches.

**Phase 5 output.** Attribution framework live. Month one, direct attribution captures 24 purchases from 38 athletes seeded. Survey attribution captures another 9 purchases citing a Cascadia partner coach. Cohort attribution flags an unusual concentration of TrainingPeaks athletes coached by Phil Owusu buying the Vahla shorts in the two weeks after the launch brief landed.

**Phase 6.** End of year. Saoirse Burns, the independent trail coach, gets a "renew with expand" lean. Her 22 athletes seeded year-to-date yielded 7 verified purchases plus a measurable cohort signal. Cascadia expands her sample allowance and invites her to host a clinic. Aleks Vrana in Czech Republic gets "renew flat" because attribution is steady but the engagement signals are middling. Mara Kjeldsen, a Tier C from Norway who has engaged consistently with the newsletter and submitted three sample requests through her network coach, gets promoted to Tier B. North Cotswold Tri Squad, a Tier B with 80 athletes but only 1 verified purchase year-to-date, gets demoted to Tier C with a transparent conversation about why.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, build a 20-coach starter database

Pick one discipline and one geography. Spend an hour on TrainingPeaks and your discipline's federation register. Build a 20-coach database with the columns from the template. Score and tier each one through the Phase 1 prompt. The exercise teaches you what data is actually available and where the gaps are before you scale to 200.

### Exercise 2, run the sample-request abuse prompt

Take five hypothetical sample requests, three legitimate, two with abuse shapes. Run the Phase 3 prompt against each. Read the verdicts. If the model approves an abusive request or blocks a legitimate one, sharpen the inputs (often "athletes seeded YTD" is missing or "verified purchases" is undercounted in the test).

### Exercise 3, draft one coach-register piece

Pick a recent consumer email or blog post and draft the coach-register equivalent through the Phase 4 prompt. Compare the two. The coach version should read tighter, more technical, with a concrete action rather than a vague CTA. If the two read similar, the inputs need a stronger steer on register.

## The eval gates

**Eval 1, Tier A coverage.** Tier A coaches are active across the brand's priority disciplines and geographies. Gaps flagged for recruitment. A discipline with zero Tier A coaches in a target geography is a recruitment priority for the next quarter.

**Eval 2, sample-to-purchase conversion.** Of athletes who received samples through a coach, what percentage purchase the product or an adjacent SKU within 90 days. Target 25% or higher for Tier A samples. Below 15% means the coach is not recommending well or the product is not landing in the athlete's hands at the right moment.

**Eval 3, coach-survey attribution.** Percentage of new customers naming a coach at checkout. The trend matters more than the absolute. A climbing share quarter on quarter signals the channel is working.

**Eval 4, channel cost per customer.** Total programme cost (samples, education, events, headcount) divided by attributable customer acquisitions. Below the brand's blended CAC means the channel is paying back. Allow nine to twelve months for the comparison to stabilise.

**Eval 5, attribution honesty.** The quarterly review names what the framework cannot see. If the qualitative read from Tier A relationship managers contradicts the attribution numbers, surface the contradiction rather than picking the convenient story.

## The failure modes

**Treating coaches like influencers.** Coaches are not paid to post. A "we will give you free product if you do an Instagram review" pitch insults serious coaches who are not in the influencer game. Build the programme around their athletes' needs rather than the brand's social KPIs.

**Sample-programme abuse.** A small number of "coaches" sign up to receive free product without serving real athletes. Light verification at signup (link to coaching profile, list of named athletes, training-platform credentials) screens out most. The Phase 3 prompt catches the rest.

**Pricing favours direct.** The brand offers consumer pricing better than what shops or coaches can match. Coaches stop recommending because they look bad recommending a brand the customer can buy cheaper elsewhere. Protect the channel pricing.

**Brand-led product changes that hurt coaches' athletes.** The brand changes the shoe last, coaches' athletes spent the season fitting the old version. The brand communicates product changes to Tier A coaches before public announcement so they can brief their athletes ahead of the change.

**Coach-channel content treated as consumer marketing.** Coaches unsubscribe. The channel decays. Coach communications use a different register, a different cadence and different content. Run them through the Phase 4 prompt, not through the consumer email template.

## The pattern in practice

Illustrative scenarios that show common shapes a coach-channel programme takes. Specifics are illustrative and the patterns repeat.

**Premium running brand, scale-stage, the build-from-zero.** A brand with no existing coach programme. Building one around the playbook over twelve months typically lands at a few dozen Tier A coaches across the target geographies and several hundred Tier B coaches on the list. Sample-to-purchase conversion in Tier A typically runs around a third. Channel attribution at checkout climbs from negligible into double-digit percentages within a year. LTV of coach-channel customers runs materially above brand average.

**Triathlon brand, growth-stage, the elite-to-coach reallocation.** A brand sponsoring elite athletes whose audiences are other elite athletes, while the audience the brand wants is age-group triathletes served by independent coaches. Reallocating elite-sponsorship slots to a coach-partner programme typically lifts channel attribution into double-digit percentages within two seasons.

**Cycling brand, the no-sample-budget failure.** A brand wants a coach programme but refuses to budget sample fulfilment. Tier A coaches sign up, expect samples for their athletes, do not receive them, and the channel goes cold within months. The lesson is that sample budget is the programme. Without it, there is no programme.

## Hand-off

The coach channel feeds:
- **ambassador-programme**, Tier A coaches sometimes become the right ambassador signing
- **retail-partner-programme**, coaches often drive customers to shops, so messaging stays aligned
- **lifecycle-journey-builder**, post-purchase, customers acquired through coaches get a coach-acknowledging touchpoint
- **race-day-demand-pipeline**, coaches host athlete-pickup activations at sponsored events
