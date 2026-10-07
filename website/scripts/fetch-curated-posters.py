#!/usr/bin/env python3
"""Install sourced theatrical poster files for the previously placeholder-only tapes."""
import json, os, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSET_DIR = os.path.join(ROOT, 'assets')
USER_AGENT = 'NeonCoffinVideoArtwork/1.0 (poster-source audit)'
# These are poster images returned for the exact film titles during the artwork audit.
POSTERS = {
    'the-burning': ('https://ourculturemag.com/wp-content/uploads/2017/07/burning_poster_01.jpg', 'The Burning (1981)', 'https://ourculturemag.com/2017/07/18/review-burning-1981/'),
    'pieces': ('https://images.squarespace-cdn.com/content/v1/6359b21937dd3e5b9cc94612/1666832522314-GBL79LZHWC8I14DQHNRO/Pieces-pos.jpg', 'Pieces (1982)', 'https://schlockmania.com/blog/pieces'),
    'prom-night': ('https://www.originalfilmart.com/cdn/shop/products/prom_night_1980_original_film_art_600x.jpg?v=1601128863', 'Prom Night (1980)', 'https://www.originalfilmart.com/es-ar/products/prom-night-1980'),
    'intruder': ('https://image.tmdb.org/t/p/original/6fBOp5g5ifM54NUTx5qwhe9vAxt.jpg', 'Intruder (1989)', 'https://www.themoviedb.org/movie/31150-intruder/images/posters'),
    'the-prowler': ('https://image.tmdb.org/t/p/original/sDwxR4mv57RG4uNsYhvLPrja8TB.jpg', 'The Prowler (1981)', 'https://www.themoviedb.org/movie/44247-the-prowler/images/posters'),
    'hell-night': ('https://m.media-amazon.com/images/M/MV5BM2UyOGI4NmQtNzZiYy00ODkyLTg3ZmMtODUzNzhiZjMxYWUyXkEyXkFqcGc%40._V1_FMjpg_UY672_.jpg', 'Hell Night (1981)', 'https://www.imdb.com/title/tt0082511/mediaviewer/'),
    'spookies': ('https://pics.filmaffinity.com/Spookies-342495401-large.jpg', 'Spookies (1986)', 'https://www.filmaffinity.com/es/film362847.html'),
    'blood-hook': ('https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak%3D/v3/t/assets/p48540_p_v8_aa.jpg', 'Blood Hook (1986)', 'https://www.rottentomatoes.com/m/blood_hook'),
    'class-nuke-em-high': ('https://www.25thframe.co.uk/film-images/class-of-nuke-em-high.jpg', "Class of Nuke 'Em High (1986)", 'https://www.25thframe.co.uk/movies/class-of-nuke-em-high/cast-and-crew'),
    'surf-nazis-must-die': ('https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak%3D/v3/t/assets/p10027_p_v8_aa.jpg', 'Surf Nazis Must Die (1987)', 'https://www.rottentomatoes.com/m/surf_nazis_must_die'),
    'redneck-zombies': ('https://m.media-amazon.com/images/M/MV5BYjFkODRiZDctMmE5Zi00MjE0LWEyNDgtZWUyYjg5MjFjZWQ1XkEyXkFqcGc%40._V1_FMjpg_UX1000_.jpg', 'Redneck Zombies (1987)', 'https://www.imdb.com/title/tt0093833/'),
    'suspiria': ('https://images.squarespace-cdn.com/content/v1/5a7dcf69d7bdce185884a6b5/1535649497194-MZ8YY7YMYAIIAGC6XC5Y/hmm-suspiria.jpg', 'Suspiria (1977)', 'https://www.truemythmedia.com/true-myth-media/reviews/suspiria1977'),
    'deep-red': ('https://filmartgallery.com/cdn/shop/files/Deep-Red-Profondo-Rosso-Vintage-Movie-Poster-Original.jpg?v=1771939685&width=1200', 'Deep Red / Profondo Rosso (1975)', 'https://filmartgallery.com/products/deep-red-profondo-rosso-2'),
    'inferno': ('https://cdn.posteritati.com/posters/000/000/065/372/inferno-md-web.jpg', 'Inferno (1980)', 'https://posteritati.com/poster/55507/inferno-1980-italian-due-fogli-poster'),
    'tenebrae': ('https://cdn.posteritati.com/posters/000/000/065/214/tenebre-md-web.jpg', 'Tenebrae (1982)', 'https://posteritati.com/poster/55480/tenebrae-1982-italian-due-fogli-poster'),
    'opera': ('https://image.tmdb.org/t/p/original/1Kh1DNS6suo6qPDGCYvIfXdhJvT.jpg', 'Opera (1987)', 'https://www.themoviedb.org/movie/20115-opera/images/posters'),
    'zombi-2': ('https://www.varietydistribution.it/wp-content/uploads/2018/02/ZOMBI-2.-Locandina-566x800.png', 'Zombie / Zombi 2 (1979)', 'https://www.varietydistribution.it/en/catalogue/zombi-2/'),
    'city-of-the-living-dead': ('https://stulovesfilm.com/wp-content/uploads/2013/06/81b6c-city20of20the20living20dead-poster20320by20silverfox.jpg?w=1000', 'City of the Living Dead (1980)', 'https://stulovesfilm.com/movies-of-time-long-gone/city-of-the-living-dead-1980/'),
    'the-beyond': ('https://i.etsystatic.com/19463182/r/il/ff6737/5045507765/il_fullxfull.5045507765_im1s.jpg', 'The Beyond (1981)', 'https://www.etsy.com/listing/1502739635/the-beyond-original-vintage-movie-poster'),
    'house-by-the-cemetery': ('https://www.simondwyer.com/files/house-by-the-cemetery-10205.jpg', 'The House by the Cemetery (1981)', 'https://www.simondwyer.com/house-by-the-cemetery-original-movie-poster-uk-quad-40x30-10205.html'),
    'new-york-ripper': ('https://pics.filmaffinity.com/The_New_York_Ripper-467869555-large.jpg', 'The New York Ripper (1982)', 'https://www.filmaffinity.com/us/movieimage.php?imageId=467869555'),
    'sleepaway-camp-ii': ('https://m.media-amazon.com/images/M/MV5BMTk3ZjM5MDAtZGVmNS00NDgyLTk3Y2QtMzEwOWM2NzNkYzIyXkEyXkFqcGc%40._V1_FMjpg_UX1000_.jpg', 'Sleepaway Camp II: Unhappy Campers (1988)', 'https://www.imdb.com/pt/title/tt0096118/mediaviewer/'),
    'sleepaway-camp-iii': ('https://scopophiliamovieblog.com/wp-content/uploads/2023/10/sleepaway3.jpg', 'Sleepaway Camp III: Teenage Wasteland (1989)', 'https://scopophiliamovieblog.com/2023/10/23/sleepaway-camp-iii-teenage-wasteland-1989/'),
    'slumber-party-massacre': ('https://image.tmdb.org/t/p/original/aMjJZDRxugmv3fNJBMCfgfff4PN.jpg', 'The Slumber Party Massacre (1982)', 'https://www.themoviedb.org/movie/27475-the-slumber-party-massacre/images/posters'),
    'slumber-party-massacre-ii': ('https://s3.amazonaws.com/nightjarprod/content/uploads/sites/3/2022/05/17153039/slumber-party-massacre-2-poster.jpg', 'Slumber Party Massacre II (1987)', 'https://nitehawkcinema.com/williamsburg/movies/slumber-party-massacre-ii/'),
    'slumber-party-massacre-iii': ('https://media-cache.cinematerial.com/p/500x/iujf9646/slumber-party-massacre-iii-movie-poster.jpg?v=1725685123', 'Slumber Party Massacre III (1990)', 'https://www.cinematerial.com/movies/slumber-party-massacre-iii-i100639/p/iujf9646'),
    'toxic-avenger': ('https://s3.amazonaws.com/nightjarprod/content/uploads/sites/202/2024/04/27210104/toxic_avenger_xxlg.jpeg', 'The Toxic Avenger (1984)', 'https://independentpicturehouse.org/movies/the-toxic-avenger/'),
    'evil-spawn': ('https://m.media-amazon.com/images/M/MV5BMTUzNDQxMzkzOV5BMl5BanBnXkFtZTcwOTE4MjEzMQ%40%40._V1_FMjpg_UX1000_.jpg', 'Evil Spawn (1987)', 'https://www.imdb.com/title/tt0092992/'),
    'necropolis-1986': ('https://i.ebayimg.com/images/g/SXEAAOSwhD9jwopl/s-l1600.jpg', 'Necropolis (1986)', 'https://www.ebay.com/itm/376711773092'),
    'nightbreed': ('https://image.tmdb.org/t/p/original/7lZHfBdmj14IturP05nLI9xQyn4.jpg', 'Nightbreed (1990)', 'https://www.themoviedb.org/movie/20481-nightbreed/images/posters'),
    'children-of-the-corn': ('https://cdn.shopify.com/s/files/1/1416/8662/products/children_of_the_corn_1984_original_film_art_spo_2000x.jpg?v=1562538449', 'Children of the Corn (1984)', 'https://www.originalfilmart.com/products/children-of-the-corn-1984'),
    'silver-bullet': ('https://image.tmdb.org/t/p/original/AcFFMJBdGltUUG6gQXUsbUuUp9p.jpg', 'Silver Bullet (1985)', 'https://www.themoviedb.org/movie/17898-silver-bullet/images/posters'),
}

