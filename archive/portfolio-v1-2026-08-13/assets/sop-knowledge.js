(() => {
  'use strict';

  const questions = [
    { id: 'Q-001', question: 'Where are fully executed agreements filed?', status: 'grounded', answer: 'File the executed agreement in the controlled Agreements repository under the governing project or program record.', source: 'SOP-104 v3 · Agreement Records · approved Aug 1, 2026' },
    { id: 'Q-002', question: 'When is the weekly status draft due to the PMO reviewer?', status: 'grounded', answer: 'Submit the draft by Thursday at 2:00 PM so the PMO reviewer can complete the Friday release check.', source: 'OPS-210 v2 · Weekly Reporting Guide · approved Jul 15, 2026' },
    { id: 'Q-003', question: 'Who can approve external project-system access?', status: 'grounded', answer: 'External access requires approval from the designated system owner and the accountable project manager.', source: 'GOV-012 v4 · Access Approval Matrix · approved Jun 28, 2026' },
    { id: 'Q-004', question: 'Which file-naming rule controls project records?', status: 'conflict', answer: '', source: 'Conflict: SOP-104 v3 vs QRG-019 v2' },
    { id: 'Q-005', question: 'What is the current after-hours escalation number?', status: 'expired', answer: '', source: 'SOP-330 v1 · Emergency Escalation · expired Jul 31, 2026' },
    { id: 'Q-006', question: 'May contractors export employee accommodation records?', status: 'gap', answer: '', source: 'No approved source located in the fictional knowledge set' }
  ];

  const state = { prepared: false, answersConfirmed: false, conflictResolved: false, expiredResolved: false, gapResolved: false, conflictSource: '', published: false };

  const sourceGrid = document.getElementById('knowledge-source-grid');
  const workspace = document.getElementById('knowledge-workspace');
  const metrics = document.getElementById('knowledge-metrics');
  const answerList = document.getElementById('knowledge-answer-list');
  const exceptionList = document.getElementById('knowledge-exception-list');
  const confirmAnswers = document.getElementById('confirm-knowledge-answers');
  const publishButton = document.getElementById('publish-knowledge');
  const guidance = document.getElementById('knowledge-guidance');
  const output = document.getElementById('knowledge-output');
  const outputMetrics = document.getElementById('knowledge-output-metrics');
  const outputCards = document.getElementById('knowledge-output-cards');
  if (!sourceGrid || !workspace || !answerList || !exceptionList || !publishButton) return;

  function questionCard(item) {
    const article = document.createElement('article');
    article.className = 'source-card';
    const label = item.status === 'grounded' ? 'Approved source found' : item.status === 'conflict' ? 'Conflicting sources' : item.status === 'expired' ? 'Source expired' : 'No approved source';
    article.innerHTML = `<div class="source-meta"><span>${item.id}</span><span>${label}</span></div><h3>${item.question}</h3><p>${item.source}</p>`;
    return article;
  }

  function renderQuestions() { sourceGrid.replaceChildren(...questions.map(questionCard)); }

  function renderGroundedAnswers() {
    answerList.innerHTML = questions.filter((item) => item.status === 'grounded').map((item) => `<article class="answer-card approved"><span class="status-pill ready">Source-ready</span><h4>${item.id} · ${item.question}</h4><p>${item.answer}</p><span class="source-ref">${item.source}</span></article>`).join('');
  }

  function exceptionCard(type, title, explanation, controls, resolvedText) {
    const resolved = state[`${type}Resolved`];
    return `<article class="exception-card ${resolved ? 'resolved' : ''}" data-exception="${type}"><div class="exception-header"><div><span class="exception-label">${resolved ? 'Resolved' : 'Review required'}</span><h4>${title}</h4></div></div><p>${explanation}</p><div class="exception-actions">${controls}</div><p class="resolution-status">${resolved ? resolvedText : 'No answer will be published until the knowledge-control issue has an explicit disposition.'}</p></article>`;
  }

  function renderExceptions() {
    exceptionList.innerHTML = [
      exceptionCard('conflict', 'Q-004 has two approved-looking naming rules', 'SOP-104 v3 says ProjectCode_DocType_Date while QRG-019 v2 says Client_DocType_Revision. The workflow exposes the contradiction instead of choosing silently.', `<label>Controlling source<select id="knowledge-conflict-source" ${state.conflictResolved ? 'disabled' : ''}><option value="">Select one</option><option value="SOP-104 v3 · ProjectCode_DocType_Date" ${state.conflictSource.startsWith('SOP-104') ? 'selected' : ''}>SOP-104 v3 · ProjectCode_DocType_Date</option><option value="QRG-019 v2 · Client_DocType_Revision" ${state.conflictSource.startsWith('QRG-019') ? 'selected' : ''}>QRG-019 v2 · Client_DocType_Revision</option><option value="Escalate to Document Control owner; publish no naming answer" ${state.conflictSource.startsWith('Escalate') ? 'selected' : ''}>Escalate without publishing an answer</option></select></label><button type="button" data-knowledge-resolve="conflict" ${state.conflictResolved ? 'disabled' : ''}>Confirm Source Decision</button>`, state.conflictSource.startsWith('Escalate') ? 'Naming answer withheld and conflict assigned to the Document Control owner.' : `${state.conflictSource} selected as the controlling source for this response pack.`),
      exceptionCard('expired', 'Q-005 depends on expired emergency guidance', 'The only matching source expired on July 31. Repeating its phone number would turn stale content into a confident operational instruction.', `<button type="button" data-knowledge-resolve="expired" ${state.expiredResolved ? 'disabled' : ''}>Withhold Answer and Request Source Refresh</button>`, 'Answer withheld. A refresh request is prepared for the Emergency Procedure owner.'),
      exceptionCard('gap', 'Q-006 has no approved source coverage', 'No approved policy in the fictional source set establishes whether contractors may export accommodation records. The workflow must not infer a privacy rule.', `<button type="button" data-knowledge-resolve="gap" ${state.gapResolved ? 'disabled' : ''}>Create Knowledge-Gap and Privacy Review Item</button>`, 'Answer withheld. A knowledge-gap item is routed to the Privacy & Records owner for authoritative guidance.')
    ].join('');
  }

  function updateReadiness() {
    const ready = state.answersConfirmed && state.conflictResolved && state.expiredResolved && state.gapResolved;
    publishButton.disabled = !ready;
    const remaining = [state.answersConfirmed, state.conflictResolved, state.expiredResolved, state.gapResolved].filter((value) => !value).length;
    guidance.textContent = ready ? 'Grounded answers are confirmed and every knowledge exception has an explicit disposition. The response pack is ready to publish.' : `${remaining} control${remaining === 1 ? '' : 's'} remain before the response pack can be published.`;
  }

  function prepare() {
    state.prepared = true; workspace.hidden = false; output.hidden = true;
    metrics.innerHTML = '<article><strong>6</strong><span>staff questions</span></article><article><strong>3</strong><span>source-ready answers</span></article><article><strong>3</strong><span>knowledge exceptions</span></article><article><strong>0</strong><span>invented answers</span></article>';
    renderGroundedAnswers(); renderExceptions(); updateReadiness();
    workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function confirmGrounded() { state.answersConfirmed = true; confirmAnswers.disabled = true; confirmAnswers.textContent = 'Grounded Answers Confirmed'; updateReadiness(); }

  function resolveException(event) {
    const button = event.target.closest('[data-knowledge-resolve]');
    if (!button) return;
    const type = button.dataset.knowledgeResolve;
    if (type === 'conflict') {
      const select = document.getElementById('knowledge-conflict-source');
      if (!select?.value) return select?.focus();
      state.conflictSource = select.value; state.conflictResolved = true;
    }
    if (type === 'expired') state.expiredResolved = true;
    if (type === 'gap') state.gapResolved = true;
    renderExceptions(); updateReadiness();
  }

  function conflictAnswer() {
    if (state.conflictSource.startsWith('SOP-104')) return 'Use ProjectCode_DocType_Date for the project-record naming pattern.';
    if (state.conflictSource.startsWith('QRG-019')) return 'Use Client_DocType_Revision for the project-record naming pattern.';
    return 'Answer withheld pending Document Control owner resolution.';
  }

  function responseText() {
    return `# Synthetic SOP Knowledge Response Pack\n\nQ-001: Where are fully executed agreements filed?\nAnswer: ${questions[0].answer}\nSource: ${questions[0].source}\n\nQ-002: When is the weekly status draft due to the PMO reviewer?\nAnswer: ${questions[1].answer}\nSource: ${questions[1].source}\n\nQ-003: Who can approve external project-system access?\nAnswer: ${questions[2].answer}\nSource: ${questions[2].source}\n\nQ-004: Which file-naming rule controls project records?\nAnswer: ${conflictAnswer()}\nSource decision: ${state.conflictSource}\n\nQ-005: What is the current after-hours escalation number?\nAnswer: WITHHELD — only located source is expired; refresh requested.\n\nQ-006: May contractors export employee accommodation records?\nAnswer: WITHHELD — no approved source located; Privacy & Records review requested.\n\nEvidence boundary: all content is fictional. The workflow publishes only source-grounded or explicitly reviewed answers.`;
  }

  function evidencePayload() { return { workflow: 'AI Workflow Enablement - SOP Knowledge Assistance Demonstration', dataClassification: 'Synthetic public demonstration', inputs: questions, groundedAnswersConfirmed: state.answersConfirmed, decisions: { namingRuleSource: state.conflictSource, expiredGuidance: 'Answer withheld; refresh requested', sourceGap: 'Answer withheld; privacy review requested' }, outputSummary: { questions: 6, publishableAnswers: state.conflictSource.startsWith('Escalate') ? 3 : 4, withheldAnswers: state.conflictSource.startsWith('Escalate') ? 3 : 2, governanceDecisions: 3 } }; }

  function publish() {
    if (!(state.answersConfirmed && state.conflictResolved && state.expiredResolved && state.gapResolved)) return;
    state.published = true;
    const publishable = state.conflictSource.startsWith('Escalate') ? 3 : 4;
    const withheld = 6 - publishable;
    outputMetrics.innerHTML = `<article><strong>6</strong><span>questions accounted for</span></article><article><strong>${publishable}</strong><span>source-grounded answers</span></article><article><strong>${withheld}</strong><span>answers withheld safely</span></article><article><strong>3</strong><span>governance decisions recorded</span></article>`;
    outputCards.innerHTML = `<article class="output-card"><span class="state-label">Output 1</span><h3>Grounded response pack</h3><p>Publishable answers remain attached to the source or explicit source decision that supports them.</p><div class="output-preview">${publishable} answers publishable<br>${withheld} answers withheld</div></article><article class="output-card"><span class="state-label">Output 2</span><h3>Knowledge-maintenance backlog</h3><p>Expired and missing guidance becomes accountable maintenance work instead of repeated uncertainty.</p><div class="output-preview">Emergency source refresh<br>Privacy-policy gap review<br>Naming-source conflict history</div></article><article class="output-card"><span class="state-label">Output 3</span><h3>Evidence of restraint</h3><p>The workflow demonstrates where it will not answer, which is as important as showing where it can.</p><div class="output-preview">0 invented policies<br>0 expired phone numbers published<br>0 permission rules inferred</div></article>`;
    output.hidden = false; output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function download(filename, content, type) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 0); }

  function reset() {
    Object.assign(state, { prepared: false, answersConfirmed: false, conflictResolved: false, expiredResolved: false, gapResolved: false, conflictSource: '', published: false });
    workspace.hidden = true; output.hidden = true; publishButton.disabled = true; confirmAnswers.disabled = false; confirmAnswers.textContent = 'Confirm Grounded Answers';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('prepare-knowledge')?.addEventListener('click', prepare);
  confirmAnswers?.addEventListener('click', confirmGrounded);
  exceptionList.addEventListener('click', resolveException);
  publishButton.addEventListener('click', publish);
  document.getElementById('reset-knowledge')?.addEventListener('click', reset);
  document.getElementById('download-knowledge-pack')?.addEventListener('click', () => download('synthetic-sop-knowledge-response-pack.md', responseText(), 'text/markdown'));
  document.getElementById('download-knowledge-evidence')?.addEventListener('click', () => download('synthetic-sop-knowledge-evidence.json', JSON.stringify(evidencePayload(), null, 2), 'application/json'));
  renderQuestions();
})();
