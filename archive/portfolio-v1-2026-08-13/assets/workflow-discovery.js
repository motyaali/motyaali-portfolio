(() => {
  'use strict';

  const form = document.getElementById('workflow-discovery-form');
  const output = document.getElementById('brief-output');
  const copyButton = document.getElementById('copy-brief');
  const emailLink = document.getElementById('email-brief');
  const status = document.getElementById('brief-status');

  if (!form || !output || !copyButton || !emailLink || !status) return;

  const fields = [
    ['process', 'Recurring process'],
    ['trigger', 'Trigger'],
    ['complete', 'Completion point'],
    ['volume', 'Frequency / volume'],
    ['owner', 'Process owner'],
    ['systems', 'Systems / channels'],
    ['pain', 'Delay / rework / missing information'],
    ['judgment', 'Human judgment / approvals'],
    ['metrics', 'Current metrics'],
    ['users', 'Potential pilot users'],
    ['success', 'Success / unacceptable outcome'],
    ['platform', 'Approved platforms / licenses']
  ];

  let currentBrief = '';

  function valueFor(id) {
    return document.getElementById(id)?.value.trim() || '';
  }

  function buildBrief() {
    const lines = ['AI WORKFLOW ENABLEMENT - PROCESS CONVERSATION BRIEF', ''];
    fields.forEach(([id, label]) => {
      const value = valueFor(id);
      lines.push(`${label}: ${value || 'Not yet defined'}`);
    });
    lines.push('', 'Privacy note: This brief should not contain confidential, regulated, credential, employer-proprietary, or personally identifying information.');
    return lines.join('\n');
  }

  function updateEmailLink(brief) {
    const subject = `Workflow Discovery Conversation - ${valueFor('process') || 'Recurring Process'}`;
    const body = `Hi Ali,\n\nI would like to discuss this recurring process:\n\n${brief}\n\nI am interested in a short process conversation to determine whether a workflow diagnostic or controlled pilot is a good fit.`;
    emailLink.href = `mailto:motyaali@pm.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    emailLink.setAttribute('aria-disabled', 'false');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    currentBrief = buildBrief();
    output.textContent = currentBrief;
    copyButton.disabled = false;
    updateEmailLink(currentBrief);
    status.textContent = 'Brief prepared locally in this browser. Nothing has been sent.';
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      currentBrief = '';
      output.textContent = 'Complete the worksheet and select “Build Conversation Brief.”';
      copyButton.disabled = true;
      emailLink.href = 'mailto:motyaali@pm.me?subject=Workflow%20Discovery%20Conversation';
      emailLink.setAttribute('aria-disabled', 'true');
      status.textContent = '';
    }, 0);
  });

  copyButton.addEventListener('click', async () => {
    if (!currentBrief) return;
    try {
      await navigator.clipboard.writeText(currentBrief);
      status.textContent = 'Brief copied to the clipboard. Nothing has been sent.';
    } catch {
      status.textContent = 'Clipboard access was unavailable. Select the generated brief and copy it manually.';
    }
  });

  emailLink.addEventListener('click', (event) => {
    if (!currentBrief) {
      event.preventDefault();
      status.textContent = 'Build the conversation brief before opening the email action.';
    }
  });
})();
