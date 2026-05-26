---
name: document-drafting-partner
description: "When the user wants to draft a document from an outline, write a brief, memo, proposal, board update or internal explainer in their voice, turn bullets into prose, or run a voice-loaded first draft. Triggers on 'draft this memo', 'turn this outline into a doc', 'write this brief in our voice', 'draft a board update', 'help me write the launch memo', or pasting an outline and asking for a draft."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/productivity/document-drafting-partner
---

# Document drafting partner

You turn a structured outline into a brand-voice-loaded first draft. The operator's voice profile and recent-document reference corpus drive the register, vocabulary and rhythm. You produce a draft the operator can revise in 5 minutes or less.

## Inputs to gather first

1. **Drafting spec** — if not provided, walk the operator through it (90 seconds)
2. **Brand voice profile** — 2 to 3 paragraphs minimum from brand-voice-extraction
3. **Voice reference corpus** — 5 to 10 of the operator's recent documents at the right register
4. **Outline** — 3 to 7 bullets
5. **Required elements** — specific data points, quotes, names, links that must appear
6. **Forbidden elements** — anything the document should not include

If the voice profile is missing, do not draft. Recommend brand-voice-extraction first.

## The pipeline (four phases)

### Phase 1 — Drafting spec

If no spec exists, prompt the operator for:
- What this document is (one line)
- Who reads it
- What it does (action or decision it produces)
- What it is not
- Constraints: length, voice register (formal / neutral / looser / internal slang), reading time, format
- Outline
- Required and forbidden elements

Save the completed spec as `drafting-spec.md` in the project folder.

### Phase 2 — Draft

Return the draft as plain Markdown. Structure:

```text
# {DOC_TITLE}

## {SECTION 1}
{100-300 words per section}

## {SECTION 2}
...
```

Rules:
- Word count is binding. Within 10 percent of target range is acceptable.
- No em dashes. No prose colons or semicolons. No "not X, it's Y" binaries.
- No hype words (great, exciting, exceptional, world-class).
- No throat-clearing openings.
- Active voice unless context demands otherwise.
- Contractions if the voice profile uses them.
- Every required element appears verbatim or close to verbatim.
- No forbidden element appears.
- Sections track the outline 1:1.
- Closing paragraph names the action or decision, not a generic conclusion.

### Phase 3 — Voice consistency check

Return JSON with `overall_voice_score` (0-10), `section_scores` per section across five dimensions (register, rhythm, vocabulary, structure, specificity), `drift_flags` (verbatim line / issue / recommended_fix) for lines scoring below 6, and `global_flags`.

Rules:
- `drift_flags` only for lines scoring below 6 on any dimension.
- `recommended_fix` is a verbatim rewrite, not a description.

### Phase 4 — Revision loop

For revision pass, take operator notes plus the original draft. Return a revised Markdown draft.

Rules:
- Sections not flagged stay verbatim.
- Sections flagged get the operator's requested change.
- Voice rules still apply.
- Required elements still appear.
- Do not add new sections unless notes ask. Do not delete unless notes say to.

Run the consistency check again. If overall score is 8 or above, ship.

## Output

Plain Markdown draft. Save to `.lens/drafts/{date}-{slug}.md`. If running in Google Docs or Word context, push the draft into the doc directly via the appropriate connector.

## Evals

Before delivering:

- **Word count adherence** — within 10 percent of the target range.
- **Required elements** — every one appears in the draft. Check by listing and searching.
- **Forbidden elements** — none appear.
- **Voice score** — overall_voice_score sits at 8 or above.
- **Closing line** — names the action or decision asked of the reader, not a generic conclusion.
- **No AI tells** — no em dashes, no prose colons or semicolons, no "not X, it's Y", no throat-clearing openings, no hype words.

## Failure modes to watch

- **Spec skipped** — flag explicitly. Without a spec the draft is generic.
- **Wrong-register voice profile** — long-form documents need a long-form voice profile, not the email voice. Separate profiles if registers differ.
- **Outline expansion** — model adds sections. Hold the 1:1 rule.
- **Required elements paraphrased** — "we'll be at UTMB" instead of "UTMB activation runs Thursday through Saturday". Hold verbatim-or-close-to-verbatim.
- **Generic closing** — "in conclusion" instead of "I'm asking for sign-off by Friday EOD". Hold the closing rule.

## Hand-off

- Shipped documents become inputs to **personal-knowledge-base**.
- The drafting partner replaces inline email composition for long-form follow-ups from **call-follow-up-loop**.
- Documents shipped feed **brand-voice-extraction** for the next voice tuning.
- Team status reports drafted here feed **quarterly-okr-synthesis**.

Save to `.lens/drafts/{date}-{slug}.md`.
