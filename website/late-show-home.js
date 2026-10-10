import {currentIssue,movieById} from './late-show-data.js';
const title=document.querySelector('#lsHomeFeature'),note=document.querySelector('#lsHomeNote');
function render(){if(!title||!note)return;const issue=currentIssue(),a=movieById(issue.feature),b=movieById(issue.pair);title.textContent=a.title+' + '+b.title;note.textContent=issue.headline+' Official watch links, previews, and this week’s Midnight Lounge question.'}
render();setInterval(()=>{if(!document.hidden)render()},60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
