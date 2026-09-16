# Recruiter-first V2 review

This completes the existing redesign in PR #15 on `redesign/recruiter-first-v2`. The homepage directs hiring teams to Work, the résumé, and four role pathways. Work remains curated to six featured projects with three secondary systems links.

## What changed

- Every active primary navigation uses Work, Résumé, About, Services, Contact, with the brand linking home. Nested proof and evidence pages include the same mobile menu. Navigation is authored in HTML; the shared script no longer reorders it into V1 order.
- AI Workflow Enablement opens with five preloaded demos and their reviewable outputs, followed by contribution, evidence, tests, and limits. Commercial engagement details remain secondary, with Services as the main offer surface.
- Home and Work embed the existing artifact preview designs directly in HTML, with visible synthetic, reconstructed, or representative labels. They no longer rely on JavaScript to replace initials.
- Featured case studies put contribution, the first evidence to inspect, and limitations near the top. Documentation and Canonical Synthesis link directly to inspectable records. SmartGrocer explains that its public interface is a representative preview, not an invitation to a public production application.
- Demo links reach the preloaded first interaction before the longer before/after explanation. State transitions scroll immediately with space for the sticky header, and Reset returns to the first interaction. Human-review gates, outputs, reset state, source records, and decision logic remain unchanged.
- Services preserves the four governed packages and exposes direct proof links. The discovery worksheet remains a second-stage, browser-local utility.

## Claims and evidence

The claims manifest and its companion documentation now match V2's existing homepage and Services positioning. Only the three positioning entries changed. Professional metrics, maturity classifications, confidential-source boundaries, proof manifests, synthetic record registers, acceptance matrices, and commercial non-claims remain unchanged.

The public demonstrations establish deterministic workflow behavior, not production model accuracy, enterprise integration, measured organizational savings, client deployment, or autonomous decision authority. Employer and client source materials remain private.

## Archive protection

The in-site archive at `archive/portfolio-v1-2026-08-13/` is unchanged from the starting PR head `9386a06f5e4f2cb05086b3187b478f5fbcf00bb3`. Its Git tree remains `74b2ed3b886ed6e6b25fb75fd22177dbf4596948`. The archive branch is not modified.

## Validation

Local release validation on September 13, 2026 passed: 92 HTML pages; 40 approved claims across 21 governed pages; 4 proof packs referencing 33 artifacts; 4 offer packages, 26 public assets, and 8 preserved commercial validation gaps; and all 224 browser tests across the four configured projects. Nine additional mobile reset regression runs passed after the scrolling fix. Whitespace and archive-diff checks also passed.

The full checks are reproducible using the commands in the repository README and the existing GitHub Actions workflow. GitHub validation is linked from the PR.

The browser suite includes all five demonstrations, review gates and resets, downloads, proof packs, discovery privacy, direct service/demo links, résumé availability, role pathways, archived V1, navigation with JavaScript disabled, artifact covers with JavaScript disabled, and viewport/mobile-menu behavior across desktop Chromium and desktop/tablet/mobile WebKit.

Browser profiles emulate devices; no physical-device or live organizational-pilot validation is claimed. The local desktop runtime required a separately started HTTP server to avoid a Windows server-shutdown hang; tests used the unchanged Playwright configuration's existing-server support.

## Final review path

1. Home → a role pathway → featured case → artifact.
2. Work → AI Workflow Enablement → a demo → review exceptions → inspect output.
3. A nested proof page → mobile menu → Work or résumé.
4. Services → direct conversation or working evidence; process brief only when useful.
5. Compare archived V1 with the unchanged snapshot.

The PR is prepared for review; merging publishes V2 through the repository's existing main-branch deployment.
