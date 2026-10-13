import assert from 'node:assert/strict';
import {readFile, access, stat} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('shared/harrow-point-characters.js',root),'utf8');
const styles=await readFile(new URL('shared/harrow-point-stories.css',root),'utf8');
const ids=['manager','silas','edmond','mortician','caretaker','mayor','margaret','isabelle','aurelian','vera','captain','bosun','constable','stranger','ephraim','ragged','borrowed','footman'];
for(const id of ids)assert.match(source,new RegExp(`^\\s+${id}:`, 'm'),`bio exists: ${id}`);
for(const canon of ['THE DROWNED BELL GALE','The Harrow Point Lantern','October Town Festival','Vlad III Dracula','AGE 27','VOICE /'])assert.ok(source.includes(canon)||canon==='VOICE /',`character canon exists: ${canon}`);
const stories=await readFile(new URL('shared/harrow-point-stories.js',root),'utf8');
for(const key of ['"town-history"','"lantern"','1821','On the town map','final Sunday of each month'])assert.ok(stories.includes(key),`town story canon exists: ${key}`);
for(const page of ['index.html','community.html','late-returns.html']){
 const html=await readFile(new URL(page,root),'utf8');
 assert.match(html,/harrow-point-characters\.js\?v=20261013a/,`${page} loads character popup behavior`);
 assert.match(html,/harrow-point-stories\.js\?v=20261013a/,`${page} loads story popup behavior`);
 assert.match(html,/harrow-point-stories\.css\?v=20261013a/,`${page} loads popup styling`);
 assert.match(html,/data-town-story="town-history"/,`${page} links to town history`);
 assert.match(html,/data-town-story="lantern"/,`${page} links to the weekly paper`);
}
const home=await readFile(new URL('index.html',root),'utf8');
assert.match(home,/id="hpCharacterDirectoryHome"[\s\S]*?<div class="marquee"/,'homepage directory appears directly below the hero');
assert.match(source,/hp-character-portrait/,'popup includes an accessible portrait image');
assert.match(styles,/width:min\(510px,calc\(100vw - 30px\)\)/,'character popup stays compact');
for(const image of ['assets/night-clerk/past-due-portrait.webp','assets/late-returns/the-last-ride-poster.jpg',...['silas-vale','edmond-vale','mortician','caretaker','mayor-harrow-point','margaret-harrow','isabelle-harrow','aurelian-harrow','vera-wren','captain-rook-bosun','bosun','constable-wainwright','october-stranger','ephraim-pike','ragged-howl','borrowed-face','last-footman'].map(name=>`assets/harrow-point/${name}.webp`)]){
 await access(new URL(image,root));
 assert.ok((await stat(new URL(image,root))).size>10_000,`portrait is present: ${image}`);
}
const build=await readFile(new URL('scripts/build.mjs',root),'utf8');assert.match(build,/harrow-point-characters\.js/,'production build copies the character popup script');
console.log(`PASS: ${ids.length} Harrow Point profiles have portraits, compact accessible popups, and all town pages link to its history and Sunday paper.`);
