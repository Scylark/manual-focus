---
name: video-script-to-heygen
description: "When the user wants to turn a Lens playbook, a topic, or a pasted script into a rendered HeyGen video with their custom avatar. Triggers on 'make a video about [X]', 'render a heygen video', 'video for [playbook]', 'turn this into a video', 'create a short video', 'lens intro video', 'video from playbook', or any prompt that asks for a HeyGen render of marketing content. Also triggers on /video-script-to-heygen. Returns a rendered MP4, captions, and a LinkedIn post draft in a local videos/ folder."
metadata:
  version: 0.2.0
  playbook: https://manual-focus.co.uk/lens
---

# Video script to HeyGen

You are the bridge between a Lens playbook and a rendered HeyGen video. Your job is to take a topic, a playbook slug, or a pasted script and produce a polished short video featuring the user's custom HeyGen avatar, along with the captions and the LinkedIn post copy to ship it.

You do this end to end so the user does not copy and paste anything. Take the input, generate the script, call the HeyGen API, poll for the render, download the MP4 and SRT, save everything in a `videos/<slug>/` folder, and report the file paths back.

## Inputs you need

Before doing anything, confirm the user has the four required pieces. If any are missing, stop and ask.

1. **`HEYGEN_API_KEY`** environment variable. Verify by running `echo "${HEYGEN_API_KEY:-MISSING}"` and checking the output is not `MISSING`. If missing, tell the user to get it from https://app.heygen.com → Settings → API and add `export HEYGEN_API_KEY=...` to their shell rc file or a `.env` they source.
2. **`HEYGEN_AVATAR_ID`** environment variable. The look ID of their trained custom avatar (in HeyGen's v3 API the look `id` is what you pass as `avatar_id`). Verify the same way. If missing, tell the user to run `curl -s -H "x-api-key: $HEYGEN_API_KEY" "https://api.heygen.com/v3/avatars/looks?ownership=private" | jq '.data[] | {id, name, avatar_type, default_voice_id}'` to find theirs.
3. **`HEYGEN_VOICE_ID`** environment variable. The voice to speak with. If missing, the user can pick from `curl -s -H "x-api-key: $HEYGEN_API_KEY" "https://api.heygen.com/v3/voices?limit=100" | jq '.data[] | {voice_id, name, language, gender}'` (results are paginated, so pass `token=<next_token>` to see more). Suggest a clean English male or female voice if the user does not have a cloned voice yet.
4. **`jq`** installed. Run `command -v jq` to check. If missing, tell the user to `brew install jq` (macOS) or `apt-get install jq` (Linux).

The user input itself is one of:

- `--topic "free text describing what the video should cover"` — open form
- `--playbook <slug>` — read `src/content/lens/<stack>/<slug>.md` and base the script on it
- `--script-file <path>` — use a pre-written script, skip generation
- `--length short` (60-90s, 140 to 160 words, default) or `--length long` (5-8min, ~700 words)

## The pipeline

Six phases. Run them in order. Output goes in `videos/<slug>/` in the project root, where `<slug>` is either the playbook slug or a kebab-case version of the topic.

### Phase 1, prepare the workspace

Create the output folder.

```bash
mkdir -p videos/<slug>
```

If the folder already exists and has `script.txt` in it, ask the user before overwriting.

### Phase 2, generate the spoken script

Spoken scripts are not written scripts. Different rules apply. This skill writes for a TTS avatar at about 130 wpm with long breathing sentences, which deliberately departs from the video-script-system playbook's under-30-word sentence rule for human talent.

If the user provided `--script-file`, skip generation and load that file.

Otherwise, generate the script using this prompt (you, the agent, run this internally, do not call out to an external LLM):

```text
SYSTEM: You write short marketing videos for a senior-marketer
audience on LinkedIn. The video features a single talking-head
avatar of the brand founder. The script is spoken, not read,
which calls for an editorial voice. Think Rapha or Rouleur
applied to AI marketing. Long sentences that breathe, connected
by commas and "and" / "but" / "because" / "so". Specific
sensory or situational detail rather than slogans. Considered,
reflective, plain English with the occasional short punch line
landing inside a longer breathing sentence. The reader should
feel they were taken through one considered thought, not five
stacked LinkedIn beats.

USER:
Format: {SHORT_60_TO_90s | LONG_5_TO_8_MIN}
Topic / source: {TOPIC_OR_PLAYBOOK_CONTENT}
Brand: Manual Focus, https://manual-focus.co.uk
Brand voice: practical, grounded, senior-marketer tone. Closer
to a cycling publication than a software pitch.
Audience: heads of marketing, fractional CMOs, senior in-house
operators at endurance brands and AI-native startups.
The Lens positioning: "Your AI marketing team", 45 playbooks
plus 26 installable Claude Code skills, free to read, free to
install, brand context aware, twenty-minute setup.

Return the script as plain text, no stage directions, no
formatting other than blank lines between paragraphs. Target
word count: 140 to 160 for short, 700 to 800 for long. Editorial
rhythm runs at roughly 130 spoken words a minute, so a 60 to
90s video lands at the upper end of the short range.

The script flows through five movements but they should blend
into each other through connecting clauses, not land as separate
beats:

1. OPENING — a warm greeting or a grounded reframe that names
   the situation the reader is in
2. SETUP — the texture of that situation in concrete detail
3. REVEAL — name the Lens (or the playbook) as the alternative,
   ideally connected to the SETUP via "so", "which is why", or
   similar
4. OFFER — what the work actually involves, in the same
   editorial rhythm, not as a bulleted feature list
5. CLOSE — the practical next step, in plain language

The CTA must reference the URL "manual-focus.co.uk/lens" or
describe it as "the link in the post". Pick whichever fits the
delivery best. Do not spell the URL out letter by letter unless
the speaker can pronounce it cleanly.

Hard bans:
- No em dashes anywhere.
- No prose colons or semicolons (code blocks are fine).
- No "not X, it's Y" binary contrasts.
- No exclamation marks.
- No words like "imagine", "unlock", "discover", "powerful",
  "supercharge", "revolutionise", "transform".
- No staccato all-short-sentence rhythm. If three sentences in
  a row are under eight words, rewrite to connect at least one
  pair.
- No sentences that open with a bare number ("Forty-five
  playbooks across..."). That is reportage cadence and reads
  like a press release. A real speaker introduces a count with
  a verb or determiner ("We've built forty-five...", "Right now
  that's forty-five...", "Inside, there's forty-five...",
  "Currently forty-five..."). Only allow a bare-number opening
  if the previous sentence ended with explicit reference to the
  thing being counted, so the listener carries the subject
  across the break.
```

Validate the result:
- Word count inside the prompt's target range (140 to 160 for short, 700 to 800 for long)
- All five beats present
- CTA matches the URL pattern
- No banned words

If validation fails, regenerate up to twice. If still failing, save what you have and warn the user.

Save the script to `videos/<slug>/script.txt`.

### Phase 3, call HeyGen API to start the render

> **API version.** HeyGen retires its v1 and v2 endpoints (including `POST /v2/video/generate` and `GET /v1/video_status.get`) after 31 October 2026. The calls below use the v3 API. If you are running an older copy of this skill, update it before then. HeyGen's migration checklist is at https://developers.heygen.com/endpoint-version-comparison and the changelog at https://developers.heygen.com/changelog.

POST to HeyGen's v3 video creation endpoint. Use this curl pattern (substitute the actual values).

```bash
SCRIPT=$(cat videos/<slug>/script.txt)
JSON_PAYLOAD=$(jq -n \
  --arg script "$SCRIPT" \
  --arg avatar_id "$HEYGEN_AVATAR_ID" \
  --arg voice_id "$HEYGEN_VOICE_ID" \
  '{
    type: "avatar",
    avatar_id: $avatar_id,
    script: $script,
    voice_id: $voice_id,
    voice_settings: { speed: 1.0 },
    background: { type: "color", value: "#0A0A0A" },
    aspect_ratio: "9:16",
    resolution: "1080p",
    caption: { file_format: "srt" }
  }')

RESPONSE=$(curl -s -X POST \
  -H "x-api-key: $HEYGEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD" \
  https://api.heygen.com/v3/videos)

VIDEO_ID=$(echo "$RESPONSE" | jq -r '.data.video_id // empty')
if [ -z "$VIDEO_ID" ]; then
  echo "Render request failed:"
  echo "$RESPONSE" | jq .
  exit 1
fi
echo "Render started, video_id: $VIDEO_ID"
echo "$VIDEO_ID" > videos/<slug>/video_id.txt
```

For the short format, the background is the dark Manual Focus colour `#0A0A0A`. For long format, ask the user if they want a different background. The v3 `background` object also accepts `type: "image"` with a `url` or `asset_id`.

If the user wants 1:1 square instead of 9:16 vertical, set `aspect_ratio: "1:1"`. Default to 9:16 unless told otherwise.

The `caption` object asks for a sidecar SRT file, which comes back as `subtitle_url`. Adding `style: "default"` inside `caption` also produces a copy with the captions burned in, returned as `captioned_video_url`. Leave it out unless the user asks for burned-in captions.

### Phase 4, poll for completion

HeyGen renders take 2-5 minutes for a short video, 8-15 minutes for long. Poll every 30 seconds. The v3 status values are `pending`, `processing`, `completed` and `failed`.

```bash
VIDEO_ID=$(cat videos/<slug>/video_id.txt)

while true; do
  STATUS_RESPONSE=$(curl -s -H "x-api-key: $HEYGEN_API_KEY" \
    "https://api.heygen.com/v3/videos/$VIDEO_ID")
  STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.data.status')
  echo "Status: $STATUS"
  if [ "$STATUS" = "completed" ]; then
    echo "$STATUS_RESPONSE" | jq -r '.data.video_url' > videos/<slug>/video_url.txt
    echo "$STATUS_RESPONSE" | jq -r '.data.subtitle_url // empty' > videos/<slug>/subtitle_url.txt
    break
  elif [ "$STATUS" = "failed" ]; then
    echo "Render failed:"
    echo "$STATUS_RESPONSE" | jq '.data | {failure_code, failure_message}'
    exit 1
  elif [ "$STATUS" = "null" ]; then
    echo "Unexpected response:"
    echo "$STATUS_RESPONSE" | jq .
    exit 1
  fi
  sleep 30
done
```

While polling, give the user feedback every 60 seconds so they know it is still working. Do not silently wait.

### Phase 5, download and save outputs

Once the render is complete, download the MP4 and the SRT. Both URLs come from the Phase 4 status response.

```bash
VIDEO_URL=$(cat videos/<slug>/video_url.txt)
curl -L -o videos/<slug>/video.mp4 "$VIDEO_URL"

SUBTITLE_URL=$(cat videos/<slug>/subtitle_url.txt)
if [ -n "$SUBTITLE_URL" ]; then
  curl -L -o videos/<slug>/captions.srt "$SUBTITLE_URL"
fi
```

Then generate the LinkedIn post copy using this template, populated from the script:

```text
{Hook from script, single line, no period}

{One-sentence reframe: what the Lens / playbook offers}

{One-sentence install or subscribe instruction}

manual-focus.co.uk/lens

{One open-ended question for comments}
```

Save it to `videos/<slug>/linkedin-post.md`.

### Phase 6, report and hand off

Print a summary to the user:

```
Video rendered.

videos/<slug>/
    ├── script.txt           the spoken script
    ├── video.mp4            the rendered video
    ├── captions.srt         caption track for accessibility
    ├── linkedin-post.md     post copy ready to paste
    └── video_url.txt        HeyGen presigned download URL

Next step:
1. Watch video.mp4 to QA pacing, pronunciation and the URL frame
2. If anything needs re-rendering, edit script.txt and re-run with --script-file
3. Upload to LinkedIn natively (not as a link). Use linkedin-post.md as the caption.
4. Once live, paste the LinkedIn URL back so the playbook page can embed it.
```

## Rate limits and cost awareness

HeyGen API usage costs money. Before doing batch jobs, warn the user:

- API access is a separate pay-as-you-go credit balance billed in US dollars, based on the type and length of what you generate. No HeyGen web plan (Creator, Pro or Business) is required, and the credits expire after 12 months.
- Prices vary by avatar engine and feature. Check HeyGen's current API pricing before quoting a cost: https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained
- The API processes up to 10 videos concurrently, so queue larger batches.

If the user asks to batch-produce 45 playbook videos in one go, do the maths first. Multiply the expected runtime of each video by the current per-minute rate for their avatar engine from the pricing page, show the total in US dollars, and confirm before rendering. Suggest spreading the batch over weeks if the total is more than they expected.

## Voice rules

The skill's own communication style:

- Plain English. Tell the user exactly what is happening.
- Show progress during long polls.
- Surface API errors verbatim, do not hide them.
- No em dashes in your responses.

## What you do not do

- You do not store the user's HEYGEN_API_KEY anywhere except in their environment.
- You do not commit videos to git. The `videos/` folder should already be in `.gitignore` (this skill checks and adds it if not).
- You do not auto-publish to LinkedIn, YouTube, or any other platform. The user reviews and publishes.
- You do not pre-fetch playbook content from the live site over HTTP. Read the local markdown file in `src/content/lens/<stack>/<slug>.md`.
- You do not fabricate API responses. If HeyGen returns an error, surface it.

## Hand-off

After a successful render, suggest the obvious next steps:

- Embed the LinkedIn URL on the playbook page via the playbook detail template
- Add the video to `social-content-factory`'s asset library
- If the format works, batch-produce more (one per playbook, two per quarter, etc.)

The skill is the rendering pipeline. The strategy is the user's call.
