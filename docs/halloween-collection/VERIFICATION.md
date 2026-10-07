# Halloween Collection — 2026-10-06

Production: https://neoncoffinvideo.site/
Deployment: https://5abddd51.neoncoffinvideo.pages.dev

Eight original movie-inspired scene treatments, Cybercore palette adapter, illustrated theme dialog, original reset, persisted preference, URL sharing, atmospheric effects controls and reduced-motion handling. Available on homepage and lounge. Default visitors retain the original Neon Coffin theme; scene atlases load only when needed.

Passed locally and against production:
- Eight selections and matching scene references; one active card.
- Original page does not request the two theme atlases.
- Selection survives reload and homepage-to-lounge navigation.
- Shared URL overrides saved theme; reset preserves unrelated URL parameters.
- Desktop 1440px, tablet 768px, mobile 390px; no horizontal overflow.
- Effects preference persists; device reduced motion disables effects control.
- Escape closes the dialog and restores trigger focus.
- No JavaScript page errors.

Also passed: npm test (counter, community, OAuth mock suite), npm run build, existing footer/film-credit browser regression. All white/muted/primary accent palette pairs on base and panel backgrounds exceed 4.5:1; this is a palette check, not a full accessibility audit. Screenshots in this directory record local design review; production ran the same theme browser checks.

Original art and pack source: website/theme-packs/. Artwork provenance: website/SOURCES.md. Nothing changed in the other network sites or Fourthwall store.
