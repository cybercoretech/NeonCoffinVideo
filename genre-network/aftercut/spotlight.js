(() => {
  const data = window.AFTERCUT_FRONT_PAGE;
  const slides = data?.items;
  const hero = document.querySelector('.hero-current');
  if (!hero || !Array.isArray(slides) || slides.length !== 7) return;
  const $ = selector => hero.querySelector(selector);
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const content = $('#spotlightContent'), poster = $('#spotlightPoster');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer, paused = motion.matches, hovering = false;
  function stopTrailer() { $('#spotlightTrailerFrame').replaceChildren(); $('#spotlightTrailer').hidden = true; }
  function updatePause() { const button = $('#spotlightPause'); button.textContent = paused ? '▶' : 'Ⅱ'; button.setAttribute('aria-label',paused ? 'Resume slideshow' : 'Pause slideshow'); button.setAttribute('aria-pressed',String(paused)); }
  function restart() { clearInterval(timer); if (!paused && !hovering && !document.hidden) timer = setInterval(() => mount(current + 1),60000); }
  function play(id) {
    stopTrailer();
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    frame.title = `${slides[current].title} official trailer`;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;
    $('#spotlightTrailerFrame').append(frame); $('#spotlightTrailer').hidden = false;
    paused = true; updatePause(); restart(); $('#spotlightTrailerClose').focus();
  }
  function mount(index) {
    current = (index + slides.length) % slides.length;
    const film = slides[current], number = String(current + 1).padStart(2,'0');
    stopTrailer(); hero.dataset.slide = String(current); hero.dataset.kind = film.kind;
    $('.hero-bg').style.backgroundImage = `url("${film.bg}")`;
    poster.src = film.image; poster.alt = film.alt;
    content.innerHTML = `<div class="eyebrow"><span class="live-dot"></span> THE FRESH CUT / TOP 7 <span class="eyebrow-rule"></span><span id="spotlightCounter">${number} / 07</span></div><p class="hero-kicker"><span class="fresh-status fresh-status--${film.kind}">${esc(film.status)}</span> ${esc(film.dateLabel)}</p><h1>${film.lines.map((line,i)=>i===film.lines.length-1?`<em>${esc(line)}</em>`:esc(line)).join('<br>')}<span class="title-dot">.</span></h1><p class="hero-tagline">${esc(film.tag)}</p><p class="hero-copy">${esc(film.copy)}</p><div class="hero-cta"><a class="button button-red" href="${esc(film.source)}" target="_blank" rel="noopener noreferrer">${film.kind==='news'?'READ THE REPORT':'READ FILM DETAILS'} ↗</a>${film.trailer?'<button class="button button-glass" id="spotlightPlay" type="button">▶ PLAY TRAILER</button>':'<a class="button button-glass" href="#cult-files">THE CULT FILES ↓</a>'}</div>`;
    $('#heroIndexNumber').textContent = number; $('#heroIndexTotal').textContent = '07';
    $('#spotlightArtCredit').textContent = film.artCredit;
    const research = [
      ['BD','SOURCE',film.source],
      ['IMDb','FILM SEARCH',`https://www.imdb.com/find/?q=${encodeURIComponent(film.title)}`],
      ['JW','AVAILABILITY',`https://www.justwatch.com/us/search?q=${encodeURIComponent(film.title)}`]
    ];
    $('#spotlightSources').innerHTML = research.map(([mark,label,url])=>`<a class="source-logo source-${mark==='BD'?'bloody':mark==='JW'?'justwatch':'imdb'}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)} for ${esc(film.title)}"><b>${mark}</b><span>${label}</span><i>↗</i></a>`).join('');
    $('#spotlightDots').innerHTML = slides.map((item,i)=>`<button type="button" aria-label="Show feature ${i+1}: ${esc(item.title)}" aria-pressed="${i===current}" class="${i===current?'active':''}" data-slide-to="${i}"></button>`).join('');
    $('#spotlightDots').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{mount(Number(button.dataset.slideTo));restart()}));
    $('#spotlightPlay')?.addEventListener('click',()=>play(film.trailer));
  }
  $('#spotlightPrev').addEventListener('click',()=>{mount(current-1);restart()});
  $('#spotlightNext').addEventListener('click',()=>{mount(current+1);restart()});
  $('#spotlightPause').addEventListener('click',()=>{paused=!paused;updatePause();restart()});
  function closeTrailer() { stopTrailer(); $('#spotlightPlay')?.focus(); }
  $('#spotlightTrailerClose').addEventListener('click',closeTrailer);
  hero.addEventListener('mouseenter',()=>{hovering=true;restart()});
  hero.addEventListener('mouseleave',()=>{hovering=false;restart()});
  document.addEventListener('visibilitychange',restart);
  motion.addEventListener('change',event=>{if(event.matches){paused=true;updatePause();restart()}});
  hero.addEventListener('keydown',event=>{
    if (event.key==='Escape'&&!$('#spotlightTrailer').hidden) { closeTrailer(); return; }
    if (!$('#spotlightTrailer').hidden || event.target.matches('input,textarea,select')) return;
    if (event.key==='ArrowRight'||event.key==='ArrowLeft') { event.preventDefault(); mount(current+(event.key==='ArrowRight'?1:-1)); restart(); }
  });
  window.addEventListener('pagehide',()=>clearInterval(timer));
  window.addEventListener('pageshow',restart);
  mount(0); updatePause(); restart();
})();
