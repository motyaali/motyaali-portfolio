# Browser Validation

Run the complete browser suite with:

```bash
npm run test:browser
```

The portfolio evidence tests verify:

- key public pages load without failed local resources
- four homepage role pathways lead to specific evidence
- the résumé PDF is available as a valid PDF response
- navigation is presented in employer-first order
- six featured projects and three secondary systems links keep Work curated; V1 retains the complete pre-redesign presentation
- Meeting Intelligence assembles distributed updates, isolates exceptions, produces controlled outputs, and supports evidence downloads
- Document Intake starts with six synthetic records, separates routine work from exceptions, enforces human-review gates, produces the controlled four-routed/two-held outcome, resets cleanly, preserves its public claim boundary, and remains usable across configured desktop, tablet, and mobile browser profiles
- AI Workflow Enablement leads with five direct demos, contribution, supporting evidence, and explicit limitations; Services and its print-ready overview preserve all four engagement packages and commercial validation gaps
- the Workflow Discovery Worksheet builds a recurring-process brief locally in the browser, prevents form submission to a server, prepares an explicit mailto action only after the user builds the brief, and resets cleanly
- service, case-study, evidence, overview, discovery, and contact surfaces do not overflow the configured viewport
- all active primary navigation works without JavaScript in the same order, including nested evidence pages
- featured artifact covers render without JavaScript and visibly identify synthetic or representative evidence
- each hub demo entry reaches its preloaded first interaction and can return to the workflow family

The configured browser projects are desktop Chromium, desktop WebKit, tablet WebKit, and mobile WebKit. The WebKit mobile profiles emulate viewports and input behavior; they are not physical-device testing.

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
