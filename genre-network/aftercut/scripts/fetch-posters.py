#!/usr/bin/env python3
"""Fetch local film-cover artwork using Wikipedia page-image metadata.

Copyrighted poster artwork is used here as linked editorial/fan-site reference
material. The generated manifest records the article and original image URL.
"""
import json
import html
import re
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote, unquote, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "app.js"
ADDITIONS = ROOT / "archive-additions.js"
DEST = ROOT / "assets" / "posters"
MANIFEST = ROOT / "poster-sources.json"
UA = "AFTERCUT-horror-editorial/1.0 (film poster reference archive; local fan/editorial site)"
ALIASES = {
    "Scream": "Scream (1996 film)",
    "The Faculty": "The Faculty (1998 film)",
    "Ringu": "Ring (film)",
    "The Ring": "The Ring (2002 film)",
    "Rings": "Rings (2017 film)",
    "Audition": "Audition (1999 film)",
    "The Blair Witch Project": "The Blair Witch Project",
    "Final Destination": "Final Destination (film)",
    "American Psycho": "American Psycho (film)",
    "Ginger Snaps": "Ginger Snaps",
    "Battle Royale": "Battle Royale (film)",
    "From Dusk Till Dawn": "From Dusk till Dawn",
    "From Dusk Till Dawn 2: Texas Blood Money": "From Dusk Till Dawn 2: Texas Blood Money",
    "From Dusk Till Dawn 3: The Hangman’s Daughter": "From Dusk Till Dawn 3: The Hangman's Daughter",
    "28 Days Later": "28 Days Later",
    "Ichi the Killer": "Ichi the Killer",
    "Resident Evil": "Resident Evil (2002 film)",
    "Resident Evil: Apocalypse": "Resident Evil: Apocalypse",
    "Resident Evil: Extinction": "Resident Evil: Extinction",
    "Resident Evil: Afterlife": "Resident Evil: Afterlife",
    "Resident Evil: Retribution": "Resident Evil: Retribution",
    "Resident Evil: The Final Chapter": "Resident Evil: The Final Chapter",
    "Ginger Snaps 2: Unleashed": "Ginger Snaps 2: Unleashed",
    "Ginger Snaps Back": "Ginger Snaps Back: The Beginning",
    "Dawn of the Dead": "Dawn of the Dead (2004 film)",
    "Saw": "Saw (2004 film)",
    "The Descent": "The Descent",
    "Hostel": "Hostel (2005 film)",
    "The Descent Part 2": "The Descent Part 2",
    "The Cabin in the Woods": "The Cabin in the Woods",
    "The Witch": "The Witch (2015 film)",
    "Train to Busan": "Train to Busan",
    "Terrifier": "Terrifier (film)",
    "Possessor": "Possessor",
    "The Blackcoat’s Daughter": "The Blackcoat's Daughter",
    "Longlegs": "Longlegs (film)",
    "X": "X (2022 film)",
    "Pearl": "Pearl (2022 film)",
    "MaXXXine": "MaXXXine",
    "When Evil Lurks": "When Evil Lurks",
    "Scream 2": "Scream 2",
    "Scream 3": "Scream 3",
    "Scream 4": "Scream 4",
    "Scream (2022)": "Scream (2022 film)",
    "Scream VI": "Scream VI",
    "Scream 7": "Scream 7",
    "The Ring Two": "The Ring Two",
    "Terrifier 2": "Terrifier 2",
    "Terrifier 3": "Terrifier 3",
    "Don’t Move": "Don't Move (2026 film)",
    "Crimes of the Future": "Crimes of the Future",
    "Resident Evil (2026)": "Resident Evil (2026 film)",
    "Breeder": "Breeder (2026 film)",
    "Victorian Psycho": "Victorian Psycho (film)",
    "Dark Hollow": "Dark Hollow (2026 film)",
    "In a Violent Nature 2": "In a Violent Nature 2",
    "Grin": "Grin (2026 film)",
    "Beware Boiúna": "Beware Boiúna",
    "Onslaught": "Onslaught (2026 film)",
    "Crystal Lake": "Crystal Lake (TV series)",
    "She Saw Us": "She Saw Us (film)",
}
DIRECT_ART = {
    "Crystal Lake": {
        "source": "https://www.impawards.com/tv/posters/crystal_lake.jpg",
        "page": "https://www.impawards.com/tv/crystal_lake.html",
    },
}

def get_json(url):
    req = Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    for attempt in range(6):
        try:
            with urlopen(req, timeout=25) as response:
                return json.loads(response.read())
        except HTTPError as exc:
            if exc.code != 429 or attempt == 5:
                raise
            time.sleep(min(35, 5 * (attempt + 1)))

def page_summary(title):
    return get_json("https://en.wikipedia.org/api/rest_v1/page/summary/" + quote(title.replace(" ", "_"), safe="():'!,"))

def search_summary(title):
    query = quote(title + " film poster")
    data = get_json("https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=" + query + "&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=720")
    pages = (data.get("query") or {}).get("pages") or {}
    return next(iter(pages.values()), None)

def slug(title):
    value = unquote(title).lower().replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value

def films():
    text = APP.read_text(encoding="utf-8")
    records = re.findall(r"\{t:'(.*?)',y:(\d+),", text.split("const highlights")[0])
    highlights = text.split("const highlights")[1].split("const $")[0]
    extra = re.findall(r"\['((?:\\.|[^'])*)',(\d+),", ADDITIONS.read_text(encoding="utf-8"))
    return list(dict.fromkeys(records + re.findall(r"\{t:'(.*?)',y:(\d+),", highlights) + extra))

