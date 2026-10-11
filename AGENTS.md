# Neon Coffin Video website

These instructions apply to this repository. The related animation workspace is
`/home/raven/Animations/NCV_Animations/`; see its `AGENTS.md` for the film and voice production.

The user plans to update the NCV website to carry the fictional town atmosphere
created for the Night Manager and the short film. Before editing, inspect this
repository's existing Night Clerk implementation and site design. Treat the
approved film details as the source of truth:

- The Night Manager grew up near Boston, Massachusetts, and now lives in the
  fictional Harrow Point, Maine, near Old Orchard Beach. He retains his natural
  Massachusetts accent, worn low rasp, and faint squeak at phrase endings.
- Harrow Point has the Amusement Pier, Widow's Rise Burial Ground (the old
  cemetery on the hill), and Low Tide Mortuary.
- The Amusement Pier's music sometimes plays after midnight. The Night Manager
  remembers its fire and rents a tape of opening day.

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

## Harrow Point and the Night Manager (decided 2026-10-10)

- Neon Coffin Video itself is in Harrow Point. The footer, homepage welcome article,
  Late Returns page, Late Show page, 404 page and Lounge carry the town and its three
  landmarks with short atmospheric lines only. The landmarks' histories stay open for
  the films.
- The host is **the Night Manager** everywhere visitors see him: the chat window, Lounge
  bot, crew bio and homepage. Internal identifiers (`night-clerk` files, `nightClerk`
  ids, `bot:night-clerk`, the Worker name) keep their old names on purpose.
- Each landmark sign on the homepage and Lounge town boards and the Late Returns Harrow Point
  section opens a story dialog (any `data-town-story="pier|widows-rise|low-tide"` button). The
  story text lives only in `shared/harrow-point-stories.js`, which builds the dialogs; board and
  dialog styles are in `shared/harrow-point-stories.css`, in the site palette (ink, paper, pink,
  cyan, green). Late Returns has the Lounge-style header (membership, sign out, green menu) via
  `late-returns-account.js`. Story canon written 2026-10-11, all fiction: the pier opened
  Memorial Day 1951 and burned Labor Day night 1979 (ballroom fire; the carousel organ
  was never found); Widow's Rise has a north-wall row of cut, dated, empty stones and a
  lantern seen when boats are overdue; Low Tide Mortuary is a sea captain's house run by
  one family for four generations, with a tidal sea door in the cellar. Keep films and the
  chat bot consistent with these.
- Lounge moderation labels say "moderators", so the AI host never appears to moderate.
- The bot account's live rename needs `migrations/0011-night-manager.sql` applied to
  the `neon-coffin-community` D1 database when deploying.
