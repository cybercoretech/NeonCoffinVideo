# Shared navigation and neon finish — October 7, 2026

Help Desk and Theme Packs now appear at the top of MENU on the storefront and Midnight Lounge. Their previous floating launchers and unused launcher CSS were removed. Both actions keep their existing dialogs, restore focus to MENU when closed, and close the dropdown when chosen. The Lounge menu also includes Back to the Store and House Rules. Dropdown height and position follow the complete header and available viewport; legacy CSS that hid directory links at tablet widths no longer applies to this menu.

The approved fonts and artwork are retained. Pink headline glow is tighter; section labels, selected section-title lines, menu icons, feature titles, and small header/divider accents use the active theme's neon green.

## Effects shipped

- A two-pixel reading-progress strip on both pages, updated from the real scroll distance and document height. Dynamic catalogue/member/conversation layouts are observed for height changes.
- Green pointer highlights on menu items for devices with a mouse or other fine pointer.
- A slow, thin neon border sweep around Tonight's Feature in the Lounge.
- An occasional low-opacity VHS scanline shimmer over the feature poster.

Decorative motion follows Theme Packs → Atmospheric effects, the storefront Atmosphere switch, and the device's reduced-motion setting. The feature animations pause offscreen and while the tab is hidden. The reading strip is driven by scrolling rather than an autonomous animation. No new third-party effects dependency was added.

## Research and adaptation

[DiagPrint](https://cybercore-tech.github.io/diagprint/) was inspected directly, including its [effects script](https://cybercore-tech.github.io/diagprint/assets/js/fx.js?v=7) and [stylesheet](https://cybercore-tech.github.io/diagprint/assets/css/site.css?v=7). Its progress indicator, restrained neon frame, and pointer-highlight concepts were adapted into the existing Neon Coffin design. The additional poster shimmer fits the site's video-store identity.

Implementation references: [MDN conic gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/conic-gradient), [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), and [animation performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate). Automatic full-screen flicker, confetti, and the DiagPrint neural mesh were not added.

## Verification

- Existing `npm test` suite passed; public catalogue, counters, authentication, community, navigation, Help, and membership checks remain green.
- `npm run build` succeeded using the explicit public-file allowlist.
- Headless Chromium checks passed locally and against production at 1440, 900, and 390 pixels: all directory links remain available, both utility dialogs open from MENU, themes apply/reset, Escape and focus restoration work, menus/dialogs fit the viewport, reading progress tracks scroll, and motion controls work.
- The live Lounge feature pauses offscreen and its new animation is disabled by reduced motion/effects-off. No uncaught browser exceptions were observed.
- New CSS served by the production domain matched the checked source.

The repeatable browser check is `website/tests/neon-navigation.browser.mjs`. Run from the website directory with `NCV_CHECK_ORIGIN=https://neoncoffinvideo.site node tests/neon-navigation.browser.mjs`. Chromium defaults to `/usr/lib/chromium/chromium`; override with `NCV_CHECK_BROWSER` if needed. This check uses a fresh anonymous browser profile and writes screenshots to `/tmp`.

Production: Cloudflare Pages project `neoncoffinvideo`, branch `main`, account `f770e07e62b976b12330421edcf2a7d9`. Implementation commits: `be79ed2` and `fabfc12`. Production deployment: `200cfcb7` ([deployment URL](https://200cfcb7.neoncoffinvideo.pages.dev)). Live screenshots accompany this note.
