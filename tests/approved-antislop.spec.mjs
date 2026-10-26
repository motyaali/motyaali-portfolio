import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('approved responsive changes preserve evidence and readable previews', async ({ page }, info) => {
  test.skip(!['desktop-chromium', 'mobile-webkit'].includes(info.project.name));
  await mkdir(`review-captures/${info.project.name}`, { recursive: true });
  for (const width of [390, 768, 1280, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/work.html']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      const coach = page.locator('.project-grid .coach-preview');
      const cover = await coach.locator('..').boundingBox();
      for (const step of await coach.locator('.coach-preview-body > div').all()) {
        const box = await step.boundingBox();
        expect(box.y + box.height).toBeLessThanOrEqual(cover.y + cover.height + 1);
      }
      if (width === 390) {
        for (const label of await coach.locator('strong, span, small, b').all()) {
          expect(await label.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(12.8);
        }
      }
      await page.screenshot({ path: `review-captures/${info.project.name}/approved-${route === '/' ? 'home' : 'work'}-${width}.jpg`, fullPage: true });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const firstProject = () => page.locator('.project-card').first().evaluate(el => el.getBoundingClientRect().top + scrollY);
  expect(await firstProject()).toBeLessThan(2500);
  await expect(page.locator('.field-note-links a')).toHaveCount(9);
  await expect(page.locator('.impact-item')).toHaveCount(5);
});

test('keyboard focus and navigation work across portfolio routes', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'Real Tab traversal in Chromium; Windows WebKit does not advance focus with Tab.');
  for (const route of ['/', '/work.html', '/projects/ccsf-ai-interview-coach.html', '/projects/documentation-workflow.html']) {
    await page.goto(route);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const el = document.activeElement, style = getComputedStyle(el);
        return { tag: el.tagName, html: el.outerHTML.slice(0, 150), width: parseFloat(style.outlineWidth), style: style.outlineStyle, visible: el.getClientRects().length > 0 };
      });
      if (focus.tag === 'BODY') continue; // Tab can pass through browser chrome after the final link.
      expect(focus.visible).toBeTruthy();
      expect(focus.width).toBeGreaterThanOrEqual(3);
      expect(focus.style, `${route}: ${focus.html}`).toBe('solid');
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.locator('.site-nav a').first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/work.html$/);
});
