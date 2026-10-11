# Neon Coffin Video SEO plan

## Current implementation

The source and deployable `dist/` now contain ten indexable pages: the homepage,
screening room, community, and seven substantial genre collections. Each genre
page is generated from the current 1980s–1990s catalog, has a distinct title,
description, canonical URL, social preview metadata, and `CollectionPage` plus
`ItemList` structured data. The collection pages link to one another and back to
the full screening-room rack. The XML sitemap lists all ten URLs.

The homepage title and description position Neon Coffin around its cult-horror
collection and its own illustrated horror-comic shorts. Those values are shared
across the page title, description, Open Graph, Twitter, and `WebSite` JSON-LD.

## Next steps

1. Verify the production domain in Google Search Console, submit `/sitemap.xml`,
   and review indexing and search appearance after deployment. Keep the property
   verification token in the platform configuration; do not commit credentials.
2. When a Neon Coffin original is ready for release, create a dedicated watch
   page with a unique title, synopsis, stable thumbnail, and a player that works
   for visitors and search crawlers. Add `VideoObject` data only when its values
   match the released video and the video and thumbnail URLs are crawlable. Add
   video sitemap entries for those real watch pages. The current site promotes
   external official trailers; it does not yet have Neon Coffin original watch
   pages, so they are not represented as `VideoObject` entries.
3. Link each release page to its related full video, relevant collections, and
   the YouTube channel. For Shorts, use YouTube's related-video feature and the
   channel profile link to direct viewers to the website.
4. After the first release, record a baseline for Search Console clicks and
   indexed pages, YouTube impressions and click-through rate, average view
   duration, and returning viewers. Use those results to pick the next release
   and promotion format.

Do not create thin genre pages for small shelves solely to add URLs. The
collections currently in the sitemap have at least thirteen catalog entries
each and use the catalog's editorial notes. Review the pages as the catalog
changes so their copy and item lists remain accurate.

## Platform references

- [Google video SEO best practices](https://developers.google.com/search/docs/appearance/video)
- [Google VideoObject structured data](https://developers.google.com/search/docs/appearance/structured-data/video)
- [Google video sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps)
- [YouTube sharing links](https://support.google.com/youtube/answer/13748639)
- [YouTube recommendation and discovery guidance](https://support.google.com/youtube/answer/16559650)
