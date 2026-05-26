---
name: endurance-brand-voice
description: "When the user is an endurance, cycling, running, swimming, triathlon, mountaineering or other endurance-sport brand wanting to extract their voice. Triggers on 'we're a cycling brand, extract our voice', 'endurance brand voice profile', 'why does our content sound like a generic sports brand', 'how do we sound credible to runners'."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/brand/endurance-brand-voice
---

# Endurance brand voice

You extract a voice profile for an endurance-sport brand with the
specific lexical patterns and credibility markers that distinguish
genuine endurance writing from generic sports-lifestyle marketing.

This is an extension of the brand-voice-extraction skill. Run the
standard extraction first, then this extension. The result is a
voice profile that captures the structural patterns (sentence
length, cadence, openers) plus the endurance-specific lexicon and
credibility tells.

## Inputs to gather first

Beyond the standard brand-voice inputs:

1. **Sport(s) the brand serves** — cycling road / gravel / mountain,
   running road / trail / track, swimming, triathlon, mountaineering,
   skiing, climbing, multi-sport. Sub-profiles per sport if the
   brand spans multiple.
2. **Category context corpus** — 8–12 pieces from credible
   endurance writing the brand sees as exemplary canon (race reports
   from respected publications, training journals from credible
   athletes, equipment essays from publishers with category trust).
   These anchor the credibility calibration.
3. **Audience tier** — what level does the brand's actual customer
   race at? Elite (1% of audience), competitive (top 25% of finishers
   at amateur races), participation-focused (general field). Voice
   should match the customer, not the most extreme tier.

## The pipeline

Run after the standard `brand-voice-extraction` skill produces
`.lens/voice-profile.json`. This skill extends that file with
endurance-specific fields.

### Phase 1 — Endurance lexicon extraction

```text
SYSTEM: You analyse endurance-sport brand writing for category-
specific language patterns. You distinguish credible endurance voice
(writing by people who have done the work) from generic sports-
lifestyle voice (writing about people doing the work). You return
verbatim phrases from the corpus. You do not invent.

USER:
Brand corpus: {BRAND_CORPUS}
Category context corpus: {CATEGORY_CONTEXT_CORPUS}
Sport(s): {SPORTS_LIST}

Extract for the brand, per sport if multi-discipline:

{
  "terrain_and_conditions": [
    {"phrase": "<verbatim>", "frequency": "<common|occasional|rare>"}
  ],
  "time_of_day_patterns": [...],
  "distance_duration_framing": [...],
  "discomfort_vocabulary": [
    {
      "phrase": "<verbatim>",
      "frequency": "<common|occasional|rare>",
      "tone": "<honest|euphemistic|absent>"
    }
  ],
  "quietness_signals": [
    {"phrase": "<verbatim>", "context": "<one sentence>"}
  ],
  "category_credibility_score": <0-10>,
  "category_credibility_evidence": [
    "<observable patterns supporting the score, verbatim>"
  ]
}

Calibration:
- Compare brand corpus phrases against category context phrases.
- "Common" means in 30%+ of brand pieces.
- "Honest" tone uses discomfort vocabulary directly; "euphemistic"
  softens or motivational-isms over it; "absent" means the brand
  doesn't reference discomfort.
- Credibility 10 = indistinguishable from canon, 5 = competent but
  generic, 0 = clearly outside-looking-in.

Rules:
- Verbatim only.
- Empty fields where the corpus genuinely lacks them.
- Evidence must point to observable patterns, not impressions.
```

### Phase 2 — Inauthenticity tells

Generate the endurance-specific "never does" list:

- Hyperbolic outcome framing ("crush your goals", "unleash your
  potential")
- Generic motivational closers ("you've got this", "earn the day")
- Mis-used technical terms (5k called a "marathon", aerobic ride
  called "intense")
- Comparison of recreational athletes to elite times
- Gear or technique references the brand can't credibly speak to

### Phase 3 — Channel-mapped prompt extension

Extend the prompt library with endurance-aware versions of the
recurring outputs. Examples:

- **Race-week email subject** — includes the specific race name and
  one tactical observation, never generic "Good luck this weekend!"
- **Long-form blog opener** — uses the brand's typical opener pattern
  plus an endurance-specific anchoring detail (terrain, weather,
  time-of-day)
- **Athlete-introduction social post** — names the athlete's actual
  race results, names the courses, doesn't inflate

## The eval harness

Standard voice rubric plus three endurance-specific gates:

**Endurance E1 — Credibility floor.** Drafts score against the
category-credibility rubric (terrain accuracy, duration plausibility,
discomfort-vocabulary tone match, gear-reference accuracy). Below
3/4 = doesn't ship.

**Endurance E2 — Hyperbole regex.** Hard block on the inauthenticity
phrases list. Auto-suggest a verbatim replacement from the brand's
actual canon.

**Endurance E3 — Quietness presence.** Across a campaign or month,
≥20% of pieces include a quietness signal (training alone, the
early start, the unwitnessed PR, the work no-one sees). Endurance
brands that only celebrate the win sound shallow.

## Failure modes to watch

- **Category context corpus dilutes the brand voice.** If brand
  outputs start sounding like generic race-report writing, the
  category corpus is over-weighted — reduce its share.
- **Founders who don't ride / run / swim** — the pipeline can produce
  passing copy but the founders will eventually be exposed. Push
  back. Recommend they do the work.
- **Over-claiming on a single founder's credibility** — separate the
  "founder voice" from the "brand institutional voice." Different
  pieces use different ones.
- **Wrong sport's vocabulary** — cycling-language has poor overlap
  with running-language. Multi-discipline brands need sub-profiles
  per sport.
- **Performative struggle** — if the brand's actual customers are
  recreational 5k runners, don't write like the brand serves
  Ironman finishers. Match the voice to the audience's actual practice.

## Capability boundary

Reliable: lexical pattern extraction, structural analysis, drafting
against the extended profile.

Unreliable: distinguishing genuine endurance voice from confidently-
written tourist voice without anchor examples. The category context
corpus is the anchor. Don't run this skill without it.

The pipeline does not give the brand credibility it hasn't earned.
A founder who hasn't trained will eventually be exposed regardless of
how voice-correct the copy is. See the
[capabilities reference](https://manual-focus.co.uk/lens/capabilities)
for the wider context.

## Hand-off

Extended voice profile feeds all downstream drafting skills (eval-
gated-drafting, social-content-factory, lifecycle-journey-builder,
earned-media-pitch, race-result-content-engine). They all read
`.lens/voice-profile.json` for the structural pattern and
`.lens/endurance-voice-extension.json` for the lexicon.
