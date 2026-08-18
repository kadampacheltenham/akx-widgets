/* AKBC — /epc: Contact Us messages, last 30 days (manager view)
 * Source: Tally form XxvXAg -> Google Sheets integration -> sheet published to web as CSV.
 * Stub on /epc:  <div id="akx-msgs"></div>
 *                <script src="https://kadampacheltenham.github.io/akx-widgets/epc-contact-messages.js"><\/script>
 * Columns are found by name (case-insensitive, partial): submitted / name / email / phone / topic|subject / message.
 */
(function(){
  var CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSIHL1qFChqELQNZYWph1_rKJ4OR6a3Mvd8E9vr3Zu2d6GnmWnsWf58m9W1rfIi4ytajGl5_i1tP7rb/pub?gid=1509373689&single=true&output=csv";
  var DAYS = 30, DEFAULT_DAYS = 7;
  var root=document.getElementById("akx-msgs"); if(!root) return;
  var CSS=".akx-msgs{font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1F2A3C;max-width:1000px;margin:0 auto;}"+
    ".akx-msgs .hd{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 12px;}"+
    ".akx-msgs .hd b{font-size:1.05rem;} .akx-msgs .hd span{font-size:.85rem;color:#7A8797;}"+
    ".akx-msgs .m{background:#fff;border:1px solid #E7E1D5;border-radius:12px;padding:14px 16px;margin:0 0 10px;}"+
    ".akx-msgs .top{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;margin-bottom:6px;}"+
    ".akx-msgs .top b{font-size:1rem;} .akx-msgs .top .d{color:#7A8797;font-size:.85rem;margin-left:auto;}"+
    ".akx-msgs .tag{font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;font-weight:600;color:#2A66A6;background:#E3F1FB;border-radius:999px;padding:2px 9px;}"+
    ".akx-msgs .body{white-space:pre-wrap;line-height:1.5;font-size:.95rem;}"+
    ".akx-msgs .ft{margin-top:8px;font-size:.85rem;} .akx-msgs .ft a{color:#2A66A6;text-decoration:none;margin-right:14px;} .akx-msgs .ft a:hover{text-decoration:underline;}"+
    ".akx-msgs .ft .meta{color:#7A8797;margin-right:14px;}"+
    ".akx-msgs .rt{display:flex;align-items:baseline;gap:10px;margin:0 0 14px;font-size:.95rem;} .akx-msgs .rt .stars{color:#E0A526;font-size:1.25rem;letter-spacing:2px;} .akx-msgs .rt .lbl{font-weight:600;} .akx-msgs .rt .n{color:#7A8797;}"+
    ".akx-msgs .tog{background:none;border:1px solid #D9D2C4;border-radius:999px;padding:5px 12px;font:inherit;font-size:.82rem;color:#2A66A6;cursor:pointer;padding:8px 18px;font-size:.9rem;}"+
    ".akx-msgs .more{text-align:center;margin:14px 0 6px;}"+
    ".akx-msgs .empty{color:#7A8797;padding:20px 0;}";
  var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
  root.className="akx-msgs";root.innerHTML='<div class="empty">Loading messages…</div>';
  if(CSV_URL.indexOf("http")!==0){root.innerHTML='<div class="empty">Not connected yet — sheet URL missing.</div>';return;}

  function parseCSV(text){var rows=[],row=[],cur="",q=false;for(var i=0;i<text.length;i++){var c=text[i];
    if(q){if(c==='"'){if(text[i+1]==='"'){cur+='"';i++;}else q=false;}else cur+=c;}
    else if(c==='"')q=true;else if(c===","){row.push(cur);cur="";}
    else if(c==="\n"||c==="\r"){if(c==="\r"&&text[i+1]==="\n")i++;row.push(cur);rows.push(row);row=[];cur="";}else cur+=c;}
    if(cur.length||row.length){row.push(cur);rows.push(row);}return rows.filter(function(r){return r.some(function(x){return x&&x.trim();});});}
  function esc(s){return String(s||"").replace(/[&<>"]/g,function(m){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m];});}
  function col(head,words){for(var w=0;w<words.length;w++)for(var i=0;i<head.length;i++)if(head[i].indexOf(words[w])>-1)return i;return -1;}
  function when(s){var d=new Date(s);if(isNaN(d)){var m=String(s).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})[ T]*(\d{1,2})?:?(\d{2})?/);if(m)d=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));}return d;}
  function fmt(d){return isNaN(d)?"":d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})+" · "+d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});}

  fetch(CSV_URL,{cache:"no-store"}).then(function(r){return r.text();}).then(function(t){
    var rows=parseCSV(t);if(rows.length<2){root.innerHTML='<div class="empty">No messages yet.</div>';return;}
    var head=rows[0].map(function(h){return h.trim().toLowerCase();});
    var iW=col(head,["submitted","date","time"]),iN=col(head,["name"]),iE=col(head,["email"]),iP=col(head,["phone","mobile"]),iG=col(head,["page"]),iR=col(head,["how you think"]),iT=col(head,["topic","subject","about","reason"]),iM=col(head,["message","enquiry","question","details","comment"]);
    var since=Date.now()-DAYS*864e5,items=[];
    for(var i=1;i<rows.length;i++){var r=rows[i],d=iW>-1?when(r[iW]):new Date(NaN);if(!isNaN(d)&&d.getTime()<since)continue;
      items.push({d:d,name:iN>-1?r[iN]:"",email:iE>-1?r[iE]:"",phone:iP>-1?r[iP]:"",topic:iT>-1?r[iT]:"",msg:iM>-1?r[iM]:r.slice(3).filter(Boolean).join("\n"),page:iG>-1?r[iG]:"",rating:iR>-1?r[iR]:""});}
    items.sort(function(a,b){return (b.d||0)-(a.d||0);});
    var rs=items.map(function(m){return parseFloat(m.rating);}).filter(function(x){return !isNaN(x);});
    var avg=rs.length?rs.reduce(function(a,b){return a+b;},0)/rs.length:0;
    var stars="";for(var k=1;k<=5;k++)stars+=Math.round(avg)>=k?"\u2605":"\u2606";
    var rt='<div class="rt"><span class="lbl">30-day Rating</span>'+(rs.length?'<span class="stars">'+stars+'</span><span class="n">('+avg.toFixed(1)+' from '+rs.length+')</span>':'<span class="n">no ratings yet</span>')+'</div>';
    var showAll=false;
    function draw(){
      var lim=showAll?DAYS:DEFAULT_DAYS, cut=Date.now()-lim*864e5;
      var vis=items.filter(function(m){return isNaN(m.d)||m.d.getTime()>=cut;});
      var h=rt+'<div class="hd"><b>Contact Us messages</b><span>Last '+lim+' days · '+vis.length+' message'+(vis.length===1?"":"s")+'</span></div>';
      if(!vis.length)h+='<div class="empty">No messages in the last '+lim+' days.</div>';
      vis.forEach(function(m){var subj=encodeURIComponent("Re: your message to Akanishta KBC"+(m.topic?" \u2014 "+m.topic:""));
        h+='<div class="m"><div class="top"><b>'+esc(m.name||"(no name)")+'</b>'+(m.topic?'<span class="tag">'+esc(m.topic)+'</span>':'')+'<span class="d">'+esc(fmt(m.d))+'</span></div>'+
           '<div class="body">'+esc(m.msg)+'</div><div class="ft">'+(m.email?'<a href="mailto:'+esc(m.email)+'?subject='+subj+'">Reply to '+esc(m.email)+'</a>':'')+(m.phone?'<a href="tel:'+esc(m.phone.replace(/\s+/g,""))+'">'+esc(m.phone)+'</a>':'')+(m.page?'<span class="meta">Page: '+esc(m.page)+'</span>':'')+(m.rating?'<span class="meta">Rating: '+esc(m.rating)+'/5</span>':'')+'</div></div>';});
      if(items.length>vis.length||showAll)h+='<div class="more"><button class="tog" type="button">'+(showAll?"Show last "+DEFAULT_DAYS+" days":"Show all (up to "+DAYS+" days \u00b7 "+items.length+")")+'</button></div>';
      root.innerHTML=h;
      var b=root.querySelector(".tog");if(b)b.addEventListener("click",function(){showAll=!showAll;draw();});
    }
    draw();
  }).catch(function(){root.innerHTML='<div class="empty">Couldn’t load the messages sheet.</div>';});
})();
