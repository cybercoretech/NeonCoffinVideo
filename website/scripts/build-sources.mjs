import {readFile, writeFile} from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const records = JSON.parse(await readFile(new URL('artwork-sources.json', root)));
const stills = JSON.parse(await readFile(new URL('still-sources.json', root)));
let text = `# Neon Coffin Video — artwork and sources

Original graphics created for Neon Coffin Video include the storefront, coffin-cassette emblem, Trioxin barrel, television cabinet, OPEN sign, and atmospheric SVG illustrations. Some original graphics were generated with AI and prepared for the site and merchandise. Original graphics are distinct from the film posters and photographs credited below.

The transparent coffin-and-wordmark logo in \`assets/branding/neon-coffin-video-logo.png\` was generated with AI using the existing original coffin-cassette emblem as a reference. The website uses its lossless WebP version. Reusable copies are kept in the merchandise pack's \`branding/\` folder.

Film posters, photographs, and film/trailer frames belong to their respective rights holders. These references document provenance, not a blanket license for reuse. Photo/artwork attribution is linked in each film profile and collected here.

## Halloween Collection original artwork

The eight movie-inspired full-frame wallpapers in \`theme-packs/art/*-wallpaper.webp\` were generated with AI for Cybercore Theme Packs. Each is a dedicated native-resolution scene, losslessly converted to WebP without enlargement. The previous two scene atlases are retained as historical source assets and are no longer displayed. They are original atmospheric illustrations, not film frames or official promotional artwork. Movie names identify inspiration; this collection is independently created.

## Film artwork

`;
for (const item of records) text += `### ${item.slug}\n\n- Local file: \`${item.local || 'See artwork-sources.json'}\`\n${item.credit ? '- Credit: '+item.credit+'\n' : ''}${item.page ? '- Reference: '+item.page+'\n' : ''}${item.image_source ? '- Image source: '+item.image_source+'\n' : ''}\n`;
text += '## Film and trailer frames\n\n';
for (const item of stills) text += `- ${item.film} — ${item.type}. Local file: \`${item.local}\`. Source: ${item.source}\n`;
text += `
## Fonts, effects, and service marks

- Creepster, Bebas Neue, IBM Plex Sans, JetBrains Mono: locally bundled fonts; license files accompany the fonts in assets/fonts/.
- Sparticles 1.3.0 by Simey: https://github.com/simeydotme/sparticles (MPL-2.0; bundled code and license in assets/vendor/).
- Tubi logo: https://corporate.tubitv.com/
- Pluto TV logo: https://www.paramountpressexpress.com/pluto-tv/shows/pluto-tv/photos/
- Fawesome logo: https://fawesome.tv/
- Official trailers are embedded from YouTube on request. Playback remains with the original host.

Regenerate this document with \`node scripts/build-sources.mjs\` after updating the attribution JSON files.
`;
await writeFile(new URL('SOURCES.md', root), text);
