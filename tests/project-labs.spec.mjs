import { test, expect } from '@playwright/test';
import inventory from '../evidence/governance/demo-inventory.json' with { type: 'json' };

for (const demo of inventory) {
  test(`${demo.project}: run, review, export, and invalidate a changed scenario`, async ({ page }) => {
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/'+demo.demo);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#lab-review')).toBeHidden();
    await page.getByRole('button',{name:'Run scenario',exact:true}).click();
    await expect(page.locator('#lab-result .lab-output')).toHaveCount(3);
    await expect(page.locator('#lab-message')).not.toContainText('Cannot run');
    const button=page.getByRole('button',{name:'Export reviewed JSON'});
    await expect(button).toBeDisabled();
    await page.locator('#review-confirm').check();
    await expect(button).toBeDisabled();
    await page.locator('#review-note').fill('Reviewed the example and retained unresolved exceptions.');
    await expect(button).toBeEnabled();
    const downloadPromise=page.waitForEvent('download'); await button.click();
    const download=await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/-review\.json$/);
    const stream=await download.createReadStream();const chunks=[];
    for await(const chunk of stream)chunks.push(chunk);
    const report=JSON.parse(Buffer.concat(chunks).toString());
    expect(report.review.confirmed).toBe(true);
    expect(report.output.facts).toBeTruthy();expect(report.inputs).toBeTruthy();
    // A changed input must make the old reviewed output unavailable.
    const field=page.locator('#lab-form input, #lab-form textarea').first();
    const type=await field.getAttribute('type');
    await field.fill(type==='number' ? '1' : type==='date' ? '2026-10-15' : 'Changed source');
    await expect(page.locator('#lab-review')).toBeHidden();
    await expect(page.locator('#lab-result')).toBeEmpty();
    await page.getByRole('button',{name:'Reset example'}).click();
    await page.getByRole('button',{name:'Run scenario',exact:true}).click();
    await expect(page.locator('#lab-result .lab-output')).toHaveCount(3);
    const sizes=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);
    expect(sizes[0]).toBeLessThanOrEqual(sizes[1]+1);
    expect(errors).toEqual([]);
  });
}

