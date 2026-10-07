import assert from 'node:assert/strict';
import {community} from '../server/community.js';
import {previewDatabase} from '../preview-store.mjs';

const db=previewDatabase(':memory:');
const origin='https://neoncoffinvideo.site';
const env={COMMUNITY_DB:db,SITE_ORIGIN:origin};
const request=(path,body,cookie='',from=origin)=>new Request(origin+'/api/'+path,{
 method:body?'POST':'GET',
 headers:{...(cookie?{Cookie:cookie}:{}),...(body?{Origin:from,'Content-Type':'application/json'}:{})},
 ...(body?{body:JSON.stringify(body)}:{})
});

const registration={email:'night-shift@example.test',handle:'TapeGhoul',displayName:'Tape Ghoul',password:'cryptic-rental-password-42',ageConfirmed:true};
let response=await community(request('auth/email/register',registration),env);
assert.equal(response.status,200);
const session=response.headers.get('set-cookie');
assert.match(session,/Max-Age=7776000/);
assert.match(session,/HttpOnly/);
assert.match(session,/Secure/);
const cookie=session.split(';')[0];

response=await community(request('community/me',undefined,cookie),env);
let member=(await response.json()).member;
assert.equal(member.handle,'TapeGhoul');
assert.equal(member.displayName,'Tape Ghoul');
assert.equal(member.avatar,'');
assert(!JSON.stringify(member).includes(registration.email));

response=await community(request('auth/email/register',registration),env);
assert.equal(response.status,409);
response=await community(request('auth/email/register',{...registration,email:'second@example.test',handle:'UnderAge',ageConfirmed:false}),env);
assert.equal(response.status,400);
response=await community(request('auth/email/login',{email:registration.email,password:registration.password},'', 'https://not-neon-coffin.example'),env);
assert.equal(response.status,403);
response=await community(request('auth/email/login',{email:registration.email,password:'incorrect-password'}),env);
assert.equal(response.status,401);
response=await community(request('auth/email/login',{email:registration.email,password:registration.password}),env);
assert.equal(response.status,200);
const loginCookie=response.headers.get('set-cookie').split(';')[0];

response=await community(request('community/profile',{
 handle:'TapeGhoul',displayName:'Tape Ghoul',avatar:'preset:midnight-ghost',banner:'',bio:'',favorite:'',location:'',signature:'',socialLinks:[],visibility:'public',showOnline:true,browserAlerts:false
},loginCookie),env);
assert.equal(response.status,200);
response=await community(request('community/me',undefined,loginCookie),env);
member=(await response.json()).member;
assert.equal(member.avatarPreset,'midnight-ghost');
assert.equal(member.avatar,'/assets/avatars/midnight-ghost.svg');

// The same signed-in member session is consumed by the Lounge's existing API.
response=await community(request('community/age-attest',{},loginCookie),env);
assert.equal(response.status,200);
response=await community(request('community/me',undefined,loginCookie),env);
assert.equal((await response.json()).member.handle,'TapeGhoul');

console.log('PASS: site email registration and login share Lounge membership, keep email private, enforce age/origin/password rules, retain a 90-day secure session, and save a preset avatar.');
db.close();
