# AI Workflow Enablement Administrator Runbook

## System purpose

The public case study demonstrates two bounded operating patterns:

1. A source-preserving, human-reviewed Meeting Intelligence workflow for converting meeting material into structured operating records.
2. A guided Document Intake workflow that prepares routine records, isolates exceptions, and prevents unsafe or incomplete routing.

Both demonstrations use fully synthetic data and browser-local behavior.

## Components

| Component | Path | Purpose |
|---|---|---|
| Case-study page | `ai-workflow-enablement/index.html` | Employer-facing overview and professional relevance |
| Evidence index | `projects/ai-workflow-enablement.html` | Working proof, controls, tests, and limitations |
| Meeting prototype | `demos/meeting-intelligence.html` | Source review, correction, approval, rejection, and evidence export |
| Meeting logic | `assets/meeting-intelligence.js` | Synthetic source, deterministic proposals, review state, history, and exports |
| Document-intake demonstration | `demos/document-intake.html` | Routine confirmation, exception handling, and controlled routing |
| Document-intake logic | `assets/document-intake.js` | Fictional records, deterministic results, interaction state, and outcomes |
| Shared styles | `assets/proof.css` | Demonstration and evidence interface styles |
| Synthetic meeting source | `proof/ai-workflow-enablement/synthetic-meeting-notes.md` | Public test input |
| Reference output | `proof/ai-workflow-enablement/reference-reviewed-record.md` | Expected reviewed meeting record |
| Acceptance matrix | `proof/ai-workflow-enablement/acceptance-tests.md` | Manual and automated validation coverage |
| Governance boundary | `proof/ai-workflow-enablement/governance-boundary.md` | Authority, data, and production limits |

## Meeting Intelligence operating procedure

1. Open `demos/meeting-intelligence.html`.
2. Confirm the synthetic-data and prototype-boundary notice is visible.
3. Review the source meeting.
4. Select **Load Proposed Records**.
5. Compare each proposed record with the source.
6. Correct the statement, owner, date, or review notes when needed.
7. Approve, reject, or leave each proposal pending.
8. Select **Generate Reviewed Record**.
9. Verify that only approved records appear in the approved section.
10. Download JSON evidence or the Markdown operating record when needed.
11. Reset before starting a new review.

## Document Intake operating procedure

1. Open `demos/document-intake.html`.
2. Confirm the fictional-data and preconfigured-results disclosure is visible.
3. Select **Process Intake Batch**.
4. Review the three routine records and confirm the group once.
5. Hold the probable duplicate.
6. Create the information request for the record missing a project identifier.
7. Select the appropriate classification for the uncertain package.
8. Complete routing only after every required control is satisfied.
9. Review the controlled-library and exception-queue outcomes.
10. Reset before starting the scenario again.

## Validation before release

- Run `python scripts/validate_site.py`.
- Run the relevant Playwright browser tests when dependencies are available.
- Open the case-study page, evidence index, both demonstrations, and every linked proof document.
- Review at desktop and mobile widths.
- Confirm no horizontal overflow, broken links, duplicate IDs, or missing navigation labels.
- Confirm no external network request is made by the demonstration logic.
- Confirm exports contain only synthetic source material and review history.
- Confirm the evidence and privacy standard is linked.
- Confirm no internal chat transcript, drafting instruction, employer-confidential material, or unsupported result claim appears in public content.

## Change control

When changing the proposal schema, review controls, deterministic scenario, export structure, or public positioning:

1. Update the relevant HTML and JavaScript implementation.
2. Update synthetic source or reference output when behavior changes.
3. Update the acceptance-test matrix and automated tests.
4. Re-run validation and browser checks.
5. Review all public wording for internal revision language or unsupported claims.
6. Record the change in repository history.
7. Reassess the maturity label if the demonstrated capability changes materially.

## Known limitations

- State is browser-local and is lost on refresh.
- The public demonstrations do not call an AI model.
- Meeting proposals and document-intake results are deterministic.
- There is no authentication, permission model, durable audit database, or live system integration.
- Automated browser tests validate interface behavior, not production model accuracy or enterprise integration.
- No measured client savings, adoption, or production reliability is claimed.

## Production adaptation checklist

Before adapting either pattern to organizational data:

- identify the approved process owner and system of record
- map current fields, statuses, permissions, and approval authority
- define record retention and deletion
- configure identity and least-privilege access
- select an approved model, connector, or deterministic automation architecture
- add source citations or source-record links
- create a representative test set
- define confidence, exception, and escalation rules
- implement a durable review and audit store
- document publication and routing authority
- test duplicate, ambiguity, malformed input, permission, outage, and retry scenarios
- train end users and administrators
- establish maintenance ownership and review cadence
- measure both saved work and control burden
