# Midnight Lounge — Night Clerk portrait

The user selected the B / Past Due character and requested that the Night Clerk
be the focal point of https://neoncoffinvideo.site/community.

The Lounge now leads with a large original portrait and an Ask the Night Clerk
action. The portrait itself also opens the existing chat. Mobile layouts put
the artwork first. The chat header shows the same character; the existing film
rotation, discussion, membership and human-host identity remain available.

Source masters, model/expression studies and a layered GIMP document are in the
private `cybercore-tech/NeonCoffinAnimations` repository. The website uses a 1536×1024
WebP export, approximately 400 KB. Artwork provenance is included in SOURCES.md.

Validation: the existing npm test suite and production build pass. Browser
checks cover 1440, 768, 390 and 320 px widths: above-the-fold portrait, no page
overflow, feature rotation, chat opening/closing, catalog responses, conversational
follow-ups, reset and touch-sized controls. Initial screenshots use the local
preview with mocked chat transport; local sign-in configuration differs from production.

Deployment target: existing Cloudflare Pages `neoncoffinvideo`, production branch
`main`, serving `neoncoffinvideo.site`. Deployment uses only generated `dist/`.

Wrangler reference: https://developers.cloudflare.com/pages/get-started/direct-upload/
