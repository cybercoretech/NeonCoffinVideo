import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Artwork was created with image generation. SVG assembles the physical print
// layouts and supplies closed vector cut boundaries; raster export adds no art.
const root='/home/raven/Webdev/neon-coffin-merch-pack';
const out=path.join(root,'products/stickers/ready-to-upload');
const layouts=path.join(root,'products/stickers/editable-layouts');
const masters=path.join(root,'products/stickers/source-generated');
for(const p of [out,layouts,masters]) fs.mkdirSync(p,{recursive:true});
const generated='/home/raven/.codex/generated_images/01a0ffa6-64d8-7c70-8796-55c1442cdcc1';
const inputs={
 coffin:path.join(generated,'exec-98dc38cc-dc61-4fc2-a9d4-fa745c0fef62.png'),
 holo:path.join(generated,'exec-be582559-4ca7-4798-b544-f0040d6f26ed.png'),
 marquee:path.join(generated,'exec-69822c7d-1b57-4436-83a3-f82cfdc25683.png'),
 scene:path.join(root,'source/storefront-reference-only.png'),
 url:path.join(root,'source/neon-coffin-horror-marquee-url-lockup-source-2172x724.png')
};
for(const k of ['coffin','holo','marquee'])fs.copyFileSync(inputs[k],path.join(masters,k+'-generated.png'));
const data=p=>'data:image/png;base64,'+fs.readFileSync(p).toString('base64');
const image=(p,w,h)=>`<image width="${w}" height="${h}" href="${data(p)}"/>`;
const shapes={
 coffin:'304,37 720,37 943,416 758,1347 682,1442 337,1442 255,1343 82,418',
 holo:'310,17 716,17 943,395 758,1372 684,1472 341,1472 265,1372 78,395',
 marquee:'163,217 1370,217 1420,290 1483,325 1533,535 1471,737 1413,790 1363,817 203,817 123,769 61,706 5,535 58,326 119,290'
};
function cut(k,id,x,y,w,h){
 const v=k==='marquee'?'0 207 1536 620':k==='holo'?'68 7 885 1475':'72 27 881 1425';
 const dims=k==='marquee'?[1536,1024]:[1024,1536];
 return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${v}" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="${id}"><polygon points="${shapes[k]}"/></clipPath></defs><polygon points="${shapes[k]}" fill="#080b17"/><g clip-path="url(#${id})">${image(inputs[k],...dims)}</g></svg>`;
}
function scene(x,y,w,h){
 return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 1672 940">${image(inputs.scene,1672,940)}</svg>`;
}
function url(x,y,w,h){
 return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 2172 650"><defs><clipPath id="url-clip"><rect x="0" y="0" width="2172" height="650" rx="46"/></clipPath></defs><g clip-path="url(#url-clip)"><rect width="2172" height="650" fill="#080b17"/><image y="-40" width="2172" height="724" href="${data(inputs.url)}"/></g><rect x="5" y="5" width="2162" height="640" rx="42" fill="none" stroke="#ff168c" stroke-width="10"/></svg>`;
}
function svg(w,h,contents){return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${contents}</svg>`;}
const jobs=[
 ['neon-coffin-cassette-die-cut-3in-tall-600x900-300ppi',600,900,cut('coffin','coffin-cut',0,0,600,900),'Die-Cut Stickers','3-inch boundary; portrait artwork'],
 ['neon-coffin-cassette-die-cut-4in-tall-800x1200-300ppi',800,1200,cut('coffin','coffin-cut',0,0,800,1200),'Die-Cut Stickers','4-inch boundary; portrait artwork'],
 ['neon-coffin-marquee-die-cut-4in-wide-1200x484-300ppi',1200,484,cut('marquee','marquee-cut',0,0,1200,484),'Die-Cut Stickers','4-inch boundary; landscape artwork'],
 ['neon-coffin-storefront-vinyl-decal-4in-wide-1200x675-300ppi',1200,675,scene(0,0,1200,675),'Kiss-Cut Vinyl Decals','3 x 4 inch boundary rotated to landscape; graphic 4 x 2.25 inches'],
 ['neon-coffin-marquee-vinyl-decal-4in-wide-1200x484-300ppi',1200,484,cut('marquee','marquee-cut',0,0,1200,484),'Kiss-Cut Vinyl Decals','3 x 4 inch boundary rotated to landscape; preserve aspect ratio'],
 ['neon-coffin-cassette-holographic-3in-tall-600x900-300ppi',600,900,cut('holo','holo-cut',0,0,600,900),'Kiss-Cut Holographic Sticker Sheet','3 x 3 inch boundary; one tall coffin'],
 ['neon-coffin-cassette-holographic-4in-tall-800x1200-300ppi',800,1200,cut('holo','holo-cut',0,0,800,1200),'Kiss-Cut Holographic Sticker Sheet','4 x 4 inch boundary; one tall coffin'],
 ['neon-coffin-collector-sheet-5.83x8.27in-1749x2481-300ppi',1749,2481,
  cut('marquee','sheet-marquee',100,100,1549,626)+cut('coffin','sheet-coffin',100,870,575,940)+scene(850,1010,799,449)+url(100,1950,1549,464),
  'Kiss Cut Sticker Sheet with Custom Background','5.83 x 8.27 inch sheet; four separate sticker islands; transparent gaps']
];
const manifest=[];
for(const [name,w,h,contents,product,placement] of jobs){
 const sv=path.join(layouts,name+'.svg'),png=path.join(out,name+'.png');
 fs.writeFileSync(sv,svg(w,h,contents));
 execFileSync('rsvg-convert',['--width',String(w),'--height',String(h),'-o',png,sv]);
 // Export-only: preserve pixels and attach 300 pixels/inch plus an sRGB ICC profile.
 execFileSync('magick',[png,'-units','PixelsPerInch','-density','300','-colorspace','sRGB','-profile','/usr/share/ghostscript/iccprofiles/srgb.icc',png]);
 manifest.push({file:name+'.png',width:w,height:h,ppi:300,product,placement});
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest,null,2));
const previewDir=path.join(root,'products/stickers/previews');
fs.mkdirSync(previewDir,{recursive:true});
const representatives=[jobs[0],jobs[2],jobs[3],jobs[5],jobs[7]];
let board='';
for(let i=0;i<representatives.length;i++){
 const [name,w,h]=representatives[i],x=i*320;
 board+=`<rect x="${x}" width="320" height="600" fill="#f4f1e8"/><rect x="${x}" y="600" width="320" height="600" fill="#100d17"/>`;
 for(const y of [0,600])board+=`<image x="${x+20}" y="${y+20}" width="280" height="560" preserveAspectRatio="xMidYMid meet" href="${data(path.join(out,name+'.png'))}"/>`;
}
const boardSvg=path.join(previewDir,'sticker-review-light-and-dark.svg');
fs.writeFileSync(boardSvg,svg(1600,1200,board));
execFileSync('rsvg-convert',['-o',path.join(previewDir,'sticker-review-light-and-dark.png'),boardSvg]);
const cards=manifest.map(m=>`<article><img src="ready-to-upload/${m.file}" alt="${m.product}"/><p>${m.product}</p><small>${m.width} × ${m.height} pixels · 300 PPI</small><a href="ready-to-upload/${m.file}" download>Download PNG</a></article>`).join('');
fs.writeFileSync(path.join(root,'products/stickers/review.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Neon Coffin Video sticker artwork</title><style>body{margin:0;padding:24px;background:#100d17;color:#eee;font:16px system-ui}h1{font-size:24px}button{padding:10px 18px;margin:0 8px 18px 0;cursor:pointer}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}article{border:1px solid #793450;padding:16px}img{display:block;box-sizing:border-box;width:100%;height:360px;object-fit:contain;padding:14px;background:var(--art-bg,#f4f1e8)}small{display:block;color:#bbb}a{display:block;color:#ff62ad;margin-top:12px}</style><h1>Neon Coffin Video — finished sticker artwork</h1><p>Actual upload files. Background switches show transparency; they are not part of the printed artwork.</p><button onclick="document.documentElement.style.setProperty('--art-bg','#f4f1e8')">Light background</button><button onclick="document.documentElement.style.setProperty('--art-bg','#100d17')">Dark background</button><main>${cards}</main></html>`);
