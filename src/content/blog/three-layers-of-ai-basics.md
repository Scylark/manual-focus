---
title: "The three layers of AI, a basics guide for marketers"
date: 2026-10-17
tags: ["basics", "ai", "marketing-strategy"]
description: "AI in marketing works on three layers. Chat with a language model, agents that carry out a request, and orchestration that runs many agents as one system."
podcast:
  audio: "https://manual-focus-podcast.manual-focus.workers.dev/episodes/three-layers-of-ai-basics.mp3"
  duration: 717
  bytes: 8606974
  published: 2026-10-17
howToName: "How to move a marketing team up the three layers of AI"
howToSteps:
  - name: "Get layer one right"
    text: "Give the team one approved assistant, an operational brand voice prompt and a shared library of the prompts that work, so chat output is consistent before anything is automated."
  - name: "Pick one request to delegate"
    text: "Choose a repeatable job with a clear finished state, such as a weekly report or a page audit, and hand the whole request to an agent with the tools it needs."
  - name: "Write the checks before the agent runs"
    text: "Decide what a good result looks like, what the agent may touch and where a person signs off, and write those rules down before the first run."
  - name: "Orchestrate only proven pieces"
    text: "Connect agents into a larger system only once each one works reliably on its own, with a person reviewing the final output."
faq:
  - question: "What are the three layers of AI?"
    answer: "The three layers are a way Manual Focus describes how AI does marketing work. Layer one is a large language model you talk to in a chat. Layer two is an agent that takes a whole request, uses tools and delivers a finished result. Layer three is orchestration, where several agents or steps run together as one system under human control."
  - question: "What is the difference between a chatbot and an AI agent?"
    answer: "A chatbot answers one message at a time and a person carries the work between messages. An agent takes a goal, decides its own steps, calls tools such as search, files or software, checks its progress and returns a finished piece of work. Anthropic describes agents as systems where the model directs its own process and tool use."
  - question: "What is AI orchestration in marketing?"
    answer: "AI orchestration is the coordination of several AI steps or agents so they work as one system. A lead agent or a fixed workflow breaks a job into parts, hands each part to a specialist, and combines the results. In marketing that might be research, drafting, checking and publishing running as one pipeline with a person approving the output."
  - question: "Do marketers need to understand how LLMs work?"
    answer: "Marketers need a working grasp, not an engineering one. Knowing that a language model predicts likely text, reads only what fits in its context window and can state wrong things confidently explains most of what goes right and wrong in daily use. That understanding decides what you trust the model with and what you check."
sources:
  - title: "Building effective agents"
    url: "https://www.anthropic.com/engineering/building-effective-agents"
    publisher: "Anthropic"
  - title: "How we built our multi-agent research system"
    url: "https://www.anthropic.com/engineering/multi-agent-research-system"
    publisher: "Anthropic"
  - title: "Glossary"
    url: "https://platform.claude.com/docs/en/about-claude/glossary"
    publisher: "Anthropic"
  - title: "Why language models hallucinate"
    url: "https://arxiv.org/abs/2509.04664"
    publisher: "arXiv"
  - title: "Introducing the Model Context Protocol"
    url: "https://www.anthropic.com/news/model-context-protocol"
    publisher: "Anthropic"
---

AI does marketing work on three layers. Layer one is a large language model you talk to in a chat window. Layer two is an agent that takes a whole request, uses tools and delivers the finished job. Layer three is orchestration, where several agents run as one system. Each layer needs different skills, checks and budgets from a team.

## Key takeaways

- Layer one is chat. A large language model predicts likely text from what sits in its context window, its working memory for the conversation.
- Layer two is agentic delivery. Anthropic defines agents as systems where the model directs its own process and tool use, with no fixed script.
- Layer three is orchestration. In Anthropic's own research system, a lead agent with subagents beat a single agent by 90.2% on an internal test.
- Each layer costs more to run. Anthropic reports agents use about four times the tokens of chat, and multi-agent systems about fifteen times.
- Most teams should get layer one consistent before they delegate whole jobs, and delegate reliably before they orchestrate.

## Why think about AI in layers?

Most confusion about AI in marketing teams comes from people talking about different layers as if they were one thing. A copywriter using a chat assistant to tighten a headline, a performance lead who has an agent rebuild a weekly report, and a head of content running a pipeline that researches, drafts, checks and schedules are all "using AI". The work, the risks and the skills involved are very different.

The three-layer frame is how Manual Focus explains it to clients. Each layer adds something the one below lacks. Chat adds language. Agents add action. Orchestration adds coordination. Every layer still rests on the language model underneath, so its strengths and failure modes carry all the way up.

| Layer | What you do | What the AI does | Who checks | Typical marketing job |
|---|---|---|---|---|
| 1. LLMs and chat | Write a prompt, read the answer, ask again | Predicts a reply from what is in the conversation | You, every turn | Drafting copy, summarising research, ideas |
| 2. Agentic requests and delivery | Describe the outcome and hand it over | Plans steps, uses tools, returns a finished piece | You, at the end and at agreed points | Building a report, auditing a site, preparing a brief |
| 3. Orchestration | Design the system and its rules | Several agents or steps work in sequence or in parallel | Checks built into the system, plus a final human sign-off | A content pipeline, a daily news desk, campaign reporting |

## What is a large language model?

A large language model, or LLM, is the engine under every chat assistant. Anthropic's [glossary](https://platform.claude.com/docs/en/about-claude/glossary) describes pretraining as teaching the model to predict the next word from the text before it, using a vast body of text. Further training, including feedback from people who rank answers, turns that raw predictor into an assistant that follows instructions.

