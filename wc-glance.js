/* Akanishta &mdash; Week at a Glance widget (v7 &mdash; semi-live)
   NEW in v7:
   - Each class shows its NEXT TWO real dates, pulled live from the Google
     Calendar (same feeds the calendar widget uses). Matched by weekday + time.
     Breaks/half-term/cancellations are handled for free (Google expands the
     recurrence server-side via singleEvents=true and drops cancelled dates).
   - Public talks: put a hidden token [talk] in the calendar event title. The
     widget shows a coral "Talk" chip + the topic, and strips the token from
     display. Everything untagged is just a weekly class / short course (plain).
   - Saturday row pulls the next event (title + date) from the Courses &
     Retreats (weekend) feed.
   - Simply Meditate isn't on any calendar, so it stays a static line.
   - GRACEFUL FALLBACK: the static timetable renders first and always; if the
     live fetch fails, rows simply show without the "next date" line.
   Static features kept: term-dates pill, Open House pills, day-shown-once,
   desktop Details expand, mobile filter tabs.
   Include with: <div id="akx-glance"></div>
                 <script src="https://kadampacheltenham.github.io/akx-widgets/wc-glance.js" defer></script> */
(function(){
  var MOUNT_ID='akx-glance';
  var OH_INVITE='New? Let us welcome you and show you around before the class.';
  var DIR_CH='https://maps.google.com/?q=59+Whaddon+Road,+Cheltenham';
  var DIR_CI='https://maps.google.com/?q=Cirencester';   /* TODO: exact Cirencester venue address */

  /* ---- live calendar (same feeds/key as the calendar widget) ---- */
  var API_KEY='AIzaSyAVm0epUASAL2aNbAN_aBmpDDPxoPJVOwA';
  var TZ='Europe/London';
  var CAL_IDS={
    weekly:'c_9e95a300a2d0f8775b28d30ebfe5eb816d8dc678d4dffbebbc09cd59d9208ffd@group.calendar.google.com',
    branch:'c_6b6fc5b8541682cc520a71d1bc5683dc16d14d2e907ef4da85a1e7479a73c798@group.calendar.google.com',
    weekend:'c_687cfcac60ad1fa647cd2fb654774156e1e48fb2dcbcf5c40a72340e422a4b08@group.calendar.google.com'
  };

  /* ---- single source of truth for both desktop + mobile ----
     feed: which calendar to match against (omit = static, no live dates).
     Match key is feed + day + time. tag = a plain neutral word-label. ---- */
  var EVENTS=[
    {day:'Mon',time:'12:30',name:'Simply Meditate',dur:'30 min',loc:'chelt',tag:'Get started',
     sum:'Reduce stress and cultivate inner peace|Come as you are|Check term dates above or calendar below',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Mon',time:'18:30',name:'Evening meditation class',dur:'75 min',loc:'chelt',feed:'weekly',tag:'Drop-in welcome',oh:'5:45&ndash;6:15 pm',
     sum:'One-off talks &amp; short series on a theme or topic|See programme &amp; calendar below for details',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Tue',time:'10:30',name:'Daytime meditation class',dur:'75 min',loc:'chelt',feed:'weekly',tag:'Drop-in welcome',
     sum:'One-off talks &amp; short series on a theme or topic|See programme &amp; calendar below for details',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Wed',time:'19:00',name:'Young Adults',dur:'60 min',loc:'chelt',feed:'weekly',tag:'Ages 18&ndash;35',
     sum:'Aimed at young adults 18+|Check programme or calendar below for more details',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Thu',time:'18:30',name:'Cirencester evening class',dur:'75 min',loc:'ciren',feed:'branch',tag:'',
     sum:'Talks &amp; meditations following a theme|Check programme or calendar for dates',
     cta:{label:'Get directions &rarr;',url:DIR_CI,ext:1}},
    {day:'Fri',time:'12:00',name:'Free guided meditation',dur:'15 min',loc:'chelt',feed:'weekly',free:1,tag:'Free &middot; get started',oh:'11:30&ndash;12:00',
     sum:'Get started|Come as you are|Check term dates above or calendar below',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Sat',time:'10:00',name:'Weekend courses &amp; retreats',dur:'',loc:'chelt',feed:'weekend',tag:'',
     sum:'Day &amp; half-day courses and retreats throughout the year.',
     cta:{label:'Courses &amp; retreats page &rarr;',url:'/courses-retreats',coral:1}},
    {day:'Sun',time:'09:30',name:'Teacher Training (TTP)',dur:'',loc:'chelt',feed:'weekly',depth:1,tag:'In-depth &middot; enrol',
     sum:'In-depth training for those wishing to train as qualified meditation teachers|Not a drop-in class',
     cta:{label:'In-depth study page &rarr;',url:'/in-depth-study',coral:1}},
    {day:'Sun',time:'15:00',name:'Foundation Programme (FP)',dur:'',loc:'chelt',feed:'weekly',depth:1,tag:'In-depth &middot; enrol',
     sum:'Go further|In-depth structured study &amp; meditation|Not a drop-in class',
     cta:{label:'In-depth study page &rarr;',url:'/in-depth-study',coral:1}}
  ];
  var TABS=['All','Cheltenham','AM','PM','Free','Branches','In-depth'];

  var PIN_CH='<svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';
  var PIN_CI='<svg viewBox="0 0 24 24" fill="#6DBE45"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';

  /* ---- live data store ---- */
  var NEXT={};       /* mkey -> {items:[{date,title,talk,start}]} */
  var SOONK=null;    /* mkey of the soonest upcoming (for the "next up" tint) */

  var STYLE=String.raw`
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Roboto+Mono:wght@500;600&display=swap');
  :root{--ink:#2B2A28;--red:#C8102E;--teal:#4E938C;}
  #akx-glance *{box-sizing:border-box;}
  #akx-glance{font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);}
  #akx-glance .wag{max-width:1000px;margin:0 auto;}
  #akx-glance .wag-h{text-align:center;font-size:1.9rem;font-weight:600;color:#2A66A6;margin:0 0 6px;}
  #akx-glance .wag-lead{margin:0 auto 18px;padding:0 30px;text-align:left;color:#6f6a62;font-size:.98rem;line-height:1.55;}
  #akx-glance .wag-term{display:flex;gap:14px;align-items:flex-start;background:#FBF6ED;color:#5c6773;border:1px solid #EFE7D6;border-radius:12px;padding:15px 18px;margin:0 0 20px;font-size:1rem;line-height:1.55;}
  #akx-glance .wag-pill{flex:none;align-self:flex-start;margin-top:1px;font-family:'Inter',sans-serif;font-weight:800;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:#8a6d2f;background:#EFE3C8;border-radius:999px;padding:6px 13px;}
  #akx-glance .wag-term .line{display:block;} #akx-glance .wag-term b{font-weight:700;color:#26303A;} #akx-glance .wag-term .ht{color:#8a8175;}

  #akx-glance .toolbar{display:flex;justify-content:flex-end;margin:0 0 8px;}
  #akx-glance .xall{background:none;border:1.5px solid #dcd6ca;border-radius:999px;padding:6px 15px;font-size:.82rem;font-weight:600;color:var(--teal);cursor:pointer;}
  #akx-glance .tbl{border:1px solid #ece7dd;border-radius:14px;background:#fff;box-shadow:0 3px 14px rgba(0,0,0,.05);overflow:hidden;}
  #akx-glance .r{border-top:1px solid #f0ece3;} #akx-glance .r:first-child{border-top:none;}
  #akx-glance .r.soon .rh{background:#FBF6ED;}
  #akx-glance .rh{display:grid;grid-template-columns:72px 1fr auto;grid-template-areas:"day name det" "day meta meta" "day next next" "day oh oh";column-gap:16px;row-gap:7px;padding:14px 20px;align-items:center;cursor:pointer;}
  #akx-glance .dt{grid-area:day;align-self:start;display:flex;flex-direction:column;}
  #akx-glance .dt .day{font-family:'Oswald',sans-serif;color:var(--red);font-weight:700;font-size:1.12rem;line-height:1;}
  #akx-glance .dt .time{font-family:'Oswald',sans-serif;color:var(--ink);font-weight:500;font-size:.84rem;margin-top:3px;}
  #akx-glance .meta{grid-area:meta;min-width:0;display:flex;align-items:center;gap:6px 10px;flex-wrap:wrap;}
  #akx-glance .nm{grid-area:name;font-weight:700;font-size:1rem;color:var(--ink);} #akx-glance .nm .dur{font-weight:500;color:#9a948b;font-size:.85rem;}
  #akx-glance .ptag{font-size:.62rem;font-weight:700;letter-spacing:.02em;text-transform:uppercase;padding:3px 8px;border-radius:999px;white-space:nowrap;}
  #akx-glance .tagN{background:#EDE7DB;color:#7c6f58;}
  #akx-glance .loc{font-size:.85rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;white-space:nowrap;flex:0 0 auto;} #akx-glance .loc svg{width:11px;height:11px;} #akx-glance .loc.chelt{color:#5A5A5A;} #akx-glance .loc.ciren{color:#5B8C1A;}
  #akx-glance .det{grid-area:det;align-self:center;border:1.5px solid #d9e3e0;background:#fff;color:var(--teal);font-size:.8rem;font-weight:700;padding:6px 12px;border-radius:999px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:5px;}
  #akx-glance .det .chev{font-size:.66rem;transition:transform .2s;}
  #akx-glance .r.open .det{background:#EEF5F3;border-color:#bcd8d2;} #akx-glance .r.open .det .chev{transform:rotate(180deg);}
  /* ---- the live "next dates" line ---- */
  #akx-glance .nextline{grid-area:next;font-family:'Roboto Mono',monospace;font-size:.8rem;color:#4a4a48;letter-spacing:-.01em;}
  #akx-glance .nextline:empty{display:none;}
  #akx-glance .nlbl{color:#9a948b;text-transform:uppercase;font-size:.66rem;letter-spacing:.04em;margin-right:5px;font-family:'Inter',sans-serif;font-weight:700;}
  #akx-glance .nextline b{color:#1f6b5f;font-weight:600;}
  #akx-glance .nchip{display:inline-block;font-family:'Inter',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:#fff;padding:2px 8px;border-radius:999px;margin-right:6px;vertical-align:middle;}
  #akx-glance .nchip.talk{background:#C56B45;}
  #akx-glance .nstatic{color:#9a948b;font-style:italic;font-family:'Inter',sans-serif;font-size:.82rem;}
  #akx-glance .oh{grid-area:oh;display:flex;align-items:center;gap:10px;background:#FBF6ED;color:#5c6773;border:1px solid #EFE7D6;border-radius:8px;padding:7px 12px;font-size:.84rem;line-height:1.4;}
  #akx-glance .oh-pill{flex:none;font-family:'Inter',sans-serif;font-weight:800;font-size:.62rem;letter-spacing:.07em;text-transform:uppercase;color:#8a6d2f;background:#EFE3C8;border-radius:999px;padding:3px 9px;}
  #akx-glance .oh b{font-weight:700;color:#26303A;}
  #akx-glance .rd{display:none;padding:0 20px 16px 90px;}
  #akx-glance .r.open .rd{display:block;}
  #akx-glance .rd .sum{font-size:.93rem;color:#5A5A5A;line-height:1.55;margin-bottom:12px;} #akx-glance .rd .sum .sep{color:#cfc8bc;padding:0 6px;}
  #akx-glance .cta{display:inline-block;background:#E4F1E7;color:#0B7A3B;border:1px solid #C4E1CC;font-weight:600;font-size:.84rem;text-decoration:none;padding:8px 16px;border-radius:999px;}
  #akx-glance .cta.coral{background:#F8E8DF;color:#B85C37;border-color:#EDCDBD;}

  /* ---- desktop / mobile swap ---- */
  #akx-glance .wag-mobile{display:none;}
  @media(max-width:640px){
    #akx-glance .wag-desktop{display:none;}
    #akx-glance .wag-mobile{display:block;}
    #akx-glance .wag-h{font-size:1.5rem;} #akx-glance .wag-lead{padding:0 20px;font-size:.95rem;margin-bottom:14px;}
    #akx-glance .wag-term{font-size:.95rem;padding:13px 15px;}
  }
  /* mobile tabs + list */
  #akx-glance .m-tabs{display:flex;gap:6px;overflow-x:auto;padding:2px 2px 10px;-webkit-overflow-scrolling:touch;}
  #akx-glance .m-tabs::-webkit-scrollbar{height:0;}
  #akx-glance .m-tab{flex:0 0 auto;border:1.5px solid #dcd6ca;background:#fff;color:#6f6a62;border-radius:999px;padding:6px 13px;font-size:.8rem;font-weight:600;cursor:pointer;white-space:nowrap;}
  #akx-glance .m-tab.on{background:#2A66A6;border-color:#2A66A6;color:#fff;}
  #akx-glance .m-list{background:#fff;border:1px solid #ece7dd;border-radius:12px;box-shadow:0 3px 14px rgba(0,0,0,.05);overflow:hidden;position:relative;}
  #akx-glance .mrow{display:grid;grid-template-columns:46px 1fr auto;column-gap:10px;padding:12px 14px;border-top:1px solid #f0ece3;align-items:start;}
  #akx-glance .mrow:first-child{border-top:none;}
  #akx-glance .mrow.soon{background:#FBF6ED;}
  #akx-glance .mrow.mx{cursor:pointer;}
  #akx-glance .mrow .mday{font-family:'Oswald',sans-serif;color:var(--red);font-weight:700;font-size:.98rem;line-height:1.05;}
  #akx-glance .mrow .mtime{font-family:'Oswald',sans-serif;font-size:.74rem;color:var(--ink);}
  #akx-glance .mrow .mname{font-weight:700;font-size:.94rem;}
  #akx-glance .mrow .msub{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:4px;}
  #akx-glance .mrow .msub .ptag{font-size:.57rem;padding:2px 7px;} #akx-glance .mrow .msub .loc{font-size:.77rem;}
  #akx-glance .mnext{margin-top:5px;font-family:'Roboto Mono',monospace;font-size:.74rem;color:#4a4a48;}
  #akx-glance .mnext:empty{display:none;}
  #akx-glance .mnext b{color:#1f6b5f;font-weight:600;}
  #akx-glance .mchev{align-self:center;border:1.5px solid #d9e3e0;background:#fff;color:var(--teal);width:26px;height:26px;border-radius:999px;font-size:.62rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;}
  #akx-glance .mchev .c{transition:transform .2s;}
  #akx-glance .mrow.open .mchev{background:#EEF5F3;border-color:#bcd8d2;} #akx-glance .mrow.open .mchev .c{transform:rotate(180deg);}
  #akx-glance .mrd{display:none;margin-top:10px;}
  #akx-glance .mrow.open .mrd{display:block;}
  #akx-glance .mrd .msum{font-size:.82rem;color:#5A5A5A;line-height:1.5;margin-bottom:10px;} #akx-glance .mrd .msum .sep{color:#cfc8bc;padding:0 5px;}
  #akx-glance .mcta{display:inline-block;background:#E4F1E7;color:#0B7A3B;border:1px solid #C4E1CC;font-weight:600;font-size:.8rem;text-decoration:none;padding:7px 14px;border-radius:999px;}
  #akx-glance .mcta.coral{background:#F8E8DF;color:#B85C37;border-color:#EDCDBD;}
  #akx-glance .oh-m{margin-top:7px;display:flex;gap:8px;align-items:center;background:#FBF6ED;color:#5c6773;border:1px solid #EFE7D6;border-radius:7px;padding:6px 9px;font-size:.75rem;line-height:1.35;}
  #akx-glance .oh-m .oh-pill{padding:2px 8px;font-size:.58rem;}
  #akx-glance .oh-m b{font-weight:700;color:#26303A;}
  #akx-glance .m-list.teaser{cursor:pointer;}
  #akx-glance .mrow.ghost{opacity:.5;} #akx-glance .mrow.ghost2{opacity:.22;}
  #akx-glance .m-fade{position:absolute;left:0;right:0;bottom:0;height:155px;background:linear-gradient(to bottom,rgba(255,255,255,0),#fff 80%);pointer-events:none;}
  #akx-glance .m-nudge{position:absolute;left:0;right:0;bottom:16px;text-align:center;z-index:2;}
  #akx-glance .m-nudge span{display:inline-block;background:#2A66A6;color:#fff;font-size:.8rem;font-weight:600;padding:8px 16px;border-radius:999px;box-shadow:0 4px 14px rgba(42,102,166,.32);}
  #akx-glance .m-empty{padding:16px;text-align:center;color:#9a948b;font-size:.85rem;}
  #akx-glance .m-reset{border-top:1px solid #f0ece3;text-align:center;padding:11px;font-size:.8rem;font-weight:600;color:#2A66A6;cursor:pointer;background:#FBF9F4;}
`;

  /* ================= helpers ================= */
  function mins(t){var p=t.split(':');return (+p[0])*60+(+p[1]);}
  function isAM(e){return mins(e.time)<=720;}          /* starts by 12:00 */
  function pin(loc){return loc==='ciren'?PIN_CI:PIN_CH;}
  function locName(loc){return loc==='ciren'?'Cirencester':'Cheltenham';}
  function locHTML(e){return '<span class="loc '+e.loc+'">'+pin(e.loc)+locName(e.loc)+'</span>';}
  function tagHTML(e){return e.tag?'<span class="ptag tagN">'+e.tag+'</span>':'';}
  function sumHTML(s){return s.split('|').map(function(x,i){return (i?'<span class="sep">|</span>':'')+x;}).join('');}
  function ctaAttrs(e){return 'href="'+e.cta.url+'"'+(e.cta.ext?' target="_blank" rel="noopener"':'');}
  function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function mkeyOf(e){return e.feed?(e.feed==='weekend'?'weekend':(e.feed+'|'+e.day+'|'+e.time)):'static';}

  /* the "next dates" HTML for a given match key (reads NEXT).
     isMobile: weekend row shows just one date + title on mobile. */
  function nextHTML(k,isMobile){
    if(k==='static') return '<span class="nstatic">Runs in term time &mdash; see calendar below</span>';
    var d=NEXT[k]; if(!d) return '';                         /* not loaded yet */
    var it=d.items||[];
    if(!it.length) return '<span class="nstatic">Resumes next term &mdash; see calendar</span>';
    var f=it[0];
    var head = f.talk
      ? '<span class="nchip talk">Talk</span> <b>'+f.date+'</b>'+(f.title?' &mdash; '+esc(f.title):'')
      : '<span class="nlbl">Next</span> <b>'+f.date+'</b>'+(f.title?' &mdash; '+esc(f.title):'');
    if(k==='weekend' && isMobile) return head;               /* mobile weekend: one date + title */
    return head+(it[1]?', then '+it[1].date:'');
  }

  /* ================= row builders ================= */
  function desktopRow(e,hideDay){
    var k=mkeyOf(e);
    var oh=e.oh?'<div class="oh"><span class="oh-pill">Open House</span><span><b>'+e.oh+'</b> &mdash; '+OH_INVITE+'</span></div>':'';
    return '<div class="r"><div class="rh">'
      +'<div class="dt">'+(hideDay?'':'<span class="day">'+e.day+'</span>')+'<span class="time">'+e.time+'</span></div>'
      +'<span class="nm">'+e.name+(e.dur?' <span class="dur">('+e.dur+')</span>':'')+'</span>'
      +'<span class="meta">'+tagHTML(e)+locHTML(e)+'</span>'
      +'<button class="det">Details <span class="chev">&#9662;</span></button>'
      +'<div class="nextline nextfill" data-k="'+k+'">'+nextHTML(k,false)+'</div>'
      +oh
      +'</div><div class="rd"><div class="sum">'+sumHTML(e.sum)+'</div>'
      +'<a class="cta'+(e.cta.coral?' coral':'')+'" '+ctaAttrs(e)+'>'+e.cta.label+'</a></div></div>';
  }
  function mobileRow(e,cls,expandable,hideDay){
    var k=mkeyOf(e);
    var soon=(k===SOONK)?' soon':'';
    var dur=e.dur?' <span class="dur" style="color:#9a948b;font-weight:500;font-size:.8rem">('+e.dur+')</span>':'';
    var oh=e.oh?'<div class="oh-m"><span class="oh-pill">Open House</span><span><b>'+e.oh+'</b> &mdash; '+OH_INVITE+'</span></div>':'';
    var chev=expandable?'<button class="mchev"><span class="c">&#9662;</span></button>':'';
    var det=expandable?'<div class="mrd"><div class="msum">'+sumHTML(e.sum)+'</div>'
      +'<a class="mcta'+(e.cta.coral?' coral':'')+'" '+ctaAttrs(e)+'>'+e.cta.label+'</a></div>':'';
    return '<div class="mrow'+(cls?' '+cls:'')+soon+(expandable?' mx':'')+'">'
      +'<div>'+(hideDay?'':'<div class="mday">'+e.day+'</div>')+'<div class="mtime">'+e.time+'</div></div>'
      +'<div class="mbody"><div class="mname">'+e.name+dur+'</div>'
      +'<div class="msub">'+tagHTML(e)+locHTML(e)+'</div>'
      +'<div class="mnext nextfill" data-k="'+k+'">'+nextHTML(k,true)+'</div>'
      +oh+det+'</div>'
      +chev+'</div>';
  }
  function match(e,tab){
    if(tab==='All')return true;
    if(tab==='Cheltenham')return e.loc==='chelt';
    if(tab==='AM')return isAM(e);
    if(tab==='PM')return !isAM(e);
    if(tab==='Free')return !!e.free;
    if(tab==='Branches')return e.loc!=='chelt';
    if(tab==='In-depth')return !!e.depth;
    return true;
  }

  function headerHTML(){
    return '<h2 class="wag-h">Week at a Glance</h2>'
      +'<div class="wag-lead">Here&rsquo;s the week at a glance &mdash; each class shows its next dates. Tap an event for more, or see the full calendar below.</div>'
      +'<div class="wag-term"><span class="wag-pill">Term dates</span><div>'
      +'<span class="line"><b>Autumn Term:</b> 22 Aug &ndash; 15 Dec <span class="ht">(half-term 8&ndash;15 Oct)</span></span>'
      +'<span class="line"><b>Spring Term:</b> from 2 Jan 2027</span>'
      +'</div></div>';
  }

  function buildHTML(){
    return '<div class="wag">'
      +headerHTML()
      +'<div class="wag-desktop">'
        +'<div class="toolbar"><button class="xall">Expand all &#9662;</button></div>'
        +'<div class="tbl">'+EVENTS.map(function(e,i){return desktopRow(e, i>0 && EVENTS[i-1].day===e.day);}).join('')+'</div>'
      +'</div>'
      +'<div class="wag-mobile">'
        +'<div class="m-tabs">'+TABS.map(function(t){return '<button class="m-tab">'+t+'</button>';}).join('')+'</div>'
        +'<div class="m-list"></div>'
      +'</div>'
    +'</div>';
  }

  function renderMobile(root,state){
    var list=root.querySelector('.m-list');
    root.querySelectorAll('.m-tab').forEach(function(b){b.classList.toggle('on',state && b.textContent===state);});
    if(!state){ /* teaser: first event, two ghosts, fade + nudge; tap to reveal All */
      list.className='m-list teaser';
      list.innerHTML=mobileRow(EVENTS[0])+mobileRow(EVENTS[1],'ghost',false,EVENTS[0].day===EVENTS[1].day)+mobileRow(EVENTS[2],'ghost2',false,EVENTS[1].day===EVENTS[2].day)
        +'<div class="m-fade"></div><div class="m-nudge"><span>&uarr; Pick a filter to explore</span></div>';
      list.onclick=function(){renderMobile(root,'All');};
      return;
    }
    list.className='m-list'; list.onclick=null;
    var rows=EVENTS.filter(function(e){return match(e,state);});
    list.innerHTML=(rows.length?rows.map(function(e,i){return mobileRow(e,null,true, i>0 && rows[i-1].day===e.day);}).join('')
      :'<div class="m-empty">Nothing in this filter.</div>')
      +'<div class="m-reset">&#8634; Reset</div>';
    list.querySelectorAll('.mrow.mx').forEach(function(row){
      row.addEventListener('click',function(ev){ if(ev.target.closest('a')) return; row.classList.toggle('open'); });
    });
    var rs=list.querySelector('.m-reset'); if(rs)rs.addEventListener('click',function(){renderMobile(root,null);});
  }

  function wire(root){
    /* desktop expand */
    root.querySelectorAll('.wag-desktop .rh').forEach(function(h){h.addEventListener('click',function(){h.parentNode.classList.toggle('open');});});
    var xall=root.querySelector('.xall');
    if(xall)xall.addEventListener('click',function(){var rows=root.querySelectorAll('.wag-desktop .r');var anyClosed=[].some.call(rows,function(r){return !r.classList.contains('open');});rows.forEach(function(r){r.classList.toggle('open',anyClosed);});this.textContent=anyClosed?'Collapse all &#9652;':'Expand all &#9662;';});
    /* mobile tabs */
    root.querySelectorAll('.m-tab').forEach(function(b){b.addEventListener('click',function(){renderMobile(root,b.textContent);});});
    renderMobile(root,null);
  }

  /* ================= live calendar layer ================= */
  function fmtWD(s){return new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'short'}).format(new Date(s));}
  function fmtHM(s,allDay){if(allDay)return'all';return new Intl.DateTimeFormat('en-GB',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(s));}
  function fmtNice(s,allDay){return new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'short',day:'numeric',month:'short'}).format(new Date(s)).replace(',','');}
  function isTalk(t){return /\[talk\]/i.test(t||'');}
  function cleanTitle(t){return (t||'').replace(/\s*\[[^\]]*\]\s*/g,' ').replace(/\s{2,}/g,' ').trim();}

  function apiUrl(id,tMin,tMax){
    return 'https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(id)
      +'/events?singleEvents=true&orderBy=startTime&maxResults=250&key='+API_KEY
      +'&timeMin='+encodeURIComponent(tMin)+'&timeMax='+encodeURIComponent(tMax);
  }
  function grab(id,tMin,tMax){
    return fetch(apiUrl(id,tMin,tMax)).then(function(r){return r.json();}).then(function(j){
      if(!j||j.error||!j.items) return [];
      return j.items.map(function(it){
        var allDay=!!(it.start&&it.start.date);
        var s=it.start?(it.start.dateTime||it.start.date):null; if(!s) return null;
        return {start:s, day:fmtWD(s), time:fmtHM(s,allDay), nice:fmtNice(s,allDay), summary:it.summary||''};
      }).filter(Boolean);
    }).catch(function(){return [];});
  }

  function buildNext(byFeed){
    NEXT={};
    EVENTS.forEach(function(e){
      if(!e.feed) return;
      var k=mkeyOf(e), arr=byFeed[e.feed]||[], items;
      if(e.feed==='weekend'){
        items=arr.slice(0,2).map(function(x){return {date:x.nice,title:cleanTitle(x.summary),talk:isTalk(x.summary),start:x.start};});
      }else{
        items=arr.filter(function(x){return x.day===e.day && x.time===e.time;}).slice(0,2)
          .map(function(x){return {date:x.nice,title:isTalk(x.summary)?cleanTitle(x.summary):'',talk:isTalk(x.summary),start:x.start};});
      }
      NEXT[k]={items:items};
    });
    /* soonest upcoming across all rows -> "next up" tint */
    SOONK=null; var best=null;
    Object.keys(NEXT).forEach(function(k){var it=NEXT[k].items; if(it&&it[0]&&it[0].start){ if(best===null||it[0].start<best){best=it[0].start;SOONK=k;} }});
  }

  function fillNext(root){
    root.querySelectorAll('.nextfill').forEach(function(el){
      var k=el.getAttribute('data-k'); el.innerHTML=nextHTML(k, el.classList.contains('mnext'));
      var row=el.closest('.r')||el.closest('.mrow'); if(row) row.classList.toggle('soon', k===SOONK && k!=='static');
    });
  }

  function loadLive(root){
    if(!window.fetch || !window.Promise) return;                 /* very old browser: stay static */
    var now=new Date();
    var tMin=now.toISOString();
    var tMax=new Date(now.getTime()+77*864e5).toISOString();      /* 11 weeks: clears half-term, still finds 2 dates */
    var keys=Object.keys(CAL_IDS);
    Promise.all(keys.map(function(k){return grab(CAL_IDS[k],tMin,tMax);})).then(function(res){
      var byFeed={}; keys.forEach(function(k,i){byFeed[k]=res[i];});
      buildNext(byFeed); fillNext(root);
    }).catch(function(){/* keep static */});
  }

  function init(){
    var mount=document.getElementById(MOUNT_ID); if(!mount) return;
    if(mount.getAttribute('data-akx-done')==='1') return;
    if(!document.getElementById('akx-glance-style')){var st=document.createElement('style');st.id='akx-glance-style';st.textContent=STYLE;document.head.appendChild(st);}
    mount.innerHTML=buildHTML(); mount.setAttribute('data-akx-done','1'); wire(mount);   /* static first, always */
    loadLive(mount);                                                                     /* then enhance with live dates */
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
