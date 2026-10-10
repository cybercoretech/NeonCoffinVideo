// Export the existing editorial records for the poster audit; no generated notes.
import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const base=vm.runInNewContext(app.slice(0,app.indexOf('films.push('))+';films',{}, {timeout:1000});
const extra=JSON.parse(readFileSync(new URL('../catalogue-extra.json',import.meta.url),'utf8'));
const italian=vm.runInNewContext(readFileSync(new URL('../italian-horror.js',import.meta.url),'utf8')+';ncvItalianFilms',{}, {timeout:1000});
writeFileSync('/tmp/ncv-existing-editorial.json',JSON.stringify([...base,...extra,...italian],null,2));
