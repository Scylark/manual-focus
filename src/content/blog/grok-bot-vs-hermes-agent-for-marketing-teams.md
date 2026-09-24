---
title: "Grok Bot vs Hermes Agent, a guide for UK marketing teams"
date: 2026-09-24
tags: ["ai", "productivity", "marketing-strategy"]
description: "Grok Bot is SpaceXAI's managed agent team, Hermes Agent is Nous Research's free self-hosted one. What each does and which suits a UK marketing team."
faq:
  - question: "What is Grok Bot?"
    answer: "Grok Bot is a team of always-on AI agents from SpaceXAI, the company that makes Grok. Each agent runs on its own cloud computer, signs in to your apps and works through them the way a person would. It launched in beta on 11 August 2026 for SuperGrok and paid Cursor subscribers, with a waitlist for enterprise."
  - question: "What is Hermes Agent?"
    answer: "Hermes Agent is a free, open-source AI agent from Nous Research, released under the MIT licence. You host it yourself, on anything from a small cloud server upwards. It keeps a memory across sessions, writes its own skills, runs scheduled jobs and answers you in Telegram, Slack, WhatsApp, Discord, Signal or email."
  - question: "Can Hermes Agent use Grok models?"
    answer: "Yes. Hermes Agent can sign in to xAI with a SuperGrok or X Premium+ subscription and uses grok-4.6 as its default Grok model. The Hermes documentation warns that some SuperGrok accounts are rejected on that route, and recommends an xAI API key as the workaround."
  - question: "Is Grok Bot or Hermes Agent better for a marketing team?"
    answer: "Grok Bot suits a team that wants agents working inside its existing tools with no setup and is comfortable with a managed US service. Hermes Agent suits a team with technical support that wants control over where data lives and which model runs each job. Many teams will test both on one workflow first."
  - question: "Is Grok under investigation in the UK?"
    answer: "Yes. Ofcom opened a formal Online Safety Act investigation into X on 12 January 2026 over the Grok chatbot being used to create illegal intimate imagery. X restricted the feature that week, and Ofcom said the investigation remains ongoing. No decision had been published by late September 2026."
sources:
  - title: "Introducing Grok Bot"
    url: "https://x.ai/news/introducing-grok-bot"
    publisher: "SpaceXAI"
  - title: "Hermes Agent repository"
    url: "https://github.com/nousresearch/hermes-agent"
    publisher: "Nous Research"
  - title: "Using xAI Grok with Hermes Agent"
    url: "https://hermes-agent.nousresearch.com/docs/guides/xai-grok-oauth"
    publisher: "Nous Research"
  - title: "SpaceXAI's Grok Bot turns agents into persistent digital coworkers"
    url: "https://venturebeat.com/orchestration/spacexais-grok-bot-turns-agents-into-persistent-digital-coworkers-that-can-operate-your-apps-for-120-per-month"
    publisher: "VentureBeat"
  - title: "Nous Research releases Bot Mode for Hermes Agent"
    url: "https://www.marktechpost.com/2026/08/17/nous-research-hermes-bot-mode/"
    publisher: "MarkTechPost"
  - title: "Ofcom launches investigation into X over Grok sexualised imagery"
    url: "https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/ofcom-launches-investigation-into-x-over-grok-sexualised-imagery"
    publisher: "Ofcom"
---

Grok Bot and Hermes Agent both gave teams a roster of AI agents in August 2026, six days apart. SpaceXAI launched Grok Bot in beta on 11 August as a managed service that operates your apps. Hermes Agent from Nous Research is free, open source and self-hosted. The choice comes down to control over data versus speed of setup.

## What Grok Bot does

