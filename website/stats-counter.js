const statDetails = {
  views: {title: 'PAGE VIEWS', body: 'Counts homepage loads when this page records its anonymous counter request. Reloads count again. This is cumulative since tracking began, not a count of unique people. The counter stores only daily totals; it does not store visitor IDs, IP addresses, referrers, or campaign sources. Automated browsers that run the page scripts may also count.'},
  films: {title: 'CURATED TAPES', body: 'The number of titles in the curated rental catalog loaded on this page. It describes the catalog, not rentals, customers, or visits.', link: '/#shelves', linkLabel: 'Browse the Rental Shelves ↗'},
  members: {title: 'NIGHT CREATURES', body: 'Registered human community accounts. The automated Night Clerk account is excluded. This includes inactive accounts and does not mean those people are visiting now.', link: '/community.html', linkLabel: 'Visit the Midnight Lounge ↗'},
  discussions: {title: 'DISCUSSIONS', body: 'The number of topics opened in the Midnight Lounge. Replies add to Visible Posts, not to this count.', link: '/community.html', linkLabel: 'Open the discussions ↗'},
  posts: {title: 'VISIBLE POSTS', body: 'All discussion starters and replies that are currently visible. Posts hidden by moderators are excluded.', link: '/community.html', linkLabel: 'Read the Lounge ↗'},
  reviews: {title: 'REVIEWS & BALLOTS', body: 'A combined total of stored movie reviews and Trioxin 245 poll ballots. Updating an existing review replaces that review; this is not a unique-person count.', link: '/community.html#reviewShortcut', linkLabel: 'Go to Reviews & Ballots ↗'}
};

const utcDate = date => date.toISOString().slice(0, 10);
const number = value => new Intl.NumberFormat().format(value);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));

function curatedShelfMarkup(films, aisles) {
  if (!films.length) return '<p class="curated-empty">The tape records are unavailable. Try opening the shelves directly.</p>';
  const decades = new Map();
  const genres = new Map();
  for (const film of films) {
    if (Number.isInteger(film.year)) {
      const decade = `${Math.floor(film.year / 10) * 10}s`;
      decades.set(decade, (decades.get(decade) || 0) + 1);
    }
    if (film.category) genres.set(film.category, (genres.get(film.category) || 0) + 1);
  }
  const decadeRows = [...decades].sort(([a], [b]) => a.localeCompare(b)).map(([decade, count]) => `<div class="curated-breakdown-row"><span>${decade}</span><i><b style="width:${Math.round(count / films.length * 100)}%"></b></i><strong>${number(count)}</strong></div>`).join('');
  const genreNames = Object.fromEntries(aisles.map(aisle => [aisle.id, aisle.title]));
  const genreRows = [...genres].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 6).map(([genre, count]) => `<div class="curated-breakdown-row"><span>${escapeHTML(genreNames[genre] || genre)}</span><i><b style="width:${Math.round(count / films.length * 100)}%"></b></i><strong>${number(count)}</strong></div>`).join('');
  const day = Math.floor(Date.now() / 86400000);
  const pick = films[((day % films.length) + films.length) % films.length];
  const poster = pick.poster || `assets/${pick.id}.${pick.art || 'jpg'}`;
  const pickLink = `/?tape=${encodeURIComponent(pick.id)}#shelves`;
  return `<div class="curated-rental-card"><div><span>NEON COFFIN VIDEO / RENTAL RECORD</span><strong>${number(films.length)} TAPES IN THE VAULT</strong></div><small>NO MEMBERSHIP · NO LATE FEES · RETURN WHEN THE SUN COMES UP</small></div><div class="curated-breakdowns"><section><h3>THE RACK BY DECADE</h3>${decadeRows}</section><section><h3>THE RACK BY GENRE</h3>${genreRows}</section></div><article class="curated-staff-pick"><img src="/${escapeHTML(poster.replace(/^\//, ''))}" alt="${escapeHTML(pick.title)} poster" loading="lazy"><div><p class="eyebrow">TODAY’S ROTATING STAFF PICK</p><h3>${escapeHTML(pick.title)}</h3><p class="curated-staff-meta">${escapeHTML(pick.year)} · ${escapeHTML(genreNames[pick.category] || pick.category || 'CURATED RENTAL')}</p><p>${escapeHTML(pick.note || 'A hand-picked title from the rental rack. The Night Manager recommends keeping the lights on.')}</p><a href="${pickLink}">PULL THIS TAPE FROM THE RACK ↗</a></div></article>`;
}

