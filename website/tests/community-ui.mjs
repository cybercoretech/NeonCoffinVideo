import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../community.html',import.meta.url),'utf8');
const required=['closeRules','rules','crewDialog','crewDialogTitle','crewDialogBio','crewDialogClose','ageGate','ageGateForm','ageGateStatus','ageConfirm','ageContinue','profileNav','googleLogin','nightPromptStart','nightPromptStatus','onlineMembers','presenceCount','presenceCaption','railTopics','tonightFeature','featurePoster','featureTitle','featureMeta','featureNote','featureCatalogLink','featureDiscuss','featurePrevious','featureNext','featureToggle','featureTimer','featureProgress'];
for(const id of required)assert(html.includes(`id="${id}"`),`Community page is missing #${id}`);
for(const id of ['the-mutilator','hardware','zombi-2','chud','near-dark'])assert(readFileSync(new URL('../community.js',import.meta.url),'utf8').includes(`id:"${id}"`),`Tonight’s Feature rotation is missing ${id}`);
assert.match(html,/community\.js\?v=20261007h/);
assert.match(html,/community\.css\?v=20261007f/);
console.log('PASS: Lounge startup hooks, side rail, membership, dialogs, and five-title feature rotation controls exist.');
