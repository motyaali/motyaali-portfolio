const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');

function getRootPrefix() {
  const homeLink = navigation?.querySelector('a[href$="index.html"]');
  const brandLink = document.querySelector('.brand[href$="index.html"]');
  const homeHref = homeLink?.getAttribute('href') || brandLink?.getAttribute('href') || 'index.html';
  return homeHref.endsWith('index.html') ? homeHref.slice(0, -'index.html'.length) : '';
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

function enhanceProjectCovers() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  if (!document.querySelector('link[data-project-thumbnails]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = `${getRootPrefix()}assets/project-thumbnails.css`;
    stylesheet.dataset.projectThumbnails = 'true';
    document.head.appendChild(stylesheet);
  }

  const labels = [
    ['Construction Project Coordination Controls', 'Project controls'],
    ['Retail Planning & Analytics at Scale', 'Planning at scale'],
    ['AI Workflow Enablement', 'Governed workflows'],
    ['SmartGrocer', 'Full-stack product'],
    ['Enterprise Documentation & Workflow Enablement', 'Document systems'],
    ['Inventory Truth Ledger', 'Inventory architecture'],
    ['AliOS / Unseen Lifeline', 'Accessible AI'],
    ['Unseen Lifeline', 'Accessible AI'],
    ['Unseen OS', 'Continuity system'],
    ['Canonical Source Synthesis', 'Knowledge governance'],
    ['CentaurOS', 'Concept lab'],
    ['Unseen Sentry', 'Concept lab'],
    ['Blue Chip Bot', 'Concept lab']
  ];

  cards.forEach((card) => {
    const cover = card.querySelector('.project-cover');
    const heading = card.querySelector('h3')?.textContent.trim();
    if (!cover || !heading || cover.querySelector('.project-cover-label')) return;

    const match = labels.find(([title]) => heading.includes(title));
    const labelText = match?.[1] || 'Project evidence';
    const label = document.createElement('div');
    label.className = 'project-cover-label';
    const text = document.createElement('span');
    text.textContent = labelText;
    label.appendChild(text);
    cover.appendChild(label);
    cover.setAttribute('aria-label', `${heading}: ${labelText}`);
  });
}

standardizeNavigation();
enhanceProjectCovers();

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

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavigation);
  });

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
  if (notice && disclosureByPage[fileName]) {
    notice.innerHTML = `<strong>Synthetic case study:</strong> ${disclosureByPage[fileName]}`;
  }

  if (isInterviewGuide) {
    const replacements = new Map([
      ['This is a reconstructed academic case using synthetic data.', 'This is an independent case study using synthetic project data.'],
      ['The case is a portfolio reconstruction based on construction administration coursework and my current document-control and workflow experience. All project data is synthetic. I built it to demonstrate how I now connect the processes.', 'This is an independent portfolio case study using synthetic project data. I built it to demonstrate how I connect project coordination controls across the full lifecycle.'],
      ['State that the case is reconstructed and synthetic.', 'State that the case uses synthetic project data.']
    ]);

    document.querySelectorAll('p, blockquote, li').forEach((element) => {
      let text = element.textContent;
      replacements.forEach((replacement, original) => {
        text = text.replace(original, replacement);
      });
      if (text !== element.textContent) element.textContent = text;
    });
  }
}

normalizeProjectCoordinationEvidence();
document.getElementById('year')?.append(String(new Date().getFullYear()));
