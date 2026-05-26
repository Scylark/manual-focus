---
title: "Attribution tear-down using GA4 and incrementality signals"
stack: demand
description: "Untangle channel attribution using GA4, platform pixels and incrementality. Find overclaiming channels and the ones quietly working. Done in a week with the tools you already have."
outputs: "Master attribution sheet, contradiction report, three concrete bets with test designs"
readMin: 18
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["analytics", "paid-search", "paid-social", "seo"]
models: ["claude-4.5-opus", "gpt-5"]
publishedAt: 2026-06-02
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped four artefacts:

1. A **master attribution sheet** with every paid and organic channel's conversions broken down by week and by attribution source (GA4 data-driven, GA4 last-click, platform pixel).
2. A **contradiction report** ranking the channels where your attribution sources disagree most, so you know where the misattribution money is hiding.
3. **Three concrete bets**, one channel to invest more in, one to cut or test, one to run an incrementality test on, each with a statistical-power check so the test is actually winnable.
4. A **test design** for each bet that finance will sign off on, including budget, runtime and minimum detectable lift.

## Who this is for

A growth or scale-stage brand spending across three or more paid channels, with someone on the team who has admin access to GA4 and the ad platforms, and a CFO who has at some point asked "which channels are actually working?"

If you only run one paid channel, this playbook is overkill. If you run none, it doesn't apply yet.

## Before you start

Get these on a single screen before you begin. The whole pipeline assumes you have the data in hand.

- [ ] GA4 property access, Reports level minimum (Viewer role works)
- [ ] Meta Ads Manager access on the ad account, Performance reports visible
- [ ] Google Ads access on the account, read-only is fine
- [ ] (Optional but valuable) Results from any incrementality test run in the last 12 months, or any MMM output
- [ ] A spreadsheet, Google Sheets or Excel, your call

If you are missing one of the first three, fix the access before starting. Half-built attribution data produces half-right answers.

## The pipeline

Five phases. Roughly a day per phase if you have the data ready.

### Phase 1, attribution sources collection

Pull conversion data from at least three sources and normalise it into a single sheet.

**Step 1.1, export GA4 data-driven attribution.**

1. Open GA4. In the left sidebar click **Reports**.
2. Go to **Advertising** then **Attribution settings**. Set **Reporting attribution model** to *Data-driven*. Save.
3. Go to **Advertising** then **Model comparison**.
4. Set the date range to the last 90 days (top right).
5. Under the report, set Model 1 to *Data-driven* and Model 2 to *Last click*.
6. Set the dimension to *Default channel group*.
7. Click **Share this report** in the top right, then **Download file**, then *CSV*.

You should now have a CSV with one row per channel and columns for *Default channel group*, *Conversions (data-driven)*, *Conversions (last click)*, *Conversion value (data-driven)*, *Conversion value (last click)*.

**Step 1.2, export Meta Ads Manager attribution.**

1. Open Meta Ads Manager and pick the ad account.
2. Set the date range to the last 90 days.
3. Under **Columns** click *Customize columns*. Tick *Impressions, Link clicks, Amount spent, Purchases* (or your conversion event) and *Purchase conversion value*.
4. Click **Attribution setting** (top right of the table) and set to *7-day click + 1-day view*. This is Meta's standard.
5. Make sure the view is set to **Campaigns**.
6. Click **Reports** then **Export table data** and download as CSV.

Sum campaign-level purchases into a single "Paid social, Meta" row at the channel level.

**Step 1.3, export Google Ads conversions.**

1. Open Google Ads.
2. Go to **Reports** then **Predefined reports** then **Conversions** then **Conversions by attribution model**.
3. Set the date range to the last 90 days.
4. Click the download icon top right and choose CSV.

**Step 1.4, build the master sheet.**

Open a fresh spreadsheet. Build it with these columns:

| Channel | Week | Conversions_GA4_DDA | Conversions_GA4_LC | Conversions_Platform | Notes |

