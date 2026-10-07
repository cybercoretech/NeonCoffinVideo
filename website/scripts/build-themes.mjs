import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const pack=JSON.parse(await readFile(new URL('theme-packs/halloween.json',root),'utf8'));
await writeFile(new URL('theme-packs/catalogue.js',root),'/* Generated from halloween.json by scripts/build-themes.mjs. */\nwindow.cybercoreHalloween = '+JSON.stringify(pack)+';\n');
for(const name of ['index.html','community.html']){
 const file=new URL(name,root);let html=await readFile(file,'utf8');
 if(!html.includes('theme-packs/boot.js'))html=html.replace('</head>','<link rel="stylesheet" href="theme-packs/themes.css"><link rel="stylesheet" href="theme-packs/panel.css"><script src="theme-packs/catalogue.js"></script><script src="theme-packs/boot.js"></script></head>');
 if(!html.includes('theme-packs/panel.js'))html=html.replace('</body>','<script src="theme-packs/panel.js"></script></body>');
 await writeFile(file,html);
}
