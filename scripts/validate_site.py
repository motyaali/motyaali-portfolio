#!/usr/bin/env python3
"""Validate the static portfolio using only the Python standard library."""

from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
IGNORED_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript"}
IGNORED_DIRECTORIES = {".git", ".github"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[tuple[str, str]] = []
        self.ids: list[str] = []
        self.has_html_lang = False
        self.has_viewport = False
        self.has_title = False
        self.has_h1 = False
        self.images_without_alt: list[str] = []
        self._inside_title = False
        self._title_text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {key: value for key, value in attrs}

        if tag == "html" and attributes.get("lang"):
            self.has_html_lang = True
        elif tag == "meta" and attributes.get("name", "").lower() == "viewport":
            self.has_viewport = True
        elif tag == "title":
            self._inside_title = True
        elif tag == "h1":
            self.has_h1 = True
        elif tag == "img" and "alt" not in attributes:
            self.images_without_alt.append(attributes.get("src") or "<missing src>")

        element_id = attributes.get("id")
        if element_id:
            self.ids.append(element_id)

        for attribute_name in ("href", "src"):
            value = attributes.get(attribute_name)
            if value:
                self.links.append((attribute_name, value))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._inside_title = False
            self.has_title = bool("".join(self._title_text).strip())

    def handle_data(self, data: str) -> None:
        if self._inside_title:
            self._title_text.append(data)


def iter_html_files() -> list[Path]:
    return sorted(
        path
        for path in ROOT.rglob("*.html")
        if not any(part in IGNORED_DIRECTORIES for part in path.parts)
    )


def resolve_local_target(page: Path, raw_link: str) -> Path | None:
    link = raw_link.strip()
    if not link or link.startswith("#") or link.startswith("//"):
        return None

    parsed = urlsplit(link)
    if parsed.scheme.lower() in IGNORED_SCHEMES or parsed.netloc:
        return None

    path_text = unquote(parsed.path)
    if not path_text:
        return None

    if path_text.startswith("/"):
        target = ROOT / path_text.lstrip("/")
    else:
        target = page.parent / path_text

    return target.resolve()


def validate_page(page: Path) -> list[str]:
    errors: list[str] = []
    relative_page = page.relative_to(ROOT)

    try:
        content = page.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        return [f"{relative_page}: not valid UTF-8 ({exc})"]

    parser = PageParser()
    parser.feed(content)

    if not parser.has_html_lang:
        errors.append(f"{relative_page}: missing <html lang=...>")
    if not parser.has_viewport:
        errors.append(f"{relative_page}: missing viewport meta tag")
    if not parser.has_title:
        errors.append(f"{relative_page}: missing non-empty <title>")
    if not parser.has_h1:
        errors.append(f"{relative_page}: missing <h1>")

    duplicates = sorted({element_id for element_id in parser.ids if parser.ids.count(element_id) > 1})
    for element_id in duplicates:
        errors.append(f"{relative_page}: duplicate id '{element_id}'")

    for source in parser.images_without_alt:
        errors.append(f"{relative_page}: image missing alt attribute ({source})")

    for attribute_name, raw_link in parser.links:
        target = resolve_local_target(page, raw_link)
        if target is None:
            continue

        try:
            target.relative_to(ROOT)
        except ValueError:
            errors.append(f"{relative_page}: {attribute_name} escapes repository root ({raw_link})")
            continue

        if target.is_dir():
            target = target / "index.html"

        if not target.exists():
            errors.append(f"{relative_page}: broken local {attribute_name} '{raw_link}'")

    return errors


def main() -> int:
    pages = iter_html_files()
    if not pages:
        print("No HTML files found.", file=sys.stderr)
        return 1

    errors: list[str] = []
    for page in pages:
        errors.extend(validate_page(page))

    if errors:
        print(f"Portfolio validation failed with {len(errors)} error(s):")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Validated {len(pages)} HTML pages with no structural or local-link errors.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
