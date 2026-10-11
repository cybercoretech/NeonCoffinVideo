# The Night Clerk

Standalone Neon Coffin Video bot and Midnight Lounge house host. A separate
Cloudflare Worker runs its API and scheduler; its own D1 database holds its
pause setting, catalog baseline, and durable delivery outbox. It never binds
the Lounge member database. Private conversation uses a Workers AI binding;
no external API key is required. Scheduled public posts still use curated prompts.

## Commands

| Command | Result |
| --- | --- |
| `/find Near Dark` | Matching public catalog entries and tape-file links |
| `/recommend 1980s creatures` | Up to three matching films |
| `/recommend 1990s supernatural` | Picks from that decade and shelf |
| `/double-feature body` | Two distinct matching films |
| `/prompt` | Today's question and its published discussion, when available |
| `/town` | Harrow Point guide and the Night Manager's local story |
| `/help` | Commands and instructions |
| `/help town` | Fictional Harrow Point setting and landmarks |
| `/help profiles` | Handle, avatar, banner, and privacy help |
| `/help shelves` | Personal shelf help |
| `/help reviews` | Ratings, reviews, and spoiler help |
| `/help rules` | House rules |
| `/help support` | The three approved support addresses |

Shelves: `slashers`, `creatures`, `body`, `supernatural`, `scifi`, `chaos`,
`corman`. Requests without a decade or shelf default to the 1980s–1990s.
Recommendations change daily and use only films in the actual public catalog.
Commands remain deterministic and available independently of AI conversation.

The Lounge sidebar's **Ask the Night Clerk** button opens its chat panel. The
Night Clerk knows Harrow Point, the fictional coastal Maine town from the Late
Returns short, and can open the Lounge's illustrated town board with `/town`.
Keep its landmarks and ghost stories distinct from real Old Orchard Beach.
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
- `POST /v1/chat`: JSON `{"message":"Something like Near Dark","history":[]}`.
- `GET /admin/status`: private pause state, AI usage counters, and recent deliveries.
- `POST /admin/ai/check`: owner-only controlled model check; uses the AI budget.
- `POST /admin/ai`: JSON `{"paused":true}` to pause AI conversation independently.
- `POST /admin/pause`: JSON `{"paused":true}` or `{"paused":false}`.
- `POST /admin/run`: run today's scheduled work now, honoring the pause switch.

Admin requests require `Authorization: Bearer <ADMIN_TOKEN>`. Keep tokens out of
browser scripts, Git, command-line arguments, and logs. Browser requests are
forwarded through the site's same-origin `/api/community/bot/command` and
`/api/community/bot/chat` routes;
there is no wildcard cross-origin access. A Worker rate-limit binding limits
public commands to 30/minute per source address at each Cloudflare location;
shared connections share that limit. AI requests have a separate 6/minute
limiter. See the limits and privacy notes below.

## CLI

```sh
node bin/clerk.mjs chat "Something like Near Dark"
node bin/clerk.mjs ai-check
node bin/clerk.mjs ai-pause
node bin/clerk.mjs ai-resume
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

## AI conversation

Ask normal questions, then refine the picks with a follow-up: “Something like
Near Dark” → “Give me a 1990s option” → “Build a double feature.” Film cards
come from retrieved public catalog IDs, with URLs built by the server. The
model receives up to eight film records and the last six short chat messages.
Answers are generated, so unsupported facts can still be wrong; the host is
instructed to admit uncertainty and avoid unverified streaming or stock claims.

The pinned model is `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, capped at 384 output
tokens and 14,000 bytes of input. Structured JSON output restricts film IDs to
the retrieved shelf, and replies are validated; malformed replies,
a missing binding, paused AI, and provider failures return command help.
Timeouts return help after 25 seconds; an already-started inference may continue
at the provider and keeps its full budget reservation.

Before each inference, one atomic D1 insert checks three limits: 100 calls/day
sitewide, 20 calls/day per pseudonymous source address, and 8,000 reserved
neurons/day sitewide. Reservations conservatively estimate input tokens from
UTF-8 bytes plus template overhead, and reserve the maximum output. Successful requests release excess reservations using measured token usage;
failed attempts retain their reservation and count too. Reset is midnight UTC. Rate and quota exhaustion return 429;
catalog commands continue to work. Shared source addresses share limits.
The site signs forwarded client digests to prevent spoofing the proxy's limiter.
Stored daily digests expire after seven days when another chat request reserves
usage. No raw IP, question, reply, cookie, or member profile is stored in bot D1.

Chat history exists only in the tab's memory; Start a fresh tape or reload clears
it. Submitted questions and recent chat replies are sent to Cloudflare Workers
AI with public catalog/help context. They are not published to the Lounge. The
bot has no access to private profiles, member messages, or forum history. Logs
record operational events, never prompts/replies/provider error bodies.

This deployment does not enable a paid plan. Cloudflare's free AI allowance is
accountwide; other apps can consume it. The local budget is an estimate, not a
Cloudflare billing hard cap. Review account usage before raising limits.

AI references:
- https://developers.cloudflare.com/workers-ai/configuration/bindings/
- https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/platform/data-usage/

For a bot-only update, run `node scripts/deploy-night-clerk.mjs --bot-only`;
this verifies the same target and updates the Worker without republishing Pages.
