# The Midnight Lounge

Live: https://neoncoffinvideo.site/community
Local: http://127.0.0.1:8794/community.html

This is a custom forum integrated with the Neon Coffin site, not an installed Discourse instance. It uses the existing Pages worker and a Cloudflare D1 database, with no additional hosted-forum subscription. No paid plan was enabled. Free-tier usage limits still apply. Monitor dynamic requests and D1 usage; avoid aggressive polling or uploads. No paid IMDb access is configured.

## Built

Six discussion rooms, title search and pagination, topic creation, replies, spoiler disclosure, public member profiles with editable handle/bio/favorite movie, public 1–5-skull reviews, private account shelves with browser-shelf import and removal, sign-out, post reporting, moderator report desk and post hiding. Reviews for a movie can be updated by publishing again or deleted by their author. Movie dossiers link into the lounge. The sidebar shows recent real discussions, an anonymous live-session estimate, and explicitly labeled fictional house mascots plus a rotating Night Clerk prompt; it does not create fake member accounts, posts, reviews, or online identities.

The live-session estimate stores only a hash of a random tab-scoped token and a 90-second expiry in D1. The client refreshes it every 30 seconds while visible. No member identity or IP address is written to the presence table. The displayed number is active browser sessions, not a verified count of people.

Google login uses a server-side authorization-code flow with PKCE, one-use browser-bound state, a verified Google userinfo response, and hashed server sessions in HttpOnly Secure SameSite cookies. Lounge sessions last 90 days; logout revokes them immediately. Google access tokens are not persisted, and Google email/name are not stored in community tables or exposed in profiles. New members receive a pseudonymous handle which they can change. Members must self-confirm that they are at least 18 before OAuth sign-in; existing sessions are asked once as well. Only the confirmation timestamp is stored—no date of birth or ID. This is a self-attestation, not robust age verification. Database writes require authentication and the configured origin, with bounded input and per-member rate limits.

## Google setup — still required

1. Open https://console.cloud.google.com/auth/overview and create/select a project. Use Google Auth Platform to configure the app name Neon Coffin Video and External audience. Do not activate a paid Cloud service for this sign-in setup.
2. Create an OAuth client with type Web application. Add both authorized redirect URIs: `https://neoncoffinvideo.site/api/auth/callback` and `https://neoncoffinvideo.pages.dev/api/auth/callback`. The custom domain is primary; the Pages URL remains available as a fallback.
3. During testing, add your Google account as a test user. Only the `openid email` identity scopes are requested. Follow Google's current publishing/branding requirements before general registration; a custom domain may be needed for some branding or verification steps.
4. Download the client JSON to a private location outside Webdev and the upload folder. Never paste its secret into chat or put it in static assets.
5. Run the prepared `scripts/configure-google.mjs` with that private file path, or add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` as secrets in the Cloudflare Pages project. Redeploy after configuration.
6. Test Google consent, callback, profile creation, returning login, sign-out, replies/reviews and shelf sync with real accounts. Live authenticated Google sign-in has not been tested yet.

To give the owner moderation access, set the Pages secret `ADMIN_GOOGLE_SUB` to the owner's Google subject identifier after verifying the owner account. This identifier must come from the trusted member record, not a posted handle or browser role. No user is automatically granted admin access.

## Deployment

`wrangler.jsonc` binds `COMMUNITY_DB` to the existing `neon-coffin-community` database and sets SITE_ORIGIN to the custom domain. The Worker validates page-view and forum writes against the custom domain and the Pages fallback. Database schema is versioned in `migrations/`; the anonymous lounge presence table is in `0004-lounge-presence.sql`. Do not upload migrations, private OAuth files or the preview SQLite file as site assets.

Bundle `_worker.js` with esbuild into the clean upload folder, copy static assets there, then deploy from this project directory so Wrangler uses the binding configuration. The distribution ZIP contains the bundled worker. Dashboard uploads need the D1 binding configured separately; the ZIP cannot create database bindings or secrets.

## Verification

Node tests with an isolated in-memory SQLite adapter verify authentication/authorization, cross-origin rejection, topics/replies, spoiler flags, reviews, shelf privacy, moderator boundary, logout, and a mocked Google code flow including replay rejection. Browser checks verify honest pending login, room controls, responsive layouts and trailer rotation. These are not a substitute for live Google setup.

Forum posts refresh on navigation/reopening a discussion; this first version is threaded discussion rather than a WebSocket chat server. Rich uploads, direct messages, email notifications and advanced moderation can be added later.

Sources: https://developers.google.com/identity/protocols/oauth2/web-server ; https://developers.cloudflare.com/pages/functions/wrangler-configuration/ ; https://developers.cloudflare.com/d1/platform/pricing/

Deployed verification: production D1 binding returns live empty discussion lists and anonymous member state; the UI honestly shows Google configuration pending. Member UI checks used browser-only fixtures, which were never written to production. Dark Google buttons retain official icon/font assets, with exterior neon glow; source https://developers.google.com/identity/branding-guidelines .
