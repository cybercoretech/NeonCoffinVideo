# Consistent rental directory sizes and neon horror icons

Completed October 9, 2026 for the main site and Midnight Lounge.

All navigation tiles, including Shop Merch, share a 76px height, equal column widths, consistent padding and aligned icon/title/subtitle positions. Screens up to 600px use full-width single-column rows; wider screens use two equal columns. Long menus scroll within the available viewport. Shop Merch now fills the last desktop grid cell, eliminating the former empty gap.

Original inline vector icons replace the generic symbols: VHS cassette, rental rack, haunted CRT, jack-o-lantern, bat/skull host, coffin theme pack, neon storefront, double tapes, coffin Lounge, and a coffin-print shirt. Help uses a skull headset; rules use a stamped rental card. Menu toggles now depict a VHS cassette. Icons are decorative, with accessible text labels retained.

## Validation

- All nine existing npm test suites passed and the production build completed.
- Real-browser local and production checks passed on both pages at 320, 360, 390, 430, 540, 600, 768, 900 and 1440px.
- Browser assertions measure actual tile heights and widths, check label clipping and icon presence, and verify the single-column breakpoint.
- Existing checks cover viewport fit, no horizontal overflow, menu navigation, Help/Theme/Rules dialogs, keyboard focus, themes, effects toggle, reduced motion and reading progress. No uncaught browser errors occurred.
- Source files and Git mirror match.

Code commit: `1b3f56b`. Production Cloudflare Pages deployment: `611f7f7c` at https://611f7f7c.neoncoffinvideo.pages.dev. Live screenshots saved alongside this report were captured from https://neoncoffinvideo.site.
