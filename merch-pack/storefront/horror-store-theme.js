/* Adds presentation to verified native Fourthwall sections; retains their commerce controls. */
(() => {
 'use strict';
 const productPath='/products/neon-coffin-video-storefront-tee';
 const artSection='[data-section-id="fw-section-image-aa989e76-e858-4508-a153-3beb857d022b"]';
 function element(tag,className,html){const node=document.createElement(tag);node.className=className;node.innerHTML=html;return node;}
 function apply(){
  if(!document.querySelector('.header__logo')||!document.querySelector('.page__main'))return;
  document.body.classList.add('ncv-store');
  const header=document.querySelector('header.header');
  if(header&&!document.querySelector('.ncv-nightstrip')){
   header.after(element('div','ncv-nightstrip','<strong><i aria-hidden="true"></i> BAD MOVIES. GREAT NIGHTS.</strong><span>IN THE SPIRIT OF 1986</span>'));
  }
  const hero=document.querySelector(artSection),frame=hero?.querySelector('.container.wrapper');
  if(hero&&frame){
   hero.classList.add('ncv-hero');
   const artLink=hero.querySelector('a.image-section__image-container');
   if(artLink&&artLink.getAttribute('href')==='https://neoncoffinvideo.site/assets/storefront.png'){
    artLink.setAttribute('href',productPath);artLink.setAttribute('aria-label','Shop the Neon Coffin Video Storefront Tee');
   }
   const art=hero.querySelector('img.image-section__image');
   if(art){if(!art.alt)art.alt='The neon-lit Neon Coffin Video store beside a moonlit drive-in, reflected in rain-soaked pavement';art.loading='eager';art.fetchPriority='high';}
   if(!frame.querySelector('.ncv-hero-topline'))frame.prepend(element('div','ncv-hero-topline','<span>THE MIDNIGHT VIDEO STORE</span><span>OFFICIAL MERCH</span>'));
   if(!frame.querySelector('.ncv-hero-copy'))frame.append(element('div','ncv-hero-copy',
    '<p class="ncv-eyebrow">NEON COFFIN VIDEO / AFTER DARK</p><h2>OPEN AFTER DARK.<span>WEAR THE NIGHT.</span></h2><p>The video-store glow. The midnight monsters. Your next favorite horror tee.</p><a class="button button--primary" href="'+productPath+'">SHOP THE STOREFRONT TEE <span aria-hidden="true">&nbsp;↗</span></a><div class="ncv-rewind"><svg viewBox="0 0 26 18" fill="none" aria-hidden="true"><rect x="1" y="1" width="24" height="16" rx="2" stroke="currentColor"/><circle cx="7" cy="8" r="3" stroke="currentColor"/><circle cx="19" cy="8" r="3" stroke="currentColor"/><path d="M8 14h10M10 8h6" stroke="currentColor"/></svg><span>PLEASE REWIND YOUR NIGHTMARES.</span></div>'));
  }
  const release=document.querySelector('.featured-collection[data-section-id="fw-section-featured-collection-0"]');
  const row=release?.querySelector('.collection>.wrapper');
  if(release&&row&&release.querySelector('a.tile[href="'+productPath+'"]')){
   release.classList.add('ncv-release');row.classList.add('ncv-release-row');
   if(!row.querySelector('.ncv-collection-intro'))row.prepend(element('div','ncv-collection-intro',
    '<p class="ncv-eyebrow">THE MERCH SHELF / STOREFRONT TEE</p><h2>BRING THE GLOW.<span>KEEP THE NIGHT.</span></h2><p>Our neon-lit horror shop, built for the shirt: the moonlit marquee, the monsters in the windows, and the rain-soaked glow.</p><ul class="ncv-placement-list"><li><b>01</b> Storefront artwork on the front</li><li><b>02</b> Coffin-cassette sleeve detail</li><li><b>03</b> Neon Coffin Video back-neck detail</li></ul><p class="ncv-note">MADE TO ORDER / CHOOSE YOUR SIZE ON THE PRODUCT PAGE</p>'));
   const tile=release.querySelector('a.tile[href="'+productPath+'"]');
   if(tile&&!tile.querySelector('.ncv-tile-cta'))tile.append(element('span','ncv-tile-cta','<span>VIEW THE TEE / SELECT YOUR SIZE</span><span aria-hidden="true">↗</span>'));
   for(const image of release.querySelectorAll('img.tile__item'))if(!image.alt)image.alt=image.classList.contains('tile__item--1')?'Neon Coffin Video Storefront Tee, front garment mockup':'Neon Coffin Video Storefront Tee, alternate garment mockup';
  }
  const footer=document.querySelector('footer.footer');
  if(footer&&!footer.querySelector('.ncv-footer-brand'))footer.prepend(element('div','ncv-footer-brand',
   '<h2>BAD MOVIES.<span> GREAT NIGHTS.</span></h2><p>FROM THE VIDEO STORE TO YOUR CLOSET.</p><a href="https://neoncoffinvideo.site/">BACK TO THE VIDEO STORE <span aria-hidden="true">↗</span></a>'));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
