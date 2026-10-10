# Night Clerk deployment — October 9, 2026

- Standalone Worker: https://neon-coffin-night-clerk.darkstardevx.workers.dev
- Lounge: https://neoncoffinvideo.site/community
- Pages deployment: https://ed241fec.neoncoffinvideo.pages.dev
- Bot database: neon-coffin-night-clerk (separate from member storage).
- Schedule: midnight America/Los_Angeles; hourly retry checks.
- Private CLI configuration: ~/.config/neon-coffin/night-clerk.env (owner-only; excluded from Git).

Website tests, 13 standalone bot tests, Worker packaging, signed-connector
security and deduplication checks, and live browser checks at 1440/390/320px
passed. Live API checks passed for title lookup and a matching double feature.
The authenticated admin status reported scheduling enabled, and a signed
invalid operation confirmed secret agreement without publishing a test post.
No nightly delivery has run yet; its first automatic run is the next Pacific
midnight. Database publication and retry behavior were tested in isolated SQL,
not by creating a production test discussion.

Screenshots in this folder show the live deployed command panel.

The active source is /home/raven/Webdev/neon-coffin-video/night-clerk. The Git
archive keeps that independent project in the root night-clerk folder and the
website connector in website/. Keep them deliberately synchronized.
