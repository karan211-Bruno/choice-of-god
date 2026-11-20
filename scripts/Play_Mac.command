#!/bin/bash
DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR" || exit 1
echo "Launching Choice of God (신의 선택)..."
open "$DIR/index.html"
