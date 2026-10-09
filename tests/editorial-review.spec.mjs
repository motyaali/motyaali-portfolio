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
  for (const route of await activePages()) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    const size = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(size[0], route).toBeLessThanOrEqual(size[1] + 1);
    const contrasts = await page.locator('.metric-card strong, .metric-card span, .impact-item strong, .impact-item span, .proof-button-secondary').evaluateAll(nodes => {
      const rgb = value => value.match(/[\d.]+/g).map(Number);
      const luminance = color => rgb(color).slice(0, 3).map(value => {
        const channel = value / 255;
        return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
      }).reduce((total, channel, i) => total + channel * [.2126, .7152, .0722][i], 0);
      return nodes.filter(node => node.getClientRects().length).map(node => {
        let parent = node;
        while (parent.parentElement && (rgb(getComputedStyle(parent).backgroundColor)[3] ?? 1) === 0) parent = parent.parentElement;
        const foreground = luminance(getComputedStyle(node).color);
        const background = luminance(getComputedStyle(parent).backgroundColor);
        return { text: node.textContent.trim(), ratio: (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05) };
      });
    });
    for (const item of contrasts) expect(item.ratio, `${route}: ${item.text}`).toBeGreaterThanOrEqual(4.5);
    const hero = page.locator('.hero, .page-hero, .project-detail-hero, .artifact-page-hero, .verification-hero, .proof-hero').first();
    if (await hero.count()) {
      expect(await hero.evaluate(node => getComputedStyle(node).backgroundImage), route).toBe('none');
    }
    await expect(page.locator('body')).not.toContainText('The career evolution is deliberate.');
    await expect(page.locator('body')).not.toContainText('Computer Science Office Aide');
    await page.screenshot({ path: path.join(folder, route.slice(1).replaceAll('/', '_') + '.jpg'), fullPage: true, scale: 'css', type: 'jpeg', quality: 75 });
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
      const description = node.querySelector('.system-description').getBoundingClientRect();
      return { titleBottom: title.bottom, descriptionTop: description.top };
    });
    expect(boxes.descriptionTop).toBeGreaterThanOrEqual(boxes.titleBottom);
  }
  await page.goto('/resume.html');
  await expect(page.locator('.role-title').first()).toHaveText('Computer Science Dept Aid');
  for (const route of ['/index.html', '/work.html']) {
    await page.goto(route);
    const cards = page.locator('.project-card');
    for (const card of await cards.all()) await expect(card).not.toContainText(/Sanitized|Synthetic public proof/);
    if (testInfo.project.name === 'desktop-chromium') {
      const covers = await cards.locator('.project-cover').evaluateAll(nodes => nodes.slice(1, 3).map(node => {
        const box = node.getBoundingClientRect(); return { top: box.top, height: box.height };
      }));
      expect(Math.abs(covers[0].top - covers[1].top), route).toBeLessThanOrEqual(1);
      expect(Math.abs(covers[0].height - covers[1].height), route).toBeLessThanOrEqual(1);
      const titles = await cards.locator('h3').evaluateAll(nodes => nodes.slice(1, 3).map(node => node.getBoundingClientRect().top));
      expect(Math.abs(titles[0] - titles[1]), route).toBeLessThanOrEqual(1);
    }
  }
  await page.goto('/');
  await expect(page.locator('main a[href="services.html"]')).toHaveCount(0);
  await expect(page.locator('.hero-copy')).toContainText('business systems and applied AI implementation');
  expect(errors).toEqual([]);
});
