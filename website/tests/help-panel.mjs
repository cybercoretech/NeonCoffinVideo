import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const script=readFileSync(new URL('help-panel.js',root),'utf8');
const build=readFileSync(new URL('scripts/build.mjs',root),'utf8');
for(const page of ['index.html','community.html']){
  const html=readFileSync(new URL(page,root),'utf8');
  assert.match(html,/help-panel\.css\?v=/,`${page} loads Help styling`);
  assert.match(html,/help-panel\.js\?v=/,`${page} loads the Help panel`);
}
for(const address of ['info@neoncoffinvideo.site','help@neoncoffinvideo.site','neondemon_74@neoncoffinvideo.site'])assert(script.includes(address),`Help panel lists ${address}`);
for(const item of ['aria-haspopup','ncvHelpPanel','What are Theme Packs?','How does the Midnight Lounge work?','How do I report a problem?','fourthwall.com'])assert(script.includes(item),`Help panel includes ${item}`);
assert.match(build,/'help-panel\.js','help-panel\.css'/);
console.log('PASS: the Help panel is linked on the storefront and Lounge, includes FAQs and all three contact emails, and its assets are in the production build allowlist.');
