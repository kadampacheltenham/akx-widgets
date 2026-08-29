/* Akanishta — BRANCH page widget  v0.2 (prototype, 28 Aug 2026)
   TWO mounts, one file. Put each where it belongs on the page:

   1) WHERE & WHEN + branch pills — sits directly under the page title/intro text
      <div id="akx-branch-when" data-town="cirencester" data-name="Cirencester"></div>

   2) CLASSES & EVENTS list — the merged, dated list further down the page
      <div id="akx-branch" data-town="cirencester" data-name="Cirencester"
           data-calendar="akx-cal" data-staytouch="akx-staytouch"></div>

   <script src="https://kadampacheltenham.github.io/akx-widgets/branch-events.js" defer></script>

   Reads BOTH sheets:
     • Weekly Classes  — tabs "Class details" (filtered on Location ID), "Talks & series", "Locations"
     • Weekend events  — tab "Events" (half-days, retreats, silent days, away days)

   COLOUR RULE (Gen, 28 Aug): apart from site blue #2A66A6 and warm coral #E2886A,
   colours should be relaxing — lighter and brighter, never heavy.

   The calendar is deliberately a SEPARATE embed: if this widget fails, the calendar
   still shows events.
*/
(function () {
  var WC_SHEET = '1YArubV8QgCvPUIIvHOHWhCN2fYLRz0DDPSRSHD_tSmY';
  var CR_SHEET = '1g8VSqkv9zIR375RDf9R-B-34zMhsHXoUYx7ZYhuXlmk';
  var M_WHEN = 'akx-branch-when';
  var M_LIST = 'akx-branch';

  /* the branch family — pills are generated from this, current town removed */
  var BRANCHES = [
    {slug:'cirencester', name:'Cirencester'},
    {slug:'stroud',      name:'Stroud'},
    {slug:'gloucester',  name:'Gloucester'},
    {slug:'tewkesbury',  name:'Tewkesbury'},
    {slug:'evesham',     name:'Evesham'}
  ];

  /* palette — site blue + coral kept; everything else soft, light, bright */
  var C = {
    blue:'#2A66A6', coral:'#E2886A', ink:'#2B2A28', mut:'#6E6A64',
    line:'#EDE8DF', cream:'#FEFEFA',
    aqua:'#3FA9A0',  aquaBg:'#E9F6F4',  aquaBd:'#BFE4DF',
    sky:'#5FB3DC',   skyBg:'#EAF4FB',   skyBd:'#C6E1F1',
    leaf:'#6DBE6F',  leafBg:'#ECF7EC',
    sun:'#E8B75A',   sunBg:'#FDF4E4',
    lilac:'#A98FD1', lilacBg:'#F2EDFA',
    rose:'#E39BAF',  roseBg:'#FBEDF1'
  };
  /* weekend Event Type -> label + soft colour */
  var TYPES = {
    'special event':   {t:'Special event',   c:C.sun},
    'half-day course': {t:'Half-day course', c:C.sky},
    'day course':      {t:'Day course',      c:C.sky},
    'half-day retreat':{t:'Half-day retreat',c:C.aqua},
    'day retreat':     {t:'Day retreat',     c:C.aqua},
    'silent day':      {t:'Silent day',      c:C.lilac},
    'free half-day':   {t:'Free half-day',   c:C.leaf},
    'away day':        {t:'Away day',        c:C.sky},
    'other':           {t:'',                c:C.rose}
  };

  var FONT = "Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
  var SERIF = "Fraunces,Georgia,serif";

  var STYLE = ''
  /* ---- shared ---- */
  + '.akxb{--ink:'+C.ink+';--mut:'+C.mut+';font-family:'+FONT+';color:var(--ink);max-width:1000px;margin:0 auto;}'
  + '.akxb *{box-sizing:border-box;}'
  + '.akxb .bx-h{text-align:center;font-family:'+SERIF+';font-weight:600;font-size:1.8rem;color:'+C.blue+';margin:0 0 20px;}'

  /* ---- 1. where & when: ONE invitation card ---- */
  + '.akxb .inv{background:#fff;border:1px solid '+C.aquaBd+';border-radius:20px;padding:38px 40px;text-align:center;box-shadow:0 2px 14px rgba(42,102,166,.05);}'
  + '.akxb .inv-eye{font:600 .74rem/1 '+FONT+';letter-spacing:.16em;text-transform:uppercase;color:'+C.coral+';margin-bottom:14px;}'
  + '.akxb .inv-t{font-family:'+SERIF+';font-weight:600;font-size:1.72rem;line-height:1.2;color:'+C.blue+';margin:0 0 6px;}'
  + '.akxb .inv-venue{font:600 1.06rem/1.5 '+FONT+';color:'+C.blue+';margin-bottom:2px;}'
  + '.akxb .inv-addr{font-size:1rem;line-height:1.55;color:var(--mut);}'
  + '.akxb .inv-rule{width:54px;height:2px;background:'+C.aquaBd+';border-radius:2px;margin:22px auto;}'
  + '.akxb .inv-slots{display:flex;flex-direction:column;gap:10px;margin-bottom:6px;}'
  + '.akxb .inv-slot{font-family:'+SERIF+';font-weight:600;font-size:1.4rem;line-height:1.25;color:'+C.blue+';}'
  + '.akxb .inv-slot em{font-style:normal;color:'+C.aqua+';}'
  + '.akxb .inv-dur{font:600 .8rem/1.5 '+FONT+';letter-spacing:.05em;text-transform:uppercase;color:var(--mut);}'
  + '.akxb .inv-note{font-size:.95rem;line-height:1.55;color:var(--mut);margin-top:16px;}'
  + '.akxb .inv-acts{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:22px;}'
  + '.akxb .inv-a{display:inline-block;font:600 .93rem '+FONT+';padding:11px 20px;border-radius:999px;text-decoration:none;background:'+C.aquaBg+';color:'+C.blue+';border:1px solid '+C.aquaBd+';}'
  + '.akxb .inv-a.solid{background:'+C.coral+';color:#fff;border-color:'+C.coral+';}'
  + '.akxb .inv-soon{font-size:1.05rem;line-height:1.65;color:var(--ink);}'

  /* ---- 2. pills (no sub-header) ---- */
  + '.akxb .bp{margin-top:22px;}'
  + '.akxb .bp-row{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;}'
  + '.akxb .bp-row a{font:600 .9rem '+FONT+';text-decoration:none;padding:9px 17px;border-radius:999px;background:'+C.skyBg+';color:#3E7FA8;border:1px solid '+C.skyBd+';transition:background .15s;}'
  + '.akxb .bp-row a:hover{background:#DCEDF8;}'

  /* ---- 3. events list ---- */
  + '.akxb .bx-list{display:flex;flex-direction:column;gap:15px;}'
  + '.akxb .bx-year{display:flex;align-items:center;gap:14px;margin:12px 0 2px;}'
  + '.akxb .bx-year span{font:700 .8rem/1 '+FONT+';letter-spacing:.14em;text-transform:uppercase;color:'+C.coral+';background:#FCF1EB;border:1px solid #F2DCD0;border-radius:999px;padding:8px 15px;white-space:nowrap;}'
  + '.akxb .bx-year i{flex:1;height:1px;background:'+C.line+';display:block;}'
  + '.akxb .bx-card{background:#fff;border:1px solid '+C.line+';border-left:5px solid var(--ac,'+C.aqua+');border-radius:14px;padding:18px 22px;display:flex;gap:20px;align-items:flex-start;}'
  + '.akxb .bx-when{flex:0 0 92px;text-align:center;border-right:1px solid #F3EFE8;padding-right:14px;}'
  + '.akxb .bx-d{font:600 1.5rem/1 '+SERIF+';color:var(--ac);}'
  + '.akxb .bx-m{font:700 .7rem/1.5 '+FONT+';letter-spacing:.1em;text-transform:uppercase;color:var(--mut);}'
  + '.akxb .bx-dow{font:600 .72rem/1.4 '+FONT+';color:var(--mut);}'
  + '.akxb .bx-body{flex:1;min-width:0;}'
  + '.akxb .bx-tag{display:inline-block;font:700 .66rem/1 '+FONT+';letter-spacing:.09em;text-transform:uppercase;color:#4a463f;background:var(--acbg,'+C.aquaBg+');border:1px solid var(--acbd,'+C.aquaBd+');border-radius:999px;padding:6px 11px;margin-bottom:8px;}'
  + '.akxb .bx-t{font:600 1.16rem/1.3 '+SERIF+';color:'+C.blue+';margin:0 0 4px;}'
  + '.akxb .bx-meta{font-size:.93rem;color:var(--mut);margin-bottom:6px;}'
  + '.akxb .bx-meta b{color:var(--ink);font-weight:600;}'
  + '.akxb .bx-sum{font-size:.95rem;line-height:1.55;margin:0 0 9px;}'
  + '.akxb .bx-dates{font-size:.89rem;color:var(--mut);margin-bottom:9px;}'
  + '.akxb .bx-foot{display:flex;gap:9px;flex-wrap:wrap;align-items:center;}'
  + '.akxb .bx-btn{display:inline-block;background:'+C.coral+';color:#fff;font:600 .9rem '+FONT+';padding:9px 16px;border-radius:999px;text-decoration:none;}'
  + '.akxb .bx-btn.ghost{background:'+C.aquaBg+';color:'+C.aqua+';border:1px solid '+C.aquaBd+';}'
  + '.akxb .bx-price{font-size:.92rem;color:var(--mut);}'
  + '.akxb .bx-empty{background:#fff;border:1px solid '+C.skyBd+';border-left:5px solid '+C.sky+';border-radius:14px;padding:24px 26px;}'
  + '.akxb .bx-empty p{margin:0 0 9px;font-size:1.02rem;line-height:1.6;}'
  + '.akxb .bx-empty p:last-child{margin:0;}'
  + '.akxb .bx-callink{text-align:center;margin-top:20px;}'
  + '.akxb .bx-callink a{font:600 .95rem '+FONT+';color:'+C.aqua+';text-decoration:none;border-bottom:1px solid '+C.aquaBd+';padding-bottom:2px;}'
  + '.akxb .bx-msg{text-align:center;color:#8f8a81;padding:20px;}'

  + '@media(max-width:640px){'
  +   '.akxb .inv{padding:26px 20px;border-radius:16px;}'
  +   '.akxb .inv-t{font-size:1.34rem;} .akxb .inv-slot{font-size:1.16rem;}'
  +   '.akxb .bx-card{flex-direction:column;gap:12px;padding:16px;}'
  +   '.akxb .bx-when{display:flex;gap:9px;align-items:baseline;border-right:0;border-bottom:1px solid #F3EFE8;padding:0 0 10px;flex:none;text-align:left;width:100%;}'
  +   '.akxb .bx-h{font-size:1.4rem;}'
  +   '.akxb .bx-btn,.akxb .inv-a{flex:1;text-align:center;}'
  + '}';

  /* ---------- helpers ---------- */
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];}); }
  function gviz(id, tab){
    var u='https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:json&headers=1&sheet='+encodeURIComponent(tab);
    return fetch(u).then(function(r){return r.text();}).then(function(t){
      var j=JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}')+1));
      var cols=j.table.cols.map(function(c){ return String(c.label||'').trim(); });
      return j.table.rows.map(function(rw){
        var o={}; cols.forEach(function(c,i){ var cell=rw.c[i];
          o[c]= cell ? (cell.f!=null && String(cell.f).length ? cell.f : cell.v) : ''; });
        return o;
      });
    });
  }
  function pick(o,names){ for(var i=0;i<names.length;i++){ if(o[names[i]]!=null && o[names[i]]!=='') return o[names[i]]; } return ''; }
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var DAYFULL={mon:'Mondays',tue:'Tuesdays',tues:'Tuesdays',wed:'Wednesdays',weds:'Wednesdays',
               thu:'Thursdays',thur:'Thursdays',thurs:'Thursdays',fri:'Fridays',sat:'Saturdays',sun:'Sundays'};
  function dayName(s){
    var k=String(s||'').trim().toLowerCase().replace(/[^a-z]/g,'').slice(0,5);
    for(var i=5;i>=3;i--){ if(DAYFULL[k.slice(0,i)]) return DAYFULL[k.slice(0,i)]; }
    return s? String(s) : '';
  }
  function midnight(d){ var x=new Date(d); x.setHours(0,0,0,0); return x; }
  var TODAY=midnight(new Date());
  function parseDate(s){
    if(!s) return null; s=String(s).trim();
    var m=s.match(/^(\d{1,2})[\/\.\-](\d{1,2})(?:[\/\.\-](\d{2,4}))?$/);
    if(!m){ var d0=new Date(s); return isNaN(d0)?null:midnight(d0); }
    var dd=+m[1], mm=+m[2]-1, yy=m[3];
    if(yy){ yy=+yy; if(yy<100) yy+=2000; }
    else { yy=TODAY.getFullYear(); if((TODAY-new Date(yy,mm,dd))/86400000 > 60) yy+=1; }
    var d=new Date(yy,mm,dd); return isNaN(d)?null:midnight(d);
  }
  function splitDates(s){ return String(s||'').split(/[;,]/).map(function(x){return x.trim();}).filter(Boolean).map(parseDate).filter(Boolean); }
  function live(v){ return /live/i.test(String(v||'')); }
  function shown(sf){ var d=parseDate(sf); return !d || d<=TODAY; }
  function fmtRun(ds){ return ds.map(function(d){ return d.getDate()+' '+MON[d.getMonth()]; }).join(' · '); }
  var UA=(navigator.userAgent||''), APPLE=/iphone|ipad|ipod|macintosh|mac os x/i.test(UA);
  function maps(q){ return APPLE ? 'https://maps.apple.com/?q='+encodeURIComponent(q)
                                 : 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q); }
  function tint(hex){ /* soft background from an accent */
    var m={}; m[C.aqua]=C.aquaBg; m[C.sky]=C.skyBg; m[C.leaf]=C.leafBg;
    m[C.sun]=C.sunBg; m[C.lilac]=C.lilacBg; m[C.rose]=C.roseBg;
    return m[hex]||C.aquaBg;
  }

  /* ---------- 1. WHERE & WHEN + pills ---------- */
  function drawWhen(root, name, town, slots, venue){
    var html='<style>'+STYLE+'</style><div class="inv">';
    html+='<div class="inv-eye">Everybody welcome</div>';
    html+='<h2 class="inv-t">Meditation classes in '+esc(name)+'</h2>';

    if(slots.length){
      if(venue&&venue.name) html+='<div class="inv-venue">'+esc(venue.name)+'</div>';
      if(venue&&venue.address) html+='<div class="inv-addr">'+esc(venue.address)+'</div>';
      html+='<div class="inv-rule"></div><div class="inv-slots">';
      slots.forEach(function(s){
        html+='<div><div class="inv-slot">'+esc(s.day)+' <em>at '+esc(s.time)+'</em></div>'
            + (s.duration?'<div class="inv-dur">'+esc(s.duration)+'</div>':'')+'</div>';
      });
      html+='</div>';
      if(venue&&venue.access) html+='<div class="inv-note">'+esc(venue.access)+'</div>';
      var acts='';
      var booking=null; slots.forEach(function(s){ if(!booking&&s.book) booking=s.book; });
      if(booking) acts+='<a class="inv-a solid" href="'+esc(booking)+'" target="_blank" rel="noopener">Book your Spot &rarr;</a>';
      if(venue&&venue.address) acts+='<a class="inv-a" href="'+esc(maps(venue.address))+'" target="_blank" rel="noopener">Get directions</a>';
      if(acts) html+='<div class="inv-acts">'+acts+'</div>';
    } else {
      html+='<div class="inv-rule"></div>'
          + '<p class="inv-soon">We&rsquo;re confirming a venue and dates in '+esc(name)+' now.<br>'
          + 'In the meantime you&rsquo;re very welcome at any of our other classes, and there are ways to start at home below.</p>';
    }
    html+='</div>';

    /* pills — Cheltenham first (to What\u2019s On), then the other branches */
    var pills=[{href:'/whats-on', label:'Events in Cheltenham'}];
    BRANCHES.forEach(function(b){ if(b.slug!==town) pills.push({href:'/'+b.slug, label:'Events in '+b.name}); });
    html+='<div class="bp"><div class="bp-row">'
       + pills.map(function(p){ return '<a href="'+p.href+'">'+esc(p.label)+'</a>'; }).join('')
       + '</div></div>';

    root.className='akxb';
    root.innerHTML=html;
  }

  /* ---------- 3. events list ---------- */
  function card(it){
    var d=it.date, acc=it.colour||C.aqua;
    var when='<div class="bx-when"><div class="bx-d">'+d.getDate()+'</div>'
           + '<div class="bx-m">'+MON[d.getMonth()]+'</div>'
           + '<div class="bx-dow">'+DOW[d.getDay()]+'</div></div>';
    var meta=[];
    if(it.time) meta.push('<b>'+esc(it.time)+'</b>');
    if(it.duration) meta.push(esc(it.duration));
    if(it.teacher) meta.push('with <b>'+esc(it.teacher)+'</b>');
    if(it.venue) meta.push(esc(it.venue));
    var foot='';
    if(it.book) foot+='<a class="bx-btn" href="'+esc(it.book)+'" target="_blank" rel="noopener">Book your Spot &rarr;</a>';
    if(it.price) foot+='<span class="bx-price">'+esc(it.price)+'</span>';
    else if(!it.book) foot+='<span class="bx-price">Drop-in &mdash; nothing to book</span>';
    if(it.directions) foot+='<a class="bx-btn ghost" href="'+esc(it.directions)+'" target="_blank" rel="noopener">Get directions</a>';
    return '<article class="bx-card" style="--ac:'+acc+';--acbg:'+tint(acc)+';--acbd:'+acc+'33">'+when+'<div class="bx-body">'
      + (it.tag?'<span class="bx-tag">'+esc(it.tag)+'</span>':'')
      + '<h3 class="bx-t">'+esc(it.title)+'</h3>'
      + (meta.length?'<div class="bx-meta">'+meta.join(' &nbsp;·&nbsp; ')+'</div>':'')
      + (it.summary?'<p class="bx-sum">'+esc(it.summary)+'</p>':'')
      + (it.run?'<div class="bx-dates">'+esc(it.run)+'</div>':'')
      + (foot?'<div class="bx-foot">'+foot+'</div>':'')
      + '</div></article>';
  }
  function drawList(root, name, items, calId, stayId){
    var html='<style>'+STYLE+'</style>';
    html+='<h2 class="bx-h">Classes and events in '+esc(name)+'</h2>';
    root.className='akxb';
    if(!items.length){
      html+='<div class="bx-empty">'
          + '<p><strong>News and events for '+esc(name)+' coming soon.</strong></p>'
          + '<p>Why not stay in touch with WhatsApp and eNews &mdash; see below.</p>'
          + '<p>Listed below you&rsquo;ll find other events you may be interested in and some ways to start from home.</p>'
          + '</div>';
      root.innerHTML=html;
      if(stayId){
        var stay=document.getElementById(stayId);
        var host=stay&&stay.closest?(stay.closest('.page-section')||stay):null;
        var mine=root.closest?(root.closest('.page-section')||root):root;
        if(host&&mine&&host.parentNode&&mine.parentNode===host.parentNode) mine.parentNode.insertBefore(host, mine.nextSibling);
      }
      return;
    }
    var lastYear=null;
    html+='<div class="bx-list">';
    items.forEach(function(it){
      var y=it.date.getFullYear();
      if(lastYear!==null && y!==lastYear) html+='<div class="bx-year"><i></i><span>'+y+'</span><i></i></div>';
      lastYear=y; html+=card(it);
    });
    html+='</div>';
    html+='<div class="bx-callink"><a href="#'+esc(calId)+'">See the full calendar of local events &darr;</a></div>';
    root.innerHTML=html;
  }

  /* ---------- data ---------- */
  function run(){
    var mWhen=document.getElementById(M_WHEN), mList=document.getElementById(M_LIST);
    var host=mWhen||mList; if(!host) return;
    var town=(host.getAttribute('data-town')||'').trim().toLowerCase();
    var name=(host.getAttribute('data-name')||town.charAt(0).toUpperCase()+town.slice(1)).trim();
    var calId=((mList&&mList.getAttribute('data-calendar'))||'akx-cal').trim();
    var stayId=((mList&&mList.getAttribute('data-staytouch'))||'').trim();
    if(mList){ mList.className='akxb'; mList.innerHTML='<style>'+STYLE+'</style><div class="bx-msg">Loading classes and events…</div>'; }

    Promise.all([
      gviz(WC_SHEET,'Class details').catch(function(){return [];}),
      gviz(WC_SHEET,'Talks & series').catch(function(){return [];}),
      gviz(WC_SHEET,'Locations').catch(function(){return [];}),
      gviz(CR_SHEET,'Events').catch(function(){return [];})
    ]).then(function(res){
      var classes=res[0], talks=res[1], locs=res[2], events=res[3];

      /* venue */
      var venue=null;
      locs.forEach(function(l){
        var id=String(pick(l,['Location ID','location','id'])||'').trim().toLowerCase();
        if(id===town && live(pick(l,['status']))) venue={ name:pick(l,['display_name'])||name,
          address:pick(l,['address']), access:pick(l,['access_note']) };
      });

      var byId={}; talks.forEach(function(t){ byId[String(pick(t,['Event ID','id'])).trim()]=t; });

      /* rows for this town, live + future */
      var mine=[];
      classes.forEach(function(c){
        if(String(pick(c,['Location ID','location'])||'').trim().toLowerCase()!==town) return;
        var t=byId[String(pick(c,['Event ID','id'])).trim()];
        if(t && (!live(pick(t,['status'])) || !shown(pick(t,['show_from'])))) return;
        var future=splitDates(pick(c,['dates'])).filter(function(d){ return d>=TODAY; });
        if(!future.length) return;
        mine.push({c:c,t:t,future:future});
      });

      /* --- WHERE & WHEN: the standing pattern, deduped on day+time --- */
      if(mWhen){
        var seen={}, slots=[];
        mine.slice().sort(function(a,b){ return a.future[0]-b.future[0]; }).forEach(function(r){
          var day=dayName(pick(r.c,['day'])), time=pick(r.c,['time']);
          var k=day+'|'+time; if(seen[k]) return; seen[k]=1;
          slots.push({ day:day, time:time, duration:pick(r.c,['duration']), book:pick(r.c,['booking_url']) });
        });
        drawWhen(mWhen, name, town, slots, venue);
      }

      /* --- LIST: weekly series + weekend events, merged --- */
      if(mList){
        var items=[];
        mine.forEach(function(r){
          var price=[pick(r.c,['price_class']), pick(r.c,['price_series'])].filter(Boolean);
          items.push({
            date:r.future[0],
            run: r.future.length>1 ? r.future.length+' classes · '+fmtRun(r.future) : '',
            title: r.t?pick(r.t,['title']):'Weekly meditation class',
            tag: r.t?pick(r.t,['type']):'Weekly class',
            colour:C.leaf,
            time:pick(r.c,['time']), duration:pick(r.c,['duration']),
            teacher:pick(r.c,['teacher']), venue:venue?venue.name:name,
            summary:r.t?pick(r.t,['description']):'',
            price: price.length? price.join(' · ') : '',
            book: pick(r.c,['booking_url']),
            directions: venue&&venue.address? maps(venue.address):''
          });
        });
        events.forEach(function(e){
          if(!live(pick(e,['Status'])) || !shown(pick(e,['Show from']))) return;
          var loc=String(pick(e,['Location'])||'').trim(), hay=loc.toLowerCase();
          var isMine = town==='cheltenham' ? (!loc || /cheltenham|akanishta/.test(hay)) : (hay.indexOf(town)>-1);
          if(!isMine) return;
          var d=parseDate(pick(e,['Date'])); if(!d || d<TODAY) return;
          var ty=TYPES[String(pick(e,['Event Type'])||'').trim().toLowerCase()]||TYPES.other;
          var free=/^(y|yes|true|1)$/i.test(String(pick(e,['Free'])||''));
          items.push({ date:d, title:pick(e,['Title']), tag:ty.t||pick(e,['Event tag']), colour:ty.c,
            time:pick(e,['Time']), venue:loc||(venue?venue.name:name), summary:pick(e,['Summary']),
            price: free?'Free event':pick(e,['Fee']), book:pick(e,['Booking link']),
            directions: loc? maps(loc) : (venue&&venue.address? maps(venue.address):'') });
        });
        items.sort(function(a,b){ return a.date-b.date; });
        drawList(mList, name, items, calId, stayId);
      }
    }).catch(function(err){
      if(mList) mList.innerHTML='<style>'+STYLE+'</style><div class="bx-msg">Classes and events are taking a moment — please see the calendar below.</div>';
      if(window.console) console.log('[branch-events]', err);
    });
  }

  function go(){
    var h=document.getElementById(M_WHEN)||document.getElementById(M_LIST);
    if(!h || h.getAttribute('data-done')) return;
    h.setAttribute('data-done','1'); run();
  }
  go();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', go);
  var mo=new MutationObserver(go);
  try{ mo.observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}
})();
