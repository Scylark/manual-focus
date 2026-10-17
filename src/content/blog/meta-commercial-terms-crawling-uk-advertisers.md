---
title: "What Meta's new crawling terms mean for UK advertisers"
date: 2026-10-17
tags: ["ai-briefing", "ai", "brand"]
description: "Meta's new Commercial Terms, live on 30 October 2026, let it crawl sites linked to a business, and the UK edition names AI training. Set robots.txt now."
faq:
  - question: "What changes in Meta's Commercial Terms on 30 October 2026?"
    answer: "Meta's updated Commercial Terms, which replace the version in force since 6 March 2024, add a clause authorising Meta to use crawlers and create test credentials to access, index and collect the domains and pages associated with a business's products or services. The UK English edition says Meta may use that content to train its products. Continuing to use Meta's commercial products after 30 October means accepting the new terms."
  - question: "Can Meta train AI on my website if I advertise on Facebook or Instagram?"
    answer: "The UK English edition of Meta's Commercial Terms, effective 30 October 2026, says Meta may use content from domains associated with your products to research and train Meta products. The US English edition limits the purpose to advertising and business products and doesn't use the word train. Meta says the change is about pulling accurate product information for ad recommendations, not scraping news sites."
  - question: "Does robots.txt stop Meta crawling my site under the new terms?"
    answer: "Meta told Nieman Lab that content owners can still manage access with robots.txt, but the new Commercial Terms don't mention robots.txt at all. Meta's crawler documentation lists Meta-ExternalAgent for AI model training and Meta-WebIndexer for Meta AI search as separate user agents, while Meta-ExternalFetcher and FacebookExternalHit may bypass robots.txt in some cases."
  - question: "Which Meta crawler should a brand block?"
    answer: "Meta-ExternalAgent is the crawler Meta says gathers pages for uses such as training foundation AI models, so it is the one to block if a brand objects to training, though the block limits one crawler and isn't a confirmed training opt-out. Meta-WebIndexer improves Meta AI search results and helps Meta cite and link to a site, so most brands should keep it allowed. FacebookExternalHit fetches pages shared on Facebook, Instagram and Messenger."
sources:
  - title: "Meta Commercial Terms, UK English edition effective 30 October 2026"
    url: "https://en-gb.facebook.com/legal/commercial_terms_preview"
    publisher: "Meta"
  - title: "Meta Commercial Terms, US English edition effective 30 October 2026"
    url: "https://www.facebook.com/legal/commercial_terms_preview"
    publisher: "Meta"
  - title: "Meta Web Crawlers"
    url: "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/"
    publisher: "Meta for Developers"
  - title: "Meta's New Terms Expand Crawling Rights Beyond Advertisers"
    url: "https://www.searchenginejournal.com/metas-new-terms-expand-crawling-rights-beyond-advertisers/593217/"
    publisher: "Search Engine Journal"
---

From 30 October 2026, any business that keeps using Meta's commercial products accepts terms letting Meta crawl the websites associated with its products and, in the UK English edition, use that content to train Meta products. UK brands advertising on Facebook and Instagram have 13 days to decide what their robots.txt allows.

## Key takeaways

- Meta's updated Commercial Terms take effect on 30 October 2026, replacing the version in force since 6 March 2024.
- The new clause lets Meta use crawlers and create test credentials to access, index, cache and collect from domains "associated with your products or services".
- The UK English edition says Meta may use that content to "provide, develop, improve, research, train" its products, while the US English edition names advertising and business products and leaves out the word train.
- Neither edition mentions robots.txt, although Meta told Nieman Lab that content owners can still manage access with it.
- Meta's crawler documentation separates Meta-ExternalAgent, used for AI model training, from Meta-WebIndexer, used for Meta AI search, so a brand can block one and allow the other.

## The clause Meta added

