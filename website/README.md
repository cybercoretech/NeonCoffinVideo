# Current project status — 2026-10-06

Production: https://neoncoffinvideo.site/ (Cloudflare Pages `neoncoffinvideo`, branch `main`).

- Homepage counter reads real D1 totals; one anonymous view per homepage load, read-only refresh every minute while visible. Views are page loads, not unique visitors. Curated tapes come from the actual 145-film catalogue. Members, discussions, reviews and ballots are database totals. No visitor IDs or IP addresses are stored by the custom counter; Cloudflare infrastructure logging is separate.
- Shared responsive genre footer installed on the homepage and lounge: site email, After/Cut and LastActionReel, merch, source credits, PayPal and Buy Me a Coffee. See `shared/README.md` for reuse.
- Film image sources are linked in each film profile and recorded in `SOURCES.md`.
- `npm ci`, `npm test`, `npm run build`. The deployable directory is `dist/`; it excludes development files and databases.
- `npm run dev` starts the local D1-compatible preview on port 8794. Optional browser test: provide Playwright and run `node tests/footer-browser.cjs`; `BROWSER_PATH` selects a browser executable.
- See `LAUNCH.md` for deployment and `COMMUNITY.md` for authentication configuration. Browser/API tests with mocked Google responses do not verify a live sign-in.

The following notes are historical implementation records; the current status above supersedes old launch assumptions.

---

# Neon Coffin Video

Local preview: http://127.0.0.1:8794

Run `npm run dev` from this folder. Node 22 or newer is sufficient; no dependencies or build step are required. The preview includes the same three-provider guide handler prepared for Cloudflare.

## What is built

- Original neon storefront, coffin-VHS emblem, Trioxin 245 illustration, CRT television/VHS deck, favicon and SVG interface icons.
- 120 horror and sci-fi films, mostly from the 1970s–1990s, plus earlier influences. All poster files are local.
- Search by title/director/year/mood, eight compact category cards with poster fans and neon hover effects, eight-film paginated stacks, decade filters, title/year/runtime sorting, film dossiers, IMDb references, spoiler disclosure, and a browser-local rental shelf.
- Eight curated double features and personal screening calendars.
- Three rotating staff picks and a featured double bill change every 12 hours, at 00:00 and 12:00 UTC. The page checks the clock every 30 seconds and when returning to an open tab. The rotation uses the existing curated archive; it does not import new films or claim streaming availability.
- Original CRT trailer player: three sourced official trailers, channel controls, play/stop, and direct YouTube fallback links. Third-party embedding may depend on region and studio settings. No autoplay on page load.
- Popup Pluto TV and Tubi guides with actual current/upcoming listings, channel search/switching, official watch links, local times, progress, and airing calendar downloads. Tubi includes FilmRise Horror, Horror by ALTER, Alien Nation by DUST, HauntTV, OuterSphere, Ghosts are Real, Mysterious Worlds, and Classic Doctor Who. Live feeds cache for five minutes; the open guide checks expiry every minute. Manual refresh rechecks the server’s current feed.
- Connected Fawesome on-demand horror shelf: up to 60 current provider records, classics first, title/year search, description, CRT artwork, and direct movie watch links. No invented air times or broadcast reminders. Catalog cache lasts one hour; the 12-hour editorial rotation is separate.
- Official Tubi/Pluto/Fawesome logos, plus Shout! TV, Sling Freestream, and Plex destinations. Additional services are external destinations, not connected schedule feeds.
- Custom hanging neon OPEN sign with Creepster lettering converted to SVG paths, rusted housing, broken pink border tube, dirty/cracked glass, toxic green drips, chains, gentle sway and intermittent tube flicker. Includes the “Thanks for the ride, lady!” sticker. Rain on the storefront, pointer-responsive light, drifting Trioxin fumes, containment beacon, poster shine, shelf arrival transitions, rental stamps, and stronger CRT tracking. Sparticles and reduced-motion/Atmosphere controls retained. Decorative canvases stop when offscreen or the page is hidden. Optional synthesized SFX default OFF.
- Redesigned sticky dark-glass navigation console with neon edge, illuminated logo badge, live TV control, search, shelf counter, Halloween shortcut, and active-section indication.
- Dedicated October section: original Halloween (1978) centerpiece and Halloween II–V only, plus Night of the Demons, Trick or Treat, Trick ’r Treat, Pumpkinhead, and Elvira. Original moonlit neighborhood SVG, falling leaves, countdown to local October 31 at 6pm, ten poster cards, and two dedicated double bills.

## Cloudflare upload

Upload `/home/raven/Webdev/neon-coffin-video-cloudflare.zip` as a Cloudflare **Pages** Direct Upload. Its root contains `index.html`, all assets, `_worker.js`, and `_routes.json`. Keep these last two files: the first supplies `/api/guide`, and the second limits dynamic requests to the API route. No API keys, npm installation, build command or domain are required for this version.

Cloudflare dashboard: Workers & Pages → Create application → Pages / Direct Upload → choose the zip → Deploy. After deployment, check the homepage and click TV GUIDE. This work has not been deployed to your account.

Cloudflare documents support for `_worker.js` in dashboard drag-and-drop deployments: https://developers.cloudflare.com/pages/get-started/direct-upload/#functions

If uploading to a Workers Static Assets project instead of Pages, use a Worker entrypoint and static-assets binding; the included package is prepared for Pages Direct Upload.

## Content and sources

