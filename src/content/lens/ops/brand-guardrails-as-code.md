---
title: "Brand guardrails as code"
stack: ops
description: "Turn the brand guidelines from a PDF nobody reads into a programmatic check that runs against every piece of content before it ships. Catches drift before, not after."
outputs: "Guardrails ruleset, linting script, CI integration"
readMin: 9
shipTime: "1 working week"
brandStage: ["growth", "scale", "enterprise"]
channels: ["brand", "content"]
models: ["claude-4.5-sonnet", "gpt-5"]
publishedAt: 2026-04-20
status: live
preview: false
---

## The brief

Brand guidelines are typically 40 pages of PDF that nobody on the team has read in a year. The team breaks the guidelines in small ways every week. The brand lead notices six months in, has a difficult conversation, the team apologises, the guidelines stay un-read, and the cycle repeats.

This playbook turns the guidelines that matter into code. The rules become a programmatic ruleset. The ruleset runs against every piece of outbound content (content drafts, ad copy, social posts, email subject lines, deck text) before ship. Violations block the merge or the schedule. The brand stops drifting because the system won't let it.

Human judgement still applies. There will always be rules that need a person to call. But the dozens of rules that are objectively checkable, like banned phrases, tone tells, claim limits, factual guards, formatting, those run automatically and stop being a recurring conversation.

## The pipeline

Four phases to install. Then it just runs.

**Phase 1, rule extraction.** Read the existing brand guidelines (PDF, deck, Notion, wherever). Identify every rule that's objectively checkable. Examples include "never use the word 'solutions'", "always capitalise the product name as one word", "never claim X without the legal disclaimer", "headlines under 60 chars", "no exclamation marks", "use the Oxford comma", "British spelling not American". Reject rules that depend on judgement like "be warm but professional", because those stay for human review.

**Phase 2, rule classification.** For each rule, classify the check type as regex match, deterministic count, LLM judgement, or fact-cross-reference. Most rules are regex or count. Some need LLM judgement (e.g., "the tone matches the voice profile"). Some need a cross-reference (e.g., "every product claim has a source").

**Phase 3, ruleset implementation.** Build the ruleset as a runnable script. Each rule is a function with a clear name, a check, and a fix suggestion. The output of running the script against a piece of content is a structured JSON report covering passes, warnings, and blocks.

**Phase 4, CI integration.** Wire the script into the team's content workflow. For docs in a repo, a pre-commit hook plus CI check. For docs in a CMS, a pre-publish webhook. For ad copy, a Slack-bot that scans pasted text before the team submits. The check is as fast and frictionless as possible (under 2 seconds per piece), or the team will work around it.

## The ruleset shape

Every rule lives in one file. This is the structure we use.

```yaml
rules:
  - id: brand_name_capitalization
    type: regex
    severity: block
    description: "Brand name must be capitalised as one word."
    pattern: "(?i)manual focus"
    allowed: ["Manual Focus", "MANUAL FOCUS"]
    fix_suggestion: "Replace with 'Manual Focus' (capitalised, no hyphen)."

  - id: banned_buzzwords
    type: regex
    severity: warn
    description: "Avoid generic SaaS buzzwords."
    patterns:
      - "(?i)\\bsolutions\\b"
      - "(?i)\\bsynergy\\b"
      - "(?i)\\bleverage\\b(?!\\sas)"
      - "(?i)\\bunlock\\s+the\\s+power\\b"
    fix_suggestion: "Replace with a specific noun naming what we do."

  - id: claim_proof_required
    type: llm_judgement
    severity: block
    description: "Performance claims must have a cited source or be hedged."
    model: claude-4.5-sonnet
    prompt: "{{CLAIM_AUDIT_PROMPT}}"
    pass_criterion: "no_unsourced_performance_claims"

  - id: headline_length
    type: count
    severity: block
    description: "Headlines under 65 characters."
    target_selector: "headline"
    check: "length <= 65"
    fix_suggestion: "Trim. Strong headlines are 8-12 words."

  - id: exclamation_marks
    type: count
    severity: warn
    description: "No more than 1 exclamation mark per 500 words."
    check: "count('!') <= ceil(word_count / 500)"

  - id: oxford_comma
    type: regex
    severity: warn
    description: "Use the Oxford comma in lists of 3+."
    pattern: "(?<=\\w),\\s\\w+\\s+and\\s"
    fix_suggestion: "Add a comma before 'and' in lists of three or more items."
```

The rule registry sits in the same repo as your content. Changes to the rules require a PR, so brand updates happen in a reviewable, versioned way, rather than by sending a new PDF to Slack.

## The eval harness

Two checks at the ruleset level.

**Eval 1, false positive rate.** Run the ruleset against 50 pieces of content the brand lead considers exemplary. The block rate against this corpus should be under 5%. If exemplary content is being blocked, the rules are too strict, so review the false positives and either soften the rule or downgrade its severity.

**Eval 2, false negative rate.** Run the ruleset against 30 pieces of content that violated guidelines in the past (catch them from past audits or escalations). The ruleset should catch 80%+ of historic violations. If it catches fewer, the rules don't cover the actual failure modes the brand experiences, so extend.

## The failure modes

**Rules people can't fix become noise.** If a rule blocks but the fix isn't actionable, the team submits override requests until the rule effectively doesn't exist. Every block-severity rule must come with a fix_suggestion that's actually implementable in under 2 minutes.

**LLM-judgement rules drift.** The "tone matches voice" or "claim is supported" rules use a model and their behaviour changes when the model updates. Pin model versions. Re-run the calibration corpus monthly. Recalibrate the rule when the calibration drifts.

**Brand lead bypasses the system.** If the person who built the guidelines has commit access and pushes content directly without the check running, the system is dead. The check must run on the brand lead's content too. The rule is the rule, not the personality.

**Rules contradict.** Sometimes the brand guidelines have rules that contradict in edge cases. "Be conversational" and "no contractions" can both be true until you write a customer-facing email. When the ruleset surfaces a contradiction, document it. The check becomes a hard decision rather than a recurring argument.

**Rules grow without retirement.** Every quarterly review adds rules. Few retirements happen. After two years, the ruleset is a slow, over-blocking mess. Establish a "retire 3 rules per quarter" discipline, even if it's hard to pick three. Old rules earn their keep or get cut.

## The pattern in practice

Illustrative scenarios that show common shapes brand guardrails as code take. Specifics are illustrative and the patterns repeat.

**Health-tech, regulated category, the compliance-time reclaim.** A brand with a long-form guideline document and a compliance officer who manually reviews every piece. Encoding most of the rules into the ruleset typically reduces manual review time by an order of magnitude. The high-value rules, LLM-judgement checks for unsourced claims, catch the regulator-flagged issues that would otherwise have shipped.

**D2C brand, the brand-lead-as-creator unlock.** A brand losing voice consistency across a growing team. Installing the ruleset typically takes brand-consistency complaints from the brand lead to near-zero within a quarter. The brand lead's actual job shifts from policing to creating, recovering a substantial portion of the week previously spent on consistency review for original work.

**B2B SaaS, the sales-workaround failure.** A common failure mode is the pipeline installs cleanly but within months sales builds a workaround, a separate Notion space where they draft pitches without the check. Sales hits pipeline targets at the cost of brand consistency. The fix is to extend the check to all surfaces, not just the ones marketing controls. If sales is generating outbound, sales is generating brand surface.
