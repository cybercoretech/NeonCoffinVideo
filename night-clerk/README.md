# The Night Clerk

Standalone Neon Coffin Video bot and Midnight Lounge house host. A separate
Cloudflare Worker runs its API and scheduler; its own D1 database holds its
pause setting, catalog baseline, and durable delivery outbox. It never binds
the Lounge member database. No AI provider or inference subscription is needed.

## Commands

| Command | Result |
| --- | --- |
| `/find Near Dark` | Matching public catalog entries and tape-file links |
| `/recommend 1980s creatures` | Up to three matching films |
| `/recommend 1990s supernatural` | Picks from that decade and shelf |
| `/double-feature body` | Two distinct matching films |
| `/prompt` | Today's question and its published discussion, when available |
| `/help` | Commands and instructions |
| `/help profiles` | Handle, avatar, banner, and privacy help |
| `/help shelves` | Personal shelf help |
| `/help reviews` | Ratings, reviews, and spoiler help |
| `/help rules` | House rules |
| `/help support` | The three approved support addresses |

Shelves: `slashers`, `creatures`, `body`, `supernatural`, `scifi`, `chaos`,
`corman`. Requests without a decade or shelf default to the 1980s–1990s.
Recommendations change daily and use only films in the actual public catalog.
This is a command-based catalog bot, not a free-form conversational AI.

The Lounge sidebar's **Ask the Night Clerk** button opens its command panel.
Movie dossiers open in a separate tab to preserve the Lounge. Today's prompt
links to the bot's existing discussion instead of making duplicate threads.

## Standalone development

```sh
cd /home/raven/Webdev/neon-coffin-video/night-clerk
npm ci
npm test
npm run check
npm run dev
```

The project pins Wrangler 4.147.0. Run local D1 migrations before testing the
scheduler: `npx wrangler d1 migrations apply neon-coffin-night-clerk --local`.
Local development uses local bot storage; no production member database is
configured here. Scheduled publishing still calls the configured site; point
`SITE_ORIGIN` at a test HTTPS site with the connector and test signing secret
before exercising local delivery. Unit tests stub HTTP and use in-memory SQL.

## HTTP API

- `GET /health`: name, role, and version.
- `POST /v1/command`: JSON `{"command":"/find Near Dark"}`.
- `GET /admin/status`: private pause state and recent deliveries.
- `POST /admin/pause`: JSON `{"paused":true}` or `{"paused":false}`.
- `POST /admin/run`: run today's scheduled work now, honoring the pause switch.

Admin requests require `Authorization: Bearer <ADMIN_TOKEN>`. Keep tokens out of
browser scripts, Git, command-line arguments, and logs. Browser requests are
forwarded through the site's same-origin `/api/community/bot/command` route;
there is no wildcard cross-origin access. A Worker rate-limit binding limits
public commands to 30/minute per source address at each Cloudflare location;
shared connections share that limit. No conversation history is stored.

## CLI

```sh
node bin/clerk.mjs health
node bin/clerk.mjs command "/find Near Dark"
node bin/clerk.mjs command "/double-feature 1980s body"
node bin/clerk.mjs status
node bin/clerk.mjs pause
node bin/clerk.mjs resume
node bin/clerk.mjs run
```

The CLI reads `~/.config/neon-coffin/night-clerk.env`, or the path in
`NCV_CLERK_CONFIG`. Set `NCV_CLERK_URL` and `NCV_CLERK_ADMIN_TOKEN` there.
The production helper creates this file with owner-only permissions. Never
paste its contents into chat or commit it.

## Scheduler and delivery

An hourly Cron checks Pacific time, including daylight-saving changes. At
midnight it queues one curated question in **Movie talk**. The first catalog
scan establishes a baseline; subsequent scans queue a single digest in
**The counter** when films have been added. It does not call old films "new"
on installation. Each date has at most one prompt and one catalog digest.
Undelivered jobs retry on subsequent hourly runs. Pause stops new publications
and retries while commands remain available. Manual runs reuse the same daily
keys. The connector's atomic transaction prevents duplicate threads even if a
response is lost or two runs overlap.

Posts use the `NightClerk` service identity, visibly labeled **BOT / HOUSE HOST**.
It has no login session, Google identity, password, or moderation authority.
It is excluded from human membership and online roster counts. Rewind and
Static remain fictional mascots.

## Deployment

The bot config uses a separate `neon-coffin-night-clerk` Worker and D1 database.
Install the website's dependencies (`npm ci` in its folder), then run
`node scripts/deploy-night-clerk.mjs` from the website folder after checking the
target account. The helper uses the installed Wrangler, verifies the
account/project, provisions bot storage, applies its schema and the additive
Lounge migration, generates/reuses private credentials, deploys the bot, sets
the site's connector secret, builds the site, and deploys the existing Pages
project. It does not enable a paid plan or alter other websites.

Worker secrets: `ADMIN_TOKEN`, `LOUNGE_SIGNING_SECRET`.
Pages secret: `NIGHT_CLERK_SHARED_SECRET` (same signing value).
Website variable: `NIGHT_CLERK_URL`.
Normal Worker and D1 usage limits still apply.

Changes to website catalog sources regenerate `night-clerk-catalog.json` during
the website build; the bot reads that public file at runtime. Deploying a new
catalog does not require redeploying the bot.

Source references:
- https://developers.cloudflare.com/workers/configuration/cron-triggers/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/d1/worker-api/d1-database/#batch
