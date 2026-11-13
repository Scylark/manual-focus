---
title: "How to evaluate AI tools without falling for the demo"
date: 2026-05-14
updated: 2026-11-11
tags: ["ai", "productivity", "marketing-strategy"]
description: "Judge an AI tool on how it fits your workflow and what happens when its model changes, then run a four-week solo pilot before you roll it out."
howToName: "Evaluate an AI tool before you roll it out"
howToSteps:
  - name: "Check the integration"
    text: "Ask where the tool gets its inputs and where its outputs land. Rule out any tool that needs copy-pasting in and out of a separate dashboard."
  - name: "Check the model dependence"
    text: "Ask which underlying model the tool runs on and how fast the vendor moved after the last major release. Vendors with a real engineering team give a clear timeline."
  - name: "Check the documentation"
    text: "Ask who owns the workflow documentation and when it was last updated. A tool that only one person understands won't survive that person leaving."
  - name: "Talk to a power user"
    text: "Ask the vendor to introduce a customer who uses the tool daily. Find out what broke at first and what they use it for three months in."
  - name: "Run a four-week solo pilot"
    text: "Give the tool to the most sceptical person on the team for four weeks of real work. They finish with a one-page memo on whether the tool stays and how widely it should go."
faq:
  - question: "How do you evaluate an AI tool before buying it?"
    answer: "Judge an AI tool on what happens after the demo. Start with the integration, because a tool that needs copy-pasting in and out rarely survives real use. Ask the vendor how it handles new model releases and who keeps the documentation current. Then talk to a daily user and run a four-week pilot with one sceptical person before any wider rollout."
  - question: "What is an AI wrapper tool?"
    answer: "A wrapper is an AI product built on another company's model, such as one from OpenAI or Anthropic, with the vendor supplying the interface and the workflow on top. Wrappers can be good value, but they depend on the vendor keeping up when the underlying model changes or is retired. Ask which model the tool runs on and how fast the vendor moved after the last major release."
  - question: "How much notice do AI model providers give before retiring a model?"
    answer: "Anthropic says it gives at least 60 days' notice before retiring a publicly released Claude model. It told developers using Claude Sonnet 4 and Claude Opus 4 on 14 April 2026 that both would retire on 15 June 2026. OpenAI publishes a deprecations page with shutdown dates for its own models. A tool built on a retiring model has to migrate inside that window."
  - question: "Why run a four-week pilot for a new AI tool?"
    answer: "A four-week pilot with one sceptical user shows whether a tool survives real daily work after the novelty fades. Week three is where many tools stall, once the integration friction adds up and the output stops feeling new. A pilot run by the most sceptical operator, ending in a one-page memo, costs less than paying for overlapping subscriptions nobody uses."
sources:
  - title: "Model deprecations"
    url: "https://platform.claude.com/docs/en/about-claude/model-deprecations"
    publisher: "Anthropic"
  - title: "Deprecations"
    url: "https://developers.openai.com/api/docs/deprecations"
    publisher: "OpenAI"
---

An AI tool is worth buying if your team is still using it six weeks after onboarding, which most tools don't manage. Before you commit, test how it fits the workflow and whether it survives a model change or a staff departure. Then talk to a daily user and give it a four-week pilot with your most sceptical operator.

## Key takeaways

- A tool that needs copy-pasting in and out of a separate dashboard rarely survives real use, however good its output looks in a demo.
- If a tool wraps another company's model, ask the vendor how fast it moved after the last major model release.
- Anthropic gives at least 60 days' notice before retiring a publicly released Claude model, so a wrapper's vendor needs a migration plan inside that window.
- Ask the vendor to introduce a customer who uses the tool daily, because a vendor who can only offer a case study has a tool that isn't sticky yet.
- Give a new tool to your most sceptical operator for four weeks of real work before any team rollout, because week three is where many tools stall.

The product is whatever your team is still using six weeks after onboarding, which is rarely what the demo showed, so filter hard before you commit. The five tests below fit on one scorecard.

| Test | The question | Red flag |
|---|---|---|
| Integration | Where do inputs and outputs live? | Copy-paste in and out |
| Model dependence | How fast did you adopt the last model? | The vendor dodges |
| Documentation | Who owns the workflow docs? | Only one person understands it |
| Power user | Can I talk to a daily user? | Only a case study on offer |
| Four-week pilot | Does the sceptic keep using it? | Use drops off in week three |

## Does it fit how your team works?

The output is always impressive, because the model is smart. What decides whether the tool lasts is how it gets its inputs and where its outputs go.

