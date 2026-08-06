# AI Workflow Enablement Acceptance Tests

**Primary control prototype:** Meeting Intelligence Review Prototype  
**Data:** Fully synthetic  
**Execution:** Browser-local demonstration with automated Playwright coverage and a documented manual review procedure

| ID | Scenario | Expected result | Current coverage |
|---|---|---|---|
| T01 | Load the public prototype | The fictional meeting is visible and ten proposed records can be loaded in pending status | Automated |
| T02 | Explicit decision | The naming-source decision is proposed as a decision and cites its source paragraph | Automated |
| T03 | Action with owner and date | Priya's register-cleanup action includes Priya Shah and August 6, 2026 | Automated |
| T04 | Missing date | Dana's review action leaves the due date blank rather than inventing one | Automated |
| T05 | Dependency | Marco's environment-configuration action retains its approval and documentation dependencies | Reference data + manual review |
| T06 | Temporary rule | The document ID rule is labeled temporary and does not claim permanent records authority | Reference data + manual review |
| T07 | Missing owner | The risk and UAT-script question remain unassigned until a reviewer provides an owner | Automated |
| T08 | Human-only boundary | Final publication and permanent-record status appear as a control, not an automated action | Automated |
| T09 | Approve | Selecting Approve changes one proposal to approved and records the review event | Automated |
| T10 | Reject | Selecting Reject excludes the proposal from the approved section and retains the event in review history | Automated |
| T11 | Edit | Changing statement, owner, or due date records an edit event and uses the corrected value in export | Automated |
| T12 | Pending protection | Pending proposals are not presented as approved records | Automated |
| T13 | JSON evidence export | Export includes source, proposal method, statuses, corrections, and review history | Automated |
| T14 | Markdown operating record | Export separates approved records from rejected and pending proposals | Automated |
| T15 | Reset | Reset removes the loaded review state and disables exports | Automated |
| T16 | Public data boundary | The page states that the meeting and proposals are synthetic and deterministic | Automated content check |
| T17 | Production-claim boundary | The page does not claim production AI accuracy, enterprise integration, measured savings, or autonomous authority | Automated content check |
| T18 | Responsive layout | The prototype fits supported viewports and exposes accessible mobile navigation | Automated |

## Manual validation procedure

1. Open `demos/meeting-intelligence.html`.
2. Confirm the synthetic-data and prototype-boundary notice is visible.
3. Confirm the source meeting is visible before proposals are loaded.
4. Select **Load Proposed Records** and confirm ten proposal cards appear.
5. Verify at least one record has a missing date and at least one has a missing owner.
6. Edit one owner or due date.
7. Approve one proposal, reject one proposal, and leave one pending.
8. Generate the reviewed record.
9. Confirm only approved records appear in the approved section.
10. Download the JSON and Markdown evidence and verify that edits, rejected items, pending items, source material, and review history are retained.
11. Reset the prototype and confirm exports are disabled.
12. Review at desktop and mobile widths and confirm no horizontal overflow.

## Document-intake demonstration checks

The separate `demos/document-intake.html` scenario should also be reviewed for:

- three routine records prepared for group confirmation
- one probable duplicate held outside the controlled library
- one missing-project case converted into a specific information request
- one uncertain classification requiring a targeted decision
- controlled routing only after routine confirmation and exception resolution
- clear disclosure that the data and processing results are fictional and preconfigured

## Limitations of this validation

These checks validate the public interface, deterministic reference data, review behavior, exports, responsive layout, and stated governance boundaries. They do not validate a production language model, live connector, identity provider, records platform, security configuration, organizational policy, client data, or measured operational outcome.
