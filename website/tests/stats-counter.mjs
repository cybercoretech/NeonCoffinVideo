import assert from 'node:assert/strict';
import {startStatsCounter} from '../stats-counter.js';
const elements = Object.fromEntries(['views','films','members','discussions','reviews'].map(k=>[k,{textContent:'—'}]));
const note={textContent:'',dataset:{}};
const root={querySelector:s=>s==='#statsNote'?note:elements[s.match(/"(\w+)"/)[1]],addEventListener(){},removeEventListener(){}};
let totals={views:114,members:1,discussions:5,reviews:0}, fail=false;
const methods=[];
const request=async(url,opts)=>{methods.push(opts.method);return Response.json(fail?{}:totals,{status:fail?503:200})};
const counter=startStatsCounter({filmCount:145,root,request});
try {
 await counter.ready;
 assert.deepEqual(Object.values(elements).map(e=>e.textContent),['114','145','1','5','0']);
 assert.equal(note.dataset.state,'ready');
 totals.views=115; await counter.refresh(); assert.equal(elements.views.textContent,'115');
 fail=true; await counter.refresh(); assert.equal(elements.views.textContent,'—'); assert.equal(elements.films.textContent,'145'); assert.equal(note.dataset.state,'unavailable');
 fail=false; await counter.refresh(); assert.equal(elements.views.textContent,'115');
 totals.views='bad'; await counter.refresh(); assert.equal(elements.views.textContent,'—');
 assert.deepEqual(methods,['POST','GET','GET','GET','GET']);
 console.log('PASS: real totals displayed, zero preserved, one view write, read-only refresh, failure and recovery, malformed totals rejected.');
} finally { counter.stop(); }
