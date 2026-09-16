import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const demoPath = '/demos/meeting-intelligence.html';

test.beforeEach(async ({ page }) => {
  await page.goto(demoPath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('From scattered team updates to one client-ready brief.');
});

test('assembles distributed updates, isolates exceptions, and produces three usable outputs', async ({ page }, testInfo) => {
  await expect(page.locator('.contributor-card')).toHaveCount(6);
  await expect(page.locator('.contributor-card.received')).toHaveCount(5);
  await expect(page.locator('.contributor-card.missing')).toHaveCount(1);
  await expect(page.getByText('No compliance update has been received.', { exact: false })).toBeVisible();

  await page.getByRole('button', { name: 'Assemble Team Update' }).click();
  await expect(page.getByRole('heading', { name: 'Routine information is assembled. Three exceptions need attention.' })).toBeVisible();
  await expect(page.locator('#coordination-exceptions .exception-card')).toHaveCount(3);
  await expect(page.getByText('Delivery date conflict: August 12 or August 14')).toBeVisible();
  await expect(page.getByText('Site B access owner not established')).toBeVisible();
  await expect(page.getByText('Compliance update not received')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Finalize Coordination Package' })).toBeDisabled();

  await page.getByRole('button', { name: 'Prepare Targeted Follow-up' }).click();
  await page.getByLabel('Working date').selectOption('August 14');
  await page.getByRole('button', { name: 'Confirm Working Date' }).click();
  await page.getByLabel('Assign coordination owner').selectOption('Marco Ruiz, Site Coordinator');
  await page.getByRole('button', { name: 'Confirm Owner' }).click();

  await expect(page.getByText('August 14 selected as the working delivery date')).toBeVisible();
  await expect(page.getByText('Marco Ruiz, Site Coordinator assigned to coordinate')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Finalize Coordination Package' })).toBeEnabled();

  await page.getByRole('button', { name: 'Finalize Coordination Package' }).click();
  await expect(page.getByRole('heading', { name: 'One review produces three usable outputs.' })).toBeVisible();
  await expect(page.locator('.package-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Client-ready status brief', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Action and exception register' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Targeted follow-up request' })).toBeVisible();

  const markdownDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Coordination Brief' }).click();
  const markdownDownload = await markdownDownloadPromise;
  expect(markdownDownload.suggestedFilename()).toBe('client-coordination-brief.md');
  const markdownPath = testInfo.outputPath('client-coordination-brief.md');
  await markdownDownload.saveAs(markdownPath);
  const markdown = await readFile(markdownPath, 'utf8');
  expect(markdown).toContain('# Client Coordination Brief');
  expect(markdown).toContain('Equipment delivery is being managed to August 14');
  expect(markdown).toContain('Marco Ruiz, Site Coordinator owns the Site B access follow-up');
  expect(markdown).toContain('targeted request has been prepared for the missing compliance update');

  const jsonDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON Evidence' }).click();
  const jsonDownload = await jsonDownloadPromise;
  expect(jsonDownload.suggestedFilename()).toBe('meeting-intelligence-evidence.json');
  const jsonPath = testInfo.outputPath('meeting-intelligence-evidence.json');
  await jsonDownload.saveAs(jsonPath);
  const evidence = JSON.parse(await readFile(jsonPath, 'utf8'));
  expect(evidence.workflow).toBe('AI Workflow Enablement - Meeting Intelligence Coordination Demonstration');
  expect(evidence.dataClassification).toBe('Synthetic public demonstration');
  expect(evidence.inputs).toHaveLength(6);
  expect(evidence.reviewSummary.updatesReceived).toBe(5);
  expect(evidence.reviewSummary.exceptionsReviewed).toBe(3);
  expect(evidence.decisions.deliveryDate).toBe('August 14');
  expect(evidence.decisions.siteAccessOwner).toBe('Marco Ruiz, Site Coordinator');
  expect(evidence.outputs).toHaveLength(3);
});

test('makes the before-and-after value proposition visible before the controls', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Review the exceptions, not every line of every update.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The coordinator rebuilds the picture manually.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The workflow assembles the package and isolates judgment.' })).toBeVisible();
  await expect(page.getByText('Search email, chat, notes, and trackers for six contributor updates')).toBeVisible();
  await expect(page.getByText('Draft the client brief and action register together')).toBeVisible();
  await expect(page.getByText('These are demonstration counts, not measured organizational savings.')).toBeVisible();
  await expect(page.getByText('This is not the customer-facing MVP', { exact: false })).toHaveCount(0);
  await expect(page.getByText('Correct role:', { exact: false })).toHaveCount(0);
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
