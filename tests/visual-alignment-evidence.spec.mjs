import { test, expect } from '@playwright/test';

test('career file claims expose working public evidence links', async ({ page }) => {
  await page.goto('/');
  const rows = page.locator('.field-note-row');
  await expect(rows).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'Career file / 01' })).toBeVisible();
  for (const row of await rows.all()) {
    const links = row.locator('.field-note-links a');
    expect(await links.count()).toBeGreaterThanOrEqual(2);
    for (const link of await links.all()) {
      const name = (await link.textContent()).trim();
      expect(name.length).toBeGreaterThan(4);
      const href = await link.getAttribute('href');
      expect(href, name).toBeTruthy();
      const target = new URL(href, page.url());
      expect(target.origin).toBe(new URL(page.url()).origin);
      const response = await page.request.get(target.href);
      expect(response.ok(), target.href).toBeTruthy();
      if (target.hash) {
        const fragment = decodeURIComponent(target.hash.slice(1));
        expect(await response.text(), target.href).toContain(`id="${fragment}"`);
      }
    }
  }
  await expect(page.locator('.field-note-disclosure')).toContainText('Confidential employer records');
});

test('featured split cards align with the two-column grid on desktop', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Desktop split-card alignment.');
  await page.setViewportSize({ width: 1600, height: 900 });
  for (const route of ['/', '/work.html']) {
    await page.goto(route);
    const cards = page.locator('.project-grid > .project-card');
    const first = cards.first();
    const cardBox = await first.boundingBox();
    const coverBox = await first.locator('.project-cover').boundingBox();
    expect(Math.abs(coverBox.x + coverBox.width - (cardBox.x + cardBox.width / 2)), route).toBeLessThanOrEqual(2);
    if (route === '/work.html') {
      const last = cards.last();
      const lastBox = await last.boundingBox();
      const lastCover = await last.locator('.project-cover').boundingBox();
      expect(Math.abs(lastCover.x + lastCover.width - (lastBox.x + lastBox.width / 2))).toBeLessThanOrEqual(2);
      const left = await cards.nth(1).boundingBox();
      const right = await cards.nth(2).boundingBox();
      const gapCenter = (left.x + left.width + right.x) / 2;
      expect(Math.abs(lastCover.x + lastCover.width - gapCenter)).toBeLessThanOrEqual(2);
    }
  }
});

test('Work introduction leads directly into the featured cases', async ({ page }) => {
  await page.goto('/work.html');
  const hero = await page.locator('.page-hero').boundingBox();
  const heading = await page.locator('#featured-work .section-heading').boundingBox();
  expect(heading.y - (hero.y + hero.height)).toBeGreaterThanOrEqual(0);
  expect(heading.y - (hero.y + hero.height)).toBeLessThanOrEqual(70);
  await expect(page.locator('#featured-work .section-heading > p:not(.eyebrow)')).toContainText('Start with six featured cases');
});
