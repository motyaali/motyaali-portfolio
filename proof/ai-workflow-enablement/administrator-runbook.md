# Meeting Intelligence MVP Administrator Runbook

## System purpose

The public MVP demonstrates a source-preserving, human-reviewed workflow for converting meeting material into structured operating records.

## Components

| Component | Path | Purpose |
|---|---|---|
| Demonstration page | `demos/meeting-intelligence.html` | User interface for source, review, and publication |
| Demonstration logic | `assets/meeting-intelligence.js` | Synthetic proposals, review state, history, and exports |
| Demonstration styles | `assets/proof.css` | Proof and review interface styles |
| Synthetic source | `proof/ai-workflow-enablement/synthetic-meeting-notes.md` | Public test input |
| Reference output | `proof/ai-workflow-enablement/reference-reviewed-record.md` | Expected reviewed result |
| Acceptance tests | `proof/ai-workflow-enablement/acceptance-tests.md` | Manual validation matrix |
| Governance boundary | `proof/ai-workflow-enablement/governance-boundary.md` | Authority and data limits |

## Normal operating procedure

1. Open the public demonstration.
2. Confirm the synthetic-source disclosure is visible.
3. Select **Load Proposed Records**.
4. Compare each proposal to the source.
5. Correct statement, owner, due date, or review notes as needed.
6. Approve, reject, or leave each proposal pending.
7. Select **Generate Reviewed Record**.
8. Verify only approved records appear in the approved section.
9. Download JSON evidence and Markdown record when needed.
10. Reset the demonstration before beginning a new review.

## Validation before release

- Open the page in a current desktop browser.
- Open the page at a mobile width.
- Complete tests T01 through T17 in `acceptance-tests.md`.
- Confirm no external network request is made by the MVP logic.
- Confirm downloads contain synthetic source and review history.
- Confirm all relative links resolve on GitHub Pages and the custom domain.
- Confirm the evidence and privacy standard is linked.

## Change control

When changing the proposal schema, review controls, or export structure:

1. Update the JavaScript implementation.
2. Update the reference output.
3. Update the acceptance-test matrix.
4. Re-run all manual tests.
5. Record the change in repository history.
6. Reassess the maturity label if the public capability changes materially.

## Known limitations

- State is browser-local and is lost on refresh.
- The public version does not call an AI model.
- Proposals are fixed for one synthetic meeting.
- There is no authentication, permission model, server log, or integration.
- Manual tests are documented but not yet automated end-to-end tests.

## Production migration checklist

Before adapting this workflow to client data:

- identify the approved source system
- define record retention and deletion
- configure identity and least-privilege access
- select an approved model and connector architecture
- add source citations or source-record links
- create a representative test set
- define confidence and escalation rules
- implement a durable review and audit store
- document publication authority
- test duplicate, ambiguous, permission, outage, and malformed-input scenarios
- train end users and administrators
- establish operational ownership and review cadence
