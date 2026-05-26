---
title: "Founder voice and institutional voice, the dual-voice approach"
stack: brand
description: "Separate the founder's voice from the brand's institutional voice. Map surface ownership, build a credible peer voice, write the contract that lets both work."
outputs: "Two voice profiles, surface-ownership map, founder-team contract, drift checks"
readMin: 20
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content", "organic-social", "pr"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-09-17
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **founder voice profile**, extracted from the founder's actual writing across personal blog, LinkedIn, podcast scripts and founder-bylined press pieces.
2. An **institutional voice profile**, built as a credible peer to the founder's rather than a faded copy, with shared lexicon but distinct sentence-level habits.
3. A **surface-ownership map**, every brand surface assigned to founder, institutional or shared, with the rules for when each voice gets used.
4. A **founder-team contract**, a one-page written agreement that resolves the recurring failure modes (ghostwriting under the founder's name, institutional teams putting words in the founder's mouth, founders bottlenecking brand surfaces).

## Who this is for

A scale-stage or enterprise endurance brand where the founder still writes meaningfully, but the brand has outgrown the founder's available writing time. Or a brand approaching a founder transition (sale, step-back, sabbatical) that has never built a voice that runs without the founder. If the founder is your only writer and you are happy with that, you do not need this yet, you need it the moment the founder slows down.

## Before you start

- [ ] A completed base voice profile (from brand-voice-extraction)
- [ ] Access to the founder's personal writing archive, blog, LinkedIn, podcast transcripts, founder-bylined press
- [ ] Access to the brand's institutional content output for the same period
- [ ] A one-hour calendar slot with the founder for the contract conversation
- [ ] A one-hour slot with the marketing lead for the same conversation
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode

If the founder has not written publicly in twelve months and the marketing team has been writing institutional copy "in the founder's voice" all year, the audit will surface that the institutional voice is a faded founder copy. That is the most common starting state.

## The pipeline

Four phases. Spread across a working week, with the contract conversation in the middle.

### Phase 1, voice mapping

Identify the two voices that actually exist in the brand's surface.

**Step 1.1, build the founder corpus.**

Create a folder `founder-corpus/`. Pull eight to fifteen pieces of the founder's actual writing, in plain text. Personal blog posts, LinkedIn long-form posts (not one-liners), podcast scripts the founder wrote, op-eds the founder wrote in industry press. Skip anything ghost-written, even if it carries the founder's name.

**Step 1.2, build the institutional corpus.**

Create a folder `institutional-corpus/`. Pull eight to fifteen pieces of the brand's writing that the founder did not write. Product pages, ad creative, customer service email templates, the team-written blog, the marketing newsletter.

**Step 1.3, run the base extraction on each.**

Use the prompt from the brand-voice-extraction playbook. Run it twice, once on each corpus. You should now have two structural voice profiles.

**Step 1.4, run the diff.**

Paste both profiles into this prompt:

```text
SYSTEM: You compare two voice profiles for the same brand, the
founder's voice and the institutional voice. You surface where they
share patterns and where they differ, and you flag whether the
institutional voice reads as a credible peer or as a faded copy.

USER:
Founder profile: {FOUNDER_PROFILE_JSON}
Institutional profile: {INSTITUTIONAL_PROFILE_JSON}

Return JSON shaped like:

{
  "shared_patterns": [
    {"pattern": "<observable>", "evidence_founder": "<verbatim>", "evidence_institutional": "<verbatim>"}
  ],
  "distinct_patterns": [
    {
      "pattern_founder": "<observable>",
      "pattern_institutional": "<observable>",
      "delta_quality": "<distinct-and-deliberate | blurred | imitation>"
    }
  ],
  "institutional_voice_diagnosis": "<credible_peer | faded_copy | generic_marketing | undefined>",
  "diagnosis_evidence": ["<verbatim observations supporting the diagnosis>"]
}

Rules:
- Verbatim evidence for every claim.
- Diagnose "faded_copy" only when at least 3 institutional patterns
  read as weaker versions of the founder's.
- Diagnose "generic_marketing" when fewer than 2 patterns overlap with
  the founder's.
```

