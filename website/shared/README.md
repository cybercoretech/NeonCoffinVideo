# Genre network footer

One static HTML renderer and scoped stylesheet for Neon Coffin Video, LastActionReel, and After/Cut. The current installation is Neon Coffin Video only (homepage and lounge).

Edit `footer-config.json`, then run `npm run build`. Footer HTML is included directly in each page so email, network, donation and credit links work without JavaScript.

To install in a sister site, copy `genre-footer.mjs` and `genre-footer.css`, supply that site's name, email, home emblem, network peers, support links and copy to `renderGenreFooter(config)`, and include its returned HTML in the page. Do not use the Neon Coffin email as a default for other sites. Include that site's own SOURCES.md and adjust its artwork link.

Theme using `--footer-accent`, `--footer-highlight`, `--footer-bg`, `--footer-text`, `--footer-muted`, and `--footer-heading` on `.genre-footer[data-genre-site="your-site"]`. The renderer has no dependency on Neon Coffin's JavaScript or API. The existing original emblem is supplied by configuration; no stock graphics or new font downloads are required.

Donation URLs are owner-supplied destinations, opened as normal links. No payment credentials or embedded payment scripts are stored here.