function viewsHistoryMarkup(daily, trackingStarted) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 364);
  const counts = new Map(daily.map(row => [row.day, row.views]));
  const days = Array.from({length: 365}, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const day = utcDate(date);
    return {day, views: counts.get(day) || 0};
  });
  const tracked = day => trackingStarted && day.day >= trackingStarted;
  const trackedDays = days.filter(tracked);
  const age = trackedDays.length;
  const previous = days.slice(305, 335).filter(tracked).reduce((sum, day) => sum + day.views, 0);
  const recent = days.slice(335).filter(tracked).reduce((sum, day) => sum + day.views, 0);
  const busiest = trackedDays.reduce((best, day) => day.views > best.views ? day : best, {day: '—', views: 0});
  const change = recent - previous;
  const changeLabel = age >= 60 ? `${change >= 0 ? '+' : '−'}${number(Math.abs(change))} vs prior 30 days` : trackingStarted ? `Tracking began ${trackingStarted}` : 'No views recorded yet';
  const pad = new Date(start).getUTCDay();
  const cells = [...Array(pad).fill(null), ...days].map(day => {
    if (!day) return '<i class="views-cell views-cell-empty" aria-hidden="true"></i>';
    if (!tracked(day)) return '<i class="views-cell views-cell-untracked" aria-hidden="true"></i>';
    const level = day.views === 0 ? 0 : day.views < 3 ? 1 : day.views < 8 ? 2 : day.views < 20 ? 3 : 4;
    return `<i class="views-cell" data-level="${level}" title="${day.day}: ${number(day.views)} page view${day.views === 1 ? '' : 's'}"></i>`;
  }).join('');
  const months = days.reduce((labels, day, index) => {
    const month = day.day.slice(0, 7);
    if (index === 0 || days[index - 1].day.slice(0, 7) !== month) labels.push(`<span style="grid-column:${Math.floor((pad + index) / 7) + 1}">${new Date(`${day.day}T00:00:00Z`).toLocaleString('en-US', {month: 'short', timeZone: 'UTC'})}</span>`);
    return labels;
  }, []).join('');
  return {
    summary: `<span><strong>${number(recent)}</strong><small>${age < 30 ? 'SINCE TRACKING STARTED' : 'LAST 30 DAYS'}</small></span><span><strong>${changeLabel}</strong><small>${age >= 60 ? 'PERIOD CHANGE' : 'TRACKING HISTORY'}</small></span><span><strong>${number(busiest.views)}</strong><small>BUSIEST · ${busiest.day}</small></span><span><strong>${number(days.reduce((sum, day) => sum + (tracked(day) ? day.views : 0), 0))}</strong><small>LAST 365 DAYS</small></span>`,
    cells, months
  };
}

// A page load records one anonymous view. Refreshes only read existing totals.
export function startStatsCounter({filmCount, films = [], aisles = [], root = document, request = fetch, interval = 60000} = {}) {
  const note = root.querySelector('#statsNote');
  if (!note) return;
  const format = new Intl.NumberFormat();
  const keys = ['views', 'members', 'discussions', 'posts', 'reviews'];
  const render = (key, value) => {
    const el = root.querySelector(`[data-stat="${key}"]`);
    if (el) el.textContent = Number.isSafeInteger(value) && value >= 0 ? format.format(value) : '—';
  };
  render('films', filmCount);
  let dailyViews = [];
  const detailDialog = root.querySelector('#statsDetail');
  if (detailDialog?.showModal) {
    const detailTitle = root.querySelector('#statsDetailTitle');
    const detailBody = root.querySelector('#statsDetailBody');
    const detailValue = root.querySelector('#statsDetailValue');
    const detailLink = root.querySelector('#statsDetailLink');
    const history = root.querySelector('#viewsHistory');
    const summary = root.querySelector('#viewsSummary');
    const heatmap = root.querySelector('#viewsHeatmap');
    const curatedDetail = root.querySelector('#curatedDetail');
    root.querySelectorAll('[data-stat-info]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const key = trigger.dataset.statInfo;
        const detail = statDetails[key];
        if (!detail) return;
        detailTitle.textContent = detail.title;
        detailBody.textContent = detail.body;
        detailValue.textContent = trigger.querySelector('strong')?.textContent || '—';
        if (detail.link) {
          detailLink.href = detail.link;
          detailLink.textContent = detail.linkLabel;
          detailLink.hidden = false;
        } else detailLink.hidden = true;
        if (key === 'views') {
          const chart = viewsHistoryMarkup(dailyViews, trackingStarted);
          summary.innerHTML = chart.summary;
          heatmap.innerHTML = chart.cells;
          root.querySelector('#viewsMonths').innerHTML = chart.months;
          history.hidden = false;
        } else history.hidden = true;
        if (key === 'films') {
          curatedDetail.innerHTML = curatedShelfMarkup(films, aisles);
          curatedDetail.hidden = false;
        } else curatedDetail.hidden = true;
        detailDialog.showModal();
      });
    });
    root.querySelector('[data-stat-close]')?.addEventListener('click', () => detailDialog.close());
    detailDialog.addEventListener('click', event => {
      if (event.target === detailDialog) detailDialog.close();
    });
  }
  let pending = false;
  let trackingStarted = null;
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
      if (stats.viewsByDay !== undefined && (!Array.isArray(stats.viewsByDay) || !stats.viewsByDay.every(row => /^\d{4}-\d{2}-\d{2}$/.test(row.day) && Number.isSafeInteger(row.views) && row.views >= 0))) throw new Error('Invalid view history');
      if (stats.trackingStarted !== undefined && stats.trackingStarted !== null && !/^\d{4}-\d{2}-\d{2}$/.test(stats.trackingStarted)) throw new Error('Invalid tracking start');
      if (stats.viewsByDay) dailyViews = stats.viewsByDay;
      if (stats.trackingStarted !== undefined) trackingStarted = stats.trackingStarted;
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
