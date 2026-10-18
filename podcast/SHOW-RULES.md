# Manual Focus podcast: show rules

Every blog post gets a companion episode: a two-host conversation that talks
the article through for people who'd rather listen. These rules apply to every
script. The scripts live in `podcast/scripts/<post-slug>.txt` and
`podcast/build-episode.mjs` turns them into audio with ElevenLabs.

## Making an episode

1. Write `podcast/scripts/<post-slug>.txt` and `podcast/notes/<post-slug>.md`
   to these rules, then run `node podcast/check-episode.mjs <post-slug>`
   until it prints PASS. `node podcast/preflight.mjs` says whether this
   machine has the keys and tools for the next two steps.
2. `node podcast/build-episode.mjs <post-slug>` voices it with ElevenLabs and
   mixes in the theme music. Output: `podcast/out/<post-slug>.mp3`.
3. `node podcast/publish-episode.mjs <post-slug>` uploads the MP3 to the
   `manual-focus-podcast` R2 bucket, served by the Worker in
   `podcast/worker/`, and adds the `podcast` block to the post's
   frontmatter. The player and the feed (`/podcast.xml`) appear on the next
   site build.
4. `node podcast/chapters.mjs <post-slug>` times the chapters in the show
   notes against the published audio and writes
   `podcast/chapters/<post-slug>.json`, which the feed links with
   `<podcast:chapters>`.
5. `node podcast/make-clips.mjs <post-slug>` cuts one or two vertical clips
   for YouTube Shorts and LinkedIn, with their copy. See `podcast/CLIPS.md`.
6. Once the "Manual Focus Marketing" YouTube channel (@manualfocusuk) has
   imported the episode from the feed, add `youtube: <video ID>` to the
   post's `podcast` block. The episode's structured data then carries a
   VideoObject for the YouTube version.

## The hosts

**James Vickers (JAMES).** Marketing expert and founder of Manual Focus. He
brings the practitioner's view: what a head of marketing would do on Monday
morning, what it costs, who in the team owns it, and where the hype doesn't
match what he's seen with clients. He opens and closes each episode and asks the
questions a sharp marketing lead would ask.

**Hannah (HANNAH).** The Manual Focus AI expert. She explains how the
technology works, what the announcement or research actually says, and where
the evidence stops. She takes the hard questions and pushes back when James
oversimplifies.

They're both experts and they talk as peers. Neither of them plays the novice,
and neither lectures. James knows marketing better, Hannah knows AI better, and
the episode works where those two meet.

## Who it's for

