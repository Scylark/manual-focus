---
title: "What ChatGPT Wallet means for ecommerce checkout teams"
date: 2026-11-15
tags: ["ai-briefing", "ai"]
description: "OpenAI launched ChatGPT Wallet on 13 November 2026, so its agents can pay on a merchant's own checkout. Merchants must let the agent past their firewalls."
podcast:
  audio: "https://manual-focus-podcast.manual-focus.workers.dev/episodes/chatgpt-wallet-agent-checkout-ecommerce.mp3"
  duration: 426
  bytes: 5108969
  published: 2026-11-15
faq:
  - question: "What is ChatGPT Wallet?"
    answer: "ChatGPT Wallet is a payment option OpenAI announced on 13 November 2026 for agents in ChatGPT Work, Codex and dots. The agent completes a purchase on the merchant's own website after the customer approves it in ChatGPT. The merchant's checkout processes the payment and receives a network token instead of the full card number."
  - question: "Do merchants need to integrate ChatGPT Wallet?"
    answer: "No. OpenAI's Accept payments guide says no Wallet-specific integration is required, because ChatGPT's cloud browser uses a merchant's existing checkout pages and payment forms. OpenAI calls checking cloud browser access optional but says it helps Wallet purchases go through, since bot detection can block the browser and cause purchases to fail."
  - question: "How do I stop my firewall blocking ChatGPT agents?"
    answer: "OpenAI says ChatGPT's cloud browser signs its requests with Web Bot Auth, and that Akamai, Cloudflare, HUMAN and Vercel verify those signatures automatically. If your security settings block it, allow verified cloud browser visits and keep your other controls. On Cloudflare the traffic appears as dots, OpenAI under Personal Agents. Other providers need manual signature checks."
  - question: "Can a merchant save the ChatGPT Wallet card for later?"
    answer: "No. OpenAI's guide says the customer consents to one transaction, so a merchant must not reuse or save the credential for a separate purchase. Subscriptions are allowed if the checkout supports recurring billing, with the customer's consent and the processor's practices for merchant-initiated transactions. A merchant's existing card-on-file flow can carry on alongside Wallet."
sources:
  - title: "Accepting payments with ChatGPT Wallet"
    url: "https://developers.openai.com/commerce/guides/accept-payments"
    publisher: "OpenAI"
  - title: "Introducing ChatGPT Wallet"
    url: "https://openai.com/index/introducing-chatgpt-wallet/"
    publisher: "OpenAI"
  - title: "Agent access for ChatGPT's cloud browser"
    url: "https://developers.openai.com/commerce/agent-access"
    publisher: "OpenAI"
  - title: "Commerce in ChatGPT overview"
    url: "https://developers.openai.com/commerce/guides/overview"
    publisher: "OpenAI"
  - title: "ChatGPT's new Wallet lets AI agents shop and check out for you"
    url: "https://techcrunch.com/2026/11/13/chatgpts-new-wallet-lets-ai-agents-shop-and-check-out-for-you/"
    publisher: "TechCrunch"
---

OpenAI launched ChatGPT Wallet on 13 November 2026, giving its agents in ChatGPT Work, Codex and dots a way to pay for things with the user's approval. The agent buys through the merchant's existing checkout, with no integration needed, so an ecommerce brand only gets the sale if its firewall and fraud settings let the agent through.

## Key takeaways

- OpenAI announced ChatGPT Wallet on 13 November 2026 as a way for agents in ChatGPT Work, Codex and dots to complete purchases with user approval.
- The customer approves each purchase in ChatGPT, and the merchant's own checkout processes the payment, so no Wallet-specific integration is required.
- Merchants receive a network token instead of the full card number, with a Payment Account Reference (PAR) linking it to the customer's account.
- OpenAI says bot detection can block ChatGPT's cloud browser and cause purchases to fail, and Akamai, Cloudflare, HUMAN and Vercel verify its signed requests automatically.
- OpenAI's merchant guides don't say which countries or ChatGPT plans have Wallet, only that it supports payment steps "where available".

## How a Wallet purchase works

OpenAI's [Commerce overview](https://developers.openai.com/commerce/guides/overview) describes the journey in four steps. A customer describes a need, ChatGPT finds options from the public web, private integrations and merchant product feeds, the customer picks one, and the journey moves to browser use or a plugin to finish the transaction. Wallet sits in that last step.