One row per channel-week combination. Paste from your three exports. For organic, direct and email you will only have the GA4 columns and that is fine, the point of the comparison is the paid channels where you have a platform reading to disagree with GA4.

If you have an incrementality test result, add a column **Conversions_Incrementality** with the test-measured value for the channels you have it on.

**Sample finished Phase 1 output, a fictional D2C apparel brand, first four weeks shown:**

| Channel       | Week | GA4_DDA | GA4_LC | Platform | Notes                         |
|---------------|------|---------|--------|----------|-------------------------------|
| Paid social   | W01  | 142     | 98     | 196      | Meta, 7d-click + 1d-view      |
| Paid search   | W01  | 91      | 124    | 134      | Google Ads, DDA               |
| SEO           | W01  | 76      | 67     | n/a      | Organic search                |
| Email         | W01  | 42      | 51     | n/a      | UTM-tagged sends              |
| Direct        | W01  | 38      | 41     | n/a      | Includes brand-search bleed   |

You are now ready for Phase 2.

### Phase 2, cross-source consistency check

You have the data. Now you need to find the channels where the sources disagree most. That is where the misattribution money is sitting.

**Step 2.1, paste the master sheet into the prompt below and run it in Claude.**

```text
SYSTEM: You are an attribution analyst. You compute the coefficient
of variation (CV) across attribution sources for each channel,
identify contested channels (CV > 0.5), and rank them by absolute
conversion volume so the biggest contested channels surface first.

You return JSON only.

USER:
Here is the conversion-by-channel-by-week data across multiple
attribution sources. Aggregate to the channel level (sum across
weeks) before computing CV.

{PASTE_MASTER_SHEET_HERE}

For each channel:
1. Compute mean conversions across all available sources for that channel.
2. Compute CV (standard deviation / mean) across sources.
3. Tag as "stable" (CV < 0.2), "noisy" (0.2 <= CV < 0.5) or
   "contested" (CV >= 0.5).
4. Rank contested channels by absolute conversion volume.

Return JSON:
{
  "stable_channels": [{"channel": "<name>", "cv": <number>, "volume": <number>}],
  "noisy_channels": [{"channel": "<name>", "cv": <number>, "volume": <number>}],
  "contested_channels": [
    {
      "channel": "<name>",
      "cv": <number>,
      "platform_reading": <number>,
      "ga4_dda": <number>,
      "ga4_lc": <number>,
      "absolute_volume": <number>,
      "rank": <int>
    }
  ]
}

Rules:
- Skip channels with only one source (cannot compute CV).
- Round CV to 2 decimal places.
- Order contested channels by rank, biggest volume first.
```

**Step 2.2, read the output.**

The contested channels list is your shortlist. Pick the top 2-3 by volume, those are the ones worth resolving. A channel with CV of 0.8 but only 40 conversions is not worth a week of work. A channel with CV of 0.6 and 2,000 conversions is.

**Expect output shaped like:**

```json
{
  "contested_channels": [
    {
      "channel": "Paid social",
      "cv": 0.58,
      "platform_reading": 196,
      "ga4_dda": 142,
      "ga4_lc": 98,
      "absolute_volume": 145.3,
      "rank": 1
    }
  ]
}
```

### Phase 3, brand-impact decomposition

The most under-credited channels in last-click attribution are usually upper-funnel brand spend (display, paid social brand campaigns, PR). They drive branded search, which then converts and gets credited to "direct" or "organic search". This phase finds that hidden lift.

**Step 3.1, pull branded search query volume by week.**

1. In Google Search Console, go to **Performance**.
2. Set date range to last 90 days.
3. Filter queries: contains your brand name.
4. Export to CSV. You want clicks per week.

(Alternatively, in Google Ads, look at Brand campaign impressions if you have one.)

**Step 3.2, pull your upper-funnel spend by week.**

