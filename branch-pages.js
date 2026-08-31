/* ===========================================================================
   akx branch-pages.js — the whole branch page, from one stub
   Akanishta Kadampa Buddhist Centre · v2.0 · 29 Aug 2026
   (was branch-page.js — renamed 29 Aug so it reads as "the branch pages widget")

   ONE STUB PER BRANCH PAGE. Everything below the page title and intro is
   built here. Two lines change per town — the town id and its display name:

     <div id="akx-branch" data-town="cirencester" data-name="Cirencester"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/branch-pages.js" defer></script>

   The card title is built from data-name: "Drop-in classes in Cirencester".
   Override the whole line with data-title if a town ever needs different words.

   WHAT IT DOES
   Draws the Drop-in classes card and the town pills itself, then lays out the
   other sections in order and loads each one's own widget into it:

     1  Drop-in classes card + town pills      (here)
     2  Lotus benefits                          lotus-benefits.js
     3  Testimony                               testimony-quotes.js
     4  Programme of classes                    wc-talks-courses.js  (+ event-graphics.js)
     5  Start from home                         start-at-home.js
     6  Stay in touch                           social-cards.js
     7  Calendar                                calendar.js  (data-cal="branch")

   Section 4 is the SAME widget /weekly-classes uses, told which town it is on
   and capped at two cards. It needs the optional filter added to
   wc-talks-courses.js — without it that section would show every town.

   Any widget that isn't on the server yet simply leaves its section empty —
   nothing breaks, and the section appears the moment that file is published.

   EMPTY STATE: a town with nothing in the sheet yet runs in a different order —
   card, lotuses, start from home, testimonial, socials, calendar. See EMPTY_ORDER.

   CACHE: stubs carry no version query — a stub just pulls the widget. GitHub
   Pages caches for ~10 minutes, so after a commit give it that long (or
   hard-reload) before deciding a change didn't land.
   =========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* CONFIG                                                             */
  /* ------------------------------------------------------------------ */
  var TITLE    = 'Drop-in classes in {town}';    // {town} = the data-name on the stub
  /* a town with no classes in the sheet yet gets this title and this copy instead */
  var TITLE_EMPTY  = 'Upcoming events in {town} & nearby';
  var SOON     = 'We’re working to find a suitable venue. Please let us know if you have any suggestions or ideas.';
  var SOON_2   = 'See below for other local events & ways to get started from home.';
  var NEARBY_LABEL = 'Classes & events nearby';
  var BANNER   = 'Everybody welcome';
  var EVENTS_TITLE = 'Programme of classes';
  var SEE_BELOW    = 'See below for programme of classes';
  var COURSES  = 2;                              // the current/next course + the one after it
  var WHATSAPP = '07788 945212';                 // from /contact-us
  var SHEET    = '1YArubV8QgCvPUIIvHOHWhCN2fYLRz0DDPSRSHD_tSmY';
  var BASE     = 'https://kadampacheltenham.github.io/akx-widgets/';

  var PILLS = [
    { label: 'Classes in Cheltenham', href: '/whats-on',   key: 'cheltenham' },
    { label: 'Cirencester',           href: '/cirencester',key: 'cirencester'},
    { label: 'Evesham',               href: '/evesham',    key: 'evesham'    },
    { label: 'Gloucester',            href: '/gloucester', key: 'gloucester' },
    { label: 'Stroud',                href: '/stroud',     key: 'stroud'     },
    { label: 'Tewkesbury',            href: '/tewkesbury', key: 'tewkesbury' },
    { label: 'Away day retreats',     href: '/away-days',  key: 'awaydays', sand: true }
  ];

  /* section order. `widget` = the file to load into it; null = drawn here. */
  var SECTIONS = [
    { key: 'card',        widget: null },
    { key: 'lotus',       widget: 'lotus-benefits.js', mount: 'akx-lotus' },
    { key: 'testimony',   widget: 'testimony-quotes.js' },
    /* Talks & short courses — the SAME widget /weekly-classes uses, filtered to this town
       and capped at two cards: the current/next course, then the one after it. */
    { key: 'events',      widget: ['event-graphics.js', 'wc-talks-courses.js'], mount: 'akx-programme' },
    { key: 'starthome',   widget: 'start-at-home.js',  mount: 'akx-starthome' },
    { key: 'social',      widget: 'social-cards.js',   mount: 'akx-social' },
    { key: 'calendar',    widget: 'calendar.js',       mount: 'akx-cal' }
  ];

  /* Order used when the town has nothing in the sheet yet (Gen, 29 Aug):
     card → lotuses → start from home → testimonial → socials → calendar.
     'events' rides along and collapses to nothing; it is here only so a town that
     somehow has a course but no weekly class still shows it. */
  var EMPTY_ORDER = ['card', 'lotus', 'starthome', 'testimony', 'events', 'social', 'calendar'];

  /* ------------------------------------------------------------------ */
  /* STYLES — the card and pills; each widget brings its own             */
  /* ------------------------------------------------------------------ */
  var CSS = [
    '.akxp{width:100%;font-family:inherit}',
    '.akxp-sec{padding:46px 0}',
    '.akxp-sec:first-child{padding-top:0}',
    '.akxp-sec:empty{display:none;padding:0}',
    '.akxp-sec.akx-empty{display:none;padding:0}',   /* set by a widget that has nothing to show */
    /* card */
    '.akxb-card{background:#fff;border:1px solid rgba(226,136,106,.38);border-radius:18px;',
    'overflow:hidden;max-width:800px;margin:0 auto;',
    'box-shadow:0 3px 16px rgba(226,136,106,.13),0 1px 3px rgba(226,136,106,.08)}',
    '.akxb-banner{background:#E2886A;color:#fff;text-align:center;font-size:11.5px;font-weight:700;',
    'letter-spacing:.16em;text-transform:uppercase;padding:10px 16px;border-radius:14px;',
    'width:62%;margin:22px auto 0}',
    '.akxb-ttl{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:1.7rem;color:#2A66A6;',
    'text-align:center;margin:16px 0 2px;line-height:1.2}',
    '.akxb-pad{padding:0 30px 22px}',
    '.akxb-sec{padding:16px 0}',
    '.akxb-sec + .akxb-sec{border-top:1px solid #EDE9DF}',
    '.akxb-secflex{display:flex;gap:24px;align-items:center}',
    '.akxb-main{flex:0 0 52%;min-width:0}',
    '.akxb-line{display:flex;gap:16px;align-items:baseline;padding:3px 0}',
    '.akxb-lbl{flex:none;width:92px;font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;',
    'font-weight:700;color:#8A8578}',
    '.akxb-val{flex:1;min-width:0;font-size:1rem;line-height:1.55;color:#2E3640}',
    '.akxb-venue{font-weight:700}',
    '.akxb-sub{color:#7A8189;font-size:.88em}',
    /* "See below…" — hidden until the programme section reports it has cards */
    '.akxb-seebelow{display:none;margin-top:3px}',
    '.akxb-seebelow.on{display:block}',
    '.akxb-seebelow a{color:#2A66A6;font-size:.86rem;text-decoration:underline}',
    '#akx-programme{scroll-margin-top:90px}',
    '.akxb-dirs{color:#0B7A3B;font-weight:600;font-size:.86em;text-decoration:underline;white-space:nowrap}',
    '.akxb-link{color:#2A66A6;text-decoration:underline;font-size:1rem;font-weight:400;letter-spacing:0}',
    '.akxb-next{flex:none;width:140px;background:#F6EFE4;border:1px solid #E7DAC4;border-radius:12px;',
    'padding:11px 10px;text-align:center}',
    '.akxb-next .k{font-size:9.6px;letter-spacing:.11em;text-transform:uppercase;font-weight:700;color:#1F7C74}',
    '.akxb-next .d{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:1.25rem;color:#1F7C74;',
    'margin:3px 0 2px;line-height:1.15}',
    '.akxb-next .t{font-size:.88rem;color:#5C6672}',
    '.akxb-soon{text-align:center;color:#5C6672;font-size:1rem;padding:6px 0 2px;max-width:56ch;margin:0 auto}',
    '.akxb-soon p{margin:0;line-height:1.6;text-wrap:pretty}',
    /* pills inside the card, on a town with nothing on yet */
    '.akxb-nearby{text-align:center}',
    '.akxb-nearby-h{font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;font-weight:700;',
    'color:#8A8578;margin-bottom:11px}',
    /* pills */
    '.akxb-pills{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:20px}',
    '.akxb-pills.in{margin-top:0;gap:10px}',
    '.akxb-pills.in .akxb-pill{font-size:.9rem;padding:10px 20px}',
    '.akxb-pill{background:#EAF7F4;border:1px solid #C9E6E0;color:#2E8078;font-size:.83rem;',
    'font-weight:600;padding:8px 16px;border-radius:999px;text-decoration:none}',
    '.akxb-pill:hover{background:#E4F5F2;color:#1F7C74}',
    '.akxb-pill.sand{background:#F6EFE4;border-color:#E7DAC4;color:#8A6B3A}',
    '.akxb-pill.sand:hover{background:#F1E7D7;color:#7A5D2E}',
    '@media (max-width:700px){',
    '.akxp-sec{padding:34px 0}',
    '.akxb-pad{padding:0 18px 18px}',
    '.akxb-banner{width:78%;margin:18px auto 0;font-size:10px;letter-spacing:.12em;padding:9px 10px}',
    '.akxb-ttl{font-size:1.35rem;margin:15px 0 2px}',
    '.akxb-secflex{display:block}',
    '.akxb-main{flex:1 1 100%}',
    '.akxb-next{width:100%;margin:12px 0 0;display:flex;align-items:baseline;justify-content:center;gap:10px;padding:9px 10px}',
    '.akxb-next .d{margin:0}',
    '.akxb-line{gap:9px;align-items:flex-start}',
    '.akxb-lbl{width:64px;font-size:9px;letter-spacing:.05em;padding-top:3px}',
    '.akxb-val{font-size:.9rem;word-break:break-word}',
    '.akxb-dirs{white-space:normal}',
    '.akxb-pill{font-size:.76rem;padding:6px 12px}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('akx-branch-css')) return;
    var s = document.createElement('style');
    s.id = 'akx-branch-css'; s.textContent = CSS;
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

  /* ------------------------------------------------------------------ */
  /* DATES                                                               */
  /* ------------------------------------------------------------------ */
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

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
  function nextDate(list) {
    var now = new Date(); now.setHours(0,0,0,0);
    for (var i = 0; i < list.length; i++) if (list[i] >= now) return list[i];
    return null;
  }
  function fmt(d) { return DOW[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()]; }
  function mapsHref(a) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a); }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* bold everything up to the first comma — the venue name, not the address */
  function boldFirstPart(str) {
    var i = str.indexOf(',');
    if (i === -1) return '<strong class="akxb-venue">' + esc(str) + '</strong>';
    return '<strong class="akxb-venue">' + esc(str.slice(0, i)) + '</strong>' + esc(str.slice(i));
  }

  function row(label, html) {
    if (!html) return '';
    return '<div class="akxb-line"><div class="akxb-lbl">' + esc(label) + '</div>' +
           '<div class="akxb-val">' + html + '</div></div>';
  }

  /* ------------------------------------------------------------------ */
  /* THE CARD                                                            */
  /* ------------------------------------------------------------------ */
  function cardHTML(town, name, title, data) {
    var loc = data.locations.filter(function (r) {
      return val(r,'Location ID').toLowerCase() === town; })[0];
    var slots = data.classes.filter(function (r) {
      return val(r,'Location ID').toLowerCase() === town; });
    var empty = !slots.length;

    /* A town with nothing on yet is not offering drop-in classes, so it does not get
       that title. It points at what IS happening — here and in the towns around it. */
    if (empty) title = TITLE_EMPTY.replace('{town}', name);

    var html = '<div class="akxb-card"><div class="akxb-banner">' + esc(BANNER) + '</div>' +
               '<div class="akxb-ttl">' + esc(title) + '</div><div class="akxb-pad">';

    if (empty) {
      /* one flowing paragraph — two sentences, not two blocks */
      html += '<div class="akxb-sec akxb-soon"><p>' + esc(SOON) + ' ' + esc(SOON_2) + '</p></div>';
    } else {
      var s = slots[0];
      var teacher = val(s,'teacher'), day = val(s,'day'), time = val(s,'time'),
          duration = val(s,'duration'), nxt = nextDate(parseDates(val(s,'dates')));
      var when = esc(day) + (day && time ? ', ' : '') + esc(time) +
                 (duration ? ' <span class="akxb-sub">(' + esc(duration) + ')</span>' : '') +
                 /* revealed only once the programme section below has something in it */
                 '<span class="akxb-seebelow"><a href="#akx-programme">' + esc(SEE_BELOW) + '</a></span>';
      html += '<div class="akxb-sec akxb-secflex"><div class="akxb-main">' +
                row('Teacher', teacher ? 'with ' + esc(teacher) : '') +
                row('When', when) + '</div>';
      if (nxt) html += '<div class="akxb-next"><div class="k">Next class</div>' +
                       '<div class="d">' + fmt(nxt) + '</div><div class="t">' + esc(time) + '</div></div>';
      html += '</div>';
    }

    /* Venue and the branch's own website/email need a Locations row. WhatsApp does NOT —
       a town we're asking for venue suggestions must always show a way to reach us. */
    var display = loc ? val(loc,'display_name') : '';
    if (display.toLowerCase() === name.toLowerCase()) display = '';
    var venue = loc ? [display, val(loc,'address')].filter(Boolean).join(', ') : '';
    var web   = loc ? val(loc,'Branch website') : '';
    var email = loc ? val(loc,'Branch email')   : '';

    var sec =
      row('Venue', venue ? boldFirstPart(venue) +
            ' &nbsp;<a class="akxb-dirs" href="' + mapsHref(venue) +
            '" target="_blank" rel="noopener">Get directions</a>' : '') +
      row('Information', loc && val(loc,'access_note') ? '<span class="akxb-sub">' + esc(val(loc,'access_note')) + '</span>' : '') +
      row('WhatsApp', WHATSAPP ? '<a class="akxb-link" href="https://wa.me/44' +
            WHATSAPP.replace(/\D/g,'').replace(/^0/,'') + '" target="_blank" rel="noopener">' +
            esc(WHATSAPP) + '</a>' : '') +
      row('Website', web ? '<a class="akxb-link" href="' +
            (/^https?:/i.test(web) ? esc(web) : 'https://' + esc(web)) +
            '" target="_blank" rel="noopener">' + esc(web.replace(/^https?:\/\//i,'')) + '</a>' : '') +
      row('Email', email ? '<a class="akxb-link" href="mailto:' + esc(email) + '">' + esc(email) + '</a>' : '');
    if (sec) html += '<div class="akxb-sec">' + sec + '</div>';

    /* The town pills answer "where, then?" — so on a town with nothing on they belong
       INSIDE the card, carrying a label and a little more weight. Everywhere else they
       stay below it, quiet, as a footer of sister pages. */
    var pills = PILLS.filter(function (p) { return p.key !== town; })
      .map(function (p) { return '<a class="akxb-pill' + (p.sand ? ' sand' : '') +
                                 '" href="' + p.href + '">' + esc(p.label) + '</a>'; })
      .join('');

    if (empty) {
      html += '<div class="akxb-sec akxb-nearby">' +
                '<div class="akxb-nearby-h">' + esc(NEARBY_LABEL) + '</div>' +
                '<div class="akxb-pills in">' + pills + '</div>' +
              '</div>';
    }

    html += '</div></div>';

    if (!empty) html += '<div class="akxb-pills">' + pills + '</div>';

    return { html: html, hasClasses: !empty };
  }

  /* ------------------------------------------------------------------ */
  /* LOADER — one script per widget, once each                           */
  /* ------------------------------------------------------------------ */
  var BASE_OVERRIDE = null;   // set from data-base on the mount (used for local previews)

  function loadScript(file, onload) {
    var id = 'akx-w-' + file.replace(/\W+/g,'-');
    if (document.getElementById(id)) { if (onload) onload(); return; }
    var s = document.createElement('script');
    s.id = id; s.src = (BASE_OVERRIDE || BASE) + file; s.defer = true;
    s.onload = function () { if (onload) onload(); };
    s.onerror = function () {
      if (window.console) console.warn('[akx-branch] ' + file + ' not published yet — its section stays empty.');
      if (onload) onload();          // a missing helper must not block the widget behind it
    };
    document.body.appendChild(s);
  }

  /* an array loads in order — event-graphics.js must define AKX_GFX before wc-talks-courses.js */
  function loadWidget(w) {
    if (!w) return;
    if (typeof w === 'string') return loadScript(w);
    (function next(i) {
      if (i >= w.length) return;
      loadScript(w[i], function () { next(i + 1); });
    })(0);
  }

  /* ------------------------------------------------------------------ */
  function build(mount, data) {
    var town  = (mount.getAttribute('data-town') || '').toLowerCase();
    var name  = mount.getAttribute('data-name') || town;
    var title = (mount.getAttribute('data-title') || TITLE).replace('{town}', name);
    var quotePage = mount.getAttribute('data-quote-page') || 'classes';  // testimony-quotes.js
    if (mount.getAttribute('data-base')) BASE_OVERRIDE = mount.getAttribute('data-base');

    var card = cardHTML(town, name, title, data);

    /* empty state — a town with nothing in the sheet yet gets EMPTY_ORDER instead */
    var order = SECTIONS.slice();
    if (!card.hasClasses) {
      order = EMPTY_ORDER.map(function (k) {
        return SECTIONS.filter(function (s) { return s.key === k; })[0];
      }).filter(Boolean);
    }

    var html = '<div class="akxp">';
    order.forEach(function (s) {
      if (s.key === 'card') {
        html += '<div class="akxp-sec">' + card.html + '</div>';
      } else if (s.key === 'events') {
        html += '<div class="akxp-sec"><div id="' + s.mount + '"' +
                ' data-location="' + esc(town) + '"' +
                ' data-limit="' + COURSES + '"' +
                ' data-labels="branch"' +
                ' data-heading="' + EVENTS_TITLE + '"' +
                ' data-lead="" data-quotes="0"></div></div>';
      } else if (s.key === 'testimony') {
        html += '<div class="akxp-sec"><div class="akx-tq" data-type="testimony" data-page="' +
                esc(quotePage) + '"></div></div>';
      } else if (s.key === 'calendar') {
        html += '<div class="akxp-sec"><div id="' + s.mount + '" data-cal="branch"></div></div>';
      } else {
        html += '<div class="akxp-sec"><div id="' + s.mount + '"' +
                (s.key === 'testimonial' ? ' data-town="' + esc(town) + '"' : '') + '></div></div>';
      }
    });
    html += '</div>';

    mount.innerHTML = html;
    mount.setAttribute('data-akx-done', '1');

    order.forEach(function (s) { loadWidget(s.widget); });
    watchProgramme(mount);
  }

  /* The "See below…" link is only honest once the programme section has cards in it.
     That section fills in later (own widget, own sheet read), so watch for it. */
  function watchProgramme(root) {
    var sec  = root.querySelector('#akx-programme');
    var link = root.querySelector('.akxb-seebelow');
    if (!sec || !link) return;
    var check = function () { link.classList.toggle('on', !!sec.querySelector('.cc')); };
    check();
    if (window.MutationObserver) {
      new MutationObserver(check).observe(sec, { childList: true, subtree: true });
    } else {
      setTimeout(check, 1500);
    }
  }

  function init() {
    var mounts = [].slice.call(document.querySelectorAll('#akx-branch, .akx-branch'))
                   .filter(function (m) { return m.getAttribute('data-akx-done') !== '1'; });
    if (!mounts.length) return;
    injectCSS();

    Promise.all([gviz('Locations'), gviz('Class details')])
      .then(function (res) {
        var data = { locations: res[0], classes: res[1] };
        mounts.forEach(function (m) {
          try { build(m, data); }
          catch (e) { if (window.console) console.warn('[akx-branch] build failed', e); }
        });
      })
      .catch(function (e) { if (window.console) console.warn('[akx-branch] sheet read failed', e); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