**Expect output like:**

```json
{
  "shared_patterns": [
    {"pattern": "second-person address", "evidence_founder": "you spend a winter base-training", "evidence_institutional": "you ride this every week"},
    {"pattern": "no exclamation marks", "evidence_founder": "", "evidence_institutional": ""}
  ],
  "distinct_patterns": [
    {
      "pattern_founder": "Long sentences, mean 22 words, frequent subordinate clauses",
      "pattern_institutional": "Short sentences, mean 11 words, low subordination",
      "delta_quality": "distinct-and-deliberate"
    },
    {
      "pattern_founder": "Opens with anecdote, then claim",
      "pattern_institutional": "Opens with claim, then evidence",
      "delta_quality": "distinct-and-deliberate"
    }
  ],
  "institutional_voice_diagnosis": "credible_peer",
  "diagnosis_evidence": [
    "Institutional voice has its own opener pattern (claim-first) that the founder does not use",
    "Sentence length is materially shorter (11 vs 22) so readers can tell the voices apart on first paragraph"
  ]
}
```

**You should now have** two structural profiles and a diff report telling you whether the brand has a real institutional voice, a faded founder copy or generic marketing voice.

### Phase 2, surface-ownership mapping

The diff tells you what you have. The map tells you what owns what.

**Step 2.1, list every brand surface.**

Open a spreadsheet or Notion table. List every place the brand publishes language under its name. Be specific.

| Surface | Frequency | Current owner |
|---|---|---|
| Founder LinkedIn | weekly | Founder |
| Brand LinkedIn | three per week | Marketing team |
| Founder personal newsletter | monthly | Founder |
| Brand monthly newsletter | monthly | Marketing team |
| Product pages | quarterly updates | Marketing team |
| Blog long-form | weekly | Mixed |
| Athlete-letter intros | per launch | Founder reviews |
| Customer service email templates | annual review | CX team |
| Press releases | per news cycle | PR + founder approval |
| Year-letter | annual | Founder |
| Podcast (if founder hosts) | weekly | Founder |
| Crisis communications | as needed | Founder |
| Race-day social acknowledgements | per race weekend | Marketing team |
| Ad creative copy | continuous | Marketing team |

**Step 2.2, assign the owner.**

For each surface, decide which voice owns it. Rule of thumb. The founder owns the personal surfaces (founder-named accounts, founder-bylined pieces, opinion, year-letters), the institutional voice owns the operational surfaces (product, customer service, ads, race-day social), and a small shared category covers high-stakes brand pieces where both voices contribute (athlete letters at launch, major partnership announcements, crisis communications).

**Step 2.3, decide the review rule per surface.**

Three categories.

- **Founder writes.** The founder drafts or substantially edits. AI assists structure, but the words are the founder's. No ghostwriting under the founder's name.
- **Institutional team writes.** The marketing team drafts and ships within the institutional voice rubric. No founder approval needed, unless flagged.
- **Shared.** Institutional team drafts, founder reviews, founder makes specific edits. Drafting prompt uses both profiles, the rubric runs both.

**You should now have** a complete surface-ownership map saved as a Notion page or spreadsheet, accessible to anyone who touches brand surface.

### Phase 3, institutional voice construction

If the diff diagnosed the institutional voice as faded copy or generic marketing, you build a real one here.

**Step 3.1, pick three deliberate distinctions.**

The institutional voice should be a credible peer to the founder's. It shares lexicon, reference points and never-does list. It differs deliberately on three or four sentence-level patterns so a reader can tell which voice they are reading without being told.

Common distinctions that work.

- Founder writes long, institutional writes short, or vice versa
- Founder opens with anecdote, institutional opens with claim
- Founder uses subordinate clauses, institutional uses periodic short sentences
- Founder writes in first person plural (we), institutional writes in third person (the brand)

