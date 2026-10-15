import {spawn} from 'node:child_process';
import {mkdtempSync,writeFileSync,mkdirSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {previewDatabase} from '../preview-store.mjs';
import {community} from '../server/community.js';
const root=fileURLToPath(new URL('../dist/',import.meta.url)),db=previewDatabase(':memory:');
const {lateShow}=await import('../server/late-show.js');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.vtt':'text/vtt','.mp4':'video/mp4'};
const group='https://groups.google.com/g/neon-coffin-midnight-dispatch';
const server=http.createServer(async(req,res)=>{
 try{
  let result;const origin='http://127.0.0.1:'+server.address().port;
  if(req.url.startsWith('/api/late-show/'))result=await lateShow(new Request(origin+req.url),{NEWSLETTER_GROUP_URL:group});
  else if(req.url.startsWith('/api/community/'))result=await community(new Request(origin+req.url,{headers:req.headers}),{COMMUNITY_DB:db,SITE_ORIGIN:origin});
  else{let name=decodeURIComponent(req.url.split('?')[0]);if(name==='/')name='/index.html';else if(!path.extname(name))name+='.html';const file=path.resolve(root,'.'+name);if(!file.startsWith(root))throw new Error('Invalid path');result=new Response(await readFile(file),{headers:{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}})}
  res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
// Isolated headless browser and in-memory membership fixture; no live writes.
const browser=spawn('/usr/lib/chromium/chromium',['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--disable-extensions','--remote-debugging-port=0','--user-data-dir='+mkdtempSync('/tmp/ncv-clerk-cdp-'),'about:blank'],{stdio:['ignore','ignore','pipe']});
let ws;const pending=new Map();let next=0;
try{
 const address=await new Promise((resolve,reject)=>{let output='';const timeout=setTimeout(()=>reject(new Error('Browser startup timed out')),15000);browser.stderr.on('data',chunk=>{output+=chunk;const match=output.match(/DevTools listening on (ws:\/\/\S+)/);if(match){clearTimeout(timeout);resolve(match[1])}});browser.on('exit',()=>reject(new Error('Browser exited')))});
 ws=new WebSocket(address);await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}));
 ws.addEventListener('message',event=>{const result=JSON.parse(event.data);if(result.id&&pending.has(result.id)){const {resolve,reject}=pending.get(result.id);pending.delete(result.id);result.error?reject(new Error(result.error.message)):resolve(result.result)}});
 const command=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,sessionId}))});
 const {targetId}=await command('Target.createTarget',{url:'about:blank'}),{sessionId}=await command('Target.attachToTarget',{targetId,flatten:true});
 const evaluate=async expression=>{const result=await command('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value};
 await command('Page.enable',{},sessionId);await command('Runtime.enable',{},sessionId);
 const errors=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)});
 const waitFor=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,100))}throw new Error('Timed out: '+expression+'; state='+JSON.stringify(await evaluate(`({hash:location.hash,open:document.querySelector('#lsDossier')?.open,title:document.querySelector('#lsDossierTitle')?.textContent})`)))};
 const screenshotDir=process.env.NCV_CLERK_SCREENSHOTS||'/tmp/ncv-site-split-preview';mkdirSync(screenshotDir,{recursive:true});
 const base='http://127.0.0.1:'+server.address().port;

 await command('Network.enable',{},sessionId);
 await command('Network.setBlockedURLs',{urls:['https://*','http://*.com/*']},sessionId);
 await command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]},sessionId);
 const navigate=async route=>{
  await command('Page.navigate',{url:base+route},sessionId);
  await waitFor(`location.pathname===${JSON.stringify(route)}&&document.readyState==='complete'`);
  await evaluate(`document.fonts.ready`);
 };
 const shot=async name=>{
  const {data}=await command('Page.captureScreenshot',{format:'png'},sessionId);
  writeFileSync(screenshotDir+'/'+name+'.png',Buffer.from(data,'base64'));
 };
 const stores=['/','/community','/screening-room','/late-returns'];
 const towns=['/harrow-point','/harrow-point-ledger','/hptv-13'];
 for(const width of [1440,390,320]){
  await command('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500},sessionId);
  for(const route of [...stores,'/viewing-room',...towns]){
   await navigate(route);
   assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),route+' fits '+width);
   if(towns.includes(route)){
    assert(await evaluate(`!!document.querySelector('.hp-header')&&!document.querySelector('.primary-navigation,.genre-footer,[data-open-clerk]')`),route+' keeps town chrome');
    assert(await evaluate(`[...document.querySelectorAll('a[href]')].every(a=>a.origin!==location.origin||a.pathname.startsWith('/harrow-point')||a.pathname==='/hptv-13'||a.hasAttribute('data-hp-return'))`),route+' only exits through Be returned');
   }else{
    assert(await evaluate(`!!document.querySelector('a[href="/viewing-room"]')&&!document.querySelector('.hp-header,[data-town-story],[data-harrow-character]')`),route+' keeps store chrome');
    assert(!await evaluate(`/Harrow Point|HPTV|Amusement Pier|Low Tide Mortuary/.test(document.body.innerText)`),route+' has no town copy');
   }
   await evaluate(`Promise.allSettled([...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight).map(i=>i.decode()))`);
   assert.deepEqual(await evaluate(`[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0&&!i.naturalWidth).map(i=>i.src)`),[],route+' visible images load');
   if(width!==320)await shot((route==='/'?'home':route.slice(1))+'-'+width);
  }
  await navigate('/viewing-room');
  await evaluate(`document.querySelector('.vr-vhs').click()`);
  assert.equal(await evaluate('location.pathname'),'/viewing-room');
  assert(await evaluate(`document.querySelector('#vrPlay').hidden`),'VHS does not open the portal');
  await evaluate(`document.querySelector('[data-beta]').click()`);
  assert(await evaluate(`!document.querySelector('#vrPlay').hidden`),'Betamax enables play');
  await evaluate(`document.querySelector('#vrEject').click()`);
  assert(await evaluate(`document.querySelector('#vrPlay').hidden`),'eject cancels');
  await evaluate(`document.querySelector('[data-beta]').click();document.querySelector('#vrPlayButton').click()`);
  await waitFor(`location.pathname==='/harrow-point'&&!!document.querySelector('.hp-arrival')`);
  assert(await evaluate(`document.querySelector('.hp-arrival').textContent.includes('Founders’ Row')`),'arrival is in the Waking Room');
  assert.equal(await evaluate(`sessionStorage.getItem('hp-arrival')`),null);
  await shot('arrival-'+width);
  await evaluate(`document.querySelector('.hp-arrival button').click()`);
  await evaluate(`document.querySelector('[data-hp-place="waking"]').click()`);
  assert(await evaluate(`document.querySelector('.hp-place-dialog').open&&document.querySelector('#hpPlaceTitle').textContent==='The Waking Room'`),'Lot I opens Waking Room');
  assert(await evaluate(`(()=>{const d=document.querySelector('.hp-place-dialog'),r=d.getBoundingClientRect();return r.top>=0&&r.left>=0&&r.right<=innerWidth&&d.scrollWidth<=d.clientWidth})()`),'Waking Room dialog fits');
  await evaluate(`document.querySelector('.hp-place-dialog img').decode()`);
  await shot('waking-room-'+width);
  await evaluate(`document.querySelector('.hp-place-dialog').close();document.querySelector('[data-hp-return]').click()`);
  await waitFor(`location.pathname==='/viewing-room'&&document.body.classList.contains('vr-returned')`);
  assert(await evaluate(`document.querySelector('#vrLine').textContent.includes('Back already?')`),'return greeting');
  assert.equal(await evaluate(`sessionStorage.getItem('ncv-returned')`),null);
  console.log('PASS: split pages, Betamax arrival, Waking Room dialog, and return at '+width+'px');
 }
 assert.deepEqual(errors,[],'no browser exceptions');
 console.log('Screenshots: '+screenshotDir);
}finally{ws?.close();browser.kill();server.closeAllConnections();server.close();db.close()}
