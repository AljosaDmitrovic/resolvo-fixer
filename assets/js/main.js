/* Resolvo — interactions. No dependencies. */
(() => {
  const doc = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* Opened straight from disk (file://): folder links such as "en/" or "../"
     would show a directory listing, so point them at the index.html inside. */
  if (window.location.protocol === 'file:') {
    $$('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href.endsWith('/') && !/^[a-z][a-z0-9+.-]*:/i.test(href)) a.setAttribute('href', `${href}index.html`);
    });
  }

  /* Header state */
  const header = $('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const burger = $('[data-burger]');
  const menu = $('#menu');
  const behindMenu = [$('main'), $('footer'), $('[data-mbar]')].filter(Boolean);
  const setMenu = (open) => {
    if (!burger || !menu) return;
    doc.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? burger.dataset.closeLabel : burger.dataset.openLabel);
    menu.inert = !open;
    behindMenu.forEach((el) => (el.inert = open));
  };
  if (burger && menu) {
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && doc.classList.contains('menu-open')) {
        setMenu(false);
        burger.focus();
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setMenu(false));
  }

  /* Scroll reveal */
  const revealed = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    revealed.forEach((el) => io.observe(el));
  } else {
    revealed.forEach((el) => el.classList.add('is-in'));
  }

  /* Active section in the desktop nav */
  const navLinks = $$('.nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(navLinks.map((a) => [a.hash.slice(1), a]));
    const sectionIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.classList.toggle('is-active', a === byId.get(entry.target.id)));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    byId.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) sectionIO.observe(section);
    });
  }

  /* Hero stars: pointer + scroll parallax */
  const stars = $$('[data-depth]');
  if (stars.length && !reduceMotion.matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const render = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      const sy = Math.min(window.scrollY, window.innerHeight);
      stars.forEach((s) => {
        const d = Number(s.dataset.depth);
        s.style.transform = `translate3d(${(cx * d * -36).toFixed(2)}px, ${(cy * d * -36 - sy * d * 0.12).toFixed(2)}px, 0)`;
      });
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.0005 ? requestAnimationFrame(render) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(render); };
    if (finePointer.matches) {
      window.addEventListener('pointermove', (e) => {
        tx = e.clientX / window.innerWidth - 0.5;
        ty = e.clientY / window.innerHeight - 0.5;
        kick();
      }, { passive: true });
    }
    window.addEventListener('scroll', () => { if (window.scrollY < window.innerHeight * 1.2) kick(); }, { passive: true });
  }

  /* Quote: words light up as it scrolls toward the middle of the screen */
  const lit = $('[data-lit]');
  if (lit && !reduceMotion.matches) {
    let raf = 0, last = '';
    const update = () => {
      raf = 0;
      const r = lit.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.9 - (r.top + r.height / 2)) / (vh * 0.4);
      const value = Math.min(1, Math.max(0, p)).toFixed(3);
      if (value !== last) lit.style.setProperty('--lit', (last = value));
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick, { passive: true });
    update();
  }

  /* Freeze SVG (SMIL) animations for reduced motion */
  if (reduceMotion.matches) {
    $$('svg').forEach((svg) => svg.pauseAnimations && svg.pauseAnimations());
  }

  /* Card spotlight */
  if (finePointer.matches) {
    $$('.spot').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* FAQ: one open at a time, with height animation */
  const items = $$('.qa');
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const openItem = (d) => {
    const body = $('.qa__a', d);
    delete d.dataset.closing; // re-opened while closing: cancel the pending close
    d.open = true;
    if (reduceMotion.matches || !body.animate) return;
    body.animate([{ height: '0px', opacity: 0 }, { height: `${body.scrollHeight}px`, opacity: 1 }], { duration: 480, easing: ease });
  };
  const closeItem = (d) => {
    const body = $('.qa__a', d);
    if (reduceMotion.matches || !body.animate) { d.open = false; return; }
    if (d.dataset.closing) return;
    d.dataset.closing = '1';
    const anim = body.animate([{ height: `${body.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 360, easing: ease });
    const done = () => {
      if (!d.dataset.closing) return;
      delete d.dataset.closing;
      d.open = false;
      anim.cancel();
    };
    anim.onfinish = done;
    setTimeout(done, 420); // in case animation frames are throttled (background tab)
  };
  items.forEach((d) => {
    $('summary', d).addEventListener('click', (e) => {
      e.preventDefault();
      if (d.open && !d.dataset.closing) {
        closeItem(d);
      } else {
        items.forEach((other) => other !== d && other.open && closeItem(other));
        openItem(d);
      }
    });
  });

  /* Plan buttons preselect the plan in the contact form */
  const planSelect = $('#f-plan');
  $$('[data-plan]').forEach((a) => {
    a.addEventListener('click', () => { if (planSelect) planSelect.value = a.dataset.plan; });
  });

  /* Contact: current time in Novi Sad, with a greeting to match */
  const live = $('[data-live]');
  if (live) {
    const clock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Belgrade', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const hello = $('[data-live-hello]', live);
    const time = $('[data-live-time]', live);
    let timer = 0;
    const tick = () => {
      clearTimeout(timer);
      const now = clock.format(new Date());
      const h = Number(now.slice(0, 2));
      time.textContent = now;
      hello.textContent = live.dataset[h >= 5 && h < 12 ? 'morning' : h >= 12 && h < 18 ? 'day' : 'evening'];
      live.hidden = false;
      timer = setTimeout(tick, 60000 - (Date.now() % 60000) + 50); // next minute
    };
    tick();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  }

  /* Contact form: compose a message and hand it to WhatsApp or the mail app */
  const form = $('#brief');
  const i18nEl = $('#form-i18n');
  if (form && i18nEl) {
    const i18n = JSON.parse(i18nEl.textContent);
    const error = $('.form__error', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const via = (e.submitter && e.submitter.value) || 'whatsapp';
      const name = form.elements.name.value.trim();
      const contact = form.elements.contact.value.trim();
      const message = form.elements.message.value.trim();
      const plan = form.elements.plan;
      const planName = plan.value ? plan.options[plan.selectedIndex].text : '';

      form.elements.name.setAttribute('aria-invalid', String(!name));
      form.elements.message.setAttribute('aria-invalid', String(!message));
      if (!name || !message) {
        error.hidden = false;
        (name ? form.elements.message : form.elements.name).focus();
        return;
      }
      error.hidden = true;

      const lines = [`${i18n.greeting} ${name}.`];
      if (planName) lines.push(`${i18n.interest}: ${planName}`);
      lines.push('', message);
      if (contact) lines.push('', `${i18n.contact}: ${contact}`);
      const text = lines.join('\n');

      if (via === 'email') {
        window.location.href = `mailto:${i18n.email}?subject=${encodeURIComponent(i18n.subject)}&body=${encodeURIComponent(text)}`;
      } else {
        window.open(`https://wa.me/${i18n.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      }
    });
    ['name', 'message'].forEach((n) => {
      form.elements[n].addEventListener('input', () => form.elements[n].removeAttribute('aria-invalid'));
    });
  }

  /* Mobile call/WhatsApp bar: visible after the hero, hidden over contact + footer */
  const mbar = $('[data-mbar]');
  const hero = $('.hero');
  if (mbar && hero && 'IntersectionObserver' in window) {
    const hiders = new Set();
    let pastHero = false;
    const update = () => mbar.classList.toggle('is-visible', pastHero && hiders.size === 0);
    new IntersectionObserver(([entry]) => { pastHero = !entry.isIntersecting; update(); }).observe(hero);
    const hideIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? hiders.add(entry.target) : hiders.delete(entry.target)));
      update();
    });
    [$('#contact'), $('footer')].filter(Boolean).forEach((el) => hideIO.observe(el));
  }
})();
