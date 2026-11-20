---
post: gemini-4-hydrogen-google-search-seo-teams
title: "What Gemini 4 Hydrogen in Google Search means for SEO teams"
chapters:
  - title: "Cold open"
    at: "If your search report looks odd this week"
  - title: "What Google announced"
    at: "Start with what Google said"
  - title: "How query fan-out works"
    at: "Explain fan-out for anyone who hasn't met it"
  - title: "What it means for content teams"
    at: "So, the so what for a content team"
  - title: "The measurement problem"
    at: "Now the measurement problem"
  - title: "Get AI on this"
    at: "So what do you hand over"
  - title: "What we don't know"
    at: "Hannah, what don't we know"
  - title: "The takeaway"
    at: "So the takeaway"
---

James and Hannah talk through Gemini 4 Hydrogen, which Google made available
to every Google Search user worldwide on 12 November 2026 and called the
biggest model upgrade Search has had. They explain query fan-out, why a wider
fan-out rewards brands with a page or section for each question buyers ask,
and why this week's Search data is hard to read, with a core update from 10
November and a Search Console logging error from 9 to 11 November. Then three
jobs to hand to AI so you can set a new baseline.

## Get AI on this

Paste these into whichever AI assistant you use. Swap the bracketed parts for
your own details. The first needs an assistant that can browse the web and run
on a schedule, and the other two need file uploads or browsing.

### 1. Rebuild your prompt set and check it weekly

```text
I run marketing for [brand], [one line on what you sell] at [website], selling
mainly in [market]. Our main competitors are [competitor 1], [competitor 2]
and [competitor 3].

Google now builds AI Mode answers by splitting a question into several
subtopic searches. I want to track how we appear for the long, specific
questions buyers ask before they choose a brand.

Step 1. Write 25 questions a buyer in [market] might type into Google before
choosing a [product category]. Each should combine at least two of budget,
fit or size, use case, conditions and comparison with an alternative. Avoid
our brand name and competitor names. Show them as a numbered list and wait for
me to approve or edit them.

Step 2. Once I approve the list, set this up as a routine that runs every
Monday morning until [end date]. For each question, search Google in AI Mode
from a [market] location and record:
- every brand the answer names, in order
- every website the answer links to, in order
- whether [website] is linked, and which page

Give me a table with the columns: Date | Question | Brands named | Sites
linked | Our page linked (URL or "no") | Competitors linked.

After each run, list what changed since the previous week. If AI Mode didn't
show an answer or wouldn't load for a question, say so in that row rather than
leaving it blank or guessing.
```

### 2. Map the fan-out gaps

```text
I run marketing for [brand] at [website], selling [product category] in
[market].

Attached are:
- our list of buyer questions (from our weekly AI Mode tracking)
- our sitemap or a list of our page URLs with their titles

For each question, list the three to six subtopics a search engine would
probably search separately to answer it (for example fit, terrain, price,
durability, care). Then check whether our site has a page, or a clearly
headed section on a page, that answers each subtopic directly.

Give me a table with the columns: Question | Subtopic | Our page or section
that answers it (URL and heading, or "none found") | How directly it answers
(direct, partial, buried).

Then list the subtopics with no page or only a buried answer, ranked by how
many questions they appear in. Base the coverage check only on the pages you
could open or the titles in the file, and say which pages you couldn't check.
```

### 3. Find the missing tables

```text
I run marketing for [brand] at [website].

Attached is a list of our 20 most important product and guide pages.

Google says its AI answers now show more comparison tables, so I want the
facts on our pages laid out in a form it can lift.

For each page, find any specifications, sizes, prices, compatibility details
or comparisons written in paragraphs or bullet points rather than in a table.

Give me:
1. A table with the columns: Page URL | Facts currently in prose | Suggested
   table (yes or no) | Why.
2. For each "yes", a draft HTML-ready table with a header row, using only the
   facts on the page. Don't add or round any figure.

Flag any page you couldn't open, and any fact that looked inconsistent between
pages, rather than choosing one yourself.
```

### And one for you

Add three annotations in your analytics and SEO reports: 10 November 2026 for
the core update, 12 November for Gemini 4 Hydrogen, and 9 to 11 November for
the Search Console logging error. Then compare Search Console clicks with
Google referral visits in analytics weekly, so you can see which way each
moves.
