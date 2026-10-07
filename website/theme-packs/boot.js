/* CYBERGRID web palette adapter, based on Cybercore Tech's public theme picker.
   Synchronous local boot restores the palette before first paint. */
(() => {
  const pack = window.cybercoreHalloween;
  if (!pack) return;
  const root = document.documentElement;
  const storageKey = 'cybercore-theme:neoncoffinvideo';
  const map = {bg:'--bg',white:'--white',acid_green:'--green',hot_pink:'--pink',purple:'--purple',cyan:'--cyan',orange:'--amber',panel:'--panel',line:'--line',muted:'--muted'};
  const sessionKey = storageKey + ':tab';
  let saved, tabChoice;
  try { saved = localStorage.getItem(storageKey); } catch { /* Storage is optional. */ }
  try { tabChoice = sessionStorage.getItem(sessionKey); } catch { /* Storage is optional. */ }
  const requested = new URLSearchParams(location.search).get('theme');
  const valid = id => id === 'original' || pack.themes.some(theme => theme.id === id);
  // URLs suggest a theme; they never override an explicitly chosen appearance.
  // Pin this tab across reloads and main-site/Lounge navigation. Other tabs may
  // save their own preference, but cannot switch this tab's active theme.
  const initial = valid(tabChoice) ? tabChoice : valid(saved) ? saved : 'original';
  try { sessionStorage.setItem(sessionKey, initial); } catch {}
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
    if (meta) meta.content = theme ? '#' + theme.palette.bg : '#080d12';
    if (persist) {
      try { localStorage.setItem(storageKey, id); } catch {}
      try { sessionStorage.setItem(sessionKey, id); } catch {}
    }
    window.dispatchEvent(new CustomEvent('cybercore:themechange', {detail:{id, theme:theme || null}}));
    return true;
  }
  window.CybercoreThemes = {apply, pack, storageKey, requestedTheme: valid(requested) ? requested : null};
  apply(initial, false);
  // Deliberately do not subscribe to cross-tab storage updates.
})();
