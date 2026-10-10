import {spawn} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,mkdirSync,existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {previewDatabase} from '../preview-store.mjs';
import {community} from '../server/community.js';
const root=fileURLToPath(new URL('../',import.meta.url)),db=previewDatabase(':memory:');
const {commandReply}=await import(existsSync(root+'night-clerk/src/clerk.js')?'../night-clerk/src/clerk.js':'../../night-clerk/src/clerk.js');
const catalog=JSON.parse(readFileSync(root+'night-clerk-catalog.json','utf8'));
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'};
const server=http.createServer(async(req,res)=>{
 try{
  let result;const origin='http://127.0.0.1:'+server.address().port;
  if(req.url==='/api/community/bot/chat'){
   const chunks=[];for await(const chunk of req)chunks.push(chunk);const input=JSON.parse(Buffer.concat(chunks));
   const follow=input.message.includes('1990s');if(follow)assert(input.history.some(m=>m.content.includes('Near Dark')));
   result=Response.json({mode:'ai',title:'At the counter',text:follow?'Try Candyman (1992) for a haunted change of pace.':'Near Dark (1987) has a moody vampire road-movie atmosphere.',movies:[{...catalog.find(m=>m.id===(follow?'candyman':'near-dark')),genre:'Supernatural',url:'https://neoncoffinvideo.site/#film/'+(follow?'candyman':'near-dark')}],followUps:['Give me a 1990s option']});
  }else if(req.url==='/api/community/bot/command'){
   const chunks=[];for await(const chunk of req)chunks.push(chunk);const {command}=JSON.parse(Buffer.concat(chunks));
   result=Response.json(commandReply(command,catalog));
  }else if(req.url.startsWith('/api/community/'))result=await community(new Request(origin+req.url),{COMMUNITY_DB:db,SITE_ORIGIN:origin});
  else{let name=decodeURIComponent(req.url.split('?')[0]);if(name==='/community')name='/community.html';const file=path.resolve(root,'.'+name);if(!file.startsWith(root))throw new Error('Invalid path');result=new Response(await readFile(file),{headers:{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}})}
  res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
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
 const waitFor=async expression=>{for(let i=0;i<400;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,100))}throw new Error('Timed out: '+expression)};
 const screenshotDir=process.env.NCV_CLERK_SCREENSHOTS||'/tmp/ncv-clerk-preview';mkdirSync(screenshotDir,{recursive:true});
 for(const width of [1440,390,320]){
  await command('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500},sessionId);
  await command('Page.navigate',{url:(process.argv[2]||'http://127.0.0.1:'+server.address().port)+'/community'},sessionId);
  await waitFor(`!!document.querySelector('#nightClerkDialog')&&document.readyState==='complete'`);
  await evaluate(`document.querySelector('[data-open-clerk]').click()`);
  await waitFor(`document.querySelector('#nightClerkResponse h3')?.textContent==='Ask the Night Clerk'`);
  await evaluate(`document.querySelector('[data-clerk-command="/recommend 1980s creatures"]').click()`);
  await waitFor(`document.querySelectorAll('.clerk-tape').length===3`);
  assert(await evaluate(`(()=>{const e=document.querySelector('#nightClerkDialog'),r=e.getBoundingClientRect();return e.open&&r.left>=0&&r.right<=innerWidth&&e.scrollWidth<=e.clientWidth})()`),'dialog fits '+width);
  assert(await evaluate(`[...document.querySelectorAll('.clerk-shortcuts button')].every(b=>b.getBoundingClientRect().height>=44)`));
  assert.equal(await evaluate(`document.querySelector('.clerk-tape a').target`),'_blank');
  if(!process.argv[2]||width===390){
   await evaluate(`document.querySelector('[data-clerk-reset]').click();document.querySelector('#nightClerkCommand').value='Something like Near Dark';document.querySelector('#nightClerkForm').requestSubmit()`);
   await waitFor(`document.querySelector('#nightClerkStatus').textContent.includes('AI reply')`);
   assert(await evaluate(`document.querySelector('#nightClerkResponse .clerk-answer').textContent.length>20`));
   await evaluate(`document.querySelector('#nightClerkFollowUps button').click()`);
   await waitFor(`document.querySelector('#nightClerkHistory .assistant')&&document.querySelector('#nightClerkStatus').textContent.includes('AI reply')&&!document.querySelector('#nightClerkForm button').disabled`);
   assert(await evaluate(`document.querySelectorAll('#nightClerkHistory .user').length===2`));
   assert(await evaluate(`document.querySelector('.clerk-tape a')?.href.startsWith('https://neoncoffinvideo.site/#film/')`));
   assert(await evaluate(`(()=>{const e=document.querySelector('#nightClerkDialog');return e.scrollWidth<=e.clientWidth})()`),'chat does not overflow '+width);
  }
  const shot=await command('Page.captureScreenshot' ,{format:'png'},sessionId);writeFileSync(screenshotDir+'/night-clerk-'+width+'.png',Buffer.from(shot.data,'base64'));
  await evaluate(`document.querySelector('[data-clerk-reset]').click()`);assert.equal(await evaluate(`document.querySelector('#nightClerkHistory').children.length`),0);
  await evaluate(`document.querySelector('[data-clerk-close]').click()`);assert.equal(await evaluate(`document.querySelector('#nightClerkDialog').open`),false);
 }
 assert.deepEqual(errors,[]);console.log('PASS: Night Clerk panel, catalog commands, conversational follow-ups and reset, accessible controls, separate-tab dossiers, close action, and overflow checks at 1440/390/320px. '+(process.argv[2]?'Live production commands and Workers AI follow-up checked.':'Conversation transport mocked; production AI checked separately.')+'');
}finally{ws?.close();browser.kill();server.closeAllConnections();server.close();db.close()}
