/* Browser-only reconstructions. No network, model calls, credentials, or persistence. */
(() => {
  'use strict';
  const root = document.querySelector('[data-lab]');
  if (!root) return;
  const slug = root.dataset.lab;
  const form = document.querySelector('#lab-form');
  const result = document.querySelector('#lab-result');
  const message = document.querySelector('#lab-message');
  const review = document.querySelector('#lab-review');
  const note = document.querySelector('#review-note');
  const confirm = document.querySelector('#review-confirm');
  const exportButton = document.querySelector('#export-result');
  let current = null;
  const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const text = (value, label) => {
    if (typeof value !== 'string' || !value.trim()) throw Error(`${label} must be a nonempty string.`);
    return value.trim();
  };
  const num = (value, label) => {
    const n = Number(value);
    if (!String(value).trim() || !Number.isFinite(n) || n < 0 || n > 1e9) throw Error(`${label} must be between 0 and 1,000,000,000.`);
    return n;
  };
  const day = (value, label) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw Error(`${label} must use YYYY-MM-DD.`);
    const d = new Date(`${value}T00:00:00Z`);
    if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0,10) !== value) throw Error(`${label} is not a real calendar date.`);
    return d.getTime() / 86400000;
  };
  const iso = d => new Date(d * 86400000).toISOString().slice(0,10);
  const json = (v, label, array = false) => {
    let x;
    try { x = JSON.parse(v); } catch { throw Error(`${label} is not valid JSON. Check commas and quotation marks.`); }
    if (array ? !Array.isArray(x) : !record(x)) throw Error(`${label} must be a JSON ${array ? 'array' : 'object'}.`);
    if (array && (!x.length || x.length > 100)) throw Error(`${label} needs 1 to 100 records.`);
    return x;
  };
  const median = values => {
    const s = [...values].sort((a,b) => a-b), m = Math.floor(s.length/2);
    return s.length % 2 ? s[m] : (s[m-1]+s[m])/2;
  };
  const out = (summary, facts, exceptions = [], proposals = []) => ({ summary, facts, exceptions, proposals });
  const uniqueIds = rows => {
    const ids = rows.map(r => text(r.id, 'Record ID'));
    if (new Set(ids).size !== ids.length) throw Error('Record IDs must be unique.');
  };
  const handlers = {
    'canonical-synthesis'(v) {
      const a = json(v.sourceA,'Source A'), b = json(v.sourceB,'Source B');
      const keys = [...new Set([...Object.keys(a),...Object.keys(b)])].sort();
      if (!keys.length) throw Error('Add at least one source field.');
      const conflicts = keys.filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
      const facts = Object.fromEntries(keys.map(k => [k, `Source A: ${JSON.stringify(a[k]) ?? '[missing]'} | Source B: ${JSON.stringify(b[k]) ?? '[missing]'}`]));
      return out(`${conflicts.length} conflicting field(s); both sources preserved.`, facts,
        conflicts.map(k => `${k}: reviewer decision required; recency alone does not establish authority.`),
        [v.preferred === 'Unresolved' ? 'No reference designated.' : `${v.preferred} proposed by the reviewer. This is a local review record; no source is overwritten.`]);
    },
    'career-evidence-system'(v) {
      const rows = json(v.bank,'Evidence bank',true); uniqueIds(rows);
      const job = text(v.job,'Role description').toLowerCase();
      const matches = [], excluded = [], tags = new Set();
      for (const r of rows) {
        if (!record(r) || !Array.isArray(r.tags) || !r.tags.length) throw Error('Every evidence record needs id, claim, tags, and status.');
        text(r.claim,'Evidence claim');
        if (!['verified','draft'].includes(r.status)) throw Error('Evidence status must be verified or draft.');
        const hits = r.tags.map(t => text(t,'Tag').toLowerCase()).filter(t => {
          const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(job);
        });
        if (r.status !== 'verified') { excluded.push(`${r.id}: draft evidence excluded, even when keywords match.`); continue; }
        if (hits.length) { hits.forEach(t => tags.add(t)); matches.push(`${r.id} [${hits.join(', ')}]: ${r.claim}`); }
      }
      return out(`${matches.length} verified evidence match(es).`, {'Matched tags': [...tags].join(', ') || 'None', 'Source-linked evidence': matches.join('\n\n') || 'No verified evidence matched.'}, excluded,
        ['Review any unmatched role requirements separately. Matching is retrieval, not a qualification score.',...matches.map(x => `Draft talking point grounded in ${x}`)]);
    },
    'inventory-ledger'(v) {
      const po=num(v.po,'Order'), shipped=num(v.shipped,'Shipment'), received=num(v.received,'Receipt'), held=num(v.held,'Hold'), age=num(v.age,'Source age');
      if ([po,shipped,received,held].some(n => !Number.isInteger(n))) throw Error('Inventory quantities must be whole units.');
      if (held>received) throw Error('Quality hold cannot exceed received quantity. Correct the source inputs.');
      const exceptions=[];
      if (shipped>po) exceptions.push(`Buyer: verify ${shipped-po} units shipped above the open order.`);
      if (received>shipped) exceptions.push(`Receiving: investigate ${received-shipped} units received above the shipment.`);
      if (shipped>received) exceptions.push(`Warehouse/logistics: reconcile ${shipped-received} shipped units not yet received.`);
      if (held) exceptions.push(`Quality owner: ${held} units excluded from availability pending disposition.`);
      if (age>24) exceptions.push(`Source owner: ${age}-hour-old record exceeds this demo’s 24-hour freshness threshold.`);
      return out(`${received-held} units available after quality hold.`, {'ERP open order':po,'Supplier shipped':shipped,'Warehouse received':received,'Quality hold':held,'Available = received − held':received-held,'Source age in hours':age},exceptions,['Resolve exceptions with the named source owners. No inventory event is posted.']);
    },
    smartgrocer(v) {
      const asof=day(v.asof,'Review date');
      const dates=[...new Set(v.dates.split(/\s+/).filter(Boolean))].map(x=>day(x,'Purchase date')).sort((a,b)=>a-b);
      if (dates.length<2) throw Error('Enter at least two distinct purchase dates to estimate an interval.');
      if (dates.some(d=>d>asof)) throw Error('Purchase dates cannot be after the review date.');
      const intervals=dates.slice(1).map((d,i)=>d-dates[i]), interval=median(intervals);
      const next=dates.at(-1)+Math.ceil(interval), spread=Math.max(...intervals)-Math.min(...intervals);
      const confidence=intervals.length>=3 && spread<=interval*.25 ? 'Stable observed pattern' : 'Limited or variable history; review';
      return out(`Next proposed purchase: ${iso(next)}.`,{'Product':text(v.product,'Product'),'Distinct observations':dates.length,'Intervals in days':intervals.join(', '),'Median interval in days':interval,'Next date calculation':`${iso(dates.at(-1))} + ${Math.ceil(interval)} days`,'Pattern indicator':confidence,'Timing':next<=asof ? 'Due for review' : 'Upcoming'},[],[v.decision==='Add to sample list' ? `${v.product} added to this sample list by your selection.` : v.decision==='Defer' ? 'Deferred by your selection; no list item added.' : 'Review needed; no shopping-list item added.']);
    },
    'unseen-lifeline'(v) {
      const notice=text(v.notice,'Notice'), verified=day(v.deadline,'Verified deadline');
      const dates=[...new Set(notice.match(/\b\d{4}-\d{2}-\d{2}\b/g)||[])];
      dates.forEach(d=>day(d,'Source date'));
      const items=v.docs.split('\n').map(x=>x.trim()).filter(Boolean);
      if (!items.length) throw Error('Add at least one required item.');
      const exceptions=[];
      if (!dates.length) exceptions.push('No explicit ISO date found. Verify the deadline directly from the source.');
      if (dates.length>1) exceptions.push('Multiple source dates: identify which one governs the response.');
      if (!dates.includes(iso(verified))) exceptions.push('Verified deadline is absent from the source; reconcile before relying on it.');
      return out(exceptions.length ? 'Deadline review has unresolved exceptions.' : 'Source date and reviewer-entered deadline agree.',{'Exact source notice':notice,'Dates explicitly present':dates.join(', ') || 'None','Reviewer-entered deadline':v.deadline,'Response owner':text(v.owner,'Owner')},exceptions,items.map(x=>`Gather and verify: ${x}`).concat('Prepare a response draft; keep submission with the user.'));
    },
    'unseen-os'(v) {
      const asof=day(v.asof,'Review date'), rows=json(v.tasks,'Task register',true); uniqueIds(rows);
      const findings=rows.map(r=>{
        if (!record(r) || !['open','blocked','complete'].includes(r.status)) throw Error('Task status must be open, blocked, or complete.');
        const due=day(r.due,'Task due date'); text(r.task,'Task'); text(r.source,'Task source'); text(r.next,'Next action');
        if (typeof r.evidence!=='string') throw Error('Evidence must be a string, empty when absent.');
        const status=r.status==='complete' ? (r.evidence.trim() ? 'Complete with evidence' : 'Completion unverified') : r.status==='blocked' ? 'Blocked' : due<asof ? 'Overdue' : 'Open';
        return {...r,status,dueNumber:due};
      }).sort((a,b)=>a.dueNumber-b.dueNumber);
      return out(`${findings.filter(r=>r.status!=='Complete with evidence').length} item(s) need attention.`, Object.fromEntries(findings.map(r=>[r.id,`${r.status}: ${r.task}\nSource: ${r.source}\nDue: ${r.due}\nEvidence: ${r.evidence || '[missing]'}`])),findings.filter(r=>['Completion unverified','Blocked','Overdue'].includes(r.status)).map(r=>`${r.id}: ${r.status}`),findings.filter(r=>r.status!=='Complete with evidence').map(r=>`${r.id}: ${r.next}`));
    },
    'documentation-workflow'(v) {
      const issues=[];
      if (text(v.revision,'Submitted revision')!==text(v.approvedRevision,'Controlled revision')) issues.push('Revision mismatch: retrieve the controlled version before routing.');
      if(v.access!=='Yes') issues.push('System-owner access approval is missing.');
      if(v.approval!=='Yes') issues.push('Required review record is missing.');
      const actions={Contributor:'Prepare or correct the submission; cannot approve it.',Reviewer:'Record review findings within assigned authority.', 'Document controller':'Verify metadata and route the authorized review package.'};
      return out(issues.length ? 'Routing on hold.' : 'Ready for the assigned role’s next step.',{'Record':text(v.record,'Record ID'),'Submitted revision':v.revision,'Controlled revision':v.approvedRevision,'Role':v.role,'Role boundary':actions[v.role]},issues,[issues.length ? 'Resolve the prerequisite exceptions, then rerun the check.' : 'Prepare the authorized handoff. No permission or document change is made.']);
    },
    'project-coordination-controls'(v) {
      const amount=num(v.amount,'Invoice amount'), remaining=num(v.remaining,'Commitment');
      if (amount<=0) throw Error('Invoice amount must be greater than zero.');
      const issues=[];
      if(amount>remaining) issues.push(`Invoice exceeds the remaining commitment by $${(amount-remaining).toFixed(2)}.`);
      if(v.approval!=='Yes') issues.push('Authorized approval record missing.');
      if(v.receipt!=='Yes') issues.push('Receipt or progress evidence missing.');
      if(v.duplicate==='Yes') issues.push('Duplicate invoice ID: hold for reconciliation.');
      return out(issues.length ? 'Package on hold.' : 'Package ready for authorized review.',{'Invoice':text(v.invoice,'Invoice ID'),'Invoice amount USD':amount.toFixed(2),'Unbilled commitment USD':remaining.toFixed(2),'Balance if authorized USD':(remaining-amount).toFixed(2)},issues,['Administrative readiness does not authorize payment. Retain all supporting records.']);
    },
    'retail-planning'(v) {
      const stock=num(v.stock,'Stock'), demand=num(v.demand,'Demand'), incoming=num(v.incoming,'Incoming'), lead=num(v.lead,'Lead time'), target=num(v.target,'Target cover');
      if(demand<=0) throw Error('Weekly demand must be greater than zero for a cover calculation.');
      const cover=stock/demand, supply=(stock+incoming)/demand;
      const need=Math.max(0,Math.ceil(demand*(lead+target)-stock-incoming));
      return out(`${need} units proposed for replenishment review.`,{'Stock cover in weeks':cover.toFixed(2),'Cover including incoming in weeks':supply.toFixed(2),'Lead time in weeks':lead,'Calculation':`max(0, ceil(${demand} × (${lead} + ${target}) − ${stock} − ${incoming})) = ${need}`},supply<lead ? ['Supply cover is shorter than lead time; confirm receipt timing and explore an interim action.'] : [],['Review the proposal against seasonality, margin, receipt timing, and supplier constraints before placing an order.']);
    },
    'interview-coach'(v) {
      const experience=text(v.resume,'Experience'), answer=text(v.answer,'Practice answer'); text(v.job,'Role priorities');
      const questions={'Workflow implementation':'Describe a workflow you changed. How did you verify the handoff improved?',Documentation:'How did you turn a complex process into guidance people could follow?', 'Stakeholder training':'How did you adapt training to the people using the process?'};
      const checks=[['Action described',/\b(mapped|wrote|trained|built|tested|created|implemented|reviewed)\b/i.test(answer)],['Evidence mentioned',/\b(evidence|record|checklist|test|feedback|report)\b/i.test(answer)],['Learning or next measure mentioned',/\b(learn|next|measure|improve|change)\w*\b/i.test(answer)]];
      return out('Practice record prepared for self-review.',{'Practice question':questions[v.focus],'Exact experience source':experience,'Role priorities':v.job,'Your answer':answer,'Self-review cues':checks.map(([label,hit])=>`${label}: ${hit ? 'keyword present; verify substance' : 'not detected; inspect manually'}`).join('\n')},['Keyword cues do not score answer quality or establish that statements are true.'],['Compare every statement with the experience excerpt. Add a concrete outcome only when you can substantiate it.']);
    }
  };
  const invalidate = () => {
    current=null; result.replaceChildren(); review.hidden=true; confirm.checked=false; note.value=''; exportButton.disabled=true;
    message.textContent='Inputs changed. Run the scenario again before reviewing or exporting.';
  };
  const section = (title, content) => {
    const box=document.createElement('section'); box.className='lab-output';
    const h=document.createElement('h3'); h.textContent=title; box.append(h);
    if(Array.isArray(content)) {
      const ul=document.createElement('ul');
      for(const item of content.length ? content : ['None detected by the demo rules.']) {const li=document.createElement('li'); li.textContent=String(item); ul.append(li);}
      box.append(ul);
    } else {
      const dl=document.createElement('dl');
      for(const [key,value] of Object.entries(content)) {const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key; dd.textContent=String(value);dl.append(dt,dd);}
      box.append(dl);
    }
    result.append(box);
  };
  form.addEventListener('input',invalidate);
  form.addEventListener('change',invalidate);
  form.addEventListener('reset',()=>{invalidate();message.textContent='Example reset. Run it to inspect the proposed result.';});
  form.addEventListener('submit',e=>{
    e.preventDefault(); invalidate();
    try {
      const inputs=Object.fromEntries(new FormData(form));
      if(Object.values(inputs).some(v=>String(v).length>50000)) throw Error('Keep each input below 50,000 characters for this browser demo.');
      const output=handlers[slug](inputs);
      current={schema_version:1,project:slug,boundary:'Browser-only demonstration; inputs supplied by visitor. No connected system action.',inputs,output};
      message.textContent=output.summary;
      section('Facts and source lineage',output.facts); section('Exceptions and boundaries',output.exceptions); section('Proposed next steps',output.proposals); review.hidden=false;
    }catch(error){message.textContent=`Cannot run: ${error.message}`;}
  });
  const enableExport=()=>{exportButton.disabled=!(current && confirm.checked && note.value.trim());};
  confirm.addEventListener('change',enableExport);note.addEventListener('input',enableExport);
  exportButton.addEventListener('click',()=>{
    if(!current || !confirm.checked || !note.value.trim()) return;
    const report={...current,review:{note:note.value.trim(),confirmed:true,exported_at:new Date().toISOString()}};
    const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));
    const a=document.createElement('a'); a.href=url;a.download=`${slug}-review.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    message.textContent='Reviewed record exported. Unresolved exceptions remain in the export.';
  });
})();
