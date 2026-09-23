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
- `src/content/blog/`: existing posts. Read the titles and skim two
  or three for voice. `the-citation-moved-off-the-page.md` is the
  benchmark for tone and density.
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
title: "<Entity + what changed + for whom, ≤ 65 chars>"
date: YYYY-MM-DD
tags: ["ai-briefing", "ai", "<one more allowed tag if it fits>"]
description: "<≤ 160 chars. The direct answer: what happened and the one-line implication.>"
faq:
  - question: "<Phrased the way someone asks ChatGPT>"
    answer: "<40–80 words. Self-contained, names the entity, no 'as above'.>"
  # 3–5 items in total
sources:
  - title: "<Headline of the primary announcement>"
    url: "<primary source URL>"
    publisher: "<OpenAI / Google / Reuters ...>"
  # primary source first, then 1–3 corroborating sources
---
```

The layout renders `faq` and `sources` as visible sections at the end
of the post and emits FAQPage and `citation` structured data from
them. **Do not repeat them in the body.**

### Body

1. **Opening paragraph (40–60 words), no heading.** It must stand on its
   own as the answer if a model lifts only this paragraph. Name the
   company and product, give the date as "on 23 September 2026", the
   single most important number, and the implication for marketers.
2. `## What happened`: the facts, dated and specific, with the primary
   source linked inline. Short paragraphs.
3. `## What it means for marketing teams`: the core of the post and the
   reason it exists. Be concrete about channels, budgets, workflows and
   team shape. Include one sentence of the form "Our view at Manual
   Focus is ..." with a clear, defensible position.
4. `## What to do this week`: 3–5 numbered actions a marketing leader
   can actually take. Specific enough to act on.
5. `## What we don't know yet`: the honest caveats, open questions,
   and what would change the advice.
6. **Links:** 1–2 inline links to related Manual Focus posts or Lens
   playbooks, with trailing slashes (`/blog/slug/`, `/lens/content/slug/`),
   placed where they genuinely help. End with one plain sentence
   pointing to `/services/` or `/enquire/` for readers who want help
   applying it. No hard sell.

Target 600–900 words of body. Use questions as H2s only where they
read naturally; the four sections above are the default.

### Voice

- British English (optimise, programme, organisation, "in the UK").
- Senior, calm, specific. The reader is a CMO, not a hobbyist.
- Answer first, build-up never.
- Numbers over adjectives. "Priced at $X per million tokens", never
  "incredibly affordable".
- **Banned:** em dashes (use commas, full stops or brackets);
  "game-changer", "revolutionary", "unlock", "unleash", "supercharge",
  "delve", "landscape", "navigate the", "in today's fast-paced",
  "it's worth noting", "at the end of the day"; the "It's not X, it's Y"
  construction; triplets of adjectives; rhetorical questions as
  paragraph openers; closing with "Let's dive in" or "The future is
  here"; emoji.

## Step 6. Quality gates (all must pass)

- [ ] Every number, date, price, name and quote appears on a page in `sources`.
- [ ] The primary source is the company's own page, and it's first in `sources`.
- [ ] No claimed first-hand experience, clients or results (rule 4).
- [ ] The opening paragraph answers the question on its own.
- [ ] `description` ≤ 160 characters, `title` ≤ 65.
- [ ] 3–5 FAQ items, each 40–80 words and self-contained.
- [ ] Every internal link resolves to a real file in `src/content`.
- [ ] No banned words or em dashes (`grep -n "—" <file>` returns nothing).
- [ ] `npm run build` passes.

Fix and re-check until they all pass. If a gate can't pass (e.g. you
can't verify the key fact), don't publish. Log it as a skip.

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
- Open a pull request against `master` titled `AI briefing: <post title>`.
  In the body include: the story and why it cleared the bar (score),
  the primary source, anything you were unsure of, and the other
  candidates you rejected, with their scores.
- On a no-post day, commit just the ledger update to the branch and open
  a PR titled `AI briefing: no post (YYYY-MM-DD)` listing the candidates and
  why none cleared the bar.

Merging the PR publishes the post (GitHub Pages deploys from `master`).
