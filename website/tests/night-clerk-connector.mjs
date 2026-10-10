import assert from 'node:assert/strict';
import {community} from '../server/community.js';
import {previewDatabase} from '../preview-store.mjs';
const db=previewDatabase(':memory:'),secret='test-signing-key-not-real',origin='https://neoncoffinvideo.site',env={COMMUNITY_DB:db,SITE_ORIGIN:origin,NIGHT_CLERK_SHARED_SECRET:secret};
const payload={key:'night-clerk:prompt:2026-10-10',kind:'prompt',title:'Which horror sequel earns another spin?',body:'The automated house host wants your take. Keep spoilers marked.'};
async function request(value=payload,{key=secret,time=Math.floor(Date.now()/1000),unsigned=false}={}){
 const body=JSON.stringify(value),timestamp=String(time),signing=await crypto.subtle.importKey('raw',new TextEncoder().encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const signature=Buffer.from(await crypto.subtle.sign('HMAC',signing,new TextEncoder().encode(timestamp+'\n'+body))).toString('hex');
 return new Request(origin+'/api/community/bot/publish',{method:'POST',headers:{'Content-Type':'application/json',...(!unsigned?{'X-NCV-Bot-Time':timestamp,'X-NCV-Bot-Signature':signature}:{})},body});
}
try{
 for(const options of [{unsigned:true},{key:'wrong-key'},{time:Math.floor(Date.now()/1000)-1000}])assert.equal((await community(await request(payload,options),env)).status,401);
 assert.equal((await community(await request({...payload,kind:'moderate'}),env)).status,400);
 let res=await community(await request(),env);assert.equal(res.status,201);const delivered=await res.json();
 res=await community(await request(),env);assert.equal(res.status,200);assert.equal((await res.json()).id,delivered.id);
 const thread=await (await community(new Request(origin+'/api/community/thread?id='+delivered.id),env)).json();assert.equal(thread.posts[0].role,'BOT / HOUSE HOST');assert.equal(thread.posts[0].isBot,true);
 const topics=await (await community(new Request(origin+'/api/community/topics'),env)).json();assert.equal(topics.topics[0].isBot,1);
 const stats=await (await community(new Request(origin+'/api/community/stats'),env)).json();assert.equal(stats.members,0);assert.equal(stats.discussions,1);assert.equal(stats.posts,1);
 assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM sessions').first()).n,0);
 console.log('PASS: signed bot connector, stale/forged/anonymous rejection, limited post kinds, idempotent delivery, bot badges, no login sessions, bot excluded from member counts.');
}finally{db.close()}
