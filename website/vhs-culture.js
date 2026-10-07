(() => {
  const rail = document.getElementById('vhsTapeRail');
  if (!rail) return;
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-vhs-scroll]');
    if (!button) return;
    rail.scrollBy({ left: Number(button.dataset.vhsScroll) * rail.clientWidth * 0.82, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  rail.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      rail.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * rail.clientWidth * 0.75, behavior: 'smooth' });
    }
  });
})();
