# Neon Coffin Video — website blueprint

Prepared October 3, 2026. Updated for the selected name and local implementation. See README.md for implemented features; future phases remain planned. No domain purchased or site deployed.

## 1. Identity and purpose

**Selected name: NEON COFFIN VIDEO**
**Tagline: Bad movies. Great nights.**
**Descriptor: Cult horror, creature features, and after-hours double bills.**

A personal, curated horror destination combining the discovery experience of an independent video store with the ritual of a late-night hosted drive-in. The owner's memories, humor, recommendations, and research are its editorial identity.

Primary visitor jobs:
1. Find a horror movie that fits tonight's mood.
2. Find a verified place to watch it.
3. Discover an actual upcoming channel airing or join a suggested double-feature night.
4. Read enough about the film and its makers to appreciate it more.
5. Save a film or screening for later.

Editorial heart: 1980s horror, affectionate B-movie coverage, practical effects, creature features, Roger Corman's directing/producing legacy, David Cronenberg's body horror, and the horror-host culture of Joe Bob Briggs and Elvira. Earlier influences and later spiritual successors belong where the curator makes a compelling connection.

Selected by the owner: Neon Coffin Video. Domain selection remains upcoming.

## 2. Visual and editorial direction

A neon video store attached to a slightly disreputable drive-in. Use black/navy foundations, warm marquee amber, toxic green, magenta highlights, worn paper labels, illustrated creature art, and restrained VHS texture. Favor recognizable horror typography with readable body copy. Do not reuse the technical command-center layout of Cybercore's software pages.

Brand assets: custom wordmark, small tape/rewind emblem, favicon, marquee lockup, shelf labels, screening-ticket treatment, and one original mascot or host illustration if it supports the owner's chosen persona. Real film art remains identifiable as film art; original illustrations are labeled appropriately.

Interface metaphors:
- Film cards resemble tape cases but retain readable titles and accessible controls.
- Watchlist is called My Rental Shelf, with a clear Watchlist label.
- Tonight's program uses a drive-in marquee.
- Ratings resemble handwritten staff stickers.
- Screening pages use a ticket/program format.

Motion is optional atmosphere: subtle neon flicker and small hover reactions. Content renders immediately. No hidden-on-scroll sections, autoplay audio, mandatory intro, or unreadable CRT overlay. Mobile provides straightforward stacked cards and guide listings; keyboard navigation, adequate contrast, readable text, and reduced-motion support are part of the first build.

Voice: knowledgeable, affectionate, funny, occasionally irreverent. Distinguish enjoyable cheese from weak filmmaking. Write original verdicts; do not manufacture the owner's memories or opinions. Spoiler-free discovery is the default; spoiler sections require explicit reveal.

## 3. Site map

| Route | Purpose |
| --- | --- |
| / | Tonight's picks, current double feature, useful guide preview, curated shelves |
| /films | Searchable archive with filters |
| /films/:slug | Full film dossier |
| /tonight | Watch now, scheduled airings, and curated screening nights |
| /double-features | Current and archived curated programs |
| /double-features/:slug | Two-film program, host introduction, intermission, viewing links |
| /collections/:slug | Corman Country, New Flesh, Effects Crypt, slasher and creature shelves |
| /people/:slug | Director, producer, effects artist, or horror-host profile |
| /intermission/:slug | Original essays, production stories, memories, interviews |
| /my-shelf | Visitor's saved films and screenings |
| /about | Host introduction, editorial approach, contacts, corrections |

Site-wide Ctrl/Cmd+K search includes film titles and aliases, people, collections, and articles. Search remains usable without the shortcut.

## 4. Homepage composition

First screen: recognizable brand; search; region/timezone indicators; a concrete Tonight's Picks program with visible film cards and viewing actions. The marquee introduces a real selection, not empty promotional copy.

Below:
1. Watch Now: a small set of verified on-demand recommendations.
2. On Tonight: actual scheduled channel airings, or an honest unavailable state.
3. This Week's Double Feature: owner introduction and program link.
4. Browse the Shelves: editorial collections.
5. From the Counter: recent original dossiers and intermission pieces.
6. Horror Host Spotlight: Joe Bob, Elvira, or another researched tribute.

No fake activity, invented visitor counts, fictional broadcasts presented as real, or placeholder availability claims.

## 5. Film dossier template

