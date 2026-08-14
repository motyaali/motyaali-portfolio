import { test, expect } from '@playwright/test';

const servicePath = '/services.html';

test.beforeEach(async ({ page }) => {
  await page.goto(servicePath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Improve one recurring workflow without creating another system people hate.');
});

test('leads with a low-friction conversation and working examples', async ({ page }) => {
  const hero = page.locator('.service-hero');
  await expect(hero.getByRole('link', { name: 'Start a Conversation' })).toHaveAttribute('href', /mailto:motyaali@pm\.me/);
  await expect(hero.getByRole('link', { name: 'See Working Examples' })).toHaveAttribute('href', 'ai-workflow-enablement/');
  await expect(hero.getByText('Best fit:', { exact: false })).toBeVisible();
});

test('presents six bounded workflow starting points and five direct demonstrations', async ({ page }) => {
  const cards = page.locator('.service-example-grid article');
  await expect(cards).toHaveCount(6);
  await expect(page.getByRole('link', { name: 'Run the demo' })).toHaveCount(5);
  await expect(page.getByRole('heading', { name: 'Meeting follow-up' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Document intake & routing' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Project status reporting' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Work request triage' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'SOP & knowledge assistance' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review & approval control' })).toBeVisible();
});

test('uses a three-stage commercial path from diagnostic to handoff', async ({ page }) => {
  const steps = page.locator('.service-step-grid article');
  await expect(steps).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Workflow Diagnostic' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Controlled Pilot' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Implementation & Handoff' })).toBeVisible();
});

test('makes operating deliverables and fit boundaries explicit', async ({ page }) => {
  await expect(page.locator('.deliverable-list li')).toHaveCount(6);
  await expect(page.getByRole('heading', { name: 'Strong fit' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Not a good first project' })).toBeVisible();
  await expect(page.getByText('high-impact decisions expected to run without human review', { exact: false })).toBeVisible();
});

test('keeps the structured process brief as a second-stage discovery option', async ({ page }) => {
  const finalCta = page.locator('.service-final-cta');
  await expect(finalCta.getByRole('link', { name: 'Start a Conversation' })).toHaveAttribute('href', /mailto:motyaali@pm\.me/);
  await expect(finalCta.getByRole('link', { name: 'Prepare a Process Brief' })).toHaveAttribute('href', 'ai-workflow-enablement/discovery.html');
});

test('keeps the simplified Services page within the configured viewport', async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
});
