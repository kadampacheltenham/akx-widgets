/* Akanishta — EVENT PROMO BLOCK (v3.0, 3 Oct 2026)
   One hosted file, used on every page. Promotes a single special event and moves
   itself through four phases by date, then removes itself after the event.

   PHASES
     1  2-for-1 offer          → badge + "N days left · until 14 Oct" after the button
     2  early bird             → badge + "N days left · until 21 Oct" after the button
     3  days 8-14 to go        → no badge; hairline countdown, pulsing colons
     4  final 7 days           → no badge; ticket stub with split-flap leaves
     -  after the event        → renders nothing, everywhere, at once

   The clock is live: figures update every minute while the page is open.

   EMBED (Squarespace Code Block):
     <div id="akx-event-promo"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/event-promo.js" defer></script>

   Optional attributes on the div:
     data-variant="quiet"     one quiet line + Book button (branch pages, low on a page)
     data-maxwidth="1040"     px (default 1040)

   Several blocks on one page: use class="akx-event-promo" instead of the id.

   EDIT THE EVENT IN THE CONFIG BLOCK BELOW — nothing else needs touching.
   Dates are UK time, YYYY-MM-DD. An offer runs to the END of its 'until' day.
   =========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* CONFIG                                                             */
  /* ------------------------------------------------------------------ */
  var EVENT = {
    title:    'Meditation for less<br>stress &amp; worry',
    titleOne: 'Meditation for less stress &amp; worry',
    date:     '2026-11-04',
    hour:     19,                       // 7pm, 24-hour clock
    dateLine: 'Wed 4 Nov',
    dayShort: '4 Nov',                  // printed on the ticket stub
    time:     '7pm',
    venue:    'Pittville Pump Room',
    town:     'Cheltenham',
    teacher:  'Kadam Bridget Heyes',
    photo:    'https://kadampacheltenham.github.io/akx-widgets/images/bridget-heyes.jpg',
    book:     'https://www.tickettailor.com/events/akanishtakadampabuddhistcentre/2416076'
  };

  var STUDENT = '<b>Full-time students &amp; under 25s save 30%</b> — code STUDENT or U25';

  // Offer phases, in order. The first whose 'until' has not passed is shown.
  var OFFERS = [
    { until:   '2026-10-14',
      price:   '2 tickets for £15',
      accent:  'coral',
      button:  'Book 2 for 1',
      tail:    'until 14 Oct',
      line1:   'Or a single early bird ticket, <b class="akxnb">£12 until 21&nbsp;Oct</b>' },

    { until:   '2026-10-21',
      price:   'Early bird £12',
      accent:  'blue',
      button:  'Book early bird',
      tail:    'until 21 Oct',
      line1:   'Standard price £15 after 21 Oct' }
  ];

  // Once the offers are over
  var LATE = { price: 'Tickets £15', button: 'Book your seat' };

  // Phase 3 runs while this many days or more remain; below it, phase 4.
  var STUB_FROM = 7;

  /* ------------------------------------------------------------------ */
  /* STYLES                                                             */
  /* ------------------------------------------------------------------ */
  var CSS = [
    '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;600;700&display=swap");',
    '.akxep{font-family:Poppins,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;margin:58px auto 34px;max-width:min(1040px,100%);min-width:0;overflow-wrap:break-word;}',
    '.akxep *{box-sizing:border-box;}',
    '.akxep a{text-decoration:none;}',
    '.akxep .bx{position:relative;display:flex;border-radius:20px;overflow:hidden;background:#F8F1E9;min-height:316px;color:inherit;cursor:pointer;transition:box-shadow .18s ease,transform .18s ease;}',
    '.akxep .bx:hover{box-shadow:0 6px 22px rgba(43,38,32,.13);transform:translateY(-2px);}',
    '.akxep .bx:hover .bt{filter:brightness(1.04);}',
    '.akxep .bx:focus-visible,.akxep .qt:focus-visible{outline:3px solid #2A66A6;outline-offset:3px;}',
    '.akxep .pic{width:336px;flex-shrink:0;position:relative;background-size:cover;background-position:50% 6%;}',
    '.akxep .pic:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(248,241,233,0) 70%,rgba(248,241,233,.98) 100%);}',
    '.akxep .bd{flex:1;min-width:0;padding:36px 40px 34px 30px;}',
    '.akxep .eb{font-size:11.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#C2492C;margin-right:214px;}',
    '.akxep .hl{font-size:37px;font-weight:600;line-height:1.1;color:#2A66A6;margin:14px 214px 0 0;letter-spacing:-.005em;}',
    '.akxep .mt{font-size:15px;color:#5C554B;margin-top:12px;font-weight:300;}',
    '.akxep .mt b{font-weight:600;color:#2B2620;}',
    '.akxep .mb{display:none;}',
    '.akxep .pr{margin-top:19px;font-size:25px;font-weight:600;color:#C2492C;letter-spacing:-.01em;}',
    '.akxep .blue .pr{color:#2A66A6;}',
    '.akxep .akxnb{white-space:nowrap;}',
    '.akxep .rw{display:flex;align-items:center;gap:18px;margin-top:18px;flex-wrap:wrap;}',
    '.akxep .bt{background:#E8664A;color:#fff;font-weight:600;font-size:16.5px;border-radius:999px;padding:15px 32px;display:inline-flex;gap:10px;align-items:center;box-shadow:0 2px 8px rgba(232,102,74,.26);transition:transform .15s ease;}',
    '.akxep .bt:hover{transform:translateY(-1px);}',
    '.akxep .exp{font-size:15px;font-weight:600;color:#C2492C;white-space:nowrap;}',
    '.akxep .exp i{font-style:normal;font-weight:300;color:#8A8073;}',
    '.akxep .fn{font-size:13.5px;color:#6B6358;font-weight:300;line-height:1.7;margin-top:15px;}',
    '.akxep .fn b{font-weight:600;color:#3A342C;}',
    '.akxep .fn .l1{display:block;}',
    '.akxep .fn .stu{display:block;color:#C2492C;}',
    '.akxep .fn .stu b{font-weight:600;color:#C2492C;}',
    '.akxep .cnr{position:absolute;top:30px;right:30px;z-index:4;}',

    /* "One night only" circle — offer phases only */
    '.akxep .badge{position:absolute;top:26px;right:28px;width:118px;height:118px;border-radius:50%;background:#EA4D3D;color:#fff;display:flex;align-items:center;justify-content:center;z-index:5;}',
    '.akxep .badge .b3{display:block;text-align:center;font-size:20px;font-weight:700;line-height:1;letter-spacing:-.01em;transform:rotate(12deg);}',
    '.akxep .badge .b1{display:none;}',

    /* Phase 3 — hairline columns, pulsing colons */
    '.akxep .hair{display:flex;align-items:flex-start;}',
    '.akxep .hc{text-align:center;min-width:62px;}',
    '.akxep .hc .v{font-size:42px;font-weight:200;color:#C2492C;line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums;}',
    '.akxep .hc .u{font-size:8.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#A2978A;margin-top:10px;}',
    '.akxep .hcolon{font-size:30px;font-weight:200;color:#C2492C;line-height:1.28;padding:0 9px;animation:akxpulse 2s ease-in-out infinite;}',
    '@keyframes akxpulse{0%,45%{opacity:1}55%,100%{opacity:.25}}',

    /* Phase 4 — ticket stub with split-flap leaves */
    '.akxep .stub{display:inline-flex;align-items:stretch;background:#C2492C;color:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(194,73,44,.22);}',
    '.akxep .stub .end{width:40px;display:flex;align-items:center;justify-content:center;border-right:2px dashed rgba(255,255,255,.42);}',
    '.akxep .stub .end span{transform:rotate(-90deg);white-space:nowrap;font-size:10.5px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;}',
    '.akxep .stub .in{display:flex;align-items:center;gap:9px;padding:15px 17px;}',
    '.akxep .fu{text-align:center;}',
    '.akxep .fu .u{font-size:8px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;opacity:.75;margin-top:7px;}',
    '.akxep .flap{position:relative;width:54px;height:50px;border-radius:7px;background:#8E2F1C;color:#FFF3EC;font-size:27px;font-weight:600;letter-spacing:-.02em;overflow:hidden;font-variant-numeric:tabular-nums;isolation:isolate;}',
    '.akxep .flap .face{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}',
    '.akxep .flap .hinge{position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(255,255,255,.42);z-index:6;}',
    '.akxep .sheen{position:absolute;inset:0;z-index:7;pointer-events:none;border-radius:7px;background:linear-gradient(145deg,rgba(255,255,255,.20) 0%,rgba(255,255,255,.07) 34%,rgba(255,255,255,0) 50%,rgba(0,0,0,.06) 100%);}',
    '.akxep .leaf{position:absolute;left:0;right:0;height:50%;overflow:hidden;backface-visibility:hidden;z-index:4;background:#8E2F1C;}',
    '.akxep .leaf:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(145deg,rgba(255,255,255,.20) 0%,rgba(255,255,255,.07) 68%,rgba(255,255,255,0) 100%);}',
    '.akxep .leaf.b:after{background:linear-gradient(145deg,rgba(255,255,255,0) 0%,rgba(0,0,0,.06) 100%);}',
    '.akxep .leaf.t{top:0;transform-origin:bottom center;}',
    '.akxep .leaf.b{bottom:0;transform-origin:top center;}',
    '.akxep .leaf span{position:absolute;left:0;width:100%;height:50px;display:flex;align-items:center;justify-content:center;}',
    '.akxep .leaf.t span{top:0;}',
    '.akxep .leaf.b span{top:-25px;}',
    '@keyframes akxfoldDown{from{transform:rotateX(0)}to{transform:rotateX(-90deg)}}',
    '@keyframes akxfoldUp{from{transform:rotateX(90deg)}to{transform:rotateX(0)}}',

    '.akxep .circ{display:none;}',

    /* quiet variant */
    '.akxep .qt{display:flex;align-items:center;gap:20px;padding:18px 24px;background:#F8F1E9;border-radius:16px;color:inherit;cursor:pointer;transition:box-shadow .18s ease;}',
    '.akxep .qt:hover{box-shadow:0 4px 16px rgba(43,38,32,.12);}',
    '.akxep .qt .sm{width:62px;height:62px;border-radius:50%;background-size:cover;background-position:50% 8%;flex-shrink:0;}',
    '.akxep .qt .t1{font-size:16.5px;font-weight:600;color:#2A66A6;}',
    '.akxep .qt .t2{font-size:13.5px;color:#6B6358;margin-top:4px;font-weight:300;}',
    '.akxep .qt .bq{margin-left:auto;background:#E8664A;color:#fff;font-weight:600;font-size:14.5px;border-radius:999px;padding:11px 24px;white-space:nowrap;}',

    /* phone */
    '@media(max-width:720px){',
    '.akxep .bx{display:block;padding:26px 22px 26px;border-radius:18px;min-height:0;text-align:center;box-shadow:0 8px 24px rgba(43,38,32,.14);border:1px solid rgba(43,38,32,.05);}',
    '.akxep .dk{display:none;}',
    '.akxep .mb{display:inline;}',
    '.akxep .pic{display:none;}',
    '.akxep .bd{padding:0;}',
    '.akxep .circ{display:block;width:150px;height:150px;border-radius:50%;background-size:cover;background-position:50% 8%;margin:0 auto 16px;box-shadow:0 2px 10px rgba(43,38,32,.12);}',
    '.akxep .eb,.akxep .hl{margin-right:0;}',
    '.akxep .hl{font-size:27px;margin-top:11px;}',
    '.akxep .cnr{position:static;margin:0 0 14px;display:flex;justify-content:center;}',
    '.akxep .badge{top:0;right:0;width:auto;height:auto;border-radius:0 18px 0 14px;padding:9px 16px 9px 18px;}',
    '.akxep .badge .b3{display:none;}',
    '.akxep .badge .b1{display:block;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;line-height:1;}',
    '.akxep .rw{display:flex;flex-direction:column-reverse;align-items:stretch;gap:0;margin-top:14px;}',
    '.akxep .bt{display:flex;justify-content:center;width:100%;}',
    '.akxep .exp{display:block;margin:0 0 12px;}',
    '.akxep .fn{margin-top:13px;}',
    '.akxep .qt{flex-wrap:wrap;text-align:left;}',
    '.akxep .qt .bq{margin-left:0;width:100%;text-align:center;margin-top:6px;}',
    '}'
  ].join('\n');

  /* ------------------------------------------------------------------ */
  /* TIME                                                               */
  /* ------------------------------------------------------------------ */
  function dayStart(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dayEnd(s)   { var d = dayStart(s); d.setHours(23, 59, 59, 999); return d; }
  function today()     { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }

  function eventStart() {
    var d = dayStart(EVENT.date);
    d.setHours(EVENT.hour, 0, 0, 0);
    return d;
  }

  // Whole days from today to the end of the given day — used for offer deadlines.
  function daysToDate(s) {
    return Math.round((dayStart(s) - today()) / 86400000);
  }

  // Live remainder to the event, split into days / hours / minutes.
  function remainder() {
    var ms = eventStart() - new Date();
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    return {
      total: ms,
      d: Math.floor(s / 86400),
      h: Math.floor(s % 86400 / 3600),
      m: Math.floor(s % 3600 / 60)
    };
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function currentOffer() {
    var now = new Date();
    for (var i = 0; i < OFFERS.length; i++) {
      if (now <= dayEnd(OFFERS[i].until)) return OFFERS[i];
    }
    return null;
  }

  // 1 = offer, 3 = hairline, 4 = stub, 0 = finished
  function phase() {
    var end = dayEnd(EVENT.date);
    if (new Date() > end) return 0;
    if (currentOffer()) return 1;
    return remainder().d >= STUB_FROM + 1 ? 3 : 4;
  }

  function offerTail(offer) {
    var n = daysToDate(offer.until);
    if (n <= 0) return 'Last day <i>· ' + offer.tail + '</i>';
    if (n === 1) return '1 day left <i>· ' + offer.tail + '</i>';
    return n + ' days left <i>· ' + offer.tail + '</i>';
  }

  /* ------------------------------------------------------------------ */
  /* CORNER DEVICES                                                     */
  /* ------------------------------------------------------------------ */
  function hairHTML(r) {
    function col(v, u, id) {
      return '<div class="hc"><div class="v" data-k="' + id + '">' + v +
             '</div><div class="u">' + u + '</div></div>';
    }
    return '<div class="hair">' +
      col(r.d, 'days', 'd') + '<div class="hcolon">:</div>' +
      col(pad(r.h), 'hrs', 'h') + '<div class="hcolon">:</div>' +
      col(pad(r.m), 'mins', 'm') + '</div>';
  }

  function stubHTML(r) {
    function unit(u, id) {
      return '<div class="fu"><div class="flap" data-k="' + id + '"></div>' +
             '<div class="u">' + u + '</div></div>';
    }
    return '<div class="stub"><div class="end"><span>' + EVENT.dayShort + '</span></div>' +
      '<div class="in">' + unit('days', 'd') + unit('hrs', 'h') + unit('mins', 'm') +
      '</div></div>';
  }

  function buildFlap(el, v) {
    el.innerHTML = '<div class="face">' + v + '</div><div class="hinge"></div>' +
                   '<div class="sheen"></div>';
    el.setAttribute('data-v', v);
  }

  function flipFlap(el, v) {
    if (el.getAttribute('data-v') === v) return;
    var old = el.getAttribute('data-v');
    el.setAttribute('data-v', v);
    var lt = document.createElement('div');
    lt.className = 'leaf t';
    lt.innerHTML = '<span>' + old + '</span>';
    var lb = document.createElement('div');
    lb.className = 'leaf b';
    lb.innerHTML = '<span>' + v + '</span>';
    lb.style.transform = 'rotateX(90deg)';
    var face = el.querySelector('.face');
    if (face) face.textContent = v;
    el.appendChild(lt);
    el.appendChild(lb);
    lt.style.animation = 'akxfoldDown .26s ease-in forwards';
    setTimeout(function () {
      if (lt.parentNode) lt.parentNode.removeChild(lt);
      lb.style.animation = 'akxfoldUp .26s ease-out forwards';
      setTimeout(function () {
        if (lb.parentNode) lb.parentNode.removeChild(lb);
      }, 300);
    }, 260);
  }

  /* ------------------------------------------------------------------ */
  /* RENDER                                                             */
  /* ------------------------------------------------------------------ */
  function cardHTML(p, offer, r) {
    var img = 'background-image:url(' + EVENT.photo + ')';
    var accent = offer ? offer.accent : 'blue';
    var price  = offer ? offer.price  : LATE.price;
    var button = offer ? offer.button : LATE.button;

    var corner = '';
    if (p === 1) {
      corner = '<div class="badge"><span class="b3">One<br>night<br>only</span>' +
               '<span class="b1">One night only</span></div>';
    } else if (p === 3) {
      corner = '<div class="cnr">' + hairHTML(r) + '</div>';
    } else if (p === 4) {
      corner = '<div class="cnr">' + stubHTML(r) + '</div>';
    }

    var fine = '<div class="fn">' +
      (offer ? '<span class="l1">' + offer.line1 + '</span>' : '') +
      '<span class="stu">' + STUDENT + '</span></div>';

    var tail = offer ? '<span class="exp">' + offerTail(offer) + '</span>' : '';

    var badge = (p === 1) ? corner : '';
    var clock = (p === 1) ? '' : corner;

    return '<a class="bx ' + accent + '" href="' + EVENT.book +
      '" target="_blank" rel="noopener" aria-label="' + button +
      ' — Meditation for less stress and worry, Wed 4 Nov, 7pm">' +
      badge +
      '<div class="pic" style="' + img + '"></div>' +
      '<div class="bd">' +
        '<div class="circ" style="' + img + '"></div>' +
        '<div class="eb">An evening with ' + EVENT.teacher + '</div>' +
        '<h3 class="hl">' + EVENT.title + '</h3>' +
        '<div class="mt"><b>' + EVENT.dateLine + ' · ' + EVENT.time + '</b> · ' +
          EVENT.venue + ' · <span class="dk">Café &amp; bookshop from 6pm</span>' +
          '<span class="mb">Café from 6pm</span></div>' +
        clock +
        '<div class="pr">' + price + '</div>' +
        '<div class="rw"><span class="bt">' + button + ' &nbsp;&rarr;</span>' + tail + '</div>' +
        fine +
      '</div>' +
    '</a>';
  }

  function quietHTML() {
    return '<a class="qt" href="' + EVENT.book + '" target="_blank" rel="noopener">' +
      '<div class="sm" style="background-image:url(' + EVENT.photo + ')"></div>' +
      '<div>' +
        '<div class="t1">An evening with ' + EVENT.teacher + ' · ' + EVENT.dateLine +
          ', ' + EVENT.time + '</div>' +
        '<div class="t2">' + EVENT.titleOne + ' · ' + EVENT.venue + ', ' + EVENT.town + '</div>' +
      '</div>' +
      '<span class="bq">Book now &rarr;</span>' +
    '</a>';
  }

  /* ------------------------------------------------------------------ */
  /* MOUNT + TICK                                                       */
  /* ------------------------------------------------------------------ */
  var mounted = [];
  var lastPhase = null;

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
    var r = remainder();
    el.innerHTML = (el.getAttribute('data-variant') === 'quiet')
      ? quietHTML()
      : cardHTML(p, currentOffer(), r);

    if (p === 4) {
      var flaps = el.querySelectorAll('.flap');
      for (var i = 0; i < flaps.length; i++) {
        var k = flaps[i].getAttribute('data-k');
        buildFlap(flaps[i], k === 'd' ? pad(r.d) : k === 'h' ? pad(r.h) : pad(r.m));
      }
    }
  }

  function tick() {
    var p = phase();
    if (p !== lastPhase) {              // phase change — repaint everything
      lastPhase = p;
      for (var i = 0; i < mounted.length; i++) paint(mounted[i]);
      return;
    }
    if (p === 0 || p === 1) return;     // nothing ticking in the offer phases
    var r = remainder();
    for (var j = 0; j < mounted.length; j++) {
      var el = mounted[j];
      if (el.getAttribute('data-variant') === 'quiet') continue;
      if (p === 3) {
        var cells = el.querySelectorAll('.hc .v');
        for (var c = 0; c < cells.length; c++) {
          var k = cells[c].getAttribute('data-k');
          var v = k === 'd' ? '' + r.d : k === 'h' ? pad(r.h) : pad(r.m);
          if (cells[c].textContent !== v) cells[c].textContent = v;
        }
      } else {
        var flaps = el.querySelectorAll('.flap');
        for (var f = 0; f < flaps.length; f++) {
          var fk = flaps[f].getAttribute('data-k');
          flipFlap(flaps[f], fk === 'd' ? pad(r.d) : fk === 'h' ? pad(r.h) : pad(r.m));
        }
      }
    }
  }

  function mount(el) {
    injectCSS();
    if (el.className.indexOf('akxep') === -1) el.className += ' akxep';
    var mw = el.getAttribute('data-maxwidth');
    if (mw) el.style.maxWidth = parseInt(mw, 10) + 'px';
    mounted.push(el);
    paint(el);
  }

  function start() {
    var seen = [];
    var one = document.getElementById('akx-event-promo');
    if (one) seen.push(one);
    var many = document.querySelectorAll('.akx-event-promo');
    for (var i = 0; i < many.length; i++) {
      if (seen.indexOf(many[i]) === -1) seen.push(many[i]);
    }
    for (var j = 0; j < seen.length; j++) mount(seen[j]);
    lastPhase = phase();
    if (seen.length) setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
