/* AKBC — Event graphics maker (volunteer tool on /epc)
 * Stub on the page:
 *   <div id="akx-egm"></div>
 *   <script src="https://kadampacheltenham.github.io/akx-widgets/epc-events-graphic-tool.js"><\/script>
 * Fill the form -> three PNGs (1080x1080, 1200x628, 1920x600) in the locked type colours/fonts/motifs.
 * v1.4 (20 Aug 2026): quiet colour overrides — background + text (colour name or hex); swirl style still follows the type.
 */
(function(){
  var root=document.getElementById("akx-egm"); if(!root) return;
  if(!document.querySelector("link[href*=Fraunces]")){var l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Inter:wght@400;600&display=swap";document.head.appendChild(l);}
  root.innerHTML="\n<style>\n  #akx-egm{font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1F2A3C;max-width:1100px;margin:0 auto;}\n  #akx-egm .frm{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;background:#F6F1E7;border-radius:14px;padding:20px 22px;margin-bottom:22px;}\n  #akx-egm label{display:block;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:#7A8797;font-weight:600;margin-bottom:5px;}\n  #akx-egm input,#akx-egm select{width:100%;box-sizing:border-box;font:inherit;font-size:1rem;padding:9px 11px;border:1px solid #D9D2C4;border-radius:8px;background:#fff;color:#1F2A3C;}\n  #akx-egm .full{grid-column:1/-1;}\n  #akx-egm .hint{font-size:.85rem;color:#7A8797;margin-top:4px;}\n  #akx-egm .out{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start;}\n  #akx-egm .card{background:#fff;border:1px solid #E7E1D5;border-radius:12px;padding:12px;}\n  #akx-egm .card.wide{grid-column:1/-1;}\n  #akx-egm canvas{width:100%;height:auto;display:block;border-radius:8px;}\n  #akx-egm .bar{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:.85rem;color:#7A8797;}\n  #akx-egm button{font:inherit;font-weight:600;font-size:.9rem;padding:8px 16px;border-radius:999px;border:0;background:#2A66A6;color:#fff;cursor:pointer;}\n  #akx-egm button:hover{background:#1E4C7C;}\n  #akx-egm .all{margin:6px 0 18px;text-align:right;}\n  #akx-egm .all button{background:#227A72;}\n  @media(max-width:700px){#akx-egm .frm,#akx-egm .out{grid-template-columns:1fr;}}\n</style>\n\n<div class=\"frm\">\n  <div><label>Event type</label>\n    <select id=\"egm-type\">\n      <option value=\"talk\">Public Talk (coral)</option>\n      <option value=\"course\">Short Course (blue)</option>\n      <option value=\"retreat\">Retreat / Meditation (teal)</option>\n      <option value=\"free\">Free Event (green)</option>\n      <option value=\"study\">In-depth / Silent day (purple)</option>\n      <option value=\"special\">Special Event (gold)</option>\n    </select></div>\n  <div><label>Location (optional)</label><input id=\"egm-loc\" placeholder=\"Cheltenham\"></div>\n  <div><label>Label (optional \u2014 overrides the type label)</label><input id=\"egm-label\" placeholder=\"e.g. Half-day Course\"></div>\n  <div class=\"full\"><label>Title (max 6 words works best)</label><input id=\"egm-title\" value=\"Finding Peace in a Busy World\"></div>\n  <div><label>Date &amp; time line</label><input id=\"egm-date\" value=\"Sat 17 Oct \u00b7 10am\u20131pm\"></div>\n  <div class=\"full\"><label>Days &amp; times pills (optional \u2014 separate with commas, e.g. Mon 7.30pm, Tue 10.30am, Wed 7.30pm)</label><input id=\"egm-pills\" placeholder=\"Mon 7.30pm, Tue 10.30am, Wed 7.30pm\"></div>\n  <div><label>Sub-title (optional \u2014 shown under the title)</label><input id=\"egm-sub\" value=\"with Gen Kelsang Jangchub\"></div>\n  <div class=\"full\" style=\"opacity:.78\"><label>Colour overrides (optional \u2014 colour name or hex, e.g. teal or #0c9d94)</label><div style=\"display:flex;gap:14px;flex-wrap:wrap\"><input id=\"egm-bg\" placeholder=\"Background \u2014 leave blank for type colour\" style=\"max-width:300px\"><input id=\"egm-fg\" placeholder=\"Text \u2014 leave blank for white\" style=\"max-width:300px\"></div><div class=\"hint\">Swirl style still follows the event type. Invalid colours are ignored.</div></div>\n</div>\n<div class=\"all\"><button id=\"egm-all\">Download all three</button></div>\n\n<div class=\"out\">\n  <div class=\"card\"><canvas id=\"egm-sq\" width=\"1080\" height=\"1080\"></canvas><div class=\"bar\"><span>Square poster \u00b7 1080\u00d71080 (Instagram, WhatsApp)</span><button data-dl=\"egm-sq\">Download</button></div></div>\n  <div class=\"card\"><canvas id=\"egm-fb\" width=\"1200\" height=\"628\"></canvas><div class=\"bar\"><span>Short banner \u00b7 1200\u00d7628 (Facebook, eNews)</span><button data-dl=\"egm-fb\">Download</button></div></div>\n  <div class=\"card wide\"><canvas id=\"egm-tt\" width=\"1920\" height=\"600\"></canvas><div class=\"bar\"><span>Long banner \u00b7 1920\u00d7600 (Ticket Tailor page)</span><button data-dl=\"egm-tt\">Download</button></div></div>\n</div>\n\n";
  var TYPES={
    course:{colour:"#2A66A6",label:"Short Course",motif:"waves"},
    talk:{colour:"#C56B45",label:"Public Talk",motif:"rings"},
    retreat:{colour:"#227A72",label:"Retreat",motif:"ripples"},
    free:{colour:"#4FA35A",label:"Free Event",motif:"sprig"},
    study:{colour:"#6A4A9C",label:"In-depth",motif:"cairn"},
    special:{colour:"#B5771E",label:"Special Event",motif:"star"}
  };
  // motifs: thin white line-art in a 200x200 box (same family as the website cards)
  var MOTIF={
    rings:["M116 100a16 16 0 1 1-32 0a16 16 0 1 1 32 0","M134 100a34 34 0 1 1-68 0a34 34 0 1 1 68 0","M152 100a52 52 0 1 1-104 0a52 52 0 1 1 104 0","M170 100a70 70 0 1 1-140 0a70 70 0 1 1 140 0","M188 100a88 88 0 1 1-176 0a88 88 0 1 1 176 0"],
    waves:wave(-10),
    ripples:["M70 172a30 30 0 0 1 60 0","M42 172a58 58 0 0 1 116 0","M14 172a86 86 0 0 1 172 0","M-14 172a114 114 0 0 1 228 0"],
    sprig:["M100 190C100 155 94 120 100 60","M98 152C81 148 69 134 65 114C85 120 96 134 98 152Z","M99 122C116 118 128 104 132 84C112 90 101 104 99 122Z","M99 96C86 92 77 81 74 66C89 71 97 81 99 96Z","M100 60C95 50 95 42 100 32C105 42 105 50 100 60Z"],
    cairn:[el(100,158,46,19),el(97,124,36,16),el(102,96,26,13),el(99,72,17,10),el(101,53,10,7),"M44 182C68 177 132 177 156 182"],
    star:["M114 100a14 14 0 1 1-28 0a14 14 0 1 1 28 0","M128 100H180","M20 100H72","M100 20V72","M100 128V180","M120 80L141 59","M80 80L59 59","M80 120L59 141","M120 120L141 141"]
  };
  function el(cx,cy,rx,ry){return "M"+(cx+rx)+" "+cy+"a"+rx+" "+ry+" 0 1 1-"+(2*rx)+" 0a"+rx+" "+ry+" 0 1 1 "+(2*rx)+" 0";}
  function wave(){ // six gentle horizontal waves, stacked
    var out=[];for(var i=0;i<6;i++){var y=40+i*26;
      out.push("M-20 "+y+"C10 "+(y-14)+" 40 "+(y+14)+" 70 "+y+"S130 "+(y-14)+" 160 "+y+"S220 "+(y+14)+" 250 "+y);}
    return out;}

  var SERIF="600 {s}px Fraunces, Georgia, serif", SANS="600 {s}px Inter, Helvetica, Arial, sans-serif", SANSR="400 {s}px Inter, Helvetica, Arial, sans-serif", MONOB="700 {s}px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", MONO="{s}px ui-monospace, Menlo, Consolas, monospace";
  function f(t,s){return t.replace("{s}",s);}
  function q(id){return document.getElementById(id);}
  function val(id){return q(id).value.trim();}
  function normColour(v){ v=(v||"").trim(); if(!v) return "";
    var c=document.createElement("canvas").getContext("2d");
    c.fillStyle="#000"; c.fillStyle=v; if(c.fillStyle!=="#000000"||/^black$|^#0{3,8}$/i.test(v)) return c.fillStyle;
    if(/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(v)){ c.fillStyle="#"+v; return c.fillStyle; }
    return ""; }

  function drawMotif(ctx,W,H,name,ink){
    var paths=MOTIF[name]; var box=H*1.7; var x=W-box*0.85, y=(H-box)/2;   // right side, oversized like the site cards
    if(W/H>2.5){box=H*2.3;x=W-box*0.9;y=(H-box)/2;}
    ctx.save();ctx.translate(x,y);ctx.scale(box/200,box/200);
    ctx.strokeStyle=ink||"#fff";ctx.globalAlpha=.2;ctx.lineWidth=1.5*200/box*Math.max(1.6,box/700);ctx.lineCap="round";ctx.lineJoin="round";
    paths.forEach(function(p){ctx.stroke(new Path2D(p));});
    ctx.restore();
  }
  function wrap(ctx,text,maxW){
    var words=text.split(/\s+/),lines=[],cur="";
    words.forEach(function(w){var t=cur?cur+" "+w:w; if(ctx.measureText(t).width>maxW&&cur){lines.push(cur);cur=w;}else cur=t;});
    if(cur)lines.push(cur);return lines;
  }
  function draw(id,W,H){
    var c=q(id),ctx=c.getContext("2d");
    var t=TYPES[val("egm-type")], label=val("egm-label")||t.label, title=val("egm-title"), date=val("egm-date"), sub=val("egm-sub"), loc=val("egm-loc"), pills=val("egm-pills").split(",").map(function(x){return x.trim().toUpperCase();}).filter(Boolean);
    var bgOv=normColour(val("egm-bg")), fgOv=normColour(val("egm-fg"));
    var bg=bgOv||t.colour, ink=fgOv||"#fff";
    var pad=Math.round(H*(long?0.14:0.105)), long=W/H>2.5;
    ctx.clearRect(0,0,W,H);ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    drawMotif(ctx,W,H,t.motif,ink);
    ctx.fillStyle=ink;ctx.textBaseline="alphabetic";
    // label top-left
    var ls=Math.round(H*(long?0.05:0.03));ctx.font=f(SANS,ls);
    ctx.save();ctx.globalAlpha=.92;ctx.fillText((label.toUpperCase()+(loc?"   \u00b7   "+loc.toUpperCase():"")).split("").join(String.fromCharCode(8202)),pad,pad+ls*0.85);ctx.restore();
    // title + meta bottom-left
    var ts=Math.round(H*(long?0.15:W===H?0.085:0.115)), ms=Math.round(H*(long?0.058:0.036));
    ctx.font=f(SERIF,ts);var lines=wrap(ctx,title,W*(long?0.62:0.78)-pad);
    while(lines.length>3){ts=Math.round(ts*0.9);ctx.font=f(SERIF,ts);lines=wrap(ctx,title,W*(long?0.62:0.78)-pad);}
    var ss=Math.round(ts*0.42), lh=ts*1.12, sh=ss*1.2, mh=ms*1.5, ph=ms*2.0;
    // block order: title -> sub-title (tight) -> gap -> DATE LINE (bold) -> pills, bottom-aligned to the margin
    var total=lines.length*lh+(sub?sh+ss*0.45:0)+(date?ms*1.6+mh:0)+(pills.length?ms*0.5+ph:0)-ms*0.6;
    var y=H-pad-total+ts*0.9;
    ctx.font=f(SERIF,ts);lines.forEach(function(l){ctx.fillText(l,pad,y);y+=lh;});
    if(sub){y-=lh-sh-ss*0.55;ctx.font=f(SANSR,ss);ctx.save();ctx.globalAlpha=.9;ctx.fillText(sub,pad,y);ctx.restore();y+=sh;}
    if(date){y+=ms*1.6;ctx.font=f(MONOB,ms);ctx.fillText(date,pad,y);y+=mh;}
    if(pills.length){y+=ms*0.5;var px=pad;ctx.font=f(MONO,Math.round(ms*0.9));
      pills.forEach(function(p){var w=ctx.measureText(p).width+ms*1.4;ctx.save();ctx.fillStyle=ink;ctx.globalAlpha=.18;ctx.beginPath();ctx.roundRect(px,y-ms*1.1,w,ms*1.7,ms);ctx.fill();ctx.restore();ctx.fillText(p,px+ms*0.7,y+ms*0.15);px+=w+ms*0.6;});}
  }
  function drawAll(){draw("egm-sq",1080,1080);draw("egm-fb",1200,628);draw("egm-tt",1920,600);}
  function slug(){return (val("egm-title")||"event").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
  function dl(id){var names={"egm-sq":"square-1080","egm-fb":"banner-1200x628","egm-tt":"banner-1920x600"};
    var a=document.createElement("a");a.download=slug()+"-"+names[id]+".png";a.href=q(id).toDataURL("image/png");document.body.appendChild(a);a.click();a.remove();}
  root.addEventListener("input",drawAll);
  root.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
    if(b.id==="egm-all"){["egm-sq","egm-fb","egm-tt"].forEach(function(id,i){setTimeout(function(){dl(id);},i*400);});} else if(b.dataset.dl) dl(b.dataset.dl);});
  drawAll();
  if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load("600 40px Fraunces"),document.fonts.load("600 20px Inter")]).then(drawAll,drawAll);
    document.fonts.ready.then(drawAll);}
  setTimeout(drawAll,1500);
})();
