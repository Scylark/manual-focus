# The Lens, Skills

The executable companion to [The Lens](https://manual-focus.co.uk/lens), Manual Focus's working library of AI marketing playbooks. Every skill in this directory pairs with a playbook on the Lens site. The playbook explains the workflow, the skill is the workflow you can run.

Each skill follows the Anthropic Agent Skills spec and works with Claude Code, Codex, Cursor, Windsurf, and any agent that supports skill loading.

## Just installed? Run the setup skill first

The fastest path after install is to ask Claude:

> Set up The Lens.

That triggers the `setup-the-lens` skill, which welcomes you, reads your situation, checks which tools you have connected, and recommends a starter playbook based on the work in front of you. Takes under ten minutes.

If you prefer to read first, start at https://manual-focus.co.uk/lens/start-here.

## What's in here

Twenty-five skills total. One welcome skill plus twenty-four workflow skills, mapping one-to-one with a subset of the forty-six Lens playbooks.

- **1 onboarding skill**, `setup-the-lens`, the welcome and starter-playbook recommendation.
- **24 workflow skills**, across the five stacks (brand, demand, content, ops, productivity).

The other twenty-two playbooks are systems or rituals rather than single agent tasks. They live as playbooks only and are read once, applied repeatedly.

## How they compose

Skills reference each other where one workflow naturally builds on another. `positioning-audit` produces a positioning brief that `message-house` then expands. `brand-voice-extraction` produces a voice profile that `eval-gated-drafting`, `social-content-factory` and `lifecycle-journey-builder` all read. A skill that needs prior context will look for the upstream artefact (in `.lens/` by convention, or wherever the project keeps it) and prompt the user to produce it if missing.

## Install

```text
/plugin marketplace add Scylark/manual-focus
/plugin install the-lens@manual-focus
```

One install command brings in all 25 skills at once. After install, ask Claude to "set up The Lens" and the welcome skill takes over.

To clone and reference locally instead:

```bash
git clone https://github.com/Scylark/manual-focus
# Skills live in lens-skills/
```

## Use

Each skill has a clear trigger description in its frontmatter, the kind of request that invokes it. Below the frontmatter is the body, the agent's playbook with the phases, prompts, eval gates and failure modes to watch for.

Most skills produce structured artefacts (JSON, markdown, deck-ready docs). They are designed to be composable, the output of one skill is often the input of another.

## Prior art

The structure of this skills collection is inspired by the work of [Corey Haines on marketingskills](https://github.com/coreyhaines31/marketingskills), released under MIT. The Lens skills are Manual Focus's own work, distinct methodology, distinct workflows, distinct examples, but Corey's framing of "skills as composable agent capabilities" is the convention we have adopted.

## Contributing

The Lens skills evolve as new patterns prove themselves in live work. Pull requests are welcome from the wider community. To contribute a new skill or improve an existing one, open a PR with the SKILL.md and a short note on the problem the skill solves.

## Licence

MIT. Use, modify, distribute, sell, fine. Just keep the copyright notice on the work that builds on this.
