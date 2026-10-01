/* Akanishta — EVENT PROMO BLOCK (v2.5, 1 Oct 2026)
   One hosted file, used on every page. Promotes a single special event and moves
   itself through its stages by date: offer → early bird → standard → last week →
   final days → gone (after the event it renders nothing, everywhere, at once).

   v2.0 design: portrait panel + cream card, Poppins headline, price set as type,
   one coral button. Phone: arch portrait, centred, nothing cropped through the face.

   EMBED (Squarespace Code Block):
     <div id="akx-event-promo"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/event-promo.js" defer></script>

   Optional attributes on the div:
     data-variant="quiet"     one quiet line + Book button (branch pages, low on a page)
     data-maxwidth="1040"     px (default 1040)

   Several blocks on one page: use class="akx-event-promo" instead of the id.

   EDIT THE EVENT IN THE CONFIG BLOCK BELOW — nothing else needs touching.
   Dates are UK time, YYYY-MM-DD. A stage runs until the END of its 'until' day.
   =========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* CONFIG                                                             */
  /* ------------------------------------------------------------------ */
  var EVENT = {
    title:    'Meditation for less<br>stress &amp; worry',
    titleOne: 'Meditation for less stress &amp; worry',   // phone / quiet line
    date:     '2026-11-04',
    time:     '7pm',
    dateLine: 'Wed 4 Nov',
    venue:    'Pittville Pump Room',
    town:     'Cheltenham',
    teacher:  'Kadam Bridget Heyes',
    photo:    'https://kadampacheltenham.github.io/akx-widgets/images/bridget-heyes.jpg',
    book:     'https://www.tickettailor.com/events/akanishtakadampabuddhistcentre/2416076',
    code:     'code STUDENT or U25'
  };

  // Stages run in order; the first one whose 'until' has not passed is shown.
  var STAGES = [
    { until: '2026-10-14', accent: 'coral',
      eyebrow: 'Special evening event · ' + EVENT.town,
      price:   '2 tickets for £15',
      till:    'until 14 Oct',
      offerName:'2-for-1 offer',
      button:  'Book 2 for 1',
      fine:    'Or a single early bird ticket, <b>£12 until 21 Oct</b>. Students &amp; under 25s save 30% — ' + EVENT.code + '.',
      chip:    'offer' },

    { until: '2026-10-21', accent: 'blue',
      eyebrow: 'Special evening event · ' + EVENT.town,
      price:   'Early bird £12',
      till:    'until 21 Oct',
      offerName:'Early bird price',
      button:  'Book early bird',
      fine:    'Standard price £15 after 21 Oct. Students &amp; under 25s save 30% — ' + EVENT.code + '.',
      chip:    'offer' },

    { until: '2026-10-28', accent: 'blue',
      eyebrow: 'An evening with ' + EVENT.teacher,
      price:   'Tickets £15',
      till:    'everybody welcome',
      button:  'Book now',
      fine:    'No experience needed. Students &amp; under 25s save 30% — ' + EVENT.code + '.',
      chip:    'countdown' },

    { until: '2026-11-02', accent: 'blue',
      eyebrow: 'The last week · booking closes soon',
      price:   'Tickets £15',
      till:    'everybody welcome',
      button:  'Book your seat',
      fine:    'No experience needed. Students &amp; under 25s save 30% — ' + EVENT.code + '.',
      chip:    'countdown',
      meta:    '<b>Next Wednesday, 4 Nov · 7pm</b> · ' + EVENT.venue + ' · doors &amp; bookshop from 6pm' },

    { until: '2026-11-04', accent: 'coral',
      eyebrow: 'This week · ' + EVENT.venue,
      price:   'A few seats left',
      till:    'tickets £15',
      button:  'Book your seat',
      fine:    'On the door if not sold out. Students &amp; under 25s save 30% — ' + EVENT.code + '.',
      chip:    'countdown',
      meta:    '<b>Wed 4 Nov · 7pm</b> · with ' + EVENT.teacher + ' · doors from 6pm' }
  ];

  /* ------------------------------------------------------------------ */
  /* STYLES                                                             */
  /* ------------------------------------------------------------------ */
  var CSS = [
    '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap");',
    '.akxep{font-family:Poppins,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;margin:58px auto 34px;max-width:min(1040px,100%);min-width:0;overflow-wrap:break-word;}',
    '.akxep *{box-sizing:border-box;}',
    '.akxep a{text-decoration:none;}',
    '.akxep .bx{display:flex;border-radius:20px;overflow:hidden;background:#F8F1E9;min-height:310px;color:inherit;cursor:pointer;transition:box-shadow .18s ease,transform .18s ease;}',
    '.akxep .bx:hover{box-shadow:0 6px 22px rgba(43,38,32,.13);transform:translateY(-2px);}',
    '.akxep .bx:hover .bt{filter:brightness(1.04);}',
    '.akxep .bx:focus-visible,.akxep .qt:focus-visible{outline:3px solid #2A66A6;outline-offset:3px;}',
    '.akxep .pic{width:340px;flex-shrink:0;position:relative;background-size:cover;background-position:50% 6%;}',
    '.akxep .pic:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(248,241,233,0) 68%,rgba(248,241,233,.98) 100%);}',
    '.akxep .bd{flex:1;min-width:0;padding:36px 40px 34px 30px;}',
    '.akxep .tp{display:flex;align-items:baseline;justify-content:space-between;gap:20px;}',
    '.akxep .eb{font-size:11.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#C2492C;}',
    '.akxep .blue .eb{color:#2A66A6;}',
    '.akxep .cd{font-size:11.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#C2492C;margin-top:7px;}',
    '.akxep .blue .cd{color:#2A66A6;}',
    '.akxep .hl{font-size:38px;font-weight:600;line-height:1.1;color:#2A66A6;margin:16px 0 0;letter-spacing:-.005em;}',
    '.akxep .mt{font-size:15px;color:#5C554B;margin-top:13px;font-weight:300;}',
    '.akxep .mt b{font-weight:600;color:#2B2620;}',
    '.akxep .pr{margin-top:22px;display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;}',
    '.akxep .pr .big{font-size:25px;font-weight:600;color:#C2492C;letter-spacing:-.01em;}',
    '.akxep .blue .pr .big{color:#2A66A6;}',
    '.akxep .pr .till{font-size:14.5px;font-weight:500;color:#8A8073;border-left:1px solid #E0D4C4;padding-left:14px;}',
    '.akxep .rw{display:flex;align-items:center;gap:24px;margin-top:22px;flex-wrap:wrap;}',
    '.akxep .bt{background:#E8664A;color:#fff;font-weight:600;font-size:16.5px;border-radius:999px;padding:15px 32px;display:inline-flex;gap:10px;align-items:center;box-shadow:0 2px 8px rgba(232,102,74,.28);transition:transform .15s ease;}',
    '.akxep .bt:hover{transform:translateY(-1px);}',
    '.akxep .fn{font-size:13.5px;color:#6B6358;font-weight:300;max-width:330px;line-height:1.55;}',
    '.akxep .fn b{font-weight:600;color:#3A342C;}',
    '.akxep .arch{display:none;}',
    /* quiet variant */
    '.akxep .qt{display:flex;align-items:center;gap:20px;padding:18px 24px;background:#F8F1E9;border-radius:16px;color:inherit;cursor:pointer;transition:box-shadow .18s ease;}',
    '.akxep .qt:hover{box-shadow:0 4px 16px rgba(43,38,32,.12);}',
    '.akxep .qt .sm{width:62px;height:72px;border-radius:31px 31px 10px 10px;background-size:cover;background-position:50% 4%;flex-shrink:0;}',
    '.akxep .qt .t1{font-size:16.5px;font-weight:600;color:#2A66A6;}',
    '.akxep .qt .t2{font-size:13.5px;color:#6B6358;margin-top:4px;font-weight:300;}',
    '.akxep .qt .bq{margin-left:auto;background:#E8664A;color:#fff;font-weight:600;font-size:14.5px;border-radius:999px;padding:11px 24px;white-space:nowrap;}',
    /* phone */
    '@media(max-width:720px){',
    '.akxep .bx{display:block;padding:26px 24px 28px;border-radius:18px;min-height:0;}',
    '.akxep .pic{display:none;}',
    '.akxep .bd{padding:0;}',
    '.akxep .arch{display:block;width:146px;height:168px;border-radius:73px 73px 18px 18px;background-size:cover;background-position:50% 4%;margin:0 auto 18px;box-shadow:0 2px 10px rgba(43,38,32,.10);}',
    '.akxep .tp{display:block;text-align:center;}',
    '.akxep .cd{text-align:center;}',
    '.akxep .eb{display:block;}',
    '.akxep .hl{font-size:29px;margin-top:12px;text-align:center;}',
    '.akxep .mt{text-align:center;}',
    '.akxep .pr{justify-content:center;margin-top:18px;}',
    '.akxep .rw{display:block;margin-top:18px;}',
    '.akxep .bt{display:flex;justify-content:center;width:100%;}',
    '.akxep .fn{max-width:none;margin-top:14px;text-align:center;}',
    '.akxep .qt{flex-wrap:wrap;}',
    '.akxep .qt .bq{margin-left:0;width:100%;text-align:center;margin-top:6px;}',
    '}'
  ].join('\n');

  /* ------------------------------------------------------------------ */
  /* HELPERS                                                            */
  /* ------------------------------------------------------------------ */
  function d(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function today() { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }
  function days(a, b) { return Math.round((a - b) / 86400000); }

  function countdown(stage) {
    var left = days(d(EVENT.date), today());
    if (stage.chip === 'offer') {
      var name = stage.offerName || 'Offer';
      var o = days(d(stage.until), today());
      if (o <= 0) return name + ' — last day';
      if (o === 1) return name + ' ends tomorrow';
      return name + ' ends in ' + o + ' days';
    }
    if (left <= 0) return 'Tonight';
    if (left === 1) return 'Tomorrow';
    if (left <= 13) return left + ' days to go';
    return Math.round(left / 7) + ' weeks to go';
  }

  function metaLine(stage) {
    if (stage.meta) return stage.meta;
    return '<b>' + EVENT.dateLine + ' · ' + EVENT.time + '</b> · ' + EVENT.venue +
           ' · with ' + EVENT.teacher;
  }

  function currentStage() {
    var t = today();
    for (var i = 0; i < STAGES.length; i++) {
      if (t <= d(STAGES[i].until)) return STAGES[i];
    }
    return null;
  }

  function injectCSS() {
    if (document.getElementById('akxep-css')) return;
    var s = document.createElement('style');
    s.id = 'akxep-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ */
  /* RENDER                                                             */
  /* ------------------------------------------------------------------ */
  function renderFull(stage) {
    var img = 'background-image:url(' + EVENT.photo + ')';
    return '<a class="bx ' + stage.accent + '" href="' + EVENT.book +
      '" target="_blank" rel="noopener" aria-label="' + stage.button +
      ' — Meditation for less stress and worry, Wed 4 Nov, 7pm">' +
      '<div class="pic" style="' + img + '"></div>' +
      '<div class="bd">' +
        '<div class="arch" style="' + img + '"></div>' +
        '<div class="tp">' +
          '<div class="eb">' + stage.eyebrow + '</div>' +
        '</div>' +
        '<h3 class="hl">' + EVENT.title + '</h3>' +
        '<div class="mt">' + metaLine(stage) + '</div>' +
        '<div class="pr"><span class="big">' + stage.price + '</span>' +
          '<span class="till">' + stage.till + '</span></div>' +
        '<div class="cd">' + countdown(stage) + '</div>' +
        '<div class="rw">' +
          '<span class="bt">' + stage.button + ' &nbsp;&rarr;</span>' +
          '<div class="fn">' + stage.fine + '</div>' +
        '</div>' +
      '</div>' +
    '</a>';
  }

  function renderQuiet() {
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

  function mount(el) {
    var stage = currentStage();
    if (!stage) { el.innerHTML = ''; el.style.display = 'none'; return; }
    injectCSS();
    el.className += ' akxep';
    var mw = el.getAttribute('data-maxwidth');
    if (mw) el.style.maxWidth = parseInt(mw, 10) + 'px';
    el.innerHTML = (el.getAttribute('data-variant') === 'quiet')
      ? renderQuiet()
      : renderFull(stage);
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
