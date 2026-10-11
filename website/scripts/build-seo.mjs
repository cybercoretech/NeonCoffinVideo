import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {rentalMovies} from '../rental-rack-data.js';
import {rentalRackHTML,rentalFiltersHTML} from '../late-show-rack.js';
import {genrePages,genreNavHTML,genrePageHTML} from '../genre-seo-pages.js';
const root=new URL('../',import.meta.url),origin='https://neoncoffinvideo.site';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pages=[
 {file:'index.html',path:'/',title:'80s & 90s Cult Horror + Original Shorts | Neon Coffin Video',description:'Explore 1980s and 1990s cult horror, VHS culture, and Neon Coffin’s original illustrated horror-comic shorts, plus double features, trailers, and fan discussions.',image:'/assets/storefront.png',width:1672,height:940,type:'WebSite'},
 {file:'screening-room.html',path:'/screening-room',title:'The Late Show: Cult Horror Picks & Trailers | Neon Coffin Video',description:'Find your next cult horror rental: Tubi movie links, official trailers on the NCV screen, Friday double bills, and The Midnight Dispatch.',image:'/assets/late-show-tv.png',width:1312,height:1199,type:'CollectionPage'},
 {file:'late-returns.html',path:'/late-returns',title:'Late Returns: Be Kind. Rewind. | Original Horror Short | Neon Coffin Video',description:'Watch Be Kind. Rewind., the first original illustrated horror-comic short in Neon Coffin Video’s Late Returns series. Tape 001. Two minutes. 1080p.',image:'/assets/late-returns/be-kind-rewind-poster.jpg',imageAlt:'A collector loads an unmarked VHS while a shadow watches from the television',width:1920,height:1080,type:'VideoObject',video:true},
 {file:'community.html',path:'/community',title:'The Midnight Lounge: Horror Movie Community | Neon Coffin Video',description:'Join the 18+ Midnight Lounge for cult horror discussions, member movie shelves, reviews, and Friday night double features.',image:'/assets/storefront.png',width:1672,height:940,type:'CollectionPage'},
 ...genrePages
];
for(const page of pages){
 const file=new URL(page.file,root);let html=page.id?genrePageHTML(page):await readFile(file,'utf8');
 if(page.id)await mkdir(new URL('.',file),{recursive:true});
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(page.title)}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(page.description)}">`);
 html=html.replace(/^[ \t]*<link rel="canonical"[^>]*>[ \t]*\r?\n?/gm,'').replace(/<!-- NCV SEO START -->[\s\S]*?<!-- NCV SEO END -->\r?\n?/g,'');
 const schema={'@context':'https://schema.org','@type':page.type,'@id':origin+page.path+'#page',url:origin+page.path,name:page.title,description:page.description,inLanguage:'en',publisher:{'@type':'Organization',name:'Neon Coffin Video',url:origin+'/',logo:origin+'/assets/branding/neon-coffin-video-logo.png'}};
 if(page.video)Object.assign(schema,{thumbnailUrl:origin+page.image,uploadDate:'2026-10-10',duration:'PT2M',contentUrl:origin+'/assets/late-returns/be-kind-rewind-1080p.mp4',embedUrl:origin+page.path,encodingFormat:'video/mp4',width:1920,height:1080,partOfSeries:{'@type':'CreativeWorkSeries',name:'Late Returns',url:origin+page.path}});
 if(page.type!=='WebSite')schema.isPartOf={'@type':'WebSite',name:'Neon Coffin Video',url:origin+'/'};
 const seo=`<!-- NCV SEO START -->\n<link rel="canonical" href="${origin+page.path}">\n<meta property="og:type" content="${page.video?'video.other':'website'}"><meta property="og:site_name" content="Neon Coffin Video"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${origin+page.path}"><meta property="og:image" content="${origin+page.image}"><meta property="og:image:width" content="${page.width}"><meta property="og:image:height" content="${page.height}"><meta property="og:image:alt" content="${escape(page.imageAlt||'Original Neon Coffin Video artwork')}">\n<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(page.title)}"><meta name="twitter:description" content="${escape(page.description)}"><meta name="twitter:image" content="${origin+page.image}">\n<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>\n<!-- NCV SEO END -->`;
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
