from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import re, textwrap

ROOT = Path(__file__).resolve().parents[1]
NAV = '<header class="site-header"><div class="header-inner"><a class="brand" href="../index.html" aria-label="Motya Ali home">MOTYA ALI</a><button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button><nav class="site-nav" id="site-nav" aria-label="Primary navigation"><a href="../index.html">Home</a><a href="../work.html" aria-current="page">Work</a><a href="../about.html">About</a><a href="../resume.html">Résumé</a><a href="../services.html">Services</a><a href="../contact.html">Contact</a></nav></div></header>'
FOOTER = '<footer class="site-footer"><div class="footer-inner"><div>© <span id="year"></span> Motya “Ali” Ali.</div><div><a href="../evidence-standard.html">Evidence, privacy, and maturity standard</a></div></div></footer><script src="../assets/site.js"></script></body></html>'

ROLE_PAGES = {
    'project-operations.html': {
        'title': 'Project Operations & Document Control',
        'eyebrow': 'Employer evidence path',
        'lead': 'For project coordination, document control, project administration, construction administration, and workflow-support roles, start here. This path connects lifecycle controls, professional documentation work, and governed exception handling.',
        'proofs': [
            ('Construction Project Coordination Controls','Independent Applied Case Study','A connected project-controls demonstration covering scope, procurement, meetings, changes, invoices, schedules, risks, and closeout readiness.','../projects/project-coordination-controls.html','Inspect project controls →','PC'),
            ('Enterprise Documentation & Workflow Enablement','Professional Body of Work','Role-based guidance, permissions support, metadata coordination, workflow documentation, and user enablement for a public-infrastructure environment.','../projects/documentation-workflow.html','Inspect documentation evidence →','DW'),
            ('AI Workflow Enablement','Working Demonstrations','Meeting coordination and document-intake workflows that prepare routine work, isolate exceptions, and preserve accountable review.','../ai-workflow-enablement/','Run the workflow demonstrations →','AW')],
        'demonstrates': ['Project and document lifecycle coordination','Registers, meetings, changes, invoices, risks, and closeout controls','Role-based documentation and user enablement','Permissions, metadata, routing, and publication support','Exception handling without bypassing approval authority']
    },
    'planning-inventory.html': {
        'title': 'Planning & Inventory Systems',
        'eyebrow': 'Employer evidence path',
        'lead': 'For merchandise planning, inventory planning, allocation, replenishment, forecasting, and inventory-systems roles, this path begins with verified professional scale and follows the decision logic into architecture and working product behavior.',
        'metrics': [('$500M+','Category planning responsibility'),('650+','Stores supported'),('40%','Forecast-accuracy improvement'),('30%','Stockout reduction')],
        'proofs': [
            ('Retail Planning & Analytics at Scale','Professional Body of Work','More than 15 years of forecasting, inventory, allocation, margin, systems implementation, and executive decision support across major retail businesses.','../projects/retail-planning.html','Inspect quantified planning evidence →','PA'),
            ('Inventory Truth Ledger','Documented Architecture','A source-state reconciliation architecture for conflicting inventory signals across planning, ERP, WMS, TMS, purchase-order, receiving, quality, and carrier systems.','../projects/inventory-ledger.html','Inspect the reconciliation architecture →','IT'),
            ('SmartGrocer','Authenticated Full-Stack Prototype','A working household replenishment prototype with explainable forecasting, purchase history, review controls, authenticated data isolation, and automated tests.','../projects/smartgrocer.html','Inspect implemented forecasting behavior →','SG')],
        'demonstrates': ['Forecasting and inventory strategy at scale','Allocation, replenishment, margin, and exception management','Translation of operational signals into decision-ready views','Inventory-state architecture and source lineage','Explainable forecast logic with explicit user control']
    },
    'business-systems.html': {
        'title': 'Business Systems & Implementation',
        'eyebrow': 'Employer evidence path',
        'lead': 'For business systems, implementation, operations systems, UAT, process improvement, and technical project-support roles, this path shows how requirements become controlled workflows, working software, tests, and usable operating guidance.',
        'proofs': [
            ('SmartGrocer','Authenticated Full-Stack Prototype','React, FastAPI, MongoDB, authenticated households, security boundaries, explainable forecasting, API tests, and production-build validation.','../projects/smartgrocer.html','Inspect the implementation →','SG'),
            ('Canonical Source Synthesis','Operational System','A governed information system for source inventory, conflict review, recommendations, human-only canonical approval, and reusable operating packets.','../projects/canonical-synthesis.html','Inspect the governance system →','CS'),
            ('Enterprise Documentation & Workflow Enablement','Professional Body of Work','Professional workflow guidance, permissions support, process documentation, metadata coordination, training, and adoption support.','../projects/documentation-workflow.html','Inspect implementation support evidence →','DW')],
        'demonstrates': ['Requirements translation and information architecture','Authenticated product behavior and data boundaries','Testing, exception handling, and implementation controls','Process documentation, training, and user adoption','Governance that keeps approval and accountability explicit']
    },
    'human-centered-ai.html': {
        'title': 'Human-Centered AI & Workflow Design',
        'eyebrow': 'Employer evidence path',
        'lead': 'For AI workflow, AI operations, responsible-AI, knowledge-system, and accessibility-centered product roles, this path shows applied systems where AI prepares work while evidence, uncertainty, review, and authority remain visible.',
        'proofs': [
            ('AI Workflow Enablement','Working Demonstrations','Distributed inputs become prepared briefs, registers, targeted follow-up, and controlled document routing with review concentrated on exceptions.','../ai-workflow-enablement/','Run the working demonstrations →','AW'),
            ('Unseen Lifeline','Evaluated Capstone & Case Study','An accessibility-centered notice-to-action workflow for verified requirements, evidence needs, deadlines, communications, and sequenced response planning.','../projects/unseen-lifeline.html','Inspect the notice-to-action system →','AL'),
            ('Unseen OS','Working Local Prototype','A local continuity system connecting document memory, deadlines, tasks, people, risks, evidence, and open loops into one operating view.','../projects/unseen-os.html','Inspect the continuity prototype →','UO')],
        'demonstrates': ['Human review and accountable decision authority','Evidence-linked preparation instead of unsupported automation','Accessibility and cognitive-load reduction','Exception-based review and uncertainty handling','Continuity, source memory, and governed operating outputs']
    }
}

