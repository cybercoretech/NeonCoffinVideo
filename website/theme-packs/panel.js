(() => {
  'use strict';
  const engine = window.CybercoreThemes;
  if (!engine) return;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paletteDots = theme => ['hot_pink','acid_green','cyan','purple'].map(key=>`<i style="--swatch:#${theme.palette[key]}" aria-hidden="true"></i>`).join('');
  // Each theme has a dedicated full-resolution wallpaper, not an atlas crop.
  function scene(theme, className) {
    return `<img class="${className}" src="${className==='ctp-scene' ? theme.art.preview : theme.art.src}" alt="" aria-hidden="true" decoding="async" width="${theme.art.width}" height="${theme.art.height}">`;
  }
  const triggers = [...document.querySelectorAll('[data-open-themes]')];
  let opener;
  const dialog = document.createElement('dialog');
  dialog.id = 'cybercoreThemePanel';
  dialog.className = 'cybercore-theme-panel';
  dialog.setAttribute('aria-labelledby','themePanelTitle');
  dialog.innerHTML = `<header class="ctp-heading"><div><p>CYBERCORE THEME PACKS <span>/ VOL. 01</span></p><h2 id="themePanelTitle">HALLOWEEN <em>COLLECTION.</em></h2><p class="ctp-intro">Eight films. Eight different nights. Choose the atmosphere.</p></div><button type="button" class="ctp-close" aria-label="Close theme panel">×</button></header>
    <div class="ctp-current"><span><i aria-hidden="true"></i> NOW SHOWING <strong id="ctpCurrent">Original Neon Coffin</strong></span><button type="button" class="ctp-reset">Restore original</button></div>
    <div class="ctp-grid" role="group" aria-label="Halloween themes">${engine.pack.themes.map((theme,index)=>`<button type="button" class="ctp-card" data-theme-id="${theme.id}" aria-pressed="false" style="--card-accent:#${theme.palette.hot_pink};--card-bg:#${theme.palette.bg}"><span class="ctp-art"><span class="ctp-scene-placeholder" data-scene="${theme.id}"></span><span class="ctp-number">0${index+1}</span><span class="ctp-selected" aria-hidden="true">✓ ACTIVE</span></span><span class="ctp-card-copy"><span class="ctp-movie">${escape(theme.movie)} <span>${theme.year}</span></span><strong>${escape(theme.name)}</strong><span class="ctp-description">${escape(theme.description)}</span><span class="ctp-swatches">${paletteDots(theme)}<span>APPLY THEME ↗</span></span></span></button>`).join('')}</div>
    <footer class="ctp-bottom"><label class="ctp-motion"><input type="checkbox" id="ctpMotion"><span>Atmospheric effects<small id="ctpMotionNote">Gentle motion. No sound.</small></span></label><div class="ctp-bottom-actions"><button type="button" id="ctpShare">Copy theme link</button><button type="button" class="ctp-view">View the store ↗</button></div><p class="ctp-status" id="ctpStatus" role="status" aria-live="polite"></p><p class="ctp-credit">Original atmosphere artwork · Film-inspired, independently created · <a href="https://cybercoretech.github.io/" target="_blank" rel="noopener noreferrer">Powered by Cybercore ↗</a></p></footer>`;
  document.body.append(dialog);
  const sceneHost = document.createElement('div');
  sceneHost.className = 'halloween-scene-host';sceneHost.setAttribute('aria-hidden','true');
  // Lounge wallpaper is permanent; only the storefront gets theme scenery.
  document.querySelector('.hero-bg')?.append(sceneHost);
  const effects = document.createElement('div');
  effects.className = 'halloween-atmosphere';effects.setAttribute('aria-hidden','true');
  effects.innerHTML = Array.from({length:12},(_,i)=>`<i style="--n:${i};--delay:-${i*2.7}s;--duration:${16+i%5*4}s;--left:${i*8.3}%"></i>`).join('');
  document.querySelector('.hero')?.append(effects);
  let effectsOn = true;
  try { effectsOn = localStorage.getItem('cybercore-effects:neoncoffinvideo') !== 'off'; } catch {}
  const motion = dialog.querySelector('#ctpMotion');
  function syncMotion() {
    root.dataset.themeMotion = effectsOn && !reduced.matches ? 'on' : 'off';
    motion.checked = effectsOn && !reduced.matches;
    motion.disabled = reduced.matches;
    dialog.querySelector('#ctpMotionNote').textContent = reduced.matches ? 'Reduced motion follows your device setting.' : 'Gentle motion. No sound.';
  }
  motion.addEventListener('change',()=>{
    effectsOn=motion.checked;
    try {localStorage.setItem('cybercore-effects:neoncoffinvideo',effectsOn?'on':'off');} catch {}
    syncMotion();
    // Keep the store's existing Atmosphere control in agreement.
    const control=document.querySelector('#toggleAtmosphere');
    if(control && (control.getAttribute('aria-pressed')==='true')!==effectsOn)control.click();
  });
  const atmosphereControl=document.querySelector('#toggleAtmosphere');
  if(atmosphereControl){
    if(!effectsOn && atmosphereControl.getAttribute('aria-pressed')==='true')atmosphereControl.click();
    atmosphereControl.addEventListener('click',()=>{
      effectsOn=atmosphereControl.getAttribute('aria-pressed')==='true';
      try {localStorage.setItem('cybercore-effects:neoncoffinvideo',effectsOn?'on':'off');} catch {}
      syncMotion();
    });
  }
  reduced.addEventListener('change',syncMotion);syncMotion();
  const setStatus = text => {dialog.querySelector('#ctpStatus').textContent=text;};
  function sync() {
    const id=root.dataset.cybercoreTheme;
    const theme=engine.pack.themes.find(item=>item.id===id);
    dialog.querySelector('#ctpCurrent').textContent=theme?.name || 'Original Neon Coffin';
    dialog.querySelectorAll('[data-theme-id]').forEach(card=>card.setAttribute('aria-pressed',String(card.dataset.themeId===id)));
    sceneHost.innerHTML=theme?scene(theme,'halloween-scene'):'';
    triggers.forEach(trigger => {trigger.title='Current theme: '+(theme?.name || 'Original Neon Coffin');});
  }
  function choose(id) {
    if(!engine.apply(id))return;
    const url=new URL(location.href);
    url.searchParams.delete('theme');
    history.replaceState(null,'',url);
    setStatus((engine.pack.themes.find(t=>t.id===id)?.name || 'Original Neon Coffin')+' applied.');
  }
  dialog.querySelectorAll('[data-theme-id]').forEach(card=>card.addEventListener('click',()=>choose(card.dataset.themeId)));
  dialog.querySelector('.ctp-reset').addEventListener('click',()=>choose('original'));
  triggers.forEach(trigger => trigger.addEventListener('click',()=>{opener=trigger;dialog.querySelectorAll('[data-scene]').forEach(host=>{const theme=engine.pack.themes.find(t=>t.id===host.dataset.scene);host.outerHTML=scene(theme,'ctp-scene');});dialog.showModal();document.body.classList.add('theme-panel-open');}));
  function close(){dialog.close();}
  dialog.querySelector('.ctp-close').addEventListener('click',close);
  dialog.querySelector('.ctp-view').addEventListener('click',close);
  dialog.addEventListener('close',()=>{document.body.classList.remove('theme-panel-open');(opener?.closest('[hidden]') ? document.querySelector('.menu-toggle') : opener)?.focus();});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
  dialog.querySelector('#ctpShare').addEventListener('click',async()=>{
    const url=new URL(location.href);url.searchParams.set('theme',root.dataset.cybercoreTheme || 'original');
    try {await navigator.clipboard.writeText(url.href);setStatus('Theme link copied.');}
    catch {setStatus('Copy this theme link: '+url.href);}
  });
  document.addEventListener('visibilitychange',()=>{root.dataset.themePageHidden=String(document.hidden);});
  window.addEventListener('cybercore:themechange',sync);
  const suggestion=engine.pack.themes.find(theme=>theme.id===engine.requestedTheme);
  if(suggestion && suggestion.id!==root.dataset.cybercoreTheme)setStatus('Shared link: '+suggestion.name+'. Choose its card to apply it; your current theme is unchanged.');
  sync();
})();
