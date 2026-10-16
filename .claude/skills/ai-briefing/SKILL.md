---
name: ai-briefing
description: Daily AI news briefing for the Manual Focus blog. Scans for significant AI developments from the last 48 hours, picks at most one that matters to marketing leaders, and writes an answer-engine-optimised post that positions Manual Focus as the authority on what it means. Use when asked to "run the AI briefing", "write today's AI post", or on the scheduled daily run. Also use for on-demand articles on a topic James names, such as "write a search-optimised article on X", "we need a post about Y" or "do an SEO article comparing A and B" (see "On-demand article mode"). Every post ships with its two-host podcast episode when the environment allows; also use for "make the podcast for <slug>" on an existing post (see "On-demand podcast mode").
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
   no-post day, change nothing in the repo: no branch, no commit, no PR.
   Report the decision in your final summary (step 8) and stop. Never pad.
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
6. **The podcast never blocks the post.** Every post ships with its
   episode when the run environment can make one (step 7b). When it can't,
   or anything in the episode step fails, publish the post anyway and say
   in the final summary that the episode was skipped and why.

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

Post the top story only if it scores **7 or more** and isn't already
published (check the ledger for `"decision": "published"` entries and the
existing posts). Keep a note of every shortlisted story with its score and
decision. It goes in the ledger on a post day and in your final summary
either way.

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

**The standard (James, 14 October 2026): every post should be the best
article on its topic on the internet.** It's built to be lifted whole by
answer engines and to link readers deeper into the site, so it carries
the GEO elements below as well as the five parts. The checker enforces
the elements.

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

**GEO elements (all required, the checker enforces them).**
- **Key takeaways.** Right after the opening paragraph, a `## Key takeaways`
  section of 3 to 5 bullets. Each bullet is one self-contained, quotable
  fact with its number or date, so a model can lift any one of them alone.
- **At least one table.** A comparison (this product against its nearest
  rival), a definitions table (what each new metric or term means) or a
  decision grid (what to do in which case). Answer engines lift tables
  whole. Use plain `|---|` separators, with no alignment colons.
