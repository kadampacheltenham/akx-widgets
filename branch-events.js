/* Akanishta — BRANCH page: invitation card + town pills   v0.4 (28 Aug 2026)
   Built to Gen's sketch. Everything is read from the sheets — nothing typed by hand.

   Stub (sits directly under the page title/intro text):
     <div id="akx-branch-when" data-town="cirencester" data-name="Cirencester"></div>
     <script src="https://kadampacheltenham.github.io/akx-widgets/branch-events.js" defer></script>

   Reads:
     Weekly Classes sheet — "Class details" (filtered on Location ID), "Talks & series"
                            (live/show_from), "Locations" (display_name, address, access_note)
     Weekend events sheet — "Events"  (only to spot a SECOND venue in this town)

   The classes/courses themselves are rendered by the EXISTING widgets
   (wc-talks-courses.js and cr-events.js) — this file does not re-present them.

   COLOUR RULE (Gen): apart from site blue #2A66A6 and warm coral #E2886A, colours
   should be relaxing — lighter and brighter. Pills are deliberately NOT blue.
*/
(function () {
  var WC_SHEET = '1YArubV8QgCvPUIIvHOHWhCN2fYLRz0DDPSRSHD_tSmY';
  var CR_SHEET = '1g8VSqkv9zIR375RDf9R-B-34zMhsHXoUYx7ZYhuXlmk';
  var MOUNT = 'akx-branch-when';

  var BRANCHES = [
    {slug:'cirencester', name:'Cirencester'},
    {slug:'stroud',      name:'Stroud'},
    {slug:'gloucester',  name:'Gloucester'},
    {slug:'tewkesbury',  name:'Tewkesbury'},
    {slug:'evesham',     name:'Evesham'}
  ];

  var C = {
    blue:'#2A66A6', coral:'#E2886A', ink:'#2B2A28', mut:'#6E6A64',
    aqua:'#3FA9A0', aquaBg:'#E9F6F4', aquaBd:'#CFE8E4',
    sand:'#F6EFE4', sandBd:'#E7DAC4', sandInk:'#8A6B3A'
  };
  var FONT  = "Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
  var SERIF = "Fraunces,Georgia,serif";

  var STYLE = ''
  + '.akxb{font-family:'+FONT+';color:'+C.ink+';max-width:820px;margin:0 auto;}'
  + '.akxb *{box-sizing:border-box;}'
  + '.akxb .inv{background:#fff;border:1px solid '+C.aquaBd+';border-radius:20px;padding:34px 38px;box-shadow:0 2px 16px rgba(42,102,166,.05);}'
  + '.akxb .inv-eye{text-align:center;font:600 .72rem/1 '+FONT+';letter-spacing:.17em;text-transform:uppercase;color:'+C.coral+';margin-bottom:10px;}'
  + '.akxb .inv-t{text-align:center;font-family:'+SERIF+';font-weight:600;font-size:1.6rem;line-height:1.2;color:'+C.blue+';margin:0 0 24px;}'
  + '.akxb .inv-grid{display:flex;gap:34px;align-items:flex-start;}'
  + '.akxb .inv-main{flex:1;min-width:0;}'
  + '.akxb .row{display:flex;gap:16px;padding:11px 0;border-top:1px solid #F1EDE6;}'
  + '.akxb .row:first-child{border-top:0;padding-top:0;}'
  + '.akxb .lab{flex:0 0 92px;font:600 .72rem/1.7 '+FONT+';letter-spacing:.11em;text-transform:uppercase;color:'+C.mut+';padding-top:4px;}'
  + '.akxb .val{flex:1;min-width:0;}'
  + '.akxb .when-line{font-family:'+SERIF+';font-weight:600;font-size:1.22rem;line-height:1.35;color:'+C.blue+';}'
  + '.akxb .when-line + .when-line{margin-top:5px;}'
  + '.akxb .when-line span{font-family:'+FONT+';font-weight:600;font-size:.82rem;color:'+C.mut+';letter-spacing:.02em;}'
  + '.akxb .venue{font:600 1.02rem/1.45 '+FONT+';color:'+C.blue+';}'
  + '.akxb .addr{font-size:.97rem;line-height:1.5;color:'+C.mut+';margin-top:2px;}'
  + '.akxb .dirs{display:inline-block;margin-top:6px;font:500 .88rem '+FONT+';color:'+C.aqua+';text-decoration:none;border-bottom:1px solid '+C.aquaBd+';padding-bottom:1px;}'
  + '.akxb .info{font-size:.95rem;line-height:1.5;color:'+C.mut+';}'
  + '.akxb .next{flex:0 0 150px;background:'+C.aquaBg+';border-radius:14px;padding:16px 14px;text-align:center;}'
  + '.akxb .next-l{font:600 .68rem/1 '+FONT+';letter-spacing:.13em;text-transform:uppercase;color:'+C.mut+';margin-bottom:7px;}'
  + '.akxb .next-d{font-family:'+SERIF+';font-weight:600;font-size:1.32rem;line-height:1.15;color:'+C.blue+';}'
  + '.akxb .next-t{font:600 .85rem/1.5 '+FONT+';color:'+C.aqua+';}'
  + '.akxb .soon{text-align:center;font-size:1.02rem;line-height:1.65;color:'+C.ink+';}'
  + '.akxb .bp{margin-top:20px;display:flex;flex-wrap:wrap;gap:9px;justify-content:center;}'
  + '.akxb .bp a{font:600 .89rem '+FONT+';text-decoration:none;padding:9px 17px;border-radius:999px;background:'+C.sand+';color:'+C.sandInk+';border:1px solid '+C.sandBd+';transition:background .15s;}'
  + '.akxb .bp a:hover{background:#F0E6D6;}'
  + '@media(max-width:640px){'
  +   '.akxb .inv{padding:24px 20px;border-radius:16px;}'
  +   '.akxb .inv-t{font-size:1.3rem;}'
  +   '.akxb .inv-grid{flex-direction:column-reverse;gap:18px;}'
  +   '.akxb .next{flex:none;width:100%;display:flex;align-items:baseline;justify-content:center;gap:9px;padding:11px 14px;}'
  +   '.akxb .next-l{margin:0;} .akxb .next-d{font-size:1.1rem;}'
  +   '.akxb .row{flex-direction:column;gap:3px;} .akxb .lab{flex:none;padding:0;}'
  + '}';

  /* ---------- helpers ---------- */
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];}); }
  function gviz(id, tab){
    var u='https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:json&headers=1&sheet='+encodeURIComponent(tab);
    return fetch(u).then(function(r){return r.text();}).then(function(t){
      var j=JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}')+1));
      var cols=j.table.cols.map(function(c){ return String(c.label||'').trim(); });
      return j.table.rows.map(function(rw){
        var o={}; cols.forEach(function(c,i){ var cell=rw.c[i];
          o[c]= cell ? (cell.f!=null && String(cell.f).length ? cell.f : cell.v) : ''; });
        return o;
      });
    });
  }
  function pick(o,names){ for(var i=0;i<names.length;i++){ if(o[names[i]]!=null && o[names[i]]!=='') return o[names[i]]; } return ''; }
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DOWS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var DAYFULL={mon:'Mondays',tue:'Tuesdays',tues:'Tuesdays',wed:'Wednesdays',weds:'Wednesdays',
               thu:'Thursdays',thur:'Thursdays',thurs:'Thursdays',fri:'Fridays',sat:'Saturdays',sun:'Sundays'};
  function dayName(s){
    var k=String(s||'').trim().toLowerCase().replace(/[^a-z]/g,'').slice(0,5);
    for(var i=5;i>=3;i--){ if(DAYFULL[k.slice(0,i)]) return DAYFULL[k.slice(0,i)]; }
    return s?String(s):'';
  }
  function midnight(d){ var x=new Date(d); x.setHours(0,0,0,0); return x; }
  var TODAY=midnight(new Date());
  function parseDate(s){
    if(!s) return null; s=String(s).trim();
    var m=s.match(/^(\d{1,2})[\/\.\-](\d{1,2})(?:[\/\.\-](\d{2,4}))?$/);
    if(!m){ var d0=new Date(s); return isNaN(d0)?null:midnight(d0); }
    var dd=+m[1], mm=+m[2]-1, yy=m[3];
    if(yy){ yy=+yy; if(yy<100) yy+=2000; }
    else { yy=TODAY.getFullYear(); if((TODAY-new Date(yy,mm,dd))/86400000 > 60) yy+=1; }
    var d=new Date(yy,mm,dd); return isNaN(d)?null:midnight(d);
  }
  function splitDates(s){ return String(s||'').split(/[;,]/).map(function(x){return x.trim();}).filter(Boolean).map(parseDate).filter(Boolean); }
  function live(v){ return /live/i.test(String(v||'')); }
  function shown(sf){ var d=parseDate(sf); return !d || d<=TODAY; }
  var UA=(navigator.userAgent||''), APPLE=/iphone|ipad|ipod|macintosh|mac os x/i.test(UA);
  function maps(q){ return APPLE ? 'https://maps.apple.com/?q='+encodeURIComponent(q)
                                 : 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q); }

  /* ---------- render ---------- */
  function draw(root, name, town, slots, venue, next, otherVenues){
    var html='<style>'+STYLE+'</style><div class="inv">';
    html+='<div class="inv-eye">Everybody welcome</div>';
    html+='<h2 class="inv-t">Where we have classes</h2>';

    if(slots.length){
      var left='';
      left+='<div class="row"><div class="lab">When</div><div class="val">'
          + slots.map(function(s){
              return '<div class="when-line">'+esc(s.day)+', '+esc(s.time)
                   + (s.duration?' <span>('+esc(s.duration)+')</span>':'')+'</div>';
            }).join('')
          + '</div></div>';
      if(venue && (venue.name||venue.address)){
        left+='<div class="row"><div class="lab">Venue</div><div class="val">'
            + (venue.name?'<div class="venue">'+esc(venue.name)+'</div>':'')
            + (venue.address?'<div class="addr">'+esc(venue.address)+'</div>':'')
            + (venue.address?'<a class="dirs" href="'+esc(maps(venue.address))+'" target="_blank" rel="noopener">Get directions</a>':'')
            + '</div></div>';
      }
      if(otherVenues && otherVenues.length){
        left+='<div class="row"><div class="lab">Also at</div><div class="val">'
            + otherVenues.map(function(v){
                return '<div class="venue">'+esc(v)+'</div>'
                     + '<a class="dirs" href="'+esc(maps(v))+'" target="_blank" rel="noopener">Get directions</a>';
              }).join('')
            + '</div></div>';
      }
      if(venue && venue.access){
        left+='<div class="row"><div class="lab">Information</div><div class="val"><div class="info">'+esc(venue.access)+'</div></div></div>';
      }
      var right='';
      if(next){
        right='<div class="next"><div class="next-l">Next date</div>'
            + '<div class="next-d">'+DOWS[next.d.getDay()]+' '+next.d.getDate()+' '+MON[next.d.getMonth()]+'</div>'
            + (next.time?'<div class="next-t">'+esc(next.time)+'</div>':'')
            + '</div>';
      }
      html+='<div class="inv-grid"><div class="inv-main">'+left+'</div>'+right+'</div>';
    } else {
      html+='<p class="soon">We&rsquo;re confirming a venue and dates in '+esc(name)+' now.<br>'
          + 'You&rsquo;re very welcome at any of our other classes in the meantime, and there are ways to start at home below.</p>';
    }
    html+='</div>';

    var pills=[{href:'/whats-on', label:'Classes in Cheltenham'}];
    BRANCHES.forEach(function(b){ if(b.slug!==town) pills.push({href:'/'+b.slug, label:'Classes in '+b.name}); });
    html+='<div class="bp">'+pills.map(function(p){ return '<a href="'+p.href+'">'+esc(p.label)+'</a>'; }).join('')+'</div>';

    root.className='akxb';
    root.innerHTML=html;
  }

  /* ---------- data ---------- */
  function run(root){
    var town=(root.getAttribute('data-town')||'').trim().toLowerCase();
    var name=(root.getAttribute('data-name')||town.charAt(0).toUpperCase()+town.slice(1)).trim();

    Promise.all([
      gviz(WC_SHEET,'Class details').catch(function(){return [];}),
      gviz(WC_SHEET,'Talks & series').catch(function(){return [];}),
      gviz(WC_SHEET,'Locations').catch(function(){return [];}),
      gviz(CR_SHEET,'Events').catch(function(){return [];})
    ]).then(function(res){
      var classes=res[0], talks=res[1], locs=res[2], events=res[3];

      var venue=null;
      locs.forEach(function(l){
        var id=String(pick(l,['Location ID','location','id'])||'').trim().toLowerCase();
        if(id!==town || !live(pick(l,['status']))) return;
        var dn=pick(l,['display_name']);
        if(String(dn||'').trim().toLowerCase()===town) dn='';   /* don't repeat the town */
        venue={ name:dn, address:pick(l,['address']), access:pick(l,['access_note']) };
      });

      var byId={}; talks.forEach(function(t){ byId[String(pick(t,['Event ID','id'])).trim()]=t; });

      var seen={}, slots=[], next=null;
      classes.forEach(function(c){
        if(String(pick(c,['Location ID','location'])||'').trim().toLowerCase()!==town) return;
        var t=byId[String(pick(c,['Event ID','id'])).trim()];
        if(t && (!live(pick(t,['status'])) || !shown(pick(t,['show_from'])))) return;
        var future=splitDates(pick(c,['dates'])).filter(function(d){ return d>=TODAY; });
        if(!future.length) return;
        var day=dayName(pick(c,['day'])), time=pick(c,['time']);
        var k=day+'|'+time;
        if(!seen[k]){ seen[k]=1; slots.push({day:day,time:time,duration:pick(c,['duration'])}); }
        if(!next || future[0]<next.d) next={d:future[0], time:time};
      });

      var others=[], seenV={};
      events.forEach(function(e){
        if(!live(pick(e,['Status'])) || !shown(pick(e,['Show from']))) return;
        var loc=String(pick(e,['Location'])||'').trim();
        if(!loc || loc.toLowerCase().indexOf(town)===-1) return;
        var d=parseDate(pick(e,['Date'])); if(!d || d<TODAY) return;
        if(venue && venue.address && loc.toLowerCase()===String(venue.address).toLowerCase()) return;
        if(seenV[loc]) return; seenV[loc]=1; others.push(loc);
      });

      draw(root, name, town, slots, venue, next, others);
    }).catch(function(err){
      root.className='akxb';
      root.innerHTML='<style>'+STYLE+'</style><div class="inv"><p class="soon">Class details are taking a moment — please see the calendar below.</p></div>';
      if(window.console) console.log('[branch-events]', err);
    });
  }

  function go(){
    var root=document.getElementById(MOUNT);
    if(!root || root.getAttribute('data-done')) return;
    root.setAttribute('data-done','1');
    run(root);
  }
  go();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', go);
  var mo=new MutationObserver(go);
  try{ mo.observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}
})();
