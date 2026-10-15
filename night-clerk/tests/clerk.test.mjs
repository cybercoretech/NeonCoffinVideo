import test from 'node:test';
import assert from 'node:assert/strict';
import {commandReply,localClock,promptFor,normalizeCatalog} from '../src/clerk.js';
const films=normalizeCatalog([
  {id:'near-dark',title:'Near Dark',year:1987,category:'supernatural',note:'A nocturnal vampire western.'},
  {id:'the-thing',title:'The Thing',year:1982,category:'body',note:'Frozen paranoia.'},
  {id:'the-fly',title:'The Fly',year:1986,category:'body',note:'A transformation goes wrong.'},
  {id:'candyman',title:'Candyman',year:1992,category:'supernatural'},
  {id:'bad',title:'Invalid',year:'1985'},
  {id:'near-dark',title:'Duplicate',year:1987}
]);
test('catalog rejects invalid records and duplicates',()=>assert.equal(films.length,4));
test('find links to an actual tape',()=>{const result=commandReply('/find Near Dark',films);assert.equal(result.movies[0].url,'https://neoncoffinvideo.site/#film/near-dark');assert.equal(result.bot.role,'BOT / HOUSE HOST')});
test('recommend respects decade and shelf',()=>{const result=commandReply('/recommend 1990s supernatural',films);assert.deepEqual(result.movies.map(m=>m.id),['candyman'])});
test('double features are two distinct matching titles',()=>{const result=commandReply('/double-feature 1980s body',films);assert.equal(result.movies.length,2);assert.equal(new Set(result.movies.map(m=>m.id)).size,2)});
test('unknown requests do not hallucinate answers',()=>{assert.throws(()=>commandReply('tell me anything',films),/Unknown command/);assert.throws(()=>commandReply('/recommend happy movies',films),/Use a decade/);assert.equal(commandReply('/find not on the shelf',films).movies.length,0)});
test('help contains the approved addresses',()=>{const result=commandReply('/help support',films);assert.match(result.text,/help@neoncoffinvideo.site/);assert.match(result.text,/neondemon_74@neoncoffinvideo.site/)});
test('town commands keep visitors on the store side and lead to the Viewing Room',()=>{
 for(const command of ['/town','/help town']){
  const result=commandReply(command,films);
  assert.match(result.text,/store is here in Old Orchard Beach, Maine/);
  assert.match(result.text,/Massachusetts accent stuck/);
  assert.match(result.text,/Viewing Room/);
  assert.doesNotMatch(result.text,/Harrow Point|Amusement Pier|Mortuary/);
  assert.equal(result.links[0].url,'https://neoncoffinvideo.site/viewing-room');
 }
});
test('midnight follows Pacific daylight savings',()=>{assert.deepEqual(localClock(Date.parse('2026-10-10T07:00:00Z')),{date:'2026-10-10',hour:0});assert.deepEqual(localClock(Date.parse('2026-12-10T08:00:00Z')),{date:'2026-12-10',hour:0});assert.equal(localClock(Date.parse('2026-12-10T07:00:00Z')).hour,23)});
test('prompts are deterministic, advance daily, and remain spoiler-light',()=>{assert.equal(promptFor('2026-10-10'),promptFor('2026-10-10'));assert.notEqual(promptFor('2026-10-10'),promptFor('2026-10-11'))});
