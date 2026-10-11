#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import {homedir} from 'node:os';
const filename=process.env.NCV_CLERK_CONFIG||homedir()+'/.config/neon-coffin/night-clerk.env';
let saved={};try{saved=parseEnv(await readFile(filename,'utf8'))}catch(error){if(error.code!=='ENOENT')throw error}
const config={...saved,...process.env},base=new URL(config.NCV_CLERK_URL||'http://127.0.0.1:8787');
if(!['http:','https:'].includes(base.protocol)||(base.protocol==='http:'&&!['localhost','127.0.0.1'].includes(base.hostname)))throw new Error('Use HTTPS for a remote bot.');
const [action='help',...words]=process.argv.slice(2);
if(action==='help'&&!words.length){console.log('Night Manager\n\nclerk command "/recommend 1980s creatures"\nclerk command "/find Near Dark"\nclerk chat "Something like Near Dark"\nclerk ai-pause\nclerk ai-resume\nclerk health\nclerk status\nclerk pause\nclerk resume\nclerk run\n\nConfig: '+filename);process.exit(0)}
const routes={health:['/health','GET'],status:['/admin/status','GET'],pause:['/admin/pause','POST',{paused:true}],resume:['/admin/pause','POST',{paused:false}],run:['/admin/run','POST',{}],command:['/v1/command','POST',{command:words.join(' ')}],chat:['/v1/chat','POST',{message:words.join(' ')}],'ai-check':['/admin/ai/check','POST',{}],'ai-pause':['/admin/ai','POST',{paused:true}],'ai-resume':['/admin/ai','POST',{paused:false}]};
if(!routes[action])throw new Error('Unknown action. Run clerk help.');
const [path,method,body]=routes[action],headers={};
if(path.startsWith('/admin/')){if(!config.NCV_CLERK_ADMIN_TOKEN)throw new Error('Set NCV_CLERK_ADMIN_TOKEN in the private config.');headers.Authorization='Bearer '+config.NCV_CLERK_ADMIN_TOKEN}
if(body)headers['Content-Type']='application/json';
try{const result=await fetch(new URL(path,base),{method,headers,...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(40000)});const data=await result.json();if(!result.ok)throw new Error(data.error||'Request failed');console.log(JSON.stringify(data,null,2))}catch(error){console.error(error.message);process.exitCode=1}
