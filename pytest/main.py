import youtube_dl
import json
ydl_opts = {}
ydl_opts_download = {"format": "22"}
data = []
with youtube_dl.YoutubeDL(ydl_opts_download) as ydl:
    meta = ydl.extract_info(
        "https://www.youtube.com/watch?v=SZQz9tkEHIg", download=False)
    formats = meta.get('formats', [meta])
    for f in formats:
        fnl = {
            "id": f['format_id'],
            "ext": f['ext'],
            "resolution": ydl.format_resolution(f),
            "note": ydl._format_note(f),
            "title": meta.get('title', None),
            "url": f['url'],
            'thumbnail': meta.get('thumbnail', [meta])
        }
        data.append(fnl)
#urls = [format['url'] for format in meta['formats']]
with open("sample.json", "w") as outfile:
    json.dump(data, outfile)
print(data)