Does it pull from where our content lives, or do we have to copy-paste it in? Does its output land somewhere our team already operates, or in a separate dashboard? Does it remember context across sessions, or do we start from scratch each time?

Tools that produce great output in a vacuum but require five steps of context-shuffling in real use are dead on arrival. Your team will use them for a week and stop.

## What happens when the model changes?

Some tools are wrappers. The underlying model comes from a lab such as OpenAI or Anthropic, while the vendor provides the interface and the workflow on top. When the next model ships those tools either keep up (good wrapper) or fall behind (bad wrapper).

The old model doesn't wait for them either. Anthropic's [model deprecations page](https://platform.claude.com/docs/en/about-claude/model-deprecations) promises at least 60 days' notice before it retires a publicly released Claude model. It retired Claude Sonnet 4 and Claude Opus 4 on 15 June 2026, two months after telling developers. [OpenAI's deprecations page](https://developers.openai.com/api/docs/deprecations) lists shutdown dates for its own models in the same way.

Ask the vendor, "When [next major model] ships in six months, what's your timeline to incorporate it?" Vendors with a real engineering team have a clear answer, while the rest dodge. Ask too which model the tool runs on today and when that model is due to retire.

Wrappers can be perfectly fine. The right wrapper is sometimes better than using the model directly, but you need to know what you're buying.

## Does it survive a key person leaving?

A lot of AI workflows get set up by one early adopter on the team who has the patience to wire it together. When that person leaves six months in, the test is what's left behind.

If the answer is "a documented workflow that the next person can pick up", the tool has survived its first real test. If the answer is "a tangle of prompts and undocumented integrations only Sarah understood", you'll be replacing the whole stack.

Before you adopt, ask who owns the documentation and when it was last updated.

## Talk to the vendor's power user

Vendors should be able to introduce you to their best customer, meaning an operator who uses the tool daily rather than a generic case study. If they can't, the tool isn't sticky enough yet.

When you talk to that customer, ask four questions.

- What was your workflow before this tool?
- What broke when you first deployed it?
- Three months in, what do you use it for, compared with what you expected?
- What would you go back to if it disappeared tomorrow?

If they could go back to the old workflow without much pain, the tool isn't embedded in their work.

## Run a four-week solo pilot

Don't roll a tool out across the team on day one. Pick one person, ideally the most sceptical operator on the team rather than the most enthusiastic. Have them run it solo on real daily work for four weeks, then write a one-page memo on whether the tool stays and how widely it should go. The [evaluation frameworks](/lens/ops/evaluation-frameworks/) playbook in The Lens has rubrics for scoring the output during the pilot.

Week three is where many tools stall, because the shine wears off as the integration friction adds up. The tools that survive a sceptical four-week pilot are the ones worth deploying.

This is slower than the standard "let's all sign up and try it" rollout. Skipping it is how teams end up paying for overlapping subscriptions nobody uses. The four-week pilot saves the budget and the attention.

## Why a tight stack beats a big one

The AI tooling market is in a fast-cycling, frothy state. A little of it changes how teams work, while most of it is incremental at best and noise at worst. Our view at Manual Focus is that the default position on any new tool should be scepticism, with a small test and a high bar for keeping it in the stack. For the bigger pattern this falls inside, see [the hidden cost of AI adoption nobody talks about](/blog/the-hidden-cost-of-ai-adoption/), where adoption usually fails at the layer above the tool.

For a worked example, our guide to [Grok Bot vs Hermes Agent](/blog/grok-bot-vs-hermes-agent-for-marketing-teams/) weighs a managed agent service against a self-hosted one on control over data and speed of setup.

The teams that win this run the tightest stack rather than the biggest. Three tools used deeply, with the workflows wired in and the documentation maintained, beat fifteen tools used shallowly every time. When you're ready to roll a stack across the team, [the 90-day AI integration plan](/blog/the-90-day-ai-integration-plan/) is a practical sequence to follow.

## Further reading

- [The hidden cost of AI adoption nobody talks about](/blog/the-hidden-cost-of-ai-adoption/), on why adoption stalls on people and process
- [The 90-day AI integration plan for marketing leaders](/blog/the-90-day-ai-integration-plan/), for rolling a chosen stack across the team
- [Evaluation frameworks for marketing AI outputs](/lens/ops/evaluation-frameworks/), a playbook with rubrics for scoring a pilot's output
- [Grok Bot vs Hermes Agent, a guide for UK marketing teams](/blog/grok-bot-vs-hermes-agent-for-marketing-teams/), a worked comparison of two agent products

If you're choosing AI tools for a marketing team and want a second opinion, [get in touch](/contact/).
