import { test, expect } from '@playwright/test';

const cases = [
  { key: 'status-reporting', demo: 'demos/status-reporting.html', proof: 'evidence/ai-workflow-enablement/status-reporting-proof.html' },
  { key: 'request-triage', demo: 'demos/request-triage.html', proof: 'evidence/ai-workflow-enablement/request-triage-proof.html' },
  { key: 'sop-knowledge', demo: 'demos/sop-knowledge.html', proof: 'evidence/ai-workflow-enablement/sop-knowledge-proof.html' }
];

test('Services exposes direct working-demo and proof-pack actions for the completed workflow family', async ({ page }) => {
  await page.goto('/services.html');
  const group = page.locator('#where-i-help');
  const panel = page.locator('#where-i-help-detail');

  for (const item of cases) {
    await group.locator(`[data-service-tile="${item.key}"]`).click();
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Run the Demonstration' })).toHaveAttribute('href', item.demo);
    await expect(panel.getByRole('link', { name: 'Inspect the Proof Pack' })).toHaveAttribute('href', item.proof);
  }
});
