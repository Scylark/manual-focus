---
title: "Site audit and refresh"
stack: ops
description: "Audit a marketing site for consistency, messaging and freshness, retest every prompt it publishes, fix what has one right answer and ship it through reviewed pull requests."
outputs: "Audit findings, research brief, retest logs, fixed and verified site, owner decision list"
readMin: 8
shipTime: "2 working days"
brandStage: ["growth", "scale", "enterprise"]
channels: ["web", "content", "brand"]
models: ["claude-5.5-opus"]
publishedAt: 2026-09-25
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five things.

1. An **audit of the whole site**, ranked High, Medium and Low, with a file and line for every finding.
2. A **research brief** on what has changed in your field since the content was last updated, with a primary source for every fact you use.
3. **Retest logs** for every prompt, playbook or calculator the site publishes, each scored against its own quality gates.
4. A **corrected, verified site**, shipped through pull requests and checked on the live URL.
5. A **short list of decisions** only the owner can make, each with a recommendation.

## Who this is for

A growth or scale-stage brand whose site has grown past what one person can hold in their head: dozens of pages, a resource library, a blog, maybe some tools or downloadable prompts. It suits a marketing lead who works with an AI coding agent (Claude Code, or Cowork with the repo connected) and can approve pull requests. If your site is five pages, read it yourself.

## Before you start

- [ ] The site in a git repo you can branch, with a build command that works locally
- [ ] The paired `site-audit-and-refresh` skill from The Lens plugin installed
- [ ] One sentence that says who the site is for. Every messaging finding is judged against it
- [ ] Your design rules written down: what's approved, what nobody touches without sign-off
- [ ] An agent that can run subagents in parallel (Claude Code does), a browser it can drive, and headless Chrome for screenshots
- [ ] Someone who can say yes or no to a pull request the same day

## The pipeline

Eight phases. Phases 2, 3 and 5 fan out to parallel subagents, which is where the time saving comes from.

### Phase 1, render and inventory

Build the site and extract the visible text of every page, so the audit reads what visitors see, not the templates. The skill ships `extract_text.py` for this. Then grep source and rendered text for every number the site states about itself, every product and offer name, every external link and its status code, every dated reference and every contact address. Counts that drift between pages are the most common finding, and grep catches them in seconds.

### Phase 2, audit in parallel

Split the site into slices and give each to a read-only subagent.

```text
Read-only audit, do not edit files. Repo: <path>. Plain-text renders
of every page are in <scratch>/text/. Sources are in <paths>.

Facts already known (don't re-report): <list>.

Audit for, and report with file:line references:
A. Numbers and facts that disagree across pages (counts, years,
   prices, timeframes, install steps, version numbers, broken links).
B. Naming inconsistencies (product, offer and brand names).
C. Stale references: named versions, renamed or retired tools,
   claims pinned to dates that have passed.
D. Messaging: unclear or contradictory audience, unsupported
   statistics, currency and spelling that don't fit the market,
   AI-writing tics.
E. Anything else a careful editor would flag.

Return a prioritised list (High / Medium / Low): file:line, the
issue, a suggested fix.
```

### Phase 3, research what changed

If the site covers a fast-moving field, commission a dated research brief for the period since the last update. Ask for a date and a primary-source URL on every item, and for each claim to be marked verified or unverified. Then open the primary source yourself for every fact that will go on the site. A research summary is a lead, not a source.

### Phase 4, fix the unambiguous

Fix everything that has one right answer: broken links, wrong counts, contradictory figures, stale facts, spelling drift, instructions that no longer match a vendor's docs. Replace pinned model versions in instructions with tiers ("a frontier model", "a fast mid-tier model") so they don't go stale next month. Anything about positioning, audience, pricing, claims or design goes on the decision list with a recommendation instead.

### Phase 5, retest executable content

Give each section of your library to a subagent with this brief.

```text
You are retesting the prompts in <section> against the current model.

For EACH item:
1. Read it fully. List its prompts and its quality gates.
2. Run every prompt at least once on realistic input: the item's own
   worked example, real public material fetched live, or clearly
   labelled synthetic data. Never touch real accounts.
3. Score each gate PASS / FAIL / NOT TESTABLE with one line of
   evidence. Compute every number with a script, not by estimate.
4. Flag stale references and worked examples that break the item's
   own rules.
5. Verdict: PASS, PASS-WITH-NOTES (exact old -> new edits) or FAIL.

Don't edit content. Write one results file per section.
```

Then have each subagent apply its own edits. For every FAIL, fix it and re-run the gate: a planted bad input must now fail and a clean one must still pass. Only then mark the item as tested on the current model.

### Phase 6, verify in a real browser

Load every changed page. Reproduce visual bugs in headless Chrome before fixing them, then test candidate CSS overrides one at a time until one works. Measure text that "disappears" (opacity, then contrast, where WCAG AA needs 4.5:1). Probe forms with an empty submission to see what the endpoint returns, and make sure the page reports real failures. Leave the real end-to-end signup to the owner.

### Phase 7, ship through pull requests

One pull request per coherent batch, saying what was verified and what wasn't. The owner approves each merge, and approval for one batch doesn't cover the next. After merging, watch the deploy and confirm the change on the live URL.