PROJECTS = {
    'project-coordination-controls.html': ('project-coordination-controls','Construction Project Coordination Controls','Independent applied case study','Project controls dashboard showing health, schedule, actions, and control records.','controls'),
    'retail-planning.html': ('retail-planning','Retail Planning & Analytics at Scale','Professional body of work','Executive planning view with quantified scale, forecasting, inventory, and decision support.','retail'),
    'documentation-workflow.html': ('documentation-workflow','Enterprise Documentation & Workflow Enablement','Professional body of work','Role-based deliverable workflow with handoffs, permissions, metadata, and publication controls.','docs'),
    'inventory-ledger.html': ('inventory-ledger','Inventory Truth Ledger','Documented architecture','Source-state inventory architecture feeding a reconciled ledger and role-specific decision views.','inventory'),
    'canonical-synthesis.html': ('canonical-synthesis','Canonical Source Synthesis','Operational system','Source inventory and conflict-review system producing human-approved canonical operating packets.','canonical'),
    'smartgrocer.html': ('smartgrocer','SmartGrocer','Authenticated full-stack prototype','Mobile-first replenishment product with explainable forecasts, review controls, and authenticated data boundaries.','smart'),
    'unseen-lifeline.html': ('unseen-lifeline','Unseen Lifeline','Evaluated capstone & case study','Accessibility-centered workflow transforming urgent notices into verified requirements and sequenced action.','lifeline'),
    'unseen-os.html': ('unseen-os','Unseen OS','Working local prototype','Continuity dashboard connecting documents, deadlines, risks, people, evidence, and open loops.','unseen')
}

