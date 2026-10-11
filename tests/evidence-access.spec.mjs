import { test, expect } from '@playwright/test';

test('applications and samples remain accessible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8000/evidence.html');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Demos, code, and work samples.');
  const localLinks = await page.locator('main a').evaluateAll(nodes => nodes.map(node => node.href).filter(url => new URL(url).origin === location.origin));
  for (const url of localLinks) {
    const response = await page.request.get(url);
    expect(response.ok(), url).toBeTruthy();
  }
  for (const route of ['interview-coach.html', 'smartgrocer.html']) {
    await page.goto('http://127.0.0.1:8000/evidence/implementation/' + route);
    await expect(page.locator('main h1')).toBeVisible();
    const sizes = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(sizes[0], route).toBeLessThanOrEqual(sizes[1] + 1);
  }
  const sample = await page.request.get('http://127.0.0.1:8000/evidence/implementation/sample-resume.txt');
  expect(await sample.text()).toContain('FICTIONAL DEMONSTRATION RESUME');
  await context.close();
});

test('additional project library expands by keyboard without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8000/work.html');
  const library = page.locator('.project-library');
  await expect(library).not.toHaveAttribute('open', '');
  const summary = library.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(library).toHaveAttribute('open', '');
  await expect(library.getByRole('link', { name: /Construction Project Coordination Controls/ })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(library).not.toHaveAttribute('open', '');
  await expect(page.locator('#featured-work')).toContainText('SOMA Budget Planner');
  await context.close();
});
