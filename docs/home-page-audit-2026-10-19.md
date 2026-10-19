# Home page audit, 19 October 2026

Audit of manual-focus.co.uk against agency homepage practice, measured on the
live site. The restructured preview on branch `claude/home-page-agency-audit-8ba206`
acts on it. Nothing here has shipped.

## Verdict

The page looks distinctive, but it makes a buyer work too hard. They wait 4.5
screens for the first words, then have to learn seven brand names before the
offer comes clear. The proof is thin and arrives at screen 9. Almost half the
scroll goes to two animations: the hero (6 screens) and the manifesto (10
screens for four lines).

## The numbers

| | Desktop 1440×900 | Phone 375×812 |
|---|---|---|
| Total length | 36.4 screens | 38.8 screens |
| First words visible | after ~4.5 screens | after ~2.75 screens |
| Hero | 6.0 screens | 4.0 screens |
| Manifesto (4 lines) | 10.2 screens | 6.7 screens |
| First proof (logos) | starts at screen 9.2 | starts at screen 8.0 |
| Offer cards | start at screen 10.7 | start at screen 9.8 |
| Words on the page | 1,253 | |
| Enquiry links | 6, all "Book a free working session" | |

## What good looks like

- **State the value proposition in about 10 seconds.** NN/g found visitors
  leave fast unless the page says what you offer within 10 seconds. It treats
  the homepage as an elevator pitch: who you are, what you do, why you over
  others, in the buyer's own words.
- **Keep the important content on the first screen.** In NN/g's 2018
  eyetracking study, 57% of viewing time went above the fold and 74% to the
  first two screens.
- **Keep text out of scroll-jacked sections.** NN/g's 2023 scrolljacking study
  found long sequences disorient people and make some think the site is
  broken. That hit hardest for people weighing up a service. Its advice is to
  keep the effect below the fold, keep important text out of it, and go easy
  on mobile.
- **Show proof that matches the buyer's world.** Buyers rate peer case studies
  as the most valuable content when making a decision (Forrester). Hinge found
  relevance of services rose 33% as a selection factor, so specialists win.
- **Give one positioning sentence, one hero offer and a clear next step.**
  Explain what happens after the click.

## Findings, most important first

1. **No words on the first screen.** Desktop visitors scroll ~4.5 screens past
   rings and a wordmark before the headline appears. The nav is hidden too.
   *Fix:* put the headline, subline and CTA on screen one with the rings
   beside them. Then run the ring and wordmark sequence as the hand-off to the
   next section, on a shorter runway.
2. **The headline could belong to any agency.** "Your marketing deserves more
   than the same playbook everyone else is running" doesn't say what Manual
   Focus does or who it's for. The subline does that job, but "ambitious
   brands" is the most generic phrase in the category.
   *Fix:* lead with who it's for and what you get (options below).
3. **Too many names to learn.** A first visit meets the Foundry, the Forge, The
   Lens, Manual Focus AI, Strategic Advisor, Fractional CMO and Build & Hand
   Over. The page calls Manual Focus an "agency" while the FAQ explains how
   it's different from an agency.
   *Fix:* use one positioning sentence everywhere (title, h1, meta,
   llms.txt). Move the Forge and the Foundry into one line in "who you'll work
   with".
4. **Proof is thin and late.** There are no case studies or testimonials
   anywhere on the site. The logos are typed names in mixed fonts, which read
   as placeholders. The only hard outcome is RGT going from 19k to 350k users.
   Two of the four stats are inputs (47 playbooks, 50+ years), and the other
   two carry an "at best" disclaimer that undercuts them.
   *Fix:* two or three short case studies with numbers, one named quote, real
   logo files. Drop the stats unless a case study backs them.
5. **The strongest specialist proof isn't on the page.** The AI Shortlist
   indoor cycling study is live and shows exactly the endurance-category
   expertise buyers look for.
   *Fix:* feature it beside The Lens as "our thinking, in the open".
6. **Internal plumbing takes 3+ screens.** The Forge 3D type and the Forge
   section explain supplier tooling the client never buys.
   *Fix:* cut both from the home page and keep one sentence.
7. **The offer section contradicts itself.** "Engage by the problem, not the
   job title" sits above cards labelled by job title. Four cards (three
   services and a product) and no price signal, although "How much does it
   cost?" is an FAQ.
   *Fix:* use a headline that matches the problem-led cards and keep three
   cards. Fold Manual Focus AI into one line and show "from" prices if you're
   happy to.
8. **The manifesto takes 28% of the desktop scroll.** That's 10.2 screens for
   four lines that repeat the subline.
   *Fix:* shorten it to about 3 screens.
9. **No "what happens next".** A buyer can't see what the free session leads
   to.
   *Fix:* add three steps by the closing CTA: session, written scope and
   price, start.
