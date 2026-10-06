#!/usr/bin/env bash
# Deploy ./dist to Simply.com over SSH (rsync). Expects env: SIMPLY_HOST SIMPLY_USER SIMPLY_REMOTE_PATH
# SIMPLY_PORT (default 22), SSH_KEY_FILE, KNOWN_HOSTS_FILE, DRY_RUN=true|false.
#
# Safety model: NO `rsync --delete`. Files on the server that this repo never uploaded are never touched.
# Obsolete files are removed only if they were listed in the previous deploy's manifest
# (.deploy-manifest on the server) and are absent from the new one.
set -euo pipefail
set +x

: "${SIMPLY_HOST:?}" "${SIMPLY_USER:?}" "${SIMPLY_REMOTE_PATH:?}" "${SSH_KEY_FILE:?}" "${KNOWN_HOSTS_FILE:?}"
PORT="${SIMPLY_PORT:-22}"
DRY_RUN="${DRY_RUN:-false}"
REMOTE="${SIMPLY_REMOTE_PATH%/}"

# Guard against a mis-set path: must be relative-to-home or absolute, contain public_html, no traversal.
case "$REMOTE" in
  ""|"/"|"."|*".."*) echo "ERROR: refusing unsafe SIMPLY_REMOTE_PATH" >&2; exit 1 ;;
  *public_html*) ;;
  *) echo "ERROR: SIMPLY_REMOTE_PATH must contain 'public_html'" >&2; exit 1 ;;
esac
[ -f dist/index.html ] && [ -f dist.manifest ] || { echo "ERROR: run scripts/build-dist.sh first" >&2; exit 1; }

SSH_OPTS=(-i "$SSH_KEY_FILE" -p "$PORT" -o BatchMode=yes -o IdentitiesOnly=yes
          -o StrictHostKeyChecking=yes -o UserKnownHostsFile="$KNOWN_HOSTS_FILE")
SSH=(ssh "${SSH_OPTS[@]}" "$SIMPLY_USER@$SIMPLY_HOST")
q() { printf '%q' "$1"; }

echo "== Preflight: connection, remote path, rsync"
"${SSH[@]}" "test -d $(q "$REMOTE") && test -w $(q "$REMOTE") && command -v rsync >/dev/null" \
  || { echo "ERROR: remote path missing/not writable, or rsync unavailable on server" >&2; exit 1; }

# Previous manifest (absent on first deploy => nothing is ever deleted).
OLD=$(mktemp)
"${SSH[@]}" "cat $(q "$REMOTE/.deploy-manifest") 2>/dev/null" > "$OLD" || true

RSYNC_FLAGS=(-rltz --checksum --itemize-changes --exclude='.deploy-manifest')
[ "$DRY_RUN" = "true" ] && RSYNC_FLAGS+=(--dry-run)

echo "== Upload changed files (dry_run=$DRY_RUN)"
rsync "${RSYNC_FLAGS[@]}" -e "ssh ${SSH_OPTS[*]}" dist/ "$SIMPLY_USER@$SIMPLY_HOST:$REMOTE/"

echo "== Obsolete files (previously deployed by this repo, no longer present)"
OBSOLETE=$(mktemp)
LC_ALL=C comm -23 <(LC_ALL=C sort "$OLD") dist.manifest > "$OBSOLETE"
# Never act on suspicious manifest entries.
if grep -qE '^/|(^|/)\.\.(/|$)|^$' "$OBSOLETE"; then
  echo "ERROR: unsafe path in remote manifest; aborting deletions" >&2; exit 1
fi
cat "$OBSOLETE"
if [ "$DRY_RUN" != "true" ]; then
  if [ -s "$OBSOLETE" ]; then
    tr '\n' '\0' < "$OBSOLETE" | "${SSH[@]}" "cd $(q "$REMOTE") && xargs -0 rm -f --"
  fi
  rsync -t -e "ssh ${SSH_OPTS[*]}" dist.manifest "$SIMPLY_USER@$SIMPLY_HOST:$REMOTE/.deploy-manifest"
fi
rm -f "$OLD" "$OBSOLETE"
echo "== Done"
