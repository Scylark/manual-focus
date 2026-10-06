---
title: "What ChatGPT's new ad measurement tools mean for paid teams"
date: 2026-10-06
tags: ["ai-briefing", "ai", "go-to-market"]
description: "OpenAI added ten attribution partners and a visual ad format test to ChatGPT Ads on 5 October 2026. Its geo-lift work is early, so test incrementality yourself."
faq:
  - question: "Which measurement partners work with ChatGPT Ads?"
    answer: "OpenAI said on 5 October 2026 that ChatGPT Ads supports ten attribution partners, AppsFlyer, Triple Whale, Adjust, DV Rockerbox, Northbeam, Branch, Singular, Kochava, Airbridge and Tenjin. Fospha, Measured and INCRMNTAL cover full-funnel measurement, Hightouch, Tealium and LiveRamp send conversion data in, and Haus, Measured and WorkMagic are working with OpenAI on geo-based incrementality experiments."
  - question: "Where will the new ChatGPT visual ads appear?"
    answer: "OpenAI will first test its visual ad format while ChatGPT generates an image for a user. The ads show product inspiration, a product in use or the experience a service offers, are labelled as ads and sit apart from the image being created. Testing starts later in October 2026 in the US with an initial group of advertisers."
  - question: "Does ChatGPT Ads count view-through conversions?"
    answer: "Yes, in reporting. Advertisers choose a click-through attribution window and can add a one-day view-through window for conversions after an impression without a click. OpenAI says these settings change reports, not campaign optimisation. In an early analysis of global campaigns, OpenAI found 52.7% of eligible one-day view-through conversions happened within an hour of the ad impression."
  - question: "Are the ChatGPT Ads case study results reliable?"
    answer: "Treat them as early signals. OpenAI published partner figures for WeightWatchers, Dose and Portland Leather, including a 15.3% lower attributed cost per acquisition than WeightWatchers' blended paid-search benchmark. OpenAI chose which results to publish and gave no spend, time period or method. A geo-lift or holdout test on your own account is the better guide."
sources:
  - title: "Building advertising for the way people use AI"
    url: "https://openai.com/index/new-chatgpt-ads-format-and-measurement/"
    publisher: "OpenAI"
  - title: "More ways to measure ChatGPT Ads"
    url: "https://ads.openai.com/blog/more-ways-to-measure"
    publisher: "OpenAI Ads"
  - title: "OpenAI Adds Visual Ad Format and Measurement Tools to ChatGPT"
    url: "https://www.securities.io/openai-adds-visual-ad-format-and-measurement-tools-to-chatgpt/"
    publisher: "Securities.io"
---

OpenAI gave ChatGPT Ads ten attribution partners and three conversion data integrations on 5 October 2026, and said it is exploring geo-lift tests with Haus, Measured and WorkMagic. A visual ad format reaches US advertisers in a test later this month, but the measurement changes matter more now, because paid teams can judge ChatGPT spend with tools they already use.

## Three changes in one announcement

The [announcement](https://openai.com/index/new-chatgpt-ads-format-and-measurement/) covers a new format, a measurement stack and brand safety controls, and OpenAI put ChatGPT's reach at 1.2 billion people a week.

The visual format shows images of product inspiration, a product in use or the experience a service offers. OpenAI will test it first while ChatGPT is generating an image for a user, with the ad labelled and kept apart from the image being created. Testing starts later this month in the US with an initial group of advertisers.

On measurement, ChatGPT Ads supports a pixel and Conversions API for purchases, leads, installs and sign-ups, and Hightouch, Tealium and LiveRamp can now pass conversion data into it from existing systems. AppsFlyer, Triple Whale, Adjust, DV Rockerbox, Northbeam, Branch, Singular, Kochava, Airbridge and Tenjin are the ten attribution partners, and Fospha, Measured and INCRMNTAL handle full-funnel measurement. OpenAI is exploring geo-based experiments with Haus, Measured and WorkMagic, and its [Ads blog](https://ads.openai.com/blog/more-ways-to-measure) adds early brand-lift testing with Kantar and Cint. Advertisers pick a click-through window to fit their buying cycle and can add a one-day view-through window, which changes reporting but not how campaigns optimise.

On brand safety, qualifying advertisers can now set Negative Phrases to keep ads away from conversations their own policies rule out, and OpenAI is building brand suitability pilots with DoubleVerify and Integral Ad Science that don't give either firm access to private conversations.

## Why measurement decides the ChatGPT budget

A ChatGPT test has been hard to defend at a budget review when its results sit only in OpenAI's own dashboard. If your team already runs Northbeam, Fospha or AppsFlyer, ChatGPT can now appear in the same report as search and social, and the head of performance can compare it with Google on cost per acquisition and with Meta on new customer share. That puts ChatGPT into the quarterly reallocation conversation instead of a separate innovation line.

Treat the view-through window with care. OpenAI says that in an early analysis of global campaigns, 52.7% of eligible one-day view-through conversions came within an hour of the ad impression, and it presents that as proof that people act on ads they don't click. Someone who saw an ad and bought within the hour may well have bought anyway, so view-through numbers will flatter any channel whose users are already close to a decision.

Read the published results with the same caution. DV Rockerbox put WeightWatchers' attributed cost per acquisition 15.3% below its blended paid-search benchmark, WorkMagic's geo-lift study estimated 2.3 times more incremental orders for Dose than last-click attribution captured, and Triple Whale found 93% of Portland Leather's ChatGPT Ads visitors were new. Only the Dose figure comes from an incrementality method, and OpenAI chose all three. Our view at Manual Focus is that a brand should keep ChatGPT Ads at test budget until a geo-lift or holdout test on its own account shows incremental sales, whatever the attributed cost per acquisition says.

For creative teams, the image generation placement reaches people who are already picturing something, a room, an outfit, a trip, which suits product-in-use photography better than a pack shot. UK brands already buying through Shopify, as covered in [our post on ChatGPT Ads for UK ecommerce](/blog/chatgpt-ads-shopify-uk-ecommerce/), will have to wait for the test to leave the US.

## Before you move budget into ChatGPT

1. **Check your signal.** Confirm the pixel and Conversions API are both firing and review your Event Quality Score. If Hightouch, Tealium or LiveRamp already holds your conversion data, connect it there.
2. **Set the windows on purpose.** Match the click-through window to your buying cycle and report one-day view-through conversions as a separate line, so you can see how much of the result rests on impressions alone.
3. **Ask your attribution vendor.** If you use one of the ten partners or Fospha, Measured or INCRMNTAL, ask when ChatGPT will appear as a channel in your next monthly report.
4. **Design the incrementality test first.** Agree the regions, the holdout and the success threshold with finance before any increase in spend. Our [attribution tear-down playbook](/lens/demand/attribution-teardown/) sets out how to compare platform claims with incrementality evidence.
5. **Brief creative for the visual format.** Pull together images that show your product in use, so you are ready if the test opens to more advertisers or markets.

## Where the evidence runs thin

OpenAI gave no date or price for the visual format outside the US test and didn't say which markets get each measurement partner, so UK advertisers should check what Ads Manager offers them. It called its incrementality work early stage, and the brand suitability pilots are still in development, with no results published. The case studies cover three brands with no spend, time period or method attached. OpenAI also didn't define which advertisers qualify for Negative Phrases.

Our [services page](/services/) explains how we help teams set up channel tests their finance director will accept.
