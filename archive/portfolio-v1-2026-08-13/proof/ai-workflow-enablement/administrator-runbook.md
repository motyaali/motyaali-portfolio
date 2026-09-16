# AI Workflow Enablement Administrator Runbook

## System purpose

The public case study demonstrates two bounded operating patterns:

1. A Meeting Intelligence coordination workflow that gathers distributed updates, prepares routine information, isolates missing or conflicting items, and produces a client-ready brief, action register, and targeted follow-up request.
2. A Document Intake workflow that prepares routine records, isolates exceptions, and prevents unsafe or incomplete routing.

Both demonstrations use fully synthetic data and browser-local behavior.

## Components

| Component | Path | Purpose |
|---|---|---|
| Case-study page | `ai-workflow-enablement/index.html` | Employer-facing overview and professional relevance |
| Evidence index | `projects/ai-workflow-enablement.html` | Working proof, controls, tests, and limitations |
| Meeting coordination demonstration | `demos/meeting-intelligence.html` | Before-and-after value, contributor status, exception review, and output package |
| Meeting logic | `assets/meeting-intelligence.js` | Fictional updates, deterministic preparation, review state, outputs, and exports |
| Meeting styles | `assets/meeting-intelligence.css` | Coordination-specific layout and output styling |
| Document-intake demonstration | `demos/document-intake.html` | Routine confirmation, exception handling, and controlled routing |
| Document-intake logic | `assets/document-intake.js` | Fictional records, deterministic results, interaction state, and outcomes |
| Shared styles | `assets/proof.css` | Demonstration and evidence interface styles |
| Synthetic coordination inputs | `proof/ai-workflow-enablement/synthetic-meeting-notes.md` | Public reference inputs for the distributed update scenario |
| Reference output | `proof/ai-workflow-enablement/reference-reviewed-record.md` | Expected coordination package after review |
| Acceptance matrix | `proof/ai-workflow-enablement/acceptance-tests.md` | Manual and automated validation coverage |
| Governance boundary | `proof/ai-workflow-enablement/governance-boundary.md` | Authority, data, and production limits |

## Meeting Intelligence operating procedure

1. Open `demos/meeting-intelligence.html`.
2. Confirm the synthetic-data and demonstration-boundary notice is visible.
3. Review the Before and After comparison.
4. Confirm six contributors are represented, with five responses received and one missing.
5. Select **Assemble Team Update**.
6. Review the prepared client brief and action register.
7. Prepare the targeted follow-up for the missing compliance update.
8. Select the working equipment-delivery date after reviewing the conflicting sources.
9. Assign an accountable owner for the Site B access follow-up.
10. Confirm the brief and register update with the reviewed decisions.
11. Select **Finalize Coordination Package**.
12. Review the three outputs and download the Markdown brief or JSON evidence when needed.
13. Reset before beginning the scenario again.

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
- Confirm exports contain only synthetic source material and explicit review decisions.
- Confirm the evidence and privacy standard is linked.
- Confirm no internal chat transcript, drafting instruction, employer-confidential material, or unsupported result claim appears in public content.
- Confirm the primary Meeting Intelligence experience reviews exceptions rather than every routine record.

## Change control

When changing the workflow scenario, review controls, deterministic results, export structure, or public positioning:

1. Update the relevant HTML, JavaScript, and styles.
2. Update synthetic source or reference output when behavior changes.
3. Update the acceptance-test matrix and automated tests.
4. Re-run validation and browser checks.
5. Review all public wording for internal revision language or unsupported claims.
6. Record the change in repository history.
7. Reassess the maturity label if the demonstrated capability changes materially.

## Known limitations

- State is browser-local and is lost on refresh.
- The public demonstrations do not call an AI model.
- Coordination preparation and document-intake results are deterministic.
- There is no authentication, permission model, durable audit database, notification service, or live system integration.
- Automated browser tests validate interface behavior, not production model accuracy or enterprise integration.
- Demonstration counts illustrate interaction design and do not represent measured client savings.

## Production adaptation checklist

Before adapting either pattern to organizational data:

- identify the approved process owner and system of record
- map current inputs, channels, fields, statuses, permissions, and approval authority
- define what can be prepared routinely and what must become an exception
- define record retention and deletion
- configure identity and least-privilege access
- select an approved model, connector, or deterministic automation architecture
- add source citations or source-record links
- create a representative test set
- define confidence, exception, escalation, and response-time rules
- implement a durable review and audit store
- document publication, notification, and routing authority
- test missing response, conflicting source, ambiguity, malformed input, permission, outage, and retry scenarios
- train end users and administrators
- establish maintenance ownership and review cadence
- measure both saved work and control burden
