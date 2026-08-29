/* Akanishta &mdash; TALKS & SHORT COURSES widget  [23 Aug 2026: swirl motif option E — opacity .28, 187.5% scale] [23 Aug: "Book your Spot" button; drop-in price moved to the left column; "Online discounts available"]
   [24 Aug: "Get directions" now a dynamic map link per venue — replaces the /visit-us link, which was a 404]
   [24 Aug: classes tab renamed "Class details" — reads new name, falls back to "Class times"] (the programme of talks / courses / free / in-depth / special).
   (Was wc-programme.js &mdash; renamed to wc-talks-courses.js so "programme" can't be confused with the page/section.)
   Reads a public Google Sheet (tabs "Talks & series" + "Class times") and renders flyer cards.
   The event TYPE (col C) sets colour + motif via the shared taxonomy in event-graphics.js.
   The graphic square is a mini-poster (Fable recipe): type label (Inter) + title (Fraunces) + date line (mono),
   over the type colour; a real photo (sheet "graphic" col or images/<id>.jpg) covers it, poster text sits on top.
   Banner names the length for courses; discounts show as one quiet line; teacher name links in ink (not teal).
   Include with:  <div id="akx-programme"></div>
                  <script src="https://kadampacheltenham.github.io/akx-widgets/event-graphics.js" defer></script>
                  <script src="https://kadampacheltenham.github.io/akx-widgets/wc-talks-courses.js" defer></script>
   (event-graphics.js must load first so window.AKX_GFX exists; a local fallback keeps
    the colours right even if it doesn't. Mount id stays #akx-programme — internal only.)

   [29 Aug 2026 — v1.1] Optional mount attributes, so branch pages reuse this widget rather
   than a second one being built. With none set, /weekly-classes behaves exactly as before:
     data-location   keep only class rows for that Location ID (e.g. "cirencester")
     data-limit      max cards, and no "Show more" — branch pages use 2
     data-labels     "branch" → Current classes | Next (6 days or less) | Upcoming
     data-heading    replace the H2 (data-heading="" removes it)
     data-lead       replace the intro paragraph (data-lead="" removes it)
     data-quotes     "0" = don't inject the rotating testimonial between cards
   With data-limit set, cards are ordered by start date — so the current/next course is
   first and the one after it second.
*/
(function(){
  var SHEET_ID = '1YArubV8QgCvPUIIvHOHWhCN2fYLRz0DDPSRSHD_tSmY';
  var MOUNT_ID = 'akx-programme';
  /* ---- mount options (all optional; with none set this widget behaves exactly as before) ----
     data-location="cirencester"  keep only class rows for that Location ID, and drop any
                                  talk/course left with no class rows in that town
     data-limit="2"               show at most N cards, no "Show more"
     data-labels="branch"         Current classes | Next | Upcoming  (see bannerLabel)
     data-heading="..."           replace the H2   (data-heading="" removes it)
     data-lead="..."              replace the intro paragraph  (data-lead="" removes it)
     data-quotes="0"              don't inject the rotating testimonial between cards
     Branch pages set location + limit + labels; /weekly-classes sets none of them.       */
  var OPT = { location:'', limit:0, labels:'', heading:null, lead:null, quotes:true };
  var TAB_ITEMS = 'Talks & series';
  var TAB_CLASSES = 'Class details';        // renamed 24 Aug 2026; old name kept as fallback
  var TAB_CLASSES_OLD = 'Class times';      // gviz silently serves the FIRST tab for a bad name, so we validate the header
  /* Directions: Apple devices (iPhone, iPad, Mac) -> Apple Maps, everything else -> Google Maps.
     Venue addresses live here for now; when the Weekly Classes sheet gains a Venues tab this
     becomes a lookup by the venue name already in the "location" column. */
  var VENUE_Q={
    cheltenham:'59 Whaddon Road, Cheltenham GL52 5NE',
    cirencester:'28 King Street, Cirencester, Gloucestershire GL7 1JT'
  };
  var _ua=(typeof navigator!=='undefined'&&navigator.userAgent)||'';
  var IS_APPLE=/iphone|ipad|ipod|macintosh|mac os x/i.test(_ua);
  function mapsURL(q){ return IS_APPLE
    ? 'https://maps.apple.com/?q='+encodeURIComponent(q)
    : 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q); }
  function directionsURL(loc){
    var q=VENUE_Q[String(loc||'').trim().toLowerCase()];
    return q ? mapsURL(q) : '';   // unknown venue (e.g. Tewkesbury until its address is added): no link, never the wrong town
  }
  var IMG_BASE = 'https://kadampacheltenham.github.io/akx-widgets/images/'; // auto image by id: images/<id>.jpg
  var STYLE = String.raw`
  #akx-programme{--ink:#2B2A28;--dteal:#2E7C7C;--lteal:#0c9d94;--coral:#E2886A;--blue:#22B8F0;--bluedk:#0E90CC;--coral2:#FF7A4D;--coraldk:#E85C2E;font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);max-width:1000px;margin:0 auto;}   /* lotus/content width &mdash; matches glance + calendars */
  #akx-programme *{box-sizing:border-box;}
  #akx-programme .pg-h{text-align:center;font-family:'Fraunces',Georgia,serif;font-size:1.9rem;font-weight:600;color:#2A66A6;margin:0 0 6px;}   /* Fraunces serif blue &mdash; site sub-heading standard */
  #akx-programme .pg-lead{max-width:none;margin:0 auto 20px;padding:0 30px;text-align:left;color:#6f6a62;font-size:.98rem;line-height:1.55;}
  #akx-programme .pg-lead p{margin:0 0 10px;} #akx-programme .pg-lead p:last-child{margin:0;}
  #akx-programme .pg-msg{text-align:center;color:#8a857c;padding:24px;}
  #akx-programme .pg-more{display:block;} #akx-programme .pg-item{display:none;} #akx-programme .pg-item.on{display:block;}
  #akx-programme .pg-showall{display:block;margin:2px auto 6px;background:none;border:none;cursor:pointer;font-size:.92rem;font-weight:700;letter-spacing:.02em;color:#8a857c;padding:10px 16px;}
  #akx-programme .pg-showall:hover{color:#2A66A6;}
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Oswald:wght@500;600;700&display=swap');
  .cc{background:#fff;border:1px solid #ece7dd;border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,.07);overflow:hidden;margin-bottom:22px;}
  #akx-programme .cc:last-child{margin-bottom:0;}
  /* two-tone banner: darker timing segment (left) then the type */
  .cc-banner{display:flex;align-items:stretch;color:#fff;font-weight:800;font-size:.82rem;letter-spacing:.05em;text-transform:uppercase;}
  .cc .cc-banner{background:var(--type);}
  .cc-when{display:flex;align-items:center;gap:7px;padding:11px 20px;}
  .cc .cc-when{background:var(--typedk);}
  .cc-dot{width:7px;height:7px;border-radius:50%;background:#fff;opacity:.92;flex:none;}
  .cc-type{display:flex;align-items:center;padding:11px 20px;}
  .cc-top{display:grid;grid-template-columns:190px 1fr;grid-template-areas:"gfx head" "gfx body";column-gap:24px;row-gap:0;align-items:start;padding:28px 30px 4px;}
  .cc-head{grid-area:head;} .cc-body{grid-area:body;}
  .gfx{grid-area:gfx;width:190px;height:190px;border-radius:14px;overflow:hidden;flex:none;position:relative;background:var(--type);}
  .gfx img{width:100%;height:100%;object-fit:cover;display:block;}
  .gfx img.byid{position:absolute;inset:0;z-index:1;}
  .gfx .motif{position:absolute;top:50%;left:50%;width:187.5%;height:187.5%;transform:translate(-50%,-50%);opacity:.28;color:#fff;pointer-events:none;}
  /* mini-poster text (Fable recipe): type label + title + date, over the type colour or a photo */
  .gfx .gtxt{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;padding:16px;color:#fff;background:linear-gradient(to top,rgba(0,0,0,.30),rgba(0,0,0,0) 46%);pointer-events:none;}
  .gfx .glabel{font-family:'Inter',system-ui,sans-serif;font-weight:700;font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;opacity:.92;}
  .gfx .gtitle{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.14rem;line-height:1.1;margin-top:auto;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
  .gfx .gdate{font-family:'SFMono-Regular',Consolas,'Roboto Mono',Menlo,monospace;font-weight:500;font-size:.58rem;letter-spacing:.02em;opacity:.85;margin-top:7px;}
  @media(min-width:641px){ #akx-programme .cc-head .ctitle{display:none;} }  /* desktop: the poster carries the title */
  .ctitle{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.62rem;line-height:1.12;color:var(--ink);margin:0 0 12px;}
  .tags{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:13px;}
  .tag{font-size:.69rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;padding:4px 11px;border-radius:999px;}
  .tag.purple{background:#ECE4F7;color:#6A38B0;} .tag.green{background:#D6EFCB;color:#3B8B2E;} .tag.blue{background:#E4EDF7;color:#35679E;}
  .tag.amber{background:#F6E6C2;color:#A5741A;} .tag.rose{background:#F7E4EA;color:#B0466A;} .tag.sand{background:#EAE7E0;color:#7A746A;}
  .tag.teal{background:#D5EFEC;color:#227A72;}
  .desc{font-size:1rem;line-height:1.6;color:var(--ink);margin:0 0 14px;}
  .wte{margin-bottom:2px;}
  .wte-t{background:none;border:none;padding:0;cursor:pointer;font-size:1rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--dteal);display:inline-flex;align-items:center;gap:8px;}
  .cc .wte-t{color:var(--typedk);}
  .wte-t .chev{font-size:1.3rem;font-weight:900;line-height:1;transition:transform .2s;}
  .wte.collapsed .wte-t .chev{transform:rotate(-90deg);}
  .wte ul{margin:10px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px;}
  .wte.collapsed ul{display:none;}
  .wte li{font-size:1rem;color:var(--ink);padding-left:20px;position:relative;line-height:1.55;}
  .wte li:before{content:'';position:absolute;left:2px;top:8px;width:7px;height:7px;border-radius:50%;background:var(--type);}
  .picker{padding:20px 30px 6px;border-top:1px solid #efe9df;margin-top:18px;}
  .picker.inline{display:flex;align-items:center;justify-content:flex-start;gap:14px;flex-wrap:wrap;}
  .picker.inline.center{justify-content:center;}
  /* 'Choose a class' &mdash; solid pill, same height as the option buttons */
  .pk-chip{display:inline-flex;align-items:center;min-height:44px;font-size:.78rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:0 20px;border-radius:999px;margin:0 0 13px;color:#fff;background:var(--dteal);border:1.5px solid transparent;}
  .cc .pk-chip{color:#fff;background:var(--type);}
  .picker.inline .pk-chip{margin:0;}
  .tabs{display:flex;gap:10px;flex-wrap:wrap;}
  .picker.inline .tabs{flex:0 1 auto;} .picker.inline.center .tabs{justify-content:center;}
  .tab-btn{flex:0 0 auto;min-height:44px;border:1.5px solid #e2ddd2;background:#fff;color:var(--ink);font-size:.9rem;font-weight:600;padding:0 16px;border-radius:999px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap;}
  .tab-btn .pin{width:9px;height:9px;border-radius:50%;background:#4E938C;} .tab-btn.ciren .pin{background:#7AA84A;}
  .tab-btn.on{font-weight:800;}
  .cc .tab-btn.on{background:var(--tint);border-color:var(--tintbd);color:var(--tintink);}
  .detail{margin:16px 30px 8px;border:1px solid #eee7dd;border-radius:14px;overflow:hidden;}
  .single .detail{margin-top:6px;}
  .pane{display:none;grid-template-columns:1fr auto;} .pane.on{display:grid;}
  .d-main{padding:18px 22px;}
  .d-loc{font-size:.9rem;font-weight:700;display:inline-flex;align-items:center;gap:4px;margin-bottom:6px;color:#3f7e78;} .d-loc.ciren{color:#5B8C1A;} .d-loc svg{width:12px;height:12px;}
  .d-loc .dir{color:#8a857c;font-weight:500;text-decoration:underline;margin-left:6px;font-size:.82rem;}
  .d-tt{font-weight:700;font-size:1.1rem;} .d-tt .dur{font-weight:500;color:#8a857c;font-size:.92rem;}
  .d-meta{font-size:.95rem;color:var(--ink);margin-top:4px;} .d-meta a{color:var(--ink);font-weight:700;text-decoration:underline;text-decoration-color:rgba(0,0,0,.28);text-underline-offset:3px;}
  .d-dates{font-size:.95rem;color:var(--ink);margin-top:4px;}   /* same weight & colour as the 'with' line */
  .d-drop{font-size:.95rem;color:var(--ink);margin-top:4px;}   /* drop-in price, left column */
  .d-drop .d-lbl{font-weight:700;}
  .d-dates .d-lbl{font-weight:700;}
  .d-price{padding:18px 22px;display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:9px;min-width:170px;background:#fbfaf7;}
  .d-price .pp{font-weight:700;font-size:1.02rem;}
  .d-offer{border-radius:8px;padding:6px 12px;font-size:.78rem;font-weight:700;line-height:1.3;text-align:center;border:1px solid transparent;}
  .cc .d-offer{background:var(--tint);color:var(--tintink);border-color:var(--tintbd);}
  .book{color:#fff;font-weight:700;font-size:.9rem;text-decoration:none;padding:0 22px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;white-space:nowrap;background:var(--type);}
  .cc .book{background:var(--typedk);}
  .tbc{margin:14px 30px 4px;padding:14px 18px;background:#FBF6ED;border:1px solid #EFE7D6;border-radius:12px;font-size:.92rem;color:#6f6a62;}
  /* mobile summary bar + bottom 'Show less' (both hidden on desktop) */
  .cc-sum,.cc-less{display:none;}
  .foot{padding:8px 30px 26px;}
  .disc{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;background:#FBF6ED;border:1px solid #EFE7D6;border-radius:10px;padding:11px 16px;font-size:.92rem;color:#5c6773;line-height:1.5;margin-bottom:14px;}
  .disc .disc-star{color:#B5771E;font-size:1rem;flex:none;line-height:1;}
  .disc b{color:#26303A;font-weight:700;}
  .disc .sep{color:#cdbf9e;padding:0 5px;}
  /* social share row */
  .cc-share{display:flex;align-items:center;gap:9px;justify-content:flex-end;}
  .cc-share .sh-lbl{font-size:.82rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#8a857c;margin-right:2px;}
  .cc .cc-share .sh-lbl{color:var(--typedk);}
  .sh-btn{width:34px;height:34px;border-radius:50%;border:1px solid transparent;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;text-decoration:none;transition:background .15s,color .15s,border-color .15s;}
  .cc .sh-btn{background:var(--type);color:#fff;border-color:var(--type);}   /* icons in the lighter type colour; Share label keeps the darker */
  .cc .sh-btn:hover{background:#fff;color:var(--type);}
  .sh-btn svg{width:16px;height:16px;}
  .sh-btn.copied{background:#2C8A34;color:#fff;border-color:#2C8A34;}
  @media(max-width:640px){
    .cc-top{grid-template-columns:110px 1fr;grid-template-areas:"gfx head" "body body";column-gap:14px;row-gap:12px;padding:22px 20px 4px;} .gfx{width:110px;height:110px;} .ctitle{font-size:1.34rem;margin-bottom:9px;} .cc-head .tags{margin-bottom:0;}
    .picker{padding:16px 20px 4px;}
    .picker.inline{display:block;text-align:left;} .picker.inline .pk-chip{margin-bottom:13px;} .picker.inline .tabs{justify-content:flex-start;}
    .detail{margin:14px 20px 4px;} .pane.on{grid-template-columns:1fr;}
    .d-price{flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between;width:100%;gap:10px;}
    .d-price .book{order:2;} .d-price .d-offer{order:3;flex-basis:100%;text-align:left;}
    .tbc,.foot{margin-left:20px;margin-right:20px;padding-left:18px;padding-right:18px;} .foot{padding:8px 0 22px;}
    /* discounts: full width (match the detail above) + label as a bar across the top */
    #akx-programme .gfx .gtxt{display:none;}  /* mobile: square too small for the poster text; title shows in the body */
    .cc-share{justify-content:flex-start;}
    /* --- title / intro breathing room --- */
    #akx-programme .pg-h{font-size:1.5rem;margin-bottom:14px;}
    #akx-programme .pg-lead{padding:0 20px;margin-bottom:22px;font-size:.95rem;}
    /* --- collapse cards: summary bar + expandable body --- */
    .cc .cc-sum{display:flex;align-items:center;justify-content:space-between;gap:12px;width:calc(100% - 40px);margin:2px 20px 22px;padding:15px 20px;border:1px solid #e5ddcf;border-radius:12px;background:#fbfaf7;cursor:pointer;font-family:inherit;text-align:left;-webkit-appearance:none;}
    .cc-sum-d{display:flex;flex-direction:column;gap:3px;font-weight:700;font-size:.92rem;flex:none;}
    .cc-sum-line{white-space:nowrap;}
    .cc .cc-sum-d{color:var(--tintink);}
    .cc-sum-cta{display:inline-flex;align-items:center;gap:7px;font-size:.8rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:#2B2A28;white-space:nowrap;}
    .cc-sum-cta .chev{font-size:1rem;font-weight:900;transition:transform .2s;}
    /* condensed = header/image/title/tags + summary only; description + detail live behind the one toggle */
    .cc.mcol .cc-exp,.cc.mcol .wte,.cc.mcol .desc{display:none;}
    .cc:not(.mcol) .desc{display:block;overflow:visible;margin-bottom:14px;}
    .cc:not(.mcol) .cc-sum{display:none;}   /* top summary hides once expanded */
    .cc .cc-less{display:flex;align-items:center;justify-content:center;gap:10px;width:calc(100% - 40px);margin:8px 20px 22px;padding:15px 20px;border:1px solid #e5ddcf;border-radius:12px;background:#fbfaf7;cursor:pointer;font-family:inherit;-webkit-appearance:none;}
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
    return rows.slice(1).map(function(r){var o={};h.forEach(function(k,i){o[k]=(r[i]||'').trim();});
      /* volunteer-friendly headers (24 Aug 2026): 'Event ID' and 'Location ID' map onto the
         internal names, so the sheet can use either */
      if(o['Event ID']!=null&&o.id==null)o.id=o['Event ID'];
      if(o['Location ID']!=null&&o.location==null)o.location=o['Location ID'];
      return o;})
      .filter(function(o){return Object.keys(o).some(function(k){return o[k];});}); }
  function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function splitList(s){return (s||'').split(/[;,]|\r?\n/).map(function(x){return x.trim();}).filter(Boolean);}
  function splitLines(s){return (s||'').split(/[;\n]|\r\n/).map(function(x){return x.trim();}).filter(Boolean);}  /* bullets: split on line-breaks/semicolons only &mdash; keep commas inside a bullet */
  function tagClass(t){t=t.toLowerCase();
    if(/mini|series/.test(t))return'purple'; if(/beginn|start|open|free|welcome/.test(t))return'green';
    if(/talk/.test(t))return'blue'; if(/depth|study/.test(t))return'amber'; if(/enrol/.test(t))return'rose'; return'sand';}
  var TAG_CYCLE=['blue','purple','green','amber','teal'];   // three tags, each a different colour (talks + courses)
  // ---- event-type taxonomy: single source of truth is window.AKX_GFX (event-graphics.js loaded first).
  //      The local fallback keeps the right colours even if that module didn't load. ----
  var GFX_FALLBACK={
    talk:   {colour:'#C56B45',dk:'#A44E2E',tint:'#FBECE3',tintbd:'#F2C4AA',tintink:'#C05A2E',label:'Public Talk'},
    course: {colour:'#2A66A6',dk:'#1E4C7C',tint:'#E3F1FB',tintbd:'#9AD0EF',tintink:'#1F6FB0',label:'Short Course'},
    free:   {colour:'#4FA35A',dk:'#3C8146',tint:'#E7F3E1',tintbd:'#B9DCA9',tintink:'#3B8B2E',label:'Free Event'},
    study:  {colour:'#6A4A9C',dk:'#52397A',tint:'#ECE4F7',tintbd:'#C9B6E8',tintink:'#6A38B0',label:'In-depth'},
    special:{colour:'#B5771E',dk:'#8E5C14',tint:'#F6E9CE',tintbd:'#E4C48A',tintink:'#8E5C14',label:'Special Event'},
    retreat:{colour:'#227A72',dk:'#185B54',tint:'#D5EFEC',tintbd:'#A6D9D2',tintink:'#1E6E66',label:'Retreat'}
  };
  var GFX_ALIAS={'talk':'talk','public talk':'talk','public talks':'talk','one-off talk':'talk',
    'short course':'course','course':'course','day course':'course','half-day course':'course',
    'free event':'free','free events':'free','free':'free',
    'in-depth':'study','in-depth event':'study','in depth event':'study','study':'study','silent day':'study',
    'special event':'special','special events':'special','special':'special','retreat':'retreat','day retreat':'retreat'};
  function gfxType(x){ if(window.AKX_GFX&&AKX_GFX.typeOf){var t=AKX_GFX.typeOf(x); if(t) return t;}
    var k=String(x||'').trim().toLowerCase(); return GFX_ALIAS[k]||(/talk/.test(k)?'talk':'course'); }
  function gfxTheme(t){ if(window.AKX_GFX&&AKX_GFX.themeOf){var th=AKX_GFX.themeOf(t); if(th) return th;} return GFX_FALLBACK[t]||GFX_FALLBACK.course; }
  function gfxMotif(x){ return (window.AKX_GFX&&AKX_GFX.motifSVG)?AKX_GFX.motifSVG(x):''; }
  function gfxVars(th){ return '--type:'+th.colour+';--typedk:'+th.dk+';--tint:'+th.tint+';--tintbd:'+th.tintbd+';--tintink:'+th.tintink+';'; }
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
  // ---- left-header label by position: 1st = countdown / Current series; 2nd&ndash;3rd = Booking open|Upcoming; 4th+ = Upcoming ----
  //      Branch pages (data-labels="branch") use Gen's simpler set instead:
  //      already started -> "Current classes" | 6 days or less -> "Next" | 7+ days -> "Upcoming".
  function bannerLabel(idx, classes, showFrom){
    var hasBooking = classes.some(function(cl){return cl.booking_url;});
    if(idx===0){
      var dates=allClassDates(classes, showFrom);
      if(!dates.length) return 'Upcoming';
      var now=new Date(); now.setHours(0,0,0,0);
      if(dates[0] < now) return OPT.labels==='branch' ? 'Current classes' : 'Current series';
      var days=Math.round((dates[0]-now)/86400000);
      if(OPT.labels==='branch') return days<=6 ? 'Next' : 'Upcoming';
      if(days===0) return 'Today';
      if(days===1) return '1 day';
      return days+' days';
    }
    if(idx===1 || idx===2) return hasBooking ? 'Booking open' : 'Upcoming';
    return 'Upcoming';
  }
  // first class date of a run &mdash; used to order branch cards (current first, then the next)
  function firstDateOf(it, classes){
    var d=allClassDates(classes, parseFullDate(it.show_from));
    return d.length ? d[0] : new Date(8640000000000000);
  }
  // summary shown in the collapsed mobile bar (HTML) &mdash; talks list each date stacked; courses a 'from' date
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
    var datesHtml = n>1 ? esc(n+' classes')+' &middot; '+esc(dates.join(', ')) : (n===1 ? '<span class="d-lbl">Date:</span> '+esc(formatDate(dates[0])) : '');
    var pp = cl.price_class ? '<div class="d-drop"><span class="d-lbl">Drop-in price</span> \u00b7 '+esc(cl.price_class)+'</div>' : '';
    var offer = (cl.price_series && n>1) ? '<span class="d-offer">Special offer '+n+' classes only '+esc(cl.price_series)+'</span>' : '';
    var book = cl.booking_url ? '<a class="book" href="'+esc(cl.booking_url)+'" target="_blank" rel="noopener">Book your Spot &rarr;</a>' : '';
    return '<div class="pane'+(c?' ciren':'')+(on?' on':'')+'" data-i="'+i+'">'
      +'<div class="d-main">'
        +'<div class="d-loc'+(c?' ciren':'')+'"><svg viewBox="0 0 24 24" fill="'+(c?'#7AA84A':'#4E938C')+'">'+PIN+'</svg>'+esc(cl.location||'')+(directionsURL(cl.location)?'<a class="dir" href="'+directionsURL(cl.location)+'" target="_blank" rel="noopener">Get directions</a>':'')+'</div>'
        +(cl.teacher?'<div class="d-meta">with <a href="/about-us#teachers">'+esc(cl.teacher)+'</a></div>':'')
        +'<div class="d-tt">'+esc(fullDay(cl.day))+' '+esc(cl.time)+(cl.duration?' <span class="dur">| '+esc(cl.duration)+'</span>':'')+'</div>'
        +(datesHtml?'<div class="d-dates">'+datesHtml+'</div>':'')
        +pp
      +'</div>'
      +(offer||book?'<div class="d-price">'+offer+book+'</div>':'')
    +'</div>';
  }
  function discFmt(s){ return esc(s).replace(/\s*\|\s*/g,'<span class="sep">|</span>'); }
  function discInline(s){ return esc(s).replace(/\s*\|\s*/g,'<span class="sep">&middot;</span>'); }
  function shareRow(item){
    var t=esc(item.title+' &mdash; Akanishta Kadampa Meditation Centre');
    return '<div class="cc-share"><span class="sh-lbl">Share</span>'
      +'<button type="button" class="sh-btn" data-share="fb" title="Share on Facebook" aria-label="Share on Facebook">'+SH_FB+'</button>'
      +'<button type="button" class="sh-btn" data-share="x" data-text="'+t+'" title="Share on X" aria-label="Share on X">'+SH_X+'</button>'
      +'<button type="button" class="sh-btn" data-share="wa" data-text="'+t+'" title="Share on WhatsApp" aria-label="Share on WhatsApp">'+SH_WA+'</button>'
      +'<button type="button" class="sh-btn sh-copy" title="Copy link" aria-label="Copy link">'+SH_LINK+'</button>'
    +'</div>';
  }
  function card(item, classes, idx){
    var type = gfxType(item.type);            // canonical: talk|course|free|study|special|retreat
    var theme = gfxTheme(type);
    var isTalk = (type==='talk');
    var showFrom = parseFullDate(item.show_from);
    var motif = gfxMotif(item.type);          // faint white type-motif behind the box
    var totalDates = classes.reduce(function(n,cl){return n+splitList(cl.dates).length;},0);
    var weeks = classes.reduce(function(m,cl){var k=splitList(cl.dates).length;return k>m?k:m;},0);   // course length = longest single class run, not all sittings added up
    var typeLabel = isTalk ? ((classes.length>1||totalDates>1) ? 'Public Talks' : 'Public Talk') : theme.label;
    // mini-poster (Fable recipe): type label + title + one date line, from the first class
    var pDate='';
    if(classes[0]){ var _d0=splitList(classes[0].dates)[0];
      pDate=(shortDay(classes[0].day)+' '+(classes[0].time||'')).trim().toUpperCase()
           +(_d0?' &middot; '+(isTalk?'':'FROM ')+shortDMY(_d0):''); }
    var poster='<div class="gtxt"><span class="glabel">'+esc(typeLabel)+'</span>'
      +'<span class="gtitle">'+esc(item.title)+'</span>'
      +(pDate?'<span class="gdate">'+pDate+'</span>':'')+'</div>';
    var gfx;
    if(item.graphic){                         // explicit URL wins; photo covers the tile, poster text sits over it
      gfx = '<div class="gfx">'+motif+'<img class="byid" src="'+esc(item.graphic)+'" alt="" onerror="this.remove()">'+poster+'</div>';
    } else if(item.id){                        // else try images/<id>.jpg, then .png; if none, the coded poster shows
      gfx = '<div class="gfx">'+motif+'<img class="byid" crossorigin="anonymous" src="'+IMG_BASE+encodeURIComponent(item.id)+'.jpg" alt="" onerror="if(this.dataset.tried){this.remove()}else{this.dataset.tried=1;this.src=this.src.replace(/\\.jpg$/,\'.png\')}">'+poster+'</div>';
    } else {
      gfx = '<div class="gfx">'+motif+poster+'</div>';
    }
    var tags = splitList(item.tags).map(function(t,i){
      var cls = TAG_CYCLE[i % TAG_CYCLE.length];
      return '<span class="tag '+cls+'">'+esc(t)+'</span>';
    }).join('');
    var wte = splitLines(item.what_to_expect);
    var wteHtml = wte.length ? '<div class="wte collapsed"><button class="wte-t">What to expect <span class="chev">&#9662;</span></button><ul>'
        + wte.map(function(x){return '<li>'+esc(x)+'</li>';}).join('') + '</ul></div>' : '';
    var tlabel = bannerLabel(idx, classes, showFrom);
    var lenLabel = (!isTalk && weeks>1) ? ' &middot; '+weeks+' weeks' : '';   // length in the banner (courses)
    var banner = '<div class="cc-banner">'
        + (tlabel ? '<span class="cc-when"><span class="cc-dot"></span>'+esc(tlabel)+'</span>' : '')
        + '<span class="cc-type">'+typeLabel+lenLabel+'</span>'
      +'</div>';
    var head = '<div class="cc-top">'+gfx
        +'<div class="cc-head">'
          +'<h2 class="ctitle">'+esc(item.title)+'</h2>'
          +(tags?'<div class="tags">'+tags+'</div>':'')
        +'</div>'
        +'<div class="cc-body">'
          +(item.description?'<p class="desc">'+esc(item.description)+'</p>':'')
          + wteHtml
        +'</div>'
      +'</div>';
    var body='';
    if(classes.length===0){
      body='<div class="tbc">Date &amp; venue to be confirmed &mdash; see the calendar below for the latest.</div>';
    } else if(classes.length===1){
      /* one time & place only — no point offering "Choose a class" with a single option.
         (Was talks-only; branch pages filter to one town, so courses land here too.) */
      body='<div class="single"><div class="detail">'+pane(classes[0],0,true)+'</div></div>';
    } else {
      var pkClass = 'picker inline';
      body='<div class="'+pkClass+'"><span class="pk-chip">Choose a class</span><div class="tabs">'
          + classes.map(function(cl,i){return pill(cl,i,i===0,isTalk);}).join('') + '</div></div>'
          + '<div class="detail">'+classes.map(function(cl,i){return pane(cl,i,i===0);}).join('')+'</div>';
    }
    var discHtml = item.discount_note ? '<div class="disc"><span class="disc-star">&#9733;</span> <b>Online discounts available</b> &mdash; <span>'+discInline(item.discount_note.replace(/^\s*discounts?\s*:\s*/i,''))+'</span></div>' : '';
    var foot = '<div class="foot">'+discHtml+shareRow(item)+'</div>';
    // mobile collapse: top summary (dates + Show more) when collapsed; a 'Show less' control at the BOTTOM when expanded
    var sumD = summaryDates(isTalk, classes, showFrom);
    var sum = '<button type="button" class="cc-sum">'
        + '<span class="cc-sum-d">'+sumD+'</span>'
        + '<span class="cc-sum-cta">Show more details <span class="chev">&#9662;</span></span>'
      +'</button>';
    var less = '<button type="button" class="cc-less"><span class="cc-sum-cta">Show less <span class="chev">&#9652;</span></span></button>';
    var exp = '<div class="cc-exp">'+body+foot+less+'</div>';
    return '<div class="cc '+type+' mcol" style="'+gfxVars(theme)+'">'+banner+head+sum+exp+'</div>';
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
  function syncWte(cc){   // 'What to expect' BULLETS take the event-title colour (the toggle label keeps the darker header colour from CSS)
    var title=cc.querySelector('.ctitle'); if(!title) return;
    var col=title.style.color||getComputedStyle(title).color;
    cc.querySelectorAll('.wte li').forEach(function(e){ e.style.color=col; });
  }
  function colourTitles(root){
    root.querySelectorAll('.cc').forEach(function(cc){
      var img=cc.querySelector('.gfx img.byid'), title=cc.querySelector('.ctitle');
      if(!title) return;
      if(img){
        var apply=function(){ var col=titleColorFromImg(img); if(col) title.style.color=col; syncWte(cc); };
        if(img.complete && img.naturalWidth) apply();
        img.addEventListener('load',apply);   // also fires after a .jpg&rarr;.png swap
      }
      syncWte(cc);   // no-image cards + initial state
    });
  }
  function checkClamp(root){
    root.querySelectorAll('.desc.clamp').forEach(function(d){
      if(d.scrollHeight-d.clientHeight>2){ var b=d.nextElementSibling; if(b&&b.classList.contains('desc-more')) b.classList.add('show'); }
      else { d.classList.remove('clamp'); }
    });
  }
  function wire(root){
    root.querySelectorAll('.wte-t').forEach(function(b){b.addEventListener('click',function(){b.parentNode.classList.toggle('collapsed');});});
    // mobile expand/collapse: top 'Show more' (collapsed) + bottom 'Show less' (expanded) both toggle
    root.querySelectorAll('.cc-sum,.cc-less').forEach(function(b){b.addEventListener('click',function(){
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
    // FB / X / WhatsApp share
    root.querySelectorAll('.sh-btn[data-share]').forEach(function(b){b.addEventListener('click',function(){
      var url=encodeURIComponent(location.href), tx=encodeURIComponent(b.getAttribute('data-text')||document.title), k=b.getAttribute('data-share'), href='';
      if(k==='fb') href='https://www.facebook.com/sharer/sharer.php?u='+url;
      else if(k==='x') href='https://twitter.com/intent/tweet?url='+url+'&text='+tx;
      else if(k==='wa') href='https://wa.me/?text='+tx+'%20'+url;
      if(href) window.open(href,'_blank','noopener');
    });});
    // show-all (5th event onward)
    var sa=root.querySelector('#pgShowAll'); if(sa){ sa.addEventListener('click',function(){ var hid=root.querySelectorAll('.pg-item:not(.on)'); for(var i=0;i<2&&i<hid.length;i++){hid[i].classList.add('on');} if(root.querySelectorAll('.pg-item:not(.on)').length===0){sa.style.display='none';} }); }
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
  var DEFAULT_HEAD = 'Talks &amp; Short Courses';
  var DEFAULT_LEAD = 'Here\'s the upcoming programme of talks, short courses &amp; special events. All events are drop-in &mdash; except special events. If you choose to book online you\'ll have access to discounts such as student pricing, bring a friend for half price, early bird pricing and 20% discount for booking a series, where these are available.';
  function render(mount, items, classes){
    /* branch pages: keep only the class rows for this town, then only the talks/courses
       that still have somewhere to happen here */
    if(OPT.location){
      var want=OPT.location.toLowerCase();
      classes = classes.filter(function(cl){ return String(cl.location||'').trim().toLowerCase()===want; });
    }
    var byId={}; classes.forEach(function(cl){ if(cl.id){ (byId[cl.id]=byId[cl.id]||[]).push(cl); } });
    var today=new Date(); today.setHours(0,0,0,0);
    var live = items.filter(function(it){ return isVisible(it, byId[it.id]||[], today); });
    if(OPT.location) live = live.filter(function(it){ return (byId[it.id]||[]).length; });

    /* branch pages ask for "the current / next course and the one after it", so order by
       start date rather than sheet order, then take the first N */
    if(OPT.limit){
      live = live.slice().sort(function(a,b){
        return firstDateOf(a, byId[a.id]||[]) - firstDateOf(b, byId[b.id]||[]);
      }).slice(0, OPT.limit);
    }

    var head = OPT.heading===null ? DEFAULT_HEAD : OPT.heading;
    var lead = OPT.lead===null ? DEFAULT_LEAD : OPT.lead;
    var html = (head ? '<h2 class="pg-h">'+head+'</h2>' : '')
             + (lead ? '<div class="pg-lead"><p>'+lead+'</p></div>' : '');
    if(!live.length){
      /* branch pages: draw nothing at all and let the host section collapse, rather than
         leaving a heading over an apology */
      if(OPT.limit){
        mount.innerHTML='';
        if(mount.parentNode && mount.parentNode.classList) mount.parentNode.classList.add('akx-empty');
        return;
      }
      html += '<div class="pg-msg">Nothing scheduled just now &mdash; please check back soon.</div>';
    }
    else {
      var cardsHtml = live.map(function(it,idx){ return card(it, byId[it.id]||[], idx); });
      var TQ = OPT.quotes ? '<div style="max-width:1000px;margin:24px auto;"><div class="akx-tq" data-type="testimony" data-page="classes"></div></div>' : '';
      if(OPT.limit){
        html += cardsHtml.join('');                        // branch: just the cards, no testimonial, no Show more
      } else {
        var head3 = cardsHtml.slice(0,3);
        html += head3[0] + TQ + head3.slice(1).join('');   // show 3 cards, rotating testimonial after the first
        if(cardsHtml.length>3){
          html += '<div class="pg-more" id="pgMore">'+cardsHtml.slice(3).map(function(c){return '<div class="pg-item">'+c+'</div>';}).join('')+'</div>'
                + '<button type="button" class="pg-showall" id="pgShowAll">Show more &darr;</button>';
        }
      }
    }
    mount.innerHTML=html;
    wire(mount);
  }
  function init(){
    var mount=document.getElementById(MOUNT_ID) || document.querySelector('.'+MOUNT_ID);
    if(!mount) return;
    if(mount.getAttribute('data-akx-done')==='1') return;
    mount.setAttribute('data-akx-done','1');
    mount.id = MOUNT_ID;                       // the stylesheet is scoped to the id
    var A=function(n){ return mount.getAttribute(n); };
    OPT.location = (A('data-location')||'').trim();
    OPT.limit    = parseInt(A('data-limit'),10) || 0;
    OPT.labels   = (A('data-labels')||'').trim();
    OPT.heading  = A('data-heading')===null ? null : A('data-heading');
    OPT.lead     = A('data-lead')===null    ? null : A('data-lead');
    OPT.quotes   = A('data-quotes')!=='0';
    if(!document.getElementById('akx-programme-style')){var st=document.createElement('style');st.id='akx-programme-style';st.textContent=STYLE;document.head.appendChild(st);}
    if(window.AKX_GFX&&AKX_GFX.injectCSS){AKX_GFX.injectCSS();}   // motif symbols for the type tiles
    mount.innerHTML='<div class="pg-msg">Loading&hellip;</div>';
    Promise.all([
      fetch(csvUrl(TAB_ITEMS)).then(function(r){return r.text();}),
      fetch(csvUrl(TAB_CLASSES)).then(function(r){return r.text();})
        .then(function(t){ return /"location( id)?"/i.test((t.split('\n')[0]||'')) ? t : fetch(csvUrl(TAB_CLASSES_OLD)).then(function(r){return r.text();}); })
    ]).then(function(res){
      var items=toObjs(parseCSV(res[0])), classes=toObjs(parseCSV(res[1]));
      render(mount, items, classes);
    }).catch(function(e){ mount.innerHTML='<div class="pg-msg">Sorry &mdash; the programme couldn&rsquo;t load just now.</div>'; console.warn('programme load failed',e); });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
