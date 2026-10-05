import { test, expect } from '@playwright/test';
import { readdir, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

async function activePages(directory = '.') {
  const pages = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (['archive', 'node_modules', '.git', 'test-results', 'playwright-report', 'review-captures'].includes(item.name)) continue;
    const file = path.join(directory, item.name);
    if (item.isDirectory()) pages.push(...await activePages(file));
    else if (item.name.endsWith('.html') && (await readFile(file, 'utf8')).includes('id="site-nav"')) pages.push('/' + file.replaceAll('\\', '/'));
  }
  return pages.sort();
}

test('editorial pages remain readable and provide desktop and mobile review captures', async ({ page }, testInfo) => {
  test.skip(!['desktop-chromium', 'mobile-webkit'].includes(testInfo.project.name), 'Capture the desktop and mobile review views.');
  test.setTimeout(180_000);
  const folder = path.join('review-captures', testInfo.project.name);
  await mkdir(folder, { recursive: true });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const fullPages = new Set(['/index.html', '/work.html', '/resume.html', '/credentials.html', '/about.html', '/contact.html', '/projects/documentation-workflow.html', '/projects/retail-planning.html', '/projects/ccsf-ai-interview-coach.html', '/projects/smartgrocer.html', '/projects/project-coordination-controls.html', '/projects/ai-workflow-enablement.html']);
  for (const route of await activePages()) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    const size = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(size[0], route).toBeLessThanOrEqual(size[1] + 1);
    const hero = page.locator('.hero, .page-hero, .project-detail-hero, .artifact-page-hero, .verification-hero, .proof-hero').first();
    if (await hero.count()) {
      expect(await hero.evaluate(node => getComputedStyle(node).backgroundImage), route).toBe('none');
    }
    await page.screenshot({ path: path.join(folder, route.slice(1).replaceAll('/', '_') + '.jpg'), fullPage: fullPages.has(route), scale: 'css', type: 'jpeg', quality: 75 });
  }
  await page.goto('/work.html');
  const cards = page.locator('#featured-work .project-card h3');
  await expect(cards.first()).toHaveText('Enterprise SharePoint & Workflow Implementation');
  await expect(cards.nth(1)).toHaveText('Retail Planning & Analytics at Scale');
  const supporting = page.locator('.compact-link-list');
  expect(await supporting.evaluate(node => getComputedStyle(node).display)).toBe('grid');
  for (const link of await supporting.locator('a').all()) {
    const boxes = await link.evaluate(node => {
      const title = node.querySelector('strong').getBoundingClientRect();
      const description = node.querySelector('span').getBoundingClientRect();
      return { titleBottom: title.bottom, descriptionTop: description.top };
    });
    expect(boxes.descriptionTop).toBeGreaterThanOrEqual(boxes.titleBottom);
  }
  await page.goto('/');
  await expect(page.locator('main a[href="services.html"]')).toHaveCount(0);
  await expect(page.locator('.hero-copy')).toContainText('business systems and applied AI implementation');
  expect(errors).toEqual([]);
});
