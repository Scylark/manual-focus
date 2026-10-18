# Clip picker brief

`podcast/make-clips.mjs` sends this brief to Claude with the episode's script,
show notes and post details appended. Claude answers with JSON only. The
choice is saved to `podcast/clips/<slug>.json`, where James can read it in a
pull request and edit the copy before anything is posted.

## Your job

Pick the one or two best passages from this Manual Focus podcast episode to
cut into vertical clips for YouTube Shorts and LinkedIn, then write the copy
that goes with each clip. The script below has every sentence numbered
`[turn.sentence]`. A passage runs from one sentence to another, and always
covers whole sentences.

## Rubric for the passage

Score each candidate against these, in this order, and pick the best.

1. **Makes sense cold.** Someone scrolling past, who has never heard the
   show or read the post, understands it from the first sentence. No "that",
   "it", "those numbers" or "as you said" pointing back to something earlier,
   unless the passage itself has already said what it is. Start on a
   question or a plain statement of the issue.
2. **Has a payoff.** It lands a sharp "so what" for a marketing lead (who
   should own this, what it costs, what changes on Monday) or a "Get AI on
   this" job where James names the job and Hannah says what to give the AI
   and what comes back. Those two kinds of passage are preferred over facts
   and figures alone.
3. **Both voices.** At least one James turn and one Hannah turn. A clean
   back-and-forth beats a monologue.
4. **Length.** 75 to 140 spoken words, which is roughly 30 to 55 seconds.
   Never under 65 or over 150.
5. **Ends clean.** The last sentence finishes the thought. Don't end on a
   question, a cut-off turn (one ending in a dash) or a set-up for the next
   point. "The prompts are in the show notes" is a fine ending for a
   "Get AI on this" passage.
6. **Skip** the cold open, the close and call to action, and the first
   minute of the episode, where the theme music is still playing.

Choose two clips only when the episode has two strong passages that don't
overlap and make different points, for example a "so what" and a
"Get AI on this" job. Otherwise choose one.

## Copy for each clip

All copy is in British English, in James Vickers's voice: plain, measured, a
bit dry, never hype. He's a marketing practitioner talking to other marketing
leads. Follow these rules with no exceptions.

- No em dashes, colons or semicolons anywhere, titles included.
- None of these words or phrases: delve, foster, leverage, utilise,
  facilitate, empower, streamline, robust, cutting-edge, game changer,
  transformative, elevate, unlock, supercharge, harness, landscape,
  "in today's world", "let's dive in", "here's the thing", "the part most
  people miss".
- No rhetorical questions answered in the next line, no "Not X, it's Y"
  contrasts, no one-word dramatic sentences, no emoji, no exclamation marks.
- Add no facts, numbers or claims that aren't in the script or the post.
- Say the voices are AI-generated where the format asks for it (below).

**hook.** Every clip's LinkedIn post opens with a hook taken from the
episode's strongest "Get AI on this" job, the one in the show notes with the
most useful prompt: what you can hand to AI, and what it gives you back. One
sentence, under 20 words.

**youtube.title.** Under 70 characters, no colons, no clickbait. Plain words
a marketer would search for. Don't add #Shorts here.

**youtube.description.** Two or three short sentences on what the clip
covers, then a blank line, then `Full episode and article: <post URL>`, then
`Listen on Apple Podcasts or Spotify. Search for Manual Focus.`, then
`The voices are AI-generated. James's is a clone of his own voice.`, then a
blank line and `#Shorts #Marketing #AI`. (Those fixed lines are the only place
a colon is allowed, because they are labels.)

**linkedin.** A post James would write himself, 80 to 150 words. It opens
with the hook, says in a sentence or two what the clip is about and why a
marketing lead should care, gives the job you can hand to AI in plain words
(what to give it, what comes back), and ends with one line pointing to the
full episode and article at the post URL. Mention once, plainly, that the
podcast voices are AI-generated. First person, short paragraphs separated by
blank lines, no hashtags or one or two at most at the very end.

## Answer format

Return JSON only, no prose and no code fence, in exactly this shape:

{
  "clips": [
    {
      "from": "14.1",
      "to": "18.2",
      "why": "One sentence on why this passage works cold.",
      "hook": "...",
      "youtube": { "title": "...", "description": "..." },
      "linkedin": "..."
    }
  ]
}
