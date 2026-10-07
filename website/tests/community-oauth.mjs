import assert from 'node:assert/strict';
import {community} from '../server/community.js';
import {previewDatabase} from '../preview-store.mjs';

const db=previewDatabase(':memory:');
const origin='https://neoncoffinvideo.pages.dev';
const customOrigin='https://neoncoffinvideo.site';
const env={COMMUNITY_DB:db,SITE_ORIGIN:customOrigin,GOOGLE_CALLBACK_ORIGIN:origin,GOOGLE_CLIENT_ID:'fixture-client',GOOGLE_CLIENT_SECRET:'fixture-secret'};
let r=await community(new Request(origin+'/api/auth/google'),env);
assert.equal(r.status,403);
assert.match((await r.json()).error,/18 or older/);

r=await community(new Request(origin+'/api/auth/google?adult=1'),env);
assert.equal(r.status,302);
const location=new URL(r.headers.get('location'));
const state=location.searchParams.get('state');
const cookie=r.headers.get('set-cookie').split(';')[0];
assert.equal(location.host,'accounts.google.com');
assert.equal(location.searchParams.get('code_challenge_method'),'S256');
assert.equal(location.searchParams.get('redirect_uri'),origin+'/api/auth/callback');
assert(!location.href.includes('fixture-secret'));

// Sign-in initiated on the custom domain first moves to the callback host,
// so its short-lived OAuth state cookie is scoped to the domain Google returns to.
r=await community(new Request(customOrigin+'/api/auth/google?adult=1'),env);
assert.equal(r.status,302);
assert.equal(r.headers.get('location'),origin+'/api/auth/google?adult=1');

let seenVerifier;
globalThis.fetch=async(url,options)=>{
 if(url.includes('/token')){seenVerifier=options.body.get('code_verifier');return Response.json({access_token:'fixture-access'})}
 assert.equal(url,'https://openidconnect.googleapis.com/v1/userinfo');
 assert.equal(options.headers.Authorization,'Bearer fixture-access');
 return Response.json({sub:'fixture-sub',email_verified:true,email:'private@example.test',name:'Private Real Name'});
};
const callback=()=>new Request(origin+'/api/auth/callback?'+new URLSearchParams({state,code:'fixture-code'}),{headers:{Cookie:cookie}});
r=await community(callback(),env);
assert.equal(r.status,302);
assert(seenVerifier);
const destination=new URL(r.headers.get('location'));
assert.equal(destination.origin,customOrigin);
assert.equal(destination.pathname,'/community');
assert.equal(destination.searchParams.get('oauth'),'complete');
const ticket=destination.hash.slice('#claim/'.length);
assert.match(ticket,/^[a-f0-9]{64}$/);
assert.equal(r.headers.getSetCookie().some(s=>s.startsWith('__Host_ncv_session')),false);

const claim=()=>new Request(customOrigin+'/api/auth/claim',{method:'POST',headers:{Origin:customOrigin,'Content-Type':'application/json'},body:JSON.stringify({ticket})});
r=await community(claim(),env);
assert.equal(r.status,200);
const sessionHeader=r.headers.getSetCookie().find(s=>s.startsWith('__Host_ncv_session'));
assert.match(sessionHeader,/Max-Age=7776000/);
const sessionCookie=sessionHeader.split(';')[0];
const storedSession=await db.prepare('SELECT expires FROM sessions').first();
assert(storedSession.expires>Math.floor(Date.now()/1000)+7775900);
r=await community(new Request(customOrigin+'/api/community/me',{headers:{Cookie:sessionCookie}}),env);
const d=await r.json();
assert(d.member.handle.startsWith('NightCreature_'));
assert.equal(d.ageConfirmed,true);
assert(!JSON.stringify(d).includes('private@example.test'));
assert(!JSON.stringify(d).includes('Private Real Name'));
r=await community(claim(),env);
assert.equal(r.status,401);
r=await community(callback(),env);
assert.equal(r.status,401);

// Signing in from the main page returns there and reuses the Lounge account.
r=await community(new Request(origin+'/api/auth/google?adult=1&return=store'),env);
const storeState=new URL(r.headers.get('location')).searchParams.get('state');
const storeCookie=r.headers.get('set-cookie').split(';')[0];
r=await community(new Request(origin+'/api/auth/callback?'+new URLSearchParams({state:storeState,code:'fixture-code'}),{headers:{Cookie:storeCookie}}),env);
const storeDestination=new URL(r.headers.get('location'));
assert.equal(storeDestination.pathname,'/');
assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM members').first()).n,1);

console.log('PASS: verified Google OAuth now uses the registered Pages callback and a one-time handoff to create a 90-day session on the custom domain; PKCE, age attestation, private identity, handoff replay and OAuth-state replay checks passed. Live Google sign-in not exercised by this test.');
db.close();
