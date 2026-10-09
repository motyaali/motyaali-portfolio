#!/usr/bin/env python3
"""Build the downloadable resume from the print-ready HTML source."""
from html.parser import HTMLParser
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import reportlab

ROOT = Path(__file__).resolve().parents[1]

class ResumeParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inside = False
        self.current = None
        self.buffer = []
        self.records = []

    def handle_starttag(self, tag, attrs):
        if tag == 'main':
            self.inside = True
        if self.inside and tag in ('h1', 'h2', 'h3', 'p', 'li'):
            self.current = tag
            self.buffer = []

    def handle_data(self, data):
        if self.current:
            self.buffer.append(data)

    def handle_endtag(self, tag):
        if tag == self.current:
            self.records.append((tag, ' '.join(''.join(self.buffer).split())))
            self.current = None
        if tag == 'main':
            self.inside = False

def build():
    font_root = Path(reportlab.__file__).parent / 'fonts'
    pdfmetrics.registerFont(TTFont('ResumeSans', str(font_root / 'Vera.ttf')))
    pdfmetrics.registerFont(TTFont('ResumeSansBold', str(font_root / 'VeraBd.ttf')))
    parser = ResumeParser()
    parser.feed((ROOT / 'resume-print.html').read_text())
    body = ParagraphStyle('Body', fontName='ResumeSans', fontSize=9.1, leading=12,
                          textColor=colors.HexColor('#242321'), spaceAfter=3)
    styles = {
        'h1': ParagraphStyle('Name', parent=body, fontName='ResumeSansBold', fontSize=21,
                             leading=24, alignment=TA_CENTER, spaceAfter=5),
        'h2': ParagraphStyle('Section', parent=body, fontName='ResumeSansBold', fontSize=10.5,
                             leading=14, textColor=colors.black, spaceBefore=10, spaceAfter=4,
                             keepWithNext=True),
        'h3': ParagraphStyle('Role', parent=body, fontName='ResumeSansBold', fontSize=9.5,
                             leading=12.7, spaceBefore=5, spaceAfter=3, keepWithNext=True),
        'p': body,
        'li': ParagraphStyle('Bullet', parent=body, leftIndent=10, bulletIndent=0, spaceAfter=3)
    }
    doc = SimpleDocTemplate(str(ROOT / 'assets/Motya-Ali-Resume.pdf'), pagesize=(8.5*inch,11*inch),
                            leftMargin=.55*inch, rightMargin=.55*inch,
                            topMargin=.45*inch, bottomMargin=.45*inch,
                            title='Motya Ali Resume', author='Motya Ali')
    story = []
    role = []
    skip = False
    for tag, text in parser.records:
        # Impact and implementation already cover these repeated summary bullets.
        if tag == 'h2':
            if role:
                story.append(KeepTogether(role)); role=[]
            skip = text == 'SELECTED VALUE'
        if skip:
            continue
        if tag == 'h3':
            if role:
                story.append(KeepTogether(role))
            role=[]
        clean = escape(text).replace(' – ', ' - ').replace('—', '-')
        item = Paragraph(clean, styles[tag], bulletText='•' if tag=='li' else None)
        if tag == 'h3' or role:
            role.append(item)
        else:
            story.append(item)
    if role:
        story.append(KeepTogether(role))
    def footer(canvas, document):
        canvas.saveState()
        canvas.setFont('ResumeSans',8)
        canvas.setFillColor(colors.HexColor('#625f57'))
        canvas.drawString(.55*inch,.24*inch,'Motya Ali | motyaali.com')
        canvas.drawRightString(7.95*inch,.24*inch,str(document.page))
        canvas.restoreState()
    doc.build(story,onFirstPage=footer,onLaterPages=footer)

if __name__ == '__main__':
    build()
