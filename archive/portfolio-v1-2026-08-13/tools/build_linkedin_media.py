from __future__ import annotations

from pathlib import Path
import textwrap

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SOCIAL_DIR = ROOT / "assets" / "social"
SOCIAL_DIR.mkdir(parents=True, exist_ok=True)

NAVY = (15, 35, 54)
NAVY_2 = (23, 50, 77)
TEAL = (31, 111, 120)
TEAL_LIGHT = (220, 238, 239)
WHITE = (255, 255, 255)
GOLD = (225, 166, 43)

FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def fit_font(text: str, max_width: int, max_size: int, min_size: int = 18) -> ImageFont.FreeTypeFont:
    for size in range(max_size, min_size - 1, -1):
        candidate = font(size, bold=True)
        box = candidate.getbbox(text)
        if box[2] - box[0] <= max_width:
            return candidate
    return font(min_size, bold=True)


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill, outline=None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def build_project_image(path: Path) -> None:
    width, height = 1200, 630
    image = Image.new("RGB", (width, height), NAVY)
    draw = ImageDraw.Draw(image)

    for y in range(height):
        t = y / (height - 1)
        color = tuple(int(NAVY[i] * (1 - t) + NAVY_2[i] * t) for i in range(3))
        draw.line((0, y, width, y), fill=color)

    for x, y, radius in [(1010, 70, 180), (1080, 520, 220), (100, 560, 150)]:
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), outline=(40, 92, 110), width=2)

    draw.text((70, 62), "MOTYA ALI", font=font(24, bold=True), fill=WHITE)
    draw.text((70, 100), "AI WORKFLOW ENABLEMENT", font=fit_font("AI WORKFLOW ENABLEMENT", 650, 52), fill=WHITE)
    draw.text((70, 166), "Governed AI workflows for real operations", font=font(29, bold=True), fill=GOLD)

    body = (
        "Redesign recurring administrative work, implement governed AI-assisted workflows, "
        "and leave teams with testing, documentation, training, and clear operating ownership."
    )
    y = 230
    for line in textwrap.wrap(body, width=61):
        draw.text((70, y), line, font=font(24), fill=(226, 235, 241))
        y += 34

    steps = [
        ("01", "Controlled\nInput"),
        ("02", "AI\nProposal"),
        ("03", "Human\nReview"),
        ("04", "Approved\nAction"),
        ("05", "Audit &\nImprove"),
    ]
    start_x, top, box_width, box_height, gap = 70, 410, 185, 122, 35
    for index, (number, label) in enumerate(steps):
        x = start_x + index * (box_width + gap)
        rounded(draw, (x, top, x + box_width, top + box_height), 18, WHITE, (180, 204, 216), 2)
        marker = TEAL if index != 3 else (91, 150, 72)
        rounded(draw, (x + 16, top + 16, x + 58, top + 58), 12, marker)
        draw.text((x + 26, top + 22), number, font=font(18, bold=True), fill=WHITE)

        label_y = top + 70
        for line in label.split("\n"):
            label_font = font(19, bold=True)
            text_box = draw.textbbox((0, 0), line, font=label_font)
            draw.text((x + (box_width - (text_box[2] - text_box[0])) / 2, label_y), line, font=label_font, fill=NAVY_2)
            label_y += 23

        if index < len(steps) - 1:
            arrow_x = x + box_width + 7
            arrow_y = top + box_height / 2
            draw.line((arrow_x, arrow_y, arrow_x + 20, arrow_y), fill=GOLD, width=4)
            draw.polygon(
                [(arrow_x + 20, arrow_y), (arrow_x + 11, arrow_y - 6), (arrow_x + 11, arrow_y + 6)],
                fill=GOLD,
            )

    draw.text((70, 577), "AUTOMATE PROPOSALS, NOT DECISIONS", font=font(19, bold=True), fill=TEAL_LIGHT)
    draw.text((882, 577), "motyaali.com", font=font(18, bold=True), fill=WHITE)
    image.save(path, format="PNG", optimize=True)


