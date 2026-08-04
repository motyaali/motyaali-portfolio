# AI Workflow Enablement MVP Acceptance Tests

**Workflow:** Meeting Intelligence Review Queue  
**Version:** 0.1.0 public MVP  
**Data:** Synthetic only

| ID | Scenario | Expected result | MVP status |
|---|---|---|---|
| T01 | Load the public demonstration | The synthetic meeting remains visible and ten proposed records load in pending status | Pass by implementation |
| T02 | Explicit decision | The naming-source decision is proposed as a decision and cites its source paragraph | Pass by reference data |
| T03 | Action with owner and date | Priya's register-cleanup action includes Priya Shah and August 6, 2026 | Pass by reference data |
| T04 | Missing date | Dana's review action leaves the due date blank rather than inventing one | Pass by reference data |
| T05 | Dependency | Marco's environment configuration records its approval and documentation dependencies | Pass by reference data |
| T06 | Temporary rule | The document ID rule is described as temporary and does not claim permanent records authority | Pass by reference data |
| T07 | Missing owner | The risk record and UAT-script question remain unassigned | Pass by reference data |
| T08 | Human-only boundary | Final publication and permanent record status appear as a control, not an automated action | Pass by reference data |
| T09 | Approve | Selecting Approve changes one proposal to approved and records the review event | Pass by implementation |
| T10 | Reject | Selecting Reject excludes the proposal from the published record and retains it in review history | Pass by implementation |
| T11 | Edit | Changing statement, owner, or due date records an edit event and uses the corrected value in export | Pass by implementation |
| T12 | Pending protection | Pending proposals are not included as approved published records | Pass by implementation |
| T13 | JSON evidence export | Export includes source, proposal method, status, corrections, and review history | Pass by implementation |
| T14 | Markdown operating record | Export includes only approved records in the approved section and lists rejected or pending proposals separately | Pass by implementation |
| T15 | Reset | Reset removes the loaded review state and disables exports | Pass by implementation |
| T16 | Public data boundary | The page states that source and proposals are synthetic and deterministic | Pass by implementation |
| T17 | Production-claim boundary | The page does not claim model accuracy, systems integration, measured savings, or autonomous authority | Pass by content review |

## Manual validation procedure

1. Open `demos/meeting-intelligence.html`.
2. Confirm the source meeting is visible before proposals are loaded.
3. Load proposed records.
4. Approve `DEC-001` and `ACT-001`.
5. Edit the owner on one record and verify the history is recorded in the JSON export.
6. Reject one proposal.
7. Leave one proposal pending.
8. Generate the reviewed record.
9. Verify that only approved records appear in the approved section.
10. Download JSON and Markdown evidence.
11. Reset the demo and confirm exports are disabled.

## Limitations of this test matrix

These tests validate the public workflow implementation and reference data. They do not validate a production language model, connector, identity provider, record system, task platform, security configuration, or organizational policy.