Pick three or four. Write them into the institutional voice profile as deliberate constraints.

**Step 3.2, build the institutional POV.**

The founder believes everything they have ever written. The brand believes a small number of specific things. List the institutional POV.

```text
SYSTEM: You build the institutional point-of-view statement for a
brand, distinct from the founder's personal POV. The brand's POV is
limited to four or five specific claims the brand is willing to
defend as an institution.

USER:
Founder corpus: {FOUNDER_CORPUS_JSON}
Brand category: {CATEGORY}
Brand stage: {STAGE}
The brand's mission statement: {MISSION}

Return JSON shaped like:

{
  "institutional_pov": [
    {
      "claim": "<one-sentence claim, defensible as the brand>",
      "evidence_from_founder_writing": "<verbatim>",
      "anchored_to_brand_action": "<a thing the brand actually does>"
    }
  ],
  "founder_pov_not_for_brand": [
    "<topics the founder has views on that the brand does not formally claim>"
  ]
}

Rules:
- 4 to 5 institutional POV claims, no more.
- Every claim must trace to a founder writing AND a brand action.
- "Founder-only" topics go in the second list. The brand has no view.
```

**Expect output like:**

```json
{
  "institutional_pov": [
    {
      "claim": "Trail-running kit should survive a season, not a season-launch.",
      "evidence_from_founder_writing": "I have shoes from 2019 still going. That is the bar.",
      "anchored_to_brand_action": "Two-year guarantee on shells and packs."
    },
    {
      "claim": "Volume in base training is non-negotiable, technique sits on top.",
      "evidence_from_founder_writing": "You do not get the hard sessions until you have the easy hours in the bank.",
      "anchored_to_brand_action": "Sponsorship pattern, the brand supports volume-block athletes specifically."
    }
  ],
  "founder_pov_not_for_brand": [
    "training nutrition philosophy",
    "footwear minimalism debates",
    "race-day pacing strategy"
  ]
}
```

**Step 3.3, run the institutional voice rubric.**

Take the existing institutional corpus. Score it against the new institutional profile (the one with deliberate distinctions). Pieces that fail the rubric get flagged for rewrite or retirement. The institutional rubric should now reject anything that reads as either a faded founder copy or generic marketing.

**You should now have** an institutional voice profile with deliberate distinctions, an institutional POV statement, and a rubric to gate new drafts.

### Phase 4, the founder-team contract

The contract sounds bureaucratic. It solves a real recurring failure, and once it exists nobody has to relitigate it.

**Step 4.1, draft the contract.**

A single page. Five clauses. Use the template below or run it through Claude with the surface map and POV statement as input.

```text
FOUNDER-TEAM VOICE CONTRACT

Between {FOUNDER_NAME} and the {BRAND_NAME} marketing function,
agreed on {DATE}, reviewed annually.

1. Founder-owned surfaces. The founder writes, drafts or
substantially edits anything published under their name. The
institutional team may assist with structure and outline. The team
does not ghost-write under the founder's name. List of founder-owned
surfaces, see surface-ownership map.

2. Institutional-owned surfaces. The institutional team writes,
ships and owns the operational surfaces (product pages, ad creative,
customer service email templates, race-day social, brand-handled
LinkedIn). No founder approval required within agreed boundaries.
List of institutional surfaces, see surface-ownership map.

3. Shared surfaces. Athlete letters at launch, major partnership
announcements, crisis communications. The team drafts, the founder
reviews and edits. Both voices contribute.

4. Quote attribution. Any quote published under the founder's name
must be a quote the founder actually approved, in writing, with the
specific words. No reconstructed quotes, no "the founder said
something like" attributions.

5. POV boundaries. The brand holds the institutional POV statement
as its formal position. The founder's personal views on
[founder-only topics from Phase 3] are not the brand's. The brand
does not contradict the founder publicly, and the founder does not
expect the brand to defend every position they hold personally.

Signed, {FOUNDER}
Signed, {MARKETING_LEAD}
```

