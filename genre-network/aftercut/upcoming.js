(() => {
  const $ = (q) => document.querySelector(q);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cycle = 12 * 60 * 60 * 1000;
  const storeKey = 'aftercut-upcoming-cycle';
  const dataPromise = fetch('upcoming.json').then(r => { if (!r.ok) throw new Error('Release board unavailable'); return r.json(); });
  dataPromise.then(({items}) => {
    const feature = $('#upcomingFeature'), picks = $('#upcomingPicks'), video = $('#upcomingVideo');
    const videoHome = video?.parentElement;
    if (!feature || !picks || !Array.isArray(items) || !items.length) return;
    let slot; try { slot = JSON.parse(localStorage.getItem(storeKey) || '{}'); } catch { slot = {}; }
    const elapsed = Date.now() - (slot.at || 0);
    let leadIndex = (Number(slot.index) || 0) % items.length;
    if (slot.at && elapsed >= cycle) leadIndex = (leadIndex + Math.floor(elapsed / cycle)) % items.length;
    let rotationTimer;
    const dateLabel = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'}).toUpperCase();
    function draw(index, persist = true) {
      leadIndex = (index + items.length) % items.length;
      const film = items[leadIndex];
      feature.dataset.art = film.art;
      feature.innerHTML = `<div class="upcoming-art" aria-hidden="true"><span class="art-stamp">AFTERCUT<br>RELEASE WATCH</span><span class="art-index">${String(leadIndex + 1).padStart(2,'0')} / 05</span><b>${esc(film.mark)}</b><i></i><small>${dateLabel(film.date)} / ${esc(film.format)}</small></div><div class="upcoming-copy"><span class="upcoming-date">${dateLabel(film.date)} <b>·</b> ${esc(film.format)}</span><p class="upcoming-tagline">${esc(film.tagline)}</p><h3>${esc(film.title)}</h3><p>${esc(film.copy)}</p><div class="upcoming-actions">${film.trailer ? `<button class="button button-red" data-upcoming-trailer="${esc(film.trailer)}">▶ PLAY OFFICIAL TRAILER</button>` : `<a class="button button-red" href="${esc(film.imdb)}" target="_blank" rel="noreferrer">${film.title === 'PARANORMAL ACTIVITY 8' ? 'TRACK RELEASE / IMDb ↗' : 'FILM DETAILS ↗'}</a>`}<a class="upcoming-imdb" href="${esc(film.imdb)}" target="_blank" rel="noreferrer">IMDb ↗</a><a class="upcoming-source" href="${esc(film.source)}" target="_blank" rel="noreferrer">${esc(film.sourceLabel)} ↗</a></div></div>`;
      picks.innerHTML = items.map((item, i) => `<button class="upcoming-pick ${i === leadIndex ? 'active' : ''}" data-upcoming-pick="${i}" data-art="${esc(item.art)}"><span>${String(i+1).padStart(2,'0')}</span><b>${esc(item.title)}</b><small>${dateLabel(item.date)}</small><i>${i === leadIndex ? 'ON DECK' : 'VIEW FILE'}</i></button>`).join('');
      if (videoHome && video.parentElement !== videoHome) videoHome.append(video);
      video.hidden = true; video.innerHTML = '';
      $('#upcomingNext').textContent = '12H CYCLE';
      if (persist) localStorage.setItem(storeKey, JSON.stringify({index:leadIndex, at:Date.now()}));
      picks.querySelectorAll('[data-upcoming-pick]').forEach(b => b.addEventListener('click', () => draw(Number(b.dataset.upcomingPick))));
      feature.querySelector('[data-upcoming-trailer]')?.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.upcomingTrailer;
        feature.querySelector('.upcoming-art').append(video);
        video.hidden = false;
        video.innerHTML = `<button class="upcoming-close" aria-label="Close trailer">×</button><iframe title="${esc(film.title)} official trailer" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
        video.querySelector('.upcoming-close').addEventListener('click', () => {video.hidden = true; video.innerHTML = '';});
      });
    }
    draw(leadIndex, false);
    const wait = cycle - (elapsed % cycle);
    rotationTimer = setTimeout(() => { draw(leadIndex + 1); setInterval(() => draw(leadIndex + 1), cycle); }, wait);
    window.addEventListener('pagehide', () => { clearTimeout(rotationTimer); });
  }).catch(() => {
    const feature = $('#upcomingFeature');
    if (feature) feature.textContent = 'The release feed could not be loaded. Try refreshing the page.';
  });
  $('#crystalTrailerPlay')?.addEventListener('click', () => {
    const box = $('#crystalVideo'), panel = $('.crystal-art');
    panel.classList.add('is-playing');
    box.hidden = false;
    box.innerHTML = `<iframe title="Crystal Lake official Peacock trailer" src="https://www.youtube-nocookie.com/embed/Rs49eRHFD9c?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><button class="crystal-video-close" aria-label="Stop Crystal Lake trailer">×</button>`;
    box.querySelector('button').addEventListener('click', () => {box.hidden = true; box.innerHTML = ''; panel.classList.remove('is-playing');});
  });
})();
