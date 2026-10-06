// Renders shared/icons/og-card.html to shared/icons/og-image.png at 1200x630 (headless Chrome).
// Usage (from the repo root, after `cd tests && npm install` once): node shared/icons/build-og.mjs
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launch, sleep } from '../../tests/lib/harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const b = await launch();
const p = await b.newPage();
await p.setViewport({ width: 1200, height: 630 });
await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
await p.goto(pathToFileURL(path.join(HERE, 'og-card.html')).href, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
await sleep(2500); // let the Sjovt preloader curtain finish
await p.evaluate(() => document.querySelectorAll('.sd-pre').forEach(n => n.remove()));
await p.screenshot({ path: path.join(HERE, 'og-image.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
await b.close();
console.log('og-image.png written');
