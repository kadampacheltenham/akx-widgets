/* Akanishta — EVENT PROMO BLOCK
   VERSION 8.2 — 26 Oct 2026 — marker AKXEP_V8_2
   v8.2: Book opens Ticket Tailor's checkout in the on-site pop-up (tt-onsite-booking.js, loaded on
         demand), like the event cards; the normal Ticket Tailor link stays as the fallback.
   One hosted file, used on every page. Promotes a single special event and moves
   itself through phases by date, then removes itself after the event.

   PHASES (UK time; an offer runs to 23:55 on its last day, matching Ticket Tailor)
     1  early bird        → design A, coral line "Early bird ends Friday / ends tomorrow / Last day of early bird"
     2  countdown         → design A, coral line "11 days to go"
     3  final week        → design C (blue field) from 7 days to go, "Tomorrow · 7pm", "Tonight · 7pm"
     0  after the event   → renders nothing, everywhere, at once

   DESIGN A  cream card · coral strap · photo panel · blue title · coral countdown · coral button
   DESIGN C  blue card  · coral strap · round portrait · white title · peach countdown · coral button

   EMBED (Squarespace Code Block):
     <div id="akx-event-promo"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/event-promo.js" defer></script>

   Optional attributes on the div:
     data-variant="quiet"     one quiet line + Book button (branch pages, low on a page)
     data-maxwidth="1040"     px (default 1040)
   Several blocks on one page: use class="akx-event-promo" instead of the id.

   IMAGES (upload with this file): images/bridget-heyes-portrait.jpg, images/bridget-heyes-band.jpg

   EDIT THE EVENT IN THE CONFIG BLOCK BELOW — nothing else needs touching.
   =========================================================================== */
