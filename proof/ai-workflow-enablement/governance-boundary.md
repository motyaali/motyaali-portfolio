# AI Workflow Enablement Governance Boundary

## Purpose

Define what the public demonstrations may prepare, what requires accountable human review, what evidence must be retained, and what remains outside scope.

## Core operating principle

**Automation may prepare proposals, routine records, classifications, summaries, and routing recommendations. It may not silently create authority, invent missing facts, or make consequential final decisions.**

## Control tiers

| Tier | Workflow role | Public demonstration behavior |
|---|---|---|
| Mechanical preparation | Preserve source, validate required fields, structure records, format exports | Allowed |
| Proposal | Suggest decisions, actions, owners, dates, risks, questions, classifications, metadata, or destinations | Allowed only as a proposal with source evidence |
| Reversible staging | Hold a duplicate, prepare an information request, place a reviewed item into a routing queue | Allowed when the action is reversible and visible |
| Final authority | Assign permanent authority, publish a canonical record, approve payment, make policy determinations, or trigger irreversible action | Human-only |

## Required controls

- Preserve the original source or submission.
- Identify the data classification and proposal method.
- Keep source evidence visible to the reviewer.
- Do not invent missing owners, dates, identifiers, approvals, or policy interpretations.
- Surface uncertainty, conflicts, missing information, and low confidence.
- Require the appropriate review for consequential or authoritative records.
- Preserve edits, rejected proposals, held items, and final dispositions in the evidence history.
- Route or publish only after the required control is satisfied.
- Keep accountable ownership and final authority explicit.

## Public demonstration boundary

The public demonstrations use:

- fictional names, organizations, projects, documents, and meeting content
- deterministic pre-generated proposals or processing results
- browser-local state
- user-triggered actions and downloads
- no confidential, employer, client, medical, legal, financial, or identifying source data

They do not use:

- a production language model
- user accounts or identity services
- live calendars, email, task systems, SharePoint, Google Drive, Slack, or records platforms
- server-side storage or a durable audit database
- automatic external publication
- client-specific permissions, retention rules, or approval matrices

## Production adaptation requirements

A real organizational implementation would require:

1. A named process owner and accountable reviewers
2. An approved current-state process and system-of-record map
3. Approved data, retention, and deletion rules
4. Identity, permission, and least-privilege design
5. An approved model, connector, or deterministic automation architecture
6. Source-link and audit requirements
7. Representative test data and acceptance criteria
8. Error, retry, outage, ambiguity, and exception procedures
9. Human-review roles and publication authority
10. Security, privacy, records, legal, accessibility, and policy review as applicable
11. User training and administrator handoff
12. Baseline and post-implementation measurement

## High-impact exclusions

The workflow must not autonomously make legal, medical, financial, benefits, hiring, discipline, eligibility, safety, payment, permanent-deletion, contract-approval, or policy-exception decisions.
