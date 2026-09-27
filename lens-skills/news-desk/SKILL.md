---
name: news-desk
description: "When a brand wants its own daily news workflow: a desk that scans its industry for news each day, picks at most one story that matters to its audience, verifies it at primary sources and drafts a search- and AI-answer-optimised blog post as a pull request. Also writes on-demand articles on a topic the user names. Triggers on 'set up a news desk', 'daily news posts for our blog', 'build our own news workflow', 'write today's news post', 'run the news desk', 'daily industry briefing post', 'write a search-optimised article on X', or 'schedule a daily post'. Not the morning inbox brief (that's daily-briefing-pipeline)."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/content/news-desk
---

# News desk

You run a brand's news desk. Each day you scan the brand's industry for new developments, pick at most one that changes what the brand's audience should do, verify it at the primary source and write a post that answers "what does this mean for me". Search engines and AI assistants cite the original announcement for *what happened*. They cite the brand for *what it means and what to do*. So the analysis is the product and the news is the hook.

Everything specific to a brand (its beat, audience, sources, voice, blog format, languages, build and schedule) lives in one config file, `.lens/news-desk.json`. The process and the rules below are the same for every brand.

## Modes

1. **Set up**: first run in a repo, or "set up a news desk". Interview the user, write the config and the ledger, dry-run once. (Phase 0)
2. **Daily run**: "run the news desk", or the scheduled run. (Phases 1 to 8)
3. **On-demand article**: the user names a topic. (See "On-demand article mode")
4. **Schedule it**: "run this every morning". (See "Scheduling")

If `.lens/news-desk.json` doesn't exist, you're in set-up mode, whatever the user asked for.

## The rules that override everything else

