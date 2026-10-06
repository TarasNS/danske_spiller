#!/usr/bin/env bash
# Stage the production site into ./dist. Allowlist only: anything not listed here is never deployed
# (no docs, tests, .claude, .github, tmp_* scratch files, csv/xlsx/md sources, node_modules).
# A new top-level game folder must be added to DIRS below to go live.
set -euo pipefail
cd "$(dirname "$0")/.."

DIRS=(
  "boejningsvaerkstedet" "danish_flashcards" "danske-phraser" "en-og-et" "forbindenor"
  "konjunktioner" "ordstilling-detektiv" "pronomenmysteriet" "saetningsmaskinen"
  "shared" "tidsmaskinen" "blog" "en"
)

rm -rf dist dist.manifest
mkdir dist

cp ./*.html robots.txt sitemap.xml llms.txt .htaccess dist/
for d in "${DIRS[@]}"; do
  [ -d "$d" ] || { echo "ERROR: expected directory '$d' is missing" >&2; exit 1; }
  mkdir -p "dist/$d"
  # tar keeps the tree and lets us exclude scratch files; spaces in names are fine.
  # Icon sources (shared/icons: grid spec, build scripts, card HTML) stay out; only the built images ship.
  tar -C "$d" --exclude='tmp_*' --exclude='*.md' --exclude='*.map' \
      --exclude='*.py' --exclude='build-*.mjs' --exclude='og-card.html' --exclude='favicon.txt' \
      -cf - . | tar -C "dist/$d" -xf -
done

[ -f dist/index.html ] || { echo "ERROR: dist/index.html missing" >&2; exit 1; }
# dist/.htaccess (server redirects) is the only dotfile allowed.
if find dist \( -name '.*' -o -name 'tmp_*' -o -name '*.md' -o -name node_modules \) ! -path dist/.htaccess | grep -q .; then
  echo "ERROR: dist contains files that must not be deployed:" >&2
  find dist \( -name '.*' -o -name 'tmp_*' -o -name '*.md' -o -name node_modules \) ! -path dist/.htaccess >&2
  exit 1
fi

# Manifest of every file we own on the server; deploy.sh uses it to delete ONLY our own obsolete files.
(cd dist && find . -type f | sed 's#^\./##' | LC_ALL=C sort) > dist.manifest
echo "dist ready: $(wc -l < dist.manifest) files"
