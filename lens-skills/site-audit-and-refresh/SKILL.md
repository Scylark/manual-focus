---
name: site-audit-and-refresh
description: "When the user wants to audit a marketing website end to end for consistency and messaging, bring its AI or industry content up to date, retest the prompts or playbooks it publishes, and ship the fixes. Triggers on 'audit the site', 'check the site for consistency', 'review our messaging', 'make the content more up to date', 'refresh the site for recent trends', 'retest the playbooks', 'is anything on the site stale or broken', or 'audit and deploy'. Works on any static or framework site in a git repo (Astro, Next, Hugo, Eleventy, WordPress export)."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/ops/site-audit-and-refresh
---

# Site audit and refresh

You audit a marketing website for consistency, messaging and freshness, retest anything executable it publishes (prompts, playbooks, calculators, templates), fix what has one right answer, queue what needs the owner's judgement, verify every change in a real browser and ship through pull requests. The output is a live, corrected site plus a short list of decisions only the owner can make.

The job runs in eight phases. Phases 2, 3 and 5 fan out to parallel subagents when the tooling allows it.

## Ground rules (these override speed)

1. **Fix facts, queue judgement.** Broken links, wrong counts, contradictory figures, stale facts, spelling drift and bugs are yours to fix. Positioning, audience, pricing, claims about results, design and anything visual belong to the owner. List them as decisions with a recommendation.
2. **No design changes without sign-off.** Colour, type, layout, animation and scroll behaviour are the owner's call, even when the change is small or clearly better. Look for recorded preferences first (project CLAUDE.md, memory files, recent "revert" commits) and follow them. If the owner likes an effect, tune it rather than remove it.
3. **Every new fact has a source you opened this session.** Research from memory or from a subagent's summary isn't a source. Open the primary page (the company's own announcement, docs or filing) before a claim goes on the site. What you can't verify, you cut or label as unverified.
4. **Never invent experience or evidence.** No "we tested", no invented clients, results, quotes or citations. Never attach invented results to a real, named person or company. Use clearly fictional names in worked examples.
5. **"Tested on" means tested.** Only mark content as tested on a model, browser or version when you ran it there in this session and it passed. Say plainly what you could not test (other vendors' models, live accounts, real customer data).
6. **Counting and maths go in code.** Word counts, scores, correlations, contrast ratios, sample sizes and dates are computed with a script, never estimated by the model. Retests in this workflow repeatedly found model-computed numbers wrong.
7. **No real accounts in retests.** Inbox, calendar, CRM and ad-account workflows are tested on labelled synthetic data. Never read, send or change anything in a real account.
8. **Nothing goes live without the owner.** Work on a branch, open a pull request per coherent batch, and merge or deploy only when the owner says so in this conversation. Approval for one batch doesn't cover the next.

## Inputs to gather first

1. **Repo and branch.** Confirm you are on a feature branch or worktree, and bring it up to date with the main branch before editing. Sites with scheduled content jobs move fast.
2. **Build and preview commands** and the output directory (`dist/`, `out/`, `public/`, `_site/`).
3. **How it deploys.** Read the CI config. Usually a push to the main branch deploys.
4. **Audience statement.** Ask the owner for the one line that describes who the site is for, if it isn't obvious. Every messaging finding is judged against it.
5. **Recorded preferences.** Design sign-off rules, approved looks, banned words, house style (UK or US spelling, punctuation rules).
6. **What's executable.** Prompts, playbooks, skills, calculators, forms, downloads, newsletter signups.

## Phase 1, render and inventory

Build the site and extract the visible text of every page, so the audit reads what visitors read, not what the templates say.

```bash
<build command>
python3 scripts/extract_text.py <output-dir> <scratch>/text
```

Then build an inventory by grep over source and rendered text:
- every number the site states about itself (counts of items, years of experience, prices, timeframes, versions)
- every product, offer and brand name and how each is spelled
- every external link, with its HTTP status (`curl -s -o /dev/null -w '%{http_code}'`)
- every dated or versioned reference (model names, "this year", "next quarter", "last updated")
- every contact address and form endpoint

## Phase 2, audit in parallel

Split the audit across subagents so each reads a manageable slice (core pages, hub pages, articles, long-form content). Give each the facts you already know so they don't re-report them, and ask for file:line references, a High / Medium / Low ranking and a suggested fix. Read-only.

Check for:
- **Consistency.** The same number stated differently on two pages. Offer counts that disagree ("three ways to work with us" when there are four). Install commands or instructions that differ between pages. Version numbers that disagree between a manifest and a page.
- **Broken or wrong.** Links to branches, pages or files that don't exist. Instructions for third-party products that no longer match their docs (verify against the vendor's own documentation).
- **Messaging.** Is the audience clear and the same everywhere? Currency and spelling that fit the market. Unsupported statistics and "most chosen" style claims. Beginner framing on pages that say they're for senior readers. AI-writing tics.
- **Staleness.** Named model versions, tools that were renamed or shut down, claims pinned to dates that have passed, "updated quarterly" pages that missed their review.

## Phase 3, research what changed

When the site covers a fast-moving field (AI, platforms, regulation), commission a research brief for the period since the content was last updated. Ask for dates and primary-source URLs on every item, and for claims to be marked verified or unverified.

Before any of it goes on the site, open the primary source yourself for each fact you'll use (rule 3). Research agents get details wrong in both directions. In the run this skill is based on, spot-checks corrected who a product's beta was open to, which company had been renamed, and a legal duty that applied to AI providers, not to the brands using them.

## Phase 4, fix the unambiguous, queue the rest

Make the fixes that have one right answer (rule 1). For each, prefer the smallest change that makes the site true and consistent:
- Replace pinned versions in instructions with tiers ("a frontier model", "a fast mid-tier model") so they don't go stale next month.
- Give a "last updated" page a real update, with what changed and the sources, rather than just a new date.
- Remove or fix unsourced statistics, or reword them to what the evidence supports ("in our engagements", with a caveat).
- Link sources inline on articles that cite numbers.

Commit in coherent batches with messages that say why. Keep a running list of decisions for the owner, each with your recommendation.

## Phase 5, retest executable content

For every published prompt, playbook or skill, run it and check it against its own quality gates. Fan out one subagent per section.

Brief each subagent to:
1. Read the item fully and list its prompts and its gates (evals, checks, failure modes).
2. Run every prompt at least once on realistic input: the item's own worked example, real public material fetched live, or clearly labelled synthetic data. No real accounts (rule 7).
3. Score each gate PASS / FAIL / NOT TESTABLE with one line of evidence. Compute all numbers in code (rule 6).
4. Flag stale references, internal contradictions between the item and its paired skill or template, and worked examples that break the item's own rules.
5. Give a verdict: PASS, PASS-WITH-NOTES (exact old → new edits) or FAIL (what breaks).
6. Write a results file to the repo's test-run folder. Don't edit content yet.

Then have each subagent apply its own edits, because it has the context. For anything that failed, fix it and **re-run the failed gate to prove the fix** (a planted bad input must now fail, a clean one must still pass). Only then mark the item as tested on the current model (rule 5), and add an "Applied" section to the results file.

Typical findings to expect:
- quality gates that pass the exact failure they exist to catch (an invented statistic, a misquoted study)
- worked examples whose arithmetic is wrong or that break the item's own rules
- real people or companies given invented results
- privacy leaks in defaults (a meeting pack delivered where external attendees can read it)
- CI or automation examples that pass everything because they check nothing
- third-party API versions due to retire

## Phase 6, verify in a real browser

The build passing isn't verification. For every visible change:
- Load the page in a browser and check the text, links and console.
- For visual bugs, reproduce first. Render with headless Chrome (`scripts/render.mjs`), find the cause by testing candidate CSS overrides one at a time, then confirm the fix at desktop, laptop and phone widths.
- For text that "disappears", measure it: computed opacity, then contrast (`scripts/contrast.py`). WCAG AA is 4.5:1 for body text.
- For forms and signups, probe the endpoint with no personal data (an empty submission) to see what it returns, and make sure the page reports real failures instead of assuming success. Test success and failure paths by mocking the response in the browser. Leave the real end-to-end signup to the owner.
- Check external links you changed return 200.

## Phase 7, ship

For each batch: push the branch, open a pull request (summary, what was verified, what wasn't), and stop. Merge only on the owner's explicit go-ahead (rule 8). After merging, watch the deploy to completion, then confirm the change on the live site. Fetch the page and grep for the new text or CSS, allowing for CDN caching.

## Phase 8, report

Lead with what's live. Then:
- what changed, grouped by why it mattered (broken, inconsistent, stale, risky)
- what was tested and on what, and what couldn't be
- decisions for the owner, each with a recommendation
- follow-ups you noticed but didn't do

Save durable preferences the owner states along the way ("keep the scroll effect", "this address doesn't work") wherever the project keeps memory.

## Eval gates

- **S1, nothing unsourced added.** Every new fact on the site traces to a primary page opened this session.
- **S2, counts agree.** A grep for each self-stated number returns one value across source and rendered output.
- **S3, links resolve.** Every changed external link returns 200. Internal links resolve against the build output.
- **S4, proven fixes.** Every FAIL from Phase 5 has a re-run showing the fix works.
- **S5, honest "tested on".** No item claims testing that didn't happen.
- **S6, verified live.** Each merged change is confirmed on the production URL.

## Failure modes

- **Scope creep into design.** A contrast fix turns into a redesign. Fix the specific bug and propose the rest.
- **Trusting the summary.** A subagent says a fact is verified and it goes live without anyone opening the source. Open it.
- **Retest theatre.** Declaring a pass because the prompts ran, without scoring the gates, or when the answer key and the output came from the same model. Say so when that's the case.
- **Stale branch.** Editing on a branch behind main, then clobbering content the scheduled jobs published. Merge main in first and again before each PR.
- **Silent success.** A form handler that can't read the response and tells every visitor "you're in".
- **Counting drift.** Removing or adding an item and missing one of the pages that states the total. Grep for the number and its spelled-out form.

## Helper scripts

- `scripts/extract_text.py <build-dir> <out-dir>`: visible text per page, nav, footer, scripts and SVG stripped.
- `scripts/render.mjs <url> <out.png> [width height dpr] [selector]`: headless Chrome screenshot of one element via the DevTools protocol. No npm dependencies. Set `PRE` to a JS expression to run before the capture (for example, to inject a CSS override).
- `scripts/contrast.py <fg> <bg> [...]`: WCAG contrast ratios for hex colour pairs.

## Hand-off

- **positioning-audit** when the messaging findings point at a positioning problem rather than a copy problem
- **brand-voice-extraction** when tone drifts across pages
- **seo-cluster-generator** when the refresh surfaces topics the site should cover
- **ai-studio-news-watch** to keep AI coverage fresh between audits
