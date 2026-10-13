import {readFile, writeFile} from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const records = JSON.parse(await readFile(new URL('artwork-sources.json', root)));
const stills = JSON.parse(await readFile(new URL('still-sources.json', root)));
let text = `# Neon Coffin Video — artwork and sources

Original graphics created for Neon Coffin Video include the storefront, coffin-cassette emblem, Trioxin barrel, television cabinet, OPEN sign, and atmospheric SVG illustrations. Some original graphics were generated with AI and prepared for the site and merchandise. Original graphics are distinct from the film posters and photographs credited below.

The transparent coffin-and-wordmark logo in \`assets/branding/neon-coffin-video-logo.png\` was generated with AI using the existing original coffin-cassette emblem as a reference. The website uses its lossless WebP version. Reusable copies are kept in the merchandise pack's \`branding/\` folder.

Film posters, photographs, and film/trailer frames belong to their respective rights holders. These references document provenance, not a blanket license for reuse. Photo/artwork attribution is linked in each film profile and collected here.

## The Late Show

The screening room uses the original NCV television cabinet, geometric rental-label SVGs, and original HPTV Channel 13 station identity in \`assets/late-show/\`. The HPTV station background, Marlow Vane portrait, and Blackbacks wraith portrait are original AI-generated Neon Coffin Video artwork; the HPTV 13 page has its own original decaying control-room background. the station mark is original SVG artwork. The WHP-TV station-identification logo and analog television static graphic are original Neon Coffin Video vector artwork. These are original fallback illustrations, not official film posters. The screening room displays the credited film posters listed below, including the restored Lifeforce theatrical poster. [Late Show source notes](LATE-SHOW-SOURCES.md) document provider listings, verified official preview uploaders, player usage, and newsletter handling.

## Halloween Collection original artwork

The eight movie-inspired full-frame wallpapers in \`theme-packs/art/*-wallpaper.webp\` were generated with AI for Cybercore Theme Packs. Each is a dedicated native-resolution scene, losslessly converted to WebP without enlargement. The previous two scene atlases are retained as historical source assets and are no longer displayed. They are original atmospheric illustrations, not film frames or official promotional artwork. Movie names identify inspiration; this collection is independently created.

## The Night Clerk

The Midnight Lounge portrait in \`assets/night-clerk/past-due-portrait.webp\` is an original AI-generated illustration developed from the user-selected “Past Due” character concept. Its source portrait, model and expression studies, and editable animation plates are archived in the private NeonCoffinAnimations production repository. The web image is a compressed export of the portrait.

## Harrow Point characters

The town hall group photograph, Harrow Point Lantern newsprint texture, and character illustrations are original fictional NCV artwork. The town guide, newspaper archive, and HPTV station archive use distinct page backgrounds.

The Mortician, Burial Ground Caretaker, and Silas Vale portraits in \`assets/harrow-point/\` are original AI-generated character illustrations created for Neon Coffin Video. Silas’s portrait follows the approved young character design from the original short, \`The Last Ride\`. The Night Manager portrait is original NCV artwork.

## Late Returns

\`assets/late-returns/late-returns-background.webp\` is original AI-generated atmospheric artwork created for the Late Returns watch page; it is not a frame from a film. The poster is a frame from Neon Coffin Video's original short, \`Be Kind. Rewind.\`. The website MP4 is a smaller 1080p web encode of the production export in the private NeonCoffinAnimations repository. English captions are based on the production dialogue guide.

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
