/* Akanishta — Weekend Courses & Retreats widget.
   Reads a public Google Sheet (tabs "Events", "Timetables", "Teachers")
   and renders poster tiles.
   Include with:  <div id="akx-events"></div>
                  <script src="https://kadampacheltenham.github.io/akx-widgets/events.js" defer></script>
*/
(function(){
  var SHEET_ID = '1g8VSqkv9zIR375RDf9R-B-34zMhsHXoUYx7ZYhuXlmk';
  var MOUNT_ID = 'akx-events';
  var TAB_EVENTS='Events', TAB_TT='Timetables', TAB_TE='Teachers';
  var IMG  = 'https://kadampacheltenham.github.io/akx-widgets/images/';
  var TIMG = IMG;   // teacher photos live in the same images/ folder
  var SHOW_HEADING = true;

  // Event Type -> tag / colour / behaviour
  var TYPES = {
    'special event':  {tag:'Special event',  colour:'#B5771E', feature:true},
    'half-day course':{tag:'Half-day course',colour:'#2A66A6'},
    'day course':     {tag:'Day course',     colour:'#2A66A6'},
    'half-day retreat':{tag:'Half-day retreat',colour:'#227A72'},
    'day retreat':    {tag:'Day retreat',    colour:'#227A72'},
    'silent day':     {tag:'Silent day',     colour:'#6A4A9C'},
    'free half-day':  {tag:'Free half-day',  colour:'#4FA35A', free:true},
    'away day':       {tag:'Away day',       colour:'#2E9BB5'},
    'other':          {tag:'',               colour:'#C56B45'}
  };
  var DEFAULT_COLOUR = '#2A66A6';

  var STYLE = String.raw`
  #akx-events{--ink:#26303A;--mut:#5c6773;--line:#efe8da;font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);max-width:1000px;margin:0 auto;}
  #akx-events *{box-sizing:border-box;}
  #akx-events .ev-h{text-align:center;font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.9rem;color:#2A66A6;margin:0 0 20px;}
  #akx-events .ev-msg{text-align:center;color:#8a857c;padding:26px;}
  #akx-events .grid{display:grid;grid-template-columns:1fr 1fr;gap:26px;}
  #akx-events .card{position:relative;background:#fff;border:1px solid var(--line);border-radius:22px;overflow:hidden;box-shadow:0 10px 30px rgba(38,48,58,.08);display:flex;flex-direction:column;transition:transform .18s,box-shadow .18s;}
  #akx-events .card:hover{transform:translateY(-4px);box-shadow:0 18px 42px rgba(38,48,58,.13);}
  #akx-events .img{position:relative;height:190px;overflow:hidden;background:linear-gradient(135deg,var(--a2),var(--accent));}
  #akx-events .img img.evimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
  #akx-events .img .ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#ffffff66;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;}
  #akx-events .datechip{position:absolute;top:14px;left:14px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:13px;padding:7px 12px;text-align:center;line-height:1;box-shadow:0 4px 14px rgba(0,0,0,.28);z-index:3;}
  #akx-events .datechip .d{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.32rem;}
  #akx-events .datechip .m{font-size:.64rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--mut);margin-top:3px;}
  #akx-events .datechip .w{font-size:.6rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#2A66A6;margin-top:2px;}
  #akx-events .type{position:absolute;left:14px;bottom:14px;display:inline-flex;align-items:center;gap:6px;font-size:.68rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:5px 12px;border-radius:999px;background:#fff;box-shadow:0 3px 10px rgba(0,0,0,.16);z-index:2;}
  #akx-events .type i{width:8px;height:8px;border-radius:50%;background:var(--accent);}
  #akx-events .avatar{position:absolute;top:15px;right:16px;width:88px;height:88px;border-radius:50%;border:3px solid #fff;overflow:hidden;background:#e7e2d7;box-shadow:0 6px 16px rgba(0,0,0,.24);z-index:2;display:flex;align-items:center;justify-content:center;}
  #akx-events .avatar img{width:100%;height:100%;object-fit:cover;display:block;}
  #akx-events .avatar.lotus{background:var(--accent);}
  #akx-events .avatar.lotus img{width:60%;height:60%;object-fit:contain;}
  #akx-events .body{padding:20px 22px 22px;display:flex;flex-direction:column;flex:1;}
  #akx-events .ctitle{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.4rem;line-height:1.14;margin:0 0 4px;color:var(--accent);}
  #akx-events .meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:.9rem;color:var(--mut);margin:0 0 2px;}
  #akx-events .meta a{font-weight:600;text-decoration:none;color:var(--accent);}
  #akx-events .loc{display:flex;align-items:center;gap:6px;font-size:.9rem;color:var(--mut);margin-top:3px;}
  #akx-events .loc svg{width:14px;height:16px;flex:none;}
  #akx-events .summary{font-size:.97rem;line-height:1.55;margin:16px 0 2px;}
  #akx-events .summary.clamp{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
  #akx-events .morebtn{margin-top:5px;background:none;border:none;padding:0;cursor:pointer;font-weight:700;font-size:.85rem;color:var(--accent);}
  #akx-events details{border-top:1px solid var(--line);margin-top:12px;padding-top:10px;}
  #akx-events details summary{list-style:none;cursor:pointer;font-size:.78rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;display:flex;align-items:center;gap:8px;color:var(--accent);}
  #akx-events details summary::-webkit-details-marker{display:none;}
  #akx-events details summary .chev{margin-left:auto;transition:transform .2s;font-weight:900;}
  #akx-events details[open] summary .chev{transform:rotate(90deg);}
  #akx-events .tt{margin:12px 0 2px;display:flex;flex-direction:column;gap:6px;}
  #akx-events .ttr{display:flex;gap:12px;font-size:.9rem;line-height:1.4;}
  #akx-events .ttr .tm{font-weight:700;color:var(--accent);white-space:nowrap;min-width:54px;}
  #akx-events .wte{margin:10px 0 2px;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;}
  #akx-events .wte li{position:relative;padding-left:20px;font-size:.93rem;line-height:1.5;}
  #akx-events .wte li:before{content:'';position:absolute;left:2px;top:8px;width:7px;height:7px;border-radius:50%;background:var(--accent);}
  #akx-events details.savedrop summary{color:#B5771E;}
  #akx-events .savedrop .chips{margin-top:11px;display:flex;flex-wrap:wrap;gap:7px;}
  #akx-events .chip{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid #EBD9AE;border-radius:999px;padding:5px 11px;font-size:.78rem;font-weight:600;color:#5c4a24;}
  #akx-events .chip b{color:#B5771E;font-weight:800;}
  #akx-events .freetab{border-top:1px solid var(--line);margin-top:12px;padding-top:12px;font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;display:flex;align-items:center;gap:9px;color:var(--accent);}
  #akx-events .foot{margin-top:auto;padding-top:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
  #akx-events .fee{font-weight:700;font-size:1.02rem;}
  #akx-events .book{display:inline-flex;align-items:center;gap:7px;color:#fff;text-decoration:none;font-weight:700;font-size:.9rem;padding:0 22px;min-height:44px;border-radius:999px;white-space:nowrap;background:var(--accent);}
  #akx-events .dropin{display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:.86rem;padding:0 17px;min-height:42px;border-radius:999px;border:1.6px dashed var(--accent);color:var(--accent);white-space:nowrap;}
  #akx-events .dropin .dot{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.7;}
  /* featured (Special Event): full-width, image left */
  #akx-events .card.feature{grid-column:1 / -1;display:grid;grid-template-columns:300px 1fr;gap:0;border:1.5px solid #E7CE9A;box-shadow:0 14px 40px rgba(120,90,20,.14);}
  #akx-events .card.feature .img{height:auto;min-height:280px;}
  #akx-events .card.feature .ctitle{font-size:1.72rem;}
  /* mobile fold */
  #akx-events .foldbtn{display:none;}
  @media(max-width:760px){ #akx-events .card.feature{grid-template-columns:1fr;} #akx-events .card.feature .img{min-height:200px;} }
  @media(max-width:640px){
    #akx-events .grid{grid-template-columns:1fr;}
    #akx-events .avatar{width:66px;height:66px;}
    #akx-events .img{height:150px;}
    #akx-events .foldbtn{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:14px;padding:11px 14px;border:1px solid var(--line);border-radius:12px;background:#fff;cursor:pointer;font-weight:700;font-size:.82rem;letter-spacing:.03em;text-transform:uppercase;color:var(--accent);}
    #akx-events .foldbtn .fchev{transition:transform .2s;}
    #akx-events .card.open .foldbtn .fchev{transform:rotate(180deg);}
    #akx-events .fold{display:none;}
    #akx-events .card.open .fold{display:block;}
    #akx-events .card.open .img{height:190px;}
  }
  `;

  // ---------- CSV ----------
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
  function csvUrl(tab){return 'https://docs.google.com/spreadsheets/d/'+SHEET_ID+'/gviz/tq?tqx=out:csv&headers=1&sheet='+encodeURIComponent(tab);}

  // ---------- helpers ----------
  function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function splitLines(s){return (s||'').split(/\r?\n|;/).map(function(x){return x.trim();}).filter(Boolean);}
  function low(s){return (s||'').trim().toLowerCase();}
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function parseDate(s){ if(!s) return null;
    var m=s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/); if(m){var y=+m[3];if(y<100)y+=2000;return new Date(y,+m[2]-1,+m[1]);}
    var iso=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if(iso) return new Date(+iso[1],+iso[2]-1,+iso[3]);
    var t=Date.parse(s); return isNaN(t)?null:new Date(t); }
  function shade(hex,p){ hex=hex.replace('#',''); if(hex.length===3)hex=hex.replace(/./g,'$&$&');
    var r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);
    var t=p<0?0:255,a=Math.abs(p);
    r=Math.round(r+(t-r)*a);g=Math.round(g+(t-g)*a);b=Math.round(b+(t-b)*a);
    return '#'+[r,g,b].map(function(x){return ('0'+x.toString(16)).slice(-2);}).join(''); }

  function pctOf(s){ var m=(s||'').match(/(\d+(\.\d+)?)\s*%/); return m?parseFloat(m[1]):null; }
  function parseDiscounts(s){ return splitLines(s).map(function(line){
      var p=line.split('|'); var label=(p[0]||'').trim(); var amount=(p[1]||p[0]||'').trim();
      return {label:label, amount:amount, pct:pctOf(amount)};
    }).filter(function(d){return d.label;}); }

  // ---------- images (accept .jpg or .png; cascade then fall back) ----------
  function imgEl(cls, srcs, fb){
    srcs = srcs.filter(Boolean);
    var first = srcs[0] || '';
    var rest  = srcs.slice(1).join('|');
    var oe = "var a=(this.dataset.srcs||'').split('|').filter(Boolean);var i=+(this.dataset.i||0);"
           + "if(i<a.length){this.dataset.i=i+1;this.src=a[i];return;}"
           + (fb==='lotus'
               ? "this.onerror=null;var w=this.closest('.avatar');if(w)w.classList.add('lotus');this.src='"+IMG+"lotus.png';"
               : "this.remove();");
    return '<img'+(cls?' class="'+cls+'"':'')+' src="'+first+'" data-srcs="'+rest+'" data-i="0" alt="" onerror="'+oe+'">';
  }
  function bothExt(base){ return [base+'.jpg', base+'.png']; }

  function teacherPhoto(id){
    // random photo per card (id, id-2, id-3; jpg or png); cascade to lotus
    var pick=Math.floor(Math.random()*3), base=TIMG+encodeURIComponent(id);
    var bases=[base, base+'-2', base+'-3'];
    var order=[bases[pick], bases[0], bases[1], bases[2]].filter(function(v,i,a){return a.indexOf(v)===i;});
    var srcs=[]; order.forEach(function(b){ srcs=srcs.concat(bothExt(b)); });
    return '<span class="avatar">'+imgEl('', srcs, 'lotus')+'</span>';
  }
  function lotusAvatar(){ return '<span class="avatar lotus"><img src="'+IMG+'lotus.png" alt=""></span>'; }
  var PIN = '<svg viewBox="0 0 24 24" fill="#D8443A" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';

  function timetableHTML(schedule){
    var lines=splitLines(schedule); if(!lines.length) return '';
    var rows=lines.map(function(ln){
      var m=ln.match(/^(\d{1,2}[:.]\d{2})\s*[—\-–]?\s*(.*)$/);
      if(m) return '<div class="ttr"><span class="tm">'+esc(m[1])+'</span><span>'+esc(m[2])+'</span></div>';
      return '<div class="ttr"><span>'+esc(ln)+'</span></div>';
    }).join('');
    return '<details><summary>Event Timetable <span class="chev">&#8250;</span></summary><div class="tt">'+rows+'</div></details>';
  }
  function wteHTML(s){ var items=splitLines(s); if(!items.length) return '';
    return '<details><summary>What to expect <span class="chev">&#8250;</span></summary><ul class="wte">'
      + items.map(function(x){return '<li>'+esc(x)+'</li>';}).join('') + '</ul></details>'; }

  function savingsHTML(discs, maxPct){
    if(!discs.length) return '';
    var chips=discs.map(function(d){return '<span class="chip"><b>&minus;'+esc(d.amount)+'</b> '+esc(d.label)+'</span>';}).join('');
    var sub = maxPct? ' &middot; up to '+maxPct+'% off':'';
    return '<details class="savedrop"><summary>&#9733; Savings available'+sub+' <span class="chev">&#8250;</span></summary><div class="chips">'+chips+'</div></details>';
  }

  function card(ev, ttMap, teMap){
    var type = TYPES[low(ev['Event Type'])] || {tag:'', colour:DEFAULT_COLOUR};
    var accent = ev['Colour'] || type.colour || DEFAULT_COLOUR;
    var isFeature = !!type.feature;
    var isFree = low(ev['Free'])==='yes' || !!type.free;
    var tag = ev['Event tag'] || type.tag || '';
    var d = parseDate(ev['Date']);
    var chip = d ? '<div class="datechip"><div class="d">'+d.getDate()+'</div><div class="m">'+MON[d.getMonth()]+'</div><div class="w">'+WD[d.getDay()]+'</div></div>' : '';

    // teacher
    var te = teMap[low(ev['Teacher ID'])];
    var teName = te ? te['Name'] : '';
    var teLink = te ? te['Link'] : '';
    var av = (te && ev['Teacher ID']) ? teacherPhoto(ev['Teacher ID'].trim()) : lotusAvatar();

    // timetable: explicit field, else the timetable named after the type/tag
    var ttName = ev['Timetable'] || tag;
    var ttRow = ttMap[low(ttName)];
    var ttHTML = ttRow ? timetableHTML(ttRow['Schedule']) : '';

    // discounts + early-bird expiry
    var discs = parseDiscounts(ev['Discounts']);
    if(d){ var days=Math.ceil((d - new Date())/86400000); var cut=isFeature?14:7;
      discs = discs.filter(function(x){ return !(/early\s*bird/i.test(x.label) && days<cut); }); }
    var maxPct = discs.reduce(function(m,x){return x.pct&&x.pct>m?x.pct:m;},0);

    // event image (jpg or png)
    var evimg = ev['Event ID'] ? imgEl('evimg', bothExt(IMG+encodeURIComponent(ev['Event ID'].trim())), 'gone') : '';

    var img = '<div class="img"><span class="ph">event photo</span>'+evimg+chip
      + (tag? '<div class="type"><i></i>'+esc(tag)+'</div>':'')
      + av + '</div>';

    var metaTeacher = teName ? ' &middot; with '+(teLink?'<a href="'+esc(teLink)+'">'+esc(teName)+'</a>':esc(teName)) : '';
    var savings = isFree
        ? '<div class="freetab"><span>&#9733;</span> Free event <span>&#9733;</span></div>'
        : savingsHTML(discs, maxPct);

    var feeTxt = isFree ? 'Free' : esc(ev['Fee']||'');
    var cta = ev['Booking link']
        ? '<a class="book" href="'+esc(ev['Booking link'])+'" target="_blank" rel="noopener">Book &rarr;</a>'
        : '<span class="dropin"><span class="dot"></span>Drop-in event</span>';

    var loc = ev['Location'] || 'Akanishta Centre';
    var sumHTML = ev['Summary']
      ? '<div class="sumwrap"><p class="summary clamp">'+esc(ev['Summary'])+'</p><button type="button" class="morebtn" style="display:none">More</button></div>'
      : '';

    var foldInner = sumHTML
      + wteHTML(ev['What to expect'])
      + ttHTML
      + savings
      + '<div class="foot"><span class="fee">'+feeTxt+'</span>'+cta+'</div>';

    var body = '<div class="body">'
      + '<h3 class="ctitle">'+esc(ev['Title'])+'</h3>'
      + '<div class="meta">'+esc(ev['Time']||'')+metaTeacher+'</div>'
      + '<div class="loc">'+PIN+esc(loc)+'</div>'
      + '<div class="fold">'+foldInner+'</div>'
      + '<button type="button" class="foldbtn" aria-expanded="false">See details <span class="fchev">&#9662;</span></button>'
      + '</div>';

    var vars='--accent:'+accent+';--a2:'+shade(accent,0.30)+';';
    return '<article class="card'+(isFeature?' feature':'')+'" style="'+vars+'">'+img+body+'</article>';
  }

  // ---------- render ----------
  function isVisible(ev, today){
    if(!ev['Title']) return false;
    if(low(ev['Status'])==='draft') return false;
    var sf=parseDate(ev['Show from']); if(sf){sf.setHours(0,0,0,0); if(today<sf) return false;}
    var d=parseDate(ev['Date']); if(d){d.setHours(0,0,0,0); if(today>d) return false;}
    return true;
  }
  function render(mount, events, ttMap, teMap){
    var today=new Date(); today.setHours(0,0,0,0);
    var live=events.filter(function(e){return isVisible(e,today);})
      .sort(function(a,b){var da=parseDate(a['Date'])||0,db=parseDate(b['Date'])||0;return da-db;});
    var html = SHOW_HEADING ? '<h2 class="ev-h">Courses &amp; Retreats</h2>' : '';
    if(!live.length){ html += '<div class="ev-msg">No upcoming events just now — please check back soon.</div>'; }
    else { html += '<div class="grid">'+live.map(function(e){return card(e,ttMap,teMap);}).join('')+'</div>'; }
    mount.innerHTML = html;
    wireMore(mount);
    wireFold(mount);
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){wireMore(mount);});}
  }
  function wireFold(mount){
    mount.querySelectorAll('.foldbtn').forEach(function(b){
      if(b.dataset.wired) return; b.dataset.wired='1';
      b.addEventListener('click',function(){
        var card=b.closest('.card'); var open=card.classList.toggle('open');
        b.setAttribute('aria-expanded', open?'true':'false');
        b.firstChild.nodeValue = open ? 'Hide details ' : 'See details ';
        if(open) wireMore(mount);
      });
    });
  }
  function wireMore(mount){
    mount.querySelectorAll('.sumwrap').forEach(function(w){
      var p=w.querySelector('.summary'), b=w.querySelector('.morebtn'); if(!p||!b) return;
      var overflow = p.scrollHeight - p.clientHeight > 2;
      b.style.display = overflow ? 'inline-block' : 'none';
      if(b.dataset.wired) return; b.dataset.wired='1';
      b.addEventListener('click',function(){ var clamped=p.classList.toggle('clamp'); b.textContent=clamped?'More':'Less'; });
    });
  }

  function keyMap(objs, field){ var m={}; objs.forEach(function(o){var k=low(o[field]); if(k) m[k]=o;}); return m; }
  function isHintTT(o){ return /matches the event type/i.test(o['Timetable']||'') || /one line per part/i.test(o['Schedule']||''); }
  function isHintTE(o){ return /short code/i.test(o['Teacher ID']||''); }

  function init(){
    var mount=document.getElementById(MOUNT_ID); if(!mount) return;
    if(mount.getAttribute('data-akx-done')==='1') return;
    mount.setAttribute('data-akx-done','1');
    if(!document.getElementById('akx-events-style')){var st=document.createElement('style');st.id='akx-events-style';st.textContent=STYLE;document.head.appendChild(st);}
    if(!document.getElementById('akx-fonts')){var lf=document.createElement('link');lf.id='akx-fonts';lf.rel='stylesheet';lf.href='https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600;700&display=swap';document.head.appendChild(lf);}
    mount.innerHTML='<div class="ev-msg">Loading events…</div>';
    Promise.all([TAB_EVENTS,TAB_TT,TAB_TE].map(function(t){return fetch(csvUrl(t)).then(function(r){return r.text();});}))
      .then(function(res){
        var events=toObjs(parseCSV(res[0]));
        var tt=toObjs(parseCSV(res[1])).filter(function(o){return !isHintTT(o);});
        var te=toObjs(parseCSV(res[2])).filter(function(o){return !isHintTE(o);});
        render(mount, events, keyMap(tt,'Timetable'), keyMap(te,'Teacher ID'));
      })
      .catch(function(e){ mount.innerHTML='<div class="ev-msg">Sorry, the events couldn’t load just now.</div>'; });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
