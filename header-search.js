/* AKBC — magnifier "Search" icon in the header, placed after Contact Us / before the social icons
 * (desktop header + mobile menu). Links to the built-in /search page.
 * Footer Code Injection: <script src="https://kadampacheltenham.github.io/akx-widgets/header-search.js"><\/script>
 * v1.2 (4 Sep 2026): in the slide-out menu the magnifier now sits in its OWN container
 * (class akx-search-wrap) before the socials, so Custom CSS can put it on its own line,
 * spaced between the menu items and the social circles. Bars unchanged.
 * v1.1 (4 Sep 2026): one magnifier per header area (was one per social container).
 */
(function () {
  if (/\/config\b/.test(location.pathname)) return;
  var SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"><circle cx="11" cy="11" r="7" style="fill:none"/><path d="m20 20-3.8-3.8"/></svg>';
  function mk(mobile) {
    var a = document.createElement("a");
    a.className = "header-icon akx-search"; a.href = "/search"; a.title = "Search"; a.setAttribute("aria-label", "Search");
    a.style.cssText = "display:inline-flex;align-items:center;justify-content:center;width:" + (mobile ? 28 : 20) + "px;height:" + (mobile ? 28 : 20) + "px;color:inherit;" + (mobile ? "" : "margin-left:22px;transform:translateY(-4px);");
    a.innerHTML = SVG; if (mobile) { a.firstChild.style.width = "26px"; a.firstChild.style.height = "26px"; }
    return a;
  }
  function add() {
    // bars (desktop + mobile): one magnifier inside the social cluster
    document.querySelectorAll(".header-actions-action--social").forEach(function (c) {
      if (c.querySelector(".akx-search")) return;
      c.insertBefore(mk(false), c.firstElementChild);
    });
    // slide-out menu: one magnifier in its OWN container before the socials
    var firstMenu = document.querySelector(".header-menu-actions-action--social");
    if (firstMenu && !firstMenu.parentElement.querySelector(".akx-search")) {
      var wrap = document.createElement("div");
      wrap.className = "header-menu-actions-action akx-search-wrap";
      wrap.appendChild(mk(true));
      firstMenu.parentElement.insertBefore(wrap, firstMenu);
    }
    // tidy magnifiers left inside menu social containers by older versions
    var menu = document.querySelector(".header-menu");
    if (menu) [].slice.call(menu.querySelectorAll(".header-menu-actions-action--social .akx-search")).forEach(function (x) { x.remove(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
  setTimeout(add, 1500); // header sometimes re-renders
})();
