/* Explainer player - Sjovt Dansk. Vanilla JS, no fetch/CDN/modules, works on file://.
   API:  var p = Explainer.mount(rootEl, scene, opts)  ->  {play, pause, step, restart, onend, destroy, ...}
   opts: {autoplay=true, loop=true, speed=1, tts=false, manual=false, controls=Element}
   Scene contract: ../reference/scene-schema.md
   Recorder hooks: window.__explainerDone (bool, true once a full loop finished),
                   window.__explainerDonePromise (resolves then), opts.manual=true (no timers; call step()). */
(function () {
  "use strict";

  var PAL = { K: "#101010", W: "#FFFFFF", O: "#F94F37", Y: "#E1AD12", C: "#FFC25A", A: "#FD9E4F",
              B: "#8A4A1C", R: "#D7263D", T: "#EDB366", G: "#148A3C", L: "#2B3FD6", P: "#FFE9B0", S: "#8E8E8E" };

  var DEFAULT_T = { sentence: 1700, "try": 1500, highlight: 1000, arrow: 1500, move: 1200, swap: 1200,
                    rule: 3000, cycle: 1500, pause: 600 };

  var ICONS = {
    play:  ["#.......", "###.....", "#####...", "#######.", "#####...", "###.....", "#......."],
    pause: ["###..###", "###..###", "###..###", "###..###", "###..###", "###..###", "###..###"],
    step:  ["#.....##", "###...##", "#####.##", "########", "#####.##", "###...##", "#.....##"],
    restart: ["##.....#", "##...###", "##.#####", "########", "##.#####", "##...###", "##.....#"],
    speaker: ["...#....", "..##..#.", "####...#", "####.#.#", "####...#", "..##..#.", "...#...."],
    check: ["......#", ".....##", "#...##.", "##.##..", ".###...", "..#...."],
    x: ["#...#", ".#.#.", "..#..", ".#.#.", "#...#"]
  };

  function pix(name) {
    var rows = ICONS[name], h = rows.length, w = rows[0].length, out = "", y, x, s;
    for (y = 0; y < h; y++) {
      x = 0;
      while (x < w) {
        if (rows[y].charAt(x) !== "#") { x++; continue; }
        s = x; while (x < w && rows[y].charAt(x) === "#") x++;
        out += '<rect x="' + s + '" y="' + y + '" width="' + (x - s) + '" height="1"/>';
      }
    }
    return '<svg class="xp-ico" viewBox="0 0 ' + w + " " + h + '" aria-hidden="true" focusable="false" ' +
      'shape-rendering="crispEdges" fill="currentColor">' + out + "</svg>";
  }

  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function fgFor(hex) { // readable text colour on a palette colour
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? "#101010" : "#FFFFFF";
  }

  function reducedMotion() {
    try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
    catch (e) { return false; }
  }

  // Dev-only UI (e.g. the "Skal tjekkes" badge on scenes with verify:true) is hidden in production.
  // Enable with ?dev=1 in the page URL, or localStorage "sd-dev" = "1". Storage may be blocked, so never throw.
  function devMode() {
    try { if (/[?&]dev=1(&|#|$)/.test(window.location.search)) return true; } catch (e) { /* ignore */ }
    try { return window.localStorage.getItem("sd-dev") === "1"; } catch (e) { return false; }
  }

  var active = null; // the mounted instance owning keyboard shortcuts

  function mount(root, scene, opts) {
    opts = opts || {};
    scene = scene || window.EXPLAINER_SCENE;
    if (!root || !scene || !scene.steps) throw new Error("Explainer.mount: root and scene.steps required");
    if (active) active.destroy();

    var steps = scene.steps;
    var reduced = reducedMotion();
    var manual = !!opts.manual || reduced;           // no auto-advance
    var motion = !reduced;                           // animations on/off
    var speed = opts.speed > 0 ? opts.speed : 1;
    var loop = opts.loop !== false;
    var autoplay = opts.autoplay !== false && !manual;
    var ttsOn = !!opts.tts;

    // ---------- state
    var items = [];          // current sentence tiles in order: {el, text, slot, answer}
    var idx = 0, playing = false, looping = false, tok = 0;
    var running = null;      // promise of the step currently executing
    var live = [];           // running WAAPI animations
    var cancelWait = null;
    var transient = [];      // elements removed at the start of the next step
    var destroyed = false;
    var doneResolve;

    function newDone() {
      window.__explainerDone = false;
      window.__explainerDonePromise = new Promise(function (r) { doneResolve = r; });
    }
    newDone();

    // ---------- DOM
    root.classList.add("xp");
    root.innerHTML = "";
    var bar = h("div", "xp-bar");
    var barTitle = h("span", "xp-bar-title", scene.title || "");
    var barRight = h("span", "xp-bar-right");
    if (scene.level) barRight.appendChild(h("span", "xp-badge", scene.level));
    if (scene.verify && devMode()) { var vb = h("span", "xp-badge xp-badge-verify", "Skal tjekkes"); barRight.appendChild(vb); }
    var counter = h("span", "xp-count", "");
    barRight.appendChild(counter);
    bar.appendChild(barTitle); bar.appendChild(barRight);

    var stage = h("div", "xp-stage");
    var sentEl = h("div", "xp-sent");
    var svgNS = "http://www.w3.org/2000/svg";
    var arrows = document.createElementNS(svgNS, "svg");
    arrows.setAttribute("class", "xp-arrows");
    arrows.setAttribute("aria-hidden", "true");
    var layer = h("div", "xp-layer");
    var ruleEl = h("div", "xp-rule"); ruleEl.hidden = true;
    var idle = h("div", "xp-idle", "Tryk Afspil eller Næste trin");
    var sr = h("div", "xp-sr"); sr.setAttribute("aria-live", "polite");
    stage.appendChild(sentEl); stage.appendChild(arrows); stage.appendChild(layer);
    stage.appendChild(ruleEl); stage.appendChild(idle); stage.appendChild(sr);
    root.appendChild(bar); root.appendChild(stage);

    var ctrl = opts.controls || null;
    if (!ctrl) { ctrl = h("div", ""); root.appendChild(ctrl); }
    ctrl.classList.add("xp-controls");
    ctrl.innerHTML = "";
    ctrl.setAttribute("role", "group");
    ctrl.setAttribute("aria-label", "Styring af forklaring");
    function mkBtn(cls, icon, label) {
      var b = h("button", "xp-btn " + cls);
      b.type = "button";
      b.innerHTML = pix(icon) + '<span class="xp-lbl">' + label + "</span>";
      b.setAttribute("aria-label", label);
      ctrl.appendChild(b);
      return b;
    }
    var bPlay = mkBtn("xp-play", "play", "Afspil");
    var bStep = mkBtn("xp-step", "step", "Næste trin");
    var bRestart = mkBtn("xp-restart", "restart", "Forfra");
    var bTts = null;
    if (ttsOn) { bTts = mkBtn("xp-tts", "speaker", "Lyd til"); bTts.setAttribute("aria-pressed", "true"); }
    var prog = h("div", "xp-prog"); prog.setAttribute("aria-hidden", "true");
    var i;
    for (i = 0; i < steps.length; i++) prog.appendChild(h("i"));
    ctrl.appendChild(prog);

    function ui() {
      var lbl = playing ? "Pause" : "Afspil";
      bPlay.innerHTML = pix(playing ? "pause" : "play") + '<span class="xp-lbl">' + lbl + "</span>";
      bPlay.setAttribute("aria-label", lbl);
      bPlay.setAttribute("aria-pressed", playing ? "true" : "false");
      counter.textContent = Math.min(idx, steps.length) + "/" + steps.length;
      var dots = prog.children;
      for (var k = 0; k < dots.length; k++) dots[k].className = k < idx ? "on" : "";
    }

    // ---------- motion helpers
    function anim(el, kf, o) {
      if (!motion || !el.animate) return Promise.resolve();
      o = o || {};
      var a = el.animate(kf, { duration: Math.max(1, (o.duration || 300) / speed), easing: o.easing || "steps(8, end)",
                               delay: (o.delay || 0) / speed, fill: o.fill || "both" });
      live.push(a);
      return a.finished.then(function () { drop(a); return a; }, function () { drop(a); return a; });
    }
    function drop(a) { var k = live.indexOf(a); if (k >= 0) live.splice(k, 1); }
    function finishAll() {
      live.slice().forEach(function (a) { try { a.finish(); } catch (e) { /* cancelled */ } });
      if (cancelWait) cancelWait();
    }
    function wait(ms) {
      return new Promise(function (res) {
        var t = setTimeout(done, ms / speed);
        function done() { clearTimeout(t); cancelWait = null; res(); }
        cancelWait = done;
      });
    }
    function sleepAnim(ms) { return motion ? wait(ms) : Promise.resolve(); }

    function flip(mutate, dur) {
      var before = items.map(function (it) { return it.el.getBoundingClientRect(); });
      mutate();
      var ps = [];
      if (motion) items.forEach(function (it, k) {
        var a = before[k], b = it.el.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
        if (dx || dy) ps.push(anim(it.el, [{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "translate(0,0)" }],
                                   { duration: dur || 450, easing: "steps(8, end)" }));
      });
      return Promise.all(ps);
    }

    function rel(r) { var s = stage.getBoundingClientRect(); return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height }; }

    // ---------- stage content
    function clearTransient() { transient.forEach(function (e) { if (e.parentNode) e.parentNode.removeChild(e); }); transient = []; }
    function clearArrows() { while (arrows.firstChild) arrows.removeChild(arrows.firstChild); }
    function clearHighlights() {
      items.forEach(function (it) {
        it.el.classList.remove("is-hl", "is-hl-k");
        it.el.style.removeProperty("--hl"); it.el.style.removeProperty("--hl-fg");
      });
    }

    function say(text) {
      sr.textContent = text;
      if (!ttsOn || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
      try {
        window.speechSynthesis.cancel();
        var DS = window.DanskSpeech, voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
        var u = new window.SpeechSynthesisUtterance(DS ? DS.normalize(text) : text);
        u.lang = "da-DK"; u.rate = 0.9;
        var dv = DS && voices.length ? DS.pickVoice(voices) : null;
        if (dv) u.voice = dv;
        window.speechSynthesis.speak(u);
      } catch (e) { /* tts is optional */ }
    }
    function plain() {
      return items.map(function (it) { return it.slot != null && !it.locked ? "…" : it.text; }).join(" ");
    }

    function buildSentence(def) {
      var words = def.words || [], slots = def.slots || {};
      sentEl.innerHTML = ""; items = [];
      words.forEach(function (w) {
        var m = /^\{(\d+)\}$/.exec(w), el = h("div", "xp-tile"), it = { el: el, text: w, slot: null, locked: false };
        if (m) {
          var sd = slots[m[1]] || {}, ans = sd.answer || "";
          it.slot = m[1]; it.answer = ans; it.text = "";
          el.classList.add("is-gap");
          el.style.minWidth = "calc(" + Math.max(ans.length, sd.none ? 4 : 2) + "ch + 1.3em)";
          el.setAttribute("aria-label", "tomt felt");
        } else el.appendChild(h("span", "xp-t", w));
        sentEl.appendChild(el); items.push(it);
      });
    }

    function showSentence(def, fadeOld) {
      var pre = Promise.resolve();
      idle.hidden = true;
      if (fadeOld && motion && (items.length || !ruleEl.hidden)) pre = anim(stage, [{ opacity: 1 }, { opacity: 0 }], { duration: 160 });
      return pre.then(function () {
        clearArrows(); clearTransient();
        ruleEl.hidden = true; ruleEl.innerHTML = ""; stage.classList.remove("is-rule");
        buildSentence(def);
        say(plain());
        var ps = [anim(stage, [{ opacity: 0 }, { opacity: 1 }], { duration: 1 })];
        items.forEach(function (it, k) {
          ps.push(anim(it.el, [{ transform: "scale(.5)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }],
                       { duration: 280, delay: k * 90, easing: "steps(5, end)" }));
        });
        return Promise.all(ps);
      });
    }

    function makeFlier(text) {
      var f = h("div", "xp-tile xp-flier");
      f.appendChild(h("span", "xp-t", text));
      layer.appendChild(f);
      return f;
    }
    function badge(el, kind) {
      var b = h("span", "xp-mark xp-mark-" + kind);
      b.innerHTML = pix(kind === "ok" ? "check" : "x");
      el.appendChild(b);
      return b;
    }
    function place(f, x, y) { f.style.left = x + "px"; f.style.top = y + "px"; }

    function lock(it, word) {
      return flip(function () {
        it.locked = true; it.text = word;
        it.el.classList.remove("is-gap"); it.el.classList.add("is-ok");
        it.el.style.minWidth = "";
        it.el.removeAttribute("aria-label");
        it.el.insertBefore(h("span", "xp-t", word), it.el.firstChild);
        badge(it.el, "ok");
      }, 300);
    }

    function doTry(s) {
      var it = null;
      items.forEach(function (x) { if (x.slot != null && String(x.slot) === String(s.slot) && !x.locked) it = x; });
      if (!it) return Promise.resolve();
      var ok = !!s.ok;
      var word = s.word || "";
      var f = makeFlier(word), sr0 = rel(stage.getBoundingClientRect()), g = rel(it.el.getBoundingClientRect());
      var fw = f.offsetWidth, fh = f.offsetHeight;
      var tx = g.x + g.w / 2 - fw / 2, ty = g.y + g.h / 2 - fh / 2;
      var sx = sr0.w / 2 - fw / 2, sy = sr0.h - fh * 1.3;
      place(f, tx, ty);
      if (!motion) {                                   // reduced motion: show end state directly
        if (ok) { f.parentNode.removeChild(f); return lock(it, word).then(function () { say(plain()); }); }
        f.classList.add("is-bad"); badge(f, "bad"); transient.push(f);
        say("Forkert: " + word);
        return Promise.resolve();
      }
      var dx = sx - tx, dy = sy - ty;
      return anim(f, [{ transform: "translate(" + dx + "px," + dy + "px) scale(.6)", opacity: 0 },
                      { transform: "translate(" + dx + "px," + dy + "px) scale(1)", opacity: 1, offset: .2 },
                      { transform: "translate(0,0) scale(1)", opacity: 1 }],
                  { duration: 650, easing: "steps(12, end)" }).then(function () {
        if (ok) {
          if (f.parentNode) f.parentNode.removeChild(f);
          return lock(it, word).then(function () {
            say(plain());
            return anim(it.el, [{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }], { duration: 260, easing: "steps(4, end)" });
          });
        }
        f.classList.add("is-bad"); badge(f, "bad"); say("Forkert: " + word);
        return anim(f, [{ transform: "translateX(0)" }, { transform: "translateX(-7px)" }, { transform: "translateX(7px)" },
                        { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }],
                    { duration: 450, easing: "linear" })
          .then(function () { return sleepAnim(250); })
          .then(function () {
            return anim(f, [{ transform: "translate(0,0)", opacity: 1 }, { transform: "translate(" + dx + "px," + dy + "px)", opacity: 0 }],
                        { duration: 450, easing: "steps(10, end)" });
          }).then(function () { if (f.parentNode) f.parentNode.removeChild(f); });
      });
    }

    function doHighlight(s) {
      var list = s.words || (s.word != null ? [s.word] : []);
      var col = PAL[s.color || "Y"] || PAL.Y, ps = [];
      list.forEach(function (n) {
        var it = items[n]; if (!it) return;
        if ((s.color || "") === "K") it.el.classList.add("is-hl-k");
        else { it.el.classList.add("is-hl"); it.el.style.setProperty("--hl", col); it.el.style.setProperty("--hl-fg", fgFor(col)); }
        ps.push(anim(it.el, [{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(1)" },
                             { transform: "scale(1.14)" }, { transform: "scale(1)" }], { duration: 800, easing: "steps(6, end)" }));
      });
      return Promise.all(ps);
    }

    function doArrow(s) {
      var a = items[s.from], b = items[s.to];
      if (!a || !b) return Promise.resolve();
      var ra = rel(a.el.getBoundingClientRect()), rb = rel(b.el.getBoundingClientRect());
      var ax = ra.x + ra.w / 2, bx = rb.x + rb.w / 2, top = Math.min(ra.y, rb.y), by = rb.y;
      var lift = Math.max(top - 14, 6), r = 5;
      var d = "M" + ax + " " + ra.y + " V" + lift + " H" + bx + " V" + (by - 6);
      var g = document.createElementNS(svgNS, "g"); g.setAttribute("class", "xp-arrow");
      var p = document.createElementNS(svgNS, "path");
      p.setAttribute("d", d); p.setAttribute("pathLength", "1"); p.setAttribute("class", "xp-arrow-line");
      var head = document.createElementNS(svgNS, "path");
      head.setAttribute("d", "M" + (bx - r) + " " + (by - 6 - r) + " H" + (bx + r) + " L" + bx + " " + (by - 1) + " Z");
      head.setAttribute("class", "xp-arrow-head");
      g.appendChild(p); g.appendChild(head);
      if (s.label) {
        var t = document.createElementNS(svgNS, "text");
        t.textContent = s.label; t.setAttribute("class", "xp-arrow-label");
        t.setAttribute("x", (ax + bx) / 2); t.setAttribute("y", lift - 5); t.setAttribute("text-anchor", "middle");
        g.appendChild(t);
      }
      arrows.appendChild(g);
      if (s.label) say(s.label);
      return Promise.all([anim(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 650, easing: "steps(10, end)" }),
                          anim(head, [{ opacity: 0 }, { opacity: 0, offset: .7 }, { opacity: 1 }], { duration: 650 })]);
    }

    function doMove(s) {
      var from = s.word, to = s.to, it = items[from];
      if (!it || to < 0 || to >= items.length) return Promise.resolve();
      it.el.classList.add("is-moving");
      return flip(function () {
        items.splice(from, 1); items.splice(to, 0, it);
        items.forEach(function (x) { sentEl.appendChild(x.el); });
      }, 700).then(function () { it.el.classList.remove("is-moving"); say(plain()); });
    }

    function doSwap(s) {
      var a = s.words && s.words[0], b = s.words && s.words[1];
      if (!items[a] || !items[b]) return Promise.resolve();
      items[a].el.classList.add("is-moving"); items[b].el.classList.add("is-moving");
      return flip(function () {
        var t = items[a]; items[a] = items[b]; items[b] = t;
        items.forEach(function (x) { sentEl.appendChild(x.el); });
      }, 700).then(function () {
        items.forEach(function (x) { x.el.classList.remove("is-moving"); });
        say(plain());
      });
    }

    function doRule(s) {
      var pre = motion && items.length ? anim(stage, [{ opacity: 1 }, { opacity: 0 }], { duration: 160 }) : Promise.resolve();
      return pre.then(function () {
        idle.hidden = true;
        clearArrows(); clearTransient();
        sentEl.innerHTML = ""; items = [];
        stage.classList.add("is-rule");
        ruleEl.hidden = false; ruleEl.innerHTML = "";
        ruleEl.appendChild(h("div", "xp-rule-head", "Regel"));
        var lines = (s.lines || []).slice(0, 3), ps = [anim(stage, [{ opacity: 0 }, { opacity: 1 }], { duration: 1 })];
        lines.forEach(function (ln, k) {
          var l = h("div", "xp-rule-line", ln); ruleEl.appendChild(l);
          ps.push(anim(l, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
                       { duration: 300, delay: 250 + k * 400, easing: "steps(5, end)" }));
        });
        say(lines.join(". "));
        return Promise.all(ps);
      });
    }

    function doStep(s) {
      clearTransient();
      if (s.type !== "highlight" && s.type !== "pause") clearArrows();
      if (s.type !== "highlight" && s.type !== "arrow" && s.type !== "try" && s.type !== "pause") clearHighlights();
      switch (s.type) {
        case "sentence": return showSentence(s, items.length > 0 || !ruleEl.hidden);
        case "cycle": return showSentence(s.sentence || s, true);
        case "try": return doTry(s);
        case "highlight": clearHighlights(); return doHighlight(s);
        case "arrow": return doArrow(s);
        case "move": return doMove(s);
        case "swap": return doSwap(s);
        case "rule": return doRule(s);
        default: return Promise.resolve();            // pause + unknown types: just wait
      }
    }

    function resetStage() {
      finishAll();
      clearTransient(); clearArrows();
      sentEl.innerHTML = ""; items = [];
      ruleEl.hidden = true; ruleEl.innerHTML = ""; stage.classList.remove("is-rule");
      idle.hidden = false; sr.textContent = "";
      idx = 0; ui();
    }

    function completed() {
      window.__explainerDone = true;
      if (doneResolve) doneResolve(true);
      ui();
      if (typeof api.onend === "function") { try { api.onend(); } catch (e) { /* user hook */ } }
    }

    // run the step at idx; hold=true waits out the step duration (auto-play)
    function exec(hold) {
      var s = steps[idx++], t = s.t != null ? s.t : DEFAULT_T[s.type] || 800;
      ui();
      var ps = [doStep(s)];
      if (hold) ps.push(wait(t));
      running = Promise.all(ps).then(function () {
        running = null;
        if (idx >= steps.length) completed();
      });
      return running;
    }

    function runLoop(myTok) {
      looping = true;
      function next() {
        if (destroyed || tok !== myTok || !playing) { looping = false; return Promise.resolve(); }
        if (idx >= steps.length) {
          if (!loop) { playing = false; looping = false; ui(); return Promise.resolve(); }
          return wait(1400).then(function () {
            if (destroyed || tok !== myTok || !playing) { looping = false; return; }
            resetStage(); return next();
          });
        }
        return exec(true).then(next);
      }
      return (running || Promise.resolve()).then(next);
    }

    // ---------- API
    var api = {
      onend: null,
      steps: steps.length,
      get index() { return idx; },
      get playing() { return playing; },
      play: function () {
        if (destroyed) return;
        if (manual) { api.step(); return; }
        if (playing) return;
        if (idx >= steps.length && !loop) resetStage();
        playing = true; tok++; ui();
        runLoop(tok);
      },
      pause: function () {
        playing = false; tok++; if (cancelWait) cancelWait(); ui();
      },
      step: function () {
        if (destroyed) return Promise.resolve();
        api.pause();
        if (running) finishAll();
        return (running || Promise.resolve()).then(function () {
          if (idx >= steps.length) { resetStage(); newDone(); }
          return exec(false);
        });
      },
      restart: function () {
        var wasPlaying = playing;
        api.pause();
        resetStage(); newDone();
        if (wasPlaying || (autoplay && !manual)) { playing = true; tok++; ui(); runLoop(tok); }
        return Promise.resolve();
      },
      destroy: function () {
        destroyed = true; playing = false; tok++; finishAll();
        document.removeEventListener("keydown", onKey);
        try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
        if (active === api) active = null;
      }
    };

    bPlay.addEventListener("click", function () { if (playing) api.pause(); else api.play(); });
    bStep.addEventListener("click", function () { api.step(); });
    bRestart.addEventListener("click", function () { api.restart(); });
    if (bTts) bTts.addEventListener("click", function () {
      ttsOn = !ttsOn;
      bTts.setAttribute("aria-pressed", ttsOn ? "true" : "false");
      bTts.querySelector(".xp-lbl").textContent = ttsOn ? "Lyd til" : "Lyd fra";
      bTts.setAttribute("aria-label", ttsOn ? "Lyd til" : "Lyd fra");
      if (!ttsOn && window.speechSynthesis) window.speechSynthesis.cancel();
    });

    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var tag = e.target && e.target.tagName, onBtn = tag === "BUTTON" || tag === "A";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === " " || e.code === "Space") {
        if (onBtn) return;                              // the focused button handles its own click
        e.preventDefault(); if (playing) api.pause(); else api.play();
      } else if (e.key === "ArrowRight") { e.preventDefault(); api.step(); }
      else if (e.key === "r" || e.key === "R") { api.restart(); }
    }
    document.addEventListener("keydown", onKey);

    active = api;
    ui();
    if (autoplay) { playing = true; tok++; ui(); runLoop(tok); }
    return api;
  }

  window.Explainer = { mount: mount };
})();
