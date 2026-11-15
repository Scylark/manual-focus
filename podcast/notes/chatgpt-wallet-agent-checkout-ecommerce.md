---
post: chatgpt-wallet-agent-checkout-ecommerce
title: "What ChatGPT Wallet means for ecommerce checkout teams"
chapters:
  - title: "Cold open"
    at: "Picture a shopper asking ChatGPT to buy a carry-on bag"
  - title: "What OpenAI launched"
    at: "OpenAI describes Wallet as a secure way"
  - title: "How a Wallet purchase works"
    at: "So how does a purchase actually happen"
  - title: "Why the work moves to security"
    at: "That's the part I'd underline for an ecommerce team"
  - title: "What the agent looks like to a firewall"
    at: "What does the agent look like to a firewall, then"
  - title: "Who owns it in the team"
    at: "So where does this sit in a marketing team"
  - title: "Get AI on this"
    at: "So, Hannah, what do we hand to AI"
  - title: "What we don't know"
    at: "What don't we know yet"
  - title: "The takeaway"
    at: "So the takeaway. Your checkout is now a front door"
---

James and Hannah talk through ChatGPT Wallet, which OpenAI launched on 13
November 2026 so that its agents in ChatGPT Work, Codex and dots can complete
purchases on a merchant's own checkout once the customer approves. There's no
Wallet-specific integration, so the work lands with whoever runs the site's bot
rules and fraud scoring. They cover how a Wallet purchase works, how ChatGPT's
cloud browser identifies itself to firewalls, why the job sits between
ecommerce, platform and payments teams, and three jobs to hand to AI before the
Christmas peak.

## Get AI on this

Paste these into whichever AI assistant you use. Swap the bracketed parts for
your own details. The first needs an assistant that can browse the web, and the
other two need file or link uploads.

### 1. Walk the checkout the way an agent would

```text
I run ecommerce marketing for [brand], which sells [one line on what you sell]
at [website], mainly in [market].

AI agents can now buy on our site through ChatGPT's cloud browser, using our
normal checkout. Any step that blocks an automated browser can lose the sale.

Using web browsing, go through our purchase journey for this product: [product
URL]. Start on the product page and go as far as the payment step without
entering any payment details or placing an order.

Give me a table with the columns: Step | URL | What you had to do | Obstacle
(CAPTCHA, forced account, pop-up, bot challenge, cookie wall, other) | Could
you get past it (yes / no / not tested).

Then list the obstacles in the order I should fix them, with one line on why.
If a page didn't load, or you were blocked before a step, say so and don't
guess what that step looks like.
```

### 2. Draft the request to the security team

```text
I need to ask our security or platform team whether our website blocks
verified visits from ChatGPT's cloud browser, which AI agents use to buy on
our site.

Attached is OpenAI's agent access guide for merchants. Our website is
[website] and our CDN or bot protection provider is [provider].

Write a short internal message (under 200 words) to [team or person] that:
1. explains in two sentences why this matters for sales,
2. asks whether verified ChatGPT cloud browser visits are currently blocked,
3. names the exact setting, category or rule to check for [provider], taken
   only from the attached guide,
4. asks them to keep page-level access controls in place.

If the guide doesn't cover [provider], say so plainly and list what the guide
says a provider without automatic verification must do instead. Don't invent
setting names.
```

### 3. Brief the fraud provider

```text
We sell through [website] and use [fraud or risk provider] for fraud
screening. Orders can now arrive from AI agents paying with ChatGPT Wallet.

Attached is OpenAI's merchant guide to accepting payments with ChatGPT Wallet.

Draft a one-page brief for [fraud or risk provider] that:
- explains what a Wallet order looks like to us, including the network token
  and the Payment Account Reference, using only what the guide says,
- lists the user signals OpenAI says it relays in the Forwarded header, and
  what the guide suggests each can be used for,
- asks them five specific questions about how they will score these orders and
  how we'll tell them apart from other card orders in reporting.

Add a short "Not covered by the guide" section listing anything we'd need to
know that the guide doesn't answer, such as refunds or chargebacks. Don't fill
those gaps with assumptions.
```
