import { test, expect } from '@playwright/test';

const demoPath = '/demos/document-intake.html';

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
  await expect(page.getByText('3routine records prepared')).toBeVisible();
  await expect(page.getByText('1probable duplicate detected')).toBeVisible();
  await expect(page.getByText('1missing-information case')).toBeVisible();
  await expect(page.getByText('1classification exception')).toBeVisible();
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
  await expect(page.getByText('6documents received')).toBeVisible();
  await expect(page.getByText('4approved records routed')).toBeVisible();
  await expect(page.getByText('2unsafe or incomplete records held')).toBeVisible();

  await testInfo.attach('document-intake-controlled-outcome', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png'
  });
});

test('reset returns the demonstration to a clean starting state', async ({ page }) => {
  await page.getByRole('button', { name: 'Process Intake Batch' }).click();
  await page.getByRole('button', { name: 'Confirm Routine Routing' }).click();
  await page.getByRole('button', { name: 'Hold Duplicate' }).click();
  await page.getByRole('button', { name: 'Create Information Request' }).click();
  await page.getByLabel('Choose the controlling classification').selectOption('General Site Documentation');
  await page.getByRole('button', { name: 'Confirm Classification' }).click();
  await expect(page.getByRole('button', { name: 'Complete Routing' })).toBeEnabled();

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#processing-section')).toBeHidden();
  await expect(page.locator('#routing-section')).toBeHidden();
  await expect(page.locator('#impact-section')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Complete Routing' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Confirm Routine Routing' })).toBeEnabled();
  await expect(page.locator('#incoming-grid .incoming-card')).toHaveCount(6);
});

test('makes the value proposition and public demonstration boundary explicit', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Move staff from processing every document to resolving the exceptions.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Every document receives a full manual intake sequence.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Routine records are prepared together. Exceptions receive focused review.' })).toBeVisible();
  await expect(page.getByText('It does not claim production model accuracy, live Microsoft 365 integration, or measured client savings.')).toBeVisible();
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
