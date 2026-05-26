---
title: "Brand guardrails as code"
stack: ops
description: "Turn the brand guidelines from a PDF nobody reads into a programmatic check that runs on every piece of content before it ships. Catches drift before, not after."
outputs: "Guardrails ruleset, linting script, Slack and CI integration, calibration corpus"
readMin: 21
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content"]
models: ["claude-4.5-sonnet", "gpt-5"]
publishedAt: 2026-04-20
status: live
preview: false
---

## What you'll have when you're done

By the end of this playbook you will have shipped five artefacts.

1. A **versioned ruleset** (one YAML file in your content repo) covering every objectively checkable rule from your brand guidelines, classified by check type and severity.
2. A **linting script** that runs the ruleset against any piece of content (markdown, copy doc, ad text) in under two seconds, returning structured pass, warn and block results.
3. A **Slack workflow** for ad-hoc copy checks where a team member pastes text and gets the linter output back inline.
4. A **CI integration** that blocks pull requests in your content repo when block-severity rules fire.
5. A **calibration corpus** of 50 known-good and 30 known-bad pieces, used to tune the ruleset and re-tune it quarterly.

## Who this is for

A brand at growth, scale or enterprise stage with at least three people producing outbound content. The brand has guidelines somewhere (a deck, a Notion page, a PDF) and at least one person who notices when those guidelines get broken. If your brand is pre-launch with no documented voice, run the brand-voice-extraction playbook first. If your team is two people, the overhead exceeds the benefit.

## Before you start

- [ ] Current brand guidelines in a readable format (PDF, Notion page, deck or Google Doc)
- [ ] A content repo where pull requests are the unit of work, or a CMS with a webhook
- [ ] Slack admin access for the team Slack (workflows live there)
- [ ] Node or Python locally, so the linting script can run
- [ ] A brand lead with thirty minutes a week for the first month, to validate ruleset changes
- [ ] 50 pieces of content the brand lead would call exemplary (blog posts, ads, emails, social posts)
- [ ] 30 pieces of content that broke guidelines in the past, with a one-line note on what broke
- [ ] The brand-voice profile if you have one (output of brand-voice-extraction)

If you cannot find 30 historic violations, ask the brand lead to walk back through Slack and pull screenshots of pieces they revised. Memory is unreliable, screenshots are not.

## The pipeline

Five phases. One working week if the inputs are ready.

### Phase 1, rule extraction

Read the existing guidelines. Pull every rule that is objectively checkable into a single list.

**Step 1.1, open the guidelines and copy the rule-bearing sentences.**

Skip the manifesto pages. Look for sentences that contain "never", "always", "must", "no more than", "use", "do not use", "capitalise", "the brand voice is". Each of those is a candidate rule.

Common rule categories in endurance brands:

- Brand name capitalisation ("Cascadia Endurance, not Cascadia endurance, not cascadia")
- Banned phrases ("never use 'solutions', 'unlock', 'seamless'")
- Tone tells (no exclamation marks, no rhetorical questions in body copy)
- Claim limits ("never claim performance benefit without a cited study")
- Formatting (Oxford comma, British spelling, sentence-case headlines)
- Athlete naming (always full name on first mention, surname only thereafter)

**Step 1.2, draft the rule list with Claude.**

Paste the guidelines into the prompt below to surface candidate rules.

```text
SYSTEM: You extract objectively checkable rules from a brand
guidelines document. You ignore subjective guidance (e.g. "be
warm but professional"). You return only rules that can be
checked by a regex, a count, or a deterministic structural
check, plus a small number that require an LLM judgement.

USER:
Brand guidelines:
{PASTE_GUIDELINES_HERE}

Return a JSON array of candidate rules. Each rule:

{
  "id": "<snake_case_id>",
  "description": "<one sentence describing the rule>",
  "rule_text_from_guidelines": "<verbatim quote>",
  "proposed_check_type": "<regex | count | llm_judgement | structural>",
  "proposed_severity": "<block | warn>",
  "example_violation": "<one-sentence made-up example>",
  "example_pass": "<one-sentence made-up example>"
}

Rules:
- Skip any rule that depends on context the linter cannot see
  (e.g. "tone matches the audience" without a defined audience).
- Skip any rule that is a manifesto statement ("we believe in...").
- Prefer regex and count types over llm_judgement.
- Severity block for rules that the brand lead would always
  reject; warn for rules that flag for review.
- Return between 15 and 30 rules.
```

