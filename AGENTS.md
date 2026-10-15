# Neon Coffin Video website

These instructions apply to this repository. The related animation workspace is
`/home/raven/Animations/NCV_Animations/`; see its `AGENTS.md` for the film and voice production.

Before editing, inspect the existing Night Clerk implementation and site design.
The 2026-10-14 site split supersedes the earlier store-in-Harrow-Point setting.
Keep the video store and town as separate experiences; the Viewing Room connects them.
Treat the approved details below and `website/AGENTS.md` as the source of truth:

- The Night Manager grew up near Boston, Massachusetts, and now lives in
  Old Orchard Beach, Maine, where Neon Coffin Video is located. He retains his natural
  Massachusetts accent, worn low rasp, and faint squeak at phrase endings.
- Harrow Point has the Amusement Pier, Widow's Rise Burial Ground (the old
  cemetery on the hill), and Low Tide Mortuary.
- The Amusement Pier's music sometimes plays after midnight. The Night Manager
  remembers its fire and rents a tape of opening day.
- Harrow Point first appears in surviving town records in 1821, already settled.
  People do not move there; they simply arrive and find a place and a purpose.
  The town has no resident children or teenagers. The one local openly called
  young is a 27-year-old drifter who appeared at the old sawmill during the
  October Town Festival.
- **The Drowned Bell Gale** is the name of the storm during which Captain Elias
  Rook and Bosun appeared in the harbor in 1996. Rook is from Croatia's Adriatic
  coast and built his own ship as a young man before wandering port to port with
  Bosun. The harbor ledger dated 1821 already bears Rook's name.
- The town's paper is **The Harrow Point Undertow**, a weekly Sunday edition
  founded in 1821 and printed by Ephraim Pike. Its final Sunday issue each month
  includes a cryptic column called “In the Margins.”
- The Mayor, Alastair Wainwright (the town's sole constable, carrying a baton),
  Margaret and Isabelle Harrow, Aurelian Harrow, Vera Wren, Edmond Vale, and the
  creatures associated with Vesper House are fictional NCV canon. Preserve their
  profile details in `website/shared/harrow-point-characters.js`; keep mysteries
  suggestive rather than fully explained.
- The Harrows are vampires of Transylvanian origin with a claimed bloodline and
  correspondence connection to Vlad III Dracula. Aurelian is over 500 and never
  leaves Vesper House. The Mayor is over 200 and still looks about fifty.

Keep fictional Harrow Point lore distinct from factual claims about Old Orchard
Beach. Research and sources are in
`/home/raven/Animations/NCV_Animations/episodes/001-be-kind-rewind/planning/harrow-point-research.md`.
Preserve the site's established voice and visual system, and avoid changing
unrelated pages or behavior while bringing these details into the Night Clerk's
character and town feel.

The user separately plans to finish the voices and place dialogue into the
animated short. Do that in `/home/raven/Animations/NCV_Animations/` and follow its instructions.

## Late Returns (animated section)

The user named the site's planned animated/cartoon section **Late Returns**
(decided 2026-10-10; checked against existing site names such as The Late Show,
The Midnight Lounge and "After Hours"). Its first tape is the short
*Be Kind. Rewind.* The widescreen cut belongs on the site; a vertical cut goes to
YouTube Shorts to bring viewers here, with `NEONCOFFINVIDEO.SITE` on screen.
Finished videos and build notes are in `/home/raven/Animations/NCV_Animations/`.

## The store, Harrow Point, and the Night Manager (updated 2026-10-14)

- Neon Coffin Video and the Night Manager are in **Old Orchard Beach, Maine**.
  Homepage, Lounge, Late Show, Late Returns, rental shelves, and shop use the store
  chrome. Do not place town boards, town navigation, or HPTV on store pages.
- **The Viewing Room** (`/viewing-room`) is the only portal: a dirty green sofa,
  a 1950s console TV hard-wired to a Betamax deck, and one Betamax tape among VHS.
  Playing it brings Travelers to **The Waking Room**, Lot I on Founders’ Row in
  Harrow Point. They have no memory of the journey. Travelers do not count toward
  the population of 182; most are eventually returned to the store's Viewing Room.
  The Night Manager knows what happens and encourages curious visitors, including
  teens in the fiction who encounter Silas Vale. The Lounge remains adults-only.
- Harrow Point, the Undertow, and HPTV have their own town chrome. **Be returned**
  is the way back to the Viewing Room. Town profiles and landmark dialogs stay on
  the town side. The Night Manager is not a resident, though his face appears in
  the 1821 Town Hall portrait. Keep the reason mysterious.
- HPTV Channel 13 / WHP-TV airs **The Late Film**, hosted by Marlow Vane.
  **The Late Show** is the video store's separate programme.
- The host is **the Night Manager** in visitor-facing copy. Internal `night-clerk`
  names, IDs, Worker name, and `bot:night-clerk` remain unchanged.
- Town story text lives in `website/shared/harrow-point-stories.js`; character
  profiles in `harrow-point-characters.js`; place and timeline records in
  `harrow-point-places.js`. Preserve the nine survey words and their lot order.
- Landmark canon remains fictional: the pier opened Memorial Day 1951 and burned
  Labor Day night 1979; its carousel organ was never found. Widow's Rise has a
  north-wall row of cut, dated, empty stones and a lantern seen when boats are
  overdue. Low Tide Mortuary is a sea captain's house run by one family for four
  generations, with a tidal sea door in the cellar. Keep mysteries suggestive.
- The bot stays on store topics unless asked about town lore; `/town` and
  `/help town` lead to the Viewing Room. Lounge moderation labels say
  "moderators", so the AI host never appears to moderate.
- Pages and the Night Manager Worker deploy separately. Prepare changes on a
  branch and open a PR for the user to merge. Ask before each deployment.

## Site-wide consistency (checked 2026-10-11)

- Every store page opens with the shared `.issue-strip` (pink/green marker, motto left, boxed
  `NCV / <SECTION> /// …` right), then the header.
- Section pages (Lounge, Late Show, Late Returns) show their name under the logo in small
  green mono type (`.brand-page-label` / the Lounge and Late Returns `small`).
- A page's top hero label starts with the glowing green dot: an empty `<span></span>` as
  the label's first child (`.eyebrow` or `.lr-kicker`; styled once in `store-nav.css`).
- Every store menu highlights The Viewing Room, then shows Help Desk, Theme Packs,
  and the full rental directory in the
  homepage's order. Page-only extras go between those: House Rules (Lounge), the Late
  Show's own section links (Late Show).
- Index, Lounge, Late Show and Late Returns all get the generated `genre-footer`
  (`scripts/build-footer.mjs`).
- Shared CSS/JS files carry the same `?v=` stamp on every page; bump it everywhere at once.
- Membership is the pink `.site-membership-button` with the green shield icon on every page
  (label text lives in its own span, so scripts must update the span, not the button).
- Section labels (`.eyebrow`, including ones rendered by scripts) start with a fitting emoji,
  e.g. `🦇 ON THE NIGHT SHIFT`; page-top labels use the green dot instead. Labels whose text
  comes from data (room names, skull ratings) are left as is.
- The `/horror/*` collection pages (generated by `genre-seo-pages.js`) get the strip, header,
  membership button, menu and shared footer from `scripts/build-seo.mjs`, which copies the menu
  from `late-returns.html` so it never drifts. The shared footer uses root-absolute paths so it
  works on nested pages.
