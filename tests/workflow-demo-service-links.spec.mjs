import { test, expect } from '@playwright/test';

const cases = [
  { key: 'status-reporting', demo: 'demos/status-reporting.html', proof: 'evidence/ai-workflow-enablement/status-reporting-proof.html' },
  { key: 'request-triage', demo: 'demos/request-triage.html', proof: 'evidence/ai-workflow-enablement/request-triage-proof.html' },
  { key: 'sop-knowledge', demo: 'demos/sop-knowledge.html', proof: 'evidence/ai-workflow-enablement/sop-knowledge-proof.html' }
];

test('Services exposes direct working-demo and proof-pack actions for the completed workflow family', async ({ page }) => {
  await page.goto('/services.html');
  for (const item of cases) {
    const card = page.locator('.service-example-grid article').filter({ has: page.locator(`a[href="${item.demo}"]`) });
    await expect(card.getByRole('link', { name: 'Run the demo' })).toHaveAttribute('href', item.demo);
    await expect(card.getByRole('link', { name: 'Inspect the proof pack' })).toHaveAttribute('href', item.proof);
    await card.getByRole('link', { name: 'Run the demo' }).click();
    await expect(page.locator('#start-demo button')).toBeVisible();
    await page.goto('/services.html');
  }
});