Marketers at every level, from a junior content executive to a CMO. Explain any
term the first time it comes up, in a clause, without stopping the
conversation ("Preferred Sources, the setting that lets a reader pick sites
they trust..."). Never assume the listener has read the article.

## Evidence: name it, don't drown in it

Cite the evidence the way you'd mention it over a coffee, not the way a paper
does. One or two sources per point at most, with the publisher named so a
listener could find it:

> "We went through Google's own announcement and the Search Central docs, and
> what they show is..."
>
> "Search Engine Journal checked Google's help page on the fifteenth, and it
> listed the US, Canada and India only."

Say what the evidence doesn't show as plainly as what it does. If Google gave
no numbers, say so. Every claim must come from the article or its listed
sources, or from an earlier Manual Focus post the hosts name on air (see
"Connect the dots"). The script adds no other facts, figures or quotes.

## Connect the dots

Before writing, read what Manual Focus has already said on the subject, so
the hosts can join this episode to earlier ones the way regular presenters
would.

- Read every Manual Focus post the article links to, and the two or three
  most related posts (shared tags, same company or same channel). Where one
  of them has an episode, read its script in `podcast/scripts/` too.
- Use one to three of those links on air, where they add something: a trend
  building across weeks, an update to something covered before, a contrast
  with another platform's move, or the playbook that tells you what to do
  about it. "When we covered AI Overviews hitting eighty-two per cent of
  brand searches a couple of weeks ago..." is the shape.
- Name the earlier piece by its topic and roughly when, never by URL. Facts
  taken from an earlier post count as sourced, as long as the hosts say
  where they come from.
- If the new post updates or contradicts something said before, say so
  plainly. Don't paper over a change of view.
- Don't force it. A link that's only "we've talked about AI before" is
  filler; leave it out.

## Shape of an episode

About 6 to 8 minutes, roughly 900 to 1,100 words of script. Basics episodes
run longer; see "Basics episode" below.

1. **Cold open (JAMES, 2–3 sentences).** The news and why a marketer should
   care, then introduce the show and Hannah, in different words each time.
   There's no recorded intro or stock opening line. The theme music
   (`podcast/music/road-at-dawn.mp3`) plays alone for about five seconds and
   then sits under James's opening; the build script handles that, so the
   script never mentions music.
2. **What happened (mostly HANNAH).** The facts, with the source named.
3. **Two or three "so what" exchanges.** Follow the article's sections, each
   one starting from a question James would genuinely ask.
4. **Get AI on this (JAMES leads, HANNAH adds).** Not a to-do list for
   the listener. Take the article's actions and say what to hand to an AI
   instead, and what it gives back. See the next section.
5. **What we don't know yet (HANNAH).** The open questions.
6. **Close (JAMES, with HANNAH's sign-off).** One-line takeaway, point to
   the full article on manual-focus dot co dot uk, then the call to action.
   It has two parts and every episode needs both:
   - **Subscribe:** ask listeners to follow the show in Apple Podcasts,
     Spotify or wherever they listen, so the next episode turns up on its
     own.
   - **Reach out to Manual Focus:** if they want this applied in their own
     team, they can book a free working session at manual-focus dot co dot
     uk.
   Say it in James's own words, differently each time, in two or three
   sentences at most. It's an invitation, not an advert: no "smash that
   button", no hard sell. The closing music comes in under these last lines
   and finishes the episode, so end on a natural sign-off, not a set
   phrase.

## Basics episode

Posts tagged `basics` are evergreen explainers (the three layers of AI,
SOSTAC, owned, paid and earned media and so on), and their episodes are
longer: about 12 to 15 minutes, roughly 1,800 to 2,200 words of script.
`check-episode.mjs` reads the post's tags and applies these limits. They go
out on the same feed as every other episode; there's no separate show.
Everything else in these rules applies, with these changes to the shape:

1. **Cold open (JAMES).** The question the episode answers and who it's for,
   then the show and Hannah. Say it's part of the Basics series.
2. **First principles (mostly HANNAH).** Hannah explains the idea from the
   ground up, where it comes from and who coined it, naming the source the
   way the article does. Ideas from a named thinker (Seth Godin, PR Smith)
   are attributed on air and paraphrased, never quoted at length.
3. **How real teams use it (JAMES leads).** Three or four exchanges, one per
   part of the article, where James grounds each idea in how marketing teams
   actually work: who owns it, where it goes wrong, what it looks like in a
   plan or a brief. He speaks from the practitioner's view, but never invents
   a client, a result or a story; "in most teams" and "what you'll usually
   see" are fine, "a client of ours" is not.
4. **Connect the dots.** Join the episode to the rest of the Basics series and
   to the earlier posts it builds on, as in the daily episodes.
5. **Get AI on this.** As for every episode: two or three jobs, show-notes
   line at the end.
6. **Where people go wrong (HANNAH and JAMES).** The common mistakes, in place
   of "What we don't know yet", unless the topic has real open questions.
7. **Close.** As for every episode, including both parts of the call to
   action.

Turns can run a little longer when Hannah is explaining a concept, but keep
each under about 30 seconds and let James interrupt with the question a
listener would ask.

## Get AI on this

It's model-agnostic: we say "AI" or "your AI" on air, never one brand,
because listeners use whatever their company pays for.

This is the show's signature segment and the thing that makes it Manual Focus.
Most marketing podcasts end with a list of jobs for the listener. We end with
the jobs you can hand to AI, because that's how we think marketing teams
should work now: build the thing that does the task, don't do the task.

- Pick two or three of the article's actions that an AI can genuinely do or
  do most of: pulling and sorting data, auditing pages, drafting, setting up a
  recurring check. Leave out anything that needs a human decision or a
  sign-in, or say plainly which part stays with a person.
- On air, James names the job in a sentence, starting "Get AI on this",
  and Hannah says what to give it and what comes back ("Give it your Search
  Console export and your help-desk tags, and it hands you the top ten tasks
  ranked by volume").
- Don't read prompts out. Close the segment with: "The prompts are in the show
  notes."
- If a job should run on a schedule, say so ("set it as a fortnightly
  routine") rather than implying someone will remember to do it.

### Show notes

Each episode has `podcast/notes/<post-slug>.md`: a one-paragraph summary, then
a **Get AI on this** section with one ready-to-paste prompt per job mentioned
on air. The notes render under the post, which already lists its sources and
links, so don't repeat those; the podcast feed adds the article link and
sources from the post itself. Each prompt:

- states the goal and the context the model needs (who we are, which site, which
  market);
- says what to attach or connect (a Search Console export, the help-desk tag
  report, the URL list);
- describes the output exactly (a table with named columns, a ranked list, a
  draft page);
- tells the model to say what it couldn't check rather than guess;
- works in any capable assistant (ChatGPT, Claude, Gemini, Copilot), so it
  names no product features. Where a job needs browsing or a schedule, say
  that the tool needs those, not which tool has them.

Prompts follow the article. They add no facts, numbers or claims the article
doesn't make.

### Chapters

The notes' frontmatter also holds the chapter plan, which podcast apps show
as jump points. One chapter per section of the episode's shape: the cold
open, what happened, each "so what" exchange, Get AI on this, what we don't
know (or where people go wrong) and the takeaway.

```yaml
chapters:
  - title: "Cold open"
    at: "The search results for your own company name"
  - title: "What the data shows"
    at: "They're striking numbers"
  - title: "Get AI on this"
    at: "so what do you hand over"
```

- `title` is what a listener sees in the app: short, plain, and specific to
  the episode where it can be ("What Google announced", not "The news").
- `at` is a phrase copied from the script where the chapter starts: the
  opening words of the turn, or the sentence mid-turn that changes the
  subject. Tags and punctuation don't matter; the words must match.
- The first chapter starts at the script's first words. Sections shorter
  than about twenty seconds fold into the one before.

`check-episode.mjs` fails a plan whose phrases aren't in the script, in
order. `chapters.mjs` times the plan once the episode is published.

## Writing for the ear

- Turns of 1 to 4 sentences. Nobody speaks for more than about 30 seconds.
- Write numbers the way they're said: "eighty-two per cent", "the fifteenth of
  October". The voices read digits badly.
- No tables, URLs, bullet points or "as you can see". Turn a table into "two
  are live, one's rolling out, and two are tests".
- Contractions throughout. Short reactions ("Right.", "That's the bit I'd
  worry about.") are fine but no more than one every few turns, and never
  "Great question" or "Absolutely".
- The no-slop rules for the blog apply here too: no "game-changer", "in
  today's fast-paced landscape", "let's dive in", or tidy three-part
  summaries.
- British English, Manual Focus voice: grounded, practical, a bit dry.

## Delivery cues

Episodes are voiced with ElevenLabs' v3 dialogue model, which reads audio tags
in square brackets as performance directions. Use them sparingly, where a
real host would do it, at most one every few turns:

- reactions: `[laughs]`, `[chuckles]`, `[sighs]`
- tone: `[thoughtfully]`, `[dryly]`, `[curious]`, `[excited]`
- pacing: `[pause]`, and an em dash at the end of a turn for a cut-off
  ("Right, and the bit that worries me is—")

**James stays measured.** He's calm, dry and considered, never over-excited.
His tags are limited to `[thoughtfully]`, `[dryly]`, `[calmly]`, `[pause]` and
the odd `[chuckles]`. Never `[excited]`, `[enthusiastic]` or `[laughs]` on a
James line, and no exclamation marks in his turns. Hannah can be a shade
warmer, but she's an expert, not a presenter.

Put the tag at the start of the words it colours. Never tag every line, and
never use a tag to fake a joke the words don't make.

## Script format

One line per turn, speaker in capitals, blank line between turns:

```text
JAMES: ...

HANNAH: ...
```

Nothing else in the file: no stage directions, headings or notes, other than
the audio tags above. `node podcast/build-episode.mjs <post-slug>` voices it.

## Disclosure

Both voices are AI-generated (James's is a clone of his own voice, Hannah's is
a synthetic voice). The episode show notes and the player on each post say so.