The first section of the [UK English edition of the new terms](https://en-gb.facebook.com/legal/commercial_terms_preview), headed licences and rights you provide Meta, says "You authorise us (or any entity acting on our behalf) to use automated software (such as web scrapers, bots, robots, spiders, crawlers and user agents) and create test credentials to access, index, cache, analyse, collect, retrieve or crawl the domains, web pages or URLs (and any content available through them) that are associated with your products or services". It goes on to cover pages "made available through your or users' use of Meta Company Products and services" and lets Meta pull updates from them periodically.

Nieman Lab reported the change on 15 October after three legal professionals reviewed the terms, according to [Search Engine Journal](https://www.searchenginejournal.com/metas-new-terms-expand-crawling-rights-beyond-advertisers/593217/). Meta's spokesperson Andy Stone called that reporting false on X on 16 October and said the update is about pulling accurate product information from third-party sites for ad and content recommendations, "not about scraping news sites". SEJ reports that Meta declined to say whether test credentials would get past paywalls or paid content.

## Is the UK wording different?

Yes, on the page Meta serves today. We read both English editions on 17 October and the purpose sentence differs.

| | UK English edition | US English edition |
|---|---|---|
| Who it covers | Domains associated with your products or services | The same |
| What Meta may do | Access, index, cache, analyse, collect, retrieve or crawl, plus test credentials | The same |
| What the content is for | "provide, develop, improve, research, train and maintain the integrity of" Meta products, services and features | "provide, develop, improve, research, and maintain advertising and business products", plus integrity and security |
| Mentions robots.txt | No | No |
| Takes effect | 30 October 2026 | 30 October 2026 |

Meta hasn't explained the difference. Stone's description of the clause matches the US text more closely than the UK one, and a UK brand's legal team should read the edition Meta shows in its own Business Suite account rather than assume either.

## Who on the team is exposed?

Brand and content teams carry most of the exposure. A brand's site holds product photography it may license from a studio, editorial and guides it paid to produce, customer reviews and athlete or creator content used under limited permissions. The clause covers "any content available through" the associated pages, and nothing in the terms says how a brand grants Meta rights to material the brand doesn't own outright. Our [customer content rights playbook](/lens/ops/customer-content-rights/) logs the scope of every permission, including AI use, and that log tells you which pages carry the risk.

SEO and web teams own the practical control, robots.txt. Meta's [crawler documentation](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) lists four user agents with different jobs, and blocking the wrong one costs a brand reach it wants.

| Crawler | What Meta says it does | Respects robots.txt | Sensible default for a brand |
|---|---|---|---|
| Meta-ExternalAgent | Crawls for uses such as training foundation AI models | Meta gives Disallow examples | Block if you object to training, as a partial control |
| Meta-WebIndexer | Improves Meta AI search results, helps Meta cite and link to you | Meta gives Disallow examples | Allow |
| Meta-ExternalFetcher | Fetches individual links at a user's request | May bypass | Leave alone |
| FacebookExternalHit | Fetches content shared on Facebook, Instagram and Messenger | May bypass for security or integrity checks | Allow |

Our view at Manual Focus is that UK brands shouldn't pause Meta spend over this clause, but they should block Meta-ExternalAgent on any domain that carries licensed or customer content, keep Meta-WebIndexer allowed so Meta AI can cite them, and get Meta to confirm in writing that a robots.txt block limits the licence. Treat that block as a partial crawl control rather than a training opt-out, because the clause covers any automated software, content can still reach Meta through the crawlers you allow or through what you upload, and Meta hasn't said the block narrows what it may train on. That mirrors the trade we set out in [The citation moved off the page](/blog/the-citation-moved-off-the-page/), where being retrievable by AI answers is worth more than the training data a single brand withholds.

Paid teams feel this least in the short term. Stone tied the clause to product information for ad and content recommendations, the same area as the agent and checkout tools in our guide to [Meta and TikTok's Advertising Week AI ad tools](/blog/meta-tiktok-advertising-week-ai-ad-tools/). Meta's documentation gives shared-link fetching to FacebookExternalHit, not Meta-ExternalAgent, but Meta hasn't said which crawler feeds each ad product, so watch catalogue and ad delivery for a fortnight after any block.

## What to do before 30 October

1. **Find every associated domain.** List the sites linked from your Meta ads, catalogues, shops and Business Suite, including microsites, regional stores and help centres, because the clause covers all of them.
2. **Set robots.txt per crawler.** Add a Disallow rule for Meta-ExternalAgent where you hold licensed or customer content, knowing it limits one crawler and doesn't by itself stop training, check Meta-WebIndexer and FacebookExternalHit remain allowed, and confirm your CDN's bot rules match, a check we also recommended in our [Adobe holiday forecast post](/blog/adobe-ai-shopping-forecast-black-friday/).
3. **Send the UK edition to legal.** Ask them to read the clause against your photography, creator and review licences and to flag any agreement that forbids passing content to third parties for AI training.
4. **Put the questions to Meta in writing.** Ask your Meta representative whether robots.txt limits the licence, what test credentials can reach, and why the UK and US editions differ. Keep the reply on file.
5. **Record the decision.** Write down which crawlers you block on which domains and why, and add it to your brand rules so new microsites inherit it. Our [brand guardrails as code playbook](/lens/ops/brand-guardrails-as-code/) shows how to make a rule like that checkable.

## What we don't know yet

Meta says content owners can still manage access with robots.txt, but neither edition of the terms says whether a robots.txt block narrows the licence a business grants. "Associated with your products or services" and "test credentials" aren't defined. The terms offer no partial opt-out, and their updates section says a business that doesn't agree may stop all business use of Meta's products. We also don't know whether the UK and US wording will converge before 30 October, or whether the UK ICO will take an interest in Meta training on business websites under this licence.

## Further reading

- [The citation moved off the page](/blog/the-citation-moved-off-the-page/), on why staying visible to AI answers matters more than any one crawler
- [Meta and TikTok AI ad tools from Advertising Week, a UK guide](/blog/meta-tiktok-advertising-week-ai-ad-tools/), on the Meta products that read your site
- [Customer content rights pipeline](/lens/ops/customer-content-rights/), for logging which content you can let others use
- [What the CMA's AI choice screen plan means for UK marketers](/blog/cma-google-choice-screen-ai-assistants/), on checking which AI crawlers can read your site
- [Brand guardrails as code](/lens/ops/brand-guardrails-as-code/), for turning a crawler decision into a rule every site follows

Our [services page](/services/) explains how we help brand and web teams set AI crawler policy.
