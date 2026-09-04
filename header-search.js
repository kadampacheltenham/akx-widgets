/* AKBC — magnifier "Search" icon in the header, placed after Contact Us / before the social icons
 * (desktop header + mobile menu). Links to the built-in /search page.
 * Footer Code Injection: <script src="https://kadampacheltenham.github.io/akx-widgets/header-search.js"><\/script>
 * v1.1 (4 Sep 2026): the mobile menu gives every social icon its own container, so the old
 * selector added one magnifier per icon (four in total). Now adds exactly one per header area.
 */
(function () {
  if (/\/config\b/.test(location.pathname)) return;
  var SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"><circle cx="11" cy="11" r="7" style="fill:none"/><path d="m20 20-3.8-3.8"/></svg>';
  function add() {
    // one per bar (desktop + mobile), and only the FIRST social container in the slide-out menu
    var targets = [].slice.call(document.querySelectorAll(".header-actions-action--social"));
    var firstMenu = document.querySelector(".header-menu-actions-action--social");
    if (firstMenu) targets.push(firstMenu);
    targets.forEach(function (c) {
      if (c.querySelector(".akx-search")) return;
      var mobile = c.classList.contains("header-menu-actions-action--social");
      var a = document.createElement("a");
      a.className = "header-icon akx-search"; a.href = "/search"; a.title = "Search"; a.setAttribute("aria-label", "Search");
      a.style.cssText = "display:inline-flex;align-items:center;justify-content:center;width:" + (mobile ? 28 : 20) + "px;height:" + (mobile ? 28 : 20) + "px;color:inherit;" + (mobile ? "margin-right:22px;" : "margin-left:22px;transform:translateY(-4px);");
      a.innerHTML = SVG; if (mobile) { a.firstChild.style.width = "26px"; a.firstChild.style.height = "26px"; }
      c.insertBefore(a, c.firstElementChild);
    });
    // tidy any extras from an earlier run of the old version
    var menu = document.querySelector(".header-menu");
    if (menu) [].slice.call(menu.querySelectorAll(".akx-search")).slice(1).forEach(function (x) { x.remove(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
  setTimeout(add, 1500); // header sometimes re-renders
})();
