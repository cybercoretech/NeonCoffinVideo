# Neon Coffin Video — build and deployment

Production: https://neoncoffinvideo.site/
Pages project: `neoncoffinvideo`
Production branch: `main`
Database binding: `COMMUNITY_DB` (existing `neon-coffin-community` D1 database).

## Build and check

```sh
npm ci
npm test
npm run build
```

`dist/` is generated from a public-file allowlist, including a bundled `_worker.js`. Never upload the entire source or merch directory as the website. The build regenerates the static shared footer and SOURCES.md.

## Deploy

With authorized Cloudflare credentials:

```sh
npx wrangler pages deploy dist --project-name neoncoffinvideo --branch main
```

The Cloudflare project uses direct upload, not an automatic GitHub deployment. A GitHub push alone does not publish the site. Production secrets remain in Cloudflare and are not part of the repository. Retain its existing Google/IMDb secret configuration; see COMMUNITY.md and IMDB-INTEGRATION.md.

## Verify

Check the homepage, community.html, SOURCES.md, both network destinations and donation links. The stats GET endpoint `/api/community/stats` must return numeric database totals. A normal homepage load sends exactly one POST; a visible page refreshes totals via GET every minute. Zero is a valid review total; unavailable totals show an em dash and a retry message. The catalogue count stays available during API outages. This counter measures instrumented homepage loads, not unique visitors; bots may contribute, and no visitor identity or IP is saved in the counter database.

Local checks: counter regression/failure/recovery, existing community and mocked OAuth tests, plus browser checks at 1440/768/390 pixels. Third-party playback, a live Google sign-in, and payment completion are not exercised by these checks.
