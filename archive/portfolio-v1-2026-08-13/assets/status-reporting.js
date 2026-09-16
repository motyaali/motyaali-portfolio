(() => {
  'use strict';

  const sources = [
    { id: 'SRC-001', type: 'Schedule snapshot', owner: 'Project Controls', updated: 'Aug 12 · 9:05 AM', fact: 'Commissioning readiness milestone is listed as August 20. Design release is complete.' },
    { id: 'SRC-002', type: 'Field progress note', owner: 'Site Coordinator', updated: 'Aug 12 · 9:32 AM', fact: 'Functional testing is 80% complete. No safety stoppage is open.' },
    { id: 'SRC-003', type: 'Cost forecast', owner: 'Cost Analyst', updated: 'Aug 12 · 10:10 AM', fact: 'Forecast is $42,000 above baseline; explanatory narrative is marked pending validation.' },
    { id: 'SRC-004', type: 'Approved change log', owner: 'Commercial Lead', updated: 'Aug 12 · 10:28 AM', fact: 'Change request CR-014 is approved for $18,000 and is included in the current forecast.' },
    { id: 'SRC-005', type: 'Risk register', owner: 'Program PMO', updated: 'Aug 12 · 10:51 AM', fact: 'Risk R-07 remains High. Mitigation is due August 14, but the owner field is blank.' },
    { id: 'SRC-006', type: 'Vendor readiness update', owner: 'Vendor Coordinator', updated: 'Aug 12 · 11:16 AM', fact: 'Vendor readiness is confirmed for August 22, which conflicts with the August 20 schedule milestone.' }
  ];

  const state = {
    prepared: false,
    milestoneResolved: false,
    varianceResolved: false,
    riskResolved: false,
    milestoneDate: '',
    varianceTreatment: '',
    riskOwner: '',
    finalized: false
  };

  const sourceGrid = document.getElementById('status-source-grid');
  const workspace = document.getElementById('status-workspace');
  const metrics = document.getElementById('status-metrics');
  const preview = document.getElementById('status-report-preview');
  const exceptionList = document.getElementById('status-exception-list');
  const finalizeButton = document.getElementById('finalize-status');
  const guidance = document.getElementById('status-guidance');
  const output = document.getElementById('status-output');
  const outputMetrics = document.getElementById('status-output-metrics');
  const outputCards = document.getElementById('status-output-cards');

  if (!sourceGrid || !workspace || !preview || !exceptionList || !finalizeButton) return;

  function sourceCard(item) {
    const article = document.createElement('article');
    article.className = 'source-card';
    article.innerHTML = `<div class="source-meta"><span>${item.id}</span><span>${item.owner}</span></div><h3>${item.type}</h3><p>${item.fact}</p><small>${item.updated}</small>`;
    return article;
  }

  function renderSources() {
    sourceGrid.replaceChildren(...sources.map(sourceCard));
  }

  function reportMarkup() {
    const milestone = state.milestoneResolved ? state.milestoneDate : '<mark>Milestone conflict: August 20 schedule vs. August 22 vendor readiness</mark>';
    const variance = state.varianceResolved ? state.varianceTreatment : '<mark>$42,000 forecast variance has no validated explanatory narrative</mark>';
    const riskOwner = state.riskResolved ? state.riskOwner : '<mark>Risk R-07 has no accountable owner</mark>';
    return `
      <span class="state-label">Draft for accountable review</span>
      <h4>Weekly Program Status · August 12, 2026</h4>
      <p><strong>Overall status: AMBER.</strong> Design release is complete, functional testing is 80% complete, and no safety stoppage is open. Three reporting items require review before publication.</p>
      <h5>Schedule</h5><p>Commissioning readiness: ${milestone}.</p>
      <h5>Cost</h5><p>Current forecast is $42,000 above baseline. ${variance}.</p>
      <h5>Risk</h5><p>R-07 remains High; mitigation is due August 14. Accountable owner: ${riskOwner}.</p>
      <h5>Progress</h5><ul><li>Design release complete.</li><li>Functional testing 80% complete.</li><li>No active safety stoppage.</li><li>Approved change CR-014: $18,000.</li></ul>`;
  }

  function exceptionCard(type, title, explanation, controls, resolvedText) {
    const resolved = state[`${type}Resolved`];
    return `<article class="exception-card ${resolved ? 'resolved' : ''}" data-exception="${type}">
      <div class="exception-header"><div><span class="exception-label">${resolved ? 'Resolved' : 'Review required'}</span><h4>${title}</h4></div></div>
      <p>${explanation}</p><div class="exception-actions">${controls}</div>
      <p class="resolution-status">${resolved ? resolvedText : 'Awaiting an accountable reporting decision.'}</p></article>`;
  }

  function renderExceptions() {
    exceptionList.innerHTML = [
      exceptionCard('milestone', 'Milestone dates conflict', 'The controlled schedule lists August 20 while the vendor readiness update lists August 22. The workflow cannot silently choose one.', `<label>Working milestone date<select id="status-milestone" ${state.milestoneResolved ? 'disabled' : ''}><option value="">Select one</option><option value="August 20" ${state.milestoneDate === 'August 20' ? 'selected' : ''}>August 20 · controlled schedule</option><option value="August 22" ${state.milestoneDate === 'August 22' ? 'selected' : ''}>August 22 · vendor readiness update</option></select></label><button type="button" data-status-resolve="milestone" ${state.milestoneResolved ? 'disabled' : ''}>Confirm Working Date</button>`, `${state.milestoneDate} selected as the working milestone for this report.`),
      exceptionCard('variance', 'Forecast variance explanation is not validated', 'The cost forecast shows +$42,000. CR-014 explains $18,000, but the remaining variance narrative is explicitly pending validation.', `<label>Reporting treatment<select id="status-variance" ${state.varianceResolved ? 'disabled' : ''}><option value="">Select one</option><option value="Report +$42,000 variance; explanation pending Finance validation" ${state.varianceTreatment.startsWith('Report +$42,000') ? 'selected' : ''}>Report full variance; explanation pending</option><option value="Report $18,000 approved change separately; hold remaining variance narrative" ${state.varianceTreatment.startsWith('Report $18,000') ? 'selected' : ''}>Separate approved change; hold remaining narrative</option></select></label><button type="button" data-status-resolve="variance" ${state.varianceResolved ? 'disabled' : ''}>Confirm Treatment</button>`, state.varianceTreatment),
      exceptionCard('risk', 'High risk has no owner', 'Risk R-07 is current and its mitigation date is known, but the approved register does not identify who owns the follow-up.', `<label>Assign reporting owner<select id="status-risk-owner" ${state.riskResolved ? 'disabled' : ''}><option value="">Select one</option><option value="Jordan Lee · Project Lead" ${state.riskOwner === 'Jordan Lee · Project Lead' ? 'selected' : ''}>Jordan Lee · Project Lead</option><option value="Priya Shah · Program PMO" ${state.riskOwner === 'Priya Shah · Program PMO' ? 'selected' : ''}>Priya Shah · Program PMO</option><option value="Marco Ruiz · Site Coordinator" ${state.riskOwner === 'Marco Ruiz · Site Coordinator' ? 'selected' : ''}>Marco Ruiz · Site Coordinator</option></select></label><button type="button" data-status-resolve="risk" ${state.riskResolved ? 'disabled' : ''}>Confirm Owner</button>`, `${state.riskOwner} assigned to the R-07 follow-up.`)
    ].join('');
  }

  function updateReadiness() {
    const unresolved = [state.milestoneResolved, state.varianceResolved, state.riskResolved].filter((value) => !value).length;
    finalizeButton.disabled = unresolved !== 0;
    guidance.textContent = unresolved === 0 ? 'All reporting exceptions have an explicit disposition. The package is ready to finalize.' : `Resolve ${unresolved} remaining reporting exception${unresolved === 1 ? '' : 's'} before finalizing.`;
  }

  function refresh() {
    preview.innerHTML = reportMarkup();
    renderExceptions();
    updateReadiness();
  }

  function prepare() {
    state.prepared = true;
    workspace.hidden = false;
    output.hidden = true;
    metrics.innerHTML = '<article><strong>6</strong><span>governed source records</span></article><article><strong>7</strong><span>routine facts prepared</span></article><article><strong>3</strong><span>exceptions isolated</span></article><article><strong>1</strong><span>draft report assembled</span></article>';
    refresh();
    workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resolve(event) {
    const button = event.target.closest('[data-status-resolve]');
    if (!button) return;
    const type = button.dataset.statusResolve;
    if (type === 'milestone') {
      const select = document.getElementById('status-milestone');
      if (!select?.value) return select?.focus();
      state.milestoneDate = select.value;
      state.milestoneResolved = true;
    }
    if (type === 'variance') {
      const select = document.getElementById('status-variance');
      if (!select?.value) return select?.focus();
      state.varianceTreatment = select.value;
      state.varianceResolved = true;
    }
    if (type === 'risk') {
      const select = document.getElementById('status-risk-owner');
      if (!select?.value) return select?.focus();
      state.riskOwner = select.value;
      state.riskResolved = true;
    }
    refresh();
  }

  function reportText() {
    return `# Weekly Program Status\n\nData classification: Synthetic public demonstration\n\nOverall status: AMBER\n\n## Schedule\nCommissioning readiness: ${state.milestoneDate}.\n\n## Cost\nForecast: +$42,000. ${state.varianceTreatment}.\n\n## Risk\nR-07 remains High; mitigation due August 14; owner: ${state.riskOwner}.\n\n## Progress\n- Design release complete\n- Functional testing 80% complete\n- No active safety stoppage\n- Approved change CR-014: $18,000\n\n## Evidence boundary\nAll facts are fictional. The workflow prepared routine facts and required explicit decisions for conflicting, unsupported, or unowned reporting items.`;
  }

  function evidencePayload() {
    return { workflow: 'AI Workflow Enablement - Project Status Reporting Demonstration', dataClassification: 'Synthetic public demonstration', inputs: sources, preparedFacts: 7, exceptionsReviewed: 3, decisions: { milestoneDate: state.milestoneDate, varianceTreatment: state.varianceTreatment, riskOwner: state.riskOwner }, outputs: ['Weekly status report', 'Reporting exception log', 'Action and ownership record'] };
  }

  function finalize() {
    if (!(state.milestoneResolved && state.varianceResolved && state.riskResolved)) return;
    state.finalized = true;
    outputMetrics.innerHTML = '<article><strong>6</strong><span>source records retained</span></article><article><strong>7</strong><span>routine facts prepared</span></article><article><strong>3</strong><span>judgment calls recorded</span></article><article><strong>3</strong><span>usable outputs produced</span></article>';
    outputCards.innerHTML = `<article class="output-card"><span class="state-label">Output 1</span><h3>Reviewed weekly status report</h3><p>One concise narrative built from the governed source set.</p><div class="output-preview">Status: AMBER<br>Milestone: ${state.milestoneDate}<br>Forecast: +$42,000</div></article><article class="output-card"><span class="state-label">Output 2</span><h3>Reporting exception log</h3><p>The three items requiring judgment remain traceable with their final disposition.</p><div class="output-preview">3 exceptions resolved<br>0 silent assumptions</div></article><article class="output-card"><span class="state-label">Output 3</span><h3>Action and ownership record</h3><p>Unresolved operational follow-up stays attached to an accountable owner.</p><div class="output-preview">R-07 owner: ${state.riskOwner}<br>Mitigation due: August 14</div></article>`;
    output.hidden = false;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function reset() {
    Object.assign(state, { prepared: false, milestoneResolved: false, varianceResolved: false, riskResolved: false, milestoneDate: '', varianceTreatment: '', riskOwner: '', finalized: false });
    workspace.hidden = true; output.hidden = true; finalizeButton.disabled = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('prepare-status')?.addEventListener('click', prepare);
  document.getElementById('reset-status')?.addEventListener('click', reset);
  exceptionList.addEventListener('click', resolve);
  finalizeButton.addEventListener('click', finalize);
  document.getElementById('download-status-report')?.addEventListener('click', () => download('synthetic-weekly-program-status.md', reportText(), 'text/markdown'));
  document.getElementById('download-status-evidence')?.addEventListener('click', () => download('synthetic-status-reporting-evidence.json', JSON.stringify(evidencePayload(), null, 2), 'application/json'));

  renderSources();
})();
