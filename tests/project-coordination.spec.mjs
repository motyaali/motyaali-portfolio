import { test, expect } from '@playwright/test';

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
}

test('case study exposes the second evidence release', async ({ page }) => {
  await page.goto('/projects/project-coordination-controls.html');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Construction Project Coordination Controls');
  await expect(page.getByRole('heading', { name: 'What the evidence releases prove' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Review the RFP package' })).toHaveAttribute(
    'href',
    '../proof/project-coordination-controls/rfp-bid-package.html'
  );
  await expect(page.getByRole('link', { name: 'Open the meeting pack' }).first()).toHaveAttribute(
    'href',
    '../proof/project-coordination-controls/weekly-meeting-pack.html'
  );
  await expect(page.getByText('Second inspectable evidence release complete.')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('RFP package presents scope, exclusions, criteria, bid form, and reconstruction limits', async ({ page }) => {
  await page.goto('/proof/project-coordination-controls/rfp-bid-package.html');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Request for Proposal and Bid Package');
  await expect(page.getByText('Source reconstruction note:')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Description of scope of work' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Items not in scope' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selection criteria' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bid form' })).toBeVisible();
  await expect(page.getByText('40%')).toBeVisible();
  await expect(page.getByText('Conflicting draft language was not copied into the final scope.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download submission checklist' })).toHaveAttribute(
    'href',
    'bid-submission-checklist.csv'
  );
  await expectNoHorizontalOverflow(page);
});

test('meeting pack separates agenda, minutes, decisions, actions, and authority', async ({ page }) => {
  await page.goto('/proof/project-coordination-controls/weekly-meeting-pack.html');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Weekly Coordination Meeting Pack');
  await expect(page.getByRole('heading', { name: 'Time-boxed discussion plan' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Discussion and outcome record' })).toBeVisible();
  await expect(page.getByText('Decision D-014:')).toBeVisible();
  await expect(page.getByText('Decision D-018:')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Decisions confirmed during read-back' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Updated actions and deadlines' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download decision log' })).toHaveAttribute('href', 'decision-log.csv');
  await expect(page.getByText('Correction deadline')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
