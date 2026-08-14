/* Akanishta — "Start Here" option cards (swipeable). Dates + times pulled LIVE from the
   Google Calendars; the "Opens" time is derived from the SAME feeds + logic as the
   When-to-Visit (opening times) widget. Self-healing: re-renders if Squarespace blanks
   the block (Ajax/redraw). Embed:
       <div id="cr-swipe"></div>
       <script src="https://kadampacheltenham.github.io/akx-widgets/sh-option-cards.js" defer></script>
   NOTE: renders as a CONTAINED, ROUNDED card (max-width 720px) to match the meditation
   cards. For the rounding/gutters to read, put the block in a section with a pale/white
   background (not full cream).
   The first card ("15-minute Meditation") shows a quiet "see below" cue that scrolls to
   the fuller free-15 invitation card (#akx-free15) sitting just underneath — the cue only
   appears if that card is present on the page. */
(function(){
  var KEY='AIzaSyAVm0epUASAL2aNbAN_aBmpDDPxoPJVOwA';
  var TZ='Europe/London';
  var LOTUS='https://static1.squarespace.com/static/6a5a0b51083f343e9628d66e/t/6a5ba67a42763156df7f1739/1784391290902/Transparent+Golden+Lotus.png';
  var NEW_UNTIL=new Date('2027-04-01T00:00:00+01:00');   /* "New" badge stays through March 2027 */

  /* Directions: Apple Maps on iPhone/iPad, Google Maps everywhere else */
  var MAPS_Q='59 Whaddon Road, Cheltenham GL52 5NE';
  var _ua=(typeof navigator!=='undefined'&&navigator.userAgent)||'';
  var IS_APPLE=/iphone|ipad|ipod|macintosh|mac os x/i.test(_ua);
  var MAPS_URL=IS_APPLE?('https://maps.apple.com/?q='+encodeURIComponent(MAPS_Q)):('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(MAPS_Q));
  var MAPS_LABEL=IS_APPLE?'Open in Apple Maps →':'Open in Google Maps →';

  var OPEN_FEEDS=[
    {key:'weekly',       id:'c_9e95a300a2d0f8775b28d30ebfe5eb816d8dc678d4dffbebbc09cd59d9208ffd@group.calendar.google.com'},
    {key:'weekend',      id:'c_687cfcac60ad1fa647cd2fb654774156e1e48fb2dcbcf5c40a72340e422a4b08@group.calendar.google.com'},
    {key:'prayers',      id:'c_7120941805c32581a9dca9a00783a100d6d53914fc8915ee8df40ae74d864504@group.calendar.google.com'},
    {key:'volunteering', id:'c_75691d6f7c1a31c8a4ad3bbdaa29431702ceeadcec440781106a4a76a29c1759@group.calendar.google.com'}
  ];
  var DAY_FIXED={ 5:[{s:570,e:750}] };   /* Fri 9:30am–12:30pm fixed window (same as widget) */

  var CARDS=[
    { key:'free', title:'15-minute Meditation', tag:'Free', lotus:1,
      match:/15\s*-?\s*minute/i,
      seeBelow:{ target:'akx-free15', text:'Full details, benefits & directions just below' },
      desc:[
        'A short guided meditation — with no booking and no experience needed. Come as you are.',
        'We open about 30 minutes beforehand and you’re welcome to look round, browse the bookshop, ask questions or chat before it begins.'
      ] },
    { key:'simply', title:'Simply Meditate', tag:'New', tagNew:true, lotus:2,
      match:/simply\s*meditate/i,
      desc:[
        'Reduce stress and cultivate inner peace with these practical 30-minute meditation classes, led by an experienced meditator.',
        'Drop in on a Monday — no booking, no experience needed. Everyone’s welcome.'
      ],
      price:[['£5'],['Students & U25','£3.50'],['Free for members']] },
    { key:'weekly', title:'Weekly Meditation Classes', tag:'Main class', lotus:3,
      match:/(monday evening|tuesday morning)\s+meditation\s+class/i,
      desc:[
        'Go deeper with our two main weekly classes. Each is engaging and often well attended — a relaxation meditation, a talk, a longer meditation, then discussion, questions and personal takeaways. Everybody welcome.'
      ],
      price:[['£10'],['Students & U25','£7'],['Free for members']] }
  ];

  var CSS=
   "#cr-swipe{font-family:'Inter',-apple-system,Segoe UI,Roboto,sans-serif;max-width:1040px;margin:0 auto;display:block;}"
  +"#cr-swipe .sw-card{background:#FBF6ED;border-radius:18px;overflow:hidden;box-shadow:0 1px 6px rgba(29,29,31,.06);}"
  +"#cr-swipe .sw-title{text-align:center;color:#E2886A;font-weight:600;font-size:1.3rem;letter-spacing:.01em;margin:0;padding:30px 20px 2px;background:transparent;}"
  +"#cr-swipe .sw-top{display:flex;justify-content:center;gap:8px;padding:14px 0 6px;background:transparent;}"
  +"#cr-swipe .sw-top button{width:8px;height:8px;border-radius:50%;border:0;padding:0;background:#D8CFBB;cursor:pointer;transition:background .2s;}"
  +"#cr-swipe .sw-top button.on{background:#E2886A;}"
  +"#cr-swipe .sw-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;}"
  +"#cr-swipe .sw-track::-webkit-scrollbar{display:none;}"
  +"#cr-swipe .sw-slide{flex:0 0 100%;scroll-snap-align:center;}"
  +"#cr-swipe .fr-wrap{background:transparent;padding:20px 30px 38px;box-sizing:border-box;height:100%;}"
  +"#cr-swipe .fr-in{margin:0;display:flex;gap:34px;align-items:flex-start;}"
  +"#cr-swipe .fr-copy{flex:1 1 54%;min-width:0;}"
  +"#cr-swipe .fr-mark{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin:0 0 16px;}"
  +"#cr-swipe .fr-mark img{height:66px;width:auto;opacity:.92;}"
  +"#cr-swipe .fr-mark.multi img{height:48px;}"
  +"#cr-swipe .fr-mark .tag{margin-left:6px;}"
  +"#cr-swipe .fr-h2{font-size:26px;line-height:1.25;color:#2A66A6;font-weight:600;letter-spacing:-.01em;margin:0 0 12px;}"
  +"#cr-swipe .tag{font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#fff;background:#E2886A;border-radius:999px;padding:4px 11px;white-space:nowrap;}"
  +"#cr-swipe .fr-copy p{font-size:15.5px;line-height:1.7;color:#1D1D1F;margin:0 0 12px;}"
  +"#cr-swipe .fr-copy p:last-child{margin-bottom:0;}"
  +"#cr-swipe .fr-price{margin:18px 0 0;font-size:14.5px;line-height:1.7;color:#5b5b5b;}"
  +"#cr-swipe .fr-price strong{color:#1D1D1F;font-weight:600;}"
  +"#cr-swipe .fr-price .sep{color:#CBBFA6;margin:0 9px;}"
  +"#cr-swipe .fr-see{display:inline-flex;align-items:center;gap:7px;margin:16px 0 0;font-size:14px;font-weight:600;color:#2E7C7C;text-decoration:none;cursor:pointer;}"
  +"#cr-swipe .fr-see:hover{text-decoration:underline;}"
  +"#cr-swipe .fr-see .ar{display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;border-radius:50%;background:#E4F0EE;font-size:12px;line-height:1;animation:frbob 1.7s ease-in-out infinite;}"
  +"@keyframes frbob{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}"
  +"#cr-swipe .fr-panel{flex:1 1 46%;background:#fff;border-radius:14px;padding:24px 26px;box-shadow:0 1px 4px rgba(29,29,31,.05);box-sizing:border-box;}"
  +"#cr-swipe .fr-ptitle{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#2A66A6;font-weight:700;margin:0 0 14px;}"
  +"#cr-swipe .fr-day{padding:11px 0;border-bottom:1px solid #F2ECDD;}"
  +"#cr-swipe .fr-day:last-child{border-bottom:none;padding-bottom:0;}"
  +"#cr-swipe .fr-line{display:flex;justify-content:space-between;align-items:baseline;gap:12px;}"
  +"#cr-swipe .fr-date{font-size:16px;color:#1D1D1F;font-weight:600;}"
  +"#cr-swipe .fr-time{font-size:15px;color:#2E7C7C;font-weight:600;white-space:nowrap;}"
  +"#cr-swipe .fr-opens{font-size:13px;color:#8a8a8a;margin:4px 0 0;}"
  +"#cr-swipe .fr-dir{margin-top:16px;background:none;border:0;padding:0;color:#2E9E4F;font-weight:600;font-size:15px;cursor:pointer;font-family:inherit;}"
  +"#cr-swipe .fr-dir:hover{color:#237A3C;}"
  +"#cr-swipe .fr-addr{margin:10px 0 0;font-size:14px;color:#1D1D1F;line-height:1.6;}"
  +"#cr-swipe .fr-addr a{color:#2E7C7C;font-weight:500;}"
  +"#cr-swipe .fr-nav{display:flex;justify-content:flex-end;gap:10px;margin:20px 0 0;}"
  +"#cr-swipe .fr-nav button{width:36px;height:36px;border-radius:50%;border:1px solid #E4DAC6;background:#fff;color:#2A66A6;font-size:17px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,opacity .15s;}"
  +"#cr-swipe .fr-nav button:hover{background:#FBF6ED;}"
  +"#cr-swipe .fr-nav button[disabled]{opacity:.3;cursor:default;}"
  +"@media(max-width:680px){"
  +"#cr-swipe .fr-wrap{padding:20px 16px 34px;}"
  +"#cr-swipe .fr-in{flex-direction:column;align-items:stretch;gap:24px;}"
  +"#cr-swipe .fr-h2{font-size:22px;}"
  +"#cr-swipe .fr-panel{width:100%;}"
  +"}";
  function ensureCSS(){ if(!document.getElementById('sh-option-cards-css')){ var st=document.createElement('style'); st.id='sh-option-cards-css'; st.textContent=CSS; (document.head||document.documentElement).appendChild(st); } }

  /* ---- date/time helpers ---- */
  function disp(d){var f=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:false});var o={};f.formatToParts(d).forEach(function(p){o[p.type]=p.value;});var hh=(o.hour==='24')?0:+o.hour;return {wd:o.weekday,day:+o.day,mon:o.month,min:hh*60+(+o.minute)};}
  function ymdMin(d){var f=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});var o={};f.formatToParts(d).forEach(function(p){o[p.type]=p.value;});var hh=(o.hour==='24')?'00':o.hour;return {ymd:o.year+'-'+o.month+'-'+o.day,min:(+hh)*60+(+o.minute)};}
  function noonUTC(ymd){return new Date(ymd+'T12:00:00Z');}
  function hm(min){var h=Math.floor(min/60),m=min%60,h12=(h%12)||12;return h12+':'+(m<10?'0':'')+m;}
  function ap(min){return min<720?'am':'pm';}
  function range(s,e){return ap(s)===ap(e)?(hm(s)+' – '+hm(e)+' '+ap(s)):(hm(s)+' '+ap(s)+' – '+hm(e)+' '+ap(e));}

  /* ---- opening-hours derivation (same logic as When-to-Visit) ---- */
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

  /* ---- data (fetched once, cached) ---- */
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
      var weeklyRes=null; res.forEach(function(r){ if(r.key==='weekly')weeklyRes=r; });
      var weekly=((weeklyRes&&weeklyRes.items)||[]).filter(function(x){return x.start&&x.start.dateTime;});
      DATA={};
      CARDS.forEach(function(c){
        var list=weekly.filter(function(x){return c.match.test(x.summary||'');});
        if(c.fromYmd){ list=list.filter(function(x){return ymdMin(new Date(x.start.dateTime)).ymd>=c.fromYmd;}); }
        DATA[c.key]=list.slice(0,3);
      });
      fetching=false; then&&then();
    }).catch(function(){ fetching=false; DATA={}; then&&then(); });
  }

  /* ---- render (idempotent + self-healing) ---- */
  function priceHtml(price){
    if(!price) return '';
    var parts=price.map(function(seg){
      return seg.length>1 ? (seg[0]+' <strong>'+seg[1]+'</strong>') : '<strong>'+seg[0]+'</strong>';
    });
    return '<div class="fr-price">'+parts.join('<span class="sep">|</span>')+'</div>';
  }
  function seeBelowHtml(c){
    if(!c.seeBelow) return '';
    /* only show the cue if the target card is actually on the page */
    if(!document.getElementById(c.seeBelow.target)) return '';
    return '<a class="fr-see" href="#'+c.seeBelow.target+'" data-target="'+c.seeBelow.target+'">'
      +c.seeBelow.text+' <span class="ar">&#8595;</span></a>';
  }
  function fillLists(root){
    CARDS.forEach(function(c){
      var el=root.querySelector('.fr-list[data-key="'+c.key+'"]'); if(!el)return;
      var list=DATA?DATA[c.key]:null;
      if(!DATA){ el.innerHTML='<p class="fr-opens">Loading…</p>'; return; }
      el.innerHTML=(list&&list.length)?list.map(row).join(''):'<p class="fr-opens">See our calendar for dates.</p>';
    });
  }
  function build(root){
    ensureCSS();
    var last=CARDS.length-1;
    var slides=CARDS.map(function(c,i){
      var imgs=''; for(var k=0;k<c.lotus;k++){ imgs+='<img src="'+LOTUS+'" alt="">'; }
      var tag=c.tag?'<span class="tag'+(c.tagNew?' tag-new':'')+'">'+c.tag+'</span>':'';
      var mark='<div class="fr-mark'+(c.lotus>1?' multi':'')+'">'+imgs+tag+'</div>';
      var desc=c.desc.map(function(p){return '<p>'+p+'</p>';}).join('');
      var price=priceHtml(c.price);
      var see=seeBelowHtml(c);
      var nav='<div class="fr-nav">'
        +'<button class="fr-prev" type="button" aria-label="Previous card"'+(i===0?' disabled':'')+'>&larr;</button>'
        +'<button class="fr-next" type="button" aria-label="Next card"'+(i===last?' disabled':'')+'>&rarr;</button></div>';
      return '<div class="sw-slide"><div class="fr-wrap"><div class="fr-in">'
        +'<div class="fr-copy">'+mark+'<h2 class="fr-h2">'+c.title+'</h2>'+desc+price+see+'</div>'
        +'<div class="fr-panel"><p class="fr-ptitle">Next dates</p><div class="fr-list" data-key="'+c.key+'"><p class="fr-opens">Loading…</p></div>'
        +'<button class="fr-dir" type="button">Get directions →</button>'
        +'<p class="fr-addr" hidden>59 Whaddon Road,<br>Cheltenham GL52 5NE<br><a href="'+MAPS_URL+'" target="_blank" rel="noopener">'+MAPS_LABEL+'</a></p>'
        +'</div></div>'
        +nav
        +'</div></div>';
    }).join('');
    var dots=CARDS.map(function(c,i){return '<button aria-label="Card '+(i+1)+'"'+(i===0?' class="on"':'')+'></button>';}).join('');
    root.innerHTML='<div class="sw-card"><p class="sw-title">Get Started Options</p><div class="sw-top">'+dots+'</div><div class="sw-track">'+slides+'</div></div>';

    if(new Date()>=NEW_UNTIL){ var nb=root.querySelector('.tag-new'); if(nb) nb.style.display='none'; }

    var track=root.querySelector('.sw-track');
    var dotEls=[].slice.call(root.querySelectorAll('.sw-top button'));
    var slideEls=root.querySelectorAll('.sw-slide');
    function goTo(i){ if(i<0||i>=slideEls.length)return; slideEls[i].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'}); }
    dotEls.forEach(function(d,i){ d.addEventListener('click',function(){ goTo(i); }); });
    track.addEventListener('scroll',function(){ var i=Math.round(track.scrollLeft/track.clientWidth); dotEls.forEach(function(d,k){ d.classList.toggle('on',k===i); }); },{passive:true});

    [].slice.call(root.querySelectorAll('.fr-dir')).forEach(function(btn){ btn.addEventListener('click',function(){ var a=btn.nextElementSibling; if(a) a.hidden=!a.hidden; }); });
    [].slice.call(root.querySelectorAll('.fr-prev')).forEach(function(btn,i){ btn.addEventListener('click',function(){ goTo(i-1); }); });
    [].slice.call(root.querySelectorAll('.fr-next')).forEach(function(btn,i){ btn.addEventListener('click',function(){ goTo(i+1); }); });

    /* "see below" cue → smooth-scroll to the fuller free-15 card, clear of the fixed header */
    [].slice.call(root.querySelectorAll('.fr-see')).forEach(function(a){
      a.addEventListener('click',function(e){
        var tgt=document.getElementById(a.getAttribute('data-target'));
        if(tgt){ e.preventDefault(); var y=tgt.getBoundingClientRect().top+window.pageYOffset-100; window.scrollTo({top:y,behavior:'smooth'}); }
      });
    });

    fillLists(root);
    if(!DATA){ loadData(function(){ document.querySelectorAll('#cr-swipe').forEach(function(rt){ fillLists(rt); }); }); }
  }
  function render(){
    var root=document.getElementById('cr-swipe');
    if(!root) return;
    if(root.querySelector('.sw-track')) return;
    build(root);
  }

  render();
  var mo=new MutationObserver(function(){ render(); });
  try{ mo.observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',render); }
})();
