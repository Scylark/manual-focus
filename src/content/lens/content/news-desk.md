---
title: "Your own news desk"
stack: content
description: "A daily news workflow for any brand. Scan your industry, post only when a story matters to your audience, verify every fact at the source and hand each post over as a pull request."
outputs: "Desk config, story ledger, daily news posts, on-demand articles, scheduled run"
readMin: 7
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["content", "seo", "pr"]
models: ["claude-5.5-opus"]
publishedAt: 2026-09-25
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five things.

1. A **desk config** for your brand: beat, audience, sources, scoring rubric, voice and blog format, in one file.
2. A **story ledger** that records every story the desk published or rejected, with its score, so it never repeats itself.
3. A **daily run** that scans the last 48 hours, scores each story against your bar and drafts at most one post.
4. An **on-demand mode** for search-optimised articles on a topic you name.
5. A **scheduled routine** that runs the desk every morning and opens a pull request only when a story clears the bar.

## Who this is for

A brand whose customers make decisions based on what's changing in its industry: platform changes for marketers, rule changes for athletes, product launches for buyers. You want your site to be the place people, search engines and AI assistants go for "what does this mean for me". You also want a human to approve every post. If your industry changes once a quarter, write those posts by hand.

## Before you start

- [ ] Your site in a git repo with a working build, and a blog that's a folder of Markdown or MDX files
- [ ] The `news-desk` skill from The Lens plugin installed
- [ ] One sentence that says who reads your blog and what they're responsible for
- [ ] Eight to fifteen primary sources for your industry: the companies, governing bodies and regulators whose announcements you'd cite
- [ ] Someone who can review a pull request each morning in under ten minutes

## The pipeline

### Phase 0, set up the desk

Ask the agent to "set up a news desk". It interviews you one topic at a time and writes `.lens/news-desk.json`. Most of the value is in two answers. The **beat** says what to cover and, just as important, what to skip, and the skip list stops the desk drifting into news your audience doesn't act on. The **scoring rubric** says what a 9, a 7 and a 6 look like for your audience specifically. The agent reads your existing posts to learn the blog format, and checks whether your build needs translated copies.

```text
Set up a news desk for <brand>. Audience: <who reads the blog>.
Cover: <kinds of news that change what they do>.
Skip: <kinds of news they don't act on>.
Primary sources: <8 to 15 URLs>.
Opinion sentence: "Our view at <brand> is".
Read two existing posts to learn the format, then dry-run the scan and
show me the shortlist with scores. Don't write a post yet.
```

### Phase 1, scan and triage

Each run searches the last 48 hours, checks every primary source and builds a shortlist of up to six stories, each with a date and a primary-source URL. Each story is scored 0 to 10 on one question: how much does this change what the audience should do in the next 90 days? Only a story at or above the bar becomes a post. Everything on the shortlist goes in the ledger with its score, including the rejects.

### Phase 2, find the angle

Before writing, the agent answers five questions in one sentence each: what changed and when, who it affects, what they should do this week, what's still unknown, and which page on your site it connects to. If there's no specific answer to "what should they do this week", the story has no angle for your brand, and the desk moves on or skips the day.

### Phase 3, write for answers

The post opens with a 40 to 60 word paragraph that answers the question on its own, because that's the passage an AI assistant lifts. Then come the dated facts with the primary source linked, what it means (including one sentence that starts with your opinion opener), three to five numbered actions and the honest unknowns. FAQ items are phrased the way people ask assistants, and sources are listed with the primary one first. Headings change from post to post so the series doesn't read as a refilled template.

### Phase 4, gate and hand off

The build must pass, and the checker must pass. The checker reads every limit and banned word from your config, so the rules are yours. The agent scores its own draft on directness, rhythm, story, trust, authenticity and density, rewrites until it reaches 51 out of 60, then confirms every fact against a listed source. On a post day it opens a pull request with the story, the score, the rejects and anything it wasn't sure of. On a no-post day it changes nothing.

### Phase 5, schedule it

Once a manual run has produced a post you'd publish, schedule the daily run as a Claude Code cloud routine (or a Cowork scheduled task) using the prompt template that ships with the skill. It runs in a fresh checkout each morning, so the checker is copied into your repo during set-up.

