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
      link:'https://kadampa.org/book/joyful-path-of-good-fortune-2',
      desc:'A clear and comprehensive explanation of the entire path to enlightenment. We all have the potential for self-transformation, and a limitless capacity for the growth of good qualities, but to fulfil this potential we need to know what to do along every stage of our spiritual journey. With this book, Geshe Kelsang offers us step-by-step guidance on the meditation practices that will lead us to lasting inner peace and happiness. With extraordinary clarity, he presents all Buddha&rsquo;s teachings in the order in which they are to be practised, enriching his explanation with stories and illuminating analogies. This is a perfect guidebook to the Buddhist path.',
      quote:'The practice of Lamrim is very important because everyone needs to cultivate peaceful states of mind. By listening to or reading these teachings we can learn how to control our mind and always keep a good motivation in our heart. This will make all our daily actions pure and meaningful.' },

    { key:'ucomp', prog:'both', col:'#C9911F', img:'book-ucomp.jpg',
      title:'Universal Compassion',
      link:'https://kadampa.org/book/universal-compassion',
      desc:'The heart of Buddha&rsquo;s teachings is unconditional love and compassion. In this inspiring explanation of the popular Buddhist poem Training the Mind in Seven Points, Geshe Kelsang reveals powerful and far-reaching methods for us to develop these altruistic states. Ancient meditative techniques that have been tried and tested for centuries are brought alive and made relevant to our everyday experiences. Also included is a practical explanation of how we can transform our day-to-day problems &ndash; even the most demanding and difficult conditions &ndash; into opportunities for personal and spiritual development. By pointing the way to an unchanging freedom and happiness, this immensely readable book challenges us to grow, and will have a remarkable impact on our life.',
      quote:'To have the opportunity to practise this precious and profound teaching is infinitely more meaningful than being given all the precious jewels in the world.' },

    { key:'eight', prog:'both', col:'#4B8B3B', img:'book-eight.jpg',
      title:'The New Eight Steps to Happiness',
      link:'https://kadampa.org/book/eight-steps-to-happiness',
      desc:'A detailed and practical explanation of one of Buddhism&rsquo;s best-loved teachings, Eight Verses of Training the Mind, by the great Bodhisattva, Langri Tangpa. Clear methods are simply presented for transforming all life&rsquo;s difficulties into valuable spiritual insights, for improving our relationships, and for bringing greater patience, empathy and compassion into our daily life. These methods have inspired generations of Buddhist practitioners for almost a thousand years, and brought lasting peace, inspiration and serenity to countless people. Now, with this book, Venerable Geshe Kelsang shares the immeasurably rich insight of this ancient wisdom to help us find greater happiness and meaning in our busy, modern lives.',
      quote:'Everyone, whether religious or non-religious, is looking for happiness all the time and wants to be free from problems and suffering permanently. We can fulfil these wishes through understanding and practising the instructions given in this book.' },

    { key:'nhw', prog:'both', col:'#2A66A6', img:'book-nhw.jpg',
      title:'The New Heart of Wisdom',
      link:'https://kadampa.org/book/the-new-heart-of-wisdom-2',
      desc:'This special presentation of Buddha&rsquo;s teachings by the author of Modern Buddhism offers truly liberating insights and advice for the contemporary reader. It reveals the profound meaning of the very heart of Buddha&rsquo;s teachings &ndash; the Perfection of Wisdom Sutras. The author shows how all our problems and suffering come from our ignorance of the ultimate nature of things, and how we can abandon this ignorance and come to enjoy pure, lasting happiness by developing a special wisdom associated with compassion for all living beings.',
      quote:'Wisdom will never deceive us. It is our inner Spiritual Guide, who leads us to the correct path.' },

    { key:'mtb', prog:'both', col:'#B23A34', img:'book-mtb.jpg',
      title:'Meaningful to Behold',
      link:'https://kadampa.org/book/meaningful-to-behold',
      desc:'This highly acclaimed work is based on the great Indian Buddhist Master Shantideva&rsquo;s famous spiritual poem Guide to the Bodhisattva&rsquo;s Way of Life, one of the best loved and most important Mahayana Buddhist texts, which reveals with poetic beauty and deep spiritual insight how to enter, make progress on, and complete the Buddhist path to enlightenment. Bodhisattvas are friends of the world, who have such strong compassion that they are able to transform all their daily activities into ways of benefiting others. With this commentary, the full effectiveness and profundity of this wonderful poem are revealed in full and made applicable for our time.',
      quote:'At this moment we have attained a precious human life far more valuable than gold, but if we do not recognize its worth we are apt to squander it in meaningless and purposeless pursuits.' },

    { key:'htutm', prog:'both', col:'#C4611A', img:'book-htutm.jpg',
      title:'How to Understand the Mind',
      link:'https://kadampa.org/book/how-to-understand-the-mind',
      desc:'This book offers us deep insight into our mind, and shows how an understanding of its nature and functions can be used practically in every day experience to improve our lives. Part 1 is a practical guide to developing and maintaining a light, positive mind &ndash; showing how to recognize and abandon states of mind that harm us, and to replace them with peaceful and beneficial ones. Part 2 describes different types of mind in detail, revealing the depth and profundity of the Buddhist understanding of the mind. It concludes with a detailed explanation of meditation, showing how by controlling and transforming our mind we can attain a lasting state of joy, independent of external conditions.',
      quote:'Problems arise only if we respond to difficult external situations with a negative state of mind. Therefore, if we really want to be free from problems we must learn to control our mind.' },

    { key:'ocean', prog:'ttp', col:'#3A7CA5', img:'book-ocean.jpg',
      title:'Ocean of Nectar',
      link:'https://kadampa.org/book/ocean-of-nectar',
      desc:'Ocean of Nectar is the first complete explanation in English of the renowned Indian Buddhist Master Chandrakirti&rsquo;s Guide to the Middle Way, a precious Mahayana scripture, which to this day is regarded as the principal presentation of Buddha&rsquo;s profound view of emptiness, the ultimate nature of reality. With a definitive translation and verse-by-verse commentary, the author reveals this profound meaning to the modern world with utmost clarity, and guides us along the stages of the Bodhisattva path to full enlightenment. This book is an indispensable guide for the serious practitioner of Mahayana Buddhism.',
      quote:'From the extremely vast and deep ocean of Nagarjuna&rsquo;s wisdom the precious nectar of emptiness has flowed forth, completely fulfilling the hopes of Madhyamika scholars such as Chandrakirti.' },

    { key:'clb', prog:'ttp', col:'#4A8FA6', img:'book-clb.jpg',
      title:'Clear Light of Bliss',
      link:'https://kadampa.org/book/clear-light-of-bliss',
      desc:'Within all of us lies a source of infinite bliss, clarity of wisdom, and compassion for others. In this unique and highly praised book, based on Buddha&rsquo;s Tantric teachings, Geshe Kelsang Gyatso presents authentic methods for discovering this inner wealth for ourselves. In a clear and precise way, he explains step-by-step how we can generate a deeply peaceful and concentrated mind by harnessing the subtle energy system within our body. With this blissful awareness we can uncover our true nature, destroy ignorance and suffering at its root, and swiftly become a source of inspiration and benefit for others.',
      quote:'The highest of all possible human goals is the attainment of complete enlightenment, an ultimate state of peace in which all obstacles obscuring the mind have been removed and all good qualities have been fully developed.' },

    { key:'bvow', prog:'ttp', col:'#B5771E', img:'book-bvow.jpg',
      title:'The Bodhisattva Vow',
      link:'https://kadampa.org/book/the-bodhisattva-vow',
      desc:'A Bodhisattva is a friend of the world who, motivated by compassion, seeks enlightenment to benefit all living beings. In this welcome guide to compassionate living, Geshe Kelsang explains in detail how to take and keep the Bodhisattva vows, how to purify negative minds, and how to practise the Bodhisattva&rsquo;s actions of giving, moral discipline, patience, effort, concentration and wisdom. With this handbook as our companion, we can enter the Bodhisattva&rsquo;s way of life and progress along the path to full enlightenment.',
      quote:'The term Bodhisattva is the name given to anyone who, motivated by great compassion, has generated bodhichitta, a spontaneous wish to attain Buddhahood for the benefit of all living beings.' },

    { key:'gtom', prog:'ttp', col:'#2A66A6', img:'book-gtom.jpg',
      title:'Great Treasury of Merit',
      link:'https://kadampa.org/book/great-treasury-of-merit',
      desc:'Great Treasury of Merit provides a full explanation of how to practise Offering to the Spiritual Guide (Lama Ch&ouml;pa), one of the most important meditation practices of Kadampa Buddhism. A work of unparalleled profundity and clarity, this book contains a wealth of accessible and practical instructions on Lamrim, Lojong and Tantric Mahamudra, the very essence of Buddha&rsquo;s teachings. An indispensable handbook for all those who wish to accomplish the swift path to enlightenment.',
      quote:'Our mind is like a field, our Spiritual Guide&rsquo;s instructions are like seeds sown in that field, and our faith in our Spiritual Guide is like water that germinates these seeds.' },

    { key:'mahamudra', prog:'ttp', col:'#C77B33', img:'book-mahamudra.jpg',
      title:'Mahamudra Tantra',
      link:'https://kadampa.org/book/mahamudra-tantra',
      desc:'Mahamudra is a Sanskrit term that means the union of great bliss and emptiness: the most subtle mind that experiences great bliss and realizes ultimate truth, or emptiness, the way things actually exist. Based on his deep knowledge and practical experience, Geshe Kelsang Gyatso explains clearly and succinctly how to prepare our mind for Mahamudra meditation, how to remove obstacles to successful practice, and how we can experience progressively subtler states of mind. By revealing how to uncover and purify the deepest level of our mind, he shows how we can destroy all our negative minds at their very root and quickly reach the state of full enlightenment.',
      quote:'Incorrect views and intentions cause us to follow wrong paths that lead to suffering, whereas correct views and intentions enable us to follow spiritual paths that lead to happiness.' },

    { key:'dakini', prog:'ttp', col:'#C0392B', img:'book-dakini.jpg',
      title:'The New Guide to Dakini Land',
      link:'https://kadampa.org/book/the-new-guide-to-dakini-land',
      desc:'Vajrayogini is a female enlightened Deity of Highest Yoga Tantra, a manifestation of all Buddha&rsquo;s wisdom. By engaging in the Tantric practice of Vajrayogini under the guidance of a qualified Spiritual Guide, sincere practitioners can completely purify their body, speech and mind and attain a state of full enlightenment, the ultimate goal of human life. This comprehensive guide provides a detailed and practical explanation of the two stages of Vajrayogini practice &ndash; generation stage and completion stage &ndash; and shows how we can integrate these practices into our daily life, transforming every moment into the path to enlightenment.',
      quote:'Living beings have many different capacities for spiritual understanding and practice. For this reason, out of his compassion, Buddha gave teachings on many levels, just as a skilful doctor administers a variety of remedies.' },

    { key:'tgp', prog:'ttp', col:'#6A4A9C', img:'book-tgp.jpg',
      title:'Tantric Grounds and Paths',
      link:'https://kadampa.org/book/tantric-grounds-and-paths',
      desc:'A definitive manual for completing the spiritual path through the practice of Highest Yoga Tantra. Actual Tantra, also known as Secret Mantra or Vajrayana, is a special method taught by Buddha to purify our world, our self, our enjoyments and our activities. Although there is great interest in Tantra, very few people understand its real meaning. Drawing from his own experience and the works of Je Tsongkhapa and other great Yogis, Geshe Kelsang presents an authoritative and comprehensive guide to the four classes of Tantra in general, and to the generation and completion stages of Highest Yoga Tantra in particular.',
      quote:'The Vajrayana path is like a vehicle that takes us directly to our final destination and the common paths are like the road on which the vehicle travels.' },

    { key:'eov', prog:'ttp', col:'#1F84C4', img:'book-eov.jpg',
      title:'Essence of Vajrayana',
      link:'https://kadampa.org/book/essence-of-vajrayana',
      desc:'Buddha Heruka is a manifestation of the enlightened compassion of all the Buddhas. By relying upon him, we can swiftly attain spontaneous great bliss, a very subtle mind of profound concentration and wisdom that enables us to realize quickly the ultimate nature of ourself and other phenomena. Geshe Kelsang Gyatso explains with clarity and precision how we can practise the sublime instructions of Heruka body mandala, and thereby gradually transform our ordinary world and experiences into those of a Buddha, a fully awakened being. This is a treasury of instructions for those wishing to follow the Tantric path.',
      quote:'If the human beings of this world sincerely rely upon Heruka with strong faith, especially at this degenerate time, Heruka will bestow powerful blessings upon them to pacify anger and conflicts.' }
  ];

  var AUTHOR = { img:'author-gkg.jpg',
    name:'Venerable Geshe Kelsang Gyatso Rinpoche', dates:'(1932&ndash;2022)',
    bio:'Geshe-la, as he is affectionately known, is a fully accomplished meditation master who holds the very essence of Buddha&rsquo;s teachings in his heart. The founder of modern Kadampa Buddhism, and the author of twenty-three highly acclaimed books on Buddhism, he is a truly international Teacher who presents Buddha&rsquo;s teachings in ways that anyone &mdash; regardless of nationality, religion, culture, gender or age &mdash; can easily understand and apply in their daily life.',
    more:'https://kadampa.org/venerable-geshe-kelsang-gyatso' };

  var FORMATS = ['Paperback','eBook','Audiobook'];

  /* baked-in fallback status - used until the sheet 'Study Books' tab has rows */
  var DEFAULT_STATUS = { 'eight':'current', 'jpgf':'next-fp', 'gtom':'next-ttp' };

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
    if(status==='next-fp') return '<span class="ids-tag nx">Next FP Study Book</span>';
    if(status==='next-ttp') return '<span class="ids-tag nx">Next TTP Study Book</span>';
    if(status==='next'){ var np = isTTP(b.prog)?'TTP':'FP'; return '<span class="ids-tag nx">Next '+np+' Study Book</span>'; }
    return '<span class="ids-tag st '+b.prog+'">Studied on '+pName+'</span>';
  }

  function bookCard(b,status){
    var fmt=''; for(var i=0;i<FORMATS.length;i++) fmt+='<span class="ids-pill">'+FORMATS[i]+'</span>';
    return ''+
    '<article class="ids-card">'+tagHTML(b,status)+
      '<div class="ids-cov"><img src="'+IMG+b.img+'" alt="'+b.title+'"></div>'+
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
            '<a class="ids-ord" href="'+b.link+'" target="_blank" rel="noopener">View the book &rarr;</a></div>'+
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
'#'+MOUNT+' .ids-card{position:relative;scroll-snap-align:center;flex:0 0 100%;display:grid;grid-template-columns:380px 1fr;gap:46px;align-items:center;background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:32px}'+
'#'+MOUNT+' .ids-cov{position:relative;background:#fff;border-radius:12px;overflow:hidden;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center}'+
'#'+MOUNT+' .ids-cov img{width:100%;height:100%;object-fit:contain;display:block}'+
'#'+MOUNT+' .ids-tag{position:absolute;top:22px;left:22px;z-index:5;display:inline-flex;align-items:center;gap:5px;font-size:.75rem;font-weight:700;color:#fff;padding:5px 12px;border-radius:999px;box-shadow:0 3px 10px rgba(0,0,0,.16)}'+
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
'#'+MOUNT+' .ids-tag{top:12px;right:12px;left:auto;background:#fff;color:var(--ink);box-shadow:0 2px 9px rgba(0,0,0,.28)}'+
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
    function hasKeys(m){ for(var k in m){ if(m.hasOwnProperty(k)) return true; } return false; }
    /* fetch changeable current/next from the sheet; fall back to baked-in defaults */
    try{
      fetch(csvUrl(STATUS_TAB)).then(function(r){return r.text();})
        .then(function(t){ var m=statusFromRows(parseCSV(t)); draw(hasKeys(m)?m:DEFAULT_STATUS); })
        .catch(function(){ draw(DEFAULT_STATUS); });
    }catch(e){ draw(DEFAULT_STATUS); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