**Expect output like:**

```json
[
  {
    "id": "brand_name_capitalization",
    "description": "Brand name must be capitalised as 'Cascadia Endurance'.",
    "rule_text_from_guidelines": "Always capitalise Cascadia Endurance as two words, both capitalised.",
    "proposed_check_type": "regex",
    "proposed_severity": "block",
    "example_violation": "We launched cascadia endurance in 2018.",
    "example_pass": "We launched Cascadia Endurance in 2018."
  },
  {
    "id": "banned_buzzwords",
    "description": "Avoid generic SaaS buzzwords (solutions, unlock, seamless, leverage).",
    "rule_text_from_guidelines": "Our voice avoids buzzwords. Never use solutions, unlock, leverage.",
    "proposed_check_type": "regex",
    "proposed_severity": "warn",
    "example_violation": "We unlock seamless solutions for runners.",
    "example_pass": "We make kit for trail runners."
  }
]
```

You should now have a draft rule list of fifteen to thirty rules.

### Phase 2, rule classification

Decide the check type and severity for each rule with intent.

**Step 2.1, walk the list with the brand lead.**

Thirty minutes in person or on a call. For each rule, three questions:

- Is this objectively checkable? If no, cut it. Subjective rules go to human review.
- What is the failure cost? Block-severity rules fail a piece outright. Warn rules flag for review.
- Is regex enough or does it need LLM judgement?

Most rules will land as regex or count. A few (claim-source check, tone match) need LLM judgement. Hybrid checks (deterministic first, LLM only if deterministic passes) are the cheapest way to handle the LLM-judgement rules.

**Step 2.2, finalise the rule list as YAML.**

Save the classified rules to `guardrails.yaml` in your content repo. The shape:

```yaml
rules:
  - id: brand_name_capitalization
    type: regex
    severity: block
    description: "Brand name capitalised as 'Cascadia Endurance'."
    pattern: "(?i)\\bcascadia\\s+endurance\\b"
    allowed: ["Cascadia Endurance"]
    fix_suggestion: "Replace with 'Cascadia Endurance' (both capitalised)."

  - id: vahla_range_naming
    type: regex
    severity: block
    description: "Sub-brand is 'Vahla Range', not 'Vahla' alone or 'the Vahla range'."
    pattern: "(?i)\\bvahla\\b(?!\\s+Range)"
    fix_suggestion: "First mention must be 'Vahla Range'. Subsequent may be 'Vahla'."

  - id: banned_buzzwords
    type: regex
    severity: warn
    description: "Avoid generic SaaS buzzwords."
    patterns:
      - "(?i)\\bsolutions\\b"
      - "(?i)\\bsynergy\\b"
      - "(?i)\\bleverage\\b(?!\\sas)"
      - "(?i)\\bunlock\\s+the\\b"
      - "(?i)\\bseamless\\b"
    fix_suggestion: "Replace with a specific noun naming what we do."

  - id: claim_source_required
    type: llm_judgement
    severity: block
    description: "Performance claims must have a cited source or be hedged."
    model: claude-4.5-sonnet
    prompt_template: claim_audit.txt
    pass_criterion: "no_unsourced_performance_claims"

  - id: headline_length
    type: count
    severity: block
    description: "Headlines under 65 characters."
    target_selector: "headline"
    check: "length <= 65"
    fix_suggestion: "Trim to 65 characters. Strong headlines are 8 to 12 words."

  - id: athlete_full_name_first_mention
    type: structural
    severity: warn
    description: "Sponsored athletes use full name on first mention."
    athletes: ["Beth Lyons", "Marcus Hale", "Saoirse Burns"]
    check: "first_mention_is_full_name"

  - id: oxford_comma
    type: regex
    severity: warn
    description: "Use the Oxford comma in lists of three or more."
    pattern: "(?<=\\w),\\s\\w+\\s+and\\s"
    fix_suggestion: "Add a comma before 'and' in lists of three or more items."

  - id: british_spelling
    type: regex
    severity: warn
    description: "British spellings (colour, organise, behaviour)."
    patterns:
      - "(?i)\\bcolor\\b"
      - "(?i)\\borganize\\b"
      - "(?i)\\bbehavior\\b"
      - "(?i)\\bcenter\\b"
    fix_suggestion: "Use British spelling (colour, organise, behaviour, centre)."
```

