import { test, expect } from '@playwright/test';

const paths = {
  status: '/demos/status-reporting.html',
  triage: '/demos/request-triage.html',
  knowledge: '/demos/sop-knowledge.html'
};

test('Status Reporting prepares governed facts, blocks unsupported assumptions, and finalizes after review', async ({ page }, testInfo) => {
  await page.goto(paths.status);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Project Status Reporting');
  await expect(page.locator('#status-source-grid .source-card')).toHaveCount(6);
  await expect(page.locator('#status-workspace')).toBeHidden();

  await page.getByRole('button', { name: 'Prepare Weekly Report' }).click();
  await expect(page.locator('#status-workspace')).toBeVisible();
  await expect(page.locator('#status-metrics article')).toHaveCount(4);
  await expect(page.getByText('Milestone conflict: August 20 schedule vs. August 22 vendor readiness', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Finalize Report Package' })).toBeDisabled();

  await page.getByLabel('Working milestone date').selectOption('August 22');
  await page.getByRole('button', { name: 'Confirm Working Date' }).click();
  await expect(page.getByText('August 22 selected as the working milestone for this report.', { exact: false })).toBeVisible();

  await page.getByLabel('Reporting treatment').selectOption('Report +$42,000 variance; explanation pending Finance validation');
  await page.getByRole('button', { name: 'Confirm Treatment' }).click();
  await expect(page.getByText('Report +$42,000 variance; explanation pending Finance validation', { exact: true })).toBeVisible();

  await page.getByLabel('Assign reporting owner').selectOption('Priya Shah · Program PMO');
  await page.getByRole('button', { name: 'Confirm Owner' }).click();
  await expect(page.getByText('Priya Shah · Program PMO assigned to the R-07 follow-up.', { exact: false })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Finalize Report Package' })).toBeEnabled();
  await page.getByRole('button', { name: 'Finalize Report Package' }).click();
  await expect(page.getByRole('heading', { name: 'One controlled review produces three usable reporting artifacts.' })).toBeVisible();
  await expect(page.locator('#status-output-metrics article').nth(2)).toContainText('3');
  await expect(page.locator('#status-output-metrics article').nth(2)).toContainText('judgment calls recorded');
  await expect(page.getByText('R-07 owner: Priya Shah · Program PMO', { exact: false })).toBeVisible();

  await testInfo.attach('status-reporting-controlled-outcome', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});

test('Status Reporting reset restores the clean state', async ({ page }) => {
  await page.goto(paths.status);
  await page.getByRole('button', { name: 'Prepare Weekly Report' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#status-workspace')).toBeHidden();
  await expect(page.locator('#status-output')).toBeHidden();
  await expect(page.locator('#finalize-status')).toBeDisabled();
  await expect(page.locator('#status-source-grid .source-card')).toHaveCount(6);
});

test('Request Triage prepares routine assignments and requires duplicate, priority, and permission review', async ({ page }, testInfo) => {
  await page.goto(paths.triage);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Work Request Triage');
  await expect(page.locator('#triage-source-grid .source-card')).toHaveCount(8);
  await page.getByRole('button', { name: 'Triage Request Batch' }).click();
  await expect(page.locator('#triage-routine-body tr')).toHaveCount(5);
  await expect(page.locator('#triage-exception-list .exception-card')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Commit Triage Queue' })).toBeDisabled();

  await page.getByRole('button', { name: 'Confirm Routine Assignments' }).click();
  await page.getByRole('button', { name: 'Link to REQ-104 and Close Duplicate' }).click();
  await page.getByLabel('Service priority').selectOption('P2 · 4 business hours');
  await page.getByRole('button', { name: 'Confirm Priority' }).click();
  await page.getByLabel('Authorized owner').selectOption('HR Accommodation Owner');
  await page.getByRole('button', { name: 'Route to Authorized Owner' }).click();

  await expect(page.getByRole('button', { name: 'Commit Triage Queue' })).toBeEnabled();
  await page.getByRole('button', { name: 'Commit Triage Queue' }).click();
  await expect(page.getByRole('heading', { name: 'The queue finishes with visible ownership, service targets, and exception history.' })).toBeVisible();
  await expect(page.locator('#triage-output-metrics article').nth(1)).toContainText('7');
  await expect(page.locator('#triage-output-metrics article').nth(1)).toContainText('controlled work items');
  await expect(page.getByText('0 sensitive records routed generally')).toBeVisible();

  await testInfo.attach('request-triage-controlled-outcome', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});

test('Request Triage reset restores the clean state', async ({ page }) => {
  await page.goto(paths.triage);
  await page.getByRole('button', { name: 'Triage Request Batch' }).click();
  await page.getByRole('button', { name: 'Confirm Routine Assignments' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#triage-workspace')).toBeHidden();
  await expect(page.locator('#triage-output')).toBeHidden();
  await expect(page.locator('#confirm-triage-routine')).toBeEnabled();
  await expect(page.locator('#triage-source-grid .source-card')).toHaveCount(8);
});

test('SOP Knowledge publishes grounded answers and withholds expired or unsupported guidance', async ({ page }, testInfo) => {
  await page.goto(paths.knowledge);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SOP Knowledge Assistance');
  await expect(page.locator('#knowledge-source-grid .source-card')).toHaveCount(6);
  await page.getByRole('button', { name: 'Prepare Knowledge Responses' }).click();
  await expect(page.locator('#knowledge-answer-list .answer-card')).toHaveCount(3);
  await expect(page.locator('#knowledge-exception-list .exception-card')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Publish Response Pack' })).toBeDisabled();

  await page.getByRole('button', { name: 'Confirm Grounded Answers' }).click();
  await page.getByLabel('Controlling source').selectOption('SOP-104 v3 · ProjectCode_DocType_Date');
  await page.getByRole('button', { name: 'Confirm Source Decision' }).click();
  await page.getByRole('button', { name: 'Withhold Answer and Request Source Refresh' }).click();
  await page.getByRole('button', { name: 'Create Knowledge-Gap and Privacy Review Item' }).click();

  await expect(page.getByRole('button', { name: 'Publish Response Pack' })).toBeEnabled();
  await page.getByRole('button', { name: 'Publish Response Pack' }).click();
  await expect(page.getByRole('heading', { name: 'The final package separates usable answers from maintenance work.' })).toBeVisible();
  await expect(page.locator('#knowledge-output-metrics article').nth(1)).toContainText('4');
  await expect(page.locator('#knowledge-output-metrics article').nth(1)).toContainText('source-grounded answers');
  await expect(page.locator('#knowledge-output-metrics article').nth(2)).toContainText('2');
  await expect(page.locator('#knowledge-output-metrics article').nth(2)).toContainText('answers withheld safely');
  await expect(page.getByText('0 invented policies')).toBeVisible();
  await expect(page.getByText('0 expired phone numbers published')).toBeVisible();

  await testInfo.attach('sop-knowledge-controlled-outcome', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});

test('SOP Knowledge reset restores the clean state', async ({ page }) => {
  await page.goto(paths.knowledge);
  await page.getByRole('button', { name: 'Prepare Knowledge Responses' }).click();
  await page.getByRole('button', { name: 'Confirm Grounded Answers' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#knowledge-workspace')).toBeHidden();
  await expect(page.locator('#knowledge-output')).toBeHidden();
  await expect(page.locator('#confirm-knowledge-answers')).toBeEnabled();
  await expect(page.locator('#knowledge-source-grid .source-card')).toHaveCount(6);
});

test('publishes proof manifests, synthetic registers, and acceptance matrices for all three new demos', async ({ page, request }) => {
  const packs = [
    { proof: '/evidence/ai-workflow-enablement/status-reporting-proof.html', manifest: '/evidence/ai-workflow-enablement/status-reporting-proof.json', register: '/evidence/ai-workflow-enablement/status-reporting-synthetic-records.csv', acceptance: '/evidence/ai-workflow-enablement/status-reporting-acceptance.csv', heading: 'Project Status Reporting Proof Pack', count: 6, acceptanceId: 'SR-AT-09' },
    { proof: '/evidence/ai-workflow-enablement/request-triage-proof.html', manifest: '/evidence/ai-workflow-enablement/request-triage-proof.json', register: '/evidence/ai-workflow-enablement/request-triage-synthetic-records.csv', acceptance: '/evidence/ai-workflow-enablement/request-triage-acceptance.csv', heading: 'Work Request Triage Proof Pack', count: 8, acceptanceId: 'RT-AT-10' },
    { proof: '/evidence/ai-workflow-enablement/sop-knowledge-proof.html', manifest: '/evidence/ai-workflow-enablement/sop-knowledge-proof.json', register: '/evidence/ai-workflow-enablement/sop-knowledge-synthetic-records.csv', acceptance: '/evidence/ai-workflow-enablement/sop-knowledge-acceptance.csv', heading: 'SOP Knowledge Assistance Proof Pack', count: 6, acceptanceId: 'SK-AT-10' }
  ];

  for (const pack of packs) {
    await page.goto(pack.proof);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(pack.heading);
    await expect(page.getByText('The counts are deterministic demonstration evidence, not measured organizational savings.')).toBeVisible();

    const manifestResponse = await request.get(pack.manifest);
    expect(manifestResponse.ok()).toBeTruthy();
    const manifest = await manifestResponse.json();
    expect(manifest.maturity).toBe('Working browser demonstration');
    expect(manifest.synthetic_records.count).toBe(pack.count);
    expect(manifest.public_artifacts).toContain('tests/workflow-demo-family.spec.mjs');

    const registerResponse = await request.get(pack.register);
    expect(registerResponse.ok()).toBeTruthy();
    const acceptanceResponse = await request.get(pack.acceptance);
    expect(acceptanceResponse.ok()).toBeTruthy();
    expect(await acceptanceResponse.text()).toContain(pack.acceptanceId);
  }
});

test('new workflow demonstrations fit every configured viewport after the workspace is opened', async ({ page }) => {
  const openActions = [
    { path: paths.status, button: 'Prepare Weekly Report', workspace: '#status-workspace' },
    { path: paths.triage, button: 'Triage Request Batch', workspace: '#triage-workspace' },
    { path: paths.knowledge, button: 'Prepare Knowledge Responses', workspace: '#knowledge-workspace' }
  ];

  for (const demo of openActions) {
    await page.goto(demo.path);
    await page.getByRole('button', { name: demo.button }).click();
    await expect(page.locator(demo.workspace)).toBeVisible();
    const dimensions = await page.evaluate(() => ({ viewportWidth: document.documentElement.clientWidth, documentWidth: document.documentElement.scrollWidth }));
    expect(dimensions.documentWidth, `${demo.path} should not overflow horizontally with its workspace open`).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  }
});