movies_path = os.path.join(ROOT, 'movies.json')
movies = json.load(open(movies_path, encoding='utf-8'))
movie_ids = {movie['id']: movie for movie in movies}
extra_path = os.path.join(ROOT, 'catalogue-extra.json')
extras = json.load(open(extra_path, encoding='utf-8'))
extra_ids = {movie['id']: movie for movie in extras}
italian_path = os.path.join(ROOT, 'italian-horror.js')
italian = open(italian_path, encoding='utf-8').read()
source_path = os.path.join(ROOT, 'artwork-sources.json')
sources = json.load(open(source_path, encoding='utf-8'))
by_slug = {item.get('slug'): item for item in sources}
success = 0
for slug, (url, title, page) in POSTERS.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req, timeout=30) as response:
            data, mime = response.read(), response.headers.get('Content-Type', '')
        if len(data) < 8000 or not mime.startswith('image/'):
            raise ValueError(f'not an image or too small: {mime}, {len(data)} bytes')
        ext = '.png' if 'png' in mime else '.webp' if 'webp' in mime else '.jpg'
        local = f'assets/{slug}{ext}'
        with open(os.path.join(ROOT, local), 'wb') as output:
            output.write(data)
        if slug in movie_ids:
            movie_ids[slug]['poster'] = local
        if slug in extra_ids:
            extra_ids[slug]['art'] = ext[1:]
        # Replace only this film's artwork field.
        marker = f"id:'{slug}'"
        at = italian.find(marker)
        if at >= 0:
            end = italian.find('},', at)
            if end < 0: end = italian.find('}', at)
            part = italian[at:end]
            import re
            part = re.sub(r"art:'svg'", f"art:'{ext[1:]}'", part)
            italian = italian[:at] + part + italian[end:]
        by_slug[slug] = {'slug': slug, 'page': page, 'image_source': url, 'local': local,
                         'credit': f'{title} theatrical poster; source page linked.'}
        print(f'OK {slug}: {local} ({len(data)} bytes)')
        success += 1
    except Exception as error:
        print(f'FAILED {slug}: {error}')
    time.sleep(.12)

with open(movies_path, 'w', encoding='utf-8') as output:
    json.dump(movies, output, ensure_ascii=False, indent=2); output.write('\n')
with open(extra_path, 'w', encoding='utf-8') as output:
    json.dump(extras, output, ensure_ascii=False, indent=2); output.write('\n')
with open(os.path.join(ROOT, 'catalogue.js'), 'w', encoding='utf-8') as output:
    output.write('const ncvCatalogExtra = ' + json.dumps(extras, ensure_ascii=False, separators=(',', ':')) + ';\n')
with open(italian_path, 'w', encoding='utf-8') as output: output.write(italian)
with open(source_path, 'w', encoding='utf-8') as output:
    json.dump(list(by_slug.values()), output, ensure_ascii=False, indent=2); output.write('\n')
print(f'\nInstalled {success} sourced poster files.')
