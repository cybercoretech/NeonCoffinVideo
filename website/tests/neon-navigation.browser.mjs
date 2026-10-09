import {spawn} from 'node:child_process';
import {mkdtempSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
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
 const click=async selector=>{await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'nearest'});`);const box=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});const r=e.getBoundingClientRect();if(getComputedStyle(e).display==='none'||!r.width)throw Error('Hidden click target');return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await command('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...box},sessionId);await command('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...box},sessionId)};
 const pause=()=>new Promise(resolve=>setTimeout(resolve,150));
 const screenshot=async name=>{await pause();const shot=await command('Page.captureScreenshot',{format:'png'},sessionId);writeFileSync('/tmp/ncv-'+name+'.png',Buffer.from(shot.data,'base64'))};
 const errors=[];ws.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text)});
 await command('Runtime.enable',{},sessionId);
 for(const path of ['index.html','community.html']){
  await command('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false},sessionId);
  await command('Page.navigate',{url:base+'/'+path},sessionId);
  let ready=false;for(let attempt=0;attempt<200;attempt++){try{ready=await evaluate(`document.readyState==='complete'&&!!document.querySelector('.ncv-reading-progress')&&!!document.querySelector('#ncvHelpPanel')&&!!document.querySelector('#cybercoreThemePanel')`)}catch{}if(ready)break;await new Promise(resolve=>setTimeout(resolve,100))}assert(ready,path+' load timed out');
  assert.equal(await evaluate(`document.querySelectorAll('.ncv-help-launch,.cybercore-theme-launch').length`),0);
  assert.equal(await evaluate(`document.querySelectorAll('[data-open-help]').length`),1);
  assert.equal(await evaluate(`document.querySelectorAll('[data-open-themes]').length`),1);
  await screenshot(path==='index.html'?'polish-main-desktop':'polish-lounge-desktop');
  for(const width of [1440,900,768,600,540,430,390,360,320]){
   await command('Emulation.setDeviceMetricsOverride',{width,height:width<=600?844:1000,deviceScaleFactor:1,mobile:width<=600},sessionId);
   await evaluate(`scrollTo(0,0)`);await click('.menu-toggle');
   assert.equal(await evaluate(`document.querySelector('#primaryNavigation').hidden`),false);
   assert(await evaluate(`(()=>{const r=document.querySelector('#primaryNavigation').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.width>200&&r.bottom<=innerHeight})()`),path+' menu fits '+width);
   assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),path+' no page overflow '+width);
   const menuSizes=await evaluate(`(()=>{const nav=document.querySelector('#primaryNavigation');const items=[...nav.querySelectorAll(':scope>a,:scope>button')];return {columns:getComputedStyle(nav).gridTemplateColumns.split(' ').length,rows:items.map(e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height,shop:e.classList.contains('menu-shop'),icon:!!e.querySelector('svg[data-menu-art]'),textFits:[...e.querySelectorAll('span,small')].every(t=>t.scrollWidth<=t.clientWidth&&t.getBoundingClientRect().bottom<=r.bottom-4)}})}})()`);
   assert(menuSizes.rows.every(r=>r.height===76),path+' uniform 76px menu tiles at '+width);
   const regularWidths=menuSizes.rows.map(r=>r.width);
   assert(Math.max(...regularWidths)-Math.min(...regularWidths)<1,path+' uniform menu widths at '+width);
   assert(menuSizes.rows.every(r=>r.icon&&r.textFits),path+' horror icons and unclipped labels at '+width);
   assert.equal(menuSizes.columns,width<=600?1:2,path+' comfortable phone menu columns at '+width);
   if(path==='index.html')assert.equal(await evaluate(`[...document.querySelectorAll('#primaryNavigation>a')].filter(e=>getComputedStyle(e).display!=='none').length`),10);
   await screenshot((path==='index.html'?'main':'lounge')+'-menu-'+width);
   await command('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);await command('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);
   assert.equal(await evaluate(`document.querySelector('#primaryNavigation').hidden`),true);
   await click('.menu-toggle');await click('[data-open-help]');
   assert.equal(await evaluate(`document.querySelector('#ncvHelpPanel').open`),true);
   assert.equal(await evaluate(`document.querySelector('#primaryNavigation').hidden`),true);
   assert(await evaluate(`(()=>{const r=document.querySelector('#ncvHelpPanel').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth})()`));
   await click('.ncv-help-close');await pause();
   assert.equal(await evaluate(`document.activeElement.classList.contains('menu-toggle')`),true);
   await click('.menu-toggle');await click('[data-open-themes]');
   assert.equal(await evaluate(`document.querySelector('#cybercoreThemePanel').open`),true);
   assert.equal(await evaluate(`document.querySelectorAll('#cybercoreThemePanel [data-theme-id]').length`),8);
   await click('.ctp-card');assert.equal(await evaluate(`document.querySelector('.ctp-card').getAttribute('aria-pressed')`),'true');
   await click('.ctp-reset');assert.equal(await evaluate(`document.querySelector('#ctpCurrent').textContent`),'Original Neon Coffin');
   await command('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);await command('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);await pause();
   assert.equal(await evaluate(`document.querySelector('#cybercoreThemePanel').open`),false);
   assert.equal(await evaluate(`document.activeElement.classList.contains('menu-toggle')`),true);
  }
  await command('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false},sessionId);
  await evaluate(`scrollTo(0,(document.documentElement.scrollHeight-innerHeight)/2)`);await pause();
  const progress=await evaluate(`+document.querySelector('.ncv-reading-progress>span').style.getPropertyValue('--ncv-progress')`);assert(progress>.4&&progress<.6,'reading progress tracks scroll');
  if(path==='community.html')assert.equal(await evaluate(`getComputedStyle(document.querySelector('.tonight-feature'),'::before').animationPlayState`),'paused');
  await evaluate(`scrollTo(0,0)`);await pause();
  if(path==='community.html'){assert.equal(await evaluate(`getComputedStyle(document.querySelector('.tonight-feature'),'::before').animationPlayState`),'running');await click('.menu-toggle');await click('button[data-open-rules]');assert.equal(await evaluate(`document.querySelector('#rules').open`),true);await click('#closeRules');await pause();assert.equal(await evaluate(`document.activeElement.classList.contains('menu-toggle')`),true)}
  await click('.menu-toggle');await click('[data-open-themes]');
  await evaluate(`const motion=document.querySelector('#ctpMotion');motion.checked=false;motion.dispatchEvent(new Event('change',{bubbles:true}));`);
  assert.equal(await evaluate(`document.documentElement.dataset.themeMotion`),'off');
  if(path==='community.html')assert.equal(await evaluate(`getComputedStyle(document.querySelector('.tonight-feature'),'::before').animationName`),'none');
  await evaluate(`document.querySelector('#ctpMotion').checked=true;document.querySelector('#ctpMotion').dispatchEvent(new Event('change',{bubbles:true}));`);
  await click('.ctp-close');
  await command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]},sessionId);await pause();
  assert.equal(await evaluate(`document.documentElement.dataset.themeMotion`),'off');
  if(path==='community.html')assert.equal(await evaluate(`getComputedStyle(document.querySelector('.tonight-feature'),'::before').animationName`),'none');
  await command('Emulation.setEmulatedMedia',{features:[]},sessionId);await pause();
  console.log('PASS: '+path+' desktop/tablet/mobile menus, both dialogs, keyboard/focus, themes, effects toggle, reduced motion, and reading progress.');
 }
 assert.deepEqual(errors,[],'No uncaught browser errors');
}finally{ws?.close();browser.kill('SIGTERM')}
