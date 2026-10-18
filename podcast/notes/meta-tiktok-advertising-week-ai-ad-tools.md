---
post: meta-tiktok-advertising-week-ai-ad-tools
title: "Meta and TikTok AI ad tools from Advertising Week, a UK guide"
chapters:
  - title: "Cold open"
    at: "Meta and TikTok both used Advertising Week"
  - title: "TikTok's announcements"
    at: "Start with TikTok"
  - title: "Meta's side"
    at: "And Meta's side"
  - title: "What's open to UK teams"
    at: "So what's open to a UK team today"
  - title: "Agents running your ads"
    at: "Both have an MCP server"
  - title: "The performance claims"
    at: "What about the performance claims"
  - title: "Checkout prep"
    at: "The other practical point is checkout prep"
  - title: "Get AI on this"
    at: "Get AI on this. First, your product feed"
  - title: "What we don't know"
    at: "No UK date for in-app checkout"
  - title: "The takeaway"
    at: "So the takeaway: start with search"
---

James and Hannah go through the AI ad tools Meta and TikTok announced at
Advertising Week New York on 5 and 6 October 2026, and sort what UK paid social
teams can use now from what's still a test. TikTok Search Ads is live in the
UK, Meta's video generation from still images is generally available with no
markets named, and in-app checkout on both platforms has no UK date. They cover
the ads MCP servers that let outside AI agents work inside ad accounts, why both
platforms' performance claims need a holdout test, what checkout means for your
product data, and three jobs to hand to AI.

## Get AI on this

Paste these into whichever AI assistant you use: ChatGPT, Claude, Gemini or
Copilot. Swap the bracketed parts for your own details. The first two need file
uploads. The third works from what you type in, and needs no browsing.

### 1. Audit your product feed for checkout

```text
I run marketing for [brand], [one line on what you sell], selling mainly in
the UK.

Meta and TikTok are testing checkout inside their apps. TikTok's Shopping
Assistant answers product questions from information the merchant provides,
and Meta's checkout pulls products from Shopify Catalog. I want our product
data ready, with sizing, materials, returns terms and stock in plain text.

Attached is our product feed export: [file name, e.g. Shopify or Merchant
Center feed].

Go through it product by product and check each of these fields: title,
description, sizing, materials, returns terms, stock status.

Give me a table with the columns: Product ID | Product title | Missing or
unclear fields | What's wrong | Suggested fix.

Then, for the [number] products with the most gaps, draft the missing text in
plain language for our team to check. Don't invent sizes, materials or
returns terms: where the feed doesn't contain the fact, write "needs input
from [team]" instead. List any columns you couldn't read or any products you
skipped.
```

### 2. Build a TikTok Search test from proven terms

```text
We're planning a first TikTok Search Ads Campaign for [brand] in the UK. Our
rule is to start with search terms that already convert in Google Ads, follow
TikTok's suggested budget-to-bid ratio of 20 to 1, and measure lift with a
holdout.

Attached is our Google Ads search terms report for [date range], with
conversions and cost per conversion.

1. Pick the terms with the strongest conversion record. Leave out brand terms
   unless I say otherwise: [include / exclude brand terms].
2. Group them into [3 to 5] themes for ad groups.
3. For a total test budget of [£ amount per day], set a bid per ad group at a
   budget-to-bid ratio of 20 to 1, and show the working.
4. Suggest how to hold out a control so we can measure the lift TikTok Search
   adds.

Give me a table with the columns: Ad group theme | Search terms | Google Ads
conversions | Google Ads cost per conversion | Suggested daily budget |
Suggested bid. Follow it with the holdout plan in under 150 words.

Say if the report is too small to pick terms with confidence, and flag any
column you couldn't find rather than estimating it.
```

### 3. Draft the rules for AI agents in your ad accounts

```text
I lead paid social at [brand]. We're considering connecting AI tools to our
Meta and TikTok ad accounts through their MCP servers (Model Context
Protocol, the standard that lets an outside AI tool read and act on an ad
account).

What I know: Meta's ads MCP server stages work as drafts and every action
needs explicit approval, and a business portfolio admin can set rules on what
agents may change. TikTok's MCP server authorisation lapses after 30 days.

Our team: [names and roles of who runs paid social, who signs off budgets,
who owns brand].
Accounts we'd connect: [list of Meta and TikTok ad accounts].
AI tools we're considering: [list].

Draft a one-page agent policy with these headings:
1. Who may authorise an MCP connection
2. What agents may do at first (reporting only)
3. What agents may change later, with limits on budget and targeting changes
4. Who approves each type of change
5. Monthly review, timed to TikTok's 30-day authorisation

Write it as plain rules a new team member could follow. Mark every limit or
name you've had to assume as [to confirm]. Don't describe settings in Meta or
TikTok that I haven't told you about; list what I'd need to check in each
platform instead.
```

### And one for you

Have a named person read the agent policy and sign it before anyone connects
an AI tool to an ad account. An AI can draft the rules, but who's accountable
for an agent's changes is a decision for your team.