**Step 4.2, run the contract conversation.**

A one-hour meeting between the founder and the marketing lead. Walk the surface-ownership map. Walk the contract clauses. Edit live. The conversation is the point as much as the document, the document just makes the conversation portable.

**Step 4.3, save the contract.**

Save it where both the founder and the marketing function can find it. Calendar a date six months from now for review.

**You should now have** a signed one-page contract, a date for first review, and a portable record of the conversation.

## Worked example, end-to-end

Cascadia Endurance, the UK trail-running apparel brand, scale-stage. The founder writes a personal Substack monthly, hosts a fortnightly podcast, posts long-form on LinkedIn. The marketing team writes everything else.

**Phase 1 output.** Founder corpus, twelve pieces, 48,000 words. Institutional corpus, fourteen pieces, 31,000 words.

The diff report diagnoses the institutional voice as `faded_copy`. Evidence: the institutional pieces use the founder's reference points (the long Sunday, first light, the Cumbrian rain) but at half the founder's sentence length, with the founder's openers (anecdote-first) imitated unevenly. Three patterns read as weaker versions of the founder's.

**Phase 2 output.** Twenty-one surfaces mapped. Founder owns six (personal Substack, podcast, LinkedIn long-form, year-letter, op-eds, crisis communications). Institutional owns twelve (product pages, ad creative, brand LinkedIn, brand newsletter, customer service templates, race-day social, athlete profiles, blog short-form, partnership pages, returns flow, account-creation copy, error states). Three shared (athlete letters at launch, major partnership announcements, founder-quoted PR).

**Phase 3 output.** Institutional voice rebuilt with three deliberate distinctions.

- Founder writes long sentences (mean 22 words), institutional writes short (mean 11 words)
- Founder opens with anecdote, institutional opens with the claim
- Founder uses first person plural (we), institutional uses third person (the brand)

Institutional POV statement, four claims.

1. Trail-running kit should survive a season, not a season-launch.
2. Volume in base training is non-negotiable.
3. The unwitnessed PR matters as much as the podium.
4. Athletes do the work, the brand makes the tools.

