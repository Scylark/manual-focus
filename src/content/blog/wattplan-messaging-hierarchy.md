---
title: "The WattPlan messaging house, how we built it and what it does"
date: 2026-11-02
tags: ["brand", "ai", "endurance-sports"]
description: "WattPlan's messaging house puts one tagline over one claim, three benefits and the code that proves each feature. How we built it and how to copy the method."
podcast:
  audio: "https://manual-focus-podcast.manual-focus.workers.dev/episodes/wattplan-messaging-hierarchy-20261102101515.mp3"
  duration: 481
  bytes: 5772270
  published: 2026-11-02
faq:
  - question: "What is a messaging house?"
    answer: "A messaging house is a one-page hierarchy for everything a brand says. One memorable line sits at the top, a plain description and a core claim sit beneath it, and three or four benefits hold the house up, each proved by named features. Every piece of copy, from a store listing to a push notification, leads with the top and goes as far down as it has room for."
  - question: "What does WattPlan's tagline Train. Adapt. mean?"
    answer: "Train. Adapt. carries four readings in two words. Train means do the work and ride. Adapt means the body adapts through training, which is the sport, and it means the plan adapts to what the rider did, which is the product. Read together, training and adapting is the loop that makes a cyclist faster. The product used the word adapt in its code before the brand did."
  - question: "Why does WattPlan avoid saying AI-powered?"
    answer: "WattPlan's messaging house bans AI-powered, powered by AI and our advanced algorithms as filler, because every rival can say them and none of them tells a rider what changes. The house also keeps the Coach from disclosing its model or vendor. Copy names what WattPlan does instead, such as repairing the week after a missed workout, and uses AI Cycling Coach only in the store app name to establish the category."
  - question: "How long can App Store and Google Play copy be?"
    answer: "Apple allows an app name of up to 30 characters, a subtitle of 30, promotional text of 170 and keywords of 100 characters, with up to 10 screenshots. Google Play allows an app name of 30 characters, a short description of 80 and a full description of 4,000, with up to eight screenshots per device type. WattPlan's house records the approved copy for each field and how much of each limit it uses."
  - question: "Does WattPlan promise to make you faster?"
    answer: "No. WattPlan's short description says it is built to make you stronger on the bike, which states the purpose of the product without a guaranteed result or timeframe. The messaging house bans promises of watts, FTP points, times or placings, bans medical and safety claims, and bans comparing the Coach with a human coach, because none of them can be substantiated for every rider."
sources:
  - title: "WattPlan. Train. Adapt."
    url: "https://wattplan.cc/"
    publisher: "WattPlan by Manual Focus"
  - title: "WattPlan pricing"
    url: "https://wattplan.cc/pricing"
    publisher: "WattPlan by Manual Focus"
  - title: "Creating your product page"
    url: "https://developer.apple.com/app-store/product-page/"
    publisher: "Apple Developer"
  - title: "Add preview assets to showcase your app"
    url: "https://support.google.com/googleplay/android-developer/answer/9866151"
    publisher: "Google Play Console Help"
  - title: "Create and set up your app"
    url: "https://support.google.com/googleplay/android-developer/answer/9859152"
    publisher: "Google Play Console Help"
  - title: "Deceptive Behavior"
    url: "https://support.google.com/googleplay/android-developer/answer/9888077"
    publisher: "Google Play Developer Policy Center"
  - title: "The CAP Code, section 3, Misleading advertising"
    url: "https://www.asa.org.uk/type/non_broadcast/code_section/03.html"
    publisher: "Advertising Standards Authority"
---

WattPlan is Manual Focus's own cycling training app, and since 11 September 2026 every line of its copy has traced back to one document, a messaging house. One two-word tagline, Train. Adapt., sits over one product claim, three benefits and a proof row for every feature that names the code behind it. This is how we built it.

## Key takeaways

- The WattPlan messaging house has five levels. A two-word tagline, a 61-character short description, one core product claim, three benefits and a proof row for every supporting feature.
- Every supporting feature in the house carries a reference to the code that ships it, so when the team removes a capability the claim retires the same day.
- The house corrected five stale claims before they reached a store listing, including a workout library of 67 where older documents said more than 100, and a calendar export that had never been built.
- The approved store copy fits the published limits, 30 characters for an app name, 80 for Google Play's short description and 170 for App Store promotional text.
- Superlatives stay out of WattPlan copy because the ASA treats an unqualified superlative as a comparison with every competing product.

## Why build a messaging house at all?

