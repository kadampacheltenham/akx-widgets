/* Akanishta — Week at a glance widget (v3: minimal rows, Details expand, mobile tags+loc line).
   Include with: <div id="akx-glance"></div>
                 <script src="https://kadampacheltenham.github.io/akx-widgets/glance.js" defer></script> */
(function(){
  var MOUNT_ID='akx-glance';
  var STYLE=String.raw`
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap');
  :root{--ink:#2B2A28;--red:#C8102E;--teal:#4E938C;}
  *{box-sizing:border-box;}
  body{font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:0;background:#fff;color:var(--ink);padding:36px 24px;}
  .wag{margin:0 auto;}
  .wag-h{text-align:center;font-size:1.9rem;font-weight:600;color:#2E7C7C;margin:0 0 6px;}
  .lead{text-align:center;color:#6f6a62;font-size:1.02rem;margin:0 0 16px;}
  .wag-closed{display:flex;flex-wrap:wrap;align-items:baseline;gap:5px 14px;justify-content:center;background:#EEEBE4;border:1px solid #DBD5C8;border-radius:10px;padding:11px 20px;margin:0 0 20px;}
  .wag-closed .cl-head{font-size:.78rem;font-weight:700;letter-spacing:.03em;color:#7A7261;}
  .wag-closed .cl-dates{font-size:.9rem;color:#6f6a62;} .wag-closed .cl-dates b{color:#4a463f;font-weight:600;} .wag-closed .cl-sep{color:#c3bcac;padding:0 6px;}
  .toolbar{display:flex;justify-content:flex-end;margin:0 0 8px;}
  .xall{background:none;border:1.5px solid #dcd6ca;border-radius:999px;padding:6px 15px;font-size:.82rem;font-weight:600;color:var(--teal);cursor:pointer;}
  .tbl{border:1px solid #ece7dd;border-radius:14px;background:#fff;box-shadow:0 3px 14px rgba(0,0,0,.05);overflow:hidden;}
  .r{border-top:1px solid #f0ece3;} .r:first-child{border-top:none;}
  .rh{display:flex;align-items:center;gap:16px;padding:14px 20px;cursor:pointer;}
  .dt{flex:0 0 74px;display:flex;flex-direction:column;}
  .dt .day{font-family:'Oswald',sans-serif;color:var(--red);font-weight:700;font-size:1.12rem;line-height:1;}
  .dt .time{font-family:'Oswald',sans-serif;color:var(--ink);font-weight:500;font-size:.84rem;margin-top:3px;}
  .meta{flex:1;min-width:0;display:flex;align-items:center;gap:6px 9px;flex-wrap:wrap;}
  .nm{font-weight:700;font-size:1rem;color:var(--ink);} .nm .dur{font-weight:500;color:#9a948b;font-size:.85rem;}
  .rtags{display:contents;}
  .ptag{font-size:.66rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;padding:3px 9px;border-radius:999px;white-space:nowrap;}
  .t-main{background:rgba(10,151,255,.16);color:#0A6FBF;} .t-drop{background:#D2E9E4;color:#227C74;} .t-start{background:#D6EFCB;color:#3B8B2E;}
  .t-ya{background:#E7DDF7;color:#6A38B0;} .t-branch{background:#F6E6C2;color:#A5741A;} .t-neutral{background:#ECE3D2;color:#8A7647;} .t-depth{background:#F0DCE0;color:#7B2D3A;} .t-enrol{background:#E7DFF0;color:#6E5A86;}
  .loc{font-size:.85rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;white-space:nowrap;flex:0 0 auto;} .loc svg{width:11px;height:11px;} .loc.chelt{color:#5A5A5A;} .loc.ciren{color:#5B8C1A;}
  .det{flex:0 0 auto;align-self:center;border:1.5px solid #d9e3e0;background:#fff;color:var(--teal);font-size:.82rem;font-weight:700;padding:7px 14px;border-radius:999px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:6px;}
  .det .chev{font-size:.66rem;transition:transform .2s;}
  .r.open .det{background:#EEF5F3;border-color:#bcd8d2;} .r.open .det .chev{transform:rotate(180deg);}
  .rd{display:none;padding:0 20px 16px 90px;}
  .r.open .rd{display:block;}
  .rd .sum{font-size:.93rem;color:#5A5A5A;line-height:1.55;margin-bottom:12px;} .rd .sum .sep{color:#cfc8bc;padding:0 6px;}
  .cta{display:inline-block;background:#E4F1E7;color:#0B7A3B;border:1px solid #C4E1CC;font-weight:600;font-size:.84rem;text-decoration:none;padding:8px 16px;border-radius:999px;}
  .cta.coral{background:#F8E8DF;color:#B85C37;border-color:#EDCDBD;}

  @media(max-width:640px){
    .rh{display:grid;grid-template-columns:52px 1fr auto;grid-template-areas:"day name det" "day meta meta";column-gap:10px;row-gap:6px;padding:13px 16px;align-items:center;}
    .dt{grid-area:day;align-self:start;}
    .nm{grid-area:name;}
    .det{grid-area:det;padding:6px 12px;font-size:.78rem;}
    .meta{grid-area:meta;gap:5px 7px;}
    .meta .ptag{font-size:.61rem;padding:2px 8px;letter-spacing:.02em;}
    .meta .loc{font-size:.8rem;}
    .rd{padding:0 16px 14px 16px;}
  }
`;
  var HTML =String.raw`<div class="wag">
  <h2 class="wag-h">The week at a glance</h2>
  <p class="lead">Drop-in classes run most weeks. Tap a class for details.</p>
  <div class="wag-closed"><span class="cl-head">PLEASE NOTE — WE'RE CLOSED ON THESE DATES (2026)</span><span class="cl-dates"><b>22 Jul&ndash;16 Aug</b><span class="cl-sep">&middot;</span><b>9&ndash;15 Oct</b><span class="cl-sep">&middot;</span><b>27&ndash;29 Nov</b><span class="cl-sep">&middot;</span><b>15 Dec&ndash;1 Jan</b></span></div>
  <div class="toolbar"><button class="xall">Expand all ▾</button></div>
  <div class="tbl" id="tbl">

    <div class="r"><div class="rh"><div class="dt"><span class="day">Mon</span><span class="time">12:30</span></div><span class="nm">Simply Meditate <span class="dur">(30 min)</span></span><span class="meta"><span class="rtags"><span class="ptag t-drop">Drop-in</span><span class="ptag t-start">Get started</span></span><span class="loc chelt"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span></span><button class="det">Details <span class="chev">▾</span></button></div>
      <div class="rd"><div class="sum">Come as you are<span class="sep">|</span>Reduce stress and cultivate inner peace<span class="sep">|</span>Check term dates or calendar</div><a class="cta" href="#">Get directions →</a></div></div>

    <div class="r"><div class="rh"><div class="dt"><span class="day">Mon</span><span class="time">18:30</span></div><span class="nm">Evening meditation class <span class="dur">(75 min)</span></span><span class="meta"><span class="rtags"><span class="ptag t-main">Main class</span><span class="ptag t-drop">Drop-in</span></span><span class="loc chelt"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span></span><button class="det">Details <span class="chev">▾</span></button></div>
      <div class="rd"><div class="sum">One-off talks &amp; short series on a theme or topic<span class="sep">|</span>Includes talk &amp; two guided meditations</div><a class="cta" href="#">Get directions →</a></div></div>

    <div class="r"><div class="rh"><div class="dt"><span class="day">Tue</span><span class="time">10:30</span></div><span class="nm">Daytime meditation class <span class="dur">(75 min)</span></span><span class="meta"><span class="rtags"><span class="ptag t-main">Main class</span><span class="ptag t-drop">Drop-in</span></span><span class="loc chelt"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span></span><button class="det">Details <span class="chev">▾</span></button></div>
      <div class="rd"><div class="sum">The same weekly class in a daytime slot.</div><a class="cta" href="#">Get directions →</a></div></div>

    <div class="r"><div class="rh"><div class="dt"><span class="day">Wed</span><span class="time">19:00</span></div><span class="nm">Young Adults <span class="dur">(60 min)</span></span><span class="meta"><span class="rtags"><span class="ptag t-ya">Young Adults</span><span class="ptag t-drop">Drop-in</span></span><span class="loc chelt"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span></span><button class="det">Details <span class="chev">▾</span></button></div>
      <div class="rd"><div class="sum">For young adults 18+<span class="sep">|</span>Check programme or calendar for dates</div><a class="cta" href="#">Get directions →</a></div></div>

    <div class="r"><div class="rh"><div class="dt"><span class="day">Thu</span><span class="time">18:30</span></div><span class="nm">Cirencester evening class <span class="dur">(75 min)</span></span><span class="meta"><span class="rtags"><span class="ptag t-drop">Drop-in</span><span class="ptag t-branch">Branch class</span></span><span class="loc ciren"><svg viewBox="0 0 24 24" fill="#6DBE45"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cirencester</span></span><button class="det">Details <span class="chev">▾</span></button></div>
      <div class="rd"><div class="sum">Talks &amp; meditations following a theme<span class="sep">|</span>Check programme or calendar for dates</div><a class="cta" href="#">Get directions →</a></div></div>

    <div class="r"><div class="rh"><div class="dt"><span class="day">Fri</span><span class="time">12:00</span></div><span class="nm">Free taster meditation <span class="dur">(15 min)</span></span><span class="meta"><span class="rtags"><span class="ptag t-start">Perfect for beginners</span><span class="ptag t-drop">Drop-in</span></span><span class="loc chelt"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span></span><button class="det">Details <span class="chev">▾</span></button></div>
      <div class="rd"><div class="sum">A great place to get started for beginners<span class="sep">|</span>Come as you are<span class="sep">|</span>Guided meditation</div><a class="cta" href="#">Get directions →</a></div></div>

    <div class="r"><div class="rh"><div class="dt"><span class="day">Sat</span><span class="time">10:00</span></div><span class="nm">Weekend courses &amp; retreats</span><span class="meta"><span class="rtags"><span class="ptag t-neutral">Half-day</span><span class="ptag t-neutral">Day</span></span><span class="loc chelt"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span></span><button class="det">Details <span class="chev">▾</span></button></div>
      <div class="rd"><div class="sum">Day &amp; half-day courses and retreats throughout the year.</div><a class="cta coral" href="#">Courses &amp; retreats →</a></div></div>

    <div class="r"><div class="rh"><div class="dt"><span class="day">Sun</span><span class="time">09:30</span></div><span class="nm">Teacher Training (TTP)</span><span class="meta"><span class="rtags"><span class="ptag t-depth">In-depth</span><span class="ptag t-enrol">Enrolment required</span></span><span class="loc chelt"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span></span><button class="det">Details <span class="chev">▾</span></button></div>
      <div class="rd"><div class="sum">In-depth training for those wishing to train as meditation teachers<span class="sep">|</span>Not a drop-in class</div><a class="cta coral" href="#">More information →</a></div></div>

    <div class="r"><div class="rh"><div class="dt"><span class="day">Sun</span><span class="time">15:00</span></div><span class="nm">Foundation Programme (FP)</span><span class="meta"><span class="rtags"><span class="ptag t-depth">In-depth</span><span class="ptag t-enrol">Enrolment required</span></span><span class="loc chelt"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span></span><button class="det">Details <span class="chev">▾</span></button></div>
      <div class="rd"><div class="sum">Go further<span class="sep">|</span>In-depth structured study &amp; meditation<span class="sep">|</span>Not a drop-in class</div><a class="cta coral" href="#">More information →</a></div></div>

  </div>
</div>`;
  function init(){
    var mount=document.getElementById(MOUNT_ID); if(!mount) return;
    if(mount.getAttribute('data-akx-done')==='1') return;
    if(!document.getElementById('akx-glance-style')){var st=document.createElement('style');st.id='akx-glance-style';st.textContent=STYLE;document.head.appendChild(st);}
    mount.innerHTML=HTML; mount.setAttribute('data-akx-done','1'); wire(mount);
  }
  function wire(root){
    root.querySelectorAll('.rh').forEach(function(h){h.addEventListener('click',function(){h.parentNode.classList.toggle('open');});});
      root.querySelector('.xall').addEventListener('click',function(){var rows=root.querySelectorAll('.r');var anyClosed=[].some.call(rows,function(r){return !r.classList.contains('open');});rows.forEach(function(r){r.classList.toggle('open',anyClosed);});this.textContent=anyClosed?'Collapse all ▴':'Expand all ▾';});
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
