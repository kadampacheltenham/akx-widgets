/* AKBC — Promotion planner (volunteer tool on /epc). v1.0.5 (22 Aug 2026)
 * Stub on the page:
 *   <div id="akx-promo"></div>
 *   <script src="https://kadampacheltenham.github.io/akx-widgets/epc-planner.js"><\/script>
 * Computes weekly promo suggestions from the live events sheets + a promotion log.
 * SHARED MODE (v1.0.1): endpoint + token built in — shared log/team/announcements
 * work out of the box; data-api/data-token on the stub div override if ever needed.
 * Weights: Special 8 · Headline (Hp Showcase) 4 · Featured 2 · Standard 1.
 * Runways: special 10/6/4/2/1 · talk & course 6/4/2/1 · free event 4/2/1 (weeks before).
 */
(function(){
var root=document.getElementById("akx-promo"); if(!root) return;

/* ---------- config ---------- */
var WE_SHEET="1g8VSqkv9zIR375RDf9R-B-34zMhsHXoZUxYZ"; // placeholder overwritten below
WE_SHEET="1g8VSqkv9zIR375RDf9R-B-34zMhsHXoUYx7ZYhuXlmk";
var WC_SHEET="1YArubV8QgCvPUIIvHOHWhCN2fYLRz0DDPSRSHD_tSmY";
var WEEKS_AHEAD=5;
var CAPS={enews:4,whatsapp:2,fbgroup:3,insta:2,fbpost:3,announce:3};
var CHAN_LABEL={enews:"eNews",whatsapp:"WhatsApp",fbpost:"FB post",fbgroup:"FB group",insta:"Insta",announce:"Announce"};
/* which channels suit which weeks-out (windows; refine later) */
var CHAN_WINDOW={enews:[10,6,4,2],insta:[10,6,4,2,1,0],fbpost:[2,1,0],fbgroup:[4,2,1],whatsapp:[2,1,0],announce:[4,2,1,0]};
var STAGE={10:"save the date",6:"save the date",4:"announcement + booking link",2:"two weeks — reminder",1:"one week — final push",0:"it’s this week!"};
var LSK="akx-promo-proto";

/* ---------- state (prototype: this device only) ---------- */
var LS={get:function(){try{return localStorage.getItem(LSK);}catch(e){return null;}},set:function(v){try{localStorage.setItem(LSK,v);}catch(e){}}};
var S=JSON.parse(LS.get()||"{}");
S.log=S.log||[];               // {ev,ch,wk,who,at}
S.team=S.team||["Guy (EPC)","Betsy"]; S.rota=S.rota||{};  // {name:[channels]}
S.ann=S.ann||{slots:["","",""]};
S.me=S.me||"";
function save(){LS.set(JSON.stringify(S));}
var API=root.dataset.api||"https://script.google.com/macros/s/AKfycbz3SDO43X4ZF6Tq489LrfUeqp13knlY4w3yWyZTLd7rZXIgtEbNh3zVwanfxlJTZXVwjQ/exec";
var TOK=root.dataset.token||"cf38d295b1";
function apiGet(cb){ if(!API){cb();return;} fetch(API+"?token="+encodeURIComponent(TOK)).then(function(r){return r.json();}).then(function(d){ if(d&&!d.error){
    var srv=d.log||[], local=S.log||[];
    if(!S.synced&&local.length){ // one-time: push ticks made before shared mode
      var have={}; srv.forEach(function(l){have[l.ev+"|"+l.ch+"|"+l.wk]=1;});
      local.forEach(function(l){ if(!have[l.ev+"|"+l.ch+"|"+l.wk]){ srv.push(l); apiPost({action:"tick",ev:l.ev,ch:l.ch,wk:l.wk,who:l.who||""}); } });
    }
    S.synced=1; S.log=srv; S.team=d.team||S.team; S.rota=d.rota||S.rota; S.ann=d.ann||S.ann; save(); } cb(); }).catch(function(){cb();});}
function apiPost(b,then){ if(!API){ if(then)then(); return; }
  fetch(API+"?token="+encodeURIComponent(TOK),{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify(b)})
    .then(function(r){return r.json();}).then(function(d){ if(d&&!d.error){ S.log=d.log||S.log; S.team=d.team||S.team; S.rota=d.rota||S.rota; S.ann=d.ann||S.ann; save(); } if(then)then(); }).catch(function(){ if(then)then(); });}

/* ---------- helpers ---------- */
function csv(t){var rows=[],row=[],cur="",q=false;for(var i=0;i<t.length;i++){var c=t[i];
  if(q){ if(c=='"'){ if(t[i+1]=='"'){cur+='"';i++;} else q=false;} else cur+=c; }
  else { if(c=='"')q=true; else if(c==","){row.push(cur);cur="";} else if(c=="\n"){row.push(cur);rows.push(row);row=[];cur="";} else if(c!="\r")cur+=c; } }
  if(cur||row.length){row.push(cur);rows.push(row);} return rows;}
function idx(head,name){name=name.toLowerCase();for(var i=0;i<head.length;i++)if(head[i].toLowerCase().trim()===name)return i;return -1;}
function dmy(s){ s=(s||"").trim(); var m=s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/); if(!m) return null;
  var y=m[3]?(+m[3]<100?2000+ +m[3]:+m[3]):(new Date()).getFullYear();
  var d=new Date(y,+m[2]-1,+m[1]); if(!m[3]&&d<new Date(Date.now()-45*864e5)) d=new Date(y+1,+m[2]-1,+m[1]); return d;}
function monday(d){d=new Date(d);var day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);d.setHours(0,0,0,0);return d;}
function fdate(d){return d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});}
function fwc(d){return "W/c Mon "+d.getDate()+" "+d.toLocaleDateString("en-GB",{month:"short"});}
function esc(s){return String(s||"").replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function yes(v){return /^y/i.test((v||"").trim());}
function wkKey(d){return d.toISOString().slice(0,10);}

/* ---------- classify ---------- */
function classify(ev){ // -> {cls, runway[], weight-base}
  var t=(ev.type||"").toLowerCase(), tag=(ev.tag||"").toLowerCase();
  var special=/retreat|silent|away|festival|open day/.test(t+" "+tag);
  var free=ev.free;
  if(special) return {cls:"special",run:[10,6,4,2,1,0],w:8};
  if(free) return {cls:"free",run:[4,2,1,0],w:1};
  return {cls:"std",run:[6,4,2,1,0],w:1};
}
function weight(ev){ var c=classify(ev); if(c.cls==="special") return 8; return ev.hp?4:(ev.feat?2:1); }
function tierBadge(ev){ if(ev.hp) return '<span class="pp-tag pp-head">★ HEADLINE</span>'; if(ev.feat) return '<span class="pp-tag pp-feat">☆ FEATURED</span>'; return ""; }
function typeTag(ev){ var t=(ev.type||"Event"); return '<span class="pp-tag pp-ty">'+esc(t.toUpperCase())+'</span>'; }

/* ---------- engine ---------- */
function touchesFor(ev){ // [{wo(weeks out), chans[], stage}]
  var c=classify(ev), out=[];
  c.run.forEach(function(wo){
    var chans=[];
    for(var ch in CHAN_WINDOW) if(CHAN_WINDOW[ch].indexOf(wo)>-1) chans.push(ch);
    out.push({wo:wo,chans:chans,stage:STAGE[wo]||""});
  });
  return out;
}
function logged(ev,ch,wk){ return S.log.some(function(l){return l.ev===ev.id&&l.ch===ch&&l.wk===wk;}); }
function loggedAny(ev){ return S.log.filter(function(l){return l.ev===ev.id;}).length; }

function build(events){
  var now=monday(new Date());
  var weeks=[]; for(var i=WEEKS_AHEAD;i>=0;i--){ var d=new Date(now); d.setDate(d.getDate()+7*i); weeks.push(d); }
  var model=weeks.map(function(wd){
    var wk=wkKey(wd), rows=[], count=0;
    events.forEach(function(ev){
      if(!ev.date) return;
      var wo=Math.round((monday(ev.date)-wd)/(7*864e5));
      if(wo<0||wo>Math.max.apply(null,classify(ev).run)) return;
      count++;
      var t=touchesFor(ev).filter(function(x){return x.wo===wo;})[0];
      var missed = touchesFor(ev).filter(function(x){return x.wo>wo;}).length>0 && loggedAny(ev)===0 && wkKey(wd)===wkKey(now);
      rows.push({ev:ev,wo:wo,touch:t,missed:missed});
    });
    rows.sort(function(a,b){ return weight(b.ev)-weight(a.ev) || a.ev.date-b.ev.date; });
    return {wd:wd,wk:wk,rows:rows,count:count,current:wkKey(wd)===wkKey(now)};
  });
  return model;
}

/* ---------- render ---------- */
function chip(ev,ch,wk,extra){
  var done=logged(ev,ch,wk);
  var who=(S.log.filter(function(l){return l.ev===ev.id&&l.ch===ch&&l.wk===wk;})[0]||{}).who;
  return '<span class="pp-act'+(done?' pp-done':'')+'" data-ev="'+esc(ev.id)+'" data-ch="'+ch+'" data-wk="'+wk+'">'
    +'<span class="pp-bx"></span>'+CHAN_LABEL[ch]+(extra?' · '+esc(extra):'')
    +(who?' <span class="pp-who">'+esc(who.toUpperCase())+'</span>':'')+'</span>';
}
function render(model,events){
  var now=monday(new Date());
  var whoSel='<span class="pp-whoSel">You are: <select id="pp-me"><option value="">choose…</option>'
    +S.team.map(function(n){return '<option'+(S.me===n?' selected':'')+'>'+esc(n)+'</option>';}).join("")
    +'</select></span>';
  var h='<div class="pp-head-row"><h2>Promotion planner</h2></div>';
  model.forEach(function(w){
    if(!w.current){
      var busy=w.rows.filter(function(r){return r.touch;}).length> (CAPS.whatsapp+CAPS.insta+CAPS.fbgroup);
      h+='<div class="pp-wk" data-wk="'+w.wk+'"><span><b>'+fwc(w.wd)+'</b> <span class="pp-d">· '+w.count+' event'+(w.count!==1?'s':'')+' on runway</span>'+(busy?' <span class="pp-load">· busy week</span>':'')+'</span><span class="pp-ch">▸</span></div>'
      +'<div class="pp-wkbody" data-wkb="'+w.wk+'" style="display:none"></div>';
      return;
    }
    h+='<div class="pp-head-row" style="margin-top:10px"><span></span>'+whoSel+'</div>'
      +'<p class="pp-sub" style="margin:4px 0 8px">Suggestions computed from the events sheets & what’s been logged — tick as things go out; the plan flexes. <b id="pp-mode"></b></p>'
      +'<div class="pp-now"><div class="pp-nowhead"><b>THIS WEEK · '+fwc(w.wd)+'</b><span>'
      +w.rows.filter(function(r){return r.touch;}).length+' events with suggested actions</span></div>';
    /* announcements strip: slot 1 blank for Guy; 2-3 pre-suggested; blanks auto-fill at Mon 12:30 send */
    var sugs=w.rows.slice(0,6).map(function(r){return r.ev.title;});
    var slots=(S.ann&&S.ann.slots)||["","",""];
    var isGuy=/^guy/i.test(S.me||"");
    var nm=new Date(); nm.setDate(nm.getDate()+((8-nm.getDay())%7||7)); nm.setHours(12,0,0,0);
    if(nm-new Date()<0) nm.setDate(nm.getDate()+7);
    var ms=nm-new Date(), cd=Math.floor(ms/864e5)+'d '+Math.floor(ms%864e5/36e5)+'h';
    var cdc=ms<36*36e5?'pp-cd-r':(ms<60*36e5?'pp-cd-a':'pp-cd-g');
    h+='<div class="pp-ann"><div class="pp-annhead"><b>\u{1F4E3} Weekly class announcements — emailed Mon 12 noon to info@ & teacher@</b><span class="pp-cd '+cdc+'">\u23F0 sends in '+cd+'</span></div><div class="pp-annrow">';
    for(var i=0;i<3;i++){
      var val=slots[i]||"", dflt=i>0?(sugs[i-1]||""):"";
      if(isGuy){
        h+='<span class="pp-annslot">'+(i+1)+'. <select class="pp-annsel" data-i="'+i+'">'
          +'<option value=""'+(val?'':' selected')+'>'+(i===0?'— your pick, Guy —':(dflt?'(suggested) '+esc(dflt):'— choose —'))+'</option>'
          +sugs.map(function(t){return '<option'+(val===t?' selected':'')+'>'+esc(t)+'</option>';}).join("")
          +'<option value="__other"'+(val&&sugs.indexOf(val)<0?' selected':'')+'>'+(val&&sugs.indexOf(val)<0?esc(val):'Other (type it)…')+'</option>'
          +'</select></span>';
      } else {
        h+='<span class="pp-annslot">'+(i+1)+'. '+(val?esc(val):(i===0?'<i>Guy to choose</i>':(dflt?'(suggested) '+esc(dflt):'—')))+'</span>';
      }
    }
    h+='</div><span class="pp-annnote">Blank slots auto-fill from the top suggestions at send time, so something always goes out.</span></div>';
    /* events-promoted result pills: n of target, 5-segment bar */
    var t7=Date.now()-7*864e5, t30=Date.now()-30*864e5, target=Math.max(w.count,1);
    function promoted(since){ var seen={}; S.log.forEach(function(l){ var t=Date.parse(l.at||""); if(t>=since) seen[l.ev]=1; }); return Object.keys(seen).length; }
    function spill(label,n,cls){ var pct=Math.min(100,Math.round(n/target*100)), fill=Math.round(pct/20), segs="";
      for(var i2=0;i2<5;i2++) segs+='<i class="'+(i2<fill?'pp-on':'')+'"></i>';
      return '<div class="pp-spill '+cls+'"><span class="pp-spn">'+n+'</span><span class="pp-spl">events promoted<br>'+label+' \u00b7 '+n+' of '+target+'</span><span class="pp-segs">'+segs+'</span><span class="pp-pct">'+pct+'%</span></div>'; }
    h+='<div class="pp-stats">'+spill("7 days",promoted(t7),"pp-s7")+spill("30 days",promoted(t30),"pp-s30")+'</div>';
    /* capacity meters (tally of what's gone out this week) */
    function used(ch){ return S.log.filter(function(l){return l.ch===ch&&l.wk===w.wk;}).length; }
    h+='<div class="pp-caps">'+["enews","whatsapp","fbgroup","insta"].map(function(ch){
      var u=used(ch),c=CAPS[ch];
      return '<div class="pp-capbox"><b>'+CHAN_LABEL[ch]+(ch==="enews"?" (next issue)":" this wk")+'</b><div class="pp-meter"><i style="width:'+Math.min(100,u/c*100)+'%"></i></div><span>'+u+' of '+c+'</span></div>';}).join("")+'</div>';

    w.rows.forEach(function(r){
      var ev=r.ev, cls= r.missed?'pp-ev pp-warn' : (r.touch?'pp-ev':'pp-ev pp-quiet');
      h+='<div class="'+cls+'"><div class="pp-evtop"><b>'+esc(ev.title)+'</b>'+typeTag(ev)+tierBadge(ev)+'</div>';
      var meta=fdate(ev.date)+' · '+r.wo+' wk'+(r.wo!==1?'s':'')+' away';
      if(r.missed) meta+=' · <span class="pp-warnnote">⚠ behind plan — no mentions logged yet; early mentions matter most</span>';
      else if(r.touch) meta+=' · <span class="pp-stage">'+esc(r.touch.stage)+'</span>';
      else meta+=' · <span class="pp-quietnote">on runway — nothing due this week — promote early if space allows</span>';
      h+='<div class="pp-meta">'+meta+'</div>';
      h+='<div class="pp-copy">Copy for socials: <a data-cp="1" data-ev="'+esc(ev.id)+'">blurb</a> · <a data-cp="2" data-ev="'+esc(ev.id)+'">+ what to expect</a> · <a data-cp="3" data-ev="'+esc(ev.id)+'">+ price & booking</a> · <a data-cp="3i" data-ev="'+esc(ev.id)+'">Insta version</a>'
        +' · <a data-gfx="'+esc(ev.id)+'">get graphic \u2193</a>'
        +(ev.tid?' · <a href="https://raw.githubusercontent.com/kadampacheltenham/akx-widgets/main/images/teachers/'+esc(ev.tid)+'.jpg" target="_blank" rel="noopener">teacher photo</a>':'')+'</div>';
      var chans=r.touch?r.touch.chans:(r.missed?["enews","insta"]:[]);
      if(chans.length){ h+='<div class="pp-acts">'+chans.filter(function(c){return c!=="announce";}).map(function(c){return chip(ev,c,w.wk);}).join("")+'</div>'; }
      h+='</div>';
    });
    /* team panel for Guy */
    if(/^guy/i.test(S.me||"")){
      h+='<div class="pp-team"><b>Team & rota (visible to Guy)</b><div class="pp-teamrow">'
        +S.team.map(function(n){return '<span class="pp-member">'+esc(n)+' <input class="pp-rota" data-n="'+esc(n)+'" placeholder="channels e.g. eNews, Insta" value="'+esc((S.rota[n]||[]).join(", "))+'"></span>';}).join("")
        +'<button id="pp-add">+ add person</button></div></div>';
    }
    h+='</div>';
  });
  root.querySelector(".pp-body").innerHTML=h;
}

/* ---------- shell + styles ---------- */
root.innerHTML='<style>'
+'#akx-promo{font-family:Inter,-apple-system,Segoe UI,Roboto,sans-serif;color:#1F2A3C;max-width:1000px;margin:0 auto;background:#fbfaf8;border-radius:12px;padding:24px 26px;}'
+'#akx-promo h2{font-size:24px;font-weight:700;color:#2b4c70;margin:0 0 14px;}'
+'#akx-promo .pp-head-row{display:flex;justify-content:space-between;align-items:center;}'
+'#akx-promo .pp-whoSel{font-size:13px;font-weight:600;color:#2b4c70;}'
+'#akx-promo .pp-whoSel select{font:inherit;border:1.4px solid #C9D4E2;border-radius:999px;padding:5px 10px;background:#fff;color:#2b4c70;}'
+'#akx-promo .pp-sub{font-size:13.5px;color:#7A8797;margin:4px 0 18px;}'
+'#akx-promo .pp-wk{background:#fff;border:1px solid #E7E1D5;border-radius:10px;margin-bottom:8px;padding:11px 16px;display:flex;justify-content:space-between;align-items:center;color:#4a5a6e;cursor:pointer;}'
+'#akx-promo .pp-wk b{font-size:14.5px;font-weight:600;} #akx-promo .pp-d{font-size:13px;color:#9aa0a6;} #akx-promo .pp-ch{color:#9aa0a6;font-size:13px;} #akx-promo .pp-load{font-size:12px;color:#B5771E;font-weight:500;}'
+'#akx-promo .pp-wkbody{padding:4px 8px 12px;}'
+'#akx-promo .pp-now{background:#fff;border:2px solid #2b4c70;border-radius:12px;padding:16px 18px;margin-top:4px;}'
+'#akx-promo .pp-nowhead{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;} #akx-promo .pp-nowhead b{font-size:16px;font-weight:700;color:#2b4c70;} #akx-promo .pp-nowhead span{font-size:12.5px;color:#9aa0a6;}'
+'#akx-promo .pp-ann{font-size:12.5px;color:#3d4d61;background:#EDF3F9;border:1px solid #CBDCEC;border-radius:9px;padding:9px 13px;margin-bottom:12px;} #akx-promo .pp-annnote{color:#8a93a3;font-style:italic;display:block;margin-top:4px;}'
+'#akx-promo .pp-annrow{display:flex;gap:12px;flex-wrap:wrap;margin-top:6px;} #akx-promo .pp-annslot{font-weight:600;} #akx-promo .pp-annsel{font:inherit;font-size:12px;border:1px solid #CBDCEC;border-radius:7px;padding:3px 6px;background:#fff;color:#2b4c70;max-width:260px;}'
+'#akx-promo .pp-ev{border:1px solid #EAE6DC;border-radius:10px;padding:12px 14px;margin-bottom:10px;background:#fff;}'
+'#akx-promo .pp-ev.pp-quiet{background:#FAF9F6;border-style:dashed;} #akx-promo .pp-ev.pp-warn{border-color:#E0B25C;background:#FCF7EC;}'
+'#akx-promo .pp-evtop{display:flex;gap:8px;align-items:center;flex-wrap:wrap;} #akx-promo .pp-evtop b{font-size:14.5px;font-weight:600;}'
+'#akx-promo .pp-tag{font-size:10px;font-weight:700;letter-spacing:.05em;padding:3px 8px;border-radius:999px;}'
+'#akx-promo .pp-ty{background:#EDEAE2;color:#6b7889;} #akx-promo .pp-head{background:#B5771E;color:#fff;} #akx-promo .pp-feat{background:#fff;color:#B5771E;border:1.4px solid #B5771E;}'
+'#akx-promo .pp-meta{font-size:12px;color:#8a93a3;margin:3px 0 9px;} #akx-promo .pp-stage{color:#227A72;font-weight:600;} #akx-promo .pp-warnnote{color:#A3701B;font-weight:600;} #akx-promo .pp-quietnote{color:#9aa0a6;font-style:italic;}'
+'#akx-promo .pp-acts{display:flex;gap:7px;flex-wrap:wrap;}'
+'#akx-promo .pp-act{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;border:1.4px solid #C9D4E2;color:#2b4c70;border-radius:999px;padding:5px 11px;background:#fff;cursor:pointer;user-select:none;}'
+'#akx-promo .pp-bx{width:13px;height:13px;border:1.6px solid #9FB0C4;border-radius:3.5px;display:inline-block;position:relative;}'
+'#akx-promo .pp-done{background:#EAF4EF;border-color:#9CC7B2;color:#2E6B4F;} #akx-promo .pp-done .pp-bx{background:#2E6B4F;border-color:#2E6B4F;} #akx-promo .pp-done .pp-bx:after{content:"✓";color:#fff;font-size:10px;position:absolute;left:1.5px;top:-2.5px;}'
+'#akx-promo .pp-who{font-size:10.5px;font-weight:600;color:#fff;background:#7A8797;border-radius:999px;padding:2px 7px;}'
+'#akx-promo .pp-caps{display:flex;gap:10px;margin:12px 0 18px;flex-wrap:wrap;} #akx-promo .pp-capbox{flex:1;min-width:120px;background:#F6F3EC;border-radius:9px;padding:9px 12px;} #akx-promo .pp-capbox b{font-size:11.5px;font-weight:600;color:#4a5a6e;display:block;margin-bottom:5px;} #akx-promo .pp-meter{height:7px;border-radius:999px;background:#E4DFD2;overflow:hidden;} #akx-promo .pp-meter i{display:block;height:100%;border-radius:999px;background:#2b4c70;} #akx-promo .pp-capbox span{font-size:10.5px;color:#9aa0a6;}'
+'#akx-promo .pp-team{margin-top:14px;background:#F6F3EC;border-radius:9px;padding:10px 13px;font-size:12px;color:#4a5a6e;} #akx-promo .pp-team b{display:block;margin-bottom:6px;} #akx-promo .pp-teamrow{display:flex;gap:10px;flex-wrap:wrap;align-items:center;} #akx-promo .pp-member{font-weight:600;} #akx-promo .pp-rota{font:inherit;font-size:11.5px;border:1px solid #D9D2C4;border-radius:7px;padding:4px 8px;margin-left:5px;width:180px;} #akx-promo .pp-team button{font:inherit;font-size:11.5px;font-weight:600;border:0;border-radius:999px;padding:5px 12px;background:#2b4c70;color:#fff;cursor:pointer;}'
+'#akx-promo .pp-annhead{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;}'
+'#akx-promo .pp-stats{display:flex;gap:12px;justify-content:center;margin:16px 0 4px;flex-wrap:wrap;}'
+'#akx-promo .pp-spill{display:flex;align-items:center;gap:12px;border-radius:999px;padding:9px 20px;flex:1;min-width:250px;max-width:360px;}'
+'#akx-promo .pp-s7{background:#EAF4EF;color:#227A72;} #akx-promo .pp-s30{background:#F7EEDC;color:#8a5c12;}'
+'#akx-promo .pp-spn{font-size:26px;font-weight:700;line-height:1;}'
+'#akx-promo .pp-spl{font-size:10px;line-height:1.35;color:inherit;opacity:.85;font-weight:600;}'
+'#akx-promo .pp-segs{display:flex;gap:3px;margin-left:auto;}'
+'#akx-promo .pp-segs i{width:20px;height:9px;border-radius:5px;background:rgba(0,0,0,.10);display:inline-block;}'
+'#akx-promo .pp-segs i.pp-on{background:currentColor;}'
+'#akx-promo .pp-pct{font-size:13px;font-weight:700;}'
+'#akx-promo .pp-cd{font-size:13.5px;font-weight:700;border-radius:999px;padding:6px 14px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.08);}'
+'@keyframes ppPulse{50%{opacity:.55}} #akx-promo .pp-cd-r{animation:ppPulse 1.2s infinite;}'
+'#akx-promo .pp-cd-g{background:#EAF4EF;color:#2E6B4F;} #akx-promo .pp-cd-a{background:#FBF3DC;color:#8a6d1f;} #akx-promo .pp-cd-r{background:#F9E3DC;color:#A33B1E;}'
+'#akx-promo .pp-copy{font-size:11.5px;color:#8a93a3;margin-top:8px;} #akx-promo .pp-copy a{color:#2A66A6;cursor:pointer;text-decoration:underline;}'
+'#akx-promo .pp-modal{position:fixed;inset:0;background:rgba(31,42,60,.45);display:flex;align-items:center;justify-content:center;z-index:9999;}'
+'#akx-promo .pp-mbox{background:#fff;border-radius:12px;padding:18px;width:min(560px,92vw);box-shadow:0 12px 40px rgba(0,0,0,.25);}'
+'#akx-promo .pp-mbox b{font-size:14px;color:#2b4c70;} #akx-promo .pp-mbox textarea{width:100%;box-sizing:border-box;height:260px;font:13px/1.5 Inter,sans-serif;border:1px solid #D9D2C4;border-radius:8px;padding:10px;margin:10px 0;color:#1F2A3C;}'
+'#akx-promo .pp-mbtns{display:flex;gap:8px;justify-content:flex-end;} #akx-promo .pp-mbtns button{font:600 13px Inter,sans-serif;border:0;border-radius:999px;padding:8px 16px;cursor:pointer;} #akx-promo .pp-mcopy{background:#2b4c70;color:#fff;} #akx-promo .pp-mclose{background:#EDEAE2;color:#4a5a6e;}'
+'@media(max-width:640px){#akx-promo{padding:14px 12px;} #akx-promo .pp-head-row{flex-direction:column;align-items:flex-start;gap:6px;}'
+' #akx-promo .pp-act{padding:9px 14px;font-size:13px;} #akx-promo .pp-copy{font-size:12.5px;line-height:2.1;} #akx-promo .pp-annsel{max-width:100%;width:100%;} #akx-promo .pp-annslot{width:100%;} #akx-promo .pp-mbox textarea{height:200px;} #akx-promo .pp-capbox{min-width:44%;}}'
+'</style><div class="pp-body"><p style="color:#9aa0a6;font-size:13px">Loading events…</p></div>';

/* ---------- events from sheets ---------- */
function fetchCSV(id,sheet){return fetch("https://docs.google.com/spreadsheets/d/"+id+"/gviz/tq?tqx=out:csv&headers=1&sheet="+encodeURIComponent(sheet)).then(function(r){return r.text();}).then(csv);}
Promise.all([fetchCSV(WE_SHEET,"Events"),fetchCSV(WC_SHEET,"Talks & series"),fetchCSV(WC_SHEET,"Class times")]).then(function(res){
  var E=res[0],T=res[1],C=res[2],events=[];
  var eh=E[0];
  var eI={id:idx(eh,"event id"),t:idx(eh,"title"),ty:idx(eh,"event type"),tag:idx(eh,"event tag"),d:idx(eh,"date"),free:idx(eh,"free"),f:idx(eh,"featured"),hp:idx(eh,"hp showcase"),st:idx(eh,"status"),loc:idx(eh,"location"),tm:idx(eh,"time"),sum:idx(eh,"summary"),tid:idx(eh,"teacher id"),wte:idx(eh,"what to expect"),fee:idx(eh,"fee"),disc:idx(eh,"discounts"),bk:idx(eh,"booking link")};
  E.slice(1).forEach(function(r){ if(!r[eI.id]) return; if(/draft/i.test(r[eI.st]||"")) return;
    var d=dmy(r[eI.d]); if(!d||d<new Date()) return;
    events.push({id:r[eI.id],title:r[eI.t],type:r[eI.ty],tag:r[eI.tag],date:d,free:yes(r[eI.free]),feat:yes(r[eI.f]),hp:yes(r[eI.hp]),
      loc:r[eI.loc]||"",time:r[eI.tm]||"",tid:(r[eI.tid]||"").trim(),desc:r[eI.sum]||"",wte:r[eI.wte]||"",fee:r[eI.fee]||"",disc:r[eI.disc]||"",book:r[eI.bk]||""});
  });
  var th=T[0], tI={id:idx(th,"id"),t:idx(th,"title"),ty:idx(th,"type"),f:idx(th,"featured"),hp:idx(th,"hp showcase"),st:idx(th,"status"),desc:idx(th,"description"),wte:idx(th,"what_to_expect"),disc:idx(th,"discount_note")};
  var ch=C[0], cI={id:idx(ch,"id"),dates:idx(ch,"dates"),tm:idx(ch,"time"),loc:idx(ch,"location"),pc:idx(ch,"price_class"),ps:idx(ch,"price_series"),bk:idx(ch,"booking_url")};
  var firstDate={}, cInfo={};
  C.slice(1).forEach(function(r){ (r[cI.dates]||"").split(",").forEach(function(ds){ var d=dmy(ds); if(d&&d>=new Date()&&(!firstDate[r[cI.id]]||d<firstDate[r[cI.id]])) firstDate[r[cI.id]]=d; });
    if(!cInfo[r[cI.id]]) cInfo[r[cI.id]]={time:r[cI.tm]||"",loc:r[cI.loc]||"",fee:r[cI.pc]||"",series:r[cI.ps]||"",book:r[cI.bk]||""}; });
  T.slice(1).forEach(function(r){ if(!r[tI.id]) return; if(/draft/i.test(r[tI.st]||"")) return;
    var d=firstDate[r[tI.id]]; if(!d) return;
    var ci=cInfo[r[tI.id]]||{};
    events.push({id:r[tI.id],title:r[tI.t],type:r[tI.ty],tag:"",date:d,free:/free/i.test(r[tI.ty]||""),feat:yes(r[tI.f]),hp:yes(r[tI.hp]),
      loc:ci.loc||"",time:ci.time||"",desc:r[tI.desc]||"",wte:r[tI.wte]||"",fee:ci.fee||(ci.series?"":""),disc:r[tI.disc]||"",book:ci.book||"",series:ci.series||""});
  });
  var lastSug="";
  function paint(){ var model=build(events); render(model,events);
    var cur=model.filter(function(w){return w.current;})[0];
    if(cur&&API){ var sug=cur.rows.slice(0,6).map(function(r){return r.ev.title;}); var key=sug.join("|");
      if(key!==lastSug){ lastSug=key; apiPost({action:"sug",sug:sug}); } } }
  apiGet(function(){ paint(); var m=document.getElementById("pp-mode"); if(m) m.textContent=API?"Shared mode \u2014 everyone sees the same ticks.":"Prototype: ticks save on this device only."; });
  var evById={}; events.forEach(function(ev){evById[ev.id]=ev;});
  function postText(ev,lv,insta){
    var out=[ev.title];
    var dl=fdate(ev.date); if(ev.time) dl+=", "+ev.time; if(ev.loc) dl+=" \u00b7 "+ev.loc;
    out.push(dl,"");
    if(ev.desc) out.push(ev.desc,"");
    if(lv>=2&&ev.wte) out.push("What to expect: "+ev.wte,"");
    if(lv>=3){
      var pl=[]; if(ev.free) pl.push("Free \u2014 everyone welcome"); else if(ev.fee) pl.push(ev.fee+(ev.series?" / series "+ev.series:""));
      if(ev.disc) pl.push(ev.disc);
      if(pl.length) out.push(pl.join(" \u00b7 "));
      if(insta) out.push("Book via our website \u2014 link in bio");
      else if(ev.book) out.push("Book: "+ev.book);
      else out.push("Details & booking: www.meditationincheltenham.org.uk");
      out.push("");
    }
    return out.join("\n").replace(/\n{3,}/g,"\n\n").trim();
  }
  function openModal(ev,lv,insta){
    var od=document.createElement("div"); od.className="pp-modal";
    od.innerHTML='<div class="pp-mbox"><b>'+esc(ev.title)+' \u2014 edit, then copy'+(insta?' (Insta \u2014 no links)':'')+'</b>'
      +'<textarea id="pp-mtext"></textarea><div class="pp-mbtns"><button class="pp-mclose">Close</button><button class="pp-mcopy">Copy</button></div></div>';
    root.appendChild(od);
    od.querySelector("#pp-mtext").value=postText(ev,lv,insta);
    od.addEventListener("click",function(e){ if(e.target===od||e.target.classList.contains("pp-mclose")) od.remove();
      if(e.target.classList.contains("pp-mcopy")){ var t=od.querySelector("#pp-mtext");
        (navigator.clipboard?navigator.clipboard.writeText(t.value):Promise.reject()).then(function(){},function(){ t.select(); document.execCommand("copy"); });
        e.target.textContent="Copied \u2713"; setTimeout(function(){ od.remove(); },700); } });
  }
  root.addEventListener("change",function(e){
    if(e.target.id==="pp-me"){S.me=e.target.value;save();paint();}
    if(e.target.classList.contains("pp-rota")){S.rota[e.target.dataset.n]=e.target.value.split(",").map(function(x){return x.trim();}).filter(Boolean);save();apiPost({action:"rota",rota:S.rota});}
    if(e.target.classList.contains("pp-annsel")){
      var i2=+e.target.dataset.i, v2=e.target.value;
      if(v2==="__other"){ v2=prompt("Announcement text (can be anything \u2014 memberships, WhatsApp channel\u2026):")||""; }
      S.ann.slots[i2]=v2; save(); paint(); apiPost({action:"ann",ann:S.ann},paint); }
  });
  root.addEventListener("click",function(e){
    var cp=e.target.closest("[data-cp]");
    if(cp){ var ev2=evById[cp.dataset.ev]; if(ev2) openModal(ev2, parseInt(cp.dataset.cp), /i$/.test(cp.dataset.cp)); return; }
    var gx=e.target.closest("[data-gfx]");
    if(gx){ var ev3=evById[gx.dataset.ev];
      if(ev3){ var ty=(ev3.type||"").toLowerCase(), g= /talk/.test(ty)?"talk": /course/.test(ty)?"course": /retreat|away/.test(ty)?"retreat": /silent|depth/.test(ty)?"study": ev3.free?"free":"special";
        try{ location.hash="egm="+encodeURIComponent(JSON.stringify({ty:g,t:ev3.title,d:fdate(ev3.date)+(ev3.time?" \u00b7 "+ev3.time:""),loc:ev3.loc||""})); }catch(err){}
        var tgt=document.getElementById("akx-egm"); if(tgt) tgt.scrollIntoView({behavior:"smooth"}); }
      return; }
    var act=e.target.closest(".pp-act");
    if(act){ var ev=act.dataset.ev,ch2=act.dataset.ch,wk=act.dataset.wk;
      var i=S.log.findIndex(function(l){return l.ev===ev&&l.ch===ch2&&l.wk===wk;});
      if(i>-1) S.log.splice(i,1);
      else { if(!S.me){alert("Choose who you are (top right) first — ticks are signed.");return;}
        S.log.push({ev:ev,ch:ch2,wk:wk,who:S.me,at:new Date().toISOString()}); }
      save();paint();return; }
    var wkhdr=e.target.closest(".pp-wk");
    if(wkhdr){ var b=root.querySelector('[data-wkb="'+wkhdr.dataset.wk+'"]');
      if(b){ var open=b.style.display!=="none"; b.style.display=open?"none":"block";
        if(!open&&!b.innerHTML){ b.innerHTML='<p style="font-size:12.5px;color:#9aa0a6;margin:6px 4px">Preview — suggested touches for this week appear here; full detail lands when the week becomes current.</p>'; } } return; }
    if(e.target.id==="pp-add"){ var n=prompt("Name of new team member:"); if(n){S.team.push(n.trim());save();paint();apiPost({action:"team",team:S.team});} }
  });
}).catch(function(err){ root.querySelector(".pp-body").innerHTML='<p style="color:#A3701B;font-size:13px">Couldn’t load the events sheets — check they’re published & shared. ('+esc(err.message)+')</p>'; });
})();