(function () {
  'use strict';

  var VERSION = 'AKXEP_V8_2';

  /* ------------------------------------------------------------------ */
  /* CONFIG                                                             */
  /* ------------------------------------------------------------------ */
  var BASE = 'https://kadampacheltenham.github.io/akx-widgets/images/';
  var EVENT = {
    title:    'Meditation for less<br>stress &amp; worry',
    titleOne: 'Meditation for less stress &amp; worry',
    date:     '2026-11-04',
    hour:     19,                      // 7pm
    dateLine: 'Wed 4 Nov',
    time:     '7pm',
    venue:    'Pittville Pump Room, Cheltenham',
    teacher:  'Kadam Bridget Heyes',
    strap:    'One night only · Wednesday 4 November',
    portrait: BASE + 'bridget-heyes-portrait.jpg',   // desktop panel and round portrait
    band:     BASE + 'bridget-heyes-band.jpg',       // phone photo band (design A)
    book:     'https://www.tickettailor.com/events/akanishtakadampabuddhistcentre/2416076'
  };

  // The early bird: runs to 23:55 on this day.
  var EARLY = { until: '2026-10-23', price: 12, button: 'Book early bird' };
  var PRICE = 15;

  // Design C takes over when this many days or fewer remain.
  var FINAL_WEEK_FROM = 7;

  /* ------------------------------------------------------------------ */
  /* STYLES                                                             */
  /* ------------------------------------------------------------------ */
  var CSS = [
    '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;600;700&display=swap");',
    '.akxep{font-family:Poppins,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;margin:58px auto 34px;max-width:min(1040px,100%);min-width:0;overflow-wrap:break-word;}',
    '.akxep *{box-sizing:border-box;}',
    '.akxep a{text-decoration:none;}',
    '.akxep .bx{position:relative;display:flex;flex-direction:column;border-radius:20px;overflow:hidden;min-height:440px;color:#2B2620;cursor:pointer;transition:box-shadow .18s ease,transform .18s ease;}',
    '.akxep .bx:hover{box-shadow:0 6px 22px rgba(43,38,32,.13);transform:translateY(-2px);}',
    '.akxep .bx:hover .bt{filter:brightness(1.04);}',
    '.akxep .bx:focus-visible,.akxep .qt:focus-visible{outline:3px solid #2A66A6;outline-offset:3px;}',
    '.akxep .strap{min-height:44px;flex:none;background:#E8664A;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 16px;font-size:12.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;}',
    '.akxep .row{display:flex;flex:1;min-height:0;}',
    '.akxep .pic{width:336px;flex:none;background-size:cover;background-position:50% 0;}',
    '.akxep .band{display:none;}',
    '.akxep .bd{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:28px 40px 28px 34px;}',
    '.akxep .hl{margin:0;font-size:44px;line-height:1.08;font-weight:600;letter-spacing:-.005em;}',
    '.akxep .by{margin-top:8px;font-size:15px;font-weight:600;}',
    '.akxep .cd{margin-top:20px;font-size:40px;line-height:1;font-weight:600;letter-spacing:-.02em;}',
    '.akxep .bt{margin-top:22px;display:inline-flex;align-items:center;gap:8px;background:#E8664A;color:#fff;font-size:17px;font-weight:600;border-radius:999px;padding:15px 34px;box-shadow:0 2px 8px rgba(232,102,74,.26);transition:transform .15s ease;}',
    '.akxep .bt .ar{font-size:20px;line-height:1;}',
    '.akxep .es{margin-top:18px;font-size:14px;font-weight:300;line-height:1.5;text-wrap:balance;}',

    /* design A — cream */
    '.akxep .A{background:#F8F1E9;border:1px solid rgba(42,102,166,.12);}',
    '.akxep .A .hl,.akxep .A .by{color:#2A66A6;}',
    '.akxep .A .cd{color:#DE5A3E;}',
    '.akxep .A .es{color:#5C554B;}',

    /* design C — blue field */
    '.akxep .C{background:#2A66A6;color:#fff;}',
    '.akxep .C .row{align-items:center;gap:44px;padding:0 52px 0 48px;}',
    '.akxep .C .cam{width:300px;height:300px;border-radius:50%;flex:none;background-size:cover;background-position:50% 22%;box-shadow:0 0 0 6px #fff;}',
    '.akxep .C .bd{padding:0;}',
    '.akxep .C .hl{color:#fff;font-size:40px;}',
    '.akxep .C .by{color:#FFD2C2;}',
    '.akxep .C .act{margin-top:22px;display:flex;align-items:center;gap:24px;flex-wrap:wrap;}',
    '.akxep .C .cd{margin-top:0;font-size:44px;color:#FFD2C2;}',
    '.akxep .C .bt{margin-top:0;border:2px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.18);}',
    '.akxep .C .es{margin-top:20px;color:rgba(255,255,255,.85);}',

    /* quiet variant */
    '.akxep .qt{display:flex;align-items:center;gap:20px;padding:18px 24px;background:#F8F1E9;border-radius:16px;color:inherit;cursor:pointer;transition:box-shadow .18s ease;}',
    '.akxep .qt:hover{box-shadow:0 4px 16px rgba(43,38,32,.12);}',
    '.akxep .qt .sm{width:62px;height:62px;border-radius:50%;background-size:cover;background-position:50% 12%;flex-shrink:0;}',
    '.akxep .qt .t1{font-size:16.5px;font-weight:600;color:#2A66A6;}',
    '.akxep .qt .t2{font-size:13.5px;color:#6B6358;margin-top:4px;font-weight:300;}',
    '.akxep .qt .bq{margin-left:auto;background:#E8664A;color:#fff;font-weight:600;font-size:14.5px;border-radius:999px;padding:11px 24px;white-space:nowrap;}',

    /* tablet */
    '@media(min-width:721px) and (max-width:900px){',
    '.akxep .pic{width:250px;}',
    '.akxep .bd{padding:26px 28px 26px 26px;}',
    '.akxep .hl{font-size:36px;}',
    '.akxep .cd{font-size:34px;}',
    '.akxep .C .row{gap:28px;padding:0 32px 0 30px;}',
    '.akxep .C .cam{width:190px;height:190px;}',
    '.akxep .C .hl{font-size:34px;}',
    '.akxep .C .cd{font-size:34px;}',
    '}',

    /* phone */
    '@media(max-width:720px){',
    '.akxep .bx{min-height:0;border-radius:18px;box-shadow:0 8px 24px rgba(43,38,32,.14);}',
    '.akxep .strap{min-height:40px;padding:10px 16px;font-size:10.5px;letter-spacing:.14em;}',
    '.akxep .row{display:block;}',
    '.akxep .pic{display:none;}',
    '.akxep .A .band{display:block;height:240px;background-size:cover;background-position:50% 50%;}',
    '.akxep .bd{padding:24px 22px 26px;}',
    '.akxep .hl{font-size:30px;}',
    '.akxep .by{font-size:14px;}',
    '.akxep .cd{margin-top:16px;font-size:26px;}',
    '.akxep .bt{margin-top:18px;display:flex;justify-content:center;width:100%;}',
    '.akxep .es{margin-top:16px;font-size:13.5px;}',
    '.akxep .C .row{padding:0;}',
    '.akxep .C .bd{align-items:center;text-align:center;padding:24px 22px 26px;}',
    '.akxep .C .cam{width:150px;height:150px;margin:28px auto 0;box-shadow:0 0 0 5px #fff;}',
    '.akxep .C .hl{font-size:30px;}',
    '.akxep .C .act{flex-direction:column;align-items:stretch;gap:0;margin-top:16px;width:100%;}',
    '.akxep .C .cd{font-size:32px;text-align:center;}',
    '.akxep .C .bt{margin-top:18px;}',
    '.akxep .qt{flex-wrap:wrap;text-align:left;}',
    '.akxep .qt .bq{margin-left:0;width:100%;text-align:center;margin-top:6px;}',
    '}'
  ].join('\n');

  /* ------------------------------------------------------------------ */
  /* TIME                                                               */
  /* ------------------------------------------------------------------ */
  function dayStart(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dayEnd(s)   { var d = dayStart(s); d.setHours(23, 55, 0, 0); return d; }   // Ticket Tailor's cut-off
  function today()     { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }
  function daysToDate(s) { return Math.round((dayStart(s) - today()) / 86400000); }
  function daysToEvent() { return daysToDate(EVENT.date); }

  // 1 = early bird, 2 = countdown (A), 3 = final week (C), 0 = finished
  function phase() {
    var now = new Date();
    if (now > dayEnd(EVENT.date)) return 0;
    if (now <= dayEnd(EARLY.until)) return 1;
    return daysToEvent() <= FINAL_WEEK_FROM ? 3 : 2;
  }

  /* ------------------------------------------------------------------ */
  /* COPY                                                               */
  /* ------------------------------------------------------------------ */
  function earlyLine() {
    var n = daysToDate(EARLY.until);
    if (n <= 0) return 'Last day of early bird';
    if (n === 1) return 'Early bird ends tomorrow';
    return 'Early bird ends ' + dayStart(EARLY.until).toLocaleDateString('en-GB', { weekday: 'long' });
  }
  function countLine() {
    var n = daysToEvent();
    if (n <= 0) return 'Tonight · ' + EVENT.time;
    if (n === 1) return 'Tomorrow · ' + EVENT.time;
    return n + ' days to go';
  }
  function essentials(p) {
    var price = p === 1 ? '£' + EARLY.price + ' now, £' + PRICE + ' after ' + dayStart(EARLY.until).toLocaleDateString('en-GB', { weekday: 'long' })
                        : 'Tickets £' + PRICE;
    return EVENT.dateLine + ' · ' + EVENT.time + ' · ' + EVENT.venue + ' · ' + price;
  }

  /* ------------------------------------------------------------------ */
  /* ON-SITE BOOKING (v8.2)                                             */
  /* ------------------------------------------------------------------ */
  // marks the Book link so tt-onsite-booking.js opens it in the pop-up; any other link stays as it is
  var TT_EVENT = /^https?:\/\/(?:tickets\.meditationincheltenham\.org\.uk|(?:www\.)?tickettailor\.com)\/events\/akanishtakadampabuddhistcentre\/(\d+)/i;
  function bookAttrs() {
    var m = TT_EVENT.exec(EVENT.book || '');
    return m ? ' data-akx-book="' + m[1] + '" data-akx-title="' + EVENT.titleOne.replace(/"/g, '&quot;') + '" data-akx-date="' + EVENT.date + '"' : '';
  }
  function loadBooking() {
    if (window.AKXBook || document.getElementById('akx-book-loader') || !TT_EVENT.test(EVENT.book || '')) return;
    var s = document.createElement('script');
    s.id = 'akx-book-loader'; s.async = true;
    s.src = BASE.replace(/images\/$/, '') + 'tt-onsite-booking.js';
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ */
  /* RENDER                                                             */
  /* ------------------------------------------------------------------ */
  function cardHTML(p) {
    var design = (p === 3) ? 'C' : 'A';
    var line   = (p === 1) ? earlyLine() : countLine();
    var button = (p === 1) ? EARLY.button : 'Book now';
    var btn = '<span class="bt">' + button + ' <span class="ar" aria-hidden="true">&rarr;</span></span>';
    var body;
    if (design === 'A') {
      body =
        '<div class="row">' +
          '<div class="pic" style="background-image:url(' + EVENT.portrait + ')"></div>' +
          '<div class="band" style="background-image:url(' + EVENT.band + ')"></div>' +
          '<div class="bd">' +
            '<h3 class="hl">' + EVENT.title + '</h3>' +
            '<div class="by">with ' + EVENT.teacher + '</div>' +
            '<div class="cd">' + line + '</div>' +
            btn +
            '<div class="es">' + essentials(p) + '</div>' +
          '</div>' +
        '</div>';
    } else {
      body =
        '<div class="row">' +
          '<div class="cam" style="background-image:url(' + EVENT.portrait + ')"></div>' +
          '<div class="bd">' +
            '<h3 class="hl">' + EVENT.title + '</h3>' +
            '<div class="by">with ' + EVENT.teacher + '</div>' +
            '<div class="act"><div class="cd">' + line + '</div>' + btn + '</div>' +
            '<div class="es">' + essentials(p) + '</div>' +
          '</div>' +
        '</div>';
    }
    return '<a class="bx ' + design + '" href="' + EVENT.book + '" target="_blank" rel="noopener"' + bookAttrs() + ' aria-label="' +
      button + ' — Meditation for less stress and worry, ' + EVENT.dateLine + ', ' + EVENT.time + '">' +
      '<div class="strap">' + EVENT.strap + '</div>' + body + '</a>';
  }

  function quietHTML(p) {
    return '<a class="qt" href="' + EVENT.book + '" target="_blank" rel="noopener"' + bookAttrs() + '>' +
      '<div class="sm" style="background-image:url(' + EVENT.portrait + ')"></div>' +
      '<div>' +
        '<div class="t1">An evening with ' + EVENT.teacher + ' · ' + EVENT.dateLine + ', ' + EVENT.time + '</div>' +
        '<div class="t2">' + EVENT.titleOne + ' · ' + ((p === 1) ? earlyLine() : countLine()) + '</div>' +
      '</div>' +
      '<span class="bq">Book now &rarr;</span>' +
    '</a>';
  }

  /* ------------------------------------------------------------------ */
  /* MOUNT + TICK                                                       */
  /* ------------------------------------------------------------------ */
  var mounted = [], lastKey = null;

  function injectCSS() {
    if (document.getElementById('akxep-css')) return;
    var s = document.createElement('style');
    s.id = 'akxep-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function paint(el) {
    var p = phase();
    if (p === 0) { el.innerHTML = ''; el.style.display = 'none'; return; }
    el.style.display = '';
    el.innerHTML = (el.getAttribute('data-variant') === 'quiet') ? quietHTML(p) : cardHTML(p);
    loadBooking();
  }

  function tick() {                       // repaint when the phase or the day changes
    var key = phase() + '|' + daysToEvent() + '|' + daysToDate(EARLY.until);
    if (key === lastKey) return;
    lastKey = key;
    for (var i = 0; i < mounted.length; i++) paint(mounted[i]);
  }

  function mount(el) {
    injectCSS();
    if (el.className.indexOf('akxep') === -1) el.className += ' akxep';
    var mw = el.getAttribute('data-maxwidth');
    if (mw) el.style.maxWidth = parseInt(mw, 10) + 'px';
    mounted.push(el);
  }

  function start() {
    var seen = [];
    var one = document.getElementById('akx-event-promo');
    if (one) seen.push(one);
    var many = document.querySelectorAll('.akx-event-promo');
    for (var i = 0; i < many.length; i++) if (seen.indexOf(many[i]) === -1) seen.push(many[i]);
    for (var j = 0; j < seen.length; j++) mount(seen[j]);
    tick();
    if (seen.length) setInterval(tick, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