For each upper-funnel channel (Display, brand-targeted paid social, paid PR) pull the spend per week from the platform.

**Step 3.3, run the correlation prompt.**

```text
SYSTEM: You correlate upper-funnel brand spend against branded
search query volume to surface where brand investment is driving
demand that downstream attribution will miss.

USER:
Branded search clicks per week:
{PASTE_BRANDED_SEARCH_CLICKS_BY_WEEK}

Upper-funnel spend per week per channel:
{PASTE_UPPER_FUNNEL_SPEND_BY_WEEK}

For each upper-funnel channel:
1. Compute Pearson correlation between spend in week N and branded
   search clicks in week N, N+1 and N+2.
2. Identify the lag at peak correlation.
3. Flag if correlation > 0.4 with lag <= 2 weeks.

Return JSON:
{
  "upper_funnel_channels": [
    {
      "channel": "<name>",
      "peak_correlation": <number>,
      "peak_lag_weeks": <int>,
      "branded_search_lift_signal": "<strong | possible | none>",
      "interpretation": "<one-sentence read>"
    }
  ]
}

Rules:
- Correlation is not causation. Note seasonality or PR events that
  could confound.
- Flag with "possible" when correlation is between 0.3 and 0.4.
- Return JSON only.
```

You will get a ranked list of upper-funnel channels with their likely brand-search lift signal. Channels with a "strong" signal are being under-credited by last-click attribution.

### Phase 4, contradiction surfacing

You have your contested channels (Phase 2) and your branded-search signal (Phase 3). Now the model generates hypotheses for what is going wrong on each contested channel.

**Step 4.1, run the contradiction prompt.**

```text
SYSTEM: You generate a ranked hypothesis list for each contested
channel, explaining why the attribution sources disagree and which
source is most plausible.

The standard hypothesis types are:
- Platform self-credit bias (platform inflates its own contribution)
- View-through over-credit (view-through conversions credit the
  channel for users who would have converted anyway)
- Last-click under-credit (last-click misses upper-funnel touches)
- Multi-device gaps (users start on mobile, finish on desktop)
- Brand-effect bleed (channel drives branded search that is then
  credited elsewhere)

USER:
Here are the contested channels with their CV and source readings:
{PASTE_CONTESTED_CHANNELS_FROM_PHASE_2}

Here is the branded-search lift signal per upper-funnel channel:
{PASTE_BRANDED_SEARCH_OUTPUT_FROM_PHASE_3}

For each contested channel return JSON:
{
  "channel": "<name>",
  "hypotheses": [
    {
      "type": "<hypothesis type from the list>",
      "plausibility": "<high | medium | low>",
      "evidence": "<one sentence pointing at specific data>",
      "recommended_action": "<what to do to resolve>"
    }
  ],
  "most_plausible_source": "<GA4_DDA | GA4_LC | Platform | none — needs test>"
}

Rules:
- Return between 2 and 4 hypotheses per channel.
- The "most_plausible_source" defaults to "none, needs test" when
  evidence is ambiguous. Do not over-claim.
```

You will get a ranked list of what is most likely wrong per channel.

### Phase 5, three concrete bets with test designs

The pipeline now produces three actionable recommendations.

**Step 5.1, run the recommendation prompt.**

