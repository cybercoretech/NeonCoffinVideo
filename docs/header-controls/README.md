# Storefront header control alignment — 2026-10-09

The storefront action buttons had different heights, padding, typography and widths. Search, Live TV, membership, rental shelf and Menu now use five equal-width grid slots, a shared 48px height, 2px border, 20px icons and consistent rental-label typography. The menu no longer has an extra permanent outer outline; keyboard focus retains a clear cyan indicator.

On phones the logo occupies its own row and all five controls form one evenly spaced row beneath it. Compact tablet and phone controls retain accessible names and the shelf count. Older rules that hid the TV icon and desktop shelf label are overridden within these controls only. Long handles truncate inside the button without changing its dimensions.

## Validation

- Production build passed.
- Store navigation and site membership checks passed.
- Native Chromium browser checks passed locally and against https://neoncoffinvideo.site/ on the storefront and Lounge at widths 1440, 900, 768, 600, 540, 430, 390, 360 and 320px.
- Storefront assertions checked five equally wide, aligned 48px controls, visible icons, accessible labels, no viewport overflow and short/maximum-length handles.
- Desktop assertions checked the ordinary handle and shelf label fit without clipping.
- Existing checks verified uniform dropdown tiles, menu links, Help Desk, Theme Packs, Lounge rules, keyboard dismissal/focus return, motion preferences and no uncaught browser errors.
- Screenshot handle @NeonDemon_74 is a DOM-only label simulation in a fresh browser, not a signed-in account or a Google authentication test.

## Publication

Code commit: 94831c8.
Cloudflare Pages target: neoncoffinvideo.
Production deployment: https://8ec2fec4.neoncoffinvideo.pages.dev/.
Live domain: https://neoncoffinvideo.site/.

Screenshots were captured from the live custom domain after deployment. They show the opened menu as well as the header; cyan keyboard focus outlines may appear around the active menu control.
