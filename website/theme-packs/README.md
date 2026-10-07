# Cybercore Theme Packs — Halloween Collection

Open **Theme Packs** at the bottom right of the homepage or lounge. Eight illustrated themes are available; **Restore original** restores Neon Coffin's default appearance. Selection is saved per browser. **Copy theme link** creates a URL that selects the theme for its recipient. Atmospheric effects can be disabled and respect device reduced-motion settings.

The web adapter follows the CYBERGRID palette keys and picker behavior from https://cybercore-tech.github.io/ (verified against the deployed app.js on 2026-10-06). This is a website integration, not a native desktop .cyberpack installer.

- `halloween.json`: source manifest, palettes, original scene coordinates, film inspirations.
- `catalogue.js`: generated synchronous catalogue for restoring a palette before first paint.
- `boot.js`: palette mapping, scoped persistence, URL selection and cross-tab theme updates.
- `panel.js` / `panel.css`: accessible native dialog, preview cards, share/reset/effects controls.
- `themes.css`: scoped website and lounge treatments. Original styling remains the default.
- `art/`: two original AI-generated scene atlases, preserved at source resolution. SVG viewports crop the eight scenes at render time. Artwork is loaded only for selected themes or when opening the picker.

Storage keys: `cybercore-theme:neoncoffinvideo` and `cybercore-effects:neoncoffinvideo`. Storage denial falls back to session-only selection. Movie names identify inspiration, not affiliation or licensed film imagery. See SOURCES.md.

Regenerate with `node scripts/build-themes.mjs`; `npm run build` includes this step. Browser checks: `PLAYWRIGHT_MODULE=/path/to/playwright node tests/themes-browser.cjs`. Set TEST_URL to check another deployment. Tests create screenshots under `/tmp/ncv-theme-review` by default.
