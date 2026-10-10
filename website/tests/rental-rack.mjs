import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rentalMovies} from '../rental-rack-data.js';
import {rentalRackHTML,filterRentals,rackCategories} from '../late-show-rack.js';
assert(rentalMovies.length>=250,'at least 250 distinct 1980s/1990s rentals');
assert.equal(new Set(rentalMovies.map(m=>m.id)).size,rentalMovies.length);
const sources=new Map(JSON.parse(readFileSync(new URL('../artwork-sources.json',import.meta.url))).map(s=>[s.slug,s]));
for(const m of rentalMovies){
 assert(m.year>=1980&&m.year<=1999);assert(m.director&&m.note);
 assert(rackCategories.some(c=>c.id===m.aisle),'recognized horror category '+m.id);
 assert(!/\.svg$/.test(m.poster),'actual cover, not a placeholder '+m.id);
 assert(m.posterSource.startsWith('https://'));
 assert.equal(m.poster,'/'+sources.get(m.id).local);
 const bytes=readFileSync(new URL('..'+m.poster,import.meta.url));assert(bytes.length>3000);
 assert(bytes[0]===0xff&&bytes[1]===0xd8||bytes.subarray(1,4).toString()==='PNG'||bytes.subarray(0,4).toString()==='RIFF','raster image signature '+m.id);
}
// Independent known examples verify that search/filter semantics do not merely
// mirror a rendered list length. Inputs are escaped before inserting HTML.
assert.deepEqual(filterRentals(rentalMovies,{query:'scream'}).map(m=>m.title),['Scream','Scream 2']);
assert(filterRentals(rentalMovies,{category:'body'}).some(m=>m.title==='The Fly'));
assert(filterRentals(rentalMovies,{decade:'1990',query:'scream'}).length===2);
assert(filterRentals(rentalMovies,{decade:'1980',query:'scream'}).length===0);
assert.equal(filterRentals(rentalMovies,{query:'doesnotexist999'}).length,0);
const sorted=filterRentals(rentalMovies,{sort:'newest'});assert(sorted.every((m,i)=>i===0||sorted[i-1].year>=m.year));
const malicious={...rentalMovies[0],title:'<img onerror="boom">',note:'<script>bad</script>'};
const html=rentalRackHTML([malicious]);assert(!html.includes('<script>'));assert(html.includes('&lt;img'));assert(!html.includes('undefined'));assert(!html.includes('null MIN'));assert(!html.includes('WATCH ON TUBI'));
console.log('PASS: '+rentalMovies.length+' unique horror rentals, 1980–1999 dates, real local poster signatures/provenance, search/genre/decade/sort behavior and escaped copy.');
