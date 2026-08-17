/* AKBC page-status strip — self-injecting widget
 * Reads a published Google Sheet (CSV) and shows a slim colour strip under the site header
 * on pages that have a row. Sheet columns (header row, any order, case-insensitive):
 *   page      — slug, e.g. courses-retreats  ("home" for the homepage)
 *   status    — green | amber | red   (anything else = hidden)
 *   note      — one line shown in the strip
 *   improved  — "Recently improved" items, separated by " | "
 *   todo      — "Still to do" items, separated by " | "
 *   updated   — free text date, e.g. 16 Aug
 * Rules: amber/red always show; green shows only if it has a note. No row = nothing.
 * Install once site-wide: Settings → Advanced → Code Injection → Footer:
 *   <script src="https://kadampacheltenham.github.io/akx-widgets/page-status.js"></script>
 */
(function () {
  var CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtty9gWoClUCr7f2l4nQcmm8wNtetmqDnt59JmzmReMBxoZ65kqd5kbDZu7IE7rJGbR6WLyPzfqSv7/pub?gid=162269595PASTE_PUBLISHED_CSV_URL_HEREsingle=truePASTE_PUBLISHED_CSV_URL_HEREoutput=csv";
  var CACHE_MIN = 3;

  if (!CSV_URL || CSV_URL.indexOf("http") !== 0) return;
  if (/\/config\b/.test(location.pathname)) return; // not inside the Squarespace editor shell

  var slug = location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
  if (!slug) slug = "home";

  var CSS =
    ".akx-ps{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.45;border-top:1px solid rgba(0,0,0,.05);border-bottom:1px solid rgba(0,0,0,.05);}" +
    ".akx-ps .row{max-width:1400px;margin:0 auto;display:flex;align-items:center;gap:12px;padding:9px 6vw;}" +
    ".akx-ps .dot{width:11px;height:11px;border-radius:50%;flex:0 0 auto;}" +
    ".akx-ps b{font-weight:600;}" +
    ".akx-ps .more{margin-left:auto;font-weight:600;text-decoration:underline;cursor:pointer;background:none;border:0;padding:0;font:inherit;color:inherit;opacity:.85;white-space:nowrap;}" +
    ".akx-ps.g{background:#EAF6EC;color:#1E5A2B;} .akx-ps.g .dot{background:#4FA35A;}" +
    ".akx-ps.a{background:#FFF4E0;color:#7A4B00;} .akx-ps.a .dot{background:#E8A33D;}" +
    ".akx-ps.r{background:#FDECEA;color:#8A2A22;} .akx-ps.r .dot{background:#D9534F;}" +
    ".akx-ps .panel{display:none;max-width:1400px;margin:0 auto;padding:0 6vw 12px;}" +
    ".akx-ps.open .panel{display:block;}" +
    ".akx-ps .box{background:#FBF6ED;border-left:4px solid #E8A33D;border-radius:0 12px 12px 0;padding:12px 16px;color:#3a3a3a;display:grid;grid-template-columns:1fr 1fr;gap:6px 30px;}" +
    ".akx-ps.r .box{border-left-color:#D9534F;} .akx-ps.g .box{border-left-color:#4FA35A;}" +
    ".akx-ps h4{margin:0 0 4px;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:#7A8797;font-weight:700;}" +
    ".akx-ps ul{margin:0;padding-left:18px;} .akx-ps li{margin:2px 0;}" +
    ".akx-ps .upd{grid-column:1/-1;font-size:12px;color:#7A8797;margin-top:4px;}" +
    "@media(max-width:680px){.akx-ps .row{flex-wrap:wrap;padding:9px 16px;} .akx-ps .more{margin-left:auto;} .akx-ps .panel{padding:0 16px 12px;} .akx-ps .box{grid-template-columns:1fr;}}";

  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; }
      else cur += c;
    }
    if (cur.length || row.length) { row.push(cur); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (x) { return x && x.trim(); }); });
  }

  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]; }); }
  function items(s) { return String(s || "").split("|").map(function (x) { return x.trim(); }).filter(Boolean); }

  function render(rec) {
    var status = (rec.status || "").trim().toLowerCase();
    var cls = status === "red" ? "r" : status === "amber" || status === "orange" ? "a" : status === "green" ? "g" : "";
    if (!cls) return;
    if (cls === "g" && !(rec.note || "").trim()) return;
    var imp = items(rec.improved), todo = items(rec.todo);
    var hasPanel = imp.length || todo.length;
    var lead = cls === "r" ? "Known issue:" : cls === "a" ? "We're still working on this page" : "Recently improved";
    var note = (rec.note || "").trim();

    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var el = document.createElement("div"); el.className = "akx-ps " + cls; el.setAttribute("role", "status");
    el.innerHTML =
      '<div class="row"><span class="dot"></span><span><b>' + esc(lead) + '</b>' + (note ? (cls === "r" ? " " : " &mdash; ") + esc(note) : "") + '</span>' +
      (hasPanel ? '<button class="more" type="button" aria-expanded="false">What\u2019s changed \u25BE</button>' : "") + '</div>' +
      (hasPanel ? '<div class="panel"><div class="box">' +
        (imp.length ? '<div><h4>Recently improved</h4><ul>' + imp.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul></div>' : "<div></div>") +
        (todo.length ? '<div><h4>Still to do</h4><ul>' + todo.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul></div>' : "") +
        '<div class="upd">' + (rec.updated ? "Last updated " + esc(rec.updated) + " \u00B7 " : "") + 'Spotted something? Use the \u201CReport a problem\u201D button.</div>' +
        '</div></div>' : "");
    if (hasPanel) {
      var btn = el.querySelector(".more");
      btn.addEventListener("click", function () {
        var open = el.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.textContent = open ? "Hide \u25B4" : "What\u2019s changed \u25BE";
      });
    }
    var header = document.getElementById("header") || document.querySelector("header");
    if (header && header.parentNode) header.parentNode.insertBefore(el, header.nextSibling);
    else document.body.insertBefore(el, document.body.firstChild);
  }

  function go(text) {
    var rows = parseCSV(text); if (rows.length < 2) return;
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    for (var i = 1; i < rows.length; i++) {
      var rec = {}; head.forEach(function (h, j) { rec[h] = rows[i][j] || ""; });
      var p = (rec.page || "").trim().replace(/^\/+|\/+$/g, "").toLowerCase();
      if (p === slug || (p === "home" && slug === "home")) { render(rec); return; }
    }
  }

  try {
    var key = "akx-ps-csv", ts = "akx-ps-ts";
    var cached = sessionStorage.getItem(key), when = +sessionStorage.getItem(ts) || 0;
    if (cached && Date.now() - when < CACHE_MIN * 60000) { go(cached); return; }
  } catch (e) {}
  fetch(CSV_URL, { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (t) {
    try { sessionStorage.setItem("akx-ps-csv", t); sessionStorage.setItem("akx-ps-ts", String(Date.now())); } catch (e) {}
    go(t);
  }).catch(function () {});
})();
