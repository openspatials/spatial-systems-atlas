#!/usr/bin/env python3
"""Inline the exported territory data into the C4 page, so it can be published as one file.

`build.py` writes `board/territory.json` from the database and inlines it into the matrix.
This step does the same for `board/c4.html`, and nothing else: it reads the JSON that
`build.py` already wrote and never touches the database, the matrix or the module beside it.
The inlining pattern is `build.py` lines 92 to 101, copied rather than imported.
"""
import json, os

D = os.path.dirname(os.path.abspath(__file__))
board = os.path.join(os.path.dirname(D), "board")

json_path = os.path.join(board, "territory.json")
if not os.path.exists(json_path):
    raise SystemExit(json_path + " is missing; run build.py first")

# Re-serialize with the same separators build.py uses, so the inlined block is byte for byte
# the payload the matrix carries.
with open(json_path) as fh:
    payload = json.dumps(json.load(fh), separators=(",", ":"))

src = open(os.path.join(board, "c4.html")).read()
marker = '<script id="territory-data"'
if marker in src:
    head, rest = src.split(marker, 1)
    src = head + rest.split("</script>", 1)[1]
inline = ('<script id="territory-data" type="application/json">'
          + payload.replace("</", "<\\/") + "</script>\n")
if "<script>\n(function(){" not in src:
    raise SystemExit("c4.html no longer opens its script with <script>\\n(function(){")
src = src.replace("<script>\n(function(){", inline + "<script>\n(function(){", 1)

out_path = os.path.join(board, "c4-standalone.html")
open(out_path, "w").write(src)
print("wrote", out_path, "|", len(src), "bytes | data", len(payload), "bytes")
