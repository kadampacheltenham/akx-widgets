/* Akanishta — BRANCH EVENTS widget  v0.1 (prototype, 28 Aug 2026)
   "Classes & events in <Town>" for a branch page.

   Reads BOTH sheets and merges them into one chronological list for one town:
     • Weekly Classes sheet  — tabs "Class details" + "Talks & series" + "Locations"
     • Weekend events sheet  — tab "Events" (half-days, retreats, silent days, away days)

   Include with:
     <div id="akx-branch" data-town="cirencester" data-name="Cirencester"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/branch-events.js" defer></script>

   data-town  = the Location ID used in the Weekly Classes sheet (lowercase)
   data-name  = how the town is written on screen
   data-calendar = optional id of the calendar block to link to (default 'akx-cal')
   data-staytouch = optional id of the "Stay in touch" section; when there is
                    NOTHING to show, that section is moved up to sit directly
                    under this one (Gen's rule, 28 Aug).

   The calendar is deliberately a SEPARATE embed — if this widget fails, the
   calendar still shows events.
*/
(function () {
  var WC_SHEET = '1YArubV8QgCvPUIIvHOHWhCN2fYLRz0DDPSRSHD_tSmY';
  var CR_SHEET = '1g8VSqkv9zIR375RDf9R-B-34zMhsHXoUYx7ZYhuXlmk';
  var MOUNT = 'akx-branch';

  /* ---------- palette (site standards) ---------- */
  var C = {
    blue:'#2A66A6', coral:'#E2886A', teal:'#227A72', green:'#4FA35A',
    ink:'#2B2A28', mut:'#6B6862', line:'#E7E1D6', cream:'#FEFEFA',
    gold:'#B5771E', purple:'#6A4A9C', bluegreen:'#2E9BB5'
  };
  /* weekend Event Type -> label + colour (mirrors cr-events.js) */
  var TYPES = {
    'special event':{t:'Special event',c:C.gold},
    'half-day course':{t:'Half-day course',c:C.blue},
    'day course':{t:'Day course',c:C.blue},
    'half-day retreat':{t:'Half-day retreat',c:C.teal},
    'day retreat':{t:'Day retreat',c:C.teal},
    'silent day':{t:'Silent day',c:C.purple},
    'free half-day':{t:'Free half-day',c:C.green},
    'away day':{t:'Away day',c:C.bluegreen},
    'other':{t:'',c:C.coral}
  };

  var STYLE = ''
  + '#'+MOUNT+'{--ink:'+C.ink+';--mut:'+C.mut+';font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ink);max-width:1000px;margin:0 auto;}'
  + '#'+MOUNT+' *{box-sizing:border-box;}'
  + '#'+MOUNT+' .bx-h{text-align:center;font-family:Fraunces,Georgia,serif;font-weight:600;font-size:1.9rem;color:'+C.blue+';margin:0 0 22px;}'
  + '#'+MOUNT+' .bx-list{display:flex;flex-direction:column;gap:16px;}'
  + '#'+MOUNT+' .bx-year{display:flex;align-items:center;gap:14px;margin:14px 0 2px;}'
  + '#'+MOUNT+' .bx-year span{font:700 .82rem/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:'+C.coral+';background:#FBF0EA;border:1px solid #F0DACE;border-radius:999px;padding:8px 15px;white-space:nowrap;}'
  + '#'+MOUNT+' .bx-year i{flex:1;height:1px;background:'+C.line+';display:block;}'
  + '#'+MOUNT+' .bx-card{background:#fff;border:1px solid '+C.line+';border-left:5px solid var(--ac,'+C.green+');border-radius:14px;padding:18px 22px;display:flex;gap:20px;align-items:flex-start;}'
  + '#'+MOUNT+' .bx-when{flex:0 0 96px;text-align:center;border-right:1px solid #F1EDE6;padding-right:16px;}'
  + '#'+MOUNT+' .bx-d{font:700 1.5rem/1 Fraunces,Georgia,serif;color:var(--ac);}'
  + '#'+MOUNT+' .bx-m{font:700 .72rem/1.5 Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--mut);}'
  + '#'+MOUNT+' .bx-dow{font:600 .74rem/1.4 Inter,sans-serif;color:var(--mut);}'
  + '#'+MOUNT+' .bx-body{flex:1;min-width:0;}'
  + '#'+MOUNT+' .bx-tag{display:inline-block;font:700 .68rem/1 Inter,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#fff;background:var(--ac);border-radius:999px;padding:6px 11px;margin-bottom:8px;}'
  + '#'+MOUNT+' .bx-t{font:600 1.18rem/1.3 Fraunces,Georgia,serif;color:'+C.blue+';margin:0 0 4px;}'
  + '#'+MOUNT+' .bx-meta{font-size:.94rem;color:var(--mut);margin-bottom:6px;}'
  + '#'+MOUNT+' .bx-meta b{color:var(--ink);font-weight:600;}'
  + '#'+MOUNT+' .bx-sum{font-size:.96rem;line-height:1.55;margin:0 0 10px;}'
  + '#'+MOUNT+' .bx-dates{font-size:.9rem;color:var(--mut);margin-bottom:10px;}'
  + '#'+MOUNT+' .bx-foot{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}'
  + '#'+MOUNT+' .bx-btn{display:inline-block;background:'+C.coral+';color:#fff;font:600 .92rem Inter,sans-serif;padding:10px 18px;border-radius:4px;text-decoration:none;}'
  + '#'+MOUNT+' .bx-btn.ghost{background:#fff;color:'+C.teal+';border:1px solid '+C.teal+';}'
  + '#'+MOUNT+' .bx-price{font-size:.94rem;color:var(--mut);}'
  + '#'+MOUNT+' .bx-empty{background:#fff;border:1px solid '+C.line+';border-left:5px solid '+C.coral+';border-radius:14px;padding:26px 28px;}'
  + '#'+MOUNT+' .bx-empty p{margin:0 0 10px;font-size:1.04rem;line-height:1.6;}'
  + '#'+MOUNT+' .bx-empty p:last-child{margin:0;}'
  + '#'+MOUNT+' .bx-callink{text-align:center;margin-top:22px;}'
  + '#'+MOUNT+' .bx-callink a{font:600 .96rem Inter,sans-serif;color:'+C.teal+';text-decoration:none;border-bottom:1px solid #BBD6D2;padding-bottom:2px;}'
  + '#'+MOUNT+' .bx-msg{text-align:center;color:#8a857c;padding:22px;}'
  + '@media(max-width:640px){'
  +   '#'+MOUNT+' .bx-card{flex-direction:column;gap:12px;padding:16px;}'
  +   '#'+MOUNT+' .bx-when{display:flex;gap:10px;align-items:baseline;border-right:0;border-bottom:1px solid #F1EDE6;padding:0 0 10px;flex:none;text-align:left;width:100%;}'
  +   '#'+MOUNT+' .bx-d{font-size:1.25rem;}'
  +   '#'+MOUNT+' .bx-h{font-size:1.45rem;}'
  +   '#'+MOUNT+' .bx-btn{flex:1;text-align:center;}'
  + '}';

  /* ---------- helpers ---------- */
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];}); }
  function gviz(id, tab){
    var u='https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:json&headers=1&sheet='+encodeURIComponent(tab);
    return fetch(u).then(function(r){return r.text();}).then(function(t){
      var j=JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}')+1));
      var cols=j.table.cols.map(function(c){ return String(c.label||'').trim(); });
      return j.table.rows.map(function(rw){
        var o={};
        cols.forEach(function(c,i){
          var cell=rw.c[i];
          o[c]= cell ? (cell.f!=null && String(cell.f).length ? cell.f : cell.v) : '';
        });
        return o;
      });
    });
  }
  function pick(o, names){ for(var i=0;i<names.length;i++){ if(o[names[i]]!=null && o[names[i]]!=='') return o[names[i]]; } return ''; }
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function midnight(d){ var x=new Date(d); x.setHours(0,0,0,0); return x; }
  var TODAY=midnight(new Date());

  /* "24/08" (no year) or "24/08/2026" -> Date. Yearless dates roll to next year
     once they are more than 60 days in the past, so an autumn sheet still works in January. */
  function parseDate(s){
    if(!s) return null;
    s=String(s).trim();
    var m=s.match(/^(\d{1,2})[\/\.\-](\d{1,2})(?:[\/\.\-](\d{2,4}))?$/);
    if(!m) { var d0=new Date(s); return isNaN(d0)?null:midnight(d0); }
    var dd=+m[1], mm=+m[2]-1, yy=m[3];
    if(yy){ yy=+yy; if(yy<100) yy+=2000; }
    else {
      yy=TODAY.getFullYear();
      var t=new Date(yy,mm,dd);
      if((TODAY-t)/86400000 > 60) yy+=1;
    }
    var d=new Date(yy,mm,dd);
    return isNaN(d)?null:midnight(d);
  }
  function splitDates(s){
    return String(s||'').split(/[;,]/).map(function(x){return x.trim();}).filter(Boolean).map(parseDate).filter(Boolean);
  }
  function live(v){ return /live/i.test(String(v||'')); }
  function shown(showFrom){ var d=parseDate(showFrom); return !d || d<=TODAY; }
  function fmtRun(ds){
    return ds.map(function(d){ return d.getDate()+' '+MON[d.getMonth()]; }).join(' · ');
  }

  /* ---------- render ---------- */
  function card(it){
    var d=it.date;
    var acc=it.colour||C.green;
    var when='<div class="bx-when"><div class="bx-d">'+d.getDate()+'</div>'
           + '<div class="bx-m">'+MON[d.getMonth()]+'</div>'
           + '<div class="bx-dow">'+DOW[d.getDay()]+'</div></div>';
    var meta=[];
    if(it.time) meta.push('<b>'+esc(it.time)+'</b>');
    if(it.duration) meta.push(esc(it.duration));
    if(it.teacher) meta.push('with <b>'+esc(it.teacher)+'</b>');
    if(it.venue) meta.push(esc(it.venue));
    var foot='';
    if(it.price) foot+='<span class="bx-price">'+esc(it.price)+'</span>';
    if(it.book)  foot='<a class="bx-btn" href="'+esc(it.book)+'" target="_blank" rel="noopener">Book your Spot &rarr;</a>'+foot;
    else if(it.dropin) foot='<span class="bx-price">Drop-in &mdash; nothing to book</span>'+foot;
    if(it.directions) foot+='<a class="bx-btn ghost" href="'+esc(it.directions)+'" target="_blank" rel="noopener">Get directions</a>';
    return '<article class="bx-card" style="--ac:'+acc+'">'+when+'<div class="bx-body">'
      + (it.tag?'<span class="bx-tag">'+esc(it.tag)+'</span>':'')
      + '<h3 class="bx-t">'+esc(it.title)+'</h3>'
      + (meta.length?'<div class="bx-meta">'+meta.join(' &nbsp;·&nbsp; ')+'</div>':'')
      + (it.summary?'<p class="bx-sum">'+esc(it.summary)+'</p>':'')
      + (it.run?'<div class="bx-dates">'+esc(it.run)+'</div>':'')
      + (foot?'<div class="bx-foot">'+foot+'</div>':'')
      + '</div></article>';
  }

  function draw(root, town, items, calId, stayId){
    var html='<style>'+STYLE+'</style>';
    html+='<h2 class="bx-h">Classes &amp; events in '+esc(town)+'</h2>';

    if(!items.length){
      html+='<div class="bx-empty">'
          + '<p><strong>News and events for '+esc(town)+' coming soon.</strong></p>'
          + '<p>Why not stay in touch with WhatsApp and eNews &mdash; see below.</p>'
          + '<p>Listed below you&rsquo;ll find other events you may be interested in and some ways to start from home.</p>'
          + '</div>';
      root.innerHTML=html;
      /* Gen's rule: with nothing to show, Stay in touch moves up under this section */
      if(stayId){
        var stay=document.getElementById(stayId);
        var host=stay && stay.closest ? (stay.closest('.page-section')||stay) : null;
        var mine=root.closest ? (root.closest('.page-section')||root) : root;
        if(host && mine && host.parentNode && mine.parentNode===host.parentNode){
          mine.parentNode.insertBefore(host, mine.nextSibling);
        }
      }
      return;
    }

    var lastYear=null;
    html+='<div class="bx-list">';
    items.forEach(function(it){
      var y=it.date.getFullYear();
      if(lastYear!==null && y!==lastYear){
        html+='<div class="bx-year"><i></i><span>'+y+'</span><i></i></div>';
      }
      lastYear=y;
      html+=card(it);
    });
    html+='</div>';
    html+='<div class="bx-callink"><a href="#'+esc(calId)+'">See the full calendar of local events &darr;</a></div>';
    root.innerHTML=html;
  }

  /* ---------- data ---------- */
  function build(root){
    var town=(root.getAttribute('data-town')||'').trim().toLowerCase();
    var name=(root.getAttribute('data-name')||town.charAt(0).toUpperCase()+town.slice(1)).trim();
    var calId=(root.getAttribute('data-calendar')||'akx-cal').trim();
    var stayId=(root.getAttribute('data-staytouch')||'').trim();
    root.innerHTML='<style>'+STYLE+'</style><div class="bx-msg">Loading classes &amp; events…</div>';

    var ua=(navigator.userAgent||''); var APPLE=/iphone|ipad|ipod|macintosh|mac os x/i.test(ua);
    function maps(q){ return APPLE ? 'https://maps.apple.com/?q='+encodeURIComponent(q)
                                   : 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q); }

    Promise.all([
      gviz(WC_SHEET,'Class details').catch(function(){return [];}),
      gviz(WC_SHEET,'Talks & series').catch(function(){return [];}),
      gviz(WC_SHEET,'Locations').catch(function(){return [];}),
      gviz(CR_SHEET,'Events').catch(function(){return [];})
    ]).then(function(res){
      var classes=res[0], talks=res[1], locs=res[2], events=res[3];
      var items=[];

      /* venue for this town */
      var venue=null;
      locs.forEach(function(l){
        var id=String(pick(l,['Location ID','location','id'])||'').trim().toLowerCase();
        if(id===town && live(pick(l,['status']))) venue=l;
      });
      var venueAddr = venue ? pick(venue,['address']) : '';
      var venueName = venue ? pick(venue,['display_name']) : name;

      /* --- weekly classes: one entry per series at this town --- */
      var byId={};
      talks.forEach(function(t){ byId[String(pick(t,['Event ID','id'])).trim()]=t; });
      classes.forEach(function(c){
        var loc=String(pick(c,['Location ID','location'])||'').trim().toLowerCase();
        if(loc!==town) return;
        var t=byId[String(pick(c,['Event ID','id'])).trim()];
        if(t && (!live(pick(t,['status'])) || !shown(pick(t,['show_from'])))) return;
        var all=splitDates(pick(c,['dates']));
        var future=all.filter(function(d){ return d>=TODAY; });
        if(!future.length) return;
        var price=[pick(c,['price_class']), pick(c,['price_series'])].filter(Boolean);
        items.push({
          date: future[0],
          run: future.length>1 ? future.length+' classes · '+fmtRun(future) : '',
          title: t?pick(t,['title']):'Weekly meditation class',
          tag: t?pick(t,['type']):'Weekly class',
          colour: C.green,
          time: pick(c,['time']),
          duration: pick(c,['duration']),
          teacher: pick(c,['teacher']),
          venue: venueName,
          summary: t?pick(t,['description']):'',
          price: price.length? price.join(' · ') : '',
          book: pick(c,['booking_url']),
          dropin: !pick(c,['booking_url']),
          directions: venueAddr? maps(venueAddr):''
        });
      });

      /* --- weekend events: match the town inside the free-text Location --- */
      events.forEach(function(e){
        if(!live(pick(e,['Status']))) return;
        if(!shown(pick(e,['Show from']))) return;
        var loc=String(pick(e,['Location'])||'').trim();
        var hay=loc.toLowerCase();
        var mine = town==='cheltenham' ? (!loc || /cheltenham|akanishta/.test(hay)) : (hay.indexOf(town)>-1);
        if(!mine) return;
        var d=parseDate(pick(e,['Date']));
        if(!d || d<TODAY) return;
        var ty=TYPES[String(pick(e,['Event Type'])||'').trim().toLowerCase()]||TYPES.other;
        var free=/y|true|1/i.test(String(pick(e,['Free'])||''));
        items.push({
          date:d, title:pick(e,['Title']), tag:ty.t||pick(e,['Event tag']), colour:ty.c,
          time:pick(e,['Time']), teacher:'', venue:loc||venueName,
          summary:pick(e,['Summary']),
          price: free? 'Free event' : pick(e,['Fee']),
          book: pick(e,['Booking link']),
          dropin: !pick(e,['Booking link']),
          directions: loc? maps(loc) : (venueAddr? maps(venueAddr):'')
        });
      });

      items.sort(function(a,b){ return a.date-b.date; });
      draw(root, name, items, calId, stayId);
    }).catch(function(err){
      root.innerHTML='<style>'+STYLE+'</style><div class="bx-msg">Classes &amp; events are taking a moment — please see the calendar below.</div>';
      if(window.console) console.log('[branch-events]', err);
    });
  }

  function go(){
    var root=document.getElementById(MOUNT);
    if(!root || root.getAttribute('data-done')) return;
    root.setAttribute('data-done','1');
    build(root);
  }
  go();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', go);
  var mo=new MutationObserver(go);
  try{ mo.observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}
})();
