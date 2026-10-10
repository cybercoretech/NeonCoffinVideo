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
