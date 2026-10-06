/* Explainer modal - Sjovt Dansk. Opens a silent grammar explainer (pixel monitor) over a game.
   Vanilla JS, no fetch/CDN, works on file://.

   Usage in a game's HTML (after sjovt.js):
     <html data-explainer="en-et">             (comma-separated scene ids; >1 shows a chooser)
     <link rel="stylesheet" href="../shared/explainer/modal.css">
     <script src="../shared/explainer/modal.js"></script>
   A "FORKLARING" button is added to the shared .sd-bar (floating corner button if there is no bar).
   Scenes live in ./scenes/<id>.scene.js and set window.EXPLAINER_SCENE.
   API: ExplainerModal.open(ids, triggerEl), ExplainerModal.close(), ExplainerModal.isOpen().
   Events (on document, CustomEvent): "explainer:open" and "explainer:close" (detail: {ids}). Games with a running countdown
   listen to them to pause/resume. Each open is followed by exactly one close. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var script = doc.currentScript;
  var base = script && script.src ? script.src.replace(/[^\/]*$/, "") : "";
  var cache = {}, state = null;

  function emit(name, ids) {
    try { doc.dispatchEvent(new CustomEvent(name, { detail: { ids: ids || [] } })); } catch (e) { /* events are optional */ }
  }

  function el(tag, cls, text) {
    var n = doc.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n;
  }

  var cssReady = null;
  function ensureCss() {
    if (cssReady) return cssReady;
    cssReady = new Promise(function (res) {
      var l = doc.createElement("link"); l.rel = "stylesheet"; l.href = base + "explainer.css";
      l.onload = l.onerror = function () { res(); };   // a missing stylesheet must not block the modal
      doc.head.appendChild(l);
    });
    return cssReady;
  }

  function ensurePlayer() {
    var js = window.Explainer ? Promise.resolve() : new Promise(function (res, rej) {
      function loadPlayer() {
        var s = doc.createElement("script"); s.src = base + "explainer.js";
        s.onload = res; s.onerror = function () { rej(new Error("explainer.js")); };
        doc.head.appendChild(s);
      }
      if (window.DanskSpeech) return loadPlayer();
      // optional speech normaliser: wait for it, but never block the player if it is missing
      var ds = doc.createElement("script"); ds.src = base + "../dansk-speech.js";
      ds.onload = ds.onerror = loadPlayer;
      doc.head.appendChild(ds);
    });
    return Promise.all([js, ensureCss()]);
  }

  function loadScene(id) {
    if (cache[id]) return Promise.resolve(cache[id]);
    return new Promise(function (res, rej) {
      var prev = window.EXPLAINER_SCENE; window.EXPLAINER_SCENE = null;
      var s = doc.createElement("script"); s.src = base + "scenes/" + id + ".scene.js";
      s.onload = function () {
        var sc = window.EXPLAINER_SCENE; window.EXPLAINER_SCENE = prev;
        if (!sc) return rej(new Error("scene " + id));
        cache[id] = sc; res(sc);
      };
      s.onerror = function () { window.EXPLAINER_SCENE = prev; rej(new Error("scene " + id)); };
      doc.head.appendChild(s);
    });
  }

  function parseIds(v) {
    return String(v || "").split(",").map(function (x) { return x.trim(); })
      .filter(function (x) { return /^[a-z0-9-]+$/.test(x); });
  }

  function focusables(node) {
    return Array.prototype.filter.call(
      node.querySelectorAll("button:not([tabindex='-1']), [href], [tabindex]:not([tabindex='-1'])"),
      function (n) { return !n.disabled && n.offsetParent !== null; });
  }

  function onKeyDown(e) {
    if (!state) return;
    var player = state.player, tag = e.target && e.target.tagName, onBtn = tag === "BUTTON" || tag === "A";
    if (e.key === "Escape") { e.preventDefault(); close(); e.stopPropagation(); return; }
    if (!state.panel) { if (e.key === "Tab") e.preventDefault(); e.stopPropagation(); return; }   // still loading
    if (state.tabs && e.target && e.target.classList && e.target.classList.contains("xpm-tab") && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var n = state.scenes.length, k = state.index, nk = -1;
      if (e.key === "ArrowRight") nk = (k + 1) % n; else if (e.key === "ArrowLeft") nk = (k + n - 1) % n;
      else if (e.key === "Home") nk = 0; else if (e.key === "End") nk = n - 1;
      if (nk >= 0) { e.preventDefault(); show(nk); state.tabs.children[nk].focus(); e.stopPropagation(); return; }
    }
    if (e.key === "Tab") {
      var f = focusables(state.panel); if (!f.length) { e.preventDefault(); e.stopPropagation(); return; }
      var first = f[0], last = f[f.length - 1], inside = state.panel.contains(doc.activeElement);
      if (e.shiftKey && (doc.activeElement === first || !inside)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (doc.activeElement === last || !inside)) { e.preventDefault(); first.focus(); }
    } else if (player && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (e.key === " " || e.code === "Space") { if (!onBtn) { e.preventDefault(); if (player.playing) player.pause(); else player.play(); } }
      else if (e.key === "ArrowRight") { e.preventDefault(); player.step(); }
      else if (e.key === "r" || e.key === "R") { player.restart(); }
    }
    e.stopPropagation();   // the game underneath must not react to keys while the modal is open
  }

  // keep the active tab inside the horizontally scrolling strip and show which side has more tabs
  function tabFade(strip) {
    strip.classList.toggle("more-l", strip.scrollLeft > 8);
    strip.classList.toggle("more-r", strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 2);
  }
  function revealTab(strip, t) {
    if (!t) return;
    var l = t.offsetLeft, r = l + t.offsetWidth, v = strip.clientWidth;
    if (l < strip.scrollLeft + 12) strip.scrollLeft = Math.max(0, l - 12);
    else if (r > strip.scrollLeft + v - 12) strip.scrollLeft = r - v + 12;
    tabFade(strip);
  }

  function show(i) {
    var s = state; if (!s) return;
    if (s.player && s.player.destroy) s.player.destroy();
    s.stage.innerHTML = ""; s.controls.innerHTML = "";
    s.index = i;
    var sc = s.scenes[i];
    s.title.textContent = sc.title || "Forklaring";
    if (s.tabs) Array.prototype.forEach.call(s.tabs.children, function (b, k) {
      b.setAttribute("aria-selected", k === i ? "true" : "false"); b.tabIndex = k === i ? 0 : -1;
    });
    if (s.tabs) { revealTab(s.tabs, s.tabs.children[i]); }
    s.player = window.Explainer.mount(s.stage, sc, { controls: s.controls, autoplay: true, loop: true });
    s.screen.setAttribute("aria-label", "Skærm: " + (sc.title || "forklaring"));
  }

  function open(ids, trigger) {
    if (state) return;
    ids = Array.isArray(ids) ? ids : parseIds(ids);
    if (!ids.length) return;
    state = { opener: trigger || doc.activeElement, scenes: [], index: 0, player: null, ids: ids, opened: false };
    var mine = state;
    var loads = ids.map(function (id) { return loadScene(id).catch(function () { return null; }); });
    ensurePlayer().then(function () { return Promise.all(loads); }, function () { return null; }).then(function (r) {
      if (state !== mine) return;
      var scenes = (r || []).filter(Boolean);
      if (!r || !scenes.length || !window.Explainer) { mine.scenes = []; build(true); return; }
      mine.scenes = scenes;
      build(false);
    });
  }

  function build(failed) {
    var s = state;
    var overlay = el("div", "xpm"), panel = el("div", "xpm-panel");
    overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true"); overlay.setAttribute("aria-label", "Forklaring");
    var head = el("div", "xpm-head");
    s.title = el("h2", "xpm-title");
    var closeBtn = el("button", "xpm-close", "Luk"); closeBtn.type = "button"; closeBtn.setAttribute("aria-label", "Luk forklaring");
    closeBtn.addEventListener("click", close);
    head.appendChild(s.title); head.appendChild(closeBtn); panel.appendChild(head);
    if (!failed && s.scenes.length > 1) {
      s.tabs = el("div", "xpm-tabs"); s.tabs.setAttribute("role", "tablist"); s.tabs.setAttribute("aria-label", "Vælg forklaring");
      s.tabs.addEventListener("scroll", function () { tabFade(s.tabs); });
      s.scenes.forEach(function (sc, k) {
        var b = el("button", "xpm-tab", sc.title || ("Forklaring " + (k + 1))); b.type = "button"; b.setAttribute("role", "tab");
        b.addEventListener("click", function () { show(k); });
        s.tabs.appendChild(b);
      });
      panel.appendChild(s.tabs);
    }
    if (failed) {
      s.title.textContent = "Forklaring";
      var msg = el("p", "xpm-error", "Forklaringen kunne ikke indlæses. Luk og prøv igen, eller genindlæs siden.");
      msg.setAttribute("role", "alert"); panel.appendChild(msg);
      overlay.appendChild(panel);
      overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) close(); });
      s.overlay = overlay; s.panel = panel; s.closeBtn = closeBtn;
      doc.body.appendChild(overlay); root.classList.add("xpm-open");
      s.opened = true; emit("explainer:open", s.ids);
      closeBtn.focus();
      return;
    }
    var mon = el("div", "xpm-monitor"); mon.setAttribute("role", "group");
    var frame = el("div", "xpm-frame"); frame.style.backgroundImage = 'url("' + base + 'monitor.svg")';
    s.screen = el("div", "xpm-screen"); s.stage = el("div", "xpm-stage");
    s.screen.appendChild(s.stage); mon.appendChild(frame); mon.appendChild(s.screen); panel.appendChild(mon);
    s.controls = el("div", "xpm-controls"); panel.appendChild(s.controls);
    overlay.appendChild(panel);
    overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) close(); });
    s.overlay = overlay; s.panel = panel; s.closeBtn = closeBtn;
    doc.body.appendChild(overlay); root.classList.add("xpm-open");
    s.opened = true; emit("explainer:open", s.ids);
    show(0);
    closeBtn.focus();
  }

  function close() {
    var s = state; if (!s) return; state = null;
    if (s.player && s.player.destroy) s.player.destroy();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (s.overlay && s.overlay.parentNode) s.overlay.parentNode.removeChild(s.overlay);
    root.classList.remove("xpm-open");
    if (s.opener && s.opener.focus) s.opener.focus();
    if (s.opened) emit("explainer:close", s.ids);
  }

  /* ---- entry button ---- */
  /* pixel play triangle (4x7 grid, 2px per pixel): drawn as SVG so it never depends on font coverage of U+25B6 */
  var PLAY_ICO = '<svg class="xpm-ico" viewBox="0 0 4 7" width="8" height="14" aria-hidden="true" focusable="false" shape-rendering="crispEdges" fill="currentColor">' +
    '<rect x="0" y="0" width="1" height="1"/><rect x="0" y="1" width="2" height="1"/><rect x="0" y="2" width="3" height="1"/><rect x="0" y="3" width="4" height="1"/><rect x="0" y="4" width="3" height="1"/><rect x="0" y="5" width="2" height="1"/><rect x="0" y="6" width="1" height="1"/></svg>';
  function addButton() {
    var ids = parseIds(root.getAttribute("data-explainer"));
    if (!ids.length || doc.querySelector(".xpm-btn")) return;
    var btn = el("button", "xpm-btn"); btn.type = "button";
    btn.innerHTML = PLAY_ICO + ' <span class="xpm-btn-t">FORKLARING</span><span class="xpm-btn-s">HJÆLP</span>';
    btn.setAttribute("aria-label", "Hjælp: se en forklaring");
    btn.addEventListener("click", function () { open(ids, btn); });
    var bar = doc.querySelector(".sd-bar");
    if (bar) bar.insertBefore(btn, bar.querySelector(".sd-bar-logo")); else { btn.className += " xpm-btn-float"; doc.body.appendChild(btn); }
  }

  function init() {
    addButton();
    if (!doc.querySelector(".xpm-btn")) win.addEventListener("load", addButton);
  }
  var win = window;
  win.addEventListener("keydown", onKeyDown, true);
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init); else init();

  win.ExplainerModal = { open: open, close: close, isOpen: function () { return !!state; } };
})();
