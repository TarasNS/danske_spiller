/*
  DanskCore — shared library for the danske_spiller Danish grammar games.
  Exposes window.DanskCore. No frameworks, no build step, works via file://.

  This file is built up incrementally across build tasks. Each task appends
  an IIFE that extends the same window.DanskCore object — never redefine it.

  Module 1: store, tts, srs, diff.
  Module 2: level, ui (darkMode, motion, sound, ttsButton, focusTrap, announce), quiz.
*/
(function () {
  'use strict';

  var DanskCore = window.DanskCore || (window.DanskCore = {});

  // ---------------------------------------------------------------------
  // DanskCore.store — localStorage wrapper with error handling
  // ---------------------------------------------------------------------

  function storeGet(key) {
    try {
      var raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw);
      } catch (parseErr) {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  function storeSet(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Swallow QuotaExceededError and any other storage failure (private
      // browsing, disabled storage, etc). Progress loss is acceptable;
      // a thrown error breaking the game is not.
    }
  }

  function storeRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      // ignore
    }
  }

  DanskCore.store = {
    get: storeGet,
    set: storeSet,
    remove: storeRemove,
    namespace: function (prefix) {
      var p = prefix + ':';
      return {
        get: function (key) { return storeGet(p + key); },
        set: function (key, value) { storeSet(p + key, value); },
        remove: function (key) { storeRemove(p + key); }
      };
    }
  };

  // ---------------------------------------------------------------------
  // DanskCore.tts — Danish speech synthesis with silent fallback
  // ---------------------------------------------------------------------

  var lastSpokenText = null;
  var lastSpokenOptions = null;
  var cachedVoice = null;
  var voiceListPrimed = false;

  function ttsAvailable() {
    return typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined';
  }

  function findVoice() {
    if (!ttsAvailable()) return null;
    if (cachedVoice) return cachedVoice;
    var voices = [];
    try {
      voices = window.speechSynthesis.getVoices() || [];
    } catch (err) {
      return null;
    }
    if (!voices.length) return null;
    var speech = window.DanskSpeech;
    if (speech && speech.pickVoice) {
      // Ranked: neural/"Natural" da-DK voices before legacy SAPI ones.
      cachedVoice = speech.pickVoice(voices);
      return cachedVoice;
    }
    var exact = null;
    var partial = null;
    for (var i = 0; i < voices.length; i++) {
      var v = voices[i];
      var lang = (v.lang || '').toLowerCase();
      if (lang === 'da-dk' || lang === 'da_dk') {
        exact = v;
        break;
      }
      if (!partial && lang.indexOf('da') === 0) {
        partial = v;
      }
    }
    cachedVoice = exact || partial || null;
    return cachedVoice;
  }

  if (ttsAvailable()) {
    // Voice lists load asynchronously in most browsers; prime the cache
    // once they're ready so the first speak() call doesn't miss the
    // Danish voice.
    try {
      window.speechSynthesis.addEventListener('voiceschanged', function () {
        cachedVoice = null;
        findVoice();
        voiceListPrimed = true;
      });
    } catch (err) {
      // ignore — some environments (older Safari) lack addEventListener here
    }
  }

  function ttsSpeak(text, options) {
    options = options || {};
    return new Promise(function (resolve) {
      if (!ttsAvailable() || document.hidden || !text) {
        resolve();
        return;
      }
      try {
        var voice = findVoice();
        var listLoaded = (window.speechSynthesis.getVoices() || []).length > 0;
        // Voice list loaded but no Danish voice: a foreign voice reading Danish is worse than silence.
        if (listLoaded && !voice && !options.allowForeignVoice) { resolve(); return; }
        window.speechSynthesis.cancel();
        var spoken = window.DanskSpeech && !options.raw ? window.DanskSpeech.normalize(text, options) : text;
        var utterance = new window.SpeechSynthesisUtterance(spoken);
        utterance.lang = 'da-DK';
        if (voice) utterance.voice = voice;
        utterance.rate = typeof options.rate === 'number' ? options.rate : 1;
        utterance.pitch = typeof options.pitch === 'number' ? options.pitch : 1;
        var finished = false;
        function finish() {
          if (finished) return;
          finished = true;
          if (typeof options.onEnd === 'function') {
            try { options.onEnd(); } catch (cbErr) { /* ignore consumer errors */ }
          }
          resolve();
        }
        utterance.onend = finish;
        utterance.onerror = finish;
        lastSpokenText = text;
        lastSpokenOptions = options;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        resolve();
      }
    });
  }

  DanskCore.tts = {
    speak: ttsSpeak,
    replay: function () {
      if (!lastSpokenText) return Promise.resolve();
      return ttsSpeak(lastSpokenText, lastSpokenOptions || {});
    },
    isAvailable: ttsAvailable,
    findVoice: findVoice,
    // true when a Danish voice is usable (or the voice list has not loaded yet); false = show a notice
    hasDanishVoice: function () {
      if (!ttsAvailable()) return false;
      var n = (window.speechSynthesis.getVoices() || []).length;
      return n === 0 || !!findVoice();
    }
  };

  // ---------------------------------------------------------------------
  // DanskCore.srs — Leitner 5-box spaced repetition
  // ---------------------------------------------------------------------

  var SRS_BOX_INTERVAL_MS = [
    0,                    // box 1 — due immediately
    1 * 24 * 60 * 60000,  // box 2 — 1 day
    3 * 24 * 60 * 60000,  // box 3 — 3 days
    7 * 24 * 60 * 60000,  // box 4 — 7 days
    14 * 24 * 60 * 60000  // box 5 — 14 days
  ];
  var SRS_MAX_BOX = 5;
  var SRS_MIN_BOX = 1;

  function srsStorageKey(namespace) {
    return 'srs:' + namespace;
  }

  function srsLoad(namespace) {
    var raw = storeGet(srsStorageKey(namespace));
    var state = (raw && typeof raw === 'object') ? raw : {};
    if (!state.items || typeof state.items !== 'object') state.items = {};
    if (!state.patterns || typeof state.patterns !== 'object') state.patterns = {};
    state.namespace = namespace;
    return state;
  }

  function srsPersist(state) {
    if (!state || !state.namespace) return;
    storeSet(srsStorageKey(state.namespace), {
      items: state.items,
      patterns: state.patterns
    });
  }

  function srsRecord(state, itemId, correct) {
    if (!state || !itemId) return state;
    var entry = state.items[itemId];
    if (!entry) {
      entry = { box: SRS_MIN_BOX, dueAt: 0, lastSeen: 0 };
      state.items[itemId] = entry;
    }
    entry.box = correct
      ? Math.min(SRS_MAX_BOX, entry.box + 1)
      : SRS_MIN_BOX;
    var now = Date.now();
    entry.lastSeen = now;
    entry.dueAt = now + SRS_BOX_INTERVAL_MS[entry.box - 1];
    srsPersist(state);
    return state;
  }

  function srsIsDue(state, itemId) {
    if (!state || !itemId) return true;
    var entry = state.items[itemId];
    if (!entry) return true;
    return Date.now() >= entry.dueAt;
  }

  function srsNextItems(state, pool, n) {
    if (!state || !Array.isArray(pool) || !n) return [];
    var due = [];
    for (var i = 0; i < pool.length && due.length < n; i++) {
      var item = pool[i];
      if (item && srsIsDue(state, item.id)) {
        due.push(item);
      }
    }
    return due;
  }

  function srsPattern(state, patternKey, correct) {
    if (!state || !patternKey) return state;
    var entry = state.patterns[patternKey];
    if (!entry) {
      entry = { correct: 0, incorrect: 0 };
      state.patterns[patternKey] = entry;
    }
    if (correct) entry.correct += 1;
    else entry.incorrect += 1;
    srsPersist(state);
    return state;
  }

  DanskCore.srs = {
    load: srsLoad,
    record: srsRecord,
    isDue: srsIsDue,
    nextItems: srsNextItems,
    pattern: srsPattern
  };

  // ---------------------------------------------------------------------
  // DanskCore.diff — answer normalization and token diffing
  // ---------------------------------------------------------------------

  function diffNormalize(str) {
    if (typeof str !== 'string') return '';
    return str
      .toLowerCase()
      .replace(/[‘’`´]/g, "'") // typographic apostrophes/backticks -> straight
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[.!?]+$/g, '')
      .trim();
  }

  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    var prev = new Array(n + 1);
    var curr = new Array(n + 1);
    for (var j = 0; j <= n; j++) prev[j] = j;
    for (var i = 1; i <= m; i++) {
      curr[0] = i;
      for (j = 1; j <= n; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        curr[j] = Math.min(
          prev[j] + 1,
          curr[j - 1] + 1,
          prev[j - 1] + cost
        );
      }
      var tmp = prev; prev = curr; curr = tmp;
    }
    return prev[n];
  }

  function diffCheck(answer, acceptedAnswers) {
    var list = Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers];
    var normalizedAnswer = diffNormalize(answer);
    var closest = list.length ? list[0] : '';
    var bestDistance = Infinity;
    var correct = false;
    for (var i = 0; i < list.length; i++) {
      var candidate = list[i];
      var normalizedCandidate = diffNormalize(candidate);
      if (normalizedCandidate === normalizedAnswer) {
        correct = true;
        closest = candidate;
        bestDistance = 0;
        break;
      }
      var distance = levenshtein(normalizedAnswer, normalizedCandidate);
      if (distance < bestDistance) {
        bestDistance = distance;
        closest = candidate;
      }
    }
    return { correct: correct, closest: closest };
  }

  function tokenize(str) {
    if (typeof str !== 'string' || !str.length) return [];
    return str.split(/\s+/).filter(function (t) { return t.length > 0; });
  }

  function tokenDiff(a, b) {
    var tokensA = tokenize(a);
    var tokensB = tokenize(b);
    var m = tokensA.length, n = tokensB.length;
    var lcs = [];
    for (var i = 0; i <= m; i++) {
      lcs.push(new Array(n + 1).fill(0));
    }
    for (i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        if (tokensA[i - 1] === tokensB[j - 1]) {
          lcs[i][j] = lcs[i - 1][j - 1] + 1;
        } else {
          lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
        }
      }
    }
    var result = [];
    i = m; var jj = n;
    while (i > 0 || jj > 0) {
      if (i > 0 && jj > 0 && tokensA[i - 1] === tokensB[jj - 1]) {
        result.unshift({ text: tokensA[i - 1], type: 'equal' });
        i--; jj--;
      } else if (jj > 0 && (i === 0 || lcs[i][jj - 1] >= lcs[i - 1][jj])) {
        result.unshift({ text: tokensB[jj - 1], type: 'add' });
        jj--;
      } else if (i > 0) {
        result.unshift({ text: tokensA[i - 1], type: 'del' });
        i--;
      }
    }
    return result;
  }

  DanskCore.diff = {
    normalize: diffNormalize,
    check: diffCheck,
    tokenDiff: tokenDiff
  };

})();

/*
  Module 2: level, ui, quiz.
*/
(function () {
  'use strict';

  var DanskCore = window.DanskCore || (window.DanskCore = {});

  // ---------------------------------------------------------------------
  // DanskCore.level — CEFR level filtering
  // ---------------------------------------------------------------------

  var LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

  function levelFilter(items, selectedLevels) {
    if (!Array.isArray(items)) return [];
    if (!Array.isArray(selectedLevels) || !selectedLevels.length) return items.slice();
    var allowed = {};
    for (var i = 0; i < selectedLevels.length; i++) allowed[selectedLevels[i]] = true;
    return items.filter(function (item) { return !!(item && allowed[item.level]); });
  }

  function levelBadge(level) {
    var lvl = (level || '').toLowerCase();
    return 'dc-level-badge dc-level-' + lvl;
  }

  DanskCore.level = {
    LEVELS: LEVELS,
    filter: levelFilter,
    badge: levelBadge
  };

  // ---------------------------------------------------------------------
  // DanskCore.ui — dark mode, motion, sound engine, a11y helpers
  // ---------------------------------------------------------------------

  // Base structural styles for the quiz renderers below. Colors are CSS
  // custom properties so each game's inline stylesheet can theme them to
  // its own palette: --dc-fg, --dc-btn-bg, --dc-border, --dc-accent,
  // --dc-accent-fg, --dc-input-bg, --dc-correct, --dc-correct-bg,
  // --dc-wrong, --dc-wrong-bg.
  var BASE_STYLE_ID = 'dc-base-styles';

  function injectBaseStyles() {
    if (document.getElementById(BASE_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = BASE_STYLE_ID;
    style.textContent = [
      '.dc-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}',
      '.dc-tts-button{min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;font-size:1.1em;background:var(--dc-btn-bg,transparent);color:var(--dc-fg,inherit);border:1px solid var(--dc-border,currentColor);border-radius:8px;cursor:pointer;}',
      '.dc-tts-button:focus-visible{outline:2px solid var(--dc-accent,#4E82A6);outline-offset:2px;}',
      '.dc-quiz-prompt{display:flex;align-items:center;gap:.5em;flex-wrap:wrap;}',
      '.dc-quiz-options{display:flex;flex-direction:column;gap:.5em;margin-top:.75em;}',
      '.dc-quiz-option{min-height:44px;min-width:44px;text-align:left;padding:.6em .9em;background:var(--dc-btn-bg,transparent);color:var(--dc-fg,inherit);border:1px solid var(--dc-border,currentColor);border-radius:8px;cursor:pointer;font:inherit;}',
      '.dc-quiz-option:focus-visible{outline:2px solid var(--dc-accent,#4E82A6);outline-offset:2px;}',
      '.dc-quiz-option[aria-disabled="true"]{cursor:default;}',
      '.dc-quiz-option.dc-correct{border-color:var(--dc-correct,#3a8f4d);background:var(--dc-correct-bg,rgba(58,143,77,.15));}',
      '.dc-quiz-option.dc-wrong{border-color:var(--dc-wrong,#b3413c);background:var(--dc-wrong-bg,rgba(179,65,60,.15));}',
      '.dc-quiz-freetext{display:flex;gap:.5em;margin-top:.75em;flex-wrap:wrap;}',
      '.dc-quiz-input{flex:1 1 10em;min-height:44px;padding:.5em .7em;border:1px solid var(--dc-border,currentColor);border-radius:8px;font:inherit;background:var(--dc-input-bg,transparent);color:var(--dc-fg,inherit);}',
      '.dc-quiz-submit{min-height:44px;min-width:44px;padding:.5em 1em;border:1px solid var(--dc-border,currentColor);border-radius:8px;background:var(--dc-accent,#4E82A6);color:var(--dc-accent-fg,#fff);cursor:pointer;font:inherit;}',
      '.dc-quiz-note{margin-top:.5em;font-size:.9em;}',
      '.dc-tiles-bank,.dc-tiles-slots{display:flex;flex-wrap:wrap;gap:.5em;}',
      '.dc-tiles-slots{margin-top:.75em;min-height:44px;padding:.5em;border:1px dashed var(--dc-border,currentColor);border-radius:8px;}',
      '.dc-tile{min-height:44px;min-width:44px;padding:.5em .8em;border:1px solid var(--dc-border,currentColor);border-radius:8px;background:var(--dc-btn-bg,transparent);color:var(--dc-fg,inherit);cursor:pointer;font:inherit;}',
      '.dc-tile:focus-visible{outline:2px solid var(--dc-accent,#4E82A6);outline-offset:2px;}',
      '.dc-tile.dc-tile-placed{opacity:.35;}',
      '.dc-tiles-slot-item{min-height:44px;min-width:44px;padding:.5em .8em;border:1px solid var(--dc-border,currentColor);border-radius:8px;background:var(--dc-btn-bg,transparent);color:var(--dc-fg,inherit);cursor:pointer;font:inherit;}',
      '.dc-tiles-slot-empty{min-height:44px;min-width:44px;display:inline-block;}',
      '.dc-summary{display:flex;flex-direction:column;gap:.75em;}',
      '.dc-summary-stats{display:flex;gap:1.5em;flex-wrap:wrap;}',
      '.dc-summary-weak{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.35em;}',
      '.dc-summary-actions{display:flex;gap:.5em;flex-wrap:wrap;}',
      '.dc-summary-actions button{min-height:44px;padding:.6em 1.2em;border:1px solid var(--dc-border,currentColor);border-radius:8px;background:var(--dc-accent,#4E82A6);color:var(--dc-accent-fg,#fff);cursor:pointer;font:inherit;}'
    ].join('');
    document.head.appendChild(style);
  }

  // -- darkMode ------------------------------------------------------------

  // Single source of truth is the shared bar (shared/sjovt.js, key `sd:theme`).
  // These helpers delegate to window.Sjovt.theme when present and otherwise use
  // the same key, so the portal, the bar and every game always agree.
  var THEME_KEY = 'sd:theme';

  function darkModeCurrent() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    try {
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    } catch (err) {
      return 'light';
    }
  }

  function darkModeInit() {
    var stored = null;
    try { stored = window.localStorage.getItem(THEME_KEY); } catch (err) { stored = null; }
    if (stored === 'dark' || stored === 'light') document.documentElement.setAttribute('data-theme', stored);
    return darkModeCurrent();
  }

  function darkModeToggle() {
    if (window.Sjovt && window.Sjovt.theme) return window.Sjovt.theme.toggle();
    var next = darkModeCurrent() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { window.localStorage.setItem(THEME_KEY, next); } catch (err) { /* ignore */ }
    return next;
  }

  // -- motion ----------------------------------------------------------

  function motionIsReduced() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (err) {
      return false;
    }
  }

  // -- sound -------------------------------------------------------------

  var SOUND_ENABLED_KEY = 'dc:sound-enabled';
  var audioCtx = null;
  var soundEnabled = true;
  var soundEnabledLoaded = false;

  // The stored value (written by the shared bar or by toggle) always wins, so
  // there is no stale in-memory copy; `soundEnabled` is only the fallback.
  function soundLoadEnabled() {
    var stored = DanskCore.store.get(SOUND_ENABLED_KEY);
    if (stored === true || stored === false) soundEnabled = stored;
    soundEnabledLoaded = true;
    return soundEnabled;
  }

  function soundInit(enabled) {
    var stored = DanskCore.store.get(SOUND_ENABLED_KEY);
    soundEnabled = (stored === true || stored === false) ? stored : (enabled !== false);
    soundEnabledLoaded = true;
    return soundEnabled;
  }

  function soundToggle() {
    var next = !soundLoadEnabled();
    soundEnabled = next;
    if (window.Sjovt && window.Sjovt.sound) return window.Sjovt.sound.set(next);
    DanskCore.store.set(SOUND_ENABLED_KEY, next);
    return next;
  }

  function soundIsEnabled() {
    return soundLoadEnabled();
  }

  function playCtx() {
    if (audioCtx) return audioCtx;
    try {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    } catch (err) {
      audioCtx = null;
    }
    return audioCtx;
  }

  function playNoiseStep(ctx, dest, step, startTime) {
    var duration = typeof step.duration === 'number' ? step.duration : 0.1;
    var bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    var source = ctx.createBufferSource();
    source.buffer = buffer;
    var gainNode = ctx.createGain();
    gainNode.gain.value = typeof step.gain === 'number' ? step.gain : 0.05;
    source.connect(gainNode);
    gainNode.connect(dest);
    source.start(startTime);
    source.stop(startTime + duration);
  }

  function playToneStep(ctx, dest, step, startTime) {
    var duration = typeof step.duration === 'number' ? step.duration : 0.1;
    var osc = ctx.createOscillator();
    osc.type = step.type || 'sine';
    osc.frequency.value = typeof step.frequency === 'number' ? step.frequency : 440;
    var gainNode = ctx.createGain();
    var gain = typeof step.gain === 'number' ? step.gain : 0.05;
    gainNode.gain.setValueAtTime(gain, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gainNode);
    gainNode.connect(dest);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  function soundSequence(steps) {
    if (!Array.isArray(steps) || !steps.length) return;
    if (!soundIsEnabled()) return;
    if (document.hidden) return;
    var ctx = playCtx();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume();
      var dest = ctx.destination;
      var now = ctx.currentTime;
      for (var i = 0; i < steps.length; i++) {
        var step = steps[i];
        if (!step) continue;
        var startTime = now + (typeof step.delay === 'number' ? step.delay : 0);
        if (step.type === 'noise') {
          playNoiseStep(ctx, dest, step, startTime);
        } else {
          playToneStep(ctx, dest, step, startTime);
        }
      }
    } catch (err) {
      // sound is non-critical — never let playback errors break the game
    }
  }

  // -- ttsButton / focusTrap / announce -----------------------------------

  // ttsButton(text, container[, label]) - the one "listen" button. Default label "Lyt" (Danish); pass e.g. "Lyt til sætningen" to override.
  // Look comes from shared/tts-button.css (pixel speaker, 48x48); without that file the base styles keep it a >=44px button.
  function ttsButton(text, container, label) {
    if (!container) return null;
    injectBaseStyles();
    var baseLabel = (typeof label === 'string' && label) ? label : 'Lyt';
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'dc-tts-button';
    button.setAttribute('aria-label', baseLabel);
    button.title = baseLabel;
    button.innerHTML = '<span aria-hidden="true">&#128266;</span>';
    // Voice lists load asynchronously: re-check when they arrive. No Danish voice => say so instead of silence.
    function syncVoiceState() {
      var ok = DanskCore.tts.hasDanishVoice();
      button.setAttribute('aria-label', ok ? baseLabel : baseLabel + ' (ingen dansk stemme fundet på denne enhed)');
      button.title = ok ? baseLabel : 'Ingen dansk stemme fundet på denne enhed';
      button.style.opacity = ok ? '' : '0.5';
    }
    syncVoiceState();
    try { window.speechSynthesis.addEventListener('voiceschanged', syncVoiceState); } catch (err) { /* optional */ }
    button.addEventListener('click', function () {
      DanskCore.tts.speak(text);
    });
    container.appendChild(button);
    return button;
  }

  function focusTrap(element) {
    if (!element) return function () {};
    var focusableSelector = 'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';
    function getFocusable() {
      return Array.prototype.slice.call(element.querySelectorAll(focusableSelector));
    }
    function handleKeydown(e) {
      if (e.key !== 'Tab') return;
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    element.addEventListener('keydown', handleKeydown);
    var initialFocusable = getFocusable();
    if (initialFocusable.length) initialFocusable[0].focus();
    return function () {
      element.removeEventListener('keydown', handleKeydown);
    };
  }

  var announceRegion = null;

  function getAnnounceRegion() {
    if (announceRegion && document.body.contains(announceRegion)) return announceRegion;
    announceRegion = document.createElement('div');
    announceRegion.setAttribute('aria-live', 'polite');
    announceRegion.setAttribute('role', 'status');
    announceRegion.className = 'dc-sr-only';
    document.body.appendChild(announceRegion);
    return announceRegion;
  }

  function announce(text) {
    if (!document.body) return;
    injectBaseStyles();
    var region = getAnnounceRegion();
    region.textContent = '';
    window.setTimeout(function () {
      region.textContent = text || '';
    }, 30);
  }

  DanskCore.ui = {
    darkMode: {
      init: darkModeInit,
      toggle: darkModeToggle
    },
    motion: {
      isReduced: motionIsReduced
    },
    sound: {
      init: soundInit,
      toggle: soundToggle,
      isEnabled: soundIsEnabled,
      sequence: soundSequence,
      playCtx: playCtx
    },
    ttsButton: ttsButton,
    focusTrap: focusTrap,
    announce: announce
  };

  // ---------------------------------------------------------------------
  // DanskCore.quiz — mc, freeText, tiles, summary renderers
  // ---------------------------------------------------------------------

  function quizMcRender(item, container, onAnswer) {
    if (!container || !item) return;
    injectBaseStyles();
    container.innerHTML = '';

    var promptEl = document.createElement('div');
    promptEl.className = 'dc-quiz-prompt';
    var promptText = document.createElement('span');
    promptText.className = 'dc-quiz-prompt-text';
    promptText.textContent = item.prompt || '';
    promptEl.appendChild(promptText);
    ttsButton(item.prompt || '', promptEl);
    container.appendChild(promptEl);

    var optionsEl = document.createElement('div');
    optionsEl.className = 'dc-quiz-options';
    optionsEl.setAttribute('role', 'group');
    container.appendChild(optionsEl);

    var answered = false;
    var buttons = [];
    var options = Array.isArray(item.options) ? item.options : [];

    function cleanup() {
      document.removeEventListener('keydown', handleKeydown);
    }

    function handleKeydown(e) {
      if (answered) return;
      var num = parseInt(e.key, 10);
      if (num >= 1 && num <= buttons.length) {
        e.preventDefault();
        buttons[num - 1].click();
      }
    }

    options.forEach(function (option, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dc-quiz-option';
      btn.textContent = (index + 1) + '. ' + option;
      btn.addEventListener('click', function () {
        if (answered) return;
        answered = true;
        var correct = option === item.correct;
        buttons.forEach(function (b, i) {
          b.setAttribute('aria-disabled', 'true');
          b.disabled = true;
          if (options[i] === item.correct) b.classList.add('dc-correct');
        });
        if (!correct) btn.classList.add('dc-wrong');
        if (item.note) {
          var noteEl = document.createElement('p');
          noteEl.className = 'dc-quiz-note';
          noteEl.textContent = item.note;
          container.appendChild(noteEl);
        }
        cleanup();
        if (typeof onAnswer === 'function') onAnswer(correct, option);
      });
      buttons.push(btn);
      optionsEl.appendChild(btn);
    });

    document.addEventListener('keydown', handleKeydown);
  }

  function quizFreeTextRender(item, container, onAnswer) {
    if (!container || !item) return;
    injectBaseStyles();
    container.innerHTML = '';

    var promptEl = document.createElement('div');
    promptEl.className = 'dc-quiz-prompt';
    var promptText = document.createElement('span');
    promptText.className = 'dc-quiz-prompt-text';
    promptText.textContent = item.prompt || '';
    promptEl.appendChild(promptText);
    ttsButton(item.prompt || '', promptEl);
    container.appendChild(promptEl);

    var formEl = document.createElement('div');
    formEl.className = 'dc-quiz-freetext';
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'dc-quiz-input';
    input.setAttribute('aria-label', 'Dit svar');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.spellcheck = false;
    var submit = document.createElement('button');
    submit.type = 'button';
    submit.className = 'dc-quiz-submit';
    submit.textContent = 'Svar';
    formEl.appendChild(input);
    formEl.appendChild(submit);
    container.appendChild(formEl);

    var answered = false;

    function submitAnswer() {
      if (answered) return;
      var value = input.value;
      if (!value || !value.trim()) return;
      answered = true;
      var accepted = Array.isArray(item.accepted_answers) ? item.accepted_answers : [];
      var result = DanskCore.diff.check(value, accepted);
      input.disabled = true;
      submit.disabled = true;
      if (!result.correct) {
        var correctEl = document.createElement('p');
        correctEl.className = 'dc-quiz-note';
        correctEl.textContent = 'Korrekt svar: ' + result.closest;
        container.appendChild(correctEl);
      }
      if (item.note) {
        var noteEl = document.createElement('p');
        noteEl.className = 'dc-quiz-note';
        noteEl.textContent = item.note;
        container.appendChild(noteEl);
      }
      if (typeof onAnswer === 'function') onAnswer(result.correct, value);
    }

    submit.addEventListener('click', submitAnswer);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitAnswer();
      }
    });

    input.focus();
  }

  function quizTilesRender(tokens, slots, container, onComplete) {
    if (!container || !Array.isArray(tokens)) return;
    injectBaseStyles();
    container.innerHTML = '';

    var slotCount = typeof slots === 'number' ? slots : tokens.length;

    var slotsEl = document.createElement('div');
    slotsEl.className = 'dc-tiles-slots';
    slotsEl.setAttribute('role', 'list');
    container.appendChild(slotsEl);

    var bankEl = document.createElement('div');
    bankEl.className = 'dc-tiles-bank';
    bankEl.setAttribute('role', 'group');
    container.appendChild(bankEl);

    var placed = [];
    var bankButtons = [];

    function renderSlots() {
      slotsEl.innerHTML = '';
      for (var i = 0; i < slotCount; i++) {
        var slotItem = placed[i];
        if (slotItem) {
          var tileBtn = document.createElement('button');
          tileBtn.type = 'button';
          tileBtn.className = 'dc-tiles-slot-item';
          tileBtn.textContent = slotItem.token;
          tileBtn.setAttribute('aria-label', 'Fjern ' + slotItem.token);
          tileBtn.addEventListener('click', (function (index) {
            return function () { removeFromSlot(index); };
          })(i));
          slotsEl.appendChild(tileBtn);
        } else {
          var placeholder = document.createElement('span');
          placeholder.className = 'dc-tiles-slot-empty';
          placeholder.setAttribute('aria-hidden', 'true');
          slotsEl.appendChild(placeholder);
        }
      }
    }

    function removeFromSlot(index) {
      var entry = placed[index];
      if (!entry) return;
      placed[index] = null;
      bankButtons[entry.bankIndex].disabled = false;
      bankButtons[entry.bankIndex].classList.remove('dc-tile-placed');
      renderSlots();
    }

    function checkComplete() {
      for (var i = 0; i < slotCount; i++) {
        if (!placed[i]) return;
      }
      if (typeof onComplete === 'function') {
        onComplete(placed.map(function (p) { return p.token; }));
      }
    }

    function placeToken(bankIndex) {
      var nextSlot = -1;
      for (var i = 0; i < slotCount; i++) {
        if (!placed[i]) { nextSlot = i; break; }
      }
      if (nextSlot === -1) return;
      placed[nextSlot] = { token: tokens[bankIndex], bankIndex: bankIndex };
      bankButtons[bankIndex].disabled = true;
      bankButtons[bankIndex].classList.add('dc-tile-placed');
      renderSlots();
      checkComplete();
    }

    tokens.forEach(function (token, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dc-tile';
      btn.textContent = token;
      btn.addEventListener('click', function () { placeToken(index); });
      bankButtons.push(btn);
      bankEl.appendChild(btn);
    });

    renderSlots();
  }

  function quizSummaryRender(stats, container, onReplay, onReviewErrors) {
    if (!container) return;
    injectBaseStyles();
    container.innerHTML = '';
    stats = stats || {};

    var wrap = document.createElement('div');
    wrap.className = 'dc-summary';

    var statsEl = document.createElement('div');
    statsEl.className = 'dc-summary-stats';
    var scoreEl = document.createElement('div');
    scoreEl.className = 'dc-summary-score';
    scoreEl.textContent = 'Point: ' + (stats.score != null ? stats.score : 0);
    var accuracyEl = document.createElement('div');
    accuracyEl.className = 'dc-summary-accuracy';
    var accuracyValue = typeof stats.accuracy === 'number' ? Math.round(stats.accuracy) : 0;
    accuracyEl.textContent = 'Rigtige: ' + accuracyValue + '%';
    statsEl.appendChild(scoreEl);
    statsEl.appendChild(accuracyEl);
    wrap.appendChild(statsEl);

    var weakItems = Array.isArray(stats.weakItems) ? stats.weakItems.slice(0, 3) : [];
    if (weakItems.length) {
      var weakList = document.createElement('ul');
      weakList.className = 'dc-summary-weak';
      weakItems.forEach(function (weak) {
        var li = document.createElement('li');
        li.textContent = typeof weak === 'string' ? weak : ((weak && weak.label) || '');
        weakList.appendChild(li);
      });
      wrap.appendChild(weakList);
    }

    var actionsEl = document.createElement('div');
    actionsEl.className = 'dc-summary-actions';

    var replayBtn = document.createElement('button');
    replayBtn.type = 'button';
    replayBtn.textContent = 'Spil igen';
    replayBtn.addEventListener('click', function () {
      if (typeof onReplay === 'function') onReplay();
    });
    actionsEl.appendChild(replayBtn);

    if (typeof onReviewErrors === 'function' && weakItems.length) {
      var reviewBtn = document.createElement('button');
      reviewBtn.type = 'button';
      reviewBtn.textContent = 'Gentag fejl';
      reviewBtn.addEventListener('click', onReviewErrors);
      actionsEl.appendChild(reviewBtn);
    }

    wrap.appendChild(actionsEl);
    container.appendChild(wrap);
  }

  DanskCore.quiz = {
    mc: { render: quizMcRender },
    freeText: { render: quizFreeTextRender },
    tiles: { render: quizTilesRender },
    summary: { render: quizSummaryRender }
  };

})();
