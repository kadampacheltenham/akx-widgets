/* Akanishta — "Start Here" option cards (swipeable). Dates + times pulled LIVE from the
   Google Calendars; the "Opens" time is derived from the SAME feeds + logic as the
   When-to-Visit (opening times) widget. Self-healing: re-renders if Squarespace blanks
   the block (Ajax/redraw). Embed:
       <div id="cr-swipe"></div>
       <script src="https://kadampacheltenham.github.io/akx-widgets/sh-option-cards.js" defer></script> */
(function(){
  var KEY='AIzaSyAVm0epUASAL2aNbAN_aBmpDDPxoPJVOwA';
  var TZ='Europe/London';
  var LOTUS='https://static1.squarespace.com/static/6a5a0b51083f343e9628d66e/t/6a5ba67a42763156df7f1739/1784391290902/Transparent+Golden+Lotus.png';
  var NEW_UNTIL=new Date('2027-04-01T00:00:00+01:00');

  var OPEN_FEEDS=[
    {key:'weekly',       id:'c_9e95a300a2d0f8775b28d30ebfe5eb816d8dc678d4dffbebbc09cd59d9208ffd@group.calendar.google.com'},
    {key:'weekend',      id:'c_687cfcac60ad1fa647cd2fb654774156e1e48fb2dcbcf5c40a72340e422a4b08@group.calendar.google.com'},
    {key:'prayers',      id:'c_7120941805c32581a9dca9a00783a100d6d53914fc8915ee8df40ae74d864504@group.calendar.google.com'},
    {key:'volunteering', id:'c_75691d6f7c1a31c8a4ad3bbdaa29431702ceeadcec440781106a4a76a29c1759@group.calendar.google.com'}
  ];
  var DAY_FIXED={ 5:[{s:570,e:750}] };

  var CARDS=[
    { key:'free', title:'15-minute Meditation', tag:'Free', lotus:1,
      match:/15\s*-?\s*minute/i,
      desc:[
        'A short guided meditation — with no booking and no experience needed. Come as you are.',
        'We open about 30 minutes beforehand and you’re welcome to look round, browse the bookshop, ask questions or chat before it begins.'
      ] },
    { key:'simply', title:'Simply Meditate', tag:'New', tagNew:true, lotus:2,
      match:/simply\s*meditate/i,
      desc:[
        'Reduce stress and cultivate inner peace with these practical 30-minute meditation classes, led by an experienced meditator.',
        'Drop in on a Monday — no booking, no experience needed. Everyone’s welcome.'
      ] },
    { key:'weekly', title:'Weekly Meditation Classes', tag:'Main class', lotus:3,
      match:/(monday evening|tuesday morning)\s+meditation\s+class/i,
      desc:[
        'Go deeper with our two main weekly classes. Each is engaging and often well attended — a relaxation meditation, a talk, a longer meditation, then discussion, questions and personal takeaways. Everybody welcome.'
      ] }
  ];

  var CSS=
   "#cr-swipe{font-family:'Inter',-apple-system,Segoe UI,Roboto,sans-serif;}"
  +"#cr-swipe .sw-top{background:#FBF6ED;display:flex;justify-content:center;gap:8px;padding:18px 0 6px;}"
  +"#cr-swipe .sw-top button{width:8px;height:8px;border-radius:50%;border:0;padding:0;background:#D8CFBB;cursor:pointer;transition:background .2s;}"
  +"#cr-swipe .sw-top button.on{background:#E2886A;}"
  +"#cr-swipe .sw-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;}"
  +"#cr-swipe .sw-track::-webkit-scrollbar{display:none;}"
  +"#cr-swipe .sw-slide{flex:0 0 100%;scroll-snap-align:center;}"
  +"#cr-swipe .fr-wrap{background:#FBF6ED;padding:34px 28px 58px;box-sizing:border-box;height:100%;}"
  +"#cr-swipe .fr-in{max-width:880px;margin:0 auto;display:flex;gap:56px;align-items:center;}"
  +"#cr-swipe .fr-copy{flex:1 1 56%;}"
  +"#cr-swipe .fr-mark{display:flex;gap:10px;margin:0 0 18px;}"
  +"#cr-swipe .fr-mark img{height:50px;width:auto;opacity:.92;}"
  +"#cr-swipe .fr-mark.multi img{height:36px;}"
  +"#cr-swipe .fr-head{display:flex;flex-direction:column-reverse;align-items:flex-start;gap:10px;margin:0 0 14px;}"
  +"#cr-swipe .fr-head h2{font-size:29px;line-height:1.25;color:#2A66A6;font-weight:600;letter-spacing:-.01em;margin:0;}"
  +"#cr-swipe .tag{font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#fff;background:#E2886A;border-radius:999px;padding:4px 11px;white-space:nowrap;}"
  +"#cr-swipe .fr-copy p{font-size:16px;line-height:1.7;color:#1D1D1F;margin:0 0 14px;max-width:47ch;}"
  +"#cr-swipe .fr-copy p:last-child{margin-bottom:0;}"
  +"#cr-swipe .fr-panel{flex:1 1 38%;background:#fff;border-radius:18px;padding:30px 32px;box-shadow:0 1px 4px rgba(29,29,31,.05);}"
  +"#cr-swipe .fr-ptitle{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#2A66A6;font-weight:700;margin:0 0 16px;}"
  +"#cr-swipe .fr-day{padding:12px 0;border-bottom:1px solid #F2ECDD;}"
  +"#cr-swipe .fr-day:last-child{border-bottom:none;padding-bottom:0;}"
  +"#cr-swipe .fr-line{display:flex;justify-content:space-between;align-items:baseline;gap:14px;}"
  +"#cr-swipe .fr-date{font-size:16.5px;color:#1D1D1F;font-weight:600;}"
  +"#cr-swipe .fr-time{font-size:15.5px;color:#2E7C7C;font-weight:600;white-space:nowrap;}"
  +"#cr-swipe .fr-opens{font-size:13px;color:#8a8a8a;margin:4px 0 0;}"
  +"@media(max-width:680px){"
  +"#cr-swipe .fr-wrap{padding:26px 14px 44px;}"
  +"#cr-swipe .fr-in{flex-direction:column;align-items:flex-start;gap:26px;}"
  +"#cr-swipe .fr-head h2{font-size:23px;}"
  +"#cr-swipe .fr-panel{width:100%;box-sizing:border-box;}"
  +"}";
  function ensureCSS(){ if(!document.getElementById('sh-option-cards-css')){ var st=document.createElement('style'); st.id='sh-option-cards-css'; st.textContent=CSS; (document.head||document.documentElement).appendChild(st); } }

  function disp(d){var f=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:false});var o={};f.formatToParts(d).forEach(function(p){o[p.type]=p.value;});var hh=(o.hour==='24')?0:+o.hour;return {wd:o.weekday,day:+o.day,mon:o.month,min:hh*60+(+o.minute)};}
  function ymdMin(d){var f=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});var o={};f.formatToParts(d).forEach(function(p){o[p.type]=p.value;});var hh=(o.hour==='24')?'00':o.hour;return {ymd:o.year+'-'+o.month+'-'+o.day,min:(+hh)*60+(+o.minute)};}
  function noonUTC(ymd){return new Date(ymd+'T12:00:00Z');}
  function hm(min){var h=Math.floor(min/60),m=min%60,h12=(h%12)||12;return h12+':'+(m<10?'0':'')+m;}
  function ap(min){return min<720?'am':'pm';}
  function range(s,e){return ap(s)===ap(e)?(hm(s)+' – '+hm(e)+' '+ap(s)):(hm(s)+' '+ap(s)+' – '+hm(e)+' '+ap(e));}

  var byDate={};
  function bufFor(e,wd){
    var n=e.name||'';
    if(e.feed==='volunteering' || /volunteer/i.test(n)) return {b:0,a:0};
    if(/\bTTP\b|teacher\s*training/i.test(n)) return {b:30,a:0};
    if(/\bFP\b|foundation\s*programme/i.test(n)) return {b:30,a:15};
    if(e.feed==='prayers') return {b:0,a:15};
    if(wd===1 && e.tS>=1020) return {b:60,a:30};
    return {b:30,a:30};
  }
  function ingest(items,feed){
    (items||[]).forEach(function(it){
      if(!it.start||!it.start.dateTime) return;
      var s=new Date(it.start.dateTime), e=new Date(it.end&&it.end.dateTime?it.end.dateTime:it.start.dateTime);
      var sp=ymdMin(s), ep=ymdMin(e);
      var tS=sp.min, tE=(ep.ymd!==sp.ymd)?1439:ep.min; if(tE<tS)tE=tS;
      (byDate[sp.ymd]=byDate[sp.ymd]||[]).push({tS:tS,tE:tE,name:(it.summary||'').trim(),feed:feed});
    });
  }
  function windowsFor(ymd){
    var wd=noonUTC(ymd).getUTCDay();
    var evs=(byDate[ymd]||[]).slice();
    evs.forEach(function(e){
      var bf=bufFor(e,wd); e.oS=Math.max(0,e.tS-bf.b); e.oE=Math.min(1439,e.tE+bf.a);
      (DAY_FIXED[wd]||[]).forEach(function(fx){ if(e.tS>=fx.s && e.tE<=fx.e){ e.oS=Math.max(e.oS,fx.s); e.oE=Math.min(e.oE,fx.e); } });
    });
    var wins=[];
    (DAY_FIXED[wd]||[]).forEach(function(fx){ if(evs.some(function(e){return e.tS<fx.e && e.tE>fx.s;})) wins.push({oS:fx.s,oE:fx.e}); });
    evs.forEach(function(e){ wins.push({oS:e.oS,oE:e.oE}); });
    wins.sort(function(a,b){return a.oS-b.oS;});
    var w=[];
    wins.forEach(function(x){ var cur=w[w.length-1]; if(cur && x.oS<=cur.oE){ if(x.oE>cur.oE)cur.oE=x.oE; } else w.push({oS:x.oS,oE:x.oE}); });
    return w;
  }
  function opensFor(dateObj){
    var sp=ymdMin(dateObj), w=windowsFor(sp.ymd);
    for(var i=0;i<w.length;i++){ if(sp.min>=w[i].oS && sp.min<=w[i].oE) return w[i].oS; }
    return null;
  }
  function row(ev){
    var s=new Date(ev.start.dateTime), e=new Date(ev.end&&ev.end.dateTime?ev.end.dateTime:ev.start.dateTime);
    var ds=disp(s), de=disp(e);
    var o=opensFor(s); if(o==null)o=Math.max(0,ds.min-30);
    return '<div class="fr-day"><div class="fr-line"><span class="fr-date">'+ds.wd+' '+ds.day+' '+ds.mon+'</span>'
      +'<span class="fr-time">'+range(ds.min,de.min)+'</span></div>'
      +'<p class="fr-opens">Opens '+hm(o)+' '+ap(o)+'</p></div>';
  }

  var DATA=null;
  var fetching=false;
  function feedUrl(id){
    var now=new Date();
    var tMin=new Date(now.getTime()-24*3600e3).toISOString();
    var tMax=new Date(now.getTime()+120*24*3600e3).toISOString();
    return 'https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(id)
      +'/events?singleEvents=true&orderBy=startTime&maxResults=250&key='+KEY
      +'&timeMin='+encodeURIComponent(tMin)+'&timeMax='+encodeURIComponent(tMax);
  }
  function loadData(then){
    if(DATA){ then&&then(); return; }
    if(fetching){ return; } fetching=true;
    Promise.all(OPEN_FEEDS.map(function(f){
      return fetch(feedUrl(f.id)).then(function(r){return r.json();})
        .then(function(j){return {key:f.key, items:(j&&j.items)||[]};})
        .catch(function(){return {key:f.key, items:[]};});
    })).then(function(res){
      res.forEach(function(r){ ingest(r.items, r.key); });
      var weeklyRes=null; res.forEach(function(r){
