const navToggle=document.querySelector('.menu-toggle');
const siteNav=document.querySelector('#primaryNavigation');
if(navToggle&&siteNav){
  const closeMenu=({restoreFocus=false}={})=>{
    siteNav.hidden=true;
    navToggle.setAttribute('aria-expanded','false');
    navToggle.setAttribute('aria-label','Open site navigation');
    if(restoreFocus)navToggle.focus();
  };
  navToggle.addEventListener('click',()=>{
    const open=navToggle.getAttribute('aria-expanded')!=='true';
    navToggle.setAttribute('aria-expanded',String(open));
    navToggle.setAttribute('aria-label',open?'Close site navigation':'Open site navigation');
    siteNav.hidden=!open;
  });
  siteNav.addEventListener('click',event=>{
    if(event.target.closest('a'))closeMenu();
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!siteNav.hidden)closeMenu({restoreFocus:true});
  });
  document.addEventListener('click',event=>{
    if(!siteNav.hidden&&!event.target.closest('.site-menu'))closeMenu();
  });
}
