---
post: meta-commercial-terms-crawling-uk-advertisers
title: "What Meta's new crawling terms mean for UK advertisers"
chapters:
  - title: "Cold open"
    at: "On the thirtieth of October"
  - title: "What the clause says"
    at: "So what does the new clause actually say"
  - title: "Where it came from"
    at: "Where did this come from"
  - title: "The UK version"
    at: "Which brings us to the bit I think matters most"
  - title: "Who's exposed"
    at: "Let's talk about who's exposed"
  - title: "Our view"
    at: "Our view is that you don't pull Meta spend"
  - title: "Get AI on this"
    at: "Get AI on this. First job"
  - title: "What we don't know"
    at: "What we don't know yet"
  - title: "The takeaway"
    at: "So, thirteen days"
---

James and Hannah read through the new clause in Meta's Commercial Terms, which
takes effect on 30 October 2026 and lets Meta crawl the websites associated
with a business's products. They cover why the UK English edition names AI
training when the US edition doesn't, which teams carry the exposure, what
each of Meta's four crawlers does, why blocking one of them is only a partial
control, and three jobs to hand to AI before the deadline.

## Get AI on this

Paste these into whichever AI assistant you use: ChatGPT, Claude, Gemini or
Copilot. Swap the bracketed parts for your own details. The first and third
need file uploads. The second needs an assistant that can browse the web.

### 1. Find every domain Meta's terms could cover

```text
I run marketing for [brand], [one line on what you sell], selling mainly in
[market].

Meta's updated Commercial Terms, effective 30 October 2026, let Meta crawl the
domains, web pages and URLs "associated with your products or services". I
need a complete list of our domains that could fall under that.

Attached are:
- an export of our Meta ads with their destination URLs
- our Meta catalogue or product feed settings, including product URLs
- the list of websites and domains connected in our Meta Business Suite

List every distinct domain and subdomain these point to, including
microsites, regional stores, help centres and campaign pages.

Give me a table with the columns: Domain | Where it appears (ads, catalogue,
Business Suite) | Example URL | Who owns it (us, a retailer, a partner, or
"unknown").

Don't guess at domains that aren't in the files. If a URL is shortened,
redirected or unreadable, list it in a separate "couldn't check" table.
```

### 2. Audit robots.txt against Meta's four crawlers

```text
Here is our list of domains: [paste the domain column from the first prompt].

For each domain, open its robots.txt file and tell me what each of these
Meta user agents is currently allowed to crawl:
- meta-externalagent (Meta says it crawls for uses such as training
  foundation AI models)
- meta-webindexer (Meta says it improves Meta AI search results)
- meta-externalfetcher (fetches links at a user's request, and Meta says it
  may bypass robots.txt)
- facebookexternalhit (fetches pages shared on Facebook, Instagram and
  Messenger, and Meta says it may bypass robots.txt for security or
  integrity checks)

Give me a table with the columns: Domain | meta-externalagent |
meta-webindexer | meta-externalfetcher | facebookexternalhit | Rule that
applies (quote the line, or "no rule, default allow").

Then, for each domain I mark as carrying licensed or customer content
([list those domains]), draft the robots.txt lines that would disallow
meta-externalagent while leaving meta-webindexer and facebookexternalhit
allowed. Note that this limits one crawler and isn't a confirmed opt-out
from training.

If a robots.txt file won't load or redirects somewhere odd, say so in that
row rather than assuming.
```

### 3. Draft the questions for Meta and the brief for legal

```text
I run marketing for [brand] in [market]. Meta's updated Commercial Terms take
effect on 30 October 2026. Attached are the clause from the UK English
edition under "Licences and rights you provide Meta" and a list of the
content types on our websites and the licences we hold for them
(photography, creator content, customer reviews, editorial).

Draft two things.

1. An email to our Meta representative, under 200 words, asking in writing:
   whether a robots.txt block narrows the licence we grant under the clause,
   what "test credentials" can access, what "associated with your products or
   services" covers, and why the UK and US English editions word the purpose
   differently.

2. A one-page brief for our legal team that quotes the clause, lists each
   content type on our sites, and flags any licence in the attached list
   that might forbid passing content to a third party for AI training. Give
   the flags as a table with the columns: Content type | Licence or source |
   Possible conflict | Question for legal.

Only use what is in the attached clause and licence list. Where a licence's
terms aren't in the file, mark it "terms not supplied" rather than guessing.
```

### And one for you

Write down which Meta crawlers you block on which domains and why, and put it
in your brand rules so every new microsite starts with the same setting. If
you do block anything, check catalogue and ad delivery for a fortnight
afterwards.
