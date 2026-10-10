import {spawn} from 'node:child_process';
import {mkdtempSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const localPreviewServer=process.env.AFTERCUT_CHECK_ORIGIN ? null : spawn('python3',['-m','http.server','8798','--bind','127.0.0.1','--directory',new URL('../',import.meta.url).pathname],{stdio:'ignore'});
const browser=spawn(process.env.AFTERCUT_CHECK_BROWSER || '/usr/lib/chromium/chromium',['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--disable-extensions','--remote-debugging-port=0','--user-data-dir='+mkdtempSync('/tmp/ncv-cdp-'),'about:blank'],{stdio:['ignore','ignore','pipe']});
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



 const base=process.env.AFTERCUT_CHECK_ORIGIN || 'http://127.0.0.1:8798';
 const errors=[];ws.addEventListener('message',e=>{const msg=JSON.parse(e.data);if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails.text)});
 await command('Runtime.enable',{},sessionId);
 await command('Page.addScriptToEvaluateOnNewDocument',{source:`window.__featureTimers=[];const nativeInterval=window.setInterval;window.setInterval=(fn,ms,...args)=>{if(ms===60000)window.__featureTimers.push(fn);return nativeInterval(fn,ms,...args)}`},sessionId);
 for(const width of [1440,900,540,390,320]){
  await command('Emulation.setDeviceMetricsOverride',{width,height:width<=540?900:1080,deviceScaleFactor:1,mobile:width<=540},sessionId);
  await command('Page.navigate',{url:base+'/'},sessionId);
  let ready=false;for(let i=0;i<150;i++){try{ready=await evaluate(`document.readyState==='complete'&&document.querySelectorAll('#spotlightDots button').length===7&&document.querySelectorAll('.film-card').length>0`)}catch{}if(ready)break;await new Promise(r=>setTimeout(r,100))}assert(ready,'page initializes '+width);
  await evaluate(`document.fonts.ready`);
  assert.equal(await evaluate(`document.querySelectorAll('.cult-file').length`),7);
  assert(await evaluate(`document.querySelector('#cult-files').getBoundingClientRect().top>document.querySelector('#fresh-cut').getBoundingClientRect().bottom`));
  for(let slide=0;slide<7;slide++){
   await evaluate(`document.querySelector('[data-slide-to="${slide}"]').click()`);
   await evaluate(`new Promise(resolve=>{const img=document.querySelector('#spotlightPoster');if(img.complete&&img.naturalWidth)resolve();else {img.onload=resolve;img.onerror=()=>resolve()}})`);
   const geometry=await evaluate(`(()=>{const h=document.querySelector('.hero-current h1'),p=document.querySelector('#spotlightPoster'),c=document.querySelector('.hero-cta'),controls=document.querySelector('.spotlight-controls');return {overflow:document.documentElement.scrollWidth>innerWidth,titleFits:h.scrollWidth<=h.clientWidth,image:p.naturalWidth,buttonFits:c.getBoundingClientRect().bottom<controls.getBoundingClientRect().top,counter:document.querySelector('#spotlightCounter').textContent,links:[...document.querySelectorAll('#spotlightSources a')].map(a=>a.href),title:h.innerText}})()`);
   assert(!geometry.overflow,'no horizontal overflow '+width+' slide '+slide);
   assert(geometry.titleFits,'title fits '+width+' '+geometry.title);
   assert(geometry.image>0,'artwork loads '+width+' slide '+slide);
   assert(geometry.buttonFits,'CTA fits above controls '+width+' slide '+slide);
   assert.equal(geometry.counter,`${String(slide+1).padStart(2,'0')} / 07`);
   assert(geometry.links[0].startsWith('https://bloody-disgusting.com/'));
   if(await evaluate(`!!document.querySelector('#spotlightPlay')`)){
    await evaluate(`document.querySelector('#spotlightPlay').click()`);
    assert.equal(await evaluate(`document.querySelector('#spotlightTrailer').hidden`),false);
    assert((await evaluate(`document.querySelector('#spotlightTrailerFrame iframe').src`)).startsWith('https://www.youtube-nocookie.com/embed/'));
    await evaluate(`document.querySelector('#spotlightTrailerClose').click()`);
    assert.equal(await evaluate(`document.querySelector('#spotlightTrailer').hidden`),true);
   }else assert.equal(await evaluate(`document.querySelector('#spotlightTrailerFrame').childElementCount`),0);
  }
  await evaluate(`document.querySelector('[data-slide-to="0"]').click();if(document.querySelector('#spotlightPause').getAttribute('aria-pressed')==='true')document.querySelector('#spotlightPause').click();window.__featureTimers.at(-1)()`);
  assert.equal(await evaluate(`document.querySelector('.hero-current').dataset.slide`),'1','60 second rotation callback advances');
  await evaluate(`document.querySelector('[data-slide-to="0"]').click()`);
  const shot=await command('Page.captureScreenshot',{format:'png'},sessionId);writeFileSync(`/tmp/aftercut-fresh-${width}.png`,Buffer.from(shot.data,'base64'));
  await evaluate(`document.querySelector('#cult-files').scrollIntoView();`);await new Promise(r=>setTimeout(r,1200));
  const libraryShot=await command('Page.captureScreenshot',{format:'png'},sessionId);writeFileSync(`/tmp/aftercut-cult-${width}.png`,Buffer.from(libraryShot.data,'base64'));
  await evaluate(`document.querySelector('.cult-file [data-title="Talk to Me"]').click()`);
  assert.equal(await evaluate(`document.querySelector('#detailOverlay').classList.contains('open')`),true);
  assert.equal(await evaluate(`document.querySelector('#detailTitle').textContent`),'TALK TO ME');
  await evaluate(`document.querySelector('#detailClose').click()`);
  assert.equal(await evaluate(`document.querySelector('#detailOverlay').classList.contains('open')`),false);
  assert(await evaluate(`[...document.querySelectorAll('.cult-art img')].every(img=>img.complete&&img.naturalWidth>0)`),'original seven images load');
  console.log('PASS: '+width+'px: all seven current slides, source links, images, trailer controls, rotation, original seven and film popup.');
 }
 await command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]},sessionId);
 await command('Page.navigate',{url:base+'/'},sessionId);
 for(let i=0;i<100;i++){if(await evaluate(`document.querySelector('#spotlightPause')?.getAttribute('aria-pressed')==='true'`))break;await new Promise(r=>setTimeout(r,100))}
 assert.equal(await evaluate(`document.querySelector('#spotlightPause').getAttribute('aria-pressed')`),'true');
 assert.equal(await evaluate(`window.__featureTimers.length`),0,'reduced motion starts with autoplay disabled');
 assert.deepEqual(errors,[],'no uncaught browser exceptions');
 console.log('PASS: reduced-motion autoplay off; no uncaught browser errors.');
}finally{ws?.close();browser.kill('SIGTERM');localPreviewServer?.kill('SIGTERM')}
