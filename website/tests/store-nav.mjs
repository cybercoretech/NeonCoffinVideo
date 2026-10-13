import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
const script=readFileSync(new URL('store-nav.js',root),'utf8');
const build=readFileSync(new URL('scripts/build.mjs',root),'utf8');
const menu=html.match(/<nav class="primary-navigation"[^>]*>(.*?)<\/nav>/s)?.[1];
assert.ok(menu,'the main site navigation exists');
const links=[...menu.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gs)];
const destinations=links.map(([,href])=>href);
assert.equal(destinations.length,15,'directory has one link for each top-level destination');
assert.equal(new Set(destinations).size,destinations.length,'menu does not repeat destinations');
assert.equal(destinations.filter(url=>url==='/late-returns').length,1,'Late Returns has one top-level menu link');
assert.equal(destinations.filter(url=>url==='/harrow-point').length,1,'Harrow Point town guide has one top-level menu link');
assert.equal(destinations.filter(url=>url==='/harrow-point-ledger').length,1,'Lantern archive has one top-level menu link');
assert.equal(destinations.filter(url=>url==='/hptv-13').length,1,'HPTV archive has one top-level menu link');
assert.match(html,/class="issue-motto">THE MONTHLY MIDNIGHT FILE/);
assert.match(html,/id="editionIssue">001/);
assert.match(html,/id="editionMonth">OCT 2026/);
assert.doesNotMatch(html,/class="opening-strip"|class="issue-live"/,'redundant announcement strips are removed');
assert.match(html,/href="#shelves"[^>]*>.*?Rental Shelves/s);
assert.match(html,/href="#vhs-culture"[^>]*>.*?VHS Culture/s);
assert.match(html,/aria-expanded="false" aria-controls="primaryNavigation"/);
assert.match(script,/event\.key==='Escape'/);
assert.match(script,/button\[data-open-help\].*button\[data-open-themes\]/);
assert.match(html,/store-nav\.css/);
assert.match(html,/store-nav\.js/);
assert.match(build,/'store-nav\.css','store-nav\.js'/);
const app=readFileSync(new URL('app.js',root),'utf8');
assert.match(app,/month-9/,'October begins issue 001');
console.log('PASS: the masthead is concise, the menu has unique destinations and a11y behavior, and its assets are built for production.');

for(const page of ['index.html','community.html']){
 const markup=readFileSync(new URL(page,root),'utf8');
 for(const action of ['data-open-help','data-open-themes'])assert(markup.includes(action),page+' has '+action);
 assert.match(markup,/store-nav\.js/);
}
for(const page of ['index.html','community.html','screening-room.html','late-returns.html'])assert.match(readFileSync(new URL(page,root),'utf8'),/href="\/late-returns"/);
