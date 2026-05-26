---
name: slack-focus-pass
description: "When the user wants to focus their Slack, surface the threads that need them, draft replies in the right voice, run a Slack triage, ignore the noise, or process Slack twice a day. Triggers on 'focus pass', 'process my Slack', 'what do I need to reply to', 'Slack triage', 'show me what matters in Slack', or pasting a Slack activity export."
metadata:
  version: 0.1.0
  playbook: https://manual-focus.co.uk/lens/productivity/slack-focus-pass
---

# Slack focus pass

You scan an 18-hour Slack activity window and surface the top ten threads the operator should engage with, ranked by channel score and urgency. For every thread tagged "reply", you draft a Slack-native reply in the operator's voice tuned for the channel register.

## Inputs to gather first

If `.lens/slack-channel-scores.md` exists, read it. Otherwise prompt the user to score channels (see Phase 1).

1. **Channel scores** — every channel rated critical / high / medium / low / mute
2. **Operator user id** — to filter out their own messages
3. **Slack activity** — last 18 hours: channel, thread_ts, user, text, has_operator_mention, has_operator_dm, last_activity_ts
4. **Operator's outbound messages** — to skip threads where they have already posted in the last 6 hours
5. **Brand voice profile** — note Slack voice is usually looser than email voice
6. **Operator's recent messages per channel-type** — 5 to 10 from internal, external customer, external partner channels

If channel scores are missing, run the scoring exercise first. The pipeline relies on them.

## The pipeline (four phases)

### Phase 1 — Channel scoring

Five categories with treatments:

- **Critical** — always surfaces. DMs, leadership channels, customer escalation channels.
- **High signal** — surfaces if mentioned or DM'd in. Launch channels, sales pipeline, active project channels.
- **Medium signal** — surfaces only on @mention. Cross-team channels, partner Connect channels.
- **Low signal** — read once a week. Random, celebrations, links.
- **Mute** — never surfaces. Bot channels, news feeds, anything read elsewhere.

The honesty check: channels not opened in 14 days are low or mute, not high.

Notifications must match the scoring. Low / mute set to "Nothing". Medium set to "Mentions only".

### Phase 2 — Focus pass

Return JSON with `focus_threads` (capped at 10), each having `channel`, `channel_score`, `thread_ts`, `topic` (5-8 word summary), `last_speaker`, `last_speaker_relation` (internal-direct-report / internal-peer / internal-exec / external-customer / external-partner / other), `urgency_signal`, `operator_action` (reply / review / acknowledge / ignore), `context_required`.

Also return `low_priority_count`, `noise_filtered_count`, `channels_with_high_volume_but_no_signal`.

Rules:
- Skip threads where the operator has posted in the last 6 hours.
- `urgency_signal` "high" requires explicit time-pressure language or customer escalation.
- `channels_with_high_volume_but_no_signal` flags channels producing 20+ messages with no focus thread. Re-score candidates.

### Phase 3 — Voice-loaded reply

For every "reply" thread, return JSON with `draft_text`, `channel_tone_check`, `confidence`, `operator_action_required`, `include_emoji_reaction`.

Rules:
- Slack-native length. Internal: 1-3 sentences. External customer: 2-4. External partner: 2-5.
- No em dashes. No corporate-speak.
- Customer-channel replies use the operator's full name as closing if it is the first reply.
- `include_emoji_reaction` flags whether to also react (eyes for "I'll get to it", thumbs for ack).

### Phase 4 — The routine

Twice a day. 09:00 and 16:00. 15 minutes each.

Weekly: re-score channels flagged in `channels_with_high_volume_but_no_signal`. Score the week's outputs against five threads the operator says actually mattered. Return `threads_surfaced` (0-5), `threads_missed`, `miss_reasons`, `noise_flagged`, `channel_re_score_recommendations`.

## Output

Focus list JSON plus drafts. If running inside a Slack MCP, post drafts to the operator's clipboard or to a private channel for review. Otherwise return JSON the operator copies.

Save the daily focus pass output to `.lens/slack/{date}-{pass}.json`. The weekly eval reads it.

## Evals

Before delivering:

- **Focus list precision** — at least 7 of 10 focus threads are ones the operator actually engages with. Below 6, urgency criteria need tightening.
- **Length adherence** — drafts hit the register length for the channel audience.
- **Voice fidelity** — no em dashes, no corporate-speak. Contractions if the operator uses them.
- **Channel-aware tone** — internal looser, external partner tighter, customer Connect carefully worded.
- **Operator-already-posted skip** — no threads where the operator posted in the last 6 hours.

## Failure modes to watch

- **Slack opened between passes** — flag explicitly in the routine output. The pipeline assumes Slack stays closed except for DMs and mentions.
- **Stale channel scores** — recommend weekly re-score for any channel appearing in `channels_with_high_volume_but_no_signal` three or more times.
- **Email voice in Slack** — if the operator's voice profile is the email voice, the drafts read formal in casual channels. Tune for Slack-specific register.
- **External Connect treated as internal** — channel audience metadata is load-bearing. Always check it before drafting.
- **15-minute timer ignored** — the discipline is closing Slack at the timer. Whatever sits unread gets caught at the next pass.

## Hand-off

- The focus pass output feeds the **daily-briefing-pipeline** Slack section.
- Threads needing follow-up become tasks in **inbox-to-task-pipeline**.
- Decisions surfaced go into **personal-knowledge-base**.
- Post-meeting Slack discussion feeds **call-follow-up-loop**.

Save to `.lens/slack/{date}-{pass}.json`.
