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


## Two sides of the site (user decision 2026-10-14) — never mix them

- **The Video Store** is Neon Coffin Video in **Old Orchard Beach, Maine**: homepage, rental shelves, Lounge, Late Show, Late Returns, shop. It uses the store chrome (issue strip, NCV header, store menu, genre footer). Harrow Point town content does not appear on store pages; the store menu's highlighted first stop is **The Viewing Room** (`/viewing-room`).
- **The Viewing Room** is the store's back room and the only portal: a dirty green sofa, a 1950s console TV hard-wired to a Betamax deck, and the only Betamax tape on a shelf of VHS. Playing it sets `sessionStorage['hp-arrival']` and lands on `/harrow-point`, where `shared/harrow-point-arrival.js` shows the arrival overlay. Travelers are not counted (population stays 182); most are eventually returned. The Night Manager knows, and encourages teens, who meet Silas Vale. His lines are drafts in a light Massachusetts voice; the user (who grew up in Montague, MA and West Brattleboro, VT) is the authority on dialect.
- **Harrow Point** (`/harrow-point`, `/harrow-point-ledger`, `/hptv-13`) has its own chrome in `shared/harrow-point-chrome.css`: `.hp-strip`, `.hp-header` with the blackletter wordmark and town menu, and `.hp-footer`. No store logo, membership, search, store menu, store footer or `store-nav.js`. The only way back is **Be returned** (`[data-hp-return]` → `/viewing-room`, flagged by `shared/harrow-point-return.js` so the Night Manager greets returning Travelers). Tests enforce the separation.

## Harrow Point Ledger and HPTV (2026-10-13)

- The dedicated resident and history archive is `/harrow-point`, titled **The Harrow Point Ledger**. Keep complete town lore and the cast roster on that page; homepage, Lounge, Late Returns, and main menus use direct links instead of injecting a wide profile grid. Character data is in `shared/harrow-point-characters.js`.
- The town paper is **The Harrow Point Undertow** (renamed from the Lantern on 2026-10-14; the URL `/harrow-point-ledger`, `lantern-*` classes, `data-town-story="lantern"` and `lantern-paper-texture-v001.webp` keep their old internal names). Its page is a period broadsheet: UnifrakturMaguntia masthead, IM FELL English body (OFL, bundled in `assets/fonts/`), black-ink engravings `assets/harrow-point/undertow-*.webp`, and in-world ads, over the `ephraim-pike-press-background-v001.webp` pressroom background. Keep anchors `#front`, `#notices`, `#margins`, `#pressman`. A Widow's Rise graveyard lantern is separate lore and keeps its name.
- When you change `shared/harrow-point-characters.js` (or another shared script/stylesheet), bump its `?v=` query on every page that loads it; otherwise browsers that already have the old copy keep it (PR #17).
- **The 1821 town plan and the Fixed Points** (2026-10-14): `/harrow-point#town-map` is a textless Codex map (`assets/harrow-point/harrow-point-1821-plan-v001.webp`) with HTML labels and numbered lot pins over it; pins and the cards below share `data-hp-place` keys handled by `shared/harrow-point-places.js` (text, “What the town doesn’t say”, local account, and a note from the 1821 survey). Lots: I Neon Coffin Video (Founders’ Row), II The Old Harbor, III Low Tide Mortuary, IV The Amusement Pier, V Widow’s Rise, VI Vesper House, VII The Sawmill Road, VIII **The Wayfarer’s Rest** (coaching inn), IX **The Graveyard Shift** (1953 railcar diner on Quay Street). Streets: the Old Coast Road (the only road in), Sawmill Road, Lantern Lane, Blackthorn Hill Road, Cooper’s Row, Founders’ Row, Bell Street, Quay Street, Low Tide Lane. **Hidden puzzle (do not break):** one small-caps word per survey note, read in lot order, spells “EVERYONE HERE ARRIVED BY THE SAME ROAD NOBODY LEFT”; a test enforces it. Clues are suggestive only (stones dated before arrival, no recorded low water, Received/Returned ledger, one tape per resident ending at arrival, the deed “for the keeping of those not yet finished”); never state the answer.
- **Timeline records** (2026-10-14): the five `#timeline` cards (1821, 1951, 1964, 1979, 1996) open detailed records through the same dialog (`data-hp-place="y1821"` etc. in `shared/harrow-point-places.js`, with an “In the margin” note instead of a survey note). New canon there: the 1821 minutes open “The town having arrived…”, record 182 present, and carry “Population to be kept” in the margin; the 1821 harbor ledger lists “E. Rook, master, with dog” under Expected, struck through and marked Arrived in 1996; the 1951 opening-day film shows residents who arrived decades later; WHP-TV’s first log reads “Signal on. Audience present.”; in 1979 the guests on the beach stood facing the coast road and Silas Vale took tickets at the gate; the 1996 Gale struck only Harrow Point. The pier file uses Silas Vale’s portrait.
- **The Mayor’s House** (2026-10-14): a white Federal house on Meeting House Square between the church and the Town Hall, with Dr. Abbot’s guest cottage behind its walled garden. On the 1821 plan it is the only building with no lot number (✦ pin, place key `mayorhouse`, survey note “Not to be let. Already occupied.”), so it carries no puzzle word. The Mayor’s population book always totals 182.
- **Dr. Cornelius Abbot** (user decisions 2026-10-14): the town doctor, already in the Undertow obituaries (pronounced himself dead in 1931). He lives in the small guest house at the Mayor’s house, keeps no office, and makes house calls only. Profile id `doctor`.
- **The Culvert Lamprey** (canon 2026-10-14, named by the user): an eyeless, eel-like creature with a round toothed sucker mouth living in the drain culvert under the coast road, directly beneath the Welcome to Harrow Point sign (half-hidden there in `hptv-last-way-out-background-v006.webp`). It never troubles anyone arriving; it is for people trying to leave after dark, who wake back in town with a round toothed mark on the bumper. Profile id `lamprey` in `shared/harrow-point-characters.js`.
- Harrow Point funerals (canon 2026-10-14): a death is recorded, a service is held, an Undertow obituary is printed, and a stone is cut and dated on Widow's Rise's north wall — yet the deceased usually attends their own funeral and carries on. That explains the empty dated stones. The town treats it as ordinary; remarking on it is poor manners. A few are truly gone (the 1979 Pier Ballroom Orchestra, the crew of the *Annie Thorne*, overdue since 1985). The Undertow's `#obituaries` section ("From the Morgue Files", 1821–present) lists them with a ledger-style status line.
- The Late Show is broadcast from **HPTV Channel 13**, official call sign **WHP-TV**. **Marlow Vane** is the only known employee and host. The faceless hooded camera figures reflected in the studio are called **the Blackbacks**. Station artwork and marks live under `assets/late-show/`; page styling is in `late-show.css`.
- Keep website code, lore, profiles, logos, and web artwork in the `NeonCoffinVideo` repository. Animation source files, voice tracks, and renders belong in `/home/raven/Animations/NCV_Animations` and its `NeonCoffinAnimations` repository. Do not create a third repository for ordinary website art or lore.
