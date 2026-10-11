import {spawn} from 'node:child_process';
import {mkdtempSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const localPreviewServer=process.env.NCV_CHECK_ORIGIN ? null : spawn('python3',['-m','http.server','8796','--bind','127.0.0.1','--directory',new URL('../',import.meta.url).pathname],{stdio:'ignore'});
const browser=spawn(process.env.NCV_CHECK_BROWSER || '/usr/lib/chromium/chromium',['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--disable-extensions','--remote-debugging-port=0','--user-data-dir='+mkdtempSync('/tmp/ncv-cdp-'),'about:blank'],{stdio:['ignore','ignore','pipe']});
let ws;const pending=new Map();let next=0;
try{
 const address=await new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(new Error('Browser startup timed out')),15000);browser.stderr.on('data',chunk=>{output+=chunk;const match=output.match(/DevTools listening on (ws:\/\/\S+)/);if(match){clearTimeout(timer);resolve(match[1])}});browser.on('exit',()=>reject(new Error('Browser exited')))});
 ws=new WebSocket(address);await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}));
 ws.addEventListener('message',event=>{const result=JSON.parse(event.data);if(result.id&&pending.has(result.id)){const{resolve,reject}=pending.get(result.id);pending.delete(result.id);result.error?reject(new Error(result.error.message)):resolve(result.result)}});
 const command=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,sessionId}))});
 const {targetId}=await command('Target.createTarget',{url:'about:blank'});
 const {sessionId}=await command('Target.attachToTarget',{targetId,flatten:true});
 const evaluate=async expression=>{const result=await command('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value};
 await command('Page.enable',{},sessionId);


 const base=process.env.NCV_CHECK_ORIGIN || 'http://127.0.0.1:8796';
 const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const go=async(path,session=sessionId)=>{await command('Page.navigate',{url:base+'/'+path},session);let ready=false;for(let n=0;n<240;n++){try{const r=await command('Runtime.evaluate',{expression:"document.readyState==='complete'&&!!document.querySelector('#cybercoreThemePanel')",returnByValue:true},session);ready=r.result.value}catch{}if(ready)return;await pause(100)}throw new Error('Page did not load: '+path)};
 const snap=async name=>{await pause(150);const r=await command('Page.captureScreenshot',{format:'png'},sessionId);writeFileSync('/tmp/ncv-theme-repair-'+name+'.png',Buffer.from(r.data,'base64'))};
 const open=()=>evaluate(`document.querySelector('.menu-toggle').click();document.querySelector('[data-open-themes]').click()`);
 const choose=async id=>{await open();await evaluate(`document.querySelector('[data-theme-id="${id}"]').click();document.querySelector('.ctp-close').click()`);await pause(150)};
 const errors=[];ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)});await command('Runtime.enable',{},sessionId);
 await command('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false},sessionId);
 await go('index.html');
 assert.equal(await evaluate(`document.documentElement.dataset.cybercoreTheme`),'original');
 const ids=await evaluate(`window.CybercoreThemes.pack.themes.map(t=>t.id)`);
 assert.equal(ids.length,8);
 await open();await evaluate(`new Promise((resolve,reject)=>{const start=Date.now();const check=()=>{if([...document.querySelectorAll('.ctp-scene')].every(i=>i.complete&&i.naturalWidth>=384))resolve(true);else if(Date.now()-start>20000)reject(Error('Preview artwork missing'));else setTimeout(check,100)};check()})`);
 await snap('picker-desktop');await evaluate(`document.querySelector('.ctp-close').click()`);
 for(const id of ids){
  await choose(id);
  assert.equal(await evaluate(`document.documentElement.dataset.cybercoreTheme`),id);
  await evaluate(`new Promise((resolve,reject)=>{const start=Date.now();const check=()=>{const image=document.querySelector('.hero-bg .halloween-scene');if(image?.complete&&image.naturalWidth>=1536)resolve(true);else if(Date.now()-start>20000)reject(Error('Hero artwork missing'));else setTimeout(check,100)};check()})`);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.halloween-scene')).filter`),'none');
  assert.equal(await evaluate(`document.querySelectorAll('.halloween-haze').length`),0);
  assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`));
  await snap(id+'-desktop');
  await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true},sessionId);
  assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`));await snap(id+'-mobile');
  await command('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false},sessionId);
 }
 console.log('PASS: all eight replacement wallpaper previews/heroes load at native resolution; desktop/mobile fit; no haze or image filters.');
 await go('index.html?theme=halloween&check=preserved#home');
 assert.equal(await evaluate(`document.documentElement.dataset.cybercoreTheme`),'hell-fest','old URL cannot override chosen theme');
 await command('Page.reload',{},sessionId);await pause(1200);
 assert.equal(await evaluate(`document.documentElement.dataset.cybercoreTheme`),'hell-fest','reload keeps choice');
 const second=await command('Target.createTarget',{url:'about:blank'});const attachment=await command('Target.attachToTarget',{targetId:second.targetId,flatten:true});await command('Page.enable',{},attachment.sessionId);
 await go('index.html',attachment.sessionId);
 await command('Runtime.evaluate',{expression:"window.CybercoreThemes.apply('hocus-pocus')",returnByValue:true},attachment.sessionId);
 await pause(200);assert.equal(await evaluate(`document.documentElement.dataset.cybercoreTheme`),'hell-fest','cross-tab choice cannot switch the first tab');
 await command('Page.reload',{},sessionId);await pause(1200);assert.equal(await evaluate(`document.documentElement.dataset.cybercoreTheme`),'hell-fest','other tab cannot switch the choice on reload');
 await command('Target.closeTarget',{targetId:second.targetId});
 console.log('PASS: shared/old URLs, reloads, and a second real browser tab cannot silently change the active theme.');
 await go('community.html');
 const forest=await evaluate(`getComputedStyle(document.querySelector('.lounge-backdrop')).backgroundImage`);
 assert(forest.includes('midnight-pier-cliffs.webp'));
 for(const id of ['original',...ids]){
  if(id==='original'){await open();await evaluate(`document.querySelector('.ctp-reset').click();document.querySelector('.ctp-close').click()`)}else await choose(id);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.lounge-backdrop')).backgroundImage`),forest,id+' keeps identical pier-and-cliffs background');
  assert.equal(await evaluate(`document.querySelectorAll('.lounge-hero .halloween-scene-host,.lounge-hero .halloween-atmosphere').length`),0);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.lounge-hero'),'::after').content`),'none');
  const surface=await evaluate(`getComputedStyle(document.querySelector('.rail-card')).backgroundImage`);
  assert.match(surface,/rgba\(17, 26, 33,/);assert.match(surface,/rgba\(8, 13, 18,/);
 }
 await snap('lounge-desktop');
 await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true},sessionId);await snap('lounge-mobile');
 assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`));
 await open();await evaluate(`document.querySelector('.ctp-reset').click();document.querySelector('.ctp-close').click()`);
 assert.deepEqual(errors,[],'No uncaught browser errors');
 console.log('PASS: original plus all eight themes preserve the exact Lounge forest, no theme scenery/veil enters the Lounge, and panel surfaces stay neutral.');
}finally{ws?.close();browser.kill('SIGTERM');localPreviewServer?.kill('SIGTERM')}
