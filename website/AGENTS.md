# Neon Coffin Video — project instructions

## Project
- Purpose: ____________________
- Website: https://neoncoffinvideo.site/
- Store: https://neon-coffin-video-shop.fourthwall.com/
- Current priority: ____________________

## Appearance
- Style: ____________________
- Approved fonts and artwork: ____________________
- Things to avoid: ____________________

## Working rules
- Read screenshots carefully and follow the user's description of their actions.
- Verify UI instructions against the current interface. Documentation may be outdated.
- Separate confirmed facts from guesses. Say when something is unverified.
- Preserve approved designs unless the user requests changes.
- Keep answers concise and give concrete next steps.
- Check existing authorization before asking for approval again.
- Budget constraints: ____________________

## Changes and publishing
- Ask before: ____________________
- May proceed without asking: ____________________
- Checks required before publishing: ____________________
- Deployment target: Cloudflare Pages project `neoncoffinvideo`.
- Verify the target before deploying and check the live result afterward.

## Additional instructions
- ____________________
- ____________________
- ____________________

Blank fields mean unspecified; they do not grant permission or override filled instructions.


## Harrow Point Ledger and HPTV (2026-10-13)

- The dedicated resident and history archive is `/harrow-point`, titled **The Harrow Point Ledger**. Keep complete town lore and the cast roster on that page; homepage, Lounge, Late Returns, and main menus use direct links instead of injecting a wide profile grid. Character data is in `shared/harrow-point-characters.js`.
- The town paper is **The Harrow Point Undertow** (renamed from the Lantern on 2026-10-14; the URL `/harrow-point-ledger`, `lantern-*` classes, `data-town-story="lantern"` and `lantern-paper-texture-v001.webp` keep their old internal names). Its page is a period broadsheet: UnifrakturMaguntia masthead, IM FELL English body (OFL, bundled in `assets/fonts/`), black-ink engravings `assets/harrow-point/undertow-*.webp`, and in-world ads, over the `ephraim-pike-press-background-v001.webp` pressroom background. Keep anchors `#front`, `#notices`, `#margins`, `#pressman`. A Widow's Rise graveyard lantern is separate lore and keeps its name.
- When you change `shared/harrow-point-characters.js` (or another shared script/stylesheet), bump its `?v=` query on every page that loads it; otherwise browsers that already have the old copy keep it (PR #17).
- **The Culvert Lamprey** (canon 2026-10-14, named by the user): an eyeless, eel-like creature with a round toothed sucker mouth living in the drain culvert under the coast road, directly beneath the Welcome to Harrow Point sign (half-hidden there in `hptv-last-way-out-background-v006.webp`). It never troubles anyone arriving; it is for people trying to leave after dark, who wake back in town with a round toothed mark on the bumper. Profile id `lamprey` in `shared/harrow-point-characters.js`.
- Harrow Point funerals (canon 2026-10-14): a death is recorded, a service is held, an Undertow obituary is printed, and a stone is cut and dated on Widow's Rise's north wall — yet the deceased usually attends their own funeral and carries on. That explains the empty dated stones. The town treats it as ordinary; remarking on it is poor manners. A few are truly gone (the 1979 Pier Ballroom Orchestra, the crew of the *Annie Thorne*, overdue since 1985). The Undertow's `#obituaries` section ("From the Morgue Files", 1821–present) lists them with a ledger-style status line.
- The Late Show is broadcast from **HPTV Channel 13**, official call sign **WHP-TV**. **Marlow Vane** is the only known employee and host. The faceless hooded camera figures reflected in the studio are called **the Blackbacks**. Station artwork and marks live under `assets/late-show/`; page styling is in `late-show.css`.
- Keep website code, lore, profiles, logos, and web artwork in the `NeonCoffinVideo` repository. Animation source files, voice tracks, and renders belong in `/home/raven/Animations/NCV_Animations` and its `NeonCoffinAnimations` repository. Do not create a third repository for ordinary website art or lore.
