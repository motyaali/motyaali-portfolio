from pathlib import Path
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[1]
for p in (ROOT/'roles').glob('*.html'):
    t=p.read_text(encoding='utf-8')
    import re
    m=re.search(r'<h1>([^<]+)</h1>',t)
    if not m: continue
    title=m.group(1)
    t=re.sub(r'href="\.\./contact\.html\?subject=[^"]+"', f'href="../contact.html?subject={quote(title, safe="")}"', t)
    if 'rel="canonical"' not in t:
        slug=p.name
        marker='<meta name="theme-color" content="#17324d">'
        meta=(marker+f'<link rel="canonical" href="https://www.motyaali.com/roles/{slug}"><meta property="og:type" content="website"><meta property="og:title" content="{title} Evidence | Motya Ali"><meta property="og:description" content="A curated recruiter path connecting the strongest portfolio evidence for {title} roles."><meta property="og:url" content="https://www.motyaali.com/roles/{slug}"><meta property="og:image" content="https://www.motyaali.com/assets/social/motya-ali-portfolio-linkedin.png"><meta name="twitter:card" content="summary_large_image">')
        t=t.replace(marker,meta,1)
    p.write_text(t,encoding='utf-8')
print('Role links and metadata updated.')
