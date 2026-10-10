# Neon Coffin Video: The Late Show

Proposal researched October 9, 2026. This document proposes the feature; it does not mean the page, newsletter, or a streaming integration has been published or legally cleared.

## Recommended layout

A dedicated `/screening-room` page, a compact homepage feature, and an entry in the Rental Directory. Preserve the approved NCV logo, VHS rental labels, horror-comic accents, neon pink/green/cyan, and consistent mobile button sizing. No maroon. Use original NCV artwork rather than copying Tubi's promotional television, navigation, background, or collections.

Build on the site's existing original CRT/VHS cabinet, trailer playlist, official-service guides, film dossiers, personal shelves, and screening calendars. Avoid creating a second competing guide or duplicate trailer system. Keep the Midnight Lounge's fixed forest background unchanged.

## The experience

- **NCV Video Screen:** An original battered CRT/VCR surround with coffin emblem, channel selector, tape labels, and a brief tracking effect when selecting a trailer. Load permitted official video embeds only after Play. Keep the actual player controls, branding, advertisements, captions, and fullscreen unobscured. Effects stay outside the player; respect reduced motion. Stack screen and details on mobile.
- **Friday Night Frights:** One weekly featured film, an optional double bill, original host notes, content advisories, calendar reminder, and a related Lounge discussion. Visitors watch individually through the official service. The discussion can have a shared start time; advertisements and playback differences prevent a promise of synchronized viewing.
- **The Rental Rack:** Small editorial collections such as Creature Double Bills, Video Store Oddities, and Fresh Blood. Prioritize the established 1980s/1990s identity. Each card has title/year, original commentary, permitted artwork, trailer link, official movie destination, tape dossier, and Save to My Shelf.
- **The Midnight Dispatch:** A separate opt-in weekly newsletter with Friday's feature, a double bill, official watch links, a discussion prompt, and eventual NCV videos. Include a public issue archive and RSS for readers who prefer no email.
- **NCV On Air:** Reserve a slot for the forthcoming YouTube channel, future episode playlists, reviews, and original introductions. Display an honest coming-soon notice until the channel exists; do not invent a URL or add dead controls.

## Tubi research and limits

Tubi announced its permanent Terror on Tubi hub on August 18, 2026, with more than 13,000 **hours** of horror content, not 13,000 movies.

- Announcement: https://corporate.tubitv.com/press/horror-has-no-off-season-terror-on-tubi-becomes-a-year-round-destination-for-fans/
- Current hub: https://tubitv.com/hubs/terror-on-tubi-hub
- User-supplied coverage: https://bloody-disgusting.com/movie/3964147/tubi-launches-permanent-terror-on-tubi-horror-hub-with-13000-hours-of-scares/

Public title listings checked on October 9, 2026:

| Starter candidate | Official destination |
| --- | --- |
| The Mutilator (1984) | https://tubitv.com/movies/505052/the-mutilator |
| Hellraiser (1987) | https://tubitv.com/movies/478798/hellraiser |
| Event Horizon (1997) | https://tubitv.com/movies/672124/event-horizon |

These checks confirm public listings, not end-to-end playback or worldwide availability. Match title and year: the hub's Halloween (2007) and Poltergeist (2015) must not be presented as the earlier originals. Hardware (1990) was not verified on Tubi. A Frankenhooker destination redirected to a regional unavailability notice during research.

The proposed full-film action is an ordinary outbound official/share link, opening separately so NCV and the Lounge remain available. Do not download, proxy, rebroadcast, or extract film streams. Public pages have Share controls, but that is not blanket permission for a commercial third-party integration.

Tubi's terms, effective March 3, 2026, were read from the official legal asset referenced by its web application. They restrict unauthorized technological linking/framing, automated access, commercial uses, and exploitation of Tubi branding/content. No permission for a custom Tubi movie player or automated catalog feed was verified. Obtain written clarification before pursuing those integrations. Use independently written NCV notes and manually maintained links; do not scrape Tubi for this feature or feed its descriptions/images into AI.

- Terms landing page: https://tubitv.com/static/terms
- Actual terms document: https://legal-asset.tubi.tv/terms-of-use.html

## Trailer and artwork permissions

Use the official YouTube player for trailers from identified studio/distributor or other authorized channels where embedding is enabled and applicable terms permit it. Enabling embedding alone does not establish that an unknown uploader owns a film. Provide an external Watch on YouTube fallback for blocked or age-restricted embeds. Use privacy-enhanced embeds and the required HTTP Referer; preserve player controls and branding.

Use original NCV graphics or artwork with a documented applicable license/permission. A poster being on Tubi, already in the NCV catalog, or credited in SOURCES.md does not establish permission to reuse it. Do not copy Tubi's promo image or Bloody Disgusting's article text. A news card can contain our original brief summary and a link to the article.

- Official embedding guidance: https://support.google.com/youtube/answer/171780?hl=en
- Player policies: https://developers.google.com/youtube/terms/developer-policies
- Copyright permissions and fair-use guidance: https://www.copyright.gov/help/faq/faq-fairuse.html

## Proposed short notice

> Neon Coffin Video is an independent horror discovery and discussion site. Third-party films, trailers, artwork, and trademarks belong to their respective owners. Full films play on the linked services; embedded videos use official players. No affiliation or endorsement is implied. Availability varies by region and may change.

This notice explains ownership and service boundaries. It does not grant rights or establish fair use; permissions still need checking for each proposed use.

## Newsletter setup

Keep newsletter consent separate from membership. Recommended: confirmation email, unsubscribe in every issue, clear sender identity, and a private subscriber list. Before sending commercial/promotional issues, configure the valid business postal address and required disclosures. A registered PO box/private mailbox can avoid publishing a home address. Prepare drafts before enabling scheduled sends.

- FTC guidance: https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business

Weekly content can rotate from NCV's own published feature records. Tubi availability should receive an editorial check before each issue; do not promise automatic provider rechecks without an authorized feed.

## Decisions and implementation checks

Questions submitted: dedicated page versus homepage section; existing newsletter provider/list. The dedicated-page layout is recommended, but no answer has been assumed. The future YouTube URL, newsletter provider, and Friday event time remain unspecified.

When implementation is requested, verify permitted trailer IDs and artwork rights, full-film destinations and years, mobile layout at 320/390 pixels, keyboard/focus behavior, reduced motion, embed fallback, correct return to the Lounge after closing a dossier, membership/shelf integration, timezone-aware calendars, and newsletter confirmation/unsubscribe. Check the deployed result and push all implementation and documentation changes to the private repository.