The rule registry sits in the same repo as your content. Changes to the rules require a PR, so brand updates happen in a reviewable, versioned way rather than by sending a new PDF to Slack.

### Phase 3, ruleset implementation

The script that reads the YAML and runs the rules.

**Step 3.1, scaffold the linter.**

Create `guardrails/lint.py` (or `lint.js`) in your repo. The shape, in pseudocode:

```python
import yaml, re, json, sys
from anthropic import Anthropic

def lint(content, rules):
    findings = []
    for rule in rules:
        if rule["type"] == "regex":
            findings.extend(check_regex(content, rule))
        elif rule["type"] == "count":
            findings.extend(check_count(content, rule))
        elif rule["type"] == "structural":
            findings.extend(check_structural(content, rule))
        elif rule["type"] == "llm_judgement":
            findings.extend(check_llm(content, rule))
    return {
        "passes": [f for f in findings if f["status"] == "pass"],
        "warns":  [f for f in findings if f["status"] == "warn"],
        "blocks": [f for f in findings if f["status"] == "block"],
    }

if __name__ == "__main__":
    with open("guardrails.yaml") as f:
        rules = yaml.safe_load(f)["rules"]
    content = sys.stdin.read()
    report = lint(content, rules)
    print(json.dumps(report, indent=2))
```

The full implementation lives in your repo. The check_regex, check_count, check_structural and check_llm functions are short, each one a dozen lines.

**Step 3.2, the LLM-judgement prompt template.**

For rules with `type: llm_judgement`, the script renders the prompt template. The claim-source check template, saved to `guardrails/prompts/claim_audit.txt`:

```text
SYSTEM: You audit marketing copy for performance claims that need
a cited source. A performance claim is a specific assertion about
results (e.g. "30% lighter than the competitor", "tested over 200
km", "the fastest shoe in our range"). A claim needs either a
named source or a hedge ("our team tested", "based on internal
testing", "early customers reported").

You return JSON only.

USER:
The content:
"""
{CONTENT}
"""

For each performance claim found, return:

{
  "claim": "<verbatim quote>",
  "has_source_or_hedge": <true | false>,
  "verdict": "<pass | block>",
  "fix_suggestion": "<one-sentence rewrite>"
}

If no performance claims are present, return an empty array.

Rules:
- Pure aesthetic statements ("looks sharp", "feels right") are
  not performance claims.
- A claim is "hedged" if it explicitly attributes to the brand's
  own testing or specific customer testimony.
- Verdict block if has_source_or_hedge is false.
```

**Step 3.3, the output format.**

The script prints structured JSON. Every finding has a rule_id, status, line number, the offending text and a fix suggestion. Example output:

```json
{
  "passes": [
    {"rule_id": "brand_name_capitalization", "status": "pass"},
    {"rule_id": "headline_length", "status": "pass", "value": 52}
  ],
  "warns": [
    {
      "rule_id": "banned_buzzwords",
      "status": "warn",
      "line": 14,
      "text": "We unlock new performance...",
      "fix_suggestion": "Replace with a specific noun naming what we do."
    }
  ],
  "blocks": [
    {
      "rule_id": "claim_source_required",
      "status": "block",
      "line": 22,
      "text": "30% lighter than the competitor",
      "fix_suggestion": "Add a source citation or hedge ('our team tested')."
    }
  ]
}
```

You should now have a runnable linter that prints structured JSON for any piece of content.

### Phase 4, Slack and CI integration

The linter has to run where the team actually writes.

**Step 4.1, the Slack workflow.**

In Slack, open *Workflow Builder*. Create a new workflow called *Brand check*. Trigger on the shortcut `/brandcheck`. Add a *Send a webhook* step that POSTs the message text to your linter endpoint. Add a *Send a message* step that posts the linter response back to the user as a threaded reply.

The team's workflow becomes: paste the draft into Slack, type `/brandcheck`, get the report inline. No context switch. Most ad-hoc copy lives in Slack so this is where most of the value comes from.

**Step 4.2, the CI integration for the content repo.**

For content in a GitHub repo (blog posts, copy docs, ad scripts), add a GitHub Action.

Create `.github/workflows/guardrails.yml`:

