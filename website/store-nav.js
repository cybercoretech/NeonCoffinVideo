const navToggle=document.querySelector('.menu-toggle');
const siteNav=document.querySelector('#primaryNavigation');
if(navToggle&&siteNav){
  const closeMenu=({restoreFocus=false}={})=>{
    siteNav.hidden=true;
    navToggle.setAttribute('aria-expanded','false');
    navToggle.setAttribute('aria-label','Open site navigation');
    if(restoreFocus)navToggle.focus();
  };
  const fitMenu=()=>{
    if(siteNav.hidden)return;
    const header=siteNav.closest('.header,.lounge-header');
    siteNav.style.top=(header.getBoundingClientRect().bottom-siteNav.parentElement.getBoundingClientRect().top+8)+'px';
    siteNav.style.maxHeight=Math.max(120,innerHeight-siteNav.getBoundingClientRect().top-12)+'px';
  };
  window.addEventListener('resize',fitMenu,{passive:true});
  window.addEventListener('scroll',fitMenu,{passive:true});
  navToggle.addEventListener('click',()=>{
    const open=navToggle.getAttribute('aria-expanded')!=='true';
    navToggle.setAttribute('aria-expanded',String(open));
    navToggle.setAttribute('aria-label',open?'Close site navigation':'Open site navigation');
    siteNav.hidden=!open;
    if(open)fitMenu();
  });
  siteNav.addEventListener('click',event=>{
    if(event.target.closest('button[data-open-rules]'))document.querySelector('#rules')?.addEventListener('close',()=>navToggle.focus(),{once:true});
    if(event.target.closest('a, button[data-open-help], button[data-open-themes], button[data-open-rules]'))closeMenu();
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!siteNav.hidden&&!document.querySelector('dialog[open]'))closeMenu({restoreFocus:true});
  });
  document.addEventListener('click',event=>{
    if(!siteNav.hidden&&!event.target.closest('.site-menu'))closeMenu();
  });
}
