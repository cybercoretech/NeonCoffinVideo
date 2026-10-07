(() => {
  'use strict';
  const root = document.documentElement;
  if (document.querySelector('.ncv-reading-progress')) return;
  const progress = document.createElement('div');
  progress.className = 'ncv-reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  const fill = document.createElement('span');
  progress.append(fill);
  document.body.append(progress);
  let queued = false;
  function updateProgress() {
    queued = false;
    const distance = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    fill.style.setProperty('--ncv-progress', distance ? Math.min(1, Math.max(0, scrollY / distance)) : 0);
  }
  function queueProgress() {
    if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
  }
  addEventListener('scroll', queueProgress, {passive:true});
  addEventListener('resize', queueProgress, {passive:true});
  // Catalogue, conversations, and member views can change page height after loading.
  if ('ResizeObserver' in window) new ResizeObserver(queueProgress).observe(document.body);
  updateProgress();
  function syncVisibility() { root.dataset.ncvPageVisible = String(!document.hidden); }
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
  const feature = document.querySelector('.tonight-feature');
  if (feature && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.dataset.fxVisible = String(entry.isIntersecting);
    }, {threshold:0}).observe(feature);
  }
  const pointer = matchMedia('(hover:hover) and (pointer:fine)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  document.querySelectorAll('.primary-navigation > a, .primary-navigation > button').forEach(item => {
    item.dataset.ncvPointer = '';
    item.addEventListener('pointermove', event => {
      if (!pointer.matches || reduced.matches || root.dataset.themeMotion !== 'on') return;
      const bounds = item.getBoundingClientRect();
      item.style.setProperty('--ncv-pointer-x', `${event.clientX-bounds.left}px`);
      item.style.setProperty('--ncv-pointer-y', `${event.clientY-bounds.top}px`);
    }, {passive:true});
    item.addEventListener('pointerleave', () => {
      item.style.removeProperty('--ncv-pointer-x'); item.style.removeProperty('--ncv-pointer-y');
    });
  });
})();
