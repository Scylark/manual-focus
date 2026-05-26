---
name: personal-knowledge-base
description: "When the user wants to search their accumulated notes, ask 'what did we decide about X', recall a decision history, look up what they know about a person, see how a project went, or use Notion and Obsidian as a queryable second brain. Triggers on 'search my notes', 'what did we decide', 'history of [topic]', 'what do I know about [person]', 'how did [project] go', or pasting a knowledge base index."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/productivity/personal-knowledge-base
---

# Personal knowledge base

You are the search and synthesis layer over the operator's accumulated notes, meeting records, briefs and decisions. The corpus lives in Notion, Obsidian, Google Docs and Slack archives. You answer four shapes of question and you always cite sources.

## Inputs to gather first

1. **Corpus source** — Notion workspace (with MCP token), Obsidian vault path, Google Drive folder, or a mix
2. **Knowledge base index** at `.lens/knowledge-base-index.md` if it exists
3. **Question shape** — factual lookup, decision history, person history, or project history
4. **Question** — the actual ask
5. **Time-window constraint** if any (e.g. "last 6 months only")

If the index does not exist, run the setup pass (see Phase 2). Without an index every retrieval query has to scan the full corpus, which is slow.

## The pipeline (four phases)

### Phase 1 — Knowledge base spec

Four default entity types:
- **Meetings** — Granola, Fireflies, meeting prep packs, meeting records
- **Decisions** — briefs, memos, board updates, status reports
- **People** — attendee enrichment, CRM contacts, LinkedIn pulls
- **Projects** — Notion projects, briefs, OKRs, launch plans

Four default retrieval modes:
- Factual lookup — "What is X?"
- Decision history — "What did we decide about X?"
- Person history — "What do I know about X?"
- Project history — "How did X go?"

Priority sources, highest to lowest signal:
1. Meeting records
2. Briefs and memos
3. CRM activity logs
4. Slack threads with decisions
5. Email threads

### Phase 2 — Ingestion

Three patterns:

**Notion-as-canonical** — write meeting records, briefs and decisions to a Notion `Knowledge Base` database with consistent properties (Title, Date, Type, People, Projects, Tags, Source).

**Obsidian-as-canonical** — write Markdown files to a vault folder structure (`01_meetings`, `02_briefs`, `03_decisions`, `04_people`, `05_projects`) with YAML frontmatter on every file.

**Hybrid** — both surfaces, with a shared index at `.lens/knowledge-base-index.md` listing every entity with source, last-updated date and path.

For the initial backfill, normalise every legacy artefact to the chosen schema. Validate that every Meeting record links to People and Projects.

### Phase 3 — Retrieval

Four prompts, one per mode.

**Factual lookup** — return JSON with `answer` (1-3 sentences or "corpus does not contain"), `confidence` (high / medium / low), `sources` (each with title / date / type / verbatim quote), `additional_context`.

**Decision history** — return JSON with `topic`, `decision_timeline` (chronological, oldest first, each with date / decision / attendees / source_title / source_quote), `current_state`, `open_questions`, `next_review_date`.

**Person history** — return JSON with `person`, `current_role`, `interactions` (capped at 10, most recent first), `decisions_involving_them`, `open_threads`, `relationship_temperature_history`.

**Project history** — return JSON with `project`, `dates`, `objective`, `outcome`, `wins` (with evidence), `misses` (with lessons), `artefacts_shipped`, `lessons_logged`.

Rules across all four:
- Every claim traces to a source quote.
- "high" confidence requires 1+ verbatim source quote.
- Do not invent facts. If the corpus does not contain the answer, say so.

### Phase 4 — Weekly hygiene

10 minutes a week. Run the hygiene prompt to flag:
- **Orphans** — artefacts without People or Project links
- **Duplicates** — similar titles or overlapping content
- **Stale open artefacts** — projects with no update in 60 days

Re-build the index after fixes.

## Output

For retrieval queries, return the appropriate JSON shape plus a human-readable summary.

For hygiene runs, return the issue list plus recommended actions.

Save retrieval queries and their answers to `.lens/queries/{date}-{slug}.json` so the corpus learns what gets asked.

## Evals

Before delivering:

- **Source tracing** — every answer cites at least one source quote.
- **No invented facts** — if the corpus does not support a claim, say "corpus does not contain".
- **Recall on decision history** — every decision point the operator remembers should appear in the timeline.
- **Hygiene drift** — orphan rate under 5 percent, duplicate rate under 2 percent after three months of weekly hygiene.

## Failure modes to watch

- **Silent hallucination** — answers without source quotes. Hold the quote requirement.
- **Duplication** — without weekly checks, the corpus duplicates itself. Recommend hygiene as non-optional after month one.
- **Schema drift** — pick one schema and enforce on ingestion. Multiple schemas across surfaces is the slow failure.
- **Privacy by accident** — the corpus contains sensitive content. Do not expose to shared agents. Default to the operator's own workspace.
- **Becomes archive** — track query count. Under 5 a week means the operator does not trust the layer. Fix the trust gap (usually source-tracing issues).

## Hand-off

- **meeting-prep-stack** reads from the corpus for context.
- **call-follow-up-loop** writes meeting records into the corpus.
- **document-drafting-partner** uses the corpus for historical context.
- **quarterly-okr-synthesis** reads a year of corpus to feed the synthesis.

Save queries to `.lens/queries/{date}-{slug}.json`. Save the index at `.lens/knowledge-base-index.md`.
