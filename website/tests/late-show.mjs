import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {screenMovies,vaultTrailers,screeningArtwork,dispatchIssues,publishedIssues,currentIssue,screeningStart,pacificDay} from '../late-show-data.js';
import {dispatchRSS,issueCalendar,lateShow} from '../server/late-show.js';
import worker from '../_worker.js';
const group='https://groups.google.com/g/neon-coffin-midnight-dispatch';
assert.equal(new Set(screenMovies.map(m=>m.id)).size,screenMovies.length);
for(const movie of [...screenMovies,...vaultTrailers]){
 assert.equal(movie.poster,screeningArtwork[movie.id].poster);assert(movie.posterSource.startsWith('https://'));
 const bytes=readFileSync(new URL('..'+movie.poster,import.meta.url));assert(bytes.length>8000);assert.equal(bytes[0],0xff);assert.equal(bytes[1],0xd8,'film cover is a real JPEG');
}
for(const issue of dispatchIssues){assert(screenMovies.some(m=>m.id===issue.feature));assert(screenMovies.some(m=>m.id===issue.pair));assert.equal(new Date(issue.date+'T12:00:00Z').getUTCDay(),5)}
assert.equal(pacificDay(new Date('2026-10-16T06:59:59Z')),'2026-10-15');
assert.equal(currentIssue(new Date('2026-10-16T06:59:59Z')).id,'001');
assert.equal(currentIssue(new Date('2026-10-16T07:00:00Z')).id,'002');
assert.equal(publishedIssues(new Date('2026-10-09T06:59:59Z')).length,0);
assert.equal(publishedIssues(new Date('2026-11-06T07:59:59Z')).length,4);
assert.equal(publishedIssues(new Date('2026-11-06T08:00:00Z')).length,5);
assert.equal(screeningStart(dispatchIssues[0]).toISOString(),'2026-10-10T03:00:00.000Z');
assert.equal(screeningStart(dispatchIssues[4]).toISOString(),'2026-11-07T04:00:00.000Z');
const rss=dispatchRSS(new Date('2026-10-16T07:00:00Z'));
assert.equal((rss.match(/<item>/g)||[]).length,2);assert(rss.includes('issue/002'));assert(!rss.includes('issue/003'));
assert.match(dispatchRSS(new Date('2026-11-06T08:00:00Z')),/Fri, 06 Nov 2026 08:00:00 GMT/);
const ics=issueCalendar({...dispatchIssues[4],intro:'Escapes, semicolons; ampersands & — '.repeat(10)+'\nNext line'});
assert.match(ics,/DTSTART:20261107T040000Z/);assert.match(ics,/UID:late-show-005-2026-11-06@neoncoffinvideo.site/);assert.match(ics,/Escapes\\, semicolons\\;/);
assert(ics.split('\r\n').every(line=>Buffer.byteLength(line)<=75));
assert.equal(issueCalendar(dispatchIssues[0]),issueCalendar(dispatchIssues[0]),'stable calendar identifiers and timestamps');
for(const value of [undefined,'javascript:alert(1)','https://groups.google.com/u/2/g/test','https://groups.google.com/g/test?x=1','https://example.com/g/test']){
 const response=await lateShow(new Request('https://example.com/api/late-show/newsletter'),{NEWSLETTER_GROUP_URL:value});assert.deepEqual(await response.json(),{mode:'unavailable',groupURL:null});
}
const assetCalls=[];const env={NEWSLETTER_GROUP_URL:group,ASSETS:{fetch:request=>{assetCalls.push(request.url);return new Response('asset')}}};
let response=await worker.fetch(new Request('https://example.com/api/late-show/newsletter'),env);assert.deepEqual(await response.json(),{mode:'google-groups',groupURL:group});assert.equal(assetCalls.length,0);
response=await worker.fetch(new Request('https://example.com/api/late-show/newsletter',{method:'POST'}),env);assert.equal(response.status,405);
response=await worker.fetch(new Request('https://example.com/api/late-show/calendar?issue=future'),env);assert.equal(response.status,404);
response=await worker.fetch(new Request('https://example.com/api/late-show/rss'),env);assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/rss\+xml/);
response=await worker.fetch(new Request('https://example.com/api/late-show/calendar?issue=001'),env);assert.equal(response.status,200);assert.match(response.headers.get('content-disposition'),/2026-10-09\.ics/);
response=await worker.fetch(new Request('https://example.com/api/late-show/unknown'),env);assert.equal(response.status,404);
response=await worker.fetch(new Request('https://example.com/screening-room'),env);assert.equal(await response.text(),'asset');
const html=readFileSync(new URL('../screening-room.html',import.meta.url),'utf8');assert(!html.includes('type="email"'));assert.match(html,/Site membership does not subscribe you automatically/);
console.log('PASS: Friday publication boundaries, Pacific DST, valid folded calendars, RSS publication, safe Google Groups configuration, and production API routing.');
