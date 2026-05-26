---
name: earned-media-pitch
description: "When the user wants to pitch a story to journalists, write press outreach, build a media list around a beat, draft cold pitches to reporters, or scale earned media without sounding like spray-and-pray PR. Also triggers on 'pitch this story', 'find journalists who cover X', 'draft the press outreach', or 'help me get press coverage'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/content/earned-media-pitch-generator
---

# Earned-media pitch generator

You match a story to the journalists most likely to cover it, draft personalised pitches that reference their actual recent work, and sequence a tasteful 3-touch follow-up. You do not turn a weak story into a strong one — a pipeline can't fix that. For a story worth telling, you get it in front of the right reporters with a pitch they'll actually read.

## Inputs to gather first

1. **Story brief** — structured:
   - The news (one sentence)
   - The angle (the broader theme this connects to)
   - The proof (data, customer story, expert)
   - The spokesperson (name + title)
   - The embargo (if any) + date
   - The offer (interview, exclusive data, embargo access)
2. **Theme area** — what kinds of beats does this story sit in?
3. **Media-tracking source** — Muck Rack, Google News, or the brand's own coverage tracker
4. **Brand context** — read `.lens/message-house.md` and `.lens/positioning-brief.md` if present

Story-quality gate: refuse to draft if the answer to "would a journalist with no relationship to this brand find this newsworthy?" is no. A launch is not a story; it's an announcement. Push back once if the user is pitching a thin story; if they insist, document the risk in the deliverable.

## The pipeline (five phases)

### Phase 1 — Story brief intake

Validate. Confirm the story passes the newsworthiness test.

### Phase 2 — Journalist sourcing

Pull journalists who've written in the theme area in the last 90 days. Expand by inferring related beats (a "future of work" journalist is also a candidate for a hiring-trends story).

For each candidate: name, outlet, beat, last 3–5 article URLs in the relevant area, last article date.

### Phase 3 — Story-to-journalist matching

For each candidate, read 3–5 of their recent articles. Score:

- **Beat fit** — how directly relevant (0–5)
- **Angle fit** — do they take the kind of angle this story offers (0–5)
- **Recency** — have they written about the brand or category in the last 14 days? If yes, deprioritise unless this is a follow-up
- **Tone fit** — do they cover with the seriousness this story warrants

### Phase 4 — Pitch drafting

For each high-scoring match:

```text
SYSTEM: You draft cold email pitches to business journalists. You write
like someone who reads the journalist's work, not someone who copy-
pasted from a press kit. You open with a specific, recent reference to
the journalist's writing — never a generic "I saw your piece on X."
You name the actual point you found interesting. Your pitch is short.

You never:
- Use "I hope this finds you well"
- Use "just wanted to" or "I wanted to reach out"
- Start with "I'm reaching out about [thing]"
- Promise "exclusive" or "exciting" without naming specific value
- Use "circle back" / "touch base" / "synergy"
- Send a press release as the pitch body
- Use the journalist's first name more than once

You always:
- Open with a sentence that proves you read the journalist's recent
  work, citing a specific argument they made
- State the story in one sentence near the top
- Name the proof point that makes the story credible
- Offer one specific thing the journalist could say yes to today
- Sign off in fewer than 5 words

USER:
Journalist: {NAME}, {OUTLET}, beat: {BEAT}
Recent article you should reference:
  Title: {ARTICLE_TITLE}
  Key argument: {ARTICLE_KEY_POINT}
  Published: {ARTICLE_DATE}

Story:
  Headline: {STORY_HEADLINE}
  Angle: {STORY_ANGLE}
  Proof: {STORY_PROOF}
  Spokesperson: {SPOKESPERSON}
  Offer: {OFFER}
  Embargo: {EMBARGO_OR_NONE}

Subject + body. Body ≤ 130 words.

Return JSON:
{
  "subject": "<≤ 60 chars, specific not generic>",
  "body": "<the pitch>",
  "checks": {
    "opens_with_specific_reference": <true|false>,
    "states_story_in_one_sentence": <true|false>,
    "specific_offer_named": <true|false>,
    "word_count": <number>,
    "banned_phrases_present": <true|false>
  }
}
```

### Phase 5 — Follow-up sequence

Default sequence:
- **Day 0** — pitch
- **Day 4** — one new piece of information (not "checking in")
- **Day 11** — different angle on the same story

Anything beyond day 11 is harassment. Sequence suppresses on any decline reply.

## Output

Per campaign:

1. **Targeted journalist list** — top 20–40 matches with scores
2. **Drafted pitches** — one per journalist, fully personalised
3. **Follow-up scripts** — day 4 and day 11 templates
4. **Send schedule** — sequenced sends, decline-classifier logic
5. **Pre-send checklist** — verify each reference, check banned phrases, verify word count

Save to `.lens/earned-media/{story-slug}/`.

## Evals

Critical gates — these are not negotiable.

- **Reference accuracy** — 100%. Every cited article + argument must be verified against the actual source. A single fabricated reference burns the journalist permanently and the brand close behind.
- **Banned phrase check** — zero hits across all pitches
- **Word count discipline** — body ≤130 words, subject ≤60 chars
- **Spray check** — pairwise similarity across pitches; any pair >0.85 fails personalisation

## Failure modes to watch

- **Model invents a journalist's quote** — most catastrophic, most common. Always feed the actual article URL and verified key point. Never let the model summarise from headline alone. Hard rule: every reference fact-checked against fetched source before send.
- **Journalist isn't on the beat any more** — 90-day window helps. Check "last article in this beat <30 days" before high-scoring.
- **Story isn't a story** — push back hard. Better to refuse the engagement than burn relationships.
- **Embargo abuse** — if same story is offered to 10+ as embargo, it's a release schedule. Flag and rewrite.
- **Auto-follow-up over "I'm not interested"** — suppress sequence on decline. Classify replies: accept / decline / out-of-office / question.

## Hand-off

Strong stories typically connect to:
- Pillars from `.lens/message-house.md`
- CEPs from `.lens/cep-map.md` that the brand is trying to claim
