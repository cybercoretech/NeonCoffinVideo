const statDetails = {
  views: {title: 'PAGE VIEWS', body: 'Counts homepage loads when this page records its anonymous counter request. Reloads count again. This is cumulative since tracking began, not a count of unique people. The counter stores only daily totals; it does not store visitor IDs, IP addresses, referrers, or campaign sources. Automated browsers that run the page scripts may also count.'},
  films: {title: 'CURATED TAPES', body: 'The number of titles in the curated rental catalog loaded on this page. It describes the catalog, not rentals, customers, or visits.'},
  members: {title: 'NIGHT CREATURES', body: 'Registered human community accounts. The automated Night Clerk account is excluded. This includes inactive accounts and does not mean those people are visiting now.'},
  discussions: {title: 'DISCUSSIONS', body: 'The number of topics opened in the Midnight Lounge. Replies add to Visible Posts, not to this count.'},
  posts: {title: 'VISIBLE POSTS', body: 'All discussion starters and replies that are currently visible. Posts hidden by moderators are excluded.'},
  reviews: {title: 'REVIEWS & BALLOTS', body: 'A combined total of stored movie reviews and Trioxin 245 poll ballots. Updating an existing review replaces that review; this is not a unique-person count.'}
};

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
  const detailDialog = root.querySelector('#statsDetail');
  if (detailDialog?.showModal) {
    const detailTitle = root.querySelector('#statsDetailTitle');
    const detailBody = root.querySelector('#statsDetailBody');
    const detailValue = root.querySelector('#statsDetailValue');
    root.querySelectorAll('[data-stat-info]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const detail = statDetails[trigger.dataset.statInfo];
        if (!detail) return;
        detailTitle.textContent = detail.title;
        detailBody.textContent = detail.body;
        detailValue.textContent = trigger.querySelector('strong')?.textContent || '—';
        detailDialog.showModal();
      });
    });
    root.querySelector('[data-stat-close]')?.addEventListener('click', () => detailDialog.close());
    detailDialog.addEventListener('click', event => {
      if (event.target === detailDialog) detailDialog.close();
    });
  }
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
