# Expanded NCV rental rack — October 10, 2026

Production: https://neoncoffinvideo.site/screening-room#rentalRack

261 distinct 1980–1999 horror titles, including 155 films from the 1980s and 106 from the 1990s. Nine categories plus All tapes. The shared storefront and Lounge catalogs now include the additional 92 titles, for 287 curated films across their broader historical range.

- Full npm test passed, including catalog uniqueness/paths, auth/session regressions, counters, shared membership, bot integration, Friday/RSS/calendar, initial HTML SEO and rental filtering.
- npm run build passed; repeat builds preserve the same metadata, 261 initial HTML cards and source credits without duplicate content.
- Every local poster fully decoded with Pillow. Image signatures, file existence, 1980–1999 dates, source provenance and unique cover hashes passed. All six labeled visual audit sheets were inspected. The 47 previous in-period placeholder sleeves were replaced.
- Chromium checks passed locally at 1440, 768, 390 and 320 pixels: no page/rack overflow, consistent menu tiles, all categories, title search, empty state/reset, decade filtering, newest sorting, keyboard rack scrolling, and every one of the 261 local tape files with its matching poster and credit.
- Existing nested issue dialogs, Google Groups signup handoff, saved-shelf preservation, user-triggered preview embeds/fallback, reduced motion and Lounge screening context passed. One temporary local account was used to check the prefilled discussion composer; no post was submitted.
- The bulk audit disables Chromium navigation-IPC throttling in the test browser because it changes hundreds of hashes at automated speed. This flag is not used by the deployed site or visitors.

Film posters belong to their rights holders; provenance is documented individually in artwork-sources.json and SOURCES.md. Low-resolution source posters remain low resolution, and landscape artwork/VHS sleeves remain uncropped. The selection uses original NCV notes and facts discovered through the Rotten Tomatoes decade guides; it does not reproduce another site's ranking, scores, reviews or synopses.

Only the previously verified six Tubi picks retain direct movie offers. Other tape files provide a clearly labeled search link; streaming availability is not inferred. No newsletter sends, Google Group membership changes or live discussion posts were made.

Deployment: https://4857e36e.neoncoffinvideo.pages.dev (existing neoncoffinvideo project, main branch). Live initial HTML contains 261 film cards, live rack data matches the reviewed build, and the existing Google sign-in config remains ready.

Production Chromium checks passed at all four viewport widths, including every one of the 261 tape-file posters and credits. The main storefront now reports 287 tapes; Scream 2 opens with its actual poster and film-reference link, and the new Mind games category browses correctly. No live accounts, discussions, subscriptions or emails were created.
