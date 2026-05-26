---
title: "Earned-media pitch generator with journalist matching"
stack: content
description: "Match a story to the journalists who actually cover that beat, draft personalised pitches against their recent work, gate against the patterns editors hate."
outputs: "Targeted journalist list, drafted pitches, follow-up sequence"
readMin: 10
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["pr", "content"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-26
status: live
preview: false
---

## The brief

Spray-and-pray PR is dead and the death is overdue. Every business journalist has a public-facing complaint about it; the data shows pitch open-rates have halved since 2020. The teams that still get coverage do the work: they pitch the right journalist on the right beat at the right moment, with a story that respects the journalist's existing body of work.

This playbook does that work at scale. Given a story, the pipeline identifies the journalists most likely to cover it (based on their last 90 days of bylines), drafts a personalised pitch that references their actual recent work, gates the pitch against editor-hated patterns ("just wanted to circle back," embargo-as-coverage-bait, hyperbole), and sequences a tasteful 3-touch follow-up.

It does not turn a weak story into a strong one. A pipeline can't fix that. But for a story worth telling, it gets the story in front of the right journalists with a pitch they'll actually read.

## The pipeline

Five phases.

**Phase 1 — Story brief.** Structured intake: what's the news, what's the angle, who's the spokesperson, what's the data or proof, what's the embargo (if any), what's the broader theme this connects to. The pipeline rejects stories that are "we launched a thing" with no broader hook. A launch isn't a story; it's an announcement.

**Phase 2 — Journalist sourcing.** Pull a list of journalists who've written in the relevant theme area in the last 90 days. Sources: Muck Rack, Google News, the brand's own press-coverage tracker if it has one. The model expands by inferring related beats (a "future of work" journalist is also a candidate for a hiring-trends story, even if they haven't explicitly written about hiring in the window).

**Phase 3 — Story-to-journalist matching.** For each candidate journalist, the model reads the last 3-5 articles they've published in the relevant area. It scores them on: beat fit (how directly relevant), angle fit (do they take the kind of angle this story offers), recency (have they written about the brand or category in the last 14 days — if yes, deprioritise unless this is a follow-up), and tone fit (do they cover with the seriousness this story warrants).

**Phase 4 — Pitch drafting.** For each high-scoring match, draft a pitch that opens with a reference to the journalist's actual recent work — not a generic "Hi, I saw your piece on X." A specific reference to a point the journalist made, then the story being pitched in plain English, then the proof point that makes it credible, then the offer (interview, exclusive data, embargo).

**Phase 5 — Follow-up sequence.** Default sequence: pitch on day 0, follow up on day 4 with a single new piece of information (not a "checking in"), final touch on day 11 with a different angle on the same story. Anything beyond day 11 is harassment.

## The prompts

The pitch drafting prompt is where most teams' AI PR efforts go wrong. This is the version that works.

```text
SYSTEM: You draft cold email pitches to business journalists. You write
like someone who reads the journalist's work, not someone who copy-
pasted from a press kit. You open with a specific, recent reference to
the journalist's writing — never a generic "I saw your piece on X."
You name the actual point you found interesting. Your pitch is short.
The editor reads 100+ pitches a week.

You never:
- Use "I hope this finds you well"
- Use "just wanted to" or "I wanted to reach out"
- Start with "I'm reaching out about [thing]"
- Promise "exclusive" or "exciting" without naming the specific value
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
Recent article by them you should reference:
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

Draft the pitch. Email format. Subject line + body. Maximum 130 words
in the body. Return JSON:

{
  "subject": "<≤ 60 chars, specific not generic>",
  "body": "<the pitch>",
  "checks": {
    "opens_with_specific_reference": <true | false>,
    "states_story_in_one_sentence": <true | false>,
    "specific_offer_named": <true | false>,
    "word_count": <number>,
    "banned_phrases_present": <true | false>
  }
}
```

The follow-up prompts (day 4 "new info" and day 11 "different angle") and the journalist scoring rubric are shipped in the playbook download.

## The eval harness

The pipeline is gated against four failure modes.

**Eval 1 — Reference accuracy.** Sample 20 pitches and verify the opening reference. The journalist's name, the article cited, and the argument cited must all be correct. Acceptance: 100%. A single fabricated reference burns the journalist permanently and the brand close behind. Anything below 100% blocks the send.

**Eval 2 — Banned phrase check.** Run the banned-phrase list across every draft. Zero hits. Some models slip "circle back" or "I hope this finds you well" past the system prompt. The check is deterministic, runs at draft time, blocks the pitch from progressing if any are present.

**Eval 3 — Word count discipline.** Body ≤130 words. Subject ≤60 chars. Hard gate.

**Eval 4 — Spray check.** Across all pitches in a campaign, compute pairwise similarity. Any pair scoring above 0.85 similarity is failing the personalisation test. The pipeline forces regeneration with stronger journalist-specific framing.

## The failure modes

**The model invents the journalist's quote.** This is the most catastrophic and the most common failure. Always feed the model the actual article URL and verified key point. Never let it summarise from the headline alone. We've seen cases where the model "remembered" an article that didn't exist. Hard rule: every reference is fact-checked against a fetched source before send.

**Pitches arrive when the journalist isn't on the beat anymore.** Journalists move beats, outlets, and entire careers. The 90-day window helps but isn't perfect. The pipeline checks for "this journalist's last article in this beat was within 30 days" as a quality gate, and deprioritises beats older than that.

**The "story" isn't a story.** The pipeline tries to surface this in Phase 1 by asking for the broader theme connection, but determined brands will push launches through as stories. The pipeline then produces personalised pitches for a story that doesn't warrant pitching, and the brand burns its journalist relationships. Better to refuse to draft until the story passes a "would a journalist cover this without the brand's name on it" smell test.

**Embargo abuse.** Some teams use "I have an embargoed story" as a bait-and-switch when there's no actual exclusive. Journalists hate this and remember it. The pipeline allows the embargo flag, but if the same story has been offered as embargo to 10+ journalists, it's not an embargo, it's a release schedule. Flag and rewrite.

**Auto-follow-up over the journalist's "I'm not interested."** The follow-up sequence is suppressed if the journalist replies with anything that reads as a decline. The model classifies replies into accept / decline / out-of-office / question and routes accordingly. False positives on decline-detection are fine; false positives on "keep emailing them" are not.

## The pattern in practice

Illustrative scenarios — common shapes earned-media pipelines take. Specifics are illustrative; the patterns repeat.

**Health-tech, scale-stage — the agency-replacement.** A brand doing PR through an agency at a substantial monthly retainer with mediocre coverage. Running six stories through the pipeline over a quarter typically lands more coverage hits than the agency had produced in the prior year — including named outlets the agency hadn't placed in. Cost: an in-house PR lead's time plus the pipeline run-cost. Agency drops out, the in-house lead grows into the head of comms role.

**B2B SaaS, growth-stage — the no-agency tier.** A brand at the "we need PR but can't afford an agency" stage. Pipeline plus the brand's internal PR-comms lead replaces the agency tier. Substantial placements over six months, including tier-1 publications and a major podcast. The cost is the team member's time, not external retainers.

**Consumer goods — the weak-story failure.** A common failure mode: strong pitches against a weak story. The brand insists a routine product extension is newsworthy. Coverage rate runs well below what stronger stories produce. The pipeline performs exactly as designed; the input is the constraint. This is why the current pipeline includes a story-quality gate asking "would a journalist with no relationship to the brand find this newsworthy?" and pauses if the answer is no.
