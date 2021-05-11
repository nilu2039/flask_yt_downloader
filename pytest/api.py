from flask import Flask, request, Response, send_file, safe_join
from flask_restful import Api, Resource
import youtube_dl
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS, cross_origin
ydl_opts = {}
fnl = {}
fnl_json = []
app = Flask(__name__)

api = Api(app)
CORS(app)

with open("file.json", "w") as out_file:
    json.dump(fnl_json, out_file)


con = psycopg2.connect(
    host="localhost",
    database="yt_download",
    user="postgres",
    password="ht906200"
)

cur = con.cursor(cursor_factory=RealDictCursor)


class FetchDetails(Resource):
    def post(self):
        url = request.json['url']
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            meta = ydl.extract_info(
                url, download=False)
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
                fnl_json.append(fnl)
                cur.execute("insert into format(code,extension,resolution,note,title,url,thumbnail) values(%s ,%s ,%s ,%s,%s,%s,%s)",
                            (f['format_id'], f['ext'], ydl.format_resolution(f), ydl._format_note(f), meta.get('title', None), f['url'], meta.get('thumbnail', [meta])))
        cur.execute("select * from format")
        rows = cur.fetchall()
        cur.execute("delete from format")
        con.commit()
        return rows


class DownloadVideo(Resource):
    def post(self):
        code = request.json['code']
        url = request.json['url']
        ydl_opts_download = {}
        with youtube_dl.YoutubeDL(ydl_opts_download) as ydl:
            meta = ydl.extract_info(
                url, download=False)
            formats = meta.get('formats', [meta])
            for f in formats:
                if(f['format_id'] == code):
                    return {"url": f['url'], "resolution": ydl.format_resolution(f)}


api.add_resource(FetchDetails, "/v1/api/details")
api.add_resource(DownloadVideo, "/v1/api/download")

if __name__ == "__main__":
    app.run(debug=True)
cur.close()
con.close()
