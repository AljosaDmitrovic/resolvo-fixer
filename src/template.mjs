// Page template. Content strings come from src/content/*.json and are trusted
// HTML (they may contain <em> for the serif accent), so they are not escaped.
// Values placed inside attributes go through attr().

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const strip = (s) => String(s).replace(/<[^>]+>/g, '');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const pad = (n) => String(n).padStart(2, '0');

/* ---------- Icons (24px, stroke) ---------- */

const icon = (paths, cls = 'i') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;

const I = {
  arrow: icon('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  arrowUp: icon('<path d="M7 17 17 7M8 7h9v9"/>'),
  check: icon('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  phone: icon('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
  whatsapp: icon('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5"/>'),
  viber: icon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>'),
  mail: icon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  pin: icon('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  briefcase: icon('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>'),
  truck: icon('<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/>'),
  calendar: icon('<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 3v3M16 3v3M3 10h18"/>'),
  search: icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  layers: icon('<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>'),
  user: icon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  building: icon('<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>'),
  clock: icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  zap: icon('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
  lock: icon('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
};

const serviceIcons = [I.briefcase, I.truck, I.calendar, I.search, I.layers];
const statIcons = [I.user, I.clock, I.zap, I.lock];

/* ---------- Star ---------- */

// Shared SVG defs: the four-point star path, chrome gradients and a bevel filter.
const sprite = `<svg class="sprite" width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    <path id="star-path" d="M100 6C103 72 128 97 194 100 128 103 103 128 100 194 97 128 72 103 6 100 72 97 97 72 100 6Z"/>
    <linearGradient id="g-chrome" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".2" stop-color="#6f6f77"/>
      <stop offset=".42" stop-color="#ffffff"/>
      <stop offset=".58" stop-color="#26262b"/>
      <stop offset=".8" stop-color="#d4d4da"/>
      <stop offset="1" stop-color="#4d4d54"/>
    </linearGradient>
    <radialGradient id="g-core" cx=".4" cy=".36" r=".72">
      <stop offset="0" stop-color="#2a2a2f"/>
      <stop offset=".6" stop-color="#0d0d0f"/>
      <stop offset="1" stop-color="#030303"/>
    </radialGradient>
    <linearGradient id="g-silver" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".5" stop-color="#cfcfd5"/>
      <stop offset="1" stop-color="#8a8a92"/>
    </linearGradient>
    <filter id="f-bevel" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b"/>
      <feSpecularLighting in="b" surfaceScale="5" specularConstant="1.15" specularExponent="22" lighting-color="#fff" result="s">
        <feDistantLight azimuth="225" elevation="40"/>
      </feSpecularLighting>
      <feComposite in="s" in2="SourceAlpha" operator="in" result="si"/>
      <feComposite in="SourceGraphic" in2="si" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
    </filter>
  </defs>
</svg>`;

const chromeStar = (stroke = 7) =>
  `<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><use href="#star-path" fill="url(#g-core)"/><g filter="url(#f-bevel)"><use href="#star-path" fill="none" stroke="url(#g-chrome)" stroke-width="${stroke}" stroke-linejoin="round"/></g></svg>`;

const solidStar = (cls = '') =>
  `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><use href="#star-path" fill="currentColor"/></svg>`;

const logoMark = `<svg class="logo__mark" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><use href="#star-path" fill="url(#g-silver)"/></svg>`;

/* ---------- Pieces ---------- */

const eyebrow = (text) => `<p class="eyebrow"><span class="eyebrow__icon">${solidStar()}</span>${text}</p>`;

// Each word in its own span (tags kept) so the quote can light up word by word as it scrolls in.
const quoteText = (html) => {
  let n = 0;
  const words = html
    .split(/(<[^>]+>)/)
    .map((part) => (part.startsWith('<') ? part : part.replace(/\S+/g, (w) => `<span class="w" style="--i:${n++}">${w}</span>`)))
    .join('');
  return `<p class="quote__text text-grad" data-lit style="--n:${n}">${words}</p>`;
};

const sectionHead = ({ eyebrow: e, title, lead }, cls = '') => `
      <header class="section__head ${cls}" data-reveal>
        ${eyebrow(e)}
        <h2 class="h2 text-grad">${title}</h2>
        ${lead ? `<p class="section__lead">${lead}</p>` : ''}
      </header>`;

const langSwitch = (t, langs, base, cls = '') => `
      <nav class="lang ${cls}" aria-label="${attr(t.ui.language)}">
        ${langs
          .map((l) => {
            const href = base + l.path || './';
            const current = l.lang === t.lang ? ' aria-current="page"' : '';
            return `<a href="${href}" hreflang="${l.htmlLang}" lang="${l.htmlLang}" title="${attr(t.languageNames[l.lang])}"${current}>${l.label}</a>`;
          })
          .join('')}
      </nav>`;

const navItems = (t) =>
  ['services', 'approach', 'process', 'plans', 'faq', 'contact'].map((id) => ({ id, label: t.nav[id] }));

/* ---------- Service visuals ---------- */

const serviceVisual = (i, ui) => {
  switch (i) {
    case 0:
      return `
          <div class="vis vis--stack">
            <div class="chip chip--a"><span class="chip__check">${I.check}</span><span>${ui[0]}</span><span class="chip__meta">${ui[1]}</span></div>
            <div class="chip chip--b"><span class="chip__check">${I.check}</span><span>${ui[2]}</span></div>
            <div class="chip chip--c chip--muted"><span class="chip__dot"></span><span>${ui[3]}</span></div>
          </div>`;
    case 1:
      return `
          <div class="vis vis--route">
            <svg class="route" viewBox="0 0 300 120" aria-hidden="true" focusable="false">
              <path class="route__base" d="M24 92C96 92 104 28 168 28S252 40 276 28"/>
              <path class="route__dash" d="M24 92C96 92 104 28 168 28S252 40 276 28"/>
              <circle class="route__end" cx="24" cy="92" r="6"/>
              <circle class="route__end" cx="276" cy="28" r="6"/>
              <circle class="route__dot" r="5"><animateMotion dur="4.5s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .25 1" path="M24 92C96 92 104 28 168 28S252 40 276 28"/></circle>
            </svg>
            <span class="route__label route__label--a">${ui[0]}</span>
            <span class="route__label route__label--b">${ui[1]}</span>
            <div class="chip chip--status"><span class="pulse"></span><span>${ui[2]}</span><span class="chip__meta">${ui[3]}</span></div>
          </div>`;
    case 2:
      return `
          <div class="vis vis--ticket">
            <div class="ticket">
              <div class="ticket__row"><span class="ticket__label">${ui[0]}</span><span class="ticket__time">${ui[1]}</span></div>
              <div class="ticket__rule"></div>
              <div class="ticket__status"><span class="chip__check">${I.check}</span>${ui[2]}</div>
            </div>
            <div class="chip chip--small chip--muted">${I.calendar}<span>${ui[3]}</span></div>
          </div>`;
    case 3:
      return `
          <div class="vis vis--search">
            <div class="search">${I.search}<span class="search__text">${ui[0]}</span><span class="caret"></span><span class="search__count">${ui[1]}</span></div>
            <div class="results">
              <div class="result"><span class="result__bar" style="--w:58%"></span><span class="result__stars">★★★★<i>★</i></span></div>
              <div class="result result--best"><span class="result__bar" style="--w:86%"></span><span class="result__tag">${I.check}${ui[2]}</span></div>
              <div class="result"><span class="result__bar" style="--w:42%"></span><span class="result__stars">★★★<i>★★</i></span></div>
            </div>
          </div>`;
    case 4:
      return `
          <div class="vis vis--project">
            <div class="project">
              <div class="project__head"><span>${ui[0]}</span><span class="project__pct">72%</span></div>
              <div class="progress"><span></span></div>
              <ul class="project__list">
                <li class="is-done"><span class="chip__check">${I.check}</span>${ui[1]}</li>
                <li class="is-done"><span class="chip__check">${I.check}</span>${ui[2]}</li>
                <li><span class="project__ring"></span>${ui[3]}</li>
              </ul>
            </div>
          </div>`;
    default:
      return '';
  }
};

/* ---------- Structured data ---------- */

const structuredData = (t, site, pageUrl) => {
  const offers = t.plans.items.map((p) => {
    const price = site.prices[p.id];
    const offer = { '@type': 'Offer', name: p.name, description: strip(p.desc) };
    if (price) {
      offer.priceSpecification = { '@type': 'UnitPriceSpecification', price, priceCurrency: 'EUR', unitText: 'MONTH' };
    }
    return offer;
  });
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${site.url}#business`,
      name: site.brand,
      legalName: site.legalName,
      description: t.meta.description,
      url: pageUrl,
      image: `${site.url}assets/img/og-${t.lang}.png`,
      logo: `${site.url}assets/img/icon-512.png`,
      telephone: site.phone,
      email: site.email,
      taxID: site.pib,
      founder: { '@type': 'Person', name: t.about.name },
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.street,
        addressLocality: site.city,
        postalCode: site.postalCode,
        addressCountry: site.country,
      },
      areaServed: [
        { '@type': 'City', name: t.areas[0] },
        { '@type': 'AdministrativeArea', name: t.areas[1] },
        { '@type': 'City', name: t.areas[2] },
      ],
      knowsLanguage: ['sr', 'en', 'ru'],
      paymentAccepted: t.paymentAccepted,
      priceRange: '€€€',
      makesOffer: offers,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: t.htmlLang,
      mainEntity: t.faq.items.map((f) => ({
        '@type': 'Question',
        name: strip(f.q),
        acceptedAnswer: { '@type': 'Answer', text: strip(f.a) },
      })),
    },
  ];
};

/* ---------- Page ---------- */

export function render({ t, site, langs, v, year }) {
  const base = t.path ? '../' : '';
  const pageUrl = site.url + t.path;
  const tel = `tel:${site.phone}`;
  const wa = `https://wa.me/${site.whatsapp}`;
  const viber = `viber://chat?number=%2B${site.whatsapp}`;
  const mail = `mailto:${site.email}`;
  const nav = navItems(t);

  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${t.meta.title}</title>
  <meta name="description" content="${attr(t.meta.description)}">
  <link rel="canonical" href="${pageUrl}">
${langs.map((l) => `  <link rel="alternate" hreflang="${l.lang}" href="${site.url + l.path}">`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${site.url}">
  <meta name="theme-color" content="#050505">
  <meta name="color-scheme" content="dark">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Resolvo">
  <meta property="og:title" content="${attr(t.meta.title)}">
  <meta property="og:description" content="${attr(t.meta.description)}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${site.url}assets/img/og-${t.lang}.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="${t.ogLocale}">
${langs.filter((l) => l.lang !== t.lang).map((l) => `  <meta property="og:locale:alternate" content="${l.ogLocale}">`).join('\n')}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${base}assets/img/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="${base}assets/img/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="${base}assets/img/apple-touch-icon.png">
  <link rel="manifest" href="${base}site.webmanifest">
  <link rel="preload" href="${base}assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${base}assets/fonts/noto-serif-display-italic-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${base}assets/css/style.css?v=${v.css}">
  <script>document.documentElement.classList.add('js')</script>
  <script src="${base}assets/js/main.js?v=${v.js}" defer></script>
  <script type="application/ld+json">${json(structuredData(t, site, pageUrl))}</script>
</head>
<body>
  <a class="skip" href="#main">${t.ui.skip}</a>
  ${sprite}

  <header class="header" data-header>
    <div class="container header__inner">
      <a class="logo" href="./" aria-label="${attr(t.ui.home)}">${logoMark}<span>Resolvo</span></a>
      <nav class="nav" aria-label="${attr(t.ui.navPrimary)}">
        ${nav.map((n) => `<a href="#${n.id}">${n.label}</a>`).join('\n        ')}
      </nav>
      <div class="header__actions">
        ${langSwitch(t, langs, base, 'lang--header')}
        <a class="btn btn--light btn--sm header__cta" href="#contact">${t.nav.cta}</a>
        <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="${attr(t.ui.menu)}" data-open-label="${attr(t.ui.menu)}" data-close-label="${attr(t.ui.close)}" data-burger>
          <span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="menu" id="menu" inert>
    <nav class="menu__nav" aria-label="${attr(t.ui.navMobile)}">
      ${nav.map((n, i) => `<a href="#${n.id}" style="--i:${i}"><span>${pad(i + 1)}</span>${n.label}</a>`).join('\n      ')}
    </nav>
    <div class="menu__foot">
      ${langSwitch(t, langs, base)}
      <a class="menu__phone" href="${tel}">${site.phoneDisplay}</a>
    </div>
  </div>

  <main id="main">

    <!-- Hero -->
    <section class="hero" id="top">
      <div class="hero__bg" aria-hidden="true">
        <div class="hero__grid"></div>
        <div class="hero__glow"></div>
      </div>
      <div class="container hero__inner">
        <div class="hero__copy">
          <p class="badge"><span class="badge__dot"></span>${t.hero.badge}</p>
          <h1 class="display text-grad text-grad--hero">${t.hero.title}</h1>
          <p class="hero__lead">${t.hero.lead}</p>
          <div class="hero__ctas">
            <a class="btn btn--light" href="#contact">${t.hero.cta1}<span class="btn__icon">${I.arrow}</span></a>
            <a class="btn btn--dark" href="#plans">${t.hero.cta2}</a>
          </div>
          <p class="hero__area">${I.pin}${t.hero.area}</p>
        </div>
        <div class="hero__stars" aria-hidden="true">
          <svg class="orbit" viewBox="0 0 400 400"><circle cx="200" cy="200" r="198"/><circle class="orbit__dash" cx="200" cy="200" r="150"/></svg>
          <div class="star star--lg" data-depth="0.6"><div class="star__float">${chromeStar(6)}</div></div>
          <div class="star star--md" data-depth="1.1"><div class="star__float">${chromeStar(8)}</div></div>
          <div class="star star--sm" data-depth="1.6"><div class="star__float">${chromeStar(11)}</div></div>
        </div>
      </div>
    </section>


    <!-- Services -->
    <section class="section" id="services">
      <div class="container">
        ${sectionHead(t.services)}
        <div class="bento">
          ${t.services.items
            .map(
              (s, i) => `
          <article class="card card--svc spot" data-reveal style="--d:${(i % 2) * 120}">
            <div class="card__visual">${serviceVisual(i, s.ui)}
            </div>
            <div class="card__body">
              <h3 class="card__title"><span class="card__icon">${serviceIcons[i]}</span>${s.title}</h3>
              <p>${s.text}</p>
            </div>
          </article>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <!-- Approach -->
    <section class="section section--approach" id="approach">
      <div class="container split">
        <div class="split__copy" data-reveal>
          ${eyebrow(t.approach.eyebrow)}
          <h2 class="h2 text-grad">${t.approach.title}</h2>
          <p class="section__lead">${t.approach.text}</p>
          <ul class="values">
            ${t.approach.values.map((x) => `<li>${x}</li>`).join('')}
          </ul>
        </div>
        <div class="tilt" data-reveal style="--d:150">
          <ul class="tilt__plane">
            ${t.approach.stats
              .map(
                (s, i) => `<li class="stat stat--${i}">
              <span class="stat__icon">${statIcons[i]}</span>
              <strong class="stat__value">${s.value}</strong>
              <span class="stat__label">${s.label}</span>
            </li>`
              )
              .join('\n            ')}
          </ul>
        </div>
      </div>
    </section>

    <!-- Quote -->
    <section class="section quote">
      <div class="container">
        <figure class="quote__inner" data-reveal>
          <div class="quote__star" aria-hidden="true">${chromeStar(9)}</div>
          <blockquote>
            ${quoteText(t.quote.text)}
          </blockquote>
          <figcaption class="quote__sub">${t.quote.sub}</figcaption>
        </figure>
      </div>
    </section>

    <!-- Process -->
    <section class="section" id="process">
      <div class="container">
        ${sectionHead(t.process)}
        <ol class="steps">
          ${t.process.steps
            .map(
              (s, i) => `<li class="step" data-reveal style="--d:${i * 110}">
            <div class="step__top"><span class="step__num">${pad(i + 1)}</span><span class="step__line"></span></div>
            <h3>${s.title}</h3>
            <p>${s.text}</p>
          </li>`
            )
            .join('\n          ')}
        </ol>
      </div>
    </section>

    <!-- Clients -->
    <section class="section section--tight" id="clients">
      <div class="container">
        ${sectionHead(t.clients)}
        <div class="clients">
          ${t.clients.items
            .map(
              (c, i) => `<article class="card client spot" data-reveal style="--d:${i * 120}">
            <span class="client__icon">${i === 0 ? I.user : I.building}</span>
            <h3>${c.title}</h3>
            <p>${c.text}</p>
          </article>`
            )
            .join('\n          ')}
          <p class="area" data-reveal>${I.pin}<span>${t.clients.area}</span></p>
        </div>
      </div>
    </section>

    <!-- Plans -->
    <section class="section section--plans" id="plans">
      <div class="container">
        ${sectionHead(t.plans, 'section__head--center')}
        <div class="plans">
          ${t.plans.items
            .map((p, i) => {
              const numeric = Boolean(site.prices[p.id]);
              return `<article class="plan${p.featured ? ' plan--featured' : ''}" data-reveal style="--d:${i * 120}">
            <header class="plan__head">
              <span class="plan__mark">${solidStar()}</span>
              <h3 class="plan__name">${p.name}</h3>
              <span class="plan__tag">${p.tag}</span>
            </header>
            <p class="plan__price${numeric ? '' : ' plan__price--text'}">${numeric ? `<span class="plan__from">${t.plans.from}</span>` : ''}<strong>${p.price}</strong>${numeric ? `<span>${t.plans.perMonth}</span>` : ''}</p>
            <p class="plan__desc">${p.desc}</p>
            <ul class="plan__features">
              ${p.features.map((f) => `<li>${I.check}<span>${f}</span></li>`).join('\n              ')}
            </ul>
            <a class="btn ${p.featured ? 'btn--ink' : 'btn--light'} plan__cta" href="#contact" data-plan="${p.id}">${p.cta}<span class="btn__icon">${I.arrow}</span></a>
          </article>`;
            })
            .join('\n          ')}
        </div>
        <p class="plans__note" data-reveal>${t.plans.note}</p>
      </div>
    </section>

    <!-- About -->
    <section class="section" id="about">
      <div class="container about">
        <div class="about__head" data-reveal>
          ${eyebrow(t.about.eyebrow)}
          <h2 class="h2 text-grad">${t.about.title}</h2>
          <div class="signature">
            <div class="signature__star" aria-hidden="true">${chromeStar(10)}</div>
            <div>
              <p class="signature__name">${t.about.name}</p>
              <p class="signature__role">${t.about.role}</p>
            </div>
          </div>
        </div>
        <div class="about__body" data-reveal style="--d:120">
          ${t.about.paragraphs.map((p, i) => `<p${i === 0 ? ' class="about__lead"' : ''}>${p}</p>`).join('\n          ')}
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section" id="faq">
      <div class="container faq">
        <div class="faq__intro" data-reveal>
          ${eyebrow(t.faq.eyebrow)}
          <h2 class="h2 text-grad">${t.faq.title}</h2>
          <p class="section__lead">${t.faq.lead}</p>
          <a class="btn btn--dark" href="#contact">${t.faq.cta}<span class="btn__icon">${I.arrow}</span></a>
        </div>
        <div class="faq__list" data-reveal style="--d:120">
          ${t.faq.items
            .map(
              (f, i) => `<details class="qa"${i === 0 ? ' open' : ''}>
            <summary>${f.q}<span class="qa__icon" aria-hidden="true"></span></summary>
            <div class="qa__a"><div class="qa__inner"><p>${f.a}</p></div></div>
          </details>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="section section--contact" id="contact">
      <div class="container contact">
        <div class="contact__intro" data-reveal>
          ${eyebrow(t.contact.eyebrow)}
          <h2 class="h2 text-grad">${t.contact.title}</h2>
          <p class="section__lead">${t.contact.lead}</p>
          <div class="live" data-live data-morning="${attr(t.contact.live.morning)}" data-day="${attr(t.contact.live.day)}" data-evening="${attr(t.contact.live.evening)}" hidden>
            <p class="live__hello" data-live-hello></p>
            <p class="live__now"><span class="badge__dot" aria-hidden="true"></span><span>${t.contact.live.city} · <time data-live-time></time> · ${t.contact.live.status}</span></p>
          </div>
          <ul class="channels">
            <li><a class="channel" href="${tel}"><span class="channel__icon">${I.phone}</span><span class="channel__text"><span class="channel__label">${t.contact.channels.phone}</span><span class="channel__value">${site.phoneDisplay}</span></span><span class="channel__arrow">${I.arrowUp}</span></a></li>
            <li><a class="channel" href="${wa}" target="_blank" rel="noopener"><span class="channel__icon">${I.whatsapp}</span><span class="channel__text"><span class="channel__label">${t.contact.channels.whatsapp}</span><span class="channel__value">${site.phoneDisplay}</span></span><span class="channel__arrow">${I.arrowUp}</span></a></li>
            <li><a class="channel" href="${viber}"><span class="channel__icon">${I.viber}</span><span class="channel__text"><span class="channel__label">${t.contact.channels.viber}</span><span class="channel__value">${site.phoneDisplay}</span></span><span class="channel__arrow">${I.arrowUp}</span></a></li>
            <li><a class="channel" href="${mail}"><span class="channel__icon">${I.mail}</span><span class="channel__text"><span class="channel__label">${t.contact.channels.email}</span><span class="channel__value">${site.email}</span></span><span class="channel__arrow">${I.arrowUp}</span></a></li>
          </ul>
        </div>

        <form class="card form" id="brief" action="${mail}" method="post" enctype="text/plain" novalidate data-reveal style="--d:120">
          <h3 class="form__title">${t.contact.form.title}</h3>
          <div class="form__grid">
            <div class="field">
              <label for="f-name">${t.contact.form.name}</label>
              <input id="f-name" name="name" type="text" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="f-contact">${t.contact.form.contact}</label>
              <input id="f-contact" name="contact" type="text" autocomplete="email">
            </div>
            <div class="field field--full">
              <label for="f-plan">${t.contact.form.plan}</label>
              <select id="f-plan" name="plan">
                <option value="">${t.contact.form.planUnsure}</option>
                ${t.plans.items.map((p) => `<option value="${p.id}">${p.name}</option>`).join('\n                ')}
              </select>
            </div>
            <div class="field field--full">
              <label for="f-message">${t.contact.form.message}</label>
              <textarea id="f-message" name="message" rows="4" placeholder="${attr(t.contact.form.messagePlaceholder)}" required></textarea>
            </div>
          </div>
          <p class="form__error" role="alert" hidden>${t.contact.form.required}</p>
          <div class="form__actions">
            <button class="btn btn--light" type="submit" name="via" value="whatsapp">${I.whatsapp}${t.contact.form.sendWhatsapp}</button>
            <button class="btn btn--dark" type="submit" name="via" value="email">${I.mail}${t.contact.form.sendEmail}</button>
          </div>
          <p class="form__note">${t.contact.form.note}</p>
        </form>
      </div>
      <script type="application/json" id="form-i18n">${json({ ...t.contact.msg, email: site.email, whatsapp: site.whatsapp })}</script>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <a class="logo" href="./" aria-label="${attr(t.ui.home)}">${logoMark}<span>Resolvo</span></a>
          <p>${t.footer.tagline}</p>
          <a class="btn btn--light btn--sm" href="#contact">${t.nav.cta}<span class="btn__icon">${I.arrow}</span></a>
        </div>
        <nav class="footer__col" aria-label="${attr(t.footer.navTitle)}">
          <h3>${t.footer.navTitle}</h3>
          <ul>
            ${nav.map((n) => `<li><a href="#${n.id}">${n.label}</a></li>`).join('\n            ')}
          </ul>
        </nav>
        <div class="footer__col">
          <h3>${t.footer.contactTitle}</h3>
          <ul>
            <li><a href="${tel}">${site.phoneDisplay}</a></li>
            <li><a href="${mail}">${site.email}</a></li>
            <li><a href="${wa}" target="_blank" rel="noopener">WhatsApp</a> · <a href="${viber}">Viber</a></li>
            <li><address>${t.footer.address.join('<br>')}</address></li>
          </ul>
        </div>
        <div class="footer__col footer__legal">
          <h3>${t.footer.companyTitle}</h3>
          <p>${site.legalName}</p>
          <p>${t.footer.pib}: ${site.pib}<br>${t.footer.mb}: ${site.mb}</p>
        </div>
      </div>
      <div class="footer__bottom">
        <p>© ${year} Resolvo. ${t.footer.rights}</p>
        ${langSwitch(t, langs, base)}
        <a class="footer__top-link" href="#top">${t.ui.backToTop} <span aria-hidden="true">↑</span></a>
      </div>
    </div>
    <div class="wordmark" aria-hidden="true">Resolvo</div>
  </footer>

  <div class="mbar" data-mbar>
    <a class="btn btn--dark" href="${tel}">${I.phone}${t.mobileBar.call}</a>
    <a class="btn btn--light" href="${wa}" target="_blank" rel="noopener">${I.whatsapp}${t.mobileBar.whatsapp}</a>
  </div>
</body>
</html>
`;
}

/* ---------- 404 ---------- */

// Self-contained (inline styles, root-absolute links) because GitHub Pages
// serves it from whatever URL was requested. Shows one language, picked from
// the requested path (/en/…, /ru/…, otherwise Serbian).
export function render404({ langs }) {
  const copy = Object.fromEntries(
    langs.map((l) => [
      l.lang,
      {
        lang: l.htmlLang,
        home: `/${l.path}`,
        ...{
          sr: { title: 'Stranica nije pronađena', text: 'Ova stranica ne postoji.', link: 'Na početnu' },
          en: { title: 'Page not found', text: 'This page doesn’t exist.', link: 'Back to home' },
          ru: { title: 'Страница не найдена', text: 'Такой страницы нет.', link: 'На главную' },
        }[l.lang],
      },
    ])
  );
  const sr = copy.sr;
  return `<!doctype html>
<html lang="${sr.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 — ${sr.title} · Resolvo</title>
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#050505">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; margin: 0; }
    body { min-height: 100svh; display: grid; place-items: center; padding: 32px 16px; background: #050505; color: #f5f5f6;
      font: 400 16px/1.6 "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; text-align: center;
      background-image: radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,.08), transparent 70%); }
    svg { width: 72px; height: 72px; margin: 0 auto 28px; display: block; }
    h1 { font-size: clamp(4rem, 18vw, 9rem); font-weight: 500; letter-spacing: -.06em; line-height: .9;
      background: linear-gradient(180deg, #fff, #6b6b73); -webkit-background-clip: text; background-clip: text; color: transparent; }
    p { margin-top: 28px; color: #a3a3ab; }
    a { display: inline-block; margin-top: 10px; color: #f5f5f6; text-underline-offset: 4px; }
  </style>
</head>
<body>
  <main>
    <svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#cfcfd5"/><stop offset="1" stop-color="#7d7d85"/></linearGradient></defs><path fill="url(#g)" d="M100 6C103 72 128 97 194 100 128 103 103 128 100 194 97 128 72 103 6 100 72 97 97 72 100 6Z"/></svg>
    <h1>404</h1>
    <p id="t">${sr.text}</p>
    <a id="a" href="${sr.home}">${sr.link} →</a>
  </main>
  <script>
    (function () {
      var copy = ${json(copy)};
      var first = location.pathname.split('/')[1];
      var c = copy[first === 'en' || first === 'ru' ? first : 'sr'];
      document.documentElement.lang = c.lang;
      document.title = '404 — ' + c.title + ' · Resolvo';
      document.getElementById('t').textContent = c.text;
      var a = document.getElementById('a');
      a.textContent = c.link + ' →';
      a.href = c.home;
    })();
  </script>
</body>
</html>
`;
}