`catalogue.js` contains the extended film records; the original nine counter picks and the double-feature definitions are in `app.js`. `catalogue-extra.json` is an editable record copy. If you edit the JSON, regenerate `catalogue.js` before uploading. `artwork-sources.json` and `still-sources.json` preserve artwork provenance. Runtime can vary by edition; listed runtimes are the referenced film-entry values.

The poster artwork remains the respective rights holders’ work. The notes are original editorial drafts, not invented owner memories or IMDb reviews. IMDb links open film entries where a matching ID was sourced, with title/year search as a fallback. No scraped ratings are presented.

32 new archive additions have original locally hosted SVG rental-sleeve illustrations; these are custom Neon Coffin designs, not the films’ theatrical posters. The site also has interactive Romero, Cronenberg, Dante, King, Barker, and Carpenter auteur shelves plus Troma and Anchor Bay Video label shelves. Original illustrations and brand design are distinct from movie artwork. Service logos came from Tubi Corporate, Paramount Press Express, and Fawesome’s official site. Sparticles 1.3.0 is unmodified and distributed with MPL-2.0; source: https://github.com/simeydotme/sparticles . Fonts include their license files. Effects selection reference: https://github.com/lindelof/awesome-web-effect .

## Further phases

The preserved four-phase plan is in BLUEPRINT.md. Remaining archive/community work includes owner-authored deep reviews and memories, an editorial CMS, independently indexable film pages, verified on-demand offer records, dependable additional provider schedules, newsletter, accounts, cross-device shelves, and moderated community. The current deliverable is the working branded local website with the above interactions and live Pluto/Tubi guide connections and a current Fawesome horror catalog.

## Guide connections and verification

`/api/guide?provider=pluto|tubi|fawesome` uses fixed provider endpoints and independent caches. Pluto uses its public channels schedule. Tubi uses the public programming endpoint for the verified channel IDs above. Fawesome uses its official website’s anonymous catalog bootstrap and horror shelf, with page numbers 0–2. Only movie metadata and official watch destinations are returned; anonymous session values and streaming/DRM resources are excluded.

These are working public website integrations, not promised or licensed third-party developer APIs. Region and title availability are determined by the providers and can differ between a local machine and a Cloudflare edge. Each provider shows a clear unavailable state with an official destination if fetching fails. Verify all three tabs after uploading to Cloudflare.

Local verification on 2026-10-03: all three real feeds returned 200 (5 Pluto channels, 8 Tubi channels, 60 Fawesome films); tested current listings, channel controls, title search, refresh, real airing calendar source/timestamps, rapid provider switching, simulated outage/recovery, and layouts at 390/768/1440 pixels. No browser JavaScript exceptions or horizontal overflow. Confirmed official Fawesome destinations for The Evil Dead and Friday the 13th (Uncut). Playback occurs at the official services and was not tested end to end.

Visual update verification: 84 film records, original Halloween through Part V in order, ten working October cards, film dossier/IMDb destinations, both October double bills, neon/rain effects, Atmosphere OFF and reduced-motion behavior, opt-in sound, animated search results, every local image, and widths 390/768/1024/1440. No browser exceptions or horizontal overflow. `night-effects.js`, `night-effects.css`, `assets/open-neon.svg`, and `assets/october-night.svg` are original implementations; no additional third-party effects runtime was added.

The current OPEN / AFTER DARK sign uses the original generated transparent PNG `assets/open-neon-battered.png`: realistic chipped enamel, rusty chains, three bullet impacts, cracked glass, broken neon tube, frayed cable, and peeling quote sticker. The earlier custom SVG is retained as a design source. Existing sway, flicker, Atmosphere OFF and reduced-motion controls still apply.

Compact crypt verification: initial view shows eight category cards; selected aisles show at most eight films per stack. Checked pagination, category matching, full local search, empty results, decade filters, dossier opening, and layouts at 390/768/1440 pixels without horizontal overflow or JavaScript exceptions.

## All-movies search

Header search now has separate Our shelves and Search all movies modes; the crypt also opens the all-movies mode. IMDb results load 12 at a time through `/api/movies`, with signed requests in `_worker.js`. Live IMDb access is not configured. The interface displays a connection-pending message while local shelves keep working. See IMDB-INTEGRATION.md for server-only secret configuration and remaining live/schema verification. No secrets are included in the upload ZIP.

Trioxin 245 collection: five films in release order, local sourced covers, individual dossiers, IMDb reference links and rental-shelf actions. Four sequels added to the searchable archive; a 2000s decade option covers the two 2005 entries. Verified all covers/dossiers and layouts at 390/768/1440 with no browser exceptions or overflow.

Final launch pass: removed prospective intermission copy, synchronized Trioxin save controls, removed duplicate filter renders, added branded 404 and robots.txt, and verified the core interface and real three-provider feeds. See LAUNCH.md for deployment handoff and remaining external configuration.

Atmospheric backdrop: original midnight-graveyard.svg with cemetery markers, skeletal trees, moon, distant drive-in screen and lurking figure. Two soft CSS fog layers drift behind content, stop with Atmosphere OFF/reduced motion and pause while the page is hidden. The battered OPEN sign is smaller, perspective tilted and positioned within the storefront window, with softened tube light and a wall reflection.

The Midnight Lounge is the custom Cloudflare forum at /community. Google account setup is pending; see COMMUNITY.md. The trailer pool now chooses its featured tape every three hours, checks the clock every 30 seconds and upon returning to a tab, and postpones a switch while an embedded trailer is playing. The original 12-hour editorial movie rotation remains separate.
