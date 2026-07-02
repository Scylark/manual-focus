---
title: "Document drafting partner, outline to Google Doc with brand voice"
stack: productivity
description: "Outline becomes a brand-voice-loaded Google Doc or Word draft. Briefs, memos, proposals, board updates. First draft in twenty minutes."
outputs: "Drafting spec template, outline-to-doc prompt, voice consistency check, revision loop, eval rubric"
readMin: 13
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["docs", "inbox"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-08-31
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **drafting spec template** that captures the audience, the document type, the constraints and the brand voice in 90 seconds.
2. An **outline-to-doc prompt** that turns three bullet points into a 600 to 1500 word first draft in the operator's voice.
3. A **voice consistency check** that scores the draft against the voice profile and flags drift section by section.
4. A **revision loop** that turns operator notes into a sharper second draft without the operator having to rewrite the whole document.

## Who this is for

A marketing or GTM operator writing two or more long-form documents a week. Briefs, memos, board updates, proposal sections, internal explainers, blog drafts, partnership outlines. You have a recognisable voice (yours or your brand's) and the cost of a generic-AI-voiced document is real.

If you write one document a quarter, the manual approach is fine. If you write daily and the documents end up sounding identical, you have a voice problem this pipeline solves.

## Before you start

- [ ] A brand voice profile (from brand-voice-extraction). 2 to 3 paragraphs is the minimum
- [ ] Voice reference corpus, 5 to 10 of your recent documents at the right register
- [ ] Google Docs, Word or Notion access. The output format depends on where the document lands
- [ ] A model with structured output (Claude Opus 4.5 or GPT-5 default)
- [ ] 45 minutes blocked for setup

If you do not have a voice profile, run brand-voice-extraction first. A document drafted without a loaded voice is the generic-AI-voice output everyone immediately recognises and corrects by hand.

## The pipeline

Four phases. Phase 1 is the spec, Phases 2 through 4 are the draft and revision loop.

### Phase 1, drafting spec

Before any draft, the spec captures what you are writing and for whom.

**Step 1.1, the spec template.**

```text
# Drafting spec, {DOC_TITLE}

## What this document is
{ONE LINE, the kind of document, e.g. "internal memo to the
exec team on Q4 marketing plan"}

## Who reads it
{ONE LINE per primary audience}

## What it does
{ONE LINE on the action or decision it produces}

## What it is not
{ONE LINE on what it should not become, e.g. "not a status update,
not a justification deck"}

## Constraints
- Length: {WORD_COUNT_RANGE}
- Voice register: {FORMAL | NEUTRAL | LOOSER | INTERNAL_SLANG}
- Reading time: {N minutes}
- Format: {GOOGLE_DOC | WORD | NOTION | MARKDOWN}

## Outline
- {BULLET 1}
- {BULLET 2}
- {BULLET 3}

## Required elements
- {Any data points, quotes, named people, links that must appear}

## Forbidden elements
- {Anything the document should not include}
```

The spec takes 90 seconds to fill. Save as `drafting-spec.md` in the project folder.

**Step 1.2, the spec discipline.**

The most common failure is skipping the spec and going straight to "draft this". The draft that comes back is generic because the model has no audience or constraint. The 90 seconds on the spec pays back in 10 minutes of revision avoided.

### Phase 2, the draft

The spec plus the voice profile drives the draft prompt.

**Step 2.1, the draft prompt.**

```text
SYSTEM: You write a first-draft document from a structured spec
and an outline. You use the operator's brand voice loaded from
the voice profile and the reference corpus. You produce a draft
the operator can revise in 5 minutes or less. You do not over-
write the outline, every bullet in the outline becomes its own
section or paragraph.

USER:
Drafting spec:
{PASTE_SPEC}

Brand voice profile:
{PASTE_VOICE_PROFILE}

Voice reference corpus (5 to 10 of the operator's recent documents):
{PASTE_REFERENCE_CORPUS}

Outline:
{PASTE_OUTLINE}

Required elements:
{PASTE_REQUIRED}

Forbidden elements:
{PASTE_FORBIDDEN}

Return the draft as plain Markdown. The structure is:

# {DOC_TITLE}

## {SECTION 1 from outline}
{PARAGRAPH OR PARAGRAPHS, 100-300 words per section}

## {SECTION 2 from outline}
...

Rules:
- Word count is binding. Within 10 percent of the target range
  is acceptable.
- No em dashes. No prose colons or semicolons. No "not X, it's
  Y" binaries.
- No hype words (great, exciting, exceptional, world-class).
- No throat-clearing openings ("In this document we will explore...").
- Active voice unless the context demands otherwise.
- Use contractions if the voice profile does.
- Every required element appears verbatim or close to verbatim.
- No forbidden element appears.
- Sections track the outline 1:1. Do not reshape the outline.
- The closing paragraph names the action or decision the
  document is asking for, not a generic "in conclusion".
```

**Step 2.2, the read.**

The first read takes 3 to 5 minutes. The operator marks sections that drift from voice, miss the spec, or need a different angle. The marks become the revision input in Phase 4.

### Phase 3, voice consistency check

Before the operator revises, the system scores the draft.

**Step 3.1, the consistency prompt.**

```text
SYSTEM: You audit a draft document against the operator's voice
profile. You score the draft on five dimensions section by
section. You flag specific lines that drift from voice and you
recommend a fix for each.

USER:
Voice profile:
{PASTE_VOICE_PROFILE}

Draft document:
{PASTE_DRAFT}

Return JSON:
{
  "overall_voice_score": <0-10>,
  "section_scores": [
    {
      "section": "<heading>",
      "scores": {
        "register": <0-10>,
        "rhythm": <0-10>,
        "vocabulary": <0-10>,
        "structure": <0-10>,
        "specificity": <0-10>
      },
      "drift_flags": [
        {
          "line": "<verbatim>",
          "issue": "<one sentence on how it drifts>",
          "recommended_fix": "<rewritten line>"
        }
      ]
    }
  ],
  "global_flags": [
    "<one-sentence flags that span the whole draft (e.g. 'overuses passive voice', 'underuses contractions')>"
  ]
}

Rules:
- register: how well the document matches the formal-to-looser
  register the spec specified.
- rhythm: sentence-length variation, no AI-tell rhythm.
- vocabulary: choice of words consistent with the voice profile.
- structure: section flow, paragraph length, transitions.
- specificity: concrete claims vs vague generalities.
- drift_flags only for lines scoring below 6 on any dimension.
- recommended_fix is a verbatim rewrite, not a description.
```

**Step 3.2, the auto-fix.**

The operator can accept the recommended fixes section by section. The accepted fixes get applied to the draft automatically. The operator never has to rewrite by hand.

### Phase 4, revision loop

Operator notes drive the second draft.

**Step 4.1, the revision prompt.**

```text
SYSTEM: You revise a draft document based on the operator's
notes. You preserve everything the operator did not flag and
rewrite only what they did. You do not introduce new structure.

USER:
Original draft:
{PASTE_DRAFT_V1}

Operator's revision notes (free-form, inline or list):
{PASTE_NOTES}

Voice profile:
{PASTE_VOICE_PROFILE}

Required elements (still binding):
{PASTE_REQUIRED}

Return the revised draft as plain Markdown.

Rules:
- Sections not flagged in the notes stay verbatim.
- Sections flagged get the operator's requested change.
- The voice consistency rules from the original draft prompt
  still apply.
- The required elements still appear.
- Do not add new sections unless the notes explicitly ask for
  them.
- Do not delete sections unless the notes explicitly say to.
```

**Step 4.2, the third draft check.**

Run the consistency check (Phase 3) on the revised draft. If the overall voice score is 8 or above, ship. If under 8, revise the sections still flagged. The loop terminates within two revisions for 90 percent of documents.

## Worked example, end-to-end

Saoirse Burns needs to write a memo to the Cascadia exec team on the Vahla Storm Shell launch plan. Audience: Marcus (founder), Beth (brand lead), the CFO. Length target: 800 to 1100 words. Reading time: 5 minutes. Format: Notion page.

**Phase 1 output, the spec.**

```text
# Drafting spec, Vahla Storm Shell launch memo

## What this document is
Internal exec memo on the Vahla Storm Shell launch plan, asking
for budget sign-off and timeline confirmation.

## Who reads it
Marcus Hale (founder), Beth Lyons (brand lead), Tanya Okafor (CFO).

## What it does
Surfaces the launch plan, names the budget split, asks for
sign-off on the launch date and the budget shape.

## What it is not
Not a status update on launch progress. Not a celebration of
the product. Not a justification deck for the marketing team.

## Constraints
- Length: 800-1100 words
- Voice register: neutral, internal, sharp
- Reading time: 5 minutes
- Format: Notion page

## Outline
- The launch sits at September 22, three weeks before UTMB
- Budget at 62k against the 75k brief, two underspends explained
- The activation plan, UTMB plus paid social plus organic launch film
- The ask, sign-off on date plus budget by Friday
- The risk, weather affecting the activation, with contingency

## Required elements
- Specific budget numbers (62k, 75k, 13k headroom)
- UTMB activation reference
- Foundry agency film referenced as launch asset
- 22 September date

## Forbidden elements
- No marketing hype language
- No exclamation marks
- No "we are excited to share"
```

**Phase 2 output, draft v1 (excerpt).**

```text
# Vahla Storm Shell launch, budget and date sign-off

The Storm Shell launch lands on 22 September, three weeks
before UTMB. The shape is set. The two open decisions are the
final budget number and the activation level at UTMB itself.
This memo asks for sign-off on both by end of Friday.

## Budget shape

The launch sits at £62k against the £75k brief. Two underspends.
Photography landed £4k under because the second shoot ran with
the in-house team rather than the original day rate. Influencer
seeding landed £9k under because the ambassador programme picked
up two of the seeding slots without charge. The headroom is £13k.

My recommendation. £8k into a second paid social flight in the
launch window, £5k held as contingency for the UTMB activation
if the press list lands above target.

## Activation plan

Three legs.

The Foundry launch film ships on 22 September across paid social,
organic and the wholesale partner channels. The third cut is in
review now, lock by Tuesday.

UTMB activation runs Thursday through Saturday of race week. We
have three Cascadia athletes in the field plus the partnership
booth at the village. Saoirse is on the ground from Wednesday.
Marcus arrives Saturday.

The organic launch film holds for two weeks before the paid
flight starts. That gives the brand-side time to land before
the spend kicks in.

[continues]
```

**Phase 3 output, the consistency check.**

```json
{
  "overall_voice_score": 8.4,
  "section_scores": [
    {
      "section": "Budget shape",
      "scores": {"register": 9, "rhythm": 8, "vocabulary": 9, "structure": 9, "specificity": 10}
    },
    {
      "section": "Activation plan",
      "scores": {"register": 8, "rhythm": 7, "vocabulary": 8, "structure": 8, "specificity": 8},
      "drift_flags": [
        {
          "line": "Three legs.",
          "issue": "Too thin as a standalone line, reads choppy.",
          "recommended_fix": "The activation runs three legs in parallel."
        }
      ]
    }
  ],
  "global_flags": []
}
```

Saoirse accepts the one recommended fix. The draft now scores 8.6. She reads through once more, notes that the UTMB section needs a sentence on the weather contingency, and runs the revision prompt with that one note.

The revised draft incorporates the contingency. Total time from blank page to ready-to-send: 22 minutes. Marcus signs off Friday morning. Tanya approves the budget by EOD Friday. The launch ships on schedule.

## Try it yourself

Three exercises, each under 45 minutes.

### Exercise 1, fill the spec template for a document you would normally have written cold

Pick a document you wrote last week without a spec. Open the template. Fill it in retrospect. The exercise is whether the spec captures what the document needed. If yes, the spec template is calibrated. If you find yourself adding fields, customise the template for your context.

### Exercise 2, run the draft prompt on a real outline

Take a real outline, 3 to 5 bullets, plus your voice profile, plus 5 of your recent documents. Run the draft prompt. Read the output. Compare to what you would have written from the same outline cold. The first time through, expect the draft to be 70 percent there. After three iterations of voice-profile tuning, it goes to 90 percent.

### Exercise 3, run the consistency check on something you wrote without it

Paste a recent document into the consistency check. Read the section scores. Where the score is below 7, those are the sections that probably did not land with the reader. The exercise is calibrating the check against your gut sense of what worked.

## The eval gates

**Eval 1, time to ship.** From spec to final draft under 45 minutes for a 1000-word document. If it takes longer the bottleneck is usually the spec being skipped or the voice profile being too thin.

**Eval 2, revision count.** Most documents ship within two revision passes. Three or more means the outline was wrong, not the draft. Restart from the spec.

**Eval 3, voice score.** The consistency check scores 8 or above on the final draft. Below 8 the voice profile needs more reference material.

**Eval 4, required-element coverage.** Every required element from the spec appears in the final draft. Sample-check by listing them and ctrl-F'ing.

## The failure modes

**The spec gets skipped.** "Just draft this" leads to a generic draft that needs heavy rewriting. The 90 seconds on the spec is non-optional.

**The voice profile is the email voice when the document is long-form.** Email voice and document voice are different registers. Have separate voice profiles if the registers differ enough.

**The model expands beyond the outline.** A 5-bullet outline becomes a 10-section draft. The "sections track the outline 1:1" rule is load-bearing. Hold it.

**Required elements get paraphrased instead of named.** "We will be at UTMB" instead of "UTMB activation runs Thursday through Saturday". The verbatim-or-close-to-verbatim rule for required elements catches this.

**The closing is generic.** "In conclusion, this is an important launch" instead of "I'm asking for sign-off on the budget shape and the launch date by Friday EOD". The "name the action or decision" rule is load-bearing for memos and proposals.

## The pattern in practice

**Marketing lead at growth stage, the proposal turnaround.** A lead writing partnership proposals on a 2-day cycle. The pipeline drops that to 4 hours. The compounding value is that every proposal reads in the brand voice, even when written under time pressure.

**Founder-led brand at launch stage, the board update unlock.** A founder writing monthly board updates. The spec template makes the audience explicit (board members not marketing staff), the draft prompt produces output the board reads in 5 minutes. Board engagement on the update rises measurably.

**B2B GTM lead at scale, the memo discipline.** A GTM lead writing one or two memos a week to align internal teams. The pipeline makes the memos consistent in voice and shape across the team. Cross-functional teams start treating the memos as the canonical source of decision context.

## Hand-off

Once the drafting partner is wired in, the work feeds:
- **personal-knowledge-base**, where every shipped document becomes part of the searchable corpus
- **quarterly-okr-synthesis**, where team status reports drafted in the same voice synthesise more cleanly
- **call-follow-up-loop**, where longer follow-up notes use the drafting partner instead of the inline email prompt
- **brand-voice-extraction**, where the documents the operator ships become inputs to the next voice profile tuning
