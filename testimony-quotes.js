/* Akanishta KBC — Testimonies & Quotations rotating widget
 * One self-injecting file for BOTH types. Reads two published Google-Sheet CSVs,
 * rotates once per day, varies style, and renders into any element like:
 *
 *   <div class="akx-tq" data-type="testimony" data-page="home"></div>
 *   <div class="akx-tq" data-type="quotation" data-page="study"></div>
 *   <script src="https://kadampacheltenham.github.io/akx-widgets/testimony-quotes.js"></script>
 *
 * data-type : "testimony" | "quotation"   (required)
 * data-page : one of home|whats-on|classes|retreats|study|about|visit  (optional)
 * data-style: pin a style, e.g. "t1"/"t4"/"q1"/"q5" (optional; blank = auto-rotate)
 *
 * Page tags PREFER an item on its page (shown more often) but never lock it there.
 * Testimony photos live at images/testimonies/<image>; missing => initials circle.
 */
(function () {
  "use strict";

  var TEST_CSV  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_bF_xgfc8pBMdRX-OD_JMO3iZ6OAdZoWdpbg9gokENzmCB-kHorN0ED3RJ3eWZ06BSxME5IUpxLWI/pub?gid=1176818478&single=true&output=csv";
  var QUOTE_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_bF_xgfc8pBMdRX-OD_JMO3iZ6OAdZoWdpbg9gokENzmCB-kHorN0ED3RJ3eWZ06BSxME5IUpxLWI/pub?gid=693990413&single=true&output=csv";
  var IMG_BASE  = "https://kadampacheltenham.github.io/akx-widgets/images/testimonies/";

  var TEST_STYLES  = ["t1", "t4"];   // in-use testimony styles
  var QUOTE_STYLES = ["q1", "q5"];   // in-use quotation styles

  var VGKGR = "Geshe Kelsang Gyatso"; // default author when a book is present

  // Book title -> Tharpa UK link (extend as needed)
  var BOOKS = {
    "how to transform your life": "https://tharpa.com/uk/how-to-transform-your-life",
    "joyful path of good fortune": "https://tharpa.com/uk/joyful-path-of-good-fortune",
    "universal compassion": "https://tharpa.com/uk/universal-compassion",
    "the new eight steps to happiness": "https://tharpa.com/uk/the-new-eight-steps-to-happiness",
    "the new heart of wisdom": "https://tharpa.com/uk/the-new-heart-of-wisdom",
    "meaningful to behold": "https://tharpa.com/uk/meaningful-to-behold",
    "how to understand the mind": "https://tharpa.com/uk/how-to-understand-the-mind",
    "ocean of nectar": "https://tharpa.com/uk/ocean-of-nectar",
    "essence of vajrayana": "https://tharpa.com/uk/essence-of-vajrayana"
  };

  // Baked-in fallbacks so a fetch failure never leaves an empty block
  var FALLBACK = {
    testimony: { name: "Paolo", quote: "Meditating here is like a turbo boost compared to when I am just doing it by myself. It’s like going to a mental spa — I feel refreshed and energised and ready to take on the week.", image: "", pages: "", style: "" },
    quotation: { quote: "Inner peace, or mental peace, is the source of all our happiness.", attribution: "Geshe Kelsang Gyatso", book: "How to Transform Your Life", pages: "", style: "" }
  };

  /* ---------- CSS (scoped under .akx-tq; only the 4 live styles) ---------- */
  var CSS =
  ".akx-tq{container-type:inline-size;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}" +
  ".akx-tq .ph{border-radius:50%;background:#c9d2d9;display:flex;align-items:center;justify-content:center;color:#54626f;font-weight:600;font-size:22px;flex-shrink:0;overflow:hidden;line-height:1;text-transform:uppercase;}" +
  ".akx-tq .ph img{width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;}" +
  // testimony T1
  ".akx-tq .t1{background:#FFFFFF;padding:56px 28px 44px;text-align:center;}" +
  ".akx-tq .t1 .halo{width:184px;height:184px;border-radius:50%;background:#F7E9E3;margin:0 auto 26px;display:flex;align-items:center;justify-content:center;}" +
  ".akx-tq .t1 .halo .ph{width:150px;height:150px;}" +
  ".akx-tq .t1 blockquote{font-style:italic;font-size:18px;line-height:1.65;color:#243B53;max-width:620px;margin:0 auto;}" +
  ".akx-tq .t1 .who{margin-top:18px;color:#E2886A;font-weight:600;font-size:16px;}" +
  ".akx-tq .t1 .rule{width:64px;height:2px;background:#2A66A6;margin:26px auto 0;border-radius:2px;}" +
  // testimony T4
  ".akx-tq .t4{background:#FFFFFF;padding:48px 28px;}" +
  ".akx-tq .t4 .row{display:flex;gap:36px;align-items:center;max-width:760px;margin:0 auto;}" +
  ".akx-tq .t4 .ph{width:160px;height:160px;}" +
  ".akx-tq .t4 .txt{border-left:3px solid #E2886A;padding-left:24px;text-align:left;}" +
  ".akx-tq .t4 blockquote{font-style:italic;font-size:17px;line-height:1.65;color:#243B53;margin:0;}" +
  ".akx-tq .t4 .who{margin-top:14px;color:#E2886A;font-weight:600;font-size:15px;}" +
  // shared quotation attribution
  ".akx-tq .lotus{display:block;color:#2E7C7C;}" +
  ".akx-tq .q-attr{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6B7A8D;font-style:normal;}" +
  ".akx-tq .q-book{display:inline-block;margin-top:10px;font-size:12.5px;font-style:italic;letter-spacing:.02em;color:#2E7C7C;text-decoration:none;border-bottom:1px solid rgba(46,124,124,.35);padding-bottom:1px;}" +
  ".akx-tq .q-book:hover{border-bottom-color:#2E7C7C;}" +
  // quotation Q1 Whisper
  ".akx-tq .q1{background:#FEFEFA;padding:64px 28px 56px;text-align:center;}" +
  ".akx-tq .q1 .lotus{width:40px;margin:0 auto 22px;opacity:.55;}" +
  ".akx-tq .q1 blockquote{font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:21px;line-height:1.6;color:#243B53;max-width:600px;margin:0 auto;}" +
  ".akx-tq .q1 .hr{width:48px;height:1px;background:#D8D3C6;margin:26px auto 16px;}" +
  // quotation Q5 Open Quote
  ".akx-tq .q5{background:#FEFEFA;padding:52px 28px 48px;}" +
  ".akx-tq .q5 .inner{max-width:640px;margin:0 auto;position:relative;text-align:left;}" +
  ".akx-tq .q5 .mark{font-family:Georgia,'Times New Roman',serif;font-size:130px;line-height:0;color:rgba(42,102,166,.14);position:absolute;top:18px;left:-10px;pointer-events:none;}" +
  ".akx-tq .q5 blockquote{font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:20px;line-height:1.6;color:#243B53;position:relative;padding:18px 0 0 34px;margin:0;}" +
  ".akx-tq .q5 .foot{text-align:right;margin-top:16px;}" +
  // container (block-width) responsive
  "@container (max-width:480px){" +
    ".akx-tq .t1{padding:40px 20px 32px;}.akx-tq .t1 .halo{width:150px;height:150px;}.akx-tq .t1 .halo .ph{width:122px;height:122px;}.akx-tq .t1 blockquote{font-size:16px;}" +
    ".akx-tq .t4{padding:36px 20px;}.akx-tq .t4 .row{flex-direction:column;gap:22px;align-items:flex-start;}.akx-tq .t4 .ph{width:118px;height:118px;}.akx-tq .t4 blockquote{font-size:15.5px;}" +
    ".akx-tq .q1{padding:48px 22px 42px;}.akx-tq .q1 blockquote{font-size:18px;}" +
    ".akx-tq .q5{padding:40px 20px 36px;}.akx-tq .q5 blockquote{font-size:17px;padding-left:24px;}.akx-tq .q5 .mark{font-size:96px;left:-6px;}" +
  "}";

  var LOTUS = '<svg class="lotus" viewBox="0 0 120 60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M60 6 C 52 20, 52 36, 60 50 C 68 36, 68 20, 60 6 Z"/><path d="M38 16 C 39 30, 47 43, 60 50 C 57 36, 49 24, 38 16 Z"/><path d="M82 16 C 81 30, 73 43, 60 50 C 63 36, 71 24, 82 16 Z"/><path d="M16 28 C 23 41, 40 50, 60 50 C 48 41, 32 33, 16 28 Z"/><path d="M104 28 C 97 41, 80 50, 60 50 C 72 41, 88 33, 104 28 Z"/></svg>';

  function injectCSS() {
    if (document.getElementById("akx-tq-css")) return;
    var s = document.createElement("style");
    s.id = "akx-tq-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- helpers ---------- */
  function esc(s){ return String(s==null?"":s).replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c];}); }

  function parseCSV(text){
    var rows=[],row=[],cur="",q=false;
    for(var i=0;i<text.length;i++){var c=text[i];
      if(q){ if(c=='"'){ if(text[i+1]=='"'){cur+='"';i++;} else q=false; } else cur+=c; }
      else{ if(c=='"')q=true; else if(c==','){row.push(cur);cur="";}
        else if(c=='\n'){row.push(cur);rows.push(row);row=[];cur="";}
        else if(c=='\r'){} else cur+=c; } }
    if(cur!==""||row.length){row.push(cur);rows.push(row);}
    return rows;
  }
  function toObjects(rows){
    if(!rows.length) return [];
    var head=rows[0].map(function(h){return String(h||"").trim().toLowerCase();});
    return rows.slice(1).map(function(r){
      var o={}; head.forEach(function(h,i){ o[h]=(r[i]==null?"":String(r[i]).trim()); });
      return o;
    });
  }
  function hashStr(s){ var h=0,i; s=String(s||""); for(i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0;} return Math.abs(h); }
  function dayNumber(){ return Math.floor(Date.now()/86400000); }
  function tagsOf(item){ return String(item.pages||"").toLowerCase().split(",").map(function(t){return t.trim();}).filter(Boolean); }

  function initials(name){
    var p=String(name||"").trim().split(/\s+/).filter(Boolean);
    if(!p.length) return "•";
    return (p[0][0]+(p.length>1?p[p.length-1][0]:"")).toUpperCase();
  }

  // cache one fetch per CSV
  var cache={};
  function load(url){
    if(cache[url]) return cache[url];
    cache[url]=fetch(url+(url.indexOf("?")>-1?"&":"?")+"cb="+dayNumber())
      .then(function(r){return r.text();})
      .then(function(t){return toObjects(parseCSV(t));});
    return cache[url];
  }

  // choose the item for a block: page-preferred but never exclusive
  function pickItem(items, page, seed){
    var active=items.filter(function(it){
      if(String(it.active||"").trim()!=="") return false;      // active blank = live
      if("quote" in it && !String(it.quote||"").trim()) return false;
      if("name" in it && !String(it.quote||"").trim()) return false;
      return true;
    });
    if(!active.length) return null;
    var pool;
    if(page){
      var pref=active.filter(function(it){return tagsOf(it).indexOf(page)>-1;});
      if(pref.length){ pool=[]; pref.forEach(function(x){pool.push(x,x);}); active.forEach(function(x){if(pref.indexOf(x)<0)pool.push(x);}); }
      else pool=active;
    } else pool=active;
    return pool[(dayNumber()+seed)%pool.length];
  }

  function chooseStyle(item, styles, seed, forced){
    if(forced && styles.indexOf(forced)>-1) return forced;
    var pinned=String(item.style||"").trim().toLowerCase();
    if(pinned && styles.indexOf(pinned)>-1) return pinned;
    return styles[(dayNumber()+seed+hashStr(item.quote||item.name))%styles.length];
  }

  function photoHTML(item){
    var img=String(item.image||"").trim();
    if(img) return '<div class="ph"><img src="'+esc(IMG_BASE+img)+'" alt="'+esc(item.name)+'" onerror="this.parentNode.textContent=\''+esc(initials(item.name))+'\'"></div>';
    return '<div class="ph">'+esc(initials(item.name))+'</div>';
  }

  function renderTestimony(item, style){
    var q='<blockquote>“'+esc(item.quote)+'”</blockquote>';
    var who='<div class="who">— '+esc(item.name)+'</div>';
    if(style==="t4"){
      return '<div class="t4"><div class="row">'+photoHTML(item)+'<div class="txt">'+q+who+'</div></div></div>';
    }
    return '<div class="t1"><div class="halo">'+photoHTML(item)+'</div>'+q+who+'<div class="rule"></div></div>';
  }

  function attrHTML(item){
    var name=String(item.attribution||"").trim();
    var book=String(item.book||"").trim();
    if(!name && book) name=VGKGR;                    // book present, author blank => VGKGR
    var out="";
    if(name) out+='<span class="q-attr">'+esc(name)+'</span>';
    if(book){
      var url=BOOKS[book.toLowerCase()];
      var label='— <em>'+esc(book)+'</em>';
      out+= (name?'<br>':'') + (url? '<a class="q-book" href="'+esc(url)+'" target="_blank" rel="noopener">'+label+'</a>' : '<span class="q-book" style="border:none">'+label+'</span>');
    }
    return out;
  }

  function renderQuotation(item, style){
    var q='<blockquote>“'+esc(item.quote)+'”</blockquote>';
    if(style==="q5"){
      return '<div class="q5"><div class="inner"><div class="mark">“</div>'+q+'<div class="foot">'+attrHTML(item)+'</div></div></div>';
    }
    return '<div class="q1">'+LOTUS+q+'<div class="hr"></div>'+attrHTML(item)+'</div>';
  }

  function fill(el){
    var type=(el.getAttribute("data-type")||"").toLowerCase();
    var page=(el.getAttribute("data-page")||"").toLowerCase().trim();
    var forced=(el.getAttribute("data-style")||"").toLowerCase().trim();
    var isT=type!=="quotation";
    var url=isT?TEST_CSV:QUOTE_CSV;
    var seed=hashStr(page)+(isT?0:97);
    el.className="akx-tq";
    load(url).then(function(items){
      var item=pickItem(items,page,seed) || FALLBACK[isT?"testimony":"quotation"];
      var style=chooseStyle(item, isT?TEST_STYLES:QUOTE_STYLES, seed, forced);
      el.innerHTML=isT?renderTestimony(item,style):renderQuotation(item,style);
    }).catch(function(){
      var item=FALLBACK[isT?"testimony":"quotation"];
      el.innerHTML=isT?renderTestimony(item,TEST_STYLES[0]):renderQuotation(item,QUOTE_STYLES[0]);
    });
  }

  function start(){
    injectCSS();
    var nodes=document.querySelectorAll(".akx-tq");
    // if the script sits alone with no host, do nothing gracefully
    for(var i=0;i<nodes.length;i++) fill(nodes[i]);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start);
  else start();
})();
