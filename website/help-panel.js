(() => {
  'use strict';
  if (document.querySelector('.ncv-help-launch')) return;

  const launch = document.createElement('button');
  launch.type = 'button';
  launch.className = 'ncv-help-launch';
  launch.setAttribute('aria-haspopup', 'dialog');
  launch.setAttribute('aria-controls', 'ncvHelpPanel');
  launch.innerHTML = '<span class="ncv-help-mark" aria-hidden="true">?</span><span>HELP DESK<small>QUICK ANSWERS</small></span>';

  const dialog = document.createElement('dialog');
  dialog.id = 'ncvHelpPanel';
  dialog.className = 'ncv-help-panel';
  dialog.setAttribute('aria-labelledby', 'ncvHelpTitle');
  dialog.innerHTML = `<header class="ncv-help-heading">
    <div><p>NEON COFFIN VIDEO <span>/ THE HELP DESK</span></p><h2 id="ncvHelpTitle">NEED A HAND<br><em>AFTER DARK?</em></h2><p class="ncv-help-intro">Fast answers, the right contact, and a real person when you need one.</p></div>
    <button type="button" class="ncv-help-close" aria-label="Close help">×</button>
  </header>
  <section class="ncv-help-faq" aria-label="Frequently asked questions">
    <details><summary>What is Neon Coffin Video?</summary><p>An independent horror and cult-film site with movie discoveries, viewing guides, the Midnight Lounge, and a small merch shelf.</p></details>
    <details><summary>Where can I buy the merch?</summary><p>Shop the Neon Coffin Video merch shelf at Fourthwall. <a href="https://neon-coffin-video-shop.fourthwall.com/" target="_blank" rel="noopener noreferrer">Open the merch shop ↗</a></p></details>
    <details><summary>What are Theme Packs?</summary><p>Choose <strong>THEME PACKS</strong> at the lower right to preview and apply the Halloween atmospheres. Choose “Restore original” to return to the standard look.</p></details>
    <details><summary>How does the Midnight Lounge work?</summary><p>The Lounge is an adults-only (18+) place for horror discussions, reviews, and member movie shelves. Browsing is open; Google sign-in is required to post and save a member profile. Age is confirmed by self-attestation.</p><a href="/community">Visit the Midnight Lounge ↗</a></details>
    <details><summary>How do I report a problem?</summary><p>Email the help desk with the page address, what you expected, what happened, and your browser/device. A screenshot is useful when it shows the issue.</p><a href="mailto:help@neoncoffinvideo.site?subject=Neon%20Coffin%20Video%20site%20issue">Email help@neoncoffinvideo.site ↗</a></details>
    <details><summary>Does the site host or stream the movies?</summary><p>No. Viewing guides link to the listed services; playback happens on the provider’s own site or app.</p></details>
  </section>
  <section class="ncv-help-contacts" aria-label="Contact Neon Coffin Video">
    <p class="ncv-help-label">CONTACT THE NIGHT SHIFT</p>
    <a href="mailto:info@neoncoffinvideo.site"><span>General information</span><strong>info@neoncoffinvideo.site</strong><b>↗</b></a>
    <a href="mailto:help@neoncoffinvideo.site?subject=Neon%20Coffin%20Video%20site%20issue"><span>Site help &amp; issues</span><strong>help@neoncoffinvideo.site</strong><b>↗</b></a>
    <a href="mailto:neondemon_74@neoncoffinvideo.site"><span>Midnight Lounge questions</span><strong>neondemon_74@neoncoffinvideo.site</strong><b>↗</b></a>
  </section>
  <p class="ncv-help-foot">Original films belong to their respective creators. Stay curious. Be cool to each other.</p>`;

  document.body.append(launch, dialog);
  const closeButton = dialog.querySelector('.ncv-help-close');
  launch.addEventListener('click', () => dialog.showModal());
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => launch.focus());
})();
