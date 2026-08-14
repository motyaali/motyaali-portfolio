# Motya Ali Portfolio

[![Validate portfolio](https://github.com/motyaali/motyaali-portfolio/actions/workflows/validate-site.yml/badge.svg)](https://github.com/motyaali/motyaali-portfolio/actions/workflows/validate-site.yml)

Public site: **https://www.motyaali.com/**

A static, accessible professional portfolio focused on operations, business systems, planning, workflow implementation, documentation, and governed human-centered AI.

## What this repository proves

This repository contains more than positioning copy. It publishes:

- working AI Workflow Enablement demonstrations for Meeting Intelligence and Document Intake
- synthetic source material and reference outputs
- acceptance tests and governance boundaries
- project maturity labels and evidence rules
- professional and independent applied case studies using sanitized, synthetic, or reconstructed evidence where needed
- an immediately accessible print-ready résumé
- the source and deployment history for the public portfolio

## Start here

| Area | Purpose |
|---|---|
| [`index.html`](index.html) | Employer and organization pathways, flagship proof, and professional foundation |
| [`work.html`](work.html) | Project library organized by evidence strength and maturity |
| [`services.html`](services.html) | AI Workflow Enablement service and controlled-pilot boundary |
| [`ai-workflow-enablement/index.html`](ai-workflow-enablement/index.html) | Employer-facing applied case study |
| [`projects/ai-workflow-enablement.html`](projects/ai-workflow-enablement.html) | Full evidence index |
| [`demos/meeting-intelligence.html`](demos/meeting-intelligence.html) | Source-preserving meeting-record review, correction, approval, rejection, and export |
| [`demos/document-intake.html`](demos/document-intake.html) | Guided routine-confirmation and exception-routing demonstration |
| [`proof/ai-workflow-enablement/`](proof/ai-workflow-enablement/) | Synthetic source, reference output, tests, governance, and runbook |
| [`evidence-standard.html`](evidence-standard.html) | Public maturity, claim, evidence, and privacy standard |
| [`resume-print.html`](resume-print.html) | Full print-ready résumé with Save as PDF support |

## Site architecture

The site intentionally uses a small static stack:

- semantic HTML
- shared CSS in `assets/styles.css`
- proof and demonstration CSS in `assets/proof.css`
- shared navigation and contact behavior in `assets/site.js`
- browser-local demonstration logic in `assets/meeting-intelligence.js` and `assets/document-intake.js`
- GitHub Pages deployment with the `www.motyaali.com` custom domain

The public demonstrations do not require a server, account, database, or external AI request. This makes the governance interaction inspectable and keeps all public demonstration data synthetic.

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

A local web server is recommended because relative links and browser download behavior should be validated in the same way they operate on GitHub Pages.

## Validate the site

Run the repository validator:

```bash
python scripts/validate_site.py
```

The validator checks:

- internal links and referenced files
- required page title, language, viewport, and primary heading
- duplicate element IDs
- image alternative text when images are added
- public file paths used by the sitemap

GitHub Actions runs the same validation on pushes and pull requests.

## Evidence and privacy rules

- Do not upload private archives, credentials, employer-confidential files, proprietary datasets, or personal medical, legal, housing, benefits, financial, or identifying records.
- Preserve the maturity labels used throughout the site.
- Use synthetic, sanitized, reconstructed, or representative examples when original materials cannot be shared.
- Separate implemented behavior from proposed behavior.
- Separate measured outcomes from expected benefits.
- Publish limitations and next validation steps beside major claims.
- Treat accidental disclosure of sensitive information as a release-blocking defect.

See [`evidence-standard.html`](evidence-standard.html) and [`docs/PORTFOLIO_RED_TEAM_RELEASE_PLAN.md`](docs/PORTFOLIO_RED_TEAM_RELEASE_PLAN.md).

## AI Workflow Enablement public demonstration boundary

The public demonstrations prove:

- source-preserving review
- structured proposals and deterministic reference behavior
- approve, edit, reject, hold, classify, and route controls
- human-only final authority
- correction and review history
- JSON and Markdown evidence export for the Meeting Intelligence prototype
- routine batch confirmation and targeted exception handling for Document Intake

They do not establish:

- production AI extraction accuracy
- organizational system integration
- compliance with a client's policies
- measured time savings or adoption
- autonomous authority to assign, approve, publish, pay, delete, or make consequential decisions

## Deployment

GitHub Pages publishes from the `main` branch. The [`CNAME`](CNAME) file configures `www.motyaali.com`.

Before a release:

1. Run `python scripts/validate_site.py`.
2. Open the homepage, Work page, Services page, résumé, and main demonstrations on desktop and mobile widths.
3. Complete the documented acceptance tests.
4. Confirm no private, confidential, internal-chat, or drafting material is present.
5. Confirm project maturity labels and limitations remain accurate.
6. Confirm the custom domain and HTTPS deployment are healthy.

## Status

**Portfolio evidence and quality review active, August 2026.**
