/* Akanishta — "Start Here" class cards. Swipeable cards for the Start Here page.
   Dates + times pulled LIVE from the Google Calendars; the "Opens" time is derived
   from the SAME feeds + logic as the When-to-Visit (opening times) widget, so the two
   never drift apart. Embed with a stub:
       <div id="cr-swipe"></div>
       <script src="https://kadampacheltenham.github.io/akx-widgets/sh-cards.js" defer></script>
   Card copy is configured in CARDS below. */
(function(){
  var root=document.getElementById('cr-swipe');
  if(!root || root.dataset.akxDone==='1') return; root.dataset.akxDone='1';

  var KEY='AIzaSyAVm0epUASAL2aNbAN_aBmpDDPxoPJVOwA';
  var TZ='Europe/London';
  var LOTUS='https://static1.squarespace.com/static/6a5a0b51083f343e9628d66e/t/6a5ba67a42763156df7f1739/1784391290902/Transparent+Golden+Lotus.png';
  var NEW_UNTIL=new Date('2027-04-01T00:00:00+01:00');   /* "New" badge stays ~6 months, through March 2027 */

  var OPEN_FEEDS=[
    {key:'weekly',       id:'c_9e95a300a2d0f8775b28d30ebfe5eb816d8dc678d4dffbebbc09cd59d9208ffd@group.calendar.google.com'},
    {key:'weekend',      id:'c_687cfcac60ad1fa647cd2fb654774156e1e48fb2dcbcf5c40a72340
