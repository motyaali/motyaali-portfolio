const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');

function getRootPrefix() {
  const homeLink = navigation?.querySelector('a[href$="index.html"]');
  const brandLink = document.querySelector('.brand[href$="index.html"]');
  const homeHref = homeLink?.getAttribute('href') || brandLink?.getAttribute('href') || 'index.html';
  return homeHref.endsWith('index.html') ? homeHref.slice(0, -'index.html'.length) : '';
}

function ensureStylesheet(path, dataName) {
  if (document.querySelector(`link[data-${dataName}]`)) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = `${getRootPrefix()}${path}`;
  stylesheet.setAttribute(`data-${dataName}`, 'true');
  document.head.appendChild(stylesheet);
}

function standardizeNavigation() {
  if (!navigation) return;
  const desiredOrder = ['Home', 'Work', 'About', 'Résumé', 'Services', 'Contact'];
  const linksByLabel = new Map();

  navigation.querySelectorAll('a').forEach((link) => {
    const label = link.textContent.trim().replace('Resume', 'Résumé');
    linksByLabel.set(label, link);
  });

  if (!linksByLabel.has('Services')) {
    const servicesLink = document.createElement('a');
    servicesLink.href = `${getRootPrefix()}services.html`;
    servicesLink.textContent = 'Services';
    linksByLabel.set('Services', servicesLink);
  }

  desiredOrder.forEach((label) => {
    const link = linksByLabel.get(label);
    if (link) navigation.appendChild(link);
  });
}

const thumbnailDefinitions = [
  ['Construction Project Coordination Controls', 'project-controls', 'Project controls dashboard'],
  ['Retail Planning & Analytics at Scale', 'retail', 'Executive planning dashboard'],
  ['AI Workflow Enablement', 'ai', 'Distributed inputs to reviewed outputs'],
  ['Enterprise Documentation & Workflow Enablement', 'docs', 'Role-based workflow'],
  ['Inventory Truth Ledger', 'inventory', 'Source-state architecture'],
  ['Canonical Source Synthesis', 'canonical', 'Source inventory and conflict review'],
  ['SmartGrocer', 'smartgrocer', 'Mobile grocery planning interface'],
  ['AliOS / Unseen Lifeline', 'lifeline', 'Notice-to-action workflow'],
  ['Unseen Lifeline', 'lifeline', 'Notice-to-action workflow'],
  ['Unseen OS', 'unseen-os', 'Continuity dashboard']
];