The [Accept payments guide](https://developers.openai.com/commerce/guides/accept-payments) is plain about the split of work. The customer reviews and approves the purchase in ChatGPT, and your checkout processes it. Your business still handles orders, fulfilment, customer support and fraud decisions.

| Step | ChatGPT does | Your business does |
|---|---|---|
| Choosing | Finds options from the web, integrations and product feeds | Keeps the product feed and site accurate |
| Checkout | Its cloud browser uses your existing checkout pages | Lets verified agent visits through security tools |
| Approval | The customer approves the purchase in ChatGPT | Nothing extra |
| Payment | Wallet passes a network token, not the card number | Processes it and links the token to the account with the PAR |
| After the sale | Nothing in the guides | Orders, fulfilment, customer support and fraud decisions |
| Repeat billing | Customer consents to one transaction | Never reuses the credential, and gets consent for subscriptions |

## Does my checkout need to change?

Your pages don't, and that is the part a marketing team can miss. Because the agent uses the same forms a person does, every point of friction a human shopper tolerates (a forced account, a CAPTCHA, a bot challenge from your CDN) now sits between ChatGPT and a completed order. OpenAI's guide says the cloud browser "can trigger bot-detection systems" and cause purchases to fail. A failed agent purchase may not look like a normal abandoned basket in your analytics, so it is easy to miss.

OpenAI is also rolling out a `Forwarded` header that relays user signals to the merchant. The parameters it lists include the user's ASN, IP country and prefix, locale, time zone and user agent, which a merchant can use for geographic eligibility, local formatting and fraud scoring. OpenAI says the signals may vary during the rollout and asks merchants to have third-party risk providers ingest them.

## What does the agent look like to a firewall?

The [Agent access guide](https://developers.openai.com/commerce/agent-access) says ChatGPT's cloud browser signs its requests with Web Bot Auth, built on HTTP Message Signatures (RFC 9421), and publishes its public keys at chatgpt.com. Four security vendors verify the signatures automatically.

| Provider | How ChatGPT's cloud browser appears |
|---|---|
| Cloudflare | "dots, OpenAI" under Personal Agents, bot tag `chatgpt-agent`, detection ID 129220581 |
| Akamai | "ChatGPT Agent" in the AI Fetchers and Agents category |
| HUMAN | "ChatGPT Agent" in Known Bots & Crawlers and AgenticTrust permissions |
| Vercel | "ChatGPT Agent", identified as `chatgpt-operator` |

OpenAI says an allowlist isn't required because the cloud browser can already use sites without one. The exception applies site-wide when you add one, so keep page-level access controls, and it doesn't change how other bots, including OAI-SearchBot, are treated. Your crawler decisions from the [shared AI training opt-out](/blog/shared-ai-training-opt-out-robots-txt/) stay separate from this one. OpenAI also says it requires human review before any consequential action, such as checkout.

## What it means for marketing teams

OpenAI's other brand launches this autumn were about being found. [Businesses in ChatGPT](/blog/businesses-in-chatgpt-business-hub-brands/) gave brands a profile and a mention count, and [dots](/blog/openai-dots-chatgpt-plugins-marketing-teams/) gave users agents that work in the background. Wallet adds the payment, so the same agent that recommends a product can buy it on your site.

The work this creates sits between teams. The ecommerce manager owns conversion, the security or platform team owns the CDN rules, and the payments or fraud team owns risk scoring, yet none of them has a reason to look at agent traffic unless someone asks. A brand that blocks the agent can lose the order without anyone in marketing noticing. Our coverage of [Lightspeed's study](/blog/ai-shopping-assistants-favour-big-retailers/) showed smaller retailers already losing out in AI recommendations, so a challenger brand can't afford to lose the few agent orders it wins.

Our view at Manual Focus is that every ecommerce brand selling into markets where Wallet is live should let verified ChatGPT agent visits through checkout before the Christmas peak, because the agent then shops the site like any customer while page-level controls and fraud checks stay in place. Then agree with finance how a Wallet order will be identified, using the network token and the `Forwarded` header, before the volume arrives.

## Five checks before the Christmas peak

1. **Ask your security team one question.** Do our CDN or bot rules block verified ChatGPT cloud browser visits? On Cloudflare, Akamai, HUMAN or Vercel the answer is a rule to check. Anywhere else it means manual signature verification.
2. **Walk the checkout as an agent would.** List every CAPTCHA, forced sign-up and pop-up between product page and payment. The [site audit and refresh playbook](/lens/ops/site-audit-and-refresh/) gives a structure for logging them.
3. **Brief your fraud provider.** Send them OpenAI's Accept payments guide and ask them to ingest the `Forwarded` header signals and score network-token orders fairly.
4. **Check the feed and the profile.** Wallet only pays for what ChatGPT chose, so claim your Business Hub profile and fix prices and availability in your product feed. Our [ChatGPT Ads on Shopify](/blog/chatgpt-ads-shopify-uk-ecommerce/) post covers the catalogue route for Shopify merchants.
5. **Tag the orders.** Decide how agent purchases appear in your order system and attribution reports, then add them to your model with the [attribution teardown](/lens/demand/attribution-teardown/).

## What OpenAI hasn't said

The developer guides don't give the countries, plans or age limits for Wallet, and they don't say whether OpenAI takes a fee from merchants. Nothing in them explains how a merchant can tell a Wallet order from a normal card order beyond the token and the header, or how refunds and chargebacks flow back to ChatGPT. OpenAI also says the `Forwarded` signals may vary during the rollout, so fraud rules built on them now may need revisiting. We don't yet know how many shoppers will let an agent pay, or whether checkout friction will count against a merchant when ChatGPT picks where to buy.

## Further reading

- [What OpenAI's Businesses in ChatGPT means for brand teams](/blog/businesses-in-chatgpt-business-hub-brands/), for the profile and product feed ChatGPT draws on before anyone buys
- [What OpenAI's dots and ChatGPT plugins mean for marketing teams](/blog/openai-dots-chatgpt-plugins-marketing-teams/), on the agents that now carry a wallet
- [What Adobe's AI shopping forecast means for Black Friday](/blog/adobe-ai-shopping-forecast-black-friday/), for the traffic forecast behind the peak
- [What the shared AI training opt-out means for brand websites](/blog/shared-ai-training-opt-out-robots-txt/), on the crawler rules that stay separate from agent access

If you want help getting your site and checkout ready for AI shopping agents, our [services page](/services/) explains how we work.
