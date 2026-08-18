/* Akanishta — FEATURED "Coming up" block (v1.1, 18 Aug 2026 — Book → goes straight to the booking form; rest of card opens the page)
   Shows the next Featured weekly class (talk / short course) and the next Featured weekend event
   as two "ticket" cards, side by side (stacked on phones).
   Reads: Weekly Classes sheet (tabs "Talks & series" + "Class times", column Featured = yes)
          Weekend Events sheet (tab "Events", column Featured = yes)
   Embed:  <div id="akx-featured"></div>
           <script src="https://kadampacheltenham.github.io/akx-widgets/featured-events.js?v=1" defer></script>
   Optional attributes on the div: data-heading="Coming up"  data-kicker="Featured"
           data-column="Featured"  (which yes/no sheet column to read, e.g. "Hp Showcase" for the homepage)
           data-filter="free"      (only free items, e.g. Start Here)   data-max="1" (soonest N overall)
           data-classes="1" data-events="1"  (how many of each; 0 hides that kind)   data-maxwidth="845" (px, to line up with blocks above)
*/
(function(){
  var MOUNT_ID='akx-featured';
  var WC_SHEET='1YArubV8QgCvPUIIvHOHWhCN2fYLRz0DDPSRSHD_tSmY', WC_ITEMS='Talks & series', WC_CLASSES='Class times';
  var EV_SHEET='1g8VSqkv9zIR375RDf9R-B-34zMhsHXoUYx7ZYhuXlmk', EV_TAB='Events', EV_TE='Teachers';
  var BASE='https://kadampacheltenham.github.io/akx-widgets/', IMG=BASE+'images/';
  var LINK_WC='/weekly-classes', LINK_EV='/courses-retreats';

  var CSS = String.raw`
  .akx-feat{font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:1000px;margin:30px auto 8px;color:#26303A;}
  .akx-feat *{box-sizing:border-box;}
  .akx-feat .fh{display:flex;align-items:center;gap:12px;margin:0 0 14px;}
  .akx-feat .fh h3{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.35rem;color:#2A66A6;margin:0;}
  .akx-feat .fh .kick{font-size:.68rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#B5771E;background:#F6E9CE;border-radius:999px;padding:5px 11px;}
  .akx-feat .fh .line{flex:1;height:1px;background:#EFE8DA;}
  .akx-feat .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
  .akx-feat .grid.one{grid-template-columns:1fr;max-width:520px;margin:0 auto;}
  .akx-feat .card{position:relative;display:grid;grid-template-columns:172px 1fr;background:#fff;border:1px solid #EFE8DA;border-radius:18px;overflow:hidden;box-shadow:0 8px 24px rgba(38,48,58,.07);text-decoration:none;color:inherit;transition:transform .18s,box-shadow .18s;}
  .akx-feat .card:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(38,48,58,.12);}
  .akx-feat .pic{position:relative;min-height:172px;background:var(--c,#2A66A6) center/cover;overflow:hidden;}
  .akx-feat .pic .g{position:absolute;inset:0;display:block;}
  .akx-feat .pic .evg{border-radius:0;height:100%;box-shadow:none;aspect-ratio:auto;padding:14px;}
  .akx-feat .pic .evg .evg-t{font-size:15px;max-width:none;}
  .akx-feat .pic .evg .evg-m{font-size:10px;}
  .akx-feat .pic .evg .evg-k{font-size:9.5px;}
  .akx-feat .txt{padding:14px 16px 14px;display:flex;flex-direction:column;gap:4px;min-width:0;}
  .akx-feat .kind{font-size:.66rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--c);}
  .akx-feat .t{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.12rem;line-height:1.15;color:#26303A;}
  .akx-feat .m{font-size:.85rem;color:#5c6773;line-height:1.45;}
  .akx-feat .cta{margin-top:auto;padding-top:8px;font-size:.84rem;font-weight:700;display:flex;justify-content:space-between;align-items:center;gap:10px;}
  .akx-feat .cta .fee{color:#26303A;}
  .akx-feat .cta .go{color:var(--c);white-space:nowrap;text-decoration:none;position:relative;z-index:2;}
  .akx-feat .cta .go.book{background:var(--c);color:#fff;border-radius:999px;padding:8px 14px;}
  .akx-feat .cover{position:absolute;inset:0;z-index:1;}
  .akx-feat .chip{position:absolute;top:10px;left:10px;background:#fff;border-radius:11px;padding:6px 9px;text-align:center;line-height:1;box-shadow:0 4px 12px rgba(0,0,0,.25);}
  .akx-feat .chip .d{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.1rem;}
  .akx-feat .chip .mo{font-size:.55rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5c6773;margin-top:2px;}
  @media(max-width:640px){
    .akx-feat .grid{grid-template-columns:1fr;gap:14px;}
    .akx-feat .card{grid-template-columns:118px 1fr;} .akx-feat .pic{min-height:118px;}
    .akx-feat .pic .evg .evg-btm,.akx-feat .pic .evg .evg-k{display:none;} .akx-feat .pic .evg .motif{right:-30%;height:150%;}
  }`;

  // ---------- helpers ----------
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function low(s){return (s||'').trim().toLowerCase();}
  function yes(s){return /^(yes|y|true|1)$/i.test((s||'').trim());}
  function splitList(s){return (s||'').split(/[,;\n]+/).map(function(x){return x.trim();}).filter(Boolean);}
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function today(){var t=new Date();t.setHours(0,0,0,0);return t;}
  function parseFull(s){ if(!s) return null; s=String(s).trim();
    var iso=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if(iso) return new Date(+iso[1],+iso[2]-1,+iso[3]);
    var uk=s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/); if(uk){var y=+uk[3]; if(y<100)y+=2000; return new Date(y,+uk[2]-1,+uk[1]);}
    var g=s.match(/^Date\((\d{4}),(\d{1,2}),(\d{1,2})/); if(g) return new Date(+g[1],+g[2],+g[3]);
    var t=Date.parse(s); return isNaN(t)?null:new Date(t); }
  function parseDDMM(s){ // "24/08" or "24/08/2026" -> nearest sensible date (this year, or next if >~6 months past)
    var m=(s||'').match(/(\d{1,2})\s*[\/.\-]\s*(\d{1,2})(?:\s*[\/.\-]\s*(\d{2,4}))?/); if(!m) return null;
    var t0=today(), y=m[3]?(+m[3]<100?2000+ +m[3]:+m[3]):t0.getFullYear();
    var d=new Date(y,+m[2]-1,+m[1]); if(!m[3] && d.getTime()<t0.getTime()-180*864e5) d.setFullYear(y+1); return d; }
  function shortDay(d){var s=(d||'').slice(0,3);return s?s.charAt(0).toUpperCase()+s.slice(1).toLowerCase():'';}
  function fmt(d){return WD[d.getDay()]+' '+d.getDate()+' '+MON[d.getMonth()];}
  function ddmm(d){return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2);}

  function parseCSV(text){
    var rows=[],row=[],f='',i=0,q=false,c;
    while(i<text.length){c=text[i];
      if(q){ if(c==='"'){ if(text[i+1]==='"'){f+='"';i++;} else q=false; } else f+=c; }
      else { if(c==='"')q=true; else if(c===','){row.push(f);f='';} else if(c==='\r'){} else if(c==='\n'){row.push(f);rows.push(row);row=[];f='';} else f+=c; }
      i++;}
    if(f!==''||row.length){row.push(f);rows.push(row);}
    return rows;
  }
  function toObjs(rows){ if(!rows.length) return []; var h=rows[0].map(function(x){return (x||'').trim();});
    return rows.slice(1).map(function(r){var o={};h.forEach(function(k,i){o[k]=(r[i]||'').trim();});return o;})
      .filter(function(o){return Object.keys(o).some(function(k){return o[k];});}); }
  function csvUrl(id,tab){return 'https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:csv&headers=1&sheet='+encodeURIComponent(tab);}
  function get(u){return fetch(u,{cache:'no-store'}).then(function(r){return r.text();}).then(function(t){return toObjs(parseCSV(t));});}

  // ---------- weekly class (talk / short course) ----------
  function colYes(row,col){ var k=Object.keys(row).find(function(h){return low(h)===low(col);}); return k?yes(row[k]):false; }
  function pickClass(items, classes, col, filt){
    var t0=today();
    var live=items.filter(function(it){ if(!(it.title && colYes(it,col) && low(it.status)!=='draft')) return false;
      if(filt==='free' && (window.AKX_GFX.typeOf(it.type)||'')!=='free') return false;
      var sf=parseFull(it.show_from); return !(sf && t0<sf); });
    var out=[];
    live.forEach(function(it){
      var cls=classes.filter(function(c){return low(c.id)===low(it.id);});
      var next=null, nextCl=null;
      cls.forEach(function(c){ splitList(c.dates).forEach(function(ds){ var d=parseDDMM(ds); if(d && d>=t0 && (!next||d<next)){next=d;nextCl=c;} }); });
      if(!next) return;               // nothing upcoming -> skip
      out.push({item:it, classes:cls, next:next, cl:nextCl});
    });
    out.sort(function(a,b){return a.next-b.next;});
    return out;
  }
  function classCard(o){
    var it=o.item, G=window.AKX_GFX;
    var type=G.typeOf(it.type)||'talk', th=G.themeOf(type)||{colour:'#C56B45',label:'Public Talk'};
    var isTalk=type==='talk';
    // meta: each class option "Mon 24 Aug 18:30", then teacher
    var opts=o.classes.map(function(c){ var d0=null; splitList(c.dates).forEach(function(ds){var d=parseDDMM(ds); if(d&&d>=today()&&(!d0||d<d0)) d0=d;});
        return (d0?fmt(d0):shortDay(c.day))+(c.time?' '+c.time:''); }).filter(Boolean);
    var teacher=(o.cl&&o.cl.teacher)||'';
    var meta=opts.slice(0,3).join(' · ')+(teacher?' · with '+esc(teacher):'');
    var price=(o.cl&&o.cl.price_class)||''; var book=o.classes.some(function(c){return c.booking_url;});
    var fee=(price?esc(price)+' · ':'')+(book?'drop in or book':'drop in');
    var gdate=(shortDay(o.cl.day)+' '+(o.cl.time||'')).trim().toUpperCase()+' · '+(isTalk?'':'FROM ')+ddmm(o.next);
    var pic=G.render(type,{title:it.title,date:gdate,shape:'sq'});
    var kind='Weekly class · '+(th.label||type);
    var bookUrl=(o.cl&&o.cl.booking_url)||(o.classes.filter(function(c){return c.booking_url;})[0]||{}).booking_url||'';
    var go=bookUrl?'<a class="go book" href="'+esc(bookUrl)+'" target="_blank" rel="noopener">Book →</a>':'<span class="go">See details →</span>';
    return '<div class="card" style="--c:'+th.colour+'"><a class="cover" href="'+LINK_WC+'" aria-label="'+esc(it.title)+' — see details"></a>'
      +'<div class="pic">'+pic+'</div>'
      +'<div class="txt"><span class="kind">'+esc(kind)+'</span><span class="t">'+esc(it.title)+'</span>'
      +'<span class="m">'+meta+'</span>'
      +'<span class="cta"><span class="fee">'+fee+'</span>'+go+'</span></div></div>';
  }

  // ---------- weekend event ----------
  var EV_TYPES={'special event':['Special event','#B5771E'],'half-day course':['Half-day course','#2A66A6'],'day course':['Day course','#2A66A6'],
    'half-day retreat':['Half-day retreat','#227A72'],'day retreat':['Day retreat','#227A72'],'silent day':['Silent day','#6A4A9C'],
    'free half-day':['Free half-day','#4FA35A'],'away day':['Away day','#2E9BB5'],'other':['','#C56B45']};
  function pickEvents(evs, col, filt){
    var t0=today();
    return evs.filter(function(e){ if(!e.Title||!colYes(e,col)) return false; if(low(e.Status)==='draft') return false;
        if(filt==='free' && !(yes(e.Free)||low(e['Event Type'])==='free half-day')) return false;
        var sf=parseFull(e['Show from']); if(sf&&t0<sf) return false; var d=parseFull(e.Date); e._d=d; return !(d && d<t0); })
      .sort(function(a,b){return (a._d||8e15)-(b._d||8e15);});
  }
  function eventCard(e, teMap){
    var G=window.AKX_GFX, ty=EV_TYPES[low(e['Event Type'])]||['', '#2A66A6'];
    var colour=e.Colour||ty[1], tag=e['Event tag']||ty[0]||'';
    var d=e._d, chip=d?'<div class="chip"><div class="d">'+d.getDate()+'</div><div class="mo">'+MON[d.getMonth()]+'</div></div>':'';
    var te=teMap[low(e['Teacher ID'])], who=te?te.Name:'';
    var meta=(d?fmt(d):'')+(e.Time?' '+esc(e.Time):'')+(who?' · with '+esc(who):'');
    var isFree=yes(e.Free)||low(e['Event Type'])==='free half-day';
    var fee=(isFree?'Free':esc(e.Fee||''))+(e['Booking link']?' · booking open':' · drop-in');
    var id=(e['Event ID']||'').trim();
    var gt=G.typeOf(e['Event Type'])||'course';
    var gfx=G.render(gt,{title:e.Title,date:(d?fmt(d):'')+(e.Time?' · '+e.Time:''),shape:'sq',label:tag||undefined});
    var pic='<div class="pic" style="--c:'+colour+'"'+(id?' data-imgbase="'+IMG+encodeURIComponent(id)+'"':'')+'><span class="g">'+gfx+'</span>'+chip+'</div>';
    var go=e['Booking link']?'<a class="go book" href="'+esc(e['Booking link'])+'" target="_blank" rel="noopener">Book →</a>':'<span class="go">See details →</span>';
    return '<div class="card" style="--c:'+colour+'"><a class="cover" href="'+LINK_EV+'" aria-label="'+esc(e.Title)+' — see details"></a>'+pic
      +'<div class="txt"><span class="kind">Weekend event'+(tag?' · '+esc(tag):'')+'</span><span class="t">'+esc(e.Title)+'</span>'
      +'<span class="m">'+meta+'</span>'
      +'<span class="cta"><span class="fee">'+fee+'</span>'+go+'</span></div></div>';
  }
  function wireImages(mount){ // event photo (images/<Event ID>.jpg|.png) replaces the generated graphic when it exists
    mount.querySelectorAll('.pic[data-imgbase]').forEach(function(el){
      var base=el.getAttribute('data-imgbase'), exts=['.jpg','.png'], i=0;
      (function next(){ if(i>=exts.length) return; var u=base+exts[i++], im=new Image();
        im.onload=function(){ el.style.backgroundImage='url("'+u+'")'; var g=el.querySelector('.g'); if(g) g.remove(); };
        im.onerror=next; im.src=u; })();
    });
  }

  // ---------- render ----------
  function render(mount, data){
    var nC=+(mount.getAttribute('data-classes')||1), nE=+(mount.getAttribute('data-events')||1);
    var heading=mount.getAttribute('data-heading')||'Coming up', kicker=mount.getAttribute('data-kicker')||'Featured';
    var teMap={}; data.teachers.forEach(function(t){ if(t['Teacher ID']) teMap[low(t['Teacher ID'])]=t; });
    var col=mount.getAttribute('data-column')||'Featured', filt=low(mount.getAttribute('data-filter')||''), max=+(mount.getAttribute('data-max')||0);
    var picks=[];
    pickClass(data.items, data.classes, col, filt).slice(0,nC).forEach(function(o){picks.push({d:o.next, html:classCard(o)});});
    pickEvents(data.events, col, filt).slice(0,nE).forEach(function(e){picks.push({d:e._d||new Date(8e15), html:eventCard(e,teMap)});});
    if(max>0){ picks.sort(function(a,b){return a.d-b.d;}); picks=picks.slice(0,max); }   // data-max: keep only the soonest N overall
    var cards=picks.map(function(p){return p.html;});
    if(!cards.length){ mount.innerHTML=''; mount.style.display='none'; return; }
    var mw=mount.getAttribute('data-maxwidth');
    mount.innerHTML='<div class="akx-feat"'+(mw?' style="max-width:'+esc(mw)+'px"':'')+'><div class="fh">'+(kicker?'<span class="kick">'+esc(kicker)+'</span>':'')+'<h3>'+esc(heading)+'</h3><span class="line"></span></div>'
      +'<div class="grid'+(cards.length===1?' one':'')+'">'+cards.join('')+'</div></div>';
    wireImages(mount);
  }

  function init(){
    var mount=document.getElementById(MOUNT_ID); if(!mount||mount.getAttribute('data-akx-done')==='1') return; mount.setAttribute('data-akx-done','1');
    if(!document.getElementById('akx-feat-style')){var st=document.createElement('style');st.id='akx-feat-style';st.textContent=CSS;document.head.appendChild(st);}
    if(!document.getElementById('akx-fonts')){var lf=document.createElement('link');lf.id='akx-fonts';lf.rel='stylesheet';lf.href='https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600;700;800&display=swap';document.head.appendChild(lf);}
    var gfxReady=new Promise(function(res){ if(window.AKX_GFX) return res(); var s=document.getElementById('akx-gfx-loader')||document.createElement('script');
      if(!s.id){s.id='akx-gfx-loader'; s.src=BASE+'event-graphics.js'; document.head.appendChild(s);} s.addEventListener('load',res); });
    Promise.all([gfxReady, get(csvUrl(WC_SHEET,WC_ITEMS)), get(csvUrl(WC_SHEET,WC_CLASSES)), get(csvUrl(EV_SHEET,EV_TAB)), get(csvUrl(EV_SHEET,EV_TE))])
      .then(function(r){ window.AKX_GFX.injectCSS(); render(mount,{items:r[1],classes:r[2],events:r[3],teachers:r[4]}); })
      .catch(function(){ mount.style.display='none'; });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
