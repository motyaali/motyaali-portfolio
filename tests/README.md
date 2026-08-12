# Browser Validation

Run the complete browser suite with:

```bash
npm run test:browser
```

The portfolio evidence tests verify:

- key public pages load without failed local resources
- all five homepage capability cards lead to specific evidence
- the résumé PDF is available as a valid PDF response
- navigation is presented in employer-first order
- the Concept Lab remains on the Work page
- Meeting Intelligence assembles distributed updates, isolates exceptions, produces controlled outputs, and supports evidence downloads
- Document Intake starts with six synthetic records, separates routine work from exceptions, enforces human-review gates, produces the controlled four-routed/two-held outcome, resets cleanly, preserves its public claim boundary, and remains usable across configured desktop, tablet, and mobile browser profiles
- AI Workflow Enablement exposes all four engagement packages, separates employer and organization evaluation paths, publishes a print-ready one-page overview, and preserves its commercial validation gaps
- the Workflow Discovery Worksheet builds a recurring-process brief locally in the browser, prevents form submission to a server, prepares an explicit mailto action only after the user builds the brief, and resets cleanly
- the Pass 5 service, case-study, overview, discovery, and contact surfaces do not overflow the configured viewport

## Document Intake proof-pack gate

CI runs:

```bash
python scripts/validate_proof_packs.py
```

That validator confirms the machine-readable Document Intake proof manifest, synthetic test register, acceptance matrix, executable browser spec, public case-study page, runbook, demo script, and referenced artifacts remain present and internally consistent.

## AI Workflow Enablement offer-conversion gate

CI also runs:

```bash
python scripts/validate_offer_conversion.py
```

That validator protects the Pass 5 commercial packaging from drift by confirming:

- the four engagement packages remain Workflow Diagnostic, Controlled Pilot, Full Implementation & Enablement, and Optimization & Support
- the primary first engagement remains the Controlled Pilot
- the pilot remains bounded to one recurring process and one business unit with approximately 5 to 20 users
- every public offer, proof, qualification, messaging, and browser-test asset referenced by the manifest still exists
- the unresolved pricing, licensing, service-term, insurance/risk, support-economics, and credential-separation items remain explicitly marked as unvalidated
- the discovery worksheet keeps its local-browser privacy boundary and does not introduce fetch/XHR transmission
