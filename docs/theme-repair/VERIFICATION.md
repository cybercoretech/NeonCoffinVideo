# Theme stability, permanent Lounge forest, and neon surfaces

Published October 7, 2026 to Cloudflare Pages project `neoncoffinvideo`, production branch `main`.

- Website commit: `13b6c21`.
- Deployment: `297fd6b4` — https://297fd6b4.neoncoffinvideo.pages.dev
- Live target checked: https://neoncoffinvideo.site/

## Result

Theme choices persist for the current tab across reloads and storefront/Lounge navigation. Shared or old theme URLs suggest a choice without applying it. Saving a theme in another tab cannot silently replace this tab's choice. Restore original remains available from MENU → Theme Packs.

The Lounge retains the approved `assets/midnight-forest.webp` and exactly the same background gradients for the original appearance and all eight themes. Theme scenery and atmosphere elements are restricted to the storefront hero.

All eight themes now use dedicated 1536 × 1024 original AI wallpapers rather than cropped atlas quadrants. The delivered full-size WebP files match the generated RGB pixels exactly, including four revisions that replaced wine-red materials with neutral surfaces. Small 384 × 256 thumbnails serve the picker. Haze overlays and image filters were removed. Text shading remains behind the storefront copy for readability.

Maroon panel fills, frames, and muted shadows were replaced across the storefront, Lounge, membership, Help Desk, Theme Packs, navigation, counters, and shared footer. Surfaces are black/charcoal with available neon green, cyan, hot pink, and the selected theme's bright accent colors. Approved movie posters and the Lounge forest remain unchanged.

## Validation

- `npm test`: all nine suites passed, including catalogue, counters, community, OAuth, membership, UI, Help, navigation, and theme preferences.
- `npm run build`: passed; production assets and the existing Worker were packaged.
- Exact RGB pixel comparison: all eight full-size wallpapers passed; all eight preview dimensions passed.
- `node tests/themes-browser.mjs`: local Chromium passed all eight picker/hero images, desktop 1440px and mobile 390px widths, no horizontal overflow, stable choice after reload/old URL/second-tab changes, permanent Lounge forest under original plus eight themes, neutral rail cards, and no uncaught browser errors.
- `NCV_CHECK_ORIGIN=https://neoncoffinvideo.site node tests/themes-browser.mjs`: the same checks passed against production after deployment.
- Live screenshots were inspected for readable text, sharp artwork, neutral frames, working live counters, and loaded Lounge discussions/presence. No authenticated Google login was performed by these visual checks.

Attached screenshots show the published picker, two desktop themes, a mobile theme, and the Lounge on desktop/mobile.
