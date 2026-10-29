---
title: "Go-to-market automation, a basics guide with Claude and Apollo"
date: 2026-10-29
tags: ["basics", "go-to-market", "ai"]
description: "How a new SaaS company turns its positioning into pipeline with Claude, Apollo and landing pages built in GitHub, and which decisions stay with people."
faq:
  - question: "How do you use Claude with Apollo for outbound?"
    answer: "Apollo's official connector lets Claude search Apollo's B2B database, enrich contacts with Apollo credits, create and update contacts and add or remove them from sequences, all from a Claude conversation. Apollo launched it in beta on 24 February 2026 and it connects through OAuth. The useful pattern is to let Claude research and score a wide list against your ideal customer profile before anyone is added to a sequence."
  - question: "What is go-to-market automation?"
    answer: "Go-to-market automation means handing the repeatable parts of taking a product to market, such as building lists, researching accounts, drafting messages, building landing pages and reporting, to software and AI. The strategy stays human. Who the product is for, what it is positioned against and what the company says first are decisions a team makes before any automation runs."
  - question: "Is cold B2B email legal in the UK?"
    answer: "The ICO says the PECR rule on email marketing does not apply to corporate subscribers such as limited companies, so B2B email to them doesn't need prior consent. Sole traders and some partnerships count as individuals and generally do. A named work email is still personal data under UK GDPR, so you need a lawful basis, privacy information and an opt-out, and you must honour objections."
  - question: "Can you host landing pages on GitHub Pages?"
    answer: "GitHub Pages is a static site hosting service with custom domain support, a 1 GB site limit and a soft bandwidth limit of 100 GB a month. GitHub's docs also say Pages isn't intended or allowed to be used as free hosting to run an online business or a site mainly for commercial transactions or SaaS, so check that wording before you put SaaS campaign pages on it."
  - question: "Which go-to-market decisions should AI not make?"
    answer: "AI should not decide who the ideal customer is, what the product is positioned against, what the core message says or whether a contact should be emailed at all. Those choices carry the strategy and the legal risk. AI can do the research, scoring, drafting and page building underneath them, with a named person approving the list, the copy and every page before it goes live."
sources:
  - title: "Apollo Delivers GTM Outbound Execution to Claude"
    url: "https://www.apollo.io/newsroom/announcements/apollo-delivers-gtm-outbound-execution-to-claude"
    publisher: "Apollo"
  - title: "Apollo MCP"
    url: "https://docs.apollo.io/docs/apollo-mcp"
    publisher: "Apollo Docs"
  - title: "Claude Code overview"
    url: "https://code.claude.com/docs/en/overview"
    publisher: "Anthropic"
  - title: "GitHub Pages limits"
    url: "https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits"
    publisher: "GitHub Docs"
  - title: "Business-to-business marketing"
    url: "https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/"
    publisher: "Information Commissioner's Office"
  - title: "Statement on the commencement of the Data (Use and Access) Act (DUAA)"
    url: "https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/02/statement-on-the-commencement-of-the-data-use-and-access-act-duaa"
    publisher: "Information Commissioner's Office"
  - title: "Obviously Awesome and Sales Pitch"
    url: "https://www.aprildunford.com/books"
    publisher: "April Dunford"
  - title: "Email sender guidelines"
    url: "https://support.google.com/a/answer/81126"
    publisher: "Google Workspace Admin Help"
---

Go-to-market automation hands the repeatable work of finding buyers to software, while people keep the strategy. A new SaaS company can now ask Claude to search Apollo's database of 240 million contacts, research each account, draft the outreach and build a landing page for each segment in GitHub. This guide shows the method through one hypothetical launch.

## Key takeaways

- Apollo launched a native Claude connector in beta on 24 February 2026, so Claude can search Apollo, enrich contacts and manage sequences from a conversation.
- Apollo says its database holds 240 million contacts and 30 million companies, and enrichment through Claude uses Apollo credits.
- Claude Code reads a codebase, edits files and opens pull requests, so it can build one landing page per segment for a person to approve.
- GitHub's docs say Pages isn't intended or allowed to be used as free hosting for an online business or SaaS, so check its terms before choosing it as the host.
- Since 5 February 2026 the ICO can fine up to £17.5 million or 4% of global turnover for breaches of PECR, the UK's email marketing rules.

