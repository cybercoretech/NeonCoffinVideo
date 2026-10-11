# Cybercore Theme Packs — Halloween Collection

Open **MENU → Theme Packs** on the storefront or Lounge. Eight original wallpapers are available. Choose a card to apply its theme; **Restore original** restores Neon Coffin’s default appearance. Theme colors use neutral black/charcoal surfaces with neon accents. The Midnight Lounge always keeps `assets/midnight-pier-cliffs.webp`, independent of the chosen theme.

The last deliberate choice is saved per browser, while each open tab pins its own choice across reloads and storefront/Lounge navigation. Other tabs cannot switch it. Shared theme URLs suggest a theme in the picker; they never apply or save it automatically. **Copy theme link** still creates a shareable suggestion. Effects preferences remain separate and respect reduced motion.

- `halloween.json`: source manifest, palettes, dedicated wallpaper files and film inspirations.
- `catalogue.js`: generated synchronous catalogue for restoring a palette before first paint.
- `boot.js`: palette mapping and explicit, stable theme persistence.
- `panel.js` / `panel.css`: native dialog, previews, share/reset/effects controls. Theme scenery is attached only to the storefront.
- `themes.css`: scoped styling and lightweight particles. No haze overlays or theme-controlled Lounge wallpaper.
- `art/*-wallpaper.webp`: eight full-frame, native-resolution original AI illustrations. Lossless WebP conversion preserves pixels without enlargement or artificial sharpening. Existing atlas files are retained as historical source assets but are no longer used by the picker or storefront.
- `art/*-preview.webp`: small 384 × 256 picker previews; applying a theme loads its full-resolution wallpaper.

Storage keys: `cybercore-theme:neoncoffinvideo`, `cybercore-theme:neoncoffinvideo:tab` (session storage), and `cybercore-effects:neoncoffinvideo`. If storage is denied, visitors can still choose a theme for the current document. Movie names identify inspiration, not affiliation or licensed film imagery. See SOURCES.md.

Regenerate with `node scripts/build-themes.mjs`; `npm run build` includes this step. `node tests/theme-preferences.mjs` covers URL, cross-tab, reload and Lounge isolation regressions. The repeatable browser checks are `tests/themes-browser.mjs` and `tests/neon-navigation.browser.mjs`; set `NCV_CHECK_ORIGIN` to the preview or deployment origin and `NCV_CHECK_BROWSER` if Chromium is installed elsewhere.
