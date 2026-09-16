(() => {
  'use strict';

  const requests = [
    { id: 'REQ-101', from: 'A. Nguyen', subject: 'Need access to the safety refresher course', category: 'Training access', owner: 'Training Coordinator', target: '2 business days', status: 'routine' },
    { id: 'REQ-102', from: 'J. Patel', subject: 'Where is the approved valve drawing revision?', category: 'Document lookup', owner: 'Document Control', target: '1 business day', status: 'routine' },
    { id: 'REQ-103', from: 'M. Rivera', subject: 'My department is wrong on the project roster', category: 'Data correction', owner: 'Project Administrator', target: '2 business days', status: 'routine' },
    { id: 'REQ-104', from: 'S. Brooks', subject: 'Status of invoice 10482', category: 'Invoice status', owner: 'Commercial Support', target: '1 business day', status: 'routine' },
    { id: 'REQ-105', from: 'L. Chen', subject: 'Add Noor to the weekly coordination distribution', category: 'Distribution update', owner: 'Project Administrator', target: '1 business day', status: 'routine' },
    { id: 'REQ-106', from: 'S. Brooks', subject: 'Following up again: invoice 10482 status?', category: 'Probable duplicate', owner: 'Review required', target: 'Hold for review', status: 'duplicate' },
    { id: 'REQ-107', from: 'D. Morgan', subject: 'Need the program snapshot ASAP — executive asking', category: 'Status request', owner: 'PMO Support', target: 'Priority unclear', status: 'priority' },
    { id: 'REQ-108', from: 'K. James', subject: 'Please send the employee accommodation documents', category: 'Permission-sensitive records', owner: 'Authorized owner required', target: 'Do not route generally', status: 'sensitive' }
  ];

  const state = { triaged: false, routineConfirmed: false, duplicateResolved: false, priorityResolved: false, sensitiveResolved: false, priority: '', sensitiveOwner: '', committed: false };

  const sourceGrid = document.getElementById('triage-source-grid');
  const workspace = document.getElementById('triage-workspace');
  const metrics = document.getElementById('triage-metrics');
  const routineBody = document.getElementById('triage-routine-body');
  const exceptionList = document.getElementById('triage-exception-list');
  const confirmRoutine = document.getElementById('confirm-triage-routine');
  const commitButton = document.getElementById('commit-triage');
  const guidance = document.getElementById('triage-guidance');
  const output = document.getElementById('triage-output');
  const outputMetrics = document.getElementById('triage-output-metrics');
  const outputCards = document.getElementById('triage-output-cards');
  if (!sourceGrid || !workspace || !routineBody || !exceptionList || !commitButton) return;

  function sourceCard(item) {
    const article = document.createElement('article');
    article.className = 'source-card';
    article.innerHTML = `<div class="source-meta"><span>${item.id}</span><span>${item.from}</span></div><h3>${item.subject}</h3><p>${item.status === 'routine' ? 'Routine pattern available' : 'Review condition detected'}</p>`;
    return article;
  }

  function renderSources() { sourceGrid.replaceChildren(...requests.map(sourceCard)); }

  function renderRoutine() {
    routineBody.innerHTML = requests.filter((item) => item.status === 'routine').map((item) => `<tr><td>${item.id}</td><td>${item.subject}</td><td>${item.category}</td><td>${item.owner}</td><td>${item.target}</td></tr>`).join('');
  }

  function exceptionCard(type, title, explanation, controls, resolvedText) {
    const resolved = state[`${type}Resolved`];
    return `<article class="exception-card ${resolved ? 'resolved' : ''}" data-exception="${type}"><div class="exception-header"><div><span class="exception-label">${resolved ? 'Resolved' : 'Review required'}</span><h4>${title}</h4></div></div><p>${explanation}</p><div class="exception-actions">${controls}</div><p class="resolution-status">${resolved ? resolvedText : 'Awaiting an accountable triage decision.'}</p></article>`;
  }

  function renderExceptions() {
    exceptionList.innerHTML = [
      exceptionCard('duplicate', 'REQ-106 is a probable duplicate', 'Requester, invoice number, and intent match REQ-104. The workflow surfaces the match but does not delete or merge work without review.', `<button type="button" data-triage-resolve="duplicate" ${state.duplicateResolved ? 'disabled' : ''}>Link to REQ-104 and Close Duplicate</button>`, 'REQ-106 linked to REQ-104 and closed as a duplicate; original message remains in history.'),
      exceptionCard('priority', 'REQ-107 uses urgency language without a service priority', '“ASAP” and “executive asking” indicate urgency, but the request does not state a deadline or consequence. A reviewer must set the service target.', `<label>Service priority<select id="triage-priority" ${state.priorityResolved ? 'disabled' : ''}><option value="">Select one</option><option value="P2 · 4 business hours" ${state.priority.startsWith('P2') ? 'selected' : ''}>P2 · 4 business hours</option><option value="P3 · 1 business day" ${state.priority.startsWith('P3') ? 'selected' : ''}>P3 · 1 business day</option></select></label><button type="button" data-triage-resolve="priority" ${state.priorityResolved ? 'disabled' : ''}>Confirm Priority</button>`, `${state.priority} recorded for REQ-107.`),
      exceptionCard('sensitive', 'REQ-108 requests permission-sensitive records', 'Employee accommodation documents must not enter the general support queue. The workflow holds the request and requires an authorized destination.', `<label>Authorized owner<select id="triage-sensitive-owner" ${state.sensitiveResolved ? 'disabled' : ''}><option value="">Select one</option><option value="HR Accommodation Owner" ${state.sensitiveOwner === 'HR Accommodation Owner' ? 'selected' : ''}>HR Accommodation Owner</option><option value="Privacy & Records Owner" ${state.sensitiveOwner === 'Privacy & Records Owner' ? 'selected' : ''}>Privacy & Records Owner</option></select></label><button type="button" data-triage-resolve="sensitive" ${state.sensitiveResolved ? 'disabled' : ''}>Route to Authorized Owner</button>`, `REQ-108 held outside the general queue and routed to ${state.sensitiveOwner}.`)
    ].join('');
  }

  function updateReadiness() {
    const ready = state.routineConfirmed && state.duplicateResolved && state.priorityResolved && state.sensitiveResolved;
    commitButton.disabled = !ready;
    const remaining = [state.routineConfirmed, state.duplicateResolved, state.priorityResolved, state.sensitiveResolved].filter((value) => !value).length;
    guidance.textContent = ready ? 'Routine assignments are confirmed and every exception has an explicit disposition. The queue is ready to commit.' : `${remaining} control${remaining === 1 ? '' : 's'} remain before the queue can be committed.`;
  }

  function triageBatch() {
    state.triaged = true;
    workspace.hidden = false;
    output.hidden = true;
    metrics.innerHTML = '<article><strong>8</strong><span>requests received</span></article><article><strong>5</strong><span>routine assignments prepared</span></article><article><strong>3</strong><span>exceptions isolated</span></article><article><strong>0</strong><span>unsafe auto-decisions</span></article>';
    renderRoutine(); renderExceptions(); updateReadiness();
    workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function confirmRoutineAssignments() {
    state.routineConfirmed = true;
    confirmRoutine.disabled = true;
    confirmRoutine.textContent = 'Routine Assignments Confirmed';
    updateReadiness();
  }

  function resolveException(event) {
    const button = event.target.closest('[data-triage-resolve]');
    if (!button) return;
    const type = button.dataset.triageResolve;
    if (type === 'duplicate') state.duplicateResolved = true;
    if (type === 'priority') {
      const select = document.getElementById('triage-priority');
      if (!select?.value) return select?.focus();
      state.priority = select.value; state.priorityResolved = true;
    }
    if (type === 'sensitive') {
      const select = document.getElementById('triage-sensitive-owner');
      if (!select?.value) return select?.focus();
      state.sensitiveOwner = select.value; state.sensitiveResolved = true;
    }
    renderExceptions(); updateReadiness();
  }

  function queueText() {
    return `# Synthetic Operations Support Queue\n\nREQ-101 | Training access | Training Coordinator | 2 business days\nREQ-102 | Document lookup | Document Control | 1 business day\nREQ-103 | Data correction | Project Administrator | 2 business days\nREQ-104 | Invoice status | Commercial Support | 1 business day\nREQ-105 | Distribution update | Project Administrator | 1 business day\nREQ-106 | Duplicate of REQ-104 | Closed and linked\nREQ-107 | Status request | PMO Support | ${state.priority}\nREQ-108 | Permission-sensitive records | ${state.sensitiveOwner} | Held outside general queue\n\nEvidence boundary: all requests are fictional and all exception decisions were explicitly reviewed.`;
  }

  function evidencePayload() {
    return { workflow: 'AI Workflow Enablement - Work Request Triage Demonstration', dataClassification: 'Synthetic public demonstration', inputs: requests, routineAssignmentsConfirmed: state.routineConfirmed, decisions: { duplicate: 'REQ-106 linked to REQ-104 and closed', priority: state.priority, sensitiveOwner: state.sensitiveOwner }, outputSummary: { requestsReceived: 8, activeControlledItems: 7, duplicateDispositions: 1, reviewDecisions: 3 } };
  }

  function commitQueue() {
    if (!(state.routineConfirmed && state.duplicateResolved && state.priorityResolved && state.sensitiveResolved)) return;
    state.committed = true;
    outputMetrics.innerHTML = '<article><strong>8</strong><span>requests accounted for</span></article><article><strong>7</strong><span>controlled work items</span></article><article><strong>1</strong><span>duplicate linked and closed</span></article><article><strong>3</strong><span>review decisions recorded</span></article>';
    outputCards.innerHTML = `<article class="output-card"><span class="state-label">Output 1</span><h3>Controlled service queue</h3><p>Every active request has a category, accountable owner, and service target.</p><div class="output-preview">5 routine assignments<br>REQ-107: ${state.priority}<br>7 controlled work items</div></article><article class="output-card"><span class="state-label">Output 2</span><h3>Exception history</h3><p>Duplicate, priority, and permission-sensitive handling remain visible instead of disappearing into informal decisions.</p><div class="output-preview">REQ-106 → REQ-104<br>REQ-108 → ${state.sensitiveOwner}</div></article><article class="output-card"><span class="state-label">Output 3</span><h3>Service-control evidence</h3><p>The final queue can be audited against the original requests and the reviewer dispositions.</p><div class="output-preview">8 originals preserved<br>3 judgment calls recorded<br>0 sensitive records routed generally</div></article>`;
    output.hidden = false; output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function download(filename, content, type) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 0); }

  function reset() {
    Object.assign(state, { triaged: false, routineConfirmed: false, duplicateResolved: false, priorityResolved: false, sensitiveResolved: false, priority: '', sensitiveOwner: '', committed: false });
    workspace.hidden = true; output.hidden = true; commitButton.disabled = true; confirmRoutine.disabled = false; confirmRoutine.textContent = 'Confirm Routine Assignments';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('triage-batch')?.addEventListener('click', triageBatch);
  confirmRoutine?.addEventListener('click', confirmRoutineAssignments);
  exceptionList.addEventListener('click', resolveException);
  commitButton.addEventListener('click', commitQueue);
  document.getElementById('reset-triage')?.addEventListener('click', reset);
  document.getElementById('download-triage-queue')?.addEventListener('click', () => download('synthetic-operations-support-queue.md', queueText(), 'text/markdown'));
  document.getElementById('download-triage-evidence')?.addEventListener('click', () => download('synthetic-request-triage-evidence.json', JSON.stringify(evidencePayload(), null, 2), 'application/json'));
  renderSources();
})();
