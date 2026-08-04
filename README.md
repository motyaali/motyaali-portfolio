# Motya Ali Portfolio

[![Validate portfolio](https://github.com/motyaali/motyaali-portfolio/actions/workflows/validate-site.yml/badge.svg)](https://github.com/motyaali/motyaali-portfolio/actions/workflows/validate-site.yml)

Public site: **https://www.motyaali.com/**

A static, accessible professional portfolio focused on operations, business systems, planning, workflow implementation, documentation, and governed human-centered AI.

## What this repository proves

This repository contains more than positioning copy. It publishes:

- a working AI Workflow Enablement meeting-intelligence MVP
- synthetic source material and reference outputs
- acceptance tests and governance boundaries
- project maturity labels and evidence rules
- professional case studies using sanitized or reconstructed evidence where needed
- an immediately accessible print-ready résumé
- the source and deployment history for the public portfolio

## Start here

| Area | Purpose |
|---|---|
| [`index.html`](index.html) | Employer and organization pathways, flagship proof, and professional foundation |
| [`work.html`](work.html) | Project library organized by evidence strength and maturity |
| [`services.html`](services.html) | AI Workflow Enablement offer and controlled-pilot boundary |
| [`projects/ai-workflow-enablement.html`](projects/ai-workflow-enablement.html) | Proof-first MVP case study |
| [`demos/meeting-intelligence.html`](demos/meeting-intelligence.html) | Interactive review, correction, publication, and export demonstration |
| [`proof/ai-workflow-enablement/`](proof/ai-workflow-enablement/) | Synthetic source, reference output, tests, governance, and runbook |
| [`evidence-standard.html`](evidence-standard.html) | Public maturity, claim, evidence, and privacy standard |
| [`resume-print.html`](resume-print.html) | Full print-ready résumé with Save as PDF support |

## Site architecture

The site intentionally uses a small static stack:

- semantic HTML
- shared CSS in `assets/styles.css`
- proof and demonstration CSS in `assets/proof.css`
- shared navigation and contact behavior in `assets/site.js`
- browser-local MVP logic in `assets/meeting-intelligence.js`
- GitHub Pages deployment with the `www.motyaali.com` custom domain

The public MVP does not require a server, account, database, or external AI request. This makes the governance interaction inspectable and keeps all public demonstration data synthetic.

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

## AI Workflow Enablement MVP boundary

The public Meeting Intelligence MVP proves:

- source-preserving review
- structured proposals
- approve, edit, and reject controls
- human-only publication
- correction and review history
- JSON and Markdown evidence export

It does not establish:

- production AI extraction accuracy
- organizational system integration
- compliance with a client's policies
- measured time savings or adoption
- autonomous authority to assign, approve, or publish work

## Deployment

GitHub Pages publishes from the `main` branch. The [`CNAME`](CNAME) file configures `www.motyaali.com`.

Before a release:

1. Run `python scripts/validate_site.py`.
2. Open the homepage, Work page, Services page, résumé, and MVP on desktop and mobile widths.
3. Complete the MVP manual tests in `proof/ai-workflow-enablement/acceptance-tests.md`.
4. Confirm no private or confidential material is present.
5. Confirm project maturity labels and limitations remain accurate.
6. Confirm the custom domain and HTTPS deployment are healthy.

## Status

**Portfolio Red Team evidence release in progress, August 2026.**
