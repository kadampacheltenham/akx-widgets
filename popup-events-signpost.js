/* ===========================================================================
   akx popup-events-signpost.js — the 2027 pop-up events banner
   Akanishta Kadampa Buddhist Centre · v1.0 · 3 Sep 2026

   ONE FILE, EVERY PAGE. The "Popping up near you…" postcard banner —
   design agreed 3 Sep 2026 (see claude/popup-banner-2027.md in the project):
   headline + red-and-gold 2027 postmark, dotted journey trail ending at a
   coral "your town?" pin, three taped-up venue snapshots, the main CTA level
   with the pin, and a quiet line inviting people to help host one.

   EMBED (Squarespace Code Block, or loaded by another widget):
     <div id="akx-popups"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/popup-events-signpost.js" defer></script>

   Already loaded automatically by:
     - other-locations-signposts.js (the branch hub, after the lotuses)
     - branch-pages.js (every branch page, under the lotuses)

   Content lives in the CONFIG block below — change a line here and it
   updates everywhere at once. All CSS is namespaced .akxu- and lays out
   only the widget's own insides.
   =========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* CONFIG                                                             */
  /* ------------------------------------------------------------------ */
  var HEADLINE = 'Popping up near you…';
  var CTA_PRE  = 'Be first to hear with — ';
  var WHATSAPP = 'https://whatsapp.com/channel/0029VbDgH5y0VycLdfp0MV35';
  var ENEWS    = 'https://akanishta-kbc.kit.com/9f9556739d';
  var HELP     = 'Could you help host a free 30 min pop-up near you? ';
  var HELP_URL = '/contact-us';

  /* ------------------------------------------------------------------ */
  /* STYLES                                                             */
  /* ------------------------------------------------------------------ */
  var CSS = [
    '.akxu-ban{max-width:1040px;margin:0 auto;background:#FEFEFA;border:1px solid #EDE9DF;',
    'border-radius:16px;box-shadow:0 2px 12px rgba(29,29,31,.08);padding:26px 36px 20px;',
    'display:grid;grid-template-columns:1fr 400px;grid-template-areas:',
    '"head snaps" "trail cta" "help cta";gap:6px 26px;font-family:inherit;box-sizing:border-box}',
    '.akxu-head{grid-area:head;display:flex;align-items:flex-start;gap:8px}',
    '.akxu-h{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:1.8rem;color:#2A66A6;',
    'margin:0;line-height:1.2}',
    '.akxu-mark{flex:none;transform:rotate(-8deg);margin:-8px 0 0 -6px}',
    /* snapshots — taped-up mini cards, loose and a little random */
    '.akxu-snaps{grid-area:snaps;position:relative;height:124px}',
    '.akxu-pin{width:118px;height:88px;background:#fff;border:1px solid #E6E6DF;border-radius:6px;',
    'position:absolute;display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 3px 8px rgba(29,29,31,.10)}',
    '.akxu-p1{left:0;top:16px;transform:rotate(-6deg)}',
    '.akxu-p2{left:140px;top:2px;transform:rotate(4deg)}',
    '.akxu-p3{left:278px;top:22px;transform:rotate(-3deg)}',
    '.akxu-tape{position:absolute;top:-8px;left:50%;transform:translateX(-50%) rotate(3deg);',
    'width:44px;height:14px;background:rgba(231,218,196,.85);border-radius:2px}',
    '.akxu-pin small{position:absolute;bottom:5px;font-size:9px;letter-spacing:.06em;',
    'text-transform:uppercase;color:#8A8578;font-weight:600}',
    '.akxu-trail{grid-area:trail;align-self:center}',
    '.akxu-trail svg{display:block;width:100%;height:auto}',
    '.akxu-cta{grid-area:cta;align-self:center;justify-self:end;text-align:right;',
    'font-size:.95rem;color:#1F7C74;font-weight:600}',
    '.akxu-cta a{color:#1F7C74;text-decoration:underline}',
    '.akxu-help{grid-area:help;align-self:end;font-size:.88rem;color:#8A8578}',
    '.akxu-help a{color:#2A66A6;text-decoration:underline}',
    '@media (max-width:700px){',
    '.akxu-ban{display:block;margin:0 14px;padding:20px 18px 16px}',
    '.akxu-h{font-size:1.32rem}',
    '.akxu-mark svg{width:82px;height:66px}',
    '.akxu-mark{margin:-6px 0 0 0}',
    '.akxu-snaps{height:auto;display:flex;justify-content:center;gap:14px;margin:10px 0 2px}',
    '.akxu-pin{position:static;width:92px;height:70px}',
    '.akxu-pin svg{width:40px;height:34px}',
    '.akxu-pin small{font-size:8px;bottom:4px}',
    '.akxu-trail{margin:6px 0 2px}',
    '.akxu-cta{text-align:center;margin-top:8px;font-size:.9rem}',
    '.akxu-help{text-align:center;margin-top:8px;font-size:.82rem}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('akx-popups-css')) return;
    var s = document.createElement('style');
    s.id = 'akx-popups-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ */
  /* GRAPHICS                                                           */
  /* ------------------------------------------------------------------ */
  /* the 2027 postmark — gold ring, curved county, red date */
  var MARK =
    '<svg width="108" height="86" viewBox="0 0 116 92" aria-hidden="true">' +
    '<defs><path id="akxu-arc" d="M 14 46 A 32 32 0 0 1 78 46"/></defs>' +
    '<circle cx="46" cy="46" r="40" fill="none" stroke="#C79A3E" stroke-width="2"/>' +
    '<circle cx="46" cy="46" r="26" fill="none" stroke="#C79A3E" stroke-width="1" opacity=".55"/>' +
    '<text x="46" y="50" text-anchor="middle" font-family="Georgia,serif" font-size="19" fill="#C13B2F" font-weight="bold">2027</text>' +
    '<text x="46" y="62" text-anchor="middle" font-family="Inter,sans-serif" font-size="6.5" letter-spacing="1.2" fill="#C13B2F">&amp; BEYOND</text>' +
    '<text font-family="Inter,sans-serif" font-size="7.6" letter-spacing="1.1" fill="#C79A3E">' +
    '<textPath href="#akxu-arc" startOffset="50%" text-anchor="middle">GLOUCESTERSHIRE</textPath></text>' +
    '<path d="M92 34c7 0 7 4 14 4M92 46c7 0 7 4 14 4M92 58c7 0 7 4 14 4" stroke="#C79A3E" stroke-width="1.6" fill="none" opacity=".6" stroke-linecap="round"/></svg>';

  /* the journey — dotted trail, three pins, coral "your town?" */
  var TRAIL =
    '<svg viewBox="0 0 545 86" aria-hidden="true">' +
    '<path d="M6 60 C 75 30, 135 68, 200 46 S 320 16, 390 46 S 470 64, 508 30" fill="none" stroke="#C9E6E0" stroke-width="3" stroke-dasharray="1 11" stroke-linecap="round"/>' +
    '<g font-family="Inter,sans-serif" font-size="11" font-weight="600">' +
    '<circle cx="80" cy="42" r="7" fill="#1F7C74"/><text x="80" y="26" text-anchor="middle" fill="#1F7C74">café</text>' +
    '<circle cx="212" cy="46" r="7" fill="#C79A3E"/><text x="212" y="70" text-anchor="middle" fill="#8A6B3A">library</text>' +
    '<circle cx="358" cy="40" r="7" fill="#1F7C74"/><text x="358" y="24" text-anchor="middle" fill="#1F7C74">village hall</text>' +
    '<g transform="translate(492,40)"><path d="M0 14C0 6 6 0 14 0s14 6 14 14c0 10-14 22-14 22S0 24 0 14Z" transform="translate(-14,-16)" fill="#E2886A"/>' +
    '<circle cx="0" cy="-3" r="5" fill="#fff"/><text x="0" y="32" text-anchor="middle" fill="#E2886A">your town?</text></g></g></svg>';

  var SNAPS =
    '<div class="akxu-pin akxu-p1"><div class="akxu-tape"></div>' +
    '<svg width="52" height="44" viewBox="0 0 52 44"><path d="M8 14h28v14a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8Z" fill="none" stroke="#E2886A" stroke-width="2.4"/><path d="M36 17h5a5 5 0 0 1 0 10h-5" fill="none" stroke="#E2886A" stroke-width="2.4"/><path d="M17 9c0-3 2-3 2-6M25 9c0-3 2-3 2-6" stroke="#C79A3E" stroke-width="2" fill="none" stroke-linecap="round"/></svg>' +
    '<small>cafés</small></div>' +
    '<div class="akxu-pin akxu-p2"><div class="akxu-tape" style="transform:translateX(-50%) rotate(-4deg)"></div>' +
    '<svg width="54" height="44" viewBox="0 0 54 44"><path d="M27 10c-5-4-12-4-17-2v26c5-2 12-2 17 2 5-4 12-4 17-2V8c-5-2-12-2-17 2Z" fill="none" stroke="#2A66A6" stroke-width="2.4" stroke-linejoin="round"/><path d="M27 10v26" stroke="#2A66A6" stroke-width="2.4"/></svg>' +
    '<small>libraries</small></div>' +
    '<div class="akxu-pin akxu-p3"><div class="akxu-tape" style="transform:translateX(-50%) rotate(2deg)"></div>' +
    '<svg width="54" height="44" viewBox="0 0 54 44"><path d="M9 20 27 8l18 12" fill="none" stroke="#1F7C74" stroke-width="2.4" stroke-linejoin="round"/><path d="M13 20v16h28V20M22 36V26h10v10" fill="none" stroke="#1F7C74" stroke-width="2.4" stroke-linejoin="round"/></svg>' +
    '<small>halls</small></div>';

  /* ------------------------------------------------------------------ */
  function build(mount) {
    mount.innerHTML =
      '<div class="akxu-ban">' +
        '<div class="akxu-head"><h3 class="akxu-h">' + HEADLINE + '</h3>' +
          '<span class="akxu-mark">' + MARK + '</span></div>' +
        '<div class="akxu-snaps">' + SNAPS + '</div>' +
        '<div class="akxu-trail">' + TRAIL + '</div>' +
        '<div class="akxu-cta">' + CTA_PRE +
          '<a href="' + WHATSAPP + '" target="_blank" rel="noopener">WhatsApp</a>' +
          ' &amp; <a href="' + ENEWS + '" target="_blank" rel="noopener">eNews</a></div>' +
        '<div class="akxu-help">' + HELP + '<a href="' + HELP_URL + '">Get in touch</a></div>' +
      '</div>';
    mount.setAttribute('data-akx-done', '1');
  }

  function init() {
    var mounts = [].slice.call(document.querySelectorAll('#akx-popups, .akx-popups'))
                   .filter(function (m) { return m.getAttribute('data-akx-done') !== '1'; });
    if (!mounts.length) return;
    injectCSS();
    mounts.forEach(function (m) {
      try { build(m); }
      catch (e) { if (window.console) console.warn('[akx-popups] build failed', e); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

