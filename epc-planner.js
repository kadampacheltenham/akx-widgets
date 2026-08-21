/* AKBC — Promotion planner (volunteer tool on /epc). PROTOTYPE v0.9 (21 Aug 2026)
 * Stub on the page:
 *   <div id="akx-promo"></div>
 *   <script src="https://kadampacheltenham.github.io/akx-widgets/epc-planner.js"><\/script>
 * Computes weekly promo suggestions from the live events sheets + a promotion log.
 * PROTOTYPE NOTE: ticks/log/team are saved in this browser only (localStorage).
 * The build step swaps localStorage for a shared Apps Script endpoint.
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
S.team=S.team||["Guy","Sarah"]; S.rota=S.rota||{};  // {name:[channels]}
S.me=S.me||"";
function save(){LS.set(JSON.stringify(S));}

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
  var h='<div class="pp-head-row"><h2>Promotion planner</h2>'
    +'<span class="pp-whoSel">You are: <select id="pp-me"><option value="">choose…</option>'
    +S.team.map(function(n){return '<option'+(S.me===n?' selected':'')+'>'+esc(n)+'</option>';}).join("")
    +'</select></span></div>'
    +'<p class="pp-sub">Suggestions computed from the events sheets & what’s been logged — tick as things go out; the plan flexes. <b>Prototype: ticks save on this device only.</b></p>';
  model.forEach(function(w){
    if(!w.current){
      var busy=w.rows.filter(function(r){return r.touch;}).length> (CAPS.whatsapp+CAPS.insta+CAPS.fbgroup);
      h+='<div class="pp-wk" data-wk="'+w.wk+'"><span><b>'+fwc(w.wd)+'</b> <span class="pp-d">· '+w.count+' event'+(w.count!==1?'s':'')+' on runway</span>'+(busy?' <span class="pp-load">· busy week</span>':'')+'</span><span class="pp-ch">▸</span></div>'
      +'<div class="pp-wkbody" data-wkb="'+w.wk+'" style="display:none"></div>';
      return;
    }
    h+='<div class="pp-now"><div class="pp-nowhead"><b>THIS WEEK · '+fwc(w.wd)+'</b><span>'
      +w.rows.filter(function(r){return r.touch;}).length+' events with suggested actions</span></div>';
    /* announcements strip */
    var top3=w.rows.slice(0,3).map(function(r){return esc(r.ev.title);});
    h+='<div class="pp-ann"><b>\u{1F4E3} Class announcements (Mon 12:30 email → info@ & teacher@):</b> '
      +(top3.length?top3.join(" · "):"nothing on runway")
      +' <span class="pp-annnote">auto-suggested · Guy can adjust or add non-event items (build step 2)</span></div>';
    w.rows.forEach(function(r){
      var ev=r.ev, cls= r.missed?'pp-ev pp-warn' : (r.touch?'pp-ev':'pp-ev pp-quiet');
      h+='<div class="'+cls+'"><div class="pp-evtop"><b>'+esc(ev.title)+'</b>'+typeTag(ev)+tierBadge(ev)+'</div>';
      var meta=fdate(ev.date)+' · '+r.wo+' wk'+(r.wo!==1?'s':'')+' away';
      if(r.missed) meta+=' · <span class="pp-warnnote">⚠ behind plan — no mentions logged yet; early mentions matter most</span>';
      else if(r.touch) meta+=' · <span class="pp-stage">'+esc(r.touch.stage)+'</span>';
      else meta+=' · <span class="pp-quietnote">on runway — nothing due this week — promote early if space allows</span>';
      h+='<div class="pp-meta">'+meta+'</div>';
      var chans=r.touch?r.touch.chans:(r.missed?["enews","insta"]:[]);
      if(chans.length){ h+='<div class="pp-acts">'+chans.filter(function(c){return c!=="announce";}).map(function(c){return chip(ev,c,w.wk);}).join("")+'</div>'; }
      h+='</div>';
    });
    /* capacity meters */
    function used(ch){ return S.log.filter(function(l){return l.ch===ch&&l.wk===w.wk;}).length; }
    h+='<div class="pp-caps">'+["enews","whatsapp","fbgroup","insta"].map(function(ch){
      var u=used(ch),c=CAPS[ch];
      return '<div class="pp-capbox"><b>'+CHAN_LABEL[ch]+(ch==="enews"?" (next issue)":" this wk")+'</b><div class="pp-meter"><i style="width:'+Math.min(100,u/c*100)+'%"></i></div><span>'+u+' of '+c+'</span></div>';}).join("")+'</div>';
    /* team panel for Guy */
    if(S.me==="Guy"){
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
+'#akx-promo h2{font-size:24px;font-weight:700;color:#2b4c70;margin:0;}'
+'#akx-promo .pp-head-row{display:flex;justify-content:space-between;align-items:center;}'
+'#akx-promo .pp-whoSel{font-size:13px;font-weight:600;color:#2b4c70;}'
+'#akx-promo .pp-whoSel select{font:inherit;border:1.4px solid #C9D4E2;border-radius:999px;padding:5px 10px;background:#fff;color:#2b4c70;}'
+'#akx-promo .pp-sub{font-size:13.5px;color:#7A8797;margin:4px 0 18px;}'
+'#akx-promo .pp-wk{background:#fff;border:1px solid #E7E1D5;border-radius:10px;margin-bottom:8px;padding:11px 16px;display:flex;justify-content:space-between;align-items:center;color:#4a5a6e;cursor:pointer;}'
+'#akx-promo .pp-wk b{font-size:14.5px;font-weight:600;} #akx-promo .pp-d{font-size:13px;color:#9aa0a6;} #akx-promo .pp-ch{color:#9aa0a6;font-size:13px;} #akx-promo .pp-load{font-size:12px;color:#B5771E;font-weight:500;}'
+'#akx-promo .pp-wkbody{padding:4px 8px 12px;}'
+'#akx-promo .pp-now{background:#fff;border:2px solid #2b4c70;border-radius:12px;padding:16px 18px;margin-top:4px;}'
+'#akx-promo .pp-nowhead{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;} #akx-promo .pp-nowhead b{font-size:16px;font-weight:700;color:#2b4c70;} #akx-promo .pp-nowhead span{font-size:12.5px;color:#9aa0a6;}'
+'#akx-promo .pp-ann{font-size:12.5px;color:#3d4d61;background:#EDF3F9;border:1px solid #CBDCEC;border-radius:9px;padding:9px 13px;margin-bottom:12px;} #akx-promo .pp-annnote{color:#8a93a3;font-style:italic;}'
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
+'#akx-promo .pp-caps{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;} #akx-promo .pp-capbox{flex:1;min-width:120px;background:#F6F3EC;border-radius:9px;padding:9px 12px;} #akx-promo .pp-capbox b{font-size:11.5px;font-weight:600;color:#4a5a6e;display:block;margin-bottom:5px;} #akx-promo .pp-meter{height:7px;border-radius:999px;background:#E4DFD2;overflow:hidden;} #akx-promo .pp-meter i{display:block;height:100%;border-radius:999px;background:#2b4c70;} #akx-promo .pp-capbox span{font-size:10.5px;color:#9aa0a6;}'
+'#akx-promo .pp-team{margin-top:14px;background:#F6F3EC;border-radius:9px;padding:10px 13px;font-size:12px;color:#4a5a6e;} #akx-promo .pp-team b{display:block;margin-bottom:6px;} #akx-promo .pp-teamrow{display:flex;gap:10px;flex-wrap:wrap;align-items:center;} #akx-promo .pp-member{font-weight:600;} #akx-promo .pp-rota{font:inherit;font-size:11.5px;border:1px solid #D9D2C4;border-radius:7px;padding:4px 8px;margin-left:5px;width:180px;} #akx-promo .pp-team button{font:inherit;font-size:11.5px;font-weight:600;border:0;border-radius:999px;padding:5px 12px;background:#2b4c70;color:#fff;cursor:pointer;}'
+'@media(max-width:640px){#akx-promo{padding:14px 12px;} #akx-promo .pp-head-row{flex-direction:column;align-items:flex-start;gap:6px;}}'
+'</style><div class="pp-body"><p style="color:#9aa0a6;font-size:13px">Loading events…</p></div>';

/* ---------- events from sheets ---------- */
function fetchCSV(id,sheet){return fetch("https://docs.google.com/spreadsheets/d/"+id+"/gviz/tq?tqx=out:csv&headers=1&sheet="+encodeURIComponent(sheet)).then(function(r){return r.text();}).then(csv);}
Promise.all([fetchCSV(WE_SHEET,"Events"),fetchCSV(WC_SHEET,"Talks & series"),fetchCSV(WC_SHEET,"Class times")]).then(function(res){
  var E=res[0],T=res[1],C=res[2],events=[];
  var eh=E[0];
  var eI={id:idx(eh,"event id"),t:idx(eh,"title"),ty:idx(eh,"event type"),tag:idx(eh,"event tag"),d:idx(eh,"date"),free:idx(eh,"free"),f:idx(eh,"featured"),hp:idx(eh,"hp showcase"),st:idx(eh,"status")};
  E.slice(1).forEach(function(r){ if(!r[eI.id]) return; if(/draft/i.test(r[eI.st]||"")) return;
    var d=dmy(r[eI.d]); if(!d||d<new Date()) return;
    events.push({id:r[eI.id],title:r[eI.t],type:r[eI.ty],tag:r[eI.tag],date:d,free:yes(r[eI.free]),feat:yes(r[eI.f]),hp:yes(r[eI.hp])});
  });
  var th=T[0], tI={id:idx(th,"id"),t:idx(th,"title"),ty:idx(th,"type"),f:idx(th,"featured"),hp:idx(th,"hp showcase"),st:idx(th,"status")};
  var ch=C[0], cI={id:idx(ch,"id"),dates:idx(ch,"dates")};
  var firstDate={};
  C.slice(1).forEach(function(r){ (r[cI.dates]||"").split(",").forEach(function(ds){ var d=dmy(ds); if(d&&d>=new Date()&&(!firstDate[r[cI.id]]||d<firstDate[r[cI.id]])) firstDate[r[cI.id]]=d; }); });
  T.slice(1).forEach(function(r){ if(!r[tI.id]) return; if(/draft/i.test(r[tI.st]||"")) return;
    var d=firstDate[r[tI.id]]; if(!d) return;
    events.push({id:r[tI.id],title:r[tI.t],type:r[tI.ty],tag:"",date:d,free:/free/i.test(r[tI.ty]||""),feat:yes(r[tI.f]),hp:yes(r[tI.hp])});
  });
  function paint(){ render(build(events),events); }
  paint();
  root.addEventListener("change",function(e){
    if(e.target.id==="pp-me"){S.me=e.target.value;save();paint();}
    if(e.target.classList.contains("pp-rota")){S.rota[e.target.dataset.n]=e.target.value.split(",").map(function(x){return x.trim();}).filter(Boolean);save();}
  });
  root.addEventListener("click",function(e){
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
    if(e.target.id==="pp-add"){ var n=prompt("Name of new team member:"); if(n){S.team.push(n.trim());save();paint();} }
  });
}).catch(function(err){ root.querySelector(".pp-body").innerHTML='<p style="color:#A3701B;font-size:13px">Couldn’t load the events sheets — check they’re published & shared. ('+esc(err.message)+')</p>'; });
})();