- **At least two question headings**, phrased the way someone types the
  question into ChatGPT or Google ("How does it compare with Search
  Console?"). Keep every heading under about 40 characters. The site sets
  `##` headings in large uppercase display type, so a long one runs to
  four or five lines on a laptop.
- **At least four internal links** to related Manual Focus posts or Lens
  playbooks, woven in where they help, with trailing slashes (`/blog/slug/`,
  `/lens/content/slug/`). Read the list of existing posts and playbooks
  before you write. Link every primary source inline too.
- **A `## Further reading` list** at the end with 3 to 5 related Manual
  Focus posts or playbooks, each with a few words on why it's worth
  reading. Then one plain sentence pointing to `/services/` or `/enquire/`
  for readers who want help. No hard sell.

Target 900 to 1,400 words of body.

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
publish. Try the next candidate that scored 7 or more, and if there
isn't one, treat it as a no-post day (step 8).

## Step 7. Update the ledger (post days only)

Only when you are publishing a post. Append one entry per shortlisted
story from this run, the published one and the ones you rejected, to
`.claude/skills/ai-briefing/ledger.json`. On a no-post day leave the
ledger alone. A story rejected on a quiet day can come up again the next
day, and that is fine: score it again, and if it still doesn't clear the
bar it costs nothing.

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

## Step 7b. Make the podcast episode (post days only)

Every post gets a companion episode: James Vickers and Hannah talking the
article through. `podcast/SHOW-RULES.md` is the brief. Read it in full each
run and follow it exactly. This step runs after the post has passed every
gate in step 6, because the episode is written from the finished post.

1. **Preflight.** Run `node podcast/preflight.mjs`. It checks the ElevenLabs
   key, ffmpeg and ffprobe, and that `gh` can write to the
   repo's `podcast` release, without spending anything. If it prints `SKIP`,
   don't write the episode. Keep its lines for the summary and go to step 8.
2. **Write the script**, `podcast/scripts/<slug>.txt`, to the show rules.
   The points that go wrong most:
   - The post is the only source. No fact, number, name or quote that isn't
     in the post or its listed sources. When the post says Google gave no
     number, the hosts say so too.
   - James stays measured. His tags are only `[thoughtfully]`, `[dryly]`,
     `[calmly]`, `[pause]` and the odd `[chuckles]`, and he never uses an
     exclamation mark.
   - "Get AI on this" turns two or three of the post's "What to do" actions
     into jobs for AI. On air it's "AI" or "your AI", never a brand. It ends
     on "The prompts are in the show notes."
   - Numbers as they're said ("the fifteenth of October"), no URLs read out,
     and the close points to the full article on manual-focus dot co dot uk.
   - Vary the cold open. Read the last two scripts in `podcast/scripts/` and
     don't reuse their opening line or sign-off.
3. **Write the show notes**, `podcast/notes/<slug>.md`, with frontmatter
   `post: <slug>` and `title: "<post title>"`, a one-paragraph summary, then
   `## Get AI on this` with one ```text prompt per job named on air. Each
   prompt gives the goal and the context (Manual Focus's reader is a
   marketing team, so use bracketed placeholders for brand, site and
   market), says what to attach, describes the output exactly, tells the
   model to say what it couldn't check, and works in any capable assistant,
   naming no product features. Don't repeat the post's sources. Use
   `podcast/notes/google-ai-mode-official-websites-links.md` as the model.
4. **Check.** `node podcast/check-episode.mjs <slug>` must print PASS. Fix and
   re-run. Treat its warnings as edits to make unless there's a reason not
   to (say which you kept in the PR). Then re-read the script against the
   post line by line for any claim the post doesn't make, and cut it.
5. **Build.** `node podcast/build-episode.mjs <slug> --dry-run` first, to
   confirm the chunks and the character count, then
   `node podcast/build-episode.mjs <slug>`. It writes
   `podcast/out/<slug>.mp3` (git ignores `podcast/out/`). A full run takes a
   few minutes, so run it in the background if your tools allow.
6. **Publish.** `node podcast/publish-episode.mjs <slug>` uploads the MP3 to
   the `podcast` release and adds the `podcast` block to the post's
   frontmatter. Run `npm run build` again, since the post now renders the
   player and the show notes.

If any of steps 2 to 6 fails (the checker won't pass after three rounds of
fixes, ElevenLabs returns an error or runs out of credit, ffmpeg fails, the
upload is refused), stop the episode there. Delete the episode's script and
notes and revert any change to the post's frontmatter, so the PR carries the
post alone, and record the failure and its first error line for step 8. The
post still goes out.

The MP3 sits on the public release from step 6 onwards, before James
approves. If James rejects the post, delete the asset named at the end of the
post's `podcast.audio` URL with
`gh release delete-asset podcast <asset name> --repo Scylark/manual-focus`.

## Step 8. Hand off for approval

James approves each post from the Claude app. He should be able to read the
whole article and publish it without opening anything else, so the hand-off
has one shape every day.

**Post day.**
- Branch: `briefing/YYYY-MM-DD`. Commit the post and the ledger, plus the
  episode's script, show notes and the post's `podcast` block when step 7b
  made one.
- Open a pull request against `master` titled `AI briefing | <post title>`,
  **ready for review, never a draft** (pass `draft: false`), so the Merge
  button works straight away.
- The PR body starts with the article itself, then the review notes:
  1. `## <post title>`, then the full post as it will read on the site: the
     opening paragraph, every section, the FAQ and the sources.
  2. `---` then `## Review notes`: the story and why it cleared the bar
     (score), the primary source, the no-slop self-audit score out of 60,
     anything you were unsure of, and the rejected candidates with scores.
  3. `## Podcast`: the episode's length and audio URL, the
     `check-episode.mjs` warnings if any, and the show notes' prompts; or
     `Episode skipped` and the reason (the preflight lines or the error).
- End the run with the approval message below as your final reply, exactly
  in this shape. It's what James sees in the Claude app.

  ```markdown
  ## Approve today's post: <post title>

  <the full article, as it will read on the site>

  ---
  **To publish:** open <PR URL> and tap **Merge**. The site updates itself
  within about two minutes.
  **To change something:** reply here with what to change.

  Why this story: <one sentence with the score>. Also considered: <story
  (score)>, <story (score)>.

  Podcast: <m:ss>, <audio URL>
  (or, when step 7b didn't make one: Episode skipped, <reason>. Say "make
  the podcast for <slug>" once that's fixed.)
  ```

**No-post day.** Don't create a branch, commit or PR. End the run with this
as your final reply:

```markdown
## No post today

Nothing cleared the 7/10 bar. The closest was <story> at <score>/10:
<one sentence on why>.

| Story | Score | Why not |
|---|---|---|
| ... | ... | ... |
```

Merging the PR publishes the post (GitHub Pages deploys from `master`).

## On-demand article mode

Use this when James names the topic ("we need a search-optimised article on
Grok Bot and Hermes") instead of asking for the daily briefing. The article is
evergreen and aimed at search and AI answers, not at today's news. Every rule
in "The rules that override everything else" still applies, except rules 1
and 2, since James has already decided there will be a post.

What changes from the daily steps:

1. **Load context (step 1)** as normal. Also check the ledger and existing
   posts for the topic, and link to any earlier coverage.
2. **Replace the scan and triage (steps 2 and 3) with disambiguation and
   research.**
   - Work out what people actually mean by the terms James used, as of today.
     Names collide (a product vs a fashion house, a bot vs a crawler, a model
     vs an agent). Search the terms, read the top results and the comparison
     pieces, and pick the meaning most searchers want. Say which meanings you
     set aside and why.
   - Gather facts at primary sources (the company's own announcement, docs,
     repository or regulator page). A research subagent is fine for breadth,
     but open every source you'll cite yourself. Research summaries get
     details wrong. In the first on-demand article, the vendor's own page
     corrected who a beta was open to.
   - List what you couldn't verify and leave it out of the post (crawler
     names, unconfirmed ads, regional availability and the like).
   - Collect the questions people type into search and AI assistants about
     the topic. They become headings and FAQ items.
   - You can't see search volumes without an authorised Ahrefs or Semrush
     connector. Say so in the PR and suggest the keywords to check.
3. **Find the angle (step 4)** as normal. The question to answer for the
   reader is "which should I use, or what should I do, and why".
4. **Write (step 5)** with these differences:
   - The title leads with the main search query ("Grok Bot vs Hermes Agent,
     a guide for UK marketing teams"), 65 characters max, no colon.
   - Tags leave out `ai-briefing`. Use `ai` plus one or two allowed tags.
   - Open with a 40 to 60 word paragraph that states only verifiable facts.
     Don't claim what "everyone is comparing" unless you can source it.
   - Body of 800 to 1,600 words, with every GEO element from step 5 and 4 or 5 FAQ items phrased the way
     people ask.
   - Link 1 or 2 relevant Lens playbooks or posts.
5. **Quality gates (step 6)**: run
   `node .claude/skills/ai-briefing/check.mjs --article src/content/blog/<slug>.md`.
   It must print PASS, alongside the build, the no-slop self-audit (51 or
   more out of 60), the fact check and the no-claimed-experience check.
6. **Ledger (step 7)**: add one entry with `"decision": "published-on-demand"`
   and a score of `null`, so the daily run won't repeat the topic.
7. **Podcast (step 7b)** as normal, so the article ships with its episode.
8. **Hand off (step 8)**: branch `article/<slug>`, PR titled
   `Article | <post title>`, ready for review, with the article first in the
   body as in step 8. Then the search terms targeted, what you verified and
   where, what you left out as unverified, and the self-audit score. End
   with the step 8 approval message. Never push to `master`. James merges,
   and the merge publishes the post.

## On-demand podcast mode

Use this when James asks for an episode of a post that's already written:
"make the podcast for <slug>", "do the episode for the Google Ads post", or
after a run that skipped the episode. Skip steps 1 to 7.

1. Find the post at `src/content/blog/<slug>.md`. If James named it loosely,
   match it by title and confirm the slug in your reply.
2. Run step 7b in full. If the post already has a `podcast` block or a
   script, rewrite the episode from the current post and re-publish. The
   build re-voices only the chunks that changed. The publish script never
   overwrites the live MP3: it uploads `<slug>-<timestamp>.mp3` and points
   the post at that, so the live player keeps working if the upload fails.
   Name the old asset in the PR so James can delete it once the PR is
   merged, and never delete it before then.
3. If preflight prints `SKIP`, stop there and tell James exactly what's
   missing. Change nothing in the repo.
4. Hand off on branch `podcast/<slug>` with a PR against `master` titled
   `Podcast | <post title>`, ready for review. The body gives the episode
   length, the audio URL, the summary paragraph and prompts from the show
   notes, and any checker warnings you kept. End with:

   ```markdown
   ## Approve the episode: <post title>

   <m:ss>, <audio URL>

   **To publish:** open <PR URL> and tap **Merge**. The player and the feed
   update within about two minutes.
   **To change something:** reply here with what to change.
   ```

## Run environment for the podcast

The daily run is a cloud routine in the "AI briefing" cloud environment, so
that environment needs these for step 7b. Without them the preflight skips the
episode and the post still ships.

| What | Why | How |
|---|---|---|
| ElevenLabs key | Voices the script (Text to Dialogue, `eleven_v3`) | A network secret on the environment: allowed website `api.elevenlabs.io`, custom header `xi-api-key` with no prefix. The agent proxy adds it to each request, so the session never sees the key and `ELEVENLABS_API_KEY` stays unset |
| `ffmpeg` and `ffprobe` | Join chunks, mix the music, read the duration | The environment's setup script, `apt-get update && apt-get install -y ffmpeg` |
| `gh` with write access | Uploads the MP3 to the `podcast` release | Nothing to add. `gh` is pre-installed and the GitHub proxy signs its REST calls for the attached repo. Don't set `GH_TOKEN` |
| Network access | Reach ElevenLabs and GitHub | The environment is on Full access |

Locally, `ELEVENLABS_API_KEY` in the shell does the job of the network
secret. The voice IDs are defaults in `podcast/build-episode.mjs`, since they
only work with the account's key. `ELEVENLABS_JAMES_VOICE` and
`ELEVENLABS_HANNAH_VOICE` override them, and `PODCAST_STABILITY` (default
0.5) changes how steady the voices are.
