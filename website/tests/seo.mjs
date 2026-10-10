import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rentalMovies} from '../rental-rack-data.js';
const root=new URL('../',import.meta.url);
const sitemap=readFileSync(new URL('sitemap.xml',root),'utf8');
assert.equal((sitemap.match(/<url>/g)||[]).length,3);
for(const [file,path] of [['index.html','/'],['community.html','/community'],['screening-room.html','/screening-room']]){
 const html=readFileSync(new URL(file,root),'utf8'),url='https://neoncoffinvideo.site'+path;
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1);assert(html.includes('rel="canonical" href="'+url+'"'));
 assert(html.includes('property="og:url" content="'+url+'"'));assert.match(html,/name="twitter:card" content="summary_large_image"/);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(schema.url,url);assert(!html.includes('AggregateRating'));
 assert(sitemap.includes('<loc>'+url+'</loc>'));
}
assert.match(readFileSync(new URL('robots.txt',root),'utf8'),/Sitemap: https:\/\/neoncoffinvideo\.site\/sitemap.xml/);
const html=readFileSync(new URL('screening-room.html',root),'utf8');
const rack=html.match(/<div id="lsRentalGrid" class="ls-rental-grid">([\s\S]*?)<\/div><!-- NCV RENTAL GRID END -->/)[1];
assert.equal((rack.match(/class="ls-rental-card"/g)||[]).length,rentalMovies.length);
for(const movie of rentalMovies){assert(rack.includes(movie.poster));assert(rack.includes(movie.posterSource.replace(/&/g,'&amp;').replace(/'/g,'&#39;')));assert(rack.includes(movie.id));}
console.log('PASS: canonical URLs, real structured metadata, social previews, sitemap coverage, and all 261 editorial rentals present without executing JavaScript.');
