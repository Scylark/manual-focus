---
name: video-script-to-heygen
description: "When the user wants to turn a Lens playbook, a topic, or a pasted script into a rendered HeyGen video with their custom avatar. Triggers on 'make a video about [X]', 'render a heygen video', 'video for [playbook]', 'turn this into a video', 'create a short video', 'lens intro video', 'video from playbook', or any prompt that asks for a HeyGen render of marketing content. Also triggers on /video-script-to-heygen. Returns a rendered MP4, captions, and a LinkedIn post draft in a local videos/ folder."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens
---

# Video script to HeyGen

You are the bridge between a Lens playbook and a rendered HeyGen video. Your job is to take a topic, a playbook slug, or a pasted script and produce a polished short video featuring the user's custom HeyGen avatar, along with the captions and the LinkedIn post copy to ship it.

You do this end to end so the user does not copy and paste anything. Take the input, generate the script, call the HeyGen API, poll for the render, download the MP4 and SRT, save everything in a `videos/<slug>/` folder, and report the file paths back.

## Inputs you need

Before doing anything, confirm the user has the four required pieces. If any are missing, stop and ask.

1. **`HEYGEN_API_KEY`** environment variable. Verify by running `echo "${HEYGEN_API_KEY:-MISSING}"` and checking the output is not `MISSING`. If missing, tell the user to get it from https://app.heygen.com → Settings → API and add `export HEYGEN_API_KEY=...` to their shell rc file or a `.env` they source.
2. **`HEYGEN_AVATAR_ID`** environment variable. The ID of their trained custom avatar. Verify the same way. If missing, tell the user to run `curl -s -H "X-Api-Key: $HEYGEN_API_KEY" https://api.heygen.com/v2/avatars | jq '.data.avatars[] | {avatar_id, avatar_name}'` to find theirs.
3. **`HEYGEN_VOICE_ID`** environment variable. The voice to speak with. If missing, the user can pick from `curl -s -H "X-Api-Key: $HEYGEN_API_KEY" https://api.heygen.com/v2/voices | jq '.data.voices[] | {voice_id, name, language}'`. Suggest a clean English male or female voice if the user does not have a cloned voice yet.
4. **`jq`** installed. Run `command -v jq` to check. If missing, tell the user to `brew install jq` (macOS) or `apt-get install jq` (Linux).

The user input itself is one of:

- `--topic "free text describing what the video should cover"` — open form
- `--playbook <slug>` — read `src/content/lens/<stack>/<slug>.md` and base the script on it
- `--script-file <path>` — use a pre-written script, skip generation
- `--length short` (60-90s, ~135 words, default) or `--length long` (5-8min, ~700 words)

## The pipeline

Five phases. Run them in order. Output goes in `videos/<slug>/` in the project root, where `<slug>` is either the playbook slug or a kebab-case version of the topic.

### Phase 1, prepare the workspace

Create the output folder.

```bash
mkdir -p videos/<slug>
```

If the folder already exists and has `script.txt` in it, ask the user before overwriting.

### Phase 2, generate the spoken script

Spoken scripts are not written scripts. Different rules apply.

If the user provided `--script-file`, skip generation and load that file.

Otherwise, generate the script using this prompt (you, the agent, run this internally — do not call out to an external LLM):

```text
SYSTEM: You write short marketing videos for a senior-marketer
audience on LinkedIn. The video features a single talking-head
avatar of the brand founder. The script is spoken, not read, so
sentences are short, the rhythm varies, and pauses are implied
by line breaks. No marketing fluff, no hype words. Confident,
direct, plain English.

USER:
Format: {SHORT_60_TO_90s | LONG_5_TO_8_MIN}
Topic / source: {TOPIC_OR_PLAYBOOK_CONTENT}
Brand: Manual Focus, https://manual-focus.co.uk
Brand voice: practical, grounded, senior-marketer tone.
Audience: heads of marketing, fractional CMOs, senior in-house
operators at endurance brands and AI-native startups.
The Lens positioning: "Your AI marketing team" — 46 playbooks
plus 25 installable Claude Code skills, free to read, free to
install, brand context aware, twenty-minute setup.

Return the script as plain text, no stage directions, no
formatting other than blank lines between beats. Target word
count: 135 for short, 700 for long.

The script must have a five-beat structure:
1. HOOK (0-5s) — provocative or counterintuitive single line
2. SETUP (5-15s) — name the problem or context
3. REVEAL (15-25s) — name the Lens (or the playbook) as the
   alternative
4. OFFER (25-55s for short, 25-360s for long) — what the user
   actually gets, with specifics
5. CTA (last 15-20s) — the URL and one specific action

The CTA must mention "manual focus dot co dot uk slash lens"
and one of: "subscribe in the footer", "install the plugin",
"set up the lens" — pick the one that matches the topic.

No em dashes. No prose colons or semicolons. No exclamation
marks. No words like "imagine", "unlock", "discover" or
"powerful".
```