def build_home_image(path: Path) -> None:
    width, height = 1200, 630
    image = Image.new("RGB", (width, height), WHITE)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 760, height), fill=NAVY)
    draw.ellipse((540, -180, 970, 250), fill=(20, 69, 83))
    draw.ellipse((-170, 450, 250, 850), fill=NAVY_2)

    draw.text((65, 56), "MOTYA ALI", font=font(29, bold=True), fill=WHITE)
    draw.text(
        (65, 102),
        "OPERATIONS  •  BUSINESS SYSTEMS  •  PLANNING  •  GOVERNED AI",
        font=font(16, bold=True),
        fill=TEAL_LIGHT,
    )

    headline = "Turning complexity into clear systems and useful work."
    headline_font = fit_font(headline, 620, 54, 34)
    y = 185
    for line in textwrap.wrap(headline, width=26):
        draw.text((65, y), line, font=headline_font, fill=WHITE)
        y += 65

    draw.multiline_text(
        (65, y + 10),
        "Workflow design, decision-ready analysis, documentation,\nand human-centered AI systems.",
        font=font(23),
        fill=(226, 235, 241),
        spacing=8,
    )

    rounded(draw, (815, 65, 1140, 565), 26, (243, 247, 249), (218, 228, 234), 2)
    draw.multiline_text((850, 100), "CLEAR SYSTEMS\nFOR REAL WORK", font=font(28, bold=True), fill=NAVY_2, spacing=8)

    items = [
        ("Planning &\nAnalytics", TEAL),
        ("Workflow &\nDocumentation", NAVY_2),
        ("Human-Centered\nAI", (84, 119, 141)),
        ("Operations &\nImplementation", (91, 150, 72)),
    ]
    y = 230
    for label, color in items:
        rounded(draw, (850, y, 1105, y + 64), 16, WHITE, (205, 217, 225), 2)
        draw.ellipse((866, y + 18, 894, y + 46), fill=color)
        draw.multiline_text((910, y + 13), label, font=font(16, bold=True), fill=NAVY_2, spacing=3)
        y += 82

    draw.text((65, 575), "www.motyaali.com", font=font(19, bold=True), fill=GOLD)
    image.save(path, format="PNG", optimize=True)


def insert_before(text: str, marker: str, addition: str) -> str:
    if addition.strip() in text:
        return text
    return text.replace(marker, addition + "\n" + marker, 1)


def patch_index() -> None:
    path = ROOT / "index.html"
    text = path.read_text(encoding="utf-8")
    metadata = '''  <meta property="og:image" content="https://www.motyaali.com/assets/social/motya-ali-portfolio-linkedin.png">
  <meta property="og:image:secure_url" content="https://www.motyaali.com/assets/social/motya-ali-portfolio-linkedin.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Motya Ali portfolio: operations, business systems, planning, workflow documentation, and governed AI.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Motya Ali | Operations, Business Systems, and Human-Centered AI">
  <meta name="twitter:description" content="Clear systems for real work: operations, planning, workflow implementation, documentation, and governed AI-assisted tools.">
  <meta name="twitter:image" content="https://www.motyaali.com/assets/social/motya-ali-portfolio-linkedin.png">'''
    text = insert_before(text, "  <title>", metadata)
    text = text.replace(
        'href="projects/ai-workflow-enablement.html">Inspect the MVP evidence →',
        'href="ai-workflow-enablement/">Explore the project and service framework →',
    )
    path.write_text(text, encoding="utf-8")


def patch_mvp_page() -> None:
    path = ROOT / "projects" / "ai-workflow-enablement.html"
    text = path.read_text(encoding="utf-8")
    metadata = '''  <meta property="og:image" content="https://www.motyaali.com/assets/social/ai-workflow-enablement-linkedin.png">
  <meta property="og:image:secure_url" content="https://www.motyaali.com/assets/social/ai-workflow-enablement-linkedin.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="AI Workflow Enablement: controlled input, AI proposal, human review, approved action, and audit improvement.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="AI Workflow Enablement MVP Evidence | Motya Ali">
  <meta name="twitter:description" content="A working public demonstration of governed meeting intelligence, human review, test evidence, and operational handoff.">
  <meta name="twitter:image" content="https://www.motyaali.com/assets/social/ai-workflow-enablement-linkedin.png">'''
    text = insert_before(text, "  <title>", metadata)
    path.write_text(text, encoding="utf-8")


