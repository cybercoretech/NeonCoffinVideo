// Shared markup generator: no framework or browser JavaScript required.
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = ({label, href}) => `<a href="${escape(href)}">${escape(label)} <span aria-hidden="true">↗</span></a>`;
export function renderGenreFooter(config) {
  const brand = config.logo
    ? `<a class="genre-footer-brand genre-footer-brand--logo" href="/" aria-label="${escape(config.name)} — home"><img class="genre-footer-logo" src="${escape(config.logo.src)}" width="${config.logo.width}" height="${config.logo.height}" alt="${escape(config.name)}" loading="lazy" decoding="async"><small>${escape(config.tagline)}</small></a>`
    : `<a class="genre-footer-brand" href="/"><img src="${escape(config.emblem)}" width="64" height="96" alt="" loading="lazy"><span>${escape(config.name)}<small>${escape(config.tagline)}</small></span></a>`;
  const network = config.network.map(site => link(site)).join('');
  const support = config.support.length ? `<section class="genre-footer-support"><p class="genre-footer-label">KEEP THE LIGHTS ON</p><h2>${escape(config.supportHeading)}</h2><p>${escape(config.supportText)}</p><div class="genre-footer-buttons">${config.support.map(link).join('')}</div></section>` : '';
  return `<footer class="genre-footer" data-genre-site="${escape(config.id)}" aria-label="${escape(config.name)} footer">
  <div class="genre-footer-inner"><div class="genre-footer-top">${brand}<span class="genre-footer-signoff">${escape(config.signoff)}</span></div>
  <div class="genre-footer-columns">${support}<nav aria-label="Genre network"><p class="genre-footer-label">THE GENRE NETWORK</p>${network}</nav><section><p class="genre-footer-label">AT THE COUNTER</p>${config.links.map(link).join('')}<a href="mailto:${escape(config.email)}">${escape(config.email)}</a></section></div>
  <div class="genre-footer-credits"><p>Original graphics. Photo attributions are credited in each profile and <a href="SOURCES.md">SOURCES.md</a>.</p><p>${escape(config.name)} <span aria-hidden="true">/</span> ${escape(config.creditLine)}</p></div></div></footer>`;
}
