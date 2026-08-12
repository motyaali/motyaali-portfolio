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

## Document Intake proof-pack gate

The browser suite is only one part of the Pass 4 control layer. CI also runs:

```bash
python scripts/validate_proof_packs.py
```

That validator confirms the machine-readable Document Intake proof manifest, synthetic test register, acceptance matrix, executable browser spec, public case-study page, runbook, demo script, and referenced artifacts remain present and internally consistent.
