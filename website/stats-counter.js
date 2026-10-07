// A page load records one anonymous view. Refreshes only read existing totals.
export function startStatsCounter({filmCount, root = document, request = fetch, interval = 60000} = {}) {
  const note = root.querySelector('#statsNote');
  if (!note) return;
  const format = new Intl.NumberFormat();
  const keys = ['views', 'members', 'discussions', 'posts', 'reviews'];
  const render = (key, value) => {
    const el = root.querySelector(`[data-stat="${key}"]`);
    if (el) el.textContent = Number.isSafeInteger(value) && value >= 0 ? format.format(value) : '—';
  };
  render('films', filmCount);
  let pending = false;
  async function refresh(recordView = false) {
    if (pending) return;
    pending = true;
    try {
      const response = await request('/api/community/stats', {
        method: recordView ? 'POST' : 'GET', cache: 'no-store',
        signal: AbortSignal.timeout(10000),
        ...(recordView ? {headers: {'Content-Type': 'application/json'}, body: '{}', keepalive: true} : {})
      });
      if (!response.ok) throw new Error('Counter unavailable');
      const stats = await response.json();
      if (!keys.every(key => Number.isSafeInteger(stats[key]) && stats[key] >= 0)) throw new Error('Invalid totals');
      keys.forEach(key => render(key, stats[key]));
      note.textContent = 'DATABASE COUNTS REFRESH EVERY 60 SECONDS / ONE ANONYMOUS VIEW PER HOMEPAGE LOAD / NO VISITOR PROFILE';
      note.dataset.state = 'ready';
    } catch {
      keys.forEach(key => render(key, null));
      note.textContent = 'COUNTER TEMPORARILY UNAVAILABLE / RETRYING AUTOMATICALLY';
      note.dataset.state = 'unavailable';
    } finally { pending = false; }
  }
  const ready = refresh(true);
  const onVisible = () => { if (!root.hidden) refresh(); };
  const timer = setInterval(onVisible, interval);
  root.addEventListener('visibilitychange', onVisible);
  return {ready, refresh: () => refresh(), stop() { clearInterval(timer); root.removeEventListener('visibilitychange', onVisible); }};
}