## Worked example, end-to-end

This is the desk Manual Focus runs for its own blog, covering AI news for UK marketing leaders. The figures come from its ledger.

**Phase 0 output.** The beat covers frontier models, changes to how search and AI assistants show brands, AI ad buying and creative, and dated regulation. It skips funding rounds, exec moves, benchmarks and rumours. The bar is 7.

**Phase 1 output.** Over its first three days, 23 to 25 September 2026, the desk shortlisted 23 stories. Seventeen were rejected as low impact and two because a key fact couldn't be confirmed at a primary source. Three cleared the bar and became posts: the CMA's proposal for AI assistant choice screens on Android and Chrome (scored 9), ChatGPT Ads opening to Shopify merchants outside the US (8), and Google adding a multimodal search filter to Search Console (7).

**Phase 3 and 4 output.** Each post passed the checker and went to a pull request. The human review caught one process issue: the scheduled run opened its pull request as a draft, which GitHub won't merge until it's marked ready.

**On-demand output.** The same process, pointed at a topic chosen by the owner, produced a comparison of SpaceXAI's Grok Bot and Nous Research's Hermes Agent. The primary-source check corrected who the Grok Bot beta was open to before it published.

**Adapting it.** Set up for a cycling training app instead, only the config would change: a beat such as training research, race and governing-body rule changes and cycling technology, and an audience of amateur riders. If that site builds in several languages, the desk writes the translations the build needs alongside each post.

## Try it yourself

### Exercise 1, write your skip list

List five kinds of story your industry press covers that your customers never act on. That list is worth more to the desk than the cover list.

### Exercise 2, score last week

Take last week's industry news. Score each story 0 to 10 against "what does this change for my audience in the next 90 days". If more than two score 7 or more, your bar is too low or your beat is too wide.

### Exercise 3, the lifted paragraph test

Take your last blog post. Read only its first paragraph. If an assistant quoted just that, would the reader have their answer? If not, rewrite it.

## The eval gates

- **Eval 1, bar held.** No post under the bar. In a typical week at least one day is a no-post day, so a desk that posts every day has its bar too low.
- **Eval 2, sourced.** Every number, date, price, name and quote appears on a listed source, primary first.
- **Eval 3, answer first.** The opening paragraph answers the question on its own.
- **Eval 4, no repeats.** No story the ledger already records as published.
- **Eval 5, human merge.** Nothing reached the live site without a pull request.

## The failure modes

**Beat drift.** The desk starts covering adjacent news because it's there. Tighten the skip list.

**Template fatigue.** Every post has the same headings and closing line, and readers and assistants learn to ignore it. The desk compares each draft with the last three posts.

**Secondary-source facts.** A number quoted from a write-up that the original announcement doesn't support. The desk only cites what it opened.

**Real names, invented detail.** An example that puts invented results or quotes on a real person or company. The desk uses sourced facts or fictional names.

**Wrong skill.** Someone asks for a "daily briefing" and gets the morning inbox brief. That's `daily-briefing-pipeline`, a different skill. Ask for the news desk.

## The pattern in practice

**Illustrative scenarios.** Specifics are illustrative, patterns repeat.

**A B2B software brand.** The beat is platform and regulation changes its buyers must respond to. Most days are no-post days, and the posts that do run become the most-cited pages on the site.

**A sports and fitness brand.** The beat is training research, event rule changes and kit technology. The rubric weights "changes what you do in your next training block" highest.

**A multi-language brand.** The desk writes the post once and produces each translation from it, with numbers, names and sources kept identical across languages.

## Templates

The skill ships `news-desk.example.json` (a filled-in config), `routine-prompt.md` (the scheduled-run prompt) and `check.mjs`, a quality gate driven by the config.

## Hand-off

- **seo-cluster-generator** when news keeps landing on a topic you have no pillar page for
- **social-content-factory** to cut each published post for your social channels
- **ai-studio-news-pipeline** for AI-model release posts written for LinkedIn
- **eval-gated-drafting** when the desk grows beyond one post a day
