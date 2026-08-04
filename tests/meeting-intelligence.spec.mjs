import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const demoPath = '/demos/meeting-intelligence.html';

async function loadProposals(page) {
  await page.getByRole('button', { name: 'Load Proposed Records' }).click();
  await expect(page.locator('.proposal-card')).toHaveCount(10);
}

test.beforeEach(async ({ page }) => {
  await page.goto(demoPath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Meeting Intelligence Review Queue');
});

test('publishes only reviewed records and preserves evidence history', async ({ page }, testInfo) => {
  await expect(page.locator('#source-text')).toContainText('Operations Weekly Review');
  await expect(page.locator('#source-text')).toContainText('Final publication and permanent record status must remain human approvals.');

  await loadProposals(page);
  await expect(page.locator('#review-status')).toHaveText('10 pending, 0 approved, 0 rejected.');

  const cards = page.locator('.proposal-card');
  await expect(cards.nth(0)).toContainText('DEC-001');
  await expect(cards.nth(0)).toContainText('Paragraph 2');
  await expect(cards.nth(1).getByLabel('Due date')).toHaveValue('2026-08-06');
  await expect(cards.nth(2).getByLabel('Due date')).toHaveValue('');
  await expect(cards.nth(6).getByLabel('Owner')).toHaveValue('');
  await expect(cards.nth(8).getByLabel('Owner')).toHaveValue('');
  await expect(cards.nth(9).getByLabel('Proposed record')).toHaveValue(
    'Final publication and permanent record status require human approval.'
  );

  await cards.nth(0).getByRole('button', { name: 'Approve', exact: true }).click();
  await cards.nth(1).getByRole('button', { name: 'Reject', exact: true }).click();

  await cards.nth(2).getByLabel('Owner').fill('Program Operations Lead');
  await cards.nth(2).getByRole('button', { name: 'Approve', exact: true }).click();

  await page.getByRole('button', { name: 'Approve All Pending' }).click();
  await page.locator('.proposal-card').nth(9).getByRole('button', { name: 'Return to Pending' }).click();
  await expect(page.locator('#review-status')).toHaveText('1 pending, 8 approved, 1 rejected.');

  await page.getByRole('button', { name: 'Generate Reviewed Record' }).click();
  const output = page.locator('#review-output');
  await expect(output).toContainText('Approved records: 8');
  await expect(output).toContainText('Rejected proposals: 1');
  await expect(output).toContainText('Pending proposals: 1');
  await expect(output).toContainText('Program Operations Lead');

  const jsonDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON Evidence' }).click();
  const jsonDownload = await jsonDownloadPromise;
  expect(jsonDownload.suggestedFilename()).toBe('meeting-intelligence-review-evidence.json');
  const jsonPath = testInfo.outputPath('meeting-intelligence-review-evidence.json');
  await jsonDownload.saveAs(jsonPath);
  const evidence = JSON.parse(await readFile(jsonPath, 'utf8'));

  expect(evidence.dataClassification).toBe('Synthetic public demonstration');
  expect(evidence.proposalMethod).toContain('Deterministic');
  expect(evidence.sourceMeeting).toContain('Please leave that as an open question');
  expect(evidence.records).toHaveLength(10);
  expect(evidence.records.filter((record) => record.status === 'approved')).toHaveLength(8);
  expect(evidence.records.filter((record) => record.status === 'rejected')).toHaveLength(1);
  expect(evidence.records.filter((record) => record.status === 'pending')).toHaveLength(1);

  const editedRecord = evidence.records.find((record) => record.id === 'ACT-002');
  expect(editedRecord.owner).toBe('Program Operations Lead');
  expect(editedRecord.history.some((event) => event.action === 'edited')).toBe(true);
  expect(editedRecord.history.some((event) => event.action === 'approved')).toBe(true);

  const rejectedRecord = evidence.records.find((record) => record.id === 'ACT-001');
  expect(rejectedRecord.status).toBe('rejected');
  expect(rejectedRecord.history.some((event) => event.action === 'rejected')).toBe(true);

  const markdownDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Markdown Record' }).click();
  const markdownDownload = await markdownDownloadPromise;
  expect(markdownDownload.suggestedFilename()).toBe('reviewed-meeting-operating-record.md');
  const markdownPath = testInfo.outputPath('reviewed-meeting-operating-record.md');
  await markdownDownload.saveAs(markdownPath);
  const markdown = await readFile(markdownPath, 'utf8');

  expect(markdown).toContain('# Reviewed Meeting Operating Record');
  expect(markdown).toContain('- Approved records: 8');
  expect(markdown).toContain('- Rejected proposals: 1');
  expect(markdown).toContain('- Pending proposals: 1');
  expect(markdown).toContain('Program Operations Lead');
  expect(markdown).toContain('ACT-001 | rejected');
  expect(markdown).toContain('CTL-001 | pending');

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#review-status')).toHaveText('No proposals loaded.');
  await expect(page.getByRole('button', { name: 'Download JSON Evidence' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Download Markdown Record' })).toBeDisabled();
});

test('states the public evidence and production-claim boundaries', async ({ page }) => {
  await expect(page.getByText('This demonstration uses a fictional meeting and deterministic pre-generated proposals.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What this MVP proves and does not prove' })).toBeVisible();
  await expect(page.getByText('Production AI extraction accuracy')).toBeVisible();
  await expect(page.getByText('Measured time savings or adoption')).toBeVisible();
  await expect(page.getByText('Autonomous authority to assign or publish work')).toBeVisible();
});

test('fits the configured viewport and exposes accessible mobile navigation', async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);

  const menu = page.getByRole('button', { name: 'Menu' });
  if (await menu.isVisible()) {
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#site-nav')).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  }
});
