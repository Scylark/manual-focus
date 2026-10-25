---
post: meta-crawling-terms-delay-uk-advertisers
title: "Meta's crawling terms delay, what UK advertisers should do now"
chapters:
  - title: "Cold open"
    at: "A week ago we told you"
  - title: "What Meta announced"
    at: "So on Friday the twenty-third of October"
  - title: "Which date applies in the UK"
    at: "Here's the bit that confuses things"
  - title: "The word Meta removed"
    at: "Now the word"
  - title: "Robots.txt and Meta's crawlers"
    at: "Then robots.txt"
  - title: "Our view, and who gains time"
    at: "Our view at Manual Focus is that the delay changes the deadline"
  - title: "Get AI on this"
    at: "Right. Get AI on this"
  - title: "What we don't know"
    at: "What we don't know yet"
  - title: "The takeaway"
    at: "So, same plan, new date"
---

James and Hannah update last week's episode on Meta's website-crawling terms.
Meta told Reuters on 23 October 2026 that the new Commercial Terms and
Self-Serve Ad Terms will take effect on 20 November instead of 30 October,
though the UK English preview still showed 30 October on 25 October. Meta has
removed the word train, so the UK and US editions now match, but the licence
to crawl and use test credentials on sites linked to your ads is unchanged and
the terms still don't mention robots.txt. They cover why the robots.txt plan
stands, who gains most from the extra weeks, and three jobs to hand to AI.

## Get AI on this

Paste these into whichever AI assistant you use. Swap the bracketed parts for
your own details. The first and third need an assistant that can open web
pages, and the third also needs one that can run on a schedule.

### 1. Check robots.txt for Meta's crawlers

```text
I run marketing for [brand] at [main website], selling mainly in [market].

Meta's new Commercial Terms let it crawl any site associated with our products
or services. We want to block Meta-ExternalAgent, which Meta says crawls for
uses such as training foundation AI models, on sites that carry licensed or
customer content, while keeping Meta-WebIndexer and FacebookExternalHit
allowed.

Here are the domains linked from our Meta ads, catalogues and Business Suite:
[paste list]. For each, tell me which hold licensed photography, creator
content or customer reviews: [mark them, or say "unknown"].

Open each domain's /robots.txt and give me a table with the columns: Domain |
Licensed or customer content (yes, no, unknown) | Meta-ExternalAgent
(blocked, allowed, not mentioned) | Meta-WebIndexer | FacebookExternalHit |
Lines to add or change.

Then write the exact robots.txt lines for each domain that needs a change. If
you couldn't open a robots.txt file, say so in that row rather than guessing.
```

### 2. Re-brief legal on the new wording

```text
I run marketing for [brand]. Our legal team reviewed Meta's new Commercial
Terms against our content licences before the original 30 October date, and
Meta has since changed the wording and moved the date to 20 November 2026.

Here is the UK clause as it read on 17 October: [paste old wording]. Here is
the clause as it reads now: [paste current wording from Meta's UK preview].
Here are the types of content on our product pages and the licences behind
them: [list, e.g. studio photography, creator content, customer reviews].

Write a one-page note for legal with three sections: what changed in the
wording, what stayed the same, and the questions to put to Meta about whether
"develop" and "research" allow uses our licences forbid. Quote the clause
exactly where you rely on it. Don't give a legal conclusion, and say where the
wording is unclear rather than interpreting it.
```

### 3. Watch Meta's terms until 20 November

```text
Set this up as a routine that runs every three days until 20 November 2026.

Open Meta's Commercial Terms previews in UK English
(en-gb.facebook.com/legal/commercial_terms_preview) and US English
(www.facebook.com/legal/commercial_terms_preview). On 25 October the US page
showed an effective date of 20 November 2026 and the UK page showed
30 October 2026, and both said Meta may use content from associated sites to
"provide, develop, improve, research and maintain advertising and business
products".

Each run, record for each page: the effective date shown, the purpose sentence
of the crawling clause word for word, and whether the page mentions
robots.txt. Compare with the last run and tell me in three lines or fewer what
changed, or "no change". If a page won't open, say so rather than reporting no
change.
```
