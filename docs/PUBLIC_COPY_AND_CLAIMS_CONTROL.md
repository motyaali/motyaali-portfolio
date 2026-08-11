# Public Copy and Claims Control

Status: Active governance control  
Canonical public implementation: `motyaali/motyaali-portfolio@main`  
Machine-readable control: `evidence/governance/public-claims.json`

## Purpose

This document defines how public portfolio copy is governed after the portfolio moved from packet planning into a functioning GitHub-based site.

The public GitHub `main` branch is the canonical implementation. Controlled source records, the Master Portfolio Record, and private technical or career evidence remain the authority for deciding what may be claimed. Private source files are not copied into the public repository merely to prove a claim.

The operating rule is simple:

> Public pages may state only claims that match their evidence and maturity boundary.

## Governance stack

1. **Controlled evidence and source records** establish the factual basis.
2. **Master Portfolio Record and project governance** determine classification, privacy, and publication eligibility.
3. **`public-claims.json`** records the approved public wording, maturity label, evidence level, and public-safe source basis.
4. **Public HTML pages** implement the approved claims.
5. **`scripts/validate_public_claims.py`** blocks claim drift in CI when approved wording disappears, a governed page is missing, or forbidden legacy wording reappears.

## Approved core positioning

### Homepage

- `Turning complexity into clear systems and useful work.`
- `I design reliable workflows, decision-ready analysis, practical documentation, and governed human-centered tools that help people and organizations move from fragmented information to coordinated action.`

### About

- `I make complex systems easier to understand, operate, and improve.`

### Services

- `Practical workflows that reduce routine handling without weakening control.`

### Contact

- `I welcome conversations about professional opportunities, governed workflow implementation, project collaboration, and specific feedback on the evidence in this portfolio.`

## Public maturity and evidence matrix

| Public case | Allowed maturity label | Public evidence boundary |
| --- | --- | --- |
| AI Workflow Enablement | Working Demonstrations / Applied Case Study | Working browser demonstrations, tests, governance, and runbook. No production AI accuracy, client integration, measured organizational savings, or autonomous authority claim. |
| Construction Project Coordination Controls | Independent Applied Case Study | Synthetic project records only. No confidential client work or independent approval authority claim. |
| Enterprise Documentation & Workflow Enablement | Professional Body of Work | Professional experience may be described; public visuals are sanitized reconstructions. Original employer and client records remain private. |
| Retail Planning & Inventory Strategy | Professional Body of Work | Career metrics may be used when supported by controlled source records. Proprietary reports remain private. |
| Unseen Lifeline | Evaluated Demonstration / Case Study | Evaluated IBM SkillsBuild capstone and synthetic public case. No autonomous eligibility, advice, or submission claim. |
| Unseen OS / Unseen Lifeline v0.3 | Working Prototype | Final local Release Candidate passed expanded clean-run validation. Public production deployment, external-user validation, production security, monitoring, and live Gemini-provider validation are not claimed. |
| Canonical Source Synthesis | Operational System | Repeatable documented information-governance method. Public examples use synthetic sources. Organizational deployment would still require approved repositories, access controls, retention rules, and process ownership. |
| Inventory Truth Ledger | Documented Architecture | Architecture and implementation specification. No production integrations, deployment, or validated savings claim. |
| SmartGrocer | Working Prototype | Authenticated private-pilot foundation with implementation and automated checks. Not a public production service and not a realized-savings claim. |

## Professional metric policy

Use a metric when the controlled source library supports the scope or outcome and the wording does not imply more ownership than the evidence establishes.

Current approved examples include:

- `$500M+` Sephora category planning scope
- `$250M+` Old Navy and Burlington planning or inventory scope
- `650+ stores` Burlington allocation scope
- `40%` forecast-accuracy improvement and `30%` stockout reduction in the documented Gymboree system-migration case
- `45+ openings` West Elm expansion support
- `250+ users` on the public documentation page as a conservative expression of a controlled 268-user access and documentation scope

### Levi's / Amazon wording control

Older source materials include a specific Amazon revenue figure. Later claim review concluded that the exact channel number should not be used as public portfolio proof because it is not independently confirmable and may overstate individual ownership.

Approved public wording focuses on contribution:

`I managed ecommerce inventory flow for Levi's and Dockers, supported online size expansion, and contributed to Amazon wholesale onboarding that helped launch a new digital revenue stream.`

The CI validator explicitly blocks the retired exact `$10M+` public wording from HTML pages.

## Confidentiality rules

### Professional and employer work

- Do not publish original employer or client source records unless explicit publication permission exists.
- Use sanitized reconstructions to demonstrate workflow logic, decision structure, or documentation quality.
- Do not use employer/client logos or imply endorsement unless permission is documented.
- Preserve the distinction between work performed in a professional role and independent portfolio reconstructions.

### Sensitive personal cases

The Quincy-related source material is not an approved standalone public case study in the current portfolio. Do not publish agency names, case numbers, addresses, disability details, benefits records, medical information, legal correspondence, or other private identifiers from that source material. Any future public use requires a separately approved sanitized narrative.

### Technical projects

- Do not publish secrets, populated private databases, private inboxes, personal runtime paths, or private source packages merely to prove implementation.
- Public technical claims should be supported through sanitized architecture, tests, verification records, synthetic data, and explicit maturity boundaries.

## Change workflow

For future portfolio edits:

1. Identify the controlled evidence supporting the proposed claim.
2. Confirm project maturity and privacy classification.
3. Add or update the approved claim in `evidence/governance/public-claims.json`.
4. Update the public page to match the approved wording and boundary.
5. Run `python scripts/validate_public_claims.py` and the normal site validation suite.
6. Merge only after CI passes.

If a claim cannot be supported at the requested strength, reduce the wording, label it as planned or expected, or keep it private. Do not invent a number or promote expected benefits into measured results.
