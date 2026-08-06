const { test, expect } = require('@playwright/test');

const pages = [
  '/',
  '/work.html',
  '/resume.html',
  '/projects/smartgrocer.html',
  '/projects/retail-planning.html',
  '/projects/documentation-workflow.html',
  '/projects/unseen-lifeline.html',
  '/projects/inventory-ledger.html',
  '/projects/canonical-synthesis.html',
  '/projects/unseen-os.html'
];

for (const path of pages) {
  test(`${path} loads without broken local resources`, async ({ page }) => {
    const failedResponses = [];
    page.on('response', (response) => {
      const url = new URL(response.url());
      if (url.origin === 'http://127.0.0.1:4173' && response.status() >= 400) {
        failedResponses.push(`${response.status()} ${url.pathname}`);
      }
    });

    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    expect(failedResponses).toEqual([]);
  });
}

test('homepage capability cards link to specific evidence', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.capability-link');
  await expect(cards).toHaveCount(5);

  const hrefs = await cards.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(hrefs).toEqual([
    'projects/retail-planning.html',
    'projects/documentation-workflow.html',
    'projects/smartgrocer.html',
    'projects/project-coordination-controls.html',
    'ai-workflow-enablement/'
  ]);
});

test('resume provides a direct PDF download', async ({ page }) => {
  await page.goto('/resume.html');
  const resumeLink = page.locator('a[download][href="assets/Motya-Ali-Resume.pdf"]').first();
  await expect(resumeLink).toBeVisible();

  const response = await page.request.get('/assets/Motya-Ali-Resume.pdf');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/pdf');
  const bytes = await response.body();
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
});

test('navigation uses employer-first order', async ({ page }) => {
  await page.goto('/projects/smartgrocer.html');
  const labels = await page.locator('#site-nav a').allTextContents();
  expect(labels.map((label) => label.trim())).toEqual([
    'Home',
    'Work',
    'About',
    'Résumé',
    'Services',
    'Contact'
  ]);
});

test('Concept Lab remains on the Work page', async ({ page }) => {
  await page.goto('/work.html');
  await expect(page.getByRole('heading', { name: 'Developed ideas, separated from released work.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'CentaurOS' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Unseen Sentry' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Blue Chip Bot' })).toBeVisible();
});
