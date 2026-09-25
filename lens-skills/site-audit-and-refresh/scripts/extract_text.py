#!/usr/bin/env python3
"""Extract the visible text of every built page, one .txt per page.

Usage: python3 extract_text.py <build-dir> <out-dir>

Strips scripts, styles, SVG, <nav> and <footer> so the output is what a
visitor reads in the page body. File names mirror the URL path with
"/" replaced by "__" (the root page is home.txt).
"""
import html
import os
import re
import sys

build, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
count = 0
for root, _, files in os.walk(build):
    for name in files:
        if not name.endswith('.html'):
            continue
        path = os.path.join(root, name)
        rel = os.path.relpath(path, build)
        slug = re.sub(r'(^|/)index\.html$', '', rel).replace('.html', '').strip('/')
        slug = slug.replace('/', '__') or 'home'
        s = open(path, encoding='utf-8', errors='ignore').read()
        s = re.sub(r'(?s)<(script|style|svg|nav|footer)[^>]*>.*?</\1>', '', s)
        s = re.sub(r'<(br|/p|/h\d|/li|/div|/section|/tr)[^>]*>', '\n', s)
        s = html.unescape(re.sub(r'<[^>]+>', ' ', s))
        s = re.sub(r'[ \t]+', ' ', s)
        s = re.sub(r'\n\s*\n+', '\n', s).strip()
        with open(os.path.join(out, slug + '.txt'), 'w') as f:
            f.write(s)
        count += 1
print(f'{count} pages written to {out}')
