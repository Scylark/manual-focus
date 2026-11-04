---
post: chatgpt-ads-returns-vs-google-search-study
title: "What the first ChatGPT ads returns study means for paid teams"
chapters:
  - title: "Cold open"
    at: "What's a click in ChatGPT actually worth"
  - title: "Who ran the study"
    at: "Who wrote it, and what did they look at"
  - title: "What a ChatGPT click returned"
    at: "So give me the number a head of paid search will care about"
  - title: "The parity price"
    at: "Which brings us to price"
  - title: "Hidden sales and scale"
    at: "The obvious pushback is that last click misses things"
  - title: "Organic ChatGPT referrals"
    at: "What about the brand and SEO side"
  - title: "Get AI on this"
    at: "Right, so what do you hand to AI"
  - title: "What the paper can't tell us"
    at: "What can't this paper tell us"
  - title: "The takeaway"
    at: "So the takeaway"
---

James and Hannah go through the first independent study of what ChatGPT ads
return. Maximilian Kaiser and Christian Schulze's working paper, dated October
2026, finds that in US traffic a paid ChatGPT visit earned $0.89 against $2.45
for a paid Google Search visit, which puts a ChatGPT click's parity price at
about $0.26. They cover how the study used OpenAI's country-by-country rollout,
why the largest advertiser makes the result look better rather than worse, what
it means for bids and budgets, why organic ChatGPT referrals still matter, and
three jobs to hand to AI before Black Friday.

## Get AI on this

Paste these into whichever AI assistant you use. Swap the bracketed parts for
your own details. The first and third need file uploads. The second needs an
assistant that can read files you share each week and run on a schedule.

### 1. Work out your ChatGPT parity price

```text
I run paid media for [brand], [one line on what you sell] at [website],
selling mainly in [market].

A working paper by Kaiser and Schulze (October 2026) defines the parity price
of a ChatGPT ads click as the price at which it returns as much revenue per
pound spent as a paid search click. The formula is: parity price = paid
search cost per click x (ChatGPT revenue per visit / paid search revenue per
visit).

Attached are:
- a paid search export by campaign for the last [8] weeks, with clicks, cost
  and conversion value
- a GA4 report for the same period with sessions and revenue for paid search
  and for paid ChatGPT traffic, broken down by landing page or campaign where
  possible

Work out revenue per visit for each channel, then the parity price overall
and for each campaign or product line where there is enough data.

Give me a table with the columns: Campaign or product line | Paid search
cost per click | Paid search revenue per visit | ChatGPT revenue per visit |
Parity price for a ChatGPT click | ChatGPT sessions in the period | Enough
data to trust? (yes or no, with the reason).

Below the table, give me one recommended bid ceiling for ChatGPT ads and say
how you got it. Flag any figure you had to estimate, any channel you couldn't
find in the data, and anything that looks mislabelled. Don't guess missing
numbers.
```

### 2. Keep paid ChatGPT out of the blended total

```text
Each [Monday] I'll share our GA4 channel report and our ChatGPT ads spend for
the previous week for [brand] at [website]. Run this as a weekly routine.

1. Pull paid ChatGPT traffic out as its own line, separate from organic
   ChatGPT referrals and from other paid channels. If you can't tell paid
   from organic ChatGPT traffic in the data, say so and stop.
2. Report sessions, purchases, revenue, spend and cost per purchase for paid
   ChatGPT, with the same figures for paid search alongside.
3. Compare this week's actual cost per click with our parity price of
   [parity price from job 1].

Output: a short table with the columns Channel | Sessions | Purchases |
Revenue | Spend | Cost per purchase, then three bullet points on what moved
since last week.

Add a clear warning at the top if ChatGPT spend rose while purchases stayed
at zero, or if the cost per click is above the parity price. Say which
numbers you couldn't check.
```

### 3. Draft a holdout test for ChatGPT ads

```text
We buy ChatGPT ads for [brand] in [market] and want to know whether they add
sales we wouldn't get anyway, before we spend more.

Attached are:
- weekly sales by region for the last 6 months
- our ChatGPT ads spend by region for the same period, if we have it

Propose a four-week geo holdout. Pick a set of regions where we pause
ChatGPT ads and a matched set where they keep running, matched on past sales
level and trend.

Give me:
- a table with the columns Region | Group (pause or keep) | Average weekly
  sales | Trend over 6 months
- the success threshold you'd suggest (the difference in total sales between
  the groups that would justify keeping or scaling spend), with your reasoning
- the risks to the test, such as seasonality, promotions or too few regions

Don't make the decision to pause. Write it as a proposal for me to agree with
finance. Tell me where the data is too thin for a clean test, and don't fill
gaps with assumptions.
```
