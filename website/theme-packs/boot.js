/* CYBERGRID web palette adapter, based on Cybercore Tech's public theme picker.
   Synchronous local boot restores the palette before first paint. */
(() => {
  const pack = window.cybercoreHalloween;
  if (!pack) return;
  const root = document.documentElement;
  const storageKey = 'cybercore-theme:neoncoffinvideo';
  const map = {bg:'--bg',white:'--white',acid_green:'--green',hot_pink:'--pink',purple:'--purple',cyan:'--cyan',orange:'--amber',panel:'--panel',line:'--line',muted:'--muted'};
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch { /* Private browsers can still use themes. */ }
  const requested = new URLSearchParams(location.search).get('theme');
  const valid = id => id === 'original' || pack.themes.some(theme => theme.id === id);
  const initial = valid(requested) ? requested : valid(saved) ? saved : 'original';
  function apply(id, persist = true) {
    const theme = pack.themes.find(theme => theme.id === id);
    if (id !== 'original' && !theme) return false;
    root.dataset.cybercoreTheme = id;
    if (theme) {
      root.dataset.halloweenTheme = id;
      root.dataset.themeEffect = theme.effect;
      Object.entries(map).forEach(([key, token]) => root.style.setProperty(token, '#' + theme.palette[key]));
      root.style.setProperty('--acid', '#' + theme.palette.acid_green);
      root.style.setProperty('--orange', '#' + theme.palette.orange);
    } else {
      delete root.dataset.halloweenTheme;
      delete root.dataset.themeEffect;
      Object.values(map).concat('--acid','--orange').forEach(token => root.style.removeProperty(token));
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme ? '#' + theme.palette.bg : '#100d17';
    if (persist) {
      try { localStorage.setItem(storageKey, id); } catch { /* Session-only selection is still applied. */ }
    }
    window.dispatchEvent(new CustomEvent('cybercore:themechange', {detail:{id, theme:theme || null}}));
    return true;
  }
  window.CybercoreThemes = {apply, pack, storageKey};
  apply(initial, false);
  window.addEventListener('storage', event => {
    if (event.key === storageKey && valid(event.newValue || 'original')) apply(event.newValue || 'original', false);
  });
})();