## Where this guide picks up

The [What is marketing](/blog/what-is-marketing-basics/) guide followed a cycling helmet from product-market fit to a [SOSTAC](/blog/sostac-marketing-plan-basics/) plan. It ended with a position, a communication hierarchy and a benefits ladder. This guide starts there, at the point a plan has to reach real buyers, and swaps the helmet for a B2B launch.

Take a hypothetical UK SaaS start-up selling project-profitability software to architecture practices of 20 to 200 staff, working on fixed or staged fees. Its research found that practice directors can't see which projects lose money until the year-end accounts. The core message is "know which projects pay, while you can still change them", and the supporting messages cover live project margins, timesheets people actually fill in and fee proposals priced from real data.

Everything below automates the delivery of that plan. None of it replaces the plan.

## Growth strategy or growth tactic?

The two are easy to confuse in a new SaaS company, because the tools are exciting and the strategy is hard. In SOSTAC terms the strategy is who you serve and how you win, and the tactics are the tools that carry it.

| Decision | Strategy or tactic | Who owns it |
|---|---|---|
| Which practices are the ideal customer | Strategy | Founders and marketing lead |
| What the product is positioned against | Strategy | Founders and marketing lead |
| The core message and benefits ladder | Strategy | Marketing lead |
| Which accounts fit, ranked by evidence | Tactic | AI research, checked by a person |
| The email copy and landing page per segment | Tactic | AI drafts, a person approves |
| Sequence timing and follow-ups | Tactic | Sales or marketing operations |

April Dunford's book [Obviously Awesome](https://www.aprildunford.com/books) breaks positioning into five component pieces, and it is worth reading before any list gets built. If the position is vague, automation sends a vague message to more people, faster.

## The workflow in eight steps

<figure class="dg dg-chain"><div class="dg-head"><span class="dg-kicker">Go-to-market automation</span><span class="dg-title">From plan to pipeline</span></div><ol class="dg-list dg-steps"><li class="dg-step dg-card"><span class="dg-num">1</span><span><span class="dg-strong">Ideal customer profile</span><span class="dg-q">Who exactly are we for?</span><span class="dg-chip">Strategy · people</span></span></li><li class="dg-step dg-card"><span class="dg-num">2</span><span><span class="dg-strong">The wide list</span><span class="dg-q">Every company that could fit</span><span class="dg-chip">Apollo</span></span></li><li class="dg-step dg-card"><span class="dg-num">3</span><span><span class="dg-strong">AI research</span><span class="dg-q">What does each account show?</span><span class="dg-chip">Claude</span></span></li><li class="dg-step dg-card"><span class="dg-num">4</span><span><span class="dg-strong">The shortlist</span><span class="dg-q">Who fits best, and why now?</span><span class="dg-chip">Claude · people approve</span></span></li><li class="dg-step dg-card"><span class="dg-num">5</span><span><span class="dg-strong">Messages per segment</span><span class="dg-q">Which rung of the ladder leads?</span><span class="dg-chip">Claude · people approve</span></span></li><li class="dg-step dg-card dg-go"><span class="dg-num">6</span><span><span class="dg-strong">Landing pages</span><span class="dg-q">Where does the click land?</span><span class="dg-chip">Claude Code · GitHub</span></span></li><li class="dg-step dg-card dg-go"><span class="dg-num">7</span><span><span class="dg-strong">Sequences</span><span class="dg-q">Who hears what, and when?</span><span class="dg-chip">Apollo</span></span></li><li class="dg-step dg-card dg-go"><span class="dg-num">8</span><span><span class="dg-strong">Measure and learn</span><span class="dg-q">Which segment replied, and why?</span><span class="dg-chip">Control</span></span></li></ol><div class="dg-note">Step 1 is strategy and stays with people. Steps 2 to 7 are tactics that AI and software can carry. Step 8 feeds the next Situation, as in SOSTAC.</div></figure>