Each record includes:
- Title, alternate titles, year, runtime, country, director and relevant producer credits.
- Poster/artwork with provenance.
- A short spoiler-free pitch and the owner's original verdict.
- Why it belongs here; a clearly authored personal-memory section when supplied.
- Separate 1–5 editorial ratings for craft, fun, cheese, practical effects, and dread. Missing ratings stay unrated. Explain the scale; high cheese is descriptive, not necessarily bad.
- Subgenres, moods, content notes, and spoiler controls.
- Sourced production history and an effects spotlight where evidence exists.
- Cast/crew links and credited roles: directed by and produced by are distinct.
- Alternate cuts/home-video editions when researched, with region and edition details.
- Verified viewing offers with region, service, type, direct destination, and last checked time.
- Upcoming verified airings.
- Two or three related films with explanations, not unexplained similarity scores.
- Owner's double-feature pairings, sources, and a correction link.

## 6. Collections and host culture

Launch collections:
- Creature Features: suits, puppets, monsters, mutations.
- Beautiful Garbage: affectionate, ridiculous B-movie discoveries.
- Corman Country: distinguish Corman's directing, producing, company, and collaborator connections.
- The New Flesh: Cronenberg and curated body-horror connections.
- The Practical Effects Crypt: artists, techniques, and sourced making-of stories.
- Slasher Summer: campgrounds, prom nights, malls, and holiday mayhem.
- After the Station Signs Off: late-night TV and horror-host memories.

Joe Bob Briggs and Elvira receive dedicated tribute profiles and editorial features. Reference their influence with proper attribution; the site's original host identity belongs to the owner. AVA Pop Culture is an inspiration and a potential credited resource, not material to copy or an implied partner.

The effects/people connection graph is a later enhancement. Early pages use dependable linked credits and curated paths.

## 7. Viewing guide: three distinct listing types

**Watch Now / on demand:** verified service availability, region, offer type, direct watch destination, and last checked timestamp. Start with Pluto TV, Tubi, and Fawesome where individual offers can be verified. Additional services may be added as sources support them. Never assume a title is free or included just because a service carries it somewhere.

**Scheduled Airing / live channel:** verified program title, service, channel, start/end time, source timezone, visitor-local display, region, source, and last checked timestamp. Show On Now and Starts Soon only when verified timestamps support them. Timezone handling must respect daylight saving changes.

**Curator's Screening / suggested time:** the owner's programmed viewing night using available on-demand films. Clearly label suggested start times; these are not service broadcasts. Viewers launch films on their own service/device. Ad breaks and playback differences prevent guaranteed synchronization. Make the second feature's start flexible unless a separately verified schedule applies.

Controls: Tonight/This Week, viewing type, service, mood, and runtime filters. Initial region is United States, with Pacific as the editorial home timezone and local display where supported. Do not offer additional regions until their data can be verified.

Reminders: downloadable calendar entries first. Only actual airings or published curator screening times create reminders. Event details include source service, viewing link, timezone, and schedule-verification status. Later, visitors may opt into email reminders.

Freshness policy: each offer/airing is verified or marked unverified. Establish refresh/expiry rules based on the actual source's update cadence before public release. Expired airings disappear from upcoming listings; stale offers lose prominent Watch Now treatment until rechecked. Missing feeds produce a useful fallback, not fabricated times.

## 8. Signature interaction: program your night

Inputs: mood, available services, maximum total runtime, gore comfort, and novelty preference. Return an editorially curated pairing with rationale and verified links. Initial matching uses tags plus manually approved pairings; no invented compatibility or streaming availability.

Examples of program themes, not claims of current availability:
- Mall Mayhem
- Mutant Weekend
- Mad Science, Bad Decisions
- Rubber Monsters After Midnight
- Body Horror: No Refunds

A double-feature page includes a host intro, two spoiler-free pitches, film order, viewing destinations, optional suggested times, an intermission essay, and a spoiler-marked post-show discussion prompt. Introductions can start as text and later expand to original audio/video.

## 9. Personal shelf and community

First release: save/unsave films, mark watched, and save a screening locally in the visitor's browser. Explain that there is no cross-device sync without an account. Shared programs have stable URLs; personal shelf exports can arrive later.

Later: optional accounts, persistent lists, reader suggestions, a weekly email program, polls, and moderated discussion. A forum or synchronized chat is not necessary for a credible first release.

## 10. Content and data operations

Core records: Film, Person, Credit, Collection, Article, Rating, ViewingOffer, ChannelAiring, DoubleFeature, ScreeningEvent, and SourceReference. Keep external identifiers/aliases to match remakes and duplicate titles correctly.

Every changing availability record stores source, region, destination, checked_at and freshness status. Airings additionally store timezone-aware start/end instants and channel identifiers. Curator events remain separate records from broadcaster airings.

