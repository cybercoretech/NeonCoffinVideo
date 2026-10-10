(() => {
  'use strict';
  const dialog=document.createElement('dialog');
  dialog.id='nightClerkDialog';dialog.className='night-clerk-dialog';dialog.setAttribute('aria-labelledby','nightClerkTitle');
  dialog.innerHTML=`<header><div><p class="eyebrow">📼 THE COUNTER / BOT · HOUSE HOST</p><h2 id="nightClerkTitle">THE NIGHT CLERK</h2></div><button type="button" data-clerk-close aria-label="Close Night Clerk">×</button></header><p class="clerk-intro">Find your next late show. Picks come straight from our curated shelves.</p><div class="clerk-shortcuts"><button type="button" data-clerk-command="/recommend 1980s creatures">🦇 Creature feature</button><button type="button" data-clerk-command="/double-feature body">📼 Double feature</button><button type="button" data-clerk-command="/prompt">💀 Tonight’s question</button><button type="button" data-clerk-command="/help">❔ Help at the counter</button></div><form id="nightClerkForm"><label for="nightClerkCommand">Ask with a command</label><div class="clerk-input-row"><input id="nightClerkCommand" name="command" maxlength="200" placeholder="/find Near Dark" autocomplete="off" required><button type="submit">Ask ↗</button></div></form><p id="nightClerkStatus" role="status" aria-live="polite"></p><div id="nightClerkResponse" aria-live="polite"></div><footer>Automated catalog bot · No member messages or private profiles are sent to it.</footer>`;
  document.body.append(dialog);
  const input=dialog.querySelector('input'),form=dialog.querySelector('form'),status=dialog.querySelector('#nightClerkStatus'),output=dialog.querySelector('#nightClerkResponse');
  let pending=false;
  function node(tag,text,className){const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el}
  function link(label,value){const el=node('a',label);try{const url=new URL(value,location.origin);if(url.protocol==='https:'&&url.origin===location.origin){el.href=url.pathname+url.search+url.hash;if(url.pathname==='/community'&&url.hash.startsWith('#room/'))el.addEventListener('click',()=>dialog.close());else{el.target='_blank';el.rel='noopener noreferrer'}}else if(url.protocol==='mailto:')el.href=url.href;else if(url.protocol==='https:'&&url.hostname==='neoncoffinvideo.site'){el.href=url.href;el.target='_blank';el.rel='noopener noreferrer'}else return node('span',label)}catch{return node('span',label)}return el}
  async function ask(command){
    if(pending)return;pending=true;status.textContent='The clerk is checking the shelves…';form.querySelector('button').disabled=true;
    try{
      const res=await fetch('/api/community/bot/command',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({command}),signal:AbortSignal.timeout(20000)}),data=await res.json();
      if(!res.ok)throw new Error(data.error||'The clerk could not answer.');
      output.replaceChildren(node('h3',data.title),node('p',data.text,'clerk-answer'));
      for(const movie of data.movies||[]){const card=node('article','', 'clerk-tape');card.append(node('small',movie.genre+' / '+movie.year),node('h4',movie.title),node('p',movie.note||'Open the tape file for details.'),link('Open tape file ↗',movie.url));output.append(card)}
      for(const item of data.links||[])output.append(link(item.label+' ↗',item.url));
      if(data.command==='prompt'){const b=node('button','Answer in the Lounge ↗');b.type='button';b.onclick=()=>{dialog.close();window.dispatchEvent(new CustomEvent('night-clerk-prompt',{detail:{title:data.text.split('\n')[0],discussion:data.discussion||''}}));document.getElementById('nightPromptStart').click()};output.append(b)}
      status.textContent='Returned from the counter.';
    }catch(error){status.textContent=error.message;output.replaceChildren()}finally{pending=false;form.querySelector('button').disabled=false}
  }
  document.addEventListener('click',e=>{if(e.target.closest('[data-open-clerk]')){dialog.showModal();input.focus();if(!output.children.length)ask('/help')}const chip=e.target.closest('[data-clerk-command]');if(chip){input.value=chip.dataset.clerkCommand;ask(input.value)}});
  dialog.querySelector('[data-clerk-close]').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  form.addEventListener('submit',e=>{e.preventDefault();ask(input.value.trim())});
  fetch('/api/community/bot/command',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({command:'/prompt'}),signal:AbortSignal.timeout(20000)}).then(async r=>{if(!r.ok)return;const data=await r.json();document.getElementById('nightPromptTitle').textContent=data.text.split('\n')[0];window.dispatchEvent(new CustomEvent('night-clerk-prompt',{detail:{title:data.text.split('\n')[0],discussion:data.discussion||''}}))}).catch(()=>{});
})();
