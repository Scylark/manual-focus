---
post: adobe-ai-shopping-forecast-black-friday
title: "What Adobe's AI shopping forecast means for Black Friday"
---

James and Hannah talk through Adobe's holiday forecast of 28 September 2026,
which expects clicks from AI services to US retail sites to rise 130% year on
year over November and December, with Thanksgiving up 159%, Black Friday 95%
and Cyber Monday 88%. They cover what Adobe counts as AI traffic, how much
weight to put on its survey, why a US forecast should still change a UK peak
trading plan, and three jobs to hand to AI before Black Friday on 27 November.

## Get AI on this

Paste these into whichever AI assistant you use: ChatGPT, Claude, Gemini or
Copilot. Swap the bracketed parts for your own details. The first two need
file uploads, and the first should be set to run monthly on an assistant that
can work on a schedule. The third needs an assistant that can browse the web.

### 1. Build the AI referral channel and baseline

```text
I run ecommerce marketing for [brand], [one line on what you sell] at
[website], selling mainly in [market].

I want to treat traffic from AI assistants as a named channel in our peak
trading report, with a pre-peak baseline from September and October.

Attached is a referral export from our analytics for [date range], with
referrer domain, sessions, conversions and revenue by week.

1. Pick out every referral from an AI assistant, including chatgpt.com,
   perplexity.ai, gemini.google.com and copilot.microsoft.com, and any
   other referrer you're confident is an AI assistant.
2. Give me a weekly baseline table with the columns: Week | AI referral
   sessions | Conversions | Revenue | Share of all sessions.
3. Write a single matching rule (a regular expression on referrer domain)
   my analytics team can use to set up a custom channel group.
4. List any referrer domains you think might be AI assistants but aren't
   sure about, so I can check them.

Use only the numbers in the export. If a figure isn't there, write "not in
data". Note that this counts visits only; it can't capture purchases an AI
answer shaped without a click.

Then set this up as a routine that runs on the first Monday of each month.
Each time, I'll attach the latest referral export. Update the baseline
table, and compare this month's AI referrer domains with last month's and
tell me which are new.
```

### 2. Compare AI referrals with paid search and organic

```text
I run ecommerce marketing for [brand] in [market]. We've set up AI
assistant referrals as their own channel in analytics and want to judge
them on conversion and returns rather than volume.

Attached are:
- a channel export for [date range] with sessions, conversion rate and
  average order value for AI referrals, paid search and organic search
- a returns report showing the 30-day return rate by acquisition channel

Give me one table with the columns: Channel | Sessions | Conversion rate |
Average order value | 30-day return rate.

Then, in no more than five sentences, say how AI referrals compare with the
other two channels on conversion and returns. Flag anywhere the same
shopper may have been counted in more than one channel, for example someone
who arrived from an assistant and later clicked a paid ad. If the data
doesn't let you check that, say so.
```

### 3. Check the pages assistants would quote

```text
I run ecommerce for [brand] at [website]. When a shopper asks an AI
assistant to compare products, it reads product pages and sends the click to
whichever page answered best. Thin descriptions, sizing in images and
prices that load late give it less to quote.

Here are our 20 best-selling Black Friday products: [paste product names
and URLs].

For each URL, open the page and check whether these appear in plain text
on the page (not only in an image, a tab that needs a click to load, or a
PDF): sizing, materials, compatibility, price, stock.

Give me a table with the columns: Product | URL | Sizing | Materials |
Compatibility | Price | Stock, marking each "plain text", "image only",
"missing" or "couldn't check".

Then, for every product with a gap, draft the missing copy in no more than
60 words, using only details already on the page. Where the detail isn't on
the page at all, write "needs input from [team]" instead of inventing it.
```

### And one for you

Ask whoever runs your CDN and robots.txt to confirm that bot-protection rules
haven't shut out the AI search crawlers that fetch your product pages. It's a
quick conversation, and it's worth having before 27 November.
