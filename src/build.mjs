// Builds the static site from src/ into the repository root (served by GitHub Pages).
//   node src/build.mjs
// No dependencies. Re-run after editing src/content/*.json, src/site.json,
// src/template.mjs, assets/css/style.css or assets/js/main.js.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { render, render404 } from './template.mjs';

const root = new URL('../', import.meta.url);
const src = new URL('./', import.meta.url);

// Keep " — " dashes from starting a new line: the space before them becomes a no-break space.
const tidy = (value) =>
  typeof value === 'string'
    ? value.replace(/ —/g, ' —')
    : Array.isArray(value)
      ? value.map(tidy)
      : value && typeof value === 'object'
        ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, tidy(v)]))
        : value;
const readJson = async (url) => tidy(JSON.parse(await readFile(url, 'utf8')));
const write = async (path, data) => {
  const url = new URL(path, root);
  await mkdir(new URL('./', url), { recursive: true });
  await writeFile(url, data);
  console.log('  wrote', path);
};
const hash = async (path) =>
  createHash('sha1').update(await readFile(new URL(path, root))).digest('hex').slice(0, 8);

const site = await readJson(new URL('site.json', src));
const langs = await Promise.all(site.languages.map((l) => readJson(new URL(`content/${l}.json`, src))));
const v = { css: await hash('assets/css/style.css'), js: await hash('assets/js/main.js') };
const today = new Date().toISOString().slice(0, 10);
const year = today.slice(0, 4);

console.log('Building Resolvo…');

for (const t of langs) {
  await write(`${t.path}index.html`, render({ t, site, langs, v, year }));
}

await write('404.html', render404({ langs }));

const alternates = langs
  .map((l) => `    <xhtml:link rel="alternate" hreflang="${l.lang}" href="${site.url + l.path}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${site.url}"/>`)
  .join('\n');

await write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${langs
  .map(
    (l) => `  <url>
    <loc>${site.url + l.path}</loc>
    <lastmod>${today}</lastmod>
${alternates}
  </url>`
  )
  .join('\n')}
</urlset>
`
);

console.log('Done.');
