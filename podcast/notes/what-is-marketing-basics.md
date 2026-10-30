---
post: what-is-marketing-basics
title: "What is marketing, a basics guide from market fit to SOSTAC"
length: long
chapters:
  - title: "Cold open"
    at: "Ask a room of people what marketing is"
  - title: "What marketing is"
    at: "Then let's define the job"
  - title: "Is there a market?"
    at: "So, to the helmet. Where does it start"
  - title: "Market research"
    at: "And this is where cyclists stop being a category"
  - title: "Positioning and saying no"
    at: "Saying no is the part people find hardest"
  - title: "Product requirements"
    at: "Now the brief. Product requirements"
  - title: "The communication hierarchy"
    at: "And there are two tools here"
  - title: "The benefits ladder"
    at: "And then the benefits ladder sits under that"
  - title: "Channels"
    at: "Now the part most people think marketing is"
  - title: "Campaign, creative and PR"
    at: "Then the launch itself"
  - title: "After the sale"
    at: "Before we get to the plan, can I ask"
  - title: "SOSTAC brings it together"
    at: "And the plan that holds it all together"
  - title: "Where AI fits"
    at: "Now AI. And the honest answer"
  - title: "Get AI on this"
    at: "Get AI on this. First, the research synthesis"
  - title: "Where people go wrong"
    at: "Then let's finish with where people go wrong"
  - title: "The helmet plan on one page"
    at: "So let's do it for the helmet, in one go"
  - title: "The takeaway"
    at: "So the takeaway. Marketing is identifying"
---

A long-form Manual Focus Basics episode that pulls the series together into
one answer to "what is marketing?". James and Hannah start from the Chartered
Institute of Marketing's definition, then follow a hypothetical new cycling
helmet from the first question, is there a market, through market research,
the product requirements brief, the communication hierarchy and the benefits
ladder, then into the channels, the launch campaign, the creative and the PR,
and finally a SOSTAC plan to run and measure it. They finish on where AI fits at each step and
the mistakes that most often break the chain. The helmet and its findings are
an illustration, not a real launch.

The next long Basics episode, Go-to-market automation, picks up where this one
stops and takes a finished plan to real buyers with Claude, Apollo and landing
pages built in GitHub.

## Get AI on this

**1. Turn your research into findings.** Attach your review exports, a set of
forum threads and your customer interview transcripts.

```text
You are helping the marketing team at [brand], which sells [product category]
in [market], prepare for the launch of [new product].

I've attached customer reviews, forum threads and interview transcripts.
Read all of them and find:
1. The purchase triggers, the moments or needs that lead someone to buy in
   this category.
2. The complaints people have about what they use now.

Return a table with the columns: Trigger or complaint | How many sources
mention it | Two verbatim quotes | Source file. Rank by how often it comes up.

Then write three or four findings, one sentence each, with the evidence from
the table under each one.

Finally, list the groups of people the material doesn't cover (for example,
people who don't buy in the category yet) and say what you couldn't check.
Don't invent quotes or counts. If something appears only once, say so.
```

**2. Draft a benefits ladder for every feature.** Attach the product
specification, your research findings and the interview transcripts.

```text
You are helping the marketing team at [brand] write launch messaging for
[new product].

I've attached the product specification, our research findings and
customer interview transcripts.

For each feature in the specification, build a benefits ladder:
- Feature: the feature as specified.
- Benefit: what it does for the buyer, in plain words.
- Emotional resonance: two or three options for why that benefit matters to
  the buyer as a person.

Every emotional line must be tied to something a customer actually said in
the transcripts. Quote the line it's based on. If no customer said anything
that supports an emotional rung for a feature, say so rather than writing
one.

Return a table with the columns: Feature | Benefit | Emotional options |
Supporting quote | Research finding it traces to.

Flag any line that promises more than the feature can prove, and any feature
that traces to no research finding.
```

**3. Check launch copy against the communication hierarchy.** Run it before
each launch phase goes live. Attach the hierarchy and every piece of copy.

```text
You are checking launch copy for [brand]'s [new product] against its
communication hierarchy.

Attached are:
1. The communication hierarchy: one core message, three or four supporting
   messages and the proof points under each.
2. Every piece of launch copy: ads, emails, social posts, the product page.

For each piece of copy, return a row with the columns: Piece | Channel |
Message it leads with | Which hierarchy level that is | Supporting messages
it includes | Anything it says that isn't in the hierarchy.

Then list:
- Pieces that lead with something other than the core message, where the
  channel has room for only one message.
- Supporting messages that never appear in any piece.
- Claims in the copy that no proof point supports.

If you can't tell which message a piece leads with, say so rather than
guessing.
```
