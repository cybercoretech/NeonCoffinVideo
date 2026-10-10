import {lateShow} from './server/late-show.js';
import {community} from './server/community.js';
const PLUTO_CHANNELS=new Set(['pluto-tv-horror','pluto-tv-terror','pluto-tv-sci-fi','pluto-tv-thrillers','universal-monsters','midnight-pulp','cult-films','the-asylum']);
// Public channel IDs verified against Tubi's own horror and sci-fi guide.
const TUBI_CHANNELS=['692090','692051','692057','700406','400000006','715951','715946','400000059'];
const providers={pluto:{name:'Pluto TV',home:'https://pluto.tv/',ttl:300000},tubi:{name:'Tubi',home:'https://tubitv.com/live',ttl:300000},fawesome:{name:'Fawesome',home:'https://fawesome.tv/category/79571/horror-movies',ttl:3600000}};
const cache=new Map(),pending=new Map();
async function readJSON(url,headers={}){const r=await fetch(url,{headers:{Accept:'application/json',...headers},signal:AbortSignal.timeout(14000)});if(!r.ok){console.warn('Provider HTTP',new URL(url).hostname,r.status);throw new Error('Provider unavailable')}return r.json()}
function validAiring(p){return p.title&&Number.isFinite(Date.parse(p.start))&&Date.parse(p.end)>Date.now()&&Date.parse(p.end)>Date.parse(p.start)}
function image(images){return images?.landscape?.[0]||images?.background?.[0]||images?.poster?.[0]||null}
async function pluto(){const endpoint=new URL('https://api.pluto.tv/v2/channels');endpoint.searchParams.set('start',new Date(Date.now()-1800000).toISOString());endpoint.searchParams.set('stop',new Date(Date.now()+28800000).toISOString());const data=await readJSON(endpoint);if(!Array.isArray(data))throw new Error('Invalid guide');return {mode:'live',source:'https://api.pluto.tv/v2/channels',channels:data.filter(c=>PLUTO_CHANNELS.has(c.slug)||/horror|terror|sci[- ]?fi|science fiction|ciencia ficci|ficci[oó]n|fantast|midnight pulp|cult films/i.test(c.slug+" "+c.name)).slice(0,10).map(c=>({id:c._id,name:c.name,number:c.number,watch:'https://pluto.tv/live-tv/'+encodeURIComponent(c.slug),programs:(c.timelines||[]).map(t=>({id:t._id,title:t.title||t.episode?.name,start:t.start,end:t.stop,description:t.episode?.description||'',image:t.episode?.poster?.path||null,rating:t.episode?.rating||''})).filter(validAiring)})).filter(c=>c.programs.length)}}
async function tubi(){const endpoint=new URL('https://epg-cdn.production-public.tubi.io/content/epg/programming');endpoint.searchParams.set('platform','web');endpoint.searchParams.set('lookahead','1');endpoint.searchParams.set('content_id',TUBI_CHANNELS.join(','));const data=await readJSON(endpoint);if(!Array.isArray(data.rows))throw new Error('Invalid guide');return {mode:'live',source:'https://tubitv.com/live',channels:data.rows.filter(c=>TUBI_CHANNELS.includes(String(c.content_id))).map(c=>({id:String(c.content_id),name:c.title,number:TUBI_CHANNELS.indexOf(String(c.content_id))+1,watch:'https://tubitv.com/live/'+encodeURIComponent(c.content_id),programs:(c.programs||[]).map(p=>({id:String(p.id),title:p.title,episode:p.episode_title||'',start:p.start_time,end:p.end_time,description:p.description||'',image:image(p.images),rating:p.ratings?.[0]?.code||''})).filter(validAiring).sort((a,b)=>Date.parse(a.start)-Date.parse(b.start))})).filter(c=>c.programs.length)}}
async function fawesome(){
 const base='https://fawesome.tv/home/new/v466/api/';
 // The official website creates this anonymous catalog session. No user login,
 // stream URLs, DRM resources, or session tokens are returned to our visitors.
 const bootstrap=await readJSON(base+'getSecurityToken.php?appId=9&siteId=236&auth-token=1217575&deviceId=&apiEnv=production');if(typeof bootstrap.securityToken!=='string')throw new Error('Catalog unavailable');
 const headers={token:bootstrap.securityToken,Referer:providers.fawesome.home,Origin:'https://fawesome.tv'};
 const pages=await Promise.all([0,1,2].map(start=>readJSON(base+'recipes.php?searchType=nodeid&keys=919933,10624461,10640639&appId=9&siteId=236&auth-token=1217575&version=sv9.0&sort_type=pr&order=1&deviceId=&apiEnv=production&start-index='+start,headers)));
 const unique=new Map();for(const page of pages){if(page.status!=='ok'||!Array.isArray(page.results))throw new Error('Catalog unavailable');for(const f of page.results){if(f.feed_type!=='video'||!f.node_id)continue;const id=String(f.node_id);if(!/^\d+$/.test(id))continue;const year=String(f.release_date||'').match(/\b(19|20)\d{2}\b/)?.[0]||'';const slug=String(f.title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');unique.set(id,{id,name:f.title,number:unique.size+1,watch:'https://fawesome.tv/movies/'+id+'/'+slug,title:f.title,year,description:f.description||'',image:f.bg_image_landscape||f.picture||null,poster:f.picture||null,rating:f.age_appropriate_rating||'',minutes:Math.round(Number(f.runtime)/60)||null,programs:[]})}}
 return {mode:'ondemand',source:providers.fawesome.home,channels:[...unique.values()].sort((a,b)=>(Number(b.year)<2000?1:0)-(Number(a.year)<2000?1:0))};
}
async function load(provider){const entry=cache.get(provider);if(entry&&Date.parse(entry.expiresAt)>Date.now())return entry;if(pending.has(provider))return pending.get(provider);const task=(async()=>{const data=await ({pluto,tubi,fawesome}[provider])();if(!data.channels.length)throw new Error('No listings');const now=new Date();const result={...data,key:provider,provider:providers[provider].name,checkedAt:now.toISOString(),expiresAt:new Date(Date.now()+providers[provider].ttl).toISOString(),region:data.mode==='live'?'Service-selected regional feed':'Provider catalog · availability varies by region'};cache.set(provider,result);return result})();pending.set(provider,task);try{return await task}finally{pending.delete(provider)}}
export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname.startsWith('/api/late-show/'))return lateShow(request,env);if(url.pathname.startsWith('/api/community/')||url.pathname.startsWith('/api/auth/'))return community(request,env);if(url.pathname==='/api/movies')return imdbSearch(request,env);if(url.pathname!=='/api/guide')return env.ASSETS.fetch(request);if(request.method!=='GET')return Response.json({error:'Method not allowed'},{status:405,headers:{Allow:'GET'}});const provider=url.searchParams.get('provider')||'pluto';if(!Object.hasOwn(providers,provider))return Response.json({error:'Unknown provider'},{status:400});try{return Response.json(await load(provider),{headers:{'Cache-Control':'private, max-age=60'}})}catch(error){console.warn('Guide unavailable',provider,error.message);return Response.json({error:'Current listings are temporarily unavailable. Check the official service.',provider:providers[provider].name,channels:[]},{status:503,headers:{'Cache-Control':'no-store'}})}}};

