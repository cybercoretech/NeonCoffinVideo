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
- The Late Show is broadcast from **HPTV Channel 13**, official call sign **WHP-TV**. **Marlow Vane** is the only known employee and host. The faceless hooded camera figures reflected in the studio are called **the Blackbacks**. Station artwork and marks live under `assets/late-show/`; page styling is in `late-show.css`.
- Keep website code, lore, profiles, logos, and web artwork in the `NeonCoffinVideo` repository. Animation source files, voice tracks, and renders belong in `/home/raven/Animations/NCV_Animations` and its `NeonCoffinAnimations` repository. Do not create a third repository for ordinary website art or lore.
