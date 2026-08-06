/* ids-showcase.js  -  In-depth Study book showcase (FP & TTP)
   Books are baked in here. ONLY the changeable bits (which book is being
   studied now / next) come from the Google Sheet tab "Study Books".
   Mount: <div id="akx-ids-showcase"></div>
   ASCII-only source (HTML entities used for punctuation).
*/
(function(){
  var MOUNT = 'akx-ids-showcase';
  var SHEET_ID = '1YArubV8QgCvPUIIvHOHWhCN2fYLRz0DDPSRSHD_tSmY';
  var STATUS_TAB = 'Study Books';           /* columns: Key | Status (current / next / blank) */
  var IMG = 'https://cdn.jsdelivr.net/gh/kadampacheltenham/akx-widgets@main/images/';

  /* ---- baked-in book data (order here = default FP-then-TTP order) ---- */
  var BOOKS = [
    { key:'jpgf', prog:'both', col:'#B5771E', img:'book-jpgf.jpg',
      title:'Joyful Path of Good Fortune',
      tharpa:'https://tharpa.com/uk/joyful-path-of-good-fortune',
      desc:'A clear and comprehensive explanation of the entire path to enlightenment. We all have the potential for self-transformation, and a limitless capacity for the growth of good qualities, but to fulfil this potential we need to know what to do along every stage of our spiritual journey. With this book, Geshe Kelsang offers us step-by-step guidance on the meditation practices that will lead us to lasting inner peace and happiness. With extraordinary clarity, he presents all Buddha&rsquo;s teachings in the order in which they are to be practised, enriching his explanation with stories and illuminating analogies. This is a perfect guidebook to the Buddhist path.',
      quote:'The practice of Lamrim is very important because everyone needs to cultivate peaceful states of mind&hellip; This will make all our daily actions pure and meaningful.' },

    { key:'htutm', prog:'fp', col:'#C4611A', img:'book-htutm.jpg',
      title:'How to Understand the Mind',
      tharpa:'https://tharpa.com/uk/how-to-understand-the-mind',
      desc:'This book offers us deep insight into our mind, and shows how an understanding of its nature and functions can be used practically in every day experience to improve our lives. Part 1 is a practical guide to developing and maintaining a light, positive mind &mdash; showing how to recognize and abandon states of mind that harm us, and to replace them with peaceful and beneficial ones. Part 2 describes different types of mind in detail, revealing the depth and profundity of the Buddhist understanding of the mind, and concludes with a detailed explanation of meditation.',
      quote:'Problems arise only if we respond to difficult external situations with a negative state of mind. Therefore, if we really want to be free from problems we must learn to control our mind.' },

    { key:'dakini', prog:'ttp', col:'#C0392B', img:'book-dakini.jpg',
      title:'The New Guide to Dakini Land',
      tharpa:'https://tharpa.com/uk/the-new-guide-to-dakini-land',
      desc:'Vajrayogini is a female enlightened Deity of Highest Yoga Tantra, a manifestation of all Buddha&rsquo;s wisdom. By engaging in the Tantric practice of Vajrayogini under the guidance of a qualified Spiritual Guide, sincere practitioners can completely purify their body, speech and mind and attain a state of full enlightenment. This comprehensive guide provides a detailed and practical explanation of the two stages of Vajrayogini practice &mdash; generation stage and completion stage &mdash; and shows how we can integrate these practices into daily life, transforming every moment into the path to enlightenment.',
      quote:'Living beings have many different capacities for spiritual understanding and practice&hellip; Buddha gave teachings on many levels, just as a skilful doctor administers a variety of remedies.' }
  ];

  var AUTHOR = { img:'author-gkg.jpg',
    name:'Venerable Geshe Kelsang Gyatso Rinpoche', dates:'(1932&ndash;2022)',
    bio:'Geshe-la, as he is affectionately known, is a fully accomplished meditation master who holds the very essence of Buddha&rsquo;s teachings in his heart. The founder of modern Kadampa Buddhism, and the author of twenty-three highly acclaimed books on Buddhism, he is a truly international Teacher who presents Buddha&rsquo;s teachings in ways that anyone &mdash; regardless of nationality, religion, culture, gender or age &mdash; can easily understand and apply in their daily life.',
    more:'https://kadampa.org/venerable-geshe-kelsang-gyatso' };

  var FORMATS = ['Paperback','eBook','Audiobook'];

  /* ---------- helpers ---------- */
  function csvUrl(tab){ return 'https://docs.google.com/spreadsheets/d/'+SHEET_ID+'/gviz/tq?tqx=out:csv&headers=1&sheet='+encodeURIComponent(tab); }
  function parseCSV(t){
    var rows=[], row=[], f='', q=false, i, c;
    for(i=0;i<t.length;i++){ c=t[i];
      if(q){ if(c==='"'){ if(t[i+1]==='"'){f+='"';i++;} else q=false; } else f+=c; }
      else { if(c==='"') q=true; else if(c===','){ row.push(f); f=''; }
        else if(c==='\n'){ row.push(f); rows.push(row); row=[]; f=''; }
        else if(c==='\r'){} else f+=c; } }
    if(f!==''||row.length){ row.push(f); rows.push(row); }
    return rows;
  }
  function statusFromRows(rows){
    var map={}, i, h, ki=-1, si=-1, r;
    if(!rows.length) return map;
    h=rows[0].map(function(x){return (x||'').trim().toLowerCase();});
    for(i=0;i<h.length;i++){ if(h[i]==='key') ki=i; if(h[i]==='status') si=i; }
    if(ki<0||si<0) return map;
    for(i=1;i<rows.length;i++){ r=rows[i]; if(!r||!r[ki]) continue;
      map[(r[ki]||'').trim().toLowerCase()] = (r[si]||'').trim().toLowerCase(); }
    return map;
  }
  function isFP(p){ return p==='fp'||p==='both'; }
  function isTTP(p){ return p==='ttp'||p==='both'; }

  function orderBooks(status){
    var byKey={}, i; for(i=0;i<BOOKS.length;i++) byKey[BOOKS[i].key]=BOOKS[i];
    var curFP=null, curTTP=null;
    for(i=0;i<BOOKS.length;i++){ var b=BOOKS[i]; if(status[b.key]==='current'){
      if(!curFP && isFP(b.prog)) curFP=b;
      if(!curTTP && isTTP(b.prog)) curTTP=b; } }
    var out=[], used={};
    if(curFP){ out.push(curFP); used[curFP.key]=1; }
    if(curTTP && !used[curTTP.key]){ out.push(curTTP); used[curTTP.key]=1; }
    /* remaining: FP group (fp/both) first, then TTP-only, keeping array order */
    for(i=0;i<BOOKS.length;i++){ if(!used[BOOKS[i].key] && isFP(BOOKS[i].prog)){ out.push(BOOKS[i]); used[BOOKS[i].key]=1; } }
    for(i=0;i<BOOKS.length;i++){ if(!used[BOOKS[i].key]){ out.push(BOOKS[i]); used[BOOKS[i].key]=1; } }
    return out;
  }

  function tagHTML(b,status){
    var pName = b.prog==='both' ? 'FP &amp; TTP' : (b.prog==='ttp' ? 'TTP' : 'FP');
    if(status==='current') return '<span class="ids-tag cur">Current '+pName+' Study Book</span>';
    if(status==='next'){ var np = isTTP(b.prog)?'TTP':'FP'; return '<span class="ids-tag nx">Next '+np+' Study Book</span>'; }
    return '<span class="ids-tag st '+b.prog+'">Studied on '+pName+'</span>';
  }

  function bookCard(b,status){
    var fmt=''; for(var i=0;i<FORMATS.length;i++) fmt+='<span class="ids-pill">'+FORMATS[i]+'</span>';
    return ''+
    '<article class="ids-card">'+
      '<div class="ids-cov">'+tagHTML(b,status)+'<img src="'+IMG+b.img+'" alt="'+b.title+'"></div>'+
      '<div class="ids-txt">'+
        '<h3 style="color:'+b.col+'">'+b.title+'</h3>'+
        '<div class="ids-desc">'+
          '<p>'+b.desc+'</p>'+
          '<div class="ids-q">&ldquo;'+b.quote+'&rdquo;</div>'+
        '</div>'+
        '<button class="ids-more" type="button">Read more</button>'+
        '<a class="ids-authlink" href="#'+MOUNT+'-author">About the author &rarr;</a>'+
        '<div class="ids-cta">'+
          '<div class="ids-fmts"><span class="ids-fl">Available as</span>'+fmt+'</div>'+
          '<div class="ids-buy"><span class="ids-stk">&#10003; In stock at our bookshop</span>'+
            '<a class="ids-ord" href="'+b.tharpa+'" target="_blank" rel="noopener">Order from Tharpa UK &rarr;</a></div>'+
        '</div>'+
      '</div>'+
    '</article>';
  }
  function authorCard(){
    return ''+
    '<article class="ids-card ids-author" id="'+MOUNT+'-author">'+
      '<div class="ids-cov"><img src="'+IMG+AUTHOR.img+'" alt="'+AUTHOR.name+'"></div>'+
      '<div class="ids-txt">'+
        '<span class="ids-atag">About the author</span>'+
        '<h3>'+AUTHOR.name+' <span class="ids-dates">'+AUTHOR.dates+'</span></h3>'+
        '<div class="ids-desc"><p>'+AUTHOR.bio+'</p></div>'+
        '<button class="ids-more" type="button">Read more</button>'+
        '<a class="ids-findout" href="'+AUTHOR.more+'" target="_blank" rel="noopener">Find out more&hellip; &rarr;</a>'+
      '</div>'+
    '</article>';
  }

  function css(){ return ''+
'#'+MOUNT+'{--paper:#fff;--ink:#1D1D1F;--mut:#5b5952;--teal:#2E7C7C;--coral:#E2886A;--blue:#2A66A6;--line:#e7e0d3;'+
'font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);max-width:1080px;margin:0 auto;position:relative}'+
'#'+MOUNT+' *{box-sizing:border-box}'+
'#'+MOUNT+' .ids-view{overflow:hidden}'+
'#'+MOUNT+' .ids-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}'+
'#'+MOUNT+' .ids-track::-webkit-scrollbar{display:none}'+
'#'+MOUNT+' .ids-card{scroll-snap-align:center;flex:0 0 100%;display:grid;grid-template-columns:380px 1fr;gap:46px;align-items:center;background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:32px}'+
'#'+MOUNT+' .ids-cov{position:relative;background:#fff;border-radius:12px;overflow:hidden;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center}'+
'#'+MOUNT+' .ids-cov img{width:100%;height:100%;object-fit:contain;display:block}'+
'#'+MOUNT+' .ids-tag{position:absolute;top:26px;left:26px;z-index:2;display:inline-flex;align-items:center;gap:5px;font-size:.75rem;font-weight:700;color:#fff;padding:5px 12px;border-radius:999px;box-shadow:0 3px 10px rgba(0,0,0,.16)}'+
'#'+MOUNT+' .ids-tag.st.fp{background:#2f8a56}#'+MOUNT+' .ids-tag.st.both{background:#7a55b3}#'+MOUNT+' .ids-tag.st.ttp{background:#C77B33}'+
'#'+MOUNT+' .ids-tag.cur{background:var(--coral)}#'+MOUNT+' .ids-tag.nx{background:#8d867b}'+
'#'+MOUNT+' h3{margin:0 0 8px;font-size:1.55rem;font-weight:600;line-height:1.15}'+
'#'+MOUNT+' .ids-desc p{margin:0;color:#2f2d29;font-size:1rem;line-height:1.55}'+
'#'+MOUNT+' .ids-q{font-style:italic;color:var(--mut);border-left:3px solid var(--coral);padding-left:14px;margin-top:14px;font-size:.97rem}'+
'#'+MOUNT+' .ids-more{display:none;margin-top:10px;background:none;border:none;padding:0;color:var(--coral);font-weight:700;font-size:.85rem;cursor:pointer;font-family:inherit}'+
'#'+MOUNT+' .ids-authlink{display:block;text-align:left;margin-top:10px;color:var(--coral);font-weight:700;font-size:.78rem;letter-spacing:.6px;text-transform:uppercase;text-decoration:none}'+
'#'+MOUNT+' .ids-authlink:hover{text-decoration:underline}'+
'#'+MOUNT+' .ids-cta{margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}'+
'#'+MOUNT+' .ids-fmts{display:flex;align-items:center;gap:8px;flex-wrap:wrap}#'+MOUNT+' .ids-fl{font-size:.82rem;color:var(--mut)}'+
'#'+MOUNT+' .ids-pill{font-size:.75rem;font-weight:600;color:var(--teal);background:#e5efee;padding:4px 10px;border-radius:999px}'+
'#'+MOUNT+' .ids-buy{margin-top:10px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}'+
'#'+MOUNT+' .ids-stk{display:inline-flex;align-items:center;gap:6px;font-size:.84rem;font-weight:600;color:var(--teal)}'+
'#'+MOUNT+' .ids-ord{color:var(--coral);font-weight:600;font-size:.87rem;text-decoration:none}#'+MOUNT+' .ids-ord:hover{text-decoration:underline}'+
'#'+MOUNT+' .ids-author{background:linear-gradient(150deg,#2E7C7C,#245f5f);color:#fff;border:none}'+
'#'+MOUNT+' .ids-author h3{color:#fff}#'+MOUNT+' .ids-author .ids-desc p{color:#eaf3f2}'+
'#'+MOUNT+' .ids-atag{display:inline-block;background:#ffffff26;color:#fff;font-size:.74rem;font-weight:700;padding:5px 11px;border-radius:999px;margin-bottom:10px}'+
'#'+MOUNT+' .ids-dates{font-size:.9rem;font-weight:500;color:#cfe6e4}'+
'#'+MOUNT+' .ids-author .ids-cov{aspect-ratio:4/5;background:#e9e2d4}#'+MOUNT+' .ids-author .ids-cov img{object-fit:cover}'+
'#'+MOUNT+' .ids-findout{display:block;text-align:right;margin-top:12px;color:#ffd9c9;font-weight:600;font-size:.9rem;text-decoration:none}'+
/* nav */
'#'+MOUNT+' .ids-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:5;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.14);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--blue)}'+
'#'+MOUNT+' .ids-nav:hover{background:#fbf6ed}'+
'#'+MOUNT+' .ids-prev{left:-10px}#'+MOUNT+' .ids-next{right:-10px}'+
'#'+MOUNT+' .ids-nav[disabled]{opacity:.35;cursor:default}'+
'#'+MOUNT+' .ids-dots{display:flex;justify-content:center;gap:8px;margin-top:16px}'+
'#'+MOUNT+' .ids-dot{width:9px;height:9px;border-radius:50%;background:#d7d0c2;border:none;padding:0;cursor:pointer}'+
'#'+MOUNT+' .ids-dot.on{background:var(--coral)}'+
/* ---------- mobile ---------- */
'@media (max-width:820px){'+
'#'+MOUNT+' .ids-card{grid-template-columns:1fr;gap:0;padding:0;overflow:hidden;border-radius:16px;margin:0 4px}'+
'#'+MOUNT+' .ids-cov{border-radius:0;aspect-ratio:4/3}'+
'#'+MOUNT+' .ids-author .ids-cov{aspect-ratio:1}'+
'#'+MOUNT+' .ids-txt{padding:16px 18px 18px}'+
'#'+MOUNT+' h3{font-size:1.14rem}'+
'#'+MOUNT+' .ids-tag{top:12px;left:12px;background:#fff;color:var(--ink);box-shadow:0 2px 9px rgba(0,0,0,.28)}'+
'#'+MOUNT+' .ids-tag::before{content:"";width:8px;height:8px;border-radius:50%;background:#999}'+
'#'+MOUNT+' .ids-tag.st.fp::before{background:#2f8a56}#'+MOUNT+' .ids-tag.st.both::before{background:#7a55b3}#'+MOUNT+' .ids-tag.st.ttp::before{background:#C77B33}'+
'#'+MOUNT+' .ids-tag.cur::before{background:var(--coral)}#'+MOUNT+' .ids-tag.nx::before{background:#8d867b}'+
'#'+MOUNT+' .ids-fl{display:none}'+
/* collapse text ~50% until expanded */
'#'+MOUNT+' .ids-desc{max-height:9.2em;overflow:hidden;position:relative;transition:max-height .25s ease}'+
'#'+MOUNT+' .ids-desc::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2.6em;background:linear-gradient(rgba(255,255,255,0),#fff)}'+
'#'+MOUNT+' .ids-author .ids-desc::after{background:linear-gradient(rgba(38,95,95,0),#2b6b6b)}'+
'#'+MOUNT+' .ids-card.open .ids-desc{max-height:200em}'+
'#'+MOUNT+' .ids-card.open .ids-desc::after{display:none}'+
'#'+MOUNT+' .ids-more{display:inline-block}'+
'#'+MOUNT+' .ids-nav{display:none}'+
'}';
  }

  function svg(dir){ return dir==='prev'
    ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'
    : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>'; }

  function render(mount, ordered){
    var cards=''; for(var i=0;i<ordered.length;i++){ var b=ordered[i]; cards+=bookCard(b, b.__status||''); }
    cards += authorCard();
    mount.innerHTML =
      '<button class="ids-nav ids-prev" aria-label="Previous">'+svg('prev')+'</button>'+
      '<div class="ids-view"><div class="ids-track">'+cards+'</div></div>'+
      '<button class="ids-nav ids-next" aria-label="Next">'+svg('next')+'</button>'+
      '<div class="ids-dots"></div>';

    var track=mount.querySelector('.ids-track');
    var cardEls=track.querySelectorAll('.ids-card');
    var prev=mount.querySelector('.ids-prev'), next=mount.querySelector('.ids-next');
    var dotsWrap=mount.querySelector('.ids-dots');
    var idx=0, n=cardEls.length, d;
    for(d=0; d<n; d++){ var dot=document.createElement('button'); dot.className='ids-dot'+(d===0?' on':''); dot.setAttribute('data-i',d); dotsWrap.appendChild(dot); }
    var dots=dotsWrap.querySelectorAll('.ids-dot');

    function go(i){ i=Math.max(0,Math.min(n-1,i)); idx=i; track.scrollTo({left:cardEls[i].offsetLeft-track.offsetLeft, behavior:'smooth'}); update(); }
    function nearest(){ var best=0,bd=1e9,k; for(k=0;k<n;k++){ var dd=Math.abs((cardEls[k].offsetLeft-track.offsetLeft)-track.scrollLeft); if(dd<bd){bd=dd;best=k;} } return best; }
    function update(){ prev.disabled=(idx<=0); next.disabled=(idx>=n-1);
      for(var k=0;k<n;k++) dots[k].className='ids-dot'+(k===idx?' on':''); }

    prev.addEventListener('click',function(){ go(idx-1); });
    next.addEventListener('click',function(){ go(idx+1); });
    for(d=0; d<n; d++) dots[d].addEventListener('click',function(){ go(parseInt(this.getAttribute('data-i'),10)); });
    var st; track.addEventListener('scroll',function(){ clearTimeout(st); st=setTimeout(function(){ idx=nearest(); update(); },90); });
    /* read more (mobile) */
    mount.addEventListener('click',function(e){ if(e.target && e.target.classList.contains('ids-more')){
      var card=e.target.closest('.ids-card'); if(!card) return; var op=card.classList.toggle('open');
      e.target.textContent = op ? 'Read less' : 'Read more'; } });
    update();
  }

  function boot(){
    var mount=document.getElementById(MOUNT); if(!mount) return;
    if(!document.getElementById('ids-showcase-css')){ var s=document.createElement('style'); s.id='ids-showcase-css'; s.textContent=css(); document.head.appendChild(s); }
    function draw(status){ var ordered=orderBooks(status); for(var i=0;i<ordered.length;i++) ordered[i].__status=status[ordered[i].key]||''; render(mount, ordered); }
    /* fetch changeable current/next from the sheet; fall back to defaults if unavailable */
    try{
      fetch(csvUrl(STATUS_TAB)).then(function(r){return r.text();})
        .then(function(t){ draw(statusFromRows(parseCSV(t))); })
        .catch(function(){ draw({}); });
    }catch(e){ draw({}); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
