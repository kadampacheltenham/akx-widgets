/* ===========================================================================
   akx social-cards.js  —  "Stay in touch" channel cards
   Akanishta Kadampa Buddhist Centre
   v1.0 · 29 Aug 2026

   ONE FILE, EVERY PAGE. Change a link or a line here and it updates
   everywhere the widget is embedded.

   EMBED (Squarespace Code Block):
     <div id="akx-social"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/social-cards.js" defer></script>

   OPTIONS (all optional, set on the mount div):
     data-heading="Stay in touch"     heading text; data-heading="" hides it
     data-channels="whatsapp,enews,facebook,instagram"
                                     which cards, in this order
     data-align="center"             "center" (default) or "left"

   Multiple mounts on one page are fine — use class="akx-social" instead of id.

   CACHE NOTE: GitHub Pages caches this file. After committing a change, load
   the page with ?v=n and hard-reload, or you will review a stale version.
   =========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     CONFIG — the only part that normally needs editing
     --------------------------------------------------------------------- */
  var CHANNELS = {

    whatsapp: {
      name: 'WhatsApp Channel',
      nameStyle: 'sans',                       // platform wordmark style
      note: 'Follow and tap 🔔 for notifications.',
      cta: 'Follow',
      ctaShort: 'Follow',                      // used on mobile
      url: 'https://whatsapp.com/channel/0029VbDgH5y0VycLdfp0MV35',
      badge: '',
      flash: 'New',                            // coral corner marker
      button: '#25D366',                       // exactly the icon green (Gen, 29 Aug)
      buttonInk: '#07301F',                    // dark ink — white on #25D366 is unreadable
      nameColour: '#111B21'
    },

    enews: {
      name: 'eNews',
      nameStyle: 'serif',                      // ours, so site type
      note: 'Updates from time to time with news &amp; events.',
      cta: 'Get eNews',
      ctaShort: 'Get eNews',
      url: '#ENEWS-URL-NEEDED',                // <<< Kit sign-up page URL
      badge: 'Popular',
      button: '#2A66A6',
      nameColour: '#2A66A6'
    },

    facebook: {
      name: 'facebook',
      nameStyle: 'fb',
      note: 'News, updates and occasional posts, stories &amp; reels.',
      cta: 'Follow',
      ctaShort: 'Follow',
      url: '#FACEBOOK-URL-NEEDED',             // <<< page URL
      badge: '',
      button: '#1877F2',
      nameColour: '#1877F2'
    },

    instagram: {
      name: 'Instagram',
      nameStyle: 'script',
      note: 'Posts, stories and reels from time to time.',
      cta: 'Follow',
      ctaShort: 'Follow',
      url: '#INSTAGRAM-URL-NEEDED',            // <<< profile URL
      badge: '',
      button: 'linear-gradient(45deg,#F58529,#DD2A7B 55%,#8134AF)',
      nameColour: '#262626'
    }
  };

  var DEFAULT_ORDER = ['whatsapp', 'enews', 'facebook', 'instagram'];
  var DEFAULT_HEADING = 'Stay in touch';

  /* ---------------------------------------------------------------------
     ICONS — official app tiles, unaltered. Do not restyle or recolour.
     --------------------------------------------------------------------- */
  var GRAD_ID = 'akxIgGrad';

  var ICONS = {
    whatsapp:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="11" fill="#25D366"/>' +
      '<g transform="translate(11.5,11.5) scale(1.042)"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.76-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></g></svg>',

    enews:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="11" fill="#2A66A6"/>' +
      '<g fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round">' +
      '<rect x="11" y="15" width="26" height="18" rx="3"/><path d="m11.8 16.6 12.2 9 12.2-9"/></g></svg>',

    facebook:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="11" fill="#1877F2"/>' +
      '<path fill="#fff" d="M31.9 27.9 33 20.7h-6.9V16c0-2 1-3.9 4.1-3.9h3.2V6s-2.9-.5-5.6-.5c-5.7 0-9.4 3.4-9.4 9.7v5.5h-6.3v7.2h6.3V48h7.7V27.9h5.8z"/></svg>',

    instagram:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="' + GRAD_ID + '" x1="0" y1="1" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#FEDA75"/><stop offset=".25" stop-color="#FA7E1E"/>' +
      '<stop offset=".5" stop-color="#D62976"/><stop offset=".75" stop-color="#962FBF"/>' +
      '<stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs>' +
      '<rect width="48" height="48" rx="11" fill="url(#' + GRAD_ID + ')"/>' +
      '<g fill="none" stroke="#fff" stroke-width="2.9"><rect x="11.5" y="11.5" width="25" height="25" rx="7.5"/>' +
      '<circle cx="24" cy="24" r="6.2"/></g><circle cx="31.8" cy="16.2" r="1.9" fill="#fff"/></svg>'
  };

  /* ---------------------------------------------------------------------
     Fonts — Grand Hotel is the open licensed face closest to Instagram's
     script (theirs isn't licensable). Loaded once, only if not present.
     --------------------------------------------------------------------- */
  function loadFonts() {
    if (document.getElementById('akx-social-fonts')) return;
    var l = document.createElement('link');
    l.id = 'akx-social-fonts';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Grand+Hotel&family=Inter:wght@700;800&display=swap';
    document.head.appendChild(l);
  }

  /* ---------------------------------------------------------------------
     Styles — injected once, all selectors namespaced .akxs-
     --------------------------------------------------------------------- */
  var CSS = [
    '.akxs-wrap{max-width:1040px;margin:0 auto;font-family:inherit}',
    '.akxs-h{font-family:Fraunces,Georgia,serif;font-size:1.75rem;color:#2A66A6;text-align:center;margin:0 0 1.5rem}',
    '.akxs-grid{display:grid;grid-template-columns:repeat(var(--akxs-cols,4),1fr);gap:16px;align-items:stretch}',
    '.akxs-card{position:relative;display:flex;flex-direction:column;text-align:center;',
    'background:#fff;border:1px solid #E6E6DF;border-radius:16px;padding:30px 18px 22px;',
    'text-decoration:none;color:inherit;transition:box-shadow .18s ease,transform .18s ease}',
    '.akxs-card:hover{box-shadow:0 6px 18px rgba(42,102,166,.10);transform:translateY(-2px)}',
    '.akxs-card:focus-visible{outline:2px solid #2A66A6;outline-offset:3px}',
    /* pinned label straddles the top edge so it can never touch the icon */
    '.akxs-pins{position:absolute;top:-11px;left:50%;transform:translateX(-50%);',
    'display:flex;gap:6px;align-items:center}',
    '.akxs-pin{white-space:nowrap;font-size:10.5px;font-weight:700;',
    'letter-spacing:.07em;text-transform:uppercase;padding:4px 12px;border-radius:999px;background:#fff}',
    '.akxs-pin{color:#8A6B3A;border:1px solid rgba(232,183,90,.60)}',
    '.akxs-icorow{position:relative;display:flex;justify-content:center;align-items:center}',
    '.akxs-flash{position:absolute;left:2px;top:50%;transform:translateY(-50%);',
    'font-family:Inter,Helvetica,Arial,sans-serif;font-size:11.5px;font-weight:700;',
    'letter-spacing:.10em;text-transform:uppercase;color:#4E9E58}',
    '.akxs-ico{width:66px;height:66px;margin:6px auto 16px}',
    '.akxs-ico svg{width:100%;height:100%;display:block}',
    '.akxs-nm{margin-bottom:9px;line-height:1}',
    '.akxs-nm.sans{font-family:Inter,Helvetica,Arial,sans-serif;font-weight:700;font-size:20px;letter-spacing:-.01em}',
    '.akxs-nm.fb{font-family:Inter,Helvetica,Arial,sans-serif;font-weight:800;font-size:20px;letter-spacing:-.045em}',
    '.akxs-nm.serif{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:20px}',
    '.akxs-nm.script{font-family:"Grand Hotel",cursive;font-size:26px;line-height:.9}',
    '.akxs-note{font-size:13px;color:#5C6672;line-height:1.4;min-height:36px;margin-bottom:16px;',
    'padding:0 2px;text-wrap:balance;text-wrap:pretty}',
    '.akxs-note:empty{min-height:0;margin-bottom:0}',
    '.akxs-cta{margin-top:auto;display:block;border-radius:999px;padding:11px 10px;',
    'font-family:Inter,Helvetica,Arial,sans-serif;font-weight:700;font-size:14px;color:#fff}',
    '.akxs-short{display:none}',
    '@media (max-width:900px){.akxs-grid{grid-template-columns:repeat(min(var(--akxs-cols,2),2),1fr);gap:14px}',
    '.akxs-card{padding:26px 12px 18px}.akxs-ico{width:54px;height:54px;margin-bottom:13px}',
    '.akxs-nm.sans,.akxs-nm.fb,.akxs-nm.serif{font-size:17px}.akxs-nm.script{font-size:22px}',
    '.akxs-note{font-size:11.2px;line-height:1.35;min-height:32px;margin-bottom:12px;padding:0}',
    '.akxs-cta{font-size:13px;padding:10px 8px}',
    '.akxs-pin{font-size:9px;padding:3px 8px;letter-spacing:.05em}',
    '.akxs-flash{font-size:9.5px;left:0;letter-spacing:.07em}',
    '.akxs-full{display:none}.akxs-short{display:inline}}',
    '@media (prefers-reduced-motion:reduce){.akxs-card{transition:none}.akxs-card:hover{transform:none}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('akx-social-css')) return;
    var s = document.createElement('style');
    s.id = 'akx-social-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------------------------------------------------------------------
     Render
     --------------------------------------------------------------------- */
  function cardHTML(key) {
    var c = CHANNELS[key];
    if (!c) return '';

    var pins = c.badge ? '<span class="akxs-pins"><span class="akxs-pin">' + c.badge + '</span></span>' : '';
    var flash = c.flash ? '<span class="akxs-flash">' + c.flash + '</span>' : '';

    var ready = c.url && c.url.charAt(0) !== '#';
    var href = ready ? ' href="' + c.url + '" target="_blank" rel="noopener"' : '';
    if (!ready && window.console) {
      console.warn('[akx-social] no URL set for "' + key + '" — card rendered without a link.');
    }

    return '<a class="akxs-card"' + href + '>' +
      pins +
      '<span class="akxs-icorow">' + flash + '<span class="akxs-ico">' + ICONS[key] + '</span></span>' +
      '<span class="akxs-nm ' + c.nameStyle + '" style="color:' + c.nameColour + '">' + c.name + '</span>' +
      '<span class="akxs-note">' + c.note + '</span>' +
      '<span class="akxs-cta" style="background:' + c.button + ';color:' + (c.buttonInk || '#fff') + '">' +
        '<span class="akxs-full">' + c.cta + '</span>' +
        '<span class="akxs-short">' + c.ctaShort + '</span>' +
      '</span>' +
    '</a>';
  }

  function render(mount) {
    if (mount.getAttribute('data-akx-done') === '1') return;

    var order = (mount.getAttribute('data-channels') || DEFAULT_ORDER.join(','))
      .split(',').map(function (s) { return s.trim().toLowerCase(); })
      .filter(function (s) { return CHANNELS[s]; });
    if (!order.length) order = DEFAULT_ORDER.slice();

    var headingAttr = mount.getAttribute('data-heading');
    var heading = headingAttr === null ? DEFAULT_HEADING : headingAttr;

    var cols = Math.min(order.length, 4);
    var html = '<div class="akxs-wrap">';
    if (heading) html += '<h2 class="akxs-h">' + heading + '</h2>';
    html += '<div class="akxs-grid" style="--akxs-cols:' + cols + '">';
    order.forEach(function (k) { html += cardHTML(k); });
    html += '</div></div>';

    mount.innerHTML = html;
    mount.setAttribute('data-akx-done', '1');
  }

  function init() {
    var mounts = [].slice.call(document.querySelectorAll('#akx-social, .akx-social'));
    if (!mounts.length) return;
    loadFonts();
    injectCSS();
    mounts.forEach(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
