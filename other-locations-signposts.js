/* ===========================================================================
   akx other-locations-signposts.js — the "other locations" page, from one stub
   Akanishta Kadampa Buddhist Centre · v1.0 · 3 Sep 2026

   ONE STUB. Gen places the hero image and the page title/intro in Squarespace;
   everything below that comes from here:

     <div id="akx-branches"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/other-locations-signposts.js" defer></script>

   WHAT IT DOES (order set by Gen, 3 Sep)
     1  Signpost grid — nine photo cards, one per location   (here)
     2  Testimonial                                           testimony-quotes.js
     3  Stay in touch                                         social-cards.js
     4  Start from home                                       start-at-home.js
     5  Calendar                                              calendar.js
        (data-cal="branch" data-on="weekly" — branch classes, announcements
         AND the Cheltenham weekly classes on by default, as on quiet pages)

   THE CARDS (signed off 3 Sep, mock cards-v2.jpg)
     Order: branches with events first —
       Cheltenham · Cirencester · Tewkesbury
       Gloucester · Stroud · Evesham
       KMC Bristol · Oxford · Away days
     Photos live in the repo at images/cards/<key>.jpg (800×400).
     Type: the site standard sans (inherited), name weighted 600 — no serif here.
     External cards (Bristol, Oxford) open in a new tab and carry a ↗ arrow.

   SECOND LINES
     Fixed for Cheltenham ("Akanishta Centre"), Oxford, KMC Bristol, Away days.
     The towns read the Class details sheet: the line shows the day(s) of any
     series RUNNING today — or, if none has started, the next series to start.
     So Cirencester says "Wednesdays" now, and will say "Wednesdays & Thursdays"
     in November when both its series run. A town with no dated class rows
     shows no second line at all.

   CACHE: stubs carry no version query — a stub just pulls the widget. GitHub
   Pages caches for ~10 minutes, so after a commit give it that long (or
   hard-reload) before deciding a change didn't land.
   =========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* CONFIG                                                             */
  /* ------------------------------------------------------------------ */
  var SHEET = '1YArubV8QgCvPUIIvHOHWhCN2fYLRz0DDPSRSHD_tSmY';
  var BASE  = 'https://kadampacheltenham.github.io/akx-widgets/';
  var IMGS  = 'images/cards/';

  /* One entry per card, in page order.
     sub: a fixed second line · sheet:true: second line comes from Class details
     ext: an external site — new tab + ↗ · span2: full-width on mobile */
  var CARDS = [
    { key: 'cheltenham',  name: 'Cheltenham',  href: '/whats-on',   sub: 'Akanishta Centre' },
    { key: 'cirencester', name: 'Cirencester', href: '/cirencester', sheet: true },
    { key: 'tewkesbury',  name: 'Tewkesbury',  href: '/tewkesbury',  sheet: true },
    { key: 'gloucester',  name: 'Gloucester',  href: '/gloucester',  sheet: true },
    { key: 'stroud',      name: 'Stroud',      href: '/stroud',      sheet: true },
    { key: 'evesham',     name: 'Evesham',     href: '/evesham',     sheet: true },
    { key: 'bristol',     name: 'KMC Bristol', href: 'https://meditationinbristol.org/', sub: 'Events most days', ext: true },
    { key: 'oxford',      name: 'Oxford',      href: 'https://meditateinoxford.org', sub: 'Occasional events', ext: true },
    { key: 'awaydays',    name: 'Away days',   href: '/away-days',  sub: 'Cotswold retreats', span2: true }
  ];

  /* the sections below the grid — same widgets as the branch pages, in Gen's order */
  var SECTIONS = [
    { key: 'grid',      widget: null },
    { key: 'testimony', widget: 'testimony-quotes.js' },
    { key: 'social',    widget: 'social-cards.js',  mount: 'akx-social' },
    { key: 'starthome', widget: 'start-at-home.js', mount: 'akx-starthome' },
    { key: 'calendar',  widget: 'calendar.js',      mount: 'akx-cal' }
  ];

  /* ------------------------------------------------------------------ */
  /* STYLES — the grid only; each widget brings its own                  */
  /* ------------------------------------------------------------------ */
  var CSS = [
    '.akxg{width:100%;font-family:inherit}',
    '.akxg-sec{padding:46px 0}',
    '.akxg-sec:first-child{padding-top:0}',
    '.akxg-sec:empty{display:none;padding:0}',
    '.akxg-sec.akx-empty{display:none;padding:0}',
    '.akxg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1040px;margin:0 auto}',
    '.akxg-card{position:relative;display:block;border-radius:14px;overflow:hidden;height:168px;',
    'background:#fff;box-shadow:0 2px 10px rgba(29,29,31,.10);text-decoration:none;',
    'transition:transform .18s ease,box-shadow .18s ease}',
    '.akxg-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(29,29,31,.16)}',
    '.akxg-card img{width:100%;height:100%;object-fit:cover;display:block}',
    '.akxg-veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(18,26,36,.58),rgba(18,26,36,0) 55%)}',
    '.akxg-tx{position:absolute;left:16px;right:52px;bottom:13px;color:#fff}',
    /* the site sans, weighted — no serif on the photo cards (Gen, 3 Sep) */
    '.akxg-nm{font-weight:600;font-size:1.16rem;letter-spacing:.01em;line-height:1.2;',
    'text-shadow:0 1px 8px rgba(0,0,0,.45)}',
    '.akxg-st{font-weight:400;font-size:.8rem;opacity:.93;margin-top:2px;',
    'text-shadow:0 1px 6px rgba(0,0,0,.4)}',
    '.akxg-arr{position:absolute;right:13px;bottom:13px;width:29px;height:29px;border-radius:50%;',
    'background:rgba(255,255,255,.92);color:#1F7C74;display:flex;align-items:center;',
    'justify-content:center;font-weight:600;font-size:.95rem}',
    '@media (max-width:700px){',
    '.akxg-sec{padding:34px 0}',
    '.akxg-grid{grid-template-columns:1fr 1fr;gap:11px}',
    '.akxg-card{height:112px}',
    '.akxg-card.span2{grid-column:1/-1;height:104px}',
    '.akxg-tx{left:11px;right:38px;bottom:9px}',
    '.akxg-nm{font-size:.94rem}',
    '.akxg-st{font-size:.68rem}',
    '.akxg-arr{width:23px;height:23px;font-size:.8rem;right:9px;bottom:9px}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('akx-branches-css')) return;
    var s = document.createElement('style');
    s.id = 'akx-branches-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ */
  /* SHEET                                                               */
  /* ------------------------------------------------------------------ */
  function gviz(tab) {
    var url = 'https://docs.google.com/spreadsheets/d/' + SHEET +
              '/gviz/tq?tqx=out:json&headers=1&sheet=' + encodeURIComponent(tab);
    return fetch(url).then(function (r) { return r.text(); }).then(function (t) {
      var j = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
      var cols = j.table.cols.map(function (c) { return (c.label || '').trim(); });
      return j.table.rows.map(function (r) {
        var o = {}; (r.c || []).forEach(function (c, i) { o[cols[i]] = c && c.v != null ? c.v : ''; });
        return o;
      });
    });
  }
  var val = function (o, k) { return String(o && o[k] != null ? o[k] : '').trim(); };
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function parseDates(s) {
    var now = new Date(); now.setHours(0,0,0,0);
    var out = [];
    String(s).split(/[,;]+/).forEach(function (bit) {
      var m = bit.trim().match(/^(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?$/);
      if (!m) return;
      var d = +m[1], mo = +m[2] - 1, y = m[3] ? +m[3] : now.getFullYear();
      if (y < 100) y += 2000;
      var dt = new Date(y, mo, d);
      if (!m[3] && dt < new Date(now.getTime() - 31*864e5)) dt.setFullYear(y + 1);
      out.push(dt);
    });
    return out.sort(function (a,b) { return a - b; });
  }

  /* ------------------------------------------------------------------ */
  /* DAY LINES — series running today, else the next series to start     */
  /* ------------------------------------------------------------------ */
  var DAY_ORDER = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var DAY_NAMES = { Mon:'Mondays', Tue:'Tuesdays', Wed:'Wednesdays', Thu:'Thursdays',
                    Fri:'Fridays', Sat:'Saturdays', Sun:'Sundays' };

  function daysFor(town, classes) {
    var today = new Date(); today.setHours(0,0,0,0);
    var running = [], upcoming = [];
    classes.forEach(function (r) {
      if (val(r,'Location ID').toLowerCase() !== town) return;
      if (!val(r,'day')) return;
      var ds = parseDates(val(r,'dates'));
      if (!ds.length) { running.push(r); return; }         // day stated, no dates yet — show it
      var first = ds[0], last = ds[ds.length - 1];
      if (first <= today && last >= today) running.push(r);
      else if (first > today) upcoming.push({ r: r, first: first });
    });
    var use = running;
    if (!use.length && upcoming.length) {
      upcoming.sort(function (a,b) { return a.first - b.first; });
      var start = +upcoming[0].first;                       // series sharing the earliest start count together
      use = upcoming.filter(function (u) { return +u.first === start; })
                    .map(function (u) { return u.r; });
    }
    var seen = {};
    use.forEach(function (r) {
      var d = val(r,'day').slice(0,3).toLowerCase();        // Wed, Thu, Thur, Thursday all land right
      DAY_ORDER.forEach(function (k) { if (k.toLowerCase() === d) seen[k] = 1; });
    });
    return DAY_ORDER.filter(function (k) { return seen[k]; })
                    .map(function (k) { return DAY_NAMES[k]; })
                    .join(' & ');
  }

  /* ------------------------------------------------------------------ */
  /* THE GRID                                                            */
  /* ------------------------------------------------------------------ */
  var BASE_OVERRIDE = null;   // set from data-base on the stub (used for local previews)

  function gridHTML(classes) {
    return '<div class="akxg-grid">' + CARDS.map(function (c) {
      var sub = c.sheet ? daysFor(c.key, classes) : (c.sub || '');
      return '<a class="akxg-card' + (c.span2 ? ' span2' : '') + '" href="' + esc(c.href) + '"' +
             (c.ext ? ' target="_blank" rel="noopener"' : '') + '>' +
             '<img src="' + (BASE_OVERRIDE || BASE) + IMGS + c.key + '.jpg" alt="' + esc(c.name) + '" loading="lazy">' +
             '<div class="akxg-veil"></div>' +
             '<div class="akxg-tx"><div class="akxg-nm">' + esc(c.name) + '</div>' +
             (sub ? '<div class="akxg-st">' + esc(sub) + '</div>' : '') + '</div>' +
             '<div class="akxg-arr">' + (c.ext ? '&#8599;' : '&rarr;') + '</div></a>';
    }).join('') + '</div>';
  }

  /* ------------------------------------------------------------------ */
  /* LOADER — one script per widget, once each                           */
  /* ------------------------------------------------------------------ */
  function loadScript(file) {
    var id = 'akx-w-' + file.replace(/\W+/g,'-');
    if (document.getElementById(id)) return;
    var s = document.createElement('script');
    s.id = id; s.src = (BASE_OVERRIDE || BASE) + file; s.defer = true;
    s.onerror = function () {
      if (window.console) console.warn('[akx-branches] ' + file + ' not published yet — its section stays empty.');
    };
    document.body.appendChild(s);
  }

  /* ------------------------------------------------------------------ */
  function build(mount, classes) {
    if (mount.getAttribute('data-base')) BASE_OVERRIDE = mount.getAttribute('data-base');

    var quotePage = mount.getAttribute('data-quote-page') || 'classes';   // testimony-quotes.js

    var html = '<div class="akxg">';
    SECTIONS.forEach(function (s) {
      if (s.key === 'grid') {
        html += '<div class="akxg-sec">' + gridHTML(classes) + '</div>';
      } else if (s.key === 'testimony') {
        html += '<div class="akxg-sec"><div class="akx-tq" data-type="testimony" data-page="' +
                esc(quotePage) + '"></div></div>';
      } else if (s.key === 'calendar') {
        html += '<div class="akxg-sec"><div id="' + s.mount +
                '" data-cal="branch" data-on="weekly"></div></div>';
      } else {
        html += '<div class="akxg-sec"><div id="' + s.mount + '"></div></div>';
      }
    });
    html += '</div>';

    mount.innerHTML = html;
    mount.setAttribute('data-akx-done', '1');
    SECTIONS.forEach(function (s) { if (s.widget) loadScript(s.widget); });
  }

  function init() {
    var mounts = [].slice.call(document.querySelectorAll('#akx-branches, .akx-branches'))
                   .filter(function (m) { return m.getAttribute('data-akx-done') !== '1'; });
    if (!mounts.length) return;
    injectCSS();

    gviz('Class details')
      .then(function (classes) {
        mounts.forEach(function (m) {
          try { build(m, classes); }
          catch (e) { if (window.console) console.warn('[akx-branches] build failed', e); }
        });
      })
      .catch(function () {
        /* sheet unreachable — the cards still work, town day lines just stay blank */
        mounts.forEach(function (m) {
          try { build(m, []); }
          catch (e) { if (window.console) console.warn('[akx-branches] build failed', e); }
        });
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
