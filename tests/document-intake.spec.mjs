import { test, expect } from '@playwright/test';

const demoPath = '/demos/document-intake.html';
const proofPath = '/evidence/ai-workflow-enablement/document-intake-proof.html';

test.beforeEach(async ({ page }) => {
  await page.goto(demoPath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Intelligent Document Intake and Routing');
});

test('processes six synthetic records, isolates three exceptions, and completes only after human review', async ({ page }, testInfo) => {
  await expect(page.locator('#incoming-grid .incoming-card')).toHaveCount(6);
  await expect(page.getByText('This uses six fictional documents', { exact: false })).toBeVisible();
  await expect(page.locator('#processing-section')).toBeHidden();

  await page.getByRole('button', { name: 'Process Intake Batch' }).click();

  await expect(page.locator('#routine-list .routine-row')).toHaveCount(3);
  await expect(page.locator('#exception-list .exception-card')).toHaveCount(3);
  await expect(page.locator('#intake-summary article').nth(0)).toContainText('3');
  await expect(page.locator('#intake-summary article').nth(0)).toContainText('routine records prepared');
  await expect(page.locator('#intake-summary article').nth(1)).toContainText('probable duplicate detected');
  await expect(page.locator('#intake-summary article').nth(2)).toContainText('missing-information case');
  await expect(page.locator('#intake-summary article').nth(3)).toContainText('classification exception');
  await expect(page.getByRole('button', { name: 'Complete Routing' })).toBeDisabled();

  await page.getByRole('button', { name: 'Confirm Routine Routing' }).click();
  await expect(page.getByRole('button', { name: 'Routine Routing Confirmed' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Complete Routing' })).toBeDisabled();

  await page.getByRole('button', { name: 'Hold Duplicate' }).click();
  await expect(page.getByText('Duplicate held outside the controlled library.', { exact: false })).toBeVisible();

  await page.getByRole('button', { name: 'Create Information Request' }).click();
  await expect(page.getByText('Information request prepared for the sender.', { exact: false })).toBeVisible();

  await page.getByRole('button', { name: 'Confirm Classification' }).click();
  await expect(page.getByLabel('Choose the controlling classification')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Complete Routing' })).toBeDisabled();

  await page.getByLabel('Choose the controlling classification').selectOption('Inspection Record');
  await page.getByRole('button', { name: 'Confirm Classification' }).click();
  await expect(page.getByText('Inspection Record confirmed.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Complete Routing' })).toBeEnabled();

  await page.getByRole('button', { name: 'Complete Routing' }).click();
  await expect(page.getByRole('heading', { name: 'Four records routed' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Two records held safely' })).toBeVisible();
  await expect(page.getByText('RSR_Inspection-Record_2026-08-03.zip')).toBeVisible();
  await expect(page.getByText('Probable duplicate retained for audit, not routed')).toBeVisible();
  await expect(page.getByText('Technical submittal pending project information from sender')).toBeVisible();
  await expect(page.locator('#impact-summary article').nth(0)).toContainText('6');
  await expect(page.locator('#impact-summary article').nth(0)).toContainText('documents received');
  await expect(page.locator('#impact-summary article').nth(1)).toContainText('4');
  await expect(page.locator('#impact-summary article').nth(1)).toContainText('approved records routed');
  await expect(page.locator('#impact-summary article').nth(2)).toContainText('2');
  await expect(page.locator('#impact-summary article').nth(2)).toContainText('unsafe or incomplete records held');

  await testInfo.attach('document-intake-controlled-outcome', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png'
  });
});

test('reset returns the demonstration to a clean starting state', async ({ page }) => {
  await page.getByRole('button', { name: 'Process Intake Batch' }).click();
  await expect(page.locator('#processing-section')).toBeVisible();
  await expect(page.locator('#exception-list .exception-card')).toHaveCount(3);

  await page.getByRole('button', { name: 'Confirm Routine Routing' }).click();
  await expect(page.getByRole('button', { name: 'Routine Routing Confirmed' })).toBeDisabled();

  const duplicateButton = page.locator('[data-exception="duplicate"] [data-resolve="duplicate"]');
  await expect(duplicateButton).toBeVisible();
  await expect(duplicateButton).toBeEnabled();
  await duplicateButton.evaluate((button) => button.click());
  await expect(page.getByText('Duplicate held outside the controlled library.', { exact: false })).toBeVisible();

  const missingButton = page.locator('[data-exception="missing"] [data-resolve="missing"]');
  await expect(missingButton).toBeVisible();
  await expect(missingButton).toBeEnabled();
  await missingButton.evaluate((button) => button.click());
  await expect(page.getByText('Information request prepared for the sender.', { exact: false })).toBeVisible();

  const classification = page.getByLabel('Choose the controlling classification');
  await classification.selectOption('General Site Documentation');
  await page.getByRole('button', { name: 'Confirm Classification' }).click();
  await expect(page.getByText('General Site Documentation confirmed.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Complete Routing' })).toBeEnabled();

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#processing-section')).toBeHidden();
  await expect(page.locator('#routing-section')).toBeHidden();
  await expect(page.locator('#impact-section')).toBeHidden();
  await expect(page.locator('#complete-routing')).toBeDisabled();
  await expect(page.locator('#confirm-routine')).toBeEnabled();
  await expect(page.locator('#incoming-grid .incoming-card')).toHaveCount(6);
});

test('makes the value proposition and public demonstration boundary explicit', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Move staff from processing every document to resolving the exceptions.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Every document receives a full manual intake sequence.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Routine records are prepared together. Exceptions receive focused review.' })).toBeVisible();
  await expect(page.getByText('It does not claim production model accuracy, live Microsoft 365 integration, or measured client savings.')).toBeVisible();
});

test('publishes the proof page, synthetic register, acceptance matrix, and proof manifest', async ({ page, request }) => {
  await page.goto(proofPath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Intelligent Document Intake and Routing Proof Pack');
  await expect(page.getByText('The counts are deterministic demonstration evidence, not measured organizational savings.')).toBeVisible();
  await expect(page.locator('.evidence-table tbody tr')).toHaveCount(6);
  await expect(page.getByRole('heading', { name: 'This is working proof of workflow logic, not a claim that the client implementation already exists.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Run the Working Demonstration' })).toHaveAttribute('href', '../../demos/document-intake.html');
  await expect(page.getByRole('link', { name: 'Download Synthetic Record Register' })).toHaveAttribute('href', 'document-intake-synthetic-records.csv');
  await expect(page.getByRole('link', { name: 'Open Acceptance Matrix' })).toHaveAttribute('href', 'document-intake-acceptance.csv');
  await expect(page.getByRole('link', { name: 'Open Machine-Readable Proof Manifest' })).toHaveAttribute('href', 'document-intake-proof.json');

  const registerResponse = await request.get('/evidence/ai-workflow-enablement/document-intake-synthetic-records.csv');
  expect(registerResponse.ok()).toBeTruthy();
  const registerText = await registerResponse.text();
  expect(registerText).toContain('DOC-006,Site Photos and Notes.zip');

  const matrixResponse = await request.get('/evidence/ai-workflow-enablement/document-intake-acceptance.csv');
  expect(matrixResponse.ok()).toBeTruthy();
  const matrixText = await matrixResponse.text();
  expect(matrixText).toContain('DI-AT-11,Public claim boundary');

  const manifestResponse = await request.get('/evidence/ai-workflow-enablement/document-intake-proof.json');
  expect(manifestResponse.ok()).toBeTruthy();
  const manifest = await manifestResponse.json();
  expect(manifest.maturity).toBe('Working browser demonstration');
  expect(manifest.synthetic_records.count).toBe(6);
  expect(manifest.public_artifacts).toContain('tests/document-intake.spec.mjs');
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
