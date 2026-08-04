# AI Workflow Enablement MVP Governance Boundary

## Purpose

Define what the public Meeting Intelligence MVP may prepare, what requires human review, what must be logged, and what is outside scope.

## Automation tiers

| Tier | Workflow role | Public MVP behavior |
|---|---|---|
| Mechanical | Preserve source, structure records, format exports | Allowed |
| Proposal | Suggest decisions, actions, owners, dates, risks, questions, and controls | Allowed only as a proposal |
| Reversible staging | Place a reviewed item into an approved publication queue | Allowed after explicit review |
| Final decision | Assign permanent authority, publish a canonical record, make a policy determination, or trigger an irreversible action | Human-only |

## Required controls

- Preserve the source meeting beside the proposals.
- Label proposal method and data classification.
- Require approve, edit, or reject review actions.
- Do not invent missing owners or dates.
- Preserve rejected and corrected records in review history.
- Publish only approved records.
- Keep final publication and permanent record status human-controlled.
- Export sufficient evidence to reconstruct what was proposed and changed.

## Public demonstration boundary

The public MVP uses:

- fictional names
- fictional meeting content
- deterministic pre-generated proposals
- browser-local state
- user-triggered downloads

It does not use:

- an external AI model
- user accounts or identity services
- calendars, task systems, email, SharePoint, Google Drive, Slack, or records platforms
- confidential or personal information
- server-side storage
- automatic external publication

## Production pilot requirements

A real organizational pilot would require:

1. Named process and system owners
2. Approved source data and retention rules
3. Identity and permission design
4. Approved model or connector
5. Source-link and audit requirements
6. Test set and acceptance criteria
7. Error, retry, and exception process
8. Human-review roles
9. Publication authority
10. Security, privacy, records, and legal review as applicable
11. Training and administrator handoff
12. Baseline and post-pilot measurement

## High-impact exclusions

The workflow must not autonomously make legal, medical, financial, benefits, hiring, discipline, eligibility, safety, payment, permanent deletion, or policy-exception decisions.