```yaml
name: Brand guardrails
on:
  pull_request:
    paths:
      - "content/**"
      - "ads/**"
      - "emails/**"

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r guardrails/requirements.txt
      - name: Run guardrails on changed files
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          for file in $(git diff --name-only origin/main...HEAD); do
            if [[ "$file" =~ \.(md|txt|yaml)$ ]]; then
              cat "$file" | python guardrails/lint.py > "$file.lint.json"
              blocks=$(jq '.blocks | length' "$file.lint.json")
              if [ "$blocks" -gt 0 ]; then
                echo "::error::Brand guardrails blocked in $file"
                cat "$file.lint.json"
                exit 1
              fi
            fi
          done
```

Block-severity findings fail the action. Warn-severity findings show as PR comments but do not block.

**Step 4.3, the CMS webhook.**

For content in a CMS (Sanity, Contentful, Webflow CMS), add a pre-publish webhook. The webhook POSTs the document body to the linter. If blocks come back, the CMS shows them inline and the publish button stays disabled.

You should now have the linter wired into Slack (for ad-hoc copy), GitHub (for repo-managed content) and the CMS (for published content).

### Phase 5, calibration corpus

The corpus is what stops the ruleset drifting.

**Step 5.1, run the ruleset against the exemplary 50.**

Pipe each exemplary piece through `lint.py`. Count the block rate. The target is under 5%. If exemplary content is being blocked, the rules are too strict. For each false block, decide: soften the rule, downgrade severity, or accept that this exemplary piece needs a small edit.

**Step 5.2, run the ruleset against the historic 30 violations.**

Pipe each known-bad piece through the linter. Count the catch rate. The target is 80% or higher. If the catch rate is lower, the ruleset does not cover the actual failure modes. For each miss, extend the ruleset with a new rule.

**Step 5.3, lock the calibration ritual.**

Add a Notion page called *Guardrails calibration log*. Each quarter, the brand lead re-runs the corpus through the linter and logs the false-block rate and catch rate. A drift either way (false-block rate climbs above 8%, catch rate drops below 75%) triggers a ruleset refresh.

You should now have a versioned, calibrated, integrated ruleset that catches drift before it ships.

## Worked example, end-to-end

Cascadia Endurance, scale-stage. Marketing function of six. Beth Lyons (head of brand) holds the guidelines. The PDF is from 2024, 38 pages.

**Phase 1.** Beth pastes the guidelines into the rule-extraction prompt. The output returns 23 candidate rules. Of those, 19 are clearly check-able. Four are subjective ("our voice is craft-led but never precious") and get dropped from the linter, kept for human review.

**Phase 2.** Beth and Saoirse (channel operator) walk the 19 in 35 minutes. Twelve become regex, three become count, two become structural, two become LLM-judgement (claim source and tone match). Severities split eight block / eleven warn.

**Phase 3.** Saoirse builds the linter in two days. The YAML lands at 19 rules. The Python script runs in 1.4 seconds against a 1,500-word piece without LLM-judgement rules, 3.8 seconds with.

**Phase 4.** The Slack workflow ships Wednesday. The CI integration ships Thursday. The first PR after Thursday hits a block on the claim-source rule (a blog draft saying "30% lighter than the competitor" with no source). The author adds a hedge ("our internal testing showed"). PR re-runs, passes.

**Phase 5.** Saoirse runs the calibration corpus. The 50 exemplary pieces produce two false blocks (both on the banned-buzzwords rule firing on "solutions" where the surrounding context made it fine). Block-rate 4%, within target. The 30 historic violations produce 25 catches. Catch-rate 83%, within target. The two missed violations point to a missing rule on athlete-result over-claiming, which gets added.

**The ruleset after the install (extract):**

| Rule ID | Type | Severity | Source rule from guidelines |
|---|---|---|---|
| brand_name_capitalization | regex | block | "Cascadia Endurance, both capitalised" |
| vahla_range_naming | regex | block | "First mention is 'Vahla Range'" |
| banned_buzzwords | regex | warn | "Avoid SaaS buzzwords" |
| claim_source_required | llm_judgement | block | "Performance claims need a source" |
| headline_length | count | block | "Headlines under 65 characters" |
| oxford_comma | regex | warn | "Use the Oxford comma" |
| athlete_full_name_first_mention | structural | warn | "Full name on first mention" |
| no_race_overclaim | llm_judgement | block | "Race results stated specifically" |

