# After/Cut — The Fresh Cut and The Cult Files

Published October 9, 2026 to the existing `aftercut` Cloudflare Pages project at https://aftercut.pages.dev/.

The front-page rotation now contains three release picks, two upcoming films and two development/news reports:

1. V/H/S/Mixtape — release listed October 9.
2. 28 Years Later 3 — October 9 development report; no confirmed release date.
3. Other Mommy — release listed October 9.
4. Clayface — upcoming calendar lists October 23.
5. The Beyond remake — October 8 announcement; no confirmed release date.
6. Ghost in the Cell — new-release board lists October 2; availability varies by market.
7. Christmas at the Kringles — October 8 trailer report confirms October 30 theatrical release.

Direct sources, listing/report dates, trailers and artwork credits are maintained in `genre-network/aftercut/front-page.js` and `front-page-art.json`. All three requested Bloody Disgusting boards have direct browse links below the feature rotation. This is an editorial snapshot checked October 9, not an automatically synchronized feed.

The original seven were moved to **The Cult Files**, above the film archive, with navigation links from the header and current news slides. Their original posters, backgrounds, descriptions and trailer-source links are retained, alongside working film popups. The Miles County dossier remains directly accessible. Original slide data is preserved in `cult-files.json`.

The fresh rotation runs every 60 seconds, supports direct slide selection, previous/next and pause, pauses for trailers/hover/hidden tabs and starts paused with reduced motion. Only supplied trailer IDs are used; news stories do not invent a trailer. Related-film stills are explicitly identified for The Beyond and 28 Years Later 3.

## Verification

Static content tests passed for counts, unique entries, release/news types, source URLs, assets, trailer IDs, script order and preservation of the original seven.

Local and live Chromium checks passed at 1440, 900, 540, 390 and 320px: all seven slides, poster loads, direct source links, unclipped titles, no horizontal overflow, CTA layout, trailer open/close, rotation callback, all original posters and a working film popup. Reduced-motion checks passed; no uncaught browser errors occurred. Trailer iframe creation was checked; third-party video playback was not guaranteed.

Deployment: `51e1ce1e`, code commit `b6db793`, verified at https://aftercut.pages.dev/. Source and artwork are backed up separately under `genre-network/aftercut` in the existing private NeonCoffinVideo repository. The screenshots here were captured from the live site.
