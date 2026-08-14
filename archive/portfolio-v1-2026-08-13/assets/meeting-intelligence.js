(() => {
  'use strict';

  const contributors = [
    {
      id: 'UPD-001',
      name: 'Jordan Lee',
      role: 'Project Lead',
      channel: 'Meeting notes',
      received: '10:05 AM',
      status: 'received',
      summary: 'Client requested a consolidated update by 3:00 PM covering schedule, design, site access, cost, vendor delivery, and compliance.'
    },
    {
      id: 'UPD-002',
      name: 'Priya Shah',
      role: 'Design Lead',
      channel: 'Email',
      received: '10:42 AM',
      status: 'received',
      summary: 'Design package is 90% complete. Release remains targeted for August 12 if the redline decision is completed by August 8.'
    },
    {
      id: 'UPD-003',
      name: 'Marco Ruiz',
      role: 'Site Coordinator',
      channel: 'Team chat',
      received: '11:18 AM',
      status: 'received',
      summary: 'Field survey is complete. Site B access remains unresolved, and no owner was identified for the follow-up.'
    },
    {
      id: 'UPD-004',
      name: 'Dana Brooks',
      role: 'Cost Analyst',
      channel: 'Status tracker',
      received: '11:47 AM',
      status: 'received',
      summary: 'Cost log is current with no approved budget change. One vendor quote remains pending and is expected by August 9.'
    },
    {
      id: 'UPD-005',
      name: 'Lena Ortiz',
      role: 'Vendor Coordinator',
      channel: 'Email',
      received: '12:16 PM',
      status: 'received',
      summary: 'Vendor email lists equipment delivery for August 14, while the project schedule still lists August 12.'
    },
    {
      id: 'UPD-006',
      name: 'Amir Patel',
      role: 'Compliance Lead',
      channel: 'Requested update',
      received: 'Not received',
      status: 'missing',
      summary: 'No compliance update has been received. The workflow must request the missing input rather than assume status.'
    }
  ];

  const state = {
    assembled: false,
    missingResolved: false,
    dateResolved: false,
    ownerResolved: false,
    deliveryDate: '',
    accessOwner: '',
    finalized: false
  };

  const contributorGrid = document.getElementById('contributor-grid');
  const coordinationSection = document.getElementById('coordination-section');
  const coordinationSummary = document.getElementById('coordination-summary');
  const draftBrief = document.getElementById('draft-brief');
  const exceptionList = document.getElementById('coordination-exceptions');
  const registerBody = document.getElementById('action-register-body');
  const finalizeButton = document.getElementById('finalize-package');
  const finalizeGuidance = document.getElementById('finalize-guidance');
  const packageSection = document.getElementById('package-section');
  const packageImpact = document.getElementById('package-impact');
  const finalPackage = document.getElementById('final-package');

  if (!contributorGrid || !coordinationSection || !draftBrief || !exceptionList || !registerBody) return;

  function contributorCard(item) {
    const article = document.createElement('article');
    article.className = `contributor-card ${item.status}`;
    article.innerHTML = `
      <div class="contributor-heading">
        <div><span class="response-status">${item.status === 'received' ? 'Received' : 'Missing'}</span><h3>${item.name}</h3><p>${item.role}</p></div>
        <span class="source-channel">${item.channel}</span>
      </div>
      <p>${item.summary}</p>
      <small>${item.received}</small>`;
    return article;
  }

  function renderContributors() {
    contributorGrid.replaceChildren(...contributors.map(contributorCard));
  }

  function summaryCards() {
    coordinationSummary.innerHTML = `
      <article><strong>5</strong><span>updates prepared</span></article>
      <article><strong>1</strong><span>missing response found</span></article>
      <article><strong>2</strong><span>conflicts or gaps found</span></article>
      <article><strong>3</strong><span>review decisions required</span></article>`;
  }

  function briefMarkup() {
    const delivery = state.dateResolved ? state.deliveryDate : '<mark>Delivery date conflict: August 12 or August 14</mark>';
    const access = state.ownerResolved ? state.accessOwner : '<mark>Site B access owner not established</mark>';
    const compliance = state.missingResolved ? 'Targeted follow-up prepared; response remains pending.' : '<mark>Compliance update not received</mark>';

    return `
      <div class="brief-header"><span class="state-label">Draft for accountable review</span><strong>Overall status: AMBER</strong></div>
      <h4>Client Coordination Update</h4>
      <p><strong>Summary:</strong> Field survey work is complete, the design package is 90% complete, and the cost log shows no approved budget change. Three coordination items require attention before the update is released.</p>
      <h5>Progress</h5>
      <ul>
        <li>Field survey completed.</li>
        <li>Design package at 90%; release targeted after the August 8 redline decision.</li>
        <li>Cost log current; vendor quote expected August 9.</li>
      </ul>
      <h5>Attention required</h5>
      <ul>
        <li>Equipment delivery: ${delivery}</li>
        <li>Site B access follow-up owner: ${access}</li>
        <li>Compliance: ${compliance}</li>
      </ul>
      <h5>Next coordination point</h5>
      <p>Confirm the three exceptions, issue the client update, and retain the action register for follow-through.</p>`;
  }

  function exceptionCard(type, title, explanation, controls) {
    return `
      <article class="exception-card ${state[`${type}Resolved`] ? 'resolved' : ''}" data-exception="${type}">
        <div class="exception-header"><div><span class="exception-label">${state[`${type}Resolved`] ? 'Resolved' : 'Review required'}</span><h4>${title}</h4></div></div>
        <p>${explanation}</p>
        <div class="exception-actions">${controls}</div>
        <p class="resolution-status">${resolutionMessage(type)}</p>
      </article>`;
  }

  function resolutionMessage(type) {
    if (type === 'missing') return state.missingResolved ? 'A focused request is prepared for the compliance lead. No status was invented.' : 'The contributor has not responded.';
    if (type === 'date') return state.dateResolved ? `${state.deliveryDate} selected as the working delivery date for this brief.` : 'Two sources contain different delivery dates.';
    return state.ownerResolved ? `${state.accessOwner} assigned to coordinate the Site B access follow-up.` : 'The issue is known, but ownership is missing.';
  }

  function renderExceptions() {
    exceptionList.innerHTML = [
      exceptionCard(
        'missing',
        'Compliance update is missing',
        'The workflow identified the missing contributor before the client brief was released.',
        `<button type="button" data-resolve="missing" ${state.missingResolved ? 'disabled' : ''}>Prepare Targeted Follow-up</button>`
      ),
      exceptionCard(
        'date',
        'Equipment delivery dates conflict',
        'The vendor email says August 14, while the project schedule says August 12. A person must select the working date or escalate the conflict.',
        `<label>Working date
          <select id="delivery-date" ${state.dateResolved ? 'disabled' : ''}>
            <option value="">Select one</option>
            <option value="August 12" ${state.deliveryDate === 'August 12' ? 'selected' : ''}>August 12 - project schedule</option>
            <option value="August 14" ${state.deliveryDate === 'August 14' ? 'selected' : ''}>August 14 - vendor confirmation</option>
          </select>
        </label><button type="button" data-resolve="date" ${state.dateResolved ? 'disabled' : ''}>Confirm Working Date</button>`
      ),
      exceptionCard(
        'owner',
        'Site B access has no assigned owner',
        'The field issue is visible, but the source did not establish who should coordinate the next step.',
        `<label>Assign coordination owner
          <select id="access-owner" ${state.ownerResolved ? 'disabled' : ''}>
            <option value="">Select one</option>
            <option value="Jordan Lee, Project Lead" ${state.accessOwner === 'Jordan Lee, Project Lead' ? 'selected' : ''}>Jordan Lee, Project Lead</option>
            <option value="Marco Ruiz, Site Coordinator" ${state.accessOwner === 'Marco Ruiz, Site Coordinator' ? 'selected' : ''}>Marco Ruiz, Site Coordinator</option>
            <option value="Client access representative" ${state.accessOwner === 'Client access representative' ? 'selected' : ''}>Client access representative</option>
          </select>
        </label><button type="button" data-resolve="owner" ${state.ownerResolved ? 'disabled' : ''}>Confirm Owner</button>`
      )
    ].join('');
  }

  function renderRegister() {
    const rows = [
      ['Issue consolidated client update', 'Jordan Lee', 'Today, 3:00 PM', state.finalized ? 'Ready to issue' : 'Draft prepared'],
      ['Complete design redline decision', 'Priya Shah', 'August 8', 'In progress'],
      ['Obtain pending vendor quote', 'Dana Brooks', 'August 9', 'In progress'],
      ['Confirm equipment delivery date', state.dateResolved ? 'Lena Ortiz' : 'Review required', state.dateResolved ? state.deliveryDate : 'Conflicting dates', state.dateResolved ? 'Confirmed for brief' : 'Exception'],
      ['Coordinate Site B access follow-up', state.ownerResolved ? state.accessOwner : 'Unassigned', 'Next business day', state.ownerResolved ? 'Owner confirmed' : 'Exception'],
      ['Provide compliance status', 'Amir Patel', 'Before release if available', state.missingResolved ? 'Follow-up prepared' : 'Missing response']
    ];

    registerBody.innerHTML = rows.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td></tr>`).join('');
  }

  function updateReadiness() {
    const ready = state.missingResolved && state.dateResolved && state.ownerResolved;
    finalizeButton.disabled = !ready;
    finalizeGuidance.textContent = ready
      ? 'All exceptions have an accountable next step. The coordination package is ready to finalize.'
      : `Resolve ${[state.missingResolved, state.dateResolved, state.ownerResolved].filter((value) => !value).length} remaining exception${[state.missingResolved, state.dateResolved, state.ownerResolved].filter((value) => !value).length === 1 ? '' : 's'} before finalizing.`;
  }

  function refreshWorkspace() {
    draftBrief.innerHTML = briefMarkup();
    renderExceptions();
    renderRegister();
    updateReadiness();
  }

  function assembleUpdate() {
    state.assembled = true;
    coordinationSection.hidden = false;
    packageSection.hidden = true;
    summaryCards();
    refreshWorkspace();
    coordinationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resolveException(event) {
    const button = event.target.closest('[data-resolve]');
    if (!button) return;
    const type = button.dataset.resolve;

    if (type === 'missing') state.missingResolved = true;
    if (type === 'date') {
      const select = document.getElementById('delivery-date');
      if (!select?.value) {
        select?.focus();
        return;
      }
      state.deliveryDate = select.value;
      state.dateResolved = true;
    }
    if (type === 'owner') {
      const select = document.getElementById('access-owner');
      if (!select?.value) {
        select?.focus();
        return;
      }
      state.accessOwner = select.value;
      state.ownerResolved = true;
    }

    refreshWorkspace();
  }

  function briefText() {
    return `# Client Coordination Brief

Generated: ${new Date().toISOString()}
Data classification: Synthetic public demonstration

## Overall status
AMBER

## Executive summary
Field survey work is complete, the design package is 90% complete, and the cost log shows no approved budget change. Equipment delivery is being managed to ${state.deliveryDate}. ${state.accessOwner} owns the Site B access follow-up. A targeted request has been prepared for the missing compliance update.

## Progress
- Field survey completed.
- Design package at 90%; redline decision due August 8.
- Cost log current; vendor quote expected August 9.

## Action register
- Issue consolidated client update | Jordan Lee | Today, 3:00 PM
- Complete design redline decision | Priya Shah | August 8
- Obtain pending vendor quote | Dana Brooks | August 9
- Confirm equipment delivery | Lena Ortiz | ${state.deliveryDate}
- Coordinate Site B access | ${state.accessOwner} | Next business day
- Provide compliance status | Amir Patel | Follow-up prepared

## Follow-up request
Amir, please provide the current compliance status, any open requirements, and any dates that could affect the client update. The brief will retain the item as pending until a confirmed response is received.

## Evidence boundary
This package was produced from fictional inputs. Routine facts were prepared together, while missing, conflicting, and unassigned items required explicit review.`;
  }

  function evidencePayload() {
    return {
      workflow: 'AI Workflow Enablement - Meeting Intelligence Coordination Demonstration',
      dataClassification: 'Synthetic public demonstration',
      generatedAt: new Date().toISOString(),
      inputs: contributors,
      reviewSummary: {
        contributorsTracked: 6,
        updatesReceived: 5,
        routineFactsPrepared: 7,
        exceptionsReviewed: 3
      },
      decisions: {
        deliveryDate: state.deliveryDate,
        siteAccessOwner: state.accessOwner,
        complianceFollowUpPrepared: state.missingResolved
      },
      outputs: ['Client coordination brief', 'Action and exception register', 'Targeted follow-up request']
    };
  }

  function finalizePackage() {
    if (!(state.missingResolved && state.dateResolved && state.ownerResolved)) return;
    state.finalized = true;
    renderRegister();

    packageImpact.innerHTML = `
      <article><strong>6</strong><span>inputs tracked</span></article>
      <article><strong>7</strong><span>routine facts prepared</span></article>
      <article><strong>3</strong><span>exceptions reviewed</span></article>
      <article><strong>3</strong><span>usable outputs produced</span></article>`;

    finalPackage.innerHTML = `
      <article class="package-card"><span class="state-label">Output 1</span><h3>Client-ready status brief</h3><p>One concise narrative combining progress, current status, attention items, and next steps.</p><div class="package-preview">Overall status: AMBER<br>Design: 90% complete<br>Delivery: ${state.deliveryDate}<br>Site B access owner: ${state.accessOwner}<br>Compliance: follow-up pending</div></article>
      <article class="package-card"><span class="state-label">Output 2</span><h3>Action and exception register</h3><p>A single follow-through record with owners, dates, current status, and the three reviewed exceptions.</p><div class="package-preview">6 tracked actions<br>0 unassigned coordination items<br>1 targeted response still pending</div></article>
      <article class="package-card"><span class="state-label">Output 3</span><h3>Targeted follow-up request</h3><p>A specific request to the missing contributor instead of another broad status-chasing message.</p><div class="package-preview">Request: compliance status, open requirements, and dates affecting the client update.</div></article>`;

    packageSection.hidden = false;
    packageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function resetDemo() {
    Object.assign(state, {
      assembled: false,
      missingResolved: false,
      dateResolved: false,
      ownerResolved: false,
      deliveryDate: '',
      accessOwner: '',
      finalized: false
    });
    coordinationSection.hidden = true;
    packageSection.hidden = true;
    finalizeButton.disabled = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('assemble-update')?.addEventListener('click', assembleUpdate);
  document.getElementById('reset-coordination')?.addEventListener('click', resetDemo);
  exceptionList.addEventListener('click', resolveException);
  finalizeButton?.addEventListener('click', finalizePackage);
  document.getElementById('download-brief')?.addEventListener('click', () => downloadFile('client-coordination-brief.md', briefText(), 'text/markdown'));
  document.getElementById('download-evidence')?.addEventListener('click', () => downloadFile('meeting-intelligence-evidence.json', JSON.stringify(evidencePayload(), null, 2), 'application/json'));

  renderContributors();
})();
