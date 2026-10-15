(()=>{
 // The Night Manager's lines. Draft dialect: Massachusetts, worn low rasp.
 const vhsLines=[
  t=>`“${t}? That one’s out front on the shelves, kid. Rent it like a normal person.”`,
  t=>`“${t}. Good tape. Seen it a hundred times. Nobody watches those back here, though.”`,
  t=>`“You came all the way back here for ${t}? Suit yourself. That’s not the one you want.”`,
  t=>`“${t}’s been on that shelf since before you were born. Go on, put it back. Look to your right.”`
 ];
 const betaLine='“There it is. Only Beta in the store. Deck’s behind the TV, wired right in. Go ahead and sit down. I’ll keep the light on.”';
 const ejectLine='“Changed your mind? Wicked smart. Most don’t. It’ll be there next time.”';
 const $=id=>document.getElementById(id);
 const line=$('vrLine'),play=$('vrPlay'),screen=$('vrScreen'),osd=$('vrOsd'),beta=document.querySelector('[data-beta]');
 let n=0;
 document.querySelectorAll('.vr-vhs').forEach(tape=>tape.addEventListener('click',()=>{
  line.innerHTML='';const title=tape.dataset.title;
  line.append(vhsLines[n++%vhsLines.length](title)+' ');
  const a=document.createElement('a');a.href='/screening-room#rentals';a.textContent='Find it on the rental shelves ↗';line.append(a);
 }));
 beta?.addEventListener('click',()=>{
  line.textContent=betaLine;beta.setAttribute('aria-pressed','true');
  play.hidden=false;screen.classList.add('is-loaded');osd.textContent='BETA ▮▮';
  $('vrPlayButton').focus({preventScroll:true});play.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 });
 $('vrEject')?.addEventListener('click',()=>{
  play.hidden=true;screen.classList.remove('is-loaded');osd.textContent='';beta.removeAttribute('aria-pressed');line.textContent=ejectLine;beta.focus();
 });
 $('vrPlayButton')?.addEventListener('click',()=>{
  const fx=$('vrTransition');fx.classList.add('is-on');document.body.style.overflow='hidden';
  try{sessionStorage.setItem('hp-arrival',String(Date.now()))}catch{}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(()=>{location.href='/harrow-point'},reduced?700:2700);
 });
})();
