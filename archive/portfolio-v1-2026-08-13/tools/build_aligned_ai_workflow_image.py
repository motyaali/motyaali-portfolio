from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'social' / 'ai-workflow-enablement-linkedin.png'
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630
NAVY = '#0f2336'
NAVY2 = '#17324d'
TEAL = '#1f6f78'
TEAL_LIGHT = '#dceeef'
LINE = '#dfe5e9'
MUTED = '#5f6b76'
SURFACE = '#f3f5f7'
WHITE = '#ffffff'

REG = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def f(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REG, size)

def rounded(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def center_text(draw, box, text, font, fill):
    x1,y1,x2,y2 = box
    bb = draw.multiline_textbbox((0,0), text, font=font, spacing=4, align='center')
    tw, th = bb[2]-bb[0], bb[3]-bb[1]
    draw.multiline_text(((x1+x2-tw)/2, (y1+y2-th)/2), text, font=font, fill=fill, spacing=4, align='center')

im = Image.new('RGB', (W,H), WHITE)
d = ImageDraw.Draw(im)

for i in range(10):
    d.arc((900+i*10, -140+i*5, 1320+i*10, 280+i*5), 200, 345, fill=(223,231,235), width=1)
for i in range(10):
    d.arc((-200-i*5, 470-i*2, 420-i*5, 920-i*2), 200, 340, fill=(223,231,235), width=1)

x0 = 56
d.text((x0, 55), 'MOTYA ALI', font=f(24, True), fill=NAVY)
d.line((x0, 92, x0+44, 92), fill=TEAL, width=3)
d.text((x0, 132), 'AI Workflow', font=f(50, True), fill=NAVY)
d.text((x0, 190), 'Enablement', font=f(50, True), fill=NAVY)
d.multiline_text((x0, 268), 'Governed AI workflows\nfor real operations', font=f(20, True), fill=TEAL, spacing=5)
d.text((x0, 342), 'Automate proposals, not decisions.', font=f(21), fill=NAVY2)
d.multiline_text((x0, 395), 'Testing, documentation, training,\nand staff-ready handoff.', font=f(18), fill=MUTED, spacing=8)

panel = (505, 94, 1150, 535)
rounded(d, panel, 28, '#fbfcfd', LINE, 2)

steps = [
    ('1','Controlled\nInput','doc'),
    ('2','AI\nProposal','ai'),
    ('3','Human\nReview','person'),
    ('4','Approved\nAction','check'),
    ('5','Audit &\nImprove','chart'),
]
card_w, card_h, gap = 108, 236, 18
start_x, top = 526, 137
for idx,(num,label,icon) in enumerate(steps):
    x = start_x + idx*(card_w+gap)
    rounded(d,(x,top,x+card_w,top+card_h),22,WHITE,LINE,2)
    d.ellipse((x+40, top-15, x+68, top+13), fill=TEAL)
    center_text(d,(x+40, top-15, x+68, top+13),num,f(14,True),WHITE)
    cx, cy = x+card_w//2, top+73
    d.ellipse((cx-28,cy-28,cx+28,cy+28),fill=SURFACE)
    if icon == 'doc':
        d.rectangle((cx-14,cy-18,cx+12,cy+18),outline=NAVY2,width=2)
        d.line((cx-8,cy-7,cx+6,cy-7),fill=TEAL,width=2)
        d.line((cx-8,cy,cx+6,cy),fill=TEAL,width=2)
        d.ellipse((cx+3,cy+5,cx+17,cy+19),outline=TEAL,width=2)
        d.line((cx+6,cy+12,cx+10,cy+16),fill=TEAL,width=2)
        d.line((cx+10,cy+16,cx+15,cy+9),fill=TEAL,width=2)
    elif icon == 'ai':
        d.ellipse((cx-18,cy-15,cx+18,cy+15),outline=NAVY2,width=2)
        for ox,oy in [(-12,-8),(0,-10),(12,-5),(-10,7),(4,6),(14,8)]:
            d.ellipse((cx+ox-2,cy+oy-2,cx+ox+2,cy+oy+2),fill=TEAL)
        d.line((cx-12,cy-8,cx,cy-10,cx+12,cy-5),fill=TEAL,width=2)
        d.line((cx-10,cy+7,cx+4,cy+6,cx+14,cy+8),fill=TEAL,width=2)
    elif icon == 'person':
        d.ellipse((cx-9,cy-18,cx+9,cy),outline=NAVY2,width=2)
        d.arc((cx-18,cy-3,cx+18,cy+25),180,360,fill=NAVY2,width=2)
        rounded(d,(cx+8,cy-14,cx+25,cy+2),4,TEAL_LIGHT,TEAL,1)
    elif icon == 'check':
        d.ellipse((cx-20,cy-20,cx+20,cy+20),outline=NAVY2,width=2)
        d.line((cx-11,cy,cx-3,cy+8),fill=TEAL,width=3)
        d.line((cx-3,cy+8,cx+12,cy-10),fill=TEAL,width=3)
    else:
        d.line((cx-18,cy+17,cx+18,cy+17),fill=NAVY2,width=2)
        d.rectangle((cx-16,cy+4,cx-9,cy+17),outline=NAVY2,width=2)
        d.rectangle((cx-4,cy-5,cx+3,cy+17),outline=NAVY2,width=2)
        d.rectangle((cx+8,cy-16,cx+15,cy+17),outline=NAVY2,width=2)
        d.line((cx-15,cy-7,cx-4,cy-13,cx+6,cy-11,cx+17,cy-23),fill=TEAL,width=2)
    center_text(d,(x+8,top+118,x+card_w-8,top+218),label,f(17,True),NAVY)
    if idx < 4:
        ax = x+card_w+3
        ay = top+98
        d.line((ax,ay,ax+11,ay),fill=TEAL,width=2)
        d.polygon([(ax+11,ay),(ax+6,ay-4),(ax+6,ay+4)],fill=TEAL)

d.line((545, 405, 1110, 405), fill=LINE, width=1)
rounded(d,(548,432,585,469),18,SURFACE,LINE,1)
d.rectangle((560,442,573,458),outline=TEAL,width=2)
d.line((562,446,571,446),fill=TEAL,width=1)
d.line((562,450,571,450),fill=TEAL,width=1)
d.text((604, 438),'Testing, documentation, training, and staff-ready handoff.',font=f(16),fill=NAVY2)

after = 'Controlled Input  →  AI Proposal  →  Human Review  →  Approved Action  →  Audit & Improve'
d.text((56, 570), after, font=f(13, True), fill=TEAL)

im.save(OUT, 'PNG', optimize=True)
print(OUT)
