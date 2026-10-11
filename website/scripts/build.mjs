import {cp, mkdir, readdir, rm} from 'node:fs/promises';
import {build} from 'esbuild';
await import('./build-late-show.mjs');
await import('./build-footer.mjs');
await import('./build-sources.mjs');
await import('./build-themes.mjs');
await import('./build-night-clerk-catalog.mjs');
await import('./build-rental-rack.mjs');
await import('./build-seo.mjs');
const root = new URL('../', import.meta.url), dist = new URL('dist/', root);
// Only generated output is replaced. Use an explicit public-file allowlist.
await rm(dist, {recursive: true, force: true});
await mkdir(dist, {recursive: true});
const publicFiles = ['screening-room.html','late-show.css','late-show.js','late-show-data.js','late-show-rack.js','rental-rack-data.js','sitemap.xml','late-show-home.js','LATE-SHOW-SOURCES.md','index.html','community.html','404.html','fonts.css','styles.css','store-nav.css','store-nav.js','neon-polish.css','neon-polish.js','rental-counter.css','site-membership.css','site-membership.js','community.css','night-clerk-ui.js','night-clerk-ui.css','night-clerk-catalog.json','stats.css','night-effects.css','app.js','stats-counter.js','community.js','help-panel.js','help-panel.css','catalogue.js','italian-horror.js','curator-data.js','vhs-culture.js','imdb-search.js','after-dark.js','night-effects.js','artwork-sources.json','still-sources.json','catalogue-extra.json','movies.json','SOURCES.md','robots.txt','_routes.json','assets','horror','theme-packs','design-samples'];
for (const file of publicFiles) await cp(new URL(file, root), new URL(file, dist), {recursive: true});
await mkdir(new URL('shared/', dist));
await cp(new URL('shared/genre-footer.css', root), new URL('shared/genre-footer.css', dist));
await build({entryPoints:[new URL('_worker.js',root).pathname], outfile:new URL('_worker.js',dist).pathname,bundle:true,format:'esm',platform:'browser',target:'es2022'});
console.log('Built public website in dist/; private source, credentials, and local databases excluded.');
