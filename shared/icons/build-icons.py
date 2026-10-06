# Builds the site icons from shared/icons/favicon.txt (run from the repo root):
#   python shared/icons/build-icons.py
# Outputs favicon.svg (crisp, any size), favicon-36.png and apple-touch-icon.png (180x180).
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SPEC = os.path.join(HERE, 'favicon.txt')
RENDER = os.path.join(HERE, '..', '..', '.claude', 'skills', 'pixel-art-icon-designer', 'scripts', 'render.py')
BG = '#E1AD12'

pal, rows, in_grid = {}, [], False
for line in open(SPEC, encoding='utf-8'):
    line = line.rstrip('\n')
    if line.startswith('#') or not line.strip():
        continue
    if line == '---':
        in_grid = True; continue
    if in_grid:
        rows.append(line)
    else:
        k, v = [x.strip() for x in line.split('=')]
        pal[k] = v

w, h = len(rows[0]), len(rows)
rects = []
for y, row in enumerate(rows):          # run-length per row keeps the SVG small
    x = 0
    while x < w:
        c = row[x]
        if c == '.':
            x += 1; continue
        s = x
        while x < w and row[x] == c:
            x += 1
        rects.append(f'<rect x="{s}" y="{y}" width="{x - s}" height="1" fill="{pal[c]}"/>')
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" shape-rendering="crispEdges">'
       f'<rect width="{w}" height="{h}" fill="{BG}"/>' + ''.join(rects) + '</svg>\n')
open(os.path.join(HERE, 'favicon.svg'), 'w', encoding='utf-8', newline='\n').write(svg)

for name, scale in (('favicon-36.png', 2), ('apple-touch-icon.png', 10)):
    subprocess.run([sys.executable, RENDER, SPEC, os.path.join(HERE, name), '--scale', str(scale), '--bg', BG], check=True)
print('icons built:', w, 'x', h)
