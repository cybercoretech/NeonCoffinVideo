#!/usr/bin/env python3
"""Fetch real poster art for catalogue entries that still use vector placeholders."""
import json
import os
import re
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
SOURCES = os.path.join(ROOT, "artwork-sources.json")
MOVIES = os.path.join(ROOT, "movies.json")
HEADERS = {"User-Agent": "NeonCoffinVideoArtworkAudit/1.0 (local website project)"}

def request(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=25)

sources = {item.get("slug"): item for item in json.load(open(SOURCES, encoding="utf-8"))}
movies = json.load(open(MOVIES, encoding="utf-8"))
updated = 0
unresolved = []
for movie in movies:
    old = movie.get("poster", "")
    if not old.endswith(".svg"):
        continue
    slug = os.path.basename(old)[:-4]
    record = sources.get(slug, {})
    page = record.get("page", "")
    title = movie["title"]
    if page:
        page_title = urllib.parse.unquote(page.split("/wiki/", 1)[-1]).replace("_", " ")
    else:
        page_title = title
    api = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode({
        "action": "query", "format": "json", "prop": "pageimages",
        "piprop": "original", "titles": page_title,
    })
    try:
        with request(api) as response:
            data = json.load(response)
        pages = data.get("query", {}).get("pages", {})
        page_data = next(iter(pages.values()))
        image_url = page_data.get("original", {}).get("source")
        if not image_url:
            unresolved.append((title, "Wikipedia page has no poster image"))
            continue
        with request(image_url) as response:
            body = response.read()
            content_type = response.headers.get("Content-Type", "")
        if len(body) < 8000 or not content_type.startswith("image/"):
            unresolved.append((title, f"invalid image response ({content_type}, {len(body)} bytes)"))
            continue
        ext = ".png" if "png" in content_type else ".webp" if "webp" in content_type else ".jpg"
        local = "assets/" + slug + ext
        with open(os.path.join(ROOT, local), "wb") as output:
            output.write(body)
        movie["poster"] = local
        record["image_source"] = image_url
        record["local"] = local
        record["credit"] = "Poster image served by Wikimedia Commons/Wikipedia; source page linked above."
        print(f"OK {title}: {local} ({len(body)} bytes)")
        updated += 1
    except Exception as error:
        unresolved.append((title, str(error)))
    time.sleep(0.15)

if updated:
    with open(MOVIES, "w", encoding="utf-8") as output:
        json.dump(movies, output, ensure_ascii=False, indent=2)
        output.write("\n")
    with open(SOURCES, "w", encoding="utf-8") as output:
        json.dump(list(sources.values()), output, ensure_ascii=False, indent=2)
        output.write("\n")
print(f"\nDownloaded {updated} poster files.")
if unresolved:
    print("Needs manual source:")
    for title, reason in unresolved:
        print(f"- {title}: {reason}")
