---
title: "Personal knowledge base, Notion and Obsidian with Claude as the search layer"
stack: productivity
description: "Notion and Obsidian wired up with Claude as the search and synthesis layer. Your brain at scale, not just your notes."
outputs: "Knowledge base spec, ingestion pipeline, retrieval prompt set, weekly hygiene routine, eval rubric"
readMin: 23
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["docs", "meetings", "inbox", "tasks"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-09-10
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **knowledge base spec** that names the sources, the entity structure and the retrieval modes you actually need.
2. An **ingestion pipeline** that pulls meeting notes, briefs, decisions and shipped documents from Notion, Obsidian, Google Docs and Slack into a unified searchable corpus.
3. A **retrieval prompt set** with four shapes (factual lookup, decision history, person history, project history) so you ask the right question and get the right answer.
4. A **weekly hygiene routine** that keeps the corpus current and trims duplicates, so the search layer does not slowly degrade.

## Who this is for

A marketing or GTM operator with two or more years of accumulated notes, meeting summaries, briefs and decisions scattered across Notion, Obsidian, Google Drive, Slack archives and email. You search for "what did we decide about X" several times a week and lose 5 to 15 minutes each time. You have a Notion workspace or an Obsidian vault as the primary surface, with Google Docs and Slack as supplementary sources.

If your notes live in a single Notion database with consistent tagging, you may not need this. If they sprawl across four tools with inconsistent schemas, the pipeline is the difference between "I know I wrote that down somewhere" and "here is what we decided in March 2025".

## Before you start

- [ ] Notion API token with read access to the workspace, plus optionally write access for the index page
- [ ] Obsidian vault path (if you use Obsidian). The pipeline reads Markdown files directly
- [ ] Google Drive access with read scope on Docs (optional, recommended)
- [ ] Slack export or live token (optional, for indexing decision threads)
- [ ] Claude with file-attach or MCP access to the source directories
- [ ] Two hours blocked for the setup pass
- [ ] An ongoing 10-minute weekly slot for the hygiene routine

If you have no consistent note-taking habit, fix that first. The personal-knowledge-base playbook is a search layer over notes that exist. If the notes do not exist, the layer has nothing to find.

## The pipeline

Four phases. Phase 1 is the spec. Phase 2 is the one-time ingestion. Phases 3 and 4 are the daily-use shapes and the weekly hygiene.

### Phase 1, knowledge base spec

The spec answers four questions.

**Step 1.1, what is the corpus.**

The corpus has four entity types by default.

| Entity | Source | Update cadence |
|---|---|---|
| Meetings | Granola, Fireflies, meeting prep packs, meeting records from call-follow-up-loop | Daily |
| Decisions | Briefs, memos, board updates, status reports | Weekly |
| People | Attendee enrichment, CRM contacts, LinkedIn pulls, recurring meeting attendees | On change |
| Projects | Notion projects, briefs, OKRs, launch plans | Weekly |

Each entity type has a different shape and different retrieval mode.

**Step 1.2, the retrieval modes.**

Four shapes of question, four prompts. Most operator queries fall into one.

| Mode | Question shape | Example |
|---|---|---|
| Factual lookup | What is X? | "What is the Vahla launch budget?" |
| Decision history | What did we decide about X? | "What did we agree with Trail Club in September?" |
| Person history | What do I know about X? | "Who is Tom Vetter and what have we discussed?" |
| Project history | How did X go? | "How did the spring shoe push perform?" |

**Step 1.3, the priority sources.**

Not every source is equal. The spec names priority order. The default:

1. Meeting records (highest signal, dated, attributed)
2. Briefs and memos (decisions and reasoning captured)
3. CRM activity logs (deal state and history)
4. Slack threads with decisions (lower signal, harder to attribute)
5. Email threads (lowest signal, often duplicated by meetings)

Save as `knowledge-base-spec.md`.

### Phase 2, the ingestion pipeline

The corpus has to be in a shape Claude can read fast. There are three patterns.

**Step 2.1, the Notion-as-canonical pattern.**

Notion is the primary surface. The pipeline writes to a Notion database called `Knowledge Base`. Every meeting record, every brief, every decision lands as a page with consistent properties.

Properties on every page:

| Property | Type | Notes |
|---|---|---|
| Title | Title | Verbatim |
| Date | Date | When the artefact was created |
| Type | Select | Meeting / Brief / Memo / Decision / Project / Person |
| People | Multi-select | Linked to the People database |
| Projects | Multi-select | Linked to the Projects database |
| Tags | Multi-select | Free-form |
| Source | URL | Link to original (Granola, Google Doc, Slack thread) |

Claude reads from Notion through the Notion MCP. The MCP returns structured pages, which the retrieval prompts then synthesise.

**Step 2.2, the Obsidian-as-canonical pattern.**

Obsidian is the primary surface. The pipeline writes Markdown files to a vault folder structure:

```text
/01_meetings/{date}-{slug}.md
/02_briefs/{date}-{slug}.md
/03_decisions/{date}-{slug}.md
/04_people/{slug}.md
/05_projects/{slug}.md
```

Every file has YAML frontmatter:

```yaml
---
title: <title>
date: <YYYY-MM-DD>
type: <meeting | brief | decision | person | project>
people: [<list>]
projects: [<list>]
tags: [<list>]
source: <url>
---
```

Claude reads the vault through file-attach or the filesystem MCP. The retrieval prompts treat the vault as a corpus.

**Step 2.3, the hybrid pattern.**

Notion plus Obsidian, with a shared index file. The index lives at `.lens/knowledge-base-index.md` and lists every entity with its source, last-updated date and Notion or Obsidian path. The pipeline updates the index nightly.

Claude reads the index first for routing, then fetches the source. Slower but workable for mixed surfaces.

**Step 2.4, the backfill.**

The first ingestion is the slowest part. Two to four hours depending on corpus size. Three sub-steps:

1. Export everything from the legacy surfaces.
2. Run the normalisation prompt on every artefact to add YAML frontmatter or Notion properties.
3. Validate the entity links (every Meeting record links to People and Projects).

Schedule the backfill for a Saturday afternoon. Set a 4-hour timer. If the corpus is bigger than fits in 4 hours, ingest the last 12 months first, the rest in a second pass.

### Phase 3, retrieval prompts

Four prompts, one per retrieval mode.

**Step 3.1, factual lookup.**

```text
SYSTEM: You answer a factual question from the operator's
knowledge base. You return the answer plus the source artefact
that contains it. You do not invent facts. If the corpus does
not contain the answer, you say so.

USER:
Question:
{QUESTION}

Knowledge base corpus (paste or MCP-attach):
{PASTE_CORPUS_OR_MCP}

Return JSON:
{
  "answer": "<the answer in one to three sentences, or 'corpus does not contain'>",
  "confidence": "<high | medium | low>",
  "sources": [
    {"title": "<artefact title>", "date": "<YYYY-MM-DD>", "type": "<meeting | brief | etc>", "quote": "<verbatim quote from the source>"}
  ],
  "additional_context": "<one sentence if the answer comes with caveats, or null>"
}

Rules:
- Every claim must trace to a source quote.
- "high" confidence requires 1+ verbatim source quote.
- "low" confidence flags the answer as unsupported by direct
  evidence even if the corpus implies it.
- Return JSON only.
```

**Step 3.2, decision history.**

```text
SYSTEM: You answer "what did we decide about X" from the
knowledge base. You return the decision chronologically, with
the date, the attendees and the source artefact for each
decision point.

USER:
Topic:
{TOPIC}

Knowledge base corpus:
{PASTE_CORPUS_OR_MCP}

Return JSON:
{
  "topic": "<verbatim>",
  "decision_timeline": [
    {
      "date": "<YYYY-MM-DD>",
      "decision": "<one sentence>",
      "attendees": ["<names>"],
      "source_title": "<artefact title>",
      "source_quote": "<verbatim>"
    }
  ],
  "current_state": "<one paragraph synthesising where the decision currently sits>",
  "open_questions": ["<one line per unresolved item>"],
  "next_review_date": "<YYYY-MM-DD or null>"
}

Rules:
- decision_timeline is chronological, oldest first.
- current_state reads from the most recent decision.
- open_questions only if the corpus shows unresolved items.
- Return JSON only.
```

**Step 3.3, person history.**

```text
SYSTEM: You answer "what do I know about X" from the knowledge
base. You return a profile of the person, the interactions you
have had with them, the decisions involving them, and any open
threads.

USER:
Person:
{NAME}

Knowledge base corpus:
{PASTE_CORPUS_OR_MCP}

Return JSON:
{
  "person": "<verbatim>",
  "current_role": "<from corpus>",
  "interactions": [
    {"date": "<YYYY-MM-DD>", "type": "<meeting | email | slack>", "summary": "<one sentence>", "source_title": "<artefact>"}
  ],
  "decisions_involving_them": [
    {"date": "<YYYY-MM-DD>", "decision": "<one sentence>", "source_title": "<artefact>"}
  ],
  "open_threads": ["<one line per open item>"],
  "relationship_temperature_history": [
    {"date": "<YYYY-MM-DD>", "temperature": "<warm | neutral | cool | tense>"}
  ]
}

Rules:
- interactions capped at 10, most recent first.
- relationship_temperature_history shows the arc, not just the
  current state.
- Return JSON only.
```

**Step 3.4, project history.**

```text
SYSTEM: You answer "how did X go" from the knowledge base. You
return the project's arc, the wins, the misses, the lessons and
the artefacts shipped.

USER:
Project:
{PROJECT}

Knowledge base corpus:
{PASTE_CORPUS_OR_MCP}

Return JSON:
{
  "project": "<verbatim>",
  "dates": {"start": "<YYYY-MM-DD>", "end": "<YYYY-MM-DD or 'ongoing'>"},
  "objective": "<verbatim from the brief>",
  "outcome": "<verbatim from the closeout or one-paragraph synthesis>",
  "wins": ["<one line per concrete win with evidence>"],
  "misses": ["<one line per concrete miss with lesson>"],
  "artefacts_shipped": [
    {"title": "<artefact title>", "type": "<brief | film | landing-page | etc>", "date": "<YYYY-MM-DD>"}
  ],
  "lessons_logged": ["<one line per concrete lesson>"]
}

Rules:
- objective and outcome come from the brief and the closeout,
  not from interpretation.
- wins and misses require evidence to qualify (numbers or named
  outcome).
- Return JSON only.
```

### Phase 4, the weekly hygiene routine

The corpus degrades without maintenance. The weekly routine takes 10 minutes.

**Step 4.1, the orphan check.**

Find every artefact added this week that does not have at least one People link and one Project link. Add the links manually or flag for the operator.

**Step 4.2, the duplicate check.**

Find pairs of artefacts with similar titles (Levenshtein distance under 5) or overlapping content (paste-comparison). Merge duplicates manually.

**Step 4.3, the stale check.**

Find Project artefacts that have not been updated in 60 days. Either mark as closed or move to an `archive` folder so they do not pollute searches.

**Step 4.4, the index refresh.**

Re-run the index file build so the routing layer is current.

The hygiene prompt:

```text
SYSTEM: You audit the knowledge base corpus for hygiene issues.
You flag orphans (artefacts without entity links), duplicates
(similar titles or content), and stale entries (no update in
60 days where the artefact is open-state).

USER:
Corpus index:
{PASTE_INDEX}

Return JSON:
{
  "orphans": [{"artefact": "<title>", "missing_links": ["<list>"]}],
  "duplicates": [{"artefact_a": "<title>", "artefact_b": "<title>", "similarity_signal": "<reason>"}],
  "stale_open_artefacts": [{"artefact": "<title>", "last_updated": "<YYYY-MM-DD>", "recommended_action": "<close | archive | review>"}]
}
```

## Worked example, end-to-end

Saoirse Burns has been at Cascadia for three years. The corpus runs to roughly 1,800 artefacts across Notion (briefs, projects, OKRs), Obsidian (her personal notes), Google Docs (older legacy memos) and Granola (meeting transcripts since January).

She sets up the hybrid pattern. The index lands at `.lens/knowledge-base-index.md` and points at Notion and Obsidian sources.

Three months later, Saoirse asks: "What did we decide about Trail Club?"

**Decision history retrieval output.**

```json
{
  "topic": "Trail Club partnership",
  "decision_timeline": [
    {
      "date": "2024-04-12",
      "decision": "Trail Club opens as a cross-promotion partner, Instagram-only, no commercial.",
      "attendees": ["Beth Lyons", "Saoirse Burns"],
      "source_title": "Trail Club intro meeting notes",
      "source_quote": "We agreed to start cross-promotion only, no money in either direction, see how the audience overlap performs."
    },
    {
      "date": "2025-11-08",
      "decision": "Trail Club Manchester regional events flagged as a potential paid partnership for 2026.",
      "attendees": ["Beth Lyons", "James Whitaker"],
      "source_title": "Trail Club Manchester touchbase",
      "source_quote": "James named the 2026 regional events as the moment a commercial partnership would make sense."
    },
    {
      "date": "2026-09-08",
      "decision": "Cascadia partnership ownership moves from Beth Lyons to Saoirse Burns for 2027.",
      "attendees": ["Saoirse Burns", "James Whitaker"],
      "source_title": "Trail Club intro, James Whitaker (2026-09-08)",
      "source_quote": "I'll own this for 2027, Beth stays in the loop but I'll be the primary."
    }
  ],
  "current_state": "Trail Club is in active partnership discussion for 2027. Saoirse is the primary owner. Partnership scope and commercial proposal due to James by 22 September. The shape is paid partnership with kit, signage and athlete involvement across four flagship Manchester events.",
  "open_questions": ["Final commercial number not yet set", "Whether the 2027 partnership becomes a multi-year contract"],
  "next_review_date": "2026-09-22"
}
```

Saoirse reads the answer in 90 seconds. The whole history is in front of her. The decision arc is visible. She closes the tab and gets back to drafting the partnership scope, having just saved 20 minutes of "where did I write that down".

A week later she asks about James Whitaker himself: "What do I know about James Whitaker?"

The person history retrieval returns a profile with the LinkedIn-pulled background, the three interactions across 2024 to 2026, the decisions involving him, and the open thread (commercial proposal due 22 Sep). The relationship temperature shows a steady warm arc.

## Try it yourself

Three exercises, each under 45 minutes.

### Exercise 1, write the knowledge base spec from scratch

Open a blank file. Without looking at the template, write down the entity types you actually need (you may have three, or five, or seven). Write the retrieval modes you actually ask (factual, decision history, person history, project history are the defaults, you may need a fifth like "vendor history" or "competitive history"). Compare to the template. Where you diverge is the local pattern.

### Exercise 2, run one retrieval mode on a real question

Pick a real question you have asked yourself in the last week. Run the appropriate retrieval prompt on a sample of your corpus (20 to 40 artefacts is enough for a test). Read the answer. The exercise is whether the prompt would have saved you the manual search.

### Exercise 3, do the hygiene routine on a 30-day window

Take the last 30 days of artefacts in your corpus. Run the hygiene prompt. Read the orphan, duplicate and stale outputs. Fix the orphans and duplicates by hand. The exercise is whether 10 minutes a week is enough to keep the corpus current. If it takes 30 minutes, your ingestion pipeline is letting too many orphans through. Fix the ingestion.

## The eval gates

**Eval 1, source tracing.** Sample 20 retrieval answers. Every answer cites at least one source quote. Zero un-cited answers is the target. Even one un-cited answer is a hallucination signal.

**Eval 2, time to answer.** A retrieval query should return in under 60 seconds for a corpus under 2,000 artefacts. Above 60 seconds the indexing layer is wrong.

**Eval 3, recall on decision history.** Pick five decisions you remember clearly. Run the decision-history retrieval for each. Every decision point you remember should appear. Missing one or two is acceptable. Missing four or five means the ingestion missed the source.

**Eval 4, hygiene drift.** After three months of weekly hygiene, the orphan rate should sit under 5 percent and the duplicate rate under 2 percent. Above either, the ingestion pipeline needs a tightening pass.

## The failure modes

**Source tracing fails silently.** A retrieval answer that does not name a source is a hallucination. The source quote requirement in every retrieval prompt is the guardrail. Do not relax it.

**The corpus duplicates itself.** Without the weekly duplicate check, the same meeting notes end up in three places. The hygiene routine is non-optional after the first month.

**Schema drift across surfaces.** Notion uses one tag taxonomy, Obsidian uses another, the index gets confused. Pick one schema and enforce it on ingestion, not retrieval.

**Privacy by accident.** The corpus contains customer names, salary signals, deal stages, board commentary. The retrieval layer needs the same privacy model as the source surfaces. Do not expose a corpus that pulls from a private Notion database to a shared agent or workspace.

**The corpus becomes an archive, not a tool.** When the operator stops asking it questions, the corpus stops earning its keep. The personal-knowledge-base playbook is a working tool. Track query count. Under 5 queries a week means the operator does not trust the layer or has forgotten it exists. Fix the trust gap.

## The pattern in practice

**Founder-led brand at growth stage, the institutional memory unlock.** A founder who used to be the institutional memory of the company. The corpus pulls three years of decision history out of the founder's head. New hires and direct reports use the corpus to onboard themselves. The founder's bottleneck on context-handing-off drops.

**Marketing director at scale, the cross-team continuity.** A director with shifting team members. The corpus keeps the brand's accumulated knowledge accessible even as people rotate through. New marketers find what was decided about messaging in 2024 without asking a senior. The shift from "ask Beth" to "ask the knowledge base" reduces interrupt rate on the senior team materially.

**B2B GTM lead at enterprise, the audit trail.** A GTM lead at a regulated company. The corpus accidentally becomes the audit trail for marketing decisions. Compliance reads from the corpus during the annual review and finds every decision dated and sourced. The pipeline saved 40 hours of compliance reconstruction work.

## Hand-off

Once the knowledge base is in place, the work feeds:
- **meeting-prep-stack**, where the prep pack reads from the corpus rather than the raw sources
- **call-follow-up-loop**, where the meeting record writes back to the corpus
- **document-drafting-partner**, where the corpus provides historical context for new drafts
- **quarterly-okr-synthesis**, where the synthesis reads from the year of corpus rather than fresh team reports
