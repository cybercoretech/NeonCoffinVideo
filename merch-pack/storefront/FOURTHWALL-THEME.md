# Neon Coffin Video — custom Fourthwall horror theme

Prepared October 6, 2026 against the live shop's actual HTML and the user's editor screenshots.

## Review

Open `theme-preview.html` for the homepage and `product-preview.html` for the tee page. These are local design previews made from the real Fourthwall pages, with the actual artwork, garment photographs, product details, and $29.98 price. Checkout is not functional in the local copies.

The preview uses the transparent SVG header logo. The current live header serves a JPEG with a white rectangle. The supplied SVG is a container around the original transparent wordmark image, not a traced vector font; it retains the approved lettering and full image resolution.

The garment photographs also contain white backgrounds baked into the images. CSS does not remove those backgrounds. The theme keeps the actual product photography, rather than inventing a different shirt.

## Apply using the controls visible in your editor

1. Click **Style** beside **Layout**.
2. Expand **Logo**, directly below **Background visual**.
3. Upload `neon-coffin-video-header-pink.svg` as the logo. It is 487,635 bytes, below the documented 512 KB limit. Check that Fourthwall preserves its transparency in the preview.
4. Open `fourthwall-header-code.txt` in a text editor and copy its entire contents.
5. In the same **Style** panel, scroll down and expand **Edit HTML code**.
6. Check **Enable header code**, then paste the complete file into the first text field.
7. Leave the footer code field empty; this file contains both the style and the presentation script.
8. Review desktop and phone views, then **Save**. The shop is already live, so saving applies these changes to the live storefront.

The file is 16,920 characters, within the editor's displayed 25,000-character limit. It replaces no checkout forms and leaves native product prices, sizes, cart links, and policy links in place.

To disable the treatment, uncheck **Enable header code** and save. The script only changes the rendered page; it does not edit your catalog or saved page sections.

## Treatment

- Pink horror-marquee header, black background, acid-green accents.
- Neon-framed storefront hero with the complete existing artwork.
- Real link to the existing Storefront Tee, including when the artwork is clicked.
- Merch shelf with the actual garment photo, price, and front/sleeve/back-neck details.
- Styling for the existing product page and size buttons.
- Branded footer with the actual link back to Neon Coffin Video.
- Bebas Neue display lettering, IBM Plex Sans body text, and JetBrains Mono labels, loaded from the existing movie site's font files. The header uses the approved illustrated lettering.
- Responsive artwork/text placement on tablets and phones; reduced-motion support.

## Verification

The local copies were checked at 1440, 820, 390, and 320 pixels, plus desktop and phone product views. The checks found no horizontal overflow or JavaScript errors. All visible homepage artwork and fonts loaded; the native mobile menu opened, size selection worked, and the existing Add to Cart control remained available. No purchase was made.

`theme-verification.json` contains the check results. Screenshots are saved as `theme-desktop.png`, `theme-tablet.png`, `theme-mobile.png`, `theme-small-mobile.png`, `theme-product-shelf.png`, `theme-product.png`, and `theme-product-mobile.png`.

The production code targets the real section IDs present in this shop. Deleting/recreating the artwork or featured collection section may require updating those selectors.

## Files

- `fourthwall-header-code.txt`: copy/paste file for Fourthwall.
- `horror-store-theme.css` and `horror-store-theme.js`: editable source.
- `neon-coffin-video-header-pink.svg`: recommended transparent logo upload to try.
- `neon-coffin-video-header-pink.webp` and `.png`: original image exports.
- `preview-assets/`: unchanged copies of the actual public theme assets, product photos, and existing local font files, used for reliable local previewing.