function artifactThumbnail(type) {
  const topbar = (kicker, label) => `<div class="thumb-topbar"><span class="thumb-kicker">${kicker}</span><span>${label}</span></div>`;

  if (type === 'project-controls') return `<div class="artifact-thumb thumb-project-controls" aria-hidden="true">${topbar('Project health','Coordination controls')}<div class="thumb-grid health-row"><div class="thumb-panel"><span>Schedule</span><span class="thumb-chip">On track</span></div><div class="thumb-panel"><span>Budget</span><span class="thumb-chip warn">At risk</span></div><div class="thumb-panel"><span>Quality</span><span class="thumb-chip">On track</span></div><div class="thumb-panel"><span>Safety</span><span class="thumb-chip">On track</span></div></div><div class="thumb-grid main-row"><div class="thumb-panel"><strong>Three-week lookahead</strong><div class="gantt"><div class="gantt-line"><span>Procure</span><div class="gantt-track"><span class="a"></span></div></div><div class="gantt-line"><span>Submittal</span><div class="gantt-track"><span class="b"></span></div></div><div class="gantt-line"><span>Install</span><div class="gantt-track"><span class="c"></span></div></div></div></div><div class="thumb-panel"><strong>Action items</strong><div class="thumb-row"><span>RFI-178</span><span>May 15</span></div><div class="thumb-row"><span>SUB-023</span><span>May 16</span></div><div class="thumb-row"><span>CO draft</span><span>May 19</span></div></div></div><div class="thumb-grid" style="padding-top:0"><div class="thumb-panel"><table class="thumb-table"><thead><tr><th>ID</th><th>Type</th><th>Owner</th><th>Status</th></tr></thead><tbody><tr><td>RFI-178</td><td>RFI</td><td>M. Patel</td><td>Open</td></tr><tr><td>CO-045</td><td>Change</td><td>J. Lee</td><td>Review</td></tr></tbody></table></div></div></div>`;

  if (type === 'retail') return `<div class="artifact-thumb thumb-retail" aria-hidden="true">${topbar('Planning at scale','Executive view')}<div class="thumb-grid kpis"><div class="thumb-panel kpi"><span>Sales forecast</span><strong>$128.4M</strong><span class="thumb-chip">+8.7%</span></div><div class="thumb-panel kpi"><span>Gross margin</span><strong>34.2%</strong><span class="thumb-chip">+1.6pp</span></div><div class="thumb-panel kpi"><span>Turns</span><strong>5.6x</strong><span class="thumb-chip">+0.7x</span></div><div class="thumb-panel kpi"><span>Stockout</span><strong>2.1%</strong><span class="thumb-chip">-0.6pp</span></div></div><div class="thumb-grid charts"><div class="thumb-panel"><strong>13-week forecast</strong><svg viewBox="0 0 150 62"><polyline points="2,48 18,38 34,42 50,28 66,35 82,24 98,31 114,18 130,26 148,12" fill="none" stroke="#1f6f78" stroke-width="3"/><polyline points="2,53 18,47 34,45 50,43 66,38 82,36 98,33 114,32 130,28 148,26" fill="none" stroke="#aebac3" stroke-width="2" stroke-dasharray="4 3"/></svg></div><div class="thumb-panel"><strong>Category trend</strong><svg viewBox="0 0 150 62"><polyline points="2,35 24,30 46,27 68,24 90,20 112,17 148,14" fill="none" stroke="#17324d" stroke-width="2.5"/><polyline points="2,30 24,33 46,31 68,37 90,34 112,39 148,36" fill="none" stroke="#6f8b73" stroke-width="2"/></svg></div></div><div class="thumb-grid" style="padding-top:0"><div class="thumb-panel"><table class="thumb-table"><thead><tr><th>Category</th><th>Forecast</th><th>Margin</th><th>Action</th></tr></thead><tbody><tr><td>Grocery</td><td>$70.2M</td><td>32.1%</td><td>Promo mix</td></tr><tr><td>Fresh</td><td>$28.7M</td><td>28.9%</td><td>DC flow</td></tr></tbody></table></div></div></div>`;

  if (type === 'ai') return `<div class="artifact-thumb thumb-ai" aria-hidden="true">${topbar('Workflow enablement','Exception review')}<div class="flow"><div class="source-stack"><div class="source"><strong>Email update</strong><span class="thumb-muted">Project lead</span></div><div class="source"><strong>Field report</strong><span class="thumb-muted">Site</span></div><div class="source"><strong>Cost update</strong><span class="thumb-muted">Finance</span></div><div class="source"><strong>Schedule note</strong><span class="thumb-muted">Planner</span></div></div><div class="thumb-arrow">→</div><div class="review-core"><span class="thumb-kicker">Exception review</span><div class="count">3</div><span>missing · conflict · owner</span></div><div class="thumb-arrow">→</div><div class="output-stack"><div class="output"><strong>Client brief</strong><span class="thumb-muted">Prepared</span></div><div class="output"><strong>Action register</strong><span class="thumb-muted">6 rows</span></div><div class="output"><strong>Follow-up</strong><span class="thumb-muted">Targeted</span></div></div></div></div>`;

  if (type === 'docs') return `<div class="artifact-thumb thumb-docs" aria-hidden="true">${topbar('Document systems','Role-based workflow')}<div class="thumb-grid stage-row"><div class="stage"><b>1</b>Prepare</div><div class="stage"><b>2</b>Submit</div><div class="stage"><b>3</b>Review</div><div class="stage"><b>4</b>Approve</div><div class="stage"><b>5</b>Publish</div></div><div class="thumb-grid" style="padding-top:0"><div class="thumb-panel"><div class="lanes"><div class="lane-label">Contributor</div><div class="lane-cell active">Files + metadata</div><div class="lane-cell active">Submit</div><div class="lane-cell">Respond</div><div class="lane-cell">Revise</div><div class="lane-cell">Confirm</div><div class="lane-label">Reviewer</div><div class="lane-cell"></div><div class="lane-cell">Receive</div><div class="lane-cell active">Review</div><div class="lane-cell">Resolve</div><div class="lane-cell"></div><div class="lane-label">Approver</div><div class="lane-cell"></div><div class="lane-cell"></div><div class="lane-cell">Outcome</div><div class="lane-cell active">Approve</div><div class="lane-cell">Authorize</div><div class="lane-label">Doc control</div><div class="lane-cell">Naming</div><div class="lane-cell">Log</div><div class="lane-cell">Revision</div><div class="lane-cell">Disposition</div><div class="lane-cell active">Publish</div></div></div></div></div>`;

  if (type === 'inventory') return `<div class="artifact-thumb thumb-inventory" aria-hidden="true">${topbar('Inventory architecture','Source → ledger → decision')}<div class="architecture"><div class="source-list"><div class="thumb-node">ERP / PO</div><div class="thumb-node">WMS</div><div class="thumb-node">TMS</div><div class="thumb-node">ASN</div><div class="thumb-node">Carrier</div></div><div class="thumb-arrow">→</div><div class="ledger-core"><div class="ledger-icon"></div><strong>Truth Ledger</strong><div class="thumb-rule"></div><span>Identifiers</span><br><span>States + quantities</span><br><span>Lineage + freshness</span><br><span>Exceptions</span></div><div class="thumb-arrow">→</div><div class="view-list"><div class="thumb-node core">Planning</div><div class="thumb-node core">Operations</div><div class="thumb-node core">Finance</div><div class="thumb-node core">Leadership</div></div></div></div>`;

  if (type === 'canonical') return `<div class="artifact-thumb thumb-canonical" aria-hidden="true">${topbar('Knowledge governance','Evidence-backed synthesis')}<div class="thumb-grid synthesis"><div class="thumb-panel"><strong>Source inventory</strong><div class="doc-row"><span>P-101</span><span>Pricing A</span><span>5/10</span></div><div class="doc-row"><span>P-101</span><span>Pricing B</span><span>5/11</span></div><div class="doc-row"><span>S-044</span><span>Statement</span><span>5/09</span></div><div class="doc-row"><span>T-77</span><span>Terms</span><span>5/08</span></div></div><div class="thumb-panel"><strong>Conflict review</strong><div class="thumb-row"><span>Price variance</span><span class="thumb-chip warn">Review</span></div><div class="thumb-row"><span>Qty mismatch</span><span class="thumb-chip warn">Review</span></div><div class="thumb-row"><span>Term conflict</span><span class="thumb-chip warn">Review</span></div><div class="thumb-rule"></div><span class="thumb-muted">Recommendations remain reversible</span></div><div class="thumb-panel"><strong>Approved packet</strong><div class="approved">✓ Pricing v1.2</div><div class="approved">✓ Statement v1.1</div><div class="approved">✓ Terms v1.0</div><div class="thumb-rule"></div><span class="thumb-muted">Current · controlled</span></div></div></div>`;

  if (type === 'smartgrocer') return `<div class="artifact-thumb thumb-smartgrocer" aria-hidden="true">${topbar('Full-stack product','Household replenishment')}<div class="smart-grid"><div class="phone"><div class="phone-title">My List</div><div class="food-row"><span>Milk</span><span>$3.49</span></div><div class="food-row"><span>Eggs</span><span>$2.99</span></div><div class="food-row"><span>Bananas</span><span>$1.89</span></div><div class="food-row"><span>Bread</span><span>$2.79</span></div><div class="food-row"><span>Yogurt</span><span>$1.79</span></div></div><div class="right-stack"><div class="thumb-panel wide"><strong>Forecasted restock</strong><div class="thumb-row"><span>Milk</span><span class="thumb-chip">2 days</span></div><div class="thumb-row"><span>Eggs</span><span class="thumb-chip">4 days</span></div><div class="thumb-row"><span>Chicken</span><span class="thumb-chip warn">1 day</span></div></div><div class="thumb-panel"><strong>Approval</strong><div class="thumb-row"><span>Milk</span><span>1 gal</span></div><span class="thumb-chip">Approve</span></div><div class="thumb-panel"><strong>History</strong><div class="thumb-row"><span>May 7</span><span>Bananas</span></div><div class="thumb-row"><span>May 1</span><span>Milk</span></div></div></div></div></div>`;

  if (type === 'lifeline') return `<div class="artifact-thumb thumb-lifeline" aria-hidden="true">${topbar('Accessible AI','Notice → action')}<div class="thumb-grid life-grid"><div class="thumb-panel notice"><strong>Urgent notice</strong><p>Coverage renewal requires action before the stated deadline.</p><span class="thumb-muted">Received May 9</span></div><div class="thumb-panel deadline"><span>Deadline</span><strong>May 31</strong><div class="thumb-bar"><span style="width:58%;background:#c75b55"></span></div><span class="thumb-muted">22 days left</span></div><div class="thumb-panel"><strong>Open questions</strong><div class="thumb-row"><span>Limits?</span><span>•</span></div><div class="thumb-row"><span>Exclusions?</span><span>•</span></div><div class="thumb-row"><span>Contact?</span><span>•</span></div></div></div><div class="thumb-grid lower" style="padding-top:0"><div class="thumb-panel"><strong>Checklist</strong><div class="check"><span class="box"></span><span>Review policy</span></div><div class="check"><span class="box"></span><span>Confirm terms</span></div><div class="check"><span class="box"></span><span>Obtain approval</span></div></div><div class="thumb-panel"><strong>Draft communication</strong><p class="thumb-muted">Please confirm the renewal terms, required changes, and the date needed to preserve coverage.</p></div><div class="thumb-panel"><strong>Action plan</strong><div class="thumb-row"><span>Review</span><span>May 12</span></div><div class="thumb-row"><span>Confirm</span><span>May 16</span></div><div class="thumb-row"><span>Approve</span><span>May 20</span></div></div></div></div>`;

  if (type === 'unseen-os') return `<div class="artifact-thumb thumb-unseen-os" aria-hidden="true">${topbar('Continuity system','Open loops + risk')}<div class="os-shell"><div class="sidebar"><b>UNSEEN OS</b><div class="nav-item active">Overview</div><div class="nav-item">Open loops</div><div class="nav-item">Risks</div><div class="nav-item">Calendar</div><div class="nav-item">Records</div></div><div class="os-main"><div class="os-kpis"><div class="thumb-panel"><span>Open loops</span><strong>18</strong></div><div class="thumb-panel"><span>Risk</span><strong>Medium</strong></div><div class="thumb-panel"><span>Deadlines</span><strong>7</strong></div></div><div class="thumb-panel"><strong>Recent open loops</strong><table class="thumb-table"><thead><tr><th>ID</th><th>Item</th><th>Due</th><th>Risk</th></tr></thead><tbody><tr><td>L-102</td><td>Contract renewal</td><td>May 14</td><td>High</td></tr><tr><td>L-107</td><td>Documentation</td><td>May 16</td><td>Med</td></tr><tr><td>L-110</td><td>Retention update</td><td>May 20</td><td>Med</td></tr><tr><td>L-115</td><td>Access review</td><td>May 28</td><td>Low</td></tr></tbody></table></div></div></div></div>`;

  return '';
}