RELATED = {
    '/projects/project-coordination-controls.html': ('Project operations & document control','../roles/project-operations.html',[
        ('Enterprise Documentation & Workflow Enablement','Role guidance, permissions, metadata, and controlled handoffs.','../projects/documentation-workflow.html'),
        ('AI Workflow Enablement','Exception-based coordination and controlled document intake.','../ai-workflow-enablement/'),
        ('Canonical Source Synthesis','Source governance and human-approved operating references.','../projects/canonical-synthesis.html')]),
    '/projects/documentation-workflow.html': ('Project operations & document control','../roles/project-operations.html',[
        ('Construction Project Coordination Controls','See the project lifecycle controls that documentation supports.','../projects/project-coordination-controls.html'),
        ('AI Workflow Enablement','See document intake and meeting coordination prepared around review gates.','../ai-workflow-enablement/'),
        ('Canonical Source Synthesis','See how conflicting sources become controlled references.','../projects/canonical-synthesis.html')]),
    '/projects/retail-planning.html': ('Planning & inventory systems','../roles/planning-inventory.html',[
        ('Inventory Truth Ledger','See professional inventory judgment translated into source-state architecture.','../projects/inventory-ledger.html'),
        ('SmartGrocer','See replenishment logic implemented in a working full-stack prototype.','../projects/smartgrocer.html'),
        ('Canonical Source Synthesis','See the governance pattern used when source information conflicts.','../projects/canonical-synthesis.html')]),
    '/projects/inventory-ledger.html': ('Planning & inventory systems','../roles/planning-inventory.html',[
        ('Retail Planning & Analytics at Scale','See the professional planning experience behind the architecture.','../projects/retail-planning.html'),
        ('SmartGrocer','See explainable replenishment logic implemented in software.','../projects/smartgrocer.html'),
        ('Canonical Source Synthesis','See a parallel approach to reconciling conflicting information.','../projects/canonical-synthesis.html')]),
    '/projects/smartgrocer.html': ('Business systems & implementation','../roles/business-systems.html',[
        ('Inventory Truth Ledger','See the enterprise inventory architecture related to product-state reasoning.','../projects/inventory-ledger.html'),
        ('Canonical Source Synthesis','See the governance system for conflicting and duplicate sources.','../projects/canonical-synthesis.html'),
        ('Retail Planning & Analytics at Scale','See the professional forecasting and inventory background behind the product logic.','../projects/retail-planning.html')]),
    '/projects/canonical-synthesis.html': ('Business systems & implementation','../roles/business-systems.html',[
        ('AI Workflow Enablement','See governed preparation and exception review applied to recurring work.','../ai-workflow-enablement/'),
        ('Enterprise Documentation & Workflow Enablement','See professional documentation and controlled handoffs.','../projects/documentation-workflow.html'),
        ('Inventory Truth Ledger','See source reconciliation applied to enterprise inventory states.','../projects/inventory-ledger.html')]),
    '/projects/unseen-lifeline.html': ('Human-centered AI & workflow design','../roles/human-centered-ai.html',[
        ('Unseen OS','See how notice response becomes part of a broader continuity system.','../projects/unseen-os.html'),
        ('AI Workflow Enablement','See the same human-review philosophy applied to organizational workflows.','../ai-workflow-enablement/'),
        ('Canonical Source Synthesis','See the source-governance method for conflicting evidence.','../projects/canonical-synthesis.html')]),
    '/projects/unseen-os.html': ('Human-centered AI & workflow design','../roles/human-centered-ai.html',[
        ('Unseen Lifeline','See the focused notice-to-action workflow inside the continuity problem.','../projects/unseen-lifeline.html'),
        ('Canonical Source Synthesis','See the governance method for fragmented and conflicting records.','../projects/canonical-synthesis.html'),
        ('AI Workflow Enablement','See exception-centered preparation applied to organizational operations.','../ai-workflow-enablement/')]),
    '/ai-workflow-enablement/': ('Human-centered AI & workflow design','../roles/human-centered-ai.html',[
        ('Canonical Source Synthesis','See the information-governance system behind evidence-backed preparation.','../projects/canonical-synthesis.html'),
        ('Enterprise Documentation & Workflow Enablement','See professional workflow and user-enablement evidence.','../projects/documentation-workflow.html'),
        ('Unseen Lifeline','See human-review and accessibility principles applied to high-stakes notices.','../projects/unseen-lifeline.html')])
}