1. **No post beats a weak post.** Publish only when a story clears the brand's bar (default 7 out of 10). On a no-post day, change nothing in the repo. No branch, no commit, no pull request. Report the decision and stop.
2. **At most one post per run**, two only if two separate stories both score 9 or more.
3. **Every fact traces to a source you opened in this run.** Numbers, dates, prices, names and quotes must each appear on a page you fetched and listed in `sources`. Confirm at the primary source (the company's own announcement, docs, filing or results page), not only a news write-up. If you can't verify it, cut it.
4. **Never claim experience the brand doesn't have.** No "we tested", invented customers, results, athletes or quotes. Opinion is expected: "Our view at <brand> is ...".
5. **Nothing goes live without a human.** Work on a branch and open a pull request. Never push to the default branch. Merging publishes.
6. **Counting goes in code.** Word counts, lengths and dates are checked by `scripts/check.mjs`, not estimated.

## Phase 0, set up (first run only)

Interview the user, one topic at a time. Offer a sensible default for each so they can say "yes".

1. **Brand and site**: name, site URL, and one line on what the brand sells.
2. **Audience**: who reads the blog and what they're responsible for ("UK marketing leaders at scaleups", "amateur cyclists training for their first sportive").
3. **Beat**: the kinds of news that matter to that audience, and the kinds that don't. Write both lists down. The "don't" list keeps the desk from drifting.
4. **Why us**: the angle the brand is qualified to give. It decides what the "what it means" section is allowed to say.
5. **Sources**: primary sources to check every run (companies, governing bodies, regulators, research journals) and discovery sources (trade press, newsletters). Aim for 8 to 15 primary sources.
6. **Scoring**: what a 9 or 10, a 7 or 8, and a 6 or below look like *for this audience*. Default bar is 7.
7. **Voice**: spelling (en-GB or en-US), banned words, punctuation rules, and the opinion sentence opener ("Our view at WattPlan is").
8. **Post format**: read two or three existing posts and the content schema, then record the directory, filename pattern, frontmatter fields, allowed tags, and whether the layout renders `faq` and `sources` from frontmatter. If it doesn't, the post puts them in the body instead.
9. **Languages**: the default language and any translations the build requires. If the site is multilingual, find out how translations are stored and whether the build fails without them.
10. **Build and hand-off**: the build command, the output directory, the default branch, the branch prefix and the pull request title format.

Then:
- Write `.lens/news-desk.json` from `templates/news-desk.example.json`.
- Create an empty ledger at the path in the config (`[]`).
- Copy `scripts/check.mjs` into the repo (for example `.lens/news-desk/check.mjs`) so scheduled runs can use it without the plugin.
- Do a dry run of Phases 1 to 4 and show the user the shortlist and scores. Don't write a post on the set-up run unless they ask.
- Offer to schedule it (see "Scheduling").

## Phase 1, load context

- Read `.lens/news-desk.json`.
- Read the ledger: every story already covered or rejected. Don't repeat a published story unless there's a material new development, and then link the earlier post.
- List existing posts in the blog directory and read the last three news posts in full, so you can vary the shape (Phase 5).
- Check open pull requests with the configured title prefix, and treat their stories as covered.

## Phase 2, scan (last 48 hours)

Search the web with today's date in the query, then open the primary source for anything promising. Check each configured primary source. Use discovery sources only to find stories, then verify at the primary source. Make a shortlist of up to 6 candidates, each with its date, a one-line summary and the primary-source URL.

## Phase 3, triage

Score each candidate 0 to 10 against the config's rubric: how much does this change what the audience should do in the next 90 days? Post the top story only if it clears the bar and isn't already covered. Keep every shortlisted story with its score and decision. It goes in the ledger on a post day and in the summary either way.

## Phase 4, find the angle

Answer each in one sentence before writing:
1. What exactly changed, and when?
2. Who in the audience does it affect?
3. What should they do differently this week?
4. What's the honest limitation or unknown?
5. Which existing post or page on the site does it connect to?

If you can't answer 3 with something specific, the story has no angle for this brand. Try the next candidate or skip the day.

## Phase 5, write the post

Create the post at the configured path. The slug is short and descriptive, with no date.

**Frontmatter**: follow the site's schema. Where the layout supports them, include:
- `title`: entity, what changed and who it matters to. Sentence case, within the configured length, and no colon if the voice bans colons.
- `description`: the direct answer in one line, within the configured length.
- `faq`: 3 to 5 questions phrased the way someone asks an AI assistant, each answered in 40 to 80 words that stand alone.
- `sources`: the primary source first, then 1 to 3 corroborating sources.

**Body**, in roughly this order, with headings you write for the story:
1. **An opening paragraph of 40 to 60 words, with no heading.** It must stand alone as the answer if a model lifts only this paragraph. Name the company or body, the date ("on 23 September 2026"), the single most important number and the implication for the audience.
2. **The facts.** What changed, dated and specific, with the primary source linked inline.
3. **What it means.** The core of the post. Include one sentence starting with the configured opinion opener, with a clear, defensible position.
4. **What to do.** 3 to 5 numbered actions the reader can take this week or before a named deadline.
5. **What we don't know yet.** The honest caveats.

Link 1 or 2 related pages on the site where they help. End with one plain sentence pointing to the brand's product or contact page. No hard sell.

**Vary the shape.** Don't reuse the last three posts' headings, opening construction or closing line. A series built from one refilled template reads as machine-made even when every sentence is clean.

**Writing rules.** Apply the configured voice to every word, including the title, FAQ and list items. By default:
- No em dashes, no emoji.
- None of the banned words.
- No "not X, it's Y" constructions or setup-punchline pairs.
- No interpretive asides ("this matters because").
- No weasel attribution ("experts agree").
- No fake-profound closing lines.

Use specific numbers, names, dates and mechanisms, not adjectives. If a sentence would still be true about a different company, cut it or make it specific.

**Translations.** If the site is multilingual, produce each required translation in the configured structure. Translate meaning, not word by word. Keep numbers, names, dates and source URLs identical, and run the checks on every language file.

## Phase 6, quality gates (all must pass)

1. The build command passes.
2. `node <check.mjs> <post>` prints PASS (add `--article` in on-demand mode). It checks lengths, FAQ and source counts, the opening paragraph, the opinion sentence, absolute bans, banned words, claimed experience and internal links, all from the config.
3. **Self-audit.** Score the post 1 to 10 on directness, rhythm, story, trust, authenticity and density. Rewrite until it reaches 51 out of 60, making the smallest edit that fixes each problem.
4. **Fact check.** Every number, date, price, name and quote appears on a page listed in `sources`, primary source first.
5. **No claimed experience** (rule 4).

If a gate can't pass (for example, the key fact can't be verified), don't publish. Try the next candidate that cleared the bar, or treat it as a no-post day.

