/* Akanishta - ON-SITE BOOKING  v1.0 (22 Oct 2026)  marker AKXOB_V1_0
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

   SETTINGS
   - START: first event date that uses the pop-up. '' = every event.
*/
(function(){
  if(window.AKXBook) return;
  var START = '2027-01-01';
  var BOX = 'akanishtakadampabuddhistcentre', DOMAIN = 'tickets.meditationincheltenham.org.uk', REF = 'website_widget';

  var CSS = ''
    + 'dialog#akx-book{border:0;padding:0;border-radius:18px;width:min(760px,94vw);max-width:94vw;max-height:90vh;background:#fff;color:#26303A;box-shadow:0 30px 80px rgba(0,0,0,.35);overflow:hidden;}'
    + 'dialog#akx-book[open]{display:flex;flex-direction:column;height:min(860px,90vh);}'
    + 'dialog#akx-book::backdrop{background:rgba(20,28,36,.55);}'
    + '#akx-book .bh{flex:none;display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid #efe8da;font:600 1rem/1.3 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#26303A;text-align:left;}'
    + '#akx-book .bt{flex:1;min-width:0;}'
    + '#akx-book .bx{flex:none;border:0;margin:0;padding:0;background:#F3EEE4;border-radius:999px;width:36px;height:36px;font:400 20px/36px Inter,system-ui,sans-serif;text-align:center;cursor:pointer;color:#26303A;}'
    + '#akx-book .bb{flex:1;min-height:0;padding:0 24px;overflow:hidden;}'
    + '#akx-book .bb iframe{display:block;width:100%;height:100%;border:0;}'
    + '@media(max-width:640px){dialog#akx-book,dialog#akx-book[open]{width:100vw;max-width:100vw;height:100%;max-height:100%;margin:0;border-radius:0;}#akx-book .bb{padding:0 16px;}}';

  var dlg = null;
  function supported(){ var d = document.createElement('dialog'); return typeof d.showModal === 'function'; }
  function build(){
    if(dlg) return dlg;
    var st = document.createElement('style'); st.id = 'akx-book-style'; st.textContent = CSS; document.head.appendChild(st);
    dlg = document.createElement('dialog'); dlg.id = 'akx-book'; dlg.setAttribute('aria-label', 'Book');
    dlg.innerHTML = '<div class="bh"><span class="bt"></span><button type="button" class="bx" aria-label="Close">\u00d7</button></div><div class="bb"></div>';
    document.body.appendChild(dlg);
    function clear(){ dlg.querySelector('.bb').innerHTML = ''; }
    function shut(){ if(dlg.open) dlg.close(); clear(); }
    dlg.querySelector('.bx').addEventListener('click', shut);
    dlg.addEventListener('click', function(e){ if(e.target === dlg) shut(); });
    dlg.addEventListener('close', function(){ if(!dlg.open) clear(); });
    return dlg;
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
    var f = document.createElement('iframe');
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
  window.AKXBook = { open: open, version: '1.0', start: START };
})();
