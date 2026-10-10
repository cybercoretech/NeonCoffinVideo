# Late Show deployment validation — October 9, 2026

Production: https://neoncoffinvideo.site/screening-room
Cloudflare deployment: https://2b226a17.neoncoffinvideo.pages.dev
Target: existing Pages project neoncoffinvideo, production branch main.

- npm test: full existing suite and new Late Show tests passed.
- npm run build: public allowlist build and worker bundling passed.
- Local and production Chromium checks passed at 1440, 768, 390, and 320 pixels: menu fit and consistent tile heights, images, filters, nested local tape dialogs, shelf preservation, user-triggered privacy-enhanced preview player, external preview fallback, Google signup handoff, reduced motion, and Lounge screening context.
- Live /api/late-show/newsletter returns the public Google Group URL.
- Live RSS publishes issue 001; future issues remain unpublished.
- Live calendar returns October 9 at 8 PM Pacific (October 10 03:00 UTC). Unit tests also verify post-DST November times.
- Live Lounge config remains ready with googleConfigured=true. An actual Google login was not initiated as part of this feature validation.

No Google Group membership changes, newsletter sends, or live discussion posts were made. Google Group owner settings are not independently verified. Full film playback depends on the official service's regional availability. Official preview metadata was checked; iframe loading/controls/fallback were tested, not a guarantee of worldwide YouTube playback.

The signed-in Friday discussion composer was also checked using a temporary local account: correct category, selected film, double-bill title, and question are prefilled. No discussion was submitted. The HTTP test fixture supplies its session header; secure production cookie handling is covered by the existing authentication suite.

## Poster and SEO update — October 10, 2026

Final deployment: https://e9897f9f.neoncoffinvideo.pages.dev

- All eight distinct films in the rental rack and preview deck use real local film poster JPEGs. The audit opened and decoded every tape-file poster and checked its source link. Existing catalog artwork was reused; Lifeforce's missing poster was added and its provenance recorded.
- Actual poster dimensions are preserved without cropping; landscape artwork is letterboxed inside the portrait rental sleeve. Desktop and mobile rental-rack screenshots are included here.
- Full npm test suite passed, including cover-file checks, OAuth/session regressions, counters, catalogue completeness, and the new SEO checks.
- Local and live Chromium checks passed at 1440, 768, 390 and 320 pixels with all image decodes, menus, filters, nested tape files, saved shelves, preview controls, newsletter handoff and Lounge context. No live account, post, membership or email mutation occurred.
- The live screening-room response contains six complete editorial rental cards before JavaScript runs. Distinct page titles/descriptions, canonical URLs, social metadata, truthful structured data, sitemap.xml and the robots sitemap directive are deployed. Repeat build output is stable.
- Live community config reports ready=true and googleConfigured=true; a real Google login was not initiated.
- Owner promotion documents include a complete 30-second Short script, shot list, upload copy, first-week plan, Search Console steps and sourced AdSense guidance. No video was rendered/uploaded, Search Console property verified, sitemap submitted, or AdSense publisher account connected.
- Poster attribution documents provenance and ownership; it is not a reuse license. The Short plan uses original NCV graphics and the owner's own voice rather than assuming movie footage, soundtrack or poster marketing rights.