```text
SYSTEM: You produce three concrete bets from an attribution
analysis, one channel to invest more in (under-credited), one to
cut or test (over-credited), one to run a controlled incrementality
test on (genuinely unclear). Each comes with a test design.

USER:
Contested channels and hypotheses:
{PASTE_PHASE_4_OUTPUT}

Brand-search signal:
{PASTE_PHASE_3_OUTPUT}

Stable channels (for context, no action needed):
{PASTE_STABLE_CHANNELS_FROM_PHASE_2}

Return JSON:
{
  "invest_more": {
    "channel": "<name>",
    "why": "<one-paragraph rationale>",
    "magnitude": "<small | moderate | large>",
    "test_design": {
      "method": "<budget-lift | geo-holdout | platform-ab>",
      "duration_weeks": <int>,
      "estimated_cost": "<rough range>",
      "minimum_detectable_lift": "<percentage>"
    }
  },
  "cut_or_test": {
    "channel": "<name>",
    "why": "<one-paragraph rationale>",
    "magnitude": "<small | moderate | large>",
    "test_design": { ... same shape }
  },
  "incrementality_test": {
    "channel": "<name>",
    "why": "<one-paragraph rationale>",
    "test_design": { ... same shape }
  }
}

Rules:
- Each test design must pass a basic statistical-power check.
  A test needing more than 12 weeks to detect a 10% lift is
  flagged as "not feasible" and you propose an alternative.
- The cut_or_test recommendation defaults to "test, then cut"
  unless evidence is very strong.
```

**Step 5.2, present to the team.**

You now have the artefact a CFO will sign off on. The three bets are concrete, scoped, and each comes with a test design. Run the tests, learn, repeat the pipeline next quarter.

## Worked example, end-to-end

Cascadia Endurance, a fictional UK trail-running apparel brand, scale-stage, spending around £80k a month on paid across Meta, Google Ads and a small Display retargeting line.

**Phase 1 output.** Three sources pulled across 12 weeks. Master sheet has 6 channels (Paid social, Paid search, Display, SEO, Email, Direct).

**Phase 2 output.** Three contested channels.

```json
{
  "contested_channels": [
    {"channel": "Paid social", "cv": 0.62, "platform_reading": 4180, "ga4_dda": 2890, "ga4_lc": 1940, "absolute_volume": 3003, "rank": 1},
    {"channel": "Display", "cv": 0.84, "platform_reading": 380, "ga4_dda": 110, "ga4_lc": 18, "absolute_volume": 169, "rank": 2},
    {"channel": "Paid search", "cv": 0.21, "platform_reading": 2840, "ga4_dda": 2610, "ga4_lc": 3120, "absolute_volume": 2857, "rank": 3}
  ]
}
```

Paid search is only just noisy, ignore. Paid social and Display are the action items.

**Phase 3 output.** Display correlates 0.62 with branded search, peak lag of 1 week. Strong signal. Display is driving branded search that gets credited to "Direct".

**Phase 4 output.** Paid social, most plausible hypothesis is platform self-credit bias. Meta is inflating. Display, most plausible hypothesis is brand-effect bleed. The branded search lift confirms it.

**Phase 5 output.**

```json
{
  "invest_more": {
    "channel": "Display",
    "why": "Display correlates strongly with branded-search lift and is under-credited by last-click. Volume is small but the signal is clean. Increasing budget tests whether the brand-effect scales.",
    "magnitude": "moderate",
    "test_design": { "method": "budget-lift", "duration_weeks": 6, "estimated_cost": "£15-25k", "minimum_detectable_lift": "20%" }
  },
  "cut_or_test": {
    "channel": "Paid social",
    "why": "CV of 0.62, platform self-credit at ~45% of acquisitions, GA4 last-click at ~22%. Run a geo-holdout to resolve before committing more budget.",
    "magnitude": "large",
    "test_design": { "method": "geo-holdout", "duration_weeks": 8, "estimated_cost": "~£40k revenue at risk", "minimum_detectable_lift": "12%" }
  },
  "incrementality_test": {
    "channel": "Paid social",
    "why": "Same channel as cut_or_test, run the test before deciding.",
    "test_design": { "method": "geo-holdout", "duration_weeks": 8, "estimated_cost": "~£40k revenue at risk", "minimum_detectable_lift": "12%" }
  }
}
```

Cascadia takes the three bets to finance. The geo-holdout runs, paid social comes in at 25% incremental, budget gets reshaped. Display gets a modest budget lift and branded search holds the new level. Next quarter the pipeline runs again on fresh data.

## Try it yourself