def role_page(data):
    metrics = ''
    if data.get('metrics'):
        metrics = '<section class="role-metric-strip"><div class="container role-metrics">' + ''.join(f'<article><strong>{a}</strong><span>{b}</span></article>' for a,b in data['metrics']) + '</div></section>'
    cards = ''.join(f'''<article class="project-card project-card-featured"><div class="project-cover"><div class="project-symbol">{sym}</div></div><div class="project-body"><span class="badge">{badge}</span><h3>{title}</h3><p>{desc}</p><a class="project-link" href="{href}">{cta}</a></div></article>''' for title,badge,desc,href,cta,sym in data['proofs'])
    bullets = ''.join(f'<li>{x}</li>' for x in data['demonstrates'])
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Role-specific evidence journey for {data['title']} roles from Motya Ali's portfolio."><meta name="theme-color" content="#17324d"><title>{data['title']} Evidence | Motya Ali</title><link rel="stylesheet" href="../assets/styles.css"><link rel="stylesheet" href="../assets/proof.css"><link rel="stylesheet" href="../assets/portfolio-refresh.css"><link rel="stylesheet" href="../assets/recruiter-conversion.css"></head><body><a class="skip-link" href="#main">Skip to content</a>{NAV}<main id="main"><section class="page-hero role-hero"><div class="container"><p class="eyebrow">{data['eyebrow']}</p><h1>{data['title']}</h1><p>{data['lead']}</p><div class="actions"><a class="button button-primary" href="#evidence">Open the evidence path</a><a class="button button-secondary" href="../assets/Motya-Ali-Resume.pdf" download>Download résumé PDF</a></div></div></section>{metrics}<section class="section" id="evidence"><div class="container"><div class="section-heading"><div><p class="eyebrow">Recommended review order</p><h2>Three pieces of evidence, one hiring question.</h2></div><p>Start with the first project for the clearest role match, then use the next two to inspect adjacent systems thinking and implementation depth.</p></div><div class="project-grid role-proof-grid">{cards}</div></div></section><section class="section section-alt"><div class="container two-column"><article class="prose"><p class="eyebrow">What this path demonstrates</p><h2>What I would want a hiring team to verify.</h2><ul>{bullets}</ul></article><aside class="info-panel"><h2>Continue the review</h2><p>The résumé provides career chronology and quantified scope. The project pages provide deeper evidence, boundaries, and inspectable artifacts.</p><div class="actions"><a class="button button-primary" href="../resume.html">View résumé</a><a class="button button-secondary" href="../contact.html?subject={data['title'].replace(' ','%20')}">Discuss this fit</a></div></aside></div></section></main>{FOOTER}'''

def write_role_pages():
    d = ROOT/'roles'; d.mkdir(exist_ok=True)
    for name,data in ROLE_PAGES.items(): (d/name).write_text(role_page(data),encoding='utf-8')

def write_css():
    css = '''.role-hero h1{max-width:980px}.role-metric-strip{background:#0f2336;color:#fff}.role-metrics{display:grid;grid-template-columns:repeat(4,1fr)}.role-metrics article{padding:1.35rem 1.1rem;border-right:1px solid rgba(255,255,255,.14)}.role-metrics article:last-child{border-right:0}.role-metrics strong{display:block;font-size:1.8rem;line-height:1;color:#fff}.role-metrics span{display:block;margin-top:.4rem;color:#d9e4ea;font-size:.86rem}.role-proof-grid .project-card{min-height:440px}.related-evidence-section{border-top:1px solid var(--line);background:#f7f9fa}.related-evidence-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.related-evidence-card{display:flex;flex-direction:column;padding:1.25rem;border:1px solid var(--line);border-radius:1rem;background:#fff;text-decoration:none;transition:transform .15s ease,border-color .15s ease,box-shadow .15s ease}.related-evidence-card:hover,.related-evidence-card:focus-visible{transform:translateY(-3px);border-color:var(--teal);box-shadow:0 12px 28px rgba(23,50,77,.08);outline:none}.related-evidence-card .related-label{color:var(--teal);font-size:.72rem;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.related-evidence-card h3{margin:.5rem 0 .45rem;font-size:1.08rem}.related-evidence-card p{margin:0;color:var(--muted);font-size:.92rem}.related-role-link{display:inline-flex;margin-top:1.3rem;color:var(--teal);font-weight:850;text-decoration:none}.related-role-link:hover,.related-role-link:focus-visible{text-decoration:underline;outline:none}@media(max-width:850px){.role-metrics,.related-evidence-grid{grid-template-columns:1fr 1fr}.role-metrics article:nth-child(2n){border-right:0}}@media(max-width:560px){.role-metrics,.related-evidence-grid{grid-template-columns:1fr}.role-metrics article{border-right:0;border-bottom:1px solid rgba(255,255,255,.14)}}'''
    (ROOT/'assets/recruiter-conversion.css').write_text(css,encoding='utf-8')

