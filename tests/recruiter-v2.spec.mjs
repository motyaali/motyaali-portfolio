import { test, expect } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
async function navigationPages(directory = root) {
  const pages = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (['archive', 'node_modules', '.git', 'test-results', 'playwright-report'].includes(item.name)) continue;
    const file = path.join(directory, item.name);
    if (item.isDirectory()) pages.push(...await navigationPages(file));
    else if (item.name.endsWith('.html') && (await readFile(file, 'utf8')).includes('id="site-nav"')) pages.push('/' + path.relative(root, file).replaceAll('\\', '/'));
  }
  return pages;
}

test('all active pages have the same usable primary navigation without JavaScript', async ({ browser }) => {
  test.setTimeout(120_000);
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  for (const route of await navigationPages()) {
    await page.goto('http://127.0.0.1:8000' + route);
    const links = page.locator('#site-nav a');
    await expect(links).toHaveText(['Work', 'Résumé', 'About', 'Services', 'Contact']);
    const destinations = await links.evaluateAll(nodes => nodes.map(node => new URL(node.href).pathname));
    expect(destinations, route).toEqual(['/work.html', '/resume.html', '/about.html', '/services.html', '/contact.html']);
    expect(await page.locator('#site-nav [aria-current="page"]').count()).toBeLessThanOrEqual(1);
    await expect(page.locator('.brand')).toHaveAttribute('href', /index\.html$/);
  }
  await context.close();
});

test('featured covers render as labeled artifacts without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [route, count] of [['/', 3], ['/work.html', 6]]) {
    await page.goto('http://127.0.0.1:8000' + route);
    await expect(page.locator('.project-cover.artifact-cover')).toHaveCount(count);
    await expect(page.locator('.artifact-caption')).toHaveCount(count);
    await expect(page.locator('.project-symbol')).toHaveCount(0);
    await expect(page.locator('.artifact-thumb').first()).toBeVisible();
  }
  await context.close();
});

test('hub entries reach preloaded interactive samples and return to the evidence hub', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const key of ['document-intake', 'meeting-intelligence', 'status-reporting', 'request-triage', 'sop-knowledge']) {
    await page.goto('/ai-workflow-enablement/');
    await page.locator(`#workflow-demos a[href="../demos/${key}.html#start-demo"]`).click();
    await expect(page.locator('#start-demo button')).toBeVisible();
    await expect(page.locator('#start-demo')).toBeInViewport();
    expect(await page.locator('#start-demo').evaluate(node => node.compareDocumentPosition(document.querySelector('.value-panel')) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
    await page.getByRole('link', { name: 'All workflow demonstrations' }).click();
    await expect(page).toHaveURL(/ai-workflow-enablement\/#workflow-demos$/);
  }
  expect(errors).toEqual([]);
});

test('V2 recruiter pages fit the viewport and keep mobile navigation usable', async ({ page }, testInfo) => {
  for (const route of ['/', '/work.html', '/ai-workflow-enablement/', '/projects/project-coordination-controls.html', '/projects/documentation-workflow.html', '/projects/retail-planning.html', '/projects/canonical-synthesis.html', '/projects/smartgrocer.html', '/evidence/ai-workflow-enablement/document-intake-proof.html', '/evidence/ai-workflow-enablement/status-reporting-proof.html', '/evidence/ai-workflow-enablement/request-triage-proof.html', '/evidence/ai-workflow-enablement/sop-knowledge-proof.html', '/evidence/ai-workflow-enablement/benchmark-methodology.html', '/evidence/documentation-workflow/role-based-workflow-guide.html', '/evidence/canonical-synthesis/evidence-pack.html', '/evidence/inventory-ledger/evidence-pack.html']) {
    await page.goto(route);
    const sizes = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(sizes[0], route).toBeLessThanOrEqual(sizes[1] + 1);
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    if (await menu.isVisible()) {
      await menu.click();
      await expect(page.locator('#site-nav a')).toHaveText(['Work', 'Résumé', 'About', 'Services', 'Contact']);
      await expect(page.locator('#site-nav a').last()).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
    }
    if (['/', '/work.html', '/ai-workflow-enablement/'].includes(route)) await testInfo.attach(route === '/' ? 'home' : route.replaceAll('/', '_'), { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  }
});