Three exercises, each takes 15-30 minutes once you have your master sheet.

### Exercise 1, single-channel CV calculation

Pick one of your contested channels. Compute CV by hand:

- Mean = (Source 1 + Source 2 + Source 3) / 3
- Variance = average of (each source minus the mean) squared
- SD = square root of variance
- CV = SD / mean

If CV > 0.5 the channel is contested and worth resolving. Sanity check this against what the Phase 2 prompt produced.

### Exercise 2, run Phase 2 end-to-end

Paste your master sheet into the Phase 2 prompt. Read the JSON output. Pick your top contested channel and ask Claude in a follow-up:

> "For [channel name], walk me through the most likely hypothesis for the disagreement and what evidence would confirm or refute it."

You should get a tight one-paragraph read that you can take into a team conversation.

### Exercise 3, test design check

For your top contested channel, ask Claude:

> "Design an incrementality test for [channel]. We have a maximum 4-week runtime and we can budget [£X] of revenue at risk. What is the minimum detectable lift, and is this test feasible?"

If the answer is "not feasible at 4 weeks" then either accept a longer runtime, accept a larger detectable threshold (15% instead of 10%) or accept that the channel cannot be cleanly tested with your current scale.

## The eval gates

**Eval 1, cross-source completeness.** You need at least three sources. Two is binary and gives you no signal. Don't run until you can pull three.

**Eval 2, time-window stability.** Re-run Phase 2 on a 4-week window and a 12-week window. If a channel is contested in the short window but agreed-on in the long window, the disagreement is short-term noise (a creative change, a seasonal spike). Use the longer window for recommendations.

**Eval 3, test design soundness.** Every recommended test must pass the statistical-power check. A test needing 40 weeks to detect a 5% lift is not a useful test. Accept a larger detectable threshold or accept that the channel cannot be cleanly resolved.

## The failure modes

**Platform self-credit goes uncorrected.** Every platform credits itself generously. The pipeline flags this, but if the brand acts on Meta's reported conversions as ground truth, the recommendations will be wrong. Weight platform-reported numbers below GA4's data-driven attribution as the default.

**Brand-search correlation is not causation.** Branded search rises for many reasons (PR, organic word-of-mouth, seasonal). The Phase 3 output notes correlation, not causation. Don't credit upper-funnel paid solely on branded-search lift unless you can rule out the alternatives.

**Incrementality tests get cancelled.** When the geo-holdout test starts costing revenue, finance asks to stop. The temptation is to call the partial data the answer. Resist. Partial tests over-attribute because the holdout has not bottomed out. Either run to completion or do not run at all.

**The team treats the output as a verdict.** The pipeline produces a list of probable misattributions. It is a starting point for tests, not a final answer. Treating it as the verdict is exactly the failure the pipeline is meant to fix.

## The pattern in practice

Illustrative scenarios that show common shapes attribution tear-downs take. Specifics are illustrative and the patterns repeat.

**D2C, scale-stage, the over-credited channel.** A brand crediting paid social with around 45% of acquisitions. The tear-down finds GA4 data-driven attribution at ~28%, the platform pixel at ~52%, an incrementality test at ~19%. A bounded test cut typically holds revenue within a few percentage points while releasing budget for an under-credited channel (often SEO content) that pays back within two quarters.

**B2B SaaS, growth-stage, the under-credited brand effect.** A brand about to kill Display because GA4 last-click reports near-zero. The tear-down surfaces a measurable branded-search lift on weeks when Display runs heavily. Keeping Display, making it cheaper and more targeted, holds the branded-search lift. Display moves from "kill" to "small but earning" because the right metric for it was upstream rather than last-click.

## Hand-off

Once you have the three bets, the work feeds:
- **channel-mix-simulator**, model the budget shift before you commit.
- **paid-search-bidding-agent**, if paid search is your invest-more bet.
- **lifecycle-journey-builder**, if your test reveals email or retention is doing more than credited.
