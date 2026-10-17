---
title: "What Google Ads channel prioritisation means for paid teams"
date: 2026-10-15
tags: ["ai-briefing", "ai", "go-to-market"]
description: "Google Ads added channel prioritisation and budget allocation on 14 October 2026. Search campaigns using Display change in February 2027, so audit them now."
podcast:
  audio: "https://manual-focus-podcast.manual-focus.workers.dev/episodes/google-ads-channel-prioritisation-paid-teams-20261017223600.mp3"
  duration: 456
  bytes: 5475101
  published: 2026-10-15
faq:
  - question: "What is channel prioritisation in Google Ads?"
    answer: "Channel prioritisation is an optional Google Ads setting announced on 14 October 2026. Advertisers mark channels such as Google Search, search partners and the Google Display Network as high or low priority. Google AI spends on high priority channels first, within any Target CPA or Target ROAS goal, and sends remaining budget to low priority channels. All channels start as high priority."
  - question: "How does budget allocation work in Google Ads?"
    answer: "Budget allocation lets an advertiser cap spend on a low priority channel at a percentage of the campaign's average daily budget. Google's example is a 5% allocation on a $1,000 daily budget, which aims to keep that channel at or below $50 a day. Google applies it on a best-effort basis, it resets daily and a 0% allocation stops spend on that channel."
  - question: "What changes for Google Ads Search campaigns using Display in February 2027?"
    answer: "From February 2027, Google Ads Search campaigns with Display Expansion enabled move automatically to channel prioritisation and budget allocation, and Google says the current spend allocation setup will go away. To keep today's behaviour, Google advises setting the Google Display Network to low priority with a 50% daily budget allocation. Display will also stop serving on Search campaigns that use Target Impression Share."
  - question: "Can you set Google Ads channel prioritisation from a manager account?"
    answer: "No. Google's help page says channel prioritisation can't be set from a manager account, so agencies and in-house teams running several accounts must set it in each client account or campaign. It is available in Google Ads and Search Ads 360, and Google says Google Ads API and Google Ads Editor support is coming soon."
sources:
  - title: "Guide your campaign spending with new priority and allocation features"
    url: "https://blog.google/products/ads-commerce/channel-prioritization-budget-allocation/"
    publisher: "Google"
  - title: "About channel prioritization and budget allocation"
    url: "https://support.google.com/google-ads/answer/18385152?hl=en"
    publisher: "Google Ads Help"
  - title: "New Google Ads Controls, Channel Prioritization and Budget Allocation"
    url: "https://www.seroundtable.com/google-ads-channel-prioritization-budget-allocation-42297.html"
    publisher: "Search Engine Roundtable"
  - title: "Google Ads lets advertisers cap Display spend, on a best-effort basis"
    url: "https://ppc.land/google-ads-lets-advertisers-cap-display-spend-on-a-best-effort-basis"
    publisher: "PPC Land"
---

Google Ads announced channel prioritisation and budget allocation on 14 October 2026, two optional settings that let advertisers rank Search partners, the Display Network and other channels and cap low priority spend as a daily percentage. Search campaigns running on Display move to the new system in February 2027, so every paid search account has a deadline.

## Key takeaways

- Google Ads announced channel prioritisation and budget allocation on 14 October 2026, rolling out over the following months to Search, Shopping, Performance Max and Demand Gen.
- Google AI funds high priority channels first, up to any Target CPA or Target ROAS goal, then spends what is left on low priority channels.
- A budget allocation caps a low priority channel at a share of average daily budget, so 5% of $1,000 aims for $50 a day or less, on a best-effort basis.
- From February 2027, Search campaigns with Display Expansion enabled migrate automatically, and Google says a 50% Display allocation keeps today's behaviour.
- The settings can't be applied from a manager account, and Google Ads API and Editor support is still to come.

## What Google added to Google Ads

