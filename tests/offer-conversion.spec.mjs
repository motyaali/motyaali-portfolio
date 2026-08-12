import { test, expect } from '@playwright/test';

const servicePath = '/services.html';
const casePath = '/ai-workflow-enablement/';
const overviewPath = '/ai-workflow-enablement/overview.html';
const discoveryPath = '/ai-workflow-enablement/discovery.html';
const contactPath = '/contact.html';

test('packages the offer into four distinct engagement levels with a controlled-pilot first-sale path', async ({ page }) => {
  await page.goto(servicePath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Practical workflows that reduce routine handling without weakening control.');
  await expect(page.getByRole('heading', { name: 'Enter at the level of commitment the process is ready for.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Workflow Diagnostic' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Controlled Pilot' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Full Implementation & Enablement' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Optimization & Support' })).toBeVisible();
  await expect(page.getByText('Approximately 5 to 20 pilot users')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Prepare a Process Brief' })).toHaveAttribute('href', 'ai-workflow-enablement/discovery.html');
  await expect(page.getByRole('link', { name: 'Open One-Page Overview' })).toHaveAttribute('href', 'ai-workflow-enablement/overview.html');
});

test('gives employers and organizations separate evaluation paths without changing the maturity boundary', async ({ page }) => {
  await page.goto(casePath);
  await expect(page.getByText('Working demonstrations + controlled service framework')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Use the same evidence differently depending on what you need to evaluate.' })).toBeVisible();
  await expect(page.getByText('For hiring managers')).toBeVisible();
  await expect(page.getByText('For organizations')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Four packages move from understanding the problem to operating ownership.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The workflow model now has working proof, not only implementation architecture.' })).toBeVisible();
  await expect(page.getByText('Final pricing, licensing assumptions, service terms, and recurring-support economics')).toBeVisible();
  await expect(page.getByText('Production AI extraction accuracy')).toBeVisible();
});

test('publishes a print-ready one-page overview with proof and non-claim boundaries', async ({ page }) => {
  await page.goto(overviewPath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AI Workflow Enablement');
  await expect(page.getByText('Automate proposals, not decisions.')).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Four engagement packages' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Good pilot fit' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'What the client receives' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Proof you can inspect now' })).toBeVisible();
  await expect(page.getByText('No live client-system integration, production AI accuracy, or measured client savings are claimed.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Print / Save as PDF' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Prepare a Process Brief' })).toHaveAttribute('href', 'discovery.html');
});

test('builds a workflow conversation brief locally without submitting the form to a server', async ({ page }) => {
  await page.goto(discoveryPath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Prepare a workflow discovery brief.');
  await expect(page.getByText('This worksheet runs in your browser. Nothing is transmitted by the page.')).toBeVisible();

  const requestsAfterReady = [];
  page.on('request', request => requestsAfterReady.push(request.url()));

  await page.getByLabel('Recurring process').fill('Weekly document intake and routing');
  await page.getByLabel('What starts it?').fill('Files arrive in a shared mailbox');
  await page.getByLabel('What marks it complete?').fill('Approved record is filed and owner notified');
  await page.getByLabel('Frequency or volume').fill('50 records per week');
  await page.getByLabel('Process owner').fill('Document control lead');
  await page.getByLabel('Systems, inboxes, files, forms, or channels involved').fill('Outlook shared mailbox and SharePoint library');
  await page.getByLabel('Where do delay, rework, duplicate effort, or missing information occur?').fill('Duplicate files and missing project identifiers');
  await page.getByLabel('Which decisions require human judgment or approval?').fill('Uncertain classification and final routing approval');
  await page.getByLabel('Current metrics available').fill('Weekly volume and correction count');
  await page.getByLabel('Potential pilot users').fill('8 coordinators and reviewers');
  await page.getByLabel('What would make a pilot clearly successful or unacceptable?').fill('Safe handling of incomplete records and reduced repeated review');
  await page.getByLabel('Approved workplace platforms or licenses available').fill('Microsoft 365 and SharePoint');

  const beforeSubmitRequestCount = requestsAfterReady.length;
  await page.getByRole('button', { name: 'Build Conversation Brief' }).click();

  const brief = page.locator('#brief-output');
  await expect(brief).toContainText('AI WORKFLOW ENABLEMENT - PROCESS CONVERSATION BRIEF');
  await expect(brief).toContainText('Recurring process: Weekly document intake and routing');
  await expect(brief).toContainText('Human judgment / approvals: Uncertain classification and final routing approval');
  await expect(page.getByText('Brief prepared locally in this browser. Nothing has been sent.')).toBeVisible();
  expect(requestsAfterReady.length).toBe(beforeSubmitRequestCount);

  const emailHref = await page.getByRole('link', { name: 'Email for a Process Conversation' }).getAttribute('href');
  expect(emailHref).toContain('mailto:motyaali@pm.me');
  expect(emailHref).toContain('Workflow%20Discovery%20Conversation');
  expect(emailHref).toContain('Weekly%20document%20intake%20and%20routing');

  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(brief).toHaveText('Complete the worksheet and select “Build Conversation Brief.”');
  await expect(page.getByRole('button', { name: 'Copy Brief' })).toBeDisabled();
  await expect(page.getByRole('link', { name: 'Email for a Process Conversation' })).toHaveAttribute('aria-disabled', 'true');
});

test('routes contact visitors into employer and organization-specific next actions', async ({ page }) => {
  await page.goto(contactPath);
  await expect(page.getByRole('heading', { name: 'Professional opportunities' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Workflow diagnostic or pilot' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'See How I Work' })).toHaveAttribute('href', 'ai-workflow-enablement/');
  await expect(page.getByRole('link', { name: 'Prepare a Process Brief' })).toHaveAttribute('href', 'ai-workflow-enablement/discovery.html');
  await expect(page.getByRole('link', { name: 'Open One-Page Overview' })).toHaveAttribute('href', 'ai-workflow-enablement/overview.html');
});

test('keeps Pass 5 pages within the configured viewport', async ({ page }) => {
  for (const path of [servicePath, casePath, overviewPath, discoveryPath, contactPath]) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth
    }));
    expect(dimensions.documentWidth, `${path} should not overflow horizontally`).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  }
});
