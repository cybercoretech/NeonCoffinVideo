import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,chmodSync,existsSync} from 'node:fs';
import {homedir} from 'node:os';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const website=fileURLToPath(new URL('../',import.meta.url));
const bot=existsSync(website+'night-clerk/wrangler.jsonc')?website+'night-clerk/':fileURLToPath(new URL('../../night-clerk/',import.meta.url));
const cli=existsSync(bot+'node_modules/wrangler/bin/wrangler.js')?bot+'node_modules/wrangler/bin/wrangler.js':website+'node_modules/wrangler/bin/wrangler.js';
const account='f770e07e62b976b12330421edcf2a7d9',project='neoncoffinvideo';
function run(args,cwd=website,{capture=false}={}){
  const result=execFileSync(process.execPath,[cli,...args],{cwd,encoding:'utf8',stdio:capture?['ignore','pipe','pipe']:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});
  return result||'';
}
const user=run(['whoami'],website,{capture:true});
if(!user.includes(account))throw new Error('Cloudflare target account did not match.');
const projects=run(['pages','project','list'],website,{capture:true});
if(!projects.includes(project)||!projects.includes('neoncoffinvideo.site'))throw new Error('Expected Pages project was not found.');
console.log('Verified Cloudflare account and Neon Coffin Pages target.');
let config=JSON.parse(readFileSync(bot+'wrangler.jsonc','utf8'));
if(config.account_id!==account||config.name!=='neon-coffin-night-clerk')throw new Error('Bot configuration target did not match.');
const databases=JSON.parse(run(['d1','list','--json'],website,{capture:true}));
let database=databases.find(db=>db.name==='neon-coffin-night-clerk');
if(!database){
  const output=run(['d1','create','neon-coffin-night-clerk','--location','wnam','--no-update-config'],website,{capture:true});
  const match=output.match(/"database_id"\s*:\s*"([a-f0-9-]+)"/);
  if(!match)throw new Error('Could not read the newly created bot database ID.');
  database={uuid:match[1]};console.log('Created dedicated Night Clerk database.');
}
config.d1_databases[0].database_id=database.uuid;
writeFileSync(bot+'wrangler.jsonc',JSON.stringify(config,null,2)+'\n');
run(['d1','migrations','apply','neon-coffin-night-clerk','--remote','--config','wrangler.jsonc'],bot);
run(['d1','migrations','apply','neon-coffin-community','--remote'],website);
const privateDir=homedir()+'/.config/neon-coffin';mkdirSync(privateDir,{recursive:true,mode:0o700});chmodSync(privateDir,0o700);
const keysFile=privateDir+'/night-clerk-keys.json';
const keys=existsSync(keysFile)?JSON.parse(readFileSync(keysFile,'utf8')):{ADMIN_TOKEN:randomBytes(32).toString('hex'),LOUNGE_SIGNING_SECRET:randomBytes(32).toString('hex')};
if(!/^[a-f0-9]{64}$/.test(keys.ADMIN_TOKEN)||!/^[a-f0-9]{64}$/.test(keys.LOUNGE_SIGNING_SECRET))throw new Error('Invalid private credential file.');
writeFileSync(keysFile,JSON.stringify(keys)+'\n',{mode:0o600});chmodSync(keysFile,0o600);
const output=run(['deploy','--config','wrangler.jsonc','--secrets-file',keysFile],bot,{capture:true});
const url=output.match(/https:\/\/neon-coffin-night-clerk\.[a-z0-9-]+\.workers\.dev/);
if(!url)throw new Error('Could not read deployed bot address.');
console.log('Deployed standalone bot: '+url[0]);
if(process.argv.includes('--bot-only'))process.exit(0);
const pagesKeys=privateDir+'/night-clerk-pages-key.json';writeFileSync(pagesKeys,JSON.stringify({NIGHT_CLERK_SHARED_SECRET:keys.LOUNGE_SIGNING_SECRET})+'\n',{mode:0o600});chmodSync(pagesKeys,0o600);
run(['pages','secret','bulk',pagesKeys,'--project-name',project]);
const siteConfig=JSON.parse(readFileSync(website+'wrangler.jsonc','utf8'));siteConfig.vars.NIGHT_CLERK_URL=url[0];writeFileSync(website+'wrangler.jsonc',JSON.stringify(siteConfig,null,2)+'\n');
execFileSync('npm',['run','build'],{cwd:website,stdio:'inherit'});
run(['pages','deploy','dist','--project-name',project,'--branch','main']);
const privateEnv=privateDir+'/night-clerk.env';writeFileSync(privateEnv,'NCV_CLERK_URL='+url[0]+'\nNCV_CLERK_ADMIN_TOKEN='+keys.ADMIN_TOKEN+'\n',{mode:0o600});chmodSync(privateEnv,0o600);
console.log('Private CLI configuration saved with owner-only permissions.');