function enhanceProjectCovers() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;
  ensureStylesheet('assets/project-thumbnails.css', 'project-thumbnails');

  const conceptLabels = new Map([
    ['CentaurOS', 'Concept lab'],
    ['Unseen Sentry', 'Concept lab'],
    ['Blue Chip Bot', 'Concept lab']
  ]);

  cards.forEach((card) => {
    const cover = card.querySelector('.project-cover');
    const heading = card.querySelector('h3')?.textContent.trim();
    if (!cover || !heading || cover.dataset.enhanced === 'true') return;

    const definition = thumbnailDefinitions.find(([title]) => heading.includes(title));
    if (definition) {
      const [, type, description] = definition;
      cover.className = 'project-cover artifact-cover';
      cover.innerHTML = artifactThumbnail(type);
      cover.setAttribute('aria-label', `${heading}: ${description} preview`);
      cover.dataset.enhanced = 'true';
      return;
    }

    const conceptLabel = [...conceptLabels.entries()].find(([title]) => heading.includes(title));
    if (conceptLabel && !cover.querySelector('.project-cover-label')) {
      const label = document.createElement('div');
      label.className = 'project-cover-label';
      label.innerHTML = `<span>${conceptLabel[1]}</span>`;
      cover.appendChild(label);
      cover.setAttribute('aria-label', `${heading}: ${conceptLabel[1]}`);
    }
    cover.dataset.enhanced = 'true';
  });
}

