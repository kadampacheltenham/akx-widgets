/* Akanishta — Prayers & Pujas cards (swipe carousel, calendar-aware).
   Embed with:
     <div id="akx-prayers-cards"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/prayers-cards.js" defer></script>
   One card per puja. Reads the Prayers & Pujas Google calendar: matches each
   upcoming entry to a card by its #ABBR tag (in the event title OR description),
   shows that puja's next date, and floats the soonest-upcoming puja to the front.
   Card copy lives in CARDS below (rarely changes). Deity images live on the repo /img. */
(function(){
  var root=document.getElementById('akx-prayers-cards');
  if(!root || root.getAttribute('data-akx-done')==='1') return;
  root.setAttribute('data-akx-done','1');

  var IMG='https://kadampacheltenham.github.io/akx-widgets/img/';
  var API_KEY='AIzaSyAVm0epUASAL2aNbAN_aBmpDDPxoPJVOwA';
  var CAL_ID='c_7120941805c32581a9dca9a00783a100d6d53914fc8915ee8df40ae74d864504@group.calendar.google.com';

  /* base order = PFWP, HJ, Tara, WFJ, Powa, OSG, MD. `abbr` is the calendar tag. */
  var CARDS=[
    { abbr:'PFWP', title:'Prayers for World Peace', freq:'Once a month &middot; 45 mins', img:'pfwp.png', fig:false,
      teaser:'Beautiful and simple. Come along and feel empowered to change yourself and change the world. People often say these short prayers and meditation inspire genuine optimism through the development of a peaceful heart.',
      more:'<b>What to expect:</b> There&rsquo;s a short talk inspired by the book <i>Eight Steps to Happiness</i> with a senior member of the community. This is followed by some brief beautiful prayers, some of them over a thousand years old, followed by 5 minutes of silence for contemplation and concludes with dedications for world peace. See the calendar below for when it&rsquo;s on next.' },
    { abbr:'HJ', title:'Heart Jewel with Meditation', freq:'Every week &middot; 60 mins', img:'hj.jpg', fig:false,
      teaser:'As the name suggests, this practice is a heart practice for Kadampa Buddhists, combining receiving the blessings of Je Tsongkhapa to purify negativity, accumulate merit, and receive blessings. This is followed by meditation and concludes with prayers to Dorje Shugden, who is Je Tsongkhapa&rsquo;s &lsquo;Dharma Protector&rsquo;, to remove inner obstacles and create favourable conditions for our spiritual development.',
      more:'<b>What to expect:</b> If you&rsquo;re new, feel free to come along, listen and let the prayers inspire you. Or, if you prefer, you can chant too. The silent meditation is a great opportunity to contemplate teachings you received recently and think about how you can put them into practice. The prayers at the end function to help us remove obstacles and create good conditions for our spiritual life. See the calendar below for dates and times.' },
    { abbr:'Tara', title:'Tara Prayers', freq:'8th of the month &middot; 60 mins', img:'tara.png', fig:true,
      teaser:'At Kadampa Centres worldwide, the eighth of the month is Tara Day. Tara is a female Buddha, whose name means &ldquo;Rescuer&rdquo;. She is the embodiment of swift compassion. If we rely upon Tara sincerely and with strong faith, she will protect us from all obstacles and fulfil all our wishes. Everyone is welcome and invited to join us for Tara&rsquo;s chanted prayer practice, which is called Liberation from Sorrow. See the calendar below for dates and times.',
      more:'<b>What to expect:</b> This is a chanted practice, with the main part of the chanted prayers originating from Buddha. Towards the end there&rsquo;s a pause of about 5 minutes to recite Tara&rsquo;s mantra combined with making personal prayers, for instance for those we know who are sick or suffering. Everybody welcome.' },
    { abbr:'WFJ', title:'Wishfulfilling Jewel', freq:'Weekly &middot; 60 mins', img:'dorjeshugden.png', fig:true,
      teaser:'This practice is the heart essence of Kadampa Buddhism. In the first part we visualise our Spiritual Guide as Je Tsongkhapa and make prayers and requests to purify negativity, accumulate merit, and receive blessings. In the second part we make prayers to our Dharma Protector, Dorje Shugden, to overcome obstacles to our spiritual practice and create favourable conditions to nurture pure Dharma realisations.',
      more:'<b>What to expect:</b> This is often an opportunity to see our spiritual friends and engage in prayers together as Kadampa Buddhists. The prayers include a &lsquo;tsog&rsquo; offering &mdash; feel free to bring a small vegetarian offering of food or non-alcoholic drink. There&rsquo;s often a get-together afterwards, with food and a cuppa. See the calendar below for dates and times.' },
    { abbr:'POWA', title:'Prayers for the Deceased (Powa)', freq:'Once a month &middot; 45 mins', img:'powa.png', fig:true,
      teaser:'Once a month the Centre engages in a lovely ritual practice on behalf of those who have recently deceased. The practice entails a transference of consciousness, whereby through prayer, meditation and mantras, the participants assist in directing the consciousness of the recently deceased directly to the Pure Land of Buddha.',
      more:'<b>What to expect:</b> The practice focuses on the transference of consciousness, or Powa in Tibetan, whereby through prayer, meditation and mantras, the participants direct the consciousness of the recently deceased to take rebirth in the Pure Land of Buddha. White offerings are welcome, such as white flowers, food and candles. If you would like someone who has recently passed away to be added to the dedication prayers, please email us. See the calendar below for dates and times.' },
    { abbr:'OSG', title:'Offering to the Spiritual Guide', freq:'10th &amp; 25th monthly &middot; 1hr 45 mins', img:'osg.png', fig:true,
      teaser:'This is a special Guru Yoga of Je Tsongkhapa in conjunction with Highest Yoga Tantra that is a preliminary practice for Vajrayana Mahamudra. By relying upon Je Tsongkhapa our compassion, wisdom, and spiritual power naturally increase. The main practice is relying upon our Spiritual Guide as a Buddha and making praises and requests.',
      more:'<b>What to expect:</b> This is a beautiful chanted meditation practice that includes all the stages of the path to enlightenment of both Sutra and Tantra. Just come along and listen, or chant the prayers if you wish to, opening the door in the mind to following the path to enlightenment. Includes a &lsquo;tsog&rsquo; offering of food &mdash; feel free to bring a small vegetarian food offering if you wish. See the calendar below for dates and times.' },
    { abbr:'MD', title:'Melodious Drum (Kangso)', freq:'Monthly &middot; 3.5 hours', img:'dorjeshugden.png', fig:true,
      teaser:'This monthly practice consists principally of prayers to our Dharma Protector, Dorje Shugden. A Dharma Protector is an emanation of a Buddha or Bodhisattva whose main functions are to avert the inner and outer obstacles that prevent practitioners from attaining spiritual realisations, and to arrange all the necessary conditions for their practice. Dorje Shugden always helps, guides, and protects pure and faithful practitioners by granting blessings, increasing their wisdom, fulfilling their wishes and bestowing success on all their virtuous activities. See the calendar below for dates and times.',
      more:'<b>What to expect:</b> Extensive chanted practice to remove obstacles, create favourable conditions and renew heart commitments. This practice includes a &lsquo;tsog&rsquo; offering, so you can bring a vegetarian food or non-alcoholic drink as an offering if you wish. There&rsquo;s a tea break halfway through to stretch your legs. Please feel free to drop in for just part of the prayers if you prefer.' }
  ];

  var CLOCK='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>';

  var CSS=""
  +"@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');"
  +"#akx-prayers-cards{--ink:#2B2A28;--muted:#6f6a62;--blue:#2A66A6;--purple:#7E5CA8;--line:#ECE9E2;font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);max-width:1000px;margin:0 auto;}"
  +"#akx-prayers-cards *{box-sizing:border-box;}"
  +"#akx-prayers-cards .pc-caro{position:relative;}"
  +"#akx-prayers-cards .pc-view{overflow:hidden;transition:height .35s ease;}"
  +"#akx-prayers-cards .pc-track{display:flex;transition:transform .42s cubic-bezier(.4,0,.2,1);}"
  +"#akx-prayers-cards .pc-slide{flex:0 0 100%;}"
  +"#akx-prayers-cards .pc-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:#fff;color:var(--ink);font-size:1.3rem;line-height:1;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;}"
  +"#akx-prayers-cards .pc-nav:hover{background:#faf7f1;}#akx-prayers-cards .pc-nav:disabled{opacity:.35;cursor:default;}"
  +"#akx-prayers-cards .pc-prev{left:-16px;}#akx-prayers-cards .pc-next{right:-16px;}"
  +"#akx-prayers-cards .pc-dots{display:flex;gap:8px;justify-content:center;margin-top:18px;flex-wrap:wrap;}"
  +"#akx-prayers-cards .pc-dots i{width:8px;height:8px;border-radius:50%;background:#d8d2ca;cursor:pointer;transition:all .25s;}"
  +"#akx-prayers-cards .pc-dots i.on{background:var(--purple);width:22px;border-radius:5px;}"
  +"#akx-prayers-cards .pc-card{background:#fff;border:1px solid #efeadf;border-radius:22px;box-shadow:0 10px 34px rgba(0,0,0,.07);display:flex;gap:34px;align-items:center;padding:30px 34px;}"
  +"#akx-prayers-cards .pc-disc{flex:0 0 46%;width:46%;aspect-ratio:1/1;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 42%,#F3EFF7,#E7DEEF);box-shadow:0 0 0 7px rgba(126,92,168,.10);}"
  +"#akx-prayers-cards .pc-disc img{width:100%;height:100%;object-fit:cover;display:block;}"
  +"#akx-prayers-cards .pc-disc.fig img{object-fit:contain;transform:scale(1.04);}"
  +"#akx-prayers-cards .pc-body{flex:1 1 auto;min-width:0;}"
  +"#akx-prayers-cards .pc-ti{font-size:1.5rem;font-weight:600;color:var(--blue);margin:0 0 6px;line-height:1.2;}"
  +"#akx-prayers-cards .pc-freq{display:flex;align-items:center;gap:8px;color:var(--purple);font-weight:500;font-size:.98rem;margin:0 0 3px;}"
  +"#akx-prayers-cards .pc-next{color:var(--muted);font-size:.9rem;margin:0 0 14px;}#akx-prayers-cards .pc-next b{color:var(--purple);font-weight:600;}"
  +"#akx-prayers-cards .pc-desc{color:var(--muted);font-size:1.06rem;line-height:1.72;margin:0;}"
  +"#akx-prayers-cards .pc-clip{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;-webkit-line-clamp:3;}"
  +"#akx-prayers-cards .pc-card.open .pc-desc.pc-clip{-webkit-line-clamp:unset;display:block;}"
  +"#akx-prayers-cards .pc-more{max-height:0;overflow:hidden;transition:max-height .35s ease;}#akx-prayers-cards .pc-card.open .pc-more{max-height:680px;}"
  +"#akx-prayers-cards .pc-wexp{margin-top:14px;padding-top:14px;border-top:1px dashed #e6e0d5;}"
  +"#akx-prayers-cards .pc-rm{margin-top:12px;background:none;border:0;color:var(--purple);font-weight:600;font-size:.95rem;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:6px;font-family:inherit;}"
  +"#akx-prayers-cards .pc-rm .chev{transition:transform .25s ease;}#akx-prayers-cards .pc-card.open .pc-rm .chev{transform:rotate(180deg);}"
  +"@media(max-width:720px){"
  +"#akx-prayers-cards .pc-card{flex-direction:column;align-items:center;text-align:center;padding:26px 22px 24px;}"
  +"#akx-prayers-cards .pc-disc{width:210px;height:210px;aspect-ratio:auto;flex:none;margin-bottom:18px;}"
  +"#akx-prayers-cards .pc-freq{justify-content:center;}#akx-prayers-cards .pc-body{width:100%;}"
  +"#akx-prayers-cards .pc-desc{text-align:left;font-size:1rem;}#akx-prayers-cards .pc-clip{-webkit-line-clamp:1;}"
  +"#akx-prayers-cards .pc-wexp{text-align:left;}"
  +"#akx-prayers-cards .pc-prev{left:-6px;}#akx-prayers-cards .pc-next{right:-6px;}#akx-prayers-cards .pc-nav{width:38px;height:38px;font-size:1.1rem;}"
  +"}";

  function esc(s){return (s||'').replace(/&(?![a-z#0-9]+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function fmtNext(n){
    if(!n) return '';
    var s=new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short'}).format(n.date);
    if(!n.allDay){ var t=new Intl.DateTimeFormat('en-GB',{hour:'numeric',minute:'2-digit',hour12:true}).format(n.date).replace(' ','').replace(':00','').toLowerCase(); s+=', '+t; }
    return s;
  }

  function build(order){
    root.innerHTML='<style>'+CSS+'</style><div class="pc-caro"></div>';
    var caro=root.querySelector('.pc-caro');
    var view=document.createElement('div'); view.className='pc-view';
    var track=document.createElement('div'); track.className='pc-track';
    order.forEach(function(c){
      var slide=document.createElement('div'); slide.className='pc-slide';
      var card=document.createElement('div'); card.className='pc-card';
      card.innerHTML=
        '<div class="pc-disc'+(c.fig?' fig':'')+'"><img src="'+IMG+c.img+'" alt="'+esc(c.title)+'" referrerpolicy="no-referrer"></div>'
        +'<div class="pc-body">'
        +'<h3 class="pc-ti">'+esc(c.title)+'</h3>'
        +'<div class="pc-freq">'+CLOCK+' '+c.freq+'</div>'
        +(c.nextStr?'<div class="pc-next">Next: <b>'+c.nextStr+'</b></div>':'<div class="pc-next" style="margin-bottom:11px"></div>')
        +'<p class="pc-desc pc-clip">'+c.teaser+'</p>'
        +'<div class="pc-more"><div class="pc-wexp"><p class="pc-desc">'+c.more+'</p></div></div>'
        +'<button class="pc-rm">Read more <span class="chev">&#9662;</span></button>'
        +'</div>';
      slide.appendChild(card); track.appendChild(slide);
    });
    view.appendChild(track);
    var prev=document.createElement('button'); prev.className='pc-nav pc-prev'; prev.setAttribute('aria-label','Previous'); prev.innerHTML='&#8249;';
    var next=document.createElement('button'); next.className='pc-nav pc-next'; next.setAttribute('aria-label','Next'); next.innerHTML='&#8250;';
    var dots=document.createElement('div'); dots.className='pc-dots';
    order.forEach(function(_,i){ var d=document.createElement('i'); if(i===0)d.className='on'; d.onclick=function(){go(i);}; dots.appendChild(d); });
    caro.appendChild(prev); caro.appendChild(view); caro.appendChild(next); caro.appendChild(dots);

    var idx=0, cards=track.querySelectorAll('.pc-card');
    function height(){ view.style.height=cards[idx].offsetHeight+'px'; }
    function paint(){
      track.style.transform='translateX(-'+(idx*100)+'%)';
      dots.querySelectorAll('i').forEach(function(d,i){ d.classList.toggle('on',i===idx); });
      prev.disabled=idx===0; next.disabled=idx===order.length-1; height();
    }
    function go(i){ idx=Math.max(0,Math.min(order.length-1,i)); paint(); }
    prev.onclick=function(){go(idx-1);}; next.onclick=function(){go(idx+1);};
    track.querySelectorAll('.pc-rm').forEach(function(b){ b.onclick=function(){
      var card=b.closest('.pc-card'); var open=card.classList.toggle('open');
      b.childNodes[0].nodeValue=open?'Show less ':'Read more '; setTimeout(height,360);
    };});
    var x0=null,dx=0;
    view.addEventListener('pointerdown',function(e){ x0=e.clientX; dx=0; });
    view.addEventListener('pointermove',function(e){ if(x0!==null) dx=e.clientX-x0; });
    view.addEventListener('pointerup',function(){ if(x0!==null){ if(dx<-45)go(idx+1); else if(dx>45)go(idx-1); } x0=null; });
    view.addEventListener('pointerleave',function(){ x0=null; });
    window.addEventListener('resize',height);
    track.querySelectorAll('img').forEach(function(im){ im.addEventListener('load',height); });
    paint(); setTimeout(height,150);
  }

  /* ---- calendar: match #ABBR tags, find each puja's next date, float soonest to front ---- */
  function orderFromCalendar(cb){
    var now=new Date();
    var tMin=now.toISOString();
    var tMax=new Date(now.getFullYear(),now.getMonth()+4,now.getDate()).toISOString();
    var url='https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(CAL_ID)
      +'/events?singleEvents=true&orderBy=startTime&maxResults=250&key='+API_KEY
      +'&timeMin='+encodeURIComponent(tMin)+'&timeMax='+encodeURIComponent(tMax);
    fetch(url).then(function(r){return r.json();}).then(function(j){
      if(j.error){ cb(CARDS.slice()); return; }
      var nextByAbbr={};
      (j.items||[]).forEach(function(it){
        var start=it.start&&(it.start.dateTime||it.start.date); if(!start) return;
        var allDay=!it.start.dateTime;
        var d=allDay ? new Date(start+'T00:00:00') : new Date(start);
        if(d<now) return;
        var text=((it.summary||'')+' '+(it.description||''));
        CARDS.forEach(function(c){
          if(new RegExp('#'+c.abbr+'\\b','i').test(text)){
            if(!nextByAbbr[c.abbr] || d<nextByAbbr[c.abbr].date) nextByAbbr[c.abbr]={date:d,allDay:allDay};
          }
        });
      });
      CARDS.forEach(function(c){ var n=nextByAbbr[c.abbr]; c.nextStr = n? fmtNext(n) : ''; c._next = n? n.date : null; });
      var lead=null, best=null;
      CARDS.forEach(function(c){ if(c._next && (!best || c._next<best)){ best=c._next; lead=c; } });
      var order = lead ? [lead].concat(CARDS.filter(function(c){return c!==lead;})) : CARDS.slice();
      cb(order);
    }).catch(function(){ cb(CARDS.slice()); });
  }

  orderFromCalendar(build);
})();
