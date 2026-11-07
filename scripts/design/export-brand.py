"""Regenerate SVG/PNG/ICO assets from the original horizontal PNG.

Requires: Python 3, Pillow, CairoSVG and potrace 1.16.
Run from the repository root: python3 scripts/design/export-brand.py
"""
from pathlib import Path
from PIL import Image
import subprocess,xml.etree.ElementTree as ET,cairosvg,io,tempfile
work = Path(tempfile.mkdtemp(prefix="loco-brand-"))
root=Path('docs/brand/logos');im=Image.open(root/'loco-monitor-horizontal-light.png').convert('RGBA')
# Separate symbol and lettering by original colour; preserve coordinates and counters.
ns='{http://www.w3.org/2000/svg}'
ET.register_namespace('',ns[1:-1])
groups=[]
for part in ['symbol','wordmark']:
 mask=Image.new('L',im.size,255)
 pixels=[]
 for r,g,b,a in im.get_flattened_data():
  copper=r>g*1.3 and r>b*1.3
  pixels.append(0 if a>=128 and (copper if part=='symbol' else not copper) else 255)
 mask.putdata(pixels);mask.convert('1').save(str(work / (part+'-mask.pbm')))
 subprocess.run(['potrace',str(work / (part+'-mask.pbm')),'--svg','--output',str(work / (part+'.svg')),'--turdsize','12','--opttolerance','0.2'],check=True)
 tree=ET.parse(str(work / (part+'.svg'))).getroot();g=ET.Element(ns+'g',{'id':part,'fill':'#B54728' if part=='symbol' else '#18191C'})
 for p in tree:
  p.attrib.pop('fill',None);
  for child in p.iter(): child.attrib.pop('fill',None)
  if p.tag != ns+'metadata': g.append(p)
 groups.append(g)
# Preserve the original canvas and symbol-to-wordmark spacing.
for theme,copper,ink in [('light','#B54728','#18191C'),('dark','#F08A65','#F3F4F6')]:
 for part in ['horizontal','symbol','monochrome']:
  svg=ET.Element(ns+'svg',{'viewBox':('0 0 2172 724' if part!='symbol' else '73 52 491 591'),'role':'img','aria-labelledby':'title'})
  ET.SubElement(svg,ns+'title',{'id':'title'}).text='Loco Monitor' if part!='symbol' else 'LM monogram'
  import copy
  for group in (groups[:1] if part=='symbol' else groups):
   g=copy.deepcopy(group);g.set('fill',ink if part=='monochrome' or g.get('id')=='wordmark' else copper);svg.append(g)
  (root/f'loco-monitor-{part}-{theme}.svg').write_bytes(ET.tostring(svg,encoding='utf-8',xml_declaration=True))
# Master is the only editable geometry source; themed exports derive from it.
(root/'loco-monitor-master.svg').write_bytes((root/'loco-monitor-horizontal-light.svg').read_bytes())
# Derive symbol bounds from actual traced geometry via raster to avoid guessed clipping.
full=ET.parse(root/'loco-monitor-master.svg').getroot();full.remove(full.find(ns+'g[@id="wordmark"]'))
full.set('width','2172');full.set('height','724')
raster=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=ET.tostring(full)))).convert('RGBA');box=raster.getbbox();print('symbol bounds',box)
x,y,right,bottom=box;pad=24;size=max(right-x,bottom-y)+2*pad;vx=x-(size-(right-x))/2;vy=y-(size-(bottom-y))/2
for theme in ['light','dark']:
 p=root/f'loco-monitor-symbol-{theme}.svg';s=ET.parse(p).getroot();s.set('viewBox',f'{vx} {vy} {size} {size}');p.write_bytes(ET.tostring(s,encoding='utf-8',xml_declaration=True))
icons=Path('docs/brand/icons');icons.mkdir(exist_ok=True)
for theme in ['light','dark']:
 source=(root/f'loco-monitor-symbol-{theme}.svg').read_bytes()
 for size in [16,24,32,48,180,192,512]:
  cairosvg.svg2png(bytestring=source,write_to=str(icons/f'icon-{theme}-{size}.png'),output_width=size,output_height=size)
# SVG favicon supports system appearance without external assets.
s=ET.parse(root/'loco-monitor-symbol-light.svg').getroot();s.find(ns+'g').attrib.pop('fill',None)
style=ET.Element(ns+'style');style.text='g{fill:#B54728}@media(prefers-color-scheme:dark){g{fill:#F08A65}}';s.insert(1,style)
(icons/'favicon.svg').write_bytes(ET.tostring(s,encoding='utf-8',xml_declaration=True))
Image.open(icons/'icon-light-512.png').save(icons/'favicon.ico',sizes=[(16,16),(32,32),(48,48)])
# Compare silhouettes at original resolution (threshold ignores antialiasing differences).
source_alpha=im.getchannel('A').point(lambda a:255 if a>=128 else 0)
svg_alpha=Image.open(io.BytesIO(cairosvg.svg2png(url=str(root/'loco-monitor-master.svg'),output_width=im.width,output_height=im.height))).getchannel('A').point(lambda a:255 if a>=128 else 0)
a=list(source_alpha.get_flattened_data());b=list(svg_alpha.get_flattened_data());intersection=sum(x and y for x,y in zip(a,b));union=sum(bool(x or y) for x,y in zip(a,b));print('silhouette IoU',intersection/255/union)

import shutil
shutil.rmtree(work)
