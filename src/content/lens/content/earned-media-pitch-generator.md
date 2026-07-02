---
title: "Earned-media pitch generator with journalist matching"
stack: content
description: "Match a story to the journalists who actually cover that beat, draft personalised pitches against their recent work, gate against the patterns editors hate."
outputs: "Targeted journalist list, drafted pitches, follow-up sequence"
readMin: 18
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["pr", "content"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-26
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **structured story brief** that passes a quality gate before any pitch drafts, so the pipeline refuses to draft personalised pitches for stories that are not stories.
2. A **targeted journalist list** of 15 to 40 journalists matched against the story by recent beat coverage, angle fit, recency and tone, ranked by overall fit score.
3. **Personalised pitch drafts** for each high-scoring match, opening with a specific reference to the journalist's actual recent work, under 130 words in the body.
4. A **three-touch follow-up sequence** with day-4 new-information and day-11 different-angle drafts, suppressed automatically on a journalist's "not interested" reply.
5. A **pitch ledger** tracking sends, opens, replies, declines, coverage hits and the journalist relationships that build over time.

## Who this is for

A growth or scale-stage brand with a real story (not a routine product launch dressed as a story), an internal PR-comms lead who can hold a 60-minute brief intake, and a tolerance for the pipeline refusing to draft pitches when the story does not warrant pitching. If the brand wants to send 500 pitches a week to anyone with "journalist" in their LinkedIn title, this is the wrong playbook.

## Before you start

- [ ] A real story, not a routine product launch (the playbook tests this in Phase 1, so be ready for the gate to bite)
- [ ] Muck Rack, Cision or a similar journalist database, plus Google News for the public-search fallback
- [ ] Verified journalist contact data (work email, not personal). The brand owns the source-of-truth list.
- [ ] CMS or a project tool (Notion, Linear, Asana) to host the brief and the pitch ledger
- [ ] An email sender that supports per-recipient personalisation (Mailshake, Lemlist, native Gmail with merge if the volume is small)
- [ ] Voice profile from the brand-voice-extraction playbook, plus a "founder voice" sub-profile if the spokesperson is the founder
- [ ] Claude Opus 4.5 or GPT-5 with structured-output mode
- [ ] A spokesperson available for at least one interview slot per pitch

If the brand has no Muck Rack equivalent, the manual route via Google News and the journalist's outlet bio is workable for lists of under 40. Above that, the data quality drops below the pipeline's bar.

## The pipeline

Five phases. End-to-end in a working week for a single story, with the bulk of the work in journalist matching and pitch drafting.

### Phase 1, story brief

The pipeline refuses to draft without a story-quality gate.

**Step 1.1, populate the story brief.**

The brief carries.

- Headline (one sentence as a journalist would write it)
- Angle (the broader theme this story connects to)
- Spokesperson (name, title, why they are credible on this story)
- Proof (data, customer story, partnership, technical claim, with sources)
- Embargo (yes plus date plus jurisdictions, or no)
- Offer to the journalist (interview slot, exclusive data, embargoed preview, custom angle)
- Geography and audience scope

**Step 1.2, run the story-quality validator.**

```text
SYSTEM: You validate a story brief before the pitch pipeline drafts.
You refuse to proceed on stories that are routine product launches
without a broader theme connection. You return a pass-fail verdict
plus the specific gap if the story is weak.

USER:
Story brief: {STORY_BRIEF_JSON}

Return JSON:

{
  "verdict": "<pass | conditional | fail>",
  "checks": [
    {"id": "C1", "name": "broader theme connection", "result": "<pass | fail>", "rationale": "<one sentence>"},
    {"id": "C2", "name": "proof point is verifiable", "result": "<pass | fail>", "rationale": "<one sentence>"},
    {"id": "C3", "name": "would a journalist with no brand relationship find this newsworthy", "result": "<pass | fail>", "rationale": "<one sentence>"},
    {"id": "C4", "name": "spokesperson credibility", "result": "<pass | fail>", "rationale": "<one sentence>"}
  ],
  "missing_inputs": ["<what needs adding>"]
}

Rules:
- "fail" if C1 or C3 fails. Routine product launches with no theme
  connection do not proceed.
- "conditional" if 3 of 4 pass. Fix the gap and re-run.
- "pass" requires all four checks.
```

If the verdict is `fail`, stop. The pipeline will not draft personalised pitches for a story that is not a story. If the verdict is `conditional`, fix the gap and re-validate.

**You should now have** a validated story brief.

### Phase 2, journalist sourcing

Find the journalists who actually cover this beat.

**Step 2.1, pull the journalist universe.**

In Muck Rack, open **Search**. Filter by beat keywords matching the story's angle. Set publication date to the last 90 days. Export the list with name, outlet, beat, last article URL, last article date, contact email.

For brands without Muck Rack, the manual route is Google News searches on the story's angle keywords, recording each byline and verifying the outlet and contact via the journalist's outlet bio page.

**Step 2.2, expand the universe through adjacent beats.**

A "future of work" journalist is also a candidate for a hiring-trends story, even if they have not explicitly written about hiring in the window. Ask Claude to expand the universe.

```text
SYSTEM: You expand a journalist universe by inferring adjacent beats.
For a given story angle, you suggest related beats whose journalists
would also be plausible covers.

USER:
Story angle: {STORY_ANGLE}
Primary beat: {PRIMARY_BEAT}
Geography and audience: {GEOGRAPHY_AUDIENCE}

Return JSON:

{
  "primary_beat": "<verbatim>",
  "adjacent_beats": [
    {
      "beat": "<beat name>",
      "rationale": "<why this beat's journalists would cover this story>",
      "confidence": "<high | medium | low>"
    }
  ]
}

Rules:
- 3 to 6 adjacent beats.
- Beats with high confidence get full sourcing in Step 2.1.
- Beats with low confidence get a smaller sample.
```

Repeat Step 2.1 for the adjacent beats. The full universe lands at 60 to 200 candidate journalists.

You should now have a candidate journalist list with each row carrying name, outlet, beat, last article URL, date and contact.

### Phase 3, story-to-journalist matching

Score each candidate.

**Step 3.1, fetch the last three-to-five articles per candidate.**

For each candidate, open the journalist's outlet bio or Muck Rack profile. Fetch the URLs and headlines of the last three-to-five articles they published in the relevant beat. Save into the candidate list.

**Step 3.2, run the matching prompt.**

```text
SYSTEM: You score journalists for story fit. For each journalist, you
read the headlines and a summary of their last three-to-five articles
in the beat, then score on beat fit, angle fit, recency and tone.
You return one score per dimension plus a composite.

USER:
Story brief: {STORY_BRIEF_JSON}
Journalist candidates with recent article summaries:
{JOURNALIST_CANDIDATES_JSON}

For each candidate, return JSON:

[
  {
    "name": "<verbatim>",
    "outlet": "<verbatim>",
    "beat_fit_score": <0-10>,
    "angle_fit_score": <0-10>,
    "recency_score": <0-10>,
    "tone_fit_score": <0-10>,
    "composite_fit_score": <0-10>,
    "reference_article": {
      "title": "<which article to reference in the pitch>",
      "key_argument": "<the specific argument the pitch should reference>",
      "date": "<YYYY-MM-DD>"
    },
    "verdict": "<pitch | hold | skip>"
  }
]

Rules:
- "beat_fit_score" reflects whether the journalist's recent articles
  cluster around the story's beat.
- "angle_fit_score" reflects whether they take the kind of angle the
  story offers (analytical, narrative, contrarian, advocacy).
- "recency_score" rewards recent activity in the beat. Deprioritise
  beats older than 30 days.
- "tone_fit_score" rewards journalists who cover with the seriousness
  the story warrants.
- "verdict": "pitch" if composite >= 7, "hold" if 5 to 6.9, "skip"
  if under 5.
- If the journalist has covered the brand in the last 14 days, set
  verdict "hold" unless this is an explicit follow-up.
```

**Step 3.3, prune to the pitch list.**

Keep `pitch` verdicts. Sort by composite score. Cap at 30 to 40 for a high-volume story, 15 to 25 for a focused pitch. Above 40 the personalisation quality drops.

You should now have the targeted pitch list.

### Phase 4, pitch drafting

For each pitch-list journalist, a personalised pitch.

**Step 4.1, run the drafting prompt.**

```text
SYSTEM: You draft cold email pitches to business journalists. You
write like someone who reads the journalist's work, not someone who
copy-pasted from a press kit. You open with a specific, recent
reference to the journalist's writing. You never use a generic
"I saw your piece on X." You name the actual point you found
interesting. Your pitch is short. The editor reads 100+ pitches a
week.

You never:
- Use "I hope this finds you well"
- Use "just wanted to" or "I wanted to reach out"
- Start with "I'm reaching out about [thing]"
- Promise "exclusive" or "exciting" without naming specific value
- Use "circle back" or "touch base" or "synergy" or any word from
  the LinkedIn lexicon
- Send a press release as the pitch body
- Use the journalist's first name more than once

You always:
- Open with a sentence that proves you read the journalist's recent
  work, citing a specific argument they made
- State the story in one sentence near the top
- Name the proof point that makes the story credible
- Offer one specific thing (interview slot, data file, exclusive
  pre-embargo access) the journalist could say yes to today
- Sign off in fewer than 5 words

USER:
Journalist: {NAME}, {OUTLET}, beat: {BEAT}
Recent article by them to reference:
  Title: {ARTICLE_TITLE}
  Key argument they made: {ARTICLE_KEY_POINT}
  Published: {ARTICLE_DATE}

The story to pitch:
  Headline: {STORY_HEADLINE}
  Angle: {STORY_ANGLE}
  Proof: {STORY_PROOF}
  Spokesperson: {SPOKESPERSON_NAME_TITLE}
  Offer: {THE_OFFER}
  Embargo: {EMBARGO_OR_NONE}

Draft. Email format. Subject line plus body. Maximum 130 words in
the body. Return JSON:

{
  "subject": "<under 60 chars, specific not generic>",
  "body": "<the pitch>",
  "checks": {
    "opens_with_specific_reference": <true | false>,
    "states_story_in_one_sentence": <true | false>,
    "specific_offer_named": <true | false>,
    "word_count": <int>,
    "banned_phrases_present": <true | false>
  }
}
```

**Expect output like:**

> **Subject.** Your piece on regional ultras and the data behind the boom
>
> **Body.**
>
> Your piece on the regional-ultra boom last week landed the point most of the coverage misses, that the growth is in 50 to 80 km events with under 500 entrants, not in the marquee races. That is the gap our data fills.
>
> Cascadia Endurance ran a 412-runner Trail Club onboarding survey across 2025 and 2026. 64% of new ultra entrants picked a regional race for their first 50k or longer. The breakdown by region, by age and by previous distance experience runs about 1,800 rows and we are happy to share it under embargo.
>
> Spokesperson is Marcus Hale, our head coach, who has coached 28 finishers across the last two seasons at the events your piece focused on.
>
> Could send the dataset Friday with a 30-minute Marcus slot the week after.
>
> Best,
> Maya, Cascadia

**Step 4.2, run the spray check.**

Across all drafted pitches, compute pairwise textual similarity. Any pair scoring above 0.85 fails the personalisation test. The pipeline forces regeneration with sharper journalist-specific framing on the failing pair.

**Step 4.3, run the reference-accuracy check.**

For each pitch, verify the journalist's name, the article cited and the argument cited against the actual source. Hallucinated references are the most catastrophic failure mode. Hard gate, 100% accuracy or the pitch does not send.

You should now have personalised pitches that pass the spray and reference checks.

### Phase 5, send, follow-up and ledger

The pipeline sends in waves and tracks responses.

**Step 5.1, send wave one (day 0).**

Stagger sends across the morning of the journalists' local timezones. Mailshake and Lemlist support this natively. Manual sends work for lists under 25.

**Step 5.2, day 4 follow-up with new information.**

```text
SYSTEM: You draft a single follow-up email for a journalist who did
not respond to the initial pitch. The follow-up adds one new piece
of information, never a "checking in" or "just bumping this up."

USER:
Original pitch: {ORIGINAL_PITCH_JSON}
New information available: {NEW_INFO}

Draft the follow-up. Maximum 70 words. Return JSON:

{
  "subject": "<RE the original subject>",
  "body": "<the follow-up>"
}

Rules:
- No "circling back," no "wanted to bump this up."
- The new information is the only reason for the email.
- Reference one sentence from the original pitch for context.
- Specific, brief, under 70 words.
```

**Step 5.3, day 11 different-angle touch.**

```text
SYSTEM: You draft the third and final touch for a journalist who did
not respond to the pitch or the follow-up. This email offers a
different angle on the same story.

USER:
Original pitch: {ORIGINAL_PITCH_JSON}
Alternative angle: {ALTERNATIVE_ANGLE}

Draft the final touch. Maximum 80 words. Return JSON:

{
  "subject": "<different from prior subjects>",
  "body": "<the different-angle pitch>"
}

Rules:
- The alternative angle is real, not a reworded version of the
  original.
- This is the last touch. Do not promise further follow-up.
```

**Step 5.4, suppress follow-ups on decline.**

A reply classifier runs on inbound emails. Replies classified as decline, out-of-office or question route accordingly. False positives on decline-detection are fine. False positives on "keep emailing them" are not.

```text
SYSTEM: You classify journalist replies to a pitch. You return one
of four classifications.

USER:
Reply text: {REPLY_TEXT}

Return JSON:

{
  "classification": "<accept | decline | out_of_office | question>",
  "confidence": "<high | medium | low>",
  "suggested_action": "<send dataset | suppress sequence | wait until X | answer question>"
}

Rules:
- If the journalist's reply reads as anything that could be a
  decline, suppress the sequence. Better to lose a maybe than to
  harass a no.
- "out_of_office" routes to a calendar entry for the return date.
- "question" routes to the PR lead for a manual reply.
```

**Step 5.5, log to the ledger.**

Every send, open, reply, coverage hit logs. The ledger feeds the quarterly retrospective.

You should now have the pitch wave running and the follow-up sequence running with decline-detection.

## Worked example, end-to-end

Cascadia Endurance ran the pipeline for a story on the regional-ultra boom in the UK and Europe. The brand had run a Trail Club onboarding survey of 412 new ultra entrants and the dataset showed a clear regional-vs-major shift that the trade press had not yet quantified.

**Phase 1 output.** Brief validated. Headline "The regional-ultra boom is the real story, not UTMB." Spokesperson Marcus Hale. Proof the 412-runner survey plus Marcus's coaching record at the events. Offer the dataset under embargo plus a 30-minute Marcus interview. Verdict pass.

**Phase 2 output.** Muck Rack returned 73 journalists in the primary beat (UK and European trail and ultra). Adjacent beats expanded the universe by 41 more in adjacent areas (endurance lifestyle journalism, regional outdoor coverage, women's running coverage). Universe of 114 candidates.

**Phase 3 output.** Matching ran on the 114. 26 came back `pitch` verdict with composite score 7 or higher. The top three.

| Name | Outlet | Beat | Composite | Reference article |
|---|---|---|---|---|
| Jenny Holloway | Trail Runner UK | UK and EU trail | 9.2 | "Where the runners are actually going now" |
| Dimitri Brennan | Outside | endurance lifestyle | 8.6 | "The post-UTMB ultra year" |
| Aoife Sheridan | The Irish Times | health and outdoor | 8.1 | "Why the marathon is not the goal any more" |

**Phase 4 output.** 26 pitches drafted. Spray check passed (maximum pairwise similarity 0.62). Reference-accuracy check passed on all 26. Sample for Jenny Holloway shown in Phase 4's Expect Output block.

**Phase 5 output.** Wave one sent Tuesday morning across UK and IE timezones. By Friday, four journalists had requested the dataset, two had booked the Marcus interview slot, one had filed a decline ("not my beat right now"), and 19 had not yet responded. Day-4 follow-ups went to the 19. Three more journalists responded after the follow-up. Day-11 different-angle touch went to the remaining 16. Two more responded.

Coverage landed in Trail Runner UK as a feature piece anchoring the dataset, in Outside as a section in their weekly endurance roundup, in The Irish Times as a 600-word piece with Marcus quoted, and in two smaller regional outlets that picked up the day-11 touch.

A quarter later, the same Trail Club survey dataset has appeared in two more pieces from journalists who picked it up months after the initial campaign. The ledger records nine coverage hits total against 26 sends, which sits at the high end of the ratio band Cascadia tracks.

## Try it yourself

Three exercises, each takes 30 to 60 minutes.

### Exercise 1, validate one of your past stories

Take a story your brand pitched in the last six months. Run the Phase 1 validator on it. If the validator fails it, you now have an honest read on why coverage was thin. If the validator passes it, compare what the pipeline would have surfaced against what you actually pitched.

### Exercise 2, source a journalist list manually for one beat

Pick a beat that fits your brand. Spend 30 minutes in Google News finding 10 journalists who have written in that beat in the last 30 days. Record name, outlet, last article URL, date. The exercise teaches you how much faster Muck Rack or Cision is for the same work and where the manual route fits.

### Exercise 3, draft a single pitch with the prompt

Take a story your brand has. Pick one journalist who has written in your beat. Find their last article and identify the key argument. Run the Phase 4 prompt with all the real inputs. Read the draft. Does the opener cite a specific argument or does it generalise? If it generalises, the article-key-point input is too thin, find a sharper one.

## The eval gates

**Eval 1, reference accuracy.** Sample 20 pitches and verify the opening reference. The journalist's name, the article cited and the argument cited must all be correct. Acceptance is 100%. A single fabricated reference burns the journalist permanently and the brand close behind.

**Eval 2, banned phrase check.** Run the banned-phrase list across every draft. Zero hits. Some models slip "circle back" or "I hope this finds you well" past the system prompt. The check is deterministic, runs at draft time and blocks any failing pitch.

**Eval 3, word count discipline.** Body under 130 words. Subject under 60 characters. Hard gate.

**Eval 4, spray check.** Across all pitches in a campaign, pairwise textual similarity stays below 0.85 on every pair. Higher means the personalisation is cosmetic.

**Eval 5, decline-detection precision.** False positives on decline-detection (suppressing a sequence when the journalist had not declined) are acceptable. False positives on "keep emailing them" are not. Audit monthly.

## The failure modes

**The model invents the journalist's quote.** The most catastrophic and the most common failure. Always feed the model the actual article URL and a verified key point. Never let it summarise from the headline alone. There have been cases where the model "remembered" an article that did not exist. Hard rule, every reference fact-checked against a fetched source before send.

**Pitches arrive when the journalist is not on the beat anymore.** Journalists move beats, outlets and careers. The 90-day window helps but is not perfect. The pipeline checks for "this journalist's last article in this beat was within 30 days" as a quality gate and deprioritises beats older than that.

**The story is not a story.** The pipeline tries to surface this in Phase 1 by demanding the broader theme connection, but determined brands push launches through as stories. The pipeline then produces personalised pitches for a non-story and the brand burns its journalist relationships. Refuse to draft until the story passes the "would a journalist with no relationship to the brand cover this" smell test.

**Embargo abuse.** Some teams use "I have an embargoed story" as bait-and-switch when there is no actual exclusive. Journalists hate this and remember it. The pipeline allows the embargo flag, but if the same story has been offered as embargo to 10+ journalists, it is a release schedule, not an embargo. Flag and rewrite.

**Auto-follow-up over the journalist's "not interested."** The follow-up sequence suppresses on any reply that reads as decline. False positives on decline-detection are fine, false positives on "keep emailing them" are not.

## The pattern in practice

Illustrative scenarios that show common shapes earned-media pipelines take. Specifics are illustrative, patterns repeat.

**Health-tech, scale-stage, the agency-replacement.** A brand doing PR through an agency at a substantial monthly retainer with mediocre coverage. Running six stories through the pipeline over a quarter typically lands more coverage hits than the agency produced in the prior year, including named outlets the agency had not placed in. Cost is an in-house PR lead's time plus the pipeline run-cost. The agency drops out and the in-house lead grows into the head-of-comms role.

**B2B SaaS, growth-stage, the no-agency tier.** A brand at the "we need PR but cannot afford an agency" stage. Pipeline plus the brand's internal PR-comms lead replaces the agency tier. Substantial placements over six months, including tier-1 publications and a major podcast. Cost is the team member's time, not external retainers.

**Consumer goods, the weak-story failure.** A common failure mode is strong pitches against a weak story. The brand insists a routine product extension is newsworthy. Coverage rate runs well below what stronger stories produce. The pipeline performs exactly as designed and the input is the constraint. This is why the current pipeline includes the story-quality gate.

## Hand-off

The pitch generator feeds:
- **race-result-content-engine**, race recaps that surface a genuine story angle become pitch source material
- **ai-studio-news-pipeline**, brand POV on AI releases sometimes becomes pitch material to tech press
- **lifecycle-journey-builder**, coverage hits feed re-engagement sequences for existing subscribers
- **eval-gated-drafting**, the story brief feeds a long-form blog version of the same story
