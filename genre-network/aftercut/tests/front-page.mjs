import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url),context={window:{}};
runInNewContext(readFileSync(new URL('front-page.js',root),'utf8'),context);
const data=context.window.AFTERCUT_FRONT_PAGE;
assert.equal(data.items.length,7);
assert.equal(new Set(data.items.map(x=>x.id)).size,7);
assert.equal(data.items.filter(x=>x.kind==='news').length,2);
assert.equal(data.items.filter(x=>x.kind==='release').length,3);
assert.equal(data.items.filter(x=>x.kind==='upcoming').length,2);
for(const item of data.items){
 assert.match(item.source,/^https:\/\/bloody-disgusting\.com\/(db\/film|movie)\//);
 assert.match(item.date,/^\d{4}-\d{2}-\d{2}$/);
 assert(existsSync(new URL(item.image,root)),item.title+' artwork exists');
 if(item.kind==='news')assert.equal(item.trailer,null,'news does not invent a trailer');
 else assert.match(item.trailer,/^[A-Za-z0-9_-]{11}$/);
}
const library=JSON.parse(readFileSync(new URL('cult-files.json',root)));
assert.equal(library.length,7);
for(const film of library){assert(existsSync(new URL(film.poster,root)));assert(existsSync(new URL(film.bg,root)))}
const html=readFileSync(new URL('index.html',root),'utf8');
assert.equal((html.match(/class="cult-file"/g)||[]).length,7);
assert.equal((html.match(/id="cult-files"/g)||[]).length,1);
assert(html.indexOf('id="cult-files"')>html.indexOf('id="fresh-cut"'));
assert.match(html,/CHECKED OCT 09, 2026/);
for(const source of data.sources)assert(html.includes(source.url));
assert(html.indexOf('src="front-page.js')<html.indexOf('src="spotlight.js'));
console.log('PASS: seven unique source-linked features, explicit news/release statuses, valid assets/trailers and the original seven preserved below the front page.');
