#!/usr/bin/env python3
import os
# patch getcwd before importing http.server so the default arg doesn't raise
_real_getcwd = os.getcwd
def _safe_getcwd():
    try:
        return _real_getcwd()
    except PermissionError:
        return '/tmp'
os.getcwd = _safe_getcwd

import http.server, socketserver, sys

DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'topfinish-build', 'dist')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5180

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=DIRECTORY, **kw)
    def log_message(self, fmt, *args):
        print(fmt % args, flush=True)

print(f'Serving {DIRECTORY} on port {PORT}', flush=True)
with socketserver.TCPServer(('', PORT), Handler) as httpd:
    httpd.serve_forever()
