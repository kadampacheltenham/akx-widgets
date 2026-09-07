/* Akanishta KBC — Class recordings player (FP & TTP home study)
 * Sheet-driven audio player for the password-protected /ttp and /homestudy pages.
 *
 *   <div class="akx-recordings" data-prog="ttp"></div>
 *   <script src="https://kadampacheltenham.github.io/akx-widgets/homestudy-recordings.js"></script>
 *
 * data-prog : "ttp" | "fp"  (required — picks the sheet tab / heading)
 *
 * DATA — one published Google-Sheet CSV per programme (File → Share → Publish to web).
 * Until those addresses are pasted in below, the widget shows the built-in DEMO rows.
 * Sheet columns (exact order not required — headers are matched by name):
 *   Class date | Class type | Description | Book | Pages | Teacher | Recording address | Active
 *   - Class date: 25/08/2026 or 2026-08-25 or "25 Aug 2026" all fine
 *   - Active: Yes/blank = shown, No = hidden
 *   - Teacher: optional — shows as a quiet sub-line only when filled
 * Player remembers each listener's place per recording (this browser only),
 * offers 1× / 1.25× / 1.5×, ±15s, and a download link.
 */
(function () {
  "use strict";

  var CSV_FP  = "";   // paste the published-CSV address of the FP tab here
  var CSV_TTP = "";   // paste the published-CSV address of the TTP tab here

  var PROG = {
    ttp: { name: "TTP class recordings", sub: "Teacher Training Programme · listen again between classes · for enrolled students only", csv: CSV_TTP },
    fp:  { name: "FP class recordings",  sub: "Foundation Programme · listen again between classes · for enrolled students only",       csv: CSV_FP  }
  };

  /* Book codes -> [full title, Tharpa cover image] (titles match the testimonies widget) */
  var TH = "https://d138wa8fwgcz2d.cloudfront.net/media/catalog/product/";
  var BOOKS = [
    ["HTTYL","How to Transform Your Life",TH+"h/t/httyl_3d-_combo2019-12.jpg"],
    ["HTUM","How to Understand the Mind",TH+"h/t/htutm_3d-paperback-front_and_ebook-phone-android-cover_combo_2020-01.jpg"],
    ["JPGF","Joyful Path of Good Fortune",TH+"j/o/jo5e0d_1.jpg"],
    ["MOD","The Mirror of Dharma with Additions",TH+"m/o/mod-addts_3d-ppback-front_ebk-ph-andr-cover_and-mp3-player-apple_combo_2020-01.jpg"],
    ["NHW","The New Heart of Wisdom",TH+"n/e/new-heart-of-wisdom_3d-paperback-front_ebook_audio_combo_2024-05_web.jpg"],
    ["MB","Modern Buddhism",TH+"m/o/modern-buddhism_3d-paperback-front_ebook_audio_combo_2021-12.jpg"],
    ["TGP","Tantric Grounds and Paths",TH+"t/a/tantric-grounds-and-paths_3d-book_ebook-phone_and_audio-player_2021-06_web.jpg"],
    ["NGDL","The New Guide to Dakini Land",TH+"n/e/new-guide-to-dakini-land_3d-paperback-front_ebook_audio_combo_2024-10_web.png"],
    ["EOV","Essence of Vajrayana",TH+"e/s/essence-of-vajrayana_3d-paperback-front_ebook_audio_combo_2024-12.jpg"],
    ["OIM","The Oral Instructions of Mahamudra",TH+"o/r/ord436_1.jpg"],
    ["GTM","Great Treasury of Merit",TH+"g/r/great-treasury-of-merit_3d-paperback-front_ebook_audio_combo_2025-09_web.jpg"],
    ["NESH","The New Eight Steps to Happiness",TH+"n/e/new-eight-steps-to-happiness_3d-pbk-fr_ebook-phone-_and_-mp3-combo_2019-07.jpg"],
    ["ITB","Introduction to Buddhism",TH+"i/n/introduction-to-buddhism_3d-paperback-front_ebook_audio_combo_2024-03_web.jpg"],
    ["SOHP","How to Solve Our Human Problems",TH+"q/g/qgxzztda.jpeg"],
    ["MTB","Meaningful to Behold",TH+"m/e/meaningful-to-behold_3d-paperback-front_and_ebook-phone-android-cover_combo_2019-02.jpg"],
    ["GBWL","Guide to the Bodhisattva's Way of Life",TH+"g/t/gttbway-of-life_3d-combo2019-12.jpg"],
    ["BV","The Bodhisattva Vow",TH+"b/o/bodhisattva-vow_3d-paperback-front_and_ebook-phone-android-cover_combo_2020-12_web.jpg"],
    ["UC","Universal Compassion",TH+"u/n/universal-compassion_3d-paperback-front_ebook_combo_2023-05_web_1.jpg"],
    ["NMH","The New Meditation Handbook",TH+"n/m/nmh_3d-ppback-apple_combo2020-01_1.jpg"],
    ["LMDJ","Living Meaningfully, Dying Joyfully",TH+"l/i/living-meaningfully-dying-joyfully_3d-paperback-front_ebook_audio_combo_2025-04_web.jpg"],
    ["ON","Ocean of Nectar",TH+"o/c/ocd3d7_1.jpg"],
    ["HJ","Heart Jewel",TH+"h/e/heart-jewel_3d-paperback-front_ebook_audio_combo_2025-03_web.jpg"],
    ["CLB","Clear Light of Bliss",TH+"c/l/clear_light_of_bliss_3d-paperback-front_and_ebook-phone-android-cover_combo_web_2019-09.jpg"],
    ["MT","Mahamudra Tantra",TH+"m/a/mahamudra-tantra_2d-paperback-front-crop_2024-10_web_1.jpg"]
  ];
  function norm(s){ return String(s||"").toLowerCase().replace(/[’‘]/g,"'").trim(); }
  var _bk={}, _cv={};
  BOOKS.forEach(function(b){ _bk[norm(b[0])]=b[1]; _bk[norm(b[1])]=b[1]; _cv[norm(b[0])]=b[2]; _cv[norm(b[1])]=b[2]; });
  function bookTitle(x){ return x ? (_bk[norm(x)] || String(x)) : ""; }
  function bookCover(x){ return x ? (_cv[norm(x)] || "") : ""; }

  /* DEMO rows — shown until the CSV addresses above are filled in */
  var DEMO = {
    fp: [
      { date:"2026-08-25", type:"Teaching",   desc:"Demo recording — sound check", book:"MB",  teacher:"Gen Jangchub", url:"https://audio.meditationincheltenham.org.uk/fp-2026-08-25-demo.mp3" },
      { date:"2026-09-01", type:"Discussion", desc:"Demo recording — sound check", book:"NMH", teacher:"",             url:"https://audio.meditationincheltenham.org.uk/fp-2026-09-01-demo.mp3" }
    ],
    ttp: [
      { date:"2026-08-27", type:"Teaching",        desc:"Demo recording — sound check", book:"BV", teacher:"Gen Jangchub", url:"https://audio.meditationincheltenham.org.uk/ttp-2026-08-27-demo.mp3" },
      { date:"2026-09-03", type:"Teaching skills", desc:"Demo recording — 45 minutes",  book:"BV", teacher:"",             url:"https://audio.meditationincheltenham.org.uk/ttp-2026-09-03-demo-45min.mp3" }
    ]
  };

  /* ---------------- CSS (scoped under .akx-recordings) ---------------- */
  var CSS =
  ".akx-recordings{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1D1D1F;max-width:760px;margin:0 auto;}" +
  ".akx-recordings *{box-sizing:border-box;}" +
  ".akx-recordings .akr-hd{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:32px;color:#FC9602;text-align:center;margin:0 0 4px;}" +
  ".akx-recordings .akr-lead{text-align:center;color:#6b675f;font-size:14.5px;margin:0 0 22px;}" +
  /* now-playing card */
  ".akx-recordings .akr-np{background:#2A66A6;border-radius:16px;color:#fff;padding:18px 20px 16px;box-shadow:0 6px 22px rgba(42,102,166,.25);margin-bottom:14px;display:none;}" +
  ".akx-recordings .akr-np.on{display:block;}" +
  ".akx-recordings .akr-np .lbl{font-size:10.5px;font-weight:700;letter-spacing:.1em;opacity:.75;margin-bottom:3px;}" +
  ".akx-recordings .akr-np .ttl{font-size:16px;font-weight:600;margin-bottom:12px;}" +
  ".akx-recordings .akr-bar{height:6px;background:rgba(255,255,255,.25);border-radius:999px;position:relative;cursor:pointer;margin-bottom:6px;}" +
  ".akx-recordings .akr-bar .fill{position:absolute;left:0;top:0;bottom:0;width:0%;background:#FC9602;border-radius:999px;}" +
  ".akx-recordings .akr-bar .dot{position:absolute;left:0%;top:50%;width:14px;height:14px;background:#fff;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 1px 4px rgba(0,0,0,.3);}" +
  ".akx-recordings .akr-times{display:flex;justify-content:space-between;font-size:11.5px;opacity:.85;font-variant-numeric:tabular-nums;margin-bottom:12px;}" +
  ".akx-recordings .akr-ctr{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;}" +
  ".akx-recordings .akr-btn{border:0;cursor:pointer;color:#fff;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:inherit;}" +
  ".akx-recordings .akr-btn:hover{background:rgba(255,255,255,.28);}" +
  ".akx-recordings .akr-play{width:54px;height:54px;background:#fff;color:#2A66A6;font-size:19px;}" +
  ".akx-recordings .akr-play:hover{background:#f2f6fb;}" +
  ".akx-recordings .akr-pill{border:0;cursor:pointer;color:#fff;border-radius:999px;background:rgba(255,255,255,.16);padding:9px 14px;font-size:13px;font-weight:700;font-family:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:5px;}" +
  ".akx-recordings .akr-pill:hover{background:rgba(255,255,255,.28);color:#fff;}" +
  ".akx-recordings .akr-npmsg{font-size:12.5px;background:rgba(0,0,0,.18);border-radius:9px;padding:8px 12px;margin-top:12px;display:none;}" +
  /* conditions card */
  ".akx-recordings .akr-terms{background:#F7F5F0;border:1px solid #e9e4d8;border-radius:12px;padding:14px 18px;margin:0 0 18px;font-size:13px;line-height:1.55;color:#54524d;}" +
  ".akx-recordings .akr-terms .who{display:block;margin-top:6px;font-style:italic;color:#8a857c;}" +
  ".akx-recordings .akr-terms .cop{display:block;margin-top:2px;font-size:11.5px;color:#a09a8e;}" +
  /* resume chip */
  ".akx-recordings .akr-resume{display:flex;align-items:center;gap:10px;background:#FEF6E8;border:1px solid #f3dcb2;border-radius:12px;padding:10px 14px;margin:0 0 20px;font-size:13.5px;line-height:1.4;}" +
  ".akx-recordings .akr-resume b{color:#c47a02;}" +
  ".akx-recordings .akr-resume .go{margin-left:auto;background:#FC9602;color:#fff;border:0;cursor:pointer;border-radius:999px;padding:7px 15px;font-weight:700;font-size:12.5px;white-space:nowrap;font-family:inherit;}" +
  /* list */
  ".akx-recordings .akr-mon{font-family:'Fraunces',Georgia,serif;font-weight:600;color:#b5443c;font-size:17px;margin:20px 0 4px;}" +
  ".akx-recordings .akr-row{display:flex;align-items:center;gap:13px;padding:11px 8px;border-bottom:1px solid #f0ede6;border-radius:10px;}" +
  ".akx-recordings .akr-row .d{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:#8a857c;width:56px;flex-shrink:0;line-height:1.3;}" +
  ".akx-recordings .akr-row .cv{width:46px;height:52px;flex-shrink:0;object-fit:contain;border-radius:4px;}" +
  ".akx-recordings .akr-row .t{font-size:14.5px;font-weight:500;flex:1;min-width:0;}" +
  ".akx-recordings .akr-row .t .sub{display:block;font-size:12px;color:#8a857c;font-weight:400;margin-top:2px;}" +
  ".akx-recordings .akr-row .tick{color:#3E7C46;font-size:11.5px;font-weight:700;white-space:nowrap;}" +
  ".akx-recordings .akr-row .pb{width:36px;height:36px;border-radius:50%;border:1.5px solid #2A66A6;background:#fff;color:#2A66A6;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;cursor:pointer;}" +
  ".akx-recordings .akr-row .dlb{width:36px;height:36px;border-radius:50%;border:1.5px solid #d8d3c6;background:#fff;color:#8a857c;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;cursor:pointer;text-decoration:none;}" +
  ".akx-recordings .akr-row.playing{background:#F3F7FB;border-bottom-color:transparent;}" +
  ".akx-recordings .akr-row.playing .pb{background:#2A66A6;color:#fff;}" +
  ".akx-recordings .akr-row.listened .t{color:#8a857c;font-weight:400;}" +
  ".akx-recordings .akr-note{text-align:center;color:#a09a8e;font-size:12px;margin-top:22px;}" +
  ".akx-recordings .akr-demo{text-align:center;color:#b5443c;background:#FBF1EF;border-radius:10px;font-size:12.5px;padding:8px 14px;margin:0 0 16px;}" +
  "@media (max-width:600px){" +
  " .akx-recordings .akr-hd{font-size:26px;}" +
  " .akx-recordings .akr-row .d{width:46px;font-size:11px;}" +
  " .akx-recordings .akr-row .cv{width:36px;height:44px;}" +
  " .akx-recordings .akr-ctr{gap:10px;}" +
  "}";

  /* ---------------- helpers ---------------- */
  function el(tag, cls, txt){ var e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; }
  var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
  var DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  function parseDate(s){
    s=String(s||"").trim(); if(!s) return null;
    var m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if(m) return new Date(+m[1],+m[2]-1,+m[3]);
    m=s.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4})/); if(m){ var y=+m[3]; if(y<100)y+=2000; return new Date(y,+m[2]-1,+m[1]); }
    var d=new Date(s); return isNaN(d)?null:d;
  }
  function fmtT(sec){ if(!isFinite(sec)||sec<0) sec=0; sec=Math.floor(sec);
    var h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60, mm=(h?String(m).padStart(2,"0"):m);
    return (h?h+":":"")+mm+":"+String(s).padStart(2,"0"); }

  /* per-listener memory (this browser only) — safe if storage is blocked */
  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function posKey(u){ return "akxrec-pos:"+u; }
  function doneKey(u){ return "akxrec-done:"+u; }
  function lastKey(p){ return "akxrec-last:"+p; }

  /* tiny CSV parser (quotes + commas + newlines) */
  function parseCSV(text){
    var rows=[], row=[], cur="", q=false, i, c;
    for(i=0;i<text.length;i++){ c=text[i];
      if(q){ if(c==='"'){ if(text[i+1]==='"'){cur+='"';i++;} else q=false; } else cur+=c; }
      else if(c==='"') q=true;
      else if(c===','){ row.push(cur); cur=""; }
      else if(c==='\n'||c==='\r'){ if(c==='\r'&&text[i+1]==='\n')i++; row.push(cur); rows.push(row); row=[]; cur=""; }
      else cur+=c; }
    if(cur!==""||row.length){ row.push(cur); rows.push(row); }
    return rows.filter(function(r){ return r.some(function(x){ return String(x).trim()!==""; }); });
  }
  function rowsToItems(rows){
    if(!rows.length) return [];
    var head=rows[0].map(function(h){ return norm(h); });
    function col(names){ for(var i=0;i<head.length;i++){ for(var j=0;j<names.length;j++){ if(head[i].indexOf(names[j])>-1) return i; } } return -1; }
    var cDate=col(["class date","date"]), cType=col(["class type","type"]), cDesc=col(["description"]),
        cBook=col(["book"]), cTeach=col(["teacher"]), cUrl=col(["recording address","address","url","link"]),
        cAct=col(["active"]);
    var out=[];
    rows.slice(1).forEach(function(r){
      function g(i){ return i>-1 ? String(r[i]||"").trim() : ""; }
      if(cAct>-1 && /^no$/i.test(g(cAct))) return;
      var url=g(cUrl); if(!url) return;
      out.push({ date:g(cDate), type:g(cType), desc:g(cDesc), book:g(cBook), teacher:g(cTeach), url:url });
    });
    return out;
  }

  /* ---------------- widget ---------------- */
  function build(host){
    var prog = norm(host.getAttribute("data-prog")||"");
    var cfg = PROG[prog]; if(!cfg){ return; }

    var audio = new Audio(); audio.preload = "none";
    var items = [], current = null, rowsByUrl = {};

    host.appendChild(el("h2","akr-hd",cfg.name));
    host.appendChild(el("p","akr-lead",cfg.sub));

    /* conditions card */
    var terms = el("div","akr-terms");
    terms.appendChild(document.createTextNode("I understand the Homestudy recordings for "+(prog==="ttp"?"TTP":"FP")+" are provided by the centre for my personal use as an enrolled student on the programme and may not be shared."));
    terms.appendChild(el("span","who","— Education Programme Coordinator"));
    terms.appendChild(el("span","cop","© Akanishta Kadampa Buddhist Centre "+(new Date()).getFullYear()));
    host.appendChild(terms);

    /* now-playing card */
    var np = el("div","akr-np");
    np.appendChild(el("div","lbl","NOW PLAYING"));
    var npTtl = el("div","ttl",""); np.appendChild(npTtl);
    var bar = el("div","akr-bar"), fill = el("div","fill"), dot = el("div","dot");
    bar.appendChild(fill); bar.appendChild(dot); np.appendChild(bar);
    var times = el("div","akr-times"); var tCur = el("span",null,"0:00"), tRem = el("span",null,"–0:00");
    times.appendChild(tCur); times.appendChild(tRem); np.appendChild(times);
    var ctr = el("div","akr-ctr");
    var back = el("button","akr-btn","−15s"), play = el("button","akr-btn akr-play","▶"), fwd = el("button","akr-btn","+15s");
    var spd = el("button","akr-pill","1×");
    var dl  = el("a","akr-pill","⬇ Download"); dl.target="_blank"; dl.rel="noopener";
    ctr.appendChild(back); ctr.appendChild(play); ctr.appendChild(fwd); ctr.appendChild(spd); ctr.appendChild(dl);
    np.appendChild(ctr);
    var npMsg = el("div","akr-npmsg",""); np.appendChild(npMsg);
    host.appendChild(np);

    var resumeBox = el("div"); host.appendChild(resumeBox);
    var demoBox = el("div"); host.appendChild(demoBox);
    var listBox = el("div"); host.appendChild(listBox);
    host.appendChild(el("p","akr-note","Recordings stay available for the study year · please don't share outside the programme"));

    var SPEEDS=[1,1.25,1.5];
    function setSpeed(i){ audio.playbackRate=SPEEDS[i]; spd.textContent=SPEEDS[i]+"×"; spd.dataset.i=i; }
    spd.addEventListener("click",function(){ setSpeed((+spd.dataset.i+1)%SPEEDS.length); });
    setSpeed(0);

    back.addEventListener("click",function(){ audio.currentTime=Math.max(0,audio.currentTime-15); });
    fwd.addEventListener("click",function(){ audio.currentTime=Math.min(audio.duration||1e9,audio.currentTime+15); });
    play.addEventListener("click",function(){ if(!current) return; if(audio.paused) audio.play(); else audio.pause(); });
    bar.addEventListener("click",function(ev){ if(!audio.duration) return;
      var r=bar.getBoundingClientRect(); audio.currentTime=audio.duration*Math.min(1,Math.max(0,(ev.clientX-r.left)/r.width)); });

    function itemTitle(it){ return it.desc || it.type || "Class recording"; }
    function subLine(it){
      var bits=[]; if(it.type) bits.push(it.type);
      var b=bookTitle(it.book); if(b) bits.push(b);
      if(it.teacher) bits.push(it.teacher);
      return bits.join(" · ");
    }

    function markRows(){
      Object.keys(rowsByUrl).forEach(function(u){
        var r=rowsByUrl[u];
        r.row.classList.toggle("playing", !!current && current.url===u && !audio.paused);
        r.pb.textContent = (!!current && current.url===u && !audio.paused) ? "❚❚" : "▶";
      });
      play.textContent = audio.paused ? "▶" : "❚❚";
    }

    function start(it, at){
      current = it;
      np.classList.add("on");
      npTtl.textContent = itemTitle(it) + (bookTitle(it.book) ? " — " + bookTitle(it.book) : "");
      dl.href = it.url;
      npMsg.style.display="none";
      if(audio.src !== it.url){ audio.src = it.url; }
      var rate = SPEEDS[+spd.dataset.i]; /* keep chosen speed across tracks */
      var go = function(){ audio.playbackRate = rate; if(at) audio.currentTime = at; audio.play().catch(function(){}); };
      go();
      lsSet(lastKey(prog), it.url);
      renderResume(); markRows();
    }

    audio.addEventListener("timeupdate",function(){
      if(!audio.duration) return;
      var p=audio.currentTime/audio.duration*100;
      fill.style.width=p+"%"; dot.style.left=p+"%";
      tCur.textContent=fmtT(audio.currentTime);
      tRem.textContent="−"+fmtT(audio.duration-audio.currentTime);
      if(current){ lsSet(posKey(current.url), String(Math.floor(audio.currentTime)));
        if(audio.currentTime/audio.duration>0.9 && lsGet(doneKey(current.url))!=="1"){ lsSet(doneKey(current.url),"1"); render(); } }
    });
    audio.addEventListener("play",markRows); audio.addEventListener("pause",markRows);
    audio.addEventListener("ended",function(){ if(current){ lsSet(doneKey(current.url),"1"); lsSet(posKey(current.url),"0"); } render(); });
    audio.addEventListener("error",function(){
      npMsg.textContent="This recording isn't reachable right now — please try again a little later.";
      npMsg.style.display="block"; markRows();
    });

    function renderResume(){
      resumeBox.innerHTML="";
      var u=lsGet(lastKey(prog)); if(!u || (current&&current.url===u&&!audio.paused)) return;
      var it=null; items.forEach(function(x){ if(x.url===u) it=x; });
      var pos=+(lsGet(posKey(u))||0);
      if(!it || pos<30) return;
      var box=el("div","akr-resume");
      var span=el("span"); span.innerHTML="↺ Welcome back — you were <b>"+fmtT(pos)+"</b> into <b></b>.";
      span.querySelectorAll("b")[1].textContent=itemTitle(it);
      var go=el("button","go","Continue ▶"); go.addEventListener("click",function(){ start(it,pos); });
      box.appendChild(span); box.appendChild(go); resumeBox.appendChild(box);
    }

    function render(){
      listBox.innerHTML=""; rowsByUrl={};
      var withD = items.map(function(it){ return { it:it, d:parseDate(it.date)||new Date(0) }; });
      withD.sort(function(a,b){ return b.d-a.d; });
      var lastMon="";
      withD.forEach(function(x){
        var it=x.it, d=x.d;
        var mon=d.getTime()?MONTHS[d.getMonth()]+(d.getFullYear()!==(new Date()).getFullYear()?" "+d.getFullYear():""):"";
        if(mon && mon!==lastMon){ listBox.appendChild(el("div","akr-mon",mon)); lastMon=mon; }
        var row=el("div","akr-row");
        var listened = lsGet(doneKey(it.url))==="1";
        if(listened) row.classList.add("listened");
        row.appendChild(el("span","d", d.getTime()? DAYS[d.getDay()]+" "+d.getDate() : ""));
        var cvUrl=bookCover(it.book);
        if(cvUrl){ var cv=document.createElement("img"); cv.className="cv"; cv.alt=""; cv.loading="lazy";
          cv.src=cvUrl; cv.addEventListener("error",function(){ cv.remove(); }); row.appendChild(cv); }
        var t=el("span","t",itemTitle(it));
        if(listened){ t.appendChild(document.createTextNode(" ")); t.appendChild(el("span","tick","✓ listened")); }
        var sl=subLine(it); if(sl) t.appendChild(el("span","sub",sl));
        row.appendChild(t);
        var pb=el("button","pb","▶");
        pb.addEventListener("click",function(){
          if(current && current.url===it.url){ if(audio.paused) audio.play(); else audio.pause(); }
          else { var pos=+(lsGet(posKey(it.url))||0); start(it, pos>30?pos:0); }
        });
        row.appendChild(pb);
        var a=el("a","dlb","⬇"); a.href=it.url; a.target="_blank"; a.rel="noopener"; a.title="Download";
        row.appendChild(a);
        rowsByUrl[it.url]={row:row,pb:pb};
        listBox.appendChild(row);
      });
      renderResume(); markRows();
    }

    /* data: published CSV when configured, DEMO otherwise */
    if(cfg.csv){
      fetch(cfg.csv+(cfg.csv.indexOf("?")>-1?"&":"?")+"cb="+Date.now())
        .then(function(r){ return r.text(); })
        .then(function(t){ items=rowsToItems(parseCSV(t)); if(!items.length){ items=DEMO[prog]||[]; } render(); })
        .catch(function(){ items=DEMO[prog]||[]; render(); });
    } else {
      items=DEMO[prog]||[];
      demoBox.appendChild(el("div","akr-demo","Showing demo entries — real class recordings will appear here soon."));
      render();
    }
  }

  /* ---------------- mount ---------------- */
  function init(){
    var hosts=document.querySelectorAll(".akx-recordings");
    if(!hosts.length) return;
    var style=document.createElement("style"); style.textContent=CSS; document.head.appendChild(style);
    hosts.forEach(function(h){ build(h); });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
