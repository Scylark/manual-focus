---
post: google-ads-channel-prioritisation-paid-teams
title: "What Google Ads channel prioritisation means for paid teams"
---

James and Hannah talk through the two Google Ads controls announced on 14
October 2026: channel prioritisation, which ranks Search, search partners and
Display as high or low priority, and budget allocation, which caps a low
priority channel at a share of daily budget. They cover which campaign types
get which control, why prioritisation only bites on budget-limited campaigns,
what changes for Search campaigns on Display in February 2027, and three jobs
to hand to AI before then.

## Get AI on this

Paste these into whichever AI assistant you use: ChatGPT, Claude, Gemini or
Copilot. Swap the bracketed parts for your own details. All three need file
uploads; the third also needs an assistant that can run on a schedule.

### 1. Audit Search campaigns before February 2027

```text
I run paid search for [brand] in [market]. From February 2027, Google Ads
moves every Search campaign with Display Expansion enabled onto channel
prioritisation and budget allocation, and Display stops serving on Search
campaigns that use Target Impression Share.

Attached is a Google Ads campaign export with, for each Search campaign: the
campaign name, whether Display Expansion is on, the bid strategy, the average
daily budget, and whether the campaign is limited by budget.

Give me a table with the columns: Campaign | Display on? | Bid strategy |
Limited by budget? | Migrates in February? (yes/no) | Loses Display because
of Target Impression Share? (yes/no) | Suggested Display setting.

For the suggested setting, use "low priority, 50% allocation" to keep today's
behaviour where Display's results look sound, and "low priority, 5% to 10%"
where the export shows no evidence either way. Explain each suggestion in a
few words. If a column is missing from the export, say which and leave that
cell as "not in data" rather than guessing.
```

### 2. Read a capped channel test

```text
I ran a test in Google Ads on the campaign [campaign name]. On [start date] I
set [search partners / the Google Display Network] to low priority with a
[5%] budget allocation, where before it was switched off.

Attached are two reports for this campaign, one for the four weeks before the
change and one for the four weeks after, with cost, conversions, cost per
acquisition and new customer conversions, split by network where available.

Give me:
1. A table with the columns: Metric | Four weeks before | Four weeks after |
   Change.
2. What the low priority channel spent, as a share of the campaign's daily
   budget, and on how many days it went over the cap.
3. One recommendation: raise the cap, keep it, or switch the channel off,
   with the reason in two sentences.

If the volumes are too small to tell a real change from noise, say so plainly
instead of recommending. Don't use any figure that isn't in the reports.
```

### 3. Track the change plan account by account

```text
Set this up as a routine that runs every Monday morning until the end of
February 2027.

Google Ads channel prioritisation and budget allocation can't be set from a
manager account, and the Google Ads API and Editor don't support them yet, so
each account has to be changed by hand.

Attached is our account list: account name, the Search campaigns in each, and
the Display setting we've decided for each campaign. Each week I'll attach the
same list with a "Done" column filled in.

Give me a change plan per account: the campaigns to change, the setting for
each, in the order to do them, with the campaigns that use Target Impression
Share and those already done marked. Then a short summary: accounts finished,
accounts left, and any account where the decided setting is missing. If this
week's list is missing or doesn't match last week's, say what changed rather
than assuming.
```