def fallback_poster(title, year, path):
    escaped = html.escape(title.upper())
    words = escaped.split()
    lines, line = [], ""
    for word in words:
        if line and len(line) + len(word) > 15:
            lines.append(line); line = ""
        line = (line + " " + word).strip()
    if line: lines.append(line)
    lines = lines[:4]
    title_svg = "".join(f'<tspan x="25" dy="{0 if i == 0 else 34}">{html.escape(v)}</tspan>' for i, v in enumerate(lines))
    code = re.sub(r"[^A-Z0-9]", "", title.upper())[:14] or "AFTERCUT"
    palette = [("#1c2026", "#e53b46"), ("#23211b", "#c9ab52"), ("#202626", "#79b6a0"), ("#241e29", "#a585c2"), ("#291e1d", "#df8057")]
    slot = sum(map(ord, title)) % len(palette)
    base, accent = palette[slot]
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><defs><linearGradient id="wash" x2="0" y2="1"><stop stop-color="{accent}" stop-opacity=".72"/><stop offset=".52" stop-color="{base}"/><stop offset="1" stop-color="#08090b"/></linearGradient><radialGradient id="glow"><stop stop-color="{accent}" stop-opacity=".74"/><stop offset="1" stop-color="{accent}" stop-opacity="0"/></radialGradient><filter id="grain"><feTurbulence baseFrequency=".8" numOctaves="2" seed="{slot+3}"/><feColorMatrix values=".4 0 0 0 .3 .4 0 0 0 .3 .4 0 0 0 .3 0 0 0 .13 0"/></filter></defs><rect width="300" height="450" fill="{base}"/><rect width="300" height="450" fill="url(#wash)"/><circle cx="205" cy="156" r="142" fill="url(#glow)"/><path d="M0 330 300 55M-35 418 280 124M45 450 300 214" stroke="{accent}" stroke-opacity=".25" stroke-width="3"/><path d="M18 18h264v414H18z" fill="none" stroke="#f6ece3" stroke-opacity=".54"/><rect width="300" height="450" filter="url(#grain)" opacity=".24"/><text x="26" y="48" fill="#fff4e9" font-family="monospace" font-size="10" letter-spacing="3">AFTER/CUT  /  FILE {year}</text><text x="25" y="315" fill="#fff4ec" font-family="Impact,sans-serif" font-size="29" font-weight="900">{title_svg}</text><text x="26" y="403" fill="{accent}" font-family="monospace" font-size="11" letter-spacing="3">{code}</text></svg>'''
    path.write_text(svg, encoding="utf-8")

def main():
    DEST.mkdir(parents=True, exist_ok=True)
    records = []
    previous = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else []
    known = {item["title"]: item for item in previous}
    titles = films()
    for n, (title, year) in enumerate(titles, 1):
        existing = known.get(title)
        if existing and not existing.get("artwork") and (ROOT / existing["local"]).exists():
            records.append(existing)
            print(f"[{n}/{len(titles)}] cached {title}", flush=True)
            continue
        page = ALIASES.get(title, title)
        try:
            data = page_summary(page) if title not in DIRECT_ART else {}
            thumb = data.get("thumbnail") or data.get("originalimage")
            source = DIRECT_ART.get(title, {}).get("source") or (thumb and thumb.get("source"))
            article = DIRECT_ART.get(title, {}).get("page") or data.get("content_urls", {}).get("desktop", {}).get("page")
            if not source:
                result = search_summary(title + " " + year)
                thumb = (result or {}).get("thumbnail")
                source = thumb and thumb.get("source")
                article = "https://en.wikipedia.org/wiki/" + quote((result or {}).get("title", "").replace(" ", "_")) if result else article
            if not source:
                path = DEST / (slug(title) + ".svg")
                fallback_poster(title, year, path)
                records.append({"title": title, "year": int(year), "page": None, "image_source": None, "content_type": "image/svg+xml", "local": str(path.relative_to(ROOT)), "artwork": "AFTER/CUT original title-card artwork"})
                print(f"[{n}/{len(titles)}] designed fallback cover: {title}", flush=True)
                MANIFEST.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
                continue
            image_req = Request(source, headers={"User-Agent": UA})
            for attempt in range(6):
                try:
                    with urlopen(image_req, timeout=30) as image_response:
                        blob = image_response.read()
                        content_type = image_response.headers.get("Content-Type", "image/jpeg")
                    break
                except HTTPError as exc:
                    if exc.code != 429 or attempt == 5:
                        raise
                    time.sleep(min(35, 5 * (attempt + 1)))
            suffix = ".png" if "png" in content_type else ".webp" if "webp" in content_type else ".jpg"
            path = DEST / (slug(title) + suffix)
            path.write_bytes(blob)
            records.append({"title": title, "year": int(year), "page": article, "image_source": source, "content_type": content_type, "local": str(path.relative_to(ROOT))})
            print(f"[{n}/{len(titles)}] saved {title} ({len(blob)//1024} KB)", flush=True)
        except (HTTPError, URLError, TimeoutError, ValueError, KeyError) as exc:
            path = DEST / (slug(title) + ".svg")
            fallback_poster(title, year, path)
            records.append({"title": title, "year": int(year), "page": None, "image_source": None, "content_type": "image/svg+xml", "local": str(path.relative_to(ROOT)), "artwork": "AFTER/CUT original title-card artwork"})
            print(f"[{n}/{len(titles)}] using designed cover for {title}: {exc}", flush=True)
        MANIFEST.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        time.sleep(0.3)
    MANIFEST.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Downloaded {len(records)} covers from {len(titles)} catalogue entries.")

if __name__ == "__main__":
    main()
