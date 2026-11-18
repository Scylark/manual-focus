---
title: "Meta's crawling terms delay, what UK advertisers should do now"
date: 2026-10-25
tags: ["ai-briefing", "ai", "brand"]
description: "Meta pushed its website-crawling terms back to 20 November 2026 and cut the word train. The crawling licence is unchanged, so keep your robots.txt plan."
podcast:
  audio: "https://manual-focus-podcast.manual-focus.workers.dev/episodes/meta-crawling-terms-delay-uk-advertisers.mp3"
  duration: 466
  bytes: 5586696
  published: 2026-10-25
faq:
  - question: "When do Meta's new Commercial Terms take effect?"
    answer: "Meta told Reuters on 23 October 2026 that its updated Commercial Terms and Self-Serve Ad Terms will take effect on 20 November 2026 instead of 30 October. The US English preview now shows 20 November. The UK English preview still showed 30 October on 25 October, so UK businesses should ask Meta in writing which date applies to their accounts."
  - question: "Did Meta remove AI training from its Commercial Terms?"
    answer: "Meta removed the word train from the crawling clause after publishers objected, according to The Next Web. Both English previews now say Meta may use content from sites associated with a business to provide, develop, improve, research and maintain advertising and business products. The terms neither name nor rule out training, and the right to crawl and use test credentials is unchanged."
  - question: "Do I still need to change robots.txt for Meta's crawlers?"
    answer: "Yes. Meta's revised Commercial Terms still let it crawl, index and collect from domains associated with a business, and neither English preview mentions robots.txt. Meta says site owners can still state preferences there, and its crawler documentation separates Meta-ExternalAgent, which gathers content for uses such as training foundation models, from Meta-WebIndexer, which helps Meta AI cite and link to sites."
  - question: "Why did Meta delay its new terms to 20 November?"
    answer: "A Meta spokesperson told Reuters the delay allows more time to explain to partners and stakeholders what is changing and what is not. Reuters reported that publishers and digital advertisers had complained to EU and UK antitrust authorities that the terms gave Meta an unlimited right to use their content for its AI services, a claim Meta rejects."
sources:
  - title: "Meta Commercial Terms, US English edition effective 20 November 2026"
    url: "https://www.facebook.com/legal/commercial_terms_preview"
    publisher: "Meta"
  - title: "Meta Commercial Terms, UK English edition preview"
    url: "https://en-gb.facebook.com/legal/commercial_terms_preview"
    publisher: "Meta"
  - title: "Meta Web Crawlers"
    url: "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/"
    publisher: "Meta for Developers"
  - title: "Meta to delay new commercial terms criticised by publishers, advertisers"
    url: "https://www.investing.com/news/stock-market-news/meta-to-delay-new-commercial-terms-criticised-by-publishers-advertisers-4969745"
    publisher: "Reuters"
  - title: "Meta delays its website-crawling terms after a publisher backlash"
    url: "https://thenextweb.com/news/meta-delays-crawling-terms-publishers"
    publisher: "The Next Web"
---

UK advertisers now have until 20 November 2026, not 30 October, before Meta's new crawling terms apply, after Meta told Reuters on 23 October 2026 that it needed more time to explain them. Meta has cut the word train from the clause, but the licence to crawl sites linked to your ads stands, so the robots.txt work still needs doing.

## Key takeaways

- Meta moved the effective date of its updated Commercial Terms and Self-Serve Ad Terms from 30 October to 20 November 2026, a spokesperson told Reuters on 23 October.
- The US English preview of the terms shows 20 November 2026, while the UK English preview still showed 30 October 2026 when we read it on 25 October.
- Both English previews now say Meta may use content from sites associated with a business to provide, develop, improve, research and maintain advertising and business products, with no mention of training.
- The clause still lets Meta use crawlers and test credentials to access, index, cache and collect from those sites, and neither preview mentions robots.txt.
- Reuters reported that publishers and digital advertisers had complained to EU and UK antitrust authorities before the delay, and The Next Web reported that Britain's competition watchdog has asked Meta to explain the terms.

## What moved on 23 October

