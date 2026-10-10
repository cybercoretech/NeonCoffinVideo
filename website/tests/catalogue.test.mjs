import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [extra, app, italian] = await Promise.all([
  readFile(path.join(root, 'catalogue-extra.json'), 'utf8').then(JSON.parse),
  readFile(path.join(root, 'app.js'), 'utf8'),
  readFile(path.join(root, 'italian-horror.js'), 'utf8'),
]);
const baseBlock = app.match(/const films=\[(.*?)\];/s)?.[1];
assert.ok(baseBlock, 'base catalogue data exists');
const records = [...baseBlock.matchAll(/\{id:'([^']+)'[^}]*title:'([^']+)'[^}]*year:(\d+)/g)]
  .map(([, id, title, year]) => ({id, title, year: Number(year)}));
records.push(...extra);
records.push(...[...italian.matchAll(/\{id:'([^']+)',title:'([^']+)',year:(\d+)/g)]
  .map(([, id, title, year]) => ({id, title, year: Number(year)})));
assert.equal(records.length, 287, 'public catalogue total is reflected in the tape counter');
const ids = new Set();
const titles = new Set();
for (const film of records) {
  assert.ok(!ids.has(film.id), `duplicate film id: ${film.id}`);
  ids.add(film.id);
  const key = film.title.toLowerCase().replace(/[^a-z0-9]/g, '') + film.year;
  assert.ok(!titles.has(key), `duplicate film title/year: ${film.title} (${film.year})`);
  titles.add(key);
  if (film.art) await access(path.join(root, 'assets', `${film.id}.${film.art}`));
}
for (const title of ['I Spit on Your Grave','Henry: Portrait of a Serial Killer','Satan’s Blood','Near Dark','Possession','The Hidden','Phenomena','A Nightmare on Elm Street 5: The Dream Child','Puppet Master II','Retro Puppet Master','The Silence of the Lambs','Ringu','The Faculty','Zombie']) {
  assert.ok(records.some(f => f.title === title), `requested title is in the public catalogue: ${title}`);
}
console.log('PASS: '+records.length+' unique public catalogue films, complete artwork paths, and requested titles.');
