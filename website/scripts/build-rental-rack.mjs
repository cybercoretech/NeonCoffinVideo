import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),app=readFileSync(new URL('app.js',root),'utf8');
const base=vm.runInNewContext(app.slice(0,app.indexOf('films.push('))+';films',{}, {timeout:1000});
const extra=JSON.parse(readFileSync(new URL('catalogue-extra.json',root),'utf8'));
const italian=vm.runInNewContext(readFileSync(new URL('italian-horror.js',root),'utf8')+';ncvItalianFilms',{}, {timeout:1000});
const sources=new Map(JSON.parse(readFileSync(new URL('artwork-sources.json',root),'utf8')).map(s=>[s.slug,s]));
const additions=JSON.parse(readFileSync(new URL('rental-rack-additions.json',root),'utf8'));
const excluded=new Set(['terminator','robocop','blade-runner']);
const byId=new Map([...base,...extra,...italian,...additions].map(m=>[m.id,m]));
const rack=[...byId.values()].filter(m=>m.year>=1980&&m.year<=1999&&!excluded.has(m.id)).map(m=>{
 const source=sources.get(m.id);
 if(!source?.local||source.local.endsWith('.svg')||!existsSync(new URL(source.local,root)))throw new Error('Real film cover missing: '+m.id);
 return {id:m.id,title:m.title,year:m.year,director:m.director,minutes:m.minutes||null,aisle:m.category,note:m.note,tag:m.tag||'FROM THE RENTAL SHELF',poster:'/'+source.local,posterSource:source.page,reference:m.reference||source.page};
}).sort((a,b)=>a.title.localeCompare(b.title));
if(rack.length<250)throw new Error('The rental rack needs at least 250 films.');
const names=new Set();for(const m of rack){const key=m.title.toLowerCase().replace(/[^a-z0-9]/g,'')+m.year;if(names.has(key))throw new Error('Duplicate title/year: '+m.title);names.add(key)}
writeFileSync(new URL('rental-rack-data.js',root),'// Generated from the shared NCV catalog and sourced rental selection.\nexport const rentalMovies='+JSON.stringify(rack)+';\n');
console.log('Rental rack: '+rack.length+' distinct 1980–1999 films with sourced posters.');
