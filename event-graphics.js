/* Akanishta KBC — shared EVENT-GRAPHIC module v1.2 (23 Aug 2026: swirl motif option E — opacity .28, stroke 2.2, 125% scale) (bg/ink overrides; motifs use currentColor) (single source of truth for the
 * type -> colour + motif taxonomy used on BOTH Weekly Classes and Courses & Retreats).
 *
 * Load once per page (site-wide footer is fine), then either:
 *   A) let widgets call it:  AKX_GFX.render('short course', {title, label, date, shape:'sq'})
 *   B) drop a standalone stub:
 *        <div class="akx-graphic" data-type="silent day" data-shape="wide"
 *             data-title="A Day of Meditation" data-date="Sat 17 Oct · 10am–4pm"
 *             data-chip="17 Oct" data-lotus="1"></div>
 *
 * The event TYPE (from the sheet) sets colour AND motif. Titles/labels/dates are text.
 * Change a hex or motif here once -> every card on both pages updates.
 */
(function () {
  "use strict";

  // ---- the taxonomy: canonical type -> colour, default label, motif id ----
  // colour = the fill; dk = darker shade (strips, buttons); tint/tintbd/tintink = pale states.
  var TYPES = {
    course:  { colour:"#2A66A6", dk:"#1E4C7C", tint:"#E3F1FB", tintbd:"#9AD0EF", tintink:"#1F6FB0", label:"Short Course",   motif:"m-course"  },
    talk:    { colour:"#C56B45", dk:"#A44E2E", tint:"#FBECE3", tintbd:"#F2C4AA", tintink:"#C05A2E", label:"Public Talk",    motif:"m-talk"    },
    retreat: { colour:"#227A72", dk:"#185B54", tint:"#D5EFEC", tintbd:"#A6D9D2", tintink:"#1E6E66", label:"Retreat",        motif:"m-retreat" },
    free:    { colour:"#4FA35A", dk:"#3C8146", tint:"#E7F3E1", tintbd:"#B9DCA9", tintink:"#3B8B2E", label:"Free Event",     motif:"m-free"    },
    study:   { colour:"#6A4A9C", dk:"#52397A", tint:"#ECE4F7", tintbd:"#C9B6E8", tintink:"#6A38B0", label:"In-depth",       motif:"m-study"   }, // purple + cairn
    special: { colour:"#B5771E", dk:"#8E5C14", tint:"#F6E9CE", tintbd:"#E4C48A", tintink:"#8E5C14", label:"Special Event",  motif:"m-special" }
  };

  // ---- aliases: whatever the two sheets' Event Type dropdowns say -> canonical ----
  var ALIAS = {
    "talk":"talk", "public talk":"talk", "public talks":"talk",
    "one-off talk":"talk", "one off talk":"talk",
    "course":"course", "short course":"course", "day course":"course",
    "half-day course":"course", "half day course":"course",
    "retreat":"retreat", "day retreat":"retreat", "half-day retreat":"retreat",
    "half day retreat":"retreat", "meditation":"retreat", "drop-in":"retreat",
    "drop in":"retreat", "class":"retreat", "evening class":"retreat",
    "free":"free", "free event":"free", "free events":"free",
    "free half-day":"free", "free half day":"free",
    "in-depth":"study", "in depth":"study", "in-depth event":"study", "in depth event":"study",
    "silent day":"study", "silent":"study",
    "study":"study", "fp":"study", "ttp":"study", "foundation programme":"study",
    "teacher training":"study", "teacher training programme":"study",
    "special":"special", "special event":"special", "special events":"special"
  };

  // colour name or hex (with/without #) -> normalised value; "" if invalid
  function normColour(v){ v=String(v||"").trim(); if(!v) return "";
    var c=document.createElement("canvas").getContext("2d");
    c.fillStyle="#000"; c.fillStyle=v; if(c.fillStyle!=="#000000"||/^black$|^#0{3,8}$/i.test(v)) return c.fillStyle;
    if(/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(v)){ c.fillStyle="#"+v; return c.fillStyle; }
    return ""; }
  function typeOf(x){ var k=String(x||"").trim().toLowerCase(); return ALIAS[k] || (TYPES[k]?k:"") ; }
  function colourOf(x){ var t=TYPES[typeOf(x)]; return t?t.colour:""; }
  function themeOf(x){ return TYPES[typeOf(x)] || null; }   // full swatch for a type
  // just the faint motif svg (for dropping into another widget's own graphic box)
  function motifSVG(x){ var t=TYPES[typeOf(x)]; if(!t) return "";
    return '<svg class="motif" viewBox="0 0 200 200" aria-hidden="true"><use href="#'+t.motif+'"/></svg>'; }

  // ---- the motif symbols (thin white line-art, one family) ----
  var DEFS =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<symbol id="m-talk" viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-linecap="round">' +
      '<circle cx="100" cy="100" r="16" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<circle cx="100" cy="100" r="34" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<circle cx="100" cy="100" r="52" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<circle cx="100" cy="100" r="70" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<circle cx="100" cy="100" r="88" stroke-width="2.2" vector-effect="non-scaling-stroke"/></g></symbol>' +
    '<symbol id="m-course" viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-linecap="round">' +
      '<path d="M-20 40 C10 26 40 54 70 40 S130 26 160 40 S220 54 250 40" stroke-width="2.2" vector-effect="non-scaling-stroke"/><path d="M-20 66 C10 52 40 80 70 66 S130 52 160 66 S220 80 250 66" stroke-width="2.2" vector-effect="non-scaling-stroke"/><path d="M-20 92 C10 78 40 106 70 92 S130 78 160 92 S220 106 250 92" stroke-width="2.2" vector-effect="non-scaling-stroke"/><path d="M-20 118 C10 104 40 132 70 118 S130 104 160 118 S220 132 250 118" stroke-width="2.2" vector-effect="non-scaling-stroke"/><path d="M-20 144 C10 130 40 158 70 144 S130 130 160 144 S220 158 250 144" stroke-width="2.2" vector-effect="non-scaling-stroke"/><path d="M-20 170 C10 156 40 184 70 170 S130 156 160 170 S220 184 250 170" stroke-width="2.2" vector-effect="non-scaling-stroke"/></g></symbol>' +
    '<symbol id="m-retreat" viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-linecap="round">' +
      '<path d="M70 172 a30 30 0 0 1 60 0" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M42 172 a58 58 0 0 1 116 0" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M14 172 a86 86 0 0 1 172 0" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M-14 172 a114 114 0 0 1 228 0" stroke-width="2.2" vector-effect="non-scaling-stroke"/></g></symbol>' +
    '<symbol id="m-free" viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M100 190 C100 155 94 120 100 60" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M98 152 C81 148 69 134 65 114 C85 120 96 134 98 152 Z" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M99 122 C116 118 128 104 132 84 C112 90 101 104 99 122 Z" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M99 96 C86 92 77 81 74 66 C89 71 97 81 99 96 Z" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M100 60 C95 50 95 42 100 32 C105 42 105 50 100 60 Z" stroke-width="2.2" vector-effect="non-scaling-stroke"/></g></symbol>' +
    '<symbol id="m-study" viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-linecap="round">' +
      '<ellipse cx="100" cy="158" rx="46" ry="19" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<ellipse cx="97" cy="124" rx="36" ry="16" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<ellipse cx="102" cy="96" rx="26" ry="13" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<ellipse cx="99" cy="72" rx="17" ry="10" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<ellipse cx="101" cy="53" rx="10" ry="7" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M44 182 C68 177 132 177 156 182" stroke-width="2.2" vector-effect="non-scaling-stroke"/></g></symbol>' +
    '<symbol id="m-special" viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-linecap="round">' +
      '<circle cx="100" cy="100" r="14" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M128 100 H180" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M20 100 H72" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M100 20 V72" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M100 128 V180" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M120 80 L141 59" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M80 80 L59 59" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M80 120 L59 141" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      '<path d="M120 120 L141 141" stroke-width="2.2" vector-effect="non-scaling-stroke"/></g></symbol>' +
    '<symbol id="mk-lotus" viewBox="0 0 34 22"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M17 2 C13.5 6.5 13.5 12.5 17 17 C20.5 12.5 20.5 6.5 17 2 Z"/>' +
      '<path d="M8 7 C8.8 12 12 15.6 17 17 C15.2 12.4 12.4 9 8 7 Z"/>' +
      '<path d="M26 7 C25.2 12 22 15.6 17 17 C18.8 12.4 21.6 9 26 7 Z"/></g></symbol>' +
    '</defs></svg>';

  var SERIF = "'Fraunces',Georgia,'Times New Roman',serif";
  var SANS  = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  var MONO  = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

  var CSS =
    ".evg{position:relative;overflow:hidden;border-radius:18px;color:#fff;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 8px 28px rgba(36,59,83,.14);font-family:"+SANS+";}" +
    ".evg--sq{aspect-ratio:1/1;padding:18px;}" +
    ".evg--wide{aspect-ratio:2.6/1;padding:16px 22px 18px;}" +
    ".evg.g-course{background:#2A66A6;}.evg.g-talk{background:#C56B45;}.evg.g-retreat{background:#227A72;}" +
    ".evg.g-free{background:#4FA35A;}.evg.g-study{background:#6A4A9C;}.evg.g-special{background:#B5771E;}" +
    ".evg .motif{position:absolute;top:50%;right:-4%;height:212%;transform:translateY(-50%);opacity:.28;pointer-events:none;}" +
    ".evg--wide .motif{height:288%;right:6%;}" +
    ".evg .evg-k{position:relative;z-index:1;font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;opacity:.92;}" +
    ".evg .evg-btm{position:relative;z-index:1;}" +
    ".evg .evg-t{font-family:"+SERIF+";font-weight:600;font-size:21px;line-height:1.16;letter-spacing:-.01em;max-width:12ch;}" +
    ".evg--wide .evg-t{font-size:23px;max-width:20ch;}" +
    ".evg .evg-m{font-family:"+MONO+";font-size:11.5px;margin-top:8px;opacity:.85;letter-spacing:.01em;}" +
    ".evg .evg-top{position:relative;z-index:1;display:flex;align-items:center;gap:10px;}" +
    ".evg .chip{font-family:"+MONO+";font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;background:rgba(255,255,255,.18);border-radius:999px;padding:3px 10px;white-space:nowrap;}" +
    ".evg .lotus{margin-left:auto;height:15px;opacity:.8;flex-shrink:0;}" +
    "@media(max-width:480px){.evg--sq .evg-t{font-size:17px;}.evg--wide .evg-t{font-size:19px;}}";

  function injectOnce(){
    if(document.getElementById("akx-gfx-css")) return;
    var s=document.createElement("style"); s.id="akx-gfx-css"; s.textContent=CSS; document.head.appendChild(s);
    var d=document.createElement("div"); d.id="akx-gfx-defs"; d.style.cssText="width:0;height:0;overflow:hidden";
    d.innerHTML=DEFS; document.body.appendChild(d);
  }

  function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];}); }

  // render the graphic panel HTML for a given type + content
  function render(typeOrAlias, opts){
    opts=opts||{};
    var t=typeOf(typeOrAlias); if(!t) t="talk";           // safe default
    var def=TYPES[t];
    var shape=(opts.shape==="wide"||opts.shape==="banner")?"wide":"sq";
    var st=(opts.bg?"background:"+opts.bg+";":"")+(opts.ink?"color:"+opts.ink+";":"");
    st=st?" style='"+st+"'":"";
    var label=opts.label!=null?opts.label:def.label;
    var motif='<svg class="motif" viewBox="0 0 200 200"><use href="#'+def.motif+'"/></svg>';
    var body='<div class="evg-btm"><div class="evg-t">'+esc(opts.title||"")+'</div>'+
             (opts.date?'<div class="evg-m">'+esc(opts.date)+'</div>':'')+'</div>';
    if(shape==="wide"){
      var top='<div class="evg-top">'+
        (opts.chip?'<span class="chip">'+esc(opts.chip)+'</span>':'')+
        '<span class="evg-k">'+esc(label)+'</span>'+
        (opts.lotus?'<svg class="lotus" viewBox="0 0 34 22"><use href="#mk-lotus"/></svg>':'')+
        '</div>';
      return '<div class="evg evg--wide g-'+t+'"'+st+'>'+motif+top+body+'</div>';
    }
    return '<div class="evg evg--sq g-'+t+'"'+st+'>'+motif+'<span class="evg-k">'+esc(label)+'</span>'+body+'</div>';
  }

  // standalone: upgrade any <div class="akx-graphic" data-...> on the page
  function hydrate(el){
    el.innerHTML=render(el.getAttribute("data-type"), {
      bg: normColour(el.getAttribute("data-bg")), ink: normColour(el.getAttribute("data-ink")),
      shape: el.getAttribute("data-shape")||"sq",
      title: el.getAttribute("data-title")||"",
      label: el.getAttribute("data-label"),
      date:  el.getAttribute("data-date")||"",
      chip:  el.getAttribute("data-chip")||"",
      lotus: el.getAttribute("data-lotus")
    });
    // let the injected .evg fill the stub
    var g=el.firstChild; if(g){ el.replaceWith(g); }
  }
  function start(){ injectOnce(); var n=document.querySelectorAll(".akx-graphic"); for(var i=0;i<n.length;i++) hydrate(n[i]); }

  window.AKX_GFX = { TYPES:TYPES, typeOf:typeOf, colourOf:colourOf, themeOf:themeOf, motifSVG:motifSVG, render:render, injectCSS:injectOnce, normColour:normColour };

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start);
  else start();
})();
