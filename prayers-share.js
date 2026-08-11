(function(){
 var ROOT=document.getElementById('akx-prayers');
 if(!ROOT||ROOT.dataset.done) return; ROOT.dataset.done='1';
 if(!document.getElementById('akx-prayers-font')){var _l=document.createElement('link');_l.id='akx-prayers-font';_l.rel='stylesheet';_l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Cormorant+Garamond:wght@500;600;700&display=swap';document.head.appendChild(_l);}
 ROOT.innerHTML = '' + String.raw`<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
<style>
#akx-prayers{--coral:#E2886A;--coral-d:#D2775B;--cream:#FBF6ED;--page:#FDFBF6;--ink:#1D1D1F;--teal:#2E7C7C;--catcol:#4A6B66;--gold:#C69A3E;--goldsoft:#D2B472;--line:#EDE4D3;--soft:#8A8072;--faint:#AFA694;font-family:'Inter',sans-serif;color:var(--ink);display:block;max-width:1040px;margin:0 auto;-webkit-font-smoothing:antialiased}
#akx-prayers *{box-sizing:border-box;margin:0;padding:0}
#akx-prayers button{touch-action:manipulation;-webkit-tap-highlight-color:rgba(0,0,0,0);font-family:'Inter',sans-serif}
#akx-prayers .banner{position:relative;overflow:hidden;background:linear-gradient(115deg,#FBF6ED 0%,#F9EEDF 55%,#F6E3D3 100%);border-radius:26px;box-shadow:0 3px 20px rgba(29,29,31,.06);display:grid;grid-template-columns:1fr 240px;gap:28px;align-items:center;padding:48px 52px}
#akx-prayers .eyebrow{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:18px}
#akx-prayers .banner p{color:var(--soft);font-size:14.5px;line-height:1.65;max-width:520px;margin-top:20px}
#akx-prayers .bigbtn{display:inline-flex;align-items:center;gap:12px;border:none;cursor:pointer;background:var(--coral);color:#fff;font-weight:600;font-size:19px;padding:17px 32px;border-radius:999px;box-shadow:0 8px 22px rgba(226,136,106,.35);transition:background .18s}
#akx-prayers .bigbtn:hover{background:var(--coral-d)}
#akx-prayers .photo{width:240px;height:240px;border-radius:50%;object-fit:cover;display:block;-webkit-mask-image:radial-gradient(circle closest-side,#000 82%,transparent 99%);mask-image:radial-gradient(circle closest-side,#000 82%,transparent 99%)}
#akx-prayers .revealrow{text-align:center;margin-top:30px}
#akx-prayers .reveal{background:none;border:1.5px solid var(--line);border-radius:999px;color:var(--teal);font-weight:600;font-size:14px;padding:12px 28px;cursor:pointer;transition:background .15s}
#akx-prayers .reveal:hover{background:var(--cream)}
#akx-prayers .scrim{position:fixed;inset:0;background:rgba(29,29,31,.32);opacity:0;pointer-events:none;transition:opacity .3s;z-index:40;cursor:pointer}
#akx-prayers .scrim.show{opacity:1;pointer-events:auto}
#akx-prayers .dialog{position:fixed;left:50%;top:50%;transform:translate(-50%,-46%) scale(.98);width:min(600px,calc(100vw - 32px));max-height:calc(100vh - 40px);overflow:auto;background:#FFFDF8;border-radius:24px;box-shadow:0 24px 70px rgba(29,29,31,.22);padding:34px 34px 28px;opacity:0;pointer-events:none;z-index:50;transition:opacity .3s,transform .3s}
#akx-prayers .dialog.show{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
#akx-prayers .dhead{display:flex;align-items:center;gap:13px;margin-bottom:20px}
#akx-prayers .dhead .ico{width:44px;height:44px;border-radius:50%;background:var(--cream);display:flex;align-items:center;justify-content:center;flex:0 0 auto}
#akx-prayers .dhead h3{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:25px;color:var(--catcol)}
#akx-prayers .close{position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;color:var(--faint);padding:6px;line-height:0}
#akx-prayers label{display:block;font-size:13px;font-weight:600;color:#5E5748;margin-bottom:6px}
#akx-prayers label .opt{font-weight:400;color:var(--faint)}
#akx-prayers .field{margin-bottom:15px}
#akx-prayers input,#akx-prayers select{width:100%;background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-family:'Inter',sans-serif;font-size:15px;color:var(--ink);appearance:none;-webkit-appearance:none;transition:border-color .15s}
#akx-prayers select{background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1.5l5 5 5-5' fill='none' stroke='%238A8072' stroke-width='1.6' stroke-linecap='round'/></svg>");background-repeat:no-repeat;background-position:right 15px center}
#akx-prayers input::placeholder{color:#C9C0AE}
#akx-prayers input:focus,#akx-prayers select:focus{outline:none;border-color:var(--coral)}
#akx-prayers .hint{font-size:11px;color:var(--faint);margin-top:5px}
#akx-prayers .ferr{display:none;font-size:12.5px;color:#B0563C;margin-top:6px}
#akx-prayers .submit{width:100%;background:var(--coral);color:#fff;border:none;border-radius:999px;padding:14px 26px;font-weight:600;font-size:15.5px;cursor:pointer;margin-top:6px;transition:background .18s}
#akx-prayers .submit:hover{background:var(--coral-d)}
#akx-prayers .dfoot{text-align:center;font-size:11.5px;color:var(--faint);margin-top:13px;line-height:1.6}
#akx-prayers .dpanel{display:none;text-align:center;padding:6px 2px 4px}
#akx-prayers .dpanel.show{display:block}
#akx-prayers .dpanel h3{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:25px;margin-bottom:10px;color:var(--catcol)}
#akx-prayers .dpanel p{font-size:14.5px;line-height:1.7;color:var(--soft)}
#akx-prayers .ghost{display:inline-block;background:none;border:1.5px solid var(--line);color:var(--teal);border-radius:999px;font-weight:600;font-size:14px;padding:11px 26px;cursor:pointer;margin-top:20px}
#akx-prayers .ghost:hover{background:var(--cream)}
#akx-prayers .ccat{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:19px;line-height:1.3;color:var(--catcol)}
#akx-prayers .ccatnote{font-size:10.5px;color:var(--faint);margin-top:2px;margin-bottom:8px}
#akx-prayers .cmonth{font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);font-weight:600;margin:10px 2px 4px}
#akx-prayers .centry{display:flex;align-items:center;padding:3px 2px}
#akx-prayers .centry .hm{width:26px;height:26px;flex:0 0 auto;margin-right:10px}
#akx-prayers .centry .nm{font-size:13.5px;line-height:1.45;min-width:0}
#akx-prayers .centry .cm{color:var(--gold)}
#akx-prayers .centry .dt{font-size:10.5px;color:var(--faint);white-space:nowrap;flex:0 0 auto;margin-left:auto;padding-left:12px;font-variant-numeric:tabular-nums}
#akx-prayers .pcat{margin-bottom:20px}
#akx-prayers .pcat + .pcat{border-top:1px solid var(--line);padding-top:18px}
#akx-prayers .loadmsg{font-size:13px;color:var(--faint);text-align:center;padding:16px 0}
@media(max-width:720px){
 #akx-prayers .banner{grid-template-columns:1fr;padding:34px 24px;text-align:center}
 #akx-prayers .banner p{margin-left:auto;margin-right:auto}
 #akx-prayers .photo{width:180px;height:180px;margin:0 auto;order:-1}
 #akx-prayers .bigbtn{font-size:17px;padding:15px 26px}
 #akx-prayers .lbl-desk{display:none}
 #akx-prayers input,#akx-prayers select{font-size:16px}
 #akx-prayers .centry .cm{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
}
@media(min-width:721px){#akx-prayers .lbl-mob{display:none}}
</style>

<div class="banner">
 <div class="bcopy">
  <div class="eyebrow">In times of Worry, suffering &amp; tragedy</div>
  <button class="bigbtn" id="akxOpen"><svg width="22" height="22" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 9c-1.6 3.2-1.6 12.5-1.6 15.2 0 1 .7 1.8 1.6 1.8s1.6-.8 1.6-1.8c0-2.7 0-12-1.6-15.2z" fill="#fff"/><path d="M18.4 12c-2.2 1.1-4.9 4.4-5.4 9.2-.2 1.7-.2 3.6 1.1 4.2 1.1.5 2.4-.2 3-1.2" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/><path d="M21.6 12c2.2 1.1 4.9 4.4 5.4 9.2.2 1.7.2 3.6-1.1 4.2-1.1.5-2.4-.2-3-1.2" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/></svg>Share your prayers</button>
  <p>Add the name of someone who is sick, suffering or passed away (including pets and animals) and we will hold them in our prayers. Names are read out at the beginning of some weekly and monthly prayers.</p>
 </div>
 <img class="photo" alt="Venerable Geshe Kelsang Gyatso Rinpoche in prayer" src="https://kadampacheltenham.github.io/akx-widgets/vgkgr-circle.png">
</div>
<div class="revealrow"><button class="reveal" id="akxReveal">Show prayer requests</button></div>

<div class="scrim" id="akxScrim"></div>

<!-- form dialog -->
<div class="dialog" id="akxForm" role="dialog" aria-modal="true" aria-label="Share your prayers">
 <button class="close" data-close aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
 <div class="fbody">
  <div class="dhead"><span class="ico"><svg width="22" height="22" viewBox="0 0 40 40"><path d="M20 9c-1.6 3.2-1.6 12.5-1.6 15.2 0 1 .7 1.8 1.6 1.8s1.6-.8 1.6-1.8c0-2.7 0-12-1.6-15.2z" fill="#E2886A"/><path d="M18.4 12c-2.2 1.1-4.9 4.4-5.4 9.2-.2 1.7-.2 3.6 1.1 4.2 1.1.5 2.4-.2 3-1.2" fill="none" stroke="#E2886A" stroke-width="1.7" stroke-linecap="round"/><path d="M21.6 12c2.2 1.1 4.9 4.4 5.4 9.2.2 1.7.2 3.6-1.1 4.2-1.1.5-2.4-.2-3-1.2" fill="none" stroke="#E2886A" stroke-width="1.7" stroke-linecap="round"/></svg></span><h3>Share your prayers</h3></div>
  <div class="field"><label>Your name</label><input id="pfName" maxlength="35" placeholder="Your name"><div class="hint">Up to 35 characters</div><div class="ferr" id="errName">Please add your name.</div></div>
  <div class="field"><label>Type of prayer</label><select id="pfType"><option value="">Please choose…</option><option value="sick">For someone sick or suffering</option><option value="died">For someone who has died</option></select><div class="ferr" id="errType">Please choose the type of prayer.</div></div>
  <div class="field"><label><span class="lbl-desk">The person or people prayers are requested for</span><span class="lbl-mob">The person prayers are requested for</span></label><input id="pfFor" maxlength="35" placeholder="Who the prayers are for"><div class="hint">Up to 35 characters</div><div class="ferr" id="errFor">Please add who the prayers are for.</div></div>
  <div class="field"><label>Comment <span class="opt">(optional)</span></label><input id="pfComment" maxlength="60" placeholder="A few words, if you wish (public)"><div class="hint">Up to 60 characters</div></div>
  <button class="submit" id="pfSubmit">Submit your prayers</button>
  <div class="dfoot">Up to 3 prayers each day · read out at the beginning of weekly and monthly prayers</div>
 </div>
 <div class="dpanel" id="panelThanks"><h3>Thank you for sharing your prayers</h3><p>They will be read out at the beginning of weekly and monthly prayers. You can see the calendar with the programme of prayers at the bottom of this page.</p><button class="ghost" data-close>Close</button></div>
 <div class="dpanel" id="panelLimit"><h3>Your prayers are with us for today</h3><p>You can share up to <b>three</b> prayers a day, so that everyone has space to be included. Please come back tomorrow — we would love to include more of your prayers then.</p><button class="ghost" data-close>Close</button></div>
 <div class="dpanel" id="panelFilter"><h3>A gentler wording, please</h3><p>Some of the words in your request couldn't be included. Nothing is lost — please soften the wording and share again.</p><button class="ghost" id="filterBack">Return to your prayer</button></div>
 <div class="dpanel" id="panelBlocked"><h3>A pause, for now</h3><p>Sharing is paused on this device for a short time. Everyone remains welcome at prayers — thank you for understanding.</p><button class="ghost" data-close>Close</button></div>
</div>

<!-- list dialog -->
<div class="dialog" id="akxList" role="dialog" aria-modal="true" aria-label="Prayers requested">
 <button class="close" data-close aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
 <div id="akxListBody"><div class="loadmsg">Loading…</div></div>
</div>`;
 var API='https://script.google.com/macros/s/AKfycbxktYk9QSMJgF3ci70hImUvlbx1-SmQzouHYm5jtXVJ0mUiPWqVMubO4x0RC9ZACjgiPQ/exec';
 var DK='akx_prayer_device', dev='';
 try{dev=localStorage.getItem(DK)||'';}catch(e){}
 if(!dev){dev='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);try{localStorage.setItem(DK,dev);}catch(e){}}
 var $=function(id){return document.getElementById(id);};
 var scrim=$('akxScrim'),form=$('akxForm'),list=$('akxList');
 function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
 function emblem(){return '<svg class="hm" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#D2B472"/><path d="M20 11c-1.4 2.8-1.4 11-1.4 13.4 0 .9.6 1.6 1.4 1.6s1.4-.7 1.4-1.6c0-2.4 0-10.6-1.4-13.4z" fill="#fff"/><path d="M18.6 13.6c-1.9 1-4.2 3.8-4.6 7.9-.2 1.5-.2 3.1 1 3.6.9.4 2-.2 2.5-1" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="M21.4 13.6c1.9 1 4.2 3.8 4.6 7.9.2 1.5.2 3.1-1 3.6-.9.4-2-.2-2.5-1" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>';}
 function openD(d){scrim.classList.add('show');d.classList.add('show');}
 function closeAll(){scrim.classList.remove('show');form.classList.remove('show');list.classList.remove('show');}
 function showPanel(id){['fbody','panelThanks','panelLimit','panelFilter','panelBlocked'].forEach(function(k){var el=form.querySelector('.'+k)||$(k);});
  form.querySelector('.fbody').style.display=(id==='fbody')?'block':'none';
  ['panelThanks','panelLimit','panelFilter','panelBlocked'].forEach(function(k){$(k).classList.toggle('show',k===id);});}
 // open form
 $('akxOpen').addEventListener('click',function(){showPanel('fbody');openD(form);});
 [].forEach.call(ROOT.querySelectorAll('[data-close]'),function(b){b.addEventListener('click',closeAll);});
 scrim.addEventListener('click',closeAll);
 $('filterBack').addEventListener('click',function(){showPanel('fbody');});
 // submit
 $('pfSubmit').addEventListener('click',function(){
  var name=$('pfName').value.trim(),type=$('pfType').value,pfor=$('pfFor').value.trim(),comment=$('pfComment').value.trim();
  $('errName').style.display=name?'none':'block';
  $('errType').style.display=type?'none':'block';
  $('errFor').style.display=pfor?'none':'block';
  if(!name||!type||!pfor)return;
  var btn=this;btn.disabled=true;btn.textContent='Sending…';
  fetch(API,{method:'POST',body:JSON.stringify({action:'submit',deviceId:dev,type:type,fromName:name,prayerFor:pfor,comment:comment})})
   .then(function(r){return r.json();})
   .then(function(res){
     btn.disabled=false;btn.textContent='Submit your prayers';
     if(res.ok){$('pfName').value='';$('pfType').value='';$('pfFor').value='';$('pfComment').value='';showPanel('panelThanks');}
     else if(res.reason==='limit'){showPanel('panelLimit');}
     else if(res.reason==='blocked'){showPanel('panelBlocked');}
     else if(res.reason==='filter'){showPanel(res.blocked?'panelBlocked':'panelFilter');}
     else{alert('Sorry, something went wrong — please try again.');}
   })
   .catch(function(){btn.disabled=false;btn.textContent='Submit your prayers';alert('Sorry, we could not reach the prayer list just now — please try again.');});
 });
 // list
 var reveal=$('akxReveal');
 reveal.addEventListener('click',function(){
  $('akxListBody').innerHTML='<div class="loadmsg">Loading…</div>';openD(list);
  fetch(API+'?action=list').then(function(r){return r.json();}).then(function(d){renderList(d);})
   .catch(function(){$('akxListBody').innerHTML='<div class="loadmsg">Sorry, the prayer list could not be loaded just now.</div>';});
 });
 function renderCat(title,note,entries){
  var h='<div class="pcat"><div class="ccat">'+title+'</div><div class="ccatnote">'+note+'</div>';
  var lastMonth='';
  entries.forEach(function(e){
   if(e.month!==lastMonth){h+='<div class="cmonth">'+esc(e.month)+'</div>';lastMonth=e.month;}
   var cm=e.comment?' <span class="cm">— '+esc(e.comment)+'</span>':'';
   h+='<div class="centry">'+emblem()+'<span class="nm">'+esc(e.name)+cm+'</span><span class="dt">'+esc(e.date)+'</span></div>';
  });
  return h+'</div>';
 }
 function renderList(d){
  if(!d||!d.ok){$('akxListBody').innerHTML='<div class="loadmsg">Sorry, the prayer list could not be loaded just now.</div>';return;}
  var h='';
  h+=renderCat('For those who have passed away &amp; their families','Names remain on this prayer list for 49 days',d.died||[]);
  h+=renderCat('For those sick or suffering','Names remain on this prayer list for 30 days',d.sick||[]);
  $('akxListBody').innerHTML=h;
 }

})();
