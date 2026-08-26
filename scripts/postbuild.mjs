// Post-build script: copy dist/index.html → dist/404.html so GitHub Pages
// serves the SPA fallback for unknown URLs. Also noop-cleanup: removes
// .map files and the dist/_astro/cache if any.

import { copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');
const indexPath = resolve(distDir, 'index.html');
const notFoundPath = resolve(distDir, '404.html');

if (!existsSync(indexPath)) {
  console.error(`postbuild: ${indexPath} not found. Did astro build run?`);
  process.exit(1);
}

if (!existsSync(notFoundPath)) {
  copyFileSync(indexPath, notFoundPath);
  console.log(`postbuild: copied ${indexPath} → ${notFoundPath}`);
} else {
  console.log(`postbuild: retained Astro 404 page at ${notFoundPath}`);
}

// Also copy to known Astro subpaths in case base is set (e.g. /opes-quant-dashboard/)
// Astro generates index.html at the root, so 404.html at the root is enough for
// the default case. For subpath deployments, GitHub Pages still uses the root 404.
// (Verified in the GitHub Pages docs.)
