import psycopg2
import json
from psycopg2.extras import RealDictCursor
con = psycopg2.connect(
    host="localhost",
    database="yt_download",
    user="postgres",
    password="ht906200"
)
result = []
cur = con.cursor(cursor_factory=RealDictCursor)

cur.execute("select * from format")


print(json.dumps(cur.fetchall(), indent=2))


cur.close()
con.close()