def write_project_page() -> None:
    path = ROOT / "ai-workflow-enablement" / "index.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    page = '''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="AI Workflow Enablement by Motya Ali: a productized service framework for governed AI-assisted workflow assessment, implementation, testing, documentation, training, and handoff.">
  <meta name="theme-color" content="#17324d">
  <link rel="canonical" href="https://www.motyaali.com/ai-workflow-enablement/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="AI Workflow Enablement | Governed AI Workflows for Real Operations">
  <meta property="og:description" content="Redesign recurring administrative work, implement governed AI-assisted workflows, and leave teams with testing, documentation, training, and clear operating ownership.">
  <meta property="og:url" content="https://www.motyaali.com/ai-workflow-enablement/">
  <meta property="og:site_name" content="Motya Ali">
  <meta property="og:image" content="https://www.motyaali.com/assets/social/ai-workflow-enablement-linkedin.png">
  <meta property="og:image:secure_url" content="https://www.motyaali.com/assets/social/ai-workflow-enablement-linkedin.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="AI Workflow Enablement: controlled input, AI proposal, human review, approved action, and audit improvement.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="AI Workflow Enablement | Motya Ali">
  <meta name="twitter:description" content="Governed AI-assisted workflow implementation, operational documentation, testing, training, and staff-ready handoff.">
  <meta name="twitter:image" content="https://www.motyaali.com/assets/social/ai-workflow-enablement-linkedin.png">
  <title>AI Workflow Enablement | Motya Ali</title>
  <link rel="stylesheet" href="../assets/styles.css">
  <link rel="stylesheet" href="../assets/proof.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "AI Workflow Enablement",
    "url": "https://www.motyaali.com/ai-workflow-enablement/",
    "founder": {
      "@type": "Person",
      "name": "Motya Ali",
      "alternateName": "Ali",
      "url": "https://www.motyaali.com/"
    },
    "description": "Governed AI-assisted workflow assessment, implementation, documentation, testing, training, and handoff for operations teams.",
    "areaServed": "San Francisco Bay Area"
  }
  </script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="../index.html" aria-label="Motya Ali home">MOTYA ALI</a>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
      <a href="../index.html">Home</a>
      <a href="../work.html">Work</a>
      <a href="../services.html" aria-current="page">Services</a>
      <a href="../about.html">About</a>
      <a href="../resume.html">Résumé</a>
      <a href="../contact.html">Contact</a>
    </nav>
  </div>
