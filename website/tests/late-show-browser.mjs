import {spawn} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,mkdirSync,existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {previewDatabase} from '../preview-store.mjs';
import {community} from '../server/community.js';
import {rentalMovies} from '../rental-rack-data.js';
import {filterRentals,rackCategories} from '../late-show-rack.js';
const root=fileURLToPath(new URL('../',import.meta.url)),db=previewDatabase(':memory:');
const {lateShow}=await import('../server/late-show.js');
const catalog=JSON.parse(readFileSync(root+'night-clerk-catalog.json','utf8'));
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.vtt':'text/vtt','.mp4':'video/mp4'};
const group='https://groups.google.com/g/neon-coffin-midnight-dispatch';
let localSessionCookie='';
const server=http.createServer(async(req,res)=>{
 try{
  let result;const origin='http://127.0.0.1:'+server.address().port;
  if(req.url.startsWith('/api/late-show/'))result=await lateShow(new Request(origin+req.url),{NEWSLETTER_GROUP_URL:group});
  else if(req.url.startsWith('/api/community/'))result=await community(new Request(origin+req.url,{headers:{...req.headers,...(localSessionCookie?{cookie:localSessionCookie}:{})}}),{COMMUNITY_DB:db,SITE_ORIGIN:origin});
  else{let name=decodeURIComponent(req.url.split('?')[0]);if(name==='/community')name='/community.html';if(name==='/screening-room')name='/screening-room.html';if(name==='/late-returns')name='/late-returns.html';const file=path.resolve(root,'.'+name);if(!file.startsWith(root))throw new Error('Invalid path');result=new Response(await readFile(file),{headers:{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}})}
  res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
// The bulk cover audit changes hundreds of hashes much faster than a user;
// disable Chromium's navigation-IPC flood throttle only in this test browser.
const browser=spawn('/usr/lib/chromium/chromium',['--headless','--disable-ipc-flooding-protection','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--disable-extensions','--remote-debugging-port=0','--user-data-dir='+mkdtempSync('/tmp/ncv-clerk-cdp-'),'about:blank'],{stdio:['ignore','ignore','pipe']});
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
 const waitFor=async expression=>{for(let i=0;i<400;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,100))}throw new Error('Timed out: '+expression+'; state='+JSON.stringify(await evaluate(`({hash:location.hash,open:document.querySelector('#lsDossier')?.open,title:document.querySelector('#lsDossierTitle')?.textContent})`)))};
 const screenshotDir=process.env.NCV_CLERK_SCREENSHOTS||'/tmp/ncv-late-show-preview';mkdirSync(screenshotDir,{recursive:true});
 const base=process.argv[2]||'http://127.0.0.1:'+server.address().port;
 for(const width of [1440,768,390,320]){
  await command('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500},sessionId);
  await command('Page.navigate',{url:base+'/screening-room'},sessionId);
  await waitFor(`document.querySelectorAll('.ls-rental-card').length===${rentalMovies.length}&&!document.querySelector('#lsSignupSubmit').disabled&&document.readyState==='complete'`);
  assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),'page fits '+width);
  assert(await evaluate(`[...document.querySelectorAll('.ls-remote button')].every(b=>b.getBoundingClientRect().height>=44)`));
  assert.equal(await evaluate(`document.querySelectorAll('#lsTVScreen iframe').length`),0);
  assert(await evaluate(`[...document.querySelectorAll('.ls-rental-card img,.ls-preview-art img,#lsNowPoster')].every(i=>i.src.includes('/assets/')&&/\.(jpg|png|webp)$/.test(i.src))`),'actual posters throughout rental rack and preview deck');
  await evaluate(`Promise.allSettled([...document.images].map(i=>{i.loading='eager';return i.decode()}))`);
  const failedImages=await evaluate(`[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)`);assert.deepEqual(failedImages,[],'images loaded '+width);
  if(width===1440||width===390){
   await evaluate(`document.querySelector('#rentalRack').scrollIntoView({behavior:'instant'})`);
   const rackShot=await command('Page.captureScreenshot',{format:'png'},sessionId);writeFileSync(screenshotDir+'/rental-rack-'+width+'.png',Buffer.from(rackShot.data,'base64'));
   await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
  }
  await evaluate(`document.querySelector('.menu-toggle').click()`);
  const menuBox=await evaluate(`(()=>{const e=document.querySelector('#primaryNavigation');const r=e.getBoundingClientRect();return {hidden:e.hidden,left:r.left,right:r.right,width:innerWidth}})()`);assert(!menuBox.hidden&&menuBox.left>=0&&menuBox.right<=menuBox.width,'menu fits '+width+' '+JSON.stringify(menuBox));
  assert(await evaluate(`(()=>{const tiles=[...document.querySelectorAll('#primaryNavigation a')];return new Set(tiles.map(e=>Math.round(e.getBoundingClientRect().height))).size===1})()`),'equal menu tile heights');
  await evaluate(`document.querySelector('.menu-toggle').click()`);
  for(const {id:filter} of rackCategories){
   const count=filterRentals(rentalMovies,{category:filter}).length;
   await evaluate(`document.querySelector('[data-ls-filter="${filter}"]').click()`);
   assert.equal(await evaluate(`document.querySelectorAll('.ls-rental-card').length`),count);
  }
  await evaluate(`document.querySelector('#lsRackReset').click()`);
  assert(await evaluate(`(()=>{const r=document.querySelector('#lsRackScroll');return r.scrollHeight>r.clientHeight&&r.scrollWidth<=r.clientWidth})()`),'bounded, scrollable rack at '+width);
  await evaluate(`document.querySelector('#lsRackScroll').focus()`);
  await command('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End',windowsVirtualKeyCode:35},sessionId);
  await new Promise(r=>setTimeout(r,300));
  assert(await evaluate(`document.querySelector('#lsRackScroll').scrollTop>0`),'rack keyboard scrolling '+width);
  await evaluate(`document.querySelector('#lsRackSearch').value='scream';document.querySelector('#lsRackSearch').dispatchEvent(new Event('input'))`);
  assert.equal(await evaluate(`document.querySelectorAll('.ls-rental-card').length`),filterRentals(rentalMovies,{query:'scream'}).length);
  await evaluate(`document.querySelector('#lsRackSearch').value='nosuchtape999';document.querySelector('#lsRackSearch').dispatchEvent(new Event('input'))`);
  assert(await evaluate(`!document.querySelector('#lsRackEmpty').hidden&&document.querySelectorAll('.ls-rental-card').length===0`));
  await evaluate(`document.querySelector('#lsRackReset').click();document.querySelector('#lsRackDecade').value='1990';document.querySelector('#lsRackDecade').dispatchEvent(new Event('change'))`);
  assert.equal(await evaluate(`document.querySelectorAll('.ls-rental-card').length`),filterRentals(rentalMovies,{decade:'1990'}).length);
  await evaluate(`document.querySelector('#lsRackSort').value='newest';document.querySelector('#lsRackSort').dispatchEvent(new Event('change'))`);
  assert.equal(await evaluate(`document.querySelector('.ls-rental-card').dataset.rentalId`),filterRentals(rentalMovies,{decade:'1990',sort:'newest'})[0].id);
  await evaluate(`document.querySelector('#lsRackReset').click();document.querySelector('#rentalRack').scrollIntoView();document.querySelector('[data-ls-tape="the-mutilator"]').click()`);
  assert(await evaluate(`document.querySelector('#lsDossier').open&&location.pathname==='/screening-room'`));
  assert(await evaluate(`(()=>{const e=document.querySelector('#lsDossier');return e.scrollWidth<=e.clientWidth})()`),'tape file fits '+width);
  assert.equal(await evaluate(`document.querySelector('#lsDossier a[href*="tubitv"]').target`),'_blank');
  await evaluate(`document.querySelector('[data-ls-close="lsDossier"]').click()`);
  await waitFor(`!location.hash.startsWith('#tape/')`);
  assert.equal(await evaluate(`location.pathname`),'/screening-room');
  await evaluate(`document.querySelector('#lsIssueList button').click()`);
  await evaluate(`document.querySelector('#lsIssueContent [data-ls-tape]').click()`);
  await evaluate(`document.querySelector('[data-ls-close="lsDossier"]').click()`);
  await waitFor(`location.hash.startsWith('#issue/')`);
  await evaluate(`document.querySelector('[data-ls-close="lsIssueDialog"]').click()`);
  await waitFor(`!location.hash.startsWith('#issue/')`);
  await evaluate(`window.__opened=null;window.open=(url)=>{window.__opened=url};document.querySelector('#lsSignupForm [name="adult"]').checked=true;document.querySelector('#lsSignupForm [name="consent"]').checked=true;document.querySelector('#lsSignupForm').requestSubmit()`);
  assert.equal(await evaluate(`window.__opened`),group);
  assert(await evaluate(`document.querySelector('#lsSignupStatus').textContent.includes('does not subscribe you automatically')`));
  await command('Page.navigate',{url:base+'/screening-room'},sessionId);await waitFor(`document.readyState==='complete'&&document.querySelectorAll('.ls-rental-card').length===${rentalMovies.length}`);await evaluate(`Promise.allSettled([...document.images].map(i=>{i.loading='eager';return i.decode()}))`);await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);await new Promise(r=>setTimeout(r,300));
  const shot=await command('Page.captureScreenshot',{format:'png'},sessionId);writeFileSync(screenshotDir+'/late-show-'+width+'.png',Buffer.from(shot.data,'base64'));
 }
 // Audit every film's tape file, including films seen only in the preview deck.
 for(const {id,poster} of [...rentalMovies,{id:'hellraiser',poster:'/assets/hellraiser.jpg'}]){
  await evaluate(`location.hash='tape/${id}'`);
  await waitFor(`document.querySelector('#lsDossier').open&&document.querySelector('#lsDossierContent img').src.endsWith('${poster}')`);
  await evaluate(`document.querySelector('#lsDossierContent img').decode()`);
  assert(await evaluate(`!!document.querySelector('#lsDossierContent .ls-credit-link')`),'poster credit for '+id);
  await evaluate(`document.querySelector('[data-ls-close="lsDossier"]').click()`);
  await waitFor(`!document.querySelector('#lsDossier').open&&!location.hash.startsWith('#tape/')`);
  if((rentalMovies.findIndex(m=>m.id===id)+1)%50===0)console.log('Audited tape file:',id);
 }
 // Only browser-local saved shelf state is changed; no account mutation or sends.
 await evaluate(`localStorage.setItem('neon-coffin-shelf',JSON.stringify(['near-dark']))`);
 await command('Page.navigate',{url:base+'/screening-room'},sessionId);
 await waitFor(`document.readyState==='complete'&&document.querySelectorAll('#lsPreviewList button').length===3&&document.querySelector('#lsShelfCount').textContent==='1'`);
 await evaluate(`document.querySelector('.ls-rental-card [data-ls-save="hellraiser"]').click()`);
 assert(await evaluate(`JSON.parse(localStorage.getItem('neon-coffin-shelf')).includes('near-dark')&&JSON.parse(localStorage.getItem('neon-coffin-shelf')).includes('hellraiser')`));
 await evaluate(`document.querySelector('[data-ls-channel="2"]').click();document.querySelector('#lsPlay').click()`);
 assert(await evaluate(`document.querySelector('#lsTVScreen iframe').src.startsWith('https://www.youtube-nocookie.com/embed/tOcth6-HjPg')`));
 await evaluate(`document.querySelector('#lsStop').click()`);assert.equal(await evaluate(`document.querySelectorAll('#lsTVScreen iframe').length`),0);
 await command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]},sessionId);
 await evaluate(`document.querySelector('#lsNext').click()`);
 assert.equal(await evaluate(`getComputedStyle(document.querySelector('#lsTVScreen')).animationName`),'none');
 await command('Page.navigate',{url:base+'/community#screening/001'},sessionId);
 await waitFor(`!!document.querySelector('.friday-lounge-context')`);
 assert(await evaluate(`document.querySelector('.friday-lounge-context').textContent.includes('The Mutilator + Prom Night')`));
 assert(await evaluate(`document.querySelector('.friday-lounge-context a').href.includes('/screening-room#issue/001')`));
 if(!process.argv[2]){
  const registration=await community(new Request(base+'/api/auth/email/register',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({email:'late-show-test@example.invalid',handle:'LateShowTest',password:'Local-browser-test-only-456',ageConfirmed:true})}),{COMMUNITY_DB:db,SITE_ORIGIN:base});
  assert.equal(registration.status,200);
  // Secure __Host cookies require HTTPS; the HTTP-only fixture supplies the test session to its backend. OAuth cookie behavior has separate integration tests.
  localSessionCookie=registration.headers.get('set-cookie').split(';')[0];
  assert.equal(await evaluate(`fetch('/api/community/me').then(r=>r.json()).then(d=>d.member?.handle)`),'LateShowTest');
  await command('Page.navigate',{url:'about:blank'},sessionId);
  await command('Page.navigate',{url:base+'/community#screening/001'},sessionId);
  await waitFor(`!!document.querySelector('.friday-lounge-context')&&document.querySelector('#profileNav').textContent.includes('LateShowTest')`);
  await evaluate(`document.querySelector('[data-screening-compose]').click()`);
  await waitFor(`document.querySelector('#composer').open`);
  assert.equal(await evaluate(`document.querySelector('#topicCategory').value`),'double-features');
  assert.equal(await evaluate(`document.querySelector('#topicMovie').value`),'the-mutilator');
  assert(await evaluate(`document.querySelector('#topicForm').elements.title.value.includes('The Mutilator + Prom Night')`));
  assert(await evaluate(`document.querySelector('#topicForm').elements.body.value.includes('forgotten slasher')`));
  await evaluate(`document.querySelector('#composer').close()`);
 }
 if(process.argv[2]){
  await command('Page.navigate',{url:base+'/'},sessionId);
  await waitFor(`document.readyState==='complete'&&document.querySelector('#filmCount')?.textContent.includes('287')`);
  await evaluate(`document.querySelector('#movieSearch').value='Scream 2';document.querySelector('#movieSearch').dispatchEvent(new Event('input'))`);
  await waitFor(`document.querySelectorAll('#filmGrid .film-card').length===1`);
  await evaluate(`document.querySelector('#filmGrid img').decode();document.querySelector('#filmGrid [data-film]').click()`);
  assert(await evaluate(`document.querySelector('#detailDialog').open&&document.querySelector('#detailTitle').textContent==='Scream 2'`));
  assert(await evaluate(`!document.querySelector('#detailContent').textContent.includes('null MIN')&&!!document.querySelector('#detailContent a[href="https://www.rottentomatoes.com/m/scream_2"]')`));
  await evaluate(`document.querySelector('[data-close="detailDialog"]').click();document.querySelector('#backToAisles').click();document.querySelector('#cryptCategories [data-filter="psychological"]').click()`);
  assert(await evaluate(`document.querySelector('#cryptShelfName').textContent.includes('MIND GAMES')&&document.querySelectorAll('#filmGrid .film-card').length>0`));
 }
 for(const width of [1440,390]){
  await command('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500},sessionId);
  await command('Page.navigate',{url:base+'/late-returns'},sessionId);
  await waitFor(`document.readyState==='complete'&&!!document.querySelector('.lr-player')`);
  assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),'Late Returns fits '+width);
  assert(await evaluate(`document.querySelector('.lr-player').getBoundingClientRect().width>0&&document.querySelector('.lr-player').currentSrc.includes('be-kind-rewind-1080p.mp4')`));
  assert(await evaluate(`document.querySelector('.lr-player track[default][kind="captions"]')?.src.includes('be-kind-rewind-captions.vtt')`));
  await evaluate(`document.querySelector('.lr-header .menu-toggle').click()`);
  assert(await evaluate(`!document.querySelector('#primaryNavigation').hidden`),'Late Returns navigation opens '+width);
  assert.equal(await evaluate(`document.querySelectorAll('#primaryNavigation a').length`),12,'Late Returns has all homepage menu links '+width);
  assert.equal(await evaluate(`document.querySelectorAll('#primaryNavigation button.menu-utility').length`),2,'Late Returns has the homepage utilities '+width);
  assert(await evaluate(`([...document.querySelectorAll('#primaryNavigation > a, #primaryNavigation > button')].length===14)&&[...document.querySelectorAll('#primaryNavigation > a, #primaryNavigation > button')].every(t=>t.querySelector('svg.menu-art')&&t.querySelector('span')&&t.querySelector('small'))`),'Late Returns menu tiles match homepage structure '+width);
  await evaluate(`document.querySelector('[data-open-help]').click()`);
  await waitFor(`document.querySelector('#ncvHelpPanel')?.open===true`);
  assert(await evaluate(`document.querySelector('#primaryNavigation').hidden`),'Help Desk opens and closes the menu '+width);
  await evaluate(`document.querySelector('#ncvHelpPanel .ncv-help-close').click();document.querySelector('.lr-header .menu-toggle').click();document.querySelector('[data-open-themes]').click()`);
  await waitFor(`document.querySelector('#cybercoreThemePanel')?.open===true`);
  assert(await evaluate(`document.querySelector('#primaryNavigation').hidden`),'Theme Packs opens and closes the menu '+width);
  await evaluate(`document.querySelector('#cybercoreThemePanel .ctp-close').click()`);
 }
 assert.deepEqual(errors,[]);console.log('PASS: screening page at 1440/768/390/320px, consistent menus, categories, search, decade/sort controls, keyboard scrolling, all 261 credited rental posters, nested local dossiers, Google signup handoff, saved-shelf preservation, user-triggered player and fallback, reduced motion, and Lounge screening context. No subscriptions, posts or email sent.');
}finally{ws?.close();browser.kill();server.closeAllConnections();server.close();db.close()}