Validate the result:
- Word count within 10% of the target (135 for short, 700 for long)
- All five beats present
- CTA matches the URL pattern
- No banned words

If validation fails, regenerate up to twice. If still failing, save what you have and warn the user.

Save the script to `videos/<slug>/script.txt`.

### Phase 3, call HeyGen API to start the render

POST to HeyGen's video generation endpoint. Use this curl pattern (substitute the actual values).

```bash
SCRIPT=$(cat videos/<slug>/script.txt)
JSON_PAYLOAD=$(jq -n \
  --arg script "$SCRIPT" \
  --arg avatar_id "$HEYGEN_AVATAR_ID" \
  --arg voice_id "$HEYGEN_VOICE_ID" \
  '{
    video_inputs: [{
      character: {
        type: "avatar",
        avatar_id: $avatar_id,
        avatar_style: "normal"
      },
      voice: {
        type: "text",
        input_text: $script,
        voice_id: $voice_id,
        speed: 1.0
      },
      background: {
        type: "color",
        value: "#0A0A0A"
      }
    }],
    dimension: {
      width: 1080,
      height: 1920
    },
    aspect_ratio: "9:16",
    caption: true
  }')

RESPONSE=$(curl -s -X POST \
  -H "X-Api-Key: $HEYGEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD" \
  https://api.heygen.com/v2/video/generate)

VIDEO_ID=$(echo "$RESPONSE" | jq -r '.data.video_id')
echo "Render started, video_id: $VIDEO_ID"
echo "$VIDEO_ID" > videos/<slug>/video_id.txt
```

For the short format, the background is the dark Manual Focus colour `#0A0A0A`. For long format, ask the user if they want a different background. HeyGen supports image and video backgrounds via additional fields.

If the user wants 1:1 square instead of 9:16 vertical, set `width: 1080, height: 1080` and `aspect_ratio: "1:1"`. Default to 9:16 unless told otherwise.

### Phase 4, poll for completion

HeyGen renders take 2-5 minutes for a short video, 8-15 minutes for long. Poll every 30 seconds.

```bash
VIDEO_ID=$(cat videos/<slug>/video_id.txt)

while true; do
  STATUS_RESPONSE=$(curl -s -H "X-Api-Key: $HEYGEN_API_KEY" \
    "https://api.heygen.com/v1/video_status.get?video_id=$VIDEO_ID")
  STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.data.status')
  echo "Status: $STATUS"
  if [ "$STATUS" = "completed" ]; then
    VIDEO_URL=$(echo "$STATUS_RESPONSE" | jq -r '.data.video_url')
    CAPTION_URL=$(echo "$STATUS_RESPONSE" | jq -r '.data.caption_url // empty')
    echo "$VIDEO_URL" > videos/<slug>/video_url.txt
    break
  elif [ "$STATUS" = "failed" ]; then
    echo "Render failed:"
    echo "$STATUS_RESPONSE" | jq .
    exit 1
  fi
  sleep 30
done
```

While polling, give the user feedback every 60 seconds so they know it is still working. Do not silently wait.

### Phase 5, download and save outputs

Once the render is complete, download the MP4 and the SRT.

```bash
VIDEO_URL=$(cat videos/<slug>/video_url.txt)
curl -L -o videos/<slug>/video.mp4 "$VIDEO_URL"

# Captions: HeyGen exposes them via a separate endpoint.
CAPTIONS=$(curl -s -H "X-Api-Key: $HEYGEN_API_KEY" \
  "https://api.heygen.com/v1/video/captions?video_id=$VIDEO_ID" | \
  jq -r '.data.caption_url')
if [ -n "$CAPTIONS" ] && [ "$CAPTIONS" != "null" ]; then
  curl -L -o videos/<slug>/captions.srt "$CAPTIONS"
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

📁  videos/<slug>/
    ├── script.txt           the spoken script
    ├── video.mp4            the rendered video
    ├── captions.srt         caption track for accessibility
    ├── linkedin-post.md     post copy ready to paste
    └── video_url.txt        HeyGen-hosted URL (24h validity)

Next step:
1. Watch video.mp4 to QA pacing, pronunciation and the URL frame
2. If anything needs re-rendering, edit script.txt and re-run with --script-file
3. Upload to LinkedIn natively (not as a link). Use linkedin-post.md as the caption.
4. Once live, paste the LinkedIn URL back so the playbook page can embed it.
```

## Rate limits and cost awareness

HeyGen API has rate limits and credit consumption. Before doing batch jobs, warn the user:

- Free / Starter plans do not include API access. Confirm they are on Creator or above.
- Each minute of rendered video burns 1 minute of monthly credit allocation.
- Creator: 15 min/month. Team: 30 min. Enterprise: more.
- API rate limit is roughly 100 requests per hour.
- A short video uses ~1 credit-minute. A long video uses 5-8.

If the user asks to batch-produce 46 playbook videos in one go, do the credit math first. 46 short videos = 46 credit-minutes, which exceeds Creator and Team plans. Suggest spreading over weeks or upgrading.

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
