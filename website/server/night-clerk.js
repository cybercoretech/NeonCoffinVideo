const encoder=new TextEncoder();
export const BOT_ID='b1111111-1111-4111-8111-111111111111';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function readBody(request,max=10000){
  const reader=request.body?.getReader();if(!reader)throw Object.assign(new Error('JSON body required.'),{status:400});
  const chunks=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw Object.assign(new Error('Request too large.'),{status:413})}chunks.push(value)}
  const bytes=new Uint8Array(size);let p=0;for(const c of chunks){bytes.set(c,p);p+=c.length}return new TextDecoder().decode(bytes);
}
function invalid(message,status=400){throw Object.assign(new Error(message),{status})}
export async function nightClerk(request,env) {
  const path=new URL(request.url).pathname;
  try {
    if(path==='/api/community/bot/command'){
      if(request.method!=='POST')return json({error:'Method not allowed.'},405);
      const origin=new URL(request.url).origin;
      if(request.headers.get('origin')!==origin||![env.SITE_ORIGIN,'https://neoncoffinvideo.site','https://neoncoffinvideo.pages.dev'].includes(origin))return json({error:'Request origin rejected.'},403);
      if(!env.NIGHT_CLERK_URL)return json({error:'The Night Clerk is not connected yet.'},503);
      const base=new URL(env.NIGHT_CLERK_URL);
      if(base.protocol!=='https:'||base.username||base.password)throw new Error('Invalid bot URL');
      const body=await readBody(request,2048);
      const upstream=await fetch(new URL('/v1/command',base),{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,'CF-Connecting-IP':request.headers.get('cf-connecting-ip')||'local'},body,signal:AbortSignal.timeout(15000)});
      const result=await readBody(upstream,20000);
      return new Response(result,{status:upstream.status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
    }
    if(path!=='/api/community/bot/publish')return json({error:'Not found.'},404);
    if(request.method!=='POST')return json({error:'Method not allowed.'},405);
    if(!env.NIGHT_CLERK_SHARED_SECRET)return json({error:'Bot publishing is not configured.'},503);
    const timestamp=request.headers.get('x-ncv-bot-time')||'',signature=request.headers.get('x-ncv-bot-signature')||'';
    if(!/^\d{10}$/.test(timestamp)||Math.abs(Date.now()/1000-Number(timestamp))>300||!/^[a-f0-9]{64}$/.test(signature))return json({error:'Bot signature rejected.'},401);
    if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'JSON required.'},415);
    const body=await readBody(request),key=await crypto.subtle.importKey('raw',encoder.encode(env.NIGHT_CLERK_SHARED_SECRET),{name:'HMAC',hash:'SHA-256'},false,['verify']);
    const bytes=Uint8Array.from(signature.match(/../g),v=>parseInt(v,16));
    if(!await crypto.subtle.verify('HMAC',key,bytes,encoder.encode(timestamp+'\n'+body)))return json({error:'Bot signature rejected.'},401);
    let payload;try{payload=JSON.parse(body)}catch{invalid('Invalid JSON.')}
    if(!payload||!['prompt','announcement'].includes(payload.kind)||payload.key!==`night-clerk:${payload.kind}:${payload.key?.slice(-10)}`||!/^night-clerk:(prompt|announcement):\d{4}-\d{2}-\d{2}$/.test(payload.key))invalid('Invalid bot delivery key.');
    if(typeof payload.title!=='string'||payload.title.trim().length<5||payload.title.length>120||typeof payload.body!=='string'||payload.body.trim().length<10||payload.body.length>5000)invalid('Invalid bot post.');
    const db=env.COMMUNITY_DB;if(!db)invalid('Community storage unavailable.',503);
    const already=await db.prepare('SELECT topic FROM bot_deliveries WHERE key=?').bind(payload.key).first();
    if(already)return json({id:already.topic,duplicate:true});
    // The signed publisher can write only as this service identity, in two rooms.
    // There is no credential for member sessions, moderation, edits, or deletion.
    const now=Math.floor(Date.now()/1000),topic=crypto.randomUUID();
    try{await db.batch([
      db.prepare('INSERT INTO members(id,google_sub,handle,display_name,bio,avatar_data,created,age_confirmed_at,is_bot,show_online) VALUES(?,?,?,?,?,?,?,?,1,0) ON CONFLICT(id) DO NOTHING').bind(BOT_ID,'bot:night-clerk','NightClerk','The Night Clerk','Automated Neon Coffin Video house host. Catalog picks, nightly questions, and help at the counter.','preset:radioactive-skull',now,now),
      db.prepare('INSERT INTO topics(id,author,category,title,created) VALUES(?,?,?,?,?)').bind(topic,BOT_ID,payload.kind==='prompt'?'movie-talk':'the-counter',payload.title.trim(),now),
      db.prepare('INSERT INTO posts(id,topic,author,body,created) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),topic,BOT_ID,payload.body.trim(),now),
      db.prepare('INSERT INTO bot_deliveries(key,kind,topic,created) VALUES(?,?,?,?)').bind(payload.key,payload.kind,topic,now)
    ])}catch(error){const delivered=await db.prepare('SELECT topic FROM bot_deliveries WHERE key=?').bind(payload.key).first();if(delivered)return json({id:delivered.topic,duplicate:true});throw error}
    return json({id:topic,duplicate:false},201);
  }catch(error){if(!error.status)console.error('Night Clerk connector failed.');return json({error:error.status?error.message:'The Night Clerk connection is temporarily unavailable.'},error.status||503)}
}
