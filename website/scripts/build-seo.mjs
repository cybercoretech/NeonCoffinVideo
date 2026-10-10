import {readFile,writeFile} from 'node:fs/promises';
import {screenMovies} from '../late-show-data.js';
import {rentalRackHTML} from '../late-show-rack.js';
const root=new URL('../',import.meta.url),origin='https://neoncoffinvideo.site';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pages=[
 {file:'index.html',path:'/',title:'80s & 90s Cult Horror Movies | Neon Coffin Video',description:'Explore 1980s and 1990s cult horror, practical-effects monsters, VHS culture, double features, official trailers, and the Midnight Lounge.',image:'/assets/storefront.png',width:1672,height:940,type:'WebSite'},
 {file:'screening-room.html',path:'/screening-room',title:'The Late Show: Cult Horror Picks & Trailers | Neon Coffin Video',description:'Find your next cult horror rental: Tubi movie links, official trailers on the NCV screen, Friday double bills, and The Midnight Dispatch.',image:'/assets/late-show-tv.png',width:1312,height:1199,type:'CollectionPage'},
 {file:'community.html',path:'/community',title:'The Midnight Lounge: Horror Movie Community | Neon Coffin Video',description:'Join the 18+ Midnight Lounge for cult horror discussions, member movie shelves, reviews, and Friday night double features.',image:'/assets/storefront.png',width:1672,height:940,type:'CollectionPage'}
];
for(const page of pages){
 const file=new URL(page.file,root);let html=await readFile(file,'utf8');
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(page.title)}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(page.description)}">`);
 html=html.replace(/^[ \t]*<link rel="canonical"[^>]*>[ \t]*\r?\n?/gm,'').replace(/<!-- NCV SEO START -->[\s\S]*?<!-- NCV SEO END -->\r?\n?/g,'');
 const schema={'@context':'https://schema.org','@type':page.type,'@id':origin+page.path+'#page',url:origin+page.path,name:page.title,description:page.description,inLanguage:'en',publisher:{'@type':'Organization',name:'Neon Coffin Video',url:origin+'/',logo:origin+'/assets/branding/neon-coffin-video-logo.png'}};
 if(page.type!=='WebSite')schema.isPartOf={'@type':'WebSite',name:'Neon Coffin Video',url:origin+'/'};
 const seo=`<!-- NCV SEO START -->\n<link rel="canonical" href="${origin+page.path}">\n<meta property="og:type" content="website"><meta property="og:site_name" content="Neon Coffin Video"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${origin+page.path}"><meta property="og:image" content="${origin+page.image}"><meta property="og:image:width" content="${page.width}"><meta property="og:image:height" content="${page.height}"><meta property="og:image:alt" content="Original Neon Coffin Video artwork">\n<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(page.title)}"><meta name="twitter:description" content="${escape(page.description)}"><meta name="twitter:image" content="${origin+page.image}">\n<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>\n<!-- NCV SEO END -->`;
 html=html.replace('</head>',seo+'</head>');
 if(page.file==='screening-room.html')html=html.replace(/<div id="lsRentalGrid" class="ls-rental-grid">[\s\S]*?<\/div><p class="ls-fine">Film posters/,`<div id="lsRentalGrid" class="ls-rental-grid">${rentalRackHTML(screenMovies)}</div><p class="ls-fine">Film posters`);
 await writeFile(file,html.replace(/[ \t]+$/gm,''));
}
await writeFile(new URL('sitemap.xml',root),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(page=>`  <url><loc>${origin+page.path}</loc></url>`).join('\n')+'\n</urlset>\n');
let robots=await readFile(new URL('robots.txt',root),'utf8');robots=robots.replace(/^Sitemap:.*\n?/gm,'').trimEnd()+'\nSitemap: '+origin+'/sitemap.xml\n';await writeFile(new URL('robots.txt',root),robots);
console.log('Built canonical metadata, social previews, sitemap, and the initial HTML rental rack.');
