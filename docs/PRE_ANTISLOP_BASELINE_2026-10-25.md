# Pre-Anti-Slop portfolio baseline — October 25, 2026

## Source reconciliation

- Baseline: `main` at `9a6057993a9eeb8b8f334245e1fef7199a83f933` (October 14 release).
- Open historical PR #16 (`portfolio-enterprise-proof-2026-09-18`) diverged from `main`. Its commit-ahead count is not a count of missing published features.
- Direct file comparison confirmed that `projects/soma-budget-planner.html` and `projects/career-evidence-system.html` are **already published in `main`** with updated editorial presentation. Their existing project demos, navigation, and links are retained.
- Existing retail systems evidence and current project library are retained. No historical branch was merged wholesale.

## October 16 SharePoint role clarification

The public SFPUC Water Capital Program case now distinguishes:

1. Co-design and implementation of the new SharePoint site-level document-control workflow with two consultants.
2. Transition to sole day-to-day **site-level** administration after consultant handoff, including grants, changes, revocations, roster reconciliation, and user support for a 268+ user population.
3. Personal migration and reconciliation of legacy records, metadata and version controls, archival of superseded copies, and publication of final locked or status-approved records.
4. Five role-specific DQR guides, broader workflow/SOP guidance, process mapping, and training.
5. Clear boundaries: Microsoft 365 tenant administration remained with IT; program approvals remained with designated owners; Water and Wastewater work are not conflated.

These details reflect Ali's firsthand clarification. Employer records and client materials remain private. Public diagrams and browser demos are reconstructed/synthetic and do not imply access to a live SFPUC system. No unverified automation deployment, savings, or tenant-level authority is claimed.

## Release scope

- Updated: `projects/documentation-workflow.html`, `index.html`, `work.html`, `evidence/governance/public-claims.json`.
- Unchanged: SOMA and Career Evidence case-study pages, existing demos, site navigation structure, shared CSS, and other professional cases.
- Run the existing static, claims, proof-pack, offer-conversion, and browser validation workflow before merging.
- Anti-Slop should start from the **new published `main`**, not from PR #16 or any older redesign branch.