Tal Akabas, a director of product management at Google Ads, [announced the two controls](https://blog.google/products/ads-commerce/channel-prioritization-budget-allocation/) under the line "Say goodbye to all-or-nothing channel targeting". Until now a Search campaign either served on search partners and Display or it didn't. Now an advertiser can keep a channel switched on at low priority, so Google AI spends there only after high priority channels have had what they can use at the target.

Budget allocation adds a ceiling. For a low priority channel you enter a percentage of the campaign's average daily budget, and Google aims to stay under it. The [help page](https://support.google.com/google-ads/answer/18385152?hl=en) says the allocation resets each day, unspent or overspent amounts don't carry over, and a 0% allocation stops spend on that channel. Settings work at account level, at campaign level and on shared budgets where every campaign is the same type, through a "Channel Prioritization" card in account or campaign settings. Search Engine Roundtable [reported](https://www.seroundtable.com/google-ads-channel-prioritization-budget-allocation-42297.html) that an alpha of the feature surfaced in August.

## Which campaigns get which control?

| Campaign type | Channels you can rank | Budget allocation |
|---|---|---|
| Search | Google Search, search partners, Google Display Network | Yes |
| Shopping | Google Search, search partners | Yes |
| Performance Max | Google channels as one group, search partners, Google Display Network | Yes |
| Demand Gen | Google channels as one group, Google Display Network | No |

In Performance Max and Demand Gen, Google treats Search, YouTube, Maps, Gmail and Discover as one block called Google channels. In Performance Max you can push Display and search partners below that block, in Demand Gen only Display, and in neither can you rank YouTube above Search.

## Does prioritisation change spend at all?

Only on campaigns that run out of budget. Google's help page says prioritisation "has no effect" when a campaign isn't limited by budget, because a campaign with spare budget funds every channel that converts at the target anyway. Allocation still applies to those campaigns, and Google's blog says it matters most for Target CPA and Target ROAS campaigns that aren't budget-limited.

For a head of paid search that settles which lever to pull. On a budget-limited Search campaign, ranking search partners low protects Google Search volume. On a campaign with headroom, only a percentage cap moves the money.

Our view at Manual Focus is that most brands should replace their search partner and Display opt-outs with a low priority setting and a small allocation, because a capped test produces evidence and an opt-out produces none. Google's own announcement addresses marketers who have "historically opted out" of search partners and Display, and until now those teams had no way to try either network at a controlled cost. A 5% cap gives them a test they can read after a month.

For cycling and endurance retailers the window to try this is before Black Friday and the spring riding season, when Search budgets run tightest and every click on Google Search counts. A shop that has always excluded Display or search partners could set one of them to low priority with a 5% cap on a budget-limited bikes or kit campaign in late October, so it has four weeks of evidence before peak spend begins. If the test earns its place the cap can rise for the sales period, and if it doesn't the retailer has lost very little and gained a clear answer.

Google AI still chooses bids and placements, and the team now chooses the order it spends in and the limit on each channel, which is the split of work we argued for in [Paid channels in the AI era](/blog/paid-channels-bidding-agents/). A margin-aware approach like our [paid-search bidding agent playbook](/lens/demand/paid-search-bidding-agent/) can then feed the targets that high priority channels are funded up to.

## What happens to Display in February?

From February 2027, every Search campaign with Display Expansion enabled migrates automatically, and Google's blog says the current spend allocation setup "will go away". Advertisers may see spend shift between channels as a result. Google's advice for keeping things as they are is to set the Google Display Network to low priority with a 50% daily budget allocation.

There is a second change in the same paragraph of the help page. Display will no longer serve on Search campaigns that use the Target Impression Share bid strategy, so brand campaigns built on impression share lose their Display reach whatever setting you choose.

| If your Search campaign... | Then before February 2027 |
|---|---|
| Uses Display and you want it unchanged | Set Display to low priority with a 50% allocation |
| Uses Display and you doubt its value | Set Display to low priority with 5% to 10% and compare results |
| Has Display switched off | Nothing changes, but consider a small low priority test |
| Uses Target Impression Share | Plan for Display to stop serving on it |

## What to do before February 2027

1. **List every Search campaign with Display on.** Export bid strategy and budget status alongside it, so you know which campaigns migrate and which use Target Impression Share.
2. **Choose the Display setting on purpose.** Use the 50% allocation where Display earns its place, and a lower cap where nobody has checked. Annotate the date you change it, so any shift in results has a cause on record.
3. **Turn one opt-out into a capped test.** Pick a budget-limited campaign that excludes search partners, set them to low priority at 5%, and judge the result on cost per acquisition and new customer share after four weeks. Our [attribution tear-down](/lens/demand/attribution-teardown/) covers how to read a channel's results against platform claims.
4. **Plan account-by-account work.** Manager accounts can't apply these settings and the API and Editor can't yet, so agencies and multi-brand teams need time for each account.
5. **Bring the caps into budget planning.** Percentages per channel are budget decisions, so put them in the same sheet as your quarterly mix. The [channel-mix simulator](/lens/demand/channel-mix-simulator/) shows how to model diminishing returns by channel before you set them.

## What Google hasn't said yet

Google calls the allocation best-effort, so spend can exceed the cap on a given day, and the help page doesn't say by how much. The help page also doesn't describe channel-level reporting, which you need to judge a low priority test. Rollout runs "over the next months", with Demand Gen later and availability varying by account, so some teams will wait. Google hasn't said whether a low priority channel gets lower-quality inventory or only less budget, and it gave no performance data for the new settings. Treat Google's own framing, that the controls help marketers "confidently spend as the holidays approach", as a reason to test before peak trading rather than proof the settings work.

## Further reading

- [Paid channels in the AI era](/blog/paid-channels-bidding-agents/), on which decisions paid teams keep when platforms bid for them
- [Paid-search bidding agent](/lens/demand/paid-search-bidding-agent/), a playbook for setting targets by margin instead of revenue
- [Attribution tear-down](/lens/demand/attribution-teardown/), for checking whether a channel's results hold up
- [What ChatGPT's new ad measurement tools mean for paid teams](/blog/chatgpt-ads-measurement-visual-ads/), on judging a new channel with incrementality tests
- [How to evaluate AI tools without falling for the demo](/blog/evaluating-ai-tools-without-falling-for-the-demo/)

Our [services page](/services/) sets out how we help paid teams plan channel tests.
