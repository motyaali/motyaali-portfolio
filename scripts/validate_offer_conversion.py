#!/usr/bin/env python3
"""Validate the AI Workflow Enablement offer-conversion manifest and public assets."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "evidence" / "ai-workflow-enablement" / "offer-conversion.json"
CANONICAL = "motyaali/motyaali-portfolio@main"
EXPECTED_PACKAGES = [
    "Workflow Diagnostic",
    "Controlled Pilot",
    "Full Implementation & Enablement",
    "Optimization & Support",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def repo_path(value: object, context: str) -> Path:
    if not isinstance(value, str) or not value.strip():
        fail(f"{context}: expected a non-empty repository path")
    path = Path(value)
    if path.is_absolute() or ".." in path.parts:
        fail(f"{context}: unsafe repository path {value!r}")
    return ROOT / path


def main() -> None:
    if not MANIFEST.is_file():
        fail(f"missing offer manifest: {MANIFEST.relative_to(ROOT)}")

    try:
        data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"could not read offer manifest: {exc}")

    if data.get("schema_version") != 1:
        fail("unsupported offer-conversion schema_version")
    if data.get("canonical_public_implementation") != CANONICAL:
        fail(f"canonical_public_implementation must remain {CANONICAL}")
    if data.get("primary_first_engagement") != "Controlled Pilot":
        fail("primary_first_engagement must remain Controlled Pilot")
    if data.get("operating_principle") != "Automate proposals, not decisions.":
        fail("operating principle drifted")

    packages = data.get("engagement_packages")
    if not isinstance(packages, list) or len(packages) != 4:
        fail("engagement_packages must contain exactly four packages")
    names = [item.get("name") for item in packages if isinstance(item, dict)]
    if names != EXPECTED_PACKAGES:
        fail(f"engagement package order or names drifted: {names!r}")
    for item in packages:
        purpose = item.get("purpose")
        if not isinstance(purpose, str) or not purpose.strip():
            fail(f"package {item.get('name')!r} has no purpose")

    boundary = data.get("recommended_pilot_boundary")
    if not isinstance(boundary, dict):
        fail("recommended_pilot_boundary must be an object")
    if boundary.get("processes") != 1 or boundary.get("business_units") != 1:
        fail("controlled pilot must remain bounded to one process and one business unit")
    if boundary.get("pilot_users") != "approximately 5 to 20":
        fail("pilot user boundary drifted")

    assets = data.get("public_assets")
    if not isinstance(assets, list) or not assets:
        fail("public_assets must be a non-empty list")
    if len(set(assets)) != len(assets):
        fail("public_assets contains duplicates")
    for asset in assets:
        path = repo_path(asset, "public asset")
        if not path.is_file():
            fail(f"referenced public asset does not exist: {asset}")

    unvalidated = data.get("unvalidated_commercial_items")
    if not isinstance(unvalidated, list) or len(unvalidated) < 4:
        fail("unvalidated_commercial_items must explicitly preserve the unresolved commercial gates")

    not_claimed = data.get("not_claimed")
    if not isinstance(not_claimed, list) or not not_claimed:
        fail("not_claimed must be a non-empty list")

    discovery_html = (ROOT / "ai-workflow-enablement" / "discovery.html").read_text(encoding="utf-8")
    discovery_js = (ROOT / "assets" / "workflow-discovery.js").read_text(encoding="utf-8")
    if "Nothing is transmitted by the page." not in discovery_html:
        fail("discovery privacy boundary is missing")
    if "event.preventDefault()" not in discovery_js:
        fail("discovery form no longer prevents default form submission")
    if "fetch(" in discovery_js or "XMLHttpRequest" in discovery_js:
        fail("discovery utility must not transmit form data through fetch/XHR")

    service_html = (ROOT / "services.html").read_text(encoding="utf-8")
    case_html = (ROOT / "ai-workflow-enablement" / "index.html").read_text(encoding="utf-8")
    overview_html = (ROOT / "ai-workflow-enablement" / "overview.html").read_text(encoding="utf-8")
    for package in EXPECTED_PACKAGES:
        for label, text in (("services", service_html), ("case study", case_html), ("overview", overview_html)):
            if package not in text:
                fail(f"{package!r} missing from {label} surface")

    print(
        "PASS: AI Workflow Enablement offer conversion "
        f"({len(packages)} packages, {len(assets)} public assets, "
        f"{len(unvalidated)} preserved commercial validation gaps)"
    )


if __name__ == "__main__":
    main()