10. **RGT wording.** The site says James "co-founded" RGT on the home, About
    and Services pages and in llms.txt. James's own wording is "on the
    founding team at RGT". *Fixed in the preview on all four pages.*
11. **Pinned copy stays faded (live bug).** The scroll reveal keys off each
    element's own position, and that freezes once a section pins. On the
    live site at 1440×900, the problem copy holds at 33% opacity for the
    whole pin and the closing CTA button at 32%.
    *Fixed in the preview (`Base.astro`):* items inside a pinned section
    finish revealing by the moment the pin starts. This also applies to The
    Lens page, which uses the same pins.

### What already works

- One consistent, low-friction CTA ("Book a free working session").
- The rings, the pinned sections and the overall look are distinctive. Keep
  them and retune them.
- Fractional CMO is flagged as the recommended offer, which is a good anchor.
- "No account managers, no junior staff" is a strong differentiator. It's
  buried in the FAQ, so the preview brings it into the hero.

## Proposed order (as built in the preview)

| # | Section | Pinned | Notes |
|---|---|---|---|
| 0 | Hero: headline, subline, CTA on screen one, rings beside, then the wordmark sequence | yes, shorter | runway 600vh → 300vh desktop, 400vh → 250vh phone |
| 1 | Brands we've shipped with + RGT result | no | replaces the marquee |
| 2 | The problem | yes | Forge reference removed |
| 3 | Three ways to work | yes | Manual Focus AI folded into one line; no prices yet |
| 4 | Results: RGT growth, NPS turnaround, 160+ launch placements, plus a line of further figures | yes | uses the figures already published on About; no client names beyond RGT |
| 5 | Who you'll work with | yes | Foundry and Forge in one sentence |
| 6 | Our thinking, in the open: AI Shortlist + The Lens | yes | install steps move to /lens |
| 7 | Notes from the work (blog) | yes | unchanged |
| 8 | Manifesto | scroll-scrubbed | 920vh of spacers → 240vh desktop, 680vh → 215vh phone |
| 9 | Closing CTA + three steps | yes | |

Cut from the home page: the marquee, the Forge 3D type, the Forge section,
the stats and The Lens install block.

## Preview results (measured on the local build)

| | Live | Preview |
|---|---|---|
| Desktop length (1440×900) | 36.4 screens | 20.7 screens |
| Phone length (375×812) | 38.8 screens | 26.9 screens |
| First words visible | after ~4.5 screens (desktop) | first screen, at every size tested |
| Brands start at (desktop) | screen 9.2 | screen 3.0 |
| Offer starts at (desktop) | screen 10.7 | screen 5.2 |
| Words on the page | 1,253 | 1,080 |

The hero fits the first screen at 1440×900, 1280×800, 1280×720 and
375×812, with no sideways scroll on the phone. The rings sit right of the
copy on desktop and faded behind it on a phone. The wordmark sequence plays
over the next two screens. Content in every pinned section reads at full
opacity while it's pinned.

## Headline options

1. **Senior marketing for endurance and sports brands, *with AI doing the
   heavy lifting.*** (in the preview)
2. The marketing team endurance brands can't hire full-time, *ready on
   Monday.*
3. A fractional CMO for endurance and sports brands, *and the AI to ship the
   plan.*

## What's left for James

No placeholders are left on the page. It uses only claims the site already
publishes, so it can go live as it stands once you've signed it off. These would
make it stronger, in order of impact:

1. **Sign-off on the design change.** The hero order, the cuts and the
   shorter manifesto all change how the page looks and scrolls.
2. **Named case studies.** Swap the unnamed NPS and launch cards for named
   clients (Ribble is current; Wahoo, Wattbike and Planet X are past
   clients), with permission to name the results.
3. **A client quote,** under the results cards (there's a comment in the
   source where it goes).
4. **"From" prices** on the three offers, if you're happy to publish them.
5. **Real SVG logos** for the brand strip, in place of the typed names.
6. **The headline.** Two alternatives are above.
7. **"Agency" in the page title.** It's kept for search, though the FAQ
   argues against the word.
8. **About and Lens body copy** still says "ambitious brands". The page
   metadata, schema and llms.txt now match the new positioning.

## Sources

- NN/g, [How long do users stay on web pages?](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/)
- NN/g, [Scrolling and attention](https://www.nngroup.com/articles/scrolling-and-attention/) (2018)
- NN/g, [Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/) (2023)
- NN/g, [Homepage design principles](https://www.nngroup.com/articles/homepage-design-principles/)
- Forrester, [Crap content continues to describe B2B marketing](https://www.forrester.com/blogs/crap-content-continues-to-describe-b2b-marketing-dont-let-it-describe-yours) (peer case studies rated most valuable)
- Hinge Research Institute, [Inside the Buyer's Brain](https://salestechstar.com/b2b-technology/as-client-loyalty-and-referrals-hit-historic-lows-relevant-expertise-soars-33-in-importance/) (2020 press summary)
