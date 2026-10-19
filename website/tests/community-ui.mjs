import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';

const html=readFileSync(new URL('../community.html',import.meta.url),'utf8');
const required=['closeRules','rules','crewDialog','crewDialogTitle','crewDialogBio','crewDialogClose','ageGate','ageGateForm','ageGateStatus','ageConfirm','ageContinue','profileNav','profileArea','googleLogin','nightPromptStart','nightPromptStatus','onlineMembers','presenceCount','presenceCaption','railTopics','tonightFeature','featurePoster','featureTitle','featureMeta','featureNote','featureCatalogLink','featureDiscuss','featurePrevious','featureNext','featureToggle','featureTimer','featureProgress','featureArtStamp'];
for(const id of required)assert(html.includes(`id="${id}"`),`Community page is missing #${id}`);
const script=readFileSync(new URL('../community.js',import.meta.url),'utf8');
const movies=JSON.parse(readFileSync(new URL('../movies.json',import.meta.url),'utf8'));
for(const id of ['the-mutilator','hardware','zombi-2','chud','near-dark']){
  assert(script.includes(`id:"${id}"`),`Tonight’s Feature rotation is missing ${id}`);
  const film=movies.find(movie=>movie.id===id);
  assert(film,`Tonight’s Feature ${id} is available to lounge discussions`);
  assert(film.poster&&existsSync(new URL(`../${film.poster}`,import.meta.url)),`Tonight’s Feature ${id} has local artwork`);
}
assert.match(html,/id="featureCatalogLink"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
assert.match(html,/id="featureArtLink"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
assert.match(html,/community\.js\?v=[a-z0-9-]+/);
assert.match(html,/automated-regulars\.js\?v=[a-z0-9-]+/);
for(const name of ['The Pale Archivist','Moth on the Lens','The Last Customer','Bellwether 13','Dead Channel'])assert(html.includes(name),`The automated regular roster includes ${name}`);
assert.match(html,/maximum of one may post a clearly labeled reply each night/);
assert.match(html,/community\.css\?v=[a-z0-9]+/);
assert.match(html,/Old Orchard Beach, Maine/);assert.doesNotMatch(html,/Harrow Point|data-town-story/);
const clerk=readFileSync(new URL('../night-clerk-ui.js',import.meta.url),'utf8');assert.equal((clerk.match(/data-clerk-command="\/town"/g)||[]).length,1);assert.match(clerk,/Viewing Room/);assert.doesNotMatch(clerk,/Harrow Point|#harrow-point/);
assert.match(script,/compressProfileImage/);assert.match(script,/profile-banner/);assert.match(script,/5\*1024\*1024/);assert.match(script,/maxStored=650000/);assert.match(script,/community\/reaction/);assert.match(script,/community\/subscription/);assert.match(script,/browserAlerts/);
console.log('PASS: Lounge startup hooks, side rail, membership, dialogs, and five-title feature rotation controls exist.');
