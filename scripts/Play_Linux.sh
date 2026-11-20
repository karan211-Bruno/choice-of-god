#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "Launching Choice of God..."
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$DIR/index.html"
else
  echo "Open $DIR/index.html in your web browser."
fi
