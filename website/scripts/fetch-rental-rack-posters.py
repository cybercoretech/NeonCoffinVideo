#!/usr/bin/env python3
"""Fetch only explicitly selected film posters, validate bytes, preserve provenance.
Run prepare-rental-rack.mjs first to export the existing editorial records.
No streaming availability is inferred from the presence of a poster.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
import json, re, urllib.parse, urllib.request, time
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
HEADERS={'User-Agent':'NeonCoffinVideoPosterAudit/1.0 (editorial film identification)'}
OVERRIDES={
 'the-stepfather':'The Stepfather (1987 film)','possession':'Possession (1981 film)',
 'phenomena':'Phenomena (film)','the-hidden':'The Hidden (film)','pulse-1988':'Pulse (1988 film)',
 'dolls-1987':'Dolls (1987 film)','swamp-thing':'Swamp Thing (film)','cujo':'Cujo (film)',
 'april-fools-day':"April Fool's Day (1986 film)",'cats-eye':"Cat's Eye (1985 film)",
 'the-silence-of-the-lambs':'The Silence of the Lambs (film)','jacobs-ladder':"Jacob's Ladder (1990 film)",
 'candyman':'Candyman (1992 film)','scream':'Scream (1996 film)','dead-alive':'Braindead (film)',
 'cronos':'Cronos (film)','mimic':'Mimic (film)','ringu':'Ring (1998 film)',
 'dead-of-winter':'Dead of Winter (film)','q-the-winged-serpent':'Q (1982 film)',
}
def get(url):
 for attempt in range(3):
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers=HEADERS),timeout=35) as response:return response.read()
  except Exception:
   if attempt==2:raise
   time.sleep(1+attempt)
def valid(path):
 try:
  with Image.open(path) as im: im.verify()
  with Image.open(path) as im:return min(im.size)>=120
 except Exception:return False
def install(m,source):
 path=ROOT/source.get('local','missing')
 if valid(path):return m['id'],source
 if source.get('image_source') and not source.get('image_source','').endswith('.svg'):
  url=source['image_source'];page=source['page']
 else:
  title=OVERRIDES.get(m['id'],urllib.parse.unquote(source['page'].split('/wiki/')[-1]).replace('_',' ').replace('’',"'"))
  query=urllib.parse.urlencode({'action':'query','format':'json','redirects':1,'prop':'pageimages|info|description','inprop':'url','piprop':'original','pilicense':'any','titles':title})
  data=json.loads(get('https://en.wikipedia.org/w/api.php?'+query));entry=next(iter(data['query']['pages'].values()))
  if not entry.get('original'):raise ValueError('No poster on exact film page: '+title)
  if entry.get('description') and 'film' not in entry['description'].lower() and 'miniseries' not in entry['description'].lower():raise ValueError('Film identity needs review: '+str(entry.get('description')))
  url=entry['original']['source'].split('?utm_')[0];page=entry.get('fullurl',source['page'])
 data=get(url)
 with Image.open(BytesIO(data)) as im:
  im.verify()
 with Image.open(BytesIO(data)) as im:
  if min(im.size)<120:raise ValueError('Poster too small: '+str(im.size))
  fmt=im.format;size=im.size
 ext={'JPEG':'jpg','PNG':'png','WEBP':'webp'}.get(fmt)
 if not ext:raise ValueError('Unsupported image format '+str(fmt))
 local='assets/'+m['id']+'.'+ext;(ROOT/local).write_bytes(data)
 record={'slug':m['id'],'page':page,'image_source':url,'local':local,
  'credit':m['title']+' ('+str(m['year'])+') film poster. Copyright belongs to its respective rights holders; shown for editorial film identification. Source attribution is not a reuse license.',
  'width':size[0],'height':size[1],'checked':'2026-10-10'}
 print('OK',m['id'],size,flush=True);return m['id'],record
if __name__=='__main__':
 existing=json.loads(Path('/tmp/ncv-existing-editorial.json').read_text()); additions=json.loads((ROOT/'rental-rack-additions.json').read_text())
 sources={s['slug']:s for s in json.loads((ROOT/'artwork-sources.json').read_text())}
 excluded={'terminator','robocop','blade-runner'}
 films=list({m['id']:m for m in existing+additions if 1980<=m['year']<=1999 and m['id'] not in excluded}.values())
 assert len({m['id'] for m in films})==len(films) and len(films)>=250
 targets=[]
 for m in films:
  source=sources.get(m['id']) or {'page':m['reference'],'image_source':m['image_source']}
  if not valid(ROOT/source.get('local','missing')):targets.append((m,source))
 errors=[]
 with ThreadPoolExecutor(max_workers=4) as executor:
  futures={executor.submit(install,m,s):m for m,s in targets}
  for future in as_completed(futures):
   m=futures[future]
   try:
    slug,record=future.result();sources[slug]=record
   except Exception as e:errors.append({'id':m['id'],'reason':str(e)});print('NEEDS REVIEW',m['id'],str(e),flush=True)
 (ROOT/'artwork-sources.json').write_text(json.dumps(list(sources.values()),ensure_ascii=False,indent=2)+'\n')
 Path('/tmp/ncv-rack-poster-errors.json').write_text(json.dumps(errors,indent=2))
 print('Validated',len(films)-len(errors),'of',len(films),'covers;',len(errors),'unresolved.',flush=True)
 if errors:raise SystemExit(1)
