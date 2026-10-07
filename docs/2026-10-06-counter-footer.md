# Counter repair and genre footer

The backend was counting loads: the live API returned 114 views, 1 member, 5 discussions and 0 reviews before repair. The UI discarded each response value and animated toward an unset dataset attribute (zero). The repair renders validated numeric API values directly and refreshes via GET every minute while visible. Only the initial homepage load uses POST. Failed requests show unavailable totals, retain the catalogue count, and recover on a read-only refresh.

The static footer appears on the homepage and lounge, with info@neoncoffinvideo.site, links to After/Cut and LastActionReel, merch and credits, and the owner's PayPal/Buy Me a Coffee profiles. Both donation destinations responded successfully and the PayPal page identifies the supplied handle. No payment was made. Reuse is through website/shared; sister sites have not been changed.

Tests passed: counter regression/outage/recovery; existing community database and mocked OAuth tests; real-page browser rendering at 1440, 768 and 390 px, links, film source attribution and credits dialog. No browser exceptions or horizontal overflow. Screenshots are beside this document.

## Live verification

Deployed to production on 2026-10-06 (Pacific), deployment `0fe01318.neoncoffinvideo.pages.dev`. Verified the custom domain in a real browser: one homepage load advanced the API total from 114 to 115; the page displayed 115 views, 145 curated tapes, 1 member, 5 discussions, and 0 reviews/ballots. Verified homepage and lounge footers, source document (200), both genre-network destinations (200), and no browser exceptions. Screenshots: live-counter.png and live-footer.png. Donation profile pages returned 200; payments were not initiated.
