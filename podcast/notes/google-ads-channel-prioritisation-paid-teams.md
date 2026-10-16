---
post: google-ads-channel-prioritisation-paid-teams
title: "What Google Ads channel prioritisation means for paid teams"
---

James and Hannah talk through the two Google Ads settings announced on 14
October 2026: channel prioritisation, which lets you rank channels such as
search partners and the Display Network as high or low priority, and budget
allocation, which caps a low priority channel at a share of daily budget on a
best-effort basis. They cover why prioritisation only moves money on
budget-limited campaigns, why we'd swap search partner and Display opt-outs for
a small capped test, what changes for Search campaigns on Display in February
2027, and three jobs to hand to AI before then.

## Get AI on this

Paste these into whichever AI assistant you use: ChatGPT, Claude, Gemini or
Copilot. Swap the bracketed parts for your own details. All three need file
uploads; the second also needs an assistant that can run on a schedule. Making
the changes in Google Ads stays with your team.

### 1. Find every Search campaign that migrates in February

```text
I run paid search for [brand or agency], managing [number] Google Ads
accounts for [market].

From February 2027, Google Ads Search campaigns with Display Expansion
enabled move automatically to channel prioritisation and budget allocation.
Google says a Display Network setting of low priority with a 50% daily budget
allocation keeps today's behaviour. Display will also stop serving on Search
campaigns that use the Target Impression Share bid strategy. Prioritisation
only changes spend on campaigns limited by budget; on campaigns with headroom,
only the budget allocation moves money.

Attached is a campaign export with, for each Search campaign: account,
campaign name, whether Display Expansion is on, whether search partners are
on, bid strategy, daily budget and budget status (limited or not).

Give me a table with the columns: Account | Campaign | Display on? (yes/no) |
Search partners on? (yes/no) | Bid strategy | Budget-limited? (yes/no) |
Migrates in Feb 2027? (yes/no) | Loses Display because of Target Impression
Share? (yes/no) | Which lever will move spend (prioritisation, allocation,
or both).

Sort by account, then by daily budget, highest first. If a column is missing
or unclear in the export, write "not in data" rather than guessing.
```

### 2. Read the capped channel test every week

```text
Set this up as a routine that runs every Monday morning for four weeks,
starting [date the test began].

Context: on the campaign [campaign name] in [account], we moved [search
partners or the Google Display Network] from opted out to low priority with
a [5]% budget allocation on [date]. Google applies the allocation on a
best-effort basis, so daily spend can go over the cap.

Each week I'll attach an export of the campaign's results by week, with
spend, conversions, cost per acquisition and new customer share, broken down
by channel where Google Ads provides it. Our target cost per acquisition is
[£X].

Each run, give me:
1. A table with the columns: Week | Channel | Spend | Cap for the week
   (allocation x average daily budget x 7) | Over cap? (yes/no, by how much) |
   Conversions | Cost per acquisition | New customer share.
2. Two sentences on how the test channel compares with Google Search.

At week four, add a recommendation: raise the cap, keep it, or set the
channel to 0%, with the reason in one paragraph. List anything you couldn't
check, especially if the export didn't break results down by channel.
```

### 3. Turn the caps into a budget sheet

```text
I manage Google Ads for [number] accounts at [brand or agency]. Channel
prioritisation and budget allocation can't be set from a manager account,
and Google Ads API and Editor support isn't available yet, so every change
has to be made account by account.

Attached are:
- our account and campaign list, with campaign type (Search, Shopping,
  Performance Max, Demand Gen) and average daily budget
- our quarterly channel mix plan for [quarter]

Draft a planning sheet as a table with the columns: Account | Campaign |
Campaign type | Channel | Proposed priority (high or low) | Proposed
allocation % | Daily cap in [currency] | Owner | Date to change | Note.

Use these defaults unless I've marked otherwise: Display that we want
unchanged at low priority, 50%; Display or search partners we haven't
checked at low priority, 5% to 10%. Demand Gen campaigns support
prioritisation but not budget allocation, so leave their allocation blank.

Leave Owner and Date to change blank for me to fill in. Flag any campaign
where the export doesn't give you enough to propose a setting.
```