def write_related_js():
    # Serialize as JS literals manually for predictable static output.
    entries=[]
    for path,(role,roleHref,cards) in RELATED.items():
        cards_js=','.join("{title:%r,desc:%r,href:%r}"%(a,b,c) for a,b,c in cards)
        entries.append("%r:{role:%r,roleHref:%r,cards:[%s]}"%(path,role,roleHref,cards_js))
    js = """(() => {\n  const related = {%s};\n  const path = window.location.pathname.endsWith('/ai-workflow-enablement/index.html') ? '/ai-workflow-enablement/' : window.location.pathname;\n  const config = related[path];\n  if (!config || !document.querySelector('main') || document.querySelector('.related-evidence-section')) return;\n  if (!document.querySelector('link[data-recruiter-conversion]')) { const l=document.createElement('link'); l.rel='stylesheet'; l.href='../assets/recruiter-conversion.css'; l.dataset.recruiterConversion='true'; document.head.appendChild(l); }\n  const section=document.createElement('section'); section.className='section related-evidence-section'; section.setAttribute('aria-labelledby','related-evidence-heading');\n  section.innerHTML=`<div class=\"container\"><div class=\"section-heading\"><div><p class=\"eyebrow\">Related evidence</p><h2 id=\"related-evidence-heading\">Continue the evidence trail.</h2></div><p>These projects show adjacent capabilities that strengthen the same hiring case.</p></div><div class=\"related-evidence-grid\">${config.cards.map(c=>`<a class=\"related-evidence-card\" href=\"${c.href}\"><span class=\"related-label\">Related project</span><h3>${c.title}</h3><p>${c.desc}</p></a>`).join('')}</div><a class=\"related-role-link\" href=\"${config.roleHref}\">View the ${config.role} recruiter path →</a></div>`;\n  document.querySelector('main').appendChild(section);\n})();\n""" % ','.join(entries)
    (ROOT/'assets/related-evidence.js').write_text(js,encoding='utf-8')

def update_work():
    p=ROOT/'work.html'; t=p.read_text(encoding='utf-8')
    reps={
      '<a href="projects/project-coordination-controls.html">Open project evidence →</a>':'<a href="roles/project-operations.html">Open curated role evidence →</a>',
      '<a href="projects/retail-planning.html">Open planning evidence →</a>':'<a href="roles/planning-inventory.html">Open curated role evidence →</a>',
      '<a href="projects/smartgrocer.html">Open implementation evidence →</a>':'<a href="roles/business-systems.html">Open curated role evidence →</a>',
      '<a href="ai-workflow-enablement/">Open AI workflow evidence →</a>':'<a href="roles/human-centered-ai.html">Open curated role evidence →</a>'}
    for a,b in reps.items():
        if a not in t: raise RuntimeError(f'Expected work.html snippet missing: {a}')
        t=t.replace(a,b,1)
    p.write_text(t,encoding='utf-8')

def add_meta_and_related_scripts():
    social_dir=ROOT/'assets/social'; social_dir.mkdir(parents=True,exist_ok=True)
    for filename,(slug,title,maturity,alt,ptype) in PROJECTS.items():
        p=ROOT/'projects'/filename; t=p.read_text(encoding='utf-8')
        img=f'https://www.motyaali.com/assets/social/{slug}-linkedin.png'
        if 'property="og:image"' not in t:
            marker=re.search(r'(<meta property="og:url"[^>]+>\n)',t)
            if not marker: raise RuntimeError(f'og:url marker missing in {filename}')
            block=(f'  <meta property="og:image" content="{img}">\n  <meta property="og:image:secure_url" content="{img}">\n  <meta property="og:image:type" content="image/png">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="{alt}">\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:image" content="{img}">\n')
            t=t[:marker.end()]+block+t[marker.end():]
        script='<script src="../assets/related-evidence.js"></script>'
        if script not in t:
            t=t.replace('<script src="../assets/site.js"></script>', '<script src="../assets/site.js"></script>\n'+script,1)
        p.write_text(t,encoding='utf-8')
    # AI page already has a social card; add related evidence script only.
    p=ROOT/'ai-workflow-enablement/index.html'; t=p.read_text(encoding='utf-8'); script='<script src="../assets/related-evidence.js"></script>'
    if script not in t: t=t.replace('<script src="../assets/site.js"></script>', '<script src="../assets/site.js"></script>\n'+script,1)
    p.write_text(t,encoding='utf-8')

