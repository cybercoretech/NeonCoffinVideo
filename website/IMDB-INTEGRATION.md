# IMDb catalog integration — access prerequisite

Status: search UI and signed Cloudflare handler implemented; not connected to a live IMDb subscription. Current searches cover the 84 local editorial records. IMDb links are external references.

Official IMDb API access requires an approved AWS Data Exchange subscription, AWS signing credentials, an IMDb API key, and dataset/revision/asset IDs. Review the product offer and terms before requesting access. Do not include credentials in browser JavaScript or an upload ZIP.

Official access instructions: https://data.imdb.com/documentation/api-documentation/getting-access/
Official search example: https://data.imdb.com/documentation/api-documentation/sample-queries/search/
Official signed-request examples: https://data.imdb.com/documentation/api-documentation/calling-the-api/

Implementation once access is available:
- Preserve curated horror/sci-fi aisles and original editorial notes.
- Add a clearly labeled all-movies search mode to header search and the crypt.
- Request paginated results on demand; do not download the entire IMDb catalog into the page.
- Proxy fixed GraphQL searches through the Cloudflare worker, signed server-side with AWS Signature V4. Store credentials as Cloudflare secrets.
- Debounce searches, bound query length/page size, cache according to the subscription terms, and apply rate limits appropriate to the API budget.
- Show sourced title metadata and direct IMDb entries; use only fields/images permitted by the subscribed product.
- Preserve local search during outages and clearly identify the source of results.
- Keep provider availability and live TV guides separate from movie metadata.
- Verify the subscribed schema and pagination, live authenticated responses, errors, and deployment before describing the integration as connected.

No subscription has been purchased, credentials configured, or authenticated IMDb requests made. Provider choice and access remain to be resolved.

## Configure the connection

Cloudflare Pages → your project → Settings → Variables and Secrets: configure `IMDB_ACCESS_KEY_ID`, `IMDB_SECRET_ACCESS_KEY`, `IMDB_API_KEY`, `IMDB_DATA_SET_ID`, `IMDB_REVISION_ID`, and `IMDB_ASSET_ID`. Store credentials as secrets. Optional `IMDB_SESSION_TOKEN` supports temporary AWS credentials. Use credentials scoped to the subscribed Data Exchange asset. Redeploy after configuration. For local preview, supply these as environment variables before starting `npm run dev`; never put secret values in project assets.

Endpoint: `GET /api/movies?q=Alien&cursor=...`. Fixed movie-only GraphQL query; 12 records per batch; server-side Signature V4 signing; fixed AWS destination; input validation; request timeout; sanitized errors; no-store responses. No arbitrary GraphQL proxy. Current result cards show title and IMDb link; richer artwork/year fields require confirmation against the subscribed schema and license.

Before enabling on a public domain, configure appropriate Cloudflare rate limiting for `/api/movies` to match the subscription budget. This version deliberately does not cache licensed IMDb results. Verify `mainSearch` cursor pagination (`after` and `pageInfo`) against your entitled schema before launch.

Verification: Node mock tests covered configuration, validation, signed request structure, cursor forwarding, normalized results and sanitized errors. Browser tests covered unconfigured state, mocked results, append pagination, curated search, crypt shortcut and widths 390/768/1440 with no exceptions or overflow. No authenticated IMDb request has been made.
