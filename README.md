# Resolvo — Business & Personal Fixer

Static website for [resolvosolutions.com](https://resolvosolutions.com), hosted on GitHub Pages.
Three languages: Serbian (`/`), English (`/en/`), Russian (`/ru/`). No framework, no dependencies.

## Structure

```
index.html, en/, ru/, 404.html, sitemap.xml   ← generated, do not edit by hand
assets/css/style.css                           ← all styles
assets/js/main.js                              ← interactions (menu, reveal, FAQ, contact form)
assets/img/                                    ← favicon, app icons, social preview image
src/content/sr.json, en.json, ru.json          ← all page text, one file per language
src/site.json                                  ← phone, email, address, legal data, prices
src/template.mjs                               ← page markup
src/build.mjs                                  ← generator
src/graphics/render-images.mjs                 ← generates favicon, app icons, social images
CNAME, .nojekyll, robots.txt, site.webmanifest
```

## Editing text

1. Change the text in `src/content/<lang>.json` (or contact details in `src/site.json`).
   `<em>…</em>` inside a heading renders that part in the italic serif.
2. Rebuild (Node 18+):

   ```sh
   node src/build.mjs
   ```

3. Commit the generated files together with the source change.

Rebuild after any change to CSS or JS as well: the build stamps their file hashes into the pages so returning visitors don't get a stale cached copy.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly from disk works too: on `file://` the script points the language and logo links at each folder's `index.html`.

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository (branch `main`).
2. **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. **Custom domain**: the `CNAME` file already contains `resolvosolutions.com`. At the domain registrar, set:

   | Type  | Host  | Value |
   |-------|-------|-------|
   | A     | @     | 185.199.108.153 |
   | A     | @     | 185.199.109.153 |
   | A     | @     | 185.199.110.153 |
   | A     | @     | 185.199.111.153 |
   | AAAA  | @     | 2606:50c0:8000::153 |
   | AAAA  | @     | 2606:50c0:8001::153 |
   | AAAA  | @     | 2606:50c0:8002::153 |
   | AAAA  | @     | 2606:50c0:8003::153 |
   | CNAME | www   | `<github-username>.github.io` |

4. Once DNS has propagated, tick **Enforce HTTPS** in the Pages settings.

Until the domain is connected, the site also works at `https://<user>.github.io/<repo>/`, because all page links are relative. The 404 page and the social preview image assume the final domain.

**Email:** GitHub Pages only hosts the website. `fixer@resolvosolutions.com` needs an email provider (Google Workspace, Zoho Mail, or forwarding through Cloudflare Email Routing / ImprovMX) configured through MX records at the registrar. MX records don't conflict with the records above.

## Contact form

There is no server, so the form doesn't submit anywhere. It composes the message and opens WhatsApp (`wa.me`) or the visitor's email app with the text filled in. No data is stored. To receive submissions directly instead, point the form at a service such as Formspree and adjust the submit handler in `assets/js/main.js`.

## Images

The favicon, app icons and the social preview images (`og-sr.png`, `og-en.png`, `og-ru.png`, 1200×630) are generated from the page content. The headline on each social image comes from `brandTagline` in that language's content file.

```sh
node src/graphics/render-images.mjs     # needs Google Chrome + macOS sips
```
