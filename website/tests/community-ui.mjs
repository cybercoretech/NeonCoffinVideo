import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../community.html',import.meta.url),'utf8');
const required=['closeRules','rules','crewDialog','crewDialogTitle','crewDialogBio','crewDialogClose','ageGate','ageGateForm','ageGateStatus','ageConfirm','ageContinue','profileNav','googleLogin','nightPromptStart','nightPromptStatus','onlineMembers','presenceCount','presenceCaption','railTopics'];
for(const id of required)assert(html.includes(`id="${id}"`),`Community page is missing #${id}`);
assert.match(html,/community\.js\?v=20261007g/);
assert.match(html,/community\.css\?v=20261007e/);
console.log('PASS: Lounge startup hooks and referenced sidebar, membership, rules, prompt, roster, and dialog controls exist in the page.');