function injectBenchmarkEvidence() {
  const pathname = window.location.pathname;
  if (pathname.includes('/evidence/') || !pathname.includes('/ai-workflow-enablement/')) return;
  const meetingHeading = document.getElementById('meeting-heading');
  const meetingSection = meetingHeading?.closest('section');
  if (!meetingSection || document.getElementById('synthetic-benchmark')) return;

  ensureStylesheet('assets/evidence-pack.css', 'evidence-pack');
  const section = document.createElement('section');
  section.className = 'section';
  section.id = 'synthetic-benchmark';
  section.setAttribute('aria-labelledby', 'benchmark-heading');
  section.innerHTML = `<div class="container"><div class="section-heading"><div><p class="eyebrow">Measured demonstration value</p><h2 id="benchmark-heading">A synthetic workload benchmark makes the review reduction explicit.</h2></div><p>The fixed public scenario compares manual handling surfaces with the assisted workflow using reproducible task counts rather than invented time or dollar savings.</p></div><div class="benchmark-grid"><article class="benchmark-card"><strong>83%</strong><span>fewer contributor/status-check surfaces: six separate checks become one consolidated view</span><div class="delta">6 → 1</div></article><article class="benchmark-card"><strong>70%</strong><span>fewer items require active synthesis: seven routine facts are prepared while three exceptions retain human judgment</span><div class="delta">10 → 3</div></article><article class="benchmark-card"><strong>67%</strong><span>fewer separate output-construction steps: brief, register, and follow-up are prepared from one reviewed package</span><div class="delta">3 → 1 finalization</div></article></div><div class="benchmark-note"><strong>Benchmark boundary:</strong> this is a synthetic task-count benchmark using the fixed Meeting Intelligence demonstration. It does not claim elapsed human-time savings, client ROI, production accuracy, or live organizational performance. Prepared routine facts remain subject to accountable verification.</div><div class="actions"><a class="button button-primary" href="../evidence/ai-workflow-enablement/benchmark-methodology.html">Inspect benchmark methodology</a><a class="button button-secondary" href="../evidence/ai-workflow-enablement/meeting-intelligence-benchmark.csv" download>Download benchmark CSV</a><a class="button button-secondary" href="../demos/meeting-intelligence.html">Run the demonstration</a></div></div>`;
  meetingSection.after(section);
}