Eight days ago we set out [what Meta's new crawling terms mean for UK advertisers](/blog/meta-commercial-terms-crawling-uk-advertisers/), with a 30 October deadline. On Friday 23 October a Meta spokesperson told [Reuters](https://www.investing.com/news/stock-market-news/meta-to-delay-new-commercial-terms-criticised-by-publishers-advertisers-4969745) that Meta was extending the effective date of both sets of terms to 20 November "to allow more time for us to explain to our partners and stakeholders what's changing and what's not". Reuters said publishers and digital advertisers had complained to EU and UK antitrust authorities that the terms would give Meta an "unlimited right to use their content" for its AI services, which Meta rejects.

[The Next Web](https://thenextweb.com/news/meta-delays-crawling-terms-publishers) reported that the News/Media Alliance, which represents more than 2,000 US publishers, sent Mark Zuckerberg a letter the day before demanding the terms be withdrawn, and argued that publishers can't block Meta's crawlers in practice because their ads depend on them. European publishers asked EU and UK regulators on 21 October to suspend the terms. The Next Web also reported, citing Fast Company, that the disputed wording hasn't changed since Meta dropped train and that Meta still plans to go ahead.

## Which Meta page is right?

The [US English preview](https://www.facebook.com/legal/commercial_terms_preview) now carries an effective date of 20 November 2026. The [UK English preview](https://en-gb.facebook.com/legal/commercial_terms_preview) still showed 30 October 2026 when we read it on 25 October, two days after the Reuters statement. Meta hasn't said which page governs a UK account while the two disagree, and a UK legal team shouldn't guess. Get the date confirmed for your accounts in writing.

## What changed in the wording?

The purpose sentence changed. When we read the UK edition on 17 October it said Meta could use content to "provide, develop, improve, research, train and maintain the integrity of" its products. The table compares that with what both English editions say now.

| Part of the clause | UK edition on 17 October | Both English editions on 25 October |
|---|---|---|
| Which sites | Domains, pages or URLs associated with your products or services | The same |
| What Meta may do | Access, index, cache, analyse, collect, retrieve or crawl, plus test credentials | The same |
| What the content is for | Provide, develop, improve, research, train and maintain Meta products | Provide, develop, improve, research and maintain advertising and business products, plus integrity and security |
| Mentions training | Yes, by name | No |
| Mentions robots.txt | No | No |
| Effective date shown | 30 October 2026 | US 20 November 2026, UK still 30 October 2026 |

The UK and US purpose sentences now match, which closes the gap our earlier post flagged. The licence itself didn't shrink. Meta can still send automated software and test credentials to any site associated with your products, pull updates from them periodically and keep what it collects. "Develop" and "research" remain in the list, and the terms say nothing either way about whether those cover training a model.

## Does robots.txt still matter?

It matters as much as it did a week ago. Meta says site owners can still use robots.txt to state their preferences, according to The Next Web, but that promise sits in a press statement rather than in the terms. Meta's [crawler documentation](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) still lists Meta-ExternalAgent as the crawler for uses such as "training foundation AI models", and Meta-WebIndexer as the one that helps Meta AI cite and link to your content. Meta-ExternalFetcher and FacebookExternalHit may bypass robots.txt in some cases. Meta also notes that its crawlers can cache robots.txt for up to 24 hours, so a rule you add takes a day to bite.

## Why the extra weeks help brand teams

Brand and content teams gain the most from the delay. The rights question, whether you can let Meta collect licensed photography, creator content and customer reviews from your product pages, needed legal review that few teams could finish in 13 days. The [customer content rights playbook](/lens/ops/customer-content-rights/) logs what each permission allows, and 26 days is enough to check the licences behind your highest-traffic product pages.

Paid teams get room to stagger their reviews. OpenAI's switch to [ChatGPT Ads creative enhancements by default](/blog/chatgpt-ads-creative-enhancements-default/) still lands at the end of October, so ad operations can settle that first and come back to Meta's terms in November.

Our view at Manual Focus is that the delay changes the deadline and nothing else, so UK brands should finish the plan they started for 30 October. That means blocking Meta-ExternalAgent on domains that carry licensed or customer content, keeping Meta-WebIndexer allowed so Meta AI can cite you, and getting Meta's answers in writing before 20 November. The trade-off is the one we described in [The citation moved off the page](/blog/the-citation-moved-off-the-page/), where staying retrievable by AI answers is worth more than any training data a single brand holds back.

## Four jobs before 20 November

1. **Confirm the date for your accounts.** Ask your Meta representative which effective date applies to your UK ad accounts and Business Suite, and why the UK preview still shows 30 October. File the reply.
2. **Ship the robots.txt rules this week.** Add the Meta-ExternalAgent Disallow rule on every associated domain where you hold licensed or customer content, confirm Meta-WebIndexer and FacebookExternalHit stay allowed, and check your CDN's bot settings agree. Doing it now leaves time to watch catalogue and ad delivery before the terms apply.
3. **Re-brief legal on the new wording.** Send them the 25 October text and ask whether "develop" and "research" let your content be used in ways your photography, creator and review licences forbid.
4. **Write the decision into your brand rules.** Record which crawlers you block on which domains and why, so new microsites inherit it. The [brand guardrails as code playbook](/lens/ops/brand-guardrails-as-code/) shows how to make that rule checkable.

## Open questions for Meta

Meta hasn't said whether it will change any more of the wording before 20 November or only explain it. It hasn't said whether a robots.txt block narrows the licence a business grants, or what test credentials can reach behind a login or paywall. We don't know what Britain's competition watchdog asked Meta or whether it will act, and the terms still offer no partial opt-out short of stopping business use of Meta's products. Recheck both previews in the week before 20 November, because any further edit will show there first.

## Further reading

- [What Meta's new crawling terms mean for UK advertisers](/blog/meta-commercial-terms-crawling-uk-advertisers/), the original breakdown of the clause and each Meta crawler
- [What ChatGPT Ads' automatic rewrites mean for UK advertisers](/blog/chatgpt-ads-creative-enhancements-default/), on the other platform default changing this month
- [Customer content rights pipeline](/lens/ops/customer-content-rights/), for checking which content you may let others collect
- [What the CMA's AI choice screen plan means for UK marketers](/blog/cma-google-choice-screen-ai-assistants/), on the UK regulator's wider work on AI and search
- [The citation moved off the page](/blog/the-citation-moved-off-the-page/), on why being cited by AI answers matters more than any one crawler

If you want help setting a crawler policy across your brand's sites, our [services page](/services/) explains how we work.
