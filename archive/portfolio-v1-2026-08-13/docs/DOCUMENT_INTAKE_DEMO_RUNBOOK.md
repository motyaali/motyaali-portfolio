# Intelligent Document Intake and Routing - Demonstration Runbook

Status: Public demonstration operating document  
Owner: Motya Ali  
Canonical public implementation: `motyaali/motyaali-portfolio@main`  
Demo: `demos/document-intake.html`  
Browser acceptance: `tests/document-intake.spec.mjs`

## 1. Purpose

This runbook explains how to operate, validate, troubleshoot, and maintain the public Intelligent Document Intake and Routing demonstration.

The demonstration is intentionally bounded. It uses six fictional records and deterministic, preconfigured processing results to make the workflow logic inspectable without exposing client information or claiming production AI accuracy.

It demonstrates a control pattern:

1. Preserve the incoming record.
2. Prepare proposed metadata and routing.
3. Separate routine records from exceptions.
4. Require focused human review for uncertain or unsafe items.
5. Route only records that satisfy the required controls.
6. Hold incomplete or unsafe records rather than guessing.
7. Keep the resulting status visible and repeatable.

## 2. Demonstration boundary

The public demonstration does not:

- connect to Microsoft 365, SharePoint, Power Automate, Gmail, Google Drive, or a client repository;
- call a live AI model;
- measure production extraction accuracy;
- send email or external requests;
- modify a real document library;
- represent measured client time or cost savings;
- make autonomous approval, legal, contractual, financial, safety, eligibility, or policy decisions.

All names, organizations, projects, senders, documents, dates, and routing destinations in the demo are fictional.

## 3. Synthetic test set

The canonical public test register is:

`evidence/ai-workflow-enablement/document-intake-synthetic-records.csv`

The six scenarios are:

- three routine known documents;
- one probable duplicate;
- one document missing a required project identifier;
- one package with an uncertain controlling classification.

Do not replace the synthetic records with employer, client, medical, legal, financial, or personally identifying material.

## 4. Normal demonstration sequence

### Step 1 - Open the intake batch

Open `demos/document-intake.html` and confirm that six incoming cards are displayed.

Expected state:

- processing section hidden;
- routing section hidden;
- impact section hidden;
- six fictional incoming documents visible.

### Step 2 - Process the batch

Select **Process Intake Batch**.

Expected state:

- three routine records are prepared;
- three exceptions are isolated;
- **Complete Routing** remains disabled.

### Step 3 - Confirm the routine group

Select **Confirm Routine Routing**.

Expected state:

- the routine group is marked confirmed;
- routing remains blocked because exception controls are still open.

### Step 4 - Resolve the duplicate

Select **Hold Duplicate**.

Expected state:

- the duplicate is held outside the controlled library;
- the original submission remains represented in the intake history;
- the system does not route the probable duplicate.

### Step 5 - Resolve the missing-information case

Select **Create Information Request**.

Expected state:

- the demonstration records that an information request would be prepared;
- the document remains pending;
- the workflow does not invent a project identifier.

### Step 6 - Resolve the classification exception

Select **Confirm Classification** before choosing a classification.

Expected state:

- the control refuses to resolve the record;
- focus moves to the classification selector.

Choose either approved demonstration classification and select **Confirm Classification**.

Expected state:

- the reviewer decision is recorded in browser state;
- all required controls are now satisfied;
- **Complete Routing** becomes enabled.

### Step 7 - Complete the controlled routing

Select **Complete Routing**.

Expected state:

- four records appear in the controlled-library result;
- two records remain safely held in the exception queue;
- the impact summary shows six received, four routed, two held, one routine batch confirmation, and three targeted exception decisions.

### Step 8 - Reset

Select **Reset**.

Expected state:

- processing, routing, and impact sections return to hidden;
- the six-document initial condition is restored;
- the demonstration can be repeated without retained prior decisions.

## 5. Automated validation

The acceptance matrix is:

`evidence/ai-workflow-enablement/document-intake-acceptance.csv`

The executable browser suite is:

`tests/document-intake.spec.mjs`

The portfolio CI runs the demonstration across the Playwright projects configured in `playwright.config.mjs`, including desktop, tablet, and mobile browser profiles.

The suite verifies:

- six-record clean start;
- routine and exception counts;
- routing gate behavior;
- routine batch confirmation;
- duplicate hold;
- missing-information handling;
- mandatory classification selection;
- controlled outcome;
- reset behavior;
- public boundary language;
- responsive layout and mobile navigation.

A controlled-outcome screenshot is attached to the Playwright report during the primary end-to-end test.

## 6. Troubleshooting

### No incoming records appear

Check that `assets/document-intake.js` loads successfully and that the page contains `#incoming-grid`.

### Process Intake Batch does nothing

Confirm that the page contains the expected IDs used by the JavaScript control layer:

- `process-batch`
- `processing-section`
- `routing-section`
- `routine-list`
- `exception-list`

Then run the Playwright suite before editing the production page.

### Complete Routing never becomes enabled

All four required control states must be satisfied:

- routine group confirmed;
- duplicate resolved;
- missing-information case resolved;
- classification explicitly selected and confirmed.

This is intentional. Do not bypass the gate to make the demo appear faster.

### Reset does not restore the initial state

Run `tests/document-intake.spec.mjs`. The reset test must pass before merge.

### Layout overflows on mobile

Run the full Playwright matrix. Do not solve a small-screen issue by hiding evidence or removing control text. Adjust responsive CSS while retaining the same operating information.

## 7. Change control

Any change to the demonstration must update the related proof artifacts when applicable:

- `demos/document-intake.html`
- `assets/document-intake.js`
- `tests/document-intake.spec.mjs`
- `evidence/ai-workflow-enablement/document-intake-synthetic-records.csv`
- `evidence/ai-workflow-enablement/document-intake-acceptance.csv`
- `evidence/ai-workflow-enablement/document-intake-proof.json`
- `evidence/ai-workflow-enablement/document-intake-proof.html`

A change must not be merged if it weakens the public maturity boundary, removes human-review gates, introduces confidential data, or causes portfolio validation to fail.

## 8. Production adaptation checklist

A real client implementation would require a separate approved design that establishes, at minimum:

- authoritative repository and record ownership;
- approved document types and metadata schema;
- routing rules and destination permissions;
- duplicate-detection method;
- confidence or quality thresholds;
- exception queues and responsible reviewers;
- role-based access;
- retention and records requirements;
- audit history;
- connector and service-account security;
- failure and retry behavior;
- monitoring and support ownership;
- baseline measurements;
- acceptance criteria;
- user and administrator training;
- scale, revise, or stop decision after the pilot.

The public demonstration is evidence of the workflow design and control logic. It is not a substitute for those implementation decisions.