## How do you build the wide list?

Start wide on purpose. [Apollo's connector for Claude](https://www.apollo.io/newsroom/announcements/apollo-delivers-gtm-outbound-execution-to-claude) lets you describe the target in plain language and get matching companies and people back, then save them to lists. For the start-up, that means every UK architecture practice in the size band, with the practice director, the finance lead and the operations manager at each.

Two details from [Apollo's MCP docs](https://docs.apollo.io/docs/apollo-mcp) matter here. People search doesn't return email addresses or phone numbers, so contact details need a separate enrichment step that uses credits. Apollo also recommends requiring approval for any action that spends credits, and that is worth doing before you search at scale.

## How does AI narrow the list?

This is the step most teams skip, and it is where AI earns its place. Instead of emailing everyone in the size band, give Claude the ideal customer profile and ask it to research each account against it, from the practice's own website, its recent projects, its job postings and its news.

<figure class="dg dg-market"><div class="dg-head"><span class="dg-kicker">Steps 2 to 4 · Narrowing the list</span><span class="dg-title">From everyone to the right few</span></div><div class="dg-split"><ol class="dg-list dg-funnel"><li style="--i:0"><span class="dg-strong">Every practice in the size band</span><span class="dg-q">The wide list from Apollo.</span></li><li style="--i:1"><span class="dg-strong">Fits the profile on the evidence</span><span class="dg-q">Project types, fee model, growth.</span></li><li style="--i:2"><span class="dg-strong">Shows a reason to act now</span><span class="dg-q">Hiring, a new office, a big win.</span></li><li class="dg-win" style="--i:3"><span class="dg-strong">The shortlist a person approves</span></li></ol><div><span class="dg-label">What the research records</span><ul class="dg-list dg-bullets"><li>A fit score with the evidence behind it</li><li>The trigger, with a link to where it was found</li><li>Which supporting message suits the account</li></ul></div></div></figure>

Ask for a score with the evidence behind it, a link to each source and a note of anything it couldn't check. A score without evidence can't be audited. Then a person reads the top of the list and the borderline cases before anyone is contacted. Apollo's docs list job postings among the records the connector can retrieve, and a practice that is hiring project architects is a stronger lead than one that isn't.

## Messages that come from the hierarchy

The outreach copy comes from the communication hierarchy, not from a blank page. Each segment leads with the supporting message its trigger points to, and climbs the benefits ladder from there. A practice that just opened a second office hears about live margins across sites. One hiring fast hears about timesheets people fill in.

Claude drafts each version from the hierarchy and the research notes, and a person approves the set. Keep the claims to what the product can prove, because the [brand guardrails as code](/lens/ops/brand-guardrails-as-code/) playbook applies to outreach as much as to ads.

## Landing pages built in GitHub

A cold email that sends everyone to the home page wastes the research. A landing page per segment repeats the message the reader was sent, shows the proof for it and gives one next step. Building pages used to make this too slow for a small team.

[Claude Code](https://code.claude.com/docs/en/overview) changes that. It reads a codebase, edits files, runs commands and opens pull requests. Keep one page template in a GitHub repository, give Claude Code the segment's message, proof and call to action, and it builds the page and opens a pull request. A person reviews the page and merges it.

Check the host before you choose it. [GitHub's docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) say Pages sites may be no larger than 1 GB, with a soft bandwidth limit of 100 GB a month, and that Pages isn't intended or allowed to be used as free hosting to run an online business, an e-commerce site or a site providing commercial SaaS. A SaaS campaign page sits close to that line, so the safer set-up keeps the repository and the Claude Code workflow in GitHub and publishes through a static host whose terms cover commercial sites.

## What do UK rules require?

The [ICO's B2B marketing guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/) says the PECR rule on email marketing doesn't apply to corporate subscribers such as limited companies, but sole traders and some partnerships count as individuals and generally need to consent. A named work address is still personal data, so UK GDPR applies, legitimate interests is usually the lawful basis, and an objection to direct marketing is absolute. The ICO says its guidance is under review after the Data (Use and Access) Act, and its [February 2026 statement](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/02/statement-on-the-commencement-of-the-data-use-and-access-act-duaa) confirmed fines of up to £17.5 million or 4% of global turnover under PECR.

Inbox providers have rules too. [Google's sender guidelines](https://support.google.com/a/answer/81126) require SPF or DKIM for every sender and ask all senders to keep reported spam below 0.3%. Apollo's docs list checks for SPF, DKIM and DMARC among the connector's tools. A practice can trade as a partnership, which PECR may treat as an individual, so the start-up would check each account's legal form before emailing it, as part of the research step.

## Where SOSTAC holds it together

<figure class="dg dg-sostac-fig"><div class="dg-head"><span class="dg-kicker">Bringing it together · PR Smith's SOSTAC</span><span class="dg-title">The automation sits in T and A</span></div><ol class="dg-list dg-sostac"><li class="dg-stage dg-card dg-ev"><span class="dg-letter">S</span><span class="dg-stage-body"><span><span class="dg-strong">Situation</span><span class="dg-q">Where are we now?</span></span><span>Research findings and the ideal customer profile</span></span></li><li class="dg-stage dg-card"><span class="dg-letter">O</span><span class="dg-stage-body"><span><span class="dg-strong">Objectives</span><span class="dg-q">Where do we want to be?</span></span><span>Qualified meetings by segment, by a date</span></span></li><li class="dg-stage dg-card"><span class="dg-letter">S</span><span class="dg-stage-body"><span><span class="dg-strong">Strategy</span><span class="dg-q">How do we get there?</span></span><span>The segments, the position, the hierarchy</span></span></li><li class="dg-stage dg-card"><span class="dg-letter">T</span><span class="dg-stage-body"><span><span class="dg-strong">Tactics</span><span class="dg-q">The details of strategy</span></span><span>The list, the research, messages, landing pages</span></span></li><li class="dg-stage dg-card"><span class="dg-letter">A</span><span class="dg-stage-body"><span><span class="dg-strong">Action</span><span class="dg-q">The details of tactics</span></span><span>Sequences, approvals, owners, send dates</span></span></li><li class="dg-stage dg-card dg-ev"><span class="dg-letter">C</span><span class="dg-stage-body"><span><span class="dg-strong">Control</span><span class="dg-q">How do we know we're getting there?</span></span><span>Replies, meetings and page visits by segment</span></span></li></ol><div class="dg-note">↻ Which segment replied, and to which message, becomes the next Situation.</div></figure>

Control is where automation pays back. Because every segment had its own message and page, replies and page visits show which part of the hierarchy landed, and the next round of research starts from that. The [attribution tear-down](/lens/demand/attribution-teardown/) playbook covers the measurement side.

## Where people go wrong

The common failure is skipping step 4 and sending to the whole wide list, which costs credits, burns the sending domain and teaches the team nothing. The second is letting AI write the position as well as the copy, so every email sounds plausible and none sounds like the company. The third is treating the landing pages as a one-off, when they're the cheapest place to test which message works.

Our view at Manual Focus is that AI makes outbound worth doing well again, because the research that used to be too slow to do for every account now takes minutes, so the advantage goes to teams with a clear position and the discipline to send to fewer, better-chosen people. The [hiring shape for AI-native teams](/lens/ops/hiring-shape-for-ai-native-teams/) playbook covers who owns each approval.

## Further reading

- [What is marketing](/blog/what-is-marketing-basics/), the first half of this story, from market fit to SOSTAC
- [SOSTAC explained](/blog/sostac-marketing-plan-basics/), for the plan that sits above the automation
- [Evaluating AI tools without falling for the demo](/blog/evaluating-ai-tools-without-falling-for-the-demo/), before you commit to any stack
- [The three layers of AI](/blog/three-layers-of-ai-basics/), for which kind of AI suits which step

If you want help turning your positioning into a working go-to-market system, [book a free working session](/enquire/).
