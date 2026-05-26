---
title: "Quarterly planning ritual for AI-leveraged marketing"
stack: ops
description: "A repeatable 5-day ritual that converts last quarter's learning into next quarter's bets. Built for marketing functions that ship faster than the calendar."
outputs: "Quarterly plan, the 7 bets, the 3 retires, the metric story"
readMin: 9
shipTime: "5 working days"
brandStage: ["growth", "scale", "enterprise"]
channels: ["analytics", "brand"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-05-30
status: live
preview: false
---

## The brief

Quarterly planning meetings exist somewhere on a spectrum from "off-site, full week, expensive" to "Friday afternoon Slack chat." Neither extreme works for an AI-leveraged team. The full off-site loses two weeks of shipping. The Slack chat doesn't surface what's actually working or dying.

This playbook installs the middle path. A 5-day ritual, with structure, that produces a defensible quarterly plan. 7 bets the function will make, 3 things being retired, and the metric story that lets the team explain to the rest of the business what marketing is actually doing and why.

## The pipeline (a 5-day ritual)

**Day 1, data and learning extraction.** Pull the last quarter's brief log (from the brief-to-ship playbook). For each completed brief, the metric that was supposed to move and whether it did. Group by pipeline. The output is a one-page "what worked and what didn't" by pipeline category.

**Day 2, bet shortlist.** Generate 15-20 candidate bets for next quarter. Sources include continuations of what worked, new applications of pipelines that proved themselves, retires of pipelines that didn't, and strategic bets from the leadership team. The model is good at proposing variants, and humans pick which to develop.

**Day 3, forced trade-off.** Rank candidates against capacity. A function with 6 people can run around 7 substantial bets a quarter at most. Pick 7, defend each. Forced trade-off, where every chosen bet displaces one that didn't make the cut, and the displaced ones are named. The discipline is in publishing what you decided not to do.

**Day 4, metric story drafting.** The function's executive owner drafts a one-page narrative for the rest of the business. What shipped, what worked, what we learned, what we're doing next. The narrative is for non-marketers, the finance team, product, and ops. Outputs an artefact for the next board meeting and the next all-hands.

**Day 5, lock and brief.** The 7 bets get translated into 7 first-draft briefs (using the brief-to-ship template). The 3 retires get documented. The metric story gets reviewed by the function head and sent. The team comes back Monday with the next quarter already in motion.

## The eval gates

**Eval 1, bet displacement clarity.** For each of the 7 chosen bets, the displaced alternative should be named. If the team can't say "we chose A over B," they don't really know what trade-off was made.

**Eval 2, retire honesty.** At least 2 retires per quarter. Functions that never retire a pipeline are accumulating cruft. If the team can't name 2 things to retire, run the eval-of-pipelines exercise, because there are retires hiding in the data.

**Eval 3, metric-story falsifiability.** The metric story should make claims that could be wrong. "Marketing drove growth" isn't falsifiable. "Paid-social contribution rose because the channel-mix simulator recommended a 22% increase, which produced a 19% lift in conversions" is.

## The failure modes

**Bet count creeps.** Every quarter the team finds reasons to commit to 9, 10, 11 bets instead of 7. Capacity doesn't change, and quality of execution drops. Hold 7 as a hard limit. Exceptions require dropping something already committed.

**Retires get postponed.** Teams know which pipelines are mediocre but resist retiring them because someone built them and it'll feel bad. Make retiring a public, celebrated act, where the function lead publicly thanks the team for shipping the work even though it's being retired. Removes the shame.

**Metric story becomes marketing of marketing.** The metric story should be useful to non-marketers. If it's full of acronyms, channel names and platform-specific metrics, rewrite. The story is for the CFO and the COO, rather than for other marketers.

**Planning ritual gets compressed.** "Let's just do days 1-3, we can skip 4 and 5." This usually means no metric story gets written and the briefs don't actually start, so the function lurches into Q+1 with no clear shape. Hold the 5 days. The ritual produces compounding value across quarters when respected.

**The ritual replaces the work.** Some functions over-plan and under-ship. The ritual is bounded to 5 days because more would crowd out the actual work. If a team is spending 2 weeks on quarterly planning, the planning has become the product. Cut it.

## The pattern in practice

Illustrative scenarios that show common shapes the quarterly planning ritual takes. Specifics are illustrative and the patterns repeat.

**B2B SaaS, scale-stage, the data-led discipline.** A function doing planning as a 3-day off-site, light on data, heavy on argument. Installing the 5-day ritual with the data-extraction front-loaded typically lifts the function's bet-success rate (briefs whose target metric actually moved) materially over two quarters. Partly because the trade-off discipline keeps the team focused, partly because the retires clear capacity for the bets that mattered.

**D2C, growth-stage, the metric-story unlock.** A function planning by reaction, whatever's urgent that week. The ritual gives the function a quarterly shape for the first time. The metric story drafted in Day 4 goes to the board in the next meeting and changes how non-marketing leadership talks about the function's work. The brand had been under-crediting marketing because nobody was writing the story. Once it gets written, the budget conversation goes differently.