// Official IMDb requests are signed here; credentials never enter the browser.
const imdbKeys=['IMDB_ACCESS_KEY_ID','IMDB_SECRET_ACCESS_KEY','IMDB_API_KEY','IMDB_DATA_SET_ID','IMDB_REVISION_ID','IMDB_ASSET_ID'];
const encoder=new TextEncoder();
const hex=bytes=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
async function digest(value){return hex(await crypto.subtle.digest('SHA-256',encoder.encode(value)))}
async function hmac(key,value){const k=await crypto.subtle.importKey('raw',typeof key==='string'?encoder.encode(key):key,{name:'HMAC',hash:'SHA-256'},false,['sign']);return crypto.subtle.sign('HMAC',k,encoder.encode(value))}
async function imdbSearch(request,env){
 const headers={'Cache-Control':'no-store'};
 if(request.method!=='GET')return Response.json({error:'Method not allowed'},{status:405,headers:{...headers,Allow:'GET'}});
 if(!imdbKeys.every(k=>env[k]))return Response.json({code:'not_configured',error:'All-movies search is waiting for its IMDb connection. Our curated shelves are ready to browse.'},{status:503,headers});
 const url=new URL(request.url),q=(url.searchParams.get('q')||'').trim(),cursor=url.searchParams.get('cursor')||'';
 if(q.length<2||q.length>100||cursor.length>2048)return Response.json({error:'Enter a movie title between 2 and 100 characters.'},{status:400,headers});
 // Fixed query and fixed destination: visitors cannot submit arbitrary GraphQL.
 const query=`query { mainSearch(first: 12${cursor?', after: '+JSON.stringify(cursor):''}, options: {searchTerm: ${JSON.stringify(q)}, isExactMatch: false, type: TITLE, titleSearchOptions: {type: MOVIE}}) { edges {node {entity {... on Title {id titleText {text}}}}} pageInfo {endCursor hasNextPage} } }`;
 const body=JSON.stringify({query}),host='api-fulfill.dataexchange.us-east-1.amazonaws.com',date=new Date().toISOString().replace(/[:-]|\.\d{3}/g,''),day=date.slice(0,8),scope=day+'/us-east-1/dataexchange/aws4_request';
 const signed={'content-type':'application/json',host,'x-amz-date':date,'x-amzn-dataexchange-asset-id':env.IMDB_ASSET_ID,'x-amzn-dataexchange-data-set-id':env.IMDB_DATA_SET_ID,'x-amzn-dataexchange-revision-id':env.IMDB_REVISION_ID,'x-api-key':env.IMDB_API_KEY};
 if(env.IMDB_SESSION_TOKEN)signed['x-amz-security-token']=env.IMDB_SESSION_TOKEN;
 const names=Object.keys(signed).sort(),canonical=names.map(k=>k+':'+signed[k].trim()+'\n').join(''),signedNames=names.join(';');
 const canonicalRequest=['POST','/v1','',canonical,signedNames,await digest(body)].join('\n');
 const toSign=['AWS4-HMAC-SHA256',date,scope,await digest(canonicalRequest)].join('\n');
 try{
 let key=await hmac('AWS4'+env.IMDB_SECRET_ACCESS_KEY,day);key=await hmac(key,'us-east-1');key=await hmac(key,'dataexchange');key=await hmac(key,'aws4_request');
 signed.Authorization=`AWS4-HMAC-SHA256 Credential=${env.IMDB_ACCESS_KEY_ID}/${scope}, SignedHeaders=${signedNames}, Signature=${hex(await hmac(key,toSign))}`;
 const response=await fetch('https://'+host+'/v1',{method:'POST',headers:signed,body,signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error('IMDb unavailable');
 const data=await response.json(),result=data.data?.mainSearch;
 if(data.errors?.length||!Array.isArray(result?.edges))throw new Error('Invalid IMDb result');
 const movies=result.edges.map(e=>e.node?.entity).filter(t=>/^tt[0-9]+$/.test(t?.id)&&t.titleText?.text).map(t=>({id:t.id,title:t.titleText.text,url:'https://www.imdb.com/title/'+t.id+'/'}));
 return Response.json({source:'IMDb',movies,nextCursor:result.pageInfo?.hasNextPage?result.pageInfo.endCursor:null},{headers});
 }catch{return Response.json({code:'unavailable',error:'IMDb search is temporarily unavailable. Browse our curated shelves or try again shortly.'},{status:503,headers})}
}
