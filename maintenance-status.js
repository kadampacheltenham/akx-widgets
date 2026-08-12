/* Residents maintenance status list — self-contained widget
 * Loads open reports from the "Public view" tab (names never included) and
 * renders them into <div id="maintenance-status"></div>.
 *
 * Embed on the Residents page (Squarespace Code block, or site code injection):
 *   <div id="maintenance-status"></div>
 *   <script src="https://cdn.jsdelivr.net/gh/kadampacheltenham/akx-widgets@main/maintenance-status.js"></script>
 */
(function () {
  var CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmkFh0pNOSmsVQhxt3XDbSX92_dSMpaB3GyuOLrtqBHWylK5jNSBiwuptoHzYJ9NTENDkFy4A0uL7b/pub?gid=476010350&single=true&output=csv";

  var COLOURS = {
    "submitted":  ["#CFE2F3", "#1155CC"],
    "reviewed":   ["#E6D6F2", "#6A1B9A"],
    "in-progress":["#FCE5CD", "#B45309"],
    "completed":  ["#D9EAD3", "#1E7A34"],
    "noted":      ["#D0E8E4", "#0F766E"],
    "closed":     ["#E0E0E0", "#616161"]
  };

  var CSS =
    ".rmt-wrap{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:760px;margin:0 auto;color:#243b53;}" +
    ".rmt-head{margin-bottom:14px;}" +
    ".rmt-title{font-size:1.35rem;font-weight:700;margin:0 0 4px;color:#2A66A6;}" +
    ".rmt-sub{font-size:.85rem;margin:0;color:#6b7a8d;line-height:1.4;}" +
    ".rmt-body{display:flex;flex-direction:column;gap:8px;}" +
    ".rmt-row{display:grid;grid-template-columns:88px 1fr auto;gap:12px;align-items:center;background:#FBF6ED;border:1px solid #efe6d4;border-radius:12px;padding:12px 14px;}" +
    ".rmt-date{font-size:.78rem;color:#8a7a5c;font-weight:600;line-height:1.25;}" +
    ".rmt-mid{min-width:0;}" +
    ".rmt-issue{font-size:.95rem;font-weight:600;color:#243b53;}" +
    ".rmt-floor{font-size:.8rem;color:#6b7a8d;margin-top:2px;}" +
    ".rmt-badge{font-size:.72rem;font-weight:700;padding:4px 10px;border-radius:999px;white-space:nowrap;text-transform:uppercase;letter-spacing:.02em;}" +
    ".rmt-empty,.rmt-loading,.rmt-err{font-size:.9rem;color:#6b7a8d;padding:14px 0;text-align:center;}" +
    ".rmt-err{color:#b45309;}" +
    ".rmt-foot{font-size:.78rem;color:#9aa7b5;margin-top:12px;}" +
    "@media(max-width:480px){.rmt-row{grid-template-columns:1fr auto;}.rmt-date{grid-column:1/-1;order:-1;}}";

  function injectCSS() {
    if (document.getElementById("rmt-css")) return;
    var s = document.createElement("style");
    s.id = "rmt-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function getHost() {
    var h = document.getElementById("maintenance-status");
    if (!h) {
      h = document.createElement("div");
      h.id = "maintenance-status";
      var sc = document.currentScript;
      if (sc && sc.parentNode) sc.parentNode.insertBefore(h, sc);
      else document.body.appendChild(h);
    }
    h.className = "rmt-wrap";
    h.innerHTML =
      '<div class="rmt-head"><h3 class="rmt-title">Reported issues</h3>' +
      '<p class="rmt-sub">Live from the maintenance tracker. Personal details are not shown. Closed items drop off automatically.</p></div>' +
      '<div id="rmt-body" class="rmt-body"><p class="rmt-loading">Loading the latest reports…</p></div>' +
      '<p class="rmt-foot">If your issue isn’t listed yet, it may still be coming through — please allow a little time.</p>';
    return h;
  }

  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
      else {
        if (c === '"') q = true;
        else if (c === ",") { row.push(cur); cur = ""; }
        else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
        else if (c === "\r") { } else cur += c;
      }
    }
    if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }

  function fmtDate(s) {
    if (!s) return "";
    var d = new Date(s.replace(" ", "T"));
    if (isNaN(d)) return (s.split(" ")[0] || s);
    var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return d.getDate() + " " + m[d.getMonth()];
  }

  function esc(s) {
    return (s || "").replace(/[&<>]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c]; });
  }

  function render(rows) {
    var body = document.getElementById("rmt-body");
    if (!body) return;
    var data = rows.slice(1).filter(function (r) { return r && (r[1] || "").trim() !== ""; });
    if (!data.length) { body.innerHTML = '<p class="rmt-empty">No open reports at the moment. 🌱</p>'; return; }
    var html = "";
    data.forEach(function (r) {
      var date = fmtDate(r[0]), issue = esc(r[1]), floor = esc(r[2]), status = (r[3] || "Submitted").trim();
      var col = COLOURS[status.toLowerCase()] || ["#eee", "#555"];
      html += '<div class="rmt-row">' +
        '<div class="rmt-date">' + esc(date) + '</div>' +
        '<div class="rmt-mid"><div class="rmt-issue">' + issue + '</div>' + (floor ? '<div class="rmt-floor">' + floor + '</div>' : '') + '</div>' +
        '<span class="rmt-badge" style="background:' + col[0] + ';color:' + col[1] + '">' + esc(status) + '</span>' +
      '</div>';
    });
    body.innerHTML = html;
  }

  function load() {
    fetch(CSV_URL + (CSV_URL.indexOf("?") > -1 ? "&" : "?") + "cachebust=" + Date.now())
      .then(function (r) { return r.text(); })
      .then(function (t) { render(parseCSV(t)); })
      .catch(function () {
        var body = document.getElementById("rmt-body");
        if (body) body.innerHTML = '<p class="rmt-err">Couldn’t load the list right now — please refresh in a moment.</p>';
      });
  }

  function start() { injectCSS(); getHost(); load(); setInterval(load, 120000); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
