# Screenshot-driven portfolio review — October 25, 2026

## Scope and source

Four user-supplied screenshots of the newly published portfolio were reviewed after release commit `12a0ffcc01bb2924ca1cc66626de7eb597953b90`. This is an initial, concrete review for the later Anti-Slop **After** audit, not a claim that the complete site has been visually audited. The screenshots are user feedback; do not add them to the public repository because they are conversation attachments.

## Findings and dispositions

| Priority | Observation | Cause in code | Proposed correction | Verification |
| --- | --- | --- | --- | --- |
| P1 | Featured full-width cards have a split divider offset from the center of the two-column grid | `assets/editorial.css` uses `1.12fr 1fr` for lead and final cards, while neighboring cards use equal columns | Use equal columns for split cards | Browser geometry check at desktop width |
| P1 | Career File claims read like static declarations, not navigable evidence | Four text-only `.field-note-row` entries in `index.html` | Add named public evidence and demo links under each claim; expose a real heading | Link-target checks, keyboard focus, and mobile review |
| P1 | Work page has a large empty transition after its introduction | Page-hero bottom padding plus featured-section top padding stack | Reduce only the Work page transition and make the featured-case introduction more useful | Browser spacing check and review captures |
| P2 | SOMA Budget Planner full-width card's split does not line up with the grid above | Same asymmetric split rule as the lead card | Use the same centered divider and preserve both links | Browser geometry check |
| P2 / further review | SharePoint diagram preview has substantial white space below its internal content | The thumbnail is stretched to the full height of the project-cover panel | Review after desktop/mobile captures; avoid a speculative global thumbnail override | Manual visual comparison before merge |

## Evidence boundaries

- The Career File links go to public project case studies, public work samples, or working browser demonstrations. They are **not** independent verification of confidential employer records.
- Public reconstructions and synthetic demos must remain clearly distinguished from original employer systems.
- Do not publish private SFPUC or employer material to satisfy a visual proof requirement.

## Acceptance criteria

1. Lead and final split cards align their divider with the center of the grid at desktop widths.
2. Every Career File claim has at least two descriptive, keyboard-accessible public evidence links; every target resolves.
3. The Work hero flows into the featured cases without a large unexplained blank band; the introduction distinguishes professional work from independent software.
4. No horizontal overflow on mobile or tablet; existing demonstrations, case links, and project content remain unchanged.
5. Existing site, public-claims, proof-pack, offer-conversion, and Playwright browser tests pass.
6. Before any merge, review updated desktop and mobile captures. A passing structural test does not establish that visual balance is perfect.

## Release control

All changes remain on `review/visual-alignment-evidence-links-2026-10-25` until reviewed. This work uses the screenshot observations as explicit acceptance criteria. It does not install the third-party Anti-Slop skill package or change the site's design direction.