Within a quarter, brand-consistency complaints from Beth drop to near zero. Beth's actual work shifts to original creative.

## Try it yourself

Three exercises. Each takes 30 to 60 minutes.

### Exercise 1, extract rules from your guidelines

Open your current brand guidelines. Run the Phase 1.2 extraction prompt on them. Read the output. How many rules did the model surface that you would not have catalogued manually? The gap is the value of having the model read the guidelines for you.

### Exercise 2, draft three regex rules by hand

Pick three of the surfaced rules. Write the regex patterns by hand. Test each against five pieces of your real content. Iterate until the pattern catches the intended violations and ignores the false positives. This is the work the linter does every time it runs. Doing it once by hand calibrates your intuition for when a rule is too tight or too loose.

### Exercise 3, run the linter against ten pieces

Once the linter is running, pipe ten recent pieces through it. Read the blocks and warns. Argue with the brand lead about three findings. Where the lead disagrees with the rule, either the rule needs adjustment or the lead's gut differs from the documented guideline. Both findings are useful.

## The eval gates

**Eval 1, false-positive rate.** Run the ruleset against 50 pieces the brand lead considers exemplary. The block rate against this corpus should be under 5%. If exemplary content is being blocked, the rules are too strict.

**Eval 2, false-negative rate.** Run the ruleset against 30 pieces that violated guidelines in the past. The ruleset should catch 80% or more of historic violations. Below that, the rules do not cover the actual failure modes the brand experiences.

**Eval 3, linter speed.** End-to-end time for one piece under two seconds without LLM-judgement rules, under five seconds with. If the linter is slow, the team will work around it.

**Eval 4, override rate.** Track the rate at which block-severity findings get overridden by the team. If overrides exceed 10%, the rule is either wrong or the team is bypassing the system. Either fix the rule or have the conversation.

## The failure modes

**Rules people cannot fix become noise.** If a rule blocks but the fix is not actionable, the team submits override requests until the rule effectively does not exist. Every block-severity rule must come with a fix_suggestion that is implementable in under two minutes.

**LLM-judgement rules drift.** The tone-match or claim-support rules use a model, and their behaviour changes when the model updates. Pin model versions. Re-run the calibration corpus monthly. Recalibrate when drift exceeds the thresholds.

**Brand lead bypasses the system.** If the person who built the guidelines has commit access and pushes content directly without the check running, the system is dead. The check must run on the brand lead's content too.

**Rules contradict.** Sometimes guidelines have rules that contradict in edge cases. "Be conversational" and "no contractions" both hold until the linter sees a customer email. When the ruleset surfaces a contradiction, document it. The check becomes a hard decision rather than a recurring argument.

**Rules grow without retirement.** Every quarterly review adds rules. Few retire. After two years the ruleset is a slow, over-blocking mess. Retire three rules per quarter even if it is hard to pick three.

## The pattern in practice

Illustrative scenarios that show common shapes brand guardrails as code take. Specifics are illustrative and patterns repeat.

**Health-tech, regulated category, the compliance-time reclaim.** A brand with a long-form guideline document and a compliance officer who manually reviews every piece. Encoding most of the rules into the ruleset typically reduces manual review time by an order of magnitude. The high-value rules, LLM-judgement checks for unsourced claims, catch the regulator-flagged issues that would otherwise have shipped.

**D2C brand, the brand-lead-as-creator unlock.** A brand losing voice consistency across a growing team. Installing the ruleset typically takes brand-consistency complaints from the brand lead to near zero within a quarter. The brand lead's actual job shifts from policing to creating, recovering a substantial portion of the week previously spent on consistency review for original work.

**B2B SaaS, the sales-workaround failure.** A common failure mode is the pipeline installs cleanly but within months sales builds a workaround, a separate Notion space where they draft pitches without the check. Sales hits pipeline targets at the cost of brand consistency. The fix is to extend the check to all surfaces, not just the ones marketing controls.

## Hand-off

The guardrails ruleset feeds:
- **brief-to-ship-pipeline**, where pre-ship review checks the linter passed before the brief enters the ship queue
- **evaluation-frameworks**, where the guardrails-as-code ruleset becomes one of the eval rubrics in the broader library
- **brand-voice-extraction**, where the ruleset's pattern-matching rules come from the voice profile
- **customer-content-rights**, where customer-facing replies (claim responses, DMs) run through the guardrails before send