### Phase 8, report and remember

Lead with what's live, then what was tested and on what, then the owner's decisions. Save the preferences the owner states along the way ("keep the scroll effect", "that address doesn't work") so the next run starts from them.

## Worked example, end-to-end

This is the run on manual-focus.co.uk in September 2026 that the playbook is built from. The numbers come from the retest logs published in the repo.

**Phase 1 and 2 output.** Two parallel audits over 114 rendered pages. High-priority findings included GitHub links to a `main` branch that didn't exist (every one returned a 404), a Cowork primer describing Cowork as part of Claude Code, four different install commands across pages, and skill counts from three releases ago still live.

**Phase 3 output.** A research brief covering June to September 2026. Spot-checks against primary sources corrected three details before anything shipped: who a product's beta was open to, which company had been renamed, and a legal duty that applied to AI providers rather than the brands using them.

**Phase 4 output.** The capability reference was rewritten for the quarter with a source on every claim. Playbook prerequisites moved from pinned model versions to tiers. The FAQ gained the fourth way to work with the agency that it had been missing.

**Phase 5 output.** 46 playbooks retested on Claude Opus 5.5. Three failed as written and 43 passed with notes. None passed untouched. The three failures were a paid-search agent whose field direction was ambiguous enough to bid backwards, a CI guardrail example that passed every pull request because it checked nothing, and a drafting pipeline whose fact gate passed an invented statistic. All three were fixed and re-run until the gates caught what they exist to catch. The run also found invented results attributed to real athletes in one worked example, which were replaced with fictional names, and a HeyGen integration on an API version due to retire five weeks later.

**Phase 6 output.** The newsletter form turned out to post blind and tell every visitor "you're in", so it was changed to read the provider's response. A ghost shape over the first letter of the homepage headline was reproduced in headless Chrome and traced to a duplicated gradient. A line of text that only showed when highlighted measured 2.2:1 contrast. Fixing the grey behind it brought 57 uses across the site up to AA, after sign-off.

**Phase 7 and 8 output.** Four pull requests merged and deployed, each confirmed on the live site. The owner's decision list shrank to one parked item (long-page navigation), and the owner's preference to keep the scroll-pinned effects was saved for next time.

## Try it yourself

### Exercise 1, the count test

Pick the three numbers your site states most often about itself (years in business, clients, products, team size). Grep for each, and its spelled-out form, across the repo. If any returns two values, you have your first finding.

### Exercise 2, one retest

Take one prompt your site publishes. Run it on its own example and check the output against whatever the page promises. If the page promises nothing checkable, that's a finding too.

### Exercise 3, the signup probe

Submit your newsletter form with an invalid address and watch the network response. If the page says "thanks" while the response says "failed", you're losing subscribers silently.

## The eval gates

- **Eval 1, nothing unsourced added.** Every new fact on the site traces to a primary page opened during the run.
- **Eval 2, counts agree.** Each self-stated number returns one value across source and rendered output.
- **Eval 3, links resolve.** Every changed external link returns 200.
- **Eval 4, proven fixes.** Every FAIL from Phase 5 has a re-run showing the fix works.
- **Eval 5, honest "tested on".** No item claims testing that didn't happen, and what couldn't be tested is written down.
- **Eval 6, verified live.** Each merged change is confirmed on the production URL.

## The failure modes

**Scope creep into design.** A contrast fix becomes a redesign. Fix the specific bug and put the rest on the decision list.

**Trusting the summary.** A subagent reports a fact as verified and it ships without anyone opening the source. Open it.

**Retest theatre.** The prompts ran, so the item "passed". Without gate scores, or when the answer key and the output came from the same model, say so in the log.

**Stale branch.** Scheduled content jobs publish while you work, and a long-lived branch overwrites them. Merge the main branch in before editing and again before each pull request.

**Counting drift.** You add or remove an item and miss one page that states the total. Grep for the number and its spelled-out form.

**Silent success.** A form handler can't read the response and thanks everyone. Test the failure path, not only the happy one.

## The pattern in practice

**Illustrative scenarios.** Specifics are illustrative, patterns repeat.

**A resource-heavy B2B site.** Two hundred articles and a template library. Most of the value is in Phases 1 and 2: counts, dead links and superseded product names. Phase 5 is small because little is executable.

**An AI tools directory.** Every page names models and prices, so Phase 3 does the heavy lifting and Phase 4 moves pages to tier language so they last longer between audits.

**A brand with an interactive calculator.** Phase 5 retests the calculator against hand-computed cases, and the arithmetic in the worked example is usually where the first bug is.

## Templates

The skill ships three helper scripts: `extract_text.py` (visible text per page), `render.mjs` (a headless Chrome screenshot of any element, with an option to inject CSS first) and `contrast.py` (WCAG contrast ratios). The published retest logs for this site's own run live in `lens-skills/_test-runs/` in the repo.

## Hand-off

- **positioning-audit-pipeline** when messaging findings point at a positioning problem rather than a copy problem
- **brand-voice-extraction** when tone drifts from page to page
- **seo-cluster-generator** when the research surfaces topics the site should cover
- **ai-studio-news-pipeline** to keep AI coverage current between audits
- **brief-to-ship-pipeline** to run the owner's decision list as briefs
