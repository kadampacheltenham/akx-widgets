/* Akanishta - "When to Visit" widget. Opening hours derived from the LIVE Google Calendar.
   ONE shared file; reuse on any page. Include with a stub like:
       <div id="akx-visit" data-theme="light"></div>
       <script src="https://kadampacheltenham.github.io/akx-widgets/when-to-visit.js" defer></script>
   data-theme = "light" (default) | "dark". Desktop shows 7 days ahead, mobile 5.
   Open hours = timed events on the weekly + weekend + prayers calendars (on-site).
   Breaks    = all-day "Centre closed ..." events on the announcements calendar.
   Branch (Cirencester) events are excluded - different venue. */
(function(){
  var root=document.getElementById('akx-visit');
  if(!root || root.getAttribute('data-akx-done')==='1') return;
  root.setAttribute('data-akx-done','1');
  if(!root.getAttribute('data-theme')) root.setAttribute('data-theme','light');

  var API_KEY='AIzaSyAVm0epUASAL2aNbAN_aBmpDDPxoPJVOwA';
  var TZ='Europe/London';
  var OPEN_FEEDS=[
    'c_9e95a300a2d0f8775b28d30ebfe5eb816d8dc678d4dffbebbc09cd59d9208ffd@group.calendar.google.com', /* weekly (Cheltenham) */
    'c_687cfcac60ad1fa647cd2fb654774156e1e48fb2dcbcf5c40a72340e422a4b08@group.calendar.google.com', /* courses & retreats */
    'c_7120941805c32581a9dca9a00783a100d6d53914fc8915ee8df40ae74d864504@group.calendar.google.com'  /* prayers & pujas */
  ];
  var CLOSE_FEED='c_8tho1a5ip2rh1g154iea6h0c0k@group.calendar.google.com'; /* announcements (closures) */

  var CSS=
  '#akx-visit{--bg:#FBFAF7;--card:#fff;--ink:#241f33;--mut:#8b8698;--acc:#2A66A6;--line:#efeae0;'
  +'--date:#C0392B;--op-bg:#E9F3EC;--op-tx:#256B45;--op-dot:#3B9B5E;--cl-tx:#8b8698;'
  +'--for-bg:#FBEEE4;--for-tx:#B05C2C;font-family:inherit;color:var(--ink);max-width:900px;margin:0 auto;}'
  +'#akx-visit[data-theme="dark"]{--bg:#171126;--card:#221A38;--ink:#EDE9F6;--mut:#9E96B6;--acc:#A9BEE8;'
  +'--line:#2E2749;--date:#F0967E;--op-bg:#183A2A;--op-tx:#8FD9AE;--op-dot:#48C07E;--cl-tx:#9E96B6;'
  +'--for-bg:#3A2A20;--for-tx:#E7A877;}'
  +'#akx-visit *{box-sizing:border-box;}'
  +'#akx-visit .whead{font-weight:800;font-size:1.4rem;letter-spacing:-.01em;margin:0 0 12px;color:var(--acc);}'
  +'#akx-visit .st{border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;background:var(--op-bg);color:var(--op-tx);}'
  +'#akx-visit .st.closed{background:var(--card);color:var(--cl-tx);border:1px solid var(--line);}'
  +'#akx-visit .st .dot{width:13px;height:13px;border-radius:50%;flex:none;background:var(--op-dot);box-shadow:0 0 0 4px rgba(59,155,94,.2);}'
  +'#akx-visit .st.closed .dot{background:var(--cl-tx);box-shadow:none;}'
  +'#akx-visit .st .big{font-size:1.15rem;font-weight:700;line-height:1.25;}'
  +'#akx-visit .st .sub{font-size:.86rem;opacity:.9;margin-top:2px;}'
  +'#akx-visit .strip{display:flex;gap:9px;overflow-x:auto;padding:18px 2px 6px;-webkit-overflow-scrolling:touch;scrollbar-width:none;}'
  +'#akx-visit .strip::-webkit-scrollbar{height:0;}'
  +'#akx-visit .tile{flex:none;width:60px;height:72px;border-radius:15px;background:var(--card);border:1.5px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;position:relative;transition:.15s;}'
  +'#akx-visit .tile .dw{font-size:.62rem;font-weight:700;letter-spacing:.04em;color:var(--mut);}'
  +'#akx-visit .tile .dn{font-size:1.28rem;font-weight:700;color:var(--date);}'
  +'#akx-visit .tile .act{width:5px;height:5px;border-radius:50%;background:var(--op-dot);position:absolute;bottom:9px;}'
  +'#akx-visit .tile.closed{opacity:.5;} #akx-visit .tile.closed .act{display:none;}'
  +'#akx-visit .tile.today{border-color:var(--acc);}'
  +'#akx-visit .tile.sel{background:var(--acc);border-color:var(--acc);}'
  +'#akx-visit .tile.sel .dw,#akx-visit .tile.sel .dn{color:#fff;} #akx-visit .tile.sel .act{background:#fff;}'
  +'#akx-visit .brk{flex:none;min-width:112px;height:72px;border-radius:15px;border:1.5px dashed var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:0 10px;text-align:center;color:var(--mut);cursor:pointer;}'
  +'#akx-visit .brk b{font-size:.72rem;color:var(--ink);opacity:.85;line-height:1.15;} #akx-visit .brk small{font-size:.62rem;}'
  +'#akx-visit .detail{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:4px 18px 14px;}'
  +'#akx-visit .dhead{font-size:.72rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--mut);padding:12px 0 6px;}'
  +'#akx-visit .win{padding:13px 0;border-top:1px solid var(--line);}'
  +'#akx-visit .win:first-of-type{border-top:none;}'
  +'#akx-visit .wtime{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.1rem;letter-spacing:-.01em;color:var(--ink);}'
  +'#akx-visit .wtime .odot{width:9px;height:9px;border-radius:50%;background:var(--op-dot);flex:none;box-shadow:0 0 0 3px rgba(59,155,94,.16);}'
  +'#akx-visit .wevs{margin:7px 0 0 19px;}'
  +'#akx-visit .wev{font-size:.94rem;color:var(--mut);line-height:1.5;margin-top:4px;}'
  +'#akx-visit .wev:first-child{margin-top:0;}'
  +'#akx-visit .wev .en{color:var(--acc);font-weight:700;}'
  +'#akx-visit .wev .et{color:var(--mut);}'
  +'#akx-visit .cltxt{padding:14px 0;color:var(--cl-tx);font-size:.95rem;}'
  +'#akx-visit .msg{padding:22px 4px;color:var(--mut);font-size:.9rem;}'
  +'@media(min-width:768px){#akx-visit .st{max-width:420px;}}';
  if(!document.getElementById('akx-visit-css')){
    var stEl=document.createElement('style'); stEl.id='akx-visit-css'; stEl.textContent=CSS; document.head.appendChild(stEl);
  }

  /* ---------- date helpers (Europe/London) ---------- */
  function tzParts(date){
    var f=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});
    var o={}; f.formatToParts(date).forEach(function(p){o[p.type]=p.value;});
    var hh=(o.hour==='24')?'00':o.hour;
    return {ymd:o.year+'-'+o.month+'-'+o.day, hm:hh+':'+o.minute, min:(+hh)*60+(+o.minute)};
  }
  function ymdOf(date){return tzParts(date).ymd;}
  function noonUTC(ymd){return new Date(ymd+'T12:00:00Z');}
  function addDays(ymd,n){var d=noonUTC(ymd); d.setUTCDate(d.getUTCDate()+n); return ymdOf(d);}
  function diffDays(a,b){return Math.round((noonUTC(b)-noonUTC(a))/86400000);}
  function to12(hm){var p=hm.split(':'),h=+p[0],m=+p[1],ap=h<12?'am':'pm',h12=(h%12)||12;return h12+':'+(m<10?'0':'')+m+ap;}
  var DOWS=['SUN','MON','TUE','WED','THU','FRI','SAT'];
  var DOWL=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function disp(ymd){var d=noonUTC(ymd);return {ws:DOWS[d.getUTCDay()], wl:DOWL[d.getUTCDay()], dn:d.getUTCDate(), mo:MONS[d.getUTCMonth()]};}

  /* ---------- data store ---------- */
  var byDate={};      /* ymd -> [{startMin,endMin,startHM,endHM,name}] */
  var closures=[];    /* {from,to,label,raw} */
  var loaded=false, failed=false;

  function apiUrl(id,tMin,tMax){
    return 'https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(id)
      +'/events?singleEvents=true&orderBy=startTime&maxResults=250&key='+API_KEY
      +'&timeMin='+encodeURIComponent(tMin)+'&timeMax='+encodeURIComponent(tMax);
  }
  function esc(s){return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}

  function ingestOpen(items){
    items.forEach(function(it){
      if(!it.start||!it.start.dateTime) return;                 /* timed events only */
      var s=new Date(it.start.dateTime);
      var e=new Date(it.end&&it.end.dateTime?it.end.dateTime:it.start.dateTime);
      var sp=tzParts(s), ep=tzParts(e);
      var em=ep.min; if(ep.ymd!==sp.ymd) em=24*60;              /* crosses midnight -> clamp to end of day */
      if(em<sp.min) em=sp.min;
      (byDate[sp.ymd]=byDate[sp.ymd]||[]).push({startMin:sp.min,endMin:em,startHM:sp.hm,endHM:(em>=24*60?'23:59':ep.hm),name:esc((it.summary||'Open').trim())});
    });
  }
  function ingestClose(items){
    items.forEach(function(it){
      var sum=(it.summary||''); if(!/clos/i.test(sum)) return;
      var from,to;
      if(it.start.date){ from=it.start.date; to=addDays(it.end.date,-1); }   /* all-day, end exclusive */
      else if(it.start.dateTime){ from=ymdOf(new Date(it.start.dateTime)); to=ymdOf(new Date(it.end.dateTime)); }
      else return;
      var label=sum.replace(/^centre\s+closed\s*(for\s+the\s+|for\s+)?/i,'').replace(/^closed\s*(for\s+the\s+|for\s+)?/i,'').trim();
      closures.push({from:from,to:to,label:label||'Closed',raw:esc(sum)});
    });
  }
  function closureFor(ymd){for(var i=0;i<closures.length;i++){if(ymd>=closures[i].from&&ymd<=closures[i].to)return closures[i];}return null;}

  function windowsFor(ymd){
    var evs=(byDate[ymd]||[]).slice().sort(function(a,b){return a.startMin-b.startMin;});
    var w=[];
    evs.forEach(function(e){
      var cur=w[w.length-1];
      if(cur && e.startMin<=cur.endMin){ if(e.endMin>cur.endMin){cur.endMin=e.endMin;cur.endHM=e.endHM;} cur.events.push(e); }
      else w.push({startMin:e.startMin,endMin:e.endMin,startHM:e.startHM,endHM:e.endHM,events:[e]});
    });
    return w;
  }
  function resolve(ymd){
    var c=closureFor(ymd); if(c) return {ymd:ymd,closure:c};
    var w=windowsFor(ymd); if(w.length) return {ymd:ymd,wins:w};
    return {ymd:ymd,closed:true};
  }
  function nextOpen(fromYmd){
    for(var i=1;i<=28;i++){var y=addDays(fromYmd,i); var r=resolve(y); if(r.wins) return {ymd:y,win:r.wins[0]};}
    return null;
  }
  function whenLabel(today,ymd){
    if(ymd===addDays(today,1)) return 'tomorrow';
    var d=disp(ymd); return d.wl+' '+d.dn+' '+d.mo;
  }

  /* ---------- build the visible strip (collapse breaks to one chip) ---------- */
  function build(N){
    var today=ymdOf(new Date());
    var out=[], count=0, i=0, guard=0;
    while(count<N && guard<500){
      guard++;
      var y=addDays(today,i); var r=resolve(y);
      if(r.closure){ r.isChip=true; r.reopen=nextOpen(r.closure.to); out.push(r); i=diffDays(today,r.closure.to)+1; continue; }
      out.push(r); count++; i++;
    }
    return {today:today,days:out};
  }

  function liveStatus(today){
    var mins=tzParts(new Date()).min;
    var c=closureFor(today);
    if(c){ var no=nextOpen(c.to); return {open:false,big:'Closed'+(c.label&&!/^closed$/i.test(c.label)?' for '+c.label:''),sub:no?('Reopens '+whenLabel(today,no.ymd)+', '+to12(no.win.startHM)):c.raw}; }
    var r=resolve(today);
    if(r.closed){ var nx=nextOpen(today); return {open:false,big:'Closed today',sub:nx?('Open again '+whenLabel(today,nx.ymd)+', '+to12(nx.win.startHM)):''}; }
    for(var i=0;i<r.wins.length;i++){
      var w=r.wins[i];
      if(mins>=w.startMin && mins<w.endMin) return {open:true,big:"We're open now",sub:'for '+w.events[0].name+' (until '+to12(w.endHM)+')'};
      if(mins<w.startMin) return {open:false,big:'Opens '+to12(w.startHM)+' today',sub:'for '+w.events[0].name};
    }
    var n2=nextOpen(today);
    return {open:false,big:'Closed now',sub:n2?('Open again '+whenLabel(today,n2.ymd)+', '+to12(n2.win.startHM)):''};
  }

  /* ---------- render ---------- */
  function evLine(e,w){
    var diff=(e.startHM!==w.startHM || e.endHM!==w.endHM);
    var t=diff?' <span class="et">('+to12(e.startHM)+' &ndash; '+to12(e.endHM)+')</span>':'';
    return '<div class="wev"><span class="en">'+e.name+'</span>'+t+'</div>';
  }
  function winHTML(w){
    return '<div class="win"><div class="wtime"><span class="odot"></span>Open '+to12(w.startHM)+' &ndash; '+to12(w.endHM)+'</div>'
      +'<div class="wevs">'+w.events.map(function(e){return evLine(e,w);}).join('')+'</div></div>';
  }
  function detailHTML(r,isToday){
    if(r.closure) return '<div class="cltxt">'+r.closure.raw+'.'+(r.reopen?(' We reopen '+whenLabel(build(1).today,r.reopen.ymd)+', '+to12(r.reopen.win.startHM)+'.'):'')+'</div>';
    if(r.closed) return '<div class="cltxt">'+(isToday?'Closed today.':'Closed.')+'</div>';
    return r.wins.map(winHTML).join('');
  }
  function headLabel(ymd,isToday){var d=disp(ymd);return (isToday?'Today &middot; ':'')+d.wl+' '+d.dn+' '+d.mo;}

  var state={sel:0,touched:false};
  function ndays(){return window.matchMedia('(min-width:768px)').matches?7:5;}

  function render(){
    if(!loaded){
      root.innerHTML='<div class="whead">When to Visit</div><div class="msg">'+(failed?'Opening hours are unavailable right now.':'Loading opening hours&hellip;')+'</div>';
      return;
    }
    var data=build(ndays());
    if(!state.touched) state.sel=(data.days[0]&&data.days[0].isChip)?1:0;
    if(state.sel>=data.days.length) state.sel=0;
    var todayStr=data.today;
    var strip=data.days.map(function(r,i){
      if(r.isChip){var rl=r.reopen?('Reopens '+whenLabel(todayStr,r.reopen.ymd)):'';return '<div class="brk" data-i="'+i+'"><b>'+r.closure.label+'</b><small>'+rl+'</small></div>';}
      var d=disp(r.ymd), isToday=r.ymd===todayStr;
      var cls='tile'+(r.closed?' closed':'')+(isToday?' today':'')+(i===state.sel?' sel':'');
      return '<div class="'+cls+'" data-i="'+i+'"><span class="dw">'+d.ws+'</span><span class="dn">'+d.dn+'</span>'+(r.wins?'<span class="act"></span>':'')+'</div>';
    }).join('');
    var sd=data.days[state.sel], isT=sd.ymd===todayStr;
    var s=liveStatus(todayStr);
    root.innerHTML='<div class="whead">When to Visit</div>'
      +'<div class="st '+(s.open?'open':'closed')+'"><span class="dot"></span><div><div class="big">'+s.big+'</div>'+(s.sub?'<div class="sub">'+s.sub+'</div>':'')+'</div></div>'
      +'<div class="strip">'+strip+'</div>'
      +'<div class="detail"><div class="dhead">'+headLabel(sd.ymd,isT)+'</div>'+detailHTML(sd,isT)+'</div>';
    root.querySelectorAll('[data-i]').forEach(function(el){el.addEventListener('click',function(){state.touched=true;state.sel=+el.getAttribute('data-i');render();});});
  }

  /* ---------- load ---------- */
  function fetchFeed(id,tMin,tMax){
    return fetch(apiUrl(id,tMin,tMax)).then(function(r){return r.json();}).then(function(j){return (j&&!j.error)?(j.items||[]):null;}).catch(function(){return null;});
  }
  function load(){
    var now=new Date();
    var tMin=new Date(now.getTime()-24*3600*1000).toISOString();
    var tMax=new Date(now.getTime()+35*24*3600*1000).toISOString();
    var jobs=OPEN_FEEDS.map(function(id){return fetchFeed(id,tMin,tMax);});
    jobs.push(fetchFeed(CLOSE_FEED,tMin,tMax));
    Promise.all(jobs).then(function(res){
      var closeItems=res.pop();
      res.forEach(function(items){ if(items) ingestOpen(items); });
      if(closeItems) ingestClose(closeItems);
      failed = res.every(function(x){return x===null;}) && !closeItems;
      loaded=true; render();
    });
  }

  render();  /* loading state */
  load();
  var mq=window.matchMedia('(min-width:768px)');
  (mq.addEventListener?mq.addEventListener('change',render):mq.addListener(render));
})();