Three properties matter to a marketer.

**It only knows what it can see.** The context window is the model's working memory, the text it can refer back to in a conversation. If your brand guidelines, audience research or product facts are not in the window, the model falls back on general patterns, which is why generic prompts produce generic copy.

**It predicts, so it can be confidently wrong.** OpenAI researchers argued in a [September 2025 paper](https://arxiv.org/abs/2509.04664) that models hallucinate partly because training and evaluation reward guessing over admitting uncertainty. Any fact, figure or quote from a chat assistant needs checking at its source before it goes out.

**The person carries the work.** In layer one, you move the work between turns. You paste in the brief, judge the draft, ask for changes and copy the result into the CMS. The model never touches your systems.

Layer one is where most marketing teams are today, and it is worth doing well before moving up. A shared voice prompt and a library of tested prompts make chat output consistent, and the [brand voice extraction](/lens/brand/brand-voice-extraction/) playbook sets out how to build one.

## What changes when AI becomes an agent?

At layer two you stop asking for answers and start asking for outcomes. An agent is a language model given tools, such as web search, file access, a browser or a connection to your analytics, plus the freedom to decide which to use and when.

Anthropic's December 2024 guide, [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), draws a useful line. Workflows are systems where models and tools follow predefined code paths. Agents are systems where the model directs its own process and tool use. Both count as agentic systems, and the guide's advice is to find the simplest solution that works and add complexity only when it is needed.

For a marketing team the shift is in what you hand over. "Write me three subject lines" is a layer one request. "Pull last month's email results, find the three worst-performing flows, work out why from the content and timing, and give me a one-page brief to fix them" is a layer two request. The agent opens the export, works through it and comes back with the brief.

Two things make layer two work in practice.

**Connections to real tools.** Agents need access to the systems where marketing data lives. Anthropic open-sourced the [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) in November 2024 as a standard way to connect assistants to the places data lives, such as business tools and document stores.

**A clear definition of done.** An agent stops when it thinks the job is finished. If you have not said what finished looks like, which data to trust and where to stop and ask, it will decide for itself. The [evaluation frameworks](/lens/ops/evaluation-frameworks/) playbook covers how to write those checks before a run rather than after a mistake.

Agents also change what tasks are worth automating. Our view at Manual Focus is that the best first agent jobs are the dull, repeatable ones with an obvious finished state, such as reporting, audits and briefing packs, because they are easy to check and the time saved shows up in the first week.

## What does orchestration add?

Layer three is where several agents or steps run together as one system. Anthropic's guide names the patterns, including prompt chaining, where each step feeds the next, routing, where an input goes to a specialist, and orchestrator-workers, where a central model breaks a task down, hands out the parts and combines the results.

Anthropic's own research feature shows the shape. In its [June 2025 write-up](https://www.anthropic.com/engineering/multi-agent-research-system), a lead agent plans the research, starts subagents that search in parallel, and combines what they return. The company reported that this beat a single agent by 90.2% on its internal research test. It also reported the cost, with agents using about four times the tokens of a chat and multi-agent systems about fifteen times, so orchestration suits valuable work rather than every task.

In marketing, orchestration looks like a pipeline. One agent researches a topic, a second drafts against the brief and voice prompt, a third checks the draft against the brand rules and sources, and a person approves the result before it publishes. The [brief-to-ship pipeline](/lens/ops/brief-to-ship-pipeline/) and [your own news desk](/lens/content/news-desk/) playbooks are both layer three systems.

The human job changes at this layer. You design the system, set its rules and own its output, and the agents do the steps. That is closer to running a team than to writing a prompt, which is why orchestration is a leadership question as much as a technical one.

## Which layer should your team start at?

Start at the layer below the one you want to reach. Teams that skip layer one end up automating inconsistent prompts, and teams that skip layer two end up orchestrating agents that were never reliable alone.

| If your team... | Work on | First move |
|---|---|---|
| Uses AI ad hoc, with different tools and prompts | Layer one | One approved assistant and a shared voice prompt |
| Has consistent chat use and repeatable jobs | Layer two | Delegate one report or audit end to end |
| Has two or three agents working reliably | Layer three | Connect them with checks and one human sign-off |

The [90-day AI integration plan](/blog/the-90-day-ai-integration-plan/) walks a team through layers one and two in six fortnightly blocks, and [evaluating AI tools without falling for the demo](/blog/evaluating-ai-tools-without-falling-for-the-demo/) helps you judge which products genuinely work at which layer.

## What the layers don't change

The layers change how work gets done. They do not change what good marketing is. A clear objective, a sharp audience and a remarkable offer still decide whether the work lands, which is why this Basics series covers [SOSTAC planning](/blog/sostac-marketing-plan-basics/) and [strategy, campaigns, creative and execution](/blog/strategy-campaign-creative-execution-basics/) alongside the AI pieces. There are also [jobs AI shouldn't touch](/blog/when-not-to-use-ai-in-marketing/) at any layer.

## Further reading

- [The 90-day AI integration plan](/blog/the-90-day-ai-integration-plan/), for moving a team from layer one to layer two
- [Brief-to-ship pipeline](/lens/ops/brief-to-ship-pipeline/), a layer three playbook for content production
- [Evaluation frameworks for marketing AI outputs](/lens/ops/evaluation-frameworks/), for writing the checks agents need
- [SOSTAC explained](/blog/sostac-marketing-plan-basics/), the planning model the rest of the Basics series builds on

If you want help working out which layer your team should be on, [book a free working session](/contact/).