[WattPlan](https://wattplan.cc/) builds a cyclist's training plan around their goals and the hours they have, then adjusts it when a ride is missed or goes harder than planned. It has a Coach the rider can talk to, and it syncs and scores rides from Garmin, Strava and Wahoo. That is a lot of product to describe across two store listings, a website, an app, emails and release notes, and left alone each surface drifts towards its own version of the story.

A messaging house stops the drift. It is the [communication hierarchy](/blog/what-is-marketing-basics/) from our basics series applied to one product, with one rule added. Every line must trace to a benefit in the document, and if it cannot, it does not ship. Because WattPlan is our own app, this is a worked example from the inside, mistakes included.

## What the house says

The house starts with the feeling WattPlan should create, confidence that your training is right, and gives the cyclist more detail as they move towards action. The top is emotional and memorable, the bottom is proof, and copy leads with a feature only when the cyclist already understands the proposition.

<figure class="dg dg-house"><div class="dg-head"><span class="dg-kicker">The WattPlan messaging house · revised 11 September 2026</span><span class="dg-title">Five levels, each proving the one above</span></div><div class="dg-house-roof"><span class="dg-label">Tagline</span><span class="dg-strong">Train. Adapt.</span></div><div class="dg-house-band dg-house-feel"><span class="dg-label">Emotional benefit · internal</span><span class="dg-strong">Confidence that your training is right</span></div><div class="dg-house-band dg-house-ridge"><span class="dg-label">Short description · 61 of 80 characters</span><span class="dg-strong">A cycling training app built to make you stronger on the bike</span></div><div class="dg-house-band dg-house-claim"><span class="dg-label">Core product claim</span><span class="dg-strong">WattPlan builds your training around your goals and the time you have, adjusting it as things change.</span></div><ol class="dg-list dg-pillars"><li class="dg-pillar"><div class="dg-pillar-top"><span class="dg-label">Benefit 1 · the week</span><span class="dg-strong">Personalised. Training</span><span class="dg-q">When life or riding changes, WattPlan keeps you on track.</span></div><ul class="dg-list dg-proofs"><li>Training plans built around your days and hours<span class="dg-code">plan_generator.js · week_coherence.js</span></li><li>Adjusted for life after a missed workout<span class="dg-code">repairWeek() · rebalanceWeekAfterMiss()</span></li><li>Adjusted for the rides you did<span class="dg-code">overshoot, undershoot and fatigue rules</span></li><li>Strength placed around the riding<span class="dg-code">strength_sessions.js</span></li></ul></li><li class="dg-pillar"><div class="dg-pillar-top"><span class="dg-label">Benefit 2 · the Coach</span><span class="dg-strong">Questions. Answered.</span><span class="dg-q">Ask a normal question and get an answer based on your plan and rides.</span></div><ul class="dg-list dg-proofs"><li>Talk to a coach that knows your plan, rides and event<span class="dg-code">ai.js assembles the context</span></li><li>Change the plan by asking<span class="dg-code">Coach action tags · updatePlanDay()</span></li><li>Long-term memory of goals, injuries and schedule<span class="dg-code">coach_memories</span></li><li>Proactive coaching after a ride or personal best<span class="dg-code">webhook_shared.js · coaching_patterns.js</span></li></ul></li><li class="dg-pillar"><div class="dg-pillar-top"><span class="dg-label">Benefit 3 · the data</span><span class="dg-strong">Rides. Counted.</span><span class="dg-q">Connect once, then ride. WattPlan brings in the file and scores it.</span></div><ul class="dg-list dg-proofs"><li>Automatic ride sync from Garmin, Strava and Wahoo<span class="dg-code">garmin.js · strava.js · wahoo.js</span></li><li>Weighted Power, Intensity and Load for every ride<span class="dg-code">shared_calculations.js</span></li><li>Fitness Explorer trends<span class="dg-code">pmcHistoryDays · pmcForecastDays</span></li><li>Personal bests and FTP prompts<span class="dg-code">pb_shared.js · ftp_prompt.js</span></li></ul></li></ol><ul class="dg-list dg-house-base"><li><span class="dg-label">Foundation</span>Tone of voice, an experienced club rider who knows the science</li><li><span class="dg-label">Foundation</span>Product substantiation, shipped claims and a corrections log</li><li><span class="dg-label">Foundation</span>Claims WattPlan does not make, medical, guaranteed gains, safety</li></ul><div class="dg-note">The code names in the proof rows are the point. If a file moves, the reference is fixed. If a capability goes, the claim goes the same day.</div></figure>

Benefit 1 leads because personalising the week is WattPlan's point of difference. The emotional benefit above the short description guides the proposition and the product, and it never appears in customer copy as written, because it would read as a performance promise.

## How two words carry four readings

Cyclists train so their bodies adapt, and WattPlan uses the same word for its core mechanism. The adaptation engine and its audit fields carried the word adapt in the code before the brand did, so the tagline describes the product rather than decorating it.

<figure class="dg dg-readings-fig"><div class="dg-head"><span class="dg-kicker">The tagline</span><span class="dg-title">Four readings of Train. Adapt.</span></div><ul class="dg-list dg-readings"><li class="dg-reading"><span class="dg-strong">Train</span><span class="dg-q">Do the work. Ride.</span><span class="dg-chip">The cyclist</span></li><li class="dg-reading dg-lead"><span class="dg-strong">Adapt, the body</span><span class="dg-q">Your body adapts through training.</span><span class="dg-chip">The sport</span></li><li class="dg-reading dg-lead"><span class="dg-strong">Adapt, the plan</span><span class="dg-q">The plan adapts to what you actually did.</span><span class="dg-chip">The product</span></li><li class="dg-reading"><span class="dg-strong">Train and adapt</span><span class="dg-q">The loop that makes you faster.</span><span class="dg-chip">Both</span></li></ul><div class="dg-note">The second and third readings do the work. The stops are a typographic treatment for lockups and end frames. In body copy it is train and adapt.</div></figure>

Two earlier lines were retired. "Your Cycling Coach That Never Switches Off" went because uptime does not sell a training app. "Turn cycling commitment into real performance improvement" went because WattPlan cannot guarantee performance, and the [CAP Code](https://www.asa.org.uk/type/non_broadcast/code_section/03.html) requires documentary evidence for any claim a consumer would read as objective.

## How was it built from the code?

Traceability is what separates the house from a brand deck. We wrote the proof column first, against the shipped product, and let the claims follow, so every supporting feature names the function or file that delivers it. Pricing was checked against the subscription configuration on 18 August 2026 and the store field limits against Apple and Google's guidance on 11 September 2026. Writing that way turned up five claims that older internal documents still made and the product no longer supported.

| Stale claim | What the code showed | What the house says instead |
|---|---|---|
| More than 100 workouts | 67 workouts across seven zones | "A structured library across every training zone", because the count will change |
| Calendar export | No iCal or .ics writer exists | Roadmap work, kept out of store and pricing copy |
| Zwift export is Premium | The export ships free | Kept out of the Premium list |
| Ride Review as a feature | Shipped on 2 September 2026 as a Coach review | "A Coach review after every ride", because the benefit is the review |
| Garmin and Wahoo push as Premium | Both ship free | Claim the capability without a tier |

Each would have gone into a store listing. Google Play's [Deceptive Behavior policy](https://support.google.com/googleplay/android-developer/answer/9888077) requires an accurate description of an app's functionality in all parts of the metadata, so an overclaiming listing risks rejection, then refunds and poor reviews.

## Where does each message go?

The house maps a path rather than a script, and no asset has to walk all of it.

<figure class="dg dg-aida-fig"><div class="dg-head"><span class="dg-kicker">The message path</span><span class="dg-title">From attention to action</span></div><ol class="dg-list dg-aida"><li><span class="dg-letter">A</span><span class="dg-strong">Attention</span><span class="dg-q">Stop the right cyclist and establish the idea.</span><span class="dg-say">Train. Adapt.</span><span class="dg-q">Next move, read the short description.</span></li><li><span class="dg-letter">I</span><span class="dg-strong">Interest</span><span class="dg-q">Name the product and the rider outcome.</span><span class="dg-say">A cycling training app built to make you stronger on the bike</span><span class="dg-q">Next move, see how WattPlan delivers it.</span></li><li><span class="dg-letter">D</span><span class="dg-strong">Desire</span><span class="dg-q">Turn the proposition into outcomes the cyclist wants.</span><span class="dg-say">Personalised. Training · Questions. Answered. · Rides. Counted.</span><span class="dg-q">Next move, explore the features and proof.</span></li><li><span class="dg-letter">A</span><span class="dg-strong">Action</span><span class="dg-q">Make the first step clear and low-risk.</span><span class="dg-say">Start free. Upgrade when you're ready.</span><span class="dg-q">Create a plan for free and add Premium for the complete plan.</span></li></ol><div class="dg-note">No asset has to carry all four. A store listing can. A banner often carries the first and last only.</div></figure>

A routing table then names which benefit leads on each surface. The home hero carries the tagline and short description with Benefit 1 beneath. The integrations page and first-run onboarding lead with Benefit 3, because watching the plan fill itself in from a connected Garmin is the fastest proof the product offers. Adaptation notifications are Benefit 1, factual. Personal-best notifications are Benefit 2, warm and brief.

Behind the routing sit two feelings every surface should leave. Understood, because the plan takes the rider's real hours and has already read their ride. Consistent, because one missed workout does not decide the rest of the week.

<figure class="dg dg-feel-fig"><div class="dg-head"><span class="dg-kicker">The internal benefit</span><span class="dg-title">Understood and consistent, at every stage</span></div><div class="dg-feel"><div class="dg-feel-head"><span class="dg-label">Stage</span><span class="dg-label">Understood</span><span class="dg-label">Consistent</span></div><div class="dg-feel-row"><span class="dg-feel-stage">Setting up</span><span class="dg-cell dg-t1"><span class="dg-label">Understood</span>It takes your real hours, per day, not a fantasy</span><span class="dg-cell dg-t3"><span class="dg-label">Consistent</span>The week it builds is one you can actually ride</span></div><div class="dg-feel-row"><span class="dg-feel-stage">Mid-week</span><span class="dg-cell dg-t1"><span class="dg-label">Understood</span>Your ride is already in, already scored</span><span class="dg-cell dg-t3"><span class="dg-label">Consistent</span>Miss one and the rest of the week still makes sense</span></div><div class="dg-feel-row"><span class="dg-feel-stage">After</span><span class="dg-cell dg-t1"><span class="dg-label">Understood</span>It saw the personal best before you did</span><span class="dg-cell dg-t3"><span class="dg-label">Consistent</span>The block completes instead of collapsing</span></div></div><div class="dg-note">These are product tests, not headlines. A feature that strengthens neither feeling is a feature looking for a reason.</div></figure>

## What the house refuses to say

The longest section of the document is about silence. WattPlan makes no medical claims, promises no watts, FTP points, times or placings, and never presents the Coach as a replacement for a human coach. The Coach's own instructions call it an advisor, not an autopilot, so the copy cannot say "fire your coach". The house also bans invented popularity, so no "trusted by thousands", and bans advertising a free trial, because WattPlan has a permanent free tier instead.

The banned vocabulary runs to three lists. Sport clichés such as epic, pain cave and beast mode. Technology filler such as seamless, disruptive and next-generation. And AI filler, where AI-powered and our advanced algorithms are out because every rival can say them and none tells a rider what changes. A vocabulary table taken from the product's own screens sits alongside.

| Say | Not | Because |
|---|---|---|
| Plan | Programme, schedule, block | The screen is called Plan and the product has no "programme" in it |
| Coach | Assistant, bot, AI | The tab is Coach and the placeholder reads Ask your coach |
| Cyclist, rider | Athlete, user, triathlete | WattPlan is cycling only |

Our view at Manual Focus is that a messaging house earns its keep only when every claim can be traced to something the product does today, because a brand document that cannot be checked against the product drifts from it within a release. The [brand guardrails as code](/lens/ops/brand-guardrails-as-code/) playbook turns a document like this into a check that runs before copy ships.

## How to build one for your product

1. **Write the proof column first.** List what the product does today, with the feature, file or setting that delivers it, and let the benefits come from the list. Anything the list cannot support goes in a corrections log.
2. **Retire lines in writing.** Name each dropped tagline and the reason, so nobody revives it from an old deck. The [tagline system](/lens/brand/tagline-system/) playbook covers generating and testing the replacement.
3. **Put the channel limits in the document.** Apple's [product page guidance](https://developer.apple.com/app-store/product-page/) gives 30 characters for a name and subtitle, 170 for promotional text and 100 for keywords. Google Play gives [30, 80 and 4,000](https://support.google.com/googleplay/android-developer/answer/9859152) for the name, short and full descriptions. Record how much of each your copy uses.
4. **Route the benefits.** One table naming which benefit leads on each surface, from store listing to empty state, ends most arguments about what a page says first.
5. **Write the silence.** The claims you will not make, with the regulation or product limit behind each, protect you from the enthusiastic draft on release day.

## What the house hasn't settled

The document ends with open decisions rather than a flourish. Garmin and Wahoo workout push ship free, so the product gate must change before any Premium claim about them. iOS push notifications stay out of App Store copy until a build passes delivery tests on a physical iPhone. Customer copy uses British English while some product strings still mix spellings. A house that admits what it hasn't decided is easier to trust than one that reads as finished.

## Further reading

- [What is marketing, a basics guide from market fit to SOSTAC](/blog/what-is-marketing-basics/), where the communication hierarchy and benefits ladder this house applies are explained
- [Strategy vs campaign vs creative vs execution](/blog/strategy-campaign-creative-execution-basics/), for where a messaging house sits among the four layers
- [Message house generator from positioning brief](/lens/brand/message-house-generator/), the Lens playbook for building a four-tier house in a working day
- [Brand guardrails as code](/lens/ops/brand-guardrails-as-code/), for turning the banned lists into an automated check

If you want help building a messaging house that traces to what your product does, our [services page](/services/) explains how we work.
