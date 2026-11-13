---
title: "What ChatGPT's new ad measurement tools mean for paid teams"
date: 2026-10-06
updated: 2026-11-11
tags: ["ai-briefing", "ai", "go-to-market"]
description: "OpenAI added ten attribution partners and a visual ad format test to ChatGPT Ads on 5 October 2026. Its geo-lift work is early, so test incrementality yourself."
faq:
  - question: "Which measurement partners work with ChatGPT Ads?"
    answer: "OpenAI said on 5 October 2026 that ChatGPT Ads supports ten attribution partners, including AppsFlyer and Northbeam. Fospha and INCRMNTAL cover full-funnel measurement, while three integrations, including LiveRamp, send conversion data in from existing systems. OpenAI is also exploring geo-based incrementality experiments with partners such as Haus and WorkMagic, though it calls that work early stage."
  - question: "Where will the new ChatGPT visual ads appear?"
    answer: "OpenAI will first test its visual ad format while ChatGPT generates an image for a user on the Free or Go plan. The ads show a product in use or the experience a service offers. Each one is labelled as an ad and sits apart from the image being created. OpenAI said testing would begin later in October 2026 in the US with an initial group of advertisers."
  - question: "Does ChatGPT Ads count view-through conversions?"
    answer: "ChatGPT Ads can count view-through conversions in reporting. Advertisers choose a click-through attribution window and can add a one-day view-through window for conversions after an impression without a click. OpenAI says these window settings control attribution in reports and leave campaign optimisation unchanged. In an early analysis of global campaigns, OpenAI found 52.7% of eligible one-day view-through conversions happened within an hour of the ad impression."
  - question: "Are the ChatGPT Ads case study results reliable?"
    answer: "Treat them as early signals. OpenAI published three partner results, including a 15.3% lower attributed cost per acquisition for WeightWatchers than its blended paid-search benchmark. OpenAI chose which results to publish and gave no spend or time period. The first outside study, from October 2026, found paid ChatGPT visits earned $0.89 each against $2.45 for paid Google Search in US traffic. A holdout test on your own account is the better guide."
sources:
  - title: "Building advertising for the way people use AI"
    url: "https://openai.com/index/new-chatgpt-ads-format-and-measurement/"
    publisher: "OpenAI"
  - title: "More ways to measure ChatGPT Ads"
    url: "https://ads.openai.com/blog/more-ways-to-measure"
    publisher: "OpenAI Ads"
  - title: "Can Advertising Fund Free AI? Evidence from ChatGPT's International Advertising Rollout"
    url: "https://ecommerceresearch.org/chatgpt-ads/"
    publisher: "Maximilian Kaiser and Christian Schulze"
  - title: "Creative enhancements for ChatGPT Ads"
    url: "https://help.openai.com/en/articles/20001614-creative-enhancements-for-chatgpt-ads"
    publisher: "OpenAI Help Center"
  - title: "OpenAI Adds Visual Ad Format and Measurement Tools to ChatGPT"
    url: "https://www.securities.io/openai-adds-visual-ad-format-and-measurement-tools-to-chatgpt/"
    publisher: "Securities.io"
---

OpenAI gave ChatGPT Ads ten attribution partners and three conversion data integrations on 5 October 2026, along with early geo-lift work on incrementality. A visual ad format reaches US advertisers in a test later in October, but the measurement changes matter more now, because paid teams can judge ChatGPT spend with tools they already use.

## Key takeaways

- On 5 October 2026 OpenAI added ten attribution partners to ChatGPT Ads, including AppsFlyer and Northbeam, plus three conversion data integrations.
- OpenAI calls its incrementality work "still in its early stages" and is exploring geo-based experiments with partners such as Haus and WorkMagic.
- In an early OpenAI analysis, 52.7% of eligible one-day view-through conversions came within an hour of the ad impression.
- DV Rockerbox measured WeightWatchers' attributed cost per acquisition on ChatGPT Ads at 15.3% below its blended paid-search benchmark, one of three partner results OpenAI chose to publish.
- OpenAI said a visual ad format shown during ChatGPT image generation would go into a US test with an initial group of advertisers later in October 2026.