SpaceXAI, which makes Grok, [describes Grok Bot](https://x.ai/news/introducing-grok-bot) as "your team of always-on agents". Each agent gets its own computer in the cloud, signs in to the tools your team already uses and keeps working when your laptop is shut. You can put several bots in one thread so they hand work to each other, and you can show a bot a workflow while it watches. Over time the bots learn when to stop and ask for approval.

The beta is open to SuperGrok subscribers and people on paid Cursor plans, on desktop and iOS, with a waitlist for enterprise. There is no standalone price, and SpaceXAI gives Grok Bot its own usage allowance on top of those plans. [VentureBeat reports](https://venturebeat.com/orchestration/spacexais-grok-bot-turns-agents-into-persistent-digital-coworkers-that-can-operate-your-apps-for-120-per-month) that users can't choose the underlying model, because SpaceXAI routes the work automatically.

## What Hermes Agent does

[Hermes Agent](https://github.com/nousresearch/hermes-agent) is an MIT-licensed agent you run on your own server. Nous Research says it runs on a $5 virtual server or scales up to GPU clusters. It remembers past sessions, writes and improves its own skills, runs jobs on a schedule through a built-in cron scheduler and talks to you through Telegram, Slack, WhatsApp, Discord, Signal or email. You bring the model, from providers including OpenAI, Anthropic and OpenRouter, or run an open-weight model locally. The repository had 248,600 stars on GitHub on 24 September 2026.

Nous shipped [Bot Mode](https://www.marktechpost.com/2026/08/17/nous-research-hermes-bot-mode/) on 17 August, six days after Grok Bot. It turns Hermes into a roster of named bots, each with its own memory and its own model, that pass work to each other with @mentions.

The two products also connect. [Hermes can sign in to Grok](https://hermes-agent.nousresearch.com/docs/guides/xai-grok-oauth) with a SuperGrok or X Premium+ subscription and defaults to grok-4.6, although Nous warns that some SuperGrok accounts get rejected on that route and suggests an API key instead.

## Which one fits a marketing team

The deciding question for a UK marketing team is where the work happens and who holds the data. Grok Bot works inside your logged-in tools on SpaceXAI's computers, so your CRM, ad accounts and inbox are open to a third party's agent. Hermes keeps the agent on infrastructure you control, and if you pair it with a local model, customer data never leaves your servers. That makes the UK GDPR conversation with your data protection lead much shorter.

Grok Bot wins on setup. Someone who can use a browser can have an agent working inside a CMS or ad platform the same day. Hermes needs a person who can run a server, manage updates and keep credentials safe, which most marketing teams borrow from engineering.

Brand risk is the third factor. Ofcom [opened an investigation](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/ofcom-launches-investigation-into-x-over-grok-sexualised-imagery) into X on 12 January 2026 after Grok was used to create illegal intimate images, and says that investigation remains open. That doesn't make Grok Bot unsafe to use internally, but it belongs in any risk note that goes to a board.

Our view at Manual Focus is that most marketing teams should start with Hermes Agent for recurring reporting and research jobs that touch customer data, and try Grok Bot only for work inside tools where a mistake is cheap and reversible.

Good first jobs for either agent are the ones in The Lens productivity stack, such as the [daily briefing pipeline](/lens/productivity/daily-briefing-pipeline/) and the [weekly pipeline rollup](/lens/productivity/weekly-pipeline-rollup/). Each is scheduled, repeatable and easy to check against a human version.

## Five steps before you commit

1. Pick one weekly job, such as a competitor digest or a paid-media report, and write down how long it takes a person today.
2. List every system that job touches and mark which ones hold personal data.
3. Run that job on Hermes Agent with a model you already pay for, and have the same person check the output for four weeks.
4. If you trial Grok Bot, give it a separate login with read-only access wherever the tool allows it.
5. Add both products to your AI use policy with a named owner, and note the open Ofcom investigation in the Grok entry.

## What's still unclear

SpaceXAI hasn't said where Grok Bot's computers run or whether its terms differ for UK customers. It also hasn't published a standalone price, so the cost for a team that doesn't use SuperGrok or Cursor is unknown. On the Hermes side, a self-hosted agent is only as secure as the server it runs on, and Nous offers no service-level agreement for the open-source version. Both products are moving weekly, so treat any comparison, this one included, as a snapshot from late September 2026.

If you want help choosing and setting up an agent for your team, [book a working session](/enquire/).