## Phase 7, ledger (post days only)

Append one entry per shortlisted story (the published one and the rejects) to the ledger:

```json
{ "run_date": "YYYY-MM-DD", "story": "<one line>", "primary_source": "<url>", "score": 8,
  "decision": "published | published-on-demand | skipped-low-impact | skipped-duplicate | skipped-unverifiable | skipped-no-angle",
  "slug": "<slug or null>" }
```

On a no-post day, leave the ledger alone and report the shortlist in the summary instead.

## Phase 8, hand off

- **Post day**: create a branch with the configured prefix and date, and commit the post, its translations and the ledger. Open a pull request with the configured title. In its body put the story and its score, the primary source, the self-audit score, anything you were unsure of, and the rejected candidates with their scores.
- **No-post day**: no branch, commit or pull request. End with a summary listing each candidate, its score and why it didn't clear the bar.

## On-demand article mode

Use this when the user names the topic ("we need a search-optimised article on X"). Every rule above still applies except rules 1 and 2, because the user has already decided there will be a post.

- **Replace Phases 2 and 3 with disambiguation and research.** Work out what searchers mean by the user's terms today, since names collide (a product and a fashion house, a bot and a crawler, a model and an agent). Read the top results and the comparison pieces, pick the meaning most searchers want, and say which meanings you set aside. Gather facts at primary sources and open each one yourself. List what you couldn't verify, and leave it out. Collect the questions people ask, which become headings and FAQ items. Without an authorised keyword tool, say so and suggest the terms to check.
- **Write**:
  - The title leads with the main search query.
  - The opening states only verifiable facts. Don't claim "everyone is comparing" anything unless you can source it.
  - The body runs 800 to 1,600 words, with 4 or 5 FAQ items.
- **Check** with `--article`, log it as `published-on-demand` with a score of `null`, and use the article branch prefix.

## Scheduling

Once a manual run has produced a post the user is happy with, offer to schedule the daily run.

- **Claude Code cloud routine**: use the `schedule` skill (or `/schedule`) to create a daily routine on the repo at the configured time, with `templates/routine-prompt.md` filled in as its prompt. It runs in a fresh checkout, so it relies on the copied `check.mjs`, not the plugin.
- **Cowork**: create a scheduled task with the same prompt.

Give the routine web search and fetch, and file, shell and git access. It needs nothing else. Tell the user where the runs will appear, and that on quiet days no pull request is opened.

## Eval gates

- **N1, bar held**: no post under the configured bar. In a typical week at least one day is a no-post day, so a desk that posts every day has set its bar too low.
- **N2, sourced**: every fact in the post appears on a listed source, primary first.
- **N3, answer first**: the opening paragraph answers the question on its own.
- **N4, no repeats**: no story the ledger already records as published.
- **N5, human merge**: nothing reached the default branch without a pull request.

## Failure modes

- **Beat drift**: the desk starts covering adjacent news its audience doesn't act on. Fix the "don't" list in the config.
- **Template fatigue**: every post has the same headings and closing line. Enforce the "vary the shape" check against the last three posts.
- **Secondary-source facts**: a number quoted from a news write-up that the primary source doesn't support. Rule 3 exists for this.
- **Real names, invented detail**: an example that puts invented results or quotes on a real person or company. Use fictional names, or only sourced facts.
- **Build breaks on languages**: a multilingual site fails to build because a translation is missing. Phase 5 covers every required language.
- **Wrong skill**: the user asks for a "daily briefing" and gets the morning inbox brief. That's `daily-briefing-pipeline`. This skill is the news desk.

## Hand-off

- **seo-cluster-generator** when news keeps landing on one topic the site has no pillar page for
- **social-content-factory** to turn a published post into channel-native cuts
- **ai-studio-news-watch** for AI-model release posts written for LinkedIn rather than the blog
- **eval-gated-drafting** when the desk grows into more than one post a day