**Update, 11 November 2026.** The first outside measure of ChatGPT ad returns has arrived. A paper by Maximilian Kaiser and Christian Schulze, [published in October 2026](https://ecommerceresearch.org/chatgpt-ads/) and still under review, found a paid ChatGPT visit generated $0.89 in revenue in US traffic against $2.45 for a paid Google Search visit. Its data ends in August 2026, before OpenAI added the partners below. [Our post on the study](/blog/chatgpt-ads-returns-vs-google-search-study/) sets out what it means for bids. OpenAI has also switched on [creative enhancements](https://help.openai.com/en/articles/20001614-creative-enhancements-for-chatgpt-ads) by default for self-serve campaigns from 30 October, so a fair incrementality test now needs that setting fixed before it starts, as [our post on automatic rewrites](/blog/chatgpt-ads-creative-enhancements-default/) explains. OpenAI's ads blog has published nothing new on the visual format since 5 October.

## The new measurement stack

The [announcement](https://openai.com/index/new-chatgpt-ads-format-and-measurement/) covers a new ad format and a wider measurement stack. It also adds brand safety controls and puts ChatGPT's reach at 1.2 billion people a week.

The visual format shows images of a product in use or the experience a service offers. OpenAI will test it first while ChatGPT is generating an image for a user on the Free or Go plan, with the ad labelled and kept apart from the image being created. Testing starts later in October in the US with an initial group of advertisers.

On measurement, ChatGPT Ads supports a pixel and Conversions API for actions such as purchases and sign-ups. Between the announcement and its [Ads blog](https://ads.openai.com/blog/more-ways-to-measure), OpenAI named partners for six measurement jobs.

| Measurement job | Partners OpenAI named |
|---|---|
| Sending conversion data in | Hightouch, Tealium, LiveRamp |
| Attribution and Conversions API | AppsFlyer, Triple Whale, Adjust, DV Rockerbox, Northbeam, Branch, Singular, Kochava, Airbridge, Tenjin |
| Full-funnel measurement | Fospha, INCRMNTAL |
| Geo-based incrementality, early stage | Haus, Measured, WorkMagic |
| Brand lift, early testing | Kantar, Cint |
| Brand suitability pilots | DoubleVerify, Integral Ad Science |

Advertisers pick a click-through window to fit their buying cycle and can add a one-day view-through window, which affects reporting and leaves campaign optimisation unchanged.

On brand safety, qualifying advertisers can now set Negative Phrases to keep ads away from conversations their own policies rule out. The DoubleVerify and Integral Ad Science pilots are being built so that neither firm gets access to private conversations.

## Why measurement sets the budget

A ChatGPT test has been hard to defend at a budget review when its results sit only in OpenAI's own dashboard. If your team already runs Northbeam or Fospha, ChatGPT can now appear in the same report as search and social. The head of performance can then compare it with Google on cost per acquisition and with Meta on new customer share, which puts ChatGPT into the quarterly reallocation conversation instead of a separate innovation line.

### Can you trust view-through numbers?

Treat them with care. OpenAI says that in an early analysis of global campaigns optimised for deeper-funnel outcomes, 52.7% of eligible one-day view-through conversions came within an hour of the ad impression. It presents that as evidence that people act on ads they don't click. Someone who saw an ad and bought within the hour may well have bought anyway, so view-through numbers will flatter any channel whose users are already close to a decision.

### How reliable are the case studies?

OpenAI published three partner results.

- DV Rockerbox put WeightWatchers' attributed cost per acquisition 15.3% below its blended paid-search benchmark.
- WorkMagic's geo-lift study estimated 2.3 times more incremental orders for Dose than last-click attribution captured.
- Triple Whale found 93% of Portland Leather's visitors from ChatGPT Ads were new.

Only the Dose figure comes from an incrementality method, in a set of results OpenAI chose to publish. Our view at Manual Focus is that a brand should keep ChatGPT Ads at test budget until a geo-lift or holdout test on its own account shows incremental sales, whatever the attributed cost per acquisition says.

## What creative teams should prepare

For creative teams, the image generation placement reaches people who are already picturing something, such as a room or an outfit, which suits product-in-use photography better than a pack shot. UK brands, including the Shopify merchants covered in [our post on ChatGPT Ads for UK ecommerce](/blog/chatgpt-ads-shopify-uk-ecommerce/), will have to wait for the test to leave the US.

## Before you move budget into ChatGPT

1. **Check your signal.** Confirm the pixel and Conversions API are both firing and review your Event Quality Score. If one of the three data partners in the table already holds your conversion data, connect it there.
2. **Set the windows on purpose.** Match the click-through window to your buying cycle and report one-day view-through conversions as a separate line, so you can see how much of the result rests on impressions alone.
3. **Ask your attribution vendor.** If you use one of the attribution or full-funnel partners in the table, ask when ChatGPT will appear as a channel in your next monthly report.
4. **Design the incrementality test first.** Agree the holdout regions and the success threshold with finance before any increase in spend. Our [attribution tear-down playbook](/lens/demand/attribution-teardown/) sets out how to compare platform claims with incrementality evidence.
5. **Brief creative for the visual format.** Pull together images that show your product in use, so you are ready if the test opens to more advertisers or markets.

## What OpenAI didn't say

OpenAI gave no date or price for the visual format outside the US test and didn't say which markets get each measurement partner, so UK advertisers should check what Ads Manager offers them. It called its incrementality work early stage, while the brand suitability pilots are still in development with no results published. The case studies cover three brands, with no spend or time period attached. OpenAI also didn't define which advertisers qualify for Negative Phrases.

## Further reading

- [What the first ChatGPT ads returns study means for paid teams](/blog/chatgpt-ads-returns-vs-google-search-study/), for the first outside figures on what a ChatGPT click returns
- [What ChatGPT Ads' automatic rewrites mean for UK advertisers](/blog/chatgpt-ads-creative-enhancements-default/), on the default setting to fix before any test
- [What ads in Google's AI Mode mean for UK paid search teams](/blog/google-ai-mode-ads-uk-paid-search/), on the rival AI ad placement reaching the UK this quarter
- [Attribution tear-down using GA4 and incrementality signals](/lens/demand/attribution-teardown/), for checking platform claims against your own data

Our [services page](/services/) explains how we help teams set up channel tests their finance director will accept.