const evidencePackConfigs = {
  '/projects/documentation-workflow.html': {
    eyebrow: 'Inspectable reconstructed evidence',
    title: 'Open the artifacts behind the workflow.',
    intro: 'These public-safe reconstructions are grounded in the registered professional body of work while keeping employer and client records private.',
    cards: [
      ['HTML · User guide', 'Role-Based Deliverable Workflow Guide', 'A printable five-stage guide organized around role, required action, control check, and handoff condition.', '../evidence/documentation-workflow/role-based-workflow-guide.html', 'Open guide →', false],
      ['CSV · Responsibility', 'Workflow Responsibility Matrix', 'Contributor, reviewer, approver, and document-control responsibilities across prepare, submit, review, approve, and publish.', '../evidence/documentation-workflow/responsibility-matrix.csv', 'Download CSV', true],
      ['CSV · Access support', 'Permissions Support Register', 'A synthetic issue register showing role, access need, blocker, owner, next action, and status.', '../evidence/documentation-workflow/permissions-support-register.csv', 'Download CSV', true]
    ]
  },
  '/projects/inventory-ledger.html': {
    eyebrow: 'Inspectable architecture evidence',
    title: 'Test the ledger through operating artifacts.',
    intro: 'The architecture now includes downloadable state, exception, and decision-view records using synthetic data.',
    cards: [
      ['HTML · Evidence pack', 'Inventory Truth Ledger Evidence Pack', 'A guided index connecting the normalized state model, exception queue, and role-specific decision views.', '../evidence/inventory-ledger/evidence-pack.html', 'Open evidence pack →', false],
      ['CSV · Exception control', 'Inventory Exception Queue', 'Four representative discrepancies with conflicting evidence, decision risk, owner, and next action.', '../evidence/inventory-ledger/inventory-exception-queue.csv', 'Download CSV', true],
      ['CSV · State model', 'Normalized Inventory State Model', 'A source-linked lifecycle from commitment through availability and adjustment.', '../evidence/inventory-ledger/inventory-state-model.csv', 'Download CSV', true]
    ]
  },
  '/projects/canonical-synthesis.html': {
    eyebrow: 'Inspectable governance evidence',
    title: 'Open the records that keep synthesis traceable.',
    intro: 'These public-safe artifacts reconstruct source inventory, conflict review, and change-control behavior from the documented system.',
    cards: [
      ['HTML · Evidence pack', 'Canonical Source Synthesis Evidence Pack', 'A guided index for the source inventory, conflict/recommendation matrix, and change-control register.', '../evidence/canonical-synthesis/evidence-pack.html', 'Open evidence pack →', false],
      ['CSV · Source control', 'Source Inventory', 'Tracks source family, status, unique value, and control treatment before synthesis.', '../evidence/canonical-synthesis/source-inventory.csv', 'Download CSV', true],
      ['CSV · Conflict review', 'Conflict & Recommendation Matrix', 'Preserves competing evidence and stages recommendations for accountable human decisions.', '../evidence/canonical-synthesis/conflict-review-matrix.csv', 'Download CSV', true]
    ]
  }
};

