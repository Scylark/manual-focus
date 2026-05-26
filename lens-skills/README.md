# The Lens — Skills

The executable companion to [The Lens](https://manual-focus.co.uk/lens), Manual Focus's working library of AI marketing playbooks. Every skill in this directory pairs with a playbook on the Lens site. The playbook explains the workflow; the skill is the workflow you can run.

Each skill follows the Anthropic Agent Skills spec and works with Claude Code, Codex, Cursor, Windsurf, and any agent that supports skill loading.

## What's in here

Ten skills at launch, mapping to ten of the twenty Lens playbooks. The skills represent the playbooks whose workflow is most directly executable as an agent task — positioning, brand voice, naming, message house, category entry points, lifecycle journeys, SEO clusters, eval-gated drafting, earned-media pitches, and social-content production.

The other ten playbooks (paid-search bidding agent, attribution tear-down, brief-to-ship operating system, brand guardrails as code, evaluation frameworks, hiring shape, quarterly planning, etc.) are systems or rituals rather than single agent tasks — they live as playbooks only.

## How they work together

Skills reference each other where one workflow naturally builds on another. **positioning-audit** produces a positioning brief that **message-house** then expands. **brand-voice-extraction** produces a voice profile that **eval-gated-drafting**, **social-content-factory** and **lifecycle-journey-builder** all read. A skill that needs prior context will look for the upstream artefact (in `.lens/` by convention, or wherever the project keeps it) and prompt the user to produce it if missing.

## Install

```bash
# As a Claude Code plugin (recommended)
/plugin install https://github.com/Scylark/manual-focus

# Or clone and reference locally
git clone https://github.com/Scylark/manual-focus
# Skills live in lens-skills/
```

Once installed, the agent will recognise relevant tasks and offer to invoke the right skill. For example, asking "audit our positioning against the competitive set" will offer the **positioning-audit** skill.

## Use

Each skill has a clear trigger description in its frontmatter — what kind of request invokes it. Below the frontmatter is the body, which is the agent's playbook: the phases, the prompts, the eval gates, the failure modes to watch for.

Most skills produce structured artefacts (JSON, markdown, deck-ready docs). They're designed to be composable — the output of one skill is often the input of another.

## Prior art

The structure of this skills collection is inspired by the work of [Corey Haines on marketingskills](https://github.com/coreyhaines31/marketingskills), released under MIT. The Lens skills are Manual Focus's own work — distinct methodology, distinct workflows, distinct examples — but Corey's framing of "skills as composable agent capabilities" is the convention we've adopted.

## Contributing

The Lens skills evolve from live Manual Focus client work. Pull requests are welcome from subscribers and the wider community. To contribute a new skill or improve an existing one, open a PR with the SKILL.md and a short note on what client problem the skill came from.

## Licence

MIT. Use, modify, distribute, sell — fine. Just keep the copyright notice on the work that builds on this.
