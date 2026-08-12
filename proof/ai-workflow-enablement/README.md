# AI Workflow Enablement Evidence Pack

This folder contains inspectable evidence for the AI Workflow Enablement applied case study and its public demonstrations.

## Contents

- `synthetic-meeting-notes.md`: six fictional distributed coordination inputs with one missing response, one date conflict, and one unassigned issue
- `reference-reviewed-record.md`: expected client coordination package after three exception decisions
- `acceptance-tests.md`: manual and automated validation matrix for the broader Meeting Intelligence and Document Intake demonstration set
- `governance-boundary.md`: preparation authority, exception-review requirements, public-data boundaries, and production-adaptation requirements
- `administrator-runbook.md`: shared operation, validation, change control, release, and organizational-adaptation guidance

## Document Intake Pass 4 proof pack

The Document Intake demonstration now has a dedicated public proof layer under `../../evidence/ai-workflow-enablement/`:

- `document-intake-proof.html`: public one-page case study, architecture, synthetic evidence, acceptance summary, handoff assets, and production boundary
- `document-intake-proof.json`: machine-readable proof manifest tying the demonstration to its evidence artifacts
- `document-intake-synthetic-records.csv`: canonical six-record fictional test register
- `document-intake-acceptance.csv`: eleven documented acceptance scenarios

The executable browser coverage is `../../tests/document-intake.spec.mjs`. The administrator operating document is `../../docs/DOCUMENT_INTAKE_DEMO_RUNBOOK.md`, and the short walkthrough is `../../docs/DOCUMENT_INTAKE_DEMO_SCRIPT.md`.

The repository CI validates the proof manifest and referenced assets with `../../scripts/validate_proof_packs.py` in addition to the normal HTML, link, public-claims, and Playwright validation.

## Working demonstrations

- Open `../../demos/meeting-intelligence.html` to see distributed updates assembled into a client-ready brief, action register, and targeted follow-up request while only missing, conflicting, or unassigned items require detailed review.
- Open `../../demos/document-intake.html` to inspect routine group confirmation, duplicate handling, missing-information control, classification review, and controlled routing.

## Core operating principle

Prepare routine information together. Preserve the source. Direct accountable people to exceptions requiring judgment. Produce usable operating outputs from the reviewed decisions.

## Claim boundary

The public implementation demonstrates workflow design, deterministic reference behavior, exception-focused review, evidence preservation, and browser interaction using fully synthetic data. It does not establish production model accuracy, enterprise integration reliability, measured organizational outcomes, compliance with a specific employer's policies, or autonomous decision authority.
