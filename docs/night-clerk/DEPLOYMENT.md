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

## AI conversation upgrade — October 9, 2026

Pages release: https://b8822b7f.neoncoffinvideo.pages.dev

The standalone Worker now uses `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
through its Workers AI binding. Model replies use structured JSON restricted
to retrieved public catalog IDs. The popup supports normal questions, six-message
follow-up context, guided questions, reset, and direct catalog commands. The
site proxy forwards signed pseudonymous client digests without member cookies.

AI limits: 6 requests/minute per source at each Cloudflare location, 20/day
per source, 100/day sitewide, and an 8,000-neuron daily reservation budget.
Successful calls release excess reservations using measured token usage.
The budget is local and estimated; other apps share Cloudflare's accountwide
AI allowance. No paid plan was enabled. An independent AI pause and owner-only
controlled diagnostic check are available through the CLI.

The older Llama 3.1 models answered direct REST probes but were rejected as
deprecated by the production Worker binding. The current Llama 3.3 model was
verified through the binding and the public site proxy. Live conversation
recommended Hellraiser, then Candyman when asked for a 1990s option.

All 21 bot tests and the website regression suite passed. Browser verification
covers 1440/390/320px, actual catalog commands, an actual AI follow-up at 390px,
chat reset, 44px controls, separate-tab dossiers, and overflow. The chat retains
no server-side conversation history and publishes no generated replies.