def font(size,bold=False):
    paths=['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']
    for p in paths:
        if Path(p).exists(): return ImageFont.truetype(p,size)
    return ImageFont.load_default()

def fit_lines(draw,text,max_width,max_lines=3):
    words=text.split(); lines=[]; cur=''
    for w in words:
        trial=(cur+' '+w).strip()
        if draw.textbbox((0,0),trial,font=font(47,True))[2] <= max_width: cur=trial
        else:
            if cur: lines.append(cur)
            cur=w
    if cur: lines.append(cur)
    return lines[:max_lines]

def rr(draw,box,r,fill,outline=None,width=1): draw.rounded_rectangle(box,radius=r,fill=fill,outline=outline,width=width)

def preview(draw,kind,box):
    x0,y0,x1,y1=box; w=x1-x0; h=y1-y0
    rr(draw,box,28,'white','#d9e2e7',2)
    draw.rectangle((x0,y0,x1,y0+46),fill='#f6f9fa'); draw.line((x0,y0+46,x1,y0+46),fill='#dfe5e9',width=2)
    draw.text((x0+22,y0+13),'EVIDENCE PREVIEW',font=font(16,True),fill='#1f6f78')
    if kind in ('controls','retail'):
        for i,v in enumerate([.72,.48,.83,.61]):
            bx=x0+22+i*92; rr(draw,(bx,y0+68,bx+78,y0+125),10,'#f8fafb','#e1e7ea'); draw.text((bx+10,y0+78),['SCHED','RISK','COST','FLOW'][i],font=font(11,True),fill='#667581'); draw.rectangle((bx+10,y0+104,bx+10+int(54*v),y0+111),fill='#1f6f78')
        pts=[]
        for i,v in enumerate([.58,.42,.51,.30,.39,.23,.31,.17]): pts.append((x0+30+i*52,y0+250-int(v*145)))
        draw.line(pts,fill='#1f6f78',width=5,joint='curve')
        for r in range(3):
            y=y0+292+r*35; draw.line((x0+22,y,x1-22,y),fill='#e4eaed',width=2); draw.text((x0+28,y+8),['Open actions','Decision view','Next review'][r],font=font(13,False),fill='#4d5a65')
    elif kind in ('docs','lifeline'):
        stages=5
        for i in range(stages):
            bx=x0+24+i*74; rr(draw,(bx,y0+70,bx+58,y0+112),9,'#17324d'); draw.text((bx+22,y0+81),str(i+1),font=font(15,True),fill='white')
            if i<stages-1: draw.line((bx+58,y0+91,bx+74,y0+91),fill='#1f6f78',width=4)
        for r,label in enumerate(['Contributor','Reviewer','Approver','Control']):
            y=y0+145+r*49; draw.text((x0+24,y+10),label,font=font(12,True),fill='#17324d')
            for c in range(5): rr(draw,(x0+115+c*57,y,x0+163+c*57,y+34),6,'#dceeef' if (r+c)%3==0 else '#f8fafb','#dfe5e9')
    elif kind in ('inventory','canonical'):
        for i,label in enumerate(['ERP','WMS','TMS','ASN']): rr(draw,(x0+22,y0+70+i*55,x0+105,y0+108+i*55),8,'#f8fafb','#dfe5e9'); draw.text((x0+45,y0+82+i*55),label,font=font(13,True),fill='#17324d')
        draw.line((x0+112,y0+178,x0+155,y0+178),fill='#1f6f78',width=5)
        rr(draw,(x0+165,y0+112,x0+292,y0+245),16,'#dceeef','#9fc8cc',2); draw.text((x0+187,y0+137),'CONTROLLED',font=font(13,True),fill='#1f6f78'); draw.text((x0+188,y0+168),'TRUTH',font=font(25,True),fill='#17324d'); draw.text((x0+188,y0+203),'lineage + review',font=font(11),fill='#5f6b76')
        draw.line((x0+302,y0+178,x0+345,y0+178),fill='#1f6f78',width=5)
        for i,label in enumerate(['PLAN','OPS','FIN','LEAD']): rr(draw,(x0+355,y0+70+i*55,x1-22,y0+108+i*55),8,'#f1f7f5','#dfe5e9'); draw.text((x0+372,y0+82+i*55),label,font=font(12,True),fill='#2d6653')
    elif kind=='smart':
        rr(draw,(x0+24,y0+64,x0+174,y1-24),24,'#17324d'); rr(draw,(x0+33,y0+76,x0+165,y1-36),18,'white'); draw.text((x0+50,y0+96),'MY LIST',font=font(15,True),fill='#17324d')
        for i,item in enumerate(['Milk','Eggs','Bananas','Bread']):
            yy=y0+138+i*42; draw.text((x0+48,yy),item,font=font(13),fill='#4d5a65'); draw.line((x0+48,yy+25,x0+151,yy+25),fill='#e4eaed')
        rr(draw,(x0+205,y0+75,x1-24,y0+178),14,'#f8fafb','#dfe5e9'); draw.text((x0+225,y0+94),'FORECASTED RESTOCK',font=font(12,True),fill='#1f6f78')
        for i,(a,b) in enumerate([('Milk','2 days'),('Eggs','4 days'),('Chicken','1 day')]): draw.text((x0+225,y0+126+i*28),a,font=font(13),fill='#17324d'); draw.text((x1-115,y0+126+i*28),b,font=font(12,True),fill='#2d6653')
        rr(draw,(x0+205,y0+198,x1-24,y1-24),14,'#e9f4f4','#b8d7da'); draw.text((x0+225,y0+222),'APPROVE · DEFER · EDIT',font=font(12,True),fill='#174f56')
    elif kind=='unseen':
        draw.rectangle((x0+20,y0+60,x0+118,y1-22),fill='#17324d');
        for i,label in enumerate(['Continuity','Notices','Documents','People','Open Loops']): draw.text((x0+34,y0+84+i*43),label,font=font(11,True if i==0 else False),fill='white' if i==0 else '#cbd8df')
        draw.text((x0+148,y0+77),'4 items need attention',font=font(20,True),fill='#17324d')
        for i,(title,status) in enumerate([('Benefits recertification','HIGH'),('Housing follow-up','FOLLOW UP'),('Education support','READY'),('Record request','TRACKED')]):
            yy=y0+120+i*58; rr(draw,(x0+145,yy,x1-24,yy+45),8,'#f8fafb','#e1e7ea'); draw.text((x0+160,yy+8),title,font=font(12,True),fill='#17324d'); draw.text((x1-112,yy+13),status,font=font(10,True),fill='#1f6f78')

