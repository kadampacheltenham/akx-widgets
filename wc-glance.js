/* Akanishta &mdash; Week at a Glance widget (v5)
   - Title/intro styled like Weekly Classes Programme
   - Amber term-dates banner (calendar-banner style, no warning icon)
   - Open House strip UNDER the tags on Mon eve + Fri taster (yellow)
   - Desktop: full table with Details expand
   - Mobile (<=640px): collapsed 'teaser' + filter tabs; rows TAP TO EXPAND (summary + link)
   Include with: <div id="akx-glance"></div>
                 <script src="https://kadampacheltenham.github.io/akx-widgets/glance.js" defer></script> */
(function(){
  var MOUNT_ID='akx-glance';
  var OH_INVITE='New? Let us welcome you and show you around before the class.';
  var DIR_CH='https://maps.google.com/?q=59+Whaddon+Road,+Cheltenham';
  var DIR_CI='https://maps.google.com/?q=Cirencester';   /* TODO: exact Cirencester venue address */

  /* ---- single source of truth for both desktop + mobile ---- */
  var EVENTS=[
    {day:'Mon',time:'12:30',name:'Simply Meditate',dur:'30 min',loc:'chelt',
     tags:[['Drop-in','t-drop'],['Get started','t-start']],key:['Get started','t-start'],
     sum:'Reduce stress and cultivate inner peace|Come as you are|Check term dates above or calendar below',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Mon',time:'18:30',name:'Evening meditation class',dur:'75 min',loc:'chelt',oh:'5:45&ndash;6:15 pm',
     tags:[['Main class','t-main'],['Drop-in','t-drop']],key:['Main class','t-main'],
     sum:'One-off talks &amp; short series on a theme or topic|See programme &amp; calendar below for details',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Tue',time:'10:30',name:'Daytime meditation class',dur:'75 min',loc:'chelt',
     tags:[['Main class','t-main'],['Drop-in','t-drop']],key:['Main class','t-main'],
     sum:'One-off talks &amp; short series on a theme or topic|See programme &amp; calendar below for details',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Wed',time:'19:00',name:'Young Adults',dur:'60 min',loc:'chelt',
     tags:[['Young Adults','t-ya'],['Drop-in','t-drop']],key:['Young Adults','t-ya'],
     sum:'Aimed at young adults 18+|Check programme or calendar below for more details',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Thu',time:'18:30',name:'Cirencester evening class',dur:'75 min',loc:'ciren',
     tags:[['Drop-in','t-drop'],['Branch class','t-branch']],key:['Branch class','t-branch'],
     sum:'Talks &amp; meditations following a theme|Check programme or calendar for dates',
     cta:{label:'Get directions &rarr;',url:DIR_CI,ext:1}},
    {day:'Fri',time:'12:00',name:'Free guided meditation',dur:'15 min',loc:'chelt',free:1,oh:'11:30&ndash;12:00',
     tags:[['Perfect for beginners','t-start'],['Drop-in','t-drop']],key:['Free','t-start'],
     sum:'Get started|Come as you are|Check term dates above or calendar below',
     cta:{label:'Get directions &rarr;',url:DIR_CH,ext:1}},
    {day:'Sat',time:'10:00',name:'Weekend courses &amp; retreats',dur:'',loc:'chelt',
     tags:[['Day/Half-day','t-neutral'],['Go deeper','t-depth']],key:['Go deeper','t-depth'],
     sum:'Day &amp; half-day courses and retreats throughout the year.',
     cta:{label:'Courses &amp; retreats page &rarr;',url:'/courses-retreats',coral:1}},
    {day:'Sun',time:'09:30',name:'Teacher Training (TTP)',dur:'',loc:'chelt',depth:1,
     tags:[['In-depth','t-depth'],['Enrolment required','t-enrol']],key:['In-depth','t-depth'],
     sum:'In-depth training for those wishing to train as qualified meditation teachers|Not a drop-in class',
     cta:{label:'In-depth study page &rarr;',url:'/in-depth-study',coral:1}},
    {day:'Sun',time:'15:00',name:'Foundation Programme (FP)',dur:'',loc:'chelt',depth:1,
     tags:[['In-depth','t-depth'],['Enrolment required','t-enrol']],key:['In-depth','t-depth'],
     sum:'Go further|In-depth structured study &amp; meditation|Not a drop-in class',
     cta:{label:'In-depth study page &rarr;',url:'/in-depth-study',coral:1}}
  ];
  var TABS=['All','Cheltenham','AM','PM','Free','Branches','In-depth'];

  var PIN_CH='<svg viewBox="0 0 24 24" fill="#C8102E"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';
  var PIN_CI='<svg viewBox="0 0 24 24" fill="#6DBE45"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';
  var CAL_ICON='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8860B" stroke-width="2" stroke-linecap="round"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>';
  var DOOR='&#128682;';

  var STYLE=String.raw`
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap');
  :root{--ink:#2B2A28;--red:#C8102E;--teal:#4E938C;}
  #akx-glance *{box-sizing:border-box;}
  #akx-glance{font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);}
  #akx-glance .wag{max-width:1000px;margin:0 auto;}
  #akx-glance .wag-h{text-align:center;font-size:1.9rem;font-weight:600;color:#2A66A6;margin:0 0 6px;}
  #akx-glance .wag-lead{margin:0 auto 18px;padding:0 30px;text-align:left;color:#6f6a62;font-size:.98rem;line-height:1.55;}
  #akx-glance .wag-term{display:flex;gap:12px;align-items:flex-start;background:#FDF3E3;color:#6E5212;border:1px solid #F1E0C2;border-radius:12px;padding:15px 18px;margin:0 0 20px;font-size:1rem;line-height:1.55;}
  #akx-glance .wag-term .cal{flex:none;margin-top:3px;}
  #akx-glance .wag-term .line{display:block;} #akx-glance .wag-term b{font-weight:700;} #akx-glance .wag-term .ht{color:#957c3c;}

  #akx-glance .toolbar{display:flex;justify-content:flex-end;margin:0 0 8px;}
  #akx-glance .xall{background:none;border:1.5px solid #dcd6ca;border-radius:999px;padding:6px 15px;font-size:.82rem;font-weight:600;color:var(--teal);cursor:pointer;}
  #akx-glance .tbl{border:1px solid #ece7dd;border-radius:14px;background:#fff;box-shadow:0 3px 14px rgba(0,0,0,.05);overflow:hidden;}
  #akx-glance .r{border-top:1px solid #f0ece3;} #akx-glance .r:first-child{border-top:none;}
  #akx-glance .rh{display:grid;grid-template-columns:72px 1fr auto;grid-template-areas:"day name det" "day meta meta" "day oh oh";column-gap:16px;row-gap:7px;padding:14px 20px;align-items:center;cursor:pointer;}
  #akx-glance .dt{grid-area:day;align-self:start;display:flex;flex-direction:column;}
  #akx-glance .dt .day{font-family:'Oswald',sans-serif;color:var(--red);font-weight:700;font-size:1.12rem;line-height:1;}
  #akx-glance .dt .time{font-family:'Oswald',sans-serif;color:var(--ink);font-weight:500;font-size:.84rem;margin-top:3px;}
  #akx-glance .meta{grid-area:meta;min-width:0;display:flex;align-items:center;gap:6px 10px;flex-wrap:wrap;}
  #akx-glance .nm{grid-area:name;font-weight:700;font-size:1rem;color:var(--ink);} #akx-glance .nm .dur{font-weight:500;color:#9a948b;font-size:.85rem;}
  #akx-glance .ptag{font-size:.62rem;font-weight:700;letter-spacing:.02em;text-transform:uppercase;padding:3px 8px;border-radius:999px;white-space:nowrap;}
  #akx-glance .t-main{background:rgba(10,151,255,.16);color:#0A6FBF;} #akx-glance .t-drop{background:#D2E9E4;color:#227C74;} #akx-glance .t-start{background:#D6EFCB;color:#3B8B2E;}
  #akx-glance .t-ya{background:#E7DDF7;color:#6A38B0;} #akx-glance .t-branch{background:#F6E6C2;color:#A5741A;} #akx-glance .t-neutral{background:#ECE3D2;color:#8A7647;} #akx-glance .t-depth{background:#F0DCE0;color:#7B2D3A;} #akx-glance .t-enrol{background:#E7DFF0;color:#6E5A86;}
  #akx-glance .loc{font-size:.85rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;white-space:nowrap;flex:0 0 auto;} #akx-glance .loc svg{width:11px;height:11px;} #akx-glance .loc.chelt{color:#5A5A5A;} #akx-glance .loc.ciren{color:#5B8C1A;}
  #akx-glance .det{grid-area:det;align-self:center;border:1.5px solid #d9e3e0;background:#fff;color:var(--teal);font-size:.8rem;font-weight:700;padding:6px 12px;border-radius:999px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:5px;}
  #akx-glance .det .chev{font-size:.66rem;transition:transform .2s;}
  #akx-glance .r.open .det{background:#EEF5F3;border-color:#bcd8d2;} #akx-glance .r.open .det .chev{transform:rotate(180deg);}
  #akx-glance .oh{grid-area:oh;display:flex;align-items:center;gap:8px;background:#FFF4CC;color:#6E5212;border:1px solid #F0DFA3;border-left:3px solid #E0A82E;border-radius:8px;padding:7px 12px;font-size:.84rem;line-height:1.4;}
  #akx-glance .oh .oh-ico{font-size:.95rem;flex:none;} #akx-glance .oh b{font-weight:700;color:#4A3908;}
  #akx-glance .rd{display:none;padding:0 20px 16px 90px;}
  #akx-glance .r.open .rd{display:block;}
  #akx-glance .rd .sum{font-size:.93rem;color:#5A5A5A;line-height:1.55;margin-bottom:12px;} #akx-glance .rd .sum .sep{color:#cfc8bc;padding:0 6px;}
  #akx-glance .cta{display:inline-block;background:#E4F1E7;color:#0B7A3B;border:1px solid #C4E1CC;font-weight:600;font-size:.84rem;text-decoration:none;padding:8px 16px;border-radius:999px;}
  #akx-glance .cta.coral{background:#F8E8DF;color:#B85C37;border-color:#EDCDBD;}

  /* ---- desktop / mobile swap ---- */
  #akx-glance .wag-mobile{display:none;}
  @media(max-width:640px){
    #akx-glance .wag-desktop{display:none;}
    #akx-glance .wag-mobile{display:block;}
    #akx-glance .wag-h{font-size:1.5rem;} #akx-glance .wag-lead{padding:0 20px;font-size:.95rem;margin-bottom:14px;}
    #akx-glance .wag-term{font-size:.95rem;padding:13px 15px;}
  }
  /* mobile tabs + list */
  #akx-glance .m-tabs{display:flex;gap:6px;overflow-x:auto;padding:2px 2px 10px;-webkit-overflow-scrolling:touch;}
  #akx-glance .m-tabs::-webkit-scrollbar{height:0;}
  #akx-glance .m-tab{flex:0 0 auto;border:1.5px solid #dcd6ca;background:#fff;color:#6f6a62;border-radius:999px;padding:6px 13px;font-size:.8rem;font-weight:600;cursor:pointer;white-space:nowrap;}
  #akx-glance .m-tab.on{background:#2A66A6;border-color:#2A66A6;color:#fff;}
  #akx-glance .m-list{background:#fff;border:1px solid #ece7dd;border-radius:12px;box-shadow:0 3px 14px rgba(0,0,0,.05);overflow:hidden;position:relative;}
  #akx-glance .mrow{display:grid;grid-template-columns:46px 1fr auto;column-gap:10px;padding:12px 14px;border-top:1px solid #f0ece3;align-items:start;}
  #akx-glance .mrow:first-child{border-top:none;}
  #akx-glance .mrow.mx{cursor:pointer;}
  #akx-glance .mrow .mday{font-family:'Oswald',sans-serif;color:var(--red);font-weight:700;font-size:.98rem;line-height:1.05;}
  #akx-glance .mrow .mtime{font-family:'Oswald',sans-serif;font-size:.74rem;color:var(--ink);}
  #akx-glance .mrow .mname{font-weight:700;font-size:.94rem;}
  #akx-glance .mrow .msub{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:4px;}
  #akx-glance .mrow .msub .ptag{font-size:.57rem;padding:2px 7px;} #akx-glance .mrow .msub .loc{font-size:.77rem;}
  #akx-glance .mchev{align-self:center;border:1.5px solid #d9e3e0;background:#fff;color:var(--teal);width:26px;height:26px;border-radius:999px;font-size:.62rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;}
  #akx-glance .mchev .c{transition:transform .2s;}
  #akx-glance .mrow.open .mchev{background:#EEF5F3;border-color:#bcd8d2;} #akx-glance .mrow.open .mchev .c{transform:rotate(180deg);}
  #akx-glance .mrd{display:none;margin-top:10px;}
  #akx-glance .mrow.open .mrd{display:block;}
  #akx-glance .mrd .msum{font-size:.82rem;color:#5A5A5A;line-height:1.5;margin-bottom:10px;} #akx-glance .mrd .msum .sep{color:#cfc8bc;padding:0 5px;}
  #akx-glance .mcta{display:inline-block;background:#E4F1E7;color:#0B7A3B;border:1px solid #C4E1CC;font-weight:600;font-size:.8rem;text-decoration:none;padding:7px 14px;border-radius:999px;}
  #akx-glance .mcta.coral{background:#F8E8DF;color:#B85C37;border-color:#EDCDBD;}
  #akx-glance .oh-m{margin-top:7px;display:flex;gap:7px;align-items:center;background:#FFF4CC;color:#6E5212;border:1px solid #F0DFA3;border-left:3px solid #E0A82E;border-radius:7px;padding:6px 9px;font-size:.75rem;line-height:1.35;}
  #akx-glance .oh-m b{font-weight:700;color:#4A3908;}
  #akx-glance .m-list.teaser{cursor:pointer;}
  #akx-glance .mrow.ghost{opacity:.5;} #akx-glance .mrow.ghost2{opacity:.22;}
  #akx-glance .m-fade{position:absolute;left:0;right:0;bottom:0;height:155px;background:linear-gradient(to bottom,rgba(255,255,255,0),#fff 80%);pointer-events:none;}
  #akx-glance .m-nudge{position:absolute;left:0;right:0;bottom:16px;text-align:center;z-index:2;}
  #akx-glance .m-nudge span{display:inline-block;background:#2A66A6;color:#fff;font-size:.8rem;font-weight:600;padding:8px 16px;border-radius:999px;box-shadow:0 4px 14px rgba(42,102,166,.32);}
  #akx-glance .m-empty{padding:16px;text-align:center;color:#9a948b;font-size:.85rem;}
  #akx-glance .m-reset{border-top:1px solid #f0ece3;text-align:center;padding:11px;font-size:.8rem;font-weight:600;color:#2A66A6;cursor:pointer;background:#FBF9F4;}
`;

  function mins(t){var p=t.split(':');return (+p[0])*60+(+p[1]);}
  function isAM(e){return mins(e.time)<=720;}          /* starts by 12:00 */
  function pin(loc){return loc==='ciren'?PIN_CI:PIN_CH;}
  function locName(loc){return loc==='ciren'?'Cirencester':'Cheltenham';}
  function locHTML(e){return '<span class="loc '+e.loc+'">'+pin(e.loc)+locName(e.loc)+'</span>';}
  function tagsHTML(e){return e.tags.map(function(t){return '<span class="ptag '+t[1]+'">'+t[0]+'</span>';}).join('');}
  function keyTagHTML(e){return '<span class="ptag '+e.key[1]+'">'+e.key[0]+'</span>';}
  function sumHTML(s){return s.split('|').map(function(x,i){return (i?'<span class="sep">|</span>':'')+x;}).join('');}
  function ctaAttrs(e){return 'href="'+e.cta.url+'"'+(e.cta.ext?' target="_blank" rel="noopener"':'');}

  function desktopRow(e){
    var oh=e.oh?'<div class="oh"><span class="oh-ico">'+DOOR+'</span><span><b>Open House '+e.oh+'</b> &mdash; '+OH_INVITE+'</span></div>':'';
    return '<div class="r"><div class="rh">'
      +'<div class="dt"><span class="day">'+e.day+'</span><span class="time">'+e.time+'</span></div>'
      +'<span class="nm">'+e.name+(e.dur?' <span class="dur">('+e.dur+')</span>':'')+'</span>'
      +'<span class="meta">'+tagsHTML(e)+locHTML(e)+'</span>'
      +'<button class="det">Details <span class="chev">&#9662;</span></button>'
      +oh
      +'</div><div class="rd"><div class="sum">'+sumHTML(e.sum)+'</div>'
      +'<a class="cta'+(e.cta.coral?' coral':'')+'" '+ctaAttrs(e)+'>'+e.cta.label+'</a></div></div>';
  }
  function mobileRow(e,cls,expandable){
    var dur=e.dur?' <span class="dur" style="color:#9a948b;font-weight:500;font-size:.8rem">('+e.dur+')</span>':'';
    var oh=e.oh?'<div class="oh-m">'+DOOR+' <span><b>Open House '+e.oh+'</b> &mdash; '+OH_INVITE+'</span></div>':'';
    var chev=expandable?'<button class="mchev"><span class="c">&#9662;</span></button>':'';
    var det=expandable?'<div class="mrd"><div class="msum">'+sumHTML(e.sum)+'</div>'
      +'<a class="mcta'+(e.cta.coral?' coral':'')+'" '+ctaAttrs(e)+'>'+e.cta.label+'</a></div>':'';
    return '<div class="mrow'+(cls?' '+cls:'')+(expandable?' mx':'')+'">'
      +'<div><div class="mday">'+e.day+'</div><div class="mtime">'+e.time+'</div></div>'
      +'<div class="mbody"><div class="mname">'+e.name+dur+'</div>'
      +'<div class="msub">'+keyTagHTML(e)+locHTML(e)+'</div>'+oh+det+'</div>'
      +chev+'</div>';
  }
  function match(e,tab){
    if(tab==='All')return true;
    if(tab==='Cheltenham')return e.loc==='chelt';
    if(tab==='AM')return isAM(e);
    if(tab==='PM')return !isAM(e);
    if(tab==='Free')return !!e.free;
    if(tab==='Branches')return e.loc!=='chelt';
    if(tab==='In-depth')return !!e.depth;
    return true;
  }

  function headerHTML(){
    return '<h2 class="wag-h">Week at a Glance</h2>'
      +'<div class="wag-lead">Here&rsquo;s the week at a glance &mdash; all our weekly classes and events. Tap an event to expand for more details. Please check the programme, or the calendar, as we do take breaks and not every class runs every week.</div>'
      +'<div class="wag-term">'+CAL_ICON+'<div>'
      +'<span class="line"><b>Autumn Term:</b> 22 Aug &ndash; 15 Dec <span class="ht">(half-term 8&ndash;15 Oct)</span></span>'
      +'<span class="line"><b>Spring Term:</b> from 2 Jan 2027</span>'
      +'</div></div>';
  }

  function buildHTML(){
    return '<div class="wag">'
      +headerHTML()
      +'<div class="wag-desktop">'
        +'<div class="toolbar"><button class="xall">Expand all &#9662;</button></div>'
        +'<div class="tbl">'+EVENTS.map(desktopRow).join('')+'</div>'
      +'</div>'
      +'<div class="wag-mobile">'
        +'<div class="m-tabs">'+TABS.map(function(t){return '<button class="m-tab">'+t+'</button>';}).join('')+'</div>'
        +'<div class="m-list"></div>'
      +'</div>'
    +'</div>';
  }

  function renderMobile(root,state){
    var list=root.querySelector('.m-list');
    root.querySelectorAll('.m-tab').forEach(function(b){b.classList.toggle('on',state && b.textContent===state);});
    if(!state){ /* teaser: first event, two ghosts, fade + nudge; tap to reveal All */
      list.className='m-list teaser';
      list.innerHTML=mobileRow(EVENTS[0])+mobileRow(EVENTS[1],'ghost')+mobileRow(EVENTS[2],'ghost2')
        +'<div class="m-fade"></div><div class="m-nudge"><span>&uarr; Pick a filter to explore</span></div>';
      list.onclick=function(){renderMobile(root,'All');};
      return;
    }
    list.className='m-list'; list.onclick=null;
    var rows=EVENTS.filter(function(e){return match(e,state);});
    list.innerHTML=(rows.length?rows.map(function(e){return mobileRow(e,null,true);}).join('')
      :'<div class="m-empty">Nothing in this filter.</div>')
      +'<div class="m-reset">&#8634; Reset</div>';
    list.querySelectorAll('.mrow.mx').forEach(function(row){
      row.addEventListener('click',function(ev){ if(ev.target.closest('a')) return; row.classList.toggle('open'); });
    });
    var rs=list.querySelector('.m-reset'); if(rs)rs.addEventListener('click',function(){renderMobile(root,null);});
  }

  function wire(root){
    /* desktop expand */
    root.querySelectorAll('.wag-desktop .rh').forEach(function(h){h.addEventListener('click',function(){h.parentNode.classList.toggle('open');});});
    var xall=root.querySelector('.xall');
    if(xall)xall.addEventListener('click',function(){var rows=root.querySelectorAll('.wag-desktop .r');var anyClosed=[].some.call(rows,function(r){return !r.classList.contains('open');});rows.forEach(function(r){r.classList.toggle('open',anyClosed);});this.textContent=anyClosed?'Collapse all &#9652;':'Expand all &#9662;';});
    /* mobile tabs */
    root.querySelectorAll('.m-tab').forEach(function(b){b.addEventListener('click',function(){renderMobile(root,b.textContent);});});
    renderMobile(root,null);
  }

  function init(){
    var mount=document.getElementById(MOUNT_ID); if(!mount) return;
    if(mount.getAttribute('data-akx-done')==='1') return;
    if(!document.getElementById('akx-glance-style')){var st=document.createElement('style');st.id='akx-glance-style';st.textContent=STYLE;document.head.appendChild(st);}
    mount.innerHTML=buildHTML(); mount.setAttribute('data-akx-done','1'); wire(mount);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
