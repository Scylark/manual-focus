---
post: wattplan-messaging-hierarchy
title: "The WattPlan messaging house, how we built it and what it does"
chapters:
  - title: "Our own product, for once"
    at: "We don't usually turn the microphone on ourselves"
  - title: "Five levels of the house"
    at: "Five levels, each one proving the one above"
  - title: "The five claims the code corrected"
    at: "Older documents said more than a hundred workouts"
  - title: "Four readings of Train. Adapt."
    at: "Four readings in two words"
  - title: "Where each message goes"
    at: "The house maps a path"
  - title: "What the house refuses to say"
    at: "Then the longest section, which is about silence"
  - title: "Get AI on this"
    at: "get AI on this"
  - title: "What the house hasn't settled"
    at: "It ends with open decisions"
  - title: "The takeaway"
    at: "So the takeaway. One document"
---

James and Hannah go inside the messaging house for WattPlan, the cycling
training app Manual Focus builds. It has five levels, from the two-word
tagline Train. Adapt. down to a proof row for every feature that names the
code behind it, and writing it that way caught five stale claims before they
reached a store listing. They cover the four readings of the tagline, the
routing table that decides which benefit leads on each surface, the three
banned vocabulary lists, and three jobs to hand to AI if you are building a
house for your own product.

## Get AI on this

Paste these into whichever AI assistant you use: ChatGPT, Claude, Gemini or
Copilot. Swap the bracketed parts for your own details. The first two need
file uploads. The third needs an assistant that can run on a schedule, or a
calendar reminder to run it on release day.

### 1. Write the proof column

```text
I run marketing for [product], [one line on what it does] at [website],
selling mainly in [market]. I'm building a messaging house, a one-page
hierarchy where every customer-facing claim traces to a feature the product
ships today.

Attached are:
- our feature documentation, or the codebase (attach the repository, or
  export the feature list and settings)
- every piece of live customer copy we have (store listings, website pages,
  onboarding screens, emails, release notes), as text files

Go through the copy and list every claim it makes about what the product
does. For each claim, find the feature, file, function or setting that
delivers it.

Give me a table with the columns: Claim | Where it appears | Feature or
code that delivers it | Status (shipped / partly shipped / not found).

Then list the orphans separately: every claim with nothing behind it, or
with a number the product no longer matches. For each orphan, suggest the
plainest truthful replacement. Don't guess at a feature you can't find in
the files; mark it "not found" and I'll check.
```

### 2. Audit live copy against the house

```text
Attached is our messaging house for [product]: the tagline, short
description, core claim, benefits, the vocabulary table (say this, not
that), the banned words and the claims we never make.

Also attached is our live customer copy: [store listing, website pages,
onboarding, emails, release notes].

Check every line of the copy against the house. Flag:
1. Any claim that doesn't trace to a benefit in the house.
2. Any banned word or phrase, including superlatives such as "the only",
   "most advanced" or "best", and any performance guarantee.
3. Any term the vocabulary table says to avoid, with the word to use
   instead.
4. Any surface that leads with a benefit other than the one the routing
   table assigns it.

Give me a table with the columns: Surface | Line as it stands | Rule it
breaks | Suggested rewrite. Keep each rewrite in the house's voice, with no
colons, dashes or exclamation marks. Where you're unsure whether a line
breaks a rule, say so rather than deciding for me.
```

### 3. Keep the house current on release day

```text
Run this every time we ship a release of [product], or set it as a routine
on release day.

Attached are our messaging house for [product] and the release notes or
changelog for the new version.

Compare the two and tell me:
1. Which claims in the house the release strengthens, and the new proof
   (the feature, file or setting) to record under them.
2. Which claims the release weakens or removes, so the claim should be
   retired or reworded the same day.
3. Any new capability in the release that the house doesn't yet mention,
   with a draft line for it that follows the house's rules (no superlatives,
   no guarantees, product vocabulary only).
4. Any free or paid tier change that affects the pricing section.

Give me the answer as a short list of edits to make to the house, each with
the section it belongs in. If the changelog doesn't say enough to decide,
say what you'd need to check rather than guessing.
```

### And one for you

Write the retired lines down with the reason each one went. The house
records both of WattPlan's, and it is the cheapest insurance against someone
reviving a dropped tagline from an old deck.
