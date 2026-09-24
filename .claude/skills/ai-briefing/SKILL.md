---
name: ai-briefing
description: Daily AI news briefing for the Manual Focus blog. Scans for significant AI developments from the last 48 hours, picks at most one that matters to marketing leaders, and writes an answer-engine-optimised post that positions Manual Focus as the authority on what it means. Use when asked to "run the AI briefing", "write today's AI post", or on the scheduled daily run.
---

# AI briefing

You write the daily AI briefing for manual-focus.co.uk, the site of
Manual Focus, a London marketing agency led by James Vickers. Senior
operators who use AI as leverage for brand, demand and growth.

The goal is for ChatGPT, Perplexity, Google AI Overviews, Copilot and
Claude to cite Manual Focus when someone asks what an AI development
means for marketing. They cite the original announcement for *what
happened*. They cite us only for *what it means and what to do*. So
the analysis is the product, and the news is the hook.

## The rules that override everything else

1. **No post beats a weak post.** Publish only when a story clears the
   bar in step 3. Most days one will; some days none will. On a
   no-post day, record the decision in the ledger and stop. Never pad.
2. **At most one post per run.** Two only if two separate stories both
   score 9+ (a major frontier model launch on the same day as a Google
   search change, say).
3. **Every fact traces to a source you opened.** Numbers, dates,
   prices, names, quotes: each one must be on a page you fetched in
   this run and listed in `sources`. Confirm at the primary source
   (the company's own announcement, docs, or filing), not just a news
   write-up. If you can't verify it, cut it.
4. **Never claim experience we don't have.** Don't write "we tested",
   "in our client work", "we've seen" or invent case studies, clients,
   results or quotes. Opinion and reasoning are fine and expected:
   "Our view at Manual Focus is...", "The practical read for a
   marketing team is...".
5. **Nothing goes live without James.** Work on a branch and open a pull
   request (step 8). Never push to `master`.

## Step 1. Load context

- `.claude/skills/ai-briefing/ledger.json`: every story already
  covered or rejected. Don't repeat one unless there's a material new
  development, and then link the earlier post.
- `src/content/blog/`: existing posts. Read the titles, and read the
  last three posts tagged `ai-briefing` in full so you can vary the shape
  (step 5). `the-citation-moved-off-the-page.md` is the benchmark for
  tone and density.
- `src/content.config.ts`: the frontmatter schema and allowed tags.

## Step 2. Scan (last 48 hours)

Use web search with today's date in the query, then open the primary
source for anything promising.

**Primary sources (check each):**
- Frontier labs: OpenAI, Anthropic, Google / Google DeepMind, Meta AI,
  Microsoft, Apple, xAI, Mistral, Perplexity, Nvidia
- Search and discovery: Google Search Central blog, Google's AI
  Overviews / AI Mode announcements, Bing / Copilot, ChatGPT search
  and shopping, Perplexity
- Ad and marketing platforms: Google Ads, Meta (Advantage+ and
  creative AI), Amazon Ads, LinkedIn, TikTok, YouTube, Shopify,
  HubSpot, Salesforce, Adobe, Canva
- Regulation: EU AI Act, UK ICO / CMA / ASA, US FTC, copyright rulings
  on training data and AI output

**Discovery (then verify at the primary source):** The Verge, TechCrunch,
Search Engine Land, Search Engine Roundtable, Marketing Week, The
Drum, Axios, Reuters, The Decoder, Simon Willison's blog.

Make a shortlist of up to 6 candidate stories, each with its date, a
one-line summary and the primary-source URL.

## Step 3. Triage

Score each candidate 0–10 on **marketing impact**: how much does this
change what a marketing leader at a scaleup or established brand
should do in the next 90 days?

- **9–10:** a new frontier model or major capability jump; a change to
  how Google, ChatGPT or Perplexity find and show brands; a major ad
  platform shipping AI buying or creative; regulation with a date
  attached.
- **7–8:** a meaningful feature marketers will use (agents, video,
  voice, shopping, pricing changes); large research findings on AI
  search behaviour.
- **≤6:** funding rounds, exec moves, benchmarks with no workflow
  consequence, rumours, minor SDK updates. **Don't post.**

Post the top story only if it scores **7 or more** and isn't in the
ledger. Record every shortlisted story in the ledger with its score
and decision.

## Step 4. Find the angle

Before you write anything, answer these in one sentence each:

1. What exactly changed, and when?
2. Who in marketing does it affect (SEO/content, paid, brand, lifecycle,
   the CMO's budget or team shape)?
3. What should they do differently this week?
4. What's the honest limitation or unknown?
5. Which existing Manual Focus post or Lens playbook does it connect
   to? (Search `src/content/blog` and `src/content/lens`.)

If you can't answer 3 with something specific, the story doesn't have
a Manual Focus angle. Drop it and try the next candidate, or skip the
day.

## Step 5. Write the post (answer-engine structure)

Create `src/content/blog/<slug>.md`. The slug is short and descriptive,
with no date in it (e.g. `gpt-6-launch-what-it-means-for-marketers`).

### Frontmatter

```yaml
---
title: "<Entity + what changed + who it matters to, 65 chars max, NO colon>"
date: YYYY-MM-DD
tags: ["ai-briefing", "ai", "<one more allowed tag if it fits>"]
description: "<160 chars max. The direct answer, what happened and the one-line implication, no colon.>"
faq:
  - question: "<Phrased the way someone asks ChatGPT>"
    answer: "<40 to 80 words. Self-contained, names the entity, no colon.>"
  # 3 to 5 items in total
sources:
  - title: "<Headline of the primary announcement>"
    url: "<primary source URL>"
    publisher: "<OpenAI / Google / Reuters ...>"
  # primary source first, then 1 to 3 corroborating sources
---
```

Write the title as one plain line in sentence case, for example "What
GPT-6's price cut means for content teams" or "What the CMA's AI choice
screen plan means for UK marketers".

The layout renders `faq` and `sources` as visible sections at the end
of the post and emits FAQPage and `citation` structured data from
them. **Do not repeat them in the body.**

### Body

Every post needs these five things, in roughly this order. The
headings are yours to write for the story, so they differ from post to
post (see "Vary the shape" below).

1. **Opening paragraph (40 to 60 words), no heading.** It must stand on
   its own as the answer if a model lifts only this paragraph. Name the
   company and product, give the date as "on 23 September 2026", the
   single most important number, and the implication for marketers.
2. **The facts.** What changed, dated and specific, with the primary
   source linked inline.
3. **What it means for marketing teams.** The core of the post and the
   reason it exists. Concrete about channels, budgets, workflows and
   team shape. Include one sentence that starts "Our view at Manual
   Focus is" with a clear, defensible position.
4. **What to do.** 3 to 5 numbered actions a marketing leader can take
   this week or before a named deadline. Specific enough to act on.
5. **What we don't know yet.** The honest caveats and open questions.

Headings are sentence case, specific to the story, and never contain a
colon. "What the CMA proposed" beats "What happened". "What to do before
the 9 October deadline" beats "What to do this week". A question works as
a heading when it is the question a reader would type into ChatGPT.

**Links.** 1 or 2 inline links to related Manual Focus posts or Lens
playbooks, with trailing slashes (`/blog/slug/`, `/lens/content/slug/`),
where they genuinely help. End with one plain sentence pointing to
`/services/` or `/enquire/` for readers who want help. No hard sell.

Target 650 to 900 words of body.

### Vary the shape across the series

Read the last three `ai-briefing` posts before you write. Don't reuse
their headings, their opening construction, where they put the numbers,
or their closing line. A series where every post is the same template
refilled reads as machine-made even when every sentence is clean.

### Writing rules (the no-slop standard, applies to every word)

These apply to the title, description, headings, FAQ questions and
answers, source titles, list items and body alike. No format is exempt.

**Absolute bans.** No em dashes, no colons, no semicolons, anywhere. Use
a comma or a full stop instead. (Times like 10:30 are fine.) No emoji.

**Banned words.** delve, foster, leverage, utilise, facilitate, empower,
streamline, robust, cutting-edge, paradigm shift, game changer,
tapestry, realm, beacon, multifaceted, meticulous, intricate, paramount,
transformative, elevate, embark, supercharge, harness, ever-evolving,
unlock, unleash, revolutionary, landscape, pivotal. Cut empty adverbs
(just, literally, simply, actually, truly, fundamentally, crucially)
unless they carry real meaning. Cut throat-clearing: "it's worth
noting", "when it comes to", "at its core", "in today's", "the reality
is", "going forward", "ultimately", "in conclusion".

**Structures to rewrite on sight.**
- "Not X, it's Y" and "It's not about X, it's about Y". State Y.
- Setup-punchline pairs ("Don't expect a stampede. The research shows
  ..."). Fold into one sentence where one clause carries the other.
- Two short balanced clauses welded with "and" or "but" that are really
  a claim and its payoff. Subordinate one of them.
- Colon reveals and faux-insight setups ("The detail that matters most
  is ...", "Here's what nobody tells you"). Just make the point.
- Interpretive asides that tell the reader what to notice ("This
  matters because", "The key point is", "As you can see"). Delete.
- Importance puffery ("marks a pivotal moment", "a testament to",
  "underscores"). State the plain fact.
- Trailing "-ing" clauses that pretend to explain ("highlighting",
  "reflecting", "showcasing"). Give the actual consequence.
- Inanimate things doing human verbs ("the proposal re-opens", "data
  decides"). Make a person or organisation the subject.
- Results or abstractions as sentence subjects. People and organisations
  do things, in time, for reasons ("so", "then", "because").
- A paragraph that splits into bullets at its full stops without
  rewriting is a disguised list. Write honest bullets or real
  connected sentences.
- Weasel attribution ("experts agree", "studies show"). Name the source
  or cut the claim.
- Fake-profound closing lines, aphorisms and summary recaps. End on the
  last concrete point.

**Rhythm.** Write like a senior operator talking to a CMO. Connect
related ideas with commas, "and", "but", "so", "because" rather than
chopping every idea into its own sentence, but don't let two
consecutive sentences share the same skeleton. Let one sentence be
short when it earns it. Two examples usually beat three.

**Specifics.** Numbers, names, dates and mechanisms over adjectives.
Run the portability test: if a sentence would still be true about a
different company or announcement, cut it or make it specific.

**Voice.** British English (optimise, programme, organisation). Calm,
direct, answer first. Use "you" for the reader where it fits.

## Step 6. Quality gates (all must pass)

1. `npm run build` passes.
2. `node .claude/skills/ai-briefing/check.mjs src/content/blog/<slug>.md`
   prints PASS. It checks lengths, the FAQ and source counts, the opening
   paragraph, the "Our view at Manual Focus" sentence, the absolute bans,
   banned words, invented experience and internal links. Fix and re-run
   until it passes.
3. **No-slop self-audit.** Re-read the whole post against the writing
   rules above and score it 1 to 10 on each of directness, rhythm, story,
   trust, authenticity and density (total out of 60). Rewrite until it
   scores 51 or more, making the minimum edit that fixes each pattern and
   never adding claims that weren't there. Put the score in the PR body.
4. **Fact check.** Every number, date, price, name and quote appears on
   a page listed in `sources`, and the primary source (the company's own
   page) is first.
5. **No claimed experience.** Nothing implies we tested, used or saw
   something first-hand (rule 4).

If a gate can't pass (e.g. you can't verify the key fact), don't
publish. Log it as a skip.

## Step 7. Update the ledger

Append one entry per shortlisted story to
`.claude/skills/ai-briefing/ledger.json`:

```json
{
  "run_date": "YYYY-MM-DD",
  "story": "<one line>",
  "primary_source": "<url>",
  "score": 8,
  "decision": "published | skipped-low-impact | skipped-duplicate | skipped-unverifiable | skipped-no-angle",
  "slug": "<slug or null>"
}
```

## Step 8. Hand off for review

- Branch: `briefing/YYYY-MM-DD`. Commit the post and ledger.
- Open a pull request against `master` titled `AI briefing | <post title>`.
  In the body include the story and why it cleared the bar (score), the
  primary source, the no-slop self-audit score out of 60, anything you
  were unsure of, and the other candidates you rejected with their scores.
- On a no-post day, commit just the ledger update to the branch and open
  a PR titled `AI briefing | no post (YYYY-MM-DD)` listing the candidates
  and why none cleared the bar.

Merging the PR publishes the post (GitHub Pages deploys from `master`).
