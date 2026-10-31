---
title: "What the shared AI training opt-out means for brand websites"
date: 2026-10-31
tags: ["ai-briefing", "ai", "brand"]
description: "Google and Microsoft said on 30 October 2026 they will honour one robots.txt token for AI training. Opt out by path and keep AI grounding switched on."
faq:
  - question: "What is the __usage_ai-training token in robots.txt?"
    answer: "It is a shared policy token defined in an IETF Internet-Draft by Kevin Kelley of Anthropic, published on 30 October 2026. A site writes a robots.txt group with User-Agent set to the token and Disallow or Allow paths to say whether its content may be used to train generative AI models. It is a preference about use and does not stop crawling."
  - question: "When will Google and Microsoft honour the shared AI training opt-out?"
    answer: "Microsoft says it will honour the shared AI Training preference as it crawls from 1 February 2027. Google said on 30 October 2026 that it aims to support the control in 2027, and its crawler documentation says early 2027. Anthropic's Kevin Kelley wrote that Anthropic has already started implementing support for the draft."
  - question: "Does opting out of AI training remove my site from Google Search or Bing?"
    answer: "No. Google's crawler documentation says Google-Extended does not affect inclusion in Google Search and is not a ranking signal, and Google will read a shared-token opt-out as a Google-Extended disallow. Microsoft says its new training and grounding preferences do not change eligibility for traditional Bing search results, though restricting grounding reduces visibility in AI experiences."
  - question: "What is the difference between AI training and AI grounding?"
    answer: "Training uses content to change a model's learned parameters. Grounding uses content as input when an AI answer is written, with links and citations back to the source. Microsoft now treats them as separate preferences, so a site can disallow training and still allow grounding in Bing, Copilot and Microsoft 365. Microsoft warns that restricting grounding significantly reduces brand visibility in AI answers."
sources:
  - title: "Supporting a shared AI training control for websites"
    url: "https://developers.google.com/search/blog/2026/10/ai-training-control"
    publisher: "Google Search Central"
  - title: "Your content, your choice, clearer preferences for training and grounding"
    url: "https://blogs.bing.com/search/2026/10/your-content-your-choice-clearer-preferences-for-training-and-grounding/"
    publisher: "Microsoft Bing"
  - title: "Machine-Readable Training Preference Signal (draft-kelley-aipref-training-preference-signal-00)"
    url: "https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/"
    publisher: "IETF Datatracker"
  - title: "New draft, draft-kelley-aipref-training-preference-signal-00"
    url: "https://mailarchive.ietf.org/arch/msg/ai-control/mddjatOxSR0h6GmLRBWlc839c7w/"
    publisher: "IETF mail archive"
  - title: "Google's common crawlers, Google-Extended"
    url: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
    publisher: "Google for Developers"
  - title: "Google Also Adopts New AI Training Control"
    url: "https://www.seroundtable.com/google-ai-training-control-42430.html"
    publisher: "Search Engine Roundtable"
---

Google and Microsoft said on 30 October 2026 that they will honour one shared robots.txt token, `__usage_ai-training`, for opting content out of AI training, with Microsoft starting on 1 February 2027 and Google in early 2027. Brand sites now get one switch for training, and Microsoft has added a separate one for AI answers.

## Key takeaways

- Google's Search Central blog said on 30 October 2026 that it aims to support a shared AI training control in robots.txt in 2027, and its crawler documentation says early 2027.
- Microsoft Bing will honour the shared AI Training preference, plus a new page-level AI Grounding preference, as it crawls from 1 February 2027.
- The token comes from an individual IETF Internet-Draft by Kevin Kelley of Anthropic, dated 30 October 2026, which expires on 3 May 2027 and has no formal IETF standing.
- Rules under `User-Agent: *` do not count as a training preference, so a site with no group naming the token has expressed no preference at all.
- Sites that use Bing's NoArchive or NoCache tags must publish the new preferences before 1 March 2027 to keep their restrictions.

## The token Google and Microsoft signed up to

The mechanism is an ordinary robots.txt group. Instead of naming a crawler, the User-Agent line names a policy token, and the Disallow and Allow lines say which paths may or may not be used for training.

```
User-Agent: __usage_ai-training
Disallow: /research/
```

