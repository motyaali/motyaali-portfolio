# AI Workflow Enablement Acceptance Tests

**Primary demonstration:** Meeting Intelligence Coordination Demonstration  
**Data:** Fully synthetic  
**Execution:** Browser-local interaction with automated Playwright coverage and a documented manual review procedure

| ID | Scenario | Expected result | Current coverage |
|---|---|---|---|
| T01 | Open the demonstration | The page leads with the outcome: scattered team updates become one client-ready brief | Automated |
| T02 | Before-and-after value | The page shows the manual coordination burden and the exception-focused future state before any controls | Automated |
| T03 | Contributor intake | Six fictional contributors are visible, with five responses received and one missing | Automated |
| T04 | Assemble update | The workflow prepares received information and identifies exactly three review exceptions | Automated |
| T05 | Missing response | The compliance status remains missing and a targeted follow-up is prepared instead of inventing an answer | Automated |
| T06 | Conflicting date | The August 12 and August 14 delivery dates remain unresolved until a reviewer selects a working date | Automated |
| T07 | Missing owner | Site B access remains unassigned until a reviewer selects an accountable coordination owner | Automated |
| T08 | Release protection | Finalization remains disabled until all three exceptions have an accountable next step | Automated |
| T09 | Draft brief | The prepared brief combines progress, attention items, and next steps while visibly marking unresolved exceptions | Automated + manual review |
| T10 | Action register | Routine actions are prepared together and exception-dependent rows update after review | Automated + manual review |
| T11 | Final package | One review produces a client-ready brief, action and exception register, and targeted follow-up request | Automated |
| T12 | Markdown export | The coordination brief retains the selected date, assigned owner, pending compliance request, actions, and synthetic-data boundary | Automated |
| T13 | JSON evidence export | The evidence records inputs, demonstration counts, exception decisions, and generated outputs | Automated |
| T14 | Claim boundary | The page labels counts as illustrative and does not claim measured client savings, production AI accuracy, or live integration | Automated content check |
| T15 | Internal-text boundary | The public page contains no drafting instructions, chat transcript, revision notes, or obsolete MVP language | Automated content check + editorial review |
| T16 | Reset | Reset clears the assembled and finalized state | Manual review |
| T17 | Responsive layout | The demonstration fits supported viewports and exposes accessible mobile navigation | Automated |

## Manual validation procedure

1. Open `demos/meeting-intelligence.html`.
2. Confirm the headline states the resulting outcome before the interface begins.
3. Confirm the Before and After cards explain what work is replaced.
4. Confirm six contributor cards appear, five as received and one as missing.
5. Select **Assemble Team Update**.
6. Confirm the draft brief, action register, and three exception cards appear.
7. Confirm the package cannot be finalized yet.
8. Prepare the targeted compliance follow-up.
9. Select one working equipment-delivery date.
10. Assign one Site B access coordination owner.
11. Confirm the draft brief and action register update with the reviewed decisions.
12. Finalize the coordination package.
13. Confirm three outputs appear: client brief, action and exception register, and targeted follow-up request.
14. Download the Markdown brief and JSON evidence.
15. Confirm the exports contain only fictional source material and the selected review decisions.
16. Reset and confirm the assembled sections are hidden.
17. Review at desktop and mobile widths and confirm no horizontal page overflow.

## Document-intake demonstration checks

The separate `demos/document-intake.html` scenario should also be reviewed for:

- three routine records prepared for group confirmation
- one probable duplicate held outside the controlled library
- one missing-project case converted into a specific information request
- one uncertain classification requiring a targeted decision
- controlled routing only after routine confirmation and exception resolution
- clear disclosure that the data and processing results are fictional and preconfigured

## Limitations of this validation

These checks validate the public interface, deterministic reference data, exception behavior, exports, responsive layout, and stated governance boundaries. They do not validate a production language model, live connector, identity provider, task or records platform, security configuration, organizational policy, client data, adoption, or measured operational savings.
