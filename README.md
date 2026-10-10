# Neon Coffin Video

Private source archive for the Neon Coffin Video website and merchandise.

- **website/** — Cloudflare Pages source, original site graphics, sourced film artwork, D1 migrations, tests, shared genre footer and deployment docs.
- **merch-pack/** — original artwork, print exports, sticker files, Fourthwall theme, previews, production guides, and the separate **Facebook/** assets and copy folder.
- **night-clerk/** — standalone Night Clerk Worker, CLI, scheduled host, tests, and operating guide.
- **docs/** — footer desktop/tablet/mobile review images and change notes.

Website: https://neoncoffinvideo.site/
Store: https://neon-coffin-video-shop.fourthwall.com/

## Website workflow

```sh
cd website
npm ci
npm test
npm run build
```

Deploy `website/dist` to the existing `neoncoffinvideo` Cloudflare Pages project as documented in `website/LAUNCH.md`. GitHub pushes do not automatically deploy this direct-upload project.

The active existing local folders remain `../neon-coffin-video` and `../neon-coffin-merch-pack`; this repository was populated from those folders on 2026-10-06. Future edits should either be made here or synchronized deliberately before committing; no background synchronization is installed.

## Merchandise status

Published lineup: Storefront Tee, Storefront Hoodie, Coffin Cassette die-cut sticker, and Marquee die-cut sticker. **No kiss-cut products are approved.** Some historic guides and assets include earlier unused concepts, holographic/decal/sheet exports, or files in `rejected/`; these are retained for provenance, not recommendations for publication.

## Secrets and attribution

Local databases, dependencies, Cloudflare credentials, environment files and build output are excluded. D1 migrations contain schema, not production member data. Public donation links are configuration, not credentials. See `website/SOURCES.md`, attribution JSON and bundled licenses before reusing third-party images or code. Private repository visibility does not confer rights to third-party artwork.
