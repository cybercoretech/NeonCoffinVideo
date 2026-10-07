// Reads Google's downloaded OAuth JSON outside the website and passes secrets via stdin.
import {readFile} from 'node:fs/promises';import {spawn} from 'node:child_process';
const path=process.argv[2];if(!path)throw new Error('Usage: node scripts/configure-google.mjs /private/path/google-client.json');
const data=JSON.parse(await readFile(path,'utf8')),client=data.web;
if(!client?.client_id||!client.client_secret)throw new Error('Use a Google Web application OAuth client JSON.');
const callback='https://neoncoffinvideo.pages.dev/api/auth/callback';if(!client.redirect_uris?.includes(callback))throw new Error('Add the production callback URL to the OAuth client first.');
for(const [name,value] of [['GOOGLE_CLIENT_ID',client.client_id],['GOOGLE_CLIENT_SECRET',client.client_secret]]){
 await new Promise((resolve,reject)=>{const child=spawn('npx',['--yes','wrangler@4.147.0','pages','secret','put',name,'--project-name','neoncoffinvideo'],{stdio:['pipe','inherit','inherit']});child.stdin.end(value+'\n');child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error('Could not configure '+name)))})
}
console.log('Google credentials configured. Redeploy and test a real sign-in before opening registration.');
