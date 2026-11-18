---
post: go-to-market-automation-claude-apollo-basics
title: "Go-to-market automation, a basics guide with Claude and Apollo"
length: long
chapters:
  - title: "Cold open"
    at: "A plan that never reaches a buyer is a document"
  - title: "Where the helmet left us"
    at: "So the helmet episode ended with three things"
  - title: "A software launch"
    at: "A hypothetical British software start-up"
  - title: "Growth strategy or growth tactic?"
    at: "Then let's do strategy against tactics"
  - title: "Positioning in a new SaaS company"
    at: "In a young SaaS company, the position is usually a hypothesis"
  - title: "The ideal customer profile"
    at: "Step one is the ideal customer profile"
  - title: "The wide list in Apollo"
    at: "Step two, then. The wide list"
  - title: "AI research"
    at: "Step three is the one I'd call the heart of the method"
  - title: "The shortlist"
    at: "Step four is where the funnel narrows"
  - title: "Messages from the hierarchy"
    at: "They do, and this is the point where the two episodes really join up"
  - title: "Landing pages built in GitHub"
    at: "Step six is the part I think people are most curious about"
  - title: "The UK rules"
    at: "This is the UK part, and it matters"
  - title: "Inbox rules"
    at: "And there's a second set of rules that isn't law"
  - title: "Sequences"
    at: "So, step seven. The sequences"
  - title: "Measure and learn"
    at: "Step eight is measurement"
  - title: "SOSTAC brings it together"
    at: "So let's put the whole thing into SOSTAC"
  - title: "Get AI on this"
    at: "Get AI on this. Three jobs"
  - title: "Where people go wrong"
    at: "Then let's finish with where people go wrong"
  - title: "The plan on one page"
    at: "So let's do the plan on one page"
  - title: "The takeaway"
    at: "So the takeaway. Decide who you're for"
---

The second long-form Manual Focus Basics episode, and the second half of the
story that began with What is marketing. James and Hannah take a finished plan
to real buyers, following a hypothetical UK software start-up that sells
project-profitability software to architecture practices. They separate
growth strategy from growth tactics, then work through eight steps, the ideal
customer profile, a wide list from Apollo, AI research and scoring with
Claude, the shortlist, messages from the communication hierarchy, landing
pages built with Claude Code in GitHub, sequences, and measurement, before
pulling it together in SOSTAC. They cover the UK rules on B2B email, Google's
sender guidelines, GitHub's terms for hosting and the mistakes that most often
break the method. The start-up is an illustration, not a real company.

## Get AI on this

Paste these into whichever AI assistant you use: ChatGPT, Claude, Gemini or
Copilot. Swap the bracketed parts for your own details. The first needs an
assistant that can browse the web, or a connected prospecting database. The
third needs a coding assistant that can work in your repository.

### 1. Research and score the wide list

```text
I run go-to-market for [company], which sells [one line on the product] to
[type of business] in [market].

Our ideal customer profile is:
[paste the profile: industry, size, location, how they work, and the
situations that make our product matter now]

Attached is a list of companies (name, website, size, location). For each
company, research it against the profile using its own website, the work or
projects it shows, its current job postings and any recent news.

Give me a table with the columns: Company | Fit score (1 to 10) | Evidence for
the score (with a link to each source) | Reason to act now, if any (with a
link) | Legal form if you can find it (limited company, LLP, partnership, sole
trader, unknown) | Which of our supporting messages suits it | What you
couldn't check.

Our supporting messages are: [paste them].

Rank by fit score. Don't give a score you can't back with a source. If a
website is thin or you couldn't open it, say so and mark the score
"insufficient evidence" rather than guessing.
```

### 2. Draft the messages for one segment

```text
I'm writing outbound email for [company] to one segment: [describe the
segment and its trigger, for example "practices that opened a second office
this year"].

Here is our communication hierarchy:
[paste the core message, supporting messages and the proof under each]

Here is our benefits ladder for the lead message:
[paste feature, benefit and emotional reason]

Claims we can make: [paste]. Claims we must not make: [paste].

Research notes for this segment: [paste the relevant rows from the research
table].

Draft an opening email and two follow-ups. Each one leads with a different
supporting message or a different piece of proof, never "just following up".
Keep each under 120 words, in plain British English, with one call to action
pointing to [landing page URL]. Every email must name the sender and include
a clear way to opt out.

After the drafts, list every claim you made and the proof it rests on, and
flag any line that goes beyond the claims list.
```

### 3. Build a landing page per segment

```text
You're working in our website repository. The landing page template is at
[path to template].

Build one landing page per segment below, from the template. Each page
repeats the message the segment was sent, shows the proof for it and has one
call to action. Don't add claims, numbers or customer names that aren't in
the brief.

Segments:
1. [segment name] | Message: [message] | Proof: [proof] | Call to action:
   [action and link] | Page path: [path]
2. [repeat for each segment]

Put each page on its own branch and open one change for review per page, with
a short description of what the page says. Don't publish or merge anything.
List anything in the brief you couldn't fit into the template.
```

### And one for you

Before anything sends, check each account's legal form and keep an
opt-out list that every new list is screened against. Sole traders and some
partnerships are treated as individuals under PECR, and the ICO's B2B guidance
is under review after the Data (Use and Access) Act, so check it for updates.
