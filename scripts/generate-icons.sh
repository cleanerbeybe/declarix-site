#!/usr/bin/env bash
# Regenerates raster icons from public/favicon.svg (ImageMagick 6+).
# Run after any change to favicon.svg and commit the outputs in public/.
set -euo pipefail
cd "$(dirname "$0")/../public"
render() { convert -background none -density 1200 favicon.svg -resize "$1x$1" -depth 8 -strip "$2"; }
render 512 logo.png
render 180 apple-touch-icon.png
tmp=$(mktemp -d)
for size in 16 32 48; do render "$size" "$tmp/$size.png"; done
convert "$tmp/16.png" "$tmp/32.png" "$tmp/48.png" favicon.ico
rm -rf "$tmp"
identify logo.png apple-touch-icon.png favicon.ico