</header>
<main id="main">
  <section class="project-detail-hero">
    <div class="container">
      <p class="eyebrow proof-eyebrow">Productized service startup in development</p>
      <h1>AI Workflow Enablement</h1>
      <p>Governed AI-assisted workflow implementation, operational documentation, testing, training, and staff-ready handoff for teams that need recurring administrative work to become faster, more reliable, and easier to maintain.</p>
      <div class="actions">
        <a class="button button-primary proof-button" href="../projects/ai-workflow-enablement.html">Inspect the Working MVP</a>
        <a class="button button-secondary proof-button-secondary" href="../services.html#pilot">View the Controlled Pilot</a>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="media-heading">
    <div class="container">
      <figure class="info-panel">
        <img src="../assets/social/ai-workflow-enablement-linkedin.png" width="1200" height="630" alt="AI Workflow Enablement workflow from controlled input through AI proposal, human review, approved action, and audit improvement.">
        <figcaption id="media-heading">The shared operating pattern across the solution family: automation prepares structured proposals and evidence; accountable people retain decision authority.</figcaption>
      </figure>
    </div>
  </section>

  <section class="section section-alt" aria-labelledby="status-heading">
    <div class="container">
      <div class="proof-summary" id="status-heading">
        <article><span>Current stage</span><strong>Service framework + architectures</strong></article>
        <article><span>First public proof</span><strong>Working meeting-intelligence MVP</strong></article>
        <article><span>Governance rule</span><strong>Automate proposals, not decisions</strong></article>
        <article><span>Next milestone</span><strong>Controlled client pilot</strong></article>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="problem-heading">
    <div class="container two-column">
      <article class="prose">
        <p class="eyebrow">The business problem</p>
        <h2 id="problem-heading">The workflow usually fails before the AI does.</h2>
        <p>Operational teams lose time to repeated copying, fragmented sources, unclear ownership, inconsistent routing, status chasing, and undocumented exceptions. A prompt or automation demo does not solve those conditions by itself.</p>
        <p>AI Workflow Enablement begins with the operating process: the source of truth, roles, decisions, permissions, exceptions, evidence, acceptance criteria, training, and long-term ownership.</p>
      </article>
      <aside class="info-panel">
        <h2>Client promise</h2>
        <p>Bring one recurring process. Leave with a tested workflow, operating documentation, trained users, and a clear decision about whether to scale it.</p>
        <h3>Designed for</h3>
        <ul>
          <li>Project, document-control, and administrative operations</li>
          <li>Professional services, construction, nonprofit, education, and retail teams</li>
          <li>Microsoft 365 and other approved workplace platforms</li>
          <li>Processes with clear inputs, owners, outputs, and measurable pain</li>
        </ul>
      </aside>
    </div>
  </section>

  <section class="section section-alt" aria-labelledby="solutions-heading">
    <div class="container">
      <div class="section-heading">
        <div><p class="eyebrow">Solution family</p><h2 id="solutions-heading">Five governed implementation architectures.</h2></div>
        <p>Each architecture addresses a recurring operational process while using the same controls for evidence, uncertainty, human review, exceptions, testing, and handoff.</p>
      </div>
      <div class="capability-grid">
        <article class="capability"><span class="number">01</span><h3>Meeting Intelligence</h3><p>Convert approved meeting content into reviewed decisions, actions, owners, dates, risks, and follow-up records.</p></article>
        <article class="capability"><span class="number">02</span><h3>Document Intake & Routing</h3><p>Preserve incoming files, propose metadata and classification, review uncertainty, and route only approved records.</p></article>
        <article class="capability"><span class="number">03</span><h3>Project Status Reporting</h3><p>Turn governed project facts into a draft narrative that is verified, approved, published, and archived.</p></article>
        <article class="capability"><span class="number">04</span><h3>Work Request Triage</h3><p>Give requests a controlled intake path, ID, category, owner, service target, escalation, and closure evidence.</p></article>
        <article class="capability"><span class="number">05</span><h3>SOP Knowledge Assistance</h3><p>Answer from approved sources, expose uncertainty, respect permissions, and turn knowledge gaps into maintenance work.</p></article>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="architecture-heading">
    <div class="container">
      <div class="section-heading">
        <div><p class="eyebrow">Shared operating model</p><h2 id="architecture-heading">Controlled input to approved action.</h2></div>
        <p>The specific tools and records change by use case, but the governance pattern remains stable.</p>
      </div>
      <div class="proof-flow" role="list" aria-label="AI Workflow Enablement shared architecture">
        <article role="listitem"><span>01</span><h3>Controlled Input</h3><p>Receive approved records, documents, meeting content, requests, or source data.</p></article>
        <article role="listitem"><span>02</span><h3>AI Proposal</h3><p>Extract, classify, summarize, or draft with evidence and uncertainty preserved.</p></article>
        <article role="listitem"><span>03</span><h3>Human Review</h3><p>Confirm, correct, reject, defer, or escalate proposed information and actions.</p></article>
        <article role="listitem"><span>04</span><h3>Approved Action</h3><p>Route, publish, assign, notify, or stage only after the required control is satisfied.</p></article>
        <article role="listitem"><span>05</span><h3>Audit & Improve</h3><p>Retain status, corrections, failures, evidence, ownership, metrics, and improvement work.</p></article>
      </div>
    </div>
  </section>

  <section class="section section-alt" aria-labelledby="method-heading">
    <div class="container">
      <div class="section-heading">
        <div><p class="eyebrow">Delivery method</p><h2 id="method-heading">The implementation and the operating system are built together.</h2></div>
        <p>The work does not end when an automation runs successfully once. Adoption, maintenance, exception handling, and accountable ownership are part of the deliverable.</p>
      </div>
      <div class="connection-map">
        <article class="map-stage"><div class="map-index">01</div><h3>Discover & Map</h3><ul><li>Business outcome</li><li>Current-state burden</li><li>Users, systems, and ownership</li></ul></article>
        <article class="map-stage"><div class="map-index">02</div><h3>Govern & Build</h3><ul><li>AI and human boundaries</li><li>Rules, permissions, and exceptions</li><li>Controlled pilot configuration</li></ul></article>
        <article class="map-stage"><div class="map-index">03</div><h3>Validate & Document</h3><ul><li>Normal and failure tests</li><li>Evidence and defect logs</li><li>User and administrator guides</li></ul></article>
        <article class="map-stage"><div class="map-index">04</div><h3>Train & Handoff</h3><ul><li>Role-specific practice</li><li>Launch support</li><li>Maintenance and improvement plan</li></ul></article>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="evidence-heading">
    <div class="container two-column">
      <article class="prose">
        <p class="eyebrow">What is completed</p>
        <h2 id="evidence-heading">The service architecture exists. The business model still requires live validation.</h2>
        <ul>
          <li>Client-facing service catalog and engagement model</li>
          <li>Governance doctrine and scope boundaries</li>
          <li>Five implementation-ready reference architectures</li>
          <li>Discovery, testing, documentation, training, and handoff methods</li>
          <li>Working public meeting-intelligence MVP using synthetic data</li>
          <li>Acceptance tests, governance boundary, reference output, and administrator runbook</li>
        </ul>
      </article>
      <aside class="info-panel">
        <h2>Not yet established</h2>
        <ul>
          <li>Paying customer validation</li>
          <li>Measured savings in a live organization</li>
          <li>Production reliability across client tenants and model providers</li>
          <li>Legal or regulatory compliance for a specific client environment</li>
          <li>A proprietary SaaS platform</li>
        </ul>
        <h3>Next proof</h3>
        <p>One bounded client pilot with a named process owner, approved representative data, baseline effort, acceptance criteria, measured corrections, training, and documented handoff.</p>
      </aside>
    </div>
  </section>

  <section class="section section-alt" aria-labelledby="proof-heading">
    <div class="container">
      <div class="section-heading">
        <div><p class="eyebrow">Inspect the proof</p><h2 id="proof-heading">A working public MVP, not only a service description.</h2></div>
        <p>The first demonstration uses synthetic meeting material so reviewers can inspect proposal, correction, rejection, approval, export, testing, and documentation without exposing client data.</p>
      </div>
      <div class="actions">
        <a class="button button-primary" href="../projects/ai-workflow-enablement.html">Open the MVP Evidence</a>
        <a class="button button-secondary" href="../demos/meeting-intelligence.html">Run the Interactive Demo</a>
        <a class="button button-secondary" href="../evidence-standard.html">Read the Evidence Standard</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-heading">
        <div><p class="eyebrow">Controlled pilot</p><h2>Start with one process, not an enterprise transformation claim.</h2></div>
        <p>The first engagement is intentionally narrow enough to test safely and complete enough to prove the operating model.</p>
      </div>
      <div class="actions">
        <a class="button button-primary" href="../services.html#pilot">View Pilot Scope</a>
        <a class="button button-secondary" href="../contact.html?subject=AI%20Workflow%20Enablement">Discuss a Workflow</a>
      </div>
    </div>
  </section>
</main>
<footer class="site-footer">
  <div class="footer-inner">
    <div>© <span id="year"></span> Motya “Ali” Ali.</div>
    <div><a href="../evidence-standard.html">Evidence, privacy, and maturity standard</a></div>
  </div>
</footer>
<script src="../assets/site.js"></script>
</body>
</html>
'''
    path.write_text(page, encoding="utf-8")


def main() -> None:
    build_project_image(SOCIAL_DIR / "ai-workflow-enablement-linkedin.png")
    build_home_image(SOCIAL_DIR / "motya-ali-portfolio-linkedin.png")
    write_project_page()
    patch_index()
    patch_mvp_page()


if __name__ == "__main__":
    main()
