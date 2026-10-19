// Renders the favicon, app icons and one social preview image per language.
//   node src/graphics/render-images.mjs
// Needs Google Chrome (headless) and macOS `sips` for cropping/resizing.

import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const root = fileURLToPath(new URL('../../', import.meta.url));
const img = (name) => join(root, 'assets/img', name);

const site = JSON.parse(await readFile(join(root, 'src/site.json'), 'utf8'));
const langs = await Promise.all(
  site.languages.map(async (l) => JSON.parse(await readFile(join(root, `src/content/${l}.json`), 'utf8')))
);

const STAR = 'M100 6C103 72 128 97 194 100 128 103 103 128 100 194 97 128 72 103 6 100 72 97 97 72 100 6Z';
const DEFS = `<defs>
  <path id="star-path" d="${STAR}"/>
  <linearGradient id="g-chrome" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".2" stop-color="#6f6f77"/><stop offset=".42" stop-color="#fff"/><stop offset=".58" stop-color="#26262b"/><stop offset=".8" stop-color="#d4d4da"/><stop offset="1" stop-color="#4d4d54"/></linearGradient>
  <radialGradient id="g-core" cx=".4" cy=".36" r=".72"><stop offset="0" stop-color="#2a2a2f"/><stop offset=".6" stop-color="#0d0d0f"/><stop offset="1" stop-color="#030303"/></radialGradient>
  <linearGradient id="g-silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#cfcfd5"/><stop offset="1" stop-color="#8a8a92"/></linearGradient>
  <filter id="f-bevel" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b"/>
    <feSpecularLighting in="b" surfaceScale="5" specularConstant="1.15" specularExponent="22" lighting-color="#fff" result="s"><feDistantLight azimuth="225" elevation="40"/></feSpecularLighting>
    <feComposite in="s" in2="SourceAlpha" operator="in" result="si"/>
    <feComposite in="SourceGraphic" in2="si" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
  </filter>
</defs>`;
const chromeStar = (cls, stroke) =>
  `<svg class="${cls}" viewBox="0 0 200 200"><use href="#star-path" fill="url(#g-core)"/><g filter="url(#f-bevel)"><use href="#star-path" fill="none" stroke="url(#g-chrome)" stroke-width="${stroke}" stroke-linejoin="round"/></g></svg>`;