Founder-only topics (not the brand's POV): nutrition philosophy, footwear minimalism, race-day pacing strategy.

**Phase 4 output.** Signed contract, calendar review set for six months. The founder reclaims around six hours a week of writing time. Institutional output approximately doubles. The first quarter under the new contract shows brand newsletter open rates holding (the institutional voice is a credible peer, not a faded copy) while the founder's personal Substack engagement rises (the founder is writing fewer, better pieces).

A sample paragraph from the institutional voice, post-rebuild:

> The Vahla shell is forty grams heavier than the lightweight category. That is on purpose. The lightweight category does not survive the second loop. The Vahla does. The membrane breathes when you do, holds when the rain turns sideways. The brand made it for hour four onwards, when the season's work starts to show.

And the founder, same launch, different voice:

> Every January for the last six years I have written the same plan in the same notebook, and every January the plan changes shape by mile twelve of the first long Sunday, because the body that turns up in January is never quite the body the plan was written for. The shell I have been wearing through this build is forty grams heavier than I would have chosen ten years ago, and that has turned out to matter, because the lighter shells gave up on me around hour four every time the weather turned, and forty grams of trustworthy membrane has felt like a fair trade for the miles that survived.

Both pieces are recognisably Cascadia, and a reader can tell which is the founder and which is the brand without being told.

## Try it yourself

Three exercises, each takes 20 to 40 minutes.

### Exercise 1, run the diff on three pieces of each voice

Pull three founder pieces and three institutional pieces. Paste both into Claude with the Phase 1 diff prompt. Read the output. If the diagnosis is `faded_copy` or `generic_marketing`, your institutional voice needs Phase 3. If it is `credible_peer`, you can skip to the surface map.

### Exercise 2, map five surfaces

Pick the five surfaces that consume most of the brand's content effort. Assign each to founder, institutional or shared. Decide the review rule for each. If the founder currently reviews more than three of the five, the founder is bottlenecking.

### Exercise 3, draft the institutional POV

Run the Phase 3.2 prompt with your founder corpus and brand mission. Read the output. Are the four claims defensible as the brand, or do they read as founder opinions in third person? If they read as founder opinions, the POV is not yet institutional, sharpen the claims to ones the brand can defend through its actions rather than its founder's views.

## The eval gates

**Eval V1, voice-distinctness check.** Sample twenty published pieces quarterly and classify them by voice (founder or institutional) blind to byline. The brand's classification should agree with the rubric's voice score above 85% of the time. Below that, the voices are blurring.

**Eval V2, founder-attribution accuracy.** Anything published under the founder's name was written, edited or substantively approved by the founder. Audit annually by checking five random founder-bylined pieces against the founder's email or messaging archive for evidence of involvement. Zero ghost-writing tolerated.

**Eval V3, audience clarity.** Sample-test the audience. Give five readers two pieces, one of each voice, byline removed. Ask which they think is the founder. Aim for 80% accuracy. Below 60%, the institutional voice is not yet a credible peer.

**Eval V4, resilience to founder absence.** Hypothetical. If the founder stepped back for six months, what surfaces would break? If the answer is "most of them," the brand is over-dependent. The institutional voice needs strengthening.

## The failure modes

**Institutional voice as faded founder.** Marketing team writes "in the founder's voice" but is not the founder. Reads off, the audience cannot articulate why but they sense it. Build a distinct institutional voice with deliberate sentence-level distinctions.

**Founder ghost-written without involvement.** Marketing team writes content under the founder's name, the founder discovers it via a customer asking about a claim they "made", trust collapses. The contract clause 4 is the guard. Do not breach it.

**Over-dependence on founder.** Every piece of brand surface needs founder time. Founder bottlenecks the marketing function. The brand scales slower than it should. The surface-ownership map is the solution if the founder respects it.

**Voice succession not planned.** Founder steps back, leaves or sells the business. Institutional voice was never built. The brand reads as a different brand within a year. The institutional voice is the succession insurance, and it needs years of runway to harden.

**Both voices used on the same piece.** A blog post that opens in the founder's voice and shifts to institutional mid-way. Readers notice and the piece feels off. Pick one voice per piece, or split the piece into a founder essay plus an institutional product page.

## The pattern in practice

Illustrative scenarios that show common shapes the dual-voice discipline takes. Specifics are illustrative, patterns repeat.

**Premium cycling brand, scale-stage, the founder-time reclaim.** A founder-voice dependent brand. Extracting both voices, building the institutional profile and running the contract conversation typically reclaims a meaningful fraction of the founder's writing time within six months. Institutional output multiplies, and brand engagement holds because the new institutional voice is a credible peer rather than a faded copy. The founder reports less burnout, and the brand scales past the bottleneck.

**Trail-running brand, growth-stage, the de-ghosting.** A brand ghosting the founder's social. The voice audit makes this visible, the contract conversation makes it explicit. The founder takes over their own LinkedIn (with drafting help they can edit), and the institutional voice takes the brand-handled accounts. The distinct registers become part of the brand's positioning, both voices recognisable and neither pretending to be the other.

**Multi-sport brand, the discipline-needs-buy-in failure.** A founder resists the dual-voice framing ("the brand IS me"). The audit runs anyway, surfaces the over-dependence risk and frames the institutional voice as the brand's safety net. The founder declines to invest in it. When the founder eventually takes a medical absence or a long break, the brand's content output collapses during the gap. The framework can exist, but if the founder does not choose to build the redundancy, the framework cannot deploy.

## Hand-off

The dual-voice profile connects to:
- **brand-voice-extraction**, runs twice, once per voice
- **endurance-brand-voice**, layered on top of each voice with lexicon and credibility checks
- **message-house-generator**, the pillar drafting uses the institutional POV statement as input
- **tagline-system**, taglines filter against the institutional voice rubric, not the founder's
