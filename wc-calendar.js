/* Akanishta — Weekly Classes calendar (live Google Calendar feed).
   ONE file, per-page presets. Include with a stub like:
       <div id="calendar" style="scroll-margin-top:130px;"></div>
       <div id="akx-cal" data-cal="weekly"></div>
       <script src="https://kadampacheltenham.github.io/akx-widgets/calendar.js" defer></script>
   data-cal picks the preset (see PRESETS below): "whatson" | "weekly".
   Each preset sets its own title, default view, and which feeds show. */
(function(){
  var API_KEY = 'AIzaSyAVm0epUASAL2aNbAN_aBmpDDPxoPJVOwA';
  var TZ = 'Europe/London';
  // ---- master feed list (all five calendars) ----
  var FEEDS = {
    weekly:   { name:'Weekly classes (Cheltenham)', color:'#2E7C7C', id:'c_9e95a300a2d0f8775b28d30ebfe5eb816d8dc678d4dffbebbc09cd59d9208ffd@group.calendar.google.com' },
    branch:   { name:'Branch classes',              color:'#4FA35A', id:'c_6b6fc5b8541682cc520a71d1bc5683dc16d14d2e907ef4da85a1e7479a73c798@group.calendar.google.com' },
    weekend:  { name:'Courses & retreats',          color:'#E2886A', id:'c_687cfcac60ad1fa647cd2fb654774156e1e48fb2dcbcf5c40a72340e422a4b08@group.calendar.google.com' },
    prayers:  { name:'Prayers & Pujas',             color:'#7E5CA8', id:'c_7120941805c32581a9dca9a00783a100d6d53914fc8915ee8df40ae74d864504@group.calendar.google.com' },
    announce: { name:'Announcements',               color:'#BEB8AC', pinned:true, id:'c_8tho1a5ip2rh1g154iea6h0c0k@group.calendar.google.com' }
  };
  // ---- per-page presets: title (blue), default view, and which feeds (on:false = present but off by default) ----
  var PRESETS = {
    whatson: { title:'Upcoming Classes & Courses', mode:'list',
               feeds:[ {k:'weekly'}, {k:'branch',on:false}, {k:'weekend'}, {k:'prayers',on:false}, {k:'announce'} ] },
    weekly:  { title:'Weekly Classes Calendar', mode:'list',
               feeds:[ {k:'weekly'}, {k:'branch'}, {k:'announce'} ] }
    // add more pages here later, e.g. courses / prayers, then set data-cal on the stub.
  };

  var root = document.getElementById('akx-cal');
  if(!root || root.getAttribute('data-akx-done')==='1') return;
  root.setAttribute('data-akx-done','1');
  var P = PRESETS.weekly;   // Weekly Classes
  var CALS = P.feeds.map(function(f){ var base=FEEDS[f.k]; return Object.assign({key:f.k, on:f.on}, base); })
                    .filter(function(c){ return c && /@/.test(c.id); });
  var TITLE = P.title;

  var enabled = {}; CALS.forEach(function(c){ enabled[c.key]= c.pinned ? true : (c.on!==false); });
  var view = new Date(); view.setDate(1);
  var mode = P.mode || 'list';
  var ALL = [];            // flat, expanded, deduped events
  var seen = {};           // uid -> true
  var fetched = {};        // calId|Y-M -> true
  var loading = false;

  var CSS = ''
  + '#akx-cal{--coral:#E2886A;--ink:#1D1D1F;--muted:#6B6B6E;--line:#ECE9E2;color:var(--ink);max-width:1000px;margin:0 auto;}'  /* lotus/content width */
  + '#akx-cal *{box-sizing:border-box;}'
  + '#akx-cal .cal-title{margin:0 auto 20px;text-align:center;font-family:\'Inter\',sans-serif;font-size:1.15rem;font-weight:600;color:#2A66A6;text-transform:uppercase;letter-spacing:0.04em;}'  /* blue heading — site standard */
  + '#akx-cal .card{background:#fff;border-radius:16px;box-shadow:0 6px 30px rgba(0,0,0,.07);padding:22px 22px 26px;}'
  + '#akx-cal .ann{display:flex;gap:12px;align-items:flex-start;background:#F3F0EA;border:1px solid #E6E1D6;border-left:5px solid var(--acol,#8F887A);border-radius:12px;padding:14px 16px;margin-bottom:16px;color:#3f3d39;font-size:.96rem;line-height:1.5;}'
  + '#akx-cal .ann svg{flex:none;margin-top:1px;}'
  + '#akx-cal .ann strong{color:#2c2b28;}'
  + '#akx-cal .top{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:16px;}'
  + '#akx-cal .mnav{display:flex;align-items:center;gap:10px;}'
  + '#akx-cal .mnav h2{margin:0;font-size:1.5rem;font-weight:600;min-width:180px;}'
  + '#akx-cal .nb{border:1px solid var(--line);background:#fff;width:38px;height:38px;border-radius:10px;font-size:1.1rem;color:var(--ink);cursor:pointer;line-height:1;}'
  + '#akx-cal .nb:hover,#akx-cal .tb:hover,#akx-cal .vt button:hover{background:#faf7f1;}'
  + '#akx-cal .tb{border:1px solid var(--line);background:#fff;height:38px;padding:0 14px;border-radius:10px;font-size:.9rem;cursor:pointer;color:var(--ink);}'
  + '#akx-cal .vt{display:inline-flex;border:1px solid var(--line);border-radius:10px;overflow:hidden;}'
  + '#akx-cal .vt button{border:0;background:#fff;padding:9px 16px;font-size:.9rem;cursor:pointer;color:var(--muted);}'
  + '#akx-cal .vt button.on{background:var(--coral);color:#fff;}'
  + '#akx-cal .filters{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;}'
  + '#akx-cal .pill{display:inline-flex;align-items:center;gap:8px;border:1.5px solid var(--line);background:#fff;border-radius:999px;padding:7px 14px 7px 12px;font-size:.86rem;user-select:none;color:var(--muted);}'
  + '#akx-cal .pill.tog{cursor:pointer;}'
  + '#akx-cal .pill .dot{width:11px;height:11px;border-radius:50%;flex:none;}'
  + '#akx-cal .pill.on{color:var(--ink);border-color:transparent;}'
  + '#akx-cal .pill.off{opacity:.55;}#akx-cal .pill.off .dot{background:#c9c9c9!important;}'
  + '#akx-cal .pill .lk{font-size:.7rem;opacity:.6;margin-left:2px;}'
  + '#akx-cal .wh{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px;}'
  + '#akx-cal .wh div{font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:2px 6px;}'
  + '#akx-cal .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}'
  + '#akx-cal .cell{min-height:104px;min-width:0;overflow:hidden;border:1px solid var(--line);border-radius:10px;padding:6px 6px 8px;background:#fff;display:flex;flex-direction:column;gap:4px;}'
  + '#akx-cal .cell.other{background:#faf8f4;color:#bcb8b0;}'
  + '#akx-cal .cell.closed{background:#F3F0EA;}'
  + '#akx-cal .cell .num{font-size:.8rem;color:var(--muted);padding:1px 3px;}'
  + '#akx-cal .cell.today .num{background:var(--coral);color:#fff;border-radius:50%;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-weight:600;}'
  + '#akx-cal .ev{font-size:.74rem;line-height:1.2;color:#fff;border-radius:6px;padding:3px 6px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
  + '#akx-cal .ev .t{opacity:.85;}'
  + '#akx-cal .more{font-size:.72rem;color:var(--muted);cursor:pointer;padding:1px 4px;}'
  + '#akx-cal .list .dg{border-top:1px solid var(--line);padding:14px 2px;}#akx-cal .list .dg:first-child{border-top:0;}'
  + '#akx-cal .dl{font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;}'
  + '#akx-cal .li{display:flex;align-items:flex-start;gap:12px;padding:8px 0;cursor:pointer;}'
  + '#akx-cal .li .dot{width:11px;height:11px;border-radius:50%;margin-top:6px;flex:none;}'
  + '#akx-cal .li .tm{width:82px;flex:none;color:var(--muted);font-size:.9rem;}'
  + '#akx-cal .li .ti{font-weight:600;}#akx-cal .li .lo{color:var(--muted);font-size:.86rem;}'
  + '#akx-cal .msg{padding:40px 10px;text-align:center;color:var(--muted);}'
  + '#akx-cal .ov{position:fixed;inset:0;background:rgba(20,18,16,.5);display:none;align-items:center;justify-content:center;padding:20px;z-index:9999;}'
  + '#akx-cal .ov.show{display:flex;}'
  + '#akx-cal .modal{background:#fff;border-radius:16px;max-width:420px;width:100%;padding:26px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.25);}'
  + '#akx-cal .modal .x{position:absolute;top:14px;right:16px;border:0;background:none;font-size:1.4rem;cursor:pointer;color:var(--muted);line-height:1;}'
  + '#akx-cal .modal .kick{display:inline-flex;align-items:center;gap:7px;font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;}'
  + '#akx-cal .modal .kick .dot{width:10px;height:10px;border-radius:50%;}'
  + '#akx-cal .modal h3{margin:0 0 10px;font-size:1.3rem;}'
  + '#akx-cal .modal .meta{color:var(--muted);font-size:.95rem;margin:0 0 4px;}'
  + '#akx-cal .modal .desc{margin:14px 0 0;color:#4a4a4c;line-height:1.55;font-size:.95rem;white-space:pre-wrap;}'
  + '#akx-cal .book{display:inline-block;margin-top:20px;background:var(--coral);color:#fff;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:600;font-size:.95rem;}'
  + '@media(max-width:720px){#akx-cal .gridwrap{display:none;}#akx-cal .list{display:block!important;}#akx-cal .vt{display:none;}#akx-cal .mnav h2{min-width:0;font-size:1.25rem;}}';

  root.innerHTML = '<style>'+CSS+'</style>'
    + (TITLE?'<h2 class="cal-title">'+esc(TITLE)+'</h2>':'')
    + '<div id="akx-banner"></div>'
    + '<div class="card">'
    + '  <div class="top">'
    + '    <div class="mnav"><button class="nb" data-a="prev">&#8249;</button><h2 id="akx-ml"></h2>'
    + '      <button class="nb" data-a="next">&#8250;</button><button class="tb" data-a="today">Today</button></div>'
    + '    <div class="vt"><button data-v="month">Month</button><button data-v="list" class="on">Upcoming</button></div>'
    + '  </div>'
    + '  <div class="filters" id="akx-filters"></div>'
    + '  <div id="akx-body"></div>'
    + '</div>'
    + '<div class="ov" id="akx-ov"><div class="modal" id="akx-modal"></div></div>';

  function pad(n){return (n<10?'0':'')+n;}
  function ymdLocal(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
  function parseYmd(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
  function ymdOf(dtStr, allDay){
    if(allDay) return dtStr.slice(0,10);
    return new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(dtStr));
  }
  function fmtTime(dtStr, allDay){
    if(allDay) return 'All day';
    var s=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(dtStr));
    return s.replace(' ','').replace(':00','').toLowerCase();
  }
  function longDate(d){return new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);}
  function dayMon(d){return new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'short',day:'numeric',month:'short'}).format(d);}
  function stripHtml(h){var t=document.createElement('div');t.innerHTML=h||'';return (t.textContent||'').trim();}
  function findBooking(t){if(!t)return null;var m=t.match(/https?:\/\/[^\s"'<>]*tickettailor\.com[^\s"'<>]*/i);return m?m[0]:null;}
  function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function base(item, cal){
    var allDay=!!(item.start&&item.start.date);
    var startStr=item.start?(item.start.dateTime||item.start.date):null;
    var rawDesc=item.description||'';
    var book=findBooking(rawDesc)||findBooking(item.location);
    var desc=stripHtml(rawDesc);
    if(book) desc=desc.replace(book,'').replace(/\bbook(ing)?\s*(here|now)?\s*:?\s*$/i,'').replace(/\s{2,}/g,' ').trim();
    return {id:item.id, calKey:cal.key, color:cal.color, calName:cal.name, pinned:!!cal.pinned,
            title:item.summary||'(untitled)', start:startStr, allDay:allDay,
            loc:item.location||'', desc:desc, book:book,
            endDate:(allDay&&item.end&&item.end.date)?item.end.date:null};
  }
  function expand(item, cal){
    var b=base(item,cal); if(!b.start) return [];
    if(b.allDay && b.endDate){                          // multi-day all-day (e.g. a closure)
      var out=[], d=parseYmd(b.start), end=parseYmd(b.endDate), g=0;   // end is exclusive
      while(d<end && g<400){ var o=Object.assign({},b,{ymd:ymdLocal(d)}); out.push(o); d.setDate(d.getDate()+1); g++; }
      return out;
    }
    b.ymd=ymdOf(b.start,b.allDay); return [b];
  }
  function ingest(items, cal){
    items.forEach(function(it){ expand(it,cal).forEach(function(e){
      var uid=e.calKey+'|'+e.id+'|'+e.ymd; if(seen[uid])return; seen[uid]=true; ALL.push(e);
    }); });
  }
  function apiUrl(cal, tMin, tMax){
    return 'https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(cal.id)
      +'/events?singleEvents=true&orderBy=startTime&maxResults=250&key='+API_KEY
      +'&timeMin='+encodeURIComponent(tMin)+'&timeMax='+encodeURIComponent(tMax);
  }
  function fetchMonth(cal, y, m){
    var k=cal.id+'|'+y+'-'+m; if(fetched[k]) return Promise.resolve(); fetched[k]=true;
    var tMin=new Date(y,m,1).toISOString(), tMax=new Date(y,m+1,1).toISOString();
    return fetch(apiUrl(cal,tMin,tMax)).then(function(r){return r.json();}).then(function(j){
      if(j.error){console.warn('Calendar error',cal.name,j.error);return;} ingest(j.items||[],cal);
    }).catch(function(e){console.warn('Calendar fetch failed',cal.name,e);});
  }
  function ensure(){
    var y=view.getFullYear(), m=view.getMonth(), jobs=[];
    [[y,m-1],[y,m],[y,m+1]].forEach(function(a){var d=new Date(a[0],a[1],1);
      CALS.forEach(function(c){ jobs.push(fetchMonth(c,d.getFullYear(),d.getMonth())); }); });
    return Promise.all(jobs);
  }
  function eventsOn(ymd){
    return ALL.filter(function(e){return e.ymd===ymd && enabled[e.calKey];})
              .sort(function(a,b){ if(a.allDay!==b.allDay) return a.allDay?-1:1; return (a.start||'').localeCompare(b.start||''); });
  }

  // ---- closure / announcement banner (always visible, month-independent) ----
  function rangeStr(startStr, endDate, allDay){
    if(allDay){
      var s=parseYmd(startStr);
      if(endDate){ var last=parseYmd(endDate); last.setDate(last.getDate()-1);
        if(ymdLocal(last)!==ymdLocal(s)) return dayMon(s)+' &ndash; '+dayMon(last); }
      return new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long'}).format(s);
    }
    return longDate(new Date(startStr))+', '+fmtTime(startStr,false);
  }
  function loadBanner(){
    var pins=CALS.filter(function(c){return c.pinned;}); if(!pins.length){return;}
    var now=new Date(), t0=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    var tMin=t0.toISOString(), tMax=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()+90).toISOString();
    Promise.all(pins.map(function(c){
      return fetch(apiUrl(c,tMin,tMax)).then(function(r){return r.json();})
        .then(function(j){return {cal:c,items:(j.items||[])};}).catch(function(){return {cal:c,items:[]};});
    })).then(function(res){
      var anns=[];
      res.forEach(function(r){ r.items.forEach(function(it){
        var allDay=!!(it.start&&it.start.date);
        anns.push({color:r.cal.color, title:it.summary||'Notice',
                   start:(it.start&&(it.start.dateTime||it.start.date)),
                   endDate:(allDay&&it.end&&it.end.date)?it.end.date:null, allDay:allDay});
      }); });
      anns.sort(function(a,b){return (a.start||'').localeCompare(b.start||'');});
      var box=document.getElementById('akx-banner'); box.innerHTML='';
      anns.slice(0,3).forEach(function(a){
        var el=document.createElement('div'); el.className='ann'; el.style.setProperty('--acol',a.color);
        el.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="'+a.color+'" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01M11 12h1v4h1"></path></svg>'
          +'<div><strong>'+esc(a.title)+'</strong> &middot; '+rangeStr(a.start,a.endDate,a.allDay)+'</div>';
        box.appendChild(el);
      });
    });
  }

  function openModal(e){
    var when = e.allDay ? rangeStr(e.start,e.endDate,true) : longDate(new Date(e.start))+'<br>'+fmtTime(e.start,false)+(e.loc?' &middot; '+esc(e.loc):'');
    document.getElementById('akx-modal').innerHTML=
      '<button class="x" data-a="close">&times;</button>'
      +'<div class="kick"><span class="dot" style="background:'+e.color+'"></span>'+esc(e.calName)+'</div>'
      +'<h3>'+esc(e.title)+'</h3>'
      +'<p class="meta">'+when+'</p>'
      +(e.allDay&&e.loc?'<p class="meta">'+esc(e.loc)+'</p>':'')
      +(e.desc?'<p class="desc">'+esc(e.desc)+'</p>':'')
      +(e.book?'<a class="book" href="'+e.book+'" target="_blank" rel="noopener">Book now &rarr;</a>':'');
    document.getElementById('akx-ov').classList.add('show');
  }

  function renderFilters(){
    var f=document.getElementById('akx-filters'); f.innerHTML='';
    var toggleable=CALS.filter(function(c){return !c.pinned;});
    if(toggleable.length<2 && CALS.length<2){ return; }   // nothing meaningful to show
    CALS.forEach(function(c){
      var on=enabled[c.key], pin=!!c.pinned;
      var el=document.createElement('div'); el.className='pill '+(on?'on':'off')+(pin?'':' tog');
      if(on) el.style.background=hexA(c.color,.13);
      el.innerHTML='<span class="dot" style="background:'+c.color+'"></span>'+esc(c.name)+(pin?'<span class="lk" title="Always shown">&#128274;</span>':'');
      if(!pin) el.onclick=function(){ enabled[c.key]=!enabled[c.key]; draw(); };
      f.appendChild(el);
    });
  }
  function hexA(hex,a){var n=parseInt(hex.slice(1),16);return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';}

  function drawMonth(){
    var y=view.getFullYear(), m=view.getMonth();
    var html='<div class="gridwrap"><div class="wh">'
      +['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(function(d){return '<div>'+d+'</div>';}).join('')+'</div><div class="grid">';
    var first=new Date(y,m,1), start=(first.getDay()+6)%7, gs=new Date(y,m,1-start);
    var todayYmd=ymdLocal(new Date());
    for(var i=0;i<42;i++){
      var d=new Date(gs); d.setDate(gs.getDate()+i);
      var ymd=ymdLocal(d), other=d.getMonth()!==m, evs=eventsOn(ymd);
      var closed=evs.some(function(e){return e.pinned;});
      html+='<div class="cell'+(other?' other':'')+(closed?' closed':'')+(ymd===todayYmd?' today':'')+'"><div class="num">'+d.getDate()+'</div>';
      evs.slice(0,3).forEach(function(e,idx){
        html+='<div class="ev" data-ymd="'+ymd+'" data-i="'+idx+'" style="background:'+e.color+(e.pinned?';color:#4a4740':'')+'">'
          +(e.allDay?'':'<span class="t">'+fmtTime(e.start,false)+'</span> ')+esc(e.title)+'</div>';
      });
      if(evs.length>3) html+='<div class="more" data-a="list">+'+(evs.length-3)+' more</div>';
      html+='</div>';
    }
    return html+'</div></div>';
  }
  function drawList(){
    var y=view.getFullYear(), m=view.getMonth(), days=new Date(y,m+1,0).getDate(), html='<div class="list">', any=false, shown={};
    for(var dd=1;dd<=days;dd++){
      var d=new Date(y,m,dd), ymd=y+'-'+pad(m+1)+'-'+pad(dd), evs=eventsOn(ymd), rows='';
      evs.forEach(function(e,idx){
        var multi = e.allDay && e.endDate && (parseYmd(e.endDate)-parseYmd(e.start) > 86400000);
        if(multi){ if(shown[e.id]) return; shown[e.id]=true; }
        var tm = multi ? '' : fmtTime(e.start,e.allDay);
        var sub = multi ? rangeStr(e.start,e.endDate,true) : '';  /* address hidden in list view to save space (mobile); branch town lives in the event title. Pop-up still shows it. */
        rows+='<div class="li" data-ymd="'+ymd+'" data-i="'+idx+'"><span class="dot" style="background:'+e.color+'"></span>'
          +'<span class="tm">'+tm+'</span>'
          +'<span><span class="ti">'+esc(e.title)+'</span>'+(sub?'<br><span class="lo">'+sub+'</span>':'')+(e.book?'<br><span class="lo">Booking recommended</span>':'')+'</span></div>';
      });
      if(!rows) continue; any=true;
      html+='<div class="dg"><div class="dl">'+new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'long',day:'numeric',month:'long'}).format(d)+'</div>'+rows+'</div>';
    }
    if(!any) html+='<div class="msg">No upcoming events this month.</div>';
    return html+'</div>';
  }
  function draw(){
    document.getElementById('akx-ml').textContent=new Intl.DateTimeFormat('en-GB',{month:'long',year:'numeric'}).format(view);
    renderFilters();
    var body=document.getElementById('akx-body');
    if(loading){ body.innerHTML='<div class="msg">Loading events&hellip;</div>'; return; }
    body.innerHTML = (mode==='month'? drawMonth() : drawList());
    root.querySelectorAll('.vt button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===mode);});
  }
  function refresh(){ loading=true; draw(); ensure().then(function(){ loading=false; draw(); }); }

  root.addEventListener('click', function(ev){
    var t=ev.target.closest('[data-a],[data-v],.ev,.li'); if(!t) return;
    var a=t.getAttribute('data-a'), v=t.getAttribute('data-v');
    if(v){ mode=v; root.querySelectorAll('.vt button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===v);}); draw(); return; }
    if(a==='prev'){ view.setMonth(view.getMonth()-1); refresh(); return; }
    if(a==='next'){ view.setMonth(view.getMonth()+1); refresh(); return; }
    if(a==='today'){ view=new Date(); view.setDate(1); refresh(); return; }
    if(a==='close'){ document.getElementById('akx-ov').classList.remove('show'); return; }
    if(a==='list'){ mode='list'; root.querySelectorAll('.vt button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')==='list');}); draw(); return; }
    if(t.classList.contains('ev')||t.classList.contains('li')){ var e=eventsOn(t.getAttribute('data-ymd'))[+t.getAttribute('data-i')]; if(e) openModal(e); }
  });
  document.getElementById('akx-ov').addEventListener('click',function(e){ if(e.target.id==='akx-ov') e.currentTarget.classList.remove('show'); });

  loadBanner();
  refresh();
})();
