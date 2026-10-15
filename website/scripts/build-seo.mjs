import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {rentalMovies} from '../rental-rack-data.js';
import {rentalRackHTML,rentalFiltersHTML} from '../late-show-rack.js';
import {genrePages,genreNavHTML,genrePageHTML} from '../genre-seo-pages.js';
const root=new URL('../',import.meta.url),origin='https://neoncoffinvideo.site';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pages=[
 {file:'index.html',path:'/',title:'80s & 90s Cult Horror + Original Shorts | Neon Coffin Video',description:'Explore 1980s and 1990s cult horror, VHS culture, and Neon Coffin’s original illustrated horror-comic shorts, plus double features, trailers, and fan discussions.',image:'/assets/storefront.png',width:1672,height:940,type:'WebSite'},
 {file:'screening-room.html',path:'/screening-room',title:'The Late Show: Cult Horror Picks & Trailers | Neon Coffin Video',description:'Find your next cult horror rental: Tubi movie links, official trailers on the NCV screen, Friday double bills, and The Midnight Dispatch.',image:'/assets/store/neon-coffin-video-storefront.webp',width:720,height:900,type:'CollectionPage'},
 {file:'late-returns.html',path:'/late-returns',title:'Late Returns: Original Horror Shorts | Neon Coffin Video',description:"Watch original illustrated horror-comic shorts from Neon Coffin Video. Stream Be Kind. Rewind. and Tape 002, The Last Ride, set at a haunted seaside amusement pier.",image:'/assets/late-returns/be-kind-rewind-poster.jpg',imageAlt:'A collector loads an unmarked VHS while a shadow watches from the television',width:1920,height:1080,type:'CollectionPage',videos:[
  {id:'be-kind-rewind',name:'Be Kind. Rewind. | Late Returns Tape 001 | Neon Coffin Video',description:"An original illustrated horror-comic short about an unmarked videotape showing someone walking through a collector's house.",poster:'/assets/late-returns/be-kind-rewind-poster.jpg',date:'2026-10-10',path:'/assets/late-returns/be-kind-rewind-1080p.mp4',embed:'/late-returns#be-kind-rewind',width:1920,height:1080,sameAs:['https://www.youtube.com/shorts/BLqRanv3hOI']},
  {id:'the-last-ride',name:'The Last Ride | Late Returns Tape 002 | Neon Coffin Video',description:"The complete widescreen illustrated horror-comic short set at a haunted seaside amusement pier, where each appearance by the eerie young carnival leader Silas Vale is followed by another teen's disappearance.",poster:'/assets/late-returns/the-last-ride-poster.jpg',date:'2026-10-11',path:'/assets/late-returns/the-last-ride-1080p.mp4',embed:'/late-returns#the-last-ride',width:1920,height:1080}
 ]},
 {file:'community.html',path:'/community',title:'The Midnight Lounge: Horror Movie Community | Neon Coffin Video',description:'Join the 18+ Midnight Lounge for cult horror discussions, member movie shelves, reviews, and Friday night double features.',image:'/assets/storefront.png',width:1672,height:940,type:'CollectionPage'},
 {file:'harrow-point.html',path:'/harrow-point',title:'Harrow Point, Maine: Town History & Residents',description:'Explore Harrow Point, Maine: its landmarks, strange history, and residents in a town that seems to have appeared fully formed.',image:'/assets/harrow-point/harrow-point-town-hall-background-v001.webp',imageAlt:'Harrow Point residents gathered at the old town hall at night',width:1920,height:1080,type:'CollectionPage'},
 {file:'viewing-room.html',path:'/viewing-room',title:'The Viewing Room | Neon Coffin Video',description:'The back room at Neon Coffin Video in Old Orchard Beach, Maine: a dirty green sofa, a 1950s console TV hard-wired to a Betamax deck, and the only Betamax tape on the shelf.',image:'/assets/viewing-room/viewing-room-v001.webp',imageAlt:'The Viewing Room at Neon Coffin Video: a green sofa facing an old console TV wired to a Betamax deck',width:1672,height:941,type:'WebPage'},
 {file:'harrow-point-ledger.html',path:'/harrow-point-ledger',title:'The Harrow Point Undertow',description:'The Harrow Point Undertow, the weekly Sunday paper of Harrow Point, Maine: harbor news, town notices, missing travelers, In the Margins, and pressman Ephraim Pike.',image:'/assets/harrow-point/ephraim-pike-press-background-v001.webp',imageAlt:'Ephraim Pike pulling the bar of an old hand press in a dark harbor print shop at night',width:1672,height:941,type:'WebPage'},
 {file:'hptv-13.html',path:'/hptv-13',title:'HPTV Channel 13 / WHP-TV Station Archive',description:'Visit HPTV Channel 13, Harrow Point’s decaying local station. Meet host Marlow Vane and the phantom camera crew known as the Blackbacks.',image:'/assets/late-show/hptv-harrow-point-station-v002.webp',imageAlt:'A salt-weathered Harrow Point town marker and WHP-TV Channel 13 sign above the fogbound coast',width:1672,height:941,type:'WebPage'},
 ...genrePages
];
const footerConfig=JSON.parse(await readFile(new URL('shared/footer-config.json',root),'utf8'));
const {renderGenreFooter}=await import('../shared/genre-footer.mjs');
const lateReturns=await readFile(new URL('late-returns.html',root),'utf8');
const siteMenu=lateReturns.match(/<div class="site-menu">[\s\S]*?<\/nav><\/div>/)[0];
const stamp=(lateReturns.match(/store-nav\.css\?v=([a-z0-9]+)/)||[])[1]||'1';
const membershipIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7v5c0 4.6 3.2 7.5 8 9 4.8-1.5 8-4.4 8-9V7l-8-4Z"/><circle cx="12" cy="10" r="2.3"/><path d="M7.8 17c.9-2 2.3-3 4.2-3s3.3 1 4.2 3"/></svg>';
const collectionChrome={
 head:['styles.css','store-nav.css','rental-counter.css','help-panel.css','theme-packs/themes.css','theme-packs/panel.css','shared/genre-footer.css'].map(file=>`<link rel="stylesheet" href="/${file}?v=${stamp}">`).join(''),
 top:`<a class="skip" href="#collection">Skip to the films</a><div class="issue-strip"><span class="issue-motto">THE HORROR VAULT / 1980–1999</span><span class="issue-brand"><strong>NCV / THE HORROR VAULT</strong><i aria-hidden="true">///</i><span>BAD MOVIES. GREAT NIGHTS.</span></span></div><header class="header collection-header"><a class="brand brand--logo" href="/" aria-label="Neon Coffin Video home"><img class="header-logo" src="/assets/branding/neon-coffin-video-logo.webp" width="2067" height="761" alt="Neon Coffin Video"><small class="brand-page-label">THE HORROR VAULT</small></a><div class="collection-header-actions"><a id="lrMembership" class="site-membership-button header-control" href="/community#profile">${membershipIcon}<span id="lrMembershipLabel">Membership</span></a><button id="lrLogout" class="header-control" type="button" hidden>Sign out</button>${siteMenu}</div></header>`,
 footer:renderGenreFooter(footerConfig),
 scripts:['theme-packs/catalogue.js','theme-packs/boot.js','theme-packs/panel.js','help-panel.js','store-nav.js','late-returns-account.js'].map(file=>`<script src="/${file}?v=${stamp}" defer></script>`).join('')
};
for(const page of pages){
 const file=new URL(page.file,root);let html=page.id?genrePageHTML(page,collectionChrome):await readFile(file,'utf8');
 if(page.id)await mkdir(new URL('.',file),{recursive:true});
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(page.title)}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(page.description)}">`);
 html=html.replace(/^[ \t]*<link rel="canonical"[^>]*>[ \t]*\r?\n?/gm,'').replace(/<!-- NCV SEO START -->[\s\S]*?<!-- NCV SEO END -->\r?\n?/g,'');
 const schema={'@context':'https://schema.org','@type':page.type,'@id':origin+page.path+'#page',url:origin+page.path,name:page.title,description:page.description,inLanguage:'en',publisher:{'@type':'Organization',name:'Neon Coffin Video',url:origin+'/',logo:origin+'/assets/branding/neon-coffin-video-logo.png',sameAs:['https://www.youtube.com/@neoncoffinvideo']}};
 if(page.type!=='WebSite')schema.isPartOf={'@type':'WebSite',name:'Neon Coffin Video',url:origin+'/'};
 let structured=schema;
 if(page.videos){
  const videoObjects=page.videos.map(video=>({'@type':'VideoObject','@id':origin+page.path+'#'+video.id,url:origin+page.path,name:video.name,description:video.description,inLanguage:'en',publisher:schema.publisher,thumbnailUrl:origin+video.poster,uploadDate:video.date,duration:'PT2M',contentUrl:origin+video.path,embedUrl:origin+video.embed,encodingFormat:'video/mp4',width:video.width,height:video.height,partOfSeries:{'@type':'CreativeWorkSeries',name:'Late Returns',url:origin+page.path},...(video.sameAs?{sameAs:video.sameAs}:{}),isPartOf:{'@type':'WebSite',name:'Neon Coffin Video',url:origin+'/'}}));
  schema.mainEntity={'@type':'ItemList',numberOfItems:videoObjects.length,itemListElement:videoObjects.map((video,index)=>({'@type':'ListItem',position:index+1,item:{'@id':video['@id']}}))};
  structured={'@context':'https://schema.org','@graph':[schema,...videoObjects]};
 }
 const seo=`<!-- NCV SEO START -->\n<link rel="canonical" href="${origin+page.path}">\n<meta property="og:type" content="website"><meta property="og:site_name" content="Neon Coffin Video"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${origin+page.path}"><meta property="og:image" content="${origin+page.image}"><meta property="og:image:width" content="${page.width}"><meta property="og:image:height" content="${page.height}"><meta property="og:image:alt" content="${escape(page.imageAlt||'Original Neon Coffin Video artwork')}">\n<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(page.title)}"><meta name="twitter:description" content="${escape(page.description)}"><meta name="twitter:image" content="${origin+page.image}">\n<script type="application/ld+json">${JSON.stringify(structured).replace(/</g,'\\u003c')}</script>\n<!-- NCV SEO END -->`;
 html=html.replace('</head>',seo+'</head>');
 if(page.id){
  const itemList={'@type':'ItemList',numberOfItems:rentalMovies.filter(movie=>movie.aisle===page.id).length,itemListElement:rentalMovies.filter(movie=>movie.aisle===page.id).sort((a,b)=>a.title.localeCompare(b.title)).map((movie,index)=>({'@type':'ListItem',position:index+1,name:movie.title,url:origin+'/screening-room#tape/'+movie.id}))};
  const schemaStart=html.indexOf('<script type="application/ld+json">'),schemaEnd=html.indexOf('</script>',schemaStart);
  const pageSchema=JSON.parse(html.slice(schemaStart+'<script type="application/ld+json">'.length,schemaEnd));
  pageSchema.mainEntity=itemList;
  html=html.slice(0,schemaStart)+'<script type="application/ld+json">'+JSON.stringify(pageSchema).replace(/</g,'\\u003c')+html.slice(schemaEnd);
 }
 if(page.file==='screening-room.html'){
  html=html.replace(/<div id="lsRentalGrid" class="ls-rental-grid">[\s\S]*?<\/div><!-- NCV RENTAL GRID END -->/,`<div id="lsRentalGrid" class="ls-rental-grid">${rentalRackHTML(rentalMovies)}</div><!-- NCV RENTAL GRID END -->`);
  html=html.replace(/<!-- NCV GENRE NAV START -->[\s\S]*?<!-- NCV GENRE NAV END -->/g,'');
  html=html.replace(/<div id="lsRackFilters"[^>]*>[\s\S]*?<\/div>/,`<div id="lsRackFilters" class="ls-filters" role="group" aria-label="Filter horror categories">${rentalFiltersHTML(rentalMovies)}</div>${genreNavHTML()}`);
  html=html.replace(/(<p id="lsRackStatus"[^>]*>)[\s\S]*?<\/p>/,`$1${rentalMovies.length} OF ${rentalMovies.length} TAPES / 1980–1999</p>`);
 }
 await writeFile(file,html.replace(/[ \t]+$/gm,''));
}
await writeFile(new URL('sitemap.xml',root),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(page=>`  <url><loc>${origin+page.path}</loc></url>`).join('\n')+'\n</urlset>\n');
let robots=await readFile(new URL('robots.txt',root),'utf8');robots=robots.replace(/^Sitemap:.*\n?/gm,'').trimEnd()+'\nSitemap: '+origin+'/sitemap.xml\n';await writeFile(new URL('robots.txt',root),robots);
console.log(`Built canonical metadata, social previews, ${genrePages.length} static horror collections, sitemap, and the initial HTML rental rack.`);
