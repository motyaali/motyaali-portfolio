#!/usr/bin/env python3
"""Validate machine-readable public proof packs and their referenced artifacts."""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = "motyaali/motyaali-portfolio@main"


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def safe_repo_path(value: object, *, context: str) -> Path:
    if not isinstance(value, str) or not value.strip():
        fail(f"{context}: expected a non-empty repository path")
    path = Path(value)
    if path.is_absolute() or ".." in path.parts:
        fail(f"{context}: unsafe repository path {value!r}")
    return ROOT / path


def csv_row_count(path: Path) -> int:
    with path.open("r", encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    return len(rows)


def validate_manifest(path: Path) -> tuple[int, int]:
    try:
        manifest = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"{path.relative_to(ROOT)}: unreadable JSON: {exc}")

    label = str(manifest.get("proof_pack") or path.name)
    if manifest.get("schema_version") != 1:
        fail(f"{label}: unsupported schema_version")
    if manifest.get("canonical_public_implementation") != CANONICAL:
        fail(f"{label}: canonical_public_implementation must be {CANONICAL}")

    maturity = manifest.get("maturity")
    classification = manifest.get("data_classification")
    if not isinstance(maturity, str) or not maturity.strip():
        fail(f"{label}: maturity is required")
    if not isinstance(classification, str) or not classification.strip():
        fail(f"{label}: data_classification is required")

    not_claimed = manifest.get("not_claimed")
    if not isinstance(not_claimed, list) or not not_claimed or not all(isinstance(item, str) and item.strip() for item in not_claimed):
        fail(f"{label}: not_claimed must be a non-empty list of strings")

    artifacts = manifest.get("public_artifacts")
    if not isinstance(artifacts, list) or not artifacts:
        fail(f"{label}: public_artifacts must be a non-empty list")

    seen: set[str] = set()
    for value in artifacts:
        if not isinstance(value, str) or not value:
            fail(f"{label}: invalid artifact entry {value!r}")
        if value in seen:
            fail(f"{label}: duplicate public artifact {value}")
        seen.add(value)
        artifact_path = safe_repo_path(value, context=label)
        if not artifact_path.is_file():
            fail(f"{label}: referenced artifact does not exist: {value}")

    synthetic = manifest.get("synthetic_records")
    if isinstance(synthetic, dict):
        count = synthetic.get("count")
        register = synthetic.get("register")
        if not isinstance(count, int) or count < 1:
            fail(f"{label}: synthetic_records.count must be a positive integer")
        register_path = safe_repo_path(register, context=f"{label} synthetic register")
        if not register_path.is_file():
            fail(f"{label}: synthetic register does not exist: {register}")
        actual = csv_row_count(register_path)
        if actual != count:
            fail(f"{label}: synthetic register contains {actual} rows, expected {count}")

    acceptance = manifest.get("acceptance")
    if isinstance(acceptance, dict):
        matrix = acceptance.get("matrix")
        browser_spec = acceptance.get("browser_spec")
        matrix_path = safe_repo_path(matrix, context=f"{label} acceptance matrix")
        spec_path = safe_repo_path(browser_spec, context=f"{label} browser spec")
        if not matrix_path.is_file():
            fail(f"{label}: acceptance matrix does not exist: {matrix}")
        if not spec_path.is_file():
            fail(f"{label}: browser spec does not exist: {browser_spec}")
        acceptance_rows = csv_row_count(matrix_path)
        if acceptance_rows < 1:
            fail(f"{label}: acceptance matrix is empty")
    else:
        acceptance_rows = 0

    print(
        f"PASS: {label} "
        f"({len(artifacts)} artifacts, {acceptance_rows} acceptance rows, maturity={maturity!r})"
    )
    return 1, len(artifacts)


def main() -> None:
    manifests = sorted(ROOT.glob("evidence/**/*-proof.json"))
    if not manifests:
        fail("no public proof-pack manifests found")

    pack_count = 0
    artifact_count = 0
    for manifest_path in manifests:
        packs, artifacts = validate_manifest(manifest_path)
        pack_count += packs
        artifact_count += artifacts

    print(f"PASS: validated {pack_count} public proof pack(s) referencing {artifact_count} artifact(s)")


if __name__ == "__main__":
    main()
