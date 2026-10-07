# Neon Coffin Video footer logo

Published October 7, 2026, website commit `33c974e`, Cloudflare Pages deployment `426f9f40`.

The footer now uses a single transparent coffin-and-wordmark logo: hot pink NEON COFFIN, acid green VIDEO, and cyan VHS accents. Original artwork is 2067 × 761 pixels. The website uses a lossless WebP; reusable PNG/WebP copies are in `merch-pack/branding/` and the local `neon-coffin-merch-pack/branding/` folder. The generator supports an optional logo per site, retaining the emblem/text fallback for the shared footer's other brands.

The Lounge had an extra generated footer inside the rules dialog. The footer build now removes old generated footer copies and inserts one visible footer after main, keeping the popup free of duplicate site links.

Verification:

- `npm run build` passed; `npm test` passed all nine existing suites.
- PNG/WebP transparency and original dimensions checked; no enlargement.
- Local and live Chromium checks passed on both storefront and Lounge at 1440px, 768px, and 390px: artwork loads, logo stays within the viewport, no horizontal overflow, home link has a readable accessible label, and there is exactly one shared footer.
- Live desktop and phone screenshots inspected and saved here.

Live site: https://neoncoffinvideo.site/

## Matching storefront header

Published matching artwork in the top-left storefront header beneath THE MONTHLY MIDNIGHT FILE. Website commit `62e8810`, deployment `dbb9eccd`. Header and footer reference the identical logo file. Desktop logo is 200px wide; the mobile layout fits logo and buttons in one row at 390px, using two rows below 380px.

Local and live Chromium checks passed at 1440, 900, 768, 390, 360, and 320px: logo loads, no horizontal overflow, no overlap with header controls, menu opens, and artwork matches the footer source. The existing navigation browser check passed on both pages, including Help/Theme Packs, keyboard/focus, theme changes, effects preferences, and reading progress. Live desktop/phone screenshots attached.