def generate_cards():
    specs=list(PROJECTS.values())+[('ai-workflow-enablement','AI Workflow Enablement','Working demonstrations','Distributed inputs become prepared outputs with human review focused on exceptions.','canonical')]
    out=ROOT/'assets/social'; out.mkdir(parents=True,exist_ok=True)
    for slug,title,maturity,alt,kind in specs:
        im=Image.new('RGB',(1200,630),'#f3f5f7'); d=ImageDraw.Draw(im)
        d.rectangle((0,0,1200,18),fill='#1f6f78'); d.text((66,53),'MOTYA ALI',font=font(20,True),fill='#17324d'); d.text((66,84),'PORTFOLIO EVIDENCE',font=font(14,True),fill='#1f6f78')
        lines=fit_lines(d,title,590,3); y=145
        for line in lines: d.text((66,y),line,font=font(47,True),fill='#0f2336'); y+=57
        d.text((66,y+13),maturity.upper(),font=font(15,True),fill='#1f6f78')
        wrapped=textwrap.wrap(alt,width=53)[:3]; yy=y+58
        for line in wrapped: d.text((66,yy),line,font=font(20),fill='#52616c'); yy+=30
        d.text((66,568),'motyaali.com',font=font(18,True),fill='#17324d')
        preview(d,kind,(710,70,1145,560))
        im.save(out/f'{slug}-linkedin.png',optimize=True)

def update_sitemap():
    p=ROOT/'sitemap.xml'; t=p.read_text(encoding='utf-8')
    urls=['project-operations','planning-inventory','business-systems','human-centered-ai']
    if 'https://www.motyaali.com/roles/project-operations.html' not in t:
        insertion=''.join(f'  <url><loc>https://www.motyaali.com/roles/{u}.html</loc><priority>0.8</priority></url>\n' for u in urls)
        t=t.replace('</urlset>',insertion+'</urlset>')
    p.write_text(t,encoding='utf-8')

def main():
    write_role_pages(); write_css(); write_related_js(); update_work(); add_meta_and_related_scripts(); generate_cards(); update_sitemap()
    print('Pass 1 recruiter conversion build complete.')
if __name__=='__main__': main()
