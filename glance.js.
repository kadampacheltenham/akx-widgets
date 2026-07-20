/* Akanishta — Week at a glance widget.
   Single source of truth. Host this file (e.g. Cloudflare Pages) and include it on any site with:
     <div id="akx-glance"></div>
     <script src="https://YOURPROJECT.pages.dev/glance.js" defer></script>
   Edit THIS file to update the glance everywhere it is embedded. */
(function(){
  var MOUNT_ID = 'akx-glance';
  var STYLE = String.raw`
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap');
  *{box-sizing:border-box;}
  body{font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:0;background:#fff;color:#1D1D1F;padding:44px 24px;}
  .wag-wrap{max-width:940px;margin:0 auto;}
  .wag-h{text-align:center;font-size:1.9rem;font-weight:600;color:#2E7C7C;margin:0 0 8px;}
  .wag-lead{text-align:center;color:#6f6a62;font-size:1.04rem;margin:0 0 18px;}

  .wag-closed{display:none;flex-wrap:wrap;align-items:baseline;gap:5px 14px;justify-content:center;
             background:#EEEBE4;border:1px solid #DBD5C8;border-radius:10px;padding:11px 20px;margin:0 auto 26px;max-width:840px;}
  .wag-closed .cl-head{font-size:.78rem;font-weight:700;letter-spacing:.03em;color:#7A7261;}
  .wag-closed .cl-dates{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 4px;font-size:.9rem;color:#6f6a62;}
  .wag-closed .cl-dates .cl-d{white-space:nowrap;color:#4a463f;font-weight:600;}
  .wag-closed .cl-dates .cl-sep{color:#c3bcac;padding:0 6px;}

  .day-grp{border:1px solid #ece7dd;border-radius:14px;background:#fff;box-shadow:0 3px 14px rgba(0,0,0,.045);overflow:hidden;margin-bottom:12px;}
  .day-grp:last-child{margin-bottom:0;}
  .sess{display:grid;grid-template-columns:122px 1fr;}
  .sess + .sess{border-top:1px dashed #efe9df;}

  /* calendar rail — day dominant, time centred under it */
  .lc{padding:16px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
  .lc .day{font-family:'Oswald','Arial Narrow',sans-serif;color:#C8102E;font-weight:700;font-size:1.74rem;line-height:.95;}
  .lc .time{font-family:'Oswald','Arial Narrow',sans-serif;color:#1D1D1F;font-weight:500;font-size:.86rem;line-height:1;margin-top:8px;}
  .lc .day.blank{visibility:hidden;}

  .content{padding:14px 20px 16px 16px;display:flex;flex-direction:column;gap:7px;min-width:0;}
  .c-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
  .c-tags{display:flex;flex-wrap:wrap;gap:6px;}
  .c-tag{font-size:.69rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;padding:4px 11px;border-radius:999px;white-space:nowrap;}
  .t-main{background:rgba(10,151,255,.16);color:#0A6FBF;}
  .t-drop{background:#D2E9E4;color:#227C74;}
  .t-start{background:#D6EFCB;color:#3B8B2E;}
  .t-ya{background:#E7DDF7;color:#6A38B0;}
  .t-branch{background:#F6E6C2;color:#A5741A;}
  .t-begin{background:#FBDDE9;color:#C43068;}
  .t-neutral{background:#ECE3D2;color:#8A7647;}
  .t-depth{background:#F0DCE0;color:#7B2D3A;}
  .t-enrol{background:#E7DFF0;color:#6E5A86;}

  .c-loc{font-size:.88rem;font-weight:600;color:#5A5A5A;display:inline-flex;align-items:center;gap:3px;white-space:nowrap;padding-top:2px;}
  .c-loc svg{width:12px;height:12px;}
  .c-loc.branch{color:#5B8C1A;}

  .c-name{font-weight:700;font-size:1.03rem;color:#1D1D1F;line-height:1.3;}
  .c-name .dur{font-weight:500;color:#8a857c;font-size:.92rem;}

  .c-foot{display:flex;justify-content:space-between;align-items:center;gap:16px;}
  .c-sum{font-size:.93rem;line-height:1.55;color:#5A5A5A;}
  .c-sum .sep{color:#b6ad9d;padding:0 7px;font-weight:400;}

  .loc-m{display:none;}
  .c-link{display:inline-block;padding:8px 16px;border-radius:999px;font-size:.84rem;font-weight:600;text-decoration:none;white-space:nowrap;border:1px solid transparent;}
  .cta-green{background:#E4F1E7;color:#0B7A3B;border-color:#C4E1CC;}
  .cta-coral{background:#F8E8DF;color:#B85C37;border-color:#EDCDBD;}

  @media(max-width:640px){
    .sess{grid-template-columns:1fr;}
    .lc{flex-direction:row;align-items:baseline;gap:12px;padding:12px 20px 2px;text-align:left;}
    .lc .day.blank{display:none;}
    .content{padding:6px 20px 16px;}
    .c-head{flex-direction:column;gap:6px;}
    .c-head .c-loc{display:none;}
    .c-foot{flex-direction:column;align-items:flex-start;gap:8px;}
    .c-foot .loc-m{display:inline-flex;}
    .c-link{align-self:stretch;text-align:center;margin-top:2px;}
    .wag-closed{flex-direction:column;align-items:flex-start;gap:8px;text-align:left;}
    .wag-closed .cl-dates{flex-direction:column;gap:4px;}
    .wag-closed .cl-dates .cl-sep{display:none;}
  }
`;
  var HTML  = String.raw`<div class="wag-wrap">
  <h2 class="wag-h">The week at a glance</h2>
  <p class="wag-lead">Drop-in classes run most weeks. Please check the calendar for exact dates.</p>

  <div class="wag-closed" id="wag-closed">
    <span class="cl-head">PLEASE NOTE &mdash; WE'RE CLOSED ON THESE DATES (2026)</span>
    <span class="cl-dates"><span class="cl-d">22 Jul&nbsp;&ndash;&nbsp;16 Aug</span><span class="cl-sep">&middot;</span><span class="cl-d">9&nbsp;&ndash;&nbsp;15 Oct</span><span class="cl-sep">&middot;</span><span class="cl-d">27&nbsp;&ndash;&nbsp;29 Nov</span><span class="cl-sep">&middot;</span><span class="cl-d">15 Dec&nbsp;&ndash;&nbsp;1 Jan</span></span>
  </div>

  <!-- MONDAY -->
  <div class="day-grp">
    <div class="sess">
      <div class="lc"><span class="day">Mon</span><span class="time">12:30</span></div>
      <div class="content">
        <div class="c-head">
          <div class="c-tags"><span class="c-tag t-drop">Drop-in</span><span class="c-tag t-start">Get started</span></div>
          <span class="c-loc"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span>
        </div>
        <div class="c-name">Simply Meditate <span class="dur">(30 min)</span></div>
        <div class="c-foot"><span class="c-sum">Come as you are<span class="sep">|</span>Reduce stress and cultivate inner peace<span class="sep">|</span>Check term dates or calendar</span><span class="c-loc loc-m"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span><a class="c-link cta-green" href="/visit-us">Get directions &rarr;</a></div>
      </div>
    </div>
    <div class="sess">
      <div class="lc"><span class="day blank">Mon</span><span class="time">18:30</span></div>
      <div class="content">
        <div class="c-head">
          <div class="c-tags"><span class="c-tag t-main">Main class</span><span class="c-tag t-drop">Drop-in</span></div>
          <span class="c-loc"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span>
        </div>
        <div class="c-name">Evening meditation class <span class="dur">(75 min)</span></div>
        <div class="c-foot"><span class="c-sum">One-off talks &amp; short series of classes on a theme or topic<span class="sep">|</span>Includes talk &amp; two guided meditations</span><span class="c-loc loc-m"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span><a class="c-link cta-green" href="/visit-us">Get directions &rarr;</a></div>
      </div>
    </div>
  </div>

  <!-- TUESDAY -->
  <div class="day-grp">
    <div class="sess">
      <div class="lc"><span class="day">Tue</span><span class="time">10:30</span></div>
      <div class="content">
        <div class="c-head">
          <div class="c-tags"><span class="c-tag t-main">Main class</span><span class="c-tag t-drop">Drop-in</span></div>
          <span class="c-loc"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span>
        </div>
        <div class="c-name">Daytime meditation class <span class="dur">(75 min)</span></div>
        <div class="c-foot"><span class="c-sum">One-off talks &amp; short series of classes on a theme or topic<span class="sep">|</span>Includes talk &amp; two guided meditations</span><span class="c-loc loc-m"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span><a class="c-link cta-green" href="/visit-us">Get directions &rarr;</a></div>
      </div>
    </div>
  </div>

  <!-- WEDNESDAY -->
  <div class="day-grp">
    <div class="sess">
      <div class="lc"><span class="day">Wed</span><span class="time">19:00</span></div>
      <div class="content">
        <div class="c-head">
          <div class="c-tags"><span class="c-tag t-ya">Young Adults</span><span class="c-tag t-drop">Drop-in</span></div>
          <span class="c-loc"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span>
        </div>
        <div class="c-name">Young Adults <span class="dur">(60 min)</span></div>
        <div class="c-foot"><span class="c-sum">For young adults 18+<span class="sep">|</span>Check programme or calendar for dates</span><span class="c-loc loc-m"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span><a class="c-link cta-green" href="/visit-us">Get directions &rarr;</a></div>
      </div>
    </div>
  </div>

  <!-- THURSDAY -->
  <div class="day-grp">
    <div class="sess">
      <div class="lc"><span class="day">Thu</span><span class="time">18:30</span></div>
      <div class="content">
        <div class="c-head">
          <div class="c-tags"><span class="c-tag t-drop">Drop-in</span><span class="c-tag t-branch">Branch class</span></div>
          <span class="c-loc branch"><svg viewBox="0 0 24 24" fill="#6DBE45"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cirencester</span>
        </div>
        <div class="c-name">Cirencester evening meditation class <span class="dur">(75 min)</span></div>
        <div class="c-foot"><span class="c-sum">Talks &amp; meditations following a theme or topic<span class="sep">|</span>Check programme or calendar for dates</span><span class="c-loc branch loc-m"><svg viewBox="0 0 24 24" fill="#6DBE45"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cirencester</span><a class="c-link cta-green" href="/visit-us">Get directions &rarr;</a></div>
      </div>
    </div>
  </div>

  <!-- FRIDAY -->
  <div class="day-grp">
    <div class="sess">
      <div class="lc"><span class="day">Fri</span><span class="time">12:00</span></div>
      <div class="content">
        <div class="c-head">
          <div class="c-tags"><span class="c-tag t-begin">Perfect for beginners</span><span class="c-tag t-drop">Drop-in</span></div>
          <span class="c-loc"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span>
        </div>
        <div class="c-name">Free taster meditation <span class="dur">(15 min)</span></div>
        <div class="c-foot"><span class="c-sum">A great place to get started for beginners<span class="sep">|</span>Come as you are<span class="sep">|</span>Guided meditation</span><span class="c-loc loc-m"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span><a class="c-link cta-green" href="/visit-us">Get directions &rarr;</a></div>
      </div>
    </div>
  </div>

  <!-- SATURDAY -->
  <div class="day-grp">
    <div class="sess">
      <div class="lc"><span class="day">Sat</span><span class="time">10:00</span></div>
      <div class="content">
        <div class="c-head">
          <div class="c-tags"><span class="c-tag t-neutral">Half-day</span><span class="c-tag t-neutral">Day</span></div>
          <span class="c-loc"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span>
        </div>
        <div class="c-name">Weekend courses &amp; retreats</div>
        <div class="c-foot"><span class="c-sum">Day and half-day retreats and special events through the year</span><span class="c-loc loc-m"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span><a class="c-link cta-coral" href="/whats-on">Courses &amp; retreats &rarr;</a></div>
      </div>
    </div>
  </div>

  <!-- SUNDAY -->
  <div class="day-grp">
    <div class="sess">
      <div class="lc"><span class="day">Sun</span><span class="time">09:30</span></div>
      <div class="content">
        <div class="c-head">
          <div class="c-tags"><span class="c-tag t-depth">In-depth</span><span class="c-tag t-enrol">Enrolment required</span></div>
          <span class="c-loc"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span>
        </div>
        <div class="c-name">Teacher Training Programme (TTP)</div>
        <div class="c-foot"><span class="c-sum">In-depth training for those wishing to train as meditation teachers<span class="sep">|</span>Not a drop-in class</span><span class="c-loc loc-m"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span><a class="c-link cta-coral" href="#indepth">More information &rarr;</a></div>
      </div>
    </div>
    <div class="sess">
      <div class="lc"><span class="day blank">Sun</span><span class="time">15:00</span></div>
      <div class="content">
        <div class="c-head">
          <div class="c-tags"><span class="c-tag t-depth">In-depth</span><span class="c-tag t-enrol">Enrolment required</span></div>
          <span class="c-loc"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span>
        </div>
        <div class="c-name">Foundation Programme (FP)</div>
        <div class="c-foot"><span class="c-sum">Go further<span class="sep">|</span>In-depth structured study &amp; meditation<span class="sep">|</span>Not a drop-in class</span><span class="c-loc loc-m"><svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>Cheltenham</span><a class="c-link cta-coral" href="#indepth">More information &rarr;</a></div>
      </div>
    </div>
  </div>

</div>`;
  function init(){
    var mount = document.getElementById(MOUNT_ID);
    if(!mount){ return; }
    if(mount.getAttribute('data-akx-done')==='1'){ return; }
    if(!document.getElementById('akx-glance-style')){
      var st = document.createElement('style'); st.id='akx-glance-style'; st.textContent = STYLE; document.head.appendChild(st);
    }
    mount.innerHTML = HTML;
    mount.setAttribute('data-akx-done','1');
    showClosureNotice();
  }
  function showClosureNotice(){
    (function(){
      var el=document.getElementById('wag-closed'); if(!el) return;
      var LEAD=21; // show this many days before a closure starts, through its end
      var C=[['2026-07-22','2026-08-16'],['2026-10-09','2026-10-15'],['2026-11-27','2026-11-29'],['2026-12-15','2027-01-01']];
      var force = location.search.indexOf('showclosed')>-1;
      var now=new Date(); now.setHours(0,0,0,0);
      var show=force;
      for(var i=0;i<C.length && !show;i++){
        var s=new Date(C[i][0]+'T00:00:00'), e=new Date(C[i][1]+'T23:59:59');
        var lead=new Date(s); lead.setDate(lead.getDate()-LEAD);
        if(now>=lead && now<=e) show=true;
      }
      el.style.display = show ? 'flex' : 'none';
    })();
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
