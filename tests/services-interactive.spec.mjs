import { test, expect } from '@playwright/test';

const servicePath = '/services.html';

test.beforeEach(async ({ page }) => {
  await page.goto(servicePath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Practical workflows that reduce routine handling without weakening control.');
});

test('presents all thirteen service tiles as accessible collapsed controls', async ({ page }) => {
  const whereHelp = page.locator('#where-i-help [data-service-tile]');
  const packages = page.locator('#engagement-packages [data-service-tile]');
  const method = page.locator('#delivery-method [data-service-tile]');

  await expect(whereHelp).toHaveCount(5);
  await expect(packages).toHaveCount(4);
  await expect(method).toHaveCount(4);

  for (const tile of await page.locator('[data-service-tile]').all()) {
    await expect(tile).toHaveAttribute('aria-expanded', 'false');
  }

  await expect(page.locator('#where-i-help-detail')).toBeHidden();
  await expect(page.locator('#engagement-packages-detail')).toBeHidden();
  await expect(page.locator('#delivery-method-detail')).toBeHidden();
});

test('expands and switches Where I Help details without navigating away', async ({ page }) => {
  const group = page.locator('#where-i-help');
  const meeting = group.locator('[data-service-tile="meeting-intelligence"]');
  const documentIntake = group.locator('[data-service-tile="document-intake"]');
  const panel = page.locator('#where-i-help-detail');

  await meeting.click();
  await expect(meeting).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Meeting Intelligence' })).toBeVisible();
  await expect(panel.getByText('prepare the routine coordination package together', { exact: false })).toBeVisible();
  await expect(panel.getByRole('link', { name: 'Run the Demonstration' })).toHaveAttribute('href', 'demos/meeting-intelligence.html');

  await documentIntake.click();
  await expect(meeting).toHaveAttribute('aria-expanded', 'false');
  await expect(documentIntake).toHaveAttribute('aria-expanded', 'true');
  await expect(panel.getByRole('heading', { name: 'Document Intake' })).toBeVisible();
  await expect(panel.getByText('hold duplicates, incomplete records, and uncertain classifications', { exact: false })).toBeVisible();
  await expect(panel.getByRole('link', { name: 'Inspect the Proof Pack' })).toHaveAttribute('href', 'evidence/ai-workflow-enablement/document-intake-proof.html');
  await expect(panel.getByRole('link', { name: 'Discuss This Process' })).toHaveAttribute('href', 'ai-workflow-enablement/discovery.html');
});

test('expands engagement package context and preserves the controlled-pilot boundary', async ({ page }) => {
  const group = page.locator('#engagement-packages');
  const pilot = group.locator('[data-service-tile="controlled-pilot"]');
  const panel = page.locator('#engagement-packages-detail');

  await pilot.click();
  await expect(pilot).toHaveAttribute('aria-expanded', 'true');
  await expect(panel.getByRole('heading', { name: 'Controlled Pilot' })).toBeVisible();
  await expect(panel.getByText('one recurring process, one team or business unit, approximately 5 to 20 pilot users', { exact: false })).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Typical scope' })).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'You receive' })).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'What I need from you' })).toBeVisible();
  await expect(panel.getByRole('link', { name: 'Prepare a Pilot Conversation' })).toHaveAttribute('href', 'ai-workflow-enablement/discovery.html');
});

test('turns each delivery-method stage into an inspectable operating step', async ({ page }) => {
  const group = page.locator('#delivery-method');
  const validate = group.locator('[data-service-tile="validate-document"]');
  const panel = page.locator('#delivery-method-detail');

  await validate.click();
  await expect(validate).toHaveAttribute('aria-expanded', 'true');
  await expect(panel.getByRole('heading', { name: 'Validate & Document' })).toBeVisible();
  await expect(panel.getByText('agreed acceptance scenarios pass', { exact: false })).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Test coverage' })).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Evidence' })).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Documentation' })).toBeVisible();
  await expect(panel.getByRole('link', { name: 'Inspect Acceptance Evidence' })).toHaveAttribute('href', 'evidence/ai-workflow-enablement/document-intake-proof.html');
});

test('supports Escape and explicit close while returning focus to the selected tile', async ({ page }) => {
  const tile = page.locator('#where-i-help [data-service-tile="status-reporting"]');
  const panel = page.locator('#where-i-help-detail');

  await tile.focus();
  await page.keyboard.press('Enter');
  await expect(panel).toBeVisible();
  await expect(tile).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(tile).toHaveAttribute('aria-expanded', 'false');
  await expect(tile).toBeFocused();

  await tile.click();
  await panel.getByRole('button', { name: 'Close details' }).click();
  await expect(panel).toBeHidden();
  await expect(tile).toBeFocused();
});

test('places expanded detail directly after the selected tile on mobile and restores desktop placement otherwise', async ({ page }) => {
  const tile = page.locator('#where-i-help [data-service-tile="request-triage"]');
  const panel = page.locator('#where-i-help-detail');

  await tile.click();
  await expect(panel).toBeVisible();

  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  if (viewportWidth <= 720) {
    await expect(panel.locator('xpath=..')).toHaveAttribute('data-service-tile-grid', '');
    const priorKey = await panel.evaluate((element) => element.previousElementSibling?.dataset?.serviceTile || '');
    expect(priorKey).toBe('request-triage');
  } else {
    const parentId = await panel.evaluate((element) => element.parentElement?.id || '');
    expect(parentId).toBe('where-i-help');
  }
});

test('keeps the interactive Services page within the configured viewport after expansion', async ({ page }) => {
  for (const selector of [
    '#where-i-help [data-service-tile="sop-knowledge"]',
    '#engagement-packages [data-service-tile="full-implementation"]',
    '#delivery-method [data-service-tile="train-handoff"]'
  ]) {
    await page.locator(selector).click();
    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  }
});
