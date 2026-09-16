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
4. **Public proof manifests** tie working demonstrations to synthetic records, acceptance evidence, operating documentation, and non-claims.
5. **`offer-conversion.json`** ties AI Workflow Enablement's four engagement packages, public offer assets, pilot boundary, qualification privacy boundary, and unresolved commercial gates together.
6. **Public HTML pages** implement the approved claims.
7. **`scripts/validate_public_claims.py`** blocks copy and maturity drift in CI.
8. **`scripts/validate_proof_packs.py`** blocks proof-pack drift when a manifest, test register, acceptance matrix, or referenced artifact is missing or inconsistent.
9. **`scripts/validate_offer_conversion.py`** blocks offer drift, missing public conversion assets, weakened discovery privacy controls, or accidental removal of unresolved commercial validation gates.

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
| AI Workflow Enablement | Working Demonstrations / Service Framework | Working browser demonstrations, Document Intake proof pack, tests, governance, runbooks, four engagement packages, one-page overview, and browser-local discovery worksheet. No production AI accuracy, client integration, measured organizational savings, final pricing/service economics, client testimonial, or autonomous authority claim. |
| Intelligent Document Intake and Routing Proof Pack | Working Browser Demonstration | Six synthetic records, deterministic browser behavior, acceptance matrix, executable Playwright coverage, proof manifest, runbook, and demo script. No live Microsoft 365 integration, production AI accuracy, measured client savings, production identity controls, or autonomous consequential decisions. |
| Construction Project Coordination Controls | Independent Applied Case Study | Synthetic project records only. No confidential client work or independent approval authority claim. |
| Enterprise Documentation & Workflow Enablement | Professional Body of Work | Professional experience may be described; public visuals are sanitized reconstructions. Original employer and client records remain private. |
| Retail Planning & Inventory Strategy | Professional Body of Work | Career metrics may be used when supported by controlled source records. Proprietary reports remain private. |
| Unseen Lifeline | Evaluated Demonstration / Case Study | Evaluated IBM SkillsBuild capstone and synthetic public case. No autonomous eligibility, advice, or submission claim. |
| Unseen OS / Unseen Lifeline v0.3 | Working Prototype | Final local Release Candidate passed expanded clean-run validation. Public production deployment, external-user validation, production security, monitoring, and live Gemini-provider validation are not claimed. |
| Canonical Source Synthesis | Operational System | Repeatable documented information-governance method. Public examples use synthetic sources. Organizational deployment would still require approved repositories, access controls, retention rules, and process ownership. |
| Inventory Truth Ledger | Documented Architecture | Architecture and implementation specification. No production integrations, deployment, or validated savings claim. |
| SmartGrocer | Working Prototype | Authenticated private-pilot foundation with implementation and automated checks. Not a public production service and not a realized-savings claim. |

## AI Workflow Enablement offer-control policy

The public service framework may present the four documented engagement packages:

1. Workflow Diagnostic
2. Controlled Pilot
3. Full Implementation & Enablement
4. Optimization & Support

The recommended first engagement may be described as a Controlled Pilot for one recurring process, one team or business unit, representative approved data, and approximately 5 to 20 pilot users.

The public offer must keep these unresolved commercial items visible as **not yet validated** rather than inventing or implying answers:

- final pricing and payment structure;
- estimated delivery cost and gross margin;
- vendor and licensing cost assumptions;
- deposit, cancellation, and change-order terms;
- recurring support pricing and economics;
- professional liability and cyber-risk review;
- standard service agreement and confidentiality terms;
- production client credential and environment separation process.

A public service offer is not evidence of a paying customer, measured savings, production accuracy, regulatory approval, or client deployment.

## Discovery worksheet privacy policy

The public workflow-discovery worksheet is a browser-local qualification utility.

- Form submission is prevented in JavaScript.
- The page does not send form content through `fetch` or `XMLHttpRequest`.
- The generated process brief remains in the browser unless the visitor chooses to copy it or activates the mailto action.
- The page instructs visitors not to enter confidential, medical, legal, financial, regulated, employer-proprietary, credential, personally identifying, or other sensitive information.

Any future change that sends form data to a server, analytics endpoint, CRM, database, or third-party form service is a material privacy change and requires a new review before merge.

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

## Demonstration metric policy

Deterministic counts from a synthetic demonstration may be stated only as demonstration evidence. They are not organizational outcomes.

For the Document Intake proof pack, approved statements include:

- six fictional incoming records;
- three routine records prepared for one group confirmation;
- three targeted exception decisions;
- four approved records shown as routed;
- two unsafe or incomplete records shown as held;
- eleven documented acceptance scenarios.

The public page must preserve the statement:

`The counts are deterministic demonstration evidence, not measured organizational savings.`

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
- A proof pack must not imply that a synthetic browser demonstration is a deployed client integration.

## Change workflow

For future portfolio edits:

1. Identify the controlled evidence supporting the proposed claim.
2. Confirm project maturity and privacy classification.
3. Add or update the approved claim in `evidence/governance/public-claims.json`.
4. When the project has a public proof or offer manifest, update the manifest and every affected evidence artifact together.
5. Update the public page to match the approved wording and boundary.
6. Run `python scripts/validate_public_claims.py`, `python scripts/validate_proof_packs.py`, `python scripts/validate_offer_conversion.py`, and the normal site validation suite.
7. Merge only after CI passes.

If a claim cannot be supported at the requested strength, reduce the wording, label it as planned or expected, or keep it private. Do not invent a number or promote expected benefits into measured results.
