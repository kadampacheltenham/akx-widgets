/* Akanishta - "When to Visit" widget (opening hours from a weekly template + dated breaks).
   ONE shared file; reuse on any page. Include with a stub like:
       <div id="akx-visit" data-theme="light"></div>
       <script src="https://kadampacheltenham.github.io/akx-widgets/when-to-visit.js" defer></script>
   data-theme = "light" (default) | "dark".
   Desktop shows 21 days ahead, mobile 14. Hours are a placeholder weekly template for now -
   swap TEMPLATE / BREAKS below for the real hours (or wire to Google Calendar later). */
(function(){
  var root=document.getElementById('akx-visit');
  if(!root || root.getAttribute('data-akx-done')==='1') return;
  root.setAttribute('data-akx-done','1');
  if(!root.getAttribute('data-theme')) root.setAttribute('data-theme','light');

  var CSS=
  '#akx-visit{--bg:#FBFAF7;--card:#fff;--ink:#241f33;--mut:#8b8698;--acc:#2A66A6;--line:#efeae0;'
  +'--date:#C0392B;--op-bg:#E9F3EC;--op-tx:#256B45;--op-dot:#3B9B5E;--cl-tx:#8b8698;'
  +'--for-bg:#FBEEE4;--for-tx:#B05C2C;font-family:inherit;color:var(--ink);max-width:1000px;margin:0 auto;}'
  +'#akx-visit[data-theme="dark"]{--bg:#171126;--card:#221A38;--ink:#EDE9F6;--mut:#9E96B6;--acc:#A9BEE8;'
  +'--line:#2E2749;--date:#F0967E;--op-bg:#183A2A;--op-tx:#8FD9AE;--op-dot:#48C07E;--cl-tx:#9E96B6;'
  +'--for-bg:#3A2A20;--for-tx:#E7A877;}'
  +'#akx-visit *{box-sizing:border-box;}'
  +'#akx-visit .whead{font-weight:800;font-size:1.4rem;letter-spacing:-.01em;margin:0 0 12px;}'
  +'#akx-visit .st{border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;background:var(--op-bg);color:var(--op-tx);}'
  +'#akx-visit .st.closed{background:var(--card);color:var(--cl-tx);border:1px solid var(--line);}'
  +'#akx-visit .st .dot{width:13px;height:13px;border-radius:50%;flex:none;background:var(--op-dot);box-shadow:0 0 0 4px rgba(59,155,94,.2);}'
  +'#akx-visit .st.closed .dot{background:var(--cl-tx);box-shadow:none;}'
  +'#akx-visit .st .big{font-size:1.15rem;font-weight:700;line-height:1.25;}'
  +'#akx-visit .st .sub{font-size:.86rem;opacity:.9;margin-top:2px;}'
  +'#akx-visit .strip{display:flex;gap:9px;overflow-x:auto;padding:18px 2px 6px;-webkit-overflow-scrolling:touch;scrollbar-width:none;}'
  +'#akx-visit .strip::-webkit-scrollbar{height:0;}'
  +'#akx-visit .tile{flex:none;width:60px;height:72px;border-radius:15px;background:var(--card);border:1.5px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;position:relative;transition:.15s;}'
  +'#akx-visit .tile .dw{font-size:.62rem;font-weight:700;letter-spacing:.04em;color:var(--mut);}'
  +'#akx-visit .tile .dn{font-size:1.28rem;font-weight:700;color:var(--date);}'
  +'#akx-visit .tile .act{width:5px;height:5px;border-radius:50%;background:var(--op-dot);position:absolute;bottom:9px;}'
  +'#akx-visit .tile.closed{opacity:.5;} #akx-visit .tile.closed .act{display:none;}'
  +'#akx-visit .tile.today{border-color:var(--acc);}'
  +'#akx-visit .tile.sel{background:var(--acc);border-color:var(--acc);}'
  +'#akx-visit .tile.sel .dw,#akx-visit .tile.sel .dn{color:#fff;} #akx-visit .tile.sel .act{background:#fff;}'
  +'#akx-visit .brk{flex:none;min-width:112px;height:72px;border-radius:15px;border:1.5px dashed var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:0 10px;text-align:center;color:var(--mut);cursor:pointer;}'
  +'#akx-visit .brk b{font-size:.74rem;color:var(--ink);opacity:.85;} #akx-visit .brk small{font-size:.64rem;}'
  +'#akx-visit .detail{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:4px 18px 14px;}'
  +'#akx-visit .dhead{font-size:.72rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--mut);padding:12px 0 6px;}'
  +'#akx-visit .win{padding:13px 0;border-top:1px solid var(--line);}'
  +'#akx-visit .win:first-of-type{border-top:none;}'
  +'#akx-visit .wtime{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.1rem;letter-spacing:-.01em;color:var(--ink);}'
  +'#akx-visit .wtime .odot{width:9px;height:9px;border-radius:50%;background:var(--op-dot);flex:none;box-shadow:0 0 0 3px rgba(59,155,94,.16);}'
  +'#akx-visit .wevs{margin:7px 0 0 19px;}'
  +'#akx-visit .wev{font-size:.94rem;color:var(--mut);line-height:1.5;margin-top:4px;}'
  +'#akx-visit .wev:first-child{margin-top:0;}'
  +'#akx-visit .wev .en{color:var(--acc);font-weight:700;}'
  +'#akx-visit .wev .et{color:var(--mut);}'
  +'#akx-visit .wev .wq{display:inline-block;margin-left:8px;font-size:.7rem;font-weight:700;color:var(--for-tx);background:var(--for-bg);padding:2px 9px;border-radius:999px;vertical-align:1px;}'
  +'#akx-visit .cltxt{padding:14px 0;color:var(--cl-tx);font-size:.95rem;}';
  if(!document.getElementById('akx-visit-css')){
    var stEl=document.createElement('style'); stEl.id='akx-visit-css'; stEl.textContent=CSS; document.head.appendChild(stEl);
  }

  /* ---- WEEKLY TEMPLATE (placeholder hours - swap for the real calendar hours) ----
     Keys are JS getDay(): 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat. Empty array = closed.
     Times are 24h "HH:MM". event = {name, from, to (only if different from the open window), forr (who it's for)} */
  var TEMPLATE={
    0:[{s:'09:00',e:'15:15',events:[{name:'Teacher Training',from:'09:00',to:'13:00',forr:'For TTP students'},{name:'Foundation Programme',from:'14:45',to:'15:15',forr:'For FP students'}]}],
    1:[{s:'09:30',e:'12:00',events:[{name:'Volunteering morning'}]},{s:'17:30',e:'20:15',events:[{name:'Evening meditation class',from:'18:30',to:'19:45'}]}],
    2:[{s:'10:00',e:'12:15',events:[{name:'Daytime meditation class',from:'10:30',to:'11:45'}]}],
    3:[{s:'18:30',e:'20:15',events:[{name:'Young Adults group',from:'19:00',to:'20:00'}]}],
    4:[],
    5:[{s:'09:30',e:'11:00',events:[{name:'Volunteering morning'}]},{s:'12:00',e:'12:20',events:[{name:'Free lunchtime meditation'}]}],
    6:[{s:'10:00',e:'16:30',events:[{name:'Weekend course',forr:'Open for the course'}]}]
  };

  /* ---- DATED EXCEPTIONS ---- closed days + multi-day breaks (YYYY-MM-DD) */
  var BREAKS=[{from:'2026-07-22',to:'2026-08-16',label:'Summer break',reopen:'Reopens Mon 17 Aug'}];
  var CLOSED={};   /* e.g. '2026-12-25':'Closed - Christmas Day' */

  var DOW=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var DOW3=['SUN','MON','TUE','WED','THU','FRI','SAT'];
  var MON3=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
  function pad(n){return (n<10?'0':'')+n;}
  function to12(hhmm){var p=hhmm.split(':'),h=+p[0],m=+p[1],ap=h<12?'am':'pm',h12=h%12;if(h12===0)h12=12;return h12+':'+pad(m)+ap;}
  function minutes(hhmm){var p=hhmm.split(':');return +p[0]*60+ +p[1];}
  function breakFor(dstr){for(var i=0;i<BREAKS.length;i++){if(dstr>=BREAKS[i].from&&dstr<=BREAKS[i].to)return BREAKS[i];}return null;}

  function resolve(d){
    var dstr=ymd(d), b=breakFor(dstr);
    if(b) return {date:d,dstr:dstr,brk:b};
    if(CLOSED[dstr]) return {date:d,dstr:dstr,closed:CLOSED[dstr]};
    var wins=TEMPLATE[d.getDay()]||[];
    if(!wins.length) return {date:d,dstr:dstr,closed:'Closed today'};
    return {date:d,dstr:dstr,wins:wins};
  }

  function build(ndays){
    var today=new Date(); today.setHours(0,0,0,0);
    var out=[], count=0, i=0, guard=0;
    while(count<ndays && guard<400){
      guard++;
      var d=new Date(today); d.setDate(today.getDate()+i);
      var r=resolve(d);
      if(r.brk){
        r.isChip=true; out.push(r);                 /* collapse the whole break to one chip */
        var end=new Date(r.brk.to+'T00:00:00');      /* then jump to the reopening day */
        i=Math.round((end-today)/86400000)+1;
        continue;
      }
      out.push(r); count++; i++;
    }
    return {today:today,days:out};
  }

  function liveStatus(today){
    var now=new Date();
    var mins=now.getHours()*60+now.getMinutes();
    var b=breakFor(ymd(today));
    if(b) return {open:false,big:'Closed for the '+b.label.toLowerCase(),sub:b.reopen.replace('Reopens','We reopen')};
    var r=resolve(today);
    if(r.closed){
      var nx=nextOpen(today);
      return {open:false,big:'Closed today',sub:nx?('Open again '+nx.when+', '+to12(nx.win.s)):''};
    }
    for(var i=0;i<r.wins.length;i++){
      var w=r.wins[i];
      if(mins>=minutes(w.s)&&mins<minutes(w.e))
        return {open:true,big:"We're open now",sub:'for '+w.events[0].name+' (until '+to12(w.e)+')'};
      if(mins<minutes(w.s))
        return {open:false,big:'Opens '+to12(w.s)+' today',sub:'for '+w.events[0].name};
    }
    var n2=nextOpen(today);
    return {open:false,big:'Closed now',sub:n2?('Open again '+n2.when+', '+to12(n2.win.s)):''};
  }
  function nextOpen(from){
    for(var i=1;i<=14;i++){
      var d=new Date(from); d.setDate(from.getDate()+i);
      var r=resolve(d); if(r.wins&&r.wins.length){
        var when=(i===1)?'tomorrow':DOW[d.getDay()];
        return {when:when,win:r.wins[0]};
      }
    }
    return null;
  }

  function evLine(ev){
    var t=(ev.from&&ev.to)?' <span class="et">('+to12(ev.from)+' &ndash; '+to12(ev.to)+')</span>':'';
    var q=ev.forr?'<span class="wq">'+ev.forr+'</span>':'';
    return '<div class="wev"><span class="en">'+ev.name+'</span>'+t+q+'</div>';
  }
  function winHTML(w){
    return '<div class="win"><div class="wtime"><span class="odot"></span>Open '+to12(w.s)+' &ndash; '+to12(w.e)+'</div>'
      +'<div class="wevs">'+w.events.map(evLine).join('')+'</div></div>';
  }
  function detailHTML(r){
    if(r.brk) return '<div class="cltxt">Closed for the '+r.brk.label.toLowerCase()+'. '+r.brk.reopen.replace('Reopens','We reopen')+'.</div>';
    if(r.closed) return '<div class="cltxt">'+r.closed+'.</div>';
    return r.wins.map(winHTML).join('');
  }
  function headLabel(r,isToday){
    var d=r.date;
    return (isToday?'Today &middot; ':'')+DOW[d.getDay()]+' '+d.getDate()+' '+MON3[d.getMonth()];
  }

  var state={sel:0,touched:false};
  function ndays(){return window.matchMedia('(min-width:768px)').matches?21:14;}

  function render(){
    var data=build(ndays());
    if(!state.touched){
      /* default: today; but if today is a break, jump to the reopening day */
      state.sel=data.days[0]&&data.days[0].isChip?1:0;
    }
    if(state.sel>=data.days.length) state.sel=0;
    var todayStr=ymd(data.today);
    var strip=data.days.map(function(r,i){
      if(r.isChip) return '<div class="brk" data-i="'+i+'"><b>'+r.brk.label+'</b><small>'+r.brk.reopen+'</small></div>';
      var isToday=r.dstr===todayStr;
      var cls='tile'+(r.closed||r.brk?' closed':'')+(isToday?' today':'')+(i===state.sel?' sel':'');
      return '<div class="'+cls+'" data-i="'+i+'"><span class="dw">'+DOW3[r.date.getDay()]+'</span><span class="dn">'+r.date.getDate()+'</span>'+(r.wins?'<span class="act"></span>':'')+'</div>';
    }).join('');
    var sd=data.days[state.sel], isT=sd.dstr===todayStr;
    var s=liveStatus(data.today);
    root.innerHTML='<div class="whead">When to Visit</div>'
      +'<div class="st '+(s.open?'open':'closed')+'"><span class="dot"></span><div><div class="big">'+s.big+'</div>'+(s.sub?'<div class="sub">'+s.sub+'</div>':'')+'</div></div>'
      +'<div class="strip">'+strip+'</div>'
      +'<div class="detail"><div class="dhead">'+headLabel(sd,isT)+'</div>'+detailHTML(sd)+'</div>';
    root.querySelectorAll('[data-i]').forEach(function(el){el.addEventListener('click',function(){state.touched=true;state.sel=+el.getAttribute('data-i');render();});});
  }

  render();
  var mq=window.matchMedia('(min-width:768px)');
  (mq.addEventListener?mq.addEventListener('change',render):mq.addListener(render));
})();