function injectEvidencePack() {
  const pathname = window.location.pathname;
  const key = Object.keys(evidencePackConfigs).find((item) => pathname.endsWith(item));
  if (!key || document.getElementById('downloadable-evidence')) return;
  const config = evidencePackConfigs[key];
  const main = document.querySelector('main');
  const lastSection = main?.querySelector('section:last-of-type');
  if (!main || !lastSection) return;

  ensureStylesheet('assets/evidence-pack.css', 'evidence-pack');
  const section = document.createElement('section');
  section.className = 'section section-alt';
  section.id = 'downloadable-evidence';
  section.setAttribute('aria-labelledby', 'downloadable-evidence-heading');
  const cards = config.cards.map(([type, title, description, href, action, download]) => `<article class="evidence-pack-card"><span class="evidence-type">${type}</span><h3>${title}</h3><p>${description}</p><div class="evidence-actions"><a href="${href}" ${download ? 'download' : ''}>${action}</a></div></article>`).join('');
  section.innerHTML = `<div class="container"><div class="section-heading"><div><p class="eyebrow">${config.eyebrow}</p><h2 id="downloadable-evidence-heading">${config.title}</h2></div><p>${config.intro}</p></div><div class="evidence-pack-grid">${cards}</div></div>`;
  main.insertBefore(section, lastSection);
}

