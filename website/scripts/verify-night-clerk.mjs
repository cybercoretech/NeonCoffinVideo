import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {parseEnv} from 'node:util';
const privateDir=homedir()+'/.config/neon-coffin';
const config=parseEnv(readFileSync(privateDir+'/night-clerk.env','utf8'));
const keys=JSON.parse(readFileSync(privateDir+'/night-clerk-keys.json','utf8'));
const health=await fetch(config.NCV_CLERK_URL+'/health');assert.equal(health.status,200);assert.equal((await health.json()).bot.role,'BOT / HOUSE HOST');
const state=await fetch(config.NCV_CLERK_URL+'/admin/status',{headers:{Authorization:'Bearer '+config.NCV_CLERK_ADMIN_TOKEN}});assert.equal(state.status,200);const status=await state.json();assert.equal(status.timeZone,'America/Los_Angeles');assert.equal(status.publishHour,0);
const origin='https://neoncoffinvideo.site',payload=JSON.stringify({kind:'probe',key:'invalid'}),time=String(Math.floor(Date.now()/1000));
const signing=await crypto.subtle.importKey('raw',new TextEncoder().encode(keys.LOUNGE_SIGNING_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
const signature=Buffer.from(await crypto.subtle.sign('HMAC',signing,new TextEncoder().encode(time+'\n'+payload))).toString('hex');
// A correctly signed invalid kind confirms the production secret agreement
// without creating a topic, member, or post.
const rejected=await fetch(origin+'/api/community/bot/publish',{method:'POST',headers:{'Content-Type':'application/json','X-NCV-Bot-Time':time,'X-NCV-Bot-Signature':signature},body:payload});assert.equal(rejected.status,400);assert.equal((await rejected.json()).error,'Invalid bot delivery key.');
const catalog=await (await fetch(origin+'/night-clerk-catalog.json')).json();
const expected=JSON.parse(readFileSync(new URL('../night-clerk-catalog.json',import.meta.url),'utf8'));
assert.deepEqual(catalog.map(m=>m.id).sort(),expected.map(m=>m.id).sort());
console.log('PASS: standalone health, authenticated admin status, Pacific-midnight schedule, production signing-secret agreement, invalid operation rejection without publishing, and complete '+catalog.length+'-film catalog.');

assert.equal(status.ai.enabled,true);assert.equal(status.ai.paused,false);
async function chat(message,history=[]){
 const res=await fetch(origin+'/api/community/bot/chat',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({message,history}),signal:AbortSignal.timeout(40000)});
 const data=await res.json();assert.equal(res.status,200,JSON.stringify(data));assert.equal(data.mode,'ai',JSON.stringify(data));assert(data.text.length>20);
 for(const film of data.movies){assert(catalog.some(m=>m.id===film.id));assert.equal(film.url,origin+'/#film/'+film.id)}
 return data;
}
const question='Recommend one film like Near Dark from our shelves. Do not pick Near Dark itself.';
const first=await chat(question);assert(first.movies.length>0);
const second=await chat('Now give me one from the 1990s.',[{role:'user',content:question},{role:'assistant',content:first.text}]);
assert(second.movies.some(m=>m.year>=1990&&m.year<2000));
console.log('PASS: real Workers AI inference through the production site proxy, catalog-backed film cards, and a contextual 1990s follow-up. Picks: '+first.movies.map(m=>m.title).join(', ')+' → '+second.movies.map(m=>m.title).join(', ')+'.');
