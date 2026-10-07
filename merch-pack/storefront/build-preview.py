from pathlib import Path
from html.parser import HTMLParser
import json,re,shutil
root=Path(__file__).parent
assets=json.loads((root/'preview-assets/manifest.json').read_text())
css=(root/'horror-store-theme.css').read_text()
js=(root/'horror-store-theme.js').read_text()
code='<style id="ncv-horror-theme">\n'+css+'\n</style>\n<script>\n'+js+'\n</script>\n'
(root/'fourthwall-header-code.html').write_text(code)
(root/'fourthwall-header-code.txt').write_text(code)
assert len(code)<25000
for name in ['horror-0.ttf','font-0.ttf','font-2.ttf','font-3.ttf']:
 shutil.copy2(Path('/home/raven/Webdev/neon-coffin-video/assets/fonts')/name,root/'preview-assets'/name)
 css=css.replace('https://neoncoffinvideo.site/assets/fonts/'+name,'preview-assets/'+name)
native_js=next(a['file'] for a in assets if a['file'].endswith('.js'))
class ImgParser(HTMLParser):
 def __init__(self):super().__init__();self.urls=[]
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='img' and d.get('class','').startswith('header__logo-image'):self.urls.append(d['src'])
for source,target in [('/tmp/neon-fourthwall-live.html','theme-preview.html'),('/tmp/neon-fourthwall-product.html','product-preview.html')]:
 original=Path(source).read_text()
 inline=[]
 for attributes,body in re.findall(r'<script([^>]*)>(.*?)</script>',original,re.S):
  if 'fourthwallTheme' in body or 'const currencyData' in body or 'productData' in body or 'var currentProduct' in body:
   inline.append('<script'+attributes+'>'+body+'</script>')
 logo=ImgParser();logo.feed(original)
 s=re.sub(r'<script\b([^>]*)>.*?</script>',lambda m:m.group() if 'data-' in m.group(1) else '',original,flags=re.S)
 s=re.sub(r'\s(?:srcset|integrity|crossorigin)="[^"]*"','',s)
 for url in logo.urls:s=s.replace(url,'neon-coffin-video-header-pink.svg')
 for a in assets:s=s.replace(a['url'],a['file'])
 s=s.replace('</head>','<style>'+css+'</style><script>'+js+'</script></head>')
 route='''<script>document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('a[href="/products/neon-coffin-video-storefront-tee"]').forEach(a=>a.href='product-preview.html');document.querySelectorAll('a[href="/"]').forEach(a=>a.href='theme-preview.html');});</script>'''
 s=s.replace('</body>',''.join(inline)+'<script src="'+native_js+'"></script>'+route+'</body>')
 (root/target).write_text(s)
print('Header code:',len(code),'characters; previews built from real shop HTML.')
