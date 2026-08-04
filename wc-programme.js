<!-- ===========================================================
     WEEKLY CLASSES — three intro cards (paste into a Code Block
     directly under the hero text, replacing the three text links).
     Self-contained + scoped to #wc-intro-cards (won't touch the page).
     TO EDIT A CARD: change the <h3> title, the <p> line, the "go"
     text, and the href="" on each <a class="wc-card">.
     =========================================================== -->
<div id="wc-intro-cards">
  <div class="wc-track" id="wcTrack">

    <a class="wc-card" href="#glance">
      <span class="wc-ic"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg></span>
      <h3>Week at a Glance</h3>
      <p>The whole week's drop-in timetable, at a glance.</p>
      <span class="wc-go">See the week <span class="wc-arw">&rarr;</span></span>
    </a>

    <a class="wc-card" href="#programme">
      <span class="wc-ic"><svg viewBox="0 0 24 24"><path d="M4 5h16v15H4zM4 9h16"/><path d="M8 13h8M8 16h5"/></svg></span>
      <h3>Classes Programme</h3>
      <p>Public talks and short courses &mdash; dates, prices and booking.</p>
      <span class="wc-go">View the programme <span class="wc-arw">&rarr;</span></span>
    </a>

    <a class="wc-card" href="#calendar">
      <span class="wc-ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>
      <h3>Weekly Calendar</h3>
      <p>Everything that's on, in a live calendar you can browse.</p>
      <span class="wc-go">Open the calendar <span class="wc-arw">&rarr;</span></span>
    </a>

  </div>

  <div class="wc-nav">
    <button type="button" class="wc-prev" aria-label="Previous">&#8249;</button>
    <span class="wc-dots"><i class="on"></i><i></i><i></i></span>
    <button type="button" class="wc-next" aria-label="Next">&#8250;</button>
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&display=swap');
  #wc-intro-cards{--blue:#2A66A6;--blue-dk:#245C96;--cream:#F4ECDB;max-width:1000px;margin:0 auto;position:relative;
    font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}
  #wc-intro-cards *{box-sizing:border-box;}
  #wc-intro-cards .wc-track{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
  #wc-intro-cards .wc-card{display:flex;flex-direction:column;gap:10px;background:var(--blue);color:var(--cream);
    border-radius:18px;padding:26px 24px 22px;text-decoration:none;min-height:172px;
    border:1px solid rgba(255,255,255,.10);box-shadow:0 10px 30px rgba(42,102,166,.18);
    transition:transform .18s ease,box-shadow .18s ease,background .18s ease;}
  #wc-intro-cards .wc-card:hover{transform:translateY(-4px);background:var(--blue-dk);box-shadow:0 16px 40px rgba(42,102,166,.28);}
  #wc-intro-cards .wc-ic{width:34px;height:34px;margin-bottom:2px;}
  #wc-intro-cards .wc-ic svg{width:34px;height:34px;stroke:var(--cream);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;}
  #wc-intro-cards .wc-card h3{margin:0;font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.28rem;line-height:1.15;color:#fff;}
  #wc-intro-cards .wc-card p{margin:0;font-size:.95rem;line-height:1.5;color:var(--cream);opacity:.92;}
  #wc-intro-cards .wc-go{margin-top:auto;font-size:.82rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
    color:var(--cream);display:inline-flex;align-items:center;gap:7px;}
  #wc-intro-cards .wc-go .wc-arw{transition:transform .18s ease;}
  #wc-intro-cards .wc-card:hover .wc-go .wc-arw{transform:translateX(4px);}
  #wc-intro-cards .wc-nav{display:none;}

  @media(max-width:640px){
    #wc-intro-cards{padding:0 4px;}
    #wc-intro-cards .wc-track{grid-template-columns:none;display:flex;gap:14px;overflow-x:auto;
      scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding:4px 2px 10px;scrollbar-width:none;}
    #wc-intro-cards .wc-track::-webkit-scrollbar{display:none;}
    #wc-intro-cards .wc-card{flex:0 0 82%;scroll-snap-align:center;min-height:150px;}
    #wc-intro-cards .wc-nav{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:6px;}
    #wc-intro-cards .wc-nav button{width:44px;height:44px;border-radius:50%;border:1.5px solid #cfd8e6;background:#fff;
      color:var(--blue);font-size:1.4rem;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
      box-shadow:0 3px 10px rgba(0,0,0,.06);}
    #wc-intro-cards .wc-nav button:active{background:#eef3fa;}
    #wc-intro-cards .wc-dots{display:flex;gap:7px;align-items:center;}
    #wc-intro-cards .wc-dots i{width:7px;height:7px;border-radius:50%;background:#cdd6e4;display:inline-block;transition:background .2s,transform .2s;}
    #wc-intro-cards .wc-dots i.on{background:var(--blue);transform:scale(1.25);}
  }
</style>

<script>
  (function(){
    var root=document.getElementById('wc-intro-cards'); if(!root||root.dataset.done)return; root.dataset.done='1';
    var track=root.querySelector('.wc-track'), dots=root.querySelector('.wc-dots');
    var prev=root.querySelector('.wc-prev'), next=root.querySelector('.wc-next');
    function cards(){ return track.querySelectorAll('.wc-card'); }
    function step(){ var c=cards(); return c.length>1 ? (c[1].getBoundingClientRect().left-c[0].getBoundingClientRect().left) : track.clientWidth; }
    function markDots(){ var i=Math.round(track.scrollLeft/step()); dots.querySelectorAll('i').forEach(function(d,n){d.classList.toggle('on',n===i);}); }
    if(prev) prev.onclick=function(){ track.scrollBy({left:-step(),behavior:'smooth'}); };
    if(next) next.onclick=function(){ track.scrollBy({left:step(),behavior:'smooth'}); };
    track.addEventListener('scroll',function(){ window.requestAnimationFrame(markDots); });
  })();
</script>
