# Cloudflare Pages setup

The site now contains a Pages Worker for the live Pluto TV and Tubi schedule feeds, Fawesome's on-demand horror shelf, paginated IMDb full-title search, and the Google-login Afterhours forum. Local HTML preview can show the interface, but these APIs need Pages plus D1.

## First deploy

1. Create a new Cloudflare Pages project named `aftercut` (or choose another name and update `SITE_ORIGIN`). Set the output directory to the project root, with no build command.
2. Create a new D1 database named `aftercut-community`; put its ID in `wrangler.jsonc`. Do not bind the Neon Coffin database.
3. Run `npx wrangler d1 migrations apply aftercut-community --remote` from this folder after setting the database ID.
4. Configure Pages variables/secrets: `SITE_ORIGIN`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`. Add the redirect URI `https://aftercut.pages.dev/api/auth/callback` to the Google OAuth client. For another project hostname, use that host instead. Google sign-in becomes available only after this step.
5. Deploy with Wrangler Pages or connect this folder to GitHub. The `_worker.js` entrypoint serves the static site and API routes.

The forum is private to its own D1 database. Public profiles, reviews, threads and replies are supported; email addresses remain private. Configure `ADMIN_GOOGLE_SUB` only if a moderator account is needed.

## Full movie search

The front end searches the curated shelf immediately and requests full IMDb movie results in batches of 12 through `/api/movies`. That Worker route is implemented with server-side AWS Signature V4, input limits, timeouts, and sanitized errors. It needs an approved IMDb Data Exchange subscription and its corresponding Cloudflare secrets: `IMDB_ACCESS_KEY_ID`, `IMDB_SECRET_ACCESS_KEY`, `IMDB_API_KEY`, `IMDB_DATA_SET_ID`, `IMDB_REVISION_ID`, and `IMDB_ASSET_ID` (optional `IMDB_SESSION_TOKEN`). IMDb results are not copied into a static database. The local editorial shelf now contains 184 films, with separate release and highlight features; the all-movies search can span far beyond 500 once credentials are configured.

## Live streaming listings

The guide fetches current Pluto TV and Tubi schedules and an on-demand Fawesome catalog through `/api/guide`. It shows source check time and the service-selected region. Playback opens the official service. Listing APIs can change; failures show the official service link and an unavailable state instead of fabricated schedules. Plex, Shout! TV, and Sling Freestream cards link to their free horror/catalog pages.

`python3 -m http.server 4173` previews the visual site at <http://localhost:4173>. Its static server cannot run Worker APIs or authenticate Google; deploy/run the Cloudflare Worker for those features.
