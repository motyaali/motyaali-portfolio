(() => {
  'use strict';

  const documents = [
    {
      id: 'DOC-001',
      file: 'Pump Station 4 Weekly Report.pdf',
      sender: 'field.team@example.com',
      received: 'Aug 3, 2026 · 8:42 AM',
      status: 'routine',
      type: 'Weekly Progress Report',
      project: 'Pump Station 4',
      proposedName: 'PS4_Weekly-Progress-Report_2026-08-03.pdf',
      destination: 'Projects / Pump Station 4 / Progress Reports',
      confidence: 'High',
      evidence: 'Project code and report type appear in the filename and first page.'
    },
    {
      id: 'DOC-002',
      file: 'Invoice 10482 - North Bay Testing.pdf',
      sender: 'billing@northbaytesting.example',
      received: 'Aug 3, 2026 · 9:06 AM',
      status: 'routine',
      type: 'Vendor Invoice',
      project: 'Water Quality Lab Upgrade',
      proposedName: 'WQLU_Invoice_10482_North-Bay-Testing.pdf',
      destination: 'Projects / Water Quality Lab Upgrade / Commercial',
      confidence: 'High',
      evidence: 'Purchase order and project code match the approved vendor register.'
    },
    {
      id: 'DOC-003',
      file: 'Training Attendance - Confined Space.xlsx',
      sender: 'safety.coordinator@example.com',
      received: 'Aug 3, 2026 · 9:31 AM',
      status: 'routine',
      type: 'Training Record',
      project: 'Programwide',
      proposedName: 'Programwide_Training-Record_Confined-Space_2026-08-02.xlsx',
      destination: 'Program / Safety / Training Records',
      confidence: 'High',
      evidence: 'The approved training title and attendance date are present in the workbook.'
    },
    {
      id: 'DOC-004',
      file: 'Pump Station 4 Weekly Report (1).pdf',
      sender: 'field.team@example.com',
      received: 'Aug 3, 2026 · 9:44 AM',
      status: 'duplicate',
      type: 'Weekly Progress Report',
      project: 'Pump Station 4',
      proposedName: 'PS4_Weekly-Progress-Report_2026-08-03.pdf',
      destination: 'Hold for duplicate review',
      confidence: 'High',
      evidence: 'Filename, document date, page count, and content fingerprint match DOC-001.'
    },
    {
      id: 'DOC-005',
      file: 'Submittal - Valve Data.pdf',
      sender: 'supplier@example.com',
      received: 'Aug 3, 2026 · 10:02 AM',
      status: 'missing',
      type: 'Technical Submittal',
      project: '',
      proposedName: 'Project-Required_Technical-Submittal_Valve-Data.pdf',
      destination: 'Pending sender information',
      confidence: 'Low',
      evidence: 'Document type is clear, but no project number, contract number, or purchase order is present.'
    },
    {
      id: 'DOC-006',
      file: 'Site Photos and Notes.zip',
      sender: 'inspector@example.com',
      received: 'Aug 3, 2026 · 10:18 AM',
      status: 'classification',
      type: 'Classification required',
      project: 'Reservoir Seismic Retrofit',
      proposedName: 'RSR_Classification-Required_2026-08-03.zip',
      destination: 'Review required',
      confidence: 'Medium',
      evidence: 'Project is identified, but the package contains both inspection notes and general site photos.'
    }
  ];

  const state = {
    processed: false,
    routineConfirmed: false,
    duplicateResolved: false,
    missingResolved: false,
    classificationResolved: false,
    classification: ''
  };

  const incomingGrid = document.getElementById('incoming-grid');
  const processingSection = document.getElementById('processing-section');
  const routingSection = document.getElementById('routing-section');
  const impactSection = document.getElementById('impact-section');
  const routineList = document.getElementById('routine-list');
  const exceptionList = document.getElementById('exception-list');
  const intakeSummary = document.getElementById('intake-summary');
  const completeRoutingButton = document.getElementById('complete-routing');
  const routingGuidance = document.getElementById('routing-guidance');
  const routingResult = document.getElementById('routing-result');
  const impactSummary = document.getElementById('impact-summary');

  if (!incomingGrid || !processingSection || !routineList || !exceptionList) return;

  function incomingCard(documentItem) {
    const article = document.createElement('article');
    article.className = 'incoming-card';
    article.innerHTML = `
      <span class="file-icon" aria-hidden="true">${documentItem.file.split('.').pop().toUpperCase()}</span>
      <div>
        <h3>${documentItem.file}</h3>
        <p>${documentItem.sender}</p>
        <small>${documentItem.received}</small>
      </div>`;
    return article;
  }

  function renderIncoming() {
    incomingGrid.replaceChildren(...documents.map(incomingCard));
  }

  function routineRow(documentItem) {
    const article = document.createElement('article');
    article.className = 'routine-row';
    article.innerHTML = `
      <div class="routine-main">
        <span class="status-dot ready" aria-hidden="true"></span>
        <div><h4>${documentItem.file}</h4><p>${documentItem.type} · ${documentItem.project}</p></div>
      </div>
      <dl>
        <div><dt>Proposed name</dt><dd>${documentItem.proposedName}</dd></div>
        <div><dt>Destination</dt><dd>${documentItem.destination}</dd></div>
        <div><dt>Evidence</dt><dd>${documentItem.evidence}</dd></div>
      </dl>`;
    return article;
  }

  function exceptionCard(documentItem) {
    const article = document.createElement('article');
    article.className = 'exception-card';
    article.dataset.exception = documentItem.status;

    let control = '';
    if (documentItem.status === 'duplicate') {
      control = `<button type="button" data-resolve="duplicate">Hold Duplicate</button>`;
    } else if (documentItem.status === 'missing') {
      control = `<button type="button" data-resolve="missing">Create Information Request</button>`;
    } else {
      control = `
        <label>Choose the controlling classification
          <select id="classification-choice">
            <option value="">Select one</option>
            <option value="Inspection Record">Inspection Record</option>
            <option value="General Site Documentation">General Site Documentation</option>
          </select>
        </label>
        <button type="button" data-resolve="classification">Confirm Classification</button>`;
    }

    const issueLabel = documentItem.status === 'duplicate'
      ? 'Probable duplicate'
      : documentItem.status === 'missing'
        ? 'Required identifier missing'
        : 'Document family is uncertain';

    article.innerHTML = `
      <div class="exception-header">
        <div><span class="exception-label">${issueLabel}</span><h4>${documentItem.file}</h4></div>
        <span class="confidence ${documentItem.confidence.toLowerCase()}">${documentItem.confidence} confidence</span>
      </div>
      <dl>
        <div><dt>What the workflow knows</dt><dd>${documentItem.evidence}</dd></div>
        <div><dt>Safe next step</dt><dd>${documentItem.destination}</dd></div>
      </dl>
      <div class="exception-actions">${control}</div>
      <p class="resolution-status" aria-live="polite">Awaiting a reviewer decision.</p>`;
    return article;
  }

  function updateSummary() {
    intakeSummary.innerHTML = `
      <article><strong>3</strong><span>routine records prepared</span></article>
      <article><strong>1</strong><span>probable duplicate detected</span></article>
      <article><strong>1</strong><span>missing-information case</span></article>
      <article><strong>1</strong><span>classification exception</span></article>`;
  }

  function updateRoutingReadiness() {
    const ready = state.routineConfirmed && state.duplicateResolved && state.missingResolved && state.classificationResolved;
    completeRoutingButton.disabled = !ready;
    routingGuidance.textContent = ready
      ? 'All required controls are satisfied. Complete the routing to see the resulting library and exception queue.'
      : 'Confirm the routine group and resolve each exception before completing the routing.';
  }

  function markResolved(button, message) {
    const card = button.closest('.exception-card');
    card.classList.add('resolved');
    button.disabled = true;
    const status = card.querySelector('.resolution-status');
    if (status) status.textContent = message;
  }

  function processBatch() {
    state.processed = true;
    processingSection.hidden = false;
    routingSection.hidden = false;
    impactSection.hidden = true;
    routingResult.replaceChildren();
    routineList.replaceChildren(...documents.filter((item) => item.status === 'routine').map(routineRow));
    exceptionList.replaceChildren(...documents.filter((item) => item.status !== 'routine').map(exceptionCard));
    updateSummary();
    updateRoutingReadiness();
    processingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function confirmRoutine() {
    state.routineConfirmed = true;
    document.getElementById('confirm-routine').disabled = true;
    document.getElementById('confirm-routine').textContent = 'Routine Routing Confirmed';
    routineList.classList.add('confirmed');
    updateRoutingReadiness();
  }

  function resolveException(event) {
    const button = event.target.closest('[data-resolve]');
    if (!button) return;
    const action = button.dataset.resolve;

    if (action === 'duplicate') {
      state.duplicateResolved = true;
      markResolved(button, 'Duplicate held outside the controlled library. Original submission retained in the intake history.');
    }
    if (action === 'missing') {
      state.missingResolved = true;
      markResolved(button, 'Information request prepared for the sender. Document remains pending and is not routed.');
    }
    if (action === 'classification') {
      const select = document.getElementById('classification-choice');
      if (!select.value) {
        select.focus();
        return;
      }
      state.classification = select.value;
      state.classificationResolved = true;
      select.disabled = true;
      markResolved(button, `${select.value} confirmed. The proposed filename and destination are now ready for routing.`);
    }
    updateRoutingReadiness();
  }

  function completeRouting() {
    routingResult.innerHTML = `
      <div class="library-result">
        <section>
          <span class="state-label">Controlled library</span>
          <h3>Four records routed</h3>
          <ul>
            <li>PS4_Weekly-Progress-Report_2026-08-03.pdf</li>
            <li>WQLU_Invoice_10482_North-Bay-Testing.pdf</li>
            <li>Programwide_Training-Record_Confined-Space_2026-08-02.xlsx</li>
            <li>RSR_${state.classification.replaceAll(' ', '-')}_2026-08-03.zip</li>
          </ul>
        </section>
        <section>
          <span class="state-label">Exception queue</span>
          <h3>Two records held safely</h3>
          <ul>
            <li>Probable duplicate retained for audit, not routed</li>
            <li>Technical submittal pending project information from sender</li>
          </ul>
        </section>
      </div>`;

    impactSummary.innerHTML = `
      <article><strong>6</strong><span>documents received</span></article>
      <article><strong>4</strong><span>approved records routed</span></article>
      <article><strong>2</strong><span>unsafe or incomplete records held</span></article>
      <article><strong>1</strong><span>routine batch confirmation</span></article>
      <article><strong>3</strong><span>targeted exception decisions</span></article>`;

    completeRoutingButton.disabled = true;
    completeRoutingButton.textContent = 'Routing Completed';
    impactSection.hidden = false;
    impactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetDemo() {
    Object.assign(state, {
      processed: false,
      routineConfirmed: false,
      duplicateResolved: false,
      missingResolved: false,
      classificationResolved: false,
      classification: ''
    });
    processingSection.hidden = true;
    routingSection.hidden = true;
    impactSection.hidden = true;
    completeRoutingButton.disabled = true;
    completeRoutingButton.textContent = 'Complete Routing';
    document.getElementById('confirm-routine').disabled = false;
    document.getElementById('confirm-routine').textContent = 'Confirm Routine Routing';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('process-batch')?.addEventListener('click', processBatch);
  document.getElementById('confirm-routine')?.addEventListener('click', confirmRoutine);
  document.getElementById('reset-intake')?.addEventListener('click', resetDemo);
  exceptionList.addEventListener('click', resolveException);
  completeRoutingButton?.addEventListener('click', completeRouting);

  renderIncoming();
})();
