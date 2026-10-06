---
name: sprite-codegen-crlf
description: Drawing 32x32 sprites by script and patching sjovt.js on a CRLF working tree
metadata:
  type: feedback
---

Generate 32x32 sprites with a small node script (shapes + auto bevel light top-left/dark bottom-right + auto 4-neighbour K outline) instead of typing grids; then patch `shared/sjovt.js` with a node script.

**Why:** hand-typed grids drift off 32 chars; procedural shapes first-pass looked consistent with the existing family. The working tree files are CRLF (index is LF), so regex edits fail silently unless you normalise `\r\n` first and restore it after. Heredocs mangle backslash regexes: write the patch script with the Write tool.

**How to apply:** sprite tasks; also `sed -i` on game html keeps CRLF safely for single-line swaps. odd `data-scale` rounds up for 32px grids (3 renders as 4), so chips at scale 3 double in size.
