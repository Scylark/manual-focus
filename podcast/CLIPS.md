# Podcast clips

Every episode gets one or two vertical clips (1080x1920, 30 to 60 seconds)
for YouTube Shorts and LinkedIn, each with a Shorts title and description and
a LinkedIn draft in James's voice.

## Making them

```bash
node podcast/make-clips.mjs <slug>
```

1. **Pick.** Claude reads the script, show notes and post against the rubric
   in `podcast/clip-prompt.md` and picks whole-sentence passages that make
   sense with no context, preferring a sharp "so what" or a "Get AI on this"
   job. It writes the copy at the same time. The answer is saved to
   `podcast/clips/<slug>.json`, which is in git so the copy can be reviewed
   and edited in a PR; later runs reuse it, and `--repick` asks again.
   The script calls the `claude` CLI. When that can't answer (not signed in,
   or a cloud session) it prints `PICK NEEDED`, writes the prompt to
   `podcast/out/clips/<slug>/pick-prompt.md` and exits with code 2, and the
   Claude session running the job answers it and saves the JSON itself.
2. **Check.** It prints a `WARN` for a passage outside 65 to 150 words and
   for copy that breaks the house rules (a colon, dash or semicolon, an
   exclamation mark, a banned word, no post link, no #Shorts, no line saying
   the voices are AI-generated). To move a clip, edit `from` and `to` in the
   JSON; the `text` field updates on the next run.
3. **Time.** ElevenLabs forced alignment matches the script to the published
   episode MP3 and returns each word's start and end. It's more exact than
   Speech to Text, since the script already says what was said and how names
   are spelt. The result is cached in `podcast/out/clips/<slug>/`.
4. **Cut.** The passage is cut on word boundaries with short fades. Clips come
   from the middle of the episode, so the music bed is only in a clip if it
   was already under that section.
5. **Render.** `podcast/clip-graphics.py` draws the type and the rings with
   Pillow, and ffmpeg adds the waveform, the progress bar (the gradient bar at
   the top fills as the clip plays), the captions (a few words at a time, the
   spoken word lit in the speaker's colour) and a four-second end card.

Output, in `podcast/out/clips/<slug>/` (git ignores it): `<slug>-<n>.mp4`,
`<slug>-<n>.jpg` (a frame for review) and `<slug>-<n>.md` (the copy, ready to
paste).

Rendering needs macOS (Arial Narrow and Menlo), python3 with Pillow, ffmpeg
and `ELEVENLABS_API_KEY`. In a cloud session the script stops after the pick
with `RENDER SKIPPED`, so the daily run puts the choice and copy in its PR and
the video is made on the Mac.

To make clips for every episode:

```bash
for f in podcast/scripts/*.txt; do node podcast/make-clips.mjs "$(basename "$f" .txt)"; done
```

## Uploading

Uploading happens on James's Mac, in YouTube Studio for Manual Focus
Marketing (@manualfocusuk), through Claude in Chrome or by hand. For each clip:

- **YouTube.** Upload the MP4 (a vertical video under three minutes becomes a
  Short). Chrome's upload tool takes files under 10 MB, so upload a copy
  re-encoded at about 1 Mbps (`-crf 24 -maxrate 1000k`), which YouTube
  re-encodes anyway. Paste the title and description from `<slug>-<n>.md`,
  set "not made for kids", answer Yes to "Altered or synthetic content",
  since the voices are AI-generated, and save as Private. James makes it
  public. Saving as Unlisted before YouTube's checks finish brings up a
  warning about strikes, so use Private.
- **Article link.** Description links aren't clickable in Shorts, so the
  article URL sits in the description as plain text on line three. Once the
  episode is on the channel as a full video (from the RSS import), set the
  Short's **Related video** to it in Studio. Viewers can tap through to the
  episode, and its description, built from the feed, has a clickable link to
  the article.
- **LinkedIn.** Post the MP4 natively, not as a YouTube link, with the
  LinkedIn draft from the same file. This is James's to post.

## The look

Dark background (#0A0A0B), the gradient bar and two rings from the podcast
cover, the post title in Arial Narrow uppercase, a small monospace label, and
"AI-generated voices" in small text on every frame. Anything that matters
sits clear of the bottom fifth and the right edge, where the Shorts buttons
go. Layout numbers are at the top of `clip-graphics.py`, and the caption and
waveform positions are repeated in `make-clips.mjs`. Changes to the look need
James's sign-off.
