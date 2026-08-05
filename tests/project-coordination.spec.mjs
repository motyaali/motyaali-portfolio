import { test, expect } from '@playwright/test';

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
}

test('case study exposes the third evidence release', async ({ page }) => {
  await page.goto('/projects/project-coordination-controls.html');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Construction Project Coordination Controls');
  await expect(page.getByRole('heading', { name: 'What the evidence releases prove' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View the connected process' })).toHaveAttribute(
    'href',
    '../proof/project-coordination-controls/process-map.html'
  );
  await expect(page.getByRole('link', { name: 'Review the change control' })).toHaveAttribute(
    'href',
    '../proof/project-coordination-controls/change-package-control.html'
  );
  await expect(page.getByRole('link', { name: 'Review the invoice control' })).toHaveAttribute(
    'href',
    '../proof/project-coordination-controls/invoice-routing-control.html'
  );
  await expect(page.getByRole('link', { name: 'Open the interview walkthrough' }).first()).toHaveAttribute(
    'href',
    '../proof/project-coordination-controls/interview-walkthrough.html'
  );
  await expect(page.getByText('Third inspectable evidence release complete.')).toBeVisible();
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

test('process map links the lifecycle while preserving responsibility boundaries', async ({ page }) => {
  await page.goto('/proof/project-coordination-controls/process-map.html');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Connected Project Coordination Process Map');
  await expect(page.getByRole('heading', { name: 'How the records connect' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Who prepares, verifies, reviews, and decides' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What prevents work from being lost between stages' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change package control' })).toHaveAttribute('href', 'change-package-control.html');
  await expect(page.getByRole('link', { name: 'Invoice routing control' })).toHaveAttribute('href', 'invoice-routing-control.html');
  await expect(page.getByText('One process, connected records, clear authority.')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('change package control distinguishes completeness from approval', async ({ page }) => {
  await page.goto('/proof/project-coordination-controls/change-package-control.html');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Change Package Completeness Control');
  await expect(page.getByText('PCN-002, concealed corrosion at support seats.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What must be checked before review' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Package evidence and next actions' })).toBeVisible();
  await expect(page.getByText('Not ready, two items need resolution')).toBeVisible();
  await expect(page.getByText('Technical scope')).toBeVisible();
  await expect(page.getByText('Safety and access effects')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download checklist' })).toHaveAttribute('href', 'change-package-checklist.csv');
  await expectNoHorizontalOverflow(page);
});

test('invoice routing control holds incomplete support before approval routing', async ({ page }) => {
  await page.goto('/proof/project-coordination-controls/invoice-routing-control.html');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Invoice Routing Completeness Control');
  await expect(page.getByText('Pay Application 002.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Request-to-commitment check' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What controls the next step' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Certified payroll' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Conditional lien release' })).toBeVisible();
  await expect(page.getByText('Hold, two required records missing')).toBeVisible();
  await expect(page.getByText('$135,375')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download checklist' })).toHaveAttribute('href', 'invoice-routing-checklist.csv');
  await expectNoHorizontalOverflow(page);
});

test('interview walkthrough is permission-based, timed, and restrained', async ({ page }) => {
  await page.goto('/proof/project-coordination-controls/interview-walkthrough.html');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Project Coordination Walkthrough');
  await expect(page.getByRole('heading', { name: 'Permission request' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The three-minute walkthrough' })).toBeVisible();
  await expect(page.getByText('Ask permission, show three controls, stop on time.')).toBeVisible();
  await expect(page.getByText('0:00 to 0:25')).toBeVisible();
  await expect(page.getByText('2:35 to 3:00')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Questions the walkthrough may invite' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What not to do' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Thirty-second version' })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});