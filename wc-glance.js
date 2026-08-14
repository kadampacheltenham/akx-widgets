/* Akanishta &mdash; Week at a Glance widget (v8 &mdash; slim, unified, semi-live)
   - ONE list for desktop + mobile, with the filter tabs on a single line at the
     top of both: All | Get started | AM | PM | In-depth | Cheltenham | Branches.
   - Slim collapsed listing shows just: day/time + event name (+ small chip).
     "Dates & details" is the expander; tap ANYWHERE on a day to open it.
   - Days with 2+ events are grouped under one day label and expand together.
   - Chips: Talk (coral) · Free (green) · New (bright blue).
   - Event titles (e.g. a public talk) shown semi-bold in place of the class name.
   - Live: each class's next two real dates come from the Google Calendar
     (singleEvents=true; matched by weekday+time). Hidden title tokens drive chips:
     [talk] -> Talk + topic, [new] -> New + "Starts <date>". Static fallback if the
     fetch fails.
   - Term dates sit quietly at the bottom. Today's day is highlighted.
   Include with: <div id="akx-glance"></div>
                 <script src="https://kadampacheltenham.github.io/akx-widgets/wc-glance.js" defer></script> */
(function(){
  var MOUNT_ID='akx-glance';
  var OH_INVITE='Let us welcome you and show you around before the class.';
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

  /* ---- single source of truth. feed = which calendar to match (omit = static).
     start = get-started filter · free = Free chip · depth = In-depth filter. ---- */
  var EVENTS=[
    {day:'Mon',time:'12:30',name:'Simply Meditate',dur:'30 min',loc:'chelt',feed:'weekly',start:1,
     sum:'Reduce stress and cultivate inner peace|Come as you are|Perfect if you are just getting started',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Mon',time:'18:30',name:'Evening meditation class',dur:'75 min',loc:'chelt',feed:'weekly',oh:'5:45&ndash;6:15 pm',
     sum:'One-off talks &amp; short courses on a theme or topic|See the programme or calendar below for details',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Tue',time:'10:30',name:'Daytime meditation class',dur:'75 min',loc:'chelt',feed:'weekly',
     sum:'One-off talks &amp; short courses on a theme or topic|See the programme or calendar below for details',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Wed',time:'19:00',name:'Young Adults',dur:'60 min',loc:'chelt',feed:'weekly',
     sum:'Aimed at young adults 18&ndash;35|Check the programme or calendar below for details',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Thu',time:'18:30',name:'Cirencester evening class',dur:'75 min',loc:'ciren',feed:'branch',
     sum:'Talks &amp; meditations following a theme|Check the programme or calendar for dates',
     cta:{label:'Get directions &rarr;',url:DIR_CI,ext:1}},
    {day:'Fri',time:'12:00',name:'Free guided meditation',dur:'15 min',loc:'chelt',feed:'weekly',free:1,start:1,oh:'11:30&ndash;12:00',
     sum:'Free &mdash; nothing to book, just turn up|Perfect if you are just getting started',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Sat',time:'10:00',name:'Weekend courses &amp; retreats',dur:'',loc:'chelt',feed:'weekend',
     sum:'Day &amp; half-day courses and retreats throughout the year.',
     cta:{label:'Courses &amp; retreats page &rarr;',url:'/courses-retreats',coral:1}},
    {day:'Sun',time:'09:30',name:'Teacher Training (TTP)',dur:'',loc:'chelt',feed:'weekly',depth:1,
     sum:'In-depth training for those wishing to train as qualified meditation teachers|Not a drop-in class',
     cta:{label:'In-depth study page &rarr;',url:'/in-depth-study',coral:1}},
    {day:'Sun',time:'15:00',name:'Foundation Programme (FP)',dur:'',loc:'chelt',feed:'weekly',depth:1,
     sum:'Go further|In-depth structured study &amp; meditation|Not a drop-in class',
     cta:{label:'In-depth study page &rarr;',url:'/in-depth-study',coral:1}}
  ];
  var TABS=['All','Get started','AM','PM','In-depth','Cheltenham','Branches'];

  var PIN_CH='<svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';
  var PIN_CI='<svg viewBox="0 0 24 24" fill="#6DBE45"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';

  var NEXT={};   /* mkey -> {items:[{date,title,talk,isnew,start}]} */

  var STYLE=String.raw`
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Roboto+Mono:wght@500;600&display=swap');
  #akx-glance{--ink:#2B2A28;--red:#C8102E;--teal:#4E938C;font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);}
  #akx-glance *{box-sizing:border-box;}
  #akx-glance .wag{max-width:1000px;margin:0 auto;}
  #akx-glance .wag-h{text-align:center;font-size:1.9rem;font-weight:600;color:#2A66A6;margin:0 0 6px;}
  #akx-glance .wag-lead{margin:0 auto 16px;padding:0 20px;text-align:left;color:#6f6a62;font-size:.98rem;line-height:1.55;}

  /* filter tabs — one line, both breakpoints */
  #akx-glance .f-tabs{display:flex;gap:6px;overflow-x:auto;padding:2px 2px 12px;-webkit-overflow-scrolling:touch;}
  #akx-glance .f-tabs::-webkit-scrollbar{height:0;}
  #akx-glance .f-tab{flex:0 0 auto;border:1.5px solid #dcd6ca;background:#fff;color:#6f6a62;border-radius:999px;padding:6px 14px;font-size:.82rem;font-weight:600;cursor:pointer;white-space:nowrap;}
  #akx-glance .f-tab.on{background:#2A66A6;border-color:#2A66A6;color:#fff;}

  /* the list */
  #akx-glance .wag-list{border:1px solid #ece7dd;border-radius:14px;background:#fff;box-shadow:0 3px 14px rgba(0,0,0,.05);overflow:hidden;}
  #akx-glance .dayblk{border-top:1px solid #f0ece3;cursor:pointer;}
  #akx-glance .dayblk:first-child{border-top:none;}
  #akx-glance .dayblk.today{background:#FBF6ED;}
  #akx-glance .dh{display:grid;grid-template-columns:60px 1fr auto;column-gap:14px;padding:13px 18px;align-items:center;}
  #akx-glance .dday{font-family:'Oswald',sans-serif;color:var(--red);font-weight:700;font-size:1.08rem;line-height:1;align-self:center;}
  #akx-glance .devents{display:flex;flex-direction:column;gap:7px;min-width:0;}
  #akx-glance .dev{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;}
  #akx-glance .dtime{font-family:'Oswald',sans-serif;font-size:.82rem;color:var(--ink);flex:none;}
  #akx-glance .dname{font-weight:500;font-size:.96rem;color:var(--ink);}
  #akx-glance .dname.tt{font-weight:700;}
  #akx-glance .chip{font-size:.57rem;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:#fff;padding:2px 7px;border-radius:999px;white-space:nowrap;align-self:center;}
  #akx-glance .chip.talk{background:#C56B45;} #akx-glance .chip.free{background:#4FA35A;} #akx-glance .chip.new{background:#22B8F0;}
  #akx-glance .dtoggle{align-self:center;color:var(--teal);font-size:.78rem;font-weight:700;white-space:nowrap;display:inline-flex;align-items:center;gap:6px;}
  #akx-glance .dtoggle .chev{font-size:.64rem;transition:transform .2s;}
  #akx-glance .dayblk.open .dtoggle .chev{transform:rotate(180deg);}

  /* open house — visible on the collapsed day; turns white on the highlighted (today) row */
  #akx-glance .oh{margin:0 18px 12px 74px;display:flex;align-items:center;gap:10px;background:#FBF6ED;color:#5c6773;border:1px solid #EFE7D6;border-radius:8px;padding:7px 12px;font-size:.84rem;line-height:1.4;}
  #akx-glance .dayblk.today .oh{background:#fff;border-color:#E7DFC9;}
  #akx-glance .oh-pill{flex:none;font-family:'Inter',sans-serif;font-weight:800;font-size:.62rem;letter-spacing:.07em;text-transform:uppercase;color:#8a6d2f;background:#EFE3C8;border-radius:999px;padding:3px 9px;}
  #akx-glance .oh b{font-weight:700;color:#26303A;}

  /* expanded details */
  #akx-glance .ddetails{display:none;padding:0 18px 16px 74px;}
  #akx-glance .dayblk.open .ddetails{display:block;}
  #akx-glance .ed{border-top:1px dashed #eee6d8;padding-top:11px;margin-top:11px;}
  #akx-glance .ed:first-child{border-top:none;padding-top:0;margin-top:0;}
  #akx-glance .ed-h{font-weight:700;font-size:.9rem;margin-bottom:5px;}
  #akx-glance .ed-next{font-family:'Roboto Mono',monospace;font-size:.82rem;color:#4a4a48;margin-bottom:7px;}
  #akx-glance .ed-next b{color:#1f6b5f;font-weight:600;} #akx-glance .ed-next .nlbl{color:#9a948b;text-transform:uppercase;font-size:.66rem;letter-spacing:.04em;margin-right:5px;font-family:'Inter',sans-serif;font-weight:700;}
  #akx-glance .ed-sum{font-size:.92rem;color:#5A5A5A;line-height:1.55;margin-bottom:10px;} #akx-glance .ed-sum .sep{color:#cfc8bc;padding:0 6px;}
  #akx-glance .loc{font-size:.85rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;white-space:nowrap;margin-right:14px;} #akx-glance .loc svg{width:11px;height:11px;} #akx-glance .loc.chelt{color:#5A5A5A;} #akx-glance .loc.ciren{color:#5B8C1A;}
  #akx-glance .cta{display:inline-block;background:#E4F1E7;color:#0B7A3B;border:1px solid #C4E1CC;font-weight:600;font-size:.84rem;text-decoration:none;padding:8px 16px;border-radius:999px;margin-top:8px;}
  #akx-glance .cta.coral{background:#F8E8DF;color:#B85C37;border-color:#EDCDBD;}

  #akx-glance .wag-empty{padding:20px;text-align:center;color:#9a948b;font-size:.9rem;}

  /* term dates — quiet, at the bottom */
  #akx-glance .wag-term{margin-top:14px;display:flex;gap:12px;align-items:flex-start;background:#FBF6ED;border:1px solid #EFE7D6;border-radius:10px;padding:11px 15px;font-size:.88rem;line-height:1.55;color:#7a746b;}
  #akx-glance .wag-pill{flex:none;align-self:flex-start;margin-top:1px;font-family:'Inter',sans-serif;font-weight:800;font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;color:#8a6d2f;background:#EFE3C8;border-radius:999px;padding:5px 11px;}
  #akx-glance .wag-term .line{display:block;} #akx-glance .wag-term b{font-weight:700;color:#4a4a48;} #akx-glance .wag-term .ht{color:#a49a86;}

  @media(max-width:640px){
    #akx-glance .wag-h{font-size:1.5rem;} #akx-glance .wag-lead{font-size:.95rem;}
    #akx-glance .dh{grid-template-columns:48px 1fr auto;column-gap:10px;padding:12px 13px;}
    #akx-glance .dtoggle{font-size:0;gap:0;} #akx-glance .dtoggle .chev{font-size:.8rem;}
    #akx-glance .oh, #akx-glance .ddetails{margin-left:0;padding-left:13px;}
    #akx-glance .ddetails{padding-right:13px;}
  }
`;

  /* ================= helpers ================= */
  function mins(t){var p=t.split(':');return (+p[0])*60+(+p[1]);}
  function pin(loc){return loc==='ciren'?PIN_CI:PIN_CH;}
  function locName(loc){return loc==='ciren'?'Cirencester':'Cheltenham';}
  function locHTML(e){return '<span class="loc '+e.loc+'">'+pin(e.loc)+locName(e.loc)+'</span>';}
  function sumHTML(s){return s.split('|').map(function(x,i){return (i?'<span class="sep">&middot;</span>':'')+x;}).join('');}
  function ctaAttrs(e){return 'href="'+e.cta.url+'"'+(e.cta.ext?' target="_blank" rel="noopener"':'');}
  function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function mkeyOf(e){return e.feed?(e.feed==='weekend'?'weekend':(e.feed+'|'+e.day+'|'+e.time)):'static';}
  function firstItem(e){var d=NEXT[mkeyOf(e)];return d&&d.items&&d.items[0]?d.items[0]:null;}
  function todayAbbr(){try{return new Intl.DateTimeFormat('en-GB',{weekday:'short'}).format(new Date());}catch(_){return '';}}

  function matchTab(e,tab){
    if(tab==='All')return true;
    if(tab==='Get started')return !!e.start;
    if(tab==='AM')return mins(e.time)<=720;
    if(tab==='PM')return mins(e.time)>720;
    if(tab==='In-depth')return !!e.depth;
    if(tab==='Cheltenham')return e.loc==='chelt';
    if(tab==='Branches')return e.loc!=='chelt';
    return true;
  }

  /* the dates line inside the expanded details */
  function datesLine(k){
    if(k==='static') return '';
    var d=NEXT[k]; if(!d) return '';                                  /* not loaded / fetch failed: no line */
    if(!d.items||!d.items.length) return '<span class="nlbl">Resumes next term</span> &mdash; see calendar';
    var it=d.items, f=it[0];
    var future=f.start && (Date.parse(f.start)>Date.now());
    var word=(f.isnew&&future)?'Starts':'Next';
    return '<span class="nlbl">'+word+'</span> <b>'+f.date+'</b>'+(it[1]?', then <b>'+it[1].date+'</b>':'');
  }

  /* one collapsed event line: time + name(+chips) */
  function eventLine(e){
    var f=firstItem(e);
    var titled=f&&f.title;
    var name=titled?'<span class="dname tt">'+esc(f.title)+'</span>':'<span class="dname">'+e.name+'</span>';
    var chips='';
    if(f&&f.talk) chips+='<span class="chip talk">Talk</span>';
    else if(e.free) chips+='<span class="chip free">Free</span>';
    if(f&&f.isnew) chips+='<span class="chip new">New</span>';
    return '<div class="dev"><span class="dtime">'+e.time+'</span> '+name+' '+chips+'</div>';
  }

  /* one event's block inside the expanded details */
  function eventDetail(e,multi){
    var dl=datesLine(mkeyOf(e));
    return '<div class="ed">'
      +(multi?'<div class="ed-h">'+e.time+' &middot; '+e.name+(e.dur?' ('+e.dur+')':'')+'</div>':'')
      +(dl?'<div class="ed-next">'+dl+'</div>':'')
      +'<div class="ed-sum">'+sumHTML(e.sum)+'</div>'
      +locHTML(e)
      +'<div><a class="cta'+(e.cta.coral?' coral':'')+'" '+ctaAttrs(e)+'>'+e.cta.label+'</a></div>'
      +'</div>';
  }

  function dayBlock(day, group){
    var today=(day===todayAbbr());
    var multi=group.length>1;
    var lines=group.map(eventLine).join('');
    var ohs=group.filter(function(e){return e.oh;}).map(function(e){
      return '<div class="oh"><span class="oh-pill">Open House</span><span><b>'+e.oh+'</b> &mdash; '+OH_INVITE+'</span></div>';
    }).join('');
    var details=group.map(function(e){return eventDetail(e,multi);}).join('');
    return '<div class="dayblk'+(today?' today':'')+'">'
      +'<div class="dh"><div class="dday">'+day+'</div>'
      +'<div class="devents">'+lines+'</div>'
      +'<span class="dtoggle">Dates &amp; details <span class="chev">&#9662;</span></span></div>'
      +ohs
      +'<div class="ddetails">'+details+'</div></div>';
  }

  function termHTML(){
    return '<div class="wag-term"><span class="wag-pill">Term dates</span><div>'
      +'<span class="line"><b>Autumn Term:</b> 22 Aug &ndash; 15 Dec <span class="ht">(half-term 8&ndash;15 Oct)</span></span>'
      +'<span class="line"><b>Spring Term:</b> from 2 Jan 2027</span>'
      +'</div></div>';
  }

  function buildHTML(){
    return '<div class="wag">'
      +'<h2 class="wag-h">Week at a Glance</h2>'
      +'<div class="wag-lead">Here&rsquo;s the week at a glance &mdash; tap any day for its dates and details.</div>'
      +'<div class="f-tabs">'+TABS.map(function(t){return '<button class="f-tab" data-tab="'+t+'">'+t+'</button>';}).join('')+'</div>'
      +'<div class="wag-list"></div>'
      +termHTML()
    +'</div>';
  }

  function render(root, tab){
    tab=tab||'All';
    root.setAttribute('data-tab',tab);
    root.querySelectorAll('.f-tab').forEach(function(b){b.classList.toggle('on', b.getAttribute('data-tab')===tab);});
    var evs=EVENTS.filter(function(e){return matchTab(e,tab);});
    var html='', i=0;
    while(i<evs.length){
      var day=evs[i].day, group=[];
      while(i<evs.length && evs[i].day===day){ group.push(evs[i]); i++; }
      html+=dayBlock(day,group);
    }
    var list=root.querySelector('.wag-list');
    list.innerHTML=html||'<div class="wag-empty">Nothing in this filter.</div>';
    list.querySelectorAll('.dayblk').forEach(function(blk){
      blk.addEventListener('click',function(ev){ if(ev.target.closest('a')) return; blk.classList.toggle('open'); });
    });
  }

  function wire(root){
    root.querySelectorAll('.f-tab').forEach(function(b){
      b.addEventListener('click',function(){render(root, b.getAttribute('data-tab'));});
    });
  }

  /* ================= live calendar layer ================= */
  function fmtWD(s){return new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'short'}).format(new Date(s));}
  function fmtHM(s,allDay){if(allDay)return'all';return new Intl.DateTimeFormat('en-GB',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(s));}
  function fmtNice(s,allDay){return new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'short',day:'numeric',month:'short'}).format(new Date(s)).replace(',','');}
  function isTalk(t){return /\[talk\]/i.test(t||'');}
  function isNew(t){return /\[new\]/i.test(t||'');}
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
        items=arr.slice(0,2).map(function(x){return {date:x.nice,title:cleanTitle(x.summary),talk:isTalk(x.summary),isnew:isNew(x.summary),start:x.start};});
      }else{
        items=arr.filter(function(x){return x.day===e.day && x.time===e.time;}).slice(0,2)
          .map(function(x){return {date:x.nice,title:isTalk(x.summary)?cleanTitle(x.summary):'',talk:isTalk(x.summary),isnew:isNew(x.summary),start:x.start};});
      }
      NEXT[k]={items:items};
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
      buildNext(byFeed);
      render(root, root.getAttribute('data-tab')||'All');        /* re-render with live titles/chips/dates */
    }).catch(function(){/* keep static */});
  }

  function init(){
    var mount=document.getElementById(MOUNT_ID); if(!mount) return;
    if(mount.getAttribute('data-akx-done')==='1') return;
    if(!document.getElementById('akx-glance-style')){var st=document.createElement('style');st.id='akx-glance-style';st.textContent=STYLE;document.head.appendChild(st);}
    mount.innerHTML=buildHTML(); mount.setAttribute('data-akx-done','1');
    wire(mount); render(mount,'All');    /* static list first, always */
    loadLive(mount);                     /* then enhance with live dates */
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
