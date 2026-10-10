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
