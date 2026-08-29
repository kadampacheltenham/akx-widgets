/* ===========================================================================
   akx start-at-home.js — "Get started at home" showcase cards
   Akanishta Kadampa Buddhist Centre · v1.0 · 29 Aug 2026

   One hosted file for the three cards. Edit them here and every page that
   carries the block follows — Start Here and all six branch pages.

   EMBED:
     <div id="akx-starthome"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/start-at-home.js?v=1" defer></script>

   OPTIONS on the mount:
     data-eyebrow="..."   override the small coral line above the row

   Content and images taken verbatim from the live /start-here block, 29 Aug 2026.
   Cards flip on tap/hover to show the graphic and the action buttons.

   NOTE — two links were EMPTY on the live block (the "Watch now" and
   "Listen now" buttons did nothing). Living Clarity is set below from the
   block's own header comment; the podcast URL still needs supplying.

   CACHE: GitHub Pages caches this file. Load with ?v=n and bump after a commit.
   =========================================================================== */
(function () {
  'use strict';

  var IMG = 'https://kadampacheltenham.github.io/akx-widgets/';

  var EYEBROW = 'Get started at home — or anywhere!';

  var CARDS = [
    {
      eye: 'Meditation app',
      title: 'Modern Buddhism',
      teaser: 'A 100% free app to help you begin to meditate — calm, compassion and clarity in daily life.',
      gfx: IMG + 'mb-med-app.png',
      links: [
        { label: 'App Store ↗',   href: 'https://apps.apple.com/app/apple-store/id6751805356' },
        { label: 'Google Play ↗', href: 'https://play.google.com/store/apps/details?id=org.kadampa.modernbuddhism' }
      ]
    },
    {
      eye: 'Watch',
      title: 'The Modern Buddhism Podcast',
      teaser: 'Everyday wisdom for everyday life — real conversations, anytime.',
      gfx: IMG + 'images/mb-podcast.png',
      links: [
        { label: 'Watch now ↗', href: '' }        // <<< NEEDS THE YOUTUBE URL
      ]
    },
    {
      eye: 'Listen',
      title: 'Living Clarity',
      teaser: 'Inspiration wherever you are — now with more teachings, more teachers & on more platforms.',
      gfx: IMG + 'images/living-clarity.jpg',
      links: [
        { label: 'Listen now ↗', href: 'https://kadampa.org/listen' }
      ]
    }
  ];

  /* one scope, applied to whichever mount id the page uses */
  var S = '#akx-sh,#akx-starthome';
  var D = function (sel) { return '#akx-sh ' + sel + ',#akx-starthome ' + sel; };

  var CSS = [
    S + '{--coral:#E2886A;font-family:inherit;color:#1D1D1F;max-width:1040px;margin:0 auto}',
    D('*') + '{box-sizing:border-box}',
    D('.eyebrow') + '{font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--coral);text-align:center;margin:0 0 20px}',
    D('.row') + '{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;align-items:stretch}',
    D('.sc') + '{position:relative;border-radius:14px;overflow:hidden;cursor:pointer;min-height:200px;box-shadow:0 1px 6px rgba(29,29,31,.08);background:#FBF6ED;display:flex}',
    D('.face') + '{position:relative;flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:20px 20px 18px;gap:7px;transition:opacity .45s ease}',
    D('.eye') + '{font-size:10.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#C69A3E}',
    D('h3') + '{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:23px;line-height:1.05;color:#2A66A6;margin:1px 0 2px}',
    D('.teaser') + '{font-size:12.5px;line-height:1.5;color:#5B5B5B;margin:0;max-width:34ch}',
    D('.tap') + '{margin-top:5px;font-size:11.5px;font-weight:600;color:var(--coral)}',
    D('.back') + '{position:absolute;inset:0;transform:translateY(100%);transition:transform .5s cubic-bezier(.4,0,.2,1)}',
    D('.gfx') + '{position:absolute;inset:0;background-size:cover;background-position:center}',
    D('.cap') + '{position:absolute;left:0;right:0;bottom:0;padding:26px 14px 12px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;background:linear-gradient(to top,rgba(15,22,32,.6),rgba(15,22,32,0))}',
    D('.cap a') + '{font-size:12px;font-weight:700;background:rgba(255,255,255,.94);color:#1D1D1F;border-radius:999px;padding:8px 13px;text-decoration:none;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.18)}',
    D('.cap a:hover') + '{background:#fff}',
    D('.sc.open .back') + ',' + D('.sc:hover .back') + '{transform:translateY(0)}',
    D('.sc.open .face') + ',' + D('.sc:hover .face') + '{opacity:0}',
    '@media(hover:none){' + D('.sc:hover .back') + '{transform:translateY(100%)}' +
      D('.sc:hover .face') + '{opacity:1}' +
      D('.sc.open .back') + '{transform:translateY(0)}' +
      D('.sc.open .face') + '{opacity:0}}',
    '@media(max-width:820px){' + D('.row') + '{grid-template-columns:1fr;gap:16px}' +
      D('.sc') + '{min-height:190px}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('akx-sh-css')) return;
    var s = document.createElement('style');
    s.id = 'akx-sh-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function render(mount) {
    if (mount.getAttribute('data-akx-done') === '1') return;
    var eyebrow = mount.getAttribute('data-eyebrow') || EYEBROW;
    var html = '<p class="eyebrow">' + esc(eyebrow) + '</p><div class="row">';

    CARDS.forEach(function (c) {
      var caps = c.links.filter(function (l) { return l.href; })
        .map(function (l) {
          return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>';
        }).join('');
      if (!caps && window.console) {
        console.warn('[akx-start-at-home] "' + c.title + '" has no link yet — its button is hidden.');
      }
      html +=
        '<div class="sc" tabindex="0">' +
          '<div class="face">' +
            '<span class="eye">' + esc(c.eye) + '</span>' +
            '<h3>' + esc(c.title) + '</h3>' +
            '<p class="teaser">' + esc(c.teaser) + '</p>' +
            '<span class="tap">Tap to preview →</span>' +
          '</div>' +
          '<div class="back"><div class="gfx" style="background-image:url(' + c.gfx + ')"></div>' +
            (caps ? '<div class="cap">' + caps + '</div>' : '') +
          '</div>' +
        '</div>';
    });

    mount.innerHTML = html + '</div>';
    mount.setAttribute('data-akx-done', '1');

    /* tap to flip on touch; Enter/Space for keyboards */
    mount.addEventListener('click', function (e) {
      var card = e.target.closest('.sc');
      if (!card || e.target.closest('a')) return;
      card.classList.toggle('open');
    });
    mount.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var card = e.target.closest('.sc');
      if (!card) return;
      e.preventDefault(); card.classList.toggle('open');
    });
  }

  function init() {
    var mounts = [].slice.call(document.querySelectorAll('#akx-starthome, #akx-sh, .akx-starthome'));
    if (!mounts.length) return;
    injectCSS();
    mounts.forEach(render);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
