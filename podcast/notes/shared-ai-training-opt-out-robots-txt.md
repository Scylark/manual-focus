---
post: shared-ai-training-opt-out-robots-txt
title: "What the shared AI training opt-out means for brand websites"
chapters:
  - title: "Cold open"
    at: "Until now, telling AI companies not to train"
  - title: "The shared token"
    at: "Start with the rule itself"
  - title: "Google and Microsoft's plans"
    at: "So what did Google commit to"
  - title: "Where an opt-out costs visibility"
    at: "Here's where I'd worry"
  - title: "Should a brand block training?"
    at: "So should a brand block AI training"
  - title: "Get AI on this"
    at: "Right, so what do you hand over"
  - title: "What we don't know"
    at: "What's still open"
  - title: "The takeaway"
    at: "So the takeaway. Leave training on"
---

James and Hannah talk through the shared AI training opt-out that Google and
Microsoft said on 30 October 2026 they will honour, a robots.txt token defined
in an IETF draft by Anthropic's Kevin Kelley. They cover how it works, why
Microsoft now separates training from grounding, the traps that could cost a
brand visibility in AI answers, and why most brands should allow training by
default and opt out only on the paths that carry content they sell or license.

## Get AI on this

Paste these into whichever AI assistant you use. Swap the bracketed parts for
your own details. All three need file uploads.

### 1. Map the content you sell or license

```text
I run marketing for [brand], [one line on what you sell] at [website], selling
mainly in [market].

We want to opt out of AI training only on the parts of our site that carry
content we sell, license or keep behind a login, and leave everything else
open. The shared robots.txt token for this is __usage_ai-training, and it works
by path with ordinary Disallow and Allow lines.

Attached are:
- our sitemap or a crawl export listing every URL
- a short note on what we sell or license (paid reports, member content,
  licensed images, customer data and so on)

Group the URLs by directory. For each directory, tell me whether it looks like
it holds sold, licensed or gated content, and why.

Give me a table with the columns: Directory | Example URLs | Number of URLs |
Sold, licensed or gated? (yes, no, unsure) | Reason.

Then draft the robots.txt group for the token that disallows only the
directories marked yes. List every directory marked unsure separately so a
person can check it against our contracts. Don't guess what a page contains
from its URL alone if you can't see it; mark it unsure.
```

### 2. Find old Bing NoArchive and NoCache tags

```text
Microsoft Bing is replacing its NoArchive and NoCache tags with new AI Training
and AI Grounding preferences, and will stop reading the old tags as AI
preferences after 1 March 2027.

Attached are our page templates and a sample of HTTP response headers from
[website].

Find every place where a NoArchive or NoCache instruction appears, in a robots
meta tag or an X-Robots-Tag header.

Give me a table with the columns: Template or URL | Where it appears (meta tag
or header) | Exact instruction | Which page types use this template.

Then list the questions our team has to answer for each one before 1 March
2027: do we want these pages used for AI training, and do we want them used to
inform AI answers. If a template includes others you can't see, or a header
sample is incomplete, say so rather than assuming it's clean.
```

### 3. Check a robots.txt change before it ships

```text
Set this up as a check we run every time someone edits our robots.txt.

Attached are our current robots.txt and the proposed new version for
[website].

For each file, explain in plain English what each named crawler group and the
__usage_ai-training token allows and disallows, and which paths are affected.
Remember that a User-Agent: * group does not count as a training preference
for the token, that Google plans to read a token-only opt-out as a
Google-Extended disallow, and that an explicit Google-Extended Allow lets
Google train on the allowed paths.

Give me a table with the columns: Group | Current rules | Proposed rules |
What changes in plain English.

Then flag, at the top, anything in the proposed file that would stop Googlebot
or Bingbot crawling pages we want in search, any syntax that looks malformed,
and any Google-Extended Allow that covers a path where we opted out of
training. If you can't tell how a particular crawler reads a rule, say so
rather than guessing.
```
