/* ===========================================================================
   akx lotus-benefits.js — the three lotus benefits
   Akanishta Kadampa Buddhist Centre · v1.0 · 29 Aug 2026

   One hosted file. Edit the three benefits here and every page that carries
   the block follows — homepage, Start Here, all six branch pages.

   EMBED:
     <div id="akx-lotus"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/lotus-benefits.js?v=1" defer></script>

   OPTIONS on the mount:
     data-heading="Why meditate"   optional heading above the row; omit for none

   Content taken verbatim from the live homepage block, 29 Aug 2026.
   CACHE: GitHub Pages caches this file. Load with ?v=n and bump after a commit.
   =========================================================================== */
(function () {
  'use strict';

  var LOTUS = 'https://static1.squarespace.com/static/6a5a0b51083f343e9628d66e/t/6a5ba67a42763156df7f1739/1784391290902/Transparent+Golden+Lotus.png';

  var BENEFITS = [
    { title: 'Feel calmer',              sub: 'and less overwhelmed by daily life' },
    { title: 'Learn practical techniques', sub: 'you can use anywhere, anytime' },
    { title: 'Meet a friendly community', sub: 'Join us as often or little as you like' }
  ];

  var CSS = [
    '.benefits-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;',
    'max-width:1000px;margin:0 auto;text-align:center;font-family:inherit}',
    '.benefits-grid .bn img{width:105px;height:auto;display:block;margin:0 auto 12px}',
    '.benefits-grid .bn h3{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:1.15rem;',
    'color:#1D1D1F;margin:0 0 6px;line-height:1.25}',
    '.benefits-grid .bn p{margin:0;font-size:.95rem;line-height:1.5;color:#5B5B5B}',
    '.akx-lotus-h{font-family:Fraunces,Georgia,serif;font-size:1.6rem;color:#2A66A6;',
    'text-align:center;margin:0 0 26px}',
    '@media(max-width:680px){.benefits-grid{grid-template-columns:1fr;gap:26px}',
    '.akx-lotus-h{font-size:1.3rem;margin-bottom:20px}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('akx-lotus-css')) return;
    var s = document.createElement('style');
    s.id = 'akx-lotus-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function render(mount) {
    if (mount.getAttribute('data-akx-done') === '1') return;
    var heading = mount.getAttribute('data-heading');
    var html = heading ? '<h2 class="akx-lotus-h">' + esc(heading) + '</h2>' : '';
    html += '<div class="benefits-grid">';
    BENEFITS.forEach(function (b) {
      html += '<div class="bn"><img src="' + LOTUS + '" alt="" loading="lazy">' +
              '<h3>' + esc(b.title) + '</h3><p>' + esc(b.sub) + '</p></div>';
    });
    html += '</div>';
    mount.innerHTML = html;
    mount.setAttribute('data-akx-done', '1');
  }

  function init() {
    var mounts = [].slice.call(document.querySelectorAll('#akx-lotus, .akx-lotus'));
    if (!mounts.length) return;
    injectCSS();
    mounts.forEach(render);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