test('inventory preserves holds, lineage and overshipment exceptions; invalid quantities fail closed',async({page})=>{
 await page.goto('/demos/inventory-ledger.html');
 await page.locator('#held').fill('500');await page.getByRole('button',{name:'Run scenario',exact:true}).click();
 await expect(page.locator('#lab-message')).toContainText('1500 units available');
 await expect(page.locator('#lab-result')).toContainText('240 units shipped above');
 await expect(page.locator('#lab-result')).toContainText('Warehouse received');
 await page.locator('#held').fill('2001');await page.getByRole('button',{name:'Run scenario',exact:true}).click();
 await expect(page.locator('#lab-message')).toContainText('cannot exceed received');await expect(page.locator('#lab-review')).toBeHidden();
});
test('forecast uses observed median intervals and rejects impossible dates',async({page})=>{
 await page.goto('/demos/smartgrocer.html');
 await page.locator('#dates').fill('2026-09-16\n2026-09-23\n2026-09-30\n2026-10-07\n2026-10-14');
 await page.getByRole('button',{name:'Run scenario',exact:true}).click();await expect(page.locator('#lab-message')).toContainText('2026-10-21');
 await expect(page.locator('#lab-result')).toContainText('no shopping-list item added');
 await page.locator('#dates').fill('2026-02-30\n2026-03-07');await page.getByRole('button',{name:'Run scenario',exact:true}).click();
 await expect(page.locator('#lab-message')).toContainText('not a real calendar date');
});
test('completion needs evidence and source lineage',async({page})=>{
 await page.goto('/demos/unseen-os.html');await page.getByRole('button',{name:'Run scenario',exact:true}).click();
 await expect(page.locator('#lab-result')).toContainText('Completion unverified');
 const rows=JSON.parse(await page.locator('#tasks').inputValue());rows[2].evidence='Receipt C-08';
 await page.locator('#tasks').fill(JSON.stringify(rows));await page.getByRole('button',{name:'Run scenario',exact:true}).click();
 await expect(page.locator('#lab-result')).toContainText('Complete with evidence');
 await expect(page.locator('#lab-result')).not.toContainText('Completion unverified');
 rows[1].id=rows[0].id;await page.locator('#tasks').fill(JSON.stringify(rows));await page.getByRole('button',{name:'Run scenario',exact:true}).click();
 await expect(page.locator('#lab-message')).toContainText('IDs must be unique');
});
test('career retrieval excludes draft evidence and encodes user-supplied markup',async({page})=>{
 await page.goto('/demos/career-evidence-system.html');
 const rows=JSON.parse(await page.locator('#bank').inputValue());rows[0].claim='<img src=x onerror="window.injected=true">';
 await page.locator('#bank').fill(JSON.stringify(rows));await page.getByRole('button',{name:'Run scenario',exact:true}).click();
 await expect(page.locator('#lab-result')).toContainText('draft evidence excluded');
 await expect(page.locator('#lab-result')).toContainText('<img');await expect(page.locator('#lab-result img')).toHaveCount(0);
 expect(await page.evaluate(()=>window.injected)).toBeUndefined();
 await page.locator('#bank').fill('{bad json');await page.getByRole('button',{name:'Run scenario',exact:true}).click();
 await expect(page.locator('#lab-message')).toContainText('not valid JSON');
});
test('routing and financial gates clear only after prerequisite records are supplied',async({page})=>{
 await page.goto('/demos/documentation-workflow.html');await page.getByRole('button',{name:'Run scenario',exact:true}).click();await expect(page.locator('#lab-message')).toContainText('hold');
 await page.locator('#revision').fill('C');await page.locator('#access').selectOption('Yes');await page.locator('#approval').selectOption('Yes');
 await page.getByRole('button',{name:'Run scenario',exact:true}).click();await expect(page.locator('#lab-message')).toContainText('Ready');
 await page.goto('/demos/project-coordination-controls.html');await page.locator('#remaining').fill('15000');await page.locator('#approval').selectOption('Yes');await page.locator('#receipt').selectOption('Yes');
 await page.getByRole('button',{name:'Run scenario',exact:true}).click();await expect(page.locator('#lab-message')).toContainText('ready');
 await page.locator('#duplicate').selectOption('Yes');await page.getByRole('button',{name:'Run scenario',exact:true}).click();await expect(page.locator('#lab-message')).toContainText('hold');
});
test('planning and deadline changes recalculate without silently resolving conflicts',async({page})=>{
 await page.goto('/demos/retail-planning.html');await page.getByRole('button',{name:'Run scenario',exact:true}).click();await expect(page.locator('#lab-message')).toContainText('900 units');
 await page.locator('#demand').fill('400');await page.getByRole('button',{name:'Run scenario',exact:true}).click();await expect(page.locator('#lab-message')).toContainText('2700 units');
 await page.goto('/demos/unseen-lifeline.html');await page.locator('#deadline').fill('2026-10-22');await page.getByRole('button',{name:'Run scenario',exact:true}).click();await expect(page.locator('#lab-result')).toContainText('absent from the source');
});
test('canonical comparison retains source disagreements; index links every public prototype without JavaScript',async({browser,page})=>{
 await page.goto('/demos/canonical-synthesis.html');await page.getByRole('button',{name:'Run scenario',exact:true}).click();await expect(page.locator('#lab-message')).toContainText('2 conflicting');
 await page.locator('#sourceB').fill('{"owner":"Operations","review_days":30,"effective":"2026-10-01"}');await page.getByRole('button',{name:'Run scenario',exact:true}).click();await expect(page.locator('#lab-message')).toContainText('1 conflicting');
 const context=await browser.newContext({javaScriptEnabled:false});const index=await context.newPage();await index.goto('http://127.0.0.1:8000/evidence.html');
 for(const demo of inventory){await expect(index.locator(`a[href="${demo.demo}"]`)).toBeVisible();const r=await index.request.get('http://127.0.0.1:8000/'+demo.demo);expect(r.ok()).toBe(true);}
 await context.close();
});