standardizeNavigation();
enhanceProjectCovers();
injectBenchmarkEvidence();
injectEvidencePack();

function closeNavigation() {
  if (!menuButton || !navigation) return;
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNavigation));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      closeNavigation();
      menuButton.focus();
    }
  });
}

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('[data-category]').forEach((card) => {
      card.hidden = !(filter === 'all' || card.dataset.category.includes(filter));
    });
  });
});

const queryParameters = new URLSearchParams(window.location.search);
const requestedSubject = queryParameters.get('subject')?.trim();

if (requestedSubject) {
  const safeSubject = requestedSubject.slice(0, 120);
  document.querySelectorAll('.subject-link').forEach((link) => {
    link.href = `mailto:motyaali@pm.me?subject=${encodeURIComponent(safeSubject)}`;
  });
  const heading = document.getElementById('contact-heading');
  const intro = document.getElementById('contact-intro');
  const context = document.getElementById('contact-context');
  if (heading) heading.textContent = safeSubject;
  if (intro) intro.textContent = 'Your inquiry topic has been added to the email subject line. Please include the organization, process, role, or evidence item you would like to discuss.';
  if (context) context.textContent = `Email topic: ${safeSubject}`;
}

function normalizeProjectCoordinationEvidence() {
  if (!window.location.pathname.includes('/project-coordination-controls/')) return;
  const isInterviewGuide = window.location.pathname.endsWith('/interview-walkthrough.html');

  if (!isInterviewGuide) {
    document.querySelectorAll('a[href$="interview-walkthrough.html"]').forEach((link) => {
      const card = link.closest('.proof-card');
      if (card) card.remove();
      else link.remove();
    });
  }

  const disclosureByPage = {
    'dashboard.html': 'All organizations, vendors, dates, costs, and records are fictional. This dashboard demonstrates project-coordination controls and judgment using synthetic project data.',
    'process-map.html': 'This independent case study uses synthetic project data. The process map is platform-neutral and does not represent any employer\'s exact approval matrix or internal procedure.',
    'change-package-control.html': 'PCN-002, its values, organizations, dates, and supporting records are fictional. This artifact demonstrates administrative completeness and routing judgment.',
    'invoice-routing-control.html': 'PA-002, its values, dates, parties, and supporting records are fictional. This artifact demonstrates administrative review and exception handling.',
    'weekly-meeting-pack.html': 'This fictional meeting record demonstrates agenda, decision, action, and follow-through controls using synthetic project data.'
  };

  const fileName = window.location.pathname.split('/').pop();
  const notice = document.querySelector('.demo-notice.coordination-notice');
  if (notice && disclosureByPage[fileName]) notice.innerHTML = `<strong>Synthetic case study:</strong> ${disclosureByPage[fileName]}`;

  if (isInterviewGuide) {
    const replacements = new Map([
      ['This is a reconstructed academic case using synthetic data.', 'This is an independent case study using synthetic project data.'],
      ['The case is a portfolio reconstruction based on construction administration coursework and my current document-control and workflow experience. All project data is synthetic. I built it to demonstrate how I now connect the processes.', 'This is an independent portfolio case study using synthetic project data. I built it to demonstrate how I connect project coordination controls across the full lifecycle.'],
      ['State that the case is reconstructed and synthetic.', 'State that the case uses synthetic project data.']
    ]);
    document.querySelectorAll('p, blockquote, li').forEach((element) => {
      let text = element.textContent;
      replacements.forEach((replacement, original) => { text = text.replace(original, replacement); });
      if (text !== element.textContent) element.textContent = text;
    });
  }
}

normalizeProjectCoordinationEvidence();
document.getElementById('year')?.append(String(new Date().getFullYear()));
