---
title: "Slack focus pass, read what matters and ignore what doesn't"
stack: productivity
description: "Strip Slack noise to the threads that actually need you, draft replies in the right voice, and stay out of the channels that drain attention. Twice a day, 15 minutes."
outputs: "Channel scoring matrix, focus pass prompt, voice-loaded reply prompt, two-pass-a-day routine, eval rubric"
readMin: 21
shipTime: "1 working day"
brandStage: ["growth", "scale", "enterprise"]
channels: ["meetings", "inbox", "tasks"]
models: ["claude-4.5-opus", "gpt-5", "claude-4.5-sonnet"]
publishedAt: 2026-08-28
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts.

1. A **channel scoring matrix** that ranks every Slack channel by signal density, so you know which ones to read and which ones to mute.
2. A **focus pass prompt** that scans the last 18 hours of mentions, DMs and high-signal channels and returns the top ten threads you should engage with.
3. A **voice-loaded reply prompt** that drafts replies in the right voice for the channel (formal in #board-updates, looser in #marketing-banter).
4. A **two-pass-a-day routine** with the click-paths to run the pipeline in 15 minutes morning and 15 minutes afternoon, plus the weekly eval.

## Who this is for

A marketing or GTM operator running across 30 or more Slack channels with a mix of internal teams, external partners and customer Slack Connect. You lose more time to Slack than to email and the team has started routing important work through Slack because email feels slow. You have admin or member access to the workspace.

If you are in fewer than 10 channels, the manual approach is faster. If you are in over 100, you need a Slack discipline that goes beyond a single playbook (channel archive sweep, notification settings reset, message-policy work with the Slack admin).

## Before you start

- [ ] Slack workspace token with `channels:read`, `groups:read`, `users:read`, `chat:write`, `im:read`
- [ ] A brand voice profile (from brand-voice-extraction). Note that Slack voice is usually looser than email voice
- [ ] Sample messages from your own Slack history, 10 to 20 of your recent sent messages per channel type
- [ ] A target delivery channel for the focus pass output (Slack DM to self by default)
- [ ] Notification preferences set to "Direct messages, mentions and keywords" workspace-wide. Anything more permissive defeats the routine
- [ ] 30 minutes blocked for setup

If your notifications are still set to "All new messages" on more than three channels, fix that first. The pipeline is calibrated to a baseline of clean notifications.

## The pipeline

Four phases. Phase 1 sets the channel scoring. Phases 2 through 4 are the daily routine.

### Phase 1, channel scoring

Every channel gets a score. The score decides how the pipeline treats messages from it.

**Step 1.1, the score categories.**

Five categories, each with a treatment rule.

| Score | Treatment | Examples |
|---|---|---|
| Critical | Always surfaces, no delay | DMs, #leadership, customer escalation channels |
| High signal | Surfaces if mentioned or DM'd within | #marketing-launches, #sales-pipeline, project channels |
| Medium signal | Surfaces only on @mention | #engineering, #operations, partner Connect channels |
| Low signal | Read once a week, never surfaces | #random, #team-celebrations, #links |
| Mute | Never surfaces, optionally leave | #announcements (read elsewhere), #help-desk-bot, #marketing-news-feed |

**Step 1.2, score every channel.**

Open your channel list. Score every channel. The exercise takes 20 minutes the first time. Save as `slack-channel-scores.md`.

The honesty check, channels you have not opened in the last 14 days are either "low signal" or "mute", almost never "high signal" or above. If you are tempted to score #marketing-news as "high" but have not opened it in three weeks, it is "low" or "mute".

**Step 1.3, fix notifications to match.**

For every "mute" channel, set notifications to "Nothing". For every "low signal" channel, set notifications to "Nothing" and rely on the weekly read. For "medium signal", set to "Mentions only". For "high signal" and "critical", default workspace setting (mentions, keywords, DMs) is fine.

Notification settings are the load-bearing piece. The pipeline assumes you have done this work.

### Phase 2, the focus pass

Twice a day. Morning at 09:00, afternoon at 16:00. 15 minutes each.

**Step 2.1, the focus pass prompt.**

```text
SYSTEM: You scan a window of Slack activity and surface the top
ten threads the operator should engage with. You apply the
channel score matrix and the urgency signals from the message
content. You return threads in priority order, with a one-line
context for each.

USER:
Channel scores:
{PASTE_CHANNEL_SCORES}

Operator user id:
{OPERATOR_USER_ID}

Slack activity in the last 18 hours (channel, thread_ts, user,
text snippet, has_operator_mention, has_operator_dm, last_activity_ts):
{PASTE_SLACK_ACTIVITY}

Operator's outbound messages in this window (channel, thread_ts):
{PASTE_OPERATOR_OUTBOUND}

Return JSON:
{
  "focus_threads": [
    {
      "channel": "<verbatim>",
      "channel_score": "<critical | high | medium | low>",
      "thread_ts": "<id>",
      "topic": "<5-8 word summary>",
      "last_speaker": "<name>",
      "last_speaker_relation": "<internal-direct-report | internal-peer | internal-exec | external-customer | external-partner | other>",
      "urgency_signal": "<high | medium | low>",
      "operator_action": "<reply | review | acknowledge | ignore>",
      "context_required": "<one sentence on what context the operator needs to respond>"
    }
  ],
  "low_priority_count": <int>,
  "noise_filtered_count": <int>,
  "channels_with_high_volume_but_no_signal": ["<list>"]
}

Rules:
- focus_threads capped at 10.
- Skip threads where the operator has posted in the last 6 hours.
- urgency_signal "high" requires explicit time-pressure language
  ("today", "before end of day", "ASAP") or customer escalation.
- channels_with_high_volume_but_no_signal flags channels that
  produced 20+ messages in the window without surfacing a focus
  thread. These are candidates for re-scoring to "low".
- Return JSON only.
```

**Step 2.2, the read.**

The output reads in two minutes. The operator opens each thread in priority order. For "review" and "acknowledge" actions, the operator reads and emoji-reacts or quote-replies in ten seconds. For "reply" actions, the pipeline drafts (Phase 3).

### Phase 3, voice-loaded replies

For every "reply" thread, the system drafts.

**Step 3.1, the channel-aware draft prompt.**

```text
SYSTEM: You draft a Slack reply in the operator's voice tuned
for the channel context. Internal channels are looser than
external partner channels. Customer Connect channels are more
careful than internal team channels. The voice rule shifts but
the operator's core voice remains.

USER:
Operator brand voice profile:
{PASTE_VOICE_PROFILE}

Channel context:
- Channel name: {CHANNEL_NAME}
- Channel score: {CHANNEL_SCORE}
- Channel audience: {INTERNAL | EXTERNAL_CUSTOMER | EXTERNAL_PARTNER}

Operator's recent messages in this channel (last 5):
{PASTE_OPERATOR_RECENT_IN_CHANNEL}

Thread to reply to (chronological, oldest first):
{PASTE_THREAD}

Classification metadata for this thread (from Phase 2):
{PASTE_FOCUS_THREAD_JSON}

Return JSON:
{
  "draft_text": "<the reply, as it would land in Slack>",
  "channel_tone_check": {
    "matches_channel_register": <true | false>,
    "notes": ["<flags>"]
  },
  "confidence": "<high | medium | low>",
  "operator_action_required": "<send-as-is | review-and-send | rewrite-needed>",
  "include_emoji_reaction": "<emoji_name | null>"
}

Rules:
- Slack-native length. Internal: 1-3 sentences. External customer:
  2-4 sentences. External partner: 2-5 sentences.
- No em dashes. No corporate-speak.
- Use the operator's contractions if their voice does.
- emoji reaction is a yes/no on whether the operator should also
  react with an emoji (eyes for "I'll get to it", thumbs for ack).
- Customer-channel replies use the operator's full name as
  closing if the thread is the first reply. Internal does not
  need closing.
```

**Step 3.2, the send.**

The operator opens each draft in the actual Slack thread. "Send-as-is" is 5 seconds per reply. "Review-and-send" is 15 to 30 seconds.

For the operator's first run of the pipeline, expect 6 of 10 drafts to be send-as-is. After two weeks of voice-profile tuning, expect 8 of 10.

### Phase 4, the routine

The shape of the day.

**Step 4.1, the 09:00 pass.**

15 minutes. Run focus pass. Read the ten threads. Reply, review, acknowledge or ignore each. Done. Slack closed until 16:00 unless a DM or mention notification fires.

**Step 4.2, the 16:00 pass.**

15 minutes. Same shape. Catches the afternoon build-up. The day ends with no thread sitting unread in the operator's "I should respond to that" pile.

**Step 4.3, the weekly channel re-score.**

Friday afternoon, five minutes. Look at the `channels_with_high_volume_but_no_signal` list from the week's focus pass outputs. Re-score any channel that appears three or more times. Most go from "high" or "medium" to "low" or "mute".

**Step 4.4, the weekly eval.**

```text
SYSTEM: You audit the week's focus pass outputs against what
actually mattered. You score how well the focus pass surfaced
the right threads and flag where it missed.

USER:
This week's focus pass outputs (Mon-Fri):
{PASTE_WEEK_OUTPUTS}

Five Slack threads the operator says actually mattered this week:
{LIST_FIVE_THREADS}

Return JSON:
{
  "threads_surfaced": <int, 0 to 5>,
  "threads_missed": ["<channel and topic>"],
  "miss_reasons": ["<one sentence per miss>"],
  "noise_flagged": ["<threads surfaced but operator did not engage>"],
  "channel_re_score_recommendations": [
    {"channel": "<name>", "current_score": "<x>", "recommended_score": "<y>", "rationale": "<one sentence>"}
  ]
}

Rules:
- A miss counts even if the thread surfaced on a different day.
- Noise is a thread surfaced that the operator did not act on
  beyond reading.
```

## Worked example, end-to-end

Saoirse Burns runs across 47 Slack channels at Cascadia Endurance plus three external partner Connect channels. She does the channel scoring on Sunday afternoon. The breakdown lands at 4 critical, 9 high signal, 14 medium signal, 18 low signal, and 5 mute (after archiving two channels with zero traffic in 60 days).

Monday morning at 09:00 the focus pass runs.

**Output (excerpt).**

```json
{
  "focus_threads": [
    {
      "channel": "#leadership-marketing",
      "channel_score": "critical",
      "topic": "Vahla launch budget approval",
      "last_speaker": "Marcus Hale",
      "last_speaker_relation": "internal-exec",
      "urgency_signal": "high",
      "operator_action": "reply",
      "context_required": "Marcus needs the £62k vs £75k breakdown before his 11:00 finance meeting."
    },
    {
      "channel": "Cascadia ↔ Foundry (Connect)",
      "channel_score": "high",
      "topic": "Storm Shell launch film third cut",
      "last_speaker": "Foundry, Tom Vetter",
      "last_speaker_relation": "external-partner",
      "urgency_signal": "medium",
      "operator_action": "reply",
      "context_required": "Tom wants notes on the third cut, asked by Tuesday."
    }
  ],
  "low_priority_count": 47,
  "noise_filtered_count": 213,
  "channels_with_high_volume_but_no_signal": ["#marketing-news-watching", "#trail-running-pr-mentions"]
}
```

15 minutes later Saoirse has shipped 7 replies, 2 emoji acknowledgements, and 1 calendar block for a longer response. The two channels flagged as no-signal-high-volume go on the weekly re-score list.

Friday's eval shows 4 of 5 mattered-threads surfaced. The miss was a Slack DM from the lead investor on Tuesday afternoon, missed because the pipeline ran at 16:00 and the DM landed at 16:42. Saoirse moves the afternoon pass to 17:00 the next week. No further misses.

The two flagged channels get re-scored to "low". Saoirse's afternoon Slack time drops from 35 minutes to 12.

## Try it yourself

Three exercises, each under 30 minutes.

### Exercise 1, do the channel scoring

Open your Slack channel list. Score every channel as critical, high, medium, low or mute. Be honest. Channels you have not opened in 14 days are low or mute. Save the result.

### Exercise 2, set notifications to match

For every "low" and "mute" channel, set notifications to "Nothing". For every "medium", set to "Mentions only". Open Slack 24 hours later. The notification volume should drop by 70 percent.

### Exercise 3, run one focus pass manually

Pick a real 18-hour Slack window. Export the activity (or copy threads manually). Run the focus pass prompt. Read the output. Are the right ten threads in the focus list? The exercise is calibrating the prompt against your gut.

## The eval gates

**Eval 1, focus list precision.** Sample 5 focus passes from a week. The operator engaged with at least 7 of 10 threads in each pass. Below 6 the focus list is over-broad, tighten the urgency criteria.

**Eval 2, mattered-thread recall.** The weekly eval shows at least 4 of 5 mattered-threads surfaced. Below 3 the channel scores are wrong, recheck the matrix.

**Eval 3, time discipline.** 15 minutes morning, 15 minutes afternoon. If the routine consistently runs longer, the focus list is too long. Cut it to 8 from 10.

**Eval 4, noise floor.** The `noise_filtered_count` shows the volume the pipeline absorbed. If it drops over time (from 213 in week one to 90 in week eight), the channel scoring is doing its job, fewer messages are even reaching the focus pass.

## The failure modes

**The operator opens Slack between passes.** The whole pipeline assumes Slack is closed between 09:15 and 16:00. The moment the operator opens Slack on their phone "just to check", attention fragments and the pipeline value disappears. The phone discipline matters as much as the prompts.

**Channel scores stay frozen.** A channel that was "high signal" three months ago may have become noise (project ended, conversation moved elsewhere). The weekly re-score is the discipline. Without it the scoring stays wrong.

**The voice profile is the email voice.** Slack voice is usually looser than email voice. If the draft prompt uses the email voice profile unchanged, the drafts read as formal in casual channels. Either tune the voice profile for Slack specifically, or rely on the channel-aware draft prompt's looser register.

**External Connect channels get treated as internal.** A reply that would be fine in #marketing-banter reads as off-key in a customer Connect channel. The channel audience metadata in Phase 3 is load-bearing. Make sure every channel score also flags audience.

**The 15-minute timer is treated as a target rather than a hard limit.** The discipline is to close Slack at the timer, not to keep replying until everything is clear. Whatever sits in the focus list at 09:15 that did not get a response gets caught at 16:00 or, if it is genuinely urgent, the DM or mention notification fired separately.

## The pattern in practice

**Marketing director at scale, the attention reclaim.** A director who lived in Slack from 08:00 to 22:00. The two-pass routine plus aggressive channel muting cuts Slack time from 4 hours a day to 45 minutes. Response time to direct mentions actually improves because the focus pass surfaces them sharply rather than burying them in #marketing-banter.

**Founder-led GTM at growth stage, the Connect channel discipline.** A founder running three external Connect channels with key customers. The channel-aware draft prompt produces replies that read right in each channel. The customers comment that "everything feels intentional" because the voice is right for the relationship.

**B2B sales engineer at enterprise, the deep-work unlock.** An engineer interrupted 50 times a day. Slack moves to two passes, deep work moves into the rest of the day. Output triples. The interruption rate drops because teammates learn to ask questions in threads the engineer will see at the next pass, not in DMs that demand immediate response.

## Hand-off

Once the routine is running, the work feeds:
- **daily-briefing-pipeline**, where the Slack section uses the focus pass output rather than raw mentions
- **inbox-to-task-pipeline**, where Slack threads needing follow-up after a focus pass become tasks
- **personal-knowledge-base**, where Slack threads with decisions become part of the searchable record
- **call-follow-up-loop**, where post-meeting Slack discussion gets summarised into the meeting record
