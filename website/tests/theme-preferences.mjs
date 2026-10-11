import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const boot=readFileSync(new URL('theme-packs/boot.js',root),'utf8');
const pack=JSON.parse(readFileSync(new URL('theme-packs/halloween.json',root),'utf8'));
const key='cybercore-theme:neoncoffinvideo';
const saved=new Map([[key,'halloween']]);
function tab(search='',session=new Map()){
 const listeners={},element={dataset:{},style:{setProperty(){},removeProperty(){}}};
 const storage=map=>({getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value))});
 const window={cybercoreHalloween:pack,dispatchEvent(){},addEventListener:(name,fn)=>{listeners[name]=fn}};
 const context=vm.createContext({window,document:{documentElement:element,querySelector:()=>({content:''})},localStorage:storage(saved),sessionStorage:storage(session),location:{search},URLSearchParams,CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail}}});
 vm.runInContext(boot,context);
 return {window,element,session,listeners};
}
const a=tab('?theme=hell-fest');
assert.equal(a.element.dataset.cybercoreTheme,'halloween','a theme URL cannot override the saved choice');
assert.equal(a.window.CybercoreThemes.requestedTheme,'hell-fest','shared URL is a suggestion available to the picker');
assert.equal(saved.get(key),'halloween','opening a shared URL never overwrites the preference');
const b=tab();b.window.CybercoreThemes.apply('hocus-pocus');
assert.equal(saved.get(key),'hocus-pocus','a deliberate choice is saved');
assert.equal(a.element.dataset.cybercoreTheme,'halloween','another tab cannot switch the current appearance');
assert.equal(a.listeners.storage,undefined,'no cross-tab theme-switch listener');
assert.equal(tab('',a.session).element.dataset.cybercoreTheme,'halloween','reload/navigation retains this tab’s choice');
a.window.CybercoreThemes.apply('sleepy-hollow');
assert.equal(tab('?theme=halloween',a.session).element.dataset.cybercoreTheme,'sleepy-hollow');
a.window.CybercoreThemes.apply('original');
assert.equal(tab('',a.session).element.dataset.cybercoreTheme,'original');
assert.equal(a.window.CybercoreThemes.apply('bad-id'),false);
const panel=readFileSync(new URL('theme-packs/panel.js',root),'utf8');
assert.doesNotMatch(panel,/querySelector\('\.lounge-hero'\)/,'theme scenery and atmosphere are never attached to the Lounge');
assert.doesNotMatch(panel,/halloween-haze/,'no generated haze layer');
const css=readFileSync(new URL('theme-packs/themes.css',root),'utf8');
assert.doesNotMatch(css,/\.lounge-backdrop|\.lounge-hero[\s.:]/,'theme styles cannot replace or veil the Lounge wallpaper');
for(const theme of pack.themes){assert.equal(theme.palette.bg,'080d12');assert.equal(theme.palette.panel,'101920');}
console.log('PASS: explicit theme choices persist per tab; old/shared URLs and other tabs cannot override them; Lounge scenery stays independent; panel backgrounds are neutral.');