Kevin Kelley of Anthropic published the [Internet-Draft](https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/) on 30 October, and in his [message to the IETF list](https://mailarchive.ietf.org/arch/msg/ai-control/mddjatOxSR0h6GmLRBWlc839c7w/) he wrote that "Anthropic has already started implementing support for this draft." The draft says the token "is not a directive for crawling behavior", so a crawler still follows the rules written for its own name. Blocking a crawler and stating a training preference stay two separate jobs.

John Mueller announced Google's plan on the [Search Central blog](https://developers.google.com/search/blog/2026/10/ai-training-control). When a site uses the token to opt out and doesn't mention Google-Extended, "Google plans to interpret that as if the publisher had disallowed Google-Extended." Google's [crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended) puts support in early 2027 and repeats that Google-Extended doesn't affect inclusion or ranking in Google Search. Barry Schwartz at [Search Engine Roundtable](https://www.seroundtable.com/google-ai-training-control-42430.html) reports that OpenAI has taken a similar step.

## Why does Bing split training from grounding?

Microsoft went further than Google. Krishna Madhavan's [post on the Bing blog](https://blogs.bing.com/search/2026/10/your-content-your-choice-clearer-preferences-for-training-and-grounding/) adopts the shared AI Training preference, extends it to single pages through a meta tag or HTTP header, and adds an AI Grounding preference that governs whether a page can inform AI-generated answers in Bing, Copilot and Microsoft 365. Grounding is set page by page only, with three values. Allow is the default, Disallow keeps the page out of generated answers, and DisallowExtended keeps it in Microsoft's own products while excluding the grounding services Microsoft sells to third parties, such as Web IQ and grounding through Foundry.

Microsoft's post warns that choosing DisallowExtended or Disallow "will significantly reduce your content's visibility in AI-generated experiences", while leaving eligibility for classic Bing results untouched.

## Which control does what?

| Control | Read by | Covers | When it applies |
|---|---|---|---|
| `__usage_ai-training` in robots.txt | Google, Microsoft, Anthropic | Training generative models, site or path | Microsoft from 1 February 2027, Google early 2027 |
| Google-Extended in robots.txt | Google | Gemini training, and grounding in Gemini Apps | Now |
| Bingbot `ai-training` meta tag or header | Microsoft | Training, single page, overrides robots.txt | From 1 February 2027 |
| Bingbot `ai-grounding` meta tag or header | Microsoft | AI answers in Bing, Copilot, Microsoft 365 and third-party grounding | From 1 February 2027 |
| NoArchive and NoCache | Microsoft | Old training and grounding controls | No longer read as AI preferences after 1 March 2027 |

## Where an opt-out costs visibility

Google's post attaches a condition to the shared token, saying sites "that specifically allow Google-Extended are eligible to appear in responses and receive clicks via grounding in Gemini Apps", and a token-only opt-out counts as a Google-Extended disallow. A brand that adds one blanket training block could therefore drop out of Gemini answers without meaning to, unless it also writes an explicit Allow group for Google-Extended.

The draft also says a `User-Agent: *` group never matches the token, so the familiar catch-all rules say nothing about training. Existing crawler blocks keep working too, so a site that disallowed GPTBot or Meta-ExternalAgent after reading our piece on [Meta's crawling terms](/blog/meta-commercial-terms-crawling-uk-advertisers/) keeps those blocks whatever it writes for the new token.

## Should a brand block AI training?

For most brands, no. Product pages, pricing, comparisons and category explainers exist to be read and repeated, and a model that learned your positioning is more likely to describe you accurately when it answers without searching. The [SISTRIX citation study](/blog/sistrix-ai-citation-study-geo-tactics/) and [the citation moved off the page](/blog/the-citation-moved-off-the-page/) cover what earns those pages a citation once a model goes looking.

The exceptions are content you sell or license. Paid research, member-only guides, licensed photography and customer data deserve a path-level Disallow, and the draft's path matching lets you protect `/research/` while leaving `/products/` open.

Our view at Manual Focus is that brand and commercial sites should allow AI training by default, disallow it only on the paths that carry content they sell or license, and leave grounding allowed on every page that should appear in AI answers, because Microsoft says grounding restrictions cut visibility and Google ties Gemini grounding to Google-Extended. SEO, legal and brand teams should write that policy down together, since the person editing robots.txt rarely knows which content is licensed.

## Five settings to fix before 1 March

1. **Find your old Bing tags.** Search templates and response headers for NoArchive and NoCache. If you use them, decide your training and grounding preferences now, and if you want to keep withholding pages from grounding, record a temporary preference in Bing Webmaster Tools once it opens on 15 December 2026.
2. **Map which paths carry licensed content.** List the directories with paid, gated or third-party content and draft path-level `__usage_ai-training` Disallow rules for those alone. The [site audit and refresh playbook](/lens/ops/site-audit-and-refresh/) gives a structure for that inventory.
3. **Add an explicit Google-Extended Allow group** if you opt out of training through the shared token but still want to be eligible for grounding in Gemini Apps.
4. **Leave grounding on commercial pages at Allow.** Reserve the Bingbot `ai-grounding` Disallow for pages that should never appear in an AI answer, such as account or legal pages.
5. **Test the file after each change.** A malformed group can block Googlebot or Bingbot from crawling. Treat robots.txt as brand infrastructure with an owner and a change log, as the [brand guardrails as code playbook](/lens/ops/brand-guardrails-as-code/) suggests for other brand rules.

## Still unsettled

The draft is an individual submission, and Nate Hake told Search Engine Roundtable that "some significant areas of dispute remain" at the IETF, including an exemption for user-initiated actions. OpenAI's timing isn't in either the Google or the Microsoft announcement. Neither company says a new opt-out removes content already gathered into existing datasets or models, and Microsoft's own post says the preferences cover "future AI generative model training". Google's post also doesn't say how AI Overviews and AI Mode, which run inside Google Search, relate to the token. Microsoft says no setting guarantees inclusion, traffic or payment.

## Further reading

- [What Meta's new crawling terms mean for UK advertisers](/blog/meta-commercial-terms-crawling-uk-advertisers/), on which Meta crawlers to block and which to keep
- [What Google's new AI Mode links mean for brand websites](/blog/google-ai-mode-official-websites-links/), on how Google now sends AI Mode users to official sites
- [The citation moved off the page](/blog/the-citation-moved-off-the-page/), on why retrievability now matters more than rank
- [Reddit plans a logged-in-only site](/blog/reddit-logged-in-only-search-referrals-marketers/), on another owner tightening who can read its content

If you want help setting a training and grounding policy for your site, our [services page](/services/) explains how we work.
