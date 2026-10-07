from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent.parent
PRINT = ROOT / "print/png"
PREV = ROOT / "previews"
W, H = 1800, 820
canvas = Image.new("RGB", (W, H), (7, 10, 18))
d = ImageDraw.Draw(canvas)
font = "/usr/share/fonts/liberation/LiberationSans-Regular.ttf"
bold = "/usr/share/fonts/liberation/LiberationSans-Bold.ttf"
small = ImageFont.truetype(font, 17)
label = ImageFont.truetype(bold, 20)

def tee(x, back=False):
    # Flat garment silhouette, drawn at 3x resolution for clean edges.
    s = 3
    im = Image.new("RGBA", (500*s, 600*s), (0, 0, 0, 0))
    p = ImageDraw.Draw(im)
    pts = [(160, 20), (200, 4), (250, 30), (300, 4), (340, 20), (490, 132),
           (438, 225), (390, 190), (390, 590), (110, 590), (110, 190), (62, 225), (10, 132)]
    p.polygon([(a*s,b*s) for a,b in pts], fill=(15, 16, 20, 255), outline=(75, 83, 94, 255), width=2*s)
    p.arc((190*s, 2*s, 310*s, 98*s), 0, 180, fill=(56, 60, 69, 255), width=3*s)
    im = im.resize((500,600), Image.Resampling.LANCZOS)
    art = Image.open(PRINT / "neon-coffin-storefront-front-7.5x9in-4500x5400-600dpi.png").convert("RGBA")
    if back:
        url = Image.open(PRINT / "neon-coffin-back-neck-horror-marquee-url-3.25x1.08in-1950x650-600dpi.png").convert("RGBA")
        url.thumbnail((100, 34), Image.Resampling.LANCZOS)
        im.alpha_composite(url, ((500-url.width)//2, 100))
    else:
        art.thumbnail((248, 298), Image.Resampling.LANCZOS)
        im.alpha_composite(art, ((500-art.width)//2, 142))
        emblem = Image.open(PRINT / "coffin-cassette-sleeve-2.5x2.28in-1500x1370-600dpi.png").convert("RGBA")
        emblem.thumbnail((48, 44), Image.Resampling.LANCZOS)
        # Place the mark on the visible wearer-left sleeve, scaled to a discreet patch.
        im.alpha_composite(emblem, (29, 157))
    canvas.paste(im, (x, 115), im)

tee(100, False)
tee(690, True)
d.rounded_rectangle((1310, 140, 1695, 710), radius=14, fill=(16, 19, 27), outline=(54, 64, 74), width=2)
d.text((1350, 170), "SLEEVE MARK", fill=(168, 255, 50), font=label)
em = Image.open(PRINT / "coffin-cassette-sleeve-2.5x2.28in-1500x1370-600dpi.png").convert("RGBA")
em.thumbnail((260, 260), Image.Resampling.LANCZOS)
canvas.paste(em, (1378, 250), em)
d.text((1350, 560), "Small coffin-cassette emblem", fill=(226, 222, 216), font=small)
d.text((1350, 590), "on outer upper sleeve", fill=(146, 151, 163), font=small)
d.text((230, 740), "FRONT", fill=(239, 235, 226), font=label)
d.text((820, 740), "BACK / URL BELOW COLLAR", fill=(239, 235, 226), font=label)
d.text((80, 785), "Placement concept only — not a Fourthwall garment mockup. Final print scale is adjustable in the product editor.", fill=(142, 151, 166), font=small)
canvas.save(PREV / "neon-coffin-three-placement-shirt-concept.jpg", quality=94)
