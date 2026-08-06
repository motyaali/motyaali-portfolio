(() => {
  'use strict';

  const sourceMeeting = `Operations Weekly Review — Synthetic Demonstration
Date: August 1, 2026
Attendees: Jordan Lee, Priya Shah, Marco Ruiz, Dana Brooks

Jordan: The July status report took nearly six hours to assemble because the source files used different project names. We agreed that the project register should become the naming source before the next report.

Priya: I will clean the project register and send the proposed naming list to Dana by August 6. Dana will review it, but we did not agree on when her review must be complete.

Marco: The document intake mailbox received four duplicate submissions last week. I can add a duplicate check to the pilot, but I need the approved document ID rules first.

Dana: Use the existing project code plus document type as the temporary document ID rule for the pilot. Do not make that the permanent records rule until Records Management reviews it.

Jordan: Decision: the pilot will cover one mailbox and one project team. We are not expanding to all departments during the pilot.

Priya: There is a risk that the August status report will still use inconsistent names if the register cleanup is not approved by August 9.

Marco: I will configure the test environment after Dana approves the naming list and the temporary ID rule is documented. Target date is August 12.

Jordan: We still need someone to own the user acceptance test script. Please leave that as an open question rather than assigning it automatically.

Dana: Final publication and permanent record status must remain human approvals.`;

  const proposalSeed = [
    {
      id: 'DEC-001',
      type: 'Decision',
      statement: 'Use the project register as the naming source for the next status report.',
      owner: 'Jordan Lee',
      dueDate: '',
      source: 'Paragraph 2',
      confidence: 'High',
      notes: 'Decision is explicit, but implementation depends on register cleanup and review.',
      status: 'pending'
    },
    {
      id: 'ACT-001',
      type: 'Action',
      statement: 'Clean the project register and send the proposed naming list to Dana.',
      owner: 'Priya Shah',
      dueDate: '2026-08-06',
      source: 'Paragraph 3',
      confidence: 'High',
      notes: 'Explicit owner and date.',
      status: 'pending'
    },
    {
      id: 'ACT-002',
      type: 'Action',
      statement: 'Review the proposed naming list.',
      owner: 'Dana Brooks',
      dueDate: '',
      source: 'Paragraph 3',
      confidence: 'Medium',
      notes: 'Owner is explicit. Due date is missing and should remain blank until confirmed.',
      status: 'pending'
    },
    {
      id: 'ACT-003',
      type: 'Action',
      statement: 'Add a duplicate-submission check to the document intake pilot.',
      owner: 'Marco Ruiz',
      dueDate: '',
      source: 'Paragraph 4',
      confidence: 'Medium',
      notes: 'Blocked until approved document ID rules are available.',
      status: 'pending'
    },
    {
      id: 'DEC-002',
      type: 'Decision',
      statement: 'Use project code plus document type as the temporary pilot document ID rule.',
      owner: 'Dana Brooks',
      dueDate: '',
      source: 'Paragraph 5',
      confidence: 'High',
      notes: 'Temporary only. Permanent records rule requires Records Management review.',
      status: 'pending'
    },
    {
      id: 'DEC-003',
      type: 'Decision',
      statement: 'Limit the pilot to one mailbox and one project team.',
      owner: 'Jordan Lee',
      dueDate: '',
      source: 'Paragraph 6',
      confidence: 'High',
      notes: 'Explicit scope decision.',
      status: 'pending'
    },
    {
      id: 'RSK-001',
      type: 'Risk',
      statement: 'The August status report may still use inconsistent project names.',
      owner: '',
      dueDate: '2026-08-09',
      source: 'Paragraph 7',
      confidence: 'High',
      notes: 'Trigger: register cleanup is not approved by August 9. Risk owner was not assigned.',
      status: 'pending'
    },
    {
      id: 'ACT-004',
      type: 'Action',
      statement: 'Configure the test environment after naming-list approval and documentation of the temporary ID rule.',
      owner: 'Marco Ruiz',
      dueDate: '2026-08-12',
      source: 'Paragraph 8',
      confidence: 'High',
      notes: 'Dependencies are explicit.',
      status: 'pending'
    },
    {
      id: 'QST-001',
      type: 'Open Question',
      statement: 'Who will own the user acceptance test script?',
      owner: '',
      dueDate: '',
      source: 'Paragraph 9',
      confidence: 'High',
      notes: 'The meeting explicitly instructs the workflow not to assign an owner automatically.',
      status: 'pending'
    },
    {
      id: 'CTL-001',
      type: 'Control',
      statement: 'Final publication and permanent record status require human approval.',
      owner: 'Authorized reviewer',
      dueDate: '',
      source: 'Paragraph 10',
      confidence: 'High',
      notes: 'Governance boundary, not an action item.',
      status: 'pending'
    }
  ];

  let records = [];
  let outputPayload = null;

  const sourceElement = document.getElementById('source-text');
  const proposalList = document.getElementById('proposal-list');
  const reviewStatus = document.getElementById('review-status');
  const outputElement = document.getElementById('review-output');
  const downloadJsonButton = document.getElementById('download-json');
  const downloadMarkdownButton = document.getElementById('download-markdown');

  if (!sourceElement || !proposalList || !reviewStatus || !outputElement) {
    return;
  }

  sourceElement.textContent = sourceMeeting;

  function cloneSeed() {
    return proposalSeed.map((item) => ({ ...item, history: [] }));
  }

  function updateStatusMessage() {
    if (records.length === 0) {
      reviewStatus.textContent = 'No proposals loaded.';
      return;
    }
    const counts = records.reduce(
      (accumulator, item) => {
        accumulator[item.status] += 1;
        return accumulator;
      },
      { pending: 0, approved: 0, rejected: 0 }
    );
    reviewStatus.textContent = `${counts.pending} pending, ${counts.approved} approved, ${counts.rejected} rejected.`;
  }

  function createLabeledField(labelText, value, elementType, onChange) {
    const label = document.createElement('label');
    label.textContent = labelText;

    const field = document.createElement(elementType === 'textarea' ? 'textarea' : 'input');
    if (elementType !== 'textarea') {
      field.type = elementType;
    }
    field.value = value || '';
    field.addEventListener('input', (event) => onChange(event.target.value));
    label.appendChild(field);
    return label;
  }

  function addHistory(record, action, details) {
    record.history.push({
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  function renderRecords() {
    proposalList.replaceChildren();

    if (records.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'Select “Load Proposed Records” to begin the human review step.';
      proposalList.appendChild(empty);
      updateStatusMessage();
      return;
    }

    records.forEach((record) => {
      const card = document.createElement('article');
      card.className = 'proposal-card';
      card.dataset.status = record.status;

      const meta = document.createElement('div');
      meta.className = 'proposal-meta';
      [record.id, record.type, record.confidence, record.source, record.status].forEach((value) => {
        const pill = document.createElement('span');
        pill.textContent = value;
        meta.appendChild(pill);
      });
      card.appendChild(meta);

      card.appendChild(
        createLabeledField('Proposed record', record.statement, 'textarea', (value) => {
          if (value !== record.statement) {
            addHistory(record, 'edited', `Statement changed from “${record.statement}” to “${value}”.`);
            record.statement = value;
          }
        })
      );

      card.appendChild(
        createLabeledField('Owner', record.owner, 'text', (value) => {
          if (value !== record.owner) {
            addHistory(record, 'edited', `Owner changed from “${record.owner || 'blank'}” to “${value || 'blank'}”.`);
            record.owner = value;
          }
        })
      );

      card.appendChild(
        createLabeledField('Due date', record.dueDate, 'date', (value) => {
          if (value !== record.dueDate) {
            addHistory(record, 'edited', `Due date changed from “${record.dueDate || 'blank'}” to “${value || 'blank'}”.`);
            record.dueDate = value;
          }
        })
      );

      card.appendChild(
        createLabeledField('Review notes', record.notes, 'textarea', (value) => {
          record.notes = value;
        })
      );

      const actions = document.createElement('div');
      actions.className = 'proposal-actions';

      const approve = document.createElement('button');
      approve.type = 'button';
      approve.dataset.action = 'approve';
      approve.textContent = 'Approve';
      approve.addEventListener('click', () => {
        record.status = 'approved';
        addHistory(record, 'approved', 'Reviewer approved this record for publication.');
        renderRecords();
      });

      const reject = document.createElement('button');
      reject.type = 'button';
      reject.dataset.action = 'reject';
      reject.textContent = 'Reject';
      reject.addEventListener('click', () => {
        record.status = 'rejected';
        addHistory(record, 'rejected', 'Reviewer rejected this record.');
        renderRecords();
      });

      const returnToPending = document.createElement('button');
      returnToPending.type = 'button';
      returnToPending.textContent = 'Return to Pending';
      returnToPending.addEventListener('click', () => {
        record.status = 'pending';
        addHistory(record, 'returned_to_pending', 'Reviewer returned this record to pending.');
        renderRecords();
      });

      actions.append(approve, reject, returnToPending);
      card.appendChild(actions);
      proposalList.appendChild(card);
    });

    updateStatusMessage();
  }

  function reviewedRecordMarkdown(payload) {
    const approved = payload.records.filter((record) => record.status === 'approved');
    const rejected = payload.records.filter((record) => record.status === 'rejected');
    const pending = payload.records.filter((record) => record.status === 'pending');

    const lines = [
      '# Reviewed Meeting Operating Record',
      '',
      `Generated: ${payload.generatedAt}`,
      '',
      '## Publication status',
      '',
      `- Approved records: ${approved.length}`,
      `- Rejected proposals: ${rejected.length}`,
      `- Pending proposals: ${pending.length}`,
      '',
      '## Approved records',
      ''
    ];

    approved.forEach((record) => {
      lines.push(`### ${record.id} — ${record.type}`);
      lines.push('');
      lines.push(`- Record: ${record.statement}`);
      lines.push(`- Owner: ${record.owner || 'Unassigned'}`);
      lines.push(`- Due date: ${record.dueDate || 'Not established'}`);
      lines.push(`- Source: ${record.source}`);
      lines.push(`- Review notes: ${record.notes || 'None'}`);
      lines.push('');
    });

    lines.push('## Rejected and pending proposals');
    lines.push('');
    [...rejected, ...pending].forEach((record) => {
      lines.push(`- ${record.id} | ${record.status} | ${record.statement}`);
    });

    lines.push('');
    lines.push('## Governance note');
    lines.push('');
    lines.push('This record was produced only after human review. The public prototype uses synthetic data and deterministic proposals.');

    return lines.join('\n');
  }

  function generateOutput() {
    if (records.length === 0) {
      outputElement.textContent = 'Load and review the proposed records before generating an output.';
      return;
    }

    outputPayload = {
      workflow: 'AI Workflow Enablement — Meeting Intelligence Review Prototype',
      dataClassification: 'Synthetic public demonstration',
      proposalMethod: 'Deterministic pre-generated proposals for governance demonstration',
      generatedAt: new Date().toISOString(),
      sourceMeeting,
      records: records.map((record) => ({ ...record, history: [...record.history] }))
    };

    outputElement.textContent = reviewedRecordMarkdown(outputPayload);
    downloadJsonButton.disabled = false;
    downloadMarkdownButton.disabled = false;
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

  document.getElementById('load-proposals')?.addEventListener('click', () => {
    records = cloneSeed();
    outputPayload = null;
    outputElement.textContent = 'Review the records, then generate the approved operating record.';
    downloadJsonButton.disabled = true;
    downloadMarkdownButton.disabled = true;
    renderRecords();
  });

  document.getElementById('reset-demo')?.addEventListener('click', () => {
    records = [];
    outputPayload = null;
    outputElement.textContent = 'The reviewed record will appear here.';
    downloadJsonButton.disabled = true;
    downloadMarkdownButton.disabled = true;
    renderRecords();
  });

  document.getElementById('generate-output')?.addEventListener('click', generateOutput);

  downloadJsonButton?.addEventListener('click', () => {
    if (!outputPayload) return;
    downloadFile('meeting-intelligence-review-evidence.json', JSON.stringify(outputPayload, null, 2), 'application/json');
  });

  downloadMarkdownButton?.addEventListener('click', () => {
    if (!outputPayload) return;
    downloadFile('reviewed-meeting-operating-record.md', reviewedRecordMarkdown(outputPayload), 'text/markdown');
  });

  renderRecords();
})();
