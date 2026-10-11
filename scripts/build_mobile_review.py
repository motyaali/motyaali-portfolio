#!/usr/bin/env python3
"""Package mobile review captures in a PDF that does not require JavaScript."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[1]
CAPTURES = ROOT / "review-captures" / "mobile-webkit"
OUTPUT = ROOT / "review-artifacts" / "Portfolio-Mobile-Review.pdf"
ROUTES = [
    "index.html", "work.html", "resume.html", "credentials.html", "about.html",
    "evidence.html", "projects_ccsf-ai-interview-coach.html",
    "projects_documentation-workflow.html", "projects_smartgrocer.html",
    "projects_soma-budget-planner.html", "ai-workflow-enablement_index.html",
    "evidence_implementation_interview-coach.html", "evidence_implementation_smartgrocer.html",
]

def main():
    missing = [name for name in ROUTES if not (CAPTURES / (name + ".jpg")).is_file()]
    if missing:
        raise SystemExit("Missing mobile review captures: " + ", ".join(missing))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pageCompression=1)
    pdf.setTitle("Portfolio mobile draft review")
    pdf.setAuthor("Motya Ali")
    for name in ROUTES:
        image = ImageReader(str(CAPTURES / (name + ".jpg")))
        width, height = image.getSize()
        image_width = 390
        image_height = image_width * height / width
        page_height = image_height + 60
        pdf.setPageSize((426, page_height))
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(18, page_height - 20, "UNPUBLISHED DRAFT / MOBILE REVIEW")
        pdf.setFont("Helvetica", 8)
        pdf.drawString(18, page_height - 34, name.replace("_", "/"))
        pdf.drawImage(image, 18, 16, width=image_width, height=image_height)
        pdf.showPage()
    pdf.save()
    print(f"Built phone-readable review: {OUTPUT} ({len(ROUTES)} pages)")

if __name__ == "__main__":
    main()
