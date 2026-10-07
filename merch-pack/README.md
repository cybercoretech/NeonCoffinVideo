# Neon Coffin Video — merch artwork pack

This is a working art bundle for a possible Fourthwall launch. It is local artwork only: no shop, account, product listing, or order has been created. Concepts are unapproved unless explicitly accepted. The earlier wordmark-only shirt draft was rejected and moved to `rejected/`; do not use it.

## Folder map

- `source/` — original site artwork, kept intact.
- `print/png/` — transparent PNG exports sized for apparel print areas. Check each asset's effective source resolution, not only the canvas DPI metadata.
- `print/svg/` — vector source for the Open After Dark sign and new concept designs.
- `concepts/` — editable concept SVGs plus PNG previews, not approved for sale yet.
- `previews/` — a contact sheet to review the proposed concepts together.

## Current brand art

- **Coffin-cassette emblem:** the site's existing 1312 × 1199 px transparent PNG. The 1200 px apparel export preserves the source detail; the 3600 px export is an enlarged derivative for mockups and provider upload convenience, not newly created detail. Best initial use: small chest print or sticker; order a sample before using as a large front print.
- **Open After Dark sign:** the vector SVG is the scalable source; a large transparent PNG export is included. The battered PNG is also preserved at original resolution for a more distressed look.
- **Storefront shirt illustration:** `print/png/neon-coffin-storefront-transparent-edges-source-1145x1374.png` has transparent edges so the garment shows through around the illustration. The opaque upscaler-input version was rejected because its near-black matte showed as a gray rectangle on the shirt; it is kept under `rejected/`. The transparent source is only 1145 × 1374 px, so it is a visual concept, not a high-resolution large-print master.
- **Storefront:** included as a reference image only. It is a full scene with a background, so it is not a transparent shirt graphic.

## Storefront shirt set — review draft

- **Front:** `concepts/neon-coffin-storefront-rebuild-source-1145x1374.png` is a fresh transparent redraw with the marquee and scene rebuilt in a bold screen-print style. `print/png/neon-coffin-storefront-front-7.5x9in-4500x5400-600dpi.png` is the 7.5 × 9 inch, 600-DPI canvas export. `print/png/neon-coffin-storefront-front-native-detail-1145x1374-300dpi.png` preserves the actual source detail at 300 DPI, printing 3.82 × 4.58 inches.
- **Back neck:** `source/neon-coffin-horror-marquee-url-lockup-source-2172x724.png` is the new transparent lettering artwork, styled to match the jagged neon type on the storefront marquee. Its print export, `print/png/neon-coffin-back-neck-horror-marquee-url-3.25x1.08in-1950x650-600dpi.png`, is sized for a subtle 3.25 × 1.08 inch back-collar placement.
- **Sleeve:** `print/png/coffin-cassette-sleeve-2.5x2.28in-1500x1370-600dpi.png` uses the existing coffin-cassette emblem, sized for a discreet outer upper-sleeve print.
- **Placement review:** `previews/neon-coffin-three-placement-shirt-concept.jpg` shows all three placements on flat black-shirt silhouettes. It is a placement illustration, not a Fourthwall product mockup.

The previous clean-sans back-neck attempt is rejected and stored under `rejected/`; use the horror-marquee URL file above.

The 600-DPI metadata and output canvas dimensions are correct, but the front illustration contains only 1145 × 1374 source pixels. At 7.5 × 9 inches its source detail resolves to about 153 DPI; resampling and sharpening do not create genuine source detail. Fourthwall's current guide specifies 300 DPI minimum and warns that enlarging a small image does not add real detail. For a stricter 300-DPI front print, use the native-detail 3.82 × 4.58 inch version. The custom back-neck lettering has 2172 × 724 source pixels and is downsampled to its 600-DPI export; the sleeve emblem has about 525 DPI of native source detail at its listed print size. Check the chosen product's actual placement dimensions and quality warning before ordering a sample.

## Print notes

Some PNG canvases have 300 DPI metadata, but metadata does not add detail to small raster source images. Fourthwall currently recommends at least 300 DPI and 5000 × 5000 px; its templates define the exact print region. The wordmark text is vector-rendered at high resolution, while the original emblem and storefront illustration have the pixel limits noted above. Do not use a large-printed image just because its canvas is large. Glow prints as color and contrast; it does not physically emit light.

The concept art uses original horror-video-store motifs and brand copy, not movie posters, character likenesses, or studio logos. Review slogans, color, and layout before deciding whether any concept becomes a product.

## Next step

Choose which concepts (if any) you want refined. After that, we can export a final Fourthwall-specific set, create mockups, then add a Shop link to the site once a storefront exists.