await writeFile(
  img('favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".55" stop-color="#d2d2d8"/>
      <stop offset="1" stop-color="#8a8a92"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0a0a0b"/>
  <path fill="url(#g)" d="M32 8C33 26 38 31 56 32 38 33 33 38 32 56 31 38 26 33 8 32 26 31 31 26 32 8Z"/>
</svg>
`
);

const page = (w, h, body, css = '', script = '') => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Serif+Display:ital,wght@1,400&display=block">
<style>*{margin:0;box-sizing:border-box}html{padding:1px 0 0 1px;background:#050505}body{position:relative;width:${w}px;height:${h}px;overflow:hidden;background:#050505}${css}</style>
</head><body><svg width="0" height="0" style="position:absolute">${DEFS}</svg>${body}${script}</body></html>`;

const icon = page(
  512,
  512,
  chromeStar('star', 12),
  `body{display:grid;place-items:center;background:radial-gradient(70% 70% at 40% 30%,#1c1c1f,#0a0a0b 70%)}
  .star{width:74%;height:74%;overflow:visible;filter:drop-shadow(0 16px 30px rgba(0,0,0,.8))}`
);

// Headline from the language's descriptor, last word in the italic serif:
// "Business & / Personal Fixer." — "Poslovna i / lična podrška." — "Деловая и / личная поддержка."
const headline = (tagline) => {
  const words = tagline.split(' ');
  const last = words.pop();
  return `${words.slice(0, 2).join(' ')}<br>${words.slice(2).join(' ')} <em>${last}.</em>`;
};

const og = (t) =>
  page(
    1200,
    630,
    `<div class="grid"></div><div class="glow"></div>
  <div class="copy">
    <div class="logo"><svg viewBox="0 0 200 200"><use href="#star-path" fill="url(#g-silver)"/></svg>Resolvo</div>
    <h1>${headline(t.brandTagline)}</h1>
    <p>${t.hero.area}</p>
  </div>
  <div class="stars"><div class="ring"></div>${chromeStar('s1', 6)}${chromeStar('s2', 8)}${chromeStar('s3', 11)}</div>`,
    `body{font-family:Inter,sans-serif;color:#f5f5f6;-webkit-font-smoothing:antialiased}
  .grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.06) 1px,transparent 1px);background-size:63px 63px;-webkit-mask-image:radial-gradient(ellipse 70% 80% at 72% 40%,#000 15%,transparent 75%)}
  .glow{position:absolute;inset:0;background:radial-gradient(40% 55% at 74% 40%,rgba(255,255,255,.11),transparent 70%)}
  .copy{position:absolute;left:80px;top:50%;transform:translateY(-50%)}
  .logo{display:flex;align-items:center;gap:12px;font-size:26px;font-weight:600;letter-spacing:-.04em}
  .logo svg{width:28px;height:28px}
  h1{display:inline-block;margin-top:56px;font-size:104px;font-weight:500;line-height:.95;letter-spacing:-.05em;white-space:nowrap;background:linear-gradient(100deg,#fff 0%,#fff 40%,#8d8d96 100%);-webkit-background-clip:text;color:transparent;padding:0 .06em 8px 0}
  h1 em{font-family:"Noto Serif Display",serif;font-style:italic;font-weight:400;font-size:1.02em;letter-spacing:-.03em}
  p{margin-top:28px;color:#a1a1aa;font-size:24px;letter-spacing:-.01em}
  .stars{position:absolute;right:40px;top:50%;width:470px;height:470px;transform:translateY(-50%)}
  .stars svg{position:absolute;overflow:visible;filter:drop-shadow(0 20px 40px rgba(0,0,0,.8))}
  .s1{width:62%;height:62%;left:30%;top:24%;transform:rotate(4deg)}
  .s2{width:34%;height:34%;left:4%;top:6%;transform:rotate(-6deg)}
  .s3{width:16%;height:16%;left:84%;top:78%}
  .ring{position:absolute;inset:-4%;border:1px solid rgba(255,255,255,.08);border-radius:50%}`,
    // Longer headlines (Russian) shrink until they clear the stars.
    `<script>document.fonts.ready.then(function(){var h=document.querySelector('h1'),f=104;while(h.offsetWidth>660&&f>56){f-=2;h.style.fontSize=f+'px'}})</script>`
  );

// Headless Chrome's viewport is shorter than its window, so shoot a larger
// window and crop w×h. The page is offset by 1px because sips treats a
// crop offset of 0,0 as "centered".
const tmp = await mkdtemp(join(tmpdir(), 'resolvo-img-'));
const shoot = async (name, html, w, h, out) => {
  const file = join(tmp, `${name}.html`);
  await writeFile(file, html);
  execFileSync(CHROME, [
    '--headless=new',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${w + 1},${h + 200}`,
    '--virtual-time-budget=6000',
    `--screenshot=${out}`,
    `file://${file}`,
  ], { stdio: 'ignore' });
  execFileSync('sips', ['--cropOffset', '1', '1', '-c', String(h), String(w), out, '--out', out], { stdio: 'ignore' });
  console.log('  wrote', out.replace(root, ''));
};

try {
  await shoot('icon', icon, 512, 512, img('icon-512.png'));
  execFileSync('sips', ['-z', '180', '180', img('icon-512.png'), '--out', img('apple-touch-icon.png')], { stdio: 'ignore' });
  execFileSync('sips', ['-z', '32', '32', img('icon-512.png'), '--out', img('favicon-32.png')], { stdio: 'ignore' });
  console.log('  wrote assets/img/apple-touch-icon.png, assets/img/favicon-32.png');
  for (const t of langs) await shoot(`og-${t.lang}`, og(t), 1200, 630, img(`og-${t.lang}.png`));
} finally {
  await rm(tmp, { recursive: true, force: true });
}
