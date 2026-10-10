# AFTERCUT

A horror/sci-fi editorial site following the post-1996 genre wave: slashers, camp, body horror, extreme cinema, global horror, new releases, and the Miles County feature on Art the Clown.

## Preview

The local preview is running at <http://localhost:4173/>. Community preview: <http://localhost:4173/forum.html>. The static preview can't execute Pages Worker routes, so real provider feeds, Google sign-in, and full-catalog IMDb search become active on Cloudflare Pages after configuration.

## What's here

- Searchable 184-title archive spanning B-horror, slashers, indie discoveries, international horror, and modern standouts; full-title IMDb search, film files, local watchlist, and matching discussion/review picker.
- Real Terrifier 3 theatrical art featuring Art the Clown; local editorial poster images where sources were available, with art credits in `poster-sources.json`.
- Crystal Lake feature, release radar, updateable highlights, and modern flat-panel trailer preview that rotates every three hours.
- Tubi, Pluto TV, and Fawesome in a searchable live/on-demand guide; Plex, Shout! TV, and Sling Freestream links.
- Afterhours community: Cloudflare D1 discussions and replies, Google OAuth, member profiles, reviews, personal shelves, reports and moderation.

See `CLOUDFLARE.md` for deployment, D1, Google OAuth, IMDb, and streaming feed setup. See `SOURCES.md` for content/art citations.

## The Fresh Cut and The Cult Files

The front-page seven now cover source-checked news, recent releases and upcoming horror. `front-page.js` holds the October 9, 2026 editorial snapshot, direct Bloody Disgusting links, dates, artwork captions and trailers. Features rotate every 60 seconds, can be selected or paused manually, stop in hidden tabs and start paused with reduced motion. The three source-board links below the hero lead to the latest news/release calendars. These are editorial picks, not a continuously synchronized feed.

The original Terrifier 3, Talk to Me, Longlegs, The Substance, Evil Dead Rise, Train to Busan and 3 from Hell features now appear under **The Cult Files**, above the film archive. Their original poster/background art, descriptions, film popups and trailer-source links are retained; the original data is preserved in `cult-files.json`.
