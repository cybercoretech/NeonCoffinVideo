import {identity,normalizeCatalog,commandReply,localClock,promptFor} from './clerk.js';
import {AI_MODEL,limits,chatInput,chatReply,clientKey} from './chat.js';
import {regulars,regularReply} from './regulars.js';
const enc=new TextEncoder();
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status})};
const response=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function boundedText(request,max=12000) {
  const reader=request.body?.getReader();if(!reader)fail('Missing request body.');
  const chunks=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();fail('Request too large.',413)}chunks.push(value)}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}return new TextDecoder().decode(bytes);
}
async function jsonBody(request,max=12000){if(!request.headers.get('content-type')?.startsWith('application/json'))fail('JSON required.',415);try{return JSON.parse(await boundedText(request,max))}catch(error){if(error.status)throw error;fail('Invalid JSON.')}}
async function authorized(request,env){
  const value=request.headers.get('authorization')||'';
  if(!env.ADMIN_TOKEN||value.length>300||!value.startsWith('Bearer '))return false;
  const key=await crypto.subtle.importKey('raw',enc.encode(env.ADMIN_TOKEN),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
  const signature=await crypto.subtle.sign('HMAC',key,enc.encode('night-clerk-admin'));
  const supplied=await crypto.subtle.importKey('raw',enc.encode(value.slice(7)||'invalid'),{name:'HMAC',hash:'SHA-256'},false,['verify']);
  return crypto.subtle.verify('HMAC',supplied,signature,enc.encode('night-clerk-admin'));
}
const originFor=env=>{const url=new URL(env.SITE_ORIGIN||'https://neoncoffinvideo.site');if(url.protocol!=='https:'||url.username||url.password)throw new Error('Invalid site origin');return url.origin};
async function catalog(env) {
  const upstream=await fetch(originFor(env)+'/night-clerk-catalog.json',{signal:AbortSignal.timeout(10000)});
  if(!upstream.ok)throw new Error('Catalog unavailable');
  const rows=JSON.parse(await boundedText(upstream,1500000)),result=normalizeCatalog(rows);
  if(result.length<2)throw new Error('Catalog unavailable');return result;
}
export async function publish(env,payload) {
  if(!env.LOUNGE_SIGNING_SECRET)throw new Error('Lounge connection not configured');
  const body=JSON.stringify(payload),timestamp=String(Math.floor(Date.now()/1000));
  const key=await crypto.subtle.importKey('raw',enc.encode(env.LOUNGE_SIGNING_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const signature=[...new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(timestamp+'\n'+body)))].map(b=>b.toString(16).padStart(2,'0')).join('');
  const result=await fetch(originFor(env)+'/api/community/bot/publish',{method:'POST',headers:{'Content-Type':'application/json','X-NCV-Bot-Time':timestamp,'X-NCV-Bot-Signature':signature},body,signal:AbortSignal.timeout(10000)});
  const data=JSON.parse(await boundedText(result,12000));
  if(!result.ok)throw new Error('Lounge publication rejected ('+result.status+')');return data;
}
export async function deliverPending(env) {
  const pending=await env.BOT_DB.prepare('SELECT id,payload FROM jobs WHERE delivered IS NULL ORDER BY created,id LIMIT 2').all();
  const delivered=[];
  for(const job of pending.results){
    if((await env.BOT_DB.prepare('SELECT paused FROM settings WHERE id=1').first())?.paused)break;
    const result=await publish(env,JSON.parse(job.payload));
    const payload=JSON.parse(job.payload),deliveredAt=Math.floor(Date.now()/1000);
    await env.BOT_DB.prepare('UPDATE jobs SET delivered=?,topic=? WHERE id=?').bind(deliveredAt,result.id,job.id).run();
    if(payload.kind==='reply')await env.BOT_DB.prepare('INSERT OR IGNORE INTO regular_replies(topic,reply_key,created) VALUES(?,?,?)').bind(payload.topic,job.id,deliveredAt).run();
    delivered.push({key:job.id,topic:result.id});
  }
  return delivered;
}
export async function runNightly(env,time=Date.now(),{force=false}={}) {
  if(!env.BOT_DB)throw new Error('Bot storage not configured');
  const clock=localClock(time,env.TIME_ZONE||'America/Los_Angeles');
  const state=await env.BOT_DB.prepare('SELECT paused FROM settings WHERE id=1').first();
  if(state?.paused)return {paused:true};
  if(!force&&clock.hour!==Number(env.PUBLISH_HOUR||0)){
    const delivered=await deliverPending(env);
    return delivered.length?{date:clock.date,delivered}:{skipped:true};
  }
  const films=await catalog(env),now=Math.floor(time/1000),promptId='night-clerk:prompt:'+clock.date;
  const prompt={key:promptId,kind:'prompt',title:promptFor(clock.date),body:'📼 THE NIGHT MANAGER / AUTOMATED HOUSE HOST\n\n'+promptFor(clock.date)+'\n\nTell us why. Keep spoilers marked, and be cool to each other. Bad movies. Great nights.'};
  await env.BOT_DB.prepare('INSERT OR IGNORE INTO jobs(id,kind,payload,created) VALUES(?,?,?,?)').bind(promptId,'prompt',JSON.stringify(prompt),now).run();
  const previous=await env.BOT_DB.prepare('SELECT seen FROM catalog_state WHERE id=1').first();
  const ids=films.map(m=>m.id),old=previous?new Set(JSON.parse(previous.seen)):null;
  const additions=old?films.filter(m=>!old.has(m.id)):[];
  if(additions.length){
    const key='night-clerk:announcement:'+clock.date;
    const payload={key,kind:'announcement',title:'Fresh on the shelves · '+clock.date,body:'📼 THE NIGHT MANAGER / CATALOG UPDATE\n\n'+additions.length+' new '+(additions.length===1?'tape has':'tapes have')+' joined the catalog:\n\n'+additions.slice(0,12).map(m=>m.title+' ('+m.year+') — '+originFor(env)+'/#film/'+m.id).join('\n')+(additions.length>12?'\n\nBrowse the main shelf for the rest.':'')};
    await env.BOT_DB.prepare('INSERT OR IGNORE INTO jobs(id,kind,payload,created) VALUES(?,?,?,?)').bind(key,'announcement',JSON.stringify(payload),now).run();
  }
  // Persist the baseline only after the announcement is in the durable outbox.
  await env.BOT_DB.prepare('INSERT INTO catalog_state(id,seen,checked) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET seen=excluded.seen,checked=excluded.checked').bind(JSON.stringify(ids),now).run();
  await queueRegularReply(env,clock,now);
  const delivered=await deliverPending(env);
  return {date:clock.date,delivered};
}
async function queueRegularReply(env,clock,now) {
  const key='night-clerk:reply:'+clock.date;
  if(await env.BOT_DB.prepare('SELECT 1 AS yes FROM jobs WHERE id=?').bind(key).first())return;
  const response=await fetch(originFor(env)+'/api/community/topics?offset=0',{signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('Lounge discussions unavailable');
  const data=await response.json(),topics=Array.isArray(data.topics)?data.topics:[];
  const cutoff=now-14*86400;
  let candidate=null;
  for(const topic of topics){
    if(!topic||typeof topic.id!=='string'||topic.isBot||topic.locked||Number(topic.created)<cutoff||Number(topic.created)>now)continue;
    if(await env.BOT_DB.prepare('SELECT 1 AS yes FROM regular_replies WHERE topic=?').bind(topic.id).first())continue;
    candidate=topic;break;
  }
  if(!candidate)return;
  const index=Math.floor(Date.parse(clock.date+'T00:00:00Z')/86400000)%regulars.length;
  const persona=regulars[index];
  const payload={key,kind:'reply',topic:candidate.id,personaId:persona.id,body:regularReply(persona,candidate.title)};
  await env.BOT_DB.prepare('INSERT OR IGNORE INTO jobs(id,kind,payload,created) VALUES(?,?,?,?)').bind(key,'reply',JSON.stringify(payload),now).run();
}
export default {
  async fetch(request,env) {
    try {
      const url=new URL(request.url),path=url.pathname;
      if(path==='/health'&&request.method==='GET')return response({ok:true,bot:identity,version:'1.1.0',conversation:!!env.AI&&env.AI_ENABLED==='1'});
      if(path.startsWith('/admin/')) {
        if(!await authorized(request,env))return response({error:'Administrator token required.'},401);
        if(!env.BOT_DB)fail('Bot storage is not connected.',503);
        if(path==='/admin/ai/check'&&request.method==='POST'){
          const day=new Date().toISOString().slice(0,10);
          return response(await chatReply(env,{message:'Recommend a film like Near Dark.',history:[]},await catalog(env),'owner-check',originFor(env),day,{diagnostic:true}));
        }
        if(path==='/admin/status'&&request.method==='GET'){
          const settings=await env.BOT_DB.prepare('SELECT paused,ai_paused FROM settings WHERE id=1').first();
          const jobs=await env.BOT_DB.prepare('SELECT id,kind,topic,created,delivered FROM jobs ORDER BY created DESC LIMIT 15').all();
          const day=new Date().toISOString().slice(0,10),usage=await env.BOT_DB.prepare('SELECT COUNT(*) AS calls,COALESCE(SUM(reserved),0) AS reserved FROM ai_usage WHERE day=?').bind(day).first();
          return response({bot:identity,paused:!!settings.paused,timeZone:env.TIME_ZONE,publishHour:Number(env.PUBLISH_HOUR||0),jobs:jobs.results,ai:{enabled:!!env.AI&&env.AI_ENABLED==='1',paused:!!settings.ai_paused,model:AI_MODEL,day,...usage,limits}});
        }
        if(path==='/admin/ai'&&request.method==='POST'){
          const body=await jsonBody(request);if(typeof body.paused!=='boolean')fail('Choose true or false for paused.');
          await env.BOT_DB.prepare('UPDATE settings SET ai_paused=? WHERE id=1').bind(body.paused?1:0).run();return response({aiPaused:body.paused});
        }
        if(path==='/admin/pause'&&request.method==='POST'){
          const body=await jsonBody(request);if(typeof body.paused!=='boolean')fail('Choose true or false for paused.');
          await env.BOT_DB.prepare('UPDATE settings SET paused=? WHERE id=1').bind(body.paused?1:0).run();return response({paused:body.paused});
        }
        if(path==='/admin/run'&&request.method==='POST')return response(await runNightly(env,Date.now(),{force:true}));
        fail('Not found.',404);
      }
      if(['/v1/command','/v1/chat'].includes(path)&&request.method==='POST'){
        const allowed=new Set([originFor(env),'https://neoncoffinvideo.pages.dev']);
        if(request.headers.has('origin')&&!allowed.has(request.headers.get('origin')))fail('Request origin rejected.',403);
        const isChat=path==='/v1/chat';
        const day=new Date().toISOString().slice(0,10);
        if(isChat&&!request.headers.get('content-type')?.startsWith('application/json'))fail('JSON required.',415);
        const raw=isChat?await boundedText(request,14000):null;
        const client=isChat?await clientKey(request,env,raw,day):(request.headers.get('cf-connecting-ip')||'local');
        const limiter=isChat?env.CHAT_LIMITER:env.COMMAND_LIMITER;
        const limited=limiter?await limiter.limit({key:'clerk:'+client}):{success:true};
        if(!limited.success)fail('The clerk is busy. Try again in a minute.',429);
        if(isChat){
          let value;try{value=JSON.parse(raw)}catch{fail('Invalid JSON.')}
          const input=chatInput(value);
          return response(await chatReply(env,input,await catalog(env),client,originFor(env),day));
        }
        const body=await jsonBody(request,2048);
        if(!body||typeof body.command!=='string'||body.command.length>200||!body.command.trim())fail('Enter a command up to 200 characters.');
        const movies=/^\/?(help|prompt)(\s|$)/i.test(body.command||'')?[]:await catalog(env);
        const reply=commandReply(body.command,movies,{origin:originFor(env),date:localClock(Date.now(),env.TIME_ZONE).date});
        if(reply.command==='prompt'&&env.BOT_DB){
          const job=await env.BOT_DB.prepare('SELECT topic FROM jobs WHERE id=? AND delivered IS NOT NULL').bind('night-clerk:prompt:'+reply.date).first();
          if(job?.topic){reply.discussion=originFor(env)+'/community#thread/'+job.topic;reply.links=[{label:'Answer tonight’s question',url:reply.discussion}]}
        }
        return response(reply);
      }
      fail('Not found.',404);
    } catch(error) {
      if(!error.status)console.error(JSON.stringify({event:'night-clerk-error',message:error.message}));
      return response({error:error.status?error.message:'The Night Manager is temporarily unavailable. Please try again.'},error.status||503);
    }
  },
  async scheduled(controller,env) {
    const result=await runNightly(env,controller.scheduledTime);
    console.log(JSON.stringify({event:'night-clerk-schedule',...result}));
  }
};
