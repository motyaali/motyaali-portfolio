#!/usr/bin/env python3
"""Validate the public portfolio against its approved copy and claims manifest."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "evidence" / "governance" / "public-claims.json"


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    if not MANIFEST_PATH.is_file():
        fail(f"missing claims manifest: {MANIFEST_PATH.relative_to(ROOT)}")

    try:
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"could not read claims manifest: {exc}")

    if manifest.get("schema_version") != 1:
        fail("unsupported public-claims schema_version")

    governed_pages = manifest.get("governed_pages")
    claims = manifest.get("claims")
    forbidden = manifest.get("global_forbidden_html", [])

    if not isinstance(governed_pages, list) or not governed_pages:
        fail("governed_pages must be a non-empty list")
    if not isinstance(claims, list) or not claims:
        fail("claims must be a non-empty list")
    if not isinstance(forbidden, list):
        fail("global_forbidden_html must be a list")

    page_text: dict[str, str] = {}
    for page in governed_pages:
        if not isinstance(page, str) or not page or page.startswith(("/", "\\")) or ".." in Path(page).parts:
            fail(f"unsafe governed page path: {page!r}")
        path = ROOT / page
        if not path.is_file():
            fail(f"governed page does not exist: {page}")
        page_text[page] = path.read_text(encoding="utf-8")

    ids: set[str] = set()
    for claim in claims:
        if not isinstance(claim, dict):
            fail("every claim must be an object")

        claim_id = claim.get("id")
        page = claim.get("page")
        approved_text = claim.get("approved_text")
        status = claim.get("status")
        maturity = claim.get("maturity")
        evidence_level = claim.get("evidence_level")
        source_basis = claim.get("source_basis")

        if not isinstance(claim_id, str) or not claim_id:
            fail("claim missing id")
        if claim_id in ids:
            fail(f"duplicate claim id: {claim_id}")
        ids.add(claim_id)

        if status != "approved":
            fail(f"claim {claim_id} is not approved")
        if page not in page_text:
            fail(f"claim {claim_id} points to an ungoverned page: {page!r}")
        if not isinstance(approved_text, str) or not approved_text:
            fail(f"claim {claim_id} has no approved_text")
        if approved_text not in page_text[page]:
            fail(f"approved text for {claim_id} is missing from {page}: {approved_text!r}")
        for field_name, field_value in (
            ("maturity", maturity),
            ("evidence_level", evidence_level),
            ("source_basis", source_basis),
        ):
            if not isinstance(field_value, str) or not field_value.strip():
                fail(f"claim {claim_id} has no {field_name}")

    html_files = sorted(ROOT.rglob("*.html"))
    for token in forbidden:
        if not isinstance(token, str) or not token:
            fail("forbidden HTML token must be a non-empty string")
        for html_file in html_files:
            text = html_file.read_text(encoding="utf-8")
            if token in text:
                fail(f"forbidden public wording found in {html_file.relative_to(ROOT)}: {token!r}")

    canonical = manifest.get("canonical_public_implementation")
    if canonical != "motyaali/motyaali-portfolio@main":
        fail("canonical_public_implementation must remain motyaali/motyaali-portfolio@main")

    print(
        "PASS: public claims control "
        f"({len(ids)} approved claims, {len(governed_pages)} governed pages, "
        f"{len(html_files)} HTML files scanned for forbidden wording)"
    )


if __name__ == "__main__":
    main()
