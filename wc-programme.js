/* Akanishta — Talks & short courses widget.
   Reads a public Google Sheet (tabs "Talks & series" + "Class times") and renders flyer cards.
   Include with:  <div id="akx-programme"></div>
                  <script src="https://kadampacheltenham.github.io/akx-widgets/programme.js" defer></script>
*/
(function(){
  var SHEET_ID = '1YArubV8QgCvPUIIvHOHWhCN2fYLRz0DDPSRSHD_tSmY';
  var MOUNT_ID = 'akx-programme';
  var TAB_ITEMS = 'Talks & series';
  var TAB_CLASSES = 'Class times';
  var DIRECTIONS_URL = '/visit-us';
  var IMG_BASE = 'https://kadampacheltenham.github.io/akx-widgets/images/'; // auto image by id: images/<id>.jpg
  var STYLE = String.raw`
  #akx-programme{--ink:#2B2A28;--dteal:#2E7C7C;--lteal:#0c9d94;--coral:#E2886A;--blue:#22B8F0;--bluedk:#0E90CC;--coral2:#FF7A4D;--coraldk:#E85C2E;font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);max-width:1000px;margin:0 auto;}   /* lotus/content width — matches glance + calendars */
  #akx-programme *{box-sizing:border-box;}
  #akx-programme .pg-h{text-align:center;font-size:1.9rem;font-weight:600;color:#2A66A6;margin:0 0 6px;}   /* blue — site heading standard */
  #akx-programme .pg-lead{max-width:840px;margin:0 auto 20px;text-align:left;color:#6f6a62;font-size:.98rem;line-height:1.55;}
  #akx-programme .pg-lead p{margin:0 0 10px;} #akx-programme .pg-lead p:last-child{margin:0;}
  #akx-programme .pg-msg{text-align:center;color:#8a857c;padding:24px;}
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Oswald:wght@500;600;700&display=swap');
  .cc{background:#fff;border:1px solid #ece7dd;border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,.07);overflow:hidden;margin-bottom:22px;}
  #akx-programme .cc:last-child{margin-bottom:0;}
  /* two-tone banner: darker timing segment (left) then the type */
  .cc-banner{display:flex;align-items:stretch;color:#fff;font-weight:800;font-size:.82rem;letter-spacing:.05em;text-transform:uppercase;}
  .cc.talk .cc-banner{background:var(--blue);} .cc.course .cc-banner{background:var(--coral2);}
  .cc-when{display:flex;align-items:center;gap:7px;padding:11px 20px;}
  .cc.talk .cc-when{background:var(--bluedk);} .cc.course .cc-when{background:var(--coraldk);}
  .cc-dot{width:7px;height:7px;border-radius:50%;background:#fff;opacity:.92;flex:none;}
  .cc-type{display:flex;align-items:center;padding:11px 20px;}
  .cc-top{display:grid;grid-template-columns:190px 1fr;grid-template-areas:"gfx head" "gfx body";column-gap:24px;row-gap:0;align-items:start;padding:28px 30px 4px;}
  .cc-head{grid-area:head;} .cc-body{grid-area:body;}
  .gfx{grid-area:gfx;width:190px;height:190px;border-radius:14px;overflow:hidden;flex:none;position:relative;background:linear-gradient(150deg,#2E7C7C,#245f5f);}
  .gfx img{width:100%;height:100%;object-fit:cover;display:block;}
  .gfx img.byid{position:absolute;inset:0;z-index:1;}
  .gfx .ring{position:absolute;border:2px solid rgba(255,255,255,.24);border-radius:50%;}
  .gfx .r1{width:150px;height:150px;right:-34px;bottom:-34px;} .gfx .r2{width:96px;height:96px;right:26px;bottom:26px;border-color:rgba(255,255,255,.16);}
  .ctitle{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.62rem;line-height:1.12;color:var(--ink);margin:0 0 12px;}
  .tags{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:13px;}
  .tag{font-size:.69rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;padding:4px 11px;border-radius:999px;}
  .tag.purple{background:#ECE4F7;color:#6A38B0;} .tag.green{background:#D6EFCB;color:#3B8B2E;} .tag.blue{background:#E4EDF7;color:#35679E;}
  .tag.amber{background:#F6E6C2;color:#A5741A;} .tag.rose{background:#F7E4EA;color:#B0466A;} .tag.sand{background:#EAE7E0;color:#7A746A;}
  .tag.teal{background:#D5EFEC;color:#227A72;}
  .desc{font-size:1rem;line-height:1.6;color:var(--ink);margin:0 0 14px;}
  .desc.clamp{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:4px;}
  .desc-more{display:none;background:none;border:none;padding:0;margin:0 0 14px;cursor:pointer;font-size:.82rem;font-weight:700;color:var(--dteal);}
  .desc-more.show{display:inline-block;}
  .wte{margin-bottom:2px;}
  .wte-t{background:none;border:none;padding:0;cursor:pointer;font-size:.8rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--dteal);display:inline-flex;align-items:center;gap:8px;}
  .wte-t .chev{font-size:1.05rem;font-weight:900;line-height:1;transition:transform .2s;}
  .wte.collapsed .wte-t .chev{transform:rotate(-90deg);}
  .wte ul{margin:10px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px;}
  .wte.collapsed ul{display:none;}
  .wte li{font-size:.95rem;color:var(--ink);padding-left:20px;position:relative;line-height:1.45;}
  .wte li:before{content:'';position:absolute;left:2px;top:8px;width:7px;height:7px;border-radius:50%;background:var(--coral);}
  .picker{padding:20px 30px 6px;border-top:1px solid #efe9df;margin-top:18px;}
  .picker.inline{display:flex;align-items:center;justify-content:flex-start;gap:14px;flex-wrap:wrap;}
  .picker.inline.center{justify-content:center;}
  /* 'Choose a class' — solid pill, same height as the option buttons */
  .pk-chip{display:inline-flex;align-items:center;min-height:44px;font-size:.78rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:0 20px;border-radius:999px;margin:0 0 13px;color:#fff;background:var(--dteal);border:1.5px solid transparent;}
  .cc.talk .pk-chip{color:#fff;background:var(--blue);} .cc.course .pk-chip{color:#fff;background:var(--coral2);}
  .picker.inline .pk-chip{margin:0;}
  .tabs{display:flex;gap:10px;flex-wrap:wrap;}
  .picker.inline .tabs{flex:0 1 auto;} .picker.inline.center .tabs{justify-content:center;}
  .tab-btn{flex:0 0 auto;min-height:44px;border:1.5px solid #e2ddd2;background:#fff;color:var(--ink);font-size:.9rem;font-weight:600;padding:0 16px;border-radius:999px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap;}
  .tab-btn .pin{width:9px;height:9px;border-radius:50%;background:#4E938C;} .tab-btn.ciren .pin{background:#7AA84A;}
  .tab-btn.on{font-weight:800;}
  .cc.talk .tab-btn.on{background:#E3F1FB;border-color:#9AD0EF;color:#1276B4;}
  .cc.course .tab-btn.on{background:#FBECE3;border-color:#F2C4AA;color:#C55A24;}
  .detail{margin:16px 30px 8px;border:1px solid #eee7dd;border-radius:14px;overflow:hidden;}
  .single .detail{margin-top:6px;}
  .pane{display:none;grid-template-columns:1fr auto;} .pane.on{display:grid;}
  .d-main{padding:18px 22px;}
  .d-loc{font-size:.9rem;font-weight:700;display:inline-flex;align-items:center;gap:4px;margin-bottom:6px;color:#3f7e78;} .d-loc.ciren{color:#5B8C1A;} .d-loc svg{width:12px;height:12px;}
  .d-loc .dir{color:#8a857c;font-weight:500;text-decoration:underline;margin-left:6px;font-size:.82rem;}
  .d-tt{font-weight:700;font-size:1.1rem;} .d-tt .dur{font-weight:500;color:#8a857c;font-size:.92rem;}
  .d-meta{font-size:.95rem;color:var(--ink);margin-top:4px;} .d-meta a{color:var(--lteal);font-weight:700;text-decoration:underline;}
  .d-dates{font-size:.95rem;color:var(--ink);margin-top:4px;}   /* same weight & colour as the 'with' line */
  .d-dates .d-lbl{font-weight:700;}
  .d-price{padding:18px 22px;display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:9px;min-width:170px;background:#fbfaf7;}
  .d-price .pp{font-weight:700;font-size:1.02rem;}
  .d-offer{background:#EAF6EC;color:#2C6E1E;border:1px solid #CDE7CF;border-radius:8px;padding:5px 11px;font-size:.78rem;font-weight:700;line-height:1.3;text-align:center;}
  .book{color:#fff;font-weight:700;font-size:.86rem;text-decoration:none;padding:9px 20px;border-radius:999px;white-space:nowrap;background:var(--coral);}
  .cc.talk .book{background:var(--blue);} .cc.course .book{background:var(--coral2);}
  .tbc{margin:14px 30px 4px;padding:14px 18px;background:#FBF6ED;border:1px solid #EFE7D6;border-radius:12px;font-size:.92rem;color:#6f6a62;}
  /* mobile summary bar (hidden on desktop) */
  .cc-sum{display:none;}
  .foot{padding:8px 30px 26px;}
  .disc{background:#FBF6ED;border:1px solid #EFE7D6;border-radius:12px;padding:14px 18px;font-size:.92rem;color:var(--ink);line-height:1.5;margin-bottom:14px;} .disc b{color:var(--ink);} .disc .sep{color:#cdbf9e;padding:0 8px;}
  /* social share row */
  .cc-share{display:flex;align-items:center;gap:9px;justify-content:flex-end;}
  .cc-share .sh-lbl{font-size:.7rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#8a857c;margin-right:2px;}
  .sh-btn{width:34px;height:34px;border-radius:50%;border:1px solid #e6e0d5;background:#fff;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#6f6a62;padding:0;text-decoration:none;transition:background .15s,color .15s,border-color .15s;}
  .sh-btn:hover{background:#f6f2e9;color:#2A66A6;border-color:#d8d1c2;}
  .sh-btn svg{width:16px;height:16px;}
  .sh-btn.copied{color:#2C8A34;border-color:#BFE3C2;background:#EAF6EC;}
  @media(max-width:640px){
    .cc-top{grid-template-columns:110px 1fr;grid-template-areas:"gfx head" "body body";column-gap:14px;row-gap:12px;padding:22px 20px 4px;} .gfx{width:110px;height:110px;} .ctitle{font-size:1.34rem;margin-bottom:9px;} .cc-head .tags{margin-bottom:0;}
    .picker{padding:16px 20px 4px;}
    .picker.inline{display:block;text-align:left;} .picker.inline .pk-chip{margin-bottom:13px;} .picker.inline .tabs{justify-content:flex-start;}
    .detail{margin:14px 20px 4px;} .pane.on{grid-template-columns:1fr;}
    .d-price{flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between;width:100%;gap:10px;}
    .d-price .pp{order:1;} .d-price .book{order:2;} .d-price .d-offer{order:3;flex-basis:100%;text-align:left;}
    .tbc,.foot{margin-left:20px;margin-right:20px;padding-left:18px;padding-right:18px;} .foot{padding:8px 20px 22px;}
    .cc-share{justify-content:flex-start;}
    /* --- title / intro breathing room --- */
    #akx-programme .pg-h{font-size:1.5rem;margin-bottom:14px;}
    #akx-programme .pg-lead{padding:0 8px;margin-bottom:22px;font-size:.95rem;}
    /* --- collapse cards: summary bar + expandable body --- */
    .cc .cc-sum{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:2px 20px 20px;padding:13px 16px;border:1px solid #eee7dd;border-radius:12px;background:#fbfaf7;cursor:pointer;font-family:inherit;text-align:left;-webkit-appearance:none;}
    .cc-sum-d{display:flex;flex-direction:column;gap:3px;font-weight:700;font-size:.92rem;}
    .cc.talk .cc-sum-d{color:#1276B4;} .cc.course .cc-sum-d{color:#C55A24;}
    .cc-sum-cta{display:inline-flex;align-items:center;gap:7px;font-size:.8rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--dteal);white-space:nowrap;}
    .cc-sum-cta .chev{font-size:1rem;font-weight:900;transition:transform .2s;}
    .cc.talk .cc-sum-cta{color:#1276B4;} .cc.course .cc-sum-cta{color:#C55A24;}
    .cc.mcol .cc-exp{display:none;}
    .cc.mcol .wte{display:none;}
    .cc:not(.mcol) .cc-sum-d{display:none;}
    .cc:not(.mcol) .cc-sum-cta .chev{transform:rotate(180deg);}
  }`;
  var PIN='<path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>';
  // ---- social share icons ----
  var SH_FB='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.8 3.8-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.43 2.9h-2.27v7A10 10 0 0 0 22 12z"/></svg>';
  var SH_X='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L1.5 2h6.8l4.7 6.2L18.9 2zm-1.15 18h1.83L7.33 3.9H5.36L17.75 20z"/></svg>';
  var SH_WA='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.28-.14-1.65-.81-1.9-.9-.26-.1-.44-.14-.63.14-.18.28-.72.9-.88 1.08-.16.18-.32.2-.6.07-1.63-.82-2.7-1.46-3.78-3.3-.28-.49.28-.45.8-1.5.09-.18.05-.34-.02-.48-.07-.14-.63-1.5-.86-2.06-.22-.54-.45-.47-.62-.48h-.53c-.18 0-.48.07-.73.34-.25.28-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.85.14.18 1.94 2.96 4.7 4.15 2.28.98 2.74.79 3.24.74.5-.05 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.53-.32zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.4A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.17l-.3-.18-2.9.76.77-2.83-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>';
  var SH_LINK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>';
  var SH_CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
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
  function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function splitList(s){return (s||'').split(/[;,]|\r?\n/).map(function(x){return x.trim();}).filter(Boolean);}
  function tagClass(t){t=t.toLowerCase();
    if(/mini|series/.test(t))return'purple'; if(/beginn|start|open|free|welcome/.test(t))return'green';
    if(/talk/.test(t))return'blue'; if(/depth|study/.test(t))return'amber'; if(/enrol/.test(t))return'rose'; return'sand';}
  var TAG_CYCLE=['blue','purple','green','amber','teal'];   // three tags, each a different colour (talks + courses)
  var DAYS={mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday'};
  function fullDay(d){var k=(d||'').slice(0,3).toLowerCase();return DAYS[k]||d;}
  function shortDay(d){var s=(d||'').slice(0,3);return s?s.charAt(0).toUpperCase()+s.slice(1).toLowerCase():d;}
  function isCiren(loc){return /ciren/i.test(loc||'');}
  // ---- scheduling: show_from (planning) + auto-expire after the last class date ----
  function parseFullDate(s){ if(!s) return null;
    var iso=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if(iso) return new Date(+iso[1],+iso[2]-1,+iso[3]);
    var uk=s.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4})/); if(uk){var y=+uk[3]; if(y<100)y+=2000; return new Date(y,+uk[2]-1,+uk[1]);}
    var t=Date.parse(s); return isNaN(t)?null:new Date(t); }
  function parseDDMM(s,year){ var m=(s||'').match(/(\d{1,2})\s*[\/.\-]\s*(\d{1,2})/); return m?new Date(year,(+m[2])-1,+m[1]):null; }
  function formatDate(raw){
    var m=(raw||'').match(/(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-](\d{2,4}))?/); if(!m) return raw;
    var dd=('0'+(+m[1])).slice(-2), mm=('0'+(+m[2])).slice(-2), yy;
    if(m[3]){ yy=+m[3]; if(yy<100) yy+=2000; }
    else { var t0=new Date(); t0.setHours(0,0,0,0); yy=t0.getFullYear(); var test=new Date(yy,+m[2]-1,+m[1]); test.setHours(0,0,0,0); if(test<t0) yy+=1; }
    return dd+'/'+mm+'/'+yy;
  }
  function shortDMY(raw){ var f=formatDate(raw); var m=f.match(/(\d{2})\/(\d{2})/); return m?m[1]+'/'+m[2]:f; }  // dd/mm
  function ddmm(d){ return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2); }
  function allClassDates(classes, showFrom){
    var raw=[]; classes.forEach(function(cl){ splitList(cl.dates).forEach(function(d){raw.push(d);}); });
    if(!raw.length) return [];
    var now=new Date(), anchor = showFrom ? showFrom.getFullYear() : now.getFullYear();
    var dates=raw.map(function(d){ var dt=parseDDMM(d,anchor);
      if(dt && showFrom && dt.getMonth() < showFrom.getMonth()) dt.setFullYear(anchor+1);
      if(dt) dt.setHours(0,0,0,0); return dt; }).filter(Boolean).sort(function(a,b){return a-b;});
    return dates;
  }
  function lastClassDate(classes, showFrom){
    var dates=allClassDates(classes, showFrom);
    if(!dates.length) return null;
    var now=new Date(), max=dates[dates.length-1];
    if(!showFrom && (now-max)/86400000 > 120){ max=new Date(max); max.setFullYear(max.getFullYear()+1); }
    return max;
  }
  function isVisible(it, classes, today){
    if(!it.title) return false;
    if(it.status && !/live/i.test(it.status)) return false;        // draft/hidden
    var sf=parseFullDate(it.show_from); if(sf){ sf.setHours(0,0,0,0); if(today<sf) return false; }  // not yet
    var last=lastClassDate(classes, sf); if(last){ last.setHours(0,0,0,0); if(today>last) return false; } // finished
    return true;
  }
  // ---- self-updating banner timing text ----
  var WD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function timingLabel(isTalk, classes, showFrom){
    var dates=allClassDates(classes, showFrom);
    if(!dates.length) return '';
    var now=new Date(); now.setHours(0,0,0,0);
    var first=dates[0], last=dates[dates.length-1];
    var upcoming=dates.filter(function(d){return d>=now;});
    var next=upcoming.length?upcoming[0]:first;
    var days=Math.round((next-now)/86400000);
    if(isTalk){
      if(days<=0) return 'Today';
      if(days===1) return 'Tomorrow';
      if(days<=7) return 'Only '+days+' days to go';
      if(days<=14) return 'In '+days+' days';
      return 'Upcoming';
    }
    // course / mini-series
    if(now<first){
      if(days===0) return 'Starts today';
      if(days===1) return 'Starts tomorrow';
      if(days<=7) return 'Starts '+WD[next.getDay()];
      if(days<=14) return 'Starts in '+days+' days';
      return 'Booking open';
    }
    var toEnd=Math.round((last-now)/86400000);
    if(toEnd<=7) return 'Final week';
    return 'Drop in to join';
  }
  // summary shown in the collapsed mobile bar (HTML) — talks list each date stacked; courses a 'from' date
  function summaryDates(isTalk, classes, showFrom){
    if(isTalk){
      var lines = classes.map(function(cl){
        var d0=splitList(cl.dates)[0];
        var lbl = (shortDay(cl.day)+(d0?' '+shortDMY(d0):'')).trim();
        return lbl ? '<span class="cc-sum-line">'+esc(lbl)+'</span>' : '';
      }).filter(Boolean);
      return lines.join('');
    }
    var dates=allClassDates(classes, showFrom);
    if(!dates.length) return '';
    return '<span class="cc-sum-line">from '+ddmm(dates[0])+'</span>';
  }
  function pill(cl,i,on,isTalk){
    var lab;
    if(cl.audience) lab = cl.audience;
    else if(isCiren(cl.location) && !isTalk) lab = cl.location;
    else if(isTalk){                                   // talks: Day | Date | Time
      var d0 = splitList(cl.dates)[0];
      lab = shortDay(cl.day) + (d0 ? ' | '+shortDMY(d0) : '') + (cl.time ? ' | '+cl.time : '');
    } else lab = cl.day+' '+cl.time;
    return '<button class="tab-btn'+(isCiren(cl.location)?' ciren':'')+(on?' on':'')+'" data-i="'+i+'"><span class="pin"></span>'+esc(lab)+'</button>';
  }
  function pane(cl,i,on){
    var c=isCiren(cl.location), dates=splitList(cl.dates), n=dates.length;
    var datesHtml = n>1 ? esc(n+' classes · '+dates.join(', ')) : (n===1 ? '<span class="d-lbl">Date:</span> '+esc(formatDate(dates[0])) : '');
    var pp = cl.price_class ? '<span class="pp">'+esc(cl.price_class)+' / class</span>' : '';
    var offer = (cl.price_series && n>1) ? '<span class="d-offer">Save 20% — '+n+' classes for '+esc(cl.price_series)+'</span>' : '';
    var book = cl.booking_url ? '<a class="book" href="'+esc(cl.booking_url)+'" target="_blank" rel="noopener">Book →</a>' : '';
    return '<div class="pane'+(c?' ciren':'')+(on?' on':'')+'" data-i="'+i+'">'
      +'<div class="d-main">'
        +'<div class="d-loc'+(c?' ciren':'')+'"><svg viewBox="0 0 24 24" fill="'+(c?'#7AA84A':'#4E938C')+'">'+PIN+'</svg>'+esc(cl.location||'')+'<a class="dir" href="'+DIRECTIONS_URL+'">Get directions</a></div>'
        +'<div class="d-tt">'+esc(fullDay(cl.day))+' '+esc(cl.time)+(cl.duration?' <span class="dur">| '+esc(cl.duration)+'</span>':'')+'</div>'
        +(cl.teacher?'<div class="d-meta">with <a href="/about-us#teachers">'+esc(cl.teacher)+'</a></div>':'')
        +(datesHtml?'<div class="d-dates">'+datesHtml+'</div>':'')
      +'</div>'
      +(pp||offer||book?'<div class="d-price">'+pp+offer+book+'</div>':'')
    +'</div>';
  }
  function discFmt(s){ return esc(s).replace(/\s*\|\s*/g,'<span class="sep">|</span>'); }
  function shareRow(item){
    var url=encodeURIComponent(location.href);
    var text=encodeURIComponent(item.title+' — Akanishta Kadampa Meditation Centre');
    return '<div class="cc-share"><span class="sh-lbl">Share</span>'
      +'<a class="sh-btn" title="Share on Facebook" aria-label="Share on Facebook" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u='+url+'">'+SH_FB+'</a>'
      +'<a class="sh-btn" title="Share on X" aria-label="Share on X" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url='+url+'&text='+text+'">'+SH_X+'</a>'
      +'<a class="sh-btn" title="Share on WhatsApp" aria-label="Share on WhatsApp" target="_blank" rel="noopener" href="https://wa.me/?text='+text+'%20'+url+'">'+SH_WA+'</a>'
      +'<button type="button" class="sh-btn sh-copy" title="Copy link" aria-label="Copy link">'+SH_LINK+'</button>'
    +'</div>';
  }
  function card(item, classes){
    var isTalk = /talk/i.test(item.type);
    var showFrom = parseFullDate(item.show_from);
    var rings = '<span class="ring r1"></span><span class="ring r2"></span>';
    var gfx;
    if(item.graphic){                         // explicit URL in the sheet wins
      gfx = '<div class="gfx">'+rings+'<img class="byid" src="'+esc(item.graphic)+'" alt="" onerror="this.remove()"></div>';
    } else if(item.id){                        // else try images/<id>.jpg, then .png, then the auto panel (crossorigin lets us read a title colour from it)
      gfx = '<div class="gfx">'+rings+'<img class="byid" crossorigin="anonymous" src="'+IMG_BASE+encodeURIComponent(item.id)+'.jpg" alt="" onerror="if(this.dataset.tried){this.remove()}else{this.dataset.tried=1;this.src=this.src.replace(/\\.jpg$/,\'.png\')}"></div>';
    } else {
      gfx = '<div class="gfx">'+rings+'</div>';
    }
    var tags = splitList(item.tags).map(function(t,i){
      var cls = TAG_CYCLE[i % TAG_CYCLE.length];
      return '<span class="tag '+cls+'">'+esc(t)+'</span>';
    }).join('');
    var wte = splitList(item.what_to_expect);
    var wteHtml = wte.length ? '<div class="wte collapsed"><button class="wte-t">What to expect <span class="chev">▾</span></button><ul>'
        + wte.map(function(x){return '<li>'+esc(x)+'</li>';}).join('') + '</ul></div>' : '';
    var tlabel = timingLabel(isTalk, classes, showFrom);
    var typeLabel = isTalk ? (classes.length>1 ? 'Public Talks' : 'Public Talk') : 'Short Course';
    var banner = '<div class="cc-banner">'
        + (tlabel ? '<span class="cc-when"><span class="cc-dot"></span>'+esc(tlabel)+'</span>' : '')
        + '<span class="cc-type">'+typeLabel+'</span>'
      +'</div>';
    var head = '<div class="cc-top">'+gfx
        +'<div class="cc-head">'
          +'<h2 class="ctitle">'+esc(item.title)+'</h2>'
          +(tags?'<div class="tags">'+tags+'</div>':'')
        +'</div>'
        +'<div class="cc-body">'
          +(item.description?'<p class="desc clamp">'+esc(item.description)+'</p><button type="button" class="desc-more">More</button>':'')
          + wteHtml
        +'</div>'
      +'</div>';
    var body='';
    if(classes.length===0){
      body='<div class="tbc">Date &amp; venue to be confirmed — see the calendar below for the latest.</div>';
    } else if(isTalk && classes.length===1){
      body='<div class="single"><div class="detail">'+pane(classes[0],0,true)+'</div></div>';
    } else {
      var pkClass = 'picker inline';
      body='<div class="'+pkClass+'"><span class="pk-chip">Choose a class</span><div class="tabs">'
          + classes.map(function(cl,i){return pill(cl,i,i===0,isTalk);}).join('') + '</div></div>'
          + '<div class="detail">'+classes.map(function(cl,i){return pane(cl,i,i===0);}).join('')+'</div>';
    }
    var discHtml = item.discount_note ? '<div class="disc">'+discFmt(item.discount_note)+'</div>' : '';
    var foot = '<div class="foot">'+discHtml+shareRow(item)+'</div>';
    // mobile collapse: summary bar (date + toggle) + expandable region
    var sumD = summaryDates(isTalk, classes, showFrom);
    var sum = '<button type="button" class="cc-sum">'
        + '<span class="cc-sum-d">'+sumD+'</span>'
        + '<span class="cc-sum-cta">Show more details <span class="chev">▾</span></span>'
      +'</button>';
    var exp = '<div class="cc-exp">'+body+foot+'</div>';
    return '<div class="cc '+(isTalk?'talk':'course')+' mcol">'+banner+head+sum+exp+'</div>';
  }
  // ---- pull a readable title colour from the card graphic (fallback: charcoal, left as-is) ----
  function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),h,s,l=(mx+mn)/2;
    if(mx===mn){h=s=0;}else{var d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);
      switch(mx){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4;}h/=6;}return[h*360,s,l];}
  function hsl2rgb(h,s,l){h/=360;function f(p,q,t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;}
    var r,g,b;if(s===0){r=g=b=l;}else{var q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;r=f(p,q,h+1/3);g=f(p,q,h);b=f(p,q,h-1/3);}
    return[Math.round(r*255),Math.round(g*255),Math.round(b*255)];}
  function titleColorFromImg(img){
    try{
      if(!img.naturalWidth) return null;
      var W=48,H=Math.max(1,Math.round(48*img.naturalHeight/img.naturalWidth));
      var c=document.createElement('canvas');c.width=W;c.height=H;
      var ctx=c.getContext('2d');ctx.drawImage(img,0,0,W,H);
      var d=ctx.getImageData(0,0,W,H).data; // throws (SecurityError) if the image is cross-origin without CORS
      var buckets={},vb=null,vs=-1;
      for(var i=0;i<d.length;i+=4){var a=d[i+3];if(a<128)continue;var hsl=rgb2hsl(d[i],d[i+1],d[i+2]);
        if(hsl[2]>0.95||hsl[2]<0.06)continue;
        var score=hsl[1]*(1-Math.abs(hsl[2]-0.5));
        var k=Math.round(hsl[0]/20)+'_'+Math.round(hsl[1]*4)+'_'+Math.round(hsl[2]*4);
        var bk=buckets[k]||(buckets[k]={r:0,g:0,b:0,c:0,s:0});bk.r+=d[i];bk.g+=d[i+1];bk.b+=d[i+2];bk.c++;bk.s+=score;}
      for(var kk in buckets){if(buckets[kk].s>vs){vs=buckets[kk].s;vb=buckets[kk];}}
      if(!vb) return null;
      var rgb=[Math.round(vb.r/vb.c),Math.round(vb.g/vb.c),Math.round(vb.b/vb.c)];
      var hh=rgb2hsl(rgb[0],rgb[1],rgb[2]);
      var out=hsl2rgb(hh[0],Math.max(hh[1],0.35),Math.min(hh[2],0.40)); // darken for legibility on white
      return '#'+out.map(function(x){return ('0'+x.toString(16)).slice(-2);}).join('');
    }catch(e){ return null; }
  }
  function colourTitles(root){
    root.querySelectorAll('.cc').forEach(function(cc){
      var img=cc.querySelector('.gfx img.byid'), title=cc.querySelector('.ctitle');
      if(!img||!title) return;
      var apply=function(){ var col=titleColorFromImg(img); if(col) title.style.color=col; };
      if(img.complete && img.naturalWidth) apply();
      img.addEventListener('load',apply);   // also fires after a .jpg→.png swap
    });
  }
  function checkClamp(root){
    root.querySelectorAll('.desc.clamp').forEach(function(d){
      if(d.scrollHeight-d.clientHeight>2){ var b=d.nextElementSibling; if(b&&b.classList.contains('desc-more')) b.classList.add('show'); }
      else { d.classList.remove('clamp'); }
    });
  }
  function wire(root){
    root.querySelectorAll('.desc-more').forEach(function(b){b.addEventListener('click',function(){
      var d=b.previousElementSibling; var on=d.classList.toggle('clamp'); b.textContent=on?'More':'Less';
    });});
    checkClamp(root);
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){checkClamp(root);});}
    root.querySelectorAll('.wte-t').forEach(function(b){b.addEventListener('click',function(){b.parentNode.classList.toggle('collapsed');});});
    // mobile summary toggle
    root.querySelectorAll('.cc-sum').forEach(function(b){b.addEventListener('click',function(){
      b.closest('.cc').classList.toggle('mcol');
    });});
    // copy-link share button
    root.querySelectorAll('.sh-copy').forEach(function(b){b.addEventListener('click',function(){
      var done=function(){ b.classList.add('copied'); b.innerHTML=SH_CHECK; b.title='Link copied';
        setTimeout(function(){ b.classList.remove('copied'); b.innerHTML=SH_LINK; b.title='Copy link'; },1800); };
      var url=location.href;
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(done,done); }
      else { try{ var ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);done(); }catch(e){} }
    });});
    root.querySelectorAll('.cc').forEach(function(cc){
      cc.querySelectorAll('.tab-btn').forEach(function(btn){btn.addEventListener('click',function(){
        var i=btn.getAttribute('data-i');
        cc.querySelectorAll('.tab-btn').forEach(function(x){x.classList.toggle('on',x===btn);});
        cc.querySelectorAll('.pane').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-i')===i);});
      });});
    });
    colourTitles(root);
  }
  function csvUrl(sheet){return 'https://docs.google.com/spreadsheets/d/'+SHEET_ID+'/gviz/tq?tqx=out:csv&headers=1&sheet='+encodeURIComponent(sheet);}
  function render(mount, items, classes){
    var byId={}; classes.forEach(function(cl){ if(cl.id){ (byId[cl.id]=byId[cl.id]||[]).push(cl); } });
    var today=new Date(); today.setHours(0,0,0,0);
    var live = items.filter(function(it){ return isVisible(it, byId[it.id]||[], today); });
    var html='<h2 class="pg-h">Weekly Classes Programme</h2>'
           +'<div class="pg-lead"><p>Below you\'ll find full details of the programme of weekly classes — including one-off public talks and short courses which run over a number of weeks. All these classes are drop-in and PAYG. If you choose to book online you\'ll have access to discounts such as bring a friend for half price, early bird pricing and 20% discount for booking a series, where these are available.</p></div>';
    if(!live.length){ html+='<div class="pg-msg">Nothing scheduled just now — please check back soon.</div>'; }
    else { html += live.map(function(it){return card(it, byId[it.id]||[]);}).join(''); }
    mount.innerHTML=html;
    wire(mount);
  }
  function init(){
    var mount=document.getElementById(MOUNT_ID); if(!mount) return;
    if(mount.getAttribute('data-akx-done')==='1') return;
    mount.setAttribute('data-akx-done','1');
    if(!document.getElementById('akx-programme-style')){var st=document.createElement('style');st.id='akx-programme-style';st.textContent=STYLE;document.head.appendChild(st);}
    mount.innerHTML='<div class="pg-msg">Loading…</div>';
    Promise.all([
      fetch(csvUrl(TAB_ITEMS)).then(function(r){return r.text();}),
      fetch(csvUrl(TAB_CLASSES)).then(function(r){return r.text();})
    ]).then(function(res){
      var items=toObjs(parseCSV(res[0])), classes=toObjs(parseCSV(res[1]));
      render(mount, items, classes);
    }).catch(function(e){ mount.innerHTML='<div class="pg-msg">Sorry — the programme couldn’t load just now.</div>'; console.warn('programme load failed',e); });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
