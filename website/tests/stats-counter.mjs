import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {startStatsCounter} from '../stats-counter.js';

const rootURL = new URL('../', import.meta.url);
const keys = ['views','films','members','discussions','posts','reviews'];
const elements = Object.fromEntries(keys.map(key => [key, {textContent:'—'}]));
const note = {textContent:'', dataset:{}};
const fields = {
  title: {textContent:''},
  body: {textContent:''},
  value: {textContent:''},
  link: {textContent:'',href:'',hidden:true},
  history: {hidden:true},
  summary: {innerHTML:''},
  heatmap: {innerHTML:''},
  months: {innerHTML:''}
};
const dialog = {
  opened:false,
  showModal(){this.opened=true},
  close(){this.opened=false},
  addEventListener(name, handler){this.listeners={...this.listeners,[name]:handler}}
};
const triggers = Object.fromEntries(keys.map(key => [key, {
  dataset:{statInfo:key},
  querySelector:() => elements[key],
  addEventListener(name, handler){this.clickHandler=handler}
}]));
const closeButton = {addEventListener(name,handler){this.clickHandler=handler}};
const root = {
  querySelector(selector){
    if(selector==='#statsNote') return note;
    if(selector==='#statsDetail') return dialog;
    if(selector==='#statsDetailTitle') return fields.title;
    if(selector==='#statsDetailBody') return fields.body;
    if(selector==='#statsDetailValue') return fields.value;
    if(selector==='#statsDetailLink') return fields.link;
    if(selector==='#viewsHistory') return fields.history;
    if(selector==='#viewsSummary') return fields.summary;
    if(selector==='#viewsHeatmap') return fields.heatmap;
    if(selector==='#viewsMonths') return fields.months;
    if(selector==='[data-stat-close]') return closeButton;
    const match=selector.match(/data-stat="(\w+)"/);
    return match ? elements[match[1]] : null;
  },
  querySelectorAll(selector){return selector==='[data-stat-info]'?Object.values(triggers):[]},
  addEventListener(){},
  removeEventListener(){}
};
const today=new Date(); today.setUTCHours(0,0,0,0);
const stamp=offset=>{const d=new Date(today);d.setUTCDate(d.getUTCDate()+offset);return d.toISOString().slice(0,10)};
let totals={views:314,members:2,discussions:15,posts:15,reviews:0,viewsByDay:[{day:stamp(-3),views:4},{day:stamp(-1),views:7},{day:stamp(0),views:2}],trackingStarted:stamp(-3)}, fail=false;
const methods=[];
const request=async(url,opts)=>{methods.push(opts.method);return Response.json(fail?{}:totals,{status:fail?503:200})};
const counter=startStatsCounter({filmCount:287,root,request});
try {
  await counter.ready;
  assert.deepEqual(Object.values(elements).map(e=>e.textContent),['314','287','2','15','15','0']);
  assert.equal(note.dataset.state,'ready');
  triggers.views.clickHandler();
  assert.equal(dialog.opened,true);
  assert.equal(fields.title.textContent,'PAGE VIEWS');
  assert.equal(fields.value.textContent,'314');
  assert.match(fields.body.textContent,/homepage loads/i);
  assert.match(fields.body.textContent,/not a count of unique people/i);
  assert.match(fields.body.textContent,/does not store visitor IDs/i);
  assert.equal(fields.history.hidden,false);
  assert.match(fields.summary.innerHTML,/SINCE TRACKING STARTED/);
  assert.match(fields.summary.innerHTML,/LAST 365 DAYS/);
  assert.match(fields.heatmap.innerHTML,/title=".*page views/);
  assert.notEqual(fields.months.innerHTML,'');
  assert.match(fields.summary.innerHTML,/13/);
  triggers.reviews.clickHandler();
  assert.equal(fields.title.textContent,'REVIEWS & BALLOTS');
  assert.match(fields.body.textContent,/Trioxin 245 poll ballots/);
  assert.equal(fields.link.href,'/community.html#reviewShortcut');
  assert.equal(fields.link.textContent,'Go to Reviews & Ballots ↗');
  assert.equal(fields.link.hidden,false);
  assert.equal(fields.history.hidden,true);
  triggers.films.clickHandler();
  assert.equal(fields.link.href,'/#shelves');
  assert.equal(fields.link.textContent,'Browse the Rental Shelves ↗');
  triggers.views.clickHandler();
  assert.equal(fields.link.hidden,true);
  closeButton.clickHandler();
  assert.equal(dialog.opened,false);
  totals.views=315; totals.posts=16; await counter.refresh(); assert.equal(elements.views.textContent,'315'); assert.equal(elements.posts.textContent,'16');
  fail=true; await counter.refresh(); assert.equal(elements.views.textContent,'—'); assert.equal(elements.films.textContent,'287'); assert.equal(note.dataset.state,'unavailable');
  fail=false; await counter.refresh(); assert.equal(elements.views.textContent,'315');
  totals.views='bad'; await counter.refresh(); assert.equal(elements.views.textContent,'—');
  const html=await readFile(new URL('index.html',rootURL),'utf8');
  for(const key of keys) assert.match(html,new RegExp(`data-stat-info="${key}"`),`${key} counter opens an accessible detail dialog`);
  assert.match(html,/aria-haspopup="dialog"/);
  assert.match(html,/id="viewsHeatmap"/);
  assert.match(await readFile(new URL('stats-counter.js',rootURL),'utf8'),/Browse the Rental Shelves/);
  assert.deepEqual(methods,['POST','GET','GET','GET','GET']);
  console.log('PASS: live totals, one anonymous homepage-view write, refresh and error behavior, and accessible detail popovers for all six stats.');
} finally { counter.stop(); }
