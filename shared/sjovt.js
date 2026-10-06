/* =============================================================================
   SJOVT DANSK — shared runtime  (window.Sjovt)
   Load in <head> right after sjovt.css (synchronous, so the preloader covers the
   very first paint):   <script src="../shared/sjovt.js"></script>
   Provides: pixel sprites, preloader (real progress), page transitions,
   game chrome bar, feedback fx, screen-enter watcher.  Vanilla, no network.
   ============================================================================= */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, win = window;
  var scriptEl = doc.currentScript;
  var base = scriptEl ? scriptEl.src.replace(/[^\/]*$/, "") : "";           // …/shared/
  var homeUrl = base.replace(/shared\/$/, "index.html");
  var mq = win.matchMedia ? win.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function reduced() { return mq.matches || root.getAttribute("data-sd-motion") === "off"; }
  function store(get, k, v) { try { return get ? sessionStorage.getItem(k) : sessionStorage.setItem(k, v); } catch (e) { return null; } }

  root.classList.add("sd-page");

  /* ------------------------------------------------- theme + sound (US-040)
     One source of truth for every page. Theme: `sd:theme` = "dark" | "light"
     (raw string); absent = follow the OS. Applied here, synchronously in <head>,
     so the first paint already has the right theme. Sound effects: `dc:sound-enabled`
     (JSON true/false, same key DanskCore.ui.sound uses). Mute never affects TTS. */
  var THEME_KEY = "sd:theme", SOUND_KEY = "dc:sound-enabled";
  function lsGet(k) { try { return win.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { win.localStorage.setItem(k, v); } catch (e) { /* storage blocked: choice lasts for this page only */ } }
  var osDark = win.matchMedia ? win.matchMedia("(prefers-color-scheme: dark)") : { matches: false };
  function savedTheme() { var t = lsGet(THEME_KEY); return (t === "dark" || t === "light") ? t : null; }
  function applyTheme() { var t = savedTheme(); if (t) root.setAttribute("data-theme", t); }
  function themeIsDark() {
    var c = root.getAttribute("data-theme");
    return c === "dark" || (c !== "light" && !!osDark.matches);
  }
  function notify(name) {
    try { win.dispatchEvent(new CustomEvent(name)); } catch (e) { /* old browser */ }
  }
  var theme = {
    isDark: themeIsDark,
    get: function () { return themeIsDark() ? "dark" : "light"; },
    set: function (mode) {
      if (mode !== "dark" && mode !== "light") return theme.get();
      root.setAttribute("data-theme", mode); lsSet(THEME_KEY, mode); notify("sd:themechange"); return mode;
    },
    toggle: function () { return theme.set(themeIsDark() ? "light" : "dark"); }
  };
  function soundOn() { return lsGet(SOUND_KEY) !== "false"; }
  var sound = {
    isEnabled: soundOn,
    set: function (on) { lsSet(SOUND_KEY, on ? "true" : "false"); notify("sd:soundchange"); return !!on; },
    toggle: function () { return sound.set(!soundOn()); }
  };
  applyTheme();
  if (osDark.addEventListener) osDark.addEventListener("change", function () { notify("sd:themechange"); });

  /* ------------------------------------------------------------ sprites */
  var PAL = { K: "#101010", W: "#FFFFFF", O: "#F94F37", Y: "#E1AD12", C: "#FFC25A", A: "#FD9E4F",
              B: "#8A4A1C", R: "#D7263D", T: "#EDB366", G: "#148A3C", L: "#2B3FD6", P: "#FFE9B0", S: "#8E8E8E",
              // shade ramps for the per-game icons (light = top-left, dark = bottom-right)
              E: "#8FD3FF", D: "#B52A14", N: "#1B2A9A", V: "#7B3FBF", U: "#A678E0", X: "#4B1F7E", M: "#A87500", F: "#D9D9D9", J: "#5E5E5E", Q: "#5B2E10" };
  var SPR = {
    // Pølle — the hot-dog mascot (brand chrome)
    polle: [
      "................................",
      ".......KKKKKKKKKKKKKKKKKK.......",
      ".....KKPPPPPPPPPPPPPPPPPPKK.....",
      "....KPPPTTTTTTTTTTTTTTTTTTPK....",
      "...KPPTTTTTTTTTTTTTTTTTTTTTTK...",
      "..KPPTTTTKKKKKKKKKKKKKKTTTTTAK..",
      "..KPTTTKKAAAAAAAAAAAAAAKKTTTTK..",
      ".KPPTTKAAAOOOOOOOOOOOOOODKTTTAK.",
      ".KPTTTKAOOOOOOOOOOOOOOOOOKTTTAK.",
      ".KPTTKAAOWWOOOOOOOOOOOOOODKTTAK.",
      ".KPTTKAOOWOOOOOOOOOOOOOOODKTTAK.",
      ".KPTTKAOOOWKOOOOOOOOWKOOODKTTAK.",
      ".KPTTKAOOOKKOOOOOOOOKKOOODKTTAK.",
      ".KPTTKAOOOKKOOOOOOOOKKOOODKTTAK.",
      ".KPTTKAOOOOOOOOOOOOOOOOOODKTTAK.",
      ".KPTTKAOOOOOOOOOOOOOOOOOODKTTAK.",
      ".KPTTKAOOOOOOOOOOOOOOOOOODKTTAK.",
      ".KPTTKAOAAOKOOOOOOOOKOOAADKTTAK.",
      ".KPTTKAOOOOOKOOOOOOKOOOOODKTTAK.",
      ".KPTTKAOOOOOOKKKKKKOOOOODDKTTAK.",
      ".KPTTTKOOOOOOORRRROOOOOODKTTTAK.",
      ".KPTTTKDOOOOOOOOOOOOOODDDKTTAAK.",
      "..KTTTTKKDDDDDDDDDDDDDDKKTTTAK..",
      "..KPTTTTTKKKKKKKKKKKKKKTTTTAAK..",
      "...KTTTTTTTTTTTTTTTTTTTTTTAAK...",
      "....KATTTTTTTTTTTTTTTTTTAAAK....",
      ".....KKAAAAAAAAAAAAAAAAAAKK.....",
      ".......KKKKKKKKKKKKKKKKKK.......",
      ".......KKKKKKK....KKKKKKK.......",
      "......KAAAAAADK..KAAAAAADK......",
      "......KDDDDDDDK..KDDDDDDDK......",
      ".......KKKKKKK....KKKKKKK......."],
    // Kanelsnegl — cinnamon roll
    snegl: [
      "................................",
      "............KKKKKKKK............",
      "..........KKPPPPPPPPKK..........",
      "........KKPPPPPPPPPPPPKK........",
      ".......KPPPPPPTTTTTTTTPPK.......",
      "......KPPPPPTTTTTTTTTTTTPK......",
      ".....KPPPPTTTTTTBBTTTTTTTTK.....",
      "....KPPPPTTTBBBBBBBBBTTTTTAK....",
      "...KPPPPTTTBBBTTTTTTBBBTTTTAK...",
      "...KPPPTTTBBTTTTTTTTTTBBTTTAK...",
      "..KPPPTTTBBTTTTTTTTTTTTBBTTTAK..",
      "..KPPPTTBBTTWWTBBBBTTTTTBTTTAK..",
      ".KPPPTTTBBTTTBBBTBBBTTTTBBTTAAK.",
      ".KPPPTTTBTTTTBTPPTTBBTTTTBTTAAK.",
      ".KPPBTTTBTTTBBPPPPTTBWTTTBTTAAK.",
      ".KPPTTTTBTTTBPPPPPPTBBTTTBBTAAK.",
      ".KPPBTTTBTTTBPPPPPPTTBTTTBBTAAK.",
      ".KPPBTTTBTTTTBPPPPTTTBTTTBBTAAK.",
      ".KPPTTTTBBTTTTBPPTTTBBTTTBBAAAK.",
      ".KPPTTTTTBBTTTTTTTTTBTTTTBTAAAK.",
      "..KPTBTTTBBWTTTTTTTBBTTTBBAAAK..",
      "..KPTTTTTTBBBTTTTBBWWTTTBBAAAK..",
      "...KPTBTTTTTBBBBBBBTTTTBBAAAK...",
      "...KPTTBTTTTTTTTTTTTTTBBAAAAK...",
      "....KPTTBTTTTTTTTTTTTBBAAAAK....",
      ".....KTTTBBTTTTTTTTBBBAAAAK.....",
      "......KATTTBBBBBBBBBBAAAAK......",
      ".......KAATTTTBBBBAAAAAAK.......",
      "........KKAAAAAAAAAAAAKK........",
      "..........KKAAAAAAAAKK..........",
      "............KKKKKKKK............",
      "................................"],
    // Mølle — windmill
    molle: [
      "..KWWWWK................KWWWFK..",
      "..KWWWWWK..............KWWWFFK..",
      "...KWWWSWK............KWWSFFK...",
      "....KWWWWWK..........KWWWFFK....",
      ".....KWWWSWK........KWWSFFK.....",
      "......KWWWWWK......KWWWFFK......",
      ".......KWWWSWK....KWWSFFK.......",
      "........KWWWWWK..KWWWFFK........",
      ".........KWWWSWKKWWSFFK.........",
      "..........KWWWKKKKWFFK..........",
      "...........KFKCCCMKFK...........",
      "............KKCYYMKK............",
      "...........KWKMMMMKWK...........",
      "..........KWWWKKKKWWWK..........",
      ".........KWWWSFKKWWSWWK.........",
      "........KWWWFFKAAKWWWWWK........",
      ".......KWWWSFKAOOOKWWSWWK.......",
      "......KWWWFFKAAEEODKWWWWWK......",
      ".....KWWWSFKAADELDDDKWWSWWK.....",
      "....KWWWFFKKAAOOOOODKKWWWWWK....",
      "...KWWWSFKKAAAOKKOODK.KWWSWWK...",
      "..KWWWFFK.KAAAKKKKODDK.KWWWWFK..",
      "..KWWFFK..KAADKKKKDDDK..KWWFFK..",
      "...KFFK...KAAOKQQKOODK...KFFK...",
      "....KK....KAAOKQQKOODK....KK....",
      ".........KDDDDKQQKDDDDK.........",
      ".........KDDDDKQQKDDDDK.........",
      "..........KKKKKKKKKKKK..........",
      "................................",
      "................................",
      "................................",
      "................................"],
    // Cykel — bicycle (coloured, readable on dark)
    cykel: [
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      ".........KKKKKKK.....KKKKKK.....",
      "........KTTTTTTQK...KFFFFFJK....",
      "........KTBBBBBQK..KKJJJJJJK....",
      "........KQQQQQQQKKKKFKKKKKK.....",
      ".........KKKKKKKAAAKFJJK........",
      "..........KDDRRDDDDRKJKK........",
      "......KKKKARRRKKKKKKRKRKKK......",
      "....KKEEEKARRDK...KARSRSKEKK....",
      "...KEEELLKARRRK..KADDKFSKLLEK...",
      "..KENNNNKADRRRDKKAADKKSSKNLLLK..",
      ".KENNKKKKADKKRDKKADDKKSSKKKLLLK.",
      "KENNK..KADDKKARKADDKKKSFK..KLLNK",
      "KENK.SSKRRKKKRRARDKK.KSFSKS.KLNK",
      "KENK..SKADRAASSSSKNK..KFSK..KENK",
      "KENKSSKADDRRRSFSSKNKSSKSSKSSKENK",
      "KENK..SKDRDDDSSSSENK..SKKS..KENK",
      "KELK.SS.KKKKKKKKKELK.SS..SS.KENK",
      "KELLK......KENNKKELLK......KENNK",
      ".KLLLKKKKKKENNK..KLLLKKKKKKENNK.",
      "..KLLLEEEEENNK....KLLLEEEEENNK..",
      "...KNLLLLNNNK......KNLLLLNNNK...",
      "....KKNNNNKK........KKNNNNKK....",
      "......KKKK............KKKK......",
      "................................",
      "................................"],
    // Stjerne — gold reward star
    stjerne: [
      "................................",
      "................................",
      "................................",
      "...............KK...............",
      "..............KCCK..............",
      "..............KCCK..............",
      "..............KCCK..............",
      ".............KCCCCK.............",
      ".............KCCCCK.............",
      "............KCCCCCCK............",
      "............KCCCCCCK............",
      "....KKKKKKKWWCCCCCCKKKKKKKKK....",
      "...KCCCCCCCWCCCCCCCYYYYYYYYYK...",
      "...KCCCCCCCCCCCCCCCYYYYYYYYMK...",
      "....KCCCCCCCCCCCCCYYYYYYMMMK....",
      ".....KCCCCCCCCCCCYYYYMMMMMK.....",
      "......KCCCCCCCCCYYMMMMMMMK......",
      ".......KCCCCCCYYMMMMMMMMK.......",
      "........KKCYYYYYMMMMMMKK........",
      ".........KYYYYYYMMMMMMK.........",
      ".........KYYYYYYMMMMMMK.........",
      "........KYYYYYYYMMMMMMMK........",
      "........KYYYYYYYMMMMMMMK........",
      "........KYYYYYYYMMMMMMMK........",
      "........KYYYYYKKKKMMMMMK........",
      ".......KYYYYKK....KKMMMMK.......",
      ".......KYYYK........KMMMK.......",
      ".......KYKK..........KKMK.......",
      "........K..............K........",
      "................................",
      "................................",
      "................................"],
    // Hjerte — heart / life
    hjerte: [
      ".......KKKKK........KKKKK.......",
      ".....KKOOOOOKKK..KKKOOOOOKK.....",
      "....KOOOOOOOOOOKKOOOOOOOOOOK....",
      "...KOOOOORRRRROOOOOOOORRRRRDK...",
      "..KOOOORRRRRRRRRROORRRRRRRRRDK..",
      "..KOOORRRRRRRRRRRRRRRRRRRRRRDK..",
      ".KOOORRRRRRRRRRRRRRRRRRRRRRRDDK.",
      ".KOOORRRRRRRRRRRRRRRRRRRRRRRDDK.",
      ".KOORRRRRWWARRRRRRRRRRRRRRRRDDK.",
      ".KOORRRRWRRRRRRRRRRRRRRRRRRRDDK.",
      ".KOORRRRWRRRRRRRRRRRRRRRRRRRDDK.",
      ".KOORRRRWRRRRRRRRRRRRRRRRRRRDDK.",
      ".KOORRRRRRRRRRRRRRRRRRRRRRRDDDK.",
      ".KOORRRRRRRRRRRRRRRRRRRRRRRDDDK.",
      "..KORRRRRRRRRRRRRRRRRRRRRRRDDK..",
      "..KORRRRRRRRRRRRRRRRRRRRRRDDDK..",
      "..KOORRRRRRRRRRRRRRRRRRRRRDDDK..",
      "...KORRRRRRRRRRRRRRRRRRRRDDDK...",
      "...KORRRRRRRRRRRRRRRRRRRDDDDK...",
      "....KORRRRRRRRRRRRRRRRRDDDDK....",
      ".....KRRRRRRRRRRRRRRRRDDDDK.....",
      "......KRRRRRRRRRRRRRRDDDDK......",
      ".......KRRRRRRRRRRRRDDDDK.......",
      "........KRRRRRRRRRRDDDDK........",
      ".........KDRRRRRRDDDDDK.........",
      "..........KDRRRRDDDDDK..........",
      "...........KKDDDDDDKK...........",
      ".............KDDDDK.............",
      "..............KKKK..............",
      "................................",
      "................................",
      "................................"],
    // Pokal — trophy
    pokal: [
      "................................",
      "................................",
      "........KKKKKKKKKKKKKKKK........",
      ".......KCCCCCCCCCCCCCCMMK.......",
      ".......KCCPCCCCCCCCCCCMMK.......",
      "....KKKKCCPPYYYYYYYYYYMMKKKK....",
      "...KCCCKCCPPYYYYYYYYYYMMKYCCK...",
      "..KCCMMKCCPPYYYYOYYYYYMMKYYYMK..",
      "..KCMMKKCCPPYYYOOOYYYYMMKKYYMK..",
      "..KCMK.KCCPPYYOOOOOYYYMMK.KYYK..",
      ".KCCMK.KCCPPYYYOOOYYYYMMK.KCMMK.",
      "..KYYK.KCCPPYYYOYOYYYMMMK.KCMK..",
      "..KCYYKKCCYYYYYYYYYYYMMMKKCCMK..",
      "..KCYYYCKCYYYYYYYYYYMMMKCCCMMK..",
      "...KMMMMKCYYYYYYYYYYMMMKMMMMK...",
      "....KKKKKKCYYYYYYYYMMMKKKKKK....",
      ".........KCYYYYYYYMMMMK.........",
      ".........KMMMMMMMMMMMK..........",
      "..........KKMMKKKKMMK...........",
      "............KKCCCMKK............",
      ".............KCYYMK.............",
      ".............KCYYMK.............",
      ".............KCYYMK.............",
      "..........KKKKKKKKKKKK..........",
      ".........KCCCCCCCCCCCMK.........",
      "........KKKKKKKKKKKKKKKK........",
      ".......KAAAAAAAAAAAAAAAAK.......",
      "......KAAOOOOPPPPPPOOOOODK......",
      "......KAOOOOOPPPPPPOOOOODK......",
      "......KDDDDDDDDDDDDDDDDDDK......",
      ".......KKKKKKKKKKKKKKKKKK.......",
      "................................"],
    // ---- one icon per game (16x16, or 32x32 for the detailed ones; 1px outline, light from top-left) ----
    modsat: [
      "................................",
      ".....................K..........",
      "....................KNK.........",
      "....................KENK........",
      "....................KELNK.......",
      "..KKKKKKKKKKKKKKKKKKKELLNK......",
      ".KEEEEEEEEEEEEEEEEEEELLLLNK.....",
      ".KELLLLLLLLLLLLLLLLLLLLLLLNK....",
      ".KELLLLLLLLLLLLLLLLLLLLLLLLNK...",
      ".KELLLLLLLLLLLLLLLLLLLLLLLNK....",
      ".KNNNNNNNNNNNNNNNNNNNLLLLNK.....",
      "..KKKKKKKKKKKKKKKKKKKELLNK......",
      "....................KELNK.......",
      "....................KENK........",
      "....................KNK.........",
      "..........K..........K..........",
      ".........KDK....................",
      "........KADK....................",
      ".......KAODK....................",
      "......KAOODKKKKKKKKKKKKKKKKKKK..",
      ".....KAOOOOAAAAAAAAAAAAAAAAAADK.",
      "....KAOOOOOOOOOOOOOOOOOOOOOOODK.",
      "...KDOOOOOOOOOOOOOOOOOOOOOOOODK.",
      "....KDOOOOOOOOOOOOOOOOOOOOOOODK.",
      ".....KDOOOODDDDDDDDDDDDDDDDDDDK.",
      "......KDOODKKKKKKKKKKKKKKKKKKK..",
      ".......KDODK....................",
      "........KDDK....................",
      ".........KDK....................",
      "..........K.....................",
      "................................",
      "................................"],
    kort: [
      "................................",
      "................................",
      "...............KKKKKKKKKKKK.....",
      "..............KAAAAAAAAAAADK....",
      ".............KAOOOOOOOOOOOODK...",
      "............KAOOOOOOOOOOOOOODK..",
      "............KAOOOOOOOOOOOOOODK..",
      "............KAOOOOOOOOOOOOOODK..",
      ".....KKKKKKKKKKKKKKKOOOOOOOODK..",
      "....KWWWWWWWWWWWWWWFKOOOOOOODK..",
      "...KWWWWWWWWWWWWWWWWFKOOOOOODK..",
      "...KWWWWWWWWWWWWWWWWFKOOOOOODK..",
      "...KWWLLWLLWLLWWWWWWFKOOOOOODK..",
      "...KWWLLWLLWLLWWWWWWFKOOOOOODK..",
      "...KWWLLWLLWLLLLWWWWFKOOOOOODK..",
      "...KWWLLWLLWLLWLWWWWFKOOOOOODK..",
      "...KWWWLLLWWLLWLWLLWFKOOOOOODK..",
      "...KWWWWLWWWLLLLWLLWFKOOOOOODK..",
      "...KWWWWWWWWWWWWWWWWFKOOOOOODK..",
      "...KWWWWWWWWWWWWWWWWFKOOOOOODK..",
      "...KWWWSSSSSSSSSSSWWFKOOOOODK...",
      "...KWWWSSSSSSSSSSSWWFKDDDDDK....",
      "...KWWWWWWWWWWWWWWWWFKKKKKK.....",
      "...KWWWSSSSSSSSWWWWWFK..........",
      "...KWWWSSSSSSSSWWWWWFK..........",
      "...KWWWWWWWWWWWWWWWWFK..........",
      "...KWWWWWWWWWWWWWWWWFK..........",
      "...KFWWWWWWWWWWWWWWWFK..........",
      "....KFFFFFFFFFFFFFFFK...........",
      ".....KKKKKKKKKKKKKKK............",
      "................................",
      "................................"],
    tryllestav: [
      "................................",
      ".......................K........",
      ".......K..............KMK.......",
      "......KYK............KCYMK......",
      ".....KYYYK.......KKKKKCYMKKKKK..",
      "....KYYCYYK.....KMCCCCYYYCCCCMK.",
      "...KYYCWCYYK.....KMYYYWWYYYYMK..",
      "....KYYCYYK.......KMYYWYYYYMK...",
      ".....KYYYK.........KCYYYYYMK....",
      "......KYK..........KCYYMYYMK....",
      ".......K..........KCYYMKMYYMK...",
      "..................KCMMK.KMMMK...",
      "....K............KMMKK...KKMMK..",
      "...KYK............KKK......KK...",
      "..KYCYK..........KWWFK..........",
      ".KYCWCYK........KWWFK...........",
      "..KYCYK........KVXXK............",
      "...KYK........KUUVK.............",
      "....K........KUUVK..............",
      "............KVXXK.........K.....",
      "...........KVXXK.........KYK....",
      "..........KUUVK.........KYYYK...",
      ".........KUUVK.........KYYCYYK..",
      "........KVXXK.........KYYCWCYYK.",
      ".......KVXXK...........KYYCYYK..",
      "......KUUVK.............KYYYK...",
      ".....KCYMK...............KYK....",
      "....KCYMK.................K.....",
      "...KCYMK........................",
      "....KKK.........................",
      "................................",
      "................................"],
    pin: [
      "................W...............",
      "...............WKW..............",
      "..............WKKKW.............",
      ".............WKKKKKW............",
      "..............WKKKW.............",
      "..............WKKKW.............",
      "...............WWW..............",
      "..............KKKKK.............",
      "............KKAAAADKK...........",
      "...........KAAOOOOOADK..........",
      "..........KAOOOOOOOOODK.........",
      "....W.....KAOOWWWOOOODK....W....",
      "...WKWW...KAOWWWWWOOODK..WWKW...",
      "..WKKKKW..KAOWWWWWOOODK.WKKKKW..",
      ".WKKKKKW..KDOWWWWFOOODK.WKKKKKW.",
      "..WKKKKW...KAOWWFOOODK..WKKKKW..",
      "...WKWW....KDOOOOOOODK...WWKW...",
      "....W.......KAOOOOODK......W....",
      "............KDOOOOODK...........",
      ".............KAOOODK............",
      ".............KDOOODK............",
      "..............KAODK.............",
      "..............KDODK.............",
      "...............KDK..............",
      "................K...............",
      "...........SSSSWWWSSSS..........",
      "..........SSSSWKKKWSSSS.........",
      "...........SSSWKKKWSSS..........",
      ".............WKKKKKW............",
      "..............WKKKW.............",
      "...............WKW..............",
      "................W..............."],
    snak: [
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      ".........KKKKKKKKKKKKKK.........",
      "........KWWWWWWWWWWWWWFK........",
      ".......KWWWWWWWWWWWWWWWFK.......",
      ".KK...KWWWWWWWWWWWWWWWWWFK...KK.",
      "KMMK..KWWWWWWWWWWWWWWWWWFK..KCMK",
      ".KMMK.KWWWWWWWWWWWWWWWWWFK.KMMK.",
      "..KK..KWWWWWWWWWWWWWWWWWFK..KK..",
      "......KWWWLLLWWLLLWWLLLWFK......",
      "......KWWWLLLWWLLLWWLLLWFK......",
      "......KWWWNNNWWNNNWWNNNWFK......",
      "..KK..KWWWWWWWWWWWWWWWWWFK..KK..",
      ".KCMK.KWWWWWWWWWWWWWWWWWFK.KMMK.",
      "KMMK..KWWWWWWWWWWWWWWWWWFK..KMMK",
      ".KK...KFWWWWWWWWWWWWWWWWFK...KK.",
      ".......KFWWWWWWWWWWWWWWFK.......",
      "........KFWWWWWFFFFFFFFK........",
      ".........KWWWWFKKKKKKKK.........",
      ".........KWWWFK.................",
      ".........KWWFK..................",
      ".........KWFK...................",
      ".........KFK....................",
      "..........K.....................",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................"],
    terning: [
      "................................",
      "................................",
      ".....KKKKKKKKKKK........KK......",
      "....KWWWWWWWWWWFK......KCMK.....",
      "...KWWWWWWWWWWWWFK....KMMK......",
      "...KWWWWWWWWWWWWFK.....KK...KK..",
      "...KWWWWWWWWWWWWFK.........KCMK.",
      "...KWWWWWWWWWWWWFK........KMMK..",
      "...KWWLLLWWLLLLWFK.........KK...",
      "...KWLLWLLWLLWLLFK..............",
      "...KWLLLLLWLLWLLFK..............",
      "...KWLLWWWWLLWLLFKKKKKKKKKKK....",
      "...KWWLLLLWLLWLLKWWWWWWWWWWFK...",
      "...KWWWWWWWWWWWKWWWWWWWWWWWWFK..",
      "...KWWWWWWWWWWWKWWWWWWWWWWWWFK..",
      "...KWWWWWWWWWWWKWWWWWWWWWWWWFK..",
      "...KWWWWWWWWWWWKWWWWWWWWWWWWFK..",
      "...KFWWWWWWWWWWKWWWWWWWWRRWWFK..",
      "....KFFFFFFFFFFKWWRRRWWRRRRWFK..",
      ".KK..KKKKKKKKKKKWRRWRRWWRRWWFK..",
      "KCMK...........KWRRRRRWWRRWWFK..",
      "MMK............KWRRWWWWWRRWWFK..",
      "KK.............KWWRRRRWWRRRWFK..",
      "...............KWWWWWWWWWWWWFK..",
      "KK.............KWWWWWWWWWWWWFK..",
      "MMK............KWWWWWWWWWWWWFK..",
      "KMMK...........KFWWWWWWWWWWWFK..",
      ".KK.............KFFFFFFFFFFFK...",
      ".................KKKKKKKKKKK....",
      "................................",
      "................................",
      "................................"],
    slik: [
      "................................",
      "...............KK...............",
      "..............KCMK..............",
      ".........KK...KCMK...KK.........",
      "........KMMK..KCMK..KCMK........",
      ".........KMMK.KMMK.KCMK.........",
      "..........KMMK.KK.KMMK..........",
      "...........KK......KK...........",
      ".......KKKK..........KKKK.......",
      "......KEEENK........KAAADK......",
      "......KELLNK........KAOODK......",
      "....KKKELLNKKK....KKKAOODKKKK...",
      "...KEEELLLLEENK..KAAAOOOOAAADK..",
      "...KELLLLLLLLNK..KAOOOOOOOOODK..",
      ".KKKELLLLLLLNNKKKKAOOOOOOOOODKK.",
      "KEEELLLLLLLNKKAAAAOOOOOOOOOOOADK",
      "KELLLLLLLLLNKKAOOOOOOOOOOOOOOODK",
      "KELLLLLLLLLNKKAOOOOOOOOOOOOOOODK",
      "KELLLLLLLLLNKKAOOOOOOOOOOOOOOODK",
      "KNNNLLLLLLLNKKDDDDOOOOOOOOOOODDK",
      ".KKKELLLLLLLENKKKKAOOOOOOOOODKK.",
      "...KELLLLLLLLNK..KAOOOOOOOOODK..",
      "...KNNNLLLLNNNK..KDDDOOOODDDDK..",
      "....KKKELLNKKK....KKKAOODKKKK...",
      "......KELLNK........KAOODK......",
      "......KNNNNK........KDDDDK......",
      ".......KKKK..........KKKK.......",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................"],
    lup: [
      "................................",
      "................................",
      "................................",
      "...........................KK...",
      "..........................KCMK..",
      "...............KK........KCMK...",
      "............KKKCMKKK....KMMK....",
      "...........KCCCYYCCMK....KK.....",
      "..........KCYMMMMMMYMK..........",
      ".........KCYWWKKKKKMYMK.........",
      "..KKKKKKKCYWKEEEEEEKMYMKKKKKKK..",
      ".KWWWWWWKCMWEEEEEEEEKCMKWWWWWFK.",
      "KWWWWWWWKCMKEEEEEEEEKCMKWWWWWWFK",
      "KWWLLLLKCYMKSSSSSSSSKCYMKGGGGWFK",
      "KWWLLLLKMYMKSSSSSSSSKCYMKGGGGWFK",
      "KWWLLLLLKCMKEEEEEEEEKCMKGGGGGWFK",
      "KWWWWWWWKCMKEEEEEEEEKCMKWWWWWWFK",
      "KFWWWWWWKMYMKEEEEEEKCYMKWWWWWWFK",
      ".KFFFFFFFKMYMKKKKKKCYMKFFFFFFFK.",
      "..KKKKKKK.KMYCCCCCCYMK.KKKKKKK..",
      "...........KMMMYYMMMKMK.........",
      "............KKKMMKKKCYMK........",
      "...............KK...KTBQK.......",
      "......KK.............KTBQK......",
      ".....KCMK.............KTBQK.....",
      "....KCMK...............KTBQK....",
      "...KMMK.................KTBQK...",
      "....KK...................KTBQK..",
      "..........................KKK...",
      "................................",
      "................................",
      "................................"],
    net: [
      "................................",
      "................................",
      "...............KK...............",
      "..............KCMK..............",
      ".........KK...KCMK...KK.........",
      "........KMMK..KCMK..KCMK........",
      ".........KMMK.KMMK.KCMK.........",
      "..........KMMK.KK.KMMK..........",
      "...........KK......KK...........",
      "................................",
      "................................",
      "..KKKKKKKKKKKK....KKKKKKKKKKKK..",
      ".KEEEEEEEEEEENK..KOOOOOOOOOOODK.",
      "KELLLLLLLLLLKKKKKKKKRRRRRRRRRRDK",
      "KELLLLLLLLLKCCCCCCCMKRRRRRRRRRDK",
      "KELLNNNNNNKCYYMMMMYYMKDDDDDDRRDK",
      "KELLNNNNNKCYYMKKKKMYYMKDDDDDRRDK",
      "KELLLLLLLKCYMKNKKOKCYMKRRRRRRRDK",
      "KELLLLLLLKCYMKNKKOKCYMKRRRRRRRDK",
      "KELLNNNNNKMYYMKKKKCYYMKDDDDDRRDK",
      "KELLNNNNNNKMYYCCCCYYMKDDDDDDRRDK",
      "KELLLLLLLLLKMMMMMMMMKRRRRRRRRRDK",
      "KNLLLLLLLLLLKKKKKKKKRRRRRRRRRRDK",
      ".KNNNNNNNNNNNNK..KDDDDDDDDDDDDK.",
      "..KKKKKKKKKKKK....KKKKKKKKKKKK..",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................"],
    kiste: [
      "................................",
      "................................",
      "................................",
      "................................",
      ".....KKKKKKKKKKKKKK.............",
      "....KTTTTTTTTTTTTTQK............",
      "...KCMBBBBBBBBBBBBCMK...........",
      "..KTCMBBBBBBBBBBBBCMQK..........",
      ".KTBCMBBBKKKKKKKBBCMBQK.........",
      ".KTBCMBBKCCCCCCCKBCMBQK.........",
      ".KTBCMBBKCCCCCCCKBCMBQK.........",
      ".KTBCMBBKCCKKKCCKBCMBQK.........",
      ".KTCCMCCKCCKKKCCKCCMMQK.........",
      ".KTMCMMMKCCCKCCCKMCMMQK.........",
      ".KTBCMBBKCCCKCCCKBCMBQK.........",
      ".KTBCMBBKCCCCCCCKBCMBQK.........",
      ".KTBCMBBKCCCCCCCKBCMBQK.........",
      ".KTBCMBBKCCCCCCCKBCMBQK.........",
      ".KTBCMBBBKKKKKKKBKKKKKKKKKKK....",
      ".KTBCMBBBBBBBBBBKWWWWWODWWWTK...",
      ".KQBCMBBBBBBBBBKWPPPPPODPPPPTK..",
      "..KQCMBBBBBBBBKWTTTPPPODPPPPPTK.",
      "...KMMBBBBBBBBKWTKTPPPODPPPPPTK.",
      "....KQQQQQQQQQKWTTTPPPODPPPPPTK.",
      ".....KKKKKKKKKKTPPPPPPODPPPPPTK.",
      "...............KTPPPPPODPPPPTK..",
      "................KTTTTTKKTTTTK...",
      ".................KKKKKRRKKKK....",
      "....................KRKKRK......",
      ".....................K..K.......",
      "................................",
      "................................"],
    tandhjul: [
      "................................",
      "..........KKKKKKK...............",
      ".........KFFFFFFJK..............",
      ".....KKKKKFSSSSSJKKKKK..........",
      "....KFFFJKFSSSSSJKFFFJK.........",
      "...KFSSSJKFSSSSSJKFSSSJK........",
      "...KFSSSSFSSSSSSSFSSSSJK........",
      "...KFSSSSSSSKKSSSSSSSSJK........",
      "...KJJSSSSKKFFKKSSSSSJJK........",
      "..KKKKFSSKFFFFFFKSSSJKKKK.......",
      ".KFFFFSSKFFFFFJFFKSSSFFFJK......",
      ".KFSSSSSKFFSKKSJFKSSSSSSJK......",
      ".KFSSSSKFFFKKKKJFFKSSSSSJK......",
      ".KFSSSSKFFFKKKKJFFKKKKKKKKKKK...",
      ".KFSSSSSKFJSKKSJFKKWWWWWWWWWFK..",
      ".KFSSSSSKFFJJJJFFKWWWWWWWWWWWFK.",
      ".KJJJJSSSKFFFFFFKKWWWWWWWWWWWFK.",
      "..KKKKFSSSKKFFKKSKWWWWWWWWWWWFK.",
      "...KFFSSSSSSKKSSSKWWWWLLLWWWWFK.",
      "...KFSSSSSSSSSSSSKWWWLLWLLWWWFK.",
      "...KFSSSSJSSSSSSSKWWLLWWWLLWWFK.",
      "...KJSSSJKFSSSSSJKWWLLWWWLLWWFK.",
      "....KJJJJKFSSSSSJKWWLLLLLLLWWFK.",
      ".....KKKKKFSSSSSJKWWLLWWWLLWWFK.",
      ".........KJJJJJJJKWWLLWWWLLWWFK.",
      "..........KKKKKKKKWWWWWWWWWWWFK.",
      ".................KWWWWWWWWWWWFK.",
      ".................KFWWWWWWWWWWFK.",
      "..................KFFFFFFFFFFK..",
      "...................KKKKKKKKKK...",
      "................................",
      "................................"],
    ur: [
      "................................",
      "................................",
      "................................",
      "...KKKKKKKKKKKKK..........K.....",
      "..KWWWWWWWWWWWWFK........KYK....",
      ".KWWWWWWWWWWWWWWFK......KYYYK...",
      ".KWWWWWWWWWWWWWWFK.....KYYCYYK..",
      ".KWWWKKKKKKKKKWWFK....KYYCWCYYK.",
      ".KWWWKKKKKKKKKWWFK.....KYYCYYK..",
      ".KWWWWWWWWWWWWWWFK......KYYYK...",
      ".KWWWKKKKKKWWWKKFK.......KYK....",
      ".KWWWWWWWWWWKKODKK........K.....",
      ".KFWWWWWWWWKOODDODK.............",
      "..KFFFFFFFFKODKKDDKK............",
      "...KKKKKKKKODKKKKKODKK..........",
      "..........KDDK.KOODDODK.........",
      "...........KODKKODKKDDK.........",
      "...........KDDKODKKKKODKKKKKK...",
      ".......K....KKKDDKWWKODKWWWWFK..",
      "......KYK.....KKODKKODKWWWWWWFK.",
      ".....KYYYK....KKDDOODDKWWWWWWFK.",
      "....KYYCYYK...KWKKDDKKKKKKKWWFK.",
      "...KYYCWCYYK..KWWWKKKKKKKKKWWFK.",
      "....KYYCYYK...KWWWWWWWWWWWWWWFK.",
      ".....KYYYK....KWWWKKKKKKWWWWWFK.",
      "......KYK.....KWWWWWWWWWWWWWWFK.",
      ".......K......KFWWWWWWWWWWWWWFK.",
      "...............KFFFFFFFFFFFFFK..",
      "................KKKKKKKKKKKKK...",
      "................................",
      "................................",
      "................................"],
    // Vagt-hat — grey bowler hat (for reading / "fejl" screens)
    hat: [
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "............KKKKKKKK............",
      "...........WWFFFFFFFK...........",
      "..........WFFFFFFFFFFK..........",
      ".........KWFFFSSSSSSSSK.........",
      "........KFWFFSSSSSSSSSJK........",
      ".......KFFFFSSSSSSSSSSSJK.......",
      ".......KFFFSSSSSSSSSSSSJK.......",
      "......KFFFSSSSSSSSSSSSSJJK......",
      "......KFFFSSSSSSSSSSSSSSJK......",
      "......KFFSSSSSSSSSSSSSSSJK......",
      ".....KFFFSSSSSSSSSSSSSSSJJK.....",
      ".....KKKKKKKKKKKKKKKKKKKKKK.....",
      ".....KOOOOOOOOOOOOOOOOOOODK.....",
      ".....KORRRRRRRRRRRRRRRRRRDK.....",
      ".....KORKKKKKKKKKKKKKKKKRDK.....",
      "....KKKKRRRRRRRRRRRRRRRRKKKK....",
      "..KKFKDDDDDDDDDDDDDDDDDDDDKFKK..",
      ".KFFFFFFFFFFFFFFFFFFFFFFFFFFFFK.",
      "KFFSSSSSSSSSSSSSSSSSSSSSSSSSSJJK",
      ".KJSSSSSSSSSSSSSSSSSSSSSSSSJJJK.",
      "..KKJJJSSSSSSSSSSSSSSSSJJJJJKK..",
      "....KKKKJJJJJJJJJJJJJJJJKKKK....",
      "........KKKKKKKKKKKKKKKK........",
      "................................",
      "................................",
      "................................",
      "................................"],
    // Pronomenmysteriet — speech bubble with a question mark and a person
    bog: [
      "................................",
      "................................",
      "....KKKKKKKKKKKKKK..............",
      "...KWWWWWWWWWWWWWFK.............",
      "..KWWWWWWWWWWWWWWWFK............",
      ".KWWWWWWWWWWWWWWWWWFK...........",
      ".KWWWWWWWRRRRWWWWWWFK...........",
      ".KWWWWWWRRRRRRWWWWWFK...........",
      ".KWWWWWRRRWWRRRWWWWFK...........",
      ".KWWWWWWWWWWRRRWWWWFK...........",
      ".KWWWWWWWWWRRRWWWWWFK...........",
      ".KWWWWWWWWRRRWWWWWWFK...........",
      ".KWWWWWWWWRRWWWWWWWFK...........",
      ".KWWWWWWWWWWWWWWWWWFK...........",
      ".KWWWWWWWWRRWWWWWWWFK...........",
      ".KWWWWWWWWRRWWWWWWWFK..KK.......",
      ".KWWWWWWWWWWWWWWWWWFKKKENKK.....",
      ".KFWWWWWWWWWWWWWWWWFKEELLENK....",
      "..KFWWWWWWWWWWWWWWFKKELLLLNK....",
      "...KFFFFFFFFFWWWWFKKELLLLLLNK...",
      "....KKKKKKKKKFWWFK.KNLLLLLLNK...",
      ".............KFWFK..KELLLLNK....",
      "..............KFFK..KNNLLNNK....",
      "...............KFK...KKNNKK.....",
      "................K...KKKKKKKK....",
      "..................KKEEEEEEENKK..",
      ".................KEELLLLLLLLENK.",
      "................KELLLLLLLLLLLLNK",
      "................KELLLLLLLLLLLLNK",
      "................KELLLLLLLLLLLLNK",
      "................KNNNNNNNNNNNNNNK",
      ".................KKKKKKKKKKKKKK."],
    // Tidsmaskinen — gold star with eyes (card icon; the small reward star stays "stjerne")
    tidsstjerne: [
      "................................",
      "................................",
      "...............KK...............",
      "..............KYMK..............",
      "..............KYMK..............",
      ".............KPWYMK.............",
      ".............KPWYMK.............",
      "............KPWCCYMK............",
      "............KPCCCYMK............",
      "...........KPCCCCCYMK...........",
      "........KKKKPCCCCCYMKKKK........",
      ".KKKKKKKPPPPCCCCCCCCPPYMKKKKKKK.",
      "KMYPPPPPCCCCCCCCCCCCCCCCPPPPPYMK",
      ".KMYCWWWCCCCCCCCCCCCCCCCCCCCYMK.",
      "..KMYYCCCCCCKKCCCCKKCCCCCCYYMK..",
      "...KMMYCCCCCKKCCCCKKCCCCCYMMK...",
      "....KKMYCCCCKKCCCCKKCCCCYMKK....",
      "......KMYCCCKKCCCCKKCCCYMK......",
      ".......KMCCCKKCCCCKKCCYMK.......",
      "........KPCCCCCCCCCCCYMK........",
      "........KPCCCCCCCCCCCYMK........",
      ".......KPCWCCCCCCCCCCCYMK.......",
      ".......KPCWCCCCCCCCCCCYMK.......",
      ".......KPCCCCCCYYCCCCCYMK.......",
      ".......KPCCCCYYMMYYCCCYMK.......",
      ".......KPCCYYMMKKMMYYCYMK.......",
      "......KPCYYMMKK..KKMMYYYMK......",
      "......KYYMMKK......KKMMYMK......",
      "......KMMKK..........KKMMK......",
      ".......KK..............KK.......",
      "................................",
      "................................"],
    // ---- generic family, 32x32 shaded (polle ... vend) ----
    // Dannebrog — Danish flag
    flag: [
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..",
      ".KOOOOOOOWWWWOOOOOOOOOOOOOOOODK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KWWWWWWWWWWWWWWWWWWWWWWWWWWWWK.",
      ".KWWWWWWWWWWWWWWWWWWWWWWWWWWWWK.",
      ".KWWWWWWWWWWWWWWWWWWWWWWWWWWWWK.",
      ".KWFFFFFFWWWWFFFFFFFFFFFFFFFFFK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KORRRRRRWWWFRRRRRRRRRRRRRRRRDK.",
      ".KDDDDDDDWWWFDDDDDDDDDDDDDDDDDK.",
      "..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..",
      "................................",
      "................................",
      "................................",
      "................................"],
    // Stopur — stopwatch: speed / timed modes
    stopur: [
      "................................",
      "............KKKKKKKK............",
      "...........KFFFFFFFJK...........",
      "...........KFSSSSSSJK....KKK....",
      "...........KJJJJJJJJK...KFFJK...",
      "...........KKKKKKKKKK..KFFSJK...",
      ".........KKEEEEEEEEEEKKFFSJJK...",
      "........KEEEEEEEEEEEEEEKSJJK....",
      ".......KEEEEELLLLLLLLLLEKJK.....",
      "......KEEEELLKKKKKKLLLLLLK......",
      ".....KEEEELKKJWKKRRKKLLLLLK.....",
      "....KEEEEKKJWWWKKRRRRKKLLLNK....",
      "...KEEEELKWWWWWKKRRRRRKLLLNNK...",
      "...KEEELKJWWWWWKKRRRRRRKLLLNK...",
      "...KEELKJWWWWWWKKRRRRRRWKLLNK...",
      "..KEEELKWWWWWWWKKRRRRRRRKLLNNK..",
      "..KEEELKWWWWWWWKKRRRRRRRKLLNNK..",
      "..KEELKJWWWWWWWWKRRRRRRRWKLNNK..",
      "..KEELKKWWWWWWKKKKRRRRRRKKLNNK..",
      "..KEELKKWWWWWWWKKWRRRRRRKKLNNK..",
      "..KEELLKWWWWWWWWWWWRRRRRKLNNNK..",
      "..KEELLKWWWWWWWWWWWWWRRRKLNNNK..",
      "...KELLKWWWWWWWWWWWWWWWFKLNNK...",
      "...KELLLKWWWWWWWWWWWWWFKLNNNK...",
      "...KEELLLKWWWWWWWWWWWWKLNNNNK...",
      "....KELLLKKWWWWWWWWWFKKNNNNK....",
      ".....KLLLLLKKWWWWWFKKLNNNNK.....",
      "......KLLLLLLKKKKKKLLNNNNK......",
      ".......KNLLLLLLLLLLNNNNNK.......",
      "........KNNNNNNNNNNNNNNK........",
      ".........KKNNNNNNNNNNKK.........",
      "...........KKKKKKKKKK..........."],
    // Bland — two crossing arrows: mixed / shuffled modes
    bland: [
      "................................",
      "................................",
      "................................",
      "................................",
      "...K............................",
      "..KAKK..............KKKKKKK.....",
      ".KAAOAK..........KKKEEEEEENK....",
      ".KAOOOOK........KEEEELLLLNNK....",
      "..KOOOOOK........KLLLLLLLNK.....",
      "...KOOOOOK........KLLLLLLNK.....",
      "....KOOOOOKK.....KKELLLLNNK.....",
      ".....KDOOOOAK...KEEELLLLNK......",
      "......KKOOOOOK.KEELNNLLLNK......",
      "........KOOOOOKEELNNKKLNNK......",
      ".........KOOKKEELNNK..KNK.......",
      "..........KKEEELNNK....K........",
      "..........KEELNNNKK....K........",
      ".........KEELNNKKOOK..KAK.......",
      "........KEELNNKOOOOOKKAADK......",
      "......KKEELNNK.KOOOOOAAODK......",
      ".....KEEENNNK...KDOOOOOOOK......",
      "....KEELNNKK.....KKOOOOOODK.....",
      "...KEELNNK........KAOOOOODK.....",
      "..KEELNNK........KAAOOOOOOK.....",
      ".KEELNNK........KDDOOOOOOODK....",
      ".KENNNK..........KKKDDDDDDDK....",
      "..KNKK..............KKKKKKK.....",
      "...K............................",
      "................................",
      "................................",
      "................................",
      "................................"],
    // Statistik — bar chart: progress / stats
    statistik: [
      "................................",
      "................................",
      "................................",
      "......................KKKKK.....",
      ".....................KWWAADK....",
      ".....................KAOOODK....",
      ".....................KAOOODK....",
      ".....................KAOOODK....",
      "................KKKKKKAOOODK....",
      "...............KCCCCMKAOOODK....",
      "...............KCYYYMKAOOODK....",
      "...............KCYYYMKAOOODK....",
      "...............KCYYYMKAOOODK....",
      "..........KKKKKKCYYYMKAOOODK....",
      ".........KWCCCCKCYYYMKAOOODK....",
      ".........KCGGGGKCYYYMKAOOODK....",
      ".........KCGGGGKCYYYMKAOOODK....",
      ".........KCGGGGKCYYYMKAOOODK....",
      "....KKKKKKCGGGGKCYYYMKAOOODK....",
      "...KWEEENKCGGGGKCYYYMKAOOODK....",
      "...KELLLNKCGGGGKCYYYMKAOOODK....",
      "...KELLLNKCGGGGKCYYYMKAOOODK....",
      "...KELLLNKCGGGGKCYYYMKAOOODK....",
      "...KELLLNKCGGGGKCYYYMKAOOODK....",
      "...KELLLNKCGGGGKCYYYMKAOOODK....",
      "...KELLLNKCGGGGKCYYYMKAOOODK....",
      "..KKNNNNNKCGGGGKMMMMMKDDDDDKKK..",
      ".KFFKKKKKFKKKKKFKKKKKFKKKKKFFJK.",
      ".KFSSSSSSSSSSSSSSSSSSSSSSSSSSJK.",
      ".KJJJJJJJJJJJJJJJJJJJJJJJJJJJJK.",
      "..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..",
      "................................"],
    // Vend — card with a turn arrow: flip / memory modes
    vend: [
      "................................",
      "................................",
      "........KKKKKKKKKKKKKK..........",
      ".......KEEEEEEEEEEEEENK.........",
      ".......KELLLLLLLLLLLLNK.........",
      ".......KELLLLLLLLLLLLNK.........",
      ".......KELLLELELELELLNK.........",
      ".......KELLLLLLLLLLLLNK.........",
      ".......KELLELELELELELNK.........",
      ".......KELLLLLWWLLLLLNK.........",
      ".......KELLLELWWELELLNK.........",
      ".......KELLLLLWWLLLLLNK.........",
      ".......KELLELEWWLELELNK.........",
      ".......KELLLLLLLLLLLLNK.........",
      ".......KELLLELELELELLNK.KK......",
      ".......KELLLLLLLLLLLLNKKADK.....",
      ".......KELLELELELELELNKKAOK.....",
      ".......KELLLLLLLLLLLLNKAAODK....",
      ".......KNNNNNNNNNNNNNNKAOOOK....",
      ".....KKKKKKKKKKKKKKKKKAAODDDK...",
      "....KAAADK...........KAOODKK....",
      "....KAOODK...........KAODDK.....",
      ".....KOOOK...........KAODK......",
      ".....KAOOOK.........KAADDK......",
      "......KOOOOK.......KAAODK.......",
      "......KAOOOOKKKKKKKAAODDK.......",
      ".......KOOOOOAAAAAAAODDK........",
      "........KDOOOOOOOOODDDK.........",
      ".........KKDOOOOODDDKK..........",
      "...........KKDDDDDKK............",
      ".............KKKKK..............",
      "................................"]
  };

  function spriteSVG(name, scale, label) {
    var g = SPR[name]; if (!g) return "";
    scale = scale || 4;
    var h = g.length, w = g[0].length, out = "", y, x, c, run, start;
    if (w >= 32) scale = Math.max(1, Math.round(scale / 2));   // 32px icons keep the footprint of 16px sprites
    for (y = 0; y < h; y++) {
      x = 0;
      while (x < w) {
        c = g[y].charAt(x);
        if (c === "." || !PAL[c]) { x++; continue; }
        start = x; run = c;
        while (x < w && g[y].charAt(x) === run) x++;
        out += '<rect x="' + start + '" y="' + y + '" width="' + (x - start) + '" height="1" fill="' + PAL[c] + '"/>';
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '" width="' + w * scale + '" height="' + h * scale + '" shape-rendering="crispEdges"' +
      (label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true" focusable="false"') + ">" + out + "</svg>";
  }
  function sprite(name, opts) {
    opts = opts || {};
    var s = doc.createElement("span");
    s.className = "sd-sprite" + (opts.cls ? " " + opts.cls : "");
    s.innerHTML = spriteSVG(name, opts.scale, opts.label);
    return s;
  }
  // <span data-sd-sprite="polle" data-scale="6" class="sd-bob"></span>
  function hydrateSprites(scope) {
    var els = (scope || doc).querySelectorAll("[data-sd-sprite]:not([data-sd-done])");
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      e.classList.add("sd-sprite");
      e.innerHTML = spriteSVG(e.getAttribute("data-sd-sprite"), parseInt(e.getAttribute("data-scale"), 10) || 4, e.getAttribute("data-label"));
      e.setAttribute("data-sd-done", "1");
    }
  }

  /* ---------------------------------------------------------- preloader */
  var pre = null, preState = { start: Date.now(), full: false, target: 0, shown: 0, done: false, holds: [], note: "", failed: 0 };
  var SEEN = "sd:intro-seen";
  function buildPre() {
    var full = !store(true, SEEN) && !reduced();
    var quick = !full;
    preState.full = full;
    pre = doc.createElement("div");
    pre.className = "sd-pre" + (quick ? " is-quick" : "");
    pre.setAttribute("role", "status");
    pre.setAttribute("aria-live", "polite");
    pre.setAttribute("aria-label", "Indlæser Sjovt Dansk");
    var h = "";
    if (full && !reduced()) {
      var rows = Math.max(4, Math.ceil((win.innerHeight || 800) / ((win.innerWidth || 1200) * 0.094 * 1.5)) + 1);
      h += '<div class="sd-pre-rows" aria-hidden="true">';
      for (var r = 0; r < rows; r++) h += '<div class="sd-pre-row"><span>SJOVT DANSK SJOVT DANSK SJOVT DANSK SJOVT DANSK&nbsp;</span></div>';
      h += "</div>";
    }
    h += '<div class="sd-pre-mini" aria-hidden="true">' + '<span class="sd-sprite ' + (reduced() ? "" : "sd-hop") + '">' + spriteSVG("polle", 6) + "</span></div>";
    h += '<div class="sd-pre-card"><span class="sd-sprite ' + (reduced() ? "" : "sd-hop") + '" aria-hidden="true">' + spriteSVG("polle", 6) + "</span>" +
      '<div class="sd-pre-title">SJOVT <b>DANSK</b></div>' +
      '<div class="sd-pre-bar" aria-hidden="true">' + new Array(13).join("<i></i>") + "</div>" +
      '<div class="sd-pre-meta"><span>INDLÆSER</span><span class="sd-pre-pct">0%</span></div>' +
      '<div class="sd-pre-note"></div></div>';
    pre.innerHTML = h;
    root.appendChild(pre);
  }
  function paintProgress() {
    if (!pre) return;
    var segs = pre.querySelectorAll(".sd-pre-bar i"), n = Math.round(preState.shown / 100 * segs.length), i;
    for (i = 0; i < segs.length; i++) segs[i].className = i < n ? "on" : "";
    var p = pre.querySelector(".sd-pre-pct"); if (p) p.textContent = Math.round(preState.shown) + "%";
    var nt = pre.querySelector(".sd-pre-note"); if (nt) nt.textContent = preState.note;
  }
  function tick() {
    if (!pre || preState.done) return;
    preState.shown += Math.max(1, (preState.target - preState.shown) * 0.2);
    if (preState.shown > preState.target) preState.shown = preState.target;
    paintProgress();
    win.requestAnimationFrame ? win.requestAnimationFrame(tick) : win.setTimeout(tick, 40);
  }
  function finishPre() {
    if (!pre || preState.done) return;
    preState.done = true;
    preState.target = preState.shown = 100; paintProgress();
    store(false, SEEN, "1");
    var node = pre;
    node.classList.add("is-out");
    root.classList.add("sd-ready");
    var kill = function () { if (node.parentNode) node.parentNode.removeChild(node); };
    node.addEventListener("transitionend", kill);
    win.setTimeout(kill, 800);
  }
  function whenAll() {
    var minMs = preState.full ? 900 : 120;
    var maxMs = 6000, parts = [];
    // 1) DOM + subresources
    parts.push(new Promise(function (res) {
      function chk() { if (doc.readyState === "interactive") preState.target = Math.max(preState.target, 45);
                       if (doc.readyState === "complete") { preState.target = Math.max(preState.target, 80); res(); } }
      if (doc.readyState === "complete") { preState.target = 80; res(); }
      else { doc.addEventListener("readystatechange", chk); win.addEventListener("load", function () { chk(); res(); }); chk(); }
    }));
    // 2) fonts (never rejects: on failure we proceed with the monospace fallback)
    if (doc.fonts && doc.fonts.ready) {
      var fp = Promise.race([doc.fonts.ready, new Promise(function (r) { win.setTimeout(r, 2500); })]);
      parts.push(fp.then(function () { preState.target = Math.max(preState.target, 92); }).catch(function () {}));
      try { doc.fonts.load('16px "SD Mono"'); doc.fonts.load('16px "SD Pixel"'); } catch (e) {}
    }
    // 3) failed assets are noted, never block
    win.addEventListener("error", function (ev) {
      var t = ev.target; if (t && t !== win && /^(LINK|SCRIPT|IMG)$/.test(t.tagName || "")) { preState.failed++; preState.note = "Nogle filer kunne ikke hentes — fortsætter"; }
    }, true);
    // 4) pages can hold the curtain while their own data initialises
    var started = Date.now();
    Promise.all(parts).then(function () { return Promise.all(preState.holds); }).catch(function () {})
      .then(function () {
        var wait = Math.max(0, minMs - (Date.now() - preState.start));
        win.setTimeout(finishPre, wait);
      });
    win.setTimeout(function () { if (!preState.done) { preState.note = "Det tager lidt længere end ventet…"; } }, 3500);
    win.setTimeout(finishPre, maxMs);   // hard failsafe — never trap the learner behind the curtain
  }

  /* ------------------------------------------- leaving: pixel curtain on link clicks */
  function installTransitions() {
    doc.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.hasAttribute("data-sd-nofx")) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|javascript:)/i.test(href)) return;
      var url; try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      if (reduced()) return;                       // reduced motion: plain, instant navigation
      e.preventDefault();
      var c = doc.createElement("div");
      c.className = "sd-pre is-quick is-in"; c.setAttribute("aria-hidden", "true");
      c.innerHTML = '<div class="sd-pre-mini"><span class="sd-sprite sd-hop">' + spriteSVG("polle", 6) + "</span></div>";
      root.appendChild(c);
      void c.offsetWidth; c.classList.add("go");
      var go = function () { location.href = a.href; };
      win.setTimeout(go, 230);
      win.setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 1500);   // if navigation is blocked
    }, true);
    win.addEventListener("pageshow", function (e) {
      if (e.persisted) { var all = doc.querySelectorAll(".sd-pre"); for (var i = 0; i < all.length; i++) all[i].parentNode.removeChild(all[i]); }
    });
  }

  /* ----------------------------------------------------- game chrome bar */
  function buildBar() {
    if (root.hasAttribute("data-sd-nobar") || doc.body.hasAttribute("data-sd-home")) return;
    var logo = '<span class="sd-bar-logo">' + '<span class="sd-sprite">' + spriteSVG("polle", 2) + '</span><span class="t">SJOVT <b>DANSK</b></span></span>';
    var controls = '<button type="button" class="sd-bar-btn" id="sd-theme-btn" aria-label="Mørk tilstand" title="Skift mellem lys og mørk tilstand">MØRK</button>' +
      '<button type="button" class="sd-bar-btn" id="sd-sound-btn" aria-label="Lydeffekter" title="Slå lydeffekter til eller fra (oplæsning med Lyt er upåvirket)">LYD</button>';
    var bar = doc.querySelector(".sd-bar");
    if (bar && bar.hasAttribute("data-sd-static")) {
      /* Page ships a plain-HTML bar (crawlable home link); add the sprite logo and the controls. */
      if (!bar.querySelector(".sd-bar-logo")) bar.insertAdjacentHTML("beforeend", logo);
      bar.insertAdjacentHTML("beforeend", controls);
    } else if (bar) {
      return;
    } else {
      bar = doc.createElement("nav");
      bar.className = "sd-bar"; bar.setAttribute("aria-label", "Sjovt Dansk");
      bar.innerHTML = '<a class="sd-bar-home" href="' + homeUrl + '"><span class="sd-arr" aria-hidden="true"></span>MENU</a>' + logo + controls;
      doc.body.insertBefore(bar, doc.body.firstChild);
    }
    var tb = bar.querySelector("#sd-theme-btn"), sb = bar.querySelector("#sd-sound-btn");
    function paint() {
      tb.setAttribute("aria-pressed", String(themeIsDark()));
      var on = soundOn(); sb.setAttribute("aria-pressed", String(on)); sb.textContent = on ? "LYD" : "LYD ✗";
    }
    tb.addEventListener("click", function () { theme.toggle(); });
    sb.addEventListener("click", function () { sound.toggle(); });
    win.addEventListener("sd:themechange", paint); win.addEventListener("sd:soundchange", paint);
    win.addEventListener("storage", function (e) { if (e.key === THEME_KEY) { applyTheme(); paint(); } else if (e.key === SOUND_KEY) paint(); });
    paint();
    // --sd-bar-h = the rendered bar height (it can grow if the bar wraps on narrow screens)
    function measureBar() { var h = Math.round(bar.getBoundingClientRect().height); if (h > 0) root.style.setProperty("--sd-bar-h", h + "px"); }
    measureBar();
    if (win.ResizeObserver) new win.ResizeObserver(measureBar).observe(bar); else win.addEventListener("resize", measureBar);
  }

  /* ----------------------------------------------------------------- fx */
  var COLORS = ["#F94F37", "#FFC25A", "#FD9E4F", "#FFFFFF", "#E1AD12", "#2B3FD6"];
  function restart(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  var fx = {
    correct: function (el) { restart(el, "sd-fx-correct"); if (el) fx.burst(el, 8); },
    wrong:   function (el) { restart(el, "sd-fx-wrong"); },
    bump:    function (el) { restart(el, "sd-fx-bump"); },
    enter:   function (el) { restart(el, "sd-enter"); },
    burst: function (el, n) {
      if (reduced() || !el || !el.getBoundingClientRect) return;
      var r = el.getBoundingClientRect(), b = doc.createElement("div"), i;
      b.className = "sd-burst"; b.style.left = (r.left + r.width / 2) + "px"; b.style.top = (r.top + r.height / 2) + "px";
      for (i = 0; i < (n || 8); i++) { var p = doc.createElement("i"), ang = (Math.PI * 2 * i) / (n || 8), d = 28 + (i % 3) * 14;
        p.style.setProperty("--dx", Math.round(Math.cos(ang) * d) + "px"); p.style.setProperty("--dy", Math.round(Math.sin(ang) * d) + "px");
        p.style.setProperty("--c", COLORS[i % COLORS.length]); b.appendChild(p); }
      doc.body.appendChild(b); win.setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 600);
    },
    confetti: function (count) {
      if (reduced()) return;
      var c = doc.createElement("div"), i; c.className = "sd-conf"; c.setAttribute("aria-hidden", "true");
      for (i = 0; i < Math.min(count || 36, 60); i++) { var p = doc.createElement("i");
        p.style.left = (Math.random() * 100) + "%"; p.style.setProperty("--c", COLORS[i % COLORS.length]);
        p.style.setProperty("--dx", Math.round((Math.random() - .5) * 160) + "px"); p.style.setProperty("--r", Math.round(Math.random() * 360) + "deg");
        p.style.setProperty("--t", (1.1 + Math.random() * 0.9).toFixed(2) + "s"); p.style.animationDelay = (Math.random() * 0.4).toFixed(2) + "s"; c.appendChild(p); }
      doc.body.appendChild(c); win.setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 2600);
    },
    celebrate: function () { fx.confetti(40); }
  };

  // Watch elements that games show/hide (class / hidden / style) and play a short enter animation.
  //   Sjovt.watchScreens(".screen, .view, [data-screen]")
  function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
  function watchScreens(selector) {
    if (!win.MutationObserver) return;
    var last = new WeakMap();
    function scan() {
      var els = doc.querySelectorAll(selector);
      for (var i = 0; i < els.length; i++) { var v = visible(els[i]); if (v && last.get(els[i]) === false) fx.enter(els[i]); last.set(els[i], v); }
    }
    scan();
    new MutationObserver(function () { win.requestAnimationFrame(scan); })
      .observe(doc.body, { attributes: true, subtree: true, attributeFilter: ["class", "hidden", "style"] });
  }

  /* ------------------------------------------------------------- boot */
  buildPre();
  tick();
  whenAll();
  installTransitions();
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", onReady); else onReady();
  function onReady() { buildBar(); hydrateSprites(); }

  win.Sjovt = {
    sprite: sprite, spriteSVG: spriteSVG, hydrate: hydrateSprites, sprites: Object.keys(SPR), fx: fx,
    watchScreens: watchScreens, reduced: reduced, homeUrl: homeUrl, theme: theme, sound: sound,
    hold: function (p) { preState.holds.push(Promise.resolve(p).catch(function () {})); },   // keep curtain until p settles
    ready: function () { finishPre(); }
  };
})();
