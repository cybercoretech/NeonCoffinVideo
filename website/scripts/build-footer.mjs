import {readFile, writeFile} from 'node:fs/promises';
import {renderGenreFooter} from '../shared/genre-footer.mjs';
const root = new URL('../', import.meta.url);
const config = JSON.parse(await readFile(new URL('shared/footer-config.json', root), 'utf8'));
for (const page of ['index.html', 'community.html', 'screening-room.html', 'late-returns.html', 'viewing-room.html']) {
  const path = new URL(page, root);
  let html = await readFile(path, 'utf8');
  // Keep one visible shared footer outside main/dialogs, including when an older
  // page contains an accidental duplicate inside the rules popup.
  html = html.replace(/<footer\b[^>]*class="genre-footer"[\s\S]*?<\/footer>/g, '');
  html = html.replace('</main>', '</main>' + renderGenreFooter(config));
  if (!html.includes('shared/genre-footer.css')) html = html.replace('</head>', '<link rel="stylesheet" href="shared/genre-footer.css"></head>');
  // Preserve the existing homepage source-dialog control.
  if (page === 'index.html') html = html.replace('href="/#artwork-credits"', 'href="#artwork-credits" id="creditsButton"');
  await writeFile(path, html);
}
