import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/work.html',
  '/resume.html',
  '/services.html',
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
      if (url.origin === 'http://127.0.0.1:8000' && response.status() >= 400) {
        failedResponses.push(`${response.status()} ${url.pathname}`);
      }
    });

    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    expect(failedResponses).toEqual([]);
  });
}

test('homepage leads hiring teams into four role-specific pathways', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#employer-pathways .role-pathway');
  await expect(cards).toHaveCount(4);

  const hrefs = await cards.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(hrefs).toEqual([
    'roles/project-operations.html',
    'roles/business-systems.html',
    'roles/planning-inventory.html',
    'roles/human-centered-ai.html'
  ]);
});

test('homepage keeps the first decision focused on work and resume', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('.hero-recruiter');
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText('I turn complex work into clear systems people can run.');
  await expect(hero.getByRole('link', { name: 'View Selected Work' })).toHaveAttribute('href', 'work.html');
  await expect(hero.getByRole('link', { name: 'Download Résumé PDF' })).toHaveAttribute('href', 'assets/Motya-Ali-Resume.pdf');
  await expect(page.locator('#flagship-heading')).toHaveText('Three places to start.');
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

test('Work page is curated to six featured projects with secondary systems links', async ({ page }) => {
  await page.goto('/work.html');
  await expect(page.locator('#featured-work .project-card')).toHaveCount(6);
  await expect(page.locator('.compact-link-list a')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'CentaurOS' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Unseen Sentry' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Blue Chip Bot' })).toHaveCount(0);
});

test('preserves the complete pre-redesign portfolio as an in-site archive snapshot', async ({ page }) => {
  const response = await page.request.get('/archive/portfolio-v1-2026-08-13/index.html');
  expect(response.ok()).toBeTruthy();
  const html = await response.text();
  expect(html).toContain('Turning complexity into clear systems and useful work.');
  expect(html).toContain('For organizations');
});
