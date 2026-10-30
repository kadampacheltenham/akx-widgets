/* Akanishta - ON-SITE BOOKING  v1.2 (30 Oct 2026)  marker AKXOB_V1_2
   v1.2: a promo-code line under the title ("Have a promo code? Choose your tickets, then add it on the
         next page.") - Ticket Tailor only shows its code box after tickets are chosen. The line hides
         once the checkout moves on to its next page, and shows again each time the pop-up opens.
   v1.1: on for every event (START = ''); direct booking links (see DIRECT LINKS below).
         Apple Pay shows inside the pop-up in Safari (checked 23 Oct) once both domains were added in
         Stripe > Settings > Payments > Payment method domains.
   v1.0 (22 Oct 2026): first version, events from 1 Jan 2027 only.
   "Book" buttons open Ticket Tailor's checkout in a pop-up on our own page, so visitors stay on the site.
   Tested 22 Oct 2026 on a hidden test event, desktop and iPhone ("A v2"): Ticket Tailor's booking page
   in a plain frame inside our pop-up - no Ticket Tailor widget script, so nothing clashes with the
   "Send us a message" box.

   HOW IT WORKS
   - cr-events.js (v2.6+) and featured-events.js (v1.3+) mark their Ticket Tailor Book links with
       data-akx-book="<Ticket Tailor event number>"  data-akx-title="<event title>"  data-akx-date="YYYY-MM-DD"
     and load this file when they show such a link.
   - A click on a marked link opens the pop-up, only for events dated on or after START (below).
     Earlier events, ctrl/cmd/shift-clicks and browsers without pop-up support keep the normal link (new tab).
   - The pop-up goes straight to ticket selection. Bookings are tagged "website_widget" in Ticket Tailor.
   - Close with the round x, the Esc key, or a click outside the box.

   DIRECT LINKS (one step to booking, e.g. for emails, posts and QR codes)
   - Add #book-<Ticket Tailor event number> to the address of a page that lists the event:
       https://www.meditationincheltenham.org.uk/courses-retreats#book-2488842
     The page opens with that event's booking pop-up already open (the card scrolls into view behind it).
     The number is the one at the end of the event's Ticket Tailor link.
   - Works on pages whose widget shows Ticket Tailor Book buttons (Courses & Retreats, What's On).
   - Closing the pop-up removes #book-... from the address, so a refresh doesn't reopen it.

   SETTINGS
   - START: first event date that uses the pop-up. '' = every event.
*/
(function(){
  if(window.AKXBook) return;
  var START = '';
  var BOX = 'akanishtakadampabuddhistcentre', DOMAIN = 'tickets.meditationincheltenham.org.uk', REF = 'website_widget';

  var CSS = ''
    + 'dialog#akx-book{border:0;padding:0;border-radius:18px;width:min(760px,94vw);max-width:94vw;max-height:90vh;background:#fff;color:#26303A;box-shadow:0 30px 80px rgba(0,0,0,.35);overflow:hidden;}'
    + 'dialog#akx-book[open]{display:flex;flex-direction:column;height:min(860px,90vh);}'
    + 'dialog#akx-book::backdrop{background:rgba(20,28,36,.55);}'
    + '#akx-book .bh{flex:none;display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid #efe8da;font:600 1rem/1.3 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#26303A;text-align:left;}'
    + '#akx-book .bt{flex:1;min-width:0;}'
    + '#akx-book .bx{flex:none;border:0;margin:0;padding:0;background:#F3EEE4;border-radius:999px;width:36px;height:36px;font:400 20px/36px Inter,system-ui,sans-serif;text-align:center;cursor:pointer;color:#26303A;}'
    + '#akx-book .bp{flex:none;display:flex;align-items:center;gap:10px;padding:10px 18px;background:#F8F1E9;border-bottom:1px solid #efe8da;font:400 14px/1.4 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#26303A;text-align:left;}'
    + '#akx-book .bp b{font-weight:600;}'
    + '#akx-book .bp svg{flex:none;}'
    + '#akx-book .bp[hidden]{display:none;}'
    + '#akx-book .bb{flex:1;min-height:0;padding:0 24px;overflow:hidden;}'
    + '#akx-book .bb iframe{display:block;width:100%;height:100%;border:0;}'
    + '@media(max-width:640px){dialog#akx-book,dialog#akx-book[open]{width:100vw;max-width:100vw;height:100%;max-height:100%;margin:0;border-radius:0;}#akx-book .bb{padding:0 16px;}#akx-book .bp{padding:10px 16px;font-size:13.5px;}}';

  // small tag icon for the promo-code line (coral, like the site's accents)
  var TAG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E2886A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>';

  var dlg = null;
  function supported(){ var d = document.createElement('dialog'); return typeof d.showModal === 'function'; }
  function build(){
    if(dlg) return dlg;
    var st = document.createElement('style'); st.id = 'akx-book-style'; st.textContent = CSS; document.head.appendChild(st);
    dlg = document.createElement('dialog'); dlg.id = 'akx-book'; dlg.setAttribute('aria-label', 'Book');
    dlg.innerHTML = '<div class="bh"><span class="bt"></span><button type="button" class="bx" aria-label="Close">\u00d7</button></div>'
      + '<div class="bp">' + TAG + '<span><b>Have a promo code?</b> Choose your tickets, then add it on the next page.</span></div>'
      + '<div class="bb"></div>';
    document.body.appendChild(dlg);
    function clear(){ dlg.querySelector('.bb').innerHTML = ''; dropHash(); }
    function shut(){ if(dlg.open) dlg.close(); clear(); }
    dlg.querySelector('.bx').addEventListener('click', shut);
    dlg.addEventListener('click', function(e){ if(e.target === dlg) shut(); });
    dlg.addEventListener('close', function(){ if(!dlg.open) clear(); });
    return dlg;
  }
  // remove a direct-link #book-... from the address once the pop-up closes
  function dropHash(){
    if(/^#book-\d+$/.test(location.hash || '') && window.history && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
  }
  // Ticket Tailor's booking page for the event; keeps any extra settings from the original link (e.g. a code)
  function frameUrl(id, href){
    var q = 'ref=' + REF + '&widget=true&minimal=true&show_logo=false&bg_fill=false';
    try {
      new URL(href, location.href).searchParams.forEach(function(v, k){
        if(!/^(ref|widget|minimal|show_logo|bg_fill)$/i.test(k)) q += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(v);
      });
    } catch(e){}
    return 'https://' + DOMAIN + '/events/' + BOX + '/' + id + '/book?' + q;
  }
  function open(id, title, href){
    var d = build();
    d.querySelector('.bt').textContent = title ? 'Book: ' + title : 'Book';
    var body = d.querySelector('.bb'); body.innerHTML = '';
    var hint = d.querySelector('.bp'); hint.hidden = false;      // promo-code line: shown on the first page only
    var loads = 0;
    var f = document.createElement('iframe');
    f.addEventListener('load', function(){ loads++; if(loads > 1) hint.hidden = true; });
    f.src = frameUrl(id, href || ''); f.title = title ? 'Book ' + title : 'Booking';
    f.setAttribute('allow', 'payment; fullscreen');
    body.appendChild(f);
    if(!d.open) d.showModal();
  }
  document.addEventListener('click', function(e){
    if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = (e.target && e.target.closest) ? e.target.closest('a[data-akx-book]') : null; if(!a) return;
    var id = a.getAttribute('data-akx-book') || '', day = a.getAttribute('data-akx-date') || '';
    if(!/^\d+$/.test(id)) return;
    if(START && !(day && day >= START)) return;        // earlier events keep the normal link
    if(!supported()) return;                           // very old browsers keep the normal link
    e.preventDefault();
    open(id, a.getAttribute('data-akx-title') || '', a.getAttribute('href'));
  });
  // bring the event's card into view behind the pop-up (instant: the site's smooth scrolling gets interrupted)
  function reveal(a){
    try { a.scrollIntoView({ block: 'center', behavior: 'instant' }); } catch(e){ try { a.scrollIntoView(); } catch(e2){} }
  }
  // Direct links: #book-<event number> in the address opens that event's booking straight away
  function fromHash(){
    var m = /^#book-(\d+)$/.exec(location.hash || '');
    if(!m || !supported()) return;
    var a = document.querySelector('a[data-akx-book="' + m[1] + '"]');
    if(a) reveal(a);
    open(m[1], a ? (a.getAttribute('data-akx-title') || '') : '', a ? a.getAttribute('href') : '');
  }
  window.addEventListener('hashchange', fromHash);
  window.AKXBook = { open: open, version: '1.2', start: START };
  fromHash();
})();
