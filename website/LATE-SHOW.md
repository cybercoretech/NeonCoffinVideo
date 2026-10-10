# The Late Show — owner guide

Page: https://neoncoffinvideo.site/screening-room
Group: https://groups.google.com/g/neon-coffin-midnight-dispatch
Group address: neon-coffin-midnight-dispatch@googlegroups.com (confirm in group settings).

## Free newsletter setup

The site's Join button opens the public group URL, independent of your Google account selector. Joining is voluntary and happens in Google's interface. Visitors choose Each email to receive every post. RSS and the archive work without Google. No NCV subscriber database, paid provider, or newsletter sending API is required.

Confirm these Google Groups settings in your owner account:
- Who can join: Anyone on the web can join.
- Who can post and post as group: Group owners.
- Who can view members and member email addresses: Group owners.
- Allow web posting: on. Conversation history: on.
- Default sender: Group address, if available; verify with a test message you send yourself.
- Who can view conversations: members or public, depending on your preference; the NCV archive is already public.

Google's adults-only content classification is irreversible once selected; review the intended content before selecting it. The website uses an 18+ self-confirmation, not identity verification. No group settings were changed by this implementation.

## Sending a Friday edition

1. Open the published Dispatch issue on the screening page.
2. Click Copy this issue for Google Groups.
3. Open your Google Group as its owner, choose New conversation, use the issue headline as the subject, and paste the text.
4. Replace the owner mailing-address placeholder before sending promotional editions; keep the leave/delivery link and truthful sender information. A business mailing address or suitable PO box avoids publishing your home address. Google Groups is not an exemption from applicable email marketing requirements: https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
5. Review links and the message, then post it. Google delivers according to each member's preferences. No messages were sent during implementation or testing.

## Schedule and maintenance

`late-show-data.js` is the single source for six opening issues (October 9–November 13, 2026), rental metadata, service links, and preview videos. Friday publication follows America/Los_Angeles midnight; personal viewing suggestions start at 8 PM Pacific and calendar files handle daylight-saving changes. The homepage, feature card, issue archive, Lounge discussion context, and RSS use this schedule. Once the six issues finish, the latest issue stays available until you add another dated issue. The website's schedule does not trigger Google email delivery.

Add future Friday records to dispatchIssues with unique IDs and valid feature/pair IDs. Recheck provider availability before sending. There is no new Tubi scraper, full-film player, or stream proxy. Displayed film covers use credited catalog posters. Original NCV label illustrations remain fallback artwork. Production worker routes /api/late-show/newsletter, /rss, and /calendar; the newsletter route exposes only the public Google Group URL.

YouTube: set screeningConfig.youtubeChannel when your real public channel URL exists, then connect the reserved NCV On Air section. Never create a fake Subscribe destination. New verified preview IDs belong in vaultTrailers; verify official uploader metadata and keep a direct playback fallback.

## Validation

Run npm test, npm run build, and node tests/late-show-browser.mjs. Optional live checks: node tests/late-show-browser.mjs https://neoncoffinvideo.site. The browser test does not post discussions, join the group, send email, or verify copyrighted full-film playback.

Active source stays in /home/raven/Webdev/neon-coffin-video. Private repository mirrors it at website/. Deploy dist to Cloudflare Pages project neoncoffinvideo; a Git push alone does not publish this direct-upload Pages project.

## Expanded rental rack — October 10, 2026

The screening room now contains 261 distinct 1980–1999 horror rentals, sourced from the shared NCV catalog and an additional 92 films. The shared storefront and Lounge catalogs contain 287 films across their broader historical range. The rack excludes the existing Terminator, RoboCop and Blade Runner science-fiction entries.

The rental cabinet scrolls independently and keeps the rest of the page compact. It supports ten category buttons with counts, title/director/year search, 1980s/1990s filters, A–Z/oldest/newest sorting, reset, keyboard scrolling, local tape files and browser-saved shelves. Posters load lazily. All 261 poster cards and editorial notes appear in the initial HTML for readers and search crawlers.

The six previously verified Tubi picks retain their direct service links. Other films use clearly labeled Tubi search links inside their tape files; catalog inclusion does not establish streaming availability. Film details open the credited reference page in another tab.

Data workflow: update the shared editorial catalog and source records, then run npm run build. scripts/build-rental-rack.mjs validates the 1980–1999 selection and real local poster paths, emits rental-rack-data.js, and the SEO build writes its initial HTML. The curated additions are maintained in rental-rack-additions.json. To audit/download missing artwork, run node scripts/prepare-rental-rack.mjs then python3 scripts/fetch-rental-rack-posters.py. Downloads are validated as images; ambiguous film identities are rejected for manual review.
