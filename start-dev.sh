#!/bin/sh
cd "$(dirname "$0")"
exec node node_modules/vite/bin/vite.js --port 5180