Owner workflow: draft dossier → attach research sources → add original verdict/ratings → verify movie identity and viewing offers → preview → publish. Program workflow: select two films → write pairing rationale and introduction → verify offers → set suggested time if desired → publish → recheck before the screening.

Automation assists with importing licensed/permitted metadata and refreshing supported availability/schedule sources. Human judgment owns curation, credits, personal memories, ratings, and factual review. Keep an edit history and a correction process. No scheduled automation is created by this blueprint.

First integration investigation: what approved/usable data sources exist for each service, which regions they cover, permitted use, rate limits, freshness, and direct-link behavior. If dependable schedules are unavailable, launch Watch Now plus curator nights and a smaller manually verified airing list. Mark the automated live guide as dependent work, not a guaranteed capability.

## 11. Build approach

Proposed hosting: Cloudflare with a repository-backed deployment, consistent with the owner's existing setup. This is a recommendation, not an account or domain change.

Use a server-rendered web application for indexable film/article pages, a small relational content store for editorial and guide records, and local browser state for the initial personal shelf. Store original assets separately as needed. Start with a simple protected editorial workflow; app/backend credentials never enter public client code. Add a scheduled availability importer only after its real source and permissions are confirmed.

Priorities: fast first load, stable deep links, searchable content, proper titles/descriptions, responsive cards/tables, visible error/empty states, and no mandatory account to discover or watch a film. Visual branding should serve the film content, not obscure it.

## 12. Phased delivery and acceptance

Phase 1 — visual prototype:
- Confirm working name and host tone.
- Build homepage, 6–8 representative film dossiers, one double-feature page, shelves, search, and local saved films.
- Use explicitly labeled sample listings where data is not live.
- Open a browser preview; inspect desktop and mobile before publication.

Phase 2 — credible public launch:
- 30–50 selected film records; 12–15 fully researched deep dossiers.
- Six curated double features; five substantial collection pages.
- Joe Bob and Elvira tributes plus at least three original intermission articles.
- Verified US viewing links with dates and a correction workflow.
- Watch Now, curator screening nights, calendar reminders, and a small verified live-airing guide if sources permit.
- Final name/domain choice; reliable editorial workflow; deploy and verify public routes/assets.

Phase 3 — repeat-visit features:
- Supported automated schedule/offer refresh with clear failure states.
- Weekly programs and optional newsletter/reminders.
- Disc-edition comparisons, expanded collections, and contributed recommendations with review.

Phase 4 — deeper archive/community:
- People/effects connection explorer, original hosted video/audio, optional accounts and cross-device shelves, moderated discussion, and advanced mood discovery.

First-release acceptance checks:
- A visitor finds a suitable film and a verified viewing destination quickly.
- Every displayed time is explicitly an actual airing or a curator suggestion.
- Current verified availability is distinguishable from stale/unverified data.
- The owner can publish a film and double feature without source-code edits.
- All content renders immediately; search, save controls, spoiler toggles, and reminders work with keyboard and touch.
- Mobile has no unintended horizontal overflow; reduced-motion settings work.
- Film/year/credit matching, expired airings, provider outages, and no-result searches have useful behavior.
- No claims of streaming rights, affiliations, synchronized playback, or schedule accuracy beyond actual evidence.

## 13. Decisions for the next working session

Recommended defaults: Rewind the Dead; US launch; Pacific editorial timezone; owner as host; affectionate humor with serious research; no account requirement; manually verified viewing links before automatic feeds.

Inputs that improve the build: approval or replacement of the name, 10–15 personal favorites, the desired public host name/persona, several genuine childhood viewing memories, and whether the first introductions should be written or recorded. Domain availability and live-guide feasibility remain to be checked before those commitments.

## Naming and research references

- Lenora's Midnight Rental: https://www.crankeduptv.com/lenora-s-midnight-rental-nightmare-cinema
- Dead Air: A Horror Podcast: https://podcasts.apple.com/us/podcast/dead-air-a-horror-podcast/id1528901452
- AVA Pop Culture: https://www.youtube.com/@AVAPopCulture
- Pluto live programming: https://pluto.tv/us/watch/live-tv/
- Tubi live channels: https://tubitv.com/live
- Tubi regional/channel availability guidance: https://tubitv.com/help-center/Content/articles/24898743777435
- Hysteria Lives: https://www.hysteria-lives.co.uk/
- Mondo Digital: https://www.mondo-digital.com/
- Grindhouse Cinema Database: https://grindhousedatabase.com/index.php/About
